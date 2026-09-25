---
title: 'AI is asking you to pay: the contracts behind collection'
seoTitle: 'AI debt collection: contracts and accountability | l0g'
description: Who controls an outsourced AI collection service? Data roles, reuse, French credit-servicing rules and the practical
  ability to take operations back.
pubDate: '2026-09-25T10:50:27+02:00'
updatedDate: '2026-09-25T10:50:27+02:00'
tags: ["AI", "Debt collection", "Personal data", "Finance", "Investigation"]
draft: false
ogImage: /illustrations/news/ia-recouvrement-contrats-v1.jpg
sourceArticle: ia-recouvrement-5-contrats-responsabilites
sourceUpdatedDate: '2026-09-25T10:50:27+02:00'
---

**AI is asking you to pay · Part 5**

*Read also: [Part 1: decisions](/en/analysis/ai-debt-collection-1-who-decides-reminder/) · [Part 2: performance claims](/en/analysis/ai-debt-collection-2-performance-claims/) · [Part 3: asking for help](/en/analysis/ai-debt-collection-3-asking-for-help/) · [Part 4: correcting the record](/en/analysis/ai-debt-collection-4-correcting-the-record/) · [Part 6: data rights and remedies](/en/analysis/ai-debt-collection-6-data-rights/).*

<p class="edition-link"><a href="/en/publications/ai-debt-collection/">Read all six parts in the free EPUB: When AI Asks You to Pay.</a></p>

**Intrum’s French privacy information distinguishes between two roles. For activities including debt collection and debt purchasing, the company describes itself as a data controller. For other services, such as billing administration, it says it processes data on its clients’ instructions. The name on a payment reminder can therefore stay the same while the legal role changes.** <a href="https://www.intrum.fr/solutions-entreprises/a-propos-d-intrum/donnees-personnelles/" aria-label="Source 1">[1]</a>

That distinction provides a practical starting point for examining automated collection. The earlier instalments followed decisions, performance claims, support for people in difficulty and the correction of account records. This one follows the contracts. Who sets the objectives? Who authorises the use of personal data? Who can stop an operation or replace a supplier?

Public notices describe roles and name some suppliers. Legislation sets duties for the organisations commissioning and providing the service. **The next step is to connect those duties to control over individual accounts: issuing instructions, checking execution and stopping an operation.** <a href="https://www.cnil.fr/fr/rgpd-comment-bien-identifier-son-role" aria-label="Source 2">[2]</a> <a href="https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre4" aria-label="Source 4">[4]</a>

## A collection mandate leaves other questions open

The first contract defines the collection assignment. Within the relevant French framework for amicable collection on another party’s behalf, Article R124-3 of the Civil Enforcement Procedures Code requires a written agreement with the creditor. It must specify matters including the basis and components of the amount due, the collector’s remuneration payable by the creditor and the remittance of funds. It authorises the collector to receive payment on the creditor’s behalf. <a href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000025938366" aria-label="Source 3">[3]</a>

That mandate answers one question: whose claim is the company pursuing? It does not settle who determines how personal data will be used. France’s data protection authority, the CNIL, explains that this classification depends on the facts rather than a contractual label. Under the General Data Protection Regulation (GDPR), a controller determines the purposes and essential means of processing. A processor handles data on the controller’s behalf and instructions, with some discretion over technical implementation. <a href="https://www.cnil.fr/fr/rgpd-comment-bien-identifier-son-role" aria-label="Source 2">[2]</a>

Sending a reminder, analysing a message and reusing a conversation history therefore need separate examination. Choosing software does not by itself establish joint controllership. Conversely, paying a supplier does not remove the need to identify decisions the supplier makes for its own purposes. The CNIL applies the same operation-by-operation analysis to organisations developing AI systems. <a href="https://www.cnil.fr/fr/rgpd-comment-bien-identifier-son-role" aria-label="Source 2">[2]</a> <a href="https://www.cnil.fr/fr/determiner-la-qualification-juridique-des-fournisseurs-de-systemes-dia" aria-label="Source 9">[9]</a>

**A company’s position in an organisation chart does not settle its data protection role.** The relevant evidence concerns who decided which information was needed, how long it would be retained and what uses were permitted. A contracting chain becomes intelligible when those choices can be linked to identifiable legal entities. <a href="https://www.cnil.fr/fr/rgpd-comment-bien-identifier-son-role" aria-label="Source 2">[2]</a>

