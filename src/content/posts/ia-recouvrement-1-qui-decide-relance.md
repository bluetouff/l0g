---
title: 'L’IA vous demande de payer : qui décide de la relance ?'
seoTitle: 'Recouvrement par IA : qui décide de la relance ? | l0g'
description: 'Créancier, recouvreur, score et chatbot : une enquête documentaire sur les décisions qui précèdent la relance et les droits du débiteur en France.'
pubDate: '2026-09-24'
updatedDate: '2026-09-24'
tags: ['IA', 'Recouvrement', 'Données personnelles', 'Enquête']
draft: false
ogImage: /illustrations/news/ia-recouvrement-decisions-v1.jpg
quickTake:
  fact: La notice française d’Intrum décrit un score automatique pouvant orienter un dossier vers le recouvrement judiciaire.
  importance: L’examen doit porter sur les pouvoirs du système, la validité de la créance et les possibilités de correction.
  uncertainty: La notice ne permet pas de reconstituer les contrôles effectifs ni les conséquences de chaque décision.
---

**L’IA vous demande de payer · Volet 1**

*Lire le [deuxième volet : derrière les gains annoncés](/posts/ia-recouvrement-2-gains-annonces/).*

À la page 7 de sa notice française de confidentialité, Intrum Corporate décrit une notation automatique pouvant orienter un dossier vers le recouvrement judiciaire. Le document place ainsi l’automatisation en amont du message reçu : elle peut contribuer au choix de la suite donnée à l’impayé. <a href="#ia1-fr-s01" aria-label="Source 1">[1]</a>

Cette distinction change la manière d’examiner le recouvrement par intelligence artificielle. Une conversation peut paraître ordinaire alors que plusieurs décisions ont déjà été prises : sélectionner le dossier, choisir le canal de contact, préparer une proposition. Inversement, une réponse produite par un modèle de langage peut n’avoir aucun pouvoir sur le montant réclamé ou sur un éventuel recours.

Pour comprendre ce qui se joue, il faut donc remonter avant la conversation. Qui détient la créance ? Quelle entreprise agit pour son compte ? Quelles données alimentent le système ? Et à quel moment une personne peut-elle remettre en cause son résultat ?

*Cette enquête documentaire porte sur les dettes de particuliers en France. Les documents étrangers sont identifiés comme tels. Elle ne repose sur aucun témoignage reconstitué ni sur un test de dispositif en production.*

## Le nom sur le message n’est pas forcément celui du créancier

Le **créancier** est celui qui détient le droit de réclamer le paiement. Il peut confier les démarches à une société de recouvrement : celle-ci agit alors pour son compte. Dans le régime français du recouvrement amiable pour autrui, une convention écrite doit notamment préciser le fondement de la créance, les sommes à recouvrer et la rémunération du prestataire. Confier la relance ne transfère donc pas, en soi, la propriété de la créance. <a href="#ia1-fr-s02" aria-label="Source 2">[2]</a>

Autre possibilité : la créance a été vendue. La **cession** transfère alors le droit de réclamer le paiement à un nouvel acquéreur, qui peut lui-même déléguer le recouvrement. Le changement de créancier et le changement d’interlocuteur sont deux opérations différentes. <a href="#ia1-fr-s03" aria-label="Source 3">[3]</a>

Dans le régime général du Code civil, lorsque le débiteur n’a pas déjà consenti à la cession, celle-ci doit lui être notifiée ou il doit en avoir pris acte pour qu’elle puisse lui être opposée. Le texte préserve aussi des moyens de défense contre l’acquéreur, notamment ceux qui tiennent à la dette elle-même. Vendre une créance ne fait pas disparaître, par principe, une contestation sur son existence. Des régimes spéciaux peuvent toutefois s’appliquer à certaines opérations financières. <a href="#ia1-fr-s04" aria-label="Source 4">[4]</a>

Le fournisseur de logiciel constitue encore une autre fonction. Pour attribuer les responsabilités, il faut le situer séparément : développer l’outil, configurer ses règles et détenir la créance ne sont pas des responsabilités interchangeables. Plusieurs fonctions peuvent être réunies dans un même groupe ; il faut vérifier quelle entité les exerce.

