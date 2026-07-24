---
title: "Lire le CPI : l'inflation américaine, mesure par mesure"
description: "Guide de référence sur le Consumer Price Index : ce que le BLS mesure vraiment, comment se compose le panier et pourquoi le logement y pèse un tiers, la différence entre headline, core et supercore, les pièges de lecture entre brut et corrigé, niveau et variation, et pourquoi la Fed cible le PCE plutôt que le CPI. Avec le chiffre de mai 2026 comme cas d'école, où l'énergie a tout emporté."
summary: "Le CPI (Consumer Price Index) est l'indice des prix à la consommation publié chaque mois par le BLS : il mesure la variation moyenne des prix d'un panier fixe de biens et services pour les ménages urbains américains. C'est l'indicateur d'inflation le plus suivi des marchés, mais la Fed cible le PCE, et le lire suppose de distinguer headline et core, brut et corrigé, niveau et variation."
pubDate: 2026-06-29T18:00:00+02:00
updatedDate: 2026-06-29T18:00:00+02:00
tags: ["macro", "inflation", "banques centrales"]
category: macro
draft: false
---

*Aucun chiffre macro ne déplace autant les marchés en quelques secondes que le CPI américain, et peu sont aussi mal lus. Un titre annonce « l'inflation à tant », les contrats à terme bougent, puis la vraie information se trouve trois niveaux plus bas, dans une composante que personne n'a regardée. Ce guide reprend ce que le Bureau of Labor Statistics mesure réellement, comment se construit l'indice, et comment passer du gros titre au signal. Le chiffre de mai 2026 sert de fil conducteur : il illustre presque tous les pièges à la fois.*

## La mesure du CPI, et ses exclusions

Le Consumer Price Index est un indice des prix publié chaque mois par le Bureau of Labor Statistics (BLS). Il mesure la variation moyenne dans le temps des prix d'un panier fixe de biens et services achetés par les ménages. Les prix sont relevés chaque mois dans **75** zones urbaines, auprès d'environ **6 000** logements pour la partie loyers et **22 000** points de vente pour le reste, par visite, téléphone, web ou application. La base de référence est 1982-1984 = 100 : un indice à 335 signifie que le panier coûte 3,35 fois son prix de cette période.

Trois versions coexistent, et les confondre fausse la lecture. Le CPI-U couvre l'ensemble des consommateurs urbains, soit plus de **90 %** de la population américaine ; c'est le chiffre que reprennent les marchés et la presse. Le CPI-W ne couvre que les ménages d'ouvriers et d'employés, environ **30 %** de la population, mais il sert de base légale à l'indexation des prestations de la Sécurité sociale, la fameuse COLA. Enfin le C-CPI-U, ou indice chaîné, intègre les substitutions des consommateurs d'une catégorie à l'autre quand les prix relatifs changent ; il est publié d'abord en estimation provisoire puis révisé trimestriellement, et sa référence est décembre 1999 = 100.

Un point de méthode pèse lourd. Le CPI repose sur une formule de Laspeyres modifiée, c'est-à-dire un panier dont les quantités sont tenues fixes jusqu'à la prochaine mise à jour des pondérations. Cette construction tend à surestimer légèrement le coût de la vie, parce qu'elle ne capte pas en temps réel le fait que les ménages se détournent des produits dont le prix monte le plus vite. C'est ce biais que l'indice chaîné corrige, et l'une des raisons pour lesquelles la Fed lui préfère un autre indice, on y revient plus bas.

## Le panier et ses pondérations

Le CPI agrège des centaines de composantes, mais quatre blocs résument l'essentiel. Les services hors énergie pèsent à eux seuls **60,3 %** du panier, les biens hors alimentation et énergie **19,0 %**, l'alimentation **13,6 %**, et l'énergie **7,1 %**. Ces deux derniers blocs, alimentation et énergie, sont les plus volatils, et ce sont aussi ceux que l'on retire pour calculer l'inflation sous-jacente.

