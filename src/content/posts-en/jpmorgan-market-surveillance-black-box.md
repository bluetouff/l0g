---
title: "After the fines: the black box inside JPMorgan market surveillance"
description: "Regulators required JPMorgan to conduct a retrospective review, hire an independent consultant, implement remediation and report progress. The contents remain absent from the public record. Part two explains sponsored access, the surveillance chain and the risk still open to measurement."
pubDate: 2026-07-31T14:30:00+02:00
updatedDate: 2026-07-31T14:30:00+02:00
tags: ["JPMorgan", "sponsored access", "trade surveillance", "CFTC", "Federal Reserve", "OCC", "governance", "operational risk"]
draft: false
sourceArticle: "jpmorgan-boite-noire-controle-marches"
sourceUpdatedDate: 2026-07-31
---

*Part one established the sequence: [manipulation admitted in 2020, surveillance gaps discovered in 2021 and coordinated sanctions in 2024](/en/analysis/jpmorgan-market-beyond-screen-order-surveillance/). It also set a necessary limit. Billions of order messages missing from JPMorgan's systems are not billions of abuses. They are billions of objects never tested by the scenarios intended to detect abuse.*

Part two starts after the fine. Orders from the Federal Reserve, Office of the Comptroller of the Currency and Commodity Futures Trading Commission required a retrospective review, a full list of trading venues, independent assessment, a corrective plan, progress reports and, for the CFTC, a final certification. As of 31 July 2026, the public sources consulted for this investigation disclose the obligations but not the work produced under them.

The issue is larger than an IT fault. A global dealer buys software, combines feeds from many markets and allows algorithmic clients to reach venues through different contractual arrangements. Control works only if every expected message arrives, every venue appears in the inventory and each detection test covers the relevant behaviour. Risk grows at the junctions.

## Sponsored access, delegated trading and retained control

