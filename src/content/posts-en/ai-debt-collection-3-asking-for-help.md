---
title: 'When AI asks you to pay: what happens when you ask for help'
seoTitle: 'AI debt collection: what happens when you ask for help | l0g'
description: How AI detects vulnerability, routes people to support and handles sensitive information. An investigation into what happens after an alert.
pubDate: '2026-09-24T16:56:18+02:00'
updatedDate: '2026-09-24T16:56:18+02:00'
tags: ['AI', 'Debt collection', 'Data protection', 'Investigation']
draft: false
ogImage: /illustrations/news/ia-recouvrement-aide-v1.jpg
sourceArticle: ia-recouvrement-3-appel-aide
sourceUpdatedDate: '2026-09-24T16:56:18+02:00'
---

**When AI asks you to pay · Part 3**

*Read also: [Part 1: decisions](/en/analysis/ai-debt-collection-1-who-decides-reminder/) · [Part 2: results](/en/analysis/ai-debt-collection-2-performance-claims/) · [Part 4: correcting the record](/en/analysis/ai-debt-collection-4-correcting-the-record/) · [Part 5: contracts and accountability](/en/analysis/ai-debt-collection-5-contracts-accountability/).*

**Identifying someone in difficulty can open a route to support. But the same classification can help decide which conversations are automated. Ophelos’s technical documentation, findings from the UK financial regulator and French data-protection guidance reveal the decisions between a personal disclosure, an alert and actual assistance.**

In a technical post, Ophelos describes vulnerability detection as helping direct human attention to some situations while allowing responses to unflagged conversations to be automated. Detection quality therefore has an operational consequence: a missed difficulty may also influence the service a person receives. That is a possible implication of the company’s description, not an incident verified in a French customer’s case. <a href="#ia3-en-s01" aria-label="Source 1">[1]</a>

Ophelos’s French website does advertise detection using a language model, a system trained to process and generate text, to help specialist teams prioritise their work. It does not disclose performance by type of difficulty or the configuration of each portfolio. A feature offered in France does not establish that every French case follows the same route. <a href="#ia3-en-s02" aria-label="Source 2">[2]</a>

Assessing the promise requires separating what the system notices, what it records and what the company does next. A relevant alert can exist without assistance ever arriving. Equally, a straightforward request can receive a useful response without its author first being assigned a category.

## Vulnerability is not a single condition

The UK Financial Conduct Authority’s 2021 guidance considers vulnerability through health, life events, resilience to shocks and the ability to understand or use services. It does not assume that everyone with one of these characteristics will suffer harm. The approach concerns needs and circumstances; it is not a statement of French law. <a href="#ia3-en-s03" aria-label="Source 3">[3]</a>

Consider two illustrative situations, neither drawn from an actual customer file. Someone may have enough money to pay but be unable to use the contact channel offered. Someone else may understand the reminder perfectly and have no disposable income with which to meet it. Repeating an explanation does not solve the second problem. An instalment plan may do nothing for the first.

The label “vulnerable” therefore covers circumstances that call for different responses. By itself, it does not identify an affordable payment, an accessible communication format or the urgency of a request. Nor does it establish that someone is unable to make their own choices.

That is the first question to ask of an AI claim in this field: **what need is the system supposed to recognise?** A classification can help organise a service. It cannot replace an understanding of why the person is struggling to use it.

## From a message to a customer profile

In its description of the first generation of OLIVE, Ophelos presented a model that analysed written messages and returned a score between zero and one, together with an indication of a possible difficulty. This was a screening tool. The description provides no basis for interpreting that score as a clinical probability or a diagnosis. <a href="#ia3-en-s04" aria-label="Source 4">[4]</a>

More recent documentation describes summaries and suggested next steps. Ophelos says it compared the model with more than a thousand examples labelled by its customer-service staff. That internal check is not an independent measurement of needs missed in production. <a href="#ia3-en-s01" aria-label="Source 1">[1]</a>

