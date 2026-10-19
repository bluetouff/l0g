---
title: "Margin calls: collateral and liquidity spirals"
description: "Distinguish initial margin, variation margin and financing haircuts. Calculate a funding shortfall and the asset sales required under explicit assumptions."
summary: "Margins and haircuts protect counterparties against losses while creating time-specific liquidity needs. A fall in collateral value or a higher haircut reduces borrowing capacity and can require cash mobilisation or asset sales."
pubDate: 2026-10-19T10:40:00+02:00
sourceGuide: "comprendre-les-appels-de-marge-et-le-collateral"
sourceUpdatedDate: 2026-10-19T10:40:00+02:00
tags: ["liquidity", "collateral", "derivatives", "risk"]
category: marches
draft: false
---

A position can retain positive net value while requiring an immediate payment its holder struggles to fund. The gap between portfolio value and cash available before a settlement deadline depends on timing and collateral eligibility. Margin calls make that constraint visible.

This guide distinguishes the mechanisms before bringing them together in a funding-risk analysis. Its numerical case is **hypothetical**, covering a secured position in millions of currency units (CU million). Haircuts are teaching assumptions, rather than representations of a regulatory requirement or a particular market convention.

## Identify the protection being required

**Variation margin** settles or collateralises changes in an exposure’s value under the relevant agreement. **Initial margin** addresses potential losses during the period needed to close or replace a position after default. Their different purposes explain why a variation payment can coexist with an additional initial-margin requirement. The [CPMI-IOSCO principles for financial market infrastructures](https://www.bis.org/committees/cpmi/pfmi/overview) set out the role of collateral and central-counterparty margins.

In secured financing, a **haircut** reduces the collateral value used to determine the loan amount. Under our convention, a 10% haircut on collateral worth 100 permits borrowing of 90. The mechanism provides protection, but its exact calculation must follow the contract. The [repo guide](/en/guides/read-repo-market-sofr/) explains the relevant financing transactions.

Central clearing organises exposures and default management. It also requires members to deliver the right eligible asset, in the right currency, on time. For uncleared derivatives, [BCBS-IOSCO standards](https://www.bis.org/committees/bcbs/basel-framework/standard/mgn?allChapters=true) establish a separate framework, whose application depends on the relevant rules and agreements.

## Calculate the reduction in borrowing capacity

The initial position holds **100 CU million of collateral**, funded by **90 of debt** and **10 of equity**. Permitted debt equals **(1 − haircut) × collateral value**. Now assume the price falls **5%** and the haircut rises from **10% to 20%**. Collateral is worth 95 and debt capacity falls to **76**, calculated as 0.80 × 95.

With debt still at 90, the holder must reduce financing by **14 CU million**, or provide enough additional eligible collateral under the lender’s terms. The position’s net value before costs and transactions remains **5**: 95 − 90. The funding shortfall of 14 and value loss of 5 answer different questions.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 370" role="img" aria-labelledby="premium-margin-en-title premium-margin-en-desc" style="display:block;width:100%;max-width:600px;height:auto;margin-inline:auto;font-family:var(--font-read);background:var(--color-surface);border:1px solid var(--color-line);border-radius:12px">
<title id="premium-margin-en-title">Borrowing capacity contracts</title>
<desc id="premium-margin-en-desc">Hypothetical before/after shock, CU million. Capacity = (1 − haircut) × collateral. Price falls 5%, the haircut rises from 10% to 20%, and debt remains 90 before adjustment. Common scale: the rose segment is the funding shortfall of 14. l0g calculations.</desc>
<text x="24" y="32" fill="var(--color-bright)" font-size="22" text-anchor="start" font-weight="700">Borrowing capacity contracts</text>
<text x="24" y="56" fill="var(--color-muted)" font-size="14" text-anchor="start">Fictional position · currency units, millions</text>
<text x="24" y="94" fill="var(--color-bright)" font-size="18" text-anchor="start" font-weight="600">Collateral: 100</text>
<text x="456" y="94" fill="var(--color-muted)" font-size="16" text-anchor="end">Haircut 10%</text>
<rect x="24" y="112" width="388.8" height="32" rx="3" fill="var(--color-signal)"/>
<rect x="412.8" y="112" width="43.2" height="32" rx="3" fill="var(--color-amber)"/>
<text x="36" y="134" fill="var(--color-surface)" font-size="16" text-anchor="start" font-weight="700">Capacity 90</text>
<text x="434.4" y="134" fill="var(--color-surface)" font-size="16" text-anchor="middle" font-weight="700">10</text>
<text x="24" y="199" fill="var(--color-bright)" font-size="18" text-anchor="start" font-weight="600">Collateral: 95</text>
<text x="456" y="199" fill="var(--color-muted)" font-size="16" text-anchor="end">Haircut 20%</text>
<rect x="24" y="217" width="328.32" height="32" rx="3" fill="var(--color-signal)"/>
<rect x="352.32" y="217" width="82.08" height="32" rx="3" fill="var(--color-amber)"/>
<text x="36" y="239" fill="var(--color-surface)" font-size="16" text-anchor="start" font-weight="700">Capacity 76</text>
<text x="393.36" y="239" fill="var(--color-surface)" font-size="16" text-anchor="middle" font-weight="700">19</text>
<line x1="175" y1="154" x2="175" y2="186" stroke="var(--color-muted)" stroke-width="2"/><polygon points="175,186 179,179 171,179" fill="var(--color-muted)"/>
<text x="190" y="177" fill="var(--color-paper)" font-size="15" text-anchor="start">Price −5% · haircut +10 pp</text>
<rect x="24" y="276" width="388.8" height="32" rx="3" fill="none" stroke="var(--color-muted)"/>
<rect x="352.32" y="276" width="60.48" height="32" rx="2" fill="var(--color-accent)"/>
<text x="36" y="298" fill="var(--color-paper)" font-size="16" text-anchor="start">Outstanding debt: 90</text>
<text x="382.56" y="298" fill="var(--color-surface)" font-size="17" text-anchor="middle" font-weight="700">14</text>
<line x1="352.32" y1="249" x2="352.32" y2="312" stroke="var(--color-muted)" stroke-width="1" stroke-dasharray="4 5"/>
<text x="24" y="343" fill="var(--color-bright)" font-size="18" text-anchor="start" font-weight="600">Repayment due: 90 − 0.80 × 95 = 14</text>
</svg>
<figcaption>Hypothetical before/after shock, CU million. Capacity = (1 − haircut) × collateral. Price falls 5%, the haircut rises from 10% to 20%, and debt remains 90 before adjustment. Common scale: the rose segment is the funding shortfall of 14. l0g calculations. <a href="https://www.fsb.org/uploads/P101224-1.pdf">Liquidity framework: FSB</a>.</figcaption>
</figure>

Decompose the funding reduction in a specified order. Keeping the original 10% haircut, the lower price would permit debt of 85.5, a **4.5** reduction. Raising the haircut to 20% on collateral worth 95 removes another **9.5** of capacity. Together they explain the **14** shortfall. Reversing the sequence would allocate the interaction differently while reaching the same final borrowing limit.

## Solve for asset sales when cash is scarce

Transferring 14 from another liquidity pocket would repay the difference while preserving the collateral position. Selling part of that same collateral creates an additional constraint: each sale repays debt but also removes some of the remaining security. Both effects belong in the calculation.

Let x be sale proceeds applied entirely to debt repayment, with unchanged prices and no costs. The condition becomes **90 − x ≤ 0.80 × (95 − x)**, requiring **x ≥ 70**. Selling 70 leaves collateral of 25 and debt of 20, exactly an 80% financing ratio. Selling only 14 would leave collateral of 81 and debt of 76, against a borrowing limit of 64.8.

The difference between the cash transfer and the required sale illustrates balance-sheet contraction under leverage. In this case, net value of 5 survives because prices are assumed constant and trading is frictionless. Price impact, fees or further haircut changes would alter the result. The example describes a position, without claiming to represent the holder’s whole balance sheet or its other resources.

## Connect funding liquidity with market liquidity

**Funding liquidity** is the ability to obtain the resources needed to carry or settle a position. **Market liquidity** concerns trading an asset with limited transaction cost and price impact. Brunnermeier and Pedersen examine their interaction in [*Market Liquidity and Funding Liquidity*](https://www.princeton.edu/~markus/research/papers/liquidity.pdf), published in the *Review of Financial Studies* in 2009.

Their model provides a framework for a possible sequence: tighter financing, position reductions, reduced intermediation capacity and worsening market conditions. Establishing such a loop in a real episode requires evidence about calls, sales and available depth. High volatility and large margin requirements occurring together provide a clue, while a causal claim needs further support.

Variation payments transfer liquidity between participants. Recipients can have different uses, currencies, deadlines and reinvestment channels from those making the payments. Aggregate liquidity can therefore coexist with local shortages. The [BCBS-CPMI-IOSCO review of margining practices](https://www.bis.org/publications/review-margining-practices) examines movements during the March 2020 stress episode.

## Build a usable liquidity schedule

Start with obligations: amount, deadline, currency, eligible asset and counterparty. Match them against resources that can actually be mobilised, separating available cash, unencumbered assets, already pledged collateral and conditionally available credit lines. An asset pledged elsewhere cannot automatically fund a new call.

A stress scenario should combine factors that could occur together: price changes, higher initial margin, haircuts, withdrawal of financing and transfer delays. The [FSB’s final report on liquidity preparedness](https://www.fsb.org/uploads/P101224-1.pdf) addresses governance, scenario design and collateral management. An operational assessment also specifies authorised staff, accounts and mobilisation times.

This extends the guides to [interest-rate swaps](/en/guides/read-interest-rate-swaps/) and [ETFs](/en/guides/read-etfs-creation-redemption-arbitrage/). An economically sensible hedge or attractive arbitrage can still require intermediate financing. Resilience depends on the path of payments as well as their final balance.

## Sources and limitations

Standards establish protective objectives; research and policy reports investigate their interaction with liquidity. The financing case is a balance-sheet calculation with unchanged debt before adjustment, divisible collateral, fixed prices and no costs. It calibrates no real institution. Conclusions about solvency or resilience would require the complete balance sheet, contractual terms and effective access to resources.
