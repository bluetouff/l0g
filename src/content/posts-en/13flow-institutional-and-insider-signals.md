---
title: "13FLOW: the money that is heavy and the money that knows"
seoTitle: "13FLOW: SEC 13F holdings and Form 4 insider signals | l0g"
description: "13FLOW industrialises the reading of 13F-HR and Form 4 filings on SEC EDGAR and crosses them into an auditable confluence score. Breakdown of the method: institutional weighting, transaction-code hygiene, time decay and insider clusters."
pubDate: 2026-07-14T09:10:00+02:00
updatedDate: 2026-07-14T09:10:00+02:00
tags: ["13flow", "SEC EDGAR", "13F", "Form 4", "markets", "fundamental analysis"]
draft: false
sourceArticle: "13flow"
sourceUpdatedDate: 2026-06-14
---

Form 13F and Form 4 make different disclosures public. Form 13F covers reportable Section 13(f) securities held by managers meeting the **$100 million** reporting threshold; it is not a complete portfolio or a measure of every long position. Form 4 generally reports changes in ownership by covered insiders within **two business days**, including transactions that need not be open-market purchases. The [SEC’s Form 13F FAQ](https://www.sec.gov/rules-regulations/staff-guidance/frequently-asked-questions-about-form-13f) and [insider-transactions bulletin](https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-69) explain the scope and exceptions. [13FLOW](https://13flow.eu) organises these public disclosures and compares them.

The comparison has a timing problem. A 13F is a quarter-end snapshot filed up to **45 days** later under the [SEC reporting timetable](https://www.sec.gov/rules-regulations/staff-guidance/frequently-asked-questions-about-form-13f); a Form 4 refers to individual transaction dates. Combining them does not make the holdings current or establish an insider’s motive. It can identify a case to investigate, provided transaction codes, amendments, reporting dates and valuation dates remain visible. Agreement between the two sources is not evidence that their errors cancel or that the investment will perform.

## Building the score

The Confluence Score, from 0 to 100, aggregates four explicit components. Institutional breadth: the number of funds adding to the position, weighted by their conviction, that is, the weight of the line in the portfolio and not merely its presence. Insider conviction: the number of distinct buyers, seniority (a CEO or CFO purchase weighs more than a director's), amount committed. The dollars actually mobilised on both sides. And an agreement term that rewards the directional alignment of the two signals. Each card exposes its breakdown pillar by pillar: the score is auditable, not declarative.

## Signal hygiene

Two methodological choices make the quality of the whole. Time, first: each insider purchase decays with a half-life of about 30 days, a filing from 3 days ago does not weigh like one from 80. Relative size counts (a line increased by 30% is not a symbolic purchase), as does concentration: several insiders within a 14-day window form a cluster, and that is the strong signal. Filtering by transaction code, next: only market-price orders count, purchases (P) and sales (S). Awards, option exercises (M) and tax withholdings (F) are parsed but excluded from the score, because they reflect no discretionary decision to enter or exit. That is precisely the noise most insider trackers let through.

## Data and surface

The data comes directly from the 13F-HR and Form 4 filings on EDGAR, read at source, with no aggregator in between. The CUSIP-to-ticker mapping goes through OpenFIGI. Four screens organise the tool: Consensus, Funds, Compare, and the Confluence table that orders the universe by convergence. The tool is live at [13flow.eu](https://13flow.eu) and its code is public on [GitHub](https://github.com/bluetouff/13flow).

The framing remains, stated plainly: 13FLOW is a screen, not investment advice, and the crossing of two public signals guarantees no performance. What it produces is a defensible reduction of the universe on verifiable data. Analysis begins where the tool stops.
