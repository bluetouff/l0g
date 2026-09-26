---
title: "Starlink: who decides where the connection ends?"
seoTitle: "Starlink and Ukraine: who controls network access? | l0g"
description: "Kyiv’s terminal approvals, Starshield contracts, Poland’s station fire and European alternatives reveal the dependencies behind Starlink access."
pubDate: "2026-09-26T14:49:02+02:00"
tags: ["Starlink", "Ukraine", "SpaceX", "satellites", "digital sovereignty", "geopolitics"]
draft: false
ogImage: "/illustrations/news/starlink-controle-connexion-v1.jpg"
sourceArticle: "starlink-ukraine-controle-connexion"
sourceUpdatedDate: "2026-09-26T14:49:02+02:00"
---

On September 24, 2026, Finnish President Alexander Stubb urged Elon Musk to expand Ukraine’s access to Starlink into Russian-occupied Ukrainian territory and Russia itself. In an [interview with Reuters](https://www.internazionale.it/ultime-notizie-reuters/2026/09/24/finnish-leader-pleads-with-musk-to-help-ukraine-hit-russian-missile-launchers) in New York, he argued that this could help Kyiv strike ballistic missile launchers. The report confirmed neither an agreement nor a corresponding change in service.

His appeal exposes a practical dependency. A military can own the terminals, pay the subscriptions and train its users while still relying on decisions made elsewhere to keep them connected. **The hardware provides access to a service whose conditions remain decisive.**

Several authorities shape that access. Kyiv helps determine which devices are admitted. SpaceX operates the network and distinguishes its civilian and military services. Ground infrastructure carries traffic into terrestrial internet networks. Continuity depends on each layer.

## The network behind the terminal

A terminal needs power, a clear view of the sky and an activated service. Starlink’s [installation guidance](https://starlink.com/ao/support/article/541caa9b-e0b5-36ff-6599-1d3c0ced95f2) describes these physical and commercial requirements. They can fail independently: a powered, correctly installed device can still be denied service.

Starlink satellites travel in **low Earth orbit**, closer to Earth than geostationary satellites, which appear fixed in the sky. [Optical links between satellites](https://starlink.com/technology) can carry traffic through space. To reach a terrestrial server, that traffic must eventually return to the ground. SpaceX describes its [ground stations, or gateways](https://www.sec.gov/Archives/edgar/data/1181412/000162828026041013/japanfwp_06042026.htm), as the connection between the constellation and terrestrial internet networks. Optical links can move the point at which traffic comes down.

<figure class="infographic" style="max-width:33rem;margin:2rem auto;padding-bottom:1rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 342" role="img" aria-labelledby="starlink-en-route-title starlink-en-route-desc" style="width:100%;height:auto" font-family="Arial, Helvetica, sans-serif">
<title id="starlink-en-route-title">How a message travels</title>
<desc id="starlink-en-route-desc">Conceptual path: a terminal connects through satellites to a ground gateway and a terrestrial server. Links between satellites can move the point at which traffic returns to Earth. Arrows follow one message; communication is bidirectional.</desc>
<rect x="0" y="0" width="500" height="342" rx="6" fill="var(--color-surface)"/>
<text x="24" y="34" font-size="24" font-weight="700" text-anchor="start" fill="var(--color-paper)">How a message travels</text>
<text x="24" y="66" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-muted)">Example: reaching a server on Earth</text>
<path d="M112 238V188 M107 195L112 188L117 195" fill="none" stroke="var(--color-signal)" stroke-width="2"/>
<path d="M208 136H292 M285 131L292 136L285 141" fill="none" stroke="var(--color-muted)" stroke-width="2"/>
<path d="M388 184V234 M383 227L388 234L393 227" fill="none" stroke="var(--color-accent)" stroke-width="2"/>
<g>
<rect x="24" y="94" width="176" height="84" rx="6" fill="var(--color-surface)" stroke="var(--color-line-strong)"/>
<text x="112.0" y="130.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-signal)">Satellites</text>
<text x="112.0" y="158.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-signal)">Low orbit</text>
</g>
<g>
<rect x="300" y="94" width="176" height="84" rx="6" fill="var(--color-surface)" stroke="var(--color-line-strong)"/>
<text x="388.0" y="130.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-accent)">Ground</text>
<text x="388.0" y="158.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-accent)">gateway</text>
</g>
<g>
<rect x="24" y="244" width="176" height="74" rx="6" fill="var(--color-surface)" stroke="var(--color-line-strong)"/>
<text x="112.0" y="275.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-paper)">Terminal</text>
<text x="112.0" y="303.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-paper)">User</text>
</g>
<g>
<rect x="300" y="244" width="176" height="74" rx="6" fill="var(--color-surface)" stroke="var(--color-line-strong)"/>
<text x="388.0" y="275.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-paper)">Terrestrial</text>
<text x="388.0" y="303.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-paper)">server</text>
</g>
</svg>
<figcaption>Schematic, without geographic scale or throughput values. Optical links between satellites can relay traffic before it returns to the ground. Sources: <a href="https://starlink.com/technology">Starlink, technology</a>, <a href="https://www.sec.gov/Archives/edgar/data/1181412/000162828026041013/japanfwp_06042026.htm">SpaceX, p. 290</a>. Documentation accessed September 26, 2026.</figcaption>
</figure>

The portability of the equipment conceals the scale of the system serving it. For retail purchases, Starlink says that after activation, [it directly manages the service and account](https://starlink.com/se/support/article/8a90222d-7c32-edd7-51f6-f696ece07105). The customer can move the terminal; the operator continues to run the network.

Coverage maps therefore need to be read alongside access conditions. Radio reach, available capacity and permission to provide service are different constraints. Satellites can pass over an area in which particular devices remain excluded.

## Kyiv also controls terminal admission

On **February 2, 2026**, Ukraine’s Ministry of Defence announced a [list of authorised terminals, implemented with SpaceX](https://mod.gov.ua/en/news/ukraine-rolls-out-starlink-terminal-verification-to-counter-russian-aerial-terror). Its stated purpose was to prevent Russian use of Starlink, including on drones. That rationale comes from the Ukrainian government, a party to the conflict.

A [Starlink support page dated February 4](https://starlink.com/sc/support/article/a47087a0-5178-9b34-0633-1dcb6276a09b) confirms that terminals need government approval to operate in Ukraine. It adds that an unlisted device cannot receive service, **while an active account continues to be billed**. Subscription status and government approval are separate requirements.

The ministry also said verification covered [personally owned terminals used by military personnel](https://mod.gov.ua/en/news/commanders-at-all-levels-are-urged-to-immediately-verify-all-starlink-terminals-used-for-defense). Ownership alone therefore leaves network admission unresolved.

Access controls can support a security measure requested by the government customer. They can also leave a legitimate user disconnected while a device awaits approval. The sources reviewed provide neither an error rate nor an average resolution time. For that user, identifying who can correct an authorisation matters as much as checking the hardware.

## Starshield changes the service terms

Starlink’s [public guidance for government customers](https://starlink.com/ca/support/article/3ccad59e-9525-9492-9835-d1945a4ee30f) recommends the service for civilian agencies and says it is not intended for military end uses or users as defined in its terms. It directs defence requirements towards **Starshield Communications Services**. Government agreements can contain specific provisions; we have not authenticated all the contracts covering Ukrainian terminals. A general commercial page cannot establish whether those users comply with their agreements.

Starshield also covers several activities. [SpaceX](https://new.spacex.com/starshield) describes communications, Earth observation and hosted payloads, meaning customer equipment carried on satellites. Any claim about its infrastructure needs to identify the particular service involved.

Britain provides a documented example. In a response obtained by [Reuters and published on September 10, 2026](https://www.internazionale.it/ultime-notizie-reuters/2026/09/10/exclusive-uk-deepens-reliance-on-musk-s-spacex-spending-nearly-40-million-on-satellite-services), the Ministry of Defence said its Starshield service uses Starlink’s constellation, ground stations and terrestrial infrastructure, with dedicated terminals and separate ground-based network gateways. The ministry also described military-specific encryption, priority and coverage arrangements.

**Stronger contractual rights can therefore rest on partly shared infrastructure.** This describes the British service outlined by the ministry. Contractual commitments and the equipment needed to fulfil them require separate examination.

## Establishing who can make the decision

In July 2025, [Reuters reported](https://ddindia.co.in/2025/07/musk-ordered-shutdown-of-starlink-satellite-service-as-ukraine-retook-territory-from-russia/), citing three sources, that Musk had ordered coverage to be cut in several Ukrainian areas in September 2022. SpaceX disputed the report’s accuracy. That contested historical episode does not describe today’s agreements.

The debate continued in 2026. On [August 31, the Kyiv Independent](https://kyivindependent.com/musk-opposes-allowing-ukraine-to-use-starlink-for-strikes-on-russia-despite-recent-media-reports-sources-say/) reported, citing three people familiar with the matter, that Musk remained opposed to Starlink’s use for strikes inside Russia. It noted conflicting reporting published by the Financial Times the previous day. Accounts of negotiations cannot reconstruct each signatory’s rights. On September 24, Stubb was still publicly pressing for expanded access.

In its [filing with the SEC](https://www.sec.gov/Archives/edgar/data/1181412/000162828026041013/japanfwp_06042026.htm), SpaceX describes the telecommunications authorisations, export controls and sanctions affecting its business. This sets out the company’s general regulatory environment. The specific rules, permissions and contractual clauses governing each requested extension still need to be established.

The public decision chain remains incomplete. Who can authorise the use, who must implement it, and what remedies apply after a refusal? Those answers would reveal each party’s actual discretion. Where a mission requires a connection that cannot readily be replaced, the provider can constrain what is possible even though military authorities retain operational command.

## The cost of switching networks

An immediately available service has an obvious appeal when terrestrial infrastructure is damaged. The [U.S. Space Force’s April 2024 commercial strategy](https://www.vandenberg.spaceforce.mil/News/Article-Display/Article/3736616/ussf-releases-commercial-space-strategy-to-increase-competitive-advantage/) seeks faster access to private-sector capabilities and greater resilience: the ability to keep operating despite disruption. These are the strategy’s stated aims.

Once equipment is installed, software adapted and users trained, switching takes work. Compatible terminals, tested connections and sufficient replacement capacity must be available. This is a **switching cost**: past choices make an alternative slower or more expensive to adopt. It can arise even when subscription prices are identical.

A backup must also address the failure being considered. A second terminal helps if the first breaks. If both are excluded from the same service, doubling the hardware leaves that shared dependency intact. Conversely, different providers may still rely on the same power supply, subcontractor or regulatory permission.

<figure class="infographic" style="max-width:33rem;margin:2rem auto;padding-bottom:1rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 378" role="img" aria-labelledby="starlink-en-dependencies-title starlink-en-dependencies-desc" style="width:100%;height:auto" font-family="Arial, Helvetica, sans-serif">
<title id="starlink-en-dependencies-title">Two devices: what backup?</title>
<desc id="starlink-en-dependencies-desc">Top: two devices connect to network A, sharing a service dependency. Bottom: devices connect to separate networks A and B. This removes one shared dependency but does not guarantee there are no others.</desc>
<rect x="0" y="0" width="500" height="378" rx="6" fill="var(--color-surface)"/>
<text x="24" y="34" font-size="24" font-weight="700" text-anchor="start" fill="var(--color-paper)">Two devices: what backup?</text>
<text x="24" y="83" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-muted)">One shared network</text>
<path d="M168 127H234 M168 185H234 M234 127V185 M234 156H274 M267 151L274 156L267 161" fill="none" stroke="var(--color-accent)" stroke-width="2"/>
<g>
<rect x="24" y="104" width="144" height="46" rx="6" fill="var(--color-surface)" stroke="var(--color-line-strong)"/>
<text x="96.0" y="135.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-paper)">Device 1</text>
</g>
<g>
<rect x="24" y="162" width="144" height="46" rx="6" fill="var(--color-surface)" stroke="var(--color-line-strong)"/>
<text x="96.0" y="193.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-paper)">Device 2</text>
</g>
<g>
<rect x="282" y="133" width="194" height="46" rx="6" fill="var(--color-surface)" stroke="var(--color-line-strong)"/>
<text x="379.0" y="164.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-accent)">Network A</text>
</g>
<text x="24" y="239" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-muted)">Two separate networks</text>
<path d="M176 278H274 M267 273L274 278L267 283" fill="none" stroke="var(--color-signal)" stroke-width="2"/>
<g>
<rect x="24" y="255" width="144" height="46" rx="6" fill="var(--color-surface)" stroke="var(--color-line-strong)"/>
<text x="96.0" y="286.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-paper)">Device 1</text>
</g>
<g>
<rect x="282" y="255" width="194" height="46" rx="6" fill="var(--color-surface)" stroke="var(--color-line-strong)"/>
<text x="379.0" y="286.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-signal)">Network A</text>
</g>
<path d="M176 336H274 M267 331L274 336L267 341" fill="none" stroke="var(--color-accent)" stroke-width="2"/>
<g>
<rect x="24" y="313" width="144" height="46" rx="6" fill="var(--color-surface)" stroke="var(--color-line-strong)"/>
<text x="96.0" y="344.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-paper)">Device 2</text>
</g>
<g>
<rect x="282" y="313" width="194" height="46" rx="6" fill="var(--color-surface)" stroke="var(--color-line-strong)"/>
<text x="379.0" y="344.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-accent)">Network B</text>
</g>
</svg>
<figcaption>Conceptual redundancy diagram, without failure probabilities. Two terminals cannot overcome a shared service denial. Separate networks may still share power, suppliers or access rules. l0g analysis based on <a href="https://starlink.com/sc/support/article/a47087a0-5178-9b34-0633-1dcb6276a09b">Ukraine’s access requirements</a> and the <a href="https://www.internazionale.it/ultime-notizie-reuters/2026/09/10/exclusive-uk-deepens-reliance-on-musk-s-spacex-spending-nearly-40-million-on-satellite-services">shared infrastructure described for Britain</a>.</figcaption>
</figure>

The consequences extend beyond military customers. The [ICRC](https://www.icrc.org/en/publication/icrc-observations-consultants-report-protecting-essential-civilian-services-earth) warns that operations against space systems used for military purposes can disrupt civilian services relying on them. Its analysis also stresses the limits imposed by international law. It does not determine the legality of a particular attack.

## Poland’s investigation advances after the fire

On the evening of **September 23**, a fire affected a Starlink station’s power system and generator in Poland. The next day, minister Krzysztof Gawkowski called it sabotage and said the station was operating again. [Reuters](https://www.internazionale.it/ultime-notizie-reuters/2026/09/24/poland-suspects-fire-at-starlink-station-was-act-of-sabotage) noted that Ukraine had not publicly confirmed any disruption on its side.

**The investigation developed on September 25.** Speaking to [Onet](https://wiadomosci.onet.pl/warszawa/pozar-w-stacji-starlink-prokuratura-wszczela-sledztwo-akt-dywersji/8mrbpx9), National Prosecutor’s Office spokesperson Przemysław Nowak announced an investigation into the fire at Wola Krobowska. He said initial findings indicated arson and gave rise to reasonable suspicion that the perpetrators had acted on Russian intelligence orders. That attribution remains a suspicion announced by prosecutors at this stage of the investigation.

The public technical account is incomplete: the duration of any interruption, which users were affected and which alternative paths actually carried traffic. The reported restoration of the station is also part of the available record. Assessing resilience requires those details, beyond a count of satellites or terminals.

## European options have their own timetable

On **February 12, 2026**, [Eutelsat and Intellian announced the availability of the portable OW7MP terminal](https://eutelsat-com.mynewsdesk.com/pressreleases/eutelsat-and-intellian-introduce-first-leo-manpack-terminal-for-government-and-defence-connectivity-3432227) for government and defence customers on the OneWeb network. It is a concrete vendor offering to assess. The release documents neither deliveries to Ukraine nor equivalence across every Starlink use case.

A comparison needs to establish capacity in the relevant area, permitted uses, delivery schedules and integration with existing equipment. Industrial continuity matters too. On **September 10**, [Eutelsat announced two Arianespace launches scheduled for 2027 and 2028](https://eutelsat-com.mynewsdesk.com/pressreleases/eutelsat-selects-arianespace-for-two-upcoming-oneweb-leo-launches-3466470) to help renew OneWeb.

For **IRIS²**, Europe’s secure-connectivity programme, the [European Commission said on September 17](https://digital-strategy.ec.europa.eu/en/news/eu-and-korea-deepen-cooperation-secure-satellite-connectivity) that the first phase was scheduled for launch by the end of **2029**. This future milestone is not a guarantee of full service by that date. It does not itself address the needs of winter 2026.

These distinctions echo our series on [digital sovereignty and its hardware dependencies](/en/analysis/your-identity-in-your-phone-7-a-sovereign-identity-on-an-american-phone/): control over a service depends on its operating conditions and workable alternatives.

As of **September 26, 2026**, none of the sources reviewed confirms acceptance of Stubb’s request or a corresponding extension becoming operational. The question remains concrete: **will the connection work where it is needed, when it is needed, for the intended use?** The terminal is only the visible part of the answer.

## Sources

- Reuters / Internazionale, 2026-09-24. [Finnish leader pleads with Musk to help Ukraine hit Russian missile launchers](https://www.internazionale.it/ultime-notizie-reuters/2026/09/24/finnish-leader-pleads-with-musk-to-help-ukraine-hit-russian-missile-launchers).
- Starlink, accessed September 26, 2026. [Technology / Technologie](https://starlink.com/technology).
- SpaceX / SEC EDGAR, 2026-06. [Securities registration statement: ground stations (p. 290), regulatory environment and risk factors](https://www.sec.gov/Archives/edgar/data/1181412/000162828026041013/japanfwp_06042026.htm).
- Starlink, accessed September 26, 2026. [Who is a Starlink authorized retailer?](https://starlink.com/se/support/article/8a90222d-7c32-edd7-51f6-f696ece07105).
- Ministère ukrainien de la Défense / Ukrainian Ministry of Defence, 2026-02-02. [Ukraine rolls out Starlink terminal verification to counter russian aerial terror](https://mod.gov.ua/en/news/ukraine-rolls-out-starlink-terminal-verification-to-counter-russian-aerial-terror).
- Starlink, 2026-02-04. [Update on Starlink Service in Ukraine | February 4, 2026](https://starlink.com/sc/support/article/a47087a0-5178-9b34-0633-1dcb6276a09b).
- Ministère ukrainien de la Défense / Ukrainian Ministry of Defence, 2026-02-04. [Commanders at all levels are urged to immediately verify all Starlink terminals used for defense](https://mod.gov.ua/en/news/commanders-at-all-levels-are-urged-to-immediately-verify-all-starlink-terminals-used-for-defense).
- Starlink, accessed September 26, 2026. [Is Starlink available for purchase by Government entities?](https://starlink.com/ca/support/article/3ccad59e-9525-9492-9835-d1945a4ee30f).
- SpaceX, accessed September 26, 2026. [Starshield](https://new.spacex.com/starshield).
- Reuters / Internazionale, 2026-09-10. [UK deepens reliance on Musk’s SpaceX, spending nearly $40 million on satellite services](https://www.internazionale.it/ultime-notizie-reuters/2026/09/10/exclusive-uk-deepens-reliance-on-musk-s-spacex-spending-nearly-40-million-on-satellite-services).
- Reuters / DD India, 2025-07-26. [Musk ordered shutdown of Starlink satellite service as Ukraine retook territory from Russia](https://ddindia.co.in/2025/07/musk-ordered-shutdown-of-starlink-satellite-service-as-ukraine-retook-territory-from-russia/).
- U.S. Space Force, 2024-04-10. [USSF releases Commercial Space Strategy to increase competitive advantage](https://www.vandenberg.spaceforce.mil/News/Article-Display/Article/3736616/ussf-releases-commercial-space-strategy-to-increase-competitive-advantage/).
- CICR / ICRC, 2024-06-25. [ICRC Observations: Protecting Essential Civilian Services on Earth from Disruption by Military Space Operations](https://www.icrc.org/en/publication/icrc-observations-consultants-report-protecting-essential-civilian-services-earth).
- Reuters / Internazionale, 2026-09-24. [Polish minister says Starlink station fire was sabotage](https://www.internazionale.it/ultime-notizie-reuters/2026/09/24/poland-suspects-fire-at-starlink-station-was-act-of-sabotage).
- Eutelsat / Intellian, 2026-02-12. [Eutelsat and Intellian Introduce First LEO Manpack Terminal for Government and Defence Connectivity](https://eutelsat-com.mynewsdesk.com/pressreleases/eutelsat-and-intellian-introduce-first-leo-manpack-terminal-for-government-and-defence-connectivity-3432227).
- Eutelsat, 2026-09-10. [Eutelsat selects Arianespace for two upcoming OneWeb LEO launches](https://eutelsat-com.mynewsdesk.com/pressreleases/eutelsat-selects-arianespace-for-two-upcoming-oneweb-leo-launches-3466470).
- Commission européenne / European Commission, 2026-09-17; mise à jour 2026-09-18. [EU and Korea deepen cooperation on secure satellite connectivity](https://digital-strategy.ec.europa.eu/en/news/eu-and-korea-deepen-cooperation-secure-satellite-connectivity).
- Starlink, accessed September 26, 2026. [Enterprise FAQs: Initial Setup](https://starlink.com/ao/support/article/541caa9b-e0b5-36ff-6599-1d3c0ced95f2).
- Onet, Piotr Halicki, 2026-09-25. [Pożar w stacji Starlink. Prokuratura wszczęła śledztwo](https://wiadomosci.onet.pl/warszawa/pozar-w-stacji-starlink-prokuratura-wszczela-sledztwo-akt-dywersji/8mrbpx9).
- The Kyiv Independent, 2026-08-31. [Musk opposes allowing Ukraine to use Starlink for strikes on Russia, sources say](https://kyivindependent.com/musk-opposes-allowing-ukraine-to-use-starlink-for-strikes-on-russia-despite-recent-media-reports-sources-say/).

## Method and limitations

Research current to September 26, 2026. Examples and diagrams are conceptual, without field measurements or military operating parameters. Ukrainian contracts, detailed outage data and an independent performance comparison remain unavailable in the material reviewed.

Starlink’s support pages were read in their public browser-rendered versions. Commercial guidance does not authenticate government contracts. SpaceX and Eutelsat describe their own services; authorities are cited for their announcements. Onet reports the attribution raised by Polish prosecutors. No military effectiveness estimate or judicial conclusion has been added. l0g conducted no interviews for this article.
