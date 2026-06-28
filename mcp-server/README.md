# Serveur MCP de l0g.fr

Serveur **Model Context Protocol** en lecture seule, qui expose les données de l0g.fr
(Agent Surface, OpenAPI, NDJSON, evidence graph, claims, sources, fraîcheur, intégrité, changefeed, historique des signaux, analyses, guides) à des agents IA via resources, resource templates et tools, avec le
transport **Streamable HTTP** (spec 2025-11-25, le transport SSE est déprécié).

Endpoint public visé : `https://l0g.fr/api/mcp`

## Architecture

```
agent / client MCP
        |  HTTPS  (Streamable HTTP, POST JSON-RPC)
        v
   Apache (443, l0g.fr)  ──reverse proxy──>  127.0.0.1:8848  (service Node, systemd)
                                                     |
                                                     | lit (lecture seule)
                                                     v
                          /var/www/html/l0g/current/agents.json
                          /var/www/html/l0g/current/openapi.json
                          /var/www/html/l0g/current/api/v1/*.json|*.ndjson
                          /var/www/html/l0g/current/risk-events.json
                          /var/www/html/l0g/current/confluence.json
                          /var/www/html/l0g/current/posts|guides/<slug>/index.html
```

- Le service Node **n'écoute qu'en 127.0.0.1**, jamais exposé directement.
- Les données proviennent du **site déjà déployé** : `agents.json`, `catalog.json`,
  `claims.json`, `evidence-graph.json`, `sources.json`, `freshness.json`, `integrity.json`,
  `changes.json`, leurs variantes NDJSON, `openapi.json`, `risk.json`, `risk-events.json`
  et `confluence.json`. Le service ne fait que **lire** ces fichiers, avec un cache TTL de 60 s.
- Mode **stateless + réponse JSON** : pas de session à stocker, un serveur et un
  transport neufs par requête.

## Resources exposées

Les documents et datasets stables sont exposés comme **resources MCP**. Les tools restent réservés
aux opérations de recherche, filtrage et synthèse.

### Resources statiques

| URI | Contenu |
|-----|---------|
| `l0g://agent-manifest` | manifeste Agent Surface |
| `l0g://openapi` | contrat OpenAPI complet |
| `l0g://freshness` | fraîcheur du corpus |
| `l0g://integrity` | empreintes SHA-256 canoniques |
| `l0g://changes/latest` | dernières publications et révisions |
| `l0g://signals/current` | état courant des signaux |

### Resource templates

| Template | Contenu |
|----------|---------|
| `l0g://articles/{slug}` | première page d'un article avec métadonnées, références et texte |
| `l0g://articles/{slug}{?section,offset,limit}` | page ciblée d'un article (`body`, `head`, `tail`, `sources`) |
| `l0g://articles/{slug}{?cursor}` | continuation d'article via `nextCursor` |
| `l0g://guides/{slug}` | première page d'un guide avec métadonnées et texte |
| `l0g://guides/{slug}{?section,offset,limit}` | page ciblée d'un guide (`body`, `head`, `tail`, `sources`) |
| `l0g://guides/{slug}{?cursor}` | continuation de guide via `nextCursor` |
| `l0g://claims/{claim_id}` | relation affirmation-source |
| `l0g://sources/{source_id}` | source primaire ou hôte cité |
| `l0g://signals/{instrument}/current` | signal courant + historique de franchissement |
| `l0g://methodologies/{instrument}` | fiche méthodologique |

`resources/list` énumère aussi les instances connues via les templates. Les variables principales
ont des callbacks de complétion. Le service public actuel est stateless en requête/réponse et
n’annonce pas `resources.subscribe` ni `resources.listChanged` : pour surveiller le corpus, lire
`l0g://changes/latest` ou appeler `get_changefeed`.

## Tools exposés (tous `readOnlyHint`)

Tous les tools renvoient désormais :

- un résumé humain court dans `content`;
- les données exploitables dans `structuredContent`;
- un `outputSchema` déclaré et validé par le SDK.

Le JSON n'est donc plus caché dans un bloc texte à reparser.

