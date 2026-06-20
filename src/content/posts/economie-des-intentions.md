---
title: "De l'attention aux intentions : l'économie agentique et la résurrection du code 402"
description: "Le modèle publicitaire qui a financé le web entre en fin de cycle. Agents IA, micropaiements, stablecoins, protocoles MCP, A2A et x402 : enquête sourcée sur la couche de paiement native d'internet, et sur la souveraineté monétaire qui se joue derrière."
pubDate: 2026-06-20T16:30:00+02:00
tags: ["crypto", "stablecoins", "ia", "agents", "publicité", "macro", "paiements", "bce"]
draft: false
---

*Quand une intelligence artificielle navigue à votre place et vous livre une réponse, la régie publicitaire perd son point d'insertion. Derrière les agents IA se construit, pièce par pièce, une autre architecture économique : des paiements à la requête, des stablecoins comme véhicule monétaire, et un vieux code HTTP que personne n'avait fini de câbler. Cet article reconstitue cette pile, vérifie ce qui est déployé, et sépare la plomberie réelle du récit qui l'accompagne.*

Pendant vingt ans, le web a fonctionné sur un marché unique : celui de votre attention. Un internaute cherche, scrolle, clique, et au passage croise des annonces. Sa durée de présence et son taux de clic sont la matière première. Ce marché a une taille, et elle est colossale. Mais il repose sur une fiction que la publicité a installée comme une évidence : l'idée que l'information est gratuite. Elle ne l'a jamais été. Elle a seulement été payée par un tiers, l'annonceur, en échange d'un accès à votre comportement.

L'arrivée des agents IA, ces logiciels qui agissent pour vous plutôt que de vous afficher des résultats, fissure cette fiction. Quand l'agent répond, il n'y a plus de page à charger, plus d'espace à vendre, plus d'attention à capter. La question cesse d'être seulement technique. Elle devient économique : si le web cesse d'être financé par la publicité, par quoi le sera-t-il ? Une réponse s'assemble dans l'indifférence relative du grand public. Elle implique des protocoles ouverts, une couche de paiement à la requête, des stablecoins, et un débat de souveraineté monétaire qui oppose la Réserve fédérale, la Banque centrale européenne et une poignée d'entreprises de la Silicon Valley.

## Publicité : un cycle, pas une rente éternelle

Commençons par l'ordre de grandeur, car les chiffres qui circulent sous-estiment souvent le marché. Selon la prévision de fin 2025 de WPP Media (l'ex-GroupM), les recettes publicitaires mondiales ont atteint **1 140 milliards de dollars** en 2025, hors publicité politique, en hausse de **8,8 %** sur un an, avec une croissance attendue de **7,1 %** en 2026. Le cabinet Dentsu, qui mesure différemment, situe pour sa part le franchissement de la barre du trillion en 2026. Les deux maisons divergent sur le calendrier, et cela rappelle une règle de méthode : chaque chiffre dépend de la définition retenue (recettes nettes des éditeurs, inclusion ou non du politique, périmètre des médias). On raisonne en fourchettes attribuées, jamais en vérité unique.

Sur la part qui nous intéresse, le numérique, la convergence est nette : il pèse environ **73 %** de la dépense publicitaire mondiale. La prévision de fin 2024 de GroupM chiffrait le numérique « pure-play » à **813 milliards de dollars** pour 2025 ; l'estimation de Statista pour la même année est de **799 milliards**, dont le search comme premier segment à **334 milliards**. On retient une masse de l'ordre de **800 milliards de dollars** pour la publicité numérique en 2025, et un marché publicitaire total proche de **1 100 milliards**.

La concentration est le second fait marquant. D'après GroupM, Google, Meta et Amazon captent à eux seuls près des trois quarts des recettes publicitaires numériques mondiales hors Chine ; en intégrant ByteDance et Alibaba, les cinq premières plateformes pèsent plus de la moitié du marché publicitaire global. Ce n'est pas un marché concurrentiel classique, c'est un oligopole d'infrastructure.

