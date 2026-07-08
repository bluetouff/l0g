---
title: "How to Read SEC Form 4: insider transactions without the noise"
description: "A reference guide to SEC Form 4: who files it, when, and how to separate signal from noise. Most insider transactions say little; open-market purchases matter. Transaction codes, the 10b5-1 checkbox, purchases versus sales, and how to read the filing on EDGAR."
summary: "SEC Form 4 is the insider-transaction report that officers, directors and 10% shareholders must file within two business days after a change in beneficial ownership. It is the freshest public window into insider trading, but most lines are mechanical; the strongest signal is the rare open-market purchase."
pubDate: 2026-06-21T11:00:00+02:00
updatedDate: 2026-06-21T11:00:00+02:00
sourceGuide: "analyser-form-4-sec"
sourceUpdatedDate: 2026-06-21T11:00:00+02:00
tags: ["markets", "regulation", "institutional flows", "methodology"]
category: marches
draft: false
---

*Form 4 is the freshest insider data in the U.S. market: two business days, versus forty-five days for a 13F. But freshness is not signal. Most Form 4 lines are accounting noise: stock grants, option exercises, tax withholding, sales scheduled months earlier. The real signal is rarer and more expensive to fake: an open-market purchase.*

## What Form 4 is

Form 4 is a filing that officers, directors and holders of more than **10%** of a class of registered equity securities must file with the [SEC](/glossaire/#sec) within **two business days** after a change in their holdings. It is governed by Section 16 of the Securities Exchange Act.

The premise is simple: those closest to a company must show the market what they do with their own securities. The current two-day deadline was introduced after Sarbanes-Oxley in **2002**; before that, insiders could often wait until the tenth day of the following month. That change turned Form 4 into a near-real-time signal.

## Who files, and when

Three groups are covered: executive officers, directors and beneficial owners of more than **10%** of a registered equity class. They live inside a three-form system. **Form 3** is the initial ownership report. **Form 4** reports changes within two business days. **Form 5** is an annual clean-up for exempt or missed transactions.

A 2026 change widened the perimeter: on **February 27, 2026**, the SEC adopted a rule extending Section 16 to officers and directors of foreign private issuers, effective around **March 18, 2026**. For those foreign issuers, however, 10% shareholders remain outside the new regime. The filer universe therefore expanded in 2026.

## What is inside a Form 4

The filing has two tables. **Table I** covers non-derivative securities, mainly common stock. **Table II** covers derivatives: options, warrants, convertibles. Each line includes the transaction date, a one-letter transaction code, the amount, an acquisition or disposition marker, the price, and the number of securities owned after the transaction. A final column tells whether ownership is direct or indirect, for example through a trust or family vehicle.

The “owned after transaction” number is often more useful than the transaction itself. A director selling 1,000 shares while retaining 200,000 is not saying the same thing as a CFO selling nearly everything.

## Transaction codes: filter before interpreting

This is where most readings fail. Every line has a code, and not all codes are equal. Two codes show a voluntary market decision. **P** means purchase, open-market or private. **S** means sale. These are the only codes where the insider is deploying or recovering money at a market price.

Most other codes are compensation or mechanics. **A** is a stock award. **M** is an option exercise. **F** is a surrender of shares to pay an exercise price or tax withholding; it looks like a sale but is often just tax plumbing. **G** is a gift, **C** is a conversion. Treating grants or tax withholding as buying or selling is the classic error. The first filter is therefore P and S.

## Why insider buying weighs more than selling

Buying and selling are asymmetric. An insider buys for one plausible reason: they think the shares are attractive. They sell for many reasons: diversification, taxes, estate planning, option expiry, a house. Decades of finance research find insider purchases more predictive than insider sales.

The law reinforces the signal. Section **16(b)** requires insiders to disgorge short-swing profits from matched purchases and sales within six months. Section **16(c)** prohibits insiders from short-selling their own company's stock. An open-market purchase is therefore costly: the insider cannot quickly flip it for a profit without giving up the gain, and cannot hedge it with a short. That makes it a more credible signal.

## The 10b5-1 checkbox

Sales have a decisive filter: Rule **10b5-1**. It lets insiders adopt prearranged trading plans when they do not possess material non-public information. A sale executed months later under such a plan may say almost nothing about the insider's current view.

Since **April 1, 2023**, Forms 4 and 5 include a mandatory checkbox indicating whether a transaction was made under a 10b5-1 plan, along with the plan adoption date. The SEC also added cooling-off periods, restrictions on overlapping plans and good-faith certifications. For the reader, this is a major improvement: a sale checked as 10b5-1 and adopted well before the event can often be treated as programmed noise. A discretionary sale deserves more attention.

## Routine versus opportunistic

The strongest filter is behavioral. Cohen, Malloy and Pomorski, in a 2012 *Journal of Finance* study, separate “routine” insiders who trade at the same time every year from “opportunistic” insiders whose trades break their own pattern. The result is sharp: after removing routine trades, opportunistic trades carry most of the predictive power. Routine sales, especially from executives who always sell in March, teach little. An unusual purchase by a CEO or CFO who rarely buys is the signal to isolate.

## How to read it on EDGAR

Everything is public and free. Search the company on [EDGAR](/glossaire/#edgar), then filter for filing type `4`. Open both the readable filing and the XML source.

The workflow is simple. Identify the code: isolate P and S, set aside A, M and F. For sales, check the 10b5-1 box and the plan date. Read the filer's role: CEO and CFO purchases usually matter more than non-executive director purchases. Scale the transaction relative to the holder's remaining position. Finally, look for clusters: several insiders buying the same company within a short window is often the strongest pattern.

## Limits

Form 4 is partial. One company, one insider, one transaction is statistically fragile. Sales are noisy by nature. Gifts and indirect ownership blur who economically holds what. A 10% shareholder may not know the business like an operating executive. Late filings still happen. Derivative tables require technical reading. One insider purchase is never a full thesis.

## Confluence with 13F

A fast, narrow signal becomes stronger when crossed with a slow, broad one. [Form 13F](/en/guides/how-to-analyze-sec-13f-filings/) shows where institutional managers held long positions last quarter. Form 4 shows whether those inside the company are committing personal capital now. A position reinforced by respected managers and opportunistic insider purchases weighs more than either signal alone. This is the logic behind <a href="https://13flow.eu" rel="noopener">13FLOW</a>.

## Methodology

This guide is based on primary sources: Section 16 of the Securities Exchange Act, SEC forms and instructions, SEC rules on 10b5-1 amendments and the 2026 extension of Section 16 to foreign private issuer officers and directors, plus peer-reviewed academic research on insider trading signals. A practical l0g reading starts from the raw EDGAR filing, isolates P and S, checks 10b5-1, weights the filer's role and refuses to turn one purchase into a complete investment case.

---

**Main sources:** SEC, Section 16 of the Securities Exchange Act of 1934, Forms 3, 4 and 5 and instructions; Investor.gov, *Insider Transactions and Forms 3, 4, and 5*; SEC rules and compliance guidance on Rule 10b5-1 amendments; SEC 2026 final rule extending Section 16 to officers and directors of foreign private issuers; Cohen, Malloy and Pomorski, *Decoding Inside Information*, Journal of Finance, 2012.
