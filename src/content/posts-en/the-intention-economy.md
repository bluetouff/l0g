---
title: "From attention to intention: the agentic economy and the resurrection of the 402 code"
description: "The advertising model that funded the web is not dying, it is mutating. AI agents, micropayments, stablecoins, MCP, A2A and x402 protocols: a sourced, quantified investigation into the internet's native payment layer, its overstated promises and its regulatory constraints."
pubDate: 2026-07-14T11:24:00+02:00
updatedDate: 2026-07-14T11:24:00+02:00
tags: ["crypto", "stablecoins", "ai", "agents", "advertising", "macro", "ecb"]
draft: false
sourceArticle: "economie-des-intentions"
sourceUpdatedDate: 2026-06-20
---

*When an artificial intelligence navigates in your place and delivers you an answer, the ad network loses its point of insertion. Behind AI agents, another economic architecture is being built: pay-per-request, [stablecoins](/en/glossary/stablecoin/) as monetary vehicle, and an old HTTP code no one had finished wiring. This article reconstructs that stack and confronts it with the figures, academic research and the law. First clarification: the attention economy does not disappear, it moves, and the ability to predict our intentions remains, at this stage, more a commercial promise than a demonstrated fact.*

For twenty years, the web ran on a single market: that of your attention. A user searches, scrolls, clicks, and along the way crosses ads. Their time on site and their click rate are the raw material. This market has a size, and it is colossal. But it rests on a fiction installed as self-evident: the idea that information would be free. It never was. It was paid by a third party, the advertiser, in exchange for access to your behaviour.

The arrival of AI agents, those software programs that act for you rather than displaying results, moves the point of insertion. When the agent answers, there is no longer a page to load, no space to sell in the same place. The question becomes economic: if part of the web ceases to be funded by pay-per-click advertising, by what will it be? An answer is assembling, made of open protocols, a pay-per-request layer, stablecoins, and a debate on monetary sovereignty. The rest of this article describes this construction without overestimating it.

## Advertising: a cycle, not an eternal annuity, and above all not a corpse

Let us start with the order of magnitude, because the figures that circulate often understate the market. Per WPP Media's (formerly GroupM) late-2025 forecast, global advertising revenue reached **$1.14 trillion** in 2025, excluding political advertising, up **8.8%** year on year, with growth expected at **7.1%** in 2026. The firm Dentsu, which measures differently, places the crossing of the trillion in 2026. The two houses diverge on the timing, which recalls a method rule: each figure depends on the definition used. We reason in attributed ranges, never in a single truth.

On the digital share, the convergence is clear: about **73%** of global ad spend. GroupM's late-2024 forecast put "pure-play" digital at **$813 billion** for 2025; Statista's estimate for the same year is **$799 billion**, with search as the top segment at **$334 billion**. Google, Meta and Amazon capture on their own nearly three-quarters of global digital revenue excluding China. For Google's parent company alone, advertising represents more than **$200 billion** of annual revenue, nearly **80%** of Alphabet's turnover.

One point must be made at once, because the analytical error is tempting: advertising does not die. It migrates. The clearest signal comes from the players reputed to be "killers" of the model. OpenAI, whose ChatGPT app passed **800 million weekly users** at the end of 2025 then about **900 million** in early 2026 (figures released by the company and relayed by Reuters), launched in early 2026 an advertising test inside ChatGPT, targeting free and "Go" users. The logic is exactly that of the old web: fewer than **10%** of users pay, so the rest must be funded otherwise. Google, for its part, told advertisers in late 2025 it wanted to introduce advertising into its Gemini assistant in 2026. The attention model does not die, it settles into the new interfaces.

