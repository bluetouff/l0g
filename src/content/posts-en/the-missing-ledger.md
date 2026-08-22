---
title: "The missing ledger"
seoTitle: "Synapse collapse: the missing BaaS ledger | l0g"
ogTitle: "Synapse: when the ledger no longer proves who owns what"
description: "Synapse froze access to thousands of customers' funds. An investigation into the failed BaaS ledger and the unfinished regulatory response."
pubDate: 2026-07-30T22:24:40+02:00
updatedDate: 2026-07-30T22:24:40+02:00
tags: ["international", "banks", "fintech", "risk", "United States"]
draft: false
sourceArticle: "synapse-baas-grand-livre-manquant"
sourceUpdatedDate: 2026-07-30T22:24:40+02:00
---

*In spring 2024, thousands of Americans lost access to money they had entrusted to financial apps. Some could no longer pay their rent, mortgage, food or medical bills. Yet no bank had failed. The broken link was Synapse, a technology intermediary whose name many end customers had never even heard.*

The case was neither a simple outage nor a hack. According to the [complaint filed by the Consumer Financial Protection Bureau (CFPB) in August 2025](https://files.consumerfinance.gov/f/documents/cfpb_synapse-financial-technologies_complaint_2025-08.pdf), Synapse failed to maintain reliable records showing where funds were held and failed to ensure that its records reconciled with those of its partner banks. Collectively, those banks held between **$60 million and $90 million less** than the amounts shown in Synapse's data. That range is an estimate of an accounting shortfall, not proof that a specific sum was stolen.

The bankruptcy exposes a blind spot in [banking as a service](/glossaire/#baas): an interface can look like a bank, display the name of an insured bank and offer banking functions even though the company visible to the customer is not itself a bank. Several companies, several contracts and, above all, several ledgers then sit between the screen and the deposit.

## A bank built in layers

Synapse supplied the software connecting non-bank financial platforms to the institutions that held deposits, issued cards and processed transfers. The CFPB describes it as a bridge between those two worlds. From 2023, its cash-management programme made the structure still more complex: funds could pass through Synapse Brokerage and then be distributed among several partner banks.

Some deposits were held in [FBO accounts](/glossaire/#compte-fbo), meaning *for the benefit of*. These omnibus accounts pool money belonging to many beneficiaries. The bank sees the account and its aggregate balance; assigning each fraction to its owner depends on detailed records. In the Synapse arrangement, the intermediary had to track movements among several banks and reconcile its data with theirs.

This architecture is not inherently fraudulent. It can reduce the cost of accessing financial services and allow a bank to distribute its products through several interfaces. It nevertheless creates a critical dependency: if the ledgers stop reconciling, the balance displayed by the app is not enough to establish where each dollar is held.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 390 390" role="img" aria-labelledby="synapse-stack-title-en synapse-stack-desc-en" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;max-width:560px;height:auto;margin:0 auto;font-family:ui-monospace,monospace">
  <title id="synapse-stack-title-en">The three layers of the Synapse model</title>
  <desc id="synapse-stack-desc-en">The platform provides the interface, Synapse transmits instructions and maintains individual records, while banks hold deposits and execute payments.</desc>
  <rect width="390" height="390" fill="#0c0d10"/>
  <text x="18" y="31" fill="#f5f6f8" font-size="14" font-weight="700">The visible account is only one layer</text>
  <text x="18" y="53" fill="#9ca3af" font-size="10.5"><tspan x="18" dy="0">Each actor holds part of the information</tspan><tspan x="18" dy="14">and responsibility.</tspan></text>
  <rect x="18" y="86" width="354" height="66" rx="4" fill="#5eead4"/>
  <text x="32" y="110" fill="#0c0d10" font-size="12.5" font-weight="700">1. Financial platform</text>
  <text x="32" y="131" fill="#0c0d10" font-size="10.5">customer interface, displayed balance,</text>
  <text x="32" y="145" fill="#0c0d10" font-size="10.5">payment instructions</text>
  <path d="M195 152v16" stroke="#d6d9df" stroke-width="2"/>
  <path d="M190 163l5 6 5-6" fill="none" stroke="#d6d9df" stroke-width="2"/>
  <rect x="18" y="170" width="354" height="66" rx="4" fill="#ff4d87"/>
  <text x="32" y="194" fill="#0c0d10" font-size="12.5" font-weight="700">2. Synapse</text>
  <text x="32" y="215" fill="#0c0d10" font-size="10.5">instructions, movement tracking,</text>
  <text x="32" y="229" fill="#0c0d10" font-size="10.5">user-level records</text>
  <path d="M195 236v16" stroke="#d6d9df" stroke-width="2"/>
  <path d="M190 247l5 6 5-6" fill="none" stroke="#d6d9df" stroke-width="2"/>
  <rect x="18" y="254" width="354" height="66" rx="4" fill="#7aa2f7"/>
  <text x="32" y="278" fill="#0c0d10" font-size="12.5" font-weight="700">3. Partner banks</text>
  <text x="32" y="299" fill="#0c0d10" font-size="10.5">omnibus deposits, cards, ACH transfers</text>
  <text x="32" y="313" fill="#0c0d10" font-size="10.5">and other payments</text>
  <rect x="18" y="338" width="354" height="38" rx="4" fill="#15181e" stroke="#f5b13d"/>
  <text x="30" y="354" fill="#f5b13d" font-size="10" font-weight="700">CENTRAL RISK</text>
  <text x="30" y="369" fill="#d6d9df" font-size="10">diverging records prevent balance allocation</text>
</svg>
<figcaption>Simplified representation based on the CFPB complaint. The exact role of each bank varied by platform and programme. Source: CFPB, August 2025.</figcaption>
</figure>

## When the ledger stops being authoritative

The problem predated the bankruptcy. The CFPB complaint alleges that by September 2023 at the latest, Synapse and Evolve Bank & Trust already knew that the intermediary's data showed several tens of millions of dollars more than the funds held by Evolve. The two companies publicly blamed each other for the discrepancy, which remained disputed when the complaint was filed in 2025.

Synapse filed for Chapter 11 protection on **22 April 2024**. In May, its operations deteriorated and then stopped. The company ceased providing certain data to at least one bank and no longer maintained its access to the dashboard showing balances and transactions. After a bankruptcy trustee was appointed, discrepancies with several partner banks became apparent.

The banks then had to reconcile sets of records that no longer agreed. Some took months to determine how much to return to each customer. The CFPB says thousands of consumers remained unable to access their funds for weeks or months and that, more than a year after operations stopped, many still had not recovered the full balance displayed by their platform.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 390 360" role="img" aria-labelledby="synapse-timeline-title-en synapse-timeline-desc-en" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;max-width:560px;height:auto;margin:0 auto;font-family:ui-monospace,monospace">
  <title id="synapse-timeline-title-en">Documented timeline of the Synapse case</title>
  <desc id="synapse-timeline-desc-en">From the discrepancy known in September 2023 to the compensation allocation in November 2025, followed by the regulatory status verified in July 2026.</desc>
  <rect width="390" height="360" fill="#0c0d10"/>
  <text x="18" y="31" fill="#f5f6f8" font-size="16" font-weight="700">From warning to compensation</text>
  <line x1="32" y1="65" x2="32" y2="235" stroke="#39404a" stroke-width="3"/>
  <circle cx="32" cy="68" r="6" fill="#f5b13d"/>
  <text x="52" y="64" fill="#f5b13d" font-size="11" font-weight="700">09/2023</text>
  <text x="145" y="64" fill="#d6d9df" font-size="10.5">gap known to Synapse and Evolve</text>
  <circle cx="32" cy="110" r="6" fill="#ff4d87"/>
  <text x="52" y="106" fill="#ff4d87" font-size="11" font-weight="700">22/04/2024</text>
  <text x="145" y="106" fill="#d6d9df" font-size="10.5">Chapter 11 filing</text>
  <circle cx="32" cy="152" r="6" fill="#ff4d87"/>
  <text x="52" y="148" fill="#ff4d87" font-size="11" font-weight="700">05/2024</text>
  <text x="145" y="148" fill="#d6d9df" font-size="10.5">operations stop</text>
  <circle cx="32" cy="194" r="6" fill="#7aa2f7"/>
  <text x="52" y="190" fill="#7aa2f7" font-size="11" font-weight="700">12/09/2025</text>
  <text x="145" y="190" fill="#d6d9df" font-size="10.5">CFPB judgment</text>
  <circle cx="32" cy="236" r="6" fill="#5eead4"/>
  <text x="52" y="232" fill="#5eead4" font-size="11" font-weight="700">28/11/2025</text>
  <text x="145" y="232" fill="#d6d9df" font-size="10.5">$46.25m allocated</text>
  <rect x="18" y="265" width="354" height="70" rx="4" fill="#15181e" stroke="#39404a"/>
  <text x="30" y="286" fill="#f5f6f8" font-size="11.5" font-weight="700">STATUS ON 30 JULY 2026</text>
  <text x="30" y="306" fill="#d6d9df" font-size="10">CFPB: Synapse absent from active distributions</text>
  <text x="30" y="323" fill="#d6d9df" font-size="10">FDIC: no final text published for proposed rule</text>
  <text x="18" y="352" fill="#8b909b" font-size="9">Allocation ≠ payment · proposal ≠ rule in force</text>
</svg>
<figcaption>Timeline built from the CFPB complaint and judgment, the Civil Penalty Fund page and the Federal Register. A fund allocation opens a distribution process whose duration varies by case.</figcaption>
</figure>

## Insurance limited to bank failure

The FDIC wording visible in some apps was not a promise of reimbursement against every failure. Federal insurance covers deposits held at an insured bank when **that bank** fails. A non-bank intermediary is never itself FDIC-insured.

In an omnibus account, [pass-through insurance](/glossaire/#assurance-pass-through) may treat beneficiaries as if they held their deposits directly with the bank. Among other conditions, the custodial relationship must be properly documented and the identity and share of each beneficiary must be established. It covers neither the bankruptcy of a fintech nor that of a technology provider, nor a loss caused by defective records while the deposit-taking bank remains open.

The [FDIC reminded users of financial apps](https://www.fdic.gov/consumer-resource-center/2024-06/banking-third-party-apps) of that distinction after Synapse stopped operating: coverage begins only when funds reach an insured bank and does not protect against the insolvency or bankruptcy of the non-bank company. The logo could therefore accurately describe the partner bank while leaving the customer unprotected against the risk that materialised.

## Responsibility does not stop at the middleware

Synapse was responsible for maintaining individual records and tracking funds. Banks were not thereby relieved of their duty to supervise their partners. On 14 June 2024, the [Federal Reserve took enforcement action against Evolve](https://www.federalreserve.gov/newsevents/pressreleases/enforcement20240614a.htm) after examinations conducted in 2023 identified unsafe practices and an inadequate risk-management framework for its fintech partnerships. The order requires stronger oversight of those relationships, recordkeeping and compliance with consumer-protection rules.

The Fed states that this action is **independent** of the Synapse bankruptcy. It documents supervisory weaknesses at a partner bank but does not allow the entire $60 million to $90 million discrepancy to be attributed to Evolve alone. Several questions remain unresolved: the exact distribution of the shortfall among programmes, the portion attributable to erroneous entries rather than missing funds, and the final amount recoverable by each customer.

That caution is essential. The $90 million figure is the upper bound of the CFPB estimate, not an amount conclusively shown to have "vanished". Evolve and Synapse accused each other, and the complaint notes that their dispute remained unresolved. A rigorous investigation must preserve that uncertainty instead of turning a reconciliation failure into a criminal conclusion.

## $46.25 million allocated, not yet distributed

The CFPB brought proceedings against Synapse on **21 August 2025**. The court entered the stipulated judgment on **12 September 2025**. Among other provisions, it prohibits the sale of customer data and imposes a symbolic civil penalty of **$1**, which was necessary for the Bureau to use its Civil Penalty Fund for harmed consumers.

On **28 November 2025**, the fund administrator [allocated $46,248,291 to Synapse victims](https://www.consumerfinance.gov/enforcement/payments-harmed-consumers/civil-penalty-fund/). The money comes from civil penalties paid to the CFPB and pooled across cases; it is not funded by taxes. It should not be compared mechanically with the gross $60 million to $90 million discrepancy because the fund compensates remaining harm after accounting for money already returned or expected from other sources.

An allocation is not a transfer. The CFPB explains that it sets money aside and then begins identifying eligible consumers and calculating payments. As of **30 July 2026**, Synapse did not appear on the [list of ongoing or completed distributions](https://www.consumerfinance.gov/enforcement/payments-harmed-consumers/payments-by-case/), updated on 10 July. The Bureau says that when a case is absent from that page, distribution may not have started. Victims cannot submit a claim on their own unless the CFPB later opens a claims process.

## A regulatory remedy still unfinished

On 17 September 2024, the FDIC approved a proposed rule covering custodial deposit accounts with transactional features. Published in the Federal Register on 2 October under **RIN 3064-AG07**, it would require covered banks to:

- maintain a record identifying each beneficiary and their balance;
- reconcile that record with the account balance every day;
- retain direct and continuous access to data entrusted to a third party;
- submit systems and controls to independent validation.

The measure addresses the precise point of failure exposed by Synapse: a bank could no longer depend on a provider to know how funds should be allocated without itself holding an accessible and verifiable record. The proposal also clearly distinguishes deposit insurance from the risk of bankruptcy, fraud or theft at a non-bank company.

Its status must nevertheless be described precisely. The FDIC [withdrew several other proposals on 3 March 2025](https://www.fdic.gov/board/federal-register-notice-withdrawal-proposed-rules-march-3-2025), but not this one. A [Federal Register search for RIN 3064-AG07](https://www.federalregister.gov/api/v1/documents.json?per_page=100&conditions%5Bregulation_id_number%5D=3064-AG07), checked on 30 July 2026, returns only two documents: the proposed rule of 2 October 2024 and the extension of its comment period on 20 November. No final rule or withdrawal is published there. The rule therefore remains proposed, not in force.

## The risk to identify before depositing money

Synapse does not show that every BaaS service is dangerous. The case shows that an apparently simple product can depend on a chain the customer cannot see and that deposit insurance does not cover every link in that chain.

Before entrusting emergency savings to a non-bank app, four questions reduce the ambiguity:

1. **Which entity legally holds the deposit?** The name of the insured bank should be explicit, not merely represented by a logo.
2. **Have the funds already reached the bank?** The FDIC does not cover money before it arrives at an insured institution.
3. **Who maintains the individual ledger?** An omnibus account requires knowing who keeps beneficiary-level records and how frequently they are reconciled.
4. **What does the contract provide if the intermediary stops operating?** Continuity of access to data matters as much as the insurance promise.

To assess the strength of the institution that actually holds the deposits, the [guide to reading a bank's financial health](/en/guides/read-bank-health/) complements this operational review. To place Synapse within the growth of institutions outside the traditional banking perimeter, see also the analysis of [shadow banking and non-bank intermediation](/en/analysis/shadow-banking-nonbank-intermediation/).

The ledger was not merely a technical component. It was the economic evidence connecting displayed balances to actual deposits. Once that evidence stopped being reliable, the interface, the contract and the FDIC seal were not enough. The Synapse lesson follows a clear hierarchy: a promise of safety is worth only as much as the records that can still establish precisely who owns what.

---

### Primary sources

- [CFPB, action against Synapse Financial Technologies, 21 August 2025, judgment of 12 September 2025](https://www.consumerfinance.gov/enforcement/actions/synapse-financial-technologies-inc/)
- [CFPB, complaint in the Synapse bankruptcy proceedings, 21 August 2025](https://files.consumerfinance.gov/f/documents/cfpb_synapse-financial-technologies_complaint_2025-08.pdf)
- [Federal Reserve, enforcement action against Evolve Bancorp and Evolve Bank & Trust, 14 June 2024](https://www.federalreserve.gov/newsevents/pressreleases/enforcement20240614a.htm)
- [FDIC, protection of funds entrusted to a non-bank financial app, June 2024](https://www.fdic.gov/consumer-resource-center/2024-06/banking-third-party-apps)
- [Federal Register, proposed rule, "Recordkeeping for Custodial Accounts", 2 October 2024](https://www.federalregister.gov/documents/2024/10/02/2024-22565/recordkeeping-for-custodial-accounts)
- [Federal Register, extension of the comment period, 20 November 2024](https://www.federalregister.gov/documents/2024/11/20/2024-27097/recordkeeping-for-custodial-accounts-extension-of-comment-period)
- [CFPB, Civil Penalty Fund, allocation of $46,248,291 to Synapse, 28 November 2025](https://www.consumerfinance.gov/enforcement/payments-harmed-consumers/civil-penalty-fund/)
- [CFPB, consumer distributions by case, updated 10 July 2026](https://www.consumerfinance.gov/enforcement/payments-harmed-consumers/payments-by-case/)
