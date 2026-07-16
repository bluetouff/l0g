#!/usr/bin/env bash
# Pull-based, fail-closed MCP deployment from an attested GitHub Release.
set -euo pipefail
umask 0077

REPOSITORY="bluetouff/l0g"
RELEASE_API="https://api.github.com/repos/${REPOSITORY}/releases?per_page=100"
BASE="/opt/l0g-mcp-runtime"
RELEASES="${BASE}/releases"
CURRENT="${BASE}/current"
SERVICE="l0g-mcp.service"
KEEP_RELEASES=5
SMOKE_PORT=18848

mkdir -p "$RELEASES"
exec 9>"${BASE}/deploy.lock"
flock -n 9 || exit 0

TMP="$(mktemp -d)"
export HOME="${TMP}/home"
export XDG_CACHE_HOME="${TMP}/cache"
export XDG_CONFIG_HOME="${TMP}/config"
mkdir -p "$HOME" "$XDG_CACHE_HOME" "$XDG_CONFIG_HOME"
SMOKE_PID=""
cleanup() {
  if [ -n "$SMOKE_PID" ]; then
    kill "$SMOKE_PID" 2>/dev/null || true
    wait "$SMOKE_PID" 2>/dev/null || true
  fi
  rm -rf "$TMP"
}
trap cleanup EXIT

curl --proto '=https' --tlsv1.2 --fail --silent --show-error --location --retry 3 \
  -H 'Accept: application/vnd.github+json' \
  -H 'X-GitHub-Api-Version: 2022-11-28' \
  -H 'User-Agent: l0g-mcp-atomic-deployer/1' \
  "$RELEASE_API" >"${TMP}/releases.json"

mapfile -t RELEASE_META < <(node - "${TMP}/releases.json" <<'NODE'
const fs = require('node:fs');
const releases = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const candidates = releases
  .filter((release) => !release.draft && !release.prerelease && /^mcp-v\d+\.\d+\.\d+$/.test(release.tag_name))
  .map((release) => ({ release, parts: release.tag_name.slice(5).split('.').map(Number) }))
  .sort((a, b) => b.parts[0] - a.parts[0] || b.parts[1] - a.parts[1] || b.parts[2] - a.parts[2]);
if (!candidates.length) throw new Error('aucune release MCP stable trouvée');
const release = candidates[0].release;
const version = release.tag_name.slice(5);
const archive = `l0g-mcp-${version}.tar.gz`;
const names = [archive, `${archive}.sha256`, `${archive}.sigstore.jsonl`];
const urls = names.map((name) => release.assets.find((asset) => asset.name === name)?.browser_download_url);
if (urls.some((url) => !url)) throw new Error(`assets incomplets pour ${release.tag_name}`);
for (const value of [release.tag_name, version, ...urls]) process.stdout.write(`${value}\n`);
NODE
)

if [ "${#RELEASE_META[@]}" -ne 5 ]; then
  echo "Métadonnées de release MCP incomplètes" >&2
  exit 1
fi
TAG="${RELEASE_META[0]}"
VERSION="${RELEASE_META[1]}"
ARCHIVE_URL="${RELEASE_META[2]}"
CHECKSUM_URL="${RELEASE_META[3]}"
BUNDLE_URL="${RELEASE_META[4]}"
RELEASE_NAME="l0g-mcp-${VERSION}"
ARCHIVE="${RELEASE_NAME}.tar.gz"

current_version=""
current_sha=""
previous_target=""
managed_current=false

compare_versions() {
  node - "$1" "$2" <<'NODE'
const left = process.argv[2].split('.').map(Number);
const right = process.argv[3].split('.').map(Number);
const result = left[0] - right[0] || left[1] - right[1] || left[2] - right[2];
process.exit(result > 0 ? 0 : result === 0 ? 10 : 20);
NODE
}

health_matches() {
  local version="$1"
  local sha="$2"
  local require_attested="${3:-true}"
  local payload
  payload="$(curl --fail --silent --show-error --max-time 10 http://127.0.0.1:8848/healthz)" || return 1
  HEALTH_PAYLOAD="$payload" EXPECTED_VERSION="$version" EXPECTED_SHA="$sha" REQUIRE_ATTESTED="$require_attested" node -e '
    const h = JSON.parse(process.env.HEALTH_PAYLOAD);
    const identity = h.ok && h.server?.version === process.env.EXPECTED_VERSION && h.server?.sha === process.env.EXPECTED_SHA && h.server?.shaStatus === "verified-hex";
    process.exit(identity && (process.env.REQUIRE_ATTESTED !== "true" || h.server?.releaseAttested === true) ? 0 : 1);
  '
}

