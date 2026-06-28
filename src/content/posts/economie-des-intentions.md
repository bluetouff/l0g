---
title: "De l'attention aux intentions : l'économie agentique et la résurrection du code 402"
description: "Le modèle publicitaire qui a financé le web ne meurt pas, il mute. Agents IA, micropaiements, stablecoins, protocoles MCP, A2A et x402 : enquête sourcée et chiffrée sur la couche de paiement native d'internet, ses promesses surestimées et ses contraintes réglementaires."
pubDate: 2026-06-20T16:30:00+02:00
tags: ["crypto", "stablecoins", "ia", "agents", "publicité", "macro", "paiements", "bce"]
draft: false
---

*Quand une intelligence artificielle navigue à votre place et vous livre une réponse, la régie publicitaire perd son point d'insertion. Derrière les agents IA se construit une autre architecture économique : paiements à la requête, stablecoins comme véhicule monétaire, et un vieux code HTTP que personne n'avait fini de câbler. Cet article reconstitue cette pile et la confronte aux chiffres, à la recherche académique et au droit. Première mise au point : l'économie de l'attention ne disparaît pas, elle se déplace, et la capacité de prédire nos intentions reste, à ce stade, davantage une promesse commerciale qu'un fait démontré.*

Pendant vingt ans, le web a fonctionné sur un marché unique : celui de votre attention. Un internaute cherche, scrolle, clique, et au passage croise des annonces. Sa durée de présence et son taux de clic sont la matière première. Ce marché a une taille, et elle est colossale. Mais il repose sur une fiction installée comme une évidence : l'idée que l'information serait gratuite. Elle ne l'a jamais été. Elle a été payée par un tiers, l'annonceur, en échange d'un accès à votre comportement.

L'arrivée des agents IA, ces logiciels qui agissent pour vous plutôt que de vous afficher des résultats, déplace le point d'insertion. Quand l'agent répond, il n'y a plus de page à charger, plus d'espace à vendre au même endroit. La question devient économique : si une part du web cesse d'être financée par la publicité au clic, par quoi le sera-t-elle ? Une réponse s'assemble, faite de protocoles ouverts, d'une couche de paiement à la requête, de stablecoins, et d'un débat de souveraineté monétaire. Le reste de cet article décrit cette construction sans la surestimer.

## Publicité : un cycle, pas une rente éternelle, et surtout pas un cadavre

Commençons par l'ordre de grandeur, car les chiffres qui circulent sous-estiment souvent le marché. Selon la prévision de fin 2025 de WPP Media (l'ex-GroupM), les recettes publicitaires mondiales ont atteint **1 140 milliards de dollars** en 2025, hors publicité politique, en hausse de **8,8 %** sur un an, avec une croissance attendue de **7,1 %** en 2026. Le cabinet Dentsu, qui mesure différemment, situe le franchissement du trillion en 2026. Les deux maisons divergent sur le calendrier, ce qui rappelle une règle de méthode : chaque chiffre dépend de la définition retenue. On raisonne en fourchettes attribuées, jamais en vérité unique.

Sur la part numérique, la convergence est nette : environ **73 %** de la dépense publicitaire mondiale. La prévision de fin 2024 de GroupM chiffrait le numérique « pure-play » à **813 milliards de dollars** pour 2025 ; l'estimation de Statista pour la même année est de **799 milliards**, dont le search comme premier segment à **334 milliards**. Google, Meta et Amazon captent à eux seuls près des trois quarts des recettes numériques mondiales hors Chine. Pour la seule maison mère de Google, la publicité représente plus de **200 milliards de dollars** de revenus annuels, près de **80 %** du chiffre d'affaires d'Alphabet.

Un point doit être posé d'emblée, car l'erreur d'analyse est tentante : la publicité ne meurt pas. Elle migre. Le signal le plus clair vient des acteurs réputés « tueurs » du modèle. OpenAI, dont l'application ChatGPT a dépassé **800 millions d'utilisateurs hebdomadaires** fin 2025 puis environ **900 millions** début 2026 (chiffres communiqués par l'entreprise et repris par Reuters), a lancé début 2026 un test publicitaire à l'intérieur de ChatGPT, visant les utilisateurs des offres gratuite et « Go ». La logique est exactement celle de l'ancien web : moins de **10 %** des utilisateurs paient, donc le reste doit être financé autrement. Google, de son côté, a indiqué aux annonceurs fin 2025 vouloir introduire de la publicité dans son assistant Gemini en 2026. Le modèle attentionnel ne s'éteint pas, il s'installe dans les nouvelles interfaces.

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
<figcaption>Le marché publicitaire mondial 2025. Sources : WPP Media (déc. 2025) ; GroupM (EOY 2024) ; Statista 2025. Les segments ne s'additionnent pas exactement au total : périmètres et méthodologies diffèrent selon les cabinets.</figcaption>
</figure>

