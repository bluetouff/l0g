#!/usr/bin/env bash
# Pull-based, fail-closed deployment of the attested static release in `built`.
set -euo pipefail
umask 0077

REPOSITORY="${L0G_DEPLOY_REPOSITORY:-bluetouff/l0g}"
REPO="${L0G_DEPLOY_REPO:-https://github.com/${REPOSITORY}.git}"
SOURCE_BRANCH="${L0G_DEPLOY_SOURCE_BRANCH:-main}"
ARTIFACT_BRANCH="${L0G_DEPLOY_ARTIFACT_BRANCH:-built}"
BASE="${L0G_DEPLOY_BASE:-/var/www/html/l0g}"
RELEASES="${BASE}/releases"
CURRENT="${BASE}/current"
KEEP="${L0G_DEPLOY_KEEP:-5}"
GH_BIN="${L0G_DEPLOY_GH_BIN:-gh}"
ARCHIVE_NAME="l0g-site.tar.gz"
BUNDLE_NAME="${ARCHIVE_NAME}.sigstore.jsonl"
CHECKSUM_NAME="${ARCHIVE_NAME}.sha256"
COORDINATES_NAME="source.env"

for command in cmp git tar gzip sha256sum flock "$GH_BIN"; do
  command -v "$command" >/dev/null 2>&1 || {
    echo "Commande requise absente: $command" >&2
    exit 1
  }
done

[[ "$KEEP" =~ ^[1-9][0-9]*$ ]] || {
  echo "L0G_DEPLOY_KEEP doit être un entier strictement positif" >&2
  exit 1
}

mkdir -p "$RELEASES"
exec 9>"${BASE}/deploy.lock"
flock -n 9 || exit 0

TMP="$(mktemp -d)"
STAGING=""
export HOME="${TMP}/home"
export XDG_CACHE_HOME="${TMP}/cache"
export XDG_CONFIG_HOME="${TMP}/config"
mkdir -p "$HOME" "$XDG_CACHE_HOME" "$XDG_CONFIG_HOME"

cleanup() {
  if [ -n "$STAGING" ] && [[ "$STAGING" == "$RELEASES"/.staging-* ]]; then
    rm -rf -- "$STAGING"
  fi
  rm -rf -- "$TMP"
}
trap cleanup EXIT

read_remote_refs() {
  git ls-remote "$REPO" \
    "refs/heads/${SOURCE_BRANCH}" \
    "refs/heads/${ARTIFACT_BRANCH}"
}

remote_sha() {
  local refs="$1"
  local branch="$2"
  awk -v ref="refs/heads/${branch}" '$2 == ref { print $1 }' <<<"$refs"
}

validate_sha() {
  [[ "$1" =~ ^[0-9a-f]{40}$ ]]
}

REFS="$(read_remote_refs)"
REMOTE_SOURCE_SHA="$(remote_sha "$REFS" "$SOURCE_BRANCH")"
REMOTE_BUILT_SHA="$(remote_sha "$REFS" "$ARTIFACT_BRANCH")"
if ! validate_sha "$REMOTE_SOURCE_SHA" || ! validate_sha "$REMOTE_BUILT_SHA"; then
  echo "Impossible de résoudre ${SOURCE_BRANCH} et ${ARTIFACT_BRANCH}" >&2
  exit 1
fi

LAST_BUILT_SHA="$(cat "${BASE}/.last_built_sha" 2>/dev/null || true)"
if [ "$REMOTE_BUILT_SHA" = "$LAST_BUILT_SHA" ] && [ -L "$CURRENT" ] && [ -d "$CURRENT" ]; then
  exit 0
fi

CHECKOUT="${TMP}/built"
git clone --quiet --depth 1 --branch "$ARTIFACT_BRANCH" --single-branch "$REPO" "$CHECKOUT"
CLONED_BUILT_SHA="$(git -C "$CHECKOUT" rev-parse HEAD)"
if [ "$CLONED_BUILT_SHA" != "$REMOTE_BUILT_SHA" ]; then
  echo "Le clone built ne correspond pas au HEAD distant attendu" >&2
  exit 1
fi

ARCHIVE="${CHECKOUT}/${ARCHIVE_NAME}"
BUNDLE="${CHECKOUT}/${BUNDLE_NAME}"
CHECKSUM="${CHECKOUT}/${CHECKSUM_NAME}"
COORDINATES="${CHECKOUT}/${COORDINATES_NAME}"
for file in "$ARCHIVE" "$BUNDLE" "$CHECKSUM" "$COORDINATES"; do
  [ -f "$file" ] || {
    echo "Artefact built incomplet: ${file##*/}" >&2
    exit 1
  }
done

read_coordinate() {
  local key="$1"
  local value
  value="$(awk -F= -v key="$key" '
    $1 == key { count += 1; value = substr($0, length(key) + 2) }
    END { if (count != 1) exit 1; print value }
  ' "$COORDINATES")" || {
    echo "Coordonnée absente ou dupliquée: $key" >&2
    exit 1
  }
  printf '%s' "$value"
}

SOURCE_SCHEMA="$(read_coordinate L0G_RELEASE_SCHEMA)"
SOURCE_REPOSITORY="$(read_coordinate L0G_RELEASE_REPOSITORY)"
SOURCE_REF="$(read_coordinate L0G_RELEASE_SOURCE_REF)"
SOURCE_SHA="$(read_coordinate L0G_RELEASE_SOURCE_SHA)"
RUN_ID="$(read_coordinate L0G_RELEASE_RUN_ID)"
RUN_ATTEMPT="$(read_coordinate L0G_RELEASE_RUN_ATTEMPT)"

