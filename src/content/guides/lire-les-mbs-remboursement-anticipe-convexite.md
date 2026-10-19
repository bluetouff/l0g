---
title: "MBS : remboursement anticipé et convexité négative"
description: "Relier le refinancement d’un prêt immobilier aux flux d’un MBS, à sa durée et à sa couverture de taux. Calculs reproductibles et limites du modèle."
summary: "Les MBS transmettent aux investisseurs les flux de prêts immobiliers regroupés. Le remboursement anticipé modifie leur calendrier : une baisse des taux peut accélérer le retour du capital, tandis qu’une hausse peut prolonger l’exposition aux taux."
pubDate: 2026-10-19T10:40:00+02:00
tags: ["MBS", "immobilier", "taux", "titrisation"]
category: marches
draft: false
---

Lorsqu’un ménage refinance son crédit immobilier, il rembourse le prêteur avec un nouveau prêt. Pour l’investisseur qui détenait les flux de l’ancien crédit, le capital revient plus tôt et les intérêts futurs changent. Multipliée à l’échelle d’un portefeuille, cette décision transforme la durée d’une exposition obligataire et les opérations nécessaires pour la couvrir.

Le guide porte sur les MBS résidentiels américains à taux fixe de type *pass-through*, qui transmettent aux détenteurs les flux d’un ensemble de prêts selon les règles du titre. Les tranches complexes demandent une analyse supplémentaire. Les exemples sont hypothétiques et isolent le remboursement anticipé, avec des hypothèses explicitement simplifiées.

## Relier un pool de prêts à ses investisseurs

