---
title: "Reading interest rate swaps: IRS, OIS and swap spreads"
description: "A reference guide to interest rate swaps: the mechanics of exchanging fixed for floating on a notional, the swap rate and its curve, OIS as a read on central-bank bets, the shift from LIBOR to SOFR, the swap spread and its sign flipping negative at long maturities, the role of clearing and margin, and the 2022 UK LDI spiral as a case study. The largest derivatives market in the world, decoded."
summary: "An interest rate swap exchanges interest flows on a reference amount, the notional: one party pays a fixed rate, the other a floating rate indexed to SOFR. It is the core tool for hedging interest-rate risk and the largest derivatives market in the world. Reading it requires understanding the swap rate and its curve, OIS as a gauge of the expected central-bank path, the LIBOR-to-SOFR shift, the swap spread against Treasuries, and the margin mechanics that, in the 2022 UK LDI crisis, turned a rate shock into forced sales of sovereign debt."
pubDate: 2026-07-11T09:00:00+02:00
updatedDate: 2026-07-11T09:00:00+02:00
sourceGuide: "lire-les-swaps-de-taux"
sourceUpdatedDate: 2026-07-11T09:00:00+02:00
tags: ["rates", "derivatives", "markets", "central-banks"]
category: marches
draft: false
---

*It is the largest market in the world, and almost no one talks about it. Beneath every fixed-rate mortgage, every corporate loan, every pension promise, there is an interest rate swap that was used to turn one risk into another. Hundreds of trillions of dollars of notional circulate this way, invisible, until the day they break and take the sovereign bond market down with them, as in the United Kingdom in 2022. This guide takes apart the mechanics of these contracts, from the simplest exchange to the signals they send.*

## An interest rate swap, in one transaction

An [interest rate swap](/glossaire/swap-de-taux/) is an agreement in which two parties exchange interest flows calculated on the same reference amount, the [notional](/glossaire/notionnel/). One pays a fixed rate, set at the outset; the other pays a floating rate, recalculated each period on a market rate such as SOFR. The counter-intuitive point is that the notional principal is never exchanged: only the interest flows circulate, and most often only the net difference between the two legs is settled.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 300" role="img" aria-label="Mechanics of an interest rate swap, exchanging fixed for floating flows" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="300" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">An interest rate swap: fixed for floating</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Two parties exchange interest flows on the same reference amount.</text>
  <rect x="50" y="120" width="210" height="80" rx="6" fill="none" stroke="#5eead4" stroke-width="1.5"></rect>
  <text x="155" y="152" fill="#5eead4" font-size="14" font-weight="700" text-anchor="middle">Party A</text>
  <text x="155" y="174" fill="#d6d9df" font-size="11.5" text-anchor="middle">pays the fixed rate</text>
  <rect x="460" y="120" width="210" height="80" rx="6" fill="none" stroke="#f5b13d" stroke-width="1.5"></rect>
  <text x="565" y="152" fill="#f5b13d" font-size="14" font-weight="700" text-anchor="middle">Party B</text>
  <text x="565" y="174" fill="#d6d9df" font-size="11.5" text-anchor="middle">pays the floating rate</text>
  <line x1="260" y1="145" x2="460" y2="145" stroke="#5eead4" stroke-width="2"></line>
  <polygon points="460,145 450,140 450,150" fill="#5eead4"></polygon>
  <text x="360" y="137" fill="#5eead4" font-size="11" font-weight="700" text-anchor="middle">fixed rate (e.g. 4%)</text>
  <line x1="460" y1="178" x2="260" y2="178" stroke="#f5b13d" stroke-width="2"></line>
  <polygon points="260,178 270,173 270,183" fill="#f5b13d"></polygon>
  <text x="360" y="196" fill="#f5b13d" font-size="11" font-weight="700" text-anchor="middle">floating rate (SOFR)</text>
  <text x="360" y="248" fill="#8b909b" font-size="11.5" text-anchor="middle">The notional principal is never exchanged: only the interest is,</text>
  <text x="360" y="266" fill="#8b909b" font-size="11.5" text-anchor="middle">and usually only the net difference between the two legs is settled.</text>
</svg>
<figcaption><strong>Party A</strong> pays a fixed rate and receives a floating rate; <strong>Party B</strong> does the opposite. The one paying fixed is the "payer": it hedges against a rise in rates. The notional serves only as a basis for the calculation.</figcaption>
</figure>

