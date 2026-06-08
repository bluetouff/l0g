#!/usr/bin/env bash
#
# l0g.fr — déploiement pull-based depuis la branche `built`.
# Tourne sur zen sous l'utilisateur dédié `l0gdeploy` via un timer systemd.
# Aucune connexion entrante : seulement du HTTPS sortant vers github.com.
#
set -euo pipefail

# --- Config ---------------------------------------------------------------
REPO="https://github.com/bluetouff/l0g.git" # dépôt public, lecture seule, aucun credential
BRANCH="built"
BASE="/var/www/html/l0g"
RELEASES="$BASE/releases"
CURRENT="$BASE/current"
KEEP=5 # nombre de releases conservées

# --- Ne rien faire si rien n'a changé -------------------------------------
REMOTE_SHA="$(git ls-remote "$REPO" "refs/heads/$BRANCH" | awk '{print $1}')"
if [ -z "$REMOTE_SHA" ]; then
  echo "Impossible de lire la branche distante $BRANCH" >&2
  exit 1
fi

LAST_SHA="$(cat "$BASE/.last_sha" 2>/dev/null || true)"
if [ "$REMOTE_SHA" = "$LAST_SHA" ]; then
  exit 0 # déjà à jour
fi

# --- Nouveau build : clone superficiel ------------------------------------
mkdir -p "$RELEASES"
TS="$(date +%Y%m%d%H%M%S)"
TARGET="$RELEASES/$TS"

git clone --quiet --depth 1 --branch "$BRANCH" --single-branch "$REPO" "$TARGET"
rm -rf "$TARGET/.git" # on ne sert pas de métadonnées git

# --- Bascule atomique du symlink ------------------------------------------
ln -sfn "$TARGET" "$CURRENT.tmp"
mv -Tf "$CURRENT.tmp" "$CURRENT"

echo "$REMOTE_SHA" >"$BASE/.last_sha"
echo "Déployé $TS ($REMOTE_SHA)"

# --- Purge des anciennes releases -----------------------------------------
# shellcheck disable=SC2012
ls -1dt "$RELEASES"/*/ 2>/dev/null | tail -n "+$((KEEP + 1))" | xargs -r rm -rf
