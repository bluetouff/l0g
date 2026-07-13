---
title: "Private credit: one asset, two prices"
description: "Listed BDCs trade below their NAV while non-traded funds redeem at par: two prices for a near-identical credit risk. Valuation mechanics, mark dispersion and paths to convergence, on primary sources."
pubDate: 2026-07-13T15:00:00+02:00
updatedDate: 2026-07-13T15:00:00+02:00
tags: ["private credit", "valuation", "BDC", "NAV", "price discovery", "systemic risk"]
draft: false
sourceArticle: "credit-prive-un-actif-deux-prix"
sourceUpdatedDate: 2026-07-03
---
*A non-traded private-credit fund redeems its units at par while the listed funds that lend to the same companies trade nearly a fifth below their declared value. Two prices coexist for a near-identical credit risk. In 2026, the question is no longer whether they diverge, but which will eventually win.*

## The price you declare, the price you quote

Private credit is distributed through two families of vehicle. Non-traded funds, interval funds and non-traded BDCs, redeem their units at net asset value, the NAV. This NAV is not quoted: it is estimated at level 3 fair value, from unobservable inputs, then struck periodically. The Fidelity Private Credit Fund, in its redemption notice filed with the SEC for the second quarter of 2026, describes the mechanism plainly: its NAV is "validated each month by a third-party valuation process", and its direct-lending portfolio showed an average valuation of 98.7% of par in the first quarter.

The two families nonetheless lend to the same universe: senior secured loans to mid-sized companies, most often at floating rates. The price gap therefore does not stem first from the nature of the assets, but from the way they are valued. Listed BDCs carry this dual display permanently. On one side you read the NAV published by the manager, on the other the price at which the market trades the share. At the end of February 2026, the listed-BDC index tracked by VanEck traded at about 0.83 times book value, nearly 17% below declared NAV, and about 14% below its historical average of 0.97 times. In its note of 29 June, PIMCO notes that this ratio has hit a local low, but that discounts remain wide and their dispersion is widening. For the listed BDC, the market renders a second opinion every day; for the non-traded one, only the model speaks, and it is at its price that redemption settles.

<figure style="margin: 1.5rem 0 2.25rem;">
<svg viewBox="0 0 720 250" width="100%" role="img" aria-label="Comparison between declared net asset value and market price of BDCs" xmlns="http://www.w3.org/2000/svg" font-family="'JetBrains Mono Variable', ui-monospace, monospace">
<text x="40" y="28" fill="#5eead4" font-size="17">Two prices for a similar credit risk (2026)</text>
<g font-size="14">
<text x="40" y="72" fill="#e7e9ee">Non-traded BDC: redemption at declared NAV</text>
<rect x="40" y="82" width="560" height="18" fill="#5eead4"/>
<text x="610" y="96" fill="#e7e9ee">100</text>
<text x="40" y="130" fill="#e7e9ee">Listed BDC: market price of the share</text>
<rect x="40" y="140" width="465" height="18" fill="#ff4d87"/>
<text x="515" y="154" fill="#e7e9ee">≈ 83</text>
</g>
<text x="40" y="196" fill="#8b909b" font-size="12">Base 100 = declared value (NAV). The listed one shows two prices; the non-traded, only one, the redemption price.</text>
<text x="40" y="216" fill="#8b909b" font-size="12">Sources: VanEck (listed BDC index P/B ≈ 0.83x, 27 February 2026); Fidelity Private Credit Fund, SEC filing (average mark 98.7%).</text>
</svg>
</figure>

## Dispersion betrays the absence of an anchor

These marks are not homogeneous. Analysing the documents filed with the SEC for a sample of 32 BDCs, With Intelligence notes that 27 of them saw their NAV per share fall in 2025. On average, the decline reaches 3.8% for the listed ones (median 2.5%) and 1.7% for the non-traded ones (median 2%). But the range is gaping: on the listed side, from Prospect Capital at minus 20.8% to Main Street Capital at plus 5%; on the non-traded side, from Monroe's fund at minus 4.8% to Golub's non-traded fund, GCRED, the only one to rise, by 0.04%.

