---
title: "Lire la donnée on-chain : ce que la blockchain montre, et ce qu'elle masque"
description: "Guide de référence sur la donnée on-chain : le registre public permanent face aux dépôts réglementaires à retard, comment lire l'activité (adresses actives, flux d'exchange), la valorisation (capitalisation réalisée, MVRV, SOPR, NVT) et la DeFi (TVL, ses doubles comptes), puis surtout ce que la chaîne ne dit pas. Une adresse n'est pas une identité, l'essentiel du trading reste hors chaîne, et les étiquettes sont l'œuvre de fournisseurs faillibles."
summary: "La donnée on-chain regroupe les transactions et soldes inscrits publiquement sur une blockchain. Radicalement transparente et en temps réel, elle se lit avec des métriques (adresses actives, flux d'exchange, MVRV, SOPR, TVL) et surtout des heuristiques d'étiquetage : la chaîne montre tout, mais une adresse n'est pas une identité et l'essentiel du trading reste hors chaîne."
pubDate: 2026-06-29T19:30:00+02:00
updatedDate: 2026-06-29T19:30:00+02:00
tags: ["crypto", "on-chain", "data"]
category: crypto
draft: false
---

*Une société cotée ne révèle ses positions qu'une fois par trimestre, avec quarante-cinq jours de retard, dans un formulaire normalisé. Une blockchain publique, elle, inscrit chaque transaction dans un registre permanent, consultable par tous, en quelques secondes. C'est l'inverse exact du modèle réglementaire : pas de délai, pas de déclarant, pas de filtre. On pourrait croire l'opacité vaincue. Elle ne l'est pas, elle a seulement changé de forme. Ce guide montre comment lire ce registre, quelles métriques portent un signal, et pourquoi la transparence radicale de la chaîne n'est jamais une lisibilité immédiate.*

## Le registre public permanent

Une blockchain publique est une base de données répliquée et horodatée où chaque transaction validée reste inscrite définitivement. Tout est lisible : montants, adresses, dates, soldes. Là où la lecture d'un [formulaire 13F](/guides/analyser-13f-sec/) ou d'un [formulaire 4](/guides/analyser-form-4-sec/) suppose d'attendre un dépôt trimestriel ou de quelques jours, la donnée on-chain est continue et brute. La vérité de référence n'est pas un fournisseur tiers, c'est le réseau lui-même : faire tourner son propre nœud donne accès à l'intégralité de l'historique, sans intermédiaire.

Deux grands modèles de comptabilité coexistent, et ils changent la façon de lire. Bitcoin fonctionne en UTXO, des « sorties de transaction non dépensées » : un solde n'est que la somme de fragments reçus et pas encore redépensés, ce qui permet de dater précisément chaque pièce à son dernier mouvement. Ethereum fonctionne en modèle de comptes, plus proche d'un livre de soldes, mieux adapté aux contrats intelligents. Cette différence explique pourquoi certaines métriques se calculent nativement sur Bitcoin et de façon approchée ailleurs.

La promesse est donc forte : un audit permanent, ouvert, sans permission. La difficulté, qui occupe tout le reste de ce guide, est que des données complètes ne sont pas des données interprétées. Entre le registre brut et un signal exploitable, il faut des conventions, des étiquettes et du jugement.

## Lire l'activité : adresses, transactions, flux

La métrique d'activité la plus citée est le nombre d'adresses actives, soit les adresses ayant émis ou reçu une transaction sur une période. Elle approche l'usage du réseau, mais ce n'est pas un compteur d'utilisateurs : une même personne peut détenir des centaines d'adresses, et à l'inverse une plateforme d'échange en regroupe des millions pour des millions de clients. Lire les adresses actives comme un nombre d'utilisateurs est l'erreur de débutant la plus commune.

Le volume et le nombre de transactions souffrent du même travers à l'état brut. Une transaction Bitcoin renvoie souvent de la monnaie à son émetteur sous forme de « sortie de change », et les transferts internes d'une plateforme gonflent les compteurs sans correspondre à une activité économique réelle. C'est pourquoi les fournisseurs publient des versions ajustées, qui écartent les transferts entre adresses d'une même entité ou les sorties de très courte durée de vie. Sans cet ajustement, on mesure du bruit.

