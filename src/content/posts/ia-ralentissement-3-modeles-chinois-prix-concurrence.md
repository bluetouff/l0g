---
title: "Modèles chinois : le prix de l’avance américaine"
seoTitle: "Modèles chinois : le prix de l’avance américaine | l0g"
description: "Kimi dans Cursor, licences Qwen et tarifs DeepSeek : comment une alternative crédible peut peser sur les prix. Le coût du travail et le droit de changer de modèle."
pubDate: "2026-09-27T14:07:52+02:00"
tags: ["IA", "modèles ouverts", "concurrence", "Chine", "économie numérique"]
draft: false
ogImage: "/illustrations/news/ia-modeles-chinois-concurrence-v1.jpg"
quickTake: {"fact": "Cursor indique que Composer 2 et 2.5 reposent sur Kimi K2.5, avec un entraînement supplémentaire. Un modèle chinois peut donc devenir le composant d’une offre concurrente.", "importance": "Une alternative utilisable, autorisée et fiable peut peser sur les prix avant de dominer tous les classements. La facture doit inclure les corrections et le coût de migration.", "uncertainty": "Les performances présentées viennent de DeepSeek. Le coût humain est simulé, les marges des fournisseurs restent inconnues et chaque licence doit être lue pour le produit concerné."}
---

*Le prix du ralentissement · Volet 3*