À l'intérieur des services, une ligne domine tout : le logement. Le poste « shelter » représente **35,3 %** du panier total, dont **25,9 %** pour le seul loyer imputé aux propriétaires et **7,7 %** pour les loyers réels. Aucune autre composante n'approche ce poids. Mécaniquement, un dixième de point sur le logement déplace davantage l'indice qu'un point entier sur l'habillement, qui pèse **2,5 %**. C'est la raison pour laquelle la façon dont le BLS mesure le logement, détaillée plus loin, conditionne presque toute la lecture du CPI.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 360" role="img" aria-label="Composition du panier du CPI américain par grands blocs et poids du logement" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="360" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Ce qu'il y a dans le panier du CPI</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Importance relative des grands blocs, en pourcentage du panier total.</text>
  <rect x="40" y="84" width="386.2" height="44" fill="#5eead4" opacity="0.9"></rect>
  <rect x="426.2" y="84" width="121.6" height="44" fill="#f5b13d" opacity="0.9"></rect>
  <rect x="547.8" y="84" width="86.8" height="44" fill="#ff4d87" opacity="0.85"></rect>
  <rect x="634.6" y="84" width="45.4" height="44" fill="#8b909b" opacity="0.85"></rect>
  <text x="44" y="111" fill="#0c0d10" font-size="12" font-weight="700">Services 60,3 %</text>
  <text x="430" y="111" fill="#0c0d10" font-size="11" font-weight="700">Biens 19,0</text>
  <rect x="40" y="150" width="14" height="14" fill="#5eead4"></rect>
  <text x="62" y="162" fill="#d6d9df" font-size="12">Services hors énergie : 60,3 %</text>
  <rect x="40" y="172" width="14" height="14" fill="#f5b13d"></rect>
  <text x="62" y="184" fill="#d6d9df" font-size="12">Biens hors alimentation et énergie : 19,0 %</text>
  <rect x="40" y="194" width="14" height="14" fill="#ff4d87"></rect>
  <text x="62" y="206" fill="#d6d9df" font-size="12">Alimentation : 13,6 %</text>
  <rect x="40" y="216" width="14" height="14" fill="#8b909b"></rect>
  <text x="62" y="228" fill="#d6d9df" font-size="12">Énergie : 7,1 %</text>
  <line x1="40" y1="256" x2="680" y2="256" stroke="#2a2c33" stroke-width="1"></line>
  <text x="40" y="284" fill="#5eead4" font-size="13" font-weight="700">Le logement, à lui seul : 35,3 % du panier</text>
  <rect x="40" y="298" width="466" height="20" fill="#5eead4" opacity="0.35"></rect>
  <rect x="40" y="298" width="342" height="20" fill="#5eead4" opacity="0.9"></rect>
  <text x="44" y="313" fill="#0c0d10" font-size="11" font-weight="700">OER 25,9 %</text>
  <text x="388" y="313" fill="#d6d9df" font-size="11">loyers réels 7,7 %</text>
  <text x="40" y="340" fill="#8b909b" font-size="11">Source : BLS, Table 1 du communiqué CPI (importance relative, mars 2026).</text>
</svg>
<figcaption>Le panier du CPI est dominé par les services, et au sein des services par le logement, qui pèse <strong>35,3 %</strong> de l'indice total, dont <strong>25,9 %</strong> pour le loyer imputé aux propriétaires (OER). L'alimentation et l'énergie, les deux postes les plus volatils, ne représentent ensemble que <strong>20,7 %</strong>. Source : Bureau of Labor Statistics, Table 1 du communiqué CPI.</figcaption>
</figure>

Une précision sur l'énergie, qui n'est pas une catégorie de dépense en soi mais un agrégat transversal. Le BLS la reconstitue à partir des carburants, logés dans les transports, et de l'électricité et du gaz, logés dans le logement. Son poids varie aussi plus vite que les autres : la pondération de base fixée en décembre 2025 était de **6,3 %**, mais l'importance relative remonte à **7,1 %** au printemps 2026, simplement parce que les prix de l'énergie ont grimpé et que la part de l'énergie dans la dépense suit.

## Headline, core et supercore

Trois agrégats structurent toute discussion sur l'inflation américaine. Le headline, ou indice tous postes, est le chiffre du gros titre : il inclut tout, y compris l'alimentation et l'énergie. Le core, ou inflation sous-jacente, retire ces deux postes volatils pour isoler la tendance de fond. La logique n'est pas de prétendre que les ménages ne mangent pas ou ne se chauffent pas, mais d'éliminer un bruit qui peut masquer la dynamique durable des prix. C'est le core que regardent les économistes et la Fed pour juger de la persistance de l'inflation.

