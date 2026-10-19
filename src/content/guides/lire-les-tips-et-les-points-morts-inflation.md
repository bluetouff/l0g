---
title: "Inflation anticipée : TIPS, points morts et primes de risque"
description: "Décomposer un point mort d’inflation entre anticipations, prime de risque et liquidité. Comprendre les TIPS, l’indexation et les limites des taux de marché."
summary: "Le point mort d’inflation compare un rendement nominal à un rendement indexé de maturité comparable. Il combine anticipations d’inflation et primes de marché. L’extraction des anticipations exige des hypothèses sur le risque, la liquidité et les conventions des titres."
pubDate: 2026-10-19T10:40:00+02:00
tags: ["inflation", "TIPS", "taux", "banques centrales"]
category: fed
draft: false
---

Un écart de rendement entre une obligation nominale et une obligation indexée donne un prix à la protection contre l’inflation. Pour interpréter ce prix, il faut aussi examiner les risques supportés par leurs détenteurs et les conditions dans lesquelles les titres se négocient. Le point mort d’inflation constitue ainsi un point de départ pour l’analyse des anticipations.

Ce guide prend les TIPS américains comme référence et utilise des exemples hypothétiques, sans cotation contemporaine. Il distingue les calculs observables à partir de rendements et les composantes estimées par un modèle. Les conventions d’autres obligations indexées doivent être vérifiées dans leur documentation.

## Suivre le capital indexé d’un TIPS

