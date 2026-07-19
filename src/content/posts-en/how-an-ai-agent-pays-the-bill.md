---
title: "Agent payments: how an AI settles the bill, and who holds the rails"
description: "An AI agent now pays on its own, in stablecoins, below the cost of a card transaction. Under this discreet plumbing, the mechanics of the x402 protocol that resurrects the HTTP 402 code, the battle for standards (Coinbase, Google AP2, Visa, Mastercard) that is really a complementary stack, the dependence on USDC, and a still poorly mapped security. A deep dive into the most solid vector of the crypto-AI convergence."
pubDate: 2026-07-14T11:28:00+02:00
updatedDate: 2026-07-14T11:28:00+02:00
tags: ["crypto", "ai", "stablecoins", "payments", "tech"]
draft: false
sourceArticle: "paiements-d-agents-comment-une-ia-regle-la-facture"
sourceUpdatedDate: 2026-07-12
---
*In our overview of the convergence between [crypto and artificial intelligence](/en/analysis/crypto-and-ai-convergence/), one vector stood out as the most accomplished: agent payments. An AI program that buys data or compute on its own now settles its bill in [stablecoins](/en/glossary/stablecoin/), in a few cents, with no human intervention. This piece goes one level deeper into the machine. How does an agent pay, concretely? Which standards clash, and is it really a clash? Who controls the rails, and how secure is all of this? Because behind the smoothness of the demonstration plays out a question of power, that of knowing who will hold the tap when billions of micropayments circulate between machines.*

## The problem cards cannot solve

The starting point is not ideological, it is economic. An autonomous agent that consumes a service, an API call, a data request, a second of compute, must pay very small amounts, very often, and machine to machine. Yet card networks are built for the opposite: a fixed fee of about $0.30 per transaction makes settling a one-cent payment absurd. Per the Keyrock report, 76% of agent payments fall below this threshold, most between one and ten cents. The card is not expensive for these flows, it is structurally impossible.

It is this void the stablecoin fills. Programmable, continuously available, transferable without opening an account or signing a subscription, it allows payments the banking infrastructure refuses by construction. The money framed by the [GENIUS Act](/en/analysis/the-genius-act-stablecoins-and-the-debt/) thus becomes the natural fuel of agentic commerce. What remains is how an agent uses it without a human validating each step. The answer lies in a forgotten web code.

## x402, the resurrection of the 402 code

When the HTTP protocol was designed, a status code, 402, was reserved for future use, labelled "Payment Required". It stayed dormant for nearly thirty years, for lack of an internet-native means of payment. In late 2025, Coinbase and Cloudflare woke it up with the x402 protocol, and the simplicity of the idea is its strength.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 310" role="img" aria-label="The flow of a payment through the x402 protocol" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="310" fill="#0c0d10"></rect>
  <text x="32" y="34" fill="#f5f6f8" font-size="17" font-weight="700">An x402 payment, step by step</text>
  <text x="32" y="55" fill="#8b909b" font-size="12">The resurrection of the HTTP 402 code, dormant since 1997.</text>
  <rect x="40" y="72" width="640" height="42" rx="6" fill="none" stroke="#5eead4" stroke-width="1.5"></rect>
  <text x="56" y="90" fill="#5eead4" font-size="12.5" font-weight="700">1. The agent requests a paid resource</text>
  <text x="56" y="107" fill="#8b909b" font-size="11.5">an API, data or compute request.</text>
  <line x1="360" y1="114" x2="360" y2="126" stroke="#8b909b" stroke-width="1.5"></line>
  <polygon points="360,126 355,116 365,116" fill="#8b909b"></polygon>
  <rect x="40" y="126" width="640" height="42" rx="6" fill="none" stroke="#7aa2f7" stroke-width="1.5"></rect>
  <text x="56" y="144" fill="#7aa2f7" font-size="12.5" font-weight="700">2. The server returns "402 Payment Required"</text>
  <text x="56" y="161" fill="#8b909b" font-size="11.5">with the price, the network and the facilitator-contract address.</text>
  <line x1="360" y1="168" x2="360" y2="180" stroke="#8b909b" stroke-width="1.5"></line>
  <polygon points="360,180 355,170 365,170" fill="#8b909b"></polygon>
  <rect x="40" y="180" width="640" height="42" rx="6" fill="none" stroke="#f5b13d" stroke-width="1.5"></rect>
  <text x="56" y="198" fill="#f5b13d" font-size="12.5" font-weight="700">3. The agent settles in USDC via the contract on the Base chain</text>
  <text x="56" y="215" fill="#8b909b" font-size="11.5">the facilitator validates and transfers the stablecoin.</text>
  <line x1="360" y1="222" x2="360" y2="234" stroke="#8b909b" stroke-width="1.5"></line>
  <polygon points="360,234 355,224 365,224" fill="#8b909b"></polygon>
  <rect x="40" y="234" width="640" height="42" rx="6" fill="none" stroke="#5eead4" stroke-width="1.5"></rect>
  <text x="56" y="252" fill="#5eead4" font-size="12.5" font-weight="700">4. On-chain receipt, request replayed, resource delivered</text>
  <text x="56" y="269" fill="#8b909b" font-size="11.5">all with no human intervention, for a few cents.</text>
  <text x="32" y="298" fill="#8b909b" font-size="11">Sources: Coinbase, Cloudflare, AWS. Protocol launched late 2025, stablecoins version in December.</text>
