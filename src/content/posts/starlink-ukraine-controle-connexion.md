---
title: "Starlink : qui décide où la connexion s’arrête ?"
seoTitle: "Starlink et Ukraine : qui contrôle l’accès au réseau ? | l0g"
description: "Terminaux autorisés par Kyiv, contrats Starshield, incendie en Pologne et alternatives européennes : les dépendances derrière la connexion Starlink."
pubDate: "2026-09-26T14:49:02+02:00"
tags: ["Starlink", "Ukraine", "SpaceX", "satellites", "souveraineté numérique", "géopolitique"]
draft: false
ogImage: "/illustrations/news/starlink-controle-connexion-v1.jpg"
quickTake: {"fact": "Le 24 septembre 2026, Alexander Stubb a demandé à Musk d’élargir l’accès ukrainien à Starlink, notamment en Russie.", "importance": "Le terminal dépend des autorisations, du contrat et des infrastructures du fournisseur. La continuité exige de vérifier toute cette chaîne.", "uncertainty": "Aucune extension correspondant à cette demande n’est confirmée dans les sources consultées. Les contrats ukrainiens et le bilan technique de l’incendie polonais restent incomplets."}
---

Le 24 septembre 2026, le président finlandais Alexander Stubb a demandé à Elon Musk d’élargir l’accès de l’Ukraine à Starlink, jusque dans des territoires ukrainiens occupés et en Russie. Dans son [entretien à Reuters](https://www.internazionale.it/ultime-notizie-reuters/2026/09/24/finnish-leader-pleads-with-musk-to-help-ukraine-hit-russian-missile-launchers), à New York, il présente cette extension comme un moyen d’aider Kyiv à frapper des lanceurs de missiles balistiques. Aucun accord ni changement de service correspondant n’est confirmé dans cette dépêche.

L’appel révèle une dépendance très concrète. Une armée peut posséder les antennes, financer les abonnements et former ses utilisateurs tout en restant tributaire de décisions prises ailleurs pour les faire fonctionner. **Acheter le terminal donne accès à un service dont les conditions restent déterminantes.**

Cette chaîne comporte plusieurs centres de décision. Kyiv participe à l’autorisation des appareils. SpaceX exploite le réseau et distingue ses offres civiles de ses services militaires. Des installations au sol assurent les échanges avec l’internet terrestre. La continuité de la connexion se joue à chacun de ces étages.

## Derrière l’antenne, tout un réseau

Un terminal a besoin d’électricité, d’une vue dégagée du ciel et d’un service activé. La [documentation d’installation de Starlink](https://starlink.com/ao/support/article/541caa9b-e0b5-36ff-6599-1d3c0ced95f2) décrit ces conditions matérielles et commerciales. Elles peuvent échouer séparément : un appareil alimenté et correctement installé peut rester privé de service.

Les satellites de Starlink circulent en **orbite basse**, à proximité de la Terre par rapport aux satellites géostationnaires, qui paraissent fixes dans le ciel. Des [liaisons optiques entre satellites](https://starlink.com/technology) permettent de transporter les données dans l’espace. Pour joindre un serveur terrestre, le trafic doit ensuite rejoindre le sol : SpaceX décrit ses [stations terrestres, ou passerelles](https://www.sec.gov/Archives/edgar/data/1181412/000162828026041013/japanfwp_06042026.htm), comme les relais entre la constellation et les réseaux internet. Les liaisons optiques peuvent déplacer ce point de sortie.

<figure class="infographic" style="max-width:33rem;margin:2rem auto;padding-bottom:1rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 342" role="img" aria-labelledby="starlink-fr-route-title starlink-fr-route-desc" style="width:100%;height:auto" font-family="Arial, Helvetica, sans-serif">
<title id="starlink-fr-route-title">Le trajet d’un message</title>
<desc id="starlink-fr-route-desc">Trajet conceptuel : du terminal vers des satellites, puis une passerelle au sol et un serveur terrestre. Les liaisons entre satellites peuvent déplacer le point de retour au sol. Les flèches suivent un message ; les communications sont bidirectionnelles.</desc>
<rect x="0" y="0" width="500" height="342" rx="6" fill="var(--color-surface)"/>
<text x="24" y="34" font-size="24" font-weight="700" text-anchor="start" fill="var(--color-paper)">Le trajet d’un message</text>
<text x="24" y="66" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-muted)">Exemple vers un serveur terrestre</text>
<path d="M112 238V188 M107 195L112 188L117 195" fill="none" stroke="var(--color-signal)" stroke-width="2"/>
<path d="M208 136H292 M285 131L292 136L285 141" fill="none" stroke="var(--color-muted)" stroke-width="2"/>
<path d="M388 184V234 M383 227L388 234L393 227" fill="none" stroke="var(--color-accent)" stroke-width="2"/>
<g>
<rect x="24" y="94" width="176" height="84" rx="6" fill="var(--color-surface)" stroke="var(--color-line-strong)"/>
<text x="112.0" y="130.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-signal)">Satellites</text>
<text x="112.0" y="158.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-signal)">Orbite basse</text>
</g>
<g>
<rect x="300" y="94" width="176" height="84" rx="6" fill="var(--color-surface)" stroke="var(--color-line-strong)"/>
<text x="388.0" y="130.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-accent)">Passerelle</text>
<text x="388.0" y="158.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-accent)">au sol</text>
</g>
<g>
<rect x="24" y="244" width="176" height="74" rx="6" fill="var(--color-surface)" stroke="var(--color-line-strong)"/>
<text x="112.0" y="275.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-paper)">Terminal</text>
<text x="112.0" y="303.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-paper)">Utilisateur</text>
</g>
<g>
<rect x="300" y="244" width="176" height="74" rx="6" fill="var(--color-surface)" stroke="var(--color-line-strong)"/>
<text x="388.0" y="275.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-paper)">Serveur</text>
<text x="388.0" y="303.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-paper)">terrestre</text>
</g>
</svg>
<figcaption>Schéma de fonctionnement, sans échelle géographique ni débit. Les liens optiques entre satellites permettent de relayer le trafic avant son retour au sol. Sources : <a href="https://starlink.com/technology">Starlink, technology</a>, <a href="https://www.sec.gov/Archives/edgar/data/1181412/000162828026041013/japanfwp_06042026.htm">SpaceX, p. 290</a>. Documentation consultée le 26 septembre 2026.</figcaption>
</figure>

La mobilité du petit équipement masque ainsi l’étendue de l’infrastructure qui le dessert. Dans ses ventes au détail, Starlink précise qu’après l’activation d’un appareil acheté chez un revendeur, [le service et le compte sont gérés directement par Starlink](https://starlink.com/se/support/article/8a90222d-7c32-edd7-51f6-f696ece07105). Le client transporte l’antenne ; l’opérateur continue de faire fonctionner le système.

Une carte de couverture doit donc se lire avec ses conditions d’accès. La portée radio, la capacité disponible et l’autorisation de fournir le service désignent des contraintes différentes. Des satellites peuvent survoler une zone où certains appareils restent exclus du réseau.

## Kyiv contrôle aussi l’admission des terminaux

Le **2 février 2026**, le ministère ukrainien de la Défense a annoncé une [liste de terminaux autorisés, mise en place avec SpaceX](https://mod.gov.ua/en/news/ukraine-rolls-out-starlink-terminal-verification-to-counter-russian-aerial-terror). Son objectif déclaré : empêcher des usages russes de Starlink, notamment à bord de drones. Ce motif est celui du gouvernement ukrainien, partie au conflit.

La [page d’assistance de Starlink datée du 4 février](https://starlink.com/sc/support/article/a47087a0-5178-9b34-0633-1dcb6276a09b) confirme que les terminaux doivent obtenir l’approbation du gouvernement pour fonctionner en Ukraine. Elle précise qu’un appareil absent de la liste ne reçoit pas le service, **alors qu’un compte actif continue d’être facturé**. L’abonnement et l’autorisation constituent deux conditions distinctes.

Le ministère a également indiqué que la vérification concernait les [terminaux personnels employés par les militaires](https://mod.gov.ua/en/news/commanders-at-all-levels-are-urged-to-immediately-verify-all-starlink-terminals-used-for-defense). La propriété du matériel laisse donc entière la question de son admission sur le réseau.

Le contrôle de l’accès peut servir un objectif de sécurité demandé par le client étatique. Il expose aussi l’utilisateur légitime dont le terminal attend une validation à une interruption administrative. Les sources consultées ne donnent ni taux d’erreur ni délai moyen de résolution. Pour cet utilisateur, identifier l’acteur capable de corriger l’autorisation compte autant que vérifier l’antenne.

## Starshield change les conditions du service

La [documentation commerciale destinée aux administrations](https://starlink.com/ca/support/article/3ccad59e-9525-9492-9835-d1945a4ee30f) recommande Starlink aux organismes civils et indique qu’il n’est pas destiné aux usages ou utilisateurs militaires définis par ses conditions. Elle oriente les besoins de défense vers **Starshield Communications Services**. Les accords gouvernementaux peuvent prévoir des modalités particulières ; nous n’avons pas accès à l’ensemble de ceux qui couvrent les terminaux ukrainiens. Leur conformité ne peut être jugée à partir d’une page commerciale générale.

Starshield recouvre par ailleurs plusieurs activités : [SpaceX](https://new.spacex.com/starshield) y rassemble communications, observation de la Terre et accueil de charges utiles, c’est-à-dire d’équipements clients embarqués sur des satellites. Il faut préciser de quelle offre on parle avant d’en décrire les infrastructures.

Le cas britannique fournit un exemple documenté. Dans une réponse obtenue par [Reuters et publiée le 10 septembre 2026](https://www.internazionale.it/ultime-notizie-reuters/2026/09/10/exclusive-uk-deepens-reliance-on-musk-s-spacex-spending-nearly-40-million-on-satellite-services), le ministère de la Défense explique que son service Starshield utilise la constellation, les stations au sol et l’infrastructure terrestre de Starlink, avec des terminaux dédiés et des passerelles de réseau distinctes. Il décrit aussi des modalités militaires particulières de chiffrement, de priorité et de couverture.

**Des droits d’usage renforcés peuvent ainsi s’appuyer sur une infrastructure en partie commune.** Cette observation concerne l’offre britannique décrite par le ministère. Elle invite à examiner séparément les engagements contractuels et les équipements dont dépend leur exécution.

## Les pouvoirs de décision doivent être précisés

En juillet 2025, [Reuters a rapporté](https://ddindia.co.in/2025/07/musk-ordered-shutdown-of-starlink-satellite-service-as-ukraine-retook-territory-from-russia/), sur trois sources, un ordre de coupure donné par Musk dans plusieurs secteurs ukrainiens en septembre 2022. SpaceX a contesté l’exactitude de l’enquête. Ce précédent historique, contesté par l’entreprise, ne décrit pas les engagements actuels.

Le débat s’est poursuivi en 2026. Le [31 août, le Kyiv Independent](https://kyivindependent.com/musk-opposes-allowing-ukraine-to-use-starlink-for-strikes-on-russia-despite-recent-media-reports-sources-say/) rapportait, sur trois sources informées, que Musk restait opposé à l’emploi de Starlink pour des frappes en Russie. Le journal relevait des informations divergentes publiées la veille par le Financial Times. Ces récits de négociations ne permettent pas de reconstituer les droits de chaque signataire. Le 24 septembre, Stubb portait encore publiquement cette demande.

Dans son [document déposé auprès de la SEC](https://www.sec.gov/Archives/edgar/data/1181412/000162828026041013/japanfwp_06042026.htm), SpaceX expose les autorisations de télécommunications, les contrôles des exportations et les sanctions auxquels ses activités sont soumises. L’entreprise décrit ainsi son cadre réglementaire général. La règle précise applicable à chaque extension demandée, les éventuelles autorisations et les clauses du contrat concerné restent à établir.

La chaîne publique de décision demeure incomplète. Qui peut autoriser l’usage, qui doit l’exécuter et quels recours existent en cas de refus ? Ces réponses permettraient de mesurer la marge réelle de chaque acteur. Lorsqu’une mission dépend d’une liaison difficile à remplacer, le fournisseur peut peser sur ses possibilités de réalisation, même si le commandement de l’opération demeure militaire.

## Le coût de changer de réseau

L’intérêt d’un service disponible immédiatement est évident pour un utilisateur confronté à une infrastructure terrestre dégradée. La [stratégie commerciale de l’U.S. Space Force publiée en avril 2024](https://www.vandenberg.spaceforce.mil/News/Article-Display/Article/3736616/ussf-releases-commercial-space-strategy-to-increase-competitive-advantage/) vise notamment à accélérer l’accès aux capacités des entreprises et à renforcer la résilience, autrement dit la capacité à continuer de fonctionner malgré des perturbations. Ce sont les objectifs de cette stratégie.

Une fois les appareils installés, les logiciels adaptés et les utilisateurs formés, une transition demande du travail. Il faut disposer de terminaux compatibles, vérifier les liaisons et retrouver une capacité suffisante. C’est le **coût de changement de fournisseur** : les choix déjà réalisés rendent une autre solution plus longue ou plus coûteuse à adopter. Ce mécanisme peut exister même à tarif d’abonnement identique.

Un secours doit aussi répondre à la panne redoutée. Un second terminal aide si le premier tombe en panne. Si les deux sont exclus du même service, doubler le matériel laisse cette dépendance commune entière. À l’inverse, deux fournisseurs peuvent encore partager une alimentation, un prestataire ou une contrainte réglementaire.

<figure class="infographic" style="max-width:33rem;margin:2rem auto;padding-bottom:1rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 378" role="img" aria-labelledby="starlink-fr-dependencies-title starlink-fr-dependencies-desc" style="width:100%;height:auto" font-family="Arial, Helvetica, sans-serif">
<title id="starlink-fr-dependencies-title">Deux appareils, quel secours ?</title>
<desc id="starlink-fr-dependencies-desc">En haut, deux appareils rejoignent le même réseau A : la dépendance au service reste commune. En bas, les appareils rejoignent des réseaux A et B distincts. Cette séparation réduit une dépendance mais ne garantit pas l’absence d’autres points communs.</desc>
<rect x="0" y="0" width="500" height="378" rx="6" fill="var(--color-surface)"/>
<text x="24" y="34" font-size="24" font-weight="700" text-anchor="start" fill="var(--color-paper)">Deux appareils, quel secours ?</text>
<text x="24" y="83" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-muted)">Un seul réseau</text>
<path d="M168 127H234 M168 185H234 M234 127V185 M234 156H274 M267 151L274 156L267 161" fill="none" stroke="var(--color-accent)" stroke-width="2"/>
<g>
<rect x="24" y="104" width="144" height="46" rx="6" fill="var(--color-surface)" stroke="var(--color-line-strong)"/>
<text x="96.0" y="135.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-paper)">Appareil 1</text>
</g>
<g>
<rect x="24" y="162" width="144" height="46" rx="6" fill="var(--color-surface)" stroke="var(--color-line-strong)"/>
<text x="96.0" y="193.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-paper)">Appareil 2</text>
</g>
<g>
<rect x="282" y="133" width="194" height="46" rx="6" fill="var(--color-surface)" stroke="var(--color-line-strong)"/>
<text x="379.0" y="164.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-accent)">Réseau A</text>
</g>
<text x="24" y="239" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-muted)">Deux réseaux distincts</text>
<path d="M176 278H274 M267 273L274 278L267 283" fill="none" stroke="var(--color-signal)" stroke-width="2"/>
<g>
<rect x="24" y="255" width="144" height="46" rx="6" fill="var(--color-surface)" stroke="var(--color-line-strong)"/>
<text x="96.0" y="286.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-paper)">Appareil 1</text>
</g>
<g>
<rect x="282" y="255" width="194" height="46" rx="6" fill="var(--color-surface)" stroke="var(--color-line-strong)"/>
<text x="379.0" y="286.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-signal)">Réseau A</text>
</g>
<path d="M176 336H274 M267 331L274 336L267 341" fill="none" stroke="var(--color-accent)" stroke-width="2"/>
<g>
<rect x="24" y="313" width="144" height="46" rx="6" fill="var(--color-surface)" stroke="var(--color-line-strong)"/>
<text x="96.0" y="344.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-paper)">Appareil 2</text>
</g>
<g>
<rect x="282" y="313" width="194" height="46" rx="6" fill="var(--color-surface)" stroke="var(--color-line-strong)"/>
<text x="379.0" y="344.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-accent)">Réseau B</text>
</g>
</svg>
<figcaption>Schéma conceptuel de redondance, sans probabilité de panne. Deux terminaux ne couvrent pas un refus commun de service. Deux réseaux peuvent encore partager électricité, prestataires ou règles d’accès. Analyse l0g à partir des <a href="https://starlink.com/sc/support/article/a47087a0-5178-9b34-0633-1dcb6276a09b">conditions d’accès en Ukraine</a> et des <a href="https://www.internazionale.it/ultime-notizie-reuters/2026/09/10/exclusive-uk-deepens-reliance-on-musk-s-spacex-spending-nearly-40-million-on-satellite-services">infrastructures partagées décrites pour le Royaume-Uni</a>.</figcaption>
</figure>

Les conséquences débordent le seul client militaire. Le [CICR](https://www.icrc.org/en/publication/icrc-observations-consultants-report-protecting-essential-civilian-services-earth) souligne que des opérations contre des systèmes spatiaux employés militairement peuvent affecter les services civils qui en dépendent. Son analyse rappelle aussi les limites posées par le droit international. Elle ne qualifie pas la légalité d’une attaque précise.

## En Pologne, l’enquête se précise après l’incendie

Le **23 septembre au soir**, un incendie a touché l’alimentation et le générateur d’une station Starlink en Pologne. Le lendemain, le ministre Krzysztof Gawkowski l’a qualifié de sabotage et a indiqué que la station fonctionnait de nouveau. [Reuters](https://www.internazionale.it/ultime-notizie-reuters/2026/09/24/poland-suspects-fire-at-starlink-station-was-act-of-sabotage) précisait alors que l’Ukraine n’avait pas confirmé publiquement d’interruption de son côté.

**L’enquête a évolué le 25 septembre.** Interrogé par [Onet](https://wiadomosci.onet.pl/warszawa/pozar-w-stacji-starlink-prokuratura-wszczela-sledztwo-akt-dywersji/8mrbpx9), le porte-parole du parquet national polonais, Przemysław Nowak, a annoncé l’ouverture d’une enquête sur l’incendie de Wola Krobowska. Selon lui, les premiers constats indiquent un incendie volontaire et font naître un soupçon fondé d’action sur ordre des services russes. Cette attribution est une piste annoncée par le parquet, à ce stade de l’enquête.

Le bilan technique public reste incomplet : durée d’une éventuelle interruption, utilisateurs affectés et chemins de remplacement effectivement employés. Le rétablissement annoncé de la station fait partie du constat disponible. Évaluer la résistance du réseau à cet événement exige ces éléments, au-delà du seul nombre de satellites ou de terminaux.

## Les options européennes ont leur propre calendrier

Le **12 février 2026**, [Eutelsat et Intellian ont annoncé la disponibilité du terminal portatif OW7MP](https://eutelsat-com.mynewsdesk.com/pressreleases/eutelsat-and-intellian-introduce-first-leo-manpack-terminal-for-government-and-defence-connectivity-3432227) pour les clients gouvernementaux et de défense du réseau OneWeb. C’est une offre à examiner, présentée par ses fournisseurs. Le communiqué ne documente pas des livraisons à l’Ukraine ni une équivalence pour tous les usages de Starlink.

La comparaison doit porter sur la capacité accessible dans une zone donnée, les usages autorisés, les délais de livraison et l’intégration aux équipements existants. La continuité industrielle compte également : le **10 septembre**, [Eutelsat a annoncé deux lancements Arianespace prévus en 2027 et 2028](https://eutelsat-com.mynewsdesk.com/pressreleases/eutelsat-selects-arianespace-for-two-upcoming-oneweb-leo-launches-3466470) pour contribuer au renouvellement de OneWeb.

Pour **IRIS²**, le programme européen de connectivité sécurisée, la [Commission européenne indiquait le 17 septembre](https://digital-strategy.ec.europa.eu/en/news/eu-and-korea-deepen-cooperation-secure-satellite-connectivity) que le lancement de la première phase était prévu d’ici fin **2029**. Ce jalon futur ne correspond pas à une garantie de service complet à cette date. Il ne répond pas à lui seul aux besoins de l’hiver 2026.

Ces distinctions rejoignent celles de notre série sur [la souveraineté numérique et ses dépendances matérielles](/posts/votre-identite-dans-un-telephone-7-une-identite-souveraine-sur-un-telephone-americain/) : la maîtrise d’un service se mesure à ses conditions réelles de fonctionnement et aux possibilités de remplacement.

Au **26 septembre 2026**, aucune source consultée ne confirme l’acceptation de la demande de Stubb ou une extension correspondante devenue opérationnelle. La question reste concrète : **la liaison fonctionnera-t-elle à l’endroit voulu, au moment nécessaire, pour l’usage prévu ?** Le terminal n’en est que la partie visible.

## Sources

- Reuters / Internazionale, 2026-09-24. [Finnish leader pleads with Musk to help Ukraine hit Russian missile launchers](https://www.internazionale.it/ultime-notizie-reuters/2026/09/24/finnish-leader-pleads-with-musk-to-help-ukraine-hit-russian-missile-launchers).
- Starlink, consulté le 26 septembre 2026. [Technology / Technologie](https://starlink.com/technology).
- SpaceX / SEC EDGAR, 2026-06. [Securities registration statement: ground stations (p. 290), regulatory environment and risk factors](https://www.sec.gov/Archives/edgar/data/1181412/000162828026041013/japanfwp_06042026.htm).
- Starlink, consulté le 26 septembre 2026. [Who is a Starlink authorized retailer?](https://starlink.com/se/support/article/8a90222d-7c32-edd7-51f6-f696ece07105).
- Ministère ukrainien de la Défense / Ukrainian Ministry of Defence, 2026-02-02. [Ukraine rolls out Starlink terminal verification to counter russian aerial terror](https://mod.gov.ua/en/news/ukraine-rolls-out-starlink-terminal-verification-to-counter-russian-aerial-terror).
- Starlink, 2026-02-04. [Update on Starlink Service in Ukraine | February 4, 2026](https://starlink.com/sc/support/article/a47087a0-5178-9b34-0633-1dcb6276a09b).
- Ministère ukrainien de la Défense / Ukrainian Ministry of Defence, 2026-02-04. [Commanders at all levels are urged to immediately verify all Starlink terminals used for defense](https://mod.gov.ua/en/news/commanders-at-all-levels-are-urged-to-immediately-verify-all-starlink-terminals-used-for-defense).
- Starlink, consulté le 26 septembre 2026. [Is Starlink available for purchase by Government entities?](https://starlink.com/ca/support/article/3ccad59e-9525-9492-9835-d1945a4ee30f).
- SpaceX, consulté le 26 septembre 2026. [Starshield](https://new.spacex.com/starshield).
- Reuters / Internazionale, 2026-09-10. [UK deepens reliance on Musk’s SpaceX, spending nearly $40 million on satellite services](https://www.internazionale.it/ultime-notizie-reuters/2026/09/10/exclusive-uk-deepens-reliance-on-musk-s-spacex-spending-nearly-40-million-on-satellite-services).
- Reuters / DD India, 2025-07-26. [Musk ordered shutdown of Starlink satellite service as Ukraine retook territory from Russia](https://ddindia.co.in/2025/07/musk-ordered-shutdown-of-starlink-satellite-service-as-ukraine-retook-territory-from-russia/).
- U.S. Space Force, 2024-04-10. [USSF releases Commercial Space Strategy to increase competitive advantage](https://www.vandenberg.spaceforce.mil/News/Article-Display/Article/3736616/ussf-releases-commercial-space-strategy-to-increase-competitive-advantage/).
- CICR / ICRC, 2024-06-25. [ICRC Observations: Protecting Essential Civilian Services on Earth from Disruption by Military Space Operations](https://www.icrc.org/en/publication/icrc-observations-consultants-report-protecting-essential-civilian-services-earth).
- Reuters / Internazionale, 2026-09-24. [Polish minister says Starlink station fire was sabotage](https://www.internazionale.it/ultime-notizie-reuters/2026/09/24/poland-suspects-fire-at-starlink-station-was-act-of-sabotage).
- Eutelsat / Intellian, 2026-02-12. [Eutelsat and Intellian Introduce First LEO Manpack Terminal for Government and Defence Connectivity](https://eutelsat-com.mynewsdesk.com/pressreleases/eutelsat-and-intellian-introduce-first-leo-manpack-terminal-for-government-and-defence-connectivity-3432227).
- Eutelsat, 2026-09-10. [Eutelsat selects Arianespace for two upcoming OneWeb LEO launches](https://eutelsat-com.mynewsdesk.com/pressreleases/eutelsat-selects-arianespace-for-two-upcoming-oneweb-leo-launches-3466470).
- Commission européenne / European Commission, 2026-09-17; mise à jour 2026-09-18. [EU and Korea deepen cooperation on secure satellite connectivity](https://digital-strategy.ec.europa.eu/en/news/eu-and-korea-deepen-cooperation-secure-satellite-connectivity).
- Starlink, consulté le 26 septembre 2026. [Enterprise FAQs: Initial Setup](https://starlink.com/ao/support/article/541caa9b-e0b5-36ff-6599-1d3c0ced95f2).
- Onet, Piotr Halicki, 2026-09-25. [Pożar w stacji Starlink. Prokuratura wszczęła śledztwo](https://wiadomosci.onet.pl/warszawa/pozar-w-stacji-starlink-prokuratura-wszczela-sledztwo-akt-dywersji/8mrbpx9).
- The Kyiv Independent, 2026-08-31. [Musk opposes allowing Ukraine to use Starlink for strikes on Russia, sources say](https://kyivindependent.com/musk-opposes-allowing-ukraine-to-use-starlink-for-strikes-on-russia-despite-recent-media-reports-sources-say/).

## Méthode et limites

Analyse arrêtée au 26 septembre 2026. Les exemples et schémas sont conceptuels, sans mesures de terrain ni paramètres d’emploi militaire. Les contrats ukrainiens, le bilan détaillé des interruptions et une comparaison indépendante des performances restent indisponibles dans les documents consultés.

Les pages d’assistance de Starlink ont été lues dans leur version publique rendue par navigateur. Leur présentation commerciale ne vaut pas authentification des contrats gouvernementaux. SpaceX et Eutelsat décrivent leurs propres offres ; les autorités sont citées pour leurs annonces. L’attribution évoquée par le parquet polonais est rapportée par Onet. Aucune mesure d’efficacité militaire ni conclusion judiciaire n’est ajoutée. Aucun entretien propre à l0g n’a été réalisé.
