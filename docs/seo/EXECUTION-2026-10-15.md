# SEO et indexation anglaise : exécution du 15 octobre 2026

## État de livraison

Travail autorisé par « Go 1 à 7 », avec priorité aux articles anglais. Les corrections sont **validées localement** et leur push a été explicitement autorisé le 15 octobre par « oui push ». Cet état de préparation ne vaut pas preuve de succès CI ni d’activation en production ; ces étapes doivent être vérifiées sur le SHA publié. Les demandes GSC sont des actions réellement effectuées dans le navigateur interne ; leur acceptation ne prouve pas une indexation. Le registre JSON conserve séparément observations publiques, build local et décisions Google.

## Les sept chantiers

| Chantier | Résultat | Suite nécessaire |
| --- | --- | --- |
| 1. Glossaire anglais | Politique d’admission explicite : les 237 définitions courtes restent accessibles en `noindex,follow`, hors sitemap. Suppression de la fausse date de revue commune à chaque fiche ; citations anglaises sans année de publication inventée. | Publication puis contrôle du HTML servi. Une future admission demande une vraie page de référence, sans seuil de mots prétendument imposé par Google. |
| 2. SOFR | Métadonnées anglaises complètes, sans troncature ; erreurs de fond corrigées en FR/EN ; une figure historique vérifiée, compacte et lisible sur mobile. Registre des titres conservant l’ancien état. | Publication, nouvelle exploration, puis 14 jours complets comparables. Aucun gain causal attribué au titre. |
| 3. Atlas | Liens contextuels depuis 13 analyses et un guide, parcours pétrole dans Start ; demandes d’indexation des trois Atlas acceptées. | Activation du maillage ; contrôle ultérieur du statut Google. |
| 4. Articles anglais | 60 analyses et 2 guides exclus dans le rapport GSC contrôlés publiquement ; lot prioritaire de demandes dans le registre. Les 363 analyses et 50 guides canoniques du build restent indexables, dans le sitemap et reliés. | Observer la prise en compte des demandes ; poursuivre la qualification des autres pages. Ne pas soumettre plusieurs fois la même URL en espérant augmenter sa priorité. |
| 5. France | Comparaison à dates fixes exportée et vérifiée dans l’interface. Baisse concentrée notamment dans les recherches de marque visibles ; limite de couverture des tableaux explicite. | Conserver les titres sans diagnostic page × requête ; nouvelle comparaison sur fenêtres fixes et périmètre identique. |
| 6. Technique | robots.txt 200 et autorisation globale ; anciens 403 actuellement 200 ou 301 ; GET MCP 405 attendu. Budgets statiques, sécurité, liens et rendu mobile contrôlés. | Logs serveur encore non consultés : confirmation d’ouverture Zen demandée, zéro tentative. Extracteur local prêt, sans IP, query ni UA brut. |
| 7. Citations | Trois enquêtes profondes ajoutées aux ressources presse anglaises : Greensill, Cortina, Trafigura. URL, date, attribution, licence et limites de réutilisation explicites. | Publication ; aucun message ni démarchage externe envoyé. |

## Priorité anglaise

Le contrôle HTTPS couvre **65 URL** : les 62 pages de la cohorte et les trois Atlas. Toutes répondent 200, sont en anglais, présentent une canonique propre, autorisent l’indexation et figurent dans le sitemap public. Ce contrôle technique n’est pas une validation factuelle exhaustive de chaque article.

Dans le build, 363 analyses et 50 guides canoniques anglais sont indexables. L’ancienne URL `athora-the-balance-sheet-apollo-does-not-consolidate` est un alias de redirection vers `the-balance-sheet-apollo-does-not-consolidate` ; son `noindex` est maintenu.

Les Atlas IA, crédit privé et pétrole disposent respectivement de **10, 13 et 10 liens internes**, à deux clics des pages de navigation retenues par l’audit. Asie-dollar et JPMorgan passent de quatre à deux clics. La profondeur maximale de la cohorte devient trois. Il s’agit de la distance depuis les hubs existants, pas nécessairement depuis la seule page d’accueil.

Dix demandes ont été acceptées le 15 octobre : sept analyses (Trafigura, Greensill, GE HealthCare, collatéral GPU, PJM, achats asiatiques de dollars, surveillance JPMorgan) et les trois Atlas. Chaque succès affichait « Indexation demandée » et l’ajout à la file d’exploration prioritaire. Aucun de ces dix résultats n’est enregistré comme une indexation confirmée. Il s’agit d’un premier lot sélectionné, sans prétendre qu’un quota Google aurait été atteint.

Les statuts individuels peuvent différer du rapport de couverture plus ancien : GE HealthCare, PJM et JPMorgan sont annoncés inconnus dans l’inspection alors qu’ils figuraient parmi les URL détectées du rapport. Ces deux observations sont conservées séparément.

Les **145 fiches de glossaire auparavant indexables par défaut** contiennent 35 à 130 mots explicatifs (définition, intuition, formule et contexte), sans le format de référence développé. Les 92 autres étaient déjà explicitement exclues. La décision concerne ces fiches courtes, jamais les analyses. Dans le relevé global du 15 septembre au 12 octobre, les 63 lignes de glossaire anglais visibles totalisaient 4 clics et 424 impressions. Leur exclusion peut faire perdre une visibilité existante ; une amélioration du crawl ou du classement des articles n’est pas garantie.

## France : fenêtres fixes et couverture partielle

Période courante : **15 septembre au 12 octobre 2026**. Référence : **18 août au 14 septembre 2026**. Recherche Web, filtre France, propriété de domaine incluant les sous-domaines.