Le développeur ouvre Cursor, confie une modification à son assistant et attend un résultat qui fonctionne. Derrière ce produit, une partie du travail vient de Chine. Dans son rapport technique du 27 mars 2026, Cursor explique avoir construit Composer 2 à partir de **Kimi K2.5**, avant de poursuivre son entraînement et de l’adapter à son environnement. La page de Composer 2.5 décrit encore cette même base. [Cursor, rapport technique](https://cursor.com/blog/composer-2-technical-report) ; [présentation de Composer](https://cursor.com/composer).

Ce détail change la manière de regarder la concurrence. Un modèle chinois peut remplacer une offre américaine sur certaines tâches. Il peut aussi servir de composant à un produit qui vendra ensuite son propre abonnement. L’entreprise qui entraîne le modèle, celle qui fait tourner les machines et celle qui possède la relation avec l’utilisateur ne sont pas nécessairement la même.

Le 10 septembre 2026, DeepSeek a lancé **V4.1 Flash**, avec des poids téléchargeables et une offre payante à distance. Ses tarifs et sa licence permettent d’examiner comment une alternative chinoise peut entrer dans la chaîne de valeur d’un produit concurrent. [Annonce de DeepSeek](https://deepseek.com/en/news/deepseek-v4-1-flash/).

Pour les entreprises qui demandent de ralentir la progression des modèles les plus puissants, la question économique devient précise : **combien un client continuera-t-il à payer pour une avance dont il n’a pas toujours besoin ?** La réponse dépend de la qualité du travail, du droit d’utiliser les alternatives et du coût pour changer de fournisseur. Aucun classement général ne réunit ces trois conditions.

## Un modèle peut devenir le composant de quelqu’un d’autre

Les *poids* sont les paramètres numériques appris pendant l’entraînement. Pouvoir les télécharger permet, lorsque la licence l’autorise, de faire fonctionner le modèle ailleurs que chez son concepteur et de l’adapter. Cela ne livre pas automatiquement toutes les données et toutes les étapes nécessaires pour le reproduire. La [définition de l’Open Source Initiative](https://opensource.org/ai/open-source-ai-definition) exige davantage qu’un fichier de paramètres pour qualifier un système d’IA d’open source.

L’effet économique est néanmoins considérable : le concepteur n’est plus obligatoirement le seul vendeur de l’exécution. Un hébergeur peut louer les machines, un intégrateur développer l’application, un client exploiter sa propre installation. Chacun ajoute un service ou prend en charge une contrainte. Le modèle ne devient pas gratuit à faire fonctionner parce que son téléchargement l’est.

Cursor illustre ce déplacement de la valeur. Son rapport décrit un entraînement supplémentaire, des outils et des environnements conçus pour l’usage dans son logiciel. Il ne s’agit donc pas simplement de changer le nom d’un modèle. Le client achète aussi une manière de travailler, avec son code et ses outils. Les documents publics ne permettent pas d’isoler la marge attribuable à la base Kimi, ni l’économie réalisée par rapport à un entraînement entièrement original. [Rapport de Cursor](https://cursor.com/blog/composer-2-technical-report).

Une conséquence en découle : l’ouverture peut affaiblir le pouvoir de fixation des prix d’un laboratoire tout en renforçant celui d’une application appréciée des utilisateurs. L’avantage concurrentiel se déplace vers l’intégration, la distribution ou le service. Il ne disparaît pas nécessairement.

## La licence détermine qui peut vendre quoi

Il faut pourtant lire le contrat attaché au téléchargement. **Les modèles chinois ne partagent pas une licence unique.** DeepSeek V4.1 Flash est publié sous [licence MIT](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash/raw/main/LICENSE), qui autorise notamment l’usage et la redistribution commerciaux sous réserve de ses conditions de notice. Le dépôt [Qwen3.8-27B](https://huggingface.co/Qwen/Qwen3.8-27B) indique Apache 2.0. Ces droits ne peuvent pas être étendus par voisinage à toute la gamme Qwen.

La [licence de Qwen3.8-Flash-Next](https://huggingface.co/Qwen/Qwen3.8-Flash-Next/raw/main/LICENSE) exige un accord séparé avant usage commercial lorsque le bénéficiaire, ou une entreprise qui lui est affiliée, exerce certaines activités de fourniture de modèles ou d’assistants de travail. L’exception vise un usage strictement interne, sans mise à disposition du modèle, de ses sorties ou de ses capacités à des tiers. Les définitions contractuelles délimitent les activités concernées, notamment les assistants autonomes principalement destinés au code ou au travail de bureau. Les conditions financières de l’accord séparé restent inconnues.

La différence est matérielle. Une équipe peut avoir accès aux fichiers et à leurs possibilités techniques sans disposer du même droit de commercialisation qu’avec une licence permissive. L’ouverture de l’artefact et l’ouverture du marché qui l’exploite sont deux questions à vérifier séparément.

Kimi fournit un autre exemple, moins restrictif sur ce point. Sa [licence MIT modifiée](https://huggingface.co/moonshotai/Kimi-K2.5/blob/main/LICENSE) ajoute une obligation de visibilité de la marque au-delà de certains seuils d’audience ou de revenu. Cette clause n’est pas l’obligation d’accord commercial figurant dans le texte Qwen. Aucune de ces observations ne permet d’affirmer qu’un utilisateur particulier enfreint sa licence.

Ces différences invitent à regarder chaque fournisseur et chaque produit. Une diffusion large peut soutenir la vente de services, la reconnaissance d’une marque ou la création d’un écosystème. Les licences examinées montrent des arbitrages commerciaux distincts.

## Deux tests, deux écarts de performance

La question suivante est celle du résultat. Dans son tableau comparatif, DeepSeek publie **74,2 %** sur DeepSWE v1.1, contre **74,0 %** pour Opus 5.0. Sur Terminal-Bench 4.0, les valeurs sont respectivement **31,2 % et 51,8 %**. Les résultats du modèle instruct de DeepSeek utilisent son effort de raisonnement maximal. Ce sont des données du fournisseur, non reproduites par l0g. [Fiche du modèle](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash).

<figure class="infographic" style="max-width:33rem;margin:2rem auto;padding-bottom:1rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 420" role="img" aria-labelledby="ai-models-fr-bench-title ai-models-fr-bench-desc" style="width:100%;height:auto" font-family="Arial, Helvetica, sans-serif">
<title id="ai-models-fr-bench-title">Le résultat dépend de la tâche</title>
<desc id="ai-models-fr-bench-desc">Résultats publiés par DeepSeek, consultés le 27 septembre 2026. DeepSWE v1.1, problèmes résolus : V4.1 Flash 74,2 %, Opus 5.0 74,0 %. Terminal-Bench 4.0, réussite au premier essai : V4.1 Flash 31,2 %, Opus 5.0 51,8 %. Quatre barres sur une même échelle de 0 à 100 %. Pas de reproduction indépendante.</desc>
<rect x="0" y="0" width="500" height="420" rx="6" fill="var(--color-surface)"/>
<text x="24" y="34" font-size="24" font-weight="700" text-anchor="start" fill="var(--color-paper)">Le résultat dépend de la tâche</text>
<rect x="24" y="56" width="16.000000" height="16" fill="var(--color-signal)"/>
<text x="48" y="70" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-paper)">V4.1 Flash</text>
<rect x="260" y="56" width="16.000000" height="16" fill="var(--color-accent)"/>
<text x="284" y="70" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-paper)">Opus 5.0</text>
<text x="24" y="108" font-size="22" font-weight="700" text-anchor="start" fill="var(--color-paper)">DeepSWE v1.1 · résolus</text>
<rect x="24" y="122" width="296.800000" height="22" fill="var(--color-signal)"/>
<text x="476" y="141" font-size="22" font-weight="700" text-anchor="end" fill="var(--color-signal)">74,2 %</text>
<rect x="24" y="160" width="296.000000" height="22" fill="var(--color-accent)"/>
<text x="476" y="179" font-size="22" font-weight="700" text-anchor="end" fill="var(--color-accent)">74,0 %</text>
<rect x="24" y="260" width="124.800000" height="22" fill="var(--color-signal)"/>
<text x="476" y="279" font-size="22" font-weight="700" text-anchor="end" fill="var(--color-signal)">31,2 %</text>
<rect x="24" y="298" width="207.200000" height="22" fill="var(--color-accent)"/>
<text x="476" y="317" font-size="22" font-weight="700" text-anchor="end" fill="var(--color-accent)">51,8 %</text>
<text x="24" y="246" font-size="22" font-weight="700" text-anchor="start" fill="var(--color-paper)">Terminal-Bench 4.0 · pass@1</text>
<path d="M24 352H424 M24 348V356 M124 348V356 M224 348V356 M324 348V356 M424 348V356" fill="none" stroke="var(--color-muted)" stroke-width="2"/>
<text x="24" y="382" font-size="20" font-weight="400" text-anchor="middle" fill="var(--color-muted)">0</text>
<text x="124" y="382" font-size="20" font-weight="400" text-anchor="middle" fill="var(--color-muted)">25</text>
<text x="224" y="382" font-size="20" font-weight="400" text-anchor="middle" fill="var(--color-muted)">50</text>
<text x="324" y="382" font-size="20" font-weight="400" text-anchor="middle" fill="var(--color-muted)">75</text>
<text x="424" y="382" font-size="20" font-weight="400" text-anchor="middle" fill="var(--color-muted)">100</text>
<text x="250" y="409" font-size="20" font-weight="400" text-anchor="middle" fill="var(--color-muted)">Pourcentage · même échelle</text>
</svg>
<figcaption>Source : <a href="https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash">DeepSeek V4.1 Flash, 2026-09-27</a>. Résultats fournisseur ; versions et métriques conservées. « Pass@1 » désigne la réussite au premier essai. DeepSeek indique un effort de raisonnement de 100 pour Instruct, mini-SWE pour DeepSWE et son environnement Minimal avec un contexte d’un million de tokens pour les tests de code en environnement terminal. La figure ne constitue pas un classement actualisé de tous les modèles.</figcaption>
</figure>

Le choix du travail demandé change nettement la comparaison. L’écart de 0,2 point sur DeepSWE est trop peu documenté pour conclure à une différence statistiquement significative. La figure conserve les versions citées dans le document ; son périmètre se limite à ces deux tests.

Un *benchmark* est un ensemble de tâches et une manière de les noter. Une entreprise a besoin d’une recette différente : ses documents, ses cas difficiles, ses délais et le niveau d’erreur qu’elle peut accepter. Réussir souvent une tâche bien délimitée peut suffire à rendre un modèle commercialement substituable. Une fragilité sur une opération rare mais coûteuse peut produire l’effet inverse.

L’étude [*AI Agents That Matter*](https://arxiv.org/abs/2407.01502), publiée en juillet 2024, identifiait déjà le problème des comparaisons centrées sur la réussite sans intégrer correctement leur coût. Le principe reste utile : un agent peut améliorer son score en multipliant les essais, les appels et les vérifications. Il faut observer ce qu’il consomme pour obtenir son résultat.

Même la distance entre modèles « ouverts » et « fermés » dépend de la mesure. Epoch estimait un décalage moyen d’environ **quatre mois** entre leurs frontières de performance sur son indice, pour la période du **1er janvier au 28 mai 2026**. Ce résultat ne porte ni sur chaque tâche ni spécifiquement sur une opposition Chine–États-Unis. Ce n’est pas davantage une prévision du délai de rattrapage en septembre. Epoch avertit aussi que les modèles fermés non publiés échappent à la mesure, qui peut donc sous-estimer l’écart. [Analyse d’Epoch, 29 mai](https://epoch.ai/data-insights/open-closed-eci-gap).

Une avance mesurée peut donc être réelle, tout en étant peu utile à un acheteur donné. Le supplément de prix doit rémunérer quelque chose dont celui-ci bénéficie effectivement.

## Du prix au token à la facture réelle

Les prix de DeepSeek donnent une prise concrète. Au 27 septembre, V4.1 Flash affiche, pour un million de tokens, **0,15 dollar en entrée hors cache et 0,60 dollar en sortie pendant les heures creuses**, contre **0,30 et 1,20 dollar en pointe**. Le cache correspond à une réutilisation d’éléments d’entrée, facturée séparément. Les créneaux de pointe sont définis en UTC, du lundi au vendredi hors jours fériés chinois, de 01 h à 04 h et de 06 h à 10 h UTC. [Tarifs officiels](https://api-docs.deepseek.com/quick_start/pricing/).

Un token est une unité de texte traitée par le modèle, pas une tâche accomplie. Sur un panier fictif de **10 millions de tokens d’entrée sans cache et un million de sortie**, ces tarifs donnent **2,10 dollars en heures creuses et 4,20 dollars en pointe**. Le calcul ne suppose aucune amélioration de qualité à une heure plutôt qu’à une autre. Il exclut les outils externes, les corrections humaines et les autres frais.

La marge du fournisseur et ses coûts de production restent inconnus. Les tarifs publiés renseignent la facture du client ; ils laissent ouverte la question de la rentabilité de l’offre et de son financement.

Pour comparer deux offres, il faut aussi vérifier qu’elles réalisent le même travail. Un volume égal de tokens ne garantit pas une quantité identique de texte, encore moins un résultat équivalent. Les reprises et les vérifications peuvent absorber rapidement l’économie réalisée sur chaque appel.

## Simulation : le poids du travail de correction

Prenons un **exemple entièrement fictif**. Deux chaînes de traitement produisent chacune **1 000 tâches finales acceptées selon le même niveau de qualité**. Les frais de calcul comprennent tous les appels nécessaires à ces tâches. Le temps humain moyen inclut leur vérification et leur correction. Il ne s’agit d’aucun modèle nommé, chinois ou américain.

La solution A consomme **0,04 dollar de calcul par tâche**, mais demande **deux minutes de travail humain**. La solution B coûte **0,20 dollar de calcul** et demande **trente secondes**. Avec un coût de travail supposé de **30 dollars l’heure**, A revient à **1 040 dollars** pour les 1 000 tâches ; B à **450 dollars**.

<figure class="infographic" style="max-width:33rem;margin:2rem auto;padding-bottom:1rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 420" role="img" aria-labelledby="ai-models-fr-cost-title ai-models-fr-cost-desc" style="width:100%;height:auto" font-family="Arial, Helvetica, sans-serif">
<title id="ai-models-fr-cost-title">Quand la correction coûte plus</title>
<desc id="ai-models-fr-cost-desc">Simulation fictive, 1 000 tâches acceptées de même qualité. A : calcul 40 dollars, travail humain 1 000 dollars, total 1 040 dollars. B : calcul 200 dollars, travail humain 250 dollars, total 450 dollars. Coût humain : 30 dollars par heure ; deux minutes par tâche pour A, trente secondes pour B. Barres empilées de 0 à 1 200 dollars.</desc>
<rect x="0" y="0" width="500" height="420" rx="6" fill="var(--color-surface)"/>
<text x="24" y="34" font-size="24" font-weight="700" text-anchor="start" fill="var(--color-paper)">Quand la correction coûte plus</text>
<text x="24" y="68" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-muted)">Simulation · 1 000 tâches acceptées</text>
<rect x="24" y="89" width="16.000000" height="16" fill="var(--color-signal)"/>
<text x="48" y="104" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-paper)">Calcul</text>
<rect x="260" y="89" width="16.000000" height="16" fill="var(--color-accent)"/>
<text x="284" y="104" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-paper)">Travail humain</text>
<text x="24" y="148" font-size="22" font-weight="700" text-anchor="start" fill="var(--color-paper)">Solution A</text>
<text x="476" y="148" font-size="22" font-weight="700" text-anchor="end" fill="var(--color-paper)">1 040 $</text>
<rect x="24" y="164" width="13.333333" height="26" fill="var(--color-signal)"/>
<rect x="37.333333333333336" y="164" width="333.333333" height="26" fill="var(--color-accent)"/>
<text x="24" y="217" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-muted)">Calcul 40 $ + humain 1 000 $</text>
<text x="24" y="252" font-size="22" font-weight="700" text-anchor="start" fill="var(--color-paper)">Solution B</text>
<text x="476" y="252" font-size="22" font-weight="700" text-anchor="end" fill="var(--color-paper)">450 $</text>
<rect x="24" y="268" width="66.666667" height="26" fill="var(--color-signal)"/>
<rect x="90.66666666666667" y="268" width="83.333333" height="26" fill="var(--color-accent)"/>
<text x="24" y="321" font-size="20" font-weight="400" text-anchor="start" fill="var(--color-muted)">Calcul 200 $ + humain 250 $</text>
<path d="M24 354H424 M24 350V358 M224 350V358 M424 350V358" fill="none" stroke="var(--color-muted)" stroke-width="2"/>
<text x="24.0" y="384" font-size="20" font-weight="400" text-anchor="middle" fill="var(--color-muted)">0</text>
<text x="224.0" y="384" font-size="20" font-weight="400" text-anchor="middle" fill="var(--color-muted)">600</text>
<text x="424.0" y="384" font-size="20" font-weight="400" text-anchor="middle" fill="var(--color-muted)">1 200</text>
<text x="250" y="409" font-size="20" font-weight="400" text-anchor="middle" fill="var(--color-muted)">Dollars US · même échelle</text>
</svg>
<figcaption>Simulation l0g, hypothèses définies le 27 septembre 2026. Calcul par tâche : A = 0,04 $, B = 0,20 $. Travail humain : A = 2 minutes, B = 30 secondes, à 30 $/h. Tous les appels et reprises sont inclus dans le calcul ; coûts fixes, migration et dommages exclus. Aucun fournisseur n’est représenté. Formules et seuil de 19,2 secondes explicités dans le texte.</figcaption>
</figure>

Les frais de calcul de A représentent un cinquième de ceux de B. La dépense variable étudiée est pourtant plus élevée, parce que le temps de travail représente ici le poste principal. **Il suffit de 19,2 secondes de vérification supplémentaire par tâche pour absorber les 16 cents économisés sur le calcul.** Calcul : (0,20 − 0,04) ÷ (30 ÷ 3 600) = 19,2 secondes. Ce seuil découle des seules hypothèses de l’exemple.

L’inverse reste possible. Si les deux solutions exigent la même intervention humaine, A conserve son avantage de prix. Si une tâche peut être contrôlée automatiquement à peu de frais, une stratégie consistant à essayer d’abord un modèle moins coûteux devient envisageable. Elle doit cependant intégrer le prix du contrôleur et les erreurs qu’il laisse passer.

Cette comparaison ne justifie donc pas un abonnement haut de gamme par principe. Elle explique ce qu’il faudrait mesurer pour l’accepter ou le refuser. Les coûts fixes de déploiement et de migration, les incidents et les conséquences d’une erreur sont encore hors de l’exemple. Pour une entreprise, ils doivent revenir dans le calcul avant la décision.

La concurrence devient sérieuse lorsque le fournisseur alternatif peut démontrer ce coût complet sur le travail du client. À ce stade, ne pas être premier sur un classement général n’empêche plus de participer à la négociation.

## Pouvoir partir, puis pouvoir réellement déménager

Télécharger des poids offre une possibilité de sortie. Il faut encore la rendre praticable. Un client devra peut-être adapter la façon de présenter ses documents, ses appels d’outils, ses contrôles et ses tests de non-régression. Ces derniers vérifient qu’un changement n’abîme pas une fonction qui marchait auparavant. Une interface compatible réduit certains travaux de raccordement ; le comportement des réponses doit encore être testé.

Un hébergement interne ajoute une autre question : qui porte les heures pendant lesquelles les machines attendent ? Répartir une installation sur beaucoup de tâches peut réduire son coût moyen. Une capacité dimensionnée pour une pointe rare peut produire l’effet contraire. L’absence de redevance sur les poids ne supprime ni les machines, ni leur exploitation, ni les compétences nécessaires.

L’acheteur doit alors distinguer le coût déjà engagé de celui qu’il peut éviter. Changer de modèle ne libère pas forcément l’argent d’un contrat de calcul prépayé ou d’un engagement de consommation restant dû. Une économie théorique sur la prochaine requête peut ainsi coexister avec une facture contractuelle inchangée.

La FTC a documenté cette dépendance dans son rapport de **janvier 2025** : pour les partenariats étudiés entre grands clouds et développeurs d’IA, elle relève des engagements de dépenses chez les investisseurs et de possibles coûts de changement de fournisseur. Son analyse utilise des informations disponibles jusqu’en janvier 2025 ; elle décrit les accords de cette période. [Publication de la FTC](https://www.ftc.gov/news-events/news/press-releases/2025/01/ftc-issues-staff-report-ai-partnerships-investments-study).

Une alternative crédible peut néanmoins avoir une valeur avant même la migration. Si le fournisseur sait que son client peut partir dans des conditions raisonnables, son pouvoir de négociation change. À l’inverse, un modèle disponible mais difficile à intégrer offre une menace de départ assez théorique.

## Un modèle chinois peut aussi remplir des machines américaines

AWS a annoncé la disponibilité de **DeepSeek R1** dès le **30 janvier 2025**, puis ajouté son accès entièrement géré à la présentation le **10 mars 2025**. Cet exemple historique porte précisément sur R1. Il illustre comment un groupe américain peut vendre l’hébergement d’un modèle chinois. [Annonce d’AWS](https://aws.amazon.com/blogs/aws/deepseek-r1-models-now-available-on-aws/).

L’origine du modèle ne suffit donc pas à localiser les revenus ou les données. L’opérateur qui exécute les requêtes peut être distinct de celui qui a fourni les poids. La configuration de l’application, les connexions qu’elle ouvre et les engagements du prestataire déterminent ensuite le trajet réel des informations.

Dans une installation effectivement isolée, une requête n’a pas besoin d’être renvoyée au créateur du modèle pour être traitée. Cela ne constitue pas une garantie générale de sécurité : il faut vérifier les logiciels chargés, les services externes, les permissions et les journaux. Télécharger des paramètres ne vaut ni audit du logiciel d’exécution ni connaissance exhaustive des données d’entraînement.

Le comportement du modèle, les destinations des données et les permissions d’action appellent des contrôles distincts. Leur importance apparaît dans le [deuxième volet consacré aux incidents d’agents](/posts/ia-ralentissement-2-incidents-securite-faits/). L’emplacement de l’hébergement ne règle à lui seul aucune de ces trois questions.

Sur le plan économique, cette séparation explique pourquoi l’ouverture peut attirer certains grands fournisseurs de technologie. Une baisse du prix du modèle peut rendre davantage d’applications viables, augmenter leur utilisation et laisser des revenus d’hébergement. Ce mécanisme est plausible ; les documents cités ne permettent pas d’en mesurer ici le solde net pour AWS ou pour l’ensemble du secteur.

## Les acteurs américains ne défendent pas tous le même marché

La [lettre collective sur les poids ouverts](https://www.microsoft.com/en-us/corporate-responsibility/topics/open-weight/), publiée le 24 juillet, fournit un contrepoint important à l’idée d’un front industriel unique. La liste consultée le 27 septembre comporte notamment Microsoft, Google, Amazon, Meta, NVIDIA et OpenAI. Cela ne signifie pas que chacun figurait dans la version initiale. Les signataires présentent l’ouverture comme favorable à la concurrence et au contrôle des utilisateurs ; ce sont leurs arguments, pas des conclusions indépendantes sur tous les risques.

Un fabricant d’accélérateurs, un cloud et un laboratoire vendant son modèle n’ont pas nécessairement intérêt au même niveau de prix. Certains peuvent bénéficier d’un modèle moins coûteux, d’autres perdre une partie de leur revenu par requête. Une même entreprise peut occuper plusieurs positions et arbitrer entre elles. Il serait donc trompeur de lui attribuer un intérêt simple à la seule lecture de son étiquette « américaine ».

Anthropic, de son côté, affirme le **27 juillet** ne pas demander d’interdiction générale des modèles à poids ouverts. L’entreprise soutient des restrictions sur les puces avancées, une action contre la distillation industrielle non autorisée et des tests obligatoires pour les modèles suffisamment capables, ouverts comme fermés. Il faut examiner ces propositions précises, plutôt que lui attribuer la demande qu’elle conteste. [Position publiée par Anthropic](https://www.anthropic.com/news/position-open-weights-models).

Dans son [essai sur le ralentissement](https://darioamodei.com/post/we-must-pace-the-frontier), Dario Amodei relie explicitement la possibilité de modérer la progression des capacités au maintien d’une avance des États-Unis et de leurs alliés. Cet objectif stratégique fait partie de son argument de sécurité. L’effet commercial des règles proposées doit être analysé séparément de ses intentions déclarées.

L’enquête économique doit porter sur les effets : une obligation serait-elle déclenchée par les capacités mesurées, par le mode de diffusion ou par le pays d’origine ? Qui pourrait faire évaluer un modèle et à quel coût ? Un petit intégrateur serait-il traité comme l’entreprise ayant effectué l’entraînement ? Les réponses détermineraient les possibilités d’entrée sur le marché.

## Des règles adaptées au problème rencontré

La *distillation* consiste à entraîner un modèle à partir de réponses ou de comportements d’un autre. Elle peut avoir des usages autorisés, par exemple lorsqu’une entreprise distille son propre modèle. Anthropic le rappelle dans sa [présentation de la technique et de ses accusations](https://www.anthropic.com/news/detecting-and-preventing-distillation-attacks).

Le **23 février 2026**, Anthropic a cependant accusé DeepSeek, Moonshot et MiniMax d’avoir mené des campagnes non autorisées au moyen de comptes frauduleux. Il s’agit d’allégations de l’entreprise sur les usages de son service. Le corpus examiné ne permet ni un audit indépendant complet de leur attribution, ni une estimation de leur contribution à l’entraînement final des modèles concernés. [Présentation des accusations par Anthropic](https://www.anthropic.com/news/detecting-and-preventing-distillation-attacks).

La réponse dépend du problème établi : comptes frauduleux, droits d’utilisation ou capacités dangereuses. Chacun appelle une justification et des mesures adaptées à son périmètre. Généraliser une accusation d’abus de service à l’ensemble des modèles ouverts escamoterait cette analyse.

Il reste une différence de sécurité réelle à examiner : une fois les poids diffusés et copiés, leur concepteur ne peut plus retirer toutes les copies ni en contrôler chaque utilisation. Le rapport de la **NTIA de juillet 2024** recommandait de réunir des preuves sur les risques et d’adapter les mesures si des risques plus élevés apparaissaient. Ce cadre historique ne tranche pas la dangerosité d’un modèle de septembre 2026. [Cadre d’analyse de la NTIA](https://www.ntia.gov/programs-and-initiatives/artificial-intelligence/open-model-weights-report).

Un examen rigoureux peut donc retenir deux faits sans les faire s’annuler : l’ouverture peut améliorer les possibilités de contrôle et de concurrence du client ; elle limite aussi certains moyens d’intervention du concepteur. Leur importance dépend du modèle, de ses usages et des protections réellement disponibles.

## L’avance doit encore trouver son acheteur

Les éléments réunis permettent de préciser la pression exercée par les modèles chinois. **Elle apparaît dès qu’une alternative devient utilisable, juridiquement exploitable et suffisamment fiable pour un travail qui rapporte de l’argent.** Elle n’attend pas la disparition de tout écart avec la frontière de recherche.

Cette pression ne signifie pas que les revenus de l’IA doivent s’effondrer. Si un prix est divisé par deux, un doublement du volume suffit arithmétiquement à conserver le chiffre d’affaires correspondant. Cela ne maintient pas automatiquement le bénéfice : il faut payer le service supplémentaire, et la hausse des volumes peut se produire chez un autre acteur. Les perspectives du concepteur, du distributeur et de l’hébergeur peuvent diverger.

Un ralentissement n’a pas non plus une conséquence concurrentielle unique. S’il réduisait temporairement les nouveautés d’un seul acteur alors que les alternatives progressent, il pourrait diminuer la valeur de son avance. Si des obligations rendaient au contraire ces alternatives plus coûteuses ou moins accessibles, il pourrait préserver une partie du pouvoir de fixation des prix des acteurs déjà installés. Ce sont des scénarios conditionnels, pas une causalité démontrée dans le dossier actuel.

Le débat ouvert dans le [premier volet sur le droit de continuer à développer l’IA](/posts/ia-ralentissement-1-qui-pourra-continuer/) prend ici une dimension très concrète : quelles activités les règles rendraient-elles plus difficiles, pour quel gain de sécurité ? Les licences chinoises méritent le même examen. Un téléchargement public peut coexister avec des restrictions commerciales importantes.

Pour le client, le test final reste terre à terre. Il faut une tâche correctement accomplie, une facture qui inclut le travail de correction et une possibilité de partir qui ne s’arrête pas au bouton de téléchargement. **Une avance technique garde de la valeur lorsqu’elle améliore ce résultat. Ailleurs, une alternative crédible oblige déjà à en discuter le prix.**

## Sources

- Cursor, 2026-03-27. [A technical report on Composer 2](https://cursor.com/blog/composer-2-technical-report).
- Cursor, consulté le 27 septembre 2026. [Composer](https://cursor.com/composer).
- DeepSeek, 2026-09-10. [Introducing DeepSeek-V4.1-Flash](https://deepseek.com/en/news/deepseek-v4-1-flash/).
- Open Source Initiative, consulté le 27 septembre 2026. [The Open Source AI Definition](https://opensource.org/ai/open-source-ai-definition).
- DeepSeek, consulté le 27 septembre 2026. [V4.1 Flash: MIT License](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash/raw/main/LICENSE).
- Qwen, consulté le 27 septembre 2026. [Qwen3.8-27B: model card](https://huggingface.co/Qwen/Qwen3.8-27B).
- Qwen, consulté le 27 septembre 2026. [Qwen3.8-Flash-Next: Qwen Community License 1.0](https://huggingface.co/Qwen/Qwen3.8-Flash-Next/raw/main/LICENSE).
- Moonshot AI, consulté le 27 septembre 2026. [Kimi K2.5: modified MIT licence](https://huggingface.co/moonshotai/Kimi-K2.5/blob/main/LICENSE).
- DeepSeek, consulté le 27 septembre 2026. [DeepSeek-V4.1-Flash: model card](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash).
- Kapoor et al., 2024-07-01. [AI Agents That Matter](https://arxiv.org/abs/2407.01502).
- Jack Edwards / Luke Emberson, Epoch AI, 2026-05-29. [Open models lag state-of-the-art closed models by 4 months](https://epoch.ai/data-insights/open-closed-eci-gap).
- DeepSeek, consulté le 27 septembre 2026. [Models & Pricing](https://api-docs.deepseek.com/quick_start/pricing/).
- Federal Trade Commission, 2025-01-17. [FTC Issues Staff Report on AI Partnerships & Investments Study](https://www.ftc.gov/news-events/news/press-releases/2025/01/ftc-issues-staff-report-ai-partnerships-investments-study).
- Amazon Web Services, 2025-01-30. [DeepSeek-R1 models now available on AWS](https://aws.amazon.com/blogs/aws/deepseek-r1-models-now-available-on-aws/).
- Industry signatories / Microsoft hosting, 2026-07-24. [Open Weights and American AI Leadership](https://www.microsoft.com/en-us/corporate-responsibility/topics/open-weight/).
- Anthropic, 2026-07-27. [Our position on open-weights models](https://www.anthropic.com/news/position-open-weights-models).
- Dario Amodei, consulté le 27 septembre 2026. [We Must Pace the Frontier](https://darioamodei.com/post/we-must-pace-the-frontier).
- Anthropic, 2026-02-23. [Detecting and preventing distillation attacks](https://www.anthropic.com/news/detecting-and-preventing-distillation-attacks).
- NTIA, 2024-07-30. [Dual-Use Foundation Models with Widely Available Model Weights Report](https://www.ntia.gov/programs-and-initiatives/artificial-intelligence/open-model-weights-report).

## Méthode et limites

Enquête documentaire arrêtée au **27 septembre 2026**. Les annonces, licences et tarifs des fournisseurs sont utilisés pour établir leurs produits, leurs droits et leurs positions publiées. Ils ne constituent pas une vérification indépendante des performances ou des coûts de production. Aucun benchmark, entraînement, audit de sécurité ou test de migration n’a été exécuté pour cet article. Aucun échange contradictoire direct n’a été engagé avec les entreprises.

Les deux graphiques présentent respectivement des résultats fournisseur et une simulation l0g. L’illustration de partage est une création conceptuelle, sans représentation d’un matériel réel. L’exemple de coût humain est entièrement fictif ; les tarifs DeepSeek sont un instantané en dollars américains, pas une moyenne de marché ni une comparaison de qualité. Les publications de 2024 et 2025 sont datées et ne sont pas présentées comme un relevé contractuel de septembre 2026. Les licences doivent être vérifiées pour la version et l’activité envisagées ; ce texte n’est pas un avis juridique individualisé.
