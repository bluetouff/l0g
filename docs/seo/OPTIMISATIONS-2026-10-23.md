# Optimisations SEO du 23 octobre 2026

Lot préparé localement à la suite de l’accord « go 1 à 5 ». Base de validation :
`ccf319fd4200c5b815aaadacf3ab79d550d4440d`. Les mesures publiques ci-dessous
précèdent les correctifs locaux. Aucune publication de ce lot n’est encore
attestée.

## 1. Crédit privé et assurance

Les dossiers FR/EN orientent désormais vers les enquêtes sur les acquisitions
d’assureurs et sur Jackson–Athene. Les chemins de lecture partagés fournissent
les retours vers le dossier et l’Atlas depuis les deux versions des enquêtes.
Les articles et leurs dates restent inchangés.

## 2. MSCI Indonésie

Les guides ETF FR/EN relient la création-rachat au cas documenté du flottant
indonésien. Un parcours permanent du hub Asia réunit ce cas et l’enquête sur les
ETF coréens, avec un lien vers le guide ETF. Les contrôles vérifient les
correspondances publiées `sourceArticle` et `sourceGuide`.

## 3. Définitions et référence opérationnelle

La définition PCDR FR/EN suit la [méthodologie Fitch du 30 janvier
2026](https://assets.fitchratings.com/downloadFile?reportType=report&sfReport=false&slug=corporate-finance/us-private-credit-default-rate-methodology-30-01-2026) :
univers délimité, douze mois glissants, émetteurs uniques RD/D et moyenne des
effectifs de début et de fin de période. Le nombre figé de 1 200 emprunteurs a
été retiré. L’exercice d’une option PIK contractuelle est distingué du défaut.
Les deux pages PCDR restent en `noindex`.

La référence Treasury buyback explique les avis, les offres, les achats
acceptés, le prix, les intérêts courus, le règlement et le financement. Son
exemple est entièrement fictif : 100 M$ de principal accepté à 98 pour 100,
plus 1 M$ d’intérêts courus, donnent 99 M$ payés et 100 M$ de principal retiré.
La figure décrit ces transferts et leur financement.

La contrelecture a vérifié les [règles, notamment les §375.2 et
375.23](https://www.ecfr.gov/current/title-31/subtitle-B/chapter-II/subchapter-A/part-375),
la [FAQ Treasury](https://www.treasurydirect.gov/help-center/faqs/buyback-faqs/)
et le financement décrit dans la [présentation Treasury de 2024, diapositive 8,
page PDF 64](https://home.treasury.gov/system/files/221/CombinedChargesforArchivesQ22024.pdf).

Après qualification individuelle, Treasury buyback devient une quatrième
référence FR et la première référence EN indexable. Les 307 autres fiches EN
gardent leur exclusion. Il s’agit d’une éligibilité locale à l’indexation,
sans constat d’admission par Google.

## 4. Ressources pour les journalistes

Deux ensembles FR/EN complètent les pages presse existantes. Chaque ensemble
contient une figure originale, un CSV, une méthode et une citation : 16 exports
statiques au total, produits depuis les mêmes données contrôlées.

* CoreWeave : environ 7,5 Md$ de capacité initiale et 8,5 Md$ après
  stabilisation, soit environ 1 Md$ supplémentaire sous conditions. Les
  plafonds se rapportent à deux phases d’une même facilité ; la figure ne
  représente pas des tirages. Sources : [communiqué déposé à la
  SEC](https://www.sec.gov/Archives/edgar/data/1769628/000176962826000129/ex991.htm),
  [présentation DDTL 4.0, pages 4 et
  5](https://s205.q4cdn.com/133937190/files/doc_presentations/2026/Mar/2026-03-DDTL-4-Overview.pdf).
* Trafigura : au 31 mars 2026, 7,7 Md$ de cash et 11,7 Md$ de lignes engagées
  non tirées composent 19,4 Md$ de liquidité déclarée. La ligne contingente de
  3 Md$ est déjà comprise dans ce périmètre. Source : [revue financière publiée
  le 4 juin 2026](https://www.trafigura.com/news-and-insights/insights/2026-trafigura-half-year-report/financial-review/).

Les limites, l’arrondi des valeurs, la date d’observation et les droits des
sources restent attachés aux exports. La licence CC BY porte sur les figures
et calculs originaux de l0g. Aucun contact externe n’a été effectué.

## 5. Mesures mobiles et corrections

Protocole : Lighthouse 13.5.0, Chrome for Testing 151.0.7922.34, écran mobile
412 × 823, trois navigations à froid par modèle. LCP et CLS ci-dessous sont les
médianes de ces trois passages. L’INP est mesuré par `web-vitals` 6.2.3 pendant
un parcours d’interaction par modèle, avec ralentissement CPU DevTools ×4.
Les navigations emploient la simulation Lighthouse ; ces protocoles sont
distincts. Les dépendances du laboratoire restent dans `/tmp`.

| Modèle public | LCP médian | CLS médian | INP du parcours de laboratoire |
| --- | ---: | ---: | ---: |
| Accueil FR | 1,61 s | 0 | 128 ms |
| Catalogue des guides FR | 1,53 s | 0,0100 | 88 ms |
| Guide H.4.1 EN | 1,44 s | 0,0017 | 112 ms |
| Atlas financement IA EN | 1,54 s | 0,0818 | 64 ms |
| Article avec simulateur d’adéquation FR | 3,48 s | 0 | 96 ms |

Le manifeste public est resté sur `ccf319fd` pour chaque mesure retenue.
Le [relevé structuré](mobile-lab-2026-10-23.json) conserve les valeurs
individuelles, intervalles, réglages, horodatages, limites et empreintes des
rapports bruts.

Deux corrections locales découlent du diagnostic :

* L’image d’ouverture des articles FR/EN utilise `loading="eager"` et
  `fetchpriority="high"`. L’audit réserve cette priorité à la première image
  du header de l’article ; les images du corps conservent leur chargement
  différé. Le modèle avec simulateur chargeait son image visible au premier
  écran en `lazy`.
* Les raccourcis de l’Atlas deviennent des liens de preuve présents dès le
  HTML initial. Ils restent utiles sans JavaScript et évitent l’insertion
  tardive d’un groupe mesuré à 269 px de haut sur mobile. Les clics modifiés
  gardent leur comportement natif. Les polices restent inchangées.

Le CLS de l’Atlas variait de 0,0006 à 0,1258. Les rapports évoquent aussi les
polices ; la trace complémentaire a confirmé l’insertion des contrôles, sans
permettre de répartir causalement le CLS entre ces facteurs. Aucun gain
chiffré des correctifs n’est revendiqué avant mesure de la version publiée.

Ces relevés de laboratoire ne constituent ni le p75 de lecteurs réels, ni
une validation Core Web Vitals terrain, ni une preuve d’effet sur le classement.
TBT et INP restent séparés. L’ancien audit INP des traces Lighthouse était
`notApplicable` ; cette absence n’a pas été transformée en zéro. Le passage
final `web-vitals` a suivi l’arrêt des contrôles concurrents de cette tâche.

## Validation et prochaine action

Le check isolé initial est passé sur 991 fichiers, avec zéro erreur et zéro
warning. `publish:check --no-build` est passé sur les deux guides ETF, avec
contrôle des sources, des liens et du SVG existant. Ce contrôle ne couvre pas
le corps des fiches de glossaire : celles-ci font l’objet de tests dédiés et
d’un contrôle rendu séparé.

Validation finale réussie sur les 31 fichiers source identiques entre le dépôt
et la copie isolée :

* `npm run check` : 991 fichiers, zéro erreur, zéro warning, 515 hints.
* `npm run build:ci` : terminé avec code 0 ; 2 155 pages Astro et 2 181 HTML
  audités, 272 tests SVG rendus, contrôles de sécurité, secrets, liens,
  typographie, performances et métadonnées réussis.
* Scan final des secrets : 4 882 fichiers, nouveaux fichiers et artefact `dist`
  compris, contrôle réussi.
* `npm run test:ci-policy` : réussi. Les nouveaux tests PCDR/Treasury et presse
  sont intégrés à la préparation des prochains builds, sans dépendance ajoutée.
* Maillage rendu : 16 assertions réussies, dont les retours des enquêtes FR/EN
  vers les dossiers/Atlas et le lien profond du guide ETF anglais.
* Références : 28 cas FR/EN, sept largeurs et deux thèmes ; XML, bornes des
  textes, métadonnées et contraste SVG vérifiés. Contraste minimal mesuré
  contre les tokens de fond/surface : 5,76:1.
* Atlas : 12 cas FR/EN à 390 et 1 280 px ; 84 destinations SSR et 84 sélections
  enrichies, fonctionnement sans JS, Enter et clics modifiés vérifiés. La
  géométrie des raccourcis reste identique avant et après activation.
* Presse : 16 cas de rendu FR/EN, quatre largeurs et deux thèmes ; les 16
  exports répondent correctement dans le preview. Huit URL de figures/CSV
  distinctes offrent leur téléchargement. Ce contrôle local ne certifie pas
  les en-têtes Apache de la future publication.
* Indexation locale : 308 fiches EN rendues, dont Treasury buyback seule
  indexable ; 307 autres `noindex`, PCDR FR/EN toujours `noindex`. Aucun
  `noindex` indésirable dans le sitemap, aucune destination interne
  indésirable détectée par l’audit de cohorte.

Le build conserve l’avis connu sur 451 métadonnées EN dépassant les anciens
seuils de 60/155 caractères ; les libellés complets n’ont pas été tronqués
mécaniquement. Les tests de sécurité sont des contrôles de projet, sans
prétention d’audit exhaustif.

Aperçus locaux du build validé : [référence Treasury
FR](http://127.0.0.1:4358/glossaire/treasury-buyback/), [référence
EN](http://127.0.0.1:4358/en/glossary/treasury-buyback/), [ressources
presse FR](http://127.0.0.1:4358/ressources-journalistes/#press-packages-title)
et [EN](http://127.0.0.1:4358/en/press-resources/#press-packages-title).

La publication, une fois autorisée pour ce lot, devra être suivie du contrôle
du SHA public, des deux références, des 16 exports et du maillage rendu.
La comparaison Search Console des quatre guides conserve son échéance fondée
sur quatorze jours complets après réexploration ; les titres restent inchangés.


## Publication autorisée

Après examen de l’aperçu, l’utilisateur a demandé explicitement le push.
Le lot de publication conserve les sources validées, les deux comptes rendus
propres à ce lot et son contrôle SVG rendu supplémentaire. Le plan d’exécution
partagé, les anciens relevés et les assets/EPUB locaux étrangers restent hors
de ce commit. La CI et la version publique seront contrôlées sur le SHA
poussé ; les conclusions de production seront ajoutées au suivi local après
observation, séparément des résultats de laboratoire.

Contrôle SVG persistant ajouté au groupe rendu : deux tests Treasury FR/EN
validés sur le dist propre et six tests du registre des suites réussis. Les
mutations de montant, de libellé hors cadre et de tracé hors viewBox sont
rejetées. Aucun changement du rendu depuis le build complet validé.
