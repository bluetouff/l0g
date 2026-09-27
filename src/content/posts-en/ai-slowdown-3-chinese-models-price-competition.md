---
title: "Chinese models and the price of an AI lead"
seoTitle: "Chinese models and the price of an AI lead | l0g"
description: "Kimi inside Cursor, Qwen licences and DeepSeek prices: how credible alternatives can influence pricing. The cost of useful work and the right to switch models."
pubDate: "2026-09-27T14:07:52+02:00"
tags: ["AI", "open weights", "competition", "China", "digital economy"]
draft: false
ogImage: "/illustrations/news/ia-modeles-chinois-concurrence-v1.jpg"
sourceArticle: "ia-ralentissement-3-modeles-chinois-prix-concurrence"
sourceUpdatedDate: "2026-09-27T14:07:52+02:00"
---

*The price of slowing down · Part 3*

A developer opens Cursor, asks the assistant to change some code and waits for something that works. Part of the technology behind that product comes from China. In its March 27, 2026 technical report, Cursor explains that it built Composer 2 on **Kimi K2.5**, then continued training the model and adapting it to its own environment. Its Composer 2.5 page still identifies that same base. [Cursor technical report](https://cursor.com/blog/composer-2-technical-report); [Composer product page](https://cursor.com/composer).

That relationship changes the competitive picture. A Chinese model can replace an American offering for some tasks. It can also become a component of a product that sells its own subscription. The company training the original model, the operator running the computers and the business owning the customer relationship need not be the same.

On September 10, 2026, DeepSeek launched **V4.1 Flash**, offering downloadable weights alongside paid remote access. Its prices and licence make it possible to examine how a Chinese alternative can become part of a competing product’s value chain. [DeepSeek announcement](https://deepseek.com/en/news/deepseek-v4-1-flash/).

For companies advocating a slower pace of development at the frontier, this raises a specific economic question: **how much will customers keep paying for an advantage they do not always need?** The answer depends on the work the model can do, the right to use an alternative and the cost of switching. No general leaderboard captures all three.

## Someone else’s model can become your product

A model’s *weights* are the numerical parameters learned during training. Where the licence permits it, downloading them makes it possible to run the model away from its original developer and adapt it. The files do not necessarily include all the data and procedures needed to reproduce it. The [Open Source Initiative’s definition](https://opensource.org/ai/open-source-ai-definition) requires more than access to parameters for an AI system to qualify as open source.

The economic change is still substantial. The original developer is no longer necessarily the only company able to sell execution of the model. A hosting provider can supply computing capacity, an integrator can build the application, or a customer can operate a deployment. Each adds a service or takes responsibility for a constraint. Free access to the weights does not make running them free.

Cursor illustrates where the value can move. Its report describes further training, tools and environments built around use inside its software. This is more than renaming a model. The customer also buys a way of working with code and tools. Public documents do not isolate the margin attributable to the Kimi base or establish how much Cursor saved relative to training an entirely original model. [Cursor report](https://cursor.com/blog/composer-2-technical-report).

Openness can therefore reduce a model developer’s pricing power while strengthening an application that users like. Competitive advantage may shift towards integration, distribution or service. It does not necessarily vanish.

## The licence determines who can sell what

The contract attached to the download matters. **Chinese models do not share a single licence.** DeepSeek V4.1 Flash uses the [MIT licence](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash/raw/main/LICENSE), allowing commercial use and redistribution subject to its notice requirements. The [Qwen3.8-27B repository](https://huggingface.co/Qwen/Qwen3.8-27B) identifies Apache 2.0. Those terms cannot be assumed to cover every model carrying the Qwen name.

The [Qwen3.8-Flash-Next licence](https://huggingface.co/Qwen/Qwen3.8-Flash-Next/raw/main/LICENSE) requires a separate agreement before commercial use when the licensee, or an affiliate, operates certain model-service or AI work-assistant businesses. Its exception covers strictly internal use, without making the model, its outputs or its capabilities available to third parties. Contractual definitions narrow the affected activities, including standalone assistants primarily for coding or office work. Financial terms for the separate agreement remain unknown.

That is a material difference. A team can possess the files and have the technical ability to run them without enjoying the same commercial rights as under a permissive licence. Access to the model and access to the market built around it need separate checks.

Kimi offers a different example. Its [modified MIT licence](https://huggingface.co/moonshotai/Kimi-K2.5/blob/main/LICENSE) adds a branding requirement above specified audience or revenue thresholds. That is not the separate commercial-agreement requirement in the Qwen text. None of these observations establishes that any particular user has breached its licence.

These differences call for examining each supplier and product. Broad distribution may support hosted services, brand recognition or a wider ecosystem. The licences reviewed reflect distinct commercial choices.

## Two tests, two different performance gaps

Then there is performance. DeepSeek’s comparison table reports **74.2%** for V4.1 Flash on DeepSWE v1.1, against **74.0%** for Opus 5.0. On Terminal-Bench 4.0, the figures are **31.2% and 51.8%**, respectively. DeepSeek’s instruct-model results use its maximum reasoning-effort setting. These are the supplier’s figures; l0g has not reproduced them. [Model card](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash).

<figure class="infographic" style="max-width:33rem;margin:2rem auto;padding-bottom:1rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 420" role="img" aria-labelledby="ai-models-en-bench-title ai-models-en-bench-desc" style="width:100%;height:auto" font-family="Arial, Helvetica, sans-serif">
<title id="ai-models-en-bench-title">The task changes the comparison</title>
<desc id="ai-models-en-bench-desc">Results published by DeepSeek, accessed September 27, 2026. DeepSWE v1.1, resolved: V4.1 Flash 74.2%, Opus 5.0 74.0%. Terminal-Bench 4.0, pass@1: V4.1 Flash 31.2%, Opus 5.0 51.8%. Four bars on one 0–100% scale. Not independently reproduced.</desc>
<rect x="0" y="0" width="500" height="420" rx="6" fill="var(--color-surface)"/>
<text x="24" y="34" font-size="24" font-weight="700" text-anchor="start" fill="var(--color-paper)">The task changes the comparison</text>
<rect x="24" y="56" width="16.000000" height="16" fill="var(--color-signal)"/>
<text x="48" y="70" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-paper)">V4.1 Flash</text>
<rect x="260" y="56" width="16.000000" height="16" fill="var(--color-accent)"/>
<text x="284" y="70" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-paper)">Opus 5.0</text>
<text x="24" y="108" font-size="22" font-weight="700" text-anchor="start" fill="var(--color-paper)">DeepSWE v1.1 · resolved</text>
<rect x="24" y="122" width="296.800000" height="22" fill="var(--color-signal)"/>
<text x="476" y="141" font-size="22" font-weight="700" text-anchor="end" fill="var(--color-signal)">74.2%</text>
<rect x="24" y="160" width="296.000000" height="22" fill="var(--color-accent)"/>
<text x="476" y="179" font-size="22" font-weight="700" text-anchor="end" fill="var(--color-accent)">74.0%</text>
<rect x="24" y="260" width="124.800000" height="22" fill="var(--color-signal)"/>
<text x="476" y="279" font-size="22" font-weight="700" text-anchor="end" fill="var(--color-signal)">31.2%</text>
<rect x="24" y="298" width="207.200000" height="22" fill="var(--color-accent)"/>
<text x="476" y="317" font-size="22" font-weight="700" text-anchor="end" fill="var(--color-accent)">51.8%</text>
<text x="24" y="246" font-size="22" font-weight="700" text-anchor="start" fill="var(--color-paper)">Terminal-Bench 4.0 · pass@1</text>
<path d="M24 352H424 M24 348V356 M124 348V356 M224 348V356 M324 348V356 M424 348V356" fill="none" stroke="var(--color-muted)" stroke-width="2"/>
<text x="24" y="382" font-size="20" font-weight="400" text-anchor="middle" fill="var(--color-muted)">0</text>
<text x="124" y="382" font-size="20" font-weight="400" text-anchor="middle" fill="var(--color-muted)">25</text>
<text x="224" y="382" font-size="20" font-weight="400" text-anchor="middle" fill="var(--color-muted)">50</text>
<text x="324" y="382" font-size="20" font-weight="400" text-anchor="middle" fill="var(--color-muted)">75</text>
<text x="424" y="382" font-size="20" font-weight="400" text-anchor="middle" fill="var(--color-muted)">100</text>
<text x="250" y="409" font-size="20" font-weight="400" text-anchor="middle" fill="var(--color-muted)">Percent · common scale</text>
</svg>
<figcaption>Source: <a href="https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash">DeepSeek V4.1 Flash, 2026-09-27</a>. Supplier results; original versions and metrics retained. Pass@1 means success on the first attempt. DeepSeek specifies reasoning effort 100 for Instruct, mini-SWE for DeepSWE and its Minimal harness with a one-million-token context for agentic coding tests. This is not an up-to-date ranking of all models.</figcaption>
</figure>

Changing the task changes the comparison substantially. The reported 0.2-point DeepSWE gap provides too little information to establish a statistically significant difference. The chart retains the source’s model versions and is limited to these two tests.

A *benchmark* consists of tasks and a method for scoring them. A business needs a different acceptance test: its own documents, difficult cases, deadlines and tolerance for mistakes. Reliable performance on a narrow task may be enough to make a model a commercial substitute. A weakness on an infrequent but expensive operation may have the opposite effect.

The July 2024 paper [*AI Agents That Matter*](https://arxiv.org/abs/2407.01502) already identified problems with comparisons that emphasise success without properly accounting for cost. The principle remains useful. An agent can improve its score by making more attempts, calling more tools or adding checks. What it consumes to obtain the answer matters.

Even the distance between “open” and “closed” models depends on the measure. Epoch estimated an average frontier lag of around **four months** on its capability index over **January 1 to May 28, 2026**. That finding does not describe every task or specifically measure China against the United States. Nor is it a forecast of the catch-up time in September. Epoch also warns that unreleased closed models fall outside the measurement, potentially understating the gap. [Epoch analysis, May 29](https://epoch.ai/data-insights/open-closed-eci-gap).

A measured lead can be real and still offer little value to a particular buyer. A premium has to buy an improvement the customer actually receives.

## From token prices to the actual bill

DeepSeek’s pricing provides a concrete starting point. On September 27, V4.1 Flash lists **$0.15 per million uncached input tokens and $0.60 per million output tokens off-peak**, rising to **$0.30 and $1.20 at peak times**. Cached input, which reuses input material, has separate rates. Peak periods are defined in UTC from 01:00 to 04:00 and 06:00 to 10:00 UTC, Monday to Friday excluding Chinese public holidays. [Official pricing](https://api-docs.deepseek.com/quick_start/pricing/).

A token is a unit of text processed by the model, not a completed task. A hypothetical workload containing **10 million uncached input tokens and one million output tokens** would cost **$2.10 off-peak or $4.20 at peak rates**. That calculation assumes no difference in answer quality between the two time periods. It excludes external tools, human corrections and other charges.

The supplier’s margin and production costs remain unknown. Posted tariffs describe what customers are charged; the offer’s profitability and financing remain open questions.

Comparing services also requires comparing the same work. Equal token counts do not guarantee identical amounts of text, let alone equivalent results. Repeated attempts and verification can quickly consume the saving on each call.

## Simulation: the cost of checking the work

Consider an **entirely hypothetical example**. Two processing workflows each deliver **1,000 final tasks accepted to the same quality standard**. Computing charges include every model call needed to complete those tasks. Average human time includes checking and correction. Neither workflow represents a named model, Chinese or American.

Workflow A uses **$0.04 of computing per task** but requires **two minutes of human work**. Workflow B uses **$0.20 of computing** and requires **thirty seconds**. At an assumed labour cost of **$30 an hour**, A costs **$1,040** for the 1,000 tasks; B costs **$450**.

<figure class="infographic" style="max-width:33rem;margin:2rem auto;padding-bottom:1rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 420" role="img" aria-labelledby="ai-models-en-cost-title ai-models-en-cost-desc" style="width:100%;height:auto" font-family="Arial, Helvetica, sans-serif">
<title id="ai-models-en-cost-title">When checking costs more</title>
<desc id="ai-models-en-cost-desc">Hypothetical simulation, 1,000 accepted tasks at the same quality. A: computing $40, human work $1,000, total $1,040. B: computing $200, human work $250, total $450. Labour costs $30/hour; two minutes per task for A, thirty seconds for B. Stacked bars from $0 to $1,200.</desc>
<rect x="0" y="0" width="500" height="420" rx="6" fill="var(--color-surface)"/>
<text x="24" y="34" font-size="24" font-weight="700" text-anchor="start" fill="var(--color-paper)">When checking costs more</text>
<text x="24" y="68" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-muted)">Simulation · 1,000 accepted tasks</text>
<rect x="24" y="89" width="16.000000" height="16" fill="var(--color-signal)"/>
<text x="48" y="104" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-paper)">Computing</text>
<rect x="260" y="89" width="16.000000" height="16" fill="var(--color-accent)"/>
<text x="284" y="104" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-paper)">Human work</text>
<text x="24" y="148" font-size="22" font-weight="700" text-anchor="start" fill="var(--color-paper)">Workflow A</text>
<text x="476" y="148" font-size="22" font-weight="700" text-anchor="end" fill="var(--color-paper)">$1,040</text>
<rect x="24" y="164" width="13.333333" height="26" fill="var(--color-signal)"/>
<rect x="37.333333333333336" y="164" width="333.333333" height="26" fill="var(--color-accent)"/>
<text x="24" y="217" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-muted)">Computing $40 + human $1,000</text>
<text x="24" y="252" font-size="22" font-weight="700" text-anchor="start" fill="var(--color-paper)">Workflow B</text>
<text x="476" y="252" font-size="22" font-weight="700" text-anchor="end" fill="var(--color-paper)">$450</text>
<rect x="24" y="268" width="66.666667" height="26" fill="var(--color-signal)"/>
<rect x="90.66666666666667" y="268" width="83.333333" height="26" fill="var(--color-accent)"/>
<text x="24" y="321" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-muted)">Computing $200 + human $250</text>
<path d="M24 354H424 M24 350V358 M224 350V358 M424 350V358" fill="none" stroke="var(--color-muted)" stroke-width="2"/>
<text x="24.0" y="384" font-size="20" font-weight="400" text-anchor="middle" fill="var(--color-muted)">0</text>
<text x="224.0" y="384" font-size="20" font-weight="400" text-anchor="middle" fill="var(--color-muted)">600</text>
<text x="424.0" y="384" font-size="20" font-weight="400" text-anchor="middle" fill="var(--color-muted)">1,200</text>
<text x="250" y="409" font-size="20" font-weight="400" text-anchor="middle" fill="var(--color-muted)">US dollars · common scale</text>
</svg>
<figcaption>l0g simulation, assumptions set September 27, 2026. Computing per task: A = $0.04, B = $0.20. Human work: A = 2 minutes, B = 30 seconds, at $30/hour. Computing includes all calls and retries; fixed costs, migration and losses are excluded. Neither workflow represents a supplier. Formulas and the 19.2-second threshold are explained in the text.</figcaption>
</figure>

A’s computing costs one fifth as much as B’s. Its modelled variable cost is nevertheless higher because labour dominates this example. **Just 19.2 extra seconds of checking per task would absorb the 16 cents saved on computing.** Calculation: (0.20 − 0.04) ÷ (30 ÷ 3,600) = 19.2 seconds. That threshold follows solely from the stated assumptions.

The reverse is also possible. When both workflows require the same human intervention, A retains its price advantage. Where a task can be checked automatically at low cost, trying a cheaper model first may make sense. The calculation must still include the checker’s cost and the errors it misses.

The example does not justify a premium subscription as a matter of principle. It identifies what a buyer would need to measure before accepting or rejecting it. Fixed deployment and migration costs, incidents and the consequences of mistakes are outside the illustration. A business must bring them back into its decision.

Competition becomes substantial when an alternative supplier can demonstrate this all-in cost on the customer’s actual work. At that point, failing to top a general leaderboard no longer excludes it from the negotiation.

## Making the exit option usable

Downloadable weights create an exit option. Making that option usable takes work. A customer may need to adapt its document formatting, tool calls, controls and regression tests, which check that a change has not broken something that previously worked. A compatible interface reduces some connection work. It does not establish identical behaviour.

Running a deployment internally introduces another question: who pays for the hours when the machines sit idle? Spreading an installation across many tasks can lower its average cost. Buying enough capacity for an occasional peak can do the opposite. A model licence with no royalty does not remove the machines, their operation or the skills needed to maintain them.

The buyer must also separate costs already committed from spending that can still be avoided. Switching models does not necessarily recover a prepaid computing contract or cancel a consumption commitment. A lower theoretical cost for the next request can coexist with an unchanged contractual bill.

The FTC documented this dependence in its **January 2025** report: spending commitments with investors and potential switching costs featured in the cloud–AI partnerships it examined. Its analysis uses information available through January 2025 and describes agreements from that period. [FTC publication](https://www.ftc.gov/news-events/news/press-releases/2025/01/ftc-issues-staff-report-ai-partnerships-investments-study).

A credible alternative can still be valuable before a migration happens. When the incumbent knows that its customer can leave on reasonable terms, bargaining power changes. A downloadable model that remains difficult to integrate provides a much weaker threat of departure.

## Chinese weights can fill American data centres

AWS announced **DeepSeek R1** availability on **January 30, 2025**, updating the announcement on **March 10, 2025** to include fully managed access. This historical example specifically concerns R1. It illustrates how an American company can sell hosting for a Chinese model. [AWS announcement](https://aws.amazon.com/blogs/aws/deepseek-r1-models-now-available-on-aws/).

The origin of the model is therefore not enough to locate either revenue or data. The operator processing requests may be separate from the developer supplying the weights. Application settings, network connections and provider commitments determine where information actually goes.

In a genuinely isolated deployment, processing a request does not require sending it back to the model’s creator. That is not a blanket security guarantee. The runtime software, external services, permissions and logs still need inspection. Downloading parameters is neither an audit of the software that loads them nor complete knowledge of the training data.

Model behaviour, data destinations and permission to take actions require separate checks. Their importance emerges in [part two, on AI agent incidents](/en/analysis/ai-slowdown-2-what-agents-actually-did/). The location of the hosting infrastructure alone settles none of these questions.

Economically, this separation helps explain why openness can appeal to some major technology suppliers. A cheaper model may make more applications viable, increase usage and leave a market for hosting. That is a plausible mechanism. The documents cited do not measure its net effect on AWS or the industry as a whole.

## Diverging American business interests

The [joint letter on open weights](https://www.microsoft.com/en-us/corporate-responsibility/topics/open-weight/), published on July 24, is an important counterpoint to the idea of a single industrial front. The signatory list consulted on September 27 includes Microsoft, Google, Amazon, Meta, NVIDIA and OpenAI. This does not establish that every one of them signed the initial version. The companies present openness as beneficial to competition and user control. Those are their arguments, not independent findings covering every risk.

An accelerator manufacturer, a cloud operator and a laboratory selling access to its own model need not favour the same price level. Some may benefit from cheaper models while others lose revenue per request. One business can occupy several positions and balance their interests. Its “American” label alone does not establish a single economic objective.

On **July 27**, Anthropic stated that it was not seeking a blanket ban on open-weight models. It supports restrictions on advanced chips, action against unauthorised industrial-scale distillation and mandatory testing of sufficiently capable models, both open and closed. Those specific proposals should be examined rather than replacing them with the blanket-ban demand it disputes. [Anthropic’s published position](https://www.anthropic.com/news/position-open-weights-models).

In his [essay on slowing the frontier](https://darioamodei.com/post/we-must-pace-the-frontier), Dario Amodei explicitly links the scope for moderating capability growth to preserving a lead for the United States and its allies. That strategic objective is part of his security argument. The commercial effects of the proposed rules need examining separately from his stated intentions.

An economic investigation should examine effects. Would an obligation depend on measured capabilities, the way a model is released or its country of origin? Who could obtain an assessment, and at what cost? Would a small integrator face the same requirements as the company that trained the model? The answers would shape opportunities to enter the market.

## Matching the rule to the problem

*Distillation* trains a model using another model’s answers or behaviour. It can be authorised, for example when a company distils its own model. Anthropic acknowledges this in its [explanation of the technique and its allegations](https://www.anthropic.com/news/detecting-and-preventing-distillation-attacks).

On **February 23, 2026**, however, Anthropic accused DeepSeek, Moonshot and MiniMax of conducting unauthorised campaigns through fraudulent accounts. These are the company’s allegations about use of its service. The material reviewed does not allow a complete independent audit of attribution or an estimate of how much the alleged activity contributed to the final models’ training. [Anthropic’s account](https://www.anthropic.com/news/detecting-and-preventing-distillation-attacks).

The remedy depends on the problem established: fraudulent accounts, usage rights or dangerous capabilities. Each requires a justification and measures matched to its scope. Extending an allegation of service abuse to all open models would skip that analysis.

A genuine security difference remains to be examined. Once weights have been released and copied, their creator can no longer withdraw every copy or supervise every use. The **NTIA’s July 2024 report** recommended gathering evidence on risks and adjusting measures if heightened risks emerged. That historical framework does not settle the risks of a September 2026 model. [NTIA analytical framework](https://www.ntia.gov/programs-and-initiatives/artificial-intelligence/open-model-weights-report).

Two points can therefore stand together. Openness can give customers more control and more alternatives; it can also limit some interventions available to the original developer. Their significance depends on the model, its uses and the protections actually available.

## A technical lead still needs a buyer

The evidence makes the competitive pressure from Chinese models more precise. **It starts when an alternative is usable, commercially permissible and reliable enough for work that generates revenue.** It need not wait for every gap with frontier research to disappear.

That pressure does not mean AI revenue must collapse. If a price halves, doubling volume is arithmetically enough to preserve the corresponding revenue. It does not automatically preserve profit: the extra service must be supplied, and the higher volume may go to another company. The interests of a model developer, distributor and hosting provider can diverge.

A slowdown has no single competitive effect either. If one company temporarily produced fewer advances while alternatives continued improving, the value of its lead could shrink. If obligations instead made those alternatives more expensive or less accessible, they could preserve some incumbents’ pricing power. These are conditional scenarios, not an established causal account of the present situation.

The debate introduced in [part one, on who gets to keep building AI](/en/analysis/ai-slowdown-1-who-gets-to-keep-building/), becomes practical here: which activities would proposed rules make harder, and what safety improvement would follow? Chinese licences deserve the same scrutiny. A public download can coexist with substantial commercial restrictions.

For customers, the final test remains practical. They need work completed correctly, a bill that includes correction and an exit option that extends beyond the download button. **A technical lead retains value where it improves that outcome. Elsewhere, a credible alternative already creates a reason to negotiate its price.**

## Sources

- Cursor, 2026-03-27. [A technical report on Composer 2](https://cursor.com/blog/composer-2-technical-report).
- Cursor, accessed September 27, 2026. [Composer](https://cursor.com/composer).
- DeepSeek, 2026-09-10. [Introducing DeepSeek-V4.1-Flash](https://deepseek.com/en/news/deepseek-v4-1-flash/).
- Open Source Initiative, accessed September 27, 2026. [The Open Source AI Definition](https://opensource.org/ai/open-source-ai-definition).
- DeepSeek, accessed September 27, 2026. [V4.1 Flash: MIT License](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash/raw/main/LICENSE).
- Qwen, accessed September 27, 2026. [Qwen3.8-27B: model card](https://huggingface.co/Qwen/Qwen3.8-27B).
- Qwen, accessed September 27, 2026. [Qwen3.8-Flash-Next: Qwen Community License 1.0](https://huggingface.co/Qwen/Qwen3.8-Flash-Next/raw/main/LICENSE).
- Moonshot AI, accessed September 27, 2026. [Kimi K2.5: modified MIT licence](https://huggingface.co/moonshotai/Kimi-K2.5/blob/main/LICENSE).
- DeepSeek, accessed September 27, 2026. [DeepSeek-V4.1-Flash: model card](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash).
- Kapoor et al., 2024-07-01. [AI Agents That Matter](https://arxiv.org/abs/2407.01502).
- Jack Edwards / Luke Emberson, Epoch AI, 2026-05-29. [Open models lag state-of-the-art closed models by 4 months](https://epoch.ai/data-insights/open-closed-eci-gap).
- DeepSeek, accessed September 27, 2026. [Models & Pricing](https://api-docs.deepseek.com/quick_start/pricing/).
- Federal Trade Commission, 2025-01-17. [FTC Issues Staff Report on AI Partnerships & Investments Study](https://www.ftc.gov/news-events/news/press-releases/2025/01/ftc-issues-staff-report-ai-partnerships-investments-study).
- Amazon Web Services, 2025-01-30. [DeepSeek-R1 models now available on AWS](https://aws.amazon.com/blogs/aws/deepseek-r1-models-now-available-on-aws/).
- Industry signatories / Microsoft hosting, 2026-07-24. [Open Weights and American AI Leadership](https://www.microsoft.com/en-us/corporate-responsibility/topics/open-weight/).
- Anthropic, 2026-07-27. [Our position on open-weights models](https://www.anthropic.com/news/position-open-weights-models).
- Dario Amodei, accessed September 27, 2026. [We Must Pace the Frontier](https://darioamodei.com/post/we-must-pace-the-frontier).
- Anthropic, 2026-02-23. [Detecting and preventing distillation attacks](https://www.anthropic.com/news/detecting-and-preventing-distillation-attacks).
- NTIA, 2024-07-30. [Dual-Use Foundation Models with Widely Available Model Weights Report](https://www.ntia.gov/programs-and-initiatives/artificial-intelligence/open-model-weights-report).

## Method and limitations

This documentary investigation is current to **September 27, 2026**. Supplier announcements, licences and tariffs establish published products, rights and positions. They are not independent verification of performance or production costs. No benchmark, training run, security audit or migration test was conducted for this article. No direct requests for comment were made to the companies.

The two charts show supplier results and an l0g simulation, respectively. The social illustration is conceptual and does not depict actual equipment. The labour-cost example is entirely hypothetical. DeepSeek prices are a US-dollar snapshot, not a market average or a like-for-like quality comparison. Sources from 2024 and 2025 are dated and are not presented as a current inventory of September 2026 contracts. Licences must be checked for the relevant model version and activity; this article is not individual legal advice.
