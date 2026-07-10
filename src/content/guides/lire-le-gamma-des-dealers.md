---
title: "Lire le gamma des dealers : quand la couverture des options fait le marché"
description: "Guide de référence sur le positionnement en options et le gamma des teneurs de marché : les notions de delta et de gamma, pourquoi les dealers couvrent mécaniquement leurs options dans le sous-jacent, la différence décisive entre long gamma qui étouffe la volatilité et short gamma qui l'amplifie, l'essor des options 0DTE, et les précédents du Volmageddon de 2018 et du gamma squeeze de GameStop. Comment une force invisible fixe une part des mouvements de marché."
summary: "Une part croissante des mouvements de marché à court terme ne vient pas des fondamentaux mais de la couverture mécanique des vendeurs d'options, les teneurs de marché. Quand ces dealers sont longs gamma, ils achètent les baisses et vendent les hausses, étouffant la volatilité ; quand ils sont courts gamma, ils font l'inverse et amplifient les mouvements. L'explosion des options qui expirent le jour même (0DTE), désormais 40 à 50 % du volume sur le S&P 500, a fait de ces flux de couverture un moteur dominant de l'intrajournalier. Le lire suppose de comprendre le delta, le gamma, le gamma flip et leurs limites."
pubDate: 2026-07-10T16:00:00+02:00
updatedDate: 2026-07-10T16:00:00+02:00
tags: ["options", "volatilité", "marchés", "gamma"]
category: marches
draft: false
---

*Il existe une force qui déplace les marchés chaque jour sans qu'aucune nouvelle ne l'explique. Elle ne relève ni de l'analyse fondamentale ni de la conviction d'un gérant, mais de la plomberie : l'obligation, pour les vendeurs d'options, de couvrir leur risque en achetant ou vendant le sous-jacent, mécaniquement, en continu. Les jours de forte activité sur les options du jour, cette couverture devient le premier moteur des mouvements. Comprendre le gamma des dealers, c'est voir cette main invisible qui, selon les cas, cloue le marché sur place ou précipite sa chute. Ce guide en démonte les rouages.*

## Options, delta et gamma : le minimum vital

Une [option](/glossaire/option/) donne le droit d'acheter (un call) ou de vendre (un put) un actif à un prix fixé jusqu'à une échéance. Deux mesures suffisent à comprendre ce guide. Le [delta](/glossaire/delta/) est la sensibilité du prix de l'option à celui du sous-jacent : un delta de 0,5 signifie que l'option bouge de 0,50 quand l'actif bouge de 1. Le [gamma](/glossaire/gamma/) est la vitesse à laquelle ce delta change lorsque le sous-jacent bouge. Le gamma est maximal quand le prix est proche du prix d'exercice et quand l'échéance approche, deux conditions réunies par les options qui expirent le jour même.

Retenez l'image : le delta dit de combien on est exposé, le gamma dit à quelle vitesse cette exposition se transforme. Un gamma élevé, c'est une exposition qui change vite, donc une couverture à réajuster sans cesse. C'est de ce réajustement permanent que naissent les flux qui bougent le marché.

## Le dealer qui doit se couvrir

Quand un particulier ou un fonds achète une option, quelqu'un la lui vend. Ce vendeur est le plus souvent un [teneur de marché](/glossaire/teneur-de-marche/), un dealer, dont le métier n'est pas de parier sur la direction du marché mais de gagner l'écart entre l'achat et la vente. Pour rester neutre, il doit annuler le delta que sa vente d'option lui a laissé, en prenant une position inverse sur le sous-jacent. S'il a vendu un call, il achète des actions ou des futures pour se couvrir ; s'il a vendu un put, il en vend.

Le point crucial est que cette couverture n'est pas un choix directionnel, c'est une contrainte mécanique. Et comme le delta change avec le prix, à cause du gamma, le dealer doit ajuster sa couverture en permanence, en achetant et vendant le sous-jacent à mesure que le marché bouge. Multipliez ce geste par des millions de contrats, et vous obtenez un flux qui pèse réellement sur le prix. Le sens de ce flux dépend d'une seule chose : le dealer est-il globalement long ou court gamma.

## Long gamma, short gamma : amortir ou amplifier

