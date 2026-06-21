---
title: "Comment analyser les formulaires 13F de la SEC"
description: "Guide de référence sur le formulaire 13F : qui dépose, quand, son contenu, sa lecture sur EDGAR, et surtout ses angles morts. Un rétroviseur trimestriel en positions longues, puissant à condition d'en connaître les angles morts."
pubDate: 2026-06-21T10:00:00+02:00
updatedDate: 2026-06-21T10:00:00+02:00
tags: ["marchés", "régulation", "flux institutionnels", "méthodologie"]
summary: "Le formulaire 13F est une déclaration trimestrielle que la SEC impose aux gérants institutionnels exerçant un pouvoir de décision sur plus de 100 millions de dollars de titres américains éligibles. Il liste leurs positions longues, dans les 45 jours suivant la fin du trimestre."
draft: false
---

*Le formulaire 13F est la fenêtre la plus citée sur les portefeuilles des grands gérants américains, et la plus mal lue. C'est un rétroviseur : une photo trimestrielle des positions longues, publiée jusqu'à 45 jours après la fin du trimestre, sans les ventes à découvert, sans les couvertures, sans le hors-bilan. Ce guide explique comment le déposant fonctionne, comment le lire sur EDGAR, et comment éviter les contresens qui transforment une donnée publique en piège.*

