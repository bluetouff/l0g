---
title: "Reading GDP: growth, contributions and revisions"
description: "Read a US GDP release: real output, annualised growth, percentage-point contributions, inventories, imports and revisions. A practical guide with a dated BEA example."
summary: "GDP measures value added produced within an economy during a period. Reading its growth requires separating output from prices, identifying the rate convention, using official contributions and preserving the publication vintage."
pubDate: 2026-10-19T08:35:00+02:00
sourceGuide: "lire-le-pib-croissance-contributions-revisions"
sourceUpdatedDate: 2026-10-19T08:35:00+02:00
tags: ["macro", "GDP", "growth", "statistics"]
category: macro
draft: false
---

A growth number becomes useful when you can identify the output it measures, the period it covers, its components and the evidence available to the statisticians. This guide uses the US Bureau of Economic Analysis (BEA) release as a working document. Check the reporting conventions again before comparing it with another country’s figures.

The worked example is **fixed to the September 30, 2026 release** for the second quarter. It illustrates revisions rather than providing a continuously updated indicator. Our [analysis of that quarter’s advance estimate](/en/analysis/us-gdp-private-demand-q2-2026/) retains the information available when it was written.

## Output at current prices and in real terms

Gross domestic product, or **GDP**, measures value added produced within an economy over a period. Value added is output less the goods and services used up in producing it. Adding every business’s sales along a supply chain would count intermediate products repeatedly. The [BEA primer](https://www.bea.gov/sites/default/files/methodologies/nipa_primer.pdf) explains the production, expenditure and income approaches.

**Nominal GDP** values output at current prices. **Real GDP** removes the effects of price changes to measure changes in volume. Nominal growth can therefore reflect both more output and higher prices. Simply subtracting CPI inflation does not reproduce the real GDP calculation: the coverage and price methods differ. The [BEA statistical conventions](https://www.bea.gov/news/gdp-release-additional-information) explain chained quantity and price indexes; our [CPI guide](/en/guides/read-cpi-inflation-us/) covers the consumer-price measure.

Total GDP does not measure the distribution of income, well-being or wealth. Real GDP per person adjusts for population size but still leaves distribution unresolved. Keep that distinction when interpreting rising production as an improvement in living standards. [BEA primer](https://www.bea.gov/sites/default/files/methodologies/nipa_primer.pdf).

## Identify the rate before comparing the numbers

The BEA generally reports headline quarterly changes at **seasonally adjusted annual rates**. Annualisation compounds a quarter’s pace as if it continued for four quarters. It is neither a forecast nor the change from the same quarter a year earlier.

Using comparable real levels Qₜ and Qₜ₋₁, quarter-on-quarter growth is `100 × (Qₜ / Qₜ₋₁ − 1)`. The annualised rate is `100 × ((Qₜ / Qₜ₋₁)⁴ − 1)`. Year-on-year growth compares Qₜ with Qₜ₋₄. Annual-average growth compares the averages for two calendar years. These are four different questions. [BEA explanation of annualised rates](https://www.bea.gov/help/faq/122).

For the worked example, the BEA reports **2.2% annualised** and **0.6% quarter on quarter**, rounded separately from the underlying figures. Converting an already rounded annualised headline back to a quarterly rate need not recover the published rounded quarterly figure. Neither number is a twelve-month comparison. [BEA, September 30 technical notes](https://www.bea.gov/news/2026/gdp-third-estimate-industries-corporate-profits-state-gdp-and-state-personal-income-2nd).

## Read contributions in percentage points

The expenditure identity is `GDP = consumption + investment + government spending + exports − imports`, using the national accounts’ definitions. Investment includes fixed investment and changes in inventories. Government spending here means government consumption and gross investment. [BEA definitions](https://www.bea.gov/news/gdp-release-additional-information).

A component’s **growth rate** describes its own change. Its **contribution to GDP growth**, measured in percentage points, describes its part in the change of the aggregate. A small component expanding rapidly can contribute less than a large component growing slowly. Component growth rates cannot simply be added.

Open **table 1.5.2**, which reports contributions, beside **table 1.1.1**, which reports growth rates. The [BEA release](https://www.bea.gov/news/2026/gdp-third-estimate-industries-corporate-profits-state-gdp-and-state-personal-income-2nd) identifies both. Choose a complete breakdown without adding a subtotal to its own components. Displayed contributions may not sum exactly at the final decimal because of rounding.

Do not reconstruct the breakdown by adding chained-dollar components. They are generally non-additive. The BEA publishes contribution measures specifically to make it possible to analyse the drivers of real growth without that mistake. [BEA primer, discussion of real measures](https://www.bea.gov/sites/default/files/methodologies/nipa_primer.pdf).

## Inventories and imports need closer inspection

Output entering an inventory is counted when it is produced. When it is sold later, the final expenditure is offset by an inventory withdrawal, preventing the same production from being counted again. To interpret growth, examine the movement in inventory investment rather than merely observing that warehouses still hold more goods. [BEA primer, automobile example](https://www.bea.gov/sites/default/files/methodologies/nipa_primer.pdf).

Imports are subtracted to isolate domestic production: consumption, investment and government purchases can already include goods and services produced abroad. A negative import contribution alone does not establish falling demand or a net loss of domestic output caused by trade. For the external accounts, continue with the [balance-of-payments guide](/en/guides/read-the-balance-of-payments/). [BEA primer, GDP coverage](https://www.bea.gov/sites/default/files/methodologies/nipa_primer.pdf).

## Keep the vintage attached to the estimate

The BEA normally releases advance, second and third quarterly estimates, followed by broader updates. The source information becomes more complete over time. **The third estimate can still be revised.** A change between releases can be a new estimate of the same quarter, rather than extra growth occurring between the publication dates. [BEA revision procedures](https://www.bea.gov/news/gdp-release-additional-information).

<figure class="infographic" style="padding-bottom:1.75rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 310" role="img" aria-labelledby="gdp-vintages-title gdp-vintages-desc" style="display:block;width:100%;max-width:600px;height:auto;margin-inline:auto;font-family:var(--font-mono);background:var(--color-surface);border:1px solid var(--color-line);border-radius:12px">
<title id="gdp-vintages-title">One quarter, revised estimates</title>
<desc id="gdp-vintages-desc">The same quarter, not three successive quarters. Bars share a zero baseline. Source: BEA, September 30, 2026 release, real GDP row.</desc>
<text x="24" y="32" fill="var(--color-bright)" font-size="20" font-weight="700">One quarter, revised estimates</text>
<text x="24" y="56" fill="var(--color-muted)" font-size="14">Q2 2026 · real annualised growth (%)</text>
<text x="24" y="90" fill="var(--color-paper)" font-size="17">July 30 · advance</text>
<text x="456" y="90" text-anchor="end" fill="var(--color-amber)" font-size="19" font-weight="700">1.5%</text>
<rect x="24" y="100" width="432" height="22" rx="4" fill="var(--color-surface-2)"/>
<rect x="24" y="100" width="259.2" height="22" rx="4" fill="var(--color-amber)"/>
<text x="24" y="156" fill="var(--color-paper)" font-size="17">August 26 · second</text>
<text x="456" y="156" text-anchor="end" fill="var(--color-amber)" font-size="19" font-weight="700">1.5%</text>
<rect x="24" y="166" width="432" height="22" rx="4" fill="var(--color-surface-2)"/>
<rect x="24" y="166" width="259.2" height="22" rx="4" fill="var(--color-amber)"/>
<text x="24" y="222" fill="var(--color-paper)" font-size="17">September 30 · third</text>
<text x="456" y="222" text-anchor="end" fill="var(--color-signal)" font-size="19" font-weight="700">2.2%</text>
<rect x="24" y="232" width="432" height="22" rx="4" fill="var(--color-surface-2)"/>
<rect x="24" y="232" width="380.16" height="22" rx="4" fill="var(--color-signal)"/>
<text x="24" y="286" fill="var(--color-muted)" font-size="14">BEA · 30/09/2026 · zero baseline</text>
</svg>
<figcaption>The same quarter, not three successive quarters. Bars share a zero baseline. Source: BEA, September 30, 2026 release, real GDP row.</figcaption>
</figure>

Here, the move from **1.5% to 2.2%** is a **0.7 percentage-point revision** to the annualised growth rate. The September release also revises earlier quarters. Combining the revised quarter with a previous quarter copied from an older release would create an inconsistent series. Use one vintage to analyse the economy with currently available information; retain the contemporary vintage when studying reactions to a past announcement. [BEA, September 30, 2026 release](https://www.bea.gov/sites/default/files/2026-09/gdp2q26-3rd.pdf).

## Compare output with private demand and income

**Real final sales to private domestic purchasers** combine consumer spending and private fixed investment. They exclude changes in inventories, net exports and government spending. This helps examine final private demand, but it neither replaces GDP nor shows how demand is distributed across households. [BEA definitions](https://www.bea.gov/news/gdp-release-additional-information).

**Gross domestic income**, or GDI, measures activity through income earned and costs incurred in production. It is conceptually equal to GDP, but different statistical sources produce a discrepancy in the estimates. A divergence is a reason to investigate measurement uncertainty, rather than automatically choosing one as the “true” series. Cross-check with [employment data](/en/guides/read-us-employment-report-nfp/) and [PCE prices](/en/guides/read-pce-inflation-fed/). [BEA definitions of GDP and GDI](https://www.bea.gov/news/gdp-release-additional-information).

Two negative quarters also do not reproduce the US recession-dating procedure. The NBER examines a range of indicators and the depth, diffusion and duration of declining activity. [NBER dating procedure](https://www.nber.org/research/business-cycle-dating/business-cycle-dating-procedure-frequently-asked-questions).

## A repeatable release checklist

For each release, record:

- the country, reference quarter and publication date;
- whether the series is nominal or real, and seasonally adjusted;
- whether growth is quarterly, annualised, year on year or annual average;
- official contributions and their units, without double counting;
- final private demand, inventories and external trade;
- revisions to the current quarter and earlier periods, followed by the limits of the interpretation.

## Sources and limitations

The text links to the BEA and NBER. The [primer](https://www.bea.gov/sites/default/files/methodologies/nipa_primer.pdf) establishes the concepts, the [release conventions](https://www.bea.gov/news/gdp-release-additional-information) explain the units, and the [September 30, 2026 PDF](https://www.bea.gov/sites/default/files/2026-09/gdp2q26-3rd.pdf) fixes the illustrated vintage. Interactive tables can change after publication: preserve the dated document to reproduce this example.

This guide explains US GDP reporting. It offers neither a growth forecast nor an investment recommendation. An accounting contribution is a decomposition, not proof of economic causation. Sources checked through October 19, 2026.
