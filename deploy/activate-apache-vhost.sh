#!/usr/bin/env bash
# Active le vhost l0g unifié, avec configtest, probes et rollback automatique.
set -Eeuo pipefail
umask 0077

if [ "${EUID}" -ne 0 ]; then
  echo "Ce script doit être exécuté avec sudo." >&2
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE="${SCRIPT_DIR}/l0g.fr.apache.conf"
AVAILABLE="/etc/apache2/sites-available"
ENABLED="/etc/apache2/sites-enabled"
TARGET="${AVAILABLE}/l0g.fr-hardened.conf"
ACTIVE="${ENABLED}/l0g.fr-hardened.conf"
LEGACY_HTTP="${ENABLED}/l0g.fr.conf"
LEGACY_HTTPS="${ENABLED}/l0g.fr-le-ssl.conf"
APACHECTL="/usr/sbin/apache2ctl"
HTPASSWD="/etc/apache2/l0g-stats.htpasswd"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
BACKUP_DIR="/var/backups/l0g-apache-vhost-${STAMP}"
BACKUP_READY=false
VHOST_MODE=""

for command in cat chmod cmp cp curl date grep install ln mkdir mv readlink rm stat systemctl; do
  command -v "$command" >/dev/null 2>&1 || {
    echo "Commande requise absente: $command" >&2
    exit 1
  }
done
[ -x "$APACHECTL" ] || { echo "apache2ctl absent" >&2; exit 1; }
[ -f "$SOURCE" ] || { echo "Vhost source absent: $SOURCE" >&2; exit 1; }
if [ -L "$LEGACY_HTTP" ] && [ -L "$LEGACY_HTTPS" ] \
   && [ ! -e "$ACTIVE" ] && [ ! -L "$ACTIVE" ]; then
  VHOST_MODE="legacy"
elif [ ! -e "$LEGACY_HTTP" ] && [ ! -L "$LEGACY_HTTP" ] \
     && [ ! -e "$LEGACY_HTTPS" ] && [ ! -L "$LEGACY_HTTPS" ] \
     && [ -L "$ACTIVE" ]; then
  VHOST_MODE="hardened"
else
  echo "Topologie de vhost l0g inattendue; activation refusée" >&2
  exit 1
fi
[ -f /etc/letsencrypt/live/l0g.fr/fullchain.pem ]
[ -f /etc/letsencrypt/live/l0g.fr/privkey.pem ]
[ -s "$HTPASSWD" ] || {
  echo "Fichier d'authentification stats absent ou vide: $HTPASSWD" >&2
  exit 1
}
[ "$(stat -c '%U:%G' "$HTPASSWD")" = "root:www-data" ] || {
  echo "$HTPASSWD doit appartenir à root:www-data" >&2
  exit 1
}
[ "$(stat -c '%a' "$HTPASSWD")" = "640" ] || {
  echo "$HTPASSWD doit être en mode 0640" >&2
  exit 1
}

mkdir -p "$BACKUP_DIR"
chmod 0700 "$BACKUP_DIR"
if [ -L "$LEGACY_HTTP" ]; then
  readlink "$LEGACY_HTTP" >"${BACKUP_DIR}/legacy-http.link"
  : >"${BACKUP_DIR}/legacy-http.present"
else
  : >"${BACKUP_DIR}/legacy-http.absent"
fi
if [ -L "$LEGACY_HTTPS" ]; then
  readlink "$LEGACY_HTTPS" >"${BACKUP_DIR}/legacy-https.link"
  : >"${BACKUP_DIR}/legacy-https.present"
else
  : >"${BACKUP_DIR}/legacy-https.absent"
fi
if [ -e "$TARGET" ] || [ -L "$TARGET" ]; then
  cp -a -- "$TARGET" "${BACKUP_DIR}/l0g.fr-hardened.conf"
  : >"${BACKUP_DIR}/target.present"
