---
title: "Bull à Angers : les puces, l’usine et le cash"
seoTitle: "Bull à Angers : supercalculateurs, usine et dépendances | l0g"
description: "Bull annonce une capacité doublée à Angers. Puces, intégration, contrats et trésorerie : suivre la chaîne industrielle des supercalculateurs européens."
pubDate: "2026-10-02T09:55:39+02:00"
updatedDate: "2026-10-02T09:55:39+02:00"
tags: ["industrie", "supercalculateurs", "IA", "Europe", "financement"]
draft: false
ogImage: "/illustrations/news/bull-angers-supercomputers-2026-v1.jpg"
quickTake:
  fact: "Bull annonce une capacité de production doublée à Angers. Reuters rapporte un investissement de 80 M€, selon les dirigeants du groupe."
  importance: "L’intégration, les tests, le réseau et le refroidissement créent une compétence industrielle. Les composants et le calendrier des paiements conditionnent les livraisons."
  uncertainty: "Les annonces ne donnent ni marge par système ni valeur ajoutée locale détaillée. Plusieurs configurations et performances restent en cours de déploiement ou de validation."
---

À Angers, une partie de la course au calcul se joue dans un atelier. Bull y annonce une capacité de production doublée. Reuters rapporte, le **1er octobre 2026**, un investissement de **80 millions d’euros**, selon les dirigeants du groupe. Ceux-ci décrivent une capacité passant de **6 à 12 armoires par mois** ; ce décompte ne mesure pas la puissance de calcul livrée. Le site assemble des systèmes, les teste et valide les configurations avant livraison. [S01](#source-s01) [S02](#source-s02)

Cette expansion pose une question industrielle précise : quelle partie d’un supercalculateur sait-on concevoir, construire, faire fonctionner et réparer en Europe ? Pour y répondre, il faut regarder les composants et les droits sur les technologies, mais aussi les essais, les compétences et l’argent immobilisé avant la réception de la machine.

Le mot « souveraineté », présent dans les annonces publiques, rassemble ici plusieurs objectifs : conserver un constructeur, choisir l’architecture, disposer des capacités sur le territoire et maîtriser l’exploitation. Chacun porte sur une dépendance différente. L’acquisition de Bull par l’État français, finalisée le **31 mars 2026**, concerne le contrôle de l’entreprise. Le fonctionnement de ses machines repose sur une chaîne industrielle internationale. [S04](#source-s04) [S05](#source-s05)

*Analyse vérifiée le 2 octobre 2026. Bercy a annoncé pour aujourd’hui une visite et une cérémonie d’inauguration à Angers ; ce programme ne constate pas encore leur réalisation. [S19](#source-s19)*

## L’endroit où des composants deviennent une machine

Un supercalculateur réunit de nombreuses unités de calcul qui doivent travailler ensemble. Les processeurs généralistes, ou CPU, exécutent les programmes ; les accélérateurs, souvent des [GPU](/glossaire/gpu/), réalisent massivement certaines opérations en parallèle. La mémoire les alimente en données. Le réseau fait circuler les résultats entre unités, tandis que le refroidissement permet de tenir la charge. Les architectures publiées de JUPITER et d’Alice Recoque montrent cette combinaison. [S08](#source-s08) [S09](#source-s09)

Le métier de l’intégrateur consiste à rendre cet ensemble cohérent. Une puce performante peut attendre ses données ; des accélérateurs peuvent passer du temps à échanger leurs résultats ; une machine peut atteindre sa limite thermique avant sa limite de calcul. Ces contraintes expliquent pourquoi la valeur industrielle se répartit entre l’électronique, l’interconnexion et l’ingénierie du système. Bull développe notamment le réseau BXI et des solutions de refroidissement liquide. [S12](#source-s12) [S13](#source-s13)

À Angers, Bull décrit des activités de validation, d’industrialisation, d’assemblage, de tests et de gestion des pièces détachées. Leur utilité économique se prolonge après la livraison : retrouver une panne, remplacer une pièce, maintenir une configuration ou adapter un système demande une connaissance de la machine complète. C’est une compétence qui se construit avec les projets et les retours d’exploitation. [S02](#source-s02)

Le client achète donc un résultat exploitable et une responsabilité industrielle. Pour LUMI-AI, l’objet du contrat annoncé par EuroHPC comprend explicitement l’acquisition, la livraison, l’installation et la maintenance. Cela relie la commande de matériel à un engagement de fonctionnement dans la durée. [S06](#source-s06)

## Trois configurations révèlent la chaîne de dépendances

Le module accéléré de **JUPITER**, à Jülich, utilise des composants Nvidia GH200 et un réseau Quantum-2 InfiniBand. Le système a été fourni par un consortium ParTec–Eviden, nom sous lequel l’activité Bull était alors présentée. Cette combinaison associe une intégration européenne à des technologies Nvidia. [S09](#source-s09)

La configuration annoncée pour **Alice Recoque** assemble des CPU et GPU AMD, une partition de calcul fondée sur le Rhea2 de SiPearl et le réseau BXI v3. Le CEA indique que l’installation est en cours et prévoit la disponibilité pour les utilisateurs en 2027. [S18](#source-s18) Celle de **LUMI-AI** prévoit également des processeurs AMD, une architecture BullSequana XH3500, du stockage IBM et une contribution réseau de Nokia aux côtés de BXI. Ce sont des configurations de projet, à distinguer d’un inventaire de systèmes entièrement réceptionnés. [S08](#source-s08) [S14](#source-s14)

Ces choix montrent une capacité à combiner plusieurs écosystèmes. Ils laissent aussi des dépendances précises : disponibilité des puces, mémoire associée, outils logiciels, pièces de remplacement. Changer de fournisseur peut demander de revoir les cartes, le réseau ou le code des applications. La modularité élargit les options ; le coût et le délai d’une migration dépendent du travail nécessaire pour valider la nouvelle combinaison. Cette conséquence technique est une interprétation des architectures décrites ; aucun chantier de migration n’est chiffré ici.

Le cas **Rhea1** donne un repère particulièrement récent. Le **22 septembre 2026**, SiPearl et Bull annoncent la livraison des premiers échantillons et le début de leur intégration dans la plateforme destinée au module CPU de JUPITER. Les performances doivent encore être consolidées. Le communiqué documente cette étape d’intégration, tandis que la commercialisation est annoncée pour la fin de 2026. [S10](#source-s10)

Dans son communiqué du 8 juillet 2025, SiPearl indique que Rhea1 est conçu autour de cœurs Arm et confie sa fabrication à **TSMC**. Une conception européenne conserve donc un lien avec une fonderie extérieure. Cette observation porte sur Rhea1 ; nous ne l’étendons pas automatiquement à la fabrication de Rhea2. Le lieu de conception, le détenteur des technologies et le lieu de fabrication constituent trois informations distinctes. [S11](#source-s11)

## Le partenariat avec Foxconn répartit le travail

Le **17 juin 2026**, Bull et Foxconn ont précisé l’organisation prévue autour de la plateforme Nvidia Vera Rubin NVL72 : fabrication et premiers tests dans les installations tchèques de Foxconn, puis assemblage, intégration et validation complète à Angers. Bull annonce également sa contribution logicielle. Le document décrit une organisation industrielle ; il ne publie aucune série de livraisons réalisées. [S05](#source-s05)

Cette répartition peut apporter de l’échelle et une capacité d’approvisionnement tout en maintenant une partie de la validation au plus près du constructeur. Elle ajoute aussi une interface entre partenaires : il faut organiser la traçabilité, les critères de réception, les retours et les délais. L’intérêt économique du montage dépendra de leur exécution.

Une machine assemblée dans l’Union peut ainsi incorporer une plateforme conçue ailleurs. Le recours à cette plateforme peut laisser à l’intégrateur une maîtrise importante du système, du déploiement et du support. La question utile est de savoir qui peut modifier quoi, avec quelles compétences et dans quel délai. Les communiqués disponibles décrivent des rôles ; ils ne donnent pas la nomenclature complète des composants ni les droits détaillés de chaque partenaire.

## Doubler l’atelier déplace la contrainte

Une capacité industrielle est une possibilité de produire. Son utilisation dépend de la demande, des approvisionnements et de la vitesse des essais. Un doublement de l’assemblage peut réduire une file d’attente, mais son effet sur les livraisons dépend du reste de la chaîne.

Prenons une ligne **entièrement hypothétique**, dont les trois étapes peuvent chacune traiter 100 unités équivalentes. Agrandir l’assemblage et les essais à 200 laisse le débit à 100 si les composants n’arrivent qu’au rythme de 100. Avec 200 de capacité à l’amont et à l’assemblage, mais 140 aux essais, le débit devient 140. Lorsque toutes les étapes atteignent 200, la capacité de sortie double à son tour.

<figure class="infographic l0g-bull-figure" style="max-width:28rem;margin:2rem auto;padding-bottom:1.25rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 430" role="img" aria-labelledby="bull-fr-throughput-title bull-fr-throughput-desc" style="width:100%;height:auto">
<title id="bull-fr-throughput-title">Le débit suit le goulot</title>
<desc id="bull-fr-throughput-desc">Modèle fictif : sorties 100, 100, 140 et 200, minimum des capacités des trois étapes.</desc>
<rect width="480" height="430" rx="12" fill="var(--color-surface)" />
<text x="24" y="40" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="var(--color-paper)" font-weight="700" text-anchor="start">Le débit suit le goulot</text>
<text x="24" y="74" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-muted)" font-weight="400" text-anchor="start">Modèle fictif · indice, base 100</text>
<text x="24" y="116" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-paper)" font-weight="400" text-anchor="start">Référence</text>
<text x="456" y="116" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-paper)" font-weight="700" text-anchor="end">100</text>
<rect data-value="100" x="24" y="128" width="200.00000000" height="18" fill="var(--color-signal)" />
<text x="24" y="182" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-paper)" font-weight="400" text-anchor="start">Amont limité</text>
<text x="456" y="182" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-paper)" font-weight="700" text-anchor="end">100</text>
<rect data-value="100" x="24" y="194" width="200.00000000" height="18" fill="var(--color-signal)" />
<text x="24" y="248" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-paper)" font-weight="400" text-anchor="start">Essais limités</text>
<text x="456" y="248" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-paper)" font-weight="700" text-anchor="end">140</text>
<rect data-value="140" x="24" y="260" width="280.00000000" height="18" fill="var(--color-signal)" />
<text x="24" y="314" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-paper)" font-weight="400" text-anchor="start">Chaîne équilibrée</text>
<text x="456" y="314" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-paper)" font-weight="700" text-anchor="end">200</text>
<rect data-value="200" x="24" y="326" width="400.00000000" height="18" fill="var(--color-signal)" />
<text x="24" y="374" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-muted)" font-weight="400" text-anchor="start">0</text>
<text x="224" y="374" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-muted)" font-weight="400" text-anchor="middle">100</text>
<text x="424" y="374" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-muted)" font-weight="400" text-anchor="end">200</text>
<text x="24" y="412" font-family="Arial, Helvetica, sans-serif" font-size="18" fill="var(--color-paper)" font-weight="700" text-anchor="start">Sortie = minimum des 3 étapes</text>
</svg>
<figcaption>Calcul l0g, <a href="/data/bull-angers-throughput-model.csv">capacités par étape</a>. Unités équivalentes, indice sans dimension. Dans l’ordre composants / assemblage / essais : 100/100/100 ; 100/200/200 ; 200/200/140 ; 200/200/200. Régime stationnaire, demande suffisante, rendements identiques, sans retouches ni stocks tampons. Exemple fictif, aucune cadence observée chez Bull.</figcaption>
</figure>

