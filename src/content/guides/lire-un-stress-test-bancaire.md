---
title: "Lire un stress test bancaire : DFAST, CCAR et le coussin de stress"
description: "Guide de référence pour lire le test de résistance annuel de la Fed : la différence entre DFAST et CCAR, le scénario d'apocalypse conçu sur mesure, la mécanique qui projette pertes, revenus et ratio de fonds propres sur neuf trimestres, le Stress Capital Buffer qui en découle et fixe la marge de rachats d'actions, et les limites de l'exercice, à commencer par son angle mort sur les ruées de liquidité. Avec le test de 2026 comme fil conducteur."
summary: "Chaque année, la Réserve fédérale soumet les plus grandes banques américaines à une récession hypothétique sévère et publie si elles y survivent. Le test comporte deux volets : le DFAST, quantitatif, qui mesure la solvabilité sous stress, et le CCAR, qui juge la capacité à distribuer du capital. Son résultat le plus important est le Stress Capital Buffer, une exigence de fonds propres propre à chaque banque qui détermine sa marge de dividendes et de rachats. Le lire suppose de comprendre le scénario, la ponction de CET1, la composition des pertes et les limites de l'exercice, dont son silence sur le risque de liquidité qui a pourtant tué Silicon Valley Bank."
pubDate: 2026-07-13T04:50:00+02:00
updatedDate: 2026-07-13T04:50:00+02:00
tags: ["banques", "régulation", "risque", "fed", "capital"]
category: fed
draft: false
---

*Une fois par an, la Réserve fédérale inflige aux plus grandes banques américaines une apocalypse imaginaire, un effondrement de la Bourse, une flambée du chômage, une chute de l'immobilier, puis publie le verdict : qui survit, et avec combien de capital. Le test de résistance est ce qui ressemble le plus à une radiographie de la solidité bancaire, et il façonne concrètement combien chaque banque peut rendre à ses actionnaires. C'est aussi un rituel contesté, à la fois éclairant et trompeur, car il mesure très bien un danger et ignore presque totalement celui qui, dans la réalité, fait tomber les banques. Ce guide explique comment le lire, ce qu'il dit et ce qu'il tait. Le test de 2026 sert d'illustration.*

## DFAST et CCAR : deux noms, un exercice

L'exercice porte deux sigles qu'on confond souvent, et qui répondent en réalité à deux questions distinctes. Le [DFAST](/glossaire/dfast/), pour Dodd-Frank Act Stress Test, est le volet quantitatif, né de la loi de 2010 : il pose la question de la survie. La banque garderait-elle ses fonds propres au-dessus des minimums réglementaires si une récession sévère frappait ? Le [CCAR](/glossaire/ccar/), lui, est le volet de planification du capital : il pose la question de la distribution. La banque peut-elle verser des dividendes et racheter ses actions tout en restant assez solide sous stress ? Le premier teste la résistance, le second en tire les conséquences pour la politique de capital.

Le test ne concerne que les grandes banques, celles de plus de 100 milliards de dollars d'actifs, réparties en catégories selon leur taille et leur complexité. En 2026, trente-deux établissements y étaient soumis. Les plus petites banques, comme les régionales, en sont exemptées, un point qui n'est pas anodin, on y reviendra, car c'est précisément là que se sont logées certaines des failles récentes, décrites dans notre [guide de la solidité bancaire](/guides/lire-la-solidite-d-une-banque/).

## Le scénario : une apocalypse sur mesure

