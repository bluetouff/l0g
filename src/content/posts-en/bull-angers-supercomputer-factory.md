---
title: "Bull in Angers: chips, factory floors and cash flow"
seoTitle: "Bull in Angers: supercomputers and supply chains | l0g"
description: "Bull announces doubled capacity in Angers. Chips, integration, contracts and cash flow reveal the industrial chain behind Europe’s supercomputers."
pubDate: "2026-10-02T09:55:39+02:00"
updatedDate: "2026-10-02T09:55:39+02:00"
tags: ["industry", "supercomputers", "AI", "Europe", "financing"]
draft: false
ogImage: "/illustrations/news/bull-angers-supercomputers-2026-v1.jpg"
sourceArticle: "bull-usine-angers-supercalculateurs"
sourceUpdatedDate: "2026-10-02T09:55:39+02:00"
---

Part of Europe’s computing expansion happens on a factory floor in Angers. Bull says it has doubled production capacity there. On **1 October 2026**, Reuters reported an **€80 million investment**, citing the company’s executives. They describe capacity rising from **6 to 12 racks per month**; rack counts do not measure delivered computing power. The site assembles systems, tests them and validates customer configurations before delivery. [S01](#source-s01) [S02](#source-s02)

The expansion raises a specific industrial question: which parts of a supercomputer can Europe design, build, operate and repair? Answering it requires looking at components and technology rights, but also at testing, skills and the money tied up before a customer accepts a machine.

The public announcements use “sovereignty” to cover several goals: retaining a manufacturer, choosing a system architecture, locating capacity in Europe and controlling operations. Each addresses a different dependency. The French state’s acquisition of Bull, completed on **31 March 2026**, concerns ownership of the company. Its machines are built through an international industrial chain. [S04](#source-s04) [S05](#source-s05)

*Analysis checked October 2, 2026. France’s Economy Ministry has scheduled an Angers visit and inauguration ceremony for today; its advance programme does not confirm that they have taken place. [S19](#source-s19)*

## Where components become a system

A supercomputer combines many computing units that must work together. General-purpose processors, or CPUs, execute programs; accelerators, often GPUs, perform certain operations in parallel at very large scale. Memory supplies the data. A network carries results between units, while cooling makes sustained operation possible. The published architectures of JUPITER and Alice Recoque show how these elements fit together. [S08](#source-s08) [S09](#source-s09)

The integrator’s job is to make the combination coherent. A fast chip can spend time waiting for data. Accelerators can lose time exchanging results. A machine can reach its thermal limit before it reaches its computational limit. This is why industrial value extends across electronics, interconnection and system engineering. Bull develops the BXI network and direct liquid-cooling solutions, among other technologies. [S12](#source-s12) [S13](#source-s13)

Bull describes validation, industrialisation, assembly, testing and spare-parts management at Angers. Their economic value continues after shipment: diagnosing a fault, replacing a part, maintaining a configuration or adapting a system requires an understanding of the whole machine. Repeated projects and operating experience help build that capability. [S02](#source-s02)

The customer is therefore buying a usable result backed by an industrial delivery obligation. For LUMI-AI, the contract announced by EuroHPC explicitly covers acquisition, delivery, installation and maintenance. The hardware order comes with responsibilities that extend into the system’s operating life. [S06](#source-s06)

## Three systems reveal different dependencies

The accelerated module of **JUPITER**, in Jülich, uses Nvidia GH200 components and a Quantum-2 InfiniBand network. A ParTec–Eviden consortium supplied the system; Eviden was the name used for the business that included Bull at the time. Its European integration is combined with Nvidia technology. [S09](#source-s09)

The announced **Alice Recoque** configuration combines AMD CPUs and GPUs, a computing partition based on SiPearl’s Rhea2 and the BXI v3 network. The CEA says installation is underway, with user availability planned for 2027. [S18](#source-s18) **LUMI-AI** is also planned around AMD processors, using BullSequana XH3500 architecture, IBM storage and a Nokia networking contribution alongside BXI. These are announced project configurations, rather than an inventory of fully accepted systems. [S08](#source-s08) [S14](#source-s14)

These choices demonstrate an ability to combine technology ecosystems. They also leave identifiable dependencies: chip supply, associated memory, software tools and replacement parts. Switching vendors can require changes to boards, networking or application code. Modularity provides options; the time and cost of using them depend on the work needed to validate a different combination. That is a technical implication of the described architectures, not an estimate of a current migration project.

**Rhea1** provides a particularly recent marker. On **22 September 2026**, SiPearl and Bull announced delivery of the first samples and the start of integration into the platform intended for JUPITER’s CPU module. Performance results still needed consolidation. The announcement documents this integration milestone, with commercial release targeted for the end of 2026. [S10](#source-s10)

In its July 8, 2025 release, SiPearl describes Rhea1’s Arm cores and entrusts manufacturing to **TSMC**. European design therefore retains a relationship with an external foundry. That observation concerns Rhea1; it is not automatically extended to Rhea2’s manufacturing arrangements. Design location, technology ownership and manufacturing location answer different questions. [S11](#source-s11)

## Foxconn’s role redistributes the industrial work

On **17 June 2026**, Bull and Foxconn described their planned production arrangement for the Nvidia Vera Rubin NVL72 platform: manufacturing and initial testing at Foxconn’s Czech facilities, followed by assembly, integration and full validation in Angers. Bull also announced its software contribution. The statement describes an industrial organisation, without publishing a series of completed deliveries. [S05](#source-s05)

The arrangement can add scale and procurement capacity while keeping part of the validation process close to the system vendor. It also creates a handover between partners. Traceability, acceptance criteria, returns and delivery schedules must work across that boundary. The commercial value of the partnership depends on how those arrangements perform.

An EU-assembled machine can therefore incorporate a platform designed elsewhere. Using that platform can still leave the integrator with substantial responsibility for the overall system, deployment and support. The practical question is who can change which element, with what skills and on what timetable. The available announcements identify roles; they do not provide a complete bill of materials or the detailed rights held by each partner.

## A bigger factory changes the bottleneck

Production capacity describes what a facility could produce. Actual use depends on demand, supplies and testing speed. Doubling assembly capacity may shorten a queue, but its effect on deliveries depends on the other stages.

Consider an **entirely hypothetical** production line where each of three stages can process 100 equivalent units. Increasing assembly and testing capacity to 200 leaves output at 100 if components still arrive at a rate of 100. With component supply and assembly at 200 but testing at 140, output becomes 140. Once all three stages reach 200, output capacity also doubles.

<figure class="infographic l0g-bull-figure" style="max-width:28rem;margin:2rem auto;padding-bottom:1.25rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 430" role="img" aria-labelledby="bull-en-throughput-title bull-en-throughput-desc" style="width:100%;height:auto">
<title id="bull-en-throughput-title">Output follows the bottleneck</title>
<desc id="bull-en-throughput-desc">Hypothetical output: 100, 100, 140 and 200, the minimum of three stage capacities.</desc>
<rect width="480" height="430" rx="12" fill="var(--color-surface)" />
<text x="24" y="40" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="var(--color-paper)" font-weight="700" text-anchor="start">Output follows the bottleneck</text>
<text x="24" y="74" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-muted)" font-weight="400" text-anchor="start">Hypothetical · index, baseline 100</text>
<text x="24" y="116" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-paper)" font-weight="400" text-anchor="start">Baseline</text>
<text x="456" y="116" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-paper)" font-weight="700" text-anchor="end">100</text>
<rect data-value="100" x="24" y="128" width="200.00000000" height="18" fill="var(--color-signal)" />
<text x="24" y="182" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-paper)" font-weight="400" text-anchor="start">Components limited</text>
<text x="456" y="182" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-paper)" font-weight="700" text-anchor="end">100</text>
<rect data-value="100" x="24" y="194" width="200.00000000" height="18" fill="var(--color-signal)" />
<text x="24" y="248" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-paper)" font-weight="400" text-anchor="start">Testing limited</text>
<text x="456" y="248" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-paper)" font-weight="700" text-anchor="end">140</text>
<rect data-value="140" x="24" y="260" width="280.00000000" height="18" fill="var(--color-signal)" />
<text x="24" y="314" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-paper)" font-weight="400" text-anchor="start">Balanced line</text>
<text x="456" y="314" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-paper)" font-weight="700" text-anchor="end">200</text>
<rect data-value="200" x="24" y="326" width="400.00000000" height="18" fill="var(--color-signal)" />
<text x="24" y="374" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-muted)" font-weight="400" text-anchor="start">0</text>
<text x="224" y="374" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-muted)" font-weight="400" text-anchor="middle">100</text>
<text x="424" y="374" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-muted)" font-weight="400" text-anchor="end">200</text>
<text x="24" y="412" font-family="Arial, Helvetica, sans-serif" font-size="18" fill="var(--color-paper)" font-weight="700" text-anchor="start">Output = minimum of 3 stages</text>
</svg>
<figcaption>l0g calculation, <a href="/data/bull-angers-throughput-model.csv">stage capacities</a>. Equivalent units, dimensionless index. Components / assembly / testing: 100/100/100; 100/200/200; 200/200/140; 200/200/200. Steady state, sufficient demand, equal yields, no rework or buffers. Hypothetical example, no measured Bull throughput.</figcaption>
</figure>

