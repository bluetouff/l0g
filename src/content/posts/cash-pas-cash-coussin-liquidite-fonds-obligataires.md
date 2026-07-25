---
title: "Le cash qui n’est pas du cash : le coussin de liquidité caché des fonds obligataires"
description: "Les fonds obligataires ouverts promettent des rachats quotidiens, mais leur première ligne de défense repose surtout sur des véhicules monétaires et du repo. Les données N-PORT révèlent la taille, la composition et les limites de ce coussin."
pubDate: 2026-07-25T19:00:10+02:00
updatedDate: 2026-07-25T19:00:10+02:00
tags: ["marchés", "fonds", "obligations", "liquidité", "risque systémique"]
draft: false
---

*Quand un porteur réclame son argent à un fonds obligataire ouvert, le fonds ne vend pas nécessairement une obligation. Il peut d’abord mobiliser son cash, laisser arriver à échéance un placement très court, réduire une position de repo ou sortir d’un véhicule monétaire. La vente de crédit vient plus tard. Entre la demande de rachat et l’obligation vendue existe donc un coussin. Une étude de la Réserve fédérale publiée en mai 2026 permet enfin d’en mesurer la composition. Sa conclusion change la question : ce coussin est liquide, mais il est très peu constitué de cash.*

Le sujet prolonge, sans le répéter, le mouvement décrit dans notre analyse du [high yield qui résiste tandis que l’investment grade fuit](/posts/le-high-yield-resiste-investment-grade-fuit/). Les sorties de fonds disent qu’un investisseur demande à être remboursé. Elles ne disent ni quel actif le gérant a mobilisé, ni combien de temps il peut éviter de vendre ses obligations.

La réponse de la Fed est précise et limitée. Sur son échantillon, le coussin moyen représente **4,7 %** des actifs nets et sa médiane **3,4 %**. Mais, dans la série agrégée, le cash et ses équivalents n’en représentent en moyenne qu’environ **0,4 % des actifs**. L’essentiel vient de véhicules de placement à court terme et du [repo](/glossaire/repo/), deux briques du marché monétaire non bancaire dont la liquidité dépend elle-même des conditions de marché.

Ce constat ne prouve aucune vente forcée en juillet 2026. Les données étudiées s’arrêtent au troisième trimestre 2025. Il révèle autre chose : la liquidité quotidienne d’un fonds obligataire est une chaîne de financement, pas un tas de billets.

## Le périmètre exact : des fonds ouverts, pas des ETF

