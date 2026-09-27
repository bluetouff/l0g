---
title: "China’s AI ambitions meet the factory floor"
seoTitle: "Chinese AI: chips, memory and competition | l0g"
description: "Huawei, CXMT and Loongson: from wafer production to delivered systems, how Chinese competition develops in AI chips, memory and the software that runs them."
pubDate: "2026-09-27T15:22:17+02:00"
tags: ["AI", "semiconductors", "China", "memory", "industry", "competition"]
draft: false
ogImage: "/illustrations/news/ia-chine-puces-usines-v1.jpg"
sourceArticle: "ia-ralentissement-4-chine-puces-memoire-usines"
sourceUpdatedDate: "2026-09-27T15:22:17+02:00"
---

*The price of slowing down · Part 4*

On September 17, 2026, Huawei presented Atlas 960E, infrastructure designed to make thousands of processors work together. Three days later, CXMT announced volume production of its G5 memory generation. The announcements concern different stages of manufacturing: Huawei says its Atlas 960 system is still being tested, while CXMT’s new LPDDR5X products target phones and portable electronics. High-bandwidth memory, or HBM, used alongside large AI accelerators requires a separate production chain. [CXMT](https://www.cxmt.com/en/news/info_22.html) · [Huawei](https://www.huawei.com/de/news/2026/atlas-960e-superpod-fuer-ki-modelle)

**Competition can begin long before complete industrial independence.** A customer needs another infrastructure capable of doing the required work, in sufficient quantities, at an acceptable cost and with dependable service. After [Chinese models and their prices](/en/analysis/ai-slowdown-3-chinese-models-price-competition/), this fourth instalment examines the machines and factories behind them.

Restricting access to a machine may delay a research programme. It can also make investment in a competing machine more attractive. The debate about slowing AI development needs to examine those possible effects on production, software and customers’ choices.

## From model weights to machines

A model’s weights are the numerical values learned during training. Publishing them allows others to obtain those values. It does not supply either the equipment that produced them or the computers needed to use them. DeepSeek V3 offers a specific historical example: its December 2024 report describes training on **2,048 NVIDIA H800 GPUs**, graphics processors used as computing accelerators. The model’s Chinese origin did not make its computing infrastructure wholly Chinese. This document does not describe training undertaken in September 2026. [DeepSeek V3 report, section 3.1](https://arxiv.org/html/2412.19437v1)

Training and answering a user are also different jobs. Training adjusts the parameters; inference applies the model to new requests. Coordinating calculations across machines matters enormously in the first. In the second, a customer’s acceptable waiting time and the number of requests processed together can change the most economical arrangement. Equipment suited to one job is not necessarily the best choice for the other. [DeepSeek V3](https://arxiv.org/html/2412.19437v1) · [CloudMatrix384](https://arxiv.org/html/2506.12708v1)

Consider how a request is handled, without pretending to reconstruct any particular data centre. A general-purpose processor, the CPU, runs software that helps organise the service. Accelerators perform large numbers of calculations in parallel. Parameters and intermediate results must be stored, read and moved. When work is distributed, the machines exchange data too. The system documented by Huawei and SiliconFlow combines **384 Ascend 910C accelerators with 192 Kunpeng CPUs**. AI has not made the rest of the computer disappear. [Serving Large Language Models on Huawei CloudMatrix384](https://arxiv.org/html/2506.12708v1)

A system can run short of arithmetic capacity, memory space or the ability to move data quickly enough. These are separate constraints. More computing units offer little benefit if they sit idle waiting for inputs. Engineers call the amount of data that can travel per second *bandwidth*. Memory capacity tells you how much fits. It does not tell you how quickly you can read it. [All About Rooflines](https://jax-ml.github.io/scaling-book/roofline/)

## Sometimes the processor is waiting

A hypothetical example makes the distinction tangible. Suppose a fixed workload requires 20 milliseconds of computation and 80 milliseconds of data transfer. In an idealised model where those activities overlap completely, the duration cannot fall below the longer one: 80 milliseconds. Doubling computing power reduces its contribution to 10 milliseconds, but leaves that lower bound unchanged.

Doubling bandwidth instead cuts transfer time to 40 milliseconds. The lower bound becomes 40 milliseconds. Real systems face dependencies and other delays that limit overlap. The example isolates why the most impressive component does not always determine the speed that matters.

<figure class="infographic" style="max-width:33rem;margin:2rem auto;padding-bottom:1rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 420" role="img" aria-labelledby="ai-chips-en-bottleneck-title ai-chips-en-bottleneck-desc" style="width:100%;height:auto" font-family="Arial, Helvetica, sans-serif">
<title id="ai-chips-en-bottleneck-title">Compute or data transfer?</title>
<desc id="ai-chips-en-bottleneck-desc">Entirely hypothetical example. Same task, fully overlapping computation and transfer. Baseline: compute 20 ms, transfer 80 ms, lower bound 80 ms. Twice the compute: 10 ms and 80 ms, lower bound 80 ms. Twice the bandwidth: 20 ms and 40 ms, lower bound 40 ms. All six bars start at zero; ideal duration = maximum of the two times.</desc>
<rect x="0" y="0" width="500" height="420" rx="6" fill="var(--color-surface)"/>
<text x="24" y="34" font-size="24" font-weight="700" text-anchor="start" fill="var(--color-paper)">Compute or data transfer?</text>
<text x="24" y="60" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-muted)">Simulation · same task</text>
<rect x="24" y="74" width="16.000000" height="16" fill="var(--color-signal)"/>
<text x="48" y="89" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-paper)">Compute</text>
<rect x="250" y="74" width="16.000000" height="16" fill="var(--color-accent)"/>
<text x="274" y="89" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-paper)">Transfer</text>
<text x="24" y="117" font-size="22" font-weight="700" text-anchor="start" fill="var(--color-paper)">Baseline</text>
<text x="476" y="117" font-size="20" font-weight="400" text-anchor="end" fill="var(--color-paper)">Lower bound: 80 ms</text>
<rect x="24" y="131" width="80.000000" height="18" fill="var(--color-signal)"/>
<text x="114" y="147" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-paper)">20</text>
<rect x="24" y="159" width="320.000000" height="18" fill="var(--color-accent)"/>
<text x="354" y="175" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-paper)">80</text>
<text x="24" y="205" font-size="22" font-weight="700" text-anchor="start" fill="var(--color-paper)">Compute ×2</text>
<text x="476" y="205" font-size="20" font-weight="400" text-anchor="end" fill="var(--color-paper)">Lower bound: 80 ms</text>
<rect x="24" y="219" width="40.000000" height="18" fill="var(--color-signal)"/>
<text x="74" y="235" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-paper)">10</text>
<rect x="24" y="247" width="320.000000" height="18" fill="var(--color-accent)"/>
<text x="354" y="263" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-paper)">80</text>
<text x="24" y="293" font-size="22" font-weight="700" text-anchor="start" fill="var(--color-paper)">Bandwidth ×2</text>
<text x="476" y="293" font-size="20" font-weight="400" text-anchor="end" fill="var(--color-paper)">Lower bound: 40 ms</text>
<rect x="24" y="307" width="80.000000" height="18" fill="var(--color-signal)"/>
<text x="114" y="323" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-paper)">20</text>
<rect x="24" y="335" width="160.000000" height="18" fill="var(--color-accent)"/>
<text x="194" y="351" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-paper)">40</text>
<path d="M24 368H424 M24 364V372 M224 364V372 M424 364V372" fill="none" stroke="var(--color-muted)" stroke-width="2"/>
<text x="24" y="398" font-size="20" font-weight="400" text-anchor="middle" fill="var(--color-muted)">0</text>
<text x="224" y="398" font-size="20" font-weight="400" text-anchor="middle" fill="var(--color-muted)">50</text>
<text x="424" y="398" font-size="20" font-weight="400" text-anchor="middle" fill="var(--color-muted)">100</text>
<text x="300" y="398" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-muted)">ms</text>
</svg>
<figcaption>l0g simulation, September 27, 2026. Durations for one unchanged task, in milliseconds. Full overlap and no other delays: ideal duration = max(compute, transfer), giving 80, 80 and 40 ms. Real dependencies can increase these durations. Principle: <a href="https://jax-ml.github.io/scaling-book/roofline/">All About Rooflines</a>. No actual hardware is measured.</figcaption>
</figure>