## The suppliers behind the interface

Ophelos’s global privacy notice, updated on **25 March 2025**, names AWS for hosting, Front for support, Sendgrid for email delivery and Thoughtspot for website analytics. It separately identifies Stripe for payments. The disclosure names some providers while leaving unspecified the data each receives, the configuration of French collection accounts and the language-model provider used for a particular response. <a href="https://www.ophelos.com/privacy" aria-label="Source 5">[5]</a>

Investigating a specific interaction would require more than a list of brands. The information’s route would need to be reconstructed: which entity receives the message, which services process it, who can access it and where any copies go. That would also help distinguish data needed for the service from information used for other purposes.

The European Data Protection Board’s **Opinion 22/2024**, adopted on **7 October 2024**, provides a clear reference point. The controller should know the identities of processors and further processors throughout the chain. It must verify their safeguards, with the depth of verification proportionate to the risks. The Board does not, however, require every downstream contract to be obtained systematically. Knowing the chain and checking its guarantees is not the same as indiscriminately collecting every commercial document. <a href="https://www.edpb.europa.eu/system/files/documents/2024-10/edpb_opinion_202422_relianceonprocessors-sub-processors_en.pdf" aria-label="Source 6">[6]</a>

Proportionality matters. An examination can ask whether the evidence covers the actual use: the data involved, access, continuity and permitted actions. A highly detailed review of a secondary component might leave an unanswered question about the service that authorises reminders to be sent. This is an assessment criterion proposed here, not a finding from an audit of the companies mentioned.

## Identifying the recipients of personal data

The person receiving a reminder also has a route to information. In its **12 January 2023** judgment in **Case C-154/21**, the Court of Justice of the European Union held that the right of access generally includes the actual identity of recipients to whom personal data have been or will be disclosed. Categories may suffice where identification is impossible, or where the controller demonstrates that the request is manifestly unfounded or excessive. <a href="https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:62021CJ0154" aria-label="Source 7">[7]</a>

A general privacy notice and an answer to an access request serve somewhat different purposes. The latter may allow an individual to move from a category such as IT providers to the actual recipients of their data. The judgment does not create a general entitlement to all of a company’s contracts, its source code or the names of suppliers that have received none of that person’s information. <a href="https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:62021CJ0154" aria-label="Source 7">[7]</a>

For this investigation, such a response would be evidence to compare with the operator’s account of the service and its published disclosures. No individual access request was made for this article. The recipients of a French account’s data cannot therefore be inferred from Ophelos’s general notice alone.

## Answering a message and improving a product

Handling a conversation is distinct from improving the product. In this context, *inference* means using a model to produce an output. Training changes the model using data. Evaluation measures its behaviour. These operations can involve different information and need to be examined according to their purposes, rather than combined under the single label AI. <a href="https://www.autoritedelaconcurrence.fr/fr/communiques-de-presse/intelligence-artificielle-generative-lautorite-rend-son-avis-sur-le" aria-label="Source 19">[19]</a> <a href="https://cnil.fr/fr/assurer-que-le-traitement-est-licite-reutilisation-des-donnees" aria-label="Source 10">[10]</a>

Ophelos’s notice provides for research and development, including service improvement, and mentions creating or using aggregated, de-identified or anonymised data. It does not establish that an individual message has been used to train an external model. That would require further evidence about the data actually reused, the service configuration and the operations performed. <a href="https://www.ophelos.com/privacy" aria-label="Source 5">[5]</a>

The CNIL’s guidance of **11 January 2022** sets conditions for a processor’s reuse of entrusted data: valid written authorisation, compatibility assessment as applicable, a lawful basis and information for those concerned. **A blanket advance authorisation to reuse the data is unlawful.** For the new use, the supplier itself becomes the controller. <a href="https://www.cnil.fr/fr/sous-traitants-la-reutilisation-de-donnees-confiees-par-un-responsable-de-traitement" aria-label="Source 8">[8]</a>

