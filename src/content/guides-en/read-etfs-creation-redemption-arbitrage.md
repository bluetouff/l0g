---
title: "ETFs: creation, redemption and price formation"
description: "Follow an ETF’s shares and underlying assets through creation, redemption and arbitrage. A worked example, bond-basket mechanics and execution costs."
summary: "ETF shares trade between investors on an exchange, while authorised participants can create or redeem blocks of shares with the fund. Arbitrage connects these markets, subject to transaction costs, funding constraints and underlying liquidity."
pubDate: 2026-10-19T10:40:00+02:00
sourceGuide: "lire-les-etf-creation-rachat-arbitrage"
sourceUpdatedDate: 2026-10-19T10:40:00+02:00
tags: ["ETF", "markets", "liquidity", "investment"]
category: marches
draft: false
---

An ETF puts a portfolio exposure within reach of a stock-exchange order. Its apparent simplicity rests on a connection between two markets: the shares investors trade and the assets the fund holds. Following that connection helps distinguish a change in the portfolio’s value from a change in the price paid for an ETF share.

This guide covers conventional open-end ETFs, using US documentation as its regulatory reference. Leveraged, inverse and synthetic products, and exchange-traded debt instruments, require additional contractual analysis. All amounts in the worked example are **illustrative assumptions**, stated in currency units (CU), rather than observations of a real fund.

## Connect the secondary and primary markets