<figure class="infographic">
<svg viewBox="0 0 720 340" role="img" aria-label="Breakdown of the global advertising market 2025" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect x="0" y="0" width="720" height="340" fill="#0c0d10"/>
  <text x="32" y="34" fill="#f5f6f8" font-size="13">GLOBAL AD MARKET 2025</text>
  <text x="32" y="52" fill="#8b909b" font-size="11">revenue excl. political · WPP Media, Dec 2025</text>
  <rect x="32" y="64" width="656" height="26" fill="rgba(255,255,255,0.10)"/>
  <rect x="32" y="64" width="479" height="26" fill="#5eead4"/>
  <text x="44" y="82" fill="#0c0d10" font-size="12">digital ≈ 73%</text>
  <text x="600" y="82" fill="#8b909b" font-size="12">trad. 27%</text>
  <text x="32" y="112" fill="#f5f6f8" font-size="13">$1,140bn · of which digital ≈ $800bn</text>
  <text x="32" y="156" fill="#f5f6f8" font-size="13">DIGITAL BREAKDOWN</text>
  <text x="32" y="174" fill="#8b909b" font-size="11">2025 orders of magnitude</text>
  <g font-size="12">
    <text x="32" y="204" fill="#f5f6f8">search</text>
    <rect x="180" y="194" width="430" height="14" fill="rgba(255,255,255,0.10)"/>
    <rect x="180" y="194" width="430" height="14" fill="#5eead4"/>
    <text x="620" y="205" fill="#f5f6f8">≈ $334bn</text>
    <text x="32" y="234" fill="#f5f6f8">social media</text>
    <rect x="180" y="224" width="430" height="14" fill="rgba(255,255,255,0.10)"/>
    <rect x="180" y="224" width="312" height="14" fill="#5eead4"/>
    <text x="620" y="235" fill="#f5f6f8">≈ $242bn</text>
    <text x="32" y="264" fill="#f5f6f8">retail media</text>
    <rect x="180" y="254" width="430" height="14" fill="rgba(255,255,255,0.10)"/>
    <rect x="180" y="254" width="210" height="14" fill="#ff4d87"/>
    <text x="620" y="265" fill="#f5f6f8">≈ $163bn</text>
    <text x="32" y="294" fill="#f5f6f8">video / CTV</text>
    <rect x="180" y="284" width="430" height="14" fill="rgba(255,255,255,0.10)"/>
    <rect x="180" y="284" width="129" height="14" fill="#5eead4"/>
    <text x="620" y="295" fill="#f5f6f8" textLength="94" lengthAdjust="spacingAndGlyphs">≈ $80 to $110bn</text>
  </g>
  <line x1="32" y1="312" x2="688" y2="312" stroke="rgba(255,255,255,0.20)" stroke-width="1"/>
  <text x="32" y="330" fill="#8b909b" font-size="11" textLength="682" lengthAdjust="spacingAndGlyphs">in pink, retail media: the most dynamic segment, driven by Amazon. Search is the most exposed to agentic bypass.</text>
</svg>
<figcaption>The global advertising market 2025. Sources: WPP Media (Dec 2025); GroupM (EOY 2024); Statista 2025. The segments do not add up exactly to the total: perimeters and methodologies differ by firm.</figcaption>
</figure>

This dominance has a documented qualitative cost. The search algorithm does not adjudicate truth: it reads mathematical signals (publication frequency, engagement, inbound links) and rewards optimisation. Anxiety-inducing content triggers more clicks than a nuanced analysis, so optimising for engagement structurally favours the sensational, and expertise that refuses the rules of SEO ends up made invisible. The author Cory Doctorow named this degradation: "enshittification", named word of the year 2023 by the American Dialect Society and then by the Macquarie Dictionary in 2024. Its three-step mechanics are precise: a platform first makes itself useful to its users, then exploits them for the benefit of its business customers, then captures the value for itself alone.

The nuance imposes itself, because the diagnosis is often caricatured. It is less an intention than a predictable result of a business model backed by attention: the engines amplify a pre-existing cognitive laziness as much as they create it. And the platforms' power, real, is not absolute. The 2015 slide from the motto "Don't be evil" to the more malleable "Do the right thing", at the moment of Alphabet's creation, records a model in tension with its original promise: the strict separation between organic results and advertisers.

## The click against the figures

The effect of AI-generated answers on traffic is no longer an intuition, it is measured. The Pew Research Center analysed in March 2025 the behaviour of **900** American adults who agreed to share their browsing, nearly **69,000** Google searches. Result: **18%** of searches triggered an AI summary ("AI Overview"), and **58%** of participants encountered at least one in the month. Above all, in the presence of an AI summary, the user clicked toward an external link only in **8%** of cases, against **15%** in its absence, nearly twice less. The click toward a source cited inside the summary fell to **1%**. And the user ended their browsing session in **26%** of cases after a summary page, against **16%** without.