The status of information matters as it passes from the original words to the record a staff member reads. An explicit disclosure, a software-generated inference and a need confirmed with the person are different things. Displaying them in the same way could obscure that distinction.

The general technical risk is documented. The US National Institute of Standards and Technology describes generative outputs that depart from their inputs while appearing confident. This does not establish an error at Ophelos. It is a reason to check generated summaries rather than treat them as original evidence. <a href="#ia3-en-s05" aria-label="Source 5">[5]</a>

A meaningful audit would connect each interpretation to its source: the relevant message, its date, the model version and any human confirmation. This would help distinguish information that has become outdated from information that was never established in the first place.

A concise note can be useful to the next member of staff. Its usefulness is also why traceability matters. The reader needs to know what it summarises, what it assumes and what still needs to be asked.

## What an absent alert can tell us

The most visible error is an unwarranted alert: the system flags a difficulty that a review does not confirm. Evaluators call this a *false positive*. A *false negative* is the opposite: a difficulty present in the reference assessment is not detected by the system.

The possible consequences differ. An unnecessary alert could trigger intrusive questions, inappropriate routing or an inaccurate record. A missed alert could leave a request for support in a routine process. These are risks to investigate, not harms whose frequency has been measured here.

The allocation between automated and human replies also appears in PAIR Finance’s French documentation. It describes classifying messages and deciding whether a staff member or generative AI should answer. That does not establish that PAIR uses the same vulnerability detector as Ophelos. <a href="#ia3-en-s06" aria-label="Source 6">[6]</a>

Reviewing only flagged cases would not test the whole allocation decision. It would reveal unnecessary alerts but miss needs left on the other side. **Unflagged conversations must also be reviewed**, against an independent assessment with access to the same context and explicit criteria.

This changes how a claim of “accuracy” should be read. A high share of relevant alerts can coexist with many missed cases. Conversely, a system that flags almost everything may find more difficulties while overwhelming the specialist team. Neither metric, taken alone, settles the question without the other error type and its consequences.

<figure style="margin:2rem 0 2.4rem;">
<svg xmlns="http://www.w3.org/2000/svg" width="360" height="286" viewBox="0 0 360 286" role="img" aria-labelledby="ia3-en-fig1-title ia3-en-fig1-desc" focusable="false" style="display:block;width:100%;max-width:440px;height:auto;margin:0 auto;" font-family="Arial, Helvetica, sans-serif">
<title id="ia3-en-fig1-title">Review flagged and unflagged cases</title>
<desc id="ia3-en-fig1-desc">Proposed, unexecuted protocol: review alerts for unwarranted classifications, then sample unflagged cases to identify missed needs. Use common context and criteria, retaining disagreements. No error rate has been calculated.</desc>
<rect x="0.5" y="0.5" width="359" height="285" rx="8" fill="var(--color-surface)" stroke="var(--color-line-strong)" stroke-width="1" />
<text x="16" y="30" font-size="20" font-weight="600" fill="var(--color-paper)">Check both sides</text>
<text x="16" y="65" font-size="14" font-weight="600" fill="var(--color-signal)">FLAGGED</text>
<text x="196" y="65" font-size="14" font-weight="600" fill="var(--color-amber)">UNFLAGGED</text>
<text x="16" y="92" font-size="16" font-weight="400" fill="var(--color-paper)">Check the alert,</text>
<text x="16" y="114" font-size="16" font-weight="400" fill="var(--color-paper)">the need and</text>
<text x="16" y="136" font-size="16" font-weight="400" fill="var(--color-paper)">the support given.</text>
<text x="196" y="92" font-size="16" font-weight="400" fill="var(--color-paper)">Review a sample</text>
<text x="196" y="114" font-size="16" font-weight="400" fill="var(--color-paper)">independently.</text>
<text x="196" y="136" font-size="16" font-weight="400" fill="var(--color-paper)">Find missed needs.</text>
<line x1="16" y1="157" x2="344" y2="157" stroke="var(--color-line-strong)" stroke-width="1" />
<text x="16" y="184" font-size="14" font-weight="600" fill="var(--color-signal)">A SHARED REVIEW FRAMEWORK</text>
<text x="16" y="209" font-size="16" font-weight="400" fill="var(--color-paper)">Same context, predefined criteria,</text>
<text x="16" y="232" font-size="16" font-weight="400" fill="var(--color-paper)">disagreements retained.</text>
<text x="16" y="267" font-size="16" font-weight="400" fill="var(--color-paper)">No error rate calculated here.</text>
</svg>
<figcaption style="margin-top:.75rem;font-size:.85em;line-height:1.6;color:var(--color-muted);">Methodological illustration by l0g, with no statistical data. This protocol has not been executed. Providers describe the routing choices that motivate the proposed review. <a href="#ia3-en-s01" aria-label="Source 1">[1]</a> <a href="#ia3-en-s06" aria-label="Source 6">[6]</a></figcaption>
</figure>