On the **secondary market**, existing shares move from seller to buyer. A busy trading day can leave the number of shares outstanding unchanged. On the **primary market**, an authorised participant, or AP, deals with the fund: it delivers a basket of securities, potentially with a cash adjustment, in exchange for newly issued shares. Redemption reverses that exchange. The [SEC describes this structure](https://www.sec.gov/investment/exchange-traded-funds-small-entity-compliance-guide).

A market maker quotes buying and selling prices; an AP has contractual access to creation and redemption. The same institution may perform both functions, but the roles are distinct. When investigating flows into a fund, examine net creations and their terms alongside exchange turnover. Counting every resale as a new investment into the fund would confuse trading activity with changes in its outstanding capital.

**Net asset value**, or NAV, is the fund’s net assets divided by its shares outstanding. The exchange price reflects transactions in those shares. The difference, expressed relative to NAV, is a premium or discount. Its interpretation depends on when and how the underlying assets were valued. [Investor.gov, ETF investor bulletin](https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-24).

## Work through a creation arbitrage

Assume an eligible basket can be bought for **100,000 CU** and exchanged for **1,000 ETF shares**. Each share represents 100 CU of assets, while buyers will pay 101 CU on the exchange. The block size is chosen for clarity; actual creation units are fund-specific.

The AP buys and delivers the basket, receives the shares and sells them for 101,000 CU. With **400 CU of assumed total costs**, the operation earns **600 CU**: 101,000 − 100,000 − 400. Costs here combine execution, financing, hedging and creation charges. The calculation assumes executable prices, sufficient size and successful settlement. In practice, an intermediary may sell the ETF short first and deliver newly created shares to close the position.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 365" role="img" aria-labelledby="premium-etf-en-title premium-etf-en-desc" style="display:block;width:100%;max-width:600px;height:auto;margin-inline:auto;font-family:var(--font-read);background:var(--color-surface);border:1px solid var(--color-line);border-radius:12px">
<title id="premium-etf-en-title">Create shares against a basket</title>
<desc id="premium-etf-en-desc">Hypothetical creation and sale of 1,000 shares. Arrows show deliveries, not volumes to scale. Basket 100,000, sale 101,000 and costs 400 CU. l0g calculations; simplified sequence with unchanged prices.</desc>
<text x="24" y="32" fill="var(--color-bright)" font-size="22" text-anchor="start" font-weight="700">Create shares against a basket</text>
<text x="24" y="56" fill="var(--color-muted)" font-size="14" text-anchor="start">Teaching example · currency units</text>
<text x="70" y="96" fill="var(--color-bright)" font-size="18" text-anchor="middle" font-weight="700">Fund</text>
<line x1="70" y1="108" x2="70" y2="300" stroke="var(--color-line)" stroke-width="1" stroke-dasharray="4 5"/>
<text x="240" y="96" fill="var(--color-bright)" font-size="18" text-anchor="middle" font-weight="700">AP</text>
<line x1="240" y1="108" x2="240" y2="300" stroke="var(--color-line)" stroke-width="1" stroke-dasharray="4 5"/>
<text x="410" y="96" fill="var(--color-bright)" font-size="18" text-anchor="middle" font-weight="700">Exchange</text>
<line x1="410" y1="108" x2="410" y2="300" stroke="var(--color-line)" stroke-width="1" stroke-dasharray="4 5"/>
<line x1="240" y1="145" x2="70" y2="145" stroke="var(--color-amber)" stroke-width="2"/><polygon points="70,145 77,149 77,141" fill="var(--color-amber)"/>
<text x="155" y="135" fill="var(--color-paper)" font-size="15" text-anchor="middle">Basket: 100,000</text>
<line x1="70" y1="192" x2="240" y2="192" stroke="var(--color-signal)" stroke-width="2"/><polygon points="240,192 233,188 233,196" fill="var(--color-signal)"/>
<text x="155" y="182" fill="var(--color-paper)" font-size="15" text-anchor="middle">1,000 shares</text>
<line x1="240" y1="240" x2="410" y2="240" stroke="var(--color-signal)" stroke-width="2"/><polygon points="410,240 403,236 403,244" fill="var(--color-signal)"/>
<text x="325" y="230" fill="var(--color-paper)" font-size="15" text-anchor="middle">1,000 shares</text>
<line x1="410" y1="287" x2="240" y2="287" stroke="var(--color-amber)" stroke-width="2"/><polygon points="240,287 247,291 247,283" fill="var(--color-amber)"/>
<text x="325" y="277" fill="var(--color-paper)" font-size="15" text-anchor="middle">101,000 CU</text>
<line x1="24" y1="315" x2="456" y2="315" stroke="var(--color-line)" stroke-width="1"/>
<text x="24" y="341" fill="var(--color-bright)" font-size="17" text-anchor="start" font-weight="600">Gap 1,000 − costs 400 = gain 600</text>
</svg>
<figcaption>Hypothetical creation and sale of 1,000 shares. Arrows show deliveries, not volumes to scale. Basket 100,000, sale 101,000 and costs 400 CU. l0g calculations; simplified sequence with unchanged prices. <a href="https://www.sec.gov/investment/exchange-traded-funds-small-entity-compliance-guide">Mechanism: SEC</a>.</figcaption>
</figure>

Selling the ETF adds share supply, while buying the basket adds demand for its underlying securities. Those trades tend to narrow the gap. If the premium falls to 0.2%, proceeds become 100,200 CU and the same operation loses 200 CU after costs. The relevant incentive is the spread **after frictions**. [Todorov’s BIS analysis](https://www.bis.org/publications/anatomy-bond-etf-arbitrage) examines this mechanism and the constraints faced by intermediaries.

A discount invites the opposite sequence: buy ETF shares, redeem them for a basket and sell the securities. Each leg must be feasible at the price used in the calculation. Published NAV provides a valuation reference; the price available for an immediate basket trade may differ, particularly when underlying quotes are old or costly to execute.

## Interpret bond ETF discounts through their baskets

Individual bonds may trade infrequently, in different minimum sizes and at different times. Creation and redemption baskets can also contain only a fraction of the fund’s holdings. [Shim and Todorov’s research on ETFs and illiquid assets](https://www.bis.org/publications/working-paper-975-etfs-illiquid-assets-and-fire-sales) explores how these fractional baskets affect arbitrage and the transmission of market stress.

A useful investigation therefore compares three objects: an executable ETF price, published NAV and the executable value of the exchanged basket. Record their timestamps. A discount might reflect more expensive liquidation, reduced intermediary capacity or a portfolio valuation that absorbs new information more slowly than the ETF price. The price/NAV gap alone leaves those possibilities unresolved.

The BIS research addresses particular market structures and observed episodes. It provides a framework for asking better questions, rather than a guarantee that every bond ETF will absorb shocks or quickly eliminate a discount. A specific fund still requires its prospectus, basket arrangements and trading evidence.

## Separate index tracking from execution costs

**Tracking difference** compares the fund’s return with its benchmark over a specified period. **Tracking error** measures the variability of periodic return differences. A premium or discount instead compares a share price with NAV at a particular time. Close portfolio tracking can coexist with expensive exchange execution.

The [MSCI Indonesia investigation](/en/analysis/msci-indonesia-free-float-index-risk/#the-mandate-determines-the-pressure) follows the link from index eligibility to a fund’s portfolio target. It separates benchmark-driven rebalancing from investor creations and redemptions, keeping the mandates of broad emerging-market funds and a country ETF distinct.

An investor’s costs include fund charges, any brokerage fees, the bid/ask spread and changes in the premium or discount between entry and exit. Buying at 100.20 CU and immediately selling at 99.80 CU loses 0.40 CU per share, assuming unchanged underlying prices. That hypothetical round trip isolates the spread; it says little about the return from holding the fund over a longer period. [Investor.gov, mutual fund and ETF fees](https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/mutual-fund-and-etf-fees-and-expenses-investor-bulletin).

A limit order specifies an acceptable execution price while accepting the possibility that the trade will remain unfilled. Observing quotes while the principal underlying markets are open makes the comparison more coherent, although it cannot ensure a narrow spread. Daily share turnover also provides an incomplete picture of the depth available for an order of a particular size.

## Assemble a fund-level reading file

Start with the prospectus and index methodology: exposure, replication, currency, distributions and any currency hedge. Then examine holdings, available basket information, premium/discount history and published costs. Finally, record a bid/ask quote, its time and the intended order size. This connects the investment exposure to the transaction through which it is acquired.

The resulting diagnosis should separate underlying performance, tracking, currency movements and entry price. Each calls for different evidence. Continue with the [guide to margin calls and collateral](/en/guides/understand-margin-calls-and-collateral/) for constraints on arbitrage capacity, and the [credit-spread guide](/en/guides/read-credit-spreads-oas/) for risks embedded in bond portfolios.

## Sources and limitations

Regulatory sources establish the structure of the covered funds; BIS research supplies evidence about mechanisms and particular market episodes. Every numerical example can be reproduced from its stated assumptions. Tax, failed delivery and price movements during execution are omitted from the worked arbitrage and would need to be restored in an assessment of an actual transaction. Contract terms determine how those risks apply to a specific ETF.
