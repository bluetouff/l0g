---
title: "Lire le carry trade : emprunter bas, placer haut, et gérer le débouclage"
description: "Guide de référence sur le carry trade, ou portage : comment on emprunte dans une devise peu rémunérée pour placer dans un actif au rendement supérieur et empocher l'écart, pourquoi cette stratégie revient à vendre de la volatilité, le rôle du levier, la mécanique du débouclage qui a fait plonger le Nikkei de 12 % en une séance en août 2024, et les cadrans à surveiller pour jauger le risque. Avec le yen comme fil conducteur."
summary: "Le carry trade, ou portage, consiste à emprunter dans une devise de financement à bas taux, le yen ou le franc suisse par exemple, pour placer dans un actif mieux rémunéré et capter l'écart de rendement. Il rapporte un revenu régulier tant que le change reste stable et la volatilité contenue, mais se dénoue brutalement quand la devise de financement remonte, forçant des ventes en chaîne. Le lire suppose de comprendre l'écart de taux qui le nourrit, l'effet de levier qui l'amplifie, et les signaux, volatilité FX, positionnement, seuils de change, qui annoncent un débouclage."
pubDate: 2026-07-10T09:00:00+02:00
updatedDate: 2026-07-10T09:00:00+02:00
tags: ["carry trade", "change", "taux", "macro", "marchés"]
category: marches
draft: false
---

*Certaines stratégies rapportent un peu, souvent, puis beaucoup d'un coup, mais dans le mauvais sens. Le carry trade est de celles-là. On l'appelle en français le portage : emprunter là où l'argent est bon marché pour le placer là où il rapporte, et vivre de l'écart. C'est l'un des moteurs les plus discrets et les plus puissants des marchés mondiaux, capable de mettre un couvercle sur une devise pendant des années puis de provoquer un krach en quelques heures. Ce guide en démonte la mécanique, du principe au débouclage. Le yen, devise de financement par excellence, sert de fil conducteur.*

## Le principe : capter un écart de rendement

Le [portage](/glossaire/carry-trade/) repose sur une asymétrie de taux d'intérêt entre deux monnaies. Un investisseur emprunte dans une devise à faible rendement, la [devise de financement](/glossaire/devise-de-financement/), et convertit le produit pour le placer dans un actif mieux rémunéré, souvent libellé dans une autre devise. Tant que le taux de change ne bouge pas, il empoche la différence entre les deux rendements, ce que les marchés appellent le carry, ou le pickup.

Prenons un exemple volontairement simple. Emprunter en yen coûte environ 1 % par an ; placer le produit en obligations américaines rapporte près de 4 %. L'écart, environ 3 points, est le revenu brut du portage, encaissé sans avoir engagé beaucoup de capital propre. Répété sur des milliers de milliards de dollars et amplifié par l'effet de levier, ce mécanisme irrigue une part considérable des flux de capitaux mondiaux. Il explique pourquoi une devise à bas taux peut rester durablement faible : tant que le portage fonctionne, tout le monde la vend.

## Les devises de financement et de destination

