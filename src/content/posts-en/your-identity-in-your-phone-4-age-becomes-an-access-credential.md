---
title: "Your identity in your phone, 4/8: age becomes an access credential"
seoTitle: "France Identité age proof: privacy, errors and costs | l0g"
ogTitle: "Age becomes an access credential"
description: "France Identité can attest age 15 or over through ÉduConnect. Behind the yes/no are logs, errors, ZKPs and possible costs."
ogImage: "/illustrations/news/france-identite-age-proof-gate-v1.jpg"
pubDate: 2026-08-28T17:11:15+02:00
updatedDate: 2026-08-28T17:11:15+02:00
tags: ["France Identité", "ÉduConnect", "age assurance", "digital identity", "ZKP", "Arcom", "CNIL", "EUDI", "child protection", "financial risk", "investigation"]
draft: false
sourceArticle: "votre-identite-dans-un-telephone-4-votre-age-devient-une-autorisation"
sourceUpdatedDate: 2026-08-28T17:11:15+02:00
---

*On 5 June 2026, three words appeared in France Identité's release history: “age-proof presentation”. The terms published by the French state describe a function that is separate from the full digital identity reserved for adults. An eligible student in a public secondary school can now ask the app to attest that they are at least fifteen, using their ÉduConnect account.*

*The relying service should receive neither the student's name, full date of birth nor email address. This is a tangible improvement over copies of identity documents and biometric selfies. Yet age is also changing in nature. It is no longer only a fact recorded in a register. It becomes a software credential that opens or closes a gate.*

*Behind the “yes” or “no” are a data source, an issuer, an app, logs, a verifier, an automated decision and, sometimes, a charge per check. If an incorrect proof blocks a purchase, account, wager, contract or paid service, a privacy issue becomes a financial risk.*