C'est le cœur du sujet. Quand les dealers sont collectivement longs gamma, leur couverture les pousse à acheter quand le marché baisse et à vendre quand il monte. Ce comportement est contra-cyclique : il ramène le prix vers son point de départ, étouffe la volatilité et tend à clouer le marché autour des grands prix d'exercice. Quand les dealers sont courts gamma, la logique s'inverse : ils vendent quand le marché baisse et achètent quand il monte, un comportement pro-cyclique qui amplifie les mouvements et accélère les chutes.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 340" role="img" aria-label="Comparaison de la couverture des dealers selon qu'ils sont longs ou courts gamma" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="340" fill="#0c0d10"></rect>
  <text x="32" y="34" fill="#f5f6f8" font-size="17" font-weight="700">Long gamma, short gamma : amortir ou amplifier</text>
  <text x="32" y="55" fill="#8b909b" font-size="12">Selon le sens de leur position, la couverture des dealers étouffe ou accélère les mouvements.</text>
  <rect x="30" y="76" width="320" height="238" rx="6" fill="none" stroke="#5eead4" stroke-width="1.5"></rect>
  <text x="46" y="102" fill="#5eead4" font-size="13" font-weight="700">Dealers LONG gamma</text>
  <text x="46" y="120" fill="#8b909b" font-size="11">amortisseur de volatilité</text>
  <polyline points="50,180 90,168 130,190 170,172 210,186 250,174 290,184 330,178" fill="none" stroke="#5eead4" stroke-width="2.5"></polyline>
  <text x="46" y="228" fill="#d6d9df" font-size="11.5">Le marché baisse, le dealer ACHÈTE</text>
  <text x="46" y="248" fill="#d6d9df" font-size="11.5">Le marché monte, le dealer VEND</text>
  <text x="46" y="284" fill="#5eead4" font-size="11">Le prix colle aux strikes,</text>
  <text x="46" y="300" fill="#5eead4" font-size="11">la volatilité s'étouffe.</text>
  <rect x="370" y="76" width="320" height="238" rx="6" fill="none" stroke="#ff4d87" stroke-width="1.5"></rect>
  <text x="386" y="102" fill="#ff4d87" font-size="13" font-weight="700">Dealers SHORT gamma</text>
  <text x="386" y="120" fill="#8b909b" font-size="11">amplificateur de volatilité</text>
  <polyline points="390,150 430,158 470,150 510,172 550,196 590,228 630,258 670,282" fill="none" stroke="#ff4d87" stroke-width="2.5"></polyline>
  <text x="386" y="228" fill="#d6d9df" font-size="11.5">Le marché baisse, le dealer VEND</text>
  <text x="386" y="248" fill="#d6d9df" font-size="11.5">Le marché monte, le dealer ACHÈTE</text>
  <text x="386" y="284" fill="#ff4d87" font-size="11">Les mouvements s'accélèrent,</text>
  <text x="386" y="300" fill="#ff4d87" font-size="11">les krachs vont plus vite.</text>
</svg>
<figcaption>À gauche, des dealers <strong>longs gamma</strong> rachètent les baisses et vendent les hausses : le marché est amorti. À droite, des dealers <strong>courts gamma</strong> font l'inverse et jettent de l'huile sur le feu. Le niveau où l'on bascule de l'un à l'autre est le « gamma flip ».</figcaption>
</figure>

Le niveau de prix où les dealers passent de long à court gamma porte un nom, le gamma flip. Au-dessus, le marché tend à être calme et attiré vers les grands strikes ; en dessous, il devient nerveux et sujet aux accélérations. Les fournisseurs de données spécialisés estiment ce niveau à partir de la position ouverte sur les options, sous le nom de [GEX](/glossaire/gex/), pour Gamma Exposure. Un GEX positif signale un marché amorti, un GEX négatif un marché à risque d'emballement.

## Le régime 0DTE

