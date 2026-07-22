---
title: "How to Read CPI: U.S. Inflation, Measure by Measure"
description: "A reference guide to the Consumer Price Index: what the BLS actually measures, how the basket is built, why shelter accounts for about a third of it, the difference between headline, core and supercore inflation, the traps between raw and seasonally adjusted data, level and change, and why the Fed targets PCE rather than CPI. With May 2026 as a case study, when energy drove the headline."
summary: "The CPI, or Consumer Price Index, is the consumer price index published monthly by the BLS. It measures the average change in prices for a fixed basket of goods and services bought by U.S. urban households. It is the inflation gauge markets watch most closely, but the Fed targets PCE, and reading it properly requires separating headline from core, raw from seasonally adjusted data, and level from change."
pubDate: 2026-07-08T16:30:00+02:00
updatedDate: 2026-07-08T16:30:00+02:00
sourceGuide: "lire-le-cpi-inflation-us"
sourceUpdatedDate: 2026-06-29T18:00:00+02:00
tags: ["macro", "inflation", "central banks"]
category: macro
draft: false
---

*No macro number moves markets faster than the U.S. CPI, and few are read so badly. A headline says “inflation is at X,” futures jump, and the actual information sits three layers deeper, in a component almost nobody checked. This guide explains what the Bureau of Labor Statistics actually measures, how the index is built, and how to move from the headline to the signal. The May 2026 release is the running example: it bundles almost every reading trap into one print.*

## What CPI measures, and what it does not measure

The Consumer Price Index is a price index published every month by the Bureau of Labor Statistics. It measures the average change over time in the prices of a fixed basket of goods and services bought by households. Prices are collected monthly in **75** urban areas, from roughly **6,000** housing units for rent measures and **22,000** retail establishments for the rest, through visits, phone calls, websites and apps. The reference base is 1982–1984 = 100: an index level of 335 means the basket costs 3.35 times what it did in that base period.

Three versions coexist, and confusing them distorts the reading. CPI-U covers all urban consumers, more than **90%** of the U.S. population; this is the number markets and the press usually cite. CPI-W covers only urban wage earners and clerical workers, about **30%** of the population, but it is legally important because it is used to index Social Security benefits through the COLA. Finally, C-CPI-U, the chained index, incorporates consumer substitution across categories when relative prices change; it is first published as a preliminary estimate, then revised quarterly, and its reference base is December 1999 = 100.

One methodological point matters a lot. CPI relies on a modified Laspeyres formula: a basket whose quantities remain fixed until weights are updated. That construction tends to slightly overstate the cost of living, because it does not capture in real time the fact that households shift away from products whose prices rise fastest. The chained index corrects part of that bias, and it is one reason the Fed prefers a different index, which we return to below.

## The basket and its weights

CPI aggregates hundreds of components, but four blocks explain most of it. Services less energy services alone account for **60.3%** of the basket, commodities less food and energy **19.0%**, food **13.6%**, and energy **7.1%**. Food and energy are the most volatile blocks, and they are also the two blocks removed to calculate core inflation.

