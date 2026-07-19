---
title: "Reading CLOs and leveraged loans: tranches, waterfall and real risks"
description: "A reference guide to leveraged loans and CLOs: the raw material (syndicated floating-rate loans, often cov-lite), the mechanics of tranched securitization from AAA to equity, the payment waterfall and protection tests, the decisive distinction from the 2008 subprime CDOs, the real risks (floating rate, weak covenants, restructurings that mask defaults), and the rising rivalry with private credit. A market of over $1 trillion, decoded."
summary: "A leveraged loan is a syndicated, floating-rate credit to an already-indebted, sub-investment-grade company. CLOs pool hundreds of these loans and issue tranches of graded risk, from the AAA paid first to the equity that absorbs the first losses. The leading buyer of this $1 trillion-plus market, the CLO held up better than the subprime CDO in 2008, but concentrates today's corporate credit risk. Reading it requires understanding the waterfall, overcollateralization tests, the erosion of covenants, and the restructurings that mask the true default rate."
pubDate: 2026-07-11T14:00:00+02:00
updatedDate: 2026-07-11T14:00:00+02:00
sourceGuide: "lire-les-clo-et-prets-a-effet-de-levier"
sourceUpdatedDate: 2026-07-11T14:00:00+02:00
tags: ["credit", "securitization", "markets", "risk"]
category: marches
draft: false
---

*There is a machine that turns risky loans to indebted companies into AAA-rated bonds, seemingly as safe as a government's debt. This machine, the CLO, buys two-thirds of a market of more than $1 trillion, and it is regularly accused of being the next 2008. The accusation is partly unfair, partly deserved. Unfair, because the CLO came through the 2008 crisis without damage, exactly where its cousin the subprime CDO collapsed. Deserved, because it concentrates a major share of today's corporate credit risk, in an increasingly opaque market. This guide separates the legend from the mechanics.*

## The leveraged loan, the raw material

It all starts with the [leveraged loan](/glossaire/pret-a-effet-de-levier/). It is a credit granted to a company that is already indebted, whose credit rating is below investment grade. Three traits define it. It is syndicated: a bank arranges it, then sells shares to institutional investors. It is senior and secured: in a bankruptcy, its holders are repaid before other creditors, out of the collateral. And it is floating-rate, indexed to [SOFR](/glossaire/sofr/) plus a margin, which protects the lender from a rise in rates but strains the borrower when rates climb.

These loans finance the buyout economy: [LBOs](/glossaire/lbo/), acquisitions, refinancings. The U.S. market amounts to about $1.2 trillion. One momentous change has transformed it: the near-disappearance of covenants. A [cov-lite](/glossaire/cov-lite/) loan no longer requires the borrower to meet financial ratios tested regularly. Now the norm, these loans let a company sink for longer before default is recognized, at the cost of a lower recovery for creditors when the day comes.

## The CLO, a tranche factory

