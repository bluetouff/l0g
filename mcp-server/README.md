# Serveur MCP de l0g.fr

Serveur **Model Context Protocol** en lecture seule, qui expose les données de l0g.fr
(Agent Surface, OpenAPI, Risk Diff, Black Box Recorder, NDJSON, evidence graph, claims, sources, fraîcheur, intégrité, changefeed, historique des signaux, analyses, guides) à des agents IA via resources, prompts, resource templates et tools, avec le
transport **Streamable HTTP** (spec 2025-11-25, le transport SSE est déprécié).

Endpoint public visé : `https://l0g.fr/api/mcp`

## État de déploiement

Au 17 juillet 2026, le code, la release `mcp-v1.20.0`, le Registry et l'endpoint
public sont alignés sur `1.20.0`. Le daemon actif sert le SHA
`478d5e448e9442a7ebc3d1d9e207b6586eafe6d5` avec `releaseAttested: true` depuis
le runtime atomique `/opt/l0g-mcp-runtime/releases/`.

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
                          /var/www/html/l0g/current/en/analysis|guides/<slug>/index.html
```

- Le service Node **n'écoute qu'en 127.0.0.1**, jamais exposé directement.
- Les données proviennent du **site déjà déployé** : `agents.json`, `catalog.json`,
  `search-index.json`, `claims.json`, `evidence-graph.json`, `sources.json`, `freshness.json`, `integrity.json`,
  `changes.json`, `risk-diff.json`, `black-box.json`, leurs variantes NDJSON, `openapi.json`, `risk.json`, `debt-risk.json`,
  `risk-events.json` et `confluence.json`. Le service ne fait que **lire** ces fichiers,
  avec un cache TTL de 60 s.
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
| `l0g://risk-diff` | diff du risque sur 1, 7 et 30 jours |
| `l0g://black-box` | frames point-in-time hashées du risque |
| `l0g://signals/current` | état courant des signaux |
| `l0g://signals/history` | observations point-in-time et alertes de seuil |

### Resource templates

| Template | Contenu |
|----------|---------|
| `l0g://articles/{slug}` | première page d'un article avec métadonnées, références et texte |
| `l0g://articles/{slug}{?section,offset,limit}` | page ciblée d'un article (`body`, `head`, `tail`, `sources`) |
| `l0g://articles/{slug}{?cursor}` | continuation d'article via `nextCursor` |
| `l0g://en/articles/{slug}` | première page d'une analyse anglaise, reliée aux preuves françaises canoniques |
| `l0g://en/articles/{slug}{?section,offset,limit}` | page ciblée d'une analyse anglaise |
| `l0g://en/articles/{slug}{?cursor}` | continuation d'analyse anglaise via `nextCursor` |
| `l0g://guides/{slug}` | première page d'un guide avec métadonnées et texte |
| `l0g://guides/{slug}{?section,offset,limit}` | page ciblée d'un guide (`body`, `head`, `tail`, `sources`) |
| `l0g://guides/{slug}{?cursor}` | continuation de guide via `nextCursor` |
| `l0g://en/guides/{slug}` | première page d'un guide anglais |
| `l0g://en/guides/{slug}{?section,offset,limit}` | page ciblée d'un guide anglais |
| `l0g://en/guides/{slug}{?cursor}` | continuation de guide anglais via `nextCursor` |
| `l0g://claims/{claim_id}` | relation affirmation-source |
| `l0g://sources/{source_id}` | source primaire ou hôte cité |
| `l0g://signals/{instrument}/current` | signal courant + historique de franchissement |
| `l0g://methodologies/{instrument}` | fiche méthodologique |

`resources/list` énumère aussi les instances connues via les templates. Les variables principales
ont des callbacks de complétion. Le service public actuel est stateless en requête/réponse et
n’annonce pas `resources.subscribe` ni `resources.listChanged` : pour surveiller le corpus, lire
`l0g://changes/latest` ou appeler `get_changefeed`.

## Prompts exposés

Les prompts MCP sont des workflows sélectionnés explicitement par l'utilisateur. Le serveur
annonce la capability `prompts`, sans `listChanged`, et valide chaque argument avant de rendre le
message. Leur définition unique vit dans `src/lib/agent-prompts.mjs`, également utilisée par la
page `/agents/`.

| Prompt | Arguments | Workflow |
|--------|-----------|----------|
| `audit_financial_narrative` | `topic`, `language?` | auditer un récit financier et séparer claims, preuves, inférences, scénarios et limites |
| `explain_risk_change` | `window?`, `language?` | expliquer un Risk Diff publié sur 1, 7 ou 30 jours sans extrapolation |
| `verify_claim` | `claim`, `language?` | vérifier une affirmation contre les claims canoniques, leurs preuves et leurs sources |
| `replay_as_of` | `date`, `question?`, `language?` | rejouer uniquement une frame Black Box réellement archivée à la date demandée |

