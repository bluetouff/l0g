---
title: "Lire le marché pétrolier : prix, courbe, offre et données"
description: "Guide de référence sur le marché du pétrole : la différence entre Brent et WTI et pourquoi deux prix coexistent, comment le prix se forme entre papier et physique, ce que la forme de la courbe à terme (contango, backwardation) raconte de l'équilibre offre-demande, le rôle de l'OPEP+ et de sa capacité de réserve, la mécanique des stocks stratégiques, et le calendrier des données à suivre : EIA le mercredi, API le mardi, Baker Hughes le vendredi. Avec le marché de 2026, déformé par le choc d'Ormuz, comme cas d'école."
summary: "Le marché pétrolier se lit à travers deux prix de référence, le Brent (mer du Nord, mondial) et le WTI (Cushing, américain) ; un prix qui se forme d'abord sur les marchés à terme puis se décline en différentiels physiques ; une courbe dont la pente signale la tension ou l'abondance ; et un équilibre offre-demande piloté par l'OPEP+, le schiste américain et les stocks. Le suivre suppose de connaître le calendrier des données : inventaires EIA le mercredi, capacité de réserve, rapports mensuels de l'IEA et de l'OPEP."
pubDate: 2026-07-04T21:00:00+02:00
updatedDate: 2026-07-04T21:00:00+02:00
tags: ["pétrole", "matières premières", "macro"]
category: marches
draft: false
---

*Le pétrole a un prix que tout le monde cite et presque personne ne sait lire. Un titre annonce « le baril à tant », mais lequel, le Brent ou le WTI ? Le prix au comptant ou celui d'un contrat qui expire dans trois mois ? La vraie information n'est pas dans le niveau, elle est dans l'écart entre les prix, la forme de la courbe et le sens des stocks. Ce guide reprend la mécanique du marché pétrolier, de la formation du prix aux données à surveiller. L'année 2026, déformée par le choc du détroit d'Ormuz, sert de fil conducteur : elle illustre presque tous les ressorts à la fois.*

## Deux prix pour un seul marché

Il n'existe pas un prix du pétrole, mais une famille de prix de référence, ou benchmarks, chacun rattaché à une qualité de brut et à un lieu de livraison. Deux dominent la conversation mondiale. Le **Brent**, issu de gisements de la mer du Nord, est un brut léger et peu soufré, livré par voie maritime : c'est le prix maritime, exportable partout, qui sert de référence à environ **deux tiers** du brut échangé internationalement, et l'ensemble du complexe Brent encadre le prix de **75 à 80 %** du pétrole mondial. Le **WTI**, ou West Texas Intermediate, est lui aussi léger et doux, mais livré à terre, à Cushing dans l'Oklahoma, un nœud de pipelines sans accès direct à la mer. C'est le marqueur du marché américain.

Cette différence de géographie explique que les deux prix ne soient jamais tout à fait égaux. L'écart entre eux, le **spread Brent-WTI**, reflète les coûts de transport, les différences de qualité et les déséquilibres régionaux d'offre et de demande. Depuis 2015, le Brent cote le plus souvent **2 à 8 dollars** au-dessus du WTI, le brut de Cushing souffrant de son enclavement. En mars 2026, au plus fort des tensions d'Ormuz, le spread s'établissait autour de **4,70 dollars** ; fin juin, une fois la prime de risque retombée, il était redescendu sous **3 dollars**. Un spread qui se creuse ou se resserre en dit souvent plus long qu'un mouvement du niveau lui-même.

