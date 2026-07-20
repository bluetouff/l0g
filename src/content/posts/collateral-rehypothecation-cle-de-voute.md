---
title: "Collatéral et réhypothécation : un même titre, plusieurs propriétaires, et la clé de toute la plomberie"
description: "Un même bon du Trésor peut garantir plusieurs prêts à la fois. Cette réutilisation du collatéral, la réhypothécation, est le mécanisme commun qui fait tourner le repo, le basis trade, le shadow banking et le dollar offshore. On mesure son intensité par la vélocité du collatéral. Comment un titre se dédouble, pourquoi cette lubrification s'est grippée après 2008, et où se cache le risque de chaînes qui se figent."
pubDate: 2026-06-27T11:00:00+02:00
updatedDate: 2026-06-27T11:00:00+02:00
tags: ["macro", "marchés", "liquidité", "banques centrales"]
draft: false
---

*Au terme de cette série sur la plomberie du dollar, il reste à exposer le mécanisme qui se cache sous tous les autres. Le [repo](/posts/repo-collateral-fabrique-liquidite/), le [basis trade](/posts/basis-trade-treasuries-levier/), le [shadow banking](/posts/shadow-banking-intermediation-non-bancaire/), les [eurodollars](/posts/eurodollars-dollar-offshore-dette-cachee/) et le [cross-currency basis](/posts/cross-currency-basis-prix-cache-dollar/) reposent tous sur une même idée : un titre donné en garantie ne dort pas, il repart aussitôt garantir un autre prêt. Cette réutilisation, la réhypothécation, transforme un stock fini de bons du Trésor en un volume de financement bien plus grand. Le collatéral est l'huile du moteur financier, et sa circulation est la clé de voûte de tout l'édifice.*

La réhypothécation désigne le droit, pour celui qui reçoit un titre en garantie, de le redonner lui-même en garantie d'un autre engagement. Un hedge fund remet un bon du Trésor à son courtier pour emprunter, le courtier réutilise ce même bon pour se financer auprès d'un fonds monétaire, qui peut à son tour le mobiliser ailleurs. Le titre n'a pas bougé de propriétaire économique, mais il garantit désormais plusieurs créances superposées. C'est ainsi que se forment des chaînes de collatéral, à travers les opérations de financement sur titres que sont le repo et le prêt-emprunt de titres.

## La vélocité du collatéral

Le travail de référence est celui de Manmohan Singh, au FMI, qui a proposé de mesurer ce phénomène par une vélocité, sur le modèle de la vitesse de circulation de la monnaie. La vélocité du collatéral est le rapport entre le volume total de collatéral reçu par les grands intermédiaires et le collatéral d'origine fourni par les détenteurs primaires, hedge funds, fonds de pension, assureurs, comptes officiels. Fin 2007, une dizaine à une quinzaine de banques au cœur de la plomberie mondiale recevaient près de **10 000 milliards** de dollars de collatéral, pour une vélocité de l'ordre de **3**. En clair, chaque unité de collatéral source garantissait en moyenne trois engagements. La Fed a formalisé une mesure proche, le multiplicateur de collatéral, analogue au multiplicateur monétaire.

<figure class="infographic">
<svg viewBox="0 0 720 300" role="img" aria-label="Chaîne de réhypothécation : un même titre garantit plusieurs prêts successifs" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="300" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Une chaîne de réhypothécation</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Le même bon du Trésor garantit plusieurs prêts successifs.</text>
  <rect x="40" y="110" width="150" height="70" rx="8" fill="none" stroke="#5eead4" stroke-width="1.5"></rect>
  <text x="115" y="140" fill="#f5f6f8" font-size="12" text-anchor="middle">Hedge fund</text>
  <text x="115" y="160" fill="#8b909b" font-size="10" text-anchor="middle">détenteur du titre</text>
  <rect x="285" y="110" width="150" height="70" rx="8" fill="none" stroke="#f5b13d" stroke-width="1.5"></rect>
  <text x="360" y="140" fill="#f5f6f8" font-size="12" text-anchor="middle">Dealer</text>
  <text x="360" y="160" fill="#8b909b" font-size="10" text-anchor="middle">réutilise le titre</text>
  <rect x="530" y="110" width="150" height="70" rx="8" fill="none" stroke="#ff4d87" stroke-width="1.5"></rect>
  <text x="605" y="140" fill="#f5f6f8" font-size="12" text-anchor="middle">Fonds monétaire</text>
  <text x="605" y="160" fill="#8b909b" font-size="10" text-anchor="middle">le remobilise</text>
  <line x1="190" y1="145" x2="283" y2="145" stroke="#d6d9df" stroke-width="1.6" marker-end="url(#c1)"></line>
  <line x1="435" y1="145" x2="528" y2="145" stroke="#d6d9df" stroke-width="1.6" marker-end="url(#c1)"></line>
  <text x="237" y="135" fill="#8b909b" font-size="10" text-anchor="middle">prêt 1</text>
  <text x="482" y="135" fill="#8b909b" font-size="10" text-anchor="middle">prêt 2</text>
  <text x="360" y="232" fill="#d6d9df" font-size="12" text-anchor="middle">Un seul titre source, plusieurs créances garanties en cascade.</text>
  <text x="360" y="260" fill="#ff4d87" font-size="12" text-anchor="middle" font-weight="700">vélocité ≈ engagements garantis / collatéral source</text>
  <text x="360" y="284" fill="#8b909b" font-size="11" text-anchor="middle">Fin 2007 : environ 10 000 Md$ reçus, vélocité de l'ordre de 3.</text>
  <defs><marker id="c1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="#d6d9df"></path></marker></defs>
