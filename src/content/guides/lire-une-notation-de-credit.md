---
title: "Lire une notation de crédit : échelles, défaut et le conflit du modèle émetteur-payeur"
description: "Guide de référence sur les notations de crédit : ce qu'une note mesure vraiment (une probabilité de défaut, pas un prix ni une garantie), les échelles de S&P, Moody's et Fitch et la frontière investment grade / high yield, le rôle des agences agréées (NRSRO) et le conflit du modèle émetteur-payeur, les taux de défaut par note et la matrice de transition, la différence entre note publique et note privée, et ce qu'une note ne dit pas. Avec la dette adossée aux GPU et les notations privées des assureurs comme cas d'école."
summary: "Une notation de crédit est une opinion sur la probabilité qu'un emprunteur fasse défaut, exprimée sur une échelle de AAA (le plus sûr) à D (en défaut). La frontière décisive sépare la catégorie investissement (BBB- et au-dessus) du haut rendement en dessous. Trois agences agréées, S&P, Moody's et Fitch, concentrent environ 95 % du marché, sous un modèle émetteur-payeur qui porte un conflit d'intérêts structurel. Les taux de défaut montent fortement à mesure que la note descend. Lire une note suppose de connaître son échelle, sa dynamique (matrice de transition), ses limites, et de distinguer une note publique d'une note privée, souvent plus complaisante."
pubDate: 2026-07-16T18:40:00+02:00
updatedDate: 2026-07-16T18:40:00+02:00
tags: ["crédit", "marchés", "régulation", "risque", "obligations"]
category: marches
draft: false
---

*Une notation de crédit ressemble à une note d'école, et c'est le premier piège. Elle ne dit pas si une obligation est un bon placement, ni si son prix est juste. Elle dit une seule chose, avec une précision volontairement limitée : quelle est la probabilité que l'emprunteur ne rembourse pas. Cette opinion, produite par une poignée d'agences payées par les émetteurs qu'elles notent, gouverne des milliers de milliards d'euros d'allocation réglementée. La comprendre, c'est savoir ce qu'elle mesure, ce qu'elle vaut, et surtout ce qu'elle ne dit pas. Ce guide déroule les échelles, les taux de défaut, le conflit du modèle et la fracture entre note publique et note privée, en prolongement de notre guide sur [les spreads de crédit](/guides/lire-les-spreads-de-credit/).*

## Ce qu'une note mesure, et ce qu'elle n'est pas

Une notation de crédit est une opinion sur la capacité et la volonté d'un emprunteur à honorer sa dette, résumée dans un symbole. Elle porte sur le risque de défaut, parfois complété par une estimation de la perte en cas de défaut. Elle n'est ni un prix, ni une recommandation d'achat, ni une garantie. Une obligation notée AAA peut perdre 30 % de sa valeur si les taux montent, sans qu'aucun défaut ne survienne : la note ne dit rien du risque de marché, seulement du risque de crédit.

Cette distinction est la source des malentendus les plus coûteux. En 2008, des tranches de titrisation notées AAA se sont effondrées, non parce que les agences avaient menti sur le risque de défaut au sens strict, mais parce que le marché avait pris la note pour une garantie de sécurité globale. Lire une note, c'est d'abord la ramener à son périmètre exact : une probabilité de défaut, sur un horizon donné, à la date de l'analyse.

## Les échelles : AAA jusqu'à D, et la frontière décisive

Les trois grandes agences utilisent des échelles parallèles. S&P et Fitch partagent le même alphabet : AAA, puis AA, A, BBB, et ainsi de suite jusqu'à D pour le défaut, avec des crans intermédiaires notés par un plus ou un moins. Moody's utilise une graphie distincte : Aaa, Aa, A, Baa, avec des modificateurs numériques 1, 2, 3.