There is the real pressure on publishers, quantified and dated: not a disappearance of traffic, but an erosion of the outbound click where AI answers directly. This observation underpins what follows, but it immediately calls for a counterpoint the alarmist commentary forgets.

Because commercial behaviour tells a more nuanced and far more instructive story. Adobe Analytics data, based on more than **a trillion visits** to US retail sites, show that the traffic arriving from a generative AI was initially of poor commercial quality, then reversed. The conversion of AI traffic was about **49%** lower than that of classic traffic in January 2025, a gap narrowed to **23%** in July 2025. Then the flip: this same traffic converted about **31%** better than non-AI traffic during the 2025 holidays, and up to **42%** better in March 2026, a record per Adobe. Visitors coming from an AI spend **45 to 48%** more time on the site and view about **13%** more pages. The volume, meanwhile, exploded: traffic to retail from generative-AI tools jumped about **693%** year on year during the 2025 holiday season.

<figure class="infographic">
<svg viewBox="0 0 720 360" role="img" aria-label="Conversion of AI traffic compared with human traffic in retail" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect x="0" y="0" width="720" height="360" fill="#0c0d10"/>
  <text x="32" y="30" fill="#f5f6f8" font-size="13">AI TRAFFIC vs HUMAN TRAFFIC: CONVERSION FLIPS</text>
  <text x="32" y="48" fill="#8b909b" font-size="11">conversion-rate gap, US retail · Adobe Analytics</text>
  <line x1="60" y1="200" x2="688" y2="200" stroke="rgba(255,255,255,0.30)" stroke-width="1"/>
  <text x="60" y="196" fill="#8b909b" font-size="10">parity (0%)</text>
  <rect x="90" y="200" width="70" height="118" fill="#ff4d87"/>
  <text x="125" y="334" fill="#8b909b" font-size="10.5" text-anchor="middle">Jan 25</text>
  <text x="125" y="194" fill="#ff4d87" font-size="12" text-anchor="middle">-49%</text>
  <rect x="230" y="200" width="70" height="91" fill="#ff4d87"/>
  <text x="265" y="307" fill="#8b909b" font-size="10.5" text-anchor="middle">Apr 25</text>
  <text x="265" y="194" fill="#ff4d87" font-size="12" text-anchor="middle">-38%</text>
  <rect x="370" y="200" width="70" height="55" fill="#ff4d87"/>
  <text x="405" y="271" fill="#8b909b" font-size="10.5" text-anchor="middle">Jul 25</text>
  <text x="405" y="194" fill="#ff4d87" font-size="12" text-anchor="middle">-23%</text>
  <rect x="510" y="126" width="70" height="74" fill="#5eead4"/>
  <text x="545" y="220" fill="#8b909b" font-size="10.5" text-anchor="middle">holidays 25</text>
  <text x="545" y="118" fill="#5eead4" font-size="12" text-anchor="middle">+31%</text>
  <rect x="650" y="100" width="70" height="100" fill="#5eead4"/>
  <text x="672" y="220" fill="#8b909b" font-size="10.5" text-anchor="middle">Mar 26</text>
  <text x="672" y="92" fill="#5eead4" font-size="12" text-anchor="middle">+42%</text>
  <text x="32" y="352" fill="#8b909b" font-size="11" textLength="682" lengthAdjust="spacingAndGlyphs">AI traffic converted worse than human traffic, then flipped in late 2025. A recent signal, limited to retail.</text>
</svg>
<figcaption>Conversion-rate gap between traffic from a generative AI and classic traffic, US retail. Source: Adobe Analytics / Adobe Digital Insights (March 2025 to March 2026), base above a trillion visits. Data specific to retail, not generalisable to the whole web.</figcaption>
</figure>

Two lessons, and they run against the triumphalist narrative. First, AI serves mostly the research and comparison phase: the user informs themselves via the agent, then converts, which explains longer sessions and a better-prepared basket. Second, the conversion reversal is very recent, specific to retail, and says nothing of a generalised collapse of advertising. Prudence forbids extrapolating from online sales to the whole information economy.

## The intention economy: a promise, and a warning

The term deserves dating, because it carries two opposing readings. "The intention economy" was first a pro-consumer concept, coined by Doc Searls in a Linux Journal column in March 2006, then developed in his 2012 book and his ProjectVRM at Harvard's Berkman Klein Center: the idea that the customer, not the platform, would eventually control the data of their own purchase intentions.

