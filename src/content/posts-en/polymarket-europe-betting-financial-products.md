---
title: "Polymarket’s financial route into Europe has a retail problem"
seoTitle: "Polymarket in Europe: bets and financial regulation | l0g"
description: "Polymarket wants financial treatment in Europe. How its contracts work, why retail restrictions matter, and what the legal label would change."
pubDate: "2026-09-28T11:44:05+02:00"
tags: ["Polymarket", "prediction markets", "regulation", "MiFID", "cryptoassets"]
draft: false
ogImage: "/illustrations/news/polymarket-europe-finance-v1.jpg"
sourceArticle: "polymarket-europe-paris-produits-financiers"
sourceUpdatedDate: "2026-09-28T11:44:05+02:00"
---

Rain is forecast for Saturday. On a screen, the question has two answers and a price. Suppose you pay $40 for one hundred contracts, each worth a dollar if “yes” is the winning answer. You will receive $100 or lose your $40. Calling the transaction a bet or a financial instrument does not change that arithmetic. It can, however, change the rules governing whether the business may sell it to you.

On **9 September 2026**, Polymarket announced it was [joining Blockchain for Europe](https://www.prnewswire.co.uk/news-releases/polymarket-joins-blockchain-for-europe-to-support-with-expansion-into-europe-302873756.html). The company presents [prediction markets](/en/glossary/marche-predictif/) as financial innovation and argues for a common European framework. Its chief legal officer says the company is seeking licensing and engagement with authorities. This sets out its European ambitions; the scope of any eventual authorisation remains to be determined.

There is a substantial obstacle to that route: **European financial law already restricts the sale of certain products to ordinary customers**. The question is therefore also what obligations Polymarket would accept, which contracts might be admitted and who would be allowed to buy them. Following the money through one contract makes that debate easier to understand.

## The winning side receives money committed by both sides

Take our fictional example. One buyer pays $40 for one hundred “yes” claims. Another supplies $60 for one hundred “no” claims. Together, $100 backs one hundred pairs of opposing outcomes. In an ordinary binary settlement, each winning claim pays a dollar and each losing claim pays nothing. This paired-collateral structure is described in [Polymarket’s documentation](https://docs.polymarket.com/concepts/positions-tokens).

If yes wins, its buyer receives $100, including the $40 originally committed: the net gain is $60. The no buyer loses $60. If no wins, that buyer makes $40 and the yes buyer loses $40. These are alternative outcomes, not two payments from the same pool.

<figure class="infographic" style="max-width:28rem;margin:2rem auto 2.5rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 515" role="img" aria-labelledby="l0g-polymarket-en-1-title l0g-polymarket-en-1-desc" style="width:100%;height:auto">
<title id="l0g-polymarket-en-1-title">Where does the payout come from?</title>
<desc id="l0g-polymarket-en-1-desc">Hypothetical example. $40 for 100 YES and $60 for 100 NO fund $100 of collateral. If YES wins: net +$60 and −$60. If NO wins: net −$40 and +$40. Alternative outcomes, before fees.</desc>
<rect x="0" y="0" width="480" height="515" fill="var(--color-surface)" />
<text x="22" y="36" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="400" fill="var(--color-paper)" text-anchor="start">Where does the payout come from?</text>
<text x="22" y="69" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400" fill="var(--color-muted)" text-anchor="start">Hypothetical · 100 YES / NO pairs</text>
<text x="24" y="99" font-family="Arial, Helvetica, sans-serif" font-size="21" font-weight="400" fill="var(--color-paper)" text-anchor="start">100 YES</text>
<text x="258" y="99" font-family="Arial, Helvetica, sans-serif" font-size="21" font-weight="400" fill="var(--color-paper)" text-anchor="start">100 NO</text>
<g><rect x="24" y="112" width="172.8" height="38" fill="var(--color-signal)" />
<text x="110.4" y="140" font-family="Arial, Helvetica, sans-serif" font-size="25" font-weight="600" fill="var(--color-surface)" text-anchor="middle">$40</text>
</g><g><rect x="196.8" y="112" width="259.2" height="38" fill="var(--color-accent)" />
<text x="326.4" y="140" font-family="Arial, Helvetica, sans-serif" font-size="25" font-weight="600" fill="var(--color-surface)" text-anchor="middle">$60</text>
</g><line x1="240" y1="156" x2="240" y2="180" stroke="var(--color-signal)" stroke-width="1.7" /><path d="M 235 173 L 240 180 L 245 173" fill="none" stroke="var(--color-signal)" stroke-width="1.7" />
<text x="240" y="210" font-family="Arial, Helvetica, sans-serif" font-size="27" font-weight="600" fill="var(--color-paper)" text-anchor="middle">$100 of collateral</text>
<text x="240" y="238" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400" fill="var(--color-muted)" text-anchor="middle">One pool, two possible outcomes</text>
<line x1="240" y1="250" x2="240" y2="266" stroke="var(--color-signal)" stroke-width="1.4" />
<line x1="126" y1="266" x2="354" y2="266" stroke="var(--color-signal)" stroke-width="1.4" />
<line x1="126" y1="266" x2="126" y2="286" stroke="var(--color-signal)" stroke-width="1.7" /><path d="M 121 279 L 126 286 L 131 279" fill="none" stroke="var(--color-signal)" stroke-width="1.7" />
<line x1="354" y1="266" x2="354" y2="286" stroke="var(--color-signal)" stroke-width="1.7" /><path d="M 349 279 L 354 286 L 359 279" fill="none" stroke="var(--color-signal)" stroke-width="1.7" />
<text x="126" y="315" font-family="Arial, Helvetica, sans-serif" font-size="23" font-weight="400" fill="var(--color-signal)" text-anchor="middle">YES wins</text>
<text x="354" y="315" font-family="Arial, Helvetica, sans-serif" font-size="23" font-weight="400" fill="var(--color-accent)" text-anchor="middle">NO wins</text>
<g><rect x="22" y="331" width="208" height="94" fill="none" stroke="var(--color-muted)" stroke-width="1.5" />
<text x="126" y="369" font-family="Arial, Helvetica, sans-serif" font-size="25" font-weight="600" fill="var(--color-signal)" text-anchor="middle">$100 to YES</text>
<text x="126" y="404" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="400" fill="var(--color-muted)" text-anchor="middle">$0 to NO</text>
</g><g><rect x="250" y="331" width="208" height="94" fill="none" stroke="var(--color-muted)" stroke-width="1.5" />
<text x="354" y="369" font-family="Arial, Helvetica, sans-serif" font-size="25" font-weight="600" fill="var(--color-accent)" text-anchor="middle">$100 to NO</text>
<text x="354" y="404" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="400" fill="var(--color-muted)" text-anchor="middle">$0 to YES</text>
</g><text x="126" y="462" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400" fill="var(--color-paper)" text-anchor="middle">YES net: +$60</text>
<text x="354" y="462" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400" fill="var(--color-paper)" text-anchor="middle">YES net: −$40</text>
<text x="126" y="493" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400" fill="var(--color-paper)" text-anchor="middle">NO net: −$60</text>
<text x="354" y="493" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400" fill="var(--color-paper)" text-anchor="middle">NO net: +$40</text>
</svg>
<figcaption>l0g calculation, hypothetical example. Both contributions fund the same collateral pool; segment widths are proportional to money supplied. The two outcomes are alternatives. Fees, interest, taxes and collateral risk are excluded. Reference mechanism: Polymarket, Positions & Tokens.</figcaption>
</figure>

Provided the collateral is present and available, the arrangement does not require the loser to find more money after the outcome. It does not protect either buyer from being wrong. In this example, with no fees or collateral income, one side’s trading gain is the other’s loss. The payout is not financed by the operating profits of a company in which the participants own equity.

That observation does not settle whether the contract is useful. Transferring an existing risk may have value even when the contract itself creates no additional income. A business might willingly pay to make its receipts less uncertain; someone else might accept the other side. That argument deserves closer attention than a screen’s resemblance to a stock exchange.

There is also a convention behind the dollar figures. The international platform’s current documentation describes [pUSD](https://docs.polymarket.com/concepts/pusd), a token backed by USDC, as the collateral asset. Our calculations assume nominal dollar equivalence and leave out token, software and transfer risks. They are not an example of an insured bank deposit. **The international architecture discussed here should not be assumed to describe the separate US service.**

## From the displayed probability to the execution price

An order book brings together bids and offers. Polymarket says its displayed price is generally the midpoint between the best bid and ask; when the gap exceeds ten cents, it uses the last traded price instead. An operator matches orders offchain, with transactions settled onchain. The [documented structure is a hybrid](https://docs.polymarket.com/concepts/prices-orderbook), not an exchange with no operational organiser.

A price of 60 cents for a possible one-dollar payout is commonly read as a 60% implied probability. “Implied” matters. The number reflects terms on which people are willing to trade and may contain useful information. It is neither a physical measurement of the event nor a representative survey.

Consider a second fictional example. The best bid is 58 cents and the best offer is 62 cents, so the displayed midpoint is 60. But only 50 contracts are offered at 62 cents; the next 150 cost 68 cents each. An immediate purchase of 200 contracts, accepting both levels and assuming the book does not change, costs **$133**, or **66.5 cents each on average**. Multiplying the displayed price by 200 would give $120, a price unavailable for that purchase.

<figure class="infographic" style="max-width:28rem;margin:2rem auto 2.5rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 580" role="img" aria-labelledby="l0g-polymarket-en-2-title l0g-polymarket-en-2-desc" style="width:100%;height:auto">
<title id="l0g-polymarket-en-2-title">The cost of buying 200 contracts</title>
<desc id="l0g-polymarket-en-2-desc">Hypothetical book. Best bid 58 cents and best ask 62 cents give a displayed midpoint of 60 cents. Offers: 50 at 62 cents and 150 at 68 cents. Total $133, average 66.5 cents. Vertical axis starts at zero. Before fees.</desc>
<rect x="0" y="0" width="480" height="580" fill="var(--color-surface)" />
<text x="22" y="36" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="400" fill="var(--color-paper)" text-anchor="start">The cost of buying 200 contracts</text>
<text x="22" y="68" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400" fill="var(--color-muted)" text-anchor="start">Hypothetical · cents per contract</text>
<line x1="22" y1="96" x2="47" y2="96" stroke="var(--color-accent)" stroke-width="2.5" />
<text x="56" y="103" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400" fill="var(--color-paper)" text-anchor="start">Asking prices</text>
<line x1="263" y1="96" x2="288" y2="96" stroke="var(--color-signal)" stroke-width="1.8" stroke-dasharray="5 4" />
<text x="297" y="103" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400" fill="var(--color-paper)" text-anchor="start">Displayed</text>
<line x1="60" y1="368" x2="448" y2="368" stroke="var(--color-muted)" stroke-width="1" />
<text x="48" y="375" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400" fill="var(--color-muted)" text-anchor="end">0</text>
<line x1="60" y1="308" x2="448" y2="308" stroke="var(--color-muted)" stroke-width="1" />
<text x="48" y="315" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400" fill="var(--color-muted)" text-anchor="end">20</text>
<line x1="60" y1="248" x2="448" y2="248" stroke="var(--color-muted)" stroke-width="1" />
<text x="48" y="255" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400" fill="var(--color-muted)" text-anchor="end">40</text>
<line x1="60" y1="188" x2="448" y2="188" stroke="var(--color-muted)" stroke-width="1" />
<text x="48" y="195" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400" fill="var(--color-muted)" text-anchor="end">60</text>
<line x1="60" y1="128" x2="448" y2="128" stroke="var(--color-muted)" stroke-width="1" />
<text x="48" y="135" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400" fill="var(--color-muted)" text-anchor="end">80</text>
<rect x="60" y="182" width="97.0" height="186" fill="var(--color-accent)" fill-opacity="0.18" />
<rect x="157.0" y="164" width="291.0" height="204" fill="var(--color-accent)" fill-opacity="0.3" />
<line x1="60" y1="188" x2="448" y2="188" stroke="var(--color-signal)" stroke-width="1.7" stroke-dasharray="5 4" />
<path d="M 60 182 H 157.0 V 164 H 448" fill="none" stroke="var(--color-accent)" stroke-width="2.5" />
<text x="109" y="158" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="600" fill="var(--color-accent)" text-anchor="middle">62 ¢</text>
<text x="303" y="146" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="600" fill="var(--color-accent)" text-anchor="middle">68 ¢</text>
<line x1="60" y1="128" x2="60" y2="368" stroke="var(--color-paper)" stroke-width="1.4" />
<line x1="60" y1="368" x2="448" y2="368" stroke="var(--color-paper)" stroke-width="1.4" />
<line x1="60.0" y1="368" x2="60.0" y2="375" stroke="var(--color-paper)" stroke-width="1.4" />
<text x="60.0" y="400" font-family="Arial, Helvetica, sans-serif" font-size="21" font-weight="400" fill="var(--color-muted)" text-anchor="middle">0</text>
<line x1="157.0" y1="368" x2="157.0" y2="375" stroke="var(--color-paper)" stroke-width="1.4" />
<text x="157.0" y="400" font-family="Arial, Helvetica, sans-serif" font-size="21" font-weight="400" fill="var(--color-muted)" text-anchor="middle">50</text>
<line x1="448.0" y1="368" x2="448.0" y2="375" stroke="var(--color-paper)" stroke-width="1.4" />
<text x="448.0" y="400" font-family="Arial, Helvetica, sans-serif" font-size="21" font-weight="400" fill="var(--color-muted)" text-anchor="middle">200</text>
<text x="254" y="433" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400" fill="var(--color-muted)" text-anchor="middle">Contracts bought</text>
<line x1="22" y1="452" x2="458" y2="452" stroke="var(--color-muted)" stroke-width="1" />
<text x="240" y="486" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="400" fill="var(--color-paper)" text-anchor="middle">50 × $0.62 + 150 × $0.68</text>
<text x="240" y="526" font-family="Arial, Helvetica, sans-serif" font-size="29" font-weight="600" fill="var(--color-signal)" text-anchor="middle">Total: $133</text>
<text x="240" y="558" font-family="Arial, Helvetica, sans-serif" font-size="21" font-weight="400" fill="var(--color-muted)" text-anchor="middle">Average: $0.665 per contract</text>
</svg>
<figcaption>l0g calculation, a wholly fictional order book that remains unchanged during execution. Best bid: $0.58; best ask: $0.62; displayed midpoint: $0.60. The chart shows only the sell offers needed for 200 contracts. Both axes are linear and start at zero. Cost before fees. Display convention: Polymarket documentation.</figcaption>
</figure>

The gap between buying and selling prices, and the quantity available at each price, are part of the economics. “60%” can be informative without allowing a large position to be opened or closed there. A recent trade does not, by itself, tell the next customer how much can be bought without moving the price.

Market information also differs from representativeness. Someone with more money can have more influence than someone with less. A participant seeking a hedge may accept a price they would reject for a purely speculative trade. The price therefore reflects different financial resources and needs. Its representativeness requires separate examination from its ability to anticipate events.

Assessing the forecast requires repeated, comparable observations. When similar events are assigned a probability of 60%, do they occur about six times out of ten? A single correct or incorrect call cannot answer that. **A market can produce useful information while offering a poor trade to someone who arrives late, pays too much or incurs excessive costs.**

## A financial licence offers reach under a common framework

Gambling operates under differing national regimes. The [European Commission explains](https://single-market-economy.ec.europa.eu/sectors/online-gambling_en) that there is no sector-specific EU legislation harmonising them, although EU law constrains member states’ choices. Permission in one country is therefore not a general right to offer every kind of wager throughout the Union.

Financial services have a different structure. Under [Article 34 of MiFID II](https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/mifid-ii/article-34-freedom-provide-investment), an investment firm authorised and supervised in one member state can provide services in others, within its permissions and subject to the specified procedures. This is the principle of European passporting. The United Kingdom has a separate regime.

The commercial attraction is understandable. A business able to serve a larger market under a common framework may spread compliance costs more widely and avoid some duplication. But permission to operate a service, the legal classification of a product and permission to sell it to a particular customer are separate questions. One favourable answer does not settle the others.

Nor does “prediction market” place every contract in the same category. In its [September risk report](https://www.esma.europa.eu/sites/default/files/2026-09/ESMA50-1949966494-4282_TRV_Risk_Monitor_2_2026.pdf), ESMA, the European securities regulator, describes different possible classifications and notes that the major platforms examined did not hold EU authorisation at the time of the report. Issuing a token does not automatically move a financial instrument into the MiCA cryptoasset regime.

A financial application would therefore need to define the offering. A contract on an economic statistic, a sporting result and an entertainment award do not become legally identical because they use the same yes button. Any future permission would have to be read for its scope, rather than inferred from the platform’s brand.

## Financial regulation can exclude retail customers too

On **3 July 2026**, before the company’s September statement, [ESMA reminded firms](https://www.esma.europa.eu/sites/default/files/2026-07/ESMA35-243228190-8148_Public_Statement_on_the_application_of_the_national_product_intervention_measures_on_binary_options_to_event_contracts.pdf) that event contracts qualifying as financial instruments can be caught by national restrictions on retail binary options. The product’s characteristics, not its commercial name, determine the analysis. This was a reminder of existing restrictions, not a new blanket ban on every prediction market.

A *binary option* provides a predetermined payment or no payment depending on a condition. France’s [AMF recalls](https://www.amf-france.org/fr/option-binaire) the ban on marketing these products to retail customers since July 2018. The precise classification and the legal exceptions require product-specific examination. Matching users with each other is not sufficient, on its own, to remove a restriction on the product being sold.

In Britain, the [FCA distinguishes](https://www.fca.org.uk/publications/corporate-documents/fca-perimeter-report) sporting and political events, within the Gambling Commission’s remit, from financial and certain climatic events within its own. It regards the financial prediction products it has examined as binary options covered by the permanent retail ban that took effect on [2 April 2019](https://www.fca.org.uk/news/statements/fca-confirms-permanent-ban-sale-binary-options-retail-consumers). Further work on access or the regulatory boundary is a possibility it discusses, not an opening already approved.

**Financial status would therefore leave a distribution problem to solve.** The debate might produce a narrower professional offering, a redesigned product or a reconsideration of the rules. These are analytical possibilities, not approved business plans. ESMA also stresses that investment services involving such instruments require authorisation even when offered only to non-retail clients.

The requested framework has obligations as well as opportunities. [MiFID II Article 24](https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/mifid-ii/article-24-general-principles-and) requires, among other things, fair, clear and non-misleading information, attention to an identified target market and disclosure of costs. Permission to operate comes with responsibilities whose detailed application depends on the service and the customer.

## Different entities, regulators and pending proceedings

France’s gambling authority, the ANJ, [announced on 17 July an order made the previous day](https://anj.fr/promotion-dune-offre-de-jeux-dargent-illegale-blocage-du-site-polymarket) requiring access to Polymarket’s website to be blocked, on the ground that it promoted an illegal gambling offering. Its statement identifies ADVENTURE ONE QSS INC. Earlier transaction restrictions and this later website-access measure are distinct. Polymarket [announced on 21 August that it had filed a petition](https://www.prnewswire.co.uk/news-releases/polymarket-files-petition-to-challenge-anj-ruling-302856772.html) challenging the block. It disputes the decision and says it continues to engage with French authorities. The documents reviewed do not establish the outcome of that petition.

The [CFTC’s US register](https://www.cftc.gov/IndustryOversight/IndustryFilings/TradingOrganizations/49571) identifies another entity: QCX LLC, doing business as Polymarket US, designated as a contract market on **9 July 2025**. An [amended order of 24 November 2025](https://www.cftc.gov/media/12806/download?attachment=) changed its arrangements for access through intermediaries while retaining regulatory obligations. That supervision is real. It is not permission for every part of the international offering to operate in every country.

US developments also show that the legal dispute remains active. On **24 September 2026**, New York [announced a lawsuit against Polymarket US](https://ag.ny.gov/press-release/2026/attorney-general-james-and-governor-hochul-announce-lawsuit-against-polymarket), alleging unlicensed gambling and access for people aged 18 to 20 to sports betting for which the state requires a minimum age of 21. It seeks an injunction and restitution, among other remedies. These are the claimant’s allegations and requests, not findings made by a court.

Polymarket responded that evening with a federal lawsuit seeking to prevent state officials from regulating its market, [Reuters reported](https://www.investing.com/news/stock-market-news/polymarket-sues-new-york-attorney-general-to-block-regulation-of-its-prediction-market-4916415). The dispute therefore also concerns which authority may intervene, rather than simply whether supervision exists.

A federal designation and a state enforcement action thus put different legal positions on the record. “Regulated in the US” does not resolve that dispute, let alone confer rights on a customer in France. The same brand can sit above different services, agreements and routes of redress.

## The strongest economic case starts with a risk that already exists

Return to the outdoor café. In a **fictional simulation**, it takes $10,000 on a dry day and $4,000 when it rains. It buys 5,000 rain contracts at 40 cents each. The hedge costs $2,000 and pays $5,000 if the specified rain event occurs.

After this transaction alone, the café retains $8,000 in dry weather and $7,000 in rain. The gap between the two outcomes falls from $6,000 to $1,000. It has surrendered part of its best day to improve its worst. These are receipts adjusted for the contract, **not profits**: wages, supplies and other operating costs are omitted.

<figure class="infographic" style="max-width:28rem;margin:2rem auto 2.5rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 552" role="img" aria-labelledby="l0g-polymarket-en-3-title l0g-polymarket-en-3-desc" style="width:100%;height:auto">
<title id="l0g-polymarket-en-3-title">How the hedge changes receipts</title>
<desc id="l0g-polymarket-en-3-desc">Fictional café receipts: $10,000 dry and $4,000 in rain. After buying 5,000 contracts at 40 cents, adjusted receipts are $8,000 dry and $7,000 in rain. Shared zero-based scale. Other expenses excluded.</desc>
<rect x="0" y="0" width="480" height="552" fill="var(--color-surface)" />
<text x="22" y="36" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="400" fill="var(--color-paper)" text-anchor="start">How the hedge changes receipts</text>
<text x="22" y="68" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400" fill="var(--color-muted)" text-anchor="start">Hypothetical · adjusted receipts</text>
<rect x="22" y="98" width="24" height="15" fill="none" stroke="var(--color-paper)" stroke-width="1.5" />
<text x="58" y="113" font-family="Arial, Helvetica, sans-serif" font-size="21" font-weight="400" fill="var(--color-paper)" text-anchor="start">No contract</text>
<rect x="22" y="131" width="24" height="15" fill="var(--color-accent)" />
<text x="58" y="146" font-family="Arial, Helvetica, sans-serif" font-size="21" font-weight="400" fill="var(--color-paper)" text-anchor="start">After buying the hedge</text>
<text x="22" y="191" font-family="Arial, Helvetica, sans-serif" font-size="23" font-weight="400" fill="var(--color-paper)" text-anchor="start">Dry weather</text>
<text x="22" y="323" font-family="Arial, Helvetica, sans-serif" font-size="23" font-weight="400" fill="var(--color-paper)" text-anchor="start">Rain</text>
<rect x="22" y="210" width="330.0" height="26" fill="none" stroke="var(--color-paper)" stroke-width="1.5" />
<text x="362.0" y="232" font-family="Arial, Helvetica, sans-serif" font-size="21" font-weight="400" fill="var(--color-paper)" text-anchor="start">$10,000</text>
<rect x="22" y="254" width="264.0" height="26" fill="var(--color-accent)" />
<text x="296.0" y="276" font-family="Arial, Helvetica, sans-serif" font-size="21" font-weight="400" fill="var(--color-accent)" text-anchor="start">$8,000</text>
<rect x="22" y="342" width="132.0" height="26" fill="none" stroke="var(--color-paper)" stroke-width="1.5" />
<text x="164.0" y="364" font-family="Arial, Helvetica, sans-serif" font-size="21" font-weight="400" fill="var(--color-paper)" text-anchor="start">$4,000</text>
<rect x="22" y="386" width="231.0" height="26" fill="var(--color-accent)" />
<text x="263.0" y="408" font-family="Arial, Helvetica, sans-serif" font-size="21" font-weight="400" fill="var(--color-accent)" text-anchor="start">$7,000</text>
<line x1="22" y1="453" x2="352" y2="453" stroke="var(--color-muted)" stroke-width="1.4" />
<line x1="22.0" y1="453" x2="22.0" y2="460" stroke="var(--color-muted)" stroke-width="1.4" />
<text x="22.0" y="485" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400" fill="var(--color-muted)" text-anchor="start">0</text>
<line x1="187.0" y1="453" x2="187.0" y2="460" stroke="var(--color-muted)" stroke-width="1.4" />
<text x="187.0" y="485" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400" fill="var(--color-muted)" text-anchor="middle">5,000</text>
<line x1="352.0" y1="453" x2="352.0" y2="460" stroke="var(--color-muted)" stroke-width="1.4" />
<text x="352.0" y="485" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400" fill="var(--color-muted)" text-anchor="middle">10,000</text>
<text x="458" y="485" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400" fill="var(--color-muted)" text-anchor="end">USD</text>
<text x="240" y="530" font-family="Arial, Helvetica, sans-serif" font-size="21" font-weight="400" fill="var(--color-paper)" text-anchor="middle">Hedge cost: $2,000</text>
</svg>
<figcaption>l0g calculation, fictional one-day simulation. Buying 5,000 contracts at $0.40 costs $2,000 and pays $5,000 in rain or zero when dry. Every bar starts at zero. Receipts adjusted for the contract alone, with all other expenses omitted. A perfect match between the café’s exposure and the specified event is assumed. No actual offering or permission to sell it is represented.</figcaption>
</figure>

Losing the premium on a sunny day need not be an economic failure. The underlying business has taken more money. The hedge must be assessed alongside that business, rather than judged only by whether the wager paid out.

The limitation is equally tangible. The weather station may be far from the terrace, the rain may arrive after closing, or customers may stay away for an unrelated reason. The mismatch between an actual loss and the event triggering payment is **basis risk**. Our calculation deliberately removes it to isolate the mechanism. An actual hedge would require a separate assessment of that match, its contractual terms and the café’s legal access to the product.

This allows a more useful distinction. A credible hedging use does not justify every contract being available to every customer. Conversely, observing money move from losing to winning positions does not rule out an economic service. The pre-existing exposure, the closeness of the match and the price of protection need to be examined.

There is also substantive research on information. A [February 2026 paper in the Federal Reserve’s FEDS series](https://www.federalreserve.gov/econres/feds/kalshi-and-the-rise-of-macro-markets.htm) studies macroeconomic forecasts from Kalshi and finds value in their continuously updated picture of expectations. Its subject is Kalshi, not every Polymarket contract. It expresses its authors’ conclusions, not an institutional endorsement by the Federal Reserve, while retail customers’ trading profitability is a separate question.

## Someone still has to decide whether it rained

After the day is over, the contract has to settle. Which station, threshold, time window and publication count? Suppose an initial reading is corrected later. Depending on the terms, the payout could follow the first publication or the revised value. Two people with an accurate understanding of the weather could nevertheless have bought different propositions without noticing.

Polymarket describes a [resolution process using UMA’s oracle](https://docs.polymarket.com/concepts/resolution), a mechanism that supplies an answer about the outside world. A proposed outcome can be challenged for two hours; after two disputed proposals, the question escalates to a vote by UMA token holders. The documentation also allows exceptional 50/50 outcomes. Our one-dollar-or-zero example assumes ordinary binary resolution.

Automated payment follows the decision. Software may apply a rule faithfully while participants disagree about how that rule describes the event. **Clear terms and a usable process for examining challenges are part of market quality.**

A technical dispute mechanism is not, by itself, a public system of legal redress. Customers would need to know the responsible entity, the applicable law, the deadlines and the means of obtaining a remedy when a service fails to honour its commitments. Those protections would need to be established in any future authorised offering. The presence of a blockchain does not establish them.

## What happens when the event itself becomes a target?

In its July statement, the ANJ refers to suspicions involving weather sensors and an [investigation opened on 4 May 2026](https://anj.fr/promotion-dune-offre-de-jeux-dargent-illegale-blocage-du-site-polymarket). The statement describes an ongoing investigation, with suspicions to examine and responsibility still to establish. The case highlights the dependency on the measurement that triggers payment.

Understanding public information better than others, misappropriating a secret and being able to change an outcome are different activities. Better research may improve a price. The other advantages may derive from a breached duty or an altered event. Preventing them requires different controls.

Polymarket’s published [integrity rules](https://integrity.polymarket.com/) prohibit, among other things, trading on confidential information in breach of an existing duty, illegal tips and trading by someone able to influence the outcome. The rules are a public commitment that can be examined. Their existence does not measure surveillance effectiveness or the frequency with which misconduct is prevented.

A public transaction history may help reconstruct flows. It does not automatically identify who controls an address, which accounts are connected or what information someone possessed before buying. An assessment of the safeguards would therefore need evidence about identification, investigations and actual enforcement, beyond the visibility of the ledger.

## The business of selling forecasts to finance

A participant’s entire loss is not necessarily revenue for the operator. On a market that matches users, the business opportunity can lie in chargeable activity. Polymarket’s [fee documentation](https://help.polymarket.com/en/articles/13364478-trading-fees) describes charges on certain markets and transactions, with some redistribution to liquidity providers. It supports neither the claim that everything is free nor a revenue estimate produced by applying one fee rate to all trading volume.

Another business line has already been announced. On **11 February 2026**, [Intercontinental Exchange launched a Polymarket data offering](https://ir.theice.com/press/news-details/2026/ICE-Launches-Polymarket-Signals-and-Sentiment-Tool-Turning-Crowd-Sourced-Dynamic-Views-into-Market-Opportunities/default.aspx) for professional and institutional users, with exclusivity announced for institutional capital markets. Expectations can become inputs to other financial analysis, independently of direct access to the contract that produced them.

This gives the data a commercial use while leaving its reliability open to assessment. A professional user may find a signal interesting, compare it with other sources or investigate its biases without accepting every quoted probability as correct. Buying the data and buying the contract are different decisions.

Trading volume, likewise, measures activity rather than necessarily fresh money. Reselling the same claim several times increases turnover. Its counting methodology must be understood before it is compared with collateral, participant losses or company revenue. None of those totals is inferred here from promotional volume figures.

As of **28 September 2026**, the available documents establish a European expansion effort, existing restrictions and several possible business models. They do not establish permission to serve a European retail market. Choosing between the words “betting” and “finance” will not settle the issue. The relevant offering would need to specify the contracts, the customers, the responsible entity and the obligations it accepts.

**For someone committing $40, any improvement would have to appear in a comprehensible price, an outcome defined before purchase and rights that can actually be exercised.** Legal classification should clarify what they are buying and who answers for the service. It does not, by itself, remove the possibility of losing the $40.

## Method and limitations

Documentary analysis as of **28 September 2026**. The operating rules are described from Polymarket’s documentation. No audit of its code, reserves or surveillance was performed. French and US proceedings are reported at the stage documented by regulators, the company and Reuters. No interviews or direct requests for comment were conducted.

All three graphics are **fictional simulations calculated by l0g**, with no live odds. They exclude fees, taxes, interest and collateral risk; other assumptions appear in the captions. The EU, UK, international platform and Polymarket US are distinct scopes.

## Further reading

Our analysis of [banks financing oil traders](/en/analysis/banking-on-oil-2-banks-financing-trafigura/) explains the cash demands a hedge can create. The article on [Truth API and presidential speech as market data](/en/analysis/truth-api-presidential-speech-market-data-feed/) explores the commercial value of information and conflicts around access to it.

## Sources and documents

Sources consulted on 28 September 2026. Company announcements express their authors’ positions; litigation announcements set out the claimant’s allegations and requests.

- **Polymarket / PR Newswire** · 2026-09-09. [Polymarket joins Blockchain for Europe to support with expansion into Europe](https://www.prnewswire.co.uk/news-releases/polymarket-joins-blockchain-for-europe-to-support-with-expansion-into-europe-302873756.html).
- **European Commission** · undated page. [Online gambling](https://single-market-economy.ec.europa.eu/sectors/online-gambling_en).
- **ESMA / MiFID II** · undated page. [Article 34: Freedom to provide investment services and activities](https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/mifid-ii/article-34-freedom-provide-investment).
- **ESMA** · 2026-07-03. [Public Statement on the application of the national product intervention measures on binary options to event contracts](https://www.esma.europa.eu/sites/default/files/2026-07/ESMA35-243228190-8148_Public_Statement_on_the_application_of_the_national_product_intervention_measures_on_binary_options_to_event_contracts.pdf).
- **ESMA** · 2026-09-10. [TRV Risk Monitor 2, 2026](https://www.esma.europa.eu/sites/default/files/2026-09/ESMA50-1949966494-4282_TRV_Risk_Monitor_2_2026.pdf).
- **AMF** · undated page. [Option binaire](https://www.amf-france.org/fr/option-binaire).
- **FCA** · undated page. [FCA perimeter report](https://www.fca.org.uk/publications/corporate-documents/fca-perimeter-report).
- **FCA** · 2019-03-29. [FCA confirms permanent ban on the sale of binary options to retail consumers](https://www.fca.org.uk/news/statements/fca-confirms-permanent-ban-sale-binary-options-retail-consumers).
- **ANJ** · 2026-07-17. [Promotion d’une offre de jeux d’argent illégale : blocage du site Polymarket](https://anj.fr/promotion-dune-offre-de-jeux-dargent-illegale-blocage-du-site-polymarket).
- **Polymarket** · undated page. [Prices & Orderbook](https://docs.polymarket.com/concepts/prices-orderbook).
- **Polymarket** · undated page. [Positions & Tokens](https://docs.polymarket.com/concepts/positions-tokens).
- **Polymarket** · undated page. [Polymarket USD](https://docs.polymarket.com/concepts/pusd).
- **Polymarket** · undated page. [Resolution](https://docs.polymarket.com/concepts/resolution).
- **Polymarket** · 2026-07-10. [Trading Fees](https://help.polymarket.com/en/articles/13364478-trading-fees).
- **Intercontinental Exchange** · 2026-02-11. [ICE Launches Polymarket Signals and Sentiment Tool](https://ir.theice.com/press/news-details/2026/ICE-Launches-Polymarket-Signals-and-Sentiment-Tool-Turning-Crowd-Sourced-Dynamic-Views-into-Market-Opportunities/default.aspx).
- **Diercks, Katz, Wright / Federal Reserve** · 2026-02. [Kalshi and the Rise of Macro Markets](https://www.federalreserve.gov/econres/feds/kalshi-and-the-rise-of-macro-markets.htm).
- **CFTC** · undated page. [Designated Contract Markets: QCX LLC d/b/a Polymarket US](https://www.cftc.gov/IndustryOversight/IndustryFilings/TradingOrganizations/49571).
- **CFTC** · 2025-11-24. [QCX / Polymarket US Amended Order of Designation](https://www.cftc.gov/media/12806/download?attachment=).
- **Office of the New York Attorney General** · 2026-09-24. [Lawsuit against QCX LLC d/b/a Polymarket US](https://ag.ny.gov/press-release/2026/attorney-general-james-and-governor-hochul-announce-lawsuit-against-polymarket).
- **Polymarket** · undated page. [Market Integrity](https://integrity.polymarket.com/).
- **ESMA / MiFID II** · undated page. [Article 24: General principles and information to clients](https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/mifid-ii/article-24-general-principles-and).
- **Reuters / Investing.com** · 2026-09-24. [Polymarket sues New York attorney general to block regulation of its prediction market](https://www.investing.com/news/stock-market-news/polymarket-sues-new-york-attorney-general-to-block-regulation-of-its-prediction-market-4916415).
- **Polymarket / PR Newswire** · 2026-08-21. [Polymarket files petition to challenge ANJ ruling](https://www.prnewswire.co.uk/news-releases/polymarket-files-petition-to-challenge-anj-ruling-302856772.html).
