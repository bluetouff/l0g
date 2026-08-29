---
title: "Your identity in your phone, 7/8: a sovereign identity on an American phone"
seoTitle: "Does France’s digital ID depend on Apple and Google? | l0g"
ogTitle: "A sovereign identity on an American phone"
description: "Stores, NFC, hardware keys and attestation: France controls its ID app, but not every layer deciding whether it runs."
pubDate: 2026-08-28T21:00:00+02:00
updatedDate: 2026-08-28T21:00:00+02:00
ogImage: "/illustrations/news/france-identite-telephone-souverain-v1.jpg"
tags: ["France Identité", "Apple", "Google", "Android", "iOS", "EUDI", "DMA", "ANSSI", "App Store", "Google Play", "digital sovereignty", "financial risk", "investigation"]
draft: false
sourceArticle: "votre-identite-dans-un-telephone-7-une-identite-souveraine-sur-un-telephone-americain"
sourceUpdatedDate: 2026-08-28T21:00:00+02:00
---

*The identity card is issued by the French State. France Identité says its servers are hosted in the Interior Ministry’s cloud. Its one-time identity credentials carry a public electronic seal. Yet installing the application currently means going through Google Play or Apple’s App Store. Protecting its keys requires security functions supplied by the phone. Deciding whether an app instance deserves trust requires a legitimacy check.*

*Sovereignty does not disappear at that point. It moves down the stack. The State remains responsible for identity, but it does not manufacture the iPhone, Android, the cryptographic components or the stores distributing its application. A decision made beneath France Identité therefore depends on several layers, some controlled by Apple, Google or device manufacturers.*

*That dependency can be useful. Compatible phones provide secure environments, update systems and hardware able to protect keys. The problem starts when a citizen cannot learn why a device was rejected, the State does not publish its compatibility matrix, and incompatibility closes the fast path to training funds, a public grant or a company filing.*

*This is part seven of l0g’s investigation **Your identity in your phone**. Part one followed [the data and logs behind France Identité](/en/analysis/your-identity-in-your-phone-1-when-an-id-card-becomes-a-service/). Part two measured [the practical cost of alternatives](/en/analysis/your-identity-in-your-phone-2-optional-but-at-what-cost/). Part three examined [sovereignty under contract](/en/analysis/your-identity-in-your-phone-3-sovereignty-under-contract/). Part four followed [age becoming an access credential](/en/analysis/your-identity-in-your-phone-4-age-becomes-an-access-credential/). Part five tested [the day digital identity stops responding](/en/analysis/your-identity-in-your-phone-5-when-your-identity-stops-responding/). Part six followed [the bill behind a free proof](/en/analysis/your-identity-in-your-phone-6-your-identity-is-free-the-proof-may-be-billed/).*

*Version française : [Une identité souveraine sur un téléphone américain](/posts/votre-identite-dans-un-telephone-7-une-identite-souveraine-sur-un-telephone-americain/).*

## Key points

- The official site lists a bank-card-sized electronic ID, adulthood and a phone running at least Android 11 with NFC or iOS 16.6.
- The two consumer download channels presented are Google Play and the App Store. L0g found no official production channel outside those stores as of 28 August 2026.
- Public testimonies on the French government’s Services Publics+ platform report a “missing security mechanisms” message on devices running Android 11, 13, 14 or 15, sometimes after the app had previously worked.
- Those testimonies do not measure a failure rate. They show that the public requirements do not always explain the technical decision.
- France Identité’s website still presents its certified digital identity as the route into FranceConnect+ for Mon Compte Formation, MaPrimeRénov’ and the INPI business portal. A rejected phone may therefore lead to a slower route, a qualified certificate, an agent or travel.
- EU law requires designated gatekeepers to provide effective, free interoperability with the same operating-system, hardware and software features they use for their own services.
- The same framework requires the wallet’s application components to be open-source licensed.
- Those two rights do not by themselves prove that an independent distribution channel, a public attestation root or an immediate remedy for false rejection exists.
- The 2023 CSPN reports evaluated Android 1.2.4 and iOS 1.2.3, then developed by Atos. They covered app legitimacy proof and a full source-code review of those exact versions.
- Two ANSSI decisions dated 21 May 2025 subsequently qualified Android and iOS 1.3.X from 1.3.7 at the elementary level, relying in part on those reports. They were valid until 7 February 2026.
- The iOS decision nevertheless describes the CSPN report as covering version 1.2.4, while the public ANSSI-CSPN-2023/21 report says 1.2.3. L0g treats this as a documentary inconsistency and draws no conclusion from it about product security.
- The ANSSI catalogue consulted on 28 August 2026 publishes no renewal decision and its dedicated page lists France Identité among schemes undergoing certification. The public record therefore does not support describing versions distributed after that date as covered by a currently valid decision.
- Public documentation does not confirm whether France Identité currently uses Play Integrity, Android Key Attestation, App Attest or a mechanism specific to SGIN.
- The EU technical architecture distinguishes application integrity from key security. Its reference service can consume the Android Keystore attestation chain and an iOS format based on App Attest, but it is published for testing and development.
- The App Store says “Data Not Collected”, based on a declaration Apple says it has not verified. Google Play says the app may collect personal information and device identifiers and may share personal information. Different taxonomies mean these labels alone do not prove a contradiction or abusive collection.
- Useful sovereignty is an exit capability: distribute, sign, update, attest, explain a refusal, correct an error and preserve an alternative path.

