---
title: "RealT en liquidation : le token qui ne possédait pas la maison"
description: "RealT, l'une des plus anciennes plateformes d'immobilier tokenisé, s'est placée en liquidation début juillet 2026. L'enquête de la presse de Détroit montre que ses jetons renvoyaient souvent à des maisons dont la société ne détenait pas l'acte. Autopsie d'un RWA béton, et de la faille qu'il révèle."
pubDate: 2026-07-04T21:08:10+02:00
updatedDate: 2026-07-05
tags: ["crypto", "rwa", "immobilier", "tokenisation"]
draft: false
---
*RealT, l'une des plus anciennes plateformes d'immobilier tokenisé, s'est placée en liquidation début juillet 2026. L'enquête de la presse de Détroit montre que ses jetons renvoyaient souvent à des maisons dont la société ne détenait pas l'acte. Autopsie d'un RWA béton, et de la faille qu'il révèle.*

Les actifs du monde réel tokenisés, les [RWA](/glossaire/rwa/), n'ont jamais autant pesé : autour de 26 à 32 milliards de dollars de valeur sur blockchain en 2026, soit environ quatre fois plus qu'un an plus tôt, selon les données de suivi du secteur (rwa.xyz). Pourtant l'un de leurs pionniers les plus visibles vient de s'effondrer. Début juillet 2026, lors d'un appel communautaire diffusé sur YouTube puis relayé sur Telegram, RealT a annoncé sa liquidation volontaire. Quelque 14 000 investisseurs français seraient concernés, selon le cabinet Delomel, au sein d'une base mondiale répartie dans plus de 150 pays.

## Le modèle : une LLC, une maison, des jetons

RealT, basée en Floride et fondée par les frères Remy et Jean-Marc Jacobson, avait industrialisé une idée simple. Pour chaque bien, une société américaine à responsabilité limitée, une LLC, était censée détenir la maison. Les parts de cette LLC étaient converties en jetons ERC-20 émis sur Ethereum puis sur Gnosis, et vendus par fractions. Le jeton coûtait environ 50 dollars, un bien en comptait plus d'un millier, et chaque maison réunissait souvent plusieurs centaines d'investisseurs. En échange, le détenteur touchait chaque semaine sa quote-part de loyer, versée en [stablecoin](/glossaire/stablecoin/) [USDC](/glossaire/usdc/), pour un rendement annoncé autour de 10 % par an.

Interdite aux investisseurs américains, la plateforme visait le reste du monde, et la France en particulier. Depuis 2019, le portefeuille avait grossi jusqu'à environ 650 maisons tokenisées à Détroit selon les actes recensés par la presse locale, la société en revendiquant près d'un millier. Cette promesse d'un immobilier locatif rendu liquide, fractionné et mondial avait fait de RealT une vitrine du RWA immobilier. La liquidation en fait son cas d'école inversé.

## La chute : quand le loyer se tarit

La mécanique s'est grippée par le bas, là où le béton touche le réel. En 2024, la ville de Détroit engage contre l'entreprise ce que son avocat, Conrad Mallett, décrit comme la plus grande procédure d'abattement de nuisance de son histoire. La plainte vise 408 propriétés et exige des certificats de conformité sous 90 jours, faute de quoi la ville se réserve de faire les travaux aux frais de RealT. L'entité locale, Michigan Realtoken, doit alors à la ville au moins 2 millions de dollars d'arriérés de taxes et d'amendes d'insalubrité, accuse un retard de taxes sur plus de 300 biens, et plus de 200 propriétés risquent la saisie.

Car ces biens étaient en mauvais état. L'enquête du média local Outlier Media recense plus d'un millier d'amendes d'insalubrité et, à partir des données postales, plus de cent logements vacants. En 2025, une juge place les loyers des locataires sous séquestre, réservés aux seules réparations. Privé de loyers encaissables, le modèle s'effondre par sa source : en février 2026, RealT suspend la quasi-totalité des distributions, un geste que certains investisseurs qualifient de vol. Un fiduciaire indépendant, Charles Bullock, prend la main sur les biens en avril, un procès est fixé au 27 mai, et début juillet la liquidation acte la fin de la partie.

## Le jeton ne valait pas l'acte

C'est ici que l'affaire touche au cœur de ce qu'est un actif du monde réel tokenisé. En croisant les registres du comté de Wayne, Outlier Media et la chaîne locale WXYZ mettent au jour un décrochage entre le jeton vendu et le titre de propriété inscrit.

Le cas le plus net : RealT a encaissé 2,72 millions de dollars auprès d'investisseurs pour 39 maisons de l'est de Détroit, alors qu'elle n'avait convenu de les payer que 1,1 million au vendeur. Plus d'un an après la vente des derniers jetons, les actes de ces 39 maisons portaient toujours le nom du vendeur d'origine, Brewer Park Homes, et non celui de RealT. La propriétaire enregistrée, Kathy Makino-Leipsitz, l'a confirmé : le bien était « sous compromis depuis plus d'un an, mais la vente n'a jamais été conclue ». Plus largement, sur 25 biens proposés aux investisseurs en janvier, trois seulement apparaissaient au nom de RealT au registre du comté.

