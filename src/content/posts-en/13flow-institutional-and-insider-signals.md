---
title: "13FLOW: the money that is heavy and the money that knows"
description: "13FLOW industrialises the reading of 13F-HR and Form 4 filings on SEC EDGAR and crosses them into an auditable confluence score. Breakdown of the method: institutional weighting, transaction-code hygiene, time decay and insider clusters."
pubDate: 2026-07-14T09:10:00+02:00
updatedDate: 2026-07-14T09:10:00+02:00
tags: ["13flow", "SEC EDGAR", "13F", "Form 4", "markets", "fundamental analysis"]
draft: false
sourceArticle: "13flow"
sourceUpdatedDate: 2026-06-14
---

The 13F and the Form 4 are two of the rare clean signals that US regulation makes public. The first exposes, every quarter, the long positions of managers above $100m. The second captures, within two business days, the trades of executives on the stock of their own company. Both are in the public domain and readable on [EDGAR](/en/guides/how-to-analyze-sec-13f-filings/). [13FLOW](https://13flow.eu) does not claim to give access one would not otherwise have: it industrialises the reading and, above all, it crosses the two signals, something the historical databases (Dataroma, WhaleWisdom) do badly or not at all.

The value of the crossing rests on an asymmetry. The 13F is dense but late: up to 45 days after the quarter's close, it is an already stale snapshot by the time it lands. The [Form 4](/en/guides/how-to-read-sec-form-4/) is near real time but individually weak: a single executive's purchase, in isolation, has no predictive value. Their intersection corrects both flaws at once. A stock that several institutions are accumulating and that executives are buying at market price, within the same window, is the coincidence of two populations that share neither the same information nor the same constraints. The noise cancels out, the conviction remains.

## Building the score

The Confluence Score, from 0 to 100, aggregates four explicit components. Institutional breadth: the number of funds adding to the position, weighted by their conviction, that is, the weight of the line in the portfolio and not merely its presence. Insider conviction: the number of distinct buyers, seniority (a CEO or CFO purchase weighs more than a director's), amount committed. The dollars actually mobilised on both sides. And an agreement term that rewards the directional alignment of the two signals. Each card exposes its breakdown pillar by pillar: the score is auditable, not declarative.

## Signal hygiene

Two methodological choices make the quality of the whole. Time, first: each insider purchase decays with a half-life of about 30 days, a filing from 3 days ago does not weigh like one from 80. Relative size counts (a line increased by 30% is not a symbolic purchase), as does concentration: several insiders within a 14-day window form a cluster, and that is the strong signal. Filtering by transaction code, next: only market-price orders count, purchases (P) and sales (S). Awards, option exercises (M) and tax withholdings (F) are parsed but excluded from the score, because they reflect no discretionary decision to enter or exit. That is precisely the noise most insider trackers let through.

## Data and surface

The data comes directly from the 13F-HR and Form 4 filings on EDGAR, read at source, with no aggregator in between. The CUSIP-to-ticker mapping goes through OpenFIGI. Four screens organise the tool: Consensus, Funds, Compare, and the Confluence table that orders the universe by convergence. The tool is live at [13flow.eu](https://13flow.eu) and its code is public on [GitHub](https://github.com/bluetouff/13flow).

The framing remains, stated plainly: 13FLOW is a screen, not investment advice, and the crossing of two public signals guarantees no performance. What it produces is a defensible reduction of the universe on verifiable data. Analysis begins where the tool stops.
