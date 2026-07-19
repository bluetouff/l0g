---
title: "Reading on-chain data: what the blockchain shows, and what it hides"
description: "A reference guide to on-chain data: public permanent ledgers versus delayed regulatory filings, how to read activity (active addresses, exchange flows), valuation metrics (realised cap, MVRV, SOPR, NVT), DeFi TVL and its double-counting traps, and the blind spots that make interpretation hard."
summary: "On-chain data is the set of transactions and balances publicly recorded on a blockchain. It is radically transparent and near real-time, but it requires metrics and labelling heuristics: active addresses, exchange flows, MVRV, SOPR and TVL are useful only if one remembers that an address is not an identity and most trading still occurs off-chain."
pubDate: 2026-06-29T19:30:00+02:00
updatedDate: 2026-06-29T19:30:00+02:00
sourceGuide: "lire-la-donnee-on-chain"
sourceUpdatedDate: 2026-06-29T19:30:00+02:00
tags: ["crypto", "on-chain", "data"]
category: crypto
draft: false
---

*A listed company reveals positions through quarterly filings. A public blockchain records transactions continuously in a permanent ledger that anyone can inspect. It looks like the opposite of regulatory opacity: no delay, no filer, no gatekeeper. But opacity has not disappeared. It has changed shape. This guide explains how to read the ledger, which metrics carry signal, and why radical transparency is never immediate readability.*

## The public permanent ledger

A public blockchain is a replicated, timestamped database where validated transactions remain permanently recorded. Amounts, addresses, timestamps and balances are visible. Unlike a [13F filing](/en/guides/how-to-analyze-sec-13f-filings/) or a Form 4, there is no quarterly delay. The reference source is the network itself; running a node gives access to the full history without an intermediary.

Two accounting models matter. Bitcoin uses UTXOs, unspent transaction outputs: a balance is the sum of fragments received and not yet spent. Ethereum uses an account model, closer to a balance ledger and better suited to smart contracts. This difference shapes which metrics are native and which are approximate.

The promise is powerful: an open, permissionless audit trail. The problem is interpretation. Complete data is not interpreted data.

## Reading activity: addresses, transactions, flows

The most cited activity metric is active addresses: addresses that sent or received a transaction over a period. It approximates network use, but it is not a user count. One person can control hundreds of addresses, while an exchange can aggregate millions of users behind a cluster of addresses.

Transaction count and volume have the same problem. A Bitcoin transaction can return change to the sender. Exchange internal transfers can inflate activity without representing economic usage. That is why data providers publish adjusted versions, removing transfers between addresses controlled by the same entity or very short-lived outputs. Without adjustment, you are measuring noise.

Exchange flows are watched closely by institutional crypto desks. Coins moving onto exchanges may be available for sale; coins leaving exchanges for self-custody may signal longer-term holding. But even that signal has become more ambiguous. Bitcoin exchange reserves fell from roughly **3.2 million BTC** in February 2020 to about **2.40 million BTC**, roughly **12%** of supply, by late April 2026. Read naively, that looks like accumulation. Read carefully, it is blurred by spot ETFs: since 2024, more than **1.45 million BTC** have moved into institutional custody, and some providers classify those addresses alongside exchange infrastructure.

A withdrawal is no longer automatically a retail cold-storage signal.

## Valuation: realised cap, MVRV, SOPR, NVT

On-chain data makes possible a kind of valuation that does not exist in traditional markets: an estimate of the market's cost basis.

Realised capitalisation values each coin at the price when it last moved on-chain, not at today's price. Dividing market capitalisation by realised capitalisation gives **MVRV**, a proxy for the market's average unrealised profit or loss. Introduced by Murad Mahmudov and David Puell in 2018, it is a regime indicator. Above roughly **3.5**, Bitcoin has historically been in euphoric territory; below **1**, the average holder is underwater, a zone often associated with capitulation and accumulation.

SOPR, the spent output profit ratio, asks whether coins moved on a given day were spent in profit or loss. A value above **1** means coins moved at a profit; below **1**, at a loss. NVT compares market capitalisation to on-chain transaction volume, roughly like a price-to-activity multiple.

None of these ratios should be read alone or across assets without context. Bitcoin and Ethereum do not play the same role, and the same level can mean different things on different networks.

## DeFi: TVL and double counting

In decentralised finance, the flagship metric is total value locked, or TVL: the dollar value of assets deposited in protocols. The open reference is DefiLlama, whose protocol adapters are public and auditable.

By mid-June 2026, total DeFi TVL was around **$71.8 billion** across more than 450 chains, down about **37%** year-to-date and almost **60%** below the November 2021 peak of roughly **$177 billion**. Ethereum concentrated about **53%** of TVL, showing reconcentration rather than unstoppable multichain diffusion.

TVL has three traps. First, it rises when token prices rise, even without new capital inflow. Second, double counting is real: an asset can be deposited, tokenised and redeposited across protocols. Third, TVL is not the size of the crypto market. [Stablecoin](/en/glossary/stablecoin/) market capitalisation, around **$314 billion** in mid-2026, was more than four times DeFi TVL.

## What the chain hides

This is the core issue. A blockchain shows all transactions, but it does not show identity.

An address is not a person. Address clustering depends on probabilistic heuristics. Exchange clusters can contain tens of millions of addresses and grow constantly. Entity labels are not facts; they are provider inferences.

Most trading also remains off-chain. A spot trade inside a centralised exchange updates an internal ledger, not the public blockchain. The chain sees deposits and withdrawals, not the internal order book. Reading only on-chain data is like watching a building's entrances and exits without seeing what happens inside.

Labels are also revised. Glassnode warns that exchange-balance series can change as labels improve. Two providers can publish different exchange reserve numbers for the same day.

Wrapped assets, bridges, layer-2s and lost coins add more distortion. Stablecoin supply issued by an issuer is not always active circulating supply. The data is exhaustive, but interpretation never is.

## Reading on-chain data in practice

Use block explorers for raw truth. Use Glassnode, CryptoQuant, DefiLlama, Dune, Nansen or Arkham for interpreted views, knowing each provider has assumptions. For continuous monitoring, l0g aggregates signals in its [dashboards](/dashboards/).

The method is simple: seek convergence, not one metric. Falling exchange reserves, low MVRV and SOPR below **1** together tell a stronger story than any single line. Always compare a metric to the same asset's own history. And cross on-chain data with macro liquidity, because crypto remains highly sensitive to global liquidity conditions.

## The core lesson

The blockchain made public what traditional finance often hides: balances, transactions and flows. But it did not abolish opacity. It moved opacity into labelling heuristics, off-chain settlement and calculation conventions. Reading on-chain data means knowing exactly where the data stops and interpretation begins.

---

**Main sources:** Glassnode research on exchange metrics and address clustering; Glassnode documentation for active addresses, MVRV, SOPR, NVT and realised price; Newhedge on the MVRV ratio and its origin; TRdesk on Bitcoin exchange reserves and ETF custody; DefiLlama methodology and TVL/stablecoin data; CoinLaw DeFi market statistics based on DefiLlama snapshots; Bitget Academy on exchange reserves and interpretation limits.
