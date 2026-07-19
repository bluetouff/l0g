---
title: "Crypto and AI: anatomy of a convergence, between real plumbing and narrative casino"
description: "The decade's two flagship technologies are converging. Behind the buzzword, a two-faced reality: on one side a plumbing that already works (agents paying in stablecoins, decentralised compute, cryptographic verification), on the other a casino of speculative tokens that collapsed in 2025. A rigorous map, the players, the regulatory framework, and the dividing line between the real and the mirage. With academic references."
pubDate: 2026-07-14T10:34:00+02:00
updatedDate: 2026-07-14T10:34:00+02:00
tags: ["crypto", "ai", "stablecoins", "regulation", "markets", "tech"]
draft: false
sourceArticle: "crypto-et-ia-anatomie-d-une-convergence"
sourceUpdatedDate: 2026-07-11
---
*Crypto and artificial intelligence are the two narratives that have magnetised capital and attention for five years. Seeing them merge was inevitable, and the buzzword "crypto-AI" has become a magnet for funding as for scams. For the analyst, the difficulty is not to note the convergence, it is to sort it. Because under the same label coexist a plumbing that already works, software agents settling invoices in [stablecoins](/en/glossary/stablecoin/), and a casino of substance-less tokens that wiped out billions in 2025. This piece maps the intersection, vector by vector, separates what rests on a real solved problem from what is only a ticker, examines the players and the law, and poses the question that will decide everything: does traditional finance follow, and how far.*

## Two worlds that everything opposes, and that attract each other

At first sight, nothing brings the two technologies together. Artificial intelligence is centralising: it demands colossal capital, giant data centers and rare chips, favouring a handful of players and concentrating power. Crypto was born of the opposite ambition, to decentralise trust and remove intermediaries' toll-booth position. One builds black boxes; the other builds transparent, verifiable ledgers. Their meeting is therefore less about kinship than about the complementarity of two lacks.

Three needs of AI find a crypto answer. Autonomous software agents need a programmable, permissionless means of payment, which banking rails cannot offer. Generative AI creates a crisis of trust, deepfakes and synthetic content, to which cryptographic verification brings the beginning of an answer. And AI's hunger for compute seeks sources of supply alternative to the hyperscalers. In reverse, crypto, long in search of uses beyond speculation, finds in AI a real demand. It is this double gap that makes the attraction. But one must still distinguish the vectors where it produces something from those where it produces only a price.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 330" role="img" aria-label="Map of the convergence vectors between crypto and artificial intelligence by degree of maturity" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="330" fill="#0c0d10"></rect>
  <text x="32" y="34" fill="#f5f6f8" font-size="17" font-weight="700">The crypto × AI convergence map</text>
  <text x="32" y="55" fill="#8b909b" font-size="12">Five vectors, five degrees of maturity. From real to speculative.</text>
  <rect x="40" y="72" width="4" height="44" fill="#5eead4"></rect>
  <text x="58" y="88" fill="#5eead4" font-size="12.5" font-weight="700">Agent payments (stablecoins) · SOLID</text>
  <text x="58" y="106" fill="#8b909b" font-size="11.5">Agents already settle invoices in USDC. In production.</text>
  <rect x="40" y="126" width="4" height="44" fill="#7aa2f7"></rect>
  <text x="58" y="142" fill="#7aa2f7" font-size="12.5" font-weight="700">Decentralised compute (DePIN) · UNDER CONSTRUCTION</text>
  <text x="58" y="160" fill="#8b909b" font-size="11.5">Cheaper than AWS, but reliability and supply uncertain.</text>
  <rect x="40" y="180" width="4" height="44" fill="#f5b13d"></rect>
  <text x="58" y="196" fill="#f5b13d" font-size="12.5" font-weight="700">Verification (zkML, provenance) · PROMISING, EARLY</text>
  <text x="58" y="214" fill="#8b909b" font-size="11.5">Prove an AI ran correctly, without revealing the model.</text>
  <rect x="40" y="234" width="4" height="44" fill="#f5b13d"></rect>
  <text x="58" y="250" fill="#f5b13d" font-size="12.5" font-weight="700">Proof of humanity · EMERGING</text>
  <text x="58" y="268" fill="#8b909b" font-size="11.5">Tell human from bot in the deepfake era.</text>
  <rect x="40" y="288" width="4" height="34" fill="#ff4d87"></rect>
  <text x="58" y="304" fill="#ff4d87" font-size="12.5" font-weight="700">AI agent tokens · SPECULATIVE, COLLAPSED</text>
  <text x="58" y="320" fill="#8b909b" font-size="11.5">The 2025 bubble: up to -99% on flagship tokens.</text>
