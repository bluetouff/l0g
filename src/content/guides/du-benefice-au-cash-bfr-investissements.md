---
title: "Du bénéfice au cash : BFR, investissements et flux disponibles"
description: "Réconcilier résultat et trésorerie, analyser stocks et créances, puis reconstruire le free cash flow. Un cas chiffré pour lire les comptes d’une entreprise."
summary: "Le résultat comptable et les encaissements suivent des calendriers différents. Le tableau de flux réconcilie ces montants, puis sépare exploitation, investissement et financement. Le free cash flow exige une définition explicite et une lecture des besoins futurs."
pubDate: 2026-10-19T10:40:00+02:00
tags: ["comptabilité", "entreprises", "cash-flow", "investissement"]
category: marches
draft: false
---

Une entreprise livre ses clients, constate un bénéfice et manque pourtant de liquidités pour payer ses fournisseurs. Cette situation devient compréhensible dès que l’on remet les opérations dans leur ordre : la vente peut précéder l’encaissement, le stock peut être payé avant sa livraison et une machine peut servir pendant plusieurs années après son achat. Le tableau de flux de trésorerie permet de relier ces calendriers.

Le guide s’adresse à la lecture d’une entreprise non financière. Il utilise un cas fictif annuel, en millions d’unités monétaires (M u.m.), dont chaque mouvement est explicité. Les banques et assureurs nécessitent une analyse particulière de leurs actifs, de leurs passifs et de leurs contraintes prudentielles.

## Relier le résultat à l’exploitation