## Tools exposés (tous `readOnlyHint`)

Tous les tools renvoient désormais :

- un résumé humain court dans `content`;
- les données exploitables dans `structuredContent`;
- un `outputSchema` déclaré et validé par le SDK.

Le JSON n'est donc plus caché dans un bloc texte à reparser.

| Tool | Arguments | Renvoie |
|------|-----------|---------|
| `get_agent_manifest` | aucun | capacités, endpoints, règles d'usage et politiques de preuve |
| `get_risk_indices` | aucun | indices de risque (US, EU, Yen, Energie, Dette US) + résumé confluence |
| `get_signal_history` | `key?`, `limit?` | historique des franchissements de niveau + état courant + confluence |
| `get_risk_diff` | `window?` | Risk Diff sur 1, 7 ou 30 jours : signaux, sources, claims, modèles, articles et confiance |
| `get_black_box` | `date?`, `limitFrames?` | replay point-in-time des frames de risque hashées, avec refus des dates non rejouables |
| `get_openapi_schema` | `mode?`, `path?` | contrat OpenAPI résumé, ciblé par endpoint ou complet |
| `get_ndjson_feed` | `feed`, `recordType?`, `limit?` | flux NDJSON allowlistés : catalogue, claims, evidence graph, changes, signalHistory |
| `get_freshness` | `limit?` | derniers contenus, compteurs, temporalité par signal et politique de fraîcheur |
| `search_content` | `query`, `language?`, `mode?`, `limit?` | recherche bilingue sur l'index canonique partagé avec l'Agent Surface et WebMCP |
| `build_research_pack` | `query`, `language`, `asOf?`, `riskWindow?`, `limit?` | paquet de preuves déterministe : documents, claims canoniques, sources, graphe, fraîcheur, Risk Diff, éléments adverses, limites et URLs citables |
| `get_claims` | `articleSlug?`, `language?`, `kind?`, `query?`, `limit?` | claims françaises canoniques ; un slug anglais est résolu vers ses preuves françaises |
| `get_claim` | `claimId` | une claim précise, ses liens ressource et son article |
| `get_claim_evidence` | `claimId`, `limit?` | preuve et références d'une claim, avec contenus reliés isolés dans `relatedContent` |
| `list_article_claims` | `articleSlug`, `language?`, `kind?`, `limit?` | claims canoniques d'un article français ou de sa traduction anglaise |
| `find_claims_by_source` | `sourceId`, `kind?`, `limit?` | claims rattachées à une source primaire, un nom ou un host cité |
| `get_source` | `sourceId`, `limit?` | source primaire ou hôte cité, plus claims associées |
| `get_evidence_graph` | `articleSlug?`, `language?`, `nodeType?`, `limit?` | sous-graphe canonique ; un slug anglais pointe vers le graphe français sans duplication |
| `list_sources` | `mode?`, `limit?` | sources primaires et hôtes effectivement cités |
| `get_integrity` | `path?` | empreintes SHA-256 canoniques des surfaces Agent Surface |
| `verify_artifact` | `path`, `sha256?` | vérification allowlistée d'un artefact via le manifeste d'intégrité |
| `get_changefeed` | `contentType?`, `limit?` | derniers changements avec objectId, version/hash courant et statut de diff |
| `get_changes` | `contentType?`, `slug?`, `since?`, `limit?` | changefeed filtrable avec métadonnées de version |
| `list_recent_analyses` | `language?`, `limit?` | dernières analyses, filtrables en `fr` ou `en` |
| `list_guides` | `language?` | guides de référence français ou anglais |
| `search_by_topic` | `topic`, `language?`, `limit?` | analyses d'un sujet, filtrables par langue |
| `get_article` | `slug`, `language?`, `offset?`, `cursor?`, `limit?`, `length?`, `section?` | texte paginé français ou anglais, avec références canoniques séparées |

## l0g Agent Bench

Le workflow publié exécute `agent-bench.mjs` contre ce serveur après le test de protocole. Les 44 cas FR/EN n’appellent aucun LLM et couvrent le top 3 documentaire, les sources primaires, la parité des traductions, `asOf`, le refus sans preuve, la fraîcheur et le typage des claims. Le résultat versionné et attesté est publié sur `/api/v1/agent-bench.json` et présenté sur `/agent-bench/`.

Les documents longs exposent `section`, `offset`, `limit`, `nextOffset` et `nextCursor`. Exemple :
`l0g://articles/economie-des-intentions?section=sources&offset=0&limit=12000`.
Les références structurées sont aussi renvoyées séparément dans `references`, afin de ne pas dépendre
du chunk de texte courant.

`get_risk_diff` est le chemin court pour répondre à une question de type "qu'est-ce qui a changé
dans le risque depuis hier, 7 jours ou 30 jours". `get_black_box` sert au replay : avec `date`, le
tool sélectionne la dernière frame publiée avant ou le jour demandé ; si aucune frame n'existe, la
réponse marque la date comme non rejouable plutôt que de recalculer après coup.

