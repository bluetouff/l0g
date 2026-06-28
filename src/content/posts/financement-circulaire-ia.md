---
title: "Le financement circulaire de l'IA : quand le même dollar tourne en rond et ressort en chiffre d'affaires"
description: "Nvidia investit dans OpenAI, qui s'engage à dépenser des centaines de milliards chez Oracle, Microsoft ou CoreWeave, qui achètent des puces Nvidia. Le même dollar boucle entre une poignée d'acteurs et ressort en revenu. Avec près de 1 400 milliards de dollars d'engagements de calcul pour environ 13 milliards de chiffre d'affaires, OpenAI cristallise le débat. Cartographie chiffrée d'une boucle, et l'argument inverse."
pubDate: 2026-06-27T16:30:00+02:00
updatedDate: 2026-06-27T16:30:00+02:00
tags: ["marchés", "valorisations", "tech", "régulation"]
draft: false
---

*Une question revient à chaque trimestre : la demande qui porte les valorisations de l'intelligence artificielle est-elle réelle, ou en partie fabriquée par les acteurs eux-mêmes ? Le soupçon a un nom, le financement circulaire. Un fabricant de puces investit dans un laboratoire d'IA, qui s'engage à louer du calcul à des fournisseurs de cloud, qui achètent les puces du fabricant. Le même dollar fait le tour et revient en chiffre d'affaires, ce qui peut donner à une demande l'apparence d'être organique. Sans trancher le débat de la bulle, voici la boucle mise à plat, chiffrée, et l'argument de ceux qui la jugent saine.*

Le cœur du dispositif se lit en trois mouvements. Nvidia s'est engagé à investir jusqu'à **100 milliards** de dollars dans OpenAI dans le cadre d'un partenariat de déploiement de capacité. OpenAI, de son côté, a accumulé des engagements de calcul colossaux auprès de fournisseurs de cloud : autour de **300 milliards** de dollars sur cinq ans avec Oracle, **250 milliards** avec Microsoft, **22,4 milliards** avec CoreWeave, **38 milliards** avec Amazon Web Services. Or ces fournisseurs équipent leurs centres de données en puces Nvidia. Le capital injecté par le fabricant en haut de la chaîne lui revient donc en commandes en bas de la chaîne.

## La boucle, en clair

Le cas le plus net est celui de CoreWeave. Nvidia détient plus de **5 %** de son capital, et a accepté en septembre 2025 de lui acheter pour **6,3 milliards** de dollars de services cloud, en s'engageant à payer le temps de calcul que CoreWeave ne vendrait pas à d'autres. Avec ce filet, CoreWeave peut commander davantage de puces Nvidia en confiance. Le même schéma se retrouve, à des degrés divers, entre le fabricant, le laboratoire et les loueurs de calcul. Aucune de ces opérations n'est illégale ou anormale en soi, le financement fournisseur existe depuis longtemps, mais leur accumulation entre un très petit nombre d'acteurs interconnectés brouille la lecture de la demande réelle.

