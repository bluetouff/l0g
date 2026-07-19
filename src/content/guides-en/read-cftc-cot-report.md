---
title: "How to Read the CFTC COT Report: Who Is Positioned, and How to Know"
description: "A reference guide to the Commitments of Traders, the weekly CFTC release that reveals large-trader positioning on futures markets. Which reports to read, which categories carry the signal, how classification is done, and which blind spots to know before drawing conclusions."
pubDate: 2026-07-08T18:00:00+02:00
updatedDate: 2026-07-08T18:00:00+02:00
sourceGuide: "lire-cot-cftc"
sourceUpdatedDate: 2026-06-28T15:00:00+02:00
tags: ["markets", "institutional flows", "commodities", "methodology"]
category: marches
summary: "The Commitments of Traders report is a weekly release published by the CFTC that details open positions by trader category on U.S. futures markets. It is released each Friday at 3:30 p.m. New York time, using positions as of the previous Tuesday. Read well, it shows where speculative money and hedgers stand; read badly, it misleads."
draft: false
---

*In futures markets, everyone eventually shows their cards once a week. The Commitments of Traders report, or [COT](/en/glossary/cot/), is that moment of transparency imposed by the U.S. regulator. Each Friday, the CFTC publishes open positions in futures contracts, broken down by trader type. It is one of the few public windows into the real positioning of funds, banks and industrial hedgers. But you need to read the right report, understand who sits in which bucket, and know the time lag that limits its use. This guide takes the mechanism apart.*