À côté de ces deux marqueurs occidentaux, un troisième compte pour l'Asie : le **Dubai/Oman**, brut plus lourd et plus soufré, référence des cargaisons du Golfe vers l'Est. L'OPEP publie par ailleurs son propre panier, l'OPEC Reference Basket, moyenne pondérée des bruts de ses membres. Lire une cotation, c'est donc toujours se demander lequel de ces prix on regarde, car ils ne racontent pas la même géographie.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 340" role="img" aria-label="Comparaison des deux prix de référence du pétrole, Brent et WTI, et écart entre eux" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="340" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Deux marqueurs, une seule matière</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Le Brent est maritime et mondial, le WTI terrestre et américain. L'écart raconte la géographie.</text>
  <rect x="40" y="86" width="315" height="118" fill="#101216" stroke="#2a2c33"></rect>
  <text x="56" y="112" fill="#5eead4" font-size="14" font-weight="700">Brent</text>
  <text x="56" y="134" fill="#d6d9df" font-size="12">Mer du Nord · léger, doux</text>
  <text x="56" y="154" fill="#d6d9df" font-size="12">Livré par bateau, exportable</text>
  <text x="56" y="174" fill="#d6d9df" font-size="12">Référence de ~2/3 du brut mondial</text>
  <text x="56" y="194" fill="#8b909b" font-size="11">Coté sur ICE (Londres)</text>
  <rect x="365" y="86" width="315" height="118" fill="#101216" stroke="#2a2c33"></rect>
  <text x="381" y="112" fill="#f5b13d" font-size="14" font-weight="700">WTI</text>
  <text x="381" y="134" fill="#d6d9df" font-size="12">Cushing, Oklahoma · léger, doux</text>
  <text x="381" y="154" fill="#d6d9df" font-size="12">Livré à terre, enclavé</text>
  <text x="381" y="174" fill="#d6d9df" font-size="12">Marqueur du marché américain</text>
  <text x="381" y="194" fill="#8b909b" font-size="11">Coté sur NYMEX / CME</text>
  <line x1="40" y1="232" x2="680" y2="232" stroke="#2a2c33" stroke-width="1"></line>
  <text x="40" y="258" fill="#f5f6f8" font-size="13" font-weight="700">Le spread Brent-WTI</text>
  <text x="40" y="280" fill="#d6d9df" font-size="12">Fourchette habituelle depuis 2015 : Brent 2 à 8 $ au-dessus du WTI.</text>
  <text x="40" y="300" fill="#d6d9df" font-size="12">Mars 2026 : ≈ 4,70 $. Fin juin 2026, prime de risque retombée : &lt; 3 $.</text>
  <text x="40" y="324" fill="#8b909b" font-size="11">Sources : RBN Energy, YCharts, Schwab.</text>
</svg>
<figcaption>Le Brent, maritime, sert de référence à environ deux tiers du brut échangé dans le monde ; le WTI, livré à Cushing, marque le marché américain. Leur écart, le spread Brent-WTI, oscille le plus souvent entre **2 et 8 dollars**. Sources : RBN Energy, YCharts, Charles Schwab.</figcaption>
</figure>

## Comment se forme le prix : papier et physique

Le prix qui défile sur les écrans n'est pas celui d'un baril qu'on se passe de main en main. Il naît sur les **marchés à terme**, où s'échangent des contrats standardisés d'achat ou de vente à une date future : le Brent sur l'ICE à Londres, le WTI sur le NYMEX, filiale du CME à New York. Le volume de ces contrats papier dépasse de très loin le pétrole physiquement livré : pour chaque baril réellement produit, il s'en échange plusieurs dizaines sur le papier. C'est là, dans cette masse de contrats, que se fait la découverte du prix, parce que c'est là que se concentrent la liquidité et l'information.

Le marché physique, lui, se raccroche à ces références. Une cargaison réelle ne se vend pas à un prix négocié dans le vide, mais à un **différentiel** par rapport au benchmark : tel brut se traite à « Dated Brent moins 1,20 dollar », tel autre à un premium. Le différentiel encaisse la qualité précise du brut, sa densité, sa teneur en soufre, sa localisation et l'état de la demande locale des raffineurs. Le prix affiché donne donc la marée générale ; le différentiel dit le niveau exact de chaque crique.

Cette architecture a une conséquence que l'on oublie souvent. Comme le prix se forme d'abord sur des contrats financiers, il incorpore des anticipations, des couvertures de producteurs et de compagnies aériennes, et des positions spéculatives. Le positionnement des intervenants se lit dans le rapport hebdomadaire [COT de la CFTC](/guides/lire-cot-cftc/), qui répartit les positions ouvertes entre catégories de traders. Un prix qui monte peut refléter une pénurie physique réelle comme un simple repositionnement financier ; distinguer les deux est le cœur du métier.

## Contango et backwardation : lire la pente de la courbe

Puisqu'il existe un prix pour chaque échéance future, on peut relier ces prix en une **courbe à terme**, et c'est sa pente qui porte l'information la plus dense du marché. Deux configurations s'opposent.

En **backwardation**, le prix au comptant est supérieur aux prix des échéances lointaines : la courbe descend. Le message est celui d'un marché tendu, où l'on paie une prime pour disposer du baril tout de suite. Cette forme décourage le stockage, puisque garder du pétrole pour le vendre plus tard reviendrait à le céder moins cher. C'est la configuration typique d'un choc d'offre ou d'une demande vigoureuse, celle qu'a prise le Brent au plus fort de la crise d'Ormuz en 2026.