Inside services, one line dominates: shelter. The shelter component represents **35.3%** of the total basket, including **25.9%** for owners’ equivalent rent and **7.7%** for actual rent. No other component comes close. Mechanically, one tenth of a point on shelter moves the index more than a full point on apparel, which weighs **2.5%**. That is why the way the BLS measures shelter, explained below, shapes almost the entire CPI reading.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 360" role="img" aria-label="Composition of the U.S. CPI basket by major block and shelter weight" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="360" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">What sits inside the CPI basket</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Relative importance of the main blocks, as a share of the total basket.</text>
  <rect x="40" y="84" width="386.2" height="44" fill="#5eead4" opacity="0.9"></rect>
  <rect x="426.2" y="84" width="121.6" height="44" fill="#f5b13d" opacity="0.9"></rect>
  <rect x="547.8" y="84" width="86.8" height="44" fill="#ff4d87" opacity="0.85"></rect>
  <rect x="634.6" y="84" width="45.4" height="44" fill="#8b909b" opacity="0.85"></rect>
  <text x="44" y="111" fill="#0c0d10" font-size="12" font-weight="700">Services 60.3%</text>
  <text x="430" y="111" fill="#0c0d10" font-size="11" font-weight="700">Goods 19.0</text>
  <rect x="40" y="150" width="14" height="14" fill="#5eead4"></rect>
  <text x="62" y="162" fill="#d6d9df" font-size="12">Services less energy services: 60.3%</text>
  <rect x="40" y="172" width="14" height="14" fill="#f5b13d"></rect>
  <text x="62" y="184" fill="#d6d9df" font-size="12">Commodities less food and energy: 19.0%</text>
  <rect x="40" y="194" width="14" height="14" fill="#ff4d87"></rect>
  <text x="62" y="206" fill="#d6d9df" font-size="12">Food: 13.6%</text>
  <rect x="40" y="216" width="14" height="14" fill="#8b909b"></rect>
  <text x="62" y="228" fill="#d6d9df" font-size="12">Energy: 7.1%</text>
  <line x1="40" y1="256" x2="680" y2="256" stroke="#2a2c33" stroke-width="1"></line>
  <text x="40" y="284" fill="#5eead4" font-size="13" font-weight="700">Shelter alone: 35.3% of the basket</text>
  <rect x="40" y="298" width="466" height="20" fill="#5eead4" opacity="0.35"></rect>
  <rect x="40" y="298" width="342" height="20" fill="#5eead4" opacity="0.9"></rect>
  <text x="44" y="313" fill="#0c0d10" font-size="11" font-weight="700">OER 25.9%</text>
  <text x="388" y="313" fill="#d6d9df" font-size="11">actual rent 7.7%</text>
  <text x="40" y="340" fill="#8b909b" font-size="11">Source: BLS, CPI release Table 1, relative importance, March 2026.</text>
</svg>
<figcaption>The CPI basket is dominated by services, and within services by shelter, which weighs <strong>35.3%</strong> of the total index, including <strong>25.9%</strong> for owners’ equivalent rent. Food and energy, the two most volatile components, together account for only <strong>20.7%</strong>. Source: Bureau of Labor Statistics, CPI release Table 1.</figcaption>
</figure>

A clarification on energy: it is not a spending category in itself but a cross-cutting aggregate. The BLS reconstructs it from motor fuel, which sits inside transportation, and electricity and gas, which sit inside housing. Its weight can also move faster than other blocks. The base weight set in December 2025 was **6.3%**, but relative importance rose to **7.1%** in spring 2026 simply because energy prices rose and energy’s share of spending followed.

## Headline, core and supercore

Three aggregates structure almost every U.S. inflation discussion. Headline, or all-items CPI, is the number in the headline: it includes everything, including food and energy. Core inflation removes those two volatile components to isolate the underlying trend. The logic is not to pretend households do not eat or heat their homes, but to strip out noise that can hide the durable price dynamic. This is the measure economists and the Fed watch to judge inflation persistence.

Beyond core, central bankers also track a narrower aggregate: supercore, meaning services excluding energy and shelter. The idea is to capture the part of inflation most tied to wages and most sticky, after removing energy and the specific behavior of shelter. The BLS publishes the closest building block under “services less rent of shelter.” That indicator became central during the 2022–2023 tightening cycle, when the question was no longer whether goods inflation was cooling, but whether services inflation would hold firm.

In May 2026, the gap between these measures was telling. Headline CPI came in at **4.2%** year over year, its highest since April 2023, while core CPI stood at **2.9%**. Reading only the headline that month means concluding that inflation broadly reaccelerated; reading core shows underlying inflation still near 3%, elevated but not runaway. Both readings are true. They simply do not say the same thing.

## Shelter, or why CPI looks in the rear-view mirror

The BLS does not measure home purchase prices. In the cost-of-living framework behind CPI, an owner-occupied home is an investment asset, distinct from the shelter service it provides. What enters CPI is that service, and for owners its price is the rent they would have to pay to live in an equivalent home. That is OER, owners’ equivalent rent, used since 1987. Purchase prices, mortgage interest, property taxes and broker fees are excluded because they belong to capital, not consumption.