<figure class="infographic">
<svg viewBox="0 0 720 340" role="img" aria-label="Répartition du marché publicitaire mondial 2025" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect x="0" y="0" width="720" height="340" fill="#0c0d10"/>
  <text x="32" y="34" fill="#f5f6f8" font-size="13">MARCHÉ PUBLICITAIRE MONDIAL 2025</text>
  <text x="32" y="52" fill="#8b909b" font-size="11">recettes hors politique · WPP Media, déc. 2025</text>
  <rect x="32" y="64" width="656" height="26" fill="rgba(255,255,255,0.10)"/>
  <rect x="32" y="64" width="479" height="26" fill="#5eead4"/>
  <text x="44" y="82" fill="#0c0d10" font-size="12">numérique ≈ 73 %</text>
  <text x="600" y="82" fill="#8b909b" font-size="12">trad. 27 %</text>
  <text x="32" y="112" fill="#f5f6f8" font-size="13">1 140 Md$ · dont numérique ≈ 800 Md$</text>
  <text x="32" y="156" fill="#f5f6f8" font-size="13">VENTILATION DU NUMÉRIQUE</text>
  <text x="32" y="174" fill="#8b909b" font-size="11">ordres de grandeur 2025</text>
  <g font-size="12">
    <text x="32" y="204" fill="#f5f6f8">search</text>
    <rect x="180" y="194" width="430" height="14" fill="rgba(255,255,255,0.10)"/>
    <rect x="180" y="194" width="430" height="14" fill="#5eead4"/>
    <text x="620" y="205" fill="#f5f6f8">≈ 334 Md$</text>
    <text x="32" y="234" fill="#f5f6f8">réseaux sociaux</text>
    <rect x="180" y="224" width="430" height="14" fill="rgba(255,255,255,0.10)"/>
    <rect x="180" y="224" width="312" height="14" fill="#5eead4"/>
    <text x="620" y="235" fill="#f5f6f8">≈ 242 Md$</text>
    <text x="32" y="264" fill="#f5f6f8">retail media</text>
    <rect x="180" y="254" width="430" height="14" fill="rgba(255,255,255,0.10)"/>
    <rect x="180" y="254" width="210" height="14" fill="#ff4d87"/>
    <text x="620" y="265" fill="#f5f6f8">≈ 163 Md$</text>
    <text x="32" y="294" fill="#f5f6f8">vidéo / CTV</text>
    <rect x="180" y="284" width="430" height="14" fill="rgba(255,255,255,0.10)"/>
    <rect x="180" y="284" width="129" height="14" fill="#5eead4"/>
    <text x="620" y="295" fill="#f5f6f8">≈ 80 à 110 Md$</text>
  </g>
  <line x1="32" y1="312" x2="688" y2="312" stroke="rgba(255,255,255,0.20)" stroke-width="1"/>
  <text x="32" y="330" fill="#8b909b" font-size="11">en rose, le retail media : segment le plus dynamique, porté par Amazon. Le search est le plus exposé au contournement agentique.</text>
</svg>
<figcaption>Le marché publicitaire mondial 2025, et les segments que les agents menacent. Sources : WPP Media (déc. 2025) ; GroupM (EOY 2024) ; Statista 2025. Les segments ne s'additionnent pas exactement au total : périmètres et méthodologies diffèrent selon les cabinets.</figcaption>
</figure>

Cette domination a un coût qualitatif documenté. L'algorithme de recherche ne tranche pas sur la véracité : il lit des signaux mathématiques (fréquence de publication, engagement, liens entrants) et récompense l'optimisation. Le contenu polarisant ou anxiogène déclenche plus de clics qu'une analyse nuancée, donc l'optimisation pour l'engagement favorise structurellement le sensationnel, et l'expertise brute qui refuse les règles du référencement se retrouve invisibilisée. L'auteur Cory Doctorow a nommé cette dégradation : l'« enshittification », désignée mot de l'année 2023 par l'American Dialect Society puis par le dictionnaire Macquarie en 2024. Sa mécanique en trois temps est précise : une plateforme se rend d'abord utile à ses usagers, puis les exploite au profit de ses clients professionnels, puis récupère la valeur pour elle seule.

L'objectivité commande la nuance. Il s'agit moins d'une intention que d'un résultat prévisible d'un modèle d'affaires adossé à l'attention : les moteurs amplifient une paresse cognitive préexistante autant qu'ils la créent, et si personne ne cliquait sur les titres racoleurs, l'algorithme cesserait de les promouvoir. Reste un constat solide : en industrialisant cette boucle à l'échelle mondiale pour servir un modèle publicitaire, les géants du web ont institutionnalisé une asymétrie de l'information. Le glissement, en 2015, de la devise « Don't be evil » vers le plus malléable « Do the right thing » au moment de la création d'Alphabet n'est pas un hasard de communication : il acte un modèle devenu incompatible avec sa promesse d'origine, la séparation stricte entre résultats organiques et annonceurs.

## 402 Payment Required : le code oublié du web

