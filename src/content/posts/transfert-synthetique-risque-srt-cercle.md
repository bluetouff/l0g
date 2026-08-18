---
title: "Le risque qui tourne en rond"
description: "Les banques européennes utilisent les transferts synthétiques de risque pour alléger le capital associé à des portefeuilles qui restent à leur bilan. Le marché grossit vite. La BCE et la BRI surveillent désormais une question moins visible : qui finance les investisseurs qui absorbent ce risque, et jusqu'où le transfert reste-t-il réel à l'échelle du système ?"
pubDate: 2026-07-28T14:13:00+02:00
updatedDate: 2026-08-18T18:38:00+02:00
tags: ["risque", "banques", "titrisation", "crédit privé", "régulation", "Europe"]
draft: false
---

*Une banque peut garder un prêt à son bilan tout en transférant une partie de son risque de crédit à un investisseur. Si le superviseur reconnaît que ce transfert est suffisamment important, les exigences de fonds propres associées peuvent baisser. La mécanique est légitime, surveillée et, à ce stade, les autorités ne décrivent pas les SRT comme une menace systémique imminente. Mais le marché européen accélère très vite. Et une seconde question apparaît : lorsque les fonds qui absorbent le risque se financent eux-mêmes auprès de banques, jusqu'où le risque a-t-il réellement quitté le système bancaire ?*

Le détail qui change toute l'histoire tient en une phrase : **le prêt ne bouge pas**.

Dans une titrisation synthétique, la banque conserve l'actif, continue à gérer la relation avec son client et continue à percevoir les flux du prêt. Ce qu'elle transfère est une partie des pertes potentielles attachées à un portefeuille de crédits.

