---
title: "L’IA chinoise à l’épreuve de l’usine"
seoTitle: "IA chinoise : puces, mémoire et concurrence | l0g"
description: "Huawei, CXMT, Loongson : des circuits gravés aux machines livrées, comment se construit la concurrence chinoise dans les puces et la mémoire pour l’IA."
pubDate: "2026-09-27T15:22:17+02:00"
tags: ["IA", "semi-conducteurs", "Chine", "mémoire", "industrie", "concurrence"]
draft: false
ogImage: "/illustrations/news/ia-chine-puces-usines-v1.jpg"
quickTake: {"fact": "Huawei présente Atlas 960E et CXMT annonce sa mémoire G5 en production. Le calendrier des systèmes, la mémoire mobile et la HBM correspondent à des étapes industrielles différentes.", "importance": "Une machine concurrente utilisable peut donner un choix au client avant l’autonomie complète de sa chaîne de fabrication. Son intérêt dépend du service livré et du coût total.", "uncertainty": "Les annonces sont attribuées aux fabricants. Volumes disponibles, rendements et coûts comparables restent à documenter. Les deux graphiques utilisent des exemples entièrement fictifs."}
---

<p class="edition-link"><a href="/publications/le-prix-du-ralentissement/">Lire les six volets dans le livre gratuit « Le prix du ralentissement » (EPUB).</a></p>

*Le prix du ralentissement · Volet 4*

