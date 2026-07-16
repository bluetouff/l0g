# Documentation maintenue de l0g

Cet index distingue les contrats normatifs, les descriptions méthodologiques et
les runbooks opérationnels. Une page publique explique un système ; elle ne
prouve pas à elle seule que l'état de production correspond au dépôt.

## Contrats et méthodes

| Document | Portée | Version ou état |
|---|---|---|
| [`l0g Editorial Protocol`](../releases/l0g-editorial-protocol-1.0.0/README.md) | règles normatives, schémas, exemple, preuves, tests et licences | `1.0.0`, stable, 2026-07-16 |
| [`MODELES-RISQUE.md`](MODELES-RISQUE.md) | conventions des modèles et lecture des scores | aligné avec `/methodologie/` et Agent Surface `1.13.0` |
| [`CLAIM-REVIEWS.md`](CLAIM-REVIEWS.md) | distinction entre revues `legacy` et `canonical` | contrat courant |
| [`AGENT-BENCH.md`](AGENT-BENCH.md) | benchmark déterministe MCP et Agent Surface | 44 cas, jeu `1.0.0` |
| [`BLACK-BOX-ARCHIVE.md`](BLACK-BOX-ARCHIVE.md) | registre append-only et attestations | format v2 |

## Runbooks

| Document | Usage | État vérifié le 2026-07-16 |
|---|---|---|
| [`GUIDE-CONTENU.md`](GUIDE-CONTENU.md) | rédaction, contrôles et publication Astro | protocole 1.0 intégré |
| [`MCP-RELEASE.md`](MCP-RELEASE.md) | release MCP atomique, health check et rollback | dépôt `1.20.0`, public `1.19.0`, tag `mcp-v1.20.0` absent |
| [`../README.md`](../README.md) | architecture et déploiement statique | `built` publie arbre compatible et enveloppe attestée ; migration serveur à terminer |

## Surfaces publiques correspondantes

- `/methodologie/` et `/methodologie/{instrument}/` : modèles, sources, calculs et limites ;
- `/protocole-editorial/` : explication du contrat éditorial stable ;
- `/donnees/agents/`, `/agents.json` et `/openapi.json` : Agent Surface `1.13.0` ;
- `/mcp/` et `/api/mcp` : documentation et endpoint MCP public ;
- `/preuves/` et `/api/v1/integrity.json` : traçabilité et empreintes ;
- `/backtests/` et `/api/v1/signals/history.*` : observations point-in-time.

## Vérification avant publication

```bash
npm run check
npm run lint:editorial
npm run test:editorial-protocol
npm run test:deploy
npm run build
```

Après un push, vérifier séparément le workflow GitHub, le contenu de `origin/built`
et les surfaces publiques modifiées. Pour le MCP, comparer la version du dépôt,
le tag publié, les assets attestés, `/healthz` et `serverInfo.version`.
