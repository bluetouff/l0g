---
title: "Lire les CLO et les prêts à effet de levier : tranches, cascade et vrais risques"
description: "Guide de référence sur les prêts à effet de levier et les CLO : la matière première (prêts syndiqués à taux variable, souvent cov-lite), la mécanique de la titrisation en tranches de l'AAA à l'equity, la cascade des paiements et les tests de protection, la distinction décisive avec les CDO subprime de 2008, les vrais risques (taux variable, faibles covenants, restructurations qui masquent les défauts), et la rivalité montante avec le crédit privé. Un marché de plus de 1 000 milliards de dollars, décodé."
summary: "Un prêt à effet de levier est un crédit syndiqué à taux variable consenti à une entreprise endettée, sous la catégorie investissement. Les CLO regroupent des centaines de ces prêts et émettent des tranches de risque échelonné, de l'AAA payée en premier à l'equity qui absorbe les premières pertes. Premier acheteur de ce marché de plus de 1 000 milliards de dollars, le CLO a mieux résisté que le CDO subprime en 2008, mais concentre le risque de crédit d'aujourd'hui. Le lire suppose de comprendre la cascade, les tests de surcollatéralisation, l'érosion des covenants et les restructurations qui masquent le vrai taux de défaut."
pubDate: 2026-07-11T14:00:00+02:00
updatedDate: 2026-07-11T14:00:00+02:00
tags: ["crédit", "titrisation", "marchés", "risque"]
category: marches
draft: false
---

*Il existe une machine qui transforme des prêts risqués à des entreprises endettées en obligations notées AAA, aussi sûres en apparence que la dette d'un État. Cette machine, le CLO, achète les deux tiers d'un marché de plus de 1 000 milliards de dollars, et on l'accuse régulièrement d'être le prochain 2008. L'accusation est en partie injuste, en partie méritée. Injuste, car le CLO a précisément traversé la crise de 2008 sans casse, là où son cousin le CDO subprime s'effondrait. Méritée, car il concentre aujourd'hui une part majeure du risque de crédit aux entreprises, dans un marché de plus en plus opaque. Ce guide sépare la légende de la mécanique.*

## Le prêt à effet de levier, la matière première

Tout commence par le [prêt à effet de levier](/glossaire/pret-a-effet-de-levier/), en anglais leveraged loan. C'est un crédit consenti à une entreprise déjà endettée, dont la note de crédit est inférieure à la catégorie investissement. Trois traits le définissent. Il est syndiqué : une banque l'arrange, puis en revend des parts à des investisseurs institutionnels. Il est senior et garanti : en cas de faillite, ses détenteurs sont remboursés avant les autres créanciers, sur le collatéral. Et il est à taux variable, indexé sur le [SOFR](/glossaire/sofr/) plus une marge, protégeant le prêteur d'une hausse des taux mais fragilisant l'emprunteur quand les taux montent.

Ces prêts financent l'économie du rachat : les [LBO](/glossaire/lbo/), les acquisitions, les refinancements. Le marché américain en compte pour environ 1 200 milliards de dollars. Une évolution lourde de conséquences l'a transformé : la quasi-disparition des covenants. Un prêt [cov-lite](/glossaire/cov-lite/), covenant-lite, n'impose plus à l'emprunteur de respecter des ratios financiers testés régulièrement. Devenus la norme, ces prêts laissent une entreprise s'enfoncer plus longtemps avant que le défaut ne soit constaté, au prix d'un recouvrement moindre pour les créanciers le jour venu.

## Le CLO, une usine à tranches

