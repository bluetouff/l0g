---
title: "CCIP 2.0: moving assets with their rules"
seoTitle: "CCIP 2.0: transfers, controls and financial risks | l0g"
description: "CCIP 2.0 connects blockchains with configurable controls. Three sourced diagrams explain token transfers, policy failures and early-execution risks."
pubDate: "2026-09-28T19:27:37+02:00"
tags: ["Chainlink", "CCIP", "tokenisation", "crypto", "finance"]
draft: false
ogImage: "/illustrations/news/ccip-2-actifs-regles-v1.jpg"
sourceArticle: "ccip-2-0-actifs-regles-crypto-finance"
sourceUpdatedDate: "2026-09-28T19:27:37+02:00"
---

An asset manager can issue a fund on one blockchain and still fail to reach investors on another. A bank can own a perfectly valid asset that cannot serve as collateral in the system where it needs funding. The security exists. So does the liquidity. That does not mean they can meet.

This is the problem addressed by Chainlink’s **Cross-Chain Interoperability Protocol**, or **[CCIP](/en/glossary/ccip/)**. Version **2.0 launched on 28 September 2026**. Its significance extends beyond moving cryptocurrencies: it gives issuers more ways to distribute assets across networks while retaining verification requirements and transfer controls. [S01](https://chain.link/blog/introducing-ccip-2-0)

The best way to understand the upgrade is to follow an asset, rather than a list of partners. Who authorises its departure? Who confirms that the departure really happened? Who can allow units to appear on the receiving network? And what happens if the original blockchain revises its history?

**CCIP 2.0 makes more of those choices configurable. It does not turn every new option on automatically.** The default path retains Chainlink verification, full source-chain finality and Chainlink’s execution service. A release announcement is not a promise that every transfer is now instantaneous. [S02](https://docs.chain.link/ccip)

## The market: making an asset useful beyond its original network

[*Tokenisation*](/en/glossary/tokenisation-des-actifs/) represents an asset or a right as a token, a record that software can manipulate on a digital ledger. A fund token does not create the bonds held by the fund. It represents a right whose substance depends on the legal structure and recordkeeping arrangements. Work by the Bank for International Settlements examines how combining tokenised money and assets could improve financial transactions. [S27](https://www.bis.org/media-releases/20250624-next-generation-monetary-and-financial-system-takes-shape-based-tokenised-unified-ledger-bis)

The scale of conventional finance explains the attention. SIFMA’s Fact Book, published on **19 August 2026**, reports **$160.7 trillion** in global fixed-income securities outstanding and **$157.8 trillion** in global equity market capitalisation for **2025**. These are different types of stock, not payment flows. Neither is CCIP’s potential revenue. [S04](https://www.sifma.org/news/blog/2026-capital-markets-fact-book-key-findings)

The addressable activity is narrower and more tangible: **connecting ledgers, carrying instructions and making assets transferable between places where they can be used**. A crypto treasury might rebalance stablecoins. A fund manager might distribute the same fund across additional networks. A lender might accept collateral previously confined to a different system.

Swift’s experiments, published on **31 August 2023**, explored precisely this connectivity problem: linking existing infrastructure to multiple blockchains rather than building a separate connection for every destination. The work used simulated assets and included Ethereum Sepolia, a test network. It demonstrated technical feasibility, not the commercial migration of Swift’s banking network. [S05](https://www.swift.com/de/node/309230)

Consider a purely hypothetical case. A company owns **€1 million of fund units** on network A. A lender on network B accepts the fund with a **40% collateral haircut**, meaning it recognises only 60% of the asset’s value for lending purposes. Moving the units could make them available to support a **€600,000 loan** on B. The lender must still accept the asset, have the cash and be able to enforce its collateral rights.

The potential benefit is not an increase in the fund’s value. It is another use for the same economic exposure. If the units remain pledged to a different creditor, there is more to solve than a messaging problem: two transactions would be relying on the same collateral. The arrangement must establish that the asset is legally available as well as technically transferable.

## Following a transfer between blockchains

CCIP does not physically move a digital object. It transmits a message whose attestations are checked by destination contracts before those contracts change their own state. **Token pools**, the contracts associated with a token on each network, perform the issuer’s specified burning, minting or locking operations. They are not necessarily trading pools that exchange one asset for another. [S07](https://docs.chain.link/ccip/concepts/architecture/overview)

In a **burn-and-mint** design, units are destroyed on A and recreated on B. Suppose 100 units exist and 40 must change networks. After delivery, A has 60 and B has 40. During the transfer, the units destroyed on A are not yet usable on B. This example assumes matching decimals, no fees deducted from the token amount and no unrelated issuance. [S06](https://docs.chain.link/ccip/concepts/cross-chain-token/overview)

<figure class="infographic" style="max-width:28rem;margin:2rem auto 2.5rem;padding-bottom:0.5rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 450" role="img" aria-labelledby="ccip2-en-1-title ccip2-en-1-desc" style="width:100%;height:auto">
<title id="ccip2-en-1-title">40 units change networks</title>
<desc id="ccip2-en-1-desc">Three states: 100 units on A; 60 on A and 40 in transit; 60 on A and 40 on B.</desc>
<rect x="0" y="0" width="480" height="450" fill="var(--color-surface)" />
<text x="24" y="38" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="600" fill="var(--color-paper)">40 units change networks</text>
<text x="24" y="72" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400" fill="var(--color-muted)">Hypothetical burn-and-mint transfer</text>
<text x="24" y="112" font-family="Arial, Helvetica, sans-serif" font-size="23" font-weight="600" fill="var(--color-paper)">Before: A 100 · B 0</text>
<rect x="24" y="130" width="432" height="28" fill="var(--color-signal)" />
<text x="24" y="230" font-family="Arial, Helvetica, sans-serif" font-size="23" font-weight="600" fill="var(--color-paper)">In transit: A 60 · B 0</text>
<rect x="24" y="248" width="259.2" height="28" fill="var(--color-signal)" />
<rect x="283.2" y="248" width="172.8" height="28" fill="var(--color-surface)" stroke="var(--color-accent)" stroke-width="2" />
<text x="24" y="307" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400" fill="var(--color-muted)">40 awaiting destination mint</text>
<text x="24" y="348" font-family="Arial, Helvetica, sans-serif" font-size="23" font-weight="600" fill="var(--color-paper)">Delivered: A 60 · B 40</text>
<rect x="24" y="366" width="259.2" height="28" fill="var(--color-signal)" />
<rect x="283.2" y="366" width="172.8" height="28" fill="var(--color-accent)" />
<text x="24" y="429" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400" fill="var(--color-muted)">A: turquoise · B: pink</text>
</svg>
<figcaption>l0g model, initial lot of 100 units. The empty segment represents 40 burned units still unavailable on B. Matching decimal precision, no fees deducted from the lot, no unrelated issuance. <a href="https://docs.chain.link/ccip/concepts/cross-chain-token/overview">Mechanism: CCT documentation.</a></figcaption>
</figure>

An attestation is a signed statement tied to an identified message, not a generic assurance that everything is safe. The message describes the intended operation. Its journey separates the source transaction, production and collection of attestations, and destination execution. The two blockchain transactions do not become a single atomic transaction spanning both networks. [S08](https://docs.chain.link/ccip/concepts/message-lifecycle)

Other accounting models exist. **Lock-and-mint** immobilises the original asset and issues a representation elsewhere, making the integrity of that backing essential. **Lock-and-release** releases units already sitting in the receiving pool, which requires destination liquidity. Treating these designs as interchangeable conceals materially different backing and liquidity risks. [S06](https://docs.chain.link/ccip/concepts/cross-chain-token/overview)

These transfer mechanisms predate 2.0. **Version 1.6, launched on 19 May 2025**, extended CCIP to environments outside the Ethereum Virtual Machine (non-EVM), beginning with Solana. The September 2026 upgrade is primarily about the controls and execution choices that integrators can place around a transfer. [S03](https://chain.link/blog/ccip-v1-6-is-now-live)

## An institution can require its own verification

A bank may not want to rely entirely on an external provider’s statement that tokens were destroyed elsewhere. It may also require confirmation from its own system or from another party it selects.

CCIP 2.0 supports additional **Cross-Chain Verifiers**, or **CCVs**, which observe messages and produce attestations that can be checked at the destination. The default **Committee Verifier** has **16 independent node operators, according to the documentation**. Their signatures are assembled into a quorum result. That is neither 16 separate CCV systems nor a requirement for every operator to agree unanimously. [S07](https://docs.chain.link/ccip/concepts/architecture/overview) [S09](https://docs.chain.link/ccip/concepts/ccvs/verification-models)

An issuer can require Chainlink verification **and** a verifier it selects. Both then become necessary. That combination requires explicit configuration: for a token-only transfer, a pool-specific CCV list can replace the defaults. The documented mechanism lets an integrator retain those defaults while adding the desired CCV. Optional verifiers can instead be subject to a threshold. [S07](https://docs.chain.link/ccip/concepts/architecture/overview) [S11](https://docs.chain.link/ccip/concepts/cross-chain-token/advanced-pool-hooks)

This changes the issuer’s operational position. It can make its own verification a condition of minting its tokens on another network, rather than delegating the entire decision to outside infrastructure. An asset-specific verifier can also incorporate an existing validation mechanism: the documentation describes models associated with Circle and Lombard. [S09](https://docs.chain.link/ccip/concepts/ccvs/verification-models)

Additional approval also creates another potential veto. If a required CCV is unavailable, execution waits. Chainlink expressly assigns responsibility for external verifiers’ implementation and availability to their operators; mismatched source and destination configurations can prevent delivery too. [S10](https://docs.chain.link/ccip/concepts/ccvs/trust-responsibility-model)

Independence therefore needs investigation. Two services using the same keys, upstream data or infrastructure may suffer a common failure. A genuinely separate verifier, by contrast, can prevent an incorrect mint without ever being able to authorise a legitimate mint on its own. The trade-off is between protection and availability, not simply between fewer and more boxes on a diagram.

## Transfer rules need enforcement at both ends

For a regulated asset, confirming a source-chain burn is only part of the job. The recipient may need to be an eligible holder. A transaction limit may apply. Different destinations may require different controls.

CCIP 2.0 provides optional **AdvancedPoolHooks**, control points attached to token pools. They can call **ACE, Chainlink’s Automated Compliance Engine**. A source check runs **before** tokens are locked or burned; a destination check runs **before** release or minting. Each chain has its own configuration. Connecting the chains does not automatically align those policies. [S11](https://docs.chain.link/ccip/concepts/cross-chain-token/advanced-pool-hooks)

<figure class="infographic" style="max-width:28rem;margin:2rem auto 2.5rem;padding-bottom:0.5rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 480" role="img" aria-labelledby="ccip2-en-2-title ccip2-en-2-desc" style="width:100%;height:auto">
<title id="ccip2-en-2-title">Two checks, different outcomes</title>
<desc id="ccip2-en-2-desc">Rejection before burn leaves 100 units on A. After burn, rejection on B leaves A 60 and B zero. After acceptance and execution: A 60, B 40.</desc>
<rect x="0" y="0" width="480" height="480" fill="var(--color-surface)" />
<text x="24" y="38" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="600" fill="var(--color-paper)">Two checks, different outcomes</text>
<text x="24" y="72" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400" fill="var(--color-muted)">Scenario: transfer 40 units</text>
<g><rect x="24" y="94" width="260" height="72" fill="var(--color-surface)" stroke="var(--color-muted)" stroke-width="2" /><text x="40" y="122" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="600" fill="var(--color-paper)">Check on A</text><text x="40" y="150" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400" fill="var(--color-paper)">Before burning</text></g>
<g><rect x="316" y="94" width="140" height="72" fill="var(--color-surface)" stroke="var(--color-muted)" stroke-width="2" /><text x="332" y="122" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="600" fill="var(--color-accent)">Reject</text><text x="332" y="150" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400" fill="var(--color-accent)">A: 100</text></g>
<path d="M 284 130 H 308 M 300 124 L 308 130 L 300 136" fill="none" stroke="var(--color-paper)" stroke-width="2" />
<path d="M 154 168 V 186 M 148 178 L 154 186 L 160 178" fill="none" stroke="var(--color-paper)" stroke-width="2" />
<g><rect x="24" y="194" width="260" height="72" fill="var(--color-surface)" stroke="var(--color-muted)" stroke-width="2" /><text x="40" y="222" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="600" fill="var(--color-signal)">40 burned on A</text><text x="40" y="250" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400" fill="var(--color-signal)">A: 60 · B: 0</text></g>
<path d="M 154 268 V 286 M 148 278 L 154 286 L 160 278" fill="none" stroke="var(--color-paper)" stroke-width="2" />
<g><rect x="24" y="294" width="260" height="72" fill="var(--color-surface)" stroke="var(--color-muted)" stroke-width="2" /><text x="40" y="322" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="600" fill="var(--color-paper)">Check on B</text><text x="40" y="350" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400" fill="var(--color-paper)">Before minting</text></g>
<g><rect x="316" y="294" width="140" height="104" fill="var(--color-surface)" stroke="var(--color-muted)" stroke-width="2" /><text x="332" y="322" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="600" fill="var(--color-accent)">Reject</text><text x="332" y="350" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400" fill="var(--color-accent)">B: 0</text><text x="332" y="378" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400" fill="var(--color-accent)">Retry later</text></g>
<path d="M 284 330 H 308 M 300 324 L 308 330 L 300 336" fill="none" stroke="var(--color-paper)" stroke-width="2" />
<path d="M 154 368 V 390 M 148 382 L 154 390 L 160 382" fill="none" stroke="var(--color-paper)" stroke-width="2" />
<text x="24" y="427" font-family="Arial, Helvetica, sans-serif" font-size="23" font-weight="600" fill="var(--color-paper)">If accepted: mint on B</text>
<text x="24" y="460" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="600" fill="var(--color-signal)">A: 60 · B: 40</text>
</svg>
<figcaption>Hypothetical fee-free transfer, policies enabled on both chains. Source rejection cancels departure. Destination rejection leaves execution outstanding after 40 units have already burned on A. Retrying requires resolving the rejection condition. <a href="https://docs.chain.link/ccip/evm/tutorials/cross-chain-tokens/enforce-ace-policies-foundry">Source: ACE tutorial.</a></figcaption>
</figure>

This asymmetry matters more than a “compliant” label. A source rejection reverts the source transaction. A destination rejection may happen after the burn on A has already occurred. The official tutorial demonstrates a destination-policy failure followed by manual execution after the policy is updated, not an automatic source-chain refund. **As checked on 28 September, the tutorial also says that access to ACE still requires its beta programme.** [S12](https://docs.chain.link/ccip/evm/tutorials/cross-chain-tokens/enforce-ace-policies-foundry)

Software can apply a rule to the information available to it. That does not independently establish legal ownership, authenticate every identity document or make a financial claim enforceable. Automated checks still depend on qualification work, reliable data and accountable administrators.

Administration remains a source of discretion. The documentation allows a pool owner to replace or detach its hook contract. A policy’s durability therefore depends on governance as well as code. [S11](https://docs.chain.link/ccip/concepts/cross-chain-token/advanced-pool-hooks)

## Earlier execution and source-chain risk

A transaction’s appearance in a block does not necessarily give it **finality**, the assurance that the chain will not revise that history. A *reorganisation* can replace recent blocks and remove a transaction that appeared to have happened.

**Faster-Than-Finality**, or **FTF**, allows destination execution before the source chain reaches full finality. **It brings forward use of the result; it does not accelerate the blockchain’s consensus.** Waiting for full finality remains the default. [S13](https://docs.chain.link/ccip/concepts/execution-latency/ftf)

Applications must opt in. The relevant components must permit the choice as well, including the verifiers, token pool, execution arrangement and destination receiver when one is called. Legacy pools and receivers do not gain FTF compatibility simply because a user selects a faster setting in an interface. [S15](https://docs.chain.link/ccip/concepts/execution-latency/ftf-dapps) [S14](https://docs.chain.link/ccip/concepts/execution-latency/ftf-token-issuers)

The risk follows directly from the 100-unit example. Burn 40 on A, mint 40 on B, then remove the original burn from A’s history. There can now be **100 units on A and 40 on B**. The destination entry remains even though the event supporting it has vanished. This is an explanatory scenario, not a probability estimate or a reported CCIP 2.0 incident.

<figure class="infographic" style="max-width:28rem;margin:2rem auto 2.5rem;padding-bottom:0.5rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 490" role="img" aria-labelledby="ccip2-en-3-title ccip2-en-3-desc" style="width:100%;height:auto">
<title id="ccip2-en-3-title">If source history changes</title>
<desc id="ccip2-en-3-desc">After a source burn and a destination mint, removing the source burn can leave 100 units on A and 40 on B.</desc>
<rect x="0" y="0" width="480" height="490" fill="var(--color-surface)" />
<text x="24" y="38" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="600" fill="var(--color-paper)">If source history changes</text>
<text x="24" y="72" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400" fill="var(--color-muted)">FTF scenario · before finality</text>
<text x="24" y="112" font-family="Arial, Helvetica, sans-serif" font-size="23" font-weight="600" fill="var(--color-paper)">Start: 100 on A</text>
<rect x="24" y="130" width="308.57142857142856" height="28" fill="var(--color-signal)" />
<text x="24" y="230" font-family="Arial, Helvetica, sans-serif" font-size="23" font-weight="600" fill="var(--color-paper)">Delivered: 60 on A + 40 on B</text>
<rect x="24" y="248" width="185.14285714285714" height="28" fill="var(--color-signal)" />
<rect x="209.14285714285714" y="248" width="123.42857142857143" height="28" fill="var(--color-accent)" />
<text x="24" y="348" font-family="Arial, Helvetica, sans-serif" font-size="23" font-weight="600" fill="var(--color-paper)">Reorganisation: 100 + 40</text>
<rect x="24" y="366" width="308.57142857142856" height="28" fill="var(--color-signal)" />
<rect x="332.57142857142856" y="366" width="123.42857142857143" height="28" fill="var(--color-accent)" />
<text x="24" y="430" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400" fill="var(--color-muted)">A: turquoise · B: pink</text>
<text x="24" y="465" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400" fill="var(--color-muted)">Illustrated risk, not an observed incident.</text>
</svg>
<figcaption>Conditional l0g scenario: B mints 40 units before finality, then a reorganisation removes the burn from A’s history. No fees or other movements. All bars share the same scale. The diagram does not estimate the risk’s frequency. <a href="https://docs.chain.link/ccip/concepts/execution-latency/ftf">Source: FTF risk.</a></figcaption>
</figure>

The Committee Verifier can quarantine affected messages after detecting a reorganisation, withholding new attestations until source finality. **That does not automatically claw back tokens already minted on the receiving chain.** It narrows a risk window rather than reversing an already completed destination operation. [S13](https://docs.chain.link/ccip/concepts/execution-latency/ftf)

Issuers can set separate limits for early transfers. These limits specify a bucket capacity and refill rate. Issuers can also charge differentiated fees to fund their own corrective mechanisms. Responsibility for any resulting loss still needs to be established. [S14](https://docs.chain.link/ccip/concepts/execution-latency/ftf-token-issuers)

The launch article also discusses Ethereum’s **Fast Confirmation Rule**, or **FCR**, promising support **when it launches**. This is not evidence of a currently available, universal guarantee of settlement within seconds. Nor should every form of fast confirmation be equated with simply waiting for fewer blocks. [S01](https://chain.link/blog/introducing-ccip-2-0)

For an issuer, this becomes an operational decision: how much time is saved, against what exposure, subject to which limits and recovery procedures? A small treasury rebalance and the movement of a large financial guarantee need not justify the same settings.

## Crypto and conventional finance meet at different stages of adoption

On the crypto side, **Aave Labs’ 13 July 2026 publication** describes CCIP use for GHO, Savings GHO and cross-network governance execution. It also sets out CCIP’s role in the Aave app’s cross-chain logic, including vault rebalancing. These are documented uses **before version 2.0**, whose announcement does not establish activation of the new options. [S16](https://aave.com/blog/chainlink-ccip-secures-aave)

The economic purpose is clear: cash can sit on one chain while demand for borrowing is elsewhere. Transfers adjust that distribution. Any benefit still depends on available yields, fees and the risks of the destination market, none of which CCIP removes.

On the institutional side, the **e-HKD Phase 2 interim report**, carrying a 2025 copyright and published by the Visa, ANZ, Fidelity International and ChinaAMC consortium, examines tokenised money and fund subscriptions. Printed pages 8–9 describe the limited experimental scope and the next stage; near-real-time, round-the-clock settlement was not directly tested. The report documents a business problem and an experiment, not measured commercial savings. [S17](https://www.visa.com.sg/content/dam/VCOM/regional/ap/singapore/global-elements/documents/interim-report-e-hkd-pilot-programme-phase-2.pdf)

Product boundaries matter here. **CCIP** carries cross-chain communications. Chainlink’s **data services** supply information such as prices and valuations; **CRE, the Chainlink Runtime Environment,** orchestrates workflows between systems. **DTCC’s 12 May 2026 Collateral AppChain announcement** specifically names CRE and the data standard. That announcement cannot establish how much DTCC activity uses CCIP 2.0. [S18](https://www.dtcc.com/press-releases/2026/dtcc-collaborates-with-chainlink-to-advance-24-7-collateral-management)

A tokenised fund unit may therefore move while its conventional market is closed, without being redeemable at that moment or having a valuation acceptable to a lender. Messaging, available settlement money and redemption arrangements are connected but separate problems.

## Asset valuations, transfers and LINK revenue

Chainlink reports **$4.90 billion in CCIP transfers in the second quarter of 2026**, in a review published on **24 July**. This is a provider-reported figure, not one we independently reconstructed from every transaction. April–June activity predates 2.0, so crediting the new release with that volume would be anachronistic. [S19](https://chain.link/blog/quarterly-review-q2-2026)

Another metric displayed on 28 September is **$84.16 billion in “Total cross-chain token value”**. Chainlink defines this as the **fully diluted value of Cross-Chain Tokens (CCTs), tokens integrated with CCIP’s transfer standard**. It is neither money deposited with Chainlink nor the value transferred during a reporting period. It is also different from the value secured by Chainlink oracles across the broader platform. [S20](https://chain.link/whitepaper)

Service economics operate at a third level. As checked on 28 September, the schedule lists a **$0.45 protocol fee when paid in LINK**, or **$0.50 when paid in another fee token**, for token transfers from Ethereum to a chain other than Ethereum or Solana. Those are dollar amounts, not 0.45 LINK. The full quote can also include destination execution, verifier and pool fees. Rates depend on the route and can change. [S21](https://docs.chain.link/ccip/concepts/fees-and-billing)

This is why a large supported asset base does not mechanically produce high revenue. A substantial but inactive holding creates few transfers. A smaller treasury that rebalances frequently may create many. Message count, configuration, pricing and turnover all matter alongside the value transferred.

**Where does LINK fit?** The token helps pay for network services. Not every user needs to acquire LINK directly: Chainlink describes payment-abstraction infrastructure that can convert alternative forms of payment into LINK. [S22](https://chain.link/article/what-is-link-token) [S24](https://chain.link/economics)

The **Chainlink Reserve, announced on 7 August 2025**, uses this conversion of revenue from onchain services and enterprise business. That establishes a possible economic transmission from usage to LINK demand. The mechanism is platform-wide, not specific to CCIP 2.0. It provides neither revenue per billion dollars transferred nor a promised dividend for every token holder. [S23](https://chain.link/blog/chainlink-reserve-strategic-link-reserve)

Assessing the relationship requires separating actual fees, their allocation to different service providers, the share converted and the resulting token flows. Supported valuations and partner logos cannot supply that calculation.

## One infrastructure among competing architectures

Configurable verification is not exclusive to Chainlink. **LayerZero V2** documents required and optional verifier networks. **Circle’s CCTP** supports USDC burn-and-mint transfers with standard and fast modes. Its non-USDC extension covers EURC and wrapping of registered third-party assets, with different handling for each category. The architectures and guarantees are not interchangeable. [S25](https://docs.layerzero.network/v2/concepts/modular-security/security-stack-dvns) [S26](https://developers.circle.com/cctp)

Competition can also mean combination. CCIP documents a **CCTPVerifier** integrating Circle attestations for USDC. An issuer may want the distribution offered by one infrastructure while retaining the asset-specific validation of another. [S09](https://docs.chain.link/ccip/concepts/ccvs/verification-models)

Nor is a permanently fragmented, many-chain financial system inevitable. The BIS’s **unified-ledger** work explores another way to reduce separation between money and assets. Demand for cross-chain infrastructure depends on the architecture institutions actually adopt. [S27](https://www.bis.org/media-releases/20250624-next-generation-monetary-and-financial-system-takes-shape-based-tokenised-unified-ledger-bis)

The specific value of 2.0 is a more manageable proposition: **making cross-chain activity compatible with a wider range of issuer constraints, without requiring every institution to rebuild the transport layer**. That can make conventional assets easier to integrate into crypto applications while giving institutions crypto-developed infrastructure for their own workflows.

The financial risks remain. In its **22 October 2024** report, the Financial Stability Board identified liquidity, leverage, interconnectedness and operational risks as channels through which tokenisation could transmit stress. Its assessment of adoption in 2024 is not a description of the market in 2026; the mechanisms still provide a useful framework for examining a transaction. [S28](https://www.fsb.org/2024/10/the-financial-stability-implications-of-tokenisation/)

The decisive test is therefore not the number of announced networks. It is whether complete operations work: controls actually enabled, recovery after rejection, performance under stress, available settlement money and responsibility for mismatched records. Capabilities must be checked **for the specific route and token**, not inferred from a general launch statement. [S29](https://docs.chain.link/ccip/directory/mainnet)

CCIP 2.0 addresses a real difficulty: an asset is useful only where its holder can put it to work. The upgrade offers more control over the passage between those places. Deep markets, enforceable investor rights and profitable infrastructure remain outcomes to demonstrate, not automatic consequences of a successful transfer.


## Further reading

Read our analyses of [Ethereum as financial infrastructure](/en/analysis/ethereum-tradfi-infrastructure/), [rights and credit behind tokenised stocks](/en/analysis/tokenized-stocks-xstocks-vaults-credit-yield/) and [Pontes, the ECB’s tokenised settlement project](/en/analysis/pontes-ecb-private-blockchain-tokenised-settlement/).

## Sources and documents

- **S01 · Chainlink** : [Chainlink Introduces CCIP 2.0](https://chain.link/blog/introducing-ccip-2-0) (2026-09-28).
- **S02 · Chainlink Documentation** : [CCIP documentation and changelog](https://docs.chain.link/ccip) (2026-09-28).
- **S03 · Chainlink** : [CCIP v1.6 Is Now Live](https://chain.link/blog/ccip-v1-6-is-now-live) (2025-05-19).
- **S04 · SIFMA** : [10 Key Findings from SIFMA’s 2026 Capital Markets Fact Book](https://www.sifma.org/news/blog/2026-capital-markets-fact-book-key-findings) (2026-08-19).
- **S05 · Swift** : [Successful blockchain experiments unlock potential of tokenisation](https://www.swift.com/de/node/309230) (2023-08-31).
- **S06 · Chainlink Documentation** : [Cross-Chain Token standard: overview](https://docs.chain.link/ccip/concepts/cross-chain-token/overview).
- **S07 · Chainlink Documentation** : [CCIP Architecture Overview](https://docs.chain.link/ccip/concepts/architecture/overview).
- **S08 · Chainlink Documentation** : [CCIP Message Lifecycle](https://docs.chain.link/ccip/concepts/message-lifecycle).
- **S09 · Chainlink Documentation** : [Verification Models](https://docs.chain.link/ccip/concepts/ccvs/verification-models).
- **S10 · Chainlink Documentation** : [Trust & Responsibility Model](https://docs.chain.link/ccip/concepts/ccvs/trust-responsibility-model).
- **S11 · Chainlink Documentation** : [Advanced Pool Hooks](https://docs.chain.link/ccip/concepts/cross-chain-token/advanced-pool-hooks).
- **S12 · Chainlink Documentation** : [Enforce ACE policies on CCIP token transfers using Foundry](https://docs.chain.link/ccip/evm/tutorials/cross-chain-tokens/enforce-ace-policies-foundry).
- **S13 · Chainlink Documentation** : [Understanding Faster-Than-Finality Transfers in CCIP 2.0](https://docs.chain.link/ccip/concepts/execution-latency/ftf).
- **S14 · Chainlink Documentation** : [Faster-Than-Finality: Token Issuers](https://docs.chain.link/ccip/concepts/execution-latency/ftf-token-issuers).
- **S15 · Chainlink Documentation** : [Faster-Than-Finality: dApps](https://docs.chain.link/ccip/concepts/execution-latency/ftf-dapps).
- **S16 · Aave Labs** : [Why Chainlink CCIP Secures Aave Protocol and the Aave App](https://aave.com/blog/chainlink-ccip-secures-aave) (2026-07-13).
- **S17 · Visa / ANZ / Fidelity International / ChinaAMC** : [Transforming Global Payments: The Role of Tokenized Money & Funds in Cross-Border Transactions](https://www.visa.com.sg/content/dam/VCOM/regional/ap/singapore/global-elements/documents/interim-report-e-hkd-pilot-programme-phase-2.pdf).
- **S18 · DTCC** : [DTCC Collaborates with Chainlink to Advance 24/7 Collateral Management](https://www.dtcc.com/press-releases/2026/dtcc-collaborates-with-chainlink-to-advance-24-7-collateral-management) (2026-05-12).
- **S19 · Chainlink** : [Chainlink Quarterly Review: Q2, 2026](https://chain.link/blog/quarterly-review-q2-2026) (2026-07-24).
- **S20 · Chainlink** : [Current platform metrics and metric definitions](https://chain.link/whitepaper).
- **S21 · Chainlink Documentation** : [Fees & Billing](https://docs.chain.link/ccip/concepts/fees-and-billing).
- **S22 · Chainlink** : [What is the LINK Token?](https://chain.link/article/what-is-link-token).
- **S23 · Chainlink** : [Introducing the Chainlink Reserve: Creating a Strategic LINK Token Reserve](https://chain.link/blog/chainlink-reserve-strategic-link-reserve) (2025-08-07).
- **S24 · Chainlink** : [Chainlink Economics](https://chain.link/economics).
- **S25 · LayerZero Documentation** : [Security Stack: Decentralized Verifier Networks](https://docs.layerzero.network/v2/concepts/modular-security/security-stack-dvns).
- **S26 · Circle Documentation** : [Cross-Chain Transfer Protocol](https://developers.circle.com/cctp).
- **S27 · Bank for International Settlements** : [Next-generation monetary and financial system takes shape, based on a tokenised unified ledger](https://www.bis.org/media-releases/20250624-next-generation-monetary-and-financial-system-takes-shape-based-tokenised-unified-ledger-bis) (2025-06-24).
- **S28 · Financial Stability Board** : [The Financial Stability Implications of Tokenisation](https://www.fsb.org/2024/10/the-financial-stability-implications-of-tokenisation/) (2024-10-22).
- **S29 · Chainlink Documentation** : [CCIP Directory: Mainnet](https://docs.chain.link/ccip/directory/mainnet).

## Method and limitations

Sources checked on 28 September 2026. Chainlink documents describe the provider’s capabilities and reported metrics; counterparties describe their own uses or projects. We have not independently audited deployments, revenue, operators or the complete transfer history. The fund-unit example and all three diagrams are hypothetical, with stated assumptions. Swift, Visa and DTCC projects have distinct scopes and timelines. Available options depend on the route, contracts and configuration. The cited figures imply no LINK price target or expected return.
