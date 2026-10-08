# Audience, fiabilité et édition anglaise : exécution du 8 octobre 2026

## Périmètre et état

Le rapport HTML fourni est un point de départ à vérifier. Les recommandations
qu'il contient ne constituent ni des défauts tous démontrés ni une autorisation
de publication. Le lot a été validé localement. L’utilisateur a ensuite explicitement autorisé
le push et la mise en production du site, du MCP et du collecteur le 8 octobre.
La réussite des étapes de publication doit être vérifiée séparément.

Les fichiers locaux préexistants `public/risk.json`, `public/debt-latest.json`,
`public/og-terminal.png`, `livrables/` et le plan d'indexation du 1er octobre
restent hors du lot. Aucune suppression générale de `noindex`, changement de
slug, installation de traceur, création d'offre payante ou communication externe.

## Résultats vérifiés

- Les empreintes des exports GSC et GoAccess retrouvés dans Downloads
  correspondent au rapport. La base chiffrée minimale est dans
  `audience-baseline-2026-10-08.json`. Elle ne contient aucune IP issue de GoAccess.
- Les 28 jours du 8 septembre au 5 octobre donnent 210 clics et 26 186
  impressions, contre 186 et 15 877 les 28 jours précédents. Les deux sommes
  sont recalculées depuis les CSV, et non déduites des arrondis du tableau de bord.
- L'interface GSC affiche un état d'indexation au **4 octobre** : 1 033 pages
  indexées, 688 exclues, dont 364 `noindex`, 165 détectées et 93 explorées mais
  non indexées. Les exclusions intentionnelles ne sont pas toutes des erreurs.
- Les deux 403 GSC sont `/llms-full.txt` (dernier crawl affiché le 6 juillet)
  et `/posts/` (25 juin). Contrôle HTTP public : le premier répond 200 ; le
  second redirige vers `/`, qui répond 200. **Revalidation GSC démarrée le
  8 octobre**, état affiché « commencé ». Aucun succès final Google encore établi.
- Les deux autres 4xx GSC concernent `/api/mcp` et `/api/mcp/compact`,
  endpoints de protocole POST, pas des pages éditoriales à indexer. Leur refus
  de GET est attendu ; aucune validation artificielle ni page de remplacement.
- Les deux routes `/posts/incidents-ia-agents/` et
  `/posts/incidents-ia-agents-rapport/` répondent 404. Aucun lien actuel ni
  équivalent historique établi dans les sources et commits consultés.
  Leurs 175 et 86 occurrences GoAccess sont confirmées. Leur provenance reste
  inconnue : ne pas inventer une redirection vers une autre enquête.
- Le flux HTML public, généré le 8 octobre à 00:25:15 UTC, n'expose toujours
  pas `measurement.filter_version`. Le code versionne déjà le filtre et exclut
  les clients HTTP programmatiques déclarés. **Décalage entre le collecteur
  exécuté et le code corrigé**, à résoudre par son activation serveur distincte.

## Corrections concrètes

### Édition anglaise et cohérence documentaire

- Trois Atlas complets : financement de l'IA, crédit privé et pétrole ; une
  collection anglaise, contrôles interactifs, fiches, historique, sources,
  limites, partage, scénario et exports JSON anglais.
- Les traductions conservent les identifiants, relations, URLs primaires,
  dates de publication/revue et montants exacts du corpus. Une empreinte du
  corpus et un contrôle exhaustif des champs empêchent une traduction partielle
  ou devenue obsolète de passer silencieusement le build.
- Canonicals propres, liens de langues réciproques, navigation anglaise et
  dépendances de `lastmod` incluant corpus, traductions et composants.
- H.4.1 : distinguer moyennes hebdomadaires et niveaux du mercredi, puis guider
  la lecture des réserves, du compte du Trésor et des autres passifs.
- COFER : intégrer la méthode FMI introduite en 2025 (imputation et révision
  historique), sans conserver l'ancien dénominateur comme description actuelle.
- CPI : distinguer séries, ajustements saisonniers, logement et mesure PCE ;
  retirer les pondérations contemporaines non datées.
- Notations : opinions de risque relatif, périmètre émetteur/instrument,
  récupérations et horizon ; retirer les taux universels de défaut non étayés.
- Les erreurs factuelles présentes dans les versions françaises sont corrigées
  de façon ciblée. Les titres des expériences SEO sont conservés.
- Le graphique COFER utilise une présentation compacte en FR/EN ; les tags des
  guides anglais passent à la ligne sur petit écran.

### Fiabilité des outils et mesure

- Corriger la pagination qui pouvait repartir au début de certaines sections
  dans `get_document` et `get_article` ; tester la restitution complète et la fin.
- Refuser explicitement curseurs illisibles et dates civiles impossibles.
- Distinguer document inconnu, fichier indisponible et panne interne.
- Ajouter des causes d'erreurs agrégées, avec seuil public k=5 et sans conserver
  arguments, requêtes, slugs ou contenu des réponses. Les anciennes causes restent
  inconnues ; un nouveau diagnostic ne reconstitue pas le passé.
