---
title: "Repo and collateral: where liquidity is made, and where it breaks"
description: "The repo market turns collateral into cash overnight, and moves trillions of dollars a day. It is the invisible plumbing that funds leveraged positions in US debt. How it manufactures liquidity, why it seizes up on balance-sheet dates, and the effect of the end of the Fed's tightening since late 2025."
pubDate: 2026-07-13T14:56:00+02:00
updatedDate: 2026-07-13T14:56:00+02:00
tags: ["macro", "central banks", "liquidity", "markets"]
draft: false
sourceArticle: "repo-collateral-fabrique-liquidite"
sourceUpdatedDate: 2026-06-23
---
*Beneath the surface of markets, trillions of dollars change hands every day against collateral, for a few hours. This is the [repo](/en/glossary/repo/) market, the plumbing that funds Treasuries, dealers and leveraged positions. When it works, no one talks about it. When it seizes up, as in September 2019, short rates break loose within hours and the central bank must inject cash on an emergency basis. In late 2025, after the end of quantitative tightening, the first tremors reappeared. A read of a mechanism where liquidity does not fall from the sky: it is manufactured on the balance sheet of intermediaries, against collateral.*

A repurchase agreement, or repo, is a sale coupled with a repurchase. A borrower hands over a security, most often a US Treasury bond, and receives cash, with a commitment to buy the security back the next day at a slightly higher price. The difference is an interest rate. The loan is therefore secured by the security, the collateral, which makes repo far safer than an unsecured loan. The benchmark rate for the secured segment is SOFR, published each day by the New York Federal Reserve. The essential point holds in one idea: in repo, cash and collateral are two faces of the same coin, and liquidity is born from their circulation.

## How repo manufactures liquidity

The market connects three families of actors. On one side, cash lenders looking for a short, safe placement: mostly money market funds, but also banks and companies. On the other, cash borrowers who hold securities: hedge funds, asset managers, and indirectly the Treasury, whose debt is partly carried by leveraged investors. Between the two, the dealers, primary investment banks, who intermediate the flow by borrowing on one side to lend on the other.

Liquidity is made at this intermediary floor. The same security can serve as collateral several times, and the dealer transforms maturities and counterparties on its own balance sheet. The system's capacity to produce funding therefore depends directly on the space available on dealers' balance sheets, a resource constrained by post-2008 regulation. This is the first fault line: when this capacity shrinks, funding grows scarce even if cash exists elsewhere.

## The Fed's floor and ceiling

The Fed does not act on repo by setting a price, but by bracketing a corridor. The interest on reserve balances, IORB, steers the cost of cash for banks. At the bottom, the reverse repo facility, RRP, offers a floor placement: its use passed $2 trillion in 2023, before falling back near zero. At the top, the standing repo facility, SRF, lets eligible counterparties borrow cash against Treasuries, agency debt and agency MBS: it acts as a ceiling on short rates. All of it hinges on the Treasury's account at the Fed, the [TGA](/en/glossary/tga/), and on the overall level of bank reserves. This machinery, and the net-liquidity proxy that follows from it, is detailed in our [guide on liquidity](/en/guides/read-net-liquidity-tga-rrp/).

