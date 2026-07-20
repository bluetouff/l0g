---
title: "Lire la masse monétaire M2 : signal de liquidité, lectures erronées et lien avec le risk-on"
description: "Un guide complet sur la M2 américaine : sa définition exacte selon la Fed, ce qu'elle mesure et ce qu'elle ne mesure pas, son explosion de 2020 puis sa contraction de 2023, et surtout l'examen rigoureux de son lien avec les actifs risqués et la crypto. La corrélation existe, mais elle est fragile, conditionnelle à la vélocité et au régime macro, et les modèles à décalage fixe relèvent souvent du surajustement."
summary: "La M2 est l'agrégat monétaire large de la Fed : la monnaie et les dépôts liquides détenus par le public non bancaire. Très citée comme baromètre de liquidité pour les actifs risqués, elle est un signal directionnel utile mais instable, à manier avec la vélocité et le contexte plutôt que comme une horloge à décalage fixe."
pubDate: 2026-06-29T15:30:00+02:00
updatedDate: 2026-06-29T15:30:00+02:00
tags: ["macro", "banques centrales", "crypto", "liquidité"]
category: macro
draft: false
---

*La masse monétaire M2 est l'un des chiffres les plus cités par les investisseurs risk-on, et l'un des plus mal lus. On en a fait une horloge de la liquidité mondiale, censée annoncer chaque mouvement du Bitcoin avec quelques semaines d'avance. La réalité est plus nuancée. Ce guide reprend la définition exacte de la Fed, décrit ce qu'elle mesure vraiment, puis teste son lien avec les actifs risqués sur les données et la recherche disponibles. Le signal existe, mais il se manie avec des pincettes.*

## La définition exacte de la M2

La M2 est un agrégat monétaire publié chaque mois par la Réserve fédérale dans son communiqué H.6. Elle s'emboîte avec la M1, plus étroite. La M1 regroupe les formes les plus liquides de monnaie : la monnaie fiduciaire en circulation, les dépôts à vue, et depuis mai 2020 les autres dépôts liquides, dont les comptes d'épargne et les comptes de dépôt du marché monétaire. La M2 ajoute à la M1 deux composantes moins liquides : les dépôts à terme de petit montant, inférieurs à **100 000** dollars, et les parts de fonds monétaires de détail.

Trois précisions changent la lecture. D'abord, la M2 ne compte que la monnaie détenue par le public non bancaire américain : les dépôts de l'État fédéral et les dépôts interbancaires en sont exclus. Ensuite, en mai 2020, un changement réglementaire a fait basculer les comptes d'épargne de la partie non-M1 vers la M1, ce qui rend les comparaisons de composition d'avant et d'après cette date délicates. Enfin, à compter du communiqué du 28 juillet 2026, la Fed modifie le traitement des comptes de retraite IRA et Keogh, désormais retranchés directement de l'agrégat : la M2 brute non corrigée des variations saisonnières reste inchangée, mais la série corrigée connaît de légères révisions.

La M2 est une grandeur de stock, pas un flux d'argent qui entrerait dans les marchés. C'est le malentendu fondamental : une M2 qui monte ne signifie pas que de l'argent achète des actions ou des cryptos, mais que le volume de monnaie et de quasi-monnaie détenu par les agents augmente. Ce que ces agents en font reste une autre question.

<figure class="infographic">
<svg viewBox="0 0 720 320" role="img" aria-label="Croissance de la M2 américaine sur un an, de 2021 à 2026" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="320" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">La M2 : un emballement, puis un trou d'air</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Croissance de la M2 sur un an, en pourcentage. Source : Fed (H.6), FRED.</text>
  <line x1="60" y1="210" x2="690" y2="210" stroke="#2a2c33" stroke-width="1"></line>
  <text x="30" y="214" fill="#8b909b" font-size="11">0</text>
  <text x="40" y="120" fill="#5eead4" font-size="12">févr. 2021</text>
  <rect x="150" y="96" width="120" height="22" fill="#5eead4" opacity="0.85"></rect>
  <text x="280" y="112" fill="#d6d9df" font-size="12">+26,8 % (record historique)</text>
  <text x="40" y="170" fill="#8b909b" font-size="12">mai 2026</text>
  <rect x="150" y="156" width="34" height="22" fill="#8b909b" opacity="0.8"></rect>
  <text x="194" y="172" fill="#d6d9df" font-size="12">+5,6 %</text>
  <text x="40" y="250" fill="#ff4d87" font-size="12">avr. 2023</text>
  <rect x="116" y="222" width="34" height="22" fill="#ff4d87" opacity="0.7"></rect>
  <text x="40" y="276" fill="#d6d9df" font-size="12">−4,6 % : plus bas de la série, première contraction franche</text>
  <text x="40" y="296" fill="#8b909b" font-size="12">depuis le début des données en 1960.</text>
