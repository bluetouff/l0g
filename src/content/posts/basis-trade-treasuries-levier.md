---
title: "Le basis trade sur Treasuries : l'arbitrage à effet de levier au cœur de la dette américaine"
description: "Un seul arbitrage relie le marché repo, les futures et la stabilité de la dette américaine : le basis trade. Estimé autour de 1 000 milliards de dollars, porté par un levier de 15 à 20 fois, il fournit de la liquidité au marché des Treasuries en temps normal, et l'amplifie dangereusement en cas de stress. Anatomie d'un trade que la Fed, l'OFR et le FSB surveillent de près."
pubDate: 2026-06-23T15:00:00+02:00
updatedDate: 2026-06-23T15:00:00+02:00
tags: ["macro", "marchés", "banques centrales", "régulation"]
draft: false
---

*Il existe un arbitrage qui, à lui seul, relie le marché repo, les contrats à terme sur Treasuries et la stabilité du marché de la dette américaine. On l'appelle le basis trade. En temps normal, il rapproche les prix du comptant et des futures, et fournit de la liquidité à un marché de **29 000 milliards** de dollars. En cas de stress, le même mécanisme se retourne : son levier élevé force des débouclages, qui amplifient la chute. Il a contribué à la débâcle des Treasuries de mars 2020, et sa taille n'a cessé de croître depuis. Suite directe de notre [article sur le repo et le collatéral](/posts/repo-collateral-fabrique-liquidite/), voici l'anatomie d'un trade que les régulateurs surveillent comme le lait sur le feu.*

Le basis trade est un arbitrage sur la base, soit l'écart de prix entre une obligation du Trésor au comptant et le contrat à terme correspondant. Le futures cote en général un peu cher par rapport au comptant, parce que des gérants d'actifs achètent massivement des futures pour s'exposer à la duration sans détenir les titres. Un fonds capte cet écart en montant trois jambes simultanées : il achète l'obligation au comptant, vend le contrat à terme, et finance l'achat en [repo](/glossaire/#repo) en mettant l'obligation en garantie. À l'échéance, la base converge vers zéro et l'écart est encaissé.

## La mécanique, et le levier

L'écart capté est minuscule, de l'ordre de quelques points de base. Pour que le trade soit rentable, il faut donc une taille énorme et un levier élevé. Les études de référence, dont celle du comité consultatif d'emprunt du Trésor, retiennent un levier autour de **20 fois**. La marge initiale sur les futures n'est que de **2 à 3 %**, et une large part du financement repo se fait à haircut quasi nul. Selon l'OFR, environ **74 %** des emprunts repo des hedge funds se faisaient à haircut zéro ou négatif, ce qui démultiplie le levier et le risque de liquidation. Concrètement, une position de **100 millions** de dollars peut ne mobiliser que **7 à 8 millions** de capital propre.

<figure class="infographic">
<svg viewBox="0 0 720 320" role="img" aria-label="Les trois jambes du basis trade : achat comptant, vente futures, financement repo" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="320" fill="#0c0d10"/>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">L'anatomie du basis trade</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Trois jambes simultanées pour capter l'écart comptant / futures, avec un fort levier.</text>
  <rect x="40" y="100" width="190" height="80" rx="8" fill="none" stroke="#5eead4" stroke-width="1.5"/>
  <text x="135" y="132" fill="#f5f6f8" font-size="13" text-anchor="middle">1. Achat comptant</text>
  <text x="135" y="152" fill="#8b909b" font-size="11" text-anchor="middle">obligation du Trésor</text>
  <text x="135" y="168" fill="#5eead4" font-size="11" text-anchor="middle">position longue</text>
  <rect x="265" y="100" width="190" height="80" rx="8" fill="none" stroke="#ff4d87" stroke-width="1.5"/>
  <text x="360" y="132" fill="#f5f6f8" font-size="13" text-anchor="middle">2. Vente à terme</text>
  <text x="360" y="152" fill="#8b909b" font-size="11" text-anchor="middle">contrat futures</text>
  <text x="360" y="168" fill="#ff4d87" font-size="11" text-anchor="middle">position courte</text>
  <rect x="490" y="100" width="190" height="80" rx="8" fill="none" stroke="#f5b13d" stroke-width="1.5"/>
  <text x="585" y="132" fill="#f5f6f8" font-size="13" text-anchor="middle">3. Financement</text>
  <text x="585" y="152" fill="#8b909b" font-size="11" text-anchor="middle">repo, collatéral = la jambe 1</text>
  <text x="585" y="168" fill="#f5b13d" font-size="11" text-anchor="middle">levier ~20x</text>
  <text x="360" y="232" fill="#d6d9df" font-size="12" text-anchor="middle">La base converge vers zéro à l'échéance : l'écart est encaissé.</text>
  <text x="360" y="262" fill="#8b909b" font-size="12" text-anchor="middle">Marge initiale futures : 2 à 3 %. Repo souvent à haircut quasi nul.</text>
  <text x="360" y="284" fill="#8b909b" font-size="12" text-anchor="middle">Une position de 100 M$ mobilise environ 7 à 8 M$ de capital.</text>
