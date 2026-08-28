---
title: "Your identity in your phone, 3/8: sovereignty under contract"
seoTitle: "France Identité: seven contracts and vendor risk | l0g"
ogTitle: "France Identité: seven contracts, one identity"
description: "France Identité’s updated programme cost is €107.4m. Seven frameworks cover its software core. Who controls code, keys, recovery and liability?"
ogImage: "/illustrations/news/france-identite-sovereignty-contract-chain-v1.jpg"
pubDate: 2026-08-28T14:30:00+02:00
updatedDate: 2026-08-28T14:30:00+02:00
tags: ["France Identité", "France Titres", "digital identity", "digital sovereignty", "public procurement", "outsourcing", "cybersecurity", "liability", "operational risk", "financial risk", "investigation"]
draft: false
sourceArticle: "votre-identite-dans-un-telephone-3-l-identite-souveraine-sous-contrat"
sourceUpdatedDate: 2026-08-28T14:30:00+02:00
---

*France Identité is a State application. Its servers are said to run on the French Interior Ministry cloud. The electronic seal on its credentials relies on the ministry’s digital directorate and on keys protected in ANSSI-qualified equipment. Yet its software core, expertise, security, mobile apps, backend and interoperability environments are also divided among seven framework contracts.*

*Multiple suppliers are not an anomaly. The structure can reduce concentration and provide scarce skills. The sovereignty question begins elsewhere: can the State understand, audit, build, operate, repair and replace each critical component without remaining dependent on its current contractor?*

*The question becomes financial when the identity layer gates access to training, a grant, a corporate signature or a contractual transaction. A technical failure can then become a delay, a missed deadline or an economic loss. Who restores the service, and who compensates the user?*

*This is part three of **Your identity in your phone**. Part one followed [France Identité data and logs](/en/analysis/your-identity-in-your-phone-1-when-an-id-card-becomes-a-service/). Part two measured [the cost of proceeding without a mobile digital identity](/en/analysis/your-identity-in-your-phone-2-optional-but-at-what-cost/).*

*Version française : [L’identité souveraine sous contrat](/posts/votre-identite-dans-un-telephone-3-l-identite-souveraine-sous-contrat/).*

## Key points

- A French Senate budget report puts the updated total cost of the France Identité programme at **€107.4 million**. This covers the programme as a whole and is not a single app-development invoice.
- An EU procurement notice published in January 2025 sets a cumulative maximum value of **€44.7 million** for seven framework contracts covering the development, operation and security of SGIN.
- The €44.7 million consists of **contractual ceilings**, with no published minimum. It does not show orders placed, invoices paid or work accepted.
- French public-procurement essential data records seven awardees notified on 7 May 2025: Eurogroup Consulting, Cabinet Louis Reynaud, Stelau Conseil, Sopra Steria, BAM, IN Smart Identity France and Docaposte BPO.
- The EU notice states 24 months plus two 12-month renewals, for a 48-month maximum. Public-procurement data pages display six years. The signed contracts are needed to resolve this documentary discrepancy.
- The Senate places the outsourcing rate for **France Titres projects as a whole** between 78% and 95%, compared with a 60% ceiling recommended by DINUM. This is not a France Identité-specific rate.
- France Titres says hosting is on the ministry’s cloud PI. Its signature policy assigns the State seal to DNUM through SIGNHOR, with signing keys protected in ANSSI-qualified HSMs.
- Mobile versions certified in 2023 identify Atos France as developer. The 2025 mobile lot is awarded to BAM. Public records do not describe the handover of code, builds and incident procedures.
- iDAKTO says it designed the ID-card reading SDK and a backend management system. The 2025 server lot is awarded to IN Smart Identity France. These facts do not establish a complete replacement or the precise coexistence of components.
- iDAKTO announced its acquisition of Stelau in June 2026. Stelau holds the information-system expertise lot. This proves no conflict, but warrants scrutiny of recusals, team separation and change-of-control procedures.
- The mobile source code is still described as due to be published soon. The future EUDI Wallet is subject to an EU open-source licensing requirement for application components, with limited exceptions.
- France Identité’s terms strongly limit stated liability for interruptions and indirect financial loss, while also saying France Identité remains responsible to users for subcontracted services. The exact legal effect requires specialist analysis.

## Two financial perimeters