La [note FEDS du 8 mai 2026](https://www.federalreserve.gov/econres/notes/feds-notes/measuring-mutual-fund-liquidity-with-n-port-20260508.html), signée Erik Larsson, Ty Kawamura et Chaehee Shin, exploite les formulaires N-PORT et N-CEN déposés auprès de la SEC.

Son échantillon couvre **369 fonds communs obligataires corporate américains**, observés du quatrième trimestre 2019 au troisième trimestre 2025, pour **5 458 observations fonds-trimestres**. Au troisième trimestre 2025, ces véhicules représentaient **450,635 Md$ d’actifs nets**. Les auteurs retiennent des fonds :

- ouverts et enregistrés sous le formulaire N-1A ;
- dont la maturité moyenne pondérée du portefeuille atteint au moins trois ans ;
- dont les obligations d’entreprises domiciliées aux États-Unis représentent au moins 55 % des actifs nets.

Ce périmètre exclut explicitement les ETF. Il exclut aussi les fonds monétaires, régis par un cadre distinct. La différence est importante : un ETF peut gérer les sorties par des créations et rachats de parts, parfois en nature, avec des participants autorisés. Un fonds commun ouvert rembourse directement ses porteurs selon les procédures de rachat prévues par son prospectus.

L’étude ne mesure donc ni LQD, ni HYG, ni l’ensemble du marché obligataire. Elle décrit un compartiment précis : les fonds communs américains de long terme principalement investis en obligations corporate domestiques.

## Le ratio que les chercheurs ont dû reconstruire

La SEC impose aux fonds concernés de déclarer chaque mois leur portefeuille sur le formulaire N-PORT. Le formulaire contient les actifs, leur valeur, leur échéance, leur type, leurs contreparties et plusieurs mesures de risque. Pourtant, l’information la plus intuitive pour ce sujet manque au public : la catégorie de liquidité attribuée à chaque ligne.

La [règle 22e-4](https://www.sec.gov/resources-small-businesses/small-business-compliance-guides/investment-company-liquidity-risk-management-program-rules) oblige un fonds à classer ses positions au moins mensuellement dans quatre catégories, de « hautement liquide » à « illiquide », en tenant compte du délai de conversion en cash, de l’impact sur le prix et de la profondeur du marché. Mais l’item C.7 de N-PORT qui porte cette classification reste confidentiel.

Les chercheurs de la Fed ont donc créé une mesure qui n’est ni un ratio réglementaire, ni un seuil officiel : le **[SLAR](/glossaire/slar/)**, pour *Short-Term Liquid Assets Ratio*.

Le numérateur additionne :

- le cash et les équivalents de cash ;
- les Treasury bills arrivant à échéance dans 90 jours ou moins ;
- les repos domiciliés aux États-Unis arrivant à échéance dans 90 jours ou moins ;
- les **[STIV](/glossaire/stiv/)** domiciliés aux États-Unis.

Le dénominateur est la valeur nette des actifs du fonds. La formule est donc :

**SLAR = actifs liquides à court terme / actifs nets du fonds**

Le formulaire N-PORT définit un STIV comme une catégorie comprenant notamment un fonds monétaire, un pool de liquidité ou un autre véhicule de gestion de trésorerie. Ce n’est pas une enveloppe juridique unique. C’est une catégorie déclarative qui regroupe des instruments conçus pour placer du cash à court terme.

Cette reconstruction a une vertu : elle regarde ce que les fonds détiennent réellement, et non la liquidité que leur nom ou leur stratégie laisse supposer. Elle a aussi une limite : elle mesure un stock d’actifs réputés mobilisables, pas le prix auquel chacun pourrait être converti en cash pendant une crise.

## Un coussin proche de 5 %, mais seulement 0,4 % de cash

Sur l’ensemble de la période, le SLAR moyen d’un fonds de l’échantillon est de **4,7 %**, pour une médiane de **3,4 %**. L’écart interquartile va d’environ **1,5 % à 7,2 %**. Le fonds médian dispose donc d’un coussin inférieur à celui suggéré par la moyenne, tirée vers le haut par les véhicules les plus liquides.

La décomposition agrégée est plus instructive encore :

- les STIV représentent plus de la moitié du coussin pendant la plupart des périodes, soit environ **3,2 % des actifs nets** ;
- le repo représente environ **1,5 % des actifs** ;
- le cash et ses équivalents ne pèsent en moyenne qu’environ **0,4 %** ;
- les Treasury bills très courts ne constituent qu’une composante mineure, sans chiffre précis publié dans le texte de la note.

Ces ordres de grandeur viennent de statistiques différentes de la même étude : moyenne temporelle pour le cash, série agrégée pondérée pour la composition, valeur observée pendant la plupart des périodes pour les STIV. Ils ne doivent pas être additionnés comme s’il s’agissait du bilan exact d’un fonds à une date unique.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 900 525" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="slar-composition-title slar-composition-desc" style="width:100%;height:auto;background:#0c0d10;border:1px solid rgba(255,255,255,0.10);border-radius:12px;font-family:ui-monospace,monospace">
  <title id="slar-composition-title">Le coussin est surtout du marché monétaire</title>
  <desc id="slar-composition-desc">Ordres de grandeur publiés par la Réserve fédérale pour les fonds obligataires corporate de l'échantillon. Les STIV représentent environ 3,2 pour cent des actifs nets pendant la plupart des périodes, le repo environ 1,5 pour cent et le cash en moyenne 0,4 pour cent. Les bons du Trésor très courts sont une composante mineure non chiffrée dans le texte.</desc>
  <text x="32" y="42" fill="#5eead4" font-size="17">// Le coussin est surtout du marché monétaire</text>
  <text x="32" y="67" fill="#8b909b" font-size="11">ordres de grandeur en % des actifs nets, étude Fed 2019 T4 à 2025 T3</text>
  <g stroke="rgba(255,255,255,0.10)" stroke-width="1">
    <line x1="250" y1="105" x2="250" y2="430"/>
    <line x1="385" y1="105" x2="385" y2="430"/>
    <line x1="520" y1="105" x2="520" y2="430"/>
    <line x1="655" y1="105" x2="655" y2="430"/>
    <line x1="790" y1="105" x2="790" y2="430"/>
  </g>
  <g fill="#8b909b" font-size="10" text-anchor="middle">
    <text x="250" y="452">0 %</text>
    <text x="385" y="452">1 %</text>
    <text x="520" y="452">2 %</text>
    <text x="655" y="452">3 %</text>
    <text x="790" y="452">4 %</text>
  </g>
  <g font-size="12">
    <text x="32" y="150" fill="#f5f6f8">STIV</text>
    <text x="32" y="170" fill="#8b909b" font-size="9">fonds monétaire, pool de liquidité</text>
    <text x="32" y="184" fill="#8b909b" font-size="9">ou véhicule de gestion de cash</text>
    <rect x="250" y="128" width="432" height="50" rx="6" fill="#5eead4"/>
    <text x="697" y="158" fill="#b8fff5" font-size="16" font-weight="700">≈ 3,2 %</text>
    <text x="32" y="246" fill="#f5f6f8">Repo court</text>
    <text x="32" y="270" fill="#8b909b" font-size="10">échéance de 90 jours ou moins</text>
    <rect x="250" y="224" width="203" height="50" rx="6" fill="#f5b13d"/>
    <text x="468" y="254" fill="#f5b13d" font-size="16" font-weight="700">≈ 1,5 %</text>
    <text x="32" y="342" fill="#f5f6f8">Cash + équivalents</text>
    <text x="32" y="366" fill="#8b909b" font-size="10">moyenne temporelle</text>
    <rect x="250" y="320" width="54" height="50" rx="6" fill="#ff4d87"/>
    <text x="319" y="350" fill="#ff8aaf" font-size="16" font-weight="700">≈ 0,4 %</text>
    <text x="32" y="414" fill="#f5f6f8">T-bills ≤ 90 jours</text>
    <text x="250" y="414" fill="#8b909b">composante mineure, non chiffrée dans le texte</text>
  </g>
  <text x="32" y="488" fill="#8b909b" font-size="9">Attention : ces valeurs sont des ordres de grandeur issus de statistiques agrégées différentes.</text>
  <text x="32" y="506" fill="#8b909b" font-size="9">Source : Larsson, Kawamura et Shin, Federal Reserve, 8 mai 2026, données SEC N-PORT et N-CEN.</text>
</svg>
<figcaption>Le titre « cash qui n’est pas du cash » ne signifie pas que les STIV ou le repo seraient illiquides en temps normal. Il souligne que le fonds dépend d’instruments et de contreparties de marché avant de disposer de cash bancaire immédiatement mobilisable.</figcaption>
</figure>

## Pourquoi un actif liquide n’est pas du cash

Un repo détenu par un fonds est un prêt de cash garanti par des titres. À l’échéance, la contrepartie rembourse le cash et récupère son collatéral. Un STIV est une part dans un véhicule qui place lui-même la trésorerie sur des instruments courts. Dans les deux cas, le fonds obtient un rendement et conserve une forte liquidité en conditions normales.

La nuance tient aux mots « en conditions normales ». Le cash bancaire est déjà l’unité de règlement. Un repo doit arriver à échéance, être dénoué ou être cédé. Une part de STIV doit être rachetée par le véhicule qui la porte. Leur liquidité dépend donc d’une seconde couche : qualité du collatéral, fonctionnement du marché monétaire, capacité de la contrepartie, délais opérationnels et profondeur du marché.

La Fed ne dit pas que ces instruments vont casser. Elle formule une implication plus prudente : la liquidité des fonds obligataires pourrait être déterminée non seulement par les rachats de leurs propres porteurs, mais aussi par les conditions de marché des instruments monétaires non bancaires qu’ils utilisent.

Cette dépendance relie trois compartiments souvent analysés séparément :

1. le fonds obligataire, qui promet le rachat quotidien ;
2. les [fonds monétaires](/guides/lire-les-fonds-monetaires/) et pools de liquidité logés dans les STIV ;
3. le marché du [repo et du collatéral](/posts/repo-collateral-fabrique-liquidite/), qui transforme un titre en financement court.

Le coussin ne supprime pas la transformation de liquidité. Il la déplace temporairement vers des actifs dont la conversion paraît immédiate tant que leur propre marché fonctionne.

## La séquence de liquidation du gérant

La mécanique la plus simple serait une file parfaitement ordonnée : cash, puis STIV et repo, puis obligations liquides, enfin obligations difficiles à vendre. La recherche académique décrit un comportement plus nuancé.

L’étude de Hao Jiang, Dan Li et Ashley Wang, publiée en 2021 dans le *Journal of Financial and Quantitative Analysis*, montre que les fonds obligataires corporate tendent, en période calme, à réduire leurs actifs liquides pour servir les rachats. Quand l’incertitude agrégée augmente, ils vendent davantage actifs liquides et illiquides dans des proportions proches afin de préserver le profil de liquidité du portefeuille. Les ventes du secteur pendant les épisodes de forte incertitude créent alors des pressions de prix suivies de retournements, compatibles avec un effet de vente contrainte. [Article académique et DOI](https://doi.org/10.1017/S0022109020000460).

Il serait donc faux d’écrire que les fonds vendent toujours leurs meilleures obligations en premier. Ils arbitrent entre deux risques :

- consommer le coussin et laisser aux porteurs restants un portefeuille moins liquide ;
- vendre aussi des obligations, accepter un coût de transaction et tenter de conserver une structure de portefeuille plus stable.

La décision dépend de l’ampleur des sorties, de la liquidité du marché, de la composition du fonds et de la possibilité de reconstituer rapidement le coussin. Le SLAR mesure la première ligne de défense, pas la stratégie complète du gérant.

## Un stock qui baisse après le choc et se reconstruit ensuite

La série de la Fed montre une régularité : les épisodes de stress consomment le coussin, puis les entrées ultérieures permettent de le reconstruire.

Après le déclenchement de la pandémie au premier trimestre 2020, le SLAR agrégé pondéré est passé de **6,5 % à 4,9 %**. Les auteurs attribuent vraisemblablement cette baisse aux rachats importants, sans présenter cette attribution comme une identification causale. Le ratio remonte ensuite jusqu’à **5,8 %** au début de 2021.

Après un nouveau point bas au milieu de 2022, dans le contexte du resserrement monétaire et de sorties obligataires, il revient à **5,5 %** à la fin de l’année. Plus récemment dans l’échantillon, il recule de **5,1 % au deuxième trimestre 2025 à 4,3 % au troisième trimestre**, après les rachats liés à la volatilité d’avril. La baisse atteint **0,8 point de pourcentage**.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 900 455" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="slar-cycle-title slar-cycle-desc" style="width:100%;height:auto;background:#0c0d10;border:1px solid rgba(255,255,255,0.10);border-radius:12px;font-family:ui-monospace,monospace">
  <title id="slar-cycle-title">Le coussin se consomme puis se reconstruit</title>
  <desc id="slar-cycle-desc">Repères non continus publiés par la Réserve fédérale. En 2020, le SLAR agrégé passe de 6,5 à 4,9 pour cent. Il atteint 5,8 pour cent début 2021, 5,5 pour cent fin 2022, puis baisse de 5,1 à 4,3 pour cent entre les deuxième et troisième trimestres 2025.</desc>
  <text x="32" y="42" fill="#5eead4" font-size="17">// Le coussin se consomme puis se reconstruit</text>
  <text x="32" y="67" fill="#8b909b" font-size="11">repères publiés, pas une série trimestrielle complète</text>
  <g>
    <rect x="32" y="104" width="250" height="238" rx="10" fill="rgba(255,255,255,0.035)" stroke="rgba(255,255,255,0.10)"/>
    <text x="54" y="134" fill="#f5f6f8" font-size="12">CHOC COVID, 2020 T1</text>
    <text x="54" y="205" fill="#5eead4" font-size="31" font-weight="700">6,5 %</text>
    <text x="159" y="205" fill="#8b909b" font-size="20">→</text>
    <text x="196" y="205" fill="#ff4d87" font-size="31" font-weight="700">4,9 %</text>
    <text x="54" y="244" fill="#8b909b" font-size="10">−1,6 point</text>
    <text x="54" y="278" fill="#8b909b" font-size="10">Interprétation Fed : rachats lourds</text>
    <text x="54" y="298" fill="#8b909b" font-size="10">puis reconstitution du coussin</text>
    <rect x="305" y="104" width="250" height="238" rx="10" fill="rgba(255,255,255,0.035)" stroke="rgba(255,255,255,0.10)"/>
    <text x="327" y="134" fill="#f5f6f8" font-size="12">RECONSTRUCTION</text>
    <text x="327" y="205" fill="#5eead4" font-size="31" font-weight="700">5,8 %</text>
    <text x="327" y="230" fill="#8b909b" font-size="10">début 2021</text>
    <text x="327" y="278" fill="#f5b13d" font-size="25" font-weight="700">5,5 %</text>
    <text x="327" y="301" fill="#8b909b" font-size="10">fin 2022, après le point bas</text>
    <rect x="578" y="104" width="290" height="238" rx="10" fill="rgba(255,255,255,0.035)" stroke="rgba(255,255,255,0.10)"/>
    <text x="600" y="134" fill="#f5f6f8" font-size="12">VOLATILITÉ, 2025</text>
    <text x="600" y="205" fill="#5eead4" font-size="31" font-weight="700">5,1 %</text>
    <text x="705" y="205" fill="#8b909b" font-size="20">→</text>
    <text x="742" y="205" fill="#ff4d87" font-size="31" font-weight="700">4,3 %</text>
    <text x="600" y="244" fill="#8b909b" font-size="10">2025 T2 à 2025 T3</text>
    <text x="600" y="278" fill="#8b909b" font-size="10">−0,8 point après les rachats</text>
    <text x="600" y="298" fill="#8b909b" font-size="10">liés à la volatilité d’avril</text>
  </g>
  <text x="32" y="390" fill="#8b909b" font-size="10">Les dates et niveaux sont ceux décrits dans le texte de la note. Les points intermédiaires ne sont pas représentés.</text>
  <text x="32" y="413" fill="#8b909b" font-size="10">Source : Federal Reserve, données SEC N-PORT et N-CEN, publication du 8 mai 2026.</text>
</svg>
<figcaption>La baisse du ratio après un choc est observée. L’attribution précise de chaque mouvement aux rachats reste l’interprétation des auteurs de la Fed et non une preuve causale complète.</figcaption>
</figure>

Le précédent de mars 2020 donne le mécanisme de marché. Antonio Falato, Itay Goldstein et Ali Hortaçsu constatent que les sorties furent plus sévères dans les fonds exposés aux actifs illiquides et aux ventes susceptibles d’exercer un impact sur les prix. Le soutien de la Fed au marché des obligations corporate a davantage bénéficié aux fonds les plus fragiles et contribué au retournement des flux. Leur étude ne dit pas qu’un tel soutien sera répété. Elle montre qu’en 2020 le filet posé sous l’actif obligataire a aussi stabilisé le passif des fonds. [NBER Working Paper 27559](https://doi.org/10.3386/w27559), ensuite publié dans le *Journal of Monetary Economics*.

## L’asymétrie d’information entre régulateur et public

Le régime américain contient plusieurs garde-fous. La règle 22e-4 impose un programme de gestion du risque de liquidité, une classification mensuelle des actifs, une limite générale de **15 % des actifs nets** pour les investissements illiquides et, pour certains fonds, un minimum d’investissements hautement liquides déterminé par le fonds. La [SEC précise](https://www.sec.gov/rules-regulations/2016/10/investment-company-liquidity-risk-management-programs) que le dépassement de la limite d’illiquidité ou le passage durable sous ce minimum déclenche une notification confidentielle.

Ce dispositif ne crée pas un SLAR minimal uniforme. La Fed rappelle que le minimum d’actifs hautement liquides ne s’applique pas de la même façon aux fonds qui détiennent principalement des actifs déjà classés hautement liquides, et que le niveau retenu reste propre au fonds.

Le décalage d’information demeure. Le public peut télécharger les portefeuilles N-PORT, mais pas les classifications C.7 utilisées par le régulateur. Les auteurs ont dû les inférer à partir du type d’actif, du domicile, de la maturité et de la valeur déclarée.

En août 2024, la SEC avait adopté une publication plus fréquente : un rapport N-PORT chaque mois, déposé sous 30 jours et rendu public sous 60 jours, au lieu de ne rendre public que le troisième mois de chaque trimestre. En avril 2025, elle a [repoussé l’entrée en vigueur](https://www.sec.gov/rules-regulations/2025/04/s7-26-22) au 17 novembre 2027, avec une date de conformité au 18 mai 2028 pour les groupes de fonds de moins de 1 Md$.

Même après cette réforme, les champs confidentiels resteront distincts des positions publiques. Plus de fréquence ne signifie pas transparence totale, et un délai de 60 jours ne devient pas du temps réel.

## Le coût de sortie doit-il être payé par celui qui sort ?

Le coussin protège le fonds contre une vente précipitée, mais sa consommation peut transférer le coût vers les porteurs restants. Si un investisseur est remboursé à la valeur liquidative avant que les coûts de transaction et l’impact de marché ne soient pleinement incorporés, les autres peuvent hériter d’un portefeuille plus coûteux à liquider.

Ce mécanisme d’avantage au premier sortant est déjà détaillé dans notre guide pour [lire les fonds monétaires](/guides/lire-les-fonds-monetaires/). Ici, son intérêt est réglementaire : le Conseil de stabilité financière demande que les coûts explicites et implicites des rachats, y compris l’impact significatif des ventes, soient supportés par les investisseurs qui sortent. Ses [recommandations révisées de 2023](https://www.fsb.org/2023/12/revised-policy-recommendations-to-address-structural-vulnerabilities-from-liquidity-mismatch-in-open-ended-funds/) préconisent des outils anti-dilution et des tests de résistance.

L’[IOSCO a complété ce cadre en mai 2025](https://www.iosco.org/library/pubdocs/pdf/IOSCOPD799.pdf). Le swing pricing, les prix duals et les prélèvements anti-dilution ajustent le prix payé par le souscripteur ou le sortant. Les outils quantitatifs, suspension des rachats, gates, allongement du préavis ou du règlement, side pockets et rachats en nature, limitent plutôt la quantité ou la forme de liquidité promise. Leur disponibilité dépend du droit de chaque juridiction.

Ces outils ne rendent pas les obligations plus faciles à vendre. Ils modifient la répartition du coût et peuvent ralentir la course à la sortie. Certains ont aussi un effet pervers : si les investisseurs anticipent un gate ou une suspension, ils peuvent tenter de sortir avant son activation. IOSCO le reconnaît explicitement.

## Faits, inférences et inconnues

**Fait observé :** entre 2019 et 2025, les fonds de l’échantillon ont détenu un coussin proche de 5 % en moyenne, composé surtout de STIV et de repo. Ce coussin a baissé après plusieurs épisodes de sorties et s’est reconstruit ensuite.

**Résultat académique :** les fonds adaptent la combinaison d’actifs vendus au régime de marché. En période de forte incertitude, les ventes d’obligations peuvent contribuer à une pression de prix qui dépasse le fonds individuel.

**Inférence prudente :** un choc simultané sur les rachats des fonds et sur la liquidité des marchés monétaires réduirait l’efficacité du coussin, puisque deux de ses principales composantes dépendent de cette même plomberie.

**Inconnu :** le SLAR agrégé au 25 juillet 2026. La note de la Fed s’arrête au troisième trimestre 2025, et les classifications détaillées restent confidentielles. Les données publiques disponibles dans ce corpus ne permettent donc pas de calculer combien de coussin a été consommé depuis ni quels titres ont été vendus.

Cette séparation empêche de transformer une vulnérabilité structurelle en fausse alerte immédiate.

## Le tableau de bord utile

Le SLAR ne doit pas être lu seul. Un ratio élevé peut signaler une gestion prudente, mais aussi compenser un portefeuille plus illiquide. Un ratio bas peut être acceptable si les actifs sont réellement faciles à céder et si les rachats restent faibles. Aucun seuil de 5 % ne sépare mécaniquement la sécurité de la vente forcée.

Le suivi pertinent associe :

- les flux nets et leur vitesse relativement aux actifs du fonds ;
- la part de cash, STIV, repo et Treasury bills dans N-PORT ;
- la liquidité des obligations corporate, via les volumes, fourchettes et coûts de transaction TRACE ;
- les [spreads de crédit](/guides/lire-les-spreads-de-credit/) et la dispersion entre qualités ;
- l’usage éventuel d’une ligne de crédit ou d’emprunts inter-fonds, déclaré dans N-CEN ;
- les changements de politique de rachat et l’activation d’outils anti-dilution.

Le bon dénominateur n’est pas seulement la taille du fonds. C’est le rythme auquel les porteurs peuvent réclamer du cash. Un coussin de 4 % peut être ample face à des sorties quotidiennes de quelques points de base et insuffisant face à plusieurs journées de rachats massifs. La couverture réelle dépend d’un flux, pas seulement d’un stock.

## Le point l0g

La promesse de liquidité d’un fonds obligataire ne repose pas directement sur la liquidité de toutes ses obligations. Elle repose d’abord sur un mince portefeuille intermédiaire, placé entre le porteur et le marché du crédit.

Ce portefeuille fait son travail en temps normal. Les STIV mutualisent la gestion de trésorerie. Le repo transforme un collatéral en cash court. Les Treasury bills arrivent rapidement à échéance. Le fonds peut ainsi servir des rachats sans devenir immédiatement vendeur forcé.

Mais cette architecture révèle une dépendance cachée. Le fonds obligataire est aussi un utilisateur du marché monétaire. Quand son porteur demande du cash, une autre couche du système doit convertir un actif court en unité de règlement. Si le choc atteint simultanément les rachats, le repo et les véhicules monétaires, le coussin cesse d’être une réserve passive et devient un canal de transmission.

La donnée disponible n’autorise pas à affirmer que cette bascule a eu lieu en juillet 2026. Elle permet de poser la bonne question pour le prochain stress : **combien de liquidité reste-t-il avant que le fonds ne vende ce qu’il voulait précisément conserver ?**

---

**Méthodologie**

- Périmètre principal : 369 fonds communs ouverts américains de long terme, principalement investis en obligations corporate domestiques, identifiés par les auteurs à partir de N-PORT et N-CEN.
- Période : 2019 T4 à 2025 T3. Les données ne mesurent pas la situation postérieure.
- SLAR : cash et équivalents, T-bills de 90 jours ou moins, repos américains de 90 jours ou moins et STIV américains, divisés par les actifs nets.
- Les ETF et les fonds monétaires sont exclus de l’échantillon principal.
- Les chiffres de composition sont repris avec leur qualification d’origine. Ils ne constituent pas le bilan exact d’un fonds particulier.
- Les liens entre rachats et baisses du SLAR sont présentés comme observations et interprétations des auteurs, non comme causalité certaine.
- Date d’arrêté éditorial : 25 juillet 2026.

**Sources principales**

- [Federal Reserve Board, « Measuring Mutual Fund Liquidity with N-PORT »](https://www.federalreserve.gov/econres/notes/feds-notes/measuring-mutual-fund-liquidity-with-n-port-20260508.html), 8 mai 2026.
- [SEC, Form N-PORT](https://www.sec.gov/files/formn-port.pdf).
- [SEC, Investment Company Liquidity Risk Management Programs, Rule 22e-4](https://www.sec.gov/rules-regulations/2016/10/investment-company-liquidity-risk-management-programs).
- [SEC, report des amendements N-PORT et N-CEN](https://www.sec.gov/rules-regulations/2025/04/s7-26-22), 16 avril 2025.
- [Financial Stability Board, recommandations révisées sur les fonds ouverts](https://www.fsb.org/2023/12/revised-policy-recommendations-to-address-structural-vulnerabilities-from-liquidity-mismatch-in-open-ended-funds/), 20 décembre 2023.
- [IOSCO, « Guidance for Open-ended Funds »](https://www.iosco.org/library/pubdocs/pdf/IOSCOPD799.pdf), 26 mai 2025.
- [Jiang, Li et Wang, « Dynamic Liquidity Management by Corporate Bond Mutual Funds »](https://doi.org/10.1017/S0022109020000460), *Journal of Financial and Quantitative Analysis*, 2021.
- [Falato, Goldstein et Hortaçsu, « Financial Fragility in the COVID-19 Crisis »](https://doi.org/10.3386/w27559), NBER Working Paper 27559, version révisée en 2021.
- [Goldstein, Jiang et Ng, « Investor Flows and Fragility in Corporate Bond Funds »](https://doi.org/10.1016/j.jfineco.2016.11.007), *Journal of Financial Economics*, 2017.
