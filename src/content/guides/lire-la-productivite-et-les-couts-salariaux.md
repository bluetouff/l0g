---
title: "Productivité : capital, travail et coûts salariaux"
description: "Comprendre la production par heure, la productivité globale et les coûts salariaux unitaires. Méthode, exemple calculé et limites des comparaisons."
summary: "La productivité du travail rapporte une production réelle aux heures travaillées. Elle dépend de l’équipement, des compétences, de l’organisation et de la composition de l’activité. Le coût salarial unitaire rapporte la rémunération totale à cette production."
pubDate: 2026-10-19T10:40:00+02:00
tags: ["macro", "productivité", "salaires", "croissance"]
category: macro
draft: false
---

Une hausse de production peut venir d’heures supplémentaires, d’un nouvel équipement ou d’une meilleure organisation. La productivité commence par séparer la quantité produite de la quantité de ressources employées, puis pose une question plus exigeante : quels changements ont permis d’obtenir ce résultat ? Cette distinction relie les statistiques de croissance aux conditions concrètes de production.

Le guide utilise les méthodes du BLS et de l’OCDE, complétées par la recherche de Chad Syverson. Ses exemples sont **hypothétiques** et comparent deux périodes de même durée. Les unités physiques permettent d’isoler le raisonnement ; dans les comptes nationaux, la production réelle résulte d’un travail de mesure des prix et de la qualité.

## Rapporter la production aux heures travaillées