Les flux d'exchange sont le signal le plus surveillé par les bureaux institutionnels. L'idée est simple : des pièces qui entrent sur les plateformes peuvent être prêtes à être vendues, des pièces qui en sortent vers l'auto-conservation traduisent plutôt une intention de détention longue. La réserve d'exchange, le stock total détenu sur les adresses de plateformes, recule depuis des années : d'un pic d'environ **3,2 millions** de bitcoins en février 2020, elle est tombée autour de **2,40 millions**, soit près de **12 %** de l'offre, fin avril 2026, d'après les agrégateurs on-chain. Lu seul, ce reflux raconte une histoire d'accumulation. Lu de près, il est brouillé par un phénomène récent : depuis le lancement des ETF au comptant début 2024, plus de **1,45 million** de bitcoins ont rejoint la conservation institutionnelle, souvent classée dans les mêmes adresses d'exchange par certains fournisseurs. Une partie du « retrait » n'est donc pas une mise en chambre froide par des particuliers, mais un rééquilibrage d'ETF.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 320" role="img" aria-label="Recul des réserves de bitcoins sur les plateformes d'échange entre 2020 et 2026" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="320" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Les réserves quittent les plateformes</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Bitcoins détenus sur les adresses d'exchange, en millions. Un signal devenu ambigu.</text>
  <text x="40" y="104" fill="#8b909b" font-size="12">févr. 2020</text>
  <rect x="150" y="92" width="470" height="22" fill="#8b909b" opacity="0.8"></rect>
  <text x="628" y="109" fill="#d6d9df" font-size="12" font-weight="700">3,2 M</text>
  <text x="40" y="150" fill="#5eead4" font-size="12">avr. 2026</text>
  <rect x="150" y="138" width="352" height="22" fill="#5eead4" opacity="0.9"></rect>
  <text x="510" y="155" fill="#5eead4" font-size="12" font-weight="700">2,40 M · ≈ 12 % de l'offre</text>
  <line x1="40" y1="190" x2="680" y2="190" stroke="#2a2c33" stroke-width="1"></line>
  <text x="40" y="218" fill="#ff4d87" font-size="12" font-weight="700">Le piège : la destination du « retrait »</text>
  <text x="40" y="242" fill="#d6d9df" font-size="12">Depuis 2024, plus de 1,45 M de bitcoins sont passés en conservation d'ETF,</text>
  <text x="40" y="262" fill="#d6d9df" font-size="12">souvent classés dans les mêmes adresses d'exchange par les fournisseurs.</text>
  <text x="40" y="282" fill="#8b909b" font-size="12">Une sortie n'est donc plus forcément une mise en auto-conservation.</text>
  <text x="40" y="306" fill="#8b909b" font-size="11">Source : données on-chain agrégées (CryptoQuant, Glassnode), avril 2026.</text>
</svg>
<figcaption>Les réserves de bitcoins sur les plateformes sont passées d'environ **3,2 millions** en février 2020 à près de **2,40 millions** fin avril 2026, soit environ **12 %** de l'offre. Mais une partie du recul reflète le transfert de plus de **1,45 million** de bitcoins vers la conservation d'ETF, souvent comptée dans les mêmes adresses : le signal « sortie égale accumulation » s'est brouillé. Sources : agrégateurs on-chain (CryptoQuant, Glassnode).</figcaption>
</figure>

## Lire la valorisation : capitalisation réalisée, MVRV, SOPR, NVT

