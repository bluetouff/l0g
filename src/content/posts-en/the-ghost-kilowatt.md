---
title: "The ghost kilowatt: who pays for the grid if the data center never arrives?"
description: "The White House pledge says data centers will pay for their grid. US tariffs reveal the real mechanism: minimum payments, collateral, stranded assets and the risk of shifting costs to other ratepayers."
pubDate: 2026-07-25T10:39:51+02:00
updatedDate: 2026-07-25T10:39:51+02:00
tags: ["ai", "data centers", "electricity", "infrastructure", "risk", "regulation", "us policy"]
draft: false
sourceArticle: "kilowatt-fantome-reseau-data-center"
sourceUpdatedDate: 2026-07-25
---

A data center says it will need 1,000 megawatts. The utility adds the load to its forecast, reserves capacity, reinforces lines and prepares new generation. Then the project is delayed, downsized, moved or abandoned. The electricity is never consumed, but part of the grid has already been planned or built.

That is the **ghost kilowatt**: announced demand that changes investment decisions before becoming actual consumption. The phrase is an analogy, not a regulatory category. The risk itself is documented. The Federal Energy Regulatory Commission, or FERC, warns that speculative requests and applications filed with several grids can be counted more than once, distort forecasts and send bad investment signals. The Department of Energy explicitly identifies [stranded-asset risk](/en/glossary/actif-echoue/) when infrastructure built for a large load is underused.

The question is therefore not only whether data centers will lift electricity demand. It is **who guarantees the bill before they consume**.

## A pledge is not a tariff