</svg>
<figcaption>From the most accomplished to the most speculative: agent payments work, compute and verification are being built, the AI-token bubble collapsed. <strong>One label, five very different realities.</strong> l0g reading.</figcaption>
</figure>

The most lucid framework remains the one laid down as early as 2024 by Vitalik Buterin, co-founder of Ethereum, who distinguishes four uses: AI as a player in a crypto mechanism (bots that arbitrage or feed prediction markets), AI as an interface (an assistant that protects the user from scams), AI as a rule (an AI arbitrating inside a smart contract) and crypto to build a more trustworthy AI. His warning deserves to open any serious analysis: entrusting an AI with the role of rule, for example to back a stablecoin, is the most dangerous, because an exposed model gets attacked through adversarial learning. The loudest convergence is often the most fragile.

## The most solid vector: agents that pay

The first use that left the PowerPoint slide for production is the payment of autonomous agents. An AI agent that buys data, compute or an interface call on its own needs to pay continuously, in very small amounts, without opening an account or signing a subscription. Yet card rails cannot do this: per the Keyrock report, 76% of agent payments fall below the cards' $0.30 fixed-fee threshold, most between one and ten cents. This is the concrete economic problem crypto solves: programmable, permanent, machine-to-machine micropayments, settled in stablecoins.

The infrastructure came together at a notable speed. Amazon Web Services launched Bedrock AgentCore Payments, which lets agents pay in [USDC](/en/glossary/usdc/), built on Coinbase's x402 protocol and Stripe's Privy wallets. Coinbase published an MCP connector for its Base chain, Visa and Mastercard are preparing their agentic-commerce platforms. The dominant stablecoin there is Circle's USDC, refocusing the dependence on a single issuer. This mechanism directly links AI to the money framed by the [GENIUS Act](/en/analysis/the-genius-act-stablecoins-and-the-debt/).

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 300" role="img" aria-label="AI agent payments today and their projections" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="300" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">The agents already paying</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">A measured fact, analyst projections. Not to be confused.</text>
  <line x1="40" y1="78" x2="680" y2="78" stroke="#2a2c33" stroke-width="1"></line>
  <text x="40" y="106" fill="#5eead4" font-size="12.5" font-weight="700">FACT</text>
  <text x="130" y="106" fill="#d6d9df" font-size="12">~$73M settled across 176M on-chain transactions (May 2025-Apr 2026).</text>
  <line x1="40" y1="124" x2="680" y2="124" stroke="#2a2c33" stroke-width="1"></line>
  <text x="40" y="152" fill="#5eead4" font-size="12.5" font-weight="700">FACT</text>
  <text x="130" y="152" fill="#d6d9df" font-size="12">76% of agent payments below the cards' $0.30 threshold.</text>
  <line x1="40" y1="170" x2="680" y2="170" stroke="#2a2c33" stroke-width="1"></line>
  <text x="40" y="198" fill="#f5b13d" font-size="12.5" font-weight="700">PROJECTION</text>
  <text x="130" y="198" fill="#d6d9df" font-size="12">$15 trillion intermediated by agents by 2028 (Gartner).</text>
  <line x1="40" y1="216" x2="680" y2="216" stroke="#2a2c33" stroke-width="1"></line>
  <text x="40" y="244" fill="#f5b13d" font-size="12.5" font-weight="700">PROJECTION</text>
  <text x="130" y="244" fill="#d6d9df" font-size="12">$3 to $5 trillion of agentic commerce by 2030 (McKinsey).</text>
  <line x1="40" y1="262" x2="680" y2="262" stroke="#2a2c33" stroke-width="1"></line>
  <text x="32" y="288" fill="#8b909b" font-size="11">For perspective: Visa already processes ~$14.5 trillion a year. Sources: Keyrock, Gartner, McKinsey.</text>
</svg>
<figcaption>The real volumes stay tiny, <strong>$73 million</strong>, but the use case is real where cards cannot keep up. The <strong>trillions</strong> announced are projections, not facts. Sources: Keyrock, Gartner, McKinsey.</figcaption>
</figure>

The reading guardrail is essential here. The $73 million settled by agents in one year is a fact, but a tiny fact against the $14.5 trillion Visa processes each year. Gartner's projections, $15 trillion intermediated by agents by 2028, or McKinsey's, $3 to $5 trillion of agentic commerce by 2030, are adoption bets, not observations. The use case is genuine; its future scale remains to be demonstrated.

