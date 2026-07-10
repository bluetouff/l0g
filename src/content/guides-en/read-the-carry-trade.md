---
title: "Reading the carry trade: borrow low, invest high, and manage the unwind"
description: "A reference guide to the carry trade: how you borrow in a low-yielding funding currency to invest in a higher-yielding asset and pocket the gap, why the strategy amounts to selling volatility, the role of leverage, the mechanics of the unwind that sank the Nikkei 12% in a single session in August 2024, and the dials to watch to gauge the risk. With the yen as the guiding thread."
summary: "The carry trade means borrowing in a low-rate funding currency, such as the yen or Swiss franc, to invest in a higher-yielding asset and capture the rate differential. It earns a steady income while exchange rates are stable and volatility is contained, but unwinds violently when the funding currency rebounds, forcing a chain of sales. Reading it requires understanding the rate gap that feeds it, the leverage that amplifies it, and the signals, FX volatility, positioning, currency thresholds, that flag an unwind."
pubDate: 2026-07-10T09:00:00+02:00
updatedDate: 2026-07-10T09:00:00+02:00
sourceGuide: "lire-le-carry-trade"
sourceUpdatedDate: 2026-07-10T09:00:00+02:00
tags: ["carry trade", "fx", "rates", "macro", "markets"]
category: marches
draft: false
---

*Some strategies pay a little, often, then a lot at once, but the wrong way. The carry trade is one of them. The idea is plain: borrow where money is cheap, invest where it pays, and live off the gap. It is one of the most discreet and powerful engines of global markets, able to keep a lid on a currency for years and then trigger a crash in hours. This guide takes apart its mechanics, from principle to unwind. The yen, the funding currency par excellence, is the guiding thread.*

## The principle: capturing a rate gap

The [carry trade](/glossaire/carry-trade/) rests on an interest-rate asymmetry between two currencies. An investor borrows in a low-yielding currency, the [funding currency](/glossaire/devise-de-financement/), and converts the proceeds to invest in a higher-yielding asset, often denominated in another currency. As long as the exchange rate holds still, they pocket the difference between the two yields, what markets call the carry, or the pickup.

Take a deliberately simple example. Borrowing in yen costs about 1% a year; investing the proceeds in U.S. bonds earns close to 4%. The gap, about 3 points, is the gross income of the carry, earned without committing much of your own capital. Repeated across trillions of dollars and amplified by leverage, this mechanism drives a large share of global capital flows. It explains why a low-rate currency can stay weak for a long time: as long as the carry works, everyone is selling it.

## Funding and target currencies

Not all currencies are equal in this game. A good funding currency combines two traits: a low interest rate and a reputation for stability. The Japanese yen has ticked both boxes for twenty years, the Bank of Japan having kept rates on the floor well after everyone else. The Swiss franc plays a similar role, and the dollar itself served as a funding currency during the zero-rate years that followed 2008. At the other end, target currencies offer a higher yield: the dollar when the Fed holds rates high, but above all high-yielding emerging currencies, the Mexican peso, Brazilian real, South African rand, Indian rupee, whose policy rates often exceed 8 to 14%.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 320" role="img" aria-label="Rate gap between funding and target currencies of the carry trade" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="320" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">The rate gap that powers the carry</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Policy rates, indicative, mid-2026. The carry captures the gap between funding and target.</text>
  <text x="40" y="88" fill="#d6d9df" font-size="12">Japan (funding currency)</text>
  <rect x="40" y="98" width="600" height="20" fill="#2a2c33"></rect>
  <rect x="40" y="98" width="43" height="20" fill="#8b909b" opacity="0.75"></rect>
  <text x="91" y="113" fill="#8b909b" font-size="11" font-weight="700">1.00%</text>
  <text x="40" y="136" fill="#d6d9df" font-size="12">Euro area</text>
  <rect x="40" y="146" width="600" height="20" fill="#2a2c33"></rect>
  <rect x="40" y="146" width="96" height="20" fill="#7aa2f7" opacity="0.9"></rect>
  <text x="144" y="161" fill="#7aa2f7" font-size="11" font-weight="700">2.25%</text>
  <text x="40" y="184" fill="#d6d9df" font-size="12">United States (target)</text>
  <rect x="40" y="194" width="600" height="20" fill="#2a2c33"></rect>
  <rect x="40" y="194" width="161" height="20" fill="#5eead4" opacity="0.9"></rect>
  <text x="209" y="209" fill="#5eead4" font-size="11" font-weight="700">3.75%</text>
  <text x="40" y="232" fill="#d6d9df" font-size="12">Emerging (Mexico, Brazil...)</text>
  <rect x="40" y="242" width="600" height="20" fill="#2a2c33"></rect>
  <rect x="40" y="242" width="471" height="20" fill="#f5b13d" opacity="0.9"></rect>
  <text x="519" y="257" fill="#f5b13d" font-size="11" font-weight="700">8 to 14%</text>
  <text x="32" y="300" fill="#8b909b" font-size="11">Sources: BoJ, ECB, Fed (mid-2026). Emerging rates indicative. The carry = the gap captured.</text>
