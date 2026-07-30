---
title: "Le péage du Trésor : qui contrôlera le clearing ?"
description: "Le clearing obligatoire des Treasuries réduit le risque bilatéral, mais déplace la marge, la liquidité et l'accès vers quelques intermédiaires critiques."
pubDate: 2026-07-30T19:20:00+02:00
updatedDate: 2026-07-30T19:20:00+02:00
tags: ["treasuries", "clearing", "ficc", "liquidité", "collatéral", "régulation", "risque systémique"]
draft: false
---

*À partir du 31 décembre 2026, une partie supplémentaire des transactions au comptant sur les Treasuries devra passer par une chambre de compensation. Le repo suivra le 30 juin 2027. La réforme promet moins de risque bilatéral et davantage de compensation des flux. Elle crée aussi un nouveau point de passage : le client qui n'est pas membre direct doit trouver un intermédiaire capable de porter ses marges, ses obligations de liquidité et, selon le modèle, sa garantie. Une enquête publiée le 27 juillet par DTCC montre un marché largement préparé, mais indique qu'environ un tiers seulement des membres répondants envisage de proposer le clearing à ses clients. Ce chiffre ne prouve pas un goulot d'étranglement. Il dit où le chercher.*

Le marché des Treasuries n'est pas étranger à l0g. Nous avons décrit le levier du [basis trade](/posts/basis-trade-treasuries-levier/), la fabrication de la liquidité dans le [repo](/posts/repo-collateral-fabrique-liquidite/) et les chaînes de [collatéral et de réhypothécation](/posts/collateral-rehypothecation-cle-de-voute/). Le clearing obligatoire est souvent présenté comme la réponse réglementaire à ces fragilités. Cet article examine la réponse elle-même.

La question n'est pas de savoir si la compensation centrale est bonne ou mauvaise en bloc. Elle est plus concrète : **qui donne accès au système, qui immobilise le collatéral et qui doit trouver le cash quand la volatilité déclenche les appels de marge ?**

## La réforme ne supprime pas les intermédiaires

