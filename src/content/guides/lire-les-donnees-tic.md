---
title: "Lire les données TIC : qui finance vraiment la dette américaine"
description: "Guide de référence sur le système Treasury International Capital : ce que mesurent les flux mensuels et la table des grands détenteurs étrangers de Treasuries, pourquoi le Japon devance le Royaume-Uni et la Chine, et surtout le biais de conservation qui attribue les titres au pays du dépositaire et non au détenteur réel. Belgique, Luxembourg, Caïmans, les hedge funds du basis trade sous-comptés de 1 400 milliards, le recul de la part officielle : ce que la donnée montre et ce qu'elle déforme."
summary: "Les données TIC (Treasury International Capital) sont le relevé du Trésor américain qui mesure les détentions et flux transfrontaliers de titres américains. Elles disent qui finance la dette des États-Unis, mais sur une base de conservation : les titres sont attribués au pays du dépositaire, pas au détenteur final, ce qui gonfle les centres de garde (Belgique, Luxembourg, Caïmans) et masque les vrais propriétaires."
pubDate: 2026-06-30T11:00:00+02:00
updatedDate: 2026-06-30T11:00:00+02:00
tags: ["macro", "dette", "dédollarisation"]
category: fed
draft: false
---

*La question revient à chaque adjudication du Trésor et à chaque pic de taux : si les étrangers se détournaient de la dette américaine, qui prendrait le relais, et à quel rendement ? Pour y répondre, une source fait référence, le système TIC du Trésor. Elle dit combien d'obligations américaines les non-résidents détiennent, et lesquels. Mais elle le dit dans une langue qu'il faut apprendre à lire : une comptabilité par lieu de garde, où la Belgique pèse plus que l'Arabie saoudite et où un hedge fund des Caïmans disparaît dans une ligne « domestique ». Ce guide montre ce que la donnée capture, et tout ce qu'elle déplace.*

## Le champ du système TIC

Le Treasury International Capital est l'ensemble de relevés tenus par le Trésor américain, avec la Fed de New York comme agent, qui suivent les mouvements de capitaux de portefeuille entre résidents et non-résidents. Deux briques importent pour la dette. D'abord les flux mensuels : les achats et ventes nets de titres américains à long terme par les étrangers, publiés environ six semaines après la fin du mois. Ensuite les encours, dont la table phare des grands détenteurs étrangers de Treasuries, le Major Foreign Holders, qui classe les pays par stock détenu.

Fin 2025, ces non-résidents détenaient environ **9 270 milliards** de dollars de Treasuries, un record battu début 2026 au-delà de **9 400 milliards**. C'est considérable, mais à relativiser : cela représente de l'ordre de **30 %** de la dette négociable, une part qui décline lentement depuis quinze ans à mesure que la détention domestique, Fed comprise, monte. Lire le TIC, c'est donc d'abord garder en tête que l'étranger est un financeur majeur mais minoritaire, et de moins en moins dominant.