else
  : >"${BACKUP_DIR}/target.absent"
fi
if [ -e "$ACTIVE" ] || [ -L "$ACTIVE" ]; then
  cp -a -- "$ACTIVE" "${BACKUP_DIR}/l0g.fr-hardened.enabled"
  : >"${BACKUP_DIR}/active.present"
else
  : >"${BACKUP_DIR}/active.absent"
fi
BACKUP_READY=true

rollback() {
  local exit_code="${1:-$?}"
  trap - ERR INT TERM
  set +e
  rm -f -- "${TARGET}.new.$$" "${ACTIVE}.new.$$" "$ACTIVE" "$LEGACY_HTTP" "$LEGACY_HTTPS"
  if [ "$BACKUP_READY" = true ]; then
    if [ -f "${BACKUP_DIR}/target.present" ]; then
      cp -a -- "${BACKUP_DIR}/l0g.fr-hardened.conf" "${TARGET}.rollback.$$"
      mv -Tf -- "${TARGET}.rollback.$$" "$TARGET"
    else
      rm -f -- "$TARGET"
    fi
    if [ -f "${BACKUP_DIR}/active.present" ]; then
      cp -a -- "${BACKUP_DIR}/l0g.fr-hardened.enabled" "$ACTIVE"
    fi
    if [ -f "${BACKUP_DIR}/legacy-http.present" ]; then
      ln -s "$(cat "${BACKUP_DIR}/legacy-http.link")" "$LEGACY_HTTP"
    fi
    if [ -f "${BACKUP_DIR}/legacy-https.present" ]; then
      ln -s "$(cat "${BACKUP_DIR}/legacy-https.link")" "$LEGACY_HTTPS"
    fi
    "$APACHECTL" configtest
    systemctl reload apache2
    echo "Activation Apache refusée; restauration depuis ${BACKUP_DIR}." >&2
  fi
  exit "$exit_code"
}
trap 'rollback $?' ERR
trap 'rollback 130' INT
trap 'rollback 143' TERM

install -o root -g root -m 0644 "$SOURCE" "${TARGET}.new.$$"
mv -Tf -- "${TARGET}.new.$$" "$TARGET"
ln -s "../sites-available/l0g.fr-hardened.conf" "${ACTIVE}.new.$$"
mv -Tf -- "${ACTIVE}.new.$$" "$ACTIVE"
rm -f -- "$LEGACY_HTTP" "$LEGACY_HTTPS"

cmp -s "$SOURCE" "$TARGET"
"$APACHECTL" configtest
systemctl reload apache2
systemctl is-active --quiet apache2

HEADERS="$(curl -fsSI --max-time 20 https://l0g.fr/)"
printf '%s\n' "$HEADERS" | grep -Fiq "Content-Security-Policy:"
if printf '%s\n' "$HEADERS" | grep -Eiq "^Content-Security-Policy:.*script-src[^;]*'unsafe-inline'"; then
  echo "La CSP principale autorise encore unsafe-inline pour les scripts" >&2
  exit 1
fi
printf '%s\n' "$HEADERS" | grep -Fiq "Cross-Origin-Opener-Policy: same-origin"
[ "$(curl -sS -o /dev/null -w '%{http_code}' --max-time 20 https://l0g.fr/stats/)" = 401 ]
[ "$(curl -sS -o /dev/null -w '%{http_code}' --max-time 20 https://l0g.fr/stats/index.html)" = 401 ]
[ "$(curl -sS -o /dev/null -w '%{http_code}' --max-time 20 https://l0g.fr/api/mcp)" = 405 ]
[ "$(curl -sS -o /dev/null -w '%{http_code}' --max-time 20 https://l0g.fr/api/mcp/usage)" = 200 ]

trap - ERR INT TERM
printf 'Vhost l0g durci activé depuis le mode %s. Sauvegarde: %s\n' \
  "$VHOST_MODE" "$BACKUP_DIR"
