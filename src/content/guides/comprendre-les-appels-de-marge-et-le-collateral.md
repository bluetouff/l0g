---
title: "Appels de marge : collatéral et spirales de liquidité"
description: "Distinguer marge initiale, marge de variation et décote de financement. Calculer un besoin de liquidité et suivre les conditions d’une vente forcée."
summary: "Les marges et les décotes protègent les contreparties contre des pertes, mais imposent des besoins de liquidité datés. Une baisse du collatéral ou une hausse de sa décote réduit la capacité d’emprunt et peut conduire à mobiliser du cash ou vendre des actifs."
pubDate: 2026-10-19T10:40:00+02:00
tags: ["liquidité", "collatéral", "dérivés", "risque"]
category: marches
draft: false
---

Une position peut conserver une valeur nette positive tout en exigeant un paiement immédiat que son détenteur peine à financer. Entre la valeur économique d’un portefeuille et les liquidités disponibles avant une heure de règlement, le calendrier et l’éligibilité du collatéral font toute la différence. Les appels de marge rendent cette contrainte visible.

Ce guide distingue les mécanismes avant de les réunir dans une lecture du risque de financement. Le cas chiffré est **hypothétique** et porte sur une position financée par un prêt garanti, en millions d’unités monétaires (M u.m.). Ses décotes sont des paramètres pédagogiques, sans prétention à représenter une règle réglementaire ou une pratique de marché particulière.

## Identifier la protection demandée