Ce modèle suppose des systèmes homogènes, une demande suffisante, des rendements constants et l’absence de retouches. Il sert à localiser le goulot d’étranglement. Les supercalculateurs réels diffèrent par leur densité, leur refroidissement et leur complexité : compter les armoires produites donne une information industrielle, mais la conversion en puissance utile demande de connaître leur contenu.

Le même raisonnement vaut pour la réception. Une livraison peut attendre un bâtiment prêt, une alimentation électrique, des essais d’ensemble ou la validation d’une configuration. Augmenter la capacité d’Angers peut résoudre un obstacle identifié tout en faisant apparaître le suivant. L’indicateur décisif devient le délai entre la disponibilité des composants et l’acceptation du système par le client.

## Des montants, des périmètres différents

L’actualité de Bull rapproche des sommes dont les périmètres diffèrent. **404 millions d’euros** désignent la valeur d’entreprise maximale de la cession par Atos, avec **104 millions de compléments de prix conditionnels**. Le montant fixe implicite de cette valorisation est donc de 300 millions. Il ne correspond pas, à lui seul, au cash injecté dans Bull ni au prix net payé pour les titres après les ajustements de transaction. [S03](#source-s03)

L’investissement industriel cité à Angers concerne l’outil de production. Les **387,8 millions d’euros** de LUMI-AI couvrent, eux, un contrat d’équipement et de services. EuroHPC et le consortium hébergeur en financent chacun la moitié, soit **193,9 millions** par bloc de financement. La disponibilité du système est prévue en 2027, le consortium précisant le second semestre. [S01](#source-s01) [S06](#source-s06) [S07](#source-s07)

Le projet Alice Recoque ajoute un autre périmètre : le CEA annonce un investissement total de **554 millions d’euros pour le projet, sur cinq années d’exploitation**. EuroHPC précise séparément un budget de **354,8 millions d’euros pour l’acquisition, la livraison, l’installation et la maintenance**. Les deux montants couvrent des périmètres différents ; leur écart ne fournit pas une ventilation détaillée des charges d’exploitation. [S17](#source-s17) Transformer cette enveloppe en chiffre d’affaires immédiat de Bull, ou l’additionner mécaniquement au montant finlandais, effacerait les différences entre projet, contrat et encaissement. [S08](#source-s08)

Ces distinctions changent l’analyse du rendement industriel. Une commande permet de remplir la production et de répartir les coûts fixes. Elle implique aussi l’achat de composants et l’exécution d’obligations de service. La part conservée par le constructeur dépend des prix d’achat, de son propre travail, des garanties et de la maintenance. Les sources publiques consultées ne publient pas cette décomposition ni la marge de Bull par système.

## La commande peut consommer du cash

Les décalages du cycle d’exploitation créent un [besoin en fonds de roulement, ou BFR](/glossaire/bfr/). Le financement peut donc être nécessaire avant le bénéfice éventuel. Pour l’illustrer, considérons un **contrat fictif de 100 millions d’euros** et 80 millions de décaissements directs. Le client verse 10 millions à la signature, alors que le constructeur en débourse 25. Puis 40 millions supplémentaires partent pendant l’assemblage. Le besoin cumulé atteint alors **55 millions d’euros**.

À la réception, le client paie 80 millions et le constructeur dépense encore 10 millions. Un dernier paiement de 10 millions, associé à 5 millions de coûts directs, laisse un solde positif de 20 millions. Ce solde reste à diminuer des frais généraux, de la R&D, du financement, des impôts et des autres éléments absents du modèle. Il ne mesure aucun résultat comptable de Bull.

<figure class="infographic l0g-bull-figure" style="max-width:28rem;margin:2rem auto;padding-bottom:1.25rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 440" role="img" aria-labelledby="bull-fr-cash-title bull-fr-cash-desc" style="width:100%;height:auto">
<title id="bull-fr-cash-title">La trésorerie avant le solde</title>
<desc id="bull-fr-cash-desc">Modèle fictif, trésorerie cumulée en millions d’euros : −15, −55, +15, +20.</desc>
<rect width="480" height="440" rx="12" fill="var(--color-surface)" />
<text x="24" y="40" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="var(--color-paper)" font-weight="700" text-anchor="start">La trésorerie avant le solde</text>
<text x="24" y="74" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-muted)" font-weight="400" text-anchor="start">Modèle fictif · cumuls, M€</text>
<text x="24" y="116" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-paper)" font-weight="400" text-anchor="start">Signature · mois 0</text>
<text x="456" y="116" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-paper)" font-weight="700" text-anchor="end">−15</text>
<rect data-value="-15" x="226.50000000" y="128" width="37.50000000" height="18" fill="var(--color-accent)" />
<path d="M264 124 V150" fill="none" stroke="var(--color-line-strong)" />
<text x="24" y="182" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-paper)" font-weight="400" text-anchor="start">Assemblage · mois 4</text>
<text x="456" y="182" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-paper)" font-weight="700" text-anchor="end">−55</text>
<rect data-value="-55" x="126.50000000" y="194" width="137.50000000" height="18" fill="var(--color-accent)" />
<path d="M264 190 V216" fill="none" stroke="var(--color-line-strong)" />
<text x="24" y="248" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-paper)" font-weight="400" text-anchor="start">Réception · mois 8</text>
<text x="456" y="248" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-paper)" font-weight="700" text-anchor="end">+15</text>
<rect data-value="15" x="264.00000000" y="260" width="37.50000000" height="18" fill="var(--color-signal)" />
<path d="M264 256 V282" fill="none" stroke="var(--color-line-strong)" />
<text x="24" y="314" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-paper)" font-weight="400" text-anchor="start">Solde · mois 12</text>
<text x="456" y="314" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-paper)" font-weight="700" text-anchor="end">+20</text>
<rect data-value="20" x="264.00000000" y="326" width="50.00000000" height="18" fill="var(--color-signal)" />
<path d="M264 322 V348" fill="none" stroke="var(--color-line-strong)" />
<text x="114" y="374" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-muted)" font-weight="400" text-anchor="middle">−60</text>
<text x="264" y="374" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-muted)" font-weight="400" text-anchor="middle">0</text>
<text x="414" y="374" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-muted)" font-weight="400" text-anchor="middle">+60</text>
<text x="24" y="416" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-paper)" font-weight="700" text-anchor="start">Besoin maximal : 55 M€</text>
</svg>
<figcaption>Calcul l0g, <a href="/data/bull-angers-cash-model.csv">échéancier complet</a>. Contrat fictif : 100 M€ encaissés et 80 M€ de sorties directes. Échelle commune, zéro au centre ; chaque barre représente le cumul au jalon. Les entrées et sorties du même jalon sont compensées, sans ordre intrajournalier. Le solde de 20 M€ précède frais généraux, R&D, financement, impôts et autres coûts omis ; aucun résultat de Bull n’est estimé.</figcaption>
</figure>