Le jeton promettait donc à son détenteur la qualité de propriétaire, mais le titre, opposable à un juge, restait souvent ailleurs. Le token vivait sur la blockchain ; la maison, dans le droit de l'État du Michigan. Rien ne garantissait que les deux coïncident.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 340" role="img" aria-label="Écart entre les sommes levées auprès des investisseurs et le prix d'achat des biens, et propriété réelle des actes" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="340" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Le jeton d'un côté, l'acte de l'autre</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Cas des 39 maisons de l'est de Détroit, d'après les registres du comté de Wayne.</text>
  <text x="40" y="98" fill="#d6d9df" font-size="12">Encaissé auprès des investisseurs</text>
  <rect x="40" y="108" width="540" height="26" fill="#5eead4" opacity="0.9"></rect>
  <text x="588" y="127" fill="#5eead4" font-size="13" font-weight="700">2,72 M$</text>
  <text x="40" y="160" fill="#d6d9df" font-size="12">Prix que RealT devait payer au vendeur</text>
  <rect x="40" y="170" width="218" height="26" fill="#8b909b" opacity="0.85"></rect>
  <text x="266" y="189" fill="#d6d9df" font-size="13" font-weight="700">1,1 M$</text>
  <line x1="40" y1="222" x2="680" y2="222" stroke="#2a2c33" stroke-width="1"></line>
  <text x="40" y="250" fill="#ff4d87" font-size="13" font-weight="700">Actes de propriété, plus d'un an après la vente des jetons</text>
  <text x="40" y="272" fill="#d6d9df" font-size="12">Les 39 maisons : toujours au nom du vendeur (Brewer Park Homes), pas de RealT.</text>
  <text x="40" y="298" fill="#d6d9df" font-size="12">Sur 25 biens proposés en janvier : 3 seulement inscrits au nom de RealT.</text>
  <text x="40" y="324" fill="#8b909b" font-size="11">Sources : Outlier Media, WXYZ Detroit, Wayne County Register of Deeds.</text>
</svg>
<figcaption>Pour 39 maisons, RealT a levé <strong>2,72 millions de dollars</strong> auprès des investisseurs alors qu'elle ne s'était engagée à en payer que <strong>1,1 million</strong>, et les actes restaient au nom du vendeur d'origine. Sources : Outlier Media, WXYZ Detroit.</figcaption>
</figure>

## Le béton, angle mort du RWA

Cette faille éclaire un paradoxe. Le marché des RWA prospère, mais pas du côté du béton. Six catégories d'actifs tokenisés ont franchi le milliard de dollars sur blockchain : le crédit privé, les matières premières, les bons du Trésor américains, les obligations d'entreprise, la dette souveraine hors États-Unis et les fonds alternatifs institutionnels. Les seuls bons du Trésor tokenisés en représentent autour de 15 milliards, soit près de la moitié du total. L'[immobilier tokenisé](/glossaire/immobilier-tokenise/), longtemps présenté comme l'application phare du secteur, en est l'exact contre-exemple : additionnées, les plateformes comme RealT ou Lofty n'ont jamais dépassé 100 millions de dollars de valeur on-chain, une miette à l'échelle du marché.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 300" role="img" aria-label="Comparaison entre la taille du marché des actifs tokenisés et la part infime de l'immobilier tokenisé" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="300" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Le RWA explose, l'immobilier reste au sol</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Valeur sur blockchain en 2026, en milliards de dollars.</text>
  <text x="40" y="96" fill="#d6d9df" font-size="12">Marché RWA tokenisé (total)</text>
  <rect x="40" y="106" width="600" height="30" fill="#5eead4" opacity="0.35"></rect>
  <rect x="40" y="106" width="288" height="30" fill="#5eead4" opacity="0.9"></rect>
  <text x="44" y="126" fill="#0c0d10" font-size="12" font-weight="700">Bons du Trésor ≈ 15</text>
  <text x="336" y="127" fill="#5eead4" font-size="12" font-weight="700">total ≈ 26 à 32 Md$</text>
  <text x="40" y="176" fill="#d6d9df" font-size="12">Immobilier tokenisé (RealT, Lofty, etc.)</text>
  <rect x="40" y="186" width="3" height="30" fill="#ff4d87" opacity="0.95"></rect>
  <text x="52" y="206" fill="#ff4d87" font-size="12" font-weight="700">&lt; 0,1 Md$</text>
  <line x1="40" y1="244" x2="680" y2="244" stroke="#2a2c33" stroke-width="1"></line>
  <text x="40" y="268" fill="#d6d9df" font-size="12">L'immobilier pèse moins de 0,4 % du marché, quand il devait en être l'application phare.</text>
  <text x="40" y="290" fill="#8b909b" font-size="11">Sources : rwa.xyz, PYMNTS. Ordres de grandeur 2026.</text>