Au-delà du core, les banquiers centraux suivent un agrégat plus fin, le supercore : les services hors énergie et hors logement. L'idée est de capter la part de l'inflation la plus liée aux salaires et la plus collante, une fois écartés les effets de l'énergie et le comportement particulier du logement. Le BLS publie la brique qui s'en rapproche le plus sous le nom de « services hors loyers du logement ». Cet indicateur a tenu le devant de la scène pendant le resserrement de 2022 et 2023, quand la question n'était plus de savoir si l'inflation des biens refluait, mais si celle des services tenait bon.

En mai 2026, l'écart entre ces mesures est parlant. Le headline ressort à **4,2 %** sur un an, son plus haut depuis avril 2023, quand le core s'établit à **2,9 %**. Lire le seul gros titre ce mois-là, c'est conclure à une réaccélération généralisée ; lire le core, c'est voir une inflation sous-jacente qui reste proche de 3 %, élevée mais sans embardée. Les deux lectures sont vraies, elles ne disent simplement pas la même chose.

## Le logement, ou pourquoi le CPI regarde dans le rétroviseur

Le BLS ne mesure pas le prix d'achat des maisons. Dans le cadre du coût de la vie qui guide l'indice, un logement possédé est un bien d'investissement, distinct du service d'hébergement qu'il rend. Ce qui entre dans le CPI, c'est ce service, et son prix pour un propriétaire est le loyer qu'il devrait payer pour habiter le même bien. C'est l'OER, l'owners' equivalent rent, en place depuis 1987. Le prix d'achat, les intérêts d'emprunt, la taxe foncière et les frais d'agence en sont exclus, parce qu'ils relèvent du capital et non de la consommation.

Cette construction explique le décalage le plus connu du CPI. Les loyers de marché, ceux des nouveaux baux, réagissent vite aux conditions du logement. Le CPI, lui, mesure une moyenne de loyers en cours, dont la plupart ne se renégocient qu'au renouvellement du bail, et chaque logement de l'échantillon n'est réinterrogé qu'environ tous les six mois. Quand les loyers de marché accélèrent ou ralentissent, le logement dans le CPI met de longs mois à suivre. Pour anticiper ce retournement, on suit des indicateurs avancés comme le New Tenant Rent Index, construit par le BLS et la Fed de Cleveland à partir des seuls nouveaux entrants.

Un épisode récent montre à quel point la mécanique de mesure peut peser sur le chiffre. Lors de la fermeture des administrations fédérales d'octobre 2025, le BLS n'a pas pu relever la tranche de loyers prévue ce mois-là ; faute d'observations nouvelles, les valeurs précédentes ont été reconduites, minorant temporairement l'inflation du logement. L'effet s'est inversé en avril 2026, quand les logements concernés ont enfin été réenquêtés : les hausses accumulées sont entrées d'un coup, gonflant la variation mensuelle du logement. En mai 2026, une fois ce rattrapage purgé, le logement revient à **0,3 %** sur le mois et **3,4 %** sur un an, un rythme cohérent avec la décrue engagée depuis le pic de 2023. La leçon est simple : avant de réagir à un mois de logement, il faut savoir ce que l'échantillon a fait ce mois-là.

## Les pièges de lecture

Le premier piège oppose la variation mensuelle et la variation sur un an. Un mois à **0,5 %** annualisé donne environ 6 %, d'apparence alarmante, mais un seul mois ne fait pas une tendance et la marge d'erreur est réelle. La variation sur douze mois lisse le bruit, au prix d'un retard : elle traîne encore les chocs de l'année écoulée, ce sont les effets de base. Un mois fort qui sort de la fenêtre des douze mois peut faire baisser le glissement annuel alors même que les prix continuent de monter, et inversement.

Le deuxième piège oppose le brut et le corrigé des variations saisonnières. Les marchés réagissent au chiffre mensuel corrigé, qui retire les motifs saisonniers récurrents, tandis que le glissement sur un an est publié en données brutes. Le BLS recalcule les facteurs saisonniers chaque année avec la donnée de janvier, par la méthode X-13ARIMA-SEATS, et révise les cinq dernières années. Une même série peut donc changer après coup, sans que rien de réel n'ait bougé.