<figure style="margin:2.2rem 0;">
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="676" viewBox="0 0 400 676" role="img" aria-labelledby="ia1-fr-fig1-title ia1-fr-fig1-desc" focusable="false" style="display:block;width:100%;max-width:480px;height:auto;margin:0 auto;">
<title id="ia1-fr-fig1-title">Mandat ou cession : deux situations</title>
<desc id="ia1-fr-fig1-desc">Dans le mandat, le créancier conserve la créance et charge un recouvreur d’agir pour son compte. Dans la cession, le créancier initial transfère la créance à un nouveau créancier. Celui-ci peut aussi mandater un recouvreur. Ce sont deux situations de principe, pas deux étapes obligatoires.</desc>
<rect width="400" height="676" rx="18" fill="#10212b" />
<g font-family="Arial, Helvetica, sans-serif">
<text x="26" y="38" font-size="20" font-weight="700" fill="#78e6c4">01 / MANDAT</text>
<rect x="24" y="60" width="352" height="88" rx="12" fill="#18323e" stroke="#567681" stroke-width="1" />
<text x="42" y="95" font-size="25" font-weight="700" fill="#f2f7f8">Créancier</text>
<text x="42" y="125" font-size="21" font-weight="400" fill="#c9dde3">Conserve la créance</text>
<path d="M 200 155 V 185 M 194 179 L 200 185 L 206 179" fill="none" stroke="#78e6c4" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
<rect x="24" y="196" width="352" height="88" rx="12" fill="#18323e" stroke="#567681" stroke-width="1" />
<text x="42" y="231" font-size="24" font-weight="700" fill="#f2f7f8">Recouvreur mandaté</text>
<text x="42" y="261" font-size="21" font-weight="400" fill="#c9dde3">Agit pour ce créancier</text>
<path d="M 24 313 H 376" stroke="#567681" stroke-width="1" />
<text x="26" y="353" font-size="20" font-weight="700" fill="#78e6c4">02 / CESSION</text>
<rect x="24" y="375" width="352" height="70" rx="12" fill="#18323e" stroke="#567681" stroke-width="1" />
<text x="42" y="418" font-size="24" font-weight="700" fill="#f2f7f8">Créancier initial</text>
<path d="M 200 451 V 483 M 194 477 L 200 483 L 206 477" fill="none" stroke="#78e6c4" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
<rect x="24" y="497" width="352" height="105" rx="12" fill="#18323e" stroke="#567681" stroke-width="1" />
<text x="42" y="533" font-size="24" font-weight="700" fill="#f2f7f8">Nouveau créancier</text>
<text x="42" y="563" font-size="21" font-weight="400" fill="#c9dde3">Détient la créance cédée</text>
<text x="26" y="635" font-size="21" font-weight="400" fill="#c9dde3">Un recouvreur peut aussi</text>
<text x="26" y="660" font-size="21" font-weight="400" fill="#c9dde3">agir pour l’acquéreur.</text>
</g>
</svg>
<figcaption style="margin-top:0.9rem;font-size:0.92em;line-height:1.6;">Schéma de principe, droit français général. Les flèches désignent un mandat (en haut) ou une cession (en bas), pas un paiement. Aucune opération particulière n’est représentée. Sources : <a href="#ia1-fr-s02" aria-label="Source 2">[2]</a> <a href="#ia1-fr-s03" aria-label="Source 3">[3]</a> <a href="#ia1-fr-s04" aria-label="Source 4">[4]</a>. Consultation : 24 septembre 2026.</figcaption>
</figure>

Cette carte des intervenants sert à poser les bonnes questions. Une erreur de facture se recherche d’abord dans les pièces qui fondent la demande. Un mandat renseigne sur les pouvoirs confiés au recouvreur. La documentation du logiciel décrit ce que son utilisateur peut automatiser. Aucun de ces documents ne remplace les autres.

## Une dette doit pouvoir se vérifier hors de l’interface

La DGCCRF rappelle qu’une créance réclamée doit être **certaine, liquide et exigible** : son existence doit être établie, son montant déterminé ou déterminable, et son échéance atteinte. Ces conditions portent sur l’obligation de payer, pas sur la qualité de présentation d’un portail. <a href="#ia1-fr-s05" aria-label="Source 5">[5]</a>

La règle de preuve est également réciproque. Celui qui réclame l’exécution d’une obligation doit la prouver ; celui qui affirme en être libéré doit justifier le paiement ou l’événement qui l’a éteinte. Le dossier utile comprend donc autant les éléments à l’origine de la demande que les règlements et corrections intervenus depuis. <a href="#ia1-fr-s06" aria-label="Source 6">[6]</a>