</svg>
<figcaption>Le marché des actifs tokenisés a quadruplé en un an, tiré par les créances financières. L'immobilier tokenisé, lui, reste sous <strong>100 millions de dollars</strong> de valeur on-chain, soit une fraction infime du total. Sources : rwa.xyz, PYMNTS.</figcaption>
</figure>

Pourquoi cette catégorie prospère-t-elle quand le béton casse ? Parce que la nature du sous-jacent diffère. Un bon du Trésor tokenisé est une créance quasi liquide, détenue par un dépositaire régulé qui contrôle réellement l'actif : le jeton est la part du fonds, le règlement est propre, et il n'y a ni toiture à réparer, ni taxe foncière à payer, ni locataire à expulser. L'immobilier locatif, lui, exige que le jeton fasse respecter, hors chaîne, un titre que gouvernent un registre foncier, un fisc, des tribunaux et l'état physique d'un bâtiment. La blockchain n'a aucune prise sur ce substrat : elle enregistre fidèlement qui détient le jeton, sans pouvoir garantir que ce jeton commande la brique. C'est la limite que rappelle toute lecture sérieuse de la [donnée on-chain](/guides/lire-la-donnee-on-chain/) : un registre fidèle n'est pas un registre vrai.

## Le solde de la liquidation

Le solde s'annonce maigre. Selon la presse spécialisée, le compte séquestre de la ville contenait moins de 640 000 dollars, quand les seuls honoraires du fiduciaire ont atteint 178 000 dollars en deux mois. Une fois réglés les impôts impayés, les frais administratifs et les coûts juridiques qui pèsent sur les sociétés du groupe, il restera peu à répartir entre les porteurs de jetons, et beaucoup de biens risquent la saisie fiscale.

Il faut se garder de condamner tout le RWA à partir de ce cas : les constats d'Outlier Media et de WXYZ sont journalistiques, non tranchés par un tribunal, et RealT n'est qu'un acteur. Mais la leçon structurelle tient. Tokeniser un actif ne crée pas la propriété ; cela inscrit une prétention sur un registre. La valeur d'un RWA dépend de la solidité du pont entre la chaîne et le monde légal : le titre, la fiscalité, la justice, la gestion physique. Ce pont, RealT ne l'a pas tenu. Le béton tokenisé n'a pas échoué parce qu'il était sur une blockchain, mais parce que la blockchain ne réparait pas les toits et ne détenait pas les actes.

## Sources

1. Outlier Media, « The real estate scheme gobbling up Detroit, one digital token at a time » : plus de 500 biens à Détroit liés à RealT (près de 1 000 revendiqués), achats depuis 2019, jeton à 50,72 dollars, plus de 250 investisseurs par bien, rendement annoncé autour de 10 %, plus de 1 000 amendes d'insalubrité, plus de 100 logements vacants, fondateurs Remy et Jean-Marc Jacobson : https://outliermedia.org/crypto-real-estate-realt-cryptocurrency-detroit/
2. WXYZ Detroit, « Crypto real estate company RealT collected millions from investors for Detroit properties it doesn't own » : 2,72 millions de dollars levés pour 39 maisons contre 1,1 million convenu, actes toujours au nom de Brewer Park Homes, citation de Kathy Makino-Leipsitz, 3 biens sur 25 au nom de RealT, environ 650 biens tokenisés, procédure de la ville visant 408 propriétés (Conrad Mallett) : https://www.wxyz.com/news/crypto-real-estate-company-realt-collected-millions-from-investors-for-detroit-properties-it-doesnt-own
3. Outlier Media, gestion et effondrement du modèle : arrêt des distributions en février 2026, loyers sous séquestre, plus de 300 biens en retard de taxes, plus de 200 menacés de saisie, au moins 2 millions de dollars dus à la ville : https://outliermedia.org/realt-crypto-real-estate-detroit-landlord-property-management/
4. Cryptoast, mise en liquidation début juillet 2026, environ 14 000 investisseurs français (cabinet Delomel), fiduciaire Charles Bullock, séquestre inférieur à 640 000 dollars, honoraires du fiduciaire de 178 000 dollars : https://cryptoast.fr/immobilier-tokenise-realt-liquidation-francais-concernes/
5. PYMNTS, valeur des actifs du monde réel tokenisés multipliée par quatre à environ 26 milliards de dollars, six catégories au-dessus du milliard : https://www.pymnts.com/blockchain/2026/tokenized-real-world-asset-value-jumps-fourfold-to-26-billion/
6. rwa.xyz, données de suivi du marché des actifs tokenisés : valeur on-chain autour de 31 à 32 milliards de dollars mi-2026, poids des bons du Trésor, immobilier tokenisé resté sous 100 millions de dollars : https://app.rwa.xyz/