La frontière qui compte n'est pas en haut de l'échelle, mais en son milieu. Un émetteur est en catégorie [investissement](/glossaire/investment-grade/) tant qu'il est noté BBB- ou mieux chez S&P et Fitch, Baa3 ou mieux chez Moody's. En dessous commence le [haut rendement](/glossaire/high-yield/), aussi appelé spéculatif ou « junk ». Cette ligne n'est pas graduelle : la franchir vers le bas, devenir un « ange déchu », exclut d'un coup l'émetteur de nombreux portefeuilles réglementés contraints à l'investment grade, forçant des ventes et écartant son [spread](/glossaire/spread-de-credit/). Un cran de notation autour de cette frontière pèse donc bien plus qu'un cran ailleurs sur l'échelle.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 340" role="img" aria-label="Échelles de notation de S&P/Fitch et Moody's, et frontière entre investment grade et high yield" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="340" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">L'échelle du crédit et sa ligne de fracture</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">S&P / Fitch à gauche, Moody's à droite. La frontière IG / HY passe à BBB- / Baa3.</text>
  <text x="90" y="86" fill="#8b909b" font-size="11" text-anchor="middle">S&P / Fitch</text>
  <text x="250" y="86" fill="#8b909b" font-size="11" text-anchor="middle">Moody's</text>
  <g font-size="12.5" fill="#5eead4">
    <text x="90" y="112" text-anchor="middle">AAA</text><text x="250" y="112" text-anchor="middle">Aaa</text>
    <text x="90" y="134" text-anchor="middle">AA</text><text x="250" y="134" text-anchor="middle">Aa</text>
    <text x="90" y="156" text-anchor="middle">A</text><text x="250" y="156" text-anchor="middle">A</text>
    <text x="90" y="178" text-anchor="middle">BBB</text><text x="250" y="178" text-anchor="middle">Baa</text>
  </g>
  <text x="410" y="150" fill="#5eead4" font-size="13" font-weight="700">Catégorie investissement</text>
  <text x="410" y="170" fill="#8b909b" font-size="11">faible probabilité de défaut,</text>
  <text x="410" y="186" fill="#8b909b" font-size="11">éligible aux portefeuilles réglementés</text>
  <line x1="40" y1="196" x2="680" y2="196" stroke="#ff4d87" stroke-width="1.5" stroke-dasharray="6 4"></line>
  <text x="40" y="212" fill="#ff4d87" font-size="11" font-weight="700">frontière BBB- / Baa3 : l'ange déchu bascule ici</text>
  <g font-size="12.5" fill="#ff4d87">
    <text x="90" y="238" text-anchor="middle">BB</text><text x="250" y="238" text-anchor="middle">Ba</text>
    <text x="90" y="260" text-anchor="middle">B</text><text x="250" y="260" text-anchor="middle">B</text>
    <text x="90" y="282" text-anchor="middle">CCC</text><text x="250" y="282" text-anchor="middle">Caa</text>
    <text x="90" y="304" text-anchor="middle">D</text><text x="250" y="304" text-anchor="middle">C</text>
  </g>
  <text x="410" y="266" fill="#ff4d87" font-size="13" font-weight="700">Haut rendement (spéculatif)</text>
  <text x="410" y="286" fill="#8b909b" font-size="11">risque de défaut croissant, spread élevé</text>
  <text x="32" y="330" fill="#8b909b" font-size="11">Sources : S&P Global, Moody's, Fitch (échelles publiques).</text>
</svg>
<figcaption>Franchir la ligne BBB- / Baa3 vers le bas exclut l'émetteur des portefeuilles contraints à l'investment grade. Un cran à cette frontière pèse plus que partout ailleurs. Sources : S&P, Moody's, Fitch.</figcaption>
</figure>

## Les taux de défaut, seule vraie promesse de la note

Une note ne vaut que si elle prédit. L'historique montre qu'elle le fait, à gros traits. La probabilité de défaut à un an grimpe fortement à mesure que la note descend : proche de zéro pour un AAA, de l'ordre de 0,2 % pour un BBB, 0,6 % pour un BB, 3 % pour un B, et jusqu'à 26 % pour un CCC ou moins. Sur cinq ans en cumulé, l'écart se creuse encore : moins de 2 % de défauts pour la catégorie investissement, plus de 20 % pour un émetteur noté B.

Ce profil non linéaire est le vrai message d'une note. L'écart entre AAA et BBB, tous deux en investment grade, est modeste. L'écart entre BB et CCC, tous deux en spéculatif, est vertigineux. La note ne mesure pas un risque proportionnel à la position sur l'échelle : elle mesure un risque qui explose dans le bas. C'est pourquoi un portefeuille peut absorber sans peine quelques BBB, mais se disloque s'il accumule des CCC.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 320" role="img" aria-label="Probabilité de défaut à un an selon la note de crédit" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="320" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Le défaut explose dans le bas de l'échelle</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Probabilité de défaut à un an, par note, en pourcentage (ordres de grandeur).</text>
  <line x1="70" y1="250" x2="680" y2="250" stroke="#2a2c33" stroke-width="1"></line>
  <line x1="70" y1="90" x2="70" y2="250" stroke="#2a2c33" stroke-width="1"></line>
  <text x="60" y="254" fill="#8b909b" font-size="10.5" text-anchor="end">0</text>
  <text x="60" y="170" fill="#8b909b" font-size="10.5" text-anchor="end">13</text>
  <text x="60" y="94" fill="#8b909b" font-size="10.5" text-anchor="end">26</text>
  <g text-anchor="middle">
    <rect x="96" y="249" width="54" height="1" fill="#5eead4"></rect>
    <text x="123" y="266" fill="#8b909b" font-size="11">AAA</text><text x="123" y="242" fill="#5eead4" font-size="10">~0</text>
    <rect x="196" y="248" width="54" height="2" fill="#5eead4"></rect>
    <text x="223" y="266" fill="#8b909b" font-size="11">BBB</text><text x="223" y="240" fill="#5eead4" font-size="10">0,2</text>
    <rect x="296" y="246" width="54" height="4" fill="#f5b13d"></rect>
    <text x="323" y="266" fill="#8b909b" font-size="11">BB</text><text x="323" y="238" fill="#f5b13d" font-size="10">0,6</text>
    <rect x="396" y="232" width="54" height="18" fill="#f5b13d"></rect>
    <text x="423" y="266" fill="#8b909b" font-size="11">B</text><text x="423" y="224" fill="#f5b13d" font-size="10">3</text>
    <rect x="496" y="98" width="54" height="152" fill="#ff4d87"></rect>
    <text x="523" y="266" fill="#8b909b" font-size="11">CCC / C</text><text x="523" y="90" fill="#ff4d87" font-size="11" font-weight="700">26</text>
  </g>
  <text x="32" y="298" fill="#8b909b" font-size="11" textLength="682" lengthAdjust="spacingAndGlyphs">Sur 5 ans cumulés : &lt; 2 % de défauts en investment grade, &gt; 20 % pour un B. Sources : S&P Global, données historiques.</text>
