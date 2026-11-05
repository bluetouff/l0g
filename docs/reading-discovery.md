# Découverte et lecture

La home française propose un aperçu des résumés existants, des marque-pages, un accès aux simulateurs et des filtres sur toutes les analyses publiées. Les archives paginées et les liens de lecture restent disponibles sans JavaScript. Un résumé absent n’est pas fabriqué.

Le catalogue statique `/api/v1/reading-catalog.json` exclut les brouillons. Les aperçus chargent le texte à la demande ; les filtres affichent vingt résultats, puis une suite explicite. Réinitialiser restaure le flux initial et sa pagination. Une erreur de réseau laisse les dernières analyses accessibles et annonce l’échec. Les ancres des outils viennent du registre existant.

Les styles des contrôles facultatifs sont chargés avant leur affichage, comme ceux de la bibliothèque existante. Leur échec laisse le flux et sa pagination utilisables. La home conserve ses styles critiques intégrés et ses budgets existants ; le build retire uniquement ses règles inutilisées de corps Markdown et de résultats Pagefind. Une garde bloque ce retrait si ces surfaces apparaissent dans la home. Les autres pages conservent les styles complets.

Les marque-pages utilisent la bibliothèque locale existante et ses limites. La reprise de lecture sur les homes FR/EN utilise les positions existantes, leur expiration et leurs liens de reprise. Rien n’est envoyé à un service de personnalisation. Les échecs du stockage ne doivent jamais annoncer une sauvegarde réussie.

Le repère de visite partage la clé de la page Maintenant. Une première visite initialise le repère ; les suivantes comparent les dates publiées et révisées. Le lecteur peut actualiser explicitement son repère. Les étiquettes distinguent une nouvelle parution d’une révision. Ces dates ne constituent pas une validation des faits.

Les articles FR/EN possèdent une barre mobile pendant la lecture du texte : sommaire, index des graphiques existants et sources. Les graphiques réutilisent leur dialogue actuel. La barre reste hors des ancêtres animés qui créeraient un bloc de positionnement pour les éléments fixes, et disparaît pendant l’introduction, après le texte, dans les dialogues et à l’impression.

Les pièces du dossier reprennent des documents HTTPS externes. Les relations relues sont privilégiées ; les associations automatiques restent identifiées comme non relues. En l’absence de passage associé, les documents primaires déjà cités restent accessibles. Une date non identifiée reste indiquée comme telle. Aucun score de fiabilité n’est inventé.

Contrôles : `npm run test:reader-experience`, `npm run check`, build, audits de sécurité, secrets, performance et liens. Vérifier filtres combinés, suite, réinitialisation, sauvegarde et retrait, reprise réelle, focus du dialogue, mobile/ordinateur et clair/sombre. Les budgets de performance existants restent bloquants.