The first figure comes from the French Senate’s 2026 budget report on the territorial and general administration of the State. It says the updated total cost of the France Identité programme is **€107.4 million**, mainly in non-payroll expenditure, and identifies €16.22 million in 2026 payment appropriations. [The figures appear in the section on France Titres](https://www.senat.fr/rap/l25-139-32/l25-139-32_mono.html).

The total is not the price of a mobile app. It covers the programme over time, including infrastructure, services, operation, upgrades and other expenditure assigned to the project under the budget methodology.

The second figure comes from procurement. [EU notice 58709-2025](https://ted.europa.eu/en/notice/-/detail/58709-2025) covers development and secure operational maintenance of the Digital Identity Guarantee Service, SGIN. It divides the work into seven single-award lots and sets a total maximum value of **€44.7 million**.

The key word is **maximum**.

Each lot is a call-off framework with no published minimum. Adding the ceilings measures the maximum contractual envelope. It does not establish:

```text
Orders actually placed
Amounts invoiced
Amounts paid
Work accepted
Penalties imposed
Ceiling still available
```

A headline saying that the State has already paid €44.7 million to seven companies would be false.

## Seven functions, seven awardees

The procurement notice defines functions and ceilings. Awardees and the notification date are recorded in France’s [public-procurement essential data](https://www.data.gouv.fr/datasets/donnees-essentielles-de-la-commande-publique-decp-arrete-du-22-12-2022-marches), as republished in buyer and contract pages. That open data establishes award records. It does not replace the signed contract, call-off orders or execution documents.

<p style="margin-bottom:.5rem;color:#777f8b;font-size:.78rem">↔ Scroll the table to read it on mobile.</p>
<div role="region" aria-label="Seven SGIN lots, functions, awardees and ceilings" tabindex="0" style="max-width:100%;overflow-x:auto;overscroll-behavior-inline:contain">
<table style="min-width:44rem">
<thead><tr><th style="text-align:right">Lot</th><th>Function</th><th>Recorded awardee</th><th style="text-align:right">Ceiling</th></tr></thead>
<tbody>
<tr><td style="text-align:right">1</td><td>Service coordination</td><td>Eurogroup Consulting France</td><td style="text-align:right">€4.3m</td></tr>
<tr><td style="text-align:right">2</td><td>International work, standards and State policies</td><td>Cabinet Louis Reynaud / CLR Labs</td><td style="text-align:right">€3.9m</td></tr>
<tr><td style="text-align:right">3</td><td>Information-system expertise</td><td>Stelau Conseil</td><td style="text-align:right">€5.1m</td></tr>
<tr><td style="text-align:right">4</td><td>Information-system security</td><td>Sopra Steria Group</td><td style="text-align:right">€5.4m</td></tr>
<tr><td style="text-align:right">5</td><td>Mobile-app development and maintenance</td><td>BAM</td><td style="text-align:right">€7.2m</td></tr>
<tr><td style="text-align:right">6</td><td>Server-app development and maintenance</td><td>IN Smart Identity France</td><td style="text-align:right">€10.4m</td></tr>
<tr><td style="text-align:right">7</td><td>Multi-party test and interoperability environments</td><td>Docaposte BPO</td><td style="text-align:right">€8.4m</td></tr>
</tbody>
</table>
</div>

All seven contracts are recorded as notified on **7 May 2025**. The France Titres page on [Pappers](https://www.pappers.fr/entreprise/ants-agence-nationale-des-titres-securises-130003262) lists the lots and awardees. A [Macellum page for lot 1](https://www.macellum.fr/marche/c4a28aaf1f79947d37ac75df2ac28d9a6c094c7f-la-consultation-pour-objet-passation-marches-publics-relatifs-la-realisation-au-maintien-en-conditions-operationnelle-de-securite-sgin-service-garantie-l-identite-numerique-l-ants-france-titres-pilotage-prestations-lot-1-pilotage) explicitly identifies the Ministry of Economy’s essential procurement data as its source.

<figure class="infographic infographic-readable" style="padding-bottom:1.5rem" tabindex="0" aria-label="SEVEN CONTRACTS, ONE IDENTITY">
<svg viewBox="0 0 360 1130" width="100%" role="img" aria-labelledby="contracts-en-title contracts-en-desc" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;height:auto;overflow:hidden;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;background:#0c0d10">
<title id="contracts-en-title">SEVEN CONTRACTS, ONE IDENTITY</title>
<desc id="contracts-en-desc">SGIN framework ceilings, not recorded expenditure</desc>
<rect x="1" y="1" width="358" height="1128" rx="16" fill="#0c0d10" stroke="#2b3038"/>
<text x="18" y="42" fill="#f5f6f8" font-size="15" font-weight="700">SEVEN CONTRACTS, ONE IDENTITY</text>
<text x="18" y="64" fill="#8b909b" font-size="8.5">SGIN framework ceilings, not recorded expenditure</text>
<rect x="14" y="88" width="332" height="116" rx="12" fill="#101319" stroke="#5eead4"/>
<rect x="28" y="106" width="38" height="38" rx="8" fill="#171a20" stroke="#5eead4"/>
<text x="47" y="131" text-anchor="middle" fill="#5eead4" font-size="13" font-weight="700">01</text>
<text x="78" y="116" fill="#5eead4" font-size="10.5" font-weight="700">SERVICE COORDINATION</text>
<text x="78" y="140" fill="#f5f6f8" font-size="10.5">Eurogroup Consulting</text>
<text x="78" y="164" fill="#aeb4bf" font-size="9.5">€4.3m max.</text>
<line x1="28" y1="180" x2="332" y2="180" stroke="#2b3038"/>
<text x="28" y="196" fill="#6f7580" font-size="8">Single-award lot</text>
<rect x="14" y="218" width="332" height="116" rx="12" fill="#101319" stroke="#7aa2f7"/>
<rect x="28" y="236" width="38" height="38" rx="8" fill="#171a20" stroke="#7aa2f7"/>
<text x="47" y="261" text-anchor="middle" fill="#7aa2f7" font-size="13" font-weight="700">02</text>
<text x="78" y="246" fill="#7aa2f7" font-size="10.5" font-weight="700">STANDARDS AND INTERNATIONAL WORK</text>
<text x="78" y="270" fill="#f5f6f8" font-size="10.5">Cabinet Louis Reynaud</text>
<text x="78" y="294" fill="#aeb4bf" font-size="9.5">€3.9m max.</text>
<line x1="28" y1="310" x2="332" y2="310" stroke="#2b3038"/>
<text x="28" y="326" fill="#6f7580" font-size="8">Single-award lot</text>
<rect x="14" y="348" width="332" height="116" rx="12" fill="#101319" stroke="#a78bfa"/>
<rect x="28" y="366" width="38" height="38" rx="8" fill="#171a20" stroke="#a78bfa"/>
<text x="47" y="391" text-anchor="middle" fill="#a78bfa" font-size="13" font-weight="700">03</text>
<text x="78" y="376" fill="#a78bfa" font-size="10.5" font-weight="700">INFORMATION-SYSTEM EXPERTISE</text>
<text x="78" y="400" fill="#f5f6f8" font-size="10.5">Stelau Conseil</text>
<text x="78" y="424" fill="#aeb4bf" font-size="9.5">€5.1m max.</text>
<line x1="28" y1="440" x2="332" y2="440" stroke="#2b3038"/>
<text x="28" y="456" fill="#6f7580" font-size="8">Single-award lot</text>
<rect x="14" y="478" width="332" height="116" rx="12" fill="#101319" stroke="#f5b13d"/>
<rect x="28" y="496" width="38" height="38" rx="8" fill="#171a20" stroke="#f5b13d"/>
<text x="47" y="521" text-anchor="middle" fill="#f5b13d" font-size="13" font-weight="700">04</text>
<text x="78" y="506" fill="#f5b13d" font-size="10.5" font-weight="700">INFORMATION-SYSTEM SECURITY</text>
<text x="78" y="530" fill="#f5f6f8" font-size="10.5">Sopra Steria Group</text>
<text x="78" y="554" fill="#aeb4bf" font-size="9.5">€5.4m max.</text>
<line x1="28" y1="570" x2="332" y2="570" stroke="#2b3038"/>
<text x="28" y="586" fill="#6f7580" font-size="8">Single-award lot</text>
<rect x="14" y="608" width="332" height="116" rx="12" fill="#101319" stroke="#ff85ad"/>
<rect x="28" y="626" width="38" height="38" rx="8" fill="#171a20" stroke="#ff85ad"/>
<text x="47" y="651" text-anchor="middle" fill="#ff85ad" font-size="13" font-weight="700">05</text>
<text x="78" y="636" fill="#ff85ad" font-size="10.5" font-weight="700">MOBILE APPLICATIONS</text>
<text x="78" y="660" fill="#f5f6f8" font-size="10.5">BAM</text>
<text x="78" y="684" fill="#aeb4bf" font-size="9.5">€7.2m max.</text>
<line x1="28" y1="700" x2="332" y2="700" stroke="#2b3038"/>
<text x="28" y="716" fill="#6f7580" font-size="8">Single-award lot</text>
<rect x="14" y="738" width="332" height="116" rx="12" fill="#101319" stroke="#5eead4"/>
<rect x="28" y="756" width="38" height="38" rx="8" fill="#171a20" stroke="#5eead4"/>
<text x="47" y="781" text-anchor="middle" fill="#5eead4" font-size="13" font-weight="700">06</text>
<text x="78" y="766" fill="#5eead4" font-size="10.5" font-weight="700">SERVER APPLICATIONS</text>
<text x="78" y="790" fill="#f5f6f8" font-size="10.5">IN Smart Identity France</text>
<text x="78" y="814" fill="#aeb4bf" font-size="9.5">€10.4m max.</text>
<line x1="28" y1="830" x2="332" y2="830" stroke="#2b3038"/>
<text x="28" y="846" fill="#6f7580" font-size="8">Single-award lot</text>
<rect x="14" y="868" width="332" height="116" rx="12" fill="#101319" stroke="#7aa2f7"/>
<rect x="28" y="886" width="38" height="38" rx="8" fill="#171a20" stroke="#7aa2f7"/>
<text x="47" y="911" text-anchor="middle" fill="#7aa2f7" font-size="13" font-weight="700">07</text>
<text x="78" y="896" fill="#7aa2f7" font-size="10.5" font-weight="700">TESTING AND INTEROPERABILITY</text>
<text x="78" y="920" fill="#f5f6f8" font-size="10.5">Docaposte BPO</text>
<text x="78" y="944" fill="#aeb4bf" font-size="9.5">€8.4m max.</text>
<line x1="28" y1="960" x2="332" y2="960" stroke="#2b3038"/>
<text x="28" y="976" fill="#6f7580" font-size="8">Single-award lot</text>
<rect x="14" y="998" width="332" height="70" rx="12" fill="#161b19" stroke="#5eead4"/>
<text x="28" y="1025" fill="#5eead4" font-size="10.5" font-weight="700">CUMULATIVE CEILING</text>
<text x="332" y="1027" text-anchor="end" fill="#f5f6f8" font-size="18" font-weight="700">€44.7m</text>
<text x="28" y="1050" fill="#aeb4bf" font-size="8.5">No published minimum</text>
<text x="18" y="1092" fill="#6f7580" font-size="8">Scope and ceilings: EU procurement notice 58709-2025.</text>
<text x="18" y="1108" fill="#6f7580" font-size="8">Awardees: DECP records, notified 7 May 2025.</text>
</svg>
<figcaption>The amounts are contractual ceilings. They do not establish orders placed or invoices paid.</figcaption>
</figure>

Splitting the work offers an obvious benefit. No supplier automatically receives the whole chain. The notice also contains award incompatibilities. The coordination contractor cannot accumulate every other lot. Standards and security lots are incompatible with several implementation lots. The expertise lot cannot be combined with coordination.

Those clauses show that France Titres anticipated some concentration and role-confusion risk.

They do not answer the operational question. An incident may cross several lots: a mobile update calls a backend, invokes a signing service, produces logs, relies on a test environment and requires security teams to qualify it. Every supplier may meet its narrow obligation while the full chain remains unavailable.

Sovereignty then depends on the actor able to arbitrate between lots and take technical control when their diagnoses diverge.

## Four years in the notice, six years in the data

The EU notice states an initial 24-month term and two 12-month renewals. The stated maximum is therefore **48 months**.

The [official DECP records filtered for SGIN](https://data.economie.gouv.fr/explore/dataset/decp-2022-marches-valides/table/?q=SGIN) nevertheless display **72 months** for all seven contracts notified in May 2025.

The difference does not prove an irregularity. Possible explanations include:

- a metadata error or misinterpretation;
- a distinction between framework duration and execution period;
- inclusion of similar follow-on services;
- a later contractual modification;
- an error in the public-data publication chain.

The signed documents must decide the issue. Each lot requires its engagement act, administrative terms, amendments and legally applicable end date.

The discrepancy is informative in itself. A citizen can learn the awardee and ceiling. The published data still do not allow a confident conclusion about the term for which the State is legally committed.

## The Senate documents a wider dependency

The Senate report does not give an outsourcing rate for France Identité alone. It covers **France Titres projects as a whole**.

It places their outsourcing rate between **78% and 95%**, compared with a 60% maximum recommended by DINUM. The report warns of loss of sovereignty, skills and operational control. It also identifies financial risk, saying outsourcing costs 20% more according to DTNUM and up to 100% more according to France Titres than the compared internal cost. It estimates that bringing 50 full-time equivalents back in-house over five years could save about €5 million. [The report publishes the estimates and their context](https://www.senat.fr/rap/l25-139-32/l25-139-32_mono.html).

Two safeguards are necessary.

First, the rate does not mean that 78% to 95% of France Identité code is written outside the State. France Titres also manages identity documents, vehicle registrations, driving licences and user assistance.

Second, the 20% to 100% cost premium is an administrative estimate reported by the Senate, not a detailed cost ledger for every France Identité contract.

The signal remains strong. Parliamentary scrutiny describes the operator of a sovereign identity system as structurally outsourcing far above the recommended reference.

The question is no longer merely how many suppliers exist. It is **how many public employees can take over their work**.

## The State retains critical layers

The chain is not wholly outsourced.

France Titres says France Identité servers are hosted on the Interior Ministry’s **cloud PI**, in sovereign data centres and strictly segmented from other ministry applications. The same page cites mobile and backend audits, bug bounties and forthcoming publication of the mobile source code. [These statements appear on the France Identité security page](https://france-identite.gouv.fr/securite-application/).

The published signature policy describes another State-controlled layer. The Interior Ministry’s secretariat-general is the signer of identity credentials. DNUM provides SIGNHOR. SGIN is the only service authorised to request the seal under this policy. Keys are protected in ANSSI-qualified hardware security modules, and the ministry provides timestamping. [The policy sets out the actors and process](https://france-identite.gouv.fr/politique-de-signature/).

A first boundary can therefore be drawn:

```text
Server hosting
→ Interior Ministry cloud PI

Electronic seal and timestamp
→ DNUM / SIGNHOR / ministry

Signing keys
→ ANSSI-qualified HSMs

Coordination, expertise, security,
apps, backend and testing
→ SGIN framework contracts
```

<figure class="infographic infographic-readable" style="padding-bottom:1.5rem" tabindex="0" aria-label="WHO CONTROLS WHAT?">
<svg viewBox="0 0 360 720" width="100%" role="img" aria-labelledby="control-en-title control-en-desc" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;height:auto;overflow:hidden;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;background:#0c0d10">
<title id="control-en-title">WHO CONTROLS WHAT?</title>
<desc id="control-en-desc">Publicly documented control, contracted layers and unknowns</desc>
<rect x="1" y="1" width="358" height="718" rx="16" fill="#0c0d10" stroke="#2b3038"/>
<text x="18" y="42" fill="#f5f6f8" font-size="15" font-weight="700">WHO CONTROLS WHAT?</text>
<text x="18" y="64" fill="#8b909b" font-size="8.5">Publicly documented control, contracted layers and unknowns</text>
<rect x="14" y="88" width="332" height="150" rx="12" fill="#101319" stroke="#5eead4"/>
<text x="28" y="116" fill="#5eead4" font-size="10.5" font-weight="700">DOCUMENTED PUBLIC CONTROL</text>
<circle cx="31" cy="138" r="3" fill="#5eead4"/><text x="42" y="142" fill="#f5f6f8" font-size="9.5">Interior Ministry cloud PI: hosting</text>
<circle cx="31" cy="168" r="3" fill="#5eead4"/><text x="42" y="172" fill="#f5f6f8" font-size="9.5">DNUM / SIGNHOR: electronic seal</text>
<circle cx="31" cy="198" r="3" fill="#5eead4"/><text x="42" y="202" fill="#f5f6f8" font-size="9.5">ANSSI-qualified HSMs: signing keys</text>
<path d="M180 238 V264" stroke="#5eead4" stroke-width="2"/>
<path d="M174 256 L180 266 L186 256" fill="#5eead4"/>
<rect x="14" y="266" width="332" height="150" rx="12" fill="#101319" stroke="#7aa2f7"/>
<text x="28" y="294" fill="#7aa2f7" font-size="10.5" font-weight="700">CONTRACTED LAYERS</text>
<circle cx="31" cy="316" r="3" fill="#7aa2f7"/><text x="42" y="320" fill="#f5f6f8" font-size="9.5">Mobile and server applications</text>
<circle cx="31" cy="346" r="3" fill="#7aa2f7"/><text x="42" y="350" fill="#f5f6f8" font-size="9.5">Security, expertise and coordination</text>
<circle cx="31" cy="376" r="3" fill="#7aa2f7"/><text x="42" y="380" fill="#f5f6f8" font-size="9.5">Multi-party testing and interoperability</text>
<path d="M180 416 V442" stroke="#7aa2f7" stroke-width="2"/>
<path d="M174 434 L180 444 L186 434" fill="#7aa2f7"/>
<rect x="14" y="444" width="332" height="150" rx="12" fill="#101319" stroke="#ff85ad"/>
<text x="28" y="472" fill="#ff85ad" font-size="10.5" font-weight="700">CAPABILITIES NOT PUBLICLY MAPPED</text>
<circle cx="31" cy="494" r="3" fill="#ff85ad"/><text x="42" y="498" fill="#f5f6f8" font-size="9.5">Code repositories and build pipeline</text>
<circle cx="31" cy="524" r="3" fill="#ff85ad"/><text x="42" y="528" fill="#f5f6f8" font-size="9.5">Apple / Google accounts and deployment secrets</text>
<circle cx="31" cy="554" r="3" fill="#ff85ad"/><text x="42" y="558" fill="#f5f6f8" font-size="9.5">Exit tests, RTO, RPO and liability allocation</text>
<rect x="14" y="614" width="332" height="72" rx="10" fill="#15171b" stroke="#3a4049"/>
<text x="28" y="637" fill="#f5b13d" font-size="9.5" font-weight="700">Legal ownership alone does not prove</text>
<text x="28" y="654" fill="#f5b13d" font-size="9.5" font-weight="700">recovery capability.</text>
<text x="28" y="676" fill="#aeb4bf" font-size="9">l0g test: know, audit, operate, repair and replace.</text>
<text x="18" y="704" fill="#6f7580" font-size="8">Sources: France Identité, signature policy, EU notice, DECP.</text>
</svg>
<figcaption>The map separates documented functions from capabilities that public records do not yet allow us to verify.</figcaption>
</figure>

This prevents a simplistic account. Awarded suppliers do not necessarily hold identity data, signing keys and hosting. Conversely, owning infrastructure does not prove that the State can independently operate the applications running on it.

A public server can depend on a deployment only the supplier knows how to produce. A State-held key can be unusable when the service preparing the signing request is down. Intellectual-property rights can belong to ANTS while repositories, build pipelines, publishing accounts and daily expertise remain distributed.

## Sovereignty is tested when the supplier changes

The service terms state that intellectual-property rights connected to SGIN and the France Identité application remain the property of ANTS. This is a significant safeguard. [The clause appears in the current terms](https://france-identite.gouv.fr/conditions-generales-utilisation/cgu-sgin/).

Legal ownership does not answer every operational question.

Taking over an application requires at least:

```text
Complete source and history
Dependency and licence inventory
Build scripts
Test pipeline
Deployment images
Technical accounts
Required certificates and secrets
Architecture documentation
Incident procedures
Skills to understand the whole system
```

The sovereignty test can be expressed as eight verbs:

```text
Know
Decide
Audit
Build
Operate
Repair
Replace
Answer financially
```

A contract that is reversible on paper is not a tested handover. Delivered documentation is not necessarily current. Repository access does not guarantee that the State can reproduce the binary installed on millions of phones.

The decisive evidence would be an exercise in which a different team takes over the source, rebuilds the app, deploys a clean backend and restores the service within the contractual target. No public result of such a test was found in the reviewed records.

## From Atos to BAM: code handover should leave evidence

Official 2023 CSPN certification reports identify **Atos France** as developer of France Identité Android 1.2.4 and iOS 1.2.3. The Interior Ministry was the sponsor and AMOSSYS the evaluation centre. The certificates covered mobile components involved in using the app as a high-assurance electronic identification means. They did not indiscriminately certify the backend and every operational process. The [Android report](https://messervices.cyber.gouv.fr/visas/ANSSI-CSPN-2023-22-rapport.pdf) and [iOS report](https://messervices.cyber.gouv.fr/visas/ANSSI-CSPN-2023-21-rapport.pdf) are published by ANSSI.

The mobile lot notified in May 2025 is awarded to **BAM**.

These facts establish a supplier transition. They do not reveal:

- whether Atos still maintains a component;
- whether BAM received the entire source tree;
- which release was the first under its responsibility;
- who controls the build pipeline;
- who owns Apple Developer and Google Play Console accounts;
- whether a new evaluation followed the change;
- whether France Titres tested rebuilding without the historical team.

Changing supplier is not a problem. It is the moment when reversibility can be demonstrated.

Expected evidence is standard: a handover report, dependency inventory, repository transfer, open-ticket list, known vulnerabilities, licences, deployment procedures and validation of the first inherited release.

## The claimed backend and the awarded backend

iDAKTO describes itself as a technology partner to France Identité. Its case study says the company designed the ID-card reading SDK and backend management system, and describes the wallet as using its technology. [This is the supplier’s own account](https://www.idakto.com/case-studies/france-identite/), not an independently verified contract map.

The 2025 lot 6 for server-app development and maintenance is awarded to **IN Smart Identity France**.

Several architectures are possible:

1. iDAKTO still supplies a component integrated by the lot 6 contractor;
2. iDAKTO acts as a subcontractor;
3. a legacy backend coexists with a newer layer;
4. components were transferred or rewritten;
5. the case study mainly describes an earlier phase.

None can be presented as fact without the contracts and current architecture.

One nuance prevents an overly simple State-versus-private-company narrative. The national business register, as displayed by Pappers, lists Imprimerie Nationale as president of IN Smart Identity France. France’s Economy Ministry also describes IN Groupe as 100% state-owned in the release announcing completion of the IDEMIA Smart Identity acquisition. [The official release is dated 1 July 2025](https://presse.economie.gouv.fr/creation-dun-champion-mondial-de-lidentite-letat-soutient-le-rachat-par-in-groupe-didemia-smart-identity/).

The server lot is therefore held by a separate company integrated into a State-owned industrial group. This weakens any claim of complete privatisation. It does not settle operational control: source, licences, teams, secrets, subcontractors and replacement capacity still need mapping.

## Stelau’s acquisition creates a separation-of-roles question

Stelau Conseil is recorded as the awardee of lot 3 for information-system expertise.

On 16 June 2026, iDAKTO announced its acquisition of Stelau. The release brings together iDAKTO’s identity platforms and Stelau’s advisory, security-assessment, compliance and cybersecurity work. [The acquiring company dates and describes the transaction](https://www.idakto.com/blog/idakto-accelerates-its-growth-with-the-acquisition-of-stelau-specialist-in-cybersecurity-for-digital-identity-infrastructure/).

The acquisition proves no conflict of interest.

It creates governance questions:

- does lot 3 advise on components supplied or claimed by iDAKTO?
- which assignments require recusal?
- are teams, managers and tools separated?
- was France Titres notified of the change of control?
- did the contract require consent or reassessment?
- does another actor validate work when the group is involved?

The procurement notice anticipated incompatibilities between some lots. A later acquisition can alter the economic balance without changing the original awardee name in public data. Controlling such changes is part of contractual sovereignty.

## Open source is still promised for later

The official security page still says that the mobile application source code will be published open source “soon”. [The wording remained online on 28 August 2026](https://france-identite.gouv.fr/securite-application/).

The European framework adds a specific requirement for the future EUDI Wallet. Regulation 2024/1183 requires application software components to be licensed open source, with justified exceptions for certain specified components not installed on the device. [The rule appears in Article 5a](https://eur-lex.europa.eu/eli/reg/2024/1183/oj/eng).

This does not establish that the current France Identité app already breaches the requirement. It is not yet the entire European wallet, and implementation is ongoing.

The promise should nevertheless become testable:

- publication date;
- iOS and Android scope;
- Git history;
- dependencies and submodules;
- NFC SDK;
- build instructions;
- licence;
- excluded components;
- correspondence between public source and distributed binaries.

An incomplete repository published after each release would provide limited transparency. Reproducible builds would go further by allowing a compiled binary from public source to be compared with the one distributed through app stores.

## Who holds what?

<div class="instrument-plate" style="padding:1.1rem;--plate-accent:#5eead4">
<p class="mono-label" style="margin:0;color:#5eead4">L0G TOOL // WHO HOLDS WHAT?</p>
<p style="margin:.65rem 0 1rem;color:#d6d9df">Open a scenario. Each card separates the documented component, the possible economic consequence, the known fallback and the information still missing.</p>
<details style="border:1px solid #2b3038;border-radius:10px;background:#101319;margin:.75rem 0;padding:.85rem 1rem">
<summary style="cursor:pointer;color:#f5f6f8;font-weight:700">The mobile app no longer starts</summary>
<div style="margin-top:.85rem;color:#d6d9df">
<p style="margin:.55rem 0"><strong>Documented:</strong> lot 5 covers mobile-app development and maintenance. BAM is recorded as the awardee from May 2025. Atos France developed the versions certified in 2023.</p>
<p style="margin:.55rem 0"><strong>Financial risk:</strong> inability to use FranceConnect+ or a mobile credential for urgent training, benefit or corporate filing.</p>
<p style="margin:.55rem 0"><strong>Fallback:</strong> it depends on the end service. Part two found alternatives involving post, an external certificate or an in-person visit.</p>
<p style="margin:.55rem 0"><strong>Unknown:</strong> contractual correction time, the State’s build capability, app-store publishing accounts and handover procedure.</p>
</div></details>
<details style="border:1px solid #2b3038;border-radius:10px;background:#101319;margin:.75rem 0;padding:.85rem 1rem">
<summary style="cursor:pointer;color:#f5f6f8;font-weight:700">The SGIN backend becomes unavailable</summary>
<div style="margin-top:.85rem;color:#d6d9df">
<p style="margin:.55rem 0"><strong>Documented:</strong> lot 6 covers server applications. France Identité says the servers are hosted on the Interior Ministry cloud PI.</p>
<p style="margin:.55rem 0"><strong>Financial risk:</strong> authentication or credential generation may fail across several services relying on the same identity layer.</p>
<p style="margin:.55rem 0"><strong>Fallback:</strong> no public matrix shows which functions remain available offline or without the backend for each connected service.</p>
<p style="margin:.55rem 0"><strong>Unknown:</strong> RTO, RPO, failover tests and France Titres’ access to repositories, deployment images and recovery secrets.</p>
</div></details>
<details style="border:1px solid #2b3038;border-radius:10px;background:#101319;margin:.75rem 0;padding:.85rem 1rem">
<summary style="cursor:pointer;color:#f5f6f8;font-weight:700">The State electronic seal is unavailable</summary>
<div style="margin-top:.85rem;color:#d6d9df">
<p style="margin:.55rem 0"><strong>Documented:</strong> DNUM provides SIGNHOR. Keys are protected in ANSSI-qualified HSMs, and only SGIN may request the seal under this policy.</p>
<p style="margin:.55rem 0"><strong>Financial risk:</strong> inability to generate signed identity evidence needed for a rental, contract or procedure.</p>
<p style="margin:.55rem 0"><strong>Fallback:</strong> a recipient may accept another document, depending on its policy and the applicable law.</p>
<p style="margin:.55rem 0"><strong>Unknown:</strong> signing-service redundancy, restoration time and liability when evidence arrives after a deadline.</p>
</div></details>
<details style="border:1px solid #2b3038;border-radius:10px;background:#101319;margin:.75rem 0;padding:.85rem 1rem">
<summary style="cursor:pointer;color:#f5f6f8;font-weight:700">A supplier fails or changes control</summary>
<div style="margin-top:.85rem;color:#d6d9df">
<p style="margin:.55rem 0"><strong>Documented:</strong> the lots are separated and include award incompatibilities. iDAKTO announced its acquisition of Stelau in June 2026.</p>
<p style="margin:.55rem 0"><strong>Financial risk:</strong> loss of expertise, slower fixes, transition cost or dependence on a proprietary component.</p>
<p style="margin:.55rem 0"><strong>Fallback:</strong> contract terms can provide for continuity and exit. The signed agreements needed to establish whether, how and within what deadlines they apply are not available in this public record.</p>
<p style="margin:.55rem 0"><strong>Unknown:</strong> change-of-control notifications, recusal rules, source-code escrow, tested reversibility and exit assistance.</p>
</div></details>
<details style="border:1px solid #2b3038;border-radius:10px;background:#101319;margin:.75rem 0;padding:.85rem 1rem">
<summary style="cursor:pointer;color:#f5f6f8;font-weight:700">An identity is wrongly revoked or rejected</summary>
<div style="margin-top:.85rem;color:#d6d9df">
<p style="margin:.55rem 0"><strong>Documented:</strong> France Identité can gate access to FranceConnect+ and sensitive procedures. The service terms provide support and complaint channels.</p>
<p style="margin:.55rem 0"><strong>Financial risk:</strong> delayed benefit, lost training place, blocked corporate signature or missed contract.</p>
<p style="margin:.55rem 0"><strong>Fallback:</strong> there is no single public appeal route for every connected service. Each operator retains its own procedures.</p>
<p style="margin:.55rem 0"><strong>Unknown:</strong> correction time, retroactive preservation of rights and liability sharing among France Titres, the end service and the technical supplier.</p>
</div></details>
<p style="margin:1rem 0 0;color:#8b909b;font-size:.85rem">This tool does not predict an outage. It converts a technical chain into questions of continuity, liability and financial loss.</p></div>

## Operational risk becomes financial risk

France Identité contains neither a bank account nor a monetary balance. The app by itself does not give the State a power to seize or freeze a citizen’s money.

Financial risk appears through functional dependency.

Part two documented services where FranceConnect+ accelerates access to training, a benefit or a corporate filing. France Identité presents certified identity as a route to [Mon Compte Formation, MaPrimeRénov and INPI](https://france-identite.gouv.fr/identite-numerique-certifiee/). When the identity layer fails, a user may be pushed to a slower path involving post, an external certificate or an in-person visit.

A common failure can therefore produce correlated blocks even when end services remain legally and technically distinct.

<figure class="infographic infographic-readable" style="padding-bottom:1.5rem" tabindex="0" aria-label="WHEN IDENTITY FAILS, RISK PROPAGATES">
<svg viewBox="0 0 360 790" width="100%" role="img" aria-labelledby="failure-en-title failure-en-desc" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;height:auto;overflow:hidden;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;background:#0c0d10">
<title id="failure-en-title">WHEN IDENTITY FAILS, RISK PROPAGATES</title>
<desc id="failure-en-desc">A technical incident can become an economic loss</desc>
<rect x="1" y="1" width="358" height="788" rx="16" fill="#0c0d10" stroke="#2b3038"/>
<text x="18" y="42" fill="#f5f6f8" font-size="11.5" font-weight="700">WHEN IDENTITY FAILS, RISK PROPAGATES</text>
<text x="18" y="64" fill="#8b909b" font-size="8.5">A technical incident can become an economic loss</text>
<rect x="24" y="92" width="312" height="78" rx="11" fill="#101319" stroke="#7aa2f7"/>
<text x="40" y="119" fill="#7aa2f7" font-size="10.5" font-weight="700">COMPONENT</text>
<text x="40" y="144" fill="#f5f6f8" font-size="9.5">App, backend, key or certificate</text><path d="M180 170 V192" stroke="#7aa2f7" stroke-width="2"/><path d="M174 184 L180 194 L186 184" fill="#7aa2f7"/>
<rect x="24" y="196" width="312" height="78" rx="11" fill="#101319" stroke="#a78bfa"/>
<text x="40" y="223" fill="#a78bfa" font-size="10.5" font-weight="700">IDENTITY PROOF</text>
<text x="40" y="248" fill="#f5f6f8" font-size="9.5">Authentication or credential rejected</text><path d="M180 274 V296" stroke="#a78bfa" stroke-width="2"/><path d="M174 288 L180 298 L186 288" fill="#a78bfa"/>
<rect x="24" y="300" width="312" height="78" rx="11" fill="#101319" stroke="#f5b13d"/>
<text x="40" y="327" fill="#f5b13d" font-size="10.5" font-weight="700">SERVICE</text>
<text x="40" y="352" fill="#f5f6f8" font-size="9.5">FranceConnect+, benefit or filing blocked</text><path d="M180 378 V400" stroke="#f5b13d" stroke-width="2"/><path d="M174 392 L180 402 L186 392" fill="#f5b13d"/>
<rect x="24" y="404" width="312" height="78" rx="11" fill="#101319" stroke="#ff85ad"/>
<text x="40" y="431" fill="#ff85ad" font-size="10.5" font-weight="700">TRANSACTION</text>
<text x="40" y="456" fill="#f5f6f8" font-size="9.5">Training, grant, contract or signature</text><path d="M180 482 V504" stroke="#ff85ad" stroke-width="2"/><path d="M174 496 L180 506 L186 496" fill="#ff85ad"/>
<rect x="24" y="508" width="312" height="78" rx="11" fill="#101319" stroke="#ff4d87"/>
<text x="40" y="535" fill="#ff4d87" font-size="10.5" font-weight="700">LOSS</text>
<text x="40" y="560" fill="#f5f6f8" font-size="9.5">Delay, missed deadline or extra cost</text><path d="M180 586 V608" stroke="#ff4d87" stroke-width="2"/><path d="M174 600 L180 610 L186 600" fill="#ff4d87"/>
<rect x="24" y="612" width="312" height="78" rx="11" fill="#101319" stroke="#5eead4"/>
<text x="40" y="639" fill="#5eead4" font-size="10.5" font-weight="700">LIABILITY</text>
<text x="40" y="664" fill="#f5f6f8" font-size="9.5">Who fixes, repays and compensates?</text>
<rect x="14" y="718" width="332" height="54" rx="9" fill="#15171b" stroke="#3a4049"/>
<text x="28" y="741" fill="#aeb4bf" font-size="8.5">This is a risk chain, not an already established incident.</text>
<text x="28" y="759" fill="#6f7580" font-size="8">l0g analysis based on FranceConnect+ uses and the service terms.</text>
</svg>
<figcaption>The financial risk does not come from a bank account stored in France Identité. It comes from economic operations depending on a valid digital identity.</figcaption>
</figure>

The scenario does not predict a nationwide outage. It imposes analytical discipline:

```text
Failed component
→ unavailable or rejected identity
→ inaccessible economic service
→ delay or deadline
→ measurable loss
→ liability to allocate
```

The most important metric will not be France Identité’s availability percentage alone. Public accountability requires:

- maximum critical-incident response time;
- recovery time objective, or RTO;
- recovery point objective, or RPO;
- mean time to repair;
- number of end transactions affected;
- ability to preserve rights retroactively;
- compensation mechanism.

## The terms limit stated liability

The terms promise availability “as far as possible” 24 hours a day and seven days a week. They allow testing, maintenance and emergency intervention and disclaim responsibility for resulting direct or indirect consequences.

The liability section says France Identité cannot guarantee the absence of errors. It classifies financial and commercial losses, lost customers, profit or reputation as indirect loss excluded from its stated responsibility. It also disclaims responsibility for continuity, durability, compatibility, performance and bugs. [The wording is in the current terms](https://france-identite.gouv.fr/conditions-generales-utilisation/cgu-sgin/).

The same document contains an important provision: France Identité may subcontract any part of the service, but remains **solely responsible to the user**, with recourse against its subcontractors.

The terms do not prove that compensation is legally impossible. Their effect depends on French administrative liability, mandatory national law, GDPR, eIDAS, negligence and the end service involved.

eIDAS already allocates liability in certain cross-border identification transactions when damage results intentionally or negligently from a breach. The new framework applies corresponding liability rules to EUDI Wallets. [The consolidated text contains Article 11 and the reference in Article 5a](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:02014R0910-20241018).

The practical question remains simple:

> An identity error costs someone a training place, delays a grant or blocks a company closure. Must the user act against France Titres, the end service, the authentication operator or the technical supplier?

The subcontracting clause supplies part of the answer: users should not have to identify every contractor before approaching France Identité. It still publishes no compensation table, payment deadline or single mechanism for economic losses.

## The missing documents

Public material provides names, functions and ceilings. It does not measure recovery capability.

l0g seeks release, with necessary security redactions, of the following records.

### For each lot

- engagement act;
- administrative terms;
- technical specification;
- amendments;
- call-off orders;
- invoices and amounts paid;
- declared subcontractors;
- acceptance records;
- penalties imposed.

### For reversibility

- detailed intellectual-property clauses;
- proprietary component inventory;
- third-party licence status;
- source-code deposit or escrow;
- exit plan;
- tested handover report;
- Atos-to-BAM transition record;
- account and secret matrix;
- post-contract assistance period.

### For continuity

- contractual RTO and RPO;
- business-continuity plan;
- disaster-recovery plan;
- restoration results;
- multi-supplier crisis exercises;
- fallback modes by use case;
- insurance and liability limits.

Those records need not expose vulnerabilities, secrets or administrative paths. Recovery objectives, allocation of responsibility, amounts paid and proof that a reversibility test succeeded can be published without compromising the system.

## l0g methodology

This article uses five documentary layers:

1. the Senate budget report for programme cost and France Titres outsourcing;
2. the EU procurement notice for functions, ceilings, durations and lot incompatibilities;
3. French public-procurement essential data for awardees and notification dates;
4. France Identité pages and policies for hosting, signing, intellectual property and liability;
5. official ANSSI certification reports and company statements to reconstruct historical suppliers and their own claims.

The method keeps five categories separate:

```text
ESTABLISHED
Official record, law or public data

DECLARED
Statement by France Identité or a supplier

INFERRED
Logical consequence explicitly identified as l0g analysis

UNKNOWN
Information absent from reviewed records

TO BE TESTED
Recovery, reversibility or behaviour requiring evidence
```

The article does not turn:

- a ceiling into expenditure;
- an agency-wide outsourcing rate into a France Identité-specific rate;
- marketing into an official architecture map;
- an acquisition into a conflict of interest;
- an intellectual-property clause into proof of operational skill;
- certification of a mobile version into certification of the whole infrastructure;
- a contractual disclaimer into a final ruling on compensation rights.

Questions must now go to France Titres, DNUM, ANSSI and the awardees. Any response should be incorporated with its date, scope and supporting evidence.

## Documentary sources

Institutional sources and public data:

- [French Senate 2026 budget report on France Titres](https://www.senat.fr/rap/l25-139-32/l25-139-32_mono.html)
- [EU notice 58709-2025 for the seven SGIN framework contracts](https://ted.europa.eu/en/notice/-/detail/58709-2025)
- [Official French public-procurement essential-data dataset](https://www.data.gouv.fr/datasets/donnees-essentielles-de-la-commande-publique-decp-arrete-du-22-12-2022-marches)
- [France Identité security page](https://france-identite.gouv.fr/securite-application/)
- [France Identité signature policy](https://france-identite.gouv.fr/politique-de-signature/)
- [SGIN terms of use](https://france-identite.gouv.fr/conditions-generales-utilisation/cgu-sgin/)
- [ANSSI CSPN report for France Identité Android 1.2.4](https://messervices.cyber.gouv.fr/visas/ANSSI-CSPN-2023-22-rapport.pdf)
- [ANSSI CSPN report for France Identité iOS 1.2.3](https://messervices.cyber.gouv.fr/visas/ANSSI-CSPN-2023-21-rapport.pdf)
- [French Economy Ministry release on IN Groupe’s acquisition of IDEMIA Smart Identity](https://presse.economie.gouv.fr/creation-dun-champion-mondial-de-lidentite-letat-soutient-le-rachat-par-in-groupe-didemia-smart-identity/)
- [Regulation (EU) 2024/1183 on the European Digital Identity Wallet](https://eur-lex.europa.eu/eli/reg/2024/1183/oj/eng)
- [Consolidated eIDAS Regulation as of 18 October 2024](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:02014R0910-20241018)

Company statements, used only to attribute the companies’ own claims:

- [iDAKTO case study on France Identité](https://www.idakto.com/case-studies/france-identite/)
- [iDAKTO announcement of its Stelau acquisition](https://www.idakto.com/blog/idakto-accelerates-its-growth-with-the-acquisition-of-stelau-specialist-in-cybersecurity-for-digital-identity-infrastructure/)

## Evidence of operational sovereignty

France Identité combines substantial public control with an extensive contract chain.

The State says it hosts the servers. It retains the electronic seal, timestamping and signing keys. ANTS claims intellectual-property rights over the service. Lot separation limits supplier concentration.

At the same time, seven frameworks cover coordination, expertise, security, mobile apps, backend and testing. The Senate describes high outsourcing across France Titres. Supplier handovers, recovery plans, deployment accounts, tested reversibility and financial allocation of liability are not assembled in a public, verifiable record.

The evidence therefore does not establish that the State has lost control. It also does not establish that it can independently take over every component within a known time.

Real sovereignty is measured on the day a supplier stops answering.

> **Has the State bought skills it can take over, or a dependency it will discover only during the first major incident?**

For the user, the paired question is:

> **When the contract chain fails and identity no longer opens access to a benefit, signature or filing, who bears the loss?**

## Limitations and update date

Document review closed on **28 August 2026**.

l0g did not have access to signed contracts, call-off orders, source repositories, build pipelines, secrets, service dashboards or production-recovery plans. No outage, failover or reversibility test was conducted for this article. Amounts paid, effective subcontractors, RTO/RPO targets and compensation mechanisms remain to be obtained through the right of reply and documentary requests.
