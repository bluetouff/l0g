---
title: "Your identity in your phone, 6/8: your identity is free, the proof may be billed"
seoTitle: "FranceConnect+: who pays for digital identity proof? | l0g"
ogTitle: "Your identity is free. The proof may be billed"
ogImage: "/illustrations/news/france-identite-proof-economics-v1.jpg"
description: "FranceConnect+ already produces usage volumes that may support billing. Free wallet, paid proofs, signatures and certificates: who funds digital trust?"
pubDate: 2026-08-28T20:34:00+02:00
updatedDate: 2026-08-28T20:34:00+02:00
tags: ["France Identité", "FranceConnect+", "EUDI Wallet", "digital identity", "trust services", "electronic signature", "payments", "KYC", "DINUM", "France Titres", "financial risk", "investigation"]
draft: false
sourceArticle: "votre-identite-dans-un-telephone-6-votre-identite-est-gratuite-la-preuve-peut-etre-facturee"
sourceUpdatedDate: 2026-08-28T20:34:00+02:00
---

*The citizen clicks a free button. The online service receives an identity at substantial or high assurance level. Nothing appears on the user’s bank statement. Yet the official FranceConnect+ documentation already describes a possible commercial relationship: a private service contracts with private identity providers, usage may be billed according to consumption, and DINUM supplies the relevant volumes.*

*This mechanism proves neither abuse nor a hidden unit fee applied to every login. It shows that an identity provided free to its holder can become a paid service for the organisation that verifies it. When billing occurs, the cost shifts to another party.*

*The future European wallet extends that logic. The Union makes issuance, use and revocation of the wallet free for natural persons. In the same regulation, it defines trust services as electronic services normally provided for remuneration. Between those two rules, a market is taking shape around certificates, attestations, signatures, validation, integration and incident handling.*

*This is part six of the **Your identity in your phone** investigation. Part one followed [France Identité’s data and traces](/en/analysis/your-identity-in-your-phone-1-when-an-id-card-becomes-a-service/). Part two measured [the practical price of opting out](/en/analysis/your-identity-in-your-phone-2-optional-but-at-what-cost/). Part three examined [sovereignty under contract](/en/analysis/your-identity-in-your-phone-3-sovereignty-under-contract/). Part four followed [age as an access credential](/en/analysis/your-identity-in-your-phone-4-age-becomes-an-access-credential/). Part five tested [what happens when digital identity stops responding](/en/analysis/your-identity-in-your-phone-5-when-your-identity-stops-responding/).*

*Version française : [Votre identité est gratuite. La preuve peut être facturée](/posts/votre-identite-dans-un-telephone-6-votre-identite-est-gratuite-la-preuve-peut-etre-facturee/).*

## Key points

- The EUDI regulation requires wallet issuance, use and revocation to be free of charge for natural persons.
- Member States must also provide free mechanisms to verify the authenticity and validity of wallets and registered relying parties.
- Qualified electronic signatures must be available by default and free of charge to natural persons, although Member States may limit free use to non-professional purposes.
- The same regulation defines a trust service as an electronic service normally provided for remuneration. Issuing and validating certificates, signatures, seals, timestamps and attribute attestations can therefore support commercial models.
- FranceConnect+ documentation states that a private service must contract with all available private identity providers. Their use may be billed according to consumption, with DINUM providing the relevant usage volumes.
- Public identity providers are currently free for services. The documentation warns that the model is evolving and that charges may arise in some cases.
- No official page reviewed publishes unit prices, subscription fees, discounts, minimum commitments or the total amount billed.
- FranceConnect+ reports 2.7 million users and 800,000 monthly connections. Another page stated that more than seven million identities were usable in early 2025. These indicators measure different things.
- Two identity providers are available on FranceConnect+: La Poste Digital Identity at substantial assurance level and France Identité at high assurance level.
- The final service should not know which identity provider was used for a specific login. The identity provider should not know which service was visited. Aggregated distributions may still be supplied.
- In sectors already subject to strong authentication, certain private services will have to accept the European wallet at the user’s voluntary request. Microenterprises and small enterprises are exempt.
- The first large-scale EU pilots represented more than €90 million of investment, half co-financed by the Commission. The French Senate estimates the updated total cost of the France Identité programme at €107.4 million.
- Those public investments do not prove the existence of private rents. They make it necessary to separate the collectively funded common layer from services that will later be charged for.

## The free button can already generate an invoice

