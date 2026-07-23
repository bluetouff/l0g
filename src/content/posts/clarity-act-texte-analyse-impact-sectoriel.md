---
title: "CLARITY Act, le texte au scalpel : la nouvelle architecture de la crypto américaine"
description: "Le texte du CLARITY Act tel que rapporté au Sénat compte 594 pages et contient en réalité deux lois : une refonte complète de la régulation des actifs numériques et l'interdiction d'une monnaie numérique de banque centrale. Sa clé de voûte est un test de maturité qui fait basculer un actif de la SEC vers la CFTC. Analyse d'impact sectoriel, section par section, du texte officiel : émetteurs, bourses, DeFi, stablecoins, banques, et les angles morts. Rien d'inventé, tout sourcé au texte."
pubDate: 2026-07-23T10:56:00+02:00
updatedDate: 2026-07-23T10:56:00+02:00
tags: ["clarity act", "crypto", "régulation", "politique us", "stablecoins"]
draft: false
---

*Le texte existe, et il est massif. La version du CLARITY Act rapportée au Sénat, référencée [H.R. 3633 RS](https://www.congress.gov/119/bills/hr3633/BILLS-119hr3633rs.pdf), compte 594 pages et porte en réalité deux titres officiels : le « Digital Asset Market Clarity Act of 2025 » et l'« Anti-CBDC Surveillance State Act ». Ce n'est pas un texte de dérégulation légère, c'est la construction d'un régime réglementaire entier, avec enregistrement, informations obligatoires, garde et conformité anti-blanchiment. Sa clé de voûte tient en un mécanisme : un test de maturité qui décide si un actif relève du gendarme boursier, la [SEC](/glossaire/#sec), ou du gendarme des matières premières, la [CFTC](/glossaire/#cftc). Nous avons lu le texte pour en tirer une analyse d'impact secteur par secteur, chaque affirmation renvoyant à sa section. Précision liminaire : cette version rapportée ne contient pas la clause éthique visant les responsables publics dont la négociation faisait l'actualité de juillet, sujet distinct que nous avons traité dans notre article sur [le compte à rebours d'août](/posts/clarity-act-trump-cede-ethique-compte-a-rebours-aout/).*

## Le test de maturité, clé de voûte

Tout le dispositif repose sur une bascule de compétence. Un jeton vendu au public via un contrat d'investissement reste, à l'émission, un actif accessoire relevant de la SEC. Mais dès que la blockchain qui le porte devient un « mature blockchain system », l'actif se qualifie en « digital commodity » et passe sous la juridiction au comptant de la CFTC. La définition, à la section 104, est d'une sobriété trompeuse : un système de blockchain mûr est celui « qui n'est contrôlé par aucune personne ni aucun groupe de personnes sous contrôle commun ». La décentralisation devient donc le critère juridique qui réassigne le régulateur.

Le passage n'est pas automatique. Le texte crée, à la section 205, un nouvel article 42 du Securities Exchange Act qui organise une **certification** : l'émetteur d'un actif numérique dépose auprès de la SEC une attestation que la blockchain est mûre. C'est le point le plus sensible du texte, une auto-certification de la décentralisation, encadrée par un contrôle de l'agence mais initiée par l'émetteur. Pour éviter que chaque acteur invente sa propre définition, la section 105 impose à la SEC et à la CFTC de définir **conjointement** par voie réglementaire les termes clés, dont « mature blockchain system », « decentralized governance system » et la notion décisive d'« autorité unilatérale ». La loi pose donc le principe ; la frontière réelle sera tracée par deux ans de rulemaking commun.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 340" role="img" aria-label="Le test de maturité qui répartit un actif numérique entre la SEC et la CFTC" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="340" fill="#0c0d10"/>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Le test de maturité, du gendarme boursier au gendarme des matières premières</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Mécanique de la section 104 et de l'article 42 nouveau. Source : H.R. 3633 RS.</text>

  <rect x="270" y="82" width="180" height="46" fill="none" stroke="#7aa2f7" stroke-width="1.5"/>
  <text x="360" y="103" fill="#7aa2f7" font-size="13" font-weight="700" text-anchor="middle">Jeton émis</text>
  <text x="360" y="120" fill="#8b909b" font-size="11" text-anchor="middle">via contrat d'investissement</text>

  <line x1="360" y1="128" x2="360" y2="158" stroke="#8b909b" stroke-width="1"/>
  <text x="360" y="150" fill="#d6d9df" font-size="12" text-anchor="middle">Blockchain sous contrôle commun ?</text>

  <rect x="70" y="176" width="250" height="70" fill="none" stroke="#ff4d87" stroke-width="1.5"/>
  <text x="195" y="200" fill="#ff4d87" font-size="13" font-weight="700" text-anchor="middle">OUI : actif accessoire</text>
  <text x="195" y="220" fill="#d6d9df" font-size="12" text-anchor="middle">Régulateur : SEC</text>
  <text x="195" y="238" fill="#8b909b" font-size="11" text-anchor="middle">émission, disclosures, insiders</text>

  <rect x="400" y="176" width="250" height="70" fill="none" stroke="#5eead4" stroke-width="1.5"/>
  <text x="525" y="200" fill="#5eead4" font-size="13" font-weight="700" text-anchor="middle">NON : digital commodity</text>
  <text x="525" y="220" fill="#d6d9df" font-size="12" text-anchor="middle">Régulateur : CFTC</text>
  <text x="525" y="238" fill="#8b909b" font-size="11" text-anchor="middle">marché au comptant, bourses agréées</text>

  <line x1="360" y1="270" x2="360" y2="296" stroke="#f5b13d" stroke-width="1.5"/>
  <text x="360" y="288" fill="#f5b13d" font-size="12" text-anchor="middle" font-weight="700">Passage OUI → NON : certification de maturité (art. 42)</text>
  <text x="360" y="318" fill="#8b909b" font-size="11" text-anchor="middle">Termes définis conjointement par la SEC et la CFTC (sec. 105).</text>
</svg>
<figcaption>Un jeton naît sous la SEC comme actif accessoire ; il migre vers la CFTC quand sa blockchain est certifiée « mûre », c'est-à-dire sans contrôle commun. La ligne de partage précise reste à écrire par les deux régulateurs. Source : H.R. 3633 RS, sections 104, 105 et 205.</figcaption>
</figure>

## Les émetteurs : une rampe de lancement encadrée

Pour qui crée un jeton, le texte ouvre ce que des années de régulation par l'application avaient fermé : un chemin légal de financement. La section 202 ajoute au Securities Act une exemption d'émission permettant à un émetteur de lever, sur son actif accessoire, jusqu'à **50 millions de dollars de produit brut par année civile pendant une période n'excédant pas quatre ans**, montant ajusté chaque année sur l'indice des prix à la consommation, ou 10 % de la valeur totale des actifs accessoires en circulation. Une garde-fou pour les particuliers accompagne l'ouverture : à l'issue d'une transaction exemptée, un acheteur ne peut détenir plus de **10 %** des unités en circulation.

Les initiés, eux, sont bridés. La section 104 range parmi les « personnes affiliées » tout détenteur d'au moins **5 %** des unités, tout fondateur et tout dirigeant, et la section 204 encadre leurs cessions : sur toute période de douze mois, elles ne peuvent porter que sur une fourchette comprise entre **5 % et 20 %** des unités acquises. La section 411 y ajoute une obligation de notification pour les « control persons » d'un système certifié mûr avant toute vente. Le message adressé au secteur est double : le financement d'un token sur le sol américain redevient possible dans un cadre, mais la sortie des fondateurs est ralentie et surveillée.

## Bourses et intermédiaires : la licence fédérale, et son prix

Le cœur opérationnel du texte est l'enregistrement des intermédiaires. Le Titre IV crée auprès de la CFTC un régime complet pour les « digital commodity exchanges », « brokers » et « dealers », avec garde par des dépositaires qualifiés (section 405), certification des produits à la négociation et enregistrement des personnes associées. La section 106 prévoit un enregistrement accéléré et un statut provisoire, pour que les acteurs existants ne soient pas gelés le temps que le régime se déploie. Le Titre III organise en miroir le rôle résiduel de la SEC sur les actifs accessoires et les intermédiaires qui les touchent.

La contrepartie est réelle. La section 413 impose à la CFTC d'édicter, dans un délai de **360 jours**, des règles sur l'identification et la résolution des conflits d'intérêts « au sein et entre les entités enregistrées », en visant nommément les **structures verticalement intégrées**. C'est la leçon de la faillite FTX inscrite dans la loi : une plateforme qui cumule bourse, courtage, garde et tenue de marché devra cloisonner ces fonctions. Pour les bourses américaines conformes, le texte offre une licence fédérale attendue de longue date ; il leur impose en échange une architecture de conformité qu'elles devront financer et documenter. L'ensemble du Titre IV prend effet **270 jours** après la promulgation (section 414).

## DeFi et développeurs : l'exclusion large

C'est le volet le plus favorable à l'écosystème, et le plus discuté. La section 309 insère un nouvel article 15H dans le Securities Exchange Act, et la section 409 fait de même côté CFTC : une personne n'est **pas soumise** à ces lois du seul fait qu'elle compile, relaie, ordonne ou valide des transactions, exploite un nœud ou un oracle, fournit de la bande passante, propose une interface permettant de lire des données de la blockchain, ou développe et publie du logiciel. Les validateurs, les opérateurs de nœuds, les fournisseurs d'oracles, les interfaces et les développeurs sortent donc explicitement du champ. La section 109 protège dans le même esprit les développeurs non contrôlants.

La portée est immense pour la finance décentralisée, et c'est aussi là que se concentrent les critiques. L'exclusion s'articule au test de contrôle : un protocole réellement décentralisé échappe à la régulation, mais un acteur qui conserve une autorité unilatérale reste dans le filet. Or c'est justement la définition de cette « autorité unilatérale » et de la maturité que le texte renvoie au rulemaking conjoint. Tant qu'elle n'est pas écrite, la frontière entre le développeur protégé et l'opérateur régulé demeure une zone grise, et l'auto-certification de la décentralisation nourrit la crainte d'un contournement.

## Stablecoins et banques : l'arrimage au GENIUS

Sur les stablecoins, le CLARITY Act ne réinvente rien, il s'arrime. La section 104 définit le « permitted payment stablecoin » par renvoi au [GENIUS Act](/guides/qui-applique-le-genius-act/), et la section 301 précise qu'un tel jeton peut être courté, négocié et conservé par un broker, un dealer, un système alternatif ou une bourse, la SEC n'ayant compétence que sur la transaction, non sur le jeton comme titre. Le stablecoin de paiement est ainsi confirmé hors du champ des valeurs mobilières, prolongeant la logique que nous avons décrite dans notre analyse des [stablecoins comme acheteur marginal du bon du Trésor](/posts/stablecoins-acheteur-marginal-bon-du-tresor/) et du [déluge de bons](/posts/qui-achete-le-deluge-de-bons-tresor-acheteur-marginal/).

Deux dispositions complètent le tableau côté institutions. La section 310 autorise expressément la garde d'actifs numériques par les établissements bancaires, un feu vert que les régulateurs prudentiels avaient longtemps refusé. Et la section 110 étend l'application du Bank Secrecy Act, la loi anti-blanchiment, aux intermédiaires en actifs numériques : la clarté réglementaire s'accompagne d'obligations de conformité identiques à celles de la finance traditionnelle. La crypto américaine gagne une place dans le système bancaire, au prix d'entrer dans ses règles.

## Le volet caché : l'interdiction d'une CBDC

Le texte porte un second titre, souvent oublié des commentaires : l'« Anti-CBDC Surveillance State Act ». Son Titre VI interdit à la Réserve fédérale d'émettre une monnaie numérique de banque centrale, directement (section 602) comme indirectement via un intermédiaire financier (section 603). C'est une décision de politique monétaire majeure logée dans une loi de structure de marché : les États-Unis renoncent, par la loi, à l'outil que la Chine et d'autres développent, et laissent de fait le champ du dollar numérique aux stablecoins privés régulés par le GENIUS Act. Le choix est cohérent avec l'ensemble, il n'en est pas moins lourd de conséquences pour l'architecture monétaire.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 330" role="img" aria-label="Impact sectoriel du CLARITY Act par catégorie d'acteur" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="330" fill="#0c0d10"/>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Qui gagne quoi, et à quel prix</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Lecture d'impact du texte par acteur. Source : H.R. 3633 RS.</text>

  <text x="40" y="96" fill="#5eead4" font-size="13" font-weight="700">Gagnants nets</text>
  <text x="56" y="118" fill="#d6d9df" font-size="12">DeFi, développeurs, validateurs : exclusion large (sec. 15H, 409)</text>
  <text x="56" y="138" fill="#d6d9df" font-size="12">Émetteurs : voie de financement légale, 50 M$/an (sec. 202)</text>
  <text x="56" y="158" fill="#d6d9df" font-size="12">Stablecoins : confirmés hors valeurs mobilières (sec. 301)</text>
  <text x="56" y="178" fill="#d6d9df" font-size="12">Banques : garde d'actifs numériques autorisée (sec. 310)</text>

  <text x="40" y="212" fill="#f5b13d" font-size="13" font-weight="700">Gagnants sous conditions</text>
  <text x="56" y="234" fill="#d6d9df" font-size="12">Bourses : licence fédérale, mais cloisonnement des conflits (sec. 413)</text>
  <text x="56" y="254" fill="#d6d9df" font-size="12">Émetteurs, initiés : cessions bridées à 5-20 %/an (sec. 204)</text>

  <text x="40" y="288" fill="#ff4d87" font-size="13" font-weight="700">Perdant relatif</text>
  <text x="56" y="310" fill="#d6d9df" font-size="12">SEC : cède le comptant à la CFTC ; la Fed renonce à une CBDC (titre VI)</text>
</svg>
<figcaption>Le texte redistribue le pouvoir : il élargit l'espace de la DeFi et des stablecoins, ouvre une rampe de financement aux émetteurs, et déplace le centre de gravité réglementaire de la SEC vers la CFTC. Les bourses gagnent une licence contre des obligations de cloisonnement. Source : H.R. 3633 RS.</figcaption>
</figure>

## Les angles morts

La rigueur impose de nommer les fragilités, car elles décideront de la portée réelle du texte. La première est l'auto-certification de la maturité : confier à l'émetteur l'initiative de déclarer sa blockchain décentralisée, même sous contrôle de l'agence, crée un aléa que les critiques jugent exploitable. La deuxième est le transfert de pouvoir vers la CFTC, régulateur plus petit et moins doté que la SEC, pour superviser un marché au comptant qu'il n'avait jamais eu à surveiller ; le texte prévoit des ressources dédiées, leur suffisance reste à démontrer. La troisième est le calendrier de définition : tant que la SEC et la CFTC n'ont pas écrit conjointement ce que sont « l'autorité unilatérale » et la maturité, la clarté annoncée reste, sur le papier, une promesse. La quatrième, enfin, est politique : la clause éthique visant les responsables publics ne figure pas dans cette version, et son ajout éventuel en séance reste le nœud que nous avons décrit par ailleurs.

## Trois scénarios datés

Ce qui suit relève du scénario, non de la donnée. Dans la trajectoire d'adoption rapide, le texte est voté avant la pause du 7 août, avec ou sans amendement éthique ajouté en séance, réconcilié avec la version de la Chambre, puis promulgué ; le Titre IV entre alors en vigueur environ 270 jours plus tard, et le premier rulemaking sur les conflits d'intérêts tombe à 360 jours. Dans la trajectoire de blocage, le texte glisse au-delà d'août et se heurte à la campagne des élections de mi-mandat, repoussant l'échéance praticable de plusieurs années. Dans la trajectoire d'adoption sans clarté, la loi passe mais s'enlise dans deux ans de rulemaking conjoint contesté, si bien que la « clarté » demeure théorique le temps que les définitions se stabilisent. Notre article sur [la fin de partie au Sénat](/posts/clarity-act-trump-cede-ethique-compte-a-rebours-aout/) suit ce calendrier au jour le jour.

## L'effet net

Au terme de la lecture, l'effet net se résume en quelques lignes. Le texte met fin à la régulation par l'application en donnant aux émetteurs une voie de financement bornée et aux bourses une licence fédérale, il taille une exclusion large pour la DeFi et les développeurs, il cimente les stablecoins comme rails du dollar numérique privé en les renvoyant au GENIUS Act, il fait entrer la garde crypto dans les banques et la conformité anti-blanchiment dans la crypto, et il interdit par la loi une monnaie numérique de banque centrale. Le centre de gravité réglementaire glisse de la SEC vers la CFTC, au moyen d'un test de décentralisation dont tout dépendra. La véritable inconnue n'est plus l'existence d'un cadre, mais sa mise en musique : la clarté promise se jouera dans deux ans de rulemaking, et dans la manière dont deux agences traceront, ensemble, la frontière du contrôle. Pour le cadre européen en regard, notre guide sur [MiCA](/guides/mica-sigle-par-sigle/) offre le point de comparaison.

---

**Source primaire :** le texte officiel du [CLARITY Act, H.R. 3633, version rapportée au Sénat (BILLS-119hr3633rs)](https://www.congress.gov/119/bills/hr3633/BILLS-119hr3633rs.pdf), 594 pages, et sa [version XML](https://www.congress.gov/119/bills/hr3633/BILLS-119hr3633rs.xml) ; [fiche et statut du texte sur Congress.gov](https://www.congress.gov/bill/119th-congress/house-bill/3633/all-actions). Toutes les affirmations de cette analyse renvoient à une section précise du texte : définitions et test de maturité (sec. 104, 205), rulemaking conjoint (sec. 105), exemption d'émission (sec. 202), cessions d'initiés (sec. 204, 411), enregistrement des intermédiaires et garde (sec. 106, 405), conflits d'intérêts (sec. 413), effet différé (sec. 414), exclusion DeFi (sec. 309 et 409, article 15H), stablecoins (sec. 301), garde bancaire (sec. 310), anti-blanchiment (sec. 110), interdiction d'une CBDC (titre VI, sec. 602 à 604).

**Pour situer :** nos analyses de [la fin de partie au Sénat et de ses scénarios](/posts/clarity-act-trump-cede-ethique-compte-a-rebours-aout/), de [Trump premier obstacle à sa propre loi](/posts/clarity-act-trump-obstacle-conflit-interets/) et du [CLARITY Act, mode d'emploi](/posts/clarity-act-regulation-crypto-etats-unis/) ; nos guides [qui applique le GENIUS Act](/guides/qui-applique-le-genius-act/) et [MiCA sigle par sigle](/guides/mica-sigle-par-sigle/) ; nos articles sur les [stablecoins acheteurs marginaux](/posts/stablecoins-acheteur-marginal-bon-du-tresor/) et le [déluge de bons](/posts/qui-achete-le-deluge-de-bons-tresor-acheteur-marginal/). Cette analyse porte sur la version rapportée au Sénat au 1er juin 2026 ; un texte amendé en séance pourrait en modifier certaines dispositions, à commencer par la clause éthique absente de cette version.