Alone, a leveraged loan is illiquid and risky. Pooled with hundreds of others in a [CLO](/glossaire/clo/), it changes nature. The CLO, for Collateralized Loan Obligation, is a [securitization](/glossaire/titrisation/) vehicle: it buys a portfolio of 150 to 300 loans, and funds that purchase by issuing its own securities, split into tranches of rising risk. It is the leading buyer of the leveraged loan market, absorbing about two-thirds of it.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 340" role="img" aria-label="The tranche structure of a CLO, from AAA to equity" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="340" fill="#0c0d10"></rect>
  <text x="32" y="34" fill="#f5f6f8" font-size="17" font-weight="700">A CLO waterfall: stacked tranches</text>
  <text x="32" y="55" fill="#8b909b" font-size="12">Payments flow down from the top, losses climb from the bottom.</text>
  <rect x="230" y="80" width="300" height="90" fill="#5eead4" opacity="0.85"></rect>
  <text x="380" y="115" fill="#0c0d10" font-size="13" font-weight="700" text-anchor="middle">Senior AAA</text>
  <text x="380" y="135" fill="#0c0d10" font-size="11" text-anchor="middle">paid first, lowest yield</text>
  <text x="380" y="152" fill="#0c0d10" font-size="11" text-anchor="middle">about 60% of the structure</text>
  <rect x="230" y="172" width="300" height="44" fill="#7aa2f7" opacity="0.85"></rect>
  <text x="380" y="192" fill="#0c0d10" font-size="12" font-weight="700" text-anchor="middle">Mezzanine AA-A</text>
  <text x="380" y="208" fill="#0c0d10" font-size="10.5" text-anchor="middle">intermediate yield</text>
  <rect x="230" y="218" width="300" height="44" fill="#f5b13d" opacity="0.85"></rect>
  <text x="380" y="238" fill="#0c0d10" font-size="12" font-weight="700" text-anchor="middle">Junior BBB-BB</text>
  <text x="380" y="254" fill="#0c0d10" font-size="10.5" text-anchor="middle">riskier, better paid</text>
  <rect x="230" y="264" width="300" height="46" fill="#ff4d87" opacity="0.9"></rect>
  <text x="380" y="284" fill="#0c0d10" font-size="12" font-weight="700" text-anchor="middle">Equity, first loss</text>
  <text x="380" y="300" fill="#0c0d10" font-size="10.5" text-anchor="middle">highest yield, absorbs the defaults</text>
  <text x="120" y="150" fill="#5eead4" font-size="11" font-weight="700" text-anchor="middle">Payments</text>
  <line x1="120" y1="160" x2="120" y2="270" stroke="#5eead4" stroke-width="2"></line>
  <polygon points="120,270 115,259 125,259" fill="#5eead4"></polygon>
  <text x="640" y="270" fill="#ff4d87" font-size="11" font-weight="700" text-anchor="middle">Losses</text>
  <line x1="640" y1="260" x2="640" y2="150" stroke="#ff4d87" stroke-width="2"></line>
  <polygon points="640,150 635,161 645,161" fill="#ff4d87"></polygon>
  <text x="32" y="330" fill="#8b909b" font-size="11">Indicative structure. Sources: S&amp;P Global Ratings, Moody's.</text>
</svg>
<figcaption>The loans' cash flows first repay the <strong>senior AAA</strong> tranche, then move down the waterfall. Defaults, in turn, hit the <strong>equity</strong> at the bottom first, which shields the tranches above in exchange for the highest yield. Sources: S&P Global, Moody's.</figcaption>
</figure>

The apparent magic of securitization lies in this hierarchy. Even if the portfolio is made of risky loans, diversification and the order of repayment mean the top tranche takes a loss only if a huge fraction of the loans default at once. That is what earns it a AAA rating, though none of the underlying loans would deserve one. The [equity](/glossaire/tranche/) tranche, at the bottom, plays the reverse role: it takes the first losses and absorbs the shock, in exchange for the highest yield.

## The waterfall and the protection tests

The heart of a CLO is its waterfall, the order in which money flows. Each quarter, the interest paid by the loans first covers fees and the senior tranche, then descends tranche by tranche, the equity receiving only the residual. Losses follow the reverse path, from the bottom up. This structure would be fragile without safeguards: the overcollateralization tests.

These tests continuously check that the value of the loans sufficiently exceeds that of the tranches. If too many loans are downgraded or default, a test fails, and the waterfall reconfigures automatically: money that went to the equity is diverted to prepay the senior tranche, until the cushion is rebuilt. The CLO manager must also respect limits, notably a cap on CCC-rated loans, often around 7.5% of the portfolio. Beyond it, the overload of very risky assets also triggers protective mechanisms. The CLO is therefore an actively managed vehicle with an internal firewall, two traits that set it apart from a static basket.

## A CLO is not a CDO: the lesson of 2008

This is the most widespread confusion, and it must be dispelled. The [CDO](/glossaire/cdo/) that blew up the system in 2008 shared the CLO's technique, tranched securitization, but not its raw material. The crisis CDOs were backed by subprime mortgages, heavily correlated with one another: when U.S. housing fell, all the loans deteriorated together, and diversification protected nothing. Worse, tranches of CDOs had been re-securitized into other CDOs, piling opacity on leverage.

The CLO, by contrast, is backed by loans to companies spread across dozens of sectors, whose troubles are less synchronized. The concrete result: during the 2008 crisis, no AAA CLO tranche took a loss, while subprime CDOs collapsed. This historical robustness is real and worth recalling against hasty comparisons. It has a limit, though: the past does not guarantee the future, and a shock hitting a large number of companies at once, a severe recession or a technological disruption, would test the diversification on which all confidence in the senior tranches rests.

## The real risks