</svg>
<figcaption>La M2 américaine est passée d'une expansion record de <strong>26,8 %</strong> sur un an en février 2021 à une contraction inédite de <strong>4,6 %</strong> en avril 2023, avant de réaccélérer vers <strong>5,6 %</strong> au printemps 2026. Source : Réserve fédérale (communiqué H.6), FRED.</figcaption>
</figure>

## Pourquoi la M2 a explosé puis reculé

L'épisode 2020 à 2023 est le meilleur cas d'école. Sous l'effet conjugué des achats d'actifs de la Fed et des transferts budgétaires massifs, la M2 a bondi de près de **27 %** sur un an début 2021, un rythme sans précédent dans la série. Des économistes d'inspiration monétariste y ont vu l'annonce du choc d'inflation à venir, à un moment où la banque centrale en minimisait le risque. L'inflation a suivi. Puis, avec le resserrement et la réduction du bilan, la M2 s'est contractée, jusqu'à un recul de **4,6 %** sur un an en avril 2023, du jamais vu dans la série depuis son origine.

Cet épisode nourrit les deux camps. Pour les partisans de la M2, il prouve qu'un emballement monétaire finit par se voir dans les prix. Pour les sceptiques, c'était une séquence exceptionnelle, dopée par un soutien budgétaire ponctuel, qui ne dit rien de la valeur prédictive de la M2 en temps normal. Les deux ont raison sur un point : la M2 a porté un signal fort quand sa variation a été extrême, et un signal faible le reste du temps. À la mi-2026, l'agrégat dépasse **22 800** milliards de dollars et croît d'environ **5,6 %** sur un an, un rythme proche de sa moyenne longue.

## Le lien avec le risk-on et la liquidité

Le raccourci habituel veut que plus de monnaie pousse les actifs risqués à la hausse. Le mécanisme n'est pas absurde : quand la liquidité abonde, une partie cherche du rendement et se déplace vers les actions, les obligations à spread, les matières premières et les actifs rares. Mais ce mécanisme passe par la vélocité de la monnaie, c'est-à-dire la vitesse à laquelle un dollar change de mains. La théorie quantitative relie la masse monétaire au revenu nominal par l'identité selon laquelle monnaie multipliée par vélocité égale prix multipliés par production. Si la vélocité chute, une hausse de la M2 peut très bien ne nourrir ni l'inflation ni les marchés. Or la vélocité de la M2 a structurellement baissé depuis les années 1990 et reste instable. C'est la première raison de se méfier des lectures mécaniques.

La deuxième raison tient à l'histoire institutionnelle. Milton Friedman avait fait des agrégats la boussole de la politique monétaire, mais la Fed a abandonné les objectifs de croissance de la monnaie dans les années 1990 et a cessé de publier la M3 en 2006, faute d'information additionnelle utile. La M2 a survécu comme indicateur descriptif, pas comme instrument. La composition compte aussi : en 2023, les balances de fonds monétaires de détail ont gonflé non par appétit pour le risque, mais parce que les ménages fuyaient les dépôts peu rémunérés vers des placements monétaires plus sûrs. Une même hausse d'un agrégat peut donc traduire du risk-on comme du risk-off.

## Bitcoin, baromètre de liquidité ?

