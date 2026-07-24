---
title: "Reading a bank's soundness: capital, liquidity and hidden losses"
description: "A reference guide to judging a bank's soundness: the difference between solvency and liquidity, capital ratios (CET1, leverage ratio) and liquidity ratios (LCR, NSFR), the trap of unrealized losses buried in a held-to-maturity portfolio, the fragility of the liability side and uninsured deposits, and why a profitable bank can vanish in 48 hours. With the collapse of Silicon Valley Bank as the case study."
summary: "Judging a bank's soundness means reading two distinct things: its solvency, the capital it has to absorb losses (CET1 ratio, leverage ratio), and its liquidity, its ability to honour withdrawals (LCR, NSFR). A bank can die of either. The SVB case in 2023 shows the trap: unrealized losses hidden in a held-to-maturity portfolio, a liability base concentrated in uninsured deposits, and a fatal digital run in 48 hours. Reading a bank therefore requires cross-checking capital, liquidity, unrealized losses and deposit structure."
pubDate: 2026-07-10T14:00:00+02:00
updatedDate: 2026-07-10T14:00:00+02:00
sourceGuide: "lire-la-solidite-d-une-banque"
sourceUpdatedDate: 2026-07-10T14:00:00+02:00
tags: ["banks", "regulation", "liquidity", "risk", "markets"]
category: fed
draft: false
---

*A bank is not a company like the others. It can post record profits the quarter before it disappears, because its raw material is not a product but trust, and trust evaporates in hours, not years. In March 2023, Silicon Valley Bank went from "well capitalized" to placed under receivership in two days. Understanding how that happens means learning to read four things: capital, liquidity, the losses the balance sheet does not show, and the nature of the deposits. This guide takes them one at a time, with SVB as the thread.*

## Solvency and liquidity, two ways to die

The first distinction to master is between solvency and liquidity, because a bank can die of each, for opposite reasons. Solvency is a question of capital: does the bank have enough equity to absorb its losses before they swallow depositors' money? Liquidity is a question of cash: can it honour the withdrawals demanded of it, here and now, without dumping its assets?

The two do not coincide. A bank that is solvent on paper, with assets exceeding liabilities, can be killed by a run if it cannot raise cash fast enough. This is a liquidity crisis, and it is almost always how banks die: not through an accounting hole found in the cold, but through a funding flight felt in the heat of the moment. Solvency wears a bank down slowly; liquidity kills it fast. Reading a bank therefore means watching both dials at once.

## Capital: how much loss a bank can absorb

Capital is the loss-absorption cushion. The headline measure is the [CET1](/glossaire/cet1/) ratio, for Common Equity Tier 1: the hardest form of equity, essentially common shares and retained earnings, divided by [risk-weighted assets](/glossaire/apr/). That weighting is crucial: a loan to a fragile company counts for more than a government bond deemed risk-free, so two banks with the same balance-sheet size can face very different capital needs.

The [Basel III](/glossaire/bale-iii/) framework stacks several requirements. The CET1 minimum is 4.5% of risk-weighted assets, to which a 2.5% conservation buffer is added, lifting the effective floor to 7%. Systemically important banks ([G-SIBs](/glossaire/g-sib/)) carry an additional surcharge of 1 to 3.5 points, and large banks hold a management buffer above that in practice.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 320" role="img" aria-label="CET1 capital requirement levels under Basel III" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="320" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">The capital ladder, as a share of risk-weighted assets</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">CET1 requirements under Basel III, from the minimum to the level actually held.</text>
  <text x="40" y="88" fill="#d6d9df" font-size="12">CET1 minimum</text>
  <rect x="40" y="98" width="600" height="20" fill="#2a2c33"></rect>
  <rect x="40" y="98" width="193" height="20" fill="#5eead4" opacity="0.9"></rect>
  <text x="241" y="113" fill="#5eead4" font-size="11" font-weight="700">4.5%</text>
  <text x="40" y="136" fill="#d6d9df" font-size="12">+ conservation buffer</text>
  <rect x="40" y="146" width="600" height="20" fill="#2a2c33"></rect>
  <rect x="40" y="146" width="300" height="20" fill="#7aa2f7" opacity="0.9"></rect>
  <text x="348" y="161" fill="#7aa2f7" font-size="11" font-weight="700">7.0%</text>
  <text x="40" y="184" fill="#d6d9df" font-size="12">+ systemic surcharge (G-SIB)</text>
  <rect x="40" y="194" width="600" height="20" fill="#2a2c33"></rect>
  <rect x="40" y="194" width="450" height="20" fill="#f5b13d" opacity="0.9"></rect>
  <text x="498" y="209" fill="#f5b13d" font-size="11" font-weight="700">up to ~10.5%</text>
  <text x="40" y="232" fill="#d6d9df" font-size="12">Level held by large banks</text>
  <rect x="40" y="242" width="600" height="20" fill="#2a2c33"></rect>
  <rect x="40" y="242" width="536" height="20" fill="#8b909b" opacity="0.7"></rect>
  <text x="584" y="257" fill="#8b909b" font-size="11" font-weight="700">~12-13%</text>
  <text x="32" y="300" fill="#8b909b" font-size="11">Sources: Basel Committee, Federal Reserve. G-SIB surcharge of 1 to 3.5 points per bank.</text>
