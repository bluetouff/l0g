#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf -- "$TMP"' EXIT

bash -n "${ROOT}/deploy/deploy.sh" "${ROOT}/deploy/activate-worker.sh" \
  "${ROOT}/deploy/activate-apache-vhost.sh" "${ROOT}/deploy/install-human-traffic.sh" \
  "${ROOT}/deploy/repair-zen-backup-manifest.sh"

VENV_FIXTURE="${TMP}/venv-fixture"
mkdir -p "${VENV_FIXTURE}/lib/python3.13/site-packages/demo_package-1.2.3.dist-info"
: >"${VENV_FIXTURE}/pyvenv.cfg"
cat >"${VENV_FIXTURE}/lib/python3.13/site-packages/demo_package-1.2.3.dist-info/METADATA" <<'EOF'
Metadata-Version: 2.1
Name: demo-package
Version: 1.2.3
EOF
printf '%s\n' 'raise SystemExit("code du virtualenv exécuté")' \
  >"${VENV_FIXTURE}/lib/python3.13/site-packages/sitecustomize.py"
python3 "${ROOT}/deploy/zen-venv-inventory.py" "$VENV_FIXTURE" \
  >"${TMP}/venv-inventory.txt"
grep -Fxq 'demo-package==1.2.3' "${TMP}/venv-inventory.txt"
grep -Fq '/usr/local/libexec/zen-venv-inventory "$v"' \
  "${ROOT}/deploy/repair-zen-backup-manifest.sh"

grep -Fq 'AuthUserFile /etc/apache2/l0g-stats.htpasswd' \
  "${ROOT}/deploy/l0g.fr.apache.conf"
grep -Fq 'Alias /api/v1/human-traffic.json /var/www/l0g-data/human-traffic.json' \
  "${ROOT}/deploy/l0g.fr.apache.conf"
test "$(grep -Fc 'Protocols h2 http/1.1' "${ROOT}/deploy/l0g.fr.apache.conf")" -eq 2
grep -Fq 'BrotliCompressionQuality 5' "${ROOT}/deploy/l0g.fr.apache.conf"
grep -Fq 'AddOutputFilterByType BROTLI_COMPRESS' "${ROOT}/deploy/l0g.fr.apache.conf"
grep -Fq 'Module Apache requis absent' "${ROOT}/deploy/activate-apache-vhost.sh"
test "$(grep -Fc 'systemctl restart apache2' \
  "${ROOT}/deploy/activate-apache-vhost.sh")" -eq 2
grep -Fq "HTTP_VERSION=" "${ROOT}/deploy/activate-apache-vhost.sh"
grep -Fq 'rollback 1' "${ROOT}/deploy/activate-apache-vhost.sh"
grep -Fq "Content-Encoding:[[:space:]]*br" "${ROOT}/deploy/activate-apache-vhost.sh"
grep -Fq 'Require valid-user' "${ROOT}/deploy/l0g.fr.apache.conf"
grep -Fq '<LocationMatch "^/stats(?:/|$)">' \
  "${ROOT}/deploy/l0g.fr.apache.conf"
grep -Fq 'Header unset Cache-Control' "${ROOT}/deploy/l0g.fr.apache.conf"
grep -Fq 'Cache-Control "private, no-store, max-age=0"' \
  "${ROOT}/deploy/l0g.fr.apache.conf"
grep -Fq 'probe_status "stats" 401 https://l0g.fr/stats/' \
  "${ROOT}/deploy/activate-apache-vhost.sh"
grep -Fq 'probe_status "trafic humain" 200 https://l0g.fr/api/v1/human-traffic.json' \
  "${ROOT}/deploy/activate-apache-vhost.sh"
grep -Fq 'minimum_public_cohort !== 5' \
  "${ROOT}/deploy/install-human-traffic.sh"
grep -Fq 'VHOST_MODE="hardened"' "${ROOT}/deploy/activate-apache-vhost.sh"
grep -Fq 'Topologie de vhost l0g inattendue' \
  "${ROOT}/deploy/activate-apache-vhost.sh"
grep -Fq 'RedirectMatch 301 "^/btc/?$" "https://orbit.l0g.fr/"' \
  "${ROOT}/deploy/l0g.fr.apache.conf"
grep -Fq 'RedirectMatch 301 "^/usd/?$" "/guides/lire-le-dollar-dxy-cross-currency-basis/"' \
  "${ROOT}/deploy/l0g.fr.apache.conf"