Le protocole HTTP contient depuis ses premières spécifications un code de statut resté lettre morte pendant des décennies : le `402 Payment Required`. Réservé « pour un usage futur », il décrivait un web où l'on paierait nativement l'accès à une ressource. Ce futur n'était jamais venu, faute de rail de paiement à l'échelle de la requête. Deux acteurs que tout oppose viennent, à quelques mois d'intervalle, de le ressusciter pour la même raison : les agents IA ont besoin de payer.

Le 1er juillet 2025, Cloudflare est devenu le premier grand fournisseur d'infrastructure à bloquer par défaut les robots d'IA sur les nouveaux domaines, basculant d'un modèle d'« opt-out » vers un modèle d'« opt-in ». La même annonce lançait Pay Per Crawl, une place de marché où un éditeur peut exiger une rémunération chaque fois qu'une IA aspire une page : autoriser gratuitement, facturer, ou bloquer. Mécaniquement, le robot présente une intention de paiement dans l'en-tête de la requête et obtient un `200`, ou se voit renvoyer un `402` assorti d'un tarif. Cloudflare agit comme marchand de référence et opère le règlement. L'enjeu n'est pas anecdotique : l'entreprise sert environ un cinquième du trafic web mondial.

L'intérêt pour les éditeurs est direct : à mesure que le trafic de référencement décline, parce que l'IA répond à la place de l'internaute, un péage à l'accès devient une source de revenu de substitution. La limite l'est tout autant. En phase de bêta, le rapport de force reste écrasant : un petit éditeur indépendant n'a aucun levier de négociation face aux grands modèles, et le revenu immédiat sera modeste. Le dispositif change la nature de la relation, un contrat commercial direct à l'échelle d'internet, avant d'en changer le montant.

