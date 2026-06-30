---
title: "Lire la liquidité : réserves, TGA, RRP et le proxy de liquidité nette"
description: "Guide de référence sur la liquidité du système financier : les trois robinets que sont les réserves bancaires, le compte du Trésor (TGA) et les prises en pension inversées (RRP), la formule de liquidité nette que suivent les marchés et ses limites, comment lire la plomberie sur les sources primaires, et le régime de 2026 après la fin du resserrement quantitatif."
pubDate: 2026-06-21T14:00:00+02:00
updatedDate: 2026-06-21T14:00:00+02:00
tags: ["macro", "banques centrales", "liquidité", "trésor", "méthodologie"]
category: fed
summary: "La liquidité nette est un indicateur que suivent les marchés, construit à partir du bilan de la Réserve fédérale diminué du compte du Trésor américain (TGA) et des prises en pension inversées (RRP). C'est un proxy utile de la liquidité disponible, à condition d'en connaître les limites."
draft: false
---

*La liquidité d'un marché n'est pas une humeur, c'est une plomberie. Trois comptes, à la Réserve fédérale et au Trésor américain, font entrer et sortir le cash du système : les réserves bancaires, le compte du Trésor, les prises en pension inversées. Une formule populaire les agrège en un indicateur de « liquidité nette » que des milliers d'opérateurs surveillent comme un baromètre des actifs risqués. Ce guide explique la mécanique réelle, apprend à la lire sur les sources primaires, et signale précisément où ce proxy trompe son monde.*

Posons la formule, puisque c'est elle que tout le monde cite. La liquidité nette est le plus souvent calculée comme le bilan de la Réserve fédérale, diminué du solde du compte général du Trésor et des montants placés dans la facilité de prises en pension inversées au jour le jour. Quand le compte du Trésor ou les pensions inversées baissent, du cash retourne dans le système et la liquidité nette monte ; quand ils gonflent, c'est l'inverse. Tout le reste découle de la compréhension de ces trois robinets.

## Les trois robinets

