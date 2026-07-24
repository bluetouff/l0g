---
title: "Lire la solidité d'une banque : capital, liquidité et pertes cachées"
description: "Guide de référence pour juger la solidité d'une banque : la différence entre solvabilité et liquidité, les ratios de fonds propres (CET1, ratio de levier) et de liquidité (LCR, NSFR), le piège des pertes latentes dissimulées en portefeuille détenu jusqu'à l'échéance, la fragilité du passif et des dépôts non assurés, et pourquoi une banque rentable peut disparaître en 48 heures. Avec la chute de Silicon Valley Bank comme cas d'école."
summary: "Juger la solidité d'une banque revient à lire deux choses distinctes : sa solvabilité, c'est-à-dire le capital dont elle dispose pour absorber des pertes (ratio CET1, ratio de levier), et sa liquidité, c'est-à-dire sa capacité à honorer des retraits (LCR, NSFR). Une banque peut mourir de l'une ou de l'autre. Le cas de SVB en 2023 montre le piège : des pertes latentes cachées dans un portefeuille détenu jusqu'à l'échéance, un passif concentré en dépôts non assurés, et une ruée numérique fatale en 48 heures. Lire une banque suppose donc de croiser capital, liquidité, pertes latentes et structure des dépôts."
pubDate: 2026-07-10T14:00:00+02:00
updatedDate: 2026-07-10T14:00:00+02:00
tags: ["banques", "régulation", "liquidité", "risque", "marchés"]
category: fed
draft: false
---

*Une banque n'est pas une entreprise comme les autres. Elle peut afficher des profits records le trimestre précédant sa disparition, parce que sa matière première n'est pas un produit mais la confiance, et que la confiance s'évapore en heures, pas en années. En mars 2023, Silicon Valley Bank est passée de « bien capitalisée » à placée sous administration en deux jours. Comprendre comment on en arrive là suppose de savoir lire quatre choses : le capital, la liquidité, les pertes que le bilan ne montre pas, et la nature des dépôts. Ce guide les prend une à une, avec SVB comme fil rouge.*

## Solvabilité et liquidité, deux morts possibles

La première distinction à maîtriser est celle entre solvabilité et liquidité, car une banque peut mourir de chacune, et pour des raisons opposées. La solvabilité est une question de capital : la banque possède-t-elle assez de fonds propres pour absorber ses pertes avant que celles-ci n'engloutissent l'argent des déposants ? La liquidité est une question de trésorerie : peut-elle honorer les retraits qu'on lui demande, ici et maintenant, sans brader ses actifs ?

Les deux ne coïncident pas. Une banque solvable sur le papier, dont l'actif dépasse le passif, peut être tuée par une ruée si elle ne peut mobiliser du cash assez vite. C'est ce qu'on appelle une crise de liquidité, et c'est presque toujours ainsi que meurent les banques : non par un trou comptable constaté à froid, mais par une fuite de financement constatée à chaud. La solvabilité use la banque lentement ; la liquidité la tue vite. Lire une banque, c'est donc surveiller les deux cadrans en même temps.

## Le capital : combien de pertes une banque encaisse

Le capital est le matelas d'absorption des pertes. La mesure reine est le ratio [CET1](/glossaire/cet1/), pour Common Equity Tier 1 : les fonds propres les plus durs, essentiellement les actions ordinaires et les bénéfices non distribués, rapportés aux [actifs pondérés du risque](/glossaire/apr/). Cette pondération est cruciale : un prêt à une entreprise fragile compte davantage qu'une obligation d'État réputée sans risque, si bien que deux banques de même taille de bilan peuvent afficher des besoins en capital très différents.