<figure class="infographic">
<svg viewBox="0 0 720 330" role="img" aria-label="Repo market diagram: cash lenders, dealers, borrowers, and the Fed corridor" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="330" fill="#0c0d10"/>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">The repo liquidity factory</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Collateral flows one way, cash the other. The Fed brackets the rate corridor.</text>
  <rect x="32" y="120" width="170" height="70" rx="8" fill="none" stroke="#5eead4" stroke-width="1.5"/>
  <text x="117" y="150" fill="#f5f6f8" font-size="13" text-anchor="middle">Cash lenders</text>
  <text x="117" y="170" fill="#8b909b" font-size="11" text-anchor="middle">money market funds, banks</text>
  <rect x="275" y="120" width="170" height="70" rx="8" fill="none" stroke="#f5b13d" stroke-width="1.5"/>
  <text x="360" y="150" fill="#f5f6f8" font-size="13" text-anchor="middle">Dealers</text>
  <text x="360" y="170" fill="#8b909b" font-size="11" text-anchor="middle">primary banks</text>
  <rect x="518" y="120" width="170" height="70" rx="8" fill="none" stroke="#ff4d87" stroke-width="1.5"/>
  <text x="603" y="150" fill="#f5f6f8" font-size="13" text-anchor="middle">Cash borrowers</text>
  <text x="603" y="170" fill="#8b909b" font-size="11" text-anchor="middle">hedge funds, leverage</text>
  <line x1="202" y1="143" x2="273" y2="143" stroke="#5eead4" stroke-width="2" marker-end="url(#ar)"/>
  <line x1="445" y1="143" x2="516" y2="143" stroke="#5eead4" stroke-width="2" marker-end="url(#ar)"/>
  <text x="360" y="112" fill="#5eead4" font-size="11" text-anchor="middle">cash →</text>
  <line x1="516" y1="168" x2="445" y2="168" stroke="#ff4d87" stroke-width="2" marker-end="url(#ar2)"/>
  <line x1="273" y1="168" x2="202" y2="168" stroke="#ff4d87" stroke-width="2" marker-end="url(#ar2)"/>
  <text x="360" y="208" fill="#ff4d87" font-size="11" text-anchor="middle">← collateral (Treasuries)</text>
  <line x1="275" y1="250" x2="445" y2="250" stroke="#8b909b" stroke-width="1" stroke-dasharray="3 3"/>
  <text x="360" y="245" fill="#5eead4" font-size="11" text-anchor="middle">ceiling: SRF (the Fed lends)</text>
  <text x="360" y="272" fill="#f5b13d" font-size="11" text-anchor="middle">IORB: interest on reserves</text>
  <text x="360" y="296" fill="#ff4d87" font-size="11" text-anchor="middle">floor: RRP (the Fed borrows)</text>
  <defs>
    <marker id="ar" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="#5eead4"/></marker>
    <marker id="ar2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="#ff4d87"/></marker>
  </defs>
</svg>
<figcaption>Dealers intermediate the flow: they borrow cash from money market funds and lend it to leveraged borrowers, against collateral. The Fed does not set the price, it brackets the corridor with RRP at the bottom and SRF at the top. Simplified diagram.</figcaption>
</figure>

## Where it breaks

The breaking points are known, and they owe less to a lack of cash than to its distribution and to balance-sheet constraints. At quarter-ends and reporting dates, dealers cut their intermediation to lighten their balance sheet, and secured rates can climb above the corridor. A sudden rise in the TGA, when the Treasury rebuilds its cash, drains reserves out of the system. A heavy Treasury issuance swells the collateral to be financed. And when reserves become scarce, the slightest of these tremors transmits to rates.

The reference lesson remains September 2019. Reserves had fallen to about $1.4 trillion, and a collision between tax payments and auction settlements sent repo rates jumping well above target, up to double-digit transactions, forcing the Fed to inject up to $100 billion a day. The regulators' conclusion: in a world of regulatory liquidity floors, so-called abundant reserves can prove illusory if they are poorly distributed.

## 2025-2026: the tremors are back

The setting changed in late 2025. The Fed closed its quantitative tightening on **1 December 2025**, bringing its balance sheet from $8.9 trillion in 2022 to about $6.5 trillion, nearly $2.4 trillion of liquidity withdrawn. Bank reserves came back to around $3 trillion. And stress signals reappeared even before the end of QT: in mid-September 2025, the standing facility was tapped for about $18.5 billion in a single day, the largest draw since its creation, with SOFR around **4.42%** and secured rates durably above the fed funds rate.

The Fed reacted. On **10 December 2025**, it removed the facility's aggregate cap, which was $500 billion a day, switched it to full allotment, renamed it to fight the stigma, and restarted reserve purchases of about $40 billion of Treasury bills a month until mid-April 2026. The test came fast: on **31 December 2025**, at the year turn, SOFR jumped to **3.87%**, some transactions reaching **4.0%**, and banks borrowed $75 billion from the facility before unwinding it all on 2 January. The ceiling worked, but it had to be triggered.