Le troisième piège est celui de la précision. Le CPI est une estimation tirée d'un échantillon, pas un recensement de tous les prix. L'erreur type d'une variation mensuelle de l'indice tous postes est d'environ **0,03** point : pour un chiffre publié à 0,2 % sur le mois, l'intervalle de confiance à 95 % va à peu près de 0,14 % à 0,26 %. Un écart de 0,1 point par rapport au consensus, qui fait pourtant bouger les marchés, est statistiquement ténu. À cela s'ajoute la révision annuelle des pondérations, calées sur l'enquête de dépenses des consommateurs avec environ deux ans de retard : les poids de 2026 reposent sur les dépenses de 2024.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 340" role="img" aria-label="Décomposition de l'inflation américaine de mai 2026 par grandes composantes, sur un an" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="340" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Mai 2026 : l'énergie emporte le gros titre</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Variation sur un an, en pourcentage. Le headline grimpe, le core reste près de 3 %.</text>
  <text x="40" y="94" fill="#d6d9df" font-size="12">Énergie</text>
  <rect x="200" y="82" width="431" height="18" fill="#ff4d87" opacity="0.9"></rect>
  <text x="639" y="96" fill="#ff4d87" font-size="12" font-weight="700">+23,5 %</text>
  <text x="40" y="126" fill="#f5f6f8" font-size="12" font-weight="700">Headline (tous postes)</text>
  <rect x="200" y="114" width="77" height="18" fill="#5eead4" opacity="0.95"></rect>
  <text x="285" y="128" fill="#5eead4" font-size="12" font-weight="700">+4,2 %</text>
  <text x="40" y="158" fill="#d6d9df" font-size="12">Logement</text>
  <rect x="200" y="146" width="62" height="18" fill="#8b909b" opacity="0.85"></rect>
  <text x="270" y="160" fill="#d6d9df" font-size="12">+3,4 %</text>
  <text x="40" y="190" fill="#d6d9df" font-size="12">Alimentation</text>
  <rect x="200" y="178" width="57" height="18" fill="#8b909b" opacity="0.85"></rect>
  <text x="265" y="192" fill="#d6d9df" font-size="12">+3,1 %</text>
  <text x="40" y="222" fill="#f5b13d" font-size="12" font-weight="700">Core (hors alim. et énergie)</text>
  <rect x="200" y="210" width="53" height="18" fill="#f5b13d" opacity="0.95"></rect>
  <text x="261" y="224" fill="#f5b13d" font-size="12" font-weight="700">+2,9 %</text>
  <text x="40" y="254" fill="#d6d9df" font-size="12">Soins médicaux</text>
  <rect x="200" y="242" width="48" height="18" fill="#8b909b" opacity="0.85"></rect>
  <text x="256" y="256" fill="#d6d9df" font-size="12">+2,6 %</text>
  <line x1="40" y1="280" x2="680" y2="280" stroke="#2a2c33" stroke-width="1"></line>
  <text x="40" y="304" fill="#d6d9df" font-size="12">L'énergie a expliqué plus de 60 % de la hausse mensuelle (+0,5 %).</text>
  <text x="40" y="324" fill="#8b909b" font-size="11">Essence : +40,5 % sur un an. Source : BLS, communiqué CPI du 10 juin 2026.</text>
</svg>
<figcaption>En mai 2026, le headline atteint <strong>4,2 %</strong> sur un an, tiré par une énergie en hausse de <strong>23,5 %</strong> (essence : <strong>+40,5 %</strong>), pendant que le core reste à <strong>2,9 %</strong>. À elle seule, l'énergie a expliqué plus de <strong>60 %</strong> de la hausse mensuelle de l'indice tous postes. Source : Bureau of Labor Statistics, communiqué du 10 juin 2026.</figcaption>
</figure>

## CPI contre PCE : pourquoi la Fed regarde un autre indice

Voici le malentendu le plus coûteux pour qui suit la politique monétaire. La cible d'inflation de **2 %** de la Réserve fédérale ne porte pas sur le CPI, mais sur le PCE, l'indice des prix des dépenses de consommation des ménages calculé par le Bureau of Economic Analysis. La Fed a marqué sa préférence pour le PCE dès 2000 et a inscrit la cible de 2 % en PCE dans son cadre formel en 2012, réaffirmé chaque année depuis.