Pour les professionnels relevant des articles R124-1 à R124-7 du Code des procédures civiles d’exécution, la lettre de recouvrement doit identifier le recouvreur et le créancier, exposer le fondement de la demande et distinguer principal, intérêts et accessoires. Les démarches suivantes doivent rappeler ses références et sa date d’envoi. Cela ne signifie pas que chaque SMS doit reproduire toute la lettre. Ce régime vise le recouvrement pour autrui, sous réserve des professions soumises à un statut particulier. <a href="#ia1-fr-s07" aria-label="Source 7">[7]</a> <a href="#ia1-fr-s02" aria-label="Source 2">[2]</a>

Les frais appellent un contrôle distinct. Sans titre exécutoire, les frais de recouvrement restent en principe à la charge du créancier. Il existe des exceptions prévues par le droit, notamment pour certains actes prescrits par la loi ; le juge peut aussi mettre certains frais nécessaires à la charge d’un débiteur de mauvaise foi. **Le coût d’un outil d’IA ne devient donc pas automatiquement une somme due par le particulier.** <a href="#ia1-fr-s08" aria-label="Source 8">[8]</a>

Ces vérifications permettent d’éviter une confusion dans l’attribution des erreurs. Si un règlement manque déjà dans le fichier transmis au prestataire, le modèle n’a pas nécessairement inventé l’impayé. S’il reformule correctement un montant faux, son exactitude linguistique ne corrige rien. Il faut comparer l’information d’origine, sa transmission et l’action déclenchée.

## Avant de parler, le système choisit

Les descriptions publiques permettent de distinguer plusieurs fonctions, sans supposer qu’elles sont toutes actives sur chaque dossier.

Dans une brochure belge consacrée à Ophelos, Intrum explique que les ouvertures de messages, les clics, les connexions et le montant de la dette alimentent le choix du moment, du canal et du message. Le fournisseur décrit un apprentissage par renforcement : le système ajuste ses choix en fonction des résultats recherchés. Il s’agit d’une description commerciale publiée en Belgique, pas d’une observation de dossiers français. <a href="#ia1-fr-s09" aria-label="Source 9">[9]</a>

PAIR Finance présente une autre partie du travail : classer les messages entrants, notamment les demandes de délai, d’échelonnement et les contestations, puis orienter leur traitement vers un humain ou vers une réponse générée. Ophelos décrit aussi l’utilisation de modèles de langage pour repérer des situations nécessitant davantage d’accompagnement. Ce sont les fonctionnalités déclarées par les entreprises, non des performances validées par l0g. <a href="#ia1-fr-s10" aria-label="Source 10">[10]</a> <a href="#ia1-fr-s11" aria-label="Source 11">[11]</a>

Pour les examiner, une distinction pratique suffit. Une règle fixe programme une relance. Un score estime une probabilité. Un mécanisme de sélection choisit une action. Un modèle de langage rédige une réponse. Enfin, un logiciel disposant des autorisations nécessaires peut exécuter une modification. Les assembler ne rend pas leurs rôles identiques.

Il faut notamment connaître **l’objectif que le système cherche à améliorer**. Obtenir une réponse, recevoir un premier paiement et établir un échéancier tenu jusqu’au bout ne mesurent pas le même résultat. Un gain sur le premier indicateur ne démontre pas un gain sur les deux autres.

De même, un clic ne suffit pas à établir une capacité de remboursement. Une absence de réponse peut avoir plusieurs explications. Le point à vérifier est la manière dont l’opérateur traite cette incertitude, au lieu de prendre une prédiction pour un fait individuel.