*This is part four of the **Your identity in your phone** investigation. Part one followed [France Identité's data and traces](/en/analysis/your-identity-in-your-phone-1-when-an-id-card-becomes-a-service/). Part two measured [the practical cost of opting out](/en/analysis/your-identity-in-your-phone-2-optional-but-at-what-cost/). Part three examined [the contracting chain behind a sovereign identity](/en/analysis/your-identity-in-your-phone-3-sovereignty-under-contract/).*

*Version française : [Votre âge devient une autorisation](/posts/votre-identite-dans-un-telephone-4-votre-age-devient-une-autorisation/).*

## Key points

- France Identité version 1.3.4290, released on 5 June 2026, added “age-proof presentation”.
- The official terms describe a service for students at public secondary schools who hold a valid ÉduConnect account.
- The only threshold currently described is **15 or over**. The credential is not an identity card, an official identity document or parental consent.
- The relying service receives only the information required to establish the threshold. The privacy notice says it does not receive the student's surname, first name, full date of birth or email address.
- The credential is stored locally. Identity data used to issue it should not be retained by ANTS beyond the operation. Timestamped audit logs may, however, be kept for up to three years.
- Public documents do not map the fields in those logs, the services accepting the French proof, usage volumes, refusal rates or the protocol actually used.
- The European blueprint can also disclose a simple Boolean attribute such as `age_over_18: true`. Its feature-ready version has been available since April 2026 and France is one of seven pilot countries.
- The European design supports single-use attestations issued in batches and zero-knowledge presentations. The normative specification recommends ZKP support without requiring it from every verifier.
- The technical annex still describes the ZKP mechanism as experimental and says the chosen scheme had not been peer reviewed. This does not show a weakness, but it prevents treating maturity as settled.
- France's Constitutional Council did not ban age assurance. On 14 August 2026 it struck down a broad social-media ban that would have required everyone, including adults, to prove their age without sufficiently precise statutory safeguards.
- Arcom's framework already requires affected pornography services to check age at each visit, use an independent third party, offer a double-confidentiality solution, provide more than one method and arrange an appeal after error.
- Vendors publicly advertise prices ranging from a few cents to several tens of cents per check. These are not market averages, but they show how repeated yes/no decisions can become a substantial market.

## A feature first visible in the release notes

The app's [official App Store history](https://apps.apple.com/fr/app/france-identit%C3%A9/id1590142959) dates the addition of age-proof presentation to **5 June 2026**. The general description still presents the full state-backed digital identity as a service for people over eighteen who hold the newer electronic national identity card.

Those statements are not necessarily contradictory. They describe two separate gateways:

```text
Full state-backed digital identity
electronic ID card + adulthood
→ identity, authentication, digital credentials

ÉduConnect age proof
school account + eligibility + at least 15
→ an attestation limited to an age threshold
```

The [ÉduConnect terms](https://france-identite.gouv.fr/conditions-generales-utilisation/cgu-educonnect/) are explicit. The service is available to students at public secondary schools who hold a valid ÉduConnect account, under conditions set by the Ministry of Education. It currently proves only that a user is **fifteen or older**.

The attestation does not replace an identity card. It does not prove the holder's identity for general purposes, does not constitute parental authorisation and grants no automatic right of access. The verifier remains responsible for its own eligibility rules and may request additional checks.

France Identité is therefore not giving a teenager a full state-backed digital identity. It is giving them one targeted attribute.

Within the public corpus reviewed as of 28 August 2026, l0g found no dedicated launch announcement, registry of accepting services or usage statistics. This does not prove a secret launch or the absence of use. It means the function is visible in the app and its legal documents while its operational perimeter remains hard to measure.

The terms even display an internal editorial note beginning `[RB1]` after Article 9. That is not a security incident. It shows that a working note remained in the public version of terms aimed at minors.

## A date of birth becomes a decision

The documented French chain begins with ÉduConnect. The school identity service sends ANTS the data required to establish eligibility and issue the attestation. The [dedicated privacy notice](https://france-identite.gouv.fr/politique-de-confidentialite/confidentialite-educonnect/) lists surname, first name, date of birth and email address.

ANTS turns those data into a limited proof. The credential is stored on the phone. When it is presented, the third party should receive only the information needed to verify the relevant threshold.

<figure class="infographic" style="padding-bottom:1.5rem" tabindex="0" aria-label="A date of birth becomes a decision">
<svg viewBox="0 0 360 890" width="100%" role="img" aria-labelledby="flow-en-title flow-en-desc" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;height:auto;overflow:hidden;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;background:#0c0d10">
<title id="flow-en-title">A DATE OF BIRTH BECOMES A DECISION</title>
<desc id="flow-en-desc">Documented France Identité and ÉduConnect age-proof chain</desc>
<rect x="1" y="1" width="358" height="888" rx="16" fill="#0c0d10" stroke="#2b3038"/>
<text x="18" y="40" fill="#f5f6f8" font-size="13.5" font-weight="700">A DATE OF BIRTH BECOMES</text>
<text x="18" y="60" fill="#f5f6f8" font-size="13.5" font-weight="700">A DECISION</text>
<text x="18" y="82" fill="#8b909b" font-size="8.5">Documented France Identité + ÉduConnect path</text>
<rect x="22" y="108" width="316" height="116" rx="12" fill="#101319" stroke="#7aa2f7"/>
<text x="38" y="136" fill="#7aa2f7" font-size="10.5" font-weight="700">1. SOURCE</text>
<text x="38" y="162" fill="#f5f6f8" font-size="10">ÉduConnect</text>
<text x="38" y="184" fill="#aeb4bf" font-size="9">Name, birth date and email</text>
<text x="38" y="204" fill="#6f7580" font-size="8.5">Establishes school eligibility</text>
<path d="M180 224 V252" stroke="#7aa2f7" stroke-width="2"/>
<path d="M174 244 L180 254 L186 244" fill="#7aa2f7"/>
<rect x="22" y="258" width="316" height="116" rx="12" fill="#10211f" stroke="#5eead4"/>
<text x="38" y="286" fill="#5eead4" font-size="10.5" font-weight="700">2. ISSUER</text>
<text x="38" y="312" fill="#f5f6f8" font-size="10">ANTS / France Identité</text>
<text x="38" y="334" fill="#aeb4bf" font-size="9">Creates a 15+ threshold credential</text>
<text x="38" y="354" fill="#6f7580" font-size="8.5">Source identity data then deleted</text>
<path d="M180 374 V402" stroke="#5eead4" stroke-width="2"/>
<path d="M174 394 L180 404 L186 394" fill="#5eead4"/>
<rect x="22" y="408" width="316" height="116" rx="12" fill="#181527" stroke="#a78bfa"/>
<text x="38" y="436" fill="#c4b5fd" font-size="10.5" font-weight="700">3. LOCAL APP</text>
<text x="38" y="462" fill="#f5f6f8" font-size="10">Attestation stored on the device</text>
<text x="38" y="484" fill="#aeb4bf" font-size="9">Presented at the user's initiative</text>
<text x="38" y="504" fill="#6f7580" font-size="8.5">A single active device may be required</text>
<path d="M180 524 V552" stroke="#a78bfa" stroke-width="2"/>
<path d="M174 544 L180 554 L186 544" fill="#a78bfa"/>
<rect x="22" y="558" width="316" height="116" rx="12" fill="#101319" stroke="#f5b13d"/>
<text x="38" y="586" fill="#f5b13d" font-size="10.5" font-weight="700">4. VERIFIER</text>
<text x="38" y="612" fill="#f5f6f8" font-size="10">Gets the threshold, not full identity</text>
<text x="38" y="634" fill="#aeb4bf" font-size="9">May request an additional check</text>
<text x="38" y="654" fill="#6f7580" font-size="8.5">Makes the final access decision</text>
<path d="M180 674 V702" stroke="#f5b13d" stroke-width="2"/>
<path d="M174 694 L180 704 L186 694" fill="#f5b13d"/>
<rect x="22" y="708" width="316" height="104" rx="12" fill="#171217" stroke="#ff4d87"/>
<text x="38" y="736" fill="#ff85ad" font-size="10.5" font-weight="700">5. DECISION</text>
<text x="38" y="762" fill="#f5f6f8" font-size="10">Access granted or refused</text>
<text x="38" y="784" fill="#aeb4bf" font-size="9">A “yes” creates no automatic right</text>
<rect x="14" y="836" width="332" height="38" rx="8" fill="#15171b" stroke="#3a4049"/>
<text x="26" y="852" fill="#aeb4bf" font-size="7.8">Sources: ÉduConnect terms and privacy notice.</text>
<text x="26" y="866" fill="#6f7580" font-size="7.8">Protocol and accepting services remain to be established.</text>
</svg>
<figcaption>The proof reduces the data disclosed to the final service. It also adds several actors between the date of birth and the access decision.</figcaption>
</figure>

This architecture is more protective than a photocopy. It also makes access dependent on the quality of school data, continuing eligibility, the app, the credential's validity and the verifier's policy.

## A “yes” limited to the threshold

The stated data minimisation is substantial.

According to the privacy notice, the third party receives neither surname, first name, full date of birth nor email address. Identity data used to issue the proof are not retained by ANTS beyond the time required for the operation. The credential remains on the device until deletion, expiry or renewal.

This model prevents every platform from receiving another copy of a person's civil identity. It also limits the potential impact of a breach at the final service: a 15+ attribute is less exploitable than an identity card and a selfie.

The same notice nevertheless describes two additional categories:

- aggregated data about use of the service;
- timestamped audit logs collected and retained for up to **three years** for security, fraud prevention and investigations.

The document does not publish the log dictionary. It is therefore impossible to tell from the public text whether the records contain only a generic operation or also a device identifier, result, service category, domain, requester or session information.

Four properties must be separated:

```text
MINIMISATION
Does the verifier receive only the threshold?

ISSUER BLINDNESS
Do ANTS and ÉduConnect remain unaware of the service visited?

UNLINKABILITY
Can two presentations be recognised as coming from one user?

RESIDUAL TRACE
Which logs remain, with whom and for how long?
```

The French documents clearly support the first property. They do not yet establish the other three.

<figure class="infographic" style="padding-bottom:1.5rem" tabindex="0" aria-label="Anonymous to whom">
<svg viewBox="0 0 360 760" width="100%" role="img" aria-labelledby="privacy-en-title privacy-en-desc" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;height:auto;overflow:hidden;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;background:#0c0d10">
<title id="privacy-en-title">ANONYMOUS TO WHOM?</title>
<desc id="privacy-en-desc">Four distinct properties of the French age proof</desc>
<rect x="1" y="1" width="358" height="758" rx="16" fill="#0c0d10" stroke="#2b3038"/>
<text x="18" y="42" fill="#f5f6f8" font-size="15" font-weight="700">ANONYMOUS TO WHOM?</text>
<text x="18" y="64" fill="#8b909b" font-size="8.5">Minimised data are not automatically untraceable</text>
<rect x="16" y="92" width="328" height="126" rx="12" fill="#10211f" stroke="#5eead4"/>
<text x="32" y="120" fill="#5eead4" font-size="10.5" font-weight="700">VERIFIER</text>
<text x="32" y="146" fill="#f5f6f8" font-size="9.5">Receives only the required threshold</text>
<text x="32" y="168" fill="#aeb4bf" font-size="8.8">Name and full birth date withheld</text>
<rect x="32" y="184" width="104" height="20" rx="5" fill="#17322d"/>
<text x="84" y="198" text-anchor="middle" fill="#5eead4" font-size="8" font-weight="700">DOCUMENTED</text>
<rect x="16" y="234" width="328" height="126" rx="12" fill="#141a28" stroke="#7aa2f7"/>
<text x="32" y="262" fill="#7aa2f7" font-size="10.5" font-weight="700">ISSUER</text>
<text x="32" y="288" fill="#f5f6f8" font-size="9.5">Does it know which service uses the proof?</text>
<text x="32" y="310" fill="#aeb4bf" font-size="8.8">The public answer is not precise enough</text>
<rect x="32" y="326" width="104" height="20" rx="5" fill="#20263a"/>
<text x="84" y="340" text-anchor="middle" fill="#7aa2f7" font-size="8" font-weight="700">UNKNOWN</text>
<rect x="16" y="376" width="328" height="126" rx="12" fill="#1b1b14" stroke="#f5b13d"/>
<text x="32" y="404" fill="#f5b13d" font-size="10.5" font-weight="700">LINKABILITY</text>
<text x="32" y="430" fill="#f5f6f8" font-size="9.5">Can two proofs be tied to one user?</text>
<text x="32" y="452" fill="#aeb4bf" font-size="8.8">Format and identifiers not published here</text>
<rect x="32" y="468" width="104" height="20" rx="5" fill="#322a18"/>
<text x="84" y="482" text-anchor="middle" fill="#f5b13d" font-size="8" font-weight="700">TO TEST</text>
<rect x="16" y="518" width="328" height="142" rx="12" fill="#21151c" stroke="#ff85ad"/>
<text x="32" y="546" fill="#ff85ad" font-size="10.5" font-weight="700">LOGS</text>
<text x="32" y="572" fill="#f5f6f8" font-size="9.5">Timestamped audit traces, up to 3 years</text>
<text x="32" y="594" fill="#aeb4bf" font-size="8.8">Fields and recipients not detailed</text>
<rect x="32" y="616" width="150" height="20" rx="5" fill="#35202b"/>
<text x="107" y="630" text-anchor="middle" fill="#ff85ad" font-size="8" font-weight="700">DURATION KNOWN</text>
<rect x="14" y="690" width="332" height="52" rx="8" fill="#15171b" stroke="#3a4049"/>
<text x="26" y="711" fill="#aeb4bf" font-size="7.8">Minimisation protects the disclosed content.</text>
<text x="26" y="727" fill="#6f7580" font-size="7.8">Unlinkability requires additional safeguards.</text>
</svg>
<figcaption>“Anonymous” covers several separate properties. A proof can minimise data without being fully blind, unlinkable or free of residual traces.</figcaption>
</figure>

## Double anonymity sets a higher bar

Arcom's French framework uses the expression “double anonymity” while stating that it is not anonymity in the GDPR sense. The label describes an arrangement designed for strong confidentiality:

- the final service receives proof of adulthood without learning the user's identity;
- the issuer should not know which service is being visited;
- the service should not recognise repeated presentations by the same person through the verification mechanism;
- other intermediaries should not be able to join the transactions together.

The [CNIL summarises the principle](https://cnil.fr/fr/verification-de-lage-en-ligne-la-cnil-rend-son-avis-sur-le-referentiel-de-larcom) as separation between the site and the age-assurance provider. It also recommends that users be able to retain or generate proofs locally, avoiding a call to a third party at every access.

The French ÉduConnect model may satisfy some of these properties. The public documents reviewed do not yet establish all of them.

## Europe is building an age mini-wallet

The European Commission published its first blueprint on 14 July 2025. It says the solution became **feature ready** on 15 April 2026 and can now be adapted by member states and private operators. France is one of seven pilot countries, together with Cyprus, Denmark, Greece, Ireland, Italy and Spain. ([European Commission](https://digital-strategy.ec.europa.eu/en/faqs/eu-age-verification-solution))

The solution may operate as a standalone app or be integrated into the future EUDI wallet. It uses the same technical foundation and is designed to prove a threshold, initially age 18, without disclosing other attributes. The European format supports a Boolean such as:

```json
{
  "age_over_18": true
}
```

The [European age-verification profile](https://ageverification.dev/av-doc-technical-specification/docs/annexes/annex-A/annex-A-av-profile/) excludes other attributes from this attestation. The architecture can technically support further thresholds, but deploying them requires an appropriate enrolment method and legal basis.

The Commission is also preparing a trust regime. It plans to publish a list of authorised age-proof issuers and a list of recognised solutions. Verifiers will have to check that a credential came from a listed issuer. ([European Commission](https://digital-strategy.ec.europa.eu/en/policies/eu-age-verification))

The project is already a public procurement programme. The [European tender](https://digital-strategy.ec.europa.eu/fr/funding/call-tenders-development-consultancy-and-support-age-verification-solution) was launched in October 2024 with a **€4 million** budget. Development and support are being delivered by the T-Scy consortium, formed by Scytáles and T-Systems, under a two-year contract awarded in early 2025. ([European Commission](https://digital-strategy.ec.europa.eu/en/news/commission-makes-available-age-verification-blueprint))

## Thirty single-use proofs, then ZKP

The blueprint provides two main presentation methods.

### Conventional attestations

The [architecture specification](https://ageverification.dev/av-doc-technical-specification/docs/architecture-and-technical-specifications/) says conventional attestations are designed for a single use. Issuers should support batch issuance, with a recommendation of **thirty proofs per batch**.

This reduces repeated use of a stable identifier. It does not remove every clue. Timestamps can contribute to linkability, so the document asks implementers to lower their precision and recommends that the user be re-identified at least every three months.

### Zero-knowledge presentation

With a ZKP, the app does not present the underlying attestation. Instead, it cryptographically proves that it holds a valid credential containing the required attribute. The verifier receives the proof result without receiving the credential itself.

The [roadmap](https://ageverification.dev/Roadmap/) records an Android implementation in January 2026 and iOS integration in July. The method aims at unlinkability, so that multiple presentations should not be tied to the same user.

The obligation level matters. In the [normative specifications](https://ageverification.dev/av-doc-technical-specification/docs/architecture-and-technical-specifications/), a verifier **SHOULD** support the ZKP mechanism. The word is not **SHALL**. The framework can therefore operate without ZKP where an environment does not support it.

The [technical ZKP annex](https://docs.ageverification.dev/av-doc-technical-specification/docs/annexes/annex-B/annex-B-zkp/) still calls the feature experimental. It says the selected approach, using anonymous credentials derived from ECDSA, had a beta implementation, an individual Internet-Draft submitted to the IETF and had not yet undergone peer review.

That does not show weak cryptography. It shows that Europe prioritised rapid delivery and compatibility with existing credential formats even though its own selection criteria expressed a preference for a scheme reviewed by the scientific community.

## From reference code to production

The blueprint publishes specifications and code and allows the full journey to be tested. Its own documents nevertheless warn that the demonstration applications must not be deployed unchanged.

The [production-hardening guide](https://docs.ageverification.dev/av-app-android-wallet-ui/docs/production-hardening-guide-v3.8/) requires implementers to replace mock servers, test trust anchors, sample app identifiers and signing keys. They must also address device integrity, possible certificate pinning, telemetry, key rotation, forced-update policy and failure behaviour.

A statement that “the European solution is ready” therefore needs a precise meaning:

```text
Ready as a functional, adaptable blueprint
≠
Already deployed and audited as a French national service
```

No reviewed document establishes that the current ÉduConnect proof uses profile `eu.europa.ec.av.1`, batches of thirty attestations or the European ZKP mechanism.

## The Constitutional Council has drawn the boundary

France's law intended to exclude children under fifteen from social networks would have generalised a new form of age control. Its first article was declared unconstitutional on **14 August 2026**. The law promulgated on 24 August retains an empty Article 1 marked by the censorship. ([Legifrance](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054743001))

The Council did not ban age assurance.

It found that the broad prohibition disproportionately restricted freedom of expression and communication. It also identified a mechanical consequence: barring under-fifteens would require **every person, including adults**, to prove their age. Parliament had not defined the conditions and limits of that proof or provided sufficiently precise legal safeguards for privacy. ([Decision 2026-911 DC](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054743009))

The decision imposes a discipline that reaches beyond social media:

```text
Who must prove their age?
For which specific service?
By which method?
Which data and logs?
For how long?
Which alternative and which appeal?
```

A threshold is not enough. Legislation must frame the infrastructure that enforces it.

## Pornography is already the full-scale laboratory

Arcom's [technical framework](https://www.arcom.fr/sites/default/files/2024-10/Arcom-Referentiel-technique-sur-la-verification-de-age-pour-la-protection-des-mineurs-contre-la-pornographie-en-ligne.pdf) shows the consequences of age assurance that is already mandatory for affected services.

### Proof at every visit

Arcom expects a check at each new visit. A reusable proof is possible if it is bound to the device and protected by a second factor. Its validity must end with the session, when the browser closes, when the device sleeps or, at the latest, after one hour of inactivity.

This rule can create a large volume of decisions. The same adult may have to be checked several times in one day without opening an account.

### An independent provider

The website must not process the identity data used to generate the proof. The age-assurance provider must be legally and technically independent from the service. Arcom also makes clear that its framework does not certify a product list: each site selects its own solution and remains responsible for compliance.

### Two methods and minimum coverage

The most privacy-preserving mechanism must offer at least two ways of obtaining proof and be available to at least **80% of the adult population residing in France**. The aim is to prevent one technology, such as a selfie or electronic ID card, from excluding too much of the public.

### A refusal that can be challenged

The framework treats a refusal based on the proof, in this context, as an automated decision capable of producing significant effects. The provider must arrange an appeal after error and, where possible, allow the user to rely on another data source or issuer.

This logic becomes financial as soon as age controls a purchase, gambling service, subscription or already-paid account. An error is no longer merely an inaccessible page. It can become a frozen balance, a lost transaction or a support cost.

## Regulation is already changing the available supply

In June 2025, the Aylo group suspended access to its services in France, including for adults, rather than deploy the requested system. [Arcom acknowledged the decision](https://www.arcom.fr/presse/larcom-prend-acte-de-la-decision-du-groupe-aylo).

By 3 February 2026, the regulator said the **17 sites** named in the February 2025 order had either introduced an age-assurance solution or, in three cases, made their services inaccessible from France. Across services measured by Médiamétrie, 12 to 17-year-olds spent **35% less time** between November 2024 and November 2025. Arcom described that as an initial result requiring longer-term confirmation. ([Arcom](https://www.arcom.fr/en/press/fighting-exposure-persons-under-18-pornography-arcom-issues-formal-notice-two-new-porn-sites))

Arcom therefore reports a decline in use alongside implementation of the regime, without establishing causality in this release. Implementation entails or can entail:

- integration costs;
- per-check costs;
- abandoned journeys;
- support and appeals;
- withdrawal of services from the French market;
- potential concentration around suppliers able to satisfy the framework.

Measuring those costs does not deny the social cost of exposing children to pornography. It shows how a public obligation reshapes a market.

## The toll on a yes/no

Age assurance can be free to the end user while still being charged to the site, merchant or issuer.

Several vendors publish their own price lists:

- [AgeCheck API](https://www.agecheckapi.com/pricing) advertises an indicative €0.10 per check;
- [AgeEvidence](https://ageevidence.com/pricing) advertises €0.05 to €0.15 for age-only verification depending on plan and volume, with monthly minimums on some plans;
- [Didit](https://didit.me/fr/products/age-estimation/) advertises $0.10 for facial age estimation;
- [AgeWallet](https://agewallet.com/pricing/) advertises $0.30 for an initial verification and $0.008 for certain later authorisations.

These offers are not directly comparable. They do not use the same data, provide the same assurance or necessarily operate in France. Their public prices are neither a market average nor the future price of France Identité.

They do, however, support a scenario calculation.

<figure class="infographic" style="padding-bottom:1.5rem" tabindex="0" aria-label="The toll on a yes no">
<svg viewBox="0 0 360 750" width="100%" role="img" aria-labelledby="cost-en-title cost-en-desc" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;height:auto;overflow:hidden;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;background:#0c0d10">
<title id="cost-en-title">THE TOLL ON A YES/NO</title>
<desc id="cost-en-desc">Theoretical cost of verification volumes at three unit prices</desc>
<rect x="1" y="1" width="358" height="748" rx="16" fill="#0c0d10" stroke="#2b3038"/>
<text x="18" y="42" fill="#f5f6f8" font-size="15" font-weight="700">THE TOLL ON A “YES/NO”</text>
<text x="18" y="64" fill="#8b909b" font-size="8.5">Arithmetic scenarios, not a French market estimate</text>
<rect x="16" y="94" width="328" height="176" rx="12" fill="#10211f" stroke="#5eead4"/>
<text x="32" y="124" fill="#5eead4" font-size="12" font-weight="700">€0.05 PER CHECK</text>
<text x="32" y="158" fill="#f5f6f8" font-size="10">1 million</text>
<text x="328" y="158" text-anchor="end" fill="#f5f6f8" font-size="10" font-weight="700">€50,000</text>
<text x="32" y="190" fill="#f5f6f8" font-size="10">10 million</text>
<text x="328" y="190" text-anchor="end" fill="#f5f6f8" font-size="10" font-weight="700">€500,000</text>
<text x="32" y="222" fill="#f5f6f8" font-size="10">100 million</text>
<text x="328" y="222" text-anchor="end" fill="#f5f6f8" font-size="10" font-weight="700">€5m</text>
<rect x="16" y="286" width="328" height="176" rx="12" fill="#141a28" stroke="#7aa2f7"/>
<text x="32" y="316" fill="#7aa2f7" font-size="12" font-weight="700">€0.10 PER CHECK</text>
<text x="32" y="350" fill="#f5f6f8" font-size="10">1 million</text>
<text x="328" y="350" text-anchor="end" fill="#f5f6f8" font-size="10" font-weight="700">€100,000</text>
<text x="32" y="382" fill="#f5f6f8" font-size="10">10 million</text>
<text x="328" y="382" text-anchor="end" fill="#f5f6f8" font-size="10" font-weight="700">€1m</text>
<text x="32" y="414" fill="#f5f6f8" font-size="10">100 million</text>
<text x="328" y="414" text-anchor="end" fill="#f5f6f8" font-size="10" font-weight="700">€10m</text>
<rect x="16" y="478" width="328" height="176" rx="12" fill="#21151c" stroke="#ff85ad"/>
<text x="32" y="508" fill="#ff85ad" font-size="12" font-weight="700">€0.30 PER CHECK</text>
<text x="32" y="542" fill="#f5f6f8" font-size="10">1 million</text>
<text x="328" y="542" text-anchor="end" fill="#f5f6f8" font-size="10" font-weight="700">€300,000</text>
<text x="32" y="574" fill="#f5f6f8" font-size="10">10 million</text>
<text x="328" y="574" text-anchor="end" fill="#f5f6f8" font-size="10" font-weight="700">€3m</text>
<text x="32" y="606" fill="#f5f6f8" font-size="10">100 million</text>
<text x="328" y="606" text-anchor="end" fill="#f5f6f8" font-size="10" font-weight="700">€30m</text>
<rect x="14" y="680" width="332" height="52" rx="8" fill="#15171b" stroke="#3a4049"/>
<text x="26" y="701" fill="#aeb4bf" font-size="7.8">Calculation: volume × hypothetical unit price.</text>
<text x="26" y="717" fill="#6f7580" font-size="7.8">Excludes subscription, integration, failure, support and appeal.</text>
</svg>
<figcaption>At scale, a few cents per check are enough to create a multi-million-euro cost line. This is not a revenue forecast.</figcaption>
</figure>

The economic question extends beyond the API price. It also includes:

```text
Technical integration
Compliance audit
Evidence retention
Failures and retries
Human support
Manual appeal
Abandoned purchase
Provider outage
```

A locally reusable proof may reduce the number of chargeable checks. A rule requiring verification at every session may multiply them. Technical design therefore determines part of the market's economics.

## Banks may become age issuers

The European specifications do not reserve issuance to public authorities. They list banks, mobile operators and utility providers among possible trusted private sources. The [March 2026 roadmap](https://ageverification.dev/Roadmap/) explicitly mentions issuance from a third-party application, for example a banking app.

The logic is straightforward. A bank has already verified the customer's identity and date of birth under its KYC duties. It could issue a proof of adulthood without disclosing the banking file.

That possibility can reduce friction. It can also expand the economic role of banks:

```text
Bank customer due diligence
→ age attestation
→ access to a non-banking service
→ possible payment for issuance or verification
```

No reviewed document establishes that a French bank already issues a proof compatible with France Identité or the European blueprint. This is an architectural possibility, not an observed deployment.

The questions are nevertheless immediate:

- will the bank know where the proof is used?
- will the credential remain available after an account is closed?
- can a KYC error propagate across several sectors?
- will the feature be limited to selected products or plans?
- who will pay for issuance and appeals?
- can the bank suspend the attribute at the same time as the account?

After payments, bank identity could become a general access-control infrastructure.

## The wrong birthday

The most concrete risk is not necessarily a mass data leak. It is an incorrect source record or a false decision in a chain with divided responsibilities.

The ÉduConnect privacy notice says ANTS receives the date of birth from the school identity provider. It states that requests to correct source data must be directed to the Ministry of Education.

The terms add three provisions:

- ANTS is not responsible for the accuracy of information transmitted by ÉduConnect;
- the verifier alone is responsible for its access decision;
- ANTS is not responsible for the verifier's refusal or its consequences.

The chain can therefore look like this:

```text
Wrong date of birth in the source
→ proof unavailable or incorrect
→ access refused
→ ANTS redirects the user to ÉduConnect
→ the final service redirects the user to the proof provider
→ correction delay
```

On a social network, the loss may be an account. In an economic service, it can become:

- an abandoned purchase;
- a blocked gambling account or regulated product;
- an impossible subscription;
- a lost ticket;
- a paid service that has become inaccessible;
- support or alternative-verification costs.

The terms allocate roles. They do not publish a single appeal route, a correction deadline or an indemnification mechanism.

Minimisation protects against excessive disclosure. It does not solve fragmented liability.

## Who knows what?

<div class="instrument-plate" style="padding:1.1rem;--plate-accent:#5eead4">
<p class="mono-label" style="margin:0;color:#5eead4">L0G TOOL // WHO KNOWS WHAT?</p>
<p style="margin:.65rem 0 1rem;color:#d6d9df">Open a method. Each card separates the source data, what the final service sees, linkability risk, the economic model and the available level of evidence.</p>
<details style="border:1px solid #2b3038;border-radius:10px;background:#101319;margin:.75rem 0;padding:.85rem 1rem">
<summary style="cursor:pointer;color:#f5f6f8;font-weight:700">France Identité + ÉduConnect</summary>
<div style="margin-top:.85rem;color:#d6d9df">
<p style="margin:.55rem 0"><strong>Source:</strong> the ÉduConnect account of an eligible public-secondary-school student.</p>
<p style="margin:.55rem 0"><strong>Verifier receives:</strong> only the threshold information, without name or full birth date according to the published notice.</p>
<p style="margin:.55rem 0"><strong>Linkability:</strong> proof format, issuer visibility of the final service and log fields are not publicly detailed.</p>
<p style="margin:.55rem 0"><strong>Cost:</strong> no public price found for the user or verifier.</p>
<p style="margin:.55rem 0"><strong>Evidence level:</strong> minimisation established; unlinkability to test.</p>
</div></details>
<details style="border:1px solid #2b3038;border-radius:10px;background:#101319;margin:.75rem 0;padding:.85rem 1rem">
<summary style="cursor:pointer;color:#f5f6f8;font-weight:700">European blueprint, conventional attestation</summary>
<div style="margin-top:.85rem;color:#d6d9df">
<p style="margin:.55rem 0"><strong>Source:</strong> eID, document, public database or trusted private source.</p>
<p style="margin:.55rem 0"><strong>Verifier receives:</strong> a Boolean attribute compatible with the European profile.</p>
<p style="margin:.55rem 0"><strong>Linkability:</strong> single-use attestations issued in batches. The specification recognises that timestamps can offer clues.</p>
<p style="margin:.55rem 0"><strong>Cost:</strong> depends on the issuer, wallet and verification service.</p>
<p style="margin:.55rem 0"><strong>Evidence level:</strong> published normative architecture; national deployment still requires adaptation and hardening.</p>
</div></details>
<details style="border:1px solid #2b3038;border-radius:10px;background:#101319;margin:.75rem 0;padding:.85rem 1rem">
<summary style="cursor:pointer;color:#f5f6f8;font-weight:700">European blueprint with ZKP</summary>
<div style="margin-top:.85rem;color:#d6d9df">
<p style="margin:.55rem 0"><strong>Source:</strong> a valid credential held as a private witness inside the app.</p>
<p style="margin:.55rem 0"><strong>Verifier receives:</strong> cryptographic proof of the threshold, not the underlying attestation.</p>
<p style="margin:.55rem 0"><strong>Linkability:</strong> the method aims to prevent several presentations from being tied together.</p>
<p style="margin:.55rem 0"><strong>Cost:</strong> proof generation may happen locally, but integration, verification, operation and support still need funding.</p>
<p style="margin:.55rem 0"><strong>Evidence level:</strong> Android and iOS implementations published; feature still labelled experimental and the mechanism described as not peer reviewed in the annex.</p>
</div></details>
<details style="border:1px solid #2b3038;border-radius:10px;background:#101319;margin:.75rem 0;padding:.85rem 1rem">
<summary style="cursor:pointer;color:#f5f6f8;font-weight:700">Facial age estimation</summary>
<div style="margin-top:.85rem;color:#d6d9df">
<p style="margin:.55rem 0"><strong>Source:</strong> a selfie and estimation model, with liveness controls depending on the vendor.</p>
<p style="margin:.55rem 0"><strong>Verifier receives:</strong> a decision or estimate, depending on the product.</p>
<p style="margin:.55rem 0"><strong>Linkability:</strong> depends on local processing, image retention and session identifiers.</p>
<p style="margin:.55rem 0"><strong>Cost:</strong> some sellers advertise around $0.10 per analysis.</p>
<p style="margin:.55rem 0"><strong>Evidence level:</strong> commercial offers; performance, bias and compliance need real-world auditing.</p>
</div></details>
<details style="border:1px solid #2b3038;border-radius:10px;background:#101319;margin:.75rem 0;padding:.85rem 1rem">
<summary style="cursor:pointer;color:#f5f6f8;font-weight:700">Identity document + selfie</summary>
<div style="margin-top:.85rem;color:#d6d9df">
<p style="margin:.55rem 0"><strong>Source:</strong> official document, validity check, face and liveness detection.</p>
<p style="margin:.55rem 0"><strong>Verifier receives:</strong> depends on the arrangement. Exposure is greater where the service collects documents itself.</p>
<p style="margin:.55rem 0"><strong>Linkability:</strong> high where the provider retains a KYC file or stable identifier.</p>
<p style="margin:.55rem 0"><strong>Cost:</strong> generally higher than age-only proof according to vendors' public price lists.</p>
<p style="margin:.55rem 0"><strong>Evidence level:</strong> common method, but excessive where a threshold is all that is required.</p>
</div></details>
<details style="border:1px solid #2b3038;border-radius:10px;background:#101319;margin:.75rem 0;padding:.85rem 1rem">
<summary style="cursor:pointer;color:#f5f6f8;font-weight:700">Bank as an age source</summary>
<div style="margin-top:.85rem;color:#d6d9df">
<p style="margin:.55rem 0"><strong>Source:</strong> KYC data already held by the bank.</p>
<p style="margin:.55rem 0"><strong>Verifier receives:</strong> potentially only a threshold, if the arrangement follows the profile and double-confidentiality principles.</p>
<p style="margin:.55rem 0"><strong>Linkability:</strong> depends on architecture. The blueprint aims to prevent the issuer from learning the final service.</p>
<p style="margin:.55rem 0"><strong>Cost:</strong> model unknown: free customer feature, paid plan benefit, fee per proof or B2B contract.</p>
<p style="margin:.55rem 0"><strong>Evidence level:</strong> possibility foreseen by the specifications; no French bank deployment established here.</p>
</div></details>
<p style="margin:1rem 0 0;color:#8b909b;font-size:.85rem">The tool compares architectures. It does not certify any product or rank legal compliance.</p>
</div>

## People missing from the documented route

The French terms cover students at public secondary schools. They do not describe the route for:

- students in private schools;
- apprentices;
- young people outside education;
- recent arrivals in France;
- people without a valid ÉduConnect account;
- people without a compatible phone;
- users whose school records are wrong.

That does not mean no alternative will exist. It means a proof intended to protect minors does not yet cover, in its public documentation, every minor concerned.

A fragmentation risk follows: people best integrated into the administrative system obtain a fast, minimised proof, while others are redirected to a document, selfie, bank card or more intrusive manual check.

## The answers still required

The article establishes that the feature exists and records its stated safeguards. It cannot yet answer several elementary questions.

### For France Titres and ANTS

- When did the service actually open?
- How many users have activated it?
- How many credentials have been issued and presented?
- Which services accept them today?
- What exact format is used?
- Does the French proof follow profile `eu.europa.ec.av.1`?
- Does it use the European ZKP, a conventional mdoc attestation or a French-specific protocol?
- Which fields are present in logs kept for three years?
- Does ANTS know the service to which a proof is presented?
- What are the failure, suspension and refusal rates?
- Which appeal route and correction time are offered?
- Which liability rule applies after financial loss?

### For the Ministry of Education

- Which database is authoritative for the date of birth?
- What is the real correction time?
- Why was the public-secondary-school perimeter selected?
- What route is planned for private schools, apprentices and young people outside education?
- Can the school know that a proof was activated or used?
- What happens to the credential when the student loses ÉduConnect eligibility?

### For the European Commission

- Which independent audit has been performed on the ZKP mechanism?
- What is the timetable for scientific review and standardisation?
- Why is verifier support still a recommendation rather than a requirement?
- When will the trust lists be published?
- Which liability caps will apply to issuers and verifiers?
- How will economic concentration among a few providers be prevented?

### For Arcom and the CNIL

- Which methods are actually deployed in France?
- Which false-refusal and false-acceptance rates have been measured?
- How many appeals have been filed?
- Which resolution times are observed?
- Will audits be published in aggregate form?
- Is France Identité already accepted by a service subject to the framework?

## Primary sources

- France Identité: [ÉduConnect terms](https://france-identite.gouv.fr/conditions-generales-utilisation/cgu-educonnect/), [privacy notice](https://france-identite.gouv.fr/politique-de-confidentialite/confidentialite-educonnect/) and [App Store history](https://apps.apple.com/fr/app/france-identit%C3%A9/id1590142959).
- European Commission: [policy overview](https://digital-strategy.ec.europa.eu/en/policies/eu-age-verification), [pilot-country FAQ](https://digital-strategy.ec.europa.eu/en/faqs/eu-age-verification-solution), [normative profile](https://ageverification.dev/av-doc-technical-specification/docs/annexes/annex-A/annex-A-av-profile/), [architecture](https://ageverification.dev/av-doc-technical-specification/docs/architecture-and-technical-specifications/), [ZKP annex](https://docs.ageverification.dev/av-doc-technical-specification/docs/annexes/annex-B/annex-B-zkp/) and [production-hardening guide](https://docs.ageverification.dev/av-app-android-wallet-ui/docs/production-hardening-guide-v3.8/).
- French law: [Decision 2026-911 DC](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054743009) and the [law promulgated on 24 August 2026](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054743001).
- Regulation: [Arcom's technical framework](https://www.arcom.fr/sites/default/files/2024-10/Arcom-Referentiel-technique-sur-la-verification-de-age-pour-la-protection-des-mineurs-contre-la-pornographie-en-ligne.pdf), [Arcom's initial outcome report](https://www.arcom.fr/en/press/fighting-exposure-persons-under-18-pornography-arcom-issues-formal-notice-two-new-porn-sites) and the [CNIL opinion](https://cnil.fr/fr/verification-de-lage-en-ligne-la-cnil-rend-son-avis-sur-le-referentiel-de-larcom).
- The quoted prices are public declarations by the four vendors linked in the economic section, not a market measurement or a France Identité price.

## l0g methodology

This investigation relies on public documents available as of **28 August 2026**: France Identité's ÉduConnect terms and privacy notice, the app's official release history, European Commission pages and specifications, blueprint code and documentation, the Constitutional Council's decision, Arcom's framework, the CNIL's opinion and vendors' public price lists.

Claims are classified into five levels:

```text
ESTABLISHED
Official text, specification or direct public document

DECLARED
An actor's statement about its own service

INFERRED
A consequence explicitly presented as l0g analysis

UNKNOWN
Information not published or not found

TO TEST
A property requiring audit, capture or real-world testing
```

At this stage, l0g has not:

- activated the proof using an eligible student's account;
- captured network traffic generated by this function;
- obtained the log dictionary;
- received usage or error statistics;
- verified the code of the French implementation;
- established that it uses the European ZKP;
- audited a private vendor;
- conducted a right-of-reply phase with the institutions named in the article.

Commercial prices are quoted as examples declared by the sellers. They are not used to estimate market size. The cost graphic is a simple multiplication of hypothetical scenarios.

Established facts, limits and scenarios are distinguished in the text and charts.

## When age becomes an access key

A minimal age proof is a genuine improvement.

It can replace a full document with one limited attribute. It can reduce copies of identity papers, avoid disclosure of a face and prevent the final site from building an identity database. Europe's ZKP can go further by making presentations unlinkable.

But minimised data do not mean the absence of infrastructure.

There must still be a source that knows the date of birth, an authorised issuer, an app, a trust list, a protocol, a verifier and an appeal process. The chain can suffer an outage, an error, a cost, a persistent trace or a refusal.

The shift is economic as well as technical:

```text
Yesterday
The merchant asked for a document

Tomorrow
The service asks for a Boolean

But the Boolean becomes
an access credential
a chargeable event
an automated decision
an appeal point
```

France Identité does not hold the user's money. It also does not possess a general power to forbid a transaction.

It can, however, become one of the keys used by platforms, merchants and regulated services to decide whether an operation is accessible. When that key incorrectly returns “no”, the most important question is no longer only: **which data were disclosed?**

It becomes:

> **Who corrects the proof, who reopens the gate, and who pays for the loss produced while it remained closed?**
