---
title: "The cross-currency basis: the hidden price of the dollar, when the law of international finance breaks"
description: "Covered interest parity is considered the closest thing to a physical law in international finance. Since 2008, it no longer holds: obtaining dollars through an FX swap costs a premium, the cross-currency basis. This small gap in basis points is the most reliable thermometer of dollar funding stress. How it forms, why arbitrage no longer closes it, and what signal it sends."
pubDate: 2026-07-13T15:14:00+02:00
updatedDate: 2026-07-13T15:14:00+02:00
tags: ["macro", "central banks", "liquidity", "markets"]
draft: false
sourceArticle: "cross-currency-basis-prix-cache-dollar"
sourceUpdatedDate: 2026-06-24
---
*There is in international finance a rule so solid it is compared to a physical law: covered interest parity. It says that borrowing dollars directly or manufacturing them through another currency should cost the same, otherwise a riskless arbitrage would erase the gap. Since 2008, this law no longer holds. Manufacturing dollars via an FX swap costs a premium, sometimes a few basis points, sometimes much more under stress. This premium has a name, the cross-currency basis, and it has become the most reliable thermometer of strains in dollar funding. A sequel to our piece on [eurodollars](/en/analysis/eurodollars-the-offshore-dollar/), here is the mechanics of this gap and its reach.*

Covered interest parity, or CIP, rests on a simple idea. An investor holding a dollar can invest it for a year at the dollar rate. Or they can convert it into euros spot, invest those euros at the euro rate, and lock in today the reconversion rate into dollars a year out through a forward contract. In theory, both paths must return exactly the same. If they did not, anyone could borrow via the cheaper path, lend via the other, and pocket a riskless margin. This arbitrage should bring the gap to zero instantly.

## The law that no longer holds

Before 2008, that was the case, and the basis hovered around zero for the major currencies. Since the financial crisis, the gap has settled durably, oscillating between **20** and **100** basis points, and much more during stress episodes. Concretely, a negative basis on the euro or the yen means that manufacturing dollars through an FX swap costs more than borrowing them directly. The party that wants dollars pays a premium, and the party that supplies them gets a discount. The near-physical law of international finance has become a pricing of the dollar by its scarcity.

<figure class="infographic">
<svg viewBox="0 0 720 310" role="img" aria-label="Two paths to obtain dollars, and the gap between them: the cross-currency basis" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="310" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Two paths to a dollar, one gap</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">If the two do not come out the same, the gap is the cross-currency basis.</text>
  <rect x="40" y="92" width="290" height="62" rx="8" fill="none" stroke="#5eead4" stroke-width="1.5"></rect>
  <text x="185" y="118" fill="#f5f6f8" font-size="13" text-anchor="middle">Direct path</text>
  <text x="185" y="138" fill="#8b909b" font-size="11" text-anchor="middle">borrow dollars at the dollar rate</text>
  <rect x="390" y="92" width="290" height="62" rx="8" fill="none" stroke="#f5b13d" stroke-width="1.5"></rect>
  <text x="535" y="112" fill="#f5f6f8" font-size="13" text-anchor="middle">Synthetic path</text>
  <text x="535" y="132" fill="#8b909b" font-size="11" text-anchor="middle">euros invested, reconverted forward</text>
  <text x="535" y="148" fill="#8b909b" font-size="11" text-anchor="middle">via an FX swap</text>
  <text x="360" y="205" fill="#ff4d87" font-size="13" text-anchor="middle" font-weight="700">gap = cross-currency basis</text>
  <text x="360" y="232" fill="#d6d9df" font-size="12" text-anchor="middle">Zero in theory. Negative in practice since 2008.</text>
  <text x="360" y="258" fill="#8b909b" font-size="12" text-anchor="middle">A negative basis = a premium to pay to obtain dollars synthetically.</text>
  <text x="360" y="284" fill="#8b909b" font-size="12" text-anchor="middle">The scarcer the dollar, the wider the gap.</text>
</svg>
<figcaption>Covered interest parity would have both paths cost the same. The residual gap, the cross-currency basis, measures the extra cost of manufacturing dollars through an FX swap. Simplified diagram.</figcaption>
</figure>

