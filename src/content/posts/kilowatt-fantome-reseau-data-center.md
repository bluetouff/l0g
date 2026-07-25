---
title: "Le kilowatt fantôme : qui paie le réseau si le data center ne vient jamais ?"
description: "Le pledge de la Maison-Blanche promet que les data centers paieront leur réseau. Les tarifs américains révèlent la vraie mécanique : engagements minimaux, collatéral, actifs échoués et risque de transfert vers les abonnés."
pubDate: 2026-07-25T10:39:51+02:00
updatedDate: 2026-07-25T10:39:51+02:00
tags: ["ia", "data centers", "électricité", "infrastructures", "risque", "régulation", "politique us"]
draft: false
---

Un data center annonce qu'il aura besoin de 1 000 mégawatts. Le gestionnaire de réseau inscrit la charge dans ses prévisions, réserve des capacités, renforce des lignes et prépare de nouvelles centrales. Puis le projet est retardé, réduit, déplacé ou abandonné. L'électricité ne sera jamais consommée, mais une partie du réseau a déjà été planifiée ou construite.

Voilà le **kilowatt fantôme** : une demande annoncée qui influence l'investissement avant d'être devenue une consommation réelle. Le terme est une image, pas une catégorie réglementaire. Le risque, lui, est bien identifié. La Federal Energy Regulatory Commission, la FERC, avertit que des demandes spéculatives ou déposées auprès de plusieurs réseaux peuvent être comptées plusieurs fois, fausser les prévisions et envoyer de mauvais signaux d'investissement. Le Department of Energy cite explicitement le risque d'[actifs échoués](/glossaire/actif-echoue/) lorsque les infrastructures financées pour une grande charge restent sous-utilisées.

La question n'est donc pas seulement de savoir si les data centers feront monter la consommation électrique. Elle est de savoir **qui garantit la facture avant qu'ils ne consomment**.

## Un pledge n'est pas un tarif