This is the point PIMCO stresses: valuation dispersion is high from one manager to another and, counter-intuitively, stronger still among the non-traded ones, despite smoother declared performance. Low volatility over time combined with high cross-sectional dispersion sits poorly with a common reference price. It suggests that NAVs reflect each manager's own assumptions rather than a market clearing price.

The secondary market puts a number on this doubt. The valuation firm Mercer Capital reports that Saba Capital, run by Boaz Weinstein, offered to buy units of several private-credit funds at 20 to 35% below declared NAV; and the aborted merger, at Blue Owl, between a non-traded fund and its listed counterpart exposed the same gap between private marks and public price for comparable assets. The mechanism closes on itself: a holder who can exit at NAV while judging the real value far lower has an interest in requesting redemption before the write-down. The International Monetary Fund named this effect as early as 2024: a "first-mover advantage", when stale valuations let some leave before losses are recognised, at the expense of those who stay.

<figure style="margin: 1.5rem 0 2.25rem;">
<svg viewBox="0 0 720 360" width="100%" role="img" aria-label="Dispersion of BDC net-asset-value-per-share changes in 2025" xmlns="http://www.w3.org/2000/svg" font-family="'JetBrains Mono Variable', ui-monospace, monospace">
<text x="40" y="28" fill="#5eead4" font-size="17">Change in NAV per share in 2025: a gaping range</text>
<line x1="430" y1="66" x2="430" y2="320" stroke="#8b909b" stroke-width="1"/>
<text x="430" y="340" fill="#8b909b" font-size="11" text-anchor="middle">0%</text>
<g font-size="13">
<text x="40" y="60" fill="#8b909b">Listed</text>
<text x="40" y="84" fill="#e7e9ee">Prospect Capital (PSEC): −20.8%</text>
<rect x="222" y="90" width="208" height="13" fill="#ff4d87"/>
<text x="40" y="122" fill="#e7e9ee">Listed average: −3.8%</text>
<rect x="392" y="128" width="38" height="13" fill="#ff4d87"/>
<text x="40" y="160" fill="#e7e9ee">Main Street Capital (MAIN): +5.0%</text>
<rect x="430" y="166" width="50" height="13" fill="#5eead4"/>
<text x="40" y="200" fill="#8b909b">Non-traded</text>
<text x="40" y="224" fill="#e7e9ee">Monroe fund: −4.8%</text>
<rect x="382" y="230" width="48" height="13" fill="#ff4d87"/>
<text x="40" y="262" fill="#e7e9ee">Non-traded average: −1.7%</text>
<rect x="413" y="268" width="17" height="13" fill="#ff4d87"/>
<text x="40" y="300" fill="#e7e9ee">Golub GCRED (non-traded): +0.04%</text>
<rect x="430" y="306" width="2" height="13" fill="#5eead4"/>
</g>
<text x="40" y="356" fill="#8b909b" font-size="12">Source: With Intelligence, analysis of SEC filings, NAV at 31 December 2025.</text>
</svg>
</figure>

## Three paths to a single price

According to PIMCO, the gap can close in three ways: through NAV write-downs, through wider discounts on the secondary market, or through realised losses. The first path is already visible. In the first quarter of 2026, the listed BDC FS KKR Capital saw its NAV per share go from $20.89 to $18.83, a 9.9% fall in one quarter, with non-accrual loans at 4.2% of the portfolio at fair value. To stabilise the vehicle, KKR injected $150 million in preferred shares and launched a buyback offer, but at $11 a share, nearly 40% below declared NAV. Public price and model price converge, from below.

The bond market ruled earlier: many BDC bonds trade at yield spreads close to the BB segment of the Bloomberg US Corporate index, PIMCO notes. Shareholders doubt the credibility of NAVs; creditors, for their part, separate valuation uncertainty from default risk. What lets the model price hold owes to its plumbing. The Financial Stability Board, in its report of 6 May, flags the opacity of valuations and the reliance on private ratings, sometimes issued by little-known providers. Level 3 fair value leaves a margin of judgement to the manager and the board: smoothed marks support the NAV in the short term, at the cost of transparency.

## What still holds back the panic

