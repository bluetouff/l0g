---
title: 'L’IA vous demande de payer : les contrats derrière la relance'
seoTitle: 'Recouvrement par IA : contrats et responsabilités | l0g'
description: Qui contrôle les prestataires du recouvrement automatisé ? Rôles RGPD, réutilisation des données, obligations
  d’externalisation et capacité de reprise.
pubDate: '2026-09-25T10:50:27+02:00'
updatedDate: '2026-09-25T10:50:27+02:00'
tags: ["IA", "Recouvrement", "Données personnelles", "Finance", "Enquête"]
draft: false
ogImage: /illustrations/news/ia-recouvrement-contrats-v1.jpg
quickTake:
  fact: Intrum distingue plusieurs rôles selon ses services ; la notice globale d’Ophelos nomme certains prestataires, sans
    établir la chaîne d’un dossier français.
  importance: Les contrats doivent être confrontés aux pouvoirs réels de contrôle et de reprise. Certains gestionnaires de
    crédits sont soumis à des obligations précises.
  uncertainty: Les contrats signés, les destinataires d’un dossier individuel et les résultats de tests de reprise n’ont pas
    été obtenus.
---

**L’IA vous demande de payer · Volet 5**

*Lire aussi : [Volet 1 : décisions](/posts/ia-recouvrement-1-qui-decide-relance/) · [Volet 2 : résultats](/posts/ia-recouvrement-2-gains-annonces/) · [Volet 3 : appel à l’aide](/posts/ia-recouvrement-3-appel-aide/) · [Volet 4 : correction du dossier](/posts/ia-recouvrement-4-corriger-dossier/) · [Volet 6 : données et recours](/posts/ia-recouvrement-6-verifier-droits/).*

**Dans sa présentation française de la protection des données, Intrum distingue deux situations. L’entreprise se déclare responsable du traitement pour certaines activités, notamment le recouvrement et l’acquisition de créances. Pour d’autres services, comme la gestion de facturation, elle indique suivre les instructions de ses clients en tant que sous-traitant. Le nom sur la relance peut donc rester le même alors que le rôle juridique change.** <a href="https://www.intrum.fr/solutions-entreprises/a-propos-d-intrum/donnees-personnelles/" aria-label="Source 1">[1]</a>

Cette distinction donne un point de départ concret à l’examen du recouvrement automatisé. Après avoir suivi les décisions, les gains annoncés, l’accompagnement des difficultés et la correction des dossiers, il reste à remonter les contrats. Qui choisit les objectifs ? Qui autorise l’utilisation des données ? Qui dispose des moyens d’interrompre une opération ou de changer de prestataire ?

Les notices publiques décrivent des rôles et nomment certains fournisseurs. Les textes fixent les obligations du donneur d’ordre et de ses prestataires. **Reste à relier ces responsabilités aux pouvoirs exercés sur les dossiers : donner une instruction, en contrôler l’exécution, interrompre une opération.** <a href="https://www.cnil.fr/fr/rgpd-comment-bien-identifier-son-role" aria-label="Source 2">[2]</a> <a href="https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre4" aria-label="Source 4">[4]</a>

## Un mandat commercial, plusieurs responsabilités

Le premier contrat organise la mission de recouvrement. Dans le champ français du recouvrement amiable pour autrui, l’article R124-3 du Code des procédures civiles d’exécution exige une convention écrite avec le créancier. Elle précise notamment l’origine et les composantes des sommes dues, la rémunération à la charge du créancier et le reversement des fonds. Elle confère au recouvreur le pouvoir d’encaisser pour son compte. <a href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000025938366" aria-label="Source 3">[3]</a>

Ce mandat répond à une question : pour qui l’entreprise agit-elle lorsqu’elle demande un paiement ? Il ne suffit pas à répondre à une autre : qui détermine les utilisations des données personnelles ? La Commission nationale de l’informatique et des libertés (CNIL) rappelle que cette qualification dépend des faits, et non du titre choisi pour le contrat. Au sens du règlement général sur la protection des données (RGPD), le responsable du traitement fixe les finalités et les moyens essentiels. Le sous-traitant traite les données pour son compte, conformément à ses instructions, avec une marge possible sur les moyens techniques. <a href="https://www.cnil.fr/fr/rgpd-comment-bien-identifier-son-role" aria-label="Source 2">[2]</a>