La donnée on-chain permet une valorisation impossible sur les marchés classiques : un coût de revient moyen du marché. La capitalisation réalisée valorise chaque pièce au prix de son dernier mouvement sur la chaîne, et non au prix du jour. Divisée par l'offre, elle donne le prix réalisé, lu comme le coût de revient on-chain des détenteurs. Le rapport entre la capitalisation de marché et la capitalisation réalisée, le MVRV, mesure alors le profit ou la perte latente moyenne du marché. Introduit par Murad Mahmudov et David Puell en octobre 2018, il sert d'indicateur de régime : au-dessus d'environ **3,5**, le marché est historiquement en zone d'euphorie, les sommets de cycle de décembre 2017 et novembre 2021 s'étant inscrits autour de **4,0** puis **3,2** ; en dessous de **1**, le détenteur moyen est en perte, zone de capitulation et d'accumulation.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 250" role="img" aria-label="Zones de lecture du ratio MVRV de Bitcoin et sommets de cycle" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="250" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Le MVRV comme oscillateur de cycle</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Profit ou perte latente moyenne du marché. Repère de régime, pas de timing.</text>
  <rect x="60" y="92" width="132" height="36" fill="#ff4d87" opacity="0.85"></rect>
  <rect x="192" y="92" width="320" height="36" fill="#8b909b" opacity="0.55"></rect>
  <rect x="512" y="92" width="148" height="36" fill="#f5b13d" opacity="0.9"></rect>
  <text x="66" y="115" fill="#0c0d10" font-size="11.5" font-weight="700">&lt; 1 capitulation</text>
  <text x="300" y="115" fill="#f5f6f8" font-size="11.5" font-weight="700">1 à 3,5 : zone neutre</text>
  <text x="518" y="115" fill="#0c0d10" font-size="11.5" font-weight="700">&gt; 3,5 euphorie</text>
  <line x1="60" y1="140" x2="660" y2="140" stroke="#2a2c33" stroke-width="1"></line>
  <text x="60" y="156" fill="#8b909b" font-size="11">0</text>
  <text x="186" y="156" fill="#8b909b" font-size="11">1</text>
  <text x="506" y="156" fill="#8b909b" font-size="11">3,5</text>
  <line x1="600" y1="86" x2="600" y2="134" stroke="#5eead4" stroke-width="2"></line>
  <text x="566" y="180" fill="#5eead4" font-size="11">nov. 2021 ≈ 3,2</text>
  <line x1="648" y1="86" x2="648" y2="134" stroke="#5eead4" stroke-width="2"></line>
  <text x="612" y="198" fill="#5eead4" font-size="11">déc. 2017 ≈ 4,0</text>
  <text x="60" y="228" fill="#8b909b" font-size="11">MVRV = capitalisation de marché / capitalisation réalisée. Sources : Mahmudov et Puell (2018) ; Glassnode.</text>
</svg>
<figcaption>Le MVRV oppose la valeur de marché au coût de revient on-chain des détenteurs. Au-dessus de **3,5**, le marché est historiquement euphorique, les sommets de **2017** et **2021** s'étant inscrits vers **4,0** et **3,2** ; sous **1**, le détenteur moyen est en perte. C'est un repère de régime, jamais un signal de timing précis. Sources : Murad Mahmudov et David Puell (2018), Glassnode.</figcaption>
</figure>

Deux compléments affinent la lecture. Le SOPR, ou ratio de profit des sorties dépensées, indique si les pièces déplacées un jour donné le sont en gain, au-dessus de **1**, ou en perte, en dessous ; sa version ajustée ignore les pièces dépensées en moins d'une heure. Le NVT rapporte la capitalisation au volume de transfert on-chain en dollars, comme un cours rapporté à l'activité, à la manière d'un multiple de valorisation. Aucun de ces ratios ne se lit isolément, ni d'un actif à l'autre : un NVT n'a de sens que comparé à l'histoire du même réseau, Bitcoin et Ethereum ne jouant pas le même rôle.

## Lire la DeFi : la TVL et ses doubles comptes

Pour la finance décentralisée, la mesure reine est la valeur totale verrouillée, ou TVL : la somme des actifs déposés dans les contrats d'un protocole, valorisée en dollars. La référence ouverte est DefiLlama, dont les calculs reposent sur des adaptateurs par protocole publiés en source ouverte, ce qui rend la méthode auditable. Mi-juin 2026, la TVL DeFi totale s'établit autour de **71,8 milliards** de dollars sur plus de 450 chaînes, en repli d'environ **37 %** depuis le début de l'année et de près de **60 %** sous le pic de novembre 2021, à **177 milliards**. Ethereum en concentre **53 %**, signe d'une reconcentration.

