---
title: "Stablecoins, the marginal buyer of US Treasuries"
description: "The GENIUS Act turned stablecoin issuers into structural buyers of short-dated US debt. Tether already weighs like a country among the Treasury's creditors. This captive demand compresses short yields, but a BIS study shows an outflow raises yields more than an inflow lowers them. An analysis of the transmission channel, from crypto to sovereign debt."
pubDate: 2026-07-15T22:15:00+02:00
updatedDate: 2026-07-15T22:15:00+02:00
tags: ["stablecoins", "credit", "treasury", "dollar", "systemic risk", "crypto"]
draft: false
sourceArticle: "stablecoins-acheteur-marginal-bon-du-tresor"
sourceUpdatedDate: 2026-07-15
---

A stablecoin is not really a cryptocurrency. It is a digital wrapper around a portfolio of government debt. Each token in circulation is supposed to be backed by a dollar of reserves, and since the summer of 2025 US law requires those reserves to take mainly the form of short-dated Treasury bills. The result went almost unnoticed: a sector born on the margins of the financial system has become one of its largest buyers of sovereign debt. At the end of July 2026, the stablecoin market weighed about **$303bn**, of which **$184bn** for Tether's USDT and **$73bn** for Circle's USDC, according to [DefiLlama](https://defillama.com/stablecoins) tracking data. Behind these tokens sits Treasury debt, and a lot of it.

## The law that anchors the token to short-dated debt

The [GENIUS Act](/en/analysis/the-genius-act-stablecoins-and-the-debt/), enacted on 18 July 2025, sets the first framework for payment stablecoins in the United States. It requires one-for-one coverage by safe, liquid assets. The law firm [Arnold & Porter](https://www.arnoldporter.com/en/perspectives/advisories/2025/07/new-stablecoin-legislation-analyzing-the-genius-act) details the six permitted categories: coins and notes, insured bank deposits, Treasury bills, notes or bonds with a remaining maturity of no more than 93 days, repurchase agreements backed by those same securities, money market funds invested in those assets, and central-bank reserves.

The 93-day cap is no detail. It is meant to exclude interest-rate risk: a long-dated security loses value when rates rise, and that latent loss can knock the token off its peg. As [Spark](https://www.spark.money/research/stablecoin-treasury-bill-reserve-mechanics) notes, this is a direct lesson from the 2023 collapse of Silicon Valley Bank, whose balance sheet held long-dated debt at a loss. The law therefore forces reserves toward the shortest, most liquid segment of the curve, that of the Treasury bill.

This constraint makes issuers heavyweight creditors. According to the reserve analysis relayed by [Spark](https://www.spark.money/research/stablecoin-treasury-bill-reserve-mechanics), Tether carries more than **$141bn** of exposure to US debt, which would place it among the twenty largest holders of Treasury securities worldwide, on a par with mid-sized countries. The retail token has become, without saying so, an instrument for financing the federal government.

## A quiet pillar of debt demand

The Treasury itself has taken the measure of the phenomenon. In its April 2025 work, the [Treasury Borrowing Advisory Committee](https://home.treasury.gov/news/press-releases/sb0122) estimated that about **$120bn** of Treasury bills already served as collateral for stablecoins, and that a market grown to $2,000bn by 2028 would mobilise more than **$1,000bn** of bills. Treasury secretary Scott Bessent himself has spoken of additional demand potentially reaching $2,000bn in the coming years. A [Forbes](https://www.forbes.com/sites/jonegilsson/2025/05/05/why-stablecoins-may-surpass-china-in-us-treasury-holdings-by-2028/) projection goes further: stablecoins could overtake China among the holders of US debt as early as 2028.

The interest for Washington is direct. While the Treasury issues short-dated debt massively to fund its deficits, a captive and growing source of demand for the Treasury bill eases the pressure on auctions and on yields. The calculation is the same as the one described in our reading of [the GENIUS Act's bet on debt](/en/analysis/the-genius-act-stablecoins-and-the-debt/): to regulate stablecoins is also to buy oneself a buyer.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 320" role="img" aria-label="Treasury bills backing stablecoins, current level and 2028 projection" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="320" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">The stablecoin, a store of Treasury bills</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Treasury bills backing stablecoins, in billions of dollars.</text>
  <line x1="70" y1="90" x2="70" y2="250" stroke="#2a2c33" stroke-width="1"></line>
  <line x1="70" y1="250" x2="680" y2="250" stroke="#2a2c33" stroke-width="1"></line>
  <rect x="150" y="220" width="120" height="30" fill="#5eead4" opacity="0.85"></rect>
  <text x="210" y="210" fill="#5eead4" font-size="13" text-anchor="middle" font-weight="700">~120</text>
  <text x="210" y="270" fill="#8b909b" font-size="11.5" text-anchor="middle">today (2025)</text>
  <rect x="430" y="98" width="120" height="152" fill="#ff4d87" opacity="0.9"></rect>
  <text x="490" y="88" fill="#ff4d87" font-size="13" text-anchor="middle" font-weight="700">&gt; 1,000</text>
  <text x="490" y="270" fill="#8b909b" font-size="11.5" text-anchor="middle">2028 projection</text>
  <text x="620" y="120" fill="#f5b13d" font-size="11" text-anchor="middle">if the market</text>
  <text x="620" y="136" fill="#f5b13d" font-size="11" text-anchor="middle">reaches $2,000bn</text>
  <text x="32" y="300" fill="#8b909b" font-size="11">Source: Treasury Borrowing Advisory Committee (April 2025). Tether alone carries &gt; $141bn of exposure.</text>
</svg>
<figcaption>The Treasury estimates that about $120bn of bills already back stablecoins, and that the $1,000bn mark would be crossed if the market reaches $2,000bn in 2028. Source: TBAC.</figcaption>
</figure>

## The effect on short yields, measured

The intuition of a demand that weighs on yields now has a measure. In a working paper published in August 2025, economists Rashad Ahmed and Iñaki Aldasoro, for the [Bank for International Settlements](https://www.bis.org/publ/work1270.pdf), estimate the effect of stablecoin flows on three-month Treasury bill yields, on daily data from 2021 to 2025. A two-standard-deviation inflow into stablecoins lowers the three-month yield by 2 to 2.5 basis points. In periods of bill scarcity, when the available supply is thin, the same flow compresses the yield by 5 to 8 basis points, roughly double.

The order of magnitude stays modest on the scale of a single session, but it is not zero, and it grows with the size of the sector. A demand of several hundred billion, set to double or triple, stops being a microstructure detail and becomes a factor in the formation of short yields, alongside Federal Reserve policy and the Treasury cash management described in our guide on [net liquidity](/en/guides/read-net-liquidity-tga-rrp/).

## The asymmetry that worries

The sensitive point is not the average effect, it is its shape. The same BIS study reveals a clear asymmetry: outflows raise yields two to three times more than inflows lower them. An outflow of $3.5bn pushes the three-month yield up by 6 to 8 basis points, when an equivalent inflow pulls it down by only 2 to 2.5 points. The reason lies in the mechanics of redemption: an inflow invests without haste, an outflow forces the issuer to sell its bills quickly to honour the redemptions. The authors see in this a risk of forced sales in degraded market conditions, and an argument for strengthening issuers' liquidity risk management.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 320" role="img" aria-label="Asymmetric effect of stablecoin flows on the three-month Treasury bill yield" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="320" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">An outflow weighs more than an inflow</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Effect of a $3.5bn flow on the 3-month Treasury bill yield, in basis points.</text>
  <line x1="360" y1="90" x2="360" y2="250" stroke="#2a2c33" stroke-width="1"></line>
  <text x="360" y="278" fill="#8b909b" font-size="11" text-anchor="middle">0</text>
  <rect x="230" y="120" width="130" height="34" fill="#5eead4" opacity="0.85"></rect>
  <text x="220" y="142" fill="#5eead4" font-size="12" text-anchor="end" font-weight="700">-2 to -2.5</text>
  <text x="230" y="108" fill="#d6d9df" font-size="12">Inflow of $3.5bn (yield falls)</text>
  <rect x="360" y="180" width="300" height="34" fill="#ff4d87" opacity="0.9"></rect>
  <text x="668" y="202" fill="#ff4d87" font-size="12" text-anchor="end" font-weight="700">+6 to +8</text>
  <text x="360" y="168" fill="#d6d9df" font-size="12">Outflow of $3.5bn (yield rises)</text>
  <text x="32" y="300" fill="#8b909b" font-size="11">Source: Ahmed and Aldasoro, BIS Working Paper 1270 (August 2025). USDT contributes most, then USDC.</text>
</svg>
<figcaption>Stablecoin demand is procyclical: it quietly supports the market on the way up, but amplifies the strain on the way down when redemptions force sales. Source: BIS.</figcaption>
</figure>

The direction of the transmission deserves to be stated plainly, because it reverses the usual narrative. The customary worry is a shock coming from sovereign debt that would contaminate crypto. Here, the channel runs the other way: a panic on a retail token can propagate to the Treasury bill market, the core of the global financial system, through the liquidation of its reserves. The stablecoin becomes a bridge between two worlds once thought watertight.

## The precedent of March 2023

This scenario is not theoretical. It has already happened, on a small scale. On 11 March 2023, Circle revealed that $3.3bn of its reserves, about 8 percent of the total, were stuck at the failed Silicon Valley Bank. According to [CNBC](https://www.cnbc.com/2023/03/11/stablecoin-usdc-breaks-dollar-peg-after-firm-reveals-it-has-3point3-billion-in-svb-exposure.html), USDC broke from its peg and fell to $0.87, a run on redemptions set in, and Circle had to suspend live redemptions over the weekend. The token only regained parity after the announcement of a public backstop and the resumption of redemptions on the Monday. A [Federal Reserve note](https://www.federalreserve.gov/econres/notes/feds-notes/in-the-shadow-of-bank-run-lessons-from-the-silicon-valley-bank-failure-and-its-impact-on-stablecoins-20251217.html) draws a simple lesson from the episode: a stablecoin backed by assets deemed safe can nonetheless suffer a run, because confidence in the token depends on the immediate liquidity of the reserve, not only on its quality.

At the time, USDC weighed a fraction of its current size and the Treasury bill market felt nothing. The question posed today is one of scale: what happens when the issuer forced to sell in a hurry holds tens of billions of bills, in a market already tight on short-dated supply?

## The other reading

The comparison with 2023, or with money market funds, calls for several nuances that argue for the robustness of the arrangement.

First, the GENIUS Act's 93-day cap removes the interest-rate risk that felled SVB. A reserve in very short bills liquidates at or near par, with no valuation loss, which limits the gap between the exit price and the displayed value. Next, the Treasury bill is the most liquid asset in the world; even a forced sale finds a buyer, when a real-estate fund or a private-credit portfolio does not sell in a day. The captive demand of stablecoins is, finally, a real day-to-day stabiliser, absorbing a share of the Treasury's short-dated issuance and smoothing the formation of yields, as the BIS study notes for inflows.

Yet the protection bears on the quality of the asset, not on the mechanics of the run. A stablecoin issuer is not a regulated [money market fund](/en/guides/read-money-market-funds/): it holds neither the same liquidity buffers nor the ability to cap redemptions. In a panic, it sells, it does not gate. This is where the parallel with shadow banking reasserts itself: the risk has been lodged in a compartment that regulation is only beginning to equip.

## The signals to watch

A few markers will say whether the promise of stability holds. The detailed composition of reserves, first, which the GENIUS Act requires to be published each month, with particular attention to the concentration at a single issuer, Tether. The state of short-dated bill supply, next, because it is in periods of scarcity that the effect of flows doubles. The effective rollout of the implementing rules, while the Federal Reserve had not yet proposed its own by spring 2026. And the presence, or absence, of redemption-management mechanisms in case of strain, the only real bulwark against a run.

The stablecoin has pulled off a silent conversion: from speculative object, it has become a cog in the financing of the American state. This new respectability has a downside. By tethering hundreds of billions of dollars of tokens to the Treasury bill, a thread has been strung between the volatility of crypto and the stability of sovereign debt. As long as confidence holds, the thread supports the market. The day it snaps, it transmits the shock in the direction no one expected.

## Sources

- DefiLlama, stablecoin market capitalisation (about $303bn as of 12 July 2026, USDT $184bn, USDC $73bn): https://defillama.com/stablecoins
- Arnold & Porter, "Analyzing the GENIUS Act" (six categories of reserve assets, 93-day cap, one-for-one coverage): https://www.arnoldporter.com/en/perspectives/advisories/2025/07/new-stablecoin-legislation-analyzing-the-genius-act
- Spark, "Inside Stablecoin Reserves" and "Treasury Bill Reserve Mechanics" (the SVB lesson behind the 93-day cap, Tether's exposure of more than $141bn, rank among the twenty largest holders): https://www.spark.money/research/stablecoin-treasury-bill-reserve-mechanics
- U.S. Department of the Treasury, minutes of the Treasury Borrowing Advisory Committee, 29 April 2025 (about $120bn of bills backing stablecoins, more than $1,000bn if the market reaches $2,000bn in 2028): https://home.treasury.gov/news/press-releases/sb0122
- Forbes, "Why Stablecoins May Surpass China In U.S. Treasury Holdings By 2028": https://www.forbes.com/sites/jonegilsson/2025/05/05/why-stablecoins-may-surpass-china-in-us-treasury-holdings-by-2028/
- Rashad Ahmed and Iñaki Aldasoro, "Stablecoins and safe asset prices", BIS Working Paper no. 1270, August 2025 (two-standard-deviation inflow: -2 to -2.5 bp on the 3-month, -5 to -8 bp under bill scarcity; asymmetry: a $3.5bn outflow makes +6 to +8 bp, an equivalent inflow -2 to -2.5 bp; USDT contributes most): https://www.bis.org/publ/work1270.pdf
- CNBC, "Stablecoin USDC breaks dollar peg after firm reveals it has $3.3 billion in SVB exposure" (11 March 2023, fall to $0.87, run on redemptions, weekend suspension): https://www.cnbc.com/2023/03/11/stablecoin-usdc-breaks-dollar-peg-after-firm-reveals-it-has-3point3-billion-in-svb-exposure.html
- Federal Reserve, "In the Shadow of Bank Runs: Lessons from the Silicon Valley Bank Failure and Its Impact on Stablecoins": https://www.federalreserve.gov/econres/notes/feds-notes/in-the-shadow-of-bank-run-lessons-from-the-silicon-valley-bank-failure-and-its-impact-on-stablecoins-20251217.html
- Brookings, Davidovic, Ghani and Moszoro, "The Rise of Stablecoins and Implications for Treasury Markets" (October 2025): https://www.brookings.edu/wp-content/uploads/2025/10/The_Rise_of_Stablecoins_and_Implications_for_Treasury_Markets_Davidovic_Ghani_Moszoro.pdf

*This article is journalistic analysis and does not constitute investment advice. Market data is cited as of the date of its sources.*
