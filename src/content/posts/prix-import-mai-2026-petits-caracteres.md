---
title: "Prix à l'import : +1,9 % en un mois, mais lisez les petits caractères"
description: "Les prix à l'import américains bondissent de 1,9 % en mai 2026, +6,7 % sur un an. Les chiffres sont exacts. Mais derrière le titre, c'est le carburant qui fait tout le travail, et l'idée que ces indices remplaceraient le CPI ne tient pas. Décryptage aux données BLS."
pubDate: 2026-06-16
tags: ["macro", "inflation", "fed", "tarifs"]
draft: false
---

Ce matin, le Bureau of Labor Statistics a publié ses indices de prix du commerce extérieur pour mai 2026. Les chiffres circulent déjà, souvent résumés ainsi : prix à l'import en hausse de 1,9 % sur le mois, soit un rythme annualisé de plus de 25 %, et 6,7 % sur un an ; prix à l'export en hausse de 1,3 % sur le mois et 11,2 % sur un an. Conclusion fréquente accolée à ces chiffres : ce serait une mesure de l'inflation bien plus fiable que le CPI.

Première bonne nouvelle pour qui aime la rigueur : les quatre chiffres sont exacts. Je les ai vérifiés ligne à ligne dans la publication officielle. Import toutes catégories : +1,9 % en mai, +6,7 % sur douze mois. Export toutes catégories : +1,3 % en mai, +11,2 % sur un an. Aucun n'est inventé ni décalé. La mauvaise nouvelle, c'est que le titre cache l'essentiel, et que la phrase sur le CPI est fausse. Reprenons proprement.

## Le carburant fait tout le travail

Le +1,9 % « toutes catégories » est une moyenne qui mélange deux mondes. D'un côté le carburant, de l'autre tout le reste. Et l'écart est béant.

<svg viewBox="0 0 700 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Décomposition de la hausse des prix à l'import, mai 2026" style="width:100%;height:auto;background:#0c0d10;border:1px solid rgba(255,255,255,0.10);border-radius:12px">
  <text x="24" y="34" fill="#5eead4" font-family="monospace" font-size="15">// Prix à l'import, mai 2026 (variation mensuelle, %)</text>
  <g font-family="monospace">
    <text x="24" y="92" fill="#b8fff5" font-size="13">Carburants</text>
    <rect x="150" y="78" width="430" height="22" rx="3" fill="#f5b13d"/>
    <text x="590" y="94" fill="#f5b13d" font-size="14">+12,5 %</text>
    <text x="24" y="142" fill="#b8fff5" font-size="13">Toutes catégories</text>
    <rect x="150" y="128" width="65" height="22" rx="3" fill="#5eead4"/>
    <text x="225" y="144" fill="#5eead4" font-size="14">+1,9 %</text>
    <text x="24" y="192" fill="#b8fff5" font-size="13">Hors carburants</text>
    <rect x="150" y="178" width="28" height="22" rx="3" fill="#7aa2f7"/>
    <text x="188" y="194" fill="#7aa2f7" font-size="14">+0,8 %</text>
  </g>
  <line x1="150" y1="62" x2="150" y2="218" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
  <text x="24" y="258" fill="#8b909b" font-family="monospace" font-size="11">Source : BLS, Import/Export Price Indexes, mai 2026 (Table A).</text>
  <text x="24" y="278" fill="#8b909b" font-family="monospace" font-size="11">Le poste carburant, ultra-volatil, tire la moyenne vers le haut.</text>
</svg>

Les prix des carburants importés ont bondi de 12,5 % sur le seul mois de mai. Hors carburants, les prix à l'import ne montent que de 0,8 %. Le poste énergétique, qui pèse une fraction du panier, explique donc la majeure partie de l'accélération affichée. Sur douze mois, le contraste est encore plus spectaculaire : le carburant importé grimpe de 45,1 % en glissement annuel, contre 3,7 % pour les prix hors carburants.