Trois pièges guettent. La TVL gonfle avec les prix des jetons déposés, donc une hausse peut ne traduire qu'un effet de valorisation, pas un afflux de capital. Le double comptage est réel : un actif déposé, re-déposé puis remis en jeu dans un autre protocole peut être compté plusieurs fois, ce que DefiLlama tente de neutraliser avec des filtres dédiés au staking liquide et aux pools imbriqués. Enfin, la TVL n'est pas la taille du marché : la capitalisation des stablecoins, autour de **314 milliards** de dollars mi-2026, pèse près de **4,4 fois** la TVL DeFi, et c'est elle qui irrigue l'essentiel des échanges. Pour la lecture détaillée de ces réserves, le guide sur les [stablecoins et le GENIUS Act](/guides/stablecoins-genius-act/) montre pourquoi une offre émise n'est pas une offre en circulation.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 280" role="img" aria-label="Concentration et recul de la valeur verrouillée en DeFi mi-2026" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="280" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">La DeFi se contracte et se reconcentre</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Valeur totale verrouillée (TVL), mi-juin 2026. Source : DefiLlama.</text>
  <text x="40" y="92" fill="#d6d9df" font-size="12">Répartition de la TVL (≈ 71,8 Md$)</text>
  <rect x="40" y="102" width="340" height="26" fill="#5eead4" opacity="0.9"></rect>
  <rect x="380" y="102" width="300" height="26" fill="#8b909b" opacity="0.7"></rect>
  <text x="46" y="120" fill="#0c0d10" font-size="12" font-weight="700">Ethereum 53 %</text>
  <text x="386" y="120" fill="#0c0d10" font-size="12" font-weight="700">autres chaînes 47 %</text>
  <text x="40" y="168" fill="#ff4d87" font-size="12" font-weight="700">Un recul marqué en 2026</text>
  <text x="40" y="190" fill="#d6d9df" font-size="12">≈ −37 % depuis janvier · ≈ −60 % sous le pic de nov. 2021 (177 Md$).</text>
  <line x1="40" y1="210" x2="680" y2="210" stroke="#2a2c33" stroke-width="1"></line>
  <text x="40" y="236" fill="#f5b13d" font-size="12" font-weight="700">À relativiser</text>
  <text x="40" y="258" fill="#d6d9df" font-size="12">Les stablecoins (≈ 314 Md$) pèsent près de 4,4 fois la TVL DeFi.</text>
</svg>
<figcaption>Mi-2026, la valeur verrouillée en DeFi tourne autour de **71,8 milliards** de dollars, dont **53 %** sur Ethereum, en repli d'environ **37 %** depuis janvier et de près de **60 %** sous le pic de 2021. Rapportée à la capitalisation des stablecoins, près de **314 milliards**, elle pèse peu. Source : DefiLlama.</figcaption>
</figure>

## Ce que la chaîne masque

Voici le cœur du problème, et la raison pour laquelle la transparence on-chain n'efface pas l'opacité. D'abord, une adresse n'est pas une identité. La chaîne est pseudonyme : relier une adresse à un acteur suppose des heuristiques de regroupement, probabilistes par nature. Un seul ensemble d'adresses de plateforme peut compter près de **25 millions** d'adresses, en croissance permanente, car les exchanges créent sans cesse de nouvelles adresses de change ou de chambre froide. Rattacher tout cela à une entité relève de l'inférence statistique, pas du fait établi.

Ensuite, l'essentiel du trading ne touche jamais la chaîne. Un échange au comptant sur une plateforme centralisée se règle dans son livre interne ; seuls les dépôts et retraits laissent une trace on-chain. Lire la seule chaîne revient donc à observer les portes d'entrée et de sortie d'un bâtiment sans voir ce qui s'y passe. S'ajoutent les étiquettes elles-mêmes, qui dépendent du fournisseur et changent dans le temps : Glassnode prévient que ses séries d'exchange sont révisables, les points récents bougeant à mesure que les étiquettes s'affinent. Deux fournisseurs peuvent livrer deux chiffres pour la même réserve.