Le cœur du test est le scénario dit « sévèrement défavorable », un enchaînement de catastrophes que la Fed conçoit elle-même chaque année et publie en février. Il ne prétend pas prédire la prochaine crise, mais soumettre les banques à un choc calibré pour être douloureux. Celui de 2026 illustre bien l'exercice.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 300" role="img" aria-label="Le scénario sévèrement défavorable du test de résistance 2026" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="300" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">L'apocalypse sur mesure de 2026</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Le scénario « sévèrement défavorable » conçu par la Fed pour le test de résistance.</text>
  <line x1="40" y1="78" x2="680" y2="78" stroke="#2a2c33" stroke-width="1"></line>
  <text x="40" y="106" fill="#d6d9df" font-size="12.5">Actions</text>
  <text x="300" y="110" fill="#ff4d87" font-size="19" font-weight="700">-58 %</text>
  <text x="440" y="106" fill="#8b909b" font-size="11.5">sur les trois premiers trimestres</text>
  <line x1="40" y1="124" x2="680" y2="124" stroke="#2a2c33" stroke-width="1"></line>
  <text x="40" y="152" fill="#d6d9df" font-size="12.5">VIX (indice de la peur)</text>
  <text x="300" y="156" fill="#f5b13d" font-size="19" font-weight="700">72</text>
  <text x="440" y="152" fill="#8b909b" font-size="11.5">pic, un niveau de crise extrême</text>
  <line x1="40" y1="170" x2="680" y2="170" stroke="#2a2c33" stroke-width="1"></line>
  <text x="40" y="198" fill="#d6d9df" font-size="12.5">Chômage</text>
  <text x="300" y="202" fill="#7aa2f7" font-size="19" font-weight="700">10 %</text>
  <text x="440" y="198" fill="#8b909b" font-size="11.5">contre environ 4 % au départ</text>
  <line x1="40" y1="216" x2="680" y2="216" stroke="#2a2c33" stroke-width="1"></line>
  <text x="40" y="244" fill="#d6d9df" font-size="12.5">Logement / immobilier commercial</text>
  <text x="300" y="248" fill="#ff4d87" font-size="19" font-weight="700">-30 % / -39 %</text>
  <text x="32" y="284" fill="#8b909b" font-size="11">Source : Réserve fédérale, scénarios du test de résistance 2026 (février 2026).</text>
</svg>
<figcaption>Une chute des actions de <strong>58 %</strong>, un VIX à <strong>72</strong>, un chômage à <strong>10 %</strong> et l'immobilier commercial en baisse de <strong>39 %</strong> : le scénario est une tempête parfaite, conçue pour éprouver les bilans. Source : Réserve fédérale.</figcaption>
</figure>

Un scénario de référence, moins brutal, sert de point de comparaison, et la Fed ajoute parfois un volet exploratoire pour tester un risque émergent. Mais c'est le scénario sévèrement défavorable qui fait le titre, parce que c'est lui qui détermine le capital. Le fait qu'il soit connu des banques à l'avance est à la fois une force, la transparence, et une faiblesse, l'incitation à s'y optimiser, sur laquelle nous reviendrons.

## La mécanique : pertes, revenus, capital

Une fois le scénario posé, la Fed simule, trimestre par trimestre sur neuf trimestres, ce qu'il ferait à chaque banque. D'un côté, elle projette les pertes : défauts sur les prêts, moins-values de trading, pertes opérationnelles. De l'autre, elle projette les revenus que la banque continuerait d'engranger malgré la crise, le [revenu net avant provisions](/glossaire/ppnr/) ou PPNR, qui forme le premier coussin absorbant les pertes. La différence, appliquée aux fonds propres, dessine la trajectoire du ratio [CET1](/glossaire/cet1/) tout au long du choc.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 290" role="img" aria-label="Le résultat du test de résistance 2026 : la ponction du ratio de fonds propres" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="290" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Le résultat 2026 : une ponction, pas un effondrement</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Ratio de fonds propres durs (CET1) agrégé des 32 banques, sous le scénario adverse.</text>
  <text x="40" y="92" fill="#d6d9df" font-size="12">Départ (fin 2025)</text>
  <rect x="40" y="102" width="600" height="22" fill="#2a2c33"></rect>
  <rect x="40" y="102" width="512" height="22" fill="#5eead4" opacity="0.9"></rect>
  <text x="560" y="119" fill="#5eead4" font-size="12" font-weight="700">12,8 %</text>
  <text x="40" y="146" fill="#d6d9df" font-size="12">Creux sous stress</text>
  <rect x="40" y="156" width="600" height="22" fill="#2a2c33"></rect>
  <rect x="40" y="156" width="448" height="22" fill="#f5b13d" opacity="0.9"></rect>
  <text x="496" y="173" fill="#f5b13d" font-size="12" font-weight="700">11,2 %</text>
  <text x="40" y="200" fill="#d6d9df" font-size="12">Minimum réglementaire</text>
  <rect x="40" y="210" width="600" height="22" fill="#2a2c33"></rect>
  <rect x="40" y="210" width="180" height="22" fill="#ff4d87" opacity="0.85"></rect>
  <text x="228" y="227" fill="#ff4d87" font-size="12" font-weight="700">4,5 %</text>
  <text x="40" y="262" fill="#8b909b" font-size="11.5">Ponction de 1,6 point, environ 625 Md$ de pertes sur prêts, 32 banques au-dessus du seuil.</text>
  <text x="32" y="282" fill="#8b909b" font-size="11">Source : Réserve fédérale, résultats DFAST 2026 (24 juin 2026).</text>