Le trio de tête est stable et instructif. Le Japon reste de loin le premier créancier étranger, autour de **1 185 milliards** de dollars fin 2025. Vient ensuite le Royaume-Uni, à **866 milliards**, qui a dépassé la Chine. Celle-ci, troisième, est tombée à **684 milliards**. Le reste du classement est dominé par des noms qui devraient alerter : Belgique, Luxembourg, Îles Caïmans, Irlande. Ce ne sont pas des puissances financières souveraines, ce sont des centres de garde et de domiciliation de fonds. C'est le premier signe que la table ne dit pas ce qu'elle semble dire.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 380" role="img" aria-label="Principaux détenteurs étrangers de Treasuries fin 2025, avec distinction des centres de conservation" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="380" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Qui « détient » la dette américaine</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Treasuries détenus par pays, fin 2025, en milliards de dollars.</text>
  <text x="150" y="92" fill="#d6d9df" font-size="12" text-anchor="end">Japon</text>
  <rect x="160" y="80" width="430" height="16" fill="#5eead4" opacity="0.9"></rect>
  <text x="598" y="93" fill="#5eead4" font-size="11" font-weight="700">1 186</text>
  <text x="150" y="116" fill="#d6d9df" font-size="12" text-anchor="end">Royaume-Uni</text>
  <rect x="160" y="104" width="314" height="16" fill="#f5b13d" opacity="0.9"></rect>
  <text x="482" y="117" fill="#f5b13d" font-size="11" font-weight="700">866</text>
  <text x="150" y="140" fill="#d6d9df" font-size="12" text-anchor="end">Chine</text>
  <rect x="160" y="128" width="248" height="16" fill="#5eead4" opacity="0.9"></rect>
  <text x="416" y="141" fill="#5eead4" font-size="11" font-weight="700">684</text>
  <text x="150" y="164" fill="#d6d9df" font-size="12" text-anchor="end">Belgique</text>
  <rect x="160" y="152" width="173" height="16" fill="#f5b13d" opacity="0.9"></rect>
  <text x="341" y="165" fill="#f5b13d" font-size="11" font-weight="700">477</text>
  <text x="150" y="188" fill="#d6d9df" font-size="12" text-anchor="end">Canada</text>
  <rect x="160" y="176" width="170" height="16" fill="#8b909b" opacity="0.8"></rect>
  <text x="338" y="189" fill="#d6d9df" font-size="11">468</text>
  <text x="150" y="212" fill="#d6d9df" font-size="12" text-anchor="end">Luxembourg</text>
  <rect x="160" y="200" width="158" height="16" fill="#f5b13d" opacity="0.9"></rect>
  <text x="326" y="213" fill="#f5b13d" font-size="11" font-weight="700">435</text>
  <text x="150" y="236" fill="#d6d9df" font-size="12" text-anchor="end">Îles Caïmans</text>
  <rect x="160" y="224" width="153" height="16" fill="#ff4d87" opacity="0.9"></rect>
  <text x="321" y="237" fill="#ff4d87" font-size="11" font-weight="700">421</text>
  <text x="150" y="260" fill="#d6d9df" font-size="12" text-anchor="end">France</text>
  <rect x="160" y="248" width="134" height="16" fill="#8b909b" opacity="0.8"></rect>
  <text x="302" y="261" fill="#d6d9df" font-size="11">369</text>
  <text x="150" y="284" fill="#d6d9df" font-size="12" text-anchor="end">Irlande</text>
  <rect x="160" y="272" width="124" height="16" fill="#f5b13d" opacity="0.9"></rect>
  <text x="292" y="285" fill="#f5b13d" font-size="11" font-weight="700">341</text>
  <line x1="160" y1="306" x2="660" y2="306" stroke="#2a2c33" stroke-width="1"></line>
  <rect x="160" y="320" width="12" height="12" fill="#f5b13d"></rect>
  <text x="178" y="330" fill="#d6d9df" font-size="11">centre de conservation ou de fonds</text>
  <rect x="400" y="320" width="12" height="12" fill="#ff4d87"></rect>
  <text x="418" y="330" fill="#d6d9df" font-size="11">hedge funds (basis trade)</text>
  <text x="160" y="356" fill="#8b909b" font-size="11">Source : Trésor américain, table des grands détenteurs étrangers (MFH), déc. 2025.</text>
</svg>
<figcaption>Derrière le Japon et la Chine, le classement des grands détenteurs est truffé de centres de garde et de domiciliation, Royaume-Uni, Belgique, Luxembourg, Irlande, et des Îles Caïmans où logent les hedge funds du basis trade. Ces lignes ne désignent pas des États créanciers, mais le lieu où les titres sont conservés. Source : Trésor américain, table MFH, décembre 2025.</figcaption>
</figure>

## Le biais de conservation, cœur du problème

Le Trésor le dit lui-même dans chaque communiqué : la table reflète des détentions collectées sur une base de conservation, et ne peut pas attribuer la propriété avec exactitude. Concrètement, un Treasury acheté par un investisseur d'un pays mais gardé dans un compte d'un pays tiers est attribué au pays du dépositaire. C'est le biais de conservation, et il déforme tout le classement. La Belgique pèse lourd parce qu'Euroclear, l'un des grands dépositaires mondiaux, y est domicilié. Le Luxembourg et l'Irlande pèsent parce que les fonds d'investissement y sont enregistrés. Le Royaume-Uni gonfle parce que Londres est une place de garde, pas parce que l'État britannique accumule de la dette américaine.

