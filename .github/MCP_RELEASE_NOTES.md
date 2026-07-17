# Serveur MCP public l0g.fr

Cette release publie le daemon distant en lecture seule exposé sur
`https://l0g.fr/api/mcp` et référencé dans le Registry officiel sous le nom
`io.github.bluetouff/l0g`.

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
