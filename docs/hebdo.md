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

Chaque édition possède sa couverture Open Graph de 1 200 × 630 pixels, composée pendant le build par `npm run og:hebdo` (inclus dans `npm run og`). Elle reprend le titrage régulier JetBrains Mono « L’Hebdo. », un fond anthracite avec de légers reflets cyan et rose, le numéro, la date de parution et l’illustration de la couverture web. Cette identité reste distincte des cartes d’analyse. Appliquer cette composition à chaque prochaine édition, sans appel à une API d’image.

Les trois premières éditions disposent de leurs illustrations propres, résolues par `weeklyCoverImage` dans `src/lib/weekly-presentation.ts`. Les autres reprennent l’image de leur revue éditoriale ou de leur dossier d’ouverture. Les illustrations sont conceptuelles ; elles ne constituent ni des photographies documentaires ni des graphiques de données. Les faits et les dates des instantanés historiques restent inchangés.

Le helper serveur `src/lib/weekly-social.ts` fournit aux pages et au générateur la même URL hashée. Son identité comprend la version graphique, le titre, la date, le numéro, le chemin et le SHA-256 des octets de l’illustration. Une modification de l’image renouvelle donc l’URL, même à chemin identique. Les métadonnées OG et X partagent l’image et sa description accessible ; `/hebdo/` reprend la carte du dernier numéro. Augmenter `WEEKLY_SOCIAL_VERSION` après une modification de composition, de palette ou de police. Le cache surveille aussi les helpers et les illustrations. La génération échoue explicitement si le titre intégral ne tient plus ou si l’image change pendant le rendu.

Sur l’accueil, `WeeklyCta` appartient à `HomeSidebar`, dans la colonne de droite sur ordinateur. Le menu conserve l’accès à l’Hebdo sur mobile. Les pages de l’Hebdo partagent une maquette de magazine : titrage JetBrains Mono régulier déjà auto-hébergé par le site, couverture sombre illustrée aux reflets cyan et rose discrets, sommaire et dossiers visuels. Les images proviennent des illustrations déjà publiées avec les analyses, sans chargement externe. En leur absence, une composition typographique reprend le numéro réel. Sources, limites et suivi font partie de la lecture principale. La collection affiche les anciens numéros sous forme de couvertures ; le dernier reste accessible par son lien permanent. Le graphique de cadence et les outils de réutilisation restent accessibles dans les détails documentaires.

Avant publication : `npm run test:hebdo`, `npm run weekly:check`, contrôle Astro, compilation et vérification des liens et des budgets de performance. Inspecter l’accueil, le dernier numéro et au moins une archive en clair/sombre et sur mobile. Vérifier le RSS, les exports et les dates de révision. Après un push autorisé, contrôler la version et les fichiers effectivement servis.
