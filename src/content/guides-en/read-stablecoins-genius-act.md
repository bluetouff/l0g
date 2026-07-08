---
title: "Stablecoins and the GENIUS Act: reading the promise of the digital dollar"
description: "A reference guide to stablecoins and the GENIUS Act: how a token holds its peg, what the July 2025 U.S. law actually requires, why an attestation is not an audit, how to read a reserve report, and why this $320 billion market has become a buyer of U.S. Treasury bills."
summary: "A payment stablecoin is a digital token backed one-for-one by a currency, usually the dollar, and redeemable at par. Its value depends on its reserves. The GENIUS Act, signed in July 2025, sets the U.S. federal framework for that promise."
pubDate: 2026-06-21T13:00:00+02:00
updatedDate: 2026-06-21T13:00:00+02:00
sourceGuide: "stablecoins-genius-act"
sourceUpdatedDate: 2026-06-21T13:00:00+02:00
tags: ["crypto", "stablecoins", "regulation", "macro", "methodology"]
category: crypto
draft: false
---

*A stablecoin promises one dollar, always, on demand. That promise rests on nothing except the reserve behind it. Most of the time, the reserve is visible through a monthly report produced by the issuer. The GENIUS Act, signed into law in July 2025, creates the U.S. federal framework for payment stablecoins. But an attestation is not an audit, a snapshot is not continuous proof, and this market of roughly $320 billion has quietly become a major buyer of U.S. Treasury bills. This guide explains how to read the promise.*

At its simplest, a payment stablecoin is a digital token backed one-for-one by a currency, in practice the dollar in nearly **99%** of cases according to European Central Bank data. The issuer takes in a dollar, issues a token, and holds the dollar or a cash-like asset in reserve. The token's stability depends on whether that reserve exists, is liquid, and can be redeemed at par.

## How a stablecoin holds its peg

The peg is enforced by redemption arbitrage. If a token trades at $0.99 but can be redeemed for $1, an arbitrageur can buy it and redeem it, pushing the price back toward par. The mechanism works only if redemption is credible.

That is why reserve-backed stablecoins such as Tether's USDT or Circle's USDC differ radically from purely algorithmic models. Reserve-backed tokens depend on collateral. Algorithmic stablecoins tried to hold the peg through incentives and auxiliary tokens rather than equivalent reserves. TerraUSD's collapse in May 2022 showed what happens when that loop breaks.

The GENIUS Act draws the lesson: payment stablecoins require full reserves, effectively closing the door to a purely algorithmic payment-stablecoin model.

## What the GENIUS Act actually requires

Signed on **July 18, 2025**, after Senate passage on June 17 and House passage on July 17, the Guiding and Establishing National Innovation for U.S. Stablecoins Act is the first U.S. federal payment stablecoin framework.

Its first move is legal classification: a compliant payment stablecoin is neither a security nor a commodity. Authorisation therefore moves away from the SEC/CFTC lane and into a banking-supervision architecture.

The core requirements are straightforward:

- only permitted issuers may issue payment stablecoins;
- issuers fall into three broad classes: insured depository institution subsidiaries, federally supervised non-bank issuers under the OCC, and state-qualified issuers;
- state-qualified issuers are capped at **$10 billion** in outstanding stablecoins before a federal regime becomes mandatory;
- reserves must cover at least **100%** of tokens outstanding;
- eligible reserve assets are limited to high-quality liquid assets: dollars, bank deposits, Treasury bills with maturities of **93 days** or less, repos backed by those bills, and government money market funds;
- rehypothecation of reserves is banned;
- reserve composition must be disclosed monthly;
- management must certify the accounts;
- reserves must be examined by a registered accounting firm;
- issuers above **$50 billion** in outstanding value must produce annual audited financial statements;
- issuers may not pay interest to holders.

Two protections complete the structure. In an issuer bankruptcy, reserves are separated for the benefit of holders, with a super-priority claim if there is a shortfall. And issuers must be able to freeze, seize or burn tokens under a lawful order.

Full effectiveness comes no later than **January 18, 2027**, or earlier if regulators finalise rules before then. Many implementing rules are due around **July 18, 2026**.

## An attestation is not an audit

This is the point most commentary skips. A monthly reserve report is usually an attestation, not a full audit.