Le cas le plus parlant pour la stabilité financière est celui des Îles Caïmans. Une bonne part de leur ligne correspond à des fonds spéculatifs américains domiciliés là pour des raisons fiscales, engagés dans le basis trade sur Treasuries. Pire, un rapport de la Réserve fédérale a estimé que les positions en Treasuries de ces hedge funds des Caïmans étaient sous-comptées d'environ **1 400 milliards** de dollars fin 2024, le TIC les classant en partie comme détentions domestiques américaines. La donnée range ainsi parmi les acheteurs « américains » des positions à fort levier qui sont au cœur du risque de marché, comme l'explique notre analyse du [basis trade sur Treasuries](/posts/basis-trade-treasuries-levier/). Lire le TIC sans cette grille, c'est prendre un dépositaire pour un investisseur et un arbitragiste à effet de levier pour un épargnant domestique.

La correction existe, mais elle est lente. Chaque année, le Trésor mène une enquête de référence qui reconstitue la propriété par nationalité et révise les données mensuelles. Le rapport sur les détentions étrangères de titres américains à fin juin 2025 a été publié fin avril 2026, et une nouvelle enquête obligatoire est en cours au 30 juin 2026. Ces enquêtes redonnent par exemple à la Chine et aux pays du Golfe des titres logés à Londres ou aux Caïmans. La table mensuelle est donc une approximation utile, à condition de la lire comme une carte des lieux de garde, et l'enquête annuelle comme la carte des vrais détenteurs.

## Encours, flux et l'effet des prix

Deuxième confusion fréquente : mélanger l'encours et le flux. La table des détenteurs donne un stock à une date, sensible aux variations de prix. Les flux mensuels, eux, mesurent les achats et ventes nets, c'est-à-dire la décision active des investisseurs. Les deux divergent souvent. En février 2026, les entrées nettes TIC ont atteint **184,5 milliards** de dollars, en mars **150,7 milliards** ; en octobre 2025, à l'inverse, la balance était négative, à **−37,3 milliards**. Ce sont les flux, pas les stocks, qui disent si l'appétit pour la dette américaine se maintient.

Le piège le plus subtil tient à la valorisation. Le TIC enregistre les détentions à leur valeur de marché, pas à leur valeur faciale. Quand les rendements montent, le prix des obligations baisse, et l'encours déclaré d'un pays peut reculer sans qu'il ait vendu un seul titre. À l'inverse, une baisse des taux peut faire grossir un stock à l'achat nul. Beaucoup de titres affirmant que tel pays « se débarrasse » de ses Treasuries confondent un effet prix avec une vente. La seule façon de trancher est de croiser l'encours avec les flux nets de la même période.

## La carte qui change : Chine, Royaume-Uni, et le retrait des officiels

