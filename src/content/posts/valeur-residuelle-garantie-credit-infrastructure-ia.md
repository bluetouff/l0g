---
title: "La valeur résiduelle garantie, l'angle mort du crédit qui finance l'IA"
description: "Les data centers de l'IA se financent de plus en plus hors bilan, par des véhicules qui louent le matériel et s'appuient sur une valeur résiduelle garantie. Meta a signé une telle garantie sur seize ans pour Hyperion. Décryptage du montage, du risque de dépréciation des puces, et du précédent du leasing automobile de 2008."
pubDate: 2026-07-15T18:20:00+02:00
updatedDate: 2026-07-15T18:20:00+02:00
tags: ["crédit privé", "ia", "data centers", "risque systémique", "valorisation", "leasing"]
draft: false
---

Le financement de l'intelligence artificielle a changé de nature sans que le débat public le remarque vraiment. Les dizaines de milliards engloutis dans les centres de calcul ne prennent plus seulement la forme de dette d'entreprise classique. Ils passent par des véhicules dédiés qui achètent le matériel, le louent à l'exploitant, et reposent sur une promesse discrète mais centrale : la [valeur résiduelle garantie](/glossaire/#vrg). Cette clause fixe la valeur plancher que vaudra l'actif à la fin du bail. Elle rend le montage finançable, le sort du bilan de l'exploitant, et déplace vers un garant le risque le plus difficile à estimer de toute la chaîne : combien vaudra, dans dix ou quinze ans, un data center bourré de puces qui se périment en trois.

## Louer la brique, garantir la casse

