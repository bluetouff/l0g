---
title: "Intelligence bradée : la stratégie open source chinoise contre la bulle du capex IA"
description: "Le 17 juillet 2026, Moonshot a publié Kimi K3, présenté comme le plus gros modèle open source du monde, pendant que Qwen franchissait le milliard de téléchargements et que DeepSeek reste en licence permissive. Lu au prisme financier, ce n'est pas une course technologique, c'est une arme déflationniste. La Chine effondre le prix de l'intelligence au moment où les géants américains engagent 725 milliards de dollars de capex dont le retour sur investissement suppose une marge que les modèles gratuits font fondre."
pubDate: 2026-07-23T23:31:00+02:00
updatedDate: 2026-07-23T23:31:00+02:00
tags: ["ia", "chine", "dette", "risque systémique", "macro", "marchés"]
draft: false
---

*Le 17 juillet 2026, la société chinoise Moonshot a publié [Kimi K3, un modèle de 2 800 milliards de paramètres présenté comme le plus gros modèle open source du monde](https://www.technologyreview.com/2026/02/12/1132811/whats-next-for-chinese-open-source-ai/), avec des poids destinés à être ouverts en fin de mois. Dans la même séquence, la famille Qwen d'Alibaba a franchi le milliard de téléchargements cumulés sur Hugging Face, plus vite qu'aucune autre lignée de modèles, et DeepSeek continue de diffuser ses modèles sous licence permissive. Vu de la Silicon Valley, c'est une rivalité technologique. Vu de l0g, c'est autre chose : une arme économique. En rendant gratuits des modèles de niveau frontière, la Chine effondre le prix de l'intelligence au moment précis où les géants américains engagent des centaines de milliards de dollars dont le remboursement suppose que cette intelligence reste chère. L'analyse qui suit ne juge pas la qualité des modèles, elle lit le choc de prix qu'ils provoquent.*

## La stratégie : commoditiser la couche modèle

La domination chinoise sur les modèles open source n'est pas un accident de calendrier, c'est un choix. Alibaba a diffusé plus de cent modèles sous licence Apache 2.0, DeepSeek a publié les siens sous licence MIT accompagnés d'un article décrivant sa méthode d'entraînement, et Moonshot ouvre à son tour son plus gros modèle. Offrir la couche modèle revient à en détruire la valeur marchande pour tout le monde, soi-même compris, à seule fin de priver les concurrents de leur pouvoir de fixation des prix.

Ce mécanisme nous est familier. C'est la déflation exportée que nous décrivions dans [l'usine mondiale qui brade](/posts/usine-mondiale-brade-deflation-chinoise/), transposée du panneau solaire au modèle de langage : inonder le monde de capacité gratuite pour asphyxier la marge d'en face. Là où la surcapacité industrielle chinoise fait chuter le prix des biens, la générosité open source fait chuter le prix de l'inférence. Dans les deux cas, la Chine exporte une baisse de prix que ses rivaux subissent.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 300" role="img" aria-label="Effondrement du prix de l'inférence des grands modèles de langage" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="300" fill="#0c0d10"/>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Le prix de l'intelligence s'effondre</text>
  <text x="32" y="59" fill="#8b909b" font-size="12" textLength="682" lengthAdjust="spacingAndGlyphs">Coût pour un million de tokens d'entrée, qualité niveau GPT-4, en dollars. Sources : comparateurs d'API 2026.</text>
  <line x1="70" y1="92" x2="70" y2="240" stroke="#2a2c33" stroke-width="1"/>
  <line x1="70" y1="240" x2="680" y2="240" stroke="#2a2c33" stroke-width="1"/>
  <rect x="120" y="100" width="90" height="140" fill="#ff4d87" opacity="0.85"/>
  <text x="165" y="92" fill="#ff4d87" font-size="14" font-weight="700" text-anchor="middle">30 $</text>
  <text x="165" y="258" fill="#8b909b" font-size="12" text-anchor="middle">mars 2023</text>
  <rect x="560" y="238" width="90" height="2" fill="#5eead4"/>
  <text x="605" y="228" fill="#5eead4" font-size="14" font-weight="700" text-anchor="middle">&lt; 0,10 $</text>
  <text x="605" y="258" fill="#8b909b" font-size="12" text-anchor="middle">2026</text>
  <text x="32" y="286" fill="#8b909b" font-size="12" textLength="682" lengthAdjust="spacingAndGlyphs">Environ 300 fois moins cher en trois ans, dont près de 80 % de baisse sur la seule dernière année.</text>
</svg>
<figcaption>Un token de qualité GPT-4 coûtait 30 dollars le million en 2023 ; il en coûte aujourd'hui moins de 0,10. La baisse dépasse un facteur 300 en trois ans. Sources : comparateurs de prix d'API des grands modèles, 2026.</figcaption>
</figure>

## La cible : le pouvoir de fixation des prix