Cette domination a un coût qualitatif documenté. L'algorithme de recherche ne tranche pas sur la véracité : il lit des signaux mathématiques (fréquence de publication, engagement, liens entrants) et récompense l'optimisation. Le contenu anxiogène déclenche plus de clics qu'une analyse nuancée, donc l'optimisation pour l'engagement favorise structurellement le sensationnel, et l'expertise qui refuse les règles du référencement se retrouve invisibilisée. L'auteur Cory Doctorow a nommé cette dégradation : l'« enshittification », désignée mot de l'année 2023 par l'American Dialect Society puis par le dictionnaire Macquarie en 2024. Sa mécanique en trois temps est précise : une plateforme se rend d'abord utile à ses usagers, puis les exploite au profit de ses clients professionnels, puis récupère la valeur pour elle seule.

La nuance s'impose, car le diagnostic est souvent caricaturé. Il s'agit moins d'une intention que d'un résultat prévisible d'un modèle d'affaires adossé à l'attention : les moteurs amplifient une paresse cognitive préexistante autant qu'ils la créent. Et la puissance des plateformes, réelle, n'est pas absolue. Le glissement, en 2015, de la devise « Don't be evil » vers le plus malléable « Do the right thing », au moment de la création d'Alphabet, acte un modèle en tension avec sa promesse d'origine : la séparation stricte entre résultats organiques et annonceurs.

## Le clic à l'épreuve des chiffres

L'effet des réponses générées par IA sur le trafic n'est plus une intuition, il est mesuré. Le Pew Research Center a analysé en mars 2025 le comportement de **900 adultes** américains ayant accepté de partager leur navigation, soit près de **69 000 recherches** Google. Résultat : **18 %** des recherches déclenchaient un résumé IA (« AI Overview »), et **58 %** des participants en ont rencontré au moins un dans le mois. Surtout, en présence d'un résumé IA, l'internaute ne cliquait vers un lien externe que dans **8 %** des cas, contre **15 %** en son absence, soit près de deux fois moins. Le clic vers une source citée à l'intérieur du résumé tombait à **1 %**. Et l'internaute mettait fin à sa session de navigation dans **26 %** des cas après une page à résumé, contre **16 %** sans.

Voilà la pression réelle sur les éditeurs, chiffrée et datée : non pas une disparition du trafic, mais une érosion du clic sortant là où l'IA répond directement. Ce constat fonde la suite, mais il appelle immédiatement un contrepoint que les commentaires alarmistes oublient.

Car le comportement marchand, lui, raconte une histoire plus nuancée et bien plus instructive. Les données d'Adobe Analytics, fondées sur plus de **mille milliards de visites** sur les sites marchands américains, montrent que le trafic arrivant depuis une IA générative était initialement de mauvaise qualité commerciale, puis qu'il s'est retourné. La conversion du trafic IA était inférieure d'environ **49 %** à celle du trafic classique en janvier 2025, écart ramené à **23 %** en juillet 2025. Puis bascule : ce même trafic convertissait environ **31 %** mieux que le trafic non-IA pendant les fêtes 2025, et jusqu'à **42 %** mieux en mars 2026, un record selon Adobe. Les visiteurs venus d'une IA passent **45 à 48 %** de temps en plus sur le site et consultent environ **13 %** de pages en plus. Le volume, lui, a explosé : le trafic vers le commerce de détail depuis des outils d'IA générative a bondi d'environ **693 %** sur un an pendant la saison des fêtes 2025.