The human reference itself needs a method. Are reviewers looking for a health condition, a communication barrier or a request for an adjustment? Do they see the same conversations? Are disagreements retained? Agreement within a company on a category is not a medical finding.

Then there are people who never reply. Silence does not establish the absence of difficulty. An audit of incoming messages alone cannot explain what happens to people who were unable to start a conversation. Any published result needs to make that boundary visible.

## After detection, someone must be able to act

Independent evidence does not support dismissing the technology. In March 2025, the FCA described a firm using AI to scan recorded calls for potential vulnerability. Managers checked whether appropriate help followed; where it had not, the firm contacted the customer and coached the employee. The regulator also identified adjustments to call-duration targets for staff handling these situations. These findings concern UK financial services. <a href="#ia3-en-s07" aria-label="Source 7">[7]</a>

That is a concrete counterexample to the assumption that automation can only distance people from assistance. It can help recover a need that was overlooked. The benefit described, however, belongs to the whole process: detection, review and corrective action. The software alone does not complete the final step.

A newer FCA publication, dated **17 September 2026**, reports trials of analysing online-chat language to route customers to human agents. It also identifies limited evidence at some firms of how recorded vulnerabilities translated into appropriate support. Its scope is UK payment services, not French debt collection. <a href="#ia3-en-s08" aria-label="Source 8">[8]</a>

The transferable finding is narrow but useful: the presence of a category in a record does not by itself establish the service delivered. A company might identify many needs but lack available advisers. It might also employ specialists without giving them authority to change the options offered.

A promised handover cannot distinguish these possibilities. An audit would need its destination, the wait before someone takes responsibility, the information actually received and the decisions the recipient can make. Where an adjustment is agreed, its implementation also needs checking in the systems preparing subsequent contacts.

None of this means requiring everyone to use the telephone. A written conversation, a later appointment or an accessible explanation may be more appropriate. The test is whether the response fits the need expressed, not whether a human voice appears at every stage.

## Disclosure does not automatically change the service

A separate FCA-commissioned survey, conducted in March and April 2024, offers a useful reference point. Among **412 UK adults in vulnerable circumstances who had disclosed different needs**, **58%** said their provider made changes to ensure they received the necessary support. The report is dated May 2024 and was released with the regulator’s March 2025 work. It does not measure an AI effect. <a href="#ia3-en-s09" aria-label="Source 9">[9]</a>

The remaining responses cannot legitimately be turned into a failure rate. The question does not establish that every absence of change was wrongful or that a change was always possible. It does show the value of asking what happened after disclosure, rather than stopping at whether the information was received.

Applied to debt collection, that distinction takes an investigation beyond counts of flagged or transferred cases. Successful assistance should be described by what it enabled: understanding an offer, having circumstances considered or obtaining a usable answer. This is a proposed evaluation framework, not a finding from tests of the platforms discussed here.

## Assistance without a medical dossier

Intrum Corporate’s French privacy notice envisages customers voluntarily providing health, disability or private-life information to help adapt repayments. It says collection is limited to what is necessary. The notice describes company commitments, not the contents actually held in every customer record. <a href="#ia3-en-s10" aria-label="Source 10">[10]</a>

