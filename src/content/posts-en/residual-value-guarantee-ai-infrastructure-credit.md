---
title: "The residual value guarantee, the blind spot of the credit that finances AI"
description: "AI data centers are increasingly financed off balance sheet, through vehicles that lease the hardware and rely on a residual value guarantee. Meta signed one over sixteen years for Hyperion. A breakdown of the structure, the chip-depreciation risk, and the precedent of the 2008 auto-leasing bust."
pubDate: 2026-07-15T23:55:00+02:00
updatedDate: 2026-07-15T23:55:00+02:00
tags: ["private credit", "ai", "data centers", "systemic risk", "valuation", "leasing"]
draft: false
sourceArticle: "valeur-residuelle-garantie-credit-infrastructure-ia"
sourceUpdatedDate: 2026-07-15
---

The financing of artificial intelligence has changed in nature without the public debate really noticing. The tens of billions poured into compute centers no longer take only the form of classic corporate debt. They pass through dedicated vehicles that buy the hardware, lease it to the operator, and rest on a discreet but central promise: the residual value guarantee. This clause sets the floor value the asset will be worth at the end of the lease. It makes the structure financeable, takes it off the operator's balance sheet, and shifts to a guarantor the hardest risk to estimate in the whole chain: how much will a data center packed with chips that go obsolete in three years be worth in ten or fifteen?

## Leasing the brick, guaranteeing the wreck

The best-documented case is Meta's. In October 2025, the group financed its Hyperion campus, in Louisiana, through a special-purpose vehicle named Beignet Investor LLC, which raised about **$27.3bn** of senior secured notes at 6.581%, maturing 2049, rated A+ by S&P. According to [Bisnow](https://www.bisnow.com/national/news/data-center-capital-markets/meta-pushes-its-largest-data-center-project-off-its-books-with-27b-joint-venture-131490), Blue Owl funds hold 80% of the joint venture and Meta 20%, with investors paid not by corporate debt but by the operating rent Meta pays the vehicle. The debt does not appear on the group's balance sheet.

