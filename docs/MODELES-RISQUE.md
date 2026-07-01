# Modèles de risque l0g

Ce document résume les conventions de modèle qui doivent rester alignées entre
les dashboards, `/methodologie/`, `/api/`, `/agents.json`, `llms.txt` et les
snapshots publics.

## Dette US

Source amont : Debt Risk Radar, `https://debt.l0g.fr/latest.json`.

Le score Dette US publié par l0g reprend `score.current_stress` depuis
`latest.json`. Le calcul courant :

```text
current_stress = overall_score(
  bucket_scores(metrics),
  exclude=cbo_projection,
  expected=current_stress_buckets,
  neutral_missing=50
)
```

Conséquences :

- `cbo_projection` est un risque structurel de long terme, publié séparément.
- Les buckets courants attendus restent dans l'univers de pondération même si
  une source manque.
- Une famille courante absente est imputée à `50`, point neutre de l'échelle.
- `score.coverage` indique la part de poids observée avant imputation neutre.

Une API ou un agent ne doit donc pas recalculer le stress courant en moyenne des
seules familles disponibles. Il doit utiliser `/api/v1/debt-risk.json` ou
`score.current_stress` dans `latest.json`.

## US Macro

Source amont : US Macro Dashboard, `https://us.l0g.fr`.

Le moteur US Macro transforme chaque série FRED en composantes de stress :

- z-score glissant cinq ans ;
- drift par rapport au régime pré-COVID quand la série s'y prête ;
- momentum 3 mois annualisé et 1 an quand il est pertinent.

La version corrigée ne prend plus le maximum brut entre ces composantes. Elle
calcule `stress_final` par moyenne pondérée des composantes disponibles :

```text
stress_final = 0.50 * zscore + 0.25 * drift + 0.25 * momentum
```

Les séries non adaptées au drift ou au momentum restent exclues de ces
composantes. Le backtest conserve les quatre fenêtres de récession NBER, mais il
mesure aussi les alertes hors fenêtre de récession et pénalise les séries qui
produisent trop de faux positifs.

## Règles agents

Les agents IA doivent :

- lire `/agents.json` puis `/openapi.json` avant ingestion ;
- vérifier `/api/v1/freshness.json` pour les dates utiles ;
- privilégier `/api/v1/debt-risk.json` pour Dette US ;
- ne pas comparer directement les scores 0-100 entre instruments ;
- citer la méthodologie et la source primaire quand elles sont disponibles ;
- conserver `observedAt`, `retrievedAt`, `computedAt` et `snapshotHash` pour les
  backtests.

## Validation

Avant publication :

```bash
npm run test:risk-snapshot
npm run test:agent-surface
npm run build
```

Quand Debt Risk Radar a été redéployé et a régénéré `latest.json`, lancer aussi :

```bash
npm run risk:update
```

Puis vérifier que `/api/v1/debt-risk.json` expose la nouvelle provenance,
notamment `provenance.coverage` lorsque le snapshot amont la fournit.
