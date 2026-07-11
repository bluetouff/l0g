---
title: "Lire les swaps de taux : IRS, OIS et swap spread"
description: "Guide de référence sur les swaps de taux d'intérêt : la mécanique de l'échange fixe contre variable sur un notionnel, le taux de swap et sa courbe, l'OIS comme lecture des paris sur la banque centrale, la bascule de LIBOR vers SOFR, le swap spread et son signe qui s'inverse sur les longues maturités, le rôle de la compensation et des marges, et la spirale LDI britannique de 2022 comme cas d'école. Le plus grand marché de dérivés du monde, décodé."
summary: "Un swap de taux échange des flux d'intérêts sur un capital de référence, le notionnel : une partie paie un taux fixe, l'autre un taux variable indexé sur le SOFR. C'est l'outil central de couverture du risque de taux et le plus grand marché de dérivés du monde. Le lire suppose de comprendre le taux de swap et sa courbe, l'OIS qui reflète la trajectoire anticipée de la banque centrale, la bascule de LIBOR vers SOFR, le swap spread contre le Treasury, et la mécanique de marge qui, lors de la crise LDI britannique de 2022, a transformé un choc de taux en ventes forcées de dette souveraine."
pubDate: 2026-07-11T09:00:00+02:00
updatedDate: 2026-07-11T09:00:00+02:00
tags: ["taux", "dérivés", "marchés", "banques centrales"]
category: marches
draft: false
---

*C'est le plus grand marché du monde, et presque personne n'en parle. Sous chaque crédit immobilier à taux fixe, chaque emprunt d'entreprise, chaque promesse de retraite, il y a un swap de taux qui a servi à transformer un risque en un autre. Des centaines de milliers de milliards de dollars de notionnel circulent ainsi, invisibles, jusqu'au jour où ils cassent et emportent avec eux le marché de la dette souveraine, comme au Royaume-Uni en 2022. Ce guide démonte la mécanique de ces contrats, de l'échange le plus simple aux signaux qu'ils envoient.*

## Un swap de taux, en une transaction

Un [swap de taux](/glossaire/swap-de-taux/) est un accord par lequel deux parties s'échangent des flux d'intérêts calculés sur un même montant de référence, le [notionnel](/glossaire/notionnel/). L'une paie un taux fixe, décidé au départ ; l'autre paie un taux variable, recalculé à chaque période sur un taux de marché comme le SOFR. Le point contre-intuitif est que le capital notionnel n'est jamais échangé : seuls les intérêts circulent, et le plus souvent on ne règle que la différence nette entre les deux jambes.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 300" role="img" aria-label="Mécanique d'un swap de taux, échange de flux fixe contre variable" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="300" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Un swap de taux : échanger fixe contre variable</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Deux parties s'échangent des flux d'intérêts sur un même montant de référence.</text>
  <rect x="50" y="120" width="210" height="80" rx="6" fill="none" stroke="#5eead4" stroke-width="1.5"></rect>
  <text x="155" y="152" fill="#5eead4" font-size="14" font-weight="700" text-anchor="middle">Partie A</text>
  <text x="155" y="174" fill="#d6d9df" font-size="11.5" text-anchor="middle">paie le taux fixe</text>
  <rect x="460" y="120" width="210" height="80" rx="6" fill="none" stroke="#f5b13d" stroke-width="1.5"></rect>
  <text x="565" y="152" fill="#f5b13d" font-size="14" font-weight="700" text-anchor="middle">Partie B</text>
  <text x="565" y="174" fill="#d6d9df" font-size="11.5" text-anchor="middle">paie le taux variable</text>
  <line x1="260" y1="145" x2="460" y2="145" stroke="#5eead4" stroke-width="2"></line>
  <polygon points="460,145 450,140 450,150" fill="#5eead4"></polygon>
  <text x="360" y="137" fill="#5eead4" font-size="11" font-weight="700" text-anchor="middle">taux fixe (ex. 4 %)</text>
  <line x1="460" y1="178" x2="260" y2="178" stroke="#f5b13d" stroke-width="2"></line>
  <polygon points="260,178 270,173 270,183" fill="#f5b13d"></polygon>
  <text x="360" y="196" fill="#f5b13d" font-size="11" font-weight="700" text-anchor="middle">taux variable (SOFR)</text>
  <text x="360" y="248" fill="#8b909b" font-size="11.5" text-anchor="middle">Le capital notionnel n'est jamais échangé : seuls les intérêts le sont,</text>
  <text x="360" y="266" fill="#8b909b" font-size="11.5" text-anchor="middle">et l'on ne règle en général que la différence nette entre les deux jambes.</text>
