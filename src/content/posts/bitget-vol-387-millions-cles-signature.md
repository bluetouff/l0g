---
title: "Bitget : 387,5 millions volés, le piège de la signature"
seoTitle: "Bitget : vol de 387,5 millions et retraits suspendus | l0g"
description: "Clés privées, fonds de protection, gel des XRP et calendrier de reprise : comprendre le vol chez Bitget et les limites des garanties annoncées."
pubDate: "2026-09-26T18:13:02+02:00"
tags: ["Bitget", "cryptomonnaies", "cybersécurité", "conservation", "risques"]
draft: false
ogImage: "/illustrations/news/bitget-cles-signature-v1.jpg"
quickTake: {"fact": "Bitget estime à 387,5 millions de dollars les actifs volés le 24 septembre 2026 et annonce une reprise des retraits à partir du 28 septembre.", "importance": "Une clé restée secrète peut signer une instruction falsifiée si les contrôles en amont sont trompés. Le client dépend ensuite du rétablissement des retraits.", "uncertainty": "L’absence de compromission des clés et la couverture des pertes sont les déclarations de Bitget. Le rapport technique indépendant et le bilan final des récupérations restent attendus."}
---

Un solde intact à l’écran, des échanges toujours possibles, mais des retraits suspendus. C’est la situation décrite par Bitget après l’attaque du **24 septembre 2026**. La plateforme évalue désormais à **387,5 millions de dollars les actifs transférés vers les adresses des attaquants**, contre 351,6 millions dans son premier bilan. Elle explique cette révision par des transferts sur Zcash et TRON initialement omis. Ce montant brut concerne la même attaque ; la perte finale dépendra notamment des récupérations. [Avis initial](https://www.bitget.com/support/articles/12560603896024), [bilan révisé](https://www.bitget.com/support/articles/12560603896108).

L’explication de Gracy Chen, la dirigeante de Bitget, soulève une question plus profonde que le montant du vol. Les pirates auraient compromis un système interne, falsifié des données de transaction et déclenché le processus d’autorisation. **Selon elle, les clés privées n’ont pas été compromises.** CoinDesk rapporte cette conclusion préliminaire de l’entreprise. Comment des actifs peuvent-ils partir si le secret permettant de les déplacer reste protégé ? [Déclaration rapportée le 25 septembre](https://www.coindesk.com/markets/2026/09/25/bitget-s-usd351-million-hack-happened-via-spoofed-transfers-not-private-keys-ceo-gray-chen-says).

Le 26 septembre, Bitget a annoncé une reprise progressive des retraits entre le 28 septembre et le 2 octobre. À la date de cette publication, ces échéances restent à venir. [Calendrier annoncé](https://www.bitget.com/support/articles/12560603896110).

## La clé signe ce qu’on lui soumet

Une **clé privée** permet de produire une signature cryptographique. Celle-ci sert notamment à vérifier l’origine des données et leur intégrité. Le [NIST, l’institut américain de normalisation](https://csrc.nist.gov/glossary/term/digital_signature), définit ces fonctions. Sur Ethereum, la transaction signée contient notamment une destination et une valeur ; le réseau applique ses règles de validation. La conformité du paiement aux procédures commerciales de l’entreprise exige des contrôles supplémentaires. [Documentation Ethereum](https://ethereum.org/developers/docs/transactions).

Prenons un exemple fictif. Une entreprise conserve sa clé dans un dispositif spécialisé. Un autre logiciel prépare les paiements et les lui soumet. Si une demande falsifiée passe les contrôles et atteint le dispositif, celui-ci peut la signer avec une clé qui reste secrète. La signature protège alors des données déjà fausses à leur entrée dans le circuit.

<figure class="infographic" style="max-width:33rem;margin:2rem auto;padding-bottom:1rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 342" role="img" aria-labelledby="bitget-fr-signature-title bitget-fr-signature-desc" style="width:100%;height:auto" font-family="Arial, Helvetica, sans-serif">
<title id="bitget-fr-signature-title">Une fausse demande bien signée</title>
<desc id="bitget-fr-signature-desc">Exemple fictif : une demande falsifiée trompe un contrôle interne, atteint un dispositif dont la clé reste secrète et reçoit une signature. Le réseau peut exécuter la transaction si ses règles sont respectées. Les flèches suivent ce circuit ; il ne reconstitue pas l’attaque Bitget.</desc>
<rect x="0" y="0" width="500" height="342" rx="6" fill="var(--color-surface)"/>
<text x="24" y="34" font-size="24" font-weight="700" text-anchor="start" fill="var(--color-paper)">Une fausse demande bien signée</text>
<text x="24" y="65" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-muted)">Exemple fictif de circuit compromis</text>
<path d="M208 135H292 M285 130L292 135L285 140" fill="none" stroke="var(--color-accent)" stroke-width="2"/>
<path d="M388 184V226 M383 219L388 226L393 219" fill="none" stroke="var(--color-accent)" stroke-width="2"/>
<path d="M292 277H208 M215 272L208 277L215 282" fill="none" stroke="var(--color-signal)" stroke-width="2"/>
<g>
<rect x="24" y="90" width="176" height="90" rx="6" fill="var(--color-surface)" stroke="var(--color-line-strong)"/>
<text x="112.0" y="129.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-accent)">Demande</text>
<text x="112.0" y="157.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-accent)">falsifiée</text>
</g>
<g>
<rect x="300" y="90" width="176" height="90" rx="6" fill="var(--color-surface)" stroke="var(--color-line-strong)"/>
<text x="388.0" y="129.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-accent)">Contrôle</text>
<text x="388.0" y="157.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-accent)">trompé</text>
</g>
<g>
<rect x="300" y="232" width="176" height="90" rx="6" fill="var(--color-surface)" stroke="var(--color-line-strong)"/>
<text x="388.0" y="271.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-signal)">Clé secrète</text>
<text x="388.0" y="299.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-signal)">Signature</text>
</g>
<g>
<rect x="24" y="232" width="176" height="90" rx="6" fill="var(--color-surface)" stroke="var(--color-line-strong)"/>
<text x="112.0" y="271.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-paper)">Réseau</text>
<text x="112.0" y="299.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-paper)">Exécution</text>
</g>
</svg>
<figcaption>Mécanisme conceptuel, sans mesure ni reconstitution de l’intrusion. La clé reste dans le dispositif ; le contrôle défaillant laisse passer la demande. L’exécution suppose le respect des règles du réseau. Sources : <a href="https://csrc.nist.gov/glossary/term/digital_signature">NIST</a>, <a href="https://ethereum.org/developers/docs/transactions">Ethereum</a>. Consultés le 26 septembre 2026.</figcaption>
</figure>

Cette possibilité explique l’importance des informations présentées aux systèmes et aux personnes qui approuvent une opération. Plusieurs validations reposant sur la même instruction falsifiée peuvent partager le même angle mort. L’analyse porte ici sur un mécanisme général : les documents publics ne décrivent pas assez précisément l’architecture de Bitget pour reconstituer son intrusion.

Dans sa mise à jour du 25 septembre, Bitget dit avoir corrigé la vulnérabilité et travailler avec Mandiant et SlowMist. L’entreprise garde certains détails confidentiels pendant l’enquête. Nous n’avons trouvé, dans les sources consultées, aucun rapport technique indépendant permettant de confirmer l’ensemble de son explication. [Point de situation](https://www.bitget.com/support/articles/12560603896108).

## Une chronologie à éclaircir

Les transactions publiques apportent une autre pièce au dossier. Dans son analyse mise à jour le 26 septembre, **Bitquery situe à 21 h 23 UTC le dernier transfert qu’il classe comme volé**, le 24 septembre. Bitget avait indiqué une détection à **18 h 31 UTC**. Le rapprochement mérite une explication sur la chronologie de confinement. [Relevé et méthode de Bitquery](https://bitquery.io/investigations/bitget-hack), [heure annoncée par Bitget](https://www.bitget.com/support/articles/12560603896024).

Les deux heures n’ont toutefois pas la même provenance. La première repose sur les transactions et les adresses attribuées par Bitquery ; la seconde vient de l’entreprise. Sans les journaux internes, impossible de déterminer quels systèmes étaient isolés à chaque étape ou pourquoi certains transferts ont encore abouti. Une signature visible sur la chaîne laisse également ouverte la distinction entre l’usage d’une clé copiée et celui d’un service de signature détourné.

## Le solde du compte et la sortie des actifs

L’incident touche la plateforme d’échange centralisée. **Bitget Wallet**, le produit d’autoconservation portant la même marque, utilise une infrastructure distincte et n’a pas été affecté, selon le porte-parole interrogé par The Block. Cette précision concerne deux services différents. [Réponse de Bitget à The Block](https://www.theblock.co/news/markets/2026-09-24-more-than-170-million-in-crypto-moves-from-bitget-wallets-unidentified-address-416345).

Lorsqu’un tiers conserve les actifs, il contrôle l’accès aux clés nécessaires à leur mouvement. Avec l’**autoconservation**, l’utilisateur gère lui-même cet accès et supporte les risques liés à la perte ou au vol de ses secrets. Le [bulletin de la SEC du 12 décembre 2025](https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/crypto-asset-custody-basics-retail-investors-investor-bulletin-0) décrit cette répartition des responsabilités.

Imaginons un client qui vend un actif à un autre dans une plateforme tenant des comptes internes. L’opérateur peut modifier leurs soldes sans expédier, à chaque échange, des actifs vers un portefeuille extérieur. Le client change ainsi son exposition au prix tout en restant dépendant du dépositaire. Acheter un [stablecoin](/glossaire/stablecoin/) dans cette application laisse cette dépendance en place jusqu’au retrait effectif.

La suspension peut répondre à un besoin de sécurité : réalimenter un circuit encore vulnérable exposerait de nouveaux fonds. Gracy Chen a indiqué à Reuters que l’arrêt des retraits relevait de cette précaution et non d’un manque d’actifs. C’est l’explication de Bitget ; les sources disponibles ne permettent pas d’établir un bilan indépendant de sa solvabilité. [Reuters, 25 septembre, repris par The Star](https://www.thestar.com.my/tech/tech-news/2026/09/26/crypto-exchange-bitget-pauses-withdrawals-after-350-million-stolen-in-hack).

**Pour les résidents français, un dispositif distinct préexistait à l’attaque.** L’avis de Bitget du 13 mars 2026 prévoyait la fermeture des positions et le transfert des actifs restants vers un prestataire agréé, avec un processus de transfert commençant le 8 avril. Le calendrier mondial publié après le vol ne doit donc pas être présenté comme une instruction applicable automatiquement à ces anciens comptes. Cet article n’établit pas leur situation individuelle. [Avis destiné aux utilisateurs français](https://www.bitget.com/support/articles/12560603873710).

## Que vaut la promesse du fonds de protection ?

Dans son avis du 24 septembre, Bitget annonçait un **fonds de protection supérieur à 464 millions de dollars** et affirmait qu’il couvrait la perte. Sa page de présentation décrit une réserve en bitcoins, avec des demandes d’indemnisation examinées par l’entreprise pour les incidents de plateforme. Il s’agit de son propre dispositif de protection, dont il faut examiner les conditions et la mobilisation effective. [Déclaration datée](https://www.bitget.com/support/articles/12560603896024), [règles du fonds](https://www.bitget.com/promotion/protection-fund).

Si des ressources disponibles et suffisantes remplacent les actifs détournés, l’entreprise peut absorber le choc sans réduire les soldes des clients. Encore faut-il rapprocher les quantités mobilisables, leur valorisation et les engagements à servir. La valeur en dollars d’une réserve en bitcoins fluctue ; les actifs à remplacer peuvent être d’une autre nature. Soustraire simplement le vol du montant affiché du fonds fabriquerait un « matelas restant » à partir de périmètres insuffisamment rapprochés.

Bitget publie aussi des **preuves de réserves**, ou *proof of reserves*. Le dispositif décrit associe des instantanés d’actifs à un **arbre de Merkle**, une structure cryptographique permettant notamment de vérifier l’inclusion d’un solde dans un ensemble déclaré. [Présentation de Bitget](https://www.bitget.com/promotion/proof-of-reserves).

Le bureau de défense des investisseurs du PCAOB, organisme américain de supervision des audits, a rappelé le **8 mars 2023** les limites de ces rapports : les procédures peuvent laisser hors champ certains engagements, les droits des clients et l’efficacité des contrôles internes. L’avis concerne cette catégorie de rapports, sans statuer sur Bitget. [Avis du bureau du PCAOB](https://pcaobus.org/news-events/news-releases/news-release-detail/investor-advisory-exercise-caution-with-third-party-verification-proof-of-reserve-reports).

Un inventaire exact à une date donnée peut précéder un détournement. Pour évaluer la protection réelle, il faut donc examiner à la fois les actifs disponibles, ce que l’entreprise doit à ses clients et les conditions dans lesquelles ses systèmes autorisent une sortie.

## Geler un jeton demande un pouvoir précis

Le suivi des fonds fait intervenir plusieurs acteurs. CoinDesk rapportait le 25 septembre le blocage d’USDC et d’USDT présents à une adresse liée à l’attaque, par Circle et Tether. Ce levier porte sur leurs jetons. [Interventions rapportées](https://www.coindesk.com/markets/2026/09/25/circle-and-tether-step-in-to-freeze-hacker-wallet-after-massive-bitget-crypto-heist).

Circle décrit explicitement sa capacité à bloquer les transferts d’USDC vers et depuis certaines adresses dans la section 13 de ses conditions hors Espace économique européen. Ce texte documente un pouvoir sur le jeton ; les droits des détenteurs européens relèvent de documents distincts. [Conditions de Circle](https://www.circle.com/legal/usdc-terms).

**Le XRP illustre la différence.** Dans un suivi publié le 26 septembre, CoinDesk rapporte de nouveaux mouvements de XRP volés. Le protocole distingue les jetons émis sur le XRP Ledger de son actif natif, le XRP : la fonction de gel des premiers ne s’applique pas au second. Ripple ne dispose donc pas de ce même levier sur les XRP détenus directement aux adresses des attaquants. Une plateforme peut en revanche bloquer un compte dans lequel elle conserve des fonds. [Suivi du 26 septembre](https://www.coindesk.com/markets/2026/09/26/bitget-hacker-moves-usd83-million-in-stolen-xrp-that-ripple-cannot-freeze), [documentation du XRP Ledger](https://xrpl.org/docs/concepts/tokens/fungible-tokens/freezes).

<figure class="infographic" style="max-width:33rem;margin:2rem auto;padding-bottom:1rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 342" role="img" aria-labelledby="bitget-fr-freeze-title bitget-fr-freeze-desc" style="width:100%;height:auto" font-family="Arial, Helvetica, sans-serif">
<title id="bitget-fr-freeze-title">Qui peut geler quoi ?</title>
<desc id="bitget-fr-freeze-desc">Circle peut bloquer les transferts d’USDC liés à une adresse. La croix entre Ripple et XRP indique l’absence de cette fonction de gel pour l’actif natif XRP. Une plateforme de conservation peut séparément restreindre ses propres comptes.</desc>
<rect x="0" y="0" width="500" height="342" rx="6" fill="var(--color-surface)"/>
<text x="24" y="34" font-size="24" font-weight="700" text-anchor="start" fill="var(--color-paper)">Qui peut geler quoi ?</text>
<text x="24" y="66" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-muted)">Pouvoir sur le jeton</text>
<path d="M208 128H292 M285 123L292 128L285 133" fill="none" stroke="var(--color-accent)" stroke-width="2"/>
<g>
<rect x="24" y="100" width="176" height="56" rx="6" fill="var(--color-surface)" stroke="var(--color-line-strong)"/>
<text x="112.0" y="136.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-accent)">Circle</text>
</g>
<g>
<rect x="300" y="100" width="176" height="56" rx="6" fill="var(--color-surface)" stroke="var(--color-line-strong)"/>
<text x="388.0" y="136.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-paper)">USDC</text>
</g>
<text x="24" y="189" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-muted)">Transferts ciblés : blocage possible</text>
<path d="M208 248H236 M264 248H292" fill="none" stroke="var(--color-muted)" stroke-width="2"/>
<path d="M243 241L257 255 M243 255L257 241" fill="none" stroke="var(--color-accent)" stroke-width="2"/>
<g>
<rect x="24" y="220" width="176" height="56" rx="6" fill="var(--color-surface)" stroke="var(--color-line-strong)"/>
<text x="112.0" y="256.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-paper)">Ripple</text>
</g>
<g>
<rect x="300" y="220" width="176" height="56" rx="6" fill="var(--color-surface)" stroke="var(--color-line-strong)"/>
<text x="388.0" y="256.0" font-size="22" font-weight="700" text-anchor="middle" fill="var(--color-signal)">XRP</text>
</g>
<text x="24" y="313" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-muted)">XRP : pas de fonction de gel natif</text>
</svg>
<figcaption>Comparaison fonctionnelle au 26 septembre 2026, sans montants. Le blocage d’un jeton et la restriction d’un compte de plateforme ont des périmètres différents. Une plateforme peut bloquer les fonds qu’elle conserve, y compris en XRP. Sources : <a href="https://www.circle.com/legal/usdc-terms">Circle, USDC Terms, §13</a>, <a href="https://xrpl.org/docs/concepts/tokens/fungible-tokens/freezes">XRP Ledger, Freezing Tokens</a>.</figcaption>
</figure>

Cette distinction donne un sens aux conversions rapides observées par Elliptic : passer de certains jetons administrables à un actif natif peut retirer à l’émetteur la possibilité d’intervenir sur le nouvel actif. Les enquêtes et les saisies peuvent néanmoins continuer par d’autres moyens. [Analyse d’Elliptic](https://www.elliptic.co/insights/bitget-attack-pushes-suspected-north-korea-crypto-heists-over-1-billion-in-2026/).

Enfin, retrouver des actifs, en bloquer le mouvement et les restituer correspondent à des étapes différentes. Le gel peut préserver une possibilité de récupération ; le retour effectif suppose encore les opérations et décisions nécessaires. Additionner des montants suivis, gelés puis récupérés risquerait de compter plusieurs fois les mêmes fonds. Notre analyse de la [saisie d’USDT liés, selon le parquet américain, au pétrole iranien](/posts/petrole-iranien-usdt-tether-saisie/) détaille ce passage entre contrôle technique et procédure judiciaire.

## La piste nord-coréenne reste une attribution

Elliptic juge hautement probable un lien avec la Corée du Nord. Son analyse mentionne des connexions avec des adresses utilisées dans des vols précédemment attribués à ces acteurs, notamment celui de Bybit, et des ressemblances dans la circulation des fonds. Elle intègre aussi des indicateurs techniques rapportés par Bitget. [Évaluation publiée le 25 septembre](https://www.elliptic.co/insights/bitget-attack-pushes-suspected-north-korea-crypto-heists-over-1-billion-in-2026/).

Cette appréciation reste celle de l’entreprise d’analyse. Aucune attribution publique du FBI ou du ministère américain de la Justice propre à cet incident n’a été trouvée dans les recherches effectuées au 26 septembre. L’identité des attaquants et la responsabilité de sécuriser les circuits de paiement restent deux sujets à examiner chacun sur leurs éléments.

## Le prochain rendez-vous est un retrait exécuté

Bitget annonce les étapes suivantes, **toutes à 08 h 00 UTC, soit 10 h 00 à Paris** aux dates indiquées. Il s’agit du programme publié le 26 septembre, susceptible d’évoluer. Les réseaux mentionnés comptent autant que le symbole de l’actif. [Programme officiel](https://www.bitget.com/support/articles/12560603896110).

| Date annoncée | Actifs ou services | Réseaux indiqués |
| --- | --- | --- |
| 28 septembre 2026 | BTC | Bitcoin |
| 29 septembre 2026 | ETH | Ethereum, BSC, Arbitrum, Base, Optimism |
| 30 septembre 2026 | USDT | Ethereum, BSC, Solana, Tron |
| 2 octobre 2026 | Autres jetons, monnaies traditionnelles et échanges entre utilisateurs (P2P) | Non détaillés dans le tableau de l’annonce |

La suite se jugera sur les retraits effectivement servis, la mobilisation des ressources promises et les conclusions de l’enquête technique. L’autoconservation transfère à l’utilisateur la responsabilité de ses clés et de ses sauvegardes ; elle exige donc ses propres précautions. [SEC, conservation des cryptoactifs](https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/crypto-asset-custody-basics-retail-investors-investor-bulletin-0).

L’affaire Bitget rappelle surtout où placer le contrôle : protéger le secret, vérifier l’instruction avant signature, puis rendre les actifs réellement accessibles au client. Une clé peut rester enfermée alors que le pouvoir de payer a déjà changé de mains.

## Sources

- Bitget, 2026-09-24. [[SECURITY NOTICE] Bitget exchange hot wallets Incident : September 24, 2026](https://www.bitget.com/support/articles/12560603896024).
- Bitget, 2026-09-25. [Bitget Security Latest Incident Update: Fund Tracing and Recovery Bounty Program](https://www.bitget.com/support/articles/12560603896108).
- Bitget, 2026-09-26. [Bitget to Resume Withdrawals in Phases](https://www.bitget.com/support/articles/12560603896110).
- CoinDesk, 2026-09-25. [Bitget's $352 million hack happened via spoofed transfers, not private keys, CEO Gracy Chen says](https://www.coindesk.com/markets/2026/09/25/bitget-s-usd351-million-hack-happened-via-spoofed-transfers-not-private-keys-ceo-gray-chen-says).
- ethereum.org, consulté le 26 septembre 2026. [Transactions](https://ethereum.org/developers/docs/transactions).
- NIST CSRC, consulté le 26 septembre 2026. [Digital signature : Glossary](https://csrc.nist.gov/glossary/term/digital_signature).
- Bitquery, 2026-09-26. [Bitget hack: how $352M left, and where it is now](https://bitquery.io/investigations/bitget-hack).
- The Block, 2026-09-25. [Bitget confirms $387.5 million security breach affecting exchange hot wallets](https://www.theblock.co/news/markets/2026-09-24-more-than-170-million-in-crypto-moves-from-bitget-wallets-unidentified-address-416345).
- SEC, Office of Investor Education and Assistance, 2025-12-12. [Crypto Asset Custody Basics for Retail Investors : Investor Bulletin](https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/crypto-asset-custody-basics-retail-investors-investor-bulletin-0).
- Reuters, repris par The Star, 2026-09-25. [Crypto exchange Bitget pauses withdrawals after $350 million stolen in hack](https://www.thestar.com.my/tech/tech-news/2026/09/26/crypto-exchange-bitget-pauses-withdrawals-after-350-million-stolen-in-hack).
- Bitget, consulté le 26 septembre 2026. [Bitget Protection Fund](https://www.bitget.com/promotion/protection-fund).
- Bitget, consulté le 26 septembre 2026. [Proof of Reserves](https://www.bitget.com/promotion/proof-of-reserves).
- PCAOB, Office of the Investor Advocate, 2023-03-08. [Exercise Caution With Third-Party Verification/Proof of Reserve Reports](https://pcaobus.org/news-events/news-releases/news-release-detail/investor-advisory-exercise-caution-with-third-party-verification-proof-of-reserve-reports).
- Circle, 2025-12-12. [USDC Terms](https://www.circle.com/legal/usdc-terms).
- CoinDesk, 2026-09-25. [Circle and Tether step in to freeze hacker wallet after massive Bitget crypto heist](https://www.coindesk.com/markets/2026/09/25/circle-and-tether-step-in-to-freeze-hacker-wallet-after-massive-bitget-crypto-heist).
- Elliptic, 2026-09-25. [Bitget attack pushes suspected North Korea crypto heists over $1 billion in 2026](https://www.elliptic.co/insights/bitget-attack-pushes-suspected-north-korea-crypto-heists-over-1-billion-in-2026/).
- CoinDesk, 2026-09-26. [Bitget hacker moves $83 million in stolen XRP that Ripple cannot freeze](https://www.coindesk.com/markets/2026/09/26/bitget-hacker-moves-usd83-million-in-stolen-xrp-that-ripple-cannot-freeze).
- XRP Ledger, consulté le 26 septembre 2026. [Freezing Tokens](https://xrpl.org/docs/concepts/tokens/fungible-tokens/freezes).
- Bitget, 2026-03-13. [Update Announcement for French Users](https://www.bitget.com/support/articles/12560603873710).

## Méthode et limites

Analyse arrêtée au 26 septembre 2026. Le montant de 387,5 millions de dollars, la couverture annoncée et l’absence alléguée de compromission des clés proviennent de Bitget. Les travaux de Bitquery et d’Elliptic sont attribués à leurs auteurs ; l0g n’a pas reproduit l’ensemble du traçage. Le calendrier de reprise est prospectif.

Les schémas expliquent des mécanismes généraux, sans décrire l’architecture de Bitget. Aucun accès aux journaux internes, audit complet des réserves ou entretien propre à l0g n’a été réalisé. La déclaration de Gracy Chen a été vérifiée dans le compte rendu de CoinDesk ; son message sur X n’était pas directement accessible. Les règles générales des fonds et des jetons ne déterminent pas la situation contractuelle de chaque client.
