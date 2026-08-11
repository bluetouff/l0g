---
title: "Du GPU à l'obligation : comment un data center recycle le capital de l'IA"
description: "À Columbus, COL4 héberge des clusters Nvidia et a ensuite servi de support à 525 millions de dollars de notes. Anatomie documentée du recyclage financier d'un data center."
pubDate: 2026-08-11T16:00:00+02:00
updatedDate: 2026-08-11T16:00:00+02:00
tags: ["nvidia", "intelligence artificielle", "data centers", "titrisation", "crédit privé", "enquête"]
draft: false
quickTake:
  fact: "Lambda a déployé des clusters NVIDIA HGX B200 dans COL4. Cologix a ensuite clôturé 525 millions de dollars de notes adossées à ce même data center."
  importance: "Le cas montre comment un site stabilisé peut rembourser une dette antérieure et rendre du capital disponible pour de nouveaux projets d'infrastructure."
  uncertainty: "Les documents publics ne prouvent ni que les GPU appartiennent au collatéral, ni que Lambda assure seule le service de la dette, ni que l'opération relève du programme Nvidia de 500 milliards."
---

Le 3 juin 2025, Cologix et Lambda annoncent l'installation de clusters accélérés par des NVIDIA HGX B200 dans COL4, un data center situé à Columbus, dans l'Ohio. Les systèmes Supermicro et les GPU Blackwell doivent permettre à des entreprises du Midwest d'accéder à de la puissance de calcul pour entraîner, ajuster ou faire tourner des modèles d'intelligence artificielle.

Quarante-huit jours plus tard, Cologix annonce une seconde opération concernant le même bâtiment. Cette fois, il n'est plus question de performance informatique mais de financement : [COL4 sert de support à 525 millions de dollars de notes sécurisées](https://cologix.com/news/cologix-closes-525-million-usd-asset-backed-securitization-to-support-ai-infrastructure-interconnection-and-growth/), structurées avec une durée fixe de cinq ans.

La séquence offre une vue rare de la machine financière que Nvidia veut désormais porter à une tout autre échelle. Des GPU sont installés dans un bâtiment. Des clients paient pour du calcul ou pour l'infrastructure qui le rend possible. Les contrats, les loyers et la valeur du site permettent ensuite un refinancement obligataire. Le capital libéré peut soutenir d'autres bâtiments, susceptibles d'être refinancés à leur tour.

Ce mécanisme ne transforme pourtant pas les GPU de Lambda en obligations. Les notes sont adossées à COL4 et à un ensemble de droits liés au site. Aucun document public consulté ne permet d'affirmer que les puces installées par Lambda appartiennent au collatéral. La distinction entre le compute, le bâtiment et les contrats indique précisément où se trouvent les risques.

## À retenir en cinq lignes

- Un data center passe généralement par plusieurs financements avant d'atteindre le marché obligataire.
- Le refinancement structuré intervient surtout lorsque le site est construit, loué et capable de produire des revenus suffisamment prévisibles.
- Le produit des notes peut rembourser une dette existante et rendre du capital disponible pour les projets suivants.
- Une date de remboursement anticipée proche de cinq ans peut coexister avec une maturité juridique de 25 à 30 ans et un important risque de refinancement.
- COL4 illustre la mécanique recherchée par Nvidia, mais rien ne rattache juridiquement son émission de 2025 au programme des 500 milliards annoncé en 2026.

## Deux marchés dans le même bâtiment

Plusieurs couches économiques se superposent dans COL4.

Cologix fournit le site, l'alimentation électrique, le refroidissement, la sécurité physique et la connectivité. Lambda exploite une offre de cloud spécialisée dans l'IA. Supermicro fournit les systèmes. Nvidia fournit l'architecture de calcul HGX et les GPU Blackwell.