Une acceptation repoussée peut prolonger le crédit nécessaire. Dans une sensibilité séparée, porter **55 millions pendant 90 jours supplémentaires à 6 % l’an** coûte environ **814 000 euros**, en intérêts simples sur une base de 365 jours. Ce montant est calculé, sans hypothèse sur la probabilité d’un retard.

L’exemple éclaire la valeur des essais et de l’intégration : résoudre un problème avant expédition peut éviter un blocage plus coûteux chez le client. Le calendrier des acomptes, les conditions d’acceptation et le paiement des fournisseurs peuvent peser autant que le volume annoncé de commandes. Les contrats détaillés permettant de chiffrer ces effets chez Bull restent hors du périmètre public vérifié ici.

## L’eau chaude entre dans le coût du calcul

Le refroidissement représente une autre compétence commercialisable. Bull décrit pour LUMI-AI un système de refroidissement liquide utilisant de l’eau chaude, avec un projet de valorisation de la chaleur dans le réseau urbain de Kajaani. Cela constitue une caractéristique et un objectif du projet, dont les résultats devront être mesurés en exploitation. [S14](#source-s14)

Pour comprendre l’enjeu, il faut regarder le [**PUE**](/glossaire/pue/), le rapport entre l’énergie totale du centre de données et celle de ses équipements informatiques. Un PUE de 1,30 signifie que chaque unité consommée par l’IT s’accompagne de 0,30 unité pour les infrastructures du site : refroidissement, distribution électrique et autres auxiliaires. Le périmètre dépasse donc le seul circuit d’eau. [S15](#source-s15)

<figure class="infographic l0g-bull-figure" style="max-width:28rem;margin:2rem auto;padding-bottom:1.25rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 400" role="img" aria-labelledby="bull-fr-energy-title bull-fr-energy-desc" style="width:100%;height:auto">
<title id="bull-fr-energy-title">Le coût des auxiliaires</title>
<desc id="bull-fr-energy-desc">Modèle fictif annuel : même charge informatique 10 MW, PUE 1,30 puis 1,10, tarif 120 €/MWh.</desc>
<rect width="480" height="400" rx="12" fill="var(--color-surface)" />
<text x="24" y="40" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="var(--color-paper)" font-weight="700" text-anchor="start">Le coût des auxiliaires</text>
<text x="24" y="74" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-muted)" font-weight="400" text-anchor="start">Modèle fictif · énergie, GWh/an</text>
<text x="24" y="110" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-signal)" font-weight="700" text-anchor="start">IT</text>
<text x="104" y="110" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-amber)" font-weight="700" text-anchor="start">Auxiliaires</text>
<text x="24" y="152" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-paper)" font-weight="400" text-anchor="start">PUE 1,3</text>
<text x="456" y="152" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-paper)" font-weight="700" text-anchor="end">113,88</text>
<rect data-value="87.6" x="24" y="164" width="292.00000000" height="18" fill="var(--color-signal)" />
<rect data-value="26.28" x="316.00000000" y="164" width="87.60000000" height="18" fill="var(--color-amber)" />
<text x="24" y="232" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-paper)" font-weight="400" text-anchor="start">PUE 1,1</text>
<text x="456" y="232" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-paper)" font-weight="700" text-anchor="end">96,36</text>
<rect data-value="87.6" x="24" y="244" width="292.00000000" height="18" fill="var(--color-signal)" />
<rect data-value="8.76" x="316.00000000" y="244" width="29.20000000" height="18" fill="var(--color-amber)" />
<text x="24" y="290" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-muted)" font-weight="400" text-anchor="start">0</text>
<text x="224" y="290" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-muted)" font-weight="400" text-anchor="middle">60</text>
<text x="424" y="290" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="var(--color-muted)" font-weight="400" text-anchor="end">120</text>
<text x="24" y="336" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="var(--color-paper)" font-weight="700" text-anchor="start">Écart : 2,10 M€/an</text>
<text x="24" y="376" font-family="Arial, Helvetica, sans-serif" font-size="18" fill="var(--color-muted)" font-weight="400" text-anchor="start">Charge IT et prix identiques</text>
</svg>
<figcaption>Calcul l0g, <a href="/data/bull-angers-energy-model.csv">hypothèses et résultats annuels</a>. Charge IT moyenne 10 MW × 8 760 h = 87,6 GWh ; énergie du site = énergie IT × PUE. Tarif fictif de 120 €/MWh identique ; réduction de 17,52 GWh, soit 2 102 400 € par an. Définition du PUE : <a href="#source-s15">DOE/FEMP</a>. Aucune consommation observée chez Bull ou LUMI-AI ; aucune recette de récupération de chaleur.</figcaption>
</figure>

