---
title: 'When AI asks you to pay: who decides the next step?'
seoTitle: 'AI debt collection: who decides the next step? | l0g'
description: 'Who owns the debt, what the software decides, and how a debtor can challenge the result: a documentary investigation into AI debt collection in France.'
pubDate: '2026-09-24T11:04:57+02:00'
updatedDate: '2026-09-24T11:04:57+02:00'
tags: ['AI', 'Debt collection', 'Personal data', 'Investigation']
draft: false
ogImage: /illustrations/news/ia-recouvrement-decisions-v1.jpg
sourceArticle: ia-recouvrement-1-qui-decide-relance
sourceUpdatedDate: '2026-09-24T11:04:57+02:00'
---

**When AI asks you to pay · Part 1**

*Read also: [Part 2: results](/en/analysis/ai-debt-collection-2-performance-claims/) · [Part 3: support](/en/analysis/ai-debt-collection-3-asking-for-help/).*

On page 7 of its French privacy notice, Intrum Corporate describes automated scoring that can inform whether a debt file should be referred for judicial recovery. Automation is therefore described as operating before a message reaches the debtor: it can help determine what happens to the case. <a href="#ia1-en-s01" aria-label="Source 1">[1]</a>

That distinction matters. A conversation may sound entirely ordinary even though a system has already selected the case, chosen a contact channel or prepared an offer. Conversely, a language model may write the reply without having any authority over the amount demanded or the decision to pursue a claim.

Investigating AI debt collection means looking beyond the conversation. Who owns the claim? Which company is acting on that owner’s behalf? What information reaches the software, and where can a person challenge the result?

*This documentary investigation concerns consumer debts in France. Material from other countries is identified separately. No reconstructed testimony or test of a live collection system is presented as evidence.*

## The sender may not own the debt

The **creditor** holds the right to demand payment. It may instruct a collection company to act on its behalf. Under the French rules governing third-party out-of-court collection, the written agreement must specify matters including the basis of the claim, the amounts to be collected and the collector’s remuneration. Outsourcing collection does not, by itself, transfer ownership of the claim. <a href="#ia1-en-s02" aria-label="Source 2">[2]</a>

A sale is different. An **assignment** transfers the claim to a new owner, which may then appoint a collector of its own. Changing the creditor and changing the company that contacts the debtor are distinct events. <a href="#ia1-en-s03" aria-label="Source 3">[3]</a>

Under the general French Civil Code rules, unless the debtor has already consented to the assignment, it must be notified to them or acknowledged by them before it can be asserted against them. Certain defences remain available against the buyer, including those inherent in the debt. Selling a claim does not, as a general principle, remove a dispute about whether it exists. Special rules may apply to particular financial transactions. <a href="#ia1-en-s04" aria-label="Source 4">[4]</a>

The technology supplier has another role again. An investigation needs to establish separately who develops the software, who configures its rules and who owns the claim. One group may perform several functions, but that does not make the legal entities or their responsibilities interchangeable.