<figure class="infographic">
<svg viewBox="0 0 720 330" role="img" aria-label="La boucle du financement circulaire de l'IA entre fabricant de puces, laboratoire et fournisseurs de cloud" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="330" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Le tour de piste du dollar IA</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Le capital investi en haut revient en commandes en bas. Montants annoncés.</text>
  <rect x="280" y="86" width="160" height="56" rx="8" fill="none" stroke="#5eead4" stroke-width="1.5"></rect>
  <text x="360" y="112" fill="#f5f6f8" font-size="13" text-anchor="middle">Fabricant de puces</text>
  <text x="360" y="130" fill="#8b909b" font-size="11" text-anchor="middle">Nvidia</text>
  <rect x="60" y="200" width="180" height="56" rx="8" fill="none" stroke="#ff4d87" stroke-width="1.5"></rect>
  <text x="150" y="226" fill="#f5f6f8" font-size="13" text-anchor="middle">Laboratoire d'IA</text>
  <text x="150" y="244" fill="#8b909b" font-size="11" text-anchor="middle">OpenAI</text>
  <rect x="480" y="200" width="180" height="56" rx="8" fill="none" stroke="#f5b13d" stroke-width="1.5"></rect>
  <text x="570" y="220" fill="#f5f6f8" font-size="13" text-anchor="middle">Fournisseurs cloud</text>
  <text x="570" y="238" fill="#8b909b" font-size="11" text-anchor="middle">Oracle, Microsoft, CoreWeave</text>
  <line x1="290" y1="128" x2="200" y2="198" stroke="#5eead4" stroke-width="1.6" marker-end="url(#l1)"></line>
  <text x="190" y="160" fill="#5eead4" font-size="11">investit jusqu'à 100 Md$</text>
  <line x1="240" y1="232" x2="478" y2="232" stroke="#ff4d87" stroke-width="1.6" marker-end="url(#l2)"></line>
  <text x="360" y="224" fill="#ff4d87" font-size="11" text-anchor="middle">loue du calcul, 300 Md$ Oracle</text>
  <line x1="560" y1="198" x2="430" y2="128" stroke="#f5b13d" stroke-width="1.6" marker-end="url(#l3)"></line>
  <text x="560" y="160" fill="#f5b13d" font-size="11">achètent les puces</text>
  <text x="360" y="300" fill="#d6d9df" font-size="12" text-anchor="middle">Le dollar boucle entre une poignée d'acteurs interconnectés.</text>
  <defs>
    <marker id="l1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="#5eead4"></path></marker>
    <marker id="l2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="#ff4d87"></path></marker>
    <marker id="l3" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="#f5b13d"></path></marker>
  </defs>
</svg>
<figcaption>Le fabricant investit dans le laboratoire, qui loue du calcul aux fournisseurs de cloud, qui achètent les puces du fabricant. Montants d'engagements annoncés publiquement. Sources : Reuters, Bloomberg, communiqués des sociétés.</figcaption>
</figure>

## Les chiffres, et le décalage

C'est l'ampleur qui interpelle. Selon les engagements rendus publics, OpenAI a accumulé près de **1 400 milliards** de dollars de commitments de calcul sur la décennie, répartis entre une poignée de fournisseurs, dont environ **350 milliards** avec Broadcom et **90 milliards** avec AMD en plus des montants déjà cités. En face, son chiffre d'affaires était de l'ordre de **13 milliards** de dollars début 2026, en forte croissance mais sans commune mesure avec ses engagements, et l'entreprise serait en perte d'environ **14 milliards** de dollars sur 2026 selon des estimations de presse. Ce décalage entre des promesses de dépenses dignes d'un État et des revenus encore modestes est le nœud du débat.

<figure class="infographic">
<svg viewBox="0 0 720 280" role="img" aria-label="Engagements de calcul d'OpenAI comparés à son chiffre d'affaires" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="280" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Engagements contre revenus, OpenAI</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Commitments de calcul cumulés sur la décennie, contre chiffre d'affaires annuel. Md$.</text>
  <text x="32" y="108" fill="#ff4d87" font-size="12">ENGAGEMENTS DE CALCUL</text>
  <rect x="32" y="118" width="640" height="34" fill="#ff4d87" opacity="0.85"></rect>
  <text x="42" y="140" fill="#0c0d10" font-size="13" font-weight="700">~1 400 Md$</text>
  <text x="32" y="190" fill="#5eead4" font-size="12">CHIFFRE D'AFFAIRES (début 2026)</text>
  <rect x="32" y="200" width="9" height="34" fill="#5eead4" opacity="0.9"></rect>
  <text x="50" y="222" fill="#d6d9df" font-size="13">~13 Md$</text>
  <text x="32" y="266" fill="#8b909b" font-size="11">Le trait vert, à l'échelle, fait moins de 1 % de la barre rose.</text>
