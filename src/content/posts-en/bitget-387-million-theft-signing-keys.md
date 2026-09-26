---
title: "Bitget: $387.5 million stolen and the signing blind spot"
seoTitle: "Bitget hack: $387.5 million and the signing blind spot | l0g"
description: "Private keys, the protection fund, XRP freeze limits and the withdrawal schedule: understanding Bitget’s theft and its promised safeguards."
pubDate: "2026-09-26T18:13:02+02:00"
tags: ["Bitget", "cryptocurrency", "cybersecurity", "custody", "risk"]
draft: false
ogImage: "/illustrations/news/bitget-cles-signature-v1.jpg"
sourceArticle: "bitget-vol-387-millions-cles-signature"
sourceUpdatedDate: "2026-09-26T18:13:02+02:00"
---

The balance on the screen can stay unchanged while withdrawals stop. That is the situation Bitget describes following its **September 24, 2026 attack**. The exchange now estimates that **$387.5 million in assets was transferred to attacker-controlled addresses**, up from its initial $351.6 million figure. It attributes the revision to Zcash and TRON transfers omitted from the first count. Both estimates concern the same attack; the eventual net loss will also depend on recoveries. [Initial notice](https://www.bitget.com/support/articles/12560603896024), [revised estimate](https://www.bitget.com/support/articles/12560603896108).

Chief executive Gracy Chen’s account raises a question that goes beyond the size of the theft. Attackers allegedly compromised a backend system, falsified transaction data and triggered Bitget’s authorization process. **Chen says the private keys were not compromised.** CoinDesk reports this preliminary company assessment. How can assets leave if the secret used to move them remains protected? [Chen’s account, reported September 25](https://www.coindesk.com/markets/2026/09/25/bitget-s-usd351-million-hack-happened-via-spoofed-transfers-not-private-keys-ceo-gray-chen-says).

On September 26, Bitget announced a phased withdrawal restart running from September 28 to October 2. Those dates are still in the future at the time of publication. [Announced schedule](https://www.bitget.com/support/articles/12560603896110).

## The key signs the instruction it receives

A **private key** can produce a cryptographic signature. Among its functions, a signature allows verification of the origin and integrity of data, as the [US National Institute of Standards and Technology](https://csrc.nist.gov/glossary/term/digital_signature) explains. An Ethereum transaction includes a destination, a value and a signature; the network applies its validation rules. Checking whether the payment complies with a company’s business procedures requires additional controls. [Ethereum documentation](https://ethereum.org/developers/docs/transactions).

Consider a hypothetical company that keeps its key inside a dedicated signing device. Separate software prepares payments and submits them for approval. If a falsified request passes the controls and reaches the device, it can receive a valid signature while the key remains secret. The signature then protects data that was already false when it entered the process.

<figure class="infographic" style="max-width:33rem;margin:2rem auto;padding-bottom:1rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 342" role="img" aria-labelledby="bitget-en-signature-title bitget-en-signature-desc" style="width:100%;height:auto" font-family="Arial, Helvetica, sans-serif">
<title id="bitget-en-signature-title">A false request, validly signed</title>
<desc id="bitget-en-signature-desc">Hypothetical example: a falsified request passes an internal control and reaches a device whose key stays secret. The resulting signed transaction can execute if it meets network rules. Arrows trace this process; this is not a reconstruction of the Bitget attack.</desc>
<rect x="0" y="0" width="500" height="342" rx="6" fill="var(--color-surface)"/>
<text x="24" y="34" font-size="24" font-weight="700" text-anchor="start" fill="var(--color-paper)">A false request, validly signed</text>
<text x="24" y="65" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-muted)">Hypothetical compromised workflow</text>
<path d="M208 135H292 M285 130L292 135L285 140" fill="none" stroke="var(--color-accent)" stroke-width="2"/>
<path d="M388 184V226 M383 219L388 226L393 219" fill="none" stroke="var(--color-accent)" stroke-width="2"/>
<path d="M292 277H208 M215 272L208 277L215 282" fill="none" stroke="var(--color-signal)" stroke-width="2"/>
<g>
<rect x="24" y="90" width="176" height="90" rx="6" fill="var(--color-surface)" stroke="var(--color-line-strong)"/>
<text x="112.0" y="129.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-accent)">Falsified</text>
<text x="112.0" y="157.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-accent)">request</text>
</g>
<g>
<rect x="300" y="90" width="176" height="90" rx="6" fill="var(--color-surface)" stroke="var(--color-line-strong)"/>
<text x="388.0" y="129.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-accent)">Control</text>
<text x="388.0" y="157.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-accent)">deceived</text>
</g>
<g>
<rect x="300" y="232" width="176" height="90" rx="6" fill="var(--color-surface)" stroke="var(--color-line-strong)"/>
<text x="388.0" y="271.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-signal)">Secret key</text>
<text x="388.0" y="299.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-signal)">Signature</text>
</g>
<g>
<rect x="24" y="232" width="176" height="90" rx="6" fill="var(--color-surface)" stroke="var(--color-line-strong)"/>
<text x="112.0" y="271.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-paper)">Network</text>
<text x="112.0" y="299.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-paper)">Execution</text>
</g>
</svg>
<figcaption>Conceptual mechanism, without measurements or a reconstruction of the intrusion. The key stays inside the device; a failed control admits the request. Execution requires compliance with network rules. Sources: <a href="https://csrc.nist.gov/glossary/term/digital_signature">NIST</a>, <a href="https://ethereum.org/developers/docs/transactions">Ethereum</a>. Accessed September 26, 2026.</figcaption>
</figure>

This makes the information presented to approving systems and people critical. Multiple approvals can share the same blind spot if they all rely on the same falsified instruction. This is a general mechanism: public documents do not describe Bitget’s architecture in enough detail to reconstruct the intrusion.

In its September 25 update, Bitget says it has fixed the vulnerability and is working with Mandiant and SlowMist. It is withholding some details during the investigation. We found no independent technical report in the material reviewed that confirms its full account. [Incident update](https://www.bitget.com/support/articles/12560603896108).

## A timeline that needs explaining

Public transactions add another part of the record. In its analysis updated September 26, **Bitquery places the last transfer it classifies as stolen at 21:23 UTC** on September 24. Bitget had reported detecting the incident at **18:31 UTC**. The gap raises a question about the containment timeline. [Bitquery’s records and methodology](https://bitquery.io/investigations/bitget-hack), [Bitget’s stated detection time](https://www.bitget.com/support/articles/12560603896024).

The timestamps have different origins. Bitquery’s endpoint relies on transactions and its address labels; the detection time comes from the company. Without internal logs, the available record cannot establish which systems had been isolated at each stage or why later transfers went through. A signature recorded on the chain also leaves open whether a copied key or an abused signing service produced it.

## An account balance still depends on custody

The incident concerns Bitget’s centralized exchange. **Bitget Wallet**, the separate self-custody product using the same brand, operates on different infrastructure and was unaffected, according to the spokesperson who spoke to The Block. The distinction concerns two different services. [Bitget’s response to The Block](https://www.theblock.co/news/markets/2026-09-24-more-than-170-million-in-crypto-moves-from-bitget-wallets-unidentified-address-416345).

With third-party custody, the provider controls access to the keys needed to move assets. With **self-custody**, the user manages that access and takes responsibility for lost or stolen secrets. The [SEC’s December 12, 2025 investor bulletin](https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/crypto-asset-custody-basics-retail-investors-investor-bulletin-0) explains this allocation of responsibilities.

Imagine customers trading with each other on a platform that maintains an internal ledger. The operator can update their balances without sending assets to an external wallet for every trade. A customer can therefore change price exposure while remaining dependent on the custodian. Buying a [stablecoin](/en/glossary/stablecoin/) within the application leaves that dependency in place until an actual withdrawal.

Suspension may serve a legitimate security purpose: replenishing a vulnerable payment system could expose more funds. Chen told Reuters that withdrawals had stopped as a security precaution rather than because of an asset shortfall. That is Bitget’s explanation; the available sources do not establish an independent assessment of its solvency. [Reuters, September 25, republished by The Star](https://www.thestar.com.my/tech/tech-news/2026/09/26/crypto-exchange-bitget-pauses-withdrawals-after-350-million-stolen-in-hack).

**French residents were already subject to a separate arrangement before the attack.** Bitget’s March 13, 2026 notice set out the closure of positions and transfer of remaining assets to a licensed provider, with transfers beginning April 8. The global restart schedule published after the theft should therefore not be presented as automatically applicable to those former accounts. This article does not establish their individual status. [Notice for French users](https://www.bitget.com/support/articles/12560603873710).

## What the protection fund promises

In its September 24 notice, Bitget put its **protection fund above $464 million** and said it covered the loss. The fund’s public page describes a bitcoin reserve and claims assessed by the company for platform-wide incidents. It is Bitget’s own protection mechanism, whose conditions and actual deployment matter. [Dated statement](https://www.bitget.com/support/articles/12560603896024), [fund rules](https://www.bitget.com/promotion/protection-fund).

Sufficient, available resources could replace the stolen assets without reducing customer balances. Assessing that capacity requires matching usable quantities and valuations against obligations. A bitcoin reserve’s dollar value changes, while the stolen asset mix may be different. Simply subtracting the theft from the advertised fund value would produce a misleadingly precise estimate of the remaining cushion.

Bitget also publishes **proof of reserves**. Its described process combines asset snapshots with a **Merkle tree**, a cryptographic structure that lets a customer check whether a balance is included in a declared set. [Bitget’s explanation](https://www.bitget.com/promotion/proof-of-reserves).

On **March 8, 2023**, the investor advocate’s office at the PCAOB, the US audit oversight body, explained the limitations of such reports. Procedures may leave liabilities, customers’ rights and the effectiveness of internal controls outside their scope. The advisory addresses this category of reports; it makes no finding about Bitget. [PCAOB office advisory](https://pcaobus.org/news-events/news-releases/news-release-detail/investor-advisory-exercise-caution-with-third-party-verification-proof-of-reserve-reports).

An accurate inventory can precede a theft. Assessing protection therefore means examining available assets, what the company owes its customers and how its systems authorize payments.

## Freezing a token takes a specific power

Recovery involves several actors. On September 25, CoinDesk reported that Circle and Tether had blocked USDC and USDT held at an address linked to the attack. That intervention applies to their tokens. [Reported interventions](https://www.coindesk.com/markets/2026/09/25/circle-and-tether-step-in-to-freeze-hacker-wallet-after-massive-bitget-crypto-heist).

Circle expressly describes its ability to block USDC transfers to and from certain addresses in section 13 of its terms for holders outside the European Economic Area. This documents a power over the token; European holders’ rights are addressed in separate documents. [Circle’s terms](https://www.circle.com/legal/usdc-terms).

**XRP illustrates the distinction.** In a September 26 follow-up, CoinDesk reported further movements of stolen XRP. The protocol distinguishes tokens issued on the XRP Ledger from its native asset, XRP: the token-freezing function does not apply to XRP itself. Ripple therefore lacks that same power over XRP held directly at attacker-controlled addresses. A custodial exchange can, however, restrict an account holding funds in its custody. [September 26 update](https://www.coindesk.com/markets/2026/09/26/bitget-hacker-moves-usd83-million-in-stolen-xrp-that-ripple-cannot-freeze), [XRP Ledger documentation](https://xrpl.org/docs/concepts/tokens/fungible-tokens/freezes).

<figure class="infographic" style="max-width:33rem;margin:2rem auto;padding-bottom:1rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 342" role="img" aria-labelledby="bitget-en-freeze-title bitget-en-freeze-desc" style="width:100%;height:auto" font-family="Arial, Helvetica, sans-serif">
<title id="bitget-en-freeze-title">Who can freeze which asset?</title>
<desc id="bitget-en-freeze-desc">Circle can block USDC transfers involving an address. The cross between Ripple and XRP indicates that the native XRP asset has no such freeze function. A custodial exchange can separately restrict its own accounts.</desc>
<rect x="0" y="0" width="500" height="342" rx="6" fill="var(--color-surface)"/>
<text x="24" y="34" font-size="24" font-weight="700" text-anchor="start" fill="var(--color-paper)">Who can freeze which asset?</text>
<text x="24" y="66" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-muted)">Control over the token</text>
<path d="M208 128H292 M285 123L292 128L285 133" fill="none" stroke="var(--color-accent)" stroke-width="2"/>
<g>
<rect x="24" y="100" width="176" height="56" rx="6" fill="var(--color-surface)" stroke="var(--color-line-strong)"/>
<text x="112.0" y="136.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-accent)">Circle</text>
</g>
<g>
<rect x="300" y="100" width="176" height="56" rx="6" fill="var(--color-surface)" stroke="var(--color-line-strong)"/>
<text x="388.0" y="136.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-paper)">USDC</text>
</g>
<text x="24" y="189" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-muted)">Targeted transfers can be blocked</text>
<path d="M208 248H236 M264 248H292" fill="none" stroke="var(--color-muted)" stroke-width="2"/>
<path d="M243 241L257 255 M243 255L257 241" fill="none" stroke="var(--color-accent)" stroke-width="2"/>
<g>
<rect x="24" y="220" width="176" height="56" rx="6" fill="var(--color-surface)" stroke="var(--color-line-strong)"/>
<text x="112.0" y="256.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-paper)">Ripple</text>
</g>
<g>
<rect x="300" y="220" width="176" height="56" rx="6" fill="var(--color-surface)" stroke="var(--color-line-strong)"/>
<text x="388.0" y="256.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-signal)">XRP</text>
</g>
<text x="24" y="313" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-muted)">XRP has no native freeze function</text>
</svg>
<figcaption>Functional comparison as of September 26, 2026, without amounts. Token blocking and exchange account restrictions have different scopes. An exchange can restrict funds in its custody, including XRP. Sources: <a href="https://www.circle.com/legal/usdc-terms">Circle, USDC Terms, §13</a>, <a href="https://xrpl.org/docs/concepts/tokens/fungible-tokens/freezes">XRP Ledger, Freezing Tokens</a>.</figcaption>
</figure>

That distinction helps explain the rapid conversions observed by Elliptic: moving from certain administrable tokens into a native asset can remove the original issuer’s ability to intervene in the new asset. Investigations and seizures can still proceed through other means. [Elliptic’s analysis](https://www.elliptic.co/insights/bitget-attack-pushes-suspected-north-korea-crypto-heists-over-1-billion-in-2026/).

Tracing funds, stopping their movement and returning them are separate stages. A freeze can preserve the possibility of recovery; an actual return still requires the relevant operations and decisions. Adding together amounts tracked, frozen and recovered could count the same money more than once. Our analysis of the [USDT seizure sought by US prosecutors over alleged Iranian oil proceeds](/en/analysis/iranian-oil-usdt-tether-seizure/) explores the relationship between technical control and judicial process.

## The North Korea assessment

Elliptic considers a North Korean link highly likely. It points to connections with addresses involved in thefts previously attributed to those actors, including Bybit, and similarities in how the funds moved. Its assessment also incorporates technical indicators reported by Bitget. [Assessment published September 25](https://www.elliptic.co/insights/bitget-attack-pushes-suspected-north-korea-crypto-heists-over-1-billion-in-2026/).

This remains the analytics firm’s attribution. Searches conducted through September 26 found no public FBI or US Justice Department attribution specific to this incident. Identifying the attackers and examining responsibility for payment controls each require their own evidence.

## The next milestone is a completed withdrawal

Bitget announced the following stages, **all at 08:00 UTC, or 10:00 in Paris** on the dates shown. This is the schedule published September 26 and may change. The specified networks matter as much as the asset symbol. [Official schedule](https://www.bitget.com/support/articles/12560603896110).

| Announced date | Assets or services | Listed networks |
| --- | --- | --- |
| September 28, 2026 | BTC | Bitcoin |
| September 29, 2026 | ETH | Ethereum, BSC, Arbitrum, Base, Optimism |
| September 30, 2026 | USDT | Ethereum, BSC, Solana, Tron |
| October 2, 2026 | Other tokens, fiat currencies and peer-to-peer (P2P) trading | Not detailed in the announcement’s table |

What comes next will be measured through completed withdrawals, deployment of the promised resources and findings from the technical investigation. Self-custody places responsibility for keys and backups on the user and calls for its own precautions. [SEC custody bulletin](https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/crypto-asset-custody-basics-retail-investors-investor-bulletin-0).

The Bitget case brings the control points into focus: protect the secret, verify the instruction before signing, and make assets accessible to the customer. A key can remain locked away after the power to pay has changed hands.

## Sources

- Bitget, 2026-09-24. [[SECURITY NOTICE] Bitget exchange hot wallets Incident : September 24, 2026](https://www.bitget.com/support/articles/12560603896024).
- Bitget, 2026-09-25. [Bitget Security Latest Incident Update: Fund Tracing and Recovery Bounty Program](https://www.bitget.com/support/articles/12560603896108).
- Bitget, 2026-09-26. [Bitget to Resume Withdrawals in Phases](https://www.bitget.com/support/articles/12560603896110).
- CoinDesk, 2026-09-25. [Bitget's $352 million hack happened via spoofed transfers, not private keys, CEO Gracy Chen says](https://www.coindesk.com/markets/2026/09/25/bitget-s-usd351-million-hack-happened-via-spoofed-transfers-not-private-keys-ceo-gray-chen-says).
- ethereum.org, accessed September 26, 2026. [Transactions](https://ethereum.org/developers/docs/transactions).
- NIST CSRC, accessed September 26, 2026. [Digital signature : Glossary](https://csrc.nist.gov/glossary/term/digital_signature).
- Bitquery, 2026-09-26. [Bitget hack: how $352M left, and where it is now](https://bitquery.io/investigations/bitget-hack).
- The Block, 2026-09-25. [Bitget confirms $387.5 million security breach affecting exchange hot wallets](https://www.theblock.co/news/markets/2026-09-24-more-than-170-million-in-crypto-moves-from-bitget-wallets-unidentified-address-416345).
- SEC, Office of Investor Education and Assistance, 2025-12-12. [Crypto Asset Custody Basics for Retail Investors : Investor Bulletin](https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/crypto-asset-custody-basics-retail-investors-investor-bulletin-0).
- Reuters, repris par The Star, 2026-09-25. [Crypto exchange Bitget pauses withdrawals after $350 million stolen in hack](https://www.thestar.com.my/tech/tech-news/2026/09/26/crypto-exchange-bitget-pauses-withdrawals-after-350-million-stolen-in-hack).
- Bitget, accessed September 26, 2026. [Bitget Protection Fund](https://www.bitget.com/promotion/protection-fund).
- Bitget, accessed September 26, 2026. [Proof of Reserves](https://www.bitget.com/promotion/proof-of-reserves).
- PCAOB, Office of the Investor Advocate, 2023-03-08. [Exercise Caution With Third-Party Verification/Proof of Reserve Reports](https://pcaobus.org/news-events/news-releases/news-release-detail/investor-advisory-exercise-caution-with-third-party-verification-proof-of-reserve-reports).
- Circle, 2025-12-12. [USDC Terms](https://www.circle.com/legal/usdc-terms).
- CoinDesk, 2026-09-25. [Circle and Tether step in to freeze hacker wallet after massive Bitget crypto heist](https://www.coindesk.com/markets/2026/09/25/circle-and-tether-step-in-to-freeze-hacker-wallet-after-massive-bitget-crypto-heist).
- Elliptic, 2026-09-25. [Bitget attack pushes suspected North Korea crypto heists over $1 billion in 2026](https://www.elliptic.co/insights/bitget-attack-pushes-suspected-north-korea-crypto-heists-over-1-billion-in-2026/).
- CoinDesk, 2026-09-26. [Bitget hacker moves $83 million in stolen XRP that Ripple cannot freeze](https://www.coindesk.com/markets/2026/09/26/bitget-hacker-moves-usd83-million-in-stolen-xrp-that-ripple-cannot-freeze).
- XRP Ledger, accessed September 26, 2026. [Freezing Tokens](https://xrpl.org/docs/concepts/tokens/fungible-tokens/freezes).
- Bitget, 2026-03-13. [Update Announcement for French Users](https://www.bitget.com/support/articles/12560603873710).

## Method and limitations

Research current to September 26, 2026. The $387.5 million estimate, promised coverage and reported absence of private-key compromise originate with Bitget. Bitquery’s and Elliptic’s findings are attributed to their authors; l0g has not reproduced their full tracing work. The withdrawal schedule is prospective.

The diagrams explain general mechanisms and do not describe Bitget’s architecture. l0g had no access to internal logs, performed no complete reserve audit and conducted no interviews. Chen’s statement was checked against CoinDesk’s account; her X post was not directly accessible. General fund and token rules do not determine each customer’s contractual position.