</svg>
<figcaption>From the <strong>4.5%</strong> minimum to the <strong>7%</strong> effective floor once the conservation buffer is added, up to <strong>10.5%</strong> for systemic banks. Large banks hold an extra cushion in practice. Sources: Basel Committee, Fed.</figcaption>
</figure>

A second safeguard completes the setup, the [leverage ratio](/glossaire/ratio-de-levier/). It divides equity by total exposures without weighting them by risk, which stops a bank from looking sound by holding only assets the models deem "risk-free." A bank that scores well on CET1 but poorly on leverage holds little capital relative to its gross size: the dual view is essential.

## Liquidity: surviving a run

Capital is useless if the bank cannot pay its depositors tomorrow morning. That is the purpose of the liquidity ratios, also from Basel III. The [LCR](/glossaire/lcr/), or Liquidity Coverage Ratio, requires a bank to hold enough [high-quality liquid assets](/glossaire/hqla/), central-bank reserves and Treasuries first, to cover its net cash outflows in a 30-day stress scenario. It must stay above 100%. The [NSFR](/glossaire/nsfr/) extends the logic over a year: it checks that illiquid assets are backed by stable resources, not by wholesale funding that can evaporate.

These ratios have a limit, exposed in 2023: they assume a 30-day stress and outflow rates calibrated before the age of banking apps. A digital run, where billions leave in a few hours at the swipe of a finger, moves faster than the LCR anticipated. Regulators drew the lessons, as we detailed in our article on [the regional-bank liquidity reform](/posts/banques-regionales-us-liquidite-lcr/).

## The trap of unrealized losses: HTM, AFS and AOCI

Here is the subtlest and most dangerous mechanism. When a bank buys bonds and interest rates rise, the market value of those bonds falls. But whether that fall appears in its accounts depends on an accounting choice. Securities classified "available-for-sale" ([AFS](/glossaire/htm-afs/)) are marked to market, and their losses flow through an equity line called [AOCI](/glossaire/aoci/). Securities classified "held-to-maturity" ([HTM](/glossaire/htm-afs/)) stay recorded at purchase cost: their unrealized loss appears nowhere on the balance sheet, as long as the bank does not sell them.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 300" role="img" aria-label="Unrealized losses hidden in a held-to-maturity portfolio" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="300" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">The losses you cannot see</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">A bank's bond holdings after rates rise. The SVB case, end-2022.</text>
  <rect x="150" y="95" width="130" height="150" fill="#5eead4" opacity="0.85"></rect>
  <text x="215" y="264" fill="#d6d9df" font-size="12" text-anchor="middle">Book value</text>
  <text x="215" y="280" fill="#8b909b" font-size="11" text-anchor="middle">(HTM, at cost)</text>
  <rect x="440" y="145" width="130" height="100" fill="#f5b13d" opacity="0.85"></rect>
  <text x="505" y="264" fill="#d6d9df" font-size="12" text-anchor="middle">Market value</text>
  <text x="505" y="280" fill="#8b909b" font-size="11" text-anchor="middle">(real price of the bonds)</text>
  <line x1="290" y1="95" x2="430" y2="95" stroke="#ff4d87" stroke-width="1.5" stroke-dasharray="4 3"></line>
  <line x1="290" y1="145" x2="430" y2="145" stroke="#ff4d87" stroke-width="1.5" stroke-dasharray="4 3"></line>
  <text x="360" y="128" fill="#ff4d87" font-size="12" font-weight="700" text-anchor="middle">unrealized loss</text>
  <text x="360" y="200" fill="#8b909b" font-size="11" text-anchor="middle">~$15bn</text>
  <text x="360" y="216" fill="#8b909b" font-size="11" text-anchor="middle">close to</text>
  <text x="360" y="232" fill="#8b909b" font-size="11" text-anchor="middle">its equity</text>
  <text x="32" y="294" fill="#8b909b" font-size="11" textLength="682" lengthAdjust="spacingAndGlyphs">In HTM, the gap stays invisible on the balance sheet, until a forced sale reveals it. Source: Federal Reserve.</text>
