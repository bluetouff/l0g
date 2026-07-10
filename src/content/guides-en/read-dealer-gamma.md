---
title: "Reading dealer gamma: when options hedging drives the market"
description: "A reference guide to options positioning and market-maker gamma: what delta and gamma are, why dealers mechanically hedge their options in the underlying, the decisive difference between long gamma that dampens volatility and short gamma that amplifies it, the rise of 0DTE options, and the precedents of the 2018 Volmageddon and the GameStop gamma squeeze. How an invisible force sets part of the market's moves."
summary: "A growing share of short-term market moves comes not from fundamentals but from the mechanical hedging of options sellers, the market makers. When these dealers are long gamma, they buy dips and sell rallies, dampening volatility; when they are short gamma, they do the opposite and amplify moves. The explosion of same-day options (0DTE), now 40 to 50% of S&P 500 volume, has made these hedging flows a dominant driver of intraday action. Reading it requires understanding delta, gamma, the gamma flip and their limits."
pubDate: 2026-07-10T16:00:00+02:00
updatedDate: 2026-07-10T16:00:00+02:00
sourceGuide: "lire-le-gamma-des-dealers"
sourceUpdatedDate: 2026-07-10T16:00:00+02:00
tags: ["options", "volatility", "markets", "gamma"]
category: marches
draft: false
---

*There is a force that moves markets every day with no news to explain it. It comes neither from fundamental analysis nor from a manager's conviction, but from plumbing: the obligation, for options sellers, to hedge their risk by buying or selling the underlying, mechanically, continuously. On days of heavy same-day options activity, this hedging becomes the primary driver of moves. Understanding dealer gamma means seeing the invisible hand that, depending on the case, pins the market in place or hastens its fall. This guide takes apart its workings.*

## Options, delta and gamma: the bare minimum

An [option](/glossaire/option/) gives the right to buy (a call) or sell (a put) an asset at a set price up to an expiry. Two measures are enough to follow this guide. [Delta](/glossaire/delta/) is the sensitivity of the option's price to the underlying's: a delta of 0.5 means the option moves 0.50 when the asset moves 1. [Gamma](/glossaire/gamma/) is the speed at which that delta changes as the underlying moves. Gamma is greatest when the price is near the strike and when expiry approaches, two conditions met by same-day options.

Keep the image: delta says how much you are exposed, gamma says how fast that exposure changes. High gamma means an exposure that changes fast, hence a hedge to be readjusted constantly. It is from this constant readjustment that the flows that move the market are born.

## The dealer who must hedge

When a retail trader or a fund buys an option, someone sells it to them. That seller is most often a [market maker](/glossaire/teneur-de-marche/), a dealer, whose job is not to bet on market direction but to earn the spread between bid and ask. To stay neutral, it must cancel the delta its option sale left it with, by taking an offsetting position in the underlying. If it sold a call, it buys shares or futures to hedge; if it sold a put, it sells them.

The crucial point is that this hedging is not a directional choice, it is a mechanical constraint. And because delta changes with price, through gamma, the dealer must adjust its hedge continuously, buying and selling the underlying as the market moves. Multiply this by millions of contracts, and you get a flow that genuinely weighs on price. The direction of that flow depends on one thing: is the dealer broadly long or short gamma.

## Long gamma, short gamma: dampen or amplify

This is the heart of the matter. When dealers are collectively long gamma, their hedging pushes them to buy when the market falls and sell when it rises. This behaviour is counter-cyclical: it pulls the price back toward its starting point, dampens volatility and tends to pin the market around the large strikes. When dealers are short gamma, the logic reverses: they sell when the market falls and buy when it rises, a pro-cyclical behaviour that amplifies moves and accelerates declines.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 340" role="img" aria-label="Comparison of dealer hedging when long versus short gamma" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="340" fill="#0c0d10"></rect>
  <text x="32" y="34" fill="#f5f6f8" font-size="17" font-weight="700">Long gamma, short gamma: dampen or amplify</text>
  <text x="32" y="55" fill="#8b909b" font-size="12">Depending on the side of their position, dealer hedging smothers or accelerates moves.</text>
  <rect x="30" y="76" width="320" height="238" rx="6" fill="none" stroke="#5eead4" stroke-width="1.5"></rect>
  <text x="46" y="102" fill="#5eead4" font-size="13" font-weight="700">Dealers LONG gamma</text>
  <text x="46" y="120" fill="#8b909b" font-size="11">volatility dampener</text>
  <polyline points="50,180 90,168 130,190 170,172 210,186 250,174 290,184 330,178" fill="none" stroke="#5eead4" stroke-width="2.5"></polyline>
  <text x="46" y="228" fill="#d6d9df" font-size="11.5">Market falls, the dealer BUYS</text>
  <text x="46" y="248" fill="#d6d9df" font-size="11.5">Market rises, the dealer SELLS</text>
  <text x="46" y="284" fill="#5eead4" font-size="11">Price pins to the strikes,</text>
  <text x="46" y="300" fill="#5eead4" font-size="11">volatility is smothered.</text>
  <rect x="370" y="76" width="320" height="238" rx="6" fill="none" stroke="#ff4d87" stroke-width="1.5"></rect>
  <text x="386" y="102" fill="#ff4d87" font-size="13" font-weight="700">Dealers SHORT gamma</text>
  <text x="386" y="120" fill="#8b909b" font-size="11">volatility amplifier</text>
  <polyline points="390,150 430,158 470,150 510,172 550,196 590,228 630,258 670,282" fill="none" stroke="#ff4d87" stroke-width="2.5"></polyline>
  <text x="386" y="228" fill="#d6d9df" font-size="11.5">Market falls, the dealer SELLS</text>
  <text x="386" y="248" fill="#d6d9df" font-size="11.5">Market rises, the dealer BUYS</text>
  <text x="386" y="284" fill="#ff4d87" font-size="11">Moves accelerate,</text>
  <text x="386" y="300" fill="#ff4d87" font-size="11">crashes go faster.</text>