Il faut donc examiner séparément l’envoi d’une relance, l’analyse d’un message et l’éventuelle réutilisation d’un historique. Le simple choix d’un logiciel n’établit pas une responsabilité conjointe. À l’inverse, payer un fournisseur ne dispense pas d’identifier les décisions que celui-ci prend pour ses propres besoins. La CNIL applique également cette analyse par opération aux acteurs qui développent des systèmes d’IA. <a href="https://www.cnil.fr/fr/rgpd-comment-bien-identifier-son-role" aria-label="Source 2">[2]</a> <a href="https://www.cnil.fr/fr/determiner-la-qualification-juridique-des-fournisseurs-de-systemes-dia" aria-label="Source 9">[9]</a>

**Le rôle d’une entreprise ne se déduit pas de sa place dans un organigramme.** Pour le vérifier, il faut savoir qui a déterminé les informations nécessaires, leur durée de conservation et les usages autorisés. Une chaîne de contrats n’est intelligible que si l’on peut rattacher ces choix à des personnes morales identifiées. <a href="https://www.cnil.fr/fr/rgpd-comment-bien-identifier-son-role" aria-label="Source 2">[2]</a>

## Les fournisseurs derrière l’interface

La notice globale d’Ophelos, mise à jour le **25 mars 2025**, cite AWS pour l’hébergement, Front pour le support, Sendgrid pour l’envoi de courriels et Thoughtspot pour l’analyse du site. Elle mentionne séparément Stripe pour le paiement. L’entreprise publie ainsi certains noms, sans détailler les données reçues par chacun, la configuration des dossiers français ou le fournisseur du modèle de langage utilisé pour une réponse donnée. <a href="https://www.ophelos.com/privacy" aria-label="Source 5">[5]</a>

Pour enquêter sur un échange particulier, une liste de marques serait donc trop courte. Il faudrait reconstituer le trajet de l’information : l’entité qui reçoit le message, les services qui le traitent, les personnes pouvant y accéder et les éventuels destinataires d’une copie. Ce travail permettrait aussi de distinguer les données nécessaires au service de celles utilisées ailleurs.

L’avis **22/2024 du Comité européen de la protection des données**, adopté le **7 octobre 2024**, apporte un repère précis. Le responsable du traitement doit disposer de l’identité des sous-traitants et sous-traitants ultérieurs de la chaîne. Il lui appartient de vérifier leurs garanties, avec une intensité adaptée aux risques. Le Comité ne demande toutefois pas de récupérer systématiquement tous les contrats conclus aux étages inférieurs. Connaître la chaîne et vérifier ses garanties ne signifie pas accumuler sans discernement chaque document commercial. <a href="https://www.edpb.europa.eu/system/files/documents/2024-10/edpb_opinion_202422_relianceonprocessors-sub-processors_en.pdf" aria-label="Source 6">[6]</a>

Cette proportionnalité est importante. Pour apprécier une prestation, on peut demander si les éléments examinés portent sur l’usage réel : les données concernées, les possibilités d’accès, la continuité et les actions permises. Un examen très détaillé d’un composant secondaire ne répondrait pas nécessairement à une question laissée ouverte sur l’outil qui autorise l’envoi des relances. C’est un critère de lecture proposé ici, pas le résultat d’un audit des entreprises citées.

## Retrouver les destinataires de ses données

Le destinataire d’une relance dispose lui aussi d’une voie d’information. Dans son arrêt du **12 janvier 2023**, affaire **C-154/21**, la Cour de justice de l’Union européenne a précisé que le droit d’accès permet en principe d’obtenir l’identité concrète des destinataires auxquels les données ont été ou seront communiquées. De simples catégories peuvent suffire lorsque l’identification est impossible, ou lorsque le responsable démontre le caractère manifestement infondé ou excessif de la demande. <a href="https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:62021CJ0154" aria-label="Source 7">[7]</a>