Le [communiqué conjoint du 3 juin 2025](https://cologix.com/news/cologix-and-lambda-launch-first-nvidia-hgx-b200-accelerated-ai-clusters-in-columbus-at-col4/) indique que les clients de Lambda peuvent utiliser les clusters à la demande ou à travers un engagement de consommation donnant accès à différentes générations de compute. Cologix décrivait alors quatre data centers à Columbus, totalisant 500 000 pieds carrés et 80 MW, reliés par fibre et connectés à plus de cinquante fournisseurs de réseaux et de cloud.

Deux marchés coexistent donc dans le même bâtiment.

Le premier vend du calcul. Sa valeur dépend de la performance des GPU, de leur disponibilité, du logiciel, du prix du compute et de la capacité de Lambda à attirer des utilisateurs.

Le second vend une infrastructure opérationnelle. Sa valeur dépend du taux d'occupation, des contrats clients, de l'électricité disponible, des coûts d'exploitation, de la fiabilité du site et de la possibilité de relouer sa capacité.

L'émission Cologix finance le second marché. Les GPU rendent le site plus utile et peuvent soutenir sa demande. Les documents publiés ne permettent toutefois pas de les assimiler au collatéral des notes.

Cette nuance est essentielle. Une puce peut perdre rapidement de la valeur lorsqu'une nouvelle génération arrive. Un data center correctement alimenté, connecté et adaptable peut continuer à accueillir de nouveaux équipements. Le risque technologique ne disparaît pas. Il se déplace en partie vers la capacité du bâtiment à rester compatible avec les générations suivantes.

## La fabrique de l'obligation

Un data center ne passe généralement pas directement du permis de construire à un fonds obligataire. La [Structured Finance Association](https://structuredfinance.org/wp-content/uploads/2026/07/SFA-Research-Corner_How-Data-Center-ABS-and-CMBS-Fit-in-a-Broader-Financing-Ecosystem.pdf) décrit une succession de financements adaptés aux différentes phases : prêt de construction, project finance, dette d'entreprise, crédit privé, financement spécialisé des équipements, puis ABS ou CMBS lorsque l'actif est stabilisé.

<div style="max-width:720px;margin:2rem auto;overflow:hidden">
<svg viewBox="0 0 480 820" width="100%" role="img" aria-labelledby="cycle-title-fr cycle-desc-fr" style="display:block;width:100%;height:auto;overflow:hidden">
  <title id="cycle-title-fr">Les sept étapes du recyclage financier d'un data center</title>
  <desc id="cycle-desc-fr">Du financement initial en fonds propres au remboursement de la dette et au financement de nouveaux projets.</desc>
  <defs>
    <linearGradient id="cycle-bg-fr" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0b1724" />
      <stop offset="100%" stop-color="#101f32" />
    </linearGradient>
    <marker id="cycle-arrow-fr" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 Z" fill="#56d9c6" />
    </marker>
  </defs>
  <rect x="1" y="1" width="478" height="818" rx="18" fill="url(#cycle-bg-fr)" stroke="#29445f" stroke-width="2" />
  <text x="24" y="34" fill="#f4f7fb" font-size="19" font-weight="700">Du projet au capital recyclé</text>
  <text x="24" y="55" fill="#9fb5ca" font-size="12">Cycle type d'un actif arrivé à maturité opérationnelle</text>

  <g font-family="system-ui, sans-serif">
    <g transform="translate(20 76)">
      <rect width="440" height="74" rx="12" fill="#132b42" stroke="#315879" />
      <circle cx="30" cy="37" r="18" fill="#56d9c6" /><text x="30" y="43" text-anchor="middle" fill="#07131f" font-size="17" font-weight="800">1</text>
      <text x="62" y="26" fill="#ffffff" font-size="16" font-weight="700">Fonds propres</text>
      <text x="62" y="47" fill="#c4d4e2" font-size="13">Terrain, permis, études</text>
      <text x="62" y="64" fill="#c4d4e2" font-size="13">et réservation de puissance</text>
    </g>
    <path d="M240 151 V169" stroke="#56d9c6" stroke-width="3" marker-end="url(#cycle-arrow-fr)" />
    <g transform="translate(20 176)">
      <rect width="440" height="74" rx="12" fill="#132b42" stroke="#315879" />
      <circle cx="30" cy="37" r="18" fill="#56d9c6" /><text x="30" y="43" text-anchor="middle" fill="#07131f" font-size="17" font-weight="800">2</text>
      <text x="62" y="26" fill="#ffffff" font-size="16" font-weight="700">Dette de construction</text>
      <text x="62" y="47" fill="#c4d4e2" font-size="13">Bâtiment, sous-station, refroidissement</text>
      <text x="62" y="64" fill="#c4d4e2" font-size="13">et raccordement au réseau</text>
    </g>
    <path d="M240 251 V269" stroke="#56d9c6" stroke-width="3" marker-end="url(#cycle-arrow-fr)" />
    <g transform="translate(20 276)">
      <rect width="440" height="74" rx="12" fill="#132b42" stroke="#315879" />
      <circle cx="30" cy="37" r="18" fill="#56d9c6" /><text x="30" y="43" text-anchor="middle" fill="#07131f" font-size="17" font-weight="800">3</text>
      <text x="62" y="26" fill="#ffffff" font-size="16" font-weight="700">Financement des équipements</text>
      <text x="62" y="47" fill="#c4d4e2" font-size="13">Serveurs, GPU, réseau</text>
      <text x="62" y="64" fill="#c4d4e2" font-size="13">et stockage</text>
    </g>
    <path d="M240 351 V369" stroke="#56d9c6" stroke-width="3" marker-end="url(#cycle-arrow-fr)" />
    <g transform="translate(20 376)">
      <rect width="440" height="74" rx="12" fill="#132b42" stroke="#315879" />
      <circle cx="30" cy="37" r="18" fill="#56d9c6" /><text x="30" y="43" text-anchor="middle" fill="#07131f" font-size="17" font-weight="800">4</text>
      <text x="62" y="26" fill="#ffffff" font-size="16" font-weight="700">Commercialisation</text>
      <text x="62" y="47" fill="#c4d4e2" font-size="13">Baux, contrats de services</text>
      <text x="62" y="64" fill="#c4d4e2" font-size="13">et engagements de consommation</text>
    </g>
    <path d="M240 451 V469" stroke="#56d9c6" stroke-width="3" marker-end="url(#cycle-arrow-fr)" />
    <g transform="translate(20 476)">
      <rect width="440" height="74" rx="12" fill="#132b42" stroke="#315879" />
      <circle cx="30" cy="37" r="18" fill="#56d9c6" /><text x="30" y="43" text-anchor="middle" fill="#07131f" font-size="17" font-weight="800">5</text>
      <text x="62" y="26" fill="#ffffff" font-size="16" font-weight="700">Stabilisation</text>
      <text x="62" y="47" fill="#c4d4e2" font-size="13">Mise en service, occupation</text>
      <text x="62" y="64" fill="#c4d4e2" font-size="13">et revenus réguliers documentés</text>
    </g>
    <path d="M240 551 V569" stroke="#56d9c6" stroke-width="3" marker-end="url(#cycle-arrow-fr)" />
    <g transform="translate(20 576)">
      <rect width="440" height="74" rx="12" fill="#132b42" stroke="#315879" />
      <circle cx="30" cy="37" r="18" fill="#56d9c6" /><text x="30" y="43" text-anchor="middle" fill="#07131f" font-size="17" font-weight="800">6</text>
      <text x="62" y="26" fill="#ffffff" font-size="16" font-weight="700">Émission obligataire</text>
      <text x="62" y="47" fill="#c4d4e2" font-size="13">Notes adossées au site</text>
      <text x="62" y="64" fill="#c4d4e2" font-size="13">aux contrats, comptes et flux</text>
    </g>
    <path d="M240 651 V669" stroke="#56d9c6" stroke-width="3" marker-end="url(#cycle-arrow-fr)" />
    <g transform="translate(20 676)">
      <rect width="440" height="74" rx="12" fill="#18394a" stroke="#56d9c6" stroke-width="2" />
      <circle cx="30" cy="37" r="18" fill="#56d9c6" /><text x="30" y="43" text-anchor="middle" fill="#07131f" font-size="17" font-weight="800">7</text>
      <text x="62" y="26" fill="#ffffff" font-size="16" font-weight="700">Capital recyclé</text>
      <text x="62" y="47" fill="#d7f3ee" font-size="13">Dette initiale remboursée</text>
      <text x="62" y="64" fill="#d7f3ee" font-size="13">et nouveaux projets financés</text>
    </g>
  </g>
  <text x="24" y="782" fill="#8199af" font-size="11">Synthèse l0g d'après SFA et Latham.</text>
  <text x="24" y="798" fill="#8199af" font-size="11">Chaque opération conserve ses propres termes.</text>
</svg>
</div>

Les prêteurs de construction acceptent les risques de retard, de surcoût, de raccordement et de disponibilité des équipements. Les investisseurs obligataires arrivent normalement plus tard. Ils financent un actif déjà en exploitation, avec des contrats et des revenus assez documentés pour être modélisés et notés.

Cette séparation reste imparfaite. Un site peut continuer à s'étendre, une partie de sa capacité peut être vide et des travaux peuvent se poursuivre. La logique consiste à isoler des actifs suffisamment matures pour que leur résultat opérationnel soutienne le service de la dette.

## Les pièces publiques de COL4

Le communiqué de Cologix ne constitue pas la seule pièce disponible.

Le [formulaire ABS-15G déposé auprès de la SEC le 24 juin 2025](https://www.sec.gov/Archives/edgar/data/1896619/000119312525145810/d51270dabs15g.htm) identifie l'émetteur : **Scalelogix ABS US Issuer, LLC, Series 2025-1**. Le [rapport de procédures convenues de KPMG](https://www.sec.gov/Archives/edgar/data/1896619/000119312525145810/d51270dex991.htm) cite Cologix et Deutsche Bank Securities, qualifiée de structuring agent. Il porte sur six contrats de data center destinés au collatéral. KPMG a comparé des attributs tels que le nom du locataire, la puissance critique louée, le loyer, les dates contractuelles et les options de renouvellement aux pièces remises par Cologix.

Ce rapport n'est ni un audit des contrats ni une opinion sur la valeur du collatéral ou la capacité des notes à être remboursées. KPMG le dit explicitement. La version publique ne révèle pas davantage l'identité des locataires ni les valeurs testées.

Le 26 juin, [S&P Global Ratings](https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3397191) a attribué des notes préliminaires à trois tranches totalisant 540 millions de dollars : 466 millions de classe A-2 notés A-, 49 millions de classe B notés BBB- et 25 millions de classe C notés BB-. L'agence décrivait un collatéral comprenant principalement les droits immobiliers sur un data center, ses biens personnels et équipements fixes, les baux, les réserves, certains comptes et les participations dans les entités propriétaires.

Cologix a finalement annoncé une clôture à 525 millions de dollars. Les documents publics consultés n'expliquent pas l'écart de 15 millions avec la structure préliminaire ni la ventilation finale entre les tranches. Ils ne permettent pas non plus de déterminer si le contrat de Lambda figure parmi les six contrats étudiés.

## L'actif réellement financé

Dans les structures directes décrites au marché, une entité dédiée possède ou contrôle les data centers. Elle peut détenir les terrains et les bâtiments en pleine propriété, ou des droits de bail. Les sûretés comprennent généralement les intérêts immobiliers, les comptes, les contrats clients, les assurances et certains droits associés à l'exploitation.

Le service de la dette repose sur le résultat opérationnel net disponible après les dépenses nécessaires au fonctionnement du site. L'investisseur n'achète donc pas simplement une suite de factures. Il finance une entreprise immobilisée dans un périmètre juridique dédié.

Le gestionnaire doit continuer à exploiter le bâtiment : trouver ou remplacer des clients, négocier les contrats, maintenir les installations, gérer les fournisseurs, acheter l'électricité, contrôler les coûts, facturer et recouvrer. Le flux dépend autant des contrats déjà signés que de ce travail continu.

La [demande adressée à la SEC par Latham & Watkins](https://business.cch.com/srd/dcs-interp-letter-072326080426.pdf) indique que ces émissions présentent généralement un ratio dette-valeur inférieur ou égal à 70 %. Environ 30 % de la valeur expertisée resterait donc sous forme d'equity dans l'entité propriétaire. La même lettre décrit une date de remboursement anticipée proche de cinq ans et une maturité finale de 25 à 30 ans. Il s'agit d'une description générale du marché, pas des paramètres publiés pour COL4.

## Pourquoi l'opération libère du capital

Le mot « financement » masque deux usages différents.

Le premier apporte de l'argent neuf à un chantier. Le second remplace un financement antérieur devenu trop cher, trop court ou trop concentré. La titrisation de data centers remplit souvent cette seconde fonction.

Lorsqu'un site est achevé et loué, son profil de risque s'améliore. Un investisseur obligataire peut accepter un rendement inférieur à celui exigé par le prêteur qui supportait le chantier. Les nouvelles notes peuvent alors rembourser la dette de construction ou une autre dette existante. Le sponsor récupère de la capacité d'endettement et peut réutiliser une partie de son capital dans un nouveau projet.

Cologix indique que le produit de son émission devait soutenir ses investissements dans les portefeuilles Scalelogix et Digital Edge afin de répondre à la demande liée à l'IA d'inférence et au cloud. Le communiqué ne ventile pas le produit entre remboursement de dette, investissements et éventuelles distributions.

[Switch fournit un exemple plus explicite](https://www.switch.com/switch-raises-768-million-in-latest-data-center-abs-issuance/). En avril 2026, l'opérateur a levé 768 millions de dollars. Le produit net devait rembourser de la dette existante et financer les besoins généraux de l'entreprise. L'émission ajoutait au pool un site de Reno d'environ 1,4 million de pieds carrés et plus de 52 MW. Après l'opération, le véhicule regroupait onze data centers, cinq marchés et plus de 550 clients.

Switch avait déjà levé environ 4,2 milliards de dollars à travers cinq émissions depuis 2024. La titrisation devient ainsi une ligne de production financière : stabiliser, refinancer, ajouter un actif, émettre une nouvelle série, puis recommencer.

## Cinq ans cachés dans trente ans

Le risque central de nombreuses opérations ne se trouve pas à la maturité juridique finale, mais à l'anticipated repayment date, ou ARD.

La structure courante combine :

- une ARD située autour de cinq ans ;
- peu ou pas d'amortissement programmé avant cette date ;
- une maturité juridique finale pouvant atteindre 25 à 30 ans ;
- une hausse du coût de la dette après l'ARD ;
- un mécanisme de cash sweep qui affecte l'excédent de trésorerie au remboursement des notes.

Le scénario attendu consiste à refinancer ou rembourser les obligations à l'ARD. La maturité finale protège juridiquement les investisseurs si ce remboursement n'a pas lieu. Elle ne signifie pas que le principal sera tranquillement amorti pendant trente ans.

La [méthodologie de KBRA](https://www.kbra.com/publications/ywsVHsMw/abs-data-center-abs-global-rating-methodology?format=web) traite explicitement l'ARD, les déclencheurs d'amortissement, l'affectation des flux excédentaires et l'utilisation éventuelle du produit de cessions immobilières. La Structured Finance Association rappelle que ces dispositifs doivent encourager un refinancement ou une réduction de la dette lorsque les notes restent en circulation après la date prévue.

Le risque économique est donc celui d'un mur de refinancement à cinq ans. Si les taux montent, si la valeur du site baisse, si un client important part ou si les investisseurs refusent une nouvelle émission, l'émetteur peut être contraint de conserver une dette plus coûteuse et de consacrer davantage de cash à son remboursement.

La durée fixe de cinq ans publiée pour COL4 est compatible avec ce schéma, sans le prouver. Les documents publics disponibles ne donnent ni l'ARD exacte, ni la maturité juridique finale, ni les mécanismes applicables après cinq ans. Ces blancs ne peuvent pas être complétés avec les paramètres d'une autre opération.

## Diversifier les clients ou sécuriser un géant

La qualité d'une obligation dépend fortement de la structure commerciale du site.

Un data center hyperscale peut être loué pendant quinze ans à un seul groupe technologique très bien noté. Le revenu paraît prévisible, mais le départ ou la renégociation de ce client peut affecter presque toute l'opération.

Un portefeuille de colocation accueille au contraire des centaines ou des milliers de clients. Chaque contrat pèse peu, mais l'opérateur doit continuellement renouveler, remplacer et développer cette clientèle.

[DataBank 2026-1 illustre ce second modèle](https://www.kbra.com/publications/tGrWrdbr/kbra-assigns-preliminary-ratings-to-databank-series-2026-1?format=web). Le pool comprenait 36 data centers, 1 757 clients et 257,6 MW de puissance critique. Le premier client ne représentait que 3,9 % des revenus mensuels récurrents annualisés. La durée moyenne restante des contrats n'était cependant que de deux ans.

La diversification réduit le risque d'un défaut unique. La brièveté des contrats augmente le travail de renouvellement et expose les revenus aux conditions de marché. Les deux modèles distribuent le risque différemment.

Pour l'investisseur, cinq questions deviennent essentielles : qui paie, pour combien de temps, quelle part des revenus dépend des principaux clients, quelle capacité doit encore être louée et qui supporte l'électricité, la maintenance et les investissements de mise à niveau ?

## Le bâtiment ne suffit pas

Un data center est souvent présenté comme de l'immobilier enrichi par des contrats. Cette description sous-estime son besoin d'énergie, son intensité technologique et sa dépendance à un écosystème opérationnel.

La valeur du site dépend notamment de la puissance électrique effectivement disponible, de la redondance et du refroidissement, de la connectivité, des investissements nécessaires pour accueillir de nouveaux serveurs, du prix de l'électricité et de la possibilité de relouer le bâtiment si le client initial part.

Un bâtiment construit pour une densité devenue insuffisante peut exiger des travaux importants. Une sous-station dédiée peut être sous-utilisée si la demande se déplace. Un contrat très long peut protéger les revenus tout en retardant l'adaptation du site. Une concentration sur quelques clients solides peut rassurer les agences de notation tout en créant un risque de renouvellement massif.

La note de crédit ne mesure donc pas seulement la probabilité qu'un locataire paie demain. Elle doit modéliser les défauts, les renouvellements, les coûts d'exploitation, la valeur résiduelle, le temps nécessaire pour trouver un autre client et la capacité de refinancement.

## COL4 : faits établis et limites

La chronologie de Columbus établit un lien matériel entre l'écosystème Nvidia et le marché obligataire.

- Lambda a bien déployé des clusters NVIDIA HGX B200 dans COL4.
- Cologix a bien clôturé 525 millions de dollars de notes adossées à COL4.
- Le financement doit soutenir une croissance des infrastructures comprenant la demande liée à l'IA.

Elle n'établit pas que :

- Nvidia, Lambda ou Supermicro ont garanti les notes ;
- les GPU appartiennent au collatéral ;
- les revenus de Lambda suffisent à eux seuls au service de la dette ;
- les 525 millions ont financé l'achat des clusters ;
- l'émission appartient au programme de plus de 500 milliards annoncé par Nvidia le 10 août 2026.

COL4 démontre un mécanisme. Il ne constitue pas une transaction exécutée par les six nouvelles plateformes.

Le raccourci « obligations garanties par des GPU Nvidia » serait donc séduisant, mais non étayé. Les documents publics racontent autre chose : les puces peuvent créer de la demande pour un bâtiment dont les contrats, les droits immobiliers et les flux deviennent finançables. La dette obligataire peut ensuite rendre du capital au propriétaire. Nvidia bénéficie indirectement d'un système capable de financer plus vite les infrastructures nécessaires à ses clients.

## La machine derrière les 500 milliards

Le [premier volet de cette enquête](/posts/nvidia-500-milliards-qui-n-existent-pas-encore/) montrait que les 500 milliards annoncés par Nvidia décrivaient une capacité future mêlant equity, dette, co-investisseurs, garanties et plateformes déjà existantes. Le cycle décrit ici montre comment une même unité de capital peut être utilisée plusieurs fois.

Un fonds apporte l'equity d'un projet. Une banque ou un prêteur privé finance la construction. Une fois le data center stabilisé, une émission obligataire peut rembourser cette dette. Le sponsor réinvestit alors le capital libéré dans un second projet. Celui-ci pourra un jour suivre la même trajectoire.

Un dollar de capital initial peut ainsi soutenir successivement plusieurs bâtiments sans devenir plusieurs dollars simultanés. Ce recyclage est économiquement réel. Il complique néanmoins la lecture des annonces portant sur le capital « mobilisé ». Selon la définition retenue, le même capital peut être comptabilisé lors de la levée du fonds, du prêt de construction, du refinancement obligataire puis du nouvel investissement.

La Structured Finance Association, citant des estimations de Barclays, situe l'encours des titrisations de data centers à 61 milliards de dollars en 2026, contre 4 milliards en 2020. L'émission ABS moyenne atteindrait environ 600 millions. COL4, avec 525 millions, se trouve près de cette échelle.

Le même rapport reprend une estimation de Morgan Stanley : 2 900 milliards de dollars d'investissements mondiaux dans les data centers seraient nécessaires jusqu'en 2028, dont environ 1 500 milliards à financer hors des flux de trésorerie des grands hyperscalers. Ces prévisions ne sont pas des engagements. Elles expliquent pourquoi Nvidia, les gestionnaires d'actifs et les banques cherchent à transformer le data center stabilisé en produit financier reproductible.

## Questions publiques à Cologix, Lambda, Nvidia et aux arrangeurs

Les documents publics disponibles au 11 août 2026 ne permettent pas de répondre aux questions suivantes. l0g les adresse publiquement aux entreprises concernées et intégrera toute réponse accompagnée d'éléments vérifiables.

1. **À Cologix et Deutsche Bank Securities :** quelle est la ventilation finale des 525 millions de dollars entre les classes de notes, et qu'est-il advenu des 15 millions séparant la structure préliminaire notée par S&P de la somme annoncée à la clôture ?
2. **À Cologix et Deutsche Bank Securities :** quels actifs et droits composent exactement le collatéral final, notamment derrière les catégories « personal property and fixtures », contrats, comptes et participations dans les entités propriétaires ?
3. **À Cologix et Lambda :** le contrat de Lambda figure-t-il parmi les six contrats examinés par KPMG, et quelle part des loyers ou de la puissance louée représente-t-il ?
4. **À Cologix, Lambda, Supermicro et Nvidia :** qui possède les systèmes HGX B200 installés dans COL4, et qui supporte leur remplacement, leur mise à niveau et leur valeur résiduelle ?
5. **À Cologix :** quels étaient à la clôture la valeur expertisée, le ratio dette-valeur, le DSCR, la date de remboursement anticipée, la maturité juridique et les mécanismes applicables après cinq ans ?
6. **À Cologix :** comment le produit de l'émission a-t-il été réparti entre remboursement de dette, investissements dans de nouveaux sites et éventuelles distributions aux actionnaires ?
7. **À Cologix et Deutsche Bank Securities :** quelles protections contractuelles couvrent le départ d'un locataire important, une insuffisance de puissance, l'obsolescence technique du site et l'échec d'un refinancement ?
8. **À Nvidia :** COL4 ou le refinancement d'actifs comparables peut-il être compté dans l'objectif de 500 milliards, et quelle méthode évitera de compter plusieurs fois un même capital au fil de ses réemplois successifs ?

## Le prochain paradoxe

Le marché appelle ces instruments des data center ABS. Cologix et Switch emploient ce terme. Les agences les analysent avec les outils de la finance structurée : cascades de paiement, sûretés, réserves et dates de remboursement anticipé.

Le [29 juillet 2026, le staff de la SEC](https://www.sec.gov/rules-regulations/no-action-interpretive-exemptive-letters/division-corporation-finance-no-action/certain-data-center-securitizations-072926) a pourtant accepté, pour les faits précis qui lui étaient soumis, que certaines émissions directes de data centers ne soient pas des asset-backed securities au sens de l'Exchange Act. La réponse est une position du staff sans force de loi, pas une règle générale de la Commission.

La contradiction n'est qu'apparente. Le marché décrit une technique financière. Le droit américain applique une définition particulière. Le troisième volet examinera cette frontière, les règles susceptibles de ne plus s'appliquer et les opérations qui permettront de la tester.

## Sources principales

- [Cologix et Lambda, clusters NVIDIA HGX B200 déployés dans COL4, 3 juin 2025](https://cologix.com/news/cologix-and-lambda-launch-first-nvidia-hgx-b200-accelerated-ai-clusters-in-columbus-at-col4/)
- [Cologix, clôture de 525 millions de dollars de notes adossées à COL4, 21 juillet 2025](https://cologix.com/news/cologix-closes-525-million-usd-asset-backed-securitization-to-support-ai-infrastructure-interconnection-and-growth/)
- [SEC, formulaire ABS-15G de Scalelogix ABS US Issuer, 24 juin 2025](https://www.sec.gov/Archives/edgar/data/1896619/000119312525145810/d51270dabs15g.htm)
- [SEC, rapport de procédures convenues de KPMG sur six contrats, 13 juin 2025](https://www.sec.gov/Archives/edgar/data/1896619/000119312525145810/d51270dex991.htm)
- [S&P Global Ratings, notes préliminaires de Scalelogix Series 2025-1, 26 juin 2025](https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3397191)
- [Structured Finance Association, cycle de financement des data centers, 23 juillet 2026](https://structuredfinance.org/wp-content/uploads/2026/07/SFA-Research-Corner_How-Data-Center-ABS-and-CMBS-Fit-in-a-Broader-Financing-Ecosystem.pdf)
- [Latham & Watkins, demande d'interprétation adressée à la SEC, 23 juillet 2026](https://business.cch.com/srd/dcs-interp-letter-072326080426.pdf)
- [KBRA, méthodologie mondiale des data center ABS, 9 janvier 2026](https://www.kbra.com/publications/ywsVHsMw/abs-data-center-abs-global-rating-methodology?format=web)
- [KBRA, DataBank Series 2026-1, 12 janvier 2026](https://www.kbra.com/publications/tGrWrdbr/kbra-assigns-preliminary-ratings-to-databank-series-2026-1?format=web)
- [Switch, émission Series 2026-1 de 768 millions de dollars, 14 avril 2026](https://www.switch.com/switch-raises-768-million-in-latest-data-center-abs-issuance/)
- [SEC, réponse du staff sur certaines émissions directes de data centers, 29 juillet 2026](https://www.sec.gov/rules-regulations/no-action-interpretive-exemptive-letters/division-corporation-finance-no-action/certain-data-center-securitizations-072926)

## Méthode et limites

- Date d'arrêt des recherches : **11 août 2026**.
- La structure de 540 millions publiée par S&P était préliminaire. Cologix a annoncé 525 millions à la clôture. Aucun document public identifié ne fournit la ventilation finale complète.
- Le dépôt SEC établit l'existence de six contrats destinés au collatéral, mais ne publie ni leurs valeurs ni l'identité des locataires.
- Aucun document public identifié ne prouve que les GPU de Lambda appartiennent au collatéral ou que ses revenus assurent seuls le service de la dette.
- Les estimations de marché à 61 milliards, 600 millions, 2 900 milliards et 1 500 milliards proviennent d'un rapport professionnel citant Barclays et Morgan Stanley. Elles décrivent un marché ou des besoins projetés, pas des engagements fermes.
- L'article décrit une mécanique de financement et ses risques. Il ne constitue ni une analyse de crédit complète des notes, ni une recommandation d'investissement.
