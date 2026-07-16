---
title: "Lire la solidité d'un assureur-vie : capital, réassurance et actifs opaques"
description: "Guide de référence pour juger la solidité d'un assureur-vie : le ratio de capital réglementaire (RBC) et ses seuils d'action de la NAIC, la lecture du bilan statutaire (Schedule D contre Schedule BA), la réassurance cédée aux Bermudes, la part d'actifs affiliés et illiquides, les désignations NAIC et les notations privées, la fragilité du passif de rentes, et pourquoi un assureur bien noté peut cacher un risque déplacé hors du regard. Avec la chute de 777 Re comme cas d'école."
summary: "Juger la solidité d'un assureur-vie revient à croiser plusieurs cadrans : son capital réglementaire (le ratio RBC et les seuils d'action de la NAIC), la composition de ses actifs (bons et obligations en Schedule D, actifs alternatifs et affiliés en Schedule BA), le levier et la destination de sa réassurance (souvent cédée à un affilié aux Bermudes), la qualité des notations qui portent son capital (publiques ou privées), et la nature de son passif (rentes à passif long mais rachetable). Un assureur peut afficher un ratio de capital confortable tout en ayant déplacé le risque vers un compartiment moins régulé. La chute de 777 Re en 2024 montre par où le fil se rompt."
pubDate: 2026-07-16T18:00:00+02:00
updatedDate: 2026-07-16T18:00:00+02:00
tags: ["assurance", "crédit privé", "régulation", "risque", "marchés"]
category: marches
draft: false
---