</svg>
<figcaption>Le ratio agrégé tombe de <strong>12,8 % à 11,2 %</strong> au plus bas, une ponction de 1,6 point, avant de se redresser. Il reste très au-dessus du minimum de <strong>4,5 %</strong>, malgré environ <strong>625 milliards</strong> de pertes sur prêts. Toutes passent. Source : Réserve fédérale.</figcaption>
</figure>

Le résultat de 2026 est rassurant sur le papier, et c'est le cas presque chaque année : les trente-deux banques passent, le ratio agrégé ne cède que 1,6 point et reste loin du plancher. Mais lire un stress test ne s'arrête pas à ce « réussi ». Le vrai enseignement est ailleurs, dans le chiffre que le test produit pour chaque banque et qui la contraindra toute l'année.

## Le vrai enjeu : le Stress Capital Buffer

Le produit le plus important du test n'est pas le verdict binaire, c'est le [Stress Capital Buffer](/glossaire/scb/), le coussin de fonds propres de stress. Son calcul est simple dans son principe : on prend le ratio CET1 de départ, on lui soustrait le point le plus bas atteint pendant les neuf trimestres de stress, et on ajoute les dividendes prévus sur un an, avec un plancher de 2,5 %. Le résultat devient une exigence de capital propre à chaque banque, ajoutée à ses minimums.

L'enjeu est considérable, car ce coussin détermine la marge de manœuvre de la banque. Plus une banque souffre dans le scénario, plus son coussin est élevé, et moins il lui reste de capital à distribuer en dividendes et en rachats d'actions. Le stress test n'est donc pas un examen sans conséquence : il fixe, banque par banque, combien de capital chacune doit retenir plutôt que rendre. C'est le canal par lequel un mauvais résultat se paie en moindres rachats, ce qui explique l'attention que les investisseurs y portent. En 2026, fait notable, la Fed a gelé les exigences de coussin le temps de finaliser une révision de son cadre, un point sur lequel il faut s'arrêter.

## Les limites de l'exercice

Un lecteur avisé ne prend jamais un stress test pour argent comptant, car ses limites sont aussi importantes que ses résultats. La première est qu'il modélise la dernière guerre. Ses scénarios s'inspirent des crises passées, une récession de type 2008, et rien ne garantit que le prochain choc leur ressemble. La deuxième est que le scénario est connu à l'avance : les banques peuvent façonner leurs bilans pour bien y figurer, ce qui améliore le score sans forcément renforcer la résilience réelle. La troisième est que c'est une photographie ponctuelle, vite périmée quand les portefeuilles bougent.

La quatrième limite est la plus grave, et elle touche au cœur du sujet. Le test mesure la solvabilité, la capacité à absorber des pertes, mais presque pas la liquidité, la capacité à honorer des retraits soudains. Or c'est une ruée de liquidité, pas un défaut de solvabilité, qui a tué Silicon Valley Bank en 2023, une banque qui n'était d'ailleurs même pas soumise au test. La faille la plus courante des banques, la fuite des dépôts à la vitesse d'une application, est précisément celle que le stress test capte le moins. Réussir le test n'est donc pas un blanc-seing, comme l'ont rappelé plusieurs voix du secteur au moment même où la réglementation, avec la révision du cadre et l'allègement de Bâle III, desserrait la contrainte de capital. Un satisfecit de solvabilité ne dit rien de la vulnérabilité à une ruée.

## Lire le stress test en pratique

