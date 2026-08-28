---
title: "Your identity in your phone, 5/8: when your identity stops responding"
seoTitle: "France Identité recovery: lockout and financial risk | l0g"
ogTitle: "When your identity stops responding"
description: "Lost phone, blocked PIN, stolen ID card: delays, fallbacks and liability when France Identité becomes inaccessible."
ogImage: "/illustrations/news/france-identite-recovery-clocks-v1.jpg"
pubDate: 2026-08-28T19:00:58+02:00
updatedDate: 2026-08-28T19:00:58+02:00
tags: ["France Identité", "FranceConnect+", "digital identity", "recovery", "revocation", "continuity", "EUDI Wallet", "CPF", "INPI", "MaPrimeRénov", "financial risk", "investigation"]
draft: false
sourceArticle: "votre-identite-dans-un-telephone-5-le-jour-ou-votre-identite-ne-repond-plus"
sourceUpdatedDate: 2026-08-28T19:00:58+02:00
---

*Consider a fictional case designed to test service continuity. It is 11:40 p.m., and the stated deadline for a company-closure filing is midnight. The phone was lost on a train. The digital identity is certified, but it is no longer accessible. The money has not vanished. Neither has the company. Yet the software key that simplified the signature is no longer in its owner’s hand.*

*This scenario does not prove that a France Identité outage automatically creates a financial loss. INPI retains another route based on an advanced electronic signature supported by a qualified certificate. Mon Compte Formation and France Rénov’ also provide alternative paths. But those paths have their own delays, tools and costs.*

*The risk lies in the gap between two clocks: the time needed to revoke and reconstruct the identity, and the time left before the economic operation is lost.*

*This is part five of the **Your identity in your phone** investigation. Part one followed [France Identité’s data and traces](/en/analysis/your-identity-in-your-phone-1-when-an-id-card-becomes-a-service/). Part two measured [the practical price of alternatives](/en/analysis/your-identity-in-your-phone-2-optional-but-at-what-cost/). Part three examined [sovereignty under contract](/en/analysis/your-identity-in-your-phone-3-sovereignty-under-contract/). Part four followed [the transformation of age into an access credential](/en/analysis/your-identity-in-your-phone-4-age-becomes-an-access-credential/).*

*French version: [Le jour où votre identité ne répond plus](/posts/votre-identite-dans-un-telephone-5-le-jour-ou-votre-identite-ne-repond-plus/).*

## Key points

- A stolen phone does not, by itself, provide automatic access to financial procedures. As of 28 August 2026, France Identité’s official page states that the physical French ID card is still required to use FranceConnect+ through France Identité.
- The terms require a six-digit personal code and block it after three incorrect entries. France Diplomatie’s official FAQ states that the certification is then automatically revoked and must be completed again.
- If identity theft is suspected, the user must revoke the electronic identification means and inform support. If the physical ID card is lost or stolen, the user must also delete the digital identity and report the incident to the authorities.
- France Identité supports deletion from the application or user portal. Public documents do not publish a quantified commitment for the exact invalidation time of the old device.
- Revoking, deleting retained data, recreating the basic identity and regaining the certified level are four different operations. Their interaction is not explained in a single public table.
- The privacy policy mentions up to two months for certain deletions when an activation code was requested, and three years for traces. This does not establish that an emergency revocation takes two months.
- After three incorrect PIN entries, recertification is explicitly required. For other incidents, such as a planned phone change, the effect on certification is not described in one consolidated public procedure. Certification results are announced within forty-eight hours after the in-person check.
- A lost or stolen French ID card must be renewed. A 25-euro tax stamp is required, and a card declared lost or stolen becomes permanently invalid.
- Mon Compte Formation publishes an alternative verification time of between 48 hours and four weeks. France Rénov’ states that postal verification can take two weeks. INPI retains the advanced electronic signature route with a qualified certificate.
- France Identité’s public contact page lists email addresses, but no user emergency phone number. The 60-day deadlines in the terms concern information requests and complaints, not a published commitment for technical recovery time.
- The terms exclude certain financial losses described as indirect damages and consequences of some interruptions. Their legal effect cannot be inferred from the contractual text alone.
- The future EUDI Wallet is not restored like a simple phone backup. The European specification describes an encrypted migration object, re-issuance of identifiers and device-bound attestations, copying of non-device-bound attestations and restoration of the transaction log.

## What the physical ID card protects after a phone theft

The first duty of this investigation is to discard the most dramatic scenario when the evidence does not support it.

