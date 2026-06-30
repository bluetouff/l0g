---
title: "Comment lire les formulaires 4 de la SEC : transactions d'initiés"
description: "Guide de référence sur le formulaire 4 : qui le dépose, sous quel délai, et comment trier le signal du bruit. La plupart des transactions d'initiés ne disent rien ; l'achat sur le marché libre, lui, parle. Codes de transaction, case 10b5-1, achats contre ventes, lecture sur EDGAR."
pubDate: 2026-06-21T11:00:00+02:00
updatedDate: 2026-06-21T11:00:00+02:00
tags: ["marchés", "régulation", "flux institutionnels", "méthodologie"]
category: marches
summary: "Le formulaire 4 est une déclaration que les dirigeants, administrateurs et actionnaires à plus de 10 % d'une société cotée américaine doivent déposer auprès de la SEC dans les deux jours ouvrés suivant tout changement de leurs avoirs. C'est la fenêtre la plus fraîche sur les transactions d'initiés."
draft: false
---

*Le formulaire 4 est la donnée d'initié la plus fraîche du marché américain : deux jours ouvrés, contre quarante-cinq pour le 13F. Mais la fraîcheur ne fait pas le signal. La majorité des lignes d'un Form 4 sont du bruit comptable : attributions d'actions, exercices d'options, retenues fiscales, ventes programmées des mois à l'avance. Le vrai signal, rare, tient dans un geste précis, l'achat sur le marché libre, que la réglementation rend difficile à truquer. Ce guide explique comment isoler ce geste.*

Posons la définition d'emblée. Le formulaire 4 est une déclaration que les dirigeants, les administrateurs et les actionnaires détenant plus de **10 %** d'une catégorie de titres d'une société cotée américaine doivent déposer auprès de la [SEC](/glossaire/#sec) dans les **deux jours ouvrés** suivant tout changement de leurs avoirs. Tout le reste, son utilité comme ses pièges, se déduit de cette obligation et des règles qui l'encadrent.

## D'où vient le Form 4

Le formulaire découle de la section 16(a) du Securities Exchange Act de 1934. La logique : ceux qui sont au plus près d'une entreprise, ses dirigeants et ses gros actionnaires, doivent rendre publiques leurs propres transactions, pour que le marché voie ce qu'ils font de leur argent. C'est l'un des plus anciens dispositifs de transparence du droit boursier américain.

Le délai actuel de deux jours est récent à l'échelle de cette histoire. Avant la loi Sarbanes-Oxley de **2002**, un initié pouvait attendre le dixième jour du mois suivant pour déclarer. Le scandale Enron a changé cela : la loi a comprimé le délai à deux jours ouvrés, transformant le Form 4 en signal quasi temps réel. C'est ce raccourcissement qui en a fait l'outil de suivi qu'il est aujourd'hui.

## Qui dépose, et selon quel calendrier

Trois catégories de personnes sont concernées : les dirigeants au sens des fonctions exécutives, les administrateurs siégeant au conseil, et tout détenteur de plus de **10 %** d'une catégorie de titres de capital enregistrés. Ces initiés relèvent d'une trilogie de formulaires. Le **formulaire 3** est la déclaration initiale, à déposer dans les dix jours suivant l'entrée en fonction, qui fixe le point de départ des avoirs. Le **formulaire 4** déclare chaque changement, dans les deux jours ouvrés. Le **formulaire 5** est un récapitulatif annuel, à déposer dans les quarante-cinq jours suivant la clôture de l'exercice, pour les opérations exemptées ou omises en cours d'année. Tout se dépose par voie électronique sur [EDGAR](/glossaire/#edgar).

Un élargissement récent mérite d'être noté, parce qu'il date la page. Le **27 février 2026**, la SEC a adopté une règle étendant la section 16 aux dirigeants et administrateurs des émetteurs privés étrangers, jusque-là exemptés, avec une entrée en vigueur autour du **18 mars 2026**. Pour ces émetteurs étrangers, en revanche, les actionnaires à plus de 10 % restent hors du dispositif. Le périmètre des déposants s'est donc agrandi en 2026.

## Ce que contient un Form 4

Le formulaire se lit en deux tableaux. Le **tableau I** couvre les titres non dérivés, l'action ordinaire pour l'essentiel. Le **tableau II** couvre les titres dérivés : options, bons de souscription, titres convertibles. Pour chaque ligne, on lit la date de la transaction, un code en une lettre qui en indique la nature, la quantité, une mention d'acquisition (A) ou de cession (D), le prix, et surtout le nombre de titres détenus après l'opération. Une dernière colonne précise si la détention est directe (D) ou indirecte (I), par exemple via une fiducie ou un véhicule familial.

