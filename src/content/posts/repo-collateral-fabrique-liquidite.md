---
title: "Repo et collatéral : où se fabrique la liquidité, et où elle casse"
description: "Le marché repo transforme du collatéral en cash au jour le jour, et fait tourner des milliers de milliards de dollars. C'est la plomberie invisible qui finance les positions à effet de levier sur la dette américaine. Comment elle fabrique de la liquidité, pourquoi elle se grippe aux dates de bilan, et l'effet de la fin du resserrement de la Fed depuis fin 2025."
pubDate: 2026-06-23T11:00:00+02:00
updatedDate: 2026-06-23T11:00:00+02:00
tags: ["macro", "banques centrales", "liquidité", "marchés"]
draft: false
---

*Sous la surface des marchés, des milliers de milliards de dollars changent de main chaque jour contre du collatéral, pour quelques heures. C'est le marché repo, la plomberie qui finance les Treasuries, les dealers et les positions à effet de levier. Quand elle fonctionne, personne n'en parle. Quand elle se grippe, comme en septembre 2019, les taux courts décrochent en quelques heures et la banque centrale doit injecter du cash en urgence. Fin 2025, après la fin du resserrement quantitatif, les premiers tremblements sont réapparus. Décryptage d'un mécanisme où la liquidité ne tombe pas du ciel : elle se fabrique sur le bilan des intermédiaires, contre du collatéral.*

