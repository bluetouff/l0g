---
title: "Plus vous empruntez, plus l’indice vous achète ?"
seoTitle: "Indices obligataires : emprunter plus augmente-t-il le poids ? | l0g"
description: "Les grands indices obligataires pondèrent la dette éligible par sa valeur de marché. Équation, cas LQD, plafond de 3 % et limites d’une mécanique souvent résumée trop vite."
pubDate: 2026-08-11T10:00:00+02:00
updatedDate: 2026-08-11T10:00:00+02:00
tags: ["marchés", "obligations", "ETF", "indices", "crédit", "gestion passive"]
draft: false
---

Un indice actions donne généralement plus de poids aux entreprises qui valent le plus cher en Bourse. Un indice obligataire pondéré par valeur de marché suit une autre grandeur : **la valeur de la dette éligible encore en circulation**. À prix égal, un émetteur qui place davantage d’obligations peut donc prendre davantage de place dans le benchmark.

La formule alimente une critique séduisante : plus une entreprise emprunte, plus les fonds indiciels doivent l’acheter. Elle contient une part de vérité, mais seulement après trois corrections. L’indice ne retient pas toute la dette. Il peut plafonner chaque émetteur. Enfin, un ETF obligataire ne réplique pas nécessairement chaque ligne au centime près.

Le bon angle n’est donc ni celui d’une machine qui récompense aveuglément l’endettement, ni celui d’un benchmark parfaitement neutre. **Un indice obligataire transforme un stock de dette filtré en portefeuille de référence.** Comprendre les filtres permet de voir où le biais existe, où il s’arrête et comment il atteint réellement les marchés.

## L’équation cachée sous le benchmark

