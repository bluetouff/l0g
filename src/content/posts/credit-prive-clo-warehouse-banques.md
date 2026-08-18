---
title: "Le crédit privé entre dans la machine à CLO"
description: "Les prêts de crédit privé sont de plus en plus accumulés dans des warehouses financés par les dealers avant d'être titrisés en CLO. En juin 2026, la Fed a consacré une enquête spéciale à cette mécanique. Elle montre une demande en forte hausse, mais aussi un resserrement des conditions lié à la qualité et à la valorisation du collatéral."
pubDate: 2026-08-18T18:50:00+02:00
updatedDate: 2026-08-18T18:50:00+02:00
tags: ["crédit privé", "CLO", "banques", "titrisation", "risque", "liquidité"]
draft: false
---

*Le crédit privé s'est développé sur une promesse simple : prêter directement à des entreprises sans passer par le marché obligataire ou le syndicat bancaire traditionnel. Une partie de ces prêts emprunte désormais un chemin plus familier. Ils sont accumulés dans des facilités temporaires, financées par des dealers, puis regroupés dans des CLO qui émettent des tranches de dette. En juin 2026, la Réserve fédérale a consacré une série de questions spéciale à ce marché. Le résultat mérite attention : la banque ne réapparaît pas seulement à la fin de la chaîne. Elle finance déjà l'entrepôt dans lequel les prêts attendent d'être titrisés.*

Le mot important est **warehouse**.

Avant qu'un CLO puisse être vendu, il faut réunir suffisamment de prêts pour constituer son portefeuille. Cette période peut durer plusieurs mois. Les prêts existent déjà, mais les titres qui permettront de les refinancer n'existent pas encore.

Quelqu'un doit donc avancer l'argent.

