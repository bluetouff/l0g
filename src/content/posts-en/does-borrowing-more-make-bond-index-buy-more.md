---
title: "Does borrowing more make the bond index buy more?"
description: "Major bond indices weight eligible debt by market value. The equation, LQD’s 3% issuer cap and the limits of a mechanism that is often reduced to a slogan."
pubDate: 2026-08-11T10:00:00+02:00
updatedDate: 2026-08-11T10:00:00+02:00
tags: ["markets", "bonds", "ETFs", "indices", "credit", "passive investing"]
draft: false
sourceArticle: "plus-vous-empruntez-plus-indice-vous-achete"
sourceUpdatedDate: 2026-08-11T10:00:00+02:00
---

An equity index usually gives more weight to companies with greater stock-market value. A market-value-weighted bond index follows a different quantity: **the market value of eligible debt still outstanding**. At the same price, an issuer that sells more bonds can therefore occupy more of the benchmark.

This formula supports a compelling criticism: the more a company borrows, the more index funds have to buy it. The claim contains some truth, but only after three corrections. The index does not admit all debt. It may cap each issuer. Finally, a bond ETF does not necessarily replicate every line to the last dollar.

The useful interpretation is neither a machine blindly rewarding leverage nor a perfectly neutral benchmark. **A bond index turns a filtered stock of debt into a reference portfolio.** Its filters reveal where the bias exists, where it stops and how it reaches the market in practice.

## The equation beneath the benchmark