Les **Treasury Inflation-Protected Securities**, ou TIPS, sont des obligations du Trésor américain dont le principal évolue avec l’indice de référence des prix à la consommation. Le taux de coupon reste fixe, tandis que le montant payé dépend du principal ajusté. À l’échéance, le remboursement retient le plus élevé du principal indexé et du principal d’origine. [TreasuryDirect, fonctionnement des TIPS](https://www.treasurydirect.gov/marketable-securities/tips/).

Dans un exemple simplifié, un principal de **1 000 u.m.** indexé de **3 %** devient **1 030 u.m.** Un coupon annuel de **2 %**, payé semestriellement, donne alors un versement de **10,30 u.m.** pour un semestre au principal ainsi ajusté : 1 030 × 2 % / 2. Les valeurs illustrent le calcul ; les paiements réels utilisent le ratio d’indexation applicable à leur date.

Le plancher de remboursement concerne le principal d’origine à l’échéance. Un achat au-dessus de ce montant ou une vente avant échéance expose encore à une perte de marché. La valeur d’un TIPS dépend notamment du rendement réel demandé, de sa maturité et de sa liquidité. L’indexation du capital et le prix de revente sont donc deux informations complémentaires. [TreasuryDirect, fiche technique des TIPS](https://www.treasurydirect.gov/forms/sec0042.pdf).

## Calculer un point mort avec des conventions cohérentes

Le **point mort**, ou *breakeven*, est couramment présenté comme le rendement nominal moins le rendement réel d’un titre indexé de maturité comparable. Il mesure une compensation d’inflation incorporée aux prix. Avant de soustraire les rendements, vérifiez maturité, structure des flux, date de cotation et conventions de calcul. La [Fed de San Francisco](https://www.frbsf.org/research-and-insights/publications/economic-letter/2011/06/tips-liquidity-breakeven-inflation-expectations/) expose les composantes qui compliquent son interprétation.

Pour deux placements zéro-coupon théoriques de même horizon, avec des rendements annuels effectifs de **4 % en nominal** et **1,5 % en réel**, le taux d’inflation annuel constant égalisant les montants terminaux est **1,04 / 1,015 − 1 = 2,463 %**, arrondi. La simple différence donne 2,5 %. Cette illustration isole la composition des rendements, en supposant une indexation parfaite, sans fiscalité, option de plancher ni différence de liquidité.

Des titres à coupons exigent de considérer le calendrier des flux et le réinvestissement. Les décalages d’indexation et la saisonnalité de l’indice peuvent aussi compter, surtout aux horizons courts. Un écart de rendements affiché est donc un indicateur pratique ; son utilisation comme seuil exact pour une stratégie donnée demande une comparaison complète de ses flux.

## Séparer anticipation, risque et liquidité

Une décomposition stylisée s’écrit : **point mort ≈ inflation anticipée + prime de risque d’inflation − prime de liquidité relative des TIPS**. Ici, une prime de liquidité positive signifie que le détenteur exige un rendement supplémentaire pour conserver le TIPS relativement moins liquide. Elle relève son rendement et réduit l’écart avec le titre nominal.

La prime de risque d’inflation rémunère l’exposition du titre nominal aux états futurs de l’économie. Son signe dépend du rôle de l’obligation dans ces états et peut varier. Les deux primes représentent des objets distincts. La [note de la Réserve fédérale consacrée au modèle D’Amico–Kim–Wei](https://www.federalreserve.gov/econres/notes/feds-notes/tips-from-tips-update-and-discussions-20190521.html) explique cette décomposition et confronte plusieurs estimations.

Prenons un point de départ hypothétique : anticipation **2,0 %**, prime de risque **0,3 point**, prime de liquidité **0,4 point**. Le point mort vaut **1,9 %**. Il atteint **2,2 %** si l’anticipation passe à 2,3 %, les primes restant constantes. Il atteint aussi **2,2 %** si l’anticipation reste à 2,0 % et que la prime de liquidité baisse à 0,1 point. La hausse observée est identique ; les mécanismes diffèrent.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 416" role="img" aria-labelledby="premium-tips-fr-title premium-tips-fr-desc" style="display:block;width:100%;max-width:560px;height:auto;margin-inline:auto;font-family:var(--font-read);background:var(--color-surface);border:1px solid var(--color-line);border-radius:12px">
<title id="premium-tips-fr-title">Un même point mort, deux causes</title>
<desc id="premium-tips-fr-desc">Deux scénarios hypothétiques pour un même horizon : le point mort passe de 1,9 % à 2,2 %. En A, l’anticipation monte ; en B, la prime de liquidité baisse. Anticipation et point mort en %, contributions des primes en points. Même échelle verticale ; calculs l0g, sans estimation de marché.</desc>
<text x="24" y="32" fill="var(--color-bright)" font-size="22" text-anchor="start" font-weight="700">Un même point mort, deux causes</text>
<text x="24" y="56" fill="var(--color-muted)" font-size="14" text-anchor="start">Exemples pédagogiques · % et points</text>
<text x="24" y="90" fill="var(--color-bright)" font-size="18" text-anchor="start" font-weight="600">A · anticipations en hausse</text>
<line x1="24" y1="185" x2="456" y2="185" stroke="var(--color-line)" stroke-width="1"/>
<rect x="36" y="132.1" width="65" height="52.9" rx="2" fill="var(--color-signal)"/>
<text x="68.5" y="122.1" fill="var(--color-bright)" font-size="17" text-anchor="middle" font-weight="700">2,3</text>
<text x="68.5" y="207" fill="var(--color-paper)" font-size="15" text-anchor="middle">Attente</text>
<line x1="101" y1="132.1" x2="141" y2="132.1" stroke="var(--color-muted)" stroke-width="1" stroke-dasharray="4 5"/>
<rect x="141" y="125.2" width="65" height="6.9" rx="2" fill="var(--color-amber)"/>
<text x="173.5" y="115.2" fill="var(--color-bright)" font-size="17" text-anchor="middle" font-weight="700">+0,3</text>
<text x="173.5" y="207" fill="var(--color-paper)" font-size="15" text-anchor="middle">Risque</text>
<line x1="206" y1="125.2" x2="246" y2="125.2" stroke="var(--color-muted)" stroke-width="1" stroke-dasharray="4 5"/>
<rect x="246" y="125.2" width="65" height="9.2" rx="2" fill="var(--color-accent)"/>
<text x="278.5" y="115.2" fill="var(--color-bright)" font-size="17" text-anchor="middle" font-weight="700">−0,4</text>
<text x="278.5" y="207" fill="var(--color-paper)" font-size="15" text-anchor="middle">Liquidité</text>
<line x1="311" y1="134.4" x2="351" y2="134.4" stroke="var(--color-muted)" stroke-width="1" stroke-dasharray="4 5"/>
<rect x="351" y="134.4" width="65" height="50.6" rx="2" fill="var(--color-paper)"/>
<text x="383.5" y="124.4" fill="var(--color-bright)" font-size="17" text-anchor="middle" font-weight="700">2,2</text>
<text x="383.5" y="207" fill="var(--color-paper)" font-size="15" text-anchor="middle">Point mort</text>
<text x="24" y="246" fill="var(--color-bright)" font-size="18" text-anchor="start" font-weight="600">B · liquidité améliorée</text>
<line x1="24" y1="341" x2="456" y2="341" stroke="var(--color-line)" stroke-width="1"/>
<rect x="36" y="295" width="65" height="46" rx="2" fill="var(--color-signal)"/>
<text x="68.5" y="285" fill="var(--color-bright)" font-size="17" text-anchor="middle" font-weight="700">2,0</text>
<text x="68.5" y="363" fill="var(--color-paper)" font-size="15" text-anchor="middle">Attente</text>
<line x1="101" y1="295" x2="141" y2="295" stroke="var(--color-muted)" stroke-width="1" stroke-dasharray="4 5"/>
<rect x="141" y="288.1" width="65" height="6.9" rx="2" fill="var(--color-amber)"/>
<text x="173.5" y="278.1" fill="var(--color-bright)" font-size="17" text-anchor="middle" font-weight="700">+0,3</text>
<text x="173.5" y="363" fill="var(--color-paper)" font-size="15" text-anchor="middle">Risque</text>
<line x1="206" y1="288.1" x2="246" y2="288.1" stroke="var(--color-muted)" stroke-width="1" stroke-dasharray="4 5"/>
<rect x="246" y="288.1" width="65" height="2.3" rx="2" fill="var(--color-accent)"/>
<text x="278.5" y="278.1" fill="var(--color-bright)" font-size="17" text-anchor="middle" font-weight="700">−0,1</text>
<text x="278.5" y="363" fill="var(--color-paper)" font-size="15" text-anchor="middle">Liquidité</text>
<line x1="311" y1="290.4" x2="351" y2="290.4" stroke="var(--color-muted)" stroke-width="1" stroke-dasharray="4 5"/>
<rect x="351" y="290.4" width="65" height="50.6" rx="2" fill="var(--color-paper)"/>
<text x="383.5" y="280.4" fill="var(--color-bright)" font-size="17" text-anchor="middle" font-weight="700">2,2</text>
<text x="383.5" y="363" fill="var(--color-paper)" font-size="15" text-anchor="middle">Point mort</text>
<text x="24" y="393" fill="var(--color-muted)" font-size="14" text-anchor="start">Départ commun : 2,0 + 0,3 − 0,4 = 1,9 %</text>
</svg>
<figcaption>Deux scénarios hypothétiques pour un même horizon : le point mort passe de 1,9 % à 2,2 %. En A, l’anticipation monte ; en B, la prime de liquidité baisse. Anticipation et point mort en %, contributions des primes en points. Même échelle verticale ; calculs l0g, sans estimation de marché. <a href="https://www.federalreserve.gov/econres/notes/feds-notes/tips-from-tips-update-and-discussions-20190521.html">Décomposition : Réserve fédérale</a>.</figcaption>
</figure>

Ces composantes sont choisies pour expliquer les signes, sans estimation empirique. Une lecture de marché doit chercher les données permettant de départager les scénarios : enquêtes d’anticipations, écarts entre instruments, conditions de négociation et estimations de modèles. Le modèle lui-même doit rester visible dans le diagnostic, avec son échantillon et ses hypothèses.

## Situer l’horizon de l’anticipation

Un point mort sur une maturité donnée agrège une période. Un mouvement lié aux prix proches peut modifier la moyenne même si les attentes plus lointaines évoluent peu. Les taux à terme permettent d’isoler un intervalle futur à partir de courbes cohérentes, mais leur calcul hérite des primes et des conventions des instruments utilisés.

Pour une comparaison temporelle, conservez la même méthode de courbe et la même maturité. Pour une comparaison entre instruments, documentez indexation, collatéral et liquidité. La [Fed de San Francisco sur la liquidité des TIPS](https://www.frbsf.org/research-and-insights/publications/economic-letter/2016/11/tips-liquidity-and-the-outlook-for-inflation/) montre l’intérêt de traiter explicitement ce facteur dans l’analyse des mouvements du point mort.

Le CPI indexe les TIPS selon leurs conventions, alors que la discussion de politique monétaire américaine peut porter sur le PCE. Cette différence de panier et de méthode doit accompagner le passage d’un prix de marché à un commentaire sur l’objectif d’inflation. Les guides du [CPI](/guides/lire-le-cpi-inflation-us/) et du [PCE](/guides/lire-le-pce-inflation-fed/) détaillent leurs périmètres.

## Construire un diagnostic reproductible

Notez les deux rendements, leurs sources et leur heure, puis la courbe, l’horizon et la formule retenus. Identifiez ensuite l’événement à expliquer : variation du point mort, du taux réel ou du rendement nominal. Une baisse du nominal peut accompagner une hausse du point mort si le taux réel recule davantage ; examiner les deux jambes évite d’attribuer au seul nominal le signal recherché.

Ajoutez enfin les preuves qui soutiennent votre interprétation des primes. Si leur ventilation reste inconnue, conservez plusieurs explications compatibles avec les données. Cette méthode se combine avec la [lecture du marché des Treasuries](/guides/lire-le-marche-des-treasuries/) et de ses conditions de financement.

## Sources et limites

TreasuryDirect décrit le contrat ; les travaux de la Réserve fédérale étudient la décomposition économique. Les nombres et la figure sont des exemples pédagogiques reproductibles, sans valeur de prévision. Le rendement réel coté contient ses propres primes ; une estimation d’inflation obtenue par modèle demeure dépendante de ce modèle. La conclusion doit préciser l’horizon et le degré d’identification réellement atteint.