Voluntary disclosure and model-generated inference nevertheless raise different questions. Did the person provide the information, or did the system infer it? If it was inferred, does the person know that a characteristic has been recorded? How much confidence is attached to it, and how can it be challenged? The documents reviewed do not let us trace this process through a particular French case.

Health information does not have to originate with a doctor to fall within data-protection rules. France’s CNIL includes certain conclusions derived by combining data. However, an unpaid bill or budget difficulty is not inherently health data; classification depends on the information processed and its context. <a href="#ia3-en-s11" aria-label="Source 11">[11]</a>

Processing special-category data under the General Data Protection Regulation (GDPR) requires two separate conditions: a lawful basis under Article 6 and an applicable exception under Article 9. Legitimate interests alone therefore cannot authorise processing health data. The conditions depend on the use, not simply on an intention to help. <a href="#ia3-en-s12" aria-label="Source 12">[12]</a>

A practical question follows: what information is actually needed to make the adjustment? For someone requesting written contact, recording that need may be enough to organise the service. Inferring and circulating a suspected condition would be a different operation requiring justification. This is an illustrative design choice, not a practice observed at a named operator.

## Share the adjustment, restrict the disclosure

The GDPR requires, among other things, data minimisation, explicit purposes and accuracy. In this context, those principles invite a distinction between temporarily analysing a message, retaining a conclusion and reusing it later. These operations do not become identical merely because they happen within the same software. <a href="#ia3-en-s13" aria-label="Source 13">[13]</a>

For access controls, the CNIL recommends limiting permissions to information needed for each role. An organisation may need an authorised person to examine a disclosure without giving everyone implementing the resulting adjustment the same access. A service instruction linked to a customer is still personal data requiring protection. <a href="#ia3-en-s14" aria-label="Source 14">[14]</a>

<figure style="margin:2rem 0 2.4rem;">
<svg xmlns="http://www.w3.org/2000/svg" width="360" height="286" viewBox="0 0 360 286" role="img" aria-labelledby="ia3-en-fig2-title ia3-en-fig2-desc" focusable="false" style="display:block;width:100%;max-width:440px;height:auto;margin:0 auto;" font-family="Arial, Helvetica, sans-serif">
<title id="ia3-en-fig2-title">Separate reviewing a disclosure from implementing support</title>
<desc id="ia3-en-fig2-desc">Proposed design, not an audited architecture. The original message is accessed according to need. An interpretation retains its source and can be corrected. The agreed adjustment conveys a useful instruction without unnecessary detail. This instruction remains personal data.</desc>
<rect x="0.5" y="0.5" width="359" height="285" rx="8" fill="var(--color-surface)" stroke="var(--color-line-strong)" stroke-width="1" />
<text x="16" y="30" font-size="20" font-weight="600" fill="var(--color-paper)">From disclosure to support</text>
<text x="16" y="66" font-size="14" font-weight="600" fill="var(--color-signal)">01</text>
<text x="46" y="66" font-size="16" font-weight="600" fill="var(--color-paper)">Original message</text>
<text x="16" y="89" font-size="16" font-weight="400" fill="var(--color-paper)">Access restricted to authorised staff.</text>
<line x1="16" y1="103" x2="344" y2="103" stroke="var(--color-line-strong)" stroke-width="1" />
<text x="16" y="136" font-size="14" font-weight="600" fill="var(--color-signal)">02</text>
<text x="46" y="136" font-size="16" font-weight="600" fill="var(--color-paper)">Interpretation</text>
<text x="16" y="159" font-size="16" font-weight="400" fill="var(--color-paper)">Source, date, review and correction.</text>
<line x1="16" y1="173" x2="344" y2="173" stroke="var(--color-line-strong)" stroke-width="1" />
<text x="16" y="206" font-size="14" font-weight="600" fill="var(--color-signal)">03</text>
<text x="46" y="206" font-size="16" font-weight="600" fill="var(--color-paper)">Agreed adjustment</text>
<text x="16" y="229" font-size="16" font-weight="400" fill="var(--color-paper)">Share what is needed to deliver it.</text>
<text x="16" y="267" font-size="16" font-weight="400" fill="var(--color-paper)">The instruction remains personal data.</text>
</svg>
<figcaption style="margin-top:.75rem;font-size:.85em;line-height:1.6;color:var(--color-muted);">Design proposed by l0g using data-minimisation, accuracy and access-control principles. It does not depict an observed system at Intrum, Ophelos or PAIR Finance. <a href="#ia3-en-s13" aria-label="Source 13">[13]</a> <a href="#ia3-en-s14" aria-label="Source 14">[14]</a></figcaption>
</figure>