grep -Fq 'RedirectMatch 301 "^/marches-us/?$" "/sujet/marches-valorisations/"' \
  "${ROOT}/deploy/l0g.fr.apache.conf"
grep -Fq 'RedirectMatch 301 "^/mag7/?$" "/sujet/marches-valorisations/"' \
  "${ROOT}/deploy/l0g.fr.apache.conf"
grep -Fq 'RedirectMatch 301 "^/contact-us/?$" "/contact/"' \
  "${ROOT}/deploy/l0g.fr.apache.conf"
grep -Fq 'RedirectMatch 301 "^/en/contact-us/?$" "/en/contact/"' \
  "${ROOT}/deploy/l0g.fr.apache.conf"
grep -Fq 'RedirectMatch 301 "^/posts/?$" "/"' \
  "${ROOT}/deploy/l0g.fr.apache.conf"
grep -Fq 'RedirectMatch 301 "^/sitemap\.xml$" "/sitemap-index.xml"' \
  "${ROOT}/deploy/l0g.fr.apache.conf"
grep -Fq 'RedirectMatch 301 "^/glossaire/(?:nfp/)?lire-le-rapport-emploi-nfp/?$" "/guides/lire-le-rapport-emploi-nfp/"' \
  "${ROOT}/deploy/l0g.fr.apache.conf"
grep -Fq 'RedirectMatch 301 "^/glossaire/(?:(?:fomc|sep)/)?lire-le-dot-plot-sep/?$" "/guides/lire-le-dot-plot-sep/"' \
  "${ROOT}/deploy/l0g.fr.apache.conf"
grep -Fq 'RedirectMatch 301 "^/glossaire/m2/m2-masse-monetaire-risk-on/?$" "/guides/m2-masse-monetaire-risk-on/"' \
  "${ROOT}/deploy/l0g.fr.apache.conf"
grep -Fq 'RedirectMatch 301 "^/glossaire/core-cpi/lire-le-cpi-inflation-us/?$" "/guides/lire-le-cpi-inflation-us/"' \
  "${ROOT}/deploy/l0g.fr.apache.conf"
grep -Fq 'RedirectMatch 301 "^/og/le-grand-peage-de-la-facture-1-le-portail-ampute\.png$" "/illustrations/news/e-invoicing-toll-1-v2.jpg"' \
  "${ROOT}/deploy/l0g.fr.apache.conf"
grep -Fq 'RedirectMatch 301 "^/og/le-grand-peage-de-la-facture-3-le-prix-du-gratuit\.png$" "/illustrations/news/e-invoicing-toll-3-v1.jpg"' \
  "${ROOT}/deploy/l0g.fr.apache.conf"
grep -Fq 'RewriteRule "^/?(?:api/mcp(?:/compact)?/|compact/)?\.well-known/mcp/?$" "/.well-known/mcp.json" [R=308,L,NE]' \
  "${ROOT}/deploy/l0g.fr.apache.conf"
grep -Fq 'RedirectMatch gone "^/hard-commodities/?$"' \
  "${ROOT}/deploy/l0g.fr.apache.conf"
grep -Fq 'RedirectMatch gone "^/calendrier-eco/?$"' \
  "${ROOT}/deploy/l0g.fr.apache.conf"
grep -Fq 'ErrorDocument 404 /404.html' "${ROOT}/deploy/l0g.fr.apache.conf"
grep -Fq 'ErrorDocument 410 /404.html' "${ROOT}/deploy/l0g.fr.apache.conf"
grep -Fq 'probe_status "ancienne route BTC" 301 https://l0g.fr/btc/' \
  "${ROOT}/deploy/activate-apache-vhost.sh"
grep -Fq 'probe_status "contact FR" 200 https://l0g.fr/contact/' \
  "${ROOT}/deploy/activate-apache-vhost.sh"
grep -Fq 'probe_status "contact EN" 200 https://l0g.fr/en/contact/' \
  "${ROOT}/deploy/activate-apache-vhost.sh"
grep -Fq 'probe_status "ancien contact" 301 https://l0g.fr/contact-us/' \
  "${ROOT}/deploy/activate-apache-vhost.sh"
grep -Fq 'probe_status "ancien index posts" 301 https://l0g.fr/posts/' \
  "${ROOT}/deploy/activate-apache-vhost.sh"
grep -Fq 'probe_status "alias sitemap" 301 https://l0g.fr/sitemap.xml' \
  "${ROOT}/deploy/activate-apache-vhost.sh"
