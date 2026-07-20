---
title: "Crédit privé : un actif, deux prix"
description: "Les BDC cotées s'échangent sous leur NAV pendant que les fonds non cotés rachètent au pair : deux prix pour un risque de crédit voisin. Mécanique de valorisation, dispersion des marks et voies de convergence, sur sources primaires."
pubDate: 2026-07-03T18:45:00+02:00
tags: ["crédit privé", "valorisation", "BDC", "NAV", "découverte de prix", "risque systémique"]
draft: false
---

*Un fonds de crédit privé non coté rachète ses parts au pair pendant que les fonds cotés qui prêtent aux mêmes entreprises s'échangent près d'un cinquième sous leur valeur déclarée. Deux prix coexistent pour un risque de crédit voisin. En 2026, la question n'est plus de savoir s'ils divergent, mais lequel finira par l'emporter.*

## Le prix qu'on déclare, le prix qu'on cote

Le [crédit privé](/glossaire/#credit-prive) se distribue par deux familles de véhicules. Les fonds non cotés, [interval funds](/glossaire/#interval-fund) et [BDC](/glossaire/#bdc) non négociées, rachètent leurs parts à la valeur nette d'inventaire, la [NAV](/glossaire/#nav). Cette NAV n'est pas cotée : elle est estimée en juste valeur de [niveau 3](/glossaire/#niveau-3), à partir d'intrants non observables, puis arrêtée périodiquement. Le Fidelity Private Credit Fund, dans son avis de rachat déposé à la SEC pour le deuxième trimestre 2026, décrit le mécanisme sans détour : sa NAV est « validée chaque mois par un processus de valorisation tiers », et son portefeuille de prêts directs affichait une valorisation moyenne de 98,7 % du pair au premier trimestre.

Les deux familles prêtent pourtant au même univers : des prêts senior garantis à des entreprises de taille moyenne, le plus souvent à taux variable. L'écart de prix ne tient donc pas d'abord à la nature des actifs, mais à la manière de les valoriser. Les BDC cotées portent ce double affichage en permanence. On y lit d'un côté la NAV publiée par le gérant, de l'autre le prix auquel le marché échange l'action. Fin février 2026, l'indice des BDC cotées suivi par VanEck se traitait à environ 0,83 fois la valeur comptable, soit près de 17 % sous la NAV déclarée, et environ 14 % sous sa moyenne historique de 0,97 fois. Dans sa note du 29 juin, PIMCO relève que ce ratio a touché un point bas local, mais que les [décotes](/glossaire/#decote-sur-nav) restent larges et que leur dispersion s'accentue. Pour la BDC cotée, le marché rend un second avis chaque jour ; pour la non cotée, seul le [modèle](/glossaire/#mark-to-model) parle, et c'est à son prix que se dénoue le rachat.

<figure style="margin: 1.5rem 0 2.25rem;">
<svg viewBox="0 0 720 250" width="100%" role="img" aria-label="Comparaison entre la valeur nette declaree et le prix de marche des BDC" xmlns="http://www.w3.org/2000/svg" font-family="'JetBrains Mono Variable', ui-monospace, monospace">
<text x="40" y="28" fill="#5eead4" font-size="17">Deux prix pour un risque de crédit voisin (2026)</text>
<g font-size="14">
<text x="40" y="72" fill="#e7e9ee">BDC non coté : rachat à la NAV déclarée</text>
<rect x="40" y="82" width="560" height="18" fill="#5eead4"/>
<text x="610" y="96" fill="#e7e9ee">100</text>
<text x="40" y="130" fill="#e7e9ee">BDC coté : prix de marché sur l'action</text>
<rect x="40" y="140" width="465" height="18" fill="#ff4d87"/>
<text x="515" y="154" fill="#e7e9ee">≈ 83</text>
</g>
<text x="40" y="196" fill="#8b909b" font-size="12">Base 100 = valeur déclarée (NAV). Le coté affiche deux prix ; le non coté, un seul, celui du rachat.</text>
<text x="40" y="216" fill="#8b909b" font-size="12">Sources : VanEck (P/B de l'indice BDC coté ≈ 0,83x, 27 février 2026) ; Fidelity Private Credit Fund, filing SEC (mark moyen 98,7 %).</text>
</svg>
</figure>

## La dispersion trahit l'absence d'ancre

Ces marks ne sont pas homogènes. En analysant les documents déposés à la SEC pour un échantillon de 32 BDC, With Intelligence relève que 27 d'entre elles ont vu leur NAV par part reculer en 2025. En moyenne, la baisse atteint 3,8 % pour les cotées (médiane 2,5 %) et 1,7 % pour les non cotées (médiane 2 %). Mais la fourchette est béante : côté coté, de Prospect Capital à moins 20,8 % jusqu'à Main Street Capital à plus 5 % ; côté non coté, du fonds de Monroe à moins 4,8 % au fonds non coté de Golub, GCRED, seul à progresser, de 0,04 %.

C'est le point que souligne PIMCO : la dispersion des valorisations est élevée d'un gérant à l'autre et, contre-intuitivement, plus forte encore chez les non cotées, malgré des performances déclarées plus lisses. Une faible volatilité dans le temps combinée à une forte dispersion en coupe se concilie mal avec un prix de référence commun. Elle suggère que les NAV reflètent des hypothèses propres à chaque gérant plutôt qu'un prix de compensation de marché.

Le marché secondaire met un chiffre sur ce doute. Le cabinet de valorisation Mercer Capital rapporte que Saba Capital, dirigé par Boaz Weinstein, a proposé de racheter des parts de plusieurs fonds de crédit privé à 20 à 35 % sous la NAV déclarée ; et la fusion avortée, chez Blue Owl, entre un fonds non coté et son homologue coté a exposé le même écart entre marks privés et prix public pour des actifs comparables. La mécanique se referme sur elle-même : un porteur qui peut sortir à la NAV alors qu'il juge la valeur réelle bien plus basse a intérêt à demander le rachat avant la dévalorisation.  Le Fonds monétaire international a nommé cet effet dès 2024 : un « avantage au premier sortant », lorsque des valorisations périmées permettent de partir avant la reconnaissance des pertes, au détriment de ceux qui restent.

<figure style="margin: 1.5rem 0 2.25rem;">
<svg viewBox="0 0 720 360" width="100%" role="img" aria-label="Dispersion des variations de valeur nette par part des BDC en 2025" xmlns="http://www.w3.org/2000/svg" font-family="'JetBrains Mono Variable', ui-monospace, monospace">
<text x="40" y="28" fill="#5eead4" font-size="17">Variation de la NAV par part en 2025 : une fourchette béante</text>
<line x1="430" y1="66" x2="430" y2="320" stroke="#8b909b" stroke-width="1"/>
<text x="430" y="340" fill="#8b909b" font-size="11" text-anchor="middle">0 %</text>
<g font-size="13">
<text x="40" y="60" fill="#8b909b">Cotées</text>
<text x="40" y="84" fill="#e7e9ee">Prospect Capital (PSEC) : −20,8 %</text>
<rect x="222" y="90" width="208" height="13" fill="#ff4d87"/>
<text x="40" y="122" fill="#e7e9ee">Moyenne des cotées : −3,8 %</text>
<rect x="392" y="128" width="38" height="13" fill="#ff4d87"/>
<text x="40" y="160" fill="#e7e9ee">Main Street Capital (MAIN) : +5,0 %</text>
<rect x="430" y="166" width="50" height="13" fill="#5eead4"/>
<text x="40" y="200" fill="#8b909b">Non cotées</text>
<text x="40" y="224" fill="#e7e9ee">Fonds de Monroe : −4,8 %</text>
<rect x="382" y="230" width="48" height="13" fill="#ff4d87"/>
<text x="40" y="262" fill="#e7e9ee">Moyenne des non cotées : −1,7 %</text>
<rect x="413" y="268" width="17" height="13" fill="#ff4d87"/>
<text x="40" y="300" fill="#e7e9ee">Golub GCRED (non coté) : +0,04 %</text>
<rect x="430" y="306" width="2" height="13" fill="#5eead4"/>
</g>
<text x="40" y="356" fill="#8b909b" font-size="12">Source : With Intelligence, analyse des filings SEC, NAV au 31 décembre 2025.</text>
</svg>
</figure>

## Trois chemins vers un prix unique

Selon PIMCO, l'écart peut se résorber de trois façons : par dévalorisation des NAV, par élargissement des décotes sur le marché secondaire, ou par pertes réalisées. Le premier chemin s'observe déjà. Au premier trimestre 2026, la BDC cotée FS KKR Capital a vu sa NAV par part passer de 20,89 à 18,83 dollars, un recul de 9,9 % en un trimestre, avec des créances en non-accrual à 4,2 % du portefeuille en juste valeur. Pour stabiliser le véhicule, KKR a injecté 150 millions de dollars en actions de préférence et lancé une offre de rachat, mais à 11 dollars l'action, près de 40 % sous la NAV déclarée. Le prix public et le prix modèle se rejoignent, par le bas.

Le marché obligataire a tranché plus tôt : beaucoup d'obligations de BDC s'échangent à des écarts de rendement proches du segment BB de l'indice Bloomberg US Corporate, relève PIMCO. Les actionnaires doutent de la crédibilité des NAV ; les créanciers, eux, séparent l'incertitude de valorisation du risque de défaut. Ce qui permet au prix modèle de tenir tient à sa plomberie. Le Financial Stability Board, dans son rapport du 6 mai, pointe l'opacité des valorisations et le recours à des notations privées, parfois émises par des fournisseurs peu connus. La juste valeur de niveau 3 laisse une marge d'appréciation au gérant et au conseil : des marks lissés soutiennent la NAV à court terme, au prix de la transparence.

## Les digues qui tiennent encore

Le tableau appelle une contrepartie. Neuberger Berman rappelle que l'univers des BDC, cotées et non cotées confondues, ne pèse qu'environ 500 milliards de dollars, et qu'environ 600 milliards de capital institutionnel engagé mais non déployé, dont la moitié en direct lending, peuvent absorber une partie des sorties. Surtout, les rachats ne traduisent pas d'abord une mauvaise performance : plusieurs grands véhicules ont livré des rendements totaux à un chiffre élevé en 2025. Les filings de juillet 2026 le confirment : chez Goldman Sachs Private Credit, les demandes de rachat du deuxième trimestre ont atteint 3,24 % des parts, sous le plafond de 5 %, et ont été servies en totalité ; chez Fidelity Private Credit, environ 2,9 %, servies elles aussi intégralement, avec une collecte nette positive.

PIMCO insiste sur un dernier point : le crédit privé n'est pas un bloc. La tension se concentre sur le direct lending d'entreprise, quand le financement adossé à des actifs, aux flux moins liés au cycle des résultats, se comporte différemment ; et la décote appliquée aux cotées n'est plus un rabais macro uniforme, le marché différenciant désormais les gérants selon la qualité des actifs et la crédibilité de leurs marks. La question utile n'est donc pas le niveau affiché de la NAV, mais la manière dont l'écart entre les deux prix se refermera : par dévalorisation ordonnée, ou par pertes matérialisées. Pour la mécanique de contagion, voir [la contagion silencieuse du crédit privé](/posts/la-contagion-silencieuse-credit-prive/) ; pour le compteur de défaut et le tour de vis sur la liquidité, [l'état des lieux de la mi-2026](/posts/credit-prive-juin-2026-defaut-record-gating/) ; le fil complet se suit sur le [sujet crédit privé](/sujet/credit-prive/).

## Sources

- PIMCO, *The Credit Market Lens: What BDC Redemptions and NAV Pressures Mean for Investors*, 29 juin 2026 (confidence gap, dispersion des marks, voies de convergence, obligations de BDC proches du BB), <https://www.pimco.com/eu/en/insights/the-credit-market-lens-what-bdc-redemptions-and-nav-pressures-mean-for-investors>
- VanEck, *What is Driving BDC Valuations?* (P/B de l'indice BDC coté ≈ 0,83x au 27 février 2026, contre ≈ 0,97x de moyenne historique), <https://www.vaneck.com/us/en/blogs/income-investing/what-is-driving-bdc-valuations/>
- With Intelligence, *What is actually going on in BDC portfolios?*, 30 avril 2026 (analyse des NAV sur filings SEC au 31 décembre 2025 ; dispersion PSEC / MAIN / Monroe / GCRED), <https://www.withintelligence.com/insights/what-is-actually-going-on-in-bdc-portfolios/>
- Fonds monétaire international, *Global Financial Stability Report*, avril 2024 (chapitre sur le crédit privé ; avantage au premier sortant lié aux valorisations périmées), <https://www.imf.org/en/Publications/GFSR/Issues/2024/04/16/global-financial-stability-report-april-2024>
- Mercer Capital, *Public Prices, Private Marks: What BDC Discounts Are Signaling*, 9 avril 2026 (offres de Saba Capital à 20 à 35 % sous la NAV ; fusion Blue Owl avortée), <https://mercercapital.com/insights/posts/2026/public-prices-private-marks-what-bdc-discounts-are-signaling/>
- FS KKR Capital Corp., communiqué de résultats du premier trimestre 2026, 11 mai 2026 (NAV de 18,83 $ contre 20,89 $ ; non-accruals 4,2 % ; tender à 11 $), <https://www.prnewswire.com/news-releases/fs-kkr-capital-corp-announces-first-quarter-2026-results-and-strategic-value-enhancement-actions-declares-second-quarter-2026-distribution-of-0-42-per-share-302768117.html> ; formulaire 8-K, SEC EDGAR, <https://www.sec.gov/Archives/edgar/data/0001422183/000110465926058250/tm2614112d1_ex99-1.htm>
- Financial Stability Board, *Report on Vulnerabilities in Private Credit*, 6 mai 2026 (opacité des valorisations, notations privées, PIK), <https://www.fsb.org/uploads/P060526.pdf>
- Neuberger Berman, *Private Credit and BDCs: Why the Sell-Off Tells an Incomplete Story*, 6 mai 2026 (univers BDC ≈ 500 Md$ ; ≈ 600 Md$ de dry powder ; rachats non liés à la performance), <https://www.nb.com/en/insights/private-credit-and-bdcs-why-the-sell-off-tells-an-incomplete-story>
- Goldman Sachs Private Credit Corp., formulaire SC TO-I/A, SEC EDGAR, juillet 2026 (rachats du T2 à 3,24 % des parts, sous le plafond, servis en totalité), <https://www.sec.gov/Archives/edgar/data/0001920145/000119312526291563/d36010dex99a1vi.htm>
- Fidelity Private Credit Fund, formulaire SC TO-I/A, SEC EDGAR (rachats du T2 ≈ 2,9 % servis en totalité, collecte nette positive, mark moyen 98,7 %, NAV validée mensuellement par valorisation tierce), <https://www.sec.gov/Archives/edgar/data/0001920453/000119312526259464/d15185dex99a1vi.htm>