</svg>
<figcaption>La note ne mesure pas un risque linéaire mais un risque qui s'emballe dans le bas de l'échelle. Quelques crans de plus, et la probabilité de défaut change d'ordre de grandeur. Source : S&P Global.</figcaption>
</figure>

Pour saisir la dynamique plutôt que la photo, les analystes utilisent la [matrice de transition](/glossaire/matrice-de-transition/) : un tableau qui donne, pour chaque note, la probabilité de migrer vers une autre sur un an, hausse, baisse ou défaut. C'est elle qui révèle la stabilité relative des notes hautes et la volatilité des notes basses, et qui alimente les modèles de risque de crédit.

## Le conflit du modèle émetteur-payeur

Reste la question qui mine la crédibilité de l'ensemble : qui paie la note ? Les trois agences agréées, les [NRSRO](/glossaire/nrsro/) au sens de la SEC, concentrent environ 95 % du marché mondial. Leur modèle dominant est l'émetteur-payeur : l'entreprise ou l'État qui émet la dette paie l'agence pour être noté. Le client de l'agence est donc l'entité même qu'elle est censée juger sans complaisance.

Ce conflit n'est pas théorique. Il pousse à la surenchère de notes favorables pour retenir le client, et il a été identifié comme l'une des causes de la crise de 2008. Il perdure parce que l'alternative, un modèle payé par l'investisseur, se heurte au fait qu'une note, une fois publiée, profite à tous sans que personne ne veuille la financer. Lire une note suppose donc de garder en tête que son producteur est rémunéré par son sujet, et de croiser la note avec un signal indépendant, le spread de marché, qui bouge souvent plus vite et plus honnêtement que la note elle-même.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 250" role="img" aria-label="La boucle du modèle émetteur-payeur dans la notation de crédit" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="250" fill="#0c0d10"></rect>
  <text x="32" y="36" fill="#f5f6f8" font-size="16" font-weight="700">Le conflit du modèle émetteur-payeur</text>
  <rect x="60" y="80" width="200" height="70" rx="8" fill="none" stroke="#f5b13d" stroke-width="1.4"></rect>
  <text x="160" y="110" fill="#e7e9ee" font-size="13" text-anchor="middle" font-weight="600">Émetteur</text>
  <text x="160" y="130" fill="#8b909b" font-size="10.5" text-anchor="middle">veut une bonne note</text>
  <rect x="460" y="80" width="200" height="70" rx="8" fill="none" stroke="#5eead4" stroke-width="1.4"></rect>
  <text x="560" y="110" fill="#e7e9ee" font-size="13" text-anchor="middle" font-weight="600">Agence (NRSRO)</text>
  <text x="560" y="130" fill="#8b909b" font-size="10.5" text-anchor="middle">note l'émetteur</text>
  <path d="M260 100 L456 100" stroke="#f5b13d" stroke-width="1.6" fill="none"></path>
  <path d="M452 95 l8 5 l-8 5 z" fill="#f5b13d"></path>
  <text x="358" y="90" fill="#f5b13d" font-size="10.5" text-anchor="middle">paie pour être noté</text>
  <path d="M460 132 L264 132" stroke="#5eead4" stroke-width="1.6" fill="none"></path>
  <path d="M268 127 l-8 5 l8 5 z" fill="#5eead4"></path>
  <text x="358" y="148" fill="#5eead4" font-size="10.5" text-anchor="middle">attribue la note</text>
  <text x="32" y="200" fill="#ff4d87" font-size="12.5" font-weight="700">Le payeur est le sujet de la note : incitation structurelle à la générosité.</text>
  <text x="32" y="228" fill="#8b909b" font-size="11">Trois NRSRO (S&P, Moody's, Fitch) concentrent ~95 % du marché. Source : SEC, GAO.</text>
</svg>
<figcaption>Dans le modèle dominant, l'émetteur paie l'agence qui le note. Le conflit est structurel et permanent, ce qui impose de croiser la note avec un signal de marché indépendant. Sources : SEC, GAO.</figcaption>
</figure>

## Note publique contre note privée : la zone grise

La fracture la plus actuelle n'est pas entre agences, mais entre note publique et note privée. Une note publique est diffusée, suivie, révisée sous le regard du marché. Une note privée, ou « private letter rating », n'est communiquée qu'au souscripteur, souvent pour lui permettre de loger un actif dans une case réglementaire favorable. C'est le ressort des [rated feeder notes](/glossaire/rated-feeder-note/) qui font entrer du crédit privé dans les bilans d'assureurs, décrit dans notre guide sur [la solidité d'un assureur-vie](/guides/lire-la-solidite-d-un-assureur-vie/).