Trois différences expliquent l'écart. La formule, d'abord : le PCE est un indice chaîné de type Fisher, qui intègre les substitutions des consommateurs, là où le CPI fige son panier. La pondération, ensuite : le logement pèse environ deux fois plus dans le CPI que dans le PCE, qui accorde en revanche un poids bien supérieur à la santé, notamment parce qu'il compte les dépenses faites pour le compte des ménages, comme l'assurance maladie payée par l'employeur ou les programmes Medicare et Medicaid. Le champ, enfin : le CPI ne couvre que les dépenses directes des ménages urbains, le PCE couvre un univers plus large, urbain et rural. Résultat, depuis 2000, le CPI tourne en moyenne **0,39** point au-dessus du PCE. Si la Fed atteignait sa cible de 2 % en PCE, le CPI s'établirait plutôt autour de 2,4 %.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 320" role="img" aria-label="Comparaison entre le CPI et le PCE et écart historique entre les deux mesures d'inflation" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="320" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Deux thermomètres, un seul vise la cible</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">La Fed cible 2 % sur le PCE. Le CPI court structurellement au-dessus.</text>
  <text x="40" y="92" fill="#d6d9df" font-size="12" font-weight="700">Été 2022, pic d'inflation, en glissement annuel</text>
  <text x="40" y="120" fill="#ff4d87" font-size="12">CPI</text>
  <rect x="150" y="108" width="450" height="20" fill="#ff4d87" opacity="0.9"></rect>
  <text x="608" y="124" fill="#ff4d87" font-size="12" font-weight="700">≈ 9,0 %</text>
  <text x="40" y="152" fill="#5eead4" font-size="12">PCE</text>
  <rect x="150" y="140" width="355" height="20" fill="#5eead4" opacity="0.9"></rect>
  <text x="513" y="156" fill="#5eead4" font-size="12" font-weight="700">≈ 7,1 %</text>
  <text x="40" y="184" fill="#8b909b" font-size="11">Le plus grand écart jamais mesuré entre les deux indices.</text>
  <line x1="40" y1="206" x2="680" y2="206" stroke="#2a2c33" stroke-width="1"></line>
  <text x="40" y="232" fill="#f5f6f8" font-size="12" font-weight="700">Principales différences</text>
  <text x="40" y="254" fill="#d6d9df" font-size="11.5">Formule : panier fixe (Laspeyres) pour le CPI, indice chaîné (Fisher) pour le PCE.</text>
  <text x="40" y="274" fill="#d6d9df" font-size="11.5">Logement : poids environ deux fois plus élevé dans le CPI ; santé : plus lourde dans le PCE.</text>
  <text x="40" y="294" fill="#8b909b" font-size="11" textLength="674" lengthAdjust="spacingAndGlyphs">Écart moyen depuis 2000 : le CPI dépasse le PCE d'environ 0,39 point. Sources : Fed de Cleveland, Fed d'Atlanta.</text>
</svg>
<figcaption>CPI et PCE évoluent ensemble, mais le CPI court au-dessus, d'environ <strong>0,39</strong> point en moyenne depuis 2000, et l'écart a atteint un record à l'été 2022 (CPI à environ <strong>9 %</strong>, PCE à environ <strong>7,1 %</strong>). La Fed cible 2 % sur le PCE, pas sur le CPI. Sources : Fed de Cleveland, Fed d'Atlanta.</figcaption>
</figure>

Conséquence pratique : un CPI à 3 % n'est pas un échec de la Fed, et un CPI à 2 % serait déjà en deçà de la cible une fois traduit en PCE. Le CPI reste le chiffre que les marchés tradent, parce qu'il est plus visible et qu'il sort environ deux semaines avant le PCE, mais c'est le PCE qui oriente la décision. Confondre les deux, c'est se tromper de fonction de réaction.

## Lire le CPI en pratique

Tout est public et gratuit. Le communiqué paraît vers le milieu du mois suivant, à 8 h 30 heure de l'Est, sur le site du BLS ; le chiffre de juin 2026 est attendu le 14 juillet 2026. La séquence de lecture efficace tient en quelques réflexes. Commencer par le mensuel corrigé des variations saisonnières, headline et core, pour la dynamique récente. Vérifier d'où vient le mouvement en lisant la Table 1, ligne par ligne, plutôt que le seul résumé. Regarder le logement à part, car son poids et son décalage déforment souvent la lecture. Et resituer le tout dans le glissement annuel, en gardant en tête les effets de base à venir. Les dates doivent être vérifiées directement auprès du BLS, répertorié dans nos [sites de référence](/sites-reference/), et le [glossaire](/glossaire/) reprend les sigles employés ici.

