---
title: "Your identity in your phone, 2/8: the cost of alternative routes"
seoTitle: "France Identité: the cost of alternative routes | l0g"
ogTitle: "France Identité: the cost of alternative routes"
description: "Training, housing grants, company filings and voting proxies: delays, letters, certificates and travel across four official alternatives to FranceConnect+."
ogImage: "/illustrations/news/france-digital-identity-alternative-routes-v1.jpg"
pubDate: 2026-08-28T13:36:00+02:00
updatedDate: 2026-08-28T13:36:00+02:00
tags: ["France Identité", "FranceConnect+", "digital identity", "eIDAS", "EUDI Wallet", "accessibility", "public services", "France", "investigation"]
draft: false
sourceArticle: "votre-identite-dans-un-telephone-2-facultative-mais-a-quel-prix"
sourceUpdatedDate: 2026-08-28T13:36:00+02:00
---

*To buy training through France’s personal training account without FranceConnect+, Mon Compte Formation announces a manual identity check taking about four weeks. To create a France Rénov’ account without FranceConnect+, the postal check may take two weeks. To amend or close a company, the alternative requires an advanced electronic signature based on a qualified certificate. To establish a voting proxy, it still requires an in-person identity check.*

*France Identité remains optional. Alternatives exist. The more useful question is now measurable: how much extra time, paperwork, travel and technical skill must a person provide to exercise the same right without a mobile digital identity?*

*This is part two of **Your identity in your phone**. The first article followed [the data, servers and logs behind France Identité](/en/analysis/your-identity-in-your-phone-1-when-an-id-card-becomes-a-service/).*

*Version française : [Le coût des parcours alternatifs](/posts/votre-identite-dans-un-telephone-2-facultative-mais-a-quel-prix/).*

## Key points

- The consolidated eIDAS regulation says that use of the European Digital Identity Wallet must remain voluntary. People who do not use it must not be disadvantaged and other identification and authentication means must remain available.
- FranceConnect’s own integration documentation already says that FranceConnect and FranceConnect+ are optional and that connected services must provide an alternative with an equivalent level of security.
- France’s Conseil d’État has not created a general right to paper procedures. A mandatory online service can be lawful if normal access to public services and the effective exercise of rights are guaranteed. Complex or sensitive procedures may require a substitute route.
- Mon Compte Formation announces about four weeks for its manual identity check. Its paper procedure can extend the delay further.
- France Rénov’ recommends FranceConnect+, but allows account creation by email followed by a postal identity check that can take two weeks.
- France’s INPI company portal allows FranceConnect+ to be replaced by an advanced electronic signature based on a qualified certificate, requiring the PDF to be downloaded, signed outside the portal and uploaded again.
- A voting proxy can still be established without France Identité, but the fully digital route removes the physical identity check.
- In the latest quantified audits found on the official page, both France Identité apps were declared non-compliant with the RAAM mobile accessibility framework. Those audits were dated 23 May 2025, covered pre-production builds and do not necessarily describe the public versions available in August 2026.
- The issue is not whether every route is identical. The red line is crossed when the delay or complexity of an alternative causes a person to lose the right that route is supposed to preserve.

## Mon Compte Formation: about four weeks of manual review

The alternative exists. It begins with a wait.

To buy a course through the French personal training account, a user can authenticate through FranceConnect+ with either La Poste’s digital identity or a certified France Identité identity. Mon Compte Formation also provides a route for people who do not meet the eligibility conditions for either solution.

