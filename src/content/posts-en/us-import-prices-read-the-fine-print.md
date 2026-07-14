---
title: "US import prices: +1.9% in a month, but read the fine print"
description: "US import prices jump 1.9% in May 2026, +6.7% year on year. The figures are accurate. But behind the headline, fuel does all the work, and the idea that these indices could replace the CPI does not hold. A read of the BLS data."
pubDate: 2026-07-14T09:40:00+02:00
updatedDate: 2026-07-14T09:40:00+02:00
tags: ["macro", "inflation", "fed", "tariffs"]
draft: false
sourceArticle: "prix-import-mai-2026-petits-caracteres"
sourceUpdatedDate: 2026-06-16
---

This morning, the Bureau of Labor Statistics published its foreign-trade price indexes for May 2026. The figures are already circulating, often summarised like this: import prices up 1.9% on the month, an annualised pace of more than 25%, and 6.7% year on year; export prices up 1.3% on the month and 11.2% year on year. A frequent conclusion attached to these numbers: that this would be a far more reliable measure of inflation than the CPI.

First good news for those who like rigour: all four figures are accurate. I checked them line by line against the official release. Imports, all categories: +1.9% in May, +6.7% over twelve months. Exports, all categories: +1.3% in May, +11.2% year on year. None is invented or shifted. The bad news is that the headline hides the essential, and the sentence about the CPI is false. Let us take it properly.

## Fuel does all the work

The +1.9% "all categories" is an average that blends two worlds. On one side fuel, on the other everything else. And the gap is gaping.

<svg viewBox="0 0 700 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Breakdown of the rise in import prices, May 2026" style="width:100%;height:auto;background:#0c0d10;border:1px solid rgba(255,255,255,0.10);border-radius:12px">
  <text x="24" y="34" fill="#5eead4" font-family="monospace" font-size="15">// Import prices, May 2026 (monthly change, %)</text>
  <g font-family="monospace">
    <text x="24" y="92" fill="#b8fff5" font-size="13">Fuels</text>
    <rect x="150" y="78" width="430" height="22" rx="3" fill="#f5b13d"/>
    <text x="590" y="94" fill="#f5b13d" font-size="14">+12.5%</text>
    <text x="24" y="142" fill="#b8fff5" font-size="13">All categories</text>
    <rect x="150" y="128" width="65" height="22" rx="3" fill="#5eead4"/>
    <text x="225" y="144" fill="#5eead4" font-size="14">+1.9%</text>
    <text x="24" y="192" fill="#b8fff5" font-size="13">Ex-fuels</text>
    <rect x="150" y="178" width="28" height="22" rx="3" fill="#7aa2f7"/>
    <text x="188" y="194" fill="#7aa2f7" font-size="14">+0.8%</text>
  </g>
  <line x1="150" y1="62" x2="150" y2="218" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
  <text x="24" y="258" fill="#8b909b" font-family="monospace" font-size="11">Source: BLS, Import/Export Price Indexes, May 2026 (Table A).</text>
  <text x="24" y="278" fill="#8b909b" font-family="monospace" font-size="11">The fuel component, highly volatile, pulls the average up.</text>
</svg>

Imported fuel prices jumped 12.5% in the single month of May. Excluding fuels, import prices rise only 0.8%. The energy item, which weighs a fraction of the basket, therefore explains most of the acceleration on display. Over twelve months, the contrast is even more spectacular: imported fuel climbs 45.1% year on year, against 3.7% for prices excluding fuels.

This detail changes everything, because it says where the shock comes from. It is not a diffuse, generalised inflation that would have settled everywhere. It is mainly an oil shock, consistent with the surge in the barrel tied to the Strait of Hormuz. Energy is by nature the most volatile item of any price index, capable of reversing the following month. Building a runaway-inflation narrative on a single month of fuel is to mistake a spark for a fire.

## The annualisation trap

The claim "+1.9% on the month, or more than 25% annualised" is arithmetically correct. Compounding 1.9% over twelve months gives about 25.3%. But it is a classic rhetorical manipulation, and one has to know how to spot it.

To annualise is to assume that a monthly move will repeat identically twelve months in a row. Yet we have just seen that this +1.9% is driven by one item, fuel, whose defining feature is precisely never to repeat identically: it rises hard one month, falls back the next. Annualising the most volatile month produces the most spectacular and least informative figure. The proof by the facts: the actual year-on-year rate is 6.7%, not 25%. When you want the pace over a year, you read the figure over a year, you do not extrapolate a single month.