Huawei specifies up to 8 exaflops at FP8 and 16 at FP4 for Atlas 960E. An exaflop is a billion billion floating-point operations per second. FP8 and FP4 are numerical formats with different precision. Comparing application performance requires keeping the workload and output quality comparable. Huawei’s figures are the vendor’s announced specifications. [Huawei’s technical announcement](https://www.huawei.com/en/news/2026/9/hc-ascend960-supernode)

Using fewer bits can reduce memory requirements. Developers must still assess the effect on output quality and whether their software uses the format efficiently. Hugging Face’s documentation explains the trade-offs involved in *quantisation*, the use of more compact numerical representations. [Transformers documentation](https://huggingface.co/docs/transformers/main/en/quantization/overview)

For customers, useful performance means getting a sufficiently good answer within an acceptable time. MLPerf defines throughput scenarios, latency requirements and quality targets. Where power measurements accompany a test, they cover the whole system at the wall during the specified workload. [MLCommons methodology](https://mlcommons.org/benchmarks/inference-datacenter/) · [MLPerf Inference Rules](https://github.com/mlcommons/inference_policies/blob/master/inference_rules.adoc)

These distinctions matter when evaluating an alternative supplier. A less powerful card may be useful in a different system design. But if that design needs more machines, the comparison must include networking, electricity and installation. Conversely, moving data more efficiently can reduce equipment requirements without a new processor generation. Both are engineering possibilities, not financial results already established for Huawei.

## From printed circuits to usable chips

A footnote in CXMT’s release is crucial: the announced increase of **at least 50% in gross dies per wafer**, relative to G4, is normalised to an 8-gigabit capacity baseline. That count comes before sorting out functioning components. Estimating manufacturing costs would also require the usable proportion and the resources needed to produce it. [G5 announcement, methodological note](https://www.cxmt.com/en/news/info_22.html)

A silicon wafer contains many circuits that will eventually be separated into individual dies. Some fail electrical requirements. Manufacturing yield is the usable proportion, not the factory’s financial return. Consider two entirely hypothetical processes producing circuits of equal capacity.

The first fits 100 dies on a wafer, of which 90% are usable: 90 good dies. The second fits 150, but only 60% are usable: again, 90. These are not estimated yields for any manufacturer. They simply show the missing step between gross output and saleable components.

<figure class="infographic" style="max-width:33rem;margin:2rem auto;padding-bottom:1rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 420" role="img" aria-labelledby="ai-chips-en-yield-title ai-chips-en-yield-desc" style="width:100%;height:auto" font-family="Arial, Helvetica, sans-serif">
<title id="ai-chips-en-yield-title">More dies, same usable output</title>
<desc id="ai-chips-en-yield-desc">Entirely hypothetical example, equal-capacity dies. Process A: 100 gross dies per wafer, 90% yield, 90 usable and 10 rejected. Process B: 150 gross dies, 60% yield, 90 usable and 60 rejected. Two stacked bars share a 0–150-die scale. No actual manufacturing yield is represented.</desc>
<rect x="0" y="0" width="500" height="420" rx="6" fill="var(--color-surface)"/>
<text x="24" y="34" font-size="24" font-weight="700" text-anchor="start" fill="var(--color-paper)">More dies, same usable output</text>
<text x="24" y="68" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-muted)">Simulation · one wafer per process</text>
<rect x="24" y="88" width="16.000000" height="16" fill="var(--color-signal)"/>
<text x="48" y="103" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-paper)">Usable</text>
<rect x="250" y="88" width="16.000000" height="16" fill="var(--color-accent)"/>
<text x="274" y="103" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-paper)">Rejected</text>
<text x="24" y="146" font-size="22" font-weight="700" text-anchor="start" fill="var(--color-paper)">Process A</text>
<text x="476" y="146" font-size="22" font-weight="400" text-anchor="end" fill="var(--color-paper)">Yield: 90%</text>
<rect x="24" y="163" width="234.000000" height="26" fill="var(--color-signal)"/>
<rect x="258.0" y="163" width="26.000000" height="26" fill="var(--color-accent)"/>
<text x="24" y="215" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-muted)">90 usable + 10 rejected = 100</text>
<text x="24" y="248" font-size="22" font-weight="700" text-anchor="start" fill="var(--color-paper)">Process B</text>
<text x="476" y="248" font-size="22" font-weight="400" text-anchor="end" fill="var(--color-paper)">Yield: 60%</text>
<rect x="24" y="265" width="234.000000" height="26" fill="var(--color-signal)"/>
<rect x="258.0" y="265" width="156.000000" height="26" fill="var(--color-accent)"/>
<text x="24" y="317" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-muted)">90 usable + 60 rejected = 150</text>
<path d="M24 352H414 M24 348V356 M154 348V356 M284 348V356 M414 348V356" fill="none" stroke="var(--color-muted)" stroke-width="2"/>
<text x="24.0" y="383" font-size="20" font-weight="400" text-anchor="middle" fill="var(--color-muted)">0</text>
<text x="154.0" y="383" font-size="20" font-weight="400" text-anchor="middle" fill="var(--color-muted)">50</text>
<text x="284.0" y="383" font-size="20" font-weight="400" text-anchor="middle" fill="var(--color-muted)">100</text>
<text x="414.0" y="383" font-size="20" font-weight="400" text-anchor="middle" fill="var(--color-muted)">150</text>
<text x="250" y="409" font-size="20" font-weight="400" text-anchor="middle" fill="var(--color-muted)">Dies per wafer · equal capacity</text>
</svg>
<figcaption>l0g simulation, assumptions set September 27, 2026. Usable dies = gross dies × yield: 100 × 90% = 150 × 60% = 90. No estimate of CXMT’s or any other manufacturer’s yield. Manufacturing cost is not calculated. CXMT’s announced gross-die gain is discussed separately in the text and its <a href="https://www.cxmt.com/en/news/info_22.html">methodological note</a>.</figcaption>
</figure>