La distinction porte sur le niveau d’information. Une notice générale et la réponse à une demande d’accès n’ont pas exactement le même objet. La seconde peut permettre de passer d’une catégorie, comme les prestataires informatiques, aux destinataires des données de la personne concernée. Cet arrêt ne donne pas pour autant un droit général à tous les contrats de l’entreprise, à son code source ou à une liste de fournisseurs qui n’auraient reçu aucune de ces données. <a href="https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:62021CJ0154" aria-label="Source 7">[7]</a>

Pour notre enquête, une réponse de ce type serait une pièce de rapprochement : est-elle cohérente avec le parcours décrit par l’opérateur et avec les intervenants mentionnés dans ses documents ? Aucune demande individuelle n’a été exercée pour cet article. La liste des destinataires d’un dossier français ne peut donc pas être déduite de la seule notice d’Ophelos.

## Répondre, entraîner, réutiliser

Il faut ensuite distinguer le traitement d’un échange et l’amélioration du produit. Dans la terminologie technique, l’*inférence* désigne ici l’utilisation d’un modèle pour produire un résultat. L’entraînement modifie le modèle à partir de données. L’évaluation sert à mesurer son comportement. Ces opérations peuvent mobiliser des informations différentes et doivent être examinées selon leur finalité, plutôt que réunies sous le mot IA. <a href="https://www.autoritedelaconcurrence.fr/fr/communiques-de-presse/intelligence-artificielle-generative-lautorite-rend-son-avis-sur-le" aria-label="Source 19">[19]</a> <a href="https://cnil.fr/fr/assurer-que-le-traitement-est-licite-reutilisation-des-donnees" aria-label="Source 10">[10]</a>

La notice d’Ophelos prévoit des usages de recherche et développement, notamment pour améliorer ses services, et évoque la création ou l’utilisation de données agrégées, désidentifiées ou anonymisées. Elle ne suffit pas à établir qu’un message individuel a entraîné un modèle externe. Une telle affirmation demanderait d’autres éléments : données effectivement réutilisées, configuration du service et opérations réalisées. <a href="https://www.ophelos.com/privacy" aria-label="Source 5">[5]</a>

Dans sa fiche du **11 janvier 2022**, la CNIL encadre la réutilisation des données confiées à un sous-traitant : autorisation écrite valable, examen de compatibilité selon le fondement du traitement, base légale et information des personnes. **Une autorisation préalable et générale de réutilisation n’est pas légale.** Pour son nouvel usage, le prestataire devient lui-même responsable du traitement. <a href="https://www.cnil.fr/fr/sous-traitants-la-reutilisation-de-donnees-confiees-par-un-responsable-de-traitement" aria-label="Source 8">[8]</a>

