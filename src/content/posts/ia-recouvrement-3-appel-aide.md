---
title: 'L’IA vous demande de payer : ce que devient un appel à l’aide'
seoTitle: 'Recouvrement par IA : que devient un appel à l’aide ? | l0g'
description: Comment l’IA repère les difficultés des débiteurs, oriente vers une aide et traite les données sensibles. Enquête sur les alertes et leurs suites.
pubDate: '2026-09-24T16:56:18+02:00'
updatedDate: '2026-09-24T16:56:18+02:00'
tags: ['IA', 'Recouvrement', 'Données personnelles', 'Enquête']
draft: false
ogImage: /illustrations/news/ia-recouvrement-aide-v1.jpg
quickTake:
  fact: Ophelos décrit un repérage des vulnérabilités qui contribue aussi au choix des réponses automatisées.
  importance: La qualité du dispositif dépend des difficultés manquées et de la prise en charge qui suit une alerte.
  uncertainty: Le corpus ne permet pas de mesurer indépendamment ces résultats sur les dossiers français.
---

**L’IA vous demande de payer · Volet 3**

*Lire aussi : [Volet 1 : décisions](/posts/ia-recouvrement-1-qui-decide-relance/) · [Volet 2 : résultats](/posts/ia-recouvrement-2-gains-annonces/) · [Volet 4 : corriger le dossier](/posts/ia-recouvrement-4-corriger-dossier/).*

**Repérer une personne en difficulté peut lui ouvrir l’accès à une aide. Mais le classement sert aussi à décider quels échanges seront automatisés. Les documents d’Ophelos, les observations du régulateur britannique et les règles françaises de protection des données permettent de suivre ce qui se joue entre une confidence, une alerte et une prise en charge.**

Dans une publication technique, Ophelos explique que son modèle de détection des vulnérabilités contribue à réserver l’intervention humaine à certaines situations, tout en permettant d’automatiser des réponses aux échanges non signalés. La question dépasse donc la qualité du repérage : une difficulté manquée peut aussi influencer le parcours proposé à la personne. C’est une conséquence possible du fonctionnement décrit par l’entreprise, pas un incident constaté dans un dossier français. <a href="#ia3-fr-s01" aria-label="Source 1">[1]</a>

La page française d’Ophelos présente bien une détection par modèle de langage, un logiciel entraîné à traiter et à produire du texte, destinée à orienter les équipes spécialisées. Elle ne détaille cependant ni les performances par type de difficulté ni la configuration de chaque portefeuille. Une fonctionnalité commercialisée en France ne prouve pas que tous les dossiers français suivent le même chemin. <a href="#ia3-fr-s02" aria-label="Source 2">[2]</a>

Pour examiner cette promesse, il faut séparer ce que le système repère, ce qu’il enregistre et ce que l’entreprise fait ensuite. Une alerte peut être pertinente sans qu’aucune aide n’arrive. À l’inverse, une demande simple peut recevoir une réponse utile sans que son auteur ait besoin d’être classé.

## La difficulté n’a pas un seul visage

La Financial Conduct Authority, le régulateur financier britannique, aborde la vulnérabilité à partir de la santé, des événements de vie, de la capacité à absorber un choc et des difficultés à comprendre ou utiliser les services. Cette approche, exposée dans ses orientations de 2021, ne suppose pas que toutes les personnes concernées subissent un dommage. Elle s’intéresse à des besoins et à un contexte. Ce n’est pas une définition juridique française. <a href="#ia3-fr-s03" aria-label="Source 3">[3]</a>

Prenons deux situations pédagogiques, sans les attribuer à des clients réels. Une personne peut disposer de l’argent nécessaire mais ne pas parvenir à utiliser le canal de contact proposé. Une autre peut comprendre parfaitement la relance et n’avoir aucun revenu disponible pour y répondre. Répéter l’explication ne résout pas le second problème. Proposer un échéancier ne règle pas nécessairement le premier.

Le mot « vulnérable » rassemble ainsi des situations auxquelles une réponse uniforme conviendrait mal. Il n’indique, à lui seul, ni le montant remboursable, ni le format de communication utile, ni la nécessité d’une intervention urgente. Il ne permet pas davantage de présumer que la personne est incapable de choisir.

