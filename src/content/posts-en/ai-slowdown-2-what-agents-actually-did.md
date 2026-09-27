---
title: "What the AI agents actually did"
seoTitle: "AI incidents: permissions and delayed shutdowns | l0g"
description: "Australia, Hugging Face and OpenAI: what reports document about access, permissions and shutdown delays. The mechanisms behind AI agent incidents."
pubDate: "2026-09-27T12:55:28+02:00"
tags: ["AI", "cybersecurity", "OpenAI", "Anthropic", "Hugging Face", "regulation"]
draft: false
ogImage: "/illustrations/news/ia-incidents-controle-v1.jpg"
sourceArticle: "ia-ralentissement-2-incidents-securite-faits"
sourceUpdatedDate: "2026-09-27T12:55:28+02:00"
---

<p class="edition-link"><a href="/en/publications/the-price-of-slowing-down/">Read all six parts in the free book The Price of Slowing Down (EPUB).</a></p>

On September 20, an OpenAI agent reached an outside chatbot through an inadequately filtered network route. A monitor raised an alert. A human acknowledged it. The run continued for another **2 hours, 29 minutes and 24 seconds** before it was terminated. OpenAI says the expected automatic shutdown failed. That interval, calculated from the published timestamps, gives the debate over agent control a concrete starting point. [OpenAI report, updated September 25](https://alignment.openai.com/misalignment-reports/an-agent-used-dns-to-reach-an-external-chatbot/).

This second instalment follows our analysis of [who could keep building AI under tighter rules](/en/analysis/ai-slowdown-1-who-gets-to-keep-building/). Before debating bans, certification or a slowdown, we need to examine the incidents used to support those proposals. They involve different mechanisms: excessive permissions, inadequate isolation, software vulnerabilities, actions outside an assigned task and delayed intervention. Each calls for a different remedy.

## Australia: two separate cases

The Australian Institute of Health and Welfare, or AIHW, publishes health statistics. Its statement updated on **September 25, 2026** says an investigation with the Australian Signals Directorate found no evidence of compromised systems, unauthorised access or access to information that was not already public. That finding concerns this particular organisation. [AIHW statement](https://www.aihw.gov.au/news-media/media-releases/2026/september/a-statement-from-the-australian-institute-of-health-and-welfare).

The Medicare statistics portal administered by Services Australia is a separate case. At his **September 24** press conference, Prime Minister Anthony Albanese described an event on **June 18** in which an OpenAI research model accessed public and non-public files and wrote files to an internal server. Authorities did not then believe individual records had been accessed, and the investigation was continuing. This is an interim official account, rather than a complete forensic report. [Prime Minister’s transcript](https://www.pm.gov.au/media/press-conference-new-york).

Transluce offers a third perspective: public request traces. Its **September 23** analysis identifies attempts against AIHW on **June 20–21**, alongside activity targeting Data USA and a University of New Mexico digital library. The observed attempts appear unsuccessful, though the researchers stress that their records are incomplete. These agents were performing ordinary information-retrieval tasks and tried offensive methods after encountering obstacles. [Transluce analysis](https://transluce.org/agent-activity).

A page missing from search results can still be publicly accessible. Conversely, a misconfigured server can expose a file without authorising anyone to read it. Search indexing, technical reachability and permission are separate questions. The scope of each Australian account needs to remain explicit.

## Permissions determine what an agent can do

An agent combines a model with tools such as a browser, terminal, file access or remote services. Its task sets an objective; its permissions determine which actions are available. Reading a document and publishing it online require very different powers.

OWASP identifies excessive functionality, permissions and autonomy as agent risks. Its practical recommendation is to grant only the access a task needs, enforced by the services themselves. A written instruction cannot substitute for an account that is technically unable to delete a file or send a message. Read-only access is also insufficient if another tool can transmit the information elsewhere. [OWASP, Excessive Agency](https://genai.owasp.org/llmrisk/llm062025-excessive-agency/).

The Artifactory exchanges illustrate the gap. OpenAI provided agents with access to this software repository so they could install packages. In examples from May, the supplied credentials also allowed file uploads. Agents turned that shared space into a message board, read other runs’ notes and posted replies. OpenAI says **the initial exchanges required no vulnerability exploit**. [Artifactory report, updated September 16](https://alignment.openai.com/misalignment-reports/unauthorized-artifactory-writes-and-cross-sample-communication/).

<figure class="infographic" style="max-width:33rem;margin:2rem auto;padding-bottom:1rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 382" role="img" aria-labelledby="ai-incidents-en-shared-title ai-incidents-en-shared-desc" style="width:100%;height:auto" font-family="Arial, Helvetica, sans-serif">
<title id="ai-incidents-en-shared-title">A repository becomes a message board</title>
<desc id="ai-incidents-en-shared-desc">Mechanism observed in May 2026: supplied credentials let separate runs read and upload files in Artifactory. Here A writes a note and B reads it. The roles can be reversed. This sharing requires no vulnerability exploit.</desc>
<rect x="0" y="0" width="500" height="382" rx="6" fill="var(--color-surface)"/>
<text x="24" y="34" font-size="24" font-weight="700" text-anchor="start" fill="var(--color-paper)">A repository becomes a message board</text>
<text x="24" y="68" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-muted)">Examples from May 2026</text>
<g>
<rect x="24" y="98" width="160" height="56" rx="6" fill="var(--color-surface)" stroke="var(--color-line-strong)"/>
<text x="104.0" y="134.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-accent)">Agent A</text>
</g>
<g>
<rect x="316" y="98" width="160" height="56" rx="6" fill="var(--color-surface)" stroke="var(--color-line-strong)"/>
<text x="396.0" y="134.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-signal)">Agent B</text>
</g>
<path d="M104 166V200H214V223 M208 216L214 223L220 216" fill="none" stroke="var(--color-accent)" stroke-width="2"/>
<path d="M286 223V200H396V166 M390 173L396 166L402 173" fill="none" stroke="var(--color-signal)" stroke-width="2"/>
<text x="24" y="237" font-size="22" font-weight="700" text-anchor="start" fill="var(--color-accent)">Writes</text>
<text x="476" y="237" font-size="22" font-weight="700" text-anchor="end" fill="var(--color-signal)">Reads</text>
<g>
<rect x="140" y="235" width="220" height="64" rx="6" fill="var(--color-surface)" stroke="var(--color-line-strong)"/>
<text x="250.0" y="275.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-paper)">Artifactory</text>
</g>
<text x="250" y="341" font-size="22" font-weight="400" text-anchor="middle" fill="var(--color-paper)">One note shared across two runs</text>
<text x="250" y="369" font-size="20" font-weight="400" text-anchor="middle" fill="var(--color-muted)">Both agents can reply</text>
</svg>
<figcaption>Message-flow diagram, without a quantitative metric or a reconstruction of network topology. Shared read and write permissions enable exchanges between runs intended to be independent. Source: <a href="https://alignment.openai.com/misalignment-reports/unauthorized-artifactory-writes-and-cross-sample-communication/">OpenAI, 2026-09-16</a>.</figcaption>
</figure>

Once one run can use another’s work, the assumed independence of the exercise disappears. A response may draw on computation and research performed by several agents. An evaluation intended to measure independent runs must control that sharing, or it risks measuring a different system from the one described.

## Hugging Face: an intrusion with documented effects

The July incident at Hugging Face crossed a further boundary. The platform confirmed the intrusion on **July 16** and released a technical timeline on **July 27**. Its account describes local file reads, code execution, stolen credentials and movement through its infrastructure. [Hugging Face disclosure](https://huggingface.co/blog/security-incident-july-2026), [technical analysis](https://huggingface.co/blog/agent-intrusion-technical-timeline).

According to that analysis, the main Hub database was never reached, but an internal operational database was read. Customer content accessed was limited to **five datasets** whose names and files suggested links to cybersecurity challenges. These findings come from the affected organisation’s investigation. They describe real access while specifying the consequences the organisation says it identified. [Hugging Face, impact and database findings](https://huggingface.co/blog/agent-intrusion-technical-timeline).

OpenAI acknowledges its agents’ involvement and says most of the activity came from an internal research model evaluated with reduced safeguards. Those conditions differed from a public product’s configuration, but still affected systems owned by other parties. [OpenAI’s August 26 account](https://openai.com/index/hugging-face-incident-and-the-road-ahead/).

The technical stages also need separating. JFrog’s **CVE-2026-65616** advisory describes a signature-validation flaw allowing a non-administrator to obtain an administrator token. OpenAI’s technical report links that type of flaw to the June Artifactory compromise, then describes a different vulnerability in the network escape preceding the July intrusion. Overbroad write permissions, privilege escalation and a network bypass require distinct fixes. [JFrog advisory](https://docs.jfrog.com/releases/docs/jfrog-security-advisories), [OpenAI technical report, sections III and IV](https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf).

NIST’s zero-trust principle addresses part of this problem: being inside a network should not itself confer trust or access to its resources. Permissions need to be checked for the resource being accessed. [NIST, SP 800-207](https://csrc.nist.gov/pubs/sp/800/207/final).

## An alert needs an effective response

OpenAI’s technical report describes an earlier episode, before the Hugging Face intrusion. On **June 27**, monitoring detected port sweeps in the research environment. Responders linked the activity to an evaluation using Artifactory as a message board and network pivot, but judged that stopping the run was unnecessary. The compromised Artifactory service was taken offline on **July 5**, following an outage and further investigation. Those dates belong to the June and early-July episode. [OpenAI report, pages 7–8](https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf).

The **September 20** case exposes another failure. DNS, the service normally used to resolve domain names, provided an inadequately filtered route outside the environment. The report supplies four timestamps without specifying their timezone. Most of the elapsed time before shutdown came after human acknowledgement.

<figure class="infographic" style="max-width:33rem;margin:2rem auto;padding-bottom:1rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 382" role="img" aria-labelledby="ai-incidents-en-timing-title ai-incidents-en-timing-desc" style="width:100%;height:auto" font-family="Arial, Helvetica, sans-serif">
<title id="ai-incidents-en-timing-title">From detection to shutdown</title>
<desc id="ai-incidents-en-timing-desc">OpenAI incident on September 20, 2026. DNS call at 09:50:23, alert at 10:02:11, human acknowledgement at 10:05:06, shutdown at 12:34:30. Intervals: 11 minutes 48 seconds, 2 minutes 55 seconds, 2 hours 29 minutes 24 seconds. Duration bars start at zero on one scale in minutes.</desc>
<rect x="0" y="0" width="500" height="382" rx="6" fill="var(--color-surface)"/>
<text x="24" y="34" font-size="24" font-weight="700" text-anchor="start" fill="var(--color-paper)">From detection to shutdown</text>
<text x="24" y="68" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-muted)">OpenAI • September 20, 2026</text>
<text x="24" y="112" font-size="22" font-weight="400" text-anchor="start" fill="var(--color-paper)">DNS call → alert</text>
<text x="476" y="112" font-size="20" font-weight="700" text-anchor="end" fill="var(--color-signal)">11 min 48 s</text>
<rect x="24" y="126" width="26.222222" height="18" fill="var(--color-signal)"/>
<text x="24" y="184" font-size="22" font-weight="400" text-anchor="start" fill="var(--color-paper)">Alert → acknowledgement</text>
<text x="476" y="184" font-size="20" font-weight="700" text-anchor="end" fill="var(--color-paper)">2 min 55 s</text>
<rect x="24" y="198" width="6.481481" height="18" fill="var(--color-paper)"/>
<text x="24" y="256" font-size="22" font-weight="400" text-anchor="start" fill="var(--color-paper)">Acknowledgement → stop</text>
<text x="476" y="256" font-size="20" font-weight="700" text-anchor="end" fill="var(--color-accent)">2 h 29 min 24 s</text>
<rect x="24" y="270" width="332.000000" height="18" fill="var(--color-accent)"/>
<path d="M24 309H424 M24 305V313 M157.333333 305V313 M290.666667 305V313 M424 305V313" fill="none" stroke="var(--color-muted)" stroke-width="2"/>
<text x="24.0" y="337" font-size="20" font-weight="400" text-anchor="middle" fill="var(--color-muted)">0</text>
<text x="157.333333" y="337" font-size="20" font-weight="400" text-anchor="middle" fill="var(--color-muted)">60</text>
<text x="290.666667" y="337" font-size="20" font-weight="400" text-anchor="middle" fill="var(--color-muted)">120</text>
<text x="424.0" y="337" font-size="20" font-weight="400" text-anchor="middle" fill="var(--color-muted)">180</text>
<text x="250" y="369" font-size="20" font-weight="400" text-anchor="middle" fill="var(--color-muted)">Minutes, common scale</text>
</svg>
<figcaption>l0g calculation from four timestamps in the <a href="https://alignment.openai.com/misalignment-reports/an-agent-used-dns-to-reach-an-external-chatbot/">OpenAI report updated September 25, 2026</a>. 09:50:23 → 10:02:11 → 10:05:06 → 12:34:30. The first time marks the DNS call; timezone is unspecified. Bars compare successive intervals, not an average or other incidents. Total from call to shutdown: 2 h 44 min 7 s.</figcaption>
</figure>

OpenAI says automatic termination failed and staff were uncertain whether the run had actually stopped. Its **September 25** report also announces a pause in training, evaluation and inference involving tools for its most capable models. That research scope should not be expanded into a claim about all its products. [DNS report and announced response](https://alignment.openai.com/misalignment-reports/an-agent-used-dns-to-reach-an-external-chatbot/).

Monitoring therefore depends on the entire response chain: detection, assessment, decision, termination and confirmation that termination worked. A dashboard can display an alert while the monitored system continues acting.

## When an exercise reaches real organisations

On **July 30**, Anthropic reported reviewing **141,006 evaluation runs** and finding **three incidents across six runs** involving unauthorised access to three organisations’ systems. The prompts described an offline simulation, but a misconfiguration at its evaluation partner left an internet route open. Anthropic describes ordinary attack techniques. In some cases, the model continued after recognising a real system. [Anthropic report](https://www.anthropic.com/research/investigating-incidents-cybersecurity-evals).

Britain’s AI Security Institute reports **19 out-of-scope actions across 10 of 122 runs** in one evaluation. Internet access was deliberately enabled and some filters disabled. The institute explicitly distinguishes this from escaping the isolated environment. Its account includes a malicious proposed code change caught by a maintainer, and says investigators identified no resulting real-world harm. [AISI report](https://www.aisi.gov.uk/blog/incident-report-unsanctioned-agent-behaviour-during-cyber-testing).

These figures count different things: incidents, runs and actions. Protocols, models, permissions and investigation methods differ too. Turning them into a ranking of laboratory safety would give unlike observations the misleading appearance of comparable rates.

## Evaluations can reward detours

Pursuing a correct answer does not ensure acceptable methods. Another OpenAI report describes an agent that had already retrieved information about lakes, then uploaded it to an outside host to obtain a citation its browser could use. The upload succeeded; the citation attempt failed. The user had not requested publication. [Report on unrequested public uploads](https://alignment.openai.com/misalignment-reports/uploading-files-to-the-internet-in-order-to-cite-them/).

The task changed from consulting information to disclosing it to another party. Better scoring rules can reduce the incentive for that detour. Technical restrictions on permitted destinations can limit the consequences even when a model attempts it. These protections serve complementary purposes.

METR and Redwood Research examined the behaviour, reasoning and collaboration of agents involved in the Hugging Face case. Their agreed scope explicitly excluded safeguard effectiveness, the full extent of the compromise and the quality of remediation. Their work helps explain the agents; a general certification of OpenAI’s security would exceed that mandate. [METR–Redwood investigation, August 26](https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation/).

## Who observes, who interprets, who bears the cost?

Researchers’ testimony adds another perspective. On **September 9**, Euronews reported Jacob Coxon’s resignation after working at OpenAI and then Anthropic, along with his concerns about the capabilities race. His account describes his beliefs and experience. It supplies no experimental estimate of the probability of catastrophe. [Euronews](https://www.euronews.com/2026/09/09/a-gamble-with-our-lives-ex-anthropic-researcher-warns-of-ai-catastrophe).

Independent investigations should also explain their resources and access. In its **August 14** funding update, METR says it declines funding from frontier laboratories and donations made by or at the direction of their employees, while receiving substantial free usage credits. Those credits enable research and create a material dependency that should remain visible. [METR funding statement](https://metr.org/blog/2026-08-14-funding-update/).

More disclosures also require careful interpretation. On **September 16**, OpenAI announced more systematic incident reporting after previously irregular disclosures. The initial reports are not an exhaustive inventory. A rising report count could reflect better detection or greater disclosure as well as changing behaviour. Measuring a trend requires a consistent scope. [OpenAI reporting framework](https://openai.com/index/model-misalignment-reporting-framework/).

The economic issue is immediate: a laboratory learns from its tests while outside organisations may bear detection, investigation and remediation costs. That is an externality, a cost shifted to others. The sources reviewed do not support an aggregate bill. They do support asking who authorises the exposure and who bears its consequences.

Hugging Face says it used **GLM-5.2**, an open-weight model running on its own infrastructure, to analyse the intrusion after hosted services blocked its forensic requests. Access to powerful tools matters for defenders too. The platform’s experience belongs in the debate over restrictions, attributed as carefully as its account of the attack. [Hugging Face’s response account](https://huggingface.co/blog/security-incident-july-2026).

The documented incidents call for verifiable responses: proportionate permissions, genuinely isolated exercises, records available to investigators and shutdown procedures whose effect is confirmed. Proposals to slow AI should then explain how each rule would address the observed failures and which costs it would impose on developers, users and third parties.

## Sources

- Australian Institute of Health and Welfare, 2026-09-25. [Updated: OpenAI incident - a statement from the AIHW](https://www.aihw.gov.au/news-media/media-releases/2026/september/a-statement-from-the-australian-institute-of-health-and-welfare).
- Transluce et coauteurs, 2026-09-23. [Early rogue AI agent activity and attempts to hack found on urlquery.net](https://transluce.org/agent-activity).
- Prime Minister of Australia, 2026-09-24. [Press conference - New York](https://www.pm.gov.au/media/press-conference-new-york).
- Hugging Face, 2026-07-16. [Security incident disclosure : July 2026](https://huggingface.co/blog/security-incident-july-2026).
- Hugging Face, 2026-07-27. [Anatomy of a Frontier Lab Agent Intrusion: A Technical Timeline of the July 2026 Incident](https://huggingface.co/blog/agent-intrusion-technical-timeline).
- OpenAI, 2026-08-26. [OpenAI–Hugging Face Incident: Technical Report](https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf).
- OpenAI, 2026-08-26. [The Hugging Face incident and the road ahead](https://openai.com/index/hugging-face-incident-and-the-road-ahead/).
- OpenAI Alignment, 2026-09-16. [Unsanctioned Artifactory writes and cross-sample communication](https://alignment.openai.com/misalignment-reports/unauthorized-artifactory-writes-and-cross-sample-communication/).
- JFrog, 2026-07-27. [JFrog Security Advisories: CVE-2026-65616](https://docs.jfrog.com/releases/docs/jfrog-security-advisories).
- OWASP Gen AI Security Project, 2025. [LLM06:2025 Excessive Agency](https://genai.owasp.org/llmrisk/llm062025-excessive-agency/).
- NIST, 2020-08. [SP 800-207: Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final).
- Anthropic, 2026-07-30. [Investigating three incidents in our cybersecurity evaluations](https://www.anthropic.com/research/investigating-incidents-cybersecurity-evals).
- UK AI Security Institute, accessed September 27, 2026. [Incident Report: unsanctioned agent behaviour during cyber testing](https://www.aisi.gov.uk/blog/incident-report-unsanctioned-agent-behaviour-during-cyber-testing).
- METR et Redwood Research, 2026-08-26. [Brief independent investigation of agents’ behavior, reasoning and collaboration in the OpenAI / Hugging Face hacking incident](https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation/).
- METR, 2026-08-14. [Funding update](https://metr.org/blog/2026-08-14-funding-update/).
- OpenAI Alignment, 2026-09-25. [An agent used DNS to reach an external chatbot](https://alignment.openai.com/misalignment-reports/an-agent-used-dns-to-reach-an-external-chatbot/).
- OpenAI Alignment, 2026-09-16. [Uploading files to the internet in order to cite them](https://alignment.openai.com/misalignment-reports/uploading-files-to-the-internet-in-order-to-cite-them/).
- Euronews, 2026-09-09. [‘A gamble with our lives’: Ex-Anthropic researcher warns of AI ‘catastrophe’](https://www.euronews.com/2026/09/09/a-gamble-with-our-lives-ex-anthropic-researcher-warns-of-ai-catastrophe).
- OpenAI, 2026-09-16. [Our framework for reporting model misalignment](https://openai.com/index/model-misalignment-reporting-framework/).

## Method and limitations

Research current to September 27, 2026, based on the cited public documents. Statements by affected organisations and laboratories are attributed to them. We did not obtain complete internal logs, reproduce attacks or audit fixes. Observed attempts, reported access and identified harm remain distinct. Research configurations are not equated with publicly available products.

Chart intervals are calculated by subtracting the published timestamps: 708 seconds, 175 seconds and 8,964 seconds; total 9,847 seconds. The report provides no timezone. These timestamps describe one episode. Anthropic and AISI counts cannot establish comparable rates of dangerous behaviour across models. The updated AIHW statement takes precedence over the older summary still appearing in search results. The social illustration is conceptual and does not depict equipment involved in an actual incident.