Concrètement, quelques réflexes permettent de tirer le vrai signal d'un stress test. La date d'abord : les scénarios paraissent en février, les résultats en juin, et le coussin qui en découle s'applique ensuite. Le chiffre à isoler n'est pas le « réussi ou échoué » collectif, mais la ponction de CET1 banque par banque, car une ponction forte trahit une exposition élevée aux pertes du scénario. Le coussin de stress qui en résulte dit combien de capital la banque devra retenir, donc sa capacité à racheter ses actions. La composition des pertes révèle où le bilan est fragile, immobilier commercial, cartes de crédit, trading. Et le revenu avant provisions mesure le matelas qui absorbe le choc avant le capital.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 330" role="img" aria-label="La grille de lecture d'un résultat de test de résistance bancaire" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="330" fill="#0c0d10"></rect>
  <text x="32" y="36" fill="#f5f6f8" font-size="17" font-weight="700">La grille de lecture d'un stress test</text>
  <text x="32" y="57" fill="#8b909b" font-size="12">Les points à regarder au-delà du « réussi ou échoué ».</text>
  <line x1="40" y1="74" x2="680" y2="74" stroke="#2a2c33" stroke-width="1"></line>
  <circle cx="48" cy="97" r="5" fill="#ff4d87"></circle>
  <text x="64" y="94" fill="#ff4d87" font-size="12.5" font-weight="700">La ponction de CET1</text>
  <text x="64" y="111" fill="#8b909b" font-size="11.5">plus elle est forte, plus la banque est exposée aux pertes du scénario.</text>
  <circle cx="48" cy="141" r="5" fill="#f5b13d"></circle>
  <text x="64" y="138" fill="#f5b13d" font-size="12.5" font-weight="700">Le coussin de stress (SCB)</text>
  <text x="64" y="155" fill="#8b909b" font-size="11.5">l'exigence de capital qui en découle, donc la marge de rachats d'actions.</text>
  <circle cx="48" cy="185" r="5" fill="#7aa2f7"></circle>
  <text x="64" y="182" fill="#7aa2f7" font-size="12.5" font-weight="700">La composition des pertes</text>
  <text x="64" y="199" fill="#8b909b" font-size="11.5">d'où elles viennent : immobilier commercial, cartes de crédit, trading.</text>
  <circle cx="48" cy="229" r="5" fill="#5eead4"></circle>
  <text x="64" y="226" fill="#5eead4" font-size="12.5" font-weight="700">Le revenu avant provisions (PPNR)</text>
  <text x="64" y="243" fill="#8b909b" font-size="11.5">le matelas qui absorbe le choc avant que le capital ne soit entamé.</text>
  <circle cx="48" cy="273" r="5" fill="#ff4d87"></circle>
  <text x="64" y="270" fill="#ff4d87" font-size="12.5" font-weight="700">L'angle mort : la liquidité</text>
  <text x="64" y="287" fill="#8b909b" font-size="11.5">la ruée des déposants, que le test ne capte pas. Le cas SVB de 2023.</text>
  <text x="32" y="318" fill="#8b909b" font-size="11">Lecture l0g, d'après le guide de la solidité bancaire.</text>
</svg>
<figcaption>Cinq points priment sur le verdict binaire : la ponction de capital, le coussin de stress qui en résulte, l'origine des pertes, le coussin de revenus, et surtout ce que le test ne voit pas, <strong>la ruée de liquidité</strong>. Lecture l0g.</figcaption>
</figure>

Surtout, il faut lire le test pour ce qu'il est, un examen de solvabilité sous un scénario connu, non une garantie de survie. Il se complète de la grille de notre [guide de la solidité bancaire](/guides/lire-la-solidite-d-une-banque/), qui ajoute ce que le test néglige, la liquidité, les pertes latentes et la structure des dépôts. Le stress test dit qu'une banque encaisserait une récession modélisée. Il ne dit pas qu'elle survivrait à la panique de ses propres déposants, et c'est cette seconde question qui, dans l'histoire, s'est révélée la plus mortelle.

## Sources et pour aller plus loin

- [Réserve fédérale, résultats du Dodd-Frank Act Stress Test 2026, 24 juin 2026](https://www.federalreserve.gov/publications/files/2026-dfast-results-20260624.pdf) : CET1 agrégé de 12,8 % à 11,2 %, environ 625 Md$ de pertes sur prêts.
- [Réserve fédérale, scénarios du test de résistance 2026](https://www.federalreserve.gov/publications/2026-stress-test-scenarios.htm) : actions -58 %, VIX 72, chômage 10 %, immobilier commercial -39 %.
- [Bank Policy Institute, « The 2026 Federal Reserve Stress Test Results: A Framework in Transition »](https://bpi.com/the-2026-federal-reserve-stress-test-results-a-framework-in-transition/) : la révision du cadre et le gel des coussins.
- Forbes (M. Rodriguez Valladares), « 2026 Bank Stress-Test Results Are Not A Green Light For Lower Capital » : les limites de l'exercice.
- l0g, [Résultats bancaires du T2, lire le risque](/posts/resultats-bancaires-t2-2026-lire-le-risque/) et [L'immobilier commercial et le mur de refinancement](/posts/immobilier-commercial-mur-refinancement-2026-maillon-regional/).
- Guides liés : [Lire la solidité d'une banque](/guides/lire-la-solidite-d-une-banque/) et [Lire les CLO et les prêts à effet de levier](/guides/lire-les-clo-et-prets-a-effet-de-levier/).
</content>
