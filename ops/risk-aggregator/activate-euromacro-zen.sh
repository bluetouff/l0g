#!/usr/bin/env bash
set -Eeuo pipefail

if [ "${EUID}" -ne 0 ]; then
  echo "Ce script doit être lancé avec sudo." >&2
  exit 2
fi
if [ "$#" -ne 2 ] || [[ ! "$1" =~ ^[a-f0-9]{40}$ ]]; then
  echo "Usage: sudo $0 <revision-l0g> <build-snapshot-euro-stage>" >&2
  exit 2
fi

REVISION="$1"
EURO_STAGE="$2"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MANIFEST="${SCRIPT_DIR}/producer-deployment.json"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
BACKUP="/var/backups/euromacro-timestamp-${STAMP}"
WORK="$(mktemp -d)"
ROLLED_BACK=0

cleanup() {
  rm -rf -- "$WORK"
}
trap cleanup EXIT

expected_hash() {
  python3 -c \
    'import json,sys; d=json.load(open(sys.argv[1])); print(next(f["sha256"] for f in d["producers"]["eu"]["files"] if f["path"] == "/opt/euromacro/build_snapshot.py"))' \
    "$MANIFEST"
}

if [ ! -f "$EURO_STAGE" ]; then
  echo "Fichier de staging absent : ${EURO_STAGE}" >&2
  exit 1
fi
EXPECTED="$(expected_hash)"
ACTUAL="$(sha256sum "$EURO_STAGE" | awk '{print $1}')"
if [ "$ACTUAL" != "$EXPECTED" ]; then
  echo "SHA-256 inattendu pour ${EURO_STAGE}" >&2
  exit 1
fi

install -d -o root -g root -m 0700 \
  "$BACKUP/opt" "$BACKUP/web"
cp -a /opt/euromacro/build_snapshot.py /opt/euromacro/snapshot.js \
  /opt/euromacro/snapshot.json "$BACKUP/opt/"
cp -a /var/www/html/euromacro/snapshot.js \
  /var/www/html/euromacro/snapshot.json "$BACKUP/web/"

rollback() {
  local status=$?
  if [ "$ROLLED_BACK" -eq 1 ]; then
    exit "$status"
  fi
  ROLLED_BACK=1
  trap - ERR
  set +e
  echo "Échec : restauration du producteur Euro" >&2
  cp -a "$BACKUP/opt/build_snapshot.py" /opt/euromacro/build_snapshot.py
  cp -a "$BACKUP/opt/snapshot.js" "$BACKUP/opt/snapshot.json" /opt/euromacro/
  cp -a "$BACKUP/web/snapshot.js" "$BACKUP/web/snapshot.json" /var/www/html/euromacro/
  echo "Restauration terminée. Sauvegarde : ${BACKUP}" >&2
  exit "$status"
}
trap rollback ERR

echo "1/2 Activation du timestamp UTC explicite du producteur Euro"
PYTHONPYCACHEPREFIX="$WORK/pycache-euro" \
  /opt/euromacro/.venv/bin/python -m py_compile "$EURO_STAGE"
install -o euromacro -g euromacro -m 0664 "$EURO_STAGE" /opt/euromacro/build_snapshot.py
systemctl restart euromacro-snapshot.service
if [ "$(systemctl show euromacro-snapshot.service -p Result --value)" != "success" ]; then
  echo "Échec de la régénération Euro" >&2
  exit 1
fi
python3 -c \
  'import datetime,json,re; d=json.load(open("/var/www/html/euromacro/snapshot.json")); v=d.get("generated_at", ""); assert re.fullmatch(r"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z", v); assert datetime.datetime.fromisoformat(v.replace("Z", "+00:00")).utcoffset() == datetime.timedelta(0)'

echo "2/2 Activation de l’agrégateur avec provenance Euro vérifiable"
"${SCRIPT_DIR}/install-server.sh" "$REVISION"

echo "Producteur Euro et agrégateur activés. Sauvegarde : ${BACKUP}"
trap - ERR