*Un assureur-vie promet de payer dans dix, vingt ou quarante ans. Sa solidité ne se juge donc pas à son bénéfice trimestriel, mais à la certitude que les actifs qu'il détient aujourd'hui vaudront encore, le jour venu, ce que valent ses engagements. Cette certitude s'est brouillée. Depuis qu'une part croissante des rentes américaines est adossée à du crédit privé, logée dans des réassureurs affiliés aux Bermudes et notée par des agences privées, lire un assureur suppose de regarder au-delà du ratio de capital affiché. Ce guide déroule les cadrans à surveiller, du RBC au passif, avec 777 Re comme fil rouge, et prolonge notre article sur [l'épargne retraite dans le crédit privé](/posts/assureurs-vie-epargne-retraite-credit-prive-bermudes/).*

## Le capital réglementaire : le ratio RBC et ses seuils

La première mesure est le capital, et son étalon aux États-Unis est le [RBC](/glossaire/rbc/), pour Risk-Based Capital. C'est l'équivalent assurantiel du [CET1](/glossaire/cet1/) bancaire : un capital minimal calculé non sur la taille brute du bilan, mais sur le risque des actifs et des engagements. Un portefeuille chargé d'actions ou de crédit spéculatif exige plus de capital qu'un portefeuille d'obligations d'État.

Le ratio RBC rapporte le capital ajusté total de l'assureur au seuil de contrôle autorisé, l'Authorized Control Level. Ce qui compte est moins le chiffre absolu que le seuil qu'il franchit. Selon la [NAIC](/glossaire/naic/), l'association des régulateurs d'assurance des États, les actions réglementaires s'enclenchent par paliers : au-dessus de 250 %, aucune intervention ; entre 200 et 250 % avec échec au test de tendance, ou entre 150 et 200 %, l'assureur doit soumettre un plan de redressement ; entre 100 et 150 %, un plan correctif s'impose ; entre 70 et 100 %, le régulateur est autorisé à placer l'assureur sous contrôle, jusqu'à la mise en liquidation.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 340" role="img" aria-label="Les seuils d'action réglementaire de la NAIC selon le ratio RBC d'un assureur" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="340" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">L'échelle d'alerte du capital d'un assureur</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Actions de la NAIC selon le ratio RBC (capital ajusté / seuil de contrôle autorisé).</text>
  <rect x="40" y="84" width="640" height="30" fill="#5eead4" opacity="0.22"></rect>
  <text x="52" y="104" fill="#5eead4" font-size="12.5" font-weight="700">&gt; 250 %</text>
  <text x="200" y="104" fill="#d6d9df" font-size="12">aucune action, zone de confort</text>
  <rect x="40" y="120" width="640" height="30" fill="#f5b13d" opacity="0.22"></rect>
  <text x="52" y="140" fill="#f5b13d" font-size="12.5" font-weight="700">200 - 250 %</text>
  <text x="200" y="140" fill="#d6d9df" font-size="12">surveillance (si échec au test de tendance)</text>
  <rect x="40" y="156" width="640" height="30" fill="#f5b13d" opacity="0.35"></rect>
  <text x="52" y="176" fill="#f5b13d" font-size="12.5" font-weight="700">150 - 200 %</text>
  <text x="200" y="176" fill="#d6d9df" font-size="12">plan de redressement exigé</text>
  <rect x="40" y="192" width="640" height="30" fill="#ff4d87" opacity="0.35"></rect>
  <text x="52" y="212" fill="#ff4d87" font-size="12.5" font-weight="700">100 - 150 %</text>
  <text x="200" y="212" fill="#d6d9df" font-size="12">plan correctif imposé</text>
  <rect x="40" y="228" width="640" height="30" fill="#ff4d87" opacity="0.6"></rect>
  <text x="52" y="248" fill="#ff4d87" font-size="12.5" font-weight="700">70 - 100 %</text>
  <text x="200" y="248" fill="#f5f6f8" font-size="12">mise sous contrôle possible</text>
  <rect x="40" y="264" width="640" height="30" fill="#ff4d87" opacity="0.85"></rect>
  <text x="52" y="284" fill="#0c0d10" font-size="12.5" font-weight="700">&lt; 70 %</text>
  <text x="200" y="284" fill="#0c0d10" font-size="12">contrôle obligatoire, liquidation</text>
  <text x="32" y="318" fill="#8b909b" font-size="11">Un ratio de 600 % n'est pas nécessairement plus solide qu'un ratio de 400 %. Source : NAIC.</text>
</svg>
<figcaption>Le ratio RBC est un outil d'alerte, pas un classement. Au-dessus des seuils, comparer deux ratios élevés n'a pas de sens ; c'est en dessous que le chiffre parle. Source : NAIC.</figcaption>
</figure>

Une précaution s'impose, que la NAIC souligne elle-même : le RBC est un outil de détection, pas un palmarès. Un assureur à 600 % n'est pas mécaniquement plus solide qu'un assureur à 400 %. Au-dessus des seuils, le ratio cesse d'être discriminant ; il ne devient informatif qu'à l'approche des paliers. Lire le RBC, c'est donc surveiller la distance au seuil, pas admirer un grand nombre.

## Le bilan statutaire : où le risque se cache

Le RBC ne vaut que par la qualité des actifs qu'il pondère, et c'est là que la lecture devient technique. L'assureur américain publie des comptes statutaires, distincts des normes GAAP, dont deux annexes concentrent l'essentiel de l'information. Le Schedule D recense les obligations et actions, le cœur classique du portefeuille. Le Schedule BA, intitulé « autres actifs investis de long terme », loge le reste : fonds de crédit privé, participations, coentreprises, et surtout les actifs affiliés et alternatifs. C'est le Schedule BA qu'il faut ouvrir en premier quand on cherche le risque déplacé.

Deux signaux s'y lisent. La part d'actifs illiquides, d'abord, plus difficiles à céder en cas de tension. Le [FMI](/glossaire/nbfi/), dans son rapport de stabilité financière d'avril 2026, relève que les assureurs adossés à des fonds de capital-investissement détiennent près de deux fois plus d'actifs illiquides que les autres. La part d'actifs affiliés, ensuite : quand un assureur investit dans les propres fonds du groupe qui le contrôle, la valorisation et la solidité de ces actifs deviennent circulaires. C'est cette concentration en actifs affiliés qui a précipité la chute de 777 Re.

## Les désignations NAIC et les notations privées

Chaque titre du portefeuille reçoit une désignation NAIC, de 1 à 6, qui fixe son traitement en capital : 1 et 2 correspondent grosso modo à la catégorie [investissement](/glossaire/investment-grade/), 3 à 6 au risque croissant jusqu'au défaut. Plus la désignation est bonne, moins l'assureur immobilise de capital. L'enjeu est donc de faire entrer des actifs risqués dans les meilleures cases.

C'est la fonction des [rated feeder notes](/glossaire/rated-feeder-note/) : un véhicule nourricier investit dans un fonds de crédit privé et émet des titres de dette assortis d'une notation, le plus souvent privée, communiquée au seul souscripteur. L'exposition économique est celle d'une part de fonds ; le traitement en capital est celui d'une obligation notée. Le problème est la qualité de ces notes. Les travaux relayés par la presse spécialisée montrent que, lorsqu'un titre passe de l'évaluation interne du bureau des valeurs de la NAIC à une notation privée, il est relevé plus de quatre fois plus souvent qu'il n'est abaissé, quand le même passage vers une notation publique produit autant de hausses que de baisses. La sélection du canal de notation ressemble alors à une optimisation du capital, davantage qu'à une mesure du risque. Pour juger ce que vaut une note, notre guide dédié à [la lecture d'une notation de crédit](/guides/lire-une-notation-de-credit/) détaille la différence entre note publique et privée.

## La réassurance : lire le levier et la destination

Le troisième cadran est le plus spécifique à l'assurance. Un assureur peut céder une partie de ses engagements à un réassureur, qui les reprend en échange d'une commission et réinvestit les actifs correspondants. Cette [réassurance adossée à l'actif](/glossaire/reassurance-adossee-a-l-actif/) est légitime en soi, mais deux paramètres en changent la portée : le levier de réassurance, c'est-à-dire la part des engagements cédés rapportée au capital, et la destination de la cession.

La destination est devenue le sujet. Selon l'enquête de Bloomberg sur le secteur, les assureurs-vie américains ont cédé 2 400 milliards de dollars de réserves en 2024, dont plus de 1 100 milliards vers des juridictions offshore, les Bermudes en tête, où le régime prudentiel et comptable est plus souple. Quand le réassureur bermudien appartient au même groupe que l'assureur cédant, la cession ne transfère pas vraiment le risque : elle le déplace vers un bilan moins régulé, sous le contrôle du même actionnaire. Lire un assureur suppose donc de vérifier non seulement combien il cède, mais à qui.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 300" role="img" aria-label="Réserves d'assurance-vie américaines cédées en réassurance en 2024 et part offshore" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="300" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">La réassurance, et où elle part</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Réserves d'assurance-vie américaines cédées en 2024, en milliards de dollars.</text>
  <text x="40" y="104" fill="#d6d9df" font-size="12">Total cédé en réassurance</text>
  <rect x="40" y="114" width="600" height="28" fill="#2a2c33"></rect>
  <rect x="40" y="114" width="600" height="28" fill="#5eead4" opacity="0.45"></rect>
  <text x="632" y="133" fill="#d6d9df" font-size="12" font-weight="700" text-anchor="end">~2 400</text>
  <text x="40" y="178" fill="#d6d9df" font-size="12">dont vers l'offshore (Bermudes en tête)</text>
  <rect x="40" y="188" width="600" height="28" fill="#2a2c33"></rect>
  <rect x="40" y="188" width="275" height="28" fill="#ff4d87" opacity="0.9"></rect>
  <text x="325" y="207" fill="#ff4d87" font-size="12" font-weight="700">&gt; 1 100</text>
  <text x="40" y="252" fill="#f5b13d" font-size="12">Le risque n'est pas transféré s'il part chez un réassureur du même groupe.</text>
  <text x="32" y="284" fill="#8b909b" font-size="11">Source : Bloomberg (enquête 2025 sur l'assurance-vie américaine).</text>
</svg>
<figcaption>Près de la moitié des réserves cédées part offshore. Quand le réassureur est affilié, la cession déplace le risque sans le sortir du périmètre du groupe. Source : Bloomberg.</figcaption>
</figure>

## Le passif : le test du passif long

Les quatre premiers cadrans portent sur l'actif ; le cinquième porte sur le passif, et c'est l'argument de défense du modèle. Une rente n'est pas un dépôt bancaire : le passif est long, prévisible, et les rachats anticipés sont freinés par des pénalités contractuelles et fiscales. Un détenteur d'engagements à vingt ans est donc, en principe, l'acteur le mieux placé pour porter des actifs illiquides, bien mieux qu'un fonds semi-liquide ouvert aux rachats trimestriels, dont nous avons documenté [le gating à répétition](/posts/credit-prive-juin-2026-defaut-record-gating/).

La solidité de cet argument dépend d'une condition : que le passif reste effectivement long. Or il ne l'est que tant que les rachats restent découragés. Une remontée brutale des taux, qui rend les rentes anciennes peu compétitives face aux nouvelles, peut accélérer les sorties au moment précis où les actifs illiquides sont les plus difficiles à céder. Le FMI décrivait ce scénario de ruée dès ses travaux de 2023 sur le capital-investissement et les assureurs-vie. Lire le passif, c'est donc estimer la sensibilité des rachats à un choc de taux, et comparer cette liquidité potentielle du passif à la liquidité réelle de l'actif.

## 777 Re, le cas d'école

Tous ces cadrans se lisent ensemble dans un cas concret. 777 Re, réassureur bermudien du groupe 777 Partners, avait accumulé dans son bilan des actifs affiliés, investis dans les propres entreprises de son actionnaire. Le 8 octobre 2024, la Bermuda Monetary Authority a annulé son agrément, constatant un excès d'actifs affiliés, une gouvernance défaillante et des apports en capital insuffisants. En amont, l'assureur américain A-CAP, qui lui avait cédé 1,7 milliard de dollars de réserves, a vu sa note abaissée par AM Best en février 2024, l'agence citant un levier de réassurance élevé et la dégradation de la qualité de ses contreparties.

Le schéma condense les signaux du guide : réassurance cédée offshore, à un affilié, chargée d'actifs illiquides liés à l'actionnaire, découverte par le régulateur par le bout de la chaîne. La différence entre 777 Re et les grands acteurs du secteur tient à l'échelle et à la qualité des actifs, pas à la structure. C'est pourquoi lire ces cadrans un à un, sur un assureur solide comme sur un assureur fragile, est le seul moyen de distinguer un modèle robuste d'un modèle qui a simplement eu de la chance.

## La grille de lecture

Cinq questions résument le guide. Le ratio RBC est-il à distance confortable de ses seuils, et comment évolue-t-il ? Le Schedule BA révèle-t-il une part élevée d'actifs illiquides ou affiliés ? Les notations qui portent le capital sont-elles publiques ou privées, et le canal privé domine-t-il ? Le levier de réassurance est-il élevé, et la cession part-elle vers un affilié offshore ? Le passif résisterait-il à un choc de taux, ou les rachats s'accéléreraient-ils ?

Aucun de ces cadrans ne suffit seul, et aucun n'est visible dans la note de solidité financière que l'assureur met en avant. La solidité d'un assureur-vie ne se lit pas dans un chiffre unique, mais dans la cohérence entre son capital, ses actifs, ses notations, sa réassurance et son passif. Le jour où l'un de ces cinq cède, les quatre autres révèlent d'un coup ce qu'ils cachaient, et l'histoire de 777 Re recommence, à une autre échelle.

## Sources

- NAIC, « Risk-Based Capital » (définition du RBC, paliers d'action réglementaire, mise en garde sur la comparaison des ratios élevés) : https://content.naic.org/insurance-topics/risk-based-capital
- NAIC, Schedule BA et projet de définition des obligations (reclassement des actifs ne qualifiant pas comme obligations, part des actifs affiliés dans les « autres actifs investis de long terme ») : https://content.naic.org/insurance-topics/private-credit
- FMI, Global Financial Stability Report, avril 2026 (crédit privé ~35 % des portefeuilles des assureurs nord-américains ; assureurs adossés au capital-investissement ~2x plus d'actifs illiquides) : https://www.imf.org/en/publications/gfsr/issues/2026/04/14/global-financial-stability-report-april-2026
- Bloomberg, « Apollo and Wall Street Private Equity Firms Bet on America's Life Insurance » (2 400 Md$ de réserves cédées en 2024, dont plus de 1 100 Md$ offshore) : https://www.bloomberg.com/graphics/2025-america-insurance-part-1/
- American Academy of Actuaries, « Asset-Intensive Reinsurance Ceded Offshore » (levier de réassurance, actifs affiliés, risques de la cession offshore) : https://actuary.org/wp-content/uploads/2024/02/risk-brief-bermuda-reinsurance_0.pdf
- Alternative Credit Investor, « Insurers and private credit: Ratings under the microscope » (asymétrie des révisions : plus de quatre hausses pour une baisse lors du passage en notation privée), décembre 2025 : https://alternativecreditinvestor.com/2025/12/04/ratings-under-the-microscope/
- Bermuda Monetary Authority, avis d'annulation de l'agrément de 777 Re Ltd, 8 octobre 2024 : https://www.bma.bm/viewPDF/documents/2024-10-08-12-44-33-Notice---Cancellation-of-Registration---777-Re-Ltd.pdf
- Retirement Income Journal, « Double Trouble in the Bermuda Triangle » (A-CAP : 1,7 Md$ de réserves cédées à 777 Re, note abaissée par AM Best) : https://retirementincomejournal.com/article/double-trouble-in-the-bermuda-triangle/

*Ce guide est une analyse pédagogique et ne constitue pas un conseil en investissement. Les données réglementaires sont citées à la date de leurs sources.*