Dans cet exemple énergétique, une charge IT moyenne de **10 MW** fonctionne sur une année de 8 760 heures. À **120 euros le MWh**, passer d’un PUE de **1,30 à 1,10**, à charge identique, réduit la facture annuelle de **13,67 à 11,56 millions d’euros**. L’écart atteint **2,10 millions**, soit environ **15,4 %** de l’énergie totale initiale. Ce sont des hypothèses pédagogiques, sans lien avec les consommations publiées d’Angers ou de LUMI-AI.

La récupération de chaleur demande son propre calcul : température disponible, distance au réseau, demande selon la saison, équipements et coûts de raccordement. Le modèle n’attribue aucune recette à cette chaleur. De même, un meilleur PUE renseigne sur les infrastructures qui servent l’IT ; l’efficacité des algorithmes et l’utilisation réelle des machines déterminent encore le coût d’un résultat utile.

## La maîtrise se mesure aussi après la livraison

Un centre peut disposer de machines puissantes et devoir encore adapter ses applications. Les logiciels de gestion, les bibliothèques et l’accompagnement des utilisateurs font partie de l’offre décrite par Bull. Les compétences nécessaires pour compiler, répartir et vérifier les calculs prolongent le travail industriel au-delà de l’assemblage. [S12](#source-s12)

Le marché européen conserve par ailleurs d’autres fournisseurs : EuroHPC a attribué HammerHAI à **HPE** en mars 2026. Cette présence permet d’examiner concrètement les alternatives disponibles. Les performances doivent être comparées pour une même tâche, un même niveau de précision et un périmètre énergétique identique. Un chiffre de calcul scientifique en double précision et une capacité IA en précision réduite décrivent des opérations différentes. [S16](#source-s16) [S09](#source-s09)

Pour évaluer la portée de l’expansion d’Angers, il reste donc à suivre les réceptions effectives, les délais de réparation, les coûts d’exploitation et la capacité à changer de composants ou de logiciels. Une nomenclature documentée permettrait aussi de mesurer la valeur ajoutée conservée localement. Reuters rapporte par ailleurs une proportion de 70 % de composants fabriqués en Europe, déclarée par les dirigeants de Bull. Le reportage ne précise ni son dénominateur ni sa méthode ; ce chiffre ne permet pas de calculer la part de valeur ajoutée conservée localement. [S01](#source-s01)

Les documents décrivent une base industrielle concrète : Bull conserve une activité de conception de systèmes, d’intégration, de réseau, de refroidissement et de support. L’usine agrandie doit lui permettre de déployer ces compétences à une autre échelle. Leur valeur se vérifiera dans des machines acceptées, maintenues et utilisées, avec une traçabilité claire des dépendances qui les font fonctionner.

## Pour prolonger

- [L’IA chinoise à l’épreuve de l’usine](/posts/ia-ralentissement-4-chine-puces-memoire-usines/) suit les dépendances entre puces, mémoire et capacités industrielles.
- [Quand le crédit commence à trier l’IA](/posts/quand-le-credit-commence-a-trier-l-ia/) relie machines, engagements et conditions de financement.
- [Chaleur industrielle : la prime et la sixième année](/posts/chaleur-industrielle-if26-prime-carbone-sixieme-annee/) détaille le coût d’une conversion énergétique.

## Sources

<ol class="l0g-bull-sources">
<li id="source-s01"><a href="https://www.reuters.com/world/europe/french-supercomputer-maker-bull-doubles-output-boost-europes-ai-ambitions-2026-10-01/">Reuters : French supercomputer maker Bull doubles output to boost Europe’s AI ambitions</a>. 2026-10-01 ; Reuters, déclarations de dirigeants, dépêche consultée via la <a href="https://www.investing.com/news/economy-news/exclusivefrench-supercomputer-maker-bull-doubles-output-to-boost-europes-ai-ambitions-4928583">republication sous licence d’Investing.com</a>.</li>
<li id="source-s02"><a href="https://www.bull.com/fr/about/notre-usine-du-futur">Bull : L’usine du futur de Bull et les sites industriels</a>. Page non datée, consultée le 2 octobre 2026.</li>
<li id="source-s03"><a href="https://www.atosgroup.com/en/press/atos-group-completes-sale-bull-its-advanced-computing-activities-french-state">Atos Group : Atos Group completes the sale of Bull, its Advanced Computing activities, to the French State</a>. 2026-03-31.</li>
<li id="source-s04"><a href="https://presse.economie.gouv.fr/letat-finalise-lacquisition-de-bull-et-positionne-la-france-a-la-pointe-du-calcul-haute-performance-et-de-lia/">Ministère français de l’Économie : L’État finalise l’acquisition de Bull</a>. 2026-03-31.</li>
<li id="source-s05"><a href="https://www.bull.com/en/press-releases/bull-foxconn-advance-european-ai-infrastructure-with-nvidia-vera-rubin-nvl72">Bull et Foxconn : Bull and Foxconn advance European AI infrastructure with NVIDIA Vera Rubin NVL72 platform built in Europe</a>. 2026-06-17.</li>
<li id="source-s06"><a href="https://www.eurohpc-ju.europa.eu/eurohpc-ju-signs-contract-deploy-lumi-ai-supercomputer-2026-08-31_en">EuroHPC JU : EuroHPC JU Signs Contract to Deploy the LUMI-AI Supercomputer</a>. 2026-08-31.</li>
<li id="source-s07"><a href="https://lumi-supercomputer.eu/bull-to-deliver-lumi-ai-supercomputer/">LUMI / CSC : Bull selected to deliver LUMI-AI supercomputer, powering next-generation AI workloads and beyond</a>. 2026-08-31.</li>
<li id="source-s08"><a href="https://www.cea.fr/english/Pages/News/eviden-deliver-alice-recoque-new-european-exascale-supercomputer.aspx">CEA : EuroHPC JU and the Jules Verne consortium selected Eviden to deliver Alice Recoque</a>. 2025-11-18.</li>
<li id="source-s09"><a href="https://www.fz-juelich.de/en/jupiter">Forschungszentrum Jülich : JUPITER – The New Dimension of Computing</a>. Page non datée, consultée le 2 octobre 2026.</li>
<li id="source-s10"><a href="https://www.bull.com/en/press-releases/sipearl-delivers-the-first-rhea1-cpus-to-bull-for-integration-into-jupiter-europes-fastest-operating-supercomputer">Bull et SiPearl : SiPearl delivers the first Rhea1 CPUs to Bull for integration into JUPITER</a>. 2026-09-22.</li>
<li id="source-s11"><a href="https://sipearl.com/wp-content/uploads/2025/07/English_version.pdf">SiPearl : SiPearl: Rhea1 production milestone</a>. 2025-07-08 ; fabrication Rhea1 uniquement, calendrier ancien remplacé par la source S10.</li>
<li id="source-s12"><a href="https://www.bull.com/en/products/hpc/bullsequana-xh3500-supercomputer">Bull : BullSequana XH3500 supercomputer</a>. Page non datée, consultée le 2 octobre 2026.</li>
<li id="source-s13"><a href="https://www.bull.com/en/products/hpc/bullsequana-exascale-interconnect">Bull : BullSequana eXascale Interconnect</a>. Page non datée, consultée le 2 octobre 2026.</li>
<li id="source-s14"><a href="https://www.bull.com/en/press-releases/bull-to-deliver-europe-387.8-million-lumi-ai-supercomputer-finland">Bull : Bull selected to deliver Europe’s €387.8 million LUMI-AI supercomputer in Finland</a>. 2026-08-31.</li>
<li id="source-s15"><a href="https://www.energy.gov/cmei/femp/cooling-water-efficiency-opportunities-federal-data-centers">U.S. Department of Energy / FEMP : Cooling Water Efficiency Opportunities for Federal Data Centers</a>. Page non datée, consultée le 2 octobre 2026 ; définition du PUE uniquement.</li>
<li id="source-s16"><a href="https://www.eurohpc-ju.europa.eu/eurohpc-ju-signs-contract-deploy-ai-supercomputer-hammerhai-2026-03-16_en">EuroHPC JU : EuroHPC JU Signs Contract to Deploy AI Supercomputer HammerHAI</a>. 2026-03-16.</li>
<li id="source-s17"><a href="https://www.eurohpc-ju.europa.eu/contract-signed-alice-recoque-europes-new-exascale-supercomputer-2025-11-18_en">EuroHPC JU : Contract Signed for Alice Recoque, Europe’s New Exascale Supercomputer</a>. 2025-11-18.</li>
<li id="source-s18"><a href="https://www-ccrt.cea.fr/fr/AliceRecoque.html">CEA / TGCC : Alice Recoque</a>. Page non datée, consultée le 2 octobre 2026.</li>
<li id="source-s19"><a href="https://presse.economie.gouv.fr/nar-deplacement-de-roland-lescure-et-anne-le-henanff-a-angers-vendredi-2-octobre-2026/">Ministère de l’Économie : Déplacement à Angers le vendredi 2 octobre 2026</a>. 2026-09-30.</li>
</ol>

## Périmètre et méthode

Les sources d’entreprise documentent leurs propres produits et annonces ; les budgets et contrats sont recoupés avec leurs acheteurs ou opérateurs. La proportion de composants déclarée à Reuters ne fournit pas une mesure de valeur ajoutée. Les configurations futures, objectifs de disponibilité et performances encore à consolider restent attribués aux annonces. Les trois figures sont des modèles l0g entièrement fictifs, sans mesure de production, de trésorerie ou de consommation chez Bull.

Le débit vaut le minimum des trois capacités. Les flux de trésorerie valent encaissements moins sorties directes ; les cumuls additionnent ces flux. La sensibilité de retard vaut 55 000 000 × 0,06 × 90 / 365 = 813 698,63 €. Elle suppose un financement en intérêts simples et ne prévoit aucun retard réel. L’énergie annuelle vaut 10 × 8 760 × PUE en MWh ; son coût est multiplié par 120 €/MWh. La réduction relative de 15,4 % utilise l’énergie totale initiale comme dénominateur. Les CSV liés précisent les entrées et les résultats. Les exemples excluent effets de stocks tampons, probabilités, fiscalité, tarification variable et revenus de chaleur récupérée.
