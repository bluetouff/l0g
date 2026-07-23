---
title: "The CLARITY Act under the scalpel: the new architecture of US crypto"
description: "The CLARITY Act text as reported in the Senate runs to 594 pages and in fact contains two laws: a full overhaul of digital-asset regulation and a ban on a central bank digital currency. Its keystone is a maturity test that shifts an asset from the SEC to the CFTC. A section-by-section sectoral impact analysis of the official text: issuers, exchanges, DeFi, stablecoins, banks, and the blind spots. Nothing invented, everything sourced to the text."
pubDate: 2026-07-23T10:56:00+02:00
updatedDate: 2026-07-23T10:56:00+02:00
tags: ["clarity act", "crypto", "regulation", "us politics", "stablecoins"]
draft: false
sourceArticle: "clarity-act-texte-analyse-impact-sectoriel"
sourceUpdatedDate: 2026-07-23
---

*The text exists, and it is massive. The CLARITY Act as reported in the Senate, referenced [H.R. 3633 RS](https://www.congress.gov/119/bills/hr3633/BILLS-119hr3633rs.pdf), runs to 594 pages and carries two official titles: the "Digital Asset Market Clarity Act of 2025" and the "Anti-CBDC Surveillance State Act." This is not a light-touch deregulation, it is the construction of an entire regulatory regime, with registration, mandatory disclosures, custody and anti-money-laundering compliance. Its keystone is one mechanism: a maturity test that decides whether an asset falls to the securities regulator, the SEC, or the commodities regulator, the CFTC. We read the text to draw a sector-by-sector impact analysis, each claim tied to its section. One preliminary point: this reported version does not contain the ethics clause targeting public officials whose negotiation made July's headlines, a separate matter we covered in our piece on [the August countdown](/en/analysis/clarity-act-trump-concedes-ethics-august-countdown/).*

## The maturity test, keystone

The whole scheme rests on a shift of jurisdiction. A token sold to the public through an investment contract remains, at issuance, an ancillary asset under the SEC. But once the blockchain that carries it becomes a "mature blockchain system," the asset qualifies as a "digital commodity" and moves under the CFTC's spot-market jurisdiction. The definition, in Section 104, is deceptively plain: a mature blockchain system is one "not controlled by any person or group of persons under common control." Decentralization thus becomes the legal criterion that reassigns the regulator.

The passage is not automatic. The text creates, in Section 205, a new Section 42 of the Securities Exchange Act organising a **certification**: the issuer of a digital asset files with the SEC an attestation that the blockchain is mature. This is the text's most sensitive point, a self-certification of decentralization, framed by agency oversight but initiated by the issuer. To stop each actor inventing its own definition, Section 105 requires the SEC and the CFTC to define **jointly**, by rulemaking, the key terms, including "mature blockchain system," "decentralized governance system" and the decisive notion of "unilateral authority." The law sets the principle; the real boundary will be drawn by two years of joint rulemaking.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 340" role="img" aria-label="The maturity test that splits a digital asset between the SEC and the CFTC" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="340" fill="#0c0d10"/>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">The maturity test, from securities cop to commodities cop</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Mechanic of Section 104 and new Section 42. Source: H.R. 3633 RS.</text>

  <rect x="270" y="82" width="180" height="46" fill="none" stroke="#7aa2f7" stroke-width="1.5"/>
  <text x="360" y="103" fill="#7aa2f7" font-size="13" font-weight="700" text-anchor="middle">Token issued</text>
  <text x="360" y="120" fill="#8b909b" font-size="11" text-anchor="middle">via investment contract</text>

  <line x1="360" y1="128" x2="360" y2="158" stroke="#8b909b" stroke-width="1"/>
  <text x="360" y="150" fill="#d6d9df" font-size="12" text-anchor="middle">Blockchain under common control?</text>

  <rect x="70" y="176" width="250" height="70" fill="none" stroke="#ff4d87" stroke-width="1.5"/>
  <text x="195" y="200" fill="#ff4d87" font-size="13" font-weight="700" text-anchor="middle">YES: ancillary asset</text>
  <text x="195" y="220" fill="#d6d9df" font-size="12" text-anchor="middle">Regulator: SEC</text>
  <text x="195" y="238" fill="#8b909b" font-size="11" text-anchor="middle">issuance, disclosures, insiders</text>

  <rect x="400" y="176" width="250" height="70" fill="none" stroke="#5eead4" stroke-width="1.5"/>
  <text x="525" y="200" fill="#5eead4" font-size="13" font-weight="700" text-anchor="middle">NO: digital commodity</text>
  <text x="525" y="220" fill="#d6d9df" font-size="12" text-anchor="middle">Regulator: CFTC</text>
  <text x="525" y="238" fill="#8b909b" font-size="11" text-anchor="middle">spot market, registered exchanges</text>

  <line x1="360" y1="270" x2="360" y2="296" stroke="#f5b13d" stroke-width="1.5"/>
  <text x="360" y="288" fill="#f5b13d" font-size="12" text-anchor="middle" font-weight="700">YES → NO: maturity certification (Sec. 42)</text>
  <text x="360" y="318" fill="#8b909b" font-size="11" text-anchor="middle">Terms defined jointly by the SEC and the CFTC (Sec. 105).</text>
</svg>
<figcaption>A token is born under the SEC as an ancillary asset; it migrates to the CFTC once its blockchain is certified "mature," meaning free of common control. The precise dividing line remains to be written by the two regulators. Source: H.R. 3633 RS, Sections 104, 105 and 205.</figcaption>
</figure>

## Issuers: a framed launch ramp

For anyone creating a token, the text opens what years of regulation by enforcement had closed: a legal financing path. Section 202 adds to the Securities Act an issuance exemption letting an issuer raise, on its ancillary asset, up to **$50 million of gross proceeds per calendar year for a period not exceeding four years**, the amount adjusted annually to the Consumer Price Index, or 10% of the total value of outstanding ancillary assets. A retail safeguard accompanies the opening: after an exempt transaction, a purchaser may not hold more than **10%** of outstanding units.

Insiders, for their part, are reined in. Section 104 counts as "affiliated persons" any holder of at least **5%** of the units, any founder and any officer, and Section 204 caps their sales: over any twelve-month period, they may cover only a band between **5% and 20%** of the units acquired. Section 411 adds a notification duty for "control persons" of a system certified mature before any sale. The message to the sector is twofold: financing a token on US soil becomes possible again within a framework, but founders' exit is slowed and watched.

## Exchanges and intermediaries: the federal licence, and its price

The text's operational core is the registration of intermediaries. Title IV creates at the CFTC a full regime for "digital commodity exchanges," "brokers" and "dealers," with custody by qualified custodians (Section 405), product certification for trading and registration of associated persons. Section 106 provides expedited registration and provisional status, so existing players are not frozen while the regime deploys. Title III mirrors this with the SEC's residual role over ancillary assets and the intermediaries that touch them.

The trade-off is real. Section 413 requires the CFTC to issue, within **360 days**, rules on identifying and resolving conflicts of interest "among and across registered entities," naming **vertically integrated market structures**. This is the lesson of the FTX collapse written into law: a platform that combines exchange, brokerage, custody and market-making will have to wall off those functions. For compliant US exchanges, the text offers a long-awaited federal licence; in exchange it imposes a compliance architecture they must fund and document. Title IV as a whole takes effect **270 days** after enactment (Section 414).

## DeFi and developers: the broad exclusion

This is the most industry-friendly part, and the most debated. Section 309 inserts a new Section 15H into the Securities Exchange Act, and Section 409 does the same on the CFTC side: a person is **not subject** to these laws merely for compiling, relaying, sequencing or validating transactions, running a node or an oracle, providing bandwidth, offering an interface to read blockchain data, or developing and publishing software. Validators, node operators, oracle providers, front-ends and developers therefore fall explicitly outside the scope. Section 109 protects non-controlling developers in the same spirit.

The reach is immense for decentralized finance, and that is also where the criticism concentrates. The exclusion hinges on the control test: a truly decentralized protocol escapes regulation, but an actor keeping unilateral authority stays in the net. And it is exactly the definition of that "unilateral authority" and of maturity that the text hands to joint rulemaking. Until it is written, the line between the protected developer and the regulated operator remains a grey zone, and self-certified decentralization feeds the fear of circumvention.

## Stablecoins and banks: docking to GENIUS

On stablecoins, the CLARITY Act reinvents nothing, it docks. Section 104 defines the "permitted payment stablecoin" by reference to the [GENIUS Act](/en/guides/map-genius-act-stablecoin-regulators/), and Section 301 states that such a token may be brokered, traded and custodied by a broker, dealer, alternative trading system or exchange, the SEC having jurisdiction only over the transaction, not the token as a security. The payment stablecoin is thereby confirmed outside the securities scope, extending the logic we described in our analysis of [stablecoins as the marginal buyer of US Treasuries](/en/analysis/stablecoins-the-marginal-buyer-of-us-treasuries/) and of the [bill deluge](/en/analysis/who-buys-the-bill-deluge-us-treasury-marginal-buyer/).

Two provisions complete the institutional picture. Section 310 expressly authorises the custody of digital assets by banking institutions, a green light prudential regulators had long withheld. And Section 110 extends the application of the Bank Secrecy Act, the anti-money-laundering law, to digital-asset intermediaries: regulatory clarity comes paired with compliance duties identical to those of traditional finance. US crypto gains a seat in the banking system, at the price of entering its rules.

## The hidden title: banning a CBDC

The text carries a second title, often overlooked in commentary: the "Anti-CBDC Surveillance State Act." Its Title VI bars the Federal Reserve from issuing a central bank digital currency, directly (Section 602) and indirectly through a financial intermediary (Section 603). This is a major monetary-policy decision lodged in a market-structure law: the United States renounces, by statute, the tool China and others are building, and effectively leaves the digital-dollar field to private stablecoins regulated by the GENIUS Act. The choice is coherent with the whole, but no less consequential for the monetary architecture.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 330" role="img" aria-label="Sectoral impact of the CLARITY Act by type of actor" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="330" fill="#0c0d10"/>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Who wins what, and at what price</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Impact reading of the text by actor. Source: H.R. 3633 RS.</text>

  <text x="40" y="96" fill="#5eead4" font-size="13" font-weight="700">Net winners</text>
  <text x="56" y="118" fill="#d6d9df" font-size="12">DeFi, developers, validators: broad exclusion (Sec. 15H, 409)</text>
  <text x="56" y="138" fill="#d6d9df" font-size="12">Issuers: legal financing path, $50m/year (Sec. 202)</text>
  <text x="56" y="158" fill="#d6d9df" font-size="12">Stablecoins: confirmed outside securities (Sec. 301)</text>
  <text x="56" y="178" fill="#d6d9df" font-size="12">Banks: digital-asset custody authorised (Sec. 310)</text>

  <text x="40" y="212" fill="#f5b13d" font-size="13" font-weight="700">Conditional winners</text>
  <text x="56" y="234" fill="#d6d9df" font-size="12">Exchanges: federal licence, but conflict walls (Sec. 413)</text>
  <text x="56" y="254" fill="#d6d9df" font-size="12">Issuers, insiders: sales capped at 5-20%/year (Sec. 204)</text>

  <text x="40" y="288" fill="#ff4d87" font-size="13" font-weight="700">Relative loser</text>
  <text x="56" y="310" fill="#d6d9df" font-size="12">SEC: cedes the spot market to the CFTC; the Fed forgoes a CBDC (Title VI)</text>
</svg>
<figcaption>The text redistributes power: it widens the space for DeFi and stablecoins, opens a financing ramp for issuers, and shifts the regulatory centre of gravity from the SEC to the CFTC. Exchanges gain a licence against walling-off duties. Source: H.R. 3633 RS.</figcaption>
</figure>

## The blind spots

Rigour requires naming the weaknesses, because they will decide the text's real reach. The first is self-certification of maturity: handing the issuer the initiative to declare its blockchain decentralized, even under agency oversight, creates a hazard critics judge exploitable. The second is the power shift toward the CFTC, a smaller, less-resourced regulator than the SEC, to supervise a spot market it had never had to watch; the text provides dedicated resources, whose sufficiency remains to be shown. The third is the definition calendar: until the SEC and CFTC have jointly written what "unilateral authority" and maturity mean, the promised clarity remains, on paper, a promise. The fourth is political: the ethics clause targeting public officials is absent from this version, and its possible addition on the floor remains the knot we described elsewhere.

## Three dated scenarios

What follows is scenario, not data. In the fast-adoption path, the text is passed before the 7 August recess, with or without a floor ethics amendment, reconciled with the House version, then enacted; Title IV then takes effect about 270 days later, and the first conflict-of-interest rulemaking falls at 360 days. In the blockage path, the text slips past August and runs into the midterm campaign, pushing the workable deadline back by years. In the adoption-without-clarity path, the law passes but bogs down in two years of contested joint rulemaking, so that "clarity" stays theoretical until the definitions settle. Our piece on [the Senate endgame](/en/analysis/clarity-act-trump-concedes-ethics-august-countdown/) tracks that calendar day by day.

## The net effect

At the end of the reading, the net effect comes down to a few lines. The text ends regulation by enforcement by giving issuers a bounded financing path and exchanges a federal licence, it carves a broad exclusion for DeFi and developers, it cements stablecoins as the rails of the private digital dollar by referring them to the GENIUS Act, it brings crypto custody into banks and anti-money-laundering compliance into crypto, and it bans a central bank digital currency by statute. The regulatory centre of gravity slides from the SEC to the CFTC, through a decentralization test on which everything will hinge. The real unknown is no longer whether a framework exists, but how it is scored: the promised clarity will play out over two years of rulemaking, and in how two agencies draw, together, the boundary of control. For the European framework alongside, our guide to [MiCA](/en/guides/decode-mica-crypto-regulation/) offers the point of comparison.

---

**Primary source:** the official text of the [CLARITY Act, H.R. 3633, as reported in the Senate (BILLS-119hr3633rs)](https://www.congress.gov/119/bills/hr3633/BILLS-119hr3633rs.pdf), 594 pages, and its [XML version](https://www.congress.gov/119/bills/hr3633/BILLS-119hr3633rs.xml); [bill page and status on Congress.gov](https://www.congress.gov/bill/119th-congress/house-bill/3633/all-actions). Every claim in this analysis points to a precise section of the text: definitions and maturity test (Sec. 104, 205), joint rulemaking (Sec. 105), issuance exemption (Sec. 202), insider sales (Sec. 204, 411), intermediary registration and custody (Sec. 106, 405), conflicts of interest (Sec. 413), deferred effect (Sec. 414), DeFi exclusion (Sec. 309 and 409, Section 15H), stablecoins (Sec. 301), bank custody (Sec. 310), anti-money-laundering (Sec. 110), CBDC ban (Title VI, Sec. 602 to 604).

**To situate:** our analyses of [the Senate endgame and its scenarios](/en/analysis/clarity-act-trump-concedes-ethics-august-countdown/), of [Trump as the first obstacle to his own law](/en/analysis/clarity-act-trump-conflict-of-interest/) and of [the CLARITY Act, a primer](/en/analysis/the-clarity-act-us-crypto-regulation/); our guides [mapping the GENIUS Act](/en/guides/map-genius-act-stablecoin-regulators/) and [decoding MiCA](/en/guides/decode-mica-crypto-regulation/); our pieces on [stablecoins as marginal buyers](/en/analysis/stablecoins-the-marginal-buyer-of-us-treasuries/) and the [bill deluge](/en/analysis/who-buys-the-bill-deluge-us-treasury-marginal-buyer/). This analysis covers the version reported in the Senate as of 1 June 2026; a text amended on the floor could alter certain provisions, starting with the ethics clause absent from this version.
