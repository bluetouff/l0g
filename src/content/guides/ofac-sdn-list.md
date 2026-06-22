---
title: "OFAC et la SDN List : peut-on sanctionner du code ?"
description: "Guide de référence sur l'OFAC et la liste des Specially Designated Nationals : comment fonctionne l'arme financière la plus puissante du monde, la règle des 50 %, sa portée sur la crypto, et la limite qu'ont posée les tribunaux américains en 2025 en forçant le délistage de Tornado Cash. Conformité, gel de stablecoins, lecture pas à pas."
pubDate: 2026-06-21T17:00:00+02:00
updatedDate: 2026-06-21T17:00:00+02:00
tags: ["géopolitique", "sanctions", "crypto", "régulation", "méthodologie"]
summary: "L'OFAC est le bureau du Trésor américain qui administre les sanctions économiques. Sa liste des Specially Designated Nationals (SDN) recense les personnes et entités avec lesquelles tout ressortissant américain a interdiction de traiter, et dont les avoirs sont gelés."
draft: false
---

*Un nom sur la SDN List, et l'accès au dollar se ferme. C'est l'arme financière la plus puissante du monde, maniée par un bureau du Trésor américain dont peu connaissent l'existence. Mais la crypto en a testé les limites : en 2025, les tribunaux américains ont forcé l'OFAC à retirer Tornado Cash de sa liste, jugeant qu'on ne peut pas sanctionner du code immuable. Ce guide explique comment la liste fonctionne, comment elle atteint la crypto, et où elle s'arrête.*

Posons la définition. L'OFAC, l'Office of Foreign Assets Control, est le bureau du Trésor américain qui administre et applique les sanctions économiques au service de la politique étrangère et de la sécurité nationale. Sa liste phare, la liste des Specially Designated Nationals and Blocked Persons, la [SDN List](/glossaire/#ofac), recense les personnes et entités avec lesquelles tout ressortissant américain a interdiction de traiter, et dont les avoirs sous juridiction américaine sont gelés.

## Comment fonctionne la SDN List

La mécanique est brutale par conception. Quand une personne ou une entité est ajoutée à la liste, deux effets se déclenchent. D'abord, tous ses avoirs et intérêts dans des biens situés sous juridiction américaine sont bloqués, c'est-à-dire gelés. Ensuite, il devient interdit à tout ressortissant américain de réaliser la moindre transaction avec elle. La responsabilité est objective : une violation engage, même sans intention ni connaissance, ce qui pousse l'ensemble du système financier mondial à une prudence extrême.

La portée dépasse de loin les frontières américaines. Parce que le dollar irrigue le commerce mondial et que la quasi-totalité des banques internationales ont besoin d'un accès au système américain, une inscription sur la SDN List coupe en pratique son cible du circuit financier global. La base juridique est le plus souvent l'International Emergency Economic Powers Act de 1977, activé par des décrets présidentiels ciblant tel pays, tel groupe ou telle activité.

## Le piège de la règle des 50 %

Une subtilité fait tomber les conformités négligentes : la règle des 50 %. Une entité détenue à **50 %** ou plus, directement ou indirectement, par une ou plusieurs personnes inscrites sur la liste, est elle-même réputée bloquée, même si son nom n'y figure pas. Les participations de plusieurs SDN s'additionnent pour atteindre ce seuil. Autrement dit, l'absence d'un nom sur la liste ne suffit pas : il faut remonter la chaîne de propriété. C'est l'erreur de conformité la plus fréquente.

## Au-delà de la SDN List

La SDN List n'est pas le seul instrument. L'OFAC tient d'autres listes, comme celle des sanctions sectorielles, qui restreignent certaines activités sans blocage total, et diverses listes non-SDN. Par ailleurs, des sanctions dites secondaires peuvent viser des acteurs non américains qui traitent avec certains SDN, en les menaçant à leur tour d'exclusion du système américain. La SDN List reste toutefois l'outil le plus tranchant, celui du blocage pur et simple.

## La SDN List à l'ère crypto

Depuis 2018, l'OFAC inscrit aussi des adresses de portefeuilles de cryptomonnaie sur la liste. La logique est la même : interdiction de transiger avec une adresse listée. La Corée du Nord, via le groupe Lazarus, et ses blanchiments massifs de fonds volés ont été un moteur de ces désignations.

Le point pratique est que l'application se déplace vers les émetteurs centralisés. Un émetteur de [stablecoin](/guides/stablecoins-genius-act/) peut, et doit, geler les jetons détenus à une adresse sanctionnée : Tether a ainsi gelé des USDT liés à des adresses inscrites par l'OFAC, par exemple autour de l'exchange russe Garantex. C'est l'un des paradoxes que nous avons documentés à propos de [l'usage de l'USDT sur Tron face à l'OFAC](/posts/iran-peages-ormuz-usdt-tron-ofac/) : la monnaie numérique centralisée devient un point d'application des sanctions, là où la finance décentralisée cherche précisément à y échapper.

