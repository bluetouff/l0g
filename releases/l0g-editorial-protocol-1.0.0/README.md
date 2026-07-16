# l0g Editorial Protocol 1.0

Statut: **stable**

Version machine: `1.0.0`

Date de release: `2026-07-16`

Cette release autonome fixe le noyau normatif du protocole éditorial l0g. Elle
contient la spécification, deux schémas JSON, un article exemple, son paquet de
preuves, les tests de conformité et les notices de licence.

## Contenu

- `SPECIFICATION.md`: exigences normatives et niveaux de conformité;
- `schemas/article.schema.json`: métadonnées et claims d'un article;
- `schemas/evidence-pack.schema.json`: sources, localisateurs et limites;
- `example/article.md`: exemple éditorial lisible;
- `example/article.json`: représentation structurée de l'article;
- `example/evidence-pack.json`: paquet de preuves correspondant;
- `tests/conformance.mjs`: validation des schémas et invariants croisés;
- `LICENSE`: portée MIT et CC BY 4.0;
- `SHA256SUMS`: empreintes des fichiers de la release.

## Vérifier

Depuis la racine du dépôt, après `npm ci`:

```bash
npm run test:editorial-protocol
sha256sum -c releases/l0g-editorial-protocol-1.0.0/SHA256SUMS
```

La conformité valide la structure. Elle ne garantit ni la vérité future d'une
source, ni la qualité d'une conclusion. Une source doit toujours être rouverte
à la date d'une nouvelle publication.

## Citer

> Olivier Laurelli (2026), *l0g Editorial Protocol*, version 1.0.0,
> https://l0g.fr/protocole-editorial/

Les métadonnées machine complètes sont disponibles dans `../../CITATION.cff`.