<figure class="infographic">
<svg viewBox="0 0 720 360" role="img" aria-label="Conversion du trafic IA comparée au trafic humain dans le commerce de détail" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect x="0" y="0" width="720" height="360" fill="#0c0d10"/>
  <text x="32" y="30" fill="#f5f6f8" font-size="13">TRAFIC IA vs TRAFIC HUMAIN : LA CONVERSION BASCULE</text>
  <text x="32" y="48" fill="#8b909b" font-size="11">écart de taux de conversion, commerce de détail US · Adobe Analytics</text>
  <line x1="60" y1="200" x2="688" y2="200" stroke="rgba(255,255,255,0.30)" stroke-width="1"/>
  <text x="60" y="196" fill="#8b909b" font-size="10">parité (0 %)</text>
  <!-- barres négatives (rose) -->
  <rect x="90" y="200" width="70" height="118" fill="#ff4d87"/>
  <text x="125" y="334" fill="#8b909b" font-size="10.5" text-anchor="middle">jan. 25</text>
  <text x="125" y="334" fill="#8b909b" font-size="10.5" text-anchor="middle"></text>
  <text x="125" y="194" fill="#ff4d87" font-size="12" text-anchor="middle">-49 %</text>
  <rect x="230" y="200" width="70" height="91" fill="#ff4d87"/>
  <text x="265" y="307" fill="#8b909b" font-size="10.5" text-anchor="middle">avr. 25</text>
  <text x="265" y="194" fill="#ff4d87" font-size="12" text-anchor="middle">-38 %</text>
  <rect x="370" y="200" width="70" height="55" fill="#ff4d87"/>
  <text x="405" y="271" fill="#8b909b" font-size="10.5" text-anchor="middle">juil. 25</text>
  <text x="405" y="194" fill="#ff4d87" font-size="12" text-anchor="middle">-23 %</text>
  <!-- barres positives (teal) -->
  <rect x="510" y="126" width="70" height="74" fill="#5eead4"/>
  <text x="545" y="220" fill="#8b909b" font-size="10.5" text-anchor="middle">fêtes 25</text>
  <text x="545" y="118" fill="#5eead4" font-size="12" text-anchor="middle">+31 %</text>
  <rect x="650" y="100" width="70" height="100" fill="#5eead4"/>
  <text x="672" y="220" fill="#8b909b" font-size="10.5" text-anchor="middle">mars 26</text>
  <text x="672" y="92" fill="#5eead4" font-size="12" text-anchor="middle">+42 %</text>
  <text x="32" y="352" fill="#8b909b" font-size="11">Le trafic IA convertissait moins bien que le trafic humain, puis a basculé fin 2025. Un signal récent, et limité au commerce de détail.</text>
</svg>
<figcaption>Écart de taux de conversion entre trafic venu d'une IA générative et trafic classique, commerce de détail américain. Source : Adobe Analytics / Adobe Digital Insights (mars 2025 à mars 2026), base supérieure à mille milliards de visites. Données propres au retail, non généralisables à l'ensemble du web.</figcaption>
</figure>

Deux enseignements, et ils vont à rebours du récit triomphaliste. D'abord, l'IA sert surtout à la phase de recherche et de comparaison : l'internaute s'informe via l'agent, puis convertit, ce qui explique des sessions plus longues et un panier mieux préparé. Ensuite, le retournement de la conversion est très récent, propre au commerce de détail, et ne dit rien d'un effondrement généralisé de la publicité. La prudence interdit d'extrapoler de la vente en ligne vers l'ensemble de l'économie de l'information.

## L'économie de l'intention : une promesse, et une mise en garde

Le terme mérite d'être daté, car il porte deux lectures opposées. « L'économie de l'intention » a d'abord été un concept pro-consommateur, forgé par Doc Searls dans une chronique du Linux Journal en mars 2006, puis développé dans son livre de 2012 et son ProjectVRM au Berkman Klein Center de Harvard : l'idée que le client, et non la plateforme, finirait par contrôler la donnée de ses propres intentions d'achat.

La version contemporaine est nettement plus sombre, et elle est académique. Dans « Beware the Intention Economy : Collection and Commodification of Intent via Large Language Models », publié le 30 décembre 2024 dans la Harvard Data Science Review, les chercheurs Yaqub Chaudhary et Jonnie Penn, du Leverhulme Centre for the Future of Intelligence de Cambridge, décrivent un marché émergent où les modèles de langage captent, manipulent et revendent non plus l'attention, mais la motivation. Les agents conversationnels peuvent influer subtilement sur les intentions, par exemple en imitant le style d'écriture de l'utilisateur pour paraître familiers, ou en devinant par avance sa formulation.

Ce point recadre toute analyse honnête, et il répond à une objection légitime : non, la prédiction quasi totale des comportements n'est pas acquise. Chaudhary et Penn présentent l'économie de l'intention comme une perspective « inquiétante si elle n'est pas surveillée », pas comme un fait établi. Ils notent que la formalisation de l'« intention » par les chercheurs eux-mêmes reste grossière : une équipe de Microsoft, en 2024, range les intentions des utilisateurs dans des cases telles que « recherche d'information », « résolution de problème » ou « loisir », ce qui souligne à quel point l'objet est mal cerné. Les humains restent largement imprévisibles, et la promesse de lire l'intention est, à ce stade, un argument commercial autant qu'une capacité technique. Toute l'architecture décrite ci-dessous se construit sur cette promesse, sans l'avoir démontrée.

