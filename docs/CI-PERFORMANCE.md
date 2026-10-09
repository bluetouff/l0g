# Construction et publication

Le workflow `.github/workflows/build.yml` sépare les contrôles indépendants du
rendu statique et de la publication. La branche `built` reste le transport de
l’archive complète attestée ; le serveur ne compile pas le site.

## Graphe de validation

- `svg-source` exécute les tests géométriques et métier qui lisent les sources.
- `build` prépare les médias, contrôle les sources, effectue un seul build Astro,
  contrôle les pages produites et teste le serveur MCP contre ces pages.
- `publish` attend la réussite de **build et svg-source**. Il vérifie le checksum,
  les coordonnées du build et la base de l’historique Black Box transférés avant
  d’attester la release et de pousser les branches de publication.
- Sur une PR, `validate-pr-build` remplace `build`. Le check historique
  `validate-pr` attend aussi les deux suites, afin de conserver la protection de
  branche existante.

Les jobs de calcul ont seulement `contents: read`. Les droits d’attestation et
d’écriture appartiennent au publisher. Une publication main en cours n’est pas
annulée entre les deux pushes. Un SHA devenu obsolète est refusé avant publication.

## Un seul rendu du site

L’intégration `scripts/black-box-prerender.mjs` utilise l’API publique de
[prérendu Astro](https://docs.astro.build/en/reference/adapter-reference/#custom-prerenderer).
Elle rend d’abord les 14 réponses JSON nécessaires à une frame dans un dossier
privé temporaire, ajoute la frame, puis laisse Astro rendre toutes les routes.
Les pages finales voient donc déjà le nouvel historique.

Cette écriture exige `L0G_APPEND_BLACK_BOX_FRAME=1` et les coordonnées cohérentes
d’une publication main. Le build local habituel et les PR lisent l’historique sans
l’augmenter. Les hashes, schémas et contrôles de chaîne existants sont conservés.

## Commandes et ajout de tests

`npm run build` reste la validation locale complète, y compris tous les tests SVG.
`npm run build:ci` est la partie du pipeline exécutée en parallèle du job
`npm run test:inline-svg:source` ; elle ne constitue pas, seule, la validation CI
complète. Les tests qui lisent `dist/` sont exécutés après Astro avec
`npm run test:inline-svg:rendered`.

Pour ajouter une suite SVG, la déclarer dans `scripts/svg-test-suites.mjs` dans
le groupe approprié. Ne pas importer un autre fichier `.test.mjs` depuis une
suite. Le test de couverture refuse les oublis, doublons et suites de rendu
placées parmi les tests source. La concurrence Node est bornée à trois workers.

`npm run test:ci-policy` vérifie ces contrats, les cas d’échec du prépass et du
transfert, ainsi que les protections du workflow. Les nouvelles suites de tests
métier doivent rester dans `build:prepare` ou `build:verify`, selon leurs entrées.

## Cache des cartes sociales

La CI active `L0G_OG_CACHE_DIR=.cache/l0g-og`. Chaque image est identifiée par ses
entrées de rendu : texte/arbre complet, dimensions, polices, options, code du
renderer, lockfile, runtime et plateforme. Une entrée absente ou corrompue est
recalculée. Le contenu PNG et son checksum sont contrôlés à chaque réutilisation.
Les tests de déterminisme continuent à effectuer de vrais rendus sans cache.
Les cartes concernées contiennent du texte et des styles contrôlés. L’ajout de
ressources externes ou de fonctions au rendu exige de couvrir aussi ces entrées
dans la clé, ou de désactiver le cache pour ces cartes.

Seul main sauvegarde ce cache. Ni `public/`, ni les snapshots financiers, ni
l’archive Black Box ne sont mis en cache. Un nouvel article n’invalide pas les
images des articles inchangés. Le cache est facultatif : sa perte affecte le
temps de calcul, sans dispenser d’un contrôle.

## Mesure de référence

Le [run 37860162461](https://github.com/bluetouff/l0g/actions/runs/37860162461)
du 8 octobre 2026 UTC a consommé **15 min 34 s** de job, hors attente du runner :

| Travail | Durée observée avant optimisation |
| --- | ---: |
| Deux rendus Astro | environ 6 min |
| Tests SVG dans le chemin séquentiel | 4 min 22 s |
| Cartes sociales recalculées | 1 min 26 s |
| Génération EPUB | 35 s |

Comparer les durées GitHub sur le même type de runner, en distinguant cache froid,
cache chaud et attente de démarrage. Les mesures locales ne sont pas une prévision
contractuelle du temps GitHub. Les EPUB restent entièrement reconstruits.

Le transfert entre jobs conserve l’identifiant immuable de l’artefact et la
tentative d’origine du build. Relancer uniquement un publisher en échec réutilise
ces coordonnées ; un changement de base Black Box fait échouer la reprise.