What is it for? To transform an exposure. A company borrowing at a floating rate, fearing a rise, pays fixed and receives floating: it thereby locks in its funding cost. An investor expecting a fall does the reverse. The swap does not make interest-rate risk disappear, it transfers it to whoever is willing to carry it. Multiplied across the whole economy, this redistribution makes swaps the most widespread tool for managing rate risk, and the largest derivatives market on the planet.

## The swap rate and its curve

How is the fixed rate of a swap set? At a level such that, at the outset, the contract is worth nothing to either party: this is the swap rate, the one that equalizes the expected value of the fixed and floating flows. By construction, it therefore embeds the path the market expects for the floating rate over the whole life of the contract. A ten-year swap rate sums up in a single number what the market thinks about short rates for the coming decade.

Linking the swap rates of all maturities gives the swap curve, a benchmark parallel to that of government bonds. The two curves track each other closely, but the gap between them, discussed below, carries valuable information. For banks and corporates, the swap curve is often the most direct pricing reference, because it reflects the real cost of hedging rather than the yield of a particular security.

## OIS: the risk-free rate and bets on the central bank

One family of swaps deserves special attention, the [OIS](/glossaire/ois/), for Overnight Index Swap. Its floating leg is not a three-month rate but the overnight rate compounded over the period, SOFR in the United States. Because that overnight rate tracks the central bank's policy rate very closely, an OIS quote directly reveals what the market expects of monetary policy. Reading the OIS curve means reading the bets on coming rate hikes and cuts, central-bank meeting by meeting.

The OIS plays a second role, more technical but fundamental: it serves as the "risk-free" rate for discounting the future flows of derivatives. Since the 2008 crisis, which showed that banks were not risk-free among themselves, the market has abandoned LIBOR in favour of OIS discounting. It is invisible plumbing, but it underpins the valuation of trillions of contracts.

## From LIBOR to SOFR: the great shift

For decades, the floating leg of swaps was indexed to [LIBOR](/glossaire/libor/), an interbank rate calculated from banks' submissions. The scandal over its manipulation, revealed after 2008, sealed its fate. For the dollar, LIBOR stopped being published at the end of June 2023, replaced by [SOFR](/glossaire/sofr/), a rate backed by actual [repo](/en/glossary/repo/) transactions on Treasuries, hence far harder to rig. We detail how it is built in our [repo and SOFR guide](/en/guides/read-repo-market-sofr/).

The shift is not just a change of name. LIBOR embedded a bank-risk premium and existed for several maturities; SOFR is an overnight, secured rate with no credit premium. The whole edifice of swaps had to be rebuilt on this new foundation, and once-common instruments, such as forward rate agreements, have virtually disappeared in the post-LIBOR world. It is one of the largest market overhauls ever undertaken, and it happened almost without a hitch.

## The swap spread: swap versus Treasury

Back to the gap between the swap curve and the government-bond curve. This [swap spread](/glossaire/swap-spread/) is the difference between the swap rate and the Treasury yield of the same maturity. Long positive, it reflected a logical premium: a swap with a bank is deemed slightly riskier than a government bond. Since 2015, however, the long-maturity swap spread has turned negative, an apparent anomaly where the swap rate is below the government yield.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 300" role="img" aria-label="The swap spread and its sign flipping by maturity" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="300" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">The swap spread, and its flipping sign</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Gap between the swap rate and the Treasury yield of the same maturity.</text>
  <rect x="30" y="80" width="320" height="180" rx="6" fill="none" stroke="#5eead4" stroke-width="1.5"></rect>
  <text x="190" y="106" fill="#5eead4" font-size="13" font-weight="700" text-anchor="middle">Short maturities</text>
  <rect x="70" y="150" width="90" height="70" fill="#5eead4" opacity="0.85"></rect>
  <text x="115" y="240" fill="#d6d9df" font-size="11" text-anchor="middle">swap</text>
  <rect x="220" y="168" width="90" height="52" fill="#8b909b" opacity="0.7"></rect>
  <text x="265" y="240" fill="#d6d9df" font-size="11" text-anchor="middle">Treasury</text>
  <text x="190" y="132" fill="#5eead4" font-size="11" text-anchor="middle">positive spread: the swap pays a premium</text>
  <rect x="370" y="80" width="320" height="180" rx="6" fill="none" stroke="#ff4d87" stroke-width="1.5"></rect>
  <text x="530" y="106" fill="#ff4d87" font-size="13" font-weight="700" text-anchor="middle">Long maturities</text>
  <rect x="410" y="168" width="90" height="52" fill="#5eead4" opacity="0.85"></rect>
  <text x="455" y="240" fill="#d6d9df" font-size="11" text-anchor="middle">swap</text>
  <rect x="560" y="150" width="90" height="70" fill="#8b909b" opacity="0.7"></rect>
  <text x="605" y="240" fill="#d6d9df" font-size="11" text-anchor="middle">Treasury</text>
  <text x="530" y="132" fill="#ff4d87" font-size="11" text-anchor="middle">negative spread since 2015</text>
  <text x="32" y="286" fill="#8b909b" font-size="11">Cause: banks' balance-sheet costs and leverage limits make holding Treasuries expensive.</text>