<figure style="max-width:560px;margin:2rem auto 2.5rem;">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 350" role="img" aria-labelledby="ia5-en-fig-title ia5-en-fig-desc" style="width:100%;height:auto" font-family="Arial, Helvetica, sans-serif">
<title id="ia5-en-fig-title">A new use changes the data protection role</title>
<desc id="ia5-en-fig-desc">An actor initially handles data as a processor for a client. It follows the client’s instructions for that assignment. When it reuses the data for its own purpose, it becomes controller for that new processing. Whether reuse is lawful requires a separate assessment.</desc>
<g data-region="input"><rect x="70" y="12" width="360" height="66" rx="10" fill="var(--color-surface)" stroke="var(--color-line-strong)"/><text x="250" y="53" text-anchor="middle" font-size="24" font-weight="700" fill="var(--color-paper)">Entrusted data</text></g>
<path d="M250 78 V98 H125 V118 M250 98 H375 V118 M119 111 L125 118 L131 111 M369 111 L375 118 L381 111" fill="none" stroke="var(--color-muted)" stroke-width="2"/>
<g data-region="client"><rect x="12" y="126" width="226" height="152" rx="10" fill="var(--color-surface)" stroke="var(--color-signal)"/><text x="125" y="158" text-anchor="middle" font-size="20" fill="var(--color-muted)">Client’s purpose</text><text x="125" y="207" text-anchor="middle" font-size="24" font-weight="700" fill="var(--color-signal)">Processor</text><text x="125" y="244" text-anchor="middle" font-size="20" fill="var(--color-paper)">for this assignment</text></g>
<g data-region="reuse"><rect x="262" y="126" width="226" height="152" rx="10" fill="var(--color-surface)" stroke="var(--color-accent)"/><text x="375" y="158" text-anchor="middle" font-size="20" fill="var(--color-muted)">Own purpose</text><text x="375" y="195" text-anchor="middle" font-size="24" font-weight="700" fill="var(--color-accent)">Controller</text><text x="375" y="223" text-anchor="middle" font-size="20" fill="var(--color-paper)">for the new</text><text x="375" y="256" text-anchor="middle" font-size="20" fill="var(--color-paper)">processing operation</text></g>
<text x="250" y="320" text-anchor="middle" font-size="22" font-weight="700" fill="var(--color-paper)">Assess the role for each use.</text>
</svg>
<figcaption style="margin:.75rem 0 0;">An actor initially acts as a processor. Reuse for its own purpose requires a separate assessment: valid written authorisation, compatibility as applicable, a lawful basis and information for those concerned. Source: CNIL <a href="https://www.cnil.fr/fr/sous-traitants-la-reutilisation-de-donnees-confiees-par-un-responsable-de-traitement" aria-label="Source 8">[8]</a>.</figcaption>
</figure>

The CNIL also distinguishes AI development from deployment: organisations must be classified for the processing operations in which they actually participate. Reuse of information already held requires its own legal examination. **Receiving a conversation to deal with an unpaid account does not, by itself, confer freedom to use it for any other product.** <a href="https://www.cnil.fr/fr/determiner-la-qualification-juridique-des-fournisseurs-de-systemes-dia" aria-label="Source 9">[9]</a> <a href="https://cnil.fr/fr/assurer-que-le-traitement-est-licite-reutilisation-des-donnees" aria-label="Source 10">[10]</a>

The documentary question is straightforward even when the technical answer is not: what happens to the message after the customer receives a reply? A useful account would distinguish retention for servicing the debt, possible examination for quality control and reuse to develop the system. We have not obtained the configurations needed to reconstruct those operations at the businesses studied.

## Keeping the ability to take the work back

Some collection arrangements fall within a more specialised regime. France’s Monetary and Financial Code regulates servicers acting for purchasers of **non-performing loans**, loans classified as non-performing under the applicable prudential rules. Scope depends on matters including the original lender, the loan’s status at transfer and the date of the sale. Articles L54-11-1 to L54-11-3 contain exclusions, including certain professionals and transfers before **30 December 2023**. **This is not a regime for every unpaid household invoice.** <a href="https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006072026/LEGISCTA000048520910/" aria-label="Source 11">[11]</a>

Within its scope, outsourcing does not discharge the servicer from the responsibilities imposed by that chapter. Article L54-11-14, in the version effective since **3 May 2025**, requires a written agreement, direct access to relevant information and preservation of obligations towards the credit purchaser and borrowers. Crucially, after termination, the servicer must still have the expertise and resources needed to perform the outsourced activities. <a href="https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006072026/LEGISCTA000048520910/" aria-label="Source 11">[11]</a> <a href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000051558621" aria-label="Source 12">[12]</a>