Seul, un prêt à effet de levier est illiquide et risqué. Regroupé avec des centaines d'autres dans un [CLO](/glossaire/clo/), il change de nature. Le CLO, pour Collateralized Loan Obligation, est un véhicule de [titrisation](/glossaire/titrisation/) : il achète un portefeuille de cent cinquante à trois cents prêts, et finance cet achat en émettant ses propres titres, répartis en tranches de risque croissant. C'est le premier acheteur du marché des prêts à effet de levier, dont il absorbe environ les deux tiers.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 340" role="img" aria-label="La structure en tranches d'un CLO, de l'AAA à l'equity" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="340" fill="#0c0d10"></rect>
  <text x="32" y="34" fill="#f5f6f8" font-size="17" font-weight="700">La cascade d'un CLO : des tranches empilées</text>
  <text x="32" y="55" fill="#8b909b" font-size="12">Les paiements descendent du haut, les pertes remontent du bas.</text>
  <rect x="230" y="80" width="300" height="90" fill="#5eead4" opacity="0.85"></rect>
  <text x="380" y="115" fill="#0c0d10" font-size="13" font-weight="700" text-anchor="middle">Senior AAA</text>
  <text x="380" y="135" fill="#0c0d10" font-size="11" text-anchor="middle">payée en premier, rendement le plus bas</text>
  <text x="380" y="152" fill="#0c0d10" font-size="11" text-anchor="middle">environ 60 % de la structure</text>
  <rect x="230" y="172" width="300" height="44" fill="#7aa2f7" opacity="0.85"></rect>
  <text x="380" y="192" fill="#0c0d10" font-size="12" font-weight="700" text-anchor="middle">Mezzanine AA-A</text>
  <text x="380" y="208" fill="#0c0d10" font-size="10.5" text-anchor="middle">rendement intermédiaire</text>
  <rect x="230" y="218" width="300" height="44" fill="#f5b13d" opacity="0.85"></rect>
  <text x="380" y="238" fill="#0c0d10" font-size="12" font-weight="700" text-anchor="middle">Junior BBB-BB</text>
  <text x="380" y="254" fill="#0c0d10" font-size="10.5" text-anchor="middle">plus risquée, mieux rémunérée</text>
  <rect x="230" y="264" width="300" height="46" fill="#ff4d87" opacity="0.9"></rect>
  <text x="380" y="284" fill="#0c0d10" font-size="12" font-weight="700" text-anchor="middle">Equity, première perte</text>
  <text x="380" y="300" fill="#0c0d10" font-size="10.5" text-anchor="middle">rendement le plus élevé, encaisse les défauts</text>
  <text x="120" y="150" fill="#5eead4" font-size="11" font-weight="700" text-anchor="middle">Paiements</text>
  <line x1="120" y1="160" x2="120" y2="270" stroke="#5eead4" stroke-width="2"></line>
  <polygon points="120,270 115,259 125,259" fill="#5eead4"></polygon>
  <text x="640" y="270" fill="#ff4d87" font-size="11" font-weight="700" text-anchor="middle">Pertes</text>
  <line x1="640" y1="260" x2="640" y2="150" stroke="#ff4d87" stroke-width="2"></line>
  <polygon points="640,150 635,161 645,161" fill="#ff4d87"></polygon>
  <text x="32" y="330" fill="#8b909b" font-size="11">Structure indicative. Sources : S&amp;P Global Ratings, Moody's.</text>
</svg>
<figcaption>Les flux des prêts remboursent d'abord la tranche <strong>senior AAA</strong>, puis descendent la cascade. Les défauts, eux, frappent d'abord l'<strong>equity</strong> en bas, qui protège les tranches supérieures en échange du rendement le plus élevé. Sources : S&P Global, Moody's.</figcaption>
</figure>

La magie apparente de la titrisation tient dans cette hiérarchie. Même si le portefeuille est composé de prêts risqués, la diversification et l'ordre de remboursement font que la tranche du haut ne subit de perte que si une fraction énorme des prêts fait défaut en même temps. D'où sa note AAA, alors qu'aucun des prêts sous-jacents ne la mériterait. La tranche [equity](/glossaire/tranche/), en bas, joue le rôle inverse : elle encaisse les premières pertes et absorbe le choc, en échange du rendement le plus élevé.

## La cascade et les tests de protection

Le cœur d'un CLO est sa cascade, l'ordre dans lequel l'argent circule. Chaque trimestre, les intérêts payés par les prêts remboursent d'abord les frais et la tranche senior, puis descendent tranche par tranche, l'equity ne touchant que le résidu. Les pertes suivent le chemin inverse, du bas vers le haut. Cette structure serait fragile sans garde-fous : les tests de surcollatéralisation.

