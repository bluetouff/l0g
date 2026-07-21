#!/usr/bin/env bash
# Migration transactionnelle de l'ancien poller vers le déployeur attesté.
set -Eeuo pipefail
umask 0077

if [ "${EUID}" -ne 0 ]; then
  echo "Ce script doit être exécuté avec sudo." >&2
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKER_SOURCE="${SCRIPT_DIR}/deploy.sh"
SERVICE_SOURCE="${SCRIPT_DIR}/l0g-deploy.service"
TIMER_SOURCE="${SCRIPT_DIR}/l0g-deploy.timer"
WORKER_TARGET="/usr/local/bin/l0g-deploy.sh"
SERVICE_TARGET="/etc/systemd/system/l0g-deploy.service"
TIMER_TARGET="/etc/systemd/system/l0g-deploy.timer"
BASE="/var/www/html/l0g"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
BACKUP_DIR="/var/backups/l0g-deploy-worker-${STAMP}"
BACKUP_READY=false

for command in bash cat chmod cmp cp cut date getent grep install mkdir mv readlink rm sha256sum systemctl systemd-analyze; do
  command -v "$command" >/dev/null 2>&1 || {
    echo "Commande requise absente: $command" >&2
    exit 1
  }
done

for source_file in "$WORKER_SOURCE" "$SERVICE_SOURCE" "$TIMER_SOURCE"; do
  [ -f "$source_file" ] || {
    echo "Fichier de migration absent: $source_file" >&2
    exit 1
  }
done

getent passwd l0gdeploy >/dev/null || {
  echo "L'utilisateur système l0gdeploy est absent." >&2
  exit 1
}
systemctl is-enabled --quiet l0g-deploy.timer || {
  echo "Le timer l0g-deploy.timer doit déjà être activé." >&2
  exit 1
}
systemctl is-active --quiet l0g-deploy.timer || {
  echo "Le timer l0g-deploy.timer doit déjà être actif." >&2
  exit 1
}

bash -n "$WORKER_SOURCE"
systemd-analyze verify "$SERVICE_SOURCE" "$TIMER_SOURCE"

mkdir -p "$BACKUP_DIR"
chmod 0700 "$BACKUP_DIR"

backup_target() {
  local target="$1"
  local name="$2"
  if [ -e "$target" ] || [ -L "$target" ]; then
    cp -a -- "$target" "${BACKUP_DIR}/${name}"
    : >"${BACKUP_DIR}/${name}.present"
  else
    : >"${BACKUP_DIR}/${name}.absent"
  fi
}

restore_target() {
  local target="$1"
  local name="$2"
  local temporary="${target}.rollback.$$"
  if [ -f "${BACKUP_DIR}/${name}.present" ]; then
    cp -a -- "${BACKUP_DIR}/${name}" "$temporary"
    mv -Tf -- "$temporary" "$target"
  else
    rm -f -- "$target" "$temporary"
  fi
}

rollback() {
  local exit_code="${1:-$?}"
  trap - ERR INT TERM
  set +e
  rm -f -- "${WORKER_TARGET}.new.$$" "${SERVICE_TARGET}.new.$$" "${TIMER_TARGET}.new.$$"
  if [ "$BACKUP_READY" = true ]; then
    echo "Activation refusée; restauration depuis ${BACKUP_DIR}." >&2
    restore_target "$WORKER_TARGET" l0g-deploy.sh
    restore_target "$SERVICE_TARGET" l0g-deploy.service
    restore_target "$TIMER_TARGET" l0g-deploy.timer
    restore_target "${BASE}/current" current
    restore_target "${BASE}/.last_source_sha" .last_source_sha
    restore_target "${BASE}/.last_built_sha" .last_built_sha
    systemctl daemon-reload
    systemctl restart l0g-deploy.timer
    systemctl restart l0g-deploy.service
  fi
  exit "$exit_code"
}
trap 'rollback $?' ERR
trap 'rollback 130' INT
trap 'rollback 143' TERM

backup_target "$WORKER_TARGET" l0g-deploy.sh
backup_target "$SERVICE_TARGET" l0g-deploy.service
backup_target "$TIMER_TARGET" l0g-deploy.timer
backup_target "${BASE}/current" current
backup_target "${BASE}/.last_source_sha" .last_source_sha
backup_target "${BASE}/.last_built_sha" .last_built_sha
BACKUP_READY=true

install -o root -g root -m 0755 "$WORKER_SOURCE" "${WORKER_TARGET}.new.$$"
install -o root -g root -m 0644 "$SERVICE_SOURCE" "${SERVICE_TARGET}.new.$$"
install -o root -g root -m 0644 "$TIMER_SOURCE" "${TIMER_TARGET}.new.$$"
mv -Tf -- "${WORKER_TARGET}.new.$$" "$WORKER_TARGET"
mv -Tf -- "${SERVICE_TARGET}.new.$$" "$SERVICE_TARGET"
mv -Tf -- "${TIMER_TARGET}.new.$$" "$TIMER_TARGET"

cmp -s "$WORKER_SOURCE" "$WORKER_TARGET"
cmp -s "$SERVICE_SOURCE" "$SERVICE_TARGET"
cmp -s "$TIMER_SOURCE" "$TIMER_TARGET"

systemctl daemon-reload
systemctl restart l0g-deploy.service
systemctl restart l0g-deploy.timer

[ "$(systemctl show l0g-deploy.service --property=Result --value)" = success ]
[ "$(systemctl show l0g-deploy.service --property=ExecMainStatus --value)" = 0 ]
systemctl is-active --quiet l0g-deploy.timer

SOURCE_SHA="$(cat "${BASE}/.last_source_sha")"
BUILT_SHA="$(cat "${BASE}/.last_built_sha")"
[[ "$SOURCE_SHA" =~ ^[0-9a-f]{40}$ ]]
[[ "$BUILT_SHA" =~ ^[0-9a-f]{40}$ ]]
[ -L "${BASE}/current" ]
CURRENT_TARGET="$(readlink -f "${BASE}/current")"
[[ "$CURRENT_TARGET" == "${BASE}/releases/"* ]]
[ -f "${CURRENT_TARGET}/source.env" ]
grep -Fxq "L0G_RELEASE_SOURCE_SHA=${SOURCE_SHA}" "${CURRENT_TARGET}/source.env"

trap - ERR INT TERM
printf 'Déployeur attesté activé: main=%s built=%s\n' "$SOURCE_SHA" "$BUILT_SHA"
printf 'Sauvegarde de rollback: %s\n' "$BACKUP_DIR"
printf 'SHA-256 worker: %s\n' "$(sha256sum "$WORKER_TARGET" | cut -d ' ' -f 1)"
