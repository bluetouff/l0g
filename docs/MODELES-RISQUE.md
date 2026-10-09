# Modèles de risque l0g

État documenté : `2026-07-16`. Ce document décrit les conventions de modèle,
tandis que [`l0g Editorial Protocol 1.0`](../releases/l0g-editorial-protocol-1.0.0/README.md)
fixe les règles transversales de preuve, de limite, de correction et de licence.

Ce document résume les conventions de modèle qui doivent rester alignées entre
les dashboards, `/methodologie/`, `/api/`, `/agents.json`, `llms.txt` et les
snapshots publics. Les surfaces `/api/v1/risk-diff.json` et
`/api/v1/black-box.json` ne recalculent pas les modèles : elles documentent le
mouvement de la connaissance publique et le replay des frames déjà publiées.

## Dette US

Section mise à jour le 8 octobre 2026. Source amont : Debt Risk Radar,
`https://debt.l0g.fr/latest.json`, schéma `1.2`, méthode `us-debt-institutional` / `2.0`.

Le score Dette US publié par l0g reprend `score.current_stress` depuis
`latest.json`. Le calcul courant :

```text
current_stress = somme(score_famille * coefficient_famille) / 0.86
si les 31 signaux courants sont eligibles ; sinon null
```

Conséquences :

- `cbo_projection` est un risque structurel de long terme, publié séparément.
- Les neuf signaux ETF sont retirés ; la collecte ne contacte plus Massive.
- La politique de fraîcheur 2 vérifie les métadonnées FRED des séries trimestrielles
  proches de leur limite d'âge. Une dernière publication confirmée reste utilisable
  sous l'étiquette `official-delayed`, au plus 120 jours après la mise à jour FRED
  et six mois plus 30 jours après la fin du trimestre. Les caches restent limités
  à 6 h pour les observations et 24 h pour les métadonnées. Périodes et valeurs
  sont conservées ; aucune imputation. Sans confirmation ou au-delà des bornes,
  le score est suspendu. L'API expose les échéances et `quality.policy_version`.
- Coefficients : fiscal 22, taux/crédit 18, dette privée 12, liquidité 10,
  Treasury 10, World Bank US 4, BIS US 10, divisés par 86.
- Une donnée courante absente, invalide ou périmée suspend le score, sans imputation.
- `score.coverage` expose la couverture pondérée, `valid_until` la validité de
  publication, `source_sha` la révision installée et `methodology.version` la formule.
- Le changement de périmètre rompt la comparabilité avec la méthode ETF. Conserver
  les anciennes observations sans les réétiqueter ni calculer de variation à la bascule.
- Les API actives sont accessibles gratuitement ; les droits des séries tierces
  FRED, notamment ICE BofA, restent à vérifier pour une redistribution commerciale.

Une API ou un agent ne doit donc pas recalculer le stress courant en moyenne des
seules familles disponibles. Il doit utiliser `/api/v1/debt-risk.json` ou
`score.current_stress` dans `latest.json`.
Le détail des formules, exceptions, dates et limites est publié dans
[METHODOLOGY.md](https://github.com/bluetouff/debt-risk-radar/blob/main/METHODOLOGY.md)
et [API.md](https://github.com/bluetouff/debt-risk-radar/blob/main/API.md).

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
- utiliser `/api/v1/risk-diff.json` pour analyser les changements de risque par
  fenêtre 1, 7 ou 30 jours ;
- utiliser `/api/v1/black-box.json` pour rejouer une date seulement si une frame
  publique existe déjà ;
- privilégier `/api/v1/debt-risk.json` pour Dette US ;
- ne pas comparer directement les scores 0-100 entre instruments ;
- citer la méthodologie et la source primaire quand elles sont disponibles ;
- conserver `observedAt`, `retrievedAt`, `computedAt` et `snapshotHash` pour les
  backtests.
- ne jamais reconstruire une frame absente avec des données connues plus tard.

## Validation

Avant publication :

```bash
npm run test:risk-snapshot
npm run test:agent-surface
npm run test:editorial-protocol
npm run build
```

Quand Debt Risk Radar a été redéployé et a régénéré `latest.json`, lancer aussi :

```bash
npm run risk:update
```

Puis vérifier que `/api/v1/debt-risk.json` expose la nouvelle provenance,
notamment `provenance.coverage` lorsque le snapshot amont la fournit.