On the venue called "DCM-1", JPMorgan attributed most missing messages to sponsored access trading by three significant algorithmic firms. The [CFTC records this explanation](https://www.cftc.gov/media/10721/Order05232024JPMorganSecuritiesLLC/download) without identifying the venue or the firms.

Sponsored access lets a client or intermediary send orders to a venue through a market member's access. Economically, the client originates the order. Routing, clearing, checks before trading and monitoring after trading can fall to different entities depending on the market and contract.

The rules reflect that detail. In securities markets overseen by the SEC, [Rule 15c3-5](https://www.sec.gov/rules-regulations/2011/06/risk-management-controls-brokers-or-dealers-market-access) requires the broker with market access to maintain financial and regulatory controls under its direct and exclusive control, subject to limited exceptions. It must also review their effectiveness regularly.

Futures rules are different. In a [2013 interpretation](https://www.cftc.gov/node/212621), the CFTC said a futures broker providing sponsored access to an executing firm is not, solely because it provides access, required under Regulation 1.73(a)(2)(iv) to screen the executing firm's customer orders. One shortcut therefore fails: sponsorship does not create universal responsibility for every control.

The distinction does not weaken the 2024 case. The CFTC sanctioned J.P. Morgan Securities under Regulation 166.3 for failing to supervise diligently. The proven failure involved ingesting and monitoring order messages. The client's economic identity did not make the data feeding JPMorgan's own surveillance optional.

## Every alert needs a complete chain

Electronic market surveillance is a chain, not one piece of software:

1. the venue creates messages for new orders, changes, cancellations and executions;
2. connectors transport those messages and put them into a common format;
3. an inventory links each venue, product, trading team and client to the correct control rules;
4. reconciliation compares the amount expected with the amount received;
5. detection tests search for suspicious patterns;
6. analysts examine alerts and record their decisions;
7. serious cases reach compliance staff, managers and, where appropriate, regulators.

In 2020, JPMorgan told the CFTC that it used three main alert types in the SMARTS software for spoofing and layering. [Order 20-69](https://www.cftc.gov/media/4826/enfjpmorganchaseorder092920/download) also describes quality checks and monthly reporting by trader, team, supervisor and region. Those controls came after data entry. A well-designed test never sees a message that failed to arrive.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 780 500" role="img" aria-label="Order-surveillance chain and the break identified at JPMorgan" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="780" height="500" fill="#0c0d10"/>
  <text x="34" y="40" fill="#f5f6f8" font-size="18" font-weight="700">AN ALERT EXISTS ONLY AFTER DATA ARRIVE</text>
  <text x="34" y="64" fill="#8b909b" font-size="12">Simplified electronic-surveillance chain and the break described by the CFTC.</text>
  <rect x="34" y="108" width="150" height="72" rx="6" fill="#15171c" stroke="#5eead4"/>
  <text x="109" y="137" fill="#5eead4" font-size="12" font-weight="700" text-anchor="middle">VENUE</text>
  <text x="109" y="158" fill="#d6d9df" font-size="10" text-anchor="middle">orders and executions</text>
  <line x1="184" y1="144" x2="232" y2="144" stroke="#5eead4" stroke-width="2"/>
  <polygon points="232,144 220,137 220,151" fill="#5eead4"/>
  <rect x="234" y="108" width="150" height="72" rx="6" fill="#21131a" stroke="#ff4d87" stroke-width="2"/>
  <text x="309" y="137" fill="#ff4d87" font-size="12" font-weight="700" text-anchor="middle">DATA INTAKE</text>
  <text x="309" y="158" fill="#d6d9df" font-size="10" text-anchor="middle">connector and format</text>
  <line x1="384" y1="144" x2="432" y2="144" stroke="#ff4d87" stroke-width="2" stroke-dasharray="6 5"/>
  <line x1="408" y1="119" x2="408" y2="169" stroke="#ff4d87" stroke-width="5"/>
  <text x="408" y="201" fill="#ff4d87" font-size="11" font-weight="700" text-anchor="middle">IDENTIFIED BREAK</text>
  <rect x="434" y="108" width="150" height="72" rx="6" fill="#15171c" stroke="#2a2c33"/>
  <text x="509" y="137" fill="#d6d9df" font-size="12" font-weight="700" text-anchor="middle">RECONCILIATION</text>
  <text x="509" y="158" fill="#8b909b" font-size="10" text-anchor="middle">expected vs received</text>
  <line x1="584" y1="144" x2="632" y2="144" stroke="#3a3d46" stroke-width="2"/>
  <polygon points="632,144 620,137 620,151" fill="#3a3d46"/>
  <rect x="634" y="108" width="112" height="72" rx="6" fill="#15171c" stroke="#2a2c33"/>
  <text x="690" y="137" fill="#d6d9df" font-size="12" font-weight="700" text-anchor="middle">TESTS</text>
  <text x="690" y="158" fill="#8b909b" font-size="10" text-anchor="middle">alerts</text>
  <line x1="690" y1="180" x2="690" y2="244" stroke="#3a3d46" stroke-width="2"/>
  <polygon points="690,244 683,232 697,232" fill="#3a3d46"/>
  <rect x="590" y="246" width="156" height="72" rx="6" fill="#15171c" stroke="#2a2c33"/>
  <text x="668" y="275" fill="#d6d9df" font-size="12" font-weight="700" text-anchor="middle">ANALYST</text>
  <text x="668" y="296" fill="#8b909b" font-size="10" text-anchor="middle">decision and referral</text>
  <rect x="34" y="258" width="476" height="126" rx="6" fill="#171a20" stroke="#f5b13d"/>
  <text x="58" y="289" fill="#f5b13d" font-size="13" font-weight="700">THE "GOLDEN SOURCE" ERROR</text>
  <text x="58" y="318" fill="#d6d9df" font-size="11">Direct venue feeds were excluded from quarterly reconciliation.</text>
  <text x="58" y="342" fill="#d6d9df" font-size="11">Accurate source data can be lost during configuration or transport.</text>
  <text x="58" y="366" fill="#d6d9df" font-size="11">Without an expected count, no alert necessarily exposes the absence.</text>
  <text x="34" y="434" fill="#d6d9df" font-size="11">The risk precedes the model: inventory, data path, connector and reconciliation.</text>
  <text x="34" y="458" fill="#8b909b" font-size="10">Sources: CFTC 24-07, sections II.C.2 and II.C.3; Fed 24-007-B-HC; OCC AA-EC-2023-50.</text>
</svg>
<figcaption>The break identified by the CFTC occurred when data were entering the system. Detection tests and analysts further downstream could not automatically compensate for a missing feed.</figcaption>
</figure>

## The golden-source assumption

JPMorgan reconciled some data every quarter but excluded feeds received directly from venues. The firm assumed exchange data were a *golden source* and did not need the same test.

The assumption mixed up two properties:

- accuracy of the data produced by the venue;
- completeness of the data arriving in JPMorgan's tool.

The first can be excellent while the second falls to zero. A wrong setting, an unrecognised product code, an incomplete connector or a rejected transformation can be enough. The CFTC identified feed-configuration problems as a cause of the gaps. It did not publish a breakdown of each type of failure.

Operational risk then becomes circular. The control system assumes its own input is complete. Without a separate test of that assumption, an empty alert dashboard looks reassuring. It can also mean no data arrived.

## Five CFTC reports and steps

The [23 May 2024 CFTC order](https://www.cftc.gov/media/10721/Order05232024JPMorganSecuritiesLLC/download) did more than impose a penalty. It required a precise sequence:

1. **a JPMorgan report** listing each affected venue and activity, the period, the volume not surveilled and any related market misconduct;
2. **an independent consultant's report** on policies, the venue inventory, reconciliation, detection tests, testing and previously unsurveilled activity;
3. **a remediation plan** responding to the consultant's findings and recommendations;
4. **quarterly progress reports** describing work completed, status and timing;
5. **a completion certification** signed by the chief compliance officer and another senior business executive.

The Commission may extend deadlines for good cause. Quarterly reporting ends only after the certification is submitted and accepted by the Division of Enforcement.

The [Fed order](https://www.federalreserve.gov/newsevents/pressreleases/files/enf20240314a1.pdf) follows a similar structure: an internal report, an independent party, a report to the board and Federal Reserve Bank of New York, an approved plan and quarterly updates. The review must cover the firm's own trading and client activity, board oversight, the venue inventory, automated reconciliation, detection tests and periodic testing.

The [OCC order](https://www.occ.gov/static/enforcement-actions/eaAA-EC-2023-50.pdf) also requires a lookback, a retrospective search through previously unsurveilled activity for misconduct not identified earlier. Its penalty order expressly preserves the possibility of an additional penalty based on the lookback results.

## JPMorgan's conclusion and no public audit

In its [second-quarter 2024 Form 10-Q](https://www.sec.gov/Archives/edgar/data/19617/000001961724000453/jpm-20240630.htm), JPMorgan said it had completed improvements to its venue inventory and data-completeness controls. Other remediation remained underway. The firm had retained the required independent consultant and paid approximately $450 million in coordinated penalties.

The filing also says its review of previously unsurveilled data identified no employee misconduct, no harm to clients and no harm to the market. The wording matters and should remain intact. It is JPMorgan's published conclusion.

It is not a published retrospective report or independent assessment. As of 31 July 2026, our searches of public CFTC, Fed and OCC pages and JPMorgan's SEC reports did not locate the content of those documents. The public therefore cannot compare:

- the method applied to billions of messages;
- the detailed venues, products and periods;
- the thresholds used to rebuild alerts;
- the consultant's recommendations;
- exceptions, limitations and validation tests;
- the status of any final certification accepted by the CFTC.

Non-publication does not mean the reports were not delivered to regulators. The orders require delivery. It means JPMorgan's conclusion cannot be reproduced from public material.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 780 510" role="img" aria-label="Map of public and non-public information on JPMorgan remediation" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="780" height="510" fill="#0c0d10"/>
  <text x="34" y="40" fill="#f5f6f8" font-size="18" font-weight="700">PUBLIC RECORD: EVIDENCE AND GAPS</text>
  <text x="34" y="64" fill="#8b909b" font-size="12">Document search as of 31 July 2026.</text>
  <rect x="34" y="98" width="338" height="328" rx="7" fill="#141a1a" stroke="#5eead4" stroke-width="2"/>
  <text x="58" y="132" fill="#5eead4" font-size="14" font-weight="700">PUBLIC</text>
  <text x="58" y="168" fill="#d6d9df" font-size="11">• broad period: 2014 to 2023</text>
  <text x="58" y="198" fill="#d6d9df" font-size="11">• at least 30 venues</text>
  <text x="58" y="228" fill="#d6d9df" font-size="11">• billions of messages on DCM-1</text>
  <text x="58" y="258" fill="#d6d9df" font-size="11">• more than 99% missing on DCM-1</text>
  <text x="58" y="288" fill="#d6d9df" font-size="11">• intake and reconciliation failure</text>
  <text x="58" y="318" fill="#d6d9df" font-size="11">• consultant's required scope</text>
  <text x="58" y="348" fill="#d6d9df" font-size="11">• JPMorgan's published conclusion</text>
  <text x="58" y="378" fill="#d6d9df" font-size="11">• penalties and credits</text>
  <rect x="408" y="98" width="338" height="328" rx="7" fill="#21131a" stroke="#ff4d87" stroke-width="2"/>
  <text x="432" y="132" fill="#ff4d87" font-size="14" font-weight="700">NOT FOUND IN PUBLIC MATERIAL</text>
  <text x="432" y="168" fill="#d6d9df" font-size="11">• identity of DCM-1</text>
  <text x="432" y="198" fill="#d6d9df" font-size="11">• identity of the three algorithmic firms</text>
  <text x="432" y="228" fill="#d6d9df" font-size="11">• breakdown by product and venue</text>
  <text x="432" y="258" fill="#d6d9df" font-size="11">• detailed lookback method</text>
  <text x="432" y="288" fill="#d6d9df" font-size="11">• independent consultant's report</text>
  <text x="432" y="318" fill="#d6d9df" font-size="11">• recommendations and exceptions</text>
  <text x="432" y="348" fill="#d6d9df" font-size="11">• quarterly progress reports</text>
  <text x="432" y="378" fill="#d6d9df" font-size="11">• accepted final certification</text>
  <text x="34" y="464" fill="#d6d9df" font-size="11">"Not found" is a document limit, not proof of non-existence.</text>
  <text x="34" y="486" fill="#8b909b" font-size="10">Sources searched: CFTC, Fed, OCC, SEC EDGAR and JPMorgan regulatory reports.</text>
</svg>
<figcaption>The right-hand column lists information absent from the public sources consulted. Regulators may hold it without having to publish it in full.</figcaption>
</figure>

## DCM-1 remains unnamed

The CFTC uses "DCM-1", shorthand for *designated contract market*, a regulated US futures venue. No exchange name appears in the order. Assigning one would be speculation.

The anonymity blocks several external checks. Without the venue, readers cannot compare the period with its rules, technical notices, feed incidents or disciplinary data. Without the products, concentration by asset class remains unknown. Without the algorithmic firms, their regulatory histories cannot be checked.

Silence may protect commercial information, clients or investigations. The order gives no specific public explanation. This investigation therefore retains DCM-1 and refuses to guess.

## Three unnamed algorithmic firms

JPMorgan described three "significant" algorithmic firms behind most sponsored activity on DCM-1. The adjective gives no volume, market share or risk measure.

Concentration among three clients nevertheless creates a clear mechanism. A misconfigured feed for a few very active producers can generate billions of missing messages. Automation explains the scale. It proves neither fraud nor loss, but makes a retrospective reconstruction harder and magnifies mistakes in the control perimeter.

Monitoring bank employees can also differ from monitoring high-frequency clients. Detection tests, identifiers, noise thresholds and referral methods need not be the same. The independent review was supposed to assess both proprietary and client trading, as well as detection thresholds. Its absence from public material prevents an external assessment of this distinction.

## No alert is not proof of no abuse

The teaching point has three parts:

1. a complete system can generate no alerts because no suspicious behaviour exists;
2. an incomplete system can generate no alerts because the necessary messages are missing;
3. alert counts become meaningful only after data completeness has been established.

This logic does not turn an unknown into suspicion. It fixes the order of proof. Completeness comes first, then threshold settings, human review and attribution of intent.

A [2025 thematic review by the International Organization of Securities Commissions](https://www.iosco.org/library/pubdocs/pdf/IOSCOPD786.pdf) states the principle for market authorities: access to orders, trades and cancellations is necessary for effective surveillance and market reconstruction. The report is not about JPMorgan. It confirms the general control logic.

Academic research reaches the same data requirement. Bao Linh Do and Tālis Putniņš identify order-book imbalances, order activity, abnormal cancellations and cyclical patterns among useful inputs in their [study of spoofing detection](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4525036). The paper proposes a method and makes no finding about DCM-1. Without complete order messages, those inputs cannot be reconstructed reliably.

## Four layers of risk

The case presents four different risks. Combining them produces either an excessive allegation or false reassurance.

**Conduct risk.** Manipulative behaviour can escape detection when its messages never enter the system. The public record does not show such behaviour in the missing feeds.

**Regulatory risk.** The CFTC, Fed and OCC have already imposed sanctions. The OCC order allows another penalty based on the lookback. Any new action would depend on new facts or inadequate remediation, neither established here.

**Operational risk.** An inventory, connector or reconciliation error can neutralise sophisticated detection tools. The problem lies in the path taken by data, not only in the alert model.

**Governance risk.** In 2020, the board and regulators received a detailed description of improvements. In 2021, the firm discovered a massive missing perimeter. The governance test is independent validation of coverage, not the number of written procedures.

This risk does not appear in quarterly earnings like a loan-loss provision. It resembles the market plumbing in our analysis of [repo and collateral](/en/analysis/repo-the-liquidity-factory/): infrastructure looks secondary until a break exposes every connection. Our guide to [bank earnings and risk](/en/analysis/q2-2026-bank-earnings-reading-the-risk/) likewise separates accounting performance, conduct and operational exposure.

## Five markers for follow-up

A long-running investigation needs falsifiable updates. Five events would change the assessment:

1. **a public lifting of new-venue onboarding restrictions** by the Fed or OCC;
2. **a completion certification accepted by the CFTC**, if the agency publishes it;
3. **a new action based on the lookback**, a possibility expressly preserved by the OCC;
4. **a more detailed JPMorgan disclosure** on reconstruction methods, the consultant or remediation status;
5. **a court decision or regulatory case** connecting specific conduct to an unsurveilled period and venue.

Until such evidence appears, only three conclusions are firm: the gap was massive, JPMorgan says it identified no harm, and the public lacks the reports needed to verify that conclusion independently.

## Limits of the public record

This investigation does not identify DCM-1 or try to infer its identity. It names none of the three algorithmic firms. It does not treat every cancellation as fraud. It does not turn a surveillance failure into manipulation.

It also does not add coordinated penalties as independent payments. The effective $448.168 million paid in 2024 is separate from the coordinated $920.204 million resolution in 2020, but each group has its own credits between agencies.

Finally, reports produced for regulators and consultants may contain confidential information. Their non-public status does not necessarily violate the orders. It limits the ability of readers, investors and researchers to audit the published conclusion.

## Primary sources

1. CFTC, [Order 24-07 on surveillance gaps](https://www.cftc.gov/media/10721/Order05232024JPMorganSecuritiesLLC/download), 23 May 2024.
2. Federal Reserve, [Orders 24-007-B-HC and 24-007-CMP-HC](https://www.federalreserve.gov/newsevents/pressreleases/files/enf20240314a1.pdf), 14 March 2024.
3. OCC, [Order AA-EC-2023-50](https://www.occ.gov/static/enforcement-actions/eaAA-EC-2023-50.pdf), 14 March 2024.
4. OCC, [penalty Order AA-EC-2023-49](https://www.occ.gov/static/enforcement-actions/eaAA-EC-2023-49.pdf), 14 March 2024.
5. JPMorgan Chase, [Form 10-Q for 30 June 2024](https://www.sec.gov/Archives/edgar/data/19617/000001961724000453/jpm-20240630.htm), Trading Venues Investigations note.
6. CFTC, [Order 20-69 on surveillance and spoofing](https://www.cftc.gov/media/4826/enfjpmorganchaseorder092920/download), 29 September 2020.
7. SEC, [Rule 15c3-5 on market access](https://www.sec.gov/rules-regulations/2011/06/risk-management-controls-brokers-or-dealers-market-access), 3 November 2010.
8. CFTC, [Interpretative Letter 13-27 on sponsored access and Regulation 1.73](https://www.cftc.gov/node/212621), 29 April 2013.
9. IOSCO, [Thematic Review on Technological Challenges to Effective Market Surveillance](https://www.iosco.org/library/pubdocs/pdf/IOSCOPD786.pdf), 2025.

**Additional academic source:** Bao Linh Do and Tālis J. Putniņš, [“Detecting Layering and Spoofing in Markets”](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4525036), version dated 3 November 2023. The paper is used only to explain the data needed for detection. It does not study JPMorgan.

*Method and limit: research closed on 31 July 2026 across public CFTC, Fed, OCC and SEC orders, releases and databases, then JPMorgan regulatory filings. "Not found" describes the public documents searched. It proves neither the absence of a confidentially submitted report nor a breach of an order.*