<figure style="margin:2rem 0 2.4rem;">
<svg xmlns="http://www.w3.org/2000/svg" width="360" height="286" viewBox="0 0 360 286" role="img" aria-labelledby="ia1-en-fig1-title ia1-en-fig1-desc" focusable="false" style="display:block;width:100%;max-width:440px;height:auto;margin:0 auto;" font-family="Arial, Helvetica, sans-serif">
<title id="ia1-en-fig1-title">Collection mandate or sale of a claim</title>
<desc id="ia1-en-fig1-desc">Under a collection mandate, the creditor retains the claim and appoints a collector. Under an assignment, the original creditor transfers the claim to a new creditor, which can also appoint a collector. These are alternatives, not mandatory consecutive steps.</desc>
<rect x="0.5" y="0.5" width="359" height="285" rx="8" fill="var(--color-surface)" stroke="var(--color-line-strong)" stroke-width="1" />
<text x="16" y="30" font-size="20" font-weight="600" fill="var(--color-paper)">Mandate or assignment</text>
<text x="16" y="62" font-size="14" font-weight="600" fill="var(--color-signal)">01 · COLLECTION MANDATE</text>
<text x="16" y="91" font-size="16" font-weight="600" fill="var(--color-paper)">Creditor</text>
<text x="16" y="113" font-size="16" font-weight="400" fill="var(--color-paper)">keeps the claim</text>
<text x="204" y="91" font-size="16" font-weight="600" fill="var(--color-paper)">Collector</text>
<text x="204" y="113" font-size="16" font-weight="400" fill="var(--color-paper)">acts for them</text>
<line x1="169" y1="96" x2="191" y2="96" stroke="var(--color-signal)" stroke-width="1" /><line x1="186" y1="92" x2="191" y2="96" stroke="var(--color-signal)" stroke-width="1" /><line x1="186" y1="100" x2="191" y2="96" stroke="var(--color-signal)" stroke-width="1" />
<line x1="16" y1="137" x2="344" y2="137" stroke="var(--color-line-strong)" stroke-width="1" />
<text x="16" y="163" font-size="14" font-weight="600" fill="var(--color-amber)">02 · ASSIGNMENT</text>
<text x="16" y="192" font-size="16" font-weight="600" fill="var(--color-paper)">Original creditor</text>
<text x="204" y="192" font-size="16" font-weight="600" fill="var(--color-paper)">New creditor</text>
<text x="204" y="214" font-size="16" font-weight="400" fill="var(--color-paper)">owns the claim</text>
<line x1="169" y1="197" x2="191" y2="197" stroke="var(--color-signal)" stroke-width="1" /><line x1="186" y1="193" x2="191" y2="197" stroke="var(--color-signal)" stroke-width="1" /><line x1="186" y1="201" x2="191" y2="197" stroke="var(--color-signal)" stroke-width="1" />
<text x="16" y="246" font-size="16" font-weight="400" fill="var(--color-paper)">The buyer can also</text>
<text x="16" y="267" font-size="16" font-weight="400" fill="var(--color-paper)">appoint a debt collector.</text>
</svg>
<figcaption style="margin-top:.75rem;font-size:.85em;line-height:1.6;color:var(--color-muted);">General French-law schematic. Arrows show a collection mandate (top) or an assignment (bottom), not a payment. No particular transaction is depicted. Sources: <a href="#ia1-en-s02" aria-label="Source 2">[2]</a> <a href="#ia1-en-s03" aria-label="Source 3">[3]</a> <a href="#ia1-en-s04" aria-label="Source 4">[4]</a>. Checked 24 September 2026.</figcaption>
</figure>

This map helps locate the relevant evidence. The underlying contract and account records establish the basis of a demand. The collection mandate describes the authority granted to the collector. Product documentation explains what a customer can automate. None is a substitute for the others.

## A claim must be verifiable outside the interface

France’s consumer-protection authority, the DGCCRF, explains that a claim must be established, quantified or quantifiable, and due. These conditions concern the obligation to pay, not how convincingly a payment portal presents it. <a href="#ia1-en-s05" aria-label="Source 5">[5]</a>

The burden of proof works in both directions. A party demanding performance must prove the obligation; a party claiming to have been released must show payment or another event that extinguished it. Investigators therefore need both the records supporting the original demand and the payments or corrections made afterwards. <a href="#ia1-en-s06" aria-label="Source 6">[6]</a>

For collectors covered by Articles R124-1 to R124-7 of the French Code of Civil Enforcement Procedures, the collection letter must identify the collector and creditor, explain the basis of the demand and separate principal, interest and ancillary amounts. Subsequent collection steps must refer to that letter and its date. This does not mean that every text message must reproduce the full letter. The chapter concerns collection on behalf of others and provides for exceptions where a profession has its own rules. <a href="#ia1-en-s07" aria-label="Source 7">[7]</a> <a href="#ia1-en-s02" aria-label="Source 2">[2]</a>