</svg>
<figcaption>At <strong>short maturities</strong>, the swap rate exceeds the Treasury yield, a classic positive spread. At <strong>long</strong> ones, the relationship has flipped since 2015: holding a Treasury costs balance sheet for banks, depressing its price against the swap. The sign of the spread has become a thermometer of regulatory constraints.</figcaption>
</figure>

This inversion is not a market error, it is a signal. Holding a physical Treasury consumes balance sheet and regulatory capital for a bank, whereas a swap, off balance sheet, consumes almost none. When the balance-sheet constraint tightens, investors prefer the synthetic exposure of the swap to the physical security, pushing the swap rate below the government yield. The swap spread has thus become a barometer of balance-sheet and bank-regulation pressures, as much as of credit risk. A sharp tightening or widening can also betray the unwind of a leveraged arbitrage, like the roughly $60 billion of positions unwound in April 2025, an episode we tied to the [basis trade in our dedicated article](/posts/basis-trade-fed-radiographie-pari-record/).

## Clearing and margin: the safeguard that can bite

After 2008, regulators sought to reduce the risk that a counterparty default on a swap would spread. The answer was central clearing: most standardized swaps now pass through a clearing house, a [central counterparty](/glossaire/ccp/) that steps between the two parties and guarantees the flows. In exchange, it demands margin: an initial margin posted as collateral, and a variation margin marked to market every day.

This setup makes the system safer in normal times, but it introduces a fragility channel. When rates move violently, variation-margin calls explode, and participants must find cash immediately to meet them. If they do not have it on hand, they sell assets, often the most liquid ones, which can amplify the initial shock. Margin protects against counterparty risk, but it transmits liquidity risk. This is exactly the mechanism that nearly took down the UK debt market.

## When swaps break: the UK LDI spiral

In 2022, British pension funds heavily practised liability-driven investment, or [LDI](/glossaire/ldi/): to hedge their very long-term obligations, they held gilts and leveraged interest rate swaps. As long as rates rose slowly, all was well. On 23 September 2022, an unfunded budget sent gilt yields soaring at an unprecedented pace.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 320" role="img" aria-label="The spiral of the 2022 UK LDI crisis" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="320" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">The 2022 LDI spiral</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">How a rate shock turns into forced sales of sovereign debt.</text>
  <rect x="250" y="80" width="220" height="46" rx="6" fill="none" stroke="#ff4d87" stroke-width="1.5"></rect>
  <text x="360" y="101" fill="#ff4d87" font-size="12" font-weight="700" text-anchor="middle">1. Gilt yields</text>
  <text x="360" y="117" fill="#ff4d87" font-size="12" font-weight="700" text-anchor="middle">soar</text>
  <rect x="490" y="150" width="200" height="46" rx="6" fill="none" stroke="#f5b13d" stroke-width="1.5"></rect>
  <text x="590" y="171" fill="#f5b13d" font-size="12" font-weight="700" text-anchor="middle">2. Margin calls on</text>
  <text x="590" y="187" fill="#f5b13d" font-size="12" font-weight="700" text-anchor="middle">swaps and repo</text>
  <rect x="250" y="220" width="220" height="46" rx="6" fill="none" stroke="#7aa2f7" stroke-width="1.5"></rect>
  <text x="360" y="241" fill="#7aa2f7" font-size="12" font-weight="700" text-anchor="middle">3. Forced gilt sales</text>
  <text x="360" y="257" fill="#7aa2f7" font-size="12" font-weight="700" text-anchor="middle">to raise cash</text>
  <rect x="30" y="150" width="200" height="46" rx="6" fill="none" stroke="#8b909b" stroke-width="1.5"></rect>
  <text x="130" y="171" fill="#d6d9df" font-size="12" font-weight="700" text-anchor="middle">4. Yields rise</text>
  <text x="130" y="187" fill="#d6d9df" font-size="12" font-weight="700" text-anchor="middle">still further</text>
  <line x1="470" y1="110" x2="500" y2="150" stroke="#5eead4" stroke-width="1.5"></line>
  <polygon points="500,150 489,148 496,141" fill="#5eead4"></polygon>
  <line x1="560" y1="196" x2="470" y2="235" stroke="#5eead4" stroke-width="1.5"></line>
  <polygon points="470,235 481,234 476,226" fill="#5eead4"></polygon>
  <line x1="250" y1="243" x2="180" y2="196" stroke="#5eead4" stroke-width="1.5"></line>
  <polygon points="180,196 191,199 184,205" fill="#5eead4"></polygon>
  <line x1="180" y1="150" x2="250" y2="110" stroke="#5eead4" stroke-width="1.5"></line>
  <polygon points="250,110 239,111 244,119" fill="#5eead4"></polygon>
  <text x="360" y="300" fill="#8b909b" font-size="11" text-anchor="middle">Broken on 28 September 2022 by the Bank of England, buying gilts in emergency. Source: BoE.</text>
