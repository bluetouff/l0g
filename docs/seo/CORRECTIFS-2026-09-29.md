# Corrections du rapport de situation du 28 septembre

Revue du 29 septembre 2026 à partir du fichier fourni
`rapport-situation-evolution-l0g-2026-09-28.html`, du dépôt, de réponses HTTP
publiques et de l’interface Search Console authentifiée. Les archives sources
du rapport ne sont pas jointes à cette tâche : leurs calculs ne sont pas
présentés ici comme recalculés indépendamment.

## Corrections locales

- Le filtre de trafic exclut désormais les signatures déclarées Python,
  HTTPX, Requests, urllib, aiohttp, curl, Wget et HTTPie des GET HTML retenus.
  Elles sont classées dans `other`, sans leur attribuer une fonction de
  crawler. Les classes MCP/API et scans gardent leur priorité. Des tests
  vérifient le total, les canaux, les exclusions et la conservation des
  lectures de navigateur.
- Le libellé public devient « lectures HTML filtrées ». Le user-agent ne
  certifie ni un accès humain ni une personne distincte. Les clés de données
  existantes restent compatibles ; `measurement.filter_version` identifie
  la nouvelle méthode `html-ua-filter-2`. Le tableau hebdomadaire expose la
  date de génération et la version du filtre, ou leur absence.
- Les pages À propos FR et EN orientent dès leur introduction vers le
  parcours de lecture, les guides et les publications. Les pages d’accueil
  disposent déjà de parcours et de liens éditoriaux ; aucun bloc supplémentaire
  n’y est ajouté.
- Le registre SEO conserve les inspections précédentes, ajoute les nouvelles,
  intègre dealer gamma et repo/SOFR et consigne une décision motivée de
  conservation. Les titres restent protégés contre les modifications
  accidentelles. La prochaine collecte est prévue au registre le 30 septembre,
  avec revue le 5 octobre ; cela ne crée pas de tâche planifiée.

## Search Console : observations directes

Les cinq pages sont indiquées comme indexées, récupérées avec succès et
autorisées à l’indexation. Google retient chaque URL inspectée comme canonical.
Les heures ci-dessous sont celles affichées ; aucun fuseau n’est inventé.

| Page EN | Dernière exploration affichée | HTML exploré |
| --- | --- | --- |
| H.4.1 | 15 septembre 2026, 05:48:16 | Titre courant `Fed H.4.1: what bank reserves really show \| l0g` vérifié |
| Nvidia | 15 septembre 2026, 13:59:05 | Titre courant `Nvidia $500bn AI financing: what is committed? \| l0g` vérifié |
| Dealer gamma | 6 septembre 2026, 11:22:22 | Titre de repli courant, tronqué après `drives…`, vérifié |
| Repo/SOFR | 10 septembre 2026, 09:49:21 | Titre de repli courant, tronqué après `Rate…`, vérifié |
| RealT | 28 août 2026, 19:42:58 | Ancien titre `RealT in liquidation: the token that did not own… · l0g.fr` ; titre SEO courant non encore observé dans ce HTML |

Repo/SOFR affiche une erreur temporaire dans la rubrique Sitemaps, tout en
confirmant une récupération réussie et une page indexée. Cette mention ne
prouve pas un défaut d’indexation de la page.

Pour H.4.1, le filtre **URL exacte**, recherche Web, tous pays et appareils,
du **17 au 26 septembre** donne **1 995 impressions, un clic, position affichée
7,7**. Cette fenêtre commence deux dates après le crawl affiché du 15 septembre.
Le CTR recalculé est `1 / 1995 × 100 = 0,0501 %` ; l’interface arrondit à 0,1 %.
Les **26 requêtes** affichées ont été toutes relevées dans le registre :
**178 impressions, aucun clic**. Plusieurs concernent la publication officielle
H.4.1. Elles ne permettent pas d’attribuer l’unique clic ni de décrire les
requêtes non restituées. Le seuil opérationnel d’impressions est dépassé,
mais ce n’est pas un essai contrôlé démontrant un effet du titre.

Le tableau global d’indexation affiche un état daté du **21 septembre** :
938 URL indexées, 613 non indexées, dont 345 noindex, 26 canonicals alternatives,
19 introuvables, 15 redirections, 2 autres 4xx, 2 accès interdits, 117 détectées
non indexées et 87 explorées non indexées. Ces catégories totalisent bien 613.
Ce relevé ne constitue pas un état d’indexation au 29 septembre.
Les listes d’URL n’ont pas été réexportées.