The contemporary version is markedly darker, and it is academic. In "Beware the Intention Economy: Collection and Commodification of Intent via Large Language Models", published on 30 December 2024 in the Harvard Data Science Review, researchers Yaqub Chaudhary and Jonnie Penn, of Cambridge's Leverhulme Centre for the Future of Intelligence, describe an emerging market where language models capture, manipulate and resell no longer attention, but motivation. Conversational agents can subtly influence intentions, for example by imitating the user's writing style to seem familiar, or by guessing their phrasing in advance.

This point reframes any honest analysis, and it answers a legitimate objection: no, near-total prediction of behaviour is not settled. Chaudhary and Penn present the intention economy as a "concerning if unchecked" prospect, not as an established fact. They note that the formalisation of "intent" by the researchers themselves stays crude: a Microsoft team, in 2024, sorts user intentions into boxes such as "information seeking", "problem solving" or "leisure", which underlines how poorly the object is defined. Humans remain largely unpredictable, and the promise of reading intent is, at this stage, a commercial argument as much as a technical capability. The whole architecture described below is built on this promise, without having demonstrated it.

## 402 Payment Required: the web's forgotten code

The HTTP protocol has contained since its first specifications a status code that stayed a dead letter for decades: `402 Payment Required`. Reserved "for future use", it described a web where you would natively pay for access to a resource. For lack of a request-scale payment rail, that future never came. Two players that everything opposes have just resurrected it for the same reason: AI agents need to pay.

On 1 July 2025, Cloudflare became the first major infrastructure provider to block AI bots by default on new domains, switching from an "opt-out" model to an "opt-in" one. The same announcement launched Pay Per Crawl, a marketplace where a publisher can demand payment each time an AI scrapes a page: allow for free, charge, or block. Mechanically, the bot presents a payment intent in the request header and gets a `200`, or is returned a `402` with a price. Cloudflare acts as merchant of record and handles the settlement. The company serves about one-fifth of global web traffic, which gives the setup a real potential reach, but in beta the balance of power stays overwhelming: a small independent publisher has no leverage against the large models, and the immediate revenue is modest.

On the crypto side, Coinbase published in May 2025 the x402 white paper, an open standard that reactivates this same 402 code to embed a stablecoin payment directly into the HTTP exchange. The principle holds in a round trip: a client requests a resource, the server responds with a price, the client signs a stablecoin payment, the resource is delivered, with no account or API key. Settlements happen mainly in [USDC](/en/glossary/usdc/), on several chains. In September 2025, Coinbase and Cloudflare founded the x402 Foundation, since moved under the governance of the Linux Foundation, with about twenty members including Google, Stripe and Visa. The traction figures must be handled with caution, because they come from the standard's promoters and mix technical transactions with real payments: more than **35 million transactions** on the Solana chain alone by March 2026, an integration into Stripe's PaymentIntents API, and a payment layer estimated at around **$600 million** on an annualised basis.

Legacy web infrastructure and crypto aim at the same primitive: make payment native to the protocol, at request granularity. It is the material condition of the micropayment (paying a few cents for a precise answer) and of the streamed payment (paying continuously, as consumption flows), impossible with legacy rails, designed for human transactions, slow and costly in fixed fees.

## The agentic stack: MCP, A2A and an IETF draft

For an agent to pay, it must first know how to talk to tools and to other agents. Three protocols structure this stack. Two are already de facto standards, the third is a draft whose status must be described honestly.

MCP, the Model Context Protocol, introduced by Anthropic on 25 November 2024, is a framework based on JSON-RPC 2.0 that standardises how an AI reads files, executes functions and retrieves context from external sources. Before it, each integration was bespoke. Adoption was fast and cross-partisan: OpenAI adopted it in March 2025, Google DeepMind in April 2025, Microsoft integrated it into Windows and Copilot Studio. In December 2025, Anthropic transferred MCP to the Agentic AI Foundation, under the aegis of the Linux Foundation, co-founded with Block and OpenAI. There were then more than **16,000** MCP servers in circulation.