<figure style="margin:2.2rem 0;">
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="750" viewBox="0 0 400 750" role="img" aria-labelledby="ia1-fr-fig2-title ia1-fr-fig2-desc" focusable="false" style="display:block;width:100%;max-width:480px;height:auto;margin:0 auto;">
<title id="ia1-fr-fig2-title">De la donnée à l’action : quatre fonctions</title>
<desc id="ia1-fr-fig2-desc">Grille de lecture : les données du dossier peuvent alimenter une évaluation et un choix d’action. Le message peut être fixe, rédigé par un humain ou généré. Une action dans le dossier requiert les pouvoirs correspondants. Une réponse affichée ne démontre pas qu’un acte a été exécuté. Les contrôles humains peuvent intervenir à plusieurs étapes.</desc>
<rect width="400" height="750" rx="18" fill="#10212b" />
<g font-family="Arial, Helvetica, sans-serif">
<rect x="22" y="20" width="356" height="142" rx="12" fill="#18323e" stroke="#567681" stroke-width="1" />
<text x="40" y="50" font-size="20" font-weight="700" fill="#78e6c4">01 / DONNÉES</text>
<text x="40" y="86" font-size="25" font-weight="700" fill="#f2f7f8">Dossier de créance</text>
<text x="40" y="119" font-size="21" font-weight="400" fill="#c9dde3">Factures, paiements,</text>
<text x="40" y="146" font-size="21" font-weight="400" fill="#c9dde3">échanges et corrections</text>
<path d="M 200 171 V 194 M 194 188 L 200 194 L 206 188" fill="none" stroke="#78e6c4" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
<rect x="22" y="204" width="356" height="142" rx="12" fill="#18323e" stroke="#567681" stroke-width="1" />
<text x="40" y="234" font-size="20" font-weight="700" fill="#78e6c4">02 / CHOIX</text>
<text x="40" y="270" font-size="25" font-weight="700" fill="#f2f7f8">Évaluer et orienter</text>
<text x="40" y="303" font-size="21" font-weight="400" fill="#c9dde3">Score éventuel,</text>
<text x="40" y="330" font-size="21" font-weight="400" fill="#c9dde3">règles de traitement</text>
<path d="M 200 355 V 378 M 194 372 L 200 378 L 206 372" fill="none" stroke="#78e6c4" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
<rect x="22" y="388" width="356" height="142" rx="12" fill="#18323e" stroke="#567681" stroke-width="1" />
<text x="40" y="418" font-size="20" font-weight="700" fill="#78e6c4">03 / MESSAGE</text>
<text x="40" y="454" font-size="25" font-weight="700" fill="#f2f7f8">Communiquer</text>
<text x="40" y="487" font-size="21" font-weight="400" fill="#c9dde3">Texte fixe, humain</text>
<text x="40" y="514" font-size="21" font-weight="400" fill="#c9dde3">ou généré par un modèle</text>
<path d="M 200 539 V 562 M 194 556 L 200 562 L 206 556" fill="none" stroke="#78e6c4" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
<rect x="22" y="572" width="356" height="142" rx="12" fill="#18323e" stroke="#567681" stroke-width="1" />
<text x="40" y="602" font-size="20" font-weight="700" fill="#78e6c4">04 / EXÉCUTION</text>
<text x="40" y="638" font-size="25" font-weight="700" fill="#f2f7f8">Agir sur le dossier</text>
<text x="40" y="671" font-size="21" font-weight="400" fill="#c9dde3">Selon les autorisations</text>
<text x="40" y="698" font-size="21" font-weight="400" fill="#c9dde3">et les contrôles prévus</text>
</g>
</svg>
<figcaption style="margin-top:0.9rem;font-size:0.92em;line-height:1.6;">Grille de lecture, non architecture certifiée : les fonctions peuvent être séparées, absentes ou contrôlées par un humain à différents niveaux. Le contenu d’un message ne prouve pas l’exécution d’une action. Synthèse l0g à partir des descriptions des opérateurs : <a href="#ia1-fr-s09" aria-label="Source 9">[9]</a> <a href="#ia1-fr-s10" aria-label="Source 10">[10]</a> <a href="#ia1-fr-s11" aria-label="Source 11">[11]</a>. Consultation : 24 septembre 2026.</figcaption>
</figure>

Le déploiement doit lui aussi être documenté à la bonne échelle. Dans une communication du **25 juillet 2025**, Intrum citait la France parmi les pays où Ophelos avait été mis en service. Cette annonce ne précise pas quels modules étaient actifs dans chaque portefeuille. Une présence nationale n’établit ni une généralisation de l’IA générative, ni une autonomie complète du recouvrement. <a href="#ia1-fr-s12" aria-label="Source 12">[12]</a>

## Quand un score oriente la suite du dossier

Revenons à la notice française. Intrum considère que ses décisions automatisées n’ont pas d’effet juridique ou significatif, les droits contractuels restant inchangés. L’entreprise indique aussi qu’un réexamen humain de l’évaluation peut être demandé. Elle déclare une supervision régulière des réponses et des logiques de décision de l’IA par des experts humains. Cette supervision annoncée ne démontre pas un contrôle préalable de chaque dossier ; l’ensemble reste la position de l’entreprise, sans validation établie par une autorité. <a href="#ia1-fr-s01" aria-label="Source 1">[1]</a>