The diagram proposes separating functions, not building another database of personal disclosures. It would also be necessary to review needs that have changed and distinguish removal of an active flag from any justified retention of a historical record. A past difficulty should not remain presented as current simply because no one revisits the file.

Reuse to improve a model needs its own examination. Removing a name does not anonymise a conversation if it remains linkable to the customer within the system. The CNIL distinguishes [pseudonymisation](/en/glossary/pseudonymisation/), which replaces identifiers, from anonymisation. This does not establish that debtors’ health information is actually used to train the tools examined here. <a href="#ia3-en-s15" aria-label="Source 15">[15]</a>

An audit would therefore ask which information enters training examples, who can access it and what safeguards apply. It would also examine the need for a data-protection impact assessment. Such an assessment is required for processing likely to create high risks to people’s rights and freedoms. Its absence online is not evidence that it does not exist or, by itself, that a rule has been breached. <a href="#ia3-en-s18" aria-label="Source 18">[18]</a>

## A safeguard still to be traced through real cases

The documentary finding is more specific than a debate for or against chatbots. Detection may improve assistance; it may also help allocate conversations that do not receive immediate human attention. What needs examining is the connection between that classification, the staff available and the actions actually taken.

For France, independent evidence is still missing from this investigation linking an original message to a possible alert, then to a response and its implementation. A bounded assessment of missed needs is also missing. Error rates or net benefits for debtors cannot be inferred from the corporate presentations reviewed alone.

Further investigation must be able to examine a successful correction as well as an error: what information changed, who approved it and whether subsequent handling reflected that change. That would make a working safeguard visible, rather than accepting a stated procedure or presuming its failure.

In France, GDPR access and rectification rights allow people, within the applicable framework, to request data held about them and seek correction of inaccurate information. Those rights do not mean that every request immediately suspends collection or extinguishes the debt. <a href="#ia3-en-s16" aria-label="Source 16">[16]</a>

Budget support does not depend on being recognised by an algorithm, either. The Banque de France points people towards *Points conseil budget*, which provide free, confidential assistance in France. That support is separate from the service tasked with obtaining payment. <a href="#ia3-en-s17" aria-label="Source 17">[17]</a>

The promise ultimately comes down to a practical question: after explaining a difficulty, could the person obtain an appropriate response without disclosing more than was necessary? The public documents reviewed do not let us reconstruct that passage from detection to effective support for the French operations of the platforms examined.

---

### Method and limitations

Documentary investigation with an information cut-off of 24 September 2026. Company materials establish what their publishers claim, not independent evidence of performance. UK findings retain their original sectoral and population scope. No interviews, requests for comment, authenticated individual case files or platform tests were conducted for this instalment. The illustrative examples and two diagrams present distinctions and proposed controls, not observed incidents or an audited company architecture.


### Sources and scope

<p id="ia3-en-s01" style="scroll-margin-top:2rem;overflow-wrap:anywhere;"><strong>[1] Ophelos / Lily Davis</strong> · <a href="https://www.ophelos.com/business/blog/post/the-power-of-fine-tuned-llms-for-detecting-and-supporting-vulnerable-customers" rel="noreferrer">The Power of Fine-tuned LLMs for Detecting and Supporting Vulnerable Customers</a>. The page displays 21 January and 8 May 2025 without clearly identifying their roles. Describes Olive 2.0 and automation of unflagged replies; reports internal validation.</p>

