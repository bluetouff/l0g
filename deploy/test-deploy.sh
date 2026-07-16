#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf -- "$TMP"' EXIT

REMOTE="${TMP}/remote.git"
SOURCE="${TMP}/source"
BUILT="${TMP}/built"
BASE="${TMP}/www"
FAKE_GH="${TMP}/gh"
mkdir -p "${TMP}/bin"
if ! command -v flock >/dev/null 2>&1; then
  printf '#!/usr/bin/env bash\nexit 0\n' >"${TMP}/bin/flock"
  chmod 0755 "${TMP}/bin/flock"
fi
if ! mv --help 2>&1 | grep -q -- '--no-target-directory'; then
  cat >"${TMP}/bin/mv" <<'SH'
#!/usr/bin/env bash
if [ "${1:-}" = "-Tf" ]; then
  shift
  exec /bin/mv -fh "$@"
fi
exec /bin/mv "$@"
SH
  chmod 0755 "${TMP}/bin/mv"
fi

git init -q --bare "$REMOTE"
git init -q -b main "$SOURCE"
git -C "$SOURCE" config user.name test
git -C "$SOURCE" config user.email test@example.invalid
printf 'source\n' >"${SOURCE}/README"
git -C "$SOURCE" add README
git -C "$SOURCE" commit -q -m source
git -C "$SOURCE" remote add origin "$REMOTE"
git -C "$SOURCE" push -q -u origin main
SOURCE_SHA="$(git -C "$SOURCE" rev-parse HEAD)"

git init -q -b built "$BUILT"
git -C "$BUILT" config user.name test
git -C "$BUILT" config user.email test@example.invalid

publish_artifact() {
  local body="$1"
  local preserve_bundle="${2:-false}"
  local site="${TMP}/site"
  rm -rf -- "$site"
  mkdir -p "$site"
  printf '%s\n' "$body" >"${site}/index.html"
  tar -C "$site" -czf "${BUILT}/l0g-site.tar.gz" .
  (cd "$BUILT" && sha256sum l0g-site.tar.gz >l0g-site.tar.gz.sha256)
  {
    printf 'L0G_RELEASE_SCHEMA=1\n'
    printf 'L0G_RELEASE_REPOSITORY=bluetouff/l0g\n'
    printf 'L0G_RELEASE_SOURCE_REF=refs/heads/main\n'
    printf 'L0G_RELEASE_SOURCE_SHA=%s\n' "$SOURCE_SHA"
    printf 'L0G_RELEASE_RUN_ID=1\n'
    printf 'L0G_RELEASE_RUN_ATTEMPT=1\n'
  } >"${BUILT}/source.env"
  if [ "$preserve_bundle" != true ]; then
    {
      printf 'digest=%s\n' "$(sha256sum "${BUILT}/l0g-site.tar.gz" | awk '{print $1}')"
      printf 'source=%s\n' "$SOURCE_SHA"
    } >"${BUILT}/l0g-site.tar.gz.sigstore.jsonl"
  fi
  git -C "$BUILT" add -A
  git -C "$BUILT" commit -q -m "build ${SOURCE_SHA}"
  if git -C "$BUILT" remote get-url origin >/dev/null 2>&1; then
    git -C "$BUILT" push -q -f origin built
  else
    git -C "$BUILT" remote add origin "$REMOTE"
    git -C "$BUILT" push -q -u origin built
  fi
}

cat >"$FAKE_GH" <<'SH'
#!/usr/bin/env bash
set -euo pipefail
[ "$1" = attestation ] && [ "$2" = verify ]
archive="$3"
shift 3
bundle=""
source_digest=""
repo=""
workflow=""
source_ref=""
while [ "$#" -gt 0 ]; do
  case "$1" in
    --bundle) bundle="$2"; shift 2 ;;
    --source-digest) source_digest="$2"; shift 2 ;;
    --repo) repo="$2"; shift 2 ;;
    --signer-workflow) workflow="$2"; shift 2 ;;
    --source-ref) source_ref="$2"; shift 2 ;;
    --deny-self-hosted-runners) shift ;;
    *) exit 91 ;;
  esac
done
[ "$repo" = bluetouff/l0g ]
[ "$workflow" = bluetouff/l0g/.github/workflows/build.yml ]
[ "$source_ref" = refs/heads/main ]
[ "$(sed -n 's/^source=//p' "$bundle")" = "$source_digest" ]
[ "$(sed -n 's/^digest=//p' "$bundle")" = "$(sha256sum "$archive" | awk '{print $1}')" ]
SH
chmod 0755 "$FAKE_GH"

publish_artifact stable
L0G_DEPLOY_REPO="file://${REMOTE}" \
L0G_DEPLOY_BASE="$BASE" \
L0G_DEPLOY_GH_BIN="$FAKE_GH" \
PATH="${TMP}/bin:${PATH}" \
  bash "${ROOT}/deploy/deploy.sh"
[ "$(cat "${BASE}/current/index.html")" = stable ]
FIRST_BUILT="$(cat "${BASE}/.last_built_sha")"
[ "$(cat "${BASE}/.last_source_sha")" = "$SOURCE_SHA" ]

publish_artifact tampered true
if L0G_DEPLOY_REPO="file://${REMOTE}" \
   L0G_DEPLOY_BASE="$BASE" \
   L0G_DEPLOY_GH_BIN="$FAKE_GH" \
   PATH="${TMP}/bin:${PATH}" \
     bash "${ROOT}/deploy/deploy.sh" >/dev/null 2>&1; then
  echo "Le déploiement altéré aurait dû être refusé" >&2
  exit 1
fi
[ "$(cat "${BASE}/current/index.html")" = stable ]
[ "$(cat "${BASE}/.last_built_sha")" = "$FIRST_BUILT" ]

printf '{"ok":true,"validActivation":true,"tamperedActivation":false}\n'
