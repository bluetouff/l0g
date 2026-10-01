---
title: "Google : combien vaut l’accès à nos recherches ?"
seoTitle: "Données Google Search : prix d’accès, DMA et vie privée | l0g"
description: "Google conteste le partage de données de recherche. Analyse du DMA, des seuils d’accès, du prix futur et des protections de la vie privée."
pubDate: "2026-10-01T16:41:06+02:00"
updatedDate: "2026-10-01T16:41:06+02:00"
ogImage: "/illustrations/news/google-search-data-access-2026-v1.jpg"
tags: ["Google", "DMA", "Données personnelles", "Concurrence", "IA"]
draft: false
quickTake: {"fact": "La décision européenne encadre un accès payant aux observations de Google Search pour les moteurs éligibles, y compris certains chatbots.", "importance": "Le prix des données et les coûts des contrôles détermineront quels concurrents pourront réellement exploiter cet accès.", "uncertainty": "Le barème définitif, l’issue du contentieux et l’efficacité du fichier livré restent à vérifier."}
---

Un moteur de recherche apprend aussi dans l’intervalle entre la question et le clic. La personne qui écrit « fuite sous évier » ne précise pas toujours si elle cherche un plombier, une notice ou une pièce détachée. Les résultats consultés, leur position et les reformulations suivantes apportent des indices. Répétées à grande échelle, ces interactions deviennent une matière première pour améliorer la recherche. Leur interprétation exige toutefois de corriger les biais de présentation : un lien bien placé reçoit davantage d’attention. [8](#source-8) [9](#source-9)

C’est l’accès à cette matière première qui oppose Google à la Commission européenne. Une décision du **16 juillet 2026** précise les conditions de partage de données de recherche avec des concurrents. Le **30 septembre**, Reuters rapporte que Google a demandé au Tribunal de l’Union européenne de suspendre cette obligation, au motif d’un risque grave pour la vie privée. [1](#source-1) [3](#source-3)

Derrière le contentieux se trouve une question économique concrète : à quel prix un concurrent peut-il acheter des observations utiles, et combien doit-il encore dépenser pour en faire un meilleur moteur ? La réponse passe par les conditions d’entrée, les frais communs et la transformation des données avant livraison.

## Les données ouvertes aux concurrents

Le [Digital Markets Act, ou DMA](/glossaire/dma/), est le règlement européen qui encadre certaines grandes plateformes désignées comme contrôleurs d’accès. Son article 6, paragraphe 11, prévoit l’accès d’autres moteurs aux données de classement, de requête, de clic et de consultation, dans des conditions équitables, raisonnables et non discriminatoires. Les données personnelles des utilisateurs ayant effectué les recherches doivent être anonymisées. La décision de juillet spécifie l’exécution de cette obligation pour Google Search. [6](#source-6) (art. 6(11) et considérant 61) [1](#source-1)

Le produit proposé à un concurrent est un ensemble d’observations sur l’usage du moteur. Il peut aider à comprendre une formulation, identifier des pages à explorer ou améliorer leur classement. Google conserve ses algorithmes et son infrastructure. Le destinataire doit développer sa propre technologie à partir des signaux reçus. La décision englobe les chatbots qui proposent une fonction de recherche ; leur accès est lié à cette activité. [1](#source-1) (annexe, §9–24 et §51–54)

Cette distinction devient très concrète avec l’IA. Un assistant qui cherche des documents pour étayer une réponse peut améliorer la sélection de ses sources grâce aux données. La décision exclut en revanche l’entraînement du grand modèle généraliste sous-jacent ; sa motivation précise cette exclusion pour le préentraînement. Des modèles spécialisés peuvent être entraînés ou ajustés pour améliorer la recherche, le classement et l’ancrage des réponses dans des sources, souvent appelé *grounding*. Cette permission ne s’étend pas au modèle généraliste sous-jacent. [1](#source-1) (§854 ; annexe, §51 et note 6)



Les flux financiers suivent le même découpage. Le concurrent rémunère Alphabet pour l’accès. Il finance ensuite ses équipes, ses traitements et les contrôles exigés chez lui. Les utilisateurs qui ont produit les interactions ne reçoivent aucune rémunération individuelle prévue par ce mécanisme. Le bénéfice que la Commission attend pour eux prend la forme de services concurrents et d’un choix plus large. Il s’agit de l’objectif annoncé, dont les résultats devront être mesurés après mise en œuvre. [1](#source-1) (annexe, §87–100) [11](#source-11)

## Pourquoi un fichier de clics demande encore du travail

Imaginons deux liens affichés chacun mille fois. Le premier est examiné dans 80 % des cas, le second dans 20 %. Supposons qu’un utilisateur qui examine l’un ou l’autre ait la même probabilité de cliquer : 20 %. On obtient alors 160 clics pour le premier, contre 40 pour le second.

Une lecture superficielle voit un résultat quatre fois plus performant. Dans notre exemple, toute la différence vient de l’exposition. Rapportés aux occasions où le lien a effectivement été examiné, les clics représentent 20 % dans les deux cas. **Ces nombres sont hypothétiques**, destinés à isoler le mécanisme ; ils ne décrivent ni Google ni un concurrent.

Les travaux de recherche sur les clics documentent depuis longtemps ce problème. Une étude de Joachims et ses coauteurs, publiée en 2005, examine le rapport entre attention visuelle, clics et pertinence. Un article de chercheurs de Google publié en 2018 étudie l’estimation du biais de position dans la recherche personnelle. Ces travaux établissent l’importance du problème et des méthodes de correction ; ils ne chiffrent pas le gain qu’apporterait le jeu européen de 2026. [9](#source-9) [8](#source-8)

<figure class="infographic" style="max-width:28rem;margin:2rem auto;padding-bottom:1.25rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 482" role="img" aria-labelledby="google-search-fr-click-title google-search-fr-click-desc" style="width:100%;height:auto">
<title id="google-search-fr-click-title">L’exposition change les clics</title>
<desc id="google-search-fr-click-desc">Clics par affichage : A 16 %, B 4 %. Clics par examen : A et B 20 %. Exemple hypothétique · taux de clic.</desc>
<rect width="480" height="482" rx="12" fill="var(--color-surface)" />
<text x="28" y="40" text-anchor="start" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700">L’exposition change les clics</text>
<text x="28" y="72" text-anchor="start" fill="var(--color-muted)" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400">Exemple hypothétique · taux de clic</text>
<text x="28" y="108" text-anchor="start" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="700">Clics / affichages</text>
<text x="28" y="264" text-anchor="start" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="700">Clics / examens</text>
<text x="28" y="142" text-anchor="start" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="400">Lien A · 160 / 1 000</text>
<rect x="28" y="150" width="240.00000000" height="18" fill="var(--color-signal)" />
<text x="452" y="168" text-anchor="end" fill="var(--color-signal)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700">16 %</text>
<text x="28" y="206" text-anchor="start" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="400">Lien B · 40 / 1 000</text>
<rect x="28" y="214" width="60.00000000" height="18" fill="var(--color-accent)" />
<text x="452" y="232" text-anchor="end" fill="var(--color-accent)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700">4 %</text>
<text x="28" y="294" text-anchor="start" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="400">Lien A · 160 / 800</text>
<rect x="28" y="302" width="300.00000000" height="18" fill="var(--color-signal)" />
<text x="452" y="320" text-anchor="end" fill="var(--color-signal)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700">20 %</text>
<text x="28" y="358" text-anchor="start" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="400">Lien B · 40 / 200</text>
<rect x="28" y="366" width="300.00000000" height="18" fill="var(--color-accent)" />
<text x="452" y="384" text-anchor="end" fill="var(--color-accent)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700">20 %</text>
<text x="28" y="462" text-anchor="start" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="700">Même clic après examen : 20 %</text>
<path d="M28 400 H328" stroke="var(--color-line-strong)" fill="none" />
<text x="28" y="428" text-anchor="middle" fill="var(--color-muted)" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400">0</text>
<text x="178.0" y="428" text-anchor="middle" fill="var(--color-muted)" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400">10</text>
<text x="328" y="428" text-anchor="middle" fill="var(--color-muted)" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400">20 %</text>
</svg>
<figcaption>Modèle pédagogique l0g : 1 000 affichages par lien, 800 examens pour A et 200 pour B, probabilité de clic de 20 % après examen. Échelle commune 0–20 %. Le nombre d’examens est supposé connu ; ces valeurs ne mesurent pas la pertinence réelle ni Google. Fondements : <a href="#source-8">Wang et al., 2018</a> et <a href="#source-9">Joachims et al., 2005</a>. <a href="/data/google-search-click-bias-example.csv">Hypothèses et calculs CSV</a>.</figcaption>
</figure>

L’acheteur doit donc évaluer ce qu’il apprend réellement. Des requêtes rares peuvent être très utiles pour comprendre un vocabulaire spécialisé. Des données plus anciennes restent intéressantes pour des besoins durables, tout en renseignant moins bien sur un événement qui vient de se produire. La valeur du fichier dépend de son contenu après filtrage, des métadonnées conservées et de la capacité du destinataire à en extraire un signal transférable à son propre public.

Cette étape pèse sur le coût total. L’obtention d’un fichier règle une question d’accès. L’entraînement, les tests de qualité, la maintenance d’un index et l’acquisition d’utilisateurs restent à financer. La rentabilité du projet dépend du gain obtenu sur ces activités, avec une incertitude propre à chaque moteur.

## Avant le prix, le droit d’entrer

Le cadre publié réserve l’accès aux moteurs établis ou aux nouveaux entrants jugés crédibles selon des critères précis. Une entreprise doit avoir proposé un moteur dans l’Union pendant au moins les deux dernières années consécutives ; une entreprise fondée depuis moins de deux ans dispose d’une autre voie si elle a reçu **plus de 50 millions d’euros d’investissements en capital**. Dans les deux cas s’ajoute une condition : **au moins 50 000 utilisateurs mensuels moyens dans l’Union au cours de l’année précédente**. [1](#source-1) (annexe, §3(c), page PDF 343)

Le seuil de 50 millions concerne donc la seconde voie, celle des entreprises récentes. Une société plus ancienne déjà active dans la recherche peut remplir le critère d’ancienneté sans avoir levé cette somme. À l’inverse, disposer de capitaux ne remplace pas la condition d’audience. D’autres vérifications portent notamment sur la sécurité, les sanctions et les conditions de traitement ou de transfert des données. [1](#source-1) (annexe, §1–8)



Ces règles délimitent le marché auquel s’appliquerait la tarification. Une petite équipe lançant son premier prototype ne remplit pas, à elle seule, les critères décrits. L’instrument vise des acteurs possédant déjà une certaine activité ou des moyens financiers importants, avec une audience minimale dans les deux cas.

Les contrôles ajoutent un second engagement. Avant l’accès, un auditeur indépendant doit examiner les protections du bénéficiaire. Un contrôle de conformité suit dans les six mois après le début du traitement, puis au moins annuellement. Il faut notamment organiser un environnement séparé, limiter les accès et empêcher les utilisations interdites. Pour le moteur candidat, ces dépenses s’ajoutent à la facture de Google. [2](#source-2) (conditions d’éligibilité et d’audit) [1](#source-1) (annexe, §69–86)

## Le prix du fichier et le prix de sa fabrication

La décision permet de comparer deux logiques commerciales. Elle décrit l’offre antérieure d’Alphabet, structurée en tarifs par **mille requêtes uniques**, variant selon le chiffre d’affaires de recherche réalisé par le bénéficiaire dans l’Espace économique européen. Le barème cité au paragraphe 1006 allait de **1,50 euro à 9 euros par mille requêtes uniques**, avec des paliers intermédiaires de 3 et 6 euros. Il s’agit de l’offre examinée avant la décision, et non du futur barème de janvier 2027. [1](#source-1) (§1006, page PDF 271)

Le bilan de l’ancien programme est également instructif : au moment du constat dressé dans la décision, un seul candidat avait obtenu une licence et acheté un petit échantillon. Ce point décrit la situation examinée avant les nouvelles mesures ; il ne mesure pas les accès accordés au 1er octobre. Le document ne permet pas d’attribuer ce faible usage au seul tarif. [1](#source-1) (§13, page PDF 9)

Les mesures de juillet retiennent une autre base : les coûts supplémentaires nécessaires au partage, auxquels peut s’ajouter une rémunération du capital strictement mobilisé à cette fin. Cette rémunération est plafonnée par le coût moyen pondéré du capital d’Alphabet, c’est-à-dire le taux représentant le coût de ses ressources financières. Les postes admis couvrent notamment la préparation, l’anonymisation, le stockage dédié et la transmission. [1](#source-1) (annexe, §87–95)

La frontière de calcul importe. Les dépenses ordinaires de l’entreprise, les investissements historiques sans lien avec la mise à disposition ou les frais juridiques du litige sont exclus de cette base. Alphabet conteste notamment l’approche fondée sur les coûts et le plafond de rémunération du capital ; ses arguments sont reproduits dans la décision. Le document explique aussi les raisons pour lesquelles la Commission retient cette méthode. [1](#source-1) (§1009–1011 ; annexe, §95)

Des exceptions sont prévues. Une marge supplémentaire peut être justifiée dans certaines circonstances, notamment si Alphabet démontre que son propre usage commercial des données ne couvre pas les coûts de collecte efficacement engagés, ou lorsque le bénéficiaire opère à très grande échelle selon les seuils précisés. Les microentreprises et PME bénéficient d’une exemption de cette marge supplémentaire. Le cadre autorise ainsi un traitement différent selon la situation, sous réserve des exigences d’équité et de non-discrimination. [1](#source-1) (annexe, §88–90 et notes 13–15)

**Les documents publics vérifiés au 1er octobre ne donnent pas de barème définitif en euros permettant de chiffrer la facture future d’un candidat.** La page de licence de Google annonce que les détails tarifaires seront transmis aux candidats en temps utile. [13](#source-13) Le calendrier prévoit une offre de prix finalisée et communiquée à la Commission et aux moteurs tiers au plus tard dans les six mois suivant l’adoption, soit en janvier 2027 selon le calendrier publié. La Commission peut prolonger ce délai dans les cas prévus par l’annexe. Les montants qui suivent sont donc un modèle pédagogique. [2](#source-2) (calendrier de mise en œuvre) [1](#source-1) (annexe, §135–136)

## Votre facture dépend aussi des autres clients

Le prix doit comprendre une partie fixe et une partie récurrente. La première couvre les coûts ponctuels propres au bénéficiaire et sa part des coûts communs de lancement. La seconde couvre ses coûts récurrents propres et une part des coûts communs annuels. La clé initiale repose sur une estimation justifiée des bénéficiaires attendus. Pour finaliser les prix dans les six mois suivant l’adoption, le décompte inclut les moteurs ayant demandé l’éligibilité et engagé un auditeur pour le premier contrôle, ainsi que ceux déjà jugés éligibles. La même composante fixe s’applique ensuite aux bénéficiaires effectifs, quelle que soit leur date d’entrée, sous réserve de coûts propres objectivement différents. Les coûts communs récurrents sont répartis chaque année entre les bénéficiaires effectivement servis. [1](#source-1) (annexe, §94, §97 et §135)

Prenons une hypothèse volontairement simple. La mise en place du service représente 600 000 euros de coûts communs, répartis initialement entre quatre bénéficiaires, auxquels s’ajoutent 30 000 euros d’intégration pour chacun. La composante fixe atteint **180 000 euros par bénéficiaire**.

Supposons ensuite 400 000 euros de coûts communs annuels et 20 000 euros de coûts récurrents propres à chaque client. Avec quatre clients actifs, la composante annuelle vaut **120 000 euros par client**. Elle monte à **220 000 euros** s’ils ne sont plus que deux et descend à **70 000 euros** s’ils sont huit. Tous les coûts unitaires et le périmètre du service sont maintenus constants dans ce calcul.

<figure class="infographic" style="max-width:28rem;margin:2rem auto;padding-bottom:1.25rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 390" role="img" aria-labelledby="google-search-fr-cost-title google-search-fr-cost-desc" style="width:100%;height:auto">
<title id="google-search-fr-cost-title">Les coûts communs se partagent</title>
<desc id="google-search-fr-cost-desc">Coût annuel par bénéficiaire : 220 000 euros à deux, 120 000 à quatre, 70 000 à huit. Hypothèses · milliers d’€ par an.</desc>
<rect width="480" height="390" rx="12" fill="var(--color-surface)" />
<text x="28" y="40" text-anchor="start" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700">Les coûts communs se partagent</text>
<text x="28" y="72" text-anchor="start" fill="var(--color-muted)" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400">Hypothèses · milliers d’€ par an</text>
<text x="28" y="116" text-anchor="start" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="400">2 bénéficiaires</text>
<rect x="28" y="128" width="250.00000000" height="18" fill="var(--color-signal)" />
<rect x="278.0" y="128" width="25.00000000" height="18" fill="var(--color-accent)" />
<text x="452" y="146" text-anchor="end" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700">220</text>
<text x="28" y="184" text-anchor="start" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="400">4 bénéficiaires</text>
<rect x="28" y="196" width="125.00000000" height="18" fill="var(--color-signal)" />
<rect x="153.0" y="196" width="25.00000000" height="18" fill="var(--color-accent)" />
<text x="452" y="214" text-anchor="end" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700">120</text>
<text x="28" y="252" text-anchor="start" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="400">8 bénéficiaires</text>
<rect x="28" y="264" width="62.50000000" height="18" fill="var(--color-signal)" />
<rect x="90.5" y="264" width="25.00000000" height="18" fill="var(--color-accent)" />
<text x="452" y="294" text-anchor="end" fill="var(--color-paper)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700">70</text>
<text x="28" y="378" text-anchor="start" fill="var(--color-signal)" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400">■ Communs</text>
<text x="230" y="378" text-anchor="start" fill="var(--color-accent)" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400">■ Propres au client</text>
<path d="M28 312 H328" stroke="var(--color-line-strong)" fill="none" />
<text x="28" y="340" text-anchor="middle" fill="var(--color-muted)" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400">0</text>
<text x="178.0" y="340" text-anchor="middle" fill="var(--color-muted)" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400">120</text>
<text x="328" y="340" text-anchor="middle" fill="var(--color-muted)" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400">240</text>
</svg>
<figcaption>Modèle pédagogique l0g : coûts communs constants de 400 000 €/an, plus 20 000 €/an propres à chaque client. Échelle commune 0–240 milliers d’euros par bénéficiaire et par an. Le paiement initial de 180 000 € est distinct et absent des barres. Rémunération du capital, marges, taxes et dépenses internes exclues. Ces hypothèses ne chiffrent pas Alphabet. Mécanisme juridique : <a href="#source-1">annexe finale, §§94 et 97</a>. <a href="/data/google-search-shared-cost-example.csv">Hypothèses et calculs CSV</a>.</figcaption>
</figure>

Le modèle isole les coûts, avec paiement initial complet de la partie fixe. Il exclut la rémunération éventuelle du capital, les marges exceptionnelles, les taxes et les dépenses internes des bénéficiaires. Les valeurs ont été choisies pour rendre la répartition visible ; elles n’estiment pas les coûts d’Alphabet. Le droit prévoit par ailleurs une possibilité d’échelonner le paiement fixe, avec un solde restant exigible en cas d’arrêt anticipé de l’accès. [1](#source-1) (annexe, §94 et note 17)

La conséquence économique est conditionnelle mais nette : lorsque les dépenses communes changent peu, un retrait de participants renchérit leur quote-part pour ceux qui restent. Le budget d’un moteur dépend alors aussi du succès commercial du mécanisme chez ses concurrents. À l’entrée, le nombre retenu pour répartir les coûts initiaux demeure distinct du nombre d’abonnés actifs ultérieurs.

## Anonymiser transforme aussi la valeur du produit

Google soutient que le dispositif pourrait exposer des recherches privées avec des protections insuffisantes. Dans sa prise de position du **16 juillet**, Kent Walker évoque notamment la vie privée, les secrets d’affaires et la sécurité. La Commission affirme au contraire avoir construit une méthode combinant transformations techniques, restrictions d’usage et contrôles. Ce désaccord porte sur l’efficacité des protections appliquées au jeu effectivement livré. [5](#source-5) [11](#source-11)

Le parcours prévu commence par la suppression d’identifiants et de détails permettant de relier aisément les enregistrements à un utilisateur. Des requêtes contenant des termes rares ou dépassant les seuils de longueur sont écartées. Des métadonnées sont ensuite généralisées et certaines requêtes supprimées afin que les groupes définis par la localisation, le type d’appareil et la langue comportent au moins **1 000 utilisateurs**. Ce nombre qualifie un groupe de métadonnées ; il ne fixe pas un minimum uniforme de mille répétitions pour chaque formulation de recherche. [1](#source-1) (annexe, §25–45) [2](#source-2) (protections techniques)



Chez le destinataire, l’environnement séparé doit empêcher les rapprochements interdits avec d’autres jeux de données. Les tentatives de réidentification sont proscrites, ainsi que la reconstruction de parcours au-delà des mini-sessions déjà incluses dans les données livrées. La conservation du jeu reçu est limitée à **treize mois**. Les modèles utilisant ces données dans le périmètre autorisé doivent aussi être évalués avant déploiement pour limiter la restitution d’éléments permettant de réidentifier les utilisateurs. [1](#source-1) (annexe, §49–55)

La protection distingue aussi deux personnes : l’auteur de la recherche et celle dont le nom apparaît dans la requête. La FAQ de la Commission précise que l’anonymisation vise le premier. Des informations personnelles sur d’autres personnes peuvent subsister dans le texte recherché ; les moteurs destinataires restent alors responsables du traitement au titre du RGPD. La suppression des identifiants directs ne suffit donc pas à sortir tout le fichier du champ de la protection des données. [2](#source-2) (données personnelles concernant d’autres personnes)

Le problème technique reste exigeant. Les projets de lignes directrices du Comité européen de la protection des données publiés en 2026 examinent la possibilité d’isoler un enregistrement, de le relier à d’autres et d’en déduire des informations sur une personne. Ils insistent sur le contexte et sur les moyens raisonnablement susceptibles d’être utilisés. Ce texte était encore en consultation au 1er octobre ; il ne constitue pas un jugement sur ce fichier Google particulier. [10](#source-10) (§52–65 et §95–103)

La combinaison entre texte libre et métadonnées demande donc des essais sur le jeu transformé et dans les conditions réelles d’accès. Une obligation contractuelle limite les usages autorisés ; les contrôles techniques et les audits doivent permettre d’en vérifier l’exécution. Le projet de lignes directrices conjointes Commission–CEPD sur le DMA et le RGPD développe précisément cette articulation, tout en exigeant des transformations techniques des données. [12](#source-12) (§175–190, projet du 9 octobre 2025)

Pour l’acheteur, le même filtrage modifie l’utilité économique. Perdre des observations rares peut affaiblir les apprentissages sur certains besoins spécialisés. Conserver trop de détails accroît l’exposition des personnes. La bonne mesure porte donc à la fois sur la couverture des cas d’usage et sur le risque résiduel de réidentification. Les documents publics consultés ne permettent pas de reproduire intégralement les essais sur les données effectives.

## Sept jours, treize mois et cinq ans

Le calendrier du produit comporte trois durées différentes. Le partage intervient avec **au moins sept jours de latence** après la requête. Le destinataire peut conserver les données reçues pendant **treize mois au maximum**. Son accès est prévu pour la durée choisie, dans la limite de **cinq ans à compter de l’accès effectif**. Cette dernière limite concerne chaque bénéficiaire ; l’obligation d’offrir le service continue tant que Google Search demeure désigné au titre du DMA. [1](#source-1) (annexe, §17–24 et §55)



Un moteur qui traite une actualité récente doit donc garder son propre accès aux pages fraîches. Le fichier peut l’aider à améliorer ses méthodes de sélection sans devenir son flux d’actualité instantané. La fenêtre de treize mois limite l’accumulation du jeu brut, tandis que les cinq ans donnent un horizon au projet d’intégration. Le modèle économique doit tenir compte de la fin de cet accès individuel et des capacités que le bénéficiaire aura construites entre-temps.

À cette temporalité industrielle se superpose celle du juge. Reuters a rapporté le recours le **29 septembre**, puis la demande de suspension le **30 septembre**. Les dépêches sont ici datées par leur publication ; la date exacte de dépôt n’est pas vérifiée sur une pièce judiciaire. L’article 278 du traité prévoit qu’un recours n’a pas, par lui-même, d’effet suspensif. **Au 1er octobre 2026, aucune décision accordant la suspension demandée n’a pu être vérifiée dans les sources consultées.** La recherche n’a pas permis de consulter directement la requête déposée. [4](#source-4) [3](#source-3) [7](#source-7)

L’incertitude peut modifier le moment auquel un candidat engage ses dépenses d’intégration. Elle touche aussi la fabrication du jeu et l’organisation des contrôles. Son coût dépend des contrats, des dépenses déjà engagées et de leur réutilisation possible ; aucune estimation agrégée fiable ne ressort des sources examinées.

## Les critères pour juger la réforme

Le futur prix publié sera une première information, à compléter par le coût des audits, de l’environnement sécurisé et du travail d’intégration. Viendront ensuite les résultats des tests : couverture des langues, traitement des demandes rares, amélioration des réponses et détection des risques pour les personnes. Enfin, il faudra observer les services effectivement lancés, leurs utilisateurs et leur capacité à financer l’exploitation.

L’accès aux observations de Google peut réduire une difficulté bien identifiée, celle d’apprendre avec peu d’interactions. Le dispositif laisse à chaque concurrent le travail de construire son produit et de trouver son public. Il encadre aussi cet accès par des seuils, un prix et une durée. Pour savoir ce que vaut la réforme dans les faits, il faudra suivre ce trajet complet, depuis les données transformées jusqu’à un moteur que des utilisateurs choisissent réellement.

## Approfondir l’économie de nos traces

Notre enquête sur le [commerce des traces numériques](/posts/commerce-traces-economie-collecte-donnees-personnelles/) suit leur collecte et leur valeur économique. Son volet sur la [fabrication des profils](/posts/commerce-traces-fabrication-profils-donnees-personnelles/) distingue les observations et les inférences ; celui consacré au [coût des sanctions](/posts/commerce-traces-prix-regle-sanctions-donnees-personnelles/) examine les incitations à respecter les règles. Le glossaire précise la [pseudonymisation](/glossaire/pseudonymisation/) et les données qui peuvent encore être rattachées à une personne.

## Sources et documents

<ol class="l0g-google-sources">
<li id="source-1"><a href="https://ec.europa.eu/competition/digital_markets_act/cases/202637/DMA_100209_2799.pdf">DMA.100209 : SP : Alphabet : Article 6(11), C(2026) 5091 final</a>. Décision finale du 16 juillet 2026, version publique non confidentielle.</li>
<li id="source-2"><a href="https://digital-markets-act.ec.europa.eu/businesses-portal/data-access/alphabet-specification-proceedings-sharing-google-search-data_en">Alphabet specification proceedings : Sharing of Google Search data</a>. FAQ vérifiée le 1er octobre 2026.</li>
<li id="source-3"><a href="https://www.investing.com/news/stock-market-news/google-asks-eu-court-to-suspend-order-to-open-up-to-ai-chatbots-search-engine-rivals-4925681">Google asks EU court to suspend order to open up to AI chatbots, search engine rivals</a>. Reuters, 30 septembre 2026, reprise accessible.</li>
<li id="source-4"><a href="https://live.euronext.com/en/financial-news/google-challenges-eu-orders-open-ai-search-engine-rivals">Google challenges EU orders to open up to AI, search-engine rivals</a>. Reuters, 29 septembre 2026, reprise accessible.</li>
<li id="source-5"><a href="https://blog.google/intl/de-de/feed/dma-sicherheit-privatsphaere-nicht-untergraben/">Der DMA darf Sicherheit und Privatsphäre für Europäer nicht untergraben</a>. Position de Google, 16 juillet 2026.</li>
<li id="source-6"><a href="https://eur-lex.europa.eu/eli/reg/2022/1925/oj">Règlement (UE) 2022/1925 : Digital Markets Act</a>. Article 6(11) et considérant 61.</li>
<li id="source-7"><a href="https://eur-lex.europa.eu/eli/treaty/tfeu_2016/art_278/oj/eng">TFUE : version consolidée : article 278</a>. Article 278 : absence d’effet suspensif automatique.</li>
<li id="source-8"><a href="https://research.google/pubs/position-bias-estimation-for-unbiased-learning-to-rank-in-personal-search/">Position Bias Estimation for Unbiased Learning to Rank in Personal Search</a>. WSDM 2018, pp. 610–618.</li>
<li id="source-9"><a href="https://www.cs.cornell.edu/people/tj/publications/joachims_etal_05a.pdf">Accurately Interpreting Clickthrough Data as Implicit Feedback</a>. SIGIR 2005, pp. 154–161.</li>
<li id="source-10"><a href="https://www.edpb.europa.eu/system/files/2026-09/edpb_guidelines_202602_anonymisation_v1_en_0.pdf">Guidelines 02/2026 on anonymisation, version 1.0</a>. Projet du 7 juillet 2026 ; consultation jusqu’au 30 octobre.</li>
<li id="source-11"><a href="https://digital-markets-act.ec.europa.eu/commission-provides-guidance-google-ai-interoperability-android-and-sharing-google-search-data-under-2026-07-16_en">Commission provides guidance to Google on AI interoperability on Android and sharing of Google Search data under DMA</a>. Communiqué du 16 juillet 2026 ; volet recherche.</li>
<li id="source-12"><a href="https://digital-markets-act.ec.europa.eu/document/download/8ba0913f-2778-4a6d-9c58-10f8c7ead009_en?filename=Joint_COM-EDPB_GLS_interplay_DMA_GDPR_for_public_consultation.pdf">Joint guidelines on the interplay between the Digital Markets Act and the General Data Protection Regulation</a>. Projet du 9 octobre 2025 ; §§175–190.</li>
<li id="source-13"><a href="https://developers.google.com/search/help/about-search-data-program">About the Google Search Data Licensing Program</a>. Programme de licence ; page vérifiée le 1er octobre 2026.</li>
</ol>

## Périmètre et méthode

Analyse arrêtée au **1er octobre 2026**. Le volet Android de la décision du 16 juillet est distinct et reste hors du présent dossier. La lecture juridique repose principalement sur la décision DMA.100209 et son annexe finale, dans leur version publique non confidentielle. Les parties occultées ne sont pas reconstituées. Les deux modèles chiffrés sont pédagogiques : leurs hypothèses, unités et calculs figurent sous les graphiques et dans les fichiers accompagnant l’article. Les positions de Google et de la Commission sont attribuées ; l’issue du contentieux et l’efficacité réelle du dispositif restent ouvertes.
