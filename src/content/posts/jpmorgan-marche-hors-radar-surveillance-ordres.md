---
title: "Le marché hors radar : des milliards de messages d'ordre hors surveillance chez JPMorgan"
description: "De 2014 à 2021, JPMorgan n'a pas intégré plus de 99 % des messages d'ordre d'une plateforme américaine dans ses systèmes de surveillance. Cette première partie relie les manipulations reconnues en 2020, la faille découverte en 2021 et les sanctions de 2024, sans confondre défaut de contrôle et nouvel abus établi."
pubDate: 2026-07-31T14:20:00+02:00
updatedDate: 2026-07-31T14:20:00+02:00
tags: ["JPMorgan", "spoofing", "surveillance des marchés", "CFTC", "Réserve fédérale", "OCC", "régulation", "risque opérationnel"]
draft: false
---

*En juin 2021, l'ajout d'une nouvelle plateforme de négociation révèle une anomalie chez JPMorgan. Des flux d'ordres et de transactions n'alimentent pas correctement ses outils de surveillance. L'examen interne s'étend ensuite à l'échelle mondiale : au moins trente plateformes sont touchées, plusieurs produits sont concernés et certaines lacunes remontent à 2014. Sur une plateforme américaine désignée uniquement par « DCM-1 », plus de 99 % des [messages d'ordre](/glossaire/message-d-ordre/) échappent au dispositif entre 2014 et 2021. Le volume se chiffre en milliards. La [Commodity Futures Trading Commission](https://www.cftc.gov/media/10721/Order05232024JPMorganSecuritiesLLC/download) ne conclut pas à des milliards de transactions frauduleuses. Elle établit une incapacité de surveillance à une échelle exceptionnelle.*

Cette distinction porte toute l'enquête. Une donnée absente ne prouve pas une manipulation. Elle empêche précisément le contrôle destiné à la détecter. Le problème devient plus grave à la lumière du passé : en septembre 2020, JPMorgan venait de reconnaître des manipulations sur les métaux précieux et les Treasuries, de promettre une remédiation et de présenter à la CFTC un système renforcé. Une partie du marché restait pourtant invisible à ce système.

Cette enquête en deux volets reconstitue le dossier à partir des ordres de la CFTC, de la Réserve fédérale et de l'Office of the Comptroller of the Currency, du dossier pénal du Department of Justice, des décisions de la Securities and Exchange Commission et des propres rapports de JPMorgan déposés à la SEC. La présente partie établit la chronologie et la nature du risque. La seconde partie examinera l'accès sponsorisé, la chaîne technique de surveillance et le contenu absent du dossier public.

## Un scandale déjà établi

Le point de départ n'est ni une rumeur ni une extrapolation. En septembre 2020, JPMorgan conclut un accord de poursuites différées avec le Department of Justice. La banque reconnaît deux schémas distincts de fraude électronique liés à des manipulations sur les marchés.

Le [dossier du DOJ](https://www.justice.gov/criminal/criminal-vns/case/jpmorgan-chase-co-deferred-prosecution-agreement) couvre d'abord les contrats à terme sur l'or, l'argent, le platine et le palladium. Entre mars 2008 et août 2016, des traders et commerciaux des équipes de négociation de New York, Londres et Hong Kong placent, à des dizaines de milliers de reprises, des ordres destinés à être annulés avant exécution. Le second schéma concerne les contrats à terme sur Treasuries ainsi que le marché au comptant des obligations et billets du Trésor. Entre avril 2008 et janvier 2016, le DOJ recense des milliers de séquences trompeuses.

La responsabilité ne reste pas seulement corporative. En août 2023, [Gregg Smith et Michael Nowak sont condamnés à des peines de prison](https://www.justice.gov/archives/opa/pr/former-jp-morgan-precious-metals-traders-sentenced-prison). Le premier reçoit deux ans, le second un an et un jour. Le DOJ chiffre à plus de 10 millions de dollars les pertes causées aux participants par le schéma jugé lors de leur procès. Ces condamnations portent sur les métaux précieux et sur des comportements individuels établis devant un jury. Elles ne prouvent rien au sujet des messages absents du dispositif de surveillance entre 2014 et 2021.

## Le spoofing, faux ordre dans le carnet

Un carnet d'ordres affiche des intentions d'achat et de vente. Le prix, la quantité et la profondeur visible aident les participants et les algorithmes à estimer l'offre et la demande. Le [*spoofing*](/glossaire/spoofing/) désigne une offre d'achat ou de vente placée avec l'intention de l'annuler avant exécution, selon la définition du [Commodity Exchange Act](https://www.cftc.gov/media/4826/enfjpmorganchaseorder092920/download).

La mécanique utilisée par les traders de JPMorgan associait deux côtés :

1. un ordre réel, destiné à être exécuté ;
2. un ou plusieurs ordres trompeurs, placés de l'autre côté du carnet et destinés à être annulés.

Les faux ordres donnaient l'impression d'une pression acheteuse ou vendeuse plus forte. Après l'exécution de l'ordre réel à un prix plus favorable, les ordres trompeurs disparaissaient. Une annulation rapide ne suffit pas, à elle seule, à prouver un spoofing. L'intention d'annuler avant exécution constitue l'élément décisif. Les dossiers pénaux l'ont établie à partir des séquences de négociation, des communications et des autres éléments de preuve.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 760 420" role="img" aria-label="Mécanique simplifiée du spoofing établie dans le dossier JPMorgan de 2020" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="760" height="420" fill="#0c0d10"/>
  <text x="34" y="40" fill="#f5f6f8" font-size="18" font-weight="700">SPOOFING : DEUX CÔTÉS, DEUX INTENTIONS</text>
  <text x="34" y="64" fill="#8b909b" font-size="12">Schéma pédagogique d'après les faits admis et jugés dans le dossier 2020.</text>
  <rect x="34" y="100" width="210" height="104" rx="6" fill="#15171c" stroke="#5eead4" stroke-width="2"/>
  <text x="139" y="132" fill="#5eead4" font-size="14" font-weight="700" text-anchor="middle">ORDRE RÉEL</text>
  <text x="139" y="160" fill="#d6d9df" font-size="12" text-anchor="middle">intention d'exécution</text>
  <text x="139" y="182" fill="#8b909b" font-size="11" text-anchor="middle">achat ou vente recherché</text>
  <rect x="516" y="100" width="210" height="104" rx="6" fill="#21131a" stroke="#ff4d87" stroke-width="2"/>
  <text x="621" y="132" fill="#ff4d87" font-size="14" font-weight="700" text-anchor="middle">ORDRES TROMPEURS</text>
  <text x="621" y="160" fill="#d6d9df" font-size="12" text-anchor="middle">intention d'annulation</text>
  <text x="621" y="182" fill="#8b909b" font-size="11" text-anchor="middle">pression affichée opposée</text>
  <line x1="244" y1="152" x2="328" y2="152" stroke="#5eead4" stroke-width="2"/>
  <polygon points="328,152 316,145 316,159" fill="#5eead4"/>
  <line x1="516" y1="152" x2="432" y2="152" stroke="#ff4d87" stroke-width="2"/>
  <polygon points="432,152 444,145 444,159" fill="#ff4d87"/>
  <rect x="328" y="112" width="104" height="80" rx="40" fill="#171a20" stroke="#f5b13d"/>
  <text x="380" y="145" fill="#f5b13d" font-size="12" font-weight="700" text-anchor="middle">CARNET</text>
  <text x="380" y="164" fill="#f5b13d" font-size="12" font-weight="700" text-anchor="middle">DÉSÉQUILIBRÉ</text>
  <line x1="380" y1="192" x2="380" y2="242" stroke="#f5b13d" stroke-width="2"/>
  <polygon points="380,242 373,230 387,230" fill="#f5b13d"/>
  <rect x="190" y="244" width="380" height="90" rx="6" fill="#15171c" stroke="#2a2c33"/>
  <text x="380" y="276" fill="#f5f6f8" font-size="13" font-weight="700" text-anchor="middle">EXÉCUTION DE L'ORDRE RÉEL</text>
  <text x="380" y="302" fill="#d6d9df" font-size="12" text-anchor="middle">puis annulation des ordres trompeurs</text>
  <text x="34" y="372" fill="#d6d9df" font-size="11">Une annulation n'est pas une fraude par nature. L'intention préalable sépare le spoofing d'un ordre légitime.</text>
  <text x="34" y="394" fill="#8b909b" font-size="10">Sources : DOJ, dossier 20-CR-175 ; CFTC, ordonnance 20-69 du 29 septembre 2020.</text>
</svg>
<figcaption>Le schéma isole la logique générale du dossier. Les séquences réelles variaient selon le produit et le trader. La preuve juridique ne repose pas sur le seul taux d'annulation.</figcaption>
</figure>

## Huit ans, deux équipes, trois marchés

L'[ordonnance CFTC de 2020](https://www.cftc.gov/media/4826/enfjpmorganchaseorder092920/download) va plus loin que le résumé pénal. Elle décrit des centaines de milliers d'ordres trompeurs sur les métaux précieux et les contrats à terme sur Treasuries entre 2008 et 2016. Dans de nombreux cas, les traders ont créé des prix artificiels. L'ordonnance relève aussi un défaut de supervision chez J.P. Morgan Securities.

Les signaux existaient. La CFTC cite des alertes internes, des demandes du CME et de la Commission, ainsi que des allégations internes formulées par un trader. Avant 2014, le système ne permettait pas d'identifier efficacement le spoofing. Un nouvel outil est ensuite déployé, mais la firme ne parvient toujours pas à identifier, enquêter et interrompre les pratiques pendant la période concernée.

La [SEC](https://www.sec.gov/newsroom/press-releases/2020-233) documente séparément des manipulations sur le marché au comptant des Treasuries entre avril 2015 et janvier 2016. J.P. Morgan Securities admet les constatations de l'autorité. Des ordres réels étaient accompagnés presque simultanément d'ordres opposés non authentiques, destinés à améliorer le prix d'exécution. Cette composante rappelle un point central : le risque ne se limitait pas aux métaux ni aux seuls contrats à terme.

## 2020, le système présenté comme renforcé

Au moment du règlement, JPMorgan présente une transformation importante de son contrôle. L'ordonnance CFTC reprend les éléments communiqués par la firme : centaines de nouveaux responsables de conformité, hausse des budgets, formations spécifiques, contrôle de plus de 80 marchés actions et de plus de 40 marchés de contrats à terme et d'options.

JPMorgan indique aussi utiliser trois types principaux d'alertes dans le logiciel SMARTS pour détecter le spoofing et le *layering*, un empilement d'ordres trompeurs à plusieurs niveaux du carnet. Des tests de qualité portent sur les alertes classées avec ou sans transmission à un niveau supérieur. Des rapports mensuels agrègent les alertes par trader, équipe, superviseur et région. La firme affirme enfin traiter environ 100 millions de communications électroniques par mois et examiner toutes les alertes générées par cette surveillance des communications.

La CFTC ne présente pas ces éléments comme un audit exhaustif de chaque flux de marché. Elle les classe parmi les déclarations de remédiation de JPMorgan. Son ordonnance impose le maintien et l'actualisation d'un programme conçu pour détecter et dissuader les violations.

Le montant de 920,2 millions de dollars souvent associé au dossier correspond à un règlement coordonné, pas à trois additions indépendantes. Le [DOJ détaille](https://www.justice.gov/criminal/criminal-vns/case/jpmorgan-chase-co-deferred-prosecution-agreement) une pénalité pénale de 436 431 811 dollars, une restitution aux victimes de 311 737 008 dollars et une restitution des profits de 172 034 790 dollars. Les paiements CFTC et SEC bénéficient de mécanismes de crédit afin d'éviter de compter plusieurs fois les mêmes composantes.

## Juin 2021, une nouvelle plateforme révèle la faille

Neuf mois après le règlement, un événement banal déclenche une découverte majeure. JPMorgan prépare l'intégration d'une nouvelle plateforme de négociation. En juin 2021, la firme identifie des lacunes importantes dans les données d'ordres et de transactions envoyées vers ses systèmes de surveillance.

La revue devient mondiale. D'après l'[ordonnance CFTC de mai 2024](https://www.cftc.gov/media/10721/Order05232024JPMorganSecuritiesLLC/download), les lacunes touchent au moins trente plateformes, plusieurs produits et des périodes remontant parfois à 2014. JPMorgan informe la Commission en 2021 et déclare ne pas avoir eu connaissance des lacunes auparavant. Elles n'avaient donc pas été évoquées pendant le règlement de 2020.

La conséquence est écrite noir sur blanc par la CFTC : lors du règlement du dossier de spoofing, JPMorgan ne surveillait pas certains messages d'ordre. Les améliorations décrites en 2020 pouvaient être réelles sur les données présentes dans le système. Elles ne couvraient pas les données absentes.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 760 480" role="img" aria-label="Chronologie des manipulations établies, de la remédiation et des lacunes de surveillance chez JPMorgan" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="760" height="480" fill="#0c0d10"/>
  <text x="34" y="40" fill="#f5f6f8" font-size="18" font-weight="700">DEUX DOSSIERS, UNE ZONE DE CHEVAUCHEMENT</text>
  <text x="34" y="64" fill="#8b909b" font-size="12">Les périodes se recouvrent, les constatations juridiques restent distinctes.</text>
  <line x1="76" y1="128" x2="700" y2="128" stroke="#3a3d46" stroke-width="3"/>
  <line x1="76" y1="286" x2="700" y2="286" stroke="#3a3d46" stroke-width="3"/>
  <text x="34" y="106" fill="#ff4d87" font-size="12" font-weight="700">MANIPULATIONS ÉTABLIES</text>
  <line x1="86" y1="128" x2="372" y2="128" stroke="#ff4d87" stroke-width="8"/>
  <circle cx="86" cy="128" r="7" fill="#ff4d87"/>
  <circle cx="372" cy="128" r="7" fill="#ff4d87"/>
  <text x="86" y="158" fill="#d6d9df" font-size="11" text-anchor="middle">2008</text>
  <text x="372" y="158" fill="#d6d9df" font-size="11" text-anchor="middle">2016</text>
  <text x="229" y="184" fill="#8b909b" font-size="11" text-anchor="middle">métaux précieux et Treasuries</text>
  <text x="34" y="264" fill="#5eead4" font-size="12" font-weight="700">LACUNES DE SURVEILLANCE</text>
  <line x1="277" y1="286" x2="633" y2="286" stroke="#5eead4" stroke-width="8"/>
  <circle cx="277" cy="286" r="7" fill="#5eead4"/>
  <circle cx="544" cy="286" r="9" fill="#f5b13d"/>
  <circle cx="633" cy="286" r="7" fill="#5eead4"/>
  <text x="277" y="316" fill="#d6d9df" font-size="11" text-anchor="middle">2014</text>
  <text x="544" y="316" fill="#f5b13d" font-size="11" text-anchor="middle">juin 2021</text>
  <text x="633" y="316" fill="#d6d9df" font-size="11" text-anchor="middle">2023</text>
  <text x="455" y="342" fill="#8b909b" font-size="11" text-anchor="middle">découverte en 2021, remédiation déclarée achevée en 2023</text>
  <line x1="499" y1="86" x2="499" y2="366" stroke="#f5b13d" stroke-width="2" stroke-dasharray="6 5"/>
  <circle cx="499" cy="128" r="8" fill="#f5b13d"/>
  <text x="499" y="95" fill="#f5b13d" font-size="12" font-weight="700" text-anchor="middle">SEPT. 2020</text>
  <text x="499" y="386" fill="#f5b13d" font-size="11" text-anchor="middle">règlement spoofing et déclarations de remédiation</text>
  <line x1="699" y1="104" x2="699" y2="310" stroke="#8b909b" stroke-width="2"/>
  <text x="699" y="94" fill="#d6d9df" font-size="11" text-anchor="middle">2024</text>
  <text x="699" y="338" fill="#8b909b" font-size="10" text-anchor="middle">Fed, OCC, CFTC</text>
  <text x="34" y="426" fill="#d6d9df" font-size="11">Le chevauchement temporel n'établit aucun nouvel abus dans les flux manquants.</text>
  <text x="34" y="448" fill="#8b909b" font-size="10">Sources : DOJ 20-CR-175 ; CFTC 20-69 et 24-07 ; Fed 24-007-B-HC ; OCC AA-EC-2023-50.</text>
</svg>
<figcaption>Les manipulations reconnues couvrent 2008 à 2016. Les lacunes de surveillance commencent au moins en 2014 et se prolongent jusqu'en 2023 selon les plateformes. Leur chevauchement signale un défaut de contrôle, sans démontrer un nouveau comportement illicite.</figcaption>
</figure>

## DCM-1, plus de 99 % des messages absents

Le cas le plus grave concerne une plateforme américaine de contrats désignée par la CFTC sous le pseudonyme « DCM-1 ». Entre 2014 et 2021, JPMorgan n'intègre pas des milliards de messages d'ordre dans ses systèmes. Plus de 99 % des messages de cette plateforme échappent donc à la surveillance.

Trois précisions évitent les contresens :

- un message d'ordre peut correspondre à une création, une modification ou une annulation ; il ne représente pas forcément une transaction exécutée ;
- le nombre de messages ne donne ni valeur totale en dollars, ni taille des positions ;
- la CFTC sanctionne ici un défaut de supervision, pas une nouvelle manipulation portant sur chaque message absent.

Selon JPMorgan, l'essentiel de cette activité provenait d'un accès sponsorisé accordé à trois sociétés algorithmiques importantes. L'ordonnance ne nomme ni la plateforme ni ces trois firmes. La seconde partie examinera cette architecture, car elle déplace l'origine des ordres sans supprimer le besoin d'un contrôle complet.

## Une source dorée sans rapprochement

La cause technique décrite par la CFTC tient en une erreur de gouvernance des données. JPMorgan utilisait des flux reçus directement des plateformes. La firme avait un processus trimestriel de rapprochement pour vérifier l'exhaustivité de certaines données envoyées aux outils de surveillance. Les flux directs des plateformes en étaient exclus.

La raison paraît rassurante et devient le cœur du problème : les données venues directement d'une bourse étaient considérées comme une *golden source*, une source de référence supposée fiable. JPMorgan ne les testait donc pas par le même rapprochement. Or le contenu pouvait être exact à la source tout en échouant lors de la configuration, du transport ou de son entrée dans le système. La CFTC identifie précisément des erreurs de configuration empêchant certains flux d'arriver dans le logiciel tiers de surveillance.

Le risque ne réside pas seulement dans la qualité d'une donnée. Il apparaît entre deux systèmes. Un fichier peut être fiable, un outil d'alerte peut fonctionner, et la chaîne complète peut rester aveugle si personne ne vérifie le nombre de messages reçus contre le nombre de messages attendus.

## Trois sanctions, un même défaut de données

Le 14 mars 2024, la [Réserve fédérale](https://www.federalreserve.gov/newsevents/pressreleases/files/enf20240314a1.pdf) et l'[OCC](https://www.occ.treas.gov/news-issuances/news-releases/2024/nr-occ-2024-25.html) interviennent simultanément. La Fed constate des lacunes entre 2014 et 2023 sur au moins trente plateformes mondiales, ainsi qu'une surveillance dépourvue de contrôles suffisants sur les données et leur rapprochement. Elle qualifie ces pratiques de dangereuses ou malsaines et impose 98 167 980 dollars.

L'OCC retient aussi des pratiques dangereuses ou malsaines. Son ordre porte sur des milliards d'occurrences de négociation non surveillées, au moins trente plateformes, la gouvernance des données et la couverture des lieux de marché. Il impose 250 millions de dollars, déjà versés au Trésor selon le communiqué de l'autorité.

Le 23 mai 2024, la CFTC ajoute une obligation nominale de 200 millions de dollars. Son ordonnance accorde toutefois deux crédits de 50 millions pour les paiements effectués au titre des décisions OCC et Fed. Le paiement propre à la CFTC atteint donc 100 millions si les deux crédits s'appliquent, pour un total coordonné de 448 167 980 dollars. Dans son [Form 10-Q au 30 juin 2024](https://www.sec.gov/Archives/edgar/data/19617/000001961724000453/jpm-20240630.htm), JPMorgan arrondit ce total à 450 millions et indique l'avoir payé.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 760 410" role="img" aria-label="Calcul des sanctions coordonnées de 2024 sur la surveillance des marchés de JPMorgan" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="760" height="410" fill="#0c0d10"/>
  <text x="34" y="40" fill="#f5f6f8" font-size="18" font-weight="700">2024 : MONTANTS NOMINAUX ET CRÉDITS</text>
  <text x="34" y="64" fill="#8b909b" font-size="12">Les trois montants bruts ne doivent pas être additionnés sans retraiter les crédits.</text>
  <rect x="34" y="104" width="200" height="92" rx="6" fill="#15171c" stroke="#5eead4"/>
  <text x="134" y="134" fill="#5eead4" font-size="13" font-weight="700" text-anchor="middle">OCC</text>
  <text x="134" y="168" fill="#f5f6f8" font-size="22" font-weight="700" text-anchor="middle">250 M$</text>
  <rect x="280" y="104" width="200" height="92" rx="6" fill="#15171c" stroke="#5eead4"/>
  <text x="380" y="134" fill="#5eead4" font-size="13" font-weight="700" text-anchor="middle">RÉSERVE FÉDÉRALE</text>
  <text x="380" y="168" fill="#f5f6f8" font-size="22" font-weight="700" text-anchor="middle">98,168 M$</text>
  <rect x="526" y="104" width="200" height="92" rx="6" fill="#15171c" stroke="#f5b13d"/>
  <text x="626" y="134" fill="#f5b13d" font-size="13" font-weight="700" text-anchor="middle">CFTC, NOMINAL</text>
  <text x="626" y="168" fill="#f5f6f8" font-size="22" font-weight="700" text-anchor="middle">200 M$</text>
  <text x="380" y="232" fill="#ff4d87" font-size="15" font-weight="700" text-anchor="middle">MOINS 100 M$ DE CRÉDITS CFTC</text>
  <text x="380" y="258" fill="#8b909b" font-size="11" text-anchor="middle">50 M$ pour le paiement OCC, 50 M$ pour le paiement Fed</text>
  <line x1="190" y1="286" x2="570" y2="286" stroke="#3a3d46" stroke-width="2"/>
  <rect x="190" y="306" width="380" height="62" rx="6" fill="#171a20" stroke="#ff4d87" stroke-width="2"/>
  <text x="380" y="345" fill="#ff4d87" font-size="24" font-weight="700" text-anchor="middle">448,168 M$ EFFECTIFS</text>
  <text x="34" y="396" fill="#8b909b" font-size="10">Sources : Fed 24-007-CMP-HC ; OCC AA-EC-2023-49 ; CFTC 24-07 ; JPMorgan 10-Q T2 2024.</text>
</svg>
<figcaption>JPMorgan présente le montant agrégé comme 450 millions de dollars après arrondi. Le total brut des trois ordres atteint 548,168 millions, mais 100 millions sont crédités par la CFTC.</figcaption>
</figure>

## Un verdict limité sur le second dossier

Les sanctions de 2024 n'établissent pas une répétition des manipulations de 2008 à 2016. La CFTC sanctionne J.P. Morgan Securities pour défaut de supervision. JPMorgan admet les faits concernant l'étendue et les causes des lacunes, puis reconnaît leur violation de la règle CFTC 166.3. La firme n'admet ni ne conteste les autres constatations selon la formule de règlement.

Dans son rapport du deuxième trimestre 2024, JPMorgan affirme avoir examiné les données auparavant non surveillées et n'avoir identifié ni faute d'employé, ni préjudice pour les clients, ni dommage au marché. Cette affirmation constitue la conclusion de la firme. Les ordres réglementaires exigent parallèlement des rapports détaillés et une évaluation indépendante. Leur contenu n'apparaît pas dans les documents publics consultés pour cette enquête.

Le DOJ clôt de son côté le dossier pénal de 2020. Le terme de trois ans de l'accord expire le 29 septembre 2023. Le 29 mars 2024, le ministère demande un classement avec préjudice en indiquant que JPMorgan a rempli ses obligations ; le tribunal l'accorde le jour même. La décision intervient après les ordres Fed et OCC, mais porte sur le respect de l'accord pénal antérieur. Elle n'efface pas les constatations de 2024 et ne vaut pas certification publique de chaque flux de surveillance.

## Partie 2 : la boîte noire du contrôle

Le premier volet aboutit à une conclusion étroite. JPMorgan a reconnu un vaste schéma historique de manipulation. Pendant une partie de la période de remédiation, des milliards de messages n'entraient pas dans son dispositif de surveillance. Les régulateurs ont établi un défaut de supervision, pas une nouvelle fraude portant sur ces messages.

Le risque essentiel est donc un risque de connaissance. Une banque peut compter ses alertes, calibrer ses scénarios et renforcer ses équipes tout en ignorant une absence massive en amont. Sans rapprochement de bout en bout, le tableau de bord mesure uniquement les données reçues.

La seconde partie, à paraître, ouvrira cette chaîne : accès sponsorisé, inventaire des plateformes, rapports obligatoires, contrôleur indépendant, inconnues publiques et tests utiles pour suivre la remédiation.

## Sources primaires

1. CFTC, [ordonnance 20-69 sur les manipulations et le défaut de supervision](https://www.cftc.gov/media/4826/enfjpmorganchaseorder092920/download), 29 septembre 2020.
2. Department of Justice, [dossier 20-CR-175 et accord de poursuites différées](https://www.justice.gov/criminal/criminal-vns/case/jpmorgan-chase-co-deferred-prosecution-agreement), mis à jour le 27 août 2024.
3. Department of Justice, [condamnation de Gregg Smith et Michael Nowak](https://www.justice.gov/archives/opa/pr/former-jp-morgan-precious-metals-traders-sentenced-prison), 22 août 2023.
4. SEC, [ordonnance sur les manipulations du marché au comptant des Treasuries](https://www.sec.gov/newsroom/press-releases/2020-233), 29 septembre 2020.
5. Réserve fédérale, [ordonnance 24-007-B-HC et 24-007-CMP-HC](https://www.federalreserve.gov/newsevents/pressreleases/files/enf20240314a1.pdf), 14 mars 2024.
6. OCC, [ordonnance et pénalité sur la surveillance des marchés](https://www.occ.treas.gov/news-issuances/news-releases/2024/nr-occ-2024-25.html), 14 mars 2024.
7. CFTC, [ordonnance 24-07 sur les lacunes de surveillance](https://www.cftc.gov/media/10721/Order05232024JPMorganSecuritiesLLC/download), 23 mai 2024.
8. JPMorgan Chase, [Form 10-Q au 30 juin 2024](https://www.sec.gov/Archives/edgar/data/19617/000001961724000453/jpm-20240630.htm), note sur les enquêtes relatives aux plateformes de négociation.

*Méthode et limite : chaque montant de sanction a été rapproché de l'ordonnance correspondante et des mécanismes de crédit. « Milliards » désigne des messages d'ordre, pas une valeur en dollars. L'enquête n'attribue aucun abus aux flux absents en dehors des conduites déjà admises ou jugées. Les conclusions de JPMorgan sont présentées comme telles. Aucun document interne, rapport du consultant ou rapport de remédiation non public n'a été utilisé.*