<figure style="max-width:560px;margin:2rem auto 2.5rem;">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 350" role="img" aria-labelledby="ia5-fr-fig-title ia5-fr-fig-desc" style="width:100%;height:auto" font-family="Arial, Helvetica, sans-serif">
<title id="ia5-fr-fig-title">Les données changent d’usage, le rôle change</title>
<desc id="ia5-fr-fig-desc">Cas d’un prestataire initialement sous-traitant. Pour la mission du client, il suit ses instructions. En réutilisant les données pour sa propre finalité, il devient responsable de ce nouveau traitement. La licéité de cette réutilisation doit être examinée séparément.</desc>
<g data-region="input"><rect x="70" y="12" width="360" height="66" rx="10" fill="var(--color-surface)" stroke="var(--color-line-strong)"/><text x="250" y="53" text-anchor="middle" font-size="24" font-weight="700" fill="var(--color-paper)">Données confiées</text></g>
<path d="M250 78 V98 H125 V118 M250 98 H375 V118 M119 111 L125 118 L131 111 M369 111 L375 118 L381 111" fill="none" stroke="var(--color-muted)" stroke-width="2"/>
<g data-region="client"><rect x="12" y="126" width="226" height="152" rx="10" fill="var(--color-surface)" stroke="var(--color-signal)"/><text x="125" y="158" text-anchor="middle" font-size="20" fill="var(--color-muted)">Finalité du client</text><text x="125" y="207" text-anchor="middle" font-size="24" font-weight="700" fill="var(--color-signal)">Sous-traitant</text><text x="125" y="244" text-anchor="middle" font-size="20" fill="var(--color-paper)">pour cette mission</text></g>
<g data-region="reuse"><rect x="262" y="126" width="226" height="152" rx="10" fill="var(--color-surface)" stroke="var(--color-accent)"/><text x="375" y="158" text-anchor="middle" font-size="20" fill="var(--color-muted)">Finalité propre</text><text x="375" y="195" text-anchor="middle" font-size="24" font-weight="700" fill="var(--color-accent)">Responsable</text><text x="375" y="223" text-anchor="middle" font-size="20" fill="var(--color-paper)">du traitement</text><text x="375" y="256" text-anchor="middle" font-size="20" fill="var(--color-paper)">pour ce nouvel usage</text></g>
<text x="250" y="320" text-anchor="middle" font-size="22" font-weight="700" fill="var(--color-paper)">Un rôle à qualifier pour chaque usage.</text>
</svg>
<figcaption style="margin:.75rem 0 0;">Cas d’un prestataire initialement sous-traitant. Une réutilisation pour son propre compte exige un examen distinct : autorisation écrite valable, compatibilité selon le fondement, base légale et information. Source : CNIL <a href="https://www.cnil.fr/fr/sous-traitants-la-reutilisation-de-donnees-confiees-par-un-responsable-de-traitement" aria-label="Source 8">[8]</a>.</figcaption>
</figure>

La CNIL distingue aussi le développement d’une IA et son déploiement : il faut qualifier les acteurs pour les opérations auxquelles ils participent réellement. Réutiliser des données déjà détenues impose son propre examen juridique. **Le droit de recevoir une conversation pour traiter un impayé n’emporte pas, à lui seul, la liberté de l’utiliser pour n’importe quel autre produit.** <a href="https://www.cnil.fr/fr/determiner-la-qualification-juridique-des-fournisseurs-de-systemes-dia" aria-label="Source 9">[9]</a> <a href="https://cnil.fr/fr/assurer-que-le-traitement-est-licite-reutilisation-des-donnees" aria-label="Source 10">[10]</a>

La question documentaire est alors simple à formuler, même si sa réponse peut être technique : que devient le message après la réponse au débiteur ? Une description précise devrait distinguer sa conservation pour gérer le dossier, son éventuel examen pour contrôler la qualité et sa réutilisation pour développer le système. Nous n’avons pas obtenu les configurations permettant de reconstituer ces opérations chez les entreprises étudiées.

## Pouvoir reprendre le service

Certains contrats de recouvrement relèvent d’un régime plus spécialisé. Le Code monétaire et financier encadre les gestionnaires intervenant pour des acheteurs de **crédits non performants**, c’est-à-dire classés non performants au sens des règles prudentielles applicables. Le périmètre dépend notamment du prêteur d’origine, du statut du crédit lors de sa cession et de la date du transfert. Les articles L54-11-1 à L54-11-3 prévoient des exclusions, notamment pour certains professionnels et pour les cessions antérieures au **30 décembre 2023**. **Ce régime ne couvre donc pas indistinctement toutes les factures impayées.** <a href="https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006072026/LEGISCTA000048520910/" aria-label="Source 11">[11]</a>

Dans son champ, l’externalisation ne décharge pas le gestionnaire des responsabilités prévues par ce chapitre. L’article L54-11-14, dans sa version en vigueur depuis le **3 mai 2025**, exige notamment un accord écrit, un accès direct aux informations pertinentes et le maintien des obligations envers l’acheteur de crédits et les emprunteurs. Il prévoit surtout qu’après la résiliation le gestionnaire dispose encore de l’expertise et des ressources nécessaires pour exercer les activités externalisées. <a href="https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006072026/LEGISCTA000048520910/" aria-label="Source 11">[11]</a> <a href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000051558621" aria-label="Source 12">[12]</a>