Ces tests vérifient en permanence que la valeur des prêts dépasse suffisamment celle des tranches. Si trop de prêts sont dégradés ou font défaut, un test échoue, et la cascade se reconfigure automatiquement : l'argent qui allait à l'equity est détourné pour rembourser par anticipation la tranche senior, jusqu'à ce que le coussin soit reconstitué. Le gérant du CLO doit aussi respecter des limites, notamment un plafond de prêts notés CCC, souvent autour de 7,5 % du portefeuille. Au-delà, la surcharge en actifs très risqués déclenche elle aussi des mécanismes de protection. Le CLO est donc un véhicule activement géré et doté d'un pare-feu interne, deux traits qui le distinguent d'un simple panier statique.

## CLO n'est pas CDO : la leçon de 2008

C'est la confusion la plus répandue, et il faut la dissiper. Le [CDO](/glossaire/cdo/) qui a fait sauter le système en 2008 partageait la technique du CLO, la titrisation en tranches, mais pas sa matière première. Les CDO de la crise étaient adossés à des crédits hypothécaires subprime, fortement corrélés entre eux : quand l'immobilier américain a baissé, tous les prêts se sont dégradés ensemble, et la diversification n'a rien protégé. Pire, on avait re-titrisé des tranches de CDO dans d'autres CDO, empilant l'opacité et le levier.

Le CLO, lui, s'adosse à des prêts d'entreprises réparties dans des dizaines de secteurs, aux difficultés moins synchronisées. Résultat concret : pendant la crise de 2008, aucune tranche AAA de CLO n'a subi de perte, alors que les CDO subprime s'effondraient. Cette robustesse historique est réelle et mérite d'être rappelée face aux comparaisons hâtives. Elle a toutefois une limite : le passé ne garantit pas l'avenir, et un choc qui frapperait simultanément un grand nombre d'entreprises, une récession sévère ou une rupture technologique, testerait la diversification sur laquelle repose toute la confiance dans les tranches senior.

## Les vrais risques

Écarter la légende du nouveau subprime ne signifie pas que le CLO est sans danger. Ses risques sont simplement différents. Le premier tient au taux variable : les entreprises emprunteuses paient plus cher quand les taux montent, érodant leur capacité de remboursement au pire moment. Le deuxième est l'érosion des covenants : la norme cov-lite retarde le constat de défaut et abaisse le recouvrement. Le troisième est le plus insidieux, et il brouille la lecture même du risque.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 290" role="img" aria-label="Le taux de défaut classique sous-estime le stress du crédit" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="290" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Le défaut ne dit plus tout</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Pourquoi le taux de défaut classique sous-estime le stress du crédit, 2025-2026.</text>
  <line x1="40" y1="78" x2="680" y2="78" stroke="#2a2c33" stroke-width="1"></line>
  <text x="40" y="108" fill="#d6d9df" font-size="12.5">Taux de défaut de paiement</text>
  <text x="330" y="112" fill="#5eead4" font-size="20" font-weight="700">~1,2 %</text>
  <text x="470" y="108" fill="#8b909b" font-size="11.5">le chiffre rassurant (fin 2025)</text>
  <line x1="40" y1="126" x2="680" y2="126" stroke="#2a2c33" stroke-width="1"></line>
  <text x="40" y="156" fill="#d6d9df" font-size="12.5">Part des restructurations (LME)</text>
  <text x="330" y="160" fill="#ff4d87" font-size="20" font-weight="700">~2/3</text>
  <text x="470" y="156" fill="#8b909b" font-size="11.5" textLength="244" lengthAdjust="spacingAndGlyphs">de l'activité de défaut par émetteur</text>
  <line x1="40" y1="174" x2="680" y2="174" stroke="#2a2c33" stroke-width="1"></line>
  <text x="40" y="204" fill="#d6d9df" font-size="12.5">Recouvrement (cov-lite)</text>
  <text x="330" y="208" fill="#f5b13d" font-size="15" font-weight="700">en baisse</text>
  <text x="470" y="204" fill="#8b909b" font-size="11.5" textLength="244" lengthAdjust="spacingAndGlyphs">moins de protection, moins récupéré</text>
  <line x1="40" y1="222" x2="680" y2="222" stroke="#2a2c33" stroke-width="1"></line>
  <text x="40" y="252" fill="#d6d9df" font-size="12.5">Plafond de prêts CCC</text>
  <text x="330" y="256" fill="#7aa2f7" font-size="15" font-weight="700">~7,5 %</text>
  <text x="470" y="252" fill="#8b909b" font-size="11.5" textLength="244" lengthAdjust="spacingAndGlyphs">au-delà, les protections se déclenchent</text>
  <text x="32" y="282" fill="#8b909b" font-size="11">Sources : S&amp;P Global Ratings, Moody's, PineBridge.</text>