Les accords de [Bâle III](/glossaire/bale-iii/) empilent plusieurs exigences. Le minimum de CET1 est de 4,5 % des actifs pondérés, auquel s'ajoute un coussin de conservation de 2,5 %, portant le plancher effectif à 7 %. Les banques systémiques ([G-SIB](/glossaire/g-sib/)) subissent une surcharge supplémentaire, de 1 à 3,5 points, et les grandes banques détiennent en pratique un coussin de gestion au-delà.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 320" role="img" aria-label="Les niveaux d'exigence de fonds propres CET1 sous Bâle III" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="320" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">L'échelle du capital, en pourcentage des actifs pondérés</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Exigences de CET1 sous Bâle III, du minimum au niveau réellement détenu.</text>
  <text x="40" y="88" fill="#d6d9df" font-size="12">Minimum CET1</text>
  <rect x="40" y="98" width="600" height="20" fill="#2a2c33"></rect>
  <rect x="40" y="98" width="193" height="20" fill="#5eead4" opacity="0.9"></rect>
  <text x="241" y="113" fill="#5eead4" font-size="11" font-weight="700">4,5 %</text>
  <text x="40" y="136" fill="#d6d9df" font-size="12">+ coussin de conservation</text>
  <rect x="40" y="146" width="600" height="20" fill="#2a2c33"></rect>
  <rect x="40" y="146" width="300" height="20" fill="#7aa2f7" opacity="0.9"></rect>
  <text x="348" y="161" fill="#7aa2f7" font-size="11" font-weight="700">7,0 %</text>
  <text x="40" y="184" fill="#d6d9df" font-size="12">+ surcharge systémique (G-SIB)</text>
  <rect x="40" y="194" width="600" height="20" fill="#2a2c33"></rect>
  <rect x="40" y="194" width="450" height="20" fill="#f5b13d" opacity="0.9"></rect>
  <text x="498" y="209" fill="#f5b13d" font-size="11" font-weight="700">jusqu'à ~10,5 %</text>
  <text x="40" y="232" fill="#d6d9df" font-size="12">Niveau détenu par les grandes banques</text>
  <rect x="40" y="242" width="600" height="20" fill="#2a2c33"></rect>
  <rect x="40" y="242" width="536" height="20" fill="#8b909b" opacity="0.7"></rect>
  <text x="584" y="257" fill="#8b909b" font-size="11" font-weight="700">~12-13 %</text>
  <text x="32" y="300" fill="#8b909b" font-size="11">Sources : Comité de Bâle, Réserve fédérale. Surcharge G-SIB de 1 à 3,5 points selon la banque.</text>
</svg>
<figcaption>Du minimum de <strong>4,5 %</strong> au plancher effectif de <strong>7 %</strong> une fois le coussin de conservation ajouté, jusqu'à <strong>10,5 %</strong> pour les banques systémiques. Les grandes banques détiennent en pratique un matelas supplémentaire. Sources : Comité de Bâle, Fed.</figcaption>
</figure>

Un second garde-fou complète le dispositif, le [ratio de levier](/glossaire/ratio-de-levier/). Il rapporte les fonds propres au total des expositions sans les pondérer par le risque, et empêche ainsi une banque de paraître solide en ne détenant que des actifs jugés « sans risque » par les modèles. Une banque bien notée sur le CET1 mais faible sur le levier détient peu de capital rapporté à sa taille brute : le double regard est indispensable.

## La liquidité : tenir le choc d'une ruée

Le capital ne sert à rien si la banque ne peut pas payer ses déposants demain matin. C'est l'objet des ratios de liquidité, eux aussi issus de Bâle III. Le [LCR](/glossaire/lcr/), ou Liquidity Coverage Ratio, exige qu'une banque détienne assez d'[actifs liquides de haute qualité](/glossaire/hqla/), réserves à la banque centrale et Treasuries en tête, pour couvrir ses sorties nettes de trésorerie dans un scénario de stress de trente jours. Il doit rester au-dessus de 100 %. Le [NSFR](/glossaire/nsfr/) prolonge la logique sur un an : il vérifie que les actifs peu liquides sont adossés à des ressources stables, et non à des financements de gros qui peuvent s'évaporer.

