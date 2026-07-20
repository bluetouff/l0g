---
title: "Hyperliquid : la bourse on-chain qui rachète son propre token et frappe à la porte de la tradfi"
description: "Hyperliquid est devenu le premier marché de dérivés décentralisé, avec un carnet d'ordres entièrement on-chain et un modèle économique inédit : presque tous ses frais rachètent son propre token. Avec environ 173 milliards de dollars de volume mensuel, des ETF lancés par Bitwise et 21Shares, et des perpétuels sur actions, matières premières et indices, il ouvre des portes vers la finance traditionnelle. Mécanique, modèle, ponts et risques, mis en données."
pubDate: 2026-06-28T19:00:00+02:00
updatedDate: 2026-06-28T19:00:00+02:00
tags: ["crypto", "marchés", "régulation", "tech"]
draft: false
---

*La plupart des bourses crypto sont des boîtes noires : on voit les prix, jamais les rouages. Hyperliquid prend le contre-pied. Son carnet d'ordres, son moteur d'appariement et ses liquidations vivent entièrement sur une blockchain publique, vérifiables en temps réel. En moins de deux ans, ce protocole est devenu le premier marché de dérivés décentralisé, avec un modèle économique qui détonne : la quasi-totalité de ses frais sert à racheter son propre token sur le marché. Et il commence à bâtir des ponts vers la finance traditionnelle, des ETF aux perpétuels sur actions. Voici la machine, son carburant, ses portes, et ses fragilités, mises en données.*

Hyperliquid n'est pas une simple application, c'est une blockchain de couche 1 conçue pour une seule chose, faire tourner une bourse. Elle repose sur deux moteurs partageant le même consensus, baptisé HyperBFT. Le premier, HyperCore, est un carnet d'ordres on-chain capable de traiter jusqu'à **200 000** ordres par seconde, avec une finalité en un bloc. Le second, HyperEVM, lancé le **18 février 2025**, est un environnement compatible Ethereum qui permet de déployer des contrats intelligents accédant directement à la liquidité du carnet d'ordres, sans pont entre deux chaînes. Là où les bourses centralisées gardent leurs entrailles secrètes, chaque ordre, chaque transaction et chaque liquidation y sont publiquement traçables. C'est une promesse de transparence radicale, exactement le terrain que ce journal cherche à éclairer.

## Le poids réel : volumes et parts de marché

Les chiffres situent l'ampleur du phénomène. Sur une fenêtre de trente jours au printemps 2026, Hyperliquid a traité environ **172,63 milliards** de dollars de volume en perpétuels, soit près de **32 %** du volume recensé sur l'ensemble des bourses de dérivés décentralisées, et **3,3** fois le volume du deuxième acteur, Aster. L'intérêt ouvert dépassait **9 milliards** de dollars. Sur une base quotidienne, certaines estimations situent sa domination au-delà de **50 %** du segment, l'écart tenant aux méthodologies et aux soupçons de volumes artificiels chez certains concurrents.

Côté valorisation, et ces chiffres bougent vite, le token HYPE capitalisait autour de **14 milliards** de dollars fin juin 2026, pour une valeur entièrement diluée d'environ **60 milliards**, au dixième rang des cryptoactifs, après un plus haut historique à **76,70** dollars. Le protocole dégage des revenus réels, de l'ordre de plusieurs millions de dollars de frais par jour, soit un rythme annualisé supérieur au **1,3 milliard** de dollars. Ce n'est pas un jeton sans usage adossé à une promesse, c'est une infrastructure de marché qui encaisse des commissions.