Ce mécanisme, longtemps réservé aux jours d'échéance mensuelle, est devenu quotidien avec l'explosion des options qui expirent le jour même, les [0DTE](/glossaire/0dte/). En 2026, elles représentent de l'ordre de 40 à 50 % du volume total d'options sur le S&P 500, et jusqu'à près de 60 % certains jours. Comme leur gamma est extrême, quelques heures avant l'expiration, la couverture qu'elles imposent aux dealers se concentre sur la séance et doit s'ajuster en temps réel.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 290" role="img" aria-label="Poids des options 0DTE et de la couverture des dealers dans le volume du S&P 500" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="290" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Le poids mécanique du 0DTE</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Part du volume d'options S&amp;P 500 et de la couverture des dealers, 2026.</text>
  <text x="40" y="96" fill="#d6d9df" font-size="12">Options 0DTE dans le volume d'options SPX</text>
  <rect x="40" y="106" width="600" height="22" fill="#2a2c33"></rect>
  <rect x="40" y="106" width="270" height="22" fill="#5eead4" opacity="0.9"></rect>
  <text x="322" y="123" fill="#5eead4" font-size="12" font-weight="700">~40 à 50 %</text>
  <text x="40" y="158" fill="#d6d9df" font-size="12">Couverture des dealers dans le volume SPX</text>
  <rect x="40" y="168" width="600" height="22" fill="#2a2c33"></rect>
  <rect x="40" y="168" width="195" height="22" fill="#f5b13d" opacity="0.9"></rect>
  <text x="247" y="185" fill="#f5b13d" font-size="12" font-weight="700">~25 à 40 %</text>
  <text x="40" y="224" fill="#d6d9df" font-size="12.5">Les jours de fort 0DTE, ce sont les flux de couverture,</text>
  <text x="40" y="243" fill="#d6d9df" font-size="12.5">et non les fondamentaux, qui dominent l'intrajournalier.</text>
  <text x="32" y="276" fill="#8b909b" font-size="11">Sources : CBOE, SpotGamma, recherche académique. Fourchettes selon les jours et les mesures.</text>
</svg>
<figcaption>Les 0DTE pèsent désormais <strong>40 à 50 %</strong> du volume d'options du S&amp;P 500, et la couverture des dealers <strong>un quart à deux cinquièmes</strong> du volume de l'indice. Assez pour que la plomberie fasse le prix. Sources : CBOE, SpotGamma.</figcaption>
</figure>

Sur les indices, cela se traduit par un phénomène d'aimantation : à l'approche de la clôture, le sous-jacent tend à graviter vers les prix d'exercice où la position ouverte est la plus dense, parce que la couverture des dealers y devient stabilisatrice. Ce même effet, inversé, rend les journées d'échéance (les OpEx) plus volatiles, quand la disparition d'un gros bloc d'options change brutalement le positionnement des dealers.

## Vanna, charm et les rallyes sans nouvelles

La couverture des dealers ne réagit pas qu'au prix. Elle réagit aussi à deux autres variables, ressort de mouvements en apparence inexplicables. La première est la volatilité : quand la volatilité implicite baisse, la couverture des dealers vendeurs de puts les pousse à acheter le sous-jacent, un flux appelé vanna qui peut nourrir un « rallye vanna », une hausse lente et régulière sans aucune nouvelle. La seconde est le temps qui passe : à mesure que l'échéance approche, l'érosion de la valeur temps (le charm) génère elle aussi des flux de couverture directionnels.

Ces flux de second ordre ont une vertu explicative puissante. Ils rendent compte de ces marchés qui montent doucement pendant des semaines dans un calme trompeur, portés par la seule mécanique de couverture, puis se retournent violemment dès que la volatilité remonte et inverse le signe de tous ces flux. Le calme n'est pas l'absence de risque ; il est parfois le produit d'une couverture qui s'auto-entretient jusqu'à ce qu'elle se rompe.

## Quand le gamma casse : Volmageddon et GameStop

