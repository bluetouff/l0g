---
title: "How to Read H.4.1: the Fed Balance Sheet, Line by Line"
seoTitle: "Fed H.4.1 guide: reserves, TGA and reverse repos | l0g"
description: "Read the Fed's assets, bank reserves, Treasury account, reverse repos and losses, with a reconciled numerical example and two explanatory diagrams."
pubDate: 2026-07-08T16:30:00+02:00
updatedDate: 2026-11-11T12:00:00+01:00
sourceGuide: "lire-h41-bilan-fed"
sourceUpdatedDate: 2026-11-11T12:00:00+01:00
tags: ["macro", "central banks", "liquidity", "methodology"]
category: fed
summary: "H.4.1 reports the accounts of the twelve Federal Reserve Banks. Table 5 is their consolidated Wednesday balance sheet; Table 1 explains factors affecting reserves using weekly averages and Wednesday levels. A rigorous reading keeps those conventions separate, reconciles assets with liabilities plus capital, and checks the applicable monetary policy instructions."
draft: false
---

A central bank's balance sheet links the assets it holds to the money and other liabilities issued against them. For the Federal Reserve, the starting document is **H.4.1**, normally published on Thursday at **4:30 p.m. New York time**, subject to the adjustments shown in the [official release calendar](https://www.federalreserve.gov/releases/h41/).

Bank reserves belong on the liability side: they are balances the Fed owes to eligible depository institutions. They are distinct from banks' equity and from households' bank deposits. Reserves can increase while securities holdings fall if other liabilities shrink by more. The Fed's [balance-sheet guide](https://www.federalreserve.gov/monetarypolicy/bst_fedsbalancesheet.htm) sets out that accounting structure.