## 402 Payment Required : le code oublié du web

Le protocole HTTP contient depuis ses premières spécifications un code de statut resté lettre morte pendant des décennies : le `402 Payment Required`. Réservé « pour un usage futur », il décrivait un web où l'on paierait nativement l'accès à une ressource. Faute de rail de paiement à l'échelle de la requête, ce futur n'était jamais venu. Deux acteurs que tout oppose viennent de le ressusciter pour la même raison : les agents IA ont besoin de payer.

Le 1er juillet 2025, Cloudflare est devenu le premier grand fournisseur d'infrastructure à bloquer par défaut les robots d'IA sur les nouveaux domaines, basculant d'un modèle d'« opt-out » vers un modèle d'« opt-in ». La même annonce lançait Pay Per Crawl, une place de marché où un éditeur peut exiger une rémunération chaque fois qu'une IA aspire une page : autoriser gratuitement, facturer, ou bloquer. Mécaniquement, le robot présente une intention de paiement dans l'en-tête de la requête et obtient un `200`, ou se voit renvoyer un `402` assorti d'un tarif. Cloudflare agit comme marchand de référence et opère le règlement. L'entreprise sert environ un cinquième du trafic web mondial, ce qui donne au dispositif une portée potentielle réelle, mais en phase de bêta le rapport de force reste écrasant : un petit éditeur indépendant n'a aucun levier face aux grands modèles, et le revenu immédiat est modeste.