Cette quantité détenue après l'opération est la donnée la plus utile et la plus négligée. Elle situe la transaction dans l'ensemble du patrimoine de l'initié : un dirigeant qui vend mille actions tout en en conservant deux cent mille n'envoie pas le même message que celui qui solde sa ligne entière.

## Les codes de transaction, ou comment séparer le signal du bruit

C'est ici que la plupart des lectures dérapent. Chaque ligne porte un code, et tous ne se valent pas. Deux codes seulement traduisent une décision de marché volontaire. Le code **P** désigne un achat, sur le marché libre ou de gré à gré. Le code **S** désigne une vente. Ce sont les seuls où l'initié engage ou récupère son propre argent à un prix de marché.

Les autres codes relèvent surtout de la rémunération et de la mécanique, donc du bruit. Le code **A** est une attribution gratuite d'actions par la société, typiquement une rémunération en titres. Le code **M** est l'exercice d'une option déjà détenue. Le code **F** est la remise d'actions à la société pour payer le prix d'exercice ou l'impôt afférent, une simple écriture fiscale qui apparaît pourtant comme une cession. Le code **G** est un don, le code **C** une conversion. Compter une attribution gratuite ou une retenue fiscale comme un signal d'achat ou de vente est l'erreur de lecture la plus répandue. Le tri commence donc par filtrer sur les codes P et S, et à ne traiter le reste qu'avec prudence.

## Pourquoi un achat d'initié pèse plus qu'une vente

Une asymétrie structurelle distingue l'achat de la vente. Un initié achète ses propres actions pour une seule raison plausible : il pense qu'elles vont monter. Il vend, lui, pour mille raisons sans rapport avec sa conviction : diversifier son patrimoine, payer un impôt, financer un projet, exercer des options qui expirent. La littérature financière le confirme depuis longtemps : les achats d'initiés sont nettement plus prédictifs des rendements futurs que les ventes, qui le sont peu.

Deux règles renforcent cette lecture. La section **16(b)** impose la restitution à la société de tout profit réalisé sur des opérations de sens opposé, achat puis vente ou vente puis achat, à l'intérieur d'une fenêtre de **six mois**. Un initié ne peut donc pas acheter pour revendre aussitôt avec profit. La section **16(c)** interdit par ailleurs à l'initié de vendre à découvert les titres de sa propre société. Conséquence : un achat sur le marché libre est un pari engagé, que l'initié ne peut ni couvrir par un short ni déboucler à court terme sans rendre le gain. Cela en fait un signal coûteux à émettre, donc crédible.

## La case 10b5-1, le filtre décisif

Reste un piège majeur du côté des ventes : beaucoup sont décidées des mois à l'avance et ne disent rien de l'opinion du jour. La règle **10b5-1** offre aux initiés une défense contre l'accusation de délit d'initié lorsqu'ils s'engagent, à un moment où ils ne détiennent pas d'information privilégiée, dans un plan préétabli fixant le calendrier et les montants de leurs ventes. Une vente exécutée dans un tel plan est mécanique, pas opportuniste.

Or, depuis le **1er avril 2023**, à la suite des amendements adoptés par la SEC le **14 décembre 2022**, les formulaires 4 et 5 comportent une **case à cocher obligatoire** indiquant si la transaction déclarée relève d'un plan 10b5-1, avec la date d'adoption du plan. Ces mêmes amendements ont introduit un délai de carence, en général **90 jours** pour les dirigeants et administrateurs avant la première vente sous un nouveau plan, interdit les plans qui se chevauchent et exigé une certification de bonne foi. Pour le lecteur, le gain est considérable : une vente cochée 10b5-1, adoptée bien avant, peut être écartée comme du bruit programmé. Une vente non cochée, discrétionnaire, mérite plus d'attention.

## Routine contre opportuniste

La distinction la plus puissante n'est ni dans le code ni dans la case, mais dans le comportement de l'initié dans la durée. Cohen, Malloy et Pomorski, dans une étude de référence publiée au *Journal of Finance* en 2012, séparent les initiés « de routine », qui négocient au même moment chaque année selon un schéma régulier, des initiés « opportunistes », dont les transactions sortent de tout schéma. Leur résultat est net : une fois retirées les transactions de routine, qui représentent plus de la moitié de l'univers, ce sont les transactions opportunistes qui concentrent l'essentiel du pouvoir prédictif. Une stratégie limitée aux seuls initiés opportunistes dégage des rendements anormaux de l'ordre de **82 points de base par mois** en pondération par la capitalisation, là où les transactions de routine n'en produisent pour ainsi dire aucun. Mieux : les transactions opportunistes anticipent les nouvelles et les événements à venir de l'entreprise.