L’orientation d’un dossier vers le recouvrement judiciaire ne signifie pas qu’un algorithme rend un jugement. Elle ne vaut pas davantage autorisation immédiate de saisir des biens. L’exécution forcée suppose notamment un titre exécutoire constatant une créance liquide et exigible. La décision de transmettre un dossier et les conditions d’une saisie appartiennent à des étapes différentes. <a href="#ia1-fr-s13" aria-label="Source 13">[13]</a>

La question concerne ici le traitement de la personne **avant** une éventuelle décision judiciaire. L’article 22 du règlement général sur la protection des données (RGPD) encadre les décisions reposant exclusivement sur un traitement automatisé qui produisent des effets juridiques ou affectent la personne de manière significative comparable. La CNIL précise que l’absence de modification formelle des droits n’exclut pas, à elle seule, un effet significatif. <a href="#ia1-fr-s23" aria-label="Source 23">[23]</a>

Des exceptions existent, notamment la nécessité contractuelle, une autorisation légale assortie de garanties ou le consentement explicite. Leur application exige une analyse du cas et des protections correspondantes. L’existence d’un score ne permet donc de conclure ni à une interdiction automatique, ni à une liberté générale d’automatiser. <a href="#ia1-fr-s14" aria-label="Source 14">[14]</a>

Un précédent aide à formuler l’examen. Le **7 décembre 2023**, dans l’affaire SCHUFA, la Cour de justice de l’Union européenne a retenu qu’un score pouvait constituer une décision automatisée lorsque les entreprises qui l’utilisent lui donnent un rôle déterminant dans l’octroi de crédit. Cette affaire ne portait pas sur Intrum ni sur le recouvrement français. Son intérêt ici est de montrer pourquoi le rôle effectif du résultat compte, y compris lorsqu’une autre entreprise intervient ensuite. <a href="#ia1-fr-s15" aria-label="Source 15">[15]</a>

Pour qualifier le dispositif décrit, il manque donc des éléments opérationnels : le score recommande-t-il une transmission ou la déclenche-t-il ? Une personne examine-t-elle les pièces avant d’agir ? Peut-elle écarter le résultat, et le fait-elle effectivement ? Quels effets la décision produit-elle pour le destinataire ?

Les documents publics consultés ne répondent pas à cet ensemble de questions. **Ils justifient une investigation sur le pouvoir du système, pas une accusation d’illégalité.**

## Savoir à qui l’on parle

Un interlocuteur automatisé soulève une autre question, plus directement observable : s’identifie-t-il ? La Commission européenne confirme l’application, depuis le **2 août 2026**, des obligations de transparence de l’article 50 de l’AI Act. Pour les systèmes concernés qui dialoguent directement avec une personne, le fournisseur doit assurer l’information sur leur nature artificielle dès la première interaction, sauf notamment lorsqu’elle est évidente. Cette obligation particulière ne vise pas un score fonctionnant uniquement en arrière-plan. <a href="#ia1-fr-s16" aria-label="Source 16">[16]</a>

L’annonce de la nature de l’interlocuteur et l’explication du traitement restent deux choses différentes. Savoir que l’on parle à une machine ne renseigne pas sur la raison du montant réclamé, la provenance des données ou l’autorité qui a fixé une proposition.

Le RGPD organise cette information indépendamment de l’AI Act. Lorsque les données ont été obtenues ailleurs et servent à contacter la personne, l’article 14 prévoit en principe l’information sur le traitement au plus tard lors de la première communication, avec les exceptions prévues par le texte. La source des données fait partie des informations à fournir. <a href="#ia1-fr-s14" aria-label="Source 14">[14]</a> <a href="#ia1-fr-s24" aria-label="Source 24">[24]</a>

L’absence d’une nouvelle demande de consentement ne suffit toutefois pas à démontrer un traitement illicite. Le consentement n’est qu’une des bases juridiques prévues par le RGPD. Un autre fondement, tel que l’intérêt légitime, suppose de remplir ses conditions, dont la mise en balance avec les droits des personnes. Il ne dispense pas du respect de la finalité, de la minimisation et de l’exactitude des données. <a href="#ia1-fr-s17" aria-label="Source 17">[17]</a>

## Faire suivre la correction