</svg>
<figcaption>On the left, <strong>long-gamma</strong> dealers buy the dips and sell the rallies: the market is dampened. On the right, <strong>short-gamma</strong> dealers do the opposite and pour fuel on the fire. The level where one flips to the other is the "gamma flip." </figcaption>
</figure>

The price level where dealers flip from long to short gamma has a name, the gamma flip. Above it, the market tends to be calm and drawn toward the large strikes; below it, it turns nervous and prone to accelerations. Specialist data providers estimate this level from options open interest, under the name [GEX](/glossaire/gex/), for Gamma Exposure. A positive GEX signals a dampened market, a negative GEX one at risk of a runaway move.

## The 0DTE regime

This mechanism, long confined to monthly expiry days, has become daily with the explosion of same-day options, [0DTE](/glossaire/0dte/). In 2026, they account for roughly 40 to 50% of total S&P 500 options volume, and up to nearly 60% on some days. Because their gamma is extreme in the final hours before expiry, the hedging they impose on dealers concentrates within the session and must adjust in real time.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 290" role="img" aria-label="Weight of 0DTE options and dealer hedging in S&P 500 volume" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="290" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">The mechanical weight of 0DTE</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Share of S&amp;P 500 options volume and of dealer hedging, 2026.</text>
  <text x="40" y="96" fill="#d6d9df" font-size="12">0DTE options in SPX options volume</text>
  <rect x="40" y="106" width="600" height="22" fill="#2a2c33"></rect>
  <rect x="40" y="106" width="270" height="22" fill="#5eead4" opacity="0.9"></rect>
  <text x="322" y="123" fill="#5eead4" font-size="12" font-weight="700">~40 to 50%</text>
  <text x="40" y="158" fill="#d6d9df" font-size="12">Dealer hedging in SPX volume</text>
  <rect x="40" y="168" width="600" height="22" fill="#2a2c33"></rect>
  <rect x="40" y="168" width="195" height="22" fill="#f5b13d" opacity="0.9"></rect>
  <text x="247" y="185" fill="#f5b13d" font-size="12" font-weight="700">~25 to 40%</text>
  <text x="40" y="224" fill="#d6d9df" font-size="12.5">On heavy 0DTE days, it is hedging flows,</text>
  <text x="40" y="243" fill="#d6d9df" font-size="12.5">not fundamentals, that drive the intraday tape.</text>
  <text x="32" y="276" fill="#8b909b" font-size="11">Sources: CBOE, SpotGamma, academic research. Ranges vary by day and by measure.</text>
</svg>
<figcaption>0DTE options now make up <strong>40 to 50%</strong> of S&amp;P 500 options volume, and dealer hedging <strong>a quarter to two-fifths</strong> of index volume. Enough for the plumbing to set the price. Sources: CBOE, SpotGamma.</figcaption>
</figure>

On indices, this shows up as a magnet effect: toward the close, the underlying tends to gravitate to the strikes where open interest is densest, because dealer hedging turns stabilizing there. The same effect, reversed, makes expiry days (OpEx) more volatile, when the disappearance of a large block of options abruptly changes dealer positioning.

## Vanna, charm and rallies with no news