The [FranceConnect+ partner documentation](https://docs.partenaires.franceconnect.gouv.fr/fs/fs-pilotage/fs-pilotage-facturation/) describes an explicit economic mechanism.

A private relying service wishing to use FranceConnect+ must enter into contracts with all available private identity providers. Use of those identities may be billed according to consumption. When this model applies, DINUM supplies the usage volumes of identity providers for the service concerned.

Public identities are currently free for relying services and do not require a direct contract with their issuer. The same page warns that the model is evolving and that use of public identity providers may carry a cost in some cases.

The [general presentation](https://docs.partenaires.franceconnect.gouv.fr/fs/fs-pilotage/) states that FranceConnect+ itself creates no financial compensation between DINUM and the relying service. Any commercial relationship therefore sits elsewhere: between the service seeking to authenticate a user and the private provider guaranteeing that identity.

None of the documents reviewed supports the claim that **every** FranceConnect+ login generates an invoice. We do not know:

```text
The price per authentication
Whether annual subscriptions exist
Volume discounts
Minimum commitments
Free allowances
Whether failed attempts are billed
What the State may subsidise
The total amount already paid
```

The established fact is narrower but decisive: **the infrastructure can attribute aggregate consumption to a commercial relationship**.

<figure class="infographic" style="padding-bottom:1.5rem" tabindex="0" aria-label="A free click may create several indirect bills">
<svg viewBox="0 0 360 900" width="100%" role="img" aria-labelledby="billing-en-title billing-en-desc" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;height:auto;overflow:hidden;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;background:#0c0d10">
<title id="billing-en-title">ONE FREE CLICK, SEVERAL POSSIBLE PAYERS</title>
<desc id="billing-en-desc">The citizen may not pay for the wallet, while the service, administration or company can bear identity costs and pass them on.</desc>
<rect x="1" y="1" width="358" height="898" rx="16" fill="#0c0d10" stroke="#2b3038"/>
<text x="18" y="40" fill="#f5f6f8" font-size="13.5" font-weight="700">ONE FREE CLICK</text>
<text x="18" y="60" fill="#f5f6f8" font-size="13.5" font-weight="700">SEVERAL POSSIBLE PAYERS</text>
<text x="18" y="82" fill="#8b909b" font-size="8.4">Simplified economics, not a standard invoice</text>
<rect x="22" y="108" width="316" height="104" rx="12" fill="#10211f" stroke="#5eead4"/>
<text x="38" y="136" fill="#5eead4" font-size="10.5" font-weight="700">1. CITIZEN</text>
<text x="38" y="162" fill="#f5f6f8" font-size="10">Uses the wallet or FranceConnect+</text>
<text x="38" y="184" fill="#aeb4bf" font-size="9">No documented direct bill</text>
<path d="M180 212 V240" stroke="#5eead4" stroke-width="2"/>
<path d="M174 232 L180 242 L186 232" fill="#5eead4"/>
<rect x="22" y="246" width="316" height="122" rx="12" fill="#101319" stroke="#7aa2f7"/>
<text x="38" y="274" fill="#7aa2f7" font-size="10.5" font-weight="700">2. ONLINE SERVICE</text>
<text x="38" y="300" fill="#f5f6f8" font-size="10">Bank, platform or public body</text>
<text x="38" y="322" fill="#aeb4bf" font-size="9">Integration, support and possible contracts</text>
<text x="38" y="344" fill="#6f7580" font-size="8.4">The actual price is unpublished</text>
<path d="M180 368 V396" stroke="#7aa2f7" stroke-width="2"/>
<path d="M174 388 L180 398 L186 388" fill="#7aa2f7"/>
<rect x="22" y="402" width="316" height="122" rx="12" fill="#1b1b14" stroke="#f5b13d"/>
<text x="38" y="430" fill="#f5b13d" font-size="10.5" font-weight="700">3. IDENTITY PROVIDER</text>
<text x="38" y="456" fill="#f5f6f8" font-size="10">Guarantees substantial or high assurance</text>
<text x="38" y="478" fill="#aeb4bf" font-size="9">Consumption-based billing is possible</text>
<text x="38" y="500" fill="#6f7580" font-size="8.4">DINUM: aggregate volumes</text>
<path d="M180 524 V552" stroke="#f5b13d" stroke-width="2"/>
<path d="M174 544 L180 554 L186 544" fill="#f5b13d"/>
<rect x="22" y="558" width="316" height="122" rx="12" fill="#171217" stroke="#ff4d87"/>
<text x="38" y="586" fill="#ff85ad" font-size="10.5" font-weight="700">4. FINAL PAYER</text>
<text x="38" y="612" fill="#f5f6f8" font-size="10">Company, public budget or margin</text>
<text x="38" y="634" fill="#aeb4bf" font-size="9">The cost may return through prices,</text>
<text x="38" y="654" fill="#aeb4bf" font-size="9">taxes or reduced margins</text>
<rect x="16" y="724" width="328" height="136" rx="12" fill="#15171b" stroke="#3a4049"/>
<text x="32" y="752" fill="#f5f6f8" font-size="9.5" font-weight="700">WHAT THIS DOES NOT PROVE</text>
<text x="32" y="780" fill="#aeb4bf" font-size="8.5">No unit price, no invoice for every login,</text>
<text x="32" y="799" fill="#aeb4bf" font-size="8.5">and no DINUM commission are established.</text>
<text x="32" y="828" fill="#6f7580" font-size="8">Source: FranceConnect+ partner documentation.</text>
<text x="32" y="846" fill="#6f7580" font-size="8">Reviewed: 28 August 2026.</text>
</svg>
<figcaption>Free use by the citizen shifts the cost to the organisation requesting the proof. The final payer depends on the contract and the service’s economic model.</figcaption>
</figure>

## The limits of the European free-of-charge guarantee

[Regulation (EU) 2024/1183](https://eur-lex.europa.eu/eli/reg/2024/1183/oj?locale=en) establishes several precise free-of-charge guarantees.

For natural persons, Member States must provide free of charge:

- wallet issuance;
- wallet use;
- wallet revocation;
- mechanisms to verify the authenticity and validity of wallets;
- mechanisms allowing users to verify the identity of a registered relying party;
- the ability to sign by default with a qualified electronic signature.

The final guarantee has an important qualification. Member States may limit free qualified signatures to non-professional use by natural persons.

The same regulation defines a **trust service** much more broadly as an electronic service normally provided for remuneration. It includes issuing and validating certificates, creating and validating signatures or seals, preserving them, electronic timestamps and electronic attestations of attributes.

The boundary can be summarised as follows:

| Explicit legal free-of-charge guarantee | No universal free-of-charge guarantee |
|---|---|
| Citizen’s wallet | Private service integration |
| Wallet use and revocation | Professional signature |
| Wallet authenticity validation | Issuance of a qualified attestation |
| Verification of the relying party | Relying-party certificate |
| Non-professional qualified signature | Archiving, support and appeals |

One operation can therefore combine a free function with several commercial services.

A user may present a diploma attestation stored in the wallet without paying. The university, the provider qualifying the attestation, the employer integrating the protocol and the operator handling an appeal may still each bear costs.

## FranceConnect+ produces aggregate volumes

Billing does not necessarily require a named history of individual uses.

The [identity-provider documentation](https://docs.partenaires.franceconnect.gouv.fr/fs/fs-pilotage/fs-pilotage-fi/) sets out two isolation principles:

- the online service should not be able to identify the identity provider used by a person for a particular login;
- the identity provider should not know which services that person accesses.

The relying service may nevertheless obtain an **aggregated** distribution of its connections among identity providers, provided that no specific user access can be identified.

On paper, this allows four properties to coexist:

```text
Individual provider choice
Separation of usage data
Aggregate metering
Contractual billing
```

Billing can therefore be based on volumes without La Poste knowing that a named person opened a specific file, or the bank knowing which identity that person selected for the login.

This separation still depends on real implementation, logs, contracts and the data available to each actor. The article does not infer absolute unlinkability from the documentary principle alone.

<figure class="infographic" style="padding-bottom:1.5rem" tabindex="0" aria-label="FranceConnect+ can measure volumes without exposing each individual passage">
<svg viewBox="0 0 360 920" width="100%" role="img" aria-labelledby="meter-en-title meter-en-desc" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;height:auto;overflow:hidden;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;background:#0c0d10">
<title id="meter-en-title">METER THE MARKET WITHOUT SHOWING EACH PASSAGE</title>
<desc id="meter-en-desc">FranceConnect+ isolates the relying service and identity provider at individual level while allowing aggregate statistics.</desc>
<rect x="1" y="1" width="358" height="918" rx="16" fill="#0c0d10" stroke="#2b3038"/>
<text x="18" y="40" fill="#f5f6f8" font-size="12.8" font-weight="700">METER THE MARKET</text>
<text x="18" y="60" fill="#f5f6f8" font-size="12.8" font-weight="700">WITHOUT SHOWING EACH PASSAGE</text>
<text x="18" y="82" fill="#8b909b" font-size="8.2">FranceConnect+ documentary principle, to be tested</text>
<rect x="22" y="108" width="316" height="100" rx="12" fill="#10211f" stroke="#5eead4"/>
<text x="38" y="136" fill="#5eead4" font-size="10.5" font-weight="700">USER</text>
<text x="38" y="162" fill="#f5f6f8" font-size="10">Chooses an available identity</text>
<text x="38" y="184" fill="#aeb4bf" font-size="9">The service should not impose the choice</text>
<path d="M180 208 V238" stroke="#5eead4" stroke-width="2"/>
<path d="M174 230 L180 240 L186 230" fill="#5eead4"/>
<rect x="22" y="246" width="316" height="128" rx="12" fill="#141a28" stroke="#7aa2f7"/>
<text x="38" y="274" fill="#7aa2f7" font-size="10.5" font-weight="700">FRANCECONNECT+</text>
<text x="38" y="300" fill="#f5f6f8" font-size="10">Authentication intermediary</text>
<text x="38" y="322" fill="#aeb4bf" font-size="9">Passes authorised identity data</text>
<text x="38" y="344" fill="#aeb4bf" font-size="9">Produces required volumes</text>
<path d="M180 374 V404" stroke="#7aa2f7" stroke-width="2"/>
<path d="M174 396 L180 406 L186 396" fill="#7aa2f7"/>
<rect x="22" y="412" width="150" height="158" rx="12" fill="#1b1b14" stroke="#f5b13d"/>
<text x="36" y="440" fill="#f5b13d" font-size="9.8" font-weight="700">IDENTITY</text>
<text x="36" y="458" fill="#f5b13d" font-size="9.8" font-weight="700">PROVIDER</text>
<text x="36" y="486" fill="#f5f6f8" font-size="8.8">Should not know</text>
<text x="36" y="504" fill="#f5f6f8" font-size="8.8">the service visited</text>
<text x="36" y="534" fill="#6f7580" font-size="8">Guarantees assurance</text>
<rect x="188" y="412" width="150" height="158" rx="12" fill="#171217" stroke="#ff4d87"/>
<text x="202" y="440" fill="#ff85ad" font-size="9.8" font-weight="700">ONLINE</text>
<text x="202" y="458" fill="#ff85ad" font-size="9.8" font-weight="700">SERVICE</text>
<text x="202" y="486" fill="#f5f6f8" font-size="8.8">Should not know</text>
<text x="202" y="504" fill="#f5f6f8" font-size="8.8">the identity selected</text>
<text x="202" y="528" fill="#6f7580" font-size="8">Receives authorised</text>
<text x="202" y="546" fill="#6f7580" font-size="8">identity data</text>
<path d="M97 570 V618 H180" stroke="#f5b13d" stroke-width="2" fill="none"/>
<path d="M263 570 V618 H180" stroke="#ff4d87" stroke-width="2" fill="none"/>
<path d="M174 610 L180 620 L186 610" fill="#a78bfa"/>
<rect x="22" y="628" width="316" height="116" rx="12" fill="#181421" stroke="#a78bfa"/>
<text x="38" y="656" fill="#a78bfa" font-size="10.5" font-weight="700">AGGREGATES</text>
<text x="38" y="682" fill="#f5f6f8" font-size="9.5">Distribution of connections over a period</text>
<text x="38" y="704" fill="#aeb4bf" font-size="8.8">Without linking a provider to a named user</text>
<text x="38" y="724" fill="#6f7580" font-size="8.2">Possible basis for consumption billing</text>
<rect x="16" y="790" width="328" height="94" rx="10" fill="#15171b" stroke="#3a4049"/>
<text x="32" y="818" fill="#f5f6f8" font-size="9.2" font-weight="700">AUDIT QUESTION</text>
<text x="32" y="844" fill="#aeb4bf" font-size="8.3">Logs, reporting periods, aggregation</text>
<text x="32" y="862" fill="#aeb4bf" font-size="8.3">thresholds and access to statistics.</text>
</svg>
<figcaption>Data minimisation and infrastructure monetisation are not mutually exclusive. Pricing can be based on aggregate volumes rather than the sale of an individual usage history.</figcaption>
</figure>

## Two providers, two assurance levels

The current concentration is easy to describe.

According to the [FranceConnect documentation](https://docs.partenaires.franceconnect.gouv.fr/fs/fs-pilotage/fs-projet-niveau-eidas/), FranceConnect+ has two identity providers:

- **La Poste Digital Identity**, qualified at substantial assurance level;
- **France Identité**, qualified at high assurance level.

The relying service may request a specific level. If it requests substantial assurance, identities meeting that level or a higher level may be offered. If it requires high assurance, only providers capable of delivering it appear. In the current offering, that requirement may therefore leave France Identité as the only available provider. ([eIDAS assurance parameter](https://docs.partenaires.franceconnect.gouv.fr/fs/fs-technique/fs-technique-eidas-acr/))

It would be excessive to infer a general monopoly. La Poste and France Identité do not deliver the same level, and other means are discussed for the future. The documentation mentions TrustMe as a candidate in discussion and the digital health card as a possible later provider. ([Identity providers](https://docs.partenaires.franceconnect.gouv.fr/fs/fs-pilotage/fs-pilotage-fi/))

The current setup nevertheless creates functional concentration: **a process requiring high assurance currently depends on one provider available through FranceConnect+**.

That concentration affects bargaining power. A private service must preserve user choice and contract with available private providers. It cannot simply hide the more expensive identity. At the same time, requesting high assurance can technically reduce the available choices.

## Three indicators with different scopes

The [DINUM service page](https://www.numerique.gouv.fr/offre-accompagnement/offre-partenaire-franceconnect/) reports:

```text
2.7 million FranceConnect+ users
800,000 connections per month
```

Another documentation page stated that in early 2025, more than **seven million digital identities** were usable through FranceConnect+, with over 100,000 new identities created each month. ([Identity providers](https://docs.partenaires.franceconnect.gouv.fr/fs/fs-pilotage/fs-pilotage-fi/))

These numbers are not necessarily inconsistent. They probably describe:

- a stock of eligible identities;
- people who have already used FranceConnect+;
- a monthly flow of connections.

They should not be added together or treated as identical metrics.

To understand the market, at least the following are missing:

```text
Monthly active users
Successful authentications
Attempts and failures
Public and private share
Substantial and high assurance share
Aggregate split between providers
Connections giving rise to billing
Average price actually paid
```

The contrast with standard FranceConnect merely shows potential scale. DINUM announced **500 million connections in 2025** and 45 million users for that service. FranceConnect remains free for relying services. ([Ten years of FranceConnect](https://www.numerique.gouv.fr/sinformer/espace-presse/10-ans-franceconnect/))

## Europe is creating regulatory demand

The European wallet will not depend only on companies choosing to adopt it.

[Article 5f of the consolidated eIDAS Regulation](https://eur-lex.europa.eu/eli/reg/2014/910/2024-10-18/eng) provides that:

- public services requiring electronic identification must accept European wallets;
- certain private services required by law or contract to use strong authentication must also accept them at the user’s voluntary request;
- the listed areas include transport, energy, banking, financial services, health, social security, telecommunications and education;
- microenterprises and small enterprises are exempt;
- the deadline runs for 36 months after the relevant implementing acts enter into force.

The statement that every company must accept the wallet in 2027 is therefore too broad. The obligation depends on sector, strong-authentication requirements, company size and the legal timetable of the implementing acts.

A service relying on the wallet must also be registered and authenticated. [Implementing Regulation (EU) 2025/848](https://eur-lex.europa.eu/eli/reg_impl/2025/848/oj/eng) provides for access certificates, suspension or cancellation of registration and ten-year retention of information submitted to the registrar. It applies from 24 December 2026.

Those controls are essential to prevent a fake website from requesting attributes while impersonating a bank or public authority. They also create costs:

```text
Registration
Organisation verification
Certificate issuance and renewal
Register operation
Supervision
Ten-year retention
Appeal after suspension
```

The European texts reviewed do not specify which French actor will operate every function or what, if any, fee will apply.

## The value chain may have nine layers

The word “wallet” hides a much larger ecosystem.

| Layer | Function | Possible cost |
|---|---|---|
| Wallet | Store and present credentials | Development, operations, support |
| Identity provider | Guarantee civil identity | Contract, authentication volume |
| Attribute issuer | Certify age, diploma, licence or mandate | Issuance, renewal, validation |
| Authentic source | Confirm official data | API, operations, control |
| Trust service provider | Signature, seal, timestamp, qualified attestation | Per-act price or subscription |
| Relying-party register | Identify authorised organisations | Registration and supervision |
| Relying-party certificate | Authenticate the verifier to the wallet | Issuance and renewal |
| Integrator | Connect a bank, company or public body | Project and maintenance |
| Incident management | Manual review, appeal, evidence and compensation | Support, insurance, staff |

This table does not claim that nine separate bills will be issued for every transaction. It identifies nine cost centres and nine places where an intermediary may earn a margin.

The most important issue concerns attribute attestations. A wallet can hold information produced by a public source, converted into an attestation by a qualified provider and checked by a private company.

The financial question becomes:

> **Who captures value when authentic information maintained with public money is turned into a commercial proof used by a bank, employer or platform?**

Payment may be legitimate. The provider bears security, availability and liability costs. Transparency still requires visibility over the source-data cost, attestation price, margin and the client’s ability to switch provider.

## Payments change the scale

The first major pilot coordinated by France Titres, POTENTIAL, tested bank-account opening and qualified electronic signatures. Its successor, APTITUDE, is experimenting with strong customer authentication and payment initiation. ([POTENTIAL and APTITUDE](https://france-identite.gouv.fr/potential-aptitude/))

The wallet is neither a bank account nor, by itself, a payment method. It may nevertheless intervene at several stages:

```text
Initial KYC
Account login
Sensitive account change
Strong customer authentication
Consent
Payment initiation
Contract signature
```

These uses have very different frequency and economic value.

A bank may accept a relatively high cost to avoid manual account opening, reduce fraud or obtain a qualified signature. The same per-act price becomes much more significant when applied to every login or every payment.

The future model must therefore distinguish rare identity checks from repeated authorisations. A tariff suitable for KYC may be unsuitable for hundreds of millions of recurring transactions.

## One cent multiplied by millions

FranceConnect+ reports 800,000 monthly connections. If that pace remained constant for 12 months, it would represent 9.6 million connections.

Apply three **strictly hypothetical** prices:

<figure class="infographic" style="padding-bottom:1.5rem" tabindex="0" aria-label="Theoretical annual cost sensitivity to a per-connection price">
<svg viewBox="0 0 360 790" width="100%" role="img" aria-labelledby="unit-en-title unit-en-desc" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;height:auto;overflow:hidden;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;background:#0c0d10">
<title id="unit-en-title">ONE CENT MULTIPLIED BY MILLIONS</title>
<desc id="unit-en-desc">Theoretical sensitivity model applied to 9.6 million annual connections, not an estimate of current tariffs.</desc>
<rect x="1" y="1" width="358" height="788" rx="16" fill="#0c0d10" stroke="#2b3038"/>
<text x="18" y="40" fill="#f5f6f8" font-size="13.5" font-weight="700">ONE CENT MULTIPLIED</text>
<text x="18" y="60" fill="#f5f6f8" font-size="13.5" font-weight="700">BY MILLIONS</text>
<text x="18" y="82" fill="#8b909b" font-size="8.4">9.6m annual connections, constant-pace assumption</text>
<rect x="20" y="112" width="320" height="88" rx="12" fill="#15171b" stroke="#3a4049"/>
<text x="36" y="140" fill="#f5f6f8" font-size="10" font-weight="700">FORMULA</text>
<text x="36" y="166" fill="#aeb4bf" font-size="8.8">annual connections × unit price</text>
<rect x="22" y="232" width="316" height="112" rx="12" fill="#10211f" stroke="#5eead4"/>
<text x="38" y="260" fill="#5eead4" font-size="10.5" font-weight="700">€0.01 PER CONNECTION</text>
<text x="38" y="294" fill="#f5f6f8" font-size="20" font-weight="700">€96,000 / YEAR</text>
<text x="38" y="322" fill="#6f7580" font-size="8.3">Mathematical scenario, not an observed tariff</text>
<rect x="22" y="372" width="316" height="112" rx="12" fill="#1b1b14" stroke="#f5b13d"/>
<text x="38" y="400" fill="#f5b13d" font-size="10.5" font-weight="700">€0.05 PER CONNECTION</text>
<text x="38" y="434" fill="#f5f6f8" font-size="20" font-weight="700">€480,000 / YEAR</text>
<text x="38" y="462" fill="#6f7580" font-size="8.3">Mathematical scenario, not an observed tariff</text>
<rect x="22" y="512" width="316" height="112" rx="12" fill="#171217" stroke="#ff4d87"/>
<text x="38" y="540" fill="#ff85ad" font-size="10.5" font-weight="700">€0.10 PER CONNECTION</text>
<text x="38" y="574" fill="#f5f6f8" font-size="20" font-weight="700">€960,000 / YEAR</text>
<text x="38" y="602" fill="#6f7580" font-size="8.3">Mathematical scenario, not an observed tariff</text>
<rect x="16" y="670" width="328" height="86" rx="10" fill="#15171b" stroke="#3a4049"/>
<text x="32" y="698" fill="#f5f6f8" font-size="9.1" font-weight="700">UNKNOWN ON 28 AUGUST 2026</text>
<text x="32" y="724" fill="#aeb4bf" font-size="8.2">Billable share, real price, subscriptions,</text>
<text x="32" y="742" fill="#aeb4bf" font-size="8.2">discounts, failed attempts and public/private split.</text>
</svg>
<figcaption>The chart only illustrates sensitivity to a unit cost. It does not quantify any current revenue of France Identité, La Poste or DINUM.</figcaption>
</figure>

At €0.01 per connection, the theoretical annual cost is €96,000. At €0.10, it approaches €1 million.

These calculations are not an estimate of the current market. The share of connections using a private provider, the applicable contracts and the real price are unknown. They show why a micro-toll should be documented before volumes scale up.

As a reference point, one cent applied to the 500 million connections recorded by standard FranceConnect in 2025 would theoretically represent €5 million. FranceConnect is, however, described as free for relying services. That multiplication must not be presented as real FranceConnect revenue.

## The price of qualification both protects and concentrates

A qualified provider obtains more than a logo.

The [consolidated eIDAS Regulation](https://eur-lex.europa.eu/eli/reg/2014/910/2024-10-18/eng) requires qualified trust service providers to undergo an audit at their own expense at least every 24 months. The supervisory authority may order additional assessments at any time, also at the provider’s expense. The recent European framework also requires an annual surveillance conformity assessment for each evaluated qualified trust service. ([Implementing Regulation 2025/2162](https://eur-lex.europa.eu/eli/reg_impl/2025/2162/oj/eng))

Qualified status also strengthens the victim’s position. When a qualified provider causes damage through non-compliance, its intention or negligence is presumed unless it proves otherwise. With a non-qualified provider, more of the burden lies on the claimant. ([Article 13 eIDAS](https://eur-lex.europa.eu/eli/reg/2014/910/2024-10-18/eng))

Those requirements justify part of the price:

```text
Audit
Cybersecurity
Continuity
Evidence retention
Legal work
Insurance
Support
Liability
```

They also create fixed costs that may favour operators already serving banking, public-sector or industrial clients.

[ANSSI lists](https://cyber.gouv.fr/reglementation/reglementation-identite-confiance-numerique/securite-echanges-voie-electronique/reglement-eidas/obtenir-certificat-signature-electronique/) several providers commercialising qualified signature certificates, including CertEurope, Certigna, Certinomis, ChamberSign France, Datasure, DocuSign France, Universign, Vialink, Goodflag and Cegedim. That list illustrates an existing digital-trust market. It does not predict which companies will issue wallet attestations in the future.

Competition will therefore not be measured only by the number of companies on a list. Relevant questions include:

- how many hold the exact required qualification;
- how many can handle national-scale volumes;
- how many rely on the same assessors or subcontractors;
- how many can withstand falling unit prices;
- how many offer genuine reversibility to clients.

## Public money is already funding the common layer

Building digital identity already requires substantial public budgets.

The [French Senate’s 2026 budget report](https://www.senat.fr/rap/l25-139-32/l25-139-32_mono.html) estimates the updated total cost of the France Identité programme at **€107.4 million**, mainly excluding staff expenditure, with €16.22 million in payment appropriations planned for 2026.

That figure covers the overall programme. It is neither the cost of the mobile app alone, nor a payment to one contractor, nor revenue already produced by authentications.

At EU level, the first four large-scale pilots involved more than 250 public and private organisations and represented more than **€90 million of investment**, with 50% co-financing from the Commission. ([European Commission](https://digital-strategy.ec.europa.eu/en/news/eu-digital-identity-4-projects-launched-test-eudi-wallet))

In France, France Titres announced in May 2026 that more than **80 organisations** had signed a memorandum of understanding to accelerate wallet adoption. The agency committed to informing businesses about standards and incorporating their feedback on market needs. ([France Identité memorandum](https://france-identite.gouv.fr/actualite/memorandum_entente.html))

Public-private cooperation can accelerate interoperability and prevent the construction of unusable systems. It also makes the allocation of value worth documenting.

For each component, the investigation must ask:

```text
Who funded initial development?
Who owns the code and rights?
Who pays recurring operations?
Who bills usage?
Who keeps the margin?
Who bears the cost of errors?
Can the client switch provider?
```

Public funding of a common layer does not prevent commercial services from being built around it. It makes transparency over access and reuse conditions more important.

## The hidden cost of false refusals

The cost of an identity system does not end with successful authentication.

A complete model must include:

```text
Failed attempts
Poor data matching
Manual review
Support contacts
Proof re-issuance
Appeals
Undetected fraud
Legitimate transactions refused
Possible compensation
```

A five-cent login can become expensive if 2% of users require several minutes of human processing. Conversely, a more expensive proof can be profitable if it replaces manual KYC and reduces fraud.

Liability is also fragmented. A refusal may originate from:

- the authentic source;
- the identity provider;
- FranceConnect+;
- the final service;
- an anti-fraud rule;
- defective integration.

The citizen should not have to reconstruct that chain to obtain correction. The organisation purchasing the proof should know from its contract the resolution time, incident evidence, liability cap and appeal procedure.

Public documents do not state whether failures are billed, who pays for manual review or whether contractual penalties can fund compensation for an affected user.

## l0g tool: the price of proof

The model below uses no value presented as a real tariff. It identifies the information a public body, bank or SME should demand before signing a contract.

<details>
<summary><strong>Scenario 1: high-volume public body</strong></summary>

```text
Annual cost = integration
              + operations
              + billable volume × unit price
              + failures × review cost
              + incidents and support
```

Document: budget funding, private-provider prices, internal DINUM cost, retention period, fallback channel, continuity and whether the original filing date survives an identity error.

</details>

<details>
<summary><strong>Scenario 2: bank</strong></summary>

Separate at least:

```text
Initial KYC
Account login
Bank-detail change
Strong authentication
Payment initiation
Contract signature
```

The relevant indicator is not merely price per act. It must be compared with manual KYC cost, fraud avoided, conversion rates and the damage caused by a false refusal.

</details>

<details>
<summary><strong>Scenario 3: SME connected through an integrator</strong></summary>

Ask before signing:

```text
Setup fee
Minimum subscription
Overage price
Billing of failures
Support cost
Commitment period
Exit deadline
Portability of logs and evidence
```

Low consumption does not guarantee low cost when fixed charges dominate.

</details>

<details>
<summary><strong>Scenario 4: attribute attestation</strong></summary>

For a diploma, licence or professional status, separate:

```text
Public-source cost
Issuer cost
Validation cost
Relying-party certificate cost
Archiving cost
Correction cost
```

A free record can become a paid attestation when a provider assumes qualification and liability.

</details>

<details>
<summary><strong>The ten minimum questions</strong></summary>

1. Which event triggers a bill?
2. Are failed attempts charged?
3. Is there an annual minimum?
4. What volume discount applies?
5. Who pays for manual review?
6. Who owns the logs?
7. What correction time is guaranteed?
8. What liability cap applies?
9. How does the client switch provider?
10. Which cost ultimately reaches the citizen or customer?

</details>

## Three market models remain possible

### A low-marginal-cost public common layer

France Identité and public authentic sources provide essential proofs without usage charges. Companies mainly pay for integration and additional features. Competition focuses on value-added services.

### A paid and competitive trust market

The citizen pays nothing directly. Companies pay providers for attestations, signatures and guarantees. Prices are transparent, several operators are available, portability works and liability is insurable.

### A chain of micro-tolls

Every layer charges for its own act: identity, attribute, certificate, signature, validation, archiving, support and appeal. Large companies negotiate discounts, smaller ones use integrators, and a handful of operators concentrate qualifications.

The public record available on 28 August 2026 does not establish which scenario will prevail. It does show that the second layer, B2B billing linked to consumption of private identities in FranceConnect+, already exists in the official model.

## The numbers that should be published

Minimum transparency should cover:

```text
Number of connected private services
Number of public bodies concerned
Connections by assurance level
Share of private providers
Acts giving rise to billing
Aggregate amounts billed
Average price after discounts
Minimum commitments
Failure rate
Appeal cost
Provider-switching time
Incidents and compensation
```

These data can be published in aggregate without exposing individual use.

DINUM could also publish a redacted standard contract, pricing principles, the definition of a billable act and the rules expected to apply to public providers. France Titres could clarify the business model planned for attestations in the French wallet and access to authentic sources.

## Method and limitations

This article relies on public documents available on **28 August 2026**: the revised eIDAS Regulation, EU implementing acts, FranceConnect+ partner documentation, DINUM publications, France Titres pages, the French Senate budget report and ANSSI documentation.

The l0g method separates five evidence levels:

```text
ESTABLISHED
Official text, contract or statistic

DECLARED
Statement by an authority or provider

INFERRED
Reasonable conclusion from several documents

UNKNOWN
Information not published

TO BE TESTED
Operation requiring production evidence
```

The €0.01, €0.05 and €0.10 models are sensitivity calculations. They are not observed tariffs or estimates of revenue for La Poste, France Identité or DINUM.

At this stage, l0g has not obtained commercial contracts between relying services and identity providers, invoices, price schedules, discounts, billable volumes or internal operating costs. Any conclusion about margins would be premature.

## The price of trust must become visible

High-assurance identity is expensive. Providers must verify people, secure keys, audit systems, monitor incidents, maintain interfaces, preserve evidence and bear liability. Treating every payment as a rent would be as weak as treating every free service as costless.

The democratic issue begins when the price remains invisible while use becomes structural.

The European wallet must be free for its holder. Companies in certain sectors will progressively have to accept it. Trust services are, by definition, normally remunerated. FranceConnect+ already has a mechanism of contracts, consumption and aggregate volumes.

The question is no longer whether a market will exist.

It is whether that market will operate as an open, competitive and reversible infrastructure, or as a chain of tiny tolls that nobody sees separately but everyone eventually pays.

> **For every euro spent to prove an identity, who bills, who pays, who bears the error and who keeps the margin?**