Le Mac s’est verrouillé après la mesure H.4.1. Les quatre autres extractions
Performance et le segment pays × appareil restent à relever. Les valeurs
post-recrawl non mesurées restent inconnues. Aucune réécriture de titre n’est
justifiée par les seules données recueillies.

## Contrôles HTTP et trafic

Le marqueur public `source.env` consulté identifie la révision
`98300bb894f1f10de3b2aa13d3f7a3d5dee024ed`, run `36472519118`.
Ce marqueur précède les présents correctifs locaux.

- `GET` et `HEAD` sur `/api/mcp` et `/api/mcp/compact` répondent **405**,
  avec **Allow: POST**. Le code du serveur prévoit ces refus. Cela confirme
  le contrat actuel, sans attribuer rétrospectivement chaque 405 des logs.
- `GET /posts/incidents-ia-agents/` répond **404**, observé à
  `2026-09-28T22:25:13Z`. La chaîne est absente du code et de l’historique Git
  consulté. L’article `/posts/ia-ralentissement-2-incidents-securite-faits/`
  existe, mais l’origine du lien court et l’équivalence éditoriale ne sont
  pas établies. Aucune redirection vers une destination supposée n’est créée.
- L’agrégat public `/api/v1/human-traffic.json` est accessible, schéma 1.1.0,
  généré le **28 septembre à 00:18:07.988 UTC**, soit 02:18 à Paris. Il
  contient 40 076 GET HTML filtrés du 14 au 28 septembre, avec un dernier
  jour partiel. La version du filtre n’y est pas renseignée.

| Date des logs | GET HTML filtrés, ancien collecteur | Référent absent, classé direct |
| --- | ---: | ---: |
| 26 septembre | 4 029 | 2 796 |
| 27 septembre | 5 802 | 5 178 |
| 28 septembre partiel | 584 | 570 |

La forte part sans référent le 27 reste une observation de requêtes. Elle
n’identifie ni des personnes ni la cause de la hausse. L’agrégat précède de
près de vingt heures le GoAccess du rapport et ne contient pas les dimensions
horaires ou user-agent permettant de conclure. Les anciens chiffres ne sont
pas corrigés rétrospectivement par estimation.

## Étapes encore nécessaires

La correction du collecteur devra être installée via le script existant
`deploy/install-human-traffic.sh`, puis vérifiée dans un nouvel agrégat
contenant `measurement.filter_version`. Le build statique ne met pas à jour
ce service. Aucun accès ni changement de configuration serveur n’est réalisé
dans cette tâche.

Les douze 5xx, les 403/406 et le référent de la 404 exigent les journaux Apache
expurgés et une corrélation avec les journaux d’erreur. Les seuls compteurs du
rapport ne permettent pas d’en corriger la cause. Le script existant
`scripts/apache-error-report.py` extrait les 400/5xx sans IP ni query ; il
ne couvre pas à lui seul le diagnostic des autres statuts.

La cadence et la monétisation X relèvent d’un test éditorial et de mesures
ultérieures. Aucun post, réglage de compte ou engagement de publication
n’est effectué. Les suggestions du rapport ne sont pas assimilées à une
autorisation d’envoyer des messages.

## Validation locale

- `npm run check` : zéro erreur, zéro avertissement ; 159 indications Astro.
- Génération des assets du prébuild, puis chaîne complète du script `build`
  exécutée avec Node 22.23.1 dans une copie isolée. Les tests du filtre,
  SEO, sécurité, secrets, surfaces agents, SVG, liens et performance passent.
  L’audit final couvre 1 602 pages HTML et 81 046 liens internes.
- Le build émet des avertissements Vite `MODULE_LEVEL_DIRECTIVE` sur les
  directives MDX `use astro:head-inject`. Les contrôles finaux passent ;
  ces avertissements ne sont pas présentés comme absents.
- Inspection dans le navigateur des pages À propos FR et EN à 390 et
  1 440 pixels : liens lisibles, cibles canoniques présentes et aucun
  débordement horizontal. Thèmes clair et sombre vérifiés sur la page FR.
- Diff relu et `git diff --check` exécuté. Les trois fichiers de données ou
  d’image déjà modifiés avant cette intervention sont préservés à l’identique.

Ces validations portent sur les fichiers locaux, avant la demande de push.
La publication statique et l’installation du collecteur serveur doivent
être vérifiées séparément.