C’est la première précaution pour lire les promesses d’IA dans ce domaine : **quel besoin cherche-t-on à reconnaître ?** Une classification peut servir à organiser le service. Elle ne remplace pas la compréhension de ce qui empêche la personne de l’utiliser.

## Du message au portrait enregistré

Dans sa présentation de la première génération d’OLIVE, Ophelos décrivait un modèle analysant les messages écrits et produisant un score entre zéro et un, accompagné d’une indication sur la difficulté possible. Il s’agissait d’un instrument de repérage. Rien dans cette présentation ne permet de transformer son score en probabilité clinique ou en diagnostic. <a href="#ia3-fr-s04" aria-label="Source 4">[4]</a>

La documentation plus récente décrit des résumés de situation et des suggestions d’action. Ophelos dit avoir comparé son modèle à plus d’un millier d’exemples annotés par ses équipes de relation client. Cette vérification interne n’est pas une mesure indépendante des difficultés manquées en production. <a href="#ia3-fr-s01" aria-label="Source 1">[1]</a>

Entre les mots reçus et la fiche consultée par un conseiller, le statut de l’information mérite donc une attention particulière. Une déclaration explicite, une hypothèse du logiciel et un besoin confirmé avec la personne ne sont pas interchangeables. Les afficher de la même manière pourrait faire disparaître cette distinction.

Le risque technique général est documenté. Le NIST, institut américain de normalisation, décrit les réponses génératives qui s’écartent des informations fournies tout en étant présentées avec assurance. Ce constat ne démontre pas une erreur chez Ophelos ; il justifie de vérifier les résumés plutôt que de les traiter comme des pièces originales. <a href="#ia3-fr-s05" aria-label="Source 5">[5]</a>

Pour un contrôle sérieux, chaque interprétation devrait pouvoir être rapprochée de son origine : message concerné, date, version du modèle et éventuelle confirmation humaine. Ce serait notamment le moyen de distinguer une information devenue inexacte d’une information qui n’a jamais été établie.

La sortie du modèle mérite cette traçabilité précisément parce qu’elle paraît exploitable. Une note courte peut être commode pour l’agent suivant. Encore faut-il savoir ce qu’elle résume, ce qu’elle suppose et ce qui reste à demander.

## Ce que signifie l’absence d’alerte

L’erreur la plus visible est l’alerte injustifiée : le système signale une difficulté que la vérification ne confirme pas. En évaluation, on parle de *faux positif*. L’autre erreur, le *faux négatif*, correspond à une difficulté présente dans le dossier de référence mais non repérée par le dispositif.

Leurs conséquences possibles diffèrent. La première peut provoquer des questions inutiles, une mauvaise orientation ou l’inscription d’une caractéristique erronée. La seconde peut laisser une demande d’aide dans un traitement ordinaire. Il s’agit de risques à examiner, non de dommages dont la fréquence aurait été mesurée ici.

Le choix entre réponse automatique et reprise humaine apparaît aussi dans la documentation française de PAIR Finance : les messages sont catégorisés, puis le système peut déterminer si la réponse revient à un collaborateur ou à l’IA générative. Cette description ne démontre pas l’usage du même détecteur de vulnérabilité qu’Ophelos. <a href="#ia3-fr-s06" aria-label="Source 6">[6]</a>

Pour vérifier un tel tri, relire uniquement les dossiers signalés serait insuffisant. On découvrirait des alertes inutiles, mais pas les besoins restés de l’autre côté. **Les échanges sans alerte doivent eux aussi entrer dans le contrôle.** Il faut les comparer à une lecture indépendante, disposant du même contexte et de critères explicites.

Ce point change la façon de lire une promesse de « précision ». Une forte proportion d’alertes pertinentes peut coexister avec beaucoup de situations manquées. Inversement, un système qui signale presque tout peut retrouver davantage de difficultés tout en saturant les équipes. Sans connaître les deux types d’erreur et leurs conséquences, un indicateur isolé ne tranche pas la question.

