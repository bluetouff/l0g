---
title: "The risk that goes in circles"
description: "An investigation into synthetic risk transfer, the most elegant and most circular mechanism in US finance. A bank keeps its loans on its balance sheet but sells their risk to a hedge fund, often with money the bank itself lent it. The loan does not move, the risk seems to vanish, the capital is freed. More than a trillion dollars of loans are already hedged this way, and AI data-centre debt is pouring in. Anatomy of a circle regulators are only starting to see."
pubDate: 2026-07-28T14:13:00+02:00
updatedDate: 2026-07-28T14:13:00+02:00
tags: ["international", "banks", "private credit", "securitisation", "risk"]
draft: false
sourceArticle: "transfert-synthetique-risque-srt-cercle"
sourceUpdatedDate: 2026-07-28
---

*There is in US finance a sleight of hand so elegant it becomes unsettling. A bank holds a portfolio of loans it would rather not carry, because they weigh on its regulatory capital. The intuitive solution would be to sell the loans. It does something subtler: it keeps the loans on its balance sheet but sells their risk to an outside investor, a hedge fund or a private credit fund, which agrees to absorb the first losses in exchange for a double-digit return. The loan does not move an inch. The risk, though, seems to evaporate. And the capital tied up behind that risk is suddenly freed, ready to fund new loans. This operation is called synthetic risk transfer, and it has quietly hedged more than a trillion dollars of bank loans. The problem is not that it exists. The problem is what happens when you follow the risk to the end: it often comes back, through a side door, into the very bank that thought it had shed it.*

## The sleight of hand

Let us start with the mechanics, because everything else follows. In an SRT, the bank keeps legal ownership of its loans but buys protection against their default. Technically, it proceeds like a securitisation, cutting the portfolio into risk tranches, but without selling the assets: it sells only insurance on the first-loss tranche, the one that absorbs defaults first. The most common instrument is the credit-linked note: the investor pays capital upfront, collects a high coupon, and gets its capital back at maturity, less any losses on the reference portfolio. If the loans perform, it pockets a double-digit return; if they sour, it loses its stake, and the bank is compensated.

The intended effect is not economic, it is regulatory. By transferring the first-loss tranche, the bank can show its supervisor that it has shed most of the portfolio's credit risk, and therefore reduce the capital it must hold against it. Recent deals let banks [cut their capital requirements by an average of 43 basis points](https://www.risk.net/risk-quantum/7963229/srt-issuance-hits-%E2%82%AC260bn-as-capital-relief-grows), a considerable relief on balance sheets of hundreds of billions. The loan stays on the books, the client sees nothing, but the capital behind it is freed. It is the logical extension of the fight over capital we described in our analysis of [the Basel III rollback](/en/analysis/basel-iii-rollback-us-regulators-bank-capital/): what regulation demands on one side, engineering takes back on the other.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 360" role="img" aria-label="Mechanics of a synthetic risk transfer: the bank keeps the loans and sells the first-loss protection" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="360" fill="#0c0d10"/>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Sell the risk, keep the loan</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">The loan never leaves the balance sheet; only the first-loss protection is sold.</text>
  <rect x="40" y="86" width="300" height="210" fill="none" stroke="#2a2c33" stroke-width="1"/>
  <text x="54" y="108" fill="#d6d9df" font-size="12" font-weight="700">Bank</text>
  <text x="54" y="126" fill="#8b909b" font-size="11">Loan portfolio (stays on balance sheet)</text>
  <rect x="54" y="140" width="272" height="86" fill="#5eead4"/>
  <text x="66" y="170" fill="#0c0d10" font-size="12" font-weight="700">Senior tranche</text>
  <text x="66" y="188" fill="#0c0d10" font-size="11">kept by the bank</text>
  <rect x="54" y="234" width="272" height="46" fill="#ff4d87"/>
  <text x="66" y="262" fill="#0c0d10" font-size="12" font-weight="700">First-loss tranche (protected)</text>
  <rect x="440" y="150" width="240" height="120" fill="none" stroke="#2a2c33" stroke-width="1"/>
  <text x="454" y="176" fill="#d6d9df" font-size="12" font-weight="700">Investor</text>
  <text x="454" y="194" fill="#8b909b" font-size="11">hedge fund, private credit,</text>
  <text x="454" y="210" fill="#8b909b" font-size="11">insurer, pension fund</text>
  <text x="454" y="236" fill="#ff4d87" font-size="11">collects a high return,</text>
  <text x="454" y="252" fill="#ff4d87" font-size="11">absorbs the first losses</text>
  <line x1="326" y1="257" x2="440" y2="220" stroke="#ff4d87" stroke-width="2"/>
  <text x="330" y="300" fill="#ff4d87" font-size="11">protection ↗</text>
  <line x1="440" y1="240" x2="326" y2="272" stroke="#5eead4" stroke-width="2"/>
  <text x="330" y="320" fill="#5eead4" font-size="11">capital upfront ↙</text>
  <text x="40" y="346" fill="#8b909b" font-size="10">Result: regulatory capital freed, loans unchanged. Diagram based on the standard SRT structure.</text>