The industrial success of miniaturisation also depends on defects, processing steps, equipment time and the production ramp. Two processes producing the same number of good dies can have very different costs. Our example counts only the components obtained.

HBM introduces a further challenge. This form of DRAM, or working memory, stacks dies and uses many connections to feed an accelerator rapidly. It requires precision assembly as well as the manufacture of memory cells. Progress in mobile memory can strengthen a company’s capabilities without proving that it has mastered this separate production chain. [Micron’s explanation of HBM](https://www.micron.com/products/memory/hbm)

Imec’s assembly research shows why individual components cannot be considered in isolation. Alignment, surface preparation and the selection of already-tested dies affect the finished result. A working die is not yet a reliable stack. This research explains the challenge; it does not measure yields at Chinese factories. [Imec research on die assembly](https://www.imec-int.com/en/press/imec-demonstrates-die-wafer-hybrid-bonding-cu-interconnect-pad-pitch-2mm)

Established suppliers should face the same distinction. In its March 16, 2026 announcement, Micron separately reported volume shipments of 12-layer HBM4 and customer sampling of a 16-layer product. At that date, the latter product was still at the sampling stage. Treating both as immediately available in quantity would distort the comparison just as much. [Micron’s 16 March 2026 announcement](https://investors.micron.com/news/press-release/2026/Micron-in-High-Volume-Production-of-HBM4-Designed-for-NVIDIA-Vera-Rubin-PCIe-Gen6-SSD-and-SOCAMM2-03-16-2026/default.aspx)

For CXMT’s G5 platform, manufacturing yield remains unknown in the documents examined. A verified full cost for comparable HBM also remains unavailable. The mobile-memory announcement supplies information about that particular segment; assessing HBM requires product-specific and assembly-specific data.

## Smaller features, different measurements

Lithography patterns the structures used to build circuits. When a desired feature density exceeds what one exposure can directly produce, several processing operations can create a finer pattern. ASML describes this use of *multiple patterning* in its deep-ultraviolet (DUV) lithography equipment; CXMT separately refers to a quadruple-patterning technique. That explains a possible manufacturing approach, without identifying the actual tools in CXMT’s factories. [ASML documentation](https://www.asml.com/en/products/duv-lithography-systems/twinscan-nxt1980di) · [CXMT](https://www.cxmt.com/en/news/info_22.html)

Nanometres also need context. A physical measurement within a memory array is not interchangeable with the commercial name of a logic-process generation. Comparing the numbers without identifying the underlying measurement can produce a meaningless ranking.

TechInsights provides an independent finding on a shipped product. In its 2023 examination of the Kirin 9000s in Huawei’s Mate 60 Pro, it identified SMIC’s 7 nm N+2 process from physical observations of the chip. The public analysis leaves open manufacturing yield and the origin of the equipment used. [TechInsights’ public analysis](https://techinsights.com/blog/techinsights-finds-smic-7nm-n2-huawei-mate-60-pro)

Showing that a process exists is different from showing that it can be reproduced at a particular cost. That distinction is more useful than declaring either complete catch-up or permanent impossibility. Additional processing steps can make a design technically feasible while consuming more industrial capacity. Whether that is economical depends on the product and on the alternatives the buyer can actually obtain.

A business unable to purchase from its preferred supplier may accept a cost it would reject in an unrestricted market. That constraint can bring customers to a local option before it matches every characteristic of the incumbent’s product. Its lasting competitiveness will then depend on cost, reliability and further improvements.

## From system tests to deliveries

Huawei is not merely trying to substitute one accelerator card for another. Its September presentation emphasises networking and resource sharing. But its timetable distinguishes an Atlas 960 system still undergoing tests from Ascend 960DT availability targeted for the first quarter of 2027. Simulation results accompany the proposed architecture. They must not be rewritten as operating measurements from a customer installation. [Huawei’s published roadmap and status](https://www.huawei.com/de/news/2026/atlas-960e-superpod-fuer-ki-modelle)

An earlier technical paper provides a different kind of evidence. Filed in June 2025 by Huawei and SiliconFlow teams, the CloudMatrix384 paper describes serving DeepSeek R1 on Ascend hardware. Its design separates the initial processing of a prompt from the generation of successive output tokens. This documents hardware and software integration, rather than merely a proposed processor. Performance figures remain the authors’ results under their chosen conditions. [CloudMatrix384, 15 June 2025 version](https://arxiv.org/html/2506.12708v1)

CloudMatrix documents an existing integration. Current purchasable quantities, prices and continuity guarantees require additional information. The origin of memory, manufacturing tools and other components also needs checking for each supply chain.

Counting installed cards is insufficient too. What matters is how much useful work they perform over the period the customer pays for. Downtime, poor request scheduling and slow exchanges can all reduce that contribution. The relevant comparison concerns the delivered service, not the sum of product-sheet specifications. This is also why MLCommons defines separate inference scenarios. [Inference measurement rules](https://mlcommons.org/benchmarks/inference-datacenter/)

## Processors, software and switching costs

General-purpose processors are part of this offering too. Loongson documents **16, 32 and 64 physical cores** for its respective **3C6000/S, /D and /Q** configurations, using LoongArch. Core counts describe one product characteristic; comparing servers then requires tests on identical workloads. [Loongson 3C6000 product documentation](https://www.loongson.cn/product/show?id=41)

An instruction-set architecture is, roughly, the elementary language understood by a processor. LoongArch has documentation within the Linux kernel project, making its support inspectable outside Loongson’s sales catalogue. Business-application adaptations and the origin of other server components require separate examination. [Linux kernel documentation](https://docs.kernel.org/arch/loongarch/introduction.html)

vLLM, software that runs models to answer users’ requests, supports hardware integration through separate plugins. These isolate platform-specific code and reduce the changes maintained in the project’s core. The mechanism eases the engineering work needed to offer a different infrastructure. [vLLM’s hardware-plugin design](https://vllm.ai/blog/2025-05-12-hardware-plugin)

The Ascend plugin is documented, including a compatibility matrix that marks some feature combinations as partially supported or incompatible. That matrix is not a ranking against NVIDIA: it describes interactions within this implementation. Its value is that the limitations can be inspected, rather than hidden behind the word “compatible.” [vLLM Ascend documentation](https://docs.vllm.ai/projects/ascend/en/v0.23.0/) · [Version 0.23.0 feature matrix](https://docs.vllm.ai/projects/ascend/en/v0.23.0/user_guide/support_matrix/feature_matrix.html)

A customer’s switching cost therefore includes testing, performance tuning and additional work when a needed function is missing. But the point cuts both ways. Better software integration can reduce those costs without building a new factory. An incumbent’s advantage rests partly on physical products and partly on development practices. Those advantages need not erode at the same speed.

## Controls also change the customer’s calculation

American export controls extend beyond finished accelerators. The package announced on 2 December 2024 included HBM, manufacturing equipment and software. The Bureau of Industry and Security justified the measures in terms of the military and technological capabilities it sought to restrict. The scope reaches several stages of production, rather than just the sale of a completed card. [BIS, 2 December 2024 measures](https://www.bis.gov/press-release/commerce-strengthens-export-controls-restrict-chinas-capability-produce-advanced-semiconductors-military)

A separate announcement, dated January 13, 2026, introduced case-by-case review of applications covering products including the H200 and MI325X, subject to security and US customer-capacity conditions. BIS also presented controlled sales as a way to strengthen the American technology ecosystem. Each application still requires authorisation. These two announcements are dated milestones in American policy. [BIS, January 2026 licensing policy](https://www.bis.gov/press-release/department-commerce-revises-license-review-policy-semiconductors-exported-china)

These documents explicitly connect security objectives with maintaining an industrial presence. They do not establish that one objective must be a pretext for the other. Effects need to be assessed against the particular goal: delaying certain computations, restricting a military use and retaining a commercial relationship are different tests.

NVIDIA supplies a useful counterpoint to the idea that all American technology firms benefit in the same way. In its annual report for the year ended 25 January 2026, it argues that restricted access to China has helped competitors build customer and developer ecosystems. This is the assessment of a supplier affected by the rules, not an independent estimate of their net effect. It nevertheless illustrates why an exporting chipmaker’s interests can differ from those of a model developer. [NVIDIA Form 10-K, risk factors](https://www.sec.gov/Archives/edgar/data/1045810/000104581026000021/nvda-20260125.htm)

The mechanism is plausible. A supply constraint encourages a customer to fund a software adaptation, which can then be reused. The initial cost is forced upon the buyer; subsequent changes may cost less. Work around vLLM shows the kind of integration involved, without establishing how many American sales it has displaced. [Hardware-plugin architecture](https://vllm.ai/blog/2025-05-12-hardware-plugin)

Both effects can therefore coexist. A control may delay a capability in the short term while encouraging learning within a rival supply chain over a longer period. The evidence collected here does not quantify the balance. Claiming that restrictions have no consequences would be as unsupported as inferring a permanent blockade.

## Competition can begin before complete independence

Commercial relationships cross those borders. Huawei explicitly describes a strategy of monetising hardware. Elsewhere in the industry, Anthropic names Micron, Samsung and SK hynix among investors in the funding round it announced on May 28, 2026. Memory suppliers are therefore helping finance a potential source of demand. The announcement specifies no reciprocal purchasing commitment. [Huawei](https://www.huawei.com/en/news/2026/9/hc-ascend960-supernode) · [Anthropic’s Series H announcement](https://www.anthropic.com/news/series-h)

These relationships invite a more precise question: who earns what? A cheaper model might lower a laboratory’s revenue per request while increasing usage and demand for equipment. A competing chip might compress an incumbent’s margin while allowing a customer to build capacity previously beyond reach. Those are separate economic scenarios, none of which follows automatically from success on a benchmark.

The hypothesis that calls for slower development protect financial positions requires a specific inquiry: which proposed restriction would affect which competitor, and what income stream or asset would it preserve? As in [part one, on who gets to keep building AI](/en/analysis/ai-slowdown-1-who-gets-to-keep-building/), economic interests and the validity of safety warnings require separate examination. Both can coexist.

The sources describe progress in separate segments: general-purpose processors, software integration, model serving and manufacturing processes. For September’s announcements, deliverable volumes, manufacturing yields and complete costs remain to be documented. Those data will help assess the commercial durability of the new offerings.

**Another machine capable of doing the required work already gives a customer a choice.** That option can matter in negotiations before it replaces an entire market. Industrial progress is measured in delivered equipment, its full cost and the work it performs every day.

## Sources

- CXMT, 2026-09-20. [CXMT Announces Mass Production of 5th-Generation DRAM Technology Platform](https://www.cxmt.com/en/news/info_22.html).
- Huawei, 2026-09-17. [Huawei Unveils Atlas 960E SuperPoD](https://www.huawei.com/en/news/2026/9/hc-ascend960-supernode).
- Huawei Deutschland, 2026-09-18. [Huawei stellt Atlas 960E SuperPoD vor](https://www.huawei.com/de/news/2026/atlas-960e-superpod-fuer-ki-modelle).
- DeepSeek-AI, 2024-12-27. [DeepSeek-V3 Technical Report, v1](https://arxiv.org/html/2412.19437v1).
- Huawei / SiliconFlow, 2025-06-15. [Serving Large Language Models on Huawei CloudMatrix384, v1](https://arxiv.org/html/2506.12708v1).
- Jacob Austin et al., 2025-02-04. [How to Think About GPUs and TPUs / All About Rooflines](https://jax-ml.github.io/scaling-book/roofline/).
- Hugging Face, accessed September 27, 2026. [Transformers: Quantization overview](https://huggingface.co/docs/transformers/main/en/quantization/overview).
- MLCommons, accessed September 27, 2026. [MLPerf Inference: Datacenter](https://mlcommons.org/benchmarks/inference-datacenter/).
- Micron, accessed September 27, 2026. [High-bandwidth memory (HBM)](https://www.micron.com/products/memory/hbm).
- imec, 2024-05-29. [Die-to-wafer hybrid bonding with a Cu interconnect pad pitch of 2 µm](https://www.imec-int.com/en/press/imec-demonstrates-die-wafer-hybrid-bonding-cu-interconnect-pad-pitch-2mm).
- Micron, 2026-03-16. [Micron in High-Volume Production of HBM4 Designed for NVIDIA Vera Rubin](https://investors.micron.com/news/press-release/2026/Micron-in-High-Volume-Production-of-HBM4-Designed-for-NVIDIA-Vera-Rubin-PCIe-Gen6-SSD-and-SOCAMM2-03-16-2026/default.aspx).
- ASML, accessed September 27, 2026. [TWINSCAN NXT:1980Di](https://www.asml.com/en/products/duv-lithography-systems/twinscan-nxt1980di).
- TechInsights, accessed September 27, 2026. [TechInsights Finds SMIC 7nm (N+2) in Huawei Mate 60 Pro](https://techinsights.com/blog/techinsights-finds-smic-7nm-n2-huawei-mate-60-pro).
- Loongson, accessed September 27, 2026. [Loongson 3C6000 product page](https://www.loongson.cn/product/show?id=41).
- Linux kernel, accessed September 27, 2026. [Introduction to LoongArch](https://docs.kernel.org/arch/loongarch/introduction.html).
- vLLM / Ascend contributors, 2025-05-12. [Introducing vLLM Hardware Plugin, Best Practice from Ascend NPU](https://vllm.ai/blog/2025-05-12-hardware-plugin).
- vLLM Ascend contributors, accessed September 27, 2026. [vLLM Ascend documentation, v0.23.0](https://docs.vllm.ai/projects/ascend/en/v0.23.0/).
- vLLM Ascend contributors, accessed September 27, 2026. [Feature Matrix, v0.23.0](https://docs.vllm.ai/projects/ascend/en/v0.23.0/user_guide/support_matrix/feature_matrix.html).
- US Bureau of Industry and Security, 2024-12-02. [Commerce Strengthens Export Controls to Restrict China’s Capability to Produce Advanced Semiconductors for Military Applications](https://www.bis.gov/press-release/commerce-strengthens-export-controls-restrict-chinas-capability-produce-advanced-semiconductors-military).
- US Bureau of Industry and Security, 2026-01-13. [Department of Commerce Revises License Review Policy for Semiconductors Exported to China](https://www.bis.gov/press-release/department-commerce-revises-license-review-policy-semiconductors-exported-china).
- NVIDIA / SEC EDGAR, accessed September 27, 2026. [Form 10-K, fiscal year ended 25 January 2026](https://www.sec.gov/Archives/edgar/data/1045810/000104581026000021/nvda-20260125.htm).
- Anthropic, 2026-05-28. [Anthropic announces Series H funding](https://www.anthropic.com/news/series-h).
- MLCommons, accessed September 27, 2026. [MLPerf Inference Rules](https://github.com/mlcommons/inference_policies/blob/master/inference_rules.adoc).

## Method and limitations

Documentary research cut off on **27 September 2026**. Production announcements and performance claims are attributed to their authors. l0g conducted no hardware tests, benchmarks or factory audits. TechInsights’ public analysis is distinct from its full commercial report, which was not accessed. The CloudMatrix work was produced by the system’s developers. Both figures use entirely hypothetical numbers and represent no manufacturer. The social illustration is conceptual and does not depict actual equipment. American policy documents are discussed at the stated dates, not as legal advice on a particular export transaction. No direct right-of-reply correspondence with the companies was undertaken for this instalment.