<figure style="margin:2rem 0 2.4rem;">
<svg xmlns="http://www.w3.org/2000/svg" width="360" height="286" viewBox="0 0 360 286" role="img" aria-labelledby="ia3-fr-fig1-title ia3-fr-fig1-desc" focusable="false" style="display:block;width:100%;max-width:440px;height:auto;margin:0 auto;" font-family="Arial, Helvetica, sans-serif">
<title id="ia3-fr-fig1-title">Examiner les alertes et les dossiers non signalés</title>
<desc id="ia3-fr-fig1-desc">Protocole proposé, non exécuté : examiner les alertes pour rechercher les classements injustifiés, puis un échantillon de dossiers sans alerte pour rechercher des difficultés manquées. Employer un contexte et des critères communs, conserver les désaccords. Aucun taux d’erreur calculé.</desc>
<rect x="0.5" y="0.5" width="359" height="285" rx="8" fill="var(--color-surface)" stroke="var(--color-line-strong)" stroke-width="1" />
<text x="16" y="30" font-size="20" font-weight="600" fill="var(--color-paper)">Contrôler les deux côtés</text>
<text x="16" y="65" font-size="14" font-weight="600" fill="var(--color-signal)">AVEC ALERTE</text>
<text x="196" y="65" font-size="14" font-weight="600" fill="var(--color-amber)">SANS ALERTE</text>
<text x="16" y="92" font-size="16" font-weight="400" fill="var(--color-paper)">Vérifier l’alerte,</text>
<text x="16" y="114" font-size="16" font-weight="400" fill="var(--color-paper)">le besoin et</text>
<text x="16" y="136" font-size="16" font-weight="400" fill="var(--color-paper)">l’aide apportée.</text>
<text x="196" y="92" font-size="16" font-weight="400" fill="var(--color-paper)">Relire un échantillon</text>
<text x="196" y="114" font-size="16" font-weight="400" fill="var(--color-paper)">indépendamment.</text>
<text x="196" y="136" font-size="16" font-weight="400" fill="var(--color-paper)">Chercher les oublis.</text>
<line x1="16" y1="157" x2="344" y2="157" stroke="var(--color-line-strong)" stroke-width="1" />
<text x="16" y="184" font-size="14" font-weight="600" fill="var(--color-signal)">MÊME CADRE DE CONTRÔLE</text>
<text x="16" y="209" font-size="16" font-weight="400" fill="var(--color-paper)">Même contexte, critères définis,</text>
<text x="16" y="232" font-size="16" font-weight="400" fill="var(--color-paper)">désaccords conservés.</text>
<text x="16" y="267" font-size="16" font-weight="400" fill="var(--color-paper)">Aucun taux d’erreur calculé ici.</text>
</svg>
<figcaption style="margin-top:.75rem;font-size:.85em;line-height:1.6;color:var(--color-muted);">Illustration méthodologique l0g, sans donnée statistique. Ce protocole n’a pas été exécuté. Les choix d’orientation qui motivent ce contrôle sont décrits par les fournisseurs. <a href="#ia3-fr-s01" aria-label="Source 1">[1]</a> <a href="#ia3-fr-s06" aria-label="Source 6">[6]</a></figcaption>
</figure>

Même la référence humaine demande une méthode. Les relecteurs doivent-ils repérer une maladie, un obstacle à la communication ou une demande d’aménagement ? Disposent-ils des mêmes échanges ? Leurs désaccords sont-ils conservés ? Un consensus interne sur une catégorie n’en fait pas une vérité médicale.

Il reste enfin les personnes qui ne répondent pas. Leur silence ne permet pas de conclure à l’absence de difficulté. Un audit des seuls messages reçus ne dira pas ce qui arrive aux personnes qui n’ont pas pu engager la conversation. Ce périmètre doit rester visible dans tout résultat publié.

## Après le repérage, la capacité d’agir

Les documents indépendants ne conduisent pas à rejeter l’outil. En mars 2025, la FCA a décrit une entreprise qui utilisait l’IA pour rechercher des signes de difficulté dans des appels enregistrés. Des responsables vérifiaient ensuite l’aide apportée ; lorsque celle-ci avait manqué, l’entreprise recontactait le client et accompagnait le salarié. Le régulateur mentionne également des ajustements d’objectifs de durée d’appel pour les équipes concernées. Ces observations portent sur des services financiers britanniques. <a href="#ia3-fr-s07" aria-label="Source 7">[7]</a>

Cet usage offre un contre-argument concret à l’idée que l’automatisation ne ferait qu’éloigner les personnes de l’assistance. Elle peut aider à retrouver un besoin négligé. Mais le bénéfice décrit tient à l’ensemble du processus : repérage, examen et action corrective. Le logiciel seul n’accomplit pas la dernière étape.