- Aligner le schéma OpenAPI du trafic sur son producteur réel : référents
  hebdomadaires, jours observés et couverture.
- Présenter séparément GET HTML filtrés, appels fonctionnels MCP et requêtes
  HTTP classées ; afficher la version de filtre ou son absence. Le total HTTP
  du collecteur recouvre les lectures HTML. Les fenêtres des sources diffèrent.

## Diagnostic anglais et décision de mesure

Relevé GSC dans le navigateur interne, recherche Web, du **8 septembre au
5 octobre 2026**. Le filtre utilisé pour H.4.1 est « URL contenant » l'URL
complète terminée par `/` pour les premiers relevés. Le segment États-Unis ×
ordinateur a ensuite été revérifié avec **URL exacte** : mêmes 98 impressions,
aucun clic, position 7,1 et 22 requêtes visibles, dont les quatre têtes identiques.
Les autres segments n’ont pas été revérifiés avec ce second filtre.

| Segment H.4.1 | Clics | Impressions | Position affichée |
| --- | ---: | ---: | ---: |
| Tous pays et appareils | 3 | 3,73 k, arrondi UI | 7,8 |
| États-Unis, tous appareils | 0 | 118 | 7,2 |
| États-Unis, ordinateur | 0 | 98 | 7,1 |

Dans le dernier segment, 22 requêtes sont visibles. `h.4.1`, `fed h.4.1`,
`fed h41` et `h.4.1 release` comptent respectivement 42, 17, 7 et 6 impressions,
sans clic. Une intention de recherche de la publication officielle est une
hypothèse plausible pour ces requêtes. Elle ne décrit pas les requêtes cachées.
Google avertit que les totaux filtrés peuvent être incomplets. Aucun effet
causal du titre n'est démontré. Les corrections de fond répondent à des erreurs
documentaires vérifiées ; elles ne sont pas présentées comme un test SEO isolé.

Les dix pages de suivi sont présentes avec leurs données exportées dans la
base JSON : H.4.1, RealT, SoftBank/OpenAI, Start, garantie de valeur résiduelle,
Nvidia, COFER, productivité/salaires US, Warsh/Fed et IA/productivité. Pour les
neuf autres, l'analyse détaillée page × requête × pays × appareil reste à faire.
Leurs tableaux agrégés ne suffisent pas à attribuer une cause au faible CTR.

## Les douze actions du rapport

| Action | État concret | Condition de clôture / suite |
| --- | --- | --- |
| DATA-01, version du filtre | Déjà codée ; absence confirmée dans le flux public | Activer le collecteur corrigé, vérifier le prochain JSON et comparer des échantillons locaux ; taux réel de faux positifs encore inconnu |
| OPS-01, 404 éditoriales | URLs, code et historique contrôlés ; origine non établie | Retrouver le référent dans les logs bruts ; rediriger uniquement si équivalence établie |
| MCP-01, get_document | Pagination et erreurs corrigées localement, tests | Activer la release MCP, observer les nouvelles causes ; 30 erreurs anciennes non reconstituables |
| MCP-02, research packs | Dates invalides refusées et causes instrumentées | Mesurer les nouvelles causes sur période comparable ; 32 erreurs anciennes non reconstituables |
| SEO-01, H.4.1 | Requêtes inspectées, guide corrigé, titre conservé | Nouvelle mesure après crawl et 14 jours complets ; distinguer correction de contenu et effet de titre |
| SEO-02, anglais US | Cohorte de dix URLs et quatre guides corrigés, trois Atlas EN créés | Compléter les segments manquants et vérifier l'indexation des nouvelles pages après publication |
| DATA-02, trois comptabilités | Troisième compteur et limites intégrés localement | Contrôler le rendu et les API publiques après activation |
| MCP-03, clientInfo other | Cause de sous-identification non établie | Examiner localement les libellés volontaires dans leur rétention ; ne pas reclasser arbitrairement ni forcer decision_ready |
| OPS-02, 403/406/5xx | Deux anciens 403 GSC répondent correctement ; revalidation commencée | Les 16 5xx et les règles WAF nécessitent logs bruts horodatés ; pas d'affaiblissement de protection |
| GROW-01, soutien | Visites déjà mesurables par le collecteur sans identifiant | Dons inconnus sans export agrégé du prestataire ; aucune attribution visite → don inventée ni nouvel identifiant |
| MCP-04, adoption indépendante | Non mesurable avec les agrégats disponibles | Intégrations volontairement déclarées à étudier ; nombre de clients distincts reste inconnu |
| PROD-01, offre commerciale | Hypothèse, aucune demande solvable établie | Documenter coût et usages avant prototype payant ; aucun compte, clé, prix ou engagement créé |

## Suivi programmé et critères éditoriaux

Suivi hebdomadaire le vendredi à 09:00, heure de Paris, du 9 octobre au
6 novembre 2026 inclus, via l'automatisation existante
`p2-l0g-relev-s-gsc-et-titres` renommée « l0g : audience et édition anglaise ».
Il contrôle les changements effectivement servis, les nouvelles causes d'erreur,
les indexations et la couverture des sources. Le suivi est actif et rattaché
à ce chat après accord explicite de l’utilisateur le 8 octobre.