Ces ratios ont une limite, révélée par 2023 : ils raisonnent sur un stress de trente jours et sur des hypothèses de fuite calibrées avant l'ère des applications bancaires. Une ruée numérique, où des milliards partent en quelques heures d'un simple glissement de doigt, va plus vite que ce que le LCR anticipait. Le régulateur en a tiré les leçons, comme nous l'avons détaillé dans notre article sur [la réforme de la liquidité des banques régionales](/posts/banques-regionales-us-liquidite-lcr/).

## Le piège des pertes latentes : HTM, AFS et AOCI

Voici le mécanisme le plus subtil, et le plus dangereux. Quand une banque achète des obligations et que les taux d'intérêt montent, la valeur de marché de ces obligations baisse. Mais que cette baisse apparaisse ou non dans ses comptes dépend d'un choix comptable. Les titres classés « disponibles à la vente » ([AFS](/glossaire/htm-afs/)) sont réévalués au prix de marché, et leurs moins-values transitent par un poste des fonds propres appelé [AOCI](/glossaire/aoci/). Les titres classés « détenus jusqu'à l'échéance » ([HTM](/glossaire/htm-afs/)) restent inscrits au coût d'achat : leur perte latente n'apparaît nulle part au bilan, tant que la banque ne les vend pas.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 300" role="img" aria-label="Pertes latentes dissimulées dans un portefeuille détenu jusqu'à l'échéance" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="300" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Les pertes qui ne se voient pas</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Titres obligataires d'une banque après une hausse des taux. Le cas SVB, fin 2022.</text>
  <rect x="150" y="95" width="130" height="150" fill="#5eead4" opacity="0.85"></rect>
  <text x="215" y="264" fill="#d6d9df" font-size="12" text-anchor="middle">Valeur comptable</text>
  <text x="215" y="280" fill="#8b909b" font-size="11" text-anchor="middle">(HTM, au coût)</text>
  <rect x="440" y="145" width="130" height="100" fill="#f5b13d" opacity="0.85"></rect>
  <text x="505" y="264" fill="#d6d9df" font-size="12" text-anchor="middle">Valeur de marché</text>
  <text x="505" y="280" fill="#8b909b" font-size="11" text-anchor="middle">(prix réel des titres)</text>
  <line x1="290" y1="95" x2="430" y2="95" stroke="#ff4d87" stroke-width="1.5" stroke-dasharray="4 3"></line>
  <line x1="290" y1="145" x2="430" y2="145" stroke="#ff4d87" stroke-width="1.5" stroke-dasharray="4 3"></line>
  <text x="360" y="128" fill="#ff4d87" font-size="12" font-weight="700" text-anchor="middle">pertes latentes</text>
  <text x="360" y="200" fill="#8b909b" font-size="11" text-anchor="middle">~15 Md$</text>
  <text x="360" y="216" fill="#8b909b" font-size="11" text-anchor="middle">proches des</text>
  <text x="360" y="232" fill="#8b909b" font-size="11" text-anchor="middle">fonds propres</text>
  <text x="32" y="294" fill="#8b909b" font-size="11" textLength="682" lengthAdjust="spacingAndGlyphs">En HTM, l'écart reste invisible au bilan, jusqu'à ce qu'une vente forcée le révèle. Source : Réserve fédérale.</text>
</svg>
<figcaption>Le portefeuille reste inscrit à sa <strong>valeur comptable</strong>, bien au-dessus de sa <strong>valeur de marché</strong>. L'écart, les pertes latentes, ne pèse sur les fonds propres qu'au moment d'une vente. Chez SVB, il avoisinait <strong>15 milliards de dollars</strong>, l'ordre de grandeur de ses fonds propres. Source : Réserve fédérale.</figcaption>
</figure>