Toutes les monnaies ne se valent pas pour ce jeu. Une bonne devise de financement combine deux qualités : un taux d'intérêt bas et une réputation de stabilité. Le yen japonais coche les deux cases depuis vingt ans, la Banque du Japon ayant maintenu ses taux au plancher bien après les autres. Le franc suisse joue un rôle comparable, et le dollar lui-même a servi de devise de financement pendant les années de taux zéro qui ont suivi 2008. À l'autre bout, les devises de destination offrent un rendement supérieur : le dollar quand la Fed tient des taux élevés, mais surtout les monnaies émergentes à haut rendement, peso mexicain, réal brésilien, rand sud-africain, roupie indienne, dont les taux directeurs dépassent souvent 8 à 14 %.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 320" role="img" aria-label="Écart de taux entre devises de financement et de destination du carry trade" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="320" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">L'écart de taux, moteur du portage</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Taux directeurs à titre indicatif, mi-2026. Le portage capte l'écart entre financement et destination.</text>
  <text x="40" y="88" fill="#d6d9df" font-size="12">Japon (devise de financement)</text>
  <rect x="40" y="98" width="600" height="20" fill="#2a2c33"></rect>
  <rect x="40" y="98" width="43" height="20" fill="#8b909b" opacity="0.75"></rect>
  <text x="91" y="113" fill="#8b909b" font-size="11" font-weight="700">1,00 %</text>
  <text x="40" y="136" fill="#d6d9df" font-size="12">Zone euro</text>
  <rect x="40" y="146" width="600" height="20" fill="#2a2c33"></rect>
  <rect x="40" y="146" width="96" height="20" fill="#7aa2f7" opacity="0.9"></rect>
  <text x="144" y="161" fill="#7aa2f7" font-size="11" font-weight="700">2,25 %</text>
  <text x="40" y="184" fill="#d6d9df" font-size="12">États-Unis (destination)</text>
  <rect x="40" y="194" width="600" height="20" fill="#2a2c33"></rect>
  <rect x="40" y="194" width="161" height="20" fill="#5eead4" opacity="0.9"></rect>
  <text x="209" y="209" fill="#5eead4" font-size="11" font-weight="700">3,75 %</text>
  <text x="40" y="232" fill="#d6d9df" font-size="12">Émergents (Mexique, Brésil...)</text>
  <rect x="40" y="242" width="600" height="20" fill="#2a2c33"></rect>
  <rect x="40" y="242" width="471" height="20" fill="#f5b13d" opacity="0.9"></rect>
  <text x="519" y="257" fill="#f5b13d" font-size="11" font-weight="700">8 à 14 %</text>
  <text x="32" y="300" fill="#8b909b" font-size="11">Sources : BoJ, BCE, Fed (mi-2026). Taux émergents à titre indicatif. Le carry = l'écart capté.</text>
</svg>
<figcaption>Le portage capte l'écart entre une devise empruntée à bas taux, le <strong>yen à 1 %</strong>, et un actif mieux rémunéré, du dollar à <strong>3,75 %</strong> jusqu'aux émergents à deux chiffres. Plus l'écart est large, plus le trade est attractif, et plus il attire de capitaux. Sources : BoJ, BCE, Fed.</figcaption>
</figure>

Le choix du couple dépend de l'appétit pour le risque. Le portage entre devises développées, yen contre dollar par exemple, offre un écart plus modeste mais une volatilité contenue. Le portage vers les émergents promet un pickup bien plus gros, au prix d'un risque de change et de défaut nettement supérieur. Dans les deux cas, le pari implicite est le même : que la devise de financement ne se renforcera pas brutalement.

## Un pari sur le calme : le portage comme vente de volatilité

C'est le point le plus important, et le plus mal compris. Le carry trade n'est pas seulement un pari sur un écart de taux, c'est un pari sur la stabilité. Sa structure de gains ressemble à celle d'un vendeur d'assurance : il encaisse une prime régulière tant qu'il ne se passe rien, et subit une perte lourde et soudaine quand survient l'accident. En langage de marché, le portage revient à vendre de la volatilité.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 300" role="img" aria-label="Profil de gain asymétrique du carry trade" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="300" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Le profil du portage : l'escalier, puis la trappe</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Des gains réguliers et modestes, un risque rare mais brutal.</text>
  <line x1="60" y1="250" x2="680" y2="250" stroke="#2a2c33" stroke-width="1"></line>
  <polyline points="70,235 140,235 140,220 220,220 220,204 300,204 300,186 380,186 380,166 460,166 460,144 520,144" fill="none" stroke="#5eead4" stroke-width="3"></polyline>
  <polyline points="520,144 545,144 545,262 660,262" fill="none" stroke="#ff4d87" stroke-width="3"></polyline>
  <circle cx="520" cy="144" r="4" fill="#f5b13d"></circle>
  <text x="150" y="120" fill="#5eead4" font-size="12" font-weight="700">revenu régulier du portage</text>
  <text x="150" y="138" fill="#8b909b" font-size="11">l'écart de taux encaissé mois après mois</text>
  <text x="556" y="200" fill="#ff4d87" font-size="12" font-weight="700">débouclage</text>
  <text x="404" y="284" fill="#8b909b" font-size="11">Des mois de gains réguliers effacés en quelques séances : le portage vend implicitement de la volatilité.</text>
</svg>
<figcaption>La courbe de gains monte lentement, marche après marche, puis chute d'un coup. C'est le profil d'un vendeur d'assurance : une prime régulière, puis un sinistre brutal. <strong>Le portage prospère dans le calme et meurt dans la panique.</strong></figcaption>
</figure>

