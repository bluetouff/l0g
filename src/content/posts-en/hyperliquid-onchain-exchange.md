---
title: "Hyperliquid: the on-chain exchange that buys back its own token and knocks on TradFi's door"
description: "Hyperliquid has become the leading decentralised derivatives market, with a fully on-chain order book and an unprecedented business model: nearly all its fees buy back its own token. With about $173 billion of monthly volume, ETFs launched by Bitwise and 21Shares, and perpetuals on equities, commodities and indices, it opens doors to traditional finance. Mechanics, model, bridges and risks, put into data."
pubDate: 2026-07-14T10:26:00+02:00
updatedDate: 2026-07-14T10:26:00+02:00
tags: ["crypto", "markets", "regulation", "tech"]
draft: false
sourceArticle: "hyperliquid-bourse-onchain-tradfi"
sourceUpdatedDate: 2026-06-28
---
*Most crypto exchanges are black boxes: you see the prices, never the workings. Hyperliquid takes the opposite tack. Its order book, its matching engine and its liquidations live entirely on a public blockchain, verifiable in real time. In under two years, this protocol has become the leading decentralised derivatives market, with a business model that stands out: nearly all its fees serve to buy back its own token on the market. And it is starting to build bridges toward traditional finance, from ETFs to equity perpetuals. Here is the machine, its fuel, its doors, and its fragilities, put into data.*

Hyperliquid is not a mere application, it is a layer-1 blockchain designed for one thing, running an exchange. It rests on two engines sharing the same consensus, named HyperBFT. The first, HyperCore, is an on-chain order book able to process up to **200,000** orders per second, with one-block finality. The second, HyperEVM, launched on **18 February 2025**, is an Ethereum-compatible environment that allows deploying smart contracts accessing the order book's liquidity directly, with no bridge between two chains. Where centralised exchanges keep their innards secret, every order, every transaction and every liquidation is publicly traceable there. It is a promise of radical transparency, exactly the terrain this journal seeks to illuminate.

## The real weight: volumes and market shares

The figures situate the scale of the phenomenon. Over a thirty-day window in spring 2026, Hyperliquid processed about **$172.63 billion** of perpetuals volume, nearly **32%** of the volume recorded across all decentralised derivatives exchanges, and **3.3** times the volume of the second player, Aster. Open interest exceeded **$9 billion**. On a daily basis, some estimates put its dominance above **50%** of the segment, the gap owing to methodologies and to suspicions of artificial volume at some competitors.

On valuation, and these figures move fast, the HYPE token had a market cap of around **$14 billion** at the end of June 2026, for a fully diluted value of about **$60 billion**, tenth among crypto assets, after an all-time high of **$76.70**. The protocol generates real revenue, on the order of several million dollars of fees a day, an annualised pace above **$1.3 billion**. This is not a use-less token backed by a promise, it is a market infrastructure that collects commissions.

<figure class="infographic">
<svg viewBox="0 0 720 300" role="img" aria-label="Monthly perpetuals volume: Hyperliquid against other decentralised exchanges" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="300" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">The leader in decentralised derivatives</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">30-day perpetuals volume, spring 2026, in billions of dollars. Source: DefiLlama.</text>
  <text x="32" y="104" fill="#5eead4" font-size="12">HYPERLIQUID</text>
  <rect x="220" y="92" width="450" height="26" fill="#5eead4" opacity="0.85"></rect>
  <text x="230" y="110" fill="#0c0d10" font-size="12" font-weight="700">$172.63bn · ~32% of the segment</text>
  <text x="32" y="154" fill="#ff4d87" font-size="12">ASTER (no 2)</text>
  <rect x="220" y="142" width="138" height="26" fill="#ff4d87" opacity="0.85"></rect>
  <text x="368" y="160" fill="#d6d9df" font-size="12">$52.76bn</text>
  <text x="32" y="204" fill="#f5b13d" font-size="12">NEXT 7 COMBINED</text>
  <rect x="220" y="192" width="300" height="26" fill="#f5b13d" opacity="0.7"></rect>
  <text x="530" y="210" fill="#d6d9df" font-size="12">$236.90bn</text>
  <text x="32" y="262" fill="#d6d9df" font-size="12">Hyperliquid is 3.3 times the second, and alone nearly three-quarters</text>
  <text x="32" y="282" fill="#8b909b" font-size="12">of the combined volume of the next seven exchanges. Open interest above $9 billion.</text>
</svg>
<figcaption>On the decentralised perpetuals segment, Hyperliquid dominates by a wide margin, far ahead of the second player. 30-day volumes, spring 2026. Source: DefiLlama, via public dashboards.</figcaption>
</figure>

## The business model: the buyback loop