Ce traitement crée une bombe à retardement. Une banque peut afficher un CET1 confortable tout en portant des pertes latentes qui, une fois matérialisées, effaceraient une bonne part de ses fonds propres. Une dérogation américaine permettait de surcroît aux banques de taille moyenne d'exclure l'AOCI de leur CET1, gonflant leur solvabilité apparente. La réforme dite « Bâle III endgame », re-proposée en mars 2026, corrige précisément ce point en imposant à un plus grand nombre de banques d'intégrer l'AOCI, avec une transition de cinq ans. Quand vous lisez une banque, la question à poser n'est pas seulement « quel est son CET1 », mais « quel serait son CET1 si ses titres étaient tous valorisés au marché ».

## Le passif : d'où vient l'argent, et à quelle vitesse il part

On regarde souvent l'actif d'une banque, ses prêts et ses titres. Sa vulnérabilité se loge pourtant à droite du bilan, dans son passif, c'est-à-dire dans la nature de son financement. Tous les dépôts ne se valent pas. Un dépôt garanti par l'assurance fédérale, sous le plafond de 250 000 dollars, est stable : son titulaire n'a aucune raison de fuir, puisqu'il est protégé même en cas de faillite. Un dépôt non assuré, au-dessus de ce plafond, est volatil : au premier doute, son titulaire a tout intérêt à partir le premier.

La proportion de dépôts non assurés est donc un indicateur de fragilité de premier ordre, tout comme leur concentration. Une banque dont les déposants sont peu nombreux, connectés et semblables, comme l'étaient les start-up et fonds de capital-risque de SVB, subit un risque de ruée grégaire : ils entendent la même rumeur, tirent la même conclusion et fuient au même instant. À l'inverse, une banque de détail aux millions de petits déposants garantis dispose d'un financement bien plus collant. Lire le passif, c'est mesurer non seulement combien la banque doit, mais à quelle vitesse cet argent peut partir.

## Le cas d'école : Silicon Valley Bank

Silicon Valley Bank réunissait toutes les fragilités en même temps, ce qui en fait le cas d'école parfait. Sur le papier, elle était « bien capitalisée » au sens réglementaire. En réalité, trois failles se cumulaient : un portefeuille obligataire massif porteur d'environ 15 milliards de dollars de pertes latentes en HTM, proches de ses fonds propres ; un passif composé à environ 94 % de dépôts non assurés ; et une base de déposants ultra-concentrée dans l'écosystème technologique, connectée en temps réel.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 300" role="img" aria-label="Les métriques fatales de Silicon Valley Bank en mars 2023" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="300" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Silicon Valley Bank : les métriques fatales</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Une banque « bien capitalisée » sur le papier, morte en 48 heures. Mars 2023.</text>
  <line x1="40" y1="78" x2="680" y2="78" stroke="#2a2c33" stroke-width="1"></line>
  <text x="40" y="108" fill="#d6d9df" font-size="12.5">Dépôts non assurés</text>
  <text x="300" y="112" fill="#ff4d87" font-size="20" font-weight="700">~94 %</text>
  <text x="430" y="108" fill="#8b909b" font-size="11.5">un passif prêt à fuir</text>
  <line x1="40" y1="126" x2="680" y2="126" stroke="#2a2c33" stroke-width="1"></line>
  <text x="40" y="156" fill="#d6d9df" font-size="12.5">Pertes latentes (HTM)</text>
  <text x="300" y="160" fill="#f5b13d" font-size="20" font-weight="700">~15 Md$</text>
  <text x="430" y="156" fill="#8b909b" font-size="11.5">l'ordre de ses fonds propres</text>
  <line x1="40" y1="174" x2="680" y2="174" stroke="#2a2c33" stroke-width="1"></line>
  <text x="40" y="204" fill="#d6d9df" font-size="12.5">Retraits demandés le 9 mars</text>
  <text x="300" y="208" fill="#ff4d87" font-size="20" font-weight="700">&gt; 40 Md$</text>
  <text x="430" y="204" fill="#8b909b" font-size="11.5">et ~100 Md$ le lendemain</text>
  <line x1="40" y1="222" x2="680" y2="222" stroke="#2a2c33" stroke-width="1"></line>
  <text x="40" y="252" fill="#d6d9df" font-size="12.5">Capital réglementaire</text>
  <text x="300" y="256" fill="#7aa2f7" font-size="15" font-weight="700">conforme</text>
  <text x="430" y="252" fill="#8b909b" font-size="11.5">« bien capitalisée » sur le papier</text>
  <text x="32" y="288" fill="#8b909b" font-size="11">Source : Réserve fédérale, rapport de supervision (Barr), 28 avril 2023.</text>