## Decentralised compute: arbitraging a commodity

The second vector attacks the sinews of the AI war, compute. The thesis of DePIN networks is simple: Nvidia graphics cards are a commodity, the hyperscalers' margins are therefore vulnerable, and a network that pays owners of idle GPUs in tokens can rent compute far cheaper. The figures give body to the argument. Per Q1 2026 market data, io.net aggregates more than 100,000 GPUs and Akash offers H100 cards around $1.20 to $1.80 an hour, against $4.50 to $5.50 at AWS, a 60 to 70% discount. The sector, around $180 to $220 million of annualised revenue, stays modest but is growing.

The weakness is structural and comes down to the token's reflexivity. GPU providers are paid partly in the network's native token; when this token falls below their profitability threshold, they unplug, and the compute supply evaporates at the worst moment. Akash's available capacity thus contracted by more than half from one quarter to the next in early 2026. Add service guarantees inferior to the giants' and a hard technical limit: these networks excel at massively parallel tasks like rendering or inference, but remain unable to train large models, which demand the tight interconnections only integrated data centers provide. Decentralised compute nibbles a commodity through price; it does not replace the factory.

## Verifying the machine: zkML, provenance, proof of humanity

The third vector is the most intellectually promising, and the earliest. It answers the question every "black box" AI poses: how to prove a model did what it claims, without revealing either the model or the data. zkML, zero-knowledge machine learning, uses cryptographic proofs to certify an inference. An academic survey published in 2025 catalogues the work since 2017 and confirms the potential as much as the obstacles: high proof cost, limited circuit expressiveness, deployment complexity. Tools like EZKL make the thing possible on real models, but industrial scale is not there.

The authenticity side is more advanced, provided one is precise. The C2PA standard, carried since 2021 by Adobe, the BBC, Microsoft and others, affixes a cryptographic signature on content to trace its origin and edits. It is cryptographic, but not necessarily backed by a blockchain, and one must be careful not to file it automatically under the crypto label. The properly crypto part is elsewhere: in attestation on a neutral ledger and above all in proof of humanity, which aims to distinguish a real human from a bot. The stake swells with deepfakes, whose recorded number reportedly went from about 500,000 cases in 2023 to more than 8 million in 2025. Devices like World ID combine biometrics and selective disclosure to prove one is a unique human without revealing one's identity. It is the vector that best solves, in theory, the problem Vitalik judged the thorniest, that of trust in an opaque system; it is also the one whose realisations remain the most embryonic.

## Why it can work

Three fundamental reasons support the bullish thesis, once the speculative froth is set aside. First, the identified complementarities answer real problems unsolved elsewhere: paying an agent below the cost of a card transaction, buying commoditised compute cheaper, verifying an AI output without trusting its author. None of these problems has an obvious better non-crypto solution. Second, the US regulatory wind has turned: the [GENIUS Act](/en/glossary/genius/) legalised payment stablecoins, the base of agent payments, and the CLARITY Act began to clarify the status of digital assets, subjects we treated in our pieces on [the CLARITY Act](/en/analysis/the-clarity-act-us-crypto-regulation/) and the [GENIUS Act](/en/analysis/the-genius-act-stablecoins-and-the-debt/).

Finally, and this is decisive, traditional finance has begun to lay the rails, giving the convergence an adult infrastructure rather than a start-up patchwork. When an agent settles in stablecoin via an AWS-Coinbase-Stripe stack, it does not use a marginal gadget, it borrows a plumbing that listed companies operate at scale. The convergence then ceases to be a technological bet to become a question of adoption, a wholly different risk, and a more bankable one.

## Why it can fail

