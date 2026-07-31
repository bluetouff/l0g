---
title: "Après les amendes : la boîte noire du contrôle des marchés chez JPMorgan"
description: "Les régulateurs ont imposé à JPMorgan un examen rétrospectif, un consultant indépendant, un plan de remédiation et des rapports réguliers. Leur contenu reste absent du dossier public. Cette seconde partie explique l'accès sponsorisé, la chaîne de surveillance et le risque encore mesurable."
pubDate: 2026-07-31T14:30:00+02:00
updatedDate: 2026-07-31T14:30:00+02:00
tags: ["JPMorgan", "accès sponsorisé", "surveillance des marchés", "CFTC", "Réserve fédérale", "OCC", "gouvernance", "risque opérationnel"]
draft: false
---

*La première partie de cette enquête a établi la séquence : [manipulations reconnues en 2020, lacunes découvertes en 2021, sanctions coordonnées en 2024](/posts/jpmorgan-marche-hors-radar-surveillance-ordres/). Elle a aussi posé une limite essentielle. Les milliards de messages d'ordre absents des systèmes de JPMorgan ne constituent pas des milliards d'abus. Ils constituent des milliards d'objets non testés par les scénarios prévus pour détecter un abus.*

La seconde partie commence après l'amende. Les décisions de la Réserve fédérale, de l'Office of the Comptroller of the Currency et de la Commodity Futures Trading Commission prescrivent un examen rétrospectif, un inventaire des plateformes, un contrôle indépendant, un plan correctif, des rapports d'étape et, pour la CFTC, une certification finale. Au 31 juillet 2026, les sources publiques consultées pour cette enquête donnent les obligations, mais pas le contenu de ces travaux.

L'enjeu dépasse un dysfonctionnement informatique. Une banque de marché délègue l'exécution, achète des logiciels, agrège des flux mondiaux et autorise des clients algorithmiques à accéder à des plateformes sous des montages contractuels distincts. Le contrôle reste efficace seulement si chaque message attendu arrive, si chaque plateforme figure dans l'inventaire et si les scénarios couvrent le comportement pertinent. Le risque naît dans les raccords.

## L'accès sponsorisé, délégation sans abandon