On 23 July 2026, the White House expanded its *Ratepayer Protection Pledge*. Its principle is straightforward: data centers should pay for the generation, delivery and grid upgrades they cause, even if they ultimately do not use the power they reserved. The [official page](https://www.whitehouse.gov/ratepayer-protection-pledge/) asks signatories to negotiate separate rate structures and pay for promised capacity whether they use it or not.

That announcement establishes a political doctrine. It does not, by itself, settle a utility bill. The page describes the rate structures as **voluntarily negotiated**. Protection for other ratepayers depends on less glamorous documents: a tariff approved by a state commission, an interconnection contract, a cost-recovery agreement, a parent guarantee, collateral and the rules applied after cancellation.

[Reuters](https://www.investing.com/news/stock-market-news/trump-pledge-on-data-center-power-supplies-draws-skepticism-4810938) reported scepticism about the voluntary nature of the pledge the next day. That concern is justified on one precise point: a national promise becomes enforceable only when it is written into the relevant tariff and contract.

## How a line or power plant enters the bill

A regulated utility does not charge only for electrons consumed. It also recovers operating expenses, depreciation, taxes and an allowed return on its [rate base](/en/glossary/rate-base/). A [Department of Energy baseline report](https://www.energy.gov/sites/prod/files/2017/01/f34/Electricity%20Distribution%20System%20Baseline%20Report.pdf) summarises the mechanism:

> revenue requirement = operating expenses + depreciation + taxes + rate of return × rate base

If a substation or line is built for a load that disappears, there are three possible outcomes.

1. The customer still pays through a [minimum-payment commitment](/en/glossary/take-or-pay/), an exit fee or callable collateral.
2. The utility and its shareholders absorb some or all of the loss if the regulator refuses recovery in rates.
3. The cost enters the rate base or network charges and is spread across other customers.

The third outcome is the transfer new large-load tariffs seek to prevent. But writing “pay if you cancel” is not enough. The contract must cover the right assets, for the right period, with the right legal entity.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 760 420" role="img" aria-label="Possible paths for the cost of a grid built for a data center that never arrives" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="760" height="420" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">The grid is built, the load disappears</text>
  <text x="32" y="61" fill="#8b909b" font-size="12">The contract determines where the unrecovered cost lands.</text>
  <rect x="244" y="88" width="272" height="60" rx="8" fill="none" stroke="#7aa2f7" stroke-width="1.5"></rect>
  <text x="380" y="114" fill="#e7e9ee" font-size="14" text-anchor="middle" font-weight="700">Committed assets</text>
  <text x="380" y="134" fill="#8b909b" font-size="11" text-anchor="middle">generation, substation, line, connection</text>
  <path d="M380 148V188 M380 188H136 M380 188H624 M136 188V218 M380 188V218 M624 188V218" fill="none" stroke="#5a5f6b" stroke-width="1.5"></path>
  <rect x="34" y="218" width="204" height="92" rx="8" fill="none" stroke="#5eead4" stroke-width="1.5"></rect>
  <text x="136" y="245" fill="#5eead4" font-size="13" text-anchor="middle" font-weight="700">Customer</text>
  <text x="136" y="267" fill="#d6d9df" font-size="10.5" text-anchor="middle">minimum payment</text>
  <text x="136" y="284" fill="#d6d9df" font-size="10.5" text-anchor="middle">collateral, exit fee</text>
  <text x="136" y="301" fill="#8b909b" font-size="10" text-anchor="middle">most direct protection</text>
  <rect x="278" y="218" width="204" height="92" rx="8" fill="none" stroke="#f5b13d" stroke-width="1.5"></rect>
  <text x="380" y="245" fill="#f5b13d" font-size="13" text-anchor="middle" font-weight="700">Utility / shareholders</text>
  <text x="380" y="267" fill="#d6d9df" font-size="10.5" text-anchor="middle">investment disallowed</text>
  <text x="380" y="284" fill="#d6d9df" font-size="10.5" text-anchor="middle">or partly recovered</text>
  <text x="380" y="301" fill="#8b909b" font-size="10" text-anchor="middle">regulatory prudence risk</text>
  <rect x="522" y="218" width="204" height="92" rx="8" fill="none" stroke="#ff4d87" stroke-width="1.5"></rect>
  <text x="624" y="245" fill="#ff4d87" font-size="13" text-anchor="middle" font-weight="700">Other ratepayers</text>
  <text x="624" y="267" fill="#d6d9df" font-size="10.5" text-anchor="middle">cost rolled into rates</text>
  <text x="624" y="284" fill="#d6d9df" font-size="10.5" text-anchor="middle">or network charges</text>
  <text x="624" y="301" fill="#8b909b" font-size="10" text-anchor="middle">the transfer to avoid</text>
  <text x="32" y="352" fill="#e7e9ee" font-size="11.5" font-weight="700">Decisive test</text>
  <text x="32" y="374" fill="#8b909b" font-size="11">Do the guarantees cover every incremental asset until repayment,</text>
  <text x="32" y="392" fill="#8b909b" font-size="11">with a solvent counterparty? Sources: DOE, FERC.</text>
</svg>
<figcaption>The political promise does not choose the path. The tariff, contract, collateral and regulator do. This diagram shows possible outcomes, not the observed allocation in a particular case.</figcaption>
</figure>

## The clearest filter is in Ohio

AEP Ohio's experience shows why utilities want to separate a serious project from an opportunistic reservation. According to the [utility's 13 February 2026 update](https://www.aepohio.com/company/news/view?releaseID=10753), it had received more than **30,000 MW** of expressions of interest or requests before the new tariff took effect. **13,022.7 MW** paid to enter the formal study process and **5,642 MW** then signed legally binding contracts backed by collateral.

These three numbers are not a cancellation rate: the stages, dates and perimeters are not identical. They nevertheless show the distance between stated demand, demand mature enough to fund a study and load backed by a legal commitment. Grid forecasts must stop treating those three levels of maturity as a single certainty.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 760 360" role="img" aria-label="Funnel of AEP Ohio data-center requests before and after qualification" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="760" height="360" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Ohio: from interest to contract</text>
  <text x="32" y="61" fill="#8b909b" font-size="12">Capacity reported by AEP Ohio, in MW.</text>
  <polygon points="76,92 684,92 618,150 142,150" fill="#7aa2f7" opacity="0.78"></polygon>
  <text x="380" y="119" fill="#0c0d10" font-size="15" text-anchor="middle" font-weight="800">&gt; 30,000 MW</text>
  <text x="380" y="140" fill="#0c0d10" font-size="10.5" text-anchor="middle">expressions of interest or requests</text>
  <polygon points="142,166 618,166 557,224 203,224" fill="#f5b13d" opacity="0.88"></polygon>
  <text x="380" y="193" fill="#0c0d10" font-size="15" text-anchor="middle" font-weight="800">13,022.7 MW</text>
  <text x="380" y="214" fill="#0c0d10" font-size="10.5" text-anchor="middle">paid formal study</text>
  <polygon points="203,240 557,240 498,298 262,298" fill="#5eead4" opacity="0.9"></polygon>
  <text x="380" y="267" fill="#0c0d10" font-size="15" text-anchor="middle" font-weight="800">5,642 MW</text>
  <text x="380" y="288" fill="#0c0d10" font-size="10.5" text-anchor="middle">binding contracts and collateral</text>
  <text x="32" y="332" fill="#8b909b" font-size="10.5">Source: AEP Ohio, 13 February 2026. The stages do not form a closed cohort.</text>
</svg>
<figcaption>At AEP Ohio, 5,642 MW had passed the contract and collateral filter. The funnel shows maturity, not a count of cancelled projects.</figcaption>
</figure>

The result is informative, but the source is the utility itself. The figures should therefore be read as its reported pipeline, not as an independent assessment of the tariff's effectiveness. The [Public Utilities Commission of Ohio](https://content.govdelivery.com/accounts/OHPUC/bulletins/3e8bb79) approved the mechanism in July 2025 and described protection against underused investment as its purpose.

## Virginia and Wisconsin: charging for the reservation

Virginia, the largest US data-center market, created a separate class for new very large loads. The [State Corporation Commission fact sheet](https://www.scc.virginia.gov/media/sccvirginiagov-home/about-the-scc/fact-sheets/scc-data-center-initiatives-02-2026.pdf) provides, from 1 January 2027, at least a **fourteen-year** commitment for affected new customers. Their minimum monthly payment must cover **85%** of reserved transmission and distribution costs, even if consumption is lower. Where credit is insufficient, collateral can reach **60%** of minimum payments over the contract term.

In Wisconsin, the Public Service Commission approved a regime in April 2026 for loads of at least **100 MW**. Its [official release](https://psc.wi.gov/Documents/PressReleases/04.24.2026PressRelease.PDF) requires a minimum **fifteen-year** term, removes an option that would have reserved only 75% of capacity and requires very large customers to pay **100% of the costs** allocated to them.

These regimes are not identical and their percentages are not directly comparable. They concern different components, thresholds and rate structures. Their common logic is nevertheless clear: charge for **reserved capacity**, not only energy consumed.

## The contract can still miss the wrong bill

The best counterexample comes from a FERC decision concerning an agreement between ComEd and Aligned Data Centers. The accepted agreement requires the customer to pay transmission charges even if its project is delayed or cancelled, or to pay a termination fee. It looks exactly like the intended protection.

Yet Commissioner Judy Chang identifies two limits in her [FERC concurrence](https://www.ferc.gov/news-events/news/commissioner-changs-concurrence-transmission-security-agreement-between). The agreement does not identify the specific upgrades it secures. And some network costs could be rolled into formula rates paid by all customers. If the assets are large, a bilateral contract can therefore coexist with higher charges for others.

The case gives the right editorial and regulatory test: **paying something after cancellation does not prove the customer pays everything it caused**.

In June 2026, FERC launched proceedings aimed at the large regional grids. Commissioner David Rosner said cost-recovery agreements should prevent a data center that never appears from leaving households with the bill. He also called for more transparency on speculative requests, physical site control and duplicate applications. In his [official remarks](https://www.ferc.gov/news-events/news/commissioner-rosners-remarks-large-load-show-cause-orders-e-7-e-12-june-18-2026), he describes these outcomes as the intended effect of the reforms. That is not yet evidence that every final tariff will achieve them.

## The risk changes address

A minimum-payment commitment and collateral do not eliminate risk. They move it from the collective pool of ratepayers to the customer's credit quality.

Protection is robust when:

- the signing entity is solvent or backed by a strong parent guarantee;
- collateral remains sufficient when project cost rises;
- the payment term matches the recovery period of the assets;
- exit fees cover equipment that cannot be reassigned;
- the contract follows the project through a sale, restructuring or developer change;
- the regulator separately identifies costs directly caused by the large load.

It is fragile when a thinly capitalised vehicle signs instead of the group, the deposit is capped too low, some upgrades are diluted into general transmission charges or the grid relies on projects still duplicated across several queues.

This shift into credit extends the risks already examined in [the debt financing AI](/en/analysis/the-debt-behind-ai/) and [the residual value guarantee](/en/analysis/residual-value-guarantee-ai-infrastructure-credit/). The difference matters: the potentially stranded asset is not only a GPU or a privately owned building. It is regulated infrastructure whose cost can enter a public utility bill.

## Evidence boundary

The sources establish four facts.

1. Regulators regard speculative, duplicate or insufficiently mature requests as a forecasting and cost problem.
2. Several states have created real contractual protections: minimum terms, billing for reserved capacity, collateral and exit fees.
3. AEP Ohio's pipeline narrows sharply as demand has to pay for a study and then sign a contract.
4. FERC acknowledges that a pay-after-cancellation contract may not cover every network reinforcement rolled into general rates.

They do not support a figure for a national bill already shifted to households. No harmonised public dataset yet links, project by project, announced load, committed assets, guarantees received, cancellation and final recovery. Claiming an aggregate amount would fabricate the missing data.

## Falsifiability

The hypothesis of a material ghost-kilowatt risk would weaken if regulators consistently published:

- a reconciliation of megawatts requested, studied, contracted and actually energised;
- the incremental cost of each asset and the financial security backing it;
- fees actually recovered after delay or cancellation;
- the absence of residual costs rolled into other customers' rates;
- verifiable reassignment of equipment initially built for an abandoned project.

Conversely, cancellations with fees below non-reassignable cost, or upgrades explicitly rolled into collective rates, would confirm the mechanism.

The White House pledge has therefore stated the right rule. State commissions and FERC now have to publish evidence of execution. The meaningful indicator will not be the number of signatures under a promise. It will be the dollars of infrastructure made unrecoverable by load that never materialised, and the identity of whoever ultimately paid them.

## Sources

1. [White House, *Ratepayer Protection Pledge*](https://www.whitehouse.gov/ratepayer-protection-pledge/), accessed 25 July 2026.
2. [White House, release announcing the pledge expansion](https://www.whitehouse.gov/releases/2026/07/president-trumps-ratepayer-protection-pledge-secures-american-ai-dominance-protects-consumers/), 23 July 2026.
3. [FERC, Commissioner David Rosner's remarks on large loads](https://www.ferc.gov/news-events/news/commissioner-rosners-remarks-large-load-show-cause-orders-e-7-e-12-june-18-2026), 18 June 2026.
4. [FERC, Commissioner Judy Chang's concurrence on the ComEd-Aligned agreement](https://www.ferc.gov/news-events/news/commissioner-changs-concurrence-transmission-security-agreement-between), 26 February 2026.
5. [FERC, Commissioner See's remarks on cost recovery](https://www.ferc.gov/news-events/news/commissioner-sees-remarks-large-load-show-cause-orders-e-7-e-12-june-18-2026-open), 18 June 2026.
6. [FERC, NYISO order, 195 FERC ¶ 61,216](https://www.ferc.gov/sites/default/files/2026-06/EL26-69-000.pdf), 18 June 2026.
7. [Department of Energy, *Electricity Rate Designs for Large Loads*](https://www.energy.gov/policy/articles/electricity-rate-designs-large-loads-evolving-practices-and-opportunities), 15 October 2025.
8. [Department of Energy, *Electricity Distribution System Baseline Report*](https://www.energy.gov/sites/prod/files/2017/01/f34/Electricity%20Distribution%20System%20Baseline%20Report.pdf), 2016.
9. [AEP Ohio, data-center request update](https://www.aepohio.com/company/news/view?releaseID=10753), 13 February 2026.
10. [Public Utilities Commission of Ohio, approval of the data-center tariff](https://content.govdelivery.com/accounts/OHPUC/bulletins/3e8bb79), 9 July 2025.
11. [Virginia State Corporation Commission, *Data Center Initiatives*](https://www.scc.virginia.gov/media/sccvirginiagov-home/about-the-scc/fact-sheets/scc-data-center-initiatives-02-2026.pdf), February 2026.
12. [Public Service Commission of Wisconsin, approval of large-load tariffs](https://psc.wi.gov/Documents/PressReleases/04.24.2026PressRelease.PDF), 24 April 2026.
13. [Reuters, scepticism around the pledge](https://www.investing.com/news/stock-market-news/trump-pledge-on-data-center-power-supplies-draws-skepticism-4810938), 24 July 2026.
