# Vérification des onze propositions du 6 septembre 2026

Ce document conserve l’état constaté avant publication. Les mentions « local » et « à activer » décrivent cet instant ; la révision servie et les réponses HTTP doivent être vérifiées séparément après déploiement.

Le document joint mélange des réparations déjà livrées, deux écarts de déploiement réels et des hypothèses commerciales. Il ne justifie ni une migration des sous-domaines, ni une conservation générale des journaux pendant treize mois.

Contrôle du 6 septembre 2026 : dépôt à `fc2cad6c27eab82ad177a692675cbfeaa48b9106`, 49 requêtes HTTP publiques, deux lectures MCP anonymes et une inspection serveur en lecture seule. Les réponses sont consignées dans [la preuve HTTP](correctifs-live-proof-2026-09-06.json). Les nouveaux changements décrits ci-dessous sont locaux, pas encore publiés.

## Corrections locales

- Suppression de la balise `generator` dans `BaseLayout.astro` et `EnglishGuidesLayout.astro`. Cela retire l’annonce explicite de la version Astro ; cela ne remplace pas les mises à jour de sécurité.
- Titres SEO explicites pour Taïwan et COFER, qui étaient tronqués dans le HTML public. Les H1, textes, dates et liens FR/EN restent identiques.
- Clarification de la couverture du rapport de trafic dans le générateur JSON et la page RGPD. Le collecteur relit les journaux disponibles et remplace son rapport ; il ne conserve pas automatiquement 91 jours d’anciens agrégats. `retention_days: 91` est un plafond de sélection. Avec la rotation actuelle, le rapport consulté couvre quinze dates publiées.

| Page | Nouveau titre SEO |
| --- | --- |
| `/en/analysis/taiwan-life-insurers-724-billion-currency-risk/` | Taiwan life insurers: $724bn abroad and FX risk \| l0g |
| `/en/guides/read-central-bank-fx-reserves-cofer/` | COFER: reading central bank FX reserves \| l0g |

