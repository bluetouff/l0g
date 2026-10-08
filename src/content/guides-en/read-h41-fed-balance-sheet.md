---
title: "How to Read H.4.1: the Fed Balance Sheet, Line by Line"
seoTitle: "Fed H.4.1: what bank reserves really show | l0g"
description: "Read the Fed's H.4.1 tables: weekly averages, Wednesday balances, bank reserves, the TGA and reverse repos, with a worked source check."
pubDate: 2026-07-08T16:30:00+02:00
updatedDate: 2026-10-08T20:00:00+02:00
sourceGuide: "lire-h41-bilan-fed"
sourceUpdatedDate: 2026-10-08T20:00:00+02:00
tags: ["macro", "central banks", "liquidity", "methodology"]
category: fed
summary: "H.4.1 is the Federal Reserve's weekly balance-sheet release. Table 1 explains the factors affecting bank reserve balances and includes both weekly averages and Wednesday levels. Table 5 reports the consolidated Wednesday balance sheet. Comparing the same column over time helps distinguish asset changes from movements in the Treasury General Account, reverse repos and other liabilities."
draft: false
---

The Federal Reserve can report falling assets and rising bank reserves in the same release. Both can be correct. Cash may be leaving the Treasury's account or moving out of reverse repos while securities mature on the other side of the balance sheet. H.4.1 is the document that lets you follow those movements.

Start with the [official release](https://www.federalreserve.gov/releases/h41/). It normally appears on **Thursday at 4:30 p.m. Eastern time**, with holiday adjustments. Check the date at the top, then the column headings: the document contains **weekly averages and Wednesday observations**. Treating every figure as a Wednesday snapshot is an easy way to reach the wrong conclusion.

## Find the table that answers your question

The Fed's [description of H.4.1](https://www.federalreserve.gov/releases/h41/about.htm) explains its scope. This is a statement of central-bank accounts, rather than a complete map of dollar funding or bank lending.

| Question | Where to start | What to check |
| --- | --- | --- |
| Why did reserves change? | Table 1, factors affecting reserve balances | Weekly average or Wednesday level; compare like with like. |
| How large is the Fed's balance sheet? | Table 5, consolidated statement | Total assets, liabilities and capital, all on the stated Wednesday. |
| What maturities does the portfolio contain? | Table 2 | Remaining maturity and the instrument's accounting basis. |
| How much reverse repo is outstanding? | Table 1 | Foreign official accounts are separate from the “Others” line. |
| Are these the Fed's own securities? | Table 1A, custody memorandum items | Custody holdings belong to customers; they are not the Fed's own portfolio. |

These labels and distinctions can be checked in the [October 1, 2026 release](https://www.federalreserve.gov/releases/h41/20261001/). It is a fixed example for this guide, not a live estimate.

## Read reserves as part of an accounting identity

Bank reserves are balances eligible institutions hold at Federal Reserve Banks. They are one liability of the central bank. Other liabilities include banknotes, the Treasury General Account (TGA), reverse repos and other deposits. Assets must equal liabilities plus capital, so the different parts cannot move independently. The Fed's [balance-sheet explanation](https://www.federalreserve.gov/monetarypolicy/bst_fedsbalancesheet.htm) gives the broader accounting context.

A useful reading method is to begin with the change in assets, then examine changes in the other liabilities and capital before explaining the movement in reserves. All else equal, a larger TGA leaves less room for reserves; Treasury spending can reverse that shift. But a tax receipt, debt settlement, repo operation and securities maturity can occur in the same week. A single line cannot identify the whole mechanism.

The popular calculation “Fed assets minus TGA minus reverse repos” omits other balance-sheet items. It can be a selected indicator, provided its definition stays fixed; it is not identical to reported reserves or money available to buy equities. Our [net-liquidity guide](/en/guides/read-net-liquidity-tga-rrp/) explains how to keep that distinction visible.

## A source check: average and snapshot differ

In Table 1 of the [October 1 release](https://www.federalreserve.gov/releases/h41/20261001/), reserve balances averaged **$2,948.090 billion** over the week ending September 30, 2026. The Wednesday level was **$2,881.686 billion**. The source is expressed in millions of dollars; both figures here are divided by 1,000.

The **$17.897 billion increase** printed beside the average compares two weekly averages. It cannot be attached to the Wednesday level. This is why a chart should record both the observation date and the frequency convention, even when its title simply says “Fed reserves.”

## Repos and reverse repos change different sides

A Fed repo provides cash against securities and temporarily adds reserves. A reverse repo temporarily substitutes a reverse-repo liability for reserve balances. The New York Fed describes both mechanisms in its [guide to repo and reverse repo operations](https://www.newyorkfed.org/markets/domestic-market-operations/monetary-policy-implementation/repo-reverse-repo-agreements).

In a reverse repo, the securities remain in the Fed's portfolio for accounting purposes. A change in the operation therefore need not change the size of its securities holdings. The [New York Fed's reverse-repo FAQ](https://www.newyorkfed.org/markets/rrp_faq.html) explains the offsetting liability movements. Compare the appropriate facility series: the H.4.1 reverse-repo total includes foreign official activity as well as other counterparties.

For funding conditions, pair these quantities with [repo rates and SOFR](/en/guides/read-repo-market-sofr/). An accounting movement alone does not establish that institutions are unable to obtain cash.

## Separate portfolio accounting from policy decisions

A fall in securities holdings can reflect maturities and principal repayments. To describe it as part of a policy programme, check the applicable FOMC instructions and reinvestment rules. Total assets can also move because of lending and other accounts. A change in the total is insufficient evidence of a new round of quantitative easing or tightening.

Accounting values also differ from sale prices. The release's footnotes identify face values, remaining mortgage principal and separate unamortized premiums or discounts. Do not interpret the securities line as a mark-to-market valuation of the portfolio.

The earnings-remittance account needs its own explanation. Under the Fed's [Financial Accounting Manual](https://www.federalreserve.gov/aboutthefed/chapter-1-balance-sheet.htm), an accumulated earnings shortfall can be recorded as a deferred asset, presented in the remittance account. It represents earnings needed before remittances resume; it is not a marketable claim that can be sold to fund the government.

## Keep a reproducible weekly reading

Save the dated release, rather than citing only the changing “current” page. Record the table, line, unit and column. Compare the same definition with the previous release, identify the largest offsetting movements, and read the footnotes before assigning a cause. If a figure comes through FRED, retain the series identifier and its frequency as well.

H.4.1 tells you where balances sit within the Fed's accounts. It does not reveal every institution's access to funding, intraday shortages or the ultimate use of credit. Continue with [the offshore dollar system](/en/analysis/eurodollars-the-offshore-dollar/) for that wider perimeter, or [the ECB balance sheet](/en/guides/read-ecb-balance-sheet-target2/) for a comparison of central-bank accounting frameworks.

## Sources and revision

The links above point to the Federal Reserve, the New York Fed and the Fed's accounting manual. The numerical example is fixed to the October 1, 2026 release and is reproducible from Table 1. The October 8 revision corrects the distinction between weekly averages and Wednesday levels, replaces unlinked source descriptions with primary documents, and adds a practical reading sequence. It does not report the latest balance-sheet level or infer an investment signal.