Côté crypto, Coinbase a publié en mai 2025 le livre blanc de [x402](/glossaire/#x402), un standard ouvert qui réactive ce même code 402 pour incruster un paiement en stablecoin directement dans l'échange HTTP. Le principe tient en un aller-retour : un client demande une ressource, le serveur répond avec un prix, le client signe un paiement en stablecoin, la ressource est délivrée, sans compte ni clé d'API. Les règlements se font principalement en [USDC](/glossaire/#usdc), sur plusieurs chaînes. En septembre 2025, Coinbase et Cloudflare ont fondé la x402 Foundation, passée depuis sous la gouvernance de la Linux Foundation, avec une vingtaine de membres dont Google, Stripe et Visa. Les chiffres de traction se manient avec prudence, car ils émanent des promoteurs du standard et mêlent transactions techniques et paiements réels : plus de **35 millions de transactions** sur la seule chaîne Solana à mars 2026, une intégration dans l'API PaymentIntents de Stripe, et une couche de paiement estimée autour de **600 millions de dollars** en rythme annualisé.

L'infrastructure web héritée et la crypto visent la même primitive : rendre le paiement natif du protocole, à la granularité de la requête. C'est la condition matérielle du micropaiement (payer quelques centimes pour une réponse précise) et du paiement streamé (payer en continu, au fil de la consommation), impossibles avec les rails hérités, conçus pour des transactions humaines, lentes et coûteuses en frais fixes.

## La pile agentique : MCP, A2A et un brouillon IETF

Pour qu'un agent paie, il faut d'abord qu'il sache parler aux outils et aux autres agents. Trois protocoles structurent cette pile. Deux sont déjà des standards de fait, le troisième est un brouillon dont il faut décrire le statut avec honnêteté.

Le [MCP](/glossaire/#mcp), Model Context Protocol, introduit par Anthropic le 25 novembre 2024, est un cadre fondé sur JSON-RPC 2.0 qui standardise la manière dont une IA lit des fichiers, exécute des fonctions et récupère du contexte depuis des sources externes. Avant lui, chaque intégration relevait du sur-mesure. L'adoption a été rapide et transpartisane : OpenAI l'a adopté en mars 2025, Google DeepMind en avril 2025, Microsoft l'a intégré à Windows et à Copilot Studio. En décembre 2025, Anthropic a transféré MCP à l'Agentic AI Foundation, sous l'égide de la Linux Foundation, cofondée avec Block et OpenAI. On dénombrait alors plus de **16 000 serveurs** MCP en circulation.

Là où MCP relie un agent à des outils, le protocole [A2A](/glossaire/#a2a), Agent2Agent, relie les agents entre eux. Annoncé par Google le 9 avril 2025, il permet à des agents de fournisseurs différents de se découvrir, de s'authentifier et de se déléguer des tâches. Google l'a transféré à la Linux Foundation dès le 23 juin 2025, avec le soutien d'Amazon, Microsoft, Salesforce, Cisco, SAP et ServiceNow. Objectivité oblige : malgré une architecture solide, l'élan d'A2A a paru ralentir face à MCP à l'automne 2025. En matière de protocoles, l'adoption l'emporte souvent sur l'élégance technique.

Le troisième document est souvent surinterprété. Il s'agit d'un Internet-Draft individuel (`draft-zeng-mcp-network-mgmt-01`), publié le 16 octobre 2025 par Zeng Guanming, ingénieur chez Huawei, valable jusqu'au 19 avril 2026. Ni RFC, ni document de groupe de travail adopté : une proposition individuelle, « work in progress », dont la version courante est d'ailleurs expirée à la date de cet article. Sur le fond, l'idée éclaire une trajectoire : étendre MCP pour que des équipements réseau (routeurs, commutateurs) se comportent comme des serveurs MCP. Le brouillon définit sept outils, des ressources adressables et des codes d'erreur dédiés. Aujourd'hui, un contrôleur réseau doit parler CLI, NETCONF, SNMP, gNMI et des API propriétaires ; demain, un agent diagnostiquerait une panne via le même canal MCP qu'il utilise pour tout le reste. La portée réelle dépendra de l'adoption par un groupe de travail IETF, qui n'est pas acquise.

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

La couche la plus disputée n'est pas technique, elle est monétaire. Un agent qui décide a besoin d'un véhicule monétaire programmable, instantané, sans frontière et à faible coût unitaire. Les stablecoins cochent ces cases, et ils servent déjà de rail concret hors du laboratoire, comme l'a montré le règlement en [USDT des péages du détroit d'Ormuz](/posts/iran-peages-ormuz-usdt-tron-ofac/).

D'après une note des services de la Réserve fédérale (avril 2026), la capitalisation agrégée des stablecoins atteignait environ **317 milliards de dollars** au 6 avril 2026, en hausse de plus de **50 %** depuis le début 2025. Le secteur est très concentré : l'[USDT](/glossaire/#usdt) (environ 184 à 187 Md$) et l'[USDC](/glossaire/#usdc) (environ 77 Md$) en représentent l'écrasante majorité. Le cadre américain s'est clarifié avec le [GENIUS Act](/glossaire/#genius), promulgué le 18 juillet 2025, qui impose une couverture intégrale des réserves ; il s'inscrit dans le mouvement de régulation détaillé à propos du [CLARITY Act et de l'encadrement crypto américain](/posts/clarity-act-regulation-crypto-etats-unis/). Un fait, enfin, est décisif : selon la BCE, environ **99 %** de l'offre de stablecoins en circulation est libellée en dollar.

Sur ce socle, deux familles d'acteurs s'affrontent. D'un côté, les standards crypto-natifs : x402 et son intégration dans le protocole [AP2](/glossaire/#ap2) de Google, dont x402 est le facilitateur stablecoin. De l'autre, les réseaux de cartes, qui n'entendent pas se laisser contourner. Visa a lancé Visa Intelligent Commerce le 30 avril 2025 avec neuf partenaires fondateurs, dont OpenAI ; Mastercard a lancé Agent Pay en avril 2025, décliné en juin 2026 en « Agent Pay for Machines » pour des micropaiements de l'ordre de la fraction de centime. OpenAI a lancé Instant Checkout le 29 septembre 2025 avec Stripe, via l'[ACP](/glossaire/#acp), Agentic Commerce Protocol, d'abord pour Etsy, Walmart et Shopify. La grille de lecture la plus juste vient des analystes du secteur : la confiance et l'autorisation en haut (AP2, Visa, Mastercard), l'exécution et le règlement en bas (x402, stablecoins on-chain). Visa joue la complémentarité, alignant son Trusted Agent Protocol sur l'ACP d'OpenAI et le standard x402.

Le rappel à la réalité tempère l'enthousiasme. Selon une estimation sectorielle, seuls environ **4 %** des consommateurs laissent aujourd'hui une IA finaliser un achat de façon autonome : l'infrastructure arrive très en avance sur la confiance. Et les volumes se lisent avec rigueur. Un volume de transfert agrégé de l'ordre de **33 000 milliards de dollars** en 2025 (rapporté par Artemis et Bloomberg) ne se confond pas avec un volume de paiements réels, bien plus modeste.

## Qui a déjà basculé, et qui résiste

L'architecture cesse d'être théorique quand on regarde les entreprises qui l'exploitent. Trois cas concrets, chiffrés, montrent la diversité des modèles, et le fait qu'aucun n'a renoncé à monétiser.

Perplexity, le moteur de réponse valorisé autour de **20 milliards de dollars** selon la presse, a lancé en août 2025 un programme de partage de revenus avec les éditeurs, Comet Plus. Le mécanisme tranche avec la publicité au clic : une dotation de **42,5 millions de dollars**, un partage **80 / 20** en faveur des éditeurs, financé par un abonnement à **5 dollars** par mois, et une rémunération déclenchée par les visites directes, les citations et l'usage par les agents. Les premiers partenaires cités comprennent Fortune, Time, Der Spiegel, Gannett et The Independent. Le navigateur Comet, lancé en juillet 2025 puis rendu gratuit en octobre, en est la porte d'entrée. C'est un modèle où la source est payée parce qu'elle est citée, pas parce qu'elle attire un clic publicitaire.

OpenAI illustre la coexistence des modèles plutôt que la rupture. D'un côté, Instant Checkout transforme ChatGPT en surface d'achat agentique ; de l'autre, l'entreprise a introduit début 2026 de la publicité dans ses offres gratuite et « Go », exactement le modèle qu'on dit menacé. Avec environ **900 millions** d'utilisateurs hebdomadaires et un chiffre d'affaires annualisé supérieur à **20 milliards de dollars** en 2025, OpenAI ne choisit pas entre attention et intention, il empile les deux.

Amazon, enfin, montre qu'il n'y a pas de convergence obligatoire vers les protocoles ouverts. Son assistant Rufus, devenu « Alexa for Shopping » en mai 2026, a été utilisé par plus de **300 millions** de clients en 2025 et a généré près de **12 milliards de dollars** de ventes incrémentales annualisées, selon les résultats du quatrième trimestre 2025 publiés en février 2026. Sa fonction « Buy for Me » exécute un achat sur des boutiques externes pour le compte de l'utilisateur. Mais Amazon n'a adopté ni MCP, ni x402, ni AP2 : il garde un jardin clos, adossé à son catalogue, ses avis, sa logistique et ses paiements. La fragmentation des standards est une issue aussi probable que leur unification.

## Le retour de la régulation : RGPD, DMA, antitrust

L'angle le plus négligé du débat agentique est juridique, et il pèse lourd. Un agent qui décide et paie seul se heurte d'abord au RGPD. Son article 22 confère à toute personne le droit de ne pas faire l'objet d'une décision fondée exclusivement sur un traitement automatisé produisant des effets juridiques ou l'affectant de manière significative. Un achat autonome, un refus de service, un arbitrage financier exécuté sans intervention humaine entrent dans ce périmètre. La couche agentique ne se déploiera pas dans un vide normatif.

Le Digital Markets Act européen ajoute une contrainte structurelle. Sept entreprises sont désignées « contrôleurs d'accès » (Alphabet, Amazon, Apple, Booking, ByteDance, Meta, Microsoft), précisément celles qui construisent les agents et leurs interfaces. La Commission a infligé ses premières amendes les 22 et 23 avril 2025 : **500 millions d'euros** à Apple pour des pratiques de bridage du renvoi des utilisateurs hors de son App Store, et **200 millions d'euros** à Meta pour son modèle « consentir ou payer », jugé contraire à l'obligation d'offrir une alternative moins gourmande en données personnelles. Ces décisions montrent que la capacité d'un agent à orienter, comparer et conclure une transaction sera lue à l'aune des règles sur le verrouillage et le consentement.

Sur l'antitrust, l'affaire United States contre Google fixe les bornes. Après avoir jugé en août 2024 que Google détenait un monopole illégal sur la recherche et la publicité textuelle associée, le juge Amit Mehta a rendu le 2 septembre 2025 des remèdes comportementaux, et non structurels : pas de cession de Chrome, mais l'interdiction des contrats d'exclusivité par défaut pour la recherche, Chrome, Assistant et Gemini, et l'obligation de partager certaines données d'index et d'usage avec des concurrents qualifiés. Le jugement final est intervenu en décembre 2025, suivi d'appels croisés début 2026. La leçon est à double tranchant, et elle répond directement à la tentation de surestimer la toute-puissance des plateformes : la régulation mord, mais Google conserve environ **90 %** du marché de la recherche et peut continuer à payer pour rester le moteur par défaut. La puissance des plateformes est contestée, contrainte, mais résiliente.

## L'euro numérique, ou la souveraineté contre le dollar programmable

La thèse du « tout se fera en crypto » bute sur un angle mort : la quasi-totalité de cette crypto est en réalité du dollar. Quand 99 % des stablecoins sont libellés en dollar, la couche monétaire des agents n'est pas neutre, elle est dollarisée. La Banque centrale européenne cherche à contrer cela, et voilà qui redonne tout son sens au projet d'euro numérique.

L'état du projet est documenté et daté. Le 30 octobre 2025, la BCE a clos sa phase préparatoire. Le calendrier officiel est explicite : si les colégislateurs adoptent le règlement au cours de 2026, un pilote pourrait démarrer à la mi-2027, pour une première émission potentielle en 2029. Le coût de construction est estimé autour de **1,3 milliard d'euros**, plus environ **320 millions par an** ensuite. En décembre 2025, Christine Lagarde a résumé la situation : le travail technique est fait, la balle est dans le camp politique. Elle présente l'euro numérique, une monnaie numérique de banque centrale ([CBDC](/glossaire/#cbdc)), comme un outil de souveraineté réduisant la dépendance à Visa, Mastercard ou aux stablecoins en dollar. Le secteur privé n'attend pas : un consortium d'une dizaine de banques (dont BNP Paribas, ING et UniCredit), Qivalis, prépare un stablecoin en euro. Ces inquiétudes affleurent jusque dans les dossiers d'agrément, comme l'a illustré le [bras de fer autour de l'enregistrement MiCA de Binance](/posts/binance-mica-lagarde/).

L'objection à formuler n'est pas idéologique, elle est factuelle. Un stablecoin privé en dollar et une CBDC en euro répondent à des fonctions et à des rapports de force différents. La vraie question : qui contrôle l'unité de compte dans laquelle les agents régleront leurs transactions ? Tant que la réponse reste le dollar, via des émetteurs privés américains, la promesse de neutralité de la couche agentique demeure partielle. Une infrastructure peut être techniquement décentralisée et monétairement très centralisée.

## La confiance comme actif : l'alignement devient le produit

Dans un monde où des IA décident pour nous, le critère premier n'est plus la pertinence, c'est l'alignement. Un agent qui recommande un choix parce qu'une entreprise a payé en coulisses n'est plus un outil, c'est un cheval de Troie. Pour un acteur comme Google, basculer vers des agents qui répondent directement reviendrait à entamer la machine publicitaire qui génère la quasi-totalité de ses revenus, d'où la tentation d'un entre-deux, des résultats discrètement biaisés. La crédibilité de l'outil s'effondre précisément à cet endroit, et c'est pourquoi la mise en garde de Chaudhary et Penn vaut autant que les promesses des promoteurs.

L'économie de l'intention diverge ici de l'économie de l'attention sans la remplacer. Dans la seconde, la friction est rentable ; dans la première, la valeur réside dans l'absence de friction et la confiance. Si l'agent ne renvoie nulle part, la seule chose qu'on achète vraiment, c'est sa neutralité. Mais deux garde-fous s'imposent. Un standard ouvert n'est pas un standard neutre : MCP, A2A et x402 sont gouvernés par des fondations cofondées par les mêmes géants qu'ils sont censés discipliner, et l'ouverture du code déplace le terrain de la capture vers la gouvernance. Et la transparence méthodologique a un coût de découvrabilité : un site qui refuse trackers et SEO agressif envoie moins de signaux aux moteurs. Dans le web de l'attention, cette propreté est une pénalité ; dans le web de l'intention, elle ne devient un atout que si les agents valorisent réellement la vérifiabilité, sans aucune garantie qu'ils le fassent.

Le dilemme de l'innovateur, formalisé par Clayton Christensen, éclaire le pari final. Une entreprise dominante meurt rarement par mauvaise gestion, mais parce qu'elle s'accroche au modèle rentable qui a fait son succès et rate le virage suivant. Si les géants refusent de sacrifier leur rente publicitaire pour garantir la neutralité agentique, ils seront concurrencés par des acteurs au modèle natif différent. Mais concurrencés ne signifie pas remplacés : Visa, Mastercard, Google et OpenAI investissent la couche de paiement agentique précisément pour ne pas être désintermédiés. Le scénario le plus probable n'est pas la mort des dominants, c'est leur mutation, avec tous les biais qu'elle cherchera à préserver.

## Usages concrets pour un éditeur indépendant

Reste à atterrir sur l'opérationnel. Pour une veille technique qui croise des données brutes ([SEC](/glossaire/#sec), FRED, on-chain) sans dépendre d'un outil propriétaire fermé, la bascule ouvre des leviers immédiats, sans attendre 2029.

Reprendre le contrôle du crawl, d'abord. Un blocage par défaut des robots d'IA, et au besoin un tarif d'accès via un dispositif de type Pay Per Crawl, transforme l'aspiration de contenu d'un coût subi en relation contractuelle. Le levier financier reste faible pour un petit site, mais le levier d'information, savoir qui aspire quoi et dans quel but, est réel.

Exposer ses données via un serveur MCP, ensuite. Plutôt que d'espérer un bon référencement par un moteur taillé pour la finance grand public, un éditeur publie un serveur MCP qui livre proprement ses jeux de données aux agents. On ne court plus après le référencement, on devient une source que les agents appellent directement, à l'image du modèle Comet Plus de Perplexity, qui paie la citation et non le clic.

Monétiser la résolution plutôt que l'audience, enfin. Un point d'accès payant en x402, quelques centimes en stablecoin par requête et sans création de compte, permet de facturer un calcul, un croisement de sources ou une donnée vérifiée à l'agent qui en a besoin. La prudence reste de mise. Ces dispositifs sont jeunes : Pay Per Crawl est en bêta, x402 vient d'avoir un an. La sécurité doit primer : exposer un serveur MCP ou un point d'accès payant ouvre une surface d'attaque, et le brouillon IETF lui-même consacre une section entière à cette question. L'usage de masse n'est pas là : environ 4 % des consommateurs délèguent un achat à une IA, et le RGPD encadre strictement les décisions automatisées.

L'économie de l'attention, financée par la publicité, ne disparaît pas : elle se réinstalle dans les interfaces d'IA, comme le montrent la publicité dans ChatGPT et dans Gemini. À côté d'elle se construisent des économies fragmentées des intentions, où l'on paie pour résoudre un problème précis. La bascule est techniquement amorcée, les protocoles existent, le code 402 est ressuscité. Elle reste économiquement embryonnaire, juridiquement encadrée, monétairement dollarisée, et adossée à une promesse de prédiction que la recherche invite à regarder avec méfiance. Les acteurs capables d'incarner une neutralité vérifiable n'ont rien gagné d'avance, mais ils jouent désormais sur un terrain où cette neutralité commence à avoir une valeur marchande.

---

**Sources principales :** Y. Chaudhary et J. Penn, « Beware the Intention Economy : Collection and Commodification of Intent via Large Language Models », Harvard Data Science Review (30 décembre 2024) ; D. Searls, Linux Journal (mars 2006) et The Intention Economy (2012) ; Pew Research Center, « Google users are less likely to click on links when an AI summary appears » (22 juillet 2025, 900 adultes, ≈ 69 000 recherches) ; Adobe Analytics / Adobe Digital Insights (mars 2025 à mars 2026, conversion, temps passé et trafic IA dans le retail) ; Réserve fédérale, FEDS Notes (8 avril 2026, stablecoins) ; BCE et Banque de France (clôture de la phase préparatoire, 30 octobre 2025 ; calendrier 2027-2029) ; CoinDesk (C. Lagarde, 18 décembre 2025) ; WPP Media (déc. 2025), Dentsu (déc. 2025), GroupM (EOY 2024), Statista (2025) ; blog officiel Cloudflare et *Nieman Lab* (Pay Per Crawl, 1er juillet 2025) ; Coinbase (livre blanc x402, mai 2025), *The Defiant* et BlockEden (x402 Foundation) ; Model Context Protocol Blog et Linux Foundation (MCP, A2A) ; IETF, draft-zeng-mcp-network-mgmt-01 (16 octobre 2025) ; Digital Commerce 360, Mastercard et Visa (Intelligent Commerce, Agent Pay, Instant Checkout) ; Digiday et Bloomberg (Perplexity Comet Plus) ; OpenAI et Reuters (audience et publicité ChatGPT) ; résultats Amazon du 4e trimestre 2025 (Rufus, Buy for Me, février 2026) ; Commission européenne (amendes DMA, 22-23 avril 2025) ; RGPD, article 22 ; United States v. Google, décisions du juge A. Mehta (août 2024, 2 septembre 2025, jugement final décembre 2025) ; American Dialect Society et Macquarie Dictionary (« enshittification »). Les agrégats de stablecoins et les volumes de transfert sont des ordres de grandeur, distincts des paiements réels ; les données Adobe sont propres au commerce de détail américain et non généralisables.