The official page is explicit: the manual identity check requires [about four weeks of processing time](https://www.moncompteformation.gouv.fr/espace-public/je-ne-remplis-pas-les-conditions-pour-utiliser-franceconnect). The user must first create and activate an account, then start an online verification. The postal address must be accurate because a registered letter may be used to establish identity.

If the online verification fails, a paper procedure remains available. It requires a form, a copy of an identity document, a copy of the French health card or a social-security certificate, and a postal submission. The envelope is postage-free, but the site warns that this route can considerably extend processing time. Once the file has been received and reviewed, a registered letter must still be delivered at home or collected at a post office. The final notification may arrive up to ten days after that verification.

The contrast is immediate:

```text
FranceConnect+
strong digital identity
→ authentication
→ training purchase route

Published alternative
active account
→ manual check
→ possible registered letter
→ about four weeks
→ an even longer paper route if online verification fails
```

This comparison does not establish that every FranceConnect+ transaction is instantaneous, or that every manual check takes exactly 28 days. It establishes an official asymmetry: the published time for the alternative is measured in weeks.

The decisive question is missing from the public documentation. What happens when the training session begins before verification is complete? Does the date of the initial request preserve a place, funding or price? What are the median delay, the 90th percentile, the incomplete-file rate and the abandonment rate?

Mon Compte Formation publishes the procedure. It does not publish the performance of that route on this page.

## European protection against disadvantage

The European principle is strong.

Article 5a(15) of the consolidated eIDAS regulation states that use of European Digital Identity Wallets must be voluntary. Access to public and private services, the labour market and freedom to conduct a business must not be restricted or made disadvantageous for people who choose not to use the wallet. Existing means of identification and authentication must remain accessible. [The consolidated text is available on EUR-Lex](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:02014R0910-20241018).

That rule concerns the EUDI wallet. The FranceConnect+ routes examined here are existing services and do not, by themselves, constitute the complete European wallet.

Two French safeguards already exist.

In December 2021, France’s data-protection authority, the CNIL, wrote that creation and use of SGIN, the system behind France Identité, had to remain optional. It could not be imposed as the condition for accessing public or private services. Other electronic identification methods had to remain available and public services also had to preserve a physical counter in order to guarantee equal access. [CNIL decision 2021-151 states this in paragraphs 5 and 6](https://france-identite.gouv.fr/assets/files/CNIL-D%C3%A9lib%C3%A9ration-2021-151_SGIN-France-Identit%C3%A9-1.pdf).

The documentation for FranceConnect integrators is just as clear: FranceConnect and FranceConnect+ are optional for users. Services that integrate them must provide [an alternative offering an equivalent level of security](https://docs.partenaires.franceconnect.gouv.fr/fi/general/fi-general-presentation/).

The decisive word is **security**.

The documentation does not say that the alternative must require the same number of clicks, take the same time, cost the same amount, avoid the same journeys or provide the same level of assistance. A postal check can offer robust identity assurance while adding two or four weeks. A qualified certificate can provide strong evidence while requiring a provider, software and an external procedure.

Legal voluntariness and practical equivalence are therefore not the same thing.

<figure class="infographic infographic-readable" style="padding-bottom:1.5rem" tabindex="0" aria-label="Comparison of FranceConnect+ routes and official alternatives">
<svg viewBox="0 0 360 1040" width="100%" role="img" aria-labelledby="alt-cost-en-title alt-cost-en-desc" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;height:auto;overflow:hidden;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;background:#0c0d10">
<title id="alt-cost-en-title">Published comparison of FranceConnect+ routes and their alternatives</title>
<desc id="alt-cost-en-desc">Four services are compared. Depending on the service, alternative routes add weeks of waiting, an external signature or an in-person visit.</desc>
<rect x="1" y="1" width="358" height="1038" rx="14" fill="#0c0d10" stroke="#2b3038"/>
<text x="18" y="31" fill="#f5f6f8" font-size="15.5" font-weight="700">OFFICIAL ROUTES COMPARED</text>
<text x="18" y="53" fill="#8b909b" font-size="9.5">Official conditions on 28 August 2026.</text>
<text x="18" y="67" fill="#8b909b" font-size="9.5">Not completion times measured by l0g.</text>

<rect x="14" y="88" width="332" height="210" rx="12" fill="#101319" stroke="#5eead4"/>
<text x="28" y="116" fill="#5eead4" font-size="13" font-weight="700">MON COMPTE FORMATION</text>
<rect x="28" y="132" width="304" height="58" rx="8" fill="#10211f" stroke="#2e8f82"/>
<text x="40" y="153" fill="#5eead4" font-size="10.5" font-weight="700">FRANCECONNECT+</text>
<text x="40" y="174" fill="#f5f6f8" font-size="10.5">Strong identity: training purchase route</text>
<rect x="28" y="200" width="304" height="72" rx="8" fill="#21151c" stroke="#ff85ad"/>
<text x="40" y="221" fill="#ff85ad" font-size="10.5" font-weight="700">PUBLISHED ALTERNATIVE</text>
<text x="40" y="242" fill="#f5f6f8" font-size="10.5">Manual review: about 4 weeks</text>
<text x="40" y="260" fill="#aeb4bf" font-size="9.5">The paper route may take longer.</text>
<text x="28" y="287" fill="#6f7580" font-size="8.5">Source: Mon Compte Formation.</text>

<rect x="14" y="316" width="332" height="210" rx="12" fill="#101319" stroke="#7aa2f7"/>
<text x="28" y="344" fill="#7aa2f7" font-size="13" font-weight="700">FRANCE RÉNOV’</text>
<rect x="28" y="360" width="304" height="58" rx="8" fill="#141a28" stroke="#506fb2"/>
<text x="40" y="381" fill="#7aa2f7" font-size="10.5" font-weight="700">FRANCECONNECT+ RECOMMENDED</text>
<text x="40" y="402" fill="#f5f6f8" font-size="10.5">Secured account: grant route</text>
<rect x="28" y="428" width="304" height="72" rx="8" fill="#21151c" stroke="#ff85ad"/>
<text x="40" y="449" fill="#ff85ad" font-size="10.5" font-weight="700">PUBLISHED ALTERNATIVE</text>
<text x="40" y="470" fill="#f5f6f8" font-size="10.5">Email account: postal identity check</text>
<text x="40" y="488" fill="#aeb4bf" font-size="9.5">The step may take 2 weeks.</text>
<text x="28" y="515" fill="#6f7580" font-size="8.5">Source: France Rénov’ portal.</text>

<rect x="14" y="544" width="332" height="210" rx="12" fill="#101319" stroke="#f5b13d"/>
<text x="28" y="572" fill="#f5b13d" font-size="13" font-weight="700">INPI BUSINESS PORTAL</text>
<rect x="28" y="588" width="304" height="58" rx="8" fill="#1b1b14" stroke="#9f7626"/>
<text x="40" y="609" fill="#f5b13d" font-size="10.5" font-weight="700">FRANCECONNECT+</text>
<text x="40" y="630" fill="#f5f6f8" font-size="10.5">Confirm and sign inside the portal</text>
<rect x="28" y="656" width="304" height="72" rx="8" fill="#21151c" stroke="#ff85ad"/>
<text x="40" y="677" fill="#ff85ad" font-size="10.5" font-weight="700">PUBLISHED ALTERNATIVE</text>
<text x="40" y="698" fill="#f5f6f8" font-size="10.5">Qualified certificate and external signing</text>
<text x="40" y="716" fill="#aeb4bf" font-size="9.5">Download, sign and upload the PDF.</text>
<text x="28" y="743" fill="#6f7580" font-size="8.5">Source: INPI. No average delay published.</text>

<rect x="14" y="772" width="332" height="210" rx="12" fill="#101319" stroke="#a78bfa"/>
<text x="28" y="800" fill="#a78bfa" font-size="13" font-weight="700">VOTING PROXY</text>
<rect x="28" y="816" width="304" height="58" rx="8" fill="#171426" stroke="#7561b4"/>
<text x="40" y="837" fill="#a78bfa" font-size="10.5" font-weight="700">CERTIFIED FRANCE IDENTITÉ</text>
<text x="40" y="858" fill="#f5f6f8" font-size="10.5">Fully online, no physical identity check</text>
<rect x="28" y="884" width="304" height="72" rx="8" fill="#21151c" stroke="#ff85ad"/>
<text x="40" y="905" fill="#ff85ad" font-size="10.5" font-weight="700">PUBLISHED ALTERNATIVE</text>
<text x="40" y="926" fill="#f5f6f8" font-size="10.5">Online or paper request</text>
<text x="40" y="944" fill="#aeb4bf" font-size="9.5">Then an in-person identity check.</text>
<text x="28" y="971" fill="#6f7580" font-size="8.5">Source: Service-Public.</text>

<rect x="14" y="999" width="332" height="24" rx="7" fill="#15171b" stroke="#343943"/>
<text x="180" y="1015" text-anchor="middle" fill="#aeb4bf" font-size="8.5">A published route is not yet a measured performance.</text>
</svg>
<figcaption>The delays are those displayed by the services. l0g presents them neither as observed averages nor as guaranteed maximums.</figcaption>
</figure>

## The legal framework for mandatory online services

Another shortcut must be avoided. French law does not guarantee that a paper version of every administrative process will remain available.

On 3 June 2022, the Conseil d’État held that the government may require an online service for an administrative procedure. No constitutional principle prevents that in itself. The power is constrained: the administration must guarantee normal access to the public service and the effective exercise of rights. It must consider the complexity of the procedure, the characteristics of the digital tool and the difficulties faced by the relevant public. For certain particularly complex or sensitive procedures, a substitute route must be available when the user cannot use the online service despite the assistance provided. [The Conseil d’État publishes both the judgment and an accessible summary](https://www.conseil-etat.fr/actualites/demarches-administratives-en-ligne-le-conseil-d-etat-fixe-un-cadre-general-et-se-prononce-sur-les-demandes-de-titre-de-sejour).

The useful test is therefore broader than the existence of a printable form. It asks whether the right remains effectively accessible:

```text
Is the delay compatible with the deadline?
Is the alternative free?
Can it be completed without extra equipment?
Does it require travel or an outside intermediary?
Is competent human assistance available?
Does a technical failure suspend or destroy the request?
Does the initial filing date protect the user during review?
```

This framework changes the debate. An alternative may be entirely digital. It may also be slower or require more evidence. The legal and democratic problem begins when it stops being an effective means of exercising the right.

## France Rénov’: two weeks by post

Since 17 August 2026, France Rénov’ has become the common account gateway for MaPrimeRénov’, MaPrimeAdapt’ and Ma Prime Logement Décent, France’s main home-renovation and adaptation grant programmes. The National Housing Agency, Anah, presents the unified account as a simpler route and stronger protection against identity fraud. Existing account holders can secure their account through FranceConnect+ or by post. [Anah described the change before launch](https://www.anah.gouv.fr/presse/compter-du-17-aout-2026-france-renov-renforce-son-offre-de-services-avec-un-compte-personnel).

The current portal is more precise. FranceConnect+ is described as “recommended”, not mandatory. A person who does not wish to use it, or cannot use it, can create an account with an email address. France Rénov’ must then verify identity by post and says [this step can take two weeks](https://authentification.france-renov.gouv.fr/).

```text
FranceConnect+
→ secured account
→ access to the grant route

Email address
→ account creation
→ postal identity check
→ published delay of up to two weeks
```

This is the official published alternative. It preserves a route for people without a high-assurance mobile identity.

It also raises concrete questions. Is two weeks an estimate, a target or a maximum? Can a file be prepared before the check is complete? Does the account-creation date preserve eligibility when rules or funding envelopes change? What happens if the letter never arrives, or if the applicant is temporarily housed, mobile or lacks a stable postal address?

The public documentation explains how to enter the route. It does not yet publish how many accounts use postal verification, the observed processing time, the non-delivery rate or the abandonment rate.

## INPI: an external certificate to amend or close a company

France’s single business-formalities portal provides a third model.

For a company creation, ticking a box is enough to sign the declaration. For an amendment, closure or annual-account filing, INPI requires an advanced electronic signature based on a qualified certificate so that the signer’s identity can be verified. FranceConnect+ can replace that requirement free of charge. [INPI’s FAQ describes both routes](https://www.inpi.fr/faq/890).

With FranceConnect+, the user downloads and checks the summary, confirms that the information is correct and clicks the signature button.

Without FranceConnect+, the user must:

1. sign in through ordinary FranceConnect or INPIConnect;
2. download the non-editable summary PDF;
3. use an advanced electronic-signature provider;
4. sign the document outside the portal;
5. upload the signed PDF again;
6. complete the filing.

The alternative is real. It meets a strong security standard. It is also more technical and depends on an outside provider.

INPI’s FAQ publishes neither a tariff nor an average time for obtaining and using the certificate. l0g therefore assigns no typical cost and does not turn heterogeneous commercial offers into a market average.

A second documentary limitation deserves notice. [The tutorial included in INPI’s FAQ](https://www.inpi.fr/faq/890) still mentions only La Poste’s digital identity, while [FranceConnect says France Identité is available through FranceConnect+ and that a service cannot restrict the provider list](https://docs.partenaires.franceconnect.gouv.fr/fs/fs-pilotage/fs-pilotage-fi/). The discrepancy may reflect an outdated page. It does not prove that France Identité is technically rejected by the business portal.

The established point is narrower: a mobile identity turns an external signature into a confirmation box. Without it, the burden of finding, obtaining and operating a suitable certificate returns to the entrepreneur.

## Voting proxy: an in-person check without a certified identity

The voting-proxy procedure provides the most balanced case.

Since November 2025, a person with a certified France Identité identity can establish or revoke a proxy entirely online. The voter completes the request through Maprocuration and authenticates with the certified identity. No visit to a police station, gendarmerie, consulate or embassy is required. [France’s official public-service portal describes the route and its extension to all elections](https://www.service-public.gouv.fr/particuliers/actualites/A18658?lang=en).

Without a certified identity, two routes remain:

- file the request online, then attend an authorised authority for an in-person identity check;
- use the paper form and complete the required check.

A person unable to travel for a serious reason may, under the published conditions, request a visit by a police officer or gendarme.

The right to appoint a proxy is therefore not conditional on France Identité. The fully online route removes the physical identity check. The reviewed source publishes no average comparative delay from which to quantify the time saved.

That difference is not illegitimate in itself. A digital service is useful precisely because it simplifies a procedure. The remaining route must instead be tested for robustness: availability of locations, opening hours, time before the election, physical accessibility and the practical ability to obtain an officer’s visit when needed.

Voluntariness does not require the innovation to be useless. It requires the traditional path not to become impracticable.

## The two FranceConnect+ identity providers

Ordinary FranceConnect relies on several identity providers. FranceConnect+ currently offers only two:

- La Poste’s Digital Identity;
- France Identité.

FranceConnect documentation announces possible additions. TrustMe is described as being in discussions with the French cybersecurity agency ANSSI, and the digital health card may also join. As of 28 August 2026, [only the two mobile identity providers are listed as available](https://docs.partenaires.franceconnect.gouv.fr/fs/fs-pilotage/fs-pilotage-fi/).

That limited number does not make either particular application legally mandatory. A user may choose the other provider or the service-specific alternative.

It does create a common practical dependency: both FranceConnect+ identities use a mobile device and an individual enrolment process. [France Identité currently requires adulthood, the new bank-card-sized French national identity card and a compatible smartphone](https://france-identite.gouv.fr/). [La Poste’s Digital Identity also requires adulthood, an accepted identity document, a compatible smartphone and an eligible mobile number](https://lidentitenumerique.laposte.fr/comment-lobtenir).

A user excluded from both solutions does not encounter one national fallback. The alternative changes by service: manual review for training, post for France Rénov’, a certificate for INPI, and travel for a voting proxy.

Across these four cases, voluntariness is organised service by service. The reviewed pages use no common measure of delay, cost, complexity or assistance.

## The latest public scores for the mobile apps

The issue becomes more sensitive when the obstacle is not a choice but a physical impossibility.

France Identité’s official accessibility page publishes two audits dated 23 May 2025. They cover pre-production versions and use France’s Mobile Application Accessibility Framework, RAAM 1.0. The iOS audit found that 35.14% of applicable criteria were met. The Android audit found 36.11%. Both applications were declared non-compliant. [France Titres publishes the results and their qualifications](https://france-identite.gouv.fr/accessibilite/).

Those figures do not mean that only 35 or 36% of users can operate the application. They measure the share of applicable framework criteria met in the tested builds.

Nor should they be presented as a certain measure of the public applications available in August 2026. France Titres says some functions used test environments, the rail-code function was not operational and behaviour could differ from the public release. The page reviewed by l0g does not display a newer quantified mobile-app audit.

<figure class="infographic infographic-readable" style="padding-bottom:1.5rem" tabindex="0" aria-label="Latest quantified accessibility audits published for France Identité apps">
<svg viewBox="0 0 360 620" width="100%" role="img" aria-labelledby="a11y-en-title a11y-en-desc" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;height:auto;overflow:hidden;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;background:#0c0d10">
<title id="a11y-en-title">Latest quantified accessibility audits published for France Identité</title>
<desc id="a11y-en-desc">The 23 May 2025 audits covered pre-production builds. iOS met 35.14 percent of applicable criteria and Android met 36.11 percent.</desc>
<rect x="1" y="1" width="358" height="618" rx="14" fill="#0c0d10" stroke="#2b3038"/>
<text x="18" y="31" fill="#f5f6f8" font-size="15" font-weight="700">ACCESSIBILITY: LATEST SCORED AUDIT</text>
<text x="18" y="53" fill="#8b909b" font-size="9.5">RAAM 1.0, 23 May 2025, pre-production builds</text>

<rect x="16" y="82" width="328" height="156" rx="12" fill="#101319" stroke="#7aa2f7"/>
<text x="30" y="111" fill="#7aa2f7" font-size="13" font-weight="700">iOS</text>
<text x="330" y="111" text-anchor="end" fill="#f5f6f8" font-size="19" font-weight="700">35.14%</text>
<text x="30" y="134" fill="#aeb4bf" font-size="9.5">of applicable criteria met</text>
<rect x="30" y="156" width="300" height="15" rx="7.5" fill="#242934"/>
<rect x="30" y="156" width="105.42" height="15" rx="7.5" fill="#7aa2f7"/>
<text x="30" y="199" fill="#ff85ad" font-size="11" font-weight="700">STATUS: NON-COMPLIANT</text>
<text x="30" y="219" fill="#8b909b" font-size="9">External audit published by France Titres.</text>

<rect x="16" y="256" width="328" height="156" rx="12" fill="#101319" stroke="#5eead4"/>
<text x="30" y="285" fill="#5eead4" font-size="13" font-weight="700">ANDROID</text>
<text x="330" y="285" text-anchor="end" fill="#f5f6f8" font-size="19" font-weight="700">36.11%</text>
<text x="30" y="308" fill="#aeb4bf" font-size="9.5">of applicable criteria met</text>
<rect x="30" y="330" width="300" height="15" rx="7.5" fill="#242934"/>
<rect x="30" y="330" width="108.33" height="15" rx="7.5" fill="#5eead4"/>
<text x="30" y="373" fill="#ff85ad" font-size="11" font-weight="700">STATUS: NON-COMPLIANT</text>
<text x="30" y="393" fill="#8b909b" font-size="9">External audit published by France Titres.</text>

<rect x="16" y="430" width="328" height="130" rx="12" fill="#1b1b14" stroke="#f5b13d"/>
<text x="30" y="457" fill="#f5b13d" font-size="11" font-weight="700">DO NOT CONFUSE</text>
<text x="30" y="481" fill="#f5f6f8" font-size="9.5">• Not the share of users able to use the app.</text>
<text x="30" y="502" fill="#f5f6f8" font-size="9.5">• Not an audit dated August 2026.</text>
<text x="30" y="523" fill="#f5f6f8" font-size="9.5">• Pre-production could differ from public builds.</text>
<text x="30" y="544" fill="#aeb4bf" font-size="9">The reviewed page shows no newer mobile score.</text>

<text x="18" y="584" fill="#6f7580" font-size="8.5">Source: France Identité accessibility statement.</text>
<text x="18" y="600" fill="#6f7580" font-size="8.5">Reviewed 28 August 2026.</text>
</svg>
<figcaption>The percentages apply to RAAM framework criteria. They do not measure the share of the population capable of using the app.</figcaption>
</figure>

The defects identified in 2025 went beyond graphic comfort. The declaration listed code keypads that could not be used with a screen reader, digits announced only as “buttons”, identity values that were not read correctly, error messages not announced aloud, controls unreachable by keyboard, and content that was clipped or overlapped when text size was increased to 200%.

The document also identifies a more fundamental limit. NFC reading, camera scanning and verifier mode require the user to move the phone and hold it in a particular position. France Titres recognises that this action is physically impossible for some people and that no satisfactory substitute for NFC reading is currently available. The relevant functions are exempted in the declaration.

That transparency is useful. It leads directly to the question of the replacement route.

When a central function of an identity system cannot be used by some people, the alternative cannot simply be “use the app differently”. It must exist outside the inaccessible gesture: another identity provider, human assistance, assisted enrolment, a postal procedure or a physical counter.

The EUDI framework requires wallets to be accessible to people with disabilities on an equal basis with other users. A current audit is therefore essential evidence of the real trajectory, rather than merely of the promised compliance.

## The groups concerned by digital assistance

No general statistic measures exactly who can create and operate France Identité. Digital-skills indicators must therefore not be converted into an app-ineligibility rate.

They do show the scale of the assistance requirement.

In 2025, France’s statistical institute estimated that [34% of people aged 16 to 74](https://www.insee.fr/fr/statistiques/8739245) were digitally excluded or had weak digital skills. Among people aged 60 to 74, 17% were digitally excluded and 38% had weak skills.

That does not mean that 34% of adults are unable to read an identity card through NFC. The indicator combines several fields, from finding information to using software. Conversely, a highly skilled user may still be blocked by a motor disability, a screen reader, an incompatible phone, an older identity card, an ineligible residence permit or an inconsistency in civil-status records.

The French Rights Defender’s 2024 access-to-rights survey, published in 2025, offers another view. [Thirty-six per cent of respondents said they needed occasional help](https://www.defenseurdesdroits.fr/enquete-sur-lacces-aux-droits-sur-les-relations-des-usagers-avec-les-services-publics-que-retenir), 8% could not complete online procedures alone and 7% avoided them. The same research programme reports that 23% had given up a right in the previous five years, with procedural complexity the leading reason cited.

These data do not prove that FranceConnect+ delays have caused that non-take-up. They explain why alternatives must be treated as first-class infrastructure rather than an exception for a marginal population.

## The current scope of France Services

The France Services network provides part of the answer. It lists 2,800 fixed locations and 144 mobile buses, within 20 minutes of users, offering free assistance without an appointment. Advisers support users through administrative procedures and provide access to a digital workspace. For identity cards, the FAQ says they can help with the online pre-application and review the list of documents before the town-hall appointment. [The network describes this scope on its official site](https://www.france-services.gouv.fr/).

This human presence matters. It does not automatically solve every FranceConnect+ problem.

[Official documentation lists Aidants Connect as an additional identity provider for ordinary FranceConnect](https://docs.partenaires.franceconnect.gouv.fr/fs/fs-pilotage/fs-pilotage-fi/), intended for professional helpers. It does not list it among the two providers available through FranceConnect+.

The public pages reviewed do not state whether every France Services location is trained and authorised to:

- assist with NFC reading of the identity card;
- help create a France Identité or La Poste identity;
- resolve a certification failure;
- start Mon Compte Formation’s alternative review;
- track a missing France Rénov’ letter;
- help obtain a qualified certificate for an INPI filing.

The France Services site says that an adviser can assist with an identity-card pre-application without renewing the document. The page therefore documents the boundary for that specific case. It does not publish an equivalent map for creating or certifying France Identité.

## Tool: compare the alternative routes

The four expandable cards below do not produce an opaque score. They keep delay, evidence, travel, equipment and outside intermediaries separate. They describe official conditions published on 28 August 2026, not completion times measured on a sample of users.

<div class="alt-tool" aria-label="Interactive comparison of official alternative routes">
<details style="margin:1rem 0;border:1px solid #2b3038;border-radius:12px;padding:.9rem 1rem;background:#101319">
<summary style="cursor:pointer;font-weight:700">Mon Compte Formation: manual review</summary>
<div style="padding-top:.75rem">
<p><strong>Published delay:</strong> about four weeks. The paper route may extend it; after identity is checked through registered mail, final notification may take up to ten more days.</p>
<p><strong>Evidence:</strong> active account and identity details; on paper, a copy of the identity document and health card or social-security certificate.</p>
<p><strong>Travel:</strong> the registered letter may have to be collected at a post office.</p>
<p><strong>Unpublished question:</strong> is access to the course protected if the session starts during review?</p>
</div>
</details>

<details style="margin:1rem 0;border:1px solid #2b3038;border-radius:12px;padding:.9rem 1rem;background:#101319">
<summary style="cursor:pointer;font-weight:700">France Rénov’: postal verification</summary>
<div style="padding-top:.75rem">
<p><strong>Published delay:</strong> the step may take two weeks.</p>
<p><strong>Evidence:</strong> account creation with an email address, followed by an identity check by post.</p>
<p><strong>Travel:</strong> none is stated as necessary in the published route.</p>
<p><strong>Unpublished question:</strong> does the initial date protect the applicant if a rule or funding envelope changes during the wait?</p>
</div>
</details>

<details style="margin:1rem 0;border:1px solid #2b3038;border-radius:12px;padding:.9rem 1rem;background:#101319">
<summary style="cursor:pointer;font-weight:700">INPI business portal: external signature</summary>
<div style="padding-top:.75rem">
<p><strong>Published delay:</strong> the FAQ gives no average time for obtaining and using the certificate.</p>
<p><strong>Equipment:</strong> access to the PDF, an advanced electronic-signature solution, download and re-upload.</p>
<p><strong>Intermediary:</strong> a trusted certificate or signature provider.</p>
<p><strong>Cost:</strong> the FAQ publishes no tariff; l0g does not calculate an average from heterogeneous commercial offers.</p>
</div>
</details>

<details style="margin:1rem 0;border:1px solid #2b3038;border-radius:12px;padding:.9rem 1rem;background:#101319">
<summary style="cursor:pointer;font-weight:700">Voting proxy: in-person identity check</summary>
<div style="padding-top:.75rem">
<p><strong>Published delay:</strong> there is no single delay; the request must be made early enough to reach the municipality.</p>
<p><strong>Travel:</strong> police station, gendarmerie, consulate or embassy after the online request or paper form. In cases of serious illness or disability, an officer visit may be requested under the published conditions.</p>
<p><strong>France Identité benefit:</strong> removal of that physical check in the fully online route.</p>
<p><strong>Question to measure:</strong> territorial availability and opening hours near an election.</p>
</div>
</details>
</div>

## Six criteria for measuring an alternative route

A digital identity can remain voluntary without providing a strictly identical route for every person. To avoid an arbitrary verdict, l0g keeps six dimensions separate.

<figure class="infographic infographic-readable" style="padding-bottom:1.5rem" tabindex="0" aria-label="The l0g test for real voluntariness of a digital identity">
<svg viewBox="0 0 360 810" width="100%" role="img" aria-labelledby="vol-en-title vol-en-desc" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;height:auto;overflow:hidden;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;background:#0c0d10">
<title id="vol-en-title">The l0g test for real voluntariness</title>
<desc id="vol-en-desc">Six dimensions are examined separately: access, delay, cost, complexity, assistance and preservation of the right.</desc>
<rect x="1" y="1" width="358" height="808" rx="14" fill="#0c0d10" stroke="#2b3038"/>
<text x="18" y="31" fill="#f5f6f8" font-size="16" font-weight="700">THE TEST FOR REAL VOLUNTARINESS</text>
<text x="18" y="53" fill="#8b909b" font-size="9.5">Six dimensions. No opaque aggregate score.</text>
<line x1="34" y1="92" x2="34" y2="711" stroke="#39414d" stroke-width="3"/>

<circle cx="34" cy="119" r="9" fill="#5eead4"/>
<rect x="56" y="84" width="286" height="88" rx="10" fill="#10211f" stroke="#5eead4"/>
<text x="72" y="111" fill="#5eead4" font-size="12" font-weight="700">1. ACCESS</text>
<text x="72" y="134" fill="#f5f6f8" font-size="9.5">Is there a complete route without the right</text>
<text x="72" y="151" fill="#f5f6f8" font-size="9.5">phone, identity card or NFC gesture?</text>

<circle cx="34" cy="223" r="9" fill="#7aa2f7"/>
<rect x="56" y="188" width="286" height="88" rx="10" fill="#141a28" stroke="#7aa2f7"/>
<text x="72" y="215" fill="#7aa2f7" font-size="12" font-weight="700">2. DELAY</text>
<text x="72" y="238" fill="#f5f6f8" font-size="9.5">Is the extra time published, measured</text>
<text x="72" y="255" fill="#f5f6f8" font-size="9.5">and compatible with the deadline?</text>

<circle cx="34" cy="327" r="9" fill="#f5b13d"/>
<rect x="56" y="292" width="286" height="88" rx="10" fill="#1b1b14" stroke="#f5b13d"/>
<text x="72" y="319" fill="#f5b13d" font-size="12" font-weight="700">3. COST</text>
<text x="72" y="342" fill="#f5f6f8" font-size="9.5">Postage, travel, certificate, provider</text>
<text x="72" y="359" fill="#f5f6f8" font-size="9.5">or additional equipment?</text>

<circle cx="34" cy="431" r="9" fill="#a78bfa"/>
<rect x="56" y="396" width="286" height="88" rx="10" fill="#171426" stroke="#a78bfa"/>
<text x="72" y="423" fill="#a78bfa" font-size="12" font-weight="700">4. COMPLEXITY</text>
<text x="72" y="446" fill="#f5f6f8" font-size="9.5">How many stages, documents</text>
<text x="72" y="463" fill="#f5f6f8" font-size="9.5">and interfaces are added?</text>

<circle cx="34" cy="535" r="9" fill="#60a5fa"/>
<rect x="56" y="500" width="286" height="88" rx="10" fill="#111b28" stroke="#60a5fa"/>
<text x="72" y="527" fill="#60a5fa" font-size="12" font-weight="700">5. ASSISTANCE</text>
<text x="72" y="550" fill="#f5f6f8" font-size="9.5">Can a person get the filing completed</text>
<text x="72" y="567" fill="#f5f6f8" font-size="9.5">without surrendering authentication secrets?</text>

<circle cx="34" cy="639" r="9" fill="#ff85ad"/>
<rect x="56" y="604" width="286" height="104" rx="10" fill="#21151c" stroke="#ff85ad"/>
<text x="72" y="631" fill="#ff85ad" font-size="12" font-weight="700">6. PRESERVATION OF THE RIGHT</text>
<text x="72" y="654" fill="#f5f6f8" font-size="9.5">Is the initial filing date protected?</text>
<text x="72" y="671" fill="#f5f6f8" font-size="9.5">Can delay cost the training, grant,</text>
<text x="72" y="688" fill="#f5f6f8" font-size="9.5">company filing or election?</text>

<rect x="16" y="739" width="328" height="42" rx="9" fill="#21151c" stroke="#ff85ad"/>
<text x="180" y="757" text-anchor="middle" fill="#ff85ad" font-size="9.5" font-weight="700">RED LINE</text>
<text x="180" y="773" text-anchor="middle" fill="#f5f6f8" font-size="9">The alternative arrives too late to have its effect.</text>
</svg>
<figcaption>The protocol keeps each dimension separate instead of reducing them to a single score that cannot be justified.</figcaption>
</figure>

### 1. Access

Does a person without a smartphone, without the new identity card, or with a disability that prevents the central gesture have another complete path?

### 2. Delay

Is the additional time published, measured and compatible with the deadline attached to the right? A four-week wait has a different effect on an open-ended process than on a course starting in ten days.

### 3. Cost

Does the alternative add postage, travel, a certificate, a provider or extra equipment? The costs should be identified even when no defensible single tariff can be calculated.

### 4. Complexity

How many stages, documents and interfaces are added? Security may justify friction. It does not remove the need to measure it.

### 5. Assistance

Is there a person capable of taking the user through to effective filing without requiring the user to disclose authentication secrets?

### 6. Preservation of the right

Is the date of the first request preserved? Can an outage, a lost letter or a verification delay cause the user to miss training, a grant, a company filing or an election?

The sixth criterion is the red line. Voluntariness becomes fictional when the substitute route exists formally but arrives too late to have its intended effect.

## The operational data to publish

The debate would be more precise with a public register of FranceConnect+ alternatives.

For each service, it should state:

```text
Service provider
Procedure concerned
Official alternative
Announced delay
Observed median delay
90th percentile
Additional documents
Travel required
Possible cost
Assistance available
Failure rate
Abandonment rate
Rule protecting the filing date
Appeal route
Last verification date
```

The proposed fields concern route outcomes, not technical secrets. Publishing them would allow users to make an informed choice and regulators to compare whether alternatives work in practice.

It would also provide evidence for testing the European non-disadvantage rule when the full EUDI wallet becomes operational.

## The answers still missing

l0g has prepared precise questions for France Titres, the French interministerial digital directorate, the Caisse des Dépôts, Anah, INPI, the CNIL and the Rights Defender.

### France Titres

- Has a new RAAM audit of the iOS and Android applications been completed since May 2025?
- Which screen-reader and keyboard-blocking defects have been fixed?
- What route exists for a person unable to perform or maintain the NFC gesture?
- Does France Services have a national protocol for assisting creation and certification?

### FranceConnect and DINUM

- What exactly is covered by the requirement for an equivalent level of security?
- Does service integration also assess the delay, cost and accessibility of the alternative?
- Is there an inventory of substitute routes?
- What is the timetable for a third FranceConnect+ identity provider?

### Mon Compte Formation

- What are the median and 90th-percentile processing times for manual review?
- How many requests use that route and how many are abandoned?
- Does the initial request preserve a place or funding during verification?

### France Rénov’

- Is two weeks a target, an average or a maximum?
- How many letters are not delivered and how is the user informed?
- Does the account-creation date preserve rights during the wait?

### INPI

- Can France Identité be used for every procedure accessible through FranceConnect+?
- How many users choose the qualified-certificate route and what is their failure rate?
- Does INPI monitor the costs users bear for that alternative?

These questions assume neither illegality nor discrimination. They seek the data needed to test the promise.

## l0g methodology

This article uses a deliberately restrictive protocol.

### Scope

l0g selected four operational procedures that use FranceConnect+ or France Identité and for which an official alternative is published: training purchases through the personal training account, the France Rénov’ account, INPI company filings and voting proxies.

### Sources

The factual claims rely on primary or institutional sources: the consolidated regulation on EUR-Lex, the CNIL, the Conseil d’État, FranceConnect, Mon Compte Formation, Anah, INPI, Service-Public, France Identité, INSEE, the Rights Defender and France Services. No commercial signature-provider tariff is turned into a purported market average.

### Observation date

Pages and conditions were reviewed on **28 August 2026**. Digital routes can change quickly. Every number is tied to a date or to the administration’s exact formulation.

### Nature of the measurements

The two-week and four-week figures are delays **published by the services**, not durations measured by l0g. The absence of public statistics is not treated as evidence of poor performance. It is identified as missing data.

### Limits

l0g did not buy a course, file a housing-grant application, close a company or establish a voting proxy for this article. No sample of users has yet been timed. Abandonment, failure and lost-right rates remain unknown until the administrations publish them or a field protocol measures them.

### Editorial rule

The existence of friction proves neither a hidden obligation nor a breach of law. Conversely, the existence of an “other method” link does not by itself prove an effective alternative. The article separates three levels:

```text
ESTABLISHED
The procedure and delay published by an official source.

UNKNOWN
The observed delay, failure rate, abandonment or effect on rights.

TO BE TESTED
Whether the alternative is practically compatible with the deadline and user profile.
```

## The conditions for an effective choice

The four cases do not show the disappearance of alternatives. They show that public bodies have built exits.

Mon Compte Formation provides manual review and a paper procedure. France Rénov’ checks identity by post. INPI accepts a signature based on a qualified certificate. The voting-proxy process preserves a physical identity check.

Those solutions do not share the same duration, difficulty, documented cost or level of assistance. Among the institutional pages reviewed, l0g found no cross-service register allowing their real performance to be compared.

France Identité may legitimately provide the fastest route. That is one of its purposes. Its success should not, however, be measured only by the number of users recruited or clicks removed. It should also be measured by the quality of the path left to people who do not want it, do not yet have it, lack the right equipment or cannot physically use it.

The European regulation chose a demanding formula: the wallet is voluntary and non-users must not be disadvantaged.

The word “voluntary” is therefore tested less on the install button than on the day a person declines to use it.

> **An alternative is real when it arrives in time.**

## Primary sources

- [Regulation (EU) 2024/1183 amending eIDAS](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1183)
- [CNIL decision 2021-151 on SGIN and France Identité](https://france-identite.gouv.fr/assets/files/CNIL-D%C3%A9lib%C3%A9ration-2021-151_SGIN-France-Identit%C3%A9-1.pdf)
- [FranceConnect: optional use and equivalent-security alternative](https://docs.partenaires.franceconnect.gouv.fr/fi/general/fi-general-presentation/)
- [Conseil d’État: framework for online administrative procedures](https://www.conseil-etat.fr/actualites/demarches-administratives-en-ligne-le-conseil-d-etat-fixe-un-cadre-general-et-se-prononce-sur-les-demandes-de-titre-de-sejour)
- [Mon Compte Formation: manual identity review](https://www.moncompteformation.gouv.fr/espace-public/je-ne-remplis-pas-les-conditions-pour-utiliser-franceconnect)
- [Anah: France Rénov’ personal account from 17 August 2026](https://www.anah.gouv.fr/presse/compter-du-17-aout-2026-france-renov-renforce-son-offre-de-services-avec-un-compte-personnel)
- [France Rénov’: FranceConnect+ or postal verification](https://authentification.france-renov.gouv.fr/)
- [INPI: signing business filings and the FranceConnect+ route](https://www.inpi.fr/faq/890)
- [Service-Public: fully online voting proxies](https://www.service-public.gouv.fr/particuliers/actualites/A18658?lang=en)
- [FranceConnect: available identity providers](https://docs.partenaires.franceconnect.gouv.fr/fs/fs-pilotage/fs-pilotage-fi/)
- [France Identité: technical requirements](https://france-identite.gouv.fr/)
- [La Poste Digital Identity: eligibility requirements](https://lidentitenumerique.laposte.fr/comment-lobtenir)
- [France Identité: accessibility statement and mobile audits](https://france-identite.gouv.fr/accessibilite/)
- [INSEE: digital skills in 2025](https://www.insee.fr/fr/statistiques/8739245)
- [French Rights Defender: survey on relations with public services](https://www.defenseurdesdroits.fr/enquete-sur-lacces-aux-droits-sur-les-relations-des-usagers-avec-les-services-publics-que-retenir)
- [France Services: mission, network and assistance](https://www.france-services.gouv.fr/)