Chaque passage peut préparer au plus une adaptation anglaise à forte utilité
internationale. C'est une limite de travail, jamais un objectif de volume :
absence de source ou d'angle distinct = aucune publication. Les nouveaux corpus
doivent expliquer un mécanisme documenté, proposer une navigation utile et garder
leurs incertitudes visibles. Vérifier sources, SVG, FR/EN, SEO et rendu avant de
déclarer la copie prête. Aucun push ni déploiement automatique.

La comparaison SEO commence après une réexploration constatée et couvre au
moins 14 jours complets. Conserver les mêmes filtres, traiter les données
partielles séparément et rapporter « non concluant » si l'échantillon ne permet
pas de décision. Notifications seulement en cas de changement matériel, résultat,
échec ou intervention nécessaire. Dernier bilan prévu le 6 novembre.

## Chaîne d’activation autorisée

1. Autorisation explicite reçue pour le lot relu et validé. Préparer la release
   MCP `1.24.6` : coordonnées de version et manifeste synchronisés, tag immuable.
2. Vérifier CI et build exact, puis le site réellement servi et les liens EN.
3. Activer la release MCP suivant `mcp-server/README.md`, puis tester les
   contrats et les diagnostics publics sans modifier la taxonomie à l'aveugle.
4. Sur la console serveur autorisée, utiliser le script versionné
   `deploy/install-human-traffic.sh` depuis un checkout vérifié. Contrôler timer,
   service et `measurement.filter_version` sur le nouvel agrégat public.
5. Diagnostiquer localement les logs Apache/WAF nécessaires, sans exporter les
   IPs, cookies, chemins de référent sensibles ni paramètres de requête.

Une lecture du marqueur `source.env` a été refusée par le contrôle automatique
d'approbation (risque de fichier d'environnement sensible). Elle n'a pas été
contournée. Aucun état de publication n'est déduit de cette lecture absente.

## Validation finale

Une validation locale ne vaut ni CI distante ni activation.

- `npm run check` : 673 fichiers, aucune erreur ni avertissement, 238 indications
  de l’outil. Exécution locale sous Node 26.0.0 ; la CI Node 22 reste à exécuter.
- `npm run publish:check -- --no-build` sur les huit guides : réussi, 16
  avertissements relus. Les principales divergences automatiques sont 16 h /
  4 pm, les notations T3 / Q3 et une source New York Fed supplémentaire en
  anglais. Les formulations causales, dates et notes de sources ont été relues.
- Atlas : 35 tests réussis, quatre tests sitemap, trois exports anglais générés
  contrôlés contre leurs corpus. Navigation, historique, filtres et scénario IA
  inspectés en navigateur ; aucune régression française ni débordement aux
  tailles contrôlées, dont 320 et 390 pixels.
- MCP : 21 tests de pagination/télémétrie et neuf tests de cache réussis ; dix
  tests du rapport HTML et de son total HTTP réussis.
- Page agents : état indisponible contrôlé sans chiffre de remplacement, puis
  rendu des agrégats publics récupérés le 8 octobre sur serveur local de test.
  Les 53 047 GET HTML et 376 506 requêtes HTTP sont affichés distinctement ;
  version du filtre absente signalée ; aucun débordement à 320 pixels.
- Premier build interrompu par un ancien test comparant les derniers bits
  flottants du simulateur de retraite : écart maximal 5,82 × 10⁻¹¹ euro.
  Test corrigé avec tolérance de 16 epsilon-machine, finis obligatoires,
  zéros/entiers/structure/CSV exacts. 26 tests réussis, dont rejet d’un centime
  d’écart et de NaN/Infinity. Aucun modèle ni jeu de données financières changé.
- `npm run build` final : réussi, y compris 603 tests de graphiques/modèles,
  contrôles de sécurité, scan de secrets, contrat agent, recherche Pagefind,
  90 987 liens internes sur 1 779 pages, typographie et budget performance/SEO.
- Huit guides inspectés à 320, 360, 390, 640, 780, 1 280 et 1 440 pixels :
  56 combinaisons sans débordement de page ni élément SVG hors cadre. Les
  corrections COFER et tags ont été recontrôlées sur le build final. Les huit
  guides ont aussi été inspectés en thème clair à 320 pixels ; figures lisibles,
  thème fonctionnel, aucun débordement. Les réglages temporaires ont été rétablis.
- Les sorties publiques et EPUB régénérées sans lien avec ce lot ont été
  restaurées à leur état initial ; les trois fichiers publics déjà modifiés
  par l’utilisateur ont été conservés octet pour octet (empreintes SHA-256).
  `git diff --check` réussi après nettoyage.
- Ces résultats décrivent la validation locale préalable à la publication.
  CI distante, artefacts attestés, révision servie, runtime MCP et collecteur
  doivent ensuite être contrôlés chacun sur le commit publié.