</svg>
<figcaption>The portfolio stays recorded at its <strong>book value</strong>, well above its <strong>market value</strong>. The gap, the unrealized loss, hits equity only when the bank sells. At SVB it was around <strong>$15 billion</strong>, roughly the size of its equity. Source: Federal Reserve.</figcaption>
</figure>

This treatment creates a time bomb. A bank can display a comfortable CET1 while carrying unrealized losses that, once realized, would wipe out much of its equity. A U.S. exemption also let mid-sized banks exclude AOCI from their CET1, inflating their apparent solvency. The "Basel III endgame" reform, re-proposed in March 2026, corrects exactly this by requiring more banks to include AOCI, with a five-year transition. When you read a bank, the question is not only "what is its CET1," but "what would its CET1 be if all its securities were marked to market."

## The liability side: where the money comes from, and how fast it leaves

People often look at a bank's assets, its loans and securities. Its vulnerability, though, sits on the right of the balance sheet, in its liabilities, that is, in the nature of its funding. Not all deposits are equal. A deposit covered by federal insurance, under the $250,000 cap, is stable: its holder has no reason to flee, since they are protected even in a failure. An uninsured deposit, above that cap, is volatile: at the first doubt, its holder has every incentive to be first out.

The share of uninsured deposits is therefore a first-order fragility indicator, as is their concentration. A bank whose depositors are few, connected and alike, as SVB's start-ups and venture funds were, faces a herd-run risk: they hear the same rumour, draw the same conclusion and flee at the same instant. A retail bank with millions of small insured depositors, by contrast, has far stickier funding. Reading the liability side means measuring not only how much the bank owes, but how fast that money can leave.

## The textbook case: Silicon Valley Bank

Silicon Valley Bank combined every fragility at once, which makes it the perfect case study. On paper, it was "well capitalized" in the regulatory sense. In reality, three flaws stacked up: a massive bond portfolio carrying about $15 billion of unrealized HTM losses, close to its equity; a liability base roughly 94% uninsured; and a depositor base ultra-concentrated in the tech ecosystem, connected in real time.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 300" role="img" aria-label="Silicon Valley Bank's fatal metrics in March 2023" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="300" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Silicon Valley Bank: the fatal metrics</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">A bank "well capitalized" on paper, dead in 48 hours. March 2023.</text>
  <line x1="40" y1="78" x2="680" y2="78" stroke="#2a2c33" stroke-width="1"></line>
  <text x="40" y="108" fill="#d6d9df" font-size="12.5">Uninsured deposits</text>
  <text x="300" y="112" fill="#ff4d87" font-size="20" font-weight="700">~94%</text>
  <text x="430" y="108" fill="#8b909b" font-size="11.5">a liability base ready to flee</text>
  <line x1="40" y1="126" x2="680" y2="126" stroke="#2a2c33" stroke-width="1"></line>
  <text x="40" y="156" fill="#d6d9df" font-size="12.5">Unrealized losses (HTM)</text>
  <text x="300" y="160" fill="#f5b13d" font-size="20" font-weight="700">~$15bn</text>
  <text x="430" y="156" fill="#8b909b" font-size="11.5">the size of its equity</text>
  <line x1="40" y1="174" x2="680" y2="174" stroke="#2a2c33" stroke-width="1"></line>
  <text x="40" y="204" fill="#d6d9df" font-size="12.5">Withdrawals sought on 9 March</text>
  <text x="300" y="208" fill="#ff4d87" font-size="20" font-weight="700">&gt; $40bn</text>
  <text x="430" y="204" fill="#8b909b" font-size="11.5">and ~$100bn the next day</text>
  <line x1="40" y1="222" x2="680" y2="222" stroke="#2a2c33" stroke-width="1"></line>
  <text x="40" y="252" fill="#d6d9df" font-size="12.5">Regulatory capital</text>
  <text x="300" y="256" fill="#7aa2f7" font-size="15" font-weight="700">compliant</text>
  <text x="430" y="252" fill="#8b909b" font-size="11.5">"well capitalized" on paper</text>
  <text x="32" y="288" fill="#8b909b" font-size="11">Source: Federal Reserve, supervision review (Barr), 28 April 2023.</text>