Dismissing the new-subprime legend does not mean the CLO is danger-free. Its risks are simply different. The first is the floating rate: borrowing companies pay more when rates rise, eroding their ability to repay at the worst moment. The second is the erosion of covenants: the cov-lite norm delays the recognition of default and lowers recovery. The third is the most insidious, and it blurs the very reading of risk.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 290" role="img" aria-label="The traditional default rate understates credit stress" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="290" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Default no longer tells the whole story</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Why the traditional default rate understates credit stress, 2025-2026.</text>
  <line x1="40" y1="78" x2="680" y2="78" stroke="#2a2c33" stroke-width="1"></line>
  <text x="40" y="108" fill="#d6d9df" font-size="12.5">Payment default rate</text>
  <text x="330" y="112" fill="#5eead4" font-size="20" font-weight="700">~1.2%</text>
  <text x="470" y="108" fill="#8b909b" font-size="11.5">the reassuring figure (end-2025)</text>
  <line x1="40" y1="126" x2="680" y2="126" stroke="#2a2c33" stroke-width="1"></line>
  <text x="40" y="156" fill="#d6d9df" font-size="12.5">Share of restructurings (LMEs)</text>
  <text x="330" y="160" fill="#ff4d87" font-size="20" font-weight="700">~2/3</text>
  <text x="470" y="156" fill="#8b909b" font-size="11.5">of default activity by issuer</text>
  <line x1="40" y1="174" x2="680" y2="174" stroke="#2a2c33" stroke-width="1"></line>
  <text x="40" y="204" fill="#d6d9df" font-size="12.5">Recovery (cov-lite)</text>
  <text x="330" y="208" fill="#f5b13d" font-size="15" font-weight="700">falling</text>
  <text x="470" y="204" fill="#8b909b" font-size="11.5">less protection, less recovered</text>
  <line x1="40" y1="222" x2="680" y2="222" stroke="#2a2c33" stroke-width="1"></line>
  <text x="40" y="252" fill="#d6d9df" font-size="12.5">CCC loan cap</text>
  <text x="330" y="256" fill="#7aa2f7" font-size="15" font-weight="700">~7.5%</text>
  <text x="470" y="252" fill="#8b909b" font-size="11.5">beyond it, protections trigger</text>
  <text x="32" y="282" fill="#8b909b" font-size="11">Sources: S&amp;P Global Ratings, Moody's, PineBridge.</text>
</svg>
<figcaption>The reported default rate, around <strong>1.2%</strong>, looks benign. But <strong>negotiated restructurings</strong> (LMEs), which push default back without avoiding it, now make up two-thirds of distress activity. The reassuring figure masks real stress. Sources: S&P Global, Moody's.</figcaption>
</figure>

This third risk is that of [negotiated restructurings](/glossaire/lme/), or LMEs, for liability management exercises. Rather than defaulting openly, a struggling company swaps its debt, extends its maturities or grants collateral to some creditors at the expense of others. The traditional default rate thus stays deceptively low, around 1.2% at end-2025, while these manoeuvres now make up the bulk of distress activity. In other words, the most-watched statistic understates the real stress in leveraged credit. A CLO can show few defaults while holding loans in silent restructuring.

## The rivalry with private credit

The leveraged loan market, known as syndicated or BSL, no longer lives alone. It now faces [private credit](/en/guides/read-private-credit-risk/), that is, direct loans made by funds without going through bank syndication. This competitor, long confined to mid-sized companies, has grown to rival the syndicated market in size, and CLOs backed by these direct loans (middle-market CLOs) are the fastest-growing segment.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 300" role="img" aria-label="Sizes of the leveraged credit markets" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="300" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">A market over $1 trillion, and a rival</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Indicative sizes of the leveraged credit markets, 2025-2026.</text>
  <text x="40" y="90" fill="#d6d9df" font-size="12">Syndicated leveraged loans (BSL)</text>
  <rect x="40" y="100" width="600" height="20" fill="#2a2c33"></rect>
  <rect x="40" y="100" width="600" height="20" fill="#5eead4" opacity="0.9"></rect>
  <text x="560" y="115" fill="#0c0d10" font-size="11" font-weight="700" text-anchor="end">~$1.2tn</text>
  <text x="40" y="140" fill="#d6d9df" font-size="12">CLOs backed by BSL</text>
  <rect x="40" y="150" width="600" height="20" fill="#2a2c33"></rect>
  <rect x="40" y="150" width="315" height="20" fill="#7aa2f7" opacity="0.9"></rect>
  <text x="363" y="165" fill="#7aa2f7" font-size="11" font-weight="700">over $600bn</text>
  <text x="40" y="190" fill="#d6d9df" font-size="12">Private credit / direct lending</text>
  <rect x="40" y="200" width="600" height="20" fill="#2a2c33"></rect>
  <rect x="40" y="200" width="560" height="20" fill="#f5b13d" opacity="0.9"></rect>
  <text x="520" y="215" fill="#0c0d10" font-size="11" font-weight="700" text-anchor="end">comparable to BSL</text>
  <text x="40" y="240" fill="#d6d9df" font-size="12">Middle-market CLOs</text>
  <rect x="40" y="250" width="600" height="20" fill="#2a2c33"></rect>
  <rect x="40" y="250" width="80" height="20" fill="#ff4d87" opacity="0.9"></rect>
  <text x="128" y="265" fill="#ff4d87" font-size="11" font-weight="700">~$150bn, growing fast</text>
  <text x="32" y="292" fill="#8b909b" font-size="11">Sources: Moody's, S&amp;P Global, PitchBook. Orders of magnitude.</text>
