#!/usr/bin/env bash
# Installe un runtime Node.js LTS officiel et bascule uniquement les services MCP.
set -Eeuo pipefail
umask 0022

if [ "${EUID}" -ne 0 ]; then
  echo "Ce script doit être exécuté avec sudo." >&2
  exit 1
fi

NODE_VERSION="24.18.1"
NODE_ARCHIVE="node-v${NODE_VERSION}-linux-x64.tar.xz"
NODE_SHA256="d6c664df3f3f61458e8c277585571328522d705166723a7c7823a9253a4d15a0"
NODE_URL="https://nodejs.org/dist/v${NODE_VERSION}/${NODE_ARCHIVE}"
NODE_ROOT="/opt/node-v${NODE_VERSION}"
NODE_LINK="/opt/nodejs-lts"
MCP_SERVICE="l0g-mcp.service"
MCP_DROPIN_DIR="/etc/systemd/system/${MCP_SERVICE}.d"
MCP_DROPIN="${MCP_DROPIN_DIR}/20-node24-runtime.conf"
DEPLOY_SERVICE="l0g-mcp-deploy.service"
DEPLOY_DROPIN_DIR="/etc/systemd/system/${DEPLOY_SERVICE}.d"
DEPLOY_DROPIN="${DEPLOY_DROPIN_DIR}/20-node24-runtime.conf"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
BACKUP_DIR="/var/backups/l0g-node24-${STAMP}"
TMP="$(mktemp -d)"
STAGING="/opt/.node-v${NODE_VERSION}-staging-$$"
BACKUP_READY=false
ACTIVATION_STARTED=false

for command in cat chmod cmp curl date install ln mkdir mv readlink rm sha256sum sleep systemctl tar uname; do
  command -v "$command" >/dev/null 2>&1 || {
    echo "Commande requise absente: $command" >&2
    exit 1
  }
done
[ "$(uname -m)" = "x86_64" ] || {
  echo "Architecture non prise en charge: $(uname -m)" >&2
  exit 1
}
[ -x /usr/bin/node ] || {
  echo "Runtime Debian /usr/bin/node absent; état inattendu." >&2
  exit 1
}

cleanup() {
  rm -rf -- "$TMP" "$STAGING"
}

rollback() {
  local exit_code="${1:-$?}"
  trap - ERR INT TERM
  set +e
  if [ "$BACKUP_READY" = true ]; then
    if [ -f "${BACKUP_DIR}/node-link.present" ]; then
      ln -s "$(cat "${BACKUP_DIR}/node-link.target")" "${NODE_LINK}.rollback.$$"
      mv -Tf -- "${NODE_LINK}.rollback.$$" "$NODE_LINK"
    else
      rm -f -- "$NODE_LINK"
    fi
    for pair in "$MCP_DROPIN mcp" "$DEPLOY_DROPIN deploy"; do
      read -r target name <<<"$pair"
      if [ -f "${BACKUP_DIR}/${name}.present" ]; then
        install -o root -g root -m 0644 "${BACKUP_DIR}/${name}.conf" "$target"
      else
        rm -f -- "$target"
      fi
    done
    systemctl daemon-reload
    if [ "$ACTIVATION_STARTED" = true ]; then
      systemctl restart "$MCP_SERVICE"
    fi
    echo "Activation Node.js annulée; sauvegarde: ${BACKUP_DIR}" >&2
  fi
  cleanup
  exit "$exit_code"
}

trap cleanup EXIT
trap 'rollback $?' ERR
trap 'rollback 130' INT
trap 'rollback 143' TERM

BEFORE_HEALTH="$(curl --fail --silent --show-error --max-time 10 http://127.0.0.1:8848/healthz)"
BEFORE_ID="$(HEALTH="$BEFORE_HEALTH" /usr/bin/node -e '
  const h = JSON.parse(process.env.HEALTH);
  if (!h.ok || !/^\d+\.\d+\.\d+$/.test(h.server?.version || "") || !/^[0-9a-f]{40}$/i.test(h.server?.sha || "")) process.exit(1);
  process.stdout.write(`${h.server.version}@${h.server.sha}`);
')"

curl --proto '=https' --tlsv1.2 --fail --silent --show-error --location --retry 3 \
  --output "${TMP}/${NODE_ARCHIVE}" "$NODE_URL"
printf '%s  %s\n' "$NODE_SHA256" "$NODE_ARCHIVE" >"${TMP}/SHA256SUMS"
(cd "$TMP" && sha256sum -c SHA256SUMS)

if [ -L "$NODE_ROOT" ] || { [ -e "$NODE_ROOT" ] && [ ! -d "$NODE_ROOT" ]; }; then
  echo "Cible Node.js inattendue: ${NODE_ROOT}" >&2
  exit 1
