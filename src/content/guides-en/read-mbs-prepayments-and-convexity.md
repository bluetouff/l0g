---
title: "MBS: prepayments and negative convexity"
description: "Connect mortgage refinancing to MBS cash flows, weighted-average life and duration hedging. Reproducible examples with explicit modelling limits."
summary: "Mortgage-backed securities pass through cash flows from pooled home loans. Prepayments change their timing: falling rates can accelerate the return of principal, while rising rates can extend the investor’s exposure to interest rates."
pubDate: 2026-10-19T10:40:00+02:00
sourceGuide: "lire-les-mbs-remboursement-anticipe-convexite"
sourceUpdatedDate: 2026-10-19T10:40:00+02:00
tags: ["MBS", "housing", "rates", "securitisation"]
category: marches
draft: false
---

When a household refinances a mortgage, the new loan repays the old one. An investor entitled to the old loan’s cash flows receives principal earlier and faces a different stream of future interest. Across a portfolio, those household decisions change the duration of a fixed-income position and the transactions needed to hedge it.

This guide covers US fixed-rate residential pass-through MBS, which distribute pooled mortgage cash flows according to the security’s terms. More complex tranches require additional analysis. The worked examples are hypothetical and isolate prepayment through explicitly simplified assumptions.

## Connect the mortgage pool with its investors