The model assumes homogeneous systems, enough orders, constant yields and no rework. Its purpose is to locate the bottleneck. Real supercomputers differ in density, cooling and complexity. Rack counts are an industrial measure; translating them into useful computing capacity requires knowing what each rack contains.

The same reasoning applies to customer acceptance. Delivery can be held up by an unfinished building, power availability, system-wide tests or configuration validation. Enlarging Angers can remove one obstacle while making the next one more visible. An important operating measure is the time between component availability and customer acceptance of the finished system.

## Different figures follow different financial paths

The figures surrounding Bull concern different transactions. **€404 million** is the maximum enterprise value of the disposal by Atos, including **€104 million of contingent earn-outs**. The implied non-contingent component of that valuation is €300 million. It is not, by itself, cash injected into Bull or the net equity price after transaction adjustments. [S03](#source-s03)

The factory investment concerns the production asset. **LUMI-AI’s €387.8 million**, by contrast, covers an equipment-and-services contract. EuroHPC and the hosting consortium each fund half, or **€193.9 million each**. Availability is planned for 2027, with the consortium specifying the second half of the year. [S01](#source-s01) [S06](#source-s06) [S07](#source-s07)

Alice Recoque adds a further scope: the CEA describes **€554 million in total project investment over five operating years**. EuroHPC separately specifies **€354.8 million for acquisition, delivery, installation and maintenance**. The two figures cover different scopes; their difference does not provide a detailed breakdown of operating costs. [S17](#source-s17) Treating that envelope as immediate Bull revenue, or mechanically adding it to the Finnish contract, would erase the differences between project budgets, contracts and receipts. [S08](#source-s08)

These distinctions matter when assessing industrial returns. A contract provides work for the factory and helps spread fixed costs. It also requires components to be purchased and service obligations to be fulfilled. The amount retained by the vendor depends on procurement prices, its own work, warranties and maintenance. The public sources reviewed here do not disclose that breakdown or Bull’s margin by system.

## Winning an order can absorb cash

Timing differences in the operating cycle create a working-capital requirement. Financing may therefore be needed before any eventual profit. Take a **fictitious €100 million contract** with €80 million of direct cash outlays. The customer pays €10 million at signing while the manufacturer pays out €25 million. A further €40 million leaves during assembly. The cumulative financing need then reaches **€55 million**.

At acceptance, the customer pays €80 million and the manufacturer incurs another €10 million of outlays. A final €10 million payment, accompanied by €5 million of direct costs, leaves a positive €20 million balance. Overheads, R&D, financing, taxes and other omitted items still have to be considered. This residual is not a measure of Bull’s accounting profit.

<figure class="infographic l0g-bull-figure" style="max-width:28rem;margin:2rem auto;padding-bottom:1.25rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 440" role="img" aria-labelledby="bull-en-cash-title bull-en-cash-desc" style="width:100%;height:auto">
<title id="bull-en-cash-title">Cash before the final payment</title>
<desc id="bull-en-cash-desc">Hypothetical cumulative cash, EUR millions: −15, −55, +15, +20.</desc>
<rect width="480" height="440" rx="12" fill="var(--color-surface)" />
<text x="24" y="40" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="var(--color-paper)" font-weight="700" text-anchor="start">Cash before the final payment</text>
<text x="24" y="74" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-muted)" font-weight="400" text-anchor="start">Hypothetical · cumulative, EUR m</text>
<text x="24" y="116" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-paper)" font-weight="400" text-anchor="start">Signing · month 0</text>
<text x="456" y="116" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-paper)" font-weight="700" text-anchor="end">−15</text>
<rect data-value="-15" x="226.50000000" y="128" width="37.50000000" height="18" fill="var(--color-accent)" />
<path d="M264 124 V150" fill="none" stroke="var(--color-line-strong)" />
<text x="24" y="182" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-paper)" font-weight="400" text-anchor="start">Assembly · month 4</text>
<text x="456" y="182" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-paper)" font-weight="700" text-anchor="end">−55</text>
<rect data-value="-55" x="126.50000000" y="194" width="137.50000000" height="18" fill="var(--color-accent)" />
<path d="M264 190 V216" fill="none" stroke="var(--color-line-strong)" />
<text x="24" y="248" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-paper)" font-weight="400" text-anchor="start">Acceptance · month 8</text>
<text x="456" y="248" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-paper)" font-weight="700" text-anchor="end">+15</text>
<rect data-value="15" x="264.00000000" y="260" width="37.50000000" height="18" fill="var(--color-signal)" />
<path d="M264 256 V282" fill="none" stroke="var(--color-line-strong)" />
<text x="24" y="314" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-paper)" font-weight="400" text-anchor="start">Final payment · month 12</text>
<text x="456" y="314" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-paper)" font-weight="700" text-anchor="end">+20</text>
<rect data-value="20" x="264.00000000" y="326" width="50.00000000" height="18" fill="var(--color-signal)" />
<path d="M264 322 V348" fill="none" stroke="var(--color-line-strong)" />
<text x="114" y="374" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-muted)" font-weight="400" text-anchor="middle">−60</text>
<text x="264" y="374" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-muted)" font-weight="400" text-anchor="middle">0</text>
<text x="414" y="374" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-muted)" font-weight="400" text-anchor="middle">+60</text>
<text x="24" y="416" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-paper)" font-weight="700" text-anchor="start">Peak financing need: EUR 55m</text>
</svg>
<figcaption>l0g calculation, <a href="/data/bull-angers-cash-model.csv">full payment schedule</a>. Fictitious contract: EUR 100m received and EUR 80m direct outlays. Common scale with a central zero; each bar shows cash accumulated at a milestone. Same-milestone inflows and outflows are netted, without intraday ordering. The EUR 20m residual precedes overheads, R&D, financing, tax and other omitted costs; the model does not estimate Bull’s profit.</figcaption>
</figure>