`get_claim` ne publie pas d’URI fragmentée de preuve : il renvoie la ressource `l0g://claims/{claim_id}`
et oriente vers le tool `get_claim_evidence`. Les tools marquent les identifiants inconnus avec `isError: true`.
Les resources inexistantes renvoient une erreur protocolaire MCP, pas un document JSON avec champ `error`.

## Sécurité

- Écoute **127.0.0.1** uniquement ; TLS et exposition gérés par Apache.
- **Validation Host et Origin** sur chaque requête (anti DNS rebinding, exigé par la spec).
- **Lecture seule** : aucune écriture disque, slugs en **allowlist** (le path traversal
  est rejeté), taille de corps bornée à 1 Mo.
- **Rate limit** par IP (120 req/min par défaut, via `X-Forwarded-For` posé par Apache).
- Apache reverse-proxy : `LimitRequestBody` aligné à 1 Mo, entêtes de sécurité sur réponse,
  timeout applicatif 30 s, keepalive proxy désactivé sur l’endpoint.
- systemd **durci** : `DynamicUser`, `TimeoutStartSec=45`, `TimeoutStopSec=15`, `UMask=0077`,
  `PrivateIPC`, `LimitCORE=0`, `ProtectSystem=strict`, capacités vidées, `ReadOnlyPaths`,
  `MemoryMax`, filtre d'appels système.

## Déploiement atomique (Debian, serveur « zen »)

> Hypothèses : Apache sert déjà l0g.fr en HTTPS, le site est déployé dans
> `/var/www/html/l0g/current`. Node 20+ requis.

### 1. Installer Node 20+ (si absent)

```bash
node -v   # si < 20, installer la LTS :
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Installer une fois le poller de releases attestées

Le runbook complet, le bloc de migration avec sauvegardes et la procédure de release sont dans
[`docs/MCP-RELEASE.md`](../docs/MCP-RELEASE.md). Après cette migration, le serveur ne lance plus
`git pull` ni `npm ci` : il poll les GitHub Releases publiques, vérifie SHA-256 et l'attestation
GitHub/Sigstore, teste le candidat, puis bascule un symlink atomiquement avec rollback automatique.

Prérequis supplémentaires : GitHub CLI doit fournir `gh attestation verify`. Le timer et le
daemon n'ouvrent aucun port entrant de déploiement et n'utilisent aucun token GitHub permanent.

### 3. Test à blanc d'une source locale

```bash
L0G_DATA_DIR=/var/www/html/l0g/current node server.mjs &
curl -s http://127.0.0.1:8848/healthz       # -> versions MCP/Agent Surface, SHA et fraîcheur chargée
node test-client.mjs                          # liste les tools et teste chaque appel
# le script force l'en-tête Accept requis par le Streamable HTTP :
# application/json, text/event-stream
kill %1
```

### 4. Contrôler le service et le timer

```bash
systemctl status l0g-mcp l0g-mcp-deploy.timer --no-pager
journalctl -u l0g-mcp-deploy.service -n 100 --no-pager
curl -s http://127.0.0.1:8848/healthz        # -> versions MCP/Agent Surface, SHA et fraîcheur chargée
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

Après reload :
```bash
sudo apache2ctl -M | rg -e "proxy_module|proxy_http_module|headers_module|rewrite_module"
curl -s -I https://l0g.fr/api/mcp | sed -n '1,20p'
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
  relit `catalog.json`, `risk.json` et `debt-risk.json` au plus tard 60 s après.
- **Code du serveur** : automatique après un tag `mcp-vX.Y.Z`. Le workflow construit une
  archive versionnée avec SBOM, l'atteste par OIDC, la publie en GitHub Release, attend le
  déploiement atomique de `zen`, puis publie le manifeste dans le MCP Registry par OIDC.
- **Registry** : canal de découverte en preview, principalement destiné aux agrégateurs
  downstream. Il est vérifié après publication, mais ne remplace ni les tests vivants ni la
  stratégie d'adoption.

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
| `MCP_MAX_BODY_BYTES` | `1048576` | limite de payload par requête (1 Mo) |
| `MCP_RATE_MAX` | `120` | requêtes/min/IP |
| `MCP_HEADER_TIMEOUT` | `10000` | timeout headers HTTP (ms) |
| `MCP_REQUEST_TIMEOUT` | `15000` | timeout requête HTTP complet (ms) |
| `MCP_KEEP_ALIVE_TIMEOUT` | `5000` | timeout keep-alive TCP (ms) |
| `MCP_MAX_HEADERS_COUNT` | `64` | nombre maximum d'en-têtes parsables |
| `MCP_RELEASE_ATTESTED` | absent | `1` uniquement dans une archive dont le poller a vérifié la provenance |
