---
title: "Inflation expectations: TIPS, breakevens and risk premia"
description: "Separate inflation compensation into expectations, risk and liquidity premia. Read TIPS indexation and breakevens through transparent worked examples."
summary: "An inflation breakeven compares nominal and inflation-linked yields at comparable maturities. It combines expected inflation with market premia. Extracting expectations requires assumptions about risk, liquidity and the securities’ cash-flow conventions."
pubDate: 2026-10-19T10:40:00+02:00
sourceGuide: "lire-les-tips-et-les-points-morts-inflation"
sourceUpdatedDate: 2026-10-19T10:40:00+02:00
tags: ["inflation", "TIPS", "rates", "central banks"]
category: fed
draft: false
---

The yield gap between a nominal bond and an inflation-linked bond puts a market price on inflation protection. Interpreting that price also requires examining the risks borne by holders and the conditions under which each security trades. Breakevens provide the starting point for an investigation of expectations.

This guide uses US TIPS as its reference and hypothetical examples rather than current market quotes. It separates calculations based on observable yields from components estimated by a model. Other inflation-linked securities require their own contractual conventions to be checked.

## Follow a TIPS security’s indexed principal

**Treasury Inflation-Protected Securities**, or TIPS, adjust principal with their reference consumer-price index. The coupon rate is fixed, while the cash payment depends on adjusted principal. At maturity, redemption pays the higher of inflation-adjusted principal and original principal. [TreasuryDirect’s TIPS overview](https://www.treasurydirect.gov/marketable-securities/tips/).

In a simplified example, **1,000 CU** of principal adjusted upward by **3%** becomes **1,030 CU**. A **2% annual coupon**, paid semiannually, then produces a **10.30 CU** payment for a half-year using that adjusted principal: 1,030 × 2% / 2. Actual payments use the index ratio applicable on their payment date; these assumed amounts illustrate the arithmetic.

The redemption floor applies to original principal at maturity. Buying above that amount or selling before maturity can still produce a market loss. The security’s value depends on the required real yield, maturity and liquidity, so principal indexation and resale price provide different information. [TreasuryDirect’s TIPS factsheet](https://www.treasurydirect.gov/forms/sec0042.pdf).

## Calculate breakevens with compatible conventions

An **inflation breakeven** is commonly quoted as the nominal yield minus the real yield on an inflation-linked security of comparable maturity. It measures inflation compensation embedded in prices. Check maturities, cash-flow structures, quotation time and yield conventions before subtraction. The [San Francisco Fed’s analysis](https://www.frbsf.org/research-and-insights/publications/economic-letter/2011/06/tips-liquidity-breakeven-inflation-expectations/) explains the components that complicate its interpretation.

Consider two theoretical zero-coupon investments with the same horizon and effective annual yields of **4% nominal** and **1.5% real**. Constant annual inflation equalising their terminal amounts is **1.04 / 1.015 − 1 = 2.463%**, rounded. Simple subtraction gives 2.5%. This example isolates compounding under perfect indexation, excluding tax, the principal floor and liquidity differences.

Coupon bonds require their payment schedules and reinvestment assumptions to be considered. Indexation lags and price-index seasonality can matter, particularly at short horizons. A quoted yield spread is a useful indicator; treating it as the exact break-even threshold for a specific strategy requires the full cash-flow comparison.

## Separate expectations, risk and liquidity

A stylised decomposition is **breakeven ≈ expected inflation + inflation risk premium − relative TIPS liquidity premium**. A positive liquidity premium here means investors require an additional yield to hold the relatively less liquid TIPS security. This raises its yield and narrows the spread against the nominal bond.

The inflation risk premium reflects the nominal bond’s exposure to future economic states. Its sign can vary with the protection that the bond provides in those states. Risk and liquidity premia therefore represent distinct objects. The [Federal Reserve’s discussion of the D’Amico–Kim–Wei model](https://www.federalreserve.gov/econres/notes/feds-notes/tips-from-tips-update-and-discussions-20190521.html) explains the decomposition and compares estimates from different approaches.

Start with hypothetical expected inflation of **2.0%**, a **0.3 percentage-point** risk premium and a **0.4 percentage-point** liquidity premium. Breakeven is **1.9%**. It reaches **2.2%** if expected inflation rises to 2.3% with unchanged premia. It also reaches **2.2%** if expectations stay at 2.0% while the liquidity premium falls to 0.1 percentage point. The observed increase is identical, despite different mechanisms.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 416" role="img" aria-labelledby="premium-tips-en-title premium-tips-en-desc" style="display:block;width:100%;max-width:560px;height:auto;margin-inline:auto;font-family:var(--font-read);background:var(--color-surface);border:1px solid var(--color-line);border-radius:12px">
<title id="premium-tips-en-title">One breakeven, two mechanisms</title>
<desc id="premium-tips-en-desc">Two hypothetical scenarios at the same horizon raise breakeven from 1.9% to 2.2%. A raises expected inflation; B lowers the liquidity premium. Expectations and breakevens are in %, premium contributions in percentage points. Identical vertical scales; l0g calculations, not market estimates.</desc>
<text x="24" y="32" fill="var(--color-bright)" font-size="22" text-anchor="start" font-weight="700">One breakeven, two mechanisms</text>
<text x="24" y="56" fill="var(--color-muted)" font-size="14" text-anchor="start">Teaching examples · % and percentage points</text>
<text x="24" y="90" fill="var(--color-bright)" font-size="18" text-anchor="start" font-weight="600">A · higher expected inflation</text>
<line x1="24" y1="185" x2="456" y2="185" stroke="var(--color-line)" stroke-width="1"/>
<rect x="36" y="132.1" width="65" height="52.9" rx="2" fill="var(--color-signal)"/>
<text x="68.5" y="122.1" fill="var(--color-bright)" font-size="17" text-anchor="middle" font-weight="700">2.3</text>
<text x="68.5" y="207" fill="var(--color-paper)" font-size="15" text-anchor="middle">Expected</text>
<line x1="101" y1="132.1" x2="141" y2="132.1" stroke="var(--color-muted)" stroke-width="1" stroke-dasharray="4 5"/>
<rect x="141" y="125.2" width="65" height="6.9" rx="2" fill="var(--color-amber)"/>
<text x="173.5" y="115.2" fill="var(--color-bright)" font-size="17" text-anchor="middle" font-weight="700">+0.3</text>
<text x="173.5" y="207" fill="var(--color-paper)" font-size="15" text-anchor="middle">Risk</text>
<line x1="206" y1="125.2" x2="246" y2="125.2" stroke="var(--color-muted)" stroke-width="1" stroke-dasharray="4 5"/>
<rect x="246" y="125.2" width="65" height="9.2" rx="2" fill="var(--color-accent)"/>
<text x="278.5" y="115.2" fill="var(--color-bright)" font-size="17" text-anchor="middle" font-weight="700">−0.4</text>
<text x="278.5" y="207" fill="var(--color-paper)" font-size="15" text-anchor="middle">Liquidity</text>
<line x1="311" y1="134.4" x2="351" y2="134.4" stroke="var(--color-muted)" stroke-width="1" stroke-dasharray="4 5"/>
<rect x="351" y="134.4" width="65" height="50.6" rx="2" fill="var(--color-paper)"/>
<text x="383.5" y="124.4" fill="var(--color-bright)" font-size="17" text-anchor="middle" font-weight="700">2.2</text>
<text x="383.5" y="207" fill="var(--color-paper)" font-size="15" text-anchor="middle">Breakeven</text>
<text x="24" y="246" fill="var(--color-bright)" font-size="18" text-anchor="start" font-weight="600">B · improved liquidity</text>
<line x1="24" y1="341" x2="456" y2="341" stroke="var(--color-line)" stroke-width="1"/>
<rect x="36" y="295" width="65" height="46" rx="2" fill="var(--color-signal)"/>
<text x="68.5" y="285" fill="var(--color-bright)" font-size="17" text-anchor="middle" font-weight="700">2.0</text>
<text x="68.5" y="363" fill="var(--color-paper)" font-size="15" text-anchor="middle">Expected</text>
<line x1="101" y1="295" x2="141" y2="295" stroke="var(--color-muted)" stroke-width="1" stroke-dasharray="4 5"/>
<rect x="141" y="288.1" width="65" height="6.9" rx="2" fill="var(--color-amber)"/>
<text x="173.5" y="278.1" fill="var(--color-bright)" font-size="17" text-anchor="middle" font-weight="700">+0.3</text>
<text x="173.5" y="363" fill="var(--color-paper)" font-size="15" text-anchor="middle">Risk</text>
<line x1="206" y1="288.1" x2="246" y2="288.1" stroke="var(--color-muted)" stroke-width="1" stroke-dasharray="4 5"/>
<rect x="246" y="288.1" width="65" height="2.3" rx="2" fill="var(--color-accent)"/>
<text x="278.5" y="278.1" fill="var(--color-bright)" font-size="17" text-anchor="middle" font-weight="700">−0.1</text>
<text x="278.5" y="363" fill="var(--color-paper)" font-size="15" text-anchor="middle">Liquidity</text>
<line x1="311" y1="290.4" x2="351" y2="290.4" stroke="var(--color-muted)" stroke-width="1" stroke-dasharray="4 5"/>
<rect x="351" y="290.4" width="65" height="50.6" rx="2" fill="var(--color-paper)"/>
<text x="383.5" y="280.4" fill="var(--color-bright)" font-size="17" text-anchor="middle" font-weight="700">2.2</text>
<text x="383.5" y="363" fill="var(--color-paper)" font-size="15" text-anchor="middle">Breakeven</text>
<text x="24" y="393" fill="var(--color-muted)" font-size="14" text-anchor="start">Common starting point: 2.0 + 0.3 − 0.4 = 1.9%</text>
</svg>
<figcaption>Two hypothetical scenarios at the same horizon raise breakeven from 1.9% to 2.2%. A raises expected inflation; B lowers the liquidity premium. Expectations and breakevens are in %, premium contributions in percentage points. Identical vertical scales; l0g calculations, not market estimates. <a href="https://www.federalreserve.gov/econres/notes/feds-notes/tips-from-tips-update-and-discussions-20190521.html">Decomposition: Federal Reserve</a>.</figcaption>
</figure>

These component values illustrate signs and arithmetic; they are not empirical estimates. A market diagnosis needs evidence that could distinguish the scenarios: surveys, spreads between instruments, trading conditions and model estimates. The model, sample and assumptions should remain explicit in the resulting interpretation.

## Match the horizon to the question

A breakeven at a particular maturity aggregates a period. Near-term price developments can move that average while more distant expectations change little. Forward rates isolate a future interval from consistent yield curves, but inherit the premia and conventions of the underlying instruments.

Time-series comparisons need a consistent curve method and maturity. Cross-instrument comparisons also require indexation, collateral and liquidity to be documented. The [San Francisco Fed’s discussion of TIPS liquidity](https://www.frbsf.org/research-and-insights/publications/economic-letter/2016/11/tips-liquidity-and-the-outlook-for-inflation/) demonstrates why explicitly treating this factor helps interpret changes in breakevens.

TIPS use CPI indexation under their contractual conventions, while US monetary-policy discussion may concern PCE inflation. Differences in baskets and measurement must accompany any inference from a market price to the inflation objective. The [CPI](/en/guides/read-cpi-inflation-us/) and [PCE](/en/guides/read-pce-inflation-fed/) guides explain their coverage.

## Build a reproducible market diagnosis

Record the two yields, their sources and timestamps, followed by the curve, horizon and formula used. Identify which movement needs explaining: the breakeven, the real yield or the nominal yield. Nominal yields can fall while breakevens rise if real yields fall by more. Reading both legs prevents an interpretation based on only half the calculation.

Then identify evidence supporting the proposed changes in premia. Where their decomposition remains uncertain, retain the explanations compatible with the observations. Combine the exercise with the [Treasury-market guide](/en/guides/read-us-treasuries-market/) to examine trading and funding conditions.

## Sources and limitations

TreasuryDirect describes the instrument, while Federal Reserve research examines its economic decomposition. The worked numbers and figure are reproducible teaching examples, with no forecasting content. A quoted real yield contains its own premia, and model-extracted inflation expectations depend on the model. The conclusion should state its horizon and the degree of identification the evidence actually supports.