Where MCP links an agent to tools, the A2A protocol, Agent2Agent, links agents to one another. Announced by Google on 9 April 2025, it lets agents from different providers discover each other, authenticate and delegate tasks. Google transferred it to the Linux Foundation as early as 23 June 2025, with the support of Amazon, Microsoft, Salesforce, Cisco, SAP and ServiceNow. Objectivity requires it: despite a solid architecture, A2A's momentum seemed to slow against MCP in the autumn of 2025. In matters of protocols, adoption often beats technical elegance.

The third document is often over-interpreted. It is an individual Internet-Draft (`draft-zeng-mcp-network-mgmt-01`), published on 16 October 2025 by Zeng Guanming, an engineer at Huawei, valid until 19 April 2026. Neither an RFC, nor an adopted working-group document: an individual proposal, "work in progress", whose current version is moreover expired as of this article's date. On substance, the idea illuminates a trajectory: extend MCP so that network equipment (routers, switches) behaves as MCP servers. The draft defines seven tools, addressable resources and dedicated error codes. Today, a network controller must speak CLI, NETCONF, SNMP, gNMI and proprietary APIs; tomorrow, an agent would diagnose a fault via the same MCP channel it uses for everything else. The real reach will depend on adoption by an IETF working group, which is not settled.

<figure class="infographic">
<svg viewBox="0 0 720 430" role="img" aria-label="Layered stack of agentic protocols" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect x="0" y="0" width="720" height="430" fill="#0c0d10"/>
  <line x1="22" y1="40" x2="22" y2="392" stroke="#ff4d87" stroke-width="2"/>
  <polygon points="22,392 18,382 26,382" fill="#ff4d87"/>
  <g>
    <rect x="44" y="34" width="644" height="78" fill="none" stroke="rgba(255,255,255,0.20)"/>
    <text x="60" y="58" fill="#8b909b" font-size="11">LAYER 04 · AGENT-TO-AGENT COMMUNICATION</text>
    <text x="60" y="82" fill="#5eead4" font-size="16">A2A · Agent2Agent</text>
    <text x="60" y="102" fill="#8b909b" font-size="11.5">discovery · authentication · task delegation</text>
    <text x="688" y="58" fill="#8b909b" font-size="10.5" text-anchor="end">Linux Foundation · 06/2025</text>
  </g>
  <g>
    <rect x="44" y="118" width="644" height="78" fill="none" stroke="rgba(255,255,255,0.20)"/>
    <text x="60" y="142" fill="#8b909b" font-size="11">LAYER 03 · CONTEXT AND TOOLS</text>
    <text x="60" y="166" fill="#5eead4" font-size="16">MCP · Model Context Protocol</text>
    <text x="60" y="186" fill="#8b909b" font-size="11.5">files · functions · external data · 16,000+ servers</text>
    <text x="688" y="142" fill="#8b909b" font-size="10.5" text-anchor="end">AAIF / Linux F. · 12/2025</text>
  </g>
  <g>
    <rect x="44" y="202" width="644" height="92" fill="none" stroke="#ff4d87"/>
    <text x="60" y="226" fill="#8b909b" font-size="11">LAYER 02 · PAYMENT AND SETTLEMENT</text>
    <text x="60" y="250" fill="#f5f6f8" font-size="15">x402 · AP2 · ACP · Visa IC · Mastercard Agent Pay</text>
    <text x="60" y="270" fill="#8b909b" font-size="11.5">payment becomes native to the HTTP request</text>
    <text x="688" y="226" fill="#ff4d87" font-size="10.5" text-anchor="end">revives HTTP 402</text>
  </g>
  <g>
    <rect x="44" y="300" width="644" height="78" fill="#f5b13d"/>
    <text x="60" y="324" fill="#0c0d10" font-size="11">LAYER 01 · MONEY</text>
    <text x="60" y="348" fill="#0c0d10" font-size="16">Stablecoins · USDC · [USDT](/en/glossary/usdt/)</text>
    <text x="60" y="368" fill="#0c0d10" font-size="11.5">≈ $317bn market cap · ≈ 99% denominated in dollars</text>
  </g>
  <text x="44" y="410" fill="#8b909b" font-size="11" textLength="670" lengthAdjust="spacingAndGlyphs">Each layer is entrusted to a neutral foundation. The money layer, though, stays overwhelmingly in dollars.</text>