Le 17 septembre 2026, Huawei présente Atlas 960E, une infrastructure conçue pour faire travailler des milliers de processeurs ensemble. Trois jours plus tard, CXMT annonce la production en série de sa nouvelle génération G5 de mémoire. Ces annonces concernent des étapes industrielles différentes : Huawei indique que son système Atlas 960 est encore en test ; les nouveaux produits LPDDR5X de CXMT visent les téléphones et les appareils portables. La mémoire à très forte bande passante, ou HBM, utilisée auprès des grands accélérateurs d’IA, relève d’une autre chaîne de fabrication. [CXMT](https://www.cxmt.com/en/news/info_22.html) · [Huawei](https://www.huawei.com/de/news/2026/atlas-960e-superpod-fuer-ki-modelle)

**La concurrence peut commencer bien avant l’autonomie industrielle complète.** Pour un client, l’enjeu est de trouver une autre infrastructure capable de rendre le service attendu, dans les quantités nécessaires, à un coût acceptable et avec une fiabilité suffisante. Après les [modèles chinois et leurs prix](/posts/ia-ralentissement-3-modeles-chinois-prix-concurrence/), ce quatrième volet descend dans les machines et les usines.

Restreindre l’accès à une machine peut retarder un programme de recherche. Cela peut également rendre l’investissement dans une machine concurrente plus intéressant. Le débat sur le ralentissement de l’IA doit intégrer ces effets possibles sur la production, les logiciels et les choix des acheteurs.

## Des poids du modèle aux machines

Les poids d’un modèle sont les valeurs numériques apprises pendant son entraînement. Les publier permet à d’autres de les récupérer. Cela ne livre ni les équipements qui les ont produits ni ceux qui les feront fonctionner. Le rapport de DeepSeek V3 en fournit un exemple historique précis : publié en décembre 2024, il décrit un entraînement sur **2 048 GPU NVIDIA H800**, des processeurs graphiques employés comme accélérateurs de calcul. L’origine chinoise du modèle ne dit donc pas, à elle seule, l’origine de son infrastructure. Ce document ne décrit pas les entraînements de septembre 2026. [Rapport DeepSeek V3, § 3.1](https://arxiv.org/html/2412.19437v1)

Il faut également séparer apprendre et répondre. L’entraînement ajuste les paramètres. L’inférence utilise le modèle pour traiter de nouvelles demandes. Dans le premier cas, la manière de répartir les calculs entre machines est décisive. Dans le second, le temps d’attente d’un client et le nombre de demandes traitées ensemble peuvent changer l’organisation rentable du service. Une infrastructure adaptée à l’un n’est pas automatiquement la meilleure pour l’autre. [DeepSeek V3](https://arxiv.org/html/2412.19437v1) · [CloudMatrix384](https://arxiv.org/html/2506.12708v1)

Suivons une demande sans lui inventer un centre de données particulier. Un processeur généraliste, le CPU, exécute notamment les programmes qui organisent le service. Des accélérateurs réalisent les calculs massivement parallèles. Les paramètres et les résultats intermédiaires doivent être conservés, lus et transportés. Lorsque le travail est partagé, les machines échangent aussi entre elles. Le système documenté par Huawei et SiliconFlow associe ainsi **384 accélérateurs Ascend 910C et 192 CPU Kunpeng** : l’IA n’a pas fait disparaître le reste de l’ordinateur. [Serving Large Language Models on Huawei CloudMatrix384](https://arxiv.org/html/2506.12708v1)

Une machine peut donc manquer de puissance de calcul, de place en mémoire ou de rapidité pour déplacer les données. Ces limites sont distinctes. Ajouter des unités de calcul ne sert pas beaucoup si elles attendent ce qu’elles doivent traiter. Les ingénieurs parlent de *bande passante* pour la quantité de données transportable par seconde. La capacité dit combien on peut stocker ; elle ne dit pas à quelle vitesse on peut le lire. [All About Rooflines](https://jax-ml.github.io/scaling-book/roofline/)

## Le processeur attend parfois sa mémoire

Un exemple fictif suffit à comprendre l’enjeu. Pour un même travail, supposons 20 millisecondes de calcul et 80 millisecondes de transfert. Dans un modèle idéal où les deux activités se recouvrent entièrement, la durée ne peut pas descendre sous la plus longue : 80 millisecondes. Doubler la puissance de calcul ramène sa contribution à 10 millisecondes, mais laisse ce plancher inchangé.

Doubler plutôt la bande passante réduit le transfert à 40 millisecondes. Le plancher devient alors 40 millisecondes. Dans une machine réelle, les dépendances entre opérations et les autres délais limitent ce recouvrement. L’exemple isole seulement pourquoi le composant le plus spectaculaire ne détermine pas toujours la vitesse obtenue.

<figure class="infographic" style="max-width:33rem;margin:2rem auto;padding-bottom:1rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 420" role="img" aria-labelledby="ai-chips-fr-bottleneck-title ai-chips-fr-bottleneck-desc" style="width:100%;height:auto" font-family="Arial, Helvetica, sans-serif">
<title id="ai-chips-fr-bottleneck-title">Calcul ou transfert ?</title>
<desc id="ai-chips-fr-bottleneck-desc">Exemple entièrement fictif. Même tâche, calcul et transfert entièrement simultanés. Base : calcul 20 ms, transfert 80 ms, plancher 80 ms. Calcul deux fois plus puissant : 10 ms et 80 ms, plancher 80 ms. Bande passante doublée : 20 ms et 40 ms, plancher 40 ms. Les six barres partent de zéro ; durée idéale = maximum des deux temps.</desc>
<rect x="0" y="0" width="500" height="420" rx="6" fill="var(--color-surface)"/>
<text x="24" y="34" font-size="24" font-weight="700" text-anchor="start" fill="var(--color-paper)">Calcul ou transfert ?</text>
<text x="24" y="60" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-muted)">Simulation · même tâche</text>
<rect x="24" y="74" width="16.000000" height="16" fill="var(--color-signal)"/>
<text x="48" y="89" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-paper)">Calcul</text>
<rect x="250" y="74" width="16.000000" height="16" fill="var(--color-accent)"/>
<text x="274" y="89" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-paper)">Transfert</text>
<text x="24" y="117" font-size="22" font-weight="700" text-anchor="start" fill="var(--color-paper)">Base</text>
<text x="476" y="117" font-size="20" font-weight="400" text-anchor="end" fill="var(--color-paper)">Plancher : 80 ms</text>
<rect x="24" y="131" width="80.000000" height="18" fill="var(--color-signal)"/>
<text x="114" y="147" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-paper)">20</text>
<rect x="24" y="159" width="320.000000" height="18" fill="var(--color-accent)"/>
<text x="354" y="175" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-paper)">80</text>
<text x="24" y="205" font-size="22" font-weight="700" text-anchor="start" fill="var(--color-paper)">Calcul ×2</text>
<text x="476" y="205" font-size="20" font-weight="400" text-anchor="end" fill="var(--color-paper)">Plancher : 80 ms</text>
<rect x="24" y="219" width="40.000000" height="18" fill="var(--color-signal)"/>
<text x="74" y="235" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-paper)">10</text>
<rect x="24" y="247" width="320.000000" height="18" fill="var(--color-accent)"/>
<text x="354" y="263" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-paper)">80</text>
<text x="24" y="293" font-size="22" font-weight="700" text-anchor="start" fill="var(--color-paper)">Bande passante ×2</text>
<text x="476" y="293" font-size="20" font-weight="400" text-anchor="end" fill="var(--color-paper)">Plancher : 40 ms</text>
<rect x="24" y="307" width="80.000000" height="18" fill="var(--color-signal)"/>
<text x="114" y="323" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-paper)">20</text>
<rect x="24" y="335" width="160.000000" height="18" fill="var(--color-accent)"/>
<text x="194" y="351" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-paper)">40</text>
<path d="M24 368H424 M24 364V372 M224 364V372 M424 364V372" fill="none" stroke="var(--color-muted)" stroke-width="2"/>
<text x="24" y="398" font-size="20" font-weight="400" text-anchor="middle" fill="var(--color-muted)">0</text>
<text x="224" y="398" font-size="20" font-weight="400" text-anchor="middle" fill="var(--color-muted)">50</text>
<text x="424" y="398" font-size="20" font-weight="400" text-anchor="middle" fill="var(--color-muted)">100</text>
<text x="300" y="398" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-muted)">ms</text>
</svg>
<figcaption>Simulation l0g, 27 septembre 2026. Durées pour une même tâche, en millisecondes. Recouvrement intégral et aucun autre délai : durée idéale = max(calcul, transfert), soit 80, 80 et 40 ms. Dans un système réel, les dépendances peuvent allonger ces durées. Principe : <a href="https://jax-ml.github.io/scaling-book/roofline/">All About Rooflines</a>. Aucun matériel réel n’est mesuré.</figcaption>
</figure>