</svg>
<figcaption>La <strong>partie A</strong> verse un taux fixe et reçoit un taux variable ; la <strong>partie B</strong> fait l'inverse. Celui qui paie le fixe est dit « payeur » : il se protège contre une hausse des taux. Le notionnel sert seulement de base de calcul.</figcaption>
</figure>

À quoi cela sert-il ? À transformer une exposition. Une entreprise endettée à taux variable, qui craint une hausse des taux, paie le fixe et reçoit le variable : elle fige ainsi son coût de financement. Un investisseur qui anticipe une baisse fait l'inverse. Le swap ne fait pas disparaître le risque de taux, il le transfère à celui qui veut bien le porter. Multipliée par l'économie entière, cette redistribution fait des swaps l'outil de gestion du risque de taux le plus répandu, et le plus gros marché de dérivés de la planète.

## Le taux de swap et sa courbe

Comment fixe-t-on le taux fixe d'un swap ? À un niveau tel que, au départ, le contrat ne vaut rien pour aucune des deux parties : c'est le taux de swap, celui qui égalise la valeur attendue des flux fixes et variables. Il incorpore donc, par construction, la trajectoire que le marché anticipe pour le taux variable sur toute la durée du contrat. Un taux de swap à dix ans résume en un chiffre ce que le marché pense des taux courts pour la décennie à venir.

En reliant les taux de swap de toutes les maturités, on obtient la courbe des swaps, un étalon parallèle à celui des emprunts d'État. Les deux courbes se suivent de près, mais l'écart entre elles, on y reviendra, porte une information précieuse. Pour les banques et les entreprises, la courbe des swaps est souvent la référence de tarification la plus directe, car elle reflète le coût de couverture réel plutôt que le rendement d'un titre particulier.

## OIS : le taux sans risque et les paris sur la banque centrale

Une famille de swaps mérite une attention spéciale, l'[OIS](/glossaire/ois/), pour Overnight Index Swap. Sa jambe variable n'est pas un taux à trois mois, mais le taux au jour le jour composé sur la période, le SOFR aux États-Unis. Comme ce taux au jour le jour suit de très près le taux directeur de la banque centrale, la cotation d'un OIS révèle directement ce que le marché anticipe de la politique monétaire. Lire la courbe OIS, c'est lire les paris sur les hausses et baisses de taux à venir, réunion de banque centrale par réunion.

L'OIS joue un second rôle, plus technique mais fondamental : il sert de taux « sans risque » pour actualiser les flux futurs des dérivés. Depuis la crise de 2008, qui a montré que les banques n'étaient pas sans risque entre elles, le marché a abandonné le LIBOR au profit de l'actualisation OIS. C'est une plomberie invisible, mais elle sous-tend la valorisation de milliers de milliards de contrats.

## De LIBOR à SOFR : la grande bascule

Pendant des décennies, la jambe variable des swaps s'indexait sur le [LIBOR](/glossaire/libor/), un taux interbancaire calculé à partir de déclarations de banques. Le scandale de sa manipulation, révélé après 2008, a scellé son sort. Pour le dollar, le LIBOR a cessé d'être publié fin juin 2023, remplacé par le [SOFR](/glossaire/sofr/), un taux adossé à des transactions réelles de pension livrée sur Treasuries, donc bien plus difficile à truquer. Nous détaillons sa fabrication dans notre [guide du marché du repo et du SOFR](/guides/lire-le-marche-du-repo-sofr/).