</svg>
<figcaption>The bank does not sell its loans, it sells the insurance on their first losses. On the surface, it has shed the risk and freed capital. The question, and the whole investigation rests here, is where that risk actually lands, and with whose money.</figcaption>
</figure>

## A market steps out of the shadows

Long confidential, reserved for a few European banks and a handful of specialist funds, the SRT has become a mass market. The trigger, on the American side, dates to 2023, when the Federal Reserve [recognised credit-linked notes as eligible for capital relief](https://www.philadelphiafed.org/the-economy/banking-and-financial-markets/banking-trends-synthetic-risk-transfers). US banks rushed in, to the point of now accounting for nearly 30% of global flow. The scale is dizzying: by the end of last year, banks had transferred the credit risk of [more than €905 billion, roughly a trillion dollars of loans, up 26% year on year](https://www.bloomberg.com/news/articles/2026-06-04/banks-offload-1-trillion-loan-risk-to-srt-investors-iacpm-says). The reference pool of European deals hit a [record €260 billion in 2024](https://www.risk.net/risk-quantum/7963229/srt-issuance-hits-%E2%82%AC260bn-as-capital-relief-grows), and US issuance rose from $29 billion to $41 billion in a year.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 300" role="img" aria-label="Growth of US synthetic risk transfer issuance between 2024 and 2025" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="300" fill="#0c0d10"/>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">The market steps out of the shadows</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">US SRT issuance, in billions of dollars.</text>
  <line x1="70" y1="230" x2="680" y2="230" stroke="#2a2c33" stroke-width="1"/>
  <rect x="150" y="150" width="140" height="80" fill="#8b909b"/>
  <text x="220" y="140" fill="#8b909b" font-size="14" font-weight="700" text-anchor="middle">29</text>
  <text x="220" y="252" fill="#d6d9df" font-size="12" text-anchor="middle">2024</text>
  <rect x="430" y="117" width="140" height="113" fill="#ff4d87"/>
  <text x="500" y="107" fill="#ff4d87" font-size="14" font-weight="700" text-anchor="middle">41</text>
  <text x="500" y="252" fill="#d6d9df" font-size="12" text-anchor="middle">2025</text>
  <text x="60" y="282" fill="#d6d9df" font-size="12">+41% in a year. Globally, more than $1 trillion of loans are now hedged this way.</text>
  <text x="60" y="298" fill="#8b909b" font-size="10">Sources: Bloomberg (IACPM), Risk.net, Philadelphia Fed. Annual US issuance.</text>
</svg>
<figcaption>In a year, US issuance jumped more than 40%, and the United States now makes up nearly a third of a global market hedging more than a trillion dollars of loans. What was a niche tool has become a pillar of bank capital management.</figcaption>
</figure>

On the other side of the table, a constellation of buyers has specialised. The big names of private credit and hedge funds, Magnetar, Ares, Apollo, Blue Owl, KKR, Blackstone, compete for the first-loss tranches, whose target returns reach the mid-teens. Some have built dedicated lines of tens of billions. In December 2025, Blackstone took the [first-loss protection on a €2 billion portfolio of large corporate loans from ABN AMRO](https://www.globenewswire.com/de/news-release/2025/12/11/3203635/0/en/ABN-AMRO-announces-significant-risk-transfer-transaction-with-Blackstone.html). These investors take real risk and book real losses when a portfolio sours; on that point, the market works as advertised.

## The awkward question: how much risk, really?

This is where the elegance starts to crack. An SRT transfers only one tranche, usually thin, the first loss. The bank keeps the senior tranche, that is, the catastrophe risk: the one that materialises only if losses exceed the cushion sold. In normal times, that tail risk is negligible, and the transfer looks complete. In a correlated shock, where many loans default at once, losses can pierce the first-loss tranche and climb back to the bank, precisely when it thought itself protected. Researchers put the question bluntly in a note with a telling title, ["synthetic, but how much risk transfer?"](https://www.suerf.org/publications/suerf-policy-notes-and-briefs/synthetic-but-how-much-risk-transfer/): the capital relief is immediate and certain, the disappearance of the risk is partial and conditional.

Add counterparty risk. The protection is only worth something if the investor can pay. In structures backed by a credit-linked note, the capital is paid upfront and locked, which limits that risk; but in unfunded variants, where the protection rests on a mere contractual promise, the bank stays exposed to the failure of its insurer. And these insurers are leveraged funds, less regulated than banks, and that is where the structure reveals its hidden flaw.

## The circle

Here is the heart of the investigation, and the reason an attentive investor should worry. To buy these first-loss tranches at attractive returns, private credit funds and hedge funds use leverage, that is, borrowed money. And from whom do they borrow? Often from the banks themselves. A bank sells the risk of its loans to a fund, and another bank, sometimes the same one, lends that fund the money to buy the protection. The risk goes out the door and comes back through the window. The Financial Stability Board has put a name on this: ["circles of risk"](https://www.bloomberg.com/news/articles/2025-12-08/srts-what-are-significant-risk-transfers-and-why-are-regulators-worried), where bank credit lent to the funds that buy back bank risk reintroduces that risk into the system. The International Monetary Fund devoted a working paper to the mechanism with a limpid title, ["Recycling Risk"](https://www.imf.org/-/media/files/publications/wp/2025/english/wpiea2025200-source-pdf.pdf).

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 320" role="img" aria-label="The circle of risk: the bank sells the risk to a fund that finances it with a bank loan, so the risk returns to the system" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="320" fill="#0c0d10"/>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">The circle of risk</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">The risk leaves the bank, then returns through the leverage that funds its buyer.</text>
  <rect x="40" y="96" width="150" height="70" fill="none" stroke="#5eead4" stroke-width="1.5"/>
  <text x="54" y="126" fill="#5eead4" font-size="12" font-weight="700">1. Bank</text>
  <text x="54" y="146" fill="#d6d9df" font-size="11">sells the risk</text>
  <rect x="230" y="96" width="150" height="70" fill="none" stroke="#f5b13d" stroke-width="1.5"/>
  <text x="244" y="126" fill="#f5b13d" font-size="12" font-weight="700">2. Fund</text>
  <text x="244" y="146" fill="#d6d9df" font-size="11">buys the protection</text>
  <rect x="420" y="96" width="160" height="70" fill="none" stroke="#f5b13d" stroke-width="1.5"/>
  <text x="434" y="126" fill="#f5b13d" font-size="12" font-weight="700">3. Fund</text>
  <text x="434" y="146" fill="#d6d9df" font-size="11">borrows with leverage</text>
  <rect x="530" y="200" width="150" height="70" fill="none" stroke="#ff4d87" stroke-width="1.5"/>
  <text x="544" y="230" fill="#ff4d87" font-size="12" font-weight="700">4. from a</text>
  <text x="544" y="250" fill="#ff4d87" font-size="12" font-weight="700">bank</text>
  <line x1="190" y1="131" x2="230" y2="131" stroke="#8b909b" stroke-width="2"/>
  <text x="196" y="124" fill="#8b909b" font-size="14">→</text>
  <line x1="380" y1="131" x2="420" y2="131" stroke="#8b909b" stroke-width="2"/>
  <text x="386" y="124" fill="#8b909b" font-size="14">→</text>
  <line x1="500" y1="166" x2="590" y2="200" stroke="#8b909b" stroke-width="2"/>
  <line x1="530" y1="235" x2="115" y2="235" stroke="#ff4d87" stroke-width="2" stroke-dasharray="6 4"/>
  <line x1="115" y1="235" x2="115" y2="166" stroke="#ff4d87" stroke-width="2" stroke-dasharray="6 4"/>
  <text x="150" y="228" fill="#ff4d87" font-size="12" font-weight="700">the risk re-enters the banking system</text>
  <text x="40" y="306" fill="#8b909b" font-size="10">Based on the warnings of the FSB ("circles of risk") and the IMF ("Recycling Risk"). Schematic representation.</text>
</svg>
<figcaption>The transfer is real on paper, but financing the buyer makes it partly circular. When the bank lends to the fund that insures it, it has not removed the risk, it has disguised and moved it one notch, towards a more opaque and more leveraged player. The capital relief, meanwhile, stayed very real.</figcaption>
</figure>

The consequence is twofold. First, the capital relief can be partly illusory: the bank shows less risk, but the banking system as a whole still carries as much, or more, since it now has a leveraged intermediary in the middle. Second, the risk has changed regulator: leaving a supervised, marked and capitalised bank balance sheet, it landed at a less regulated fund, whose leverage amplifies losses, and which we file under [non-bank financial intermediation](/en/analysis/shadow-banking-nonbank-intermediation/). It is the same translation we documented for consumer credit, [from the credit card to the annuity](/en/analysis/from-the-credit-card-to-the-annuity/): the risk does not disappear, it migrates towards the least visible compartment.

## The new fuel: AI data-centre debt

If this already-strained market suddenly worries more, it is because of what is pouring into it. US banks have lent colossal sums to finance the construction of data centres for artificial intelligence, a debt whose architecture we described in our investigation of [the debt behind AI](/en/analysis/the-debt-behind-ai/). That exposure has swelled to the point of becoming, in a Bank of America survey, the [top systemic credit risk named by 48% of managers for 2026](https://startupfortune.com/ai-data-center-debt-has-climbed-to-the-top-of-wall-streets-credit-risk-watchlist/). What do banks do with this parcel that has grown too heavy? They transfer it. Morgan Stanley, Citi, JPMorgan and Goldman Sachs have begun [offloading the risk of their AI infrastructure loans to private credit, hedge funds and pension funds via SRTs](https://www.fortune.com/2025/12/04/morgan-stanley-significant-risk-transfer-loans-data-center-ai-infrastructure-exposure). The head of credit risk sharing at Man Group sums up the worry in a phrase: the sums involved are "out of scale to anything we've thought about, ever."

The structure then becomes doubly circular. A bank lends to a data-centre developer; it transfers the risk of that loan to a private credit fund; that fund is sometimes the same one financing, elsewhere, the construction of the data centre or the AI company that will fill it. The risk turns inside a small circle of players who carry, through different vehicles, both ends of the same chain. If the AI bet disappoints, it will not be independent counterparties that absorb the shock, but a handful of funds exposed everywhere at once.

## The last circle: when risk turns liquid

The chain does not stop at the private credit fund. It now has an extra link, perhaps the most vertiginous, because it brings the risk all the way to the ordinary saver in a form that erases every trace of it: the ETF, that listed index fund which trades on an exchange like a stock. To grasp the danger, one must first grasp how an ETF manufactures its liquidity, because that is exactly where the trap closes.

An ETF does not keep its assets in a frozen vault. Its liquidity rests on a discreet mechanism, the creation and redemption of shares. Authorised intermediaries, the authorised participants, can at any moment create new shares by delivering the underlying securities to the fund, or destroy shares by taking those securities back. This back-and-forth anchors the share price to the portfolio's real value: if the share trades too dear, more are created to bring the price down; too cheap, some are destroyed to support it. The system is ingenious, but it rests entirely on one condition: that the underlying securities themselves buy and sell without friction. As long as the underlying is liquid, so is the share.

Yet that is precisely what private credit lacks. A private loan does not sell in a day, often not in a month; it has no continuous market price, only an estimate, a subject we dug into in our analysis of [one asset, two prices](/en/analysis/private-credit-one-asset-two-prices/). Wrapping such assets in an ETF amounts to promising daily liquidity on assets that have none. The creation-redemption mechanism jams the moment too many holders want out at once: the authorised participants cannot liquidate the underlying fast enough, the share detaches from its theoretical value, and the exit, wide in appearance, turns out to be narrow. It is a risk transfer of a new kind, no longer credit but liquidity, and it is more insidious because it looks painless as long as flows come in. Bond ETFs did, it is true, come through the March 2020 shock without breaking, their discount later closing; but they held listed bonds, not private loans stripped of a price.

This is no textbook hypothesis. The first widely distributed private credit ETF was [launched in late February 2025 by State Street with Apollo](https://www.cnbc.com/2025/02/27/state-street-apollo-team-up-to-launch-first-of-its-kind-private-credit-etf.html). To keep its liquidity promise, it was allowed to hold [between 10% and 35% of private assets, well beyond the usual 15% illiquid limit in an ETF, thanks to an agreement under which Apollo commits to buying those assets back, which immediately worried the SEC](https://www.wealthmanagement.com/etfs/state-street-apollo-s-private-credit-etf-raises-sec-concern). The regulator asked the only question that matters: if a single player, Apollo, provides the liquidity by buying back assets it originated itself, at what price will it do so, and what happens the day it stops buying? The promised liquidity then no longer rests on a deep market, but on the goodwill of a single counterparty, in a position of conflict of interest.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 300" role="img" aria-label="The liquidity illusion of a private credit ETF: a liquid share sitting on an illiquid underlying" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="300" fill="#0c0d10"/>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">The liquidity illusion</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">A liquid ETF share, sitting on private credit that is not.</text>
  <rect x="110" y="86" width="500" height="48" fill="#5eead4"/>
  <text x="360" y="115" fill="#0c0d10" font-size="12" font-weight="700" text-anchor="middle">ETF share: continuously listed, appears liquid</text>
  <rect x="345" y="134" width="30" height="46" fill="#f5b13d"/>
  <text x="392" y="161" fill="#f5b13d" font-size="11">liquidity = one player's promise</text>
  <rect x="110" y="180" width="500" height="48" fill="#ff4d87"/>
  <text x="360" y="209" fill="#0c0d10" font-size="12" font-weight="700" text-anchor="middle">Private credit (10 to 35%): illiquid, no continuous price</text>
  <text x="60" y="258" fill="#d6d9df" font-size="12">In calm, price ≈ value. In a rush, the door narrows and the share trades below value.</text>
  <text x="60" y="286" fill="#8b909b" font-size="10">Sources: SEC, CNBC, WealthManagement. Case of the PRIV ETF (State Street / Apollo, 2025). Schematic.</text>
</svg>
<figcaption>The ETF promises an immediate exit from contents that do not sell fast. Between the liquid share and the illiquid credit, a single bridge: one player's commitment to buy back. When the rush comes, that bridge gives way first, and the promised liquidity vanishes exactly when it is most needed.</figcaption>
</figure>

Here is the point to remember, and it reaches well beyond this one fund. In these wrappers, liquidity is not a property of the assets, it is a promise made by a counterparty. And a promise is worth only as long as the one making it has an interest in keeping it. Yet that interest evaporates exactly when it would be needed, when everyone wants to sell. The journey of risk, which we followed to a retiree's annuity [from the credit card to the annuity](/en/analysis/from-the-credit-card-to-the-annuity/), now sometimes ends in a retail brokerage account, in an instrument with the look of a stock and the substance of an illiquid loan. The saver thinks they hold liquidity; they hold, in reality, the last link of a chain that began with a loan a bank judged too heavy to keep.

## The other reading: a legitimate tool, not a bomb

It would be dishonest to paint the SRT as pure artifice, because the instrument has real virtues, and the regulators themselves have not banned it. The first argument in its favour is that it achieves genuine risk-sharing. A bank heavily concentrated on one sector, commercial real estate, AI, leveraged credit, can, through the SRT, redistribute that concentration to long-term investors, insurers and pension funds, who seek precisely that return and hold their positions to maturity. Seen that way, the SRT makes the system more resilient, not less, by dispersing a risk otherwise lodged in a few balance sheets.

The second argument is that these deals are bilateral, documented and known to the supervisor, unlike the opaque derivatives of before 2008. The Basel Committee published in February 2026 a [detailed report on these markets](https://www.jonesday.com/en/insights/2026/03/basel-committee-publishes-report-on-synthetic-risk-transfer-markets), a sign that authorities are following them closely rather than discovering them after the fact. Its conclusion is not a ban, but tighter monitoring, possible limits on capital relief, and better coordination between bank and non-bank supervisors. The third argument, made by the buying funds, is that banning leverage on these deals would dry up financing useful to the economy without removing the underlying risk. The first-loss tranche finds sophisticated buyers who know what they are buying, and this market has so far absorbed its losses without systemic incident.

## What the circle will not forgive

These counterpoints hold in calm times. They all say the same thing: as long as losses stay within the thickness of the sold tranche, as long as the buying funds can pay, as long as leverage stays contained, the SRT is a prudent management tool. The problem is that these three conditions degrade together, and precisely at the wrong moment. A correlated shock, on AI debt for instance, would do three things at once: it would pierce the first-loss tranches and send losses back to the banks; it would test the leveraged funds' ability to honour their protection; and it would push the lending banks to cut those same funds' leverage lines, drying up the market just when it needs to work. The three nets would tear at the same time.

That is why this mechanism should be read not as a fraud, but as an optimisation at the seam between the regulated and the unregulated, where risk is not removed but relabelled. The investor contemplating a US bank's freed capital should not ask "where did the risk go", but "who holds it now, and is it the bank that lent them the money to hold it". The answer, more and more, draws a circle. And a circle, in finance, has an unpleasant property: it has no end by which to hold it when everything starts turning the wrong way. To judge a bank's real soundness, one must now read what it has transferred as much as what it holds, an exercise our guide on [a bank's soundness](/en/guides/read-bank-health/) no longer exhausts on its own. The risk that goes in circles always ends up back where it started.

---

### Sources

- [Bloomberg, "Banks Offload $1 Trillion Loan Risk to SRT Investors, IACPM Says", 4 June 2026 (hedged exposure > €905bn / ~$1tn, +26% year on year)](https://www.bloomberg.com/news/articles/2026-06-04/banks-offload-1-trillion-loan-risk-to-srt-investors-iacpm-says)
- [Bloomberg, "Banks Love Significant Risk Transfers, and That Has Regulators Worried", 8 December 2025 (FSB warning on "circles of risk")](https://www.bloomberg.com/news/articles/2025-12-08/srts-what-are-significant-risk-transfers-and-why-are-regulators-worried)
- [Risk.net, "SRT issuance hits €260bn as capital relief grows" (record reference pool in 2024, average 43 basis points of capital relief)](https://www.risk.net/risk-quantum/7963229/srt-issuance-hits-%E2%82%AC260bn-as-capital-relief-grows)
- [Philadelphia Fed, "Banking Trends: Synthetic Risk Transfers" (2023 Fed guidance on credit-linked notes, mechanics and rise)](https://www.philadelphiafed.org/the-economy/banking-and-financial-markets/banking-trends-synthetic-risk-transfers)
- [Basel Committee, report on synthetic risk transfer markets, February 2026 (Jones Day summary: monitoring, possible limits on capital relief)](https://www.jonesday.com/en/insights/2026/03/basel-committee-publishes-report-on-synthetic-risk-transfer-markets)
- [IMF, "Recycling Risk: Synthetic Risk Transfers", working paper 2025/200 (circularity and risk recycling)](https://www.imf.org/-/media/files/publications/wp/2025/english/wpiea2025200-source-pdf.pdf)
- [SUERF, "Synthetic, but how much risk transfer?" (share of risk actually transferred, retained tail risk)](https://www.suerf.org/publications/suerf-policy-notes-and-briefs/synthetic-but-how-much-risk-transfer/)
- [Fortune, "Morgan Stanley explores significant risk transfer for data center and AI infrastructure exposure", 4 December 2025](https://www.fortune.com/2025/12/04/morgan-stanley-significant-risk-transfer-loans-data-center-ai-infrastructure-exposure)
- [Startup Fortune, "AI data center debt has climbed to the top of Wall Street's credit risk watchlist" (top systemic risk named by 48% of BofA managers)](https://startupfortune.com/ai-data-center-debt-has-climbed-to-the-top-of-wall-streets-credit-risk-watchlist/)
- [ABN AMRO, "ABN AMRO announces significant risk transfer transaction with Blackstone", 11 December 2025 (first-loss protection on €2bn of corporate loans)](https://www.globenewswire.com/de/news-release/2025/12/11/3203635/0/en/ABN-AMRO-announces-significant-risk-transfer-transaction-with-Blackstone.html)
- [CNBC, "State Street, Apollo team up to launch first of its kind private credit ETF", 27 February 2025 (launch of the PRIV ETF)](https://www.cnbc.com/2025/02/27/state-street-apollo-team-up-to-launch-first-of-its-kind-private-credit-etf.html)
- [WealthManagement, "State Street, Apollo's Private Credit ETF Raises SEC Concern" (10 to 35% private assets, Apollo as sole liquidity provider, SEC concerns on valuation and liquidity)](https://www.wealthmanagement.com/etfs/state-street-apollo-s-private-credit-etf-raises-sec-concern)
