---
title: "How to Read Liquidity: Reserves, TGA, RRP and the Net-Liquidity Proxy"
description: "A reference guide to financial-system liquidity: the three taps of bank reserves, the Treasury General Account and reverse repos, the net-liquidity formula markets follow and its limits, how to read the plumbing from primary sources, and the 2026 regime after the end of quantitative tightening."
pubDate: 2026-07-08T18:00:00+02:00
updatedDate: 2026-07-08T18:00:00+02:00
sourceGuide: "liquidite-tresor-dts-tga-rrp"
sourceUpdatedDate: 2026-06-21T14:00:00+02:00
tags: ["macro", "central banks", "liquidity", "treasury", "methodology"]
category: fed
summary: "Net liquidity is a market-followed indicator built from the Federal Reserve balance sheet minus the U.S. Treasury General Account and reverse repos. It is a useful proxy for available liquidity, provided its limits are explicit."
draft: false
---

*Market liquidity is not a mood. It is plumbing. Three accounts, sitting around the Federal Reserve and the U.S. Treasury, push cash into and out of the system: bank reserves, the Treasury General Account and reverse repos. A popular formula combines them into a “net liquidity” indicator that thousands of traders watch as a risk-asset barometer. This guide explains the real mechanics, shows how to read the primary sources, and marks exactly where the proxy misleads.*

The formula comes first because it is the one everyone quotes. Net liquidity is most often calculated as the Federal Reserve balance sheet minus the balance of the Treasury General Account and the amounts placed in the overnight reverse repo facility. When the Treasury account or reverse repos fall, cash returns to the system and net liquidity rises. When they swell, the reverse happens. Everything else follows from understanding these three taps.

## The three taps

