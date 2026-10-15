---
title: "Reading dealer gamma: when options hedging drives the market"
seoTitle: "Dealer gamma: options hedging and market volatility | l0g"
description: "Read delta, gamma and dealer hedging, compare long and short gamma, and identify the limits of positioning estimates and 0DTE narratives."
summary: "Dealer gamma describes how an options portfolio’s delta changes with the underlying. In a delta-hedging model, long gamma produces trades against price changes and short gamma produces trades in the same direction. The market effect depends on net exposure, hedge execution and available liquidity; gross options volume does not establish it."
pubDate: 2026-07-10T16:00:00+02:00
updatedDate: 2026-10-15T18:26:00+02:00
sourceGuide: "lire-le-gamma-des-dealers"
sourceUpdatedDate: 2026-07-10T16:00:00+02:00
tags: ["options", "volatility", "markets", "gamma"]
category: marches
draft: false
---

An options dealer can buy or sell the underlying as its exposure changes. Those trades may interact with other orders in the market. Understanding the mechanism requires a distinction between the sensitivity of one option, the net position of a portfolio and the market impact of a hedge. None of those quantities can be inferred from a large options-volume headline alone.

## Delta and gamma describe different changes

Delta measures an option value’s local sensitivity to the underlying price. Gamma measures how delta changes as that price moves. As a hypothetical first-order example, a delta of **0.5** means an underlying move of one price unit implies an option-value change of about half a unit, holding other inputs fixed. Delta itself will change as the underlying moves. These are model sensitivities, not guaranteed realised returns. The [Options Industry Council’s guide to the Greeks](https://prd-web.optionseducation.org/advancedconcepts/understanding-options-greeks) explains the definitions and their limitations.

Short-dated, near-the-money options can have high gamma. That describes sensitivity, not the size or direction of a dealer’s net exposure. A portfolio may contain offsetting options, other maturities and existing hedges. The [OIC gamma explanation](https://prd-web.optionseducation.org/advancedconcepts/gamma) discusses the effect of strike and time to expiry.

## Net exposure determines the hedge direction

A dealer seeking to offset portfolio delta adjusts a stock or futures hedge when delta changes. This is a risk-management model, rather than an obligation to maintain perfect neutrality at every instant. The dealer’s positions, risk limits and execution choices matter.

Under that model, a long-gamma portfolio requires hedge trades against the underlying move: selling after a rise and buying after a fall. A short-gamma portfolio requires trades in the same direction as the move. [Cboe’s September 2023 analysis](https://www.cboe.com/insights/posts/volatility-insights-evaluating-the-market-impact-of-spx-0-dte-options/) explains both the sign and the magnitude of net gamma. Cboe operates the exchange and has a commercial interest in these products; its empirical findings should retain their dataset and period.

<figure class="infographic" style="padding-bottom:1.75rem">
<p><strong>Long gamma and short gamma: opposite hedge directions</strong></p>
<p>Schematic examples with other inputs held constant. The lines are not market observations.</p>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:1rem">
<svg viewBox="0 0 340 240" role="img" aria-label="Long gamma: buy after a fall and sell after a rise" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect x="1" y="1" width="338" height="238" rx="6" fill="var(--color-surface)" stroke="var(--color-signal)" stroke-width="1.5"></rect>
  <text x="16" y="28" fill="var(--color-signal)" font-size="16" font-weight="700">Dealers LONG gamma</text>
  <text x="16" y="49" fill="var(--color-muted)" font-size="13">Potential stabilising flow</text>
  <polyline points="20,100 60,88 100,110 140,92 180,106 220,94 260,104 300,98" fill="none" stroke="var(--color-signal)" stroke-width="2.5"></polyline>
  <text x="16" y="160" fill="var(--color-paper)" font-size="14">Market falls: BUY</text>
  <text x="16" y="182" fill="var(--color-paper)" font-size="14">Market rises: SELL</text>
  <text x="16" y="210" fill="var(--color-signal)" font-size="13">Hedge trades against</text>
  <text x="16" y="228" fill="var(--color-signal)" font-size="13">the price change.</text>
</svg>
<svg viewBox="0 0 340 240" role="img" aria-label="Short gamma: sell after a fall and buy after a rise" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect x="1" y="1" width="338" height="238" rx="6" fill="var(--color-surface)" stroke="var(--color-accent)" stroke-width="1.5"></rect>
  <text x="16" y="28" fill="var(--color-accent)" font-size="16" font-weight="700">Dealers SHORT gamma</text>
  <text x="16" y="49" fill="var(--color-muted)" font-size="13">Potential reinforcing flow</text>
  <polyline points="20,75 60,83 100,75 140,88 180,99 220,109 260,121 300,130" fill="none" stroke="var(--color-accent)" stroke-width="2.5"></polyline>
  <text x="16" y="160" fill="var(--color-paper)" font-size="14">Market falls: SELL</text>
  <text x="16" y="182" fill="var(--color-paper)" font-size="14">Market rises: BUY</text>
  <text x="16" y="210" fill="var(--color-accent)" font-size="13">Hedge follows</text>
  <text x="16" y="228" fill="var(--color-accent)" font-size="13">the price change.</text>
</svg>
</div>
<figcaption>Conceptual delta-hedging directions. Long gamma implies selling after a rise and buying after a fall; short gamma reverses those hedge trades. The resulting market move is not predetermined. Source: <a href="https://www.cboe.com/insights/posts/volatility-insights-evaluating-the-market-impact-of-spx-0-dte-options/">Cboe’s explanation of net gamma</a>.</figcaption>
</figure>

## Gross 0DTE volume leaves net risk unknown

A zero-days-to-expiry option expires during the trading day. A high share of such contracts in options turnover does not reveal the hedge flow entering the underlying market. Customer purchases and sales can offset one another, and the remaining risk can be hedged across instruments.

[Cboe’s later positioning analysis](https://www.cboe.com/insights/posts/0-dt-es-decoded-positioning-trends-and-market-impact) reports balanced customer activity and limited estimated net hedging in its sample. That finding does not establish the impact on every day or on another underlying. It also does not support a claim that dealer hedging generally represents a fixed large share of index trading. This guide therefore uses no unsourced market-wide percentage.

## Volatility and time also change delta

Vanna describes how delta changes with implied volatility; charm describes its change with time. The hedge direction depends on the portfolio and option characteristics. Falling implied volatility cannot, by itself, establish that dealers must buy the market. The [OIC discussion of second-order Greeks](https://prd-web.optionseducation.org/news/may-office-hours-faqs) provides the definitions.

## GameStop requires its own evidence

A theoretical gamma squeeze is a feedback mechanism: buying calls can leave intermediaries with short gamma, and their subsequent hedge purchases may reinforce a rise. Whether that mechanism dominated a particular episode is an empirical question.

For GameStop in January **2021**, [SEC staff reported that they did not find evidence of a gamma squeeze in the available data](https://www.sec.gov/files/staff-report-equity-options-market-struction-conditions-early-2021.pdf#page=30). This is a staff finding, not a Commission rule or a universal rejection of the mechanism. Presenting GameStop as a proven textbook case would overstate that evidence.

## Read positioning estimates as conditional scenarios

Before using a gamma-exposure or gamma-flip estimate, identify the underlying, option universe, observation time, assumptions about customer positions and treatment of existing hedges. Open interest does not publicly identify every holder’s position. An estimated sign change in gamma is not a universal boundary between a calm market and a falling one.

Compare the possible hedge size with the liquidity available when execution would occur. Revisit the assumptions after new trades, expiry or changes in implied volatility. Continue with the guides to [VIX and MOVE](/en/guides/read-vix-move-volatility/) and [CFTC positioning](/en/guides/read-cftc-cot-report/) to distinguish option sensitivity from other measures of market risk.

## Sources and revision

The links above provide the OIC definitions, Cboe’s dated analyses and the SEC staff’s GameStop finding. The diagram is schematic and the delta example is hypothetical. The October 15 revision removes unsupported trading-share figures and causal claims, corrects the GameStop example and qualifies the interpretation of gamma-flip estimates.