| Mesure | Référence | Courante | Variation |
| --- | ---: | ---: | ---: |
| Clics, total GSC | 150 | 119 | −31, soit −20,7 % |
| Impressions, total GSC | 3 542 | 4 205 | +663, soit +18,7 % |
| CTR calculé sur les totaux | 4,24 % | 2,83 % | −1,41 point |
| Position moyenne affichée | 20,3 | 13,0 | Amélioration de l’agrégat ; composition variable |
| Requête visible `l0g` | 30 clics | 15 clics | −15 ; position 1,06 → 1,00 |
| Requête visible `l0g.fr` | 9 clics | 1 clic | −8 ; position 1,00 inchangée |
| Page d’accueil, ligne visible | 38 clics | 16 clics | −22 ; position 1,91 → 1,11 |
| À propos, ligne visible | 12 clics | 17 clics | +5 |

Les deux requêtes de marque perdent 23 clics et leurs impressions reculent également. Cela soutient une hypothèse de moindre présence de la demande de marque, sans établir la cause de cette évolution. Les changements de CTR et de composition ne permettent pas de conclure à un effet du titre.

**Limite matérielle :** les 639 lignes de requêtes et les 211 lignes de pages exportées ne totalisent que 42 clics courants et 56 précédents. Les appareils, eux, réconcilient 119 et 150. Les premières lignes du tableau des pages ont été revérifiées dans l’interface et correspondent au CSV. La cause exacte de l’écart des pages avec le total reste inconnue. Les requêtes masquées ne sont pas reconstituées ; les sous-totaux FR/EN/PA Check ne représentent que les lignes visibles. Les baisses par requête et par page ne doivent pas être additionnées.

Décision : aucun changement général de titres ou de contenu français sur cette seule base. Maintenir les mesures déjà engagées pour H.4.1 et les autres expériences.

## Révision du guide SOFR

Les trois points les plus fragiles ont été contrôlés :

- **Construction du taux** : médiane pondérée, périmètre des transactions, filtrage des titres « special » et publication en heure de l’Est américain. Sources : [SOFR](https://www.newyorkfed.org/markets/reference-rates/sofr) et [méthodologie](https://www.newyorkfed.org/markets/reference-rates/additional-information-about-reference-rates).
- **Septembre 2019** : 2,43 % puis 5,25 %, écart de 282 points de base ; 75 milliards proposés mais environ 53 milliards effectivement prêtés. La figure ne mélange plus médiane quotidienne et pointe intrajournalière. Sources : [FRED / New York Fed](https://fred.stlouisfed.org/series/SOFR) et [rétrospective de la Fed](https://www.federalreserve.gov/econres/notes/feds-notes/what-happened-in-money-markets-in-september-2019-20200227.html).
- **Limites du dispositif** : conditions d’accès, coût de bilan et impossibilité de déduire une pénurie globale de réserves du seul spread. Sources : [FAQ des opérations](https://www.newyorkfed.org/markets/repo-agreement-ops-faq) et [analyse des enquêtes de contreparties](https://tellerwindow.newyorkfed.org/2026/05/14/surveys-suggest-improved-willingness-by-counterparties-to-use-standing-repo-operations/).

Les volumes et instantanés de taux de 2026 sans justification suffisamment précise ont été retirés. La fin du runoff au 1er décembre 2025 est distinguée d’une garantie de stabilité des réserves. Les dates de révision FR/EN sont alignées sur cette revue. Le changement du fond et des métadonnées interdit de présenter la livraison comme une expérience isolée sur le titre.

## Vérifications

- `npm run publish:check` : succès avec trois avertissements relus. Le « 8 » anglais correspond à « huit » en français ; les détecteurs causaux attrapent notamment « explique » dans la présentation du guide et « cause » dans une phrase qui refuse précisément de l’établir à partir du seul écart. Les alertes ne sont pas désactivées.
- SEO : 827 entrées, 561 titres SEO explicites et 256 images sociales validés.
- Parcours anglais : 4 tests réussis ; glossaire : contrôle réussi.
- Sécurité : 68 tests réussis et audit statique du build réussi ; pas de ressource tierce ni de script inline exécutable ajouté.
- Liens internes, secrets, typographie et budgets de performance : succès. Accueil : 31 836 octets gzip dans le contrôle. Ces budgets ne sont pas une mesure des Core Web Vitals réels.
- Astro : zéro erreur et zéro avertissement ; les indications existantes du projet ne sont pas assimilées à des erreurs.
- Navigateur interne : maillage Greensill, glossaire SCF, ressources presse et guide SOFR inspectés ; copie BibTeX avec retour « copied » ; absence de date de revue inventée. Contrôles à 390 pixels, presse à 1440 pixels. Accueil anglais, Atlas pétrole et guide FR contrôlés à 390 pixels sans débordement. Figure SOFR compacte relue visuellement dans les deux langues.
- Les fichiers préexistants de données publiques, l’image terminal et les documents de suivi antérieurs ne font pas partie de ce lot.

## Suite de livraison

Le push est autorisé. La livraison doit ensuite réconcilier le SHA poussé, la CI, CodeQL, le transport attesté et le `source.env` public. Après activation : vérifier les métadonnées, les 145 exclusions supplémentaires de fiches courtes, le sitemap et les liens effectivement servis avant toute revendication de résultat. Le contrôle des logs dépend séparément de l’ouverture Zen et, si les permissions de lecture l’imposent, d’une commande exécutée par l’utilisateur.

Registres : [indexation anglaise](english-indexation-2026-10-15.json), [comparaison France](france-comparison-2026-10-15.json), [expériences sur les titres](seo-title-experiments-2026-09.json).