</svg>
<figcaption>Le taux de défaut affiché, autour de <strong>1,2 %</strong>, paraît anodin. Mais les <strong>restructurations négociées</strong> (LME), qui repoussent le défaut sans l'éviter, forment aujourd'hui les deux tiers de l'activité de détresse. Le chiffre rassurant masque un stress bien réel. Sources : S&P Global, Moody's.</figcaption>
</figure>

Ce troisième risque est celui des [restructurations négociées](/glossaire/lme/), ou LME, pour liability management exercises. Plutôt que de faire défaut ouvertement, une entreprise en difficulté échange sa dette, étend ses maturités ou apporte du collatéral à certains créanciers au détriment des autres. Le taux de défaut classique reste ainsi trompeusement bas, autour de 1,2 % fin 2025, alors que ces manœuvres représentent désormais l'essentiel de l'activité de détresse. La statistique la plus regardée sous-estime donc le stress réel du crédit à effet de levier. Un CLO peut afficher peu de défauts tout en détenant des prêts en voie de restructuration silencieuse.

## La rivalité avec le crédit privé

Le marché des prêts à effet de levier, dit syndiqué ou BSL, ne vit plus seul. Il affronte désormais le [crédit privé](/guides/analyser-credit-prive/), c'est-à-dire les prêts directs consentis par des fonds sans passer par la syndication bancaire. Ce concurrent, longtemps cantonné aux entreprises moyennes, a grossi jusqu'à rivaliser en taille avec le marché syndiqué, et les CLO adossés à ces prêts directs (les middle-market CLO) sont le segment qui croît le plus vite.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 300" role="img" aria-label="Tailles des marchés du crédit à effet de levier" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="300" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Un marché de plus de 1 000 milliards, et un rival</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Tailles indicatives des marchés du crédit à effet de levier, 2025-2026.</text>
  <text x="40" y="90" fill="#d6d9df" font-size="12">Prêts à effet de levier syndiqués (BSL)</text>
  <rect x="40" y="100" width="600" height="20" fill="#2a2c33"></rect>
  <rect x="40" y="100" width="600" height="20" fill="#5eead4" opacity="0.9"></rect>
  <text x="560" y="115" fill="#0c0d10" font-size="11" font-weight="700" text-anchor="end">~1 200 Md$</text>
  <text x="40" y="140" fill="#d6d9df" font-size="12">CLO adossés au BSL</text>
  <rect x="40" y="150" width="600" height="20" fill="#2a2c33"></rect>
  <rect x="40" y="150" width="315" height="20" fill="#7aa2f7" opacity="0.9"></rect>
  <text x="363" y="165" fill="#7aa2f7" font-size="11" font-weight="700">plus de 600 Md$</text>
  <text x="40" y="190" fill="#d6d9df" font-size="12">Crédit privé / prêts directs</text>
  <rect x="40" y="200" width="600" height="20" fill="#2a2c33"></rect>
  <rect x="40" y="200" width="560" height="20" fill="#f5b13d" opacity="0.9"></rect>
  <text x="520" y="215" fill="#0c0d10" font-size="11" font-weight="700" text-anchor="end">comparable au BSL</text>
  <text x="40" y="240" fill="#d6d9df" font-size="12">CLO middle-market</text>
  <rect x="40" y="250" width="600" height="20" fill="#2a2c33"></rect>
  <rect x="40" y="250" width="80" height="20" fill="#ff4d87" opacity="0.9"></rect>
  <text x="128" y="265" fill="#ff4d87" font-size="11" font-weight="700">~150 Md$, en forte croissance</text>
  <text x="32" y="292" fill="#8b909b" font-size="11">Sources : Moody's, S&amp;P Global, PitchBook. Ordres de grandeur.</text>