En **contango**, la relation s'inverse : le comptant est moins cher que les échéances futures, la courbe monte. Le marché signale une abondance immédiate, un excédent qu'il faut loger quelque part. Cette pente rémunère le stockage : acheter au comptant, vendre à terme et engranger l'écart, une fois payés l'entreposage et le financement. Quand le contango devient assez profond, il rend même rentable le **stockage flottant**, du brut gardé dans des tankers à l'ancre faute de cuves à terre. Le cas extrême reste le 20 avril 2020 : en plein effondrement de la demande pandémique, saturé de brut sans preneur ni capacité de stockage à Cushing, le contrat WTI du mois a clôturé à environ **−37 dollars**, les détenteurs payant pour se débarrasser d'une livraison qu'ils ne pouvaient honorer. Un prix négatif n'est pas une aberration de marché : c'est un manque physique de réservoir.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 320" role="img" aria-label="Les deux formes de la courbe à terme du pétrole, contango et backwardation" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="320" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">La pente de la courbe dit la tension</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">On relie le prix de chaque échéance future. La forme signale abondance ou pénurie.</text>
  <text x="120" y="96" fill="#f5b13d" font-size="13" font-weight="700">Contango</text>
  <line x1="70" y1="230" x2="330" y2="120" stroke="#f5b13d" stroke-width="3"></line>
  <line x1="70" y1="120" x2="70" y2="250" stroke="#2a2c33" stroke-width="1"></line>
  <line x1="70" y1="250" x2="340" y2="250" stroke="#2a2c33" stroke-width="1"></line>
  <text x="60" y="268" fill="#8b909b" font-size="10">comptant</text>
  <text x="300" y="268" fill="#8b909b" font-size="10">terme</text>
  <text x="70" y="292" fill="#d6d9df" font-size="11">Futur &gt; comptant · excédent</text>
  <text x="70" y="308" fill="#8b909b" font-size="10.5">Rémunère le stockage</text>
  <text x="450" y="96" fill="#5eead4" font-size="13" font-weight="700">Backwardation</text>
  <line x1="410" y1="120" x2="670" y2="230" stroke="#5eead4" stroke-width="3"></line>
  <line x1="410" y1="120" x2="410" y2="250" stroke="#2a2c33" stroke-width="1"></line>
  <line x1="410" y1="250" x2="680" y2="250" stroke="#2a2c33" stroke-width="1"></line>
  <text x="400" y="268" fill="#8b909b" font-size="10">comptant</text>
  <text x="640" y="268" fill="#8b909b" font-size="10">terme</text>
  <text x="410" y="292" fill="#d6d9df" font-size="11">Comptant &gt; futur · marché tendu</text>
  <text x="410" y="308" fill="#8b909b" font-size="10.5">Décourage le stockage</text>
</svg>
<figcaption>En **contango**, les échéances lointaines valent plus que le comptant : le marché est excédentaire et rémunère le stockage. En **backwardation**, le comptant vaut plus : le marché est tendu. La pente de la courbe est souvent un signal plus fiable que le niveau du prix.</figcaption>
</figure>

## L'offre : OPEP+, schiste et capacité de réserve

Du côté de l'offre, trois forces se partagent le marché. La première est l'**OPEP+**, l'OPEP élargie depuis fin 2016 à une dizaine de producteurs non membres emmenés par la Russie. Ensemble, ces pays pilotent une part décisive de la production mondiale en relevant ou abaissant des quotas. En 2026, le groupe a entrepris de défaire progressivement ses coupes volontaires, ajoutant près de **600 000 barils par jour** entre avril et juin, puis **188 000** de plus en juillet. Ce robinet est l'outil le plus direct dont dispose le marché pour peser sur le prix.

Le deuxième acteur est le pétrole de schiste américain, dont la souplesse a fait des États-Unis le premier producteur mondial. À la différence des puits conventionnels, un puits de schiste se met en route et s'épuise vite, ce qui rend l'offre américaine réactive au prix : elle enfle quand le baril est cher, ralentit quand il tombe. C'est ce qui a longtemps fait du schiste une force de rappel, plafonnant les hausses durables.