Le 23 juillet 2026, la Maison-Blanche a élargi son *Ratepayer Protection Pledge*. Son principe tient en une phrase : les data centers doivent payer la production, la livraison et les renforcements de réseau qu'ils rendent nécessaires, même s'ils n'utilisent finalement pas l'électricité réservée. La [page officielle](https://www.whitehouse.gov/ratepayer-protection-pledge/) demande notamment aux signataires de négocier des tarifs séparés et de payer la puissance promise, utilisée ou non.

Cette annonce fixe une doctrine politique. Elle ne règle pas, à elle seule, une facture d'électricité. La page parle de structures tarifaires **négociées volontairement**. Or la protection des autres abonnés dépend de textes beaucoup plus prosaïques : tarif approuvé par une commission d'État, contrat de raccordement, accord de recouvrement des coûts, garantie de maison mère, dépôt de garantie et règles applicables en cas d'abandon.

[Reuters](https://www.investing.com/news/stock-market-news/trump-pledge-on-data-center-power-supplies-draws-skepticism-4810938) a rapporté dès le lendemain le scepticisme suscité par le caractère volontaire du pledge. Ce scepticisme est justifié sur un point précis : une promesse nationale ne devient opposable que lorsqu'elle est traduite dans le contrat et dans le tarif compétent.

## Comment une centrale ou une ligne entre dans la facture

Une utility régulée ne facture pas seulement les électrons consommés. Elle recouvre aussi les dépenses d'exploitation, l'amortissement, les taxes et un rendement autorisé sur sa [base d'actifs régulée](/glossaire/rate-base/). Le [rapport de référence du Department of Energy](https://www.energy.gov/sites/prod/files/2017/01/f34/Electricity%20Distribution%20System%20Baseline%20Report.pdf) résume cette mécanique par une équation :

> besoin de revenu = dépenses d'exploitation + amortissement + taxes + taux de rendement × base d'actifs

Si une sous-station ou une ligne est construite pour une charge qui disparaît, trois issues sont possibles.

1. Le client paie malgré tout, grâce à un [engagement minimal garanti](/glossaire/take-or-pay/), des frais de résiliation ou un collatéral saisissable.
2. L'utility et ses actionnaires absorbent tout ou partie de la perte si le régulateur refuse d'intégrer l'investissement aux tarifs.
3. Le coût est intégré à la base tarifaire ou aux charges de réseau, puis réparti entre d'autres clients.

Le troisième scénario est le transfert que les nouveaux tarifs cherchent à empêcher. Mais il ne suffit pas d'écrire « pay if you cancel ». Il faut encore que le contrat couvre les bons ouvrages, la bonne durée et la bonne entité juridique.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 760 420" role="img" aria-label="Chemins possibles du coût d'un réseau construit pour un data center qui ne vient pas" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="760" height="420" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Le réseau est construit, la charge disparaît</text>
  <text x="32" y="61" fill="#8b909b" font-size="12">Le contrat décide où atterrit le coût non récupéré.</text>
  <rect x="244" y="88" width="272" height="60" rx="8" fill="none" stroke="#7aa2f7" stroke-width="1.5"></rect>
  <text x="380" y="114" fill="#e7e9ee" font-size="14" text-anchor="middle" font-weight="700">Ouvrages engagés</text>
  <text x="380" y="134" fill="#8b909b" font-size="11" text-anchor="middle">production, poste, ligne, raccordement</text>
  <path d="M380 148V188 M380 188H136 M380 188H624 M136 188V218 M380 188V218 M624 188V218" fill="none" stroke="#5a5f6b" stroke-width="1.5"></path>
  <rect x="34" y="218" width="204" height="92" rx="8" fill="none" stroke="#5eead4" stroke-width="1.5"></rect>
  <text x="136" y="245" fill="#5eead4" font-size="13" text-anchor="middle" font-weight="700">Client</text>
  <text x="136" y="267" fill="#d6d9df" font-size="10.5" text-anchor="middle">minimum de paiement</text>
  <text x="136" y="284" fill="#d6d9df" font-size="10.5" text-anchor="middle">collatéral, frais de sortie</text>
  <text x="136" y="301" fill="#8b909b" font-size="10" text-anchor="middle">protection la plus directe</text>
  <rect x="278" y="218" width="204" height="92" rx="8" fill="none" stroke="#f5b13d" stroke-width="1.5"></rect>
  <text x="380" y="245" fill="#f5b13d" font-size="13" text-anchor="middle" font-weight="700">Utility / actionnaires</text>
  <text x="380" y="267" fill="#d6d9df" font-size="10.5" text-anchor="middle">investissement refusé</text>
  <text x="380" y="284" fill="#d6d9df" font-size="10.5" text-anchor="middle">ou récupération partielle</text>
  <text x="380" y="301" fill="#8b909b" font-size="10" text-anchor="middle">risque de prudence réglementaire</text>
  <rect x="522" y="218" width="204" height="92" rx="8" fill="none" stroke="#ff4d87" stroke-width="1.5"></rect>
  <text x="624" y="245" fill="#ff4d87" font-size="13" text-anchor="middle" font-weight="700">Autres abonnés</text>
  <text x="624" y="267" fill="#d6d9df" font-size="10.5" text-anchor="middle">coût intégré aux tarifs</text>
  <text x="624" y="284" fill="#d6d9df" font-size="10.5" text-anchor="middle">ou aux charges de réseau</text>
  <text x="624" y="301" fill="#8b909b" font-size="10" text-anchor="middle">transfert recherché à éviter</text>
  <text x="32" y="352" fill="#e7e9ee" font-size="11.5" font-weight="700">Test décisif</text>
  <text x="32" y="374" fill="#8b909b" font-size="11">Les garanties couvrent-elles chaque ouvrage incrémental, jusqu'à son remboursement,</text>
  <text x="32" y="392" fill="#8b909b" font-size="11">avec une contrepartie solvable ? Sources : DOE, FERC.</text>
</svg>
<figcaption>La promesse politique ne choisit pas le chemin. Le tarif, le contrat, le collatéral et la décision du régulateur le font. Le schéma présente des issues possibles, pas la répartition observée dans un dossier particulier.</figcaption>
</figure>

## Le filtre le plus visible se trouve dans l'Ohio

L'expérience d'AEP Ohio montre pourquoi les gestionnaires veulent distinguer un projet sérieux d'une réservation opportuniste. Selon la [mise à jour publiée par l'utility le 13 février 2026](https://www.aepohio.com/company/news/view?releaseID=10753), elle avait reçu plus de **30 000 MW** de manifestations d'intérêt ou de demandes avant l'entrée en vigueur de son nouveau tarif. **13 022,7 MW** ont payé pour entrer dans l'étude formelle et **5 642 MW** ont ensuite signé des contrats juridiquement contraignants assortis de collatéral.

Ces trois nombres ne mesurent pas un taux d'abandon : les étapes, les dates et les périmètres ne sont pas identiques. Ils montrent néanmoins l'écart entre une demande déclarée, une demande assez mûre pour financer une étude et une charge soutenue par un engagement juridique. Les prévisions de réseau doivent cesser de traiter ces trois degrés de maturité comme une seule certitude.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 760 360" role="img" aria-label="Entonnoir des demandes de data centers chez AEP Ohio avant et après qualification" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="760" height="360" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Ohio : de l'intérêt au contrat</text>
  <text x="32" y="61" fill="#8b909b" font-size="12">Puissance déclarée par AEP Ohio, en MW.</text>
  <polygon points="76,92 684,92 618,150 142,150" fill="#7aa2f7" opacity="0.78"></polygon>
  <text x="380" y="119" fill="#0c0d10" font-size="15" text-anchor="middle" font-weight="800">&gt; 30 000 MW</text>
  <text x="380" y="140" fill="#0c0d10" font-size="10.5" text-anchor="middle">manifestations d'intérêt ou demandes</text>
  <polygon points="142,166 618,166 557,224 203,224" fill="#f5b13d" opacity="0.88"></polygon>
  <text x="380" y="193" fill="#0c0d10" font-size="15" text-anchor="middle" font-weight="800">13 022,7 MW</text>
  <text x="380" y="214" fill="#0c0d10" font-size="10.5" text-anchor="middle">étude formelle payée</text>
  <polygon points="203,240 557,240 498,298 262,298" fill="#5eead4" opacity="0.9"></polygon>
  <text x="380" y="267" fill="#0c0d10" font-size="15" text-anchor="middle" font-weight="800">5 642 MW</text>
  <text x="380" y="288" fill="#0c0d10" font-size="10.5" text-anchor="middle">contrats contraignants et collatéral</text>
  <text x="32" y="332" fill="#8b909b" font-size="10.5">Source : AEP Ohio, 13 février 2026. Les trois stades ne constituent pas une cohorte fermée.</text>
</svg>
<figcaption>Chez AEP Ohio, 5 642 MW avaient franchi le filtre du contrat et du collatéral. L'entonnoir illustre un degré de maturité, pas un nombre de projets annulés.</figcaption>
</figure>

Le résultat est instructif, mais la source est l'utility elle-même. Il faut donc lire ces chiffres comme son état de pipeline déclaré, non comme une évaluation indépendante de l'efficacité du tarif. La [Public Utilities Commission of Ohio](https://content.govdelivery.com/accounts/OHPUC/bulletins/3e8bb79) avait approuvé ce dispositif en juillet 2025 en présentant la protection contre les investissements sous-utilisés comme son objectif.

## Virginie et Wisconsin : faire payer la réservation

La Virginie, premier marché américain des data centers, a créé une classe tarifaire distincte pour les nouvelles très grandes charges. La [fiche de la State Corporation Commission](https://www.scc.virginia.gov/media/sccvirginiagov-home/about-the-scc/fact-sheets/scc-data-center-initiatives-02-2026.pdf) prévoit, à compter du 1er janvier 2027, au moins **quatorze ans** d'engagement pour les nouveaux clients concernés. Leur paiement mensuel minimal doit couvrir **85 %** des coûts de transport et de distribution réservés, même si leur consommation est inférieure. Lorsque leur crédit est jugé insuffisant, le collatéral peut atteindre **60 %** des paiements minimaux sur la durée du contrat.

Au Wisconsin, la Public Service Commission a approuvé en avril 2026 un régime pour les charges d'au moins **100 MW**. Son [communiqué officiel](https://psc.wi.gov/Documents/PressReleases/04.24.2026PressRelease.PDF) impose une durée minimale de **quinze ans**, supprime une option qui n'aurait réservé que 75 % de la capacité et exige que les très grands clients paient **100 % des coûts** qui leur sont attribués.

Ces régimes ne sont pas identiques et leurs pourcentages ne sont pas directement comparables. Ils portent sur des composantes, des seuils et des structures tarifaires différents. Leur logique commune est toutefois nette : facturer la **capacité réservée**, pas seulement l'énergie consommée.

## Le contrat peut encore rater la mauvaise facture

Le meilleur contre-exemple vient d'une décision FERC sur un accord entre ComEd et Aligned Data Centers. L'accord accepté prévoit que le client paie des charges de transport même si son projet est retardé ou annulé, ou verse des frais de résiliation. Cela ressemble exactement à la protection recherchée.

Pourtant, dans sa [concurrence publiée par la FERC](https://www.ferc.gov/news-events/news/commissioner-changs-concurrence-transmission-security-agreement-between), la commissaire Judy Chang souligne deux limites. L'accord ne désigne pas les renforcements précis qu'il sécurise. Et certains coûts de réseau pourraient être intégrés à des tarifs formulaires payés par l'ensemble des clients. Si les ouvrages sont importants, un contrat bilatéral peut donc laisser subsister une hausse pour les autres abonnés.

Ce cas donne le bon test éditorial et réglementaire : **payer quelque chose après l'annulation ne prouve pas que le client paie tout ce qu'il a déclenché**.

En juin 2026, la FERC a lancé des procédures visant les grands réseaux régionaux. Le commissaire David Rosner a expliqué que les accords de recouvrement de coûts devaient empêcher qu'un data center absent laisse la facture aux ménages. Il a aussi demandé davantage de transparence sur les demandes spéculatives, la maîtrise physique du site et les dépôts multiples. Dans ses [remarques officielles](https://www.ferc.gov/news-events/news/commissioner-rosners-remarks-large-load-show-cause-orders-e-7-e-12-june-18-2026), il présente ces réformes comme l'effet recherché. Ce n'est pas encore la preuve que chaque tarif final produira cet effet.

## Le risque change d'adresse

Un engagement minimal et un collatéral ne suppriment pas le risque. Ils le déplacent du portefeuille collectif des abonnés vers la qualité de crédit du client.

La protection est robuste si :

- l'entité qui signe est solvable ou garantie par une maison mère solide ;
- le collatéral reste suffisant lorsque le coût du projet augmente ;
- la durée de paiement correspond à la durée de récupération des ouvrages ;
- les frais de sortie couvrent les actifs qui ne peuvent pas être réaffectés ;
- le contrat suit le projet en cas de vente, de restructuration ou de changement de développeur ;
- le régulateur identifie séparément les coûts directement causés par la grande charge.

Elle est fragile si un véhicule faiblement capitalisé signe à la place du groupe, si le dépôt est plafonné trop bas, si une partie des renforcements est diluée dans les charges générales de transport ou si le réseau parie sur des projets encore dupliqués dans plusieurs files d'attente.

Ce déplacement vers le crédit prolonge les risques déjà examinés dans [la dette qui finance l'IA](/posts/la-dette-derriere-l-ia-spv-obligations-credit-prive/) et dans [la valeur résiduelle garantie](/posts/valeur-residuelle-garantie-credit-infrastructure-ia/). La différence est décisive : ici, l'actif potentiellement échoué n'est pas seulement un GPU ou un bâtiment privé. C'est une infrastructure régulée dont le coût peut entrer dans une facture publique.

## État de la preuve

Les sources établissent quatre faits.

1. Les régulateurs considèrent les demandes spéculatives, dupliquées ou insuffisamment mûres comme un problème de prévision et de coût.
2. Plusieurs États ont créé de vraies protections contractuelles : durées minimales, facturation d'une capacité réservée, collatéral et frais de sortie.
3. Le pipeline d'AEP Ohio se réduit fortement à mesure que la demande doit payer une étude puis signer un contrat.
4. La FERC reconnaît qu'un contrat de paiement après annulation peut ne pas couvrir tous les renforcements incorporés aux tarifs généraux.

Elles ne permettent pas de chiffrer une « facture nationale » déjà transférée aux ménages. Aucun jeu de données public harmonisé ne relie encore, projet par projet, charge annoncée, ouvrages engagés, garanties reçues, annulation et récupération finale. Affirmer un montant agrégé serait inventer la donnée manquante.

## Réfutabilité

L'hypothèse d'un risque substantiel de kilowatts fantômes s'affaiblirait si les régulateurs publiaient durablement :

- une correspondance entre mégawatts demandés, étudiés, contractualisés puis réellement mis en service ;
- le coût incrémental de chaque ouvrage et la garantie financière qui lui répond ;
- les frais effectivement recouvrés après retard ou annulation ;
- l'absence de coûts résiduels intégrés aux tarifs des autres clients ;
- la réaffectation vérifiable des équipements initialement construits pour un projet abandonné.

À l'inverse, des annulations assorties de frais inférieurs au coût non réaffectable, ou des renforcements explicitement intégrés aux tarifs collectifs, confirmeraient le mécanisme.

Le pledge de la Maison-Blanche a donc posé la bonne règle. Les commissions d'État et la FERC doivent maintenant publier la preuve de son exécution. Le vrai indicateur ne sera pas le nombre de signatures au bas d'une promesse. Ce sera le nombre de dollars d'infrastructure rendus irrécouvrables par une charge qui ne s'est jamais matérialisée, et l'identité de celui qui les aura finalement payés.

## Sources

1. [Maison-Blanche, *Ratepayer Protection Pledge*](https://www.whitehouse.gov/ratepayer-protection-pledge/), consulté le 25 juillet 2026.
2. [Maison-Blanche, communiqué d'élargissement du pledge](https://www.whitehouse.gov/releases/2026/07/president-trumps-ratepayer-protection-pledge-secures-american-ai-dominance-protects-consumers/), 23 juillet 2026.
3. [FERC, remarques du commissaire David Rosner sur les grandes charges](https://www.ferc.gov/news-events/news/commissioner-rosners-remarks-large-load-show-cause-orders-e-7-e-12-june-18-2026), 18 juin 2026.
4. [FERC, concurrence de la commissaire Judy Chang sur l'accord ComEd-Aligned](https://www.ferc.gov/news-events/news/commissioner-changs-concurrence-transmission-security-agreement-between), 26 février 2026.
5. [FERC, remarques du commissaire See sur la récupération des coûts](https://www.ferc.gov/news-events/news/commissioner-sees-remarks-large-load-show-cause-orders-e-7-e-12-june-18-2026-open), 18 juin 2026.
6. [FERC, ordonnance NYISO, 195 FERC ¶ 61,216](https://www.ferc.gov/sites/default/files/2026-06/EL26-69-000.pdf), 18 juin 2026.
7. [Department of Energy, *Electricity Rate Designs for Large Loads*](https://www.energy.gov/policy/articles/electricity-rate-designs-large-loads-evolving-practices-and-opportunities), 15 octobre 2025.
8. [Department of Energy, *Electricity Distribution System Baseline Report*](https://www.energy.gov/sites/prod/files/2017/01/f34/Electricity%20Distribution%20System%20Baseline%20Report.pdf), 2016.
9. [AEP Ohio, état des demandes de data centers](https://www.aepohio.com/company/news/view?releaseID=10753), 13 février 2026.
10. [Public Utilities Commission of Ohio, approbation du tarif data centers](https://content.govdelivery.com/accounts/OHPUC/bulletins/3e8bb79), 9 juillet 2025.
11. [Virginia State Corporation Commission, *Data Center Initiatives*](https://www.scc.virginia.gov/media/sccvirginiagov-home/about-the-scc/fact-sheets/scc-data-center-initiatives-02-2026.pdf), février 2026.
12. [Public Service Commission of Wisconsin, approbation des tarifs pour grandes charges](https://psc.wi.gov/Documents/PressReleases/04.24.2026PressRelease.PDF), 24 avril 2026.
13. [Reuters, scepticisme autour du pledge](https://www.investing.com/news/stock-market-news/trump-pledge-on-data-center-power-supplies-draws-skepticism-4810938), 24 juillet 2026.