**Checked on November 11, 2026:** the example uses the [November 5 release](https://www.federalreserve.gov/releases/h41/20261105/), including the Wednesday, November 4 observations. It was the most recent release listed in the calendar when this guide was revised. Its figures remain tied to that date; they are not a live balance-sheet counter.

## Choose the table and observation convention

H.4.1 consolidates the accounts of the **twelve Reserve Banks**, eliminating internal transactions. The [release description](https://www.federalreserve.gov/releases/h41/about.htm) establishes this scope. The United States also has a system of regional balance sheets: consolidation prevents their internal claims from being counted as claims on the wider economy.

| Reading question | Table | Essential check |
| --- | --- | --- |
| How large is the balance sheet? | 5, consolidated statement | Wednesday level; assets and liabilities plus capital. |
| Why did reserves change? | 1, factors affecting reserves | Weekly average or Wednesday level; keep the same column. |
| How much maturity remains in the portfolio? | 2, maturity distribution | Remaining maturity and accounting convention. |
| Which securities are held for customers? | 1A, memorandum items | Separate custody holdings from the Fed's own assets. |
| How are accounts distributed across regions? | 6, individual Reserve Banks | Eliminate internal claims before aggregating. |

**Table 1 is not the consolidated balance sheet.** It includes some Treasury items that affect reserve supply. Its total factors supplying reserves must not be substituted for total assets in Table 5. The [Fed's explanation](https://www.federalreserve.gov/monetarypolicy/bst_fedsbalancesheet.htm) makes this distinction explicit.

The source unit is **millions of dollars**. All amounts below are divided by **1,000** to express them in billions. A daily average over a week and a Wednesday observation remain different measures after conversion.

## Assets: securities, lending and other claims

Securities held outright form the largest block: Treasury securities, federal agency debt and **mortgage-backed securities**, or MBS, guaranteed by Fannie Mae, Freddie Mac or Ginnie Mae. MBS holdings decline, among other reasons, as mortgage principal is repaid. The [November 5 release](https://www.federalreserve.gov/releases/h41/20261105/) gives the accounting conventions in its footnotes.

In a **repo**, the Fed temporarily provides funds against securities under an agreement to reverse the transaction. It records an asset, as it does with discount-window lending. Liquidity swaps with foreign central banks appear separately. Buying a security, providing short-term secured funding and supplying dollars to a foreign central bank are different operations. The [New York Fed describes repo transactions](https://www.newyorkfed.org/markets/domestic-market-operations/monetary-policy-implementation/repo-reverse-repo-agreements).

**Unamortized premiums and discounts** are the remaining difference between a security’s purchase price and face value, allocated over its life. They adjust the securities’ carrying amount and appear separately in the [release](https://www.federalreserve.gov/releases/h41/20261105/).

For **November 4, 2026**, Table 5 reconciles as follows. The residual groups other assets; it is not a single lending facility.

| Assets | Billions of dollars |
| --- | ---: |
| Treasury securities, including inflation compensation | 4,578.777 |
| MBS | 1,883.522 |
| Agency debt | 2.347 |
| Unamortized premiums and discounts, net | 180.455 |
| Loans | 9.234 |
| Other assets, calculated as the residual | 93.810 |
| **Total assets** | **6,748.145** |

Source: [November 5 H.4.1, Table 5, Wednesday column](https://www.federalreserve.gov/releases/h41/20261105/). Net premiums and discounts are **206.934 − 26.479 = 180.455 billion dollars**. Other assets equal the total less the preceding five blocks.

<figure class="central-bank-figure" style="padding-bottom:1rem">
<div class="cb-wide">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 574" role="img" lang="en" aria-labelledby="cb-fed-ledger-en-d-title cb-fed-ledger-en-d-desc" style="width:100%;height:auto;display:block;font-family:var(--font-read, Arial, sans-serif)">
<title id="cb-fed-ledger-en-d-title">The two sides of the ledger</title><desc id="cb-fed-ledger-en-d-desc">Simplified Fed balance sheet. Assets include securities, loans and other claims. Liabilities include bank reserves, notes, the Treasury account and reverse repos. Capital completes the accounting identity. Areas do not represent amounts.</desc>
<rect x="0" y="0" width="800" height="574" rx="0" fill="var(--color-ink, #0c0d10)"/>
<line x1="32" y1="12" x2="768" y2="12" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1"/>
<text x="32" y="37" fill="var(--color-muted, #8b909b)" font-size="14" font-weight="400" text-anchor="start"><tspan x="32" dy="0">l0g / CENTRAL-BANK ACCOUNTS</tspan></text>
<text x="768" y="37" fill="var(--color-signal, #5eead4)" font-size="14" font-weight="400" text-anchor="end"><tspan x="768" dy="0">01</tspan></text>
<text x="32" y="78" fill="var(--color-paper, #e7e9ee)" font-size="29" font-weight="500" text-anchor="start"><tspan x="32" dy="0">The two sides of the ledger</tspan></text>
<text x="32" y="111" fill="var(--color-muted, #8b909b)" font-size="16" font-weight="400" text-anchor="start"><tspan x="32" dy="0">Fed · schematic, not to scale</tspan></text>
<path d="M40 163 Q215 143 392 163 L392 451 Q215 431 40 451 Z" fill="var(--color-surface, #121419)" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M408 163 Q585 143 760 163 L760 451 Q585 431 408 451 Z" fill="var(--color-surface, #121419)" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
<line x1="400" y1="165" x2="400" y2="452" stroke="var(--color-muted, #8b909b)" stroke-width="1"/>
<text x="63" y="194" fill="var(--color-signal, #5eead4)" font-size="15" font-weight="400" text-anchor="start"><tspan x="63" dy="0">ASSETS</tspan></text>
<text x="431" y="194" fill="var(--color-amber, #f5b13d)" font-size="15" font-weight="400" text-anchor="start"><tspan x="431" dy="0">LIABILITIES + CAPITAL</tspan></text>
<line x1="64" y1="214" x2="366" y2="214" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1"/>
<line x1="64" y1="288" x2="366" y2="288" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1"/>
<line x1="64" y1="362" x2="366" y2="362" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1"/>
<line x1="432" y1="214" x2="735" y2="214" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1"/>
<line x1="432" y1="258" x2="735" y2="258" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1"/>
<line x1="432" y1="302" x2="735" y2="302" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1"/>
<line x1="432" y1="346" x2="735" y2="346" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1"/>
<line x1="432" y1="390" x2="735" y2="390" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1"/>
<rect x="75" y="230" width="26" height="35" rx="0" fill="var(--color-ink, #0c0d10)" stroke="var(--color-signal, #5eead4)" stroke-width="1"/><rect x="69" y="235" width="26" height="35" rx="0" fill="var(--color-ink, #0c0d10)" stroke="var(--color-signal, #5eead4)" stroke-width="1"/><line x1="75" y1="247" x2="89" y2="247" stroke="var(--color-signal, #5eead4)" stroke-width="1"/><line x1="75" y1="254" x2="89" y2="254" stroke="var(--color-signal, #5eead4)" stroke-width="1"/>
<text x="120" y="246" fill="var(--color-paper, #e7e9ee)" font-size="20" font-weight="400" text-anchor="start"><tspan x="120" dy="0">Securities held</tspan></text>
<text x="120" y="271" fill="var(--color-muted, #8b909b)" font-size="16" font-weight="400" text-anchor="start"><tspan x="120" dy="0">Treasuries, MBS</tspan></text>
<path d="M70 314 L97 314 L97 338 L70 338 Z M76 308 L91 308" fill="none" stroke="var(--color-signal, #5eead4)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
<text x="120" y="321" fill="var(--color-paper, #e7e9ee)" font-size="20" font-weight="400" text-anchor="start"><tspan x="120" dy="0">Repos and loans</tspan></text>
<text x="120" y="346" fill="var(--color-muted, #8b909b)" font-size="16" font-weight="400" text-anchor="start"><tspan x="120" dy="0">Claims on borrowers</tspan></text>
<path d="M70 394 L100 394 M94 388 L100 394 L94 400 M100 410 L70 410 M76 404 L70 410 L76 416" fill="none" stroke="var(--color-signal, #5eead4)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
<text x="120" y="396" fill="var(--color-paper, #e7e9ee)" font-size="20" font-weight="400" text-anchor="start"><tspan x="120" dy="0">Swaps, other assets</tspan></text>
<text x="120" y="421" fill="var(--color-muted, #8b909b)" font-size="16" font-weight="400" text-anchor="start"><tspan x="120" dy="0">Selected grouped entries</tspan></text>
<circle cx="440" cy="237" r="3" fill="var(--color-signal, #5eead4)" stroke="var(--color-signal, #5eead4)" stroke-width="1"/>
<text x="454" y="243" fill="var(--color-signal, #5eead4)" font-size="18" font-weight="400" text-anchor="start"><tspan x="454" dy="0">Bank reserves</tspan></text>
<circle cx="440" cy="281" r="3" fill="var(--color-paper, #e7e9ee)" stroke="var(--color-paper, #e7e9ee)" stroke-width="1"/>
<text x="454" y="287" fill="var(--color-paper, #e7e9ee)" font-size="18" font-weight="400" text-anchor="start"><tspan x="454" dy="0">Notes in circulation</tspan></text>
<circle cx="440" cy="325" r="3" fill="var(--color-amber, #f5b13d)" stroke="var(--color-amber, #f5b13d)" stroke-width="1"/>
<text x="454" y="331" fill="var(--color-amber, #f5b13d)" font-size="18" font-weight="400" text-anchor="start"><tspan x="454" dy="0">Treasury account · TGA</tspan></text>
<circle cx="440" cy="369" r="3" fill="var(--color-paper, #e7e9ee)" stroke="var(--color-paper, #e7e9ee)" stroke-width="1"/>
<text x="454" y="375" fill="var(--color-paper, #e7e9ee)" font-size="18" font-weight="400" text-anchor="start"><tspan x="454" dy="0">Reverse repos, other deposits</tspan></text>
<circle cx="440" cy="413" r="3" fill="var(--color-muted, #8b909b)" stroke="var(--color-muted, #8b909b)" stroke-width="1"/>
<text x="454" y="419" fill="var(--color-muted, #8b909b)" font-size="18" font-weight="400" text-anchor="start"><tspan x="454" dy="0">Capital</tspan></text>
<path d="M64 470 L64 483 L366 483 L366 470" fill="none" stroke="var(--color-signal, #5eead4)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M432 470 L432 483 L734 483 L734 470" fill="none" stroke="var(--color-amber, #f5b13d)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
<text x="215" y="514" fill="var(--color-signal, #5eead4)" font-size="19" font-weight="400" text-anchor="middle"><tspan x="215" dy="0">Total assets</tspan></text>
<text x="400" y="514" fill="var(--color-muted, #8b909b)" font-size="24" font-weight="400" text-anchor="middle"><tspan x="400" dy="0">=</tspan></text>
<text x="584" y="514" fill="var(--color-amber, #f5b13d)" font-size="19" font-weight="400" text-anchor="middle"><tspan x="584" dy="0">Liabilities + capital</tspan></text>
<text x="32" y="552" fill="var(--color-muted, #8b909b)" font-size="14" font-weight="400" text-anchor="start"><tspan x="32" dy="0">Source: Fed, H.4.1, Table 5 · simplified structure.</tspan></text>
</svg>
</div>
<div class="cb-mobile">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 678" role="img" lang="en" aria-labelledby="cb-fed-ledger-en-m-title cb-fed-ledger-en-m-desc" style="width:100%;height:auto;display:block;font-family:var(--font-read, Arial, sans-serif)">
<title id="cb-fed-ledger-en-m-title">The two sides of the ledger</title><desc id="cb-fed-ledger-en-m-desc">Simplified Fed balance sheet. Assets include securities, loans and other claims. Liabilities include bank reserves, notes, the Treasury account and reverse repos. Capital completes the accounting identity. Areas do not represent amounts.</desc>
<rect x="0" y="0" width="400" height="678" rx="0" fill="var(--color-ink, #0c0d10)"/>
<line x1="24" y1="12" x2="376" y2="12" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1"/>
<text x="24" y="37" fill="var(--color-muted, #8b909b)" font-size="14" font-weight="400" text-anchor="start"><tspan x="24" dy="0">l0g / CENTRAL-BANK ACCOUNTS</tspan></text>
<text x="376" y="37" fill="var(--color-signal, #5eead4)" font-size="14" font-weight="400" text-anchor="end"><tspan x="376" dy="0">01</tspan></text>
<text x="24" y="78" fill="var(--color-paper, #e7e9ee)" font-size="24" font-weight="500" text-anchor="start"><tspan x="24" dy="0">The two sides</tspan><tspan x="24" dy="30">of the ledger</tspan></text>
<text x="24" y="149" fill="var(--color-muted, #8b909b)" font-size="15" font-weight="400" text-anchor="start"><tspan x="24" dy="0">Fed · schematic, not to scale</tspan></text>
<path d="M24 196 Q105 185 192 196 L192 526 Q105 515 24 526 Z" fill="var(--color-surface, #121419)" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M208 196 Q295 185 376 196 L376 526 Q295 515 208 526 Z" fill="var(--color-surface, #121419)" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
<line x1="200" y1="200" x2="200" y2="526" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1"/>
<text x="40" y="224" fill="var(--color-signal, #5eead4)" font-size="15" font-weight="400" text-anchor="start"><tspan x="40" dy="0">ASSETS</tspan></text>
<text x="224" y="218" fill="var(--color-amber, #f5b13d)" font-size="14" font-weight="400" text-anchor="start"><tspan x="224" dy="0">LIABILITIES</tspan><tspan x="224" dy="20">+ CAPITAL</tspan></text>
<line x1="40" y1="245" x2="176" y2="245" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1"/>
<line x1="40" y1="329" x2="176" y2="329" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1"/>
<line x1="40" y1="413" x2="176" y2="413" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1"/>
<line x1="224" y1="245" x2="360" y2="245" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1"/>
<line x1="224" y1="297" x2="360" y2="297" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1"/>
<line x1="224" y1="349" x2="360" y2="349" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1"/>
<line x1="224" y1="401" x2="360" y2="401" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1"/>
<line x1="224" y1="453" x2="360" y2="453" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1"/>
<rect x="46.72" y="263" width="16.12" height="21.7" rx="0" fill="var(--color-ink, #0c0d10)" stroke="var(--color-signal, #5eead4)" stroke-width="1"/><rect x="43" y="266.1" width="16.12" height="21.7" rx="0" fill="var(--color-ink, #0c0d10)" stroke="var(--color-signal, #5eead4)" stroke-width="1"/><line x1="46.72" y1="273.54" x2="55.4" y2="273.54" stroke="var(--color-signal, #5eead4)" stroke-width="1"/><line x1="46.72" y1="277.88" x2="55.4" y2="277.88" stroke="var(--color-signal, #5eead4)" stroke-width="1"/>
<text x="73" y="280" fill="var(--color-paper, #e7e9ee)" font-size="18" font-weight="400" text-anchor="start"><tspan x="73" dy="0">Securities</tspan></text>
<text x="42" y="309" fill="var(--color-muted, #8b909b)" font-size="15" font-weight="400" text-anchor="start"><tspan x="42" dy="0">Treasuries, MBS</tspan></text>
<text x="42" y="361" fill="var(--color-paper, #e7e9ee)" font-size="17" font-weight="400" text-anchor="start"><tspan x="42" dy="0">Repos and loans</tspan></text>
<text x="42" y="390" fill="var(--color-muted, #8b909b)" font-size="15" font-weight="400" text-anchor="start"><tspan x="42" dy="0">Claims</tspan></text>
<text x="42" y="448" fill="var(--color-paper, #e7e9ee)" font-size="17" font-weight="400" text-anchor="start"><tspan x="42" dy="0">Swaps, other</tspan><tspan x="42" dy="22.950000000000003">assets</tspan></text>
<text x="224" y="267" fill="var(--color-signal, #5eead4)" font-size="16" font-weight="400" text-anchor="start"><tspan x="224" dy="0">Bank</tspan><tspan x="224" dy="19">reserves</tspan></text>
<text x="224" y="319" fill="var(--color-paper, #e7e9ee)" font-size="16" font-weight="400" text-anchor="start"><tspan x="224" dy="0">Banknotes</tspan></text>
<text x="224" y="371" fill="var(--color-amber, #f5b13d)" font-size="16" font-weight="400" text-anchor="start"><tspan x="224" dy="0">Treasury · TGA</tspan></text>
<text x="224" y="423" fill="var(--color-paper, #e7e9ee)" font-size="16" font-weight="400" text-anchor="start"><tspan x="224" dy="0">Reverse repos,</tspan><tspan x="224" dy="19">other deposits</tspan></text>
<text x="224" y="475" fill="var(--color-muted, #8b909b)" font-size="16" font-weight="400" text-anchor="start"><tspan x="224" dy="0">Capital</tspan></text>
<path d="M40 545 L40 555 L176 555 L176 545" fill="none" stroke="var(--color-signal, #5eead4)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M224 545 L224 555 L360 555 L360 545" fill="none" stroke="var(--color-amber, #f5b13d)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
<text x="108" y="587" fill="var(--color-signal, #5eead4)" font-size="18" font-weight="400" text-anchor="middle"><tspan x="108" dy="0">Assets</tspan></text>
<text x="200" y="587" fill="var(--color-muted, #8b909b)" font-size="22" font-weight="400" text-anchor="middle"><tspan x="200" dy="0">=</tspan></text>
<text x="292" y="580" fill="var(--color-amber, #f5b13d)" font-size="16" font-weight="400" text-anchor="middle"><tspan x="292" dy="0">Liabilities</tspan><tspan x="292" dy="22">+ capital</tspan></text>
<text x="24" y="635" fill="var(--color-muted, #8b909b)" font-size="14" font-weight="400" text-anchor="start"><tspan x="24" dy="0">Source: Fed, H.4.1, Table 5.</tspan><tspan x="24" dy="20">Grouped entries, no amounts shown.</tspan></text>
</svg>
</div>
<figcaption>Qualitative structure with no size scale or amounts. Categories are grouped; the complete statement contains additional entries. The identity covers all assets, liabilities and capital. Source: <a href="https://www.federalreserve.gov/releases/h41/">Fed, H.4.1, Table 5 and notes</a>.</figcaption>
</figure>

## Liabilities: reserves, banknotes and accounts at the Fed

**Reserve balances** are depository institutions' balances at the Reserve Banks. The **Treasury General Account**, or TGA, is the Treasury's account. Banknotes are another central-bank liability. A **reverse repo**, viewed from the Fed's side, receives funds temporarily against securities. The Fed's [liabilities guide](https://www.federalreserve.gov/monetarypolicy/bst_frliabilities.htm) explains these accounts and their interactions.

The same Table 5 supplies the other side of the balance sheet:

| Liabilities and capital | Billions of dollars |
| --- | ---: |
| Bank reserve balances | 2,962.804 |
| Federal Reserve notes, net of Reserve Bank holdings | 2,438.660 |
| Treasury General Account | 936.248 |
| Reverse repos | 334.503 |
| Other liabilities and capital, calculated net residual | 75.930 |
| **Total** | **6,748.145** |

Source: [the same release, Table 5](https://www.federalreserve.gov/releases/h41/20261105/). The final residual combines other deposits (**251.769 billion dollars**), deferred-availability cash items (**0.272 billion**), other liabilities and accrued dividends (**−223.831 billion**), and capital (**47.720 billion**). The negative figure includes the effect of the Treasury remittance account, discussed below. The net residual is not one homogeneous deposit account.

The complete identity is **reserves = assets − other liabilities − capital**. Other liabilities include notes, the TGA, reverse repos and every remaining liability account, including negative balances. The market calculation “Fed assets minus TGA minus RRP” leaves out several accounts and does not reproduce reported reserves. Our [net-liquidity guide](/en/guides/read-net-liquidity-tga-rrp/) explains the limits of that indicator.

## Reconcile a weekly change in reserves

When Treasury pays from its account into a commercial-bank account, the TGA falls and the receiving bank's reserves rise, all else equal. Tax receipts move balances in the opposite direction. A payment between customers of different banks transfers reserves between those banks; that transfer alone does not change aggregate reserves. The [Fed explains the TGA mechanism](https://www.federalreserve.gov/monetarypolicy/bst_frliabilities.htm).

A reverse repo temporarily substitutes a reverse-repo liability for reserve balances, while the securities remain in the Fed's accounting portfolio. The [New York Fed's FAQ](https://www.newyorkfed.org/markets/rrp_faq.html) describes the offsetting entries. H.4.1's reverse-repo total includes foreign official accounts as well as the “Others” line. It should not be treated as the outstanding amount of the **ON RRP** facility alone, which serves eligible overnight counterparties.

The week from **October 28 to November 4, 2026** provides a real reconciliation. Table 5 reports assets rising by **2.510 billion dollars** and reserves by **67.568 billion**. The TGA falls by **79.384 billion**, while reverse repos rise by **8.666 billion** and notes by **4.630 billion**. The remaining liabilities and capital increase by a net **1.030 billion**, calculated as the residual. Therefore:

**2.510 + 79.384 − 8.666 − 4.630 − 1.030 = 67.568 billion dollars.**

Source and convention: [November 5 H.4.1, Table 5, changes between Wednesday observations](https://www.federalreserve.gov/releases/h41/20261105/). This reconciliation establishes an accounting identity; it cannot by itself establish the motivation behind each transaction.

<figure class="central-bank-figure" style="padding-bottom:1rem">
<div class="cb-wide">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 624" role="img" lang="en" aria-labelledby="cb-fed-flows-en-d-title cb-fed-flows-en-d-desc" style="width:100%;height:auto;display:block;font-family:var(--font-read, Arial, sans-serif)">
<title id="cb-fed-flows-en-d-title">Reserves move with their counterpart</title><desc id="cb-fed-flows-en-d-desc">Two isolated operations, all else equal. A tax payment to the Treasury transfers an amount x from bank reserves to the TGA, leaving Fed assets unchanged. A Fed outright securities purchase increases both its securities and reserve balances by x. The seller and its bank account are not detailed.</desc>
<rect x="0" y="0" width="800" height="624" rx="0" fill="var(--color-ink, #0c0d10)"/>
<line x1="32" y1="12" x2="768" y2="12" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1"/>
<text x="32" y="37" fill="var(--color-muted, #8b909b)" font-size="14" font-weight="400" text-anchor="start"><tspan x="32" dy="0">l0g / BALANCE-SHEET MOVEMENTS</tspan></text>
<text x="768" y="37" fill="var(--color-signal, #5eead4)" font-size="14" font-weight="400" text-anchor="end"><tspan x="768" dy="0">02</tspan></text>
<text x="32" y="78" fill="var(--color-paper, #e7e9ee)" font-size="29" font-weight="500" text-anchor="start"><tspan x="32" dy="0">Reserves move with their counterpart</tspan></text>
<text x="32" y="111" fill="var(--color-muted, #8b909b)" font-size="16" font-weight="400" text-anchor="start"><tspan x="32" dy="0">Isolated transactions · x = the same dollar amount</tspan></text>
<text x="32" y="166" fill="var(--color-muted, #8b909b)" font-size="15" font-weight="400" text-anchor="start"><tspan x="32" dy="0">A / A TAX PAYMENT REACHES THE TREASURY</tspan></text>
<text x="32" y="215" fill="var(--color-paper, #e7e9ee)" font-size="19" font-weight="400" text-anchor="start"><tspan x="32" dy="0">Fed assets</tspan><tspan x="32" dy="25">unchanged</tspan></text>
<line x1="180" y1="184" x2="180" y2="297" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1"/>
<text x="214" y="213" fill="var(--color-signal, #5eead4)" font-size="20" font-weight="400" text-anchor="start"><tspan x="214" dy="0">Bank reserves</tspan></text>
<text x="214" y="250" fill="var(--color-signal, #5eead4)" font-size="33" font-weight="500" text-anchor="start"><tspan x="214" dy="0">−x</tspan></text>
<line x1="427" y1="239" x2="565" y2="239" stroke="var(--color-amber, #f5b13d)" stroke-width="1.5"/><path d="M558.70 242.04 L565 239 L558.70 235.96" fill="none" stroke="var(--color-amber, #f5b13d)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<text x="496" y="218" fill="var(--color-muted, #8b909b)" font-size="15" font-weight="400" text-anchor="middle"><tspan x="496" dy="0">transfer</tspan></text>
<text x="598" y="213" fill="var(--color-amber, #f5b13d)" font-size="20" font-weight="400" text-anchor="start"><tspan x="598" dy="0">TGA</tspan></text>
<text x="598" y="250" fill="var(--color-amber, #f5b13d)" font-size="33" font-weight="500" text-anchor="start"><tspan x="598" dy="0">+x</tspan></text>
<path d="M214 273 L214 286 L731 286 L731 273" fill="none" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
<text x="473" y="313" fill="var(--color-muted, #8b909b)" font-size="16" font-weight="400" text-anchor="middle"><tspan x="473" dy="0">Total liabilities remain unchanged.</tspan></text>
<line x1="32" y1="345" x2="768" y2="345" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1"/>
<text x="32" y="384" fill="var(--color-muted, #8b909b)" font-size="15" font-weight="400" text-anchor="start"><tspan x="32" dy="0">B / THE FED PURCHASES A SECURITY</tspan></text>
<rect x="49.8" y="418" width="33.800000000000004" height="45.5" rx="0" fill="var(--color-ink, #0c0d10)" stroke="var(--color-signal, #5eead4)" stroke-width="1"/><rect x="42" y="424.5" width="33.800000000000004" height="45.5" rx="0" fill="var(--color-ink, #0c0d10)" stroke="var(--color-signal, #5eead4)" stroke-width="1"/><line x1="49.8" y1="440.1" x2="68.0" y2="440.1" stroke="var(--color-signal, #5eead4)" stroke-width="1"/><line x1="49.8" y1="449.2" x2="68.0" y2="449.2" stroke="var(--color-signal, #5eead4)" stroke-width="1"/>
<text x="110" y="436" fill="var(--color-signal, #5eead4)" font-size="20" font-weight="400" text-anchor="start"><tspan x="110" dy="0">Securities as assets</tspan></text>
<text x="110" y="476" fill="var(--color-signal, #5eead4)" font-size="33" font-weight="500" text-anchor="start"><tspan x="110" dy="0">+x</tspan></text>
<line x1="400" y1="409" x2="400" y2="493" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1"/>
<text x="443" y="436" fill="var(--color-signal, #5eead4)" font-size="20" font-weight="400" text-anchor="start"><tspan x="443" dy="0">Reserves as liabilities</tspan></text>
<text x="443" y="476" fill="var(--color-signal, #5eead4)" font-size="33" font-weight="500" text-anchor="start"><tspan x="443" dy="0">+x</tspan></text>
<path d="M110 497 L110 510 L731 510 L731 497" fill="none" stroke="var(--color-signal, #5eead4)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
<text x="421" y="538" fill="var(--color-signal, #5eead4)" font-size="18" font-weight="400" text-anchor="middle"><tspan x="421" dy="0">Assets and liabilities expand together.</tspan></text>
<text x="32" y="579" fill="var(--color-muted, #8b909b)" font-size="14" font-weight="400" text-anchor="start"><tspan x="32" dy="0">All else equal · simplified entries on the Fed balance sheet.</tspan></text>
<text x="32" y="601" fill="var(--color-muted, #8b909b)" font-size="14" font-weight="400" text-anchor="start"><tspan x="32" dy="0">Sources: Fed, balance-sheet explanation; New York Fed, market operations.</tspan></text>
</svg>
</div>
<div class="cb-mobile">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 771" role="img" lang="en" aria-labelledby="cb-fed-flows-en-m-title cb-fed-flows-en-m-desc" style="width:100%;height:auto;display:block;font-family:var(--font-read, Arial, sans-serif)">
<title id="cb-fed-flows-en-m-title">Reserves move with their counterpart</title><desc id="cb-fed-flows-en-m-desc">Two isolated operations, all else equal. A tax payment to the Treasury transfers an amount x from bank reserves to the TGA, leaving Fed assets unchanged. A Fed outright securities purchase increases both its securities and reserve balances by x. The seller and its bank account are not detailed.</desc>
<rect x="0" y="0" width="400" height="771" rx="0" fill="var(--color-ink, #0c0d10)"/>
<line x1="24" y1="12" x2="376" y2="12" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1"/>
<text x="24" y="37" fill="var(--color-muted, #8b909b)" font-size="14" font-weight="400" text-anchor="start"><tspan x="24" dy="0">l0g / BALANCE-SHEET MOVEMENTS</tspan></text>
<text x="376" y="37" fill="var(--color-signal, #5eead4)" font-size="14" font-weight="400" text-anchor="end"><tspan x="376" dy="0">02</tspan></text>
<text x="24" y="78" fill="var(--color-paper, #e7e9ee)" font-size="24" font-weight="500" text-anchor="start"><tspan x="24" dy="0">Reserves follow</tspan><tspan x="24" dy="30">their counterpart</tspan></text>
<text x="24" y="149" fill="var(--color-muted, #8b909b)" font-size="15" font-weight="400" text-anchor="start"><tspan x="24" dy="0">Isolated transactions · x in dollars</tspan></text>
<text x="24" y="204" fill="var(--color-muted, #8b909b)" font-size="14" font-weight="400" text-anchor="start"><tspan x="24" dy="0">A / TAX PAID TO THE TREASURY</tspan></text>
<text x="24" y="236" fill="var(--color-paper, #e7e9ee)" font-size="17" font-weight="400" text-anchor="start"><tspan x="24" dy="0">Fed assets unchanged</tspan></text>
<line x1="24" y1="252" x2="376" y2="252" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1"/>
<text x="24" y="285" fill="var(--color-signal, #5eead4)" font-size="17" font-weight="400" text-anchor="start"><tspan x="24" dy="0">Bank</tspan><tspan x="24" dy="22">reserves</tspan></text>
<text x="24" y="353" fill="var(--color-signal, #5eead4)" font-size="36" font-weight="500" text-anchor="start"><tspan x="24" dy="0">−x</tspan></text>
<line x1="155" y1="326" x2="258" y2="326" stroke="var(--color-amber, #f5b13d)" stroke-width="1.5"/><path d="M251.70 329.04 L258 326 L251.70 322.96" fill="none" stroke="var(--color-amber, #f5b13d)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<text x="207" y="302" fill="var(--color-muted, #8b909b)" font-size="14" font-weight="400" text-anchor="middle"><tspan x="207" dy="0">transfer</tspan></text>
<text x="296" y="285" fill="var(--color-amber, #f5b13d)" font-size="18" font-weight="400" text-anchor="start"><tspan x="296" dy="0">TGA</tspan></text>
<text x="296" y="353" fill="var(--color-amber, #f5b13d)" font-size="36" font-weight="500" text-anchor="start"><tspan x="296" dy="0">+x</tspan></text>
<path d="M24 377 L24 388 L376 388 L376 377" fill="none" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
<text x="200" y="418" fill="var(--color-muted, #8b909b)" font-size="16" font-weight="400" text-anchor="middle"><tspan x="200" dy="0">Total liabilities unchanged</tspan></text>
<line x1="24" y1="445" x2="376" y2="445" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1"/>
<text x="24" y="480" fill="var(--color-muted, #8b909b)" font-size="14" font-weight="400" text-anchor="start"><tspan x="24" dy="0">B / FED OUTRIGHT PURCHASE</tspan></text>
<text x="24" y="522" fill="var(--color-signal, #5eead4)" font-size="17" font-weight="400" text-anchor="start"><tspan x="24" dy="0">Securities</tspan><tspan x="24" dy="23">as assets</tspan></text>
<text x="24" y="592" fill="var(--color-signal, #5eead4)" font-size="36" font-weight="500" text-anchor="start"><tspan x="24" dy="0">+x</tspan></text>
<line x1="200" y1="506" x2="200" y2="610" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1"/>
<text x="228" y="522" fill="var(--color-signal, #5eead4)" font-size="17" font-weight="400" text-anchor="start"><tspan x="228" dy="0">Reserves</tspan><tspan x="228" dy="23">as liabilities</tspan></text>
<text x="228" y="592" fill="var(--color-signal, #5eead4)" font-size="36" font-weight="500" text-anchor="start"><tspan x="228" dy="0">+x</tspan></text>
<path d="M24 620 L24 632 L376 632 L376 620" fill="none" stroke="var(--color-signal, #5eead4)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
<text x="200" y="662" fill="var(--color-signal, #5eead4)" font-size="17" font-weight="400" text-anchor="middle"><tspan x="200" dy="0">Assets and liabilities expand</tspan><tspan x="200" dy="23">by the same amount.</tspan></text>
<text x="24" y="726" fill="var(--color-muted, #8b909b)" font-size="14" font-weight="400" text-anchor="start"><tspan x="24" dy="0">All else equal.</tspan><tspan x="24" dy="20">Sources: Fed; New York Fed.</tspan></text>
</svg>
</div>
<figcaption>Two isolated transactions on the Fed balance sheet, all else equal. Within each transaction, x denotes the same dollar amount; no observed balance is plotted. A tax payment shifts liabilities; an outright purchase expands assets and reserves. Sources: <a href="https://www.federalreserve.gov/monetarypolicy/bst_fedsbalancesheet.htm">Fed, balance-sheet explanation</a> and <a href="https://www.newyorkfed.org/markets/domestic-market-operations/monetary-policy-implementation/repo-reverse-repo-agreements">New York Fed, market operations</a>.</figcaption>
</figure>

Table 1 reports a different change under a different convention. Reserve balances average **2,930.088 billion dollars** over the week ending November 4, versus **2,962.804 billion on Wednesday**. The **36.318 billion increase** printed beside the average compares two weekly averages. It therefore differs from the **67.568 billion** increase between Wednesdays. All four values come from the [same release](https://www.federalreserve.gov/releases/h41/20261105/); mixing their conventions breaks the reconciliation.

## Separate monetary policy from reserve management

**Quantitative easing**, or QE, uses purchases to ease financial conditions. **Quantitative tightening**, or QT, reduces securities portfolios under the applicable sale or reinvestment decisions. Classifying a movement requires reading instructions from the **Federal Open Market Committee**, or FOMC, alongside the accounts. Lending, exchange rates and technical accounts also affect total assets.

The [October 28, 2026 implementation note](https://www.federalreserve.gov/newsevents/pressreleases/monetary20261028a1.htm), effective the following day, directs the Desk to roll over all Treasury principal payments at auction and reinvest all principal payments from agency securities into Treasury bills. When appropriate, it also permits bill purchases and, if needed, other short-maturity Treasury purchases to maintain ample reserves.

Falling MBS holdings can therefore coexist with rising bill holdings. A change in portfolio composition is insufficient evidence of renewed QT. Purchases made to maintain reserve supply must likewise be read against their operational objective: a larger balance sheet alone does not establish a programme intended to lower long-term yields.

## Valuation and losses require the footnotes

Treasury securities are reported at face value, with inflation compensation shown separately for indexed securities. MBS are reported at remaining principal. Unamortized premiums and discounts appear on separate lines. These amounts do not state the price the Fed would receive if it sold its portfolio. The [release footnotes](https://www.federalreserve.gov/releases/h41/20261105/) distinguish accounting amounts, principal and sale values.

The **“Earnings remittances due to the U.S. Treasury”** account needs separate treatment. Its aggregate net balance in Table 6 is **−231.928 billion dollars on November 4, 2026**. The footnote explains that negative amounts represent the cumulative deferred-asset position. The [Financial Accounting Manual, section 11.96](https://www.federalreserve.gov/aboutthefed/chapter-1-balance-sheet.htm), states that a Reserve Bank records the net excess earnings it must realize before remittances to Treasury resume.

That balance is neither a weekly loss of the same amount nor a marketable claim on Treasury. The total also combines Reserve Banks whose remittance positions can differ. Treating it as an immediately payable bill, or deducting it a second time from capital, misreads the accounts. The fiscal consequence is deferred Treasury receipts; H.4.1 alone cannot establish when the accumulated position will be eliminated.

## Keep the reading reproducible

For every observation, retain the dated URL, table, exact line label, unit and column. Start with Table 5 total assets, identify the largest changes in securities and lending, then reconcile reserves against the TGA, reverse repos and remaining accounts. Read the FOMC directive before assigning a policy explanation.

Quantities alone do not diagnose a funding shortage: their distribution across institutions and the rates actually traded matter as well. Our [repo-market and SOFR guide](/en/guides/read-repo-market-sofr/) adds that perspective. The [offshore dollar system](/en/analysis/eurodollars-the-offshore-dollar/) widens the perimeter beyond the United States. The [ECB balance-sheet guide](/en/guides/read-ecb-balance-sheet-target2/) shows how a different institutional structure uses the same accounting identity.

## Sources and revision

The **November 11, 2026** revision checks amounts against the **November 5 release**, replaces the earlier October example, completes the liability reconciliation, and aligns the portfolio discussion with the **October 28 directive**. Wednesday observations, weekly averages and their respective changes remain separate.

- [Fed, H.4.1 calendar and archives](https://www.federalreserve.gov/releases/h41/).
- [Fed, November 5, 2026 release, tables and footnotes](https://www.federalreserve.gov/releases/h41/20261105/).
- [Fed, scope of the release](https://www.federalreserve.gov/releases/h41/about.htm).
- [Fed, guide to the balance-sheet tables](https://www.federalreserve.gov/monetarypolicy/bst_fedsbalancesheet.htm).
- [Fed, liabilities and the Treasury account](https://www.federalreserve.gov/monetarypolicy/bst_frliabilities.htm).
- [FOMC, October 28, 2026 implementation note](https://www.federalreserve.gov/newsevents/pressreleases/monetary20261028a1.htm).
- [New York Fed, repo and reverse repo agreements](https://www.newyorkfed.org/markets/domestic-market-operations/monetary-policy-implementation/repo-reverse-repo-agreements).
- [New York Fed, reverse-repo FAQ](https://www.newyorkfed.org/markets/rrp_faq.html).
- [Fed, Financial Accounting Manual, Chapter 1 and section 11.96](https://www.federalreserve.gov/aboutthefed/chapter-1-balance-sheet.htm).
