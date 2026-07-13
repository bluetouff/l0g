---
title: "The Treasury basis trade: the leveraged arbitrage at the heart of US debt"
description: "A single arbitrage ties together the repo market, futures and the stability of US debt: the basis trade. Estimated at around $1 trillion, carried by leverage of 15 to 20 times, it supplies liquidity to the Treasury market in normal times, and amplifies it dangerously under stress. Anatomy of a trade that the Fed, the OFR and the FSB watch closely."
pubDate: 2026-07-13T15:30:00+02:00
updatedDate: 2026-07-13T15:30:00+02:00
tags: ["macro", "markets", "central banks", "regulation"]
draft: false
sourceArticle: "basis-trade-treasuries-levier"
sourceUpdatedDate: 2026-06-23
---
*There is an arbitrage that, on its own, links the repo market, Treasury futures and the stability of the US debt market. It is called the basis trade. In normal times, it brings cash and futures prices together, and supplies liquidity to a $29 trillion market. Under stress, the same mechanism reverses: its high leverage forces unwinds, which amplify the fall. It contributed to the Treasury debacle of March 2020, and its size has kept growing since. A direct sequel to our [piece on repo and collateral](/en/analysis/repo-the-liquidity-factory/), here is the anatomy of a trade regulators watch like a hawk.*

The basis trade is an arbitrage on the basis, the price gap between a cash Treasury bond and the corresponding futures contract. Futures generally trade a little rich to cash, because asset managers buy futures massively to get duration exposure without holding the securities. A fund captures this gap by putting on three simultaneous legs: it buys the bond in cash, sells the futures contract, and finances the purchase in repo by pledging the bond as collateral. At expiry, the basis converges to zero and the gap is pocketed.

## The mechanics, and the leverage

The captured gap is tiny, on the order of a few basis points. For the trade to be profitable, it therefore needs enormous size and high leverage. The reference studies, including that of the Treasury Borrowing Advisory Committee, use leverage of around **20 times**. The initial margin on futures is only **2 to 3%**, and much of the repo funding is done at near-zero haircut. According to the OFR, about **74%** of hedge funds' repo borrowing was done at zero or negative haircut, which multiplies the leverage and the liquidation risk. Concretely, a $100 million position may tie up only $7 to $8 million of its own capital.

<figure class="infographic">
<svg viewBox="0 0 720 320" role="img" aria-label="The three legs of the basis trade: cash purchase, futures sale, repo funding" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="320" fill="#0c0d10"/>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">The anatomy of the basis trade</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Three simultaneous legs to capture the cash / futures gap, with high leverage.</text>

  <rect x="40" y="100" width="190" height="80" rx="8" fill="none" stroke="#5eead4" stroke-width="1.5"/>
  <text x="135" y="132" fill="#f5f6f8" font-size="13" text-anchor="middle">1. Cash purchase</text>
  <text x="135" y="152" fill="#8b909b" font-size="11" text-anchor="middle">Treasury bond</text>
  <text x="135" y="168" fill="#5eead4" font-size="11" text-anchor="middle">long position</text>

  <rect x="265" y="100" width="190" height="80" rx="8" fill="none" stroke="#ff4d87" stroke-width="1.5"/>
  <text x="360" y="132" fill="#f5f6f8" font-size="13" text-anchor="middle">2. Forward sale</text>
  <text x="360" y="152" fill="#8b909b" font-size="11" text-anchor="middle">futures contract</text>
  <text x="360" y="168" fill="#ff4d87" font-size="11" text-anchor="middle">short position</text>

  <rect x="490" y="100" width="190" height="80" rx="8" fill="none" stroke="#f5b13d" stroke-width="1.5"/>
  <text x="585" y="132" fill="#f5f6f8" font-size="13" text-anchor="middle">3. Funding</text>
  <text x="585" y="152" fill="#8b909b" font-size="11" text-anchor="middle">repo, collateral = leg 1</text>
  <text x="585" y="168" fill="#f5b13d" font-size="11" text-anchor="middle">leverage ~20x</text>

  <text x="360" y="232" fill="#d6d9df" font-size="12" text-anchor="middle">The basis converges to zero at expiry: the gap is pocketed.</text>
  <text x="360" y="262" fill="#8b909b" font-size="12" text-anchor="middle">Futures initial margin: 2 to 3%. Repo often at near-zero haircut.</text>
  <text x="360" y="284" fill="#8b909b" font-size="12" text-anchor="middle">A $100M position ties up about $7 to $8M of capital.</text>
</svg>
<figcaption>The trade combines a long cash position, a short futures position, and repo funding backed by the bond. The leverage comes from low-haircut repo and reduced futures margin. Sources: CFTC (MRAC, December 2024), Treasury Borrowing Advisory Committee, OFR.</figcaption>
</figure>

## What it really does

This trade is not just speculation. It exists because asset managers have a structural demand for long futures, to manage the duration of their portfolios, and someone must take the other side. Leveraged hedge funds fill this role, and by hedging through the basis trade, they link cash and futures prices and provide liquidity, including on older, less-traded issues. In short, the Treasury market has come to depend on heavily indebted actors to run smoothly. It is the same logic as in repo: liquidity is manufactured on constrained balance sheets.

## The size, and why it is poorly measured

No one knows the exact figure, because the trade is not reported as such. It is approached through two proxies: the net short positions of leveraged funds in Treasury futures, published by the CFTC, and the sponsored-repo volumes tracked by the OFR. The IMF's April 2026 Global Financial Stability Report thus estimates the size of the trade at around $1 trillion, after rapid growth. The short positions of leveraged funds in the 2-, 5- and 10-year contracts exceeded $1 trillion as early as March 2025. Relative to a $29 trillion market, the figure looks modest, but the risk does not lie in the volume, it lies in the leverage and the forced nature of the exits.