Huawei annonce pour l’Atlas 960E jusqu’à 8 exaflops en FP8 et 16 en FP4. Un exaflop représente un milliard de milliards d’opérations en virgule flottante par seconde. FP8 et FP4 désignent des formats numériques de précision différente. Comparer les performances d’une application exige de conserver le même travail et une qualité de résultat comparable. Les chiffres de Huawei sont des caractéristiques annoncées par le constructeur. [Présentation technique de Huawei](https://www.huawei.com/en/news/2026/9/hc-ascend960-supernode)

Réduire la précision peut diminuer les besoins de mémoire. Il faut encore vérifier ce que cette transformation fait à la qualité des réponses et si les logiciels exploitent efficacement ce format. La documentation de Hugging Face décrit ces compromis de *quantification*, c’est-à-dire l’emploi de représentations numériques moins volumineuses. [Documentation Transformers](https://huggingface.co/docs/transformers/main/en/quantization/overview)

Pour un client, la performance utile consiste à obtenir une réponse suffisamment bonne dans un délai acceptable. Les tests MLPerf définissent des scénarios de débit, des contraintes de latence et des niveaux de qualité. Lorsqu’une mesure électrique accompagne le test, elle porte sur le système complet à la prise, pendant le travail défini. [Méthodologie MLCommons](https://mlcommons.org/benchmarks/inference-datacenter/) · [Règles MLPerf Inference](https://github.com/mlcommons/inference_policies/blob/master/inference_rules.adoc)

Cela change le bilan d’une solution de remplacement. Une carte moins performante peut être exploitable avec une organisation différente. Mais si cette organisation demande davantage de machines, son intérêt doit être vérifié avec le coût du réseau, de l’électricité et de l’installation. Inversement, une amélioration de circulation des données peut économiser des équipements sans changer de génération de processeur. Ce sont deux possibilités d’ingénierie, pas des résultats financiers déjà établis pour Huawei.

## Du circuit gravé à la puce utilisable

Le communiqué de CXMT contient une note décisive : le gain annoncé d’au moins **50 % de circuits bruts par tranche de silicium**, par rapport à la génération G4, est normalisé à une capacité de 8 gigabits. Ce décompte précède le tri des composants fonctionnels. Pour en déduire un coût de fabrication, il faudrait aussi connaître la proportion utilisable et les moyens engagés pour l’obtenir. [Communiqué G5, note méthodologique](https://www.cxmt.com/en/news/info_22.html)

Une tranche, ou *wafer*, porte de nombreux circuits qui seront séparés. Certains ne satisfont pas les exigences électriques. Le rendement de fabrication est la proportion utilisable, pas le rendement financier de l’usine. Pour comprendre la distinction, prenons deux procédés entièrement fictifs, avec des circuits de même capacité.

Le premier place 100 circuits sur une tranche ; 90 % sont utilisables, soit 90. Le second en place 150, mais seulement 60 % sont utilisables : toujours 90. Ces taux ne décrivent aucun fabricant. Ils montrent simplement ce qu’il manque entre le nombre brut et le nombre vendable.

<figure class="infographic" style="max-width:33rem;margin:2rem auto;padding-bottom:1rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 420" role="img" aria-labelledby="ai-chips-fr-yield-title ai-chips-fr-yield-desc" style="width:100%;height:auto" font-family="Arial, Helvetica, sans-serif">
<title id="ai-chips-fr-yield-title">Plus de circuits, même sortie</title>
<desc id="ai-chips-fr-yield-desc">Exemple entièrement fictif, circuits de même capacité. Procédé A : 100 circuits bruts par tranche, rendement 90 %, 90 utilisables et 10 rejetés. Procédé B : 150 circuits bruts, rendement 60 %, 90 utilisables et 60 rejetés. Deux barres empilées sur la même échelle de 0 à 150 circuits. Aucun rendement industriel réel n’est représenté.</desc>
<rect x="0" y="0" width="500" height="420" rx="6" fill="var(--color-surface)"/>
<text x="24" y="34" font-size="24" font-weight="700" text-anchor="start" fill="var(--color-paper)">Plus de circuits, même sortie</text>
<text x="24" y="68" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-muted)">Simulation · une tranche par procédé</text>
<rect x="24" y="88" width="16.000000" height="16" fill="var(--color-signal)"/>
<text x="48" y="103" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-paper)">Utilisables</text>
<rect x="250" y="88" width="16.000000" height="16" fill="var(--color-accent)"/>
<text x="274" y="103" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-paper)">Rejetés</text>
<text x="24" y="146" font-size="22" font-weight="700" text-anchor="start" fill="var(--color-paper)">Procédé A</text>
<text x="476" y="146" font-size="22" font-weight="400" text-anchor="end" fill="var(--color-paper)">Rendement : 90 %</text>
<rect x="24" y="163" width="234.000000" height="26" fill="var(--color-signal)"/>
<rect x="258.0" y="163" width="26.000000" height="26" fill="var(--color-accent)"/>
<text x="24" y="215" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-muted)">90 utilisables + 10 rejetés = 100</text>
<text x="24" y="248" font-size="22" font-weight="700" text-anchor="start" fill="var(--color-paper)">Procédé B</text>
<text x="476" y="248" font-size="22" font-weight="400" text-anchor="end" fill="var(--color-paper)">Rendement : 60 %</text>
<rect x="24" y="265" width="234.000000" height="26" fill="var(--color-signal)"/>
<rect x="258.0" y="265" width="156.000000" height="26" fill="var(--color-accent)"/>
<text x="24" y="317" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-muted)">90 utilisables + 60 rejetés = 150</text>
<path d="M24 352H414 M24 348V356 M154 348V356 M284 348V356 M414 348V356" fill="none" stroke="var(--color-muted)" stroke-width="2"/>
<text x="24.0" y="383" font-size="20" font-weight="400" text-anchor="middle" fill="var(--color-muted)">0</text>
<text x="154.0" y="383" font-size="20" font-weight="400" text-anchor="middle" fill="var(--color-muted)">50</text>
<text x="284.0" y="383" font-size="20" font-weight="400" text-anchor="middle" fill="var(--color-muted)">100</text>
<text x="414.0" y="383" font-size="20" font-weight="400" text-anchor="middle" fill="var(--color-muted)">150</text>
<text x="250" y="409" font-size="20" font-weight="400" text-anchor="middle" fill="var(--color-muted)">Circuits par tranche · capacité identique</text>
</svg>
<figcaption>Simulation l0g, hypothèses fixées le 27 septembre 2026. Nombre utilisable = nombre brut × rendement : 100 × 90 % = 150 × 60 % = 90. Aucune estimation du rendement de CXMT ou d’un autre fabricant. Le coût de fabrication n’est pas calculé. Le gain brut annoncé par CXMT est discuté séparément dans le texte et sa <a href="https://www.cxmt.com/en/news/info_22.html">note méthodologique</a>.</figcaption>
</figure>