The pivot of the structure fits in one signature. According to [Global Data Center Hub](https://www.globaldatacenterhub.com/p/meta-blue-owls-27b-bet-is-this-the), Meta granted investors a residual value guarantee over **sixteen years**: if the campus value falls below an agreed threshold and Meta decides not to renew the lease, the group must repay the vehicle's investors. The guarantee is what lets creditors accept a very long-lived asset without directly bearing the risk that it depreciates faster than expected. The law firm Quinn Emanuel moreover ranks these structures among the [new hotbeds of litigation](https://www.quinnemanuel.com/media/4dzkfccz/client-alert-ai-data-center-financing-and-litigation-risks.pdf) in AI financing, precisely because of the uncertainty over the exit value.

The SPV that buys then leases, the operator that guarantees the end-of-life value, the debt kept off balance sheet: the mechanism is nothing new. It is the old finance lease, applied to an asset whose true economic life no one knows.

## Private credit joins the loop

What Meta does with Blue Owl, the compute operators do with [private credit](/en/guides/read-private-credit-risk/), pushing the logic a notch further: they back the debt directly with the chips. CoreWeave, the leading such neocloud, inaugurated in August 2023 the first loan collateralised by Nvidia H100 GPUs, arranged by Magnetar and Blackstone. The move has since changed scale. According to [CoreWeave](https://investors.coreweave.com/news/news-details/2026/CoreWeave-Closes-Landmark-8-5-Billion-Financing-Facility-Achieving-First-Investment-Grade-Rated-GPU-backed-Financing/default.aspx), its DDTL 4.0 facility of **$8.5bn**, rated A3 by Moody's and A (low) by DBRS, is the first financing backed by compute hardware to reach investment grade, secured by a $14.2bn contract with Meta.

The falling cost of capital tells of the market's growing confidence. According to [Quartz](https://qz.com/gpu-collateralized-debt-ai-neocloud-coreweave-financing-risks-050526), CoreWeave borrowed against GPUs at about 15% in 2023; the fixed tranche of the DDTL 4.0 comes in around 5.9% in spring 2026. The same article recalls the two implicit bets of any chip-backed loan: that the hardware keeps enough value over the life of the loan, and that the utilisation rate stays high enough to service the debt. Yet a high-end GPU loses about half its resale value in three years. [Forbes](https://www.forbes.com/sites/daraabasiita/2026/06/09/gpu-debt-has-gone-investment-grade-heres-who-holds-the-risk/) poses the question that follows logically: once this debt has gone investment grade, who really bears the risk?

Private credit does not stop at lending to neoclouds. It also structures the biggest bets on AI. We documented this with the **$35bn** financing closed by Apollo and Blackstone for Anthropic, [analysed here](/en/analysis/private-credit-record-default-liquidity-closing/): a vehicle buys Google's TPU chips, leases them to Anthropic, and the whole is backed by residual value guarantees from Broadcom and payment guarantees from Google ([Bloomberg](https://www.bloomberg.com/news/articles/2026-06-05/apollo-wraps-up-35-billion-debt-to-buy-ai-chips-for-anthropic)). The same brick recurs everywhere: when the credit quality of the asset is not enough, you add a guarantor.

## The heart of the calculation: the depreciation curve

The whole soundness of these structures rests on one accounting assumption: the period over which the hardware is depreciated. The longer it is, the lower the annual cost looks, the higher the reported profits, and the more a distant residual value seems credible. That is precisely where the consensus cracks.

Investor Michael Burry brought the subject into the open in late 2025. According to [CNBC](https://www.cnbc.com/2025/11/14/ai-gpu-depreciation-coreweave-nvidia-michael-burry.html), Google, Oracle and Microsoft depreciate their AI hardware over **five to six years**, when the renewal cadence of Nvidia chips would bring their real economic life down to **two or three years**. Burry puts at about **$176bn** the understated depreciation, and therefore the overstated profits, of the sector between 2026 and 2028. Nvidia responded with a memo to analysts disputing the calculation and rejecting any comparison with past accounting frauds. The divergence is already visible in practice: in 2025, Amazon shortened the useful life used on part of its servers, while Meta extended it further.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 300" role="img" aria-label="Gap between the depreciation period used by hyperscalers and the estimated economic life of GPUs" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="300" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">How long does an AI chip live?</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Depreciation period used vs estimated economic life, in years.</text>
  <line x1="250" y1="80" x2="250" y2="230" stroke="#2a2c33" stroke-width="1"></line>
  <g font-size="11">
    <text x="242" y="104" fill="#d6d9df" text-anchor="end">Google, Oracle, Microsoft</text>
    <rect x="250" y="92" width="360" height="22" fill="#5eead4" opacity="0.85"></rect>
    <text x="618" y="108" fill="#5eead4" font-weight="700">up to 6 years (depreciated)</text>
    <text x="242" y="154" fill="#d6d9df" text-anchor="end">Estimated life (M. Burry)</text>
    <rect x="250" y="142" width="150" height="22" fill="#ff4d87" opacity="0.9"></rect>
    <text x="408" y="158" fill="#ff4d87" font-weight="700">2 to 3 years</text>
    <text x="242" y="204" fill="#d6d9df" text-anchor="end">Resale: -50% of value</text>
    <rect x="250" y="192" width="180" height="22" fill="#f5b13d" opacity="0.9"></rect>
    <text x="438" y="208" fill="#f5b13d" font-weight="700">~3 years</text>
  </g>
  <text x="32" y="262" fill="#8b909b" font-size="11.5">Depreciation understated by the sector, Burry estimate 2026-2028: ~$176bn.</text>
  <text x="32" y="282" fill="#8b909b" font-size="11">Sources: CNBC (14 Nov 2025), Quartz. Nvidia disputes the estimate.</text>
</svg>
<figcaption>The gap between the accounting depreciation period and the estimated economic life of the chips is the heart of the debate. The more the depreciation is spread out, the more a distant residual value looks credible. Sources: CNBC, Quartz.</figcaption>
</figure>

The stakes go beyond the accounting quarrel. The sector plans about **$1,000bn** of AI spending over five years according to the same source. If the real useful life of the chips is closer to three years than to six, the residual value on which the guarantees rest melts well before the maturity of the leases that protect it.

## The guarantee shifts the risk, it does not cancel it

A residual value guarantee does not make the depreciation risk disappear. It transfers it from the lender to the guarantor, most often the operator itself, a chip supplier, or a big technology name. The creditor gets a floor; the guarantor inherits a conditional commitment that triggers only in the bad scenario, when the asset's value collapses.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 340" role="img" aria-label="Risk-transfer chain in an off-balance-sheet AI infrastructure financing" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="340" fill="#0c0d10"></rect>
  <text x="32" y="36" fill="#f5f6f8" font-size="16" font-weight="700">Where the residual-value risk lands</text>
  <rect x="40" y="66" width="180" height="64" rx="8" fill="none" stroke="#7aa2f7" stroke-width="1.4"></rect>
  <text x="130" y="94" fill="#e7e9ee" font-size="13" text-anchor="middle" font-weight="600">Investors</text>
  <text x="130" y="114" fill="#8b909b" font-size="10.5" text-anchor="middle">private credit, insurers</text>
  <rect x="270" y="66" width="180" height="64" rx="8" fill="none" stroke="#5eead4" stroke-width="1.4"></rect>
  <text x="360" y="94" fill="#e7e9ee" font-size="13" text-anchor="middle" font-weight="600">Vehicle (SPV)</text>
  <text x="360" y="114" fill="#8b909b" font-size="10.5" text-anchor="middle">buys and leases the hardware</text>
  <rect x="500" y="66" width="180" height="64" rx="8" fill="none" stroke="#f5b13d" stroke-width="1.4"></rect>
  <text x="590" y="94" fill="#e7e9ee" font-size="13" text-anchor="middle" font-weight="600">Operator</text>
  <text x="590" y="114" fill="#8b909b" font-size="10.5" text-anchor="middle">pays the rent</text>
  <path d="M220 98 L266 98" stroke="#8b909b" stroke-width="1.6" fill="none"></path>
  <path d="M262 93 l8 5 l-8 5 z" fill="#8b909b"></path>
  <text x="243" y="86" fill="#8b909b" font-size="9.5" text-anchor="middle">debt</text>
  <path d="M500 118 L450 118" stroke="#8b909b" stroke-width="1.6" fill="none"></path>
  <path d="M454 113 l-8 5 l8 5 z" fill="#8b909b"></path>
  <text x="475" y="136" fill="#8b909b" font-size="9.5" text-anchor="middle">rent</text>
  <rect x="270" y="200" width="180" height="70" rx="8" fill="none" stroke="#ff4d87" stroke-width="1.6"></rect>
  <text x="360" y="228" fill="#ff4d87" font-size="13" text-anchor="middle" font-weight="700">Residual value</text>
  <text x="360" y="246" fill="#ff4d87" font-size="13" text-anchor="middle" font-weight="700">guarantee</text>
  <text x="360" y="264" fill="#8b909b" font-size="10" text-anchor="middle">floor promised at lease end</text>
  <path d="M360 130 L360 198" stroke="#ff4d87" stroke-width="1.4" fill="none" stroke-dasharray="5 4"></path>
  <path d="M590 130 C590 175 460 175 452 205" stroke="#ff4d87" stroke-width="1.6" fill="none"></path>
  <path d="M447 200 l3 10 l7 -7 z" fill="#ff4d87"></path>
  <text x="590" y="250" fill="#8b909b" font-size="10.5" text-anchor="middle">the guarantor</text>
  <text x="590" y="266" fill="#8b909b" font-size="10.5" text-anchor="middle">bears the risk</text>
  <text x="32" y="308" fill="#8b909b" font-size="11.5">The lender gets a floor; the guarantor inherits a commitment that triggers in the worst scenario.</text>
  <text x="32" y="326" fill="#8b909b" font-size="11">l0g diagram, based on the Meta-Blue Owl, CoreWeave and Apollo-Anthropic structures.</text>
</svg>
<figcaption>In these structures, the debt leaves the operator's balance sheet, but the depreciation risk returns to it through the guarantee. The lender is protected as long as the guarantor holds. l0g diagram.</figcaption>
</figure>

The weakness of the arrangement is correlation. A credit guarantee works when defaults are independent of one another. A residual value, by contrast, depends on a common factor: the chip generation. A technological rupture, a new architecture that halves the value of the installed hardware, does not hit an isolated data center but the whole fleet at the same time. The guarantees would then trigger simultaneously, at guarantors often exposed to the same shock, since they are the very actors of AI. The risk has been made invisible on the balance sheet, it has not been diversified.

## A precedent the market prefers to forget

The residual value guarantee is not an invention of the AI era. It has structured aircraft and rail finance leases for decades, where the lessee commits to cover the gap between the asset's resale price and an agreed value. Accounting moreover requires provisioning that gap as soon as the expected value falls below the guarantee, a warning signal that off-balance-sheet treatment tends to delay.

The most useful reminder comes from autos. In 2008, the collapse of vehicle resale prices blew up the residual value assumptions of captive lenders. According to its [annual report](https://www.sec.gov/Archives/edgar/data/0000040729/000119312509039567/d10k.htm), GMAC recorded $1.2bn of impairments on the residual values of its leases in 2008, and its auto-finance division swung from a $1.3bn profit to a $753m loss in nine months. The ill was not new: [WardsAuto](https://www.wardsauto.com/finance-insurance/the-rise-and-fall-of-automotive-leasing) recalls that the sector had already accumulated nearly $20bn of residual losses in the early 2000s, after artificially inflating those values to boost leasing volume. A floor set too optimistically, subscribed en masse, becomes a mass loss when the used market turns.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 320" role="img" aria-label="Mismatch between the fast markdown of a GPU and the horizon of a residual value guarantee" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="320" fill="#0c0d10"></rect>
  <text x="32" y="36" fill="#f5f6f8" font-size="16" font-weight="700">The markdown runs faster than the guarantee</text>
  <text x="32" y="57" fill="#8b909b" font-size="12">Resale value of a high-end GPU, as % of purchase price.</text>
  <line x1="70" y1="240" x2="680" y2="240" stroke="#2a2c33" stroke-width="1"></line>
  <line x1="70" y1="90" x2="70" y2="240" stroke="#2a2c33" stroke-width="1"></line>
  <text x="60" y="94" fill="#8b909b" font-size="10.5" text-anchor="end">100%</text>
  <text x="60" y="167" fill="#8b909b" font-size="10.5" text-anchor="end">50%</text>
  <text x="60" y="244" fill="#8b909b" font-size="10.5" text-anchor="end">0%</text>
  <polyline points="70,90 220,167 370,205 520,224 680,233" fill="none" stroke="#f5b13d" stroke-width="2.5"></polyline>
  <circle cx="220" cy="167" r="4.5" fill="#f5b13d"></circle>
  <text x="220" y="156" fill="#f5b13d" font-size="10.5" text-anchor="middle" font-weight="700">~50% at 3 years</text>
  <g fill="#8b909b" font-size="10.5" text-anchor="middle">
    <text x="70" y="258">0</text>
    <text x="220" y="258">3 yrs</text>
    <text x="370" y="258">6 yrs</text>
    <text x="520" y="258">9 yrs</text>
  </g>
  <line x1="640" y1="90" x2="640" y2="240" stroke="#ff4d87" stroke-width="1.5" stroke-dasharray="5 4"></line>
  <text x="636" y="108" fill="#ff4d87" font-size="10.5" text-anchor="end">Meta RVG: 16 years</text>
  <text x="32" y="292" fill="#8b909b" font-size="11.5">The guarantee protects the lender for sixteen years on an asset that has lost half its value in three.</text>
  <text x="32" y="310" fill="#8b909b" font-size="11">Markdown order of magnitude: Quartz. Guarantee horizon: Global Data Center Hub.</text>
</svg>
<figcaption>The timing mismatch is the sensitive point: the guarantee covers a long horizon, the asset depreciates fast. Between the two, the guarantor absorbs the difference. Sources: Quartz, Global Data Center Hub.</figcaption>
</figure>

## The other reading

One must avoid mechanically transposing 2008. Several arguments plead for the robustness of these structures, and it would be dishonest to leave them out.

First, the economic life of the chips could be longer than Burry says. Earlier generations do not end up scrapped: they move down to less demanding inference tasks, a real second-hand market absorbs part of the fleet, and the appetite for compute exceeds supply for now. Nvidia makes this case in its response to analysts. Next, the quality of the guarantors and the contracts matters: when the rent is owed by a top-tier tenant, like the CoreWeave contract backed by Meta, the immediate credit risk is low, which partly justifies the investment-grade ratings. Finally, a residual value guarantee triggers only on non-renewal of the lease; as long as the operator needs the campus and pays its rent, the guarantee remains a dormant clause.

The balance is therefore subtler than a mere omen of crisis. The question is not whether these structures are fraudulent, they are not, but how to measure a risk that has been moved out of sight, concentrated among a small number of correlated actors, and pegged to a life-span assumption the market itself does not settle.

## The signals to watch

Four indicators will say whether the promise holds. Revisions to the depreciation period of servers at the hyperscalers, first, because a general shortening would validate the fast-depreciation thesis. The formation of a real secondary market for GPUs, next, the only tangible proof of an observable rather than assumed residual value. The release cadence of new Nvidia architectures, which sets the pace of obsolescence of the installed fleet. And the scale of the guarantee commitments subscribed by the big actors, compared with their capacity to honour them if several triggered at once.

The credit that builds AI has found, in the residual value guarantee, the tool that makes infrastructure financeable at scale. The same tool concentrates a depreciation risk no one knows how to quantify, on assets whose useful life remains in dispute, at guarantors who are also the first exposed to the turn. The debt has left the balance sheets. The bet has stayed on them, whole.

## Sources

- Bisnow, "Meta Pushes Its Largest Data Center Project Off Its Books With $27B JV" (Beignet Investor SPV, $27.3bn of notes at 6.581%, Blue Owl 80% / Meta 20%, operating rent): https://www.bisnow.com/national/news/data-center-capital-markets/meta-pushes-its-largest-data-center-project-off-its-books-with-27b-joint-venture-131490
- Global Data Center Hub, "Meta + Blue Owl's $27B Bet" (sixteen-year residual value guarantee, repayment of investors on non-renewal): https://www.globaldatacenterhub.com/p/meta-blue-owls-27b-bet-is-this-the
- Quinn Emanuel, "AI Data Center Financing and Litigation Risks" (legal risks of off-balance-sheet structures and the exit value): https://www.quinnemanuel.com/media/4dzkfccz/client-alert-ai-data-center-financing-and-litigation-risks.pdf
- CoreWeave, press release on the $8.5bn DDTL 4.0 facility, rated A3 / A (low), first investment-grade GPU-backed financing, $14.2bn Meta contract: https://investors.coreweave.com/news/news-details/2026/CoreWeave-Closes-Landmark-8-5-Billion-Financing-Facility-Achieving-First-Investment-Grade-Rated-GPU-backed-Financing/default.aspx
- Quartz, "GPU-collateralized debt explained" (cost of capital from 15% in 2023 to ~5.9% in 2026, markdown of about 50% in three years, implicit bets on value and utilisation): https://qz.com/gpu-collateralized-debt-ai-neocloud-coreweave-financing-risks-050526
- Forbes, "GPU Debt Has Gone Investment Grade. Here's Who Holds The Risk" (June 2026): https://www.forbes.com/sites/daraabasiita/2026/06/09/gpu-debt-has-gone-investment-grade-heres-who-holds-the-risk/
- CNBC, "The question everyone in AI is asking: How long before a GPU depreciates?" (14 Nov 2025: 5-6 year depreciation vs 2-3 year life, Burry estimate of $176bn understated depreciation 2026-2028, Nvidia memo, Amazon shortens / Meta extends, ~$1,000bn of AI capex): https://www.cnbc.com/2025/11/14/ai-gpu-depreciation-coreweave-nvidia-michael-burry.html
- Bloomberg, "Apollo Wraps Up $35 Billion Debt to Buy AI Chips for Anthropic" (TPU vehicle, residual value guarantees from Broadcom, payment guarantees from Google): https://www.bloomberg.com/news/articles/2026-06-05/apollo-wraps-up-35-billion-debt-to-buy-ai-chips-for-anthropic
- GMAC LLC, annual report (Form 10-K) FY2008, SEC ($1.2bn of impairments on residual values in 2008, loss at the auto-finance division): https://www.sec.gov/Archives/edgar/data/0000040729/000119312509039567/d10k.htm
- WardsAuto, "The Rise and Fall of Automotive Leasing" (nearly $20bn of residual losses in the early 2000s, inflated residual values): https://www.wardsauto.com/finance-insurance/the-rise-and-fall-of-automotive-leasing

*This article is journalistic analysis and does not constitute investment advice. Market data is cited as of the date of its sources.*
