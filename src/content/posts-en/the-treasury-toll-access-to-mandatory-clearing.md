---
title: "The Treasury toll: who controls access to clearing?"
seoTitle: "US Treasury clearing: margin, access and liquidity | l0g"
description: "Mandatory Treasury clearing cuts bilateral risk but concentrates margin and market access among client clearers. Examine costs, capacity and dependency."
pubDate: 2026-07-30T19:20:00+02:00
updatedDate: 2026-07-30T19:20:00+02:00
tags: ["treasuries", "clearing", "liquidity"]
draft: false
sourceArticle: "le-peage-du-tresor-acces-clearing-obligatoire"
sourceUpdatedDate: 2026-07-30T19:20:00+02:00
---

*Beginning December 31, 2026, an additional share of cash Treasury transactions must pass through a clearing house. Repo follows on June 30, 2027. The reform promises less bilateral risk and more netting. It also creates a new gateway: a client that is not a direct member needs an intermediary able to carry its margin, liquidity obligations and, depending on the model, its guarantee. A survey published by DTCC on July 27 describes an industry that is largely prepared, but says only about one-third of responding members expect to offer clearing to clients. That figure does not prove there will be a bottleneck. It identifies where to look for one.*

The Treasury market is familiar ground for l0g. We have examined the leverage in the [basis trade](/en/analysis/the-treasury-basis-trade/), the creation of liquidity in [repo](/en/analysis/repo-the-liquidity-factory/) and the chains of [collateral and rehypothecation](/en/analysis/collateral-and-rehypothecation/). Mandatory clearing is often presented as the regulatory answer to those vulnerabilities. This article examines the answer itself.

The question is not whether central clearing is wholly good or bad. It is more concrete: **who provides access to the system, who ties up the collateral, and who must find the cash when volatility triggers margin calls?**

## The reform does not remove intermediaries