La [méthodologie obligataire de Bloomberg](https://assets.bbhub.io/professional/sites/10/Bloomberg-Index-Publications-Fixed-Income-Index-Methodology.pdf), mise à jour le 8 janvier 2026, définit la valeur de marché d’une obligation ainsi :

**valeur de marché = (prix + intérêt couru) × montant nominal encore en circulation**

Le poids d’un titre correspond ensuite à sa valeur de marché divisée par la valeur de marché totale des obligations éligibles. La logique ne cherche pas à identifier la meilleure entreprise. Elle mesure la taille du papier disponible dans l’univers retenu, avec l’objectif de construire un indice que des investisseurs peuvent effectivement répliquer.

L’échelle donne la mesure du sujet. Les comptes financiers de la Réserve fédérale recensent **7 510,893 milliards de dollars d’obligations** au passif des entreprises non financières américaines au premier trimestre 2026, contre 7 393,445 milliards au trimestre précédent. Ces montants décrivent tout le secteur non financier dans le tableau Z.1, pas le seul univers éligible à un indice investment grade. ([Réserve fédérale via FRED](https://fred.stlouisfed.org/release/tables?eid=804211&rid=52))

Un petit indice fictif suffit à montrer la mécanique brute. Supposons trois émetteurs, des obligations toutes valorisées au pair et aucun plafond. A représente 20 unités de dette, B 10 et C 5. A pèse alors 57,1 % du total. S’il émet 5 unités supplémentaires qui deviennent éligibles, son poids passe à 62,5 %, sans que sa rentabilité, ses actifs ou sa gouvernance aient changé.

<figure class="infographic" style="margin:2rem 0 2.25rem">
<svg viewBox="0 0 760 520" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="debt-weight-title-fr debt-weight-desc-fr" style="width:100%;height:auto;display:block;background:#0b1120;border:1px solid #26324a;border-radius:16px;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
<title id="debt-weight-title-fr">Effet d’une émission sur le poids d’un émetteur dans un indice obligataire fictif</title>
<desc id="debt-weight-desc-fr">Dans un indice fictif sans plafond, l’émetteur A passe de 20 à 25 unités de dette. Son poids progresse de 57,1 à 62,5 pour cent, tandis que B et C sont dilués.</desc>
<style>.mobile{display:none}@media (max-width:640px){.desktop{display:none}.mobile{display:block}}</style>
<g class="desktop">
  <text x="40" y="50" fill="#f8fafc" font-size="24" font-weight="700">Une émission déplace les poids</text>
  <text x="40" y="78" fill="#94a3b8" font-size="13">Exemple fictif, prix au pair, indice sans plafond</text>
  <text x="40" y="128" fill="#cbd5e1" font-size="14" font-weight="700">AVANT</text><text x="430" y="128" fill="#cbd5e1" font-size="14" font-weight="700">APRÈS : A ÉMET 5</text>
  <rect x="40" y="155" width="297" height="48" rx="7" fill="#3b82f6"/><text x="55" y="185" fill="#f8fafc" font-size="15" font-weight="700">A · 57,1 %</text>
  <rect x="40" y="215" width="149" height="48" rx="7" fill="#14b8a6"/><text x="55" y="245" fill="#042f2e" font-size="15" font-weight="700">B · 28,6 %</text>
  <rect x="40" y="275" width="74" height="48" rx="7" fill="#f59e0b"/><text x="124" y="305" fill="#fbbf24" font-size="15" font-weight="700">C · 14,3 %</text>
  <rect x="430" y="155" width="250" height="48" rx="7" fill="#60a5fa"/><text x="445" y="185" fill="#0b1120" font-size="15" font-weight="700">A · 62,5 %</text>
  <rect x="430" y="215" width="100" height="48" rx="7" fill="#14b8a6"/><text x="540" y="245" fill="#5eead4" font-size="15" font-weight="700">B · 25,0 %</text>
  <rect x="430" y="275" width="50" height="48" rx="7" fill="#f59e0b"/><text x="490" y="305" fill="#fbbf24" font-size="15" font-weight="700">C · 12,5 %</text>
  <path d="M355 239 H398" stroke="#f8fafc" stroke-width="2"/><polygon points="398,232 414,239 398,246" fill="#f8fafc"/>
  <rect x="40" y="365" width="680" height="72" rx="10" fill="#111c31" stroke="#334155"/>
  <text x="58" y="393" fill="#fbbf24" font-size="14" font-weight="700">A gagne 5,4 points de poids</text>
  <text x="58" y="417" fill="#cbd5e1" font-size="12">La hausse vient du montant éligible en circulation. Elle ne constitue pas un jugement de crédit.</text>
  <text x="40" y="482" fill="#64748b" font-size="11">Calcul l0g. Illustration pédagogique, aucune donnée de marché.</text>
</g>
<g class="mobile" transform="scale(2.17)">
  <text x="16" y="21" fill="#f8fafc" font-size="9.5" font-weight="700">Une émission déplace les poids</text>
  <text x="16" y="34" fill="#94a3b8" font-size="5.4">Exemple fictif, prix au pair, sans plafond</text>
  <text x="16" y="56" fill="#cbd5e1" font-size="6" font-weight="700">AVANT</text><text x="180" y="56" fill="#cbd5e1" font-size="6" font-weight="700">APRÈS</text>
  <rect x="16" y="66" width="137" height="17" rx="3" fill="#3b82f6"/><text x="22" y="77" fill="#f8fafc" font-size="5.8" font-weight="700">A · 57,1 %</text>
  <rect x="16" y="89" width="68.5" height="17" rx="3" fill="#14b8a6"/><text x="22" y="100" fill="#042f2e" font-size="5.8" font-weight="700">B · 28,6 %</text>
  <rect x="16" y="112" width="34" height="17" rx="3" fill="#f59e0b"/><text x="55" y="123" fill="#fbbf24" font-size="5.8" font-weight="700">C · 14,3 %</text>
  <rect x="180" y="66" width="115" height="17" rx="3" fill="#60a5fa"/><text x="186" y="77" fill="#0b1120" font-size="5.8" font-weight="700">A · 62,5 %</text>
  <rect x="180" y="89" width="46" height="17" rx="3" fill="#14b8a6"/><text x="231" y="100" fill="#5eead4" font-size="5.8" font-weight="700">B · 25 %</text>
  <rect x="180" y="112" width="23" height="17" rx="3" fill="#f59e0b"/><text x="208" y="123" fill="#fbbf24" font-size="5.8" font-weight="700">C · 12,5 %</text>
  <rect x="16" y="151" width="318" height="34" rx="4" fill="#111c31" stroke="#334155" stroke-width=".5"/>
  <text x="23" y="164" fill="#fbbf24" font-size="5.8" font-weight="700">A gagne 5,4 points de poids</text>
  <text x="23" y="176" fill="#cbd5e1" font-size="5">Montant éligible supérieur, sans jugement de crédit.</text>
  <text x="16" y="215" fill="#64748b" font-size="4.8">Calcul l0g. Illustration, aucune donnée de marché.</text>
</g>
</svg>
<figcaption style="margin-top:.65rem;color:#64748b;font-size:.82rem">Le calcul isole la pondération brute. Un véritable indice applique ensuite ses critères d’éligibilité et, selon sa méthodologie, un plafond par émetteur.</figcaption>
</figure>

Cette dilution est mécanique, mais elle n’est pas une prime gratuite. Une baisse du prix des obligations de A réduit leur valeur de marché. Un rachat de dette ou une arrivée à échéance réduit le nominal en circulation. Surtout, l’émission doit franchir les portes de l’indice.

## LQD : six portes avant la pondération

Le cas de LQD rend les règles concrètes. L’ETF iShares iBoxx Investment Grade Corporate Bond suit l’iBoxx USD Liquid Investment Grade Index. La [méthodologie S&P Dow Jones Indices de juillet 2026](https://www.spglobal.com/spdji/en/documents/methodologies/iBoxx_USD_Liquid_Investment_Grade_Index_Methodology.pdf) précise que l’indice est pondéré par valeur de marché, rééquilibré à la fin de chaque mois et plafonné à **3 % par émetteur**.

Une obligation candidate doit notamment :

- être libellée en dollars et relever du crédit d’entreprise ;
- offrir des flux déterminables à l’avance, avec plusieurs catégories de titres exclues ;
- avoir une notation moyenne [investment grade](/glossaire/investment-grade/), soit au moins BBB- ou Baa3 selon l’agence ;
- afficher au moins **750 millions de dollars** de nominal en circulation ;
- appartenir à un émetteur disposant d’au moins **2 milliards de dollars** de dette en dollars retenue dans l’univers large ;
- conserver au moins trois ans de vie attendue, et trois ans et demi pour une nouvelle entrée.

Les données de notation et d’encours sont arrêtées trois jours ouvrés avant le rééquilibrage. Les poids, puis le plafond, sont calculés avec les valeurs de marché de fin de mois. Une nouvelle émission connue trop tard attend le cycle suivant. ([S&P DJI, sections Bond Selection et Index Calculation](https://www.spglobal.com/spdji/en/documents/methodologies/iBoxx_USD_Liquid_Investment_Grade_Index_Methodology.pdf))

<figure class="infographic" style="margin:2rem 0 2.25rem">
<svg viewBox="0 0 760 600" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="index-gates-title-fr index-gates-desc-fr" style="width:100%;height:auto;display:block;background:#0b1120;border:1px solid #26324a;border-radius:16px;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
<title id="index-gates-title-fr">Les portes d’entrée de l’iBoxx USD Liquid Investment Grade Index</title>
<desc id="index-gates-desc-fr">Une obligation doit être une dette d’entreprise en dollars, de catégorie investissement, avec au moins 750 millions de dollars d’encours, un émetteur ayant au moins 2 milliards de dette éligible et une vie attendue suffisante. Elle est ensuite pondérée par valeur de marché avec un plafond de 3 pour cent par émetteur.</desc>
<style>.mobile{display:none}@media (max-width:640px){.desktop{display:none}.mobile{display:block}}</style>
<defs><marker id="gate-arrow-fr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#60a5fa"/></marker></defs>
<g class="desktop">
  <text x="40" y="50" fill="#f8fafc" font-size="24" font-weight="700">La dette doit devenir indexable</text>
  <text x="40" y="78" fill="#94a3b8" font-size="13">iBoxx USD Liquid Investment Grade, méthodologie de juillet 2026</text>
  <rect x="40" y="116" width="190" height="68" rx="9" fill="#172554" stroke="#3b82f6"/><text x="58" y="143" fill="#93c5fd" font-size="13" font-weight="700">1. Instrument</text><text x="58" y="165" fill="#e2e8f0" font-size="12">crédit d’entreprise en USD</text>
  <line x1="230" y1="150" x2="273" y2="150" stroke="#60a5fa" stroke-width="2" marker-end="url(#gate-arrow-fr)"/>
  <rect x="280" y="116" width="190" height="68" rx="9" fill="#172554" stroke="#3b82f6"/><text x="298" y="143" fill="#93c5fd" font-size="13" font-weight="700">2. Notation</text><text x="298" y="165" fill="#e2e8f0" font-size="12">BBB- / Baa3 ou mieux</text>
  <line x1="470" y1="150" x2="513" y2="150" stroke="#60a5fa" stroke-width="2" marker-end="url(#gate-arrow-fr)"/>
  <rect x="520" y="116" width="200" height="68" rx="9" fill="#172554" stroke="#3b82f6"/><text x="538" y="143" fill="#93c5fd" font-size="13" font-weight="700">3. Taille du titre</text><text x="538" y="165" fill="#e2e8f0" font-size="12">encours ≥ 750 M$</text>
  <line x1="620" y1="184" x2="620" y2="224" stroke="#60a5fa" stroke-width="2" marker-end="url(#gate-arrow-fr)"/>
  <rect x="520" y="232" width="200" height="68" rx="9" fill="#132b32" stroke="#14b8a6"/><text x="538" y="259" fill="#5eead4" font-size="13" font-weight="700">4. Taille émetteur</text><text x="538" y="281" fill="#e2e8f0" font-size="12">encours retenu ≥ 2 Md$</text>
  <line x1="520" y1="266" x2="477" y2="266" stroke="#60a5fa" stroke-width="2" marker-end="url(#gate-arrow-fr)"/>
  <rect x="280" y="232" width="190" height="68" rx="9" fill="#132b32" stroke="#14b8a6"/><text x="298" y="259" fill="#5eead4" font-size="13" font-weight="700">5. Maturité</text><text x="298" y="281" fill="#e2e8f0" font-size="12">3 ans, 3,5 ans à l’entrée</text>
  <line x1="280" y1="266" x2="237" y2="266" stroke="#60a5fa" stroke-width="2" marker-end="url(#gate-arrow-fr)"/>
  <rect x="40" y="232" width="190" height="68" rx="9" fill="#132b32" stroke="#14b8a6"/><text x="58" y="259" fill="#5eead4" font-size="13" font-weight="700">6. Calendrier</text><text x="58" y="281" fill="#e2e8f0" font-size="12">cut-off puis fin de mois</text>
  <line x1="135" y1="300" x2="135" y2="344" stroke="#60a5fa" stroke-width="2" marker-end="url(#gate-arrow-fr)"/>
  <rect x="40" y="352" width="680" height="92" rx="11" fill="#1e293b" stroke="#64748b"/>
  <text x="62" y="382" fill="#f8fafc" font-size="15" font-weight="700">Pondération : valeur de marché du titre / valeur de marché de l’univers</text>
  <text x="62" y="407" fill="#cbd5e1" font-size="12">Le prix, l’intérêt couru et le nominal en circulation déterminent le poids brut.</text>
  <text x="62" y="427" fill="#cbd5e1" font-size="12">Les poids d’un même émetteur sont ensuite plafonnés.</text>
  <rect x="225" y="476" width="310" height="58" rx="29" fill="#451a2a" stroke="#fb7185"/>
  <text x="380" y="511" fill="#fda4af" font-size="18" font-weight="700" text-anchor="middle">PLAFOND ÉMETTEUR : 3 %</text>
  <text x="40" y="570" fill="#64748b" font-size="11">Source : S&amp;P Dow Jones Indices, juillet 2026.</text>
</g>
<g class="mobile" transform="scale(2.17)">
  <text x="16" y="20" fill="#f8fafc" font-size="9.3" font-weight="700">La dette doit devenir indexable</text>
  <text x="16" y="32" fill="#94a3b8" font-size="5.2">iBoxx USD Liquid IG, juillet 2026</text>
  <rect x="16" y="45" width="150" height="27" rx="4" fill="#172554" stroke="#3b82f6" stroke-width=".5"/><text x="23" y="57" fill="#93c5fd" font-size="5.5" font-weight="700">1. Crédit d’entreprise en USD</text><text x="23" y="67" fill="#e2e8f0" font-size="4.8">flux déterminables à l’avance</text>
  <rect x="184" y="45" width="150" height="27" rx="4" fill="#172554" stroke="#3b82f6" stroke-width=".5"/><text x="191" y="57" fill="#93c5fd" font-size="5.5" font-weight="700">2. Notation</text><text x="191" y="67" fill="#e2e8f0" font-size="4.8">BBB- / Baa3 ou mieux</text>
  <rect x="16" y="82" width="150" height="27" rx="4" fill="#172554" stroke="#3b82f6" stroke-width=".5"/><text x="23" y="94" fill="#93c5fd" font-size="5.5" font-weight="700">3. Taille du titre</text><text x="23" y="104" fill="#e2e8f0" font-size="4.8">encours ≥ 750 M$</text>
  <rect x="184" y="82" width="150" height="27" rx="4" fill="#132b32" stroke="#14b8a6" stroke-width=".5"/><text x="191" y="94" fill="#5eead4" font-size="5.5" font-weight="700">4. Taille émetteur</text><text x="191" y="104" fill="#e2e8f0" font-size="4.8">encours retenu ≥ 2 Md$</text>
  <rect x="16" y="119" width="150" height="27" rx="4" fill="#132b32" stroke="#14b8a6" stroke-width=".5"/><text x="23" y="131" fill="#5eead4" font-size="5.5" font-weight="700">5. Maturité</text><text x="23" y="141" fill="#e2e8f0" font-size="4.8">3 ans, 3,5 ans à l’entrée</text>
  <rect x="184" y="119" width="150" height="27" rx="4" fill="#132b32" stroke="#14b8a6" stroke-width=".5"/><text x="191" y="131" fill="#5eead4" font-size="5.5" font-weight="700">6. Calendrier</text><text x="191" y="141" fill="#e2e8f0" font-size="4.8">cut-off puis fin de mois</text>
  <rect x="16" y="165" width="318" height="42" rx="5" fill="#1e293b" stroke="#64748b" stroke-width=".5"/>
  <text x="23" y="178" fill="#f8fafc" font-size="5.5" font-weight="700">Valeur de marché / univers éligible</text>
  <text x="23" y="190" fill="#cbd5e1" font-size="4.8">(prix + intérêt couru) × nominal en circulation</text>
  <text x="23" y="201" fill="#cbd5e1" font-size="4.8">puis agrégation par émetteur</text>
  <rect x="89" y="220" width="172" height="27" rx="13.5" fill="#451a2a" stroke="#fb7185" stroke-width=".5"/>
  <text x="175" y="237" fill="#fda4af" font-size="6.5" font-weight="700" text-anchor="middle">PLAFOND : 3 %</text>
  <text x="16" y="268" fill="#64748b" font-size="4.7">Source : S&amp;P DJI, juillet 2026.</text>
</g>
</svg>
<figcaption style="margin-top:.65rem;color:#64748b;font-size:.82rem">Le poids de la dette n’intervient qu’après la sélection. Une grande dette high yield, privée, trop petite, trop courte ou non libellée en dollars peut rester entièrement hors de cet indice.</figcaption>
</figure>

Le slogan « le plus endetté gagne toujours » échoue ici. Un groupe peut augmenter fortement sa dette sans entrer dans LQD si sa notation devient spéculative. Inversement, une entreprise solide qui émet une grosse obligation liquide peut franchir les seuils et augmenter son poids, jusqu’au plafond. Le benchmark récompense moins le levier que **l’abondance d’une dette standardisée et négociable**.

Au 7 août 2026, BlackRock publiait **3 151 lignes** dans le portefeuille de LQD. Ce nombre décrit le fonds, pas exactement l’indice, et les positions peuvent changer. Il montre néanmoins pourquoi un gérant ne traite pas un ETF obligataire comme un panier actions de quelques centaines de titres. ([iShares / BlackRock](https://www.ishares.com/us/products/239566/LQD))

## De la pondération aux achats réels

Un indice n’achète rien. Le [prospectus iShares déposé auprès de la SEC](https://www.sec.gov/Archives/edgar/data/1100663/000119312525149296/d833515d497.htm) le formule clairement : l’indice est un calcul, tandis que le fonds est un portefeuille réel. LQD cherche à suivre son benchmark, mais BlackRock utilise un **échantillonnage représentatif**. Le fonds détient un ensemble de titres dont le profil agrégé ressemble à celui de l’indice, sans devoir posséder chaque obligation dans exactement la même proportion.

Un autre [dépôt SEC reprenant le prospectus de LQD](https://www.sec.gov/Archives/edgar/data/1517936/000144554626001661/lqti_497k.htm) précise que le fonds investit au moins 80 % de ses actifs dans les composants de l’indice et au moins 90 % dans des titres à revenu fixe du type de ceux que contient l’indice. La marge restante peut servir au suivi avec d’autres obligations ou des dérivés.

La transmission réelle dépend alors de quatre conditions :

1. l’émission devient éligible au prochain rééquilibrage ;
2. son poids brut augmente sans être entièrement neutralisé par le plafond ;
3. les fonds et mandats liés au benchmark disposent d’actifs à ajuster ;
4. les gérants choisissent cette obligation, ou un substitut proche, pour réduire leur erreur de suivi.

Une collecte nette apporte du capital neuf. Sans collecte, le rééquilibrage reste possible, mais l’achat d’un titre implique souvent de réduire d’autres expositions. Une décollecte peut même dominer l’effet de pondération. Le mot « achat passif » désigne donc une contrainte relative de portefeuille, pas une demande illimitée.

La plomberie des ETF ajoute une autre distance. La [BIS](https://www.bis.org/publ/qtrpdf/r_qt2103d.htm) a montré sur des données de 2020 que les paniers de création des ETF d’obligations d’entreprise américains ne recouvraient qu’environ 20 % de leurs positions, et les paniers de rachat environ 35 %. Cette flexibilité aide les fonds à gérer des milliers de titres inégalement liquides. Elle interdit d’assimiler une création de parts à l’achat proportionnel de chaque obligation du benchmark.

## Six événements, six effets différents

Le suivi utile sépare l’encours, le prix, l’éligibilité et les flux.

<div style="max-width:100%;overflow-x:auto">
<table>
<thead>
<tr><th>Événement</th><th>Effet brut sur le poids</th><th>Frein principal</th></tr>
</thead>
<tbody>
<tr><td>Nouvelle émission éligible</td><td>hausse du nominal et du poids potentiel</td><td>cut-off, seuils, plafond de 3 %</td></tr>
<tr><td>Baisse du prix de l’obligation</td><td>baisse de la valeur de marché</td><td>poids figé entre deux rééquilibrages selon la règle</td></tr>
<tr><td>Rachat ou remboursement</td><td>baisse du nominal en circulation</td><td>calendrier de prise en compte</td></tr>
<tr><td>Dégradation sous investment grade</td><td>sortie de l’univers IG</td><td>règles exactes du benchmark et date de rebalance</td></tr>
<tr><td>Collecte du fonds</td><td>capital supplémentaire à investir</td><td>échantillonnage et liquidité des titres</td></tr>
<tr><td>Décollecte du fonds</td><td>besoin de réduire le portefeuille</td><td>panier de rachat et réserves de liquidité</td></tr>
</tbody>
</table>
</div>

La frontière de notation mérite une précision. La méthodologie iBoxx permet de sortir un titre dégradé sous investment grade même pendant sa période minimale de maintien. Cela ne signifie pas que tout investisseur doit vendre le même jour. Dans son [Financial Stability Report de mai 2020](https://www.federalreserve.gov/publications/files/financial-stability-report-20200515.pdf), la Fed rappelait qu’aucune règle générale n’obligeait les fonds investment grade à vendre tous les « anges déchus », même si certains pouvaient alléger leurs positions. Notre guide pour [lire une notation de crédit](/guides/lire-une-notation-de-credit/) détaille cette frontière.

## Un benchmark n’est jamais sans opinion

La pondération par valeur de marché possède une justification robuste : elle reflète la taille et la capacité du marché. Un indice fondé sur les montants disponibles est plus facile à suivre qu’un portefeuille qui surpondérerait de petites obligations rares. Bloomberg présente précisément cette réplicabilité comme la raison centrale de la méthode.

Mais la même règle concentre mécaniquement le portefeuille sur les émetteurs qui fournissent beaucoup de papier éligible. Elle ne sait pas si l’emprunt finance une acquisition destructrice, un rachat d’actions, un centre de données rentable ou le refinancement prudent d’une échéance. Pour cette lecture fondamentale, il faut revenir au bilan, aux maturités et aux usages du cash, comme dans le guide l0g pour [lire la dette d’une entreprise](/guides/lire-la-dette-d-une-entreprise/).

La comparaison avec les actions éclaire le paradoxe. Une pondération actions par capitalisation augmente lorsque la valeur des fonds propres progresse. Une pondération obligataire par valeur de marché peut augmenter lorsque le volume de dette éligible progresse. Dans les deux cas, le benchmark mesure le marché existant. Il ne promet pas que la grandeur mesurée est une qualité économique.

Il existe d’autres constructions. Bloomberg cite les indices plafonnés, fondamentaux, à allocation cible ou pondérés par le risque. Chacune remplace une faiblesse par un choix différent : plafonner réduit la concentration mais s’éloigne du marché ; pondérer par des fondamentaux exige de choisir les bons indicateurs ; pondérer par le risque dépend d’un modèle et de données instables. La neutralité parfaite n’est pas au menu.

Les travaux de la [Réserve fédérale sur le passage de la gestion active à la gestion passive](https://www.federalreserve.gov/econres/feds/the-shift-from-active-to-passive-investing-potential-risks-to-financial-stability.htm) concluent d’ailleurs à des effets mixtes : certaines stratégies passives peuvent amplifier la volatilité, tandis que les preuves reliant indexation et comouvement des prix ou de la liquidité restent partagées. La méthodologie établit une contrainte. Elle ne suffit pas, seule, à prouver un effet de prix.

## La lecture l0g

Oui, émettre davantage de dette éligible peut augmenter le poids d’un emprunteur dans un indice obligataire pondéré par valeur de marché. C’est une conséquence arithmétique du nominal en circulation.

Non, l’indice ne finance pas sans limite l’entreprise la plus endettée. Le prix peut baisser, la notation peut exclure, les seuils peuvent bloquer et le plafond peut borner. Dans le cas de l’iBoxx suivi par LQD, la limite de 3 % par émetteur est explicite.

Enfin, une hausse de poids n’est pas un ordre de marché universel. Les fonds disposent de règles d’investissement, de paniers flexibles et d’un échantillonnage représentatif. Pour établir qu’une émission a réellement créé une pression acheteuse, il faut observer le calendrier d’inclusion, les changements de poids, les actifs liés au benchmark, les positions des fonds et les transactions. L’équation donne le canal. Elle ne prouve pas à elle seule la causalité.

L’idée la plus utile tient en une phrase : **un indice obligataire ne sélectionne pas les meilleurs emprunteurs, il organise la dette qui a franchi ses filtres**.

---

## Sources

- [S&P Dow Jones Indices, iBoxx USD Liquid Investment Grade Index Methodology](https://www.spglobal.com/spdji/en/documents/methodologies/iBoxx_USD_Liquid_Investment_Grade_Index_Methodology.pdf), juillet 2026 : sélection, seuils, calendrier, pondération et plafond de 3 %.
- [Bloomberg Fixed Income Index Methodology](https://assets.bbhub.io/professional/sites/10/Bloomberg-Index-Publications-Fixed-Income-Index-Methodology.pdf), 8 janvier 2026 : formule de valeur de marché et pondérations alternatives.
- [Réserve fédérale, Financial Accounts Z.1, secteur des entreprises non financières](https://fred.stlouisfed.org/release/tables?eid=804211&rid=52), premier trimestre 2026 : encours d’obligations au passif.
- [SEC, prospectus iShares](https://www.sec.gov/Archives/edgar/data/1100663/000119312525149296/d833515d497.htm), 2025 : différence entre indice et fonds, échantillonnage représentatif et risques liés à l’indice.
- [SEC, description de LQD tirée de son prospectus](https://www.sec.gov/Archives/edgar/data/1517936/000144554626001661/lqti_497k.htm), dépôt 2026 : objectifs d’investissement et proportions minimales d’actifs.
- [iShares / BlackRock, LQD](https://www.ishares.com/us/products/239566/LQD), données au 7 août 2026 : benchmark et nombre de positions du fonds.
- [BIS, « The anatomy of bond ETF arbitrage »](https://www.bis.org/publ/qtrpdf/r_qt2103d.htm), mars 2021 : écart entre positions et paniers de création ou de rachat.
- [Réserve fédérale, « The Shift from Active to Passive Investing »](https://www.federalreserve.gov/econres/feds/the-shift-from-active-to-passive-investing-potential-risks-to-financial-stability.htm), version révisée en 2020 : effets documentés et incertitudes de l’indexation passive.
- [Réserve fédérale, Financial Stability Report](https://www.federalreserve.gov/publications/files/financial-stability-report-20200515.pdf), mai 2020 : pression potentielle autour des anges déchus et absence d’obligation générale de vente.

## Méthode et limites

- Données arrêtées au **11 août 2026**. Aucun cours, rendement, multiple de valorisation ou ratio de marché courant n’est utilisé.
- L’exemple A, B, C est entièrement fictif. Il montre la pondération brute avant plafond, fiscalité, coût de transaction et variation de prix.
- Le chiffre Z.1 couvre les entreprises non financières américaines. Il ne mesure ni l’encours mondial, ni le seul investment grade, ni les actifs effectivement détenus par LQD.
- Le nombre de positions publié par BlackRock décrit le portefeuille du fonds au 7 août 2026. Il ne doit pas être lu comme le nombre exact de composants de l’indice.
- L’étude BIS repose sur des données de 2020 et documente une architecture générale des ETF obligataires. Les taux de recouvrement entre paniers et positions ne sont pas présentés comme des mesures actuelles de LQD.
- L’article décrit un mécanisme de construction et ses canaux possibles. Il ne mesure pas l’effet causal d’une émission précise sur son prix ou son coût de financement et ne constitue pas un conseil en investissement.