<figure class="infographic">
<svg viewBox="0 0 720 300" role="img" aria-label="Timeline of repo market strains, September 2025 to December 2025" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="300" fill="#0c0d10"/>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Signs of strain, late 2025</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Sources: New York Fed; FOMC; Wolf Street. Amounts in billions of dollars.</text>
  <line x1="60" y1="150" x2="690" y2="150" stroke="#2a2c33" stroke-width="1"/>
  <circle cx="130" cy="150" r="6" fill="#f5b13d"/>
  <text x="130" y="120" fill="#f5b13d" font-size="12" text-anchor="middle" font-weight="700">mid-Sep</text>
  <text x="130" y="180" fill="#d6d9df" font-size="11" text-anchor="middle">SRF: 18.5</text>
  <text x="130" y="196" fill="#8b909b" font-size="10" text-anchor="middle">SOFR ~4.42%</text>
  <circle cx="320" cy="150" r="6" fill="#5eead4"/>
  <text x="320" y="120" fill="#5eead4" font-size="12" text-anchor="middle" font-weight="700">Dec 1</text>
  <text x="320" y="180" fill="#d6d9df" font-size="11" text-anchor="middle">end of QT</text>
  <text x="320" y="196" fill="#8b909b" font-size="10" text-anchor="middle">b/s 6,500</text>
  <circle cx="500" cy="150" r="6" fill="#5eead4"/>
  <text x="500" y="120" fill="#5eead4" font-size="12" text-anchor="middle" font-weight="700">Dec 10</text>
  <text x="500" y="180" fill="#d6d9df" font-size="11" text-anchor="middle">SRF cap lifted</text>
  <text x="500" y="196" fill="#8b909b" font-size="10" text-anchor="middle">buys 40 / month</text>
  <circle cx="650" cy="150" r="6" fill="#ff4d87"/>
  <text x="650" y="120" fill="#ff4d87" font-size="12" text-anchor="middle" font-weight="700">Dec 31</text>
  <text x="650" y="180" fill="#d6d9df" font-size="11" text-anchor="middle">SOFR 3.87%</text>
  <text x="650" y="196" fill="#8b909b" font-size="10" text-anchor="middle">SRF: 75</text>
  <text x="32" y="270" fill="#8b909b" font-size="11">For reference, the facility had been near-unused from 2021 to summer 2025.</text>
</svg>
<figcaption>From mid-September to end-December 2025, the standing facility went from near-disuse to a $75 billion draw on 31 December. Sources: New York Fed (speeches and Open Market Trading Desk statements), FOMC implementation note of 10 December 2025, Wolf Street for the year turn.</figcaption>
</figure>

## Collateral, the hidden variable

There remains the piece we look at least: collateral itself. The whole system rests on the quality and availability of the Treasuries that back it. Yet the supply of Treasuries swells with deficits, and part of this debt is carried by leveraged investors who finance their purchases in repo, notably through the cash-futures [basis trade](/en/glossary/basis-trade/), whose size several market observers estimate at more than $1 trillion. This funding demand is near-structural, which makes repo dependent on dealers' ability to intermediate without limit. The Fed is, moreover, preparing central clearing of its standing operations to free up this balance-sheet capacity.

The Fed staff note on the "balance-sheet trilemma", published on **14 January 2026**, formalises the tension: the lower reserves fall relative to the stock of Treasuries, the greater the sensitivity of secured rates to liquidity shocks, and the higher volatility climbs absent intervention. The March 2026 survey of bank chief financial officers, cited by the New York Fed, shows a very steep reserve-demand curve: even a modest fall in reserves could trigger a marked rise in short rates. In other words, the cushion is thinner than it looks.

The lasting lesson is here. Liquidity is not a stock parked somewhere, it is a flow manufactured continuously on the balance sheet of constrained intermediaries, against a collateral whose supply keeps growing. As long as reserves are clearly abundant, the mechanism runs quietly. When they approach the ample threshold, balance-sheet dates, TGA spikes and auctions become so many tipping points, and the central bank has no choice but to keep its ceiling armed.

---

**Primary sources:** New York Federal Reserve, Roberto Perli speeches "Money Market Conditions and the Federal Reserve's Balance Sheet" (12 November 2025), "Reflections on the Early Days of Reserve Management Purchases" (26 March 2026) and remarks to the Atlanta Fed (19 May 2026); FOMC, implementation note and minutes of 9-10 December 2025, Open Market Trading Desk statements on the standing facility (10 December 2025); Board of Governors, FEDS Note "The Central Bank Balance-Sheet Trilemma" (14 January 2026) and H.4.1 release; Congressional Research Service, "The Federal Reserve's Balance Sheet"; Treasury, Quarterly Refunding Statement (4 February 2026); Wolf Street for the year-end draws. Figures and dates verified one by one. For the conceptual framework, reference work by the New York Fed (Liberty Street Economics), the BIS, the OFR and the Zoltan Pozsar archive on repo and collateral.