</svg>
<figcaption>The syndicated market remains the largest, but <strong>private credit</strong> has reached a comparable size, and <strong>middle-market CLOs</strong> backed by direct loans are the most dynamic segment. Competition for good deals loosens terms everywhere. Sources: Moody's, S&P Global, PitchBook.</figcaption>
</figure>

This rivalry has a perverse effect. To win the best borrowers, syndicated and private lenders wage a race to the bottom on flexibility: even lighter covenants, interest paid in kind rather than cash ([PIK](/en/glossary/pik/)), more permissive documentation. The risk does not disappear, it shifts and hides. We explored the private side of this dynamic in our article on [private credit's two prices](/posts/credit-prive-un-actif-deux-prix/) and our [private credit guide](/en/guides/read-private-credit-risk/). The CLO and the private-debt fund are two slopes of the same mountain of leveraged corporate debt.

## Reading a CLO in practice

To judge a CLO, several dials combine. The price of the underlying loans on the secondary market, tracked by indices such as the Morningstar LSTA, gives the general sentiment on leveraged credit. The cushion in the overcollateralization tests says the margin before a tranche is affected. The share of CCC-rated loans signals the portfolio's quality drift. The proportion of cov-lite loans measures the weakness of protections. And above all, the default rate must be read alongside the restructuring rate, because the former alone now lies by omission. The quality of the manager, finally, matters, since it is the manager who steers the portfolio under stress.

A balanced conclusion is in order. The CLO is not the CDO of 2008, and saying so serves the truth. But it concentrates the credit risk of an unprecedented corporate-debt cycle, in structures that few end investors truly understand, and in a market where the sovereign statistic, the default rate, has become misleading. The past resilience of senior tranches is a fact; the growing fragility of the raw material is another. Reading a CLO means holding both at once.

## Sources and further reading

- [Moody's Ratings, 2026 leveraged finance and CLO outlooks](https://www.moodys.com/web/en/us/insights/credit-risk/outlooks/global-leveraged-finance-and-clos.html): market sizes, issuance and default trends.
- [S&P Global Ratings, U.S. leveraged finance quarterly update](https://www.spglobal.com/ratings/en/regulatory/article/us-leveraged-finance-q1-2026-update-encouraging-discipline-in-recent-deals-lingering-default-risk-in-legacy-vintages-s101683653): discipline in recent deals and risk in older vintages.
- [PineBridge Investments, "2026 Leveraged Finance Outlook"](https://www.pinebridge.com/en/insights/2026-leveraged-finance-outlook): the place of restructurings (LMEs) in default activity.
- [Congressional Research Service, "Leveraged Loans and Collateralized Loan Obligations"](https://www.congress.gov/crs_external_products/IN/PDF/IN11421/IN11421.2.pdf): mechanics and financial-stability issues.
- l0g, [Private credit: one asset, two prices](/posts/credit-prive-un-actif-deux-prix/) and [The silent contagion of private credit](/posts/la-contagion-silencieuse-credit-prive/).
- Related guides: [Reading private credit risk](/en/guides/read-private-credit-risk/) and [Reading credit spreads](/en/guides/read-credit-spreads-oas/).
</content>