wait_for_health() {
  local version="$1"
  local sha="$2"
  local require_attested="${3:-true}"
  for _ in {1..30}; do
    health_matches "$version" "$sha" "$require_attested" && return 0
    sleep 1
  done
  return 1
}

health_ok() {
  local payload
  payload="$(curl --fail --silent --show-error --max-time 10 http://127.0.0.1:8848/healthz)" || return 1
  HEALTH_PAYLOAD="$payload" node -e 'const h = JSON.parse(process.env.HEALTH_PAYLOAD); process.exit(h.ok ? 0 : 1);'
}

if [ -L "$CURRENT" ]; then
  previous_target="$(readlink -f "$CURRENT")"
  if [ -f "$CURRENT/release.json" ]; then
    managed_current=true
    current_version="$(node -p "JSON.parse(require('fs').readFileSync(process.argv[1])).version" "$CURRENT/release.json")"
    current_sha="$(node -p "JSON.parse(require('fs').readFileSync(process.argv[1])).gitSha" "$CURRENT/release.json")"
  else
    mapfile -t BASELINE_META < <(
      curl --fail --silent --show-error --max-time 10 http://127.0.0.1:8848/healthz \
        | node -e 'let b=""; process.stdin.on("data", c => b += c).on("end", () => { const h=JSON.parse(b); if (!h.ok) process.exit(1); console.log(h.server?.version || ""); console.log(h.server?.sha || ""); });'
    )
    current_version="${BASELINE_META[0]:-}"
    current_sha="${BASELINE_META[1]:-}"
  fi
fi

if [ "$managed_current" = true ]; then
  set +e
  compare_versions "$VERSION" "$current_version"
  comparison=$?
  set -e
  if [ "$comparison" -eq 20 ]; then
    echo "Refus du downgrade MCP ${current_version} -> ${VERSION}" >&2
    exit 1
  fi
  if [ "$comparison" -eq 10 ]; then
    if health_matches "$current_version" "$current_sha"; then
      exit 0
    fi
    systemctl restart "$SERVICE"
    wait_for_health "$current_version" "$current_sha"
    exit 0
  fi
fi

for pair in \
  "$ARCHIVE_URL ${TMP}/${ARCHIVE}" \
  "$CHECKSUM_URL ${TMP}/${ARCHIVE}.sha256" \
  "$BUNDLE_URL ${TMP}/${ARCHIVE}.sigstore.jsonl"; do
  read -r url destination <<<"$pair"
  curl --proto '=https' --tlsv1.2 --fail --silent --show-error --location --retry 3 \
    -H 'User-Agent: l0g-mcp-atomic-deployer/1' -o "$destination" "$url"
done

checksum_line="$(cat "${TMP}/${ARCHIVE}.sha256")"
checksum_digest="${checksum_line%%  *}"
checksum_name="${checksum_line#*  }"
if [[ ! "$checksum_digest" =~ ^[0-9a-f]{64}$ ]] || [ "$checksum_name" != "$ARCHIVE" ]; then
  echo "Format de checksum inattendu" >&2
  exit 1
fi
(cd "$TMP" && sha256sum -c "${ARCHIVE}.sha256")

gh attestation verify "${TMP}/${ARCHIVE}" \
  --bundle "${TMP}/${ARCHIVE}.sigstore.jsonl" \
  --repo "$REPOSITORY" \
  --signer-workflow "${REPOSITORY}/.github/workflows/publish-mcp.yml" \
  --source-ref "refs/tags/${TAG}" \
  --deny-self-hosted-runners

if tar -tzf "${TMP}/${ARCHIVE}" | grep -Ev "^${RELEASE_NAME}(/|$)"; then
  echo "Archive contenant un chemin hors racine" >&2
  exit 1
fi
if tar -tzf "${TMP}/${ARCHIVE}" | grep -E '(^|/)\.\.(/|$)|^/'; then
  echo "Archive contenant une traversée de chemin" >&2
  exit 1
fi
if tar -tvzf "${TMP}/${ARCHIVE}" | awk 'substr($1,1,1) == "l" || substr($1,1,1) == "h" { found=1 } END { exit(found ? 0 : 1) }'; then
  echo "Archive contenant un lien symbolique ou physique" >&2
  exit 1
fi

STAGING="${BASE}/.staging-${VERSION}-$$"
mkdir -p "$STAGING"
tar --extract --gzip --file "${TMP}/${ARCHIVE}" --directory "$STAGING" \
  --no-same-owner --no-same-permissions