En une phrase, pour fixer le vocabulaire : le formulaire 13F est une déclaration trimestrielle que la [SEC](/glossaire/#sec) impose aux gérants institutionnels exerçant un pouvoir de décision sur plus de **100 millions de dollars** de titres américains éligibles. Il liste leurs positions longues, dans les **45 jours** suivant la fin du trimestre. Tout le reste, ses usages comme ses pièges, découle de cette définition.

## D'où vient le 13F, et à quoi il sert

Le formulaire découle de la section 13(f) du Securities Exchange Act de 1934, ajoutée par le Congrès en **1975**. L'objectif affiché était d'accroître la transparence sur les avoirs des grands investisseurs institutionnels, et par là, la confiance dans l'intégrité des marchés américains. L'idée sous-jacente : si les particuliers et les régulateurs peuvent voir quels titres détiennent les plus gros acteurs, le marché est moins opaque.

Cinquante ans plus tard, le 13F est devenu une matière première pour toute une industrie : sites de suivi des « superinvestisseurs », stratégies de réplication des gérants vedettes, recherche académique sur les flux. Cette popularité crée une illusion de précision qu'il faut désamorcer d'emblée. Le 13F n'a jamais été conçu comme un signal d'investissement en temps réel. Il a été conçu comme un instrument de transparence rétrospective. La nuance change tout.

## Qui doit déposer, et selon quel calendrier

Le déclencheur est un seuil de discrétion, pas de richesse. Doit déposer tout « institutional investment manager » qui exerce un pouvoir de décision d'investissement sur au moins **100 millions de dollars** de titres éligibles, mesuré le dernier jour de bourse d'un mois quelconque de l'année civile. La catégorie est large : conseillers en investissement, banques, assureurs, courtiers, fonds de pension, family offices, et même certaines entreprises. Elle vise aussi bien les gérants américains qu'étrangers, dès lors qu'ils utilisent les moyens de commerce inter-États américains.

Le seuil de 100 millions de dollars a été fixé à la fin des années 1970 et n'a jamais été relevé depuis. Une proposition de la SEC, en 2020, de le porter à 3,5 milliards de dollars n'a pas abouti. Conséquence concrète : l'inflation et la hausse des marchés ont mécaniquement élargi le filet, et le 13F capture aujourd'hui un univers de déposants bien plus vaste que ne l'imaginait le législateur de 1975.

Le calendrier est strict. Une fois le seuil franchi, le gérant dépose dans les **45 jours** suivant la fin de l'année civile, puis dans les 45 jours suivant chacun des trois premiers trimestres de l'année suivante. En pratique, les échéances tombent autour du **14 février** (quatrième trimestre), du **15 mai**, du **14 août** et du **14 novembre**. L'obligation se poursuit tant que le seuil reste atteint, et une erreur découverte sur un dépôt passé impose un amendement immédiat.

## Ce que contient un 13F

Un dépôt comporte trois blocs : une page de couverture, une page de synthèse, et surtout une table d'information au format **XML**, qui est le cœur exploitable. Chaque ligne décrit une position : nom de l'émetteur, classe de titre, identifiant **CUSIP**, valeur de marché en dollars à la fin du trimestre, nombre de titres ou montant principal, nature de la discrétion et de l'autorité de vote, et un champ décisif, `putCall`, qui indique si la ligne est une option de vente (PUT) ou d'achat (CALL).

Le périmètre des titres dits « 13(f) » est défini par une liste officielle que la SEC met à jour chaque trimestre. Elle comprend les actions cotées sur les marchés américains, certaines options et bons de souscription, les parts de certains [ETF](/glossaire/#etf), et certains titres de dette convertible. Point souvent oublié : les parts de fonds ouverts, les fonds communs classiques, ne sont pas des titres 13(f) et n'apparaissent jamais. La liste officielle est le seul arbitre de l'éligibilité, et elle évolue d'un trimestre à l'autre.

## Comment le lire sur EDGAR, pas à pas

Tout est public et gratuit sur [EDGAR](/glossaire/#edgar), la base de la SEC. La marche à suivre tient en quelques étapes.

D'abord, identifier le déposant. On recherche le gérant par son nom ou son identifiant CIK dans la recherche EDGAR, puis on filtre les dépôts par type. Le dépôt de détention porte le code `13F-HR` ; un `13F-NT` n'est qu'un avis indiquant qu'un autre gérant déclare les titres à sa place ; un suffixe `/A` signale un amendement.

Ensuite, ouvrir la table d'information. On y lit, ligne à ligne, les positions. Le travail utile commence là : on calcule le poids de chaque ligne en divisant sa valeur par la valeur totale du portefeuille déclaré, ce qui révèle les vraies convictions, invisibles dans une simple liste alphabétique.

Enfin, comparer au trimestre précédent. C'est la lecture la plus instructive : en rapprochant deux dépôts successifs, on identifie les positions nouvelles, soldées, renforcées ou allégées. Un gérant qui double une ligne déjà importante envoie un signal plus fort qu'un autre qui ouvre une position symbolique. La dynamique compte davantage que la photo isolée.

Un réflexe de rigueur, enfin : toujours vérifier le champ `putCall`. Une ligne peut être une option de vente, donc une position baissière, qui apparaît pourtant dans la colonne des valeurs comme n'importe quelle détention. Compter une protection baissière comme un pari haussier est l'erreur de lecture la plus fréquente, et la plus coûteuse.

## Les limites, sans complaisance

C'est ici que la plupart des analyses dérapent, et c'est ici que se trouve la vraie valeur ajoutée d'une lecture honnête. Le 13F est utile précisément dans la mesure où l'on connaît ses angles morts.

Le retard d'abord. Une position au 31 mars peut n'être publiée que le 15 mai. Le gérant a eu six semaines pour en sortir. Le 13F dit où était l'argent, pas où il est. C'est un rétroviseur, jamais un pare-brise.

L'absence de ventes à découvert ensuite. Le 13F ne montre que les positions longues. Ni les shorts, ni la plupart des couvertures n'y figurent, ce qui interdit de déduire l'exposition nette d'un fonds. Un gérant peut afficher une grosse ligne longue tout en étant, au total, neutre ou vendeur via des instruments invisibles. La SEC avait adopté en octobre 2023 un régime de déclaration des positions courtes, la règle 13f-2 et le formulaire Form SHO, précisément pour combler cet angle mort. Mais après un renvoi de la Cour d'appel du cinquième circuit en août 2025, la SEC a, le **3 décembre 2025**, repoussé les premiers dépôts à **2028**. En pratique, à ce jour, le côté vendeur reste invisible.

L'instantané trimestriel ensuite. Tout aller-retour effectué à l'intérieur du trimestre est indétectable : un gérant peut acheter puis revendre une ligne entre deux photos sans laisser de trace. Le 13F ignore aussi le cash, la dette non convertible, les actions cotées hors des États-Unis, les matières premières et les positions privées. Il offre une vue partielle, centrée sur l'actif long en actions américaines.

Le traitement confidentiel enfin. Un gérant peut demander à la SEC de différer la publication de certaines positions, par exemple pendant une phase d'accumulation. Ces lignes manquent alors temporairement. À cela s'ajoutent les règles anti-duplication, qui font qu'une même position n'est déclarée que par un seul gérant d'un groupe, si bien que le déposant nominal n'est pas toujours le détenteur économique réel. Et l'habillage de bilan de fin de trimestre, le « window dressing », peut farder la photo pour l'occasion.

## Bien s'en servir : la logique de confluence

Un rétroviseur reste précieux quand on le croise avec d'autres miroirs. La bonne pratique consiste à ne jamais lire un 13F seul, mais à le confronter à des signaux de natures différentes.

Le [formulaire 4](/glossaire/#form-4) en est le complément naturel. Les transactions d'initiés y sont déclarées sous deux jours ouvrés, ce qui en fait une donnée bien plus fraîche et directionnelle que le 13F : un dirigeant qui achète ses propres actions engage son argent, en temps quasi réel. Là où le 13F est lent et long-only, le Form 4 est rapide et signé. Les déclarations de franchissement de seuil 13D et 13G, à partir de 5 % du capital, ajoutent une lecture d'intention, le 13D signalant souvent une visée activiste.

La confluence entre gérants compte tout autant. Une position que plusieurs maisons respectées renforcent simultanément pèse davantage qu'un pari isolé, même de grande taille. C'est exactement la logique que nous exploitons dans <a href="https://13flow.eu" rel="noopener">13FLOW</a>, qui croise les dépôts 13F et les formulaires 4 pour faire ressortir les zones de convergence entre flux institutionnels lents et signaux d'initiés rapides. Aucun de ces signaux ne vaut isolément ; leur recoupement, lui, réduit le bruit.

## Méthodologie

Ce guide s'appuie exclusivement sur des sources primaires : le texte de la section 13(f), la règle 13f-1, le formulaire et la foire aux questions de la division Investment Management de la SEC, ainsi que les communiqués et ordonnances relatifs à la règle 13f-2 et au Form SHO. Les chiffres et échéances ont été vérifiés une à une. Toute lecture pratique de données 13F sur l0g.fr part de la table d'information brute déposée sur EDGAR, recalcule les poids, signale les lignes d'options, et rappelle systématiquement le décalage de 45 jours. Les règles évoluant, cette page porte une date de dernière révision : un régime comme le Form SHO, repoussé à 2028, peut être amendé d'ici là.

---

*Cet article ne constitue en aucun cas un conseil en investissement.*

**Sources principales :** SEC, Division of Investment Management, *Frequently Asked Questions About Form 13F* ; SEC, section 13(f) du Securities Exchange Act de 1934 et règle 13f-1 ; Investor.gov, *Form 13F* ; SEC, *Short Position and Short Activity Reporting by Institutional Investment Managers* (règle 13f-2 et Form SHO, adoptées le 13 octobre 2023) ; SEC, ordonnance d'exemption du 7 février 2025 et ordonnance du 3 décembre 2025 repoussant les premiers dépôts Form SHO à 2028 ; United States Court of Appeals for the Fifth Circuit, renvoi du 25 août 2025. La liste des titres éligibles est l'*Official List of Section 13(f) Securities*, mise à jour chaque trimestre par la SEC.