Ce détail change tout, parce qu'il dit d'où vient le choc. Ce n'est pas une inflation diffuse et généralisée qui se serait installée partout. C'est principalement un choc pétrolier, cohérent avec la flambée du baril que je documentais à propos du [détroit d'Ormuz](/posts/accord-paix-ormuz-rouvre-scenarios/). L'énergie est par nature le poste le plus volatil de tous les indices de prix, capable de s'inverser le mois suivant. Bâtir un récit d'inflation galopante sur un seul mois de carburant, c'est confondre une étincelle avec un incendie.

## Le piège de l'annualisation

L'affirmation « +1,9 % sur le mois, soit plus de 25 % annualisé » est arithmétiquement correcte. Composer 1,9 % sur douze mois donne environ 25,3 %. Mais c'est une manipulation rhétorique classique, et il faut savoir la repérer.

Annualiser, c'est supposer qu'un mouvement mensuel va se répéter à l'identique douze mois de suite. Or on vient de voir que ce +1,9 % est porté par un poste, le carburant, dont la caractéristique est justement de ne jamais se répéter à l'identique : il monte fort un mois, retombe le suivant. Annualiser le mois le plus volatil produit le chiffre le plus spectaculaire et le moins informatif. La preuve par les faits : le glissement annuel réel, lui, est de 6,7 %, pas 25 %. Quand on veut le rythme sur un an, on lit le chiffre sur un an, on n'extrapole pas un seul mois.

## Import contre export : la vraie histoire

Le point le plus intéressant de cette publication est ailleurs, dans la divergence entre ce que l'Amérique paie pour ses imports et ce qu'elle fait payer pour ses exports.

<svg viewBox="0 0 700 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Prix import vs export, glissement annuel" style="width:100%;height:auto;background:#0c0d10;border:1px solid rgba(255,255,255,0.10);border-radius:12px">
  <text x="24" y="34" fill="#5eead4" font-family="monospace" font-size="15">// Glissement annuel, mai 2026 (%)</text>
  <g stroke="rgba(255,255,255,0.10)" stroke-width="1">
    <line x1="60" y1="80" x2="676" y2="80"/><line x1="60" y1="140" x2="676" y2="140"/>
    <line x1="60" y1="200" x2="676" y2="200"/>
  </g>
  <g font-family="monospace">
    <text x="120" y="250" fill="#b8fff5" font-size="13" text-anchor="middle">Imports</text>
    <rect x="90" y="146" width="60" height="64" fill="#7aa2f7"/>
    <text x="120" y="138" fill="#7aa2f7" font-size="14" text-anchor="middle">+6,7 %</text>
    <text x="290" y="250" fill="#b8fff5" font-size="13" text-anchor="middle">Exports</text>
    <rect x="260" y="103" width="60" height="107" fill="#5eead4"/>
    <text x="290" y="95" fill="#5eead4" font-size="14" text-anchor="middle">+11,2 %</text>
    <text x="470" y="250" fill="#b8fff5" font-size="13" text-anchor="middle">Carburant imp.</text>
    <rect x="440" y="68" width="60" height="142" fill="#f5b13d"/>
    <text x="470" y="60" fill="#f5b13d" font-size="14" text-anchor="middle">+45,1 %</text>
    <text x="620" y="250" fill="#b8fff5" font-size="13" text-anchor="middle">Imp. hors carb.</text>
    <rect x="590" y="188" width="60" height="22" fill="#ff4d87"/>
    <text x="620" y="180" fill="#ff4d87" font-size="14" text-anchor="middle">+3,7 %</text>
  </g>
  <line x1="60" y1="210" x2="676" y2="210" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>
  <text x="24" y="295" fill="#8b909b" font-family="monospace" font-size="11">Source : BLS, mai 2025 à mai 2026. L'export progresse plus vite que l'import hors énergie.</text>
</svg>

Les prix à l'export montent plus vite que les prix à l'import hors énergie : +11,2 % sur un an contre +3,7 %. C'est le signe que les producteurs américains disposent d'un pouvoir de fixation des prix sur les marchés mondiaux, porté notamment par les exportations agricoles (+5,5 % sur un an) et non agricoles (+11,8 %). Pour les termes de l'échange, c'est plutôt favorable : les États-Unis vendent plus cher ce qu'ils exportent. Mais c'est aussi un signal d'inflation domestique qui se diffuse vers l'extérieur, et un point d'attention pour les partenaires commerciaux qui importent ces biens américains.

## Pourquoi ce n'est pas un substitut du CPI

Reste l'affirmation la plus problématique : ces indices seraient une mesure de l'inflation bien plus fiable que le CPI. C'est faux, et confondre les deux mène à des conclusions erronées.

Les indices de prix import/export mesurent les prix des biens **à la frontière**, au moment où ils entrent ou sortent du pays. Ils n'incluent ni les marges de distribution, ni la fiscalité, ni surtout les **services**, qui représentent la majeure partie du panier de consommation américain (logement, santé, éducation, loisirs). Le CPI, lui, mesure ce que paie réellement le ménage, services compris. Les deux ne mesurent pas la même chose et ne sont pas interchangeables.

Ce que les prix à l'import apportent réellement, c'est un signal **avancé** : ils captent les pressions sur les coûts des intrants avant qu'elles ne se répercutent dans les prix à la consommation. À ce titre, ils sont précieux pour anticiper, et la hausse hors énergie de 3,7 % sur un an mérite l'attention, car elle peut nourrir le CPI dans les mois qui viennent. C'est d'ailleurs un complément utile à ce que je décrivais dans [le grand come-back de l'inflation US](/posts/inflation-us-grand-come-back/). Mais un indicateur avancé n'est pas une mesure « plus juste » de l'inflation vécue. C'est un autre instrument, à lire pour ce qu'il est.

## Au-delà du titre

Les chiffres de la publication sont exacts, et c'est tout à l'honneur de ceux qui les relaient. Mais la lecture honnête est plus nuancée que le titre. La hausse mensuelle est massivement portée par le carburant, un poste volatil ; l'annualisation à 25 % est un artifice ; la vraie information est la fermeté des prix hors énergie et la force des prix à l'export ; et ces indices complètent le CPI, ils ne le remplacent pas.

Pour suivre ces dynamiques dans le temps plutôt que sur un seul communiqué, le tableau de bord [risque macro US](https://us.l0g.fr) agrège les séries d'inflation et de pressions sur les prix. Un chiffre ne fait pas une tendance. Un mois de carburant ne fait pas un régime d'inflation.

---

Sources : U.S. Bureau of Labor Statistics, Import/Export Price Indexes, publication du 16 juin 2026 (données de mai 2026), Table A et communiqué. Glissements annuels de mai 2025 à mai 2026. Ceci n'est pas un conseil en investissement.
