# Dépendances : restriction locale des extglobs répétés

Revue du 17 novembre 2026.

## Avis et périmètre

L’avis [GHSA-fc5q-39xc-vjpf](https://github.com/advisories/GHSA-fc5q-39xc-vjpf)
signale un déni de service par retour arrière exponentiel de regex dans
`picomatch <= 4.0.7`. Aucune version officielle corrigée n’était publiée lors
de cette revue. L’arbre principal installe les versions 4.0.7 et 2.3.2.

Le correctif local refuse les extglobs répétés `+(...)` et `*(...)` avec une
`SyntaxError`, au point où chaque parseur ouvre ces groupes. Ce refus porte
aussi sur des expressions légitimes de cette famille : il restreint les motifs
acceptés par les outils de compilation. Les globs ordinaires, les accolades
et les extglobs `@(...)`, `?(...)` et `!(...)` restent couverts par les tests de
compatibilité. Les configurations dynamiques utilisant une forme désormais
refusée doivent être réécrites avec des motifs non répétés.

Cette restriction vise les extglobs répétés `+(...)` et `*(...)` de cet avis.
Les fragments de regex admis dans certains motifs glob et les API de regex
brutes exigent une analyse distincte avant de recevoir des entrées non fiables.

## Installation et vérification

`scripts/picomatch-security.mjs --apply` est exécuté en `postinstall`, après
le garde-fou de cache existant. Le module vérifie les installations du lockfile
principal, leurs versions, leur identité et les empreintes attendues des
fichiers exécutables. Il refuse les installations inattendues ou modifiées.
Les remplacements du parseur sont atomiques et idempotents.

Le mode `--check` exige le correctif dans toutes les copies concernées et
contrôle son comportement dans des processus enfants à durée limitée. Une
installation obtenue avec `--ignore-scripts` reste bloquée tant que la
restriction n’a pas été appliquée et vérifiée.

## Contrat de l’audit

L’avis reste affiché. Le contrôleur peut le qualifier comme corrigé localement
uniquement pour l’arbre principal, son identité npm précise et son périmètre
actuel, après vérification des octets installés et du comportement des parseurs.
Les versions auditées doivent correspondre aux versions effectivement vérifiées.

Un correctif absent ou altéré, une copie inconnue, une version inattendue, un
autre avis ou une indisponibilité du registre bloque la publication. L’arbre
MCP conserve son audit séparé. L’ancien avis du cache reste également bloquant.

Les versions déclarées des paquets et les avis amont ne sont pas modifiés.
Les alertes fondées uniquement sur les numéros de version peuvent donc rester
présentes. Le correctif local n’est pas présenté comme une version corrigée
par l’éditeur.

## Contrôles avant publication

Exécuter `npm run test:dependencies`, puis les vérifications et la compilation
du projet. Les tests couvrent les motifs vulnérables avec des délais courts,
les comportements légitimes conservés, les installations absentes ou altérées
et les conditions de qualification de l’avis.

Lorsqu’une correction officielle sera disponible, vérifier ses octets et son
comportement, mettre à jour toutes les copies concernées et retirer cette
mesure locale dans le même changement. Conserver le blocage des autres avis et
des défaillances du registre.
