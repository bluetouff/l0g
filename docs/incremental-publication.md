# Publication incrémentale

La publication conserve une sortie entièrement statique, une archive complète
vérifiée et une activation atomique. Le gain porte sur les calculs réutilisés
pendant la construction ; le serveur ne compile aucun article.

## Pages

Astro 7.4.4, déjà verrouillé dans le projet, fournit le rendu incrémental natif.
`experimental.incrementalBuild` active cette fonction ; `getStaticPaths()`
déclare les clés des analyses, guides et fiches de glossaire admissibles.

Les clés comprennent le contenu, les métadonnées, la traduction associée,
les lectures liées et les dates effectivement affichées. Astro vérifie aussi
les dépendances des modèles, les imports MDX et les styles compilés. Les MDX
dont les dépendances d'exécution dépassent ce contrat sont reconstruits.

Les pages collectives, les flux, les API éditoriales, les sitemaps et les données
Black Box restent recalculés. Pagefind réindexe la sortie complète, y compris
les pages restaurées. Une suppression disparaît du site et du prochain index.

Un changement de modèle commun, de dépendances ou de dates affichées peut
invalider de nombreuses pages. Le cache accélère les publications successives
sans promettre un temps fixe ou ignorer ces changements.

## Contrôles SVG

La CI répartit la suite SVG source complète entre quatre runners indépendants,
avec le partitionnement natif `--test-shard` de Node 22. Chaque runner conserve
la limite de trois processus de test simultanés. Le manifeste entier est transmis
à chacun ; Node sélectionne sa partition et un test vérifie que leur réunion
exécute chaque fichier exactement une fois.

Les quatre partitions restent obligatoires pour la publication et le contrôle
PR. Un échec bloque la livraison ; les autres partitions poursuivent leurs
contrôles. Les tests qui lisent les pages générées restent exécutés après Astro.
Les commandes locales continuent d'exécuter les suites complètes.

## Livres

Les livres sont regroupés par générateur, avec leurs langues lorsque leur
provenance est commune. Chaque groupe suit ses chapitres et ses dépendances.
Un article extérieur à un livre ne doit pas invalider ce livre.

Les sorties persistées restent sous `.cache/derived-assets`. Leurs chemins,
empreintes et tailles sont vérifiés avant toute restauration dans les sorties
déclarées. Les répertoires source et publics ne sont jamais restaurés directement
par GitHub Actions.

## Intégrité et déploiement

Le cache Astro partagé contient uniquement son manifeste, les sorties réutilisables
et le reçu d'intégrité. Le contrôle `prepare` vérifie la structure, les chemins,
les fichiers ordinaires, les empreintes et l'identité du moteur. Une anomalie
fait repartir ce cache à froid. Un parent de répertoire dangereux provoque
un arrêt plutôt qu'une suppression hors périmètre.

Seule la branche `main` du dépôt canonique enregistre un cache partagé après
les contrôles réussis. Les pull requests peuvent le lire et ne le remplacent
jamais. Les empreintes contrôlent l'intégrité ; les permissions GitHub assurent
la séparation entre lecteurs et producteurs du cache.

Les étapes de génération de `source.env`, de vérification de l'archive complète,
d'attestation et d'activation restent celles de la publication existante. Un
cache ne constitue ni un livrable de production ni une preuve de publication.

## Commandes

- `npm run build` : construction locale avec réutilisation admissible et contrôles.
- `npm run build:ci` : même rendu, suites SVG source et rendu séparées par le workflow.
- `npm run build:full` : force le rendu de toutes les pages avec les contrôles locaux.
- `npm run test:editorial-cache` : dépendances et invalidations des pages.
- `npm run test:incremental-cache` : intégrité, provenance et comportement à froid.
- `npm run test:derived-assets` : dépendances et restauration des livres.

Le premier build d'un environnement ou d'une version de moteur est froid.
Les builds suivants ne réutilisent que des sorties dont les entrées et les
contrôles d'intégrité correspondent encore.

Documentation du moteur :
[construction statique incrémentale Astro](https://docs.astro.build/en/reference/experimental-flags/incremental-build/).
Le partitionnement suit [l'option Node 22 `--test-shard`](https://r2.nodejs.org/docs/latest-jod/api/cli.html#--test-shard).

## Qualification locale du 4 novembre 2026

Un essai sur le corpus de 2 433 pages a ajouté deux articles FR/EN avec un
nouveau composant et son CSS, puis modifié le corps d'une analyse existante.
Le rendu incrémental a réutilisé 1 796 pages. Les 1 799 pages admissibles
produites sont identiques octet pour octet à celles d'un rendu forcé du même
contenu. Les nouvelles entrées figurent dans les deux homes, les flux RSS,
le flux Asie, le sitemap et l'index de recherche.

Sur cette machine sous Node 26.11.1, la phase Astro a pris 126,38 secondes
avec réutilisation, contre 156,49 secondes avec `--force`. Ces mesures locales
portent sur le rendu Astro ; elles ne prédisent pas la durée totale en CI,
qui utilise Node 22.23.4. Le premier passage en CI remplit le nouveau cache.

Après retrait des deux articles de test, les 1 797 pages admissibles initiales
sont de nouveau identiques à leur référence. Les routes supprimées ont disparu
des pages collectives, du sitemap et de l'index de recherche. La chaîne de
contrôles existante, y compris Pagefind et les suites SVG sur le rendu, a été
exécutée. Le dernier essai EPUB réutilise les 19 groupes en 7,90 secondes, sans
relancer de générateur.
