---
title: "Google: what is access to our searches worth?"
seoTitle: "Google Search data: access costs, DMA and privacy | l0g"
description: "Google challenges search data sharing. An analysis of the DMA, eligibility thresholds, future access costs and the safeguards for personal data."
pubDate: "2026-10-01T16:41:06+02:00"
updatedDate: "2026-10-01T16:41:06+02:00"
ogImage: "/illustrations/news/google-search-data-access-2026-v1.jpg"
tags: ["Google", "DMA", "Personal data", "Competition", "AI"]
draft: false
sourceArticle: "google-donnees-recherche-prix-acces-vie-privee"
sourceUpdatedDate: "2026-10-01T16:41:06+02:00"
---

A search engine also learns in the space between a question and a click. Someone typing “leak under sink” may want a plumber, a repair manual or a replacement part. The results they inspect, their position on the page and subsequent reformulations offer clues. At scale, these interactions become a resource for improving search. Interpreting them requires care: prominent links attract more attention. [8](#source-8) [9](#source-9)

Access to that resource is at the centre of Google’s dispute with the European Commission. A decision adopted on **16 July 2026** specifies how search data must be shared with competitors. On **30 September**, Reuters reported that Google had asked the EU General Court to suspend the obligation, citing a risk of serious harm to privacy. [1](#source-1) [3](#source-3)

Behind the litigation lies a practical economic question. What would a rival pay for useful observations, and how much more would it have to spend to turn them into a better search engine? Answering it means examining eligibility, shared costs and the transformations applied before delivery.

## Search observations opened to rivals

The [Digital Markets Act, or DMA](/en/glossary/dma/), regulates certain large platforms designated as gatekeepers. Article 6(11) requires access for other search engines to ranking, query, click and view data on fair, reasonable and non-discriminatory terms. Personal data concerning the users who generated the searches must be anonymised. The July decision specifies how Google Search must implement this obligation. [6](#source-6) (Article 6(11) and recital 61) [1](#source-1)

The product offered to a competitor is a collection of observations about how the search engine is used. It can help interpret queries, identify pages worth crawling or improve ranking. Google keeps its algorithms and infrastructure. The recipient has to develop its own technology from the signals it receives. Chatbots with a search function are within scope, with access tied to that activity. [1](#source-1) (Annex, paragraphs 9–24 and 51–54)

That distinction matters for AI. An assistant retrieving documents to support an answer could use the data to improve source selection. Training the underlying general-purpose language model is excluded; the decision’s reasoning specifies that exclusion for pretraining. Specialised models may be trained or fine-tuned to improve search, ranking and the grounding of answers in sources. That permission excludes the underlying general-purpose model. [1](#source-1) (Paragraph 854; Annex, paragraph 51 and footnote 6)



The money follows a separate path. The competitor pays Alphabet for access, then funds its own staff, data processing and compliance arrangements. The mechanism provides no individual payment to the users who generated the interactions. The Commission’s intended benefit for them is broader choice through competing services. That is an objective, with outcomes to be measured after implementation. [1](#source-1) (Annex, paragraphs 87–100) [11](#source-11)

## A click file still needs interpretation

Consider two links displayed one thousand times each. The first is examined on 80% of occasions, the second on 20%. Assume that, once someone examines either link, their probability of clicking is the same: 20%. The result is 160 clicks for the first link and 40 for the second.

A superficial comparison suggests that one result performs four times better. In this example, exposure explains the entire difference. Relative to the occasions on which each link was actually examined, both have a 20% click rate. **These are hypothetical values**, chosen to isolate the mechanism. They are not measurements of Google or any competitor.

Search researchers have studied this problem for years. A 2005 paper by Joachims and co-authors examines the relationship between visual attention, clicks and relevance. A 2018 paper by Google researchers studies how to estimate position bias in personal search. The papers establish the importance of the problem and investigate ways to correct for it. They do not estimate what improvement the 2026 European dataset would deliver. [9](#source-9) [8](#source-8)

<figure class="infographic" style="max-width:28rem;margin:2rem auto;padding-bottom:1.25rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 482" role="img" aria-labelledby="google-search-en-click-title google-search-en-click-desc" style="width:100%;height:auto">
<title id="google-search-en-click-title">The exposure effect</title>
<desc id="google-search-en-click-desc">Clicks per display: A 16%, B 4%. Clicks per examination: both 20%. Hypothetical example · click rates.</desc>
<rect width="480" height="482" rx="12" fill="var(--color-surface)" />
<text x="28" y="40" text-anchor="start" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700">The exposure effect</text>
<text x="28" y="72" text-anchor="start" fill="var(--color-muted)" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400">Hypothetical example · click rates</text>
<text x="28" y="108" text-anchor="start" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="700">Clicks / displays</text>
<text x="28" y="264" text-anchor="start" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="700">Clicks / examinations</text>
<text x="28" y="142" text-anchor="start" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="400">Link A · 160 / 1,000</text>
<rect x="28" y="150" width="240.00000000" height="18" fill="var(--color-signal)" />
<text x="452" y="168" text-anchor="end" fill="var(--color-signal)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700">16%</text>
<text x="28" y="206" text-anchor="start" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="400">Link B · 40 / 1,000</text>
<rect x="28" y="214" width="60.00000000" height="18" fill="var(--color-accent)" />
<text x="452" y="232" text-anchor="end" fill="var(--color-accent)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700">4%</text>
<text x="28" y="294" text-anchor="start" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="400">Link A · 160 / 800</text>
<rect x="28" y="302" width="300.00000000" height="18" fill="var(--color-signal)" />
<text x="452" y="320" text-anchor="end" fill="var(--color-signal)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700">20%</text>
<text x="28" y="358" text-anchor="start" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="400">Link B · 40 / 200</text>
<rect x="28" y="366" width="300.00000000" height="18" fill="var(--color-accent)" />
<text x="452" y="384" text-anchor="end" fill="var(--color-accent)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700">20%</text>
<text x="28" y="462" text-anchor="start" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="700">Same rate once examined: 20%</text>
<path d="M28 400 H328" stroke="var(--color-line-strong)" fill="none" />
<text x="28" y="428" text-anchor="middle" fill="var(--color-muted)" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400">0</text>
<text x="178.0" y="428" text-anchor="middle" fill="var(--color-muted)" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400">10</text>
<text x="328" y="428" text-anchor="middle" fill="var(--color-muted)" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400">20%</text>
</svg>
<figcaption>l0g teaching model: 1,000 displays per link, 800 examinations for A and 200 for B, 20% click probability after examination. Common 0–20% scale. Examination counts are assumed known; these values measure neither actual relevance nor Google. Methodological basis: <a href="#source-8">Wang et al., 2018</a> and <a href="#source-9">Joachims et al., 2005</a>. <a href="/data/google-search-click-bias-example.csv">CSV assumptions and calculations</a>.</figcaption>
</figure>

A buyer therefore needs to assess what it can genuinely learn. Rare queries may help it understand specialist vocabulary. Older observations remain useful for recurring needs, but reveal less about an event that has just happened. The dataset’s value depends on what survives filtering, which metadata remain and whether the recipient can extract signals that transfer to its own users.

All this affects the total cost. Receiving a file resolves an access problem. Training, quality testing, index maintenance and customer acquisition still need funding. The investment case depends on the improvement achieved across these activities, with uncertainty specific to each search service.

## Before the price comes eligibility

The published framework restricts access to established search engines and credible entrants meeting specified criteria. A company must have offered search services in the EU for at least the previous two consecutive years. A company founded less than two years ago has an alternative route if it has received **more than €50 million in capital investment**. Either route also requires **at least 50,000 monthly average EU users over the preceding year**. [1](#source-1) (Annex, paragraph 3(c), PDF page 343)

The €50 million condition applies to the second route, for younger companies. An older company already operating a search engine can meet the track-record condition without raising that amount. Capital alone does not satisfy the audience requirement. Additional checks cover security, sanctions and the conditions under which data are processed or transferred. [1](#source-1) (Annex, paragraphs 1–8)



These rules define the market to which the pricing framework would apply. A small team building its first prototype would not, on that basis alone, meet the published conditions. The instrument addresses operators with an operating history or substantial funding, and a minimum audience in either case.

Assurance requirements create another commitment. An independent auditor must assess the recipient’s safeguards before access. A compliance review follows within six months of processing beginning, then at least annually. The recipient needs a segregated environment, access restrictions and controls against prohibited uses. Those expenses sit on top of Google’s bill. [2](#source-2) (Eligibility and audit conditions) [1](#source-1) (Annex, paragraphs 69–86)

## Pricing the file, or pricing the work of sharing it

The decision makes it possible to compare two commercial approaches. It describes Alphabet’s previous offer, with prices per **one thousand unique queries** varying according to the recipient’s search revenue in the European Economic Area. The schedule cited in paragraph 1006 ranged from **€1.50 to €9 per thousand unique queries**, with intermediate tiers of €3 and €6. This is the offer assessed before the decision, not a January 2027 price list. [1](#source-1) (Paragraph 1006, PDF page 271)

The earlier programme also has a revealing baseline: when the decision recorded its assessment, only one applicant had obtained a licence and bought a small sample. That describes the programme examined before the new measures, not access granted by 1 October. The document does not establish that price alone caused the limited uptake. [1](#source-1) (Paragraph 13, PDF page 9)

The July measures take a different starting point: the additional costs needed to share the data, plus a permitted return on the capital strictly required for that activity. The return is capped at Alphabet’s weighted average cost of capital, the rate representing the cost of its financing. Eligible costs include preparation, anonymisation, dedicated storage and transmission. [1](#source-1) (Annex, paragraphs 87–95)

The boundary matters. Ordinary business expenses, historical investments unrelated to making the data available and legal costs arising from the dispute are excluded from that cost base. Alphabet disputes aspects of cost-based pricing and the return-on-capital cap; its arguments are reproduced in the decision. The document also explains the Commission’s reasons for adopting the methodology. [1](#source-1) (Paragraphs 1009–1011; Annex, paragraph 95)

There are exceptions. An additional margin may be justified in specified circumstances, including where Alphabet demonstrates that its own commercial use of the data cannot cover efficiently incurred collection costs, or where a recipient operates at very large scale under the stated thresholds. Micro, small and medium-sized enterprises are exempt from this additional margin. The framework therefore allows different treatment in defined circumstances, while retaining the fair, reasonable and non-discriminatory requirement. [1](#source-1) (Annex, paragraphs 88–90 and footnotes 13–15)

**Public documents verified as of 1 October provide no definitive euro-denominated price schedule establishing a prospective applicant’s future bill.** Google’s licensing page says pricing details will be shared with applicants in due course. [13](#source-13) The implementation timetable requires the final pricing offer to be completed and communicated to the Commission and third-party search engines within six months of adoption, in January 2027 under the published timetable. The Commission can extend that period in the circumstances set out in the Annex. The following figures are therefore a teaching model. [2](#source-2) (Implementation timetable) [1](#source-1) (Annex, paragraphs 135–136)

## Your bill also depends on the other customers

The price must have a fixed component and a recurring component. The first covers recipient-specific one-off costs and a share of common setup costs. The second covers the recipient’s recurring costs and a share of common annual costs. The initial allocation uses a justified estimate of expected beneficiaries. Pricing must be finalised within six months of adoption using a count that includes applicants who have engaged an auditor for the first assurance review, as well as search engines already assessed as eligible. The same fixed component then applies to actual recipients regardless of when they join, subject to objectively different recipient-specific costs. Recurring common costs are divided each year among beneficiaries actually receiving access. [1](#source-1) (Annex, paragraphs 94, 97 and 135)

Take a deliberately simple example. Common setup costs are €600,000, initially allocated across four beneficiaries, with €30,000 of additional onboarding costs for each. The fixed component is **€180,000 per beneficiary**.

Now assume €400,000 of annual common costs and €20,000 of recipient-specific recurring costs per customer. With four active customers, the annual component is **€120,000 each**. It rises to **€220,000** if only two remain, and falls to **€70,000** if there are eight. The calculation holds unit costs and the scope of the service constant.

<figure class="infographic" style="max-width:28rem;margin:2rem auto;padding-bottom:1.25rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 390" role="img" aria-labelledby="google-search-en-cost-title google-search-en-cost-desc" style="width:100%;height:auto">
<title id="google-search-en-cost-title">Sharing common costs</title>
<desc id="google-search-en-cost-desc">Annual cost per recipient: €220,000 with two recipients, €120,000 with four, €70,000 with eight. Assumptions · € thousands per year.</desc>
<rect width="480" height="390" rx="12" fill="var(--color-surface)" />
<text x="28" y="40" text-anchor="start" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700">Sharing common costs</text>
<text x="28" y="72" text-anchor="start" fill="var(--color-muted)" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400">Assumptions · € thousands per year</text>
<text x="28" y="116" text-anchor="start" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="400">2 recipients</text>
<rect x="28" y="128" width="250.00000000" height="18" fill="var(--color-signal)" />
<rect x="278.0" y="128" width="25.00000000" height="18" fill="var(--color-accent)" />
<text x="452" y="146" text-anchor="end" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700">220</text>
<text x="28" y="184" text-anchor="start" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="400">4 recipients</text>
<rect x="28" y="196" width="125.00000000" height="18" fill="var(--color-signal)" />
<rect x="153.0" y="196" width="25.00000000" height="18" fill="var(--color-accent)" />
<text x="452" y="214" text-anchor="end" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700">120</text>
<text x="28" y="252" text-anchor="start" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="400">8 recipients</text>
<rect x="28" y="264" width="62.50000000" height="18" fill="var(--color-signal)" />
<rect x="90.5" y="264" width="25.00000000" height="18" fill="var(--color-accent)" />
<text x="452" y="294" text-anchor="end" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700">70</text>
<text x="28" y="378" text-anchor="start" fill="var(--color-signal)" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400">■ Common</text>
<text x="230" y="378" text-anchor="start" fill="var(--color-accent)" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400">■ Recipient-specific</text>
<path d="M28 312 H328" stroke="var(--color-line-strong)" fill="none" />
<text x="28" y="340" text-anchor="middle" fill="var(--color-muted)" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400">0</text>
<text x="178.0" y="340" text-anchor="middle" fill="var(--color-muted)" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400">120</text>
<text x="328" y="340" text-anchor="middle" fill="var(--color-muted)" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400">240</text>
</svg>
<figcaption>l0g teaching model: constant common costs of €400,000/year, plus €20,000/year specific to each recipient. Common scale: €0–240 thousand per recipient per year. The separate €180,000 upfront payment is outside these bars. Capital return, margins, taxes and internal expenses excluded. These assumptions do not estimate Alphabet’s costs. Legal mechanism: <a href="#source-1">final Annex, paragraphs 94 and 97</a>. <a href="/data/google-search-shared-cost-example.csv">CSV assumptions and calculations</a>.</figcaption>
</figure>

This is a cost-only model, with the fixed fee paid in full at the outset. It excludes any return on capital, exceptional margins, taxes and recipients’ own expenses. The inputs were chosen to illustrate allocation, not to estimate Alphabet’s costs. The decision also requires an option to spread the fixed payment over the contract, while leaving the outstanding balance payable if the recipient discontinues access early. [1](#source-1) (Annex, paragraph 94 and footnote 17)

The economic implication is conditional but clear. Where common expenses change little, fewer participants mean a larger share for those remaining. A search engine’s budget would therefore depend partly on how widely competing services adopt the mechanism. The launch count used for initial allocation remains distinct from the later number of active subscribers.

## Anonymisation also changes the product’s value

Google argues that the arrangement could expose private searches without adequate safeguards. In his **16 July** statement, Kent Walker raised privacy, business-confidentiality and security concerns. The Commission says its approach combines technical transformations, use restrictions and oversight. Their disagreement concerns how effectively those protections would work on the data actually delivered. [5](#source-5) [11](#source-11)

The prescribed process begins by removing identifiers and details that could readily link records to a user. Queries containing rare terms or exceeding specified length thresholds are suppressed. Metadata are then generalised and some queries removed so that groups defined by location, device type and language contain at least **1,000 users**. That number describes a metadata group; it is not a universal requirement for every search wording to have been repeated a thousand times. [1](#source-1) (Annex, paragraphs 25–45) [2](#source-2) (Technical protections)



At the recipient, a segregated environment must prevent prohibited linkage with other datasets. Reidentification attempts are banned, as is reconstructing users’ histories beyond the mini-sessions already included in the shared data. The received dataset may be retained for **no more than thirteen months**. Models using it for permitted purposes must also be evaluated before deployment to limit the reproduction of material that would expose users to reidentification. [1](#source-1) (Annex, paragraphs 49–55)

The safeguards also distinguish the person making a search from someone named in the query. The Commission’s FAQ says the required anonymisation concerns the former. Search text may still contain other people’s personal data, for which recipient search engines remain controllers under the GDPR. Removing direct identifiers therefore does not put the whole file outside data protection law. [2](#source-2) (personal data concerning other individuals)

The technical problem remains demanding. Draft guidelines published by the European Data Protection Board in 2026 examine the possibility of isolating a record, linking it to other information and making inferences about a person. They emphasise context and the means reasonably likely to be used. As of 1 October, the document was still under consultation. It is not a ruling on this particular Google dataset. [10](#source-10) (Paragraphs 52–65 and 95–103)

Free text combined with metadata therefore needs testing on the transformed dataset and under realistic access conditions. A contractual obligation restricts permitted behaviour; technical controls and audits are needed to verify implementation. The draft joint Commission–EDPB guidelines on the DMA and GDPR examine this combination while also requiring technical alteration of the data. [12](#source-12) (Paragraphs 175–190, draft of 9 October 2025)

For buyers, filtering changes the economic usefulness of the product. Losing rare observations can weaken learning for specialist needs. Keeping too much detail increases exposure for individuals. Assessment therefore needs to cover both use-case coverage and residual reidentification risk. The public material reviewed does not allow the underlying tests on the actual data to be reproduced in full.

## Seven days, thirteen months and five years

There are three separate clocks. Data must be shared with **at least seven days of latency** after the query. A recipient may retain the data for **up to thirteen months**. Its individual access period is the duration it chooses, capped at **five years from effective access**. That cap applies to each beneficiary; the obligation to offer the service continues while Google Search remains designated under the DMA. [1](#source-1) (Annex, paragraphs 17–24 and 55)



A search engine covering breaking news must therefore maintain its own access to fresh pages. The dataset can improve how it selects sources without becoming an instantaneous news feed. Thirteen-month retention limits accumulation of raw data; five-year access defines an investment horizon. The business case must account for that individual access ending and for the capabilities built in the meantime.

The court has a separate timetable. Reuters reported the challenge on **29 September** and the suspension request on **30 September**. Those are publication dates; the precise filing date was not verified against a court document. Article 278 of the Treaty states that bringing an action does not itself suspend the contested act. **As of 1 October 2026, no decision granting the requested suspension could be verified in the sources reviewed.** The filed application itself was not available for direct review in this research. [4](#source-4) [3](#source-3) [7](#source-7)

Uncertainty can alter when an applicant commits to integration spending. It can also affect dataset preparation and the organisation of safeguards. The cost depends on contracts, expenditure already incurred and whether that work can be reused. The reviewed sources provide no reliable aggregate estimate.

## Measuring the reform’s outcome

The published price will be one piece of evidence, alongside the costs of audits, secure infrastructure and integration. Test results will matter next: language coverage, performance on unusual queries, improved answers and the detection of privacy risks. Finally, there will be the services actually launched, the users they attract and their ability to fund ongoing operation.

Access to Google’s observations could reduce a recognised difficulty: learning from a small volume of user interactions. Each competitor still has to build a product and attract an audience. The framework also places thresholds, a price and a time limit around access. Measuring the outcome requires following that whole path, from transformed data to a search service that users choose to use.

## Following the economics of personal data

Our investigation into the [economics of personal data collection](/en/analysis/personal-data-economics-collection/) traces how observations acquire value. The chapter on [saleable profiles](/en/analysis/personal-data-traces-to-saleable-profiles/) distinguishes observations from inferences; the analysis of [enforcement costs](/en/analysis/personal-data-trade-cost-of-enforcement/) examines compliance incentives. The glossary explains [pseudonymisation](/en/glossary/pseudonymisation/) and when information can still be attributed to an individual.

## Sources and documents

<ol class="l0g-google-sources">
<li id="source-1"><a href="https://ec.europa.eu/competition/digital_markets_act/cases/202637/DMA_100209_2799.pdf">DMA.100209 : SP : Alphabet : Article 6(11), C(2026) 5091 final</a>. Final decision, 16 July 2026; public non-confidential version.</li>
<li id="source-2"><a href="https://digital-markets-act.ec.europa.eu/businesses-portal/data-access/alphabet-specification-proceedings-sharing-google-search-data_en">Alphabet specification proceedings : Sharing of Google Search data</a>. FAQ checked on 1 October 2026.</li>
<li id="source-3"><a href="https://www.investing.com/news/stock-market-news/google-asks-eu-court-to-suspend-order-to-open-up-to-ai-chatbots-search-engine-rivals-4925681">Google asks EU court to suspend order to open up to AI chatbots, search engine rivals</a>. Reuters, 30 September 2026, accessible republication.</li>
<li id="source-4"><a href="https://live.euronext.com/en/financial-news/google-challenges-eu-orders-open-ai-search-engine-rivals">Google challenges EU orders to open up to AI, search-engine rivals</a>. Reuters, 29 September 2026, accessible republication.</li>
<li id="source-5"><a href="https://blog.google/intl/de-de/feed/dma-sicherheit-privatsphaere-nicht-untergraben/">Der DMA darf Sicherheit und Privatsphäre für Europäer nicht untergraben</a>. Google’s position, 16 July 2026.</li>
<li id="source-6"><a href="https://eur-lex.europa.eu/eli/reg/2022/1925/oj">Règlement (UE) 2022/1925 : Digital Markets Act</a>. Article 6(11) and recital 61.</li>
<li id="source-7"><a href="https://eur-lex.europa.eu/eli/treaty/tfeu_2016/art_278/oj/eng">TFUE : version consolidée : article 278</a>. Article 278: no automatic suspensory effect.</li>
<li id="source-8"><a href="https://research.google/pubs/position-bias-estimation-for-unbiased-learning-to-rank-in-personal-search/">Position Bias Estimation for Unbiased Learning to Rank in Personal Search</a>. WSDM 2018, pp. 610–618.</li>
<li id="source-9"><a href="https://www.cs.cornell.edu/people/tj/publications/joachims_etal_05a.pdf">Accurately Interpreting Clickthrough Data as Implicit Feedback</a>. SIGIR 2005, pp. 154–161.</li>
<li id="source-10"><a href="https://www.edpb.europa.eu/system/files/2026-09/edpb_guidelines_202602_anonymisation_v1_en_0.pdf">Guidelines 02/2026 on anonymisation, version 1.0</a>. 7 July 2026 draft; consultation until 30 October.</li>
<li id="source-11"><a href="https://digital-markets-act.ec.europa.eu/commission-provides-guidance-google-ai-interoperability-android-and-sharing-google-search-data-under-2026-07-16_en">Commission provides guidance to Google on AI interoperability on Android and sharing of Google Search data under DMA</a>. 16 July 2026 announcement; search component.</li>
<li id="source-12"><a href="https://digital-markets-act.ec.europa.eu/document/download/8ba0913f-2778-4a6d-9c58-10f8c7ead009_en?filename=Joint_COM-EDPB_GLS_interplay_DMA_GDPR_for_public_consultation.pdf">Joint guidelines on the interplay between the Digital Markets Act and the General Data Protection Regulation</a>. 9 October 2025 draft; paragraphs 175–190.</li>
<li id="source-13"><a href="https://developers.google.com/search/help/about-search-data-program">About the Google Search Data Licensing Program</a>. Licensing programme; page checked on 1 October 2026.</li>
</ol>

## Scope and method

Research cutoff: **1 October 2026**. The Android component of the 16 July decisions is separate and outside this article’s scope. The legal analysis relies primarily on the public, non-confidential version of decision DMA.100209 and its final annex. Redactions have not been reconstructed. Both numerical models are educational; assumptions, units and calculations appear below the figures and in the accompanying files. Google’s and the Commission’s positions are attributed. The litigation outcome and the mechanism’s practical effectiveness remain unresolved.