Un **mortgage-backed security**, ou MBS, est un titre adossé à des prêts immobiliers. Dans un pass-through, les paiements d’intérêts et de principal du portefeuille alimentent les distributions, après les frais et selon les modalités prévues. Il faut identifier le garant, le calendrier de paiement et les règles applicables aux prêts. [Fannie Mae décrit les produits qu’elle émet](https://capitalmarkets.fanniemae.com/mortgage-backed-securities) ; cette documentation renseigne leur structure sans constituer une appréciation indépendante de leur attrait.

Une garantie contractuelle de paiement et une sensibilité aux taux couvrent des risques différents. Même avec une protection contre certains défauts, le calendrier de retour du capital peut varier. Ce calendrier influence le réinvestissement, la valeur de marché et la durée effective du placement. Le guide des [ABS de consommation](/guides/lire-une-titrisation-de-credit-a-la-consommation/) permet de comparer les questions de flux, de garanties et de structure.

## Partir de la décision de refinancement

Le ménage compare les économies attendues aux frais de remplacement du crédit, en tenant compte de la durée pendant laquelle il pense conserver le nouveau prêt. Ses revenus, son dossier de crédit et la valeur du logement peuvent aussi conditionner l’accès à l’opération. Le [CFPB présente le refinancement et ses frais](https://www.consumerfinance.gov/consumer-tools/mortgages/answers/key-terms/), tandis que le [guide de la Réserve fédérale](https://www.federalreserve.gov/pubs/refinancings/default.htm) expose le calcul d’un seuil de récupération des coûts.

Prenons **200 000 u.m. de capital restant dû**, **20 ans** à courir et un taux nominal annuel de **5 %**, avec mensualités constantes. En supposant un taux mensuel égal au taux annuel divisé par 12, la mensualité hors assurance et taxes est **1 319,91 u.m.** Un remplacement à **3 %**, avec le même capital et la même durée, donne **1 109,20 u.m.**

Ces montants viennent de la formule **mensualité = capital × r / [1 − (1 + r) puissance −n]**, avec r le taux mensuel et n = 240. La différence calculée avant arrondi est d’environ **210,72 u.m. par mois**. Pour **3 000 u.m. de frais payés séparément**, le ratio frais / économie mensuelle vaut environ **14,24 mois**. Ce seuil de trésorerie simplifié ignore actualisation, fiscalité et différences d’accumulation de capital ; une comparaison de coût total doit les intégrer. Un allongement de durée modifierait aussi l’exercice.

## Visualiser le déplacement du principal

Pour suivre les flux sans mélanger les détails d’un prêt réel, utilisons un second exemple : **100 u.m. de principal**, remboursées par **20 u.m. à la fin de chacune de cinq années**, avec intérêts annuels de **5 % sur le capital de début d’année**. Les paiements totaux sont 25, 24, 23, 22 et 21. Le schéma ne représente ni une mensualité constante, ni un MBS coté.

Si l’emprunteur rembourse tout le solde à la fin de l’année 2, le principal distribué devient 20 puis 80. Les paiements totaux sont alors 25 puis 84, et le contrat s’éteint. Le capital de 100 revient intégralement dans les deux scénarios ; les intérêts cumulés passent de **15 à 9 u.m.**, parce que l’argent reste prêté moins longtemps.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 420" role="img" aria-labelledby="premium-mbs-fr-title premium-mbs-fr-desc" style="display:block;width:100%;max-width:560px;height:auto;margin-inline:auto;font-family:var(--font-read);background:var(--color-surface);border:1px solid var(--color-line);border-radius:12px">
<title id="premium-mbs-fr-title">Le capital revient plus tôt</title>
<desc id="premium-mbs-fr-desc">Contrat fictif : principal 100, amortissement annuel prévu de 20 sur cinq ans. Le remboursement du solde en année 2 déplace 60 u.m. des années suivantes vers cette date. Barres de principal, à échelle identique ; intérêts exclus. WAL = moyenne des dates pondérée par le principal. Calculs l0g.</desc>
<text x="24" y="32" fill="var(--color-bright)" font-size="22" text-anchor="start" font-weight="700">Le capital revient plus tôt</text>
<text x="24" y="56" fill="var(--color-muted)" font-size="14" text-anchor="start">Principal remboursé · u.m. · exemple fictif</text>
<text x="24" y="82" fill="var(--color-bright)" font-size="17" text-anchor="start" font-weight="600">Échéancier prévu</text>
<text x="456" y="82" fill="var(--color-muted)" font-size="16" text-anchor="end">WAL : 3 ans</text>
<line x1="48" y1="188" x2="448" y2="188" stroke="var(--color-line)" stroke-width="1"/>
<text x="39" y="193" fill="var(--color-muted)" font-size="14" text-anchor="end">0</text>
<line x1="48" y1="154" x2="448" y2="154" stroke="var(--color-line)" stroke-width="1"/>
<text x="39" y="159" fill="var(--color-muted)" font-size="14" text-anchor="end">40</text>
<line x1="48" y1="120" x2="448" y2="120" stroke="var(--color-line)" stroke-width="1"/>
<text x="39" y="125" fill="var(--color-muted)" font-size="14" text-anchor="end">80</text>
<rect x="64" y="171" width="42" height="17" rx="3" fill="var(--color-amber)"/>
<text x="85" y="161" fill="var(--color-bright)" font-size="17" text-anchor="middle" font-weight="700">20</text>
<text x="85" y="212" fill="var(--color-muted)" font-size="15" text-anchor="middle">1</text>
<rect x="142" y="171" width="42" height="17" rx="3" fill="var(--color-amber)"/>
<text x="163" y="161" fill="var(--color-bright)" font-size="17" text-anchor="middle" font-weight="700">20</text>
<text x="163" y="212" fill="var(--color-muted)" font-size="15" text-anchor="middle">2</text>
<rect x="220" y="171" width="42" height="17" rx="3" fill="var(--color-amber)"/>
<text x="241" y="161" fill="var(--color-bright)" font-size="17" text-anchor="middle" font-weight="700">20</text>
<text x="241" y="212" fill="var(--color-muted)" font-size="15" text-anchor="middle">3</text>
<rect x="298" y="171" width="42" height="17" rx="3" fill="var(--color-amber)"/>
<text x="319" y="161" fill="var(--color-bright)" font-size="17" text-anchor="middle" font-weight="700">20</text>
<text x="319" y="212" fill="var(--color-muted)" font-size="15" text-anchor="middle">4</text>
<rect x="376" y="171" width="42" height="17" rx="3" fill="var(--color-amber)"/>
<text x="397" y="161" fill="var(--color-bright)" font-size="17" text-anchor="middle" font-weight="700">20</text>
<text x="397" y="212" fill="var(--color-muted)" font-size="15" text-anchor="middle">5</text>
<text x="24" y="236" fill="var(--color-bright)" font-size="17" text-anchor="start" font-weight="600">Remboursement en année 2</text>
<text x="456" y="236" fill="var(--color-muted)" font-size="16" text-anchor="end">WAL : 1,8 an</text>
<line x1="48" y1="342" x2="448" y2="342" stroke="var(--color-line)" stroke-width="1"/>
<text x="39" y="347" fill="var(--color-muted)" font-size="14" text-anchor="end">0</text>
<line x1="48" y1="308" x2="448" y2="308" stroke="var(--color-line)" stroke-width="1"/>
<text x="39" y="313" fill="var(--color-muted)" font-size="14" text-anchor="end">40</text>
<line x1="48" y1="274" x2="448" y2="274" stroke="var(--color-line)" stroke-width="1"/>
<text x="39" y="279" fill="var(--color-muted)" font-size="14" text-anchor="end">80</text>
<rect x="64" y="325" width="42" height="17" rx="3" fill="var(--color-signal)"/>
<text x="85" y="315" fill="var(--color-bright)" font-size="17" text-anchor="middle" font-weight="700">20</text>
<text x="85" y="366" fill="var(--color-muted)" font-size="15" text-anchor="middle">1</text>
<rect x="142" y="274" width="42" height="68" rx="3" fill="var(--color-signal)"/>
<text x="163" y="264" fill="var(--color-bright)" font-size="17" text-anchor="middle" font-weight="700">80</text>
<text x="163" y="366" fill="var(--color-muted)" font-size="15" text-anchor="middle">2</text>
<text x="241" y="332" fill="var(--color-bright)" font-size="17" text-anchor="middle" font-weight="700">0</text>
<text x="241" y="366" fill="var(--color-muted)" font-size="15" text-anchor="middle">3</text>
<text x="319" y="332" fill="var(--color-bright)" font-size="17" text-anchor="middle" font-weight="700">0</text>
<text x="319" y="366" fill="var(--color-muted)" font-size="15" text-anchor="middle">4</text>
<text x="397" y="332" fill="var(--color-bright)" font-size="17" text-anchor="middle" font-weight="700">0</text>
<text x="397" y="366" fill="var(--color-muted)" font-size="15" text-anchor="middle">5</text>
<text x="240" y="397" fill="var(--color-paper)" font-size="15" text-anchor="middle">Années · même capital total de 100 u.m.</text>
</svg>
<figcaption>Contrat fictif : principal 100, amortissement annuel prévu de 20 sur cinq ans. Le remboursement du solde en année 2 déplace 60 u.m. des années suivantes vers cette date. Barres de principal, à échelle identique ; intérêts exclus. WAL = moyenne des dates pondérée par le principal. Calculs l0g. <a href="https://libertystreeteconomics.newyorkfed.org/2014/03/convexity-event-risks-in-a-rising-interest-rate-environment/">Mécanisme : Fed de New York</a>.</figcaption>
</figure>

La **durée de vie moyenne du principal**, ou WAL, pondère chaque date par le principal remboursé. Elle vaut ici **3 ans** dans le calendrier prévu : (20 × 1 + 20 × 2 + 20 × 3 + 20 × 4 + 20 × 5) / 100. Elle tombe à **1,8 an** après remboursement anticipé : (20 × 1 + 80 × 2) / 100. La WAL mesure le calendrier du capital ; la duration mesure une sensibilité de prix aux taux, avec d’autres pondérations et hypothèses.

## Comprendre l’asymétrie de la sensibilité aux taux

Quand les taux de refinancement baissent suffisamment, certains emprunteurs remboursent plus tôt. L’investisseur récupère alors le capital au moment où les nouveaux placements peuvent offrir des rendements inférieurs. Quand les taux montent, les anciens prêts attractifs pour les ménages peuvent rester en place plus longtemps : l’investisseur conserve davantage d’exposition à des coupons devenus faibles relativement au marché.

Cette option détenue par l’emprunteur peut produire une **convexité négative**, particulièrement dans les zones où la décision de refinancement réagit fortement aux taux. La hausse potentielle du prix est freinée par les remboursements, tandis qu’une remontée des taux peut allonger la duration. La [Fed de New York explique cette mécanique et ses couvertures](https://libertystreeteconomics.newyorkfed.org/2014/03/convexity-event-risks-in-a-rising-interest-rate-environment/).

Un détenteur qui cherche à conserver une duration stable peut compenser son allongement en vendant de la duration, par exemple via des Treasuries ou un swap payeur fixe. L’effet de marché dépend du volume couvert, des autres détenteurs et de la profondeur disponible. Le [guide des swaps de taux](/guides/lire-les-swaps-de-taux/) décrit les échanges de flux concernés. Une spirale de couverture constitue un scénario conditionnel, à documenter par des positions et des transactions.

## Examiner le portefeuille et la méthode de valorisation

Le coupon du MBS, les taux des prêts, leur ancienneté, leurs soldes et leur historique de remboursement aident à comprendre l’exposition au refinancement. Une baisse du taux de marché peut avoir des effets différents selon les coûts supportés par les ménages et la part de ceux qui ont déjà refinancé. La [recherche de Peristiani sur l’instabilité des remboursements anticipés](https://www.newyorkfed.org/research/staff_reports/research_papers/9804.html) souligne les difficultés de modélisation de ces comportements.

Un spread ajusté de l’option, ou **OAS**, dépend de la courbe, des scénarios de taux et du modèle de remboursement retenus. Pour comparer deux estimations, commencez par leurs hypothèses. Un chiffre précis peut cacher une incertitude de modèle importante ; notre [guide des spreads de crédit](/guides/lire-les-spreads-de-credit/) replace cet ajustement parmi les autres mesures de spread.

La liquidité constitue encore un autre axe. Sur le marché **TBA**, les parties conviennent à l’avance de caractéristiques standardisées, tandis que les pools précis sont désignés ultérieurement selon les règles de livraison. [Vickery et Wright](https://www.newyorkfed.org/research/epr/2013/1212vick.html) analysent la contribution de cette organisation à la liquidité des agency MBS. Elle facilite les échanges sans rendre tous les pools économiquement identiques.

## Sources et limites

Les deux exemples séparent volontairement la décision d’un ménage et le calendrier d’un placement. Leurs montants et leurs taux sont hypothétiques, leurs calculs reproductibles. Ils excluent défauts, frais de gestion du pool, délais de transmission et valorisation de l’option. Pour un titre réel, il faut ajouter ces éléments et vérifier la garantie propre au produit. La lecture robuste relie toujours les caractéristiques des prêts, les comportements possibles des emprunteurs et les hypothèses du modèle.