Une publication plus récente de la FCA, datée du **17 septembre 2026**, rapporte des essais d’analyse du langage des conversations écrites pour orienter des clients vers des agents humains. Elle relève aussi, chez certains établissements, des éléments insuffisants pour montrer comment les vulnérabilités identifiées conduisent à un soutien adapté. Son champ est celui des services de paiement britanniques, pas celui du recouvrement français. <a href="#ia3-fr-s08" aria-label="Source 8">[8]</a>

L’enseignement utilisable est donc limité mais net : l’existence d’une catégorie dans le fichier ne renseigne pas, à elle seule, sur le service rendu. Une entreprise pourrait reconnaître beaucoup de difficultés et manquer de conseillers disponibles. Elle pourrait aussi disposer de spécialistes sans leur donner le pouvoir de modifier les modalités proposées.

Un transfert annoncé ne suffit pas pour départager ces situations. Il faudrait connaître sa destination, le délai avant prise en charge, les informations effectivement transmises et les décisions possibles. Si une adaptation est convenue, il reste à vérifier son application dans les outils qui préparent les prochains contacts.

Cette exigence ne revient pas à imposer le téléphone à tous. La bonne réponse peut être un échange écrit, un rendez-vous différé ou une explication accessible. Le critère est l’adéquation au besoin exprimé, pas la présence d’une voix humaine à chaque étape.

## Dire sa difficulté ne garantit pas un changement

Une enquête commandée par la FCA et réalisée en mars-avril 2024 apporte un repère distinct. Parmi **412 adultes britanniques en situation de vulnérabilité ayant signalé des besoins différents**, **58 %** indiquaient que leur prestataire avait apporté des changements pour leur fournir le soutien nécessaire. Le rapport est daté de mai 2024 et a été diffusé avec les travaux du régulateur en mars 2025. Il ne mesure pas l’effet de l’IA. <a href="#ia3-fr-s09" aria-label="Source 9">[9]</a>

Il serait abusif de transformer les autres réponses en taux d’échec : la question ne permet pas d’établir que chaque absence de changement constituait une faute ou qu’un changement était toujours possible. Elle montre surtout l’intérêt de demander aux personnes ce qui s’est passé après leur signalement, au-delà de sa bonne réception.

Pour l’enquête sur le recouvrement, cette distinction oblige à aller plus loin que le nombre de dossiers marqués ou transférés. Une prise en charge réussie devrait être décrite par ce qu’elle a permis : comprendre une proposition, faire examiner une situation ou obtenir une réponse utilisable. C’est une grille de vérification proposée, pas un résultat déjà observé sur les plateformes étudiées.

## Aider sans constituer un dossier médical

La notice française d’Intrum Corporate envisage que des informations de santé, de handicap ou de vie privée soient volontairement transmises pour adapter le remboursement. Elle annonce une limitation de la collecte au nécessaire. Ce document décrit des engagements de l’entreprise, pas le contenu effectivement conservé pour chaque client. <a href="#ia3-fr-s10" aria-label="Source 10">[10]</a>

La collecte volontaire et l’inférence par un modèle appellent toutefois des questions différentes. Une personne a-t-elle révélé une information, ou le système l’a-t-il déduite ? Dans le second cas, sait-elle qu’une caractéristique a été enregistrée à son sujet ? Quelle confiance lui est accordée et comment la contester ? Les documents consultés ne permettent pas de suivre cette chaîne dans un dossier français particulier.

En droit des données personnelles, une information de santé ne provient pas nécessairement d’un médecin. La CNIL inclut notamment certaines conclusions issues de croisements de données. En revanche, un impayé ou une difficulté budgétaire n’est pas, par nature, une donnée de santé ; la qualification dépend de l’information traitée et de son contexte. <a href="#ia3-fr-s11" aria-label="Source 11">[11]</a>

Lorsque des données relevant des catégories particulières du règlement général sur la protection des données (RGPD) sont traitées, deux conditions doivent être distinguées : une base légale au titre de l’article 6 et une exception applicable au titre de l’article 9. Invoquer seulement l’intérêt légitime ne suffit donc pas à autoriser le traitement de données de santé. Les conditions exactes dépendent de l’usage, et non de la seule intention d’aider. <a href="#ia3-fr-s12" aria-label="Source 12">[12]</a>