Dealer hedging does not respond to price alone. It also responds to two other variables, the source of moves that seem inexplicable. The first is volatility: when implied volatility falls, the hedging of dealers who sold puts pushes them to buy the underlying, a flow called vanna that can feed a "vanna rally," a slow, steady rise with no news at all. The second is the passage of time: as expiry approaches, the erosion of time value (charm) also generates directional hedging flows.

These second-order flows have powerful explanatory value. They account for markets that grind higher for weeks in a deceptive calm, carried by hedging mechanics alone, then reverse violently as soon as volatility rebounds and flips the sign of all those flows. Calm is not the absence of risk; it is sometimes the product of a self-reinforcing hedge, until it breaks.

## When gamma breaks: Volmageddon and GameStop

Two episodes show the same mechanism in both directions. On 5 February 2018, "Volmageddon," a rebound in volatility caught out a mass of short-volatility positions and short-gamma dealers: the VIX jumped from about 17 to over 37, the Dow lost 1,175 points in the session, a record at the time, and the inverse VIX product, XIV, collapsed some 96% before being wound down. Forced hedging fed its own decline.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 280" role="img" aria-label="Two precedents of a gamma break, Volmageddon 2018 and GameStop 2021" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="280" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">When gamma breaks: two precedents</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">The same forced-hedging mechanism, in both directions.</text>
  <rect x="40" y="80" width="4" height="70" fill="#ff4d87"></rect>
  <text x="58" y="100" fill="#ff4d87" font-size="13" font-weight="700">February 2018, Volmageddon</text>
  <text x="58" y="120" fill="#d6d9df" font-size="11.5">VIX ~17 to 37, Dow -1,175 pts, the inverse fund XIV -96%.</text>
  <text x="58" y="138" fill="#8b909b" font-size="11.5">Short-gamma, short-vega dealers: the fall feeds itself.</text>
  <rect x="40" y="168" width="4" height="70" fill="#f5b13d"></rect>
  <text x="58" y="188" fill="#f5b13d" font-size="13" font-weight="700">January 2021, GameStop</text>
  <text x="58" y="208" fill="#d6d9df" font-size="11.5">GME from under $20 to a peak of $483 on 28 January.</text>
  <text x="58" y="226" fill="#8b909b" font-size="11.5">Gamma squeeze: call buying forces dealers to buy.</text>
  <text x="32" y="266" fill="#8b909b" font-size="11">Sources: session records, CBOE. Two faces of one hedging mechanism.</text>
</svg>
<figcaption>Downward in 2018, upward in 2021: in both cases, the hedging of short-gamma dealers amplified the move instead of dampening it. <strong>Gamma does not create the trend, it accelerates it.</strong> Sources: session records, CBOE.</figcaption>
</figure>

Conversely, in January 2021, GameStop stock showed the [gamma squeeze](/glossaire/gamma-squeeze/) in its upward version. Heavy call buying by retail traders forced dealers to buy the stock to hedge; that buying pushed the price, raised the delta to hedge, and compelled the dealers to buy still more, in a loop that carried the stock from under $20 to an intraday peak of $483 on 28 January. Down in 2018, up in 2021, but in both cases the same truth: gamma does not create the trend, it accelerates it.

## Reading gamma in practice

Following dealer gamma means adding a layer of reading on top of [volatility](/en/guides/read-vix-move-volatility/). Three reflexes help. First, locate the market relative to the gamma flip: above it, expect a dampened, pinned market; below it, amplified moves. Second, distrust the calm: very low volatility can reflect a stabilizing hedge that will reverse abruptly the day it breaks. Third, read expiry days and large strikes as potential tipping points.

One caveat, finally, separates serious analysis from noise. Gross options volume does not reveal dealers' net exposure: what matters is not how many contracts trade, but the balance between customer buys and sells, which alone determines the volume dealers must hedge. GEX and gamma-flip estimates are valuable, but they rest on positioning assumptions no participant knows with certainty. Dealer gamma explains much of short-term moves; it replaces neither the fundamentals, nor caution before an indicator that remains, by nature, a reconstruction.

## Sources and further reading

- [CBOE, "Evaluating the Market Impact of SPX 0DTE Options"](https://www.cboe.com/insights/posts/volatility-insights-evaluating-the-market-impact-of-spx-0-dte-options/): share of 0DTE and weight of dealer hedging.
- [CBOE, "0DTE Index Options and Market Volatility"](https://cdn.cboe.com/resources/education/research_publications/gammasqueezes.pdf): research on the impact of 0DTE and gamma squeezes.
- SpotGamma, gamma exposure (GEX) and gamma-flip methodology: estimating dealer positioning.
- Related guides: [Reading VIX and MOVE volatility](/en/guides/read-vix-move-volatility/) and [Reading the CFTC COT report](/en/guides/read-cftc-cot-report/).
</content>
