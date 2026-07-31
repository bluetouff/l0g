---
title: "The market beyond the screen: billions of order messages outside JPMorgan surveillance"
description: "From 2014 to 2021, JPMorgan failed to feed more than 99% of the order messages on one US venue into its surveillance systems. Part one connects the manipulation admitted in 2020, the gap discovered in 2021 and the 2024 sanctions without treating a control failure as proof of new abuse."
pubDate: 2026-07-31T14:20:00+02:00
updatedDate: 2026-07-31T14:20:00+02:00
tags: ["JPMorgan", "spoofing", "trade surveillance", "CFTC", "Federal Reserve", "OCC", "regulation", "operational risk"]
draft: false
sourceArticle: "jpmorgan-marche-hors-radar-surveillance-ordres"
sourceUpdatedDate: 2026-07-31
---

*In June 2021, onboarding a new trading venue exposed an anomaly at JPMorgan. Order and trade feeds were not properly reaching its surveillance tools. The internal review then expanded across the world: at least 30 venues were affected, several products were involved and some gaps dated back to 2014. On one US venue identified only as "DCM-1", more than 99% of order messages escaped surveillance from 2014 to 2021. The volume ran into billions. The [Commodity Futures Trading Commission](https://www.cftc.gov/media/10721/Order05232024JPMorganSecuritiesLLC/download) did not find billions of fraudulent trades. It established a surveillance failure on an exceptional scale.*

The distinction defines this investigation. Missing data do not prove manipulation. They prevent the very control designed to detect it. The problem becomes more serious in light of the past: in September 2020, JPMorgan had admitted manipulation in precious metals and US Treasuries, promised remediation and described a strengthened system to the CFTC. Part of the market nevertheless remained invisible to it.

This two-part investigation reconstructs the record from orders issued by the CFTC, Federal Reserve and Office of the Comptroller of the Currency, the Department of Justice criminal case, Securities and Exchange Commission action and JPMorgan's own SEC filings. This part establishes chronology and risk. [Part two](/en/analysis/jpmorgan-market-surveillance-black-box/) examines sponsored access, the surveillance pipeline and the material missing from the public record.

## An established scandal

The starting point is neither rumour nor extrapolation. In September 2020, JPMorgan entered a deferred prosecution agreement with the Department of Justice. The bank admitted two separate wire-fraud schemes involving market manipulation.

The [DOJ case record](https://www.justice.gov/criminal/criminal-vns/case/jpmorgan-chase-co-deferred-prosecution-agreement) first covers gold, silver, platinum and palladium futures. From March 2008 to August 2016, traders and salespeople on trading teams in New York, London and Hong Kong placed orders intended for cancellation before execution on tens of thousands of occasions. The second scheme involved Treasury futures and the cash market for Treasury notes and bonds. From April 2008 to January 2016, the DOJ records thousands of deceptive sequences.

Liability did not remain solely corporate. In August 2023, [Gregg Smith and Michael Nowak received prison sentences](https://www.justice.gov/archives/opa/pr/former-jp-morgan-precious-metals-traders-sentenced-prison). Smith was sentenced to two years, Nowak to one year and one day. The DOJ put losses to market participants in the scheme tried before the jury at more than $10 million. Those convictions concerned precious metals and individual conduct proven at trial. They establish nothing about the messages missing from surveillance between 2014 and 2021.

## Spoofing, a false order in the book

A limit order book displays intentions to buy and sell. Price, quantity and visible depth help participants and algorithms estimate supply and demand. The [Commodity Exchange Act](https://www.cftc.gov/media/4826/enfjpmorganchaseorder092920/download) defines spoofing as bidding or offering with the intent to cancel before execution.

The mechanism used by JPMorgan traders combined two sides:

1. a genuine order intended for execution;
2. one or more deceptive orders on the opposite side, intended for cancellation.

The false orders created the appearance of stronger buying or selling pressure. Once the genuine order traded at a more favourable price, the deceptive orders disappeared. A rapid cancellation alone does not prove spoofing. Intent to cancel before execution is the decisive element. Criminal cases established it from trading sequences, communications and other evidence.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 760 420" role="img" aria-label="Simplified mechanics of spoofing established in the 2020 JPMorgan case" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="760" height="420" fill="#0c0d10"/>
  <text x="34" y="40" fill="#f5f6f8" font-size="18" font-weight="700">SPOOFING: TWO SIDES, TWO INTENTIONS</text>
  <text x="34" y="64" fill="#8b909b" font-size="12">Teaching diagram based on facts admitted and tried in the 2020 case.</text>
  <rect x="34" y="100" width="210" height="104" rx="6" fill="#15171c" stroke="#5eead4" stroke-width="2"/>
  <text x="139" y="132" fill="#5eead4" font-size="14" font-weight="700" text-anchor="middle">GENUINE ORDER</text>
  <text x="139" y="160" fill="#d6d9df" font-size="12" text-anchor="middle">intent to execute</text>
  <text x="139" y="182" fill="#8b909b" font-size="11" text-anchor="middle">desired purchase or sale</text>
  <rect x="516" y="100" width="210" height="104" rx="6" fill="#21131a" stroke="#ff4d87" stroke-width="2"/>
  <text x="621" y="132" fill="#ff4d87" font-size="14" font-weight="700" text-anchor="middle">DECEPTIVE ORDERS</text>
  <text x="621" y="160" fill="#d6d9df" font-size="12" text-anchor="middle">intent to cancel</text>
  <text x="621" y="182" fill="#8b909b" font-size="11" text-anchor="middle">displayed opposing pressure</text>
  <line x1="244" y1="152" x2="328" y2="152" stroke="#5eead4" stroke-width="2"/>
  <polygon points="328,152 316,145 316,159" fill="#5eead4"/>
  <line x1="516" y1="152" x2="432" y2="152" stroke="#ff4d87" stroke-width="2"/>
  <polygon points="432,152 444,145 444,159" fill="#ff4d87"/>
  <rect x="328" y="112" width="104" height="80" rx="40" fill="#171a20" stroke="#f5b13d"/>
  <text x="380" y="145" fill="#f5b13d" font-size="12" font-weight="700" text-anchor="middle">SKEWED</text>
  <text x="380" y="164" fill="#f5b13d" font-size="12" font-weight="700" text-anchor="middle">ORDER BOOK</text>
  <line x1="380" y1="192" x2="380" y2="242" stroke="#f5b13d" stroke-width="2"/>
  <polygon points="380,242 373,230 387,230" fill="#f5b13d"/>
  <rect x="190" y="244" width="380" height="90" rx="6" fill="#15171c" stroke="#2a2c33"/>
  <text x="380" y="276" fill="#f5f6f8" font-size="13" font-weight="700" text-anchor="middle">GENUINE ORDER EXECUTES</text>
  <text x="380" y="302" fill="#d6d9df" font-size="12" text-anchor="middle">deceptive orders are then cancelled</text>
  <text x="34" y="372" fill="#d6d9df" font-size="11">Cancellation is not inherently fraudulent. Prior intent separates spoofing from a legitimate order.</text>
  <text x="34" y="394" fill="#8b909b" font-size="10">Sources: DOJ case 20-CR-175; CFTC Order 20-69, 29 September 2020.</text>
</svg>
<figcaption>The diagram isolates the general logic. Actual sequences varied by product and trader. The legal proof did not rest on cancellation rates alone.</figcaption>
</figure>

## Eight years, two teams, three markets

The [2020 CFTC order](https://www.cftc.gov/media/4826/enfjpmorganchaseorder092920/download) goes further than the criminal summary. It describes hundreds of thousands of deceptive orders in precious metals and Treasury futures from 2008 to 2016. JPMorgan traders created artificial prices in many instances. The order also found a supervision failure at J.P. Morgan Securities.

Warning signs existed. The CFTC cites internal alerts, inquiries from CME and the Commission, and internal allegations from a JPMorgan trader. Before 2014, the surveillance system could not effectively identify spoofing. A newer tool followed, yet the firm still failed to identify, investigate and stop the conduct during the relevant period.

The [SEC](https://www.sec.gov/newsroom/press-releases/2020-233) separately documented manipulation in cash Treasuries from April 2015 to January 2016. J.P. Morgan Securities admitted the findings. Genuine orders were accompanied almost simultaneously by non-bona-fide orders on the opposite side to improve execution prices. The conduct was not confined to metals or futures.

## A strengthened system presented in 2020

At settlement, JPMorgan described a significant change in control. The CFTC order records the firm's representations: hundreds of new compliance officers, larger budgets, specific training, surveillance of more than 80 equity exchanges and more than 40 futures and options exchanges.

JPMorgan also said it used three primary alert types in the SMARTS software for spoofing and layering. Quality testing covered alerts referred to a higher review level and alerts closed without such referral. Monthly reports aggregated alerts by trader, team, supervisor and region. The firm further represented that its communications platforms processed about 100 million electronic messages each month and analysts reviewed every alert generated by that communications surveillance.

The CFTC did not frame those statements as an end-to-end audit of every market feed. It recorded them among JPMorgan's remediation representations. The order required the firm to maintain and update a programme designed to detect and deter violations.

The $920.2 million commonly attached to the case was one coordinated resolution, not three independent sums. The [DOJ breakdown](https://www.justice.gov/criminal/criminal-vns/case/jpmorgan-chase-co-deferred-prosecution-agreement) was a $436,431,811 criminal penalty, $311,737,008 in victim compensation and $172,034,790 in disgorgement. Credits for CFTC and SEC payments prevented double counting of the same components.

## A new venue exposes the gap in June 2021

Nine months after the settlement, an ordinary event prompted a major discovery. JPMorgan was preparing to onboard a new venue. In June 2021, it identified significant gaps in the order and trade data reaching its surveillance systems.

The review went global. According to the [May 2024 CFTC order](https://www.cftc.gov/media/10721/Order05232024JPMorganSecuritiesLLC/download), gaps affected at least 30 venues, multiple products and periods dating back to at least 2014. JPMorgan disclosed them to the Commission in 2021 and represented that it had not known about them. They therefore had not been discussed during the 2020 settlement.

The CFTC states the consequence directly: at the time of the spoofing resolution, JPMorgan was not surveilling certain order messages. Improvements described in 2020 could have been genuine for data present in the system. They did not cover absent data.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 760 480" role="img" aria-label="Timeline of established manipulation, remediation and surveillance gaps at JPMorgan" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="760" height="480" fill="#0c0d10"/>
  <text x="34" y="40" fill="#f5f6f8" font-size="18" font-weight="700">TWO CASES, ONE OVERLAP</text>
  <text x="34" y="64" fill="#8b909b" font-size="12">The periods overlap; the legal findings remain distinct.</text>
  <line x1="76" y1="128" x2="700" y2="128" stroke="#3a3d46" stroke-width="3"/>
  <line x1="76" y1="286" x2="700" y2="286" stroke="#3a3d46" stroke-width="3"/>
  <text x="34" y="106" fill="#ff4d87" font-size="12" font-weight="700">ESTABLISHED MANIPULATION</text>
  <line x1="86" y1="128" x2="372" y2="128" stroke="#ff4d87" stroke-width="8"/>
  <circle cx="86" cy="128" r="7" fill="#ff4d87"/>
  <circle cx="372" cy="128" r="7" fill="#ff4d87"/>
  <text x="86" y="158" fill="#d6d9df" font-size="11" text-anchor="middle">2008</text>
  <text x="372" y="158" fill="#d6d9df" font-size="11" text-anchor="middle">2016</text>
  <text x="229" y="184" fill="#8b909b" font-size="11" text-anchor="middle">precious metals and Treasuries</text>
  <text x="34" y="264" fill="#5eead4" font-size="12" font-weight="700">SURVEILLANCE GAPS</text>
  <line x1="277" y1="286" x2="633" y2="286" stroke="#5eead4" stroke-width="8"/>
  <circle cx="277" cy="286" r="7" fill="#5eead4"/>
  <circle cx="544" cy="286" r="9" fill="#f5b13d"/>
  <circle cx="633" cy="286" r="7" fill="#5eead4"/>
  <text x="277" y="316" fill="#d6d9df" font-size="11" text-anchor="middle">2014</text>
  <text x="544" y="316" fill="#f5b13d" font-size="11" text-anchor="middle">June 2021</text>
  <text x="633" y="316" fill="#d6d9df" font-size="11" text-anchor="middle">2023</text>
  <text x="455" y="342" fill="#8b909b" font-size="11" text-anchor="middle">discovered in 2021, represented as remediated in 2023</text>
  <line x1="499" y1="86" x2="499" y2="366" stroke="#f5b13d" stroke-width="2" stroke-dasharray="6 5"/>
  <circle cx="499" cy="128" r="8" fill="#f5b13d"/>
  <text x="499" y="95" fill="#f5b13d" font-size="12" font-weight="700" text-anchor="middle">SEPT. 2020</text>
  <text x="499" y="386" fill="#f5b13d" font-size="11" text-anchor="middle">spoofing settlement and remediation representations</text>
  <line x1="699" y1="104" x2="699" y2="310" stroke="#8b909b" stroke-width="2"/>
  <text x="699" y="94" fill="#d6d9df" font-size="11" text-anchor="middle">2024</text>
  <text x="699" y="338" fill="#8b909b" font-size="10" text-anchor="middle">Fed, OCC, CFTC</text>
  <text x="34" y="426" fill="#d6d9df" font-size="11">The overlap does not establish new abuse in the missing feeds.</text>
  <text x="34" y="448" fill="#8b909b" font-size="10">Sources: DOJ 20-CR-175; CFTC 20-69 and 24-07; Fed 24-007-B-HC; OCC AA-EC-2023-50.</text>
</svg>
<figcaption>Admitted manipulation spans 2008 to 2016. Surveillance gaps began by 2014 and lasted through 2023 on some venues. The overlap identifies a control failure, not new unlawful trading.</figcaption>
</figure>

## DCM-1 and more than 99% missing

The most severe case involved a regulated US futures venue anonymised by the CFTC as "DCM-1". From 2014 to 2021, JPMorgan failed to feed billions of order messages into surveillance. More than 99% of the venue's messages went unsurveilled.

Three qualifications prevent a false reading:

- an order message can create, modify or cancel an order and is not necessarily an executed trade;
- the message count gives neither a total dollar value nor the size of any position;
- the CFTC sanctioned a supervision failure, not new manipulation across every missing message.

JPMorgan said most activity came from sponsored access trading for three significant algorithmic firms. The order names neither the venue nor the firms. [Part two](/en/analysis/jpmorgan-market-surveillance-black-box/) examines this architecture because it changes the origin of orders without removing the need for complete surveillance data.

## A golden source without reconciliation

The technical cause described by the CFTC was a data-governance error. JPMorgan used feeds received directly from exchanges. It had a quarterly process for reconciling the completeness of some data sent to surveillance tools, but direct-from-exchange feeds were excluded.

The assumption sounded reassuring and became the central defect: exchange data were treated as a *golden source* and therefore not tested by the same reconciliation. The content could be accurate at origin and still fail during configuration, transport or entry into the system. The CFTC identifies configuration problems that kept feeds from entering a third-party surveillance system.

Risk did not live solely in data quality. It appeared between systems. A file could be reliable and an alert engine functional while the end-to-end chain remained blind because nobody compared messages received with messages expected.

## Three penalties and one data failure

On 14 March 2024, the [Federal Reserve](https://www.federalreserve.gov/newsevents/pressreleases/files/enf20240314a1.pdf) and [OCC](https://www.occ.treas.gov/news-issuances/news-releases/2024/nr-occ-2024-25.html) acted simultaneously. The Fed found gaps from 2014 to 2023 on at least 30 global venues and inadequate controls over data and reconciliation. It classified the practices as unsafe or unsound and imposed $98,167,980.

The OCC reached the same unsafe-or-unsound finding. Its order concerned billions of trading instances, at least 30 venues, data governance and venue coverage. It imposed $250 million, paid to the Treasury according to the agency.

On 23 May 2024, the CFTC added a nominal $200 million obligation. Its order granted two $50 million credits for payments under the OCC and Fed actions. The CFTC-specific payment therefore became $100 million if both credits applied, producing a coordinated total of $448,167,980. In its [30 June 2024 Form 10-Q](https://www.sec.gov/Archives/edgar/data/19617/000001961724000453/jpm-20240630.htm), JPMorgan rounded the figure to $450 million and said it had paid it.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 760 410" role="img" aria-label="Calculation of coordinated 2024 penalties over JPMorgan trade surveillance" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="760" height="410" fill="#0c0d10"/>
  <text x="34" y="40" fill="#f5f6f8" font-size="18" font-weight="700">2024: NOMINAL AMOUNTS AND CREDITS</text>
  <text x="34" y="64" fill="#8b909b" font-size="12">The three gross amounts cannot be added without accounting for credits.</text>
  <rect x="34" y="104" width="200" height="92" rx="6" fill="#15171c" stroke="#5eead4"/>
  <text x="134" y="134" fill="#5eead4" font-size="13" font-weight="700" text-anchor="middle">OCC</text>
  <text x="134" y="168" fill="#f5f6f8" font-size="22" font-weight="700" text-anchor="middle">$250m</text>
  <rect x="280" y="104" width="200" height="92" rx="6" fill="#15171c" stroke="#5eead4"/>
  <text x="380" y="134" fill="#5eead4" font-size="13" font-weight="700" text-anchor="middle">FEDERAL RESERVE</text>
  <text x="380" y="168" fill="#f5f6f8" font-size="22" font-weight="700" text-anchor="middle">$98.168m</text>
  <rect x="526" y="104" width="200" height="92" rx="6" fill="#15171c" stroke="#f5b13d"/>
  <text x="626" y="134" fill="#f5b13d" font-size="13" font-weight="700" text-anchor="middle">CFTC, NOMINAL</text>
  <text x="626" y="168" fill="#f5f6f8" font-size="22" font-weight="700" text-anchor="middle">$200m</text>
  <text x="380" y="232" fill="#ff4d87" font-size="15" font-weight="700" text-anchor="middle">MINUS $100m OF CFTC CREDITS</text>
  <text x="380" y="258" fill="#8b909b" font-size="11" text-anchor="middle">$50m for the OCC payment, $50m for the Fed payment</text>
  <line x1="190" y1="286" x2="570" y2="286" stroke="#3a3d46" stroke-width="2"/>
  <rect x="190" y="306" width="380" height="62" rx="6" fill="#171a20" stroke="#ff4d87" stroke-width="2"/>
  <text x="380" y="345" fill="#ff4d87" font-size="24" font-weight="700" text-anchor="middle">$448.168m EFFECTIVE</text>
  <text x="34" y="396" fill="#8b909b" font-size="10">Sources: Fed 24-007-CMP-HC; OCC AA-EC-2023-49; CFTC 24-07; JPMorgan Q2 2024 10-Q.</text>
</svg>
<figcaption>JPMorgan reported the aggregate as $450 million after rounding. The three gross orders totalled $548.168 million, but the CFTC credited $100 million.</figcaption>
</figure>

## A limited finding in the second case

The 2024 actions did not find a repetition of the 2008 to 2016 manipulation. The CFTC sanctioned J.P. Morgan Securities for failure to supervise. JPMorgan admitted the facts concerning the scope and causes of the gaps and acknowledged a violation of CFTC Regulation 166.3. Under the settlement formula, it neither admitted nor denied the other findings.

In its second-quarter 2024 report, JPMorgan said it had reviewed the previously unsurveilled data and identified no employee misconduct, harm to clients or harm to the market. This was the firm's published conclusion. Regulatory orders also required detailed reports and independent review. Their contents do not appear in the public documents consulted for this investigation.

The DOJ, meanwhile, closed the 2020 criminal case. The three-year DPA term expired on 29 September 2023. On 29 March 2024, the Department moved to dismiss with prejudice on the ground that JPMorgan had fully met its obligations; the court granted the motion the same day. The decision followed the Fed and OCC orders but concerned compliance with the earlier criminal agreement. It did not erase the 2024 findings or certify every surveillance feed.

## Part two and the control black box

Part one supports a narrow conclusion. JPMorgan admitted a vast historical manipulation scheme. During part of the remediation period, billions of messages did not reach surveillance. Regulators established a supervision failure, not a new fraud across those messages.

The central risk is therefore one of knowledge. A bank can count alerts, calibrate scenarios and hire control staff while remaining unaware of a massive upstream absence. Without end-to-end reconciliation, the dashboard measures only data received.

The investigation continues in [“After the fines: the black box inside JPMorgan market surveillance”](/en/analysis/jpmorgan-market-surveillance-black-box/): sponsored access, venue inventories, mandated reports, independent review, public unknowns and tests for remediation.

## Primary sources

1. CFTC, [Order 20-69 on manipulation and supervision failures](https://www.cftc.gov/media/4826/enfjpmorganchaseorder092920/download), 29 September 2020.
2. Department of Justice, [case 20-CR-175 and deferred prosecution agreement](https://www.justice.gov/criminal/criminal-vns/case/jpmorgan-chase-co-deferred-prosecution-agreement), updated 27 August 2024.
3. Department of Justice, [sentencing of Gregg Smith and Michael Nowak](https://www.justice.gov/archives/opa/pr/former-jp-morgan-precious-metals-traders-sentenced-prison), 22 August 2023.
4. SEC, [cash Treasury manipulation action](https://www.sec.gov/newsroom/press-releases/2020-233), 29 September 2020.
5. Federal Reserve, [Orders 24-007-B-HC and 24-007-CMP-HC](https://www.federalreserve.gov/newsevents/pressreleases/files/enf20240314a1.pdf), 14 March 2024.
6. OCC, [trade-surveillance order and penalty](https://www.occ.treas.gov/news-issuances/news-releases/2024/nr-occ-2024-25.html), 14 March 2024.
7. CFTC, [Order 24-07 on surveillance gaps](https://www.cftc.gov/media/10721/Order05232024JPMorganSecuritiesLLC/download), 23 May 2024.
8. JPMorgan Chase, [Form 10-Q for 30 June 2024](https://www.sec.gov/Archives/edgar/data/19617/000001961724000453/jpm-20240630.htm), Trading Venues Investigations note.

*Method and limit: each penalty was reconciled to its order and applicable credits. “Billions” refers to order messages, not dollar value. This investigation attributes no misconduct to missing feeds beyond conduct already admitted or tried. JPMorgan's conclusions are labelled as such. No internal report, non-public consultant report or non-public remediation report was used.*
