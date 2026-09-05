# CA01 à CA12, état vérifiable au 4 septembre 2026

Ce registre sépare ce qui est vérifié en production, ce qui est corrigé dans le
code et ce qui exige encore une action d’infrastructure. Les archives Coverage
et Performance fournies ne contenaient pas les exemples d’URL. Les six exports
détaillés ont donc été récupérés depuis Search Console le 4 septembre, puis
réunis et audités contre le build courant.

| Action | État | Preuve ou prochaine entrée requise |
| --- | --- | --- |
| CA01 | Terminé | `gsc-indexation-cohort-2026-08-28.csv` contient exactement 176 URL uniques, réparties 86 + 66 + 19 + 2 + 2 + 1, avec les sept colonnes prévues. Search Console n’exporte pas son canonical choisi dans ce rapport; le champ reste donc vide plutôt que reconstruit. |
| CA02 | Terminé | Les 176 décisions sont consignées dans `gsc-indexation-decisions-2026-08-28.csv`: 93 à indexer, 55 noindex voulus, 8 redirections, 2 suppressions 410 et 18 inconnues, toutes sur `crypto.l0g.fr`. |
| CA03 | Vérifié en production | `live-proof-2026-09-04.json` horodate sitemap, contacts, découverte MCP, politique OAuth et icônes, avec le SHA public observé. |
| CA04 | Corrigé et validé dans le build | Les six guides anglais ont un `seoTitle` distinct. Les H1 éditoriaux ne changent pas. |
| CA05 | Cartographie terminée, activation partielle en attente | Sur 19 URL: 7 concaténations glossaire-guide ont une cible 301 vérifiée, 2 retraits ont déjà une 410, 5 motifs WordPress restent des 404 attendues et 5 URL appartiennent à `crypto.l0g.fr`. Ces cinq dernières exigent d’abord une décision sur le sous-domaine et un certificat TLS valide. |
| CA06 | Gel appliqué | Les huit titres et leurs agrégats sont enregistrés dans `seo-title-experiments-2026-09.json`. Le contrôle SEO interdit leur dérive tant que leur statut reste `frozen`; aucune décision ne doit intervenir avant le 20 septembre ou avant une mesure post-réexploration suffisante. |
| CA07 | Terminé | Les 66 URL ont été auditées sur contenu, canonical, langue, duplication, profondeur et maillage: 47 formats machine sont volontairement hors index, 7 pages sont indexables et 12 anciennes URL `crypto.l0g.fr` restent isolées. Le seuil de 30 décisions utiles est dépassé avec 54 URL. |
| CA08 | Terminé | Les 86 URL sont présentes et indexables dans le build, sans aucune page orpheline. Deux paginations, `/12/` et `/13/`, sont à plus de trois clics mais ne sont pas stratégiques. |
| CA09 | Terminé | H.4.1, Nvidia, RealT et KOSPI ont des liens contextuels supplémentaires. La meilleure page sous-maillée du cohort exploré, la publication Votre identité dans un téléphone, passe de 1 à 4 liens entrants. |
| CA10 | Terminé | Les 12 redirections et 3 canonical alternatives GSC sont auditées nominativement: 14 redirections attendues et la recherche avec requête, volontairement noindex. Le sitemap et le maillage du build comptent 0 destination indésirable. |
| CA11 | Correctif Apache prêt, activation en attente | Les deux anciennes cartes sociales Grand Péage reçoivent une 301 vers leurs images actuelles. Les sondes d’activation et les tests de déploiement couvrent les deux chemins. |
| CA12 | Collecteur et tableau prêts, installation en attente | Le rapport 1.1 sépare lectures HTML, MCP/API, prévisualisations, robots, scans et autres requêtes. Il ne publie ni IP, ni session, ni métrique GoAccess de visiteurs uniques. |

## Import de la cohorte GSC

Pour reproduire l’audit après un build :

```sh
node --experimental-strip-types scripts/audit-indexation-cohort.mjs \
  --dist dist \
  --input docs/seo/gsc-indexation-cohort-2026-08-28.csv \
  --expected 176 \
  --output docs/seo/gsc-indexation-decisions-2026-08-28.csv \
  --summary docs/seo/gsc-indexation-summary-2026-08-28.json
```

La procédure détaillée, les limites des exports et le blocage du sous-domaine
sont consignés dans `INDEXATION-COHORT.md` et
`crypto-subdomain-blocker-2026-09-04.md`.
