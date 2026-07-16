# Revue canonique des claims

État documenté : `2026-07-16`. Ce registre complète les exigences EP-003 à
EP-005 de [`l0g Editorial Protocol 1.0`](../releases/l0g-editorial-protocol-1.0.0/SPECIFICATION.md).

Le registre distingue désormais deux états.

- `legacy` conserve les anciennes revues manuelles comme historique. Elles ne changent plus `reviewStatus` et ne constituent pas une certification.
- `canonical` certifie au plus trois claims par analyse majeure. Une entrée canonique exige un type explicite (`fait`, `estimation`, `inférence` ou `scénario`), une source HTTPS et sa date, un localisateur exact et une profondeur `direct-proof` ou `reproduction`.

Le localisateur doit désigner l’endroit vérifiable : page, paragraphe, section, tableau, série, cellule, formulaire, accession SEC, DOI ou calcul. Une reproduction exige aussi un artefact reproductible.

Les claims produits par le classifieur lexical restent `unclassified-assertion` tant qu’aucune revue canonique ne satisfait ce contrat. Le nombre brut de revues historiques n’est donc plus présenté comme un nombre de claims certifiés.

L’interface locale reste accessible avec `npm run claims:review`. Une sauvegarde crée ou remplace une entrée `canonical`. Le build refuse une entrée incomplète ou plus de trois claims canoniques pour une même analyse.