if [ "$SOURCE_SCHEMA" != "1" ] || \
   [ "$SOURCE_REPOSITORY" != "$REPOSITORY" ] || \
   [ "$SOURCE_REF" != "refs/heads/${SOURCE_BRANCH}" ] || \
   ! validate_sha "$SOURCE_SHA" || \
   [[ ! "$RUN_ID" =~ ^[1-9][0-9]*$ ]] || \
   [[ ! "$RUN_ATTEMPT" =~ ^[1-9][0-9]*$ ]]; then
  echo "Coordonnées de release statique invalides" >&2
  exit 1
fi
if [ "$SOURCE_SHA" != "$REMOTE_SOURCE_SHA" ]; then
  echo "Refus: built provient de ${SOURCE_SHA}, mais main pointe sur ${REMOTE_SOURCE_SHA}" >&2
  exit 1
fi

checksum_line="$(cat "$CHECKSUM")"
checksum_digest="${checksum_line%%  *}"
checksum_name="${checksum_line#*  }"
if [[ ! "$checksum_digest" =~ ^[0-9a-f]{64}$ ]] || [ "$checksum_name" != "$ARCHIVE_NAME" ]; then
  echo "Format de checksum statique inattendu" >&2
  exit 1
fi
(cd "$CHECKOUT" && sha256sum -c "$CHECKSUM_NAME")

"$GH_BIN" attestation verify "$ARCHIVE" \
  --bundle "$BUNDLE" \
  --repo "$REPOSITORY" \
  --signer-workflow "${REPOSITORY}/.github/workflows/build.yml" \
  --source-ref "refs/heads/${SOURCE_BRANCH}" \
  --source-digest "$SOURCE_SHA" \
  --deny-self-hosted-runners

ARCHIVE_LIST="${TMP}/archive.list"
tar -tzf "$ARCHIVE" >"$ARCHIVE_LIST"
if [ ! -s "$ARCHIVE_LIST" ]; then
  echo "Archive statique vide" >&2
  exit 1
fi
while IFS= read -r entry; do
  case "$entry" in
    ./|./*) ;;
    *) echo "Chemin hors racine dans l'archive: $entry" >&2; exit 1 ;;
  esac
  case "/${entry#./}/" in
    */../*) echo "Traversée de chemin dans l'archive: $entry" >&2; exit 1 ;;
  esac
done <"$ARCHIVE_LIST"
if tar -tvzf "$ARCHIVE" | awk '
  substr($1, 1, 1) != "-" && substr($1, 1, 1) != "d" { bad = 1 }
  END { exit(bad ? 0 : 1) }
'; then
  echo "L'archive contient un lien ou un type de fichier spécial" >&2
  exit 1
fi

STAGING="${RELEASES}/.staging-${REMOTE_BUILT_SHA}-$$"
mkdir -p "$STAGING"
tar --extract --gzip --file "$ARCHIVE" --directory "$STAGING" \
  --no-same-owner --no-same-permissions
[ -f "${STAGING}/index.html" ] || {
  echo "Release statique sans index.html" >&2
  exit 1
}
[ -f "${STAGING}/${COORDINATES_NAME}" ] || {
  echo "Release statique sans coordonnées de provenance attestées" >&2
  exit 1
}
cmp -s "$COORDINATES" "${STAGING}/${COORDINATES_NAME}" || {
  echo "Les coordonnées de provenance diffèrent entre built et l'archive attestée" >&2
  exit 1
}

# Ferme la fenêtre de course entre le premier ls-remote et la bascule.
LATEST_REFS="$(read_remote_refs)"
LATEST_SOURCE_SHA="$(remote_sha "$LATEST_REFS" "$SOURCE_BRANCH")"
LATEST_BUILT_SHA="$(remote_sha "$LATEST_REFS" "$ARTIFACT_BRANCH")"
if [ "$LATEST_SOURCE_SHA" != "$REMOTE_SOURCE_SHA" ] || [ "$LATEST_BUILT_SHA" != "$REMOTE_BUILT_SHA" ]; then
  echo "Les références distantes ont changé pendant la vérification; activation annulée" >&2
  exit 1
fi

TS="$(date +%Y%m%d%H%M%S)"
TARGET="${RELEASES}/${TS}-${REMOTE_BUILT_SHA}"
mv "$STAGING" "$TARGET"
STAGING=""
chmod -R u=rwX,go=rX "$TARGET"

NEXT_LINK="${BASE}/.current-$$"
ln -s "$TARGET" "$NEXT_LINK"
mv -Tf "$NEXT_LINK" "$CURRENT"

printf '%s\n' "$REMOTE_BUILT_SHA" >"${BASE}/.last_built_sha.tmp"
mv -f "${BASE}/.last_built_sha.tmp" "${BASE}/.last_built_sha"
printf '%s\n' "$SOURCE_SHA" >"${BASE}/.last_source_sha.tmp"
mv -f "${BASE}/.last_source_sha.tmp" "${BASE}/.last_source_sha"

echo "Déployé ${TS}: main=${SOURCE_SHA} built=${REMOTE_BUILT_SHA} run=${RUN_ID}/${RUN_ATTEMPT}"

CURRENT_TARGET="$(readlink -f "$CURRENT")"
OLD_RELEASE_LIST="${TMP}/old-releases.list"
ls -1dt "$RELEASES"/*/ 2>/dev/null | tail -n "+$((KEEP + 1))" >"$OLD_RELEASE_LIST" || true
while IFS= read -r old; do
  old="${old%/}"
  case "$old" in
    "$RELEASES"/*)
      if [ "$old" != "$CURRENT_TARGET" ]; then
        rm -rf -- "$old"
      fi
      ;;
    *) echo "Chemin de purge refusé: $old" >&2; exit 1 ;;
  esac
done <"$OLD_RELEASE_LIST"
