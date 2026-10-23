---
title: "ETF : création, rachat et formation du prix"
description: "Suivre les parts et les titres d’un ETF : arbitrage, prime, décote, paniers obligataires et coût d’exécution. Un exemple chiffré et ses limites."
summary: "Un ETF se négocie entre investisseurs en Bourse, tandis que des participants autorisés peuvent créer ou racheter des blocs de parts auprès du fonds. L’arbitrage relie ces deux marchés, sous contrainte de coûts, de financement et de liquidité des actifs."
pubDate: 2026-10-19T10:40:00+02:00
tags: ["ETF", "marchés", "liquidité", "investissement"]
category: marches
draft: false
---

Un ETF permet d’acheter en Bourse une exposition à un portefeuille. Derrière cette simplicité, deux marchés se répondent : celui des parts que les investisseurs échangent et celui des titres que le fonds détient. Comprendre leur articulation aide à lire une décote, à comparer les coûts d’exécution et à distinguer un mouvement du portefeuille d’un changement de prix de la part.

Ce guide porte sur les ETF ouverts classiques, en prenant le cadre américain comme référence documentaire. Les produits à levier, inverses, synthétiques et les titres de dette cotés demandent une lecture contractuelle supplémentaire. Les montants de l’exemple sont **des hypothèses pédagogiques**, exprimées en unités monétaires (u.m.), sans référence à un fonds réel.

## Deux marchés reliés par un échange de titres