<figure class="infographic">
<svg viewBox="0 0 720 300" role="img" aria-label="Volume mensuel en perpétuels : Hyperliquid face aux autres bourses décentralisées" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="300" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Le leader des dérivés décentralisés</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Volume en perpétuels sur 30 jours, printemps 2026, en milliards de dollars. Source : DefiLlama.</text>
  <text x="32" y="104" fill="#5eead4" font-size="12">HYPERLIQUID</text>
  <rect x="220" y="92" width="450" height="26" fill="#5eead4" opacity="0.85"></rect>
  <text x="230" y="110" fill="#0c0d10" font-size="12" font-weight="700">172,63 Md$ · ~32 % du segment</text>
  <text x="32" y="154" fill="#ff4d87" font-size="12">ASTER (no 2)</text>
  <rect x="220" y="142" width="138" height="26" fill="#ff4d87" opacity="0.85"></rect>
  <text x="368" y="160" fill="#d6d9df" font-size="12">52,76 Md$</text>
  <text x="32" y="204" fill="#f5b13d" font-size="12">7 SUIVANTS CUMULÉS</text>
  <rect x="220" y="192" width="300" height="26" fill="#f5b13d" opacity="0.7"></rect>
  <text x="530" y="210" fill="#d6d9df" font-size="12">236,90 Md$</text>
  <text x="32" y="262" fill="#d6d9df" font-size="12">Hyperliquid pèse 3,3 fois le deuxième, et à lui seul près des trois quarts</text>
  <text x="32" y="282" fill="#8b909b" font-size="12">du volume cumulé des sept bourses suivantes. Intérêt ouvert supérieur à 9 milliards.</text>
</svg>
<figcaption>Sur le segment des perpétuels décentralisés, Hyperliquid domine très largement, loin devant le deuxième acteur. Volumes sur 30 jours, printemps 2026. Source : DefiLlama, via tableaux de bord publics.</figcaption>
</figure>

## Le modèle économique : la boucle de rachat

C'est ici que Hyperliquid se distingue vraiment. Le token HYPE a été distribué fin **novembre 2024** par un airdrop, sans capital-risque, sans vente privée, environ **31 %** allant directement à la communauté. Mais l'originalité tient au moteur de valeur. La quasi-totalité des frais de transaction, autour de **97 %** selon les paramètres, est versée à un fonds d'assistance qui rachète du HYPE sur le marché ouvert. En parallèle, les frais de gaz payés sur HyperEVM sont brûlés. Le résultat est une boucle mécanique : plus le volume monte, plus les frais grimpent, plus les rachats pèsent, ce qui soutient la demande pour le token, indépendamment de la spéculation.

Cette logique rapproche HYPE d'une action qui consacrerait tout son résultat à racheter ses propres titres. Sur une période récente de quatre-vingt-dix jours, le protocole a racheté pour environ **135 millions** de dollars de token, contribuant à absorber la pression vendeuse des déblocages. C'est une rareté dans l'univers crypto, un lien direct et automatisé entre l'activité réelle d'une plateforme et la valeur de son jeton. Reste à savoir si ce lien tient à grande échelle, et c'est l'objet de la dernière partie.

<figure class="infographic">
<svg viewBox="0 0 720 320" role="img" aria-label="La boucle de rachat : du volume aux rachats de token HYPE" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="320" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">La boucle de rachat du token</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Environ 97 % des frais rachètent du HYPE. Schéma de principe.</text>
  <rect x="60" y="92" width="170" height="52" rx="8" fill="none" stroke="#5eead4" stroke-width="1.5"></rect>
  <text x="145" y="123" fill="#f5f6f8" font-size="13" text-anchor="middle">Volume de trading</text>
  <rect x="490" y="92" width="170" height="52" rx="8" fill="none" stroke="#f5b13d" stroke-width="1.5"></rect>
  <text x="575" y="123" fill="#f5f6f8" font-size="13" text-anchor="middle">Frais perçus</text>
  <rect x="490" y="232" width="170" height="52" rx="8" fill="none" stroke="#ff4d87" stroke-width="1.5"></rect>
  <text x="575" y="256" fill="#f5f6f8" font-size="13" text-anchor="middle">Fonds d'assistance</text>
  <text x="575" y="273" fill="#8b909b" font-size="10" text-anchor="middle">rachète du HYPE</text>
  <rect x="60" y="232" width="170" height="52" rx="8" fill="none" stroke="#5eead4" stroke-width="1.5"></rect>
  <text x="145" y="256" fill="#f5f6f8" font-size="13" text-anchor="middle">Demande de HYPE</text>
  <text x="145" y="273" fill="#8b909b" font-size="10" text-anchor="middle">soutien au token</text>
  <line x1="230" y1="118" x2="488" y2="118" stroke="#d6d9df" stroke-width="1.6" marker-end="url(#h1)"></line>
  <line x1="575" y1="144" x2="575" y2="230" stroke="#d6d9df" stroke-width="1.6" marker-end="url(#h1)"></line>
  <line x1="488" y1="258" x2="232" y2="258" stroke="#d6d9df" stroke-width="1.6" marker-end="url(#h1)"></line>
  <line x1="145" y1="230" x2="145" y2="146" stroke="#d6d9df" stroke-width="1.6" marker-end="url(#h1)"></line>
  <text x="360" y="110" fill="#8b909b" font-size="11" text-anchor="middle">commissions</text>
  <text x="360" y="250" fill="#8b909b" font-size="11" text-anchor="middle">rachat sur le marché</text>
  <text x="32" y="308" fill="#8b909b" font-size="11">Boucle vertueuse en marché actif, mais dépendante d'un volume cyclique.</text>
  <defs><marker id="h1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="#d6d9df"></path></marker></defs>
