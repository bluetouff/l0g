# Black Box Recorder v2

Le registre probant commence à sa première frame v2. Les anciennes frames dérivées ne sont pas
rétroactivement présentées comme des preuves point-in-time.

## Contrat

- branche dédiée `black-box-archive` ;
- un fichier nouveau sous `frames/` par build publié ;
- aucune modification, suppression ou renommage d'une frame existante ;
- `frameHash` calculé sur toute la frame hors `frameHash` ;
- `previousFrameHash` égal au hash de la frame précédente, ou `null` pour la genesis ;
- hashes contemporains canoniques des surfaces agents et hashes JSON canoniques des snapshots risque ;
- SHA Git, temps observé, récupéré et calculé, plus référence du run attesté par Sigstore.

Le site lit cette archive via `L0G_BLACK_BOX_ARCHIVE_DIR`. Sans archive locale, il publie une
couverture vide et explicite. Il ne reconstruit jamais le passé depuis les données courantes.

## Garde CI

Le workflow valide toute la chaîne avant le build. Après ajout, il refuse tout état Git autre qu'un
nouveau fichier `frames/*.json`, reconstruit le site depuis l'archive, teste l'Agent Surface et le MCP,
atteste les manifests avec GitHub Artifact Attestations, publie `built`, puis effectue un push normal
et non forcé de l'archive.

La branche `black-box-archive` doit aussi être protégée dans GitHub avec les règles suivantes :

- interdiction des force pushes et des suppressions ;
- écriture limitée au workflow GitHub Actions ;
- historique linéaire obligatoire ;
- administrateurs inclus dans les règles.

Git rend les réécritures visibles, la chaîne de hashes rend les frames altérées détectables et
l'attestation Sigstore relie les manifests au workflow et au commit publiés. Cette combinaison ne
prouve pas la vérité économique d'un modèle, seulement l'intégrité et la provenance du snapshot.

## Vérification locale

```bash
L0G_BLACK_BOX_ARCHIVE_DIR=.black-box-archive npm run black-box:validate
```

La création d'une frame locale non attestée est possible pour les tests, mais elle ne doit pas être
publiée sur la branche d'archive.
