#!/usr/bin/env bash
# Remplace l'exécution de pip dans les virtualenvs par une lecture de métadonnées.
set -Eeuo pipefail
umask 0077

if [ "${EUID}" -ne 0 ]; then
  echo "Ce script doit être exécuté avec sudo." >&2
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET="/usr/local/sbin/zen-backup.sh"
HELPER_SOURCE="${SCRIPT_DIR}/zen-venv-inventory.py"
HELPER_DIR="/usr/local/libexec"
HELPER_TARGET="${HELPER_DIR}/zen-venv-inventory"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
BACKUP_DIR="/var/backups/zen-backup-manifest-${STAMP}"
TMP="$(mktemp -d)"
BACKUP_READY=false
TARGET_MODE=""

for command in bash cmp cp date grep install mkdir mktemp mv rm stat; do
  command -v "$command" >/dev/null 2>&1 || {
    echo "Commande requise absente: $command" >&2
    exit 1
  }
done
[ -x /usr/bin/python3 ] || { echo "/usr/bin/python3 absent" >&2; exit 1; }
[ -f "$HELPER_SOURCE" ] || { echo "Inventaire source absent: $HELPER_SOURCE" >&2; exit 1; }
if [ -L "$TARGET" ] || [ ! -f "$TARGET" ]; then
  echo "Script de sauvegarde inattendu: $TARGET" >&2
  exit 1
fi
[ "$(stat -c '%U:%G' "$TARGET")" = "root:root" ] || {
  echo "$TARGET doit appartenir à root:root" >&2
  exit 1
}
TARGET_MODE="$(stat -c '%a' "$TARGET")"

cleanup() {
  rm -rf -- "$TMP"
}

rollback() {
  local exit_code="${1:-$?}"
  trap - ERR INT TERM
  set +e
  rm -f -- "${TARGET}.new.$$" "${HELPER_TARGET}.new.$$"
  if [ "$BACKUP_READY" = true ]; then
    cp -a -- "${BACKUP_DIR}/zen-backup.sh" "$TARGET"
    if [ -f "${BACKUP_DIR}/helper.present" ]; then
      cp -a -- "${BACKUP_DIR}/zen-venv-inventory" "$HELPER_TARGET"
    else
      rm -f -- "$HELPER_TARGET"
    fi
    echo "Correction annulée; restauration depuis ${BACKUP_DIR}." >&2
  fi
  cleanup
  exit "$exit_code"
}

trap cleanup EXIT
trap 'rollback $?' ERR
trap 'rollback 130' INT
trap 'rollback 143' TERM

mkdir -m 0700 "$BACKUP_DIR"
cp -a -- "$TARGET" "${BACKUP_DIR}/zen-backup.sh"
if [ -L "$HELPER_TARGET" ] || { [ -e "$HELPER_TARGET" ] && [ ! -f "$HELPER_TARGET" ]; }; then
  echo "Cible d'inventaire inattendue: $HELPER_TARGET" >&2
  exit 1
elif [ -f "$HELPER_TARGET" ]; then
  cp -a -- "$HELPER_TARGET" "${BACKUP_DIR}/zen-venv-inventory"
  : >"${BACKUP_DIR}/helper.present"
else
  : >"${BACKUP_DIR}/helper.absent"
fi
BACKUP_READY=true

/usr/bin/python3 - "$TARGET" "${TMP}/zen-backup.sh" <<'PYTHON'
from pathlib import Path
import sys

source = Path(sys.argv[1]).read_text(encoding="utf-8")
old = '''# pip freeze : venvs déclarés (VENVS) + auto-découverte sous APP_ROOTS
: > "${MANIFEST_DIR}/pip-freeze.txt"
{
  printf '%s\\n' "${VENVS[@]:-}"
  for root in "${APP_ROOTS[@]}"; do
    [ -d "$root" ] && find "$root" -maxdepth 4 -name pyvenv.cfg -printf '%h\\n' 2>/dev/null
  done
} | sort -u | while read -r v; do
  [ -n "$v" ] && [ -x "$v/bin/pip" ] || continue
  { echo "### $v"; "$v/bin/pip" freeze 2>/dev/null; echo; } >> "${MANIFEST_DIR}/pip-freeze.txt"
done'''
new = '''# Inventaire des distributions sans exécuter de code provenant des venvs.
: > "${MANIFEST_DIR}/pip-freeze.txt"
{
  printf '%s\\n' "${VENVS[@]:-}"
  for root in "${APP_ROOTS[@]}"; do
    if [ -d "$root" ]; then
      find "$root" -maxdepth 4 -name pyvenv.cfg -printf '%h\\n' 2>/dev/null
    fi
  done
} | sort -u | while read -r v; do
  [ -n "$v" ] && [ -r "$v/pyvenv.cfg" ] || continue
  {
    echo "### $v"
    if ! /usr/local/libexec/zen-venv-inventory "$v"; then
      echo "# inventaire indisponible"
    fi
    echo
  } >> "${MANIFEST_DIR}/pip-freeze.txt"
done'''

if source.count(old) != 1:
    raise SystemExit("Bloc pip freeze attendu absent ou ambigu; correction refusée")
Path(sys.argv[2]).write_text(source.replace(old, new), encoding="utf-8")
PYTHON

bash -n "${TMP}/zen-backup.sh"
grep -Fq '/usr/local/libexec/zen-venv-inventory "$v"' "${TMP}/zen-backup.sh"
if grep -Fq '"$v/bin/pip" freeze' "${TMP}/zen-backup.sh"; then
  echo "L'exécution directe de pip subsiste dans le script corrigé" >&2
  exit 1
fi

mkdir -p "${TMP}/fixture/lib/python3.13/site-packages/demo_package-1.2.3.dist-info"
: >"${TMP}/fixture/pyvenv.cfg"
cat >"${TMP}/fixture/lib/python3.13/site-packages/demo_package-1.2.3.dist-info/METADATA" <<'EOF'
Metadata-Version: 2.1
Name: demo-package
Version: 1.2.3
EOF
/usr/bin/python3 -I -S "$HELPER_SOURCE" "${TMP}/fixture" >"${TMP}/inventory.txt"
grep -Fxq 'demo-package==1.2.3' "${TMP}/inventory.txt"

install -d -o root -g root -m 0755 "$HELPER_DIR"
install -o root -g root -m 0755 "$HELPER_SOURCE" "${HELPER_TARGET}.new.$$"
mv -Tf -- "${HELPER_TARGET}.new.$$" "$HELPER_TARGET"
install -o root -g root -m "$TARGET_MODE" "${TMP}/zen-backup.sh" "${TARGET}.new.$$"
mv -Tf -- "${TARGET}.new.$$" "$TARGET"

cmp -s "$HELPER_SOURCE" "$HELPER_TARGET"
bash -n "$TARGET"
grep -Fq '/usr/local/libexec/zen-venv-inventory "$v"' "$TARGET"

trap - ERR INT TERM
cleanup
printf 'Manifeste de sauvegarde durci; sauvegarde: %s\n' "$BACKUP_DIR"