La reprise se prépare dans les opérations : dossiers récupérables, formats exploitables, compétences disponibles et solution de remplacement. Un exercice documenté permettrait d’évaluer ces moyens, les délais et les difficultés rencontrées. Aucun exercice de ce type n’a été observé pour cet article.

Un **arrêté du 24 mars 2026**, publié le **12 avril** et en vigueur depuis le **13 avril**, précise aussi des contrôles pour une externalisation particulière : la réception et la détention des fonds confiées à un autre gestionnaire ou à certains professionnels. Pour cette opération définie à son article 6, les articles 10 et 11 prévoient une évaluation préalable, des possibilités de contrôle et de résiliation, ainsi que l’accord préalable du gestionnaire avant une modification substantielle imposée de la prestation. **Cette obligation vise la prestation de réception et de détention des fonds définie par l’arrêté.** <a href="https://www.legifrance.gouv.fr/loda/id/JORFTEXT000053797360" aria-label="Source 13">[13]</a>

L’intérêt de ce cadre pour l’enquête est d’identifier les pièces à demander lorsque l’activité relève effectivement de ces dispositions. Il serait trompeur de citer une obligation très précise sans établir au préalable que le contrat et le prestataire examinés entrent dans son champ.

## Arrêter l’action, garder une solution de service

La maîtrise du prestataire possède aussi une dimension informatique. Un agent conversationnel peut être limité à proposer un texte, ou disposer d’un accès lui permettant de déclencher une opération. Le guide de sécurité de l’ANSSI du **29 avril 2024** recommande notamment de limiter, voire d’interdire, les actions automatisées réalisées à partir d’entrées non maîtrisées, comme les courriels. Il préconise également une journalisation adaptée et protégée. Ce guide porte sur la cybersécurité ; il ne certifie ni la qualité du recouvrement ni la conformité juridique d’une entreprise. <a href="https://messervices.cyber.gouv.fr/documents-guides/Recommandations_de_s%C3%A9curit%C3%A9_pour_un_syst%C3%A8me_d_IA_g%C3%A9n%C3%A9rative.pdf" aria-label="Source 14">[14]</a>

Voici un scénario de conception, **pas un incident constaté** : le contrat permet au donneur d’ordre de demander la suspension de l’IA. L’équipe technique désactive le modèle, mais un autre composant conserve des messages déjà programmés. L’arrêt du calcul et l’arrêt de l’envoi sont alors deux opérations différentes. L’efficacité de la suspension dépend du périmètre réel des permissions retirées.

Le contrôle utile serait de rapprocher la clause et le moyen d’action. Quelle personne peut bloquer l’envoi ? Son autorisation fonctionne-t-elle sans intervention du fournisseur ? Les opérations déjà engagées sont-elles identifiables ? Comment maintenir une voie de contact pour une personne qui demande une explication ? Ces questions relèvent du protocole proposé, sans présumer les réponses des opérateurs.

Il faut également fixer les conditions de redémarrage. Une équipe peut-elle comparer les versions, comprendre les changements et vérifier le fonctionnement avant de remettre le service en activité ? Ce serait une manière de tester le pouvoir conservé sur le prestataire. Cela n’exige pas de prétendre qu’un modèle restera immuable ; cela exige de savoir quels changements nécessitent quel examen.

Une trace informatique peut aider à reconstruire l’enchaînement : instructions en vigueur, autorisations, version du service, événement déclencheur et résultat de l’opération. Mais enregistrer davantage d’informations n’est pas automatiquement plus protecteur. La CNIL recommande de limiter les données présentes dans les journaux, d’en protéger l’accès et d’éviter notamment la duplication excessive du contenu traité. L’objectif est une trace exploitable, pas une conservation indéfinie de toutes les confidences. <a href="https://www.cnil.fr/fr/securite-tracer-les-operations" aria-label="Source 15">[15]</a>