Taking operations back requires recoverable records, usable formats, staff with the necessary skills and a replacement service. A documented exercise would help assess those resources, the time required and the difficulties encountered. No such exercise was observed for this article.

A **ministerial order dated 24 March 2026**, published on **12 April** and effective from **13 April**, adds controls for a particular arrangement: outsourcing the receipt and holding of borrower funds to another authorised servicer or certain professionals. For the arrangement defined in Article 6, Articles 10 and 11 require prior assessment, monitoring and termination arrangements, and the servicer’s prior agreement before a substantial change to the outsourced service can be imposed. **This obligation concerns the receipt and holding of funds within the arrangement defined by the order.** <a href="https://www.legifrance.gouv.fr/loda/id/JORFTEXT000053797360" aria-label="Source 13">[13]</a>

The value of that framework for an investigation lies in identifying the documents to request when the activity is actually covered. Citing a detailed obligation without first establishing that the contract and provider fall within its scope would mislead the reader.

## Stopping an action while preserving a service

Control over an outsourced provider also has a technical dimension. A conversational agent can be limited to drafting text or have access that enables it to trigger an operation. In its **29 April 2024** security guide, France’s cybersecurity agency ANSSI recommends limiting or prohibiting automated actions based on untrusted inputs, such as emails. It also recommends appropriate, protected logging. This is cybersecurity guidance, not certification of a firm’s collection practices or legal compliance. <a href="https://messervices.cyber.gouv.fr/documents-guides/Recommandations_de_s%C3%A9curit%C3%A9_pour_un_syst%C3%A8me_d_IA_g%C3%A9n%C3%A9rative.pdf" aria-label="Source 14">[14]</a>

Consider a design scenario, **not an observed incident**. A contract allows a client to request suspension of the AI. The technical team switches off the model, but another component retains scheduled messages. Stopping the calculation and stopping delivery are then separate operations. Whether suspension works depends on which permissions are actually withdrawn.

A useful control would match the contractual right to the operational mechanism. Who can block sending? Can they do so without the supplier’s intervention? Can operations already under way be identified? How will someone seeking an explanation retain a channel of contact? These are proposed test questions, not presumed answers about the operators.

Restart conditions matter as well. Can a team compare versions, understand the changes and check performance before restoring the service? That would help test the control retained over a supplier. It does not require pretending a model will remain unchanged. It requires knowing which changes call for which review.

Technical records can help reconstruct the sequence: the instructions in force, permissions, service version, triggering event and operational result. But collecting more information is not automatically more protective. The CNIL recommends limiting data in logs, protecting access and avoiding excessive duplication of the information being processed. The aim is useful evidence, not indefinite retention of every personal disclosure. <a href="https://www.cnil.fr/fr/securite-tracer-les-operations" aria-label="Source 15">[15]</a>

Suspending a technical component does not itself erase a debt. Under the proposed framework, a human team or replacement service must be able to handle legitimate requests, including those from the person being asked to pay. Continuity needs to cover both sides of the relationship, not merely the ability to send another reminder.

## The conditions for compensation

If harm occurs, every company in the chain does not automatically become liable on identical terms. Article 82 of the GDPR distinguishes controllers from processors. The latter are liable, in particular, for breaches of obligations directed specifically at them or for acting outside lawful instructions. The provision also includes grounds for exemption and recourse between parties. Where several participants are responsible for damage caused by the same processing, each may be liable for the entire damage, with subsequent recourse according to their shares of responsibility. **Being named in a supplier chain does not establish liability for every harm.** <a href="https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre8" aria-label="Source 16">[16]</a>

The Court of Justice clarified on **4 May 2023**, in **Case C-300/21**, that compensation requires an infringement, damage and a causal link. An infringement alone is insufficient. Non-material damage does not, however, need to pass a minimum seriousness threshold, although it must be demonstrated. Handling a complaint, imposing a sanction and compensating an individual are different processes. <a href="https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:62021CJ0300" aria-label="Source 17">[17]</a>

This article does not reconstruct the indemnities or liability caps negotiated between the businesses: the signed contracts have not been obtained. Commercial allocation of costs, data protection obligations and civil liability need to be examined on their own evidence and legal basis.