The opposite reading is at least as well supplied, and recent history gives it ammunition. The first ground for failure is that most of the "crypto-AI" of 2024-2025 was not technology but narrative sold as such. The AI-agent-token bubble is the proof by absurdity. The ai16z token, which fraudulently borrowed the name of the a16z fund, peaked around $2.6 billion of market cap in early 2025 before collapsing nearly 99.9%, and its creators face a class action for fraud, accused of having promoted a non-existent AI. The Virtuals token lost nearly half its value in one week. The rule that emerges is cruel and instructive: the rare tokens that held had a genuinely functional agent generating on-chain activity; the "narrative first" projects lost more than 90% in a few months.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 290" role="img" aria-label="The collapse of the AI agent-token bubble in 2025" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="290" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">The casino side: the AI agent-token bubble</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">What the convergence produces when it is only a ticker. 2025.</text>
  <line x1="40" y1="78" x2="680" y2="78" stroke="#2a2c33" stroke-width="1"></line>
  <text x="40" y="108" fill="#d6d9df" font-size="12.5">ai16z, from peak to fall</text>
  <text x="300" y="112" fill="#ff4d87" font-size="19" font-weight="700">-99.9%</text>
  <text x="470" y="108" fill="#8b909b" font-size="11.5">from ~$2.6bn market cap</text>
  <line x1="40" y1="126" x2="680" y2="126" stroke="#2a2c33" stroke-width="1"></line>
  <text x="40" y="156" fill="#d6d9df" font-size="12.5">Virtuals, in one week</text>
  <text x="300" y="160" fill="#ff4d87" font-size="19" font-weight="700">-48%</text>
  <text x="470" y="156" fill="#8b909b" font-size="11.5">brutal sector correction</text>
  <line x1="40" y1="174" x2="680" y2="174" stroke="#2a2c33" stroke-width="1"></line>
  <text x="40" y="204" fill="#d6d9df" font-size="12.5">Tokens with no working agent</text>
  <text x="300" y="208" fill="#f5b13d" font-size="17" font-weight="700">-90%+</text>
  <text x="470" y="204" fill="#8b909b" font-size="11.5">'narrative first' does not hold</text>
  <line x1="40" y1="222" x2="680" y2="222" stroke="#2a2c33" stroke-width="1"></line>
  <text x="40" y="252" fill="#d6d9df" font-size="12.5">ai16z, legal status</text>
  <text x="300" y="256" fill="#7aa2f7" font-size="14" font-weight="700">class action</text>
  <text x="470" y="252" fill="#8b909b" font-size="11.5">alleged fraud, non-existent AI</text>
  <text x="32" y="282" fill="#8b909b" font-size="11">Sources: Crypto Economy, CryptoRank, class-action proceedings. Market capitalisations.</text>
</svg>
<figcaption>The convergence also has its graveyard: tokens presented as cutting-edge AI, collapsed by <strong>90 to 99.9%</strong>, one targeted by a class action for <strong>fraud</strong>. Narrative does not replace a product. Sources: Crypto Economy, CryptoRank.</figcaption>
</figure>

The other grounds for failure are structural. AI is intrinsically centralising and capital-hungry, against crypto's decentralising ideal: training a large model will always favour whoever owns the factory, not the network of amateurs. Compute networks remain hostage to their token's price. zkML is not mature. And Vitalik's warning stands: as soon as you entrust an AI with a rule role over significant sums, you open an attack surface through adversarial learning that is hard to close. Finally, a good share of projects are solutions in search of a problem: most AI uses have no need of a blockchain, and the marriage is sometimes only a fundraising artifice.

## The regulatory framework, still hazy

The law runs behind the technology, and the gap is gaping on the newest point: the liability of an autonomous agent that transacts. No regulator has yet published a clear doctrine on the application of KYC and anti-money-laundering when an AI agent executes a cross-border payment on its own. Liability regimes presuppose human intent and direct causality, two notions that wobble when the decision is taken by a machine. The emerging doctrine shifts the burden onto the deployer, the company that integrates the model into a product, which cannot pass the buck to its model provider. A concept is rising, "Know Your Agent", the 2026 equivalent of KYC: cryptographically verify an agent's identity before any transaction, looping back onto crypto's identity-attestation uses.

The rest of the framework comes together in blocks. In the United States, the GENIUS Act frames agents' money and the CLARITY Act their asset environment. In Europe, the MiCA regulation already governs crypto assets, while the AI regulation likely classifies autonomous agents making financial decisions among high-risk systems, with obligations of human oversight and auditability, whose heaviest requirements apply from 2 August 2026. Several recent academic works, from the International Monetary Fund on agentic payments to legal analyses of the autonomous agent under European law, map this vacuum in the process of being filled. The rule, here, is behind the machine, and this lag is itself a risk factor.

## TradFi follows, but not everywhere

The question that will decide is that of adoption by established finance, and the answer is nuanced: it follows the plumbing, not the casino. On the infrastructure side, the commitment is massive and documented. Visa, Mastercard, BlackRock, JPMorgan, Fidelity, State Street, Stripe and more than one hundred and forty Fortune 500 companies are deploying stablecoin rails and tokenised products on a shared layer whose market cap has passed $322 billion. On 30 June 2026, a joint stablecoin initiative, Open USD, brought together Stripe, Visa, Mastercard, Coinbase, BlackRock, BNY, Standard Chartered, Google and Shopify among others. Stripe bought the Bridge infrastructure and distributes wallets to agents; we described this shift from crypto to infrastructure in our pieces on [Ethereum and TradFi](/en/analysis/ethereum-tradfi-infrastructure/) and on [Hyperliquid](/en/analysis/hyperliquid-onchain-exchange/).

