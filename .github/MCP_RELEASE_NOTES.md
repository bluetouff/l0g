# Serveur MCP public l0g.fr

Cette release publie le daemon distant en lecture seule dont la porte d’entrée est
`https://l0g.fr/api/mcp/compact`, avec `get_risk_state` comme produit principal,
et référencé dans le Registry officiel sous le nom
`io.github.bluetouff/l0g`.

## Rechargement du corpus 1.24.11

Cette version libère les références de cache vers un corpus retiré avant de
charger son remplaçant. L’index de recherche suit désormais la durée de vie de
son catalogue via une WeakMap, et le nettoyage d’une réponse HTTP retire son
écouteur après exécution. Les requêtes déjà en cours conservent leurs propres
références ; un échec de chargement reste une erreur explicite.

La régression mémoire est reproduite sous les limites de production, puis le
correctif passe les six outils compacts lors des bascules A → B → A du corpus
réel, avec un heap de 384 Mio et une limite de processus de 768 Mio. Les tests
couvrent aussi concurrence, rollback, échec de lecture et isolation des index.

Le runtime conserve node-html-parser 9.0.7, le SDK MCP 1.32.2 et
l’adaptateur @hono/node-server 2.1.3. L’unité versionnée porte le budget mémoire
préparé pour le corpus actuel.

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