A delay in acceptance can extend the required borrowing. In a separate sensitivity, carrying **€55 million for another 90 days at 6% a year** costs roughly **€814,000**, using simple interest and a 365-day basis. This is a calculation, with no probability assigned to a delay.

The example helps explain the economic value of testing and integration. Solving a problem before shipment can avoid a more expensive blockage at the customer’s site. Advance payments, acceptance conditions and supplier terms can matter as much as the headline order book. Detailed contracts that would allow these effects to be quantified for Bull were outside the public evidence verified for this article.

## Warm water becomes part of computing economics

Cooling is another capability that a manufacturer can sell. Bull describes warm-water direct liquid cooling for LUMI-AI, together with planned heat recovery for Kajaani’s district-heating network. These are project characteristics and objectives; operating results will have to be measured once the system is running. [S14](#source-s14)

The economics become clearer through **power usage effectiveness**, or [PUE](/en/glossary/pue/): total data-centre energy divided by the energy used by IT equipment. A PUE of 1.30 means every unit consumed by IT is accompanied by another 0.30 units for site infrastructure, including cooling, electrical distribution and other auxiliaries. The boundary extends beyond the water circuit alone. [S15](#source-s15)

<figure class="infographic l0g-bull-figure" style="max-width:28rem;margin:2rem auto;padding-bottom:1.25rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 400" role="img" aria-labelledby="bull-en-energy-title bull-en-energy-desc" style="width:100%;height:auto">
<title id="bull-en-energy-title">The cost of site infrastructure</title>
<desc id="bull-en-energy-desc">Hypothetical year: unchanged 10 MW IT load, PUE 1.30 then 1.10, electricity EUR 120/MWh.</desc>
<rect width="480" height="400" rx="12" fill="var(--color-surface)" />
<text x="24" y="40" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="var(--color-paper)" font-weight="700" text-anchor="start">The cost of site infrastructure</text>
<text x="24" y="74" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-muted)" font-weight="400" text-anchor="start">Hypothetical · energy, GWh/year</text>
<text x="24" y="110" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-signal)" font-weight="700" text-anchor="start">IT</text>
<text x="104" y="110" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-amber)" font-weight="700" text-anchor="start">Site overhead</text>
<text x="24" y="152" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-paper)" font-weight="400" text-anchor="start">PUE 1.3</text>
<text x="456" y="152" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-paper)" font-weight="700" text-anchor="end">113.88</text>
<rect data-value="87.6" x="24" y="164" width="292.00000000" height="18" fill="var(--color-signal)" />
<rect data-value="26.28" x="316.00000000" y="164" width="87.60000000" height="18" fill="var(--color-amber)" />
<text x="24" y="232" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-paper)" font-weight="400" text-anchor="start">PUE 1.1</text>
<text x="456" y="232" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-paper)" font-weight="700" text-anchor="end">96.36</text>
<rect data-value="87.6" x="24" y="244" width="292.00000000" height="18" fill="var(--color-signal)" />
<rect data-value="8.76" x="316.00000000" y="244" width="29.20000000" height="18" fill="var(--color-amber)" />
<text x="24" y="290" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-muted)" font-weight="400" text-anchor="start">0</text>
<text x="224" y="290" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-muted)" font-weight="400" text-anchor="middle">60</text>
<text x="424" y="290" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-muted)" font-weight="400" text-anchor="end">120</text>
<text x="24" y="336" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="var(--color-paper)" font-weight="700" text-anchor="start">Difference: EUR 2.10m/year</text>
<text x="24" y="376" font-family="Arial, Helvetica, sans-serif" font-size="18" fill="var(--color-muted)" font-weight="400" text-anchor="start">Unchanged IT load and price</text>
</svg>
<figcaption>l0g calculation, <a href="/data/bull-angers-energy-model.csv">annual assumptions and results</a>. Average IT load 10 MW × 8,760 h = 87.6 GWh; site energy = IT energy × PUE. Same hypothetical EUR 120/MWh tariff; reduction of 17.52 GWh, or EUR 2,102,400 annually. PUE definition: <a href="#source-s15">DOE/FEMP</a>. No measured Bull or LUMI-AI consumption; no heat-recovery revenue.</figcaption>
</figure>

