# Serveur MCP de l0g.fr

Serveur **Model Context Protocol** en lecture seule, qui expose les données de l0g.fr
(indices de risque, analyses, guides de référence, sujets) à des agents IA via le
transport **Streamable HTTP** (spec 2025-11-25, le transport SSE est déprécié).

Endpoint public visé : `https://l0g.fr/mcp`

## Architecture

```
agent / client MCP
        |  HTTPS  (Streamable HTTP, POST JSON-RPC)
        v
   Apache (443, l0g.fr)  ──reverse proxy──>  127.0.0.1:8848  (service Node, systemd)
                                                     |
                                                     | lit (lecture seule)
                                                     v
                          /var/www/html/l0g/current/api/v1/catalog.json
                          /var/www/html/l0g/current/api/v1/risk.json
                          /var/www/html/l0g/current/posts|guides/<slug>/index.html
```

- Le service Node **n'écoute qu'en 127.0.0.1**, jamais exposé directement.
- Les données proviennent du **site déjà déployé** : `catalog.json` (généré au build par
  `src/pages/api/v1/catalog.json.ts`) et `risk.json` (API existante). Le service ne
  fait que **lire** ces fichiers, avec un cache TTL de 60 s.
- Mode **stateless + réponse JSON** : pas de session à stocker, un serveur et un
  transport neufs par requête.

## Tools exposés (tous `readOnlyHint`)

| Tool | Arguments | Renvoie |
|------|-----------|---------|
| `get_risk_indices` | aucun | indices de risque (US, EU, Yen, Energie) + résumé confluence |
| `search_content` | `query`, `limit?` | analyses et guides correspondants |
| `list_recent_analyses` | `limit?` | dernières analyses |
| `list_guides` | aucun | guides de référence |
| `search_by_topic` | `topic`, `limit?` | analyses d'un sujet (hubs `/sujets/`) |
| `get_article` | `slug` | texte complet d'une analyse ou d'un guide |

## Sécurité

- Écoute **127.0.0.1** uniquement ; TLS et exposition gérés par Apache.
- **Validation Host et Origin** sur chaque requête (anti DNS rebinding, exigé par la spec).
- **Lecture seule** : aucune écriture disque, slugs en **allowlist** (le path traversal
  est rejeté), taille de corps bornée à 1 Mo.
- **Rate limit** par IP (120 req/min par défaut, via `X-Forwarded-For` posé par Apache).
- systemd **durci** : `DynamicUser`, `ProtectSystem=strict`, capacités vidées,
  `ReadOnlyPaths`, `MemoryMax`, filtre d'appels système.

## Déploiement pas à pas (Debian, serveur « zen »)

> Hypothèses : Apache sert déjà l0g.fr en HTTPS, le site est déployé dans
> `/var/www/html/l0g/current`. Node 20+ requis.

### 1. Installer Node 20+ (si absent)

```bash
node -v   # si < 20, installer la LTS :
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Récupérer le code et installer les dépendances

```bash
sudo mkdir -p /opt/l0g-mcp
sudo chown "$USER" /opt/l0g-mcp
git clone https://github.com/bluetouff/l0g.git /opt/l0g-mcp
cd /opt/l0g-mcp/mcp-server
npm ci --omit=dev          # ou : npm install --omit=dev
```

### 3. Test à blanc (en local, avant Apache)

```bash
L0G_DATA_DIR=/var/www/html/l0g/current node server.mjs &
curl -s http://127.0.0.1:8848/healthz       # -> {"ok":true}
node test-client.mjs                          # liste les tools et teste chaque appel
kill %1
```

### 4. Installer le service systemd

```bash
sudo cp /opt/l0g-mcp/mcp-server/deploy/l0g-mcp.service /etc/systemd/system/
#  Vérifier le chemin de node dans le fichier (ExecStart) :  which node
sudo systemctl daemon-reload
sudo systemctl enable --now l0g-mcp
systemctl status l0g-mcp --no-pager
curl -s http://127.0.0.1:8848/healthz        # -> {"ok":true}
```

### 5. Brancher Apache (reverse proxy)

```bash
sudo a2enmod proxy proxy_http headers
```

Inclure le bloc de `deploy/apache-l0g-mcp.conf` **dans le VirtualHost HTTPS de l0g.fr**
(le fichier `*-le-ssl.conf` généré par certbot, entre `<VirtualHost *:443>` et
`</VirtualHost>`). Puis :

```bash
sudo apache2ctl configtest        # Syntax OK
sudo systemctl reload apache2
```

### 6. Vérifier de l'extérieur

```bash
curl -s -X POST https://l0g.fr/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | head -c 400
```

Ou pointer un client compatible (Claude Desktop via `mcp-remote`, l'inspecteur MCP, etc.)
sur `https://l0g.fr/mcp`.

## Mises à jour

- **Données** (nouvel article, indices) : automatique. Le site se redéploie, le service
  relit `catalog.json` / `risk.json` au plus tard 60 s après.
- **Code du serveur** :

```bash
cd /opt/l0g-mcp && git pull
cd mcp-server && npm ci --omit=dev
sudo systemctl restart l0g-mcp
```

## Variables d'environnement

| Variable | Défaut | Rôle |
|----------|--------|------|
| `MCP_HOST` | `127.0.0.1` | interface d'écoute |
| `MCP_PORT` | `8848` | port local |
| `MCP_PATH` | `/mcp` | chemin de l'endpoint |
| `L0G_DATA_DIR` | `/var/www/html/l0g/current` | racine du site déployé (lecture) |
| `L0G_SITE` | `https://l0g.fr` | base des URL renvoyées |
| `MCP_ALLOWED_HOSTS` | `l0g.fr,127.0.0.1,localhost` | en-têtes Host acceptés |
| `MCP_ALLOWED_ORIGINS` | `https://l0g.fr` | en-têtes Origin acceptés |
| `MCP_RATE_MAX` | `120` | requêtes/min/IP |