Cette nature explique deux comportements caractéristiques. D'abord, le portage adore la tranquillité : plus la volatilité est basse, plus il paraît sûr et plus les capitaux affluent, ce qui comprime encore la volatilité, dans une boucle auto-entretenue. Ensuite, il déteste les surprises : un choc de volatilité, même sans lien direct avec le change, peut suffire à faire fuir les capitaux et à inverser le mouvement. Le [VIX](/glossaire/vix/) et les indices de volatilité des changes sont, à ce titre, des baromètres avancés de la santé du portage.

## Le levier, accélérateur dans les deux sens

Un écart de 3 points n'enrichit personne s'il porte sur peu de capital. Le carry trade ne devient significatif qu'avec l'effet de levier, obtenu de plusieurs façons : sur le marché des changes à terme, où l'on prend une position bien supérieure à sa mise ; via le [repo](/glossaire/repo/), en gageant les titres achetés pour emprunter de nouveau ; ou par des dérivés qui répliquent l'exposition sans immobiliser le nominal. Un levier de dix multiplie par dix le rendement du carry, mais aussi la perte en cas de retournement.

Le levier introduit un second danger, plus insidieux que la simple perte : l'appel de marge. Quand la position se retourne, le prêteur exige davantage de garanties. Pour les fournir, l'investisseur doit vendre des actifs, souvent les plus liquides de son portefeuille, y compris ceux qui n'ont rien à voir avec le portage. C'est le canal par lequel un accident cantonné au yen contamine les actions, le crédit ou la crypto à l'autre bout du monde.

## Le débouclage : quand tout se dénoue d'un coup

Le scénario redouté porte un nom, le débouclage, ou unwind. Il s'enclenche quand la devise de financement se renforce brutalement, ce qui arrive typiquement lorsque la banque centrale qui l'émet relève ses taux, ou quand un choc de marché déclenche une ruée vers la sécurité. Les premières pertes provoquent des appels de marge, qui forcent des ventes, qui renforcent encore la devise de financement rachetée en catastrophe, qui aggravent les pertes des autres porteurs : la spirale est enclenchée.

L'épisode de référence est celui du 5 août 2024. Un relèvement de taux de la Banque du Japon, conjugué à de mauvais chiffres américains, a provoqué une remontée éclair du yen. Le débouclage qui a suivi a fait plonger le Nikkei de 12,4 % en une seule séance, sa pire depuis le krach de 1987, propulsé l'indice de volatilité VIX au-delà de 65, et entraîné dans sa chute des actifs aussi éloignés que le bitcoin. La Banque des règlements internationaux a consacré un bulletin à cette secousse, dont la leçon tient en une phrase : un débouclage de portage ne reste jamais confiné à son marché d'origine. Nous avons prolongé cette analyse dans notre article sur [le carry trade rattrapé par les taux longs japonais](/posts/carry-trade-yen-la-meche-dans-les-obligations-japonaises/) et celui sur [le risque de débouclage du dollar-yen](/posts/dollar-yen-intervention-risque-carry-2026/).

## Les cadrans à surveiller

Le portage ne prévient pas, mais il laisse des traces. Quatre cadrans permettent d'en jauger la tension.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 300" role="img" aria-label="Les quatre signaux à surveiller pour jauger le risque de débouclage du carry trade" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="300" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Les quatre cadrans du portage</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Les signaux que suit le Yen Carry Monitor de l0g pour jauger le risque de débouclage.</text>
  <line x1="40" y1="78" x2="680" y2="78" stroke="#2a2c33" stroke-width="1"></line>
  <circle cx="48" cy="103" r="5" fill="#5eead4"></circle>
  <text x="64" y="100" fill="#5eead4" font-size="12.5" font-weight="700">Écart de taux</text>
  <text x="64" y="117" fill="#8b909b" font-size="11.5">Large, le portage rémunère ; il se comprime quand les banques centrales convergent.</text>
  <line x1="40" y1="132" x2="680" y2="132" stroke="#2a2c33" stroke-width="1"></line>
  <circle cx="48" cy="157" r="5" fill="#f5b13d"></circle>
  <text x="64" y="154" fill="#f5b13d" font-size="12.5" font-weight="700">Volatilité FX implicite</text>
  <text x="64" y="171" fill="#8b909b" font-size="11.5">Basse, le trade paraît sûr ; un pic soudain force les débouclages.</text>
  <line x1="40" y1="186" x2="680" y2="186" stroke="#2a2c33" stroke-width="1"></line>
  <circle cx="48" cy="211" r="5" fill="#7aa2f7"></circle>
  <text x="64" y="208" fill="#7aa2f7" font-size="12.5" font-weight="700">Positionnement CFTC</text>
  <text x="64" y="225" fill="#8b909b" font-size="11.5">Un consensus vendeur de yen extrême signale un trade encombré, donc fragile.</text>
  <line x1="40" y1="240" x2="680" y2="240" stroke="#2a2c33" stroke-width="1"></line>
  <circle cx="48" cy="265" r="5" fill="#ff4d87"></circle>
  <text x="64" y="262" fill="#ff4d87" font-size="12.5" font-weight="700">Change contre seuils</text>
  <text x="64" y="279" fill="#8b909b" font-size="11.5">La proximité d'une ligne d'intervention peut déclencher un retournement.</text>
