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
APACHE_MODULES="$("$APACHECTL" -M 2>&1)"
for module in http2_module brotli_module deflate_module filter_module setenvif_module reqtimeout_module; do
  if ! printf '%s\n' "$APACHE_MODULES" | grep -Eq "[[:space:]]${module}[[:space:]]"; then
    echo "Module Apache requis absent: ${module}. Exécuter: sudo a2enmod http2 brotli deflate filter setenvif reqtimeout" >&2
    exit 1
  fi
done
if ! curl --version | grep -Fq "HTTP2"; then
  echo "Le curl serveur ne prend pas en charge HTTP/2; preuve d'activation impossible." >&2
  exit 1
fi
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
[ -s /var/www/l0g-data/human-traffic.json ] || {
  echo "Rapport humain absent; exécuter d’abord: sudo deploy/install-human-traffic.sh" >&2
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
    systemctl restart apache2
    echo "Activation Apache refusée; restauration depuis ${BACKUP_DIR}." >&2
  fi
  exit "$exit_code"
}

probe_status() {
  local label="$1"
  local expected="$2"
  local url="$3"
  local actual

  actual="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 20 "$url")" || {
    echo "Sonde HTTP ${label} impossible: ${url}" >&2
    return 1
  }
  if [ "$actual" != "$expected" ]; then
    echo "Sonde HTTP ${label} invalide: attendu ${expected}, obtenu ${actual} (${url})" >&2
    return 1
  fi
}

probe_header() {
  local label="$1"
  local headers="$2"
  local pattern="$3"

  if ! printf '%s\n' "$headers" | grep -Eiq "$pattern"; then
    echo "Sonde d'en-tête ${label} invalide" >&2
    return 1
  fi
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
# Un redémarrage complet est requis lorsque a2enmod vient d'activer
# mod_http2 ou mod_brotli : un simple graceful reload conserve le
# processus parent sans les nouveaux modules DSO.
systemctl restart apache2
systemctl is-active --quiet apache2

HTTP_VERSION="$(curl -fsS --http2 --max-time 20 -o /dev/null -w '%{http_version}' https://l0g.fr/)"
[ "$HTTP_VERSION" = "2" ] || {
  echo "HTTP/2 non négocié après redémarrage (version obtenue: ${HTTP_VERSION})." >&2
  rollback 1
}
BROTLI_HEADERS="$(curl -fsS --max-time 20 -H 'Accept-Encoding: br' -D - -o /dev/null https://l0g.fr/)"
probe_header "compression Brotli" "$BROTLI_HEADERS" "^Content-Encoding:[[:space:]]*br[[:space:]]*$"
GZIP_HEADERS="$(curl -fsS --max-time 20 -H 'Accept-Encoding: gzip' -D - -o /dev/null https://l0g.fr/)"
probe_header "compression gzip" "$GZIP_HEADERS" "^Content-Encoding:[[:space:]]*gzip[[:space:]]*$"

HEADERS="$(curl -fsSI --max-time 20 https://l0g.fr/)"
probe_header "Content-Security-Policy" "$HEADERS" "^Content-Security-Policy:"
if printf '%s\n' "$HEADERS" | grep -Eiq "^Content-Security-Policy:.*script-src[^;]*'unsafe-inline'"; then
  echo "La CSP principale autorise encore unsafe-inline pour les scripts" >&2
  exit 1
fi
probe_header "Cross-Origin-Opener-Policy" "$HEADERS" "^Cross-Origin-Opener-Policy:[[:space:]]*same-origin[[:space:]]*$"
probe_header "X-XSS-Protection" "$HEADERS" "^X-XSS-Protection:[[:space:]]*0[[:space:]]*$"
probe_status "stats" 401 https://l0g.fr/stats/
probe_status "stats/index.html" 401 https://l0g.fr/stats/index.html
probe_status "stats sans slash" 401 https://l0g.fr/stats
probe_status "MCP GET" 405 https://l0g.fr/api/mcp
probe_status "métriques MCP" 200 https://l0g.fr/api/mcp/usage
probe_status "trafic humain" 200 https://l0g.fr/api/v1/human-traffic.json
probe_status "contact FR" 200 https://l0g.fr/contact/
probe_status "contact EN" 200 https://l0g.fr/en/contact/
probe_status "ancien contact" 301 https://l0g.fr/contact-us/
probe_status "alias sitemap" 301 https://l0g.fr/sitemap.xml
probe_status "découverte MCP racine" 308 https://l0g.fr/.well-known/mcp
probe_status "découverte MCP API" 308 https://l0g.fr/api/mcp/.well-known/mcp
probe_status "ancienne route BTC" 301 https://l0g.fr/btc/
probe_status "ancienne route USD" 301 https://l0g.fr/usd/
probe_status "ancienne route marchés US" 301 https://l0g.fr/marches-us/
probe_status "ancienne route Mag7" 301 https://l0g.fr/mag7/
probe_status "ancienne route matières premières" 410 https://l0g.fr/hard-commodities/
probe_status "ancienne route calendrier" 410 https://l0g.fr/calendrier-eco/
probe_status "route inconnue" 404 https://l0g.fr/route-inconnue-probe-l0g
curl -sS --max-time 20 https://l0g.fr/route-inconnue-probe-l0g \
  | grep -Fq "Cette route ne mène plus nulle part."

trap - ERR INT TERM
printf 'Vhost l0g durci activé depuis le mode %s. Sauvegarde: %s\n' \
  "$VHOST_MODE" "$BACKUP_DIR"