## France’s identity card is downloaded through two private stores

The [official France Identité website](https://france-identite.gouv.fr/) currently presents two download routes: Google Play for Android and the App Store for iOS.

The visible requirements are easy to understand:

```text
New French electronic identity card
Age 18 or over
Android 11 with NFC
or iOS 16.6 minimum
```

That simplicity is useful to the public. It does not describe the full trust chain.

This concerns almost the entire French mobile market. The [2026 Arcep barometer](https://www.arcep.fr/cartes-et-donnees/nos-publications-chiffrees/transition-ipv6/barometre-annuel-de-la-transition-vers-ipv6-en-france.html) uses a 61% Android and 39% iOS split, based on data collected in early 2025 from the four main operators. [Insee](https://www.insee.fr/fr/statistiques/8660210) estimates that 84.2% of people aged 15 or over owned a smartphone in 2025, compared with 48.5% of those aged 75 or over. The mobile wallet therefore relies on mass infrastructure without being universal.

A digital identity application cannot accept every environment. It must establish that its code has not been altered, secrets are protected, the device is not manifestly compromised and keys used for credentials cannot be copied freely.

The service must therefore answer another question:

> **Is this phone trustworthy enough to carry a high-assurance identity?**

That answer may depend on the app, the SGIN backend, the operating system, the manufacturer, verified boot, security patches, a cryptographic chip and, depending on the mechanism selected, an Apple or Google service.

<figure class="infographic" style="padding-bottom:1.5rem" tabindex="0" aria-label="The five trust layers beneath France Identité">
<svg viewBox="0 0 360 920" width="100%" role="img" aria-labelledby="trust-stack-en-title trust-stack-en-desc" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;height:auto;overflow:hidden;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;background:#0c0d10">
<title id="trust-stack-en-title">TRUST BENEATH THE APPLICATION</title>
<desc id="trust-stack-en-desc">France Identité relies on public and private layers, from sovereign identity to the phone operating system, store and hardware.</desc>
<rect x="1" y="1" width="358" height="918" rx="16" fill="#0c0d10" stroke="#2b3038"/>
<text x="18" y="38" fill="#f5f6f8" font-size="13.5" font-weight="700">TRUST BENEATH</text>
<text x="18" y="58" fill="#f5f6f8" font-size="13.5" font-weight="700">THE APPLICATION</text>
<text x="18" y="82" fill="#8b909b" font-size="8.4">Simplified layers, separate scopes</text>
<rect x="22" y="108" width="316" height="108" rx="12" fill="#10211f" stroke="#5eead4"/>
<text x="38" y="136" fill="#5eead4" font-size="10.5" font-weight="700">1. STATE AND SGIN</text>
<text x="38" y="162" fill="#f5f6f8" font-size="10">Identity, servers, rules and revocation</text>
<text x="38" y="184" fill="#aeb4bf" font-size="8.8">Documented public control</text>
<path d="M180 216 V242" stroke="#5eead4" stroke-width="2"/>
<path d="M174 234 L180 244 L186 234" fill="#5eead4"/>
<rect x="22" y="248" width="316" height="108" rx="12" fill="#101824" stroke="#7aa2f7"/>
<text x="38" y="276" fill="#7aa2f7" font-size="10.5" font-weight="700">2. FRANCE IDENTITÉ APP</text>
<text x="38" y="302" fill="#f5f6f8" font-size="10">Code, interface and legitimacy proof</text>
<text x="38" y="324" fill="#aeb4bf" font-size="8.8">Specific versions assessed by ANSSI</text>
<path d="M180 356 V382" stroke="#7aa2f7" stroke-width="2"/>
<path d="M174 374 L180 384 L186 374" fill="#7aa2f7"/>
<rect x="22" y="388" width="316" height="122" rx="12" fill="#1b1b14" stroke="#f5b13d"/>
<text x="38" y="416" fill="#f5b13d" font-size="10.5" font-weight="700">3. SYSTEM AND DISTRIBUTION</text>
<text x="38" y="442" fill="#f5f6f8" font-size="10">Android or iOS, Play Store or App Store</text>
<text x="38" y="464" fill="#aeb4bf" font-size="8.8">Updates, signing and device policy</text>
<text x="38" y="486" fill="#6f7580" font-size="8.2">No official alternative channel identified</text>
<path d="M180 510 V536" stroke="#f5b13d" stroke-width="2"/>
<path d="M174 528 L180 538 L186 528" fill="#f5b13d"/>
<rect x="22" y="542" width="316" height="136" rx="12" fill="#21151c" stroke="#ff4d87"/>
<text x="38" y="570" fill="#ff85ad" font-size="10.5" font-weight="700">4. HARDWARE AND ATTESTATION</text>
<text x="38" y="596" fill="#f5f6f8" font-size="10">Keystore, TEE, StrongBox or Secure Enclave</text>
<text x="38" y="618" fill="#aeb4bf" font-size="8.8">Current French mechanism is unpublished</text>
<text x="38" y="640" fill="#6f7580" font-size="8.2">EUDI references can use Android roots</text>
<text x="38" y="657" fill="#6f7580" font-size="8.2">and an App Attest-based iOS format</text>
<path d="M180 678 V704" stroke="#ff4d87" stroke-width="2"/>
<path d="M174 696 L180 706 L186 696" fill="#ff4d87"/>
<rect x="22" y="710" width="316" height="120" rx="12" fill="#15171b" stroke="#4a505a" stroke-dasharray="5 4"/>
<text x="38" y="738" fill="#f5f6f8" font-size="10.5" font-weight="700">5. USER OUTCOME</text>
<text x="38" y="764" fill="#f5f6f8" font-size="10">Phone accepted or rejected</text>
<text x="38" y="786" fill="#aeb4bf" font-size="8.8">Detailed reason, appeal and cost: unpublished</text>
<text x="38" y="808" fill="#6f7580" font-size="8.2">The citizen immediately bears the result</text>
<text x="18" y="866" fill="#6f7580" font-size="7.7">Sources: France Titres, ANSSI, eIDAS regulation,</text>
<text x="18" y="883" fill="#6f7580" font-size="7.7">EUDI specifications. Reviewed: 28 August 2026.</text>
</svg>
<figcaption>Identity remains sovereign, but practical access depends on a technical stack whose layers are not all controlled by the State.</figcaption>
</figure>

## Android 11 and NFC leave part of compatibility unexplained

The French government’s [Services Publics+](https://www.plus.transformation.gouv.fr/) platform contains several accounts from users whose phones appear to meet the published requirements but receive a message saying that missing security mechanisms prevent France Identité from running.

The public accounts include:

- [a device running Android 13](https://www.plus.transformation.gouv.fr/experiences/4917636_lapplication-france-identite-ne-fonctionne-pas);
- [a phone running Android 15](https://www.plus.transformation.gouv.fr/experiences/6434356_visiblement-france-identite-est-inutile);
- [an Android 11 model with NFC](https://www.plus.transformation.gouv.fr/experiences/6188801_doogee-v10-pas-compatible);
- [devices that worked before becoming incompatible](https://www.plus.transformation.gouv.fr/experiences/7390785_franceidentite-inoperant-du-jour-au-lendemain).

These reports are not a representative sample. Users facing a problem have more reason to publish than satisfied users. The “similar experience” button cannot produce a failure rate. Some incompatibilities may be fully justified by the device’s security state.

They nevertheless establish two useful points.

### The public requirements are incomplete

An Android version and the presence of NFC do not fully explain why a device is accepted or rejected.

### The message is not actionable enough

Public information does not say whether the failure is caused by:

```text
The cryptographic chip
Verified boot
Manufacturer certification
Security-patch level
Google Play Services
Application signature
An NFC configuration
An unlocked bootloader
A false positive
```

The difference matters. A user may be able to restore NFC, install an update or relock a device. They cannot add absent hardware, repair a rejected attestation chain or make a manufacturer patch its firmware.

In the public France Identité documentation reviewed by l0g on 28 August 2026, we found no matrix listing required mechanisms, supported models, rejection causes or matching error codes.

## A rejected phone can delay an economic transaction

[Certified France Identité](https://france-identite.gouv.fr/identite-numerique-certifiee/) currently opens FranceConnect+ access to Mon Compte Formation, MaPrimeRénov’ and the INPI business portal.

Rejecting the phone does not remove the underlying right. Alternatives exist. Their practical cost differs.

| Procedure | Published alternative | Documented friction |
|---|---|---|
| Mon Compte Formation | [Manual identity check](https://www.moncompteformation.gouv.fr/espace-public/je-ne-remplis-pas-les-conditions-pour-utiliser-franceconnect) | About four weeks, with a paper route that may take longer |
| France Rénov’ | [Email account and postal verification](https://france-renov.gouv.fr/foire-aux-questions/compte) | Letter announced within 12 days |
| INPI | [Advanced signature based on a qualified certificate](https://www.inpi.fr/faq/890) | External provider, more technical process; an agent may be used |
| Voting proxy | [In-person identity check](https://www.service-public.gouv.fr/particuliers/actualites/A18658) | Travel to an authorised authority |

These are neither guaranteed deadlines nor l0g measurements. They come from the official routes, also examined in [part two](/en/analysis/your-identity-in-your-phone-2-optional-but-at-what-cost/).

The financial cost can therefore take several forms:

```text
Replacing a phone earlier than planned
Buying a qualified certificate
Paying an agent
Travelling
Waiting for a letter
Missing a deadline or course session
Using staff or adviser time
```

No evidence automatically assigns those costs to Apple, Google or France Titres. The final service, its alternative route and the user’s circumstances determine the actual loss.

The liability question remains:

> **When a phone meeting the published requirements is wrongly rejected, who pays for the replacement route?**

<figure class="infographic" style="padding-bottom:1.5rem" tabindex="0" aria-label="Economic propagation of a rejected phone">
<svg viewBox="0 0 360 1000" width="100%" role="img" aria-labelledby="refusal-cost-en-title refusal-cost-en-desc" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;height:auto;overflow:hidden;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;background:#0c0d10">
<title id="refusal-cost-en-title">THE COST OF A REJECTED PHONE</title>
<desc id="refusal-cost-en-desc">A rejected phone can make France Identité and then FranceConnect+ unavailable, pushing the user to slower or paid alternatives.</desc>
<rect x="1" y="1" width="358" height="998" rx="16" fill="#0c0d10" stroke="#2b3038"/>
<text x="18" y="38" fill="#f5f6f8" font-size="13.5" font-weight="700">THE COST OF A</text>
<text x="18" y="58" fill="#f5f6f8" font-size="13.5" font-weight="700">REJECTED PHONE</text>
<text x="18" y="82" fill="#8b909b" font-size="8.4">Possible propagation, not automatic damage</text>
<rect x="22" y="106" width="316" height="108" rx="12" fill="#1b1b14" stroke="#f5b13d"/>
<text x="38" y="134" fill="#f5b13d" font-size="10.5" font-weight="700">PHONE</text>
<text x="38" y="160" fill="#f5f6f8" font-size="10">Android 11 or later, NFC present</text>
<text x="38" y="182" fill="#aeb4bf" font-size="8.8">But a security mechanism is judged absent</text>
<path d="M180 214 V240" stroke="#f5b13d" stroke-width="2"/>
<path d="M174 232 L180 242 L186 232" fill="#f5b13d"/>
<rect x="22" y="246" width="316" height="98" rx="12" fill="#21151c" stroke="#ff4d87"/>
<text x="38" y="274" fill="#ff85ad" font-size="10.5" font-weight="700">FRANCE IDENTITÉ UNAVAILABLE</text>
<text x="38" y="300" fill="#f5f6f8" font-size="10">Detailed reason and technical appeal unknown</text>
<text x="38" y="322" fill="#aeb4bf" font-size="8.8">Physical identity remains valid</text>
<path d="M180 344 V370" stroke="#ff4d87" stroke-width="2"/>
<path d="M174 362 L180 372 L186 362" fill="#ff4d87"/>
<rect x="22" y="376" width="316" height="98" rx="12" fill="#101824" stroke="#7aa2f7"/>
<text x="38" y="404" fill="#7aa2f7" font-size="10.5" font-weight="700">FRANCECONNECT+ UNAVAILABLE</text>
<text x="38" y="430" fill="#f5f6f8" font-size="10">The relying service offers another route</text>
<text x="38" y="452" fill="#aeb4bf" font-size="8.8">or the transaction waits for recovery</text>
<path d="M180 474 V500" stroke="#7aa2f7" stroke-width="2"/>
<path d="M174 492 L180 502 L186 492" fill="#7aa2f7"/>
<rect x="16" y="510" width="328" height="286" rx="14" fill="#101319" stroke="#3a4049"/>
<text x="32" y="540" fill="#f5f6f8" font-size="10.5" font-weight="700">PUBLISHED ALTERNATIVES</text>
<rect x="32" y="560" width="296" height="48" rx="8" fill="#15171b" stroke="#4a505a"/>
<text x="44" y="581" fill="#5eead4" font-size="9" font-weight="700">CPF</text>
<text x="92" y="581" fill="#f5f6f8" font-size="8.8">manual check, about 4 weeks</text>
<text x="92" y="598" fill="#8b909b" font-size="7.8">official announced delay</text>
<rect x="32" y="620" width="296" height="48" rx="8" fill="#15171b" stroke="#4a505a"/>
<text x="44" y="641" fill="#7aa2f7" font-size="9" font-weight="700">RENOV’</text>
<text x="92" y="641" fill="#f5f6f8" font-size="8.8">postal check, about 2 weeks</text>
<text x="92" y="658" fill="#8b909b" font-size="7.8">official announced delay</text>
<rect x="32" y="680" width="296" height="48" rx="8" fill="#15171b" stroke="#4a505a"/>
<text x="44" y="701" fill="#f5b13d" font-size="9" font-weight="700">INPI</text>
<text x="92" y="701" fill="#f5f6f8" font-size="8.8">qualified certificate or agent</text>
<text x="92" y="718" fill="#8b909b" font-size="7.8">variable cost and external process</text>
<rect x="32" y="740" width="296" height="40" rx="8" fill="#15171b" stroke="#4a505a"/>
<text x="44" y="765" fill="#ff85ad" font-size="9" font-weight="700">VOTE</text>
<text x="92" y="765" fill="#f5f6f8" font-size="8.8">in-person check and travel</text>
<path d="M180 796 V822" stroke="#aeb4bf" stroke-width="2"/>
<path d="M174 814 L180 824 L186 814" fill="#aeb4bf"/>
<rect x="22" y="830" width="316" height="106" rx="12" fill="#10211f" stroke="#5eead4"/>
<text x="38" y="858" fill="#5eead4" font-size="10.5" font-weight="700">ACTUAL COST TO MEASURE</text>
<text x="38" y="884" fill="#f5f6f8" font-size="9.4">Time, travel, certificate, agent</text>
<text x="38" y="905" fill="#aeb4bf" font-size="8.4">and a deadline potentially missed</text>
<text x="18" y="970" fill="#6f7580" font-size="7.5">Sources: official CPF, France Rénov’, INPI and</text>
<text x="18" y="986" fill="#6f7580" font-size="7.5">Service-Public routes; France Identité. 28 August 2026.</text>
</svg>
<figcaption>The economic risk does not come from the physical identity card. It appears when the rejected device is the key to the fast route.</figcaption>
</figure>

## EU law itself recognises the dependency

[Regulation (EU) 2024/1183](https://eur-lex.europa.eu/eli/reg/2024/1183/oj) contains a provision rarely highlighted in consumer-facing communication.

Article 12b requires designated gatekeepers to provide wallet providers with effective interoperability and free access to the same operating-system, hardware and software features they use for their own services.

In practical terms, Europe recognises that a public wallet may need platform-controlled functions such as:

```text
NFC
Secure components
Biometrics
Key storage
Operating-system interfaces
Distribution and installation
```

That right matters. It limits a gatekeeper’s ability to reserve a critical function for its own wallet.

It does not prove that every dependency has been resolved.

Access to an interface does not automatically answer:

- who controls the cryptographic root;
- which service attests the device;
- what recovery time applies after an outage;
- how an integrity verdict can be challenged;
- how an urgent fix can be distributed without a store;
- how an older phone remains supported;
- who pays after false rejection.

EU law creates a right of access. The investigation must still measure its technical and operational implementation.

## Beyond open source: the trust root

The same regulation requires the source code of application components installed on the phone to be open-source licensed. Limited exceptions remain possible for certain components not installed on the device, where duly justified.

France Titres still says the mobile application code will be published “soon” on its [security page](https://france-identite.gouv.fr/securite-application/).

Publication would allow scrutiny of:

```text
Requested permissions
Network flows
Embedded SDKs
Local credential management
Environment checks
External dependencies
Error-message logic
```

It would not automatically provide control of the layers beneath the code.

A cryptographic key may be generated in:

- Android Keystore;
- a trusted execution environment;
- StrongBox where available;
- an iPhone Secure Enclave.

The server issuing identity then needs evidence that the key is genuinely protected in the claimed environment. That is attestation.

The EU [Wallet Unit Attestation specification](https://github.com/eu-digital-identity-wallet/eudi-doc-standards-and-technical-specifications/blob/main/docs/technical-specifications/ts3-wallet-unit-attestation.md) distinguishes:

- a wallet-instance attestation, proving application integrity;
- a key attestation, describing available cryptographic protection.

The [reference wallet-provider service](https://github.com/eu-digital-identity-wallet/eudi-srv-wallet-provider) can consume an Android Keystore chain and an iOS format based on App Attest. Its own warning says it is built strictly for testing and development and, by default, validates no platform attestations.

That documentation does not automatically describe production France Identité.

It illustrates the underlying issue:

```text
Wallet code
can be public and auditable

Wallet key
can be protected by the phone

Evidence of that protection
may chain to a Google root or an Apple service
```

<figure class="infographic" style="padding-bottom:1.5rem" tabindex="0" aria-label="Two European rights and three practical limits">
<svg viewBox="0 0 360 850" width="100%" role="img" aria-labelledby="rights-limits-en-title rights-limits-en-desc" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;height:auto;overflow:hidden;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;background:#0c0d10">
<title id="rights-limits-en-title">TWO RIGHTS, THREE LIMITS</title>
<desc id="rights-limits-en-desc">EU law requires open code and access to platform features, without by itself proving independent distribution, attestation or remedy.</desc>
<rect x="1" y="1" width="358" height="848" rx="16" fill="#0c0d10" stroke="#2b3038"/>
<text x="18" y="38" fill="#f5f6f8" font-size="13.5" font-weight="700">TWO RIGHTS</text>
<text x="18" y="58" fill="#f5f6f8" font-size="13.5" font-weight="700">THREE LIMITS</text>
<text x="18" y="82" fill="#8b909b" font-size="8.4">The law opens doors, it does not prove the exit</text>
<rect x="22" y="110" width="316" height="126" rx="12" fill="#10211f" stroke="#5eead4"/>
<text x="38" y="138" fill="#5eead4" font-size="10.5" font-weight="700">RIGHT 1: OPEN CODE</text>
<text x="38" y="164" fill="#f5f6f8" font-size="9.6">Wallet application components</text>
<text x="38" y="185" fill="#f5f6f8" font-size="9.6">must be open-source licensed.</text>
<text x="38" y="211" fill="#aeb4bf" font-size="8.4">Article 5a, paragraph 3</text>
<rect x="22" y="256" width="316" height="142" rx="12" fill="#101824" stroke="#7aa2f7"/>
<text x="38" y="284" fill="#7aa2f7" font-size="10.5" font-weight="700">RIGHT 2: ACCESS TO FEATURES</text>
<text x="38" y="310" fill="#f5f6f8" font-size="9.6">Same operating system, hardware</text>
<text x="38" y="331" fill="#f5f6f8" font-size="9.6">and software as gatekeeper services.</text>
<text x="38" y="357" fill="#aeb4bf" font-size="8.4">Effective, free interoperability</text>
<text x="38" y="377" fill="#aeb4bf" font-size="8.4">Article 12b</text>
<text x="22" y="438" fill="#f5f6f8" font-size="10.5" font-weight="700">THESE RIGHTS DO NOT YET PROVE:</text>
<rect x="22" y="462" width="316" height="76" rx="10" fill="#1b1b14" stroke="#f5b13d"/>
<text x="38" y="488" fill="#f5b13d" font-size="9.8" font-weight="700">1. AN INDEPENDENT CHANNEL</text>
<text x="38" y="513" fill="#aeb4bf" font-size="8.6">Publishing and updating without store control</text>
<rect x="22" y="554" width="316" height="92" rx="10" fill="#21151c" stroke="#ff4d87"/>
<text x="38" y="580" fill="#ff85ad" font-size="9.8" font-weight="700">2. A PUBLIC TRUST ROOT</text>
<text x="38" y="605" fill="#aeb4bf" font-size="8.6">Attesting hardware without a platform root</text>
<text x="38" y="624" fill="#aeb4bf" font-size="8.6">or platform-operated service</text>
<rect x="22" y="662" width="316" height="92" rx="10" fill="#15171b" stroke="#4a505a"/>
<text x="38" y="688" fill="#f5f6f8" font-size="9.8" font-weight="700">3. AN IMMEDIATE REMEDY</text>
<text x="38" y="713" fill="#aeb4bf" font-size="8.6">Explaining and correcting a false refusal</text>
<text x="38" y="732" fill="#aeb4bf" font-size="8.6">before a deadline is lost</text>
<text x="18" y="806" fill="#6f7580" font-size="7.7">Source: Regulation (EU) 2024/1183, Articles 5a and 12b.</text>
<text x="18" y="823" fill="#6f7580" font-size="7.7">l0g reading: legal rights versus observable capabilities.</text>
</svg>
<figcaption>Open source and interoperability are strong safeguards. Operational sovereignty also requires controlled distribution, attestation and remedy.</figcaption>
</figure>

## ANSSI assessments define a precise scope

The [Android CSPN report](https://messervices.cyber.gouv.fr/visas/ANSSI-CSPN-2023-22-rapport.pdf) and [iOS report](https://messervices.cyber.gouv.fr/visas/ANSSI-CSPN-2023-21-rapport.pdf) are especially useful because their scope is explicit.

They cover:

```text
Android 1.2.4
and iOS 1.2.3

Developer: Atos France
Sponsor: French Interior Ministry
Evaluation centre: AMOSSYS
```

The evaluated security functions include:

- secure personal-code management;
- secure backend communication;
- secure communication with the identity card;
- generation of an application-legitimacy proof;
- protection of identity data;
- backend authorisation of the mobile application.

The evaluator reviewed the full source code of the products concerned. Android was tested on a Pixel 6a running Android 13 and a rooted Pixel 4a running Android 10. iOS was tested on an iPhone 11 and a jailbroken iPhone X running iOS 16.

Those reports are reassuring for the evaluated versions. They do not, on their own, describe the status of versions distributed in 2026.

The [Android qualification decision no. 791](https://messervices.cyber.gouv.fr/visas/2025_791_np.pdf) and [iOS decision no. 792](https://messervices.cyber.gouv.fr/visas/2025_792_np.pdf), both dated 21 May 2025, extended the scope to version 1.3.X from 1.3.7. They relied on the 2023 CSPN reports and two AMOSSYS assessments of the backend and product. Their level was “elementary” and they were valid until 7 February 2026. The separate certification of the electronic identification means at the “high” assurance level showed the same end date. The iOS decision describes ANSSI-CSPN-2023/21 as a report on version 1.2.4, whereas the public report identifies version 1.2.3. This discrepancy is recorded as an inconsistency in the official corpus, without extrapolation.

On 28 August 2026, the [ANSSI catalogue](https://cyber.gouv.fr/offre-de-service/solutions-certifiees-et-qualifiees/services-de-securite-evalue/decouvrir-les-solutions-certifiees-qualifiees/) published no more recent France Identité decision. The [electronic identification means page](https://cyber.gouv.fr/offre-de-service/solutions-certifiees-et-qualifiees/services-de-securite-evalue/solutions-en-cours-de-qualification/moyens-didentification-electronique-mie/) listed the service among schemes undergoing certification, while France Identité’s own page continued to claim the highest security level. L0g does not infer from this discrepancy that the service is legally invalid. It records that no renewed public decision was found by the collection date.

Six limitations therefore remain visible:

1. the CSPN reports cover exact 1.2 versions;
2. the 2025 decisions did cover 1.3.X from 1.3.7, contrary to what reading the 2023 reports alone might suggest;
3. the iOS decision and its reference report do not give the same 1.2 version number;
4. those decisions displayed an end date of 7 February 2026;
5. the 2023 reports do not establish who develops and maintains production versions distributed in August 2026;
6. the evaluated builds were installed through Firebase invitations as APK or IPA files, not from public stores.

The assessments therefore establish that a legitimacy proof existed and was examined. They do not disclose the current mechanism or the entire production distribution chain.

## Two channels, one platform dependency

### Android: outside-Play distribution is technically possible

Android allows a signed APK to be distributed outside Google Play. [Android documentation](https://developer.android.com/guide/app-bundle/faq) also says that the App Bundle format is open and can be supported by other stores.

France Identité’s site does not offer a public APK or alternative store. This investigation identified no official production channel outside Google Play.

Another question remains open: **who holds the Android production signing key?**

Google offers [Play App Signing](https://developer.android.com/studio/publish/app-signing), which protects and manages the signing key used for APKs distributed through Play. A developer wishing to use the same key across stores can provide its own signing key. France Identité’s exact configuration is not public.

These five issues must therefore be separated:

```text
Technical ability to install an APK
Legal ability to distribute it
Control of the signing key
Backend acceptance of the binary
Operation without Google Play Services
```

An official APK would be a true fallback only if all five were under control.

### iOS: alternative distribution remains Apple-notarised

Within the European Union, Apple permits [distribution through an alternative marketplace or directly from a website](https://developer.apple.com/support/web-distribution-eu/) under specified conditions.

That route still uses:

- the Apple Developer Program;
- App Store Connect;
- an Apple-generated distribution package;
- Apple notarisation;
- iOS installation mechanisms.

Apple says applications distributed outside the App Store must meet [notarisation requirements](https://developer.apple.com/help/app-store-connect/managing-alternative-distribution/submit-for-notarization/). An app identified as known malware can be prevented from launching.

That security protects users. It also confirms that leaving the App Store is not enough to make an iOS application independent of Apple.

## Attestation protects the wallet and creates a power to refuse

Google documents several mechanisms available to developers. One of them, Play Integrity, processes:

- request parameters;
- application package name, version and signing certificate;
- Google Play licence status;
- a key-attestation certificate;
- a device-attestation token;
- optionally, information about the security environment.

Google says those data are encrypted, are not transferred to third parties and are deleted after a fixed retention period. ([Play Integrity documentation](https://developer.android.com/google/play/integrity/terms))

We do not know whether France Identité uses that service.

Android hardware attestation can also produce a certificate chain describing a key stored in a secure environment. Android documentation says that chain can terminate in a Google-held root of trust. ([Android Keystore documentation](https://developer.android.com/identity/digital-credentials/credential-issuer/keystore-attestation))

On Apple devices, App Attest lets a server verify that a key belongs to a genuine app instance. Apple says the private key is stored in the Secure Enclave, where no process can directly read or modify it. Initial attestation contacts an Apple server. Reinstallation, migration or restoration requires a new key. ([Apple App Attest documentation](https://developer.apple.com/documentation/DeviceCheck/establishing-your-app-s-integrity))

We also do not know whether France Identité uses App Attest.

These mechanisms have a legitimate purpose: preventing a counterfeit application or compromised device from receiving sensitive credentials.

They also create a binary decision:

```text
Attestation recognised
→ the backend may continue

Attestation absent or rejected
→ digital identity may become unusable
```

The critical issue is not the control’s existence. It is the absence of a public procedure describing:

- the exact reason shown to the user;
- the actor able to correct the verdict;
- the resolution time;
- the fallback mode;
- who bears the loss.

## Two stores, two privacy declarations

The [French App Store page](https://apps.apple.com/fr/app/france-identit%C3%A9/id1590142959) says “Data Not Collected”. Apple states that this information was supplied by the developer and has not been verified by Apple.

The [Google Play page](https://play.google.com/store/apps/details?id=fr.gouv.franceidentite&hl=fr) says the application may:

- collect personal information;
- collect device or other identifiers;
- share personal information with third parties;
- encrypt data in transit;
- allow users to request deletion.

Those two pages are not directly comparable.

Apple and Google use different definitions, categories and questionnaires. The iOS and Android versions may also have different dependencies. Sharing with a public service required for the feature may be classified differently from advertising collection.

France Identité’s [privacy policy](https://france-identite.gouv.fr/politique-de-confidentialite/confidentialite-fi/) confirms that the SGIN server processes identity-card data, contact data and a mobile-device identifier. It also says the application does not process data for commercial or advertising purposes.

A store table is therefore not enough to accuse either party of a false statement.

What is needed is a common matrix:

```text
Data item
iOS application
Android application
SGIN
Apple
Google
Manufacturer
Purpose
Retention
Recipient
```

That would explain why two official storefronts describe the same identity service so differently.

## Tool: does your phone open your rights?

The cards below are a documentary diagnostic, not a hardware test. They separate public requirements, observed signals and remaining unknowns.

<div class="device-tool" aria-label="Documentary diagnostic of France Identité compatibility">
<details style="margin:1rem 0;border:1px solid #2b3038;border-radius:12px;padding:.9rem 1rem;background:#101319">
<summary style="cursor:pointer;font-weight:700">Android 11 or later, NFC, app working</summary>
<div style="padding-top:.75rem">
<p><strong>Status:</strong> public criteria satisfied and operation observed on the device.</p>
<p><strong>Residual risk:</strong> an operating-system, manufacturer, application or integrity-policy update may change the result.</p>
<p><strong>Keep available:</strong> physical ID, another FranceConnect+ provider where available and the relying service’s alternative procedure.</p>
</div>
</details>

<details style="margin:1rem 0;border:1px solid #2b3038;border-radius:12px;padding:.9rem 1rem;background:#101319">
<summary style="cursor:pointer;font-weight:700">Android 11 or later and NFC, but “security mechanisms missing”</summary>
<div style="padding-top:.75rem">
<p><strong>Status:</strong> documented public signal, not a measured failure rate.</p>
<p><strong>Checks without bypass:</strong> system patches, Play Protect certification, NFC, restart, possible unlocked bootloader, exact model and full message.</p>
<p><strong>Missing information:</strong> the technical error code and the component actually rejected.</p>
<p><strong>Economic exposure:</strong> manual CPF route, France Rénov’ letter, certificate or agent for INPI depending on the procedure.</p>
</div>
</details>

<details style="margin:1rem 0;border:1px solid #2b3038;border-radius:12px;padding:.9rem 1rem;background:#101319">
<summary style="cursor:pointer;font-weight:700">Android without Google services, alternative ROM or unlocked bootloader</summary>
<div style="padding-top:.75rem">
<p><strong>Status:</strong> France Identité compatibility is not generally documented.</p>
<p><strong>Security issue:</strong> an unlocked bootloader or unknown attestation chain may legitimately reduce assurance.</p>
<p><strong>Sovereignty question:</strong> can a secure Android system not recognised by Google reach high assurance through another root?</p>
<p><strong>To test:</strong> installation, first launch, NFC reading and backend recognition on a laboratory device, without bypassing controls.</p>
</div>
</details>

<details style="margin:1rem 0;border:1px solid #2b3038;border-radius:12px;padding:.9rem 1rem;background:#101319">
<summary style="cursor:pointer;font-weight:700">iPhone running iOS 16.6 or later</summary>
<div style="padding-top:.75rem">
<p><strong>Status:</strong> public requirement satisfied, subject to hardware compatibility and security policy.</p>
<p><strong>Dependencies:</strong> App Store for the current public channel; Apple signing, installation and secure-environment mechanisms.</p>
<p><strong>Unknown:</strong> whether France Identité currently uses App Attest.</p>
<p><strong>Partial exit:</strong> alternative EU distribution exists but still relies on App Store Connect and Apple notarisation.</p>
</div>
</details>

<details style="margin:1rem 0;border:1px solid #2b3038;border-radius:12px;padding:.9rem 1rem;background:#101319">
<summary style="cursor:pointer;font-weight:700">No compatible smartphone</summary>
<div style="padding-top:.75rem">
<p><strong>Status:</strong> mobile France Identité unavailable, physical identity remains valid.</p>
<p><strong>Consequence:</strong> access depends on each relying service’s alternative route.</p>
<p><strong>Possible cost:</strong> delay, letter, travel, qualified certificate, agent or phone replacement.</p>
<p><strong>Red line:</strong> lack of a smartphone must not cause the loss of the underlying right.</p>
</div>
</details>
</div>

## The l0g test must separate security from exclusion

A serious investigation will not try to bypass France Identité’s protections. It must measure their effect without compromising a real identity.

The planned device matrix includes:

```text
Recent Google-certified Android
Older but maintained Android 11 device
Android without Google services
Android with unlocked bootloader
Android with alternative ROM
Huawei with or without Google services
IPhone at the minimum version
Recent iPhone
Phone without a configured store account
```

For each device:

```text
App visible in store
Installation permitted
First launch
Message and error code
NFC reading
Identity creation
FranceConnect recognition
FranceConnect+ recognition
Update channel
Offline mode
Support response
```

Modified devices will test whether controls detect non-compliant environments, not how to evade them.

The final article must publish model, OS version, patch level, bootloader state and outcome. A rejected phone must never be called “secure” merely because it looks recent or runs a recent Android version.

## Sovereignty is an exit capability

The word is too often treated as a label. For France Identité, it can be converted into observable tests.

| Capability | Practical test |
|---|---|
| Distribute | Can the State provide the app through an official channel outside Google Play or the App Store? |
| Sign | Who holds the Android and iOS production keys? |
| Update | What deadline applies to a critical fix? |
| Attest | Which root proves application and hardware integrity? |
| Explain | Does the citizen receive the precise cause of rejection? |
| Correct | Can France Titres overturn a false positive without waiting for the manufacturer? |
| Replace | Can another security mechanism be used? |
| Continue | Does the relying service preserve a degraded route? |
| Compensate | Who reimburses the cost of erroneous incompatibility? |

No modern administration will manufacture the processor, modem, screen, operating system and store of every phone. The reasonable objective is not autarky.

It is to know the dependencies, secure access rights, control the keys, test exit routes and protect the citizen when an external layer makes a mistake.

## The answers that should be published

France Titres could remove much of the uncertainty without revealing exploitable secrets.

A public document could specify:

```text
Required security mechanisms
Accepted device families
Minimum patch level
Whether Play Integrity is used
Whether Android Key Attestation is used
Whether App Attest is used
Data sent to Apple or Google
Owner of application-signing keys
Official distribution channels
Error codes and appeals
Rejection rates by cause
Fallback mode and correction times
```

There would be no need to publish precise anti-fraud thresholds or details enabling bypass. Cause categories and an appeal procedure would already make the system far more intelligible.

Apple and Google should also answer questions about availability commitments, metadata retention, correction times and whether a public wallet can use an independent attestation root.

## Method and limitations

This article is based on public sources available on **28 August 2026**: France Titres documentation, App Store and Google Play pages, 2023 CSPN reports, ANSSI decisions and catalogue, the revised eIDAS regulation, Android and Apple documentation, official EUDI reference repositories, Insee and Arcep statistics, and testimonies published on Services Publics+.

The l0g method separates five levels of proof:

```text
ESTABLISHED
Published law, report, statistic or configuration

DECLARED
Statement by France Titres, a platform or a user

INFERRED
Reasonable conclusion drawn from several sources

UNKNOWN
Unpublished information

TO TEST
Behaviour to verify on a controlled device
```

Services Publics+ testimonies are used only to select test scenarios. They cannot measure frequency, market share or liability.

L0g has not observed France Identité network traffic, analysed its production binary, obtained its SBOM, reviewed contracts with Apple or Google, or received confirmation about Play Integrity, App Attest or control of signing keys.

The descriptions of Android attestation, App Attest and the EUDI implementation document available or proposed mechanisms. They do not prove that France Identité currently uses them.

## A public identity must survive its phone

The smartphone gives France Identité security, distribution and usability that a State would struggle to recreate alone. Apple and Google are not an anomaly merely because they are present. They provide industrial infrastructure that the public service uses.

The risk begins when that infrastructure becomes an opaque condition.

A citizen may meet the published requirements, hold a valid identity card and own a recent phone, then receive a refusal they cannot understand, correct or challenge before a deadline. The physical identity remains valid. The fast digital route disappears.

Europe has responded with two powerful principles: open the code and require platform access. Those principles still need to become production capabilities: a fallback channel, controlled keys, explainable attestation, measured compatibility and rapid remedy.

Useful sovereignty is not visible in the flag on the welcome screen.

> **It is measured on the day the State must run, repair or replace its digital identity without asking the citizen to buy another phone to recover their rights.**
