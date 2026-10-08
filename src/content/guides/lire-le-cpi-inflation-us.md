---
title: "Lire le CPI : l'inflation américaine, mesure par mesure"
description: "Lire le CPI américain : séries, ajustement saisonnier, pondérations, inflation sous-jacente, loyers, effets de base et différence avec le PCE."
summary: "Le CPI mesure les variations des prix payés par une population définie pour ses biens et services de consommation. Sa lecture exige de préciser la population, le panier, le mois observé et l'ajustement saisonnier. Inflation totale et sous-jacente, variation mensuelle et annuelle répondent à des questions distinctes. L'objectif d'inflation de la Fed utilise le PCE."
pubDate: 2026-06-29T18:00:00+02:00
updatedDate: 2026-10-08T20:00:00+02:00
tags: ["macro", "inflation", "banques centrales"]
category: macro
draft: false
---

Le taux annuel peut ralentir alors que la hausse mensuelle accélère. Les ménages peuvent subir des prix toujours croissants pendant que les titres annoncent une inflation en baisse. La période de comparaison et le panier expliquent souvent cette apparente contradiction.

Le point de départ est la [publication du Bureau of Labor Statistics](https://www.bls.gov/news.release/cpi.nr0.htm), puis les en-têtes des tableaux. Ce guide décrit une méthode de lecture réutilisable, sans présenter un ancien mois comme le dernier chiffre connu.

## Choisir la bonne série

Le CPI-U couvre les consommateurs urbains. Le CPI-W vise le groupe plus restreint des salariés urbains relevant de ses critères. Le C-CPI-U chaîné couvre la population du CPI-U, tient aussi compte des substitutions entre catégories de dépenses et fait l'objet de révisions. Le [BLS explique ces différences](https://www.bls.gov/cpi/questions-and-answers.htm).

L'indicateur national le plus cité est le CPI-U tous postes pour la moyenne urbaine américaine. Un agrégat ne décrit pas le budget de chaque ménage : locataire, propriétaire ou automobiliste ne subissent pas les mêmes pondérations.

Le niveau de l'indice se distingue du taux d'inflation. Une variation en pourcentage se calcule en divisant l'indice final par l'indice initial, en retranchant un, puis en multipliant par 100. La série et l'ajustement doivent rester identiques aux deux extrémités. Une hausse moins rapide ne signifie pas un retour des prix à leur niveau antérieur.

## Séparer variation mensuelle et annuelle

Pour la dynamique récente, la variation mensuelle publiée est corrigée des variations saisonnières. Le taux sur douze mois habituellement cité ne l'est pas. Ces conventions doivent rester visibles dans un graphique ou une citation. Le [BLS détaille l'ajustement saisonnier](https://www.bls.gov/cpi/seasonal-adjustment/questions-and-answers.htm).

La comparaison annuelle évolue lorsqu'un nouveau mois entre dans la fenêtre et que celui d'un an auparavant en sort. Cet effet de base peut faire bouger le taux annuel sans changement spectaculaire du dernier mois. Il faut regarder les deux extrémités avant de qualifier une accélération ou un retournement.

Les séries corrigées des variations saisonnières peuvent être révisées lors du recalcul des facteurs saisonniers. Pour décrire ce que l'on savait à une date passée, conserver la version de publication évite de lui substituer silencieusement une série révisée.

## Inflation totale et sous-jacente

Le CPI total inclut tous les postes. Le CPI sous-jacent exclut l'alimentation et l'énergie, dont les variations peuvent masquer celles d'autres composantes. Il conserve le logement. Il s'agit d'un sous-ensemble analytique, et non du budget complet des ménages. Ces [définitions viennent du BLS](https://www.bls.gov/cpi/questions-and-answers.htm).

<figure class="infographic" style="padding-bottom:1.75rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360" role="img" aria-label="Périmètre du CPI total et sous-jacent, sans proportion de poids." style="width:100%;height:auto;font-family:ui-sans-serif,system-ui,sans-serif">
  <rect width="600" height="360" rx="16" fill="var(--color-ink, #0c0d10)" />
  <rect x="22" y="22" width="556" height="296" rx="12" fill="none" stroke="var(--color-muted, #8b909b)" stroke-width="2" />
  <text x="44" y="56" fill="var(--color-bright, #f5f6f8)" font-size="25" font-weight="700">CPI total · tous les postes</text>
  <rect x="44" y="78" width="245" height="56" rx="8" fill="var(--color-amber, #f5b13d)" fill-opacity="0.14" />
  <text x="166" y="114" text-anchor="middle" fill="var(--color-bright, #f5f6f8)" font-size="23">Alimentation</text>
  <rect x="307" y="78" width="249" height="56" rx="8" fill="var(--color-amber, #f5b13d)" fill-opacity="0.14" />
  <text x="431" y="114" text-anchor="middle" fill="var(--color-bright, #f5f6f8)" font-size="23">Énergie</text>
  <rect x="44" y="152" width="512" height="144" rx="8" fill="var(--color-signal, #5eead4)" fill-opacity="0.07" stroke="var(--color-signal, #5eead4)" stroke-width="2" />
  <text x="64" y="185" fill="var(--color-bright, #f5f6f8)" font-size="24" font-weight="700">CPI sous-jacent</text>
  <text x="64" y="217" fill="var(--color-bright, #f5f6f8)" font-size="20">Logement + autres services</text>
  <text x="64" y="246" fill="var(--color-bright, #f5f6f8)" font-size="20">+ biens hors alimentation et énergie</text>
  <text x="64" y="279" fill="var(--color-muted, #8b909b)" font-size="17">Le logement reste dans le sous-jacent.</text>
  <text x="24" y="343" fill="var(--color-muted, #8b909b)" font-size="17">Définitions BLS · surfaces sans proportion de poids</text>
</svg>

<figcaption>Les surfaces représentent les périmètres, sans reproduire les pondérations. Le sous-jacent exclut alimentation et énergie, et conserve le logement. Source : <a href="https://www.bls.gov/cpi/questions-and-answers.htm">définitions du BLS</a>.</figcaption>

</figure>

Le terme « supercore » demande une définition explicite. Plusieurs paniers peuvent être désignés ainsi. Exclure le logement n'exclut pas automatiquement tous les services énergétiques ; une mesure de services issue du CPI ne se confond pas non plus avec celle du PCE. Il faut citer la série ou le calcul effectivement utilisé.

## Pondération et contribution

La variation du prix d'une composante n'est pas sa contribution à l'inflation totale. Une forte hausse dans une petite catégorie peut peser moins qu'une hausse modeste dans une catégorie importante. Il faut rapprocher variations et poids sur la même période.

Le BLS publie les [pondérations et importances relatives](https://www.bls.gov/cpi/tables/relative-importance/). Les poids de dépenses sont actualisés et les importances relatives changent aussi avec les prix des composantes. Une part prélevée dans un ancien tableau ne constitue donc pas une caractéristique permanente du panier.

La construction du CPI ne se réduit pas à une liste de courses immuable. La [méthode du BLS](https://www.bls.gov/opub/hom/cpi/calculation.htm) utilise différentes formules selon les niveaux, dont des moyennes géométriques pour la plupart des indices élémentaires. Multiplier des chiffres arrondis ne suffit pas à reconstituer exactement les contributions publiées.

## Le logement est un service de consommation

L'indice des loyers suit ceux des locataires. Le loyer équivalent des propriétaires, ou OER, estime la valeur locative du service de logement consommé par les propriétaires. Il n'intègre directement ni le prix d'achat du logement ni leur mensualité de crédit. Le [BLS expose cette méthode](https://www.bls.gov/cpi/factsheets/owners-equivalent-rent-and-rent.htm).

La variation de l'OER est calculée à partir des loyers observés dans l'échantillon locatif. Elle ne repose pas sur une nouvelle estimation demandée chaque mois aux propriétaires. Leurs réponses dans l'enquête de dépenses interviennent dans les pondérations, une autre étape du calcul.

Les baux existants et le calendrier de collecte expliquent que le CPI logement puisse diverger des loyers affichés pour les nouveaux locataires. Cet écart n'établit pas un délai fixe de transmission. Il faut préciser si l'on cherche à mesurer les loyers payés dans l'ensemble du parc ou les conditions rencontrées lors d'une nouvelle location.

## Le PCE et l'objectif de la Fed

L'objectif d'inflation de **2 %** à long terme de la Fed porte sur la variation annuelle de l'indice des prix **PCE**, selon son [explication officielle](https://www.federalreserve.gov/faqs/economy_14400.htm). Le PCE sous-jacent sert à analyser la tendance, mais l'objectif lui-même concerne le PCE total.

CPI et PCE diffèrent par leur couverture, leurs poids et leurs formules. Le PCE inclut certaines dépenses effectuées pour le compte des ménages, notamment de santé ; le CPI suit les dépenses directement supportées dans son périmètre. Le [BEA décrit ces différences](https://www.bea.gov/help/faq/555). Notre [guide de lecture du PCE](/guides/lire-le-pce-inflation-fed/) prolonge cette comparaison.

## Conserver une lecture vérifiable

Pour chaque publication, noter le mois observé, la date de parution, la population, le panier et l'ajustement. Expliquer les composantes qui portent le mouvement avec les pondérations correspondantes. Vérifier les révisions et les avis sur la collecte avant d'interpréter une observation inhabituelle.

Le CPI reste une estimation statistique. Les [estimations de variance du BLS](https://www.bls.gov/cpi/tables/variance-estimates/home.htm) dépendent de la série et de la période : un intervalle de confiance générique ne convient pas à toutes les publications. Un petit écart à une prévision ne constitue pas une certitude sur l'économie.

## Sources et révision

La révision du 8 octobre 2026 remplace des pondérations insuffisamment datées et un cas mensuel ancien par cette méthode de lecture. Elle précise l'OER, l'objectif PCE et les limites du terme « supercore ». Les sources directement liées sont les méthodes et tableaux du BLS, les explications du BEA et l'objectif publié par la Fed.
