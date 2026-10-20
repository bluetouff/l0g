# l0g Péage

## Objet

Construire une base d'enquête sur les marchés organisés autour des obligations
réglementaires. Le parcours de référence est :

texte applicable → acteur obligé → intermédiaire → contrat → coût observable
→ possibilités de sortie.

L'enquête rapproche ensuite les marques, les entités juridiques, les propriétaires
et les infrastructures sous-jacentes lorsque des pièces permettent d'établir
ces relations. La présence d'une obligation et d'un prestataire ne suffit pas
à prouver un paiement, une rente ou une influence sur le législateur.

## Articulation avec PA Check

PA Check reste le produit consacré aux plateformes de facturation électronique.
Péage ne doit pas recréer un annuaire, un comparateur tarifaire ou une aide au
choix de plateforme. Les informations pertinentes déjà maintenues dans PA Check
doivent être référencées ou réutilisées par un contrat de données explicite,
sans créer une seconde base divergente.

L'unité principale de Péage est une relation économique documentée et datée.
Une fiche de prestataire n'est pas, à elle seule, un dossier Péage.

## Questions d'enquête

- Plusieurs marques apparemment distinctes reposent-elles sur le même fournisseur
  technique ou appartiennent-elles au même groupe ?
- Quelles clauses permettent à un intermédiaire de facturer l'accès,
  l'archivage, l'intégration ou la sortie ?
- Quels coûts sont observés dans un contrat ou une facture, et quels montants
  restent de simples tarifs publics ou estimations ?
- Quelles dépendances persistent après un changement de prestataire ?
- Quels acteurs et mécanismes se retrouvent dans plusieurs marchés réglementés ?

Ces questions sont des hypothèses de recherche, pas des résultats acquis.
Facturation électronique, identité numérique et infrastructures de paiement
sont des terrains possibles. Leur extension dépend de pièces vérifiables.

## Données nécessaires

Chaque relation doit porter au minimum :

- les identités des parties et la nature exacte de la relation ;
- la source primaire et le passage permettant de la vérifier ;
- la date du document, la date d'observation et, si connue, sa période de validité ;
- le statut de preuve : documenté, attribué, interprétation ou inconnu ;
- les limites, contradictions et corrections connues.

Une participation au capital, un partenariat, une sous-traitance et une
consolidation comptable sont des relations différentes. Un montant annoncé,
une obligation contractuelle et un paiement observé restent distincts.
La part de marché et la concentration ne seront pas calculées sans dénominateur
et périmètre défendables.

## Premier dossier : Dext / IRIS / Serensia / Quadient

La route `/peage/` présente une carte de sept relations et sept sources primaires,
revues le 20 octobre 2026. Le rapport annuel du groupe IRIS établit la détention
indirecte des entités Dext au 30 avril 2026. Le contrat français Dext nomme
Serensia comme hébergeur de la PA. Quadient déclare avoir acquis Serensia et
cite Dext ainsi que Cerfrance parmi les partenaires de la plateforme.

Le rapprochement permet de demander si une migration entre offres change
réellement le fournisseur technique. Il ne démontre ni machines partagées,
ni panne commune, ni partage de revenus.

Trois mécanismes de sortie restent séparés : changement de PA, fin de
l'abonnement et récupération des données. Les questions à adresser au fournisseur
peuvent être sélectionnées et téléchargées localement. Aucun envoi automatique,
aucune donnée personnelle collectée.

### Implémentation et maintenance

- `src/data/peage-dossier.ts` : dossier, parties, relations, pièces et limites.
- `src/lib/peage.ts` : contrat de données, contrôles de références et export.
- `src/components/PeageDossier.astro` : carte SVG, parcours mobile et preuves.
- `src/scripts/peage.ts` : sélection, filtres, liens profonds et export des demandes.
- `/peage/dossier.json` et `/peage/dossier.md` : exports statiques avec limites.
- `npm run test:peage` : intégrité des relations, dates, URL, liens et exports.

Les preuves restent lisibles sans JavaScript. Les filtres mettent en évidence
une couche sans transformer les autres relations en absences. La date de revue
n'est jamais substituée à la date de situation attestée. Le JSON est une
photographie documentaire, pas un historique complet ni une API de temps réel.

Le build contrôle le corpus avant de rendre la page et les exports. Toute nouvelle
relation doit identifier ses parties, sa nature, son statut, sa date, ses limites
et au moins une source avec un repère précis. Les clauses d'un contrat individuel
et un montant effectivement payé restent inconnus sans pièces correspondantes.

Le critère de réussite est la valeur documentaire du rapprochement, pas le
nombre de fiches ni la quantité de crédits consommés.

Le potentiel défendable repose sur les relations vérifiées, leurs évolutions,
les contrats comparables, les corrections et les contributions documentées.
Une collection de pages commerciales ne suffit pas à l'établir.

## Prototype écarté le 20 octobre 2026

Le premier prototype s'était recentré sur quatre offres de facturation, leurs
tarifs et trois critères de service. L'utilisateur a signalé son chevauchement
avec PA Check. Ce périmètre est écarté pour Péage.

Le prototype et ses huit sources sont conservés localement dans
`livrables/peage-prototype-offres-2026-10-20/` à titre de travail récupérable.
Ses routes, liens de navigation et intégrations au build ont été retirés.
Le dossier archivé n'est pas une application autonome.
Aucune publication ni modification de PA Check n'a été effectuée.
