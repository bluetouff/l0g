#!/usr/bin/env bash
set -Eeuo pipefail

if [ "${EUID}" -ne 0 ]; then
  echo "Ce script doit être lancé avec sudo." >&2
  exit 2
fi
if [ "$#" -ne 1 ] || [[ ! "$1" =~ ^[a-f0-9]{40}$ ]]; then
  echo "Usage: sudo $0 <revision-git-l0g-40-caracteres>" >&2
  exit 2
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REVISION="$1"
SHORT_REVISION="${REVISION:0:12}"
MANIFEST="${SCRIPT_DIR}/producer-deployment.json"
VERIFY_PRODUCERS="${SCRIPT_DIR}/verify-producer-deployment.py"
VERIFY_OUTPUT="${SCRIPT_DIR}/verify-risk-output.py"
RELEASE="/usr/local/lib/l0g-risk-${SHORT_REVISION}"
CURRENT_LINK="/usr/local/lib/l0g-risk"
DROPIN_DIR="/etc/systemd/system/l0g-risk.service.d"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
BACKUP="/var/backups/l0g-risk-${STAMP}"
WORK="$(mktemp -d)"
ROLLED_BACK=0

cleanup() {
  rm -rf -- "$WORK"
}
trap cleanup EXIT

for required in l0g-risk.py api-build.py risk_history.py backfill_history.py \
  l0g-risk.service l0g-risk.timer producer-deployment.json \
  verify-producer-deployment.py verify-risk-output.py; do
  if [ ! -f "${SCRIPT_DIR}/${required}" ]; then
    echo "Fichier de release absent : ${required}" >&2
    exit 1
  fi
done

if [ -e "$CURRENT_LINK" ] && [ ! -L "$CURRENT_LINK" ]; then
  echo "STOP : ${CURRENT_LINK} existe et n’est pas un lien symbolique." >&2
  exit 1
fi

echo "1/6 Vérification des producteurs réellement activés"
python3 "$VERIFY_PRODUCERS" "$MANIFEST"

install -d -o root -g root -m 0700 "$BACKUP"
for path in \
  /etc/systemd/system/l0g-risk.service \
  /etc/systemd/system/l0g-risk.timer \
  "${DROPIN_DIR}/98-revisions.conf" \
  "${DROPIN_DIR}/99-versioned-paths.conf"; do
  label="$(printf '%s' "$path" | sed 's#/#__#g')"
  if [ -e "$path" ]; then
    cp -a "$path" "${BACKUP}/${label}"
    : >"${BACKUP}/${label}.present"
  fi
done
if [ -d /var/www/l0g-data ]; then
  cp -a /var/www/l0g-data "${BACKUP}/l0g-data"
fi

OLD_LINK_TARGET=""
if [ -L "$CURRENT_LINK" ]; then
  OLD_LINK_TARGET="$(readlink "$CURRENT_LINK")"
fi

restore_path() {
  local path="$1"
  local label
  label="$(printf '%s' "$path" | sed 's#/#__#g')"
  if [ -e "${BACKUP}/${label}.present" ]; then
    cp -a "${BACKUP}/${label}" "$path"
  else
    rm -f -- "$path"
  fi
}

rollback() {
  local status=$?
  if [ "$ROLLED_BACK" -eq 1 ]; then
    exit "$status"
  fi
  ROLLED_BACK=1
  trap - ERR
  set +e
  echo "Échec : restauration de l’unité, des drop-ins, du lien et des données" >&2
  restore_path /etc/systemd/system/l0g-risk.service
  restore_path /etc/systemd/system/l0g-risk.timer
  restore_path "${DROPIN_DIR}/98-revisions.conf"
  restore_path "${DROPIN_DIR}/99-versioned-paths.conf"
  if [ -n "$OLD_LINK_TARGET" ]; then
    ln -sfn "$OLD_LINK_TARGET" "${CURRENT_LINK}.rollback"
    mv -Tf "${CURRENT_LINK}.rollback" "$CURRENT_LINK"
  else
    rm -f -- "$CURRENT_LINK"
  fi
  if [ -d "${BACKUP}/l0g-data" ]; then
    cp -a "${BACKUP}/l0g-data/." /var/www/l0g-data/
  fi
  systemctl daemon-reload
  systemctl restart l0g-risk.service
  echo "Restauration terminée. Sauvegarde : ${BACKUP}" >&2
  exit "$status"
}
trap rollback ERR