This construction explains the best-known lag in CPI. Market rents for new leases react quickly to housing conditions. CPI shelter, by contrast, measures an average of existing rents, most of which are renegotiated only when the lease renews, and each housing unit in the sample is repriced only about every six months. When market rents accelerate or slow, CPI shelter takes many months to follow. To anticipate the turning point, analysts follow leading measures such as the New Tenant Rent Index, built by the BLS and the Cleveland Fed using only new tenants.

A recent episode shows how much measurement mechanics can matter. During the October 2025 federal government shutdown, the BLS could not collect the scheduled rent sample for that month. In the absence of new observations, previous values were carried forward, temporarily understating shelter inflation. The effect reversed in April 2026, when the affected units were finally surveyed again: the accumulated increases entered all at once, lifting the monthly shelter change. In May 2026, once that catch-up had cleared, shelter returned to **0.3%** on the month and **3.4%** year over year, consistent with the slowdown since the 2023 peak. The lesson is simple: before reacting to one shelter month, check what the sample did that month.

## Reading traps

The first trap is monthly change versus year-over-year change. A single month at **0.5%** annualizes to about 6%, which sounds alarming, but one month does not make a trend and sampling error is real. The twelve-month rate smooths noise, but at the cost of a lag: it still carries shocks from the previous year, the base effects. A strong month dropping out of the twelve-month window can lower the year-over-year rate even as prices continue rising, and vice versa.

The second trap is raw versus seasonally adjusted data. Markets react to the monthly seasonally adjusted number, which removes recurring seasonal patterns, while the year-over-year rate is published on a not seasonally adjusted basis. The BLS recalculates seasonal factors every year with January data, using the X-13ARIMA-SEATS method, and revises the previous five years. A same series can therefore change after the fact even though nothing real changed.

The third trap is precision. CPI is an estimate from a sample, not a census of every price. The standard error of a monthly change in the all-items index is about **0.03** percentage point. For a published 0.2% monthly print, the 95% confidence interval is roughly 0.14% to 0.26%. A 0.1-point miss against consensus, though it moves markets, is statistically thin. Add to that the annual weight revision, based on the Consumer Expenditure Survey with roughly a two-year lag: 2026 weights reflect 2024 spending.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 340" role="img" aria-label="Breakdown of May 2026 U.S. inflation by major component, year over year" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="340" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">May 2026: energy drives the headline</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Year-over-year change, in percent. Headline jumps, core stays near 3%.</text>
  <text x="40" y="94" fill="#d6d9df" font-size="12">Energy</text>
  <rect x="200" y="82" width="431" height="18" fill="#ff4d87" opacity="0.9"></rect>
  <text x="639" y="96" fill="#ff4d87" font-size="12" font-weight="700">+23.5%</text>
  <text x="40" y="126" fill="#f5f6f8" font-size="12" font-weight="700">Headline, all items</text>
  <rect x="200" y="114" width="77" height="18" fill="#5eead4" opacity="0.95"></rect>
  <text x="285" y="128" fill="#5eead4" font-size="12" font-weight="700">+4.2%</text>
  <text x="40" y="158" fill="#d6d9df" font-size="12">Shelter</text>
  <rect x="200" y="146" width="62" height="18" fill="#8b909b" opacity="0.85"></rect>
  <text x="270" y="160" fill="#d6d9df" font-size="12">+3.4%</text>
  <text x="40" y="190" fill="#d6d9df" font-size="12">Food</text>
  <rect x="200" y="178" width="57" height="18" fill="#8b909b" opacity="0.85"></rect>
  <text x="265" y="192" fill="#d6d9df" font-size="12">+3.1%</text>
  <text x="40" y="222" fill="#f5b13d" font-size="12" font-weight="700">Core, less food and energy</text>
  <rect x="200" y="210" width="53" height="18" fill="#f5b13d" opacity="0.95"></rect>
  <text x="261" y="224" fill="#f5b13d" font-size="12" font-weight="700">+2.9%</text>
  <text x="40" y="254" fill="#d6d9df" font-size="12">Medical care</text>
  <rect x="200" y="242" width="48" height="18" fill="#8b909b" opacity="0.85"></rect>
  <text x="256" y="256" fill="#d6d9df" font-size="12">+2.6%</text>
  <line x1="40" y1="280" x2="680" y2="280" stroke="#2a2c33" stroke-width="1"></line>
  <text x="40" y="304" fill="#d6d9df" font-size="12">Energy explained more than 60% of the monthly increase, +0.5%.</text>
  <text x="40" y="324" fill="#8b909b" font-size="11">Gasoline: +40.5% year over year. Source: BLS, CPI release, June 10, 2026.</text>
