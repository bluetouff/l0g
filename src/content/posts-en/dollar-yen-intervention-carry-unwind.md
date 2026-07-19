---
title: "Dollar-yen: the risk is not only the level, it is the unwind"
description: "USD/JPY above 161, a more restrictive BoJ, the threat of Japanese intervention: the main risk is less an FX line than a carry-trade and liquidity shock."
pubDate: 2026-07-14T09:30:00+02:00
updatedDate: 2026-07-14T09:30:00+02:00
tags: ["yen", "boj", "dollar", "carry trade", "macro", "markets"]
draft: false
sourceArticle: "dollar-yen-intervention-risque-carry-2026"
sourceUpdatedDate: 2026-06-27
---

Dollar-yen is back in a politically flammable zone. The official [FRED DEXJPUS](https://fred.stlouisfed.org/series/DEXJPUS) series gives **161.37 yen to the dollar on 18 June 2026**; [WSJ/LSEG](https://www.wsj.com/market-data/quotes/fx/USDJPY/historical-prices) quotes still put USD/JPY around **161.94 on 25 June** then **161.65 on 26 June**. This is not just a round number. It is a zone where Japan has already shown it can sell dollars to buy yen.

The institutional nuance matters. An FX intervention is decided by the Ministry of Finance ([MoF](/en/glossary/mof/)), not by the Bank of Japan ([BoJ](/en/glossary/boj/)) alone, even if the central bank can act as the operational agent. The register of the [Japanese Ministry of Finance](https://www.mof.go.jp/english/policy/international_policy/reference/feio/index.htm) shows net intervention of **¥11,734.9bn between 28 April and 27 May 2026**. In other words, Tokyo has already spent ammunition. The market is now testing the willingness to do it again.

<svg viewBox="0 0 760 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Dollar yen around the 161 zone in June 2026" style="display:block;width:100%;height:auto;background:#0c0d10;border:1px solid rgba(255,255,255,0.10);border-radius:8px;margin:18px 0 24px">
  <text x="26" y="36" fill="#5eead4" font-family="monospace" font-size="15">// USD/JPY: back in the intervention zone</text>
  <g stroke="rgba(255,255,255,0.10)" stroke-width="1">
    <line x1="86" y1="250" x2="720" y2="250"/>
    <line x1="86" y1="200" x2="720" y2="200"/>
    <line x1="86" y1="150" x2="720" y2="150"/>
    <line x1="86" y1="100" x2="720" y2="100"/>
  </g>
  <g fill="#8b909b" font-family="monospace" font-size="11" text-anchor="end">
    <text x="74" y="254">150</text>
    <text x="74" y="204">155</text>
    <text x="74" y="154">160</text>
    <text x="74" y="104">165</text>
  </g>
  <polyline points="110,160 220,145 330,132 440,138 550,130 660,133" fill="none" stroke="#5eead4" stroke-width="4"/>
  <line x1="86" y1="136" x2="720" y2="136" stroke="#ff4d87" stroke-width="2" stroke-dasharray="6 5"/>
  <text x="705" y="126" fill="#ff4d87" font-family="monospace" font-size="12" text-anchor="end">161-162 zone</text>
  <circle cx="550" cy="130" r="6" fill="#f5b13d"/>
  <circle cx="660" cy="133" r="6" fill="#f5b13d"/>
  <g fill="#b8fff5" font-family="monospace" font-size="10" text-anchor="middle">
    <text x="110" y="278">May</text>
    <text x="330" y="278">18 Jun</text>
    <text x="550" y="278">25 Jun</text>
    <text x="660" y="278">26 Jun</text>
  </g>
  <text x="26" y="304" fill="#8b909b" font-family="monospace" font-size="10">Sources: FRED DEXJPUS, WSJ/LSEG. Data accessed 27 June 2026.</text>
</svg>

The paradox is that the BoJ has already tightened. Its monetary policy decision of [16 June 2026](https://www.boj.or.jp/en/mopo/mpmdeci/index.htm/) took the policy rate to **1.0%**. But a Japanese rate at 1% remains low against still-high US yields, in the wake of [Warsh's first FOMC](/en/analysis/warsh-first-fomc/) and a Fed constrained by inflation. As long as the yield gap stays massive, selling yen to buy dollars remains a rational trade.

That is where the risk becomes systemic. The [yen carry](/en/guides/read-the-carry-trade/) works like an implicit short position on volatility: you borrow in cheap yen, buy better-yielding assets, and all is well as long as the yen does not rise sharply. A successful intervention therefore does not only create a candle on the FX chart. It can force investors to cut, at the same time, positions in dollars, Treasuries, equities, credit or crypto, depending on how they are funded.

<svg viewBox="0 0 760 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Transmission of yen carry-trade risk" style="display:block;width:100%;height:auto;background:#0c0d10;border:1px solid rgba(255,255,255,0.10);border-radius:8px;margin:18px 0 24px">
  <text x="26" y="36" fill="#5eead4" font-family="monospace" font-size="15">// The real risk: a mechanical unwind of the carry</text>
  <g font-family="monospace" font-size="13" fill="#e7e9ee">
    <rect x="38" y="82" width="190" height="58" rx="6" fill="none" stroke="#5eead4"/>
    <text x="58" y="108">weak yen</text><text x="58" y="128">cheap funding</text>
    <rect x="286" y="82" width="190" height="58" rx="6" fill="none" stroke="#f5b13d"/>
    <text x="306" y="108">asset purchases</text><text x="306" y="128">dollar, rates, risk</text>
    <rect x="534" y="82" width="190" height="58" rx="6" fill="none" stroke="#ff4d87"/>
    <text x="554" y="108">intervention</text><text x="554" y="128">forced yen buyback</text>
    <rect x="286" y="220" width="190" height="58" rx="6" fill="none" stroke="#7aa2f7"/>
    <text x="306" y="246">unwind</text><text x="306" y="266">sale of liquid assets</text>
  </g>
  <g stroke="#5eead4" stroke-width="2" fill="none">
    <path d="M228 111 L286 111"/><path d="M476 111 L534 111"/><path d="M629 140 C620 206 520 249 476 249"/><path d="M286 249 C210 230 146 170 132 140"/>
  </g>
  <g fill="#5eead4">
    <path d="M282 111 l-9 -5 v10 z"/><path d="M530 111 l-9 -5 v10 z"/><path d="M481 249 l9 -5 v10 z"/><path d="M133 145 l-3 -10 l10 4 z"/>
  </g>
  <text x="26" y="320" fill="#8b909b" font-family="monospace" font-size="10">Reading: intervention becomes dangerous when it turns an FX loss into a forced sale of liquid assets.</text>
</svg>

My assessment: Japanese intervention is likely if the pace of depreciation reaccelerates, but it is not enough to durably reverse the trend without support from rates. The threshold to watch is therefore not only **162** or **165**. It is the combination: a fast rise in USD/JPY, MoF rhetoric, yen implied volatility, and speculative positioning published by the CFTC (see [reading the COT report](/en/guides/read-cftc-cot-report/)). The [Yen Carry dashboard](https://yct.l0g.fr) is built precisely to track this mechanism.

The Treasuries channel also deserves attention. Japan remains a major creditor of the United States according to the [US Treasury TIC](https://ticdata.treasury.gov/resource-center/data-chart-center/tic/Documents/slt_table5.html) data. If defending the yen forces sales of dollars or changes the currency hedges of Japanese investors, the effect can transmit to US yields, and thus to global liquidity. This is the same world described in our guide on [net liquidity](/en/guides/read-net-liquidity-tga-rrp/): FX, Treasuries and market funding are not three separate subjects.

A sober conclusion: a weak yen helps Japanese exporters, but a yen that breaks too fast becomes a global market risk. Intervention can calm the spot. It can also trigger what it seeks to avoid: a disorderly exit from the carry.

---

*This is not investment advice. Market data accessed 27 June 2026.*

**Primary sources:** [FRED, DEXJPUS](https://fred.stlouisfed.org/series/DEXJPUS), last available observation as of 18 June 2026; [WSJ/LSEG, USD/JPY historical prices](https://www.wsj.com/market-data/quotes/fx/USDJPY/historical-prices), quotes for 25 and 26 June 2026; [Bank of Japan, monetary policy decisions](https://www.boj.or.jp/en/mopo/mpmdeci/index.htm/), 16 June 2026; [Ministry of Finance Japan, Foreign Exchange Intervention Operations](https://www.mof.go.jp/english/policy/international_policy/reference/feio/index.htm), April-May 2026 record; [U.S. Treasury TIC, major foreign holders of Treasury securities](https://ticdata.treasury.gov/resource-center/data-chart-center/tic/Documents/slt_table5.html); [CFTC, Commitments of Traders](https://www.cftc.gov/MarketReports/CommitmentsofTraders/index.htm).