Lue dans la durée, et corrigée mentalement du biais de conservation, la donnée raconte deux mouvements de fond. Le premier est le repli chinois. La Chine détenait plus de **1 300 milliards** de dollars de Treasuries au milieu des années 2010 ; elle est sous **700 milliards** fin 2025, un recul net en montant comme en part, même en tenant compte des titres chinois logés ailleurs. Le second est la montée des places de garde européennes et du Royaume-Uni, qui reflète moins une demande nationale qu'un déplacement de la conservation. Ces deux dynamiques nourrissent le débat sur la dédollarisation, que notre article [confronte au détail des chiffres](/posts/dedollarisation-recit-vs-chiffres/) : le mouvement est réel mais graduel, et il se lit mal dans la seule table mensuelle.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 300" role="img" aria-label="Recul des détentions chinoises de Treasuries face à la hausse des détentions logées au Royaume-Uni" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="300" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">La Chine recule, Londres enfle</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Treasuries détenus, en milliards de dollars, fin d'année.</text>
  <line x1="60" y1="240" x2="660" y2="240" stroke="#2a2c33" stroke-width="1"></line>
  <text x="120" y="258" fill="#8b909b" font-size="11" text-anchor="middle">2013</text>
  <text x="360" y="258" fill="#8b909b" font-size="11" text-anchor="middle">2019</text>
  <text x="600" y="258" fill="#8b909b" font-size="11" text-anchor="middle">2025</text>
  <rect x="96" y="78" width="32" height="162" fill="#ff4d87" opacity="0.9"></rect>
  <text x="112" y="72" fill="#ff4d87" font-size="10" text-anchor="middle">1 270</text>
  <rect x="336" y="109" width="32" height="131" fill="#ff4d87" opacity="0.9"></rect>
  <text x="352" y="103" fill="#ff4d87" font-size="10" text-anchor="middle">1 070</text>
  <rect x="576" y="156" width="32" height="84" fill="#ff4d87" opacity="0.9"></rect>
  <text x="592" y="150" fill="#ff4d87" font-size="10" text-anchor="middle">684</text>
  <rect x="132" y="221" width="32" height="19" fill="#5eead4" opacity="0.9"></rect>
  <text x="148" y="215" fill="#5eead4" font-size="10" text-anchor="middle">152</text>
  <rect x="372" y="192" width="32" height="48" fill="#5eead4" opacity="0.9"></rect>
  <text x="388" y="186" fill="#5eead4" font-size="10" text-anchor="middle">392</text>
  <rect x="612" y="134" width="32" height="106" fill="#5eead4" opacity="0.9"></rect>
  <text x="628" y="128" fill="#5eead4" font-size="10" text-anchor="middle">866</text>
  <rect x="60" y="276" width="12" height="12" fill="#ff4d87"></rect>
  <text x="78" y="286" fill="#d6d9df" font-size="11">Chine</text>
  <rect x="180" y="276" width="12" height="12" fill="#5eead4"></rect>
  <text x="198" y="286" fill="#d6d9df" font-size="11">Royaume-Uni (place de garde)</text>
  <text x="470" y="286" fill="#8b909b" font-size="11">Source : Trésor américain (MFH).</text>
</svg>
<figcaption>En une décennie, la Chine est passée d'environ <strong>1 270 milliards</strong> de dollars de Treasuries à moins de <strong>700 milliards</strong>, pendant que le Royaume-Uni, place de conservation, montait de <strong>152</strong> à <strong>866 milliards</strong>. La bascule mêle vrai désengagement chinois et simple déplacement de la garde vers Londres. Source : Trésor américain, table MFH.</figcaption>
</figure>

Le troisième mouvement est le plus discret et le plus important. Au sein des détentions étrangères, la part des institutions officielles, banques centrales et fonds souverains, recule. Elle dépassait **53 %** du total fin 2021 ; elle est tombée autour de **42 %** fin 2025, alors même que le total atteignait un record. Mécaniquement, ce sont les investisseurs privés, gérants de fonds, assureurs, fonds spéculatifs, qui ont porté la hausse. L'acheteur marginal de la dette américaine n'est plus la banque centrale étrangère arrimée au dollar, mais un investisseur privé sensible au rendement, donc plus volatil. C'est un changement de nature du financement extérieur, que la seule lecture du total masque.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 270" role="img" aria-label="Recul de la part des détenteurs officiels étrangers dans les Treasuries entre 2021 et 2025" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="270" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">L'acheteur marginal est devenu privé</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Répartition des détentions étrangères de Treasuries, officiel contre privé.</text>
  <text x="40" y="100" fill="#d6d9df" font-size="12" font-weight="700">Fin 2021 · total ≈ 7 740 Md$</text>
  <rect x="40" y="110" width="340" height="26" fill="#8b909b" opacity="0.85"></rect>
  <rect x="380" y="110" width="300" height="26" fill="#5eead4" opacity="0.9"></rect>
  <text x="46" y="128" fill="#0c0d10" font-size="12" font-weight="700">officiel 53 %</text>
  <text x="386" y="128" fill="#0c0d10" font-size="12" font-weight="700">privé 47 %</text>
  <text x="40" y="176" fill="#d6d9df" font-size="12" font-weight="700">Fin 2025 · total ≈ 9 271 Md$</text>
  <rect x="40" y="186" width="268" height="26" fill="#8b909b" opacity="0.85"></rect>
  <rect x="308" y="186" width="372" height="26" fill="#5eead4" opacity="0.9"></rect>
  <text x="46" y="204" fill="#0c0d10" font-size="12" font-weight="700">officiel 42 %</text>
  <text x="314" y="204" fill="#0c0d10" font-size="12" font-weight="700">privé 58 %</text>
  <text x="40" y="248" fill="#8b909b" font-size="11">Détenteurs officiels : env. 4 118 Md$ (2021) puis 3 887 Md$ (2025). Source : Trésor américain (MFH).</text>
