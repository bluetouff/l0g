#!/usr/bin/env bash
set -Eeuo pipefail

if [ "${EUID}" -ne 0 ]; then
  echo "Ce script doit être lancé avec sudo." >&2
  exit 2
fi
if [ "$#" -ne 2 ] || [[ ! "$1" =~ ^[a-f0-9]{40}$ ]]; then
  echo "Usage: sudo $0 <revision-l0g> <repertoire-release-euro>" >&2
  exit 2
fi

REVISION="$1"
EURO_STAGE="$2"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MANIFEST="${SCRIPT_DIR}/producer-deployment.json"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
BACKUP="/var/backups/euromacro-release-${STAMP}"
WORK="$(mktemp -d)"
ROLLED_BACK=0
HAD_DEPLOYED_SHA=0
HAD_ATTESTED_SHA=0
TIMER_WAS_ACTIVE=0
RUNTIME_FILES=(
  build_snapshot.py
  catalog.py
  data.py
  snapshot_contract.py
  validate_snapshot.py
  requirements-prod.txt
  deploy/refresh.sh
)

cleanup() {
  rm -rf -- "$WORK"
}
trap cleanup EXIT

expected_revision() {
  python3 -c \
    'import json,sys; print(json.load(open(sys.argv[1]))["producers"]["eu"]["revision"])' \
    "$MANIFEST"
}

expected_hash() {
  python3 -c \
    'import json,sys; d=json.load(open(sys.argv[1])); p="/opt/euromacro/" + sys.argv[2]; print(next(f["sha256"] for f in d["producers"]["eu"]["files"] if f["path"] == p))' \
    "$MANIFEST" "$1"
}

if [ ! -d "$EURO_STAGE" ] || [ -L "$EURO_STAGE" ]; then
  echo "Répertoire de staging Euro absent ou symbolique : ${EURO_STAGE}" >&2
  exit 1
fi
EXPECTED_REVISION="$(expected_revision)"

echo "1/3 Vérification intégrale de la release Euro en staging"
for relative in "${RUNTIME_FILES[@]}"; do
  source="${EURO_STAGE}/${relative}"
  if [ ! -f "$source" ] || [ -L "$source" ]; then
    echo "Fichier de staging Euro absent ou symbolique : ${source}" >&2
    exit 1
  fi
  expected="$(expected_hash "$relative")"
  actual="$(sha256sum "$source" | awk '{print $1}')"
  if [ "$actual" != "$expected" ]; then
    echo "SHA-256 inattendu pour ${source}" >&2
    exit 1
  fi
done

install -d -o root -g root -m 0700 \
  "$BACKUP/opt/deploy" "$BACKUP/web"
for relative in "${RUNTIME_FILES[@]}"; do
  [ -f "/opt/euromacro/${relative}" ] || {
    echo "Fichier Euro actif absent : /opt/euromacro/${relative}" >&2
    exit 1
  }
  cp -a "/opt/euromacro/${relative}" "$BACKUP/opt/${relative}"
done
if [ -f /opt/euromacro/DEPLOYED_SHA ]; then
  cp -a /opt/euromacro/DEPLOYED_SHA "$BACKUP/opt/DEPLOYED_SHA"
  HAD_DEPLOYED_SHA=1
fi
if [ -f /opt/euromacro/L0G_ATTESTED_SHA ]; then
  cp -a /opt/euromacro/L0G_ATTESTED_SHA "$BACKUP/opt/L0G_ATTESTED_SHA"
  HAD_ATTESTED_SHA=1
fi
cp -a /opt/euromacro/snapshot.js /opt/euromacro/snapshot.json "$BACKUP/opt/"
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
  for relative in "${RUNTIME_FILES[@]}"; do
    cp -a "$BACKUP/opt/${relative}" "/opt/euromacro/${relative}"
  done
  if [ "$HAD_DEPLOYED_SHA" -eq 1 ]; then
    cp -a "$BACKUP/opt/DEPLOYED_SHA" /opt/euromacro/DEPLOYED_SHA
  else
    rm -f /opt/euromacro/DEPLOYED_SHA
  fi
  if [ "$HAD_ATTESTED_SHA" -eq 1 ]; then
    cp -a "$BACKUP/opt/L0G_ATTESTED_SHA" /opt/euromacro/L0G_ATTESTED_SHA
  else
    rm -f /opt/euromacro/L0G_ATTESTED_SHA
  fi
  cp -a "$BACKUP/opt/snapshot.js" "$BACKUP/opt/snapshot.json" /opt/euromacro/
  cp -a "$BACKUP/web/snapshot.js" "$BACKUP/web/snapshot.json" /var/www/html/euromacro/
  systemctl restart euromacro-snapshot.service >/dev/null 2>&1 || true
  if [ "$TIMER_WAS_ACTIVE" -eq 1 ]; then
    systemctl start euromacro-snapshot.timer >/dev/null 2>&1 || true
  fi
  echo "Restauration terminée. Sauvegarde : ${BACKUP}" >&2
  exit "$status"
}
trap rollback ERR

echo "2/3 Activation atomique du code Euro attesté"
PYTHONPYCACHEPREFIX="$WORK/pycache-euro" \
  /opt/euromacro/.venv/bin/python -m py_compile \
  "$EURO_STAGE/build_snapshot.py" \
  "$EURO_STAGE/catalog.py" \
  "$EURO_STAGE/data.py" \
  "$EURO_STAGE/snapshot_contract.py" \
  "$EURO_STAGE/validate_snapshot.py"
if systemctl is-active --quiet euromacro-snapshot.timer; then
  TIMER_WAS_ACTIVE=1
  systemctl stop euromacro-snapshot.timer
fi
systemctl stop euromacro-snapshot.service
for relative in build_snapshot.py catalog.py data.py snapshot_contract.py validate_snapshot.py requirements-prod.txt; do
  install -o euromacro -g euromacro -m 0644 \
    "$EURO_STAGE/$relative" "/opt/euromacro/$relative"
done
install -o euromacro -g euromacro -m 0755 \
  "$EURO_STAGE/deploy/refresh.sh" /opt/euromacro/deploy/refresh.sh
printf '%s\n' "$EXPECTED_REVISION" >"$WORK/DEPLOYED_SHA"
install -o euromacro -g euromacro -m 0644 \
  "$WORK/DEPLOYED_SHA" /opt/euromacro/DEPLOYED_SHA
install -o root -g root -m 0644 \
  "$WORK/DEPLOYED_SHA" /opt/euromacro/L0G_ATTESTED_SHA
systemctl restart euromacro-snapshot.service
if [ "$(systemctl show euromacro-snapshot.service -p Result --value)" != "success" ]; then
  echo "Échec de la régénération Euro" >&2
  false
fi
python3 -c \
  'import datetime,json,re,sys; d=json.load(open("/var/www/html/euromacro/snapshot.json")); v=d.get("generated_at", ""); assert re.fullmatch(r"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z", v); assert datetime.datetime.fromisoformat(v.replace("Z", "+00:00")).utcoffset() == datetime.timedelta(0); assert d.get("source_sha") == sys.argv[1]; assert (d.get("quality") or {}).get("status") == "ok"; assert isinstance(d.get("global_score"), (int, float))' \
  "$EXPECTED_REVISION"
if [ "$TIMER_WAS_ACTIVE" -eq 1 ]; then
  systemctl start euromacro-snapshot.timer
fi

echo "3/3 Activation de l’agrégateur avec provenance Euro vérifiable"
"${SCRIPT_DIR}/install-server.sh" "$REVISION"

echo "Producteur Euro et agrégateur activés. Sauvegarde : ${BACKUP}"
trap - ERR
