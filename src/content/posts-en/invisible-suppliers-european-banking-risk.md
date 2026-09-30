---
title: "The invisible suppliers of European banking risk"
seoTitle: "European banks: the risk of shared suppliers | l0g"
description: "Cloud, payments and subcontracting: European banks’ shared dependencies. ECB figures, DORA oversight and the practical limits of recovery plans."
ogImage: "/illustrations/news/european-bank-suppliers-2026-v1.jpg"
pubDate: 2026-09-30T14:14:31+02:00
updatedDate: 2026-09-30T14:14:31+02:00
tags: ["Banks", "Europe", "DORA", "Cloud", "Operational risk"]
draft: false
sourceArticle: "les-fournisseurs-invisibles-du-risque-bancaire-europeen"
sourceUpdatedDate: 2026-09-30T14:14:31+02:00
---

Customers choose a bank. They rarely choose the companies that host its services, carry its data or supply its software. Different banks can depend on the same infrastructure. That shared dependency gives incidents a route across institutions whose balance sheets and teams are otherwise separate.

In their [September 23, 2026 risk report](https://www.esma.europa.eu/sites/default/files/2026-09/JC_2026_29_JC_update_on_risks_and_vulnerabilities_autumn_2026.pdf), the European Banking Authority, insurance supervisor EIOPA and markets supervisor ESMA identify external dependencies as a vulnerability to monitor. They also describe a European financial system **that remains resilient**. Their warning calls for attention to the infrastructure supporting financial activity; it does not announce an imminent banking collapse.

## Cloud takes a larger share of IT budgets

The clearest figure comes from the ECB. In a [March 24, 2026 speech](https://www.bankingsupervision.europa.eu/press/interviews/date/2026/html/ssm.in260324_5~3d0837ff0e.en.html), Supervisory Board member Anneli Tuominen says cloud service-related expenses rose from around **4% of banks’ total IT budgets in 2021 to 17% in 2025**.

Cloud services supply computing resources remotely, including processing, storage and software. The ECB uses the rising spending share as an indicator of growing reliance on a small number of providers. Its [July 2025 guide](https://www.bankingsupervision.europa.eu/ecb/pub/pdf/ssm.supervisory_guides202507.en.pdf) also recognises possible benefits, including scalable capacity, security technologies and backup arrangements.

The indicator measures **how spending is allocated**. It does not measure the number of banks using a provider, that provider’s share of payments or the proportion of banking operations outsourced. The speech does not disclose the sample and methodology needed to reconstruct a detailed statistical series.

<figure class="infographic l0g-bank-suppliers-figure" style="max-width:28rem;margin:2rem auto;padding-bottom:1rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 430" role="img" aria-labelledby="bank-suppliers-en-1-title bank-suppliers-en-1-desc" style="width:100%;height:auto" font-family="Arial, Helvetica, sans-serif">
<title id="bank-suppliers-en-1-title">Cloud in the IT budget</title>
<desc id="bank-suppliers-en-1-desc">Cloud-related expenses in banks’ IT budgets, as reported by the ECB: around 4% in 2021 and 17% in 2025. Both bars use a 0–20% scale.</desc>
<rect x="0" y="0" width="480" height="430" rx="16" fill="var(--color-surface)"/>
<text x="24" y="45" font-size="25" fill="var(--color-paper)" text-anchor="start" font-weight="700">Cloud in the IT budget</text><text x="24" y="80" font-size="20" fill="var(--color-paper)" text-anchor="start" font-weight="400">Share of cloud spending, %</text><text x="42" y="138" font-size="23" fill="var(--color-paper)" text-anchor="start" font-weight="700">2021</text><text x="432" y="138" font-size="25" fill="var(--color-signal)" text-anchor="end" font-weight="700">≈ 4%</text><rect x="42" y="156" width="72.0" height="30" rx="3" fill="var(--color-signal)"/><text x="42" y="243" font-size="23" fill="var(--color-paper)" text-anchor="start" font-weight="700">2025</text><text x="432" y="243" font-size="25" fill="var(--color-signal)" text-anchor="end" font-weight="700">17%</text><rect x="42" y="261" width="306.0" height="30" rx="3" fill="var(--color-signal)"/><path d="M42 322 H402" fill="none" stroke="var(--color-line-strong)" stroke-width="2"/><text x="42" y="354" font-size="20" fill="var(--color-paper)" text-anchor="middle" font-weight="400">0</text><text x="132" y="354" font-size="20" fill="var(--color-paper)" text-anchor="middle" font-weight="400">5</text><text x="222" y="354" font-size="20" fill="var(--color-paper)" text-anchor="middle" font-weight="400">10</text><text x="312" y="354" font-size="20" fill="var(--color-paper)" text-anchor="middle" font-weight="400">15</text><text x="402" y="354" font-size="20" fill="var(--color-paper)" text-anchor="middle" font-weight="400">20</text><text x="24" y="400" font-size="20" fill="var(--color-paper)" text-anchor="start" font-weight="400">Bank spending indicator</text>
</svg>
<figcaption>Source: <a href="#source-02">ECB, Anneli Tuominen, March 24, 2026</a>. Share of IT budgets, using figures cited by the supervisor. The speech does not specify the sample or provide a complete annual series. This measure gives neither supplier market share nor the proportion of banking operations outsourced.</figcaption>
</figure>

## A shared outage can cut across diversified banks

Consider a scenario in which different banks use the same supplier for an essential function. An outage at that supplier could disrupt several institutions at once. The banks’ own servers might work and their capital positions remain sound while particular services become unavailable.

The financial consequences depend on the function affected. A brief interruption to a secondary tool differs from the loss of a service needed to process transactions before a deadline. Backup arrangements, outage duration and the ability to switch providers determine the extent of disruption. The [European supervisors](https://www.esma.europa.eu/sites/default/files/2026-09/JC_2026_29_JC_update_on_risks_and_vulnerabilities_autumn_2026.pdf) identify this concentration risk; their report does not estimate losses from a general cloud outage.

<figure class="infographic l0g-bank-suppliers-figure" style="max-width:28rem;margin:2rem auto;padding-bottom:1rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 450" role="img" aria-labelledby="bank-suppliers-en-2-title bank-suppliers-en-2-desc" style="width:100%;height:auto" font-family="Arial, Helvetica, sans-serif">
<title id="bank-suppliers-en-2-title">One shared dependency</title>
<desc id="bank-suppliers-en-2-desc">Illustrative scenario: an unavailable shared provider can disrupt service at three fictional banks A, B and C. Branches represent a technical dependency, without amounts or probabilities.</desc>
<rect x="0" y="0" width="480" height="450" rx="16" fill="var(--color-surface)"/>
<text x="24" y="44" font-size="25" fill="var(--color-paper)" text-anchor="start" font-weight="700">One shared dependency</text><text x="24" y="76" font-size="20" fill="var(--color-paper)" text-anchor="start" font-weight="400">A shared-outage scenario</text><g><rect x="86" y="104" width="308" height="80" rx="12" fill="var(--color-surface)" stroke="var(--color-line-strong)"/><text x="240.0" y="138" font-size="23" fill="var(--color-signal)" text-anchor="middle" font-weight="700">Shared provider</text><text x="240.0" y="167" font-size="20" fill="var(--color-paper)" text-anchor="middle" font-weight="400">Service unavailable</text></g><path d="M240 184 V222 M90 256 V222 H390 V256 M240 222 V256 M84 249 L90 256 L96 249 M234 249 L240 256 L246 249 M384 249 L390 256 L396 249" fill="none" stroke="var(--color-accent)" stroke-width="3" stroke-linejoin="round"/><g><rect x="28" y="268" width="124" height="64" rx="12" fill="var(--color-surface)" stroke="var(--color-line-strong)"/><text x="90.0" y="307" font-size="21" fill="var(--color-paper)" text-anchor="middle" font-weight="700">Bank A</text></g><g><rect x="178" y="268" width="124" height="64" rx="12" fill="var(--color-surface)" stroke="var(--color-line-strong)"/><text x="240.0" y="307" font-size="21" fill="var(--color-paper)" text-anchor="middle" font-weight="700">Bank B</text></g><g><rect x="328" y="268" width="124" height="64" rx="12" fill="var(--color-surface)" stroke="var(--color-line-strong)"/><text x="390.0" y="307" font-size="21" fill="var(--color-paper)" text-anchor="middle" font-weight="700">Bank C</text></g><text x="240" y="371" font-size="22" fill="var(--color-accent)" text-anchor="middle" font-weight="700">Same point of failure</text><text x="240" y="418" font-size="20" fill="var(--color-paper)" text-anchor="middle" font-weight="400">Recovery depends on backup options</text>
</svg>
<figcaption>Mechanism diagram, without incident frequencies or loss estimates. A, B and C are fictional; no real commercial relationship is asserted. References: <a href="#source-01">European supervisors, September 2026</a> and the <a href="#source-03">ECB cloud guide</a>. The duration and extent of disruption depend on the service and recovery arrangements.</figcaption>
</figure>

Diversification therefore needs to be examined down to shared technical dependencies. In a subcontracting scenario, two separate contracts might ultimately rely on the same hosting company. Spreading applications across several locations operated by one supplier can also leave dependencies on that supplier intact. The actual service chain and the failure scenarios covered matter.

Public digital services face related questions. Our [investigation into France Identité’s contracts](/en/analysis/your-identity-in-your-phone-3-sovereignty-under-contract/) examines the ability to resume a service built and maintained across multiple suppliers.

## Technical and financial dependencies have different mechanisms

The [joint supervisors’ report](https://www.esma.europa.eu/sites/default/files/2026-09/JC_2026_29_JC_update_on_risks_and_vulnerabilities_autumn_2026.pdf) looks beyond cloud services. It identifies ICT providers outside the European Economic Area, non-EU payment solutions, and infrastructures involved in clearing, repo and credit ratings. The [EEA includes the EU, Iceland, Liechtenstein and Norway](https://www.efta.int/eea-relations-eu/eea-institutions-two-pillar-structure/eea-efta-states), so “non-EU” and “non-EEA” describe different geographical boundaries.

Clearing organises the calculation and, depending on the infrastructure, the management of obligations between counterparties. A **[repo](/en/glossary/repo/)** provides financing against securities with an agreement to repurchase them. Credit ratings assess creditworthiness. These financial functions and an IT hosting contract have distinct mechanisms and supervisory frameworks. Our [analysis of repo](/en/analysis/repo-the-liquidity-factory/) explains its role in access to liquidity.

The supervisors also highlight banks’ funding needs in US dollars, sterling and Swiss francs. That exposure concerns access to a currency and its funding. Appearing on the same dependency map does not make it an IT outage risk.

According to the authorities, dependencies outside Europe add exposure to other jurisdictions and geopolitical events. Geography alone cannot rank the resilience of each arrangement. Concentration, the importance of the service and how readily it can be replaced also matter. The report does not provide an exhaustive public map connecting every bank to all its suppliers.

## DORA adds oversight of shared providers

The **[Digital Operational Resilience Act, or DORA](/en/glossary/dora/)** is the EU regulation on digital operational resilience in finance. It has [applied since January 17, 2025](https://www.eba.europa.eu/activities/direct-supervision-and-oversight/digital-operational-resilience-act/preparation-dora-application). Its framework covers ICT risk management, reporting of major incidents, testing and relationships with ICT service providers for financial entities within its scope.

DORA adds European oversight of selected critical suppliers. Financial entities’ registers of information on their ICT contracts feed into designation. Supervisors assess a provider’s systemic importance, the functions it supports and the substitutability of its services, as their [November 18, 2025 announcement](https://www.eba.europa.eu/publications-and-media/press-releases/european-supervisory-authorities-designate-critical-ict-third-party-providers-under-digital) explains.

The [list published that day](https://www.eba.europa.eu/sites/default/files/2025-11/e388451b-356b-408a-bbf2-b8e425865d75/List%20of%20designated%20CTPPs.pdf) contains **19 providers**, including European and non-European businesses supplying infrastructure, software and data services. The count concerns **[critical ICT third-party providers, or CTPPs](/en/glossary/ctpp/)** designated for the European financial sector. It counts neither banks nor all their suppliers. That remains the list offered on the official oversight page consulted for this article.

The ECB describes the framework as fully operational from January 2026. The [January 14 agreement with UK authorities](https://www.eba.europa.eu/publications-and-media/press-releases/european-supervisory-authorities-and-uk-financial-regulators-sign-memorandum-understanding-oversight), including the Bank of England, PRA and FCA, establishes cooperation, information sharing and coordination of oversight. The equivalence assessment concerns the confidentiality and professional secrecy arrangements needed to exchange information.

This oversight complements financial entities’ responsibility to manage their own ICT risks, as the [EBA explains](https://www.eba.europa.eu/activities/direct-supervision-and-oversight/digital-operational-resilience-act/dora-oversight). Designation does not guarantee uninterrupted service from a provider.

## An exit plan has to work

The [ECB cloud guide](https://www.bankingsupervision.europa.eu/ecb/pub/pdf/ssm.supervisory_guides202507.en.pdf) distinguishes DORA requirements from the good practices it recommends. The guide itself does not introduce new legally binding obligations. Its operational logic is specific: prepare to transfer a critical service or bring it in-house, with a credible timetable, resources and technical options.

Retrieving data may not be enough to restart an application. Proprietary technologies, interfaces and specialist skills can complicate migration. The guide recommends estimating transition times, identifying alternative providers and testing the feasibility of exit plans. It also addresses subcontracting chains.

In her [March 2026 speech](https://www.bankingsupervision.europa.eu/press/interviews/date/2026/html/ssm.in260324_5~3d0837ff0e.en.html), Tuominen observes that some banks still lag in renegotiating contracts and adapting business continuity arrangements. She also says **38% of major incidents reported by banks in 2025 had IT changes as their root cause**. That category covers projects, migrations and updates. The figure does not allocate incidents between internal origins and external providers.

There is also a reporting boundary to respect. The ECB explains that DORA extends reporting to major ICT incidents, beyond the cyber incidents covered by the previous framework. Treating those series as directly comparable would be misleading.

## Work on non-ICT services is still under way

A recent development broadens the picture. On September 18, 2026, the EBA announced its [final guidelines on third-party risk for non-ICT services](https://www.eba.europa.eu/sites/default/files/2026-09/dc9ccbb3-79b9-493d-b693-c21adeffbcc9/Final%20report%20on%20GL%20on%20third-party%20risk%20management.pdf). They seek to align the management of those dependencies more closely with the framework for ICT services, particularly where critical or important functions are supported.

As of September 30, the [official policy page](https://www.eba.europa.eu/activities/single-rulebook/regulatory-activities/internal-governance/guidelines-third-party-risk-management?version=2026) marks them **not yet applicable**, pending translation. The final text leaves the application date to be determined and provides two years from that date for reviewing and documenting existing arrangements supporting critical or important functions. If review or documentation is still incomplete at that point, the text calls for the supervisor to be informed. A firm calendar deadline would therefore be premature.

When assessing a bank, practical questions follow: which service could stop, which other institutions share the dependency, and how long would recovery take? A capital ratio describes the ability to absorb losses. Supplier mapping and recovery tests illuminate the ability to keep operating. These perspectives complement each other.

## Sources and documents

<ol class="l0g-bank-suppliers-sources">
<li id="source-01"><a href="https://www.esma.europa.eu/sites/default/files/2026-09/JC_2026_29_JC_update_on_risks_and_vulnerabilities_autumn_2026.pdf">EBA, EIOPA and ESMA: risk update, September 23, 2026, JC 2026 29</a></li>
<li id="source-02"><a href="https://www.bankingsupervision.europa.eu/press/interviews/date/2026/html/ssm.in260324_5~3d0837ff0e.en.html">ECB: Anneli Tuominen, March 24, 2026, cloud budgets and ICT incidents</a></li>
<li id="source-03"><a href="https://www.bankingsupervision.europa.eu/ecb/pub/pdf/ssm.supervisory_guides202507.en.pdf">ECB: guide on outsourcing cloud services, July 2025</a></li>
<li id="source-04"><a href="https://www.eba.europa.eu/publications-and-media/press-releases/european-supervisory-authorities-designate-critical-ict-third-party-providers-under-digital">European supervisors: critical provider designation, November 18, 2025</a></li>
<li id="source-05"><a href="https://www.eba.europa.eu/sites/default/files/2025-11/e388451b-356b-408a-bbf2-b8e425865d75/List%20of%20designated%20CTPPs.pdf">European supervisors: list of 19 designated providers, November 2025</a></li>
<li id="source-06"><a href="https://www.eba.europa.eu/publications-and-media/press-releases/european-supervisory-authorities-and-uk-financial-regulators-sign-memorandum-understanding-oversight">European supervisors and UK regulators: cooperation agreement, January 14, 2026</a></li>
<li id="source-07"><a href="https://www.eba.europa.eu/activities/direct-supervision-and-oversight/digital-operational-resilience-act/dora-oversight">EBA: DORA oversight page, accessed September 30, 2026</a></li>
<li id="source-08"><a href="https://www.eba.europa.eu/activities/direct-supervision-and-oversight/digital-operational-resilience-act/preparation-dora-application">EBA: DORA application and registers of information</a></li>
<li id="source-09"><a href="https://www.eba.europa.eu/sites/default/files/2026-09/dc9ccbb3-79b9-493d-b693-c21adeffbcc9/Final%20report%20on%20GL%20on%20third-party%20risk%20management.pdf">EBA/GL/2026/09: final guidelines on third-party risk for non-ICT services, September 2026</a></li>
<li id="source-10"><a href="https://www.eba.europa.eu/activities/single-rulebook/regulatory-activities/internal-governance/guidelines-third-party-risk-management?version=2026">EBA: guidelines status, 2026 version, accessed September 30, 2026</a></li>
<li id="source-11"><a href="https://www.efta.int/eea-relations-eu/eea-institutions-two-pillar-structure/eea-efta-states">EFTA: geographical scope of the European Economic Area</a></li>
</ol>

## Method and limitations

Analysis as of September 30, 2026. Cloud budget and incident figures are attributed to the ECB’s March 24 speech. The September joint report identifies sectoral dependencies; it does not supply an exhaustive supplier map for each bank or a loss estimate for a general outage.

The critical provider count was checked against the official November 2025 list and the oversight page accessed on September 30. The non-ICT guidelines’ status and transition were checked against the policy page and paragraphs 18–20 of the final text. Those documents do not specify an application date.

The spending chart uses a common 0–20% scale. The dependency network illustrates three fictional banks, with no identified contracts or probabilities. Effects on continuity, liquidity or losses depend on the function, duration and recovery options. No market price, valuation ratio or hypothetical loss amount is presented as an observed figure.
