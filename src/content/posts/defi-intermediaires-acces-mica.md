---
title: "Qui tient la porte d’entrée de la DeFi ?"
seoTitle: "DeFi : frais, contrôle et projet MiCA sur les interfaces | l0g"
description: "L’ESMA propose d’encadrer l’accès à la DeFi. Frais, rendements, liquidations et gouvernance : suivre l’argent et les pouvoirs derrière les interfaces."
pubDate: "2026-10-01T18:14:17+02:00"
updatedDate: "2026-10-01T18:14:17+02:00"
tags: ["DeFi", "MiCA", "crypto", "risque", "Europe"]
draft: false
quickTake:
  fact: "Le 30 septembre 2026, l’ESMA a proposé un service réglementé pour les acteurs qui donnent accès à la DeFi."
  importance: "Une interface peut sélectionner les protocoles et prélever des frais tandis que les retraits et liquidations dépendent des contrats sous-jacents."
  uncertainty: "La proposition doit encore être examinée. La détention des clés et l’agrément d’un prestataire ne garantissent ni une sortie liquide ni le remboursement du capital."
ogImage: "/illustrations/news/defi-gateways-access-2026-v1.jpg"
---

Un portefeuille connecté, un montant, une signature. L’écran donne à l’utilisateur l’impression d’agir seul. Prenons un parcours hypothétique : il choisit une application, échange des tokens, puis en place une partie dans un protocole de prêt. Il conserve ses clés, mais quelqu’un a choisi les produits visibles, préparé la transaction et, éventuellement, fixé une commission.