Suspendre un composant technique ne revient pas non plus à effacer une créance. Dans le schéma proposé, le relais humain ou le service de remplacement doit pouvoir reprendre les demandes légitimes, y compris celles du débiteur. La continuité à vérifier concerne les deux côtés de la relation, pas seulement la faculté d’émettre une nouvelle relance.

## Les conditions de l’indemnisation

Si un préjudice survient, toutes les entreprises de la chaîne ne deviennent pas automatiquement responsables dans les mêmes conditions. L’article 82 du RGPD distingue le responsable du traitement du sous-traitant : ce dernier répond notamment des manquements aux obligations qui lui sont propres ou des actes accomplis hors des instructions licites. Le texte prévoit aussi des possibilités d’exonération et des recours entre acteurs. Lorsque plusieurs participants sont responsables d’un dommage causé par un même traitement, chacun peut devoir le réparer intégralement, puis exercer un recours selon les parts de responsabilité. **La présence d’un fournisseur dans la chaîne ne suffit donc pas à établir sa responsabilité pour chaque dommage.** <a href="https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre8" aria-label="Source 16">[16]</a>

La Cour de justice l’a précisé le **4 mai 2023**, dans l’affaire **C-300/21** : obtenir réparation suppose une violation du règlement, un dommage et un lien causal. La violation seule ne suffit pas. En revanche, un dommage moral n’a pas à atteindre un seuil minimal de gravité, tout en devant être démontré. Le traitement d’une réclamation, le prononcé d’une sanction et l’indemnisation d’une personne sont des démarches différentes. <a href="https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:62021CJ0300" aria-label="Source 17">[17]</a>

L’article ne reconstitue pas les plafonds d’indemnisation ou les garanties négociés entre les entreprises : les contrats signés n’ont pas été obtenus. La répartition commerciale des coûts, les obligations de protection des données et le régime de responsabilité civile doivent être examinés chacun sur leurs pièces et leur fondement.

L’information sur l’IA possède son propre cadre. Selon la Commission européenne, les obligations pertinentes de l’article 50 du règlement européen sur l’IA s’appliquent depuis le **2 août 2026**. Les fournisseurs des systèmes concernés qui interagissent directement avec des personnes doivent les concevoir pour annoncer cette interaction avec une IA dès son commencement, sauf notamment lorsque cette nature est évidente. L’identification des responsables et l’indemnisation relèvent des règles examinées plus haut. <a href="https://digital-strategy.ec.europa.eu/en/faqs/transparency-obligations-under-article-50-ai-act" aria-label="Source 18">[18]</a>

## Les pièces encore manquantes

L’externalisation peut donner accès à des compétences spécialisées et à un service qu’une entreprise aurait du mal à construire seule. Cette possibilité ne doit pas être écartée par principe. Le bon test porte sur les moyens conservés pour connaître, contrôler et remplacer la prestation. L’avis européen sur la sous-traitance lui-même associe l’obligation de vérification à une approche proportionnée aux risques. <a href="https://www.edpb.europa.eu/system/files/documents/2024-10/edpb_opinion_202422_relianceonprocessors-sub-processors_en.pdf" aria-label="Source 6">[6]</a>

Les contrats signés, la liste complète des destinataires d’un dossier français et les configurations de réutilisation restent à obtenir. La capacité à suspendre puis reprendre le service demande aussi une vérification sur le terrain. Le corpus public ne permet de conclure à aucun manquement des entreprises citées sur ces points.

Les pièces les plus utiles seraient les instructions contractuelles correspondant à un usage précis, la chaîne des prestataires de cet usage et un contrôle documenté reliant ces instructions aux opérations autorisées. La pièce décisive sur la continuité serait un exercice de reprise, avec ses résultats et ses difficultés, plutôt qu’une simple mention de réversibilité.

**Le contrat engage une entreprise ; son exécution se vérifie dans les opérations.** Pour prolonger cette enquête, il faudra suivre une instruction jusqu’à l’action qu’elle autorise, puis examiner comment le donneur d’ordre reprend la main lorsque la prestation s’arrête.

## Méthode et limites

