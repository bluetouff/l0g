---
title: "Your identity in your phone, 1/8: when an ID card becomes a service"
seoTitle: "France Identité: when an ID card becomes a service | l0g"
ogTitle: "When an ID card becomes a service"
description: "France Identité reports more than 4.5 million users. An investigation into the data, servers and traces behind France’s digital identity."
ogImage: "/illustrations/news/france-digital-identity-data-paths-v1.jpg"
pubDate: 2026-08-28T11:38:00+02:00
updatedDate: 2026-08-28T11:38:00+02:00
tags: ["France Identité", "digital identity", "eIDAS", "EUDI Wallet", "privacy", "CNIL", "ANSSI", "France Titres", "personal data", "investigation"]
draft: false
sourceArticle: "votre-identite-dans-un-telephone-1-la-carte-d-identite-qui-devient-un-service"
sourceUpdatedDate: 2026-08-28T11:38:00+02:00
---

*Since 24 June 2026, France Identité can be shown when checking a bag and boarding a flight at every French airport. The physical document is still mandatory for the other stages of the journey. The scene captures the transition now under way: identity has entered the phone without yet leaving the wallet.*

*France Titres says the app has more than 4.5 million users. The future European wallet is intended to extend the system to credentials, signatures, banking, telecoms, travel and payments. Before that change of scale, one question needs a precise answer: when a citizen proves who they are, which data move, which remain, and for how long?*

*Part one of the investigation **Your identity in your phone**.*

*French version: [La carte d’identité qui devient un service](/posts/votre-identite-dans-un-telephone-1-la-carte-d-identite-qui-devient-un-service/).*

## Key points

- France Identité complements the physical national identity card. It does not replace it.
- The current app, the certified digital identity and the future European wallet are three different layers.
- France Titres reported more than 4.5 million users in July 2026, compared with 100,000 when the app was opened to the public in February 2024. The publications reviewed do not define “user” precisely.
- The clearest benefit is data minimisation: at an airport, only the name, first name and photograph are displayed; on a train, the QR code shares the name, first name and date of birth.
- The public security page says identity data are not retained on servers. The DPIA describes temporary transit followed by deletion, while also documenting the retention of a document identifier and operation logs.
- The privacy notice, the DPIA and the decree do not present the same scope and retention periods with the same clarity. That documentary mismatch is not evidence of a hidden database.
- A public field-by-field data dictionary would show which data are processed, where, why, for how long and by whom.

## What France Identité allows at French airports

At bag drop or the boarding gate, the passenger opens France Identité and displays the vertical digital card. It contains the information the airline needs to check: name, first name and photograph.