</svg>
<figcaption>Compliant regulatory capital stopped nothing: <strong>94%</strong> uninsured deposits, <strong>$15 billion</strong> of hidden losses and <strong>over $40 billion</strong> of withdrawals in one day were enough. Solvency did not save liquidity. Source: Federal Reserve.</figcaption>
</figure>

The sequence was blinding. To meet the first withdrawals, SVB had to sell securities, realizing its unrealized losses and confirming the doubt about its solvency. The news spread within hours in a hyper-connected community, and on 9 March 2023 customers sought to withdraw more than $40 billion in a single day, with some $100 billion more expected the next day. No bank survives that. SVB fell on 10 March, a victim not of a credit default but of a liquidity crisis triggered by a solvency flaw its balance sheet masked. The Fed responded with the [BTFP](/glossaire/btfp/), a facility lending against securities valued at par to neutralize precisely those unrealized losses.

## Reading a bank in practice

Judging a bank's soundness therefore means cross-checking several dials rather than trusting one. CET1 says how much loss it can absorb, but it must be read net of the unrealized losses hidden in HTM, not just as reported. The leverage ratio corrects the illusion of a balance sheet padded with supposedly risk-free assets. The LCR and NSFR say whether it can withstand a funding shock, keeping in mind that a digital run moves faster than their assumptions. And the structure of the liabilities, the share of uninsured deposits and the concentration of the client base, says how fast the money can flee.

None of these numbers is enough on its own. A bank can be solvent and illiquid, well capitalized in the regulatory sense yet fragile because its losses are off balance sheet and its depositors nervous. A bank's soundness is not a number, it is the coherence between these dials. And the last one, the hardest to quantify, remains trust: it appears in no ratio, but it is always the first to leave.

## Sources and further reading

- [Federal Reserve, "Review of the Federal Reserve's Supervision and Regulation of Silicon Valley Bank," 28 April 2023](https://www.federalreserve.gov/publications/files/svb-review-20230428.pdf): the Barr report, uninsured-deposit share (~94%) and withdrawal figures.
- [Basel Committee on Banking Supervision, the Basel III framework](https://www.bis.org/bcbs/basel3.htm): capital minimums, LCR and NSFR.
- [Basel Committee, report on the 2023 banking turmoil](https://www.bis.org/bcbs/publ/d555.pdf): lessons from the 2023 failures.
- Federal Reserve, OCC and FDIC, "Basel III endgame" re-proposal, March 2026: broader inclusion of AOCI in CET1.
- l0g, [U.S. regional banks: from the 2023 panic to the liquidity reform](/posts/banques-regionales-us-liquidite-lcr/).
- Related guides: [Reading net liquidity: reserves, TGA, RRP](/en/guides/read-net-liquidity-tga-rrp/) and [Reading the Fed's H.4.1 balance sheet](/en/guides/read-h41-fed-balance-sheet/).
</content>