<p id="ia3-en-s02" style="scroll-margin-top:2rem;overflow-wrap:anywhere;"><strong>[2] Ophelos France</strong> · <a href="https://www.ophelos.com/fr/professionnels/ia" rel="noreferrer">L’IA dans le recouvrement de créances</a>. Undated page. French-language offering for language-model-based detection; it does not establish each portfolio’s configuration.</p>

<p id="ia3-en-s03" style="scroll-margin-top:2rem;overflow-wrap:anywhere;"><strong>[3] Financial Conduct Authority</strong> · <a href="https://www.fca.org.uk/publications/finalised-guidance/guidance-firms-fair-treatment-vulnerable-customers" rel="noreferrer">Guidance for firms on the fair treatment of vulnerable customers</a>. 23 February 2021; page updated 22 July 2026. Contextual definition and support needs in the UK.</p>

<p id="ia3-en-s04" style="scroll-margin-top:2rem;overflow-wrap:anywhere;"><strong>[4] Ophelos / Jacob Goss</strong> · <a href="https://www.ophelos.com/business/blog/post/what-is-nlp-and-how-can-it-be-used-to-detect-vulnerability" rel="noreferrer">What is NLP and how can it be used to detect vulnerability?</a>. The page displays 8 July 2021 and 8 May 2025. Historical description of a zero-to-one score; no clinical calibration is established.</p>

<p id="ia3-en-s05" style="scroll-margin-top:2rem;overflow-wrap:anywhere;"><strong>[5] National Institute of Standards and Technology</strong> · <a href="https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf" rel="noreferrer">Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile, NIST AI 600-1</a>. July 2024. Section 2.2, p. 6: erroneous generated content or content that diverges from inputs. Not evidence of an error at a named provider.</p>

<p id="ia3-en-s06" style="scroll-margin-top:2rem;overflow-wrap:anywhere;"><strong>[6] PAIR Finance</strong> · <a href="https://pairfinance.com/fr/intelligence-artificielle/" rel="noreferrer">Intelligence artificielle</a>. Undated French page. Describes message classification and allocation of replies to a staff member or generative AI.</p>

<p id="ia3-en-s07" style="scroll-margin-top:2rem;overflow-wrap:anywhere;"><strong>[7] Financial Conduct Authority</strong> · <a href="https://www.fca.org.uk/publications/good-and-poor-practice/delivering-vulnerable-customers" rel="noreferrer">Delivering good outcomes for customers in vulnerable circumstances – good practice and areas for improvement</a>. 7 March 2025; updated 3 December 2025. Section 3.2: AI-assisted call review, human follow-up and work organisation.</p>

<p id="ia3-en-s08" style="scroll-margin-top:2rem;overflow-wrap:anywhere;"><strong>[8] Financial Conduct Authority</strong> · <a href="https://www.fca.org.uk/publications/good-and-poor-practice/payments-firms-delivering-good-outcomes-vulnerable-consumers" rel="noreferrer">Payments firms: delivering good outcomes for consumers in vulnerable circumstances</a>. 17 September 2026. Language-analysis pilots and findings about translating needs into support in UK payment services.</p>

<p id="ia3-en-s09" style="scroll-margin-top:2rem;overflow-wrap:anywhere;"><strong>[9] Critical Research, commissioned by the FCA</strong> · <a href="https://www.fca.org.uk/publication/external-research/vulnerability-review-improving-outcomes-consumers-engaging-financial-services-firms.pdf" rel="noreferrer">Vulnerability review: Improving understanding of the outcomes for consumers in vulnerable circumstances when engaging with financial services firms</a>. Data collected March-April 2024; report dated May 2024, released March 2025. Figure 20, p. 27: 58%, with a base of 412 people who disclosed their needs. No AI effect measured.</p>

