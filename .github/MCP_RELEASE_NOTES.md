# Serveur MCP public l0g.fr

Cette release publie le daemon distant en lecture seule dont la porte d’entrée est
`https://l0g.fr/api/mcp/compact`, avec `get_risk_state` comme produit principal,
et référencé dans le Registry officiel sous le nom
`io.github.bluetouff/l0g`.

## Correctifs de performance 1.24.4

Les requêtes simultanées à froid partagent désormais le chargement du corpus de
leur release. L'index du graphe de preuve est réutilisé entre requêtes pour éviter
sa reconstruction et les parcours répétés de toutes les arêtes.

Le chemin réel de la release reste vérifié à chaque lecture : une bascule ou un
rollback prend effet sans délai de cache. Une erreur de chargement est propagée,
sans substitution silencieuse du corpus précédent. Les serveurs et transports
MCP restent isolés par requête ; aucune dépendance ni capacité publique ajoutée.

La validation locale couvre la concurrence, les échecs et leur récupération,
les bascules atomiques et l'ordre des arêtes. La comparaison du corpus a produit
664 réponses identiques avant et après optimisation. Les nouveaux modules sont
inclus dans les empreintes obligatoires de l'archive.

Les cinq signaux attendus exposent également un état indisponible explicite
lorsque les contrôles de fraîcheur et de provenance ne sont pas satisfaits.
Leurs anciennes valeurs ne sont pas présentées comme des valeurs courantes.

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