The first tap is the stock of bank reserves: deposits that banks hold at the Federal Reserve. They are the ultimate settlement liquidity, the fuel banks use to settle with each other. When the Fed buys securities, it credits reserves and injects liquidity; when it lets securities mature without reinvestment, it withdraws it. That is the mechanism behind [QE](/glossaire/#qe) and [QT](/glossaire/#qt).

The second tap is the Treasury General Account, or TGA: the federal government’s checking account at the Fed. Its mechanics are counterintuitive but decisive. When Treasury issues debt and builds cash, that cash leaves the banking system and sits in the TGA, draining reserves. When Treasury spends, it reinjects cash. A TGA rebuild after a debt-ceiling standoff is therefore a powerful liquidity drain, often underestimated.

The third tap is the overnight reverse repo facility, or RRP, where money-market funds place excess cash with the Fed against securities. While it was full, RRP acted as a buffer: it absorbed excess cash and protected bank reserves from shocks. Once drained, it no longer plays that role, and every stress lands more directly on reserves.

## The net-liquidity formula, and its limits

The attraction of the formula is real. Over long periods, the net-liquidity proxy has often moved in the same direction as risk assets, making it a popular macro lens among money-market analysts. When liquidity flows in, it tends to look for return. When liquidity flows out, the most liquidity-sensitive assets usually suffer first.

Honesty requires stating the limits, because this is where the tool becomes a trap. Net liquidity is a proxy, not a law. Its correlation with markets is loose, unstable and regime-dependent. The formula itself varies by author: some start from the total balance sheet, others from reserves only, changing the level. It ignores money velocity, private credit, foreign flows and off-balance-sheet leverage, channels that can dominate in the short run. Above all, it can fail at turning points, when markets anticipate the plumbing rather than passively absorb it. Net liquidity illuminates a background regime. It is not an entry signal.

## Reading the plumbing from primary sources

The good news is that all of this is public, free and daily or weekly. Three sources are enough to rebuild net liquidity yourself, without an intermediary.

The Treasury account is visible day by day in the Daily Treasury Statement, published by the Bureau of the Fiscal Service. It details federal cash receipts, outlays and the operating cash balance. The Fed balance sheet, reserves and RRP are in the weekly H.4.1 release, “Factors Affecting Reserve Balances.” Policy and money-market rates, including the reverse repo rate, effective fed funds, SOFR and other repo rates, are published daily by the New York Fed. If you want ready-to-use series, the St. Louis Fed’s FRED database aggregates them. Rebuilding the indicator by hand remains the best way to understand it and avoid becoming its prisoner.

## The 2026 regime: QT over, RRP drained

The backdrop changed at the end of 2025, and any liquidity reading must integrate it. After shrinking its balance sheet from a peak of roughly **$8.9 trillion** in 2022 to about **$6.5 trillion**, the Federal Reserve ended quantitative tightening on **December 1, 2025**, earlier than expected, having unwound only about half of the pandemic-era expansion. At the same time, RRP, which peaked above **$2.5 trillion** in 2023, fell close to zero. The consequence is structural: the shock absorber is gone, and reserves, near **$2.8 trillion** in late 2025, a more than four-year low, now absorb shocks alone. The Fed targets “ample” reserves, roughly **10% to 11%** of GDP, versus around 13% today.

## When the plumbing clogs: stress signals

When reserves approach scarcity, even a small shock moves funding rates, and that is the signal to watch. The reference episode remains September 2019, when repo rates jumped from about 2% to nearly 10% overnight after tax payments and Treasury settlements drained reserves, forcing the Fed to intervene. More recently, on **October 31, 2025**, the Fed injected about **$29.4 billion** through its standing repo facility, the largest one-day intervention since the early 2000s, during month-end stress with reserves at multi-year lows.

The leading indicators are well known: an effective fed funds rate moving toward, or above, the rate paid on reserves; repo rates widening; quarter-end pressure. A January 2026 Fed note on the “balance-sheet trilemma” formalizes it: as reserves fall relative to the stock of public debt, repo rates become more sensitive to TGA moves, Treasury issuance and quarter-end dates. The standing repo facility is now the ceiling designed to prevent another 2019.

## Why markets care

The issue is not technical trivia. A liquidity drain, whether from a TGA rebuild or an issuance shock, first transmits through funding markets, then through risk assets, via the cost and availability of collateral. This is also where public debt and private money meet: [stablecoin](/guides/stablecoins-genius-act/) issuers, now large buyers of Treasury bills, add a new source of demand at the short end, while a massive TGA rebuild can drain the system at the worst moment. Following liquidity is not about finding a buy signal. It is about knowing the calendar of major cash movements—debt ceiling, tax dates, quarter-ends—so you do not mistake a plumbing stress for a monetary-policy turn.

## Reading the risk, step by step

A few habits are enough. Follow the TGA daily through the Daily Treasury Statement and anticipate rebuilds after debt-ceiling deals. Read RRP and reserves in the weekly H.4.1 to locate the remaining buffer. Watch the gap between repo rates and the reserve rate, as well as effective fed funds, as scarcity thermometers. Mark quarter-ends and major tax dates, classic stress windows. And keep the net-liquidity formula for what it is: a trend compass, never a trading trigger. The [FOMC](/glossaire/#fomc) steers rates, but the plumbing is read in these three accounts.

## Methodology

This guide relies on primary sources: Federal Reserve releases and H.4.1, the Fed’s January 2026 note on the balance-sheet trilemma, the Congressional Research Service’s work on the Fed balance sheet, reference rates published by the New York Fed, and the Daily Treasury Statement from the Bureau of the Fiscal Service. Balance-sheet, reserve and RRP levels are dated late 2025 and early 2026; they change, hence the revision date. Practical liquidity work on l0g.fr rebuilds the indicator from these series rather than trusting a prepackaged number, and separates plumbing stress from a true monetary-policy pivot.

---

**Main sources:** Federal Reserve, H.4.1 “Factors Affecting Reserve Balances” and monetary-policy releases; Federal Reserve, FEDS Note “The Central Bank Balance-Sheet Trilemma,” January 14, 2026; Congressional Research Service, “The Federal Reserve’s Balance Sheet”; Federal Reserve Bank of New York reference rates, including EFFR, ON RRP, SOFR and TGCR, plus standing repo facility operations; U.S. Treasury, Bureau of the Fiscal Service, Daily Treasury Statement; FRED, Federal Reserve Bank of St. Louis, for aggregated series. Figures are dated late 2025 and early 2026.