## Tornado Cash : peut-on sanctionner du code ?

C'est la question qui a fait jurisprudence, et le cœur de ce guide. En août 2022, l'OFAC a inscrit sur la SDN List Tornado Cash, un protocole décentralisé de mixage sur Ethereum accusé d'avoir blanchi des milliards de dollars, dont des fonds liés à la Corée du Nord. C'était la première fois que l'OFAC visait non pas une personne ou une entreprise, mais un ensemble de contrats intelligents autonomes.

La contestation fut immédiate. Dans l'affaire Van Loon contre Trésor, six utilisateurs ont attaqué la désignation. Le **26 novembre 2024**, la cour d'appel du cinquième circuit leur a donné raison : des contrats intelligents immuables ne sont pas une « propriété » au sens de l'IEEPA, parce que personne ne peut les posséder, les contrôler ni les modifier, pas même leurs développeurs. L'OFAC avait donc outrepassé son autorité. La décision s'appuie notamment sur l'arrêt Loper Bright de 2024, qui a mis fin à la déférence accordée aux agences fédérales.

La suite a confirmé la limite. Le **21 mars 2025**, l'OFAC a retiré Tornado Cash de la SDN List, en invoquant sa propre discrétion face à des « questions juridiques et politiques inédites ». En avril 2025, un tribunal fédéral a même prononcé une injonction permanente interdisant à l'OFAC de réimposer ces sanctions sur les contrats immuables du protocole. L'OFAC a néanmoins maintenu la sanction visant l'un des développeurs au titre du programme Corée du Nord, et les poursuites pénales contre les fondateurs se poursuivent indépendamment. La leçon est nette : l'autorité de l'OFAC sur un protocole véritablement décentralisé est juridiquement bornée, et l'application devra cibler des personnes et des entités, non le code lui-même.

## Ce que cela change pour le risque de conformité

Le délistage de Tornado Cash n'est pas un feu vert. Un mélangeur reste un instrument à très haut risque de blanchiment, la responsabilité objective demeure, et le profil de risque d'une opération ne change pas parce qu'une sanction est levée. La frontière tracée par les tribunaux sépare le code des personnes : on peut poursuivre un développeur ou une entité, plus difficilement un logiciel immuable. Les juges eux-mêmes ont suggéré que le Congrès pourrait mettre à jour l'IEEPA pour viser ces technologies, ce qui reste à faire. Tant que ce n'est pas le cas, la portée des sanctions sur la finance décentralisée demeure incertaine.

## Comment lire et vérifier, pas à pas

Quelques réflexes suffisent. Consulter la source officielle, l'outil de recherche de la liste des sanctions de l'OFAC, plutôt qu'un agrégateur tiers. Ne pas s'arrêter au nom : remonter la chaîne de propriété pour appliquer la règle des 50 %. Pour la crypto, vérifier le statut des adresses concernées, tout en distinguant le statut de sanction du risque de blanchiment, qui peut subsister sans sanction. Garder en tête que la liste évolue vite, désignations comme délistages, d'où l'importance de la dater. Une vérification de sanction protège du risque juridique, elle ne dispense pas de l'analyse du risque réel.

## Méthodologie

Ce guide s'appuie sur des sources primaires : les ressources de l'OFAC sur la SDN List et la règle des 50 %, l'International Emergency Economic Powers Act, le communiqué de délistage du Trésor du 21 mars 2025, et la décision de la cour d'appel du cinquième circuit dans Van Loon contre Department of the Treasury du 26 novembre 2024, ainsi que l'injonction de la cour de district d'avril 2025. Les dates et le déroulé judiciaire ont été vérifiés un à un. Toute analyse de risque de sanction sur l0g.fr part de la liste officielle de l'OFAC, applique la règle des 50 % et distingue le statut de sanction du risque de blanchiment. Les listes évoluant en permanence, cette page porte une date de dernière révision.

---

*Cet article ne constitue en aucun cas un conseil en investissement.*

**Sources principales :** U.S. Department of the Treasury, Office of Foreign Assets Control, ressources sur la *Specially Designated Nationals and Blocked Persons List* et guidance sur la règle des 50 % ; International Emergency Economic Powers Act (IEEPA, 1977) ; OFAC, communiqué de délistage de Tornado Cash du 21 mars 2025 ; United States Court of Appeals for the Fifth Circuit, *Van Loon v. Department of the Treasury*, 122 F.4th 549 (26 novembre 2024) ; United States District Court for the Western District of Texas, injonction d'avril 2025 ; couverture de référence (CoinDesk, analyses de cabinets spécialisés) pour le déroulé et le gel de stablecoins liés à des adresses sanctionnées.