</svg>
<figcaption>The agentic stack reads like a settlement that rises: money funds the payment, which embeds into exchanges between tools then between agents. Sources: Anthropic; Google; Coinbase; Linux Foundation; Federal Reserve.</figcaption>
</figure>

## The money layer: who builds the agents' rail

The most disputed layer is not technical, it is monetary. An agent that decides needs a programmable, instant, borderless, low-unit-cost monetary vehicle. Stablecoins tick these boxes, and they already serve as a concrete rail outside the lab, as shown by the settlement in USDT of the Strait of Hormuz tolls.

Per a Federal Reserve staff note (April 2026), the aggregate market cap of stablecoins reached about **$317 billion** on 6 April 2026, up more than **50%** since the start of 2025. The sector is highly concentrated: USDT (about $184 to $187 billion) and USDC (about $77 billion) represent the overwhelming majority. The US framework clarified with the [GENIUS Act](/en/glossary/genius/), enacted on 18 July 2025, which mandates full reserve backing; it is part of the regulatory movement detailed in [the CLARITY Act and US crypto framing](/en/analysis/the-clarity-act-us-crypto-regulation/). One fact, finally, is decisive: per the ECB, about **99%** of the stablecoin supply in circulation is denominated in dollars.

On this base, two families of players clash. On one side, the crypto-native standards: x402 and its integration into Google's AP2 protocol, for which x402 is the stablecoin facilitator. On the other, the card networks, which do not intend to be bypassed. Visa launched Visa Intelligent Commerce on 30 April 2025 with nine founding partners, including OpenAI; Mastercard launched Agent Pay in April 2025, extended in June 2026 into "Agent Pay for Machines" for micropayments on the order of a fraction of a cent. OpenAI launched Instant Checkout on 29 September 2025 with Stripe, via the ACP, Agentic Commerce Protocol, first for Etsy, Walmart and Shopify. The most accurate reading grid comes from sector analysts: trust and authorisation at the top (AP2, Visa, Mastercard), execution and settlement at the bottom (x402, on-chain stablecoins). Visa plays complementarity, aligning its Trusted Agent Protocol with OpenAI's ACP and the x402 standard.

The reality check tempers the enthusiasm. Per a sector estimate, only about **4%** of consumers today let an AI finalise a purchase autonomously: the infrastructure arrives well ahead of the trust. And the volumes must be read rigorously. An aggregate transfer volume on the order of **$33 trillion** in 2025 (reported by Artemis and Bloomberg) is not to be confused with a real payment volume, far more modest.

## Who has already switched, and who resists

The architecture ceases to be theoretical when you look at the companies operating it. Three concrete, quantified cases show the diversity of models, and the fact that none has renounced monetisation.

Perplexity, the answer engine valued around **$20 billion** per the press, launched in August 2025 a revenue-sharing programme with publishers, Comet Plus. The mechanism breaks with pay-per-click: a **$42.5 million** endowment, an **80/20** split in favour of publishers, funded by a subscription at **$5** a month, and remuneration triggered by direct visits, citations and agent usage. The first partners cited include Fortune, Time, Der Spiegel, Gannett and The Independent. The Comet browser, launched in July 2025 then made free in October, is its entry point. It is a model where the source is paid because it is cited, not because it attracts an advertising click.

OpenAI illustrates the coexistence of models rather than the rupture. On one side, Instant Checkout turns ChatGPT into an agentic buying surface; on the other, the company introduced in early 2026 advertising into its free and "Go" offers, exactly the model said to be threatened. With about **900 million** weekly users and annualised revenue above **$20 billion** in 2025, OpenAI does not choose between attention and intention, it stacks the two.

Amazon, finally, shows there is no mandatory convergence toward open protocols. Its Rufus assistant, become "Alexa for Shopping" in May 2026, was used by more than **300 million** customers in 2025 and generated nearly **$12 billion** of annualised incremental sales, per the Q4 2025 results published in February 2026. Its "Buy for Me" function executes a purchase on external stores on the user's behalf. But Amazon adopted neither MCP, nor x402, nor AP2: it keeps a walled garden, backed by its catalogue, its reviews, its logistics and its payments. Standards fragmentation is as probable an outcome as their unification.

## The return of regulation: GDPR, DMA, antitrust