La bascule n'est pas qu'un changement de nom. Le LIBOR incorporait une prime de risque bancaire et existait pour plusieurs maturités ; le SOFR est un taux au jour le jour, garanti, sans prime de crédit. Tout l'édifice des swaps a dû être reconstruit sur cette nouvelle fondation, et des instruments autrefois courants, comme les accords de taux futurs, ont quasiment disparu dans le monde post-LIBOR. C'est l'une des refontes de marché les plus vastes jamais menées, et elle s'est faite presque sans heurt.

## Le swap spread : swap contre Treasury

Revenons à l'écart entre la courbe des swaps et celle des emprunts d'État. Ce [swap spread](/glossaire/swap-spread/) est la différence entre le taux de swap et le rendement du Treasury de même maturité. Longtemps positif, il traduisait une prime logique : un swap avec une banque est réputé un peu plus risqué qu'un titre d'État. Depuis 2015, pourtant, le swap spread des longues maturités est passé en territoire négatif, une anomalie apparente où le taux de swap est inférieur au rendement de l'État.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 300" role="img" aria-label="Le swap spread et son signe qui s'inverse selon la maturité" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="300" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Le swap spread, et son signe qui s'inverse</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Écart entre le taux de swap et le rendement du Treasury de même maturité.</text>
  <rect x="30" y="80" width="320" height="180" rx="6" fill="none" stroke="#5eead4" stroke-width="1.5"></rect>
  <text x="190" y="106" fill="#5eead4" font-size="13" font-weight="700" text-anchor="middle">Maturités courtes</text>
  <rect x="70" y="150" width="90" height="70" fill="#5eead4" opacity="0.85"></rect>
  <text x="115" y="240" fill="#d6d9df" font-size="11" text-anchor="middle">swap</text>
  <rect x="220" y="168" width="90" height="52" fill="#8b909b" opacity="0.7"></rect>
  <text x="265" y="240" fill="#d6d9df" font-size="11" text-anchor="middle">Treasury</text>
  <text x="190" y="132" fill="#5eead4" font-size="11" text-anchor="middle">spread positif : le swap paie une prime</text>
  <rect x="370" y="80" width="320" height="180" rx="6" fill="none" stroke="#ff4d87" stroke-width="1.5"></rect>
  <text x="530" y="106" fill="#ff4d87" font-size="13" font-weight="700" text-anchor="middle">Maturités longues</text>
  <rect x="410" y="168" width="90" height="52" fill="#5eead4" opacity="0.85"></rect>
  <text x="455" y="240" fill="#d6d9df" font-size="11" text-anchor="middle">swap</text>
  <rect x="560" y="150" width="90" height="70" fill="#8b909b" opacity="0.7"></rect>
  <text x="605" y="240" fill="#d6d9df" font-size="11" text-anchor="middle">Treasury</text>
  <text x="530" y="132" fill="#ff4d87" font-size="11" text-anchor="middle">spread négatif depuis 2015</text>
  <text x="32" y="286" fill="#8b909b" font-size="11">Cause : le coût de bilan et les contraintes de levier des banques renchérissent la détention de Treasuries.</text>
</svg>
<figcaption>Sur les <strong>courtes maturités</strong>, le taux de swap dépasse le rendement du Treasury, un spread positif classique. Sur les <strong>longues</strong>, le rapport s'inverse depuis 2015 : détenir un Treasury coûte du bilan aux banques, ce qui déprime son prix face au swap. Le signe du spread est devenu un thermomètre de contraintes réglementaires.</figcaption>
</figure>

Cette inversion n'est pas une erreur de marché, c'est un signal. Détenir un Treasury physique consomme du bilan et du capital réglementaire pour une banque, alors qu'un swap, hors bilan, n'en consomme presque pas. Quand la contrainte de bilan se resserre, les investisseurs préfèrent l'exposition synthétique du swap au titre physique, ce qui pousse le taux de swap sous le rendement de l'État. Le swap spread est ainsi devenu un baromètre des tensions de bilan et de la réglementation bancaire, autant que du risque de crédit. Son resserrement ou son écartement brutal peut aussi trahir le débouclage d'un arbitrage à levier, comme les quelque 60 milliards de dollars de positions dénouées en avril 2025, un épisode que nous avons relié au [basis trade dans notre article dédié](/posts/basis-trade-fed-radiographie-pari-record/).

