# L’Hebdo l0g

## Lecture et revue

La page `/hebdo/` présente la dernière édition. Chaque numéro conserve son adresse `/hebdo/<slug>/`, sa date de parution et ses exports. Les compteurs de publications décrivent le périmètre documentaire ; ils ne servent pas à mesurer l’importance des sujets.

Une revue éditoriale datée peut enrichir un numéro dans `src/config/weekly-editorial.ts`. Elle apporte un fil de lecture, trois ou quatre dossiers, une source primaire par dossier, des limites explicites et des pièces à rechercher ensuite. Les dossiers doivent appartenir à la fenêtre de l’édition. Vérifier les affirmations vulnérables dans les sources avant d’ajouter la revue. Les chiffres restent attachés à leur date et à leur périmètre.

`reviewedAt` date la revue réelle. Elle ne déplace ni la parution du numéro ni les dates des articles. Le sitemap et la référence bibliographique indiquent cette révision. Les textes LinkedIn et X sont dérivés de la même revue ; aucun envoi n’est déclenché par ces exports.

## Génération et archives

Le registre `weekly-editions.generated.json` reste un instantané figé. Une refonte d’affichage ou une revue explicite ne réécrit pas les éditions historiques.

Les prochaines éditions automatiques conservent jusqu’à quatre fiches `quickTake` complètes de la fenêtre, en privilégiant des sujets distincts avant de compléter par récence. Les faits, mécanismes et incertitudes sont copiés sans reformulation. Ce parcours documentaire ne prétend pas remplacer une sélection éditoriale revue. Aucune donnée économique ni source primaire ne doit être inventée par le générateur.

Le calendrier existant du dimanche à 08 h 30, heure de Paris, demeure inchangé. Les pages ne collectent pas d’adresse email et n’intègrent aucun service de diffusion externe ni pixel de suivi.

## Présentation et contrôles

Sur l’accueil, `WeeklyCta` appartient à `HomeSidebar`, dans la colonne de droite sur ordinateur. Le menu conserve l’accès à l’Hebdo sur mobile. Sur les pages de l’Hebdo, l’en-tête reste compact ; sources, limites et suivi font partie de la lecture principale. Le graphique de cadence et les outils de réutilisation restent accessibles dans les détails documentaires.

Avant publication : `npm run test:hebdo`, `npm run weekly:check`, contrôle Astro, compilation et vérification des liens et des budgets de performance. Inspecter l’accueil, le dernier numéro et au moins une archive en clair/sombre et sur mobile. Vérifier le RSS, les exports et les dates de révision. Après un push autorisé, contrôler la version et les fichiers effectivement servis.