Une question pratique en découle : quelle information permet réellement l’aménagement ? Pour une personne qui demande un échange écrit, enregistrer ce besoin peut suffire à organiser le contact. Déduire puis diffuser une pathologie supposée serait une opération différente, dont la nécessité devrait être justifiée. Cet exemple décrit un choix de conception possible, pas la pratique constatée d’un opérateur.

## Faire circuler l’aide, limiter la confidence

Le RGPD impose notamment de limiter les données au nécessaire, de poursuivre des finalités explicites et de maintenir leur exactitude. Appliqués à ce dossier, ces principes invitent à distinguer l’analyse temporaire d’un message, la conservation d’une conclusion et son éventuelle réutilisation. Ils ne rendent pas ces opérations identiques parce qu’elles utilisent le même logiciel. <a href="#ia3-fr-s13" aria-label="Source 13">[13]</a>

Sur le plan des accès, la CNIL recommande de limiter les permissions aux informations utiles à chaque mission. Une organisation peut avoir besoin d’une personne habilitée à examiner une confidence sans donner ce même accès à tous ceux qui exécutent l’aménagement retenu. Une consigne de service liée à un client reste cependant une donnée personnelle à protéger. <a href="#ia3-fr-s14" aria-label="Source 14">[14]</a>

<figure style="margin:2rem 0 2.4rem;">
<svg xmlns="http://www.w3.org/2000/svg" width="360" height="286" viewBox="0 0 360 286" role="img" aria-labelledby="ia3-fr-fig2-title ia3-fr-fig2-desc" focusable="false" style="display:block;width:100%;max-width:440px;height:auto;margin:0 auto;" font-family="Arial, Helvetica, sans-serif">
<title id="ia3-fr-fig2-title">Séparer l’analyse d’une confidence et l’application d’une aide</title>
<desc id="ia3-fr-fig2-desc">Schéma de conception proposé, pas architecture auditée. Le message original est consulté selon la mission. Une interprétation reste reliée à sa source et peut être corrigée. L’aménagement retenu transmet une consigne utile sans détail superflu. Cette consigne demeure une donnée personnelle.</desc>
<rect x="0.5" y="0.5" width="359" height="285" rx="8" fill="var(--color-surface)" stroke="var(--color-line-strong)" stroke-width="1" />
<text x="16" y="30" font-size="20" font-weight="600" fill="var(--color-paper)">De la confidence à l’aide</text>
<text x="16" y="66" font-size="14" font-weight="600" fill="var(--color-signal)">01</text>
<text x="46" y="66" font-size="16" font-weight="600" fill="var(--color-paper)">Message d’origine</text>
<text x="16" y="89" font-size="16" font-weight="400" fill="var(--color-paper)">Accès réservé aux personnes habilitées.</text>
<line x1="16" y1="103" x2="344" y2="103" stroke="var(--color-line-strong)" stroke-width="1" />
<text x="16" y="136" font-size="14" font-weight="600" fill="var(--color-signal)">02</text>
<text x="46" y="136" font-size="16" font-weight="600" fill="var(--color-paper)">Interprétation</text>
<text x="16" y="159" font-size="16" font-weight="400" fill="var(--color-paper)">Source, date, vérification, correction.</text>
<line x1="16" y1="173" x2="344" y2="173" stroke="var(--color-line-strong)" stroke-width="1" />
<text x="16" y="206" font-size="14" font-weight="600" fill="var(--color-signal)">03</text>
<text x="46" y="206" font-size="16" font-weight="600" fill="var(--color-paper)">Consigne d’aménagement</text>
<text x="16" y="229" font-size="16" font-weight="400" fill="var(--color-paper)">Partager le nécessaire pour agir.</text>
<text x="16" y="267" font-size="16" font-weight="400" fill="var(--color-paper)">La consigne reste une donnée personnelle.</text>
</svg>
<figcaption style="margin-top:.75rem;font-size:.85em;line-height:1.6;color:var(--color-muted);">Schéma de conception proposé par l0g à partir des principes de minimisation, d’exactitude et de contrôle des accès. Il ne représente pas un système observé chez Intrum, Ophelos ou PAIR Finance. <a href="#ia3-fr-s13" aria-label="Source 13">[13]</a> <a href="#ia3-fr-s14" aria-label="Source 14">[14]</a></figcaption>
</figure>