Sur la plateforme désignée « DCM-1 », JPMorgan attribue l'essentiel des messages manquants à l'activité en accès sponsorisé de trois sociétés algorithmiques importantes. La [CFTC reprend cette explication](https://www.cftc.gov/media/10721/Order05232024JPMorganSecuritiesLLC/download) sans nommer la plateforme ni les firmes.

L'[accès sponsorisé](/glossaire/acces-sponsorise/) permet à un client ou à un intermédiaire de transmettre des ordres vers une plateforme grâce à l'accès d'un membre. L'ordre provient économiquement du client, pas du sponsor. Son acheminement, sa compensation, ses contrôles avant transaction et sa surveillance après transaction peuvent relever de plusieurs entités selon le marché et le contrat.

Le droit confirme cette répartition des responsabilités. Pour les marchés de titres relevant de la SEC, la [règle 15c3-5](https://www.sec.gov/rules-regulations/2011/06/risk-management-controls-brokers-or-dealers-market-access) impose au courtier disposant de l'accès au marché des contrôles financiers et réglementaires sous son contrôle direct et exclusif, avec des exceptions limitées. La règle exige aussi un examen régulier de leur efficacité.

Le cadre des contrats à terme n'est pas identique. Dans une [lettre d'interprétation de 2013](https://www.cftc.gov/node/212621), la CFTC précise qu'un courtier en contrats à terme offrant un accès sponsorisé à une firme d'exécution n'est pas, par ce seul fait, obligé au titre de la règle 1.73(a)(2)(iv) de filtrer les ordres des clients de cette firme. Cette précision interdit un raccourci : « sponsor » ne signifie pas responsabilité universelle pour chaque contrôle.

Elle ne retire rien à la décision de 2024. La CFTC sanctionne J.P. Morgan Securities au titre de la règle 166.3 pour défaut de supervision diligente de ses activités réglementées. Le défaut établi porte sur l'entrée et la surveillance des messages dans le système. L'identité économique du client ne rend pas facultative la donnée nécessaire au dispositif adopté par JPMorgan.

## Une alerte dépend d'une chaîne complète

La [surveillance d'un marché électronique](/glossaire/surveillance-des-marches/) n'est pas un logiciel isolé. Elle forme une chaîne :

1. la plateforme produit les messages d'ajout, de modification, d'annulation et d'exécution ;
2. des connecteurs transportent et normalisent les flux ;
3. l'inventaire associe chaque plateforme, produit, équipe de marché et client aux contrôles applicables ;
4. un rapprochement compare le volume attendu au volume reçu ;
5. des scénarios recherchent les comportements suspects ;
6. des analystes examinent les alertes et documentent leur classement ;
7. les dossiers les plus sérieux sont transmis à la conformité, aux superviseurs et, si nécessaire, aux autorités.

En 2020, JPMorgan indiquait à la CFTC utiliser trois types principaux d'alertes dans le logiciel SMARTS pour le spoofing et le *layering*, un empilement d'ordres trompeurs dans le carnet. L'[ordonnance 20-69](https://www.cftc.gov/media/4826/enfjpmorganchaseorder092920/download) décrit aussi des contrôles de qualité et des rapports mensuels par trader, équipe, superviseur et région. Ces étapes se situent après l'entrée des données. Un test automatique bien réglé ne voit jamais un message absent.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 780 500" role="img" aria-label="Chaîne de surveillance des ordres et point de rupture constaté chez JPMorgan" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="780" height="500" fill="#0c0d10"/>
  <text x="34" y="40" fill="#f5f6f8" font-size="18" font-weight="700">UNE ALERTE EXISTE SEULEMENT APRÈS L'ENTRÉE DES DONNÉES</text>
  <text x="34" y="64" fill="#8b909b" font-size="12">Chaîne simplifiée de surveillance électronique et rupture décrite par la CFTC.</text>
  <rect x="34" y="108" width="150" height="72" rx="6" fill="#15171c" stroke="#5eead4"/>
  <text x="109" y="137" fill="#5eead4" font-size="12" font-weight="700" text-anchor="middle">PLATEFORME</text>
  <text x="109" y="158" fill="#d6d9df" font-size="10" text-anchor="middle">ordres et exécutions</text>
  <line x1="184" y1="144" x2="232" y2="144" stroke="#5eead4" stroke-width="2"/>
  <polygon points="232,144 220,137 220,151" fill="#5eead4"/>
  <rect x="234" y="108" width="150" height="72" rx="6" fill="#21131a" stroke="#ff4d87" stroke-width="2"/>
  <text x="309" y="137" fill="#ff4d87" font-size="12" font-weight="700" text-anchor="middle">ENTRÉE DES DONNÉES</text>
  <text x="309" y="158" fill="#d6d9df" font-size="10" text-anchor="middle">connecteur et format</text>
  <line x1="384" y1="144" x2="432" y2="144" stroke="#ff4d87" stroke-width="2" stroke-dasharray="6 5"/>
  <line x1="408" y1="119" x2="408" y2="169" stroke="#ff4d87" stroke-width="5"/>
  <text x="408" y="201" fill="#ff4d87" font-size="11" font-weight="700" text-anchor="middle">RUPTURE CONSTATÉE</text>
  <rect x="434" y="108" width="150" height="72" rx="6" fill="#15171c" stroke="#2a2c33"/>
  <text x="509" y="137" fill="#d6d9df" font-size="12" font-weight="700" text-anchor="middle">RAPPROCHEMENT</text>
  <text x="509" y="158" fill="#8b909b" font-size="10" text-anchor="middle">attendu contre reçu</text>
  <line x1="584" y1="144" x2="632" y2="144" stroke="#3a3d46" stroke-width="2"/>
  <polygon points="632,144 620,137 620,151" fill="#3a3d46"/>
  <rect x="634" y="108" width="112" height="72" rx="6" fill="#15171c" stroke="#2a2c33"/>
  <text x="690" y="137" fill="#d6d9df" font-size="12" font-weight="700" text-anchor="middle">SCÉNARIOS</text>
  <text x="690" y="158" fill="#8b909b" font-size="10" text-anchor="middle">alertes</text>
  <line x1="690" y1="180" x2="690" y2="244" stroke="#3a3d46" stroke-width="2"/>
  <polygon points="690,244 683,232 697,232" fill="#3a3d46"/>
  <rect x="590" y="246" width="156" height="72" rx="6" fill="#15171c" stroke="#2a2c33"/>
  <text x="668" y="275" fill="#d6d9df" font-size="12" font-weight="700" text-anchor="middle">ANALYSTE</text>
  <text x="668" y="296" fill="#8b909b" font-size="10" text-anchor="middle">classement et transmission</text>
  <rect x="34" y="258" width="476" height="126" rx="6" fill="#171a20" stroke="#f5b13d"/>
  <text x="58" y="289" fill="#f5b13d" font-size="13" font-weight="700">ERREUR DE « SOURCE DORÉE »</text>
  <text x="58" y="318" fill="#d6d9df" font-size="11">Les flux directs des plateformes échappaient au rapprochement trimestriel.</text>
  <text x="58" y="342" fill="#d6d9df" font-size="11">Une source exacte peut se perdre pendant la configuration ou le transport.</text>
  <text x="58" y="366" fill="#d6d9df" font-size="11">Sans compteur attendu, aucune alerte ne révèle nécessairement l'absence.</text>
  <text x="34" y="434" fill="#d6d9df" font-size="11">Le risque se situe avant le modèle : inventaire, chemin des données, connecteur et rapprochement.</text>
  <text x="34" y="458" fill="#8b909b" font-size="10">Sources : CFTC 24-07, sections II.C.2 et II.C.3 ; Fed 24-007-B-HC ; OCC AA-EC-2023-50.</text>
</svg>
<figcaption>Le point de rupture constaté par la CFTC se situe dans l'alimentation du système. Les scénarios et les analystes placés en aval ne pouvaient pas compenser automatiquement un flux absent.</figcaption>
</figure>

## La source dorée, erreur de modèle opérationnel

JPMorgan appliquait un rapprochement trimestriel à certaines données, mais pas aux flux reçus directement des plateformes. La firme partait de l'hypothèse qu'une donnée issue d'une bourse constituait une *golden source* et ne nécessitait pas le même test.

Cette hypothèse confond deux propriétés :

- l'exactitude de la donnée produite par la plateforme ;
- l'exhaustivité de la donnée arrivée dans l'outil de JPMorgan.

La première peut être excellente tandis que la seconde tombe à zéro. Une mauvaise configuration, un identifiant de produit non associé, un connecteur incomplet ou une transformation rejetée suffisent. La CFTC identifie des problèmes de configuration des flux comme cause des lacunes. Elle ne publie pas la répartition entre chaque type d'erreur.

Le dispositif dépend alors d'un contrôle de sa propre entrée. Il suppose que les données sont complètes. Sans vérification indépendante de cette hypothèse, un tableau d'alertes vide paraît rassurant. Il peut aussi signaler une absence de données.

## Cinq documents et étapes imposés par la CFTC

L'[ordonnance CFTC du 23 mai 2024](https://www.cftc.gov/media/10721/Order05232024JPMorganSecuritiesLLC/download) ne se limite pas à une pénalité. Elle impose une séquence documentaire précise :

1. **un rapport de JPMorgan** sur chaque plateforme et activité touchée, la période, le volume non surveillé et tout cas associé de mauvaise conduite sur le marché ;
2. **un rapport du consultant indépendant** sur les politiques, l'inventaire des plateformes, les rapprochements, les scénarios, les tests et le traitement des activités non surveillées ;
3. **un plan de remédiation** répondant aux constatations et recommandations du consultant ;
4. **des rapports trimestriels** détaillant les mesures prises, l'état d'avancement et le calendrier ;
5. **une certification d'achèvement** signée par le responsable de la conformité et un autre dirigeant senior.

La Commission permet des prolongations pour motif valable. Les rapports trimestriels prennent fin seulement après remise et acceptation de la certification par la Division of Enforcement.

La [Fed](https://www.federalreserve.gov/newsevents/pressreleases/files/enf20240314a1.pdf) impose une architecture proche : rapport interne, tiers indépendant, rapport au conseil d'administration et à la Federal Reserve Bank of New York, plan approuvé, puis rapports d'étape trimestriels. Son examen doit inclure la surveillance des activités propres et clientes, le contrôle exercé par le conseil, l'inventaire des plateformes, les rapprochements automatisés, le réglage des tests de détection et leur vérification périodique.

L'[OCC](https://www.occ.gov/static/enforcement-actions/eaAA-EC-2023-50.pdf) exige en plus un retour en arrière, appelé *lookback*, destiné à rechercher dans les activités non surveillées d'éventuels abus jusque-là non identifiés. Son ordre de pénalité réserve expressément la possibilité d'une sanction supplémentaire fondée sur les résultats de cet examen.

## Une conclusion de JPMorgan, pas un audit public

Dans son [Form 10-Q du deuxième trimestre 2024](https://www.sec.gov/Archives/edgar/data/19617/000001961724000453/jpm-20240630.htm), JPMorgan déclare avoir achevé des améliorations de l'inventaire des plateformes et des contrôles d'exhaustivité. D'autres travaux restaient en cours. La firme indiquait avoir engagé le consultant indépendant prescrit et payé environ 450 millions de dollars de pénalités coordonnées.

Le même document affirme que l'examen des données auparavant non surveillées n'a identifié aucune faute d'employé, aucun préjudice pour les clients et aucun dommage au marché. Cette formulation est importante et doit rester entière. Elle constitue la conclusion publiée par JPMorgan.

Elle ne remplace pas la publication du rapport rétrospectif ni celle du rapport indépendant. Au 31 juillet 2026, notre recherche dans les pages publiques de la CFTC, de la Fed, de l'OCC et dans les rapports SEC de JPMorgan n'a pas trouvé le contenu de ces documents. Le public ne peut donc pas comparer :

- la méthode de recherche appliquée aux milliards de messages ;
- les plateformes, produits et périodes détaillés ;
- les seuils et scénarios utilisés pour reconstruire les alertes ;
- les recommandations du consultant ;
- les exceptions, limites et tests de validation ;
- le statut d'une éventuelle certification finale acceptée par la CFTC.

L'absence de publication ne signifie pas absence de remise aux autorités. Les ordres imposent leur transmission. Elle signifie une impossibilité de reproduire publiquement la conclusion de la banque.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 780 510" role="img" aria-label="Carte des informations publiques et non publiques sur la remédiation de JPMorgan" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="780" height="510" fill="#0c0d10"/>
  <text x="34" y="40" fill="#f5f6f8" font-size="18" font-weight="700">DOSSIER PUBLIC : PREUVES ET ANGLES MORTS</text>
  <text x="34" y="64" fill="#8b909b" font-size="12">État de la recherche documentaire au 31 juillet 2026.</text>
  <rect x="34" y="98" width="338" height="328" rx="7" fill="#141a1a" stroke="#5eead4" stroke-width="2"/>
  <text x="58" y="132" fill="#5eead4" font-size="14" font-weight="700">PUBLIC</text>
  <text x="58" y="168" fill="#d6d9df" font-size="11">• périodes générales : 2014 à 2023</text>
  <text x="58" y="198" fill="#d6d9df" font-size="11">• au moins 30 plateformes</text>
  <text x="58" y="228" fill="#d6d9df" font-size="11">• milliards de messages sur DCM-1</text>
  <text x="58" y="258" fill="#d6d9df" font-size="11">• plus de 99 % absents sur DCM-1</text>
  <text x="58" y="288" fill="#d6d9df" font-size="11">• erreur d'entrée des données et de rapprochement</text>
  <text x="58" y="318" fill="#d6d9df" font-size="11">• obligations du consultant</text>
  <text x="58" y="348" fill="#d6d9df" font-size="11">• conclusion publiée par JPMorgan</text>
  <text x="58" y="378" fill="#d6d9df" font-size="11">• pénalités et mécanismes de crédit</text>
  <rect x="408" y="98" width="338" height="328" rx="7" fill="#21131a" stroke="#ff4d87" stroke-width="2"/>
  <text x="432" y="132" fill="#ff4d87" font-size="14" font-weight="700">NON TROUVÉ DANS LE DOSSIER PUBLIC</text>
  <text x="432" y="168" fill="#d6d9df" font-size="11">• identité de DCM-1</text>
  <text x="432" y="198" fill="#d6d9df" font-size="11">• identité des trois firmes algorithmiques</text>
  <text x="432" y="228" fill="#d6d9df" font-size="11">• ventilation par produit et plateforme</text>
  <text x="432" y="258" fill="#d6d9df" font-size="11">• méthode détaillée de l'examen rétrospectif</text>
  <text x="432" y="288" fill="#d6d9df" font-size="11">• rapport du consultant indépendant</text>
  <text x="432" y="318" fill="#d6d9df" font-size="11">• recommandations et exceptions</text>
  <text x="432" y="348" fill="#d6d9df" font-size="11">• rapports trimestriels de progrès</text>
  <text x="432" y="378" fill="#d6d9df" font-size="11">• certification finale acceptée</text>
  <text x="34" y="464" fill="#d6d9df" font-size="11">« Non trouvé » décrit une limite documentaire, pas une preuve d'inexistence.</text>
  <text x="34" y="486" fill="#8b909b" font-size="10">Sources consultées : CFTC, Fed, OCC, SEC EDGAR et rapports réglementaires de JPMorgan.</text>
</svg>
<figcaption>La colonne de droite recense les informations absentes des sources publiques consultées. Les autorités peuvent les détenir sans devoir les publier dans leur intégralité.</figcaption>
</figure>

## DCM-1 reste sans nom

La CFTC emploie « DCM-1 », son code pour une plateforme américaine réglementée de contrats à terme. Aucun nom de plateforme n'apparaît dans l'ordonnance. Toute attribution à une bourse précise serait donc spéculative.

Cette anonymisation empêche plusieurs contrôles externes. Sans la plateforme, impossible de rapprocher la période avec les règles du marché, les avis techniques, les incidents de flux ou les données disciplinaires de l'opérateur. Sans les produits, impossible de mesurer la concentration par classe d'actifs. Sans les firmes algorithmiques, impossible de vérifier leurs propres historiques réglementaires.

Le silence peut protéger des informations commerciales, des clients ou des investigations. Aucune explication publique précise n'est donnée dans l'ordonnance. L'enquête conserve donc l'identifiant DCM-1 et refuse toute devinette.

## Trois firmes algorithmiques sans identité

JPMorgan décrit trois sociétés algorithmiques « significatives » derrière l'essentiel de l'activité en accès sponsorisé sur DCM-1. L'adjectif ne donne ni volume, ni part de marché, ni risque.

La concentration auprès de trois clients présente toutefois un mécanisme de risque clair. Un flux mal configuré pour un petit nombre de producteurs très actifs peut générer des milliards de messages absents. La taille brute vient de l'automatisation. Elle ne démontre ni fraude ni perte, mais elle augmente le coût d'une reconstruction rétrospective et la sensibilité aux erreurs de périmètre.

Une surveillance conçue autour des employés de la banque peut aussi différer d'une surveillance destinée aux clients à haute fréquence. Les tests, identifiants, seuils de bruit et méthodes de transmission ne sont pas nécessairement identiques. Le rapport indépendant devait précisément évaluer la couverture des activités propres et clientes ainsi que le réglage des seuils de détection. Son absence du dossier public empêche de savoir comment cette distinction a été traitée.

## Aucun signal ne prouve l'absence d'abus

Le raisonnement pédagogique tient en trois propositions :

1. un système complet peut générer zéro alerte parce qu'aucun comportement suspect n'existe ;
2. un système incomplet peut aussi générer zéro alerte parce que les messages nécessaires manquent ;
3. le nombre d'alertes ne devient interprétable qu'après preuve de l'exhaustivité des données.

Cette conclusion ne transforme pas l'inconnu en soupçon. Elle fixe l'ordre des preuves. L'exhaustivité vient avant le réglage des seuils, puis l'examen humain, puis l'attribution d'une intention.

Une [revue thématique de l'Organisation internationale des commissions de valeurs](https://www.iosco.org/library/pubdocs/pdf/IOSCOPD786.pdf), publiée en 2025, rappelle le principe au niveau des autorités de marché : l'accès aux ordres, transactions et annulations est indispensable à une surveillance efficace et à la reconstruction du marché. L'étude ne porte pas sur JPMorgan. Elle confirme la logique générale du contrôle.

Les travaux académiques aboutissent au même besoin de données fines. Bao Linh Do et Tālis Putniņš identifient, dans leur [étude sur la détection du spoofing](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4525036), les déséquilibres du carnet, l'activité d'ordre, les annulations anormales et leurs cycles parmi les variables utiles. Leur papier propose une méthode empirique, pas une conclusion sur DCM-1. Sans messages d'ordre complets, ces variables ne peuvent pas être reconstruites correctement.

## Le risque en quatre étages

Le dossier présente quatre risques distincts. Les mélanger produit soit une accusation excessive, soit une lecture trop rassurante.

**Risque de conduite.** Un comportement manipulateur peut échapper à la détection lorsque les messages correspondants n'entrent pas dans le système. Le dossier public ne prouve pas sa réalisation dans les flux manquants.

**Risque réglementaire.** La CFTC, la Fed et l'OCC ont déjà sanctionné les lacunes. L'ordre OCC permet une pénalité supplémentaire fondée sur l'examen rétrospectif. Une nouvelle sanction dépendrait de faits nouveaux ou d'une correction insuffisante, inconnus à ce stade.

**Risque opérationnel.** Une erreur d'inventaire, de connecteur ou de rapprochement peut neutraliser des outils sophistiqués. Le problème concerne le chemin suivi par les données, pas seulement le logiciel de détection.

**Risque de gouvernance.** En 2020, le conseil et les autorités ont reçu une description détaillée des améliorations. En 2021, la firme découvre un périmètre massif absent. Le test de gouvernance porte donc sur la validation indépendante des déclarations de couverture, pas sur le nombre de procédures écrites.

Ce risque ne se lit pas dans le bénéfice trimestriel comme une provision de crédit. Il ressemble davantage aux risques de plomberie décrits dans notre analyse du [repo et du collatéral](/posts/repo-collateral-fabrique-liquidite/) : une infrastructure paraît secondaire jusqu'au jour où une rupture révèle le rôle de chaque raccord. Pour une lecture plus générale du contrôle bancaire, notre grille des [résultats bancaires et du risque](/posts/resultats-bancaires-t2-2026-lire-le-risque/) distingue également performance comptable, conduite et exposition opérationnelle.

## Cinq marqueurs à surveiller

Une enquête au long cours doit produire une liste réfutable. Cinq événements permettraient de mettre à jour le diagnostic :

1. **une levée publique des restrictions d'intégration de nouvelles plateformes** par la Fed ou l'OCC ;
2. **une certification d'achèvement acceptée par la CFTC**, si l'autorité la rend publique ;
3. **une nouvelle action fondée sur l'examen rétrospectif**, éventualité expressément préservée par l'OCC ;
4. **une publication plus détaillée de JPMorgan** sur la méthode de reconstruction, le consultant ou le statut de remédiation ;
5. **une décision de justice ou une procédure réglementaire** reliant un comportement précis aux périodes et plateformes non surveillées.

Sans l'un de ces éléments, trois phrases restent les seules conclusions solides : la faille était massive, JPMorgan affirme n'avoir identifié aucun dommage, et le public ne dispose pas des rapports permettant une vérification indépendante.

## Les limites du dossier public

Cette enquête ne nomme pas DCM-1 et ne cherche pas à déduire son identité. Elle ne nomme aucune des trois firmes algorithmiques. Elle n'interprète pas chaque annulation comme une fraude. Elle ne transforme pas un défaut de surveillance en manipulation.

Elle n'additionne pas non plus les sanctions coordonnées comme des paiements indépendants. Les 448,168 millions de dollars effectifs de 2024 sont distincts du règlement coordonné de 920,204 millions en 2020, mais chaque ensemble contient ses propres mécanismes de crédit entre autorités.

Enfin, les rapports imposés aux consultants et à JPMorgan peuvent contenir des informations confidentielles. Leur non-publication ne viole pas nécessairement les ordres. Elle limite la capacité d'un lecteur, d'un investisseur ou d'un chercheur à auditer la conclusion publiée.

## Sources primaires

1. CFTC, [ordonnance 24-07 sur les lacunes de surveillance](https://www.cftc.gov/media/10721/Order05232024JPMorganSecuritiesLLC/download), 23 mai 2024.
2. Réserve fédérale, [ordonnance 24-007-B-HC et 24-007-CMP-HC](https://www.federalreserve.gov/newsevents/pressreleases/files/enf20240314a1.pdf), 14 mars 2024.
3. OCC, [ordonnance AA-EC-2023-50](https://www.occ.gov/static/enforcement-actions/eaAA-EC-2023-50.pdf), 14 mars 2024.
4. OCC, [ordonnance de pénalité AA-EC-2023-49](https://www.occ.gov/static/enforcement-actions/eaAA-EC-2023-49.pdf), 14 mars 2024.
5. JPMorgan Chase, [Form 10-Q au 30 juin 2024](https://www.sec.gov/Archives/edgar/data/19617/000001961724000453/jpm-20240630.htm), note « Trading Venues Investigations ».
6. CFTC, [ordonnance 20-69 sur la surveillance et le spoofing](https://www.cftc.gov/media/4826/enfjpmorganchaseorder092920/download), 29 septembre 2020.
7. SEC, [règle 15c3-5 sur l'accès au marché](https://www.sec.gov/rules-regulations/2011/06/risk-management-controls-brokers-or-dealers-market-access), 3 novembre 2010.
8. CFTC, [lettre d'interprétation 13-27 sur l'accès sponsorisé et la règle 1.73](https://www.cftc.gov/node/212621), 29 avril 2013.
9. IOSCO, [Thematic Review on Technological Challenges to Effective Market Surveillance](https://www.iosco.org/library/pubdocs/pdf/IOSCOPD786.pdf), 2025.

**Recherche académique complémentaire :** Bao Linh Do et Tālis J. Putniņš, [« Detecting Layering and Spoofing in Markets »](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4525036), version du 3 novembre 2023. Le papier sert uniquement à expliquer les données nécessaires à la détection ; il n'étudie pas JPMorgan. Le *layering* désigne ici l'empilement de plusieurs ordres trompeurs dans le carnet.

*Méthode et limite : recherche arrêtée au 31 juillet 2026 dans les ordres, communiqués et bases publiques de la CFTC, de la Fed, de l'OCC et de la SEC, puis dans les rapports réglementaires de JPMorgan. La mention « non trouvé » décrit le périmètre documentaire consulté. Elle ne prouve ni l'inexistence d'un rapport transmis confidentiellement, ni un manquement à l'ordre.*