Collection costs require a separate check. Without an enforceable title, they generally remain the creditor’s responsibility. The law provides exceptions, including certain legally required acts; a court can also charge a debtor acting in bad faith with specified necessary costs. **Buying or operating an AI system does not automatically make its cost payable by the consumer.** <a href="#ia1-en-s08" aria-label="Source 8">[8]</a>

This groundwork is essential when attributing an error. A payment may already be missing from the data sent to the collector. If the model accurately repeats an incorrect balance, it has not necessarily invented the debt, but it has not corrected it either. The original information, the transfer and the resulting action need to be examined separately.

## Before the system speaks, it makes choices

Public descriptions reveal several functions. They do not establish that every function is active on every case.

In a Belgian brochure about Ophelos, Intrum says message openings, clicks, logins and debt size help determine the timing, channel and content of communications. It describes reinforcement learning, in which the system adjusts its choices in response to the outcomes being sought. This is a supplier’s description published in Belgium, not an observation of French cases. <a href="#ia1-en-s09" aria-label="Source 9">[9]</a>

PAIR Finance describes classifying incoming messages, including requests for more time, instalments and disputes, before routing their handling to a person or a generated response. Ophelos also advertises language models that identify circumstances requiring additional support. These are company descriptions of functionality, not independently validated performance findings. <a href="#ia1-en-s10" aria-label="Source 10">[10]</a> <a href="#ia1-en-s11" aria-label="Source 11">[11]</a>

A practical distinction helps keep the investigation precise. A fixed rule schedules a reminder. A score estimates a probability. An action-selection mechanism chooses the next step. A language model writes a response. Software with the necessary permissions can then implement a change. Combining those functions does not make them equivalent.

The system’s objective matters just as much as its architecture. Getting a response, collecting a first payment and completing an affordable repayment plan are different outcomes. Improvement in the first does not establish improvement in the others.

Nor does a click establish an ability to pay. Silence may have several explanations. The relevant question is how an operator handles that uncertainty, rather than treating a prediction as a verified fact about an individual.

<figure style="margin:2rem 0 2.4rem;">
<svg xmlns="http://www.w3.org/2000/svg" width="360" height="286" viewBox="0 0 360 286" role="img" aria-labelledby="ia1-en-fig2-title ia1-en-fig2-desc" focusable="false" style="display:block;width:100%;max-width:440px;height:auto;margin:0 auto;" font-family="Arial, Helvetica, sans-serif">
<title id="ia1-en-fig2-title">From input to action: four functions</title>
<desc id="ia1-en-fig2-desc">An analytical framework: case data can feed an assessment and action selection. A message can use a template, be written by a person or be generated. Taking action on the case requires the relevant authority. Execution has to be checked in the case record. Human checks can occur at several stages.</desc>
<rect x="0.5" y="0.5" width="359" height="285" rx="8" fill="var(--color-surface)" stroke="var(--color-line-strong)" stroke-width="1" />
<text x="16" y="30" font-size="20" font-weight="600" fill="var(--color-paper)">From the file to action</text>
<text x="16" y="64" font-size="14" font-weight="600" fill="var(--color-signal)">01</text>
<text x="46" y="64" font-size="16" font-weight="600" fill="var(--color-paper)">Case data</text>
<text x="16" y="87" font-size="16" font-weight="400" fill="var(--color-paper)">Invoices, payments, corrections.</text>
<line x1="16" y1="99" x2="344" y2="99" stroke="var(--color-line-strong)" stroke-width="1" />
<text x="16" y="122" font-size="14" font-weight="600" fill="var(--color-signal)">02</text>
<text x="46" y="122" font-size="16" font-weight="600" fill="var(--color-paper)">Assessment and routing</text>
<text x="16" y="145" font-size="16" font-weight="400" fill="var(--color-paper)">A possible score and case rules.</text>
<line x1="16" y1="157" x2="344" y2="157" stroke="var(--color-line-strong)" stroke-width="1" />
<text x="16" y="180" font-size="14" font-weight="600" fill="var(--color-signal)">03</text>
<text x="46" y="180" font-size="16" font-weight="600" fill="var(--color-paper)">Writing the message</text>
<text x="16" y="203" font-size="16" font-weight="400" fill="var(--color-paper)">Template, human or generated text.</text>
<line x1="16" y1="215" x2="344" y2="215" stroke="var(--color-line-strong)" stroke-width="1" />
<text x="16" y="238" font-size="14" font-weight="600" fill="var(--color-signal)">04</text>
<text x="46" y="238" font-size="16" font-weight="600" fill="var(--color-paper)">Action on the case</text>
<text x="16" y="261" font-size="16" font-weight="400" fill="var(--color-paper)">Within its permissions and controls.</text>
</svg>
<figcaption style="margin-top:.75rem;font-size:.85em;line-height:1.6;color:var(--color-muted);">An analytical framework, not a verified architecture: functions may be separate, absent or subject to human checks at different stages. Execution is checked against the case record. l0g synthesis of operator descriptions: <a href="#ia1-en-s09" aria-label="Source 9">[9]</a> <a href="#ia1-en-s10" aria-label="Source 10">[10]</a> <a href="#ia1-en-s11" aria-label="Source 11">[11]</a>. Checked 24 September 2026.</figcaption>
</figure>