Le schéma propose de séparer les fonctions, pas de créer une nouvelle base de confidences. Il faudrait également prévoir la révision d’un besoin devenu obsolète et distinguer sa suppression de la conservation éventuellement justifiée d’une trace historique. Une ancienne difficulté ne devrait pas être présentée comme actuelle par simple inertie du dossier.

La réutilisation pour améliorer un modèle mérite son propre examen. Retirer un nom n’anonymise pas un échange s’il reste rattachable au client dans le système. La CNIL distingue bien la [pseudonymisation](/glossaire/pseudonymisation/), qui remplace des identifiants, de l’anonymisation. Ce point ne permet pas de conclure que les données de santé des débiteurs sont effectivement utilisées pour entraîner les outils étudiés. <a href="#ia3-fr-s15" aria-label="Source 15">[15]</a>

Le contrôle devrait donc demander quelles informations entrent dans les exemples d’apprentissage, qui y accède et quelles garanties s’appliquent. Il devrait aussi examiner la nécessité d’une analyse d’impact. Celle-ci est requise lorsque le traitement est susceptible d’engendrer un risque élevé pour les droits et libertés. Son absence en ligne ne prouve ni son inexistence ni, à elle seule, un manquement. <a href="#ia3-fr-s18" aria-label="Source 18">[18]</a>

## Une protection qui reste à vérifier dans les dossiers

À ce stade, le constat documentaire est plus précis qu’un débat pour ou contre le chatbot. Le repérage peut contribuer à une meilleure assistance ; il peut également participer au choix des conversations qui ne seront pas immédiatement reprises par un conseiller. Le point à vérifier est l’articulation entre ce classement, les moyens humains et les actes accomplis.

Pour l’établir en France, le corpus ne fournit pas d’éléments indépendants reliant un message original à l’alerte éventuelle, puis à la réponse et à son application. Il ne contient pas non plus d’évaluation des difficultés non détectées sur un périmètre défini. Les taux d’erreur ou les bénéfices nets pour les débiteurs ne peuvent pas être déduits des seules présentations commerciales consultées.

L’investigation suivante doit pouvoir examiner une correction aussi bien qu’une erreur : quelle information a été modifiée, qui l’a validée, et le traitement ultérieur en a-t-il tenu compte ? Ce serait le moyen de rendre visible une protection qui fonctionne, sans se satisfaire d’une procédure annoncée, ni présumer son échec.

En France, les droits d’accès et de rectification permettent, dans leur cadre applicable, de demander les données enregistrées à son sujet et de faire corriger celles qui sont inexactes. Ces droits ne signifient pas que toute demande entraîne immédiatement une suspension du recouvrement ou l’effacement de la dette. <a href="#ia3-fr-s16" aria-label="Source 16">[16]</a>

L’aide budgétaire ne dépend pas non plus de la reconnaissance par un algorithme. La Banque de France renvoie notamment vers les Points conseil budget, qui offrent un accompagnement gratuit et confidentiel. Ce recours est distinct du service chargé d’obtenir un paiement. <a href="#ia3-fr-s17" aria-label="Source 17">[17]</a>

La promesse se jugera finalement à une question concrète : après avoir exprimé sa difficulté, la personne a-t-elle pu accéder à une réponse adaptée, sans devoir livrer plus d’informations qu’il n’en fallait ? C’est ce passage, du signal à l’aide effective, que les documents publics examinés ne permettent pas de reconstituer sur le périmètre français des plateformes examinées.

---

### Méthode et limites

Enquête documentaire arrêtée au 24 septembre 2026. Les documents d’entreprise sont utilisés pour décrire leurs déclarations, non comme une validation indépendante des performances. Les observations britanniques concernent leurs populations et secteurs propres. Aucun entretien, contact contradictoire, dossier individuel authentifié ou test de plateforme n’a été réalisé pour ce volet. Les exemples pédagogiques et les deux schémas exposent des distinctions et des contrôles proposés ; ils ne représentent ni des incidents constatés ni l’architecture auditée d’une entreprise.


### Sources et périmètres

<p id="ia3-fr-s01" style="scroll-margin-top:2rem;overflow-wrap:anywhere;"><strong>[1] Ophelos / Lily Davis</strong> · <a href="https://www.ophelos.com/business/blog/post/the-power-of-fine-tuned-llms-for-detecting-and-supporting-vulnerable-customers" rel="noreferrer">The Power of Fine-tuned LLMs for Detecting and Supporting Vulnerable Customers</a>. Page affichant le 21 janvier et le 8 mai 2025, sans attribution claire des dates. Description d’Olive 2.0 et de l’automatisation des réponses non signalées ; validation interne annoncée.</p>