Une opération de pension livrée, ou repo, est une vente assortie d'un rachat. Un emprunteur cède un titre, le plus souvent une obligation du Trésor américain, et reçoit du cash, avec l'engagement de racheter le titre le lendemain à un prix légèrement supérieur. La différence est un taux d'intérêt. Le prêt est donc garanti par le titre, le collatéral, ce qui rend le repo bien plus sûr qu'un prêt en blanc. Le taux de référence du segment garanti est le [SOFR](/glossaire/#sofr), publié chaque jour par la Réserve fédérale de New York. Le point essentiel tient en une idée : dans le repo, le cash et le collatéral sont les deux faces d'une même pièce, et la liquidité naît de leur circulation.

## Comment le repo fabrique de la liquidité

Le marché met en relation trois familles d'acteurs. D'un côté, des prêteurs de cash en quête d'un placement court et sûr : surtout les fonds monétaires, mais aussi des banques et des entreprises. De l'autre, des emprunteurs de cash qui détiennent des titres : hedge funds, gérants, et indirectement le Trésor, dont la dette est en partie portée par des investisseurs à effet de levier. Entre les deux, les dealers, banques d'investissement primaires, qui intermédient le flux en empruntant d'un côté pour prêter de l'autre.

La liquidité se fabrique à cet étage intermédiaire. Un même titre peut servir de garantie plusieurs fois, et le dealer transforme des échéances et des contreparties sur son propre bilan. La capacité du système à produire du financement dépend donc directement de la place disponible sur le bilan des dealers, une ressource contrainte par la réglementation post-2008. C'est la première faille : quand cette capacité se réduit, le financement se raréfie même si le cash existe ailleurs.

## Le plancher et le plafond de la Fed

La Fed n'agit pas sur le repo en fixant un prix, mais en bornant un couloir. La rémunération des réserves, l'[IORB](/glossaire/#iorb), oriente le coût du cash pour les banques. En bas, la facilité de prise en pension inversée, le [RRP](/glossaire/#rrp), offre un placement plancher : son usage a dépassé **2 000 milliards** de dollars en 2023, avant de retomber près de zéro. En haut, la facilité de pension permanente, longtemps appelée SRF puis [SRP](/glossaire/#srf), permet aux contreparties éligibles d'emprunter du cash contre Treasuries, dette d'agence et MBS d'agence : elle agit comme un plafond sur les taux courts. Le tout s'articule autour du compte du Trésor à la Fed, le [TGA](/glossaire/#tga), et du niveau global des réserves bancaires. Cette mécanique, et le proxy de liquidité nette qui en découle, est détaillée dans notre [guide sur la liquidité](/guides/liquidite-tresor-dts-tga-rrp/).

<figure class="infographic">
<svg viewBox="0 0 720 330" role="img" aria-label="Schéma du marché repo : prêteurs de cash, dealers, emprunteurs, et le couloir de la Fed" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="330" fill="#0c0d10"/>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">La fabrique de liquidité du repo</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Le collatéral circule dans un sens, le cash dans l'autre. La Fed borne le couloir des taux.</text>

  <!-- trois boites -->
  <rect x="32" y="120" width="170" height="70" rx="8" fill="none" stroke="#5eead4" stroke-width="1.5"/>
  <text x="117" y="150" fill="#f5f6f8" font-size="13" text-anchor="middle">Prêteurs de cash</text>
  <text x="117" y="170" fill="#8b909b" font-size="11" text-anchor="middle">fonds monétaires, banques</text>

  <rect x="275" y="120" width="170" height="70" rx="8" fill="none" stroke="#f5b13d" stroke-width="1.5"/>
  <text x="360" y="150" fill="#f5f6f8" font-size="13" text-anchor="middle">Dealers</text>
  <text x="360" y="170" fill="#8b909b" font-size="11" text-anchor="middle">banques primaires</text>

  <rect x="518" y="120" width="170" height="70" rx="8" fill="none" stroke="#ff4d87" stroke-width="1.5"/>
  <text x="603" y="150" fill="#f5f6f8" font-size="13" text-anchor="middle">Emprunteurs de cash</text>
  <text x="603" y="170" fill="#8b909b" font-size="11" text-anchor="middle">hedge funds, levier</text>

  <!-- fleches cash (vers la droite, teal) -->
  <line x1="202" y1="143" x2="273" y2="143" stroke="#5eead4" stroke-width="2" marker-end="url(#ar)"/>
  <line x1="445" y1="143" x2="516" y2="143" stroke="#5eead4" stroke-width="2" marker-end="url(#ar)"/>
  <text x="360" y="112" fill="#5eead4" font-size="11" text-anchor="middle">cash →</text>

  <!-- fleches collateral (vers la gauche, rose) -->
  <line x1="516" y1="168" x2="445" y2="168" stroke="#ff4d87" stroke-width="2" marker-end="url(#ar2)"/>
  <line x1="273" y1="168" x2="202" y2="168" stroke="#ff4d87" stroke-width="2" marker-end="url(#ar2)"/>
  <text x="360" y="208" fill="#ff4d87" font-size="11" text-anchor="middle">← collatéral (Treasuries)</text>

  <!-- couloir Fed -->
  <line x1="275" y1="250" x2="445" y2="250" stroke="#8b909b" stroke-width="1" stroke-dasharray="3 3"/>
  <text x="360" y="245" fill="#5eead4" font-size="11" text-anchor="middle">plafond : SRP (la Fed prête)</text>
  <text x="360" y="272" fill="#f5b13d" font-size="11" text-anchor="middle">IORB : rémunération des réserves</text>
  <text x="360" y="296" fill="#ff4d87" font-size="11" text-anchor="middle">plancher : RRP (la Fed emprunte)</text>

  <defs>
    <marker id="ar" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="#5eead4"/></marker>
    <marker id="ar2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="#ff4d87"/></marker>
  </defs>
</svg>
<figcaption>Les dealers intermédient le flux : ils empruntent du cash aux fonds monétaires et le prêtent aux emprunteurs à effet de levier, contre collatéral. La Fed ne fixe pas le prix, elle borne le couloir avec le RRP en bas et le SRP en haut. Schéma simplifié.</figcaption>
</figure>

## Où ça casse

Les points de rupture sont connus, et ils tiennent moins au manque de cash qu'à sa distribution et aux contraintes de bilan. Aux fins de trimestre et aux dates de reporting, les dealers réduisent leur intermédiation pour alléger leur bilan, et les taux garantis peuvent grimper au-dessus du couloir. Une hausse soudaine du TGA, quand le Trésor reconstitue sa trésorerie, aspire des réserves hors du système. Une émission lourde de Treasuries gonfle le collatéral à financer. Et quand les réserves deviennent rares, la moindre de ces secousses se transmet aux taux.

La leçon de référence reste septembre 2019. Les réserves étaient tombées à environ **1 400 milliards** de dollars, et un télescopage entre paiements d'impôts et règlement d'adjudications a fait bondir les taux repo bien au-dessus de la cible, jusqu'à des transactions à deux chiffres, forçant la Fed à injecter jusqu'à **100 milliards** de dollars par jour. La conclusion des régulateurs : dans un monde de planchers réglementaires de liquidité, des réserves dites abondantes peuvent se révéler illusoires si elles sont mal réparties.

## 2025-2026 : les tremblements de retour

Le décor a changé fin 2025. La Fed a clos son resserrement quantitatif le **1ᵉʳ décembre 2025**, ramenant son bilan de **8 900 milliards** de dollars en 2022 à environ **6 500 milliards**, soit près de **2 400 milliards** de liquidité retirée. Les réserves bancaires sont revenues autour de **3 000 milliards** de dollars. Et les signaux de tension sont réapparus avant même la fin du QT : à la mi-septembre 2025, la facilité permanente a été sollicitée pour environ **18,5 milliards** de dollars en une journée, le plus gros tirage depuis sa création, avec un SOFR autour de **4,42 %** et des taux garantis durablement au-dessus du taux des fed funds.

La Fed a réagi. Le **10 décembre 2025**, elle a supprimé le plafond agrégé de la facilité, qui était de **500 milliards** de dollars par jour, l'a passée en allotissement intégral, l'a rebaptisée pour combattre la stigmatisation, et a relancé des achats de réserves à hauteur d'environ **40 milliards** de dollars de bons du Trésor par mois jusqu'à la mi-avril 2026. Le test est venu vite : le **31 décembre 2025**, au passage d'année, le SOFR a sauté à **3,87 %**, certaines transactions atteignant **4,0 %**, et les banques ont emprunté **75 milliards** de dollars à la facilité avant de tout déboucler dès le 2 janvier. Le plafond a fonctionné, mais il a fallu l'actionner.

<figure class="infographic">
<svg viewBox="0 0 720 300" role="img" aria-label="Chronologie des tensions sur le marché repo, septembre 2025 à décembre 2025" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="300" fill="#0c0d10"/>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Signaux de tension, fin 2025</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Sources : New York Fed ; FOMC ; Wolf Street. Montants en milliards de dollars.</text>

  <line x1="60" y1="150" x2="690" y2="150" stroke="#2a2c33" stroke-width="1"/>

  <!-- noeuds -->
  <circle cx="130" cy="150" r="6" fill="#f5b13d"/>
  <text x="130" y="120" fill="#f5b13d" font-size="12" text-anchor="middle" font-weight="700">mi-sept.</text>
  <text x="130" y="180" fill="#d6d9df" font-size="11" text-anchor="middle">SRF : 18,5</text>
  <text x="130" y="196" fill="#8b909b" font-size="10" text-anchor="middle">SOFR ~4,42 %</text>

  <circle cx="320" cy="150" r="6" fill="#5eead4"/>
  <text x="320" y="120" fill="#5eead4" font-size="12" text-anchor="middle" font-weight="700">1ᵉʳ déc.</text>
  <text x="320" y="180" fill="#d6d9df" font-size="11" text-anchor="middle">fin du QT</text>
  <text x="320" y="196" fill="#8b909b" font-size="10" text-anchor="middle">bilan 6 500</text>

  <circle cx="500" cy="150" r="6" fill="#5eead4"/>
  <text x="500" y="120" fill="#5eead4" font-size="12" text-anchor="middle" font-weight="700">10 déc.</text>
  <text x="500" y="180" fill="#d6d9df" font-size="11" text-anchor="middle">plafond SRF levé</text>
  <text x="500" y="196" fill="#8b909b" font-size="10" text-anchor="middle">achats 40 / mois</text>

  <circle cx="650" cy="150" r="6" fill="#ff4d87"/>
  <text x="650" y="120" fill="#ff4d87" font-size="12" text-anchor="middle" font-weight="700">31 déc.</text>
  <text x="650" y="180" fill="#d6d9df" font-size="11" text-anchor="middle">SOFR 3,87 %</text>
  <text x="650" y="196" fill="#8b909b" font-size="10" text-anchor="middle">SRF : 75</text>

  <text x="32" y="270" fill="#8b909b" font-size="11">Pour mémoire, la facilité avait été quasi inutilisée de 2021 à l'été 2025.</text>
</svg>
<figcaption>De la mi-septembre à la fin décembre 2025, la facilité permanente est passée d'un quasi non-usage à un tirage de 75 milliards de dollars au 31 décembre. Sources : New York Fed (discours et statements de l'Open Market Trading Desk), implementation note du FOMC du 10 décembre 2025, Wolf Street pour le passage d'année.</figcaption>
</figure>

## Le collatéral, variable cachée

Reste la pièce que l'on regarde le moins : le collatéral lui-même. Tout le système repose sur la qualité et la disponibilité des Treasuries qui le garantissent. Or l'offre de Treasuries gonfle avec les déficits, et une part de cette dette est portée par des investisseurs à effet de levier qui financent leurs achats en repo, notamment via l'arbitrage de base entre comptant et futures, dont la taille est estimée à plus de **1 000 milliards** de dollars par plusieurs observateurs de marché. Cette demande de financement est quasi structurelle, ce qui rend le repo dépendant de la capacité des dealers à intermédier sans limite. La Fed prépare d'ailleurs une compensation centralisée de ses opérations permanentes pour libérer cette capacité de bilan.

La note des services de la Fed sur le « trilemme du bilan », publiée le **14 janvier 2026**, formalise la tension : plus les réserves baissent par rapport à l'encours de Treasuries, plus la sensibilité des taux garantis aux chocs de liquidité augmente, et plus la volatilité grimpe en l'absence d'intervention. L'enquête de mars 2026 auprès des directeurs financiers de banques, citée par la New York Fed, montre une courbe de demande de réserves très pentue : une baisse même modeste des réserves pourrait provoquer une hausse marquée des taux courts. Autrement dit, le coussin est plus mince qu'il n'y paraît.

La leçon durable est là. La liquidité n'est pas un stock posé quelque part, c'est un flux fabriqué en continu sur le bilan d'intermédiaires contraints, contre un collatéral dont l'offre ne cesse de croître. Tant que les réserves sont franchement abondantes, le mécanisme tourne sans bruit. Quand elles approchent du seuil d'ampleur, les dates de bilan, les pics du TGA et les adjudications deviennent autant de points de bascule, et la banque centrale n'a d'autre choix que de garder son plafond armé.

---

**Sources principales :** Réserve fédérale de New York, discours de Roberto Perli « Money Market Conditions and the Federal Reserve's Balance Sheet » (12 novembre 2025), « Reflections on the Early Days of Reserve Management Purchases » (26 mars 2026) et remarques à l'Atlanta Fed (19 mai 2026) ; FOMC, implementation note et minutes des 9-10 décembre 2025, statements de l'Open Market Trading Desk sur la facilité permanente (10 décembre 2025) ; Board of Governors, FEDS Note « The Central Bank Balance-Sheet Trilemma » (14 janvier 2026) et publication H.4.1 ; Congressional Research Service, « The Federal Reserve's Balance Sheet » ; Treasury, Quarterly Refunding Statement (4 février 2026) ; Wolf Street pour les tirages de fin d'année. Chiffres et dates vérifiés un à un. Pour le cadre conceptuel, travaux de référence de la New York Fed (Liberty Street Economics), du BIS, de l'OFR et l'archive Zoltan Pozsar sur le repo et le collatéral.