An attestation checks a specific fact at a specific date. It can confirm that declared reserves existed at that snapshot. It does not necessarily express an opinion on internal controls, continuous solvency, counterparty quality, or what happens between two reporting dates.

Tether illustrates the gap. After a New York Attorney General investigation found misleading claims about backing, Tether was required to publish periodic reserve reports. It has since published attestations, long before producing a full independent audit. Circle has used transparency and regulated status as a commercial advantage, with USDC reserve reports and a more explicitly regulated posture.

The GENIUS Act raises the floor with monthly attestations and annual audits for the largest issuers. But a monthly snapshot is still a snapshot.

## How to read a reserve

A reserve report must be read line by line. Not all “dollar” reserves are equal.

Short Treasury bills are liquid and close to risk-free. Bank deposits carry counterparty risk. Repo exposure depends on collateral, tenor and counterparty. Money market funds add another layer of structure. Maturity matters because a reserve can be solvent on paper and still be hard to liquidate instantly.

The Silicon Valley Bank episode made the point. In March 2023, Circle held roughly **$3.3 billion** of USDC reserves at SVB. When the bank failed, USDC briefly traded around **$0.87** before the peg recovered after deposits were protected. A fully reserved stablecoin can still depeg if part of the reserve is stuck at a failed counterparty.

## The mechanics of depeg risk

A depeg happens when the market doubts redemption at par. There are three main triggers.

The first is insufficient or illiquid reserves. The second is counterparty failure. The third is an algorithmic spiral, where the mechanism meant to support the token collapses as confidence disappears. In every case, the immediate mechanism is a run: too many holders try to exit at once and the reserve cannot meet the demand cleanly.

The analogy with banking is obvious, except that stablecoin holders do not automatically receive deposit insurance or central-bank lender-of-last-resort protection.

## The macro angle: stablecoins as Treasury buyers

Stablecoins are no longer just a crypto-market instrument. To back their tokens, issuers hold large amounts of short-term Treasury bills. Collectively, they held around **$155 billion** of Treasury bills by late 2025; Tether alone claimed more than **$100 billion**.

This makes stablecoin issuers an increasingly important marginal buyer of U.S. short-term debt. A 2026 BIS working paper showed that stablecoin flows now affect safe-asset prices, while U.S. officials have explicitly described stablecoin demand as a new force in the Treasury bill market.

The same logic also creates a risk. If stablecoins become a buyer of Treasury bills when they grow, a large redemption wave can turn them into a forced seller of Treasury bills at the worst possible moment. The stability of payment tokens and the liquidity of the Treasury bill market are now connected.

## GENIUS versus MiCA

The European Union's [MiCA framework](/en/guides/decode-mica-crypto-regulation/) also imposes reserve and redemption requirements for e-money tokens and asset-referenced tokens. Both regimes ban interest paid directly to stablecoin holders.

But the models differ. GENIUS builds a three-class banking-style regime designed around the dollar. MiCA caps the use of major non-euro stablecoins and requires European authorisation. The United States is building an export rail for the digital dollar; Europe is trying to limit its monetary spillover.

## How to read the risk in practice

Start with the monthly reserve report: composition, Treasury bill share, deposit share, repo share, maturity and counterparties. Then check whether the report is an attestation or an audit, and which firm performed it. Verify the issuer's regulatory status under the GENIUS Act and MiCA. Check market history: capitalisation, peg deviations, redemption depth and chain concentration. Finally, be suspicious of yield promises: the GENIUS Act bans issuer interest to holders, so any yield offered by an intermediary means the risk has moved, not disappeared.

## Methodology

This guide is based on primary sources: the GENIUS Act, Congressional Research Service analysis, Federal Reserve Bank of Richmond explanations, BIS work on stablecoins and safe-asset prices, European Central Bank data on dollarisation of stablecoin supply, public reserve reports from Tether and Circle, and MiCA for the European comparison. Market capitalisation, reserve and share figures are dated to early 2026 and should be treated as moving data.

---

**Main sources:** GENIUS Act (S.1582, Public Law 119-27, signed July 18, 2025); Congressional Research Service analysis; Federal Reserve Bank of Richmond, *Stablecoins and the GENIUS Act: An Overview*; BIS Working Paper No. 1270, *Stablecoins and safe asset prices*; ECB material on the dollar share of stablecoin supply; public reserve reports from Tether and Circle; Regulation (EU) 2023/1114 (MiCA).
