#!/usr/bin/env bash
# Installe l'agrégateur local de lectures HTML et son timer systemd.
set -Eeuo pipefail
umask 0022

if [ "${EUID}" -ne 0 ]; then
  echo "Ce script doit être exécuté avec sudo." >&2
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
INSTALL_ROOT="/usr/local/lib/l0g-human-traffic"
UNIT_DIR="/etc/systemd/system"
DATA_DIR="/var/www/l0g-data"

for command in getent install mkdir node systemctl; do
  command -v "$command" >/dev/null 2>&1 || {
    echo "Commande requise absente: $command" >&2
    exit 1
  }
done

getent passwd l0grisk >/dev/null || {
  echo "Compte système l0grisk absent; installer d’abord l’agrégateur de risque." >&2
  exit 1
}
getent group l0grisk >/dev/null || {
  echo "Groupe système l0grisk absent; installer d’abord l’agrégateur de risque." >&2
  exit 1
}
getent group adm >/dev/null || {
  echo "Groupe système adm absent; lecture bornée des logs Apache impossible." >&2
  exit 1
}

for source in \
  "${ROOT}/scripts/human-traffic-report.mjs" \
  "${ROOT}/mcp-server/usage-telemetry.mjs" \
  "${SCRIPT_DIR}/l0g-human-traffic.service" \
  "${SCRIPT_DIR}/l0g-human-traffic.timer"; do
  [ -f "$source" ] || {
    echo "Source absente: $source" >&2
    exit 1
  }
done
[ -d /var/log/apache2 ] || {
  echo "Répertoire de logs Apache absent." >&2
  exit 1
}

install -d -o root -g root -m 0755 \
  "${INSTALL_ROOT}/scripts" \
  "${INSTALL_ROOT}/mcp-server"
install -d -o l0grisk -g l0grisk -m 0755 "$DATA_DIR"
install -o root -g root -m 0644 \
  "${ROOT}/scripts/human-traffic-report.mjs" \
  "${INSTALL_ROOT}/scripts/human-traffic-report.mjs"
install -o root -g root -m 0644 \
  "${ROOT}/mcp-server/usage-telemetry.mjs" \
  "${INSTALL_ROOT}/mcp-server/usage-telemetry.mjs"
install -o root -g root -m 0644 \
  "${SCRIPT_DIR}/l0g-human-traffic.service" \
  "${UNIT_DIR}/l0g-human-traffic.service"
install -o root -g root -m 0644 \
  "${SCRIPT_DIR}/l0g-human-traffic.timer" \
  "${UNIT_DIR}/l0g-human-traffic.timer"

systemctl daemon-reload
systemctl start l0g-human-traffic.service
node -e '
  const fs = require("node:fs");
  const path = "/var/www/l0g-data/human-traffic.json";
  const report = JSON.parse(fs.readFileSync(path, "utf8"));
  if (report.schema_version !== "1.0.0" || report.minimum_public_cohort !== 5 || !Array.isArray(report.daily)) process.exit(1);
'
systemctl enable --now l0g-human-traffic.timer
systemctl is-active --quiet l0g-human-traffic.timer

echo "Agrégateur humain installé; rapport: ${DATA_DIR}/human-traffic.json"