</svg>
<figcaption>The carry captures the gap between a currency borrowed at a low rate, the <strong>yen at 1%</strong>, and a better-paying asset, from the dollar at <strong>3.75%</strong> up to emerging markets in the double digits. The wider the gap, the more attractive the trade, and the more capital it draws. Sources: BoJ, ECB, Fed.</figcaption>
</figure>

The choice of pair depends on risk appetite. Carry between developed currencies, yen versus dollar for instance, offers a more modest gap but contained volatility. Carry into emerging markets promises a much bigger pickup, at the cost of markedly higher currency and default risk. In both cases, the implicit bet is the same: that the funding currency will not strengthen abruptly.

## A bet on calm: the carry as a short-volatility trade

This is the most important point, and the most misunderstood. The carry trade is not only a bet on a rate gap, it is a bet on stability. Its payoff profile resembles that of an insurance seller: it collects a steady premium as long as nothing happens, and suffers a heavy, sudden loss when the accident strikes. In market language, the carry amounts to selling volatility.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 300" role="img" aria-label="Asymmetric payoff profile of the carry trade" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="300" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">The carry profile: the staircase, then the trapdoor</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Steady, modest gains, and a rare but brutal risk.</text>
  <line x1="60" y1="250" x2="680" y2="250" stroke="#2a2c33" stroke-width="1"></line>
  <polyline points="70,235 140,235 140,220 220,220 220,204 300,204 300,186 380,186 380,166 460,166 460,144 520,144" fill="none" stroke="#5eead4" stroke-width="3"></polyline>
  <polyline points="520,144 545,144 545,262 660,262" fill="none" stroke="#ff4d87" stroke-width="3"></polyline>
  <circle cx="520" cy="144" r="4" fill="#f5b13d"></circle>
  <text x="150" y="120" fill="#5eead4" font-size="12" font-weight="700">steady carry income</text>
  <text x="150" y="138" fill="#8b909b" font-size="11">the rate gap earned month after month</text>
  <text x="556" y="200" fill="#ff4d87" font-size="12" font-weight="700">the unwind</text>
  <text x="386" y="284" fill="#8b909b" font-size="11">Months of steady gains erased in a few sessions: the carry implicitly sells volatility.</text>
</svg>
<figcaption>The payoff line climbs slowly, step by step, then drops all at once. It is the profile of an insurance seller: a regular premium, then a sudden claim. <strong>The carry thrives on calm and dies in panic.</strong></figcaption>
</figure>

This nature explains two characteristic behaviours. First, the carry loves quiet: the lower the volatility, the safer it looks and the more capital flows in, which compresses volatility further, in a self-reinforcing loop. Second, it hates surprises: a volatility shock, even one unrelated to the currency, can be enough to send capital fleeing and reverse the move. The [VIX](/glossaire/vix/) and currency-volatility indices are, on that score, leading barometers of the carry's health.

## Leverage, the accelerator both ways

A 3-point gap makes no one rich if it applies to little capital. The carry trade only becomes significant with leverage, obtained in several ways: in the FX forward market, where you take a position far larger than your stake; via [repo](/glossaire/repo/), pledging the securities bought to borrow again; or through derivatives that replicate the exposure without tying up the notional. Ten-times leverage multiplies the carry's return by ten, but also the loss if it reverses.

Leverage introduces a second danger, more insidious than a simple loss: the margin call. When the position turns, the lender demands more collateral. To provide it, the investor must sell assets, often the most liquid in the portfolio, including those with nothing to do with the carry. This is the channel through which an accident confined to the yen contaminates equities, credit or crypto on the other side of the world.

## The unwind: when it all comes undone at once

The dreaded scenario has a name, the unwind. It is triggered when the funding currency strengthens abruptly, which typically happens when the central bank that issues it raises rates, or when a market shock sparks a rush to safety. The first losses trigger margin calls, which force sales, which strengthen the funding currency further as it is bought back in a panic, which deepen the losses of the other holders: the spiral is under way.

The reference episode is 5 August 2024. A rate hike by the Bank of Japan, combined with weak U.S. data, triggered a lightning rebound in the yen. The unwind that followed sank the Nikkei 12.4% in a single session, its worst since the 1987 crash, drove the VIX volatility index above 65, and dragged down assets as distant as bitcoin. The Bank for International Settlements devoted a bulletin to the shock, whose lesson fits in one sentence: a carry unwind never stays confined to its home market. We extended this analysis in our article on [the carry trade caught out by Japanese long rates](/posts/carry-trade-yen-la-meche-dans-les-obligations-japonaises/) and the one on [the dollar-yen unwind risk](/posts/dollar-yen-intervention-risque-carry-2026/).

## The dials to watch