## Imports versus exports: the real story

The most interesting point of this release lies elsewhere, in the divergence between what America pays for its imports and what it charges for its exports.

<svg viewBox="0 0 700 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Import vs export prices, year on year" style="width:100%;height:auto;background:#0c0d10;border:1px solid rgba(255,255,255,0.10);border-radius:12px">
  <text x="24" y="34" fill="#5eead4" font-family="monospace" font-size="15">// Year on year, May 2026 (%)</text>
  <g stroke="rgba(255,255,255,0.10)" stroke-width="1">
    <line x1="60" y1="80" x2="676" y2="80"/><line x1="60" y1="140" x2="676" y2="140"/>
    <line x1="60" y1="200" x2="676" y2="200"/>
  </g>
  <g font-family="monospace">
    <text x="120" y="250" fill="#b8fff5" font-size="13" text-anchor="middle">Imports</text>
    <rect x="90" y="146" width="60" height="64" fill="#7aa2f7"/>
    <text x="120" y="138" fill="#7aa2f7" font-size="14" text-anchor="middle">+6.7%</text>
    <text x="290" y="250" fill="#b8fff5" font-size="13" text-anchor="middle">Exports</text>
    <rect x="260" y="103" width="60" height="107" fill="#5eead4"/>
    <text x="290" y="95" fill="#5eead4" font-size="14" text-anchor="middle">+11.2%</text>
    <text x="470" y="250" fill="#b8fff5" font-size="13" text-anchor="middle">Import fuel</text>
    <rect x="440" y="68" width="60" height="142" fill="#f5b13d"/>
    <text x="470" y="60" fill="#f5b13d" font-size="14" text-anchor="middle">+45.1%</text>
    <text x="620" y="250" fill="#b8fff5" font-size="13" text-anchor="middle">Import ex-fuel</text>
    <rect x="590" y="188" width="60" height="22" fill="#ff4d87"/>
    <text x="620" y="180" fill="#ff4d87" font-size="14" text-anchor="middle">+3.7%</text>
  </g>
  <line x1="60" y1="210" x2="676" y2="210" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>
  <text x="24" y="295" fill="#8b909b" font-family="monospace" font-size="11">Source: BLS, May 2025 to May 2026. Exports rise faster than imports excluding energy.</text>
</svg>

Export prices rise faster than import prices excluding energy: +11.2% year on year against +3.7%. This is a sign that US producers have pricing power on world markets, driven notably by agricultural exports (+5.5% year on year) and non-agricultural exports (+11.8%). For the terms of trade, this is rather favourable: the United States sells its exports at a higher price. But it is also a signal of domestic inflation diffusing outward, and a point of attention for the trading partners that import these American goods.

## Why this is not a substitute for the CPI

That leaves the most problematic claim: that these indices would be a far more reliable measure of inflation than the CPI. This is false, and confusing the two leads to erroneous conclusions.

Import/export price indexes measure the prices of goods **at the border**, at the moment they enter or leave the country. They include neither distribution margins, nor taxes, nor above all **services**, which make up the bulk of the American consumption basket (housing, health, education, leisure). The CPI, for its part, measures what the household actually pays, services included. The two do not measure the same thing and are not interchangeable.

What import prices really bring is a **leading** signal: they capture pressures on input costs before they feed through into consumer prices. As such, they are valuable for anticipating, and the 3.7% ex-energy rise year on year deserves attention, because it can feed the CPI in the months ahead. It is, moreover, a useful complement to what I described in [the great US inflation comeback](/en/analysis/us-inflation-comeback/). But a leading indicator is not a "truer" measure of lived inflation. It is another instrument, to be read for what it is.

## Beyond the headline

The figures in the release are accurate, and that is to the credit of those who relay them. But the honest reading is more nuanced than the headline. The monthly rise is overwhelmingly driven by fuel, a volatile item; the 25% annualisation is an artifice; the real information is the firmness of prices excluding energy and the strength of export prices; and these indices complement the CPI, they do not replace it.

To track these dynamics over time rather than on a single release, the [US macro risk](https://us.l0g.fr) dashboard aggregates the inflation and price-pressure series. One figure does not make a trend. One month of fuel does not make an inflation regime.

---

Sources: U.S. Bureau of Labor Statistics, Import/Export Price Indexes, release of 16 June 2026 (May 2026 data), Table A and press release. Year-on-year changes from May 2025 to May 2026. This is not investment advice.