A **mortgage-backed security**, or MBS, is backed by mortgage loans. In a pass-through structure, interest and principal payments feed investor distributions after fees and under the relevant contractual rules. Identify the guarantor, payment schedule and loan provisions. [Fannie Mae describes its own products](https://capitalmarkets.fanniemae.com/mortgage-backed-securities); that issuer documentation explains their structure rather than independently assessing their investment merits.

A payment guarantee and interest-rate sensitivity address different risks. Protection against specified defaults can coexist with uncertainty about when principal will return. Timing affects reinvestment, market value and effective duration. The [consumer ABS guide](/en/guides/read-a-consumer-credit-securitisation-abs/) provides a comparison of cash-flow, guarantee and structural questions.

## Start with the household’s refinancing decision

A household weighs expected savings against the cost of replacing its loan and the time it expects to keep the new mortgage. Income, credit eligibility and property value can also constrain access. The [CFPB explains refinancing and associated fees](https://www.consumerfinance.gov/consumer-tools/mortgages/answers/key-terms/), while the [Federal Reserve’s refinancing guide](https://www.federalreserve.gov/pubs/refinancings/default.htm) discusses a simple cost-recovery threshold.

Assume **200,000 CU of outstanding principal**, **20 years remaining** and a **5% nominal annual rate**, with level monthly payments. Using the annual rate divided by 12 as the monthly rate, payment excluding insurance and taxes is **1,319.91 CU**. Refinancing at **3%**, with unchanged principal and remaining term, gives **1,109.20 CU**.

The formula is **payment = principal × r / [1 − (1 + r) to the power −n]**, where r is the monthly rate and n = 240. The difference calculated before rounding is approximately **210.72 CU per month**. With **3,000 CU of separately paid fees**, fees divided by monthly savings gives about **14.24 months**. This simple cash-flow threshold excludes discounting, tax and differences in principal accumulation. A total-cost comparison must include them; extending the term would change the exercise as well.

## Follow the shift in principal repayments

A second example isolates the investment’s payment schedule: **100 CU of principal**, repaid in **20 CU instalments at the end of each of five years**, with annual interest of **5% on beginning-of-year principal**. Total payments are 25, 24, 23, 22 and 21. This is a teaching contract, rather than a level-payment mortgage or a quoted MBS.

If the borrower repays the entire remaining balance at the end of year 2, principal distributions become 20 followed by 80. Total payments are then 25 and 84, after which the contract ends. Investors receive all 100 CU of principal in both cases, while total interest falls from **15 to 9 CU** because the money remains lent for a shorter period.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 420" role="img" aria-labelledby="premium-mbs-en-title premium-mbs-en-desc" style="display:block;width:100%;max-width:560px;height:auto;margin-inline:auto;font-family:var(--font-read);background:var(--color-surface);border:1px solid var(--color-line);border-radius:12px">
<title id="premium-mbs-en-title">Principal returns earlier</title>
<desc id="premium-mbs-en-desc">Fictional contract: principal 100, scheduled amortisation of 20 per year over five years. Paying the balance in year 2 moves 60 CU from later years to that date. Principal bars use identical scales and exclude interest. WAL weights dates by principal repaid. l0g calculations.</desc>
<text x="24" y="32" fill="var(--color-bright)" font-size="22" text-anchor="start" font-weight="700">Principal returns earlier</text>
<text x="24" y="56" fill="var(--color-muted)" font-size="14" text-anchor="start">Principal repaid · CU · fictional example</text>
<text x="24" y="82" fill="var(--color-bright)" font-size="17" text-anchor="start" font-weight="600">Scheduled principal</text>
<text x="456" y="82" fill="var(--color-muted)" font-size="16" text-anchor="end">WAL: 3 years</text>
<line x1="48" y1="188" x2="448" y2="188" stroke="var(--color-line)" stroke-width="1"/>
<text x="39" y="193" fill="var(--color-muted)" font-size="14" text-anchor="end">0</text>
<line x1="48" y1="154" x2="448" y2="154" stroke="var(--color-line)" stroke-width="1"/>
<text x="39" y="159" fill="var(--color-muted)" font-size="14" text-anchor="end">40</text>
<line x1="48" y1="120" x2="448" y2="120" stroke="var(--color-line)" stroke-width="1"/>
<text x="39" y="125" fill="var(--color-muted)" font-size="14" text-anchor="end">80</text>
<rect x="64" y="171" width="42" height="17" rx="3" fill="var(--color-amber)"/>
<text x="85" y="161" fill="var(--color-bright)" font-size="17" text-anchor="middle" font-weight="700">20</text>
<text x="85" y="212" fill="var(--color-muted)" font-size="15" text-anchor="middle">1</text>
<rect x="142" y="171" width="42" height="17" rx="3" fill="var(--color-amber)"/>
<text x="163" y="161" fill="var(--color-bright)" font-size="17" text-anchor="middle" font-weight="700">20</text>
<text x="163" y="212" fill="var(--color-muted)" font-size="15" text-anchor="middle">2</text>
<rect x="220" y="171" width="42" height="17" rx="3" fill="var(--color-amber)"/>
<text x="241" y="161" fill="var(--color-bright)" font-size="17" text-anchor="middle" font-weight="700">20</text>
<text x="241" y="212" fill="var(--color-muted)" font-size="15" text-anchor="middle">3</text>
<rect x="298" y="171" width="42" height="17" rx="3" fill="var(--color-amber)"/>
<text x="319" y="161" fill="var(--color-bright)" font-size="17" text-anchor="middle" font-weight="700">20</text>
<text x="319" y="212" fill="var(--color-muted)" font-size="15" text-anchor="middle">4</text>
<rect x="376" y="171" width="42" height="17" rx="3" fill="var(--color-amber)"/>
<text x="397" y="161" fill="var(--color-bright)" font-size="17" text-anchor="middle" font-weight="700">20</text>
<text x="397" y="212" fill="var(--color-muted)" font-size="15" text-anchor="middle">5</text>
<text x="24" y="236" fill="var(--color-bright)" font-size="17" text-anchor="start" font-weight="600">Prepayment in year 2</text>
<text x="456" y="236" fill="var(--color-muted)" font-size="16" text-anchor="end">WAL: 1.8 years</text>
<line x1="48" y1="342" x2="448" y2="342" stroke="var(--color-line)" stroke-width="1"/>
<text x="39" y="347" fill="var(--color-muted)" font-size="14" text-anchor="end">0</text>
<line x1="48" y1="308" x2="448" y2="308" stroke="var(--color-line)" stroke-width="1"/>
<text x="39" y="313" fill="var(--color-muted)" font-size="14" text-anchor="end">40</text>
<line x1="48" y1="274" x2="448" y2="274" stroke="var(--color-line)" stroke-width="1"/>
<text x="39" y="279" fill="var(--color-muted)" font-size="14" text-anchor="end">80</text>
<rect x="64" y="325" width="42" height="17" rx="3" fill="var(--color-signal)"/>
<text x="85" y="315" fill="var(--color-bright)" font-size="17" text-anchor="middle" font-weight="700">20</text>
<text x="85" y="366" fill="var(--color-muted)" font-size="15" text-anchor="middle">1</text>
<rect x="142" y="274" width="42" height="68" rx="3" fill="var(--color-signal)"/>
<text x="163" y="264" fill="var(--color-bright)" font-size="17" text-anchor="middle" font-weight="700">80</text>
<text x="163" y="366" fill="var(--color-muted)" font-size="15" text-anchor="middle">2</text>
<text x="241" y="332" fill="var(--color-bright)" font-size="17" text-anchor="middle" font-weight="700">0</text>
<text x="241" y="366" fill="var(--color-muted)" font-size="15" text-anchor="middle">3</text>
<text x="319" y="332" fill="var(--color-bright)" font-size="17" text-anchor="middle" font-weight="700">0</text>
<text x="319" y="366" fill="var(--color-muted)" font-size="15" text-anchor="middle">4</text>
<text x="397" y="332" fill="var(--color-bright)" font-size="17" text-anchor="middle" font-weight="700">0</text>
<text x="397" y="366" fill="var(--color-muted)" font-size="15" text-anchor="middle">5</text>
<text x="240" y="397" fill="var(--color-paper)" font-size="15" text-anchor="middle">Years · same total principal of 100 CU</text>
</svg>
<figcaption>Fictional contract: principal 100, scheduled amortisation of 20 per year over five years. Paying the balance in year 2 moves 60 CU from later years to that date. Principal bars use identical scales and exclude interest. WAL weights dates by principal repaid. l0g calculations. <a href="https://libertystreeteconomics.newyorkfed.org/2014/03/convexity-event-risks-in-a-rising-interest-rate-environment/">Mechanism: New York Fed</a>.</figcaption>
</figure>

**Weighted-average life**, or WAL, weights each date by the principal repaid. Scheduled WAL is **3 years**: (20 × 1 + 20 × 2 + 20 × 3 + 20 × 4 + 20 × 5) / 100. With prepayment it becomes **1.8 years**: (20 × 1 + 80 × 2) / 100. WAL describes the timing of principal. Duration measures price sensitivity to yields and uses different weights and assumptions.

## Understand asymmetric interest-rate exposure

When refinancing rates fall sufficiently, some borrowers repay early. Investors then recover principal when new investments may offer lower yields. When rates rise, borrowers may retain their attractive existing loans for longer, extending the investor’s exposure to coupons that have become low relative to the market.

The borrower’s option can produce **negative convexity**, especially where refinancing behaviour is particularly sensitive to rates. Prepayments restrain price appreciation, while rising rates can extend duration. The [New York Fed explains the mechanism and its hedging implications](https://libertystreeteconomics.newyorkfed.org/2014/03/convexity-event-risks-in-a-rising-interest-rate-environment/).

A holder targeting stable duration may offset extension by selling duration through Treasuries or paying fixed in an interest-rate swap. The market effect depends on the amount hedged, other holders’ behaviour and available depth. The [swap guide](/en/guides/read-interest-rate-swaps/) explains the relevant cash-flow exchanges. A self-reinforcing hedging episode is a conditional scenario that requires evidence about positions and transactions.

## Examine the pool and the valuation model

The MBS coupon, underlying mortgage rates, loan ages, balances and repayment history help describe refinancing exposure. The same market-rate decline may have different effects depending on household costs and how many eligible borrowers have already refinanced. [Peristiani’s research on prepayment instability](https://www.newyorkfed.org/research/staff_reports/research_papers/9804.html) highlights the difficulty of modelling these behaviours.

An **option-adjusted spread**, or OAS, depends on the yield curve, rate scenarios and prepayment model. Compare assumptions before comparing estimates. Numerical precision can conceal substantial model uncertainty; the [credit-spread guide](/en/guides/read-credit-spreads-oas/) places OAS alongside other spread measures.

Liquidity adds another dimension. In **to-be-announced**, or TBA, trading, parties first agree on standardised characteristics; specific pools are designated later under the delivery rules. [Vickery and Wright](https://www.newyorkfed.org/research/epr/2013/1212vick.html) examine how this organisation supports agency MBS liquidity. Standardisation facilitates trading while economically relevant differences between pools remain.

## Sources and limitations

The two examples deliberately separate a household’s refinancing choice from an investment’s cash-flow schedule. Their balances and rates are assumed, and all calculations are reproducible. Defaults, servicing fees, remittance delays and option valuation are excluded. A real security requires those elements to be restored and its particular guarantee to be checked. A robust reading connects loan characteristics, plausible borrower behaviour and the model’s assumptions.