## Why arbitrage no longer closes the gap

If a riskless margin exists, why do banks not erase it? Because the arbitrage is no longer either riskless or free. The work of the BIS and the Fed converges on two causes. First, balance-sheet constraints: since 2008, the leverage ratio and risk-weighted capital requirements make the mere act of expanding a balance sheet to capture the gap costly. The arbitrageur must tie up capital, and demands to be paid for it. Second, the imbalance in hedging demand: Japanese insurers and European pension funds structurally need dollars they obtain through swaps, which pushes the gap one way, with no symmetric counterparty to fill it.

These two forces explain why the basis widens especially on balance-sheet dates. At quarter- and year-ends, banks cut their market-making to lighten their balance sheet, liquidity grows scarce, and the gap widens brutally on small demand shocks. It is the same balance-sheet-constraint mechanism described for [repo](/en/analysis/repo-the-liquidity-factory/), applied this time to the FX market.

<figure class="infographic">
<svg viewBox="0 0 720 300" role="img" aria-label="The cross-currency basis as a thermometer of dollar funding stress" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="300" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">A thermometer of dollar stress</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Size of the basis by market regime. Documented markers, in basis points.</text>
  <text x="32" y="104" fill="#5eead4" font-size="12">CALM (before 2008, normal periods)</text>
  <rect x="300" y="92" width="40" height="22" fill="#5eead4" opacity="0.85"></rect>
  <text x="350" y="108" fill="#d6d9df" font-size="11">close to 0</text>
  <text x="32" y="150" fill="#f5b13d" font-size="12">POST-2008 REGIME, OUTSIDE CRISIS</text>
  <rect x="300" y="138" width="150" height="22" fill="#f5b13d" opacity="0.8"></rect>
  <text x="460" y="154" fill="#d6d9df" font-size="11">20 to 100 bps</text>
  <text x="32" y="196" fill="#ff4d87" font-size="12">ACUTE STRESS (2008, 2011-12, March 2020)</text>
  <rect x="300" y="184" width="360" height="22" fill="#ff4d87" opacity="0.85"></rect>
  <text x="300" y="240" fill="#8b909b" font-size="11">up to several hundred basis points on some currencies</text>
  <text x="32" y="280" fill="#d6d9df" font-size="12">The Fed's swap lines, in 2008 and 2020, narrowed the gap.</text>
</svg>
<figcaption>Close to zero before 2008, the basis settled between 20 and 100 basis points in a normal regime, and exploded during crises, up to several hundred basis points on currencies like the Korean won in 2008. Sources: BIS, IMF, Federal Reserve.</figcaption>
</figure>

## The dollar's thermometer

This gap has become the indicator central banks and treasurers watch, because it sums up in one number the strain on dollar funding outside the United States. When it widens, it is because the offshore dollar is short, intermediaries' balance sheets are saturated, and hedging demand overwhelms supply. When the Federal Reserve activated its swap lines with the other central banks, in 2008 then in March 2020, the gap narrowed almost at once, a sign that the shortage was indeed of dollars, not of solvency.

The cross-currency basis is therefore the displayed price of the plumbing described in our earlier pieces. It puts a number on the cost, at a given moment, of access to the dollar for the rest of the world. A rule reputed unbreakable has turned into a permanent barometer, and as long as dollar demand stays structurally imbalanced and bank balance sheets constrained, this gap will remain, in normal times as in crisis, one of the most honest signals of the global financial system.

---

**Primary sources:** Bank for International Settlements, Borio, McCauley, McGuire and Sushko, "Covered interest parity lost: understanding the cross-currency basis" (Quarterly Review, September 2016) and BIS Working Papers no 590, "The failure of covered interest parity: FX hedging demand and costly balance sheets"; International Monetary Fund, Dao and Gourinchas, "Covered Interest Parity in Emerging Markets" (Working Paper, 2025) and WP/19/169 on CIP deviations in Asia (Korean won up to about 597 basis points in 2008); Federal Reserve, FEDS, "Quantities and Covered-Interest Parity" (2024); Du, Tepper and Verdelhan on post-crisis deviations. Figures and markers verified one by one.