L’une des difficultés à rechercher serait la suivante : une information est corrigée chez le créancier, mais une copie ancienne continue d’alimenter les relances. C’est un **scénario de risque**, pas un incident établi dans cette enquête. Il illustre pourquoi il faut suivre la correction jusqu’au système qui exécute l’action.

Le droit de rectification vise les données personnelles inexactes ou incomplètes. La CNIL rappelle également l’obligation de communiquer la rectification aux destinataires auxquels les données ont été transmises, sauf impossibilité ou efforts disproportionnés. Une réponse polie reconnaissant l’erreur ne permet pas, à elle seule, de vérifier que cette circulation a eu lieu. <a href="#ia1-fr-s18" aria-label="Source 18">[18]</a>

Lorsque l’exactitude de données est contestée, une limitation de leur traitement peut être demandée pendant la vérification. Ce mécanisme ne vaut pas annulation de la dette ni suspension universelle de toute procédure : certaines utilisations restent possibles, notamment pour la constatation, l’exercice ou la défense de droits en justice. <a href="#ia1-fr-s19" aria-label="Source 19">[19]</a>

Pour reconstituer un cas, une demande d’accès peut porter sur les données détenues et leur origine, pas seulement sur une nouvelle copie des conditions générales. La CNIL rappelle qu’un responsable de traitement doit aussi organiser la remontée des informations détenues par ses sous-traitants. Le droit d’accès n’ouvre cependant pas automatiquement tous les documents internes ou les données de tiers. <a href="#ia1-fr-s22" aria-label="Source 22">[22]</a>

L’arrêt **Dun & Bradstreet Austria du 27 février 2025**, relatif à une évaluation automatisée de solvabilité, précise pour sa part la nature de l’explication attendue dans les situations concernées : permettre de comprendre quelles données ont été utilisées et comment. Le secret d’affaires ne justifie pas un refus général ; l’autorité ou le juge doit pouvoir mettre en balance les intérêts. Cela ne se confond pas avec un droit automatique au code source. <a href="#ia1-fr-s20" aria-label="Source 20">[20]</a>

Pour le débiteur, l’information utile est souvent plus concrète : quelle donnée de paiement a été retenue, quel résultat a été produit et quelle action en a découlé ? C’est à ce niveau que l’on peut chercher une erreur et vérifier sa correction.

## Mesurer la résolution du dossier

L’automatisation peut avoir des avantages. Un dispositif qui retrouve rapidement un justificatif ou permet de corriger une erreur sans multiplier les appels pourrait rendre un service réel. Une réduction du coût de traitement n’est pas, en elle-même, contraire à l’intérêt du débiteur. Il faut examiner ce que le système permet de résoudre et ce qu’il laisse sans réponse.

La mesure pertinente dépasse donc la rapidité du dialogue. Une contestation a-t-elle été enregistrée ? Une proposition tient-elle compte des informations vérifiées ? Une personne autorisée peut-elle reprendre le dossier ? Les mêmes questions se posent lorsque le premier interlocuteur est humain.

Enfin, l’identité du professionnel doit être vérifiée par un canal connu, indépendamment du lien éventuellement reçu. Cybermalveillance.gouv.fr recommande cette vérification face aux messages suspects. Il faut conserver le message d’origine sans communiquer de données sensibles à un destinataire non authentifié. Un nom inconnu n’établit pas une fraude ; une formulation convaincante n’établit pas non plus l’authenticité. <a href="#ia1-fr-s21" aria-label="Source 21">[21]</a>

À ce stade, l’apport des documents est de déplacer l’examen vers les décisions qui précèdent la conversation. Il reste à obtenir les configurations et les traces d’exécution permettant de relier, sur un dossier, une donnée, une orientation et ses effets. Un outil peut rendre le recouvrement plus facile à gérer. Pour apprécier son résultat, il faut aussi savoir si la personne concernée peut faire vérifier ce qu’on lui réclame.

Pour prolonger cette lecture, notre enquête sur [la fabrication des profils à partir des traces personnelles](/posts/commerce-traces-fabrication-profils-donnees-personnelles/) explique comment une observation devient une déduction. Celle sur [les données après la fin d’un contrat](/posts/commerce-traces-donnees-apres-fin-contrat/) suit leurs copies et leurs destinataires. Le [glossaire du profilage](/glossaire/profilage/) précise la différence entre évaluer une personne et prendre une décision entièrement automatisée.

## Méthode et limites

