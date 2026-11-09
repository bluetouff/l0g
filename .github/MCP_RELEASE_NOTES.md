# Serveur MCP public l0g.fr

Cette release publie le daemon distant en lecture seule dont la porte d’entrée est
`https://l0g.fr/api/mcp/compact`, avec `get_risk_state` comme produit principal,
et référencé dans le Registry officiel sous le nom
`io.github.bluetouff/l0g`.

## Correctifs de dépendances 1.24.10

Cette version met à jour `node-html-parser` de 9.0.5 à 9.0.7. Elle embarque
également le SDK MCP 1.32.2 et l’adaptateur `@hono/node-server` 2.1.3, intégrés
au dépôt depuis la release 1.24.8. Le workflow normalise désormais la date
du commit en UTC pour les builds déterministes.

Les outils, schémas, permissions et endpoints MCP restent inchangés. La chaîne
de compilation utilise Node.js 22.23.4 et les lockfiles vérifiés du dépôt.

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
