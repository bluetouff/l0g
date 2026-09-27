---
title: "Slowing AI: who gets to keep building?"
seoTitle: "Slowing AI: who gets to keep building? | l0g"
description: "Accenture will assess Anthropic while helping expand Claude adoption. Costs, evaluator independence and market access behind proposals to slow frontier AI."
pubDate: "2026-09-27T12:11:07+02:00"
tags: ["AI", "competition", "regulation", "Anthropic", "OpenAI", "safety"]
draft: false
ogImage: "/illustrations/news/ia-ralentissement-evaluation-v1.jpg"
sourceArticle: "ia-ralentissement-1-qui-pourra-continuer"
sourceUpdatedDate: "2026-09-27T12:11:07+02:00"
---

<p class="edition-link"><a href="/en/publications/the-price-of-slowing-down/">Read all six parts in the free book The Price of Slowing Down (EPUB).</a></p>

On September 22, 2026, Anthropic launched Claude Opus 5.5. Its published base prices fell from $5 to $4 per million input tokens and from $25 to $20 per million output tokens, compared with Opus 5. Tokens are the fragments of text a model processes. **Both rates fell by 20%.** New releases and price competition were continuing after Dario Amodei’s call to slow advances in AI. [Launch announcement and price table](https://www.anthropic.com/claude-opus-5-5).

Selling a model and setting the research programme for its successor are separate decisions. That makes the scope of the promise essential: **what would slow down, at which threshold, and who would decide that development could continue?**

The published proposals give a growing role to a new intermediary: the safety evaluator working inside a laboratory. On September 18, Anthropic said it would directly fund Accenture’s evaluation work. The companies had already announced a partnership in December 2025 to expand commercial adoption of Claude. [Evaluation announcement](https://www.anthropic.com/news/accenture-embedded-evaluation); [commercial partnership](https://newsroom.accenture.com/news/2025/accenture-and-anthropic-launch-multi-year-partnership-to-drive-enterprise-ai-innovation-and-value-across-industries).

That dual relationship raises a practical question of independence. What safeguards allow an evaluator to scrutinise a product whose sales it also helps develop? Depending on the rules adopted, an assessment could become a sales credential, a customer requirement or a condition of market access.

## Defining the slowdown

Amodei proposes making further capability gains conditional on progress in safety. He envisages coordination between laboratories and, for certain discussions, government mediation or a limited antitrust exemption. These are requests in his [September essay](https://darioamodei.com/post/we-must-pace-the-frontier), part of the broader [debate about AI financing and coordination](/en/analysis/pacing-ai-frontier-capital-politics/).

Better software integration can make an existing model more useful. Conversely, a laboratory can work on a much more capable experimental system before offering it to customers. Commercial releases, training and internal use follow different schedules.

Consider a hypothetical example. An assistant suggests a code change which an employee reviews before applying it. Give the same assistant credentials and write permissions, and it can modify a server directly. Its power to act has increased even if the quality of its answers is unchanged. Removing those permissions, requiring human approval and postponing training of a successor would address different risks.

The voluntary commitments made at the 2024 Seoul summit already considered capabilities, deployment conditions and safeguards. They included forgoing development or deployment when residual risks exceeded the defined thresholds. Implementation needs to be examined at each laboratory. [Seoul commitments, paragraphs I–IV](https://www.gov.uk/government/publications/frontier-ai-safety-commitments-ai-seoul-summit-2024/frontier-ai-safety-commitments-ai-seoul-summit-2024).

The scope of the slowdown also determines its cost. Postponing an expected sale reduces revenue; cancelling an avoidable research expense can preserve cash; retaining a capability for internal use has different consequences again. The calculation depends partly on capacity commitments already signed.

## Assessment costs can shape market entry

A serious assessment can uncover a vulnerability and prevent harm. It can also require spending that is difficult for a new entrant to absorb. An explicit calculation helps explain that mechanism.

In a **wholly hypothetical example**, suppose each provider incurs **€1 million a year in fixed verification costs**. Spread over ten million tasks annually, that is ten cents per task. Spread over one hundred million, it is one cent. The amount illustrates a fixed cost; it is neither an Accenture quotation nor an estimate of actual AI audit costs.

<figure class="infographic" style="max-width:33rem;margin:2rem auto;padding-bottom:1rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 362" role="img" aria-labelledby="ai-slowdown-en-cost-title ai-slowdown-en-cost-desc" style="width:100%;height:auto" font-family="Arial, Helvetica, sans-serif">
<title id="ai-slowdown-en-cost-title">One fixed cost, different scales</title>
<desc id="ai-slowdown-en-cost-desc">Hypothetical simulation: an annual fixed cost of 1 million euros spread over 10 million tasks gives 0.10 euro per task; over 100 million, 0.01 euro. Bars start at zero and their lengths are proportional to cost per task.</desc>
<rect x="0" y="0" width="500" height="362" rx="6" fill="var(--color-surface)"/>
<text x="24" y="34" font-size="24" font-weight="700" text-anchor="start" fill="var(--color-paper)">One fixed cost, different scales</text>
<text x="24" y="68" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-muted)">Simulation: €1m fixed cost per year</text>
<text x="24" y="125" font-size="22" font-weight="400" text-anchor="start" fill="var(--color-paper)">10 million tasks/year</text>
<rect x="24" y="140" width="320" height="28" fill="var(--color-accent)"/>
<text x="366" y="163" font-size="22" font-weight="700" text-anchor="start" fill="var(--color-accent)">€0.10</text>
<text x="24" y="217" font-size="22" font-weight="400" text-anchor="start" fill="var(--color-paper)">100 million tasks/year</text>
<rect x="24" y="232" width="32" height="28" fill="var(--color-signal)"/>
<text x="366" y="255" font-size="22" font-weight="700" text-anchor="start" fill="var(--color-signal)">€0.01</text>
<path d="M24 276H344 M24 272V280 M184 272V280 M344 272V280" fill="none" stroke="var(--color-muted)" stroke-width="2"/>
<text x="24" y="305" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-muted)">0</text>
<text x="184" y="305" font-size="20" font-weight="400" text-anchor="middle" fill="var(--color-muted)">0.05</text>
<text x="344" y="305" font-size="20" font-weight="400" text-anchor="middle" fill="var(--color-muted)">0.10</text>
<text x="24" y="341" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-muted)">Allocated fixed cost: euros per task</text>
</svg>
<figcaption>Source: l0g illustrative calculation, September 2026. Hypothetical annual inputs: €1,000,000 ÷ 10,000,000 tasks = €0.10/task; €1,000,000 ÷ 100,000,000 = €0.01. Variable costs, delays, taxes and safety benefits are excluded. This chart measures no actual supplier.</figcaption>
</figure>

The smaller supplier must recover more from each sale, holding quality and other costs equal. A better product, a specialist offering or savings elsewhere could offset the difference. Credible certification could even help it win a customer who previously preferred an established brand.

The competitive effect therefore depends on how the process is designed. Do requirements vary with risk? Does every minor update trigger a complete reassessment? Can findings be reused across customers? California’s SB 813 specifically calls for limiting duplicate compliance work where practicable and recognising certain equivalent assessments. The details are still to be developed. [Section 8898.1](https://leginfo.legislature.ca.gov/faces/billTextClient.xhtml?bill_id=202520260SB813).

Waiting matters too. A young company might fund a lengthy assessment before earning its first revenue, while an established supplier continues selling existing products. The impact would depend on their cash positions and the time needed to address identified problems. A useful assessment of the policy weighs its cost against the reduction in risk it delivers.

## Accenture’s commercial and evaluation roles

The partnership announced on **December 9, 2025** includes a joint business group to expand enterprise adoption of Claude. The **September 18, 2026** agreement adds embedded evaluators, including specialists from Accenture’s Faculty business. The companies each say they expect to invest **at least $1 billion over five years** in these safety capabilities. These are investment intentions, rather than money already disbursed or a published fee for an audit. [Accenture’s December 2025](https://newsroom.accenture.com/news/2025/accenture-and-anthropic-launch-multi-year-partnership-to-drive-enterprise-ai-innovation-and-value-across-industries) and [September 2026](https://newsroom.accenture.com/news/2026/accenture-and-anthropic-partner-to-build-team-of-embedded-evaluators-at-anthropic) announcements.

Continuous access has a technical purpose. Observing development can reveal incidents and choices that testing only the finished product would miss. The strength of the arrangement then depends on the evaluator’s rights, remuneration and ability to withstand a disagreement.

A letter published by the **AI Evaluator Forum** on September 18 and updated on September 23 calls for evaluators to have no other significant commercial relationships with the laboratories they assess, alongside publication rights and protection against retaliation. Signatories act in a personal capacity. These are proposed conditions, without the force of a legal prohibition on Accenture’s partnership. [Public letter](https://aievaluatorforum.org/initiatives/embedded-evaluation-letter).

SB 813 also distinguishes payment from dependence. Its planned criteria for verification organisations allow reasonable market-rate remuneration, provided it does not depend on the assessment’s outcome. [Section 8898.1](https://leginfo.legislature.ca.gov/faces/billTextClient.xhtml?bill_id=202520260SB813).

The announcements reviewed do not disclose the full contract, its fee schedule or detailed termination provisions. Those terms matter: publishing an adverse conclusion with protected funding offers a different safeguard from relying on renewals at the client’s discretion. A formal separation between teams also leaves questions about their commercial targets and effective authority.

Anthropic says the agreement is **non-exclusive**, envisages multiple evaluators and retains responsibility for its models. Its June framework had already proposed public or pooled funding and safeguards against choosing the most accommodating assessor. It also rejected automatic immunity arising from compliance with a federal framework. These proposals describe a policy direction; the partnership’s publicly available terms are less detailed. [Announcement](https://www.anthropic.com/news/accenture-embedded-evaluation); [June framework, pages 4–5 and 8](https://www-cdn.anthropic.com/files/4zrzovbb/website/0a58d567024a8b448ff15158ebc3625328dfcc1f.pdf).

Other funding arrangements exist. METR says it does not receive funding from frontier laboratories, while benefiting from substantial free usage credits. [August 14 funding update](https://metr.org/blog/2026-08-14-funding-update/). Its [May report on a February–March exercise](https://metr.org/blog/2026-05-19-frontier-risk-report/) also shows why publication rights need close attention: participants could withdraw silently before approving information about themselves, but had no approval rights over the final report. That earlier exercise is separate from the Accenture agreement.

## Who would control access to the market?

The major laboratories propose different institutional arrangements. On **July 14**, Demis Hassabis advocated a federally supervised standards body financed mainly by industry. After a voluntary phase, covered models would have to pass an assessment before deployment in the United States. Coverage would depend on frontier capabilities, regardless of origin or whether a model was open or closed; less capable models would be exempt. [Hassabis’s proposal](https://demishassabis.substack.com/p/a-framework-for-frontier-ai-and-the-dawning-of-a-new-age).

[OpenAI’s June blueprint, page 6](https://cdn.openai.com/pdf/25752ecb-0e5c-47f9-b9e4-c0f4d76f8d3d/a-blueprint-for-a-federal-framework.pdf), proposes mandatory government evaluation once the Center for AI Standards and Innovation, or CAISI, has the necessary resources. The centre would recommend safeguards, without authority to approve or block deployment. The decision and responsibility would remain with the developer. Missing the statutory assessment deadline could even allow a release to proceed. **This is a policy proposal.**

<figure class="infographic" style="max-width:33rem;margin:2rem auto;padding-bottom:1rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 362" role="img" aria-labelledby="ai-slowdown-en-gate-title ai-slowdown-en-gate-desc" style="width:100%;height:auto" font-family="Arial, Helvetica, sans-serif">
<title id="ai-slowdown-en-gate-title">Who decides after the test?</title>
<desc id="ai-slowdown-en-gate-desc">Two 2026 proposals. Under the Hassabis framework, after a voluntary phase, passing the test would condition US market access for covered models. OpenAI proposes mandatory CAISI assessment informing a decision that remains with the developer, without a CAISI veto. Neither proposal is presented here as an enacted requirement.</desc>
<rect x="0" y="0" width="500" height="362" rx="6" fill="var(--color-surface)"/>
<text x="24" y="34" font-size="24" font-weight="700" text-anchor="start" fill="var(--color-paper)">Who decides after the test?</text>
<text x="24" y="66" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-muted)">Two proposals, June–July 2026</text>
<text x="128" y="111" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-accent)">Hassabis</text>
<text x="372" y="111" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-signal)">OpenAI</text>
<g>
<rect x="24" y="131" width="208" height="56" rx="6" fill="var(--color-surface)" stroke="var(--color-line-strong)"/>
<text x="128.0" y="167.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-accent)">Test passed</text>
</g>
<g>
<rect x="268" y="131" width="208" height="56" rx="6" fill="var(--color-surface)" stroke="var(--color-line-strong)"/>
<text x="372.0" y="167.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-signal)">Assessment</text>
</g>
<path d="M128 195V233 M122 226L128 233L134 226" fill="none" stroke="var(--color-accent)" stroke-width="2"/>
<path d="M372 195V233 M366 226L372 233L378 226" fill="none" stroke="var(--color-signal)" stroke-width="2"/>
<g>
<rect x="24" y="241" width="208" height="72" rx="6" fill="var(--color-surface)" stroke="var(--color-line-strong)"/>
<text x="128.0" y="271.5" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-accent)">US market</text>
<text x="128.0" y="298.5" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-accent)">access</text>
</g>
<g>
<rect x="268" y="241" width="208" height="72" rx="6" fill="var(--color-surface)" stroke="var(--color-line-strong)"/>
<text x="372.0" y="271.5" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-signal)">Developer</text>
<text x="372.0" y="298.5" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-signal)">decides</text>
</g>
<text x="128" y="344" font-size="20" font-weight="400" text-anchor="middle" fill="var(--color-muted)">Pass required</text>
<text x="372" y="344" font-size="20" font-weight="400" text-anchor="middle" fill="var(--color-muted)">No CAISI veto</text>
</svg>
<figcaption>Comparison of proposed authority, without quantitative measurement. Hassabis envisages moving from voluntary review to a market-access condition for frontier models; OpenAI proposes a requirement once CAISI has sufficient resources, with a defined review deadline and responsibility retained by the developer. Sources: <a href="https://demishassabis.substack.com/p/a-framework-for-frontier-ai-and-the-dawning-of-a-new-age">Hassabis, 2026-07-14</a> ; <a href="https://cdn.openai.com/pdf/25752ecb-0e5c-47f9-b9e4-c0f4d76f8d3d/a-blueprint-for-a-federal-framework.pdf">OpenAI, 2026-06, p. 6</a>.</figcaption>
</figure>

Passing the test would condition market access in the first arrangement. In the second, the review would inform a developer’s decision, accompanied by transparency obligations. The evaluator’s authority would differ substantially.

Enacted measures have other scopes. US **Executive Order 14409, dated June 2, 2026**, provides for a voluntary framework to assess cyber capabilities before release. Section 3(c) explicitly excludes creating mandatory government licensing or preclearance under that section. [Executive order](https://www.whitehouse.gov/presidential-actions/2026/06/promoting-advanced-artificial-intelligence-innovation-and-security/).

California’s **SB 813, signed on September 9**, calls for criteria for independent verification organisations to be developed by **January 1, 2028**. Section 8898.4 does not make engaging those organisations a general condition for developing or deploying AI. It also states that an audit can be relevant in litigation over harm without being conclusive on liability. [Signed law](https://leginfo.legislature.ca.gov/faces/billTextClient.xhtml?bill_id=202520260SB813).

These provisions concern the two mechanisms examined here. Other obligations may apply to a system or its use. Assessing a future procedure will require scrutiny of delays, appeals and the availability of evaluators genuinely accessible to new entrants.

## Coordination and competition law

Sharing a useful test can reduce costs and prevent the same vulnerability spreading across products. Agreeing on the pace of product improvement affects a central dimension of competition. The FTC recognises both the potential benefits of cooperation and the risks arising from loss of commercial independence or collective market power. [FTC guidance](https://www.ftc.gov/advice-guidance/competition-guidance/guide-antitrust-laws/dealings-competitors).

A complaint filed on **September 18**, *Buist et al. v. Anthropic et al.*, accuses Anthropic, OpenAI, SpaceXAI and Google of coordinating to restrict innovation. It expressly excludes independently adopted safety measures and legitimate standard-setting that preserves competition. **The complaint sets out the plaintiffs’ allegations; it contains no judicial finding of an unlawful agreement.** [Initial complaint, including paragraphs 150–151](https://storage.courtlistener.com/recap/gov.uscourts.cand.479357/gov.uscourts.cand.479357.1.0.pdf).

Falling prices can coexist with weaker competition on quality. Imagine that efficiency gains allow suppliers to charge less while an agreement postpones improvements: a customer could pay less than yesterday yet receive a less advanced product than under a competitive alternative. Establishing harm would require evidence for that counterfactual and the role of the alleged agreement.

The inquiry therefore concerns what information is exchanged, each company’s freedom to follow its own schedule and the terms offered to outsiders. A request for an antitrust exemption remains a request, whose outcome must be checked separately.

## The lead over China and the place of open models

Amodei presents maintaining the American lead as a condition allowing laboratories to slow down without being overtaken. He advocates restricting access to chips and manufacturing equipment. That is his strategic argument; its effects remain to be assessed. [September essay](https://darioamodei.com/post/we-must-pace-the-frontier).

Restricting a competitor’s compute affects its means of production. Requiring comparable safety safeguards for comparable systems affects market access. These policies may have different beneficiaries and consequences.

**Open-weight models** make their parameters available to download, with permitted uses governed by their licences. Training data and the complete software stack are not necessarily open. In its July 2024 report, the NTIA recommended preserving opportunities from this form of distribution while strengthening risk monitoring. That historical assessment needs revisiting as capabilities evolve. [NTIA report](https://www.ntia.gov/programs-and-initiatives/artificial-intelligence/open-model-weights-report).

A company can buy a hosted service or run a downloadable model itself. If validating the second option became substantially more expensive, it might favour the first: spending and control could move towards the service provider. This is a conditional scenario, related to [the economics of open models](/en/analysis/china-open-source-ai-strategy-vs-capex-bubble/).

Distributing weights also creates a real technical complication. Closing access to a hosted service does not erase copies of files already distributed. The options for corrections after deployment differ with the method of access. [Research on deployment corrections, 2023](https://arxiv.org/abs/2310.00328).

In its **September 9** policy statement, OpenAI calls for frontier safety rules to avoid indirectly restricting open models. It also distinguishes frontier laboratories from small developers operating well below that level of capability. [Public position](https://openai.com/index/ai-policy-window/). The practical issue will be recognising equivalent safeguards, including those supplied by new entrants or outside the United States.

## The financial interests at stake

In its January 2025 study, the FTC documented agreements requiring developers to spend a large share of a cloud provider’s investment on that provider’s services. It highlighted dependencies and switching costs. Internal information extended through September 2024, supplemented by public information through January 2025: that historical finding does not automatically describe contracts in September 2026. [FTC study](https://www.ftc.gov/news-events/news/press-releases/2025/01/ftc-issues-staff-report-ai-partnerships-investments-study).

These relationships, discussed in [our analysis of circular AI financing](/en/analysis/ai-circular-financing/), suggest an economic question: when training is postponed, who loses revenue and who avoids an expense? A laboratory might save a future order while an infrastructure provider loses the sale. Reserved capacity could limit the saving; selling an existing model for longer could prolong its revenue stream.

A compute vendor, a developer, its integrator and the end customer may therefore have different interests. Attributing their conduct to a shared financial motivation would require evidence about contracts and decisions.

**Organising safety oversight is also becoming a question of market access.** Companies building models propose the tests and finance some of the institutions examining them. Independence safeguards already appear in several texts; their contractual implementation and operation remain decisive.

What comes next can be judged through observable decisions. Can an evaluator publish a significant disagreement? Can an outside competitor have an equivalent safeguard recognised? Is a decision to continue or suspend development explained by the results? Those are the points where the slowdown debate could become an effective check on industrial power.

## Sources

- Dario Amodei, 2026-09. [We Must Pace the Frontier](https://darioamodei.com/post/we-must-pace-the-frontier).
- Anthropic, 2026-09-22. [Introducing Claude Opus 5.5](https://www.anthropic.com/claude-opus-5-5).
- Anthropic, 2026-09-18. [Partnering with Accenture on embedded evaluation](https://www.anthropic.com/news/accenture-embedded-evaluation).
- Accenture, 2026-09-18. [Accenture and Anthropic Partner to Build Team of Embedded Evaluators at Anthropic](https://newsroom.accenture.com/news/2026/accenture-and-anthropic-partner-to-build-team-of-embedded-evaluators-at-anthropic).
- Accenture, 2025-12-09. [Accenture and Anthropic Launch Multi-Year Partnership to Drive Enterprise AI Innovation and Value Across Industries](https://newsroom.accenture.com/news/2025/accenture-and-anthropic-launch-multi-year-partnership-to-drive-enterprise-ai-innovation-and-value-across-industries).
- AI Evaluator Forum, 2026-09-18 / 2026-09-23. [Minimum Conditions for Embedding Evaluators](https://aievaluatorforum.org/initiatives/embedded-evaluation-letter).
- UK government / Seoul summit, 2024 / 2025-02-07. [Frontier AI Safety Commitments, AI Seoul Summit 2024](https://www.gov.uk/government/publications/frontier-ai-safety-commitments-ai-seoul-summit-2024/frontier-ai-safety-commitments-ai-seoul-summit-2024).
- METR, 2026-08-14. [Funding update](https://metr.org/blog/2026-08-14-funding-update/).
- Anthropic, 2026-06. [Anthropic’s Advanced AI Framework](https://www-cdn.anthropic.com/files/4zrzovbb/website/0a58d567024a8b448ff15158ebc3625328dfcc1f.pdf).
- Demis Hassabis, 2026-07-14. [A Framework for Frontier AI and the Dawning of a New Age](https://demishassabis.substack.com/p/a-framework-for-frontier-ai-and-the-dawning-of-a-new-age).
- OpenAI, 2026-06-02. [Democratic Governance of Frontier AI: A blueprint for a federal framework](https://cdn.openai.com/pdf/25752ecb-0e5c-47f9-b9e4-c0f4d76f8d3d/a-blueprint-for-a-federal-framework.pdf).
- White House, 2026-06-02. [Executive Order 14409: Promoting Advanced Artificial Intelligence Innovation and Security](https://www.whitehouse.gov/presidential-actions/2026/06/promoting-advanced-artificial-intelligence-innovation-and-security/).
- California Legislature, 2026-09-09. [SB 813, Chapter 179: Independent verification organizations](https://leginfo.legislature.ca.gov/faces/billTextClient.xhtml?bill_id=202520260SB813).
- Federal Trade Commission, accessed September 27, 2026. [Dealings with Competitors](https://www.ftc.gov/advice-guidance/competition-guidance/guide-antitrust-laws/dealings-competitors).
- U.S. District Court, Northern District of California, 2026-09-18. [Buist et al. v. Anthropic et al., Complaint, Doc. 1, 3:26-cv-10693](https://storage.courtlistener.com/recap/gov.uscourts.cand.479357/gov.uscourts.cand.479357.1.0.pdf).
- NTIA, 2024-07-30. [Dual-Use Foundation Models with Widely Available Model Weights Report](https://www.ntia.gov/programs-and-initiatives/artificial-intelligence/open-model-weights-report).
- OpenAI, 2026-09-09. [The AI policy window is open. We need to act.](https://openai.com/index/ai-policy-window/).
- Federal Trade Commission, 2025-01. [FTC Issues Staff Report on AI Partnerships & Investments Study](https://www.ftc.gov/news-events/news/press-releases/2025/01/ftc-issues-staff-report-ai-partnerships-investments-study).
- Joe O’Brien, Shaun Ee, Zoe Williams, 2023-09-30. [Deployment Corrections: An incident response framework for frontier AI models](https://arxiv.org/abs/2310.00328).
- METR, 2026-05-19. [Frontier Risk Report (February to March 2026)](https://metr.org/blog/2026-05-19-frontier-risk-report/).

## Method and limitations

Research current to September 27, 2026. Company announcements describe their positions and stated commitments. Proposals by Amodei, Hassabis, Anthropic and OpenAI are distinguished from the federal executive order and signed California law, whose planned criteria remain to be developed. The complaint is cited as the plaintiffs’ filing, without a conclusion on its merits.

Prices are the published base rates for input and output tokens: (4 ÷ 5 − 1) × 100 = −20% and (20 ÷ 25 − 1) × 100 = −20%. They do not measure the cost of a complete task. The cost chart uses hypothetical inputs. No full Anthropic–Accenture contract, internal audit or confidential data was obtained. NTIA’s official executive summary was read through its indexed content after direct access returned HTTP 403; the FTC study summary was checked through its official search.ftc.gov mirror. Sources from 2023–2025 explain historical mechanisms without validating September 2026 models or agreements.