Documents publics consultés le **24 septembre 2026** : textes français, publications de la CNIL et de la Commission européenne, communiqués du service de presse de la CJUE et documentation des opérateurs. Les communiqués de la Cour résument les arrêts ; ils ne se substituent pas à leur texte intégral et n’engagent pas la Cour.

Aucun entretien contradictoire, dossier individuel ni essai de plateforme n’a été réalisé pour cette version. La documentation des entreprises établit leurs déclarations, pas l’efficacité réelle de chaque module. La date de publication de la notice Intrum n’est pas établie par son seul nom de fichier. Les constats ne permettent pas de mesurer une fréquence d’erreurs ou de conclure à une infraction d’un acteur nommé.

Les schémas sont des explications de principe. Ils ne reproduisent pas l’architecture certifiée d’une entreprise. Les règles propres aux créances publiques, aux relations entre entreprises et aux procédures spéciales ne sont pas extrapolées ici.

## Sources et documents

Toutes les références ont été consultées le 24 septembre 2026. Les dates ci-dessous désignent une publication, une mise à jour affichée ou l’entrée en vigueur de la version d’un article, selon la précision donnée.

<ol style="padding-left:1.7rem;line-height:1.55;">
<li id="ia1-fr-s01" style="margin:0.75rem 0;"><strong>Intrum Corporate</strong>. <a href="https://www.intrum.fr/media/axfjlwgn/202604-politique-de-confidentialit%C3%A9-client-d%C3%A9biteur.pdf">Notice française de confidentialité, p. 7</a>. Date de publication non établie ; version consultée le 24 septembre 2026.</li>
<li id="ia1-fr-s02" style="margin:0.75rem 0;"><strong>Légifrance</strong>. <a href="https://www.legifrance.gouv.fr/codes/id/LEGISCTA000025938360">Code des procédures civiles d’exécution, R124-1 et R124-3</a>. Versions applicables consultées au 24 septembre 2026.</li>
<li id="ia1-fr-s03" style="margin:0.75rem 0;"><strong>Légifrance</strong>. <a href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032042026">Code civil, article 1321</a>. Version en vigueur depuis le 1er octobre 2016.</li>
<li id="ia1-fr-s04" style="margin:0.75rem 0;"><strong>Légifrance</strong>. <a href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032042011">Code civil, article 1324</a>. Version en vigueur depuis le 1er octobre 2016.</li>
<li id="ia1-fr-s05" style="margin:0.75rem 0;"><strong>DGCCRF</strong>. <a href="https://www.economie.gouv.fr/dgccrf/les-fiches-pratiques/recouvrement-amiable-de-creances-les-regles-connaitre">Recouvrement amiable de créances : les règles à connaître</a>. Publication affichée : 24 octobre 2025.</li>
<li id="ia1-fr-s06" style="margin:0.75rem 0;"><strong>Légifrance</strong>. <a href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032042341">Code civil, article 1353</a>. Version en vigueur depuis le 1er octobre 2016.</li>
<li id="ia1-fr-s07" style="margin:0.75rem 0;"><strong>Légifrance</strong>. <a href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000027015026">Code des procédures civiles d’exécution, R124-4</a>. Version en vigueur depuis le 2 février 2013.</li>
<li id="ia1-fr-s08" style="margin:0.75rem 0;"><strong>Légifrance</strong>. <a href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000028747701">Code des procédures civiles d’exécution, L111-8</a>. Version en vigueur depuis le 19 mars 2014.</li>
<li id="ia1-fr-s09" style="margin:0.75rem 0;"><strong>Intrum Belgique</strong>. <a href="https://www.intrum.be/media/plvfzhac/intrum-ophelos-onepager-be-fr-personalisation.pdf">Brochure Ophelos sur la personnalisation, p. 1</a>. Document non daté ; publication belge.</li>
<li id="ia1-fr-s10" style="margin:0.75rem 0;"><strong>PAIR Finance</strong>. <a href="https://pairfinance.com/fr/intelligence-artificielle/">Présentation française des fonctions d’intelligence artificielle</a>. Page non datée ; version consultée au 24 septembre 2026.</li>
<li id="ia1-fr-s11" style="margin:0.75rem 0;"><strong>Ophelos</strong>. <a href="https://www.ophelos.com/fr/professionnels/ia">Présentation française de l’IA dans le recouvrement</a>. Page non datée ; version consultée au 24 septembre 2026.</li>
<li id="ia1-fr-s12" style="margin:0.75rem 0;"><strong>Intrum</strong>. <a href="https://www.intrum.com/about-us/how-we-do-it-intrum-ai/intrum-expands-ai-native-collections-platform-to-portugal-and-italy/">Extension d’Ophelos au Portugal et à l’Italie</a>. Publication : 25 juillet 2025 ; la France figure parmi les déploiements antérieurs.</li>
<li id="ia1-fr-s13" style="margin:0.75rem 0;"><strong>Légifrance</strong>. <a href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000025025644">Code des procédures civiles d’exécution, L111-2</a>. Version en vigueur depuis le 1er juin 2012.</li>
<li id="ia1-fr-s14" style="margin:0.75rem 0;"><strong>CNIL</strong>. <a href="https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre3">RGPD, chapitre III, notamment articles 14 et 22</a>. Règlement du 27 avril 2016 ; texte consulté au 24 septembre 2026.</li>
<li id="ia1-fr-s15" style="margin:0.75rem 0;"><strong>CJUE, service de presse</strong>. <a href="https://curia.europa.eu/jcms/upload/docs/application/pdf/2023-12/cp230186fr.pdf">Affaire C-634/21, SCHUFA : communiqué n° 186/23, p. 1</a>. Arrêt et communiqué : 7 décembre 2023.</li>
<li id="ia1-fr-s16" style="margin:0.75rem 0;"><strong>Commission européenne</strong>. <a href="https://digital-strategy.ec.europa.eu/en/faqs/transparency-obligations-under-article-50-ai-act">FAQ sur les obligations de transparence de l’article 50 de l’AI Act</a>. Mise à jour affichée : 24 juillet 2026 ; application : 2 août 2026.</li>
<li id="ia1-fr-s17" style="margin:0.75rem 0;"><strong>CNIL</strong>. <a href="https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2">RGPD, chapitre II, articles 5 et 6</a>. Règlement du 27 avril 2016 ; texte consulté au 24 septembre 2026.</li>
<li id="ia1-fr-s18" style="margin:0.75rem 0;"><strong>CNIL</strong>. <a href="https://www.cnil.fr/fr/comprendre-mes-droits/le-droit-de-rectification-corriger-vos-informations">Le droit de rectification : corriger vos informations</a>. Page consultée au 24 septembre 2026.</li>
<li id="ia1-fr-s19" style="margin:0.75rem 0;"><strong>CNIL</strong>. <a href="https://www.cnil.fr/fr/comprendre-mes-droits/le-droit-la-limitation-du-traitement-geler-lutilisation-de-vos-donnees">Le droit à la limitation du traitement</a>. Page consultée au 24 septembre 2026 ; à lire avec l’article 18 du RGPD.</li>
<li id="ia1-fr-s20" style="margin:0.75rem 0;"><strong>CJUE, service de presse</strong>. <a href="https://curia.europa.eu/jcms/upload/docs/application/pdf/2025-02/cp250022fr.pdf">Affaire C-203/22, Dun &amp; Bradstreet Austria : communiqué n° 22/25</a>. Arrêt et communiqué : 27 février 2025.</li>
<li id="ia1-fr-s21" style="margin:0.75rem 0;"><strong>Cybermalveillance.gouv.fr</strong>. <a href="https://www.cybermalveillance.gouv.fr/tous-nos-contenus/fiches-reflexes/hameconnage-phishing">Hameçonnage : les bons réflexes</a>. Publication : 10 janvier 2020 ; mise à jour affichée : 7 mai 2026.</li>
<li id="ia1-fr-s22" style="margin:0.75rem 0;"><strong>CNIL</strong>. <a href="https://www.cnil.fr/fr/repondre-une-demande-de-droit-dacces">Professionnels : répondre à une demande de droit d’accès</a>. Publication affichée : 13 juin 2017 ; version consultée au 24 septembre 2026.</li>
<li id="ia1-fr-s23" style="margin:0.75rem 0;"><strong>CNIL</strong>. <a href="https://www.cnil.fr/fr/profilage-et-decision-entierement-automatisee">Profilage et décision entièrement automatisée</a>. Publication affichée : 29 mai 2018.</li>
<li id="ia1-fr-s24" style="margin:0.75rem 0;"><strong>CNIL</strong>. <a href="https://www.cnil.fr/fr/conformite-rgpd-information-des-personnes-et-transparence">Information des personnes et transparence</a>. Date de publication affichée : 29 juillet 2019 ; contenu signalé comme mis à jour le 26 juillet 2019.</li>
</ol>