</svg>
<figcaption>Le volume génère des frais, dont la quasi-totalité finance le rachat de HYPE sur le marché, ce qui soutient la demande. La boucle est puissante en marché actif, fragile si les volumes refluent. Schéma de principe.</figcaption>
</figure>

## HIP-3 et HIP-4 : l'usine à marchés

Hyperliquid ne s'arrête pas aux perpétuels crypto. En **octobre 2025**, la mise à jour HIP-3 a ouvert la création de marchés perpétuels sans permission : n'importe qui peut désormais lancer un marché en immobilisant du HYPE, sur des matières premières, des actions, des devises ou des indices. Quatre mois après son lancement, cette fonction représentait déjà environ **10 %** des revenus du protocole, portée notamment par des perpétuels sur l'argent métal et le pétrole. En **février 2026**, HIP-4 a ajouté les marchés d'opinion, des contrats binaires sur des événements, élargissant encore l'audience au-delà des seuls traders crypto. La trajectoire est limpide : passer d'une bourse de perpétuels à un système d'exploitation financier on-chain, capable d'héberger presque n'importe quel actif.

## Les portes vers la finance traditionnelle

C'est le cœur du sujet. Hyperliquid ouvre plusieurs accès distincts au monde de la finance classique. Le premier est l'enveloppe réglementée. En **mai 2026**, les gérants Bitwise et 21Shares ont lancé des ETF au comptant sur HYPE, qui rassemblaient plus de **137 millions** de dollars d'encours début juin. Ces produits permettent à un investisseur traditionnel de s'exposer au token sans en assurer la garde, et injectent un capital régulé, moins sensible aux cycles du commerce de détail crypto.

Le deuxième accès est le rapatriement des actifs traditionnels sur la chaîne. Via HIP-3, des perpétuels sur actions, indices, matières premières et devises se négocient désormais dans le même carnet d'ordres transparent que les cryptos. La finance traditionnelle ne vient pas seulement acheter le token, elle voit ses propres sous-jacents devenir des produits négociables sur l'infrastructure d'Hyperliquid.

Le troisième accès est la distribution. Le mécanisme des Builder Codes permet à des plateformes tierces de bâtir leurs propres interfaces sur Hyperliquid en y routant leurs utilisateurs, contre un partage de frais. C'est une logique d'infrastructure en marque blanche, qui transforme le protocole en rails plutôt qu'en simple application. S'y ajoutent des intégrations institutionnelles en cours sur la garde et le règlement. Mises bout à bout, ces portes dessinent une bascule : d'un token de bourse décentralisée vers un actif d'infrastructure de marché, valorisé comme tel. Pour le contexte réglementaire de cette convergence, voir nos analyses de [MiCA](/guides/mica-sigle-par-sigle/) et du [GENIUS Act sur les stablecoins](/guides/stablecoins-genius-act/).

<figure class="infographic">
<svg viewBox="0 0 720 300" role="img" aria-label="Offre en circulation contre offre maximale du token HYPE" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="300" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Le token, et sa dilution à venir</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Offre en circulation contre offre maximale, fin juin 2026. Source : CoinGecko.</text>
  <text x="32" y="104" fill="#5eead4" font-size="12">EN CIRCULATION</text>
  <rect x="220" y="92" width="99" height="26" fill="#5eead4" opacity="0.85"></rect>
  <text x="329" y="110" fill="#d6d9df" font-size="12">~220 millions</text>
  <text x="32" y="154" fill="#8b909b" font-size="12">OFFRE MAXIMALE</text>
  <rect x="220" y="142" width="450" height="26" fill="#2a2c33"></rect>
  <rect x="220" y="142" width="99" height="26" fill="#5eead4" opacity="0.85"></rect>
  <text x="430" y="160" fill="#d6d9df" font-size="12" text-anchor="middle">1 milliard de tokens</text>
  <text x="32" y="214" fill="#d6d9df" font-size="12">Capitalisation environ 14 Md$, valeur entièrement diluée environ 60 Md$.</text>
  <text x="32" y="240" fill="#8b909b" font-size="12">Les déblocages futurs doivent être absorbés par les rachats pour soutenir le cours.</text>
  <text x="32" y="270" fill="#f5b13d" font-size="12">Tension centrale du modèle : rachats contre dilution.</text>