The most neglected angle of the agentic debate is legal, and it weighs heavily. An agent that decides and pays on its own runs first into the GDPR. Its Article 22 confers on every person the right not to be subject to a decision based solely on automated processing producing legal effects or significantly affecting them. An autonomous purchase, a service refusal, a financial arbitrage executed without human intervention fall within this perimeter. The agentic layer will not deploy in a normative vacuum.

The European Digital Markets Act adds a structural constraint. Seven companies are designated "gatekeepers" (Alphabet, Amazon, Apple, Booking, ByteDance, Meta, Microsoft), precisely those building the agents and their interfaces. The Commission imposed its first fines on 22 and 23 April 2025: **€500 million** to Apple for practices restricting the referral of users out of its App Store, and **€200 million** to Meta for its "consent or pay" model, judged contrary to the obligation to offer a less data-hungry alternative. These decisions show that an agent's ability to steer, compare and conclude a transaction will be read against the rules on lock-in and consent.

On antitrust, the case United States v. Google sets the bounds. After ruling in August 2024 that Google held an illegal monopoly on search and associated text advertising, Judge Amit Mehta handed down on 2 September 2025 behavioural, not structural, remedies: no divestment of Chrome, but a ban on default exclusivity contracts for search, Chrome, Assistant and Gemini, and an obligation to share certain index and usage data with qualified competitors. The final judgment came in December 2025, followed by cross-appeals in early 2026. The lesson is double-edged, and it answers directly the temptation to overestimate platforms' omnipotence: regulation bites, but Google keeps about **90%** of the search market and can keep paying to remain the default engine. Platform power is contested, constrained, but resilient.

## The digital euro, or sovereignty against the programmable dollar

The thesis that "everything will happen in crypto" runs into a blind spot: almost all this crypto is in reality dollars. When 99% of stablecoins are denominated in dollars, the agents' money layer is not neutral, it is dollarised. The European Central Bank seeks to counter this, and this is what gives the digital-euro project its full meaning.

The project's state is documented and dated. On 30 October 2025, the ECB closed its preparatory phase. The official timeline is explicit: if the co-legislators adopt the regulation during 2026, a pilot could start in mid-2027, for a potential first issuance in 2029. The build cost is estimated at around **€1.3 billion**, plus about **€320 million** a year thereafter. In December 2025, Christine Lagarde summed up the situation: the technical work is done, the ball is in the political camp. She presents the digital euro, a central-bank digital currency (CBDC), as a sovereignty tool reducing dependence on Visa, Mastercard or dollar stablecoins. The private sector is not waiting: a consortium of about ten banks (including BNP Paribas, ING and UniCredit), Qivalis, is preparing a euro stablecoin. These worries surface even in the licensing files, as illustrated by the [tug-of-war over Binance's MiCA registration](/en/analysis/binance-mica-and-the-ecb/).

The objection to formulate is not ideological, it is factual. A private dollar stablecoin and a euro CBDC answer to different functions and balances of power. The real question: who controls the unit of account in which agents will settle their transactions? As long as the answer stays the dollar, via private American issuers, the neutrality promise of the agentic layer remains partial. An infrastructure can be technically decentralised and monetarily very centralised.

## Trust as an asset: alignment becomes the product

In a world where AIs decide for us, the first criterion is no longer relevance, it is alignment. An agent that recommends a choice because a company paid behind the scenes is no longer a tool, it is a Trojan horse. For a player like Google, switching to agents that answer directly would amount to eating into the advertising machine that generates almost all its revenue, hence the temptation of an in-between, discreetly biased results. The tool's credibility collapses precisely there, and that is why Chaudhary and Penn's warning is worth as much as the promoters' promises.

The intention economy diverges here from the attention economy without replacing it. In the latter, friction is profitable; in the former, value resides in the absence of friction and in trust. If the agent refers nowhere, the only thing you really buy is its neutrality. But two safeguards impose themselves. An open standard is not a neutral standard: MCP, A2A and x402 are governed by foundations co-founded by the same giants they are supposed to discipline, and open code moves the ground of capture toward governance. And methodological transparency has a discoverability cost: a site that refuses trackers and aggressive SEO sends fewer signals to the engines. In the attention web, this cleanliness is a penalty; in the intention web, it becomes an asset only if agents really value verifiability, with no guarantee that they do.

