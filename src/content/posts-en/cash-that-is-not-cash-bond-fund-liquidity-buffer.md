---
title: "The cash that is not cash: the hidden liquidity buffer in bond funds"
description: "Open-end bond funds promise daily redemptions, but their first line of defence relies mostly on money-market vehicles and repo. N-PORT data reveal the size, composition and limits of that buffer."
pubDate: 2026-07-25T19:00:10+02:00
updatedDate: 2026-07-25T19:00:10+02:00
tags: ["markets", "funds", "bonds", "liquidity", "systemic risk"]
draft: false
sourceArticle: "cash-pas-cash-coussin-liquidite-fonds-obligataires"
sourceUpdatedDate: 2026-07-25
---

*When an investor asks an open-end bond fund for their money back, the fund does not necessarily sell a bond. It can first use cash, let a very short-term investment mature, reduce a repo position or redeem a money-market vehicle. Selling credit comes later. There is therefore a buffer between the redemption request and the bond sale. A Federal Reserve study published in May 2026 finally measures its composition. Its conclusion changes the question: the buffer is liquid, but very little of it is cash.*

This piece extends, without repeating, our analysis of [high yield holding up while investment grade flees](/en/analysis/high-yield-holds-up-while-investment-grade-flees/). Fund outflows show that an investor wants to be repaid. They do not show which asset the manager mobilised, or for how long the fund can avoid selling bonds.

The Fed's answer is precise and limited. In its sample, the average buffer represents **4.7%** of net assets and the median **3.4%**. Yet in the aggregate series, cash and cash equivalents average only about **0.4% of assets**. Most of the buffer comes from short-term investment vehicles and [repo](/en/glossary/repo/), two building blocks of the nonbank money market whose liquidity itself depends on market conditions.

This finding does not prove that forced selling occurred in July 2026. The data end in the third quarter of 2025. It reveals something else: the daily liquidity of a bond fund is a funding chain, not a pile of banknotes.

## The exact perimeter: open-end mutual funds, not ETFs

