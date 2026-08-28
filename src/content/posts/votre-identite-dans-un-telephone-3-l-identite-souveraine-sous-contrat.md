---
title: "Votre identité dans un téléphone, 3/8 : l’identité souveraine sous contrat"
seoTitle: "France Identité : sept contrats et le risque de dépendance | l0g"
ogTitle: "France Identité : sept contrats, une identité"
description: "Le coût actualisé de France Identité atteint 107,4 M€. Sept accords-cadres couvrent son cœur logiciel. Qui contrôle code, clés et reprise ?"
ogImage: "/illustrations/news/france-identite-sovereignty-contract-chain-v1.jpg"
pubDate: 2026-08-28T14:30:00+02:00
updatedDate: 2026-08-28T14:30:00+02:00
tags: ["France Identité", "France Titres", "identité numérique", "souveraineté numérique", "marchés publics", "externalisation", "cybersécurité", "responsabilité", "risque opérationnel", "risque financier", "enquête"]
draft: false
quickTake:
  fact: "Le coût total actualisé du programme est de 107,4 M€. Sept accords-cadres SGIN présentent un plafond cumulé de 44,7 M€, sans que ce plafond corresponde aux sommes déjà payées."
  importance: "Les applications, le backend, la sécurité, l’expertise et les tests sont répartis entre plusieurs titulaires. Une défaillance d’identité peut retarder une aide, une formation ou une formalité économique."
  uncertainty: "Les contrats signés, bons de commande, plans de réversibilité, responsabilités et cartographie du code ne sont pas publiés dans un ensemble permettant de mesurer la capacité de reprise de l’État."
---

*France Identité est une application de l’État. Son hébergement est annoncé sur le cloud du ministère de l’Intérieur. Le cachet électronique de ses justificatifs repose sur un service de la DNUM et sur des clés protégées dans des équipements qualifiés par l’ANSSI. Mais son cœur logiciel, son expertise, sa sécurité, ses applications mobiles, son backend et ses environnements d’interopérabilité sont aussi répartis entre sept accords-cadres.*

*Le pluralisme des fournisseurs n’est pas une anomalie. Il peut limiter la concentration et apporter des compétences rares. La question de souveraineté commence ailleurs : l’État peut-il connaître, auditer, compiler, exploiter, réparer et remplacer chaque composant critique sans dépendre durablement de son titulaire ?*

*La question devient financière lorsque cette identité ouvre l’accès à une formation, une aide, une signature d’entreprise ou une opération contractuelle. Une panne technique peut alors devenir un délai, une échéance manquée ou une perte. Qui remet le service en route, et qui indemnise ?*

*Troisième volet de l’enquête **Votre identité dans un téléphone**. Le premier suivait [les données et les traces de France Identité](/posts/votre-identite-dans-un-telephone-1-la-carte-d-identite-qui-devient-un-service/). Le deuxième mesurait [le prix des parcours sans identité mobile](/posts/votre-identite-dans-un-telephone-2-facultative-mais-a-quel-prix/).*

*English version: [Sovereignty under contract](/en/analysis/your-identity-in-your-phone-3-sovereignty-under-contract/).*

## À retenir

- Le Sénat évalue le coût total actualisé du programme France Identité à **107,4 millions d’euros**. Ce montant couvre le programme dans son ensemble et ne doit pas être confondu avec une facture unique de développement.
- Un avis de marché européen publié en janvier 2025 fixe à **44,7 millions d’euros** la valeur maximale cumulée de sept accords-cadres consacrés à la réalisation et au maintien en conditions opérationnelle et de sécurité du SGIN.
- Ces 44,7 millions sont des **plafonds contractuels**, sans minimum publié. Ils ne disent pas combien a été commandé, facturé, payé ni réceptionné.
- Les données essentielles de la commande publique recensent sept titulaires notifiés le 7 mai 2025 : Eurogroup Consulting, Cabinet Louis Reynaud, Stelau Conseil, Sopra Steria, BAM, IN Smart Identity France et Docaposte BPO.
- L’avis européen prévoit vingt-quatre mois, renouvelables deux fois douze mois, soit quarante-huit mois au maximum. Des fiches issues des données essentielles affichent pourtant six ans. Les contrats signés sont nécessaires pour résoudre cet écart documentaire.
- Le Sénat situe le taux d’externalisation des **projets de France Titres dans leur ensemble** entre 78 % et 95 %, contre un plafond de 60 % préconisé par la DINUM. Ce chiffre ne mesure pas France Identité isolément.
- France Titres annonce un hébergement sur le cloud PI du ministère. La politique de signature confie le cachet de l’État à la DNUM, via SIGNHOR, avec des clés protégées dans des HSM qualifiés par l’ANSSI.
- Les versions mobiles certifiées en 2023 identifiaient Atos France comme développeur. Le lot mobile de 2025 est attribué à BAM. La transition du code, de la compilation et des procédures d’incident n’est pas décrite publiquement.
- iDAKTO revendique la conception du SDK de lecture de la carte et d’un système backend. Le lot serveur 2025 est attribué à IN Smart Identity France. Ces deux faits ne prouvent ni remplacement complet, ni coexistence précise des briques.
- iDAKTO a annoncé l’acquisition de Stelau en juin 2026. Stelau détient le lot d’expertise SI. Cela ne démontre aucun conflit, mais justifie de vérifier les déports, séparations d’équipes et changements de contrôle.
- Le code source mobile est toujours annoncé comme devant être publié prochainement. Le futur portefeuille EUDI est soumis à une obligation européenne de licence open source pour ses composants applicatifs, sous exceptions limitées.
- Les CGU de France Identité limitent fortement la responsabilité déclarée sur les interruptions et les pertes financières dites indirectes, tout en précisant que France Identité reste responsable envers l’usager lorsque des prestations sont sous-traitées. La portée juridique exacte de ces clauses reste à expertiser.

## Deux périmètres financiers à distinguer