In our physical example, an average **10 MW IT load** runs over a year of 8,760 hours. At **€120 per MWh**, moving from a PUE of **1.30 to 1.10**, with the same IT load, reduces the annual bill from **€13.67 million to €11.56 million**. The difference is **€2.10 million**, or about **15.4%** of initial total energy use. These are teaching assumptions, unrelated to reported consumption at Angers or LUMI-AI.

Heat recovery needs a separate calculation involving temperature, distance to the network, seasonal demand, equipment and connection costs. The model assigns no revenue to recovered heat. Likewise, a better PUE describes the infrastructure supporting IT; algorithms and actual machine use still determine the cost of a useful result.

## Control also has to work after delivery

A computing centre can have powerful machines and still need to adapt its applications. Management software, libraries and user support are part of the offering described by Bull. The skills needed to compile, distribute and verify workloads carry the industrial task beyond assembly. [S12](#source-s12)

Europe’s market also contains other suppliers: EuroHPC selected **HPE** for HammerHAI in March 2026. That provides a concrete example of an alternative offer. Performance comparisons require the same workload, numerical precision and energy boundary. A double-precision scientific-computing figure and an AI figure using lower precision describe different operations. [S16](#source-s16) [S09](#source-s09)

Assessing the Angers expansion will therefore require tracking accepted deliveries, repair times, operating costs and the ability to change components or software. A documented bill of materials would also help measure locally retained value added. Reuters also reports that 70% of components are made in Europe, a figure attributed to Bull’s executives. The report gives neither its denominator nor its methodology; it cannot establish the share of value added retained locally. [S01](#source-s01)

The documents describe a tangible industrial base: Bull retains capabilities in system design, integration, networking, cooling and support. The expanded factory is intended to deliver those capabilities at greater scale. Their value will be tested through systems that are accepted, maintained and used, with a clear account of the dependencies that keep them running.

## Further reading

- [China’s AI ambitions meet the factory floor](/en/analysis/ai-slowdown-4-china-chips-memory-factories/) traces dependencies across chips, memory and manufacturing.
- [When credit starts sorting AI](/en/analysis/when-credit-starts-sorting-ai/) connects machines, commitments and financing conditions.
- [Industrial heat: the premium and year six](/en/analysis/industrial-heat-if26-carbon-premium-year-six/) examines the costs of an energy conversion.

## Sources

<ol class="l0g-bull-sources">
<li id="source-s01"><a href="https://www.reuters.com/world/europe/french-supercomputer-maker-bull-doubles-output-boost-europes-ai-ambitions-2026-10-01/">Reuters : French supercomputer maker Bull doubles output to boost Europe’s AI ambitions</a>. 2026-10-01; Reuters, attributed executive statements, dispatch checked through <a href="https://www.investing.com/news/economy-news/exclusivefrench-supercomputer-maker-bull-doubles-output-to-boost-europes-ai-ambitions-4928583">Investing.com’s licensed republication</a>.</li>
<li id="source-s02"><a href="https://www.bull.com/fr/about/notre-usine-du-futur">Bull : L’usine du futur de Bull et les sites industriels</a>. Undated page, checked October 2, 2026.</li>
<li id="source-s03"><a href="https://www.atosgroup.com/en/press/atos-group-completes-sale-bull-its-advanced-computing-activities-french-state">Atos Group : Atos Group completes the sale of Bull, its Advanced Computing activities, to the French State</a>. 2026-03-31.</li>
<li id="source-s04"><a href="https://presse.economie.gouv.fr/letat-finalise-lacquisition-de-bull-et-positionne-la-france-a-la-pointe-du-calcul-haute-performance-et-de-lia/">Ministère français de l’Économie : L’État finalise l’acquisition de Bull</a>. 2026-03-31.</li>
<li id="source-s05"><a href="https://www.bull.com/en/press-releases/bull-foxconn-advance-european-ai-infrastructure-with-nvidia-vera-rubin-nvl72">Bull et Foxconn : Bull and Foxconn advance European AI infrastructure with NVIDIA Vera Rubin NVL72 platform built in Europe</a>. 2026-06-17.</li>
<li id="source-s06"><a href="https://www.eurohpc-ju.europa.eu/eurohpc-ju-signs-contract-deploy-lumi-ai-supercomputer-2026-08-31_en">EuroHPC JU : EuroHPC JU Signs Contract to Deploy the LUMI-AI Supercomputer</a>. 2026-08-31.</li>
<li id="source-s07"><a href="https://lumi-supercomputer.eu/bull-to-deliver-lumi-ai-supercomputer/">LUMI / CSC : Bull selected to deliver LUMI-AI supercomputer, powering next-generation AI workloads and beyond</a>. 2026-08-31.</li>
<li id="source-s08"><a href="https://www.cea.fr/english/Pages/News/eviden-deliver-alice-recoque-new-european-exascale-supercomputer.aspx">CEA : EuroHPC JU and the Jules Verne consortium selected Eviden to deliver Alice Recoque</a>. 2025-11-18.</li>
<li id="source-s09"><a href="https://www.fz-juelich.de/en/jupiter">Forschungszentrum Jülich : JUPITER – The New Dimension of Computing</a>. Undated page, checked October 2, 2026.</li>
<li id="source-s10"><a href="https://www.bull.com/en/press-releases/sipearl-delivers-the-first-rhea1-cpus-to-bull-for-integration-into-jupiter-europes-fastest-operating-supercomputer">Bull et SiPearl : SiPearl delivers the first Rhea1 CPUs to Bull for integration into JUPITER</a>. 2026-09-22.</li>
<li id="source-s11"><a href="https://sipearl.com/wp-content/uploads/2025/07/English_version.pdf">SiPearl : SiPearl: Rhea1 production milestone</a>. 2025-07-08; Rhea1 fabrication only, old timing superseded by S10.</li>
<li id="source-s12"><a href="https://www.bull.com/en/products/hpc/bullsequana-xh3500-supercomputer">Bull : BullSequana XH3500 supercomputer</a>. Undated page, checked October 2, 2026.</li>
<li id="source-s13"><a href="https://www.bull.com/en/products/hpc/bullsequana-exascale-interconnect">Bull : BullSequana eXascale Interconnect</a>. Undated page, checked October 2, 2026.</li>
<li id="source-s14"><a href="https://www.bull.com/en/press-releases/bull-to-deliver-europe-387.8-million-lumi-ai-supercomputer-finland">Bull : Bull selected to deliver Europe’s €387.8 million LUMI-AI supercomputer in Finland</a>. 2026-08-31.</li>
<li id="source-s15"><a href="https://www.energy.gov/cmei/femp/cooling-water-efficiency-opportunities-federal-data-centers">U.S. Department of Energy / FEMP : Cooling Water Efficiency Opportunities for Federal Data Centers</a>. Undated page, checked October 2, 2026; PUE definition only.</li>
<li id="source-s16"><a href="https://www.eurohpc-ju.europa.eu/eurohpc-ju-signs-contract-deploy-ai-supercomputer-hammerhai-2026-03-16_en">EuroHPC JU : EuroHPC JU Signs Contract to Deploy AI Supercomputer HammerHAI</a>. 2026-03-16.</li>
<li id="source-s17"><a href="https://www.eurohpc-ju.europa.eu/contract-signed-alice-recoque-europes-new-exascale-supercomputer-2025-11-18_en">EuroHPC JU : Contract Signed for Alice Recoque, Europe’s New Exascale Supercomputer</a>. 2025-11-18.</li>
<li id="source-s18"><a href="https://www-ccrt.cea.fr/fr/AliceRecoque.html">CEA / TGCC : Alice Recoque</a>. Undated page, checked October 2, 2026.</li>
<li id="source-s19"><a href="https://presse.economie.gouv.fr/nar-deplacement-de-roland-lescure-et-anne-le-henanff-a-angers-vendredi-2-octobre-2026/">Ministère de l’Économie : Déplacement à Angers le vendredi 2 octobre 2026</a>. 2026-09-30.</li>
</ol>

## Scope and method

Company sources document their own products and announcements; budgets and contracts are cross-checked with buyers or operators. The component share reported to Reuters is not a measure of value added. Future configurations, availability targets and unfinished performance measurements remain attributed to announcements. All three figures are hypothetical l0g models, with no measured Bull production, cash flow or consumption.

Throughput is the minimum of the three capacities. Cash flows equal receipts less direct outlays; cumulative cash sums these flows. The delay sensitivity is 55,000,000 × 0.06 × 90 / 365 = EUR 813,698.63. It assumes simple-interest financing and forecasts no actual delay. Annual energy is 10 × 8,760 × PUE in MWh, multiplied by EUR 120/MWh for cost. The 15.4% relative reduction uses initial total energy as its denominator. Linked CSVs supply inputs and results. Examples exclude buffers, probabilities, tax, variable tariffs and heat-recovery revenue.