</svg>
<figcaption>Le trade combine une position longue au comptant, une position courte sur futures, et un financement repo adossé à l'obligation. Le levier vient du repo à faible haircut et de la marge réduite sur futures. Sources : CFTC (MRAC, décembre 2024), comité consultatif d'emprunt du Trésor, OFR.</figcaption>
</figure>

## À quoi il sert, vraiment

Ce trade n'est pas qu'une spéculation. Il existe parce que les gérants d'actifs ont une demande structurelle de futures longs, pour gérer la duration de leurs portefeuilles, et que quelqu'un doit prendre l'autre côté. Les hedge funds à effet de levier remplissent ce rôle, et en se couvrant via le basis trade, ils relient les prix du comptant et des futures et apportent de la liquidité, y compris sur les souches anciennes moins traitées. En somme, le marché des Treasuries s'est mis à dépendre d'acteurs très endettés pour fonctionner sans accroc. C'est la même logique que dans le repo : la liquidité se fabrique sur des bilans contraints.

## La taille, et pourquoi on la mesure mal

Personne ne connaît le chiffre exact, car le trade n'est pas déclaré comme tel. On l'approche par deux proxys : les positions courtes nettes des fonds à effet de levier sur les futures Treasuries, publiées par la [CFTC](/glossaire/#cftc), et les volumes de repo sponsorisé suivis par l'[OFR](/glossaire/#ofr). Le rapport sur la stabilité financière mondiale du FMI d'avril 2026 estime ainsi la taille du trade autour de **1 000 milliards** de dollars, après une croissance rapide. Les positions courtes des fonds à effet de levier sur les contrats à 2, 5 et 10 ans ont dépassé **1 000 milliards** de dollars dès mars 2025. Rapporté à un marché de **29 000 milliards**, le chiffre paraît modeste, mais le risque ne tient pas au volume, il tient au levier et au caractère forcé des sorties.

## Le point de rupture : la spirale de marges

La fragilité est connue et documentée. Quand la volatilité monte, deux choses se produisent en même temps : les chambres de compensation relèvent les marges sur les futures, et les prêteurs repo relèvent leurs haircuts. Le fonds doit alors apporter du cash en urgence. S'il n'y parvient pas, il déboucle, donc il vend ses obligations au comptant, ce qui pèse sur les prix et nourrit encore la volatilité. C'est la spirale de marges décrite par la BIS dès 2020. En mars 2020, le débouclage du basis trade a représenté près de la moitié des ventes de Treasuries des hedge funds selon les travaux de l'OFR, et la Fed a dû intervenir massivement pour stabiliser le marché.

<figure class="infographic">
<svg viewBox="0 0 720 340" role="img" aria-label="La spirale de marges : comment un choc de volatilité force le débouclage du basis trade" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="340" fill="#0c0d10"/>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">La spirale de marges</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Le mécanisme qui transforme l'apporteur de liquidité en amplificateur de stress.</text>
  <rect x="270" y="78" width="180" height="46" rx="8" fill="none" stroke="#ff4d87" stroke-width="1.5"/>
  <text x="360" y="106" fill="#f5f6f8" font-size="12" text-anchor="middle">Volatilité en hausse</text>
  <rect x="500" y="150" width="190" height="46" rx="8" fill="none" stroke="#f5b13d" stroke-width="1.5"/>
  <text x="595" y="172" fill="#f5f6f8" font-size="12" text-anchor="middle">Marges et haircuts</text>
  <text x="595" y="187" fill="#8b909b" font-size="11" text-anchor="middle">relevés</text>
  <rect x="500" y="250" width="190" height="46" rx="8" fill="none" stroke="#f5b13d" stroke-width="1.5"/>
  <text x="595" y="272" fill="#f5f6f8" font-size="12" text-anchor="middle">Appels de marge</text>
  <text x="595" y="287" fill="#8b909b" font-size="11" text-anchor="middle">besoin de cash</text>
  <rect x="270" y="250" width="180" height="46" rx="8" fill="none" stroke="#ff4d87" stroke-width="1.5"/>
  <text x="360" y="272" fill="#f5f6f8" font-size="12" text-anchor="middle">Débouclage forcé</text>
  <text x="360" y="287" fill="#8b909b" font-size="11" text-anchor="middle">vente des Treasuries</text>
  <rect x="40" y="150" width="190" height="46" rx="8" fill="none" stroke="#ff4d87" stroke-width="1.5"/>
  <text x="135" y="172" fill="#f5f6f8" font-size="12" text-anchor="middle">Prix sous pression</text>
  <text x="135" y="187" fill="#8b909b" font-size="11" text-anchor="middle">la volatilité repart</text>
  <path d="M450 101 L500 150" stroke="#8b909b" stroke-width="1.4" marker-end="url(#a)"/>
  <path d="M595 196 L595 250" stroke="#8b909b" stroke-width="1.4" marker-end="url(#a)"/>
  <path d="M500 273 L450 273" stroke="#8b909b" stroke-width="1.4" marker-end="url(#a)"/>
  <path d="M270 262 L135 196" stroke="#8b909b" stroke-width="1.4" marker-end="url(#a)"/>
  <path d="M135 150 L270 101" stroke="#ff4d87" stroke-width="1.6" marker-end="url(#a2)"/>
  <text x="360" y="325" fill="#8b909b" font-size="11" text-anchor="middle">Mars 2020 : le débouclage a représenté près de la moitié des ventes de Treasuries des hedge funds.</text>
  <defs>
    <marker id="a" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="#8b909b"/></marker>
    <marker id="a2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="#ff4d87"/></marker>
  </defs>
</svg>
<figcaption>Un choc de volatilité relève marges et haircuts, déclenche des appels de marge, force le débouclage, et fait repartir la volatilité : une boucle auto-entretenue. Sources : BIS (Schrimpf, Shin, Sushko, 2020), OFR, FEDS Notes.</figcaption>
</figure>

## Les effets attendus du clearing obligatoire

Les régulateurs ne sont pas restés sans réponse. La gouverneure de la Fed Lisa Cook a de nouveau qualifié, le **20 novembre 2025**, les positions des hedge funds sur les Treasuries de vulnérabilité systémique, susceptible de rendre le marché plus vulnérable au stress. Mais le levier principal est ailleurs : la compensation centralisée obligatoire. La règle de la SEC, adoptée fin 2023 puis repoussée d'un an, impose désormais la compensation des transactions au comptant sur Treasuries au **31 décembre 2026**, et celle du repo au **30 juin 2027**. Le périmètre des chambres a été élargi, avec l'agrément de CME en décembre 2025 et d'ICE début 2026, et un nouveau service de FICC pour limiter le double appel de marge.

L'effet est à double tranchant. En interposant une chambre de compensation, on réduit le risque de contrepartie et on rend les sorties plus ordonnées. Mais en imposant des marges là où le repo se faisait à haircut nul, on renchérit le trade et on en réduit la rentabilité, ce qui pourrait en diminuer la taille, ou le pousser vers des recoins moins régulés. La leçon durable rejoint celle du repo : le marché le plus profond du monde s'appuie sur un arbitrage très endetté qui le lubrifie en temps calme et l'assèche en temps de crise. Tant que ce trade existe à cette échelle, la stabilité de la dette américaine dépend, pour partie, de la capacité d'une poignée de fonds à tenir leurs positions quand la volatilité s'emballe.

---

**Sources principales :** FMI, Global Financial Stability Report (avril 2026, taille du trade estimée autour de 1 000 milliards de dollars via proxys CFTC et OFR) ; CFTC, Market Risk Advisory Committee, « The Treasury Cash-Futures Basis Trade and Effective Risk Management » (10 décembre 2024) ; Office of Financial Research, Hedge Fund Monitor et collecte sur le repo compensé ; Réserve fédérale, FEDS Notes sur les positions des hedge funds et la note Barth et Kahn ; BIS, Schrimpf, Shin et Sushko, « Leverage and Margin Spirals in Fixed Income Markets during the COVID-19 Crisis » (2020) ; remarques de la gouverneure Lisa Cook (20 novembre 2025) ; SEC, règle de compensation des Treasuries et calendrier de mise en conformité (extensions du 25 février 2025, échéances des 31 décembre 2026 et 30 juin 2027) ; Federal Reserve Bank of Chicago sur l'effet du mandat de compensation. Chiffres et dates vérifiés un à un.