</svg>
<figcaption>In May 2026, headline CPI reached <strong>4.2%</strong> year over year, driven by energy up <strong>23.5%</strong> and gasoline up <strong>40.5%</strong>, while core stayed at <strong>2.9%</strong>. Energy alone explained more than <strong>60%</strong> of the monthly all-items increase. Source: Bureau of Labor Statistics, June 10, 2026 release.</figcaption>
</figure>

## CPI versus PCE: why the Fed watches another index

This is the costliest misunderstanding for anyone following monetary policy. The Federal Reserve’s **2%** inflation target is not CPI. It is PCE, the price index for personal consumption expenditures calculated by the Bureau of Economic Analysis. The Fed signaled its preference for PCE in 2000 and embedded the 2% PCE target in its formal framework in 2012, reaffirmed every year since.

Three differences explain the gap. First, the formula: PCE is a chained Fisher index that incorporates consumer substitution, whereas CPI fixes its basket. Second, weights: shelter is roughly twice as heavy in CPI as in PCE, while health care is much heavier in PCE, notably because PCE counts spending made on behalf of households, such as employer-paid health insurance and Medicare or Medicaid programs. Third, scope: CPI covers only direct spending by urban households, while PCE covers a broader, urban and rural universe. As a result, since 2000 CPI has run about **0.39** percentage point above PCE on average. If the Fed hits its 2% PCE target, CPI would likely sit closer to 2.4%.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 320" role="img" aria-label="Comparison between CPI and PCE and historical gap between the two inflation measures" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="320" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Two thermometers, only one is the target</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">The Fed targets 2% on PCE. CPI structurally runs above it.</text>
  <text x="40" y="92" fill="#d6d9df" font-size="12" font-weight="700">Summer 2022 inflation peak, year over year</text>
  <text x="40" y="120" fill="#ff4d87" font-size="12">CPI</text>
  <rect x="150" y="108" width="450" height="20" fill="#ff4d87" opacity="0.9"></rect>
  <text x="608" y="124" fill="#ff4d87" font-size="12" font-weight="700">≈ 9.0%</text>
  <text x="40" y="152" fill="#5eead4" font-size="12">PCE</text>
  <rect x="150" y="140" width="355" height="20" fill="#5eead4" opacity="0.9"></rect>
  <text x="513" y="156" fill="#5eead4" font-size="12" font-weight="700">≈ 7.1%</text>
  <text x="40" y="184" fill="#8b909b" font-size="11">The widest gap ever measured between the two indexes.</text>
  <line x1="40" y1="206" x2="680" y2="206" stroke="#2a2c33" stroke-width="1"></line>
  <text x="40" y="232" fill="#f5f6f8" font-size="12" font-weight="700">What separates them</text>
  <text x="40" y="254" fill="#d6d9df" font-size="11.5">Formula: fixed basket, Laspeyres, for CPI; chained Fisher index for PCE.</text>
  <text x="40" y="274" fill="#d6d9df" font-size="11.5">Shelter: roughly twice as heavy in CPI; health care: heavier in PCE.</text>
  <text x="40" y="294" fill="#8b909b" font-size="11">Average gap since 2000: CPI exceeds PCE by about 0.39 point. Sources: Cleveland Fed, Atlanta Fed.</text>
</svg>
<figcaption>CPI and PCE move together, but CPI runs higher, by roughly <strong>0.39</strong> percentage point on average since 2000, and the gap reached a record in summer 2022, with CPI around <strong>9%</strong> and PCE around <strong>7.1%</strong>. The Fed targets 2% on PCE, not CPI. Sources: Cleveland Fed, Atlanta Fed.</figcaption>
</figure>

The practical consequence: CPI at 3% is not necessarily a Fed failure, and CPI at 2% would already be below target once translated into PCE terms. CPI remains the number markets trade because it is more visible and released about two weeks before PCE, but PCE is what shapes the decision. Confusing the two means misreading the reaction function.