<p id="ia3-en-s10" style="scroll-margin-top:2rem;overflow-wrap:anywhere;"><strong>[10] Intrum Corporate France</strong> · <a href="https://www.intrum.fr/media/axfjlwgn/202604-politique-de-confidentialit%C3%A9-client-d%C3%A9biteur.pdf" rel="noreferrer">Politique de confidentialité relative à la protection des données personnelles des clients débiteurs</a>. File version whose name begins 202604; exact publication date unconfirmed. Page 4: voluntarily supplied sensitive information and stated collection limits.</p>

<p id="ia3-en-s11" style="scroll-margin-top:2rem;overflow-wrap:anywhere;"><strong>[11] CNIL</strong> · <a href="https://www.cnil.fr/fr/quest-ce-ce-quune-donnee-de-sante" rel="noreferrer">Qu’est-ce ce qu’une donnée de santé ?</a>. 8 January 2018. Definition and contextual classification of health data, including some inferred information.</p>

<p id="ia3-en-s12" style="scroll-margin-top:2rem;overflow-wrap:anywhere;"><strong>[12] CNIL</strong> · <a href="https://www.cnil.fr/fr/les-bases-legales/liceite-essentiel-sur-les-bases-legales" rel="noreferrer">La licéité du traitement : l’essentiel sur les bases légales prévues par le RGPD</a>. 29 November 2019. Distinguishes a lawful basis for processing from the additional condition for special-category data.</p>

<p id="ia3-en-s13" style="scroll-margin-top:2rem;overflow-wrap:anywhere;"><strong>[13] CNIL / Regulation (EU) 2016/679</strong> · <a href="https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2" rel="noreferrer">RGPD, chapitre II : Principes</a>. Regulation of 27 April 2016, Article 5. Purpose limitation, minimisation and accuracy. Online version consulted at the investigation cut-off.</p>

<p id="ia3-en-s14" style="scroll-margin-top:2rem;overflow-wrap:anywhere;"><strong>[14] CNIL</strong> · <a href="https://www.cnil.fr/fr/securite-gerer-les-habilitations" rel="noreferrer">Sécurité : Gérer les habilitations</a>. 13 March 2024. Access limited to information needed for each role. Figure 2 proposes an editorial application.</p>

<p id="ia3-en-s15" style="scroll-margin-top:2rem;overflow-wrap:anywhere;"><strong>[15] CNIL</strong> · <a href="https://www.cnil.fr/fr/identifier-les-donnees-personnelles" rel="noreferrer">Identifier les données personnelles</a>. 27 January 2020. Distinguishes anonymisation from replacement of identifiers. Applied here to data still linkable to a customer in the system.</p>

<p id="ia3-en-s16" style="scroll-margin-top:2rem;overflow-wrap:anywhere;"><strong>[16] CNIL / Regulation (EU) 2016/679</strong> · <a href="https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre3" rel="noreferrer">RGPD, chapitre III : Droits de la personne concernée</a>. Articles 15 and 16. Access and rectification within the applicable framework, distinct from the legal status of the debt.</p>

<p id="ia3-en-s17" style="scroll-margin-top:2rem;overflow-wrap:anywhere;"><strong>[17] Banque de France / Mes questions d’argent</strong> · <a href="https://www.mesquestionsdargent.fr/intervenants-sociaux-et-pcb/point-conseil-budget" rel="noreferrer">Point conseil budget</a>. Consulted 24 September 2026. Includes free, confidential support available from Points conseil budget in France.</p>

<p id="ia3-en-s18" style="scroll-margin-top:2rem;overflow-wrap:anywhere;"><strong>[18] CNIL</strong> · <a href="https://www.cnil.fr/fr/ce-quil-faut-savoir-sur-lanalyse-dimpact-relative-la-protection-des-donnees-aipd" rel="noreferrer">Ce qu’il faut savoir sur l’analyse d’impact relative à la protection des données (AIPD)</a>. 18 October 2017; page consulted at the investigation cut-off. High-risk threshold, without assuming what is in a company’s compliance file.</p>

*Documents consulted on 24 September 2026. Uncertain dates are identified rather than inferred from file names.*
