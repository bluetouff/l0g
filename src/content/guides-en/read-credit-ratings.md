---
title: "Reading a credit rating: scales, default and the issuer-pays conflict"
description: "A reference guide to credit ratings: what a rating really measures (a probability of default, not a price or a guarantee), the scales of S&P, Moody's and Fitch and the investment grade / high yield frontier, the role of approved agencies (NRSROs) and the conflict of the issuer-pays model, default rates by rating and the transition matrix, the difference between a public and a private rating, and what a rating does not say. With GPU-backed debt and insurers' private ratings as case studies."
summary: "A credit rating is an opinion on the probability that a borrower defaults, expressed on a scale from AAA (safest) to D (in default). The decisive frontier separates investment grade (BBB- and above) from high yield below. Three approved agencies, S&P, Moody's and Fitch, hold about 95% of the market, under an issuer-pays model that carries a structural conflict of interest. Default rates rise sharply as the rating falls. Reading a rating means knowing its scale, its dynamics (transition matrix), its limits, and telling a public rating from a private one, often more lenient."
pubDate: 2026-07-16T18:40:00+02:00
updatedDate: 2026-07-16T18:40:00+02:00
sourceGuide: "lire-une-notation-de-credit"
sourceUpdatedDate: 2026-07-16T18:40:00+02:00
tags: ["credit", "markets", "regulation", "risk", "bonds"]
category: marches
draft: false
---

*A credit rating looks like a school grade, and that is the first trap. It does not say whether a bond is a good investment, nor whether its price is fair. It says one thing, with deliberately limited precision: how likely the borrower is not to repay. This opinion, produced by a handful of agencies paid by the very issuers they rate, governs trillions of regulated allocation. Understanding it means knowing what it measures, what it is worth, and above all what it does not say. This guide lays out the scales, the default rates, the model's conflict and the fracture between public and private ratings, as an extension of our guide on [credit spreads](/en/guides/read-credit-spreads-oas/).*

## What a rating measures, and what it is not

A credit rating is an opinion on a borrower's ability and willingness to service its debt, summed up in a symbol. It bears on default risk, sometimes complemented by an estimate of the loss given default. It is neither a price, nor a buy recommendation, nor a guarantee. A bond rated AAA can lose 30% of its value if rates rise, without any default occurring: the rating says nothing about market risk, only about credit risk.

This distinction is the source of the costliest misunderstandings. In 2008, securitisation tranches rated AAA collapsed, not because the agencies had lied about default risk in the strict sense, but because the market had taken the rating for a guarantee of overall safety. Reading a rating means first bringing it back to its exact perimeter: a probability of default, over a given horizon, as of the date of the analysis.

## The scales: AAA down to D, and the decisive frontier

The three big agencies use parallel scales. S&P and Fitch share the same alphabet: AAA, then AA, A, BBB, and so on down to D for default, with intermediate notches marked by a plus or a minus. Moody's uses a distinct notation: Aaa, Aa, A, Baa, with numeric modifiers 1, 2, 3.