</svg>
<figcaption>Un même titre, remis puis remobilisé le long d'une chaîne, garantit plusieurs prêts à la fois. La vélocité du collatéral rapporte les engagements garantis au collatéral d'origine. Sources : FMI (Manmohan Singh), Réserve fédérale.</figcaption>
</figure>

## Quand la lubrification se grippe

Cette circulation n'est pas neutre pour la liquidité globale. Après la faillite de Lehman, deux choses se sont produites en même temps : le collatéral d'origine disponible a reculé, et la vélocité a baissé. L'effet combiné, selon le FMI, équivaut à une contraction du collatéral en circulation de l'ordre de **4 000** à **5 000 milliards** de dollars. Les régulations d'après-crise, en imposant aux grandes banques de réduire leur levier et de renforcer leurs fonds propres, ont rétréci l'espace de bilan que les dealers consacraient à faire circuler le collatéral. Moins d'espace de bilan, moins de réutilisation, moins de lubrification.

Le mouvement n'est pas à sens unique. À mesure que les banques centrales ont réduit leur bilan, libérant de l'espace chez les dealers, la réutilisation du collatéral est repartie à la hausse. C'est le même paramètre, l'espace de bilan des intermédiaires, qui commande le repo, le basis trade et le cross-currency basis. Le collatéral et le bilan bancaire sont les deux ressources rares autour desquelles tourne tout le système.

<figure class="infographic">
<svg viewBox="0 0 720 290" role="img" aria-label="Vélocité du collatéral selon les régimes : avant 2008, après Lehman, après le resserrement des bilans" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="290" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">La lubrification, selon les régimes</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Intensité de la réutilisation du collatéral. Repères qualitatifs. Source : FMI.</text>
  <text x="32" y="104" fill="#5eead4" font-size="12">AVANT 2008</text>
  <rect x="270" y="92" width="380" height="24" fill="#5eead4" opacity="0.85"></rect>
  <text x="32" y="122" fill="#8b909b" font-size="10"></text>
  <text x="270" y="138" fill="#8b909b" font-size="11">vélocité élevée, comparable à la circulation de la monnaie</text>
  <text x="32" y="168" fill="#ff4d87" font-size="12">APRÈS LEHMAN</text>
  <rect x="270" y="156" width="210" height="24" fill="#ff4d87" opacity="0.85"></rect>
  <text x="270" y="202" fill="#8b909b" font-size="11">chute du collatéral source et de la vélocité, environ 4 000 à 5 000 Md$ en moins</text>
  <text x="32" y="232" fill="#f5b13d" font-size="12">APRÈS LE RESSERREMENT DES BILANS</text>
  <rect x="270" y="220" width="300" height="24" fill="#f5b13d" opacity="0.8"></rect>
  <text x="270" y="266" fill="#8b909b" font-size="11">rebond, à mesure que l'espace de bilan des dealers se libère</text>
</svg>
<figcaption>La réutilisation du collatéral a reculé après 2008 sous l'effet des contraintes réglementaires de bilan, puis est repartie à la hausse à mesure que les banques centrales réduisaient leur empreinte. Source : FMI (Singh), travaux sur la vélocité du collatéral.</figcaption>
</figure>

## Le risque caché : les chaînes qui se figent

La réhypothécation crée de la liquidité, mais elle crée aussi une fragilité particulière. Le long d'une chaîne, un même titre apparaît comme actif et comme garantie en plusieurs points à la fois. Si un maillon fait défaut, tous les acteurs en aval découvrent que leur garantie est immobilisée ou contestée. C'est ce qui s'est produit en 2008, quand des clients de courtiers ont vu leur collatéral réhypothéqué bloqué dans la faillite, et de nouveau en 2011 lors de l'effondrement d'un courtier qui avait réutilisé des avoirs clients. Les chaînes longues maximisent la liquidité en temps calme, et la détruisent d'un coup en temps de crise.

S'ajoute un problème de mesure, central pour ce journal. Le même titre étant compté à plusieurs endroits, le levier réel du système est plus élevé qu'il n'y paraît, et difficile à reconstituer. Les statistiques de stabilité financière n'intègrent souvent ni le collatéral mis en pension ni sa réutilisation, si bien que le superviseur voit un stock, pas la cascade de créances qu'il garantit.

## La clé de voûte

Tout se rejoint ici. Le repo est l'opération par laquelle le collatéral circule. Le basis trade en empile plusieurs étages avec du levier. Le shadow banking en fait son carburant hors des banques. Les eurodollars étendent le mécanisme à la couche offshore du dollar. Et le cross-currency basis en affiche le prix quand l'accès se tend. Sous chacun de ces marchés, on retrouve le même geste élémentaire : un titre remis en garantie, puis réutilisé, encore et encore. La stabilité de l'ensemble dépend donc d'une variable que peu de tableaux de bord suivent vraiment, la vitesse à laquelle un stock fini de bons du Trésor se transforme en un volume bien plus grand de promesses. Rendre cette circulation visible, c'est rendre mesurable l'opacité même du système.

---

**Sources principales :** Fonds monétaire international, Manmohan Singh, « Velocity of Pledged Collateral: Analysis and Implications » (Working Paper 11/256, 2011), « Collateral Reuse and Balance Sheet Space » (WP 17/113, 2017), « Collateral and Financial Plumbing » (Risk Books) et, avec Goel, « The Pledged Collateral Market's Role in Transmission to Short-Term Market Rates » (2019) ; Singh et Aitken, « The Sizable Role of Rehypothecation in the Shadow Banking System » (2010) ; Réserve fédérale, FEDS Notes, « The Ins and Outs of Collateral Re-use » (2018, Infante, Press, Strauss) ; Pozsar et Singh, « The Nonbank-Bank Nexus and the Shadow Banking System ». Chiffres et repères vérifiés un à un.