Deployment claims also need the right level of precision. In a statement published on **25 July 2025**, Intrum listed France among the countries where Ophelos had gone live. The announcement did not identify the modules active in each portfolio. A national rollout is not evidence that generative AI is used throughout the business or that collection operates autonomously from end to end. <a href="#ia1-en-s12" aria-label="Source 12">[12]</a>

## What does referral for judicial recovery actually mean?

Intrum’s French notice states the company’s view that its automated decisions have no legal or similarly significant effect because contractual rights remain unchanged. It also says a person can request human reassessment and that human experts regularly supervise AI responses and decision logic. That stated supervision does not establish prior review of every case. These remain the company’s descriptions, without an established regulatory endorsement. <a href="#ia1-en-s01" aria-label="Source 1">[1]</a>

Referring a case for judicial recovery does not mean an algorithm issues a judgment. It is not immediate authority to seize assets either. Compulsory enforcement requires, among other things, an enforceable title establishing a quantified and due claim. Selecting a file for further action and satisfying the conditions for enforcement are separate stages. <a href="#ia1-en-s13" aria-label="Source 13">[13]</a>

The issue here concerns what happens to the person **before** any eventual judicial decision. Article 22 of the General Data Protection Regulation (GDPR) governs decisions based solely on automated processing that have legal or comparably significant effects. The French data-protection authority, the CNIL, explains that a decision can have a significant impact without formally changing a person’s rights. <a href="#ia1-en-s23" aria-label="Source 23">[23]</a>

There are exceptions, including contractual necessity, specific legal authorisation with safeguards, and explicit consent. Their application depends on the circumstances and the relevant protections. A score is therefore neither automatically prohibited nor a general licence to automate decisions. <a href="#ia1-en-s14" aria-label="Source 14">[14]</a>

A precedent helps frame the inquiry. On **7 December 2023**, in the SCHUFA case, the Court of Justice of the European Union held that a score can constitute an automated decision where businesses give it a determining role in lending decisions. The case was not about Intrum or French debt collection. Its relevance here is that the practical influence of a result matters, even where another company acts on it afterwards. <a href="#ia1-en-s15" aria-label="Source 15">[15]</a>

Assessing the collection process therefore requires operational evidence. Does the score recommend referral or trigger it? Does a person examine the supporting records beforehand? Can they reject the recommendation, and do they actually do so? What consequences follow for the person concerned?

The public documents reviewed do not answer that complete set of questions. **They provide grounds to investigate the system’s authority, not grounds to declare an infringement.**

## Identifying an AI does not explain its decision

A more immediately observable question is whether an automated interlocutor identifies itself. The European Commission confirms that the transparency duties in AI Act Article 50 have applied since **2 August 2026**. For covered systems that interact directly with people, providers must ensure people are informed of their artificial nature at the first interaction, subject notably to the exception where this is obvious. That particular duty does not cover a score operating solely in the background. <a href="#ia1-en-s16" aria-label="Source 16">[16]</a>