This is where Hyperliquid really stands out. The HYPE token was distributed at the end of **November 2024** through an airdrop, with no venture capital, no private sale, about **31%** going directly to the community. But the originality lies in the value engine. Nearly all transaction fees, around **97%** per the parameters, are paid to an assistance fund that buys back HYPE on the open market. In parallel, the gas fees paid on HyperEVM are burned. The result is a mechanical loop: the higher the volume, the higher the fees, the heavier the buybacks, which supports demand for the token, independently of speculation.

This logic brings HYPE close to a stock that would devote all its earnings to buying back its own shares. Over a recent ninety-day period, the protocol bought back about **$135 million** of token, helping to absorb the selling pressure of unlocks. It is a rarity in the crypto universe, a direct and automated link between a platform's real activity and the value of its token. Whether this link holds at scale remains to be seen, and that is the subject of the final part.

<figure class="infographic">
<svg viewBox="0 0 720 320" role="img" aria-label="The buyback loop: from volume to HYPE token buybacks" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="320" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">The token buyback loop</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">About 97% of fees buy back HYPE. Schematic.</text>
  <rect x="60" y="92" width="170" height="52" rx="8" fill="none" stroke="#5eead4" stroke-width="1.5"></rect>
  <text x="145" y="123" fill="#f5f6f8" font-size="13" text-anchor="middle">Trading volume</text>
  <rect x="490" y="92" width="170" height="52" rx="8" fill="none" stroke="#f5b13d" stroke-width="1.5"></rect>
  <text x="575" y="123" fill="#f5f6f8" font-size="13" text-anchor="middle">Fees collected</text>
  <rect x="490" y="232" width="170" height="52" rx="8" fill="none" stroke="#ff4d87" stroke-width="1.5"></rect>
  <text x="575" y="256" fill="#f5f6f8" font-size="13" text-anchor="middle">Assistance fund</text>
  <text x="575" y="273" fill="#8b909b" font-size="10" text-anchor="middle">buys back HYPE</text>
  <rect x="60" y="232" width="170" height="52" rx="8" fill="none" stroke="#5eead4" stroke-width="1.5"></rect>
  <text x="145" y="256" fill="#f5f6f8" font-size="13" text-anchor="middle">Demand for HYPE</text>
  <text x="145" y="273" fill="#8b909b" font-size="10" text-anchor="middle">token support</text>
  <line x1="230" y1="118" x2="488" y2="118" stroke="#d6d9df" stroke-width="1.6" marker-end="url(#h1)"></line>
  <line x1="575" y1="144" x2="575" y2="230" stroke="#d6d9df" stroke-width="1.6" marker-end="url(#h1)"></line>
  <line x1="488" y1="258" x2="232" y2="258" stroke="#d6d9df" stroke-width="1.6" marker-end="url(#h1)"></line>
  <line x1="145" y1="230" x2="145" y2="146" stroke="#d6d9df" stroke-width="1.6" marker-end="url(#h1)"></line>
  <text x="360" y="110" fill="#8b909b" font-size="11" text-anchor="middle">fees</text>
  <text x="360" y="250" fill="#8b909b" font-size="11" text-anchor="middle">market buyback</text>
  <text x="32" y="308" fill="#8b909b" font-size="11">A virtuous loop in an active market, but dependent on cyclical volume.</text>
  <defs><marker id="h1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="#d6d9df"></path></marker></defs>
</svg>
<figcaption>Volume generates fees, nearly all of which fund the buyback of HYPE on the market, which supports demand. The loop is powerful in an active market, fragile if volumes ebb. Schematic.</figcaption>
</figure>

## HIP-3 and HIP-4: the market factory

Hyperliquid does not stop at crypto perpetuals. In **October 2025**, the HIP-3 update opened permissionless creation of perpetual markets: anyone can now launch a market by locking up HYPE, on commodities, equities, currencies or indices. Four months after its launch, this function already represented about **10%** of the protocol's revenue, driven notably by perpetuals on silver and oil. In **February 2026**, HIP-4 added opinion markets, binary contracts on events, further broadening the audience beyond crypto traders alone. The trajectory is clear: to move from a perpetuals exchange to an on-chain financial operating system, able to host almost any asset.

## The doors to traditional finance

This is the heart of the matter. Hyperliquid opens several distinct accesses to the world of classic finance. The first is the regulated wrapper. In **May 2026**, the managers Bitwise and 21Shares launched spot ETFs on HYPE, which gathered more than **$137 million** of assets by early June. These products let a traditional investor gain exposure to the token without custody, and inject regulated capital, less sensitive to the cycles of crypto retail trading.

The second access is the repatriation of traditional assets onto the chain. Via HIP-3, perpetuals on equities, indices, commodities and currencies now trade in the same transparent order book as cryptos. Traditional finance does not only come to buy the token, it sees its own underlyings become tradable products on Hyperliquid's infrastructure.