Sur le **marché secondaire**, une transaction fait passer des parts d’un vendeur à un acheteur. Le nombre de parts en circulation peut rester identique malgré un volume de transactions élevé. Sur le **marché primaire**, un participant autorisé, ou AP, traite directement avec le fonds : il apporte un panier de titres et éventuellement du cash contre un bloc de nouvelles parts, ou remet des parts contre les actifs du panier de rachat. La [SEC décrit cette architecture](https://www.sec.gov/investment/exchange-traded-funds-small-entity-compliance-guide).

Le teneur de marché affiche des prix d’achat et de vente ; l’AP dispose de l’accès contractuel aux créations et rachats. Une même institution peut cumuler les fonctions, mais leurs responsabilités diffèrent. Pour suivre un mouvement d’argent vers un ETF, regardez les créations nettes et leurs modalités, en complément des transactions boursières. Confondre les deux reviendrait à compter chaque revente d’une maison comme une construction supplémentaire.

La **valeur liquidative**, ou NAV en anglais, correspond aux actifs nets du fonds divisés par le nombre de parts. Le cours se forme dans les échanges. Leur différence, rapportée à la NAV, donne une prime ou une décote, dont la mesure dépend aussi de l’heure et de la méthode de valorisation. [Investor.gov, bulletin sur les ETF](https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-24).

## Reconstituer un arbitrage de création

Supposons un panier valorisé et achetable pour **100 000 u.m.**, donnant droit à **1 000 parts**. Chaque part correspond donc à 100 u.m. d’actifs, tandis qu’un acheteur est prêt à payer 101 u.m. sur le marché secondaire. La taille du bloc est choisie pour simplifier le calcul ; les unités de création réelles dépendent du fonds.

L’AP achète le panier, le livre au fonds et reçoit les parts qu’il vend pour 101 000 u.m. Avec **400 u.m. de coûts totaux supposés**, le résultat est de **600 u.m.** : 101 000 − 100 000 − 400. Ces coûts regroupent ici exécution, financement, couverture et création. L’exemple suppose des prix exécutables, des volumes disponibles et un règlement sans incident. Les opérations réelles peuvent commencer par une vente à découvert, couverte ensuite par la livraison des nouvelles parts.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 365" role="img" aria-labelledby="premium-etf-fr-title premium-etf-fr-desc" style="display:block;width:100%;max-width:600px;height:auto;margin-inline:auto;font-family:var(--font-read);background:var(--color-surface);border:1px solid var(--color-line);border-radius:12px">
<title id="premium-etf-fr-title">Créer des parts contre un panier</title>
<desc id="premium-etf-fr-desc">Exemple hypothétique : création puis vente de 1 000 parts. Les flèches indiquent les livraisons, sans échelle de volume. Panier 100 000, vente 101 000 et coûts 400 u.m. Calculs l0g ; séquence simplifiée, hors variation des prix.</desc>
<text x="24" y="32" fill="var(--color-bright)" font-size="22" text-anchor="start" font-weight="700">Créer des parts contre un panier</text>
<text x="24" y="56" fill="var(--color-muted)" font-size="14" text-anchor="start">Exemple pédagogique · unités monétaires</text>
<text x="70" y="96" fill="var(--color-bright)" font-size="18" text-anchor="middle" font-weight="700">Fonds</text>
<line x1="70" y1="108" x2="70" y2="300" stroke="var(--color-line)" stroke-width="1" stroke-dasharray="4 5"/>
<text x="240" y="96" fill="var(--color-bright)" font-size="18" text-anchor="middle" font-weight="700">AP</text>
<line x1="240" y1="108" x2="240" y2="300" stroke="var(--color-line)" stroke-width="1" stroke-dasharray="4 5"/>
<text x="410" y="96" fill="var(--color-bright)" font-size="18" text-anchor="middle" font-weight="700">Bourse</text>
<line x1="410" y1="108" x2="410" y2="300" stroke="var(--color-line)" stroke-width="1" stroke-dasharray="4 5"/>
<line x1="240" y1="145" x2="70" y2="145" stroke="var(--color-amber)" stroke-width="2"/><polygon points="70,145 77,149 77,141" fill="var(--color-amber)"/>
<text x="155" y="135" fill="var(--color-paper)" font-size="15" text-anchor="middle">Panier : 100 000</text>
<line x1="70" y1="192" x2="240" y2="192" stroke="var(--color-signal)" stroke-width="2"/><polygon points="240,192 233,188 233,196" fill="var(--color-signal)"/>
<text x="155" y="182" fill="var(--color-paper)" font-size="15" text-anchor="middle">1 000 parts</text>
<line x1="240" y1="240" x2="410" y2="240" stroke="var(--color-signal)" stroke-width="2"/><polygon points="410,240 403,236 403,244" fill="var(--color-signal)"/>
<text x="325" y="230" fill="var(--color-paper)" font-size="15" text-anchor="middle">1 000 parts</text>
<line x1="410" y1="287" x2="240" y2="287" stroke="var(--color-amber)" stroke-width="2"/><polygon points="240,287 247,291 247,283" fill="var(--color-amber)"/>
<text x="325" y="277" fill="var(--color-paper)" font-size="15" text-anchor="middle">101 000 u.m.</text>
<line x1="24" y1="315" x2="456" y2="315" stroke="var(--color-line)" stroke-width="1"/>
<text x="24" y="341" fill="var(--color-bright)" font-size="17" text-anchor="start" font-weight="600">Écart 1 000 − coûts 400 = gain 600</text>
</svg>
<figcaption>Exemple hypothétique : création puis vente de 1 000 parts. Les flèches indiquent les livraisons, sans échelle de volume. Panier 100 000, vente 101 000 et coûts 400 u.m. Calculs l0g ; séquence simplifiée, hors variation des prix. <a href="https://www.sec.gov/investment/exchange-traded-funds-small-entity-compliance-guide">Mécanisme : SEC</a>.</figcaption>
</figure>

La vente de parts augmente leur offre, tandis que l’achat du panier soutient la demande de titres sous-jacents. Ces transactions tendent à rapprocher les prix. Si la prime tombe à 0,2 %, les recettes deviennent 100 200 u.m. et le même circuit perd 200 u.m. après coûts. L’incitation dépend donc d’un écart **net des frictions**, et non de la seule présence d’une prime affichée. Le mécanisme général et les contraintes des intermédiaires sont analysés par [Todorov pour la BRI](https://www.bis.org/publications/anatomy-bond-etf-arbitrage).

En cas de décote, le circuit s’inverse : acheter les parts, les remettre au fonds, recevoir le panier puis vendre les titres. Chaque étape doit rester réalisable au prix retenu. Une NAV calculée sur des cotations anciennes offre un repère comptable, pas nécessairement un panier immédiatement négociable à ce montant.

## Lire une décote obligataire avec les bons prix

Les obligations d’un portefeuille peuvent se négocier à des heures différentes, avec des tailles minimales et des coûts d’exécution variables. Le panier de création ou de rachat peut aussi représenter une fraction des positions du fonds. Dans leur [recherche sur les ETF et les actifs illiquides](https://www.bis.org/publications/working-paper-975-etfs-illiquid-assets-and-fire-sales), Shim et Todorov étudient les conséquences de ces paniers partiels sur l’arbitrage et la transmission des tensions.

Pour interpréter une décote, rapprochez trois objets : le cours négociable de la part, la NAV publiée et le coût effectif du panier échangé. Vérifiez leurs horaires. Une décote peut refléter un coût de liquidation plus élevé, une capacité d’intermédiation réduite ou une valorisation des obligations qui intègre les informations plus lentement. Le seul écart cours/NAV ne permet pas de départager ces explications.

Le travail de la BRI porte sur des configurations précises de marché. Il aide à formuler les questions pertinentes ; il ne garantit ni une absorption des chocs par tous les ETF obligataires, ni une disparition rapide de leurs décotes. Les modalités du prospectus et les données du fonds restent nécessaires à l’analyse d’un produit particulier.

## Séparer suivi de l’indice et coût de transaction

Deux écarts méritent deux calculs. La **différence de suivi** compare la performance du fonds à celle de son indice sur une période donnée ; l’**erreur de suivi** mesure la variabilité des écarts de rendement périodiques. La prime ou décote compare, à un instant donné, le prix de la part à sa NAV. Une bonne réplication du portefeuille peut coexister avec une exécution coûteuse en Bourse.

L’[enquête MSCI sur l’Indonésie](/posts/msci-indonesie-flottant-risque-indices/) applique cette distinction aux règles d’éligibilité d’un pays dans un indice. Elle rapproche les mandats de fonds émergents et d’un ETF pays, puis suit les ajustements de portefeuille possibles, séparément des créations et rachats de parts.

Le coût supporté par l’investisseur comprend les frais du fonds, les frais éventuels du courtier, la fourchette achat-vente et l’évolution de la prime ou décote entre entrée et sortie. Par exemple, une part achetée 100,20 puis revendue immédiatement 99,80 coûte 0,40 u.m. par part, à prix sous-jacent supposé inchangé. Ce calcul isole la fourchette ; il ne mesure pas la performance d’une détention prolongée. [Investor.gov, frais des fonds et ETF](https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/mutual-fund-and-etf-fees-and-expenses-investor-bulletin).

Un ordre à cours limité fixe un prix acceptable, avec un risque de non-exécution. Comparer les cotations pendant les heures d’ouverture des principaux actifs sous-jacents facilite une lecture cohérente, sans garantir un faible spread. Le volume quotidien des parts, pris isolément, renseigne imparfaitement sur la profondeur disponible pour un ordre d’une taille donnée.

## Construire une fiche de lecture du fonds

Commencez par le prospectus et la méthodologie de l’indice : exposition, réplication, devise, traitement des revenus et éventuelle couverture de change. Consultez ensuite les positions, les paniers disponibles, les historiques de primes et décotes et les coûts publiés. Enfin, relevez une cotation bid/ask avec son heure et la taille envisagée, afin de rapprocher le produit théorique de son exécution réelle.

Cette méthode permet de préciser le diagnostic : une mauvaise performance peut venir de l’exposition choisie, du suivi de l’indice, du change ou du prix payé pour entrer. Pour approfondir les contraintes d’arbitrage, poursuivez avec les [appels de marge et le collatéral](/guides/comprendre-les-appels-de-marge-et-le-collateral/). Les [spreads de crédit](/guides/lire-les-spreads-de-credit/) expliquent les risques propres aux portefeuilles obligataires.

## Sources et limites

Les sources réglementaires expliquent le fonctionnement des fonds concernés ; les recherches de la BRI éclairent des mécanismes et des épisodes observés. Les calculs du guide sont reproductibles à partir des hypothèses affichées, sans données de marché implicites. L’exemple laisse de côté fiscalité, échec de livraison et variation de prix pendant l’opération. Pour une décision portant sur un ETF précis, ces éléments doivent être réintroduits avec ses documents contractuels.