Disclosure and explanation serve different purposes. Knowing that a machine is speaking does not explain the amount demanded, where its data came from or who authorised an offer.

The GDPR imposes separate information duties. Where data obtained elsewhere are used to contact a person, Article 14 generally requires information about the processing by the first communication, subject to its stated exceptions. The source of the data is among the information to be provided. <a href="#ia1-en-s14" aria-label="Source 14">[14]</a> <a href="#ia1-en-s24" aria-label="Source 24">[24]</a>

The absence of a new consent request does not itself establish unlawful processing. Consent is one of several legal bases under the GDPR. Another basis, such as legitimate interests, requires its conditions to be met, including balancing those interests against people’s rights. It does not remove the requirements concerning purpose, data minimisation and accuracy. <a href="#ia1-en-s17" aria-label="Source 17">[17]</a>

## A correction has to reach the system taking action

One scenario worth investigating is a correction made by the creditor that fails to reach a copy still being used for reminders. This is a **possible failure mechanism**, not an incident established in this investigation. It shows why acknowledging a mistake and correcting the process are different things.

The right to rectification covers inaccurate or incomplete personal data. The CNIL also explains that corrections must be communicated to recipients of the data, unless that proves impossible or involves disproportionate effort. A courteous acknowledgement cannot, on its own, establish that the correction has reached those recipients. <a href="#ia1-en-s18" aria-label="Source 18">[18]</a>

Where data accuracy is disputed, restriction of processing can be requested while it is checked. This does not cancel a debt or universally halt proceedings. Some uses remain possible, notably for establishing, exercising or defending legal claims. <a href="#ia1-en-s19" aria-label="Source 19">[19]</a>

An access request can help reconstruct a case by obtaining the data held and information about their origin, rather than another copy of general terms. The CNIL explains that a controller must also obtain assistance from processors holding relevant information. Access does not automatically extend to every internal document or to other people’s data. <a href="#ia1-en-s22" aria-label="Source 22">[22]</a>

The **27 February 2025 Dun & Bradstreet Austria judgment**, concerning automated credit assessment, further clarifies the explanation required in the situations it addresses: people must be able to understand which data were used and how. Trade secrets do not justify a blanket refusal; the relevant authority or court must be able to balance the interests involved. This is not an automatic right to receive source code. <a href="#ia1-en-s20" aria-label="Source 20">[20]</a>

For the person being pursued, useful information may be much more concrete: which payment record was used, what result was produced and which action followed? That is where an error can be located and its correction checked.

## Measuring whether the case was resolved

Automation can offer benefits. A system that quickly retrieves a payment record or makes it easier to correct an error could provide a genuine service. Lower processing costs are not inherently contrary to a debtor’s interests. The question is what the system resolves and what it leaves unresolved.

Response speed is therefore an incomplete measure. Was a dispute actually recorded? Did an offer take verified information into account? Can an authorised person take over the case? The same questions apply when the first contact is with a human agent.

There is also a basic security step: verify the company through a known channel, independently of any link in the message. France’s Cybermalveillance.gouv.fr recommends such checks for suspicious communications. Preserve the original message and do not give sensitive information to an unauthenticated recipient. An unfamiliar name does not prove fraud, but convincing language does not prove authenticity either. <a href="#ia1-en-s21" aria-label="Source 21">[21]</a>

The documents reviewed shift attention towards decisions made before the conversation begins. Establishing their effects will require configurations and execution records linking an input to a decision and a subsequent action in a real case. A tool can make collection easier to administer. Assessing its value also requires knowing whether the person asked to pay can get the underlying claim checked.

For further context, our investigation into [how personal traces become saleable profiles](/en/analysis/personal-data-traces-to-saleable-profiles/) follows the move from observation to inference. Our article on [personal data after a contract ends](/en/analysis/personal-data-after-the-contract-ends/) examines copies and recipients. The [profiling glossary entry](/en/glossary/profilage/) distinguishes evaluating a person from making a fully automated decision.

## Method and limitations