The COT does not say where the market is going. It says who is positioned how, at a given date. It is structural data, not a buy or sell signal. Its value lies in revelation: the split between those hedging physical risk and those speculating on direction. Read methodically, it gives faces to [open interest](/glossaire/#open-interest), the mass of outstanding contracts. Read carelessly, it gives false certainty.

## What COT measures

The report decomposes, for each covered contract, total open interest: the number of contracts opened and not yet closed. This mass is split across trader categories, each shown in long positions, short positions and, when relevant, spreads, meaning offsetting long and short positions held by the same participant. By construction, total longs equal total shorts: every buyer has a seller. The common reading is to calculate a category’s net position, longs minus shorts. A positive number signals a long bias, a negative number a short bias.

A market is included only if **20** or more traders hold positions above the CFTC reporting thresholds. Below that, trader anonymity would not be guaranteed. Positions below the reporting threshold are grouped in a residual nonreportable category.

## The calendar, and the three-day lag

COT follows a strict rhythm. Positions are recorded as of Tuesday evening. Reporting firms send them to the CFTC on Wednesday morning. The CFTC checks and publishes them on Friday at **3:30 p.m.** New York time. There is therefore a **three-day** lag between the snapshot and publication. The CFTC publishes no intra-week update.

That lag has a direct consequence: in a fast market, real positioning may already have changed when the report comes out. COT is a background-reading tool, suited to swing and position horizons, never an intraday trigger. Confusing it with real-time data is the first mistake.

## The four reports, and which one to read

The CFTC publishes four families of reports, each in futures-only and futures-and-options-combined versions.

The historical report, Legacy, dates back to **1986**. It distinguishes only two classes of reportable traders, commercial and non-commercial, plus nonreportables. It is the oldest and most consulted, but also the most misleading, because market-making banks can appear among commercials, blurring the line between real hedging and speculative activity.

The Disaggregated report, available from **2006** and published from September 2009, fixes that problem for physical markets: agriculture, energy and metals. It splits participants into four clearer buckets. Traders in Financial Futures, or TFF, does the same for financial markets: rates, currencies and equity indexes. Finally, the Supplemental CIT report covers **13** agricultural contracts and isolates index funds.

The practical rule is simple. For a commodity, read the Disaggregated report and the Managed Money category. For a currency or rate contract, read TFF and the Leveraged Funds category. These two buckets isolate speculative money, the one that carries the directional signal. Using Legacy for these markets means reading an outdated map.

## The categories that carry signal

In the Disaggregated report, there are four main boxes. Producers, merchants, processors and users are physical actors—miners, refiners, merchants—who hedge. Swap dealers are banks facilitating client trades, often for hedging on behalf of others. Managed Money covers hedge funds, commodity trading advisors and third-party managers. Other Reportables gathers other large participants, such as some pension funds or corporate treasuries.

In TFF, the same logic applies to financial markets. Dealers and intermediaries are market makers, usually banks. Asset managers and institutional investors cover pension funds, insurers and mutual funds. Leveraged Funds are hedge funds and leveraged managers. Other Reportables are the rest of the large-reporting universe. If you want to follow directional speculative money, Leveraged Funds are the bucket.

## How classification is done

One decisive point is often ignored. A trader’s category is not inferred from each trade, but from its predominant business activity, self-declared on CFTC Form 40 and monitored by the Commission. Classification is therefore at the entity level, based on declared purpose, not at the intention level of each position.

That nuance matters. An industrial company classified as commercial can also take speculative positions, and a bank classified as swap dealer can carry directional bets alongside hedges. COT categories are institutional approximations, not certainty about the motive behind every contract. That is exactly the kind of caveat this site insists on before any interpretation.

## Reading a positioning extreme

The most common analytical use is to watch extremes. The idea is that hedgers, or commercials, tend to lean against the move when the market drifts far from fundamental value, while speculative money—Managed Money or Leveraged Funds—crowds into trends until saturation. A speculative net position at a historical extreme is then read as a crowded market, vulnerable to reversal once buyers or sellers are exhausted.

This framework has real contextual value, but it is not a timing signal. An extreme can stay extreme and become even more extreme before it unwinds. Serious reading looks not at the raw level alone but at the weekly change and at the position within a long historical range, through percentiles or z-scores. COT locates pressure. It does not give the hour of reversal. It is a positioning compass, not a stopwatch.

## Blind spots

Several limits frame the tool. The **three-day** lag prevents reactive use. Weekly frequency provides no finer granularity. Classification by predominant activity can misplace hybrid participants. Scope is also limited: COT covers listed futures and options, and ignores OTC markets, swaps and the underlying physical market. The **20-trader** threshold excludes some thin markets.

There is also a current-policy angle. In May 2026, the CFTC opened a public consultation on reforming its COT program, including whether to publish more recent data. The format described here may therefore evolve, and official CFTC announcements must be watched.

## Reading COT from the primary source

The raw data is free and public. It is available on the CFTC website under Market Reports, in text and spreadsheet files, with Legacy history back to **1986**. The CFTC also provides a Public Reporting Environment to filter by contract and date and export series. Exchanges such as CME publish charting tools built from the same data. For rigorous use, return to the CFTC source file rather than an aggregator, and make sure you are reading the right report for the asset class.

COT sits in the same family as the other regulatory disclosures decoded on this site, such as [SEC Form 13F](/en/guides/how-to-analyze-sec-13f-filings/). It usefully complements futures-market readings in our analyses of the [Treasury basis trade](/posts/basis-trade-treasuries-levier/) and [gold positioning](/posts/or-banques-centrales-dedollarisation-tonnes/).

## Methodology

This guide describes the public functioning of the Commitments of Traders program using official CFTC explanatory notes and release schedules. Categories, thresholds and dates come from Commission documents and institutional sources. No investment strategy is recommended. COT is presented as a positioning-reading tool, with explicit limits.

---

**Main sources:** Commodity Futures Trading Commission, Commitments of Traders page and explanatory notes; CFTC release schedule, Friday at 3:30 p.m. Eastern time using Tuesday data; CFTC FAQ and histories, with Legacy since 1986 and Disaggregated, TFF and CIT series from 2006; Federal Register, “Review of the Commitments of Traders Reporting Program,” May 5, 2026; Office of Financial Research and CME Group for financial-category definitions. Dates, thresholds and categories checked against CFTC documents.
