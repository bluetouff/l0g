# Serveur MCP public l0g.fr

Cette release publie le daemon distant en lecture seule dont la porte d’entrée est
`https://l0g.fr/api/mcp/compact`, avec `get_risk_state` comme produit principal,
et référencé dans le Registry officiel sous le nom
`io.github.bluetouff/l0g`.

## Correctifs de dépendances 1.24.8

Cette version met à jour `node-html-parser` de 9.0.4 à 9.0.5 et embarque
`fast-uri` 3.1.9, déjà intégré au dépôt après la release 1.24.7. Les tests de
régression couvrent la confusion de schéma et d'hôte ainsi que la normalisation
des références relatives et des deux-points dans le premier segment d'une URI.

Elle embarque également les mises à jour déjà intégrées de `body-parser` 2.4.0
et de ses dépendances. Les outils, schémas, permissions et endpoints MCP restent
inchangés ; le serveur conserve Zod 4.6.7 et le SDK MCP 1.32.1.

La chaîne de compilation utilise Node.js 22.23.4 pour satisfaire le minimum
de sécurité des dépendances Astro actualisées.

La publication vérifie les contrats du serveur complet et compact, Agent Bench,
les dépendances et l’archive Linux extraite avant attestation. L’activation en
production et l’inscription au Registry sont vérifiées séparément.

## Périmètre

- transport Streamable HTTP stateless ;
- resources, resource templates, prompts et tools de recherche vérifiable ;
- aucune écriture ni action sur un compte utilisateur ;
- archive de production Linux/Node pour l'infrastructure l0g.fr, pas un paquet
  npm générique.

## Licence

- code du serveur, tests et déploiement : MIT ;
- textes, données et artefacts éditoriaux renvoyés : CC BY 4.0 avec attribution ;
- éléments tiers : droits de leurs titulaires.

L'archive contient la licence MIT, les notices, la politique de sécurité, le
README, le lockfile, les dépendances runtime et un SBOM CycloneDX.

## Vérification

Télécharger l'archive, son fichier `.sha256` et son bundle
`.sigstore.jsonl`, puis vérifier la somme et la provenance GitHub/Sigstore avec
`sha256sum -c` et `gh attestation verify` avant exécution.

Documentation : <https://l0g.fr/mcp/>