Mai 2026 condense la démonstration. Le headline bondit, mais la lecture composante par composante montre une cause unique : l'énergie, dont la flambée tient au conflit au Moyen-Orient et aux tensions sur le détroit d'Ormuz. C'est le type d'enchaînement décrit dans notre analyse de la [facture énergétique du choc d'Ormuz](/posts/crise-ormuz-asie-impacts-economiques/) et dans le décryptage du [mémorandum entre Washington et Téhéran](/posts/mou-usa-iran-juin-2026/) : un choc d'offre sur le pétrole se propage aux prix à la consommation via les carburants, gonfle le headline, et laisse le core relativement épargné. Le réflexe juste n'est pas de conclure à un retour de l'inflation généralisée, mais de séparer le choc d'offre énergétique de la tendance sous-jacente.

Reste le lien avec le reste de la plomberie macro. L'inflation ne se lit jamais seule : elle se recoupe avec la masse monétaire, dont la croissance avait précédé la vague de 2021, sujet traité dans le guide sur la [masse monétaire M2](/guides/m2-masse-monetaire-risk-on/), et avec la trajectoire des taux que la Fed cale sur sa cible de PCE, lisible à travers le [bilan de la Fed](/guides/lire-h41-bilan-fed/) et la [liquidité du système](/guides/liquidite-tresor-dts-tga-rrp/).

Bien lu, le CPI cesse d'être un verdict mensuel pour devenir ce qu'il est : une estimation soignée mais imparfaite d'une réalité que personne n'observe directement. Le gros titre donne l'humeur du marché, la Table 1 donne la cause, le PCE donne la décision. Qui tient ces trois niveaux ensemble ne se fait plus surprendre par un chiffre qui « monte » alors que l'inflation de fond, elle, n'a pas bougé.

---

**Sources principales :**

- [BLS, communiqué « Consumer Price Index, May 2026 »](https://www.bls.gov/news.release/cpi.nr0.htm), 10 juin 2026 : headline +0,5 % sur le mois et +4,2 % sur un an, core +2,9 %, énergie +23,5 %, essence +40,5 %, logement +0,3 % et +3,4 %, part de l'énergie dans la hausse mensuelle.
- [BLS, Table 1 du communiqué CPI, par catégorie de dépense](https://www.bls.gov/news.release/cpi.t01.htm) : importance relative des postes (logement 35,3 %, OER 25,9 %, énergie 7,1 %, alimentation 13,6 %, core 79,4 %).
- [BLS, « Relative Importance and Weight Information for the CPI »](https://www.bls.gov/cpi/tables/relative-importance/) : pondérations, mise à jour annuelle avec la donnée de janvier, biais de la formule de Laspeyres.
- [BLS, « Measuring Price Change in the CPI: Rent and Rental Equivalence »](https://www.bls.gov/cpi/factsheets/owners-equivalent-rent-and-rent.htm) : définition de l'OER, traitement du logement possédé comme bien d'investissement, exclusions.
- [BLS, calendrier des publications du CPI](https://www.bls.gov/schedule/news_release/cpi.htm) : dates et heure de diffusion, prochaine sortie le 14 juillet 2026.
- [Fed de Cleveland, infographie « The CPI Versus the PCE Price Index »](https://www.clevelandfed.org/collections/infographics/2024/infogr-20241205-cpi-versus-pce-price-index) : écart moyen d'environ 0,39 point en faveur du CPI depuis 2000, différences de formule, de champ et de pondération.
- [Fed d'Atlanta, « What Is PCE? Explaining the Fed's Preferred Inflation Measure »](https://www.atlantafed.org/what-we-study/inflation/2026/05/20/what-is-pce-explaining-the-feds-preferred-inflation-measure), 20 mai 2026 : adoption du PCE comme cible en 2000 et 2012, réaffirmation annuelle de la cible de 2 %.
- [Property and Environment Research Center (Texas A&M), « One-Third of CPI: How Shelter Shapes Inflation Trends »](https://perc.tamu.edu/blog/2026/06/shelter-cpi.html), 12 juin 2026 : poids du logement, décrue depuis le pic de 2023, épisode de mesure lié à la fermeture des administrations d'octobre 2025 et rattrapage d'avril 2026.
