---
title: "OFAC and the SDN List: can sanctions target code?"
description: "A reference guide to OFAC and the Specially Designated Nationals List: how the world's most powerful financial-sanctions tool works, the 50 percent rule, its reach into crypto, stablecoin freezes, and the legal limit drawn by U.S. courts in 2025 when Tornado Cash was delisted."
summary: "OFAC is the U.S. Treasury office that administers economic sanctions. Its Specially Designated Nationals and Blocked Persons List identifies people and entities with whom U.S. persons are generally prohibited from dealing and whose property under U.S. jurisdiction is blocked."
pubDate: 2026-06-21T17:00:00+02:00
updatedDate: 2026-06-21T17:00:00+02:00
sourceGuide: "ofac-sdn-list"
sourceUpdatedDate: 2026-06-21T17:00:00+02:00
tags: ["geopolitics", "sanctions", "crypto", "regulation", "methodology"]
category: crypto
draft: false
---

*A name on the SDN List, and dollar access shuts down. It is the most powerful financial weapon in the world, administered by a U.S. Treasury office that few outside compliance teams know well. Crypto has tested its limits: in 2025, U.S. courts forced OFAC to remove Tornado Cash from the list, holding that immutable code cannot be sanctioned as property. This guide explains how the list works, how it reaches crypto, and where it stops.*

OFAC, the Office of Foreign Assets Control, is the U.S. Treasury office that administers and enforces economic sanctions in support of foreign-policy and national-security objectives. Its flagship tool is the Specially Designated Nationals and Blocked Persons List, or **SDN List**. U.S. persons are generally forbidden to deal with listed persons and entities, and their property under U.S. jurisdiction is blocked.

## How the SDN List works

The mechanism is deliberately harsh. When a person or entity is added to the list, two things happen. First, all property and interests in property under U.S. jurisdiction are blocked. Second, U.S. persons are prohibited from transacting with them.

Liability is strict. A violation can matter even without intent or knowledge, which is why the global financial system tends to over-comply.

The reach is far beyond U.S. borders. Because the dollar runs through global trade and international banks need access to the U.S. system, an SDN designation can effectively cut a target off from global finance. The legal basis is often the International Emergency Economic Powers Act of 1977, activated through executive orders targeting countries, groups or activities.

## The trap: the 50 percent rule

A compliance check cannot stop at the exact name on the list. Under OFAC's **50 percent rule**, an entity owned 50 percent or more, directly or indirectly, by one or more blocked persons is itself treated as blocked, even if its own name is not on the list.

Ownership by several blocked persons is aggregated. The absence of a name from the SDN List is therefore not enough. You must trace beneficial ownership. This is one of the most common compliance failures.

## Beyond the SDN List

The SDN List is not OFAC's only instrument. Sectoral sanctions restrict certain activities without fully blocking an entity. Other non-SDN lists impose narrower restrictions. Secondary sanctions can target non-U.S. actors that deal with certain sanctioned parties by threatening their own access to the U.S. system.

The SDN List remains the sharpest tool: full blocking.

## The SDN List in the crypto era

Since 2018, OFAC has also listed cryptocurrency wallet addresses. The logic is the same: transacting with a listed address is prohibited.

North Korean laundering networks, including Lazarus-linked activity, have been a major driver of these designations. But crypto enforcement often moves through centralised [chokepoints](/en/glossary/chokepoint/). A centralised [stablecoin](/en/guides/read-stablecoins-genius-act/) issuer can freeze tokens held at sanctioned addresses. Tether, for example, has frozen [USDT](/en/glossary/usdt/) linked to addresses designated by OFAC, including in cases connected to Russian exchange activity.

This is the paradox of centralised digital money: it can be moved like crypto but frozen like regulated finance.

## Tornado Cash: can OFAC sanction code?

Tornado Cash is the landmark case. In August 2022, OFAC listed Tornado Cash, an Ethereum mixing protocol accused of laundering billions of dollars, including funds linked to North Korea. For the first time, OFAC targeted not just persons or companies but a set of autonomous smart contracts.

The challenge came quickly. In *Van Loon v. Department of the Treasury*, users argued that immutable smart contracts were not “property” under IEEPA because no one could own, control or modify them, not even the developers. On **November 26, 2024**, the Fifth Circuit agreed. OFAC had exceeded its authority.

The result was confirmed in 2025. On **March 21, 2025**, OFAC removed Tornado Cash from the SDN List. In April 2025, a federal district court issued a permanent injunction preventing OFAC from reimposing sanctions on the immutable contracts. OFAC maintained sanctions on one developer under the North Korea programme, and criminal proceedings against founders continue separately.

The lesson is precise: OFAC's authority over truly immutable decentralised code is legally bounded. Enforcement must focus on persons and entities, not code itself.

## What this changes for compliance risk

Tornado Cash's delisting is not a green light. Mixers remain high-risk money-laundering infrastructure. Strict liability remains. The risk profile of a transaction does not disappear because one sanction designation is lifted.

The boundary drawn by courts separates code from persons. A developer, operator or entity can still be targeted. Immutable software is harder to treat as sanctionable property. Courts also suggested that Congress could update IEEPA to address these technologies directly. Until then, sanctions reach into DeFi remains uncertain.

## How to verify, step by step

Start with the official OFAC sanctions search, not a third-party aggregator. Do not stop at a name match: trace ownership for the 50 percent rule. For crypto, check listed addresses but separate sanctions status from broader laundering risk. Date the check, because listings and delistings change constantly.

A sanctions check reduces legal risk. It does not replace real risk analysis.

## Methodology

This guide is based on primary sources: OFAC resources on the SDN List and the 50 percent rule, the International Emergency Economic Powers Act, the Treasury's Tornado Cash delisting release of March 21, 2025, the Fifth Circuit decision in *Van Loon v. Department of the Treasury*, and the April 2025 district-court injunction. Practical sanctions analysis on l0g starts from the official OFAC list, applies the 50 percent rule and separates legal sanctions status from money-laundering risk.

---

**Main sources:** U.S. Department of the Treasury, OFAC SDN List resources and 50 percent rule guidance; International Emergency Economic Powers Act; Treasury/OFAC Tornado Cash delisting release of March 21, 2025; U.S. Court of Appeals for the Fifth Circuit, *Van Loon v. Department of the Treasury*, 122 F.4th 549; U.S. District Court for the Western District of Texas, April 2025 injunction; CoinDesk and specialist legal coverage for timeline and stablecoin freezes.
