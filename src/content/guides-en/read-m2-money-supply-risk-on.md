---
title: "How to Read M2 Money Supply: liquidity signal, bad readings and risk-on narratives"
seoTitle: "US M2 money supply: deposits, liquidity and risk assets | l0g"
description: "Read the Fed’s M2 definition, distinguish deposits from bank reserves, and assess the limits of links between money supply, equities and crypto."
summary: "M2 is the Fed's broad money aggregate: liquid money and near-money held by the nonbank public. It is often used as a liquidity barometer for risk assets, but it is a stock, not a flow. It is useful as a directional signal only when read with velocity, composition and the broader macro regime."
pubDate: 2026-06-29T15:30:00+02:00
updatedDate: 2026-10-15T18:26:00+02:00
sourceGuide: "m2-masse-monetaire-risk-on"
sourceUpdatedDate: 2026-06-29T15:30:00+02:00
tags: ["macro", "central banks", "crypto", "liquidity"]
category: macro
draft: false
---

*M2 money supply is one of the most quoted numbers in risk-on investing, and one of the most abused. It has been turned into a “global liquidity clock” that supposedly predicts Bitcoin with a neat lag. Reality is more careful. M2 carries a signal, but only when treated as a stock of money, not as a hose pointed at markets.*

## The exact definition of M2

M2 is a monetary aggregate published monthly by the Federal Reserve in the H.6 release. It includes M1. M1 includes the most liquid money: currency in circulation, demand deposits and, since May 2020, other liquid deposits such as savings accounts and money market deposit accounts. M2 adds less-liquid components: small time deposits below **$100,000** and retail money market fund shares, with the applicable IRA and Keogh exclusions. [Federal Reserve definition](https://www.federalreserve.gov/releases/h6/current/default.htm).

[The Fed’s technical Q&A](https://www.federalreserve.gov/releases/h6/h6_technical_qa.htm) explains the breaks in definition and treatment. Three details matter. First, M2 counts money held by the U.S. nonbank public: federal government deposits and interbank deposits are excluded. Second, a May 2020 regulatory change moved savings deposits into M1, complicating composition comparisons across that date. Third, from the July 28, 2026 H.6 release, the Fed changes how IRA and Keogh balances are treated in the seasonally adjusted series.

The crucial point: M2 is a **stock**, not a flow of money into equities or crypto. A rising M2 means liquid money balances are rising. It does not tell what holders will do with those balances.

## Compare the same series and vintage

Use the [Fed’s H.6 release](https://www.federalreserve.gov/releases/h6/current/default.htm) or [FRED’s M2SL series](https://fred.stlouisfed.org/series/M2SL), recording the observation month, units, seasonal adjustment and retrieval date. Historical data can be revised. A level from an old article is not a current reading.

For a year-over-year change, compare the same monthly series with its value twelve months earlier. The calculation is `(current / year-earlier - 1) × 100`. Keep the level and growth rate together: slower growth can coexist with a rising stock. The [June 23, 2026 release](https://www.federalreserve.gov/releases/h6/20260623/) is an archived example of the release format, not the latest observation.

## The link with risk-on

The usual shortcut is that more money pushes risk assets higher. The mechanism is not absurd: abundant liquidity can seek return in equities, credit, commodities and scarce digital assets. But the transmission depends on **velocity**, the speed at which money turns over. The quantity theory identity links money times velocity to nominal income. If velocity falls, higher M2 may feed neither inflation nor markets.

Velocity is a measured ratio that can change over time; consult [FRED’s M2V definition and observations](https://fred.stlouisfed.org/series/M2V). That is why mechanical M2 readings fail. The composition also matters: rising retail money market balances can reflect risk-off behavior, as households move from low-yielding deposits into safer cash-like assets, not a rush into speculation.

## Bitcoin as liquidity barometer

An [analysis published by Lyn Alden and written by Sam Callahan](https://www.lynalden.com/bitcoin-a-global-liquidity-barometer/) reports that Bitcoin and the authors’ global-liquidity measure moved in the same direction in **83%** of twelve-month windows and **74%** of six-month windows in their historical sample. These are the authors’ retrospective results, not a probability of future price increases or an independent replication. The study’s global measure must also be distinguished from US M2 alone.

A chart fitted with a selected lag is a different claim. Changing the lag after observing prices can improve the historical fit without establishing predictive value. Converting foreign monetary aggregates into dollars introduces an exchange-rate effect as well. A useful replication must disclose the component series, dates, conversion method and out-of-sample test. The [Fed’s H.6 definitions](https://www.federalreserve.gov/releases/h6/about.htm) specify the US aggregate; they do not define a universal global-M2 trading signal.

## Common traps

The first trap is confusing stock and flow. A high M2 level is not a reservoir waiting to flood markets. The second is confusing level and change: M2 and asset prices both trend upward over long periods, creating spurious correlations between non-stationary series. The useful information is in changes, not in two lines rising on the same chart.

The third trap is ignoring the dollar when discussing global M2. A weaker dollar mechanically raises non-U.S. money aggregates when translated into dollars. The fourth is treating a historical lag as a future clock.

## A disciplined framework for using M2

M2 remains useful if read as a conditional monetary climate gauge. Look at year-over-year growth rather than the raw level. Cross-check velocity and composition to see whether the move reflects risk appetite or a move into cash-like safety. Then compare it with other liquidity measures: reserves, the Treasury General Account, reverse [repo](/en/glossary/repo/), and money-market funding stress.

M2 is one piece of the broader plumbing described in the guides on the [Fed balance sheet](/en/guides/read-h41-fed-balance-sheet/) and [net liquidity](/en/guides/read-net-liquidity-tga-rrp/). It is a good weather indicator, not a crystal ball.

---

**Primary sources:** [Federal Reserve H.6 definitions](https://www.federalreserve.gov/releases/h6/about.htm), [technical Q&A](https://www.federalreserve.gov/releases/h6/h6_technical_qa.htm), [M2SL](https://fred.stlouisfed.org/series/M2SL) and [M2V](https://fred.stlouisfed.org/series/M2V). The [Alden/Callahan study](https://www.lynalden.com/bitcoin-a-global-liquidity-barometer/) is the original source for its own retrospective findings. The October 15 revision corrects the inclusion of M1 in M2, removes undated market readings and separates the study’s measure from US M2.