La [finance décentralisée, ou DeFi](/glossaire/defi/), organise des échanges et des financements au moyen de programmes exécutés sur une blockchain. L’accès à ces programmes peut pourtant passer par une entreprise. C’est cette articulation que l’ESMA, l’autorité européenne des marchés financiers, veut mieux encadrer : **elle propose, le 30 septembre 2026, de créer un service réglementé d’accès à la DeFi** dans la révision de MiCA. [1](#source-1)

Au 1er octobre, le dossier reste une contribution à une réforme. La consultation de la Commission s’est achevée le 30 septembre à 23 h 59, heure d’Europe centrale d’été. Ses résultats alimenteront des rapports et pourront déboucher sur une proposition législative. Le périmètre final de ce nouveau service, ses obligations et son calendrier d’application restent donc à déterminer. [3](#source-3)

## Une signature au bout d’un parcours commercial

Un *smart contract* est un programme déployé sur la blockchain, dont les fonctions sont appelées par des transactions. Une interface traduit cette mécanique en boutons compréhensibles. Elle peut chercher une route d’échange, calculer un montant indicatif ou préparer une autorisation de transfert. Le portefeuille présente ensuite l’opération à signer. [14](#source-14)[10](#source-10)

Dans ce parcours hypothétique sans garde, les actifs vont du portefeuille vers les contrats du protocole. L’exploitant de l’interface organise l’accès sans nécessairement détenir les clés du client. Ces deux fonctions se séparent techniquement ; leur importance économique demeure entière. [10](#source-10)

Imaginons deux applications donnant accès au même marché. L’une met en avant un protocole de prêt ; l’autre préfère un échange. Elles peuvent afficher des avertissements différents et ordonner autrement les résultats. Même lorsque les contrats sous-jacents sont identiques, la présentation oriente ce que l’utilisateur comprend et choisit. C’est le point de départ de notre analyse : examiner le pouvoir exercé sur le parcours, puis suivre séparément le pouvoir exercé sur les fonds.

L’accès direct aux contrats existe dans les procédures documentées par Aave, aussi bien pour fournir des tokens que pour les retirer. Il exige néanmoins de savoir quelle fonction appeler, sur quelle adresse et dans quel état du marché. Le service rendu par une interface tient notamment à cette réduction de la difficulté d’utilisation. Ce travail peut être facturé ; l’enjeu consiste à en identifier le prix, le bénéficiaire et les limites. [10](#source-10)[11](#source-11)

La catégorie juridique dépend ensuite de l’activité réelle. MiCA définit déjà des services comme la conservation, l’échange, l’exécution d’ordres ou le conseil. L’absence de garde des clés répond à une question précise ; les autres fonctions doivent aussi être examinées. Cet article ne qualifie juridiquement aucun des protocoles ou logiciels cités. [4](#source-4)

## Le prix du bouton et le résultat de l’opération

La FAQ de MetaMask indique une commission de service de **0,875 % pour Swaps**, automatiquement incluse dans chaque devis. Appliquée à une assiette hypothétique de 10 000 dollars, elle représente 87,50 dollars. C’est un exemple documenté de rémunération de l’accès. Il décrit une composante tarifaire, à la date de consultation, sans fournir à lui seul le coût complet d’une transaction. [9](#source-9)

Pour comparer deux parcours, il faut regarder ce qui arrive effectivement à destination. Le prix obtenu dans le marché, les frais déjà incorporés au devis et le coût du réseau interviennent ensemble. Ajouter une seconde fois une commission déjà incluse gonflerait artificiellement la facture. Une tolérance de glissement, qui fixe l’écart d’exécution accepté, est encore autre chose : ce plafond de protection ne constitue pas un montant forcément prélevé. [9](#source-9)

Notre comparaison chiffrée utilise **deux devis entièrement fictifs**, sans les attribuer à des entreprises. Pour une mise de référence de 10 000 dollars, la route A supporte un écart de cotation de 40 dollars, une commission d’interface de 87,50 dollars et un coût réseau de 10 dollars. Sa valeur nette ressort à 9 862,50 dollars. La route B, sans commission d’interface, présente un écart de cotation de 160 dollars et les mêmes frais réseau : elle aboutit à 9 830 dollars.

A livre ici 32,50 dollars de plus. L’exercice illustre l’information utile au client : une comparaison complète, sur une même référence et à un même instant. L’écart au prix de référence peut intégrer l’état du marché, les frais de pool ou l’impact de l’ordre ; le modèle ne l’attribue pas au revenu de l’interface. Les frais réseau sont valorisés en dollars et déduits pour comparer, même s’ils sont payés dans un autre actif.

Une rémunération différente selon les destinations peut également créer un conflit commercial. Prenons une interface hypothétique rémunérée par les protocoles qu’elle sélectionne : son intérêt pourrait diverger de celui du client. Il faudrait alors connaître les accords, les critères de classement et les routes écartées. MiCA impose déjà aux prestataires concernés la publication de leurs politiques tarifaires et la gestion des conflits d’intérêts. La discussion actuelle porte aussi sur l’application de ces responsabilités aux nouveaux modes d’accès. [5](#source-5)[6](#source-6)

## Le rendement vient de quelqu’un

Le bouton « placer » mérite le même travail. Dans un pool de prêt, les tokens apportés sont transférés à des contrats qui les rendent disponibles aux emprunteurs. La documentation Aave relie le taux servi à l’utilisation du pool et à des paramètres de gouvernance. Les conditions évoluent avec les opérations. [10](#source-10)

Construisons un cas volontairement simple. Des prêteurs apportent un million de dollars ; 800 000 sont empruntés pendant un an à 6 % d’intérêt simple. Les emprunteurs versent 48 000 dollars. Si le protocole en affecte 20 % à sa trésorerie, il conserve 9 600 dollars et en attribue 38 400 aux prêteurs. Rapporté au million apporté, le rendement de ces derniers est de 3,84 %.

Ajoutons un distributeur fictif qui prélève 10 % des intérêts revenant aux prêteurs. Il reçoit 3 840 dollars ; les prêteurs conservent 34 560 dollars, soit **3,456 % de leur apport**. Les trois bénéficiaires se partagent bien les 48 000 dollars payés par les emprunteurs. Aucune rémunération supplémentaire n’est créée par le nombre d’interfaces traversées.

<figure class="infographic" style="max-width:28rem;margin:2rem auto;padding-bottom:1.25rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 406" role="img" aria-labelledby="defi-fr-interest-title defi-fr-interest-desc" style="width:100%;height:auto">
<title id="defi-fr-interest-title">48 000 $ : qui reçoit quoi ?</title>
<desc id="defi-fr-interest-desc">Modèle · flux sur une année. Prêteurs : 34560 ; Trésorerie du protocole : 9600 ; Distributeur : 3840</desc>
<rect width="480" height="406" rx="12" fill="var(--color-surface)" />
<text x="28" y="40" text-anchor="start" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700">48 000 $ : qui reçoit quoi ?</text>
<text x="28" y="72" text-anchor="start" fill="var(--color-muted)" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400">Modèle · flux sur une année</text>
<text x="28" y="116" text-anchor="start" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="400">Prêteurs</text>
<rect x="28" y="128" width="216.00000000" height="18" fill="var(--color-signal)" />
<text x="452" y="146" text-anchor="end" fill="var(--color-signal)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700">34 560</text>
<text x="28" y="196" text-anchor="start" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="400">Trésorerie du protocole</text>
<rect x="28" y="208" width="60.00000000" height="18" fill="var(--color-amber)" />
<text x="452" y="226" text-anchor="end" fill="var(--color-amber)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700">9 600</text>
<text x="28" y="276" text-anchor="start" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="400">Distributeur</text>
<rect x="28" y="288" width="24.00000000" height="18" fill="var(--color-accent)" />
<text x="452" y="306" text-anchor="end" fill="var(--color-accent)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700">3 840</text>
<path d="M28 330 H328" stroke="var(--color-line-strong)" fill="none" />
<text x="28" y="358" text-anchor="middle" fill="var(--color-muted)" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400">0</text>
<text x="178" y="358" text-anchor="middle" fill="var(--color-muted)" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400">24</text>
<text x="328" y="358" text-anchor="middle" fill="var(--color-muted)" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400">48 k$</text>
</svg>
<figcaption>Modèle pédagogique l0g : 800 000 $ empruntés à 6 % pendant un an ; 20 % des intérêts à la trésorerie, puis 10 % des intérêts des prêteurs au distributeur. Les parts totalisent les 48 000 $ versés. Capital constant de 1 M$ fourni ; rendement simple net de 3,456 %. Aucun taux réel de protocole n’est représenté. Mécanisme : <a href="#source-10">documentation Aave</a>. <a href="/data/defi-lending-model.csv">Hypothèses et calculs CSV</a>.</figcaption>
</figure>

Ces paramètres ne sont ceux d’aucun marché Aave ni d’aucun distributeur identifié. Le modèle suppose des encours constants, un actif valant un dollar, aucun défaut, aucune capitalisation des intérêts, aucune récompense en tokens et aucune fiscalité. Son utilité tient au rapprochement des flux : qui paie, qui prélève et sur quelle assiette ? Un prélèvement de 10 % sur les intérêts représente ici 0,384 point du capital apporté.

Il reste aussi une question de sortie. Dans cet exemple, seuls 200 000 dollars sont disponibles avant remboursements ou nouveaux apports. Des retraits demandés de 300 000 dollars excèdent donc cette liquidité de 100 000. Aave précise que le retrait dépend du montant non emprunté disponible et, le cas échéant, des contraintes liées au collatéral. Notre exemple ne suppose ni file d’attente contractuelle ni délai garanti. [11](#source-11)

La conservation des clés permet d’autoriser des opérations. Une fois les tokens fournis au pool, leur disponibilité dépend de son fonctionnement. C’est une limite concrète à expliquer avant de présenter l’accès comme entièrement autonome. [10](#source-10)[11](#source-11)

## Garantie et seuil de liquidation

Passons du côté de l’emprunteur. Un protocole de prêt surgaranti demande des actifs en garantie, appelés *collatéral*. Dans le mécanisme décrit par Aave, le facteur de santé compare la valeur de cette garantie, pondérée par un [seuil de liquidation](/glossaire/facteur-de-sante/), au montant de la dette. En dessous de 1, une position devient liquidable. [12](#source-12)

Notre second modèle retient 15 000 dollars de garantie, 10 000 de dette et un seuil de liquidation hypothétique de 80 %. Le facteur de santé vaut 1,20. Il atteint la frontière de 1 lorsque la garantie descend à 12 500 dollars : une baisse de **16,7 %** suffit. Le seuil de liquidation se distingue de la limite autorisant l’emprunt initial ; le modèle suppose que la position de départ a été autorisée.

À 12 000 dollars de garantie, le facteur tombe à 0,96. Supposons qu’un liquidateur rembourse 4 000 dollars de dette en contrepartie de 4 200 dollars de collatéral, soit un bonus hypothétique de 5 %. Il reste 7 800 dollars de garantie pour 6 000 de dette : le facteur remonte à 1,04. La valeur nette de la position passe de 2 000 à 1 800 dollars. Les 200 dollars d’écart correspondent au bonus brut du liquidateur, avant ses coûts d’exécution.

<figure class="infographic" style="max-width:28rem;margin:2rem auto;padding-bottom:1.25rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 480" role="img" aria-labelledby="defi-fr-health-title defi-fr-health-desc" style="width:100%;height:auto">
<title id="defi-fr-health-title">Avant et après liquidation</title>
<desc id="defi-fr-health-desc">Modèle · facteur de santé (HF). Départ · 15 000 $ / 10 000 $ : 1.2 ; Frontière · 12 500 $ / 10 000 $ : 1 ; Baisse · 12 000 $ / 10 000 $ : 0.96 ; Après · 7 800 $ / 6 000 $ : 1.04</desc>
<rect width="480" height="480" rx="12" fill="var(--color-surface)" />
<text x="28" y="40" text-anchor="start" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700">Avant et après liquidation</text>
<text x="28" y="72" text-anchor="start" fill="var(--color-muted)" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400">Modèle · facteur de santé (HF)</text>
<text x="28" y="116" text-anchor="start" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="400">Départ · 15 000 $ / 10 000 $</text>
<rect x="28" y="128" width="240.00000000" height="18" fill="var(--color-signal)" />
<text x="452" y="146" text-anchor="end" fill="var(--color-signal)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700">1,20</text>
<path d="M228 126 V148" stroke="var(--color-amber)" stroke-width="2" fill="none" />
<text x="28" y="190" text-anchor="start" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="400">Frontière · 12 500 $ / 10 000 $</text>
<rect x="28" y="202" width="200.00000000" height="18" fill="var(--color-amber)" />
<text x="452" y="220" text-anchor="end" fill="var(--color-amber)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700">1,00</text>
<path d="M228 200 V222" stroke="var(--color-amber)" stroke-width="2" fill="none" />
<text x="28" y="264" text-anchor="start" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="400">Baisse · 12 000 $ / 10 000 $</text>
<rect x="28" y="276" width="192.00000000" height="18" fill="var(--color-accent)" />
<text x="452" y="294" text-anchor="end" fill="var(--color-accent)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700">0,96</text>
<path d="M228 274 V296" stroke="var(--color-amber)" stroke-width="2" fill="none" />
<text x="28" y="338" text-anchor="start" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="400">Après · 7 800 $ / 6 000 $</text>
<rect x="28" y="350" width="208.00000000" height="18" fill="var(--color-signal)" />
<text x="452" y="368" text-anchor="end" fill="var(--color-signal)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700">1,04</text>
<path d="M228 348 V370" stroke="var(--color-amber)" stroke-width="2" fill="none" />
<path d="M28 392 H328" stroke="var(--color-line-strong)" fill="none" />
<text x="28" y="420" text-anchor="middle" fill="var(--color-muted)" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400">0</text>
<text x="178" y="420" text-anchor="middle" fill="var(--color-muted)" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400">0,75</text>
<text x="328" y="420" text-anchor="middle" fill="var(--color-muted)" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400">1,5</text>
<text x="28" y="462" text-anchor="start" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="700">Traits ambre : HF = 1</text>
</svg>
<figcaption>Modèle pédagogique l0g : chaque libellé donne la garantie puis la dette en dollars. HF = garantie × 80 % / dette. Sous 1, liquidation possible. À 12 000 $ de garantie, remboursement hypothétique de 4 000 $ contre 4 200 $ de garantie, avec bonus brut de 5 %. La valeur nette baisse de 200 $ ; les coûts d’exécution sont exclus. Ces paramètres ne décrivent aucun déploiement actuel. Mécanisme : <a href="#source-12">Aave</a>. <a href="/data/defi-liquidation-model.csv">Hypothèses et calculs CSV</a>.</figcaption>
</figure>

Les chiffres servent à comprendre une liquidation partielle, sans reproduire les paramètres d’un déploiement réel. Dans le mécanisme documenté, un participant soumet une transaction de liquidation lorsque les conditions sont réunies. Le calcul repose notamment sur la valorisation des garanties ; sa réalisation dépend de l’exécution sur le réseau. Une notification envoyée par l’interface peut aider l’utilisateur à réagir, mais un délai d’alerte commerciale n’allonge pas, à lui seul, les règles du contrat. [12](#source-12)

Cela donne une façon concrète d’attribuer les responsabilités. Une erreur de calcul affichée à l’écran, une mauvaise donnée de prix et une règle de liquidation mal comprise se situent à des endroits différents. Il faut reconstruire la cause et le pouvoir de chaque acteur avant d’en déduire une responsabilité juridique ou une indemnisation.

## Le code public possède parfois des administrateurs

L’examen se poursuit derrière le contrat. Dans les architectures qui prévoient des droits d’administration, certaines clés peuvent modifier des paramètres, attribuer des rôles ou déclencher des changements de logique. OpenZeppelin documente ces mécanismes ainsi que les [*timelocks*](/glossaire/timelock/), des délais entre la programmation d’une opération et son exécution. Ils donnent aux utilisateurs du temps pour examiner un changement. La configuration exacte dépend de chaque déploiement. [13](#source-13)

L’analyse doit donc identifier la version du code, les pouvoirs encore actifs et les conditions de leur utilisation. Qui peut proposer ? Qui peut approuver ? Qui peut exécuter ? Un même acteur peut occuper plusieurs fonctions. Et même lorsqu’un changement est annoncé à l’avance, une sortie effective suppose encore une liquidité disponible et un accès opérationnel au protocole. [13](#source-13)[11](#source-11)

Les tokens de gouvernance constituent un autre étage. Un document de recherche publié par la BCE en mars 2026 étudie notamment leur détention dans quatre protocoles. Pour **mai 2023**, son tableau 3 attribue aux cinq premiers détenteurs 48 % des tokens AAVE, 59 % des FORTH, 38 % des MKR et 46 % des UNI. Il s’agit d’un instantané historique étudié par les auteurs, sans qualification réglementaire des protocoles. [8](#source-8)[16](#source-16)

<figure class="infographic" style="max-width:28rem;margin:2rem auto;padding-bottom:1.25rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 420" role="img" aria-labelledby="defi-fr-governance-title defi-fr-governance-desc" style="width:100%;height:auto">
<title id="defi-fr-governance-title">Les cinq premiers détenteurs</title>
<desc id="defi-fr-governance-desc">Part des tokens · mai 2023. AAVE : 48 ; FORTH : 59 ; MKR : 38 ; UNI : 46</desc>
<rect width="480" height="420" rx="12" fill="var(--color-surface)" />
<text x="28" y="40" text-anchor="start" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700">Les cinq premiers détenteurs</text>
<text x="28" y="72" text-anchor="start" fill="var(--color-muted)" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400">Part des tokens · mai 2023</text>
<text x="28" y="116" text-anchor="start" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="400">AAVE</text>
<rect x="28" y="128" width="144.00000000" height="18" fill="var(--color-signal)" />
<text x="452" y="146" text-anchor="end" fill="var(--color-signal)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700">48 %</text>
<text x="28" y="186" text-anchor="start" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="400">FORTH</text>
<rect x="28" y="198" width="177.00000000" height="18" fill="var(--color-signal)" />
<text x="452" y="216" text-anchor="end" fill="var(--color-signal)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700">59 %</text>
<text x="28" y="256" text-anchor="start" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="400">MKR</text>
<rect x="28" y="268" width="114.00000000" height="18" fill="var(--color-signal)" />
<text x="452" y="286" text-anchor="end" fill="var(--color-signal)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700">38 %</text>
<text x="28" y="326" text-anchor="start" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="400">UNI</text>
<rect x="28" y="338" width="138.00000000" height="18" fill="var(--color-signal)" />
<text x="452" y="356" text-anchor="end" fill="var(--color-signal)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700">46 %</text>
<path d="M28 380 H328" stroke="var(--color-line-strong)" fill="none" />
<text x="28" y="408" text-anchor="middle" fill="var(--color-muted)" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400">0</text>
<text x="178" y="408" text-anchor="middle" fill="var(--color-muted)" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400">50</text>
<text x="328" y="408" text-anchor="middle" fill="var(--color-muted)" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400">100 %</text>
</svg>
<figcaption>Source : <a href="#source-8">Born et al., BCE, WP 3208</a>, tableau 3, page 25 ; Etherscan et calculs des auteurs. Part des tokens détenue par les cinq premiers détenteurs, observations de mai 2023, publication de mars 2026. La mesure porte sur les détentions, sans mesurer les votes exprimés ni la gouvernance actuelle. <a href="/data/defi-governance-may2023.csv">Données CSV</a>.</figcaption>
</figure>

Ces détentions ne décrivent ni les votes effectivement exprimés ni quatre gouvernances actuelles. Une adresse peut agréger les avoirs de clients ; un bénéficiaire peut aussi utiliser plusieurs adresses. Le papier souligne les difficultés d’identification. La concentration des tokens est donc un indice à compléter par les délégations, les quorums et les droits d’administration. [8](#source-8)

Pour une interface qui sélectionne un protocole, cette distinction a une portée économique : un bon rendement affiché renseigne sur une rémunération, tandis que l’étude des pouvoirs renseigne sur les personnes ou mécanismes susceptibles d’en modifier les conditions. Les deux examens répondent à des questions différentes.

## Le projet européen cible la porte d’entrée

La proposition vise les prestataires sur crypto-actifs, ou PSCA, qui organisent l’accès aux protocoles. L’ESMA envisage des obligations concernant les risques, la sélection et le routage, les conflits d’intérêts, les vérifications préalables et la sécurité. Elle demande aussi davantage de clarté sur la notion de décentralisation complète. Le texte précise que le développement open source et l’auto-conservation ne devraient pas être automatiquement assimilés à une intermédiation réglementée ; les obligations seraient proportionnées au contrôle exercé. [2](#source-2)

Le droit actuel fournit déjà une partie du cadre. L’article 66 de MiCA exige une information loyale, claire et non trompeuse, des avertissements sur les risques et des politiques de prix accessibles. L’article 72 traite des conflits d’intérêts. L’ajout proposé devra s’articuler avec ces obligations et les catégories de services existantes. [4](#source-4)[5](#source-5)[6](#source-6)

L’ESMA souhaite également que l’exemption associée aux services entièrement décentralisés soit définie de manière restrictive, afin de limiter les contournements. Elle propose soit une définition dans MiCA, soit des orientations techniques habilitées par le règlement. Cette intention précise l’angle de sa contribution ; elle ne tranche pas aujourd’hui la qualification d’une application particulière. [2](#source-2) (§3.3, page 6)

Cette articulation compte particulièrement lorsqu’une application combine plusieurs activités. Une opération d’échange, un accès au prêt et un service de validation de blockchain peuvent produire des revenus et des risques différents. Le service de *staking*, lié à la validation d’un réseau, mérite une analyse distincte de celle d’un prêt ; l’ESMA traite d’ailleurs ces activités séparément dans sa contribution. [2](#source-2)

Le périmètre du produit compte également. Un actif qualifié d’instrument financier peut relever d’autres règles que MiCA. Quant à la question des services entièrement décentralisés sans intermédiaire, l’ESMA souligne précisément les divergences d’interprétation à résoudre. Une marque, une commission ou un dépôt de code, pris isolément, ne suffisent donc pas à conclure ici au statut juridique d’un service. [15](#source-15)[2](#source-2)

## La marque rassure ; les risques restent à décrire

Le prestataire d’accès peut devenir le point de contact identifiable : explication d’une transaction, correction d’un affichage, traitement d’une réclamation. Ce rôle est compatible avec une autonomie limitée sur les contrats sous-jacents. Il faut alors décrire exactement les vérifications effectuées, les alertes possibles et les pouvoirs disponibles en cas d’incident.

Une autorisation attachée à l’entreprise peut cependant être comprise comme une validation de toute son offre. L’ESMA avait déjà signalé cet « effet de halo » en juillet 2025, lorsque des prestataires autorisés proposaient aussi des produits ou services non réglementés. L’autorité demandait d’expliciter leur statut à chaque étape de la vente. L’agrément d’un intermédiaire ne constitue donc pas une certification générale des protocoles accessibles ni une promesse de remboursement du capital. [7](#source-7)

Il existe aussi un arbitrage économique à examiner. Dans un scénario où chaque passerelle doit supporter un coût fixe de vérification et de suivi, un acteur disposant d’une grande clientèle peut le répartir sur davantage d’utilisateurs. Cela pourrait favoriser les grandes interfaces ou un catalogue plus resserré. À l’inverse, des exigences claires pourraient rendre des services plus comparables et réduire l’incertitude des nouveaux entrants. Ce sont des mécanismes plausibles, dont l’ampleur dépendra du texte retenu et des coûts réellement observés.

L’accès direct aux contrats demeure un contrepoint important. Un utilisateur compétent peut réduire sa dépendance à une interface donnée, lorsque le protocole et son architecture le permettent. Il reprend alors une partie du travail de vérification et de suivi. La répartition entre autonomie, service commercial et responsabilité se joue à ce niveau précis. [10](#source-10)[11](#source-11)

Au stade actuel, la question décisive tient dans le parcours d’une opération : quel résultat net est proposé, qui reçoit les frais, qui peut modifier les conditions et qui peut réellement agir lorsque quelque chose se passe mal ? Le projet européen cherche un cadre pour cette porte d’entrée. L’analyse économique doit, elle, continuer jusqu’aux contrats, aux emprunteurs et aux garanties qui déterminent ce que l’utilisateur récupérera.

## Poursuivre l’enquête

Le [guide MiCA, sigle par sigle](/guides/mica-sigle-par-sigle/) précise les catégories réglementaires. L’enquête sur le [dollar stablecoin et son remboursement](/posts/stablecoin-reserves-delai-remboursement-dollar/) suit la chaîne de sortie ; celle sur [CCIP et les droits sur les actifs](/posts/ccip-2-0-actifs-regles-crypto-finance/) examine la distance entre transfert technique et droit financier.

## Sources et documents

<ol class="l0g-defi-sources">
<li id="source-1"><a href="https://www.esma.europa.eu/press-news/esma-news/esma-calls-changes-make-mica-clearer-safer-and-ready-emerging-services">ESMA : ESMA calls for changes to make MiCA clearer, safer and ready for emerging services</a>. Introduction et sections sur le périmètre et les nouveaux services.</li>
<li id="source-2"><a href="https://www.esma.europa.eu/sites/default/files/2026-09/ESMA75-113276571-1721_Response_to_the_EC_consultation_MiCA_regulation_review.pdf">ESMA : Response to the EC consultation on the review of Regulation (EU) 2023/1114 (MiCA), ESMA75-113276571-1721</a>. Sections 3.3–3.4, pages 6–7 ; transparence des coûts, page 12 ; staking et prêt, pages 13–14.</li>
<li id="source-3"><a href="https://finance.ec.europa.eu/regulation-and-supervision/consultations-0/targeted-consultation-review-mica-regulation_en">Commission européenne / European Commission : Targeted consultation on the review of MiCA Regulation</a>. Rubriques « Details » et « Why we are consulting ».</li>
<li id="source-4"><a href="https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/mica/article-3-definitions">ESMA, Interactive Single Rulebook : MiCA, Article 3: Definitions</a>. Article 3(1)(15)–(17), (21), (23), (38).</li>
<li id="source-5"><a href="https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/mica/article-66-obligation-act-honestly-fairly">ESMA, Interactive Single Rulebook : MiCA, Article 66: Obligation to act honestly, fairly and professionally</a>. Article 66(1)–(4).</li>
<li id="source-6"><a href="https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/mica/article-72-identification-prevention">ESMA, Interactive Single Rulebook : MiCA, Article 72: Conflicts of interest</a>. Article 72(1)–(5).</li>
<li id="source-7"><a href="https://www.esma.europa.eu/press-news/esma-news/investors-should-consider-risks-unregulated-products-offered-regulated-crypto">ESMA : Investors should consider risks of unregulated products offered by regulated crypto assets entities</a>. Communiqué du 11 juillet 2025.</li>
<li id="source-8"><a href="https://www.ecb.europa.eu/pub/pdf/scpwps/ecb.wp3208~051a880042.en.pdf">ECB Working Paper Series; Alexandra Born, Zakaria Gati, Claudia Lambert, Mahvish Naeem, Antonella Pellicani : Who to regulate? Identifying actors within DeFi’s governance, WP 3208</a>. Tableau 3, page 25 ; méthode d’identification des détenteurs.</li>
<li id="source-9"><a href="https://metamask.io/faqs">MetaMask : Frequently asked questions: Does MetaMask charge a fee on Swaps?</a>. Rubrique sur les frais de Swaps.</li>
<li id="source-10"><a href="https://www.aave.com/help/supplying/supply-tokens">Aave : Supply Tokens</a>. Introduction et étapes 3–4.</li>
<li id="source-11"><a href="https://aave.com/help/supplying/withdraw-tokens">Aave : Withdraw Tokens</a>. Introduction et étapes 3 et 5.</li>
<li id="source-12"><a href="https://aave.com/help/borrowing/liquidations">Aave : Health Factor &amp; Liquidations</a>. Rubriques sur le facteur de santé et les liquidations.</li>
<li id="source-13"><a href="https://docs.openzeppelin.com/contracts/5.x/access-control">OpenZeppelin : Contracts 5.x: Access Control</a>. Propriété, contrôle par rôles et opérations différées.</li>
<li id="source-14"><a href="https://ethereum.org/developers/docs/smart-contracts/">Ethereum.org : Introduction to smart contracts</a>. Définition et propriétés des contrats intelligents.</li>
<li id="source-15"><a href="https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/mica/article-2-scope">ESMA, Interactive Single Rulebook : MiCA, Article 2: Scope</a>. Article 2(4).</li>
<li id="source-16"><a href="https://www.ecb.europa.eu/pub/research/authors/profiles/alexandra-born.de.html">European Central Bank : Author profile: Alexandra Born</a>. Notice du WP 3208, datée du 26 mars 2026.</li>
</ol>

## Périmètre et méthode

Vérification des sources primaires au 1er octobre 2026. La proposition de l’ESMA du 30 septembre est distincte du droit MiCA déjà applicable ; aucun calendrier d’adoption du nouveau service n’est affirmé. Les pages Aave et MetaMask décrivent leurs propres mécanismes et conditions, à la date de consultation. Les chiffres de gouvernance sont ceux de mai 2023, repris dans un document de recherche publié en mars 2026 ; ils ne décrivent pas la situation de 2026.

Les exemples d’exécution, de prêt et de liquidation sont des modèles pédagogiques, avec hypothèses explicites. Les calculs de prêt utilisent un an d’intérêt simple, des encours constants, aucun défaut, aucune récompense en tokens, aucune capitalisation et aucune fiscalité. Le modèle de liquidation suppose une dette en dollars stable, une valorisation simultanée des garanties et aucun coût réseau. Les règles exactes et les paramètres d’un protocole réel varient selon son déploiement. L’article ne recommande aucun placement et ne qualifie juridiquement aucune application nommée.
