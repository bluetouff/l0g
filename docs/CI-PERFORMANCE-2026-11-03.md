# Durée de la publication statique

Mesures du workflow [41703142272](https://github.com/bluetouff/l0g/actions/runs/41703142272), commit `e5cb3915`, le 3 novembre 2026. Horaires UTC issus de l’API GitHub Actions.

| Phase | Mesure |
| --- | --- |
| Création du run au démarrage des jobs | 19:25:34 à 19:31:16, soit 5 min 42 |
| Checkout du job build | 19:31:18 à 19:34:29, soit 3 min 11 |
| Compilation et contrôles `build:ci` | 19:34:56 à 19:43:02, soit 8 min 06 |
| Rendu Astro inclus dans cette phase | 2 407 pages, 3 min 57 |
| Préparation de la release Git et push | 19:44:14 à 19:55:28, soit 11 min 14 |

Le transport préparé contenait 247 896 284 octets, répartis en trois morceaux d’une archive gzip. L’étape commune ne permettait pas de séparer le coût local Git du transfert réseau. Sa lenteur ne peut donc pas être entièrement attribuée à la compression sur la seule base de ces journaux.

## Corrections

- Les checkouts de validation PR et de compilation récupèrent seulement le commit nécessaire, avec `fetch-depth: 1`. Les références courantes de `main` et l’archive Black Box restent explicitement vérifiées.
- Le dépôt Git temporaire de publication désactive la recompression et la recherche de deltas des morceaux gzip. Cela ne change aucun octet de la release, des checksums ni de l’attestation.
- La préparation Git et son push deviennent deux étapes distinctes ; `--progress` rend visible la progression du transfert.
- La politique CI refuse le retour aux checkouts complets et à la recompression du transport. Un test pousse les fichiers dans un dépôt Git local et relit leurs octets, puis vérifie le dépôt avec `git fsck --strict`.

Les suites SVG, la vérification des dépendances, les contrôles de déploiement, l’attestation et la sérialisation de la transaction `built` + Black Box restent obligatoires. Une publication main ne doit pas être annulée entre ses deux pushes.

Le gain de bout en bout doit être mesuré sur un nouveau workflow. Un benchmark de compression local ne mesure ni la bande passante GitHub ni le délai de mise à disposition d’un runner.