Public documents reviewed on **24 September 2026** include French legislation, CNIL and European Commission publications, CJEU press-office releases and operator documentation. The Court’s press releases summarise judgments; they do not replace the full judgments and are not binding on the Court.

No interviews seeking responses from the companies, individual case investigation or platform tests were conducted for this version. Company documentation establishes what operators say, not the actual performance of each module. The publication date of Intrum’s notice cannot be established from its filename alone. The findings do not measure an error rate or establish an infringement by a named operator.

The diagrams explain principles, rather than reproduce a verified company architecture. Rules specific to public debts, business-to-business claims and special procedures are not extrapolated to the cases discussed here.

## Sources and documents

All references were consulted on 24 September 2026. Dates below identify publication, a displayed update or the effective date of a statutory provision, as indicated. French-law references remain French sources; this English edition does not substitute another jurisdiction’s rules.

<ol style="padding-left:1.7rem;line-height:1.55;">
<li id="ia1-en-s01" style="margin:0.75rem 0;"><strong>Intrum Corporate</strong>. <a href="https://www.intrum.fr/media/axfjlwgn/202604-politique-de-confidentialit%C3%A9-client-d%C3%A9biteur.pdf">French debtor privacy notice, p. 7</a>. Publication date not established; version viewed on 24 September 2026.</li>
<li id="ia1-en-s02" style="margin:0.75rem 0;"><strong>Légifrance</strong>. <a href="https://www.legifrance.gouv.fr/codes/id/LEGISCTA000025938360">Code of Civil Enforcement Procedures, R124-1 and R124-3</a>. Applicable versions checked on 24 September 2026.</li>
<li id="ia1-en-s03" style="margin:0.75rem 0;"><strong>Légifrance</strong>. <a href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032042026">Civil Code, Article 1321</a>. Version effective from 1 October 2016.</li>
<li id="ia1-en-s04" style="margin:0.75rem 0;"><strong>Légifrance</strong>. <a href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032042011">Civil Code, Article 1324</a>. Version effective from 1 October 2016.</li>
<li id="ia1-en-s05" style="margin:0.75rem 0;"><strong>DGCCRF</strong>. <a href="https://www.economie.gouv.fr/dgccrf/les-fiches-pratiques/recouvrement-amiable-de-creances-les-regles-connaitre">Out-of-court debt collection: the applicable rules</a>. Displayed publication date: 24 October 2025.</li>
<li id="ia1-en-s06" style="margin:0.75rem 0;"><strong>Légifrance</strong>. <a href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032042341">Civil Code, Article 1353</a>. Version effective from 1 October 2016.</li>
<li id="ia1-en-s07" style="margin:0.75rem 0;"><strong>Légifrance</strong>. <a href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000027015026">Code of Civil Enforcement Procedures, R124-4</a>. Version effective from 2 February 2013.</li>
<li id="ia1-en-s08" style="margin:0.75rem 0;"><strong>Légifrance</strong>. <a href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000028747701">Code of Civil Enforcement Procedures, L111-8</a>. Version effective from 19 March 2014.</li>
<li id="ia1-en-s09" style="margin:0.75rem 0;"><strong>Intrum Belgique</strong>. <a href="https://www.intrum.be/media/plvfzhac/intrum-ophelos-onepager-be-fr-personalisation.pdf">Ophelos personalisation brochure, p. 1</a>. Undated document published in Belgium.</li>
<li id="ia1-en-s10" style="margin:0.75rem 0;"><strong>PAIR Finance</strong>. <a href="https://pairfinance.com/fr/intelligence-artificielle/">French-language description of AI functions</a>. Undated page; version viewed on 24 September 2026.</li>
<li id="ia1-en-s11" style="margin:0.75rem 0;"><strong>Ophelos</strong>. <a href="https://www.ophelos.com/fr/professionnels/ia">French-language AI product description</a>. Undated page; version viewed on 24 September 2026.</li>
<li id="ia1-en-s12" style="margin:0.75rem 0;"><strong>Intrum</strong>. <a href="https://www.intrum.com/about-us/how-we-do-it-intrum-ai/intrum-expands-ai-native-collections-platform-to-portugal-and-italy/">Ophelos expansion to Portugal and Italy</a>. Published 25 July 2025; France is listed among earlier deployments.</li>
<li id="ia1-en-s13" style="margin:0.75rem 0;"><strong>Légifrance</strong>. <a href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000025025644">Code of Civil Enforcement Procedures, L111-2</a>. Version effective from 1 June 2012.</li>
<li id="ia1-en-s14" style="margin:0.75rem 0;"><strong>CNIL</strong>. <a href="https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre3">GDPR, Chapter III, particularly Articles 14 and 22</a>. Regulation dated 27 April 2016; text checked on 24 September 2026.</li>
<li id="ia1-en-s15" style="margin:0.75rem 0;"><strong>CJUE, service de presse</strong>. <a href="https://curia.europa.eu/jcms/upload/docs/application/pdf/2023-12/cp230186fr.pdf">Case C-634/21, SCHUFA: press release 186/23, p. 1</a>. Judgment and press release: 7 December 2023.</li>
<li id="ia1-en-s16" style="margin:0.75rem 0;"><strong>Commission européenne</strong>. <a href="https://digital-strategy.ec.europa.eu/en/faqs/transparency-obligations-under-article-50-ai-act">FAQ on AI Act Article 50 transparency obligations</a>. Displayed update: 24 July 2026; applicable from 2 August 2026.</li>
<li id="ia1-en-s17" style="margin:0.75rem 0;"><strong>CNIL</strong>. <a href="https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2">GDPR, Chapter II, Articles 5 and 6</a>. Regulation dated 27 April 2016; text checked on 24 September 2026.</li>
<li id="ia1-en-s18" style="margin:0.75rem 0;"><strong>CNIL</strong>. <a href="https://www.cnil.fr/fr/comprendre-mes-droits/le-droit-de-rectification-corriger-vos-informations">The right to rectification: correcting your information</a>. Page viewed on 24 September 2026.</li>
<li id="ia1-en-s19" style="margin:0.75rem 0;"><strong>CNIL</strong>. <a href="https://www.cnil.fr/fr/comprendre-mes-droits/le-droit-la-limitation-du-traitement-geler-lutilisation-de-vos-donnees">The right to restriction of processing</a>. Page viewed on 24 September 2026; read with GDPR Article 18.</li>
<li id="ia1-en-s20" style="margin:0.75rem 0;"><strong>CJUE, service de presse</strong>. <a href="https://curia.europa.eu/jcms/upload/docs/application/pdf/2025-02/cp250022fr.pdf">Case C-203/22, Dun &amp; Bradstreet Austria: press release 22/25</a>. Judgment and press release: 27 February 2025.</li>
<li id="ia1-en-s21" style="margin:0.75rem 0;"><strong>Cybermalveillance.gouv.fr</strong>. <a href="https://www.cybermalveillance.gouv.fr/tous-nos-contenus/fiches-reflexes/hameconnage-phishing">Phishing: protective steps</a>. Published 10 January 2020; displayed update 7 May 2026.</li>
<li id="ia1-en-s22" style="margin:0.75rem 0;"><strong>CNIL</strong>. <a href="https://www.cnil.fr/fr/repondre-une-demande-de-droit-dacces">Responding to a data-access request</a>. Displayed publication: 13 June 2017; version viewed on 24 September 2026.</li>
<li id="ia1-en-s23" style="margin:0.75rem 0;"><strong>CNIL</strong>. <a href="https://www.cnil.fr/fr/profilage-et-decision-entierement-automatisee">Profiling and fully automated decisions</a>. Displayed publication: 29 May 2018.</li>
<li id="ia1-en-s24" style="margin:0.75rem 0;"><strong>CNIL</strong>. <a href="https://www.cnil.fr/fr/conformite-rgpd-information-des-personnes-et-transparence">Informing people and ensuring transparency</a>. Displayed publication: 29 July 2019; body identifies an update on 26 July 2019.</li>
</ol>