</svg>
<figcaption>Le marché syndiqué reste le plus gros, mais le <strong>crédit privé</strong> a atteint une taille comparable, et les <strong>CLO middle-market</strong> adossés aux prêts directs sont le segment le plus dynamique. La concurrence pour les bons dossiers assouplit les conditions partout. Sources : Moody's, S&P Global, PitchBook.</figcaption>
</figure>

Cette rivalité a un effet pervers. Pour gagner les meilleurs emprunteurs, syndiqué et privé se livrent une surenchère de souplesse : covenants encore plus légers, intérêts payés en nature plutôt qu'en cash (le PIK), documentation plus permissive. Le risque ne disparaît pas, il se déplace et se dissimule. Nous avons exploré la face privée de cette dynamique dans notre article sur [le crédit privé et ses deux prix](/posts/credit-prive-un-actif-deux-prix/) et notre [guide du crédit privé](/guides/analyser-credit-prive/). Le CLO et le fonds de dette privée sont les deux versants d'une même montagne de dette d'entreprise à effet de levier.

## Lire un CLO en pratique

Pour juger un CLO, plusieurs cadrans se combinent. Le prix des prêts sous-jacents sur le marché secondaire, suivi par des indices comme le Morningstar LSTA, donne le sentiment général sur le crédit à effet de levier. Le coussin des tests de surcollatéralisation dit la marge avant qu'une tranche ne soit affectée. La part de prêts notés CCC signale la dérive de qualité du portefeuille. La proportion de prêts cov-lite mesure la faiblesse des protections. Et surtout, il faut lire le taux de défaut avec le taux de restructuration, car le premier seul ment désormais par omission. La qualité du gérant, enfin, compte, puisque c'est lui qui arbitre le portefeuille en cas de stress.

Une conclusion équilibrée s'impose. Le CLO n'est pas le CDO de 2008, et le répéter est un service rendu à la vérité. Mais il concentre le risque de crédit d'un cycle d'endettement d'entreprise sans précédent, dans des structures que peu d'investisseurs finaux comprennent vraiment, et sur un marché où la statistique reine, le taux de défaut, est devenue trompeuse. La solidité passée des tranches senior est un fait ; la fragilité croissante de la matière première en est un autre. Lire un CLO, c'est tenir les deux à la fois.

## Sources et pour aller plus loin

- [Moody's Ratings, perspectives 2026 sur la finance à effet de levier et les CLO](https://www.moodys.com/web/en/us/insights/credit-risk/outlooks/global-leveraged-finance-and-clos.html) : tailles de marché, émission et tendances de défaut.
- [S&P Global Ratings, mise à jour trimestrielle sur la finance à effet de levier américaine](https://www.spglobal.com/ratings/en/regulatory/article/us-leveraged-finance-q1-2026-update-encouraging-discipline-in-recent-deals-lingering-default-risk-in-legacy-vintages-s101683653) : discipline des dossiers récents et risque des millésimes anciens.
- [PineBridge Investments, « 2026 Leveraged Finance Outlook »](https://www.pinebridge.com/en/insights/2026-leveraged-finance-outlook) : la place des restructurations (LME) dans l'activité de défaut.
- [Congressional Research Service, « Leveraged Loans and Collateralized Loan Obligations »](https://www.congress.gov/crs_external_products/IN/PDF/IN11421/IN11421.2.pdf) : mécanique et enjeux de stabilité financière.
- l0g, [Crédit privé : un actif, deux prix](/posts/credit-prive-un-actif-deux-prix/) et [La contagion silencieuse du crédit privé](/posts/la-contagion-silencieuse-credit-prive/).
- Guides liés : [Comment lire le crédit privé](/guides/analyser-credit-prive/) et [Lire les spreads de crédit](/guides/lire-les-spreads-de-credit/).
</content>
