---
title: "Reading a bank stress test: DFAST, CCAR and the stress buffer"
description: "A reference guide to reading the Fed's annual bank stress test: the difference between DFAST and CCAR, the tailor-made apocalypse scenario, the mechanics that project losses, revenues and the capital ratio over nine quarters, the Stress Capital Buffer that follows and sets each bank's room for buybacks, and the limits of the exercise, starting with its blind spot on liquidity runs. With the 2026 test as the thread."
summary: "Each year, the Federal Reserve puts the largest U.S. banks through a severe hypothetical recession and publishes whether they survive. The test has two parts: DFAST, the quantitative test of solvency under stress, and CCAR, which judges the ability to distribute capital. Its most important output is the Stress Capital Buffer, a firm-specific capital requirement that sets each bank's room for dividends and buybacks. Reading it requires understanding the scenario, the CET1 drawdown, the loss composition and the limits of the exercise, including its silence on the liquidity risk that actually killed Silicon Valley Bank."
pubDate: 2026-07-13T04:50:00+02:00
updatedDate: 2026-07-13T04:50:00+02:00
sourceGuide: "lire-un-stress-test-bancaire"
sourceUpdatedDate: 2026-07-13T04:50:00+02:00
tags: ["banks", "regulation", "risk", "fed", "capital"]
category: fed
draft: false
---

*Once a year, the Federal Reserve inflicts an imaginary apocalypse on the largest U.S. banks, a stock-market collapse, a jobless spike, a property crash, then publishes the verdict: who survives, and with how much capital. The stress test is the closest thing to an X-ray of bank soundness, and it concretely shapes how much each bank can return to shareholders. It is also a contested ritual, at once illuminating and misleading, because it measures one danger well and almost entirely ignores the one that, in reality, brings banks down. This guide explains how to read it, what it says and what it leaves out. The 2026 test serves as the illustration.*

## DFAST and CCAR: two names, one exercise

The exercise carries two acronyms often confused, which in fact answer two distinct questions. [DFAST](/glossaire/dfast/), the Dodd-Frank Act Stress Test, is the quantitative part, born of the 2010 law: it asks about survival. Would the bank keep its capital above regulatory minimums if a severe recession struck? [CCAR](/glossaire/ccar/), the Comprehensive Capital Analysis and Review, is the capital-planning part: it asks about distribution. Can the bank pay dividends and buy back its shares while staying sound under stress? The first tests resilience, the second draws the consequences for capital policy.

