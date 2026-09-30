---
title: "Les fournisseurs invisibles du risque bancaire européen"
seoTitle: "Banques européennes : la dépendance aux fournisseurs | l0g"
description: "Cloud, paiements, sous-traitance : les dépendances communes des banques européennes. Chiffres de la BCE, surveillance DORA et limites des plans de reprise."
ogImage: "/illustrations/news/european-bank-suppliers-2026-v1.jpg"
pubDate: 2026-09-30T14:14:31+02:00
updatedDate: 2026-09-30T14:14:31+02:00
tags: ["Banques", "Europe", "DORA", "Cloud", "Risque opérationnel"]
draft: false
quickTake: {"fact": "Selon la BCE, les dépenses cloud passent d’environ 4 % du budget informatique des banques en 2021 à 17 % en 2025.", "importance": "Un fournisseur commun peut perturber plusieurs banques à la fois. DORA ajoute une surveillance européenne des prestataires critiques.", "uncertainty": "L’échantillon des chiffres cloud n’est pas détaillé dans le discours. Les sources ne chiffrent pas les pertes d’une panne généralisée."}
---

Un client choisit sa banque. Il connaît rarement les entreprises qui hébergent ses services, transportent ses données ou fournissent leurs logiciels. Or plusieurs établissements peuvent partager une même infrastructure. Cette dépendance commune crée une voie de propagation des incidents, même lorsque leurs bilans et leurs équipes sont distincts.