CANDIDATE="${STAGING}/${RELEASE_NAME}"
node "$CANDIDATE/mcp-server/deploy/verify-release.mjs" --root "$CANDIDATE" --version "$VERSION"
GIT_SHA="$(node -p "JSON.parse(require('fs').readFileSync(process.argv[1])).gitSha" "$CANDIDATE/release.json")"

gh attestation verify "${TMP}/${ARCHIVE}" \
  --bundle "${TMP}/${ARCHIVE}.sigstore.jsonl" \
  --repo "$REPOSITORY" \
  --signer-workflow "${REPOSITORY}/.github/workflows/publish-mcp.yml" \
  --source-ref "refs/tags/${TAG}" \
  --source-digest "$GIT_SHA" \
  --deny-self-hosted-runners
node "$CANDIDATE/mcp-server/deploy/verify-release.mjs" --root "$CANDIDATE" --version "$VERSION" --sha "$GIT_SHA"
node --check "$CANDIDATE/mcp-server/server.mjs"
node --check "$CANDIDATE/src/lib/agent-prompts.mjs"

MCP_HOST=127.0.0.1 MCP_PORT="$SMOKE_PORT" MCP_PATH=/mcp \
L0G_DATA_DIR=/var/www/html/l0g/current L0G_SITE=https://l0g.fr \
MCP_ALLOWED_HOSTS=127.0.0.1,localhost MCP_ALLOWED_ORIGINS=https://l0g.fr \
MCP_GIT_SHA="$GIT_SHA" MCP_RELEASE_ATTESTED=1 NODE_ENV=production \
  node "$CANDIDATE/mcp-server/server.mjs" >"${TMP}/smoke.log" 2>&1 &
SMOKE_PID=$!
smoke_ok=false
for _ in {1..30}; do
  if payload="$(curl --fail --silent --max-time 5 "http://127.0.0.1:${SMOKE_PORT}/healthz" 2>/dev/null)" && \
    HEALTH_PAYLOAD="$payload" EXPECTED_VERSION="$VERSION" EXPECTED_SHA="$GIT_SHA" node -e '
      const h = JSON.parse(process.env.HEALTH_PAYLOAD);
      process.exit(h.ok && h.server?.version === process.env.EXPECTED_VERSION && h.server?.sha === process.env.EXPECTED_SHA && h.server?.releaseAttested === true ? 0 : 1);
    '; then
    smoke_ok=true
    break
  fi
  sleep 1
done
kill "$SMOKE_PID" 2>/dev/null || true
wait "$SMOKE_PID" 2>/dev/null || true
SMOKE_PID=""
if [ "$smoke_ok" != true ]; then
  cat "${TMP}/smoke.log" >&2
  echo "Smoke test MCP refusé" >&2
  exit 1
fi

TARGET="${RELEASES}/${RELEASE_NAME}-${GIT_SHA}"
if [ -e "$TARGET" ]; then
  node "$TARGET/mcp-server/deploy/verify-release.mjs" --root "$TARGET" --version "$VERSION" --sha "$GIT_SHA"
  rm -rf "$STAGING"
else
  mv "$CANDIDATE" "$TARGET"
  rmdir "$STAGING"
fi
chmod -R u=rwX,go=rX "$TARGET"

activate() {
  local target="$1"
  ln -s "$target" "${BASE}/.current-$$"
  mv -Tf "${BASE}/.current-$$" "$CURRENT"
}

activate "$TARGET"
if ! systemctl restart "$SERVICE" || ! wait_for_health "$VERSION" "$GIT_SHA"; then
  echo "Échec de santé après bascule; rollback vers ${previous_target:-aucune release}" >&2
  if [ -n "$previous_target" ] && [ -d "$previous_target" ]; then
    activate "$previous_target"
    systemctl restart "$SERVICE"
    if [ -n "$current_version" ] && [ -n "$current_sha" ]; then
      wait_for_health "$current_version" "$current_sha" "$managed_current"
    else
      health_ok
    fi || {
      echo "ROLLBACK MCP EN ÉCHEC" >&2
      exit 2
    }
  fi
  exit 1
fi

mapfile -t OLD_RELEASES < <(
  find "$RELEASES" -mindepth 1 -maxdepth 1 -type d -printf '%T@ %p\n' \
    | sort -nr | tail -n "+$((KEEP_RELEASES + 1))" | cut -d' ' -f2-
)
for old in "${OLD_RELEASES[@]}"; do
  case "$old" in
    "$RELEASES"/*)
      if [ "$old" != "$TARGET" ] && [ "$old" != "$previous_target" ]; then
        rm -rf "$old"
      fi
      ;;
    *) echo "Chemin de purge refusé: $old" >&2; exit 1 ;;
  esac
done

echo "MCP ${VERSION}@${GIT_SHA} déployé atomiquement et vérifié"