The test covers only large banks, those above $100 billion in assets, sorted into categories by size and complexity. In 2026, thirty-two firms were subject to it. Smaller banks, such as the regionals, are exempt, a point that is not trivial, as we will see, because it is precisely there that some recent flaws have lodged, described in our [guide to reading a bank's soundness](/en/guides/read-bank-health/).

## The scenario: a tailor-made apocalypse

The heart of the test is the "severely adverse" scenario, a chain of catastrophes the Fed designs itself each year and publishes in February. It does not claim to predict the next crisis, but to subject banks to a shock calibrated to hurt. The 2026 one illustrates the exercise well.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 300" role="img" aria-label="The severely adverse scenario of the 2026 stress test" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="300" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">The tailor-made apocalypse of 2026</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">The "severely adverse" scenario designed by the Fed for the stress test.</text>
  <line x1="40" y1="78" x2="680" y2="78" stroke="#2a2c33" stroke-width="1"></line>
  <text x="40" y="106" fill="#d6d9df" font-size="12.5">Equities</text>
  <text x="300" y="110" fill="#ff4d87" font-size="19" font-weight="700">-58%</text>
  <text x="440" y="106" fill="#8b909b" font-size="11.5">over the first three quarters</text>
  <line x1="40" y1="124" x2="680" y2="124" stroke="#2a2c33" stroke-width="1"></line>
  <text x="40" y="152" fill="#d6d9df" font-size="12.5">VIX (fear index)</text>
  <text x="300" y="156" fill="#f5b13d" font-size="19" font-weight="700">72</text>
  <text x="440" y="152" fill="#8b909b" font-size="11.5">peak, an extreme crisis level</text>
  <line x1="40" y1="170" x2="680" y2="170" stroke="#2a2c33" stroke-width="1"></line>
  <text x="40" y="198" fill="#d6d9df" font-size="12.5">Unemployment</text>
  <text x="300" y="202" fill="#7aa2f7" font-size="19" font-weight="700">10%</text>
  <text x="440" y="198" fill="#8b909b" font-size="11.5">from about 4% at the start</text>
  <line x1="40" y1="216" x2="680" y2="216" stroke="#2a2c33" stroke-width="1"></line>
  <text x="40" y="244" fill="#d6d9df" font-size="12.5">Housing / commercial real estate</text>
  <text x="300" y="248" fill="#ff4d87" font-size="19" font-weight="700">-30% / -39%</text>
  <text x="32" y="284" fill="#8b909b" font-size="11">Source: Federal Reserve, 2026 stress test scenarios (February 2026).</text>
</svg>
<figcaption>A <strong>58%</strong> equity crash, a VIX at <strong>72</strong>, unemployment at <strong>10%</strong> and commercial real estate down <strong>39%</strong>: the scenario is a perfect storm, built to test balance sheets. Source: Federal Reserve.</figcaption>
</figure>

A baseline scenario, milder, serves as a comparison, and the Fed sometimes adds an exploratory element to probe an emerging risk. But it is the severely adverse scenario that makes the headline, because it is the one that sets capital. The fact that banks know it in advance is both a strength, transparency, and a weakness, the incentive to optimize to it, to which we will return.

## The mechanics: losses, revenues, capital

Once the scenario is set, the Fed simulates, quarter by quarter over nine quarters, what it would do to each bank. On one side, it projects losses: loan defaults, trading write-downs, operational losses. On the other, it projects the revenue the bank would keep earning despite the crisis, [pre-provision net revenue](/glossaire/ppnr/) or PPNR, the first cushion absorbing losses. The difference, applied to equity, traces the path of the [CET1](/glossaire/cet1/) ratio throughout the shock.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 290" role="img" aria-label="The 2026 stress test result: the drawdown of the capital ratio" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="290" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">The 2026 result: a drawdown, not a collapse</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Aggregate common equity (CET1) ratio of the 32 banks, under the adverse scenario.</text>
  <text x="40" y="92" fill="#d6d9df" font-size="12">Start (end-2025)</text>
  <rect x="40" y="102" width="600" height="22" fill="#2a2c33"></rect>
  <rect x="40" y="102" width="512" height="22" fill="#5eead4" opacity="0.9"></rect>
  <text x="560" y="119" fill="#5eead4" font-size="12" font-weight="700">12.8%</text>
  <text x="40" y="146" fill="#d6d9df" font-size="12">Trough under stress</text>
  <rect x="40" y="156" width="600" height="22" fill="#2a2c33"></rect>
  <rect x="40" y="156" width="448" height="22" fill="#f5b13d" opacity="0.9"></rect>
  <text x="496" y="173" fill="#f5b13d" font-size="12" font-weight="700">11.2%</text>
  <text x="40" y="200" fill="#d6d9df" font-size="12">Regulatory minimum</text>
  <rect x="40" y="210" width="600" height="22" fill="#2a2c33"></rect>
  <rect x="40" y="210" width="180" height="22" fill="#ff4d87" opacity="0.85"></rect>
  <text x="228" y="227" fill="#ff4d87" font-size="12" font-weight="700">4.5%</text>
  <text x="40" y="262" fill="#8b909b" font-size="11.5">A 1.6-point drawdown, about $625bn of loan losses, all 32 banks above the threshold.</text>
  <text x="32" y="282" fill="#8b909b" font-size="11">Source: Federal Reserve, DFAST 2026 results (24 June 2026).</text>
</svg>
<figcaption>The aggregate ratio falls from <strong>12.8% to 11.2%</strong> at its low, a 1.6-point drawdown, before recovering. It stays well above the <strong>4.5%</strong> minimum, despite about <strong>$625 billion</strong> of loan losses. All pass. Source: Federal Reserve.</figcaption>
</figure>

The 2026 result is reassuring on paper, as it is almost every year: the thirty-two banks pass, the aggregate ratio cedes only 1.6 points and stays far above the floor. But reading a stress test does not stop at that "pass." The real lesson lies elsewhere, in the figure the test produces for each bank that will constrain it all year.

## The real point: the Stress Capital Buffer

The test's most important output is not the binary verdict, it is the [Stress Capital Buffer](/glossaire/scb/). Its calculation is simple in principle: take the starting CET1 ratio, subtract the lowest point reached during the nine quarters of stress, and add the dividends planned over a year, with a 2.5% floor. The result becomes a firm-specific capital requirement, added to the bank's minimums.

The stakes are large, because this buffer sets the bank's room to manoeuvre. The more a bank suffers in the scenario, the higher its buffer, and the less capital it has left to distribute in dividends and buybacks. The stress test is therefore no consequence-free exam: it fixes, bank by bank, how much capital each must retain rather than return. It is the channel through which a poor result is paid for in fewer buybacks, which explains the attention investors give it. In 2026, notably, the Fed froze the buffer requirements while finalizing a revision of its framework, a point worth dwelling on.

## The limits of the exercise

A careful reader never takes a stress test at face value, because its limits matter as much as its results. The first is that it models the last war. Its scenarios draw on past crises, a 2008-style recession, and nothing guarantees the next shock will resemble them. The second is that the scenario is known in advance: banks can shape their balance sheets to look good in it, which improves the score without necessarily strengthening real resilience. The third is that it is a point-in-time snapshot, quickly outdated as portfolios shift.

The fourth limit is the gravest, and it goes to the heart of the matter. The test measures solvency, the ability to absorb losses, but barely liquidity, the ability to honour sudden withdrawals. Yet it was a liquidity run, not a solvency shortfall, that killed Silicon Valley Bank in 2023, a bank that was not even subject to the test. The most common way banks fail, a deposit flight at the speed of an app, is precisely the one the stress test captures least. Passing the test is therefore no blank cheque, as several voices in the sector recalled at the very moment when regulation, with the framework revision and the lightening of Basel III, was loosening the capital constraint. A clean bill of solvency says nothing about vulnerability to a run.

## Reading the stress test in practice

In practice, a few reflexes draw the real signal from a stress test. The calendar first: scenarios appear in February, results in June, and the resulting buffer applies thereafter. The number to isolate is not the collective "pass or fail," but the CET1 drawdown bank by bank, since a large drawdown betrays a high exposure to the scenario's losses. The resulting stress buffer says how much capital the bank must retain, hence its capacity to buy back shares. The loss composition reveals where the balance sheet is fragile, commercial real estate, credit cards, trading. And pre-provision revenue measures the cushion that absorbs the shock before capital.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 330" role="img" aria-label="How to read a bank stress test result" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="330" fill="#0c0d10"></rect>
  <text x="32" y="36" fill="#f5f6f8" font-size="17" font-weight="700">How to read a stress test</text>
  <text x="32" y="57" fill="#8b909b" font-size="12">What to watch beyond the "pass or fail."</text>
  <line x1="40" y1="74" x2="680" y2="74" stroke="#2a2c33" stroke-width="1"></line>
  <circle cx="48" cy="97" r="5" fill="#ff4d87"></circle>
  <text x="64" y="94" fill="#ff4d87" font-size="12.5" font-weight="700">The CET1 drawdown</text>
  <text x="64" y="111" fill="#8b909b" font-size="11.5">the larger it is, the more the bank is exposed to the scenario's losses.</text>
  <circle cx="48" cy="141" r="5" fill="#f5b13d"></circle>
  <text x="64" y="138" fill="#f5b13d" font-size="12.5" font-weight="700">The stress buffer (SCB)</text>
  <text x="64" y="155" fill="#8b909b" font-size="11.5">the capital requirement that follows, hence the room for buybacks.</text>
  <circle cx="48" cy="185" r="5" fill="#7aa2f7"></circle>
  <text x="64" y="182" fill="#7aa2f7" font-size="12.5" font-weight="700">The loss composition</text>
  <text x="64" y="199" fill="#8b909b" font-size="11.5">where they come from: commercial real estate, credit cards, trading.</text>
  <circle cx="48" cy="229" r="5" fill="#5eead4"></circle>
  <text x="64" y="226" fill="#5eead4" font-size="12.5" font-weight="700">Pre-provision revenue (PPNR)</text>
  <text x="64" y="243" fill="#8b909b" font-size="11.5">the cushion that absorbs the shock before capital is touched.</text>
  <circle cx="48" cy="273" r="5" fill="#ff4d87"></circle>
  <text x="64" y="270" fill="#ff4d87" font-size="12.5" font-weight="700">The blind spot: liquidity</text>
  <text x="64" y="287" fill="#8b909b" font-size="11.5">the deposit run the test does not capture. The 2023 SVB case.</text>
  <text x="32" y="318" fill="#8b909b" font-size="11">l0g reading, from the guide to bank soundness.</text>
</svg>
<figcaption>Five things outrank the binary verdict: the capital drawdown, the stress buffer it produces, the source of losses, the revenue cushion, and above all what the test does not see, <strong>the liquidity run</strong>. l0g reading.</figcaption>
</figure>

Above all, read the test for what it is, a solvency exam under a known scenario, not a guarantee of survival. It complements the grid of our [guide to bank soundness](/en/guides/read-bank-health/), which adds what the test neglects, liquidity, unrealized losses and deposit structure. The stress test says a bank would absorb a modeled recession. It does not say it would survive a panic of its own depositors, and it is that second question that history has shown to be the deadlier.

## Sources and further reading

- [Federal Reserve, Dodd-Frank Act Stress Test 2026 results, 24 June 2026](https://www.federalreserve.gov/publications/files/2026-dfast-results-20260624.pdf): aggregate CET1 from 12.8% to 11.2%, about $625bn of loan losses.
- [Federal Reserve, 2026 stress test scenarios](https://www.federalreserve.gov/publications/2026-stress-test-scenarios.htm): equities -58%, VIX 72, unemployment 10%, commercial real estate -39%.
- [Bank Policy Institute, "The 2026 Federal Reserve Stress Test Results: A Framework in Transition"](https://bpi.com/the-2026-federal-reserve-stress-test-results-a-framework-in-transition/): the framework revision and the frozen buffers.
- Forbes (M. Rodriguez Valladares), "2026 Bank Stress-Test Results Are Not A Green Light For Lower Capital": the limits of the exercise.
- l0g, [Q2 bank earnings, reading the risk](/posts/resultats-bancaires-t2-2026-lire-le-risque/) and [Commercial real estate and the refinancing wall](/posts/immobilier-commercial-mur-refinancement-2026-maillon-regional/).
- Related guides: [Reading a bank's soundness](/en/guides/read-bank-health/) and [Reading CLOs and leveraged loans](/en/guides/read-clos-and-leveraged-loans/).
</content>