C'est sur la crypto que la M2 connaît sa plus grande fortune narrative. L'argument le plus sérieux vient de Lyn Alden et Sam Callahan : sur la période de mai 2013 à juillet 2024, le Bitcoin a évolué dans le même sens que la liquidité mondiale **83 %** du temps sur des fenêtres de douze mois et **74 %** sur six mois, la plus forte cohérence directionnelle de tous les actifs étudiés. La logique avancée est que le Bitcoin, sans bénéfices ni dividendes, est un pari quasi pur sur les conditions monétaires, encore traité comme un actif risqué. Le travail reconnaît lui-même ses limites : la corrélation cède lors d'événements idiosyncratiques ou en période de valorisation extrême.

Le problème commence avec les versions popularisées. Sur les réseaux, on présente la M2 mondiale comme un indicateur avançant le Bitcoin d'un décalage fixe, mais ce décalage varie selon les auteurs, dix semaines pour les uns, douze ou quinze pour les autres. Quand le décalage optimal change à chaque cycle, c'est le symptôme d'un ajustement a posteriori plutôt que d'une loi. La M2 mondiale elle-même est une construction fragile : c'est la somme des agrégats d'une vingtaine de banques centrales convertie en dollars, si bien qu'une partie de ses variations reflète surtout les mouvements de change, pas un flux de liquidité réel.

<figure class="infographic">
<svg viewBox="0 0 720 300" role="img" aria-label="Le lien entre M2 mondiale et Bitcoin : fort mais instable" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="300" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Un lien fort, mais qui se rompt</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Sources : Lyn Alden et Sam Callahan (2024) ; CF Benchmarks (2026).</text>
  <text x="40" y="100" fill="#5eead4" font-size="12">Même direction sur 12 mois</text>
  <rect x="320" y="86" width="290" height="20" fill="#5eead4" opacity="0.85"></rect>
  <text x="620" y="101" fill="#d6d9df" font-size="12">83 %</text>
  <text x="40" y="134" fill="#5eead4" font-size="12">Même direction sur 6 mois</text>
  <rect x="320" y="120" width="258" height="20" fill="#5eead4" opacity="0.6"></rect>
  <text x="588" y="135" fill="#d6d9df" font-size="12">74 %</text>
  <text x="40" y="168" fill="#8b909b" font-size="12">Corrélation 2013 à 2024</text>
  <rect x="320" y="154" width="328" height="20" fill="#8b909b" opacity="0.75"></rect>
  <text x="320" y="210" fill="#ff4d87" font-size="12" font-weight="700">Mais sur douze mois jusqu'à début 2026 :</text>
  <text x="40" y="236" fill="#d6d9df" font-size="12">M2 mondiale : environ +12 %</text>
  <text x="40" y="258" fill="#d6d9df" font-size="12">Bitcoin : environ −12 %</text>
  <text x="40" y="284" fill="#8b909b" font-size="12">Le décrochage de 2025 et 2026 rappelle que la corrélation n'est pas une loi.</text>
</svg>
<figcaption>Le Bitcoin suit la direction de la liquidité mondiale dans une large majorité des cas sur un an, mais la relation s'est nettement rompue en 2025 et 2026, quand la M2 mondiale progressait pendant que le Bitcoin reculait. Sources : Lyn Alden et Sam Callahan ; CF Benchmarks.</figcaption>
</figure>

La séquence récente l'a rejoué à l'identique. Après avoir épousé la liquidité mondiale pendant des années, le Bitcoin s'en est détaché à partir de l'été 2025 : sur les douze mois précédant début 2026, la M2 mondiale a progressé d'environ **12 %** quand le Bitcoin reculait d'autant, selon CF Benchmarks. Pendant la contraction de 2022, à l'inverse, le lien était très serré, la liquidité expliquant alors l'essentiel de la chute. La leçon est claire : la corrélation est forte quand la liquidité domine le récit, et elle s'efface quand des facteurs propres au marché prennent le dessus, flux des ETF, effet de levier, chocs réglementaires ou géopolitiques.

## Les pièges de lecture