Le succès industriel de la miniaturisation dépend aussi des défauts, du nombre d’étapes, du temps passé dans les machines et de la montée en cadence. Même à nombre de composants utilisables identique, deux procédés peuvent avoir des coûts très différents. Notre exemple se limite au nombre de circuits obtenus.

La HBM pose un autre problème. Cette forme de mémoire vive DRAM, à très forte bande passante, empile des puces et multiplie les connexions pour alimenter rapidement un accélérateur. Elle demande un assemblage précis, en plus de la fabrication des cellules de mémoire. Une avancée en mémoire mobile peut enrichir les compétences d’un industriel sans démontrer que cette autre chaîne est maîtrisée. [Présentation de la HBM par Micron](https://www.micron.com/products/memory/hbm)

Les travaux de l’imec sur l’assemblage montrent pourquoi les composants doivent être considérés ensemble : l’alignement, la qualité des surfaces et le choix de puces déjà testées influencent le résultat final. Un circuit fonctionnel, pris isolément, n’est pas encore un empilement fiable. Ce travail de recherche explique la difficulté ; il ne constitue pas une mesure du rendement des usines chinoises. [Recherche imec sur l’assemblage de puces](https://www.imec-int.com/en/press/imec-demonstrates-die-wafer-hybrid-bonding-cu-interconnect-pad-pitch-2mm)

La même exigence s’applique aux fournisseurs établis. Dans son annonce du 16 mars 2026, Micron distinguait ses expéditions en volume de HBM4 à 12 couches de ses échantillons à 16 couches envoyés aux clients. À cette date, le second produit était encore au stade des échantillons. Traiter les deux comme immédiatement disponibles en quantité fausserait également la comparaison. [Annonce Micron du 16 mars 2026](https://investors.micron.com/news/press-release/2026/Micron-in-High-Volume-Production-of-HBM4-Designed-for-NVIDIA-Vera-Rubin-PCIe-Gen6-SSD-and-SOCAMM2-03-16-2026/default.aspx)

Pour la plateforme G5 de CXMT, le rendement de fabrication reste inconnu dans les documents examinés. Le coût complet d’une HBM comparable demeure également à documenter. L’annonce de mémoire mobile apporte une information sur ce segment précis ; évaluer la HBM demande des données propres à ses produits et à leur assemblage.

## Fabriquer plus fin sans confondre les mesures

La lithographie dessine les motifs qui serviront à fabriquer les circuits. Lorsque la finesse voulue dépasse ce qu’une exposition permet directement, plusieurs opérations peuvent produire des motifs plus serrés. ASML décrit cet emploi du *multiple patterning* pour ses équipements de lithographie à ultraviolet profond, dits DUV. CXMT mentionne de son côté une technique de quadruple structuration. Cela explique un procédé possible, sans identifier les machines exactes de son usine. [Documentation ASML](https://www.asml.com/en/products/duv-lithography-systems/twinscan-nxt1980di) · [CXMT](https://www.cxmt.com/en/news/info_22.html)

Il faut aussi lire correctement les nanomètres. La mesure physique d’une zone de mémoire n’est pas interchangeable avec le nom commercial d’une génération de processeurs logiques. Comparer les nombres sans regarder ce qu’ils désignent peut fabriquer un classement dépourvu de sens.

TechInsights apporte un constat indépendant sur un produit commercialisé. Dans son analyse de 2023 du Kirin 9000s du Huawei Mate 60 Pro, le cabinet identifie le procédé 7 nm N+2 de SMIC à partir d’observations physiques du circuit. Son analyse publique laisse ouverts le rendement de production et l’origine des équipements utilisés. [Analyse publique de TechInsights](https://techinsights.com/blog/techinsights-finds-smic-7nm-n2-huawei-mate-60-pro)

Le procédé existe ; sa reproduction à un coût donné reste une autre question. Cette distinction vaut davantage qu’une annonce de rattrapage total ou d’impossibilité définitive. Des étapes supplémentaires peuvent constituer une solution techniquement viable tout en consommant davantage de capacité industrielle. Le prix payé pour cette solution dépend du produit et des autres options réellement accessibles à son acheteur.

Une entreprise privée de son fournisseur préféré peut accepter un coût qu’elle aurait refusé dans un marché entièrement ouvert. Cette contrainte peut donner des clients à une offre locale avant qu’elle égale toutes les caractéristiques de son concurrent. Sa compétitivité durable dépendra ensuite de son coût, de sa fiabilité et de ses progrès.

## Du système testé aux livraisons

Huawei ne cherche pas seulement à fabriquer un substitut carte pour carte. Sa présentation de septembre insiste sur le réseau et la manière de partager les ressources. Mais son calendrier distingue un système Atlas 960 encore testé d’une disponibilité de l’Ascend 960DT visée au premier trimestre 2027. Des résultats de simulation accompagnent cette architecture ; ils ne doivent pas devenir des mesures d’exploitation chez un client. [Calendrier et statut publiés par Huawei](https://www.huawei.com/de/news/2026/atlas-960e-superpod-fuer-ki-modelle)

Un travail technique antérieur apporte un élément d’une autre nature. Le papier CloudMatrix384, déposé en juin 2025 par des équipes de Huawei et SiliconFlow, décrit le fonctionnement d’un service DeepSeek R1 sur Ascend. Il sépare notamment le traitement initial de la demande de la génération des éléments successifs de réponse. Cela documente une intégration matérielle et logicielle, pas seulement un projet de processeur. Les performances restent celles des auteurs, dans les conditions qu’ils ont choisies. [CloudMatrix384, version du 15 juin 2025](https://arxiv.org/html/2506.12708v1)

CloudMatrix documente une intégration existante. Les quantités achetables aujourd’hui, les prix et les garanties de continuité exigent d’autres informations. La provenance des mémoires, des outils industriels et des autres composants appelle également une vérification propre à chaque chaîne de fabrication.

Le nombre de cartes installées n’est pas non plus une mesure suffisante. Il faut savoir combien travaillent utilement pendant la période facturée. Des machines indisponibles, une mauvaise répartition des requêtes ou des échanges trop lents peuvent réduire cette proportion. L’analyse pertinente porte sur le service livré par l’ensemble, pas sur l’addition de ses fiches commerciales. C’est aussi la logique des scénarios définis par MLCommons. [Règles des mesures d’inférence](https://mlcommons.org/benchmarks/inference-datacenter/)

## Processeurs et logiciels : le coût du changement

Les processeurs généralistes participent aussi à cette offre. Loongson documente des configurations à **16, 32 et 64 cœurs physiques** pour les variantes respectives **3C6000/S, /D et /Q**, reposant sur l’architecture LoongArch. Le nombre de cœurs donne une caractéristique du produit ; comparer des serveurs exige ensuite des essais sur des tâches identiques. [Fiche Loongson 3C6000](https://www.loongson.cn/product/show?id=41)

Une architecture d’instructions définit, en simplifiant, le langage élémentaire compris par le processeur. LoongArch possède une documentation intégrée au projet du noyau Linux. Cette prise en charge peut donc être examinée en dehors du catalogue commercial de Loongson. Les adaptations nécessaires aux applications métier et la provenance des autres composants du serveur restent des questions distinctes. [Documentation du noyau Linux](https://docs.kernel.org/arch/loongarch/introduction.html)

vLLM, un logiciel qui fait fonctionner des modèles pour répondre aux utilisateurs, permet d’intégrer des matériels par modules séparés. Ses greffons isolent le code propre à chaque plateforme et réduisent les modifications à entretenir dans le cœur du projet. Ce mécanisme facilite le travail des développeurs qui proposent une autre infrastructure. [Présentation technique des greffons vLLM](https://vllm.ai/blog/2025-05-12-hardware-plugin)

Le greffon Ascend est documenté et sa matrice de compatibilité indique aussi des combinaisons de fonctions partiellement prises en charge ou non compatibles. Il ne faut pas lire cette matrice comme un classement face à NVIDIA : elle décrit des interactions à l’intérieur de cette implémentation. Son intérêt est de rendre les limites inspectables, au lieu de résumer la migration au mot « compatible ». [Documentation vLLM Ascend](https://docs.vllm.ai/projects/ascend/en/v0.23.0/) · [Matrice de fonctions, version 0.23.0](https://docs.vllm.ai/projects/ascend/en/v0.23.0/user_guide/support_matrix/feature_matrix.html)

Pour un client, le coût du changement inclut donc les essais, le réglage des performances et le travail à reprendre lorsqu’une fonction manque. Mais l’argument fonctionne dans les deux sens : une intégration logicielle qui progresse peut réduire ces coûts sans qu’une nouvelle usine soit nécessaire. L’avance d’un fournisseur dépend ainsi de produits physiques et d’habitudes de développement. Elle peut s’éroder de façon inégale.

## Les restrictions ont aussi des effets sur les clients

Les contrôles américains ne se limitent pas aux accélérateurs. Le paquet annoncé le 2 décembre 2024 inclut de la HBM, des équipements et des logiciels de fabrication. Le Bureau of Industry and Security justifie ces mesures par les capacités militaires et technologiques qu’il cherche à limiter. Ce périmètre vise plusieurs étapes de la production, pas uniquement la vente d’une carte finie. [BIS, mesures du 2 décembre 2024](https://www.bis.gov/press-release/commerce-strengthens-export-controls-restrict-chinas-capability-produce-advanced-semiconductors-military)

Un autre texte, daté du 13 janvier 2026, organise l’examen au cas par cas des demandes concernant notamment les H200 et MI325X, sous conditions de sécurité et de capacité disponible pour les clients américains. Le BIS présente aussi les ventes contrôlées comme un moyen de renforcer l’écosystème technologique américain. Chaque demande reste soumise à autorisation. Ces deux annonces constituent des jalons datés de la politique américaine. [BIS, politique de licences de janvier 2026](https://www.bis.gov/press-release/department-commerce-revises-license-review-policy-semiconductors-exported-china)

Ces textes montrent que sécurité et maintien d’une implantation industrielle sont explicitement articulés. Ils ne permettent pas de décider que l’un des objectifs serait nécessairement un prétexte. Leur efficacité doit s’évaluer selon le résultat recherché : retarder certains calculs, limiter un usage militaire ou conserver une relation commerciale ne sont pas des critères identiques.

NVIDIA apporte une contradiction utile au récit d’un avantage uniforme pour les entreprises américaines. Dans son rapport annuel pour l’exercice clos le 25 janvier 2026, le groupe estime que les restrictions d’accès au marché chinois ont aidé ses concurrents à développer leurs réseaux de clients et de développeurs. C’est l’analyse d’un vendeur affecté par ces règles, pas une démonstration indépendante de leur effet net. Elle montre néanmoins pourquoi l’intérêt d’un fabricant exportateur peut différer de celui d’un laboratoire de modèles. [NVIDIA, Form 10-K, facteurs de risque](https://www.sec.gov/Archives/edgar/data/1045810/000104581026000021/nvda-20260125.htm)

Le mécanisme est plausible : une difficulté d’approvisionnement incite un client à financer une adaptation ; cette adaptation devient ensuite réutilisable. Le premier coût est subi, le suivant peut être plus faible. Les travaux autour de vLLM donnent un exemple du type d’intégration concerné, sans mesurer combien de ventes américaines auraient ainsi été perdues. [Architecture des greffons](https://vllm.ai/blog/2025-05-12-hardware-plugin)

Il faut donc tenir les deux effets ensemble. Un contrôle peut ralentir une capacité à court terme et favoriser l’apprentissage d’une filière concurrente à plus longue échéance. Les documents disponibles ici ne permettent pas de calculer le bilan de ces effets. Affirmer que les restrictions sont sans conséquences serait aussi peu fondé que d’en déduire un blocage définitif.

## La concurrence peut commencer avant l’autonomie complète

Les relations commerciales traversent ces frontières. Huawei présente explicitement une stratégie de monétisation du matériel. Dans un autre segment, Anthropic cite Micron, Samsung et SK hynix parmi les investisseurs de sa levée annoncée le 28 mai 2026. Les fournisseurs de mémoire participent ainsi au financement d’un de leurs débouchés possibles. Le communiqué ne détaille aucun engagement d’achat en retour. [Huawei](https://www.huawei.com/en/news/2026/9/hc-ascend960-supernode) · [Anthropic, annonce Series H](https://www.anthropic.com/news/series-h)

Ces liens invitent à regarder qui gagne quoi. Un modèle moins cher peut réduire la recette par requête d’un laboratoire tout en augmentant le nombre de requêtes et la demande d’équipements. Une puce concurrente peut peser sur les marges du fournisseur établi, mais aussi permettre à un client de construire une capacité jusque-là inaccessible. Ce sont des scénarios économiques distincts ; aucun ne se déduit du seul succès dans un test.

L’hypothèse selon laquelle les appels au ralentissement protégeraient une position financière appelle un examen précis : quelle restriction est proposée, quel concurrent serait touché et quel revenu ou actif serait préservé ? Comme dans le [premier volet sur le droit de poursuivre le développement de l’IA](/posts/ia-ralentissement-1-qui-pourra-continuer/), les intérêts économiques et la validité des alertes de sécurité doivent être examinés séparément. Les deux peuvent coexister.

Les sources décrivent une progression par segments : processeurs généralistes, intégration logicielle, service de modèles et procédés de fabrication. Pour les annonces de septembre, les volumes réellement livrables, les rendements et le coût complet restent à documenter. Ce sont ces données qui permettront de mesurer la solidité commerciale des nouvelles offres.

**Une autre machine capable de rendre le service attendu donne déjà un choix au client.** Cette option peut peser sur une négociation avant de remplacer tout un marché. L’enjeu industriel se mesure dans les équipements livrés, leur coût complet et le travail qu’ils accomplissent au quotidien.

## Sources

- CXMT, 2026-09-20. [CXMT Announces Mass Production of 5th-Generation DRAM Technology Platform](https://www.cxmt.com/en/news/info_22.html).
- Huawei, 2026-09-17. [Huawei Unveils Atlas 960E SuperPoD](https://www.huawei.com/en/news/2026/9/hc-ascend960-supernode).
- Huawei Deutschland, 2026-09-18. [Huawei stellt Atlas 960E SuperPoD vor](https://www.huawei.com/de/news/2026/atlas-960e-superpod-fuer-ki-modelle).
- DeepSeek-AI, 2024-12-27. [DeepSeek-V3 Technical Report, v1](https://arxiv.org/html/2412.19437v1).
- Huawei / SiliconFlow, 2025-06-15. [Serving Large Language Models on Huawei CloudMatrix384, v1](https://arxiv.org/html/2506.12708v1).
- Jacob Austin et al., 2025-02-04. [How to Think About GPUs and TPUs / All About Rooflines](https://jax-ml.github.io/scaling-book/roofline/).
- Hugging Face, consulté le 27 septembre 2026. [Transformers: Quantization overview](https://huggingface.co/docs/transformers/main/en/quantization/overview).
- MLCommons, consulté le 27 septembre 2026. [MLPerf Inference: Datacenter](https://mlcommons.org/benchmarks/inference-datacenter/).
- Micron, consulté le 27 septembre 2026. [High-bandwidth memory (HBM)](https://www.micron.com/products/memory/hbm).
- imec, 2024-05-29. [Die-to-wafer hybrid bonding with a Cu interconnect pad pitch of 2 µm](https://www.imec-int.com/en/press/imec-demonstrates-die-wafer-hybrid-bonding-cu-interconnect-pad-pitch-2mm).
- Micron, 2026-03-16. [Micron in High-Volume Production of HBM4 Designed for NVIDIA Vera Rubin](https://investors.micron.com/news/press-release/2026/Micron-in-High-Volume-Production-of-HBM4-Designed-for-NVIDIA-Vera-Rubin-PCIe-Gen6-SSD-and-SOCAMM2-03-16-2026/default.aspx).
- ASML, consulté le 27 septembre 2026. [TWINSCAN NXT:1980Di](https://www.asml.com/en/products/duv-lithography-systems/twinscan-nxt1980di).
- TechInsights, consulté le 27 septembre 2026. [TechInsights Finds SMIC 7nm (N+2) in Huawei Mate 60 Pro](https://techinsights.com/blog/techinsights-finds-smic-7nm-n2-huawei-mate-60-pro).
- Loongson, consulté le 27 septembre 2026. [Loongson 3C6000 product page](https://www.loongson.cn/product/show?id=41).
- Linux kernel, consulté le 27 septembre 2026. [Introduction to LoongArch](https://docs.kernel.org/arch/loongarch/introduction.html).
- vLLM / Ascend contributors, 2025-05-12. [Introducing vLLM Hardware Plugin, Best Practice from Ascend NPU](https://vllm.ai/blog/2025-05-12-hardware-plugin).
- vLLM Ascend contributors, consulté le 27 septembre 2026. [vLLM Ascend documentation, v0.23.0](https://docs.vllm.ai/projects/ascend/en/v0.23.0/).
- vLLM Ascend contributors, consulté le 27 septembre 2026. [Feature Matrix, v0.23.0](https://docs.vllm.ai/projects/ascend/en/v0.23.0/user_guide/support_matrix/feature_matrix.html).
- US Bureau of Industry and Security, 2024-12-02. [Commerce Strengthens Export Controls to Restrict China’s Capability to Produce Advanced Semiconductors for Military Applications](https://www.bis.gov/press-release/commerce-strengthens-export-controls-restrict-chinas-capability-produce-advanced-semiconductors-military).
- US Bureau of Industry and Security, 2026-01-13. [Department of Commerce Revises License Review Policy for Semiconductors Exported to China](https://www.bis.gov/press-release/department-commerce-revises-license-review-policy-semiconductors-exported-china).
- NVIDIA / SEC EDGAR, consulté le 27 septembre 2026. [Form 10-K, fiscal year ended 25 January 2026](https://www.sec.gov/Archives/edgar/data/1045810/000104581026000021/nvda-20260125.htm).
- Anthropic, 2026-05-28. [Anthropic announces Series H funding](https://www.anthropic.com/news/series-h).
- MLCommons, consulté le 27 septembre 2026. [MLPerf Inference Rules](https://github.com/mlcommons/inference_policies/blob/master/inference_rules.adoc).

## Méthode et limites

Analyse documentaire arrêtée au **27 septembre 2026**. Les annonces de production et les performances sont attribuées à leurs auteurs. Aucun test matériel, benchmark ou audit d’usine n’a été réalisé par l0g. L’analyse publique de TechInsights est distincte de son rapport commercial complet, qui n’a pas été consulté. Les travaux CloudMatrix sont ceux des développeurs du système. Les chiffres pédagogiques des deux figures sont entièrement fictifs et ne représentent aucun fabricant. L’illustration de partage est une création conceptuelle, sans représentation d’un matériel réel. Les textes américains sont examinés aux dates indiquées, sans constituer un avis juridique sur une opération d’exportation particulière. Aucun échange contradictoire direct avec les entreprises n’a été mené pour ce volet.