</svg>
<figcaption>The server demands a payment through a <strong>402</strong> code, the agent settles in <strong>USDC</strong> via a contract on the Base chain, gets a receipt and receives its resource. A machine-readable payment negotiation, settled for a handful of cents. Sources: Coinbase, Cloudflare.</figcaption>
</figure>

Coinbase provided the Base chain and the [USDC](/en/glossary/usdc/) rails, Cloudflare the software component that lets any interface hosted with it accept these payments. The protocol is free and with no protocol fee, in stablecoins only since its second version of December 2025. What this unlocks was unthinkable with the card: charging an AI interface per request, web content paid per article, service markets between agents, autonomous purchasing of supplies. An agent can spend a budget over thousands of micro-transactions without a human authorising each one. It is powerful, and it is precisely there that the risk sets in, more on that later.

## Not a standards war, a stack

The press loves the "protocol war" narrative, x402 against Google's standard against Visa's. The reality is more interesting: these bricks do not fight so much as they stack, each reigning over a different layer of the same payment.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 300" role="img" aria-label="The three layers of agent-payment standards" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="300" fill="#0c0d10"></rect>
  <text x="32" y="34" fill="#f5f6f8" font-size="17" font-weight="700">Not a standards war, a stack</text>
  <text x="32" y="55" fill="#8b909b" font-size="12">Three layers, three players, one agent payment.</text>
  <rect x="40" y="74" width="640" height="62" fill="#7aa2f7" opacity="0.18" stroke="#7aa2f7" stroke-width="1.5"></rect>
  <text x="58" y="98" fill="#7aa2f7" font-size="13" font-weight="700">Identity: who is the agent?</text>
  <text x="58" y="118" fill="#d6d9df" font-size="11.5">Visa Trusted Agent Protocol: a signed passport, verified in a registry.</text>
  <rect x="40" y="146" width="640" height="62" fill="#f5b13d" opacity="0.18" stroke="#f5b13d" stroke-width="1.5"></rect>
  <text x="58" y="170" fill="#f5b13d" font-size="13" font-weight="700">Authorisation: what can it spend?</text>
  <text x="58" y="190" fill="#d6d9df" font-size="11.5">Google AP2: signed mandates (intent, cart, payment) as verifiable proofs.</text>
  <rect x="40" y="218" width="640" height="62" fill="#5eead4" opacity="0.18" stroke="#5eead4" stroke-width="1.5"></rect>
  <text x="58" y="242" fill="#5eead4" font-size="13" font-weight="700">Execution: the payment itself</text>
  <text x="58" y="262" fill="#d6d9df" font-size="11.5">x402 and stablecoins: settlement in USDC, on-chain, with no protocol fee.</text>
</svg>
<figcaption>The <strong>identity</strong> layer (Visa) proves who the agent is, the <strong>authorisation</strong> layer (Google AP2) sets what it can spend, the <strong>execution</strong> layer (x402, stablecoins) settles the sum. The standards complement more than they clash. Sources: Coinbase, Google Cloud, Visa.</figcaption>
</figure>