echo "2/6 Construction de la release immuable ${RELEASE}"
STAGED_RELEASE="${WORK}/release"
install -d -o root -g root -m 0755 "$STAGED_RELEASE"
for executable in l0g-risk.py api-build.py risk_history.py backfill_history.py \
  verify-producer-deployment.py verify-risk-output.py; do
  install -o root -g root -m 0755 "${SCRIPT_DIR}/${executable}" "${STAGED_RELEASE}/${executable}"
done
install -o root -g root -m 0644 "$MANIFEST" "${STAGED_RELEASE}/producer-deployment.json"
PYTHONPYCACHEPREFIX="${WORK}/pycache" python3 -m py_compile \
  "${STAGED_RELEASE}/l0g-risk.py" \
  "${STAGED_RELEASE}/api-build.py" \
  "${STAGED_RELEASE}/risk_history.py" \
  "${STAGED_RELEASE}/backfill_history.py" \
  "${STAGED_RELEASE}/verify-producer-deployment.py" \
  "${STAGED_RELEASE}/verify-risk-output.py"

if [ -e "$RELEASE" ]; then
  for file in l0g-risk.py api-build.py risk_history.py backfill_history.py \
    verify-producer-deployment.py verify-risk-output.py producer-deployment.json; do
    cmp --silent "${STAGED_RELEASE}/${file}" "${RELEASE}/${file}" || {
      echo "STOP : la release ${RELEASE} existe avec un contenu différent." >&2
      exit 1
    }
  done
else
  mv "$STAGED_RELEASE" "$RELEASE"
fi
ln -sfn "$RELEASE" "${CURRENT_LINK}.next"
mv -Tf "${CURRENT_LINK}.next" "$CURRENT_LINK"

echo "3/6 Installation de l’unité et neutralisation des anciens ExecStartPost"
install -o root -g root -m 0644 "${SCRIPT_DIR}/l0g-risk.service" /etc/systemd/system/l0g-risk.service
install -o root -g root -m 0644 "${SCRIPT_DIR}/l0g-risk.timer" /etc/systemd/system/l0g-risk.timer
install -d -o root -g root -m 0755 "$DROPIN_DIR"
python3 "$VERIFY_PRODUCERS" "$MANIFEST" --systemd --aggregate-revision "$REVISION" >"${WORK}/98-revisions.conf"
install -o root -g root -m 0644 "${WORK}/98-revisions.conf" "${DROPIN_DIR}/98-revisions.conf"
printf '%s\n' \
  '[Service]' \
  'ExecStart=' \
  'ExecStart=/usr/bin/python3 /usr/local/lib/l0g-risk/l0g-risk.py' \
  'ExecStartPost=' \
  'ExecStartPost=/usr/bin/python3 /usr/local/lib/l0g-risk/api-build.py' \
  'ExecStartPost=/usr/bin/python3 /usr/local/lib/l0g-risk/risk_history.py /var/www/l0g-data' \
  >"${WORK}/99-versioned-paths.conf"
install -o root -g root -m 0644 "${WORK}/99-versioned-paths.conf" "${DROPIN_DIR}/99-versioned-paths.conf"

echo "4/6 Vérification systemd et activation"
systemd-analyze verify /etc/systemd/system/l0g-risk.service /etc/systemd/system/l0g-risk.timer
systemctl daemon-reload
systemctl restart l0g-risk.service
systemctl enable --now l0g-risk.timer

echo "5/6 Validation du contrat et du journal"
python3 "${CURRENT_LINK}/verify-risk-output.py" \
  --risk /var/www/l0g-data/risk.json \
  --history /var/www/l0g-data/history.ndjson \
  --source "${CURRENT_LINK}/l0g-risk.py" \
  --manifest "${CURRENT_LINK}/producer-deployment.json" \
  --revision "$REVISION"

echo "6/6 État final"
systemctl show l0g-risk.service -p Result -p ExecMainStatus --no-pager
systemctl cat l0g-risk.service --no-pager
echo "Sauvegarde conservée : ${BACKUP}"
trap - ERR
