# Cohorte d’indexation du 28 août 2026

## Donnée source

L’archive Coverage fournie le 4 septembre contient les agrégats de statut mais
aucun exemple d’URL. L’archive Performance fournie le même jour contient des
tables Pages et Requêtes distinctes, sans jointure page-requête et sans statut
d’indexation. Les exemples ont donc été exportés directement depuis les six
drilldowns Search Console le 4 septembre.

Le fichier `gsc-indexation-cohort-2026-08-28.csv` réunit les statuts suivants :

- 86 détectées, actuellement non indexées ;
- 66 explorées, actuellement non indexées ;
- 19 introuvables 404 ;
- 2 autres erreurs 4xx ;
- 2 interdites 403 ;
- 1 doublon sans canonique choisie.

Il reprend exactement l’en-tête de `gsc-indexation-cohort-template.csv`. Une
cellule reste vide quand Google ne fournit pas la valeur. C’est notamment le cas
du canonical choisi par Google, absent de l’export groupé. Aucune valeur n’est
déduite à sa place. Les 176 URL sont uniques.

## Audit reproductible

Après un build complet :

```sh
node --experimental-strip-types scripts/audit-indexation-cohort.mjs \
  --dist dist \
  --input docs/seo/gsc-indexation-cohort-2026-08-28.csv \
  --expected 176 \
  --output docs/seo/gsc-indexation-decisions-2026-08-28.csv \
  --summary docs/seo/gsc-indexation-summary-2026-08-28.json
```

Le résultat conserve les champs GSC et ajoute la présence dans le build et le
sitemap, le canonical réellement généré, robots, langue, volume de texte,
nombre de liens entrants, distance depuis les hubs et titres dupliqués. Chaque
URL reçoit une décision parmi : `a_indexer`, `noindex_voulu`, `redirection`,
`supprimee_410`, `erreur_reelle`, `inconnue`.

`inconnue` est une décision explicite, pas une cause inventée. Elle impose une
revue humaine avant redirection, suppression ou demande d’indexation.

Sans `--input`, le même script contrôle CA10 sur le build courant : aucune URL
du sitemap ne doit être noindex, redirigée, absente ou canonicalisée ailleurs,
et aucun lien interne ne doit finir sur une redirection ou une canonicalisation
alternative.

Les 12 redirections et 3 canonical alternatives sont conservées séparément dans
`gsc-redirects-alternates-2026-08-28.csv` et leur audit dans les deux fichiers
portant le même préfixe avec les suffixes `decisions` et `summary`.
