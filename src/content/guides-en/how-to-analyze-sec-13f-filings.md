---
title: "How to Analyze SEC Form 13F Filings"
description: "A reference guide to Form 13F: who files, when, what it contains, how to read it on EDGAR, and above all its blind spots. A quarterly rear-view mirror of long positions, powerful only if its limits are understood."
pubDate: 2026-07-08T16:30:00+02:00
updatedDate: 2026-07-08T16:30:00+02:00
sourceGuide: "analyser-13f-sec"
sourceUpdatedDate: 2026-06-21T10:00:00+02:00
tags: ["markets", "regulation", "institutional flows", "methodology"]
category: marches
summary: "Form 13F is a quarterly filing required by the SEC from institutional investment managers exercising investment discretion over more than $100 million in eligible U.S. securities. It lists their long positions within 45 days after quarter-end."
draft: false
---

*Form 13F is the most cited window into the portfolios of major U.S. managers, and one of the most misread. It is a rear-view mirror: a quarterly snapshot of long positions, published up to 45 days after quarter-end, with no shorts, no hedges, no off-balance-sheet exposure. This guide explains how the filing works, how to read it on EDGAR, and how to avoid the misreadings that turn public data into a trap.*

In one sentence, to fix the vocabulary: Form 13F is a quarterly filing the [SEC](/glossaire/#sec) requires from institutional investment managers exercising investment discretion over more than **$100 million** in eligible U.S. securities. It lists their long positions within **45 days** after quarter-end. Everything else, both its uses and its traps, follows from that definition.

## Where 13F comes from, and what it is for

The form comes from Section 13(f) of the Securities Exchange Act of 1934, added by Congress in **1975**. The stated goal was to increase transparency around the holdings of large institutional investors and, by doing so, strengthen confidence in the integrity of U.S. markets. The underlying idea: if individuals and regulators can see which securities the biggest players hold, the market is less opaque.

Fifty years later, 13F has become raw material for an entire industry: “superinvestor” tracking websites, strategies that replicate star managers, academic research on flows. That popularity creates an illusion of precision that must be defused immediately. 13F was never designed as a real-time investment signal. It was designed as an instrument of retrospective transparency. The distinction changes everything.

## Who must file, and on what calendar

The trigger is discretion, not wealth. Any “institutional investment manager” exercising investment discretion over at least **$100 million** of eligible securities, measured on the last trading day of any month during the calendar year, must file. The category is broad: investment advisers, banks, insurers, brokers, pension funds, family offices and even some companies. It covers both U.S. and foreign managers, as long as they use the means of U.S. interstate commerce.

The $100 million threshold was set in the late 1970s and has never been raised. A 2020 SEC proposal to lift it to $3.5 billion did not go through. The practical consequence is that inflation and higher market values have mechanically widened the net, and 13F now captures a much larger universe of filers than the 1975 legislator likely imagined.

The calendar is strict. Once the threshold is crossed, the manager files within **45 days** after the end of the calendar year, then within 45 days after each of the first three quarters of the following year. In practice, deadlines fall around **February 14** for Q4, **May 15**, **August 14** and **November 14**. The obligation continues as long as the threshold is met, and an error found in a past filing requires an immediate amendment.

## What a 13F contains

A filing has three blocks: a cover page, a summary page, and most importantly an information table in **XML**, the usable core. Each row describes a position: issuer name, security class, **CUSIP**, market value in dollars at quarter-end, number of shares or principal amount, nature of investment discretion and voting authority, and a decisive field, `putCall`, which tells you whether the row is a PUT or CALL option.

The universe of “13(f)” securities is defined by an official list the SEC updates each quarter. It includes U.S.-listed equities, some options and warrants, shares of certain [ETFs](/glossaire/#etf), and some convertible debt securities. A commonly missed point: open-end fund shares, traditional mutual funds, are not 13(f) securities and never appear. The official list is the only arbiter of eligibility, and it changes from quarter to quarter.

## How to read it on EDGAR, step by step

Everything is public and free on [EDGAR](/glossaire/#edgar), the SEC database. The process is simple.

First, identify the filer. Search for the manager by name or CIK in EDGAR, then filter filings by type. The holding report carries the code `13F-HR`; a `13F-NT` is only a notice indicating that another manager reports the securities on its behalf; a `/A` suffix marks an amendment.

Then open the information table. Read positions line by line. The useful work starts there: calculate the weight of each row by dividing its value by the total reported portfolio value. That reveals real conviction, invisible in a simple alphabetical list.

Finally, compare with the previous quarter. This is the most informative reading: by matching two successive filings, you identify new, exited, increased or reduced positions. A manager doubling an already large line sends a stronger signal than another opening a symbolic position. The dynamic matters more than the isolated snapshot.

One rigorous reflex: always check the `putCall` field. A row can be a put option, and therefore bearish exposure, while appearing in the value column like any holding. Counting downside protection as a bullish bet is the most common and most expensive reading mistake.

## The limits, without mercy

This is where most analysis goes wrong, and where an honest reading adds value. 13F is useful precisely to the extent that you know its blind spots.

First, the lag. A position held on March 31 may not be published until May 15. The manager has had six weeks to exit. 13F tells you where the money was, not where it is. It is a rear-view mirror, never a windshield.

Second, the absence of short sales. 13F shows only long positions. Shorts and most hedges are not visible, making it impossible to infer a fund’s net exposure. A manager can show a large long position while being neutral or short overall through instruments you cannot see. In October 2023, the SEC adopted a short-position reporting regime, Rule 13f-2 and Form SHO, precisely to fill that blind spot. But after a remand by the Fifth Circuit Court of Appeals in August 2025, the SEC, on **December 3, 2025**, pushed first filings back to **2028**. In practice, for now, the short side remains invisible.

Third, the quarterly snapshot. Any round trip inside the quarter is undetectable: a manager can buy and sell a position between two snapshots without leaving a trace. 13F also ignores cash, non-convertible debt, stocks listed outside the United States, commodities and private positions. It offers a partial view centered on long U.S. equity exposure.

Finally, confidential treatment. A manager can ask the SEC to delay publication of some positions, for example during an accumulation phase. Those lines are temporarily missing. Add anti-duplication rules, which mean a same position may be reported by only one manager in a group, so the nominal filer is not always the true economic holder. And quarter-end window dressing can polish the snapshot for show.

## Using it well: the logic of confluence

A rear-view mirror is still useful when crossed with other mirrors. The right practice is never to read a 13F alone, but to compare it with signals of a different nature.

[Form 4](/glossaire/#form-4) is its natural complement. Insider transactions are reported within two business days, making them much fresher and more directional than 13F: an executive buying their own shares commits personal capital almost in real time. Where 13F is slow and long-only, Form 4 is fast and signed. 13D and 13G beneficial ownership filings, triggered from 5% of capital, add an intent layer, with 13D often signaling activist purpose.

Confluence between managers matters just as much. A position simultaneously increased by several respected firms weighs more than an isolated bet, however large. That is exactly the logic used in <a href="https://13flow.eu" rel="noopener">13FLOW</a>, which cross-checks 13F filings and Form 4 insider filings to surface convergence between slow institutional flows and fast insider signals. None of these signals is sufficient on its own. Their overlap reduces noise.

## Methodology

This guide relies exclusively on primary sources: the text of Section 13(f), Rule 13f-1, the form itself and the SEC Division of Investment Management’s FAQ, as well as releases and orders relating to Rule 13f-2 and Form SHO. Figures and deadlines were checked one by one. Any practical reading of 13F data on l0g.fr starts from the raw information table filed on EDGAR, recalculates weights, flags option rows, and systematically reminds readers of the 45-day lag. Because rules evolve, this page carries a last-reviewed date: a regime like Form SHO, delayed to 2028, can still be amended before then.

---

**Main sources:** SEC Division of Investment Management, *Frequently Asked Questions About Form 13F*; SEC, Section 13(f) of the Securities Exchange Act of 1934 and Rule 13f-1; Investor.gov, *Form 13F*; SEC, *Short Position and Short Activity Reporting by Institutional Investment Managers*, Rule 13f-2 and Form SHO, adopted October 13, 2023; SEC exemptive order of February 7, 2025 and order of December 3, 2025 delaying first Form SHO filings to 2028; United States Court of Appeals for the Fifth Circuit, remand of August 25, 2025. The eligible securities list is the SEC’s quarterly *Official List of Section 13(f) Securities*.
