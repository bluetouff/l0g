---
title: "Why the Fed can make money without printing, and why it can also lose"
description: "The Federal Reserve's result is a balance-sheet outcome, not a printing press effect. As long as interest income on assets exceeds the cost of liabilities and the operating balance, it remits to the Treasury. If the margin narrows, the same mechanism can move into deferred remittances."
pubDate: 2026-08-18T12:00:00+02:00
updatedDate: 2026-08-18T12:00:00+02:00
tags: ["fed", "balance-sheet", "rates", "treasury", "seigniorage", "monetary-policy"]
draft: false
sourceArticle: "pourquoi-la-fed-peut-gagner-sans-imprimer-mais-peut-aussi-perdre"
sourceUpdatedDate: 2026-08-18
---

The Federal Reserve is often described with a caricature: if it emits dollars, it automatically makes money. That is not how bank balance-sheet accounting works. Its result depends on the spread between what its assets bring in and what its liabilities cost, and then on how that result is distributed to the Treasury.

That is why [the Fed balance-sheet guide](/en/guides/read-h41-fed-balance-sheet/) helps: there is no single switch called "printing" for this result. The key is a standard but specific balance-sheet mechanism.

## Why the Fed can make money without printing

The Fed holds a large stock of interest-bearing assets and finances them with liabilities, just as a bank does. The difference is policy governance and the explicit remittance rule.