elif [ -e "$NODE_ROOT" ]; then
  [ -x "${NODE_ROOT}/bin/node" ]
  [ "$("${NODE_ROOT}/bin/node" --version)" = "v${NODE_VERSION}" ]
  [ "$(cat "${NODE_ROOT}/.l0g-archive-sha256")" = "$NODE_SHA256" ]
else
  mkdir -m 0755 "$STAGING"
  tar --extract --xz --file "${TMP}/${NODE_ARCHIVE}" --directory "$STAGING" \
    --strip-components=1 --no-same-owner --no-same-permissions
  [ "$("${STAGING}/bin/node" --version)" = "v${NODE_VERSION}" ]
  printf '%s\n' "$NODE_SHA256" >"${STAGING}/.l0g-archive-sha256"
  chmod -R u=rwX,go=rX "$STAGING"
  mv -- "$STAGING" "$NODE_ROOT"
fi

mkdir -m 0700 "$BACKUP_DIR"
if [ -L "$NODE_LINK" ]; then
  readlink "$NODE_LINK" >"${BACKUP_DIR}/node-link.target"
  : >"${BACKUP_DIR}/node-link.present"
elif [ -e "$NODE_LINK" ]; then
  echo "${NODE_LINK} existe sans être un lien symbolique; activation refusée." >&2
  exit 1
else
  : >"${BACKUP_DIR}/node-link.absent"
fi
for pair in "$MCP_DROPIN mcp" "$DEPLOY_DROPIN deploy"; do
  read -r target name <<<"$pair"
  if [ -f "$target" ]; then
    install -o root -g root -m 0600 "$target" "${BACKUP_DIR}/${name}.conf"
    : >"${BACKUP_DIR}/${name}.present"
  elif [ -e "$target" ]; then
    echo "Drop-in inattendu: ${target}" >&2
    exit 1
  else
    : >"${BACKUP_DIR}/${name}.absent"
  fi
done
BACKUP_READY=true

ln -s "$NODE_ROOT" "${NODE_LINK}.new.$$"
mv -Tf -- "${NODE_LINK}.new.$$" "$NODE_LINK"
[ "$("${NODE_LINK}/bin/node" --version)" = "v${NODE_VERSION}" ]

install -d -o root -g root -m 0755 "$MCP_DROPIN_DIR" "$DEPLOY_DROPIN_DIR"
cat >"${TMP}/mcp.conf" <<'EOF'
[Service]
ExecStart=
ExecStart=/opt/nodejs-lts/bin/node /opt/l0g-mcp-runtime/current/mcp-server/server.mjs
EOF
cat >"${TMP}/deploy.conf" <<'EOF'
[Service]
Environment="PATH=/opt/nodejs-lts/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin"
EOF
install -o root -g root -m 0644 "${TMP}/mcp.conf" "$MCP_DROPIN"
install -o root -g root -m 0644 "${TMP}/deploy.conf" "$DEPLOY_DROPIN"
cmp -s "${TMP}/mcp.conf" "$MCP_DROPIN"
cmp -s "${TMP}/deploy.conf" "$DEPLOY_DROPIN"

systemctl daemon-reload
ACTIVATION_STARTED=true
systemctl restart "$MCP_SERVICE"
systemctl is-active --quiet "$MCP_SERVICE"

AFTER_HEALTH=""
for _ in {1..30}; do
  if AFTER_HEALTH="$(curl --fail --silent --show-error --max-time 5 http://127.0.0.1:8848/healthz 2>/dev/null)"; then
    break
  fi
  sleep 1
done
[ -n "$AFTER_HEALTH" ]
AFTER_ID="$(HEALTH="$AFTER_HEALTH" "${NODE_LINK}/bin/node" -e '
  const h = JSON.parse(process.env.HEALTH);
  if (!h.ok) process.exit(1);
  process.stdout.write(`${h.server?.version || ""}@${h.server?.sha || ""}`);
')"
[ "$AFTER_ID" = "$BEFORE_ID" ] || {
  echo "Identité MCP modifiée pendant la migration: ${BEFORE_ID} -> ${AFTER_ID}" >&2
  exit 1
}
MCP_PID="$(systemctl show --property MainPID --value "$MCP_SERVICE")"
[ "$MCP_PID" -gt 1 ]
[ "$(readlink -f "/proc/${MCP_PID}/exe")" = "${NODE_ROOT}/bin/node" ]

trap - ERR INT TERM
cleanup
printf 'Node.js v%s actif pour MCP; identité conservée: %s; sauvegarde: %s\n' \
  "$NODE_VERSION" "$AFTER_ID" "$BACKUP_DIR"