La troisième force est plus discrète mais capitale : la **capacité de réserve**, ce volume de production disponible et mobilisable en trente jours que les producteurs tiennent délibérément à l'arrêt. C'est le vrai coussin du marché mondial. Or il est mince et très concentré. Mi-2026, la capacité de réserve de l'OPEP+ tournait autour de **5 millions de barils par jour**, dont environ **3 millions** pour la seule Arabie saoudite, son plus haut niveau depuis 2009. À mesure que le groupe rouvre ses vannes, ce coussin se réduit, un plan de retour d'environ **180 000 barils par jour et par mois** devant le ramener vers **3 millions** fin 2026. Un marché avec peu de capacité de réserve est un marché fragile : il n'a plus grand-chose à opposer au prochain choc, ce qui fait de ce chiffre l'un des plus importants à surveiller.

## La demande : où va le baril

En face, la demande mondiale se compte en dizaines de millions de barils par jour, de l'ordre de **103 à 104 millions** ces dernières années. Elle se concentre dans les transports, la pétrochimie et l'industrie, et sa croissance s'est déplacée vers l'Asie, Chine et Inde en tête. La Chine, premier importateur mondial de brut, y joue un rôle d'acheteur d'appoint décisif, capable de gonfler ses achats quand le baril est bon marché et de vivre sur ses stocks quand il est cher, un mécanisme décrit dans notre analyse du [stock chinois qui plafonne les prix](/posts/petrole-le-stock-chinois-qui-plafonne-les-prix/).

Cette demande est difficile à mesurer en temps réel, et c'est pourquoi trois institutions publient chaque mois des estimations qui divergent souvent : l'**Agence internationale de l'énergie** (IEA), qui défend le point de vue des pays consommateurs ; l'**OPEP**, via son rapport mensuel, qui reflète l'optique des producteurs et se montre régulièrement plus optimiste sur la demande ; et l'**EIA** américaine, agence statistique indépendante. Lire le marché, c'est aussi savoir que ces trois chiffres ne coïncident pas, et pourquoi. En 2026, l'exercice a été brouillé par le choc d'Ormuz : l'IEA a révisé sa demande à la baisse, tablant sur une contraction de l'ordre de **1 million de barils par jour** sur l'année, effet direct de la flambée des prix et des ruptures d'approvisionnement, pas d'un ralentissement structurel.

## Les stocks, amortisseur et signal

Entre l'offre et la demande, les **stocks** absorbent les écarts et livrent un signal précieux. On distingue les stocks commerciaux, détenus par les raffineurs et les négociants au gré du marché, et les **réserves stratégiques** (SPR), constituées par les États pour parer une rupture d'approvisionnement. Les membres de l'IEA sont tenus de conserver l'équivalent de **90 jours** d'importations nettes.

Ces réserves racontent la géopolitique du baril. La [réserve stratégique chinoise](/glossaire/spr/), estimée à environ **1,24 milliard de barils** début 2026, serait devenue la première du monde, constituée en achetant du brut décoté quand il était bon marché. À l'inverse, la réserve stratégique américaine a fondu : autour de **409 millions de barils** au printemps 2026, contre un pic de **727 millions** fin 2009, elle a été fortement ponctionnée depuis 2022 et se situe à ses plus bas depuis les années 1980. Un État qui vide sa réserve pèse sur les prix à court terme mais s'expose davantage au choc suivant ; un État qui la remplit soutient la demande. Le sens des stocks, hausse ou baisse, est donc à lire comme un signal à part entière.

Au niveau hebdomadaire, ce sont les variations de stocks commerciaux qui font bouger les prix. Une hausse inattendue signale une offre qui dépasse la demande, un facteur baissier ; un tirage marqué, l'inverse. Le point de Cushing, où se dénoue le WTI, est suivi de près : quand ses cuves se remplissent, le WTI se déprécie face au Brent.

## Les données à suivre, et quand

Le marché pétrolier a l'avantage d'être richement documenté, et gratuitement pour l'essentiel. Quatre rendez-vous structurent la semaine et le mois.