Disclosure of an AI interaction has its own framework. According to the European Commission, the relevant Article 50 obligations under the AI Act have applied since **2 August 2026**. Providers of covered systems that interact directly with people must design them to disclose that AI interaction from the start, subject notably to the exception where it is obvious. Identifying responsible parties and obtaining compensation fall under the rules examined above. <a href="https://digital-strategy.ec.europa.eu/en/faqs/transparency-obligations-under-article-50-ai-act" aria-label="Source 18">[18]</a>

## The evidence still needed

Outsourcing may provide specialist skills and a service an organisation would struggle to build alone. That possibility should not be dismissed. The useful test concerns the means retained to understand, control and replace the service. The EDPB’s opinion on processors itself combines verification obligations with a risk-proportionate approach. <a href="https://www.edpb.europa.eu/system/files/documents/2024-10/edpb_opinion_202422_relianceonprocessors-sub-processors_en.pdf" aria-label="Source 6">[6]</a>

The signed contracts, the full list of recipients of a French account’s data and the reuse configurations remain to be obtained. The ability to suspend and resume the service also requires examination in practice. The public material provides no basis for concluding that the named businesses have breached their obligations on these points.

The most useful evidence would connect contractual instructions for a specific use, that use’s supplier chain and a documented control showing which operations the instructions permit. For continuity, an actual takeover exercise, including its results and difficulties, would carry more weight than a reference to exit arrangements in a contract.

**A contract binds an organisation; its execution can be checked in the operations.** The next stage of this investigation would follow an instruction through to the action it permits, then examine how the client takes back control when the service ends.

## Method and limitations

Documentary investigation current to **25 September 2026**, based on company notices, official legislation, European case law and guidance from public authorities. Ophelos’s descriptions are global and do not verify French deployments. No interviews, enquiries to companies, account access or tests of commercial platforms were conducted. The diagram explains the change in role when data are reused for a supplier’s own purpose, following the CNIL’s guidance. It depicts no audited company architecture. The legal discussion does not replace professional assessment of an individual contract or situation.

## Sources and reference points

<p id="ia5-en-s01"><strong>[1] Intrum France</strong>. <a href="https://www.intrum.fr/solutions-entreprises/a-propos-d-intrum/donnees-personnelles/" rel="noreferrer">Données personnelles</a>. Undated page. Declared roles by service, including billing administration and collection.</p>

<p id="ia5-en-s02"><strong>[2] CNIL</strong>. <a href="https://www.cnil.fr/fr/rgpd-comment-bien-identifier-son-role" rel="noreferrer">Responsable du traitement, sous-traitants : comment bien identifier son rôle ?</a>. 6 June 2025. Classification based on facts; essential means distinguished from technical implementation.</p>

<p id="ia5-en-s03"><strong>[3] Légifrance</strong>. <a href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000025938366" rel="noreferrer">Code des procédures civiles d’exécution, article R124-3</a>. In force since 1 June 2012. Agreement with the creditor within the relevant third-party collection framework.</p>

<p id="ia5-en-s04"><strong>[4] CNIL / Règlement (UE) 2016/679</strong>. <a href="https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre4" rel="noreferrer">RGPD, chapitre IV : responsable du traitement et sous-traitant</a>. Articles 24, 26, 28 and 32. Responsibilities, safeguards and processing arrangements.</p>

<p id="ia5-en-s05"><strong>[5] Ophelos</strong>. <a href="https://www.ophelos.com/privacy" rel="noreferrer">Global Privacy Policy</a>. Updated 25 March 2025. Global notice and declared providers; not automatically applicable to every French account.</p>

<p id="ia5-en-s06"><strong>[6] Comité européen de la protection des données</strong>. <a href="https://www.edpb.europa.eu/system/files/documents/2024-10/edpb_opinion_202422_relianceonprocessors-sub-processors_en.pdf" rel="noreferrer">Opinion 22/2024 on certain obligations following from the reliance on processor(s) and sub-processor(s)</a>. Adopted 7 October 2024, published 9 October. Executive summary, PDF pages 2–3; identification and verification of processors.</p>

<p id="ia5-en-s07"><strong>[7] Cour de justice de l’Union européenne</strong>. <a href="https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:62021CJ0154" rel="noreferrer">Österreichische Post, C-154/21, EU:C:2023:3</a>. 12 January 2023. Actual recipients of personal data and limits of the access right.</p>