Google's standard, AP2, announced in September 2025 with about sixty partners including Mastercard, PayPal and Coinbase, handles authorisation: it encodes in signed mandates, carried as verifiable attestations, the fact that a given agent can spend a given amount, under given conditions, on behalf of a given user. Google donated it to the FIDO alliance in April 2026 for open governance. Visa's protocol, for its part, handles identity: the agent signs its requests with a private key the merchant verifies in Visa's registry, a digital passport. Mastercard rolls out its own version on its rails. x402 and stablecoins occupy the bottom layer, the one where value really moves. Seen this way, the convergence does not pit crypto against established finance, it assigns them floors.

## The players, and the dependence on USDC

This stack has heavyweights on each floor. Amazon Web Services launched an infrastructure, Bedrock AgentCore Payments, which lets agents pay in stablecoins relying on x402 and on Stripe's wallets. Stripe, precisely, built an agent money stack from its acquisition of the Bridge infrastructure and its Privy wallets. Stablecoin issuers, Circle in the lead, provide the fuel. Most of these giants are listed or backed by listed companies, which gives the whole an adult infrastructure rather than a lab patchwork.

This maturity has a flip side, concentration. Almost all agent payments settle today in USDC, Circle's stablecoin. It is a point of dependence on a single issuer, with the risk that implies: an incident on USDC, like its temporary depeg of March 2023 when part of its reserves was frozen at Silicon Valley Bank, would propagate instantly to the whole agentic economy built on it. The convenience of a de facto standard is paid in concentrated systemic fragility. Diversifying issuers would be safer, but would fragment liquidity, a classic trade-off we find everywhere in financial plumbing.

## Security, a gaping blind spot

Here is the least mature side, and the most worrying. Giving an autonomous piece of software the ability to spend money, without human validation at each transaction, opens an attack surface research is only beginning to map. Several academic works published in 2026 inventory the flaws of the x402 protocol alone, with unambiguous titles, from a "systematic security analysis" to "five attacks" documented.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 290" role="img" aria-label="The security vulnerabilities of agent payments" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="290" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Security, the blind spot of agentic commerce</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Vulnerabilities analysed by academic research, 2026.</text>
  <line x1="40" y1="78" x2="680" y2="78" stroke="#2a2c33" stroke-width="1"></line>
  <circle cx="48" cy="101" r="5" fill="#ff4d87"></circle>
  <text x="64" y="98" fill="#ff4d87" font-size="12.5" font-weight="700">Prompt injection</text>
  <text x="64" y="115" fill="#8b909b" font-size="11.5">a trapped instruction diverts the agent to an unauthorised payment.</text>
  <line x1="40" y1="128" x2="680" y2="128" stroke="#2a2c33" stroke-width="1"></line>
  <circle cx="48" cy="151" r="5" fill="#f5b13d"></circle>
  <text x="64" y="148" fill="#f5b13d" font-size="12.5" font-weight="700">Free-riding</text>
  <text x="64" y="165" fill="#8b909b" font-size="11.5">bypass the payment to get the resource without paying.</text>
  <line x1="40" y1="178" x2="680" y2="178" stroke="#2a2c33" stroke-width="1"></line>
  <circle cx="48" cy="201" r="5" fill="#7aa2f7"></circle>
  <text x="64" y="198" fill="#7aa2f7" font-size="12.5" font-weight="700">Data leak (PII)</text>
  <text x="64" y="215" fill="#8b909b" font-size="11.5">personal information exposed in the payment negotiation.</text>
  <line x1="40" y1="228" x2="680" y2="228" stroke="#2a2c33" stroke-width="1"></line>
  <circle cx="48" cy="251" r="5" fill="#5eead4"></circle>
  <text x="64" y="248" fill="#5eead4" font-size="12.5" font-weight="700">No per-transaction control</text>
  <text x="64" y="265" fill="#8b909b" font-size="11.5">without strict spending limits, an error repeats thousands of times.</text>
</svg>
<figcaption>Prompt injection toward a rogue payment, free-riding on the protocol, data leaks, and above all the absence of a human safeguard at each transaction: the speed that makes agentic commerce interesting also makes it dangerous. Sources: arXiv works, 2026.</figcaption>
</figure>

The most characteristic flaw is prompt injection: a malicious instruction slipped into a page or an interface response diverts the agent and pushes it to pay where it should not. Add free-riding attacks to get the resource without paying, personal-data leaks in the negotiation phase, and a fundamental problem: since no human validates each payment, an erroneous or trapped instruction repeats at machine speed, thousands of times before it is noticed. The defences exist, strict spending caps, data filtering before execution, cryptographic verification of the agent's identity, the idea of a "Know Your Agent" modelled on "Know Your Customer". But they are young, and the gap between deployment speed and security maturity is the real Achilles' heel of this vector.