Plusieurs erreurs reviennent. Confondre stock et flux, d'abord : une M2 élevée n'est pas un réservoir prêt à se déverser sur les marchés. Confondre niveau et variation ensuite, car la M2 et le prix des actifs montent tendanciellement tous les deux, ce qui fabrique une corrélation de niveaux trompeuse entre deux séries non stationnaires ; le signal utile est dans les variations, pas dans la superposition brute des courbes. Oublier le change quand on raisonne sur la M2 mondiale, alors qu'un dollar faible suffit à gonfler l'agrégat exprimé en dollars. Et prendre un décalage calibré sur le passé pour une horloge fiable du futur.

La bonne nouvelle, c'est que toutes les données primaires sont publiques et gratuites. La Fed publie le H.6, la base FRED de la Fed de Saint-Louis donne la M2 corrigée des variations saisonnières, sa version hebdomadaire, sa version réelle et sa vélocité. Pour relier la M2 aux autres robinets de liquidité, notre guide sur le [bilan de la Fed via le H.4.1](/guides/lire-h41-bilan-fed/) et celui sur la [liquidité du Trésor, le compte général et les prises en pension](/guides/liquidite-tresor-dts-tga-rrp/) montrent que la M2 n'est qu'une pièce d'un ensemble plus vaste, où comptent aussi les réserves bancaires et la plomberie du [marché repo](/posts/repo-collateral-fabrique-liquidite/).

## Comment s'en servir sans se tromper

La M2 reste un indicateur utile, à condition de la traiter pour ce qu'elle est : une mesure de stock monétaire dont les variations comptent plus que le niveau, et dont le pouvoir de signal est conditionnel. Trois réflexes valent mieux que la superposition de deux courbes. Regarder la variation sur un an plutôt que le niveau brut, pour distinguer une vraie accélération d'une simple croissance tendancielle. Recouper avec la vélocité et avec la composition, pour savoir si la hausse traduit de l'appétit pour le risque ou un repli vers la sécurité. Et croiser avec les autres mesures de liquidité, réserves, compte du Trésor, conditions financières, plutôt que de tout résumer à un agrégat.

Le lien entre M2 et risk-on est donc réel mais conditionnel. Il s'affirme quand la liquidité est le moteur dominant, comme en 2020 et 2022, et il se dissout quand d'autres forces prennent la main, comme en 2025 et 2026. C'est un bon thermomètre du climat monétaire, pas une boule de cristal. Le lire ainsi protège des deux excès symétriques : ignorer la M2, et lui faire dire ce qu'elle ne dit pas.

---

**Sources principales :**

- [Réserve fédérale, communiqué H.6 « Money Stock Measures », page de présentation](https://www.federalreserve.gov/releases/h6/about.htm) : définition de la M1 et de la M2, périmètre, fréquence.
- [Réserve fédérale, communiqué H.6 courant](https://www.federalreserve.gov/releases/h6/current/default.htm), 23 juin 2026 : composantes détaillées et changement de traitement des comptes IRA et Keogh à compter du 28 juillet 2026.
- [FRED, série M2 (M2SL), Fed de Saint-Louis](https://fred.stlouisfed.org/series/M2SL) : niveau et historique de la M2 ; voir aussi la [vélocité de la M2 (M2V)](https://fred.stlouisfed.org/series/M2V) et la [M2 réelle (M2REAL)](https://fred.stlouisfed.org/series/M2REAL).
- [Lyn Alden et Sam Callahan, « Bitcoin: A Global Liquidity Barometer »](https://www.lynalden.com/bitcoin-a-global-liquidity-barometer/), 2024 : cohérence directionnelle de 83 % sur douze mois et 74 % sur six mois, et ses limites.
- [CF Benchmarks, « The M2-Bitcoin Relationship: What the Data Actually Shows »](https://www.cfbenchmarks.com/blog/the-m2-bitcoin-relationship-what-the-data-actually-shows), 2026 : corrélation glissante, comportement en 2022 et décrochage de 2025 et 2026.
- [Kokabian, analyse de cointégration entre liquidité mondiale et Bitcoin (working paper, arXiv)](https://arxiv.org/pdf/2512.22326), 2025 : élasticité de long terme estimée, à manier comme un travail préliminaire.