- **API, le mardi à 16 h 30 (heure de l'Est).** L'American Petroleum Institute publie une estimation privée des stocks américains, veille du chiffre officiel. Moins fiable, mais scrutée comme avant-goût.
- **EIA, le mercredi à 10 h 30.** Le *Weekly Petroleum Status Report* est la donnée reine : stocks de brut et de produits raffinés, niveau de Cushing, taux d'utilisation des raffineries, production américaine. C'est le rapport qui déplace le plus les prix à court terme.
- **Baker Hughes, le vendredi à 13 h 00.** Le décompte hebdomadaire des plateformes de forage en activité aux États-Unis, indicateur avancé de la production de schiste à venir. Moins immédiat, mais révélateur de la tendance.
- **Les rapports mensuels.** L'IEA (*Oil Market Report*), l'OPEP (*Monthly Oil Market Report*) et l'EIA (*Short-Term Energy Outlook*) donnent chacun leur lecture de l'équilibre offre-demande. Les comparer, plutôt que se fier à un seul, est le réflexe juste, tant leurs hypothèses diffèrent.

Pour situer ces sorties dans le temps, le [calendrier économique](/calendrier-eco/) du site recense les rendez-vous à surveiller, et le [glossaire](/glossaire/) reprend les sigles employés ici.

## Lire le marché en pratique

Bien lu, le prix du pétrole cesse d'être un chiffre unique pour devenir un système de signaux. Le niveau donne l'humeur ; le spread Brent-WTI donne la géographie ; la pente de la courbe, contango ou backwardation, donne l'état de tension ; la capacité de réserve de l'OPEP+ donne la fragilité ; et le sens des stocks, hebdomadaire à l'EIA, donne la dynamique de court terme. Aucun de ces éléments ne se suffit à lui-même, mais ensemble ils dessinent une image que le gros titre, seul, ne donne jamais.

L'année 2026 en offre la démonstration. La flambée liée au détroit d'Ormuz a d'abord poussé le Brent vers **80 dollars**, avec un scénario à **105** si le détroit restait fermé, en mettant la courbe en backwardation franche. Puis la désescalade et la remontée de l'offre OPEP+ ont ramené le baril autour de **71 dollars** début juillet, sous la moyenne de long terme qu'anticipaient des maisons comme J.P. Morgan, autour de **60 dollars** pour l'année. Ce choc énergétique s'est propagé bien au-delà du pétrole : c'est lui qui a gonflé le gros titre de l'inflation américaine, comme le montre le guide sur [la lecture du CPI](/guides/lire-le-cpi-inflation-us/), un carburant cher se transmettant directement aux prix à la consommation. Le marché pétrolier ne se lit jamais isolément : il est l'une des grandes courroies de la macroéconomie.

---

**Sources principales :**

- [U.S. Energy Information Administration, *Weekly Petroleum Status Report* (calendrier et contenu)](https://www.eia.gov/petroleum/supply/weekly/) : publication le mercredi à 10 h 30, stocks de brut et de produits, niveau de Cushing, taux d'utilisation des raffineries.
- [U.S. Energy Information Administration, *Short-Term Energy Outlook*, marché mondial du pétrole](https://www.eia.gov/outlooks/steo/report/global_oil.php) : équilibre offre-demande, prévisions de prix, effet du choc d'Ormuz sur 2026.
- [IEA, *Oil Market Report – June 2026*](https://www.iea.org/reports/oil-market-report-june-2026) : demande et offre mondiales 2026-2027, révision liée à la fermeture du détroit d'Ormuz, offre moyenne 2026 autour de 102,4 mb/j.
- [RBN Energy, *Brent vs. WTI Spread*](https://rbnenergy.com/market-data/brent-vs-wti-spread) : nature des deux marqueurs, points de livraison, fourchette du spread depuis 2015.
- [Charles Schwab, *Energy Investing: WTI vs. Brent Crude Oil*](https://www.schwab.com/learn/story/energy-investing-basics-wti-vs-brent-crude-oil) : Brent maritime et mondial, WTI livré à Cushing, part du Brent dans le brut échangé.
- [OilPrice, *OPEC Nears Its Limit, Leaving Prices One Crisis Away from a Spike*](https://oilprice.com/Energy/Crude-Oil/OPEC-Nears-Its-Limit-Leaving-Prices-One-Crisis-Away-from-a-Spike.html) : capacité de réserve OPEP+ autour de 5 mb/j, ~3 mb/j pour l'Arabie saoudite, schéma de retour d'environ 180 000 b/j par mois.
- [EIA, *Expanding strategic oil stocks in China support crude oil prices*](https://www.eia.gov/todayinenergy/detail.php?id=66319) : rôle de la Chine comme acheteur de stock, effet sur les prix.
- [Industrial Info / EIA, niveau de la réserve stratégique américaine (SPR) en 2026](https://www.eia.gov/dnav/pet/hist/LeafHandler.ashx?n=PET&s=WCSSTUS1&f=W) : SPR autour de 409 millions de barils au printemps 2026, contre un pic de 727 millions fin 2009.
- [CME Group, *Understanding the Oil Data Report*](https://www.cmegroup.com/education/courses/learn-about-key-economic-events/understanding-the-oil-data-report) : calendrier API (mardi), EIA (mercredi), rôle des inventaires dans la formation du prix.