La leçon pratique tient en ceci : une vente régulière, à date fixe, signée d'un cadre qui vend toujours en mars, n'apprend rien. Un achat inhabituel, hors de tout calendrier, d'un dirigeant qui n'achète jamais, est le type de geste à isoler.

## Comment le lire sur EDGAR, pas à pas

Tout est public et gratuit. On recherche la société sur EDGAR, puis on filtre les dépôts sur le type `4`. Chaque dépôt s'ouvre sous une forme lisible et sous sa source XML.

La lecture utile suit quatre réflexes. D'abord, repérer le code : on isole les lignes P et S, on met de côté les A, M et F. Ensuite, vérifier la case 10b5-1 sur les ventes, pour écarter le programmé. Puis lire la fonction du déclarant : un achat du directeur général ou du directeur financier pèse davantage que celui d'un administrateur non exécutif. Enfin, mesurer l'ampleur relative, en rapportant la transaction au nombre de titres détenus après l'opération, et repérer les achats groupés, plusieurs initiés de la même société achetant dans une fenêtre courte, souvent le signal le plus fort.

## Les limites, sans complaisance

Le Form 4 reste un instrument partiel, et le lire honnêtement suppose d'en connaître les angles morts. Les échantillons sont petits : une seule société, parfois un seul initié, statistiquement fragile. Les ventes sont bruitées par nature, et même filtrées du 10b5-1, elles répondent à des motifs personnels. Les dons et les détentions indirectes brouillent la lecture de qui détient réellement quoi. Un actionnaire à plus de 10 % n'a pas nécessairement la connaissance fine d'un dirigeant opérationnel, si bien que tous les initiés ne se valent pas. Les dépôts tardifs existent encore, malgré le délai de deux jours. Et le tableau des dérivés, options et conversions, exige une lecture technique sous peine de contresens. Un achat isolé ne fait jamais une thèse d'investissement.

## La confluence avec le 13F

Un signal rapide et étroit gagne à être croisé avec un signal lent et large. Là où le [formulaire 13F](/guides/analyser-13f-sec/) offre une photo trimestrielle, retardée et en positions longues des grands gérants, le Form 4 offre une donnée fraîche, directionnelle et signée d'un initié. Les deux se complètent : le 13F dit où l'argent institutionnel se positionne, le Form 4 dit si ceux qui dirigent l'entreprise accompagnent ce mouvement de leur propre argent. C'est exactement la logique que nous exploitons dans <a href="https://13flow.eu" rel="noopener">13FLOW</a>, qui croise dépôts 13F et formulaires 4 pour faire ressortir les zones de convergence. Une position que renforcent à la fois des gérants respectés et des initiés opportunistes pèse davantage qu'un signal isolé.

## Méthodologie

Ce guide s'appuie sur des sources primaires : la section 16 du Securities Exchange Act, les formulaires et instructions de la SEC, les communiqués relatifs aux amendements de la règle 10b5-1 et à l'extension de la section 16 aux émetteurs étrangers, ainsi que la recherche académique évaluée par les pairs sur le pouvoir prédictif des transactions d'initiés. Les délais, dates et chiffres ont été vérifiés un à un. Toute lecture pratique de données Form 4 sur l0g.fr part du dépôt brut sur EDGAR, isole les codes P et S, vérifie la case 10b5-1, pondère par la fonction du déclarant, et rappelle qu'un achat isolé ne vaut pas thèse. Les règles évoluant, cette page porte une date de dernière révision.

---

**Sources principales :** SEC, section 16 du Securities Exchange Act de 1934, formulaires 3, 4 et 5 et leurs instructions ; Investor.gov, *Insider Transactions and Forms 3, 4, and 5* ; SEC, communiqué et guide de conformité sur les amendements à la règle 10b5-1 (adoptés le 14 décembre 2022, conformité des formulaires 4 et 5 à compter du 1er avril 2023) ; SEC, règle finale du 27 février 2026 étendant la section 16 aux dirigeants et administrateurs des émetteurs privés étrangers (Holding Foreign Insiders Accountable Act), en vigueur le 18 mars 2026 ; Lauren Cohen, Christopher Malloy et Lukasz Pomorski, « Decoding Inside Information », *The Journal of Finance*, vol. 67, 2012, p. 1009 à 1043 ; Lakonishok et Lee, « Are insiders' trades informative ? », *Review of Financial Studies*, 2001 ; Jeng, Metrick et Zeckhauser, « Estimating the Returns to Insider Trading », *Review of Economics and Statistics*, 2003.