## Compensation et marges : la sécurité qui peut mordre

Après 2008, les régulateurs ont voulu réduire le risque que le défaut d'une contrepartie sur un swap ne se propage. La réponse a été la compensation centrale : la plupart des swaps standardisés passent désormais par une chambre de compensation, une [contrepartie centrale](/glossaire/ccp/) qui s'interpose entre les deux parties et garantit la bonne fin des flux. En échange, elle exige des marges : une marge initiale déposée en garantie, et une marge de variation réévaluée chaque jour selon les mouvements de marché.

Ce dispositif rend le système plus sûr en temps normal, mais il introduit un canal de fragilité. Quand les taux bougent violemment, les appels de marge de variation explosent, et les acteurs doivent trouver du cash immédiatement pour y répondre. S'ils n'en ont pas sous la main, ils vendent des actifs, souvent les plus liquides, ce qui peut amplifier le choc initial. La marge protège contre le risque de contrepartie, mais elle transmet le risque de liquidité. C'est exactement l'engrenage qui a failli emporter le marché de la dette britannique.

## Quand les swaps cassent : la spirale LDI britannique

En 2022, les fonds de pension britanniques pratiquaient massivement l'investissement guidé par le passif, ou [LDI](/glossaire/ldi/) : pour couvrir leurs engagements de très long terme, ils détenaient des gilts et des swaps de taux à effet de levier. Tant que les taux montaient lentement, tout allait bien. Le 23 septembre 2022, un budget non financé a fait s'envoler les rendements des gilts à une vitesse inédite.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 320" role="img" aria-label="La spirale de la crise LDI britannique de 2022" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="320" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">La spirale LDI de 2022</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Comment un choc de taux se transforme en ventes forcées de dette souveraine.</text>
  <rect x="250" y="80" width="220" height="46" rx="6" fill="none" stroke="#ff4d87" stroke-width="1.5"></rect>
  <text x="360" y="101" fill="#ff4d87" font-size="12" font-weight="700" text-anchor="middle">1. Les rendements des gilts</text>
  <text x="360" y="117" fill="#ff4d87" font-size="12" font-weight="700" text-anchor="middle">s'envolent</text>
  <rect x="490" y="150" width="200" height="46" rx="6" fill="none" stroke="#f5b13d" stroke-width="1.5"></rect>
  <text x="590" y="171" fill="#f5b13d" font-size="12" font-weight="700" text-anchor="middle">2. Appels de marge sur</text>
  <text x="590" y="187" fill="#f5b13d" font-size="12" font-weight="700" text-anchor="middle">les swaps et le repo</text>
  <rect x="250" y="220" width="220" height="46" rx="6" fill="none" stroke="#7aa2f7" stroke-width="1.5"></rect>
  <text x="360" y="241" fill="#7aa2f7" font-size="12" font-weight="700" text-anchor="middle">3. Ventes forcées de gilts</text>
  <text x="360" y="257" fill="#7aa2f7" font-size="12" font-weight="700" text-anchor="middle">pour lever du cash</text>
  <rect x="30" y="150" width="200" height="46" rx="6" fill="none" stroke="#8b909b" stroke-width="1.5"></rect>
  <text x="130" y="171" fill="#d6d9df" font-size="12" font-weight="700" text-anchor="middle">4. Les rendements</text>
  <text x="130" y="187" fill="#d6d9df" font-size="12" font-weight="700" text-anchor="middle">montent encore</text>
  <line x1="470" y1="110" x2="500" y2="150" stroke="#5eead4" stroke-width="1.5"></line>
  <polygon points="500,150 489,148 496,141" fill="#5eead4"></polygon>
  <line x1="560" y1="196" x2="470" y2="235" stroke="#5eead4" stroke-width="1.5"></line>
  <polygon points="470,235 481,234 476,226" fill="#5eead4"></polygon>
  <line x1="250" y1="243" x2="180" y2="196" stroke="#5eead4" stroke-width="1.5"></line>
  <polygon points="180,196 191,199 184,205" fill="#5eead4"></polygon>
  <line x1="180" y1="150" x2="250" y2="110" stroke="#5eead4" stroke-width="1.5"></line>
  <polygon points="250,110 239,111 244,119" fill="#5eead4"></polygon>
  <text x="360" y="300" fill="#8b909b" font-size="11" text-anchor="middle">Rompu le 28 septembre 2022 par la Banque d'Angleterre, qui rachète des gilts en urgence. Source : BoE.</text>