Côté crypto, Coinbase a publié en mai 2025 le livre blanc de [x402](/glossaire/#x402), un standard ouvert qui réactive ce même code 402 pour incruster un paiement en stablecoin directement dans l'échange HTTP. Le principe tient en un aller-retour : un client (navigateur, application ou agent) demande une ressource, le serveur répond avec un prix, le client signe un paiement en stablecoin, la ressource est délivrée. Pas de compte, pas d'abonnement, pas de clé d'API. Les règlements se font principalement en [USDC](/glossaire/#usdc), sur plusieurs chaînes (Base, Solana, Stellar, entre autres).

En septembre 2025, Coinbase et Cloudflare ont fondé la x402 Foundation, passée depuis sous la gouvernance de la Linux Foundation, avec une vingtaine de membres dont Google, Stripe et Visa. Les chiffres de traction se manient avec prudence, car ils émanent des promoteurs du standard et mélangent transactions techniques et paiements réels, mais l'ordre de grandeur est documenté : plus de **35 millions de transactions** sur la seule chaîne Solana à mars 2026, une intégration dans l'API PaymentIntents de Stripe, et une couche de paiement estimée autour de **600 millions de dollars** en rythme annualisé.

Le point de convergence mérite d'être posé clairement. L'infrastructure web héritée et la crypto visent la même primitive : rendre le paiement natif du protocole, à la granularité de la requête. C'est la condition matérielle des deux idées qui reviennent dans le débat, le micropaiement (payer quelques centimes pour une réponse précise) et le paiement streamé (payer en continu, au fil de la consommation). Aucun des deux n'était possible avec les rails hérités, conçus pour des transactions humaines, lentes et coûteuses en frais fixes. L'hypothèse optimiste est qu'un éditeur peut alors monétiser la résolution d'un problème plutôt que du temps de cerveau disponible. La suite confronte cette hypothèse aux faits.

## La pile agentique : MCP, A2A et un brouillon IETF

Pour qu'un agent paie, il faut d'abord qu'il sache parler aux outils et aux autres agents. Trois protocoles structurent cette pile. Deux sont déjà des standards de fait, le troisième est un brouillon dont il faut décrire le statut avec honnêteté.

Le [MCP](/glossaire/#mcp), Model Context Protocol, introduit par Anthropic le 25 novembre 2024, est un cadre fondé sur JSON-RPC 2.0 qui standardise la manière dont une IA lit des fichiers, exécute des fonctions et récupère du contexte depuis des sources externes. Avant lui, chaque intégration entre un modèle et un outil relevait du sur-mesure. L'adoption a été fulgurante et, fait rare, transpartisane : OpenAI l'a adopté en mars 2025, Google DeepMind en avril 2025, Microsoft l'a intégré à Windows et à Copilot Studio dans la foulée. En décembre 2025, Anthropic a transféré MCP à l'Agentic AI Foundation, un fonds dédié sous l'égide de la Linux Foundation, cofondé avec Block et OpenAI, scellant son statut de standard neutre. On dénombrait alors plus de **16 000 serveurs** MCP en circulation.

Là où MCP relie un agent à des outils, le protocole [A2A](/glossaire/#a2a), Agent2Agent, relie les agents entre eux. Annoncé par Google le 9 avril 2025, il permet à des agents conçus par des fournisseurs différents de se découvrir, de s'authentifier et de se déléguer des tâches, via HTTP et JSON-RPC 2.0. Google l'a transféré à la Linux Foundation dès le 23 juin 2025, avec le soutien d'Amazon, Microsoft, Salesforce, Cisco, SAP et ServiceNow. Objectivité oblige : malgré une architecture solide, l'élan d'A2A a paru ralentir face à MCP au cours de l'automne 2025, une partie de l'écosystème ayant convergé vers ce dernier. En matière de protocoles, l'adoption l'emporte souvent sur l'élégance technique.

Le troisième document est souvent surinterprété, et son statut mérite d'être resitué. Il s'agit d'un Internet-Draft individuel (`draft-zeng-mcp-network-mgmt-01`), publié le 16 octobre 2025 par Zeng Guanming, ingénieur chez Huawei, et valable jusqu'au 19 avril 2026. Ni RFC, ni document de groupe de travail adopté : une proposition individuelle, « work in progress », qu'on ne peut citer autrement, et dont la version courante est d'ailleurs expirée à la date de cet article. Sur le fond, l'idée éclaire une trajectoire. Elle étend MCP pour que des équipements réseau (routeurs, commutateurs) se comportent comme des serveurs MCP, et les contrôleurs comme des clients. Le brouillon définit sept outils (exécuter une commande CLI, lire ou éditer une donnée YANG, valider une configuration, effectuer un rollback, sauvegarder un fichier de conf), des ressources adressables et des codes d'erreur dédiés. Aujourd'hui, un contrôleur réseau doit parler CLI, NETCONF, SNMP, gNMI et des API propriétaires ; demain, un agent diagnostiquerait une panne ou ajouterait un VLAN via le même canal MCP qu'il utilise pour tout le reste. La portée réelle dépendra de l'adoption par un groupe de travail IETF, qui n'est pas acquise.

<figure class="infographic">
<svg viewBox="0 0 720 430" role="img" aria-label="Pile en couches des protocoles agentiques" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect x="0" y="0" width="720" height="430" fill="#0c0d10"/>
  <line x1="22" y1="40" x2="22" y2="392" stroke="#ff4d87" stroke-width="2"/>
  <polygon points="22,392 18,382 26,382" fill="#ff4d87"/>
  <g>
    <rect x="44" y="34" width="644" height="78" fill="none" stroke="rgba(255,255,255,0.20)"/>
    <text x="60" y="58" fill="#8b909b" font-size="11">COUCHE 04 · COMMUNICATION ENTRE AGENTS</text>
    <text x="60" y="82" fill="#5eead4" font-size="16">A2A · Agent2Agent</text>
    <text x="60" y="102" fill="#8b909b" font-size="11.5">découverte · authentification · délégation de tâches</text>
    <text x="688" y="58" fill="#8b909b" font-size="10.5" text-anchor="end">Linux Foundation · 06/2025</text>
  </g>
  <g>
    <rect x="44" y="118" width="644" height="78" fill="none" stroke="rgba(255,255,255,0.20)"/>
    <text x="60" y="142" fill="#8b909b" font-size="11">COUCHE 03 · CONTEXTE ET OUTILS</text>
    <text x="60" y="166" fill="#5eead4" font-size="16">MCP · Model Context Protocol</text>
    <text x="60" y="186" fill="#8b909b" font-size="11.5">fichiers · fonctions · données externes · 16 000+ serveurs</text>
    <text x="688" y="142" fill="#8b909b" font-size="10.5" text-anchor="end">AAIF / Linux F. · 12/2025</text>
  </g>
  <g>
    <rect x="44" y="202" width="644" height="92" fill="none" stroke="#ff4d87"/>
    <text x="60" y="226" fill="#8b909b" font-size="11">COUCHE 02 · PAIEMENT ET RÈGLEMENT</text>
    <text x="60" y="250" fill="#f5f6f8" font-size="15">x402 · AP2 · ACP · Visa IC · Mastercard Agent Pay</text>
    <text x="60" y="270" fill="#8b909b" font-size="11.5">le paiement devient natif de la requête HTTP</text>
    <text x="688" y="226" fill="#ff4d87" font-size="10.5" text-anchor="end">réactive HTTP 402</text>
  </g>
  <g>
    <rect x="44" y="300" width="644" height="78" fill="#f5b13d"/>
    <text x="60" y="324" fill="#0c0d10" font-size="11">COUCHE 01 · MONNAIE</text>
    <text x="60" y="348" fill="#0c0d10" font-size="16">Stablecoins · USDC · USDT</text>
    <text x="60" y="368" fill="#0c0d10" font-size="11.5">≈ 317 Md$ de capitalisation · ≈ 99 % libellés en dollar</text>
  </g>
  <text x="44" y="410" fill="#8b909b" font-size="11">Chaque couche est confiée à une fondation neutre. La couche monétaire, elle, reste très majoritairement en dollar.</text>
</svg>
<figcaption>La pile agentique se lit comme un règlement qui remonte : la monnaie finance le paiement, qui s'incruste dans les échanges entre outils puis entre agents. Sources : Anthropic ; Google ; Coinbase ; Linux Foundation ; Federal Reserve.</figcaption>
</figure>

## La couche monétaire : qui construit le rail des agents

La couche la plus disputée n'est pas technique, elle est monétaire. Un agent qui décide et agit a besoin d'un véhicule monétaire programmable, instantané, sans frontière et à faible coût unitaire. Les stablecoins, ces cryptomonnaies adossées à une devise, cochent ces cases, et leur échelle n'est plus marginale. Ils servent déjà de rail concret hors du laboratoire, comme l'a montré le règlement en [USDT des péages du détroit d'Ormuz](/posts/iran-peages-ormuz-usdt-tron-ofac/).

D'après une note des services de la Réserve fédérale (avril 2026), la capitalisation agrégée des stablecoins atteignait environ **317 milliards de dollars** au 6 avril 2026, en hausse de plus de **50 %** depuis le début 2025. Le secteur est très concentré : l'[USDT](/glossaire/#usdt) (environ 184 à 187 Md$) et l'[USDC](/glossaire/#usdc) (environ 77 Md$) en représentent l'écrasante majorité. Le cadre juridique américain s'est clarifié avec le [GENIUS Act](/glossaire/#genius), promulgué le 18 juillet 2025, qui impose une couverture intégrale des réserves ; il s'inscrit dans le mouvement de régulation que nous avons détaillé à propos du [CLARITY Act et de l'encadrement crypto américain](/posts/clarity-act-regulation-crypto-etats-unis/). Un fait, enfin, est décisif pour la suite : selon la BCE, environ **99 %** de l'offre de stablecoins en circulation est libellée en dollar.

Sur ce socle, deux familles d'acteurs s'affrontent pour devenir le rail de paiement des agents. D'un côté, les standards crypto-natifs : x402 et son intégration dans le protocole de paiement agentique [AP2](/glossaire/#ap2) de Google, dont x402 est le facilitateur stablecoin. De l'autre, les réseaux de cartes, qui n'entendent pas se laisser contourner. Visa a lancé Visa Intelligent Commerce le 30 avril 2025 avec neuf partenaires fondateurs, dont OpenAI ; Mastercard a lancé Agent Pay en avril 2025, décliné en juin 2026 en « Agent Pay for Machines » pour des micropaiements de l'ordre de la fraction de centime. OpenAI a lancé Instant Checkout le 29 septembre 2025 avec Stripe, via l'[ACP](/glossaire/#acp), Agentic Commerce Protocol, d'abord pour Etsy, Walmart et Shopify.

<figure class="infographic">
<svg viewBox="0 0 720 360" role="img" aria-label="Comparatif des protocoles de paiement agentique" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect x="0" y="0" width="720" height="360" fill="#0c0d10"/>
  <text x="32" y="34" fill="#f5f6f8" font-size="13">SIX PROTOCOLES POUR FAIRE PAYER UN AGENT</text>
  <g fill="#8b909b" font-size="10.5">
    <text x="32" y="62">PROTOCOLE</text><text x="300" y="62">PORTEUR</text><text x="500" y="62">DEPUIS</text><text x="600" y="62">RAIL</text>
  </g>
  <line x1="32" y1="72" x2="688" y2="72" stroke="rgba(255,255,255,0.20)" stroke-width="1.5"/>
  <g font-size="13">
    <text x="32" y="102" fill="#5eead4">x402</text>
    <text x="32" y="120" fill="#8b909b" font-size="11">paiement dans la requête</text>
    <text x="300" y="102" fill="#f5f6f8">Coinbase + Cloudflare</text>
    <text x="500" y="102" fill="#f5f6f8">05/2025</text>
    <rect x="600" y="90" width="88" height="18" fill="#5eead4"/><text x="610" y="103" fill="#0c0d10" font-size="11">stablecoin</text>
    <line x1="32" y1="134" x2="688" y2="134" stroke="rgba(255,255,255,0.10)"/>
    <text x="32" y="162" fill="#5eead4">AP2</text>
    <text x="32" y="180" fill="#8b909b" font-size="11">Agent Payments Protocol</text>
    <text x="300" y="162" fill="#f5f6f8">Google</text>
    <text x="500" y="162" fill="#f5f6f8">09/2025</text>
    <text x="600" y="162" fill="#8b909b" font-size="11">cartes + x402</text>
    <line x1="32" y1="194" x2="688" y2="194" stroke="rgba(255,255,255,0.10)"/>
    <text x="32" y="222" fill="#5eead4">ACP</text>
    <text x="32" y="240" fill="#8b909b" font-size="11">Agentic Commerce Protocol</text>
    <text x="300" y="222" fill="#f5f6f8">OpenAI + Stripe</text>
    <text x="500" y="222" fill="#f5f6f8">09/2025</text>
    <text x="600" y="222" fill="#8b909b" font-size="11">cartes</text>
    <line x1="32" y1="254" x2="688" y2="254" stroke="rgba(255,255,255,0.10)"/>
    <text x="32" y="282" fill="#5eead4">Intelligent Commerce</text>
    <text x="32" y="300" fill="#8b909b" font-size="11">Trusted Agent Protocol</text>
    <text x="300" y="282" fill="#f5f6f8">Visa</text>
    <text x="500" y="282" fill="#f5f6f8">04/2025</text>
    <text x="600" y="282" fill="#8b909b" font-size="11">cartes</text>
    <line x1="32" y1="314" x2="688" y2="314" stroke="rgba(255,255,255,0.10)"/>
    <text x="32" y="340" fill="#5eead4">Agent Pay</text>
    <text x="300" y="340" fill="#f5f6f8">Mastercard</text>
    <text x="500" y="340" fill="#f5f6f8">04/2025</text>
    <text x="600" y="340" fill="#8b909b" font-size="11">cartes + x402</text>
  </g>
</svg>
<figcaption>Les standards ne sont pas stabilisés : chaque grand acteur plante son drapeau. Les réseaux de cartes apportent l'identité et la confiance, x402 et les stablecoins apportent l'exécution à faible coût. Sources : Coinbase ; Google ; OpenAI / Stripe ; Visa ; Mastercard ; Digital Commerce 360 ; The Defiant.</figcaption>
</figure>

La grille de lecture la plus juste vient des analystes du secteur : une architecture en couches se dessine, avec la confiance et l'autorisation en haut (AP2, Visa, Mastercard) et l'exécution et le règlement en bas (x402, stablecoins on-chain). Visa joue d'ailleurs la complémentarité plutôt que l'affrontement frontal : la firme aligne son Trusted Agent Protocol sur l'ACP d'OpenAI et le standard x402, et son partenariat approfondi avec OpenAI, annoncé en juin 2026, vise à rester au milieu de la transaction plutôt qu'à en être désintermédiée.

Le rappel à la réalité tempère l'enthousiasme. Selon une estimation sectorielle, seuls environ **4 %** des consommateurs laissent aujourd'hui une IA finaliser un achat de manière autonome : l'infrastructure arrive très en avance sur la confiance. Et les volumes doivent se lire avec rigueur. Un volume de transfert agrégé de l'ordre de **33 000 milliards de dollars** en 2025 (rapporté par Artemis et Bloomberg) ne se confond pas avec un volume de paiements réels, bien plus modeste. La plomberie est posée, l'usage de masse reste à venir.

## L'euro numérique, ou la souveraineté contre le dollar programmable

La thèse du « tout se fera en crypto » bute sur un angle mort : la quasi-totalité de cette crypto est en réalité du dollar. Quand 99 % des stablecoins sont libellés en dollar, la couche monétaire des agents IA n'est pas neutre, elle est dollarisée. La Banque centrale européenne cherche précisément à contrer cela, et voilà qui redonne tout son sens au projet d'euro numérique, qu'on aurait tort de balayer trop vite.

L'état du projet est documenté et daté. Le 30 octobre 2025, la BCE a clos sa phase préparatoire et est passée à l'étape suivante. Le calendrier officiel est explicite : si les colégislateurs européens adoptent le règlement au cours de 2026, un pilote pourrait démarrer à la mi-2027, pour une première émission potentielle en 2029. Le coût de construction est estimé autour de **1,3 milliard d'euros**, plus environ **320 millions par an** ensuite. En décembre 2025, Christine Lagarde a résumé la situation : le travail technique est fait, la balle est dans le camp des institutions politiques.

La motivation affichée est explicitement géomonétaire. Lagarde présente l'euro numérique, une monnaie numérique de banque centrale ([CBDC](/glossaire/#cbdc)), comme un outil de souveraineté, fonctionnant sur une infrastructure européenne et réduisant la dépendance à des prestataires étrangers comme Visa, Mastercard ou les stablecoins en dollar. Le secteur privé européen ne l'attend pas pour autant : un consortium d'une dizaine de banques (dont BNP Paribas, ING et UniCredit), baptisé Qivalis, prépare un stablecoin adossé à l'euro. Ces inquiétudes ne datent pas d'hier, et elles affleurent jusque dans les dossiers d'agrément : le [bras de fer autour de l'enregistrement MiCA de Binance](/posts/binance-mica-lagarde/) en a offert une illustration récente.

L'objection à formuler ici n'est pas idéologique, elle est factuelle. Dire que l'euro numérique se fera en crypto de toute façon confond deux choses. Un stablecoin privé en dollar et une CBDC en euro répondent à des fonctions différentes et à des rapports de force différents. La vraie question n'est pas crypto contre Lagarde, mais : qui contrôle l'unité de compte dans laquelle les agents régleront leurs transactions ? Tant que la réponse reste le dollar, via des émetteurs privés américains régulés par le GENIUS Act, la promesse de neutralité de la couche agentique demeure partielle. Une infrastructure peut être techniquement décentralisée et monétairement très centralisée. C'est le cas aujourd'hui.

## La confiance comme actif : l'alignement devient le produit

Reste le cœur de la thèse, et c'est sa partie la plus solide. Dans un monde où des IA décident pour nous, le critère numéro un n'est plus la pertinence, c'est l'alignement. Un agent qui recommande un choix technique ou financier parce qu'une entreprise a payé en coulisses n'est plus un outil, c'est un cheval de Troie. Le risque est nommé dans la littérature stratégique. Pour un acteur comme Google, basculer vers des agents qui répondent directement reviendrait à détruire la machine publicitaire qui génère la quasi-totalité de ses revenus. La tentation d'un entre-deux, des agents IA dont les résultats seraient discrètement biaisés pour continuer à servir les annonceurs, est forte. Et la crédibilité de l'outil s'effondre précisément à cet endroit.

L'économie de l'intention diverge ici le plus nettement de l'économie de l'attention. Dans la seconde, la friction est rentable : plus vous cherchez, scrollez et revenez en arrière, plus vous voyez de publicités. Dans la première, la valeur réside dans l'absence de friction et dans la confiance : vous déléguez, l'agent exécute, vous payez le résultat. Si l'agent ne vous renvoie nulle part, la seule chose que vous achetez vraiment, c'est sa neutralité. La confiance devient l'actif, et la neutralité, qu'on croyait enterrée avec le web publicitaire, redevient un avantage concurrentiel mesurable.

De là un argument en faveur des modèles ouverts et des initiatives transparentes : une technologie vérifiable, sans conflit d'intérêts, gagne en légitimité dès lors que l'alignement est le produit. La rigueur impose deux garde-fous, faute de quoi l'argument devient un slogan. Premièrement, un standard ouvert n'est pas un standard neutre : MCP, A2A et x402 sont gouvernés par des fondations cofondées par les mêmes géants qu'ils sont censés discipliner, et l'ouverture du code déplace le terrain de la capture, du produit vers la gouvernance, sans la supprimer. Deuxièmement, la transparence méthodologique a un coût de découvrabilité : un site qui refuse les trackers, le SEO agressif et la course aux liens entrants envoie moins de signaux aux moteurs. Dans le web de l'attention, cette propreté est une pénalité ; dans le web de l'intention, elle ne devient un atout que si les agents valorisent réellement la vérifiabilité. Rien ne le garantit, car un agent peut être optimisé pour la complaisance autant que pour la vérité.

Le dilemme de l'innovateur, formalisé par Clayton Christensen, éclaire le pari final. Une entreprise dominante meurt rarement par mauvaise gestion, elle meurt parce qu'elle s'accroche au modèle ultra-rentable qui a fait son succès et rate le virage suivant. Si les géants actuels refusent de sacrifier leur rente publicitaire pour garantir la neutralité agentique, ils seront concurrencés par des acteurs dont le modèle natif n'est pas la captation de l'attention. Mais concurrencés ne signifie pas remplacés : Visa, Mastercard, Google et OpenAI investissent massivement la couche de paiement agentique précisément pour ne pas être désintermédiés. Le scénario le plus probable n'est pas la mort des dominants, c'est leur mutation, avec tous les biais que cette mutation cherchera à préserver.

## Usages concrets pour un éditeur indépendant

Reste à atterrir sur l'opérationnel. Pour une veille technique qui croise des données brutes ([SEC](/glossaire/#sec), FRED, on-chain) sans dépendre d'un outil propriétaire fermé, la bascule ouvre des leviers immédiats, sans attendre 2029.

Reprendre le contrôle du crawl, d'abord. Activer un blocage par défaut des robots d'IA, et au besoin un tarif d'accès via un dispositif de type Pay Per Crawl, transforme l'aspiration de contenu d'un coût subi en relation contractuelle. Le levier financier reste faible pour un petit site, mais le levier d'information, savoir qui aspire quoi et dans quel but (entraînement, inférence, indexation), est réel.

Exposer ses données via un serveur MCP, ensuite. Plutôt que d'espérer un bon référencement par un moteur taillé pour la finance grand public, un éditeur de données publie un serveur MCP qui livre proprement ses jeux de données aux agents. La logique s'inverse : on ne court plus après le référencement, on devient une source que les agents appellent directement.

Monétiser la résolution plutôt que l'audience, enfin. Un point d'accès payant en x402, quelques centimes en stablecoin par requête et sans création de compte, permet de facturer un calcul, un croisement de sources ou une donnée vérifiée à l'agent qui en a besoin, au moment où il en a besoin. Et dans un univers où l'alignement devient le produit, la transparence méthodologique cesse d'être un luxe académique pour devenir un argument de différenciation.

La prudence reste de mise sur trois points. Ces dispositifs sont jeunes : Pay Per Crawl est en bêta, x402 vient d'avoir un an, les standards de paiement agentique ne sont pas stabilisés. La sécurité doit primer : exposer un serveur MCP ou un point d'accès payant ouvre une surface d'attaque, et le brouillon IETF lui-même consacre une section entière à cette question. L'usage de masse, enfin, n'est pas là : avec environ 4 % de consommateurs déléguant un achat à une IA, on construit pour un futur probable, pas pour un présent installé.

L'économie de l'attention, uniformisée et financée par la publicité, laisse place à des économies fragmentées des intentions, où l'on paie pour résoudre un problème précis. La bascule est techniquement amorcée : les protocoles existent, la couche de paiement se construit, le code 402 est ressuscité. Elle est économiquement embryonnaire, car la confiance et l'adoption manquent encore. Et elle est politiquement disputée, car la monnaie sous-jacente reste, pour l'instant, massivement du dollar. Les acteurs capables d'incarner une neutralité vérifiable n'ont rien gagné d'avance, mais ils jouent désormais sur un terrain où cette neutralité a, enfin, une valeur marchande.

---

*Cet article ne constitue en aucun cas un conseil en investissement.*

**Sources principales :** Réserve fédérale, FEDS Notes (8 avril 2026, capitalisation et part dollar des stablecoins) ; BCE et Banque de France (rapport de clôture de la phase préparatoire, 30 octobre 2025 ; calendrier pilote 2027 et émission 2029) ; CoinDesk (déclarations de C. Lagarde, 18 décembre 2025) ; WPP Media (prévision publicitaire de fin 2025) ; Dentsu (Global Ad Spend Forecast, décembre 2025) ; GroupM (End-of-Year Forecast 2024) ; Statista (Digital Advertising Worldwide 2025) ; blog officiel Cloudflare et *Nieman Lab* (Pay Per Crawl, 1er juillet 2025) ; Coinbase (livre blanc x402, mai 2025) et *The Block* ; *The Defiant* et BlockEden (x402 Foundation et volumes) ; Model Context Protocol Blog, Wikipedia et Linux Foundation (MCP, A2A, gouvernance) ; IETF, draft-zeng-mcp-network-mgmt-01 (16 octobre 2025) ; Digital Commerce 360, Mastercard et Visa (Intelligent Commerce, Agent Pay, Instant Checkout) ; American Dialect Society et Macquarie Dictionary (« enshittification », C. Doctorow). Chiffres vérifiés sur sources primaires lorsque disponibles ; les agrégats de stablecoins et les volumes de transfert sont des ordres de grandeur, distincts des paiements réels.