<p id="ia3-fr-s02" style="scroll-margin-top:2rem;overflow-wrap:anywhere;"><strong>[2] Ophelos France</strong> · <a href="https://www.ophelos.com/fr/professionnels/ia" rel="noreferrer">L’IA dans le recouvrement de créances</a>. Page non datée. Offre française de détection par modèle de langage ; ne renseigne pas la configuration de chaque portefeuille.</p>

<p id="ia3-fr-s03" style="scroll-margin-top:2rem;overflow-wrap:anywhere;"><strong>[3] Financial Conduct Authority</strong> · <a href="https://www.fca.org.uk/publications/finalised-guidance/guidance-firms-fair-treatment-vulnerable-customers" rel="noreferrer">Guidance for firms on the fair treatment of vulnerable customers</a>. 23 février 2021 ; page mise à jour le 22 juillet 2026. Définition contextuelle et besoins de service au Royaume-Uni.</p>

<p id="ia3-fr-s04" style="scroll-margin-top:2rem;overflow-wrap:anywhere;"><strong>[4] Ophelos / Jacob Goss</strong> · <a href="https://www.ophelos.com/business/blog/post/what-is-nlp-and-how-can-it-be-used-to-detect-vulnerability" rel="noreferrer">What is NLP and how can it be used to detect vulnerability?</a>. Page affichant le 8 juillet 2021 et le 8 mai 2025. Description historique du score entre zéro et un ; aucune calibration clinique établie.</p>

<p id="ia3-fr-s05" style="scroll-margin-top:2rem;overflow-wrap:anywhere;"><strong>[5] National Institute of Standards and Technology</strong> · <a href="https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf" rel="noreferrer">Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile, NIST AI 600-1</a>. Juillet 2024. Section 2.2, p. 6 : risque de contenu généré erroné ou divergent des informations d’entrée. Ne prouve pas une erreur chez un fournisseur cité.</p>

<p id="ia3-fr-s06" style="scroll-margin-top:2rem;overflow-wrap:anywhere;"><strong>[6] PAIR Finance</strong> · <a href="https://pairfinance.com/fr/intelligence-artificielle/" rel="noreferrer">Intelligence artificielle</a>. Page française non datée. Décrit la catégorisation des messages et l’orientation de la réponse vers un collaborateur ou l’IA générative.</p>

<p id="ia3-fr-s07" style="scroll-margin-top:2rem;overflow-wrap:anywhere;"><strong>[7] Financial Conduct Authority</strong> · <a href="https://www.fca.org.uk/publications/good-and-poor-practice/delivering-vulnerable-customers" rel="noreferrer">Delivering good outcomes for customers in vulnerable circumstances – good practice and areas for improvement</a>. 7 mars 2025 ; mise à jour du 3 décembre 2025. Section 3.2 : contrôle d’appels assisté par IA, suivi humain et organisation du travail.</p>

<p id="ia3-fr-s08" style="scroll-margin-top:2rem;overflow-wrap:anywhere;"><strong>[8] Financial Conduct Authority</strong> · <a href="https://www.fca.org.uk/publications/good-and-poor-practice/payments-firms-delivering-good-outcomes-vulnerable-consumers" rel="noreferrer">Payments firms: delivering good outcomes for consumers in vulnerable circumstances</a>. 17 septembre 2026. Pilotes d’analyse du langage et constats sur la traduction des besoins en aide dans les services de paiement britanniques.</p>

<p id="ia3-fr-s09" style="scroll-margin-top:2rem;overflow-wrap:anywhere;"><strong>[9] Critical Research, étude commandée par la FCA</strong> · <a href="https://www.fca.org.uk/publication/external-research/vulnerability-review-improving-outcomes-consumers-engaging-financial-services-firms.pdf" rel="noreferrer">Vulnerability review: Improving understanding of the outcomes for consumers in vulnerable circumstances when engaging with financial services firms</a>. Collecte en mars-avril 2024 ; rapport daté de mai 2024, diffusé en mars 2025. Figure 20, p. 27 : 58 %, sur une base de 412 personnes ayant signalé leurs besoins. Aucun effet de l’IA mesuré.</p>