The [FEDS Note published on 8 May 2026](https://www.federalreserve.gov/econres/notes/feds-notes/measuring-mutual-fund-liquidity-with-n-port-20260508.html), by Erik Larsson, Ty Kawamura and Chaehee Shin, uses N-PORT and N-CEN filings submitted to the SEC.

Its sample covers **369 US corporate bond mutual funds**, observed from the fourth quarter of 2019 to the third quarter of 2025, with **5,458 fund-quarter observations**. In the third quarter of 2025, these vehicles held **$450.635bn in net assets**. The authors select funds that are:

- open-end vehicles registered on Form N-1A;
- invested in portfolios with a weighted average maturity of at least three years;
- invested in US-domiciled corporate bonds amounting to at least 55% of net assets.

The perimeter explicitly excludes ETFs. It also excludes money market funds, which operate under a separate framework. The distinction matters: an ETF can manage flows through share creations and redemptions, sometimes in kind, using authorised participants. An open-end mutual fund redeems its investors directly under the procedures set out in its prospectus.

The study therefore measures neither LQD nor HYG, nor the entire bond market. It describes one precise segment: long-term US mutual funds invested mainly in domestic corporate bonds.

## The ratio researchers had to reconstruct

The SEC requires covered funds to report their portfolios every month on Form N-PORT. The form contains holdings, values, maturities, asset types, counterparties and several risk measures. Yet the most intuitive piece of information for this topic is missing from public filings: the liquidity category assigned to each position.

[Rule 22e-4](https://www.sec.gov/resources-small-businesses/small-business-compliance-guides/investment-company-liquidity-risk-management-program-rules) requires a fund to classify its positions at least monthly into four categories, from highly liquid to illiquid, taking into account conversion time, price impact and market depth. But N-PORT Item C.7, which carries that classification, remains confidential.

The Fed researchers therefore built a measure that is neither a regulatory ratio nor an official threshold: the **[SLAR](/en/glossary/#slar)**, or *Short-Term Liquid Assets Ratio*.

Its numerator adds:

- cash and cash equivalents;
- Treasury bills maturing in 90 days or less;
- US-domiciled repos maturing in 90 days or less;
- US-domiciled **[STIVs](/en/glossary/#stiv)**.

The denominator is the fund's net asset value. The formula is:

**SLAR = short-term liquid assets / fund net assets**

Form N-PORT defines a STIV category that includes a money market fund, liquidity pool or other cash-management vehicle. It is not a single legal wrapper. It is a reporting category that groups instruments designed to invest cash over short horizons.

The reconstruction has one virtue: it examines what funds actually hold, not the liquidity implied by their name or stated strategy. It also has a limit: it measures a stock of assets deemed readily mobilisable, not the price at which each could be converted into cash during a crisis.

## A buffer near 5%, but only 0.4% in cash

Across the full period, the average fund in the sample has a SLAR of **4.7%**, with a median of **3.4%**. The interquartile range is about **1.5% to 7.2%**. The median fund therefore has a smaller buffer than the mean suggests, because the distribution is pulled upward by the most liquid vehicles.

The aggregate composition is even more informative:

- STIVs account for more than half of the buffer in most periods, equal to about **3.2% of net assets**;
- repo amounts to about **1.5% of assets**;
- cash and cash equivalents average only around **0.4%**;
- very short Treasury bills are only a minor component, with no exact figure published in the note's text.

These orders of magnitude come from different statistics in the same study: a time average for cash, an asset-weighted aggregate series for the composition, and a value observed during most periods for STIVs. They must not be added as though they were the exact balance sheet of one fund on one date.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 900 525" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="slar-composition-title-en slar-composition-desc-en" style="width:100%;height:auto;background:#0c0d10;border:1px solid rgba(255,255,255,0.10);border-radius:12px;font-family:ui-monospace,monospace">
  <title id="slar-composition-title-en">The buffer is mostly money-market exposure</title>
  <desc id="slar-composition-desc-en">Orders of magnitude published by the Federal Reserve for corporate bond mutual funds in the sample. STIVs account for about 3.2 percent of net assets during most periods, repo about 1.5 percent and cash an average 0.4 percent. Very short Treasury bills are a minor component not quantified in the text.</desc>
  <text x="32" y="42" fill="#5eead4" font-size="17">// The buffer is mostly money-market exposure</text>
  <text x="32" y="67" fill="#8b909b" font-size="11">orders of magnitude as % of net assets, Fed study 2019 Q4 to 2025 Q3</text>
  <g stroke="rgba(255,255,255,0.10)" stroke-width="1">
    <line x1="250" y1="105" x2="250" y2="430"/>
    <line x1="385" y1="105" x2="385" y2="430"/>
    <line x1="520" y1="105" x2="520" y2="430"/>
    <line x1="655" y1="105" x2="655" y2="430"/>
    <line x1="790" y1="105" x2="790" y2="430"/>
  </g>
  <g fill="#8b909b" font-size="10" text-anchor="middle">
    <text x="250" y="452">0%</text>
    <text x="385" y="452">1%</text>
    <text x="520" y="452">2%</text>
    <text x="655" y="452">3%</text>
    <text x="790" y="452">4%</text>
  </g>
  <g font-size="12">
    <text x="32" y="150" fill="#f5f6f8">STIV</text>
    <text x="32" y="170" fill="#8b909b" font-size="9">money fund, liquidity pool</text>
    <text x="32" y="184" fill="#8b909b" font-size="9">or cash-management vehicle</text>
    <rect x="250" y="128" width="432" height="50" rx="6" fill="#5eead4"/>
    <text x="697" y="158" fill="#b8fff5" font-size="16" font-weight="700">≈ 3.2%</text>
    <text x="32" y="246" fill="#f5f6f8">Short repo</text>
    <text x="32" y="270" fill="#8b909b" font-size="10">maturity of 90 days or less</text>
    <rect x="250" y="224" width="203" height="50" rx="6" fill="#f5b13d"/>
    <text x="468" y="254" fill="#f5b13d" font-size="16" font-weight="700">≈ 1.5%</text>
    <text x="32" y="342" fill="#f5f6f8">Cash + equivalents</text>
    <text x="32" y="366" fill="#8b909b" font-size="10">time average</text>
    <rect x="250" y="320" width="54" height="50" rx="6" fill="#ff4d87"/>
    <text x="319" y="350" fill="#ff8aaf" font-size="16" font-weight="700">≈ 0.4%</text>
    <text x="32" y="414" fill="#f5f6f8">T-bills ≤ 90 days</text>
    <text x="250" y="414" fill="#8b909b">minor component, not quantified in the text</text>
  </g>
  <text x="32" y="488" fill="#8b909b" font-size="9">Caution: these values are orders of magnitude drawn from different aggregate statistics.</text>
  <text x="32" y="506" fill="#8b909b" font-size="9">Source: Larsson, Kawamura and Shin, Federal Reserve, 8 May 2026, SEC N-PORT and N-CEN data.</text>
</svg>
<figcaption>The phrase "cash that is not cash" does not mean STIVs or repo are illiquid under normal conditions. It highlights that the fund depends on market instruments and counterparties before it has immediately usable bank cash.</figcaption>
</figure>

## Why a liquid asset is not cash

A repo held by a fund is a cash loan secured by securities. At maturity, the counterparty repays the cash and receives its collateral back. A STIV is an interest in a vehicle that invests cash in short-term instruments. In both cases, the fund earns a return and retains strong liquidity under normal conditions.

The qualification lies in the words "under normal conditions". Bank cash is already the settlement unit. A repo must mature, unwind or be transferred. A STIV interest must be redeemed by the vehicle that holds it. Their liquidity therefore depends on a second layer: collateral quality, money-market functioning, counterparty capacity, operational timing and market depth.

The Fed does not say these instruments are about to break. It makes a more cautious implication: bond-fund liquidity may be shaped not only by investor redemptions, but also by market conditions in the nonbank money-market instruments the funds use.

That dependence connects three compartments often analysed separately:

1. the bond fund, which promises daily redemption;
2. [money market funds](/en/guides/read-money-market-funds/) and liquidity pools held through STIVs;
3. the [repo and collateral market](/en/analysis/repo-the-liquidity-factory/), which turns a security into short-term funding.

The buffer does not eliminate liquidity transformation. It temporarily moves it into assets whose conversion looks immediate for as long as their own market keeps functioning.

## What the manager actually sells

The simplest mechanism would be a perfectly ordered queue: cash, then STIVs and repo, then liquid bonds, and finally hard-to-sell bonds. Academic research describes a more nuanced response.

A study by Hao Jiang, Dan Li and Ashley Wang, published in the *Journal of Financial and Quantitative Analysis* in 2021, finds that corporate bond funds tend to reduce liquid assets to meet redemptions during calm conditions. When aggregate uncertainty rises, they sell liquid and illiquid assets in closer proportions to preserve the portfolio's liquidity profile. Sector-wide selling during high-uncertainty periods then creates price pressure followed by reversals, consistent with constrained-sale effects. [Academic article and DOI](https://doi.org/10.1017/S0022109020000460).

It would therefore be wrong to write that funds always sell their best bonds first. Managers choose between two risks:

- consuming the buffer and leaving remaining investors with a less-liquid portfolio;
- selling bonds as well, accepting transaction costs while trying to preserve a more stable portfolio structure.

The choice depends on the scale of outflows, market liquidity, fund composition and the ability to rebuild the buffer quickly. SLAR measures the first line of defence, not the manager's entire strategy.

## A stock that falls after stress and is rebuilt later

The Fed series shows a recurring pattern: stress episodes consume the buffer, then subsequent inflows allow it to be rebuilt.

After the pandemic outbreak in the first quarter of 2020, the asset-weighted aggregate SLAR fell from **6.5% to 4.9%**. The authors say the decline was likely an outcome of heavy redemptions, without presenting the attribution as a causal identification. The ratio then rebuilt to **5.8%** in early 2021.

After another trough in mid-2022, amid monetary tightening and bond-fund outflows, it returned to **5.5%** by year-end. In the most recent part of the sample, it fell from **5.1% in the second quarter of 2025 to 4.3% in the third quarter**, after redemptions associated with April volatility. The decline was **0.8 percentage point**.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 900 455" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="slar-cycle-title-en slar-cycle-desc-en" style="width:100%;height:auto;background:#0c0d10;border:1px solid rgba(255,255,255,0.10);border-radius:12px;font-family:ui-monospace,monospace">
  <title id="slar-cycle-title-en">The buffer is consumed, then rebuilt</title>
  <desc id="slar-cycle-desc-en">Non-continuous reference points published by the Federal Reserve. In 2020, aggregate SLAR fell from 6.5 to 4.9 percent. It reached 5.8 percent in early 2021, 5.5 percent at the end of 2022, then declined from 5.1 to 4.3 percent between the second and third quarters of 2025.</desc>
  <text x="32" y="42" fill="#5eead4" font-size="17">// The buffer is consumed, then rebuilt</text>
  <text x="32" y="67" fill="#8b909b" font-size="11">published reference points, not a complete quarterly series</text>
  <g>
    <rect x="32" y="104" width="250" height="238" rx="10" fill="rgba(255,255,255,0.035)" stroke="rgba(255,255,255,0.10)"/>
    <text x="54" y="134" fill="#f5f6f8" font-size="12">COVID SHOCK, 2020 Q1</text>
    <text x="54" y="205" fill="#5eead4" font-size="31" font-weight="700">6.5%</text>
    <text x="159" y="205" fill="#8b909b" font-size="20">→</text>
    <text x="196" y="205" fill="#ff4d87" font-size="31" font-weight="700">4.9%</text>
    <text x="54" y="244" fill="#8b909b" font-size="10">−1.6 points</text>
    <text x="54" y="278" fill="#8b909b" font-size="10">Fed reading: heavy redemptions</text>
    <text x="54" y="298" fill="#8b909b" font-size="10">followed by buffer rebuilding</text>
    <rect x="305" y="104" width="250" height="238" rx="10" fill="rgba(255,255,255,0.035)" stroke="rgba(255,255,255,0.10)"/>
    <text x="327" y="134" fill="#f5f6f8" font-size="12">REBUILDING</text>
    <text x="327" y="205" fill="#5eead4" font-size="31" font-weight="700">5.8%</text>
    <text x="327" y="230" fill="#8b909b" font-size="10">early 2021</text>
    <text x="327" y="278" fill="#f5b13d" font-size="25" font-weight="700">5.5%</text>
    <text x="327" y="301" fill="#8b909b" font-size="10">end-2022, after the trough</text>
    <rect x="578" y="104" width="290" height="238" rx="10" fill="rgba(255,255,255,0.035)" stroke="rgba(255,255,255,0.10)"/>
    <text x="600" y="134" fill="#f5f6f8" font-size="12">VOLATILITY, 2025</text>
    <text x="600" y="205" fill="#5eead4" font-size="31" font-weight="700">5.1%</text>
    <text x="705" y="205" fill="#8b909b" font-size="20">→</text>
    <text x="742" y="205" fill="#ff4d87" font-size="31" font-weight="700">4.3%</text>
    <text x="600" y="244" fill="#8b909b" font-size="10">2025 Q2 to 2025 Q3</text>
    <text x="600" y="278" fill="#8b909b" font-size="10">−0.8 point after redemptions</text>
    <text x="600" y="298" fill="#8b909b" font-size="10">linked to April volatility</text>
  </g>
  <text x="32" y="390" fill="#8b909b" font-size="10">Dates and levels are those described in the note. Intermediate points are not shown.</text>
  <text x="32" y="413" fill="#8b909b" font-size="10">Source: Federal Reserve, SEC N-PORT and N-CEN data, published 8 May 2026.</text>
</svg>
<figcaption>The fall in the ratio after stress is observed. The precise attribution of each move to redemptions remains the Fed authors' interpretation rather than complete causal proof.</figcaption>
</figure>

The March 2020 precedent provides the market mechanism. Antonio Falato, Itay Goldstein and Ali Hortaçsu find that outflows were more severe in funds exposed to illiquid assets and fire-sale vulnerability. The Federal Reserve's corporate-bond backstop benefited the more fragile funds more strongly and helped reverse flows. Their study does not say such support will be repeated. It shows that in 2020, a backstop under the bond asset also stabilised fund liabilities. [NBER Working Paper 27559](https://doi.org/10.3386/w27559), subsequently published in the *Journal of Monetary Economics*.

## What the regulator sees, and what the public does not

The US framework contains several safeguards. Rule 22e-4 requires a liquidity-risk management programme, monthly asset classification, a general limit of **15% of net assets** in illiquid investments and, for some funds, a fund-determined highly liquid investment minimum. The [SEC states](https://www.sec.gov/rules-regulations/2016/10/investment-company-liquidity-risk-management-programs) that breaching the illiquid-asset limit or remaining below that minimum triggers confidential notification.

This framework does not impose one uniform minimum SLAR. The Fed notes that the highly liquid investment minimum does not apply in the same way to funds that primarily hold assets already classified as highly liquid, and the level is set by the fund.

The information gap remains. The public can download N-PORT portfolios, but not the C.7 classifications used by the regulator. The authors had to infer them from asset type, domicile, maturity and reported value.

In August 2024, the SEC adopted more frequent publication: one N-PORT report every month, filed within 30 days and made public within 60 days, instead of disclosing only the third month of each quarter. In April 2025, it [delayed the effective date](https://www.sec.gov/rules-regulations/2025/04/s7-26-22) until 17 November 2027, with a compliance date of 18 May 2028 for fund groups below $1bn in net assets.

Even after that reform, confidential fields will remain separate from public positions. More frequency is not full transparency, and a 60-day delay is not real time.

## Should the investor leaving pay the cost of exit?

The buffer protects a fund from rushed sales, but consuming it can transfer costs to remaining investors. If an investor is redeemed at NAV before transaction costs and market impact are fully incorporated, the others may inherit a portfolio that is more expensive to liquidate.

This first-mover advantage is already explained in our guide to [reading money market funds](/en/guides/read-money-market-funds/). Its relevance here is regulatory: the Financial Stability Board says explicit and implicit redemption costs, including material market impact, should be borne by investors who redeem. Its [revised 2023 recommendations](https://www.fsb.org/2023/12/revised-policy-recommendations-to-address-structural-vulnerabilities-from-liquidity-mismatch-in-open-ended-funds/) call for anti-dilution tools and stress tests.

[IOSCO completed the framework in May 2025](https://www.iosco.org/library/pubdocs/pdf/IOSCOPD799.pdf). Swing pricing, dual pricing and anti-dilution levies adjust the price paid by subscribing or redeeming investors. Quantity-based tools, redemption suspensions, gates, longer notice or settlement periods, side pockets and in-kind redemptions, instead limit the quantity or form of liquidity promised. Their availability depends on each jurisdiction's law.

These tools do not make bonds easier to sell. They change who bears the cost and can slow the race to the exit. Some also carry a side effect: if investors anticipate a gate or suspension, they may try to redeem before it activates. IOSCO says so explicitly.

## What is known, inferred and unknown

**Observed fact:** between 2019 and 2025, funds in the sample held a buffer near 5% on average, made mostly of STIVs and repo. The buffer fell after several outflow episodes and was rebuilt later.

**Academic result:** funds adapt the mix of assets sold to the market regime. Under high uncertainty, bond sales can contribute to price pressure beyond the individual fund.

**Cautious inference:** a simultaneous shock to fund redemptions and money-market liquidity would make the buffer less effective because two of its largest components depend on that same market plumbing.

**Unknown:** the aggregate SLAR on 25 July 2026. The Fed note ends in the third quarter of 2025 and detailed liquidity classifications remain confidential. The public data available in this source set therefore do not show how much buffer has been consumed since then or which securities were sold.

This separation prevents a structural vulnerability from being turned into a false immediate alarm.

## The useful dashboard

SLAR should not be read in isolation. A high ratio can signal prudent management, but may also compensate for a less-liquid portfolio. A low ratio can be acceptable if assets are genuinely easy to sell and redemptions remain small. No 5% threshold mechanically separates safety from forced selling.

Useful monitoring combines:

- net flows and their speed relative to fund assets;
- the share of cash, STIVs, repo and Treasury bills in N-PORT;
- corporate-bond liquidity through TRACE volumes, bid-ask spreads and transaction costs;
- [credit spreads](/en/guides/read-credit-spreads-oas/) and dispersion across quality buckets;
- any use of credit lines or interfund borrowing, reported in N-CEN;
- changes in redemption policy and activation of anti-dilution tools.

The right denominator is not only fund size. It is the speed at which investors can demand cash. A 4% buffer can be ample against daily outflows of a few basis points and insufficient against several days of heavy redemptions. Real coverage depends on a flow, not only a stock.

## The l0g view

A bond fund's promise of liquidity does not rely directly on every bond being liquid. It first relies on a thin intermediary portfolio placed between the investor and the credit market.

That portfolio does its job in normal times. STIVs pool cash management. Repo turns collateral into short-term cash. Treasury bills mature quickly. The fund can meet redemptions without immediately becoming a forced seller.

But the architecture reveals a hidden dependency. The bond fund is also a user of the money market. When its investor asks for cash, another layer of the system must turn a short-term asset into the settlement unit. If a shock reaches redemptions, repo and money-market vehicles at the same time, the buffer stops being a passive reserve and becomes a transmission channel.

Available data do not justify claiming that this shift occurred in July 2026. They allow the right question to be asked ahead of the next stress: **how much liquidity remains before the fund sells what it intended to keep?**

---

**Methodology**

- Main perimeter: 369 long-term US open-end mutual funds invested primarily in domestic corporate bonds, identified by the authors using N-PORT and N-CEN.
- Period: 2019 Q4 to 2025 Q3. The data do not measure later conditions.
- SLAR: cash and equivalents, Treasury bills maturing within 90 days, US repos maturing within 90 days and US STIVs, divided by net assets.
- ETFs and money market funds are excluded from the main sample.
- Composition figures retain the qualifications in the source. They are not the exact balance sheet of a particular fund.
- Links between redemptions and SLAR declines are presented as observations and the authors' interpretations, not as certain causality.
- Editorial cutoff: 25 July 2026.

**Primary sources**

- [Federal Reserve Board, "Measuring Mutual Fund Liquidity with N-PORT"](https://www.federalreserve.gov/econres/notes/feds-notes/measuring-mutual-fund-liquidity-with-n-port-20260508.html), 8 May 2026.
- [SEC, Form N-PORT](https://www.sec.gov/files/formn-port.pdf).
- [SEC, Investment Company Liquidity Risk Management Programs, Rule 22e-4](https://www.sec.gov/rules-regulations/2016/10/investment-company-liquidity-risk-management-programs).
- [SEC, delay to the N-PORT and N-CEN amendments](https://www.sec.gov/rules-regulations/2025/04/s7-26-22), 16 April 2025.
- [Financial Stability Board, revised recommendations for open-ended funds](https://www.fsb.org/2023/12/revised-policy-recommendations-to-address-structural-vulnerabilities-from-liquidity-mismatch-in-open-ended-funds/), 20 December 2023.
- [IOSCO, "Guidance for Open-ended Funds"](https://www.iosco.org/library/pubdocs/pdf/IOSCOPD799.pdf), 26 May 2025.
- [Jiang, Li and Wang, "Dynamic Liquidity Management by Corporate Bond Mutual Funds"](https://doi.org/10.1017/S0022109020000460), *Journal of Financial and Quantitative Analysis*, 2021.
- [Falato, Goldstein and Hortaçsu, "Financial Fragility in the COVID-19 Crisis"](https://doi.org/10.3386/w27559), NBER Working Paper 27559, revised 2021.
- [Goldstein, Jiang and Ng, "Investor Flows and Fragility in Corporate Bond Funds"](https://doi.org/10.1016/j.jfineco.2016.11.007), *Journal of Financial Economics*, 2017.