La **marge de variation** règle ou couvre l’évolution de la valeur d’une exposition selon les conventions du contrat. La **marge initiale** vise les pertes potentielles pendant la période nécessaire à la clôture ou au remplacement d’une position après un défaut. Leurs objectifs diffèrent, ce qui explique qu’un règlement de variation puisse coexister avec une exigence initiale supplémentaire. Les [principes CPMI-IOSCO pour les infrastructures de marché](https://www.bis.org/committees/cpmi/pfmi/overview) exposent le rôle des garanties et des marges des contreparties centrales.

Dans un financement garanti, une **décote**, ou *haircut*, réduit la valeur de l’actif retenue pour calculer la somme prêtée. Une décote de 10 % sur un collatéral de 100 autorise, dans notre convention, un emprunt de 90. Ce mécanisme est apparenté à une exigence de protection, mais le calcul doit suivre le contrat précis. Le [guide du repo](/guides/lire-le-marche-du-repo-sofr/) décrit les opérations de financement concernées.

La compensation centrale organise les expositions et leur gestion en cas de défaut. Elle exige aussi que les membres puissent livrer le bon actif, dans la bonne devise, au bon moment. Pour les dérivés non compensés, les [standards BCBS-IOSCO](https://www.bis.org/committees/bcbs/basel-framework/standard/mgn?allChapters=true) établissent un cadre distinct, dont l’application dépend des règles et contrats pertinents.

## Calculer la contraction de capacité d’emprunt

La position de départ détient **100 M u.m. de collatéral**, financés par **90 de dette** et **10 de fonds propres**. La dette autorisée s’écrit **(1 − décote) × valeur du collatéral**. Supposons ensuite une baisse du prix de **5 %** et une décote portée de **10 % à 20 %**. Le collatéral vaut 95 et la capacité de dette tombe à **76** : 0,80 × 95.

Avec une dette encore égale à 90, le détenteur doit réduire son financement de **14 M u.m.**, ou apporter une garantie additionnelle suffisante selon les modalités du prêteur. La valeur nette de la position, avant coûts et transactions, reste de **5** : 95 − 90. Le besoin de liquidité de 14 et la perte de valeur de 5 répondent donc à deux calculs différents.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 370" role="img" aria-labelledby="premium-margin-fr-title premium-margin-fr-desc" style="display:block;width:100%;max-width:600px;height:auto;margin-inline:auto;font-family:var(--font-read);background:var(--color-surface);border:1px solid var(--color-line);border-radius:12px">
<title id="premium-margin-fr-title">Le financement se contracte</title>
<desc id="premium-margin-fr-desc">Exemple hypothétique, M u.m. avant et après choc. La capacité vaut (1 − décote) × collatéral. Le prix baisse de 5 %, la décote passe de 10 % à 20 % et la dette reste à 90 avant ajustement. Échelle commune : le segment rose représente le manque de financement de 14. Calculs l0g.</desc>
<text x="24" y="32" fill="var(--color-bright)" font-size="22" text-anchor="start" font-weight="700">Le financement se contracte</text>
<text x="24" y="56" fill="var(--color-muted)" font-size="14" text-anchor="start">Position fictive · millions d’unités monétaires</text>
<text x="24" y="94" fill="var(--color-bright)" font-size="18" text-anchor="start" font-weight="600">Collatéral : 100</text>
<text x="456" y="94" fill="var(--color-muted)" font-size="16" text-anchor="end">Décote 10%</text>
<rect x="24" y="112" width="388.8" height="32" rx="3" fill="var(--color-signal)"/>
<rect x="412.8" y="112" width="43.2" height="32" rx="3" fill="var(--color-amber)"/>
<text x="36" y="134" fill="var(--color-surface)" font-size="16" text-anchor="start" font-weight="700">Capacité 90</text>
<text x="434.4" y="134" fill="var(--color-surface)" font-size="16" text-anchor="middle" font-weight="700">10</text>
<text x="24" y="199" fill="var(--color-bright)" font-size="18" text-anchor="start" font-weight="600">Collatéral : 95</text>
<text x="456" y="199" fill="var(--color-muted)" font-size="16" text-anchor="end">Décote 20%</text>
<rect x="24" y="217" width="328.32" height="32" rx="3" fill="var(--color-signal)"/>
<rect x="352.32" y="217" width="82.08" height="32" rx="3" fill="var(--color-amber)"/>
<text x="36" y="239" fill="var(--color-surface)" font-size="16" text-anchor="start" font-weight="700">Capacité 76</text>
<text x="393.36" y="239" fill="var(--color-surface)" font-size="16" text-anchor="middle" font-weight="700">19</text>
<line x1="175" y1="154" x2="175" y2="186" stroke="var(--color-muted)" stroke-width="2"/><polygon points="175,186 179,179 171,179" fill="var(--color-muted)"/>
<text x="190" y="177" fill="var(--color-paper)" font-size="15" text-anchor="start">Prix −5 % · décote +10 pts</text>
<rect x="24" y="276" width="388.8" height="32" rx="3" fill="none" stroke="var(--color-muted)"/>
<rect x="352.32" y="276" width="60.48" height="32" rx="2" fill="var(--color-accent)"/>
<text x="36" y="298" fill="var(--color-paper)" font-size="16" text-anchor="start">Dette en cours : 90</text>
<text x="382.56" y="298" fill="var(--color-surface)" font-size="17" text-anchor="middle" font-weight="700">14</text>
<line x1="352.32" y1="249" x2="352.32" y2="312" stroke="var(--color-muted)" stroke-width="1" stroke-dasharray="4 5"/>
<text x="24" y="343" fill="var(--color-bright)" font-size="18" text-anchor="start" font-weight="600">À rembourser : 90 − 0,80 × 95 = 14</text>
</svg>
<figcaption>Exemple hypothétique, M u.m. avant et après choc. La capacité vaut (1 − décote) × collatéral. Le prix baisse de 5 %, la décote passe de 10 % à 20 % et la dette reste à 90 avant ajustement. Échelle commune : le segment rose représente le manque de financement de 14. Calculs l0g. <a href="https://www.fsb.org/uploads/P101224-1.pdf">Cadre de liquidité : FSB</a>.</figcaption>
</figure>

On peut décomposer le manque de financement dans un ordre explicite. À décote inchangée de 10 %, le nouveau prix aurait permis 85,5 de dette : la baisse du prix retire **4,5** de capacité. Passer ensuite à une décote de 20 % sur le collatéral de 95 retire **9,5** supplémentaires. Le total est bien **14**. Une autre séquence répartirait différemment l’interaction entre les facteurs, tout en retrouvant la même capacité finale.

## Mesurer la vente nécessaire quand le cash manque

Mobiliser 14 depuis une autre poche de liquidité permettrait de rembourser la différence en conservant le collatéral. Vendre une partie de ce même collatéral pose un autre problème : chaque vente rembourse de la dette mais réduit aussi la garantie restante. Il faut résoudre les deux effets ensemble.

Si x désigne le produit d’une vente intégralement affecté au remboursement, à prix constant et sans frais, la condition devient **90 − x ≤ 0,80 × (95 − x)**. Elle impose **x ≥ 70**. Après une vente de 70, il reste 25 de collatéral et 20 de dette, soit exactement 80 % de financement. Une vente de seulement 14 laisserait 81 de collatéral et 76 de dette, alors que la capacité autorisée serait 64,8.

L’écart entre l’apport de liquidité et la vente nécessaire illustre la contraction d’un bilan sous levier. Dans ce cas, les 5 de valeur nette sont conservés parce que l’on suppose des prix constants et aucune friction. Des ventes affectant les prix, des frais ou une nouvelle décote modifieraient le résultat. L’exemple porte sur la position, sans décrire le bilan complet de son détenteur ni présumer de ses autres ressources.

## Relier liquidité de financement et liquidité de marché

La **liquidité de financement** est la capacité à obtenir les moyens de porter ou régler une position. La **liquidité de marché** est la possibilité de négocier un actif avec un coût et un impact de prix limités. Brunnermeier et Pedersen étudient leur interaction dans [*Market Liquidity and Funding Liquidity*](https://www.princeton.edu/~markus/research/papers/liquidity.pdf), publié dans la *Review of Financial Studies* en 2009.

Leur modèle fournit un cadre pour comprendre un enchaînement possible : financement plus contraint, réduction des positions, moindre capacité d’intermédiation et détérioration des conditions de marché. Pour établir qu’une telle boucle opère dans un épisode concret, il faut documenter les appels, les ventes et la profondeur disponible. La présence simultanée de volatilité et de marges élevées fournit un indice, tandis que la causalité demande davantage de preuves.

Les paiements de variation transfèrent de la liquidité entre participants. Leurs bénéficiaires peuvent avoir des usages, devises, horaires et circuits de réemploi différents de ceux des payeurs. C’est pourquoi un système comportant des liquidités agrégées peut néanmoins subir des tensions locales. Le [rapport BCBS-CPMI-IOSCO sur les pratiques de marge](https://www.bis.org/publications/review-margining-practices) examine les mouvements observés pendant les tensions de mars 2020.

## Construire un échéancier de liquidité utilisable

Commencez par les obligations : montant, heure limite, devise, actif admissible et contrepartie. Rapprochez-les des ressources réellement mobilisables, en distinguant cash disponible, actifs libres, garanties déjà engagées et lignes dont l’utilisation reste conditionnelle. Un actif liquide mais nanti ailleurs ne constitue pas une ressource libre pour un nouvel appel.

Le scénario de stress doit réunir les facteurs susceptibles de se produire ensemble : variation de prix, hausse de marge initiale, décote, retrait de financement ou délai de transfert. Le [rapport final du FSB sur la préparation aux appels de marge](https://www.fsb.org/uploads/P101224-1.pdf) traite la gouvernance, les scénarios et la gestion du collatéral. Une estimation opérationnelle précise également les personnes habilitées, les comptes concernés et les délais de mobilisation.

Cette lecture prolonge les guides des [swaps de taux](/guides/lire-les-swaps-de-taux/) et des [ETF](/guides/lire-les-etf-creation-rachat-arbitrage/) : une couverture économiquement pertinente ou un arbitrage favorable peut encore nécessiter un financement intermédiaire. La robustesse se juge sur le trajet des paiements autant que sur leur solde final.

## Sources et limites

Les standards décrivent des objectifs de protection ; les études et rapports analysent leurs interactions avec la liquidité. Le cas de financement est un calcul de bilan, avec dette inchangée avant ajustement, collatéral divisible, prix fixes et absence de coûts. Il ne calibre aucun établissement réel. Une conclusion sur sa solvabilité ou sa résilience demanderait son bilan complet, ses contrats et l’accès effectif à ses ressources.