## Who holds the tap

There remains the political question, the most interesting for anyone who follows power in finance. Is agentic commerce decentralising payment, or recentralising it differently? The execution layer, x402 and stablecoins, is open and permissionless, faithful to the crypto promise: any agent can pay any server without going through a gatekeeper. But the layers above, identity and authorisation, are being captured by the established players, Visa for the agent's passport, Google for the spending mandate. Yet whoever controls identity and authorisation controls the tap, even if the value flows on open rails.

It is the telling sign we already noted about traditional finance: it adopts the stablecoin's function without ceding its toll-booth role. By seizing the high layers of the stack, card networks and cloud giants ensure that, even in a world of stablecoin payments, it is still their registry that will say which agent is legitimate and how much it can spend. The disintermediation promised by crypto moves one notch, it does not disappear. Payment becomes open, authorisation stays guarded.

## The points to watch

To follow this vector without being carried away, a few markers. The first is real adoption, measured in settled volume, not to be confused with the trillion-dollar projections we put into perspective in the [crypto-AI overview](/en/analysis/crypto-and-ai-convergence/): the use case is proven, its scale stays modest. The second is the concentration on USDC, any incident on which would become systemic for the agentic economy. The third is security, where each protocol will have to prove itself against the attacks research already documents. The fourth is the sharing of layers: watching who wins identity and authorisation will say who really holds the power, whatever the settlement rail.

## Payment changes hands

Agent payments are the most tangible part of the crypto-AI convergence because they solve a concrete problem nothing else solves: paying a machine, continuously, for almost nothing. The plumbing works, the giants are laying it, and the stablecoin finally finds a massive use outside speculation. But the smoothness of the demonstration must not mask the three reservations that will decide its trajectory: a still anecdotal scale, a dangerous dependence on a single issuer, and a security lagging the deployment. Payment is changing hands, from humans to agents. The real question is not whether this will happen, but who, of open crypto or the established gatekeepers, will hold the keys to the new tap.

## Sources

1. Amazon Web Services, "Agents that transact: Introducing Amazon Bedrock AgentCore payments, built with Coinbase and Stripe": agent payments in USDC via x402: https://aws.amazon.com/blogs/machine-learning/agents-that-transact-introducing-amazon-bedrock-agentcore-payments-built-with-coinbase-and-stripe/
2. AWS Industries, "x402 and Agentic Commerce: Redefining Autonomous Payments in Financial Services": mechanics of the protocol and the facilitator contract on Base: https://aws.amazon.com/blogs/industries/x402-and-agentic-commerce-redefining-autonomous-payments-in-financial-services/
3. CoinDesk / Keyrock report: ~$73M across 176M transactions, 76% of agent payments below the cards' $0.30 threshold: https://www.coindesk.com/business/2026/05/21/crypto-rails-are-becoming-the-default-payment-layer-for-ai-agents-report-says
4. Google Cloud, "Announcing Agent Payments Protocol (AP2)": signed mandates (intent, cart, payment) and launch partners: https://cloud.google.com/blog/products/ai-machine-learning/announcing-agents-to-payments-ap2-protocol
5. Visa, "New AI, Stablecoin and Token Innovations to Power Intelligent, Programmable Commerce": Trusted Agent Protocol and identity registry: https://investor.visa.com/news/news-details/2026/Visa-Announces-New-AI-Stablecoin-and-Token-Innovations-to-Power-Intelligent-Programmable-Commerce-at-Visa-Payments-Forum/default.aspx
6. "Free-Riding the Agentic Web: A Systematic Security Analysis of x402 Payments", arXiv:2605.30998: https://arxiv.org/abs/2605.30998
7. "Five Attacks on x402 Agentic Payment Protocol", arXiv:2605.11781: https://arxiv.org/abs/2605.11781
8. "SoK: Security of Autonomous LLM Agents in Agentic Commerce", arXiv:2604.15367: https://arxiv.org/abs/2604.15367
9. l0g, [Crypto and AI: anatomy of a convergence](/en/analysis/crypto-and-ai-convergence/), [The GENIUS Act, the 18 July deadline](/en/analysis/the-genius-act-stablecoins-and-the-debt/) and the guide [Stablecoins and the GENIUS Act](/en/guides/read-stablecoins-genius-act/).