</svg>
<figcaption>La part des détenteurs officiels étrangers, banques centrales et fonds souverains, est passée d'environ <strong>53 %</strong> fin 2021 à <strong>42 %</strong> fin 2025, leur encours reculant de <strong>4 118</strong> à <strong>3 887 milliards</strong> de dollars pendant que le total grimpait. Le financement extérieur de la dette américaine repose désormais davantage sur des investisseurs privés sensibles au rendement. Source : Trésor américain, table MFH.</figcaption>
</figure>

## Lire le TIC en pratique

Tout est public et gratuit sur le site du Trésor. Le communiqué mensuel et la table des grands détenteurs paraissent vers le milieu du mois, avec environ six semaines de décalage ; les dates doivent être vérifiées directement auprès du Trésor américain, répertorié dans nos [sites de référence](/sites-reference/). La séquence de lecture utile tient en quelques réflexes. Distinguer le flux du stock, et ne juger l'appétit qu'avec les flux nets. Corriger mentalement le biais de conservation, en traitant Belgique, Luxembourg, Irlande, Caïmans et une part du Royaume-Uni comme des lieux de garde. Se méfier des variations d'encours qui ne sont qu'un effet prix lié aux taux. Et attendre l'enquête annuelle pour la carte des vrais détenteurs par nationalité.

Le TIC ne se lit pas seul. Il donne le côté étranger de la détention de dette ; le côté domestique se lit dans le [bilan de la Fed](/guides/lire-h41-bilan-fed/), dont le portefeuille de Treasuries est l'autre grande pièce du puzzle. Le rôle croissant des [stablecoins comme acheteurs de bons du Trésor](/guides/stablecoins-genius-act/) ajoute une couche que le TIC ne capte qu'imparfaitement, une partie de ces réserves transitant par des structures offshore. Pour la démarche d'ensemble du site, voir la [méthodologie](/methodologie/).

Au fond, le TIC illustre parfaitement une règle qui vaut pour toute donnée publique : la transparence n'est pas la lisibilité. La table livre des chiffres précis au dixième de milliard, mais rangés selon une logique de dépositaire qui travestit la propriété. Bien lu, le TIC reste l'une des meilleures fenêtres sur le financement extérieur des États-Unis. Mal lu, il fait dire à la Belgique ce que pense Pékin, et range un arbitrage à effet de levier des Caïmans parmi l'épargne américaine. La donnée est exacte ; c'est sa grammaire qu'il faut maîtriser.

---

**Sources principales :**

- [Trésor américain, système TIC, page de présentation](https://home.treasury.gov/data/treasury-international-capital-tic-system) : architecture des relevés, base de conservation, enquêtes annuelles de référence, enquête obligatoire au 30 juin 2026.
- [Trésor américain, table des grands détenteurs étrangers de Treasuries (MFH)](https://ticdata.treasury.gov/Publish/mfhhis01.txt) : encours par pays (Japon 1 185,5 ; Royaume-Uni 866 ; Chine 683,5 ; total 9 270,9 ; officiels 3 887 milliards de dollars, décembre 2025) et historique mensuel.
- [Trésor américain, communiqué TIC de mars 2026](https://home.treasury.gov/news/press-releases/sb0499) : flux nets mensuels (entrées de 150,7 milliards en mars, 184,5 milliards en février) et avertissement officiel sur les limites de la donnée de conservation.
- [Congressional Research Service, « Foreign Holdings of Federal Debt » (RS22331)](https://www.congress.gov/crs-product/RS22331) : environ 9 200 milliards de dollars détenus par l'étranger fin 2025, soit près de 31 % de la dette, parts du Japon, du Royaume-Uni et de la Chine, attribution par lieu et non par nationalité.
- [Wolf Street, « The Largest Foreign Holders of US Treasury Securities and the Basis Trade », avril 2026](https://wolfstreet.com/2026/04/15/the-largest-foreign-holders-of-us-treasury-securities-and-the-basis-trade-april-2026-update/) : record d'environ 9 490 milliards début 2026, et sous-comptage d'environ 1 400 milliards des Treasuries des hedge funds des Caïmans relevé par la Réserve fédérale.