Le compte de résultat répartit produits et charges selon les règles comptables. Le tableau des flux suit les entrées et sorties de trésorerie, classées entre **exploitation**, **investissement** et **financement**. Dans une présentation indirecte partant du résultat net, les ajustements retirent les éléments sans mouvement de cash correspondant et réconcilient les décalages d’exploitation. La [SEC présente ces articulations](https://www.sec.gov/about/reports-publications/beginners-guide-financial-statements).

Un amortissement répartit le coût d’un actif sur sa durée d’utilisation. Sa réintégration dans le rapprochement des flux corrige une charge de la période sans décaissement équivalent pendant cette période ; le paiement de l’actif apparaît ailleurs, lorsqu’il intervient. Cela invite à lire ensemble flux d’exploitation et investissements, surtout pour une activité qui doit renouveler régulièrement ses équipements.

La méthode dépend aussi du référentiel et du millésime des normes. [IAS 7](https://www.ifrs.org/issued-standards/list-of-standards/ias-7-statement-of-cash-flows/) organise le tableau en IFRS et documente ses évolutions. Avant de comparer deux groupes, alignez le classement des flux et le périmètre de consolidation plutôt que de vous fier à des intitulés semblables.

## Suivre le besoin en fonds de roulement

Pour notre cas, le **besoin en fonds de roulement d’exploitation**, ou BFR, est limité à stocks + créances clients − dettes fournisseurs. Une hausse des stocks ou des créances immobilise davantage de financement ; une hausse des dettes fournisseurs diffère un paiement. D’autres postes d’exploitation peuvent compter dans une entreprise réelle et doivent être ajoutés au rapprochement.

Imaginons **60 M u.m. de résultat net** et **20 M u.m. d’amortissements**, seuls ajustements non monétaires du cas. Les créances clients augmentent de 25, les stocks de 15 et les dettes fournisseurs de 10. Le BFR augmente donc de **30**, soit 25 + 15 − 10. Le flux d’exploitation atteint **50** : 60 + 20 − 30. Ces variations sont supposées provenir entièrement de l’activité, sans acquisition, cession, change ni reclassement.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 330" role="img" aria-labelledby="premium-cash-fr-title premium-cash-fr-desc" style="display:block;width:100%;max-width:600px;height:auto;margin-inline:auto;font-family:var(--font-read);background:var(--color-surface);border:1px solid var(--color-line);border-radius:12px">
<title id="premium-cash-fr-title">Du résultat au cash disponible</title>
<desc id="premium-cash-fr-desc">Calculs l0g, cas hypothétique annuel en M u.m. : résultat 60, amortissements 20, hausse du BFR 30, flux d’exploitation 50 et investissements payés 30. La hauteur et le point de départ des barres reproduisent la réconciliation ; FCF = exploitation − investissements.</desc>
<text x="24" y="32" fill="var(--color-bright)" font-size="22" text-anchor="start" font-weight="700">Du résultat au cash disponible</text>
<text x="24" y="56" fill="var(--color-muted)" font-size="14" text-anchor="start">Une réconciliation, avec les signes des flux</text>
<line x1="24" y1="245" x2="456" y2="245" stroke="var(--color-muted)" stroke-width="1"/>
<text x="24" y="80" fill="var(--color-muted)" font-size="15" text-anchor="start">M u.m. · une année fictive</text>
<rect x="24" y="149" width="56" height="96" rx="3" fill="var(--color-paper)"/>
<text x="52" y="137" fill="var(--color-bright)" font-size="18" text-anchor="middle" font-weight="700">60</text>
<text x="52" y="272" fill="var(--color-paper)" font-size="16" text-anchor="middle">Résultat</text>
<line x1="80" y1="149" x2="96" y2="149" stroke="var(--color-muted)" stroke-width="1" stroke-dasharray="4 5"/>
<rect x="96" y="117" width="56" height="32" rx="3" fill="var(--color-amber)"/>
<text x="124" y="105" fill="var(--color-bright)" font-size="18" text-anchor="middle" font-weight="700">+20</text>
<text x="124" y="272" fill="var(--color-paper)" font-size="16" text-anchor="middle">Amort.</text>
<line x1="152" y1="117" x2="168" y2="117" stroke="var(--color-muted)" stroke-width="1" stroke-dasharray="4 5"/>
<rect x="168" y="117" width="56" height="48" rx="3" fill="var(--color-accent)"/>
<text x="196" y="105" fill="var(--color-bright)" font-size="18" text-anchor="middle" font-weight="700">−30</text>
<text x="196" y="272" fill="var(--color-paper)" font-size="16" text-anchor="middle">BFR</text>
<line x1="224" y1="165" x2="240" y2="165" stroke="var(--color-muted)" stroke-width="1" stroke-dasharray="4 5"/>
<rect x="240" y="165" width="56" height="80" rx="3" fill="var(--color-paper)"/>
<text x="268" y="153" fill="var(--color-bright)" font-size="18" text-anchor="middle" font-weight="700">50</text>
<text x="268" y="272" fill="var(--color-paper)" font-size="16" text-anchor="middle">Explo.</text>
<line x1="296" y1="165" x2="312" y2="165" stroke="var(--color-muted)" stroke-width="1" stroke-dasharray="4 5"/>
<rect x="312" y="165" width="56" height="48" rx="3" fill="var(--color-accent)"/>
<text x="340" y="153" fill="var(--color-bright)" font-size="18" text-anchor="middle" font-weight="700">−30</text>
<text x="340" y="272" fill="var(--color-paper)" font-size="16" text-anchor="middle">Capex</text>
<line x1="368" y1="213" x2="384" y2="213" stroke="var(--color-muted)" stroke-width="1" stroke-dasharray="4 5"/>
<rect x="384" y="213" width="56" height="32" rx="3" fill="var(--color-signal)"/>
<text x="412" y="201" fill="var(--color-bright)" font-size="18" text-anchor="middle" font-weight="700">20</text>
<text x="412" y="272" fill="var(--color-paper)" font-size="16" text-anchor="middle">FCF</text>
<text x="24" y="307" fill="var(--color-muted)" font-size="16" text-anchor="start">60 + 20 − 30 = 50</text>
<text x="456" y="307" fill="var(--color-signal)" font-size="16" text-anchor="end" font-weight="700">50 − 30 = 20</text>
</svg>
<figcaption>Calculs l0g, cas hypothétique annuel en M u.m. : résultat 60, amortissements 20, hausse du BFR 30, flux d’exploitation 50 et investissements payés 30. La hauteur et le point de départ des barres reproduisent la réconciliation ; FCF = exploitation − investissements. <a href="https://www.sec.gov/about/reports-publications/beginners-guide-financial-statements">Méthode : SEC</a>.</figcaption>
</figure>

Avec **30 M u.m. de dépenses d’investissement payées**, le flux disponible retenu ici vaut **20** : 50 − 30. La cascade conserve les signes économiques des mouvements. Les amortissements réintégrés ne créent aucune richesse supplémentaire ; les clients et les stocks mobilisent des ressources, tandis que les fournisseurs en financent temporairement une partie.

Une variation brute entre deux bilans peut mélanger des flux d’exploitation et des changements de périmètre. Si un groupe acquiert une filiale portant des stocks, ces stocks entrent au bilan sans correspondre intégralement à des achats d’exploitation de la période. Le tableau de flux et ses notes fournissent le rapprochement à privilégier. La [SEC souligne l’importance du classement et des contrôles de ce tableau](https://www.sec.gov/newsroom/speeches-statements/munter-statement-cash-flows-120423).

## Tester la qualité de la conversion en cash

Reprenons le cas précédent. Si les créances augmentent de 45 au lieu de 25, toutes les autres hypothèses restant identiques, le BFR absorbe 50, le flux d’exploitation tombe à 30 et le flux disponible à zéro. Le résultat reste de 60. Le diagnostic dépend alors de l’origine des créances : croissance des ventes à crédit, décalage saisonnier, allongement contractuel des délais ou difficultés de recouvrement.

Pour les départager, rapprochez les créances du chiffre d’affaires, les stocks du coût des ventes et les dettes fournisseurs des achats lorsque cette donnée existe. Comparez des périodes de durée et de saisonnalité similaires. L’âge des créances, les provisions, les conditions commerciales et les commentaires de gestion apportent une information plus précise qu’un seul ratio annuel.

Un délai de règlement allongé peut soutenir le cash d’un exercice tout en tendant la relation fournisseurs. À l’inverse, constituer des stocks peut répondre à une croissance attendue ou à une sécurisation des approvisionnements. L’analyse consiste à vérifier la cohérence entre la variation du BFR, le fonctionnement de l’activité et les engagements futurs. Notre [guide du 10-K](/guides/lire-le-10-k-sec/) aide à retrouver les notes nécessaires.

## Définir le flux disponible avant de le comparer

Le **free cash flow**, ou FCF, est souvent présenté comme le flux d’exploitation diminué des dépenses d’investissement. La [SEC rappelle, dans la question 102.07](https://www.sec.gov/rules-regulations/staff-guidance/corporation-finance-interpretations/non-gaap-financial-measures), que cette mesure ne possède pas de définition uniforme. Elle demande une description claire du calcul et un rapprochement avec les mesures comptables pertinentes.

Dans notre convention, FCF = flux d’exploitation − investissements payés. On conserve donc les acquisitions de sociétés, remboursements de dette, dividendes et rachats d’actions à part. Des sorties obligatoires peuvent encore peser sur les 20 M u.m. calculés. L’étiquette « disponible » ne suffit pas à établir un montant distribuable aux actionnaires.

La séparation entre investissement de maintenance et de croissance demande également des preuves. Une direction peut proposer une estimation, mais l’analyste doit en examiner la méthode : quels équipements sont remplacés, quelle capacité est ajoutée, quels coûts seraient nécessaires pour conserver l’activité ? Sans ventilation documentée, gardez le total publié et explicitez les scénarios au lieu de fabriquer un « vrai » FCF.

## Réconcilier la variation de trésorerie finale

Ajoutons au cas initial un remboursement de dette de 15 et un dividende de 8, sans autre flux ni effet de change. Les 20 M u.m. après investissements deviennent une **diminution de trésorerie de 3** : 20 − 15 − 8. Cette dernière étape relie la capacité opérationnelle aux décisions de financement et de distribution. La [fiche de la SEC sur le tableau des flux](https://www.sec.gov/files/cash-flow-statement-bblocks.pdf) distingue les trois catégories utilisées dans ce rapprochement.

Pour analyser plusieurs exercices, reconstruisez la même définition année après année, puis expliquez les écarts : conversion du résultat, variation du BFR, investissement et financement. Une série de cash plus faible peut accompagner un programme industriel cohérent ; sa soutenabilité dépend alors des ressources mobilisées et des échéances. Le [guide de la dette d’entreprise](/guides/lire-la-dette-d-une-entreprise/) prolonge cette lecture.

## Sources et limites

Les documents SEC et IFRS servent de références pour les définitions et la présentation ; tous les chiffres du cas sont pédagogiques. Les hypothèses excluent impôts différés, paiements en actions, locations, acquisitions et différences de change afin d’isoler le mécanisme. Pour un émetteur réel, réintroduisez les postes matériels et leurs notes avant toute comparaison. La qualité du cash se juge avec sa provenance, sa répétabilité et les obligations restant à financer.