Le canal privé n'est pas neutre. Les travaux relayés par la presse spécialisée montrent qu'un titre passant à une notation privée est relevé plus de quatre fois plus souvent qu'il n'est abaissé, quand le même passage vers une notation publique produit autant de hausses que de baisses. La même dérive se lit ailleurs : la [dette adossée aux puces d'IA](/posts/valeur-residuelle-garantie-credit-infrastructure-ia/) a décroché la catégorie investissement sur des montages où la note fait une grande partie du travail. Une note privée favorable n'est pas fausse par nature, mais son absence de contestation publique en fait un signal à traiter avec prudence.

## La grille de lecture

Cinq réflexes résument le guide. Ramener toute note à son périmètre : une probabilité de défaut, pas une garantie ni un prix. Situer l'émetteur par rapport à la frontière BBB- / Baa3, où un seul cran change tout. Lire la note à la lumière du taux de défaut historique de sa catégorie, en gardant en tête l'emballement dans le bas de l'échelle. Se rappeler qui paie la note, et la croiser avec le spread de marché, plus prompt à sanctionner. Et distinguer une note publique d'une note privée, en pesant la seconde à la baisse.

Une notation de crédit est un outil précieux et un outil biaisé, et les deux à la fois. Elle condense une masse d'analyse dans un symbole lisible, mais elle est produite par un acteur payé par son sujet, révisée avec retard, et de plus en plus fabriquée dans un canal privé qui échappe au regard. La lire correctement, ce n'est pas la croire ou la rejeter, c'est savoir exactement jusqu'où elle porte, et compléter par le prix ce qu'elle ne dit pas.

## Sources

- Wolf Street, « Corporate Bond Credit Ratings Scales: Moody's, S&P, Fitch » (échelles parallèles, correspondance des crans, frontière investment grade / high yield) : https://wolfstreet.com/credit-rating-scales-by-moodys-sp-and-fitch/
- Fidelity, « Bond Ratings » (catégorie investissement à BBB- / Baa3, définition du haut rendement) : https://www.fidelity.com/learning-center/investment-products/fixed-income-bonds/bond-ratings
- Wikipedia, « Nationally recognized statistical rating organization » (S&P, Moody's, Fitch ~95 % du marché, agrément SEC) : https://en.wikipedia.org/wiki/Nationally_recognized_statistical_rating_organization
- U.S. GAO, « Credit Rating Agencies: Alternative Compensation Models for NRSROs » (modèle émetteur-payeur et son conflit d'intérêts) : https://www.gao.gov/products/gao-12-240
- S&P Global / synthèses de marché, taux de défaut par note (probabilités à un an : ~0 % AAA, 0,2 % BBB, 0,6 % BB, 3 % B, 26 % CCC/C ; cumul 5 ans &lt; 2 % en IG, &gt; 20 % en B) : https://investmentgrade.com/bond-ratings/
- RapidRatings, « Rating Transition Matrix » (matrice de transition, probabilités de migration de note) : https://help.rapidratings.com/hc/en-us/articles/360045797832-Rating-Transition-Matrix
- Alternative Credit Investor, « Insurers and private credit: Ratings under the microscope » (asymétrie des révisions en notation privée) : https://alternativecreditinvestor.com/2025/12/04/ratings-under-the-microscope/

*Ce guide est une analyse pédagogique et ne constitue pas un conseil en investissement. Les taux de défaut sont des ordres de grandeur historiques, cités à la date de leurs sources.*