But this adoption is selective, and that is the whole point. Traditional finance absorbs stablecoins, tokenisation and agent-payment rails, because they cut costs and open markets. It keeps its distance from the speculative layer, the agent tokens and the decentralised narratives, whose collapse it witnessed. Telling sign, Visa is building technology allowing banks to turn their deposits into programmable money while keeping the funds on their balance sheet: TradFi wants the stablecoin's advantages without ceding its intermediation. It adopts the function, not the ideology. It is the best proof that the convergence has a real substance, and the best reason to doubt it will keep all its rupture promises.

## The dividing line

The right way to read crypto and AI is neither the prospectus's enthusiasm nor the sceptic's contempt, it is the sorting. On one side, a plumbing that solves real problems: agents paying below the cost of a card, a compute market arbitraging a commodity, a verification starting to pierce the black box. On the other, a casino that has already burned its players, and a share of projects where the blockchain is only a wrapper to raise funds. The dividing line is clear once you look for it: the convergence works when crypto solves a coordination, money or trust problem that AI genuinely poses, and it fails when it is only a ticker stuck onto a model.

The test, for the analyst as for the investor, holds in one simple question, the same that separated the survivors from the dead in the 2025 bubble: is there, behind the token or the protocol, a working agent, a running GPU, a verifiable proof? If so, the convergence has a future. If not, it is a buzzword, and buzzwords always end up emptying.

## Sources

1. Vitalik Buterin, "The promise and challenges of crypto + AI applications", 30 January 2024: the four-use framework and the warning on AI as a rule: https://vitalik.eth.limo/general/2024/01/30/cryptoai.html
2. Amazon Web Services, "Agents that transact: Introducing Amazon Bedrock AgentCore payments, built with Coinbase and Stripe": agent payments in USDC via x402 and Privy: https://aws.amazon.com/blogs/machine-learning/agents-that-transact-introducing-amazon-bedrock-agentcore-payments-built-with-coinbase-and-stripe/
3. CoinDesk / Keyrock report, crypto rails as the agent payment layer: ~$73M across 176M transactions, 76% of payments below $0.30: https://www.coindesk.com/business/2026/05/21/crypto-rails-are-becoming-the-default-payment-layer-for-ai-agents-report-says
4. International Monetary Fund, "How Agentic AI Will Reshape Payments", IMF Notes 2026/004: https://www.elibrary.imf.org/view/journals/068/2026/004/article-A001-en.xml
5. "A Survey of Zero-Knowledge Proof Based Verifiable Machine Learning", arXiv:2502.18535: state of the art of zkML (training, testing, inference) and its limits: https://arxiv.org/abs/2502.18535
6. Luca Nannini et al., "AI Agents Under EU Law", arXiv:2604.04604: classification and liability of autonomous agents under the European AI regulation: https://arxiv.org/abs/2604.04604
7. Crypto Economy, correction of AI agent tokens (ai16z and Virtuals): https://crypto-economy.com/ai-agent-tokens-face-market-pressure-as-ai16z-and-virtuals-drop-sharply/
8. CryptoRank, class action against the creators of ai16z and ElizaOS for alleged fraud: https://cryptorank.io/news/feed/0d429-ai16z-elizaos-creators-sued-fake-ai-hype
9. Yellow Research, the gap between AI compute demand and supply, and crypto GPU networks (io.net, Akash, Render, Bittensor): https://yellow.com/research/ai-compute-demand-crypto-gpu-networks-gap-2026
10. Visa, "New AI, Stablecoin and Token Innovations to Power Intelligent, Programmable Commerce": TradFi's response: https://investor.visa.com/news/news-details/2026/Visa-Announces-New-AI-Stablecoin-and-Token-Innovations-to-Power-Intelligent-Programmable-Commerce-at-Visa-Payments-Forum/default.aspx
11. l0g, guides [Stablecoins and the GENIUS Act](/en/guides/read-stablecoins-genius-act/), [Reading on-chain data](/en/guides/read-on-chain-data/) and articles [The GENIUS Act, the 18 July deadline](/en/analysis/the-genius-act-stablecoins-and-the-debt/) and [Ethereum and TradFi](/en/analysis/ethereum-tradfi-infrastructure/).