<p id="ia3-fr-s10" style="scroll-margin-top:2rem;overflow-wrap:anywhere;"><strong>[10] Intrum Corporate France</strong> · <a href="https://www.intrum.fr/media/axfjlwgn/202604-politique-de-confidentialit%C3%A9-client-d%C3%A9biteur.pdf" rel="noreferrer">Politique de confidentialité relative à la protection des données personnelles des clients débiteurs</a>. Version au nom de fichier commençant par 202604, date exacte non établie. Page 4 : données sensibles volontairement transmises et limitation annoncée de la collecte.</p>

<p id="ia3-fr-s11" style="scroll-margin-top:2rem;overflow-wrap:anywhere;"><strong>[11] CNIL</strong> · <a href="https://www.cnil.fr/fr/quest-ce-ce-quune-donnee-de-sante" rel="noreferrer">Qu’est-ce ce qu’une donnée de santé ?</a>. 8 janvier 2018. Définition et qualification contextuelle des données de santé, y compris certaines données déduites.</p>

<p id="ia3-fr-s12" style="scroll-margin-top:2rem;overflow-wrap:anywhere;"><strong>[12] CNIL</strong> · <a href="https://www.cnil.fr/fr/les-bases-legales/liceite-essentiel-sur-les-bases-legales" rel="noreferrer">La licéité du traitement : l’essentiel sur les bases légales prévues par le RGPD</a>. 29 novembre 2019. Distingue la base légale du traitement et la condition supplémentaire applicable aux données sensibles.</p>

<p id="ia3-fr-s13" style="scroll-margin-top:2rem;overflow-wrap:anywhere;"><strong>[13] CNIL / règlement (UE) 2016/679</strong> · <a href="https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2" rel="noreferrer">RGPD, chapitre II : Principes</a>. Règlement du 27 avril 2016, article 5. Finalités, minimisation et exactitude. Version en ligne consultée à la date de l’enquête.</p>

<p id="ia3-fr-s14" style="scroll-margin-top:2rem;overflow-wrap:anywhere;"><strong>[14] CNIL</strong> · <a href="https://www.cnil.fr/fr/securite-gerer-les-habilitations" rel="noreferrer">Sécurité : Gérer les habilitations</a>. 13 mars 2024. Accès limités aux informations nécessaires à chaque mission. La figure 2 en propose une application éditoriale.</p>

<p id="ia3-fr-s15" style="scroll-margin-top:2rem;overflow-wrap:anywhere;"><strong>[15] CNIL</strong> · <a href="https://www.cnil.fr/fr/identifier-les-donnees-personnelles" rel="noreferrer">Identifier les données personnelles</a>. 27 janvier 2020. Distingue anonymisation et remplacement d’identifiants. Le texte vise ici des données toujours rattachables au client dans le système.</p>

<p id="ia3-fr-s16" style="scroll-margin-top:2rem;overflow-wrap:anywhere;"><strong>[16] CNIL / règlement (UE) 2016/679</strong> · <a href="https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre3" rel="noreferrer">RGPD, chapitre III : Droits de la personne concernée</a>. Articles 15 et 16. Accès et rectification dans leur cadre applicable ; à distinguer du sort juridique de la créance.</p>

<p id="ia3-fr-s17" style="scroll-margin-top:2rem;overflow-wrap:anywhere;"><strong>[17] Banque de France / Mes questions d’argent</strong> · <a href="https://www.mesquestionsdargent.fr/intervenants-sociaux-et-pcb/point-conseil-budget" rel="noreferrer">Point conseil budget</a>. Page consultée le 24 septembre 2026. Présente notamment l’accompagnement gratuit et confidentiel des Points conseil budget.</p>

<p id="ia3-fr-s18" style="scroll-margin-top:2rem;overflow-wrap:anywhere;"><strong>[18] CNIL</strong> · <a href="https://www.cnil.fr/fr/ce-quil-faut-savoir-sur-lanalyse-dimpact-relative-la-protection-des-donnees-aipd" rel="noreferrer">Ce qu’il faut savoir sur l’analyse d’impact relative à la protection des données (AIPD)</a>. 18 octobre 2017 ; page consultée à la date de l’enquête. Critère de risque élevé, sans présumer le contenu des dossiers de conformité des entreprises.</p>

*Documents consultés le 24 septembre 2026. Les dates incertaines sont signalées plutôt que déduites du nom d’un fichier.*