The frontier that matters is not at the top of the scale, but in its middle. An issuer is investment grade as long as it is rated BBB- or better at S&P and Fitch, Baa3 or better at Moody's. Below begins high yield, also called speculative or "junk". This line is not gradual: crossing it downward, becoming a "fallen angel", suddenly excludes the issuer from many regulated portfolios constrained to investment grade, forcing sales and widening its [spread](/en/guides/read-credit-spreads-oas/). A notch around this frontier therefore weighs far more than a notch elsewhere on the scale.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 340" role="img" aria-label="S&P/Fitch and Moody's rating scales, and the frontier between investment grade and high yield" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="340" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">The credit ladder and its fault line</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">S&P / Fitch on the left, Moody's on the right. The IG / HY frontier is at BBB- / Baa3.</text>
  <text x="90" y="86" fill="#8b909b" font-size="11" text-anchor="middle">S&P / Fitch</text>
  <text x="250" y="86" fill="#8b909b" font-size="11" text-anchor="middle">Moody's</text>
  <g font-size="12.5" fill="#5eead4">
    <text x="90" y="112" text-anchor="middle">AAA</text><text x="250" y="112" text-anchor="middle">Aaa</text>
    <text x="90" y="134" text-anchor="middle">AA</text><text x="250" y="134" text-anchor="middle">Aa</text>
    <text x="90" y="156" text-anchor="middle">A</text><text x="250" y="156" text-anchor="middle">A</text>
    <text x="90" y="178" text-anchor="middle">BBB</text><text x="250" y="178" text-anchor="middle">Baa</text>
  </g>
  <text x="410" y="150" fill="#5eead4" font-size="13" font-weight="700">Investment grade</text>
  <text x="410" y="170" fill="#8b909b" font-size="11">low default probability,</text>
  <text x="410" y="186" fill="#8b909b" font-size="11">eligible for regulated portfolios</text>
  <line x1="40" y1="196" x2="680" y2="196" stroke="#ff4d87" stroke-width="1.5" stroke-dasharray="6 4"></line>
  <text x="40" y="212" fill="#ff4d87" font-size="11" font-weight="700">BBB- / Baa3 frontier: the fallen angel crosses here</text>
  <g font-size="12.5" fill="#ff4d87">
    <text x="90" y="238" text-anchor="middle">BB</text><text x="250" y="238" text-anchor="middle">Ba</text>
    <text x="90" y="260" text-anchor="middle">B</text><text x="250" y="260" text-anchor="middle">B</text>
    <text x="90" y="282" text-anchor="middle">CCC</text><text x="250" y="282" text-anchor="middle">Caa</text>
    <text x="90" y="304" text-anchor="middle">D</text><text x="250" y="304" text-anchor="middle">C</text>
  </g>
  <text x="410" y="266" fill="#ff4d87" font-size="13" font-weight="700">High yield (speculative)</text>
  <text x="410" y="286" fill="#8b909b" font-size="11">rising default risk, high spread</text>
  <text x="32" y="330" fill="#8b909b" font-size="11">Sources: S&P Global, Moody's, Fitch (public scales).</text>
</svg>
<figcaption>Crossing the BBB- / Baa3 line downward excludes the issuer from portfolios constrained to investment grade. A notch at this frontier weighs more than anywhere else. Sources: S&P, Moody's, Fitch.</figcaption>
</figure>

## Default rates: what the rating actually predicts

A rating is only worth anything if it predicts. History shows it does, in broad strokes. The one-year default probability climbs sharply as the rating falls: close to zero for a AAA, on the order of 0.2% for a BBB, 0.6% for a BB, 3% for a B, and up to 26% for a CCC or below. Cumulatively over five years, the gap widens further: less than 2% defaults for investment grade, more than 20% for an issuer rated B.

This non-linear profile is a rating's real message. The gap between AAA and BBB, both investment grade, is modest. The gap between BB and CCC, both speculative, is dizzying. The rating does not measure a risk proportional to the position on the scale: it measures a risk that explodes at the bottom. That is why a portfolio can easily absorb a few BBBs but comes apart if it accumulates CCCs.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 320" role="img" aria-label="One-year default probability by credit rating" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="320" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Default explodes at the bottom of the scale</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">One-year default probability, by rating, in percent (orders of magnitude).</text>
  <line x1="70" y1="250" x2="680" y2="250" stroke="#2a2c33" stroke-width="1"></line>
  <line x1="70" y1="90" x2="70" y2="250" stroke="#2a2c33" stroke-width="1"></line>
  <text x="60" y="254" fill="#8b909b" font-size="10.5" text-anchor="end">0</text>
  <text x="60" y="170" fill="#8b909b" font-size="10.5" text-anchor="end">13</text>
  <text x="60" y="94" fill="#8b909b" font-size="10.5" text-anchor="end">26</text>
  <g text-anchor="middle">
    <rect x="96" y="249" width="54" height="1" fill="#5eead4"></rect>
    <text x="123" y="266" fill="#8b909b" font-size="11">AAA</text><text x="123" y="242" fill="#5eead4" font-size="10">~0</text>
    <rect x="196" y="248" width="54" height="2" fill="#5eead4"></rect>
    <text x="223" y="266" fill="#8b909b" font-size="11">BBB</text><text x="223" y="240" fill="#5eead4" font-size="10">0.2</text>
    <rect x="296" y="246" width="54" height="4" fill="#f5b13d"></rect>
    <text x="323" y="266" fill="#8b909b" font-size="11">BB</text><text x="323" y="238" fill="#f5b13d" font-size="10">0.6</text>
    <rect x="396" y="232" width="54" height="18" fill="#f5b13d"></rect>
    <text x="423" y="266" fill="#8b909b" font-size="11">B</text><text x="423" y="224" fill="#f5b13d" font-size="10">3</text>
    <rect x="496" y="98" width="54" height="152" fill="#ff4d87"></rect>
    <text x="523" y="266" fill="#8b909b" font-size="11">CCC / C</text><text x="523" y="90" fill="#ff4d87" font-size="11" font-weight="700">26</text>
  </g>
  <text x="32" y="298" fill="#8b909b" font-size="11">Cumulative 5-year: &lt; 2% defaults in investment grade, &gt; 20% for a B. Sources: S&P Global, historical data.</text>