</svg>
<figcaption>Environ 220 millions de HYPE circulent sur un maximum d'un milliard. L'écart entre capitalisation et valeur diluée mesure la dilution à venir, que les rachats doivent absorber. Source : CoinGecko, fin juin 2026.</figcaption>
</figure>

## Les limites et les risques

L'enthousiasme ne dispense pas d'un examen sévère, et plusieurs fragilités méritent d'être posées sans détour. La première est la dilution. Avec environ **220 millions** de tokens en circulation sur un milliard, des déblocages réguliers continueront d'alimenter l'offre, et la mécanique de rachat ne soutient le cours que si elle absorbe ces déblocages. Or les rachats dépendent du volume, lui-même cyclique et sensible à l'appétit pour le risque. En marché baissier, les frais refluent, les rachats faiblissent, et la boucle se grippe au pire moment.

La deuxième fragilité touche la gouvernance et la centralisation. En mars 2025, une position de grande taille sur un token baptisé JELLYJELLY a provoqué un risque de liquidation que l'ensemble des validateurs a résolu en retirant le marché. L'épisode a montré qu'un réseau présenté comme décentralisé pouvait intervenir en urgence de façon très concentrée, et il a posé la question du risque porté par le fonds de liquidité communautaire qui sert d'amortisseur. La troisième est réglementaire. L'accès est restreint dans plusieurs juridictions, dont les États-Unis, et des bourses établies comme le CME font pression sur le régulateur américain pour encadrer ces plateformes, en invoquant les risques de manipulation et de contournement des sanctions. Une exigence d'identification des clients heurterait de plein fouet le modèle sans permission.

Reste enfin un risque de concentration. Qu'un seul protocole domine à ce point les perpétuels décentralisés crée un point de défaillance unique pour tout le segment. Et la mesure même de cette domination prête à débat, les volumes de certains concurrents étant soupçonnés d'être gonflés. La transparence on-chain permet justement de vérifier ces chiffres, ce qui change la nature du débat par rapport aux bourses opaques.

## La leçon Hyperliquid

Hyperliquid est un cas rare où un token crypto correspond à des flux de trésorerie réels et à des données publiquement vérifiables, là où le secteur carbure d'habitude au récit. Ses portes vers la finance traditionnelle sont concrètes, des ETF aux perpétuels sur actions et matières premières, en passant par une distribution en marque blanche et des intégrations de garde institutionnelle. Elles restent toutefois bridées par la réglementation et menacées par la dilution. La vraie question n'est pas de savoir si ce pont existe, il existe, mais s'il tiendra sans recréer l'opacité et la centralisation qu'Hyperliquid prétend remplacer. La bonne nouvelle, pour qui veut juger sur pièces, est que tout se passe sur une chaîne publique. Le verdict s'y lira en données, pas en promesses.

---

**Sources principales :** DefiLlama, tableaux de bord Hyperliquid (volume en perpétuels, frais, revenus, intérêt ouvert, parts de marché des bourses de dérivés décentralisées, acheminement d'environ 97 à 99 % des frais vers le fonds d'assistance) ; CoinGecko (prix, capitalisation d'environ 14 milliards de dollars, valeur entièrement diluée d'environ 60 milliards, offre en circulation d'environ 220 millions sur un milliard, plus haut historique à 76,70 dollars, fin juin 2026) ; documentation Hyperliquid et propositions HIP-3 (octobre 2025) et HIP-4 (février 2026), HyperEVM (18 février 2025), HyperCore et HyperBFT ; reportages de presse spécialisée sur les ETF Bitwise et 21Shares (mai 2026, plus de 137 millions de dollars d'encours), sur les rachats de token et sur l'épisode JELLYJELLY de mars 2025. Les chiffres de marché sont datés de la mi-2026 et évoluent rapidement ; les volumes des plateformes concurrentes sont sujets à caution.