## How to read CPI in practice

Everything is public and free. The release comes around the middle of the following month, at 8:30 a.m. Eastern time, on the BLS website; the June 2026 number is due on July 14, 2026. The efficient reading sequence is straightforward. Start with the monthly seasonally adjusted number, headline and core, to judge recent momentum. Check where the move came from by reading Table 1 line by line, not just the summary. Read shelter separately, because its weight and lag often distort the headline. Then place the whole thing inside the year-over-year rate, while keeping upcoming base effects in mind. Release dates should be checked directly with the BLS, listed on our [reference sites](/sites-reference/) page, and the [glossary](/glossaire/) explains the acronyms used here.

May 2026 bundles the lesson neatly. Headline jumped, but the component reading shows one cause: energy, whose spike came from the Middle East conflict and tensions around the Strait of Hormuz. This is exactly the transmission described in our analysis of the [energy bill from the Hormuz shock](/posts/crise-ormuz-asie-impacts-economiques/) and in the note on the [Washington–Tehran memorandum](/posts/mou-usa-iran-juin-2026/): an oil supply shock moves into consumer prices through fuel, lifts headline, and leaves core relatively untouched. The right reflex is not to conclude that broad inflation has returned, but to separate the energy supply shock from the underlying trend.

Inflation also has to be read with the rest of the macro plumbing. It cross-checks with money supply, whose growth preceded the 2021 wave, discussed in the guide on [M2 money supply](/guides/m2-masse-monetaire-risk-on/), and with the path of rates the Fed sets around its PCE target, visible through the [Fed balance sheet](/guides/lire-h41-bilan-fed/) and [system liquidity](/guides/liquidite-tresor-dts-tga-rrp/).

Read properly, CPI stops being a monthly verdict and becomes what it is: a careful but imperfect estimate of a reality nobody directly observes. The headline gives the market mood, Table 1 gives the cause, PCE gives the policy decision. Hold those three levels together and you stop being surprised by a number that “goes up” while underlying inflation did not move.

---

**Main sources:**

- [BLS, “Consumer Price Index, May 2026”](https://www.bls.gov/news.release/cpi.nr0.htm), June 10, 2026: headline +0.5% month over month and +4.2% year over year, core +2.9%, energy +23.5%, gasoline +40.5%, shelter +0.3% and +3.4%, energy’s contribution to the monthly increase.
- [BLS, CPI release Table 1, by expenditure category](https://www.bls.gov/news.release/cpi.t01.htm): relative importance of components: shelter 35.3%, OER 25.9%, energy 7.1%, food 13.6%, core 79.4%.
- [BLS, “Relative Importance and Weight Information for the CPI”](https://www.bls.gov/cpi/tables/relative-importance/): weights, annual update with January data, Laspeyres formula bias.
- [BLS, “Measuring Price Change in the CPI: Rent and Rental Equivalence”](https://www.bls.gov/cpi/factsheets/owners-equivalent-rent-and-rent.htm): OER definition, owner-occupied housing treated as an investment asset, exclusions.
- [BLS, CPI release schedule](https://www.bls.gov/schedule/news_release/cpi.htm): release dates and time, next release on July 14, 2026.
- [Cleveland Fed, “The CPI Versus the PCE Price Index”](https://www.clevelandfed.org/collections/infographics/2024/infogr-20241205-cpi-versus-pce-price-index): average gap of about 0.39 point in favor of CPI since 2000, formula, scope and weight differences.
- [Atlanta Fed, “What Is PCE? Explaining the Fed’s Preferred Inflation Measure”](https://www.atlantafed.org/what-we-study/inflation/2026/05/20/what-is-pce-explaining-the-feds-preferred-inflation-measure), May 20, 2026: adoption of PCE as target in 2000 and 2012, annual reaffirmation of the 2% target.
- [Property and Environment Research Center, Texas A&M, “One-Third of CPI: How Shelter Shapes Inflation Trends”](https://perc.tamu.edu/blog/2026/06/shelter-cpi.html), June 12, 2026: shelter weight, slowdown from the 2023 peak, measurement episode tied to the October 2025 government shutdown and April 2026 catch-up.
