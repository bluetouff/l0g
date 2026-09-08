---
title: "How to Read TIC Data: who really finances U.S. debt"
seoTitle: "How to read US TIC data: foreign Treasury holdings | l0g"
ogTitle: "Who really finances U.S. debt? Read the TIC data"
description: "Use U.S. Treasury TIC flows and holdings without misreading custody bias. Track Japan, China, the UK, Belgium, the Caymans and foreign demand."
summary: "TIC data are the U.S. Treasury's cross-border securities data. They show foreign holdings and flows into U.S. assets, including Treasuries. They are indispensable for reading who finances U.S. debt, but they are custody-based: securities are assigned to the country of the custodian, not necessarily to the final owner."
pubDate: 2026-06-30T11:00:00+02:00
updatedDate: 2026-09-08T14:47:23+02:00
sourceGuide: "lire-les-donnees-tic"
sourceUpdatedDate: 2026-06-30T11:00:00+02:00
tags: ["macro", "debt", "dedollarization"]
category: fed
draft: false
---

*The question returns at every [Treasury auction](/en/glossary/adjudication/) and every yield spike: if foreigners step back from U.S. debt, who buys, and at what yield? The reference source is the Treasury International Capital system. It tells how many Treasuries non-residents hold and where they are recorded. But it speaks in a language that must be learned: custody accounting, where Belgium can matter more than Saudi Arabia and a Cayman hedge fund can disappear into a domestic line.*

## What TIC measures

Treasury International Capital is the set of reports maintained by the U.S. Treasury, with the New York Fed as agent, tracking portfolio capital movements between U.S. residents and non-residents. Two pieces matter for U.S. debt: monthly net purchases and sales of long-term U.S. securities by foreigners, and holdings data, especially the Major Foreign Holders table for Treasuries.

At the end of 2025 non-residents held [roughly **$9.27 trillion** of Treasuries](https://ticdata.treasury.gov/Publish/mfhhis01.txt). For a separate measure of scale, the Congressional Research Service put foreign holdings at [**30%** of federal debt held by the public in December **2024**](https://www.congress.gov/crs-product/RS22331). The stock and the share refer to different year-ends. Foreign holders are a major source of financing alongside domestic investors.

The [top line for December 2025](https://ticdata.treasury.gov/Publish/mfhhis01.txt) is familiar: Japan around **$1.19 trillion**, the United Kingdom around **$863 billion**, China around **$684 billion**. But the rest of the ranking is a warning: Belgium, Luxembourg, the Cayman Islands, Ireland. These are custody and fund-domicile centers as much as final investors.

## Custody bias: the core problem

The Treasury says it explicitly: the monthly table is collected on a custody basis and cannot assign ownership with perfect accuracy. A Treasury bought by an investor in one country but held through a custodian in another is attributed to the custodian's country.

Belgium is large because Euroclear is there. Luxembourg and Ireland are large because investment funds are registered there. The UK is inflated by London's custody role. The Cayman Islands line captures hedge funds, including vehicles involved in the Treasury [basis trade](/en/glossary/basis-trade/).

That last point matters for stability. [Federal Reserve research](https://www.federalreserve.gov/econres/notes/feds-notes/the-cross-border-trail-of-the-treasury-basis-trade-20251015.html) estimated that Cayman hedge-fund Treasury positions were undercounted by about **$1.4 trillion** at the end of 2024, with some exposure classified as domestic. Read naïvely, TIC can turn a leveraged arbitrage into “American savings.”

## Holdings, flows and price effects

Do not mix stock and flow. The holdings table gives a market-value stock at a date. Monthly flows show net purchases and sales. The two can diverge sharply because Treasury holdings are valued at market prices. If yields rise, bond prices fall and a country's reported holdings can decline even if it sold nothing.

That is why headlines about a country “dumping Treasuries” often misread valuation effects. To judge appetite, compare the change in holdings with net monthly flows. The [Treasury release for March 2026, published on 18 May](https://home.treasury.gov/news/press-releases/sb0499), reports total net TIC inflows of **$182.7 billion** for February and **$150.7 billion** for March. These totals combine long-term securities, short-term securities and banking flows. They do not measure Treasury purchases alone; those require the separate bills, bonds and notes rows.

## China, the UK and the shift away from official buyers

Over the long run the [Treasury's historical table](https://ticdata.treasury.gov/Publish/mfhhis01.txt) tells two stories. The first is China's decline. China held more than **$1.3 trillion** of Treasuries in the mid-2010s and was below **$700 billion** at the end of 2025. Some Chinese holdings are booked elsewhere, but the direction is real.

The second is the rise of custody centers and private buyers. In the [official and private totals published by Treasury](https://ticdata.treasury.gov/Publish/mfhhis01.txt), the share of foreign holdings owned by official institutions, central banks and sovereign funds, fell from above **53%** at the end of 2021 to roughly **42%** at the end of 2025, as the total stock of foreign holdings grew. Private holdings therefore increased over the period. This change in composition does not by itself establish which investors bought a particular new issue or how they would react to a yield shock.

## How to read TIC in practice

The useful sequence is simple. Separate flows from holdings. Correct mentally for custody centers: Belgium, Luxembourg, Ireland, the Caymans and part of the UK are not straightforward national demand. Beware of valuation effects when yields move. Use the annual benchmark survey to refine the residency picture, while retaining the limits of custody-based attribution. TIC classifies investors by residency rather than nationality.

TIC should be read with the domestic side of debt ownership: the [Fed balance sheet](/en/guides/read-h41-fed-balance-sheet/), money-market funds, banks and now [stablecoin issuers buying T-bills](/en/guides/read-stablecoins-genius-act/). TIC gives the foreign window; it is not the full financing map.

The lesson is broader: transparency is not legibility. TIC gives precise numbers, but arranged according to the grammar of custody. Read well, it is one of the best windows on U.S. external financing. Read badly, it makes Belgium speak for Beijing and hides leverage inside a country label.

---

**Main sources:**

- [U.S. Treasury, Treasury International Capital system](https://home.treasury.gov/data/treasury-international-capital-tic-system): reporting architecture, custody basis and annual benchmark surveys.
- [U.S. Treasury, Major Foreign Holders historical table](https://ticdata.treasury.gov/Publish/mfhhis01.txt): holdings by country, official and private totals, and the monthly history.
- [U.S. Treasury, March 2026 TIC release](https://home.treasury.gov/news/press-releases/sb0499): February and March net flows and the official warning about custody-based attribution.
- [Congressional Research Service, *Foreign Holdings of Federal Debt*](https://www.congress.gov/crs-product/RS22331): foreign share of federal debt and the limits of assigning holdings by nationality.
- [Federal Reserve, *The Cross-Border Trail of the Treasury Basis Trade*](https://www.federalreserve.gov/econres/notes/feds-notes/the-cross-border-trail-of-the-treasury-basis-trade-20251015.html): the estimated $1.4 trillion undercount of Cayman hedge-fund Treasury positions at the end of 2024.