Le cas le mieux documenté est celui de Meta. En octobre 2025, le groupe a financé son campus Hyperion, en Louisiane, via un véhicule ad hoc baptisé Beignet Investor LLC, qui a levé environ **27,3 milliards de dollars** de notes senior sécurisées à 6,581 %, à échéance 2049, notées A+ par S&P. Selon [Bisnow](https://www.bisnow.com/national/news/data-center-capital-markets/meta-pushes-its-largest-data-center-project-off-its-books-with-27b-joint-venture-131490), les fonds de Blue Owl détiennent 80 % de la coentreprise et Meta 20 %, les investisseurs étant rémunérés non par de la dette corporate mais par les loyers d'exploitation que Meta verse au véhicule. La dette n'apparaît pas au bilan du groupe.

Le pivot du montage tient en une signature. D'après [Global Data Center Hub](https://www.globaldatacenterhub.com/p/meta-blue-owls-27b-bet-is-this-the), Meta a accordé aux investisseurs une valeur résiduelle garantie sur **seize ans** : si la valeur du campus tombe sous un seuil convenu et que Meta décide de ne pas renouveler le bail, le groupe doit rembourser les investisseurs du véhicule. La garantie est ce qui permet à des créanciers d'accepter un actif de très longue durée sans porter directement le risque que cet actif se déprécie plus vite que prévu. Le cabinet Quinn Emanuel classe d'ailleurs ces structures parmi les [nouveaux foyers de contentieux](https://www.quinnemanuel.com/media/4dzkfccz/client-alert-ai-data-center-financing-and-litigation-risks.pdf) du financement de l'IA, précisément à cause de l'incertitude sur la valeur de sortie.

Le [SPV](/glossaire/#spv) qui achète puis loue, l'exploitant qui garantit la valeur de fin de vie, la dette maintenue hors du bilan : la mécanique n'a rien d'inédit. C'est le vieux crédit-bail, appliqué à un actif dont personne ne connaît la vraie durée de vie économique.

## Le crédit privé entre dans la boucle

Ce que Meta fait avec Blue Owl, les opérateurs de calcul le font avec le [crédit privé](/guides/analyser-credit-prive/), en poussant la logique un cran plus loin : ils adossent la dette directement aux puces. CoreWeave, le principal de ces [neoclouds](/glossaire/#neocloud), a inauguré en août 2023 le premier prêt gagé sur des GPU Nvidia H100, arrangé par Magnetar et Blackstone. Le mouvement a depuis changé d'échelle. Selon [CoreWeave](https://investors.coreweave.com/news/news-details/2026/CoreWeave-Closes-Landmark-8-5-Billion-Financing-Facility-Achieving-First-Investment-Grade-Rated-GPU-backed-Financing/default.aspx), sa facilité DDTL 4.0 de **8,5 milliards de dollars**, notée A3 par Moody's et A (low) par DBRS, est le premier financement adossé à du matériel de calcul à décrocher la catégorie investissement, sécurisé par un contrat de 14,2 milliards avec Meta.

La baisse du coût du capital raconte la confiance croissante du marché. D'après [Quartz](https://qz.com/gpu-collateralized-debt-ai-neocloud-coreweave-financing-risks-050526), CoreWeave empruntait contre des GPU à environ 15 % en 2023 ; la tranche fixe de la DDTL 4.0 ressort autour de 5,9 % au printemps 2026. Le même article rappelle les deux paris implicites de tout prêt gagé sur des puces : que le matériel conserve assez de valeur sur la durée du prêt, et que le taux d'utilisation reste assez élevé pour servir la dette. Or un GPU haut de gamme perd environ la moitié de sa valeur de revente en trois ans. [Forbes](https://www.forbes.com/sites/daraabasiita/2026/06/09/gpu-debt-has-gone-investment-grade-heres-who-holds-the-risk/) pose la question qui suit logiquement : une fois cette dette passée en catégorie investissement, qui porte vraiment le risque ?

Le crédit privé ne se contente pas de prêter aux neoclouds. Il monte aussi les plus gros paris sur l'IA. Nous l'avons documenté avec le financement de **35 milliards de dollars** bouclé par Apollo et Blackstone pour Anthropic, [analysé ici](/posts/credit-prive-juin-2026-defaut-record-gating/) : un véhicule achète les puces TPU de Google, les loue à Anthropic, et le tout est adossé à des garanties de valeur résiduelle de Broadcom et à des garanties de paiement de Google ([Bloomberg](https://www.bloomberg.com/news/articles/2026-06-05/apollo-wraps-up-35-billion-debt-to-buy-ai-chips-for-anthropic)). La même brique revient partout : quand la qualité de crédit de l'actif ne suffit pas, on ajoute un garant.

## Le nerf du calcul : la courbe de dépréciation

Toute la solidité de ces montages repose sur une hypothèse comptable : la durée sur laquelle on amortit le matériel. Plus elle est longue, plus le coût annuel paraît faible, plus les bénéfices affichés sont élevés, et plus une valeur résiduelle lointaine semble crédible. La fissure du consensus passe là.

L'investisseur Michael Burry a porté le sujet sur la place publique fin 2025. Selon [CNBC](https://www.cnbc.com/2025/11/14/ai-gpu-depreciation-coreweave-nvidia-michael-burry.html), Google, Oracle et Microsoft amortissent leur matériel d'IA sur **cinq à six ans**, quand la cadence de renouvellement des puces Nvidia ramènerait leur vie économique réelle à **deux ou trois ans**. Burry chiffre à environ **176 milliards de dollars** la dépréciation sous-estimée, et donc les profits surestimés, du secteur entre 2026 et 2028. Nvidia a répondu par une note aux analystes contestant le calcul et rejetant toute comparaison avec les fraudes comptables du passé. La divergence est déjà visible dans les pratiques : en 2025, Amazon a raccourci la durée de vie retenue sur une partie de ses serveurs, quand Meta l'allongeait encore.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 300" role="img" aria-label="Écart entre la durée d'amortissement retenue par les hyperscalers et la vie économique estimée des GPU" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="300" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Combien de temps vit une puce d'IA ?</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Durée d'amortissement retenue vs vie économique estimée, en années.</text>
  <line x1="250" y1="80" x2="250" y2="230" stroke="#2a2c33" stroke-width="1"></line>
  <g font-size="11">
    <text x="242" y="104" fill="#d6d9df" text-anchor="end">Google, Oracle, Microsoft</text>
    <rect x="250" y="92" width="360" height="22" fill="#5eead4" opacity="0.85"></rect>
    <text x="618" y="108" fill="#5eead4" font-weight="700" textLength="96" lengthAdjust="spacingAndGlyphs">jusqu'à 6 ans (amorti)</text>
    <text x="242" y="154" fill="#d6d9df" text-anchor="end">Vie estimée (M. Burry)</text>
    <rect x="250" y="142" width="150" height="22" fill="#ff4d87" opacity="0.9"></rect>
    <text x="408" y="158" fill="#ff4d87" font-weight="700">2 à 3 ans</text>
    <text x="242" y="204" fill="#d6d9df" text-anchor="end">Revente : -50 % de valeur</text>
    <rect x="250" y="192" width="180" height="22" fill="#f5b13d" opacity="0.9"></rect>
    <text x="438" y="208" fill="#f5b13d" font-weight="700">~3 ans</text>
  </g>
  <text x="32" y="262" fill="#8b909b" font-size="11.5">Dépréciation sous-estimée par le secteur, estimation Burry 2026-2028 : ~176 Md$.</text>
  <text x="32" y="282" fill="#8b909b" font-size="11">Sources : CNBC (14 nov. 2025), Quartz. Nvidia conteste l'estimation.</text>
</svg>
<figcaption>L'écart entre la durée d'amortissement comptable et la vie économique estimée des puces est le cœur du débat. Plus l'amortissement est étalé, plus une valeur résiduelle lointaine paraît crédible. Sources : CNBC, Quartz.</figcaption>
</figure>

L'enjeu dépasse la querelle comptable. Le secteur prévoit environ **1 000 milliards de dollars** de dépenses d'IA sur cinq ans selon la même source. Si la vie utile réelle des puces est plus proche de trois ans que de six, la valeur résiduelle sur laquelle reposent les garanties fond bien avant l'échéance des baux qui la protègent.

## La garantie déplace le risque, elle ne l'annule pas

Une valeur résiduelle garantie ne fait pas disparaître le risque de dépréciation. Elle le transfère du prêteur vers le garant, le plus souvent l'exploitant lui-même, un fournisseur de puces, ou un grand nom de la technologie. Le créancier obtient un plancher ; le garant hérite d'un engagement conditionnel qui ne se déclenche que dans le mauvais scénario, quand la valeur de l'actif s'effondre.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 340" role="img" aria-label="Chaîne de transfert du risque dans un financement d'infrastructure IA hors bilan" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="340" fill="#0c0d10"></rect>
  <text x="32" y="36" fill="#f5f6f8" font-size="16" font-weight="700">Où atterrit le risque de valeur résiduelle</text>
  <rect x="40" y="66" width="180" height="64" rx="8" fill="none" stroke="#7aa2f7" stroke-width="1.4"></rect>
  <text x="130" y="94" fill="#e7e9ee" font-size="13" text-anchor="middle" font-weight="600">Investisseurs</text>
  <text x="130" y="114" fill="#8b909b" font-size="10.5" text-anchor="middle">crédit privé, assureurs</text>
  <rect x="270" y="66" width="180" height="64" rx="8" fill="none" stroke="#5eead4" stroke-width="1.4"></rect>
  <text x="360" y="94" fill="#e7e9ee" font-size="13" text-anchor="middle" font-weight="600">Véhicule (SPV)</text>
  <text x="360" y="114" fill="#8b909b" font-size="10.5" text-anchor="middle">achète et loue le matériel</text>
  <rect x="500" y="66" width="180" height="64" rx="8" fill="none" stroke="#f5b13d" stroke-width="1.4"></rect>
  <text x="590" y="94" fill="#e7e9ee" font-size="13" text-anchor="middle" font-weight="600">Exploitant</text>
  <text x="590" y="114" fill="#8b909b" font-size="10.5" text-anchor="middle">verse les loyers</text>
  <path d="M220 98 L266 98" stroke="#8b909b" stroke-width="1.6" fill="none"></path>
  <path d="M262 93 l8 5 l-8 5 z" fill="#8b909b"></path>
  <text x="243" y="86" fill="#8b909b" font-size="9.5" text-anchor="middle">dette</text>
  <path d="M500 118 L450 118" stroke="#8b909b" stroke-width="1.6" fill="none"></path>
  <path d="M454 113 l-8 5 l8 5 z" fill="#8b909b"></path>
  <text x="475" y="136" fill="#8b909b" font-size="9.5" text-anchor="middle">loyers</text>
  <rect x="270" y="200" width="180" height="70" rx="8" fill="none" stroke="#ff4d87" stroke-width="1.6"></rect>
  <text x="360" y="228" fill="#ff4d87" font-size="13" text-anchor="middle" font-weight="700">Valeur résiduelle</text>
  <text x="360" y="246" fill="#ff4d87" font-size="13" text-anchor="middle" font-weight="700">garantie</text>
  <text x="360" y="264" fill="#8b909b" font-size="10" text-anchor="middle">plancher promis en fin de bail</text>
  <path d="M360 130 L360 198" stroke="#ff4d87" stroke-width="1.4" fill="none" stroke-dasharray="5 4"></path>
  <path d="M590 130 C590 175 460 175 452 205" stroke="#ff4d87" stroke-width="1.6" fill="none"></path>
  <path d="M447 200 l3 10 l7 -7 z" fill="#ff4d87"></path>
  <text x="590" y="250" fill="#8b909b" font-size="10.5" text-anchor="middle">le garant</text>
  <text x="590" y="266" fill="#8b909b" font-size="10.5" text-anchor="middle">porte le risque</text>
  <text x="32" y="308" fill="#8b909b" font-size="11.5" textLength="682" lengthAdjust="spacingAndGlyphs">Le prêteur obtient un plancher ; le garant hérite d'un engagement qui se déclenche dans le pire scénario.</text>
  <text x="32" y="326" fill="#8b909b" font-size="11">Schéma l0g, d'après les structures Meta-Blue Owl, CoreWeave et Apollo-Anthropic.</text>
</svg>
<figcaption>Dans ces montages, la dette quitte le bilan de l'exploitant, mais le risque de dépréciation revient vers lui par la garantie. Le prêteur est protégé tant que le garant tient. Schéma l0g.</figcaption>
</figure>

La faiblesse du dispositif est la corrélation. Une garantie de crédit fonctionne quand les défauts sont indépendants les uns des autres. Une valeur résiduelle, elle, dépend d'un facteur commun : la génération de puces. Une rupture technologique, une nouvelle architecture qui divise par deux la valeur du matériel installé, ne frappe pas un data center isolé mais l'ensemble du parc au même moment. Les garanties se déclencheraient alors en même temps, chez des garants souvent exposés au même choc, puisque ce sont les acteurs mêmes de l'IA. Le risque a été rendu invisible au bilan, il n'a pas été diversifié.

## Un précédent que le marché préfère oublier

La garantie de valeur résiduelle n'est pas une invention de l'ère de l'IA. Elle structure depuis des décennies le crédit-bail aéronautique et ferroviaire, où le locataire s'engage à combler l'écart entre le prix de revente de l'actif et une valeur convenue. La comptabilité impose d'ailleurs de provisionner cet écart dès que la valeur attendue passe sous la garantie, un signal d'alerte que le hors-bilan a tendance à retarder.

Le rappel le plus utile vient de l'automobile. En 2008, l'effondrement des prix de revente des véhicules a fait sauter les hypothèses de valeur résiduelle des prêteurs captifs. Selon son [rapport annuel](https://www.sec.gov/Archives/edgar/data/0000040729/000119312509039567/d10k.htm), GMAC a enregistré 1,2 milliard de dollars de dépréciations sur les valeurs résiduelles de ses locations en 2008, et sa division de financement automobile est passée d'un bénéfice de 1,3 milliard à une perte de 753 millions en neuf mois. Le mal n'était pas nouveau : [WardsAuto](https://www.wardsauto.com/finance-insurance/the-rise-and-fall-of-automotive-leasing) rappelle que le secteur avait déjà accumulé près de 20 milliards de dollars de pertes sur résidus au début des années 2000, après avoir gonflé artificiellement ces valeurs pour doper le volume de leasing. Un plancher trop optimiste, souscrit en masse, devient une perte de masse quand le marché de l'occasion se retourne.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 320" role="img" aria-label="Décalage entre la décote rapide d'un GPU et l'horizon d'une garantie de valeur résiduelle" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="320" fill="#0c0d10"></rect>
  <text x="32" y="36" fill="#f5f6f8" font-size="16" font-weight="700">La décote court plus vite que la garantie</text>
  <text x="32" y="57" fill="#8b909b" font-size="12">Valeur de revente d'un GPU haut de gamme, en % du prix d'achat.</text>
  <line x1="70" y1="240" x2="680" y2="240" stroke="#2a2c33" stroke-width="1"></line>
  <line x1="70" y1="90" x2="70" y2="240" stroke="#2a2c33" stroke-width="1"></line>
  <text x="60" y="94" fill="#8b909b" font-size="10.5" text-anchor="end">100 %</text>
  <text x="60" y="167" fill="#8b909b" font-size="10.5" text-anchor="end">50 %</text>
  <text x="60" y="244" fill="#8b909b" font-size="10.5" text-anchor="end">0 %</text>
  <polyline points="70,90 220,167 370,205 520,224 680,233" fill="none" stroke="#f5b13d" stroke-width="2.5"></polyline>
  <circle cx="220" cy="167" r="4.5" fill="#f5b13d"></circle>
  <text x="220" y="156" fill="#f5b13d" font-size="10.5" text-anchor="middle" font-weight="700">~50 % à 3 ans</text>
  <g fill="#8b909b" font-size="10.5" text-anchor="middle">
    <text x="70" y="258">0</text>
    <text x="220" y="258">3 ans</text>
    <text x="370" y="258">6 ans</text>
    <text x="520" y="258">9 ans</text>
  </g>
  <line x1="640" y1="90" x2="640" y2="240" stroke="#ff4d87" stroke-width="1.5" stroke-dasharray="5 4"></line>
  <text x="636" y="108" fill="#ff4d87" font-size="10.5" text-anchor="end">VRG Meta : 16 ans</text>
  <text x="32" y="292" fill="#8b909b" font-size="11.5" textLength="682" lengthAdjust="spacingAndGlyphs">La garantie protège le prêteur sur seize ans un actif qui a perdu la moitié de sa valeur en trois.</text>
  <text x="32" y="310" fill="#8b909b" font-size="11">Ordre de grandeur de décote : Quartz. Horizon de garantie : Global Data Center Hub.</text>
</svg>
<figcaption>Le décalage temporel est le point sensible : la garantie couvre un horizon long, l'actif se déprécie vite. Entre les deux, c'est le garant qui absorbe la différence. Sources : Quartz, Global Data Center Hub.</figcaption>
</figure>

## La lecture inverse

Il faut se garder de transposer mécaniquement 2008. Plusieurs arguments plaident pour la robustesse de ces montages, et il serait malhonnête de les taire.

D'abord, la vie économique des puces pourrait être plus longue que ne le dit Burry. Les générations antérieures ne finissent pas à la casse : elles descendent vers des tâches d'inférence moins exigeantes, un marché de seconde main réel absorbe une partie du parc, et l'appétit de calcul dépasse pour l'instant l'offre. Nvidia le fait valoir dans sa réponse aux analystes. Ensuite, la qualité des garants et des contrats compte : quand les loyers sont dus par un locataire de premier rang, comme le contrat CoreWeave adossé à Meta, le risque de crédit immédiat est faible, ce qui justifie en partie les notes en catégorie investissement. Enfin, une valeur résiduelle garantie ne se déclenche qu'au non-renouvellement du bail ; tant que l'exploitant a besoin du campus et paie ses loyers, la garantie reste une clause dormante.

L'équilibre est donc plus subtil qu'un simple présage de crise. La question n'est pas de savoir si ces structures sont frauduleuses, elles ne le sont pas, mais de mesurer un risque qui a été déplacé hors du regard, concentré chez un petit nombre d'acteurs corrélés, et calé sur une hypothèse de durée de vie que le marché lui-même ne tranche pas.

## Les signaux à surveiller

Quatre indicateurs diront si la promesse tient. Les révisions de durée d'amortissement des serveurs chez les hyperscalers, d'abord, car un raccourcissement général validerait la thèse de la dépréciation rapide. La formation d'un vrai marché secondaire des GPU, ensuite, seule preuve tangible d'une valeur résiduelle observable plutôt que supposée. La cadence de sortie des nouvelles architectures Nvidia, qui fixe le rythme d'obsolescence du parc installé. Et l'ampleur des engagements de garantie souscrits par les grands acteurs, comparée à leur capacité à les honorer si plusieurs se déclenchaient ensemble.

Le crédit qui bâtit l'IA a trouvé, avec la valeur résiduelle garantie, l'outil qui rend l'infrastructure finançable à grande échelle. Le même outil concentre un risque de dépréciation que personne ne sait chiffrer, sur des actifs dont la vie utile reste en débat, chez des garants qui sont aussi les premiers exposés au retournement. La dette est sortie des bilans. Le pari, lui, y est resté entier.

## Sources

- Bisnow, « Meta Pushes Its Largest Data Center Project Off Its Books With $27B JV » (SPV Beignet Investor, 27,3 Md$ de notes à 6,581 %, Blue Owl 80 % / Meta 20 %, loyers d'exploitation) : https://www.bisnow.com/national/news/data-center-capital-markets/meta-pushes-its-largest-data-center-project-off-its-books-with-27b-joint-venture-131490
- Global Data Center Hub, « Meta + Blue Owl's $27B Bet » (garantie de valeur résiduelle sur seize ans, remboursement des investisseurs en cas de non-renouvellement) : https://www.globaldatacenterhub.com/p/meta-blue-owls-27b-bet-is-this-the
- Quinn Emanuel, « AI Data Center Financing and Litigation Risks » (risques juridiques des montages hors bilan et de la valeur de sortie) : https://www.quinnemanuel.com/media/4dzkfccz/client-alert-ai-data-center-financing-and-litigation-risks.pdf
- CoreWeave, communiqué sur la facilité DDTL 4.0 de 8,5 Md$, notée A3 / A (low), premier financement gagé sur GPU en catégorie investissement, contrat Meta de 14,2 Md$ : https://investors.coreweave.com/news/news-details/2026/CoreWeave-Closes-Landmark-8-5-Billion-Financing-Facility-Achieving-First-Investment-Grade-Rated-GPU-backed-Financing/default.aspx
- Quartz, « GPU-collateralized debt explained » (coût du capital de 15 % en 2023 à ~5,9 % en 2026, décote d'environ 50 % en trois ans, paris implicites sur valeur et utilisation) : https://qz.com/gpu-collateralized-debt-ai-neocloud-coreweave-financing-risks-050526
- Forbes, « GPU Debt Has Gone Investment Grade. Here's Who Holds The Risk » (juin 2026) : https://www.forbes.com/sites/daraabasiita/2026/06/09/gpu-debt-has-gone-investment-grade-heres-who-holds-the-risk/
- CNBC, « The question everyone in AI is asking: How long before a GPU depreciates? » (14 nov. 2025 : amortissement 5-6 ans vs vie 2-3 ans, estimation Burry de 176 Md$ de dépréciation sous-estimée 2026-2028, note de Nvidia, Amazon raccourcit / Meta allonge, ~1 000 Md$ de capex IA) : https://www.cnbc.com/2025/11/14/ai-gpu-depreciation-coreweave-nvidia-michael-burry.html
- Bloomberg, « Apollo Wraps Up $35 Billion Debt to Buy AI Chips for Anthropic » (véhicule TPU, garanties de valeur résiduelle de Broadcom, garanties de paiement de Google) : https://www.bloomberg.com/news/articles/2026-06-05/apollo-wraps-up-35-billion-debt-to-buy-ai-chips-for-anthropic
- GMAC LLC, rapport annuel (Form 10-K) FY2008, SEC (1,2 Md$ de dépréciations sur valeurs résiduelles en 2008, perte de la division financement automobile) : https://www.sec.gov/Archives/edgar/data/0000040729/000119312509039567/d10k.htm
- WardsAuto, « The Rise and Fall of Automotive Leasing » (près de 20 Md$ de pertes sur résidus au début des années 2000, valeurs résiduelles gonflées) : https://www.wardsauto.com/finance-insurance/the-rise-and-fall-of-automotive-leasing

*Cet article est une analyse journalistique et ne constitue pas un conseil en investissement. Les données de marché sont citées à la date de leurs sources.*