Dans son [Senior Credit Officer Opinion Survey de juin 2026](https://www.federalreserve.gov/data/scoos/scoos-202606.htm), la Réserve fédérale définit précisément le *warehouse financing* comme un financement garanti accordé pour accumuler temporairement des prêts en vue de leur titrisation ultérieure dans un CLO.

La définition suffit presque à résumer le risque.

Le warehouse est un pont entre deux mondes : au départ, des prêts privés, illiquides et négociés bilatéralement ; à l'arrivée, des titres structurés distribués par tranches à des investisseurs.

Et ce pont repose largement sur le bilan des dealers.

## Avant le CLO, le warehouse

Un gérant de crédit privé peut avoir déjà originé plusieurs dizaines de prêts, sans disposer encore du volume, de la composition ou de la fenêtre de marché nécessaires pour fermer un CLO.

Une banque ou un dealer lui fournit alors une facilité garantie.

Les prêts sont placés dans le warehouse. À mesure que le portefeuille grossit, la facilité finance l'accumulation. Lorsque le CLO est finalement émis, le véhicule achète les prêts et les nouvelles tranches de dette refinancent la phase temporaire.

La séquence est donc :

**prêts privés → warehouse financé → CLO → tranches senior, mezzanine et subordonnées**

Le caractère provisoire du warehouse est central. Il est conçu pour disparaître lorsque la titrisation prend le relais.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 420" role="img" aria-label="Cycle de financement d'un CLO de crédit privé, depuis l'origination des prêts jusqu'au warehouse bancaire puis à l'émission des tranches du CLO" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="420" fill="#0c0d10"/>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Avant le CLO, quelqu'un finance l'entrepôt</text>
  <text x="32" y="60" fill="#8b909b" font-size="11">Le warehouse transforme une collection de prêts privés en portefeuille prêt à être titrisé.</text>

  <rect x="34" y="104" width="150" height="92" rx="5" fill="#15171c" stroke="#f5b13d"/>
  <text x="49" y="130" fill="#f5b13d" font-size="12" font-weight="700">1. ORIGINATION</text>
  <text x="49" y="152" fill="#d6d9df" font-size="10">prêts privés</text>
  <text x="49" y="169" fill="#d6d9df" font-size="10">middle-market</text>
  <text x="49" y="186" fill="#8b909b" font-size="9">bilatéraux, peu liquides</text>

  <rect x="230" y="104" width="176" height="92" rx="5" fill="#15171c" stroke="#7aa2f7"/>
  <text x="246" y="130" fill="#7aa2f7" font-size="12" font-weight="700">2. WAREHOUSE</text>
  <text x="246" y="152" fill="#d6d9df" font-size="10">facilité garantie</text>
  <text x="246" y="169" fill="#d6d9df" font-size="10">fournie par un dealer</text>
  <text x="246" y="186" fill="#8b909b" font-size="9">financement temporaire</text>

  <rect x="452" y="104" width="150" height="92" rx="5" fill="#15171c" stroke="#5eead4"/>
  <text x="468" y="130" fill="#5eead4" font-size="12" font-weight="700">3. CLO</text>
  <text x="468" y="152" fill="#d6d9df" font-size="10">le véhicule achète</text>
  <text x="468" y="169" fill="#d6d9df" font-size="10">le portefeuille</text>
  <text x="468" y="186" fill="#8b909b" font-size="9">financement long terme</text>

  <line x1="184" y1="150" x2="230" y2="150" stroke="#8b909b" stroke-width="2"/>
  <polygon points="230,150 220,144 220,156" fill="#8b909b"/>
  <line x1="406" y1="150" x2="452" y2="150" stroke="#8b909b" stroke-width="2"/>
  <polygon points="452,150 442,144 442,156" fill="#8b909b"/>

  <text x="34" y="244" fill="#d6d9df" font-size="11" font-weight="700">Le CLO refinance le portefeuille en plusieurs couches</text>
  <rect x="34" y="266" width="568" height="34" fill="#5eead4"/>
  <text x="48" y="288" fill="#0c0d10" font-size="11" font-weight="700">Senior : priorité de paiement, rendement plus faible</text>
  <rect x="34" y="306" width="568" height="34" fill="#7aa2f7"/>
  <text x="48" y="328" fill="#0c0d10" font-size="11" font-weight="700">Mezzanine : plus de risque, plus de spread</text>
  <rect x="34" y="346" width="568" height="34" fill="#ff4d87"/>
  <text x="48" y="368" fill="#0c0d10" font-size="11" font-weight="700">Subordonnée / equity : absorbe les premières pertes</text>

  <text x="626" y="283" fill="#8b909b" font-size="9">moins</text>
  <text x="626" y="296" fill="#8b909b" font-size="9">risqué</text>
  <line x1="650" y1="303" x2="650" y2="354" stroke="#8b909b" stroke-width="1.5"/>
  <polygon points="650,354 644,344 656,344" fill="#8b909b"/>
  <text x="626" y="374" fill="#8b909b" font-size="9">plus</text>
  <text x="626" y="387" fill="#8b909b" font-size="9">risqué</text>

  <text x="34" y="407" fill="#8b909b" font-size="9">SOURCE : Federal Reserve, SCOOS juin 2026. Schéma simplifié de la chaîne de financement.</text>
</svg>
<figcaption>Le warehouse n'est pas le CLO. C'est le financement transitoire qui permet d'accumuler les prêts avant l'émission des titres. Tant que le CLO n'est pas fermé, le financement intermédiaire reste nécessaire.</figcaption>
</figure>

Cette mécanique existe depuis longtemps pour les CLO adossés à des prêts syndiqués. Ce qui change est la montée du **private credit CLO**, adossé principalement à des prêts originés dans les marchés privés.

La Fed a jugé le sujet suffisamment important pour lui consacrer sept questions spécifiques en juin 2026.

## La Fed a posé exactement les bonnes questions

Le panel de juin comprenait **20 institutions**, que la Fed décrit comme représentant presque tout le financement en dollars fourni par les dealers aux non-dealers et les intermédiaires les plus actifs sur les dérivés OTC.

La moitié des répondants a indiqué être active dans le financement warehouse des CLO de crédit privé.

Parmi les dix établissements concernés :

- **40 %** ont déclaré avoir augmenté leur offre de financement warehouse sur douze mois ;
- **30 %** ont resserré les conditions de ces facilités ;
- **70 %** ont observé une hausse de la demande de leurs clients ;
- **50 %** anticipent encore une hausse de cette demande au cours des douze prochains mois ;
- **30 %** pensent augmenter leur propre capacité de financement.

La comparaison avec le CLO traditionnel est instructive. Pour les warehouses de CLO fondés sur des prêts largement syndiqués, seulement 15,4 % des dealers actifs déclaraient une hausse de la demande sur les douze mois précédents. Pour les CLO de crédit privé, le chiffre atteint 70 %.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 430" role="img" aria-label="Résultats de l'enquête de la Réserve fédérale de juin 2026 sur le financement warehouse des CLO de crédit privé" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="430" fill="#0c0d10"/>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Le warehouse du crédit privé accélère</text>
  <text x="32" y="60" fill="#8b909b" font-size="11">Enquête Fed, juin 2026. Pourcentages parmi les dealers actifs lorsque précisé.</text>

  <text x="42" y="106" fill="#d6d9df" font-size="11">Dealers actifs dans ce financement</text>
  <rect x="300" y="91" width="320" height="20" fill="#23262d"/>
  <rect x="300" y="91" width="160" height="20" fill="#7aa2f7"/>
  <text x="636" y="106" text-anchor="end" fill="#7aa2f7" font-size="12" font-weight="700">50 %</text>

  <text x="42" y="158" fill="#d6d9df" font-size="11">Offre augmentée sur 12 mois</text>
  <rect x="300" y="143" width="320" height="20" fill="#23262d"/>
  <rect x="300" y="143" width="128" height="20" fill="#5eead4"/>
  <text x="636" y="158" text-anchor="end" fill="#5eead4" font-size="12" font-weight="700">40 %</text>

  <text x="42" y="210" fill="#d6d9df" font-size="11">Conditions resserrées</text>
  <rect x="300" y="195" width="320" height="20" fill="#23262d"/>
  <rect x="300" y="195" width="96" height="20" fill="#ff4d87"/>
  <text x="636" y="210" text-anchor="end" fill="#ff4d87" font-size="12" font-weight="700">30 %</text>

  <text x="42" y="262" fill="#d6d9df" font-size="11">Demande client en hausse</text>
  <rect x="300" y="247" width="320" height="20" fill="#23262d"/>
  <rect x="300" y="247" width="224" height="20" fill="#f5b13d"/>
  <text x="636" y="262" text-anchor="end" fill="#f5b13d" font-size="12" font-weight="700">70 %</text>

  <text x="42" y="314" fill="#d6d9df" font-size="11">Demande attendue en hausse</text>
  <rect x="300" y="299" width="320" height="20" fill="#23262d"/>
  <rect x="300" y="299" width="160" height="20" fill="#f5b13d"/>
  <text x="636" y="314" text-anchor="end" fill="#f5b13d" font-size="12" font-weight="700">50 %</text>

  <text x="42" y="366" fill="#d6d9df" font-size="11">Capacité attendue en hausse</text>
  <rect x="300" y="351" width="320" height="20" fill="#23262d"/>
  <rect x="300" y="351" width="96" height="20" fill="#5eead4"/>
  <text x="636" y="366" text-anchor="end" fill="#5eead4" font-size="12" font-weight="700">30 %</text>

  <text x="32" y="404" fill="#8b909b" font-size="9">SOURCE : Federal Reserve, Senior Credit Officer Opinion Survey, questions 88 à 94, 25 juin 2026.</text>
</svg>
<figcaption>Le signal le plus net est la demande : sept dealers actifs sur dix disent qu'elle a augmenté. Dans le même temps, trois sur dix ont resserré leurs conditions de financement.</figcaption>
</figure>

La taille de l'échantillon interdit d'en faire une statistique de l'ensemble du système financier américain. Sa qualité est ailleurs : les vingt répondants sont précisément les principaux intermédiaires du financement de marché en dollars.

La Fed ne mesure donc pas un sondage d'opinion grand public. Elle demande directement aux bilans qui fournissent le financement ce qu'ils voient arriver.

## Le détail le plus intéressant est le resserrement

Trois établissements sur dix ont indiqué avoir resserré les conditions de leurs warehouses de crédit privé.

La Fed leur demande pourquoi.

Les raisons citées comme importantes se concentrent notamment sur deux sujets : **la détérioration de la qualité du collatéral sous-jacent** et **l'incertitude accrue autour de sa valorisation**.

Ce second point est particulièrement important pour le crédit privé.

Un prêt largement syndiqué peut disposer de transactions récentes, de cotations indicatives et d'un univers de comparables. Un prêt direct à une entreprise non cotée est généralement beaucoup moins observable. La valorisation dépend davantage de modèles, de comparables internes et d'informations négociées entre prêteur et emprunteur.

Le warehouse transforme donc un problème de valorisation relativement lent en problème de financement.

Tant que le CLO peut être fermé aux conditions prévues, la difficulté reste gérable. Le warehouse est remboursé par la titrisation.

Une dégradation du collatéral ou une fermeture de la fenêtre de CLO change l'équation : le financement temporaire doit durer plus longtemps, être refinancé autrement ou être réduit.

C'est une inférence économique à partir de la structure du produit, pas le constat d'un stress généralisé aujourd'hui.

## Un CLO de 499 millions de dollars, ligne par ligne

Les filings de la SEC permettent de voir la machine fonctionner sans passer par une estimation de marché.

Le 22 mai 2026, **Barings Private Credit Corporation** a finalisé une titrisation de **499 millions de dollars**, *Barings Private Credit Corporation CLO 2026-1*.

Le portefeuille est décrit dans le Form 8-K comme un ensemble diversifié de prêts commerciaux middle-market.

La structure publiée est la suivante :

| Tranche | Montant | Rating | Coupon |
|---|---:|---|---|
| Class A | 275 M$ | AAA(sf) | SOFR 3 mois + 1,45 % |
| Class B | 65 M$ | AA(sf) | SOFR 3 mois + 2,00 % |
| Class C | 30 M$ | A(sf) | SOFR 3 mois + 2,50 % |
| Subordonnée | 129 M$ | non notée | pas de coupon contractuel |

La tranche AAA représente à elle seule environ **55 %** de la structure. Les trois tranches de dette notées représentent 370 millions de dollars, soit environ **74 %** du financement. Les 129 millions subordonnés représentent environ **26 %**.

Barings a conservé **la totalité des notes subordonnées**. C'est un point important : le gérant garde une exposition explicite à la première perte économique du véhicule.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 450" role="img" aria-label="Structure du CLO Barings Private Credit Corporation CLO 2026-1, 499 millions de dollars, selon le Form 8-K déposé auprès de la SEC" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="450" fill="#0c0d10"/>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Un CLO de crédit privé, anatomie de 499 M$</text>
  <text x="32" y="60" fill="#8b909b" font-size="11">Barings Private Credit Corporation CLO 2026-1, clôturé le 22 mai 2026.</text>

  <rect x="54" y="96" width="350" height="176" fill="#5eead4"/>
  <text x="72" y="128" fill="#0c0d10" font-size="14" font-weight="700">AAA(sf) : 275 M$</text>
  <text x="72" y="150" fill="#0c0d10" font-size="11">≈ 55 % de la structure</text>
  <text x="72" y="172" fill="#0c0d10" font-size="11">SOFR 3 mois + 1,45 %</text>

  <rect x="54" y="278" width="350" height="42" fill="#7aa2f7"/>
  <text x="72" y="304" fill="#0c0d10" font-size="11" font-weight="700">AA(sf) : 65 M$ | SOFR + 2,00 %</text>

  <rect x="54" y="326" width="350" height="30" fill="#f5b13d"/>
  <text x="72" y="346" fill="#0c0d10" font-size="10" font-weight="700">A(sf) : 30 M$ | SOFR + 2,50 %</text>

  <rect x="54" y="362" width="350" height="70" fill="#ff4d87"/>
  <text x="72" y="390" fill="#0c0d10" font-size="12" font-weight="700">Subordonnée : 129 M$</text>
  <text x="72" y="410" fill="#0c0d10" font-size="10">≈ 26 % | conservée intégralement par Barings</text>

  <text x="452" y="112" fill="#d6d9df" font-size="11" font-weight="700">CE QUE LA STRUCTURE FAIT</text>
  <text x="452" y="142" fill="#8b909b" font-size="10">• transforme un pool de prêts privés</text>
  <text x="452" y="160" fill="#8b909b" font-size="10">  en plusieurs profils de risque</text>
  <text x="452" y="192" fill="#8b909b" font-size="10">• donne la priorité de paiement</text>
  <text x="452" y="210" fill="#8b909b" font-size="10">  aux tranches senior</text>
  <text x="452" y="242" fill="#8b909b" font-size="10">• concentre la première perte</text>
  <text x="452" y="260" fill="#8b909b" font-size="10">  dans la tranche subordonnée</text>

  <text x="452" y="306" fill="#f5f6f8" font-size="11" font-weight="700">CE QU'ELLE NE FAIT PAS</text>
  <text x="452" y="336" fill="#8b909b" font-size="10">Elle ne rend pas les prêts</text>
  <text x="452" y="354" fill="#8b909b" font-size="10">sous-jacents liquides ou sans risque.</text>
  <text x="452" y="386" fill="#8b909b" font-size="10">Elle redistribue les pertes et</text>
  <text x="452" y="404" fill="#8b909b" font-size="10">leur ordre d'absorption.</text>

  <text x="32" y="444" fill="#8b909b" font-size="9">SOURCE : SEC, Barings Private Credit Corporation, Form 8-K du 27 mai 2026.</text>
</svg>
<figcaption>Le CLO ne transforme pas la qualité du portefeuille sous-jacent. Il transforme la manière dont les pertes sont distribuées. Dans cette opération, plus de la moitié du financement prend la forme d'une tranche notée AAA(sf), tandis que Barings conserve toute la tranche subordonnée.</figcaption>
</figure>

Le filing montre aussi le mouvement de financement sous-jacent.

Le véhicule CLO utilise le produit de l'émission pour acheter des prêts à **BPC Funding LLC**, une filiale de Barings. BPC Funding prévoit ensuite d'utiliser le produit de ces ventes pour réduire l'endettement d'une **facilité de crédit revolving senior secured** existante.

Autrement dit, la titrisation remplace une partie d'un financement antérieur par une structure de dette plus longue et découpée en tranches.

Le document ne dit pas que cette facilité revolving était un warehouse CLO au sens exact du questionnaire de la Fed. Il montre toutefois le même principe de bilan : des prêts existent et sont financés avant d'être transférés au véhicule de titrisation, puis le produit de la titrisation réduit le financement antérieur.

BNP Paribas Securities Corp. apparaît comme **initial purchaser** des notes. Cette fonction décrit un rôle de placement et d'intermédiation dans la transaction. Elle ne permet pas de conclure que BNP Paribas conserve ces titres dans son propre bilan.

Cette nuance compte.

## La banque revient à plusieurs endroits

Le [Financial Stability Board](https://www.fsb.org/2026/05/report-on-vulnerabilities-in-private-credit/) décrit les banques comme un nœud central de l'écosystème du crédit privé.

Elles peuvent fournir des lignes aux fonds, financer des emprunteurs parallèlement aux fonds privés, financer des véhicules, intervenir dans les CLO et fournir le warehouse qui précède leur émission.

Le FSB souligne également que des banques peuvent acheter des tranches de CLO de crédit privé, généralement les plus senior, et fournir le financement d'entrepôt aux gérants.

La frontière entre « banque » et « non-banque » devient alors moins utile que la cartographie des fonctions.

Le prêt peut avoir été originé par un fonds.

Le warehouse peut être financé par une banque.

Le CLO peut être placé par un dealer.

La tranche senior peut être achetée par un investisseur institutionnel, y compris potentiellement une banque.

La tranche subordonnée peut rester chez le gérant.

Chaque étape a un porteur de risque différent, mais toutes appartiennent à la même chaîne de crédit.

## Pourquoi transformer du crédit privé en CLO ?

Le CLO résout plusieurs problèmes à la fois.

Pour le gérant, il crée un financement à durée longue, répartit le coût du capital entre plusieurs catégories d'investisseurs et peut libérer une facilité revolving ou un warehouse utilisé en amont.

Pour l'investisseur senior, il fournit une exposition structurée à un portefeuille de prêts qui serait difficile à acheter prêt par prêt.

Pour l'investisseur subordonné, il offre un levier économique sur les flux du portefeuille en échange de l'absorption des premières pertes.

La structure peut donc améliorer le financement sans créer de nouveau risque économique par magie.

Elle **reconditionne** un risque déjà présent.

C'est précisément pourquoi la qualité de la tranche senior dépend de plusieurs coussins : subordination, diversification, tests de couverture, qualité du portefeuille et règles qui déterminent l'utilisation des flux lorsque la performance se dégrade.

Le rating AAA concerne la tranche, pas chaque prêt qui se trouve en dessous.

Cette différence est fondamentale.

## Un actif illiquide peut produire une dette très bien notée

Le mécanisme n'a rien d'absurde.

Un portefeuille composé de prêts spéculatifs peut financer une tranche senior très bien protégée si suffisamment de pertes doivent être absorbées avant qu'elle soit touchée.

Le Form 8-K de Barings le montre visuellement : 224 millions de dollars de tranches A, B, C et subordonnées se trouvent sous les 275 millions de AAA.

La priorité des flux et la subordination donnent donc au détenteur de la tranche senior une exposition très différente de celle du prêteur direct.

Cette transformation devient problématique uniquement si les hypothèses qui séparent les tranches du risque sous-jacent se révèlent trop optimistes : corrélations de défaut, recouvrements, valorisations, qualité des covenants ou diversification réelle du portefeuille.

Le crédit privé ajoute une difficulté particulière : beaucoup de ces paramètres sont moins facilement observables en temps réel que dans les marchés de prêts syndiqués.

## La valorisation devient une question de financement

C'est probablement le signal le plus neuf du questionnaire de juin.

Les dealers qui ont resserré leurs warehouses ne citent pas seulement une baisse générale de leur appétit pour le risque.

Ils citent la **qualité du collatéral** et l'**incertitude de valorisation**.

Cette combinaison est importante.

Dans un fonds fermé financé par des investisseurs patients, une valorisation incertaine peut rester un problème comptable ou de gouvernance pendant un certain temps.

Dans une facilité garantie, la même incertitude affecte directement le montant que le prêteur accepte d'avancer, le haircut exigé et les conditions de refinancement.

Le passage par le warehouse rapproche donc le crédit privé d'une logique de marché : l'actif qui n'avait pas besoin d'être vendu aujourd'hui doit désormais convaincre un prêteur de sa valeur aujourd'hui.

C'est une transformation discrète mais structurante.

## Le risque de warehouse est un risque de fenêtre

La plupart du temps, le warehouse remplit exactement sa fonction.

Les prêts sont accumulés. Le CLO est émis. La facilité est remboursée. Les investisseurs financent ensuite le portefeuille avec une structure de passif relativement stable.

Le stress intéressant commence lorsque la dernière étape devient difficile.

Une hausse rapide des spreads, une dégradation du portefeuille ou une baisse de l'appétit pour les tranches senior peut rendre l'émission plus chère ou retarder sa fermeture.

Le warehouse reste alors ouvert plus longtemps que prévu.

Le gérant peut devoir apporter davantage de capital, accepter de moins bonnes conditions ou attendre une nouvelle fenêtre. Le dealer conserve de son côté une exposition garantie à un portefeuille dont la sortie était initialement conçue comme temporaire.

Cette dynamique ne signifie pas qu'un warehouse équivaut à une banque ayant repris tout le risque du crédit privé. Le financement est collatéralisé, les haircuts et covenants protègent le prêteur, et le gérant conserve généralement du capital dans la structure.

Le point de fragilité est ailleurs : **la capacité du système à transformer rapidement des prêts privés en dette de CLO devient elle-même une source de financement du crédit privé.**

Lorsque cette capacité se contracte, le problème peut remonter de la titrisation vers l'origination.

## Un marché non bancaire qui dépend encore du bilan bancaire

Le paradoxe du crédit privé devient plus clair.

Il concurrence les banques dans l'origination de prêts.

Il dépend néanmoins d'elles pour plusieurs couches de financement et d'intermédiation.

Le FSB estime la taille du marché privé entre **1 500 et 2 000 milliards de dollars** à fin 2024 et souligne que ses interconnexions avec les banques, les assureurs et le private equity se renforcent. Les données rassemblées par ses membres identifient environ **220 milliards de dollars** de lignes bancaires tirées et non tirées vers les fonds de crédit privé, tout en reconnaissant d'importantes lacunes de données.

Aux États-Unis, le rapport de stabilité financière de la Fed de mai 2026 indique que les engagements de crédit des banques envers l'ensemble des autres entités financières ont atteint **2 600 milliards de dollars** au quatrième trimestre 2025. La catégorie private equity, BDC et véhicules de crédit privé en représente la plus grande composante.

En Europe, l'EBA mesurait près de **150 milliards d'euros** d'expositions de grandes banques aux fonds de crédit privé et gestionnaires associés en juin 2025.

Aucun de ces chiffres ne mesure spécifiquement les warehouses de CLO de crédit privé.

Ils montrent autre chose : le warehouse s'ajoute à un réseau de liens déjà dense.

## Le bon indicateur à surveiller

Le nombre de CLO émis est utile.

Les défauts des emprunteurs le sont aussi.

Mais si l'on veut détecter une tension avant qu'elle soit visible dans les pertes réalisées, le warehouse mérite une place particulière.

Quelques signaux peuvent devenir informatifs :

- resserrement des haircuts et des covenants ;
- baisse de la capacité des dealers à ouvrir de nouvelles facilités ;
- durée plus longue entre accumulation des prêts et fermeture du CLO ;
- hausse des spreads nécessaires pour placer les tranches senior ;
- augmentation des prêts qui restent durablement dans les véhicules de préfinancement ;
- écarts croissants entre valorisations internes des prêts et valeurs acceptées par les prêteurs garantis.

La Fed vient précisément d'ouvrir une fenêtre officielle sur une partie de ces conditions.

Pour l'instant, le message n'est pas celui d'un arrêt.

La demande augmente fortement, les dealers restent présents et une partie prévoit même d'accroître sa capacité.

Le signal de risque est plus subtil : **la croissance se poursuit au moment même où plusieurs prêteurs commencent à demander davantage de protection contre la qualité et la valorisation des actifs qu'ils financent.**

C'est rarement le signe d'un marché en crise.

C'est souvent celui d'un marché qui arrive à un stade où sa plomberie devient aussi importante que ses performances affichées.

### Ce que l'article établit

Le marché des private credit CLOs utilise du financement warehouse fourni par de grands dealers. La Fed observe une forte hausse de la demande pour ces facilités en 2026, en même temps qu'un resserrement chez une partie des prêteurs. Les raisons citées touchent directement la qualité et la valorisation du collatéral.

Les filings SEC montrent comment un portefeuille de prêts privés peut ensuite être refinancé en plusieurs tranches, dont une large tranche AAA, tandis que le gérant conserve une tranche subordonnée absorbant les premières pertes.

### Ce qu'il n'établit pas

Ces éléments ne démontrent pas une crise du crédit privé ni une détérioration généralisée des CLO.

Le questionnaire de la Fed porte sur un petit nombre de très grands intermédiaires et décrit des directions de marché, pas des montants totaux. Le filing Barings est un cas réel utile pour comprendre la mécanique, pas un échantillon représentatif de toutes les transactions.

L'article ne suppose pas non plus que les banques conservent systématiquement les tranches qu'elles placent. Un *initial purchaser* ou un arrangeur peut distribuer les titres à d'autres investisseurs.

### Sources primaires

- [Federal Reserve, Senior Credit Officer Opinion Survey on Dealer Financing Terms, June 2026](https://www.federalreserve.gov/data/scoos/scoos-202606.htm)
- [Federal Reserve, Financial Stability Report, May 2026, Leverage in the Financial Sector](https://www.federalreserve.gov/publications/2026-may-financial-stability-report-leverage.htm)
- [Financial Stability Board, Report on Vulnerabilities in Private Credit, 6 May 2026](https://www.fsb.org/2026/05/report-on-vulnerabilities-in-private-credit/)
- [SEC EDGAR, Barings Private Credit Corporation, Form 8-K, 27 May 2026](https://www.sec.gov/Archives/edgar/data/1859919/000185991926000047/bdc-20260522.htm)
- [Federal Reserve, Life Insurers' Role in the Intermediation Chain of Public and Private Credit to Risky Firms, 21 March 2025](https://www.federalreserve.gov/econres/notes/feds-notes/life-insurers-role-in-the-intermediation-chain-of-public-and-private-credit-to-risky-firms-20250321.html)
- [European Banking Authority, Risk Assessment Report, June 2026](https://www.eba.europa.eu/publications-and-media/publications/risk-assessment-report-june-2026)

*Données et sources vérifiées au 18 août 2026.*