Le premier robinet est le stock de réserves bancaires, les dépôts que les banques détiennent à la Réserve fédérale. C'est la liquidité ultime de règlement : le carburant avec lequel les banques se soldent entre elles. Quand la Fed achète des titres, elle crédite des réserves et injecte de la liquidité ; quand elle les laisse arriver à échéance sans réinvestir, elle en retire. C'est le mécanisme du [QE](/glossaire/#qe) et du [QT](/glossaire/#qt).

Le deuxième robinet est le compte général du Trésor, le TGA, c'est-à-dire le compte courant de l'État fédéral à la Réserve fédérale. Sa mécanique est contre-intuitive mais décisive : quand le Trésor émet de la dette et accumule du cash, ce cash quitte le système bancaire pour se loger au TGA, ce qui draine les réserves. Quand le Trésor dépense, il réinjecte. Une reconstitution du TGA après un blocage du plafond de la dette est ainsi un puissant assécheur de liquidité, souvent sous-estimé.

Le troisième robinet est la facilité de prises en pension inversées au jour le jour, le RRP, où les fonds monétaires placent leur cash excédentaire contre des titres de la Fed. Tant qu'il était plein, le RRP servait d'amortisseur : il absorbait les excédents et protégeait les réserves des chocs. Vidé, il ne joue plus ce rôle, et chaque tension se reporte directement sur les réserves.

## La formule de liquidité nette, et ses limites

L'attrait de la formule est réel : sur de longues périodes, l'indicateur de liquidité nette a souvent évolué dans le même sens que les actifs risqués, ce qui en a fait un outil de lecture macro popularisé par des analystes du marché monétaire. Quand la liquidité afflue, elle tend à chercher du rendement ; quand elle reflue, les actifs les plus sensibles trinquent d'abord.

L'honnêteté impose toutefois d'en marquer les limites, car c'est là que l'outil devient piège. C'est un proxy, pas une loi : la corrélation avec les marchés est lâche, instable, et dépend du régime monétaire. La formule elle-même varie selon les auteurs, certains partant du bilan total, d'autres des seules réserves, ce qui change les niveaux. Elle ignore la vélocité de la monnaie, le crédit privé, les flux étrangers et le levier hors bilan, autant de canaux qui peuvent dominer à court terme. Surtout, elle se révèle trompeuse aux points de retournement, quand le marché anticipe la plomberie plutôt qu'il ne la subit. La liquidité nette éclaire une tendance de fond, elle ne donne pas de signal d'entrée.

## Lire la plomberie sur les sources primaires

Le grand avantage de ce sujet est que tout est public, gratuit et quotidien ou hebdomadaire. Trois sources suffisent à reconstruire la liquidité nette soi-même, sans intermédiaire.

Le compte du Trésor se suit au jour le jour dans le Daily Treasury Statement, le DTS, publié par le Bureau of the Fiscal Service : il détaille les encaissements et décaissements de l'État et le solde de trésorerie opérationnel. Le bilan de la Fed, les réserves et le RRP se lisent dans le tableau hebdomadaire H.4.1, « Factors Affecting Reserve Balances ». Les taux directeurs et de marché monétaire, dont le taux des pensions inversées, le taux effectif des fed funds et les taux de pension comme le SOFR, sont publiés chaque jour par la Réserve fédérale de New York. Pour qui préfère les séries prêtes à l'emploi, la base FRED de la Fed de Saint-Louis agrège l'ensemble. Reconstruire l'indicateur à la main reste le meilleur moyen d'en comprendre les rouages, et d'éviter d'en être prisonnier.

## Le régime de 2026 : resserrement terminé, RRP à sec

Le décor a changé fin 2025, et tout lecteur de la liquidité doit l'intégrer. Après avoir réduit son bilan d'un pic de **8 900 milliards** de dollars en 2022 à environ **6 500 milliards**, la Réserve fédérale a mis fin à son resserrement quantitatif le **1er décembre 2025**, plus tôt qu'attendu, n'ayant annulé qu'environ la moitié du gonflement de bilan de la période pandémique. Dans le même temps, le RRP, qui culminait au-delà de **2 500 milliards** de dollars en 2023, est tombé près de zéro. La conséquence est structurelle : l'amortisseur a disparu, et les réserves, autour de **2 800 milliards** de dollars fin 2025, soit un plus bas de plus de quatre ans, encaissent désormais seules chaque choc. La Fed vise des réserves dites « amples », de l'ordre de **10 % à 11 %** du PIB, contre environ 13 % aujourd'hui.

## Quand la plomberie se bouche : les signaux de stress

Quand les réserves se rapprochent de la rareté, la moindre secousse fait bouger les taux de financement, et c'est le signal à surveiller. L'épisode fondateur reste septembre 2019, quand les taux de pension ont bondi de quelque 2 % à près de 10 % en une nuit, après que des paiements d'impôts et des règlements de titres eurent vidé les réserves, forçant la Fed à intervenir en urgence. Plus récemment, le **31 octobre 2025**, la Fed a injecté environ **29,4 milliards** de dollars via sa facilité permanente de pension, la plus forte intervention en une journée depuis le début des années 2000, en plein stress de fin de mois sur des réserves au plus bas.

Les indicateurs avancés sont connus : un taux effectif des fed funds qui remonte vers, ou au-dessus, du taux servi sur les réserves ; des taux de pension qui s'écartent ; des tensions de fin de trimestre. Une note de la Réserve fédérale de janvier 2026 sur le « trilemme du bilan » le formalise : plus les réserves baissent par rapport au stock de dette publique, plus les taux de pension deviennent sensibles aux mouvements du TGA, aux émissions du Trésor et aux fins de trimestre. La facilité permanente de pension joue désormais le rôle de plafond censé empêcher un nouveau 2019.

## Pourquoi ça compte pour les marchés

L'enjeu dépasse la technique. Un assèchement de liquidité, qu'il vienne d'une reconstitution du TGA ou d'un choc d'émission, se transmet d'abord aux marchés de financement, puis aux actifs risqués, par le canal du coût et de la disponibilité du collatéral. C'est aussi par là que la dette publique et la monnaie privée se rejoignent : les émetteurs de [stablecoins](/guides/stablecoins-genius-act/), devenus de gros acheteurs de bons du Trésor, ajoutent une demande nouvelle sur le segment court, tandis qu'une reconstitution massive du TGA peut, à l'inverse, drainer le système au pire moment. Suivre la liquidité, ce n'est pas chercher un signal d'achat, c'est connaître le calendrier des grands mouvements de cash, plafond de la dette, échéances fiscales, fins de trimestre, pour ne pas confondre une tension de plomberie avec un changement de cap monétaire.

## Comment lire le risque, pas à pas

Quelques réflexes suffisent. Suivre le TGA au jour le jour via le Daily Treasury Statement, et anticiper ses reconstitutions après un accord sur le plafond de la dette. Lire le RRP et les réserves dans le H.4.1 hebdomadaire pour situer le niveau d'amortisseur restant. Surveiller l'écart entre le taux des pensions et le taux des réserves, ainsi que le taux effectif des fed funds, comme thermomètres de rareté. Marquer au calendrier les fins de trimestre et les grosses échéances fiscales, moments classiques de tension. Et garder la formule de liquidité nette pour ce qu'elle est, une boussole de tendance, jamais un déclencheur d'opération. Le [FOMC](/glossaire/#fomc) pilote les taux, mais la plomberie, elle, se lit dans ces trois comptes.

## Méthodologie

Ce guide s'appuie sur des sources primaires : les communiqués et le tableau hebdomadaire H.4.1 de la Réserve fédérale, la note de recherche de la Fed sur le trilemme du bilan de janvier 2026, l'analyse du bilan fédéral par le Congressional Research Service, les taux de référence publiés par la Réserve fédérale de New York et le Daily Treasury Statement du Bureau of the Fiscal Service. Les niveaux de bilan, de réserves et de RRP sont datés de fin 2025 et début 2026 ; ils évoluent, d'où la date de dernière révision. Toute lecture pratique de liquidité sur l0g.fr reconstruit l'indicateur à partir de ces séries plutôt que de s'en remettre à un chiffre agrégé tout fait, et distingue une tension de plomberie d'un véritable tournant de politique monétaire.

---

**Sources principales :** Federal Reserve, tableau H.4.1 *Factors Affecting Reserve Balances* et communiqués de politique monétaire ; Federal Reserve, FEDS Note *The Central Bank Balance-Sheet Trilemma* (14 janvier 2026) ; Congressional Research Service, *The Federal Reserve's Balance Sheet* ; Federal Reserve Bank of New York, taux de référence (taux des fed funds effectif, taux ON RRP, SOFR, TGCR) et opérations de la facilité permanente de pension ; U.S. Department of the Treasury, Bureau of the Fiscal Service, *Daily Treasury Statement* ; FRED (Federal Reserve Bank of St. Louis) pour les séries agrégées. Les niveaux cités sont datés de fin 2025 et début 2026.