This use has been authorised at every French airport since 24 June 2026. It is limited to the identity matching performed by airlines. For every other stage, a physical document remains necessary. It is still mandatory whenever immigration formalities require it. The app cannot yet be used at foreign airports, even for a flight to France. [France Titres states these limits on its airport page](https://france-identite.gouv.fr/actualite/embarquer_avec_france_identite.html).

The paperless journey therefore stops a few metres later.

This paradox removes a first source of confusion. France Identité is not an official photograph of the national identity card, and it has not yet turned the phone into a universal travel document. When the app was opened to the public in February 2024, the Interior Ministry described it as a free, optional alternative that was not intended to replace existing cards or procedures. [The digital driving licence also complements the physical one](https://www.interieur.gouv.fr/actualites/communiques-de-presse/generalisation-de-lapplication-france-identite-et-lancement-du).

The app adds a software layer to a state-issued identity. That layer is already official enough to be used on a train, during a roadside check, through FranceConnect, for a voting proxy or at an airport. It remains incomplete enough to require citizens to keep their physical documents.

This hybrid period is the right time to investigate. The system already works, but its conventions have not yet become invisible.

## A plastic card is shown. A digital identity is executed.

France Identité relies on five elements:

1. the new French national identity card in bank-card format, known as the CNIe;
2. the electronic component embedded in that card;
3. a compatible smartphone;
4. the mobile app;
5. the Digital Identity Guarantee Service, known by its French acronym SGIN.

The phone reads the CNIe chip. The app then links the document, the device and a personal code. The user can view credentials, generate a one-time proof, present a credential face to face or authenticate to a service.

The app is currently limited to adults holding the new CNI. The official page specifies a minimum of iOS 16.6 or Android 11, with NFC reading required on Android. France Identité also provides access to [more than 1,800 services through FranceConnect](https://france-identite.gouv.fr/).

The SGIN decree does more than authorise a digital display. It creates an electronic identification means that can be used with public or private organisations. The app can generate credentials containing only the attributes the user considers necessary to disclose. [That purpose appears in Article 1 of the decree](https://www.legifrance.gouv.fr/loda/id/JORFTEXT000045667825).

The change lies in that capability: identity becomes divisible.

A physical card reveals everything printed on its face. A digital proof can, depending on the use, provide only a name, a photograph, a date of birth, a right to drive or a binary answer such as “this person is over 18”.

The object of trust also changes. With a physical card, trust rests mainly on the document and the person inspecting it. With a digital identity, it also rests on the app, the operating system, the phone’s secure component, servers, certificates, revocation, logs and the service receiving the proof.

## The three layers of the system

France Identité, the certified digital identity and the European wallet often appear in the same narrative. They are not the same service.

<figure class="infographic infographic-readable" style="padding-bottom:1.5rem" tabindex="0" aria-label="Infographic showing the three layers of digital identity">
<svg viewBox="0 0 720 850" width="100%" role="img" aria-labelledby="identity-layers-en-title identity-layers-en-desc" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;height:auto;overflow:hidden;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;background:#0c0d10">
<title id="identity-layers-en-title">The three layers of French and European digital identity</title>
<desc id="identity-layers-en-desc">The current France Identité app, the certified digital identity and the future EUDI wallet are three distinct levels.</desc>
<rect x="1" y="1" width="718" height="848" rx="16" fill="#0c0d10" stroke="#2b3038"/>
<text x="32" y="48" fill="#f5f6f8" font-size="21" font-weight="700">THREE LAYERS, THREE PERIMETERS</text>
<text x="32" y="74" fill="#8b909b" font-size="12">European pilots are not yet everyday production services.</text>

<rect x="28" y="104" width="664" height="190" rx="14" fill="#10211f" stroke="#5eead4"/>
<circle cx="70" cy="146" r="22" fill="#5eead4"/>
<text x="70" y="152" text-anchor="middle" fill="#07110f" font-size="18" font-weight="800">1</text>
<text x="108" y="139" fill="#5eead4" font-size="14" font-weight="700">FRANCE IDENTITÉ TODAY</text>
<text x="108" y="166" fill="#f5f6f8" font-size="12">CNIe + compatible phone + mobile application.</text>
<text x="108" y="190" fill="#d6d9df" font-size="11">ID card, licence, vehicle registration, proofs, FranceConnect,</text>
<text x="108" y="210" fill="#d6d9df" font-size="11">trains, roadside checks and some airport uses.</text>
<text x="108" y="238" fill="#aeb4bf" font-size="10.5">Free and optional. Physical documents are still required.</text>
<text x="108" y="260" fill="#aeb4bf" font-size="10.5">Identity data are declared to be stored locally.</text>

<path d="M360 294 V328" stroke="#39414d" stroke-width="4"/>
<path d="M352 318 L360 332 L368 318" fill="#39414d"/>

<rect x="28" y="334" width="664" height="190" rx="14" fill="#141a28" stroke="#7aa2f7"/>
<circle cx="70" cy="376" r="22" fill="#7aa2f7"/>
<text x="70" y="382" text-anchor="middle" fill="#0a0d15" font-size="18" font-weight="800">2</text>
<text x="108" y="369" fill="#7aa2f7" font-size="14" font-weight="700">CERTIFIED DIGITAL IDENTITY</text>
<text x="108" y="396" fill="#f5f6f8" font-size="12">In-person verification at a town hall or when collecting a CNI.</text>
<text x="108" y="420" fill="#d6d9df" font-size="11">High assurance, FranceConnect+ and fully digital</text>
<text x="108" y="440" fill="#d6d9df" font-size="11">voting-proxy procedures.</text>
<text x="108" y="468" fill="#aeb4bf" font-size="10.5">France Titres announces a result within 48 hours.</text>
<text x="108" y="490" fill="#aeb4bf" font-size="10.5">This level is not yet the full European wallet.</text>

<path d="M360 524 V558" stroke="#39414d" stroke-width="4"/>
<path d="M352 548 L360 562 L368 548" fill="#39414d"/>

<rect x="28" y="564" width="664" height="220" rx="14" fill="#1b1b14" stroke="#f5b13d"/>
<circle cx="70" cy="606" r="22" fill="#f5b13d"/>
<text x="70" y="612" text-anchor="middle" fill="#151006" font-size="18" font-weight="800">3</text>
<text x="108" y="599" fill="#f5b13d" font-size="14" font-weight="700">EUROPEAN EUDI WALLET</text>
<text x="108" y="626" fill="#f5f6f8" font-size="12">Member States are expected to provide wallets by end-2026.</text>
<text x="108" y="650" fill="#d6d9df" font-size="11">Cross-border identity, credentials, diplomas, licences,</text>
<text x="108" y="670" fill="#d6d9df" font-size="11">bank details, signatures and other attributes.</text>
<text x="108" y="698" fill="#aeb4bf" font-size="10.5">Open-source licensing, user control and selective disclosure.</text>
<text x="108" y="720" fill="#aeb4bf" font-size="10.5">Banking, SIM, prescriptions, travel and payment were piloted.</text>
<text x="108" y="742" fill="#ffcf70" font-size="10.5" font-weight="700">PILOTED DOES NOT YET MEAN DEPLOYED FOR DAILY USE.</text>

<rect x="28" y="802" width="664" height="28" rx="7" fill="#15171b" stroke="#343943"/>
<text x="360" y="821" text-anchor="middle" fill="#8b909b" font-size="10">Sources: France Titres; eIDAS 2; European Commission. Reviewed 28 August 2026.</text>
</svg>
<figcaption>The same app name now covers a current infrastructure, a certified assurance level and a European wallet still being deployed.</figcaption>
</figure>

### France Identité today

The current app can present certain credentials, generate proofs and authenticate users. It remains tied to the CNIe and the phone. It can be revoked, including after loss or theft.

### The certified digital identity

Certification adds an in-person check. The user starts the request in the app, reads the CNI again through NFC, receives a QR code and presents the phone and card at a town hall or consulate. France Titres says the result is delivered within 48 hours. Since April 2025, creation and certification can also take place when a new CNI is collected. [The main current uses are FranceConnect+ and a fully online voting proxy](https://france-identite.gouv.fr/identite-numerique-certifiee/).

### The European EUDI wallet

The European framework is intended to add credentials recognised across borders: driving licences, diplomas, bank details, professional qualifications or signatures. The Commission says Member States must provide wallets by the end of 2026. The software must be open-source licensed, support selective disclosure and give users control over the data they share. [The Commission sets out the requirements and timetable on its EUDI page](https://digital-strategy.ec.europa.eu/en/policies/eudi-regulation).

France Titres coordinated the POTENTIAL and APTITUDE pilots. They covered opening a bank account, registering a SIM card, a mobile driving licence, qualified electronic signatures, cross-border prescriptions, transport tickets, travel documents, vehicle registration, strong customer authentication and payment initiation. [These scenarios are documented as pilots](https://france-identite.gouv.fr/potential-aptitude/), not as a list of features already available in daily use.

## What the user counter measures

On 13 February 2024, when the app was opened to the public, the Interior Ministry reported 100,000 users. On 27 March 2026, it celebrated four million. In July, France Titres reported more than 4.5 million.

The official counter therefore increased forty-fivefold in roughly twenty-nine months.

The 27 March 2026 release also provides some usage indicators. It mentions one million FranceConnect logins and initially reported nearly 79,500 fully digital voting proxies during the municipal elections. [A later statistical report from the same ministry](https://www.interieur.gouv.fr/actualites/communiques-de-presse/elections-municipales-et-communautaires-2026-bilan-chiffre-du-premier-et-du-second-tour) records **72,597 proxies validated through France Identité numérique**, or 6.4% of all proxies established since 1 January. l0g uses this later figure; the difference between the two official publications is not explained.

The main counter still lacks a definition.

In the publications reviewed, “user” is not explained. It could mean:

- a digital identity created;
- a phone linked to the system;
- an app still installed;
- an active identity;
- a person who recently completed an operation;
- a certified identity.

These categories are not interchangeable. An identity created and later abandoned is not an active user. One million cumulative logins do not show the number of distinct people or the frequency of repeat use.

The rigorous formulation is therefore that **France Titres reports more than 4.5 million users**, not that the service has 4.5 million active users.

Four additional numbers would remove the ambiguity: active identities, monthly users, certified identities and the distribution of use cases.

## The first practical benefit: showing less

Digital identity is often reduced to an unproductive opposition. One side treats modernisation as inherently protective. The other describes total surveillance before examining the architecture.

France Identité already offers a verifiable benefit: some proofs reveal less than a physical card or a photocopy.

At an airport, the vertical card shows the name, first name and photograph. It does not show the address, document number, nationality or date of birth.

On TGV INOUI, Intercités and OUIGO trains, the QR code shares the name, first name and date of birth. The check works without an internet connection. A ticket must still have been purchased, and the same details were provided during the purchase. [The official use page explains the process](https://france-identite.gouv.fr/usages/utiliser-france-identite-dans-les-trains/).

A photocopy of an identity card usually reveals everything printed on it, even when a landlord, hotel or company needs only two or three fields. A copy can then be stored, transferred or compromised. A one-time proof can limit the attributes disclosed and its validity period.

The CNIL welcomed this principle. It supported the reduction of photocopies, disclosure of only necessary attributes and the creation of minimised credentials that can be used offline. It also noted that SGIN did not add facial recognition to enrolment, unlike the earlier ALICEM project. [Its 2021 opinion is reproduced on the France Identité website](https://france-identite.gouv.fr/decrets-et-avis-cnil/).

The architecture can therefore improve privacy.

It does not solve every problem. The service receiving the proof may keep its own data. It may ask for more attributes than necessary. Technical minimisation does not prevent an excessive collection policy. It only provides a way to do better than a full photocopy.

## The transaction extends beyond the phone

The France Identité security page says identity data are not kept on servers and are stored only inside the app. [The wording is direct](https://france-identite.gouv.fr/securite-application/).

It can be read as a promise that the data never leave the device.

The more detailed documentation describes a different process.

The data protection impact assessment, or DPIA, says attributes from the CNIe may transit through the SGIN server to complete a transaction and are then deleted. The privacy notice lists FranceConnect, contracted services and the people or organisations selected by the user as possible recipients. [It also says the server processes identity-document data, contact data and an identifier for the mobile device](https://france-identite.gouv.fr/politique-de-confidentialite/confidentialite-fi/).

The path depends on the use:

```text
CNIe
  ↓ NFC reading
France Identité app
  ├─ local display or proximity QR code
  ├─ one-time proof sent to a chosen recipient
  └─ authentication through SGIN, FranceConnect or a connected service
```

The declared principle is that civil-identity attributes are not stored permanently after the operation. It does not mean no transit, no recipient and no logs.

A clearer sentence would be: **identity attributes are declared to be stored on the phone; some uses make them transit or disclose them; a document identifier and operation traces are retained server-side.**

## Four documents, four perimeters to reconcile

L0g compared four levels of public documentation:

1. public communications;
2. the privacy notice;
3. the published DPIA;
4. the SGIN decree in force.

They do not serve the same purpose. The decree creates a legal authorisation. The DPIA describes the declared implementation and safeguards. The privacy notice informs the user. Public communications simplify.

A difference between those documents is not proof of concealment. Citizens should still be able to read them without reverse-engineering the system.

<figure class="infographic infographic-readable" style="padding-bottom:1.5rem" tabindex="0" aria-label="Infographic comparing four documents on France Identité data">
<svg viewBox="0 0 720 1040" width="100%" role="img" aria-labelledby="identity-docs-en-title identity-docs-en-desc" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;height:auto;overflow:hidden;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;background:#0c0d10">
<title id="identity-docs-en-title">Four public documents describe France Identité data differently</title>
<desc id="identity-docs-en-desc">Public communications, the privacy notice, the DPIA and the decree present scopes and retention periods that need to be reconciled.</desc>
<rect x="1" y="1" width="718" height="1038" rx="16" fill="#0c0d10" stroke="#2b3038"/>
<text x="32" y="48" fill="#f5f6f8" font-size="21" font-weight="700">ONE IDENTITY, FOUR DESCRIPTIONS</text>
<text x="32" y="74" fill="#8b909b" font-size="12">The legal ceiling may not describe the database actually operated.</text>

<rect x="28" y="104" width="664" height="164" rx="14" fill="#10211f" stroke="#5eead4"/>
<text x="50" y="137" fill="#5eead4" font-size="13" font-weight="700">1. PUBLIC COMMUNICATIONS</text>
<text x="50" y="164" fill="#f5f6f8" font-size="12">“Identity data are not retained on servers.”</text>
<text x="50" y="188" fill="#d6d9df" font-size="11">Storage is said to occur only inside the application.</text>
<text x="50" y="210" fill="#aeb4bf" font-size="10.5">A simple promise, but it does not describe transit or logs.</text>
<text x="50" y="232" fill="#aeb4bf" font-size="10.5">Source: the application security page.</text>

<rect x="28" y="288" width="664" height="198" rx="14" fill="#141a28" stroke="#7aa2f7"/>
<text x="50" y="321" fill="#7aa2f7" font-size="13" font-weight="700">2. PUBLISHED DPIA</text>
<text x="50" y="348" fill="#f5f6f8" font-size="12">Attributes: transit for the transaction, followed by deletion.</text>
<text x="50" y="372" fill="#d6d9df" font-size="11">Document number: identifier used to correlate operations.</text>
<text x="50" y="394" fill="#d6d9df" font-size="11">“In principle” five years, with a three-year purge also stated.</text>
<text x="50" y="416" fill="#d6d9df" font-size="11">Logs: identifier, date, time and operation type, kept three years.</text>
<text x="50" y="446" fill="#aeb4bf" font-size="10.5">The document also says “no personal data stored”, although</text>
<text x="50" y="466" fill="#aeb4bf" font-size="10.5">a document number and linked logs remain personal data.</text>

<rect x="28" y="506" width="664" height="210" rx="14" fill="#1b1b14" stroke="#f5b13d"/>
<text x="50" y="539" fill="#f5b13d" font-size="13" font-weight="700">3. PRIVACY NOTICE</text>
<text x="50" y="566" fill="#f5f6f8" font-size="12">The server “processes” document, contact and device data.</text>
<text x="50" y="590" fill="#d6d9df" font-size="11">One sentence groups identity and technical data under three years.</text>
<text x="50" y="612" fill="#d6d9df" font-size="11">Later: attributes deleted, document number and traces retained.</text>
<text x="50" y="634" fill="#d6d9df" font-size="11">The notice and DPIA differ on what uninstalling the app deletes.</text>
<text x="50" y="664" fill="#aeb4bf" font-size="10.5">Temporary processing and durable storage are distinct,</text>
<text x="50" y="686" fill="#aeb4bf" font-size="10.5">but the distinction is not presented consistently.</text>

<rect x="28" y="736" width="664" height="198" rx="14" fill="#21151c" stroke="#ff85ad"/>
<text x="50" y="769" fill="#ff85ad" font-size="13" font-weight="700">4. SGIN DECREE</text>
<text x="50" y="796" fill="#f5f6f8" font-size="12">Authorises a broad server-side data scope for five years,</text>
<text x="50" y="820" fill="#d6d9df" font-size="11">except transaction history, which is stored on the phone.</text>
<text x="50" y="842" fill="#d6d9df" font-size="11">Creation, consultation, use, revocation and deletion</text>
<text x="50" y="864" fill="#d6d9df" font-size="11">operations are logged for three years.</text>
<text x="50" y="894" fill="#aeb4bf" font-size="10.5">The CNIL had already noted that the actual minimisation</text>
<text x="50" y="916" fill="#aeb4bf" font-size="10.5">was not reflected in the broad wording of Article 4.</text>

<rect x="28" y="958" width="664" height="56" rx="10" fill="#15171b" stroke="#4a505a"/>
<text x="360" y="981" text-anchor="middle" fill="#f5f6f8" font-size="11" font-weight="700">DOCUMENTARY CONCLUSION</text>
<text x="360" y="1002" text-anchor="middle" fill="#aeb4bf" font-size="10">No evidence of a hidden database. A public field-by-field map is needed.</text>
</svg>
<figcaption>The texts may be compatible if the decree sets a broad legal ceiling while the implementation uses only a subset. That relationship needs to be published clearly.</figcaption>
</figure>

### Public communications: the data remain on the phone

The security page says identity data are not retained on servers. They are said to be stored only inside the app, on the phone. This is the simplest promise and probably the one most users remember.

### The DPIA: transit, deletion, a document identifier and logs

The published DPIA says identity attributes transit through SGIN only to carry out the requested transaction and are then deleted. It says the only data retained on the smartphone are those extracted from the document, under the user’s exclusive control. [France Titres publishes the document as a PDF](https://france-identite.gouv.fr/assets/files/AIPD_SGIN_Conforme.pdf).

The same table describes the document number as the identifier linking operations to the user. It mentions retention “in principle” for five years under the decree, then an automatic purge after three years together with operation logs. Authentication and operation logs include the user identifier, date, time and type of operation, with a stated maximum retention period of three years.

Later, the section on access rights says that no personal data are stored on ANTS servers, before explaining that technical and logging data are retained. The sentence appears to use “personal data” more narrowly than the GDPR. A document number or a log linked to an individual remains personal data.

### The privacy notice: several formulations are difficult to align

The privacy notice says the SGIN server processes:

- identity-document data;
- contact data;
- the mobile-device identifier.

Its retention section groups traces, logs, identifiers, identity data and technical data under a three-year period. A few lines later, it says attributes extracted from the CNI are deleted at the end of the transaction and that only the document number and usage traces are retained.

Another difference appears between two public documents. Section 9 of the privacy notice says uninstalling the app deletes only data on the smartphone. The DPIA says instead that uninstalling removes data from both the server and phone, except information kept for possible disputes.

These passages may reflect an incomplete update, a poorly explained technical distinction or different rules for different fields. They should be corrected because the privacy notice is the document citizens must be able to understand without legal expertise.

### The decree: a much broader authorisation

Article 2 of the decree permits the processing and recording of identity details, contact details, the photograph, document information, the terminal identifier and transaction history.

Article 4 says that, except for transaction history, these data are stored on the server and kept for five years from the last identity verification. They must be deleted when the user removes the digital identity, uninstalls the app or remains inactive for two years. [The consolidated text is available on Légifrance](https://www.legifrance.gouv.fr/loda/id/JORFTEXT000045667825).

Article 5 also requires a log of operations creating, consulting, using, revoking and deleting the identification means. It contains the author’s identifier, date, time and purpose of the operation, with three years of retention. [Article 5 is available separately](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000045670675).

Read alone, the decree authorises much more than the implementation described by the DPIA.

The CNIL anticipated the issue. In 2021 it noted that the ministry had minimised the list of data actually retained on the server, while regretting that the limitation did not appear in the wording of Article 4. The law therefore sets a broad ceiling, while the declared system would operate with a smaller subset.

That explanation is plausible. It still does not provide the current production data dictionary.

## Tool: follow the trail of an identity proof

<div role="region" aria-labelledby="trace-tool-en-title" style="margin:1.5rem 0;padding:1.1rem;border:1px solid #343943;border-radius:14px;background:#101319">
<h3 id="trace-tool-en-title" style="margin:0 0 .45rem;color:#f5f6f8;font-size:1.12rem">Trace explorer</h3>
<p style="margin:.25rem 0 1rem;color:#aeb4bf">Open a use case. The tool separates the visible proof, documented transit, declared retention and the remaining unknown. It is not a substitute for network analysis or the recipient’s own privacy policy.</p>

<details style="margin:.65rem 0;border:1px solid #2f3842;border-radius:10px;background:#0c0d10">
<summary style="cursor:pointer;padding:.85rem 1rem;color:#5eead4;font-weight:700">Airport: vertical digital card</summary>
<div style="padding:0 1rem 1rem;color:#d6d9df">
<p><strong>Visible proof:</strong> name, first name and photograph.</p>
<p><strong>Purpose:</strong> identity matching by the airline at bag drop and boarding.</p>
<p><strong>Documented transit:</strong> the use page describes an on-screen presentation. It does not describe a server exchange specific to that check.</p>
<p><strong>Remaining unknown:</strong> the page does not set out any traces retained by the airline or its service provider.</p>
</div>
</details>

<details style="margin:.65rem 0;border:1px solid #2f3842;border-radius:10px;background:#0c0d10">
<summary style="cursor:pointer;padding:.85rem 1rem;color:#7aa2f7;font-weight:700">Train: offline QR code</summary>
<div style="padding:0 1rem 1rem;color:#d6d9df">
<p><strong>Shared proof:</strong> name, first name and date of birth, already supplied when the ticket was purchased.</p>
<p><strong>Purpose:</strong> combined ticket and identity check on TGV INOUI, Intercités and OUIGO services.</p>
<p><strong>Documented transit:</strong> the scan works without internet access, so no network call is required at the point of inspection.</p>
<p><strong>Remaining unknown:</strong> the official page does not say whether the inspector’s device keeps a local scan log before synchronisation.</p>
</div>
</details>

<details style="margin:.65rem 0;border:1px solid #2f3842;border-radius:10px;background:#0c0d10">
<summary style="cursor:pointer;padding:.85rem 1rem;color:#f5b13d;font-weight:700">Online login: SGIN and FranceConnect</summary>
<div style="padding:0 1rem 1rem;color:#d6d9df">
<p><strong>Shared proof:</strong> the attributes requested by the journey, through SGIN, FranceConnect or a connected service.</p>
<p><strong>Documented transit:</strong> the DPIA describes temporary server transit to complete the transaction.</p>
<p><strong>Declared retention:</strong> attributes are said to be deleted after the operation; the document number and usage traces may remain.</p>
<p><strong>Remaining unknown:</strong> the exact contents of the “purpose of the operation” field in public logging documentation are not defined field by field.</p>
</div>
</details>

<details style="margin:.65rem 0;border:1px solid #2f3842;border-radius:10px;background:#0c0d10">
<summary style="cursor:pointer;padding:.85rem 1rem;color:#ff85ad;font-weight:700">One-time identity proof</summary>
<div style="padding:0 1rem 1rem;color:#d6d9df">
<p><strong>Shared proof:</strong> a signed credential containing selected attributes and a chosen validity period.</p>
<p><strong>Documented transit:</strong> generation may involve SGIN; attributes are said to be deleted after the transaction.</p>
<p><strong>Declared retention:</strong> the proof remains under the user’s control until it is sent.</p>
<p><strong>Remaining unknown:</strong> after receipt, retention depends on the recipient, its legal basis and its own data policy.</p>
</div>
</details>

<p style="margin:1rem 0 0;color:#777f8b;font-size:.86rem">Sources: France Identité use pages, privacy notice, SGIN DPIA and Decree No. 2022-676. Reviewed 28 August 2026.</p>
</div>

## Logs can reveal more than a name

Two objects need to be separated.

First, the decree defines a transaction history. It may include the recipient, category, status, validity period, purpose and timestamp. This history is excluded from the server storage set out in Article 4 and is held on the terminal.

Second, the decree creates server-side operation logs. Each creation, consultation, use, revocation or deletion of the identification means is recorded with an identifier, date, time and “purpose of the operation”.

The public documentation does not define that purpose precisely enough.

Does the log record only “successful authentication”? Does it contain the name of the service? Its category? Can it distinguish a bank login from a tax, health or commercial service? Can one identifier link several operations?

None of the documents reviewed supports an answer without extrapolation.

The CNIL focused on this risk. It considered three-year logs for creation, consultation, revocation and deletion proportionate. It asked the ministry to reconsider the same period for usage traces involving commercial services because of the potential for tracking.

The issue therefore extends beyond the fields visible in a proof. Modest metadata, repeated over three years, may reconstruct patterns of use.

## What the security certifications cover

France Titres says it obtained first-level security certification and elementary qualification for the Android and iOS apps. The certified digital identity targets a high assurance level. These statements matter: they indicate that a defined scope and version were assessed against reference standards.

They do not support a claim that every component in the ecosystem has been certified as a single whole.

A mobile app, backend, API, town-hall procedure, revocation system, hosting environment and update chain are different targets. The security part of this investigation will have to match each certificate to its scope, version and validity period.

Code transparency also remains incomplete. On 28 August 2026, the official page still said the mobile app source code would be published “soon” under an open-source licence. The EUDI regulation makes that expectation more important: the application software components must, subject to the exceptions in the text, be provided under an open-source licence.

A useful publication should allow scrutiny of:

- network flows generated by the app;
- data written locally;
- permissions requested;
- external libraries;
- logging mechanisms;
- the relationship between published code and distributed binaries.

Opening the code will not prove the security of the full infrastructure. It will make some promises testable.

## The European wallet changes the scale

The current France Identité app mainly covers identity, credentials and access to procedures. The European wallet is intended to add many more attestations.

The European regulation provides for voluntary use. It says Member States should not restrict access to public or private services for people who choose not to use a wallet and should provide appropriate alternatives. It also provides for a dashboard showing the parties with which data were shared, the requested attributes and transaction history. [The full text is available on EUR-Lex](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1183).

On paper, the safeguards are substantial:

- exclusive user control;
- selective disclosure;
- registration of relying parties;
- separation of wallet data from the provider’s other activities;
- protection against unlawful tracking;
- open-source licensing;
- alternatives for non-users.

The investigation concerns the move from rules to real use.

An app containing a digital CNI does not carry the same weight as a wallet able to combine:

```text
identity
driving licence
vehicle registration
diplomas
professional rights
prescriptions
transport tickets
electronic signature
bank details
payment initiation
```

The main risk is not necessarily a central database containing a citizen’s entire life. It may be distributed: services asking for too many attributes, excessive retention by recipients, metadata correlation, dependence on a smartphone, weak account recovery, subcontracting or fragmented responsibility.

The same correlation risk created by identifiers and metadata also appears in our [investigation into the digital euro’s data flows](/en/analysis/digital-euro-3-as-private-as-cash/). The two infrastructures are distinct, but the reading method is the same: separate visible data, technical identifiers, logs and the actor capable of linking them.

The promise “your data stay on your phone” will no longer be enough. Every flow must be traceable to its final recipient.

## Six public answers are still needed

### 1. A definition of “user”

France Titres should distinguish identities created, active, certified and used monthly.

### 2. A server-side data dictionary

For every field:

```text
data name
purpose
processing location
transit or storage
retention period
authorised access
deletion condition
```

### 3. The exact contents of logs

The “purpose of the operation” must be defined, including whether the receiving service or its category can be recovered.

### 4. Reconciled retention periods

Five years in the decree, three years in several passages, deletion after the transaction for attributes, and differing statements on uninstalling: one coherent version should be published.

### 5. The scope of audits

Every certification should be publicly tied to a version, component and validity date.

### 6. A genuinely usable alternative

Voluntary use is not measured by the theoretical existence of another route. It depends on cost, delay, availability and simplicity.

A service accessible in thirty seconds with France Identité but only after several days without a smartphone may remain optional in law. In practice, it can become almost mandatory.

That will be the subject of part two.

## The finding from part one

France Identité is not a copy of the French national identity card stored on a phone. It is an electronic identification means already used at scale and intended to become the French foundation of the European wallet.

The system offers tangible benefits. It can reduce photocopies, limit disclosed data, work offline for some uses and provide a high-assurance certified identity. The CNIL supported those principles.

Nothing in the documents reviewed supports a claim that a hidden database systematically stores every civil-identity attribute or the full history of every use.

The same documents establish three facts:

1. some attributes may transit through servers;
2. a document number and operation logs are retained;
3. the public documents do not describe those data and retention periods with perfect consistency.

At 100,000 users, this lack of documentary precision might have looked like an early-stage flaw. At more than 4.5 million, as the infrastructure expands towards banking, telecoms, travel and payments, it becomes a matter of public transparency.

The question for the next seven parts is one sentence:

> **When you prove who you are, who learns what, who keeps what, and for how long?**

## Method and limits

This article is based on public documents available on 28 August 2026: the SGIN decree, privacy notice, published DPIA, CNIL opinions, France Titres pages, Interior Ministry releases and the European EUDI framework.

l0g has not inspected production databases, intercepted the app’s network traffic, obtained a response to a GDPR access request or audited the systems of recipients. The article therefore draws no conclusion about practice beyond the published record.

The discrepancy described here is documentary. It must be tested against an official data map and reproducible technical analysis.

## Primary sources

- [France Identité at French airports](https://france-identite.gouv.fr/actualite/embarquer_avec_france_identite.html)
- [Homepage and technical requirements](https://france-identite.gouv.fr/)
- [Certified digital identity](https://france-identite.gouv.fr/identite-numerique-certifiee/)
- [Use on trains](https://france-identite.gouv.fr/usages/utiliser-france-identite-dans-les-trains/)
- [Public launch in February 2024](https://www.interieur.gouv.fr/actualites/communiques-de-presse/generalisation-de-lapplication-france-identite-et-lancement-du)
- [Official March 2026 update](https://www.interieur.gouv.fr/actualites/communiques-de-presse/france-identite-deja-4-millions-dutilisateurs-et-acceleration-des-usages-pour-simplifier-quotidien)
- [Final statistical report on 2026 municipal-election voting proxies](https://www.interieur.gouv.fr/actualites/communiques-de-presse/elections-municipales-et-communautaires-2026-bilan-chiffre-du-premier-et-du-second-tour)
- [Privacy notice](https://france-identite.gouv.fr/politique-de-confidentialite/confidentialite-fi/)
- [Application security page](https://france-identite.gouv.fr/securite-application/)
- [Published SGIN DPIA](https://france-identite.gouv.fr/assets/files/AIPD_SGIN_Conforme.pdf)
- [Consolidated SGIN decree](https://www.legifrance.gouv.fr/loda/id/JORFTEXT000045667825)
- [CNIL opinions](https://france-identite.gouv.fr/decrets-et-avis-cnil/)
- [POTENTIAL and APTITUDE pilots](https://france-identite.gouv.fr/potential-aptitude/)
- [European Commission EUDI framework](https://digital-strategy.ec.europa.eu/en/policies/eudi-regulation)
- [Regulation (EU) 2024/1183](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1183)