Le reste tient à la plomberie. Les actifs emballés, pontés entre chaînes ou logés sur des couches secondaires fragmentent la donnée et créent des risques de double comptage. Les pièces perdues faussent les soldes, au point que certaines métriques écartent les adresses inactives depuis plus de sept ans. Et une offre de stablecoin émise n'est pas une offre en circulation : une part dort dans les trésoreries des émetteurs. La donnée est exhaustive, sa lecture ne l'est jamais.

## Lire l'on-chain en pratique

L'outillage est largement gratuit. Les explorateurs de blocs donnent la vérité brute, transaction par transaction. Les plateformes d'analyse comme Glassnode et CryptoQuant offrent des tableaux de bord et des séries en accès gratuit limité, DefiLlama et Dune restent ouverts pour la DeFi, et des services comme Nansen ou Arkham se spécialisent dans l'étiquetage d'entités. Pour un suivi en continu, le site agrège ces signaux dans ses [tableaux de bord](/dashboards/).

La méthode tient en trois principes. Chercher la convergence de plusieurs signaux plutôt que de se fier à une métrique unique : une réserve d'exchange qui baisse, un MVRV bas et un SOPR sous **1** racontent ensemble une histoire qu'aucun des trois ne dit seul. Comparer toujours à l'historique du même actif, jamais d'un réseau à l'autre. Et croiser l'on-chain avec le reste de la macro, car la liquidité mondiale pèse sur les actifs risqués, comme le détaille le guide sur la [masse monétaire M2](/guides/m2-masse-monetaire-risk-on/) et son lien instable avec le Bitcoin. La démarche d'ensemble du site est exposée dans sa [méthodologie](/methodologie/).

Reste la leçon de fond, qui est aussi le paradoxe de la donnée on-chain. La blockchain a rendu public ce que la finance classique garde fermé : positions, soldes, mouvements, en temps réel et sans permission. Mais elle n'a pas supprimé l'opacité, elle l'a déplacée. Hier elle se cachait derrière des dépôts trimestriels et des structures écran ; aujourd'hui elle se loge dans des heuristiques d'étiquetage, des règlements hors chaîne et des conventions de calcul. Lire l'on-chain, ce n'est pas croire que tout est visible, c'est savoir exactement où la donnée s'arrête et où commence l'interprétation.

---

**Sources principales :**

- [Glassnode, « Bitcoin On-Chain Exchange Metrics: The Good, The Bad, The Ugly »](https://research.glassnode.com/exchange-metrics/) : étiquetage des adresses d'exchange par heuristiques et clustering, ensemble d'adresses approchant 25 millions, séries révisables.
- [Glassnode Docs, Addresses et Indicators](https://docs.glassnode.com/basic-api/endpoints/indicators) : définitions des adresses actives et d'accumulation, MVRV ajusté par entité, SOPR ajusté, NVT, prix réalisé.
- [Newhedge, « Bitcoin MVRV Ratio »](https://newhedge.io/bitcoin/mvrv) : introduction du MVRV par Murad Mahmudov et David Puell en octobre 2018, seuils d'euphorie et de capitulation, capitalisation réalisée.
- [TRdesk, « Bitcoin Exchange Reserves »](https://trdesk.com/exchange-reserve) : réserve d'exchange à environ 2,40 millions de bitcoins (≈ 12,1 %) au 29 avril 2026, pic de 3,2 millions en février 2020, conservation d'ETF supérieure à 1,45 million de bitcoins et brouillage du signal de flux.
- [DefiLlama, page d'accueil et méthodologie](https://defillama.com/) : TVL DeFi totale autour de 71,8 milliards de dollars et capitalisation des stablecoins autour de 314 milliards mi-juin 2026, adaptateurs par protocole en source ouverte.
- [CoinLaw, statistiques de marché DeFi 2026 (d'après instantané DefiLlama du 18 juin 2026)](https://coinlaw.io/decentralized-finance-market-statistics/) : TVL en repli de 37,3 % depuis janvier et de 59,6 % sous le pic de novembre 2021 (177,48 milliards), part d'Ethereum à 53,1 %.
- [Bitget Academy, « How Bitcoin Exchange Reserves Impact Price »](https://www.bitget.com/academy/btc-exchange-reserve) : offre illiquide autour de 70 % de l'offre en circulation début 2026, lecture des réserves et de leurs limites.