</svg>
<figcaption>Près de 1 400 milliards de dollars d'engagements de calcul cumulés face à un chiffre d'affaires de l'ordre de 13 milliards début 2026. La barre verte, à l'échelle, est presque invisible. Sources : engagements annoncés par les sociétés, estimations de presse (Reuters, Bloomberg).</figcaption>
</figure>

## L'écho de la bulle internet

Les vétérans du secteur y voient un air de déjà-vu. À la fin des années 1990, les équipementiers télécoms avaient financé leurs propres clients, les opérateurs, par des prêts et des facilités, pour soutenir la construction des réseaux de fibre. Certains opérateurs échangeaient même des droits de capacité entre eux, en les comptabilisant comme des ventes, alors que les transactions s'annulaient largement. Quand la demande a déçu, le modèle s'est brisé, des opérateurs surendettés ont fait faillite, et une grande partie de la capacité est restée inutilisée des années. La crainte est que des engagements croisés massifs jouent aujourd'hui le même rôle d'amplificateur, à la hausse comme à la baisse.

## La thèse inverse

À ce procès, il existe une défense sérieuse, qu'il faut exposer honnêtement. Le financement fournisseur n'est pas une fraude : il a permis de bâtir les chemins de fer, les télécoms et les premières vagues d'informatique, en amorçant des marchés réels. La demande sous-jacente d'IA n'est pas que circulaire, des entreprises, des développeurs et des particuliers paient pour des usages bien réels, hors de la boucle. Et l'ampleur des engagements croisés, bien que considérable, reste mesurée au regard des activités : selon UBS, l'accord entre OpenAI et Nvidia représenterait jusqu'à **13 %** du chiffre d'affaires 2026 attendu de Nvidia, autour de **272 milliards** de dollars, loin de constituer l'essentiel de ses revenus. Le risque existe, mais l'assimiler d'emblée à une fraude comptable serait excessif.

## Où regarder

La tension, si elle monte, se lira d'abord dans les bilans des fournisseurs d'infrastructure : dette en hausse, engagements de location qui gonflent, écarts de credit default swaps qui s'élargissent. Un signal d'alerte a déjà clignoté début 2026, quand la presse a rapporté que l'investissement de Nvidia dans OpenAI marquait le pas, provoquant un accès de nervosité sur trois capitalisations géantes avant un démenti. C'est la vulnérabilité structurelle de toute boucle : il suffit qu'un maillon hésite pour que la confiance vacille sur l'ensemble. Le rôle d'un journal de données n'est pas de proclamer la bulle, mais de cartographier précisément qui finance qui, à quelle hauteur, et de rendre lisible la part de la demande qui tourne en cercle. Le reste est affaire de jugement, et le jugement a besoin de chiffres. Pour le contexte, voir aussi notre [décryptage du récit « peuple actionnaire de l'IA »](/posts/le-peuple-americain-actionnaire-de-lia-decryptage-dun-scam-presidentiel/) et notre analyse de l'[économie des intentions](/posts/economie-des-intentions/).

---

**Sources principales :** communiqués et déclarations des sociétés (OpenAI, Nvidia, Oracle, Microsoft, CoreWeave, Amazon Web Services, AMD, Broadcom) ; Reuters et Bloomberg pour les montants et la chronologie des accords (Oracle environ 300 milliards de dollars sur cinq ans, Nvidia jusqu'à 100 milliards d'investissement, CoreWeave 22,4 milliards, AWS 38 milliards, backstop Nvidia-CoreWeave de 6,3 milliards) ; UBS Chief Investment Office (part de l'accord OpenAI-Nvidia dans le chiffre d'affaires 2026 de Nvidia, estimé autour de 272 milliards) ; estimations de presse sur le chiffre d'affaires d'environ 13 milliards et la perte attendue d'OpenAI en 2026. Engagements et dates vérifiés un à un ; les montants sont des engagements annoncés, non des dépenses constatées.
