---
title: "13FLOW : l'argent lourd et l'argent qui sait"
description: "13FLOW industrialise la lecture des 13F-HR et des Form 4 sur SEC EDGAR et les croise en un score de confluence auditable. Décomposition de la méthode : pondération institutionnelle, hygiène des codes de transaction, décroissance temporelle et clusters d'initiés."
pubDate: 2026-06-14
tags: ["13flow", "SEC EDGAR", "13F", "Form 4", "marchés", "analyse fondamentale"]
draft: false
---

Le 13F et le Form 4 sont deux des rares signaux propres que la réglementation américaine rend publics. Le premier expose, chaque trimestre, les positions longues des gérants au-dessus de 100 millions de dollars. Le second capture, sous deux jours ouvrés, les transactions des dirigeants sur le titre de leur propre société. Les deux sont dans le domaine public et lisibles sur EDGAR. [13FLOW](https://13flow.eu) ne prétend pas donner un accès qu'on n'aurait pas : il en industrialise la lecture et, surtout, il les croise, ce que les bases historiques (Dataroma, WhaleWisdom) font mal ou pas du tout.

L'intérêt du croisement tient à une asymétrie. Le 13F est dense mais en retard : jusqu'à 45 jours après la clôture du trimestre, c'est une photo déjà périmée quand on la reçoit. Le Form 4 est quasi temps réel mais individuellement faible : l'achat d'un cadre, isolé, n'a pas de valeur prédictive. Leur intersection corrige les deux défauts d'un coup. Un titre que plusieurs institutions accumulent et que des dirigeants achètent au prix du marché, dans la même fenêtre, c'est la coïncidence de deux populations qui n'ont ni la même information ni les mêmes contraintes. Le bruit s'annule, la conviction reste.

## Construction du score

Le Confluence Score, de 0 à 100, agrège quatre composantes explicites. La largeur institutionnelle : nombre de fonds qui renforcent, pondéré par leur conviction, c'est-à-dire le poids de la ligne dans le portefeuille et pas seulement sa présence. La conviction des initiés : nombre d'acheteurs distincts, séniorité (un achat de CEO ou de CFO pèse plus que celui d'un administrateur), montant engagé. Les dollars effectivement mobilisés des deux côtés. Et un terme d'accord qui récompense l'alignement directionnel des deux signaux. Chaque carte expose sa décomposition pilier par pilier : le score est auditable, pas déclaratif.

## Hygiène du signal

Deux partis pris méthodologiques font la qualité de l'ensemble. Le temps, d'abord : chaque achat d'initié décroît avec une demi-vie d'environ 30 jours, un dépôt de 3 jours ne pèse pas comme un dépôt de 80. La taille relative entre en compte (une ligne augmentée de 30 % n'est pas un achat symbolique), de même que la concentration : plusieurs initiés sur une fenêtre de 14 jours forment un cluster, et c'est le signal fort. Le filtrage par code de transaction, ensuite : seuls les ordres au prix du marché comptent, achats (P) et ventes (S). Les attributions, exercices d'options (M) et retenues fiscales (F) sont parsés mais exclus du score, parce qu'ils ne traduisent aucune décision discrétionnaire d'entrer ou de sortir. C'est justement le bruit que la plupart des trackers d'initiés laissent passer.

## Données et surface

La donnée vient directement des 13F-HR et des Form 4 sur EDGAR, lue à la source, sans agrégateur intercalé. Le mapping CUSIP vers ticker passe par OpenFIGI. Quatre écrans organisent l'outil : Consensus, Funds, Compare, et le tableau Confluence qui ordonne l'univers par convergence. L'outil est en ligne sur [13flow.eu](https://13flow.eu) et son code est public sur [GitHub](https://github.com/bluetouff/13flow).

Reste le cadre, posé sans détour : 13FLOW est un écran, pas un conseil en investissement, et le croisement de deux signaux publics ne garantit aucune performance. Ce qu'il produit, c'est une réduction d'univers défendable sur des données vérifiables. L'analyse commence là où l'outil s'arrête.