Dans leur [rapport du 23 septembre 2026](https://www.esma.europa.eu/sites/default/files/2026-09/JC_2026_29_JC_update_on_risks_and_vulnerabilities_autumn_2026.pdf), l’Autorité bancaire européenne, l’autorité des assurances EIOPA et celle des marchés ESMA placent les dépendances externes parmi les vulnérabilités à surveiller. Elles décrivent aussi un système financier européen **qui reste résilient**. Leur alerte invite à regarder les infrastructures sur lesquelles repose l’activité, sans annoncer une faillite imminente des banques.

## Un budget cloud qui prend de la place

Le chiffre le plus parlant vient de la BCE. Dans une [intervention du 24 mars 2026](https://www.bankingsupervision.europa.eu/press/interviews/date/2026/html/ssm.in260324_5~3d0837ff0e.en.html), Anneli Tuominen, membre de son conseil de surveillance prudentielle, indique que les dépenses liées aux services cloud sont passées d’environ **4 % du budget informatique des banques en 2021 à 17 % en 2025**.

Le cloud désigne ici des ressources informatiques fournies à distance : calcul, stockage ou logiciels. La BCE présente la hausse de cette part comme un indicateur de la dépendance croissante envers un petit nombre de fournisseurs. Son [guide de juillet 2025](https://www.bankingsupervision.europa.eu/ecb/pub/pdf/ssm.supervisory_guides202507.en.pdf) souligne également les bénéfices possibles : capacité adaptable, technologies de sécurité et solutions de sauvegarde.

L’indicateur porte sur une **répartition des dépenses**. Il ne mesure pas le nombre de banques clientes d’un fournisseur, son poids dans les paiements ou la part des opérations externalisées. Le discours ne fournit pas l’échantillon et la méthode nécessaires pour reconstruire une série statistique détaillée.

<figure class="infographic l0g-bank-suppliers-figure" style="max-width:28rem;margin:2rem auto;padding-bottom:1rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 430" role="img" aria-labelledby="bank-suppliers-fr-1-title bank-suppliers-fr-1-desc" style="width:100%;height:auto" font-family="Arial, Helvetica, sans-serif">
<title id="bank-suppliers-fr-1-title">Le cloud dans le budget IT</title>
<desc id="bank-suppliers-fr-1-desc">Dépenses cloud dans le budget informatique des banques, selon la BCE : environ 4 % en 2021 et 17 % en 2025. Barres sur une même échelle de 0 à 20 %.</desc>
<rect x="0" y="0" width="480" height="430" rx="16" fill="var(--color-surface)"/>
<text x="24" y="45" font-size="25" fill="var(--color-paper)" text-anchor="start" font-weight="700">Le cloud dans le budget IT</text><text x="24" y="80" font-size="20" fill="var(--color-paper)" text-anchor="start" font-weight="400">Part des dépenses cloud, en %</text><text x="42" y="138" font-size="23" fill="var(--color-paper)" text-anchor="start" font-weight="700">2021</text><text x="432" y="138" font-size="25" fill="var(--color-signal)" text-anchor="end" font-weight="700">≈ 4 %</text><rect x="42" y="156" width="72.0" height="30" rx="3" fill="var(--color-signal)"/><text x="42" y="243" font-size="23" fill="var(--color-paper)" text-anchor="start" font-weight="700">2025</text><text x="432" y="243" font-size="25" fill="var(--color-signal)" text-anchor="end" font-weight="700">17 %</text><rect x="42" y="261" width="306.0" height="30" rx="3" fill="var(--color-signal)"/><path d="M42 322 H402" fill="none" stroke="var(--color-line-strong)" stroke-width="2"/><text x="42" y="354" font-size="20" fill="var(--color-paper)" text-anchor="middle" font-weight="400">0</text><text x="132" y="354" font-size="20" fill="var(--color-paper)" text-anchor="middle" font-weight="400">5</text><text x="222" y="354" font-size="20" fill="var(--color-paper)" text-anchor="middle" font-weight="400">10</text><text x="312" y="354" font-size="20" fill="var(--color-paper)" text-anchor="middle" font-weight="400">15</text><text x="402" y="354" font-size="20" fill="var(--color-paper)" text-anchor="middle" font-weight="400">20</text><text x="24" y="400" font-size="20" fill="var(--color-paper)" text-anchor="start" font-weight="400">Indicateur de dépense bancaire</text>
</svg>
<figcaption>Source : <a href="#source-02">BCE, Anneli Tuominen, 24 mars 2026</a>. Part du budget informatique, selon les chiffres cités par la superviseure. Le discours ne précise pas l’échantillon ni une série annuelle complète. Cette mesure ne donne ni la part de marché des fournisseurs ni la proportion des opérations bancaires externalisées.</figcaption>
</figure>

## Une panne commune peut contourner la diversification

Prenons un scénario : des banques différentes utilisent un même prestataire pour une fonction indispensable. Une panne chez ce prestataire peut toucher plusieurs établissements simultanément. Leurs propres serveurs peuvent fonctionner et leurs capitaux rester solides, tout en laissant certains services indisponibles.

L’effet financier dépend ensuite de la fonction touchée. Une interruption brève d’un outil secondaire a une portée différente d’un service qui empêche le traitement d’opérations à échéance. Les moyens de secours, la durée de la panne et la possibilité de changer de fournisseur déterminent l’ampleur de la perturbation. Les [autorités européennes](https://www.esma.europa.eu/sites/default/files/2026-09/JC_2026_29_JC_update_on_risks_and_vulnerabilities_autumn_2026.pdf) signalent ce risque de concentration ; leur rapport ne chiffre pas les pertes d’une panne cloud généralisée.

<figure class="infographic l0g-bank-suppliers-figure" style="max-width:28rem;margin:2rem auto;padding-bottom:1rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 450" role="img" aria-labelledby="bank-suppliers-fr-2-title bank-suppliers-fr-2-desc" style="width:100%;height:auto" font-family="Arial, Helvetica, sans-serif">
<title id="bank-suppliers-fr-2-title">Une dépendance commune</title>
<desc id="bank-suppliers-fr-2-desc">Scénario illustratif : un fournisseur commun indisponible peut perturber le service de trois banques fictives A, B et C. Les branches représentent une dépendance technique, sans montant ni probabilité.</desc>
<rect x="0" y="0" width="480" height="450" rx="16" fill="var(--color-surface)"/>
<text x="24" y="44" font-size="25" fill="var(--color-paper)" text-anchor="start" font-weight="700">Une dépendance commune</text><text x="24" y="76" font-size="20" fill="var(--color-paper)" text-anchor="start" font-weight="400">Scénario de panne partagée</text><g><rect x="86" y="104" width="308" height="80" rx="12" fill="var(--color-surface)" stroke="var(--color-line-strong)"/><text x="240.0" y="138" font-size="23" fill="var(--color-signal)" text-anchor="middle" font-weight="700">Fournisseur commun</text><text x="240.0" y="167" font-size="20" fill="var(--color-paper)" text-anchor="middle" font-weight="400">Service indisponible</text></g><path d="M240 184 V222 M90 256 V222 H390 V256 M240 222 V256 M84 249 L90 256 L96 249 M234 249 L240 256 L246 249 M384 249 L390 256 L396 249" fill="none" stroke="var(--color-accent)" stroke-width="3" stroke-linejoin="round"/><g><rect x="28" y="268" width="124" height="64" rx="12" fill="var(--color-surface)" stroke="var(--color-line-strong)"/><text x="90.0" y="307" font-size="21" fill="var(--color-paper)" text-anchor="middle" font-weight="700">Banque A</text></g><g><rect x="178" y="268" width="124" height="64" rx="12" fill="var(--color-surface)" stroke="var(--color-line-strong)"/><text x="240.0" y="307" font-size="21" fill="var(--color-paper)" text-anchor="middle" font-weight="700">Banque B</text></g><g><rect x="328" y="268" width="124" height="64" rx="12" fill="var(--color-surface)" stroke="var(--color-line-strong)"/><text x="390.0" y="307" font-size="21" fill="var(--color-paper)" text-anchor="middle" font-weight="700">Banque C</text></g><text x="240" y="371" font-size="22" fill="var(--color-accent)" text-anchor="middle" font-weight="700">Même point de défaillance</text><text x="240" y="418" font-size="20" fill="var(--color-paper)" text-anchor="middle" font-weight="400">Reprise selon les solutions de secours</text>
</svg>
<figcaption>Schéma de mécanisme, sans données de fréquence ni montant de pertes. A, B et C sont fictives ; aucun lien commercial réel n’est attribué. Références : <a href="#source-01">autorités européennes, septembre 2026</a> et <a href="#source-03">guide cloud de la BCE</a>. La durée et l’étendue de la perturbation dépendent du service et des moyens de reprise.</figcaption>
</figure>

La diversification doit donc être examinée jusqu’aux couches techniques communes. Deux contrats distincts peuvent, dans un scénario de sous-traitance, aboutir au même hébergeur. De même, répartir des applications entre plusieurs implantations d’un fournisseur laisse subsister certaines dépendances à ce fournisseur. Il faut regarder la chaîne effective et les scénarios de panne couverts.

Ce mécanisme concerne aussi les services publics numériques. Notre [enquête sur les contrats de France Identité](/posts/votre-identite-dans-un-telephone-3-l-identite-souveraine-sous-contrat/) examine la capacité à reprendre un service lorsque sa réalisation est répartie entre des prestataires.

## Des dépendances techniques et financières différentes

Le [rapport des trois autorités](https://www.esma.europa.eu/sites/default/files/2026-09/JC_2026_29_JC_update_on_risks_and_vulnerabilities_autumn_2026.pdf) dépasse le cloud. Il recense les services informatiques hors de l’Espace économique européen, les solutions de paiement non européennes et les infrastructures qui interviennent dans la compensation, le repo ou la notation. L’[EEE comprend l’Union européenne, l’Islande, le Liechtenstein et la Norvège](https://www.efta.int/eea-relations-eu/eea-institutions-two-pillar-structure/eea-efta-states) ; « hors UE » et « hors EEE » ne désignent donc pas exactement le même périmètre.

La compensation organise le calcul et, selon l’infrastructure, la gestion des obligations entre contreparties. Un **[repo](/glossaire/repo/)** est une opération de financement contre titres, assortie d’un engagement de rachat. La notation évalue la qualité de crédit. Ces fonctions financières et un contrat d’hébergement informatique suivent des mécanismes et des cadres de supervision distincts. Notre [analyse du repo](/posts/repo-collateral-fabrique-liquidite/) explique son rôle dans l’accès à la liquidité.

Les autorités mentionnent aussi les besoins de financement bancaire en dollars, livres sterling et francs suisses. Ce risque concerne l’accès à une devise et son financement. Le placer sur la même carte de dépendances ne le transforme pas en panne informatique.

La localisation hors d’Europe ajoute une exposition à d’autres juridictions et aux événements géopolitiques, selon les autorités. Elle ne suffit pas à classer la robustesse de chaque contrat. La concentration, la criticité du service et sa remplaçabilité comptent aussi. Le rapport ne fournit pas une cartographie publique exhaustive reliant chaque banque à tous ses fournisseurs.

## DORA permet de suivre les fournisseurs communs

Le **[Digital Operational Resilience Act, ou DORA](/glossaire/dora/)** est le règlement européen sur la résilience opérationnelle numérique du secteur financier. Il [s’applique depuis le 17 janvier 2025](https://www.eba.europa.eu/activities/direct-supervision-and-oversight/digital-operational-resilience-act/preparation-dora-application). Il encadre notamment la gestion des risques informatiques, la déclaration des incidents majeurs, les tests et les relations avec les prestataires informatiques des entités concernées.

Le dispositif ajoute une surveillance européenne de certains fournisseurs critiques. Les registres d’information sur les contrats informatiques des entités financières alimentent le processus de désignation. Les autorités évaluent l’importance systémique du fournisseur, les fonctions qu’il soutient et la possibilité de remplacer ses services, comme le décrit leur [annonce du 18 novembre 2025](https://www.eba.europa.eu/publications-and-media/press-releases/european-supervisory-authorities-designate-critical-ict-third-party-providers-under-digital).

La [liste publiée à cette date](https://www.eba.europa.eu/sites/default/files/2025-11/e388451b-356b-408a-bbf2-b8e425865d75/List%20of%20designated%20CTPPs.pdf) comprend **19 prestataires**. On y trouve des entreprises européennes et non européennes, dans l’infrastructure, les logiciels et les services de données. Ce nombre porte sur les **[prestataires informatiques tiers critiques, ou CTPP](/glossaire/ctpp/)** désignés pour le secteur financier européen. Il ne compte ni les banques ni l’ensemble de leurs fournisseurs. La liste demeure celle proposée sur la page officielle de surveillance consultée pour cet article.

La BCE décrit le cadre comme pleinement opérationnel depuis janvier 2026. L’[accord signé avec les autorités britanniques le 14 janvier](https://www.eba.europa.eu/publications-and-media/press-releases/european-supervisory-authorities-and-uk-financial-regulators-sign-memorandum-understanding-oversight), dont la Banque d’Angleterre, la PRA et la FCA, organise la coopération, l’échange d’informations et la coordination de cette surveillance. L’équivalence évaluée concerne la confidentialité et le secret professionnel nécessaires aux échanges.

Cette surveillance complète la responsabilité des établissements pour leurs propres risques informatiques, comme le précise l’[EBA](https://www.eba.europa.eu/activities/direct-supervision-and-oversight/digital-operational-resilience-act/dora-oversight). La présence d’un fournisseur sur la liste ne garantit pas la disponibilité permanente de ses services.

## Une sortie doit pouvoir fonctionner

Le [guide cloud de la BCE](https://www.bankingsupervision.europa.eu/ecb/pub/pdf/ssm.supervisory_guides202507.en.pdf) distingue les exigences de DORA des bonnes pratiques qu’elle recommande. Il ne crée pas, à lui seul, de nouvelles obligations juridiquement contraignantes. Sa logique opérationnelle est précise : prévoir comment transférer ou réinternaliser un service critique, avec un calendrier, des ressources et des possibilités techniques crédibles.

Récupérer les données ne suffit pas toujours à redémarrer une application. Des technologies propriétaires, des interfaces ou des compétences particulières peuvent compliquer la migration. Le guide recommande d’estimer le temps de transition, d’identifier des prestataires de remplacement et de tester la faisabilité des plans de sortie. Il traite aussi la chaîne de sous-traitance.

Dans son [intervention de mars 2026](https://www.bankingsupervision.europa.eu/press/interviews/date/2026/html/ssm.in260324_5~3d0837ff0e.en.html), Anneli Tuominen observe que certaines banques restent en retard dans la renégociation de leurs contrats et l’adaptation de leurs dispositifs de continuité. Elle indique également que **38 % des incidents majeurs déclarés par les banques en 2025 avaient pour cause des changements informatiques**. Cette catégorie couvre les projets, migrations et mises à jour. Le chiffre ne répartit pas les incidents selon leur origine interne ou chez un fournisseur.

Il faut aussi respecter la rupture de périmètre : la BCE précise que DORA élargit la déclaration aux incidents informatiques majeurs, au-delà des seuls incidents cyber du cadre précédent. Comparer ces séries comme si elles mesuraient la même chose serait trompeur.

## Le chantier hors informatique reste ouvert

Une mise à jour récente complète le tableau. Le 18 septembre 2026, l’EBA a annoncé ses [lignes directrices finales sur les risques liés aux prestataires pour les services hors informatique](https://www.eba.europa.eu/sites/default/files/2026-09/dc9ccbb3-79b9-493d-b693-c21adeffbcc9/Final%20report%20on%20GL%20on%20third-party%20risk%20management.pdf). Elles cherchent à rapprocher la gestion de ces dépendances du cadre applicable aux services informatiques, avec une attention particulière aux fonctions critiques ou importantes.

Au 30 septembre, leur [page officielle](https://www.eba.europa.eu/activities/single-rulebook/regulatory-activities/internal-governance/guidelines-third-party-risk-management?version=2026) les classe comme **non encore applicables**, en attente de traduction. Le texte final laisse la date d’application à fixer et prévoit un délai de deux ans à compter de cette date pour la revue et la documentation des dispositifs critiques ou importants existants. Si la revue ou la documentation reste inachevée à cette échéance, le texte prévoit d’en informer le superviseur. Il serait donc prématuré d’annoncer une échéance calendaire ferme.

Pour évaluer une banque, la question utile devient très concrète : quel service peut s’arrêter, quelles autres institutions partagent sa dépendance et combien de temps faut-il pour reprendre l’activité ? Un ratio de capital décrit une capacité à absorber des pertes. La cartographie des fournisseurs et les tests de reprise éclairent la capacité à continuer de fonctionner. Les deux lectures se complètent.

## Sources et documents

<ol class="l0g-bank-suppliers-sources">
<li id="source-01"><a href="https://www.esma.europa.eu/sites/default/files/2026-09/JC_2026_29_JC_update_on_risks_and_vulnerabilities_autumn_2026.pdf">EBA, EIOPA et ESMA : mise à jour des risques, 23 septembre 2026, JC 2026 29</a></li>
<li id="source-02"><a href="https://www.bankingsupervision.europa.eu/press/interviews/date/2026/html/ssm.in260324_5~3d0837ff0e.en.html">BCE : Anneli Tuominen, 24 mars 2026, budget cloud et incidents informatiques</a></li>
<li id="source-03"><a href="https://www.bankingsupervision.europa.eu/ecb/pub/pdf/ssm.supervisory_guides202507.en.pdf">BCE : guide sur l’externalisation des services cloud, juillet 2025</a></li>
<li id="source-04"><a href="https://www.eba.europa.eu/publications-and-media/press-releases/european-supervisory-authorities-designate-critical-ict-third-party-providers-under-digital">Autorités européennes : désignation des prestataires critiques, 18 novembre 2025</a></li>
<li id="source-05"><a href="https://www.eba.europa.eu/sites/default/files/2025-11/e388451b-356b-408a-bbf2-b8e425865d75/List%20of%20designated%20CTPPs.pdf">Autorités européennes : liste des 19 prestataires désignés, novembre 2025</a></li>
<li id="source-06"><a href="https://www.eba.europa.eu/publications-and-media/press-releases/european-supervisory-authorities-and-uk-financial-regulators-sign-memorandum-understanding-oversight">Autorités européennes et régulateurs britanniques : accord de coopération, 14 janvier 2026</a></li>
<li id="source-07"><a href="https://www.eba.europa.eu/activities/direct-supervision-and-oversight/digital-operational-resilience-act/dora-oversight">EBA : surveillance des fournisseurs critiques sous DORA, page consultée le 30 septembre 2026</a></li>
<li id="source-08"><a href="https://www.eba.europa.eu/activities/direct-supervision-and-oversight/digital-operational-resilience-act/preparation-dora-application">EBA : application de DORA et registres d’information</a></li>
<li id="source-09"><a href="https://www.eba.europa.eu/sites/default/files/2026-09/dc9ccbb3-79b9-493d-b693-c21adeffbcc9/Final%20report%20on%20GL%20on%20third-party%20risk%20management.pdf">EBA/GL/2026/09 : texte final sur les risques liés aux services hors informatique, septembre 2026</a></li>
<li id="source-10"><a href="https://www.eba.europa.eu/activities/single-rulebook/regulatory-activities/internal-governance/guidelines-third-party-risk-management?version=2026">EBA : statut des lignes directrices, version 2026, consulté le 30 septembre 2026</a></li>
<li id="source-11"><a href="https://www.efta.int/eea-relations-eu/eea-institutions-two-pillar-structure/eea-efta-states">EFTA : périmètre de l’Espace économique européen</a></li>
</ol>

## Méthode et limites

Analyse arrêtée au 30 septembre 2026. Les données de budget cloud et d’incidents sont les chiffres attribués à la BCE dans l’intervention du 24 mars. Le rapport conjoint de septembre précise les dépendances sectorielles ; il ne fournit pas une cartographie exhaustive des fournisseurs par banque ni une estimation des pertes d’une panne généralisée.

La liste des prestataires critiques a été comptée dans le document officiel de novembre 2025 et recoupée avec la page de surveillance consultée le 30 septembre. Le statut des lignes directrices hors informatique et leur transition ont été contrôlés dans la page officielle et les paragraphes 18 à 20 du texte final. Leur date d’application n’est pas renseignée dans ces documents.

Le graphique de dépenses utilise une échelle commune de 0 à 20 %. Le réseau de dépendance illustre trois banques fictives ; il ne décrit aucun contrat identifié et ne comporte aucune probabilité. Les effets sur la continuité, la liquidité ou les pertes restent conditionnels à la fonction, à la durée et aux solutions de reprise. Aucun cours de marché, ratio de valorisation ou montant de pertes hypothétique n’est présenté comme une donnée observée.