| Tool | Arguments | Renvoie |
|------|-----------|---------|
| `get_agent_manifest` | aucun | capacités, endpoints, règles d'usage et politiques de preuve |
| `get_risk_indices` | aucun | indices de risque (US, EU, Yen, Energie) + résumé confluence |
| `get_signal_history` | `key?`, `limit?` | historique des franchissements de niveau + état courant + confluence |
| `get_openapi_schema` | `mode?`, `path?` | contrat OpenAPI résumé, ciblé par endpoint ou complet |
| `get_ndjson_feed` | `feed`, `recordType?`, `limit?` | flux NDJSON allowlistés : catalogue, claims, evidence graph, changes |
| `get_freshness` | `limit?` | derniers contenus, compteurs, temporalité par signal et politique de fraîcheur |
| `search_content` | `query`, `mode?`, `limit?` | recherche plein texte locale sur HTML généré, ou scoring catalogue historique |
| `get_claims` | `articleSlug?`, `kind?`, `query?`, `limit?` | claims typées et références cliquables, datées quand détectable |
| `get_claim` | `claimId` | une claim précise, ses liens ressource et son article |
| `get_claim_evidence` | `claimId`, `limit?` | preuve et références d'une claim, avec contenus reliés isolés dans `relatedContent` |
| `list_article_claims` | `articleSlug`, `kind?`, `limit?` | claims d'un article, utilisables comme points d'entrée du graphe |
| `find_claims_by_source` | `sourceId`, `kind?`, `limit?` | claims rattachées à une source primaire, un nom ou un host cité |
| `get_source` | `sourceId`, `limit?` | source primaire ou hôte cité, plus claims associées |
| `get_evidence_graph` | `articleSlug?`, `nodeType?`, `limit?` | sous-graphe direct articles → claims → références → sources, contexte relié séparé |
| `list_sources` | `mode?`, `limit?` | sources primaires et hôtes effectivement cités |
| `get_integrity` | `path?` | empreintes SHA-256 canoniques des surfaces Agent Surface |
| `verify_artifact` | `path`, `sha256?` | vérification allowlistée d'un artefact via le manifeste d'intégrité |
| `get_changefeed` | `contentType?`, `limit?` | derniers changements avec objectId, version/hash courant et statut de diff |
| `get_changes` | `contentType?`, `slug?`, `since?`, `limit?` | changefeed filtrable avec métadonnées de version |
| `list_recent_analyses` | `limit?` | dernières analyses |
| `list_guides` | aucun | guides de référence |
| `search_by_topic` | `topic`, `limit?` | analyses d'un sujet (hubs `/sujets/`) |
| `get_article` | `slug`, `offset?`, `cursor?`, `limit?`, `length?`, `section?` | texte paginé d'une analyse ou d'un guide, avec `nextCursor`, références séparées et accès direct `tail`/`sources` |

Les documents longs exposent `section`, `offset`, `limit`, `nextOffset` et `nextCursor`. Exemple :
`l0g://articles/economie-des-intentions?section=sources&offset=0&limit=12000`.
Les références structurées sont aussi renvoyées séparément dans `references`, afin de ne pas dépendre
du chunk de texte courant.

`get_claim` ne publie pas d’URI fragmentée de preuve : il renvoie la ressource `l0g://claims/{claim_id}`
et oriente vers le tool `get_claim_evidence`. Les tools marquent les identifiants inconnus avec `isError: true`.
Les resources inexistantes renvoient une erreur protocolaire MCP, pas un document JSON avec champ `error`.

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

Cycle MCP minimal en JSON-RPC brut :

```bash
curl -s -X POST https://l0g.fr/api/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-11-25","capabilities":{},"clientInfo":{"name":"curl","version":"0.1"}}}'

curl -s -X POST https://l0g.fr/api/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","method":"notifications/initialized"}'

curl -s -X POST https://l0g.fr/api/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}' | head -c 400
```

Ou pointer un client compatible (Claude Desktop via `mcp-remote`, l'inspecteur MCP, etc.)
sur `https://l0g.fr/api/mcp`.

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