In the July 22, 2026 H.4.1 release, the asset side shows [6 462,797 billion USD of securities held outright](https://www.federalreserve.gov/releases/h41/current/default.htm), mainly Treasuries and, on the mortgage side, federal agency-backed mortgage securities worth more than 1.9 trillion.

On the liability side, the same release reports 4 151,474 billion USD in bank and institution deposits, 2 419,323 billion in currency in circulation, and 352 703 billion in reverse repo, plus the Treasury cash balances. The reported [total balance-sheet size](https://www.federalreserve.gov/releases/h41/current/default.htm) is 6 747,378 billion USD.

The principle is simple. Assets have an average yield, liabilities have a measurable cost, and the Fed also has operating costs. The [seigniorage](/glossary/#seigniorage) link is therefore an accounting outcome.

In the Federal Reserve's [combined quarterly report for March 2026](https://www.federalreserve.gov/aboutthefed/files/quarterly-report-20260515.pdf), complete available income is shown at 1,372 million USD, and net remittances to the Treasury at 949 million after expense and adjustment mechanics.

## When profit turns into deferred remittance

The stress signal appears when the pass-through cost rises faster than asset income.

The Fed's [July 29, 2026 statement](https://www.federalreserve.gov/newsevents/pressreleases/monetary20260729a.htm) and [corresponding implementation note](https://www.federalreserve.gov/newsevents/pressreleases/monetary20260729a1.htm) show the policy-rate setting context: 3.65 percent on reserves, 3.50 percent on standing ON RRP, and 3.75 percent on the standing repo facility.

In the same H.4.1 release, the line `earnings remittances due to the U.S. Treasury` is negative at -233.767 million USD at the consolidated level. In the Fed's accounting, that is a [deferred asset of remittances](https://www.federalreserve.gov/aboutthefed/chapter-1-balance-sheet.htm), not an immediate cash payment to the Treasury.

The Federal Reserve's May 2026 balance-sheet development note also describes a cumulative negative net result since September 2025 and a deferred asset around 244 billion. That is exactly the mechanism where scale does not guarantee immediate distribution.

## Why the Fed can also lose

This is not necessarily dramatic failure. It is often a normal balance-sheet transition.

1) Short-term market rates rise, reducing the net spread between asset yield and pass-through cost.  
2) Market valuation changes on long-duration assets create mark-to-market headwind without an immediate cash disbursement problem.

The Fed has a maturity ladder in its securities portfolio. In a fast rate regime, longer-duration holdings can lose market value. That does not always mean insolvency, but it can depress the distributable result.

The other cost is explicit. Bank reserves and liquidity facilities are liabilities in this accounting. [IORB facilities](https://www.federalreserve.gov/monetarypolicy/iorb-faqs.htm) and standing ON RRP carry a rate, and operational facilities from the New York Fed are not free. [Repo and reverse repo operations](https://www.newyorkfed.org/markets/domestic-market-operations/monetary-policy-implementation/repo-reverse-repo-agreements) are part of the same machinery. The liquidity backstop therefore has a price tag.

## A practical reading rule

To avoid confusion, read two data sets together.

- H.4.1, for weekly balance-sheet composition and the `remittances due` position.
- The consolidated quarterly report, for distributable profitability and adjustment mechanics.

One positive quarter can still co-exist with a large deferred asset stock. The signal is in the sequence and the interaction, not in one point in time.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 280" role="img" aria-label="Fed balance-sheet snapshot of 22 July 2026" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
<rect width="720" height="280" fill="#0c0d10"/>
<text x="32" y="36" fill="#f5f6f8" font-size="18" font-weight="700">Fed balance sheet as of 22 July 2026</text>
<text x="32" y="58" fill="#8b909b" font-size="12" textLength="656" lengthAdjust="spacingAndGlyphs">Source: Federal Reserve H.4.1, Wednesday 22 July 2026.</text>
<text x="32" y="86" fill="#8b909b" font-size="11">Assets (USD billions)</text>
<rect x="32" y="98" width="530" height="22" fill="#334155"/>
<rect x="32" y="98" width="430" height="22" fill="#5eead4" opacity="0.95"/>
<text x="570" y="114" fill="#d6d9df" font-size="12" text-anchor="end">6 463</text>
<text x="32" y="124" fill="#8b909b" font-size="11">Securities held outright: 6,462.797</text>
<text x="32" y="160" fill="#8b909b" font-size="11">Main liabilities</text>
<rect x="32" y="172" width="571" height="18" fill="#334155"/>
<rect x="32" y="172" width="571" height="18" fill="#7aa2f7" opacity="0.95"/>
<text x="611" y="186" fill="#d6d9df" font-size="12" text-anchor="end">6 700</text>
<rect x="32" y="206" width="357" height="16" fill="#9ca3af"/>
<text x="400" y="219" fill="#0c0d10" font-size="11">Deposits 4 151</text>
<rect x="32" y="236" width="208" height="16" fill="#fbbf24" opacity="0.9"/>
<text x="248" y="249" fill="#0c0d10" font-size="11">Currency 2 419</text>
<rect x="32" y="260" width="32" height="16" fill="#ff4d87"/>
<text x="70" y="273" fill="#0c0d10" font-size="11">RRP 353</text>
</svg>
<figcaption>The balance sheet is dominated by securities on the asset side and deposit liabilities on the other. A negative `earnings remittances` line is a timing signal in accounting, not an immediate break in policy operations.</figcaption>
</figure>

## Reading mistakes to avoid

The first confusion is to mix up monetary financing with income generation. The Fed can show a positive income result without increasing monetary base growth through new note emission for these periods.

The second is to treat a negative remittances line as insolvency. The question is distribution timing versus solvency of the institution.

## Sources

- [Federal Reserve, H.4.1 release](https://www.federalreserve.gov/releases/h41/current/default.htm)
- [Federal Reserve, FOMC statement of July 29, 2026](https://www.federalreserve.gov/newsevents/pressreleases/monetary20260729a.htm)
- [Federal Reserve, implementation note of July 29, 2026](https://www.federalreserve.gov/newsevents/pressreleases/monetary20260729a1.htm)
- [Federal Reserve FAQ on IORB](https://www.federalreserve.gov/monetarypolicy/iorb-faqs.htm)
- [Federal Reserve Bank of New York, repo and reverse repo operations](https://www.newyorkfed.org/markets/domestic-market-operations/monetary-policy-implementation/repo-reverse-repo-agreements)
- [Federal Reserve Banks Combined Quarterly Financial Report, March 2026](https://www.federalreserve.gov/aboutthefed/files/quarterly-report-20260515.pdf)
- [Federal Reserve, May 2026 balance sheet developments](https://www.federalreserve.gov/monetarypolicy/May-2026-Federal-Reserve-Balance-Sheet-Developments.htm)
- [Federal Reserve, Chapter 1, balance sheet and remittances](https://www.federalreserve.gov/aboutthefed/chapter-1-balance-sheet.htm)

## Limits

This is a strictly mechanical reading of official Fed disclosures. The weekly balance-sheet release and the quarterly profit report have different frequencies, so a quarter can appear positive while a deferred remittance stock is still high.
