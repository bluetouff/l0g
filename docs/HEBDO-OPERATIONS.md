# L'Hebdo l0g : publication automatique

L'Hebdo assemble chaque semaine les analyses déjà publiées sur l0g. Il ne collecte aucune adresse électronique, n'envoie aucun message et ne génère aucun fait économique nouveau.

## Cadence

- Nouvelle édition chaque dimanche à 08 h 30, fuseau `Europe/Paris`.
- Deux déclenchements UTC couvrent automatiquement l'heure d'été et l'heure d'hiver.
- Une URL stable par édition, sous `/hebdo/YYYY-MM-DD/`.
- Une archive chronologique sur `/hebdo/` et un flux `/hebdo/rss.xml`.
- Aucune inscription, liste de diffusion ou mesure d'ouverture.

## Source éditoriale

Les fichiers publics non brouillons de `src/content/posts/` constituent l'unique corpus d'entrée. Le générateur reprend seulement :

- le titre ;
- la description ;
- la date de publication ;
- la fiche `quickTake` lorsqu'elle existe.

Le focus est le dernier article de la fenêtre possédant une fiche `quickTake`. À défaut, le dernier article publié est utilisé. Ce choix facilite une synthèse structurée mais ne classe pas l'importance des sujets.

Le nombre et le graphique mesurent uniquement les publications de la fenêtre. Les faits, leur importance et leurs incertitudes sont recopiés sans reformulation depuis les métadonnées déjà relues. Toutes les sources économiques restent accessibles dans les analyses liées.

## Registre figé

`src/config/weekly-editions.generated.json` est append-only dans le fonctionnement normal. Chaque entrée fournit :

- la page de l'édition ;
- le graphique SVG ;
- le fichier CSV ;
- la citation TXT ;
- le post LinkedIn TXT ;
- le thread X TXT ;
- la liste des analyses incluses ;
- la fenêtre et l'instant de génération.

Une édition passée n'est pas recalculée lorsque le contenu source change. Une correction historique doit donc être explicite, relue et documentée comme une correction éditoriale.

## Chaîne automatique

Le workflow `.github/workflows/weekly-edition.yml` :

1. vérifie qu'il travaille sur le dépôt canonique et sur le dernier commit de `main` ;
2. installe la toolchain verrouillée ;
3. calcule chaque échéance manquante avec le fuseau `Europe/Paris` ;
4. ajoute uniquement les nouvelles éditions au registre figé ;
5. exécute les tests Hebdo, la politique CI, le contrôle des secrets et `git diff --check` ;
6. refuse toute modification autre que le registre généré ;
7. crée un commit en avance rapide sur `main` ;
8. déclenche le workflow `build.yml`, qui construit, atteste et publie la release statique selon la chaîne habituelle.

Les deux passages dominicaux sont idempotents. Le second sert de rattrapage lors du changement d'heure ou d'un léger retard du planificateur GitHub.

## Vérifications locales

Contrôler le registre sans le modifier :

```sh
npm run weekly:check
```

Générer les échéances dues :

```sh
npm run weekly:update
```

Valider le produit :

```sh
npm run test:hebdo
npm run test:ci-policy
npm run build
```

## Reprise après incident

Si une édition manque, lancer manuellement `weekly-edition` depuis GitHub Actions. Le générateur rattrape toutes les échéances absentes dans l'ordre, puis déclenche la release normale.

Ne jamais créer une édition vide à la main pour masquer un échec. Si aucune analyse n'a été publiée dans une fenêtre, le générateur produit une édition de continuité qui dit explicitement zéro et n'en déduit aucun signal économique.

Après publication, vérifier :

1. `/hebdo/` et la nouvelle URL datée ;
2. les liens précédent et suivant ;
3. `graphique.svg`, `donnees.csv`, `citation.txt`, `linkedin.txt` et `thread-x.txt` ;
4. `/hebdo/rss.xml` et le sitemap ;
5. le SHA public dans `/source.env`.
