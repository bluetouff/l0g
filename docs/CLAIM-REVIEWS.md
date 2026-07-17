# Revue canonique des claims

État documenté : `2026-07-16`. Ce registre complète les exigences EP-003 à
EP-005 de [`l0g Editorial Protocol 1.0`](../releases/l0g-editorial-protocol-1.0.0/SPECIFICATION.md).

Le registre distingue désormais deux états.

- `legacy` conserve les anciennes revues manuelles comme historique. Elles ne changent plus `reviewStatus` et ne constituent pas une certification.
- `canonical` certifie au plus trois claims par analyse majeure. Une entrée canonique exige un type explicite (`fait`, `estimation`, `inférence` ou `scénario`), une source HTTPS et sa date, un localisateur exact et une profondeur `direct-proof` ou `reproduction`.

Le localisateur doit désigner l’endroit vérifiable : page, paragraphe, section, tableau, série, cellule, formulaire, accession SEC, DOI ou calcul. Une reproduction exige aussi un artefact reproductible.

La surface publique sélectionne au plus trois claims structurants par article. Chacune est classée automatiquement en `fait`, `estimation`, `inférence` ou `scénario`. Cette classification heuristique ne vaut pas revue : la claim reste `unreviewed` tant qu’aucune entrée canonique ne satisfait le contrat ci-dessus.

La sélection privilégie les claims explicitement marquées, les affirmations sensibles ou juridiques, les chiffres matériels et les relations vers une source primaire, un dataset, une méthodologie ou un dashboard. Le nombre brut de revues historiques n’est pas présenté comme un nombre de claims certifiés ; les entrées `legacy` peuvent conserver l’identifiant d’une claim qui ne figure plus dans la sélection structurante courante.

L’interface locale reste accessible avec `npm run claims:review`. Une sauvegarde crée ou remplace une entrée `canonical`. Le build refuse une entrée incomplète ou plus de trois claims canoniques pour une même analyse.