The carry gives no warning, but it leaves traces. Four dials help gauge its tension.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 300" role="img" aria-label="The four signals to watch to gauge carry-trade unwind risk" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="300" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">The four dials of the carry</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">The signals the l0g Yen Carry Monitor tracks to gauge unwind risk.</text>
  <line x1="40" y1="78" x2="680" y2="78" stroke="#2a2c33" stroke-width="1"></line>
  <circle cx="48" cy="103" r="5" fill="#5eead4"></circle>
  <text x="64" y="100" fill="#5eead4" font-size="12.5" font-weight="700">Rate gap</text>
  <text x="64" y="117" fill="#8b909b" font-size="11.5">Wide, the carry pays; it compresses when central banks converge.</text>
  <line x1="40" y1="132" x2="680" y2="132" stroke="#2a2c33" stroke-width="1"></line>
  <circle cx="48" cy="157" r="5" fill="#f5b13d"></circle>
  <text x="64" y="154" fill="#f5b13d" font-size="12.5" font-weight="700">FX implied volatility</text>
  <text x="64" y="171" fill="#8b909b" font-size="11.5">Low, the trade looks safe; a sudden spike forces unwinds.</text>
  <line x1="40" y1="186" x2="680" y2="186" stroke="#2a2c33" stroke-width="1"></line>
  <circle cx="48" cy="211" r="5" fill="#7aa2f7"></circle>
  <text x="64" y="208" fill="#7aa2f7" font-size="12.5" font-weight="700">CFTC positioning</text>
  <text x="64" y="225" fill="#8b909b" font-size="11.5">An extreme short-yen consensus flags a crowded, fragile trade.</text>
  <line x1="40" y1="240" x2="680" y2="240" stroke="#2a2c33" stroke-width="1"></line>
  <circle cx="48" cy="265" r="5" fill="#ff4d87"></circle>
  <text x="64" y="262" fill="#ff4d87" font-size="12.5" font-weight="700">Exchange rate vs thresholds</text>
  <text x="64" y="279" fill="#8b909b" font-size="11.5">Nearness to an intervention line can trigger a reversal.</text>
</svg>
<figcaption>Rate gap, currency volatility, speculative positioning and nearness to intervention thresholds: read together, these four dials tell whether the carry is sleeping soundly or nearing its breaking point. They feed the l0g <strong>Yen Carry Monitor</strong>.</figcaption>
</figure>

The first is the rate gap: it is what pays the trade, and its compression, when the funding central bank tightens or the others ease, reduces its appeal. The second is FX implied volatility: low, it lulls; a spike wakes it and triggers sales. The third is speculative positioning, published weekly by the [CFTC](/glossaire/cftc/) in its COT report: an extreme short position on the yen betrays a crowded trade, hence vulnerable to the slightest reversal. The fourth is the exchange rate itself relative to the thresholds where an [FX intervention](/glossaire/intervention-de-change/) becomes likely, since that intervention can be the spark of the unwind. The l0g [Yen Carry Monitor](/methodologie/yen-carry/) aggregates precisely these signals.

## Reading the carry in practice

The carry trade is not a trading-desk curiosity, it is a structuring force. Read well, it illuminates three things. It explains why a currency can stay weak for a long time with no visible reason: because it funds the planet. It is a reminder that a calm market is not a safe market, and that the lowest volatility often precedes the most violent shock, because it draws in the leverage that will make it brutal. And it links markets one believes are separate: the day the yen turns, Japanese equities, emerging markets and crypto can fall together, not through fundamental contagion but through the need for liquidity.

Reading it therefore means looking beyond the rate gap that feeds it, toward the conditions that make it sustainable or explosive: volatility, leverage, positioning. The carry thrives on boredom and dies in panic. The whole difficulty, for the observer, is to recognise the moment when boredom turns to complacency.

## Sources and further reading

- [Bank for International Settlements, Bulletin no. 90, "The market turbulence and carry trade unwind of August 2024"](https://www.bis.org/publ/bisbull90.pdf): anatomy of the 5 August 2024 unwind.
- [Bank of Japan, monetary policy decisions](https://www.boj.or.jp/en/mopo/mpmdeci/index.htm/): the path of Japanese rates, the bedrock of the yen carry.
- [CFTC, Commitments of Traders](https://www.cftc.gov/MarketReports/CommitmentsofTraders/index.htm): speculative positioning on the yen and currencies.
- l0g, [Yen carry trade: the fuse in Japanese bonds](/posts/carry-trade-yen-la-meche-dans-les-obligations-japonaises/) and [Dollar-yen: the unwind risk](/posts/dollar-yen-intervention-risque-carry-2026/).
- Related guides: [Reading VIX and MOVE volatility](/en/guides/read-vix-move-volatility/), [Reading the CFTC COT report](/en/guides/read-cftc-cot-report/) and [Reading the dollar: DXY and cross-currency basis](/en/guides/read-dollar-dxy-cross-currency-basis/).
</content>