Le chiffre taïwanais a été revérifié : 37,68 milliers de milliards de TWD d’actifs × 60,42 % d’investissements étrangers ÷ 31,438 TWD/USD = environ 724,16 milliards USD à fin 2025. Il mesure des actifs étrangers, pas une perte ni une position de change nette. Sources : [rapport de stabilité de la banque centrale, page 66 et note 79](https://www.cbc.gov.tw/dl-227216-d7012267389b4bb0b2b6b29276d86c70.html), [change du 31 décembre 2025](https://www.cbc.gov.tw/en/cp-4237-188473-44dc2-2.html). Le PDF a été inspecté visuellement, son extraction textuelle déformant les chiffres.

## Décision par proposition

| N° | Sujet | Constat vérifié et décision |
| --- | --- | --- |
| 1 | Sitemap | Déjà réparé : `/sitemap.xml` renvoie une 301 vers `/sitemap-index.xml`, qui répond 200. Aucune nouvelle règle nécessaire. |
| 2 | Contact | Les pages FR et EN répondent 200 ; `/contact-us` renvoie une 301 vers `/contact/`. Ne pas recréer une page existante. |
| 3 | Icônes | Les trois fichiers cités répondent 200. Les deux icônes Apple mesurent 180 × 180. La génération existe déjà. |
| 4 | Generator | Version Astro effectivement présente dans le HTML public. Suppression locale effectuée dans les deux layouts. |
| 5 | Cartes d’agent | Proposition d’alias rejetée : le manifeste l0g `agents.json` décrit son corpus et ses interfaces ; ce n’est pas une carte A2A. Servir ce JSON sous une URL A2A ne rendrait pas le service compatible. Le manifeste MCP répond 200 et les deux transports acceptent une lecture anonyme. |
| 6 | Images sociales | Les dix pages FR/EN du dossier facture pointent vers cinq images existantes, toutes en HTTP 200 et 1 200 × 630. Les tests bloquant les images sociales absentes existent déjà dans `check-internal-links`. Deux anciennes URL restent en 404 : leurs règles Apache et leurs sondes sont prêtes dans le dépôt, absentes de la configuration active. Activation serveur encore nécessaire. |
| 7 | Mesure et logs | Les canonical ignorent déjà `?src=x`, vérifié sur la home et H.4.1. Les lectures HTML sont filtrées séparément des usages MCP. Le rapport public est encore en schéma 1.0 alors que le collecteur 1.1 est prêt. La promesse ambiguë de 91 jours a été clarifiée localement. Ne pas appliquer `rotate 400` à tous les logs Apache. |
| 8 | Titres SEO | Les champs `seoTitle` et `ogTitle`, leur rendu et leurs contrôles existent. H.4.1, productivité US et `/en/start/` ont déjà des titres explicites. Taïwan et COFER sont corrigés localement. Les huit expériences gelées jusqu’au 20 septembre restent intactes. Pas d’ajout automatique de cinq chiffres dans chaque introduction. |
| 9 | Vitrines commerciales | Proposition stratégique, pas panne démontrée. Les positions moyennes de domaines aux corpus différents ne prouvent pas l’effet d’une migration. Aucun canonical, `noindex` ou déplacement de route appliqué sans diagnostic par URL et plan de migration. |
| 10 | Verticale facturation | Piste éditoriale à étudier ; ni les 147 fiches ni leur rentabilité ne sont établies par les impressions citées. Le dossier actuel parle de 148 plateformes, sans modifier les anciens slugs. Une position moyenne proche de 97 ne démontre pas que chaque internaute a parcouru dix pages. |
| 11 | Indexation | Le dépôt contient déjà des cohortes, décisions URL par URL et tests d’indexation. Le build isolé comporte 765 URL de sitemap, avec zéro destination indésirable dans le sitemap et le maillage contrôlé. Les 516 pages HTML noindex du build ne sont pas comparables directement aux 289 URL GSC citées : périmètre et date diffèrent. Aucun retrait global de `noindex`. |

## Rectifications de méthode

**MCP et A2A.** L’autorisation est optionnelle dans MCP. Une 404 sur un document OAuth ne suffit toutefois pas, à elle seule, à prouver un accès anonyme ; la preuve ici est la lecture réussie de `l0g://mcp/server` sur chaque transport sans jeton. `/api/mcp/.well-known/mcp` n’est pas un endpoint OAuth et renvoie déjà une 308 vers le manifeste l0g. Une carte A2A décrit un service qui implémente A2A, avec ses capacités et son transport. Sources : [MCP, autorisation 2025-11-25](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization), [A2A, découverte et structure AgentCard](https://a2a-protocol.org/v0.3.0/specification/).

**Aperçus X.** L’irréversibilité du cache et l’affirmation selon laquelle seule une republication avec paramètre fonctionnerait ne sont pas démontrées par les journaux fournis dans le document. Les tests de build ne vérifient pas l’état du cache de X. La boucle `curl` proposée avec un `*` ne recherche pas des fichiers sur un serveur HTTP : il faut utiliser les URL exactes extraites des métadonnées. Les deux URL historiques à réparer sont listées plus bas.

**Audience.** Un nombre de requêtes ou de GET HTML filtrés n’est pas un nombre de personnes uniques. `?src=x` identifie un canal déclaré, pas un post distinct si la valeur est réutilisée partout. Un simple `grep` compte aussi robots, requêtes échouées et répétitions. Une requête `/go/...` ne prouverait ni une arrivée sur Stripe, ni un paiement. Les parts de trafic, variations et projections de clics du document n’ont pas été recalculées : les exports bruts de ses fenêtres ne sont pas joints.

**Rétention.** L’inspection serveur confirme `combined`, `daily` et `rotate 14`. La page RGPD annonce bien l’enregistrement des IP dans les logs, puis leur masquage pour les statistiques ; elle n’annonce pas une anonymisation avant écriture. Quatorze rotations quotidiennes ne sont pas une garantie d’effacement à l’heure exacte du quatorzième jour. La référence CNIL à treize mois pour certains traceurs de mesure d’audience n’autorise pas automatiquement la conservation des logs bruts de tous les sites pendant 400 rotations. La durée doit correspondre à la finalité et aux données concernées. Sources : [CNIL, mesure d’audience](https://www.cnil.fr/fr/cookies-solutions-pour-les-outils-de-mesure-daudience), [CNIL, durées de conservation](https://cnil.fr/fr/passer-laction/les-durees-de-conservation-des-donnees).

**Search Console.** Les exports existants n’offrent pas de jointure page × requête : ne pas attribuer à H.4.1 des requêtes simplement présentes dans l’export global. Les comparaisons FR/EN doivent tenir compte du pays, de l’appareil, de la position, de la période et du faible nombre de clics. Une position est une moyenne dont l’interprétation dépend du type de résultat. Google distingue les pages découvertes des pages explorées non indexées ; ces états ne prouvent pas que publier moins serait l’unique remède. Sources : [Google, impressions et positions](https://support.google.com/webmasters/answer/7042828), [Google, rapport d’indexation](https://support.google.com/webmasters/answer/7440203).

**Dénominateurs.** 480 / 1 204 = 39,87 %, mais les catégories citées totalisent seulement 472 URL : 289 + 19 + 12 + 152. Huit URL restent inexpliquées. Les 289 URL noindex représentent 24,0 % des 1 204 URL connues ; les rapporter aux 724 indexées mélange deux groupes disjoints. Le ratio global d’indexation doit être complété par la couverture des pages que l’on souhaite réellement indexer.

## Deux activations serveur restent à faire

1. Appliquer le vhost à l’aide de `deploy/activate-apache-vhost.sh`, après comparaison avec la configuration active. Le script possède sauvegarde, test de configuration, sondes et restauration. Les deux URL doivent passer de 404 à 301, avec une destination finale en 200 :
   - `/og/le-grand-peage-de-la-facture-1-le-portail-ampute.png` vers `/illustrations/news/e-invoicing-toll-1-v2.jpg` ;
   - `/og/le-grand-peage-de-la-facture-3-le-prix-du-gratuit.png` vers `/illustrations/news/e-invoicing-toll-3-v1.jpg`.
2. Installer le collecteur courant avec `deploy/install-human-traffic.sh`, puis vérifier le schéma 1.1, les classes de trafic et le timer. Cette activation ne créera pas les anciens jours d’historique déjà supprimés par rotation. Une conservation distincte d’agrégats pour les comparaisons mensuelles demanderait une évolution dédiée, avec absence de double comptage et couverture explicite.

Un push du site statique ne suffit pas à effectuer ces deux opérations. Aucune modification serveur n’a été réalisée pendant cette vérification.

## Validation

Les changements ont été isolés depuis le SHA ci-dessus afin de préserver les autres travaux du répertoire partagé. Le contrôle Astro du répertoire partagé et celui de la copie isolée finale sont passés avec zéro erreur et zéro avertissement. Le contrôle SEO de la copie isolée est passé sur 535 contenus ; celui du répertoire partagé avait rencontré un nouvel article de leasing hors périmètre.

Le contrôle de publication des deux contenus modifiés passe avec cinq avertissements portant sur leurs corps existants : formats numériques FR/EN, proximité des sources, causalité et formulations contemporaines. Les nouvelles métadonnées reprennent le périmètre vérifié, sans modifier ces corps ni leur date de mise à jour. Cela ne constitue pas une nouvelle revue exhaustive des deux articles.

Le build Astro final passe : 1 258 routes générées et 1 283 fichiers HTML avec les fichiers publics, sans balise `generator`. Les H1 et `headline` JSON-LD de Taïwan et COFER restent identiques. Les contrôles SEO, images sociales, liens internes, sécurité, performance, déploiement, trafic humain, télémétrie MCP, distribution agents et mentions légales sont passés. Les images OG générées ont été produites dans la copie isolée avant le contrôle des liens, conformément au prébuild ; une archive Git seule ne contient pas ces fichiers ignorés.

Les assertions automatiques sur la configuration Apache et le collecteur vérifient les fichiers du dépôt. Elles ne prouvent pas leur activation sur le serveur, qui reste à faire. Aucun nouveau push ni déploiement n’a été effectué pour ces corrections.
