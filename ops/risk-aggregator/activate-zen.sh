#!/usr/bin/env bash
set -Eeuo pipefail

if [ "${EUID}" -ne 0 ]; then
  echo "Ce script doit être lancé avec sudo." >&2
  exit 2
fi
if [ "$#" -ne 3 ] || [[ ! "$1" =~ ^[a-f0-9]{40}$ ]]; then
  echo "Usage: sudo $0 <revision-l0g> <builder-energie-stage> <repertoire-dette-stage>" >&2
  exit 2
fi

REVISION="$1"
ENERGY_STAGE="$2"
DEBT_STAGE="$3"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MANIFEST="${SCRIPT_DIR}/producer-deployment.json"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
BACKUP="/var/backups/risk-producers-${STAMP}"
WORK="$(mktemp -d)"
trap 'rm -rf -- "$WORK"' EXIT

expected_hash() {
  python3 -c \
    'import json,sys; d=json.load(open(sys.argv[1])); print(next(f["sha256"] for f in d["producers"][sys.argv[2]]["files"] if f["path"] == sys.argv[3]))' \
    "$MANIFEST" "$1" "$2"
}

check_stage() {
  local producer="$1" active="$2" staged="$3" expected actual
  if [ ! -f "$staged" ]; then
    echo "Fichier de staging absent : ${staged}" >&2
    exit 1
  fi
  expected="$(expected_hash "$producer" "$active")"
  actual="$(sha256sum "$staged" | awk '{print $1}')"
  if [ "$actual" != "$expected" ]; then
    echo "SHA-256 inattendu pour ${staged}" >&2
    exit 1
  fi
}

for debt_file in latest_export.py catalog.py data.py; do
  check_stage debt "/opt/debt-risk-radar/${debt_file}" "${DEBT_STAGE}/${debt_file}"
done
check_stage energie /opt/energie/builder.py "$ENERGY_STAGE"

install -d -o root -g root -m 0700 "$BACKUP"
install -d -o root -g root -m 0700 "${BACKUP}/energie" "${BACKUP}/debt"
cp -a /opt/energie/builder.py "${BACKUP}/energie/builder.py"
cp -a /opt/debt-risk-radar/latest_export.py /opt/debt-risk-radar/catalog.py \
  /opt/debt-risk-radar/data.py "${BACKUP}/debt/"
cp -a /var/www/debt-risk-radar/latest.json "${BACKUP}/debt/latest.json"

echo "1/3 Mise à niveau du producteur énergie"
PYTHONPYCACHEPREFIX="${WORK}/pycache-energy" \
  /opt/energie/venv/bin/python3 -m py_compile "$ENERGY_STAGE"
install -o root -g energie -m 0750 "$ENERGY_STAGE" /opt/energie/builder.py
if ! systemctl restart energie-snapshot.service || \
   [ "$(systemctl show energie-snapshot.service -p Result --value)" != "success" ] || \
   ! python3 -c 'import json; d=json.load(open("/var/www/html/energie/snapshot.json")); assert d.get("generated"); assert all((d.get("series") or {}).get(k, {}).get("date") for k in ("brent", "wti"))'; then
  echo "Échec énergie : restauration" >&2
  cp -a "${BACKUP}/energie/builder.py" /opt/energie/builder.py
  systemctl restart energie-snapshot.service
  exit 1
fi

echo "2/3 Mise à niveau du producteur dette"
PYTHONPYCACHEPREFIX="${WORK}/pycache-debt" \
  /opt/debt-risk-radar/.venv/bin/python -m py_compile \
  "${DEBT_STAGE}/latest_export.py" "${DEBT_STAGE}/catalog.py" "${DEBT_STAGE}/data.py"
for debt_file in latest_export.py catalog.py data.py; do
  install -o root -g root -m 0644 "${DEBT_STAGE}/${debt_file}" "/opt/debt-risk-radar/${debt_file}"
done
if ! systemctl restart debt-risk-radar-export.service || \
   [ "$(systemctl show debt-risk-radar-export.service -p Result --value)" != "success" ] || \
   ! python3 -c 'import json; d=json.load(open("/var/www/debt-risk-radar/latest.json")); assert d.get("generated_at"); assert isinstance((d.get("score") or {}).get("coverage"), (int, float))'; then
  echo "Échec dette : restauration" >&2
  cp -a "${BACKUP}/debt/latest_export.py" "${BACKUP}/debt/catalog.py" \
    "${BACKUP}/debt/data.py" /opt/debt-risk-radar/
  cp -a "${BACKUP}/debt/latest.json" /var/www/debt-risk-radar/latest.json
  systemctl restart debt-risk-radar-export.service
  exit 1
fi

echo "3/3 Activation de l’agrégateur versionné"
"${SCRIPT_DIR}/install-server.sh" "$REVISION"
echo "Producteurs et agrégateur activés. Sauvegarde producteurs : ${BACKUP}"
