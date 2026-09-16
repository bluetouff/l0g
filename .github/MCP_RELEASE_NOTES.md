# Serveur MCP public l0g.fr

Cette release publie le daemon distant en lecture seule dont la porte d’entrée est
`https://l0g.fr/api/mcp/compact`, avec `get_risk_state` comme produit principal,
et référencé dans le Registry officiel sous le nom
`io.github.bluetouff/l0g`.

## Correctifs de dépendances 1.24.5

Cette version active les mises à jour déjà intégrées au dépôt depuis la release
1.24.4 : `node-html-parser` passe de 9.0.1 à 9.0.4 et `hono` de 4.12.34 à 4.13.5.
Le parseur traite notamment la fermeture implicite des balises `dt` et `dd`.
Les correctifs Hono sont couverts par les tests de dépendances du dépôt.

Les outils, schémas, permissions et endpoints MCP restent inchangés. Zod reste
en version 3.25.76 ; cette release ne réalise pas de migration vers Zod 4.
Les optimisations de chargement du corpus et du graphe de preuve de la version
1.24.4 sont conservées.

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