</svg>
<figcaption>The rating measures not a linear risk but one that runs away at the bottom of the scale. A few notches lower, and the default probability changes order of magnitude. Source: S&P Global.</figcaption>
</figure>

To grasp the dynamics rather than the snapshot, analysts use the transition matrix: a table that gives, for each rating, the probability of migrating to another over one year, up, down or into default. It is what reveals the relative stability of high ratings and the volatility of low ones, and what feeds credit-risk models.

## The conflict of the issuer-pays model

That leaves the question that undermines the credibility of the whole: who pays for the rating? The three approved agencies, the NRSROs in the SEC's sense, hold about 95% of the world market. Their dominant model is issuer-pays: the company or government issuing the debt pays the agency to be rated. The agency's customer is therefore the very entity it is supposed to judge without indulgence.

This conflict is not theoretical. It pushes toward a bias for favourable ratings to keep the client, and it was identified as one of the causes of the 2008 crisis. It persists because the alternative, an investor-pays model, runs into the fact that a rating, once published, benefits everyone without anyone wanting to fund it. Reading a rating therefore means keeping in mind that its producer is paid by its subject, and cross-checking the rating with an independent signal, the market spread, which often moves faster and more honestly than the rating itself.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 250" role="img" aria-label="The loop of the issuer-pays model in credit rating" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="250" fill="#0c0d10"></rect>
  <text x="32" y="36" fill="#f5f6f8" font-size="16" font-weight="700">The conflict of the issuer-pays model</text>
  <rect x="60" y="80" width="200" height="70" rx="8" fill="none" stroke="#f5b13d" stroke-width="1.4"></rect>
  <text x="160" y="110" fill="#e7e9ee" font-size="13" text-anchor="middle" font-weight="600">Issuer</text>
  <text x="160" y="130" fill="#8b909b" font-size="10.5" text-anchor="middle">wants a good rating</text>
  <rect x="460" y="80" width="200" height="70" rx="8" fill="none" stroke="#5eead4" stroke-width="1.4"></rect>
  <text x="560" y="110" fill="#e7e9ee" font-size="13" text-anchor="middle" font-weight="600">Agency (NRSRO)</text>
  <text x="560" y="130" fill="#8b909b" font-size="10.5" text-anchor="middle">rates the issuer</text>
  <path d="M260 100 L456 100" stroke="#f5b13d" stroke-width="1.6" fill="none"></path>
  <path d="M452 95 l8 5 l-8 5 z" fill="#f5b13d"></path>
  <text x="358" y="90" fill="#f5b13d" font-size="10.5" text-anchor="middle">pays to be rated</text>
  <path d="M460 132 L264 132" stroke="#5eead4" stroke-width="1.6" fill="none"></path>
  <path d="M268 127 l-8 5 l8 5 z" fill="#5eead4"></path>
  <text x="358" y="148" fill="#5eead4" font-size="10.5" text-anchor="middle">assigns the rating</text>
  <text x="32" y="200" fill="#ff4d87" font-size="12.5" font-weight="700">The payer is the subject of the rating: a structural incentive to be generous.</text>
  <text x="32" y="228" fill="#8b909b" font-size="11">Three NRSROs (S&P, Moody's, Fitch) hold ~95% of the market. Source: SEC, GAO.</text>
</svg>
<figcaption>In the dominant model, the issuer pays the agency that rates it. The conflict is structural and permanent, which makes it necessary to cross-check the rating with an independent market signal. Sources: SEC, GAO.</figcaption>
</figure>

## Public versus private rating: the grey zone

The most current fracture is not between agencies, but between public and private ratings. A public rating is disseminated, tracked, revised under the market's gaze. A private rating, or "private letter rating", is disclosed only to the subscriber, often to let it fit an asset into a favourable regulatory box. It is the mechanism of the rated feeder notes that bring [private credit](/en/glossary/credit-prive/) onto insurers' balance sheets, described in our guide on [a life insurer's soundness](/en/guides/read-life-insurer-health/).

The private channel is not neutral. The research relayed by the specialist press shows that a security moving to a private rating is upgraded more than four times as often as it is downgraded, while the same move to a public rating produces as many upgrades as downgrades. The same drift reads elsewhere: [AI-chip-backed debt](/en/analysis/residual-value-guarantee-ai-infrastructure-credit/) reached investment grade on structures where the rating does much of the work. A favourable private rating is not false by nature, but its lack of public challenge makes it a signal to treat with caution.

## The reading grid

Five reflexes sum up the guide. Bring every rating back to its perimeter: a probability of default, not a guarantee or a price. Locate the issuer relative to the BBB- / Baa3 frontier, where a single notch changes everything. Read the rating in light of the historical default rate of its category, keeping in mind the run-away at the bottom of the scale. Remember who pays for the rating, and cross-check it with the market spread, quicker to punish. And tell a public rating from a private one, weighting the latter downward.

A credit rating is a valuable tool and a biased tool, both at once. It condenses a mass of analysis into a readable symbol, but it is produced by an actor paid by its subject, revised with a lag, and increasingly manufactured in a private channel that escapes scrutiny. To read it correctly is not to believe it or reject it, but to know exactly how far it carries, and to complete with the price what it does not say.

## Sources

- Wolf Street, "Corporate Bond Credit Ratings Scales: Moody's, S&P, Fitch" (parallel scales, notch correspondence, investment grade / high yield frontier): https://wolfstreet.com/credit-rating-scales-by-moodys-sp-and-fitch/
- Fidelity, "Bond Ratings" (investment grade at BBB- / Baa3, definition of high yield): https://www.fidelity.com/learning-center/investment-products/fixed-income-bonds/bond-ratings
- Wikipedia, "Nationally recognized statistical rating organization" (S&P, Moody's, Fitch ~95% of the market, SEC approval): https://en.wikipedia.org/wiki/Nationally_recognized_statistical_rating_organization
- U.S. GAO, "Credit Rating Agencies: Alternative Compensation Models for NRSROs" (issuer-pays model and its conflict of interest): https://www.gao.gov/products/gao-12-240
- S&P Global / market summaries, default rates by rating (one-year probabilities: ~0% AAA, 0.2% BBB, 0.6% BB, 3% B, 26% CCC/C; cumulative 5-year &lt; 2% in IG, &gt; 20% in B): https://investmentgrade.com/bond-ratings/
- RapidRatings, "Rating Transition Matrix" (transition matrix, rating migration probabilities): https://help.rapidratings.com/hc/en-us/articles/360045797832-Rating-Transition-Matrix
- Alternative Credit Investor, "Insurers and private credit: Ratings under the microscope" (asymmetry of revisions in private ratings): https://alternativecreditinvestor.com/2025/12/04/ratings-under-the-microscope/

*This guide is educational analysis and does not constitute investment advice. Default rates are historical orders of magnitude, cited as of the date of their sources.*
