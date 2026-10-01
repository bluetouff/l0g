---
title: "Who runs DeFi’s front door?"
seoTitle: "DeFi gateways: fees, control and the MiCA review | l0g"
description: "ESMA proposes regulating access to DeFi. Follow interface fees, lending returns, liquidations and governance to understand who earns and who controls."
pubDate: "2026-10-01T18:14:17+02:00"
updatedDate: "2026-10-01T18:14:17+02:00"
tags: ["DeFi", "MiCA", "crypto", "risk", "Europe"]
draft: false
ogImage: "/illustrations/news/defi-gateways-access-2026-v1.jpg"
sourceArticle: "defi-intermediaires-acces-mica"
sourceUpdatedDate: "2026-10-01T18:14:17+02:00"
---

Connect a wallet, enter an amount, sign. The screen makes the transaction feel self-directed. Consider a hypothetical journey: a user chooses an app, swaps tokens and supplies some of the proceeds to a lending protocol. The user keeps the keys, while someone else has selected the products on display, prepared the transaction and perhaps set a fee.

[Decentralised finance, or DeFi](/en/glossary/defi/), uses programs running on a blockchain to organise exchanges and financing. A company can still provide the way into those programs. That relationship is the focus of a new European proposal: **on 30 September 2026, ESMA recommended creating a regulated service for access to DeFi** as part of the review of MiCA, the EU’s crypto-asset regulation. [1](#source-1)

As of 1 October, this remains a contribution to a potential reform. The Commission’s consultation closed on 30 September at 23:59 Central European Summer Time. The responses will inform reports and may lead to a legislative proposal. The final scope of an access service, its requirements and any implementation timetable have yet to be determined. [3](#source-3)

## A signature at the end of a commercial journey

A *smart contract* is a program deployed on a blockchain whose functions are called through transactions. An interface translates that machinery into usable buttons. It may find a swap route, calculate an indicative output or prepare a token-transfer approval. The wallet then presents the action for signing. [14](#source-14)[10](#source-10)

In this hypothetical non-custodial journey, assets move from the wallet into the protocol’s contracts. The interface operator organises access without necessarily holding the customer’s keys. Those functions can be technically separate and still have considerable economic importance. [10](#source-10)

Imagine two apps providing access to the same market. One highlights a lending pool; another favours a swap. They can display different warnings and order the results differently. Even when the underlying contracts are identical, presentation affects what the user understands and chooses. Our analytical starting point is to examine control over the journey, then trace control over the assets separately.

Aave documents direct interaction with its contracts for both supplying and withdrawing tokens. That route still requires knowing which function to call, at which address and under what market conditions. An interface earns part of its usefulness by reducing that work. The service can carry a price; the relevant questions concern its cost, its recipient and the limits of what it delivers. [10](#source-10)[11](#source-11)

The legal category depends on the actual activity. MiCA already defines services including custody, exchange, order execution and advice. Whether a firm holds private keys answers one particular question; its other functions also need to be examined. This article does not legally classify any of the named protocols or software products. [4](#source-4)

## The price of the button and the outcome of the trade

MetaMask’s FAQ states a **0.875% service fee for Swaps**, automatically included in each quote. Applied to a hypothetical fee base of $10,000, that amounts to $87.50. This is a documented example of revenue earned by facilitating access. It describes one published fee component, as checked on the research date, rather than the complete cost of a transaction. [9](#source-9)

Comparing two routes requires looking at what actually arrives at the destination. Market execution, costs already embedded in the quote and network charges all matter. Adding a fee for a second time when it is already included would overstate the bill. A slippage tolerance, which sets the acceptable execution deviation, is different again: a protective limit is not necessarily an amount paid. [9](#source-9)

Our numerical comparison uses **two entirely fictional quotes**, without attributing them to companies. Against a $10,000 reference input, route A has a $40 quote shortfall, an $87.50 interface fee and a $10 network cost. Its net reference value is $9,862.50. Route B has no interface fee, but a $160 quote shortfall and the same network cost. It ends at $9,830.

A delivers $32.50 more in this example. The exercise illustrates the information a customer needs: a complete comparison, using the same reference and the same point in time. The quote shortfall may reflect market conditions, pool charges or the order’s price impact; the model does not attribute it to the interface operator’s revenue. Network fees are valued in dollars and deducted for comparability, even when paid in a different asset.

Different remuneration across destinations can also create a commercial conflict. Consider a hypothetical interface paid by the protocols it selects: its interests could diverge from those of the customer. The relevant evidence would include commercial agreements, ranking criteria and routes excluded from consideration. MiCA already requires in-scope providers to publish pricing policies and manage conflicts of interest. The current debate also concerns how those responsibilities apply to newer access models. [5](#source-5)[6](#source-6)

## Someone pays the yield

The “supply” button deserves the same scrutiny. In a lending pool, supplied tokens are transferred into contracts that make them available to borrowers. Aave’s documentation links the supply rate to pool utilisation and governance parameters. Conditions change as transactions alter the pool. [10](#source-10)

Take a deliberately simple example. Suppliers contribute $1 million; borrowers use $800,000 for one year at a simple annual interest rate of 6%. The borrowers pay $48,000. If the protocol allocates 20% to its treasury, it retains $9,600 and attributes $38,400 to suppliers. Relative to their $1 million contribution, the supplier return is 3.84%.

Now add a fictional distributor charging 10% of the interest allocated to suppliers. It receives $3,840; suppliers keep $34,560, or **3.456% of their contribution**. The three recipients together receive exactly the $48,000 paid by borrowers. Passing through additional interfaces creates no additional interest income in this model.

<figure class="infographic" style="max-width:28rem;margin:2rem auto;padding-bottom:1.25rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 406" role="img" aria-labelledby="defi-en-interest-title defi-en-interest-desc" style="width:100%;height:auto">
<title id="defi-en-interest-title">$48,000: who receives what?</title>
<desc id="defi-en-interest-desc">Model · flows over one year. Suppliers : 34560 ; Protocol treasury : 9600 ; Distributor : 3840</desc>
<rect width="480" height="406" rx="12" fill="var(--color-surface)" />
<text x="28" y="40" text-anchor="start" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700">$48,000: who receives what?</text>
<text x="28" y="72" text-anchor="start" fill="var(--color-muted)" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400">Model · flows over one year</text>
<text x="28" y="116" text-anchor="start" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="400">Suppliers</text>
<rect x="28" y="128" width="216.00000000" height="18" fill="var(--color-signal)" />
<text x="452" y="146" text-anchor="end" fill="var(--color-signal)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700">34,560</text>
<text x="28" y="196" text-anchor="start" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="400">Protocol treasury</text>
<rect x="28" y="208" width="60.00000000" height="18" fill="var(--color-amber)" />
<text x="452" y="226" text-anchor="end" fill="var(--color-amber)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700">9,600</text>
<text x="28" y="276" text-anchor="start" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="400">Distributor</text>
<rect x="28" y="288" width="24.00000000" height="18" fill="var(--color-accent)" />
<text x="452" y="306" text-anchor="end" fill="var(--color-accent)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700">3,840</text>
<path d="M28 330 H328" stroke="var(--color-line-strong)" fill="none" />
<text x="28" y="358" text-anchor="middle" fill="var(--color-muted)" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400">0</text>
<text x="178" y="358" text-anchor="middle" fill="var(--color-muted)" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400">24</text>
<text x="328" y="358" text-anchor="middle" fill="var(--color-muted)" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400">$48k</text>
</svg>
<figcaption>l0g teaching model: $800,000 borrowed at 6% for one year; the treasury receives 20% of interest and the distributor 10% of supplier interest. All shares sum to the $48,000 paid. Constant $1 million supplied; net simple return of 3.456%. No live protocol rate is shown. Mechanism: <a href="#source-10">Aave documentation</a>. <a href="/data/defi-lending-model.csv">CSV assumptions and calculations</a>.</figcaption>
</figure>

These are not the parameters of any identified Aave market or distributor. The model assumes constant balances, an asset worth one dollar, no defaults, no interest compounding, no token incentives and no tax. Its purpose is to reconcile the flows: who pays, who takes a share and which amount is used as the fee base? Here, a charge of 10% of supplier interest equals 0.384 percentage point of contributed capital.

There is also the question of getting out. The example leaves only $200,000 available before loan repayments or fresh deposits. Requested withdrawals of $300,000 therefore exceed that liquidity by $100,000. Aave explains that withdrawals depend on unborrowed assets available in the pool and, where relevant, collateral constraints. Our example assumes neither a contractual queue nor a guaranteed waiting time. [11](#source-11)

Holding the keys allows a user to authorise transactions. Once tokens have been supplied to the pool, their availability depends on its operation. That is a concrete limit worth explaining before presenting access as entirely autonomous. [10](#source-10)[11](#source-11)

## Collateral and the liquidation boundary

Now consider the borrower. An overcollateralised lending protocol requires assets pledged as security. In the mechanism documented by Aave, a [health factor](/en/glossary/facteur-de-sante/) compares the value of that collateral, weighted by a liquidation threshold, with the debt. A position below 1 becomes eligible for liquidation. [12](#source-12)

Our second model uses $15,000 of collateral, $10,000 of debt and a hypothetical liquidation threshold of 80%. Its initial health factor is 1.20. The factor reaches the boundary of 1 when collateral falls to $12,500: a decline of **16.7%** is enough. The liquidation threshold is distinct from the limit that permits the initial borrowing; the model assumes the opening position was allowed.

At $12,000 of collateral, the health factor is 0.96. Suppose a liquidator repays $4,000 of debt in return for $4,200 of collateral, including a hypothetical 5% bonus. The remaining position has $7,800 of collateral and $6,000 of debt, bringing its health factor to 1.04. Net equity falls from $2,000 to $1,800. The $200 difference equals the liquidator’s gross bonus before execution costs.

<figure class="infographic" style="max-width:28rem;margin:2rem auto;padding-bottom:1.25rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 480" role="img" aria-labelledby="defi-en-health-title defi-en-health-desc" style="width:100%;height:auto">
<title id="defi-en-health-title">Before and after liquidation</title>
<desc id="defi-en-health-desc">Model · health factor (HF). Start · $15,000 / $10,000 : 1.2 ; Boundary · $12,500 / $10,000 : 1 ; Fall · $12,000 / $10,000 : 0.96 ; After · $7,800 / $6,000 : 1.04</desc>
<rect width="480" height="480" rx="12" fill="var(--color-surface)" />
<text x="28" y="40" text-anchor="start" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700">Before and after liquidation</text>
<text x="28" y="72" text-anchor="start" fill="var(--color-muted)" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400">Model · health factor (HF)</text>
<text x="28" y="116" text-anchor="start" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="400">Start · $15,000 / $10,000</text>
<rect x="28" y="128" width="240.00000000" height="18" fill="var(--color-signal)" />
<text x="452" y="146" text-anchor="end" fill="var(--color-signal)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700">1.20</text>
<path d="M228 126 V148" stroke="var(--color-amber)" stroke-width="2" fill="none" />
<text x="28" y="190" text-anchor="start" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="400">Boundary · $12,500 / $10,000</text>
<rect x="28" y="202" width="200.00000000" height="18" fill="var(--color-amber)" />
<text x="452" y="220" text-anchor="end" fill="var(--color-amber)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700">1.00</text>
<path d="M228 200 V222" stroke="var(--color-amber)" stroke-width="2" fill="none" />
<text x="28" y="264" text-anchor="start" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="400">Fall · $12,000 / $10,000</text>
<rect x="28" y="276" width="192.00000000" height="18" fill="var(--color-accent)" />
<text x="452" y="294" text-anchor="end" fill="var(--color-accent)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700">0.96</text>
<path d="M228 274 V296" stroke="var(--color-amber)" stroke-width="2" fill="none" />
<text x="28" y="338" text-anchor="start" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="400">After · $7,800 / $6,000</text>
<rect x="28" y="350" width="208.00000000" height="18" fill="var(--color-signal)" />
<text x="452" y="368" text-anchor="end" fill="var(--color-signal)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700">1.04</text>
<path d="M228 348 V370" stroke="var(--color-amber)" stroke-width="2" fill="none" />
<path d="M28 392 H328" stroke="var(--color-line-strong)" fill="none" />
<text x="28" y="420" text-anchor="middle" fill="var(--color-muted)" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400">0</text>
<text x="178" y="420" text-anchor="middle" fill="var(--color-muted)" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400">0.75</text>
<text x="328" y="420" text-anchor="middle" fill="var(--color-muted)" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400">1.5</text>
<text x="28" y="462" text-anchor="start" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="700">Amber marks: HF = 1</text>
</svg>
<figcaption>l0g teaching model: each label gives collateral followed by debt in dollars. HF = collateral × 80% / debt. Below 1, liquidation becomes possible. With $12,000 collateral, hypothetical repayment of $4,000 against $4,200 collateral, including a 5% gross bonus. Net equity falls by $200; execution costs are excluded. These parameters describe no current deployment. Mechanism: <a href="#source-12">Aave</a>. <a href="/data/defi-liquidation-model.csv">CSV assumptions and calculations</a>.</figcaption>
</figure>

The numbers explain a partial liquidation rather than replicate any live deployment. In the documented mechanism, a participant submits a liquidation transaction once the conditions are met. Eligibility depends in part on the valuation of the collateral; completion depends on execution on the network. An interface notification may help the user react, but a commercial alerting delay does not, by itself, extend the contract’s rules. [12](#source-12)

This gives a practical way to locate responsibility. An incorrect calculation on the screen, a faulty price input and a misunderstood liquidation rule arise at different points. The cause and each actor’s powers need to be reconstructed before drawing conclusions about legal liability or compensation.

## Public code can still have administrators

The next layer lies behind the contract. In architectures with administrative permissions, particular keys can change parameters, assign roles or trigger changes to the program’s logic. OpenZeppelin documents these arrangements and [*timelocks*](/en/glossary/timelock/), which impose a delay between scheduling an operation and executing it. They give users time to review a change. The actual configuration is deployment-specific. [13](#source-13)

Analysis therefore needs to identify the code version, the powers still active and the conditions for using them. Who can propose, approve and execute a change? One actor can hold several roles. Even with advance notice, a practical exit still requires liquidity and working access to the protocol. [13](#source-13)[11](#source-11)

Governance tokens add another layer. A working paper published by the ECB in March 2026 examines their holdings in four protocols. For **May 2023**, its Table 3 attributes 48% of AAVE tokens to the five largest holders, 59% of FORTH, 38% of MKR and 46% of UNI. This is a historical snapshot examined by the authors, not a regulatory classification of the protocols. [8](#source-8)[16](#source-16)

<figure class="infographic" style="max-width:28rem;margin:2rem auto;padding-bottom:1.25rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 420" role="img" aria-labelledby="defi-en-governance-title defi-en-governance-desc" style="width:100%;height:auto">
<title id="defi-en-governance-title">The five largest holders</title>
<desc id="defi-en-governance-desc">Share of tokens · May 2023. AAVE : 48 ; FORTH : 59 ; MKR : 38 ; UNI : 46</desc>
<rect width="480" height="420" rx="12" fill="var(--color-surface)" />
<text x="28" y="40" text-anchor="start" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700">The five largest holders</text>
<text x="28" y="72" text-anchor="start" fill="var(--color-muted)" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400">Share of tokens · May 2023</text>
<text x="28" y="116" text-anchor="start" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="400">AAVE</text>
<rect x="28" y="128" width="144.00000000" height="18" fill="var(--color-signal)" />
<text x="452" y="146" text-anchor="end" fill="var(--color-signal)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700">48 %</text>
<text x="28" y="186" text-anchor="start" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="400">FORTH</text>
<rect x="28" y="198" width="177.00000000" height="18" fill="var(--color-signal)" />
<text x="452" y="216" text-anchor="end" fill="var(--color-signal)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700">59 %</text>
<text x="28" y="256" text-anchor="start" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="400">MKR</text>
<rect x="28" y="268" width="114.00000000" height="18" fill="var(--color-signal)" />
<text x="452" y="286" text-anchor="end" fill="var(--color-signal)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700">38 %</text>
<text x="28" y="326" text-anchor="start" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="400">UNI</text>
<rect x="28" y="338" width="138.00000000" height="18" fill="var(--color-signal)" />
<text x="452" y="356" text-anchor="end" fill="var(--color-signal)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700">46 %</text>
<path d="M28 380 H328" stroke="var(--color-line-strong)" fill="none" />
<text x="28" y="408" text-anchor="middle" fill="var(--color-muted)" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400">0</text>
<text x="178" y="408" text-anchor="middle" fill="var(--color-muted)" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400">50</text>
<text x="328" y="408" text-anchor="middle" fill="var(--color-muted)" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400">100 %</text>
</svg>
<figcaption>Source: <a href="#source-8">Born et al., ECB WP 3208</a>, Table 3, page 25; Etherscan and authors’ calculations. Token share held by the five largest holders, observed in May 2023 and published in March 2026. Holdings do not measure votes cast or current governance. <a href="/data/defi-governance-may2023.csv">CSV data</a>.</figcaption>
</figure>

Those holdings describe neither votes actually cast nor the four protocols’ governance today. An address can aggregate customer assets; a beneficial owner can also use several addresses. The paper highlights identification difficulties. Token concentration is therefore evidence to complement with delegation arrangements, voting thresholds and administrative rights. [8](#source-8)

For an interface selecting a protocol, that distinction has economic significance. An attractive displayed rate says something about remuneration. Investigating control says something about the people or mechanisms that can change the conditions. Both enquiries matter, for different reasons.

## The responsibilities ESMA wants to attach to access

The proposal targets crypto-asset service providers, or CASPs, that organise access to protocols. ESMA envisages duties covering risk information, selection and routing, conflicts, due diligence and security. It also seeks greater clarity on full decentralisation. The paper specifies that open-source development and self-custody should not automatically constitute regulated intermediation; obligations would be proportionate to the control exercised. [2](#source-2)

Existing law already supplies part of the framework. MiCA Article 66 requires fair, clear information, risk warnings and accessible pricing policies. Article 72 addresses conflicts of interest. The proposed addition would need to fit alongside those duties and the existing categories of service. [4](#source-4)[5](#source-5)[6](#source-6)

ESMA also wants a narrow definition of the exemption for fully decentralised services, to reduce opportunities for circumvention. It suggests either a definition in MiCA or technical guidance under an enabling provision. This describes the direction of its recommendations; it does not determine the status of any particular app today. [2](#source-2) (§3.3, page 6)

That relationship matters when an app combines several activities. An exchange, access to lending and a blockchain-validation service can generate different revenues and risks. Staking, connected with network validation, needs to be examined separately from lending; ESMA also treats the activities separately in its response. [2](#source-2)

The product’s perimeter matters as well. An asset classified as a financial instrument may fall under rules other than MiCA. As for services provided in a fully decentralised way without an intermediary, ESMA specifically identifies interpretative differences it wants resolved. A brand, a fee or a code repository, viewed in isolation, is therefore insufficient for this article to determine a service’s legal status. [15](#source-15)[2](#source-2)

## A reassuring brand still needs to explain the risks

An access provider can become the identifiable point of contact: explaining a transaction, correcting a display or handling a complaint. That role can coexist with limited power over the underlying contracts. The useful information is then precise: what checks have been performed, what alerts can be issued and what powers are available during an incident?

A firm’s authorisation can nevertheless be mistaken for approval of everything it offers. ESMA warned about this “halo effect” in July 2025, when authorised providers also offered unregulated products or services. It called for their status to be made clear throughout the sales process. An intermediary’s authorisation is therefore no general certification of connected protocols or promise that invested capital will be returned. [7](#source-7)

There is an economic trade-off to examine too. In a scenario where every gateway bears a fixed cost of due diligence and monitoring, an operator with more customers can spread it more widely. That could favour larger interfaces or a narrower product catalogue. Conversely, clear requirements could make services more comparable and reduce uncertainty for entrants. These are plausible mechanisms, whose importance will depend on the eventual rules and observed costs.

Direct contract access remains an important counterpoint. A technically capable user can reduce dependence on a particular interface where the protocol and its architecture allow it, while taking back some of the checking and monitoring work. That is where the practical division between autonomy, commercial service and responsibility emerges. [10](#source-10)[11](#source-11)

For now, the decisive questions sit within a transaction’s journey: what net outcome is offered, who receives the fees, who can change the terms and who can actually act when something goes wrong? The European proposal seeks a framework for that front door. Economic analysis still has to follow the transaction through to the contracts, borrowers and collateral that determine what the user ultimately receives.

## Continue the investigation

Our [MiCA guide](/en/guides/decode-mica-crypto-regulation/) explains the regulatory categories. The investigation into [stablecoin dollars and redemption](/en/analysis/stablecoin-reserves-redemption-dollar/) follows the exit chain; our [CCIP analysis](/en/analysis/ccip-2-0-assets-rules-crypto-finance/) examines the relationship between technical transfers and financial rights.

## Sources and documents

<ol class="l0g-defi-sources">
<li id="source-1"><a href="https://www.esma.europa.eu/press-news/esma-news/esma-calls-changes-make-mica-clearer-safer-and-ready-emerging-services">ESMA : ESMA calls for changes to make MiCA clearer, safer and ready for emerging services</a>. Opening and sections on the perimeter and emerging services.</li>
<li id="source-2"><a href="https://www.esma.europa.eu/sites/default/files/2026-09/ESMA75-113276571-1721_Response_to_the_EC_consultation_MiCA_regulation_review.pdf">ESMA : Response to the EC consultation on the review of Regulation (EU) 2023/1114 (MiCA), ESMA75-113276571-1721</a>. Sections 3.3–3.4, pp.6–7; cost transparency p.12; staking/lending pp.13–14.</li>
<li id="source-3"><a href="https://finance.ec.europa.eu/regulation-and-supervision/consultations-0/targeted-consultation-review-mica-regulation_en">Commission européenne / European Commission : Targeted consultation on the review of MiCA Regulation</a>. Details; Why we are consulting.</li>
<li id="source-4"><a href="https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/mica/article-3-definitions">ESMA, Interactive Single Rulebook : MiCA, Article 3: Definitions</a>. Article 3(1)(15)–(17), (21), (23), (38).</li>
<li id="source-5"><a href="https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/mica/article-66-obligation-act-honestly-fairly">ESMA, Interactive Single Rulebook : MiCA, Article 66: Obligation to act honestly, fairly and professionally</a>. Article 66(1)–(4).</li>
<li id="source-6"><a href="https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/mica/article-72-identification-prevention">ESMA, Interactive Single Rulebook : MiCA, Article 72: Conflicts of interest</a>. Article 72(1)–(5).</li>
<li id="source-7"><a href="https://www.esma.europa.eu/press-news/esma-news/investors-should-consider-risks-unregulated-products-offered-regulated-crypto">ESMA : Investors should consider risks of unregulated products offered by regulated crypto assets entities</a>. Statement summary.</li>
<li id="source-8"><a href="https://www.ecb.europa.eu/pub/pdf/scpwps/ecb.wp3208~051a880042.en.pdf">ECB Working Paper Series; Alexandra Born, Zakaria Gati, Claudia Lambert, Mahvish Naeem, Antonella Pellicani : Who to regulate? Identifying actors within DeFi’s governance, WP 3208</a>. Table 3, p.25; methodological discussion on identifying holders.</li>
<li id="source-9"><a href="https://metamask.io/faqs">MetaMask : Frequently asked questions: Does MetaMask charge a fee on Swaps?</a>. Swaps fee FAQ.</li>
<li id="source-10"><a href="https://www.aave.com/help/supplying/supply-tokens">Aave : Supply Tokens</a>. Introduction; steps 3–4.</li>
<li id="source-11"><a href="https://aave.com/help/supplying/withdraw-tokens">Aave : Withdraw Tokens</a>. Introduction; steps 3 and 5.</li>
<li id="source-12"><a href="https://aave.com/help/borrowing/liquidations">Aave : Health Factor &amp; Liquidations</a>. Health factor; Liquidation process.</li>
<li id="source-13"><a href="https://docs.openzeppelin.com/contracts/5.x/access-control">OpenZeppelin : Contracts 5.x: Access Control</a>. Ownership; role-based access control; Delayed operation.</li>
<li id="source-14"><a href="https://ethereum.org/developers/docs/smart-contracts/">Ethereum.org : Introduction to smart contracts</a>. Definition and properties of smart contracts.</li>
<li id="source-15"><a href="https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/mica/article-2-scope">ESMA, Interactive Single Rulebook : MiCA, Article 2: Scope</a>. Article 2(4).</li>
<li id="source-16"><a href="https://www.ecb.europa.eu/pub/research/authors/profiles/alexandra-born.de.html">European Central Bank : Author profile: Alexandra Born</a>. Entry for WP 3208.</li>
</ol>

## Scope and method

Primary sources checked on 1 October 2026. ESMA’s 30 September proposal is distinct from MiCA law already in force; no adoption timetable for the proposed access service is asserted. Aave and MetaMask describe their own mechanisms and terms as checked on the research date. Governance figures were observed in May 2023 and published in a March 2026 working paper; they do not describe holdings in 2026.

Execution, lending and liquidation examples are teaching models with explicit assumptions. Lending uses one year of simple interest, constant balances, no defaults, incentives, compounding or tax. Liquidation assumes stable dollar debt, simultaneous collateral valuation and no network costs. Actual rules and parameters vary by deployment. The article recommends no investment and makes no legal classification of any named app.