grep -Fq 'probe_status "ancien lien glossaire NFP" 301 https://l0g.fr/glossaire/nfp/lire-le-rapport-emploi-nfp' \
  "${ROOT}/deploy/activate-apache-vhost.sh"
grep -Fq 'probe_status "ancien lien glossaire dot plot" 301 https://l0g.fr/glossaire/fomc/lire-le-dot-plot-sep' \
  "${ROOT}/deploy/activate-apache-vhost.sh"
grep -Fq 'probe_status "ancien lien glossaire M2" 301 https://l0g.fr/glossaire/m2/m2-masse-monetaire-risk-on' \
  "${ROOT}/deploy/activate-apache-vhost.sh"
grep -Fq 'probe_status "ancien lien glossaire CPI" 301 https://l0g.fr/glossaire/core-cpi/lire-le-cpi-inflation-us' \
  "${ROOT}/deploy/activate-apache-vhost.sh"
grep -Fq 'probe_status "découverte MCP racine" 308 https://l0g.fr/.well-known/mcp' \
  "${ROOT}/deploy/activate-apache-vhost.sh"
grep -Fq 'probe_status "découverte MCP API" 308 https://l0g.fr/api/mcp/.well-known/mcp' \
  "${ROOT}/deploy/activate-apache-vhost.sh"
grep -Fq 'probe_status "ancienne carte Grand Péage 1" 301 https://l0g.fr/og/le-grand-peage-de-la-facture-1-le-portail-ampute.png' \
  "${ROOT}/deploy/activate-apache-vhost.sh"
grep -Fq 'probe_status "ancienne carte Grand Péage 3" 301 https://l0g.fr/og/le-grand-peage-de-la-facture-3-le-prix-du-gratuit.png' \
  "${ROOT}/deploy/activate-apache-vhost.sh"
grep -Fq 'probe_status "ancienne route matières premières" 410 https://l0g.fr/hard-commodities/' \
  "${ROOT}/deploy/activate-apache-vhost.sh"
grep -Fq 'probe_status "route inconnue" 404 https://l0g.fr/route-inconnue-probe-l0g' \
  "${ROOT}/deploy/activate-apache-vhost.sh"
grep -Fq 'Cette route ne mène plus nulle part.' \
  "${ROOT}/deploy/activate-apache-vhost.sh"

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
  local embed_coordinates="${3:-true}"
  local site="${TMP}/site"
  rm -rf -- "$site"
  mkdir -p "$site"
  printf '%s\n' "$body" >"${site}/index.html"
  {
    printf 'L0G_RELEASE_SCHEMA=1\n'
    printf 'L0G_RELEASE_REPOSITORY=bluetouff/l0g\n'
    printf 'L0G_RELEASE_SOURCE_REF=refs/heads/main\n'
    printf 'L0G_RELEASE_SOURCE_SHA=%s\n' "$SOURCE_SHA"
    printf 'L0G_RELEASE_RUN_ID=1\n'
    printf 'L0G_RELEASE_RUN_ATTEMPT=1\n'
  } >"${BUILT}/source.env"
  if [ "$embed_coordinates" = true ]; then
    cp "${BUILT}/source.env" "${site}/source.env"
  fi
  tar -C "$site" -czf "${BUILT}/l0g-site.tar.gz" .
  (cd "$BUILT" && sha256sum l0g-site.tar.gz >l0g-site.tar.gz.sha256)
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
cmp -s "${BUILT}/source.env" "${BASE}/current/source.env"
FIRST_BUILT="$(cat "${BASE}/.last_built_sha")"
[ "$(cat "${BASE}/.last_source_sha")" = "$SOURCE_SHA" ]

publish_artifact missing-provenance false false
if L0G_DEPLOY_REPO="file://${REMOTE}" \
   L0G_DEPLOY_BASE="$BASE" \
   L0G_DEPLOY_GH_BIN="$FAKE_GH" \
   PATH="${TMP}/bin:${PATH}" \
     bash "${ROOT}/deploy/deploy.sh" >/dev/null 2>&1; then
  echo "Le déploiement sans provenance attestée aurait dû être refusé" >&2
  exit 1
fi
[ "$(cat "${BASE}/current/index.html")" = stable ]
[ "$(cat "${BASE}/.last_built_sha")" = "$FIRST_BUILT" ]

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

printf '{"ok":true,"validActivation":true,"missingProvenanceActivation":false,"tamperedActivation":false}\n'