La couche modèle était censée être la douve, l'actif rare qui justifiait les marges. Elle devient une matière première. Un modèle chinois open source comme DeepSeek facture son inférence de sortie autour de [0,28 dollar le million de tokens, contre une trentaine de dollars pour un modèle frontière américain de premier plan](https://www.cloudzero.com/blog/llm-api-pricing-comparison/), un rapport de près de cent contre un. Sur les modèles de raisonnement, l'écart reste d'un ordre de grandeur. La règle des marchés est implacable : quand un acteur propose une qualité comparable au centième du prix, la marge s'évapore.

Le point n'est pas que les modèles américains fermés seraient techniquement dépassés, ils ne le sont pas nécessairement. Le point est que leur avantage ne se monétise plus au niveau du jeton. Si l'intelligence brute tend vers la gratuité, la rente doit se loger ailleurs, dans l'application, la distribution, la donnée propriétaire. Or c'est justement le niveau du jeton qui était censé rembourser les infrastructures.

## Le point d'impact : 725 milliards de capex

Le voici, l'endroit où la stratégie chinoise rencontre le bilan américain. Les quatre premiers hyperscalers, Amazon, Alphabet, Meta et Microsoft, prévoient d'engager environ [725 milliards de dollars de dépenses d'investissement en 2026, en hausse de 77 %](https://finance.yahoo.com/sectors/technology/articles/hyperscalers-hit-700-billion-2026-111243744.html) sur un an ; le cabinet CreditSights situe le total des cinq premiers, Oracle compris, entre 700 et 900 milliards. La quasi-totalité part dans l'infrastructure d'IA : grappes de processeurs, silicium propriétaire, centres de données. Et une part croissante de cette facture est financée par la dette, une mécanique que nous avons disséquée dans [la dette derrière l'IA](/posts/la-dette-derriere-l-ia-spv-obligations-credit-prive/), le [financement circulaire](/posts/financement-circulaire-ia/) et la [valeur résiduelle garantie du crédit d'infrastructure](/posts/valeur-residuelle-garantie-credit-infrastructure-ia/).

Le retour sur investissement de ces 725 milliards suppose une chose : que la couche modèle conserve un pouvoir de prix suffisant pour dégager la marge qui remboursera la dette. La stratégie open source chinoise attaque directement cette hypothèse. Si le prix de l'inférence continue de tendre vers zéro, l'écart entre le capex engagé et les revenus qu'il génère, déjà scruté par des marchés qui repricent, devient un problème de solvabilité, pas seulement de rentabilité. C'est la fragilité que nous pointions dans [le boom de l'IA et la fragilité financière](/posts/boom-ia-bis-fragilite-financiere/) et dans [la bulle dans la bulle](/posts/la-bulle-dans-la-bulle-valorisations-ia-et-benefices-gonfles).

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 320" role="img" aria-label="Dépenses d'investissement en IA des hyperscalers américains en 2026" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="320" fill="#0c0d10"/>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Le mur de capex, face à une marge qui fond</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Capex 2026 annoncé, en milliards de dollars. Sources : guidances des sociétés ; CreditSights.</text>
  <rect x="160" y="86" width="280" height="30" fill="#7aa2f7" opacity="0.85"/>
  <text x="152" y="107" fill="#d6d9df" font-size="12" text-anchor="end">Amazon</text>
  <text x="448" y="107" fill="#d6d9df" font-size="12">200</text>
  <rect x="160" y="124" width="259" height="30" fill="#7aa2f7" opacity="0.85"/>
  <text x="152" y="145" fill="#d6d9df" font-size="12" text-anchor="end">Alphabet</text>
  <text x="427" y="145" fill="#d6d9df" font-size="12">185</text>
  <rect x="160" y="162" width="175" height="30" fill="#7aa2f7" opacity="0.85"/>
  <text x="152" y="183" fill="#d6d9df" font-size="12" text-anchor="end">Meta</text>
  <text x="343" y="183" fill="#d6d9df" font-size="12">125</text>
  <rect x="160" y="200" width="168" height="30" fill="#7aa2f7" opacity="0.85"/>
  <text x="152" y="221" fill="#d6d9df" font-size="12" text-anchor="end">Microsoft</text>
  <text x="336" y="221" fill="#d6d9df" font-size="12">120</text>
  <rect x="160" y="238" width="70" height="30" fill="#7aa2f7" opacity="0.85"/>
  <text x="152" y="259" fill="#d6d9df" font-size="12" text-anchor="end">Oracle</text>
  <text x="238" y="259" fill="#d6d9df" font-size="12">50</text>
  <text x="32" y="300" fill="#f5b13d" font-size="12" textLength="682" lengthAdjust="spacingAndGlyphs">Environ 725 milliards pour les quatre premiers, financés en partie par la dette. Le ROI suppose un prix du modèle que l'open source chinois pousse vers zéro.</text>
</svg>
<figcaption>Les hyperscalers engagent l'équivalent du produit intérieur brut d'un pays moyen en une seule année, largement à crédit. Ce pari repose sur une marge au niveau du modèle que la gratuité chinoise vient éroder. Sources : guidances des sociétés ; estimations CreditSights.</figcaption>
</figure>

## Le levier géopolitique

À la dimension financière s'ajoute une dimension de puissance, tout aussi concrète. On ne sanctionne pas un fichier de poids une fois qu'il est téléchargé. Là où les contrôles américains à l'exportation de puces visent à ralentir la Chine, la diffusion de modèles open source contourne le levier symétrique : elle installe le stack chinois par défaut chez les développeurs du Sud global, dans les universités et les administrations qui n'ont ni le budget ni l'accès aux API fermées américaines. Fixer le standard gratuit, c'est capter l'écosystème et la dépendance future, une logique de long terme que les seuls tableaux de revenus ne capturent pas.

## La lecture inverse

L'équité commande d'exposer le contre-argument, car il est sérieux et pourrait renverser la conclusion. Le premier point est le paradoxe de Jevons : une intelligence moins chère élargit le marché, et une baisse du prix du token peut faire exploser les volumes d'usage, donc la demande de calcul, donc justifier le capex plutôt que le condamner. Dans cette lecture, la valeur ne disparaît pas, elle migre vers le calcul, c'est-à-dire vers les fabricants de puces et les exploitants d'inférence, et vers la couche applicative que les laboratoires américains monétisent auprès des entreprises. Le second point est que l'open source a des coûts cachés, conformité, sécurité, absence de support, qui maintiennent nombre de grands comptes sur les fournisseurs fermés. Le troisième, enfin, est que la générosité chinoise n'est pas pur altruisme stratégique : bridée par les restrictions sur les puces, incapable de monétiser aisément des modèles fermés à l'échelle mondiale, la Chine fait de l'open source un pis-aller rationnel autant qu'une arme.

Ces objections déplacent la question sans l'annuler. Même si le capex se justifie par les volumes, il change de bénéficiaire : le fabricant de silicium et l'exploitant d'inférence encaissent, le laboratoire fermé qui a financé sa douve à crédit voit sa thèse de marge s'effriter. La déflation de l'intelligence est réelle ; elle ne détruit pas la valeur, elle la redistribue, et cette redistribution ne suit pas la carte de la dette.

## Où va la valeur

La douve se déplace du modèle vers la couche supérieure. Ce constat, banal en apparence, a une conséquence financière lourde : quiconque a financé la marge de la couche modèle par de la dette a adossé son remboursement à un actif dont le prix tend vers zéro. Les gagnants probables sont le calcul et l'applicatif ; les perdants relatifs, les laboratoires fermés dont la rente au jeton s'évapore et les créanciers qui les ont adossés. La stratégie open source chinoise n'est donc pas un épisode de la guerre des modèles, c'est un facteur de risque pour le cycle de capex le plus lourd de l'histoire du secteur.

Les signaux à suivre tiennent en peu de lignes. L'écart entre le capex et les revenus des hyperscalers, que les marchés commencent à sanctionner à chaque publication de résultats. Le rythme des sorties chinoises, dont Kimi K3 n'est que la dernière. L'adoption des modèles open source par les grandes entreprises, seul juge de paix de la migration. Et le prix du token, thermomètre le plus direct de la marge qui reste à défendre. Lire l'IA au prisme de la dette, c'est voir que la vraie question n'est pas quel modèle gagne, mais qui rembourse quand l'intelligence ne se vend plus.

---

**Données et sources :** [MIT Technology Review, l'avenir de l'IA open source chinoise](https://www.technologyreview.com/2026/02/12/1132811/whats-next-for-chinese-open-source-ai/) (Kimi K3, Qwen, DeepSeek) ; [comparateur de prix d'API des grands modèles, 2026](https://www.cloudzero.com/blog/llm-api-pricing-comparison/) (effondrement du prix du token, DeepSeek contre modèles frontière) ; [dépenses d'investissement 2026 des hyperscalers, environ 725 milliards de dollars](https://finance.yahoo.com/sectors/technology/articles/hyperscalers-hit-700-billion-2026-111243744.html) et estimations CreditSights. Les performances revendiquées pour Kimi K3 sont des annonces du constructeur, sans validation indépendante à ce stade ; les prix d'inférence et les guidances de capex évoluent, les niveaux cités sont ceux de la mi-2026.

**Pour approfondir :** notre analyse de [l'usine mondiale et de la déflation chinoise](/posts/usine-mondiale-brade-deflation-chinoise/) ; notre cluster IA et dette, avec [la dette derrière l'IA](/posts/la-dette-derriere-l-ia-spv-obligations-credit-prive/), le [financement circulaire](/posts/financement-circulaire-ia/), la [valeur résiduelle garantie](/posts/valeur-residuelle-garantie-credit-infrastructure-ia/), [le boom de l'IA et la fragilité financière](/posts/boom-ia-bis-fragilite-financiere/) et [la bulle dans la bulle](/posts/la-bulle-dans-la-bulle-valorisations-ia-et-benefices-gonfles) ; et notre examen critique des [gains de productivité de l'IA](/posts/ia-et-productivite-entre-gains-mesures-et-effets-supposes).