<p id="ia5-en-s08"><strong>[8] CNIL</strong>. <a href="https://www.cnil.fr/fr/sous-traitants-la-reutilisation-de-donnees-confiees-par-un-responsable-de-traitement" rel="noreferrer">Sous-traitants : la réutilisation de données confiées par un responsable de traitement</a>. 11 January 2022. Reuse for a processor’s own purposes and the resulting change in role.</p>

<p id="ia5-en-s09"><strong>[9] CNIL</strong>. <a href="https://www.cnil.fr/fr/determiner-la-qualification-juridique-des-fournisseurs-de-systemes-dia" rel="noreferrer">Déterminer la qualification juridique des acteurs</a>. 8 April 2024. Classification of organisations participating in AI-system development.</p>

<p id="ia5-en-s10"><strong>[10] CNIL</strong>. <a href="https://cnil.fr/fr/assurer-que-le-traitement-est-licite-reutilisation-des-donnees" rel="noreferrer">Assurer que le traitement est licite : réutilisation des données</a>. 8 April 2024. Lawfulness and purpose when data are reused for AI development.</p>

<p id="ia5-en-s11"><strong>[11] Légifrance</strong>. <a href="https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006072026/LEGISCTA000048520910/" rel="noreferrer">Code monétaire et financier, chapitre XI : gestionnaires et acheteurs de crédits</a>. Version checked on 25 September 2026. Definitions, exclusions and retained outsourcing responsibilities.</p>

<p id="ia5-en-s12"><strong>[12] Légifrance</strong>. <a href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000051558621" rel="noreferrer">Code monétaire et financier, article L54-11-14</a>. In force since 3 May 2025. Information access and expertise needed to take outsourced activities back.</p>

<p id="ia5-en-s13"><strong>[13] Légifrance</strong>. <a href="https://www.legifrance.gouv.fr/loda/id/JORFTEXT000053797360" rel="noreferrer">Arrêté du 24 mars 2026 relatif à la protection des fonds et à l’externalisation par les gestionnaires de crédits</a>. Dated 24 March, published 12 April, effective 13 April 2026. Articles 6, 10 and 11; the specific receipt-and-holding-of-funds arrangement.</p>

<p id="ia5-en-s14"><strong>[14] ANSSI</strong>. <a href="https://messervices.cyber.gouv.fr/documents-guides/Recommandations_de_s%C3%A9curit%C3%A9_pour_un_syst%C3%A8me_d_IA_g%C3%A9n%C3%A9rative.pdf" rel="noreferrer">Recommandations de sécurité pour un système d’IA générative</a>. 29 April 2024. R27 and R29, PDF page 27: actions based on untrusted inputs and logging.</p>

<p id="ia5-en-s15"><strong>[15] CNIL</strong>. <a href="https://www.cnil.fr/fr/securite-tracer-les-operations" rel="noreferrer">Sécurité : tracer les opérations</a>. 14 March 2024. Contents, protection and limits of technical logs.</p>

<p id="ia5-en-s16"><strong>[16] CNIL / Règlement (UE) 2016/679</strong>. <a href="https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre8" rel="noreferrer">RGPD, chapitre VIII : voies de recours, responsabilité et sanctions</a>. Article 82. Controller and processor liability, exemption and recourse between liable participants.</p>

<p id="ia5-en-s17"><strong>[17] Cour de justice de l’Union européenne</strong>. <a href="https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:62021CJ0300" rel="noreferrer">Österreichische Post, C-300/21, EU:C:2023:370</a>. 4 May 2023. Conditions for compensation and no minimum seriousness threshold for non-material damage.</p>

<p id="ia5-en-s18"><strong>[18] Commission européenne</strong>. <a href="https://digital-strategy.ec.europa.eu/en/faqs/transparency-obligations-under-article-50-ai-act" rel="noreferrer">Transparency obligations under Article 50 of the AI Act</a>. Checked 25 September 2026. AI-interaction disclosure; obligations applicable from 2 August 2026.</p>

<p id="ia5-en-s19"><strong>[19] Autorité de la concurrence</strong>. <a href="https://www.autoritedelaconcurrence.fr/fr/communiques-de-presse/intelligence-artificielle-generative-lautorite-rend-son-avis-sur-le" rel="noreferrer">Intelligence artificielle générative : fonctionnement concurrentiel du secteur</a>. 28 June 2024. Definitions of training and inference; no market figures reproduced.</p>

*Documents consulted on 25 September 2026. Pages without an established date are marked as undated. Several texts come from the same organisation; their number does not measure independent confirmations.*