The [Bloomberg Fixed Income Index Methodology](https://assets.bbhub.io/professional/sites/10/Bloomberg-Index-Publications-Fixed-Income-Index-Methodology.pdf), updated on 8 January 2026, defines a bond’s market value as:

**market value = (price + accrued interest) × current par amount outstanding**

The security’s weight is then its market value divided by the total market value of all eligible bonds. The rule is not trying to identify the best company. It measures the size of available paper within a selected universe, with the aim of building an index that investors can replicate.

The scale matters. The Federal Reserve’s Financial Accounts recorded **$7.510893 trillion of bonds** on the liabilities side of US nonfinancial corporate business in the first quarter of 2026, up from $7.393445 trillion in the preceding quarter. These figures cover the full nonfinancial corporate sector in the Z.1 table, not only the debt eligible for an investment-grade index. ([Federal Reserve via FRED](https://fred.stlouisfed.org/release/tables?eid=804211&rid=52))

A small imaginary index shows the raw mechanism. Assume three issuers, all bonds priced at par and no cap. A has 20 units of debt, B has 10 and C has 5. A therefore weighs 57.1% of the total. If A issues another 5 eligible units, its weight rises to 62.5% without any change in profitability, assets or governance.

<figure class="infographic" style="margin:2rem 0 2.25rem">
<svg viewBox="0 0 760 520" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="debt-weight-title-en debt-weight-desc-en" style="width:100%;height:auto;display:block;background:#0b1120;border:1px solid #26324a;border-radius:16px;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
<title id="debt-weight-title-en">Effect of a new issue on an issuer’s weight in an imaginary bond index</title>
<desc id="debt-weight-desc-en">In an imaginary uncapped index, issuer A moves from 20 to 25 units of debt. Its weight rises from 57.1 to 62.5 percent while B and C are diluted.</desc>
<style>.mobile{display:none}@media (max-width:640px){.desktop{display:none}.mobile{display:block}}</style>
<g class="desktop">
  <text x="40" y="50" fill="#f8fafc" font-size="24" font-weight="700">New issuance moves the weights</text>
  <text x="40" y="78" fill="#94a3b8" font-size="13">Imaginary example, bonds at par, no issuer cap</text>
  <text x="40" y="128" fill="#cbd5e1" font-size="14" font-weight="700">BEFORE</text><text x="430" y="128" fill="#cbd5e1" font-size="14" font-weight="700">AFTER: A ISSUES 5</text>
  <rect x="40" y="155" width="297" height="48" rx="7" fill="#3b82f6"/><text x="55" y="185" fill="#f8fafc" font-size="15" font-weight="700">A · 57.1%</text>
  <rect x="40" y="215" width="149" height="48" rx="7" fill="#14b8a6"/><text x="55" y="245" fill="#042f2e" font-size="15" font-weight="700">B · 28.6%</text>
  <rect x="40" y="275" width="74" height="48" rx="7" fill="#f59e0b"/><text x="124" y="305" fill="#fbbf24" font-size="15" font-weight="700">C · 14.3%</text>
  <rect x="430" y="155" width="250" height="48" rx="7" fill="#60a5fa"/><text x="445" y="185" fill="#0b1120" font-size="15" font-weight="700">A · 62.5%</text>
  <rect x="430" y="215" width="100" height="48" rx="7" fill="#14b8a6"/><text x="540" y="245" fill="#5eead4" font-size="15" font-weight="700">B · 25.0%</text>
  <rect x="430" y="275" width="50" height="48" rx="7" fill="#f59e0b"/><text x="490" y="305" fill="#fbbf24" font-size="15" font-weight="700">C · 12.5%</text>
  <path d="M355 239 H398" stroke="#f8fafc" stroke-width="2"/><polygon points="398,232 414,239 398,246" fill="#f8fafc"/>
  <rect x="40" y="365" width="680" height="72" rx="10" fill="#111c31" stroke="#334155"/>
  <text x="58" y="393" fill="#fbbf24" font-size="14" font-weight="700">A gains 5.4 percentage points of weight</text>
  <text x="58" y="417" fill="#cbd5e1" font-size="12">The increase comes from eligible debt outstanding, not from a credit opinion.</text>
  <text x="40" y="482" fill="#64748b" font-size="11">l0g calculation. Educational illustration with no market data.</text>
</g>
<g class="mobile" transform="scale(2.17)">
  <text x="16" y="21" fill="#f8fafc" font-size="9.5" font-weight="700">New issuance moves the weights</text>
  <text x="16" y="34" fill="#94a3b8" font-size="5.4">Imaginary example, at par, no cap</text>
  <text x="16" y="56" fill="#cbd5e1" font-size="6" font-weight="700">BEFORE</text><text x="180" y="56" fill="#cbd5e1" font-size="6" font-weight="700">AFTER</text>
  <rect x="16" y="66" width="137" height="17" rx="3" fill="#3b82f6"/><text x="22" y="77" fill="#f8fafc" font-size="5.8" font-weight="700">A · 57.1%</text>
  <rect x="16" y="89" width="68.5" height="17" rx="3" fill="#14b8a6"/><text x="22" y="100" fill="#042f2e" font-size="5.8" font-weight="700">B · 28.6%</text>
  <rect x="16" y="112" width="34" height="17" rx="3" fill="#f59e0b"/><text x="55" y="123" fill="#fbbf24" font-size="5.8" font-weight="700">C · 14.3%</text>
  <rect x="180" y="66" width="115" height="17" rx="3" fill="#60a5fa"/><text x="186" y="77" fill="#0b1120" font-size="5.8" font-weight="700">A · 62.5%</text>
  <rect x="180" y="89" width="46" height="17" rx="3" fill="#14b8a6"/><text x="231" y="100" fill="#5eead4" font-size="5.8" font-weight="700">B · 25%</text>
  <rect x="180" y="112" width="23" height="17" rx="3" fill="#f59e0b"/><text x="208" y="123" fill="#fbbf24" font-size="5.8" font-weight="700">C · 12.5%</text>
  <rect x="16" y="151" width="318" height="34" rx="4" fill="#111c31" stroke="#334155" stroke-width=".5"/>
  <text x="23" y="164" fill="#fbbf24" font-size="5.8" font-weight="700">A gains 5.4 points of weight</text>
  <text x="23" y="176" fill="#cbd5e1" font-size="5">More eligible debt, without a credit opinion.</text>
  <text x="16" y="215" fill="#64748b" font-size="4.8">l0g calculation. No market data.</text>
</g>
</svg>
<figcaption style="margin-top:.65rem;color:#64748b;font-size:.82rem">The calculation isolates raw weighting. A real index then applies eligibility rules and, depending on its methodology, an issuer cap.</figcaption>
</figure>

The dilution is mechanical, but it is not a free reward. A fall in A’s bond prices reduces their market value. A buyback or maturity reduces the amount outstanding. Most importantly, the issue must pass through the index gates.

## LQD: six gates before weighting

LQD makes the rules concrete. The iShares iBoxx Investment Grade Corporate Bond ETF tracks the iBoxx USD Liquid Investment Grade Index. The [July 2026 S&P Dow Jones Indices methodology](https://www.spglobal.com/spdji/en/documents/methodologies/iBoxx_USD_Liquid_Investment_Grade_Index_Methodology.pdf) says the index is market-value weighted, rebalanced at each month-end and capped at **3% per issuer**.

A candidate bond must, among other criteria:

- be US dollar-denominated corporate credit;
- have cash flows that can be determined in advance, with several security types excluded;
- carry an average [investment-grade](/glossaire/investment-grade/) rating, at least BBB- or Baa3 depending on the agency;
- have at least **$750 million** of face value outstanding;
- come from an issuer with at least **$2 billion** of qualifying US dollar debt in the broader universe;
- have at least three years of expected remaining life, or three and a half years for a new insertion.

Rating and outstanding-amount data are cut off three business days before the rebalance. Weights and the cap are then calculated using month-end market values. A new issue that becomes known too late waits for the next cycle. ([S&P DJI, Bond Selection and Index Calculation](https://www.spglobal.com/spdji/en/documents/methodologies/iBoxx_USD_Liquid_Investment_Grade_Index_Methodology.pdf))

<figure class="infographic" style="margin:2rem 0 2.25rem">
<svg viewBox="0 0 760 600" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="index-gates-title-en index-gates-desc-en" style="width:100%;height:auto;display:block;background:#0b1120;border:1px solid #26324a;border-radius:16px;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
<title id="index-gates-title-en">Entry gates for the iBoxx USD Liquid Investment Grade Index</title>
<desc id="index-gates-desc-en">A bond must be US dollar corporate debt, investment grade, have at least 750 million dollars outstanding, come from an issuer with at least 2 billion dollars of eligible debt and retain sufficient expected life. It is then market-value weighted with a 3 percent issuer cap.</desc>
<style>.mobile{display:none}@media (max-width:640px){.desktop{display:none}.mobile{display:block}}</style>
<defs><marker id="gate-arrow-en" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#60a5fa"/></marker></defs>
<g class="desktop">
  <text x="40" y="50" fill="#f8fafc" font-size="24" font-weight="700">Debt must become indexable</text>
  <text x="40" y="78" fill="#94a3b8" font-size="13">iBoxx USD Liquid Investment Grade, July 2026 methodology</text>
  <rect x="40" y="116" width="190" height="68" rx="9" fill="#172554" stroke="#3b82f6"/><text x="58" y="143" fill="#93c5fd" font-size="13" font-weight="700">1. Instrument</text><text x="58" y="165" fill="#e2e8f0" font-size="12">USD corporate credit</text>
  <line x1="230" y1="150" x2="273" y2="150" stroke="#60a5fa" stroke-width="2" marker-end="url(#gate-arrow-en)"/>
  <rect x="280" y="116" width="190" height="68" rx="9" fill="#172554" stroke="#3b82f6"/><text x="298" y="143" fill="#93c5fd" font-size="13" font-weight="700">2. Rating</text><text x="298" y="165" fill="#e2e8f0" font-size="12">BBB- / Baa3 or better</text>
  <line x1="470" y1="150" x2="513" y2="150" stroke="#60a5fa" stroke-width="2" marker-end="url(#gate-arrow-en)"/>
  <rect x="520" y="116" width="200" height="68" rx="9" fill="#172554" stroke="#3b82f6"/><text x="538" y="143" fill="#93c5fd" font-size="13" font-weight="700">3. Bond size</text><text x="538" y="165" fill="#e2e8f0" font-size="12">outstanding ≥ $750m</text>
  <line x1="620" y1="184" x2="620" y2="224" stroke="#60a5fa" stroke-width="2" marker-end="url(#gate-arrow-en)"/>
  <rect x="520" y="232" width="200" height="68" rx="9" fill="#132b32" stroke="#14b8a6"/><text x="538" y="259" fill="#5eead4" font-size="13" font-weight="700">4. Issuer size</text><text x="538" y="281" fill="#e2e8f0" font-size="12">qualifying debt ≥ $2bn</text>
  <line x1="520" y1="266" x2="477" y2="266" stroke="#60a5fa" stroke-width="2" marker-end="url(#gate-arrow-en)"/>
  <rect x="280" y="232" width="190" height="68" rx="9" fill="#132b32" stroke="#14b8a6"/><text x="298" y="259" fill="#5eead4" font-size="13" font-weight="700">5. Maturity</text><text x="298" y="281" fill="#e2e8f0" font-size="12">3y, 3.5y at insertion</text>
  <line x1="280" y1="266" x2="237" y2="266" stroke="#60a5fa" stroke-width="2" marker-end="url(#gate-arrow-en)"/>
  <rect x="40" y="232" width="190" height="68" rx="9" fill="#132b32" stroke="#14b8a6"/><text x="58" y="259" fill="#5eead4" font-size="13" font-weight="700">6. Calendar</text><text x="58" y="281" fill="#e2e8f0" font-size="12">cut-off then month-end</text>
  <line x1="135" y1="300" x2="135" y2="344" stroke="#60a5fa" stroke-width="2" marker-end="url(#gate-arrow-en)"/>
  <rect x="40" y="352" width="680" height="92" rx="11" fill="#1e293b" stroke="#64748b"/>
  <text x="62" y="382" fill="#f8fafc" font-size="15" font-weight="700">Weight: bond market value / eligible-universe market value</text>
  <text x="62" y="407" fill="#cbd5e1" font-size="12">Price, accrued interest and par amount outstanding determine the raw weight.</text>
  <text x="62" y="427" fill="#cbd5e1" font-size="12">Weights are then aggregated and capped by issuer.</text>
  <rect x="225" y="476" width="310" height="58" rx="29" fill="#451a2a" stroke="#fb7185"/>
  <text x="380" y="511" fill="#fda4af" font-size="18" font-weight="700" text-anchor="middle">ISSUER CAP: 3%</text>
  <text x="40" y="570" fill="#64748b" font-size="11">Source: S&amp;P Dow Jones Indices, July 2026.</text>
</g>
<g class="mobile" transform="scale(2.17)">
  <text x="16" y="20" fill="#f8fafc" font-size="9.3" font-weight="700">Debt must become indexable</text>
  <text x="16" y="32" fill="#94a3b8" font-size="5.2">iBoxx USD Liquid IG, July 2026</text>
  <rect x="16" y="45" width="150" height="27" rx="4" fill="#172554" stroke="#3b82f6" stroke-width=".5"/><text x="23" y="57" fill="#93c5fd" font-size="5.5" font-weight="700">1. USD corporate credit</text><text x="23" y="67" fill="#e2e8f0" font-size="4.8">cash flows known in advance</text>
  <rect x="184" y="45" width="150" height="27" rx="4" fill="#172554" stroke="#3b82f6" stroke-width=".5"/><text x="191" y="57" fill="#93c5fd" font-size="5.5" font-weight="700">2. Rating</text><text x="191" y="67" fill="#e2e8f0" font-size="4.8">BBB- / Baa3 or better</text>
  <rect x="16" y="82" width="150" height="27" rx="4" fill="#172554" stroke="#3b82f6" stroke-width=".5"/><text x="23" y="94" fill="#93c5fd" font-size="5.5" font-weight="700">3. Bond size</text><text x="23" y="104" fill="#e2e8f0" font-size="4.8">outstanding ≥ $750m</text>
  <rect x="184" y="82" width="150" height="27" rx="4" fill="#132b32" stroke="#14b8a6" stroke-width=".5"/><text x="191" y="94" fill="#5eead4" font-size="5.5" font-weight="700">4. Issuer size</text><text x="191" y="104" fill="#e2e8f0" font-size="4.8">qualifying debt ≥ $2bn</text>
  <rect x="16" y="119" width="150" height="27" rx="4" fill="#132b32" stroke="#14b8a6" stroke-width=".5"/><text x="23" y="131" fill="#5eead4" font-size="5.5" font-weight="700">5. Maturity</text><text x="23" y="141" fill="#e2e8f0" font-size="4.8">3y, 3.5y at insertion</text>
  <rect x="184" y="119" width="150" height="27" rx="4" fill="#132b32" stroke="#14b8a6" stroke-width=".5"/><text x="191" y="131" fill="#5eead4" font-size="5.5" font-weight="700">6. Calendar</text><text x="191" y="141" fill="#e2e8f0" font-size="4.8">cut-off then month-end</text>
  <rect x="16" y="165" width="318" height="42" rx="5" fill="#1e293b" stroke="#64748b" stroke-width=".5"/>
  <text x="23" y="178" fill="#f8fafc" font-size="5.5" font-weight="700">Market value / eligible universe</text>
  <text x="23" y="190" fill="#cbd5e1" font-size="4.8">(price + accrued interest) × amount outstanding</text>
  <text x="23" y="201" fill="#cbd5e1" font-size="4.8">then aggregate by issuer</text>
  <rect x="89" y="220" width="172" height="27" rx="13.5" fill="#451a2a" stroke="#fb7185" stroke-width=".5"/>
  <text x="175" y="237" fill="#fda4af" font-size="6.5" font-weight="700" text-anchor="middle">CAP: 3%</text>
  <text x="16" y="268" fill="#64748b" font-size="4.7">Source: S&amp;P DJI, July 2026.</text>
</g>
</svg>
<figcaption style="margin-top:.65rem;color:#64748b;font-size:.82rem">Debt size only matters after selection. Large high-yield, private, undersized, short-dated or non-dollar debt can remain entirely outside this index.</figcaption>
</figure>

The slogan that the most indebted borrower always wins breaks down here. A group can increase its debt sharply without entering LQD if its rating becomes speculative. Conversely, a strong company issuing a large, liquid bond can cross the thresholds and increase its weight up to the cap. The benchmark rewards less the leverage itself than **an abundant supply of standardised, tradable debt**.

As of 7 August 2026, BlackRock reported **3,151 holdings** in LQD’s portfolio. That figure describes the fund, not the index exactly, and the positions can change. It still helps explain why a manager cannot treat a bond ETF like an equity basket containing only a few hundred securities. ([iShares / BlackRock](https://www.ishares.com/us/products/239566/LQD))

## From index weight to actual buying

An index buys nothing. The [iShares prospectus filed with the SEC](https://www.sec.gov/Archives/edgar/data/1100663/000119312525149296/d833515d497.htm) makes the distinction explicit: an index is a financial calculation, while the fund is an actual portfolio. LQD seeks to track its benchmark, but BlackRock uses **representative sampling**. The fund holds securities whose aggregate profile resembles the index without owning every bond in precisely the same proportion.

Another [SEC filing reproducing LQD’s prospectus language](https://www.sec.gov/Archives/edgar/data/1517936/000144554626001661/lqti_497k.htm) says the fund invests at least 80% of its assets in index components and at least 90% in fixed-income securities of the types included in the index. The remaining flexibility can support tracking through other bonds or derivatives.

Actual transmission therefore depends on four conditions:

1. the issue becomes eligible at the next rebalance;
2. its raw weight rises without the cap fully neutralising the increase;
3. funds and mandates linked to the benchmark have assets to adjust;
4. managers select that bond, or a close substitute, to reduce tracking error.

Net inflows provide new capital. Without inflows, a rebalance can still occur, but buying one security will often require reducing other exposures. Outflows may overwhelm the weighting effect altogether. “Passive buying” therefore describes a relative portfolio constraint, not unlimited demand.

Bond ETF plumbing adds another layer of distance. Using 2020 data, the [BIS](https://www.bis.org/publ/qtrpdf/r_qt2103d.htm) found that creation baskets for US corporate bond ETFs covered about 20% of holdings, while redemption baskets covered about 35%. This flexibility helps funds manage thousands of bonds with uneven liquidity. It also means that creating ETF shares cannot be equated with buying every benchmark bond in proportion.

## Six events with six different effects

A useful reading separates amount outstanding, price, eligibility and fund flows.

<div style="max-width:100%;overflow-x:auto">
<table>
<thead>
<tr><th>Event</th><th>Raw effect on weight</th><th>Main constraint</th></tr>
</thead>
<tbody>
<tr><td>New eligible issue</td><td>higher amount and potential weight</td><td>cut-off, thresholds, 3% cap</td></tr>
<tr><td>Bond price falls</td><td>lower market value</td><td>weights may be fixed between rebalances</td></tr>
<tr><td>Buyback or repayment</td><td>lower amount outstanding</td><td>methodology’s event calendar</td></tr>
<tr><td>Downgrade below investment grade</td><td>exit from the IG universe</td><td>benchmark rules and rebalance date</td></tr>
<tr><td>Fund inflow</td><td>additional capital to invest</td><td>sampling and bond liquidity</td></tr>
<tr><td>Fund outflow</td><td>portfolio must shrink</td><td>redemption basket and liquidity buffers</td></tr>
</tbody>
</table>
</div>

The rating boundary requires a careful distinction. The iBoxx methodology permits a bond downgraded below investment grade to leave even during its minimum-run period. This does not mean every investor must sell on the same day. In its [May 2020 Financial Stability Report](https://www.federalreserve.gov/publications/files/financial-stability-report-20200515.pdf), the Federal Reserve noted that no general regulation required investment-grade funds to sell every fallen angel, although some funds might reduce their positions. Our guide to [reading credit ratings](/en/guides/read-credit-ratings/) explains this boundary.

## Every benchmark contains an opinion

Market-value weighting has a strong justification: it reflects market size and capacity. An index based on available amounts is easier to follow than a portfolio that overweights small, scarce bonds. Bloomberg identifies this replicability as a central reason for the method.

The same rule nevertheless concentrates the portfolio on issuers supplying a great deal of eligible paper. It cannot tell whether the borrowing finances a destructive acquisition, a share buyback, a profitable data centre or the prudent refinancing of a maturity. Fundamental analysis must return to the balance sheet, maturity schedule and use of cash, as described in l0g’s guide to [reading corporate debt](/en/guides/read-corporate-debt/).

The equity comparison clarifies the paradox. Capitalisation-weighted equity exposure rises when the value of equity rises. Market-value-weighted bond exposure can rise when the volume of eligible debt rises. In both cases the benchmark measures the existing market. It does not promise that the measured quantity is an economic virtue.

Other constructions exist. Bloomberg lists capped, fundamental, target-allocation and risk-weighted indices. Each replaces one weakness with a different choice: a cap reduces concentration but departs from the market; fundamental weighting requires a selection of indicators; risk weighting depends on a model and unstable data. Perfect neutrality is not available.

Federal Reserve research on [the shift from active to passive investing](https://www.federalreserve.gov/econres/feds/the-shift-from-active-to-passive-investing-potential-risks-to-financial-stability.htm) also finds mixed effects. Some passive strategies may amplify volatility, while evidence connecting index investing to comovement in prices and liquidity remains inconclusive. The methodology establishes a constraint. On its own, it does not prove a price effect.

## The l0g view

Yes, issuing more eligible debt can increase a borrower’s weight in a market-value-weighted bond index. That is an arithmetic consequence of the amount outstanding.

No, the index does not finance the most indebted company without limit. The price can fall, the rating can exclude, thresholds can block and a cap can bound the exposure. For the iBoxx index tracked by LQD, the 3% issuer limit is explicit.

Finally, a higher weight is not a universal market order. Funds use investment rules, flexible baskets and representative sampling. Establishing that a specific issue created actual buying pressure requires the inclusion calendar, weight changes, assets linked to the benchmark, fund holdings and transaction evidence. The equation supplies a channel. It does not prove causality on its own.

The most useful conclusion fits in one sentence: **a bond index does not select the best borrowers; it organises the debt that has passed its filters**.

---

## Sources

- [S&P Dow Jones Indices, iBoxx USD Liquid Investment Grade Index Methodology](https://www.spglobal.com/spdji/en/documents/methodologies/iBoxx_USD_Liquid_Investment_Grade_Index_Methodology.pdf), July 2026: selection, thresholds, calendar, weighting and 3% issuer cap.
- [Bloomberg Fixed Income Index Methodology](https://assets.bbhub.io/professional/sites/10/Bloomberg-Index-Publications-Fixed-Income-Index-Methodology.pdf), 8 January 2026: market-value formula and alternative weighting schemes.
- [Federal Reserve, Financial Accounts Z.1, nonfinancial corporate business](https://fred.stlouisfed.org/release/tables?eid=804211&rid=52), first quarter 2026: corporate bonds on the liabilities side.
- [SEC, iShares prospectus](https://www.sec.gov/Archives/edgar/data/1100663/000119312525149296/d833515d497.htm), 2025: distinction between index and fund, representative sampling and index-related risks.
- [SEC, description of LQD taken from its prospectus](https://www.sec.gov/Archives/edgar/data/1517936/000144554626001661/lqti_497k.htm), 2026 filing: investment objective and minimum asset proportions.
- [iShares / BlackRock, LQD](https://www.ishares.com/us/products/239566/LQD), data as of 7 August 2026: benchmark and number of fund holdings.
- [BIS, “The anatomy of bond ETF arbitrage”](https://www.bis.org/publ/qtrpdf/r_qt2103d.htm), March 2021: divergence between holdings and creation or redemption baskets.
- [Federal Reserve, “The Shift from Active to Passive Investing”](https://www.federalreserve.gov/econres/feds/the-shift-from-active-to-passive-investing-potential-risks-to-financial-stability.htm), revised 2020: documented effects and uncertainties of passive indexing.
- [Federal Reserve, Financial Stability Report](https://www.federalreserve.gov/publications/files/financial-stability-report-20200515.pdf), May 2020: potential pressure around fallen angels and the absence of a general mandatory-sale rule.

## Method and limitations

- Data cut-off: **11 August 2026**. The article uses no current security price, yield, valuation multiple or market ratio.
- The A, B, C example is entirely imaginary. It shows raw weighting before caps, taxes, transaction costs and price moves.
- The Z.1 figure covers US nonfinancial corporate business. It measures neither global bonds, investment grade alone nor assets actually held by LQD.
- BlackRock’s holdings count describes the fund’s portfolio as of 7 August 2026. It should not be read as the exact number of index constituents.
- The BIS study uses 2020 data and documents the general architecture of bond ETFs. Its basket-to-holdings overlaps are not presented as current LQD measurements.
- This article describes an index-construction mechanism and possible transmission channels. It does not estimate the causal effect of a particular bond issue on its price or funding cost and is not investment advice.