Deux épisodes montrent la même mécanique dans ses deux directions. Le 5 février 2018, le « Volmageddon », une remontée de la volatilité a pris à revers une masse de positions vendeuses de volatilité et de dealers courts gamma : le VIX a bondi d'environ 17 à plus de 37, le Dow Jones a perdu 1 175 points en séance, un record d'alors, et le produit inversé sur le VIX, le XIV, s'est effondré de quelque 96 % avant d'être liquidé. La couverture forcée a nourri sa propre chute.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 280" role="img" aria-label="Deux précédents de rupture de gamma, Volmageddon 2018 et GameStop 2021" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="280" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Quand le gamma casse : deux précédents</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">La même mécanique de couverture forcée, dans les deux directions.</text>
  <rect x="40" y="80" width="4" height="70" fill="#ff4d87"></rect>
  <text x="58" y="100" fill="#ff4d87" font-size="13" font-weight="700">Février 2018, le Volmageddon</text>
  <text x="58" y="120" fill="#d6d9df" font-size="11.5">VIX ~17 vers 37, Dow -1 175 pts, le fonds inversé XIV -96 %.</text>
  <text x="58" y="138" fill="#8b909b" font-size="11.5">Dealers courts gamma et vega : la chute s'auto-alimente.</text>
  <rect x="40" y="168" width="4" height="70" fill="#f5b13d"></rect>
  <text x="58" y="188" fill="#f5b13d" font-size="13" font-weight="700">Janvier 2021, GameStop</text>
  <text x="58" y="208" fill="#d6d9df" font-size="11.5">GME de moins de 20 $ à un pic de 483 $ le 28 janvier.</text>
  <text x="58" y="226" fill="#8b909b" font-size="11.5">Gamma squeeze : les achats de calls forcent les dealers à acheter.</text>
  <text x="32" y="266" fill="#8b909b" font-size="11">Sources : records de séance, CBOE. Deux faces d'un même mécanisme de couverture.</text>
</svg>
<figcaption>À la baisse en 2018, à la hausse en 2021 : dans les deux cas, la couverture des dealers courts gamma a amplifié le mouvement au lieu de l'amortir. <strong>Le gamma ne crée pas la tendance, il l'accélère.</strong> Sources : records de séance, CBOE.</figcaption>
</figure>

À l'inverse, en janvier 2021, l'action GameStop a montré le [gamma squeeze](/glossaire/gamma-squeeze/) dans sa version haussière. Des achats massifs de calls par des particuliers ont forcé les dealers à acheter l'action pour se couvrir ; cet achat a poussé le cours, augmenté le delta à couvrir, et contraint les dealers à en acheter davantage encore, dans une boucle qui a propulsé le titre de moins de 20 dollars à un pic intrajournalier de 483 dollars le 28 janvier. Baisse en 2018, hausse en 2021, mais dans les deux cas la même vérité : le gamma ne crée pas la tendance, il l'accélère.

## Lire le gamma en pratique

Suivre le gamma des dealers, c'est ajouter une couche de lecture à celle de la [volatilité](/guides/lire-la-volatilite-vix-move/). Trois réflexes aident. D'abord, situer le marché par rapport au gamma flip : au-dessus, s'attendre à un marché amorti et pinné ; en dessous, à des mouvements amplifiés. Ensuite, se méfier du calme : une volatilité très basse peut refléter une couverture stabilisatrice qui s'inversera brutalement le jour où elle se rompt, comme le rappelle la surface trop calme de 2026. Enfin, lire les journées d'échéance et les grands strikes comme des points de bascule potentiels.

Une mise en garde, pour finir, sépare l'analyse sérieuse du bruit. Le volume brut d'options ne dit pas l'exposition nette des dealers : l'essentiel n'est pas combien de contrats s'échangent, mais l'équilibre entre les achats et les ventes des clients, qui détermine seul le volume que les dealers doivent couvrir. Les estimations de GEX et de gamma flip sont précieuses, mais elles reposent sur des hypothèses de positionnement qu'aucun acteur ne connaît avec certitude. Le gamma des dealers explique beaucoup des mouvements de court terme ; il ne remplace ni les fondamentaux, ni la prudence devant un indicateur qui reste, par nature, une reconstruction.

## Sources et pour aller plus loin

- [CBOE, « Evaluating the Market Impact of SPX 0DTE Options »](https://www.cboe.com/insights/posts/volatility-insights-evaluating-the-market-impact-of-spx-0-dte-options/) : part des 0DTE et poids de la couverture des dealers.
- [CBOE, « 0DTE Index Options and Market Volatility »](https://cdn.cboe.com/resources/education/research_publications/gammasqueezes.pdf) : recherche sur l'impact des 0DTE et les gamma squeezes.
- SpotGamma, méthodologie du gamma exposure (GEX) et du gamma flip : estimation du positionnement des dealers.
- Guides liés : [Lire la volatilité VIX et MOVE](/guides/lire-la-volatilite-vix-move/) et [Lire le COT de la CFTC](/guides/lire-cot-cftc/).
</content>
