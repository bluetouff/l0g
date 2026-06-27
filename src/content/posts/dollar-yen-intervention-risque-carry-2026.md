---
title: "Dollar-yen : le risque n'est pas seulement le niveau, c'est le débouclage"
description: "USD/JPY au-dessus de 161, BoJ plus restrictive, menace d'intervention japonaise : le risque principal est moins une ligne de change qu'un choc de carry trade et de liquidité."
pubDate: 2026-06-27T13:35:00+02:00
tags: ["yen", "boj", "dollar", "carry trade", "macro", "marchés"]
draft: false
ogImage: "/og/dollar-yen-intervention-risque-carry-2026.png?v=20260627"
---

Le dollar-yen est revenu dans une zone politiquement inflammable. La série officielle [FRED DEXJPUS](https://fred.stlouisfed.org/series/DEXJPUS) donne **161,37 yens pour un dollar au 18 juin 2026** ; les cotations [WSJ/LSEG](https://www.wsj.com/market-data/quotes/fx/USDJPY/historical-prices) plaçaient encore l'USD/JPY autour de **161,94 le 25 juin** puis **161,65 le 26 juin**. Ce n'est pas seulement un chiffre rond. C'est une zone où le Japon a déjà montré qu'il pouvait vendre des dollars pour acheter du yen.

La nuance institutionnelle compte. Une intervention de change est décidée par le [MoF](/glossaire/mof/), pas par la [BoJ](/glossaire/boj/) seule, même si la banque centrale peut servir d'agent opérationnel. Le registre du [ministère japonais des Finances](https://www.mof.go.jp/english/policy/international_policy/reference/feio/index.htm) montre une intervention nette de **11 734,9 milliards de yens entre le 28 avril et le 27 mai 2026**. Autrement dit, Tokyo a déjà dépensé de la munition. Le marché teste maintenant la volonté de recommencer.

<svg viewBox="0 0 760 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Dollar yen autour de la zone 161 en juin 2026" style="display:block;width:100%;height:auto;background:#0c0d10;border:1px solid rgba(255,255,255,0.10);border-radius:8px;margin:18px 0 24px">
  <text x="26" y="36" fill="#5eead4" font-family="monospace" font-size="15">// USD/JPY : retour dans la zone d'intervention</text>
  <g stroke="rgba(255,255,255,0.10)" stroke-width="1">
    <line x1="86" y1="250" x2="720" y2="250"/>
    <line x1="86" y1="200" x2="720" y2="200"/>
    <line x1="86" y1="150" x2="720" y2="150"/>
    <line x1="86" y1="100" x2="720" y2="100"/>
  </g>
  <g fill="#8b909b" font-family="monospace" font-size="11" text-anchor="end">
    <text x="74" y="254">150</text>
    <text x="74" y="204">155</text>
    <text x="74" y="154">160</text>
    <text x="74" y="104">165</text>
  </g>
  <polyline points="110,160 220,145 330,132 440,138 550,130 660,133" fill="none" stroke="#5eead4" stroke-width="4"/>
  <line x1="86" y1="136" x2="720" y2="136" stroke="#ff4d87" stroke-width="2" stroke-dasharray="6 5"/>
  <text x="705" y="126" fill="#ff4d87" font-family="monospace" font-size="12" text-anchor="end">zone 161-162</text>
  <circle cx="550" cy="130" r="6" fill="#f5b13d"/>
  <circle cx="660" cy="133" r="6" fill="#f5b13d"/>
  <g fill="#b8fff5" font-family="monospace" font-size="10" text-anchor="middle">
    <text x="110" y="278">mai</text>
    <text x="330" y="278">18 juin</text>
    <text x="550" y="278">25 juin</text>
    <text x="660" y="278">26 juin</text>
  </g>
  <text x="26" y="304" fill="#8b909b" font-family="monospace" font-size="10">Sources : FRED DEXJPUS, WSJ/LSEG. Données consultées le 27 juin 2026.</text>
</svg>

Le paradoxe est que la [BoJ](/glossaire/boj/) a déjà durci. Sa décision de politique monétaire du [16 juin 2026](https://www.boj.or.jp/en/mopo/mpmdeci/index.htm/) a porté le taux directeur à **1,0 %**. Mais un taux japonais à 1 % reste faible face à des rendements américains toujours élevés, dans le sillage du [premier FOMC de Warsh](/posts/warsh-premier-fomc-juin-2026/) et d'une Fed contrainte par l'inflation. Tant que l'écart de rémunération reste massif, vendre du yen pour acheter du dollar demeure un trade rationnel.

C'est là que le risque devient systémique. Le [yen carry](/glossaire/yen-carry/) fonctionne comme une position courte implicite sur la volatilité : on emprunte en yen bon marché, on achète des actifs mieux rémunérés, et tout va bien tant que le yen ne remonte pas brutalement. Une intervention réussie ne crée donc pas seulement une bougie sur le graphique FX. Elle peut forcer des investisseurs à réduire en même temps des positions en dollars, Treasuries, actions, crédit ou crypto, selon leur financement.

<svg viewBox="0 0 760 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Transmission du risque yen carry trade" style="display:block;width:100%;height:auto;background:#0c0d10;border:1px solid rgba(255,255,255,0.10);border-radius:8px;margin:18px 0 24px">
  <text x="26" y="36" fill="#5eead4" font-family="monospace" font-size="15">// Le vrai risque : un débouclage mécanique du carry</text>
  <g font-family="monospace" font-size="13" fill="#e7e9ee">
    <rect x="38" y="82" width="190" height="58" rx="6" fill="none" stroke="#5eead4"/>
    <text x="58" y="108">yen faible</text><text x="58" y="128">financement bon marché</text>
    <rect x="286" y="82" width="190" height="58" rx="6" fill="none" stroke="#f5b13d"/>
    <text x="306" y="108">achat d'actifs</text><text x="306" y="128">dollar, taux, risque</text>
    <rect x="534" y="82" width="190" height="58" rx="6" fill="none" stroke="#ff4d87"/>
    <text x="554" y="108">intervention</text><text x="554" y="128">rachat forcé du yen</text>
    <rect x="286" y="220" width="190" height="58" rx="6" fill="none" stroke="#7aa2f7"/>
    <text x="306" y="246">débouclement</text><text x="306" y="266">vente des actifs liquides</text>
  </g>
  <g stroke="#5eead4" stroke-width="2" fill="none">
    <path d="M228 111 L286 111"/><path d="M476 111 L534 111"/><path d="M629 140 C620 206 520 249 476 249"/><path d="M286 249 C210 230 146 170 132 140"/>
  </g>
  <g fill="#5eead4">
    <path d="M282 111 l-9 -5 v10 z"/><path d="M530 111 l-9 -5 v10 z"/><path d="M481 249 l9 -5 v10 z"/><path d="M133 145 l-3 -10 l10 4 z"/>
  </g>
  <text x="26" y="320" fill="#8b909b" font-family="monospace" font-size="10">Lecture : l'intervention devient dangereuse quand elle transforme une perte FX en vente forcée d'actifs liquides.</text>
</svg>

Mon évaluation : l'intervention japonaise est probable si la vitesse de dépréciation réaccélère, mais elle ne suffit pas à inverser durablement la tendance sans soutien des taux. Le seuil à surveiller n'est donc pas seulement **162** ou **165**. C'est la combinaison : hausse rapide de l'USD/JPY, rhétorique du MoF, volatilité implicite yen, et positionnement spéculatif publié par la [CFTC](/glossaire/cftc/). Le [dashboard Yen Carry](https://yct.l0g.fr) est précisément fait pour suivre cette mécanique.

Le canal Treasuries mérite aussi attention. Le Japon reste un créancier majeur des États-Unis selon les données [TIC du Trésor américain](https://ticdata.treasury.gov/resource-center/data-chart-center/tic/Documents/slt_table5.html). Si la défense du yen force des ventes de dollars ou modifie les couvertures de change des investisseurs japonais, l'effet peut se transmettre aux rendements américains, donc à la liquidité globale. C'est le même monde que celui décrit dans notre guide sur la [liquidité nette](/guides/liquidite-tresor-dts-tga-rrp/) : le change, les Treasuries et le financement de marché ne sont pas trois sujets séparés.

Conclusion sobre : un yen faible aide les exportateurs japonais, mais un yen qui casse trop vite devient un risque de marché mondial. L'intervention peut calmer le spot. Elle peut aussi déclencher ce qu'elle cherche à éviter : une sortie désordonnée du carry.

---

*Ceci n'est pas un conseil en investissement. Données de marché consultées le 27 juin 2026.*

**Sources principales :** [FRED, DEXJPUS](https://fred.stlouisfed.org/series/DEXJPUS), dernière observation disponible au 18 juin 2026 ; [WSJ/LSEG, USD/JPY historical prices](https://www.wsj.com/market-data/quotes/fx/USDJPY/historical-prices), cotations des 25 et 26 juin 2026 ; [Bank of Japan, décisions de politique monétaire](https://www.boj.or.jp/en/mopo/mpmdeci/index.htm/), 16 juin 2026 ; [Ministry of Finance Japan, Foreign Exchange Intervention Operations](https://www.mof.go.jp/english/policy/international_policy/reference/feio/index.htm), relevé avril-mai 2026 ; [U.S. Treasury TIC, major foreign holders of Treasury securities](https://ticdata.treasury.gov/resource-center/data-chart-center/tic/Documents/slt_table5.html) ; [CFTC, Commitments of Traders](https://www.cftc.gov/MarketReports/CommitmentsofTraders/index.htm).