La [Banque des règlements internationaux](https://www.bis.org/publ/qtrpdf/r_qt2603c.htm) décrit trois structures principales : une *credit-linked note* (CLN) émise directement par la banque, une garantie ou un dérivé de crédit conclu avec un investisseur, ou une CLN émise par un véhicule qui fournit lui-même la protection à la banque.

Le terme SRT demande une précision. Dans cet article, il désigne **synthetic risk transfer**. En Europe, les mêmes trois lettres servent aussi à parler de **significant risk transfer**, c'est-à-dire la reconnaissance prudentielle qu'une titrisation, synthétique ou traditionnelle, a effectivement transféré une part suffisamment importante du risque pour justifier un allègement de capital. Les deux notions se recouvrent souvent, mais elles ne sont pas synonymes.

C'est important, parce que la banque ne décide pas seule que le risque a disparu.

Dans l'Union européenne, le superviseur doit reconnaître le transfert significatif avant que l'établissement puisse en tirer le bénéfice prudentiel. La [BCE](https://www.bankingsupervision.europa.eu/press/speeches/date/2026/html/ssm.sp260324~2b54f795e3.en.html) examine la transaction et le dispositif global de gestion des risques de la banque.

## Ce que la banque achète réellement

L'intérêt du montage apparaît immédiatement lorsqu'on regarde les actifs pondérés du risque, les RWA.

La BRI donne un exemple volontairement simplifié. Une banque détient **1 milliard d'euros de prêts** pondérés à 65 %. Avant transfert, cela représente 650 millions d'euros de RWA. Le portefeuille est découpé en trois tranches : 1 % de junior, 7 % de mezzanine et 92 % de senior. La banque conserve la junior et la senior mais protège la tranche mezzanine de 7 % au moyen d'une CLN.

Dans le calcul illustratif de la BRI, les RWA passent alors d'environ **650 à 263 millions d'euros**. Avec une hypothèse de CET1 de 12,5 %, le capital requis passe d'environ **82 à 33 millions d'euros**.

Ce n'est pas un rendement moyen observé sur le marché. Ce n'est pas non plus une création de 49 millions d'euros de capital. C'est un exemple pédagogique qui montre pourquoi une banque peut préférer payer une protection plutôt que vendre les prêts, réduire son bilan ou émettre de nouvelles actions.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 430" role="img" aria-label="Exemple simplifié de transfert synthétique de risque publié par la BRI : portefeuille de 1 milliard d'euros, tranche mezzanine de 7 pour cent protégée, baisse des RWA et du capital requis" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="430" fill="#0c0d10"/>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">1 Md€ de prêts, le même bilan, une autre charge en capital</text>
  <text x="32" y="60" fill="#8b909b" font-size="11">Exemple stylisé de la BRI. Les chiffres illustrent la mécanique, pas une opération moyenne.</text>

  <rect x="36" y="90" width="292" height="210" rx="4" fill="none" stroke="#2a2c33"/>
  <text x="52" y="116" fill="#d6d9df" font-size="12" font-weight="700">Portefeuille de référence : 1 000 M€</text>
  <rect x="52" y="138" width="260" height="28" fill="#ff4d87"/>
  <text x="64" y="157" fill="#0c0d10" font-size="11" font-weight="700">Junior 1 % : conservée</text>
  <rect x="52" y="174" width="260" height="52" fill="#f5b13d"/>
  <text x="64" y="196" fill="#0c0d10" font-size="11" font-weight="700">Mezzanine 7 % : protégée par CLN</text>
  <text x="64" y="214" fill="#0c0d10" font-size="10">risque transféré à l'investisseur</text>
  <rect x="52" y="234" width="260" height="50" fill="#5eead4"/>
  <text x="64" y="256" fill="#0c0d10" font-size="11" font-weight="700">Senior 92 % : conservée</text>
  <text x="64" y="274" fill="#0c0d10" font-size="10">reste au bilan de la banque</text>

  <text x="356" y="112" fill="#8b909b" font-size="11">AVANT SRT</text>
  <text x="356" y="142" fill="#f5f6f8" font-size="28" font-weight="700">650 M€</text>
  <text x="356" y="160" fill="#8b909b" font-size="11">RWA</text>
  <text x="356" y="196" fill="#f5f6f8" font-size="22" font-weight="700">~ 82 M€</text>
  <text x="356" y="214" fill="#8b909b" font-size="11">capital requis à 12,5 %</text>

  <line x1="484" y1="132" x2="544" y2="132" stroke="#7aa2f7" stroke-width="2"/>
  <polygon points="544,132 534,126 534,138" fill="#7aa2f7"/>

  <text x="568" y="112" fill="#8b909b" font-size="11">APRÈS SRT</text>
  <text x="568" y="142" fill="#5eead4" font-size="28" font-weight="700">263 M€</text>
  <text x="568" y="160" fill="#8b909b" font-size="11">RWA</text>
  <text x="568" y="196" fill="#5eead4" font-size="22" font-weight="700">~ 33 M€</text>
  <text x="568" y="214" fill="#8b909b" font-size="11">capital requis à 12,5 %</text>

  <rect x="356" y="248" width="324" height="52" rx="4" fill="#15171c"/>
  <text x="372" y="270" fill="#d6d9df" font-size="11">Le prêt reste au bilan.</text>
  <text x="372" y="288" fill="#d6d9df" font-size="11">La pondération du risque, elle, change.</text>

  <line x1="36" y1="336" x2="684" y2="336" stroke="#2a2c33"/>
  <text x="36" y="362" fill="#f5f6f8" font-size="12" font-weight="700">Ce que l'exemple ne prétend pas mesurer</text>
  <text x="36" y="384" fill="#8b909b" font-size="10">Coût réel de la protection, pertes futures, fiscalité, amortissement, capital redéployé, structure exacte d'une transaction.</text>
  <text x="36" y="412" fill="#8b909b" font-size="9">SOURCE : BRI, The rise and risks of synthetic risk transfers, annexe A, 16 mars 2026.</text>
</svg>
<figcaption>Exemple stylisé publié par la BRI. La baisse du capital requis vient de la modification des RWA après transfert de la tranche mezzanine. Le prêt de référence reste dans le bilan de la banque.</figcaption>
</figure>

Cette optimisation n'est pas automatiquement suspecte. Elle peut réduire une concentration de risque, diversifier les porteurs de pertes et permettre à une banque de conserver une relation de crédit qu'elle ne souhaite pas céder.

La question utile est donc ailleurs : **qui porte les pertes après l'opération, avec quel financement et avec quelle capacité à tenir lorsque le cycle se retourne ?**

## L'Europe a accéléré

Les chiffres européens demandent un peu de discipline, parce que plusieurs grandeurs circulent dans le débat.

En mai 2026, la BCE a indiqué que les **institutions significatives qu'elle supervise** avaient originé en 2025 des titrisations synthétiques portant sur **258 milliards d'euros de portefeuilles sous-jacents**, contre 175 milliards en 2024. La hausse est de **47 % en un an** et de 90 % entre 2022 et 2025.

Dans le même périmètre, le stock d'expositions sous-jacentes est passé de **223 milliards d'euros fin 2022 à 570 milliards fin 2025**.

Ces montants représentent la valeur notionnelle des portefeuilles de référence. **258 milliards d'euros de portefeuille ne signifient pas 258 milliards d'euros de risque effectivement cédé, ni 258 milliards d'euros de CLN émises.** Seules certaines tranches sont protégées.

À l'échelle internationale, la BRI estimait à la fin de 2024 que les portefeuilles de prêts protégés par des SRT approchaient **800 milliards d'euros**. Le Comité de Bâle, avec un périmètre et une méthodologie différents, estimait environ **750 milliards d'euros** d'actifs protégés au Canada, dans la zone euro, aux États-Unis et au Royaume-Uni, soit environ **1,1 % des actifs bancaires** de ces juridictions.

Ces deux chiffres ne doivent pas être additionnés. Leur écart est au contraire instructif : la BRI souligne qu'il n'existe toujours **ni dépôt de données mondial ni reporting réglementaire homogène** couvrant les émissions, le prix et la performance de crédit des SRT entre juridictions.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 410" role="img" aria-label="Croissance des titrisations synthétiques des institutions significatives supervisées par la BCE : 175 milliards d'euros en 2024, 258 milliards en 2025, et stock sous-jacent de 223 à 570 milliards entre 2022 et 2025" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="410" fill="#0c0d10"/>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Le marché synthétique européen change d'échelle</text>
  <text x="32" y="60" fill="#8b909b" font-size="11">Institutions significatives supervisées par la BCE. Montants notionnels des portefeuilles sous-jacents.</text>

  <text x="38" y="102" fill="#d6d9df" font-size="12" font-weight="700">ÉMISSIONS ANNUELLES</text>
  <line x1="38" y1="260" x2="338" y2="260" stroke="#2a2c33"/>
  <rect x="82" y="169" width="84" height="91" fill="#8b909b"/>
  <rect x="210" y="126" width="84" height="134" fill="#ff4d87"/>
  <text x="124" y="158" text-anchor="middle" fill="#d6d9df" font-size="15" font-weight="700">175</text>
  <text x="252" y="115" text-anchor="middle" fill="#ff4d87" font-size="15" font-weight="700">258</text>
  <text x="124" y="282" text-anchor="middle" fill="#8b909b" font-size="11">2024</text>
  <text x="252" y="282" text-anchor="middle" fill="#d6d9df" font-size="11">2025</text>
  <text x="38" y="310" fill="#ff4d87" font-size="13" font-weight="700">+47 % sur un an</text>

  <line x1="360" y1="88" x2="360" y2="330" stroke="#2a2c33"/>

  <text x="390" y="102" fill="#d6d9df" font-size="12" font-weight="700">STOCK SOUS-JACENT</text>
  <text x="390" y="150" fill="#8b909b" font-size="12">fin 2022</text>
  <text x="390" y="180" fill="#f5f6f8" font-size="28" font-weight="700">223 Md€</text>
  <line x1="500" y1="170" x2="556" y2="170" stroke="#7aa2f7" stroke-width="2"/>
  <polygon points="556,170 546,164 546,176" fill="#7aa2f7"/>
  <text x="578" y="150" fill="#8b909b" font-size="12">fin 2025</text>
  <text x="578" y="180" fill="#5eead4" font-size="28" font-weight="700">570</text>
  <text x="578" y="198" fill="#5eead4" font-size="11">Md€</text>

  <rect x="390" y="234" width="286" height="76" rx="4" fill="#15171c"/>
  <text x="406" y="256" fill="#f5b13d" font-size="11" font-weight="700">À ne pas confondre</text>
  <text x="406" y="276" fill="#d6d9df" font-size="10">Portefeuille de référence : pas la tranche transférée</text>
  <text x="406" y="294" fill="#d6d9df" font-size="10">Pas le montant de CLN, pas la perte attendue.</text>

  <line x1="32" y1="346" x2="688" y2="346" stroke="#2a2c33"/>
  <text x="32" y="372" fill="#8b909b" font-size="9">SOURCE : BCE, Pedro Machado, Strengthening the supervisory grip on securitisation, 14 mai 2026.</text>
  <text x="32" y="390" fill="#8b909b" font-size="9">La BCE précise que les chiffres ci-dessus excluent les titrisations traditionnelles.</text>
</svg>
<figcaption>La croissance est rapide, mais les montants doivent être lus correctement : la BCE mesure ici les portefeuilles de référence, pas la taille des tranches de risque effectivement transférées.</figcaption>
</figure>

La BRI apporte un autre repère utile. Dans son échantillon de 44 banques émettrices à fin 2024, les SRT protégeaient en moyenne environ **5 % des prêts**. L'allègement estimé représentait environ **43 points de base de CET1** en moyenne, avec quelques cas au-dessus de 100 points de base.

Le marché est donc devenu important sans être, pour l'instant, dominant dans le bilan bancaire agrégé. Les dix plus gros émetteurs représentaient 64 % du montant en circulation dans l'échantillon de la BRI, et 90 % des actifs protégés étaient des prêts de gros, principalement des crédits aux entreprises.

## La partie réellement intéressante commence chez l'investisseur

Le transfert est économiquement utile si l'investisseur qui prend la tranche est capable d'absorber les pertes.

Les acheteurs sont principalement des acteurs non bancaires : fonds de crédit, gestionnaires d'actifs, hedge funds, fonds de pension, assureurs ou institutions publiques selon les juridictions. Les structures contemporaines sont souvent financées ou collatéralisées à l'avance, ce qui réduit fortement le risque que l'investisseur promette une protection qu'il ne pourrait ensuite pas honorer.

En mai 2026, la BCE indiquait que les protections **non financées** fournies par des contreparties autres que les gouvernements et banques de développement ne représentaient que **11 % des tranches protégées en circulation**. C'est un élément de robustesse qu'une analyse sérieuse doit conserver.

Mais un investisseur peut aussi financer son achat.

Une CLN peut servir de collatéral dans un repo. Le fonds apporte une partie du capital et emprunte le reste à une banque. La BRI rapporte que ces financements sont généralement assortis de décotes élevées, souvent **40 à 60 %**, avec appels de marge quotidiens et possibilités de recours à d'autres actifs du fonds.

Autre précision essentielle : **les données disponibles n'autorisent pas à écrire que les banques financent généralement leurs propres SRT**.

La BRI indique au contraire que la banque qui finance l'investisseur est en général différente de la banque qui a originé la transaction. C'est un système bancaire interconnecté, pas nécessairement une boucle fermée au sein du même établissement.

La distinction change la nature du risque sans le faire disparaître.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 430" role="img" aria-label="Chaîne de transfert synthétique et cercle de risque potentiel : Banque A transfère une tranche à un fonds, Banque B finance le fonds avec la CLN en collatéral, créant un canal de retour du risque vers le secteur bancaire" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="430" fill="#0c0d10"/>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Le risque sort d'une banque. Sort-il du système bancaire ?</text>
  <text x="32" y="60" fill="#8b909b" font-size="11">Le « cercle de risque » décrit par la BRI est un canal potentiel, pas une mesure de l'ensemble du marché.</text>

  <rect x="34" y="102" width="174" height="94" rx="5" fill="#15171c" stroke="#5eead4"/>
  <text x="50" y="128" fill="#5eead4" font-size="12" font-weight="700">BANQUE A</text>
  <text x="50" y="148" fill="#d6d9df" font-size="10">conserve les prêts</text>
  <text x="50" y="165" fill="#d6d9df" font-size="10">transfère une tranche</text>
  <text x="50" y="182" fill="#d6d9df" font-size="10">du risque de crédit</text>

  <rect x="272" y="102" width="176" height="94" rx="5" fill="#15171c" stroke="#f5b13d"/>
  <text x="288" y="128" fill="#f5b13d" font-size="12" font-weight="700">FONDS / NBFI</text>
  <text x="288" y="148" fill="#d6d9df" font-size="10">achète la protection</text>
  <text x="288" y="165" fill="#d6d9df" font-size="10">et porte les pertes</text>
  <text x="288" y="182" fill="#d6d9df" font-size="10">sur la tranche</text>

  <rect x="512" y="102" width="174" height="94" rx="5" fill="#15171c" stroke="#7aa2f7"/>
  <text x="528" y="128" fill="#7aa2f7" font-size="12" font-weight="700">BANQUE B</text>
  <text x="528" y="148" fill="#d6d9df" font-size="10">finance le fonds</text>
  <text x="528" y="165" fill="#d6d9df" font-size="10">par repo / crédit</text>
  <text x="528" y="182" fill="#d6d9df" font-size="10">CLN en collatéral</text>

  <line x1="208" y1="140" x2="272" y2="140" stroke="#ff4d87" stroke-width="2"/>
  <polygon points="272,140 262,134 262,146" fill="#ff4d87"/>
  <text x="216" y="128" fill="#ff4d87" font-size="9">RISQUE</text>

  <line x1="512" y1="168" x2="448" y2="168" stroke="#7aa2f7" stroke-width="2"/>
  <polygon points="448,168 458,162 458,174" fill="#7aa2f7"/>
  <text x="460" y="158" fill="#7aa2f7" font-size="9">FINANCEMENT</text>

  <path d="M600 198 C600 278 500 306 360 306 C220 306 122 270 122 198" fill="none" stroke="#ff4d87" stroke-width="2" stroke-dasharray="6 5"/>
  <polygon points="122,198 116,211 128,211" fill="#ff4d87"/>
  <text x="248" y="290" fill="#ff4d87" font-size="11" font-weight="700">canal de retour potentiel vers le secteur bancaire</text>

  <rect x="34" y="330" width="652" height="58" rx="4" fill="#15171c"/>
  <text x="50" y="351" fill="#d6d9df" font-size="10">Mitigants observés : décotes repo souvent 40-60 %, appels de marge quotidiens,</text>
  <text x="50" y="368" fill="#d6d9df" font-size="10">surcollatéralisation. La BRI juge le levier observé modeste en moyenne.</text>
  <text x="50" y="384" fill="#8b909b" font-size="9">La banque de financement est généralement distincte de la banque qui origine le SRT.</text>

  <text x="34" y="414" fill="#8b909b" font-size="9">SOURCE : BRI, The rise and risks of synthetic risk transfers, sections « Investor leverage » et « Interlinkages », 2026.</text>
</svg>
<figcaption>Le point prudentiel n'est pas qu'une banque reprend mécaniquement le risque qu'elle vient de céder. Le risque est qu'une autre exposition bancaire apparaisse ailleurs dans la chaîne, notamment via le financement de l'investisseur.</figcaption>
</figure>

## Ce que la BCE cherche encore à mesurer

Le 24 mars 2026, Pedro Machado, membre du conseil de surveillance prudentielle de la BCE, a annoncé une **nouvelle enquête auprès d'un large ensemble de banques** sur le financement des investisseurs en SRT. Le périmètre inclut explicitement les financements accordés par des banques significatives à des investisseurs achetant des titrisations originées par d'autres banques.

Deux mois plus tard, la BCE formulait le problème plus directement : les interconnexions entre banques et finance non bancaire se renforcent à mesure que les volumes augmentent, **sans être toujours complètement cartographiées**.

Elle ajoutait que les lacunes et problèmes de qualité des données empêchent encore une évaluation pleinement fiable des risques de contagion, notamment sur les expositions aux investisseurs, la composition de leur base et la performance des portefeuilles après transaction.

C'est ici que se situe le vrai angle de risque.

Le marché n'est pas inconnu des superviseurs. Les transactions sont surveillées. Les mécanismes de protection sont documentés. Mais la vision **transversale**, banque par banque, fonds par fonds, juridiction par juridiction, reste incomplète.

La BRI fait le même diagnostic. Elle parle de **« circles of risk »**, des situations dans lesquelles le risque transféré par une banque à un fonds peut revenir indirectement vers le secteur bancaire parce qu'une autre banque finance l'achat du fonds.

Elle précise immédiatement que les éléments disponibles suggèrent une échelle encore modeste de ces boucles.

C'est cette seconde phrase qui empêche de transformer un sujet sérieux en récit de crise artificiel.

## Une étude de la BCE ajoute trois questions plus difficiles

Un [Working Paper de la BCE publié en mars 2026](https://www.ecb.europa.eu/press/research-publications/working-papers/html/index.en.html), signé Alex Osberghaus et Glenn Schepens, utilise des données transactionnelles de la zone euro pour étudier l'usage des SRT.

Les auteurs trouvent trois résultats qui méritent attention.

Premièrement, les banques ont tendance à transférer les prêts qui coûtent beaucoup de capital relativement à leur risque économique estimé. C'est cohérent avec l'objectif d'optimisation des RWA.

Deuxièmement, leur analyse trouve une baisse de l'intensité du suivi interne des emprunteurs après transfert synthétique du risque.

Troisièmement, les banques sont plus susceptibles de vendre la protection à des investisseurs non bancaires avec lesquels elles entretiennent déjà une relation de crédit.

Ce travail est particulièrement intéressant parce qu'il utilise des données microéconomiques que le public ne possède pas. Mais son statut doit être conservé : **c'est un Working Paper de recherche, pas une position de politique officielle de la BCE**. Ses résultats complètent le diagnostic prudentiel, ils ne permettent pas à eux seuls de conclure à une vulnérabilité systémique.

La BCE elle-même souligne en mars que le levier observé chez ces investisseurs reste modeste en moyenne et que le risque de *round-tripping* à l'échelle du système paraît, pour le moment, contenu.

## Le private credit élargit encore la carte

Les SRT s'inscrivent dans un ensemble beaucoup plus vaste d'interconnexions entre banques et finance non bancaire.

Dans son [Risk Assessment Report de juin 2026](https://www.eba.europa.eu/publications-and-media/publications/risk-assessment-report-june-2026), l'Autorité bancaire européenne estime à près de **150 milliards d'euros** les expositions des banques de l'UE et de l'EEE aux fonds de private credit et aux gestionnaires liés à cette activité en juin 2025. Ces expositions étaient réparties entre 79 banques dans 13 États membres et représentaient en moyenne 0,6 % de leurs actifs.

Ce chiffre ne mesure **pas** le financement des SRT.

Il inclut plusieurs formes d'exposition à l'écosystème du crédit privé et l'EBA précise elle-même qu'il s'agit d'une mesure indicative, contrainte par les seuils de reporting et les données disponibles.

Sa valeur est ailleurs : il montre qu'un fonds qui achète une tranche SRT peut avoir plusieurs autres relations avec les banques. Lignes de crédit, financement collatéralisé, prêts aux mêmes entreprises, financement de véhicules ou de gestionnaires peuvent créer plusieurs chemins de transmission autour d'un même choc.

Le risque systémique dépend donc moins de l'étiquette juridique d'une transaction que de la **somme des dépendances** entre les acteurs.

## Le scénario de stress crédible

Le scénario utile n'est pas « les SRT provoquent la prochaine crise ».

Les sources primaires disponibles au 18 août 2026 ne permettent pas de soutenir cette thèse.

Un scénario plus rigoureux ressemble à ceci :

1. une récession ou un choc sectoriel augmente les défauts dans plusieurs portefeuilles de référence ;
2. les tranches protégées commencent à absorber les pertes prévues par les contrats ;
3. les CLN utilisées comme collatéral peuvent perdre de la valeur ou devenir plus difficiles à évaluer ;
4. les banques qui financent certains investisseurs peuvent demander davantage de collatéral ou réduire leurs lignes ;
5. l'appétit des investisseurs pour de nouveaux SRT peut se contracter ;
6. les banques qui avaient intégré le renouvellement de ces protections dans leur trajectoire de capital doivent alors trouver une autre solution : conserver davantage de RWA, lever du capital, céder des actifs ou ralentir certains nouveaux crédits.

La BRI décrit alors le SRT moins comme le point de départ d'une crise que comme un **amplificateur potentiel** : un mécanisme capable, sous stress, de renforcer simultanément le resserrement du crédit bancaire et les boucles banques-NBFI.

La BCE surveille trois catégories très concrètes : le **rollover risk**, le risque de contrepartie pour les protections non financées et le **flowback risk**, lorsque les exigences de capital sur les tranches senior conservées remontent.

Son constat de mai 2026 reste cependant rassurant : elle ne détecte **aucun mur matériel de maturités**, aucune concentration aiguë de contreparties non financées et aucune vulnérabilité immédiate de *flowback* au niveau du système.

C'est précisément pour cela que le sujet mérite d'être suivi maintenant, avant qu'un stress ne rende la cartographie beaucoup plus coûteuse.

## L'Europe veut en même temps développer la titrisation

Le paradoxe n'est qu'apparent.

La Commission européenne souhaite relancer un marché de la titrisation qu'elle considère comme un outil de partage du risque et de financement de l'économie. Son [paquet de réforme présenté en juin 2025](https://finance.ec.europa.eu/financial-markets/financial-markets-policy/securities-markets/securitisation_en) vise notamment à simplifier certaines obligations et à rendre le traitement prudentiel plus sensible au risque. Le [Conseil a arrêté sa position en décembre 2025](https://www.consilium.europa.eu/en/press/press-releases/2025/12/19/savings-and-investment-union-council-agrees-position-on-revitalising-the-eu-s-securitisation-market/).

La BCE soutient le principe d'un marché de la titrisation robuste, tout en demandant que la simplification ne réduise ni la transparence ni la qualité du transfert de risque.

Depuis janvier 2026, elle applique même une procédure accélérée à certaines opérations SRT simples et standardisées. Au cours des quatre premiers mois de 2026, seules deux opérations avaient utilisé cette voie, toutes deux évaluées en huit jours ouvrés.

L'objectif européen consiste donc à faire grossir un outil que le superviseur juge utile **tout en améliorant la visibilité sur les chaînes qu'il crée**.

Le défi n'est pas d'interdire le transfert du risque. Il est de vérifier qu'un allègement microprudentiel pour une banque ne se transforme pas, par accumulation d'expositions croisées, en angle mort macroprudentiel.

## Ce que nous savons, et ce que nous ne savons pas

À ce stade, plusieurs éléments sont suffisamment documentés pour être affirmés.

Le marché grossit rapidement, surtout en Europe. Les prêts restent au bilan des banques. Une tranche du risque est réellement transférée et, dans la majorité des structures contemporaines, la protection est préfinancée ou collatéralisée. Le capital relief est réel lorsqu'il est reconnu par le superviseur. Des fonds utilisent du financement bancaire pour certaines positions. Les banques et les acheteurs de risque sont interconnectés.

Plusieurs affirmations seraient en revanche excessives.

Les données publiques ne montrent pas que les SRT constituent aujourd'hui une crise en préparation. Elles ne montrent pas non plus que les banques financent généralement leurs propres transferts de risque. Elles ne permettent pas de mesurer précisément la part du risque transféré qui revient indirectement au secteur bancaire. Enfin, les centaines de milliards de portefeuilles « protégés » ne correspondent ni aux pertes attendues ni au montant de capital effectivement placé par les investisseurs.

Cette frontière entre **ce qui est mesuré** et **ce qui reste à cartographier** est probablement le signal le plus important.

Le risque n'a rien de mystérieux. Il change de propriétaire, de forme et parfois de source de financement.

La question est de savoir si, lorsqu'un choc arrive, celui qui s'est engagé à l'absorber possède encore les ressources pour le faire sans solliciter le même système bancaire qui avait voulu s'en délester.

### Méthode et limites

Données arrêtées au **18 août 2026**.

Les montants BCE, BRI et Comité de Bâle ne sont pas additionnés : leurs périmètres, dates et méthodologies diffèrent. Les chiffres de « portefeuilles protégés » ou « titrisés » désignent la valeur des actifs de référence, pas la taille des tranches de risque transférées.

L'article privilégie les publications des superviseurs et organismes publics. Les travaux de recherche sont identifiés comme tels. Les données secondaires ou payantes utilisées dans la version antérieure de cet article n'ont pas été retenues lorsqu'une source primaire permettait d'établir le fait.

### Sources primaires

- [Banque des règlements internationaux, *The rise and risks of synthetic risk transfers*, 16 mars 2026](https://www.bis.org/publ/qtrpdf/r_qt2603c.htm)
- [Comité de Bâle sur le contrôle bancaire, *Synthetic risk transfers*, 17 février 2026](https://www.bis.org/bcbs/publ/d607.htm)
- [BCE, Pedro Machado, *Changing the tune but not the tone: synthetic risk transfers in Europe*, 24 mars 2026](https://www.bankingsupervision.europa.eu/press/speeches/date/2026/html/ssm.sp260324~2b54f795e3.en.html)
- [BCE, Pedro Machado, *Strengthening the supervisory grip on securitisation: reading the data, anticipating the risks*, 14 mai 2026](https://www.bankingsupervision.europa.eu/press/speeches/date/2026/html/ssm.sp260514~4917539c35.en.html)
- [BCE, Working Paper Series No. 3210, *Synthetic, but how much risk transfer?*, 27 mars 2026](https://www.ecb.europa.eu/press/research-publications/working-papers/html/index.en.html)
- [Autorité bancaire européenne, *Risk Assessment Report*, juin 2026](https://www.eba.europa.eu/publications-and-media/publications/risk-assessment-report-june-2026)
- [Commission européenne, dossier « Securitisation »](https://finance.ec.europa.eu/financial-markets/financial-markets-policy/securities-markets/securitisation_en)
- [Conseil de l'Union européenne, position sur la réforme du marché de la titrisation, 19 décembre 2025](https://www.consilium.europa.eu/en/press/press-releases/2025/12/19/savings-and-investment-union-council-agrees-position-on-revitalising-the-eu-s-securitisation-market/)

Pour replacer le sujet dans la migration plus générale du risque de crédit vers les acteurs non bancaires : [La migration du risque de crédit : hors des banques, hors du regard](/posts/migration-risque-credit-hors-du-regard-reglementaire/).