The third access is distribution. The Builder Codes mechanism lets third-party platforms build their own interfaces on Hyperliquid by routing their users to it, in exchange for a fee share. It is a white-label infrastructure logic, which turns the protocol into rails rather than a mere application. Add ongoing institutional integrations on custody and settlement. Put end to end, these doors draw a shift: from a decentralised-exchange token to a market-infrastructure asset, valued as such. For the regulatory context of this convergence, see our analyses of [MiCA](/en/guides/decode-mica-crypto-regulation/) and the [GENIUS Act on stablecoins](/en/guides/read-stablecoins-genius-act/).

<figure class="infographic">
<svg viewBox="0 0 720 300" role="img" aria-label="Circulating supply versus max supply of the HYPE token" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="300" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">The token, and its coming dilution</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Circulating supply versus max supply, end June 2026. Source: CoinGecko.</text>
  <text x="32" y="104" fill="#5eead4" font-size="12">CIRCULATING</text>
  <rect x="220" y="92" width="99" height="26" fill="#5eead4" opacity="0.85"></rect>
  <text x="329" y="110" fill="#d6d9df" font-size="12">~220 million</text>
  <text x="32" y="154" fill="#8b909b" font-size="12">MAX SUPPLY</text>
  <rect x="220" y="142" width="450" height="26" fill="#2a2c33"></rect>
  <rect x="220" y="142" width="99" height="26" fill="#5eead4" opacity="0.85"></rect>
  <text x="430" y="160" fill="#d6d9df" font-size="12" text-anchor="middle">1 billion tokens</text>
  <text x="32" y="214" fill="#d6d9df" font-size="12">Market cap about $14bn, fully diluted value about $60bn.</text>
  <text x="32" y="240" fill="#8b909b" font-size="12">Future unlocks must be absorbed by buybacks to support the price.</text>
  <text x="32" y="270" fill="#f5b13d" font-size="12">The model's central tension: buybacks versus dilution.</text>
</svg>
<figcaption>About 220 million HYPE circulate out of a maximum of one billion. The gap between market cap and diluted value measures the coming dilution, which buybacks must absorb. Source: CoinGecko, end June 2026.</figcaption>
</figure>

## The limits and the risks

Enthusiasm does not exempt one from a severe examination, and several fragilities deserve to be laid out plainly. The first is dilution. With about **220 million** tokens in circulation out of one billion, regular unlocks will keep feeding supply, and the buyback mechanic only supports the price if it absorbs those unlocks. Yet buybacks depend on volume, itself cyclical and sensitive to risk appetite. In a bear market, fees ebb, buybacks weaken, and the loop seizes at the worst moment.

The second fragility touches governance and centralisation. In March 2025, a large position on a token named JELLYJELLY caused a liquidation risk that the whole set of validators resolved by removing the market. The episode showed that a network presented as decentralised could intervene in an emergency in a very concentrated way, and it raised the question of the risk carried by the community liquidity fund that serves as a buffer. The third is regulatory. Access is restricted in several jurisdictions, including the United States, and established exchanges like the CME are pressing the US regulator to frame these platforms, invoking the risks of manipulation and sanctions evasion. A customer-identification requirement would collide head-on with the permissionless model.

There remains, finally, a concentration risk. That a single protocol dominates decentralised perpetuals to this extent creates a single point of failure for the whole segment. And the very measure of this dominance is debatable, since some competitors' volumes are suspected of being inflated. On-chain transparency precisely allows these figures to be verified, which changes the nature of the debate compared with opaque exchanges.

## What Hyperliquid lets us see

Hyperliquid is a rare case where a crypto token corresponds to real cash flows and to publicly verifiable data, where the sector usually runs on narrative. Its doors to traditional finance are concrete, from ETFs to equity and commodity perpetuals, through white-label distribution and institutional custody integrations. They remain, however, curbed by regulation and threatened by dilution. The real question is not whether this bridge exists, it does, but whether it will hold without recreating the opacity and centralisation Hyperliquid claims to replace. The good news, for anyone who wants to judge on the record, is that everything happens on a public chain. The verdict will read there in data, not in promises.

---

**Primary sources:** DefiLlama, Hyperliquid dashboards (perpetuals volume, fees, revenue, open interest, market shares of decentralised derivatives exchanges, routing of about 97 to 99% of fees to the assistance fund); CoinGecko (price, market cap of about $14 billion, fully diluted value of about $60 billion, circulating supply of about 220 million out of one billion, all-time high of $76.70, end June 2026); Hyperliquid documentation and HIP-3 (October 2025) and HIP-4 (February 2026) proposals, HyperEVM (18 February 2025), HyperCore and HyperBFT; specialist-press reporting on the Bitwise and 21Shares ETFs (May 2026, more than $137 million of assets), on token buybacks and on the JELLYJELLY episode of March 2025. Market figures are dated to mid-2026 and evolve rapidly; competing platforms' volumes are subject to caution.