The picture calls for a counterweight. Neuberger Berman recalls that the BDC universe, listed and non-traded combined, weighs only about $500 billion, and that about $600 billion of committed but undeployed institutional capital, half of it in direct lending, can absorb part of the outflows. Above all, redemptions do not first reflect poor performance: several large vehicles delivered high single-digit total returns in 2025. The July 2026 filings confirm it: at Goldman Sachs Private Credit, second-quarter redemption requests reached 3.24% of units, below the 5% cap, and were served in full; at Fidelity Private Credit, about 2.9%, also served in full, with positive net inflows.

PIMCO insists on a final point: private credit is not one block. The strain concentrates on corporate direct lending, while asset-backed financing, with flows less tied to the earnings cycle, behaves differently; and the discount applied to the listed ones is no longer a uniform macro rebate, the market now differentiating managers by asset quality and the credibility of their marks. The useful question is therefore not the displayed level of NAV, but how the gap between the two prices will close: through an orderly write-down, or through materialised losses. For the mechanics of contagion, see [the silent contagion of private credit](/en/analysis/the-silent-contagion-of-private-credit/); for the wider read on private credit, our [guide on reading private credit](/en/guides/read-private-credit-risk/).

## Sources

- PIMCO, *The Credit Market Lens: What BDC Redemptions and NAV Pressures Mean for Investors*, 29 June 2026 (confidence gap, mark dispersion, paths to convergence, BDC bonds near BB), <https://www.pimco.com/eu/en/insights/the-credit-market-lens-what-bdc-redemptions-and-nav-pressures-mean-for-investors>
- VanEck, *What is Driving BDC Valuations?* (listed BDC index P/B ≈ 0.83x on 27 February 2026, against ≈ 0.97x historical average), <https://www.vaneck.com/us/en/blogs/income-investing/what-is-driving-bdc-valuations/>
- With Intelligence, *What is actually going on in BDC portfolios?*, 30 April 2026 (NAV analysis on SEC filings at 31 December 2025; PSEC / MAIN / Monroe / GCRED dispersion), <https://www.withintelligence.com/insights/what-is-actually-going-on-in-bdc-portfolios/>
- International Monetary Fund, *Global Financial Stability Report*, April 2024 (chapter on private credit; first-mover advantage tied to stale valuations), <https://www.imf.org/en/Publications/GFSR/Issues/2024/04/16/global-financial-stability-report-april-2024>
- Mercer Capital, *Public Prices, Private Marks: What BDC Discounts Are Signaling*, 9 April 2026 (Saba Capital offers at 20 to 35% below NAV; aborted Blue Owl merger), <https://mercercapital.com/insights/posts/2026/public-prices-private-marks-what-bdc-discounts-are-signaling/>
- FS KKR Capital Corp., first-quarter 2026 earnings release, 11 May 2026 (NAV of $18.83 against $20.89; non-accruals 4.2%; tender at $11), <https://www.prnewswire.com/news-releases/fs-kkr-capital-corp-announces-first-quarter-2026-results-and-strategic-value-enhancement-actions-declares-second-quarter-2026-distribution-of-0-42-per-share-302768117.html>; Form 8-K, SEC EDGAR, <https://www.sec.gov/Archives/edgar/data/0001422183/000110465926058250/tm2614112d1_ex99-1.htm>
- Financial Stability Board, *Report on Vulnerabilities in Private Credit*, 6 May 2026 (valuation opacity, private ratings, PIK), <https://www.fsb.org/uploads/P060526.pdf>
- Neuberger Berman, *Private Credit and BDCs: Why the Sell-Off Tells an Incomplete Story*, 6 May 2026 (BDC universe ≈ $500bn; ≈ $600bn of dry powder; redemptions unrelated to performance), <https://www.nb.com/en/insights/private-credit-and-bdcs-why-the-sell-off-tells-an-incomplete-story>
- Goldman Sachs Private Credit Corp., Form SC TO-I/A, SEC EDGAR, July 2026 (Q2 redemptions at 3.24% of units, below the cap, served in full), <https://www.sec.gov/Archives/edgar/data/0001920145/000119312526291563/d36010dex99a1vi.htm>
- Fidelity Private Credit Fund, Form SC TO-I/A, SEC EDGAR (Q2 redemptions ≈ 2.9% served in full, positive net inflows, average mark 98.7%, NAV validated monthly by third-party valuation), <https://www.sec.gov/Archives/edgar/data/0001920453/000119312526259464/d15185dex99a1vi.htm>