La **productivité du travail** s’écrit production réelle / heures travaillées. Un effectif mesure des personnes, tandis que les heures tiennent compte de leur durée de travail. Le choix du numérateur importe autant : la production brute d’une branche, sa valeur ajoutée et le PIB d’une économie couvrent des périmètres différents. Le [BLS explicite ces concepts](https://www.bls.gov/opub/hom/msp/concepts.htm).

Supposons une activité homogène produisant **100 unités avec 1 000 heures**, soit 0,10 unité par heure. À la période suivante, elle produit **110 unités avec les mêmes 1 000 heures** : la productivité passe à 0,11, en hausse de **10 %**. Ces données établissent le gain mesuré, mais leur lecture économique demande encore d’identifier les moyens mobilisés pour l’obtenir.

Une nouvelle machine, une meilleure planification, une hausse du taux d’utilisation ou un changement de qualification des salariés peuvent contribuer à cette évolution. Le [manuel de l’OCDE](https://www.oecd.org/content/dam/oecd/en/publications/reports/2001/07/measuring-productivity-oecd-manual_g1gh2484/9789264194519-en.pdf) distingue précisément les mesures à un facteur et celles qui prennent en compte plusieurs facteurs de production.

## Distinguer équipement et efficacité globale

Quand chaque heure de travail dispose de davantage de services fournis par le capital, la productivité du travail peut augmenter. Une machine plus rapide, un logiciel ou un bâtiment mieux adapté apportent des services productifs dont la mesure diffère de leur valeur de revente. La notion de **services du capital** cherche à représenter leur contribution à la production pendant une période. [OCDE, manuel sur le capital](https://www.oecd.org/en/publications/measuring-capital-oecd-manual_9789264193260-en.html).

La **productivité globale des facteurs**, ou PGF, mesure un résidu après prise en compte des intrants retenus et de leurs pondérations. Selon le cadre, ceux-ci comprennent capital, travail et consommations intermédiaires. Le résidu peut incorporer progrès technique, organisation, utilisation des capacités et erreurs de mesure. Sa composition dépend du modèle et des données ; l’interpréter comme une mesure directe de l’innovation demanderait des preuves supplémentaires. Les [méthodes de calcul du BLS](https://www.bls.gov/opub/hom/msp/calculation.htm) exposent les indices et pondérations utilisés.

Dans une décomposition pédagogique de la valeur ajoutée, la croissance de la PGF correspond à la croissance de la production diminuée des croissances pondérées du capital et du travail. Il faut préciser la mesure de croissance, les parts de coûts et les hypothèses de la décomposition. Ce cadre organise les contributions ; l’identification d’une cause exige une analyse plus détaillée des entreprises ou des secteurs.

## Calculer le coût salarial par unité produite

Le **coût salarial unitaire**, ou CSU, rapporte la rémunération totale du travail à la production réelle. Il s’écrit aussi rémunération horaire / productivité du travail. La rémunération doit inclure les composantes du coût du travail retenues par la source, et pas seulement le salaire net reçu par le salarié. Le [BLS donne cette relation et ses conventions](https://www.bls.gov/opub/hom/opt/calculation.htm).

Dans notre activité, une rémunération horaire totale de **20 u.m.** représente **20 000 u.m.** pour 1 000 heures et un coût de **200 u.m. par unité** produite. À la seconde période, la rémunération horaire atteint **21 u.m.**, soit +5 %, et la production 110 unités. La masse de rémunération vaut 21 000 u.m. ; le coût unitaire devient **190,91 u.m.**, arrondi au centième.

Le calcul exact de sa variation est **1,05 / 1,10 − 1 = −4,55 %**, après arrondi. Soustraire 10 % à 5 % donnerait une approximation de −5 %. La figure montre successivement l’effet de la rémunération, à productivité inchangée, puis celui de la production par heure, à rémunération horaire fixée.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 365" role="img" aria-labelledby="premium-productivity-fr-title premium-productivity-fr-desc" style="display:block;width:100%;max-width:600px;height:auto;margin-inline:auto;font-family:var(--font-read);background:var(--color-surface);border:1px solid var(--color-line);border-radius:12px">
<title id="premium-productivity-fr-title">Rémunération et productivité</title>
<desc id="premium-productivity-fr-desc">Exemple hypothétique, périodes de même durée. Courbe grise : rémunération horaire d’indice 100 ; verte : 105. CSU = rémunération horaire / productivité × 100. Le trajet A→B→C sépare les deux effets ; axes en indices, agrandis autour de 100. Calculs l0g.</desc>
<text x="24" y="32" fill="var(--color-bright)" font-size="22" text-anchor="start" font-weight="700">Rémunération et productivité</text>
<text x="24" y="56" fill="var(--color-muted)" font-size="14" text-anchor="start">Le coût par unité dépend du rapport des deux</text>
<line x1="60" y1="270" x2="420" y2="270" stroke="var(--color-line)" stroke-width="1"/>
<text x="49" y="275" fill="var(--color-muted)" font-size="14" text-anchor="end">80</text>
<line x1="60" y1="226.25" x2="420" y2="226.25" stroke="var(--color-line)" stroke-width="1"/>
<text x="49" y="231.25" fill="var(--color-muted)" font-size="14" text-anchor="end">90</text>
<line x1="60" y1="182.5" x2="420" y2="182.5" stroke="var(--color-line)" stroke-width="1"/>
<text x="49" y="187.5" fill="var(--color-muted)" font-size="14" text-anchor="end">100</text>
<line x1="60" y1="138.75" x2="420" y2="138.75" stroke="var(--color-line)" stroke-width="1"/>
<text x="49" y="143.75" fill="var(--color-muted)" font-size="14" text-anchor="end">110</text>
<line x1="60" y1="95" x2="420" y2="95" stroke="var(--color-line)" stroke-width="1"/>
<text x="49" y="100" fill="var(--color-muted)" font-size="14" text-anchor="end">120</text>
<text x="60" y="291" fill="var(--color-muted)" font-size="14" text-anchor="middle">90</text>
<text x="180" y="291" fill="var(--color-muted)" font-size="14" text-anchor="middle">100</text>
<text x="300" y="291" fill="var(--color-muted)" font-size="14" text-anchor="middle">110</text>
<text x="420" y="291" fill="var(--color-muted)" font-size="14" text-anchor="middle">120</text>
<line x1="60" y1="90" x2="60" y2="270" stroke="var(--color-muted)" stroke-width="1"/>
<line x1="60" y1="270" x2="420" y2="270" stroke="var(--color-muted)" stroke-width="1"/>
<path d="M 60 133.889 L 66 136.575 L 72 139.231 L 78 141.858 L 84 144.457 L 90 147.027 L 96 149.57 L 102 152.086 L 108 154.574 L 114 157.037 L 120 159.474 L 126 161.885 L 132 164.271 L 138 166.632 L 144 168.969 L 150 171.282 L 156 173.571 L 162 175.838 L 168 178.081 L 174 180.302 L 180 182.5 L 186 184.677 L 192 186.832 L 198 188.966 L 204 191.078 L 210 193.171 L 216 195.243 L 222 197.295 L 228 199.327 L 234 201.34 L 240 203.333 L 246 205.308 L 252 207.264 L 258 209.202 L 264 211.121 L 270 213.023 L 276 214.907 L 282 216.774 L 288 218.624 L 294 220.457 L 300 222.273 L 306 224.072 L 312 225.856 L 318 227.623 L 324 229.375 L 330 231.111 L 336 232.832 L 342 234.537 L 348 236.228 L 354 237.904 L 360 239.565 L 366 241.212 L 372 242.845 L 378 244.464 L 384 246.068 L 390 247.66 L 396 249.237 L 402 250.802 L 408 252.353 L 414 253.891 L 420 255.417" fill="none" stroke="var(--color-muted)" stroke-width="2.5"/>
<path d="M 60 109.583 L 66 112.403 L 72 115.192 L 78 117.951 L 84 120.679 L 90 123.378 L 96 126.048 L 102 128.69 L 108 131.303 L 114 133.889 L 120 136.447 L 126 138.979 L 132 141.484 L 138 143.964 L 144 146.418 L 150 148.846 L 156 151.25 L 162 153.629 L 168 155.985 L 174 158.317 L 180 160.625 L 186 162.91 L 192 165.173 L 198 167.414 L 204 169.632 L 210 171.829 L 216 174.005 L 222 176.159 L 228 178.293 L 234 180.407 L 240 182.5 L 246 184.573 L 252 186.627 L 258 188.662 L 264 190.678 L 270 192.674 L 276 194.653 L 282 196.613 L 288 198.555 L 294 200.479 L 300 202.386 L 306 204.276 L 312 206.149 L 318 208.004 L 324 209.844 L 330 211.667 L 336 213.473 L 342 215.264 L 348 217.039 L 354 218.799 L 360 220.543 L 366 222.273 L 372 223.987 L 378 225.687 L 384 227.372 L 390 229.043 L 396 230.699 L 402 232.342 L 408 233.971 L 414 235.586 L 420 237.188" fill="none" stroke="var(--color-signal)" stroke-width="2.5"/>
<line x1="180" y1="182.5" x2="180" y2="160.625" stroke="var(--color-accent)" stroke-width="2"/><polygon points="180,160.625 176,167.625 184,167.625" fill="var(--color-accent)"/>
<line x1="180" y1="160.625" x2="300" y2="202.386" stroke="var(--color-signal)" stroke-width="2"/><polygon points="300,202.386 294.704,196.308 292.074,203.863" fill="var(--color-signal)"/>
<circle cx="180" cy="182.5" r="4" fill="var(--color-muted)"/>
<text x="168" y="202.5" fill="var(--color-muted)" font-size="15" text-anchor="end" font-weight="700">A · 100</text>
<circle cx="180" cy="160.625" r="4" fill="var(--color-accent)"/>
<text x="180" y="145.625" fill="var(--color-accent)" font-size="15" text-anchor="start" font-weight="700">B · 105</text>
<circle cx="300" cy="202.386" r="4" fill="var(--color-signal)"/>
<text x="315" y="184.386" fill="var(--color-signal)" font-size="15" text-anchor="start" font-weight="700">C · 95,45</text>
<text x="24" y="79" fill="var(--color-paper)" font-size="15" text-anchor="start">CSU · base 100</text>
<text x="240" y="316" fill="var(--color-paper)" font-size="16" text-anchor="middle">Productivité · base 100</text>
<text x="24" y="344" fill="var(--color-muted)" font-size="14" text-anchor="start">A→B : rémun. +5 %   B→C : productivité +10 %</text>
</svg>
<figcaption>Exemple hypothétique, périodes de même durée. Courbe grise : rémunération horaire d’indice 100 ; verte : 105. CSU = rémunération horaire / productivité × 100. Le trajet A→B→C sépare les deux effets ; axes en indices, agrandis autour de 100. Calculs l0g. <a href="https://www.bls.gov/opub/hom/opt/calculation.htm">Formule : BLS</a>.</figcaption>
</figure>

Ce résultat laisse ouvertes plusieurs décisions : préserver les marges, réduire certains prix, augmenter d’autres dépenses ou investir. Le CSU isole le coût du travail par unité ; énergie, matières premières, financement, concurrence et politique de marge interviennent également dans la formation des prix. Pour relier cette mesure à l’inflation observée, confrontez-la aux [prix à la consommation](/guides/lire-le-cpi-inflation-us/) et au [PCE](/guides/lire-le-pce-inflation-fed/) en respectant leurs périmètres.

## Repérer les effets de composition

Une moyenne peut progresser alors que la productivité reste stable à l’intérieur de chaque activité. Imaginons deux ateliers fabriquant un produit comparable : A produit 10 unités par heure et B en produit 20. Avec 50 heures chacun, ils réalisent 1 500 unités en 100 heures, soit 15 unités par heure. Si les heures passent à 25 pour A et 75 pour B, la production atteint 1 750 unités et la moyenne 17,5, sans gain technique dans les ateliers.

Cette hausse de **16,67 %**, arrondie, vient entièrement de la réallocation des heures. Dans une économie réelle, les mesures de volume et les périmètres sont plus complexes, mais l’exemple explique pourquoi une variation agrégée doit être rapprochée des évolutions sectorielles. Le [travail de Syverson sur les déterminants de la productivité](https://pubs.aeaweb.org/doi/10.1257/jel.49.2.326), publié dans le *Journal of Economic Literature* en 2011, examine notamment l’hétérogénéité des producteurs et les mécanismes internes et externes associés à leurs performances.

Pour tester une explication, cherchez une mesure correspondant au mécanisme proposé : équipement effectivement utilisé, compétences, pratiques de gestion, réallocation ou entrée de producteurs. Une corrélation entre investissement informatique et productivité peut orienter la recherche ; elle laisse encore à traiter la sélection des entreprises, les délais d’apprentissage et les changements simultanés d’organisation.

## Lire ensemble salaires réels et productivité

Comparer salaire réel et productivité suppose de conserver population, heures et déflateurs compatibles. Le salaire médian d’un groupe de salariés, la rémunération moyenne de l’ensemble du travail et la rémunération réelle corrigée des prix de consommation répondent à des questions différentes. La valeur ajoutée réelle utilise, elle, un déflateur de production.

Pour une lecture de la répartition, calculez la part du travail dans la valeur ajoutée nominale avec un périmètre cohérent. Pour une lecture du pouvoir d’achat, utilisez un indice de prix pertinent pour les ménages. Cette séparation aide à expliquer comment plusieurs évolutions peuvent coexister sans contradiction. Les conventions de rémunération et de part du travail figurent dans les [formules du BLS](https://www.bls.gov/opub/hom/msp/calculation.htm).

## Sources et limites

Conservez, pour chaque série, la production mesurée, les heures, les intrants, le déflateur, la période et la date de révision. Les publications trimestrielles peuvent utiliser des rythmes annualisés, à distinguer du glissement annuel et de la moyenne annuelle comme dans le [guide du PIB](/guides/lire-le-pib-croissance-contributions-revisions/). Les exemples de ce guide expliquent des identités et des effets de composition ; ils n’estiment ni le potentiel de croissance d’un pays, ni l’effet causal d’une technologie.