Le premier chiffre vient du rapport budgétaire du Sénat consacré à l’administration générale et territoriale de l’État pour 2026. La rapporteure spéciale y indique que le coût total actualisé du programme France Identité atteint **107,4 millions d’euros**, principalement en dépenses hors personnel. Elle mentionne 16,22 millions d’euros de crédits de paiement prévus en 2026. [Le rapport publie ces montants dans sa partie consacrée à France Titres](https://www.senat.fr/rap/l25-139-32/l25-139-32_mono.html).

Ce total ne correspond pas au prix d’une application mobile. Il couvre le programme dans sa durée, ses infrastructures, ses prestations, son exploitation, ses évolutions et les autres dépenses imputées au projet selon la méthode budgétaire retenue.

Le deuxième chiffre provient de la commande publique. L’[avis JOUE 58709-2025](https://ted.europa.eu/fr/notice/-/detail/58709-2025) porte sur la réalisation et le maintien en conditions opérationnelle et de sécurité du Service de garantie de l’identité numérique, le SGIN. Il découpe les prestations en sept lots mono-attributaires et fixe une valeur maximale globale de **44,7 millions d’euros**.

Le mot important est **maximale**.

Chaque lot est un accord-cadre à bons de commande sans minimum publié. Le titulaire peut donc recevoir des commandes successives jusqu’au plafond du lot. Additionner les plafonds permet de mesurer l’enveloppe contractuelle maximale. Cela ne permet pas de connaître :

```text
Montant effectivement commandé
Montant facturé
Montant payé
Prestations réceptionnées
Pénalités appliquées
Part du plafond encore disponible
```

Un titre affirmant que l’État a déjà versé 44,7 millions d’euros à sept entreprises serait faux.

## Sept fonctions, sept titulaires

L’avis de marché définit les fonctions et leurs plafonds. Les titulaires et la date de notification sont recensés dans les [données essentielles de la commande publique](https://www.data.gouv.fr/datasets/donnees-essentielles-de-la-commande-publique-decp-arrete-du-22-12-2022-marches), reprises notamment sur les fiches de l’acheteur public. Cette source ouverte décrit l’attribution. Elle ne remplace ni l’acte d’engagement, ni les bons de commande, ni les pièces d’exécution.

<p style="margin-bottom:.5rem;color:#777f8b;font-size:.78rem">↔ Faites défiler le tableau pour le lire sur mobile.</p>
<div role="region" aria-label="Sept lots SGIN, fonctions, titulaires et plafonds" tabindex="0" style="max-width:100%;overflow-x:auto;overscroll-behavior-inline:contain">
<table style="min-width:44rem">
<thead><tr><th style="text-align:right">Lot</th><th>Fonction</th><th>Titulaire recensé</th><th style="text-align:right">Plafond</th></tr></thead>
<tbody>
<tr><td style="text-align:right">1</td><td>Pilotage des prestations</td><td>Eurogroup Consulting France</td><td style="text-align:right">4,3 M€</td></tr>
<tr><td style="text-align:right">2</td><td>Suivi international, normalisation et politiques des États</td><td>Cabinet Louis Reynaud / CLR Labs</td><td style="text-align:right">3,9 M€</td></tr>
<tr><td style="text-align:right">3</td><td>Expertise en systèmes d’information</td><td>Stelau Conseil</td><td style="text-align:right">5,1 M€</td></tr>
<tr><td style="text-align:right">4</td><td>Sécurité des systèmes d’information</td><td>Sopra Steria Group</td><td style="text-align:right">5,4 M€</td></tr>
<tr><td style="text-align:right">5</td><td>Développement et maintenance des applications mobiles</td><td>BAM</td><td style="text-align:right">7,2 M€</td></tr>
<tr><td style="text-align:right">6</td><td>Développement et maintenance des applications serveur</td><td>IN Smart Identity France</td><td style="text-align:right">10,4 M€</td></tr>
<tr><td style="text-align:right">7</td><td>Environnements de tests et d’interopérabilité multi-partenaires</td><td>Docaposte BPO</td><td style="text-align:right">8,4 M€</td></tr>
</tbody>
</table>
</div>

Les sept marchés sont recensés comme notifiés le **7 mai 2025**. Les fiches de France Titres sur [Pappers](https://www.pappers.fr/entreprise/ants-agence-nationale-des-titres-securises-130003262) permettent de retrouver les lots et attributaires. Une fiche [Macellum consacrée au lot 1](https://www.macellum.fr/marche/c4a28aaf1f79947d37ac75df2ac28d9a6c094c7f-la-consultation-pour-objet-passation-marches-publics-relatifs-la-realisation-au-maintien-en-conditions-operationnelle-de-securite-sgin-service-garantie-l-identite-numerique-l-ants-france-titres-pilotage-prestations-lot-1-pilotage) indique explicitement qu’elle reprend les données essentielles publiées par le ministère de l’Économie.

<figure class="infographic infographic-readable" style="padding-bottom:1.5rem" tabindex="0" aria-label="SEPT CONTRATS, UNE IDENTITÉ">
<svg viewBox="0 0 360 1130" width="100%" role="img" aria-labelledby="contracts-fr-title contracts-fr-desc" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;height:auto;overflow:hidden;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;background:#0c0d10">
<title id="contracts-fr-title">SEPT CONTRATS, UNE IDENTITÉ</title>
<desc id="contracts-fr-desc">Plafonds des accords-cadres SGIN, pas dépenses constatées</desc>
<rect x="1" y="1" width="358" height="1128" rx="16" fill="#0c0d10" stroke="#2b3038"/>
<text x="18" y="42" fill="#f5f6f8" font-size="15" font-weight="700">SEPT CONTRATS, UNE IDENTITÉ</text>
<text x="18" y="64" fill="#8b909b" font-size="8.5">Plafonds des accords-cadres SGIN, pas dépenses constatées</text>
<rect x="14" y="88" width="332" height="116" rx="12" fill="#101319" stroke="#5eead4"/>
<rect x="28" y="106" width="38" height="38" rx="8" fill="#171a20" stroke="#5eead4"/>
<text x="47" y="131" text-anchor="middle" fill="#5eead4" font-size="13" font-weight="700">01</text>
<text x="78" y="116" fill="#5eead4" font-size="10.5" font-weight="700">PILOTAGE DES PRESTATIONS</text>
<text x="78" y="140" fill="#f5f6f8" font-size="10.5">Eurogroup Consulting</text>
<text x="78" y="164" fill="#aeb4bf" font-size="9.5">4,3 M€ max.</text>
<line x1="28" y1="180" x2="332" y2="180" stroke="#2b3038"/>
<text x="28" y="196" fill="#6f7580" font-size="8">Lot mono-attributaire</text>
<rect x="14" y="218" width="332" height="116" rx="12" fill="#101319" stroke="#7aa2f7"/>
<rect x="28" y="236" width="38" height="38" rx="8" fill="#171a20" stroke="#7aa2f7"/>
<text x="47" y="261" text-anchor="middle" fill="#7aa2f7" font-size="13" font-weight="700">02</text>
<text x="78" y="246" fill="#7aa2f7" font-size="10.5" font-weight="700">NORMES ET SUIVI INTERNATIONAL</text>
<text x="78" y="270" fill="#f5f6f8" font-size="10.5">Cabinet Louis Reynaud</text>
<text x="78" y="294" fill="#aeb4bf" font-size="9.5">3,9 M€ max.</text>
<line x1="28" y1="310" x2="332" y2="310" stroke="#2b3038"/>
<text x="28" y="326" fill="#6f7580" font-size="8">Lot mono-attributaire</text>
<rect x="14" y="348" width="332" height="116" rx="12" fill="#101319" stroke="#a78bfa"/>
<rect x="28" y="366" width="38" height="38" rx="8" fill="#171a20" stroke="#a78bfa"/>
<text x="47" y="391" text-anchor="middle" fill="#a78bfa" font-size="13" font-weight="700">03</text>
<text x="78" y="376" fill="#a78bfa" font-size="10.5" font-weight="700">EXPERTISE SYSTÈMES D’INFORMATION</text>
<text x="78" y="400" fill="#f5f6f8" font-size="10.5">Stelau Conseil</text>
<text x="78" y="424" fill="#aeb4bf" font-size="9.5">5,1 M€ max.</text>
<line x1="28" y1="440" x2="332" y2="440" stroke="#2b3038"/>
<text x="28" y="456" fill="#6f7580" font-size="8">Lot mono-attributaire</text>
<rect x="14" y="478" width="332" height="116" rx="12" fill="#101319" stroke="#f5b13d"/>
<rect x="28" y="496" width="38" height="38" rx="8" fill="#171a20" stroke="#f5b13d"/>
<text x="47" y="521" text-anchor="middle" fill="#f5b13d" font-size="13" font-weight="700">04</text>
<text x="78" y="506" fill="#f5b13d" font-size="10.5" font-weight="700">SÉCURITÉ DES SYSTÈMES</text>
<text x="78" y="530" fill="#f5f6f8" font-size="10.5">Sopra Steria Group</text>
<text x="78" y="554" fill="#aeb4bf" font-size="9.5">5,4 M€ max.</text>
<line x1="28" y1="570" x2="332" y2="570" stroke="#2b3038"/>
<text x="28" y="586" fill="#6f7580" font-size="8">Lot mono-attributaire</text>
<rect x="14" y="608" width="332" height="116" rx="12" fill="#101319" stroke="#ff85ad"/>
<rect x="28" y="626" width="38" height="38" rx="8" fill="#171a20" stroke="#ff85ad"/>
<text x="47" y="651" text-anchor="middle" fill="#ff85ad" font-size="13" font-weight="700">05</text>
<text x="78" y="636" fill="#ff85ad" font-size="10.5" font-weight="700">APPLICATIONS MOBILES</text>
<text x="78" y="660" fill="#f5f6f8" font-size="10.5">BAM</text>
<text x="78" y="684" fill="#aeb4bf" font-size="9.5">7,2 M€ max.</text>
<line x1="28" y1="700" x2="332" y2="700" stroke="#2b3038"/>
<text x="28" y="716" fill="#6f7580" font-size="8">Lot mono-attributaire</text>
<rect x="14" y="738" width="332" height="116" rx="12" fill="#101319" stroke="#5eead4"/>
<rect x="28" y="756" width="38" height="38" rx="8" fill="#171a20" stroke="#5eead4"/>
<text x="47" y="781" text-anchor="middle" fill="#5eead4" font-size="13" font-weight="700">06</text>
<text x="78" y="766" fill="#5eead4" font-size="10.5" font-weight="700">APPLICATIONS SERVEUR</text>
<text x="78" y="790" fill="#f5f6f8" font-size="10.5">IN Smart Identity France</text>
<text x="78" y="814" fill="#aeb4bf" font-size="9.5">10,4 M€ max.</text>
<line x1="28" y1="830" x2="332" y2="830" stroke="#2b3038"/>
<text x="28" y="846" fill="#6f7580" font-size="8">Lot mono-attributaire</text>
<rect x="14" y="868" width="332" height="116" rx="12" fill="#101319" stroke="#7aa2f7"/>
<rect x="28" y="886" width="38" height="38" rx="8" fill="#171a20" stroke="#7aa2f7"/>
<text x="47" y="911" text-anchor="middle" fill="#7aa2f7" font-size="13" font-weight="700">07</text>
<text x="78" y="896" fill="#7aa2f7" font-size="10.5" font-weight="700">TESTS ET INTEROPÉRABILITÉ</text>
<text x="78" y="920" fill="#f5f6f8" font-size="10.5">Docaposte BPO</text>
<text x="78" y="944" fill="#aeb4bf" font-size="9.5">8,4 M€ max.</text>
<line x1="28" y1="960" x2="332" y2="960" stroke="#2b3038"/>
<text x="28" y="976" fill="#6f7580" font-size="8">Lot mono-attributaire</text>
<rect x="14" y="998" width="332" height="70" rx="12" fill="#161b19" stroke="#5eead4"/>
<text x="28" y="1025" fill="#5eead4" font-size="10.5" font-weight="700">PLAFOND CUMULÉ</text>
<text x="332" y="1027" text-anchor="end" fill="#f5f6f8" font-size="18" font-weight="700">44,7 M€</text>
<text x="28" y="1050" fill="#aeb4bf" font-size="8.5">Aucun minimum publié</text>
<text x="18" y="1092" fill="#6f7580" font-size="8">Source du périmètre et des plafonds : avis JOUE 58709-2025.</text>
<text x="18" y="1108" fill="#6f7580" font-size="8">Attributaires : DECP, notification du 07/05/2025.</text>
</svg>
<figcaption>Les montants sont des plafonds contractuels. Ils ne prouvent ni les commandes passées, ni les factures payées.</figcaption>
</figure>

La séparation des lots présente un avantage évident. Aucun fournisseur ne reçoit automatiquement l’ensemble de la chaîne. L’avis prévoit même des incompatibilités entre plusieurs fonctions. Le titulaire du pilotage ne peut pas cumuler tous les autres lots. Les lots liés aux normes et à la sécurité sont incompatibles avec plusieurs lots de réalisation. Le lot d’expertise ne peut pas être cumulé avec le pilotage.

Ces clauses montrent que France Titres a anticipé un risque de concentration et de confusion des rôles.

Elles ne répondent pas encore à la question opérationnelle. Un incident peut traverser plusieurs lots : une mise à jour mobile sollicite un backend, appelle un service de signature, produit des traces, dépend d’un environnement de test et doit être qualifiée par des équipes de sécurité. Chaque fournisseur peut respecter son périmètre contractuel tandis que la chaîne complète reste indisponible.

La souveraineté dépend alors de l’acteur capable d’arbitrer entre les lots et de prendre le contrôle technique lorsque leurs diagnostics divergent.

## Quatre ans dans l’avis, six ans dans les données

L’avis européen décrit une durée initiale de vingt-quatre mois, avec deux reconductions de douze mois. Le maximum annoncé est donc de **quarante-huit mois**.

Les [enregistrements officiels DECP filtrés sur l’objet SGIN](https://data.economie.gouv.fr/explore/dataset/decp-2022-marches-valides/table/?q=SGIN) affichent pourtant une durée de **soixante-douze mois** pour les sept marchés notifiés en mai 2025.

L’écart ne démontre pas une irrégularité. Plusieurs explications restent possibles :

- une métadonnée erronée ou mal interprétée ;
- une durée d’exécution distincte de la durée de l’accord-cadre ;
- la prise en compte d’une clause de prestations similaires ;
- une modification contractuelle postérieure ;
- une erreur dans la chaîne de publication des données.

Les pièces signées doivent trancher. Il faut obtenir pour chaque lot l’acte d’engagement, le cahier administratif, les éventuels avenants et la date de fin juridiquement applicable.

Cet écart est lui-même instructif. Un citoyen peut connaître le nom du titulaire et le plafond du marché. Il ne peut pas encore établir avec certitude, à partir des seules données publiées, la durée qui engage juridiquement l’État.

## Le Sénat documente une dépendance plus large

Le rapport du Sénat ne donne pas un taux d’externalisation propre à France Identité. Il décrit **les projets de France Titres dans leur ensemble**.

Selon ce rapport, leur taux d’externalisation se situe entre **78 % et 95 %**, alors que la DINUM préconise un maximum de 60 %. La rapporteure alerte sur la perte de souveraineté, de compétences et de maîtrise opérationnelle. Elle évoque aussi un risque financier, le coût de l’externalisation étant supérieur de 20 % selon la DTNUM à 100 % selon France Titres aux coûts internes comparés. Elle estime qu’une réinternalisation de cinquante équivalents temps plein sur cinq ans pourrait générer environ cinq millions d’euros d’économies. [Ces estimations et leurs limites figurent dans le rapport budgétaire](https://www.senat.fr/rap/l25-139-32/l25-139-32_mono.html).

Ces données appellent deux précautions.

La première est statistique. Elles ne prouvent pas que 78 % à 95 % du code de France Identité est écrit hors de l’État. Le périmètre porte sur les projets de l’agence, qui gère aussi les titres, les immatriculations, les permis et l’assistance aux usagers.

La seconde est économique. Le surcoût de 20 % à 100 % est une estimation administrative rapportée par le Sénat, pas une comptabilité détaillée de chaque marché France Identité.

Le signal reste fort. L’opérateur public qui doit maîtriser une infrastructure régalienne reconnaît, par l’intermédiaire du contrôle parlementaire, une externalisation structurelle bien supérieure à la référence recommandée.

La question n’est donc pas seulement : « combien de prestataires ? ». Elle devient : **combien de personnes publiques savent reprendre leur travail ?**

## L’État conserve des briques critiques

La chaîne n’est pas entièrement sous-traitée.

France Titres affirme que les serveurs de France Identité sont hébergés sur le **cloud PI du ministère de l’Intérieur**, dans des centres de données souverains, avec un cloisonnement strict par rapport aux autres applications ministérielles. La même page annonce des audits du mobile et du backend, des campagnes de bug bounty et une publication prochaine du code source mobile. [Ces engagements figurent sur la page de sécurité de France Identité](https://france-identite.gouv.fr/securite-application/).

La politique de signature publique décrit une autre couche directement étatique. Le secrétariat général du ministère de l’Intérieur est le signataire des attestations. La DNUM fournit le service de signature SIGNHOR. Le SGIN est le seul service autorisé à solliciter le cachet dans ce cadre. Les clés sont protégées dans des boîtiers matériels qualifiés par l’ANSSI et le ministère fournit l’horodatage. [La politique détaille le processus, les acteurs et les garanties](https://france-identite.gouv.fr/politique-de-signature/).

Cette architecture permet de dresser une première séparation :

```text
Hébergement des serveurs
→ cloud PI du ministère de l’Intérieur

Cachet électronique et horodatage
→ DNUM / SIGNHOR / ministère

Clés de signature
→ HSM qualifiés par l’ANSSI

Pilotage, expertise, sécurité,
applications, backend et tests
→ accords-cadres SGIN
```

<figure class="infographic infographic-readable" style="padding-bottom:1.5rem" tabindex="0" aria-label="QUI CONTRÔLE QUOI ?">
<svg viewBox="0 0 360 720" width="100%" role="img" aria-labelledby="control-fr-title control-fr-desc" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;height:auto;overflow:hidden;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;background:#0c0d10">
<title id="control-fr-title">QUI CONTRÔLE QUOI ?</title>
<desc id="control-fr-desc">Carte publique, chaîne contractuelle et angles morts documentaires</desc>
<rect x="1" y="1" width="358" height="718" rx="16" fill="#0c0d10" stroke="#2b3038"/>
<text x="18" y="42" fill="#f5f6f8" font-size="15" font-weight="700">QUI CONTRÔLE QUOI ?</text>
<text x="18" y="64" fill="#8b909b" font-size="8.5">Carte publique, chaîne contractuelle et angles morts documentaires</text>
<rect x="14" y="88" width="332" height="150" rx="12" fill="#101319" stroke="#5eead4"/>
<text x="28" y="116" fill="#5eead4" font-size="10.5" font-weight="700">BRIQUES SOUS CONTRÔLE PUBLIC DOCUMENTÉ</text>
<circle cx="31" cy="138" r="3" fill="#5eead4"/><text x="42" y="142" fill="#f5f6f8" font-size="9.5">Cloud PI du ministère : hébergement</text>
<circle cx="31" cy="168" r="3" fill="#5eead4"/><text x="42" y="172" fill="#f5f6f8" font-size="9.5">DNUM / SIGNHOR : cachet électronique</text>
<circle cx="31" cy="198" r="3" fill="#5eead4"/><text x="42" y="202" fill="#f5f6f8" font-size="9.5">HSM qualifiés ANSSI : clés de signature</text>
<path d="M180 238 V264" stroke="#5eead4" stroke-width="2"/>
<path d="M174 256 L180 266 L186 256" fill="#5eead4"/>
<rect x="14" y="266" width="332" height="150" rx="12" fill="#101319" stroke="#7aa2f7"/>
<text x="28" y="294" fill="#7aa2f7" font-size="10.5" font-weight="700">BRIQUES ATTRIBUÉES PAR MARCHÉS</text>
<circle cx="31" cy="316" r="3" fill="#7aa2f7"/><text x="42" y="320" fill="#f5f6f8" font-size="9.5">Applications mobiles et serveur</text>
<circle cx="31" cy="346" r="3" fill="#7aa2f7"/><text x="42" y="350" fill="#f5f6f8" font-size="9.5">Sécurité, expertise, pilotage</text>
<circle cx="31" cy="376" r="3" fill="#7aa2f7"/><text x="42" y="380" fill="#f5f6f8" font-size="9.5">Tests et interopérabilité multi-acteurs</text>
<path d="M180 416 V442" stroke="#7aa2f7" stroke-width="2"/>
<path d="M174 434 L180 444 L186 434" fill="#7aa2f7"/>
<rect x="14" y="444" width="332" height="150" rx="12" fill="#101319" stroke="#ff85ad"/>
<text x="28" y="472" fill="#ff85ad" font-size="10.5" font-weight="700">CAPACITÉS NON CARTOGRAPHIÉES PUBLIQUEMENT</text>
<circle cx="31" cy="494" r="3" fill="#ff85ad"/><text x="42" y="498" fill="#f5f6f8" font-size="9.5">Dépôts de code et chaîne de compilation</text>
<circle cx="31" cy="524" r="3" fill="#ff85ad"/><text x="42" y="528" fill="#f5f6f8" font-size="9.5">Comptes Apple / Google et secrets de déploiement</text>
<circle cx="31" cy="554" r="3" fill="#ff85ad"/><text x="42" y="558" fill="#f5f6f8" font-size="9.5">Test de réversibilité, RTO, RPO et responsabilités</text>
<rect x="14" y="614" width="332" height="72" rx="10" fill="#15171b" stroke="#3a4049"/>
<text x="28" y="640" fill="#f5b13d" font-size="9.5" font-weight="700">Propriété juridique : pas encore preuve de reprise.</text>
<text x="28" y="664" fill="#aeb4bf" font-size="9">Test l0g : savoir, auditer, exploiter, réparer, remplacer.</text>
<text x="18" y="704" fill="#6f7580" font-size="8">Sources : France Identité, politique de signature, JOUE, DECP.</text>
</svg>
<figcaption>La carte distingue les fonctions documentées des capacités que les pièces publiques ne permettent pas encore de vérifier.</figcaption>
</figure>

Cette carte empêche une caricature. Les entreprises attributaires ne détiennent pas nécessairement les données, les clés de signature et l’hébergement. Inversement, posséder l’infrastructure ne suffit pas à prouver que l’État peut exploiter seul les applications qui y tournent.

Un serveur public peut dépendre d’un déploiement que seul le titulaire sait produire. Une clé étatique peut rester inutilisable si le service qui prépare la requête est en panne. Une clause de propriété intellectuelle peut appartenir à l’ANTS tandis que les dépôts Git, les chaînes CI/CD, les comptes de publication et l’expertise quotidienne restent distribués.

## La souveraineté se mesure le jour du remplacement

Les conditions générales indiquent que les droits de propriété intellectuelle liés au SGIN et à l’application restent la propriété de l’ANTS. C’est une protection importante. [La clause figure dans les CGU actuelles](https://france-identite.gouv.fr/conditions-generales-utilisation/cgu-sgin/).

La propriété juridique ne répond cependant pas à toutes les questions opérationnelles.

Pour reprendre une application, il faut au minimum :

```text
Le code source complet et son historique
L’inventaire des dépendances et des licences
Les scripts de compilation
La chaîne de tests
Les images de déploiement
Les comptes techniques
Les certificats et secrets nécessaires
La documentation d’architecture
Les procédures d’incident
Les compétences pour comprendre l’ensemble
```

Le test de souveraineté peut être formulé en huit verbes :

```text
Savoir
Décider
Auditer
Compiler
Exploiter
Réparer
Remplacer
Répondre financièrement
```

Un marché réversible sur le papier n’est pas encore une reprise testée. Une documentation livrée n’est pas nécessairement à jour. Un dépôt accessible ne garantit pas que l’État puisse produire un binaire identique à celui installé sur des millions de téléphones.

La preuve décisive serait un exercice où une équipe différente reprend le code, reconstruit l’application, déploie un backend vierge et restaure le service dans le délai contractuel. Aucun résultat public de ce type n’a été retrouvé dans les documents consultés.

## D’Atos à BAM : le passage du code doit laisser des traces

Les rapports officiels de certification CSPN de 2023 identifient **Atos France** comme développeur de France Identité Android 1.2.4 et iOS 1.2.3. Le ministère de l’Intérieur était commanditaire et AMOSSYS centre d’évaluation. Les certificats couvraient les composants mobiles participant à l’utilisation de l’application comme moyen d’identification électronique de niveau élevé. Ils ne certifiaient pas indistinctement tout le backend et toute l’exploitation. [Le rapport Android](https://messervices.cyber.gouv.fr/visas/ANSSI-CSPN-2023-22-rapport.pdf) et [le rapport iOS](https://messervices.cyber.gouv.fr/visas/ANSSI-CSPN-2023-21-rapport.pdf) sont publiés par l’ANSSI.

Le lot mobile notifié en mai 2025 est attribué à **BAM**.

Ces deux faits établissent une transition de titulaire. Ils ne disent pas :

- si Atos intervient encore sur une brique ;
- si BAM a repris l’intégralité du code ;
- quelle version a été la première produite sous sa responsabilité ;
- qui contrôle la chaîne de compilation ;
- qui possède les comptes Apple Developer et Google Play Console ;
- si une nouvelle évaluation a accompagné le changement ;
- si France Titres a testé la reconstruction sans l’équipe historique.

Le changement de fournisseur n’est pas un problème. Il est même le moment où la réversibilité peut être démontrée.

La documentation attendue est classique : procès-verbal de transfert, inventaire des dépendances, remise des dépôts, tickets ouverts, vulnérabilités connues, licences, procédures de déploiement et validation de la première version reprise.

## Le backend revendiqué et le backend attribué

iDAKTO se présente comme partenaire technologique de France Identité. Dans son étude de cas, l’entreprise affirme avoir conçu le SDK de lecture de la carte d’identité et le système de gestion backend. Elle décrit aussi le portefeuille comme fourni par sa technologie. [Il s’agit d’une communication de l’entreprise elle-même](https://www.idakto.com/case-studies/france-identite/), pas d’une cartographie contractuelle indépendante.

Le lot 6 de 2025, consacré au développement et à la maintenance des applications serveur, est attribué à **IN Smart Identity France**.

Plusieurs architectures sont possibles :

1. iDAKTO fournit toujours un composant intégré par le titulaire du lot 6 ;
2. iDAKTO intervient comme sous-traitant ;
3. un backend historique cohabite avec une nouvelle couche ;
4. certaines briques ont été cédées ou réécrites ;
5. la communication commerciale décrit surtout une phase antérieure.

Aucune de ces hypothèses ne peut être retenue comme un fait sans les contrats et l’architecture actuelle.

Une nuance évite d’opposer trop rapidement « État » et « entreprise privée ». Le registre national des entreprises, restitué par Pappers, indique que l’Imprimerie Nationale préside IN Smart Identity France. Le ministère de l’Économie qualifie par ailleurs IN Groupe d’entreprise détenue à 100 % par l’État dans son communiqué annonçant la finalisation du rachat d’IDEMIA Smart Identity. [Le communiqué officiel date du 1er juillet 2025](https://presse.economie.gouv.fr/creation-dun-champion-mondial-de-lidentite-letat-soutient-le-rachat-par-in-groupe-didemia-smart-identity/).

Le lot serveur est donc porté par une société juridiquement distincte intégrée à un groupe industriel public. Cela réduit la pertinence d’un récit binaire sur une privatisation complète. Cela ne résout pas la question de la maîtrise concrète : code, licences, équipes, secrets, sous-traitants et capacité de remplacement doivent toujours être cartographiés.

## Le rachat de Stelau crée une question de séparation des rôles

Stelau Conseil est recensé comme titulaire du lot 3 d’expertise en systèmes d’information.

Le 16 juin 2026, iDAKTO a annoncé l’acquisition de Stelau. Le communiqué présente le rapprochement entre les plateformes d’identité d’iDAKTO et les activités de Stelau en conseil, évaluation de sécurité, conformité et cybersécurité. [Le communiqué de l’acquéreur date et décrit l’opération](https://www.idakto.com/blog/idakto-accelerates-its-growth-with-the-acquisition-of-stelau-specialist-in-cybersecurity-for-digital-identity-infrastructure/).

Le rapprochement ne prouve aucun conflit d’intérêts.

Il justifie des questions de gouvernance :

- le lot 3 examine-t-il des composants fournis ou revendiqués par iDAKTO ?
- quelles missions exigent un déport ?
- les équipes, dirigeants et outils sont-ils séparés ?
- France Titres a-t-il été informé du changement de contrôle ?
- le contrat prévoit-il une autorisation ou un réexamen ?
- un autre acteur valide-t-il les travaux lorsque le groupe est concerné ?

L’avis de marché avait prévu des incompatibilités entre certains lots. Une acquisition postérieure peut modifier l’équilibre économique sans changer le nom du titulaire inscrit dans les données initiales. Le contrôle de ces changements fait partie de la souveraineté contractuelle.

## Le code ouvert reste annoncé pour plus tard

La page officielle de sécurité indique encore que le code source de l’application mobile sera « prochainement » publié en open source. [La formulation est toujours en ligne au 28 août 2026](https://france-identite.gouv.fr/securite-application/).

Le cadre européen ajoute une obligation précise pour le futur portefeuille EUDI. Le règlement 2024/1183 prévoit que le code source des composants logiciels applicatifs soit placé sous licence open source. Des exceptions peuvent concerner certains composants spécifiques non installés sur l’appareil, lorsqu’elles sont justifiées. [Le texte se trouve dans l’article 5 bis du règlement](https://eur-lex.europa.eu/eli/reg/2024/1183/oj/fra).

Cela ne permet pas d’affirmer que France Identité viole déjà cette obligation. L’application actuelle n’est pas encore l’intégralité du portefeuille européen et le calendrier de mise en œuvre continue d’avancer.

La promesse doit néanmoins devenir vérifiable :

- date de publication ;
- périmètre iOS et Android ;
- historique Git ;
- dépendances et sous-modules ;
- SDK NFC ;
- instructions de compilation ;
- licence ;
- composants exclus ;
- correspondance entre le code public et les binaires distribués.

Un dépôt incomplet publié après chaque version n’offrirait qu’une transparence partielle. Des builds reproductibles permettraient d’aller plus loin : vérifier qu’un binaire compilé à partir du code publié correspond à celui proposé dans les stores.

## Qui tient quoi ?

<div class="instrument-plate" style="padding:1.1rem;--plate-accent:#5eead4">
<p class="mono-label" style="margin:0;color:#5eead4">OUTIL L0G // QUI TIENT QUOI ?</p>
<p style="margin:.65rem 0 1rem;color:#d6d9df">Ouvrez un scénario. Chaque fiche sépare le composant documenté, la conséquence économique possible, le mode dégradé connu et l’information encore absente.</p>
<details style="border:1px solid #2b3038;border-radius:10px;background:#101319;margin:.75rem 0;padding:.85rem 1rem">
<summary style="cursor:pointer;color:#f5f6f8;font-weight:700">L’application mobile ne démarre plus</summary>
<div style="margin-top:.85rem;color:#d6d9df">
<p style="margin:.55rem 0"><strong>Documenté :</strong> le lot 5 couvre le développement et la maintenance des applications mobiles. BAM est recensé comme titulaire depuis mai 2025. Les versions certifiées en 2023 avaient Atos France pour développeur.</p>
<p style="margin:.55rem 0"><strong>Risque financier :</strong> impossibilité d’utiliser FranceConnect+ ou une preuve mobile pour une formation, une aide ou une formalité urgente.</p>
<p style="margin:.55rem 0"><strong>Mode dégradé :</strong> il dépend du service final. Le deuxième volet a montré des alternatives par courrier, certificat externe ou déplacement.</p>
<p style="margin:.55rem 0"><strong>Inconnu :</strong> délai contractuel de correction, capacité de compilation par l’État, compte de publication des stores et procédure de reprise par un autre titulaire.</p>
</div></details>
<details style="border:1px solid #2b3038;border-radius:10px;background:#101319;margin:.75rem 0;padding:.85rem 1rem">
<summary style="cursor:pointer;color:#f5f6f8;font-weight:700">Le backend SGIN devient indisponible</summary>
<div style="margin-top:.85rem;color:#d6d9df">
<p style="margin:.55rem 0"><strong>Documenté :</strong> le lot 6 couvre les applications serveur. Les serveurs sont annoncés sur le cloud PI du ministère de l’Intérieur.</p>
<p style="margin:.55rem 0"><strong>Risque financier :</strong> authentifications ou attestations impossibles, avec propagation vers plusieurs services utilisant la même identité.</p>
<p style="margin:.55rem 0"><strong>Mode dégradé :</strong> aucune matrice publique ne précise quels usages restent disponibles hors ligne ou sans backend pour chaque service.</p>
<p style="margin:.55rem 0"><strong>Inconnu :</strong> RTO, RPO, tests de bascule, accès de France Titres aux dépôts, images de déploiement et secrets nécessaires à la reprise.</p>
</div></details>
<details style="border:1px solid #2b3038;border-radius:10px;background:#101319;margin:.75rem 0;padding:.85rem 1rem">
<summary style="cursor:pointer;color:#f5f6f8;font-weight:700">Le cachet électronique de l’État est indisponible</summary>
<div style="margin-top:.85rem;color:#d6d9df">
<p style="margin:.55rem 0"><strong>Documenté :</strong> la DNUM fournit SIGNHOR. Les clés sont protégées dans des HSM qualifiés par l’ANSSI et seul SGIN peut solliciter le cachet dans ce cadre.</p>
<p style="margin:.55rem 0"><strong>Risque financier :</strong> impossibilité de générer certains justificatifs signés demandés pour une location, un contrat ou une procédure.</p>
<p style="margin:.55rem 0"><strong>Mode dégradé :</strong> le tiers peut parfois accepter un autre document, mais cela dépend de sa politique et du droit applicable.</p>
<p style="margin:.55rem 0"><strong>Inconnu :</strong> redondance du service de signature, délai de restauration et responsabilité lorsque le document arrive après une échéance.</p>
</div></details>
<details style="border:1px solid #2b3038;border-radius:10px;background:#101319;margin:.75rem 0;padding:.85rem 1rem">
<summary style="cursor:pointer;color:#f5f6f8;font-weight:700">Un prestataire disparaît ou change de contrôle</summary>
<div style="margin-top:.85rem;color:#d6d9df">
<p style="margin:.55rem 0"><strong>Documenté :</strong> les lots sont distincts et comportent des incompatibilités d’attribution. iDAKTO a annoncé l’acquisition de Stelau en juin 2026.</p>
<p style="margin:.55rem 0"><strong>Risque financier :</strong> perte d’expertise, ralentissement des correctifs, coût de transition ou dépendance à un composant propriétaire.</p>
<p style="margin:.55rem 0"><strong>Mode dégradé :</strong> des clauses contractuelles peuvent organiser la continuité et la réversibilité. Les accords signés nécessaires pour établir si, comment et dans quels délais elles s’appliquent ne sont pas publiés ici.</p>
<p style="margin:.55rem 0"><strong>Inconnu :</strong> notifications de changement de contrôle, clauses de déport, séquestre du code, test de réversibilité et durée d’assistance en sortie.</p>
</div></details>
<details style="border:1px solid #2b3038;border-radius:10px;background:#101319;margin:.75rem 0;padding:.85rem 1rem">
<summary style="cursor:pointer;color:#f5f6f8;font-weight:700">Une identité est révoquée ou refusée par erreur</summary>
<div style="margin-top:.85rem;color:#d6d9df">
<p style="margin:.55rem 0"><strong>Documenté :</strong> France Identité peut conditionner l’accès à FranceConnect+ et à des démarches sensibles. Les CGU prévoient une procédure de support et de réclamation.</p>
<p style="margin:.55rem 0"><strong>Risque financier :</strong> aide retardée, place de formation perdue, signature d’entreprise impossible ou contrat manqué.</p>
<p style="margin:.55rem 0"><strong>Mode dégradé :</strong> il n’existe pas de recours unique publié pour tous les services raccordés. Chaque opérateur conserve ses propres procédures.</p>
<p style="margin:.55rem 0"><strong>Inconnu :</strong> délai de correction, préservation rétroactive des droits et articulation entre France Titres, le service final et le prestataire techniquement fautif.</p>
</div></details>
<p style="margin:1rem 0 0;color:#8b909b;font-size:.85rem">Cet outil ne prédit pas une panne. Il transforme la chaîne technique en questions de continuité, de responsabilité et de perte financière.</p></div>

## Le risque opérationnel devient financier

France Identité ne contient ni compte bancaire ni solde monétaire. L’application ne donne pas à elle seule le pouvoir de saisir ou de geler l’argent d’un citoyen.

Le risque financier apparaît par dépendance fonctionnelle.

Le deuxième volet a documenté des services où FranceConnect+ accélère l’accès à une formation, une aide ou une formalité d’entreprise. La certification France Identité est présentée comme un moyen d’accéder à [Mon Compte Formation, MaPrimeRénov’ et l’INPI](https://france-identite.gouv.fr/identite-numerique-certifiee/). Si l’identité ne fonctionne plus, le citoyen peut être renvoyé vers un parcours plus lent, un courrier, un certificat extérieur ou un déplacement.

Une défaillance commune peut donc produire des blocages corrélés, même si les services finaux restent juridiquement et techniquement distincts.

<figure class="infographic infographic-readable" style="padding-bottom:1.5rem" tabindex="0" aria-label="QUAND L’IDENTITÉ CASSE, LE RISQUE SE PROPAGE">
<svg viewBox="0 0 360 790" width="100%" role="img" aria-labelledby="failure-fr-title failure-fr-desc" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;height:auto;overflow:hidden;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;background:#0c0d10">
<title id="failure-fr-title">QUAND L’IDENTITÉ CASSE, LE RISQUE SE PROPAGE</title>
<desc id="failure-fr-desc">Un incident technique peut devenir une perte économique</desc>
<rect x="1" y="1" width="358" height="788" rx="16" fill="#0c0d10" stroke="#2b3038"/>
<text x="18" y="42" fill="#f5f6f8" font-size="11.5" font-weight="700">QUAND L’IDENTITÉ CASSE, LE RISQUE SE PROPAGE</text>
<text x="18" y="64" fill="#8b909b" font-size="8.5">Un incident technique peut devenir une perte économique</text>
<rect x="24" y="92" width="312" height="78" rx="11" fill="#101319" stroke="#7aa2f7"/>
<text x="40" y="119" fill="#7aa2f7" font-size="10.5" font-weight="700">COMPOSANT</text>
<text x="40" y="144" fill="#f5f6f8" font-size="9.5">Application, backend, clé ou certificat</text><path d="M180 170 V192" stroke="#7aa2f7" stroke-width="2"/><path d="M174 184 L180 194 L186 184" fill="#7aa2f7"/>
<rect x="24" y="196" width="312" height="78" rx="11" fill="#101319" stroke="#a78bfa"/>
<text x="40" y="223" fill="#a78bfa" font-size="10.5" font-weight="700">PREUVE D’IDENTITÉ</text>
<text x="40" y="248" fill="#f5f6f8" font-size="9.5">Authentification ou attestation refusée</text><path d="M180 274 V296" stroke="#a78bfa" stroke-width="2"/><path d="M174 288 L180 298 L186 288" fill="#a78bfa"/>
<rect x="24" y="300" width="312" height="78" rx="11" fill="#101319" stroke="#f5b13d"/>
<text x="40" y="327" fill="#f5b13d" font-size="10.5" font-weight="700">SERVICE</text>
<text x="40" y="352" fill="#f5f6f8" font-size="9.5">FranceConnect+, aide ou formalité bloquée</text><path d="M180 378 V400" stroke="#f5b13d" stroke-width="2"/><path d="M174 392 L180 402 L186 392" fill="#f5b13d"/>
<rect x="24" y="404" width="312" height="78" rx="11" fill="#101319" stroke="#ff85ad"/>
<text x="40" y="431" fill="#ff85ad" font-size="10.5" font-weight="700">OPÉRATION</text>
<text x="40" y="456" fill="#f5f6f8" font-size="9.5">Formation, subvention, contrat ou signature</text><path d="M180 482 V504" stroke="#ff85ad" stroke-width="2"/><path d="M174 496 L180 506 L186 496" fill="#ff85ad"/>
<rect x="24" y="508" width="312" height="78" rx="11" fill="#101319" stroke="#ff4d87"/>
<text x="40" y="535" fill="#ff4d87" font-size="10.5" font-weight="700">PERTE</text>
<text x="40" y="560" fill="#f5f6f8" font-size="9.5">Retard, échéance manquée ou coût supplémentaire</text><path d="M180 586 V608" stroke="#ff4d87" stroke-width="2"/><path d="M174 600 L180 610 L186 600" fill="#ff4d87"/>
<rect x="24" y="612" width="312" height="78" rx="11" fill="#101319" stroke="#5eead4"/>
<text x="40" y="639" fill="#5eead4" font-size="10.5" font-weight="700">RESPONSABILITÉ</text>
<text x="40" y="664" fill="#f5f6f8" font-size="9.5">Qui corrige, rembourse et indemnise ?</text>
<rect x="14" y="718" width="332" height="54" rx="9" fill="#15171b" stroke="#3a4049"/>
<text x="28" y="741" fill="#aeb4bf" font-size="8.5">Chaîne de risque, pas incident déjà établi.</text>
<text x="28" y="759" fill="#6f7580" font-size="8">Analyse l0g à partir des usages FranceConnect+ et des CGU.</text>
</svg>
<figcaption>Le risque financier ne vient pas d’un compte bancaire contenu dans France Identité. Il vient de la dépendance d’opérations économiques à une identité valide.</figcaption>
</figure>

Le scénario ne prédit pas une panne nationale. Il impose une discipline d’analyse :

```text
Composant défaillant
→ identité indisponible ou refusée
→ service économique inaccessible
→ délai ou échéance
→ perte mesurable
→ responsabilité à attribuer
```

La donnée la plus importante ne sera pas seulement le taux de disponibilité de France Identité. Il faudra connaître :

- le délai maximal de prise en charge d’un incident critique ;
- le délai de remise en service, ou RTO ;
- la perte de données maximale admise, ou RPO ;
- le temps moyen de réparation ;
- le nombre d’opérations finales affectées ;
- la capacité à préserver rétroactivement les droits ;
- le mécanisme d’indemnisation.

## Les CGU limitent la responsabilité affichée

Les conditions générales promettent une disponibilité « dans la mesure du possible » vingt-quatre heures sur vingt-quatre et sept jours sur sept. Elles permettent des opérations de test, de maintenance et d’intervention en cas de panne ou d’alerte et excluent la responsabilité sur leurs conséquences directes ou indirectes.

La section consacrée à la responsabilité indique que France Identité ne garantit pas l’absence d’erreur. Elle qualifie notamment les préjudices financiers, commerciaux, les pertes de clientèle, de bénéfice ou d’image de préjudices indirects, exclus de la responsabilité déclarée. Elle écarte aussi la responsabilité sur la continuité, la pérennité, la compatibilité, la performance et les bogues. [Ces formulations figurent dans les CGU actuelles](https://france-identite.gouv.fr/conditions-generales-utilisation/cgu-sgin/).

Le même document contient une clause importante : France Identité peut sous-traiter tout ou partie des prestations à la société de son choix, mais reste **seule responsable envers l’usager**, à charge pour elle de se retourner ensuite contre ses sous-traitants.

Les CGU ne permettent pas de conclure que toute indemnisation est juridiquement impossible. Leur portée dépend du droit administratif, du droit national de la responsabilité, du RGPD, du règlement eIDAS, de la faute éventuelle et du service final concerné.

Le règlement eIDAS organise déjà une responsabilité du régime d’identification dans certaines transactions transfrontalières lorsque des dommages résultent intentionnellement ou par négligence d’un manquement. Le nouveau cadre applique les règles de responsabilité correspondantes aux portefeuilles EUDI. [Le texte consolidé permet de lire l’article 11 et le renvoi opéré par l’article 5 bis](https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:02014R0910-20241018).

La question pratique reste entière pour un citoyen :

> Une erreur d’identité fait perdre une place de formation, retarde une subvention ou bloque une cessation d’entreprise. Doit-il agir contre France Titres, le service final, l’opérateur d’authentification ou le prestataire fautif ?

La clause de sous-traitance apporte un début de réponse : l’usager n’a pas à identifier lui-même chaque fournisseur pour saisir France Identité. Elle ne publie toutefois ni barème, ni délai d’indemnisation, ni mécanisme unique de réparation des pertes économiques.

## Les pièces qui manquent

La collecte publique fournit les noms, les fonctions et les plafonds. Elle ne mesure pas la capacité de reprise.

l0g demande la communication, sous occultation des secrets de sécurité nécessaires, des documents suivants :

### Pour chaque lot

- acte d’engagement ;
- cahier des clauses administratives ;
- cahier technique ;
- avenants ;
- bons de commande ;
- factures et montants payés ;
- déclarations de sous-traitance ;
- procès-verbaux de réception ;
- pénalités prononcées.

### Pour la réversibilité

- clauses de propriété intellectuelle détaillées ;
- inventaire des composants propriétaires ;
- état des licences tierces ;
- dépôt ou séquestre du code ;
- plan de réversibilité ;
- procès-verbal d’un test de reprise ;
- transition Atos vers BAM ;
- matrice des comptes et secrets ;
- durée d’assistance après la fin du contrat.

### Pour la continuité

- RTO et RPO contractuels ;
- plan de continuité ;
- plan de reprise ;
- résultats des restaurations ;
- exercices de crise multi-prestataires ;
- modes dégradés par usage ;
- plafonds d’assurance et de responsabilité.

Ces pièces ne doivent pas révéler des vulnérabilités, des secrets ou des chemins d’administration. Les objectifs de reprise, les responsabilités, les montants payés et la preuve qu’un test de réversibilité a réussi peuvent être publiés sans exposer le système.

## Méthodologie l0g

Cet article repose sur cinq couches documentaires :

1. le rapport budgétaire du Sénat pour le coût du programme et l’externalisation de France Titres ;
2. l’avis JOUE pour les fonctions, plafonds, durées et incompatibilités entre lots ;
3. les données essentielles de la commande publique pour les attributaires et dates de notification ;
4. les pages et politiques de France Identité pour l’hébergement, la signature, la propriété intellectuelle et la responsabilité ;
5. les rapports officiels de certification ANSSI et les communications d’entreprises pour reconstituer les fournisseurs historiques et leurs propres revendications.

La méthode sépare systématiquement :

```text
ÉTABLI
Document officiel, texte ou donnée publique

DÉCLARÉ
Affirmation de France Identité ou d’un fournisseur

DÉDUIT
Conséquence logique explicitement attribuée à l’analyse l0g

INCONNU
Information absente des documents consultés

À TESTER
Réversibilité, reprise ou fonctionnement à vérifier
```

L’article ne transforme pas :

- un plafond en dépense ;
- un taux d’externalisation de l’agence en taux propre à France Identité ;
- une communication commerciale en architecture officielle ;
- une acquisition en conflit d’intérêts ;
- une clause de propriété intellectuelle en preuve de compétence opérationnelle ;
- une certification d’une version mobile en certification de toute l’infrastructure ;
- une clause de CGU en décision définitive sur le droit à indemnisation.

Les questionnaires contradictoires doivent être adressés à France Titres, à la DNUM, à l’ANSSI et aux titulaires. Toute réponse reçue devra être intégrée avec sa date, son périmètre et les pièces qui la soutiennent.

## Sources documentaires

Sources institutionnelles et données publiques :

- [Rapport budgétaire du Sénat pour 2026 sur France Titres](https://www.senat.fr/rap/l25-139-32/l25-139-32_mono.html)
- [Avis JOUE 58709-2025 sur les sept accords-cadres SGIN](https://ted.europa.eu/fr/notice/-/detail/58709-2025)
- [Jeu officiel des données essentielles de la commande publique](https://www.data.gouv.fr/datasets/donnees-essentielles-de-la-commande-publique-decp-arrete-du-22-12-2022-marches)
- [Page de sécurité de France Identité](https://france-identite.gouv.fr/securite-application/)
- [Politique de signature de France Identité](https://france-identite.gouv.fr/politique-de-signature/)
- [Conditions générales d’utilisation du SGIN](https://france-identite.gouv.fr/conditions-generales-utilisation/cgu-sgin/)
- [Rapport CSPN ANSSI de France Identité Android 1.2.4](https://messervices.cyber.gouv.fr/visas/ANSSI-CSPN-2023-22-rapport.pdf)
- [Rapport CSPN ANSSI de France Identité iOS 1.2.3](https://messervices.cyber.gouv.fr/visas/ANSSI-CSPN-2023-21-rapport.pdf)
- [Communiqué du ministère de l’Économie sur le rachat d’IDEMIA Smart Identity par IN Groupe](https://presse.economie.gouv.fr/creation-dun-champion-mondial-de-lidentite-letat-soutient-le-rachat-par-in-groupe-didemia-smart-identity/)
- [Règlement européen 2024/1183 sur le portefeuille européen d’identité numérique](https://eur-lex.europa.eu/eli/reg/2024/1183/oj/fra)
- [Règlement eIDAS consolidé au 18 octobre 2024](https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:02014R0910-20241018)

Déclarations des entreprises, utilisées uniquement pour attribuer leurs propres affirmations :

- [Étude de cas iDAKTO sur France Identité](https://www.idakto.com/case-studies/france-identite/)
- [Annonce par iDAKTO de l’acquisition de Stelau](https://www.idakto.com/blog/idakto-accelerates-its-growth-with-the-acquisition-of-stelau-specialist-in-cybersecurity-for-digital-identity-infrastructure/)

## Les preuves attendues d’une souveraineté opérationnelle

France Identité combine des éléments solides de maîtrise publique et une chaîne contractuelle étendue.

L’État annonce héberger les serveurs. Il conserve le cachet électronique, l’horodatage et les clés de signature. L’ANTS revendique la propriété intellectuelle du service. L’allotissement limite la concentration entre plusieurs fournisseurs.

Dans le même temps, sept accords-cadres couvrent le pilotage, l’expertise, la sécurité, le mobile, le backend et les tests. Le Sénat décrit une externalisation très élevée à l’échelle de France Titres. Les transitions de fournisseurs, les plans de reprise, les comptes de déploiement, les résultats de réversibilité et le partage financier des responsabilités ne sont pas réunis dans une documentation publique vérifiable.

La conclusion ne peut donc pas être que l’État a perdu le contrôle. Les preuves publiques ne permettent pas davantage d’établir qu’il pourrait reprendre seul chaque composant dans un délai connu.

La souveraineté réelle se mesure le jour où un fournisseur ne répond plus.

> **L’État a-t-il acheté des compétences qu’il peut reprendre, ou une dépendance qu’il ne découvrira qu’au premier incident majeur ?**

Et pour l’usager :

> **Quand la chaîne contractuelle casse et que l’identité ne permet plus d’accéder à une aide, une signature ou une formalité, qui supporte la perte ?**

## Limites et mise à jour

Vérification documentaire arrêtée au **28 août 2026**.

l0g n’a pas eu accès aux contrats signés, aux bons de commande, aux dépôts de code, aux chaînes de compilation, aux secrets, aux tableaux de service ni aux plans de reprise de production. Aucun test de panne, de bascule ou de réversibilité n’a été conduit pour cet article. Les montants payés, les sous-traitants effectifs, les objectifs RTO/RPO et les mécanismes d’indemnisation restent à obtenir contradictoirement.