The [rule adopted by the SEC in December 2023](https://www.sec.gov/newsroom/press-releases/2023-247) requires direct participants of a covered clearing agency to submit their eligible Treasury transactions for central clearing. After a one-year delay, compliance dates are **December 31, 2026** for the cash market and **June 30, 2027** for repo. The SEC's [Treasury clearing implementation hub](https://www.sec.gov/featured-topics/treasury-clearing-implementation), updated on July 24, 2026, now lists three clearing agencies registered for Treasuries: FICC, CME Securities Clearing and ICE Clear Credit.

A [central counterparty, or CCP](/en/glossary/ccp/), interposes itself between both sides. It becomes the buyer to every seller and the seller to every buyer. That novation makes it possible to net offsetting positions and reduce direct counterparty exposures. It does not give every fund, foreign bank or asset manager direct access.

At FICC, a firm that cannot become a full-service member may use a **Sponsoring Member** or an **Agent Clearing Member**. The first sponsors a Sponsored Member. The second submits trades for an Executing Firm Customer. In both cases, a regulated intermediary remains between the client and the clearing house.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 390" role="img" aria-label="Risk moves from a bilateral transaction into a chain linking a client, a clearing intermediary and a central counterparty" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="390" fill="#0c0d10"/>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Risk does not disappear, it changes path</text>
  <text x="32" y="60" fill="#8b909b" font-size="12">Simplified view of a trade before and after central clearing.</text>
  <text x="32" y="99" fill="#f5b13d" font-size="12" font-weight="700">BILATERAL</text>
  <rect x="32" y="118" width="190" height="64" rx="8" fill="#15171c" stroke="#5eead4"/>
  <text x="127" y="145" fill="#f5f6f8" font-size="13" text-anchor="middle">Lender / seller</text>
  <text x="127" y="165" fill="#8b909b" font-size="11" text-anchor="middle">fund, bank, MMF</text>
  <line x1="222" y1="150" x2="498" y2="150" stroke="#f5b13d" stroke-width="3"/>
  <polygon points="498,150 486,143 486,157" fill="#f5b13d"/>
  <rect x="498" y="118" width="190" height="64" rx="8" fill="#15171c" stroke="#ff4d87"/>
  <text x="593" y="145" fill="#f5f6f8" font-size="13" text-anchor="middle">Borrower / buyer</text>
  <text x="593" y="165" fill="#8b909b" font-size="11" text-anchor="middle">dealer, hedge fund</text>
  <text x="360" y="137" fill="#8b909b" font-size="10.5" text-anchor="middle">credit, settlement, margin</text>
  <text x="32" y="226" fill="#5eead4" font-size="12" font-weight="700">CENTRAL CLEARING</text>
  <rect x="32" y="245" width="165" height="74" rx="8" fill="#15171c" stroke="#5eead4"/>
  <text x="114" y="272" fill="#f5f6f8" font-size="13" text-anchor="middle">Client</text>
  <text x="114" y="292" fill="#8b909b" font-size="11" text-anchor="middle">fund, bank, MMF</text>
  <text x="114" y="307" fill="#8b909b" font-size="10.5" text-anchor="middle">or hedge fund</text>
  <line x1="197" y1="282" x2="273" y2="282" stroke="#5eead4" stroke-width="3"/>
  <polygon points="273,282 261,275 261,289" fill="#5eead4"/>
  <rect x="273" y="235" width="174" height="94" rx="8" fill="#15171c" stroke="#f5b13d"/>
  <text x="360" y="260" fill="#f5f6f8" font-size="13" text-anchor="middle">Sponsor or agent</text>
  <text x="360" y="281" fill="#f5b13d" font-size="11" text-anchor="middle">margin and liquidity</text>
  <text x="360" y="299" fill="#f5b13d" font-size="11" text-anchor="middle">settlement and fees</text>
  <text x="360" y="317" fill="#f5b13d" font-size="11" text-anchor="middle">model-dependent guarantee</text>
  <line x1="447" y1="282" x2="523" y2="282" stroke="#ff4d87" stroke-width="3"/>
  <polygon points="523,282 511,275 511,289" fill="#ff4d87"/>
  <rect x="523" y="245" width="165" height="74" rx="8" fill="#15171c" stroke="#ff4d87"/>
  <text x="605" y="272" fill="#f5f6f8" font-size="13" text-anchor="middle">CCP</text>
  <text x="605" y="292" fill="#8b909b" font-size="11" text-anchor="middle">novation and netting</text>
  <text x="605" y="307" fill="#8b909b" font-size="10.5" text-anchor="middle">default management</text>
  <text x="32" y="366" fill="#8b909b" font-size="11">Sources: SEC; FICC, Client Clearing Capabilities and Disclosure Framework, 2026.</text>
</svg>
<figcaption>Clearing replaces a bilateral link with a chain. The CCP reduces counterparty risk and nets flows, but the clearing intermediary remains responsible for essential obligations to FICC. The diagram simplifies legally distinct models. Sources: SEC and FICC.</figcaption>
</figure>

## The market says the market is ready

The immediate trigger is the [report published by DTCC on July 27](https://www.dtcc.com/-/media/downloads/FICC-client-survey-report.pdf). In June, FICC surveyed all full-service Netting Members of its Government Securities Division. The response rate was **92%**.

The results describe an advanced transition:

- more than **$1.2 trillion** in cash Treasury activity is already centrally cleared at FICC each day;
- respondents report another **$300 billion to $400 billion** in daily par value not currently submitted for clearing;
- **79%** say they already have the necessary FICC account setups;
- approximately **one-third** expect to offer cash Treasury clearing to clients.

Those four figures do not measure the same thing. The 79% describes respondents' readiness for their own requirements. The one-third concerns firms expecting to become access providers for clients. The proportions cannot be subtracted, and they do not imply that two-thirds of the market will be excluded.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 400" role="img" aria-label="FICC survey results and the OFR estimate of how the mandate would affect centrally cleared repo" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="400" fill="#0c0d10"/>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Mass migration, less visible client capacity</text>
  <text x="32" y="60" fill="#8b909b" font-size="12">Cash: June 2026 FICC survey. Repo: OFR estimate for the first eight months of 2025.</text>
  <text x="32" y="101" fill="#d6d9df" font-size="12">Cash Treasury activity already clearing at FICC</text>
  <rect x="32" y="113" width="560" height="24" fill="#2a2c33"/>
  <rect x="32" y="113" width="420" height="24" fill="#5eead4"/>
  <text x="464" y="130" fill="#5eead4" font-size="12" font-weight="700">&gt; $1.2tn / day</text>
  <text x="32" y="166" fill="#d6d9df" font-size="12">Reported activity still to migrate</text>
  <rect x="32" y="178" width="560" height="24" fill="#2a2c33"/>
  <rect x="32" y="178" width="105" height="24" fill="#f5b13d"/>
  <rect x="137" y="178" width="35" height="24" fill="#f5b13d" opacity="0.45"/>
  <text x="184" y="195" fill="#f5b13d" font-size="12" font-weight="700">$300bn-$400bn / day</text>
  <line x1="32" y1="230" x2="688" y2="230" stroke="#2a2c33"/>
  <text x="32" y="263" fill="#d6d9df" font-size="12">Repo centrally cleared, observed share</text>
  <rect x="32" y="275" width="560" height="22" fill="#2a2c33"/>
  <rect x="32" y="275" width="252" height="22" fill="#7aa2f7"/>
  <text x="604" y="291" fill="#7aa2f7" font-size="12" font-weight="700">45%</text>
  <text x="32" y="324" fill="#d6d9df" font-size="12">Repo cleared if the rule had applied</text>
  <rect x="32" y="336" width="560" height="22" fill="#2a2c33"/>
  <rect x="32" y="336" width="431" height="22" fill="#ff4d87"/>
  <text x="604" y="352" fill="#ff4d87" font-size="12" font-weight="700">77%</text>
  <text x="32" y="386" fill="#8b909b" font-size="10.5">Sources: DTCC/FICC, July 27, 2026; OFR, January 29, 2026. Different scopes and periods.</text>
</svg>
<figcaption>The chart places two measures side by side without combining them. For cash, DTCC reports statements from responding FICC members. For repo, the OFR constructs a no-behavior-change counterfactual. The move from 45% to 77% is not a volume forecast. Sources: DTCC/FICC and OFR.</figcaption>
</figure>

The report has useful limitations. DTCC operates FICC and is presenting its own readiness. It discloses neither the raw number nor the identities of respondents, nor the amount of client capacity each firm will provide. It does not report prices, commercial requirements, rejected onboarding requests or the future concentration of volumes. A 92% response rate makes the survey informative. It does not turn an infrastructure operator's survey of its members into a complete picture of competition.

The one-third figure is therefore a **signal of possible concentration**, not proof of an oligopoly.

## The client clearer carries the hidden bill

FICC documents make the responsibility chain traceable. Under the [Agent Clearing Service](https://www.dtcc.com/ustclearing/-/media/Files/Downloads/Microsites/Treasury-Clearing/FICC-Client-Clearing-Capabilities-for-Treasury-Market-Activity.pdf), the Agent Clearing Member is responsible to FICC for fees, settlement, margin, liquidity obligations and any loss allocation attributed to submitted activity, including client trades.

Under the Sponsored Service, the Sponsoring Member guarantees to FICC the obligations of its Sponsored Members. It also carries Clearing Fund deposits associated with the omnibus account, calculated twice daily on a gross basis. The client retains its own legal obligations, but FICC can look to the sponsor if those obligations are not fulfilled.

This shift has three consequences.

**First, access has a price.** An intermediary mobilizes capital, systems, staff, collateral and liquidity lines. The amount charged to the client may reflect those costs even when netting reduces balance-sheet use elsewhere.

**Second, capacity is not unlimited.** A dealer can be ready for its proprietary activity without accepting every fund seeking client access. It must set limits, manage default risk and forecast stressed margin needs.

**Third, competition cannot be read from account counts.** Three clearing agencies are registered and FICC offers several models. Effective competition will depend on volumes, interoperability, carrying costs and the ability to transfer a client's positions if its intermediary defaults.

## Credit risk becomes a liquidity clock

Central clearing reduces bilateral exposure but imposes a timetable. [Initial margin](/en/glossary/marge-initiale/) protects against a future price move during the closeout of a default. Settlement payments and margin calls require cash at the specified time.

FICC's [Disclosure Framework for the first quarter of 2026](https://www.dtcc.com/-/media/Files/Downloads/legal/policy-and-compliance/FICC-DISCLOSURE-FRAMEWORK-2026-Q1-Marked) says FICC does not rely on routine access to central bank credit in its liquidity planning. If a net-buying member defaults, FICC must still receive the securities and pay the corresponding cash. It draws on liquid resources and can redistribute securities to members through repo under the **Capped Contingency Liquidity Facility**, or CCLF.

An [Office of Financial Research paper](https://www.financialresearch.gov/working-papers/2026/03/05/central-counterparty-management-liquid-prefunded-resources/) explains why this matters especially for physically settled securities and repo. Those CCPs tend to need more liquid resources than some derivatives clearing houses because the full settlement value must move. Credit lines supplied by members distribute that funding requirement, but they also reconnect the resilience of the clearing house to participant liquidity.

On July 1, FICC [lowered from 30% to 10% the buffer parameter](https://www.dtcc.com/-/media/Files/pdf/2026/6/16/GSD-CCLF-Facility-Reset-Reminder-Important-Notice---July-1-2026.pdf) used to size the aggregate GSD CCLF. The same notice says individual caps were reset using needs observed between January and June and all other parameters remained unchanged.

The notice does not show that FICC's total liquidity fell by 20%, nor that the clearing house became less resilient. It does not disclose the aggregate dollar amount before and after recalibration, and the underlying requirement may change. It does show that member-provided liquidity capacity is an active variable in the transition, not a detail settled once and for all.

The Federal Reserve's [May 2026 Financial Stability Report](https://www.federalreserve.gov/publications/files/financial-stability-report-20260508.pdf) provides a reassuring counterpoint. During volatility linked to the conflict with Iran, CCPs raised margins significantly on energy products, with no observed difficulty for participants. The Fed described prefunded resources as high. That is evidence of resilience during that episode, not a test of the future Treasury migration.

## The balance-sheet gain exists, but its size is disputed

The main economic benefit expected from clearing is **multilateral netting**. A dealer lending cash on one side and borrowing it on another can offset more positions when the same CCP is its counterparty.

Using data across all repo segments, the [OFR estimates](https://www.financialresearch.gov/the-ofr-blog/2026/01/29/central-clearing-impact-repo-market/) that **77%** of daily repo would have been centrally cleared during the first eight months of 2025 had the rule applied, compared with an observed **45%**. For six U.S. global systemically important banks, the counterfactual reduces non-netted repo and reverse repo positions by **$207 billion**, or **$34.5 billion per bank on average**.

The calculation assumes transactions and behavior do not change. It is neither a volume forecast nor a profit estimate. A [Federal Reserve research paper](https://www.federalreserve.gov/econres/feds/balance-sheet-netting-in-us-treasury-markets-and-central-clearing.htm), using a different dataset to answer a different question, finds that the effect of clearing on the supplementary leverage ratio should be relatively limited. Some transactions are already structured to net outside a CCP, while others would not automatically become nettable.

Client margin adds another qualification. A [Federal Reserve note on repo](https://www.federalreserve.gov/econres/notes/feds-notes/proportionate-margining-for-repo-transactions-20250214.html) explains that the CCP charges the direct member, not necessarily the end client. The member then sets its own requirements for that client. Clearing may standardize margin at the clearing-house level without immediately standardizing the haircut or price paid by each fund.

## The toll risk is a falsifiable hypothesis

The central hypothesis can be stated without drama: if a limited group of intermediaries concentrates client access, dispersed bilateral risk could be replaced by common dependence on a small number of clearing capacities. Those intermediaries could then influence the price, limits and terms of access to the financial system's most important market.

Several facts prevent that scenario from being presented as established. FICC reports more than **2,850 Sponsored Members** across **66 jurisdictions** and more than **$2.5 trillion** in daily Sponsored Service volume. The Agent Clearing Service is growing. CME Securities Clearing and ICE Clear Credit provide additional options. Finally, one-third of respondents offering the service may be enough capacity if those firms are large, diversified and genuinely competitive.

Five pieces of evidence matter more than the narrative:

1. **The effective concentration of client volume**, by clearing house and intermediary, rather than the number of accounts opened.
2. **Access prices and terms**, including fees, haircuts, margin calls, minimum thresholds and rejected onboarding.
3. **Liquid resources and the CCLF**, including aggregate amounts, tiered member contributions and intraday calls during volatility.
4. **Porting capacity**, meaning whether client positions can actually move quickly after a sponsor or agent defaults.
5. **Market quality around the deadlines**, measured through bid-ask spreads, settlement fails, depth and repo behavior.

The first deadline will test more than whether the software works. It will show whether central clearing produced a more open infrastructure or a more concentrated toll gate.

## Reducing one risk can create a new dependency

Central clearing addresses a real problem. It makes exposures more visible, imposes structured margining and nets flows that currently consume balance sheet. In a market where the [Treasury is issuing at record scale](/en/analysis/record-treasury-auctions-debt-referendum/) and hedge funds rely heavily on repo, those gains can improve resilience.

But the outcome cannot be read from cleared volume alone. A reform can reduce counterparty risk while concentrating operational risk, liquidity and access power. It can free balance sheet in normal conditions and demand more cash at the worst moment. It can protect the clearing house while sending the bill back to the client through its clearing intermediary.

Mandatory clearing is not the end of the collateral story. It is a change of address. Beginning in December, the market must prove that the new vault has enough doors, enough liquidity and enough competitors.

## Sources

1. DTCC/FICC, **Industry Readiness for U.S. Treasury Cash Clearing: A Survey of FICC Membership**, June survey, 92% response rate, volumes, readiness and client offering, July 27, 2026: <https://www.dtcc.com/-/media/downloads/FICC-client-survey-report.pdf>
2. DTCC, **Market Participant Firms Making Significant Progress Toward U.S. Treasury Cash Clearing Deadline**, release accompanying the survey, July 27, 2026: <https://www.dtcc.com/news/2026/july/27/dtcc-survey-firms-progress-toward-us-treasury-clearing-deadline>
3. SEC, **Treasury Clearing Implementation**, rule, compliance dates, guidance, FICC actions and clearing-agency registrations, updated July 24, 2026: <https://www.sec.gov/featured-topics/treasury-clearing-implementation>
4. SEC, **SEC Adopts Rules to Improve Risk Management in Clearance and Settlement and Facilitate Additional Central Clearing for the U.S. Treasury Market**, rule adoption, December 13, 2023: <https://www.sec.gov/newsroom/press-releases/2023-247>
5. SEC, **SEC Extends Compliance Dates and Provides Temporary Exemption for Rule Related to Clearing of U.S. Treasury Securities**, dates moved to December 31, 2026 and June 30, 2027, February 25, 2025: <https://www.sec.gov/newsroom/press-releases/2025-43-sec-extends-compliance-dates-provides-temporary-exemption-rule-related-clearing-us-treasury>
6. FICC, **Client Clearing Capabilities for Treasury Market Activity**, Sponsored and Agent Clearing models and margin, settlement, guarantee and liquidity responsibilities: <https://www.dtcc.com/ustclearing/-/media/Files/Downloads/Microsites/Treasury-Clearing/FICC-Client-Clearing-Capabilities-for-Treasury-Market-Activity.pdf>
7. FICC, **Disclosure Framework for Covered Clearing Agencies and Financial Market Infrastructures**, first quarter of 2026, access, collateral, liquidity, defaults and CCLF: <https://www.dtcc.com/-/media/Files/Downloads/legal/policy-and-compliance/FICC-DISCLOSURE-FRAMEWORK-2026-Q1-Marked>
8. FICC, **CCLF Liquidity Buffer Parameter Adjustment**, notice GOV2174-26, parameter lowered from 30% to 10% on July 1, 2026: <https://www.dtcc.com/-/media/Files/pdf/2026/6/16/GSD-CCLF-Facility-Reset-Reminder-Important-Notice---July-1-2026.pdf>
9. Office of Financial Research, **How Will Central Clearing Impact the Repo Market?**, repo data, clearing counterfactual and estimated balance-sheet effect, January 29, 2026: <https://www.financialresearch.gov/the-ofr-blog/2026/01/29/central-clearing-impact-repo-market/>
10. Office of Financial Research, John Heilbron and Nick Schwartz, **Central Counterparty Management of Liquid and Prefunded Resources**, liquid resources at securities and repo CCPs, March 5, 2026: <https://www.financialresearch.gov/working-papers/2026/03/05/central-counterparty-management-liquid-prefunded-resources/>
11. Federal Reserve, Sriya Anbil, Mark Carlson, Christopher Han and John Wang, **Balance-Sheet Netting in U.S. Treasury Markets and Central Clearing**, FEDS 2024-057, July 2024: <https://www.federalreserve.gov/econres/feds/balance-sheet-netting-in-us-treasury-markets-and-central-clearing.htm>
12. Federal Reserve, Sebastian Infante, R. Jay Kahn, Luke M. Olson and Mary-Frances Styczynski, **Proportionate margining for repo transactions**, February 14, 2025: <https://www.federalreserve.gov/econres/notes/feds-notes/proportionate-margining-for-repo-transactions-20250214.html>
13. Federal Reserve, **Financial Stability Report**, CCP margins and prefunded resources during the energy shock, May 8, 2026: <https://www.federalreserve.gov/publications/files/financial-stability-report-20260508.pdf>
14. CPMI-IOSCO, **Streamlining variation margin in centrally cleared markets: examples of effective practices**, liquidity and predictability of margin calls, January 15, 2025: <https://www.bis.org/cpmi/publ/d226.htm>
