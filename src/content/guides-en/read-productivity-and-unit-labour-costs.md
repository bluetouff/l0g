---
title: "Productivity: capital, labour and unit labour costs"
description: "Read output per hour, total factor productivity and unit labour costs through transparent calculations, measurement choices and composition effects."
summary: "Labour productivity divides real output by hours worked. Equipment, skills, organisation and the composition of activity all affect it. Unit labour costs divide total labour compensation by real output, connecting pay and production through an accounting identity."
pubDate: 2026-10-19T10:40:00+02:00
sourceGuide: "lire-la-productivite-et-les-couts-salariaux"
sourceUpdatedDate: 2026-10-19T10:40:00+02:00
tags: ["macro", "productivity", "wages", "growth"]
category: macro
draft: false
---

More output can come from longer working hours, better equipment or improved organisation. Productivity analysis first separates the amount produced from the resources used, then asks which changes made the result possible. That distinction connects growth statistics with the practical conditions of production.

This guide draws on BLS and OECD methods and Chad Syverson’s research. Its numerical examples are **hypothetical**, comparing periods of equal length. Physical units make the arithmetic transparent; national accounts require a more elaborate treatment of prices and quality to measure real output.

## Measure output per hour

**Labour productivity** is real output divided by hours worked. Headcount records people, whereas hours capture their time at work. The numerator also needs a precise scope: an industry’s gross output, its value added and an economy’s GDP measure different objects. The [BLS concepts handbook](https://www.bls.gov/opub/hom/msp/concepts.htm) sets out these distinctions.

Assume a homogeneous activity produces **100 units in 1,000 hours**, or 0.10 unit per hour. In the following period it produces **110 units in the same 1,000 hours**. Productivity rises to 0.11, a **10% increase**. The observation establishes a measured gain; explaining it requires evidence about the resources and practices behind production.

New machinery, better scheduling, more intensive use of existing capacity or a different skill mix could contribute. The [OECD productivity manual](https://www.oecd.org/content/dam/oecd/en/publications/reports/2001/07/measuring-productivity-oecd-manual_g1gh2484/9789264194519-en.pdf) distinguishes single-factor measures from approaches incorporating several production inputs.

## Separate capital deepening from broader efficiency

Labour productivity can rise when each working hour uses more services from capital. A faster machine, software or a more suitable building supplies productive services whose measurement differs from the asset’s resale value. **Capital services** aim to represent that contribution during the reporting period. [OECD manual on capital measurement](https://www.oecd.org/en/publications/measuring-capital-oecd-manual_9789264193260-en.html).

**Total factor productivity**, or TFP, is the residual after accounting for the selected inputs and their weights. Depending on the framework, inputs include capital, labour and intermediate purchases. The residual can contain technical progress, organisation, capacity utilisation and measurement error. Its meaning depends on the model and data; a direct interpretation as innovation requires additional evidence. The [BLS calculation handbook](https://www.bls.gov/opub/hom/msp/calculation.htm) describes its index construction and weighting conventions.

In a simplified value-added decomposition, TFP growth equals output growth less weighted capital and labour growth. The growth convention, cost shares and assumptions must accompany that calculation. Growth accounting organises measured contributions; identifying a cause requires further evidence about firms or sectors.

## Calculate labour cost per unit of output

**Unit labour costs**, or ULC, divide total labour compensation by real output. Equivalently, they divide hourly compensation by labour productivity. Compensation should include the labour-cost components covered by the source, rather than only employees’ take-home pay. The [BLS documents this relationship](https://www.bls.gov/opub/hom/opt/calculation.htm).

In our example, hourly compensation of **20 CU** produces a **20,000 CU** labour bill for 1,000 hours and a cost of **200 CU per output unit**. Next period, hourly compensation reaches **21 CU**, a 5% increase, and output rises to 110 units. Total compensation becomes 21,000 CU and unit cost falls to **190.91 CU**, rounded to two decimals.

The exact change is **1.05 / 1.10 − 1 = −4.55%**, after rounding. Subtracting productivity growth of 10% from compensation growth of 5% gives the approximate answer of −5%. The chart separates the compensation effect at unchanged productivity from the productivity effect at a fixed hourly compensation level.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 365" role="img" aria-labelledby="premium-productivity-en-title premium-productivity-en-desc" style="display:block;width:100%;max-width:600px;height:auto;margin-inline:auto;font-family:var(--font-read);background:var(--color-surface);border:1px solid var(--color-line);border-radius:12px">
<title id="premium-productivity-en-title">Compensation and productivity</title>
<desc id="premium-productivity-en-desc">Hypothetical equal-length periods. Grey curve: hourly compensation index 100; green: 105. ULC = hourly compensation / productivity × 100. A→B→C separates the effects; index axes are zoomed around 100. l0g calculations.</desc>
<text x="24" y="32" fill="var(--color-bright)" font-size="22" text-anchor="start" font-weight="700">Compensation and productivity</text>
<text x="24" y="56" fill="var(--color-muted)" font-size="14" text-anchor="start">Unit labour cost depends on their ratio</text>
<line x1="60" y1="270" x2="420" y2="270" stroke="var(--color-line)" stroke-width="1"/>
<text x="49" y="275" fill="var(--color-muted)" font-size="14" text-anchor="end">80</text>
<line x1="60" y1="226.25" x2="420" y2="226.25" stroke="var(--color-line)" stroke-width="1"/>
<text x="49" y="231.25" fill="var(--color-muted)" font-size="14" text-anchor="end">90</text>
<line x1="60" y1="182.5" x2="420" y2="182.5" stroke="var(--color-line)" stroke-width="1"/>
<text x="49" y="187.5" fill="var(--color-muted)" font-size="14" text-anchor="end">100</text>
<line x1="60" y1="138.75" x2="420" y2="138.75" stroke="var(--color-line)" stroke-width="1"/>
<text x="49" y="143.75" fill="var(--color-muted)" font-size="14" text-anchor="end">110</text>
<line x1="60" y1="95" x2="420" y2="95" stroke="var(--color-line)" stroke-width="1"/>
<text x="49" y="100" fill="var(--color-muted)" font-size="14" text-anchor="end">120</text>
<text x="60" y="291" fill="var(--color-muted)" font-size="14" text-anchor="middle">90</text>
<text x="180" y="291" fill="var(--color-muted)" font-size="14" text-anchor="middle">100</text>
<text x="300" y="291" fill="var(--color-muted)" font-size="14" text-anchor="middle">110</text>
<text x="420" y="291" fill="var(--color-muted)" font-size="14" text-anchor="middle">120</text>
<line x1="60" y1="90" x2="60" y2="270" stroke="var(--color-muted)" stroke-width="1"/>
<line x1="60" y1="270" x2="420" y2="270" stroke="var(--color-muted)" stroke-width="1"/>
<path d="M 60 133.889 L 66 136.575 L 72 139.231 L 78 141.858 L 84 144.457 L 90 147.027 L 96 149.57 L 102 152.086 L 108 154.574 L 114 157.037 L 120 159.474 L 126 161.885 L 132 164.271 L 138 166.632 L 144 168.969 L 150 171.282 L 156 173.571 L 162 175.838 L 168 178.081 L 174 180.302 L 180 182.5 L 186 184.677 L 192 186.832 L 198 188.966 L 204 191.078 L 210 193.171 L 216 195.243 L 222 197.295 L 228 199.327 L 234 201.34 L 240 203.333 L 246 205.308 L 252 207.264 L 258 209.202 L 264 211.121 L 270 213.023 L 276 214.907 L 282 216.774 L 288 218.624 L 294 220.457 L 300 222.273 L 306 224.072 L 312 225.856 L 318 227.623 L 324 229.375 L 330 231.111 L 336 232.832 L 342 234.537 L 348 236.228 L 354 237.904 L 360 239.565 L 366 241.212 L 372 242.845 L 378 244.464 L 384 246.068 L 390 247.66 L 396 249.237 L 402 250.802 L 408 252.353 L 414 253.891 L 420 255.417" fill="none" stroke="var(--color-muted)" stroke-width="2.5"/>
<path d="M 60 109.583 L 66 112.403 L 72 115.192 L 78 117.951 L 84 120.679 L 90 123.378 L 96 126.048 L 102 128.69 L 108 131.303 L 114 133.889 L 120 136.447 L 126 138.979 L 132 141.484 L 138 143.964 L 144 146.418 L 150 148.846 L 156 151.25 L 162 153.629 L 168 155.985 L 174 158.317 L 180 160.625 L 186 162.91 L 192 165.173 L 198 167.414 L 204 169.632 L 210 171.829 L 216 174.005 L 222 176.159 L 228 178.293 L 234 180.407 L 240 182.5 L 246 184.573 L 252 186.627 L 258 188.662 L 264 190.678 L 270 192.674 L 276 194.653 L 282 196.613 L 288 198.555 L 294 200.479 L 300 202.386 L 306 204.276 L 312 206.149 L 318 208.004 L 324 209.844 L 330 211.667 L 336 213.473 L 342 215.264 L 348 217.039 L 354 218.799 L 360 220.543 L 366 222.273 L 372 223.987 L 378 225.687 L 384 227.372 L 390 229.043 L 396 230.699 L 402 232.342 L 408 233.971 L 414 235.586 L 420 237.188" fill="none" stroke="var(--color-signal)" stroke-width="2.5"/>
<line x1="180" y1="182.5" x2="180" y2="160.625" stroke="var(--color-accent)" stroke-width="2"/><polygon points="180,160.625 176,167.625 184,167.625" fill="var(--color-accent)"/>
<line x1="180" y1="160.625" x2="300" y2="202.386" stroke="var(--color-signal)" stroke-width="2"/><polygon points="300,202.386 294.704,196.308 292.074,203.863" fill="var(--color-signal)"/>
<circle cx="180" cy="182.5" r="4" fill="var(--color-muted)"/>
<text x="168" y="202.5" fill="var(--color-muted)" font-size="15" text-anchor="end" font-weight="700">A · 100</text>
<circle cx="180" cy="160.625" r="4" fill="var(--color-accent)"/>
<text x="180" y="145.625" fill="var(--color-accent)" font-size="15" text-anchor="start" font-weight="700">B · 105</text>
<circle cx="300" cy="202.386" r="4" fill="var(--color-signal)"/>
<text x="315" y="184.386" fill="var(--color-signal)" font-size="15" text-anchor="start" font-weight="700">C · 95.45</text>
<text x="24" y="79" fill="var(--color-paper)" font-size="15" text-anchor="start">ULC · base 100</text>
<text x="240" y="316" fill="var(--color-paper)" font-size="16" text-anchor="middle">Productivity · base 100</text>
<text x="24" y="344" fill="var(--color-muted)" font-size="14" text-anchor="start">A→B: pay +5%   B→C: productivity +10%</text>
</svg>
<figcaption>Hypothetical equal-length periods. Grey curve: hourly compensation index 100; green: 105. ULC = hourly compensation / productivity × 100. A→B→C separates the effects; index axes are zoomed around 100. l0g calculations. <a href="https://www.bls.gov/opub/hom/opt/calculation.htm">Formula: BLS</a>.</figcaption>
</figure>

The result leaves several business choices open: retain margins, reduce some prices, increase other spending or invest. ULC isolates labour cost per unit, while energy, materials, finance, competition and pricing policy also affect selling prices. Relating it to observed inflation requires matching coverage with the [CPI](/en/guides/read-cpi-inflation-us/) or [PCE](/en/guides/read-pce-inflation-fed/) measures being discussed.

## Detect changes in the composition of activity

An aggregate can improve even when productivity within each activity stays constant. Consider two workshops making a comparable product: A produces 10 units per hour and B produces 20. With 50 hours each, they produce 1,500 units in 100 hours, averaging 15 units per hour. Shift the allocation to 25 hours in A and 75 in B, and output becomes 1,750 units, averaging 17.5.

That **16.67% increase**, rounded, comes entirely from reallocating hours. Real economies require more complex volume measures and boundaries, but the example shows why an aggregate change needs sectoral context. [Syverson’s review of productivity determinants](https://pubs.aeaweb.org/doi/10.1257/jel.49.2.326), published in the *Journal of Economic Literature* in 2011, examines heterogeneity among producers and internal and external mechanisms associated with their performance.

Testing an explanation requires evidence that matches its proposed mechanism: equipment actually used, skills, management practices, reallocation or entry. A correlation between information-technology investment and productivity may guide an investigation, while selection effects, learning delays and simultaneous organisational changes still need to be addressed.

## Compare real compensation and productivity carefully

Comparisons need consistent populations, hours and deflators. Median wages for a particular group, average compensation for all labour and compensation adjusted for consumer prices answer different questions. Real value added uses an output deflator, which can evolve differently from the prices households pay.

For distribution within production, calculate labour’s share of nominal value added using compatible coverage. For purchasing power, use a household-relevant price measure. Keeping the two exercises distinct helps explain how different trends can coexist. Compensation and labour-share conventions are set out in the [BLS formulas](https://www.bls.gov/opub/hom/msp/calculation.htm).

## Sources and limitations

For each series, preserve its output definition, hours, inputs, deflator, period and revision date. Quarterly releases may use annualised rates, which differ from year-on-year and annual-average growth, as explained in the [GDP guide](/en/guides/read-gdp-growth-contributions-revisions/). The worked examples demonstrate identities and composition effects. They provide no estimate of a country’s growth potential or the causal effect of a particular technology.
