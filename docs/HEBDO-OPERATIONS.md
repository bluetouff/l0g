# L'hebdo l0g : publication hebdomadaire

Ce guide organise la mise en ligne de l'édition web. L'Hebdo ne collecte aucune adresse électronique et n'envoie aucun message.

## Cadence

- Nouvelle édition chaque dimanche à 08 h 30, fuseau `Europe/Paris`.
- Une URL stable par édition.
- Aucune inscription, liste de diffusion ou mesure d'ouverture.

## Périmètre par rapport à Watch

- L'Hebdo est une lecture publique hebdomadaire.
- l0g Watch conserve une veille privée et peut envoyer des alertes liées aux éléments suivis.
- Aucun formulaire, compte ou préférence Watch ne doit être reproduit sur l0g.fr.
- La page de l'Hebdo peut présenter Watch comme le service de surveillance complémentaire, sans confondre les deux usages.

## Préparer une édition

Chaque entrée de `src/config/weekly-editions.ts` constitue la source unique. Elle fournit :

- la page de l'édition ;
- le graphique SVG ;
- le fichier CSV ;
- la citation TXT ;
- le post LinkedIn TXT ;
- le thread X TXT.

Avant publication :

1. Vérifier chaque chiffre dans la source primaire.
2. Vérifier les unités, dates, périmètres et recouvrements possibles.
3. Relire la citation, le post LinkedIn et chaque message du thread X.
4. Contrôler le rendu du SVG sur ordinateur et mobile.
5. Exécuter `npm run test:hebdo` puis le build complet.

## Publier le dimanche à 08 h 30

1. Préparer et valider l'édition avant le créneau de publication.
2. Fusionner suffisamment tôt pour que le build et la publication soient terminés avant 08 h 30.
3. Vérifier l'URL de l'édition, l'analyse liée, le SVG, le CSV et les fichiers texte.
4. Vérifier l'apparition de l'édition sur `/hebdo/` et dans le sitemap.
5. Publier ensuite les formats LinkedIn et X avec le lien canonique de l'édition.

La cadence est un engagement éditorial. Un build vert ne suffit pas : l'URL publique et les fichiers associés doivent être contrôlés après chaque publication.