## The breaking point: the margin spiral

The fragility is known and documented. When volatility rises, two things happen at once: clearing houses raise futures margins, and repo lenders raise their haircuts. The fund must then post cash on an emergency basis. If it cannot, it unwinds, so it sells its cash bonds, which weighs on prices and further feeds volatility. It is the margin spiral described by the BIS as early as 2020. In March 2020, the unwinding of the basis trade represented nearly half of hedge funds' Treasury sales per the OFR's work, and the Fed had to intervene massively to stabilise the market.

<figure class="infographic">
<svg viewBox="0 0 720 340" role="img" aria-label="The margin spiral: how a volatility shock forces the unwind of the basis trade" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="340" fill="#0c0d10"/>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">The margin spiral</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">The mechanism that turns the liquidity provider into a stress amplifier.</text>

  <rect x="270" y="78" width="180" height="46" rx="8" fill="none" stroke="#ff4d87" stroke-width="1.5"/>
  <text x="360" y="106" fill="#f5f6f8" font-size="12" text-anchor="middle">Rising volatility</text>

  <rect x="500" y="150" width="190" height="46" rx="8" fill="none" stroke="#f5b13d" stroke-width="1.5"/>
  <text x="595" y="172" fill="#f5f6f8" font-size="12" text-anchor="middle">Margins and haircuts</text>
  <text x="595" y="187" fill="#8b909b" font-size="11" text-anchor="middle">raised</text>

  <rect x="500" y="250" width="190" height="46" rx="8" fill="none" stroke="#f5b13d" stroke-width="1.5"/>
  <text x="595" y="272" fill="#f5f6f8" font-size="12" text-anchor="middle">Margin calls</text>
  <text x="595" y="287" fill="#8b909b" font-size="11" text-anchor="middle">cash needed</text>

  <rect x="270" y="250" width="180" height="46" rx="8" fill="none" stroke="#ff4d87" stroke-width="1.5"/>
  <text x="360" y="272" fill="#f5f6f8" font-size="12" text-anchor="middle">Forced unwind</text>
  <text x="360" y="287" fill="#8b909b" font-size="11" text-anchor="middle">selling Treasuries</text>

  <rect x="40" y="150" width="190" height="46" rx="8" fill="none" stroke="#ff4d87" stroke-width="1.5"/>
  <text x="135" y="172" fill="#f5f6f8" font-size="12" text-anchor="middle">Prices under pressure</text>
  <text x="135" y="187" fill="#8b909b" font-size="11" text-anchor="middle">volatility rises again</text>

  <path d="M450 101 L500 150" stroke="#8b909b" stroke-width="1.4" marker-end="url(#a)"/>
  <path d="M595 196 L595 250" stroke="#8b909b" stroke-width="1.4" marker-end="url(#a)"/>
  <path d="M500 273 L450 273" stroke="#8b909b" stroke-width="1.4" marker-end="url(#a)"/>
  <path d="M270 262 L135 196" stroke="#8b909b" stroke-width="1.4" marker-end="url(#a)"/>
  <path d="M135 150 L270 101" stroke="#ff4d87" stroke-width="1.6" marker-end="url(#a2)"/>

  <text x="360" y="325" fill="#8b909b" font-size="11" text-anchor="middle">March 2020: the unwind represented nearly half of hedge funds' Treasury sales.</text>

  <defs>
    <marker id="a" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="#8b909b"/></marker>
    <marker id="a2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="#ff4d87"/></marker>
  </defs>
</svg>
<figcaption>A volatility shock raises margins and haircuts, triggers margin calls, forces the unwind, and makes volatility rise again: a self-reinforcing loop. Sources: BIS (Schrimpf, Shin, Sushko, 2020), OFR, FEDS Notes.</figcaption>
</figure>

## What mandatory clearing will change

Regulators have not stood by. Fed governor Lisa Cook again described, on **20 November 2025**, hedge funds' Treasury positions as a systemic vulnerability, liable to make the market more vulnerable to stress. But the main lever is elsewhere: mandatory central clearing. The SEC rule, adopted in late 2023 then pushed back a year, now requires clearing of cash Treasury transactions by **31 December 2026**, and of repo by **30 June 2027**. The scope of clearing houses has been widened, with the approval of CME in December 2025 and ICE in early 2026, and a new FICC service to limit double margining.

The effect is double-edged. By interposing a clearing house, you reduce counterparty risk and make exits more orderly. But by imposing margins where repo was done at zero haircut, you make the trade more expensive and reduce its profitability, which could shrink its size, or push it toward less-regulated corners. The lasting lesson matches that of repo: the deepest market in the world leans on a heavily indebted arbitrage that lubricates it in calm times and drains it in a crisis. As long as this trade exists at this scale, the stability of US debt depends, in part, on the ability of a handful of funds to hold their positions when volatility runs away.

---

**Primary sources:** IMF, Global Financial Stability Report (April 2026, size of the trade estimated at around $1 trillion via CFTC and OFR proxies); CFTC, Market Risk Advisory Committee, "The Treasury Cash-Futures Basis Trade and Effective Risk Management" (10 December 2024); Office of Financial Research, Hedge Fund Monitor and cleared-repo collection; Federal Reserve, FEDS Notes on hedge-fund positions and the Barth and Kahn note; BIS, Schrimpf, Shin and Sushko, "Leverage and Margin Spirals in Fixed Income Markets during the COVID-19 Crisis" (2020); remarks by governor Lisa Cook (20 November 2025); SEC, Treasury clearing rule and compliance timeline (extensions of 25 February 2025, deadlines of 31 December 2026 and 30 June 2027); Federal Reserve Bank of Chicago on the effect of the clearing mandate. Figures and dates verified one by one.