</svg>
<figcaption>Écart de taux, volatilité des changes, positionnement spéculatif et proximité des seuils d'intervention : lus ensemble, ces quatre cadrans disent si le portage dort tranquille ou s'il approche du point de rupture. Ils alimentent le <strong>Yen Carry Monitor</strong> de l0g.</figcaption>
</figure>

Le premier est l'écart de taux : c'est lui qui rémunère le trade, et sa compression, quand la banque centrale de financement resserre ou que les autres assouplissent, en réduit l'attrait. Le deuxième est la volatilité implicite des changes : basse, elle endort ; un pic la réveille et déclenche les ventes. Le troisième est le positionnement spéculatif, que publie chaque semaine la [CFTC](/glossaire/cftc/) dans son rapport COT : une position courte extrême sur le yen trahit un trade surpeuplé, donc vulnérable au moindre retournement. Le quatrième est le niveau de change lui-même rapporté aux seuils où une [intervention de change](/glossaire/intervention-de-change/) devient probable, car cette intervention peut être l'étincelle du débouclage. Le [Yen Carry Monitor](/methodologie/yen-carry/) de l0g agrège précisément ces signaux.

## Lire le portage en pratique

Le carry trade n'est pas une curiosité de salle de marché, c'est une force structurante. Bien lu, il éclaire trois choses. Il explique pourquoi une devise peut rester faible longtemps sans raison apparente : parce qu'elle sert de financement à la planète. Il rappelle qu'un marché calme n'est pas un marché sûr, et que la volatilité la plus basse précède souvent la secousse la plus violente, car elle attire le levier qui la rendra brutale. Et il relie des marchés que l'on croit séparés : le jour où le yen se retourne, les actions japonaises, les émergents et la crypto peuvent tomber ensemble, non par contagion fondamentale mais par nécessité de liquidité.

Le suivre suppose donc de regarder au-delà du seul écart de taux qui le nourrit, vers les conditions qui le rendent soutenable ou explosif : la volatilité, le levier, le positionnement. Le portage prospère dans l'ennui et meurt dans la panique. Toute la difficulté, pour qui l'observe, est de reconnaître le moment où l'ennui devient complaisance.

## Sources et pour aller plus loin

- [Banque des règlements internationaux, Bulletin no 90, « The market turbulence and carry trade unwind of August 2024 »](https://www.bis.org/publ/bisbull90.pdf) : anatomie du débouclage du 5 août 2024.
- [Bank of Japan, décisions de politique monétaire](https://www.boj.or.jp/en/mopo/mpmdeci/index.htm/) : trajectoire des taux japonais, socle du portage yen.
- [CFTC, Commitments of Traders](https://www.cftc.gov/MarketReports/CommitmentsofTraders/index.htm) : positionnement spéculatif sur le yen et les devises.
- l0g, [Carry trade yen : la mèche est dans les obligations japonaises](/posts/carry-trade-yen-la-meche-dans-les-obligations-japonaises/) et [Dollar-yen : le risque du débouclage](/posts/dollar-yen-intervention-risque-carry-2026/).
- Guides liés : [Lire la volatilité VIX et MOVE](/guides/lire-la-volatilite-vix-move/), [Lire le COT de la CFTC](/guides/lire-cot-cftc/) et [Lire le dollar : DXY et cross-currency basis](/guides/lire-le-dollar-dxy-cross-currency-basis/).
</content>