Enquête documentaire arrêtée au **25 septembre 2026**, fondée sur des notices d’entreprise, des textes officiels, la jurisprudence européenne et des recommandations d’autorités. Les descriptions d’Ophelos sont de portée globale ; elles ne constituent pas une vérification des déploiements français. Aucun entretien, envoi de questions, accès à un compte ou test de plateforme commerciale n’a été réalisé. Le schéma explique le changement de rôle lors d’une réutilisation des données pour une finalité propre, à partir de la fiche de la CNIL. Il ne représente aucune architecture d’entreprise auditée. Les règles exposées ne remplacent pas l’examen d’un contrat ou d’une situation par un professionnel du droit.

## Sources et repères

<p id="ia5-fr-s01"><strong>[1] Intrum France</strong>. <a href="https://www.intrum.fr/solutions-entreprises/a-propos-d-intrum/donnees-personnelles/" rel="noreferrer">Données personnelles</a>. Page non datée. Rôles déclarés selon le service, notamment facturation et recouvrement.</p>

<p id="ia5-fr-s02"><strong>[2] CNIL</strong>. <a href="https://www.cnil.fr/fr/rgpd-comment-bien-identifier-son-role" rel="noreferrer">Responsable du traitement, sous-traitants : comment bien identifier son rôle ?</a>. 6 juin 2025. Qualification d’après les faits ; distinction des moyens essentiels et techniques.</p>

<p id="ia5-fr-s03"><strong>[3] Légifrance</strong>. <a href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000025938366" rel="noreferrer">Code des procédures civiles d’exécution, article R124-3</a>. Version en vigueur depuis le 1er juin 2012. Convention avec le créancier dans le champ du recouvrement amiable pour autrui.</p>

<p id="ia5-fr-s04"><strong>[4] CNIL / Règlement (UE) 2016/679</strong>. <a href="https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre4" rel="noreferrer">RGPD, chapitre IV : responsable du traitement et sous-traitant</a>. Articles 24, 26, 28 et 32. Responsabilités, garanties et encadrement de la sous-traitance.</p>

<p id="ia5-fr-s05"><strong>[5] Ophelos</strong>. <a href="https://www.ophelos.com/privacy" rel="noreferrer">Global Privacy Policy</a>. Mise à jour du 25 mars 2025. Notice globale et fournisseurs déclarés ; aucune attribution automatique à tous les dossiers français.</p>

<p id="ia5-fr-s06"><strong>[6] Comité européen de la protection des données</strong>. <a href="https://www.edpb.europa.eu/system/files/documents/2024-10/edpb_opinion_202422_relianceonprocessors-sub-processors_en.pdf" rel="noreferrer">Opinion 22/2024 on certain obligations following from the reliance on processor(s) and sub-processor(s)</a>. Adopté le 7 octobre 2024, publié le 9 octobre. Synthèse, pages PDF 2–3 ; identification et vérification des sous-traitants.</p>

<p id="ia5-fr-s07"><strong>[7] Cour de justice de l’Union européenne</strong>. <a href="https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:62021CJ0154" rel="noreferrer">Österreichische Post, C-154/21, EU:C:2023:3</a>. 12 janvier 2023. Destinataires concrets des données et limites du droit d’accès.</p>

<p id="ia5-fr-s08"><strong>[8] CNIL</strong>. <a href="https://www.cnil.fr/fr/sous-traitants-la-reutilisation-de-donnees-confiees-par-un-responsable-de-traitement" rel="noreferrer">Sous-traitants : la réutilisation de données confiées par un responsable de traitement</a>. 11 janvier 2022. Réutilisation pour une finalité propre et changement de responsabilité.</p>

<p id="ia5-fr-s09"><strong>[9] CNIL</strong>. <a href="https://www.cnil.fr/fr/determiner-la-qualification-juridique-des-fournisseurs-de-systemes-dia" rel="noreferrer">Déterminer la qualification juridique des acteurs</a>. 8 avril 2024. Qualification des acteurs participant au développement d’un système d’IA.</p>