The innovator's dilemma, formalised by Clayton Christensen, illuminates the final bet. A dominant company rarely dies from poor management, but because it clings to the profitable model that made its success and misses the next turn. If the giants refuse to sacrifice their advertising annuity to guarantee agentic neutrality, they will be challenged by players with a different native model. But challenged does not mean replaced: Visa, Mastercard, Google and OpenAI are moving into the agentic payment layer precisely so as not to be disintermediated. The most probable scenario is not the death of the incumbents, it is their mutation, with all the biases it will seek to preserve.

## Concrete uses for an independent publisher

There remains the operational landing. For a technical watch crossing raw data (SEC, FRED, on-chain) without depending on a closed proprietary tool, the switch opens immediate levers, without waiting for 2029.

Take back control of the crawl, first. A default block of AI bots, and if needed an access price via a Pay Per Crawl-type setup, turns content scraping from a suffered cost into a contractual relationship. The financial lever stays weak for a small site, but the information lever, knowing who scrapes what and to what end, is real.

Expose your data via an MCP server, next. Rather than hoping for good ranking by an engine tailored for mainstream finance, a publisher publishes an MCP server that cleanly delivers its datasets to agents. You no longer chase ranking, you become a source that agents call directly, like Perplexity's Comet Plus model, which pays for the citation and not the click.

Monetise the resolution rather than the audience, finally. A paid endpoint in x402, a few cents in stablecoin per request and with no account creation, lets you charge a computation, a cross-referencing of sources or a verified datum to the agent that needs it. Prudence stays in order. These setups are young: Pay Per Crawl is in beta, x402 just turned one. Security must come first: exposing an MCP server or a paid endpoint opens an attack surface, and the IETF draft itself devotes a whole section to this question. Mass usage is not there: about 4% of consumers delegate a purchase to an AI, and the GDPR strictly frames automated decisions.

The attention economy, funded by advertising, does not disappear: it re-installs itself into the AI interfaces, as shown by advertising in ChatGPT and in Gemini. Alongside it, fragmented intention economies are being built, where you pay to solve a precise problem. The switch is technically under way, the protocols exist, the 402 code is resurrected. It remains economically embryonic, legally framed, monetarily dollarised, and backed by a prediction promise that research invites us to view with suspicion. The players able to embody a verifiable neutrality have won nothing in advance, but they now play on a field where this neutrality is starting to have a market value.

---

**Primary sources:** Y. Chaudhary and J. Penn, "Beware the Intention Economy: Collection and Commodification of Intent via Large Language Models", Harvard Data Science Review (30 December 2024); D. Searls, Linux Journal (March 2006) and The Intention Economy (2012); Pew Research Center, "Google users are less likely to click on links when an AI summary appears" (22 July 2025, 900 adults, ≈ 69,000 searches); Adobe Analytics / Adobe Digital Insights (March 2025 to March 2026, conversion, time spent and AI traffic in retail); Federal Reserve, FEDS Notes (8 April 2026, stablecoins); ECB and Banque de France (close of the preparatory phase, 30 October 2025; 2027-2029 timeline); CoinDesk (C. Lagarde, 18 December 2025); WPP Media (Dec 2025), Dentsu (Dec 2025), GroupM (EOY 2024), Statista (2025); official Cloudflare blog and *Nieman Lab* (Pay Per Crawl, 1 July 2025); Coinbase (x402 white paper, May 2025), *The Defiant* and BlockEden (x402 Foundation); Model Context Protocol Blog and Linux Foundation (MCP, A2A); IETF, draft-zeng-mcp-network-mgmt-01 (16 October 2025); Digital Commerce 360, Mastercard and Visa (Intelligent Commerce, Agent Pay, Instant Checkout); Digiday and Bloomberg (Perplexity Comet Plus); OpenAI and Reuters (ChatGPT audience and advertising); Amazon Q4 2025 results (Rufus, Buy for Me, February 2026); European Commission (DMA fines, 22-23 April 2025); GDPR, Article 22; United States v. Google, Judge A. Mehta decisions (August 2024, 2 September 2025, final judgment December 2025); American Dialect Society and Macquarie Dictionary ("enshittification"). The stablecoin aggregates and transfer volumes are orders of magnitude, distinct from real payments; the Adobe data are specific to US retail and not generalisable.