</svg>
<figcaption>Each rise in yields triggered margin calls, which forced gilt sales, which pushed yields higher still. The <strong>Bank of England</strong> broke the loop on 28 September 2022 with a backstop of up to £65 billion in purchases. Source: BoE.</figcaption>
</figure>

The loop was under way: rising yields, margin calls on leveraged positions, gilt sales to find cash, further yield rises. Within days, a pension-hedging problem threatened the country's financial stability. The Bank of England had to intervene in emergency on 28 September 2022, buying gilts to break the spiral. This episode remains the textbook case of the risk that leveraged swaps pose to sovereign debt, a risk the UK regulator is still trying to defuse, as we described in our article on [deleveraging the gilt market](/posts/gilts-repo-levier-banque-angleterre/).

## Reading swaps in practice

Interest rate swaps offer several layers of reading. The swap curve gives, better than any other instrument, the price at which the market exchanges rate risk at each maturity. The OIS curve, more precisely, reads as a permanent poll on the central bank's coming decisions. The swap spread says less about credit risk than about the state of bank balance-sheet constraints, and a sharp move can signal an arbitrage unwind. Finally, the margin mechanism is the channel through which a rate shock becomes a liquidity shock: watching who is leveraged on swaps, and with what collateral cushion, means watching the next possible accident.

One last caution guards against a misleading figure. The size of the swap market is measured in notional, and that notional runs into the hundreds of trillions of dollars, enough to alarm. But the notional is never exchanged: the real risk bears only on the net flows and the market value of the contracts, a tiny fraction of that amount. As often in finance, the biggest number is not the most dangerous; the danger lies in leverage and margin, not in the notional on display.

## Sources and further reading

- [Bank for International Settlements, OTC derivatives statistics](https://www.bis.org/statistics/derstats.htm): the size of the interest-rate swap market in notional.
- [Bank for International Settlements, "Beyond LIBOR: a primer on the new benchmark rates"](https://www.bis.org/publ/qtrpdf/r_qt1903e.pdf): the transition to risk-free rates.
- [Federal Reserve Bank of New York, Secured Overnight Financing Rate (SOFR)](https://www.newyorkfed.org/markets/reference-rates/sofr): the reference rate for dollar swaps.
- [Bank of England, gilt market operation, 28 September 2022](https://www.bankofengland.co.uk/news/2022/september/bank-of-england-announces-gilt-market-operation): the response to the LDI crisis.
- l0g, [Gilts: deleveraging before the next accident](/posts/gilts-repo-levier-banque-angleterre/) and [Basis trade: at its peak per the Fed, moribund per the market](/posts/basis-trade-fed-radiographie-pari-record/).
- Related guides: [Reading the repo market and SOFR](/en/guides/read-repo-market-sofr/) and [Reading the Treasury market](/en/guides/read-us-treasuries-market/).
</content>