<p id="ia5-fr-s10"><strong>[10] CNIL</strong>. <a href="https://cnil.fr/fr/assurer-que-le-traitement-est-licite-reutilisation-des-donnees" rel="noreferrer">Assurer que le traitement est licite : réutilisation des données</a>. 8 avril 2024. Licéité et finalités lors de la réutilisation de données pour développer l’IA.</p>

<p id="ia5-fr-s11"><strong>[11] Légifrance</strong>. <a href="https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006072026/LEGISCTA000048520910/" rel="noreferrer">Code monétaire et financier, chapitre XI : gestionnaires et acheteurs de crédits</a>. Version au 25 septembre 2026. Définitions, exclusions et responsabilités conservées en cas d’externalisation.</p>

<p id="ia5-fr-s12"><strong>[12] Légifrance</strong>. <a href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000051558621" rel="noreferrer">Code monétaire et financier, article L54-11-14</a>. Version en vigueur depuis le 3 mai 2025. Accès aux informations et expertise nécessaire pour reprendre les activités externalisées.</p>

<p id="ia5-fr-s13"><strong>[13] Légifrance</strong>. <a href="https://www.legifrance.gouv.fr/loda/id/JORFTEXT000053797360" rel="noreferrer">Arrêté du 24 mars 2026 relatif à la protection des fonds et à l’externalisation par les gestionnaires de crédits</a>. Signé le 24 mars, publié le 12 avril, applicable depuis le 13 avril 2026. Articles 6, 10 et 11 ; périmètre précis de la réception/détention des fonds.</p>

<p id="ia5-fr-s14"><strong>[14] ANSSI</strong>. <a href="https://messervices.cyber.gouv.fr/documents-guides/Recommandations_de_s%C3%A9curit%C3%A9_pour_un_syst%C3%A8me_d_IA_g%C3%A9n%C3%A9rative.pdf" rel="noreferrer">Recommandations de sécurité pour un système d’IA générative</a>. 29 avril 2024. R27 et R29, page PDF 27 : actions depuis des entrées non maîtrisées et journalisation.</p>

<p id="ia5-fr-s15"><strong>[15] CNIL</strong>. <a href="https://www.cnil.fr/fr/securite-tracer-les-operations" rel="noreferrer">Sécurité : tracer les opérations</a>. 14 mars 2024. Contenu, protection et limitation des journaux techniques.</p>

<p id="ia5-fr-s16"><strong>[16] CNIL / Règlement (UE) 2016/679</strong>. <a href="https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre8" rel="noreferrer">RGPD, chapitre VIII : voies de recours, responsabilité et sanctions</a>. Article 82. Responsabilité du responsable du traitement et du sous-traitant, exonération et recours entre participants responsables.</p>

<p id="ia5-fr-s17"><strong>[17] Cour de justice de l’Union européenne</strong>. <a href="https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:62021CJ0300" rel="noreferrer">Österreichische Post, C-300/21, EU:C:2023:370</a>. 4 mai 2023. Conditions de réparation et absence de seuil minimal de gravité du dommage moral.</p>

<p id="ia5-fr-s18"><strong>[18] Commission européenne</strong>. <a href="https://digital-strategy.ec.europa.eu/en/faqs/transparency-obligations-under-article-50-ai-act" rel="noreferrer">Transparency obligations under Article 50 of the AI Act</a>. Page consultée le 25 septembre 2026. Information sur l’interaction avec l’IA ; obligations applicables depuis le 2 août 2026.</p>

<p id="ia5-fr-s19"><strong>[19] Autorité de la concurrence</strong>. <a href="https://www.autoritedelaconcurrence.fr/fr/communiques-de-presse/intelligence-artificielle-generative-lautorite-rend-son-avis-sur-le" rel="noreferrer">Intelligence artificielle générative : fonctionnement concurrentiel du secteur</a>. 28 juin 2024. Définitions de l’entraînement et de l’inférence ; aucun chiffre de marché repris.</p>

*Documents consultés le 25 septembre 2026. Les pages sans date établie sont signalées comme non datées. Plusieurs textes émanent du même organisme : leur nombre ne mesure pas des confirmations indépendantes.*