La [règle adoptée par la SEC en décembre 2023](https://www.sec.gov/newsroom/press-releases/2023-247) impose aux participants directs d'une chambre couverte de soumettre à la compensation centrale leurs transactions éligibles sur les titres du Trésor. Après un report d'un an, les échéances sont fixées au **31 décembre 2026** pour le marché au comptant et au **30 juin 2027** pour le repo. Le [dossier d'implémentation de la SEC](https://www.sec.gov/featured-topics/treasury-clearing-implementation), mis à jour le 24 juillet 2026, recense désormais trois chambres enregistrées pour les Treasuries : FICC, CME Securities Clearing et ICE Clear Credit.

Une [chambre de compensation, ou CCP](/glossaire/ccp/), s'interpose entre les deux parties. Elle devient l'acheteur de chaque vendeur et le vendeur de chaque acheteur. Cette novation permet de compenser des positions opposées et de réduire l'exposition directe à une contrepartie. Elle ne donne pas pour autant un accès direct à chaque fonds, banque étrangère ou gestionnaire d'actifs.

Chez [FICC](/glossaire/#ficc), l'acteur qui ne remplit pas les conditions d'une adhésion complète peut notamment passer par un **Sponsoring Member** ou par un **Agent Clearing Member**. Le premier parraine un Sponsored Member. Le second soumet les transactions d'un Executing Firm Customer. Dans les deux cas, un intermédiaire réglementé reste entre le client et la chambre.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 390" role="img" aria-label="Déplacement du risque d'une transaction bilatérale vers une chaîne client, intermédiaire de clearing et chambre de compensation" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="390" fill="#0c0d10"/>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Le risque ne disparaît pas, il change de chemin</text>
  <text x="32" y="60" fill="#8b909b" font-size="12">Schéma simplifié d'une transaction avant et après compensation centrale.</text>
  <text x="32" y="99" fill="#f5b13d" font-size="12" font-weight="700">BILATÉRAL</text>
  <rect x="32" y="118" width="190" height="64" rx="8" fill="#15171c" stroke="#5eead4"/>
  <text x="127" y="145" fill="#f5f6f8" font-size="13" text-anchor="middle">Prêteur / vendeur</text>
  <text x="127" y="165" fill="#8b909b" font-size="11" text-anchor="middle">fonds, banque, MMF</text>
  <line x1="222" y1="150" x2="498" y2="150" stroke="#f5b13d" stroke-width="3"/>
  <polygon points="498,150 486,143 486,157" fill="#f5b13d"/>
  <rect x="498" y="118" width="190" height="64" rx="8" fill="#15171c" stroke="#ff4d87"/>
  <text x="593" y="145" fill="#f5f6f8" font-size="13" text-anchor="middle">Emprunteur / acheteur</text>
  <text x="593" y="165" fill="#8b909b" font-size="11" text-anchor="middle">dealer, hedge fund</text>
  <text x="360" y="137" fill="#8b909b" font-size="10.5" text-anchor="middle">crédit, règlement, marge</text>
  <text x="32" y="226" fill="#5eead4" font-size="12" font-weight="700">CLEARING CENTRAL</text>
  <rect x="32" y="245" width="165" height="74" rx="8" fill="#15171c" stroke="#5eead4"/>
  <text x="114" y="272" fill="#f5f6f8" font-size="13" text-anchor="middle">Client</text>
  <text x="114" y="292" fill="#8b909b" font-size="11" text-anchor="middle">fonds, banque, MMF</text>
  <text x="114" y="307" fill="#8b909b" font-size="10.5" text-anchor="middle">ou hedge fund</text>
  <line x1="197" y1="282" x2="273" y2="282" stroke="#5eead4" stroke-width="3"/>
  <polygon points="273,282 261,275 261,289" fill="#5eead4"/>
  <rect x="273" y="235" width="174" height="94" rx="8" fill="#15171c" stroke="#f5b13d"/>
  <text x="360" y="260" fill="#f5f6f8" font-size="13" text-anchor="middle">Sponsor ou agent</text>
  <text x="360" y="281" fill="#f5b13d" font-size="11" text-anchor="middle">marge et liquidité</text>
  <text x="360" y="299" fill="#f5b13d" font-size="11" text-anchor="middle">règlement et frais</text>
  <text x="360" y="317" fill="#f5b13d" font-size="11" text-anchor="middle">garantie selon le modèle</text>
  <line x1="447" y1="282" x2="523" y2="282" stroke="#ff4d87" stroke-width="3"/>
  <polygon points="523,282 511,275 511,289" fill="#ff4d87"/>
  <rect x="523" y="245" width="165" height="74" rx="8" fill="#15171c" stroke="#ff4d87"/>
  <text x="605" y="272" fill="#f5f6f8" font-size="13" text-anchor="middle">CCP</text>
  <text x="605" y="292" fill="#8b909b" font-size="11" text-anchor="middle">novation et netting</text>
  <text x="605" y="307" fill="#8b909b" font-size="10.5" text-anchor="middle">gestion du défaut</text>
  <text x="32" y="366" fill="#8b909b" font-size="11">Sources : SEC ; FICC, Client Clearing Capabilities et Disclosure Framework, 2026.</text>
</svg>
<figcaption>Le clearing remplace le lien bilatéral par une chaîne. La CCP réduit le risque de contrepartie et compense les flux, mais l'intermédiaire de clearing reste responsable d'obligations essentielles vis-à-vis de FICC. Le schéma simplifie des modèles juridiques distincts. Sources : SEC et FICC.</figcaption>
</figure>

## Le marché est prêt, selon le marché

Le déclencheur de cette enquête est le [rapport publié par DTCC le 27 juillet](https://www.dtcc.com/-/media/downloads/FICC-client-survey-report.pdf). FICC a interrogé en juin tous les membres à service complet de sa Government Securities Division. Le taux de réponse atteint **92 %**.

Les résultats décrivent une transition déjà avancée :

- plus de **1 200 milliards de dollars** de transactions au comptant sont déjà compensés chaque jour chez FICC ;
- les répondants déclarent encore **300 à 400 milliards de dollars** de valeur nominale quotidienne non soumis au clearing ;
- **79 %** disent avoir déjà les comptes nécessaires chez FICC ;
- environ **un tiers** prévoit de proposer le clearing des Treasuries au comptant à ses clients.

Ces quatre chiffres ne mesurent pas la même chose. Les 79 % décrivent la préparation des membres répondants pour leurs propres besoins. Le tiers concerne ceux qui envisagent de devenir fournisseurs d'accès pour des clients. On ne peut donc ni soustraire ces proportions ni en déduire que deux tiers du marché seront exclus.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 400" role="img" aria-label="Résultats de l'enquête FICC et estimation OFR de l'effet du mandat sur le repo" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="400" fill="#0c0d10"/>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Une migration massive, une capacité client moins lisible</text>
  <text x="32" y="60" fill="#8b909b" font-size="12">Comptant : enquête FICC de juin 2026. Repo : estimation OFR sur les huit premiers mois de 2025.</text>
  <text x="32" y="101" fill="#d6d9df" font-size="12">Treasuries au comptant déjà compensés chez FICC</text>
  <rect x="32" y="113" width="560" height="24" fill="#2a2c33"/>
  <rect x="32" y="113" width="420" height="24" fill="#5eead4"/>
  <text x="464" y="130" fill="#5eead4" font-size="12" font-weight="700">&gt; 1 200 Md$ / jour</text>
  <text x="32" y="166" fill="#d6d9df" font-size="12">Activité déclarée restant à migrer</text>
  <rect x="32" y="178" width="560" height="24" fill="#2a2c33"/>
  <rect x="32" y="178" width="105" height="24" fill="#f5b13d"/>
  <rect x="137" y="178" width="35" height="24" fill="#f5b13d" opacity="0.45"/>
  <text x="184" y="195" fill="#f5b13d" font-size="12" font-weight="700">300-400 Md$ / jour</text>
  <line x1="32" y1="230" x2="688" y2="230" stroke="#2a2c33"/>
  <text x="32" y="263" fill="#d6d9df" font-size="12">Repo centralement compensé, situation observée</text>
  <rect x="32" y="275" width="560" height="22" fill="#2a2c33"/>
  <rect x="32" y="275" width="252" height="22" fill="#7aa2f7"/>
  <text x="604" y="291" fill="#7aa2f7" font-size="12" font-weight="700">45 %</text>
  <text x="32" y="324" fill="#d6d9df" font-size="12">Repo compensé si la règle avait été appliquée</text>
  <rect x="32" y="336" width="560" height="22" fill="#2a2c33"/>
  <rect x="32" y="336" width="431" height="22" fill="#ff4d87"/>
  <text x="604" y="352" fill="#ff4d87" font-size="12" font-weight="700">77 %</text>
  <text x="32" y="386" fill="#8b909b" font-size="10.5">Sources : DTCC/FICC, 27 juillet 2026 ; OFR, 29 janvier 2026. Périmètres et périodes différents.</text>
</svg>
<figcaption>Le graphique juxtapose deux mesures qui ne doivent pas être fusionnées. Pour le comptant, DTCC publie les déclarations des membres FICC répondants. Pour le repo, l'OFR construit un contrefactuel à comportement inchangé. Le passage de 45 % à 77 % n'est pas une prévision de volume. Sources : DTCC/FICC et OFR.</figcaption>
</figure>

Le rapport a aussi des limites utiles. DTCC est l'opérateur de FICC et présente sa propre préparation. Il ne publie ni le nombre brut de répondants, ni leur identité, ni la capacité que chacun réservera aux clients. Il ne donne pas non plus les tarifs, les exigences commerciales, les refus d'onboarding ou la concentration future des volumes. Le taux de réponse de 92 % rend l'enquête informative. Il ne transforme pas une enquête de l'infrastructure sur ses membres en photographie complète de la concurrence.

Le tiers est donc un **signal de concentration possible**, pas une preuve d'oligopole.

## Le client clearer porte la facture invisible

Les documents de FICC permettent de suivre les responsabilités sans spéculer. Dans l'[Agent Clearing Service](https://www.dtcc.com/ustclearing/-/media/Files/Downloads/Microsites/Treasury-Clearing/FICC-Client-Clearing-Capabilities-for-Treasury-Market-Activity.pdf), l'Agent Clearing Member est responsable envers FICC des frais, du règlement, des marges, des obligations de liquidité et de l'allocation éventuelle de pertes attribuées à l'activité soumise, y compris celle de ses clients.

Dans le Sponsored Service, le Sponsoring Member garantit à FICC les obligations de ses Sponsored Members. Il porte aussi les dépôts de Clearing Fund associés au compte omnibus, calculés deux fois par jour sur une base brute. Le client conserve des obligations juridiques propres, mais FICC peut se retourner vers le sponsor si elles ne sont pas remplies.

Ce déplacement a trois conséquences.

**Premièrement, l'accès a un prix.** Un intermédiaire mobilise du capital, des systèmes, du personnel, du collatéral et des lignes de liquidité. Le prix facturé au client peut intégrer ces coûts, même si le netting réduit par ailleurs le bilan consommé.

**Deuxièmement, la capacité n'est pas infinie.** Un dealer peut être techniquement prêt pour ses transactions propres sans vouloir accepter tous les fonds qui demandent un accès client. Il doit fixer des limites, gérer le risque de défaut et prévoir les besoins de marge dans un stress.

**Troisièmement, la concurrence ne se lit pas dans le nombre de comptes.** Trois chambres sont enregistrées et FICC propose plusieurs modèles. La concurrence effective dépendra des volumes, de l'interopérabilité, des coûts de portage et de la capacité à transférer les positions d'un client si son intermédiaire tombe en défaut.

## Le risque de crédit devient une horloge de liquidité

La compensation centrale réduit l'exposition bilatérale, mais elle impose une discipline temporelle. La [marge initiale](/glossaire/marge-initiale/) protège contre une variation de prix future pendant la liquidation d'un défaut. Les paiements de règlement et les appels de marge exigent, eux, du cash au moment prévu.

Le [Disclosure Framework de FICC arrêté au premier trimestre 2026](https://www.dtcc.com/-/media/Files/Downloads/legal/policy-and-compliance/FICC-DISCLOSURE-FRAMEWORK-2026-Q1-Marked) précise que FICC ne compte pas sur un accès routinier au crédit de la banque centrale pour sa liquidité. En cas de défaut d'un membre net acheteur, FICC doit encore recevoir les titres et payer le cash correspondant. Elle utilise ses ressources liquides et peut redistribuer des titres aux membres sous forme de repos dans le cadre de la Capped Contingency Liquidity Facility, la **CCLF**.

Une [étude de l'Office of Financial Research](https://www.financialresearch.gov/working-papers/2026/03/05/central-counterparty-management-liquid-prefunded-resources/) explique pourquoi ce point compte particulièrement pour les titres et les repos livrés physiquement. Ces CCP ont besoin de davantage de ressources liquides que certaines chambres de dérivés, car la valeur intégrale du règlement doit circuler. Les lignes fournies par les membres répartissent ce besoin de financement, mais elles reconnectent la résilience de la chambre à la liquidité de ses participants.

Le 1er juillet, FICC a [abaissé de 30 % à 10 % le paramètre de coussin](https://www.dtcc.com/-/media/Files/pdf/2026/6/16/GSD-CCLF-Facility-Reset-Reminder-Important-Notice---July-1-2026.pdf) utilisé dans le dimensionnement agrégé de la CCLF. Le même avis précise que les plafonds individuels sont recalculés sur les besoins observés entre janvier et juin et que les autres paramètres restent inchangés.

Ce document ne permet pas de conclure que la liquidité totale de FICC a diminué de 20 %, ni que la chambre s'est fragilisée. Il ne publie pas le montant agrégé avant et après le recalibrage, tandis que le besoin de base peut évoluer. Il montre en revanche que la capacité de liquidité demandée aux membres est une variable active de la transition, pas un détail réglé une fois pour toutes.

La [Financial Stability Report de la Fed de mai 2026](https://www.federalreserve.gov/publications/files/financial-stability-report-20260508.pdf) apporte un contrepoint rassurant. Lors du choc de volatilité lié au conflit avec l'Iran, les CCP ont relevé significativement leurs marges sur les produits énergétiques, sans difficulté observée pour les participants. La Fed juge les ressources préfinancées élevées. C'est une preuve de résilience dans cet épisode précis, pas un test du futur basculement des Treasuries.

## Le gain de bilan existe, mais sa taille reste débattue

Le principal bénéfice économique attendu du clearing est le **netting multilatéral**. Un dealer qui prête du cash d'un côté et en emprunte de l'autre peut compenser davantage de positions lorsqu'une même CCP devient sa contrepartie.

À partir de données couvrant l'ensemble des segments du repo, l'[OFR estime](https://www.financialresearch.gov/the-ofr-blog/2026/01/29/central-clearing-impact-repo-market/) que la part quotidiennement compensée aurait été de **77 %** durant les huit premiers mois de 2025 si la règle avait été appliquée, contre **45 %** observés. Pour six banques systémiques américaines, le contrefactuel réduit de **207 milliards de dollars** les positions repo et reverse repo non compensées, soit **34,5 milliards en moyenne par banque**.

Ce calcul suppose que les transactions et les comportements ne changent pas. Il ne constitue donc ni une prévision de volumes ni une estimation de bénéfice. Un [papier de recherche de la Fed](https://www.federalreserve.gov/econres/feds/balance-sheet-netting-in-us-treasury-markets-and-central-clearing.htm), fondé sur un autre jeu de données et une autre question, conclut d'ailleurs que l'effet du clearing sur le ratio de levier supplémentaire, le SLR, devrait rester relativement limité. Une partie des transactions est déjà structurée pour être compensable hors CCP et une autre ne le deviendrait pas automatiquement.

La marge client ajoute une autre nuance. Une [note de la Fed sur le repo](https://www.federalreserve.gov/econres/notes/feds-notes/proportionate-margining-for-repo-transactions-20250214.html) rappelle que la CCP facture la marge au membre direct, pas nécessairement au client final. Le membre décide ensuite de ses propres exigences envers ce client. Le passage au clearing peut donc uniformiser la marge au niveau de la chambre sans uniformiser immédiatement le haircut ou le coût payé par chaque fonds.

## Le risque de péage est une hypothèse réfutable

L'hypothèse centrale peut être formulée sans dramatisation : si un nombre limité d'intermédiaires concentre l'accès client, le risque bilatéral dispersé pourrait être remplacé par une dépendance commune à quelques capacités de clearing. Ces intermédiaires pourraient alors influencer le prix, les limites et les conditions d'accès au marché le plus important du système financier.

Plusieurs faits empêchent de présenter ce scénario comme acquis. FICC déclare plus de **2 850 Sponsored Members** dans **66 juridictions** et plus de **2 500 milliards de dollars** de volume quotidien dans son Sponsored Service. L'Agent Clearing Service progresse. CME Securities Clearing et ICE Clear Credit créent des options supplémentaires. Enfin, le tiers de répondants proposant le service peut représenter une capacité suffisante si ces acteurs sont grands, diversifiés et réellement concurrents.

Il faut donc surveiller cinq preuves plutôt qu'un récit :

1. **La concentration effective des volumes clients**, par chambre et par intermédiaire, pas seulement le nombre de comptes ouverts.
2. **Les prix et conditions d'accès**, notamment les frais, haircuts, appels de marge, seuils minimaux et refus d'onboarding.
3. **Les ressources liquides et la CCLF**, avec les montants agrégés, les contributions par niveau et les appels intrajournaliers pendant les épisodes de volatilité.
4. **La capacité de portage**, c'est-à-dire la possibilité réelle de transférer rapidement les positions d'un client après le défaut d'un sponsor ou d'un agent.
5. **La qualité du marché autour des échéances**, mesurée par les écarts acheteur-vendeur, les échecs de règlement, la profondeur et le comportement du repo.

La première échéance ne dira pas seulement si les systèmes informatiques fonctionnent. Elle dira si le clearing central a créé une infrastructure plus ouverte ou un péage plus concentré.

## Une réduction de risque peut produire une nouvelle dépendance

La compensation centrale répond à un problème réel. Elle rend les expositions plus visibles, impose une marge structurée et permet de compenser des flux qui consomment aujourd'hui du bilan. Sur un marché où le [Trésor émet à un rythme record](/posts/adjudications-record-referendum-dette-americaine/) et où les hedge funds utilisent massivement le repo, ces gains peuvent améliorer la résilience.

Mais le résultat ne se lit pas dans le seul volume compensé. Une réforme peut réduire le risque de contrepartie tout en concentrant le risque opérationnel, la liquidité et le pouvoir d'accès. Elle peut libérer du bilan en temps normal et exiger davantage de cash au pire moment. Elle peut protéger la chambre tout en faisant remonter la facture vers le client par l'intermédiaire de clearing.

Le clearing obligatoire n'est donc pas la fin de l'histoire du [collatéral](/glossaire/#collateral). C'est son changement d'adresse. À partir de décembre, le marché devra prouver que le nouveau coffre possède assez de portes, assez de liquidité et assez de concurrents.

## Sources

1. DTCC/FICC, **Industry Readiness for U.S. Treasury Cash Clearing: A Survey of FICC Membership**, enquête de juin, taux de réponse de 92 %, volumes, préparation et offre client, 27 juillet 2026 : <https://www.dtcc.com/-/media/downloads/FICC-client-survey-report.pdf>
2. DTCC, **Market Participant Firms Making Significant Progress Toward U.S. Treasury Cash Clearing Deadline**, communiqué accompagnant l'enquête, 27 juillet 2026 : <https://www.dtcc.com/news/2026/july/27/dtcc-survey-firms-progress-toward-us-treasury-clearing-deadline>
3. SEC, **Treasury Clearing Implementation**, règle, échéances, guides, décisions FICC et enregistrement des chambres, mise à jour du 24 juillet 2026 : <https://www.sec.gov/featured-topics/treasury-clearing-implementation>
4. SEC, **SEC Adopts Rules to Improve Risk Management in Clearance and Settlement and Facilitate Additional Central Clearing for the U.S. Treasury Market**, adoption de la règle, 13 décembre 2023 : <https://www.sec.gov/newsroom/press-releases/2023-247>
5. SEC, **SEC Extends Compliance Dates and Provides Temporary Exemption for Rule Related to Clearing of U.S. Treasury Securities**, échéances reportées au 31 décembre 2026 et au 30 juin 2027, 25 février 2025 : <https://www.sec.gov/newsroom/press-releases/2025-43-sec-extends-compliance-dates-provides-temporary-exemption-rule-related-clearing-us-treasury>
6. FICC, **Client Clearing Capabilities for Treasury Market Activity**, modèles Sponsored et Agent Clearing, responsabilités de marge, règlement, garantie et liquidité : <https://www.dtcc.com/ustclearing/-/media/Files/Downloads/Microsites/Treasury-Clearing/FICC-Client-Clearing-Capabilities-for-Treasury-Market-Activity.pdf>
7. FICC, **Disclosure Framework for Covered Clearing Agencies and Financial Market Infrastructures**, premier trimestre 2026, accès, collatéral, liquidité, défaut et CCLF : <https://www.dtcc.com/-/media/Files/Downloads/legal/policy-and-compliance/FICC-DISCLOSURE-FRAMEWORK-2026-Q1-Marked>
8. FICC, **CCLF Liquidity Buffer Parameter Adjustment**, avis GOV2174-26, baisse du paramètre de 30 % à 10 % au 1er juillet 2026 : <https://www.dtcc.com/-/media/Files/pdf/2026/6/16/GSD-CCLF-Facility-Reset-Reminder-Important-Notice---July-1-2026.pdf>
9. Office of Financial Research, **How Will Central Clearing Impact the Repo Market?**, données de repo, contrefactuel de clearing et effet estimé sur le bilan, 29 janvier 2026 : <https://www.financialresearch.gov/the-ofr-blog/2026/01/29/central-clearing-impact-repo-market/>
10. Office of Financial Research, John Heilbron et Nick Schwartz, **Central Counterparty Management of Liquid and Prefunded Resources**, ressources liquides des CCP de titres et de repo, 5 mars 2026 : <https://www.financialresearch.gov/working-papers/2026/03/05/central-counterparty-management-liquid-prefunded-resources/>
11. Federal Reserve, Sriya Anbil, Mark Carlson, Christopher Han et John Wang, **Balance-Sheet Netting in U.S. Treasury Markets and Central Clearing**, FEDS 2024-057, juillet 2024 : <https://www.federalreserve.gov/econres/feds/balance-sheet-netting-in-us-treasury-markets-and-central-clearing.htm>
12. Federal Reserve, Sebastian Infante, R. Jay Kahn, Luke M. Olson et Mary-Frances Styczynski, **Proportionate margining for repo transactions**, 14 février 2025 : <https://www.federalreserve.gov/econres/notes/feds-notes/proportionate-margining-for-repo-transactions-20250214.html>
13. Federal Reserve, **Financial Stability Report**, marges des CCP et ressources préfinancées pendant le choc énergétique, 8 mai 2026 : <https://www.federalreserve.gov/publications/files/financial-stability-report-20260508.pdf>
14. CPMI-IOSCO, **Streamlining variation margin in centrally cleared markets: examples of effective practices**, liquidité et prévisibilité des appels de marge, 15 janvier 2025 : <https://www.bis.org/cpmi/publ/d226.htm>