</svg>
<figcaption>Chaque hausse de rendement déclenchait des appels de marge, qui forçaient des ventes de gilts, qui poussaient les rendements plus haut encore. La <strong>Banque d'Angleterre</strong> a brisé la boucle le 28 septembre 2022 par un filet de rachats allant jusqu'à 65 milliards de livres. Source : BoE.</figcaption>
</figure>

La boucle était enclenchée : hausse des rendements, appels de marge sur les positions à levier, ventes de gilts pour trouver du cash, nouvelle hausse des rendements. En quelques jours, un problème de couverture de retraites menaçait la stabilité financière du pays. La Banque d'Angleterre a dû intervenir en urgence le 28 septembre 2022, en rachetant des gilts pour rompre la spirale. Cet épisode reste le cas d'école du risque que les swaps à levier font peser sur la dette souveraine, un risque que le régulateur britannique cherche encore à désamorcer, comme nous l'avons décrit dans notre article sur [le désendettement du marché des gilts](/posts/gilts-repo-levier-banque-angleterre/).

## Lire les swaps en pratique

Les swaps de taux offrent plusieurs niveaux de lecture. La courbe des swaps donne, mieux qu'aucun autre instrument, le prix auquel le marché échange du risque de taux à chaque maturité. La courbe OIS, plus précisément, se lit comme un sondage permanent sur les décisions de la banque centrale à venir. Le swap spread, lui, ne dit pas tant le risque de crédit que l'état des contraintes de bilan bancaire, et son mouvement brutal peut signaler un débouclage d'arbitrage. Enfin, la mécanique de marge est le canal par lequel un choc de taux se mue en choc de liquidité : surveiller qui est à levier sur des swaps, et avec quel coussin de collatéral, c'est surveiller le prochain accident possible.

Une dernière précaution s'impose contre un chiffre trompeur. La taille du marché des swaps se mesure en notionnel, et ce notionnel atteint des centaines de milliers de milliards de dollars, de quoi affoler. Mais le notionnel n'est jamais échangé : le risque réel ne porte que sur les flux nets et sur la valeur de marché des contrats, une fraction infime de ce montant. Comme souvent en finance, le chiffre le plus gros n'est pas le plus dangereux ; le danger est dans le levier et dans les marges, pas dans le notionnel affiché.

## Sources et pour aller plus loin

- [Banque des règlements internationaux, statistiques sur les dérivés de gré à gré](https://www.bis.org/statistics/derstats.htm) : taille du marché des swaps de taux en notionnel.
- [Banque des règlements internationaux, « Beyond LIBOR: a primer on the new benchmark rates »](https://www.bis.org/publ/qtrpdf/r_qt1903e.pdf) : la transition vers les taux sans risque.
- [Federal Reserve Bank of New York, Secured Overnight Financing Rate (SOFR)](https://www.newyorkfed.org/markets/reference-rates/sofr) : le taux de référence des swaps en dollars.
- [Bank of England, intervention sur le marché des gilts, 28 septembre 2022](https://www.bankofengland.co.uk/news/2022/september/bank-of-england-announces-gilt-market-operation) : la réponse à la crise LDI.
- l0g, [Gilts : le désendettement avant le prochain accident](/posts/gilts-repo-levier-banque-angleterre/) et [Basis trade : au plus haut selon la Fed, moribond selon le marché](/posts/basis-trade-fed-radiographie-pari-record/).
- Guides liés : [Lire le marché du repo et le SOFR](/guides/lire-le-marche-du-repo-sofr/) et [Lire le marché des Treasuries](/guides/lire-le-marche-des-treasuries/).
</content>
