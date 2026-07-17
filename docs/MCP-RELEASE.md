# Releases et déploiement du daemon MCP

## État vérifié le 17 juillet 2026

- version déclarée dans le dépôt, le Registry et le MCP public : `1.20.0` ;
- tag stable et GitHub Release : `mcp-v1.20.0` ;
- SHA source actif : `478d5e448e9442a7ebc3d1d9e207b6586eafe6d5` ;
- archive, somme SHA-256 et bundle Sigstore publiés ;
- poller de releases attestées actif en production ;
- `/healthz` et `l0g://mcp/server` exposent `releaseAttested: true`.

Cette convergence a été prouvée par le tag, les assets GitHub, l'attestation,
le runtime atomique actif, `/healthz` et `serverInfo.version` sur l'endpoint public.

Le daemon MCP suit une chaîne distincte du déploiement statique du site. Le Registry reste un
canal de découverte en preview, principalement destiné aux agrégateurs downstream ; il n'est ni
la source du binaire de production ni une preuve que la version annoncée est vivante.

## Invariants

- Un tag stable a la forme `mcp-vX.Y.Z` et pointe sur un commit de `main`.
- `server.json`, `mcp-server/package.json`, son lockfile, `MCP_VERSION` et le placeholder
  Agent Bench portent exactement la même version.
- Une version du Registry n'est jamais republiée : ses métadonnées sont immuables.
- La GitHub Release contient une archive déterministe, son SHA-256, un SBOM CycloneDX et le
  bundle d'attestation GitHub/Sigstore.
- `zen` n'exécute ni `git pull` ni `npm ci`. Il télécharge les trois assets publics et refuse
  l'archive si l'empreinte, l'identité du workflow, le tag, le SHA source ou le manifeste interne
  ne convergent pas.
- Le Registry est mis à jour par OIDC uniquement après que `https://l0g.fr/api/mcp` expose la
  version et le SHA attendus avec `releaseAttested: true`.

Documentation officielle :

- [publication Registry via GitHub Actions et OIDC](https://modelcontextprotocol.io/registry/github-actions) ;
- [versioning immuable du Registry](https://modelcontextprotocol.io/registry/versioning) ;
- [rôle du Registry et statut preview](https://modelcontextprotocol.io/registry/about).

## Flux de publication

1. Le tag `mcp-vX.Y.Z` déclenche `.github/workflows/publish-mcp.yml`.
2. Le workflow refuse un tag hors de `main` ou des versions désalignées.
3. Il reconstruit l'Agent Surface, exécute le test client et l'Agent Bench, puis produit
   `l0g-mcp-X.Y.Z.tar.gz` avec ses dépendances runtime et son SBOM.
4. GitHub signe la provenance avec un certificat OIDC éphémère et publie les assets de release.
5. Le timer `l0g-mcp-deploy.timer` détecte la nouvelle release. Le script vérifie d'abord
   SHA-256 et Sigstore, contrôle l'archive, la démarre sur un port de smoke test, puis bascule
   `/opt/l0g-mcp-runtime/current` atomiquement.
6. Si le service ou `/healthz` ne renvoie pas la bonne version et le bon SHA, le lien revient
   immédiatement sur la release précédente.
7. GitHub Actions observe la ressource publique `l0g://mcp/server`. Elle publie ensuite
   `server.json` dans le Registry avec `github-oidc`, sans secret permanent, puis vérifie la
   convergence du Registry.

## Préparer une release

Mettre à jour ensemble les quatre coordonnées de version, puis vérifier :

```bash
npm run mcp:release:check
npm run build
```

Après revue, commit et push de `main`, créer un tag annoté sur le commit déjà validé :

```bash
git tag -a mcp-v1.20.0 -m "l0g MCP 1.20.0"
git push origin mcp-v1.20.0
```

Le tag ne doit pas être déplacé. Une correction crée une nouvelle version SemVer.

## Migration unique de zen

Prérequis : Node 20+, `curl`, GNU `tar`, `sha256sum`, `flock` et une version de GitHub CLI
qui fournit `gh attestation verify`. Le checkout historique `/opt/l0g-mcp` sert une dernière fois
à installer les unités ; il n'est plus lu par le daemon après la première release atomique.

Le paquet `gh` de Debian 13 est actuellement trop ancien et ne contient pas la commande
`attestation`. Installer la CLI depuis le dépôt officiel GitHub, après vérification de son
keyring public :

```bash
KEYRING="$(mktemp)"
curl --proto '=https' --tlsv1.2 -fsSL \
  https://cli.github.com/packages/githubcli-archive-keyring.gpg -o "$KEYRING"
printf '%s  %s\n' \
  '6084d5d7bd8e288441e0e94fc6275570895da18e6751f70f057485dc2d1a811b' "$KEYRING" \
  | sha256sum -c -
sudo install -d -m 0755 /etc/apt/keyrings /etc/apt/sources.list.d
sudo install -m 0644 "$KEYRING" /etc/apt/keyrings/githubcli-archive-keyring.gpg
printf 'deb [arch=%s signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main\n' \
  "$(dpkg --print-architecture)" \
  | sudo tee /etc/apt/sources.list.d/github-cli.list >/dev/null
sudo apt-get update
sudo apt-get install -y gh
rm -f "$KEYRING"
gh --version
gh attestation verify --help >/dev/null
```

Sauvegarder les anciennes unités et l'override manuel de SHA avant de les remplacer :

```bash
STAMP="$(date +%Y%m%d%H%M%S)"
sudo install -d -m 0755 /opt/l0g-mcp-runtime/releases
if [ ! -e /opt/l0g-mcp-runtime/current ]; then
  sudo ln -s /opt/l0g-mcp /opt/l0g-mcp-runtime/current
fi
sudo install -m 0755 /opt/l0g-mcp/mcp-server/deploy/l0g-mcp-deploy.sh /usr/local/sbin/l0g-mcp-deploy
sudo cp -a /etc/systemd/system/l0g-mcp.service "/etc/systemd/system/l0g-mcp.service.bak-${STAMP}"
if [ -f /etc/systemd/system/l0g-mcp.service.d/override.conf ]; then
  sudo cp -a /etc/systemd/system/l0g-mcp.service.d/override.conf \
    "/etc/systemd/system/l0g-mcp.service.d/override.conf.bak-${STAMP}"
  sudo rm -f /etc/systemd/system/l0g-mcp.service.d/override.conf
fi
sudo install -m 0644 /opt/l0g-mcp/mcp-server/deploy/l0g-mcp.service /etc/systemd/system/l0g-mcp.service
sudo install -m 0644 /opt/l0g-mcp/mcp-server/deploy/l0g-mcp-deploy.service /etc/systemd/system/l0g-mcp-deploy.service
sudo install -m 0644 /opt/l0g-mcp/mcp-server/deploy/l0g-mcp-deploy.timer /etc/systemd/system/l0g-mcp-deploy.timer
sudo systemctl daemon-reload
sudo systemctl restart l0g-mcp.service
sudo systemctl enable --now l0g-mcp-deploy.timer
sudo systemctl start l0g-mcp-deploy.service
```

Contrôles :

```bash
sudo systemctl status l0g-mcp.service l0g-mcp-deploy.timer --no-pager
sudo journalctl -u l0g-mcp-deploy.service -n 100 --no-pager
curl -fsS http://127.0.0.1:8848/healthz
```

La purge ne conserve que cinq releases, tout en protégeant la version courante et la cible de
rollback. Un downgrade automatique est refusé.