</svg>
<figcaption>Un capital réglementaire conforme n'a rien empêché : <strong>94 %</strong> de dépôts non assurés, <strong>15 milliards</strong> de pertes cachées et <strong>plus de 40 milliards</strong> de retraits en une journée ont suffi. La solvabilité n'a pas sauvé la liquidité. Source : Réserve fédérale.</figcaption>
</figure>

L'enchaînement fut fulgurant. Pour faire face aux premiers retraits, SVB a dû vendre des titres, matérialisant ses pertes latentes et confirmant le doute sur sa solvabilité. La nouvelle s'est propagée en heures dans un milieu hyperconnecté, et le 9 mars 2023, les clients ont demandé le retrait de plus de 40 milliards de dollars en une seule journée, avec quelque 100 milliards supplémentaires attendus le lendemain. Aucune banque ne survit à cela. SVB est tombée le 10 mars, victime non d'un défaut de crédit mais d'une crise de liquidité déclenchée par une faille de solvabilité que son bilan masquait. La Fed a répondu par le [BTFP](/glossaire/btfp/), une facilité prêtant contre les titres valorisés au pair pour neutraliser justement ces pertes latentes.

## Lire une banque en pratique

Juger la solidité d'une banque, c'est donc croiser plusieurs cadrans plutôt que se fier à un seul. Le CET1 dit combien de pertes elle peut absorber, mais il faut le lire net des pertes latentes cachées en HTM, pas seulement tel qu'affiché. Le ratio de levier corrige l'illusion d'un bilan gonflé d'actifs prétendument sans risque. Le LCR et le NSFR disent si elle tient un choc de financement, en gardant à l'esprit qu'une ruée numérique va plus vite que leurs hypothèses. Et la structure du passif, part de dépôts non assurés et concentration de la clientèle, dit à quelle vitesse l'argent peut fuir.

Aucun de ces chiffres ne suffit isolément. Une banque peut être solvable et illiquide, bien capitalisée au sens réglementaire et pourtant fragile parce que ses pertes sont hors bilan et ses déposants nerveux. La solidité d'une banque n'est pas un nombre, c'est la cohérence entre ces cadrans. Et le dernier, le plus difficile à quantifier, reste la confiance : elle ne figure dans aucun ratio, mais c'est toujours elle qui part la première.

## Sources et pour aller plus loin

- [Réserve fédérale, « Review of the Federal Reserve's Supervision and Regulation of Silicon Valley Bank », 28 avril 2023](https://www.federalreserve.gov/publications/files/svb-review-20230428.pdf) : le rapport Barr, chiffres de dépôts non assurés (~94 %) et de retraits.
- [Comité de Bâle sur le contrôle bancaire, cadre de Bâle III](https://www.bis.org/bcbs/basel3.htm) : minimums de fonds propres, LCR et NSFR.
- [Comité de Bâle, rapport sur les turbulences bancaires de 2023](https://www.bis.org/bcbs/publ/d555.pdf) : leçons des faillites de 2023.
- Réserve fédérale, OCC et FDIC, re-proposition du « Bâle III endgame », mars 2026 : intégration élargie de l'AOCI dans le CET1.
- l0g, [Banques régionales américaines : de la panique de 2023 à la réforme de la liquidité](/posts/banques-regionales-us-liquidite-lcr/).
- Guides liés : [Lire la liquidité : réserves, TGA, RRP](/guides/liquidite-tresor-dts-tga-rrp/) et [Lire le H.4.1 : le bilan de la Fed](/guides/lire-h41-bilan-fed/).
</content>