France Identité contains no bank account, balance or payment instrument. To use the application, the user needs the phone, the personal code and, depending on the journey, the physical ID card. The [France Identité terms of use](https://france-identite.gouv.fr/conditions-generales-utilisation/cgu-sgin/) state that the code is strictly personal and should only be entered inside the application.

More importantly, the [official online authentication page](https://france-identite.gouv.fr/usages/s-authentifier-en-ligne/) states that FranceConnect+ authentication with France Identité still requires the physical ID card. A stolen phone alone therefore does not provide the factors announced for the most sensitive procedures.

That protection does not remove risk. It shifts it.

The legitimate owner must prevent the old device from being used, establish an identity on a new phone, possibly recover the certified level and regain access to the final service. Each step may run on a different clock.

FranceConnect+ is used for procedures involving personal or financial data. Its [official landing page](https://www.franceconnect.gouv.fr/franceconnect-plus/) names Mon Compte Formation, company amendments or closures and MaPrimeRénov’. It also cites examples such as changing bank details, submitting identity documents for compensation or opening a bank account. Those examples do not mean France Identité is already the only path for each service. They show where recovery time can become economically material.

## Six incidents, six exit paths

The phrase “I lost France Identité” covers several events.

| Incident | Documented official action | Possible consequence | Complete public timing |
|---|---|---|---|
| Phone lost, ID card retained | Deletion available through the web portal | Old device to invalidate, new instance to create | Not published end to end |
| ID card lost, phone retained | Delete the identification means and report to authorities | Card invalidated, renewal and new association | Depends on card renewal |
| Phone and ID card lost | Digital revocation and administrative process | Both material factors lost | Not consolidated |
| Code blocked after three errors | New PIN followed by a new certification | FranceConnect+ unavailable until high assurance returns | Appointment excluded; result announced within 48 h after the visit |
| Planned phone change | Reinstallation and reassociation | Some credentials may need importing or re-issuance | Partial documentation |
| National security incident | Service may be suspended | Correlated refusals across services | Degraded mode not published here |

France Identité’s [security page](https://france-identite.gouv.fr/securite-application/) says that if the phone or ID card is lost or stolen, the digital identity can be deleted through the internet portal. The [terms](https://france-identite.gouv.fr/conditions-generales-utilisation/cgu-sgin/) add that suspected identity theft requires revocation and notification to support.

Those measures protect the identity. They do not yet explain how its owner returns to the previous state.

## Three mistakes and the key locks

The France Identité personal code has six digits. The terms state that it is blocked after **three incorrect attempts** and that unblocking follows a process analogous to the initial code selection. ([France Identité terms](https://france-identite.gouv.fr/conditions-generales-utilisation/cgu-sgin/))

The consequence for high assurance is documented by another official source. The [France Diplomatie FAQ on certified digital identity](https://www.diplomatie.gouv.fr/fr/services/faq/vote-par-internet/17-comment-faire-certifier-mon-identite-numerique) states that after three incorrect PIN entries, **certification is automatically revoked**. The user may create a new PIN and must then repeat the certification process.

The [official code-change guide](https://aide.france-identite.gouv.fr/kb/guide/fr/modifier-mon-code-personnel-oHXXUU25zX/Steps/1887276) describes the normal route while the current code is still known: scan or manual entry of the ID card CAN, old code, new code and NFC reading of the card. The new code takes effect immediately. A forgotten or blocked code requires the reset route.

The official application history notes that PIN reset at embassies and consulates was added in June 2026. Certification then requires an in-person check, with a result announced within forty-eight hours after the visit. That period excludes the time needed to obtain an appointment and the time required for the restored status to reach the final service. ([France Identité on the App Store](https://apps.apple.com/fr/app/france-identit%C3%A9/id1590142959))

The missing point is therefore no longer whether three errors affect certification. They revoke it. The unknown is the **total recovery time**: how long to obtain a new PIN, secure an appointment, recertify the identity and become recognised by FranceConnect+ again?

Three mistakes can happen minutes before a deadline. Security justifies both the lock and the loss of high assurance. Financial risk depends on the quality and speed of the recovery path.

## Revoke, erase, recover, recertify

Four words are often used as though they described one operation.

<figure class="infographic" style="padding-bottom:1.5rem" tabindex="0" aria-label="One incident starts four different clocks">
<svg viewBox="0 0 360 880" width="100%" role="img" aria-labelledby="clocks-en-title clocks-en-desc" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;height:auto;overflow:hidden;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;background:#0c0d10">
<title id="clocks-en-title">ONE INCIDENT, FOUR CLOCKS</title>
<desc id="clocks-en-desc">Revocation, erasure, identity recovery and return of certification follow different timelines</desc>
<rect x="1" y="1" width="358" height="878" rx="16" fill="#0c0d10" stroke="#2b3038"/>
<text x="18" y="42" fill="#f5f6f8" font-size="15" font-weight="700">ONE INCIDENT, FOUR CLOCKS</text>
<text x="18" y="65" fill="#8b909b" font-size="8.5">One click does not answer all four questions</text>
<line x1="44" y1="112" x2="44" y2="754" stroke="#39414d" stroke-width="3"/>
<circle cx="44" cy="130" r="9" fill="#ff85ad"/>
<rect x="72" y="96" width="268" height="128" rx="12" fill="#21151c" stroke="#ff85ad"/>
<text x="88" y="124" fill="#ff85ad" font-size="10.5" font-weight="700">1. REVOKE</text>
<text x="88" y="150" fill="#f5f6f8" font-size="9.2">Make the old means unusable</text>
<text x="88" y="172" fill="#aeb4bf" font-size="8.4">Portal and app are documented</text>
<text x="88" y="193" fill="#f5b13d" font-size="8.4">Invalidation deadline unpublished</text>
<circle cx="44" cy="294" r="9" fill="#7aa2f7"/>
<rect x="72" y="252" width="268" height="142" rx="12" fill="#141a28" stroke="#7aa2f7"/>
<text x="88" y="280" fill="#7aa2f7" font-size="10.5" font-weight="700">2. ERASE</text>
<text x="88" y="306" fill="#f5f6f8" font-size="9.2">Delete data still being retained</text>
<text x="88" y="328" fill="#aeb4bf" font-size="8.4">Up to 2 months in one published case</text>
<text x="88" y="349" fill="#aeb4bf" font-size="8.4">Operation traces: 3 years</text>
<text x="88" y="370" fill="#6f7580" font-size="8.2">This is not the revocation deadline</text>
<circle cx="44" cy="470" r="9" fill="#5eead4"/>
<rect x="72" y="424" width="268" height="142" rx="12" fill="#10211f" stroke="#5eead4"/>
<text x="88" y="452" fill="#5eead4" font-size="10.5" font-weight="700">3. RECOVER</text>
<text x="88" y="478" fill="#f5f6f8" font-size="9.2">Create a usable identity again</text>
<text x="88" y="500" fill="#aeb4bf" font-size="8.4">Card, device and code depend on scenario</text>
<text x="88" y="521" fill="#f5b13d" font-size="8.4">No public end-to-end recovery time</text>
<text x="88" y="542" fill="#6f7580" font-size="8.2">Derived credentials may need to return</text>
<circle cx="44" cy="648" r="9" fill="#f5b13d"/>
<rect x="72" y="596" width="268" height="158" rx="12" fill="#1b1b14" stroke="#f5b13d"/>
<text x="88" y="624" fill="#f5b13d" font-size="10.5" font-weight="700">4. RECERTIFY</text>
<text x="88" y="650" fill="#f5f6f8" font-size="9.2">Regain the FranceConnect+ level</text>
<text x="88" y="672" fill="#aeb4bf" font-size="8.4">Initial result within 48 h after visit</text>
<text x="88" y="693" fill="#f5b13d" font-size="8.4">After 3 errors: recertification required</text>
<text x="88" y="714" fill="#6f7580" font-size="8.2">Final-service recovery is a fifth step</text>
<rect x="14" y="800" width="332" height="60" rx="8" fill="#15171b" stroke="#3a4049"/>
<text x="26" y="821" fill="#aeb4bf" font-size="7.8">Sources: France Identité terms, privacy</text>
<text x="26" y="837" fill="#aeb4bf" font-size="7.8">policy and certification page.</text>
<text x="26" y="851" fill="#6f7580" font-size="7.6">Unknown deadlines are marked as unknown.</text>
</svg>
<figcaption>A data-erasure deadline does not reveal the revocation time. Recovery of the basic identity also does not prove immediate return to FranceConnect+.</figcaption>
</figure>

### Revocation

Revocation answers the urgent question: can the old phone or compromised means still be accepted? The security page announces remote deletion through the portal. The reviewed documents do not publish a maximum invalidation time or a timestamped proof comparable to a bank-card opposition reference. ([France Identité security](https://france-identite.gouv.fr/securite-application/))

### Erasure

The [privacy policy](https://france-identite.gouv.fr/politique-de-confidentialite/confidentialite-fi/) publishes several periods. It says some server data are deleted after transmission or the code-related operation. It also states that when deletion is requested after an activation code was sought, the period can reach two months. Traces of creation, consultation, use, revocation and deletion are kept for three years.

The same document contains a drafting tension. One passage says uninstalling the app or deleting from the app removes only smartphone data while some server traces remain. Another says uninstalling automatically deletes data stored on the server and phone, except material retained for disputes. This documentary contradiction does not establish the system’s actual technical behaviour.

### Recovery

Recovery means creating a functioning new instance. The public FAQ has sections on device changes and deletion, but the archivable pages reviewed do not expose every detailed answer. ([France Identité device FAQ](https://aide.france-identite.gouv.fr/kb/guide/fr/gerer-mes-appareils-RV8hjTsWCF/Steps/1887517))

### Recertification

The [certified digital identity](https://france-identite.gouv.fr/identite-numerique-certifiee/) requires an in-person check at a town hall or consulate. France Titres says the result is delivered within forty-eight hours. After three incorrect PIN entries, France Diplomatie explicitly requires a new certification. For a planned phone change and other recovery scenarios, the effects remain less clearly documented.

## Losing the ID card adds an irreversible administrative process

When the physical card disappears, the incident changes nature.

The terms require deletion of the electronic identification means and reporting the lost or stolen card to the authorities. France’s official Service-Public portal says that a theft complaint must be filed before renewal, while a loss can be declared when the renewal application is submitted. Once a card is declared lost or stolen, its digital invalidation is irreversible. ([Renewal after theft](https://www.service-public.gouv.fr/particuliers/vosdroits/F1759), [renewal after loss](https://www.service-public.gouv.fr/particuliers/vosdroits/F1344), [a recovered card](https://www.service-public.gouv.fr/particuliers/vosdroits/F18704))

Renewal after loss or theft requires a [25-euro tax stamp](https://france-identite.gouv.fr/articles/nouveau-motif-renouvellement-cni.html). The amount is small compared with a major economic loss, but it shows that recovery can already carry a direct cost before travel, waiting time or an alternative procedure.

Public documents do not publish one national renewal duration. It depends on appointment availability, processing and card production. This article therefore does not invent a number of days.

## Risk is created by two clocks

Identity recovery and the final service do not run on the same clock.

<figure class="infographic" style="padding-bottom:1.5rem" tabindex="0" aria-label="Financial risk depends on two clocks">
<svg viewBox="0 0 360 810" width="100%" role="img" aria-labelledby="double-en-title double-en-desc" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;height:auto;overflow:hidden;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;background:#0c0d10">
<title id="double-en-title">TWO CLOCKS, ONE RISK</title>
<desc id="double-en-desc">Technical recovery time must be compared with the time left before the economic deadline</desc>
<rect x="1" y="1" width="358" height="808" rx="16" fill="#0c0d10" stroke="#2b3038"/>
<text x="18" y="42" fill="#f5f6f8" font-size="15" font-weight="700">TWO CLOCKS, ONE RISK</text>
<text x="18" y="65" fill="#8b909b" font-size="8.5">Loss appears when the second clock expires first</text>
<rect x="16" y="96" width="328" height="222" rx="14" fill="#10211f" stroke="#5eead4"/>
<text x="32" y="126" fill="#5eead4" font-size="11" font-weight="700">TECHNICAL CLOCK</text>
<text x="32" y="154" fill="#f5f6f8" font-size="9.3">Old means invalidated</text>
<text x="32" y="177" fill="#f5f6f8" font-size="9.3">Basic identity reconstructed</text>
<text x="32" y="200" fill="#f5f6f8" font-size="9.3">Certification possibly restored</text>
<text x="32" y="223" fill="#f5f6f8" font-size="9.3">Final service accessible again</text>
<rect x="32" y="248" width="196" height="28" rx="6" fill="#17322d"/>
<text x="130" y="267" text-anchor="middle" fill="#5eead4" font-size="8.2" font-weight="700">FULL DELAY UNPUBLISHED</text>
<text x="32" y="298" fill="#6f7580" font-size="7.8">48 h concerns a certification result</text>
<path d="M180 330 V364" stroke="#f5b13d" stroke-width="2.5"/>
<path d="M174 356 L180 366 L186 356" fill="#f5b13d"/>
<rect x="16" y="374" width="328" height="300" rx="14" fill="#21151c" stroke="#ff85ad"/>
<text x="32" y="404" fill="#ff85ad" font-size="11" font-weight="700">ECONOMIC CLOCK</text>
<text x="32" y="434" fill="#f5f6f8" font-size="9.2">CPF alternative path</text>
<text x="32" y="454" fill="#aeb4bf" font-size="8.4">48 h to 4 weeks, depending on method</text>
<line x1="32" y1="474" x2="328" y2="474" stroke="#3a2931"/>
<text x="32" y="500" fill="#f5f6f8" font-size="9.2">France Rénov’ email account</text>
<text x="32" y="520" fill="#aeb4bf" font-size="8.4">Postal verification: up to 2 weeks</text>
<line x1="32" y1="540" x2="328" y2="540" stroke="#3a2931"/>
<text x="32" y="566" fill="#f5f6f8" font-size="9.2">INPI amendment or closure</text>
<text x="32" y="586" fill="#aeb4bf" font-size="8.4">Alternative: qualified certificate</text>
<text x="32" y="607" fill="#aeb4bf" font-size="8.4">and advanced electronic signature</text>
<rect x="32" y="628" width="266" height="28" rx="6" fill="#35202b"/>
<text x="165" y="647" text-anchor="middle" fill="#ff85ad" font-size="8.2" font-weight="700">DEADLINE IS SPECIFIC TO EACH FILE</text>
<rect x="14" y="712" width="332" height="76" rx="8" fill="#15171b" stroke="#3a4049"/>
<text x="26" y="733" fill="#aeb4bf" font-size="7.8">Published periods describe alternative paths,</text>
<text x="26" y="749" fill="#aeb4bf" font-size="7.8">not current France Identité recovery time.</text>
<text x="26" y="769" fill="#6f7580" font-size="7.6">Loss depends on the file’s real deadline.</text>
</svg>
<figcaption>An alternative route’s delay is not automatically a loss. It becomes critical when it exceeds the training, grant or company-filing deadline.</figcaption>
</figure>

## Mon Compte Formation: from under twenty-four hours to four weeks

The [Caisse des Dépôts](https://of.moncompteformation.gouv.fr/espace-public/pourquoi-privilegier-la-verification-didentite-numerique-sur-mon-compte-formation) says digital verification can take under twenty-four hours, while an alternative check can take between 48 hours and four weeks depending on the selected method. The paper route is described as taking at least four weeks.

The [FranceConnect guidance](https://aide.franceconnect.gouv.fr/faq/services-accessibles/mon-compte-formation/que-faire-si-je-ne-peux-pas-utiliser-franceconnect-pour-acceder-a-mon-compte-formation/) requires a form, identity document, copy of the health insurance card or certificate and a registered letter. After verification, an email should be sent within no more than ten days to continue the purchase.

Those periods do not prove that a training place is lost. They raise a simple question: does the request date protect the place and funding when identity recovery fails just before the course begins?

## France Rénov’: two weeks by post

The [France Rénov’ authentication portal](https://authentification.france-renov.gouv.fr/) recommends FranceConnect+. An email-based account remains possible, but identity is then verified by post and the step can take two weeks.

The alternative therefore exists. The risk depends on what the service does with the original filing date when a budget, campaign or application reaches its deadline during the wait.

## INPI: the qualified-certificate route

INPI recommends FranceConnect+ for company amendments and closures because it replaces the need for an advanced electronic signature supported by a qualified certificate. Its [company-amendment page](https://www.inpi.fr/realiser-demarches/formalites-dentreprises/modifier-son-entreprise-individuelle) and [signature FAQ](https://www.inpi.fr/faq/890) retain the other route: connect through INPI Connect, download the summary, sign it externally with the required certificate and upload it again.

That alternative prevents any claim that France Identité is mandatory. It is not identical. It requires an external tool, additional skill and, depending on the provider, may create a cost.

## The public support page leaves the urgent timeline unspecified

France Identité’s [contact page](https://france-identite.gouv.fr/contact/) lists four email addresses for general matters, application support, security and press. It displays no emergency number for a user who has lost a phone or blocked the personal code.

The terms publish two periods: up to sixty working days to answer an information request, and up to sixty days to take a complaint into account and decide on its legal consequences. They also require the user to notify the service within thirty days of an event that may engage its liability. ([France Identité terms, sections 20 and 21](https://france-identite.gouv.fr/conditions-generales-utilisation/cgu-sgin/))

It would be wrong to turn those periods into technical-incident resolution times. A team may respond much faster. The documentary gap is the lack of a distinct public commitment for:

```text
Emergency revocation
Code reset
Return of certification
Incident near a financial deadline
Human escalation
Timestamped acknowledgement
```

A bank card provides a useful benchmark, without legal equivalence. France’s [interbank card-opposition server](https://www.service-public.fr/particuliers/vosdroits/F35460/0_1) is available around the clock, blocks the card immediately and provides a registration number as dated evidence. France Identité is not a bank card. Its expanding role in financial procedures makes that level of clarity relevant.

## Who bears the loss?

The terms impose a demanding allocation of risk on the user.

They state, among other things, that:

- irregular use is presumed attributable to the account holder unless evidence shows otherwise;
- the service is provided under a best-efforts obligation;
- interventions following outages or security alerts can occur at any time;
- suspension creates no right to compensation under the contractual wording;
- financial, commercial, profit or customer losses are characterised as excluded indirect damages;
- France Identité excludes liability for fraudulent use of the smartphone and personal code by a third party. ([France Identité terms](https://france-identite.gouv.fr/conditions-generales-utilisation/cgu-sgin/))

This does not establish that compensation is legally impossible. The terms alone do not settle public law, the GDPR, fault-based liability or every European obligation.

[Article 11 of the eIDAS Regulation](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02014R0910-20241018) provides, for cross-border transactions, liability for the notifying state, the issuing party and the authentication operator when intentional or negligent failures to meet their obligations cause damage. It applies in accordance with national liability rules.

The domestic chain therefore remains to be established in a real case:

```text
France Identité malfunctions
→ FranceConnect+ refuses the connection
→ the final service lets the file expire
→ the user suffers a loss
```

Which actor could have prevented the damage? Which one had to preserve the deadline? Who holds the logs needed to prove the origin of the refusal? The public record does not yet provide one answer path.

## Reconstructing the future EUDI Wallet

The future EUDI Wallet adds credentials, attestations and transaction logs. A full copy of all secrets to a new device would be incompatible with several security architectures. The current European specification therefore describes a more complex process.

[TS10, published in the EUDI Wallet project](https://github.com/eu-digital-identity-wallet/eudi-doc-standards-and-technical-specifications/blob/main/docs/technical-specifications/ts10-data-portability-and-download-%28export%29.md), defines a password-protected encrypted **Migration Object**. It contains the list of identifiers and attestations, non-device-bound attestations and the transaction log. The user can export it to a selected location and import it into a new Wallet Unit.

The process then describes:

- automatic re-issuance of person-identification data (PID, in the specification) and device-bound attestations present in the old wallet;
- copying non-device-bound attestations;
- restoring the transaction log.

This architecture concerns the future EUDI Wallet. It does not automatically describe France Identité in 2026.

<figure class="infographic" style="padding-bottom:1.5rem" tabindex="0" aria-label="The future EUDI Wallet is reconstructed through migration and re-issuance">
<svg viewBox="0 0 360 920" width="100%" role="img" aria-labelledby="eudi-en-title eudi-en-desc" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;height:auto;overflow:hidden;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;background:#0c0d10">
<title id="eudi-en-title">THE FUTURE EUDI WALLET IS REBUILT</title>
<desc id="eudi-en-desc">The migration object carries a list, non-device-bound attestations and the log, then device-bound credentials are re-issued</desc>
<rect x="1" y="1" width="358" height="918" rx="16" fill="#0c0d10" stroke="#2b3038"/>
<text x="18" y="40" fill="#f5f6f8" font-size="13.7" font-weight="700">THE FUTURE EUDI WALLET IS REBUILT</text>
<text x="18" y="62" fill="#8b909b" font-size="8.4">TS10, separate from today’s France Identité</text>
<rect x="18" y="94" width="324" height="130" rx="12" fill="#141a28" stroke="#7aa2f7"/>
<text x="34" y="122" fill="#7aa2f7" font-size="10.2" font-weight="700">1. CREATE MIGRATION OBJECT</text>
<text x="34" y="148" fill="#f5f6f8" font-size="9">Encrypted, password-protected file</text>
<text x="34" y="170" fill="#aeb4bf" font-size="8.3">List of all credentials and providers</text>
<text x="34" y="190" fill="#aeb4bf" font-size="8.3">Non-device-bound credentials + log</text>
<path d="M180 232 V264" stroke="#7aa2f7" stroke-width="2"/>
<path d="M174 256 L180 266 L186 256" fill="#7aa2f7"/>
<rect x="18" y="270" width="324" height="112" rx="12" fill="#101319" stroke="#5eead4"/>
<text x="34" y="298" fill="#5eead4" font-size="10.5" font-weight="700">2. EXPORT</text>
<text x="34" y="324" fill="#f5f6f8" font-size="9">Location selected by the user</text>
<text x="34" y="346" fill="#aeb4bf" font-size="8.3">External disk or compatible storage</text>
<path d="M180 390 V422" stroke="#5eead4" stroke-width="2"/>
<path d="M174 414 L180 424 L186 414" fill="#5eead4"/>
<rect x="18" y="428" width="324" height="112" rx="12" fill="#1b1b14" stroke="#f5b13d"/>
<text x="34" y="456" fill="#f5b13d" font-size="10.5" font-weight="700">3. IMPORT</text>
<text x="34" y="482" fill="#f5f6f8" font-size="9">New wallet + password</text>
<text x="34" y="504" fill="#aeb4bf" font-size="8.3">The object lists what must be rebuilt</text>
<path d="M180 548 V580" stroke="#f5b13d" stroke-width="2"/>
<path d="M174 572 L180 582 L186 572" fill="#f5b13d"/>
<rect x="18" y="586" width="324" height="190" rx="12" fill="#10211f" stroke="#5eead4"/>
<text x="34" y="614" fill="#5eead4" font-size="10.2" font-weight="700">4. RE-ISSUE AND RESTORE</text>
<text x="34" y="642" fill="#f5f6f8" font-size="9">PID and device-bound credentials</text>
<text x="34" y="663" fill="#aeb4bf" font-size="8.3">Re-issued by their providers</text>
<text x="34" y="696" fill="#f5f6f8" font-size="9">Non-device-bound credentials</text>
<text x="34" y="717" fill="#aeb4bf" font-size="8.3">Copied to the new wallet</text>
<text x="34" y="750" fill="#f5f6f8" font-size="9">Transaction log</text>
<text x="34" y="771" fill="#aeb4bf" font-size="8.3">Restored from the migration object</text>
<rect x="14" y="816" width="332" height="84" rx="8" fill="#15171b" stroke="#3a4049"/>
<text x="26" y="838" fill="#aeb4bf" font-size="7.8">Migration still depends on issuers</text>
<text x="26" y="854" fill="#aeb4bf" font-size="7.8">for credentials tied to the new device.</text>
<text x="26" y="875" fill="#6f7580" font-size="7.6">Source: European Commission, EUDI TS10 specification.</text>
<text x="26" y="889" fill="#6f7580" font-size="7.6">This is not the France Identité path.</text>
</svg>
<figcaption>Portability recovers the list and some data. Credentials tied to the device must be re-issued, making each issuer’s availability part of recovery.</figcaption>
</figure>

## When a suspension affects several services

The European framework also covers a scenario in which the problem is not one user but the wallet solution itself.

[Implementing Regulation 2025/847](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32025R0847) requires a coordinated response when a breach compromises the reliability of a wallet solution. The Member State suspends provision and use of the affected solution and assesses whether wallet-unit attestations already issued must also be revoked.

If the problem is not remedied within three months of suspension, the solution must be withdrawn and its validity revoked without undue delay and no later than seventy-two hours after that period expires. The associated wallet-unit attestations must then be revoked and cannot return to a valid state.

Suspending a compromised solution is necessary protection. Systemic risk appears when several banks, administrations or companies remain independent but use the same wallet as an access key. A single incident can then create correlated refusals.

Continuity is therefore not only the wallet provider’s problem. Each final service needs another path when the common key is suspended.

## l0g tool: the recovery clock

<div class="instrument-plate" style="padding:1.1rem;--plate-accent:#5eead4">
<p class="mono-label" style="margin:0;color:#5eead4">L0G TOOL // THE RECOVERY CLOCK</p>
<p style="margin:.65rem 0 1rem;color:#d6d9df">Open the relevant scenario. The tool separates urgent action, documented path, economic fallback and unknowns. It is not a substitute for support or legal advice.</p>

<details style="border:1px solid #2b3038;border-radius:10px;background:#101319;margin:.75rem 0;padding:.85rem 1rem">
<summary style="cursor:pointer;color:#f5f6f8;font-weight:700">Phone lost, ID card retained</summary>
<div style="margin-top:.85rem;color:#d6d9df">
<p style="margin:.55rem 0"><strong>Urgent action:</strong> use the France Identité portal to request deletion or revocation, then review the <a href="https://aide.franceconnect.gouv.fr/faq/securite-confidentialite/comment-bloquer-les-comptes-que-je-n-utilise-pas/">FranceConnect dashboard</a> if a suspicious connection appears.</p>
<p style="margin:.55rem 0"><strong>Documented protection:</strong> FranceConnect+ through France Identité still requires the physical ID card.</p>
<p style="margin:.55rem 0"><strong>Return path:</strong> reinstall and create a new instance using the card and requested factors.</p>
<p style="margin:.55rem 0"><strong>Unknown:</strong> old-device invalidation time, preservation of certification, credentials restored automatically.</p>
</div></details>

<details style="border:1px solid #2b3038;border-radius:10px;background:#101319;margin:.75rem 0;padding:.85rem 1rem">
<summary style="cursor:pointer;color:#f5f6f8;font-weight:700">ID card lost or stolen</summary>
<div style="margin-top:.85rem;color:#d6d9df">
<p style="margin:.55rem 0"><strong>Urgent action:</strong> delete the identification means, file a complaint for theft or declare the loss during renewal.</p>
<p style="margin:.55rem 0"><strong>Known direct cost:</strong> 25-euro tax stamp.</p>
<p style="margin:.55rem 0"><strong>Effect:</strong> an invalidated card cannot be reactivated even if it is found.</p>
<p style="margin:.55rem 0"><strong>Unknown:</strong> national renewal time and continuity of certification between cards.</p>
</div></details>

<details style="border:1px solid #2b3038;border-radius:10px;background:#101319;margin:.75rem 0;padding:.85rem 1rem">
<summary style="cursor:pointer;color:#f5f6f8;font-weight:700">Code blocked after three mistakes</summary>
<div style="margin-top:.85rem;color:#d6d9df">
<p style="margin:.55rem 0"><strong>Status:</strong> the code is blocked and high-assurance certification is automatically revoked.</p>
<p style="margin:.55rem 0"><strong>Documented path:</strong> create a new code, then complete the in-person certification again.</p>
<p style="margin:.55rem 0"><strong>Published timing:</strong> result within 48 hours after the visit, excluding appointment availability and restoration at the final service.</p>
<p style="margin:.55rem 0"><strong>Risk:</strong> a recovery delay that exceeds a nearby deadline.</p>
</div></details>

<details style="border:1px solid #2b3038;border-radius:10px;background:#101319;margin:.75rem 0;padding:.85rem 1rem">
<summary style="cursor:pointer;color:#f5f6f8;font-weight:700">Financial procedure before FranceConnect+ returns</summary>
<div style="margin-top:.85rem;color:#d6d9df">
<p style="margin:.55rem 0"><strong>CPF:</strong> alternative verification published at between 48 hours and four weeks.</p>
<p style="margin:.55rem 0"><strong>France Rénov’:</strong> email account with postal verification that may take two weeks.</p>
<p style="margin:.55rem 0"><strong>INPI:</strong> advanced electronic signature supported by a qualified certificate.</p>
<p style="margin:.55rem 0"><strong>Question:</strong> does the original date preserve the right, place or budget during the incident?</p>
</div></details>

<details style="border:1px solid #2b3038;border-radius:10px;background:#101319;margin:.75rem 0;padding:.85rem 1rem">
<summary style="cursor:pointer;color:#f5f6f8;font-weight:700">Wallet solution suspended for security</summary>
<div style="margin-top:.85rem;color:#d6d9df">
<p style="margin:.55rem 0"><strong>Scope:</strong> future EUDI scenario, not a description of a current France Identité incident.</p>
<p style="margin:.55rem 0"><strong>Decision:</strong> the state may suspend the solution and decide whether existing units remain valid or are revoked.</p>
<p style="margin:.55rem 0"><strong>Degraded mode:</strong> each final service must retain another access path where its obligations require one.</p>
<p style="margin:.55rem 0"><strong>Risk:</strong> several independent services may reject the same identity at the same time.</p>
</div></details>

<p style="margin:1rem 0 0;color:#8b909b;font-size:.85rem">A missing public deadline is displayed as unknown. The tool does not convert an alternative-path period into a France Identité outage estimate.</p>
</div>

## Answers needed before scale-up

### Questions for France Titres

1. What maximum time separates a portal request from effective invalidation of the old device?
2. Does the user receive a timestamped and verifiable acknowledgement?
3. Can deletion target one phone without destroying the account?
4. How can a user act when the recovery email account is compromised?
5. What exactly does the published two-month maximum cover?
6. Apart from three incorrect PIN entries, in which scenarios is certification preserved, suspended or lost?
7. What are the median and 90th-percentile recovery times after a phone change, blocked code and lost ID card?
8. How many incidents are resolved automatically and how many require an agent?
9. What urgent channel exists when a user must complete a financial procedure that day?
10. How many claims for economic loss have been received and compensated?

### Questions for FranceConnect and final services

- How many FranceConnect+ refusals result from inconsistent certification status?
- How long after restoration at France Titres does FranceConnect+ recognise the status?
- Does a procedure started before lockout retain its original date?
- Can an agent extend a deadline or move the file to manual verification?
- Which logs are provided to the citizen to prove a technical refusal?
- Which entity decides compensation?

## l0g methodology

This investigation uses five evidence levels:

```text
ESTABLISHED
Official text, regulation, procedure or published specification

DECLARED
Promise or description by a public operator

INFERRED
Mechanical consequence clearly labelled as an inference

UNKNOWN
Information not found in the public record

TO TEST
Behaviour requiring a controlled experiment
```

The article is based on public documents available on **28 August 2026**. It does not rely on intercepted application traffic, access to production databases or a destructive test of a certified account. Unpublished recovery periods remain marked as unknown.

The CPF, France Rénov’ and INPI examples measure official alternative paths. They do not prove that an economic loss happens automatically. Such a loss depends on the real deadline, preservation of the filing date and the final service’s response.

EUDI rules concern the future European wallet. They are not used to describe today’s France Identité implementation as established fact.

## When identity governs access to a financial operation

The safeguards are real.

A stolen phone is not sufficient, under the current published procedure, to use FranceConnect+ with France Identité. After three errors, the PIN locks and high-assurance certification is revoked. Remote revocation exists. The physical ID card remains a factor. Alternative routes survive for the main services examined.

Risk lies in the dead time between protection and normal operation.

```text
The system protects the identity
→ it blocks or revokes
→ the legitimate owner must rebuild
→ the economic deadline keeps moving
```

A serious financial infrastructure publishes opposition, recovery, settlement and appeal times. An identity infrastructure expected to unlock financial procedures will need the same level of clarity, even though it is governed by different law.

The final question of this fifth part is therefore not whether France Identité can “cut off your money”.

It is more precise:

> **How long can an identity error separate you from a financial operation, and who bears the loss when the answer arrives after the deadline?**

## Main sources

- [France Identité terms of use](https://france-identite.gouv.fr/conditions-generales-utilisation/cgu-sgin/)
- [France Identité privacy policy](https://france-identite.gouv.fr/politique-de-confidentialite/confidentialite-fi/)
- [Security and remote deletion](https://france-identite.gouv.fr/securite-application/)
- [FranceConnect and FranceConnect+ authentication](https://france-identite.gouv.fr/usages/s-authentifier-en-ligne/)
- [Certified digital identity](https://france-identite.gouv.fr/identite-numerique-certifiee/)
- [France Diplomatie, effect of three incorrect PIN entries on certification](https://www.diplomatie.gouv.fr/fr/services/faq/vote-par-internet/17-comment-faire-certifier-mon-identite-numerique)
- [FranceConnect+ and alternative paths](https://www.franceconnect.gouv.fr/franceconnect-plus/)
- [Mon Compte Formation verification periods](https://of.moncompteformation.gouv.fr/espace-public/pourquoi-privilegier-la-verification-didentite-numerique-sur-mon-compte-formation)
- [France Rénov’ email-account path](https://authentification.france-renov.gouv.fr/)
- [INPI company-amendment procedure](https://www.inpi.fr/realiser-demarches/formalites-dentreprises/modifier-son-entreprise-individuelle)
- [Service-Public, renewal after loss](https://www.service-public.gouv.fr/particuliers/vosdroits/F1344)
- [Service-Public, renewal after theft](https://www.service-public.gouv.fr/particuliers/vosdroits/F1759)
- [Service-Public, invalidation of a declared lost or stolen document](https://www.service-public.gouv.fr/particuliers/vosdroits/F18704)
- [TS10, EUDI portability and recovery](https://github.com/eu-digital-identity-wallet/eudi-doc-standards-and-technical-specifications/blob/main/docs/technical-specifications/ts10-data-portability-and-download-%28export%29.md)
- [EUDI Architecture and Reference Framework](https://eudi.dev/2.9.0/architecture-and-reference-framework-main/)
- [Implementing Regulation 2025/847](https://eur-lex.europa.eu/eli/reg_impl/2025/847/oj)
- [Consolidated eIDAS Regulation, liability](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02014R0910-20241018)
