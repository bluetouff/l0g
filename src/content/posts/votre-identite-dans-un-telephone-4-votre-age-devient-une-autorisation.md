---
title: "Votre identité dans un téléphone, 4/8 : votre âge devient une autorisation"
seoTitle: "France Identité : preuve d’âge, traces et coûts | l0g"
ogTitle: "Votre âge devient une autorisation"
description: "France Identité peut attester 15 ans ou plus via ÉduConnect. Derrière le oui/non : journaux, erreurs, ZKP et coûts possibles."
ogImage: "/illustrations/news/france-identite-age-proof-gate-v1.jpg"
pubDate: 2026-08-28T17:11:15+02:00
updatedDate: 2026-08-28T17:11:15+02:00
tags: ["France Identité", "ÉduConnect", "preuve d’âge", "identité numérique", "ZKP", "Arcom", "CNIL", "EUDI", "protection des mineurs", "risque financier", "enquête"]
draft: false
quickTake:
  fact: "Depuis juin 2026, France Identité intègre une preuve 15+ fondée sur ÉduConnect pour les élèves éligibles du second degré public. Le tiers reçoit le seuil, pas l’identité complète."
  importance: "L’âge devient une autorisation logicielle. Une erreur ou un péage par vérification peut affecter l’accès à des contenus, achats ou services réglementés."
  uncertainty: "Les services qui acceptent la preuve française, le protocole utilisé, le contenu exact des journaux et les taux de refus ne sont pas publiquement cartographiés."
---

*Le 5 juin 2026, trois mots apparaissent dans l’historique de France Identité : « présentation de preuve d’âge ». Les conditions générales publiées par l’État décrivent une fonction distincte de l’identité numérique réservée aux adultes. Un élève éligible du second degré public peut désormais demander à l’application d’attester qu’il a au moins quinze ans à partir de son compte ÉduConnect.*

*Le service vérificateur ne doit recevoir ni son nom, ni sa date de naissance complète, ni son adresse électronique. C’est un progrès tangible face aux copies de pièces d’identité et aux selfies biométriques. Mais l’âge change aussi de nature. Il cesse d’être seulement une information inscrite dans un registre. Il devient un jeton logiciel qui ouvre ou ferme une porte.*

*Derrière le « oui » ou le « non » se trouvent une source de données, un émetteur, une application, des journaux, un vérificateur, une décision automatisée et parfois une facture par contrôle. Si une preuve erronée bloque un achat, un compte, un pari, un contrat ou un service payé, la question de vie privée devient un risque financier.*

*Quatrième volet de l’enquête **Votre identité dans un téléphone**. Le premier suivait [les données et les traces de France Identité](/posts/votre-identite-dans-un-telephone-1-la-carte-d-identite-qui-devient-un-service/). Le deuxième mesurait [le coût pratique des alternatives](/posts/votre-identite-dans-un-telephone-2-facultative-mais-a-quel-prix/). Le troisième examinait [la chaîne contractuelle qui fabrique l’identité souveraine](/posts/votre-identite-dans-un-telephone-3-l-identite-souveraine-sous-contrat/). [L’édition complète rassemble la série, les infographies et les téléchargements](/publications/votre-identite-dans-un-telephone/).*

*English version: [Age becomes an access credential](/en/analysis/your-identity-in-your-phone-4-age-becomes-an-access-credential/).*

## À retenir

- La version 1.3.4290 de France Identité, publiée le 5 juin 2026, a ajouté la « présentation de preuve d’âge ».
- Les CGU officielles décrivent un service réservé aux élèves des établissements publics du second degré disposant d’un compte ÉduConnect valide.
- Le seul seuil actuellement annoncé est **15 ans ou plus**. Cette attestation n’est ni une carte d’identité, ni un titre officiel, ni une autorisation parentale.
- Le service tiers reçoit uniquement l’information nécessaire au seuil demandé. La politique de confidentialité indique qu’il ne reçoit ni le nom, ni le prénom, ni la date de naissance complète, ni l’adresse électronique.
- L’attestation est conservée localement. Les données d’identité utilisées pour la générer ne doivent pas être conservées par l’ANTS au-delà de l’opération. Des journaux d’audit horodatés peuvent en revanche être conservés jusqu’à trois ans.
- Les documents publics ne décrivent pas le dictionnaire de ces journaux, la liste des services raccordés, le volume d’usage, le taux de refus ni le protocole cryptographique réellement utilisé en France.
- Le blueprint européen permet également de transmettre un simple attribut booléen, comme `age_over_18: true`. Sa version fonctionnelle est disponible depuis avril 2026 et la France fait partie des sept États pilotes.
- Le cadre européen propose des attestations à usage unique émises par lots et une présentation par preuve à divulgation nulle de connaissance, ou ZKP. La spécification normative recommande le ZKP sans l’imposer à tous les vérificateurs.
- L’annexe technique qualifie encore le mécanisme ZKP d’expérimental et indique que le schéma retenu n’a pas été revu par les pairs. Cela ne démontre aucune faiblesse, mais interdit de présenter sa maturité comme acquise.
- Le Conseil constitutionnel n’a pas interdit la vérification d’âge. Il a censuré, le 14 août 2026, une interdiction générale des réseaux sociaux qui aurait obligé toute personne, même majeure, à prouver son âge sans garanties légales assez précises.
- Le référentiel de l’Arcom impose déjà, pour les sites pornographiques concernés, une preuve à chaque consultation, un tiers indépendant, au moins une solution en « double anonymat », plusieurs méthodes et un recours après erreur.
- Des vendeurs affichent publiquement des tarifs allant de quelques centimes à plusieurs dizaines de centimes par contrôle. Ce ne sont pas des prix moyens, mais ils montrent qu’un « oui/non » répété à grande échelle peut devenir un marché considérable.

## Une fonction apparue dans les notes de version

L’[historique officiel de l’application sur l’App Store](https://apps.apple.com/fr/app/france-identit%C3%A9/id1590142959) date l’ajout de la présentation de preuve d’âge du **5 juin 2026**. La description générale continue pourtant de présenter l’identité numérique régalienne comme destinée aux personnes de plus de dix-huit ans possédant la nouvelle CNI.

Les deux affirmations ne sont pas nécessairement contradictoires. Elles décrivent deux portes différentes :

```text
Identité numérique régalienne complète
CNI électronique + majorité
→ identité, authentification, titres numériques

Preuve d’âge ÉduConnect
compte scolaire + éligibilité + au moins 15 ans
→ attestation limitée à un seuil d’âge
```

Les [CGU ÉduConnect](https://france-identite.gouv.fr/conditions-generales-utilisation/cgu-educonnect/) sont explicites. Le service est accessible aux élèves des établissements du second degré public disposant d’un compte ÉduConnect valide, selon les conditions fixées par le ministère de l’Éducation nationale. Il ne permet aujourd’hui que de démontrer que l’utilisateur a **quinze ans ou plus**.

L’attestation ne remplace pas la carte d’identité. Elle ne prouve pas qui est son titulaire au sens général, ne vaut pas autorisation parentale et n’accorde aucun accès automatique. Le service vérificateur reste responsable de ses propres conditions et peut réclamer des contrôles complémentaires.

Cette distinction est importante. France Identité ne donne pas à un adolescent une identité numérique régalienne complète. Elle lui fournit un attribut ciblé.

Dans le corpus public consulté au 28 août 2026, l0g n’a pas retrouvé de communiqué de lancement dédié, de registre des services acceptant cette preuve ni de statistiques d’usage. Cela ne prouve ni un déploiement secret, ni une absence d’utilisation. Cela signifie que la fonction est visible dans l’application et dans ses textes juridiques, mais que son périmètre opérationnel reste difficile à mesurer.

Les CGU laissent même apparaître, après leur article 9, une note éditoriale interne commençant par `[RB1]`. Ce détail ne constitue pas un incident de sécurité. Il montre qu’une note de travail est restée dans la version publique d’un texte destiné à des mineurs.

## Une date de naissance devient une décision

La chaîne française documentée part d’ÉduConnect. Le service scolaire transmet à l’ANTS les données nécessaires à l’éligibilité et à la génération de l’attestation. La [politique de confidentialité dédiée](https://france-identite.gouv.fr/politique-de-confidentialite/confidentialite-educonnect/) cite le nom d’usage, le prénom, la date de naissance et l’adresse électronique.

L’ANTS transforme ensuite ces informations en une preuve limitée. Celle-ci est stockée sur le téléphone. Lors de la présentation, le tiers doit seulement recevoir l’information permettant de vérifier le seuil requis.

<figure class="infographic" style="padding-bottom:1.5rem" tabindex="0" aria-label="Une date de naissance devient une décision">
<svg viewBox="0 0 360 890" width="100%" role="img" aria-labelledby="flow-fr-title flow-fr-desc" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;height:auto;overflow:hidden;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;background:#0c0d10">
<title id="flow-fr-title">UNE DATE DE NAISSANCE DEVIENT UNE DÉCISION</title>
<desc id="flow-fr-desc">Chaîne documentée de la preuve d’âge France Identité fondée sur ÉduConnect</desc>
<rect x="1" y="1" width="358" height="888" rx="16" fill="#0c0d10" stroke="#2b3038"/>
<text x="18" y="40" fill="#f5f6f8" font-size="13.5" font-weight="700">UNE DATE DE NAISSANCE DEVIENT</text>
<text x="18" y="60" fill="#f5f6f8" font-size="13.5" font-weight="700">UNE DÉCISION</text>
<text x="18" y="82" fill="#8b909b" font-size="8.5">Parcours France Identité + ÉduConnect documenté</text>
<rect x="22" y="108" width="316" height="116" rx="12" fill="#101319" stroke="#7aa2f7"/>
<text x="38" y="136" fill="#7aa2f7" font-size="10.5" font-weight="700">1. SOURCE</text>
<text x="38" y="162" fill="#f5f6f8" font-size="10">ÉduConnect</text>
<text x="38" y="184" fill="#aeb4bf" font-size="9">Nom, prénom, naissance, courriel</text>
<text x="38" y="204" fill="#6f7580" font-size="8.5">Vérifie l’éligibilité scolaire</text>
<path d="M180 224 V252" stroke="#7aa2f7" stroke-width="2"/>
<path d="M174 244 L180 254 L186 244" fill="#7aa2f7"/>
<rect x="22" y="258" width="316" height="116" rx="12" fill="#101319" stroke="#5eead4"/>
<text x="38" y="286" fill="#5eead4" font-size="10.5" font-weight="700">2. ÉMETTEUR</text>
<text x="38" y="312" fill="#f5f6f8" font-size="10">ANTS / France Identité</text>
<text x="38" y="334" fill="#aeb4bf" font-size="9">Génère une attestation « 15+ »</text>
<text x="38" y="354" fill="#6f7580" font-size="8.5">Peut suspendre ou supprimer le service</text>
<path d="M180 374 V402" stroke="#5eead4" stroke-width="2"/>
<path d="M174 394 L180 404 L186 394" fill="#5eead4"/>
<rect x="22" y="408" width="316" height="116" rx="12" fill="#101319" stroke="#a78bfa"/>
<text x="38" y="436" fill="#a78bfa" font-size="10.5" font-weight="700">3. PORTEFEUILLE</text>
<text x="38" y="462" fill="#f5f6f8" font-size="10">Attestation conservée localement</text>
<text x="38" y="484" fill="#aeb4bf" font-size="9">Présentation à l’initiative de l’usager</text>
<text x="38" y="504" fill="#6f7580" font-size="8.5">Un seul appareil actif peut être imposé</text>
<path d="M180 524 V552" stroke="#a78bfa" stroke-width="2"/>
<path d="M174 544 L180 554 L186 544" fill="#a78bfa"/>
<rect x="22" y="558" width="316" height="116" rx="12" fill="#101319" stroke="#f5b13d"/>
<text x="38" y="586" fill="#f5b13d" font-size="10.5" font-weight="700">4. VÉRIFICATEUR</text>
<text x="38" y="612" fill="#f5f6f8" font-size="10">Reçoit le seuil, pas l’identité complète</text>
<text x="38" y="634" fill="#aeb4bf" font-size="9">Peut demander un contrôle supplémentaire</text>
<text x="38" y="654" fill="#6f7580" font-size="8.5">Décide seul de l’accès à son service</text>
<path d="M180 674 V702" stroke="#f5b13d" stroke-width="2"/>
<path d="M174 694 L180 704 L186 694" fill="#f5b13d"/>
<rect x="22" y="708" width="316" height="104" rx="12" fill="#171217" stroke="#ff4d87"/>
<text x="38" y="736" fill="#ff85ad" font-size="10.5" font-weight="700">5. DÉCISION</text>
<text x="38" y="762" fill="#f5f6f8" font-size="10">Accès accordé ou refusé</text>
<text x="38" y="784" fill="#aeb4bf" font-size="9">Le « oui » ne crée aucun droit automatique</text>
<rect x="14" y="836" width="332" height="38" rx="8" fill="#15171b" stroke="#3a4049"/>
<text x="26" y="852" fill="#aeb4bf" font-size="7.8">Sources : CGU et politique de confidentialité ÉduConnect.</text>
<text x="26" y="866" fill="#6f7580" font-size="7.8">Le protocole précis et les services raccordés restent à établir.</text>
</svg>
<figcaption>La preuve réduit les données communiquées au service final. Elle ajoute aussi plusieurs acteurs entre la date de naissance et la décision d’accès.</figcaption>
</figure>

Cette architecture est plus protectrice qu’une photocopie. Elle rend aussi l’accès dépendant de la qualité des données scolaires, de l’éligibilité, de l’application, de la validité de l’attestation et de la politique du vérificateur.

## Un « oui » limité au seuil

La minimisation annoncée est forte.

Selon la politique de confidentialité, le tiers ne reçoit notamment ni nom, ni prénom, ni date de naissance complète, ni adresse électronique. Les données d’identité utilisées pour générer la preuve ne sont pas conservées par l’ANTS au-delà de la durée nécessaire à l’opération. L’attestation reste sur le terminal jusqu’à sa suppression, son expiration ou son renouvellement.

Ce modèle évite que chaque plateforme obtienne une nouvelle copie de l’état civil. Il limite aussi le dommage potentiel d’une fuite chez le service final : un attribut « 15+ » est moins exploitable qu’une carte d’identité et un selfie.

La même politique prévoit toutefois deux autres catégories :

- des données agrégées relatives à l’utilisation du service ;
- des journaux d’audit collectés, horodatés et conservés pendant une durée maximale de **trois ans** pour la sécurité, la prévention de la fraude et l’investigation.

Le document ne publie pas le dictionnaire de ces journaux. Il ne permet donc pas de savoir s’ils contiennent uniquement une opération générique, ou également un identifiant de terminal, un résultat, une catégorie de service, un domaine, un émetteur de requête ou une information de session.

Il faut distinguer quatre propriétés :

```text
MINIMISATION
Le vérificateur reçoit-il seulement le seuil ?

CÉCITÉ DE L’ÉMETTEUR
L’ANTS ou ÉduConnect ignorent-ils le service consulté ?

NON-CORRÉLATION
Deux présentations peuvent-elles être reconnues comme liées ?

TRACE RÉSIDUELLE
Quels journaux subsistent, chez qui et pendant combien de temps ?
```

Les textes français documentent clairement la première propriété. Ils ne suffisent pas encore à établir les trois autres.

<figure class="infographic" style="padding-bottom:1.5rem" tabindex="0" aria-label="Anonyme pour qui">
<svg viewBox="0 0 360 760" width="100%" role="img" aria-labelledby="privacy-fr-title privacy-fr-desc" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;height:auto;overflow:hidden;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;background:#0c0d10">
<title id="privacy-fr-title">ANONYME POUR QUI ?</title>
<desc id="privacy-fr-desc">Quatre propriétés distinctes de la preuve d’âge française</desc>
<rect x="1" y="1" width="358" height="758" rx="16" fill="#0c0d10" stroke="#2b3038"/>
<text x="18" y="42" fill="#f5f6f8" font-size="15" font-weight="700">ANONYME POUR QUI ?</text>
<text x="18" y="64" fill="#8b909b" font-size="8.5">Une donnée minimisée n’est pas automatiquement intraçable</text>
<rect x="16" y="92" width="328" height="126" rx="12" fill="#10211f" stroke="#5eead4"/>
<text x="32" y="120" fill="#5eead4" font-size="10.5" font-weight="700">VÉRIFICATEUR</text>
<text x="32" y="146" fill="#f5f6f8" font-size="9.5">Reçoit uniquement le seuil nécessaire</text>
<text x="32" y="168" fill="#aeb4bf" font-size="8.8">Nom et date complète non transmis</text>
<rect x="32" y="184" width="104" height="20" rx="5" fill="#17322d"/>
<text x="84" y="198" text-anchor="middle" fill="#5eead4" font-size="8" font-weight="700">DOCUMENTÉ</text>
<rect x="16" y="234" width="328" height="126" rx="12" fill="#141a28" stroke="#7aa2f7"/>
<text x="32" y="262" fill="#7aa2f7" font-size="10.5" font-weight="700">ÉMETTEUR</text>
<text x="32" y="288" fill="#f5f6f8" font-size="9.5">Sait-il auprès de quel site la preuve sert ?</text>
<text x="32" y="310" fill="#aeb4bf" font-size="8.8">La réponse publique n’est pas assez précise</text>
<rect x="32" y="326" width="104" height="20" rx="5" fill="#20263a"/>
<text x="84" y="340" text-anchor="middle" fill="#7aa2f7" font-size="8" font-weight="700">INCONNU</text>
<rect x="16" y="376" width="328" height="126" rx="12" fill="#1b1b14" stroke="#f5b13d"/>
<text x="32" y="404" fill="#f5b13d" font-size="10.5" font-weight="700">CORRÉLATION</text>
<text x="32" y="430" fill="#f5f6f8" font-size="9.5">Deux preuves viennent-elles du même usager ?</text>
<text x="32" y="452" fill="#aeb4bf" font-size="8.8">Format et identifiants non publiés ici</text>
<rect x="32" y="468" width="104" height="20" rx="5" fill="#322a18"/>
<text x="84" y="482" text-anchor="middle" fill="#f5b13d" font-size="8" font-weight="700">À TESTER</text>
<rect x="16" y="518" width="328" height="142" rx="12" fill="#21151c" stroke="#ff85ad"/>
<text x="32" y="546" fill="#ff85ad" font-size="10.5" font-weight="700">JOURNAUX</text>
<text x="32" y="572" fill="#f5f6f8" font-size="9.5">Traces d’audit horodatées, jusqu’à 3 ans</text>
<text x="32" y="594" fill="#aeb4bf" font-size="8.8">Champs précis et destinataires non détaillés</text>
<rect x="32" y="616" width="150" height="20" rx="5" fill="#35202b"/>
<text x="107" y="630" text-anchor="middle" fill="#ff85ad" font-size="8" font-weight="700">DURÉE DOCUMENTÉE</text>
<rect x="14" y="690" width="332" height="52" rx="8" fill="#15171b" stroke="#3a4049"/>
<text x="26" y="711" fill="#aeb4bf" font-size="7.8">La minimisation protège le contenu transmis.</text>
<text x="26" y="727" fill="#6f7580" font-size="7.8">La non-corrélation exige des garanties supplémentaires.</text>
</svg>
<figcaption>Le mot « anonyme » recouvre plusieurs propriétés différentes. Une preuve peut minimiser les données sans être totalement aveugle, non corrélable ou sans traces.</figcaption>
</figure>

## Le double anonymat est un objectif plus exigeant

Le référentiel français de l’Arcom emploie l’expression « double anonymat », tout en précisant qu’il ne s’agit pas d’anonymat au sens du RGPD. Le terme décrit une organisation de forte confidentialité :

- le service final reçoit la preuve de majorité sans connaître l’identité ;
- l’émetteur de la preuve ne doit pas savoir quel service est consulté ;
- le service ne doit pas pouvoir reconnaître plusieurs présentations du même utilisateur à partir du mécanisme de vérification ;
- les autres intermédiaires ne doivent pas pouvoir recoller les transactions.

La [CNIL résume ce principe](https://cnil.fr/fr/verification-de-lage-en-ligne-la-cnil-rend-son-avis-sur-le-referentiel-de-larcom) par l’étanchéité entre le site et le prestataire d’âge. Elle recommande aussi que l’utilisateur puisse conserver ou générer localement des preuves, afin de ne pas appeler un tiers à chaque accès.

Le modèle français ÉduConnect peut remplir une partie de ces propriétés. Les documents publics consultés ne permettent pas encore de l’affirmer pour l’ensemble.

## L’Europe fabrique une mini-wallet de l’âge

La Commission européenne a publié son premier blueprint le 14 juillet 2025. Elle indique que la solution est devenue **feature ready** le 15 avril 2026 et qu’elle peut désormais être adaptée par les États et les acteurs privés. La France fait partie des sept pays pilotes avec Chypre, le Danemark, la Grèce, l’Irlande, l’Italie et l’Espagne. ([Commission européenne](https://digital-strategy.ec.europa.eu/fr/faqs/eu-age-verification-solution))

La solution peut être une application autonome ou être intégrée au futur portefeuille EUDI. Elle utilise le même socle technique et doit permettre de prouver un seuil, initialement 18 ans, sans révéler les autres attributs. Le format européen prévoit un booléen du type :

```json
{
  "age_over_18": true
}
```

Le [profil normatif européen](https://ageverification.dev/av-doc-technical-specification/docs/annexes/annex-A/annex-A-av-profile/) interdit d’inclure d’autres attributs dans cette attestation. L’architecture peut techniquement supporter d’autres seuils, mais leur déploiement exige une méthode d’enrôlement et une base légale adaptées.

La Commission prépare également un régime de confiance. Elle doit publier une liste des émetteurs autorisés et une liste des solutions reconnues. Les vérificateurs devront contrôler que la preuve provient d’un émetteur inscrit. ([Commission européenne](https://digital-strategy.ec.europa.eu/en/policies/eu-age-verification))

Le chantier représente déjà une commande publique. L’[appel d’offres européen](https://digital-strategy.ec.europa.eu/fr/funding/call-tenders-development-consultancy-and-support-age-verification-solution) a été lancé en octobre 2024 avec un budget de **4 millions d’euros**. Le développement et l’assistance sont assurés par le consortium T-Scy, composé de Scytáles et T-Systems, dans le cadre d’un contrat de deux ans attribué au début de 2025. ([Commission européenne](https://digital-strategy.ec.europa.eu/en/news/commission-makes-available-age-verification-blueprint))

## Trente preuves à usage unique, puis le ZKP

Le blueprint prévoit deux grandes méthodes de présentation.

### Les attestations classiques

La [spécification d’architecture](https://ageverification.dev/av-doc-technical-specification/docs/architecture-and-technical-specifications/) indique que les attestations classiques sont conçues pour un usage unique. L’émetteur doit savoir les délivrer par lots et la recommandation porte sur **trente preuves par lot**.

Cette solution limite la réutilisation d’un identifiant stable. Elle n’élimine pas tous les indices. Les horodatages peuvent servir de vecteur de rapprochement. Le document demande donc de réduire leur précision et recommande une réidentification de l’utilisateur au moins tous les trois mois.

### La preuve à divulgation nulle de connaissance

Avec un ZKP, l’application ne présente plus l’attestation elle-même. Elle démontre cryptographiquement qu’elle possède une preuve valide comportant le bon attribut. Le vérificateur reçoit le résultat sans recevoir la pièce sous-jacente.

La [feuille de route](https://ageverification.dev/Roadmap/) recense une version Android en janvier 2026 et une intégration iOS en juillet. Cette méthode vise la non-corrélation : plusieurs preuves ne devraient pas pouvoir être reliées au même utilisateur.

Mais le niveau d’obligation est essentiel. Dans les [spécifications normatives](https://ageverification.dev/av-doc-technical-specification/docs/architecture-and-technical-specifications/), le vérificateur **SHOULD** prendre en charge le mécanisme ZKP. Il ne s’agit pas d’un **SHALL**. Le cadre autorise donc un fonctionnement sans ZKP lorsqu’un environnement ne le supporte pas.

L’[annexe technique consacrée au ZKP](https://docs.ageverification.dev/av-doc-technical-specification/docs/annexes/annex-B/annex-B-zkp/) qualifie encore cette fonction d’expérimentale. Elle indique que le schéma choisi, fondé sur des identifiants anonymes à partir d’ECDSA, disposait d’une implémentation bêta, d’un projet individuel soumis à l’IETF et n’avait pas encore été revu par les pairs.

Cela ne prouve pas que la cryptographie est faible. Cela établit que la solution européenne a privilégié une mise sur le marché rapide et compatible avec les formats existants, alors même que sa propre grille de sélection souhaitait un schéma revu par la communauté scientifique.

## Du code de référence au service de production

Le blueprint publie ses spécifications et son code. Il permet de tester le parcours complet. Ses propres documents préviennent néanmoins que les applications de démonstration ne doivent pas être déployées telles quelles.

Le [guide de durcissement](https://docs.ageverification.dev/av-app-android-wallet-ui/docs/production-hardening-guide-v3.8/) demande notamment de remplacer les serveurs simulés, les ancres de confiance de test, les identifiants d’application et les clés de signature. Il faut aussi organiser l’intégrité du terminal, le pinning éventuel, la télémétrie, la rotation des clés, la politique de mise à jour forcée et le comportement en cas d’échec.

Une annonce disant « la solution européenne est prête » doit donc être lue avec précision :

```text
Prête comme blueprint fonctionnel et adaptable
≠
Déjà déployée et auditée comme service national français
```

Aucun document consulté ne permet d’affirmer que la preuve ÉduConnect utilise actuellement le profil `eu.europa.ec.av.1`, les lots de trente attestations ou le ZKP européen.

## Le Conseil constitutionnel vient de fixer la ligne rouge

La loi française visant à interdire les réseaux sociaux aux moins de quinze ans devait généraliser une nouvelle forme de contrôle. Son article premier a été déclaré contraire à la Constitution le **14 août 2026**. La loi promulguée le 24 août conserve un article 1 vide, remplacé par la mention de la censure. ([Légifrance](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054743001))

Le Conseil n’a pas interdit la vérification d’âge.

Il a jugé que l’interdiction générale portait une atteinte disproportionnée à la liberté d’expression et de communication. Il a aussi relevé un effet mécanique : interdire l’accès aux moins de quinze ans oblige **toute personne, même majeure**, à faire la preuve de son âge. Le législateur n’avait pas défini les conditions et les limites de cette justification, ni les garanties légales nécessaires au respect de la vie privée. ([Décision 2026-911 DC](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054743009))

La décision impose une discipline qui dépasse les réseaux sociaux :

```text
Qui doit prouver son âge ?
Pour quel service précis ?
Avec quelle méthode ?
Quelles données et quels journaux ?
Pendant combien de temps ?
Quelle alternative et quel recours ?
```

Le seuil ne suffit pas. La loi doit encadrer l’infrastructure qui l’applique.

## La pornographie sert déjà de laboratoire grandeur nature

Le [référentiel technique de l’Arcom](https://www.arcom.fr/sites/default/files/2024-10/Arcom-Referentiel-technique-sur-la-verification-de-age-pour-la-protection-des-mineurs-contre-la-pornographie-en-ligne.pdf) permet d’observer les conséquences d’une vérification réellement obligatoire.

### Une preuve à chaque consultation

L’Arcom attend une vérification à chaque nouvelle consultation. Une preuve réutilisable est possible si elle est liée au terminal et protégée par un second facteur. Sa validité doit cesser à la fin de la session, à la fermeture du navigateur, lors de la mise en veille ou, au plus tard, après une heure d’inactivité.

Cette règle peut produire un volume important de décisions. Une même personne majeure peut devoir être vérifiée plusieurs fois dans la journée sans créer un compte.

### Un prestataire indépendant

Le site ne doit pas traiter les données d’identité utilisées pour générer la preuve. Le fournisseur de vérification doit être juridiquement et techniquement indépendant du service. L’Arcom précise que son référentiel ne certifie pas une liste de solutions : chaque site choisit son outil et reste responsable de sa conformité.

### Deux méthodes et une couverture minimale

Le dispositif le plus protecteur doit offrir au moins deux méthodes d’obtention de preuve et être disponible pour au moins **80 % de la population majeure résidant en France**. L’objectif est d’éviter qu’une seule technologie, comme un selfie ou une carte d’identité électronique, exclue une part trop importante du public.

### Un refus contestable

Le référentiel considère que le refus fondé sur la preuve constitue, dans ce contexte, une décision automatisée susceptible de produire des effets significatifs. Le fournisseur doit organiser un recours après erreur et, si possible, offrir plusieurs sources d’attribut ou plusieurs émetteurs.

Cette logique devient financière dès que l’âge contrôle un achat, un jeu d’argent, une souscription ou un service déjà payé. Une erreur n’est plus seulement une page inaccessible. Elle peut devenir un solde immobilisé, une transaction perdue ou un coût de support.

## La réglementation modifie déjà l’offre disponible

En juin 2025, le groupe Aylo a suspendu l’accès à ses services en France, y compris pour les majeurs, plutôt que de déployer le système demandé. L’[Arcom a pris acte de cette décision](https://www.arcom.fr/presse/larcom-prend-acte-de-la-decision-du-groupe-aylo).

Au 3 février 2026, l’autorité indiquait que les **17 sites** désignés par l’arrêté de février 2025 avaient soit mis en place une solution, soit, pour trois d’entre eux, rendu leur service inaccessible en France. Sur les sites mesurés par Médiamétrie, les 12-17 ans avaient passé **35 % de temps en moins** entre novembre 2024 et novembre 2025. L’Arcom présentait ce résultat comme initial et à confirmer. ([Arcom](https://www.arcom.fr/en/press/fighting-exposure-persons-under-18-pornography-arcom-issues-formal-notice-two-new-porn-sites))

L’Arcom observe donc une baisse d’usage concomitante à la mise en œuvre du dispositif, sans publier ici d’identification causale. Cette mise en œuvre entraîne ou peut entraîner :

- des coûts d’intégration ;
- des coûts par contrôle ;
- des abandons de parcours ;
- des besoins de support et de recours ;
- le retrait de certains services du marché français ;
- une concentration possible autour des fournisseurs capables de satisfaire le référentiel.

Mesurer ces coûts ne revient pas à nier le coût social de l’exposition des mineurs. Cela permet de comprendre comment une obligation publique reconfigure un marché.

## Le péage du « oui/non »

La preuve d’âge peut être gratuite pour l’utilisateur final tout en étant facturée au site, au commerçant ou à l’émetteur.

Plusieurs vendeurs publient leurs propres tarifs :

- [AgeCheck API](https://www.agecheckapi.com/pricing) affiche un tarif indicatif de 0,10 euro par vérification ;
- [AgeEvidence](https://ageevidence.com/pricing) affiche entre 0,05 et 0,15 euro pour une vérification limitée à l’âge, selon le plan et le volume, avec des minimums mensuels sur certains forfaits ;
- [Didit](https://didit.me/fr/products/age-estimation/) affiche 0,10 dollar pour une estimation faciale de l’âge ;
- [AgeWallet](https://agewallet.com/pricing/) affiche 0,30 dollar pour la vérification initiale et 0,008 dollar pour certaines autorisations ultérieures.

Ces offres ne sont pas directement comparables. Elles n’utilisent pas les mêmes données, ne fournissent pas le même niveau d’assurance et ne sont pas nécessairement déployées en France. Leurs tarifs publics ne constituent ni une moyenne du marché, ni le prix futur de France Identité.

Ils permettent un calcul de scénario.

<figure class="infographic" style="padding-bottom:1.5rem" tabindex="0" aria-label="Le péage du oui non">
<svg viewBox="0 0 360 750" width="100%" role="img" aria-labelledby="cost-fr-title cost-fr-desc" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;height:auto;overflow:hidden;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;background:#0c0d10">
<title id="cost-fr-title">LE PÉAGE DU OUI/NON</title>
<desc id="cost-fr-desc">Coût théorique de volumes de vérification à trois tarifs unitaires</desc>
<rect x="1" y="1" width="358" height="748" rx="16" fill="#0c0d10" stroke="#2b3038"/>
<text x="18" y="42" fill="#f5f6f8" font-size="15" font-weight="700">LE PÉAGE DU « OUI/NON »</text>
<text x="18" y="64" fill="#8b909b" font-size="8.5">Scénarios arithmétiques, pas estimation du marché français</text>
<rect x="16" y="94" width="328" height="176" rx="12" fill="#10211f" stroke="#5eead4"/>
<text x="32" y="124" fill="#5eead4" font-size="12" font-weight="700">0,05 € PAR CONTRÔLE</text>
<text x="32" y="158" fill="#f5f6f8" font-size="10">1 million</text>
<text x="328" y="158" text-anchor="end" fill="#f5f6f8" font-size="10" font-weight="700">50 000 €</text>
<text x="32" y="190" fill="#f5f6f8" font-size="10">10 millions</text>
<text x="328" y="190" text-anchor="end" fill="#f5f6f8" font-size="10" font-weight="700">500 000 €</text>
<text x="32" y="222" fill="#f5f6f8" font-size="10">100 millions</text>
<text x="328" y="222" text-anchor="end" fill="#f5f6f8" font-size="10" font-weight="700">5 M€</text>
<rect x="16" y="286" width="328" height="176" rx="12" fill="#141a28" stroke="#7aa2f7"/>
<text x="32" y="316" fill="#7aa2f7" font-size="12" font-weight="700">0,10 € PAR CONTRÔLE</text>
<text x="32" y="350" fill="#f5f6f8" font-size="10">1 million</text>
<text x="328" y="350" text-anchor="end" fill="#f5f6f8" font-size="10" font-weight="700">100 000 €</text>
<text x="32" y="382" fill="#f5f6f8" font-size="10">10 millions</text>
<text x="328" y="382" text-anchor="end" fill="#f5f6f8" font-size="10" font-weight="700">1 M€</text>
<text x="32" y="414" fill="#f5f6f8" font-size="10">100 millions</text>
<text x="328" y="414" text-anchor="end" fill="#f5f6f8" font-size="10" font-weight="700">10 M€</text>
<rect x="16" y="478" width="328" height="176" rx="12" fill="#21151c" stroke="#ff85ad"/>
<text x="32" y="508" fill="#ff85ad" font-size="12" font-weight="700">0,30 € PAR CONTRÔLE</text>
<text x="32" y="542" fill="#f5f6f8" font-size="10">1 million</text>
<text x="328" y="542" text-anchor="end" fill="#f5f6f8" font-size="10" font-weight="700">300 000 €</text>
<text x="32" y="574" fill="#f5f6f8" font-size="10">10 millions</text>
<text x="328" y="574" text-anchor="end" fill="#f5f6f8" font-size="10" font-weight="700">3 M€</text>
<text x="32" y="606" fill="#f5f6f8" font-size="10">100 millions</text>
<text x="328" y="606" text-anchor="end" fill="#f5f6f8" font-size="10" font-weight="700">30 M€</text>
<rect x="14" y="680" width="332" height="52" rx="8" fill="#15171b" stroke="#3a4049"/>
<text x="26" y="701" fill="#aeb4bf" font-size="7.8">Calcul : volume × tarif hypothétique.</text>
<text x="26" y="717" fill="#6f7580" font-size="7.8">Hors abonnement, intégration, échec, support et recours.</text>
</svg>
<figcaption>À grande échelle, quelques centimes par contrôle suffisent à créer un poste de coût à plusieurs millions d’euros. Le graphique n’est pas une prévision de chiffre d’affaires.</figcaption>
</figure>

La question économique ne se limite pas au tarif API. Il faut ajouter :

```text
Intégration technique
Audit de conformité
Stockage ou preuve de conformité
Échecs et nouvelles tentatives
Support humain
Recours manuel
Abandon d’achat
Indisponibilité du fournisseur
```

Une preuve locale réutilisable peut réduire le nombre de contrôles payants. Une obligation de vérification à chaque session peut au contraire multiplier les événements facturables. La forme technique choisie détermine donc une partie de l’économie du marché.

## Les banques peuvent devenir des émetteurs d’âge

Les spécifications européennes ne réservent pas l’émission aux administrations. Elles citent parmi les sources privées fiables les banques, opérateurs mobiles et fournisseurs de services collectifs. La [feuille de route de mars 2026](https://ageverification.dev/Roadmap/) mentionne explicitement l’émission depuis une application tierce, par exemple une application bancaire.

Le raisonnement est simple. Une banque a déjà vérifié l’identité et la date de naissance de son client dans le cadre de ses obligations KYC. Elle pourrait émettre une preuve de majorité sans transmettre le dossier bancaire.

Cette possibilité peut réduire les frictions. Elle peut aussi étendre le rôle économique des banques :

```text
Connaissance client bancaire
→ attestation d’âge
→ accès à un service non bancaire
→ rémunération éventuelle de l’émission ou de la vérification
```

À ce stade, aucun document consulté n’établit qu’une banque française émet déjà une preuve compatible avec France Identité ou le blueprint européen. Il s’agit d’une possibilité prévue par l’architecture, pas d’un déploiement constaté.

Les questions sont néanmoins immédiates :

- la banque saura-t-elle où la preuve est utilisée ?
- la preuve restera-t-elle disponible après clôture du compte ?
- une erreur KYC se propagera-t-elle à plusieurs secteurs ?
- le service sera-t-il réservé à certaines offres ?
- qui paiera l’émission et le recours ?
- la banque pourra-t-elle suspendre l’attribut en même temps que le compte ?

Après le paiement, l’identité bancaire pourrait devenir une infrastructure d’autorisation générale.

## Le mauvais anniversaire

Le risque le plus concret n’est pas nécessairement une fuite massive. C’est une donnée erronée ou une décision fausse dans une chaîne où les responsabilités sont séparées.

La politique de confidentialité ÉduConnect indique que l’ANTS reçoit la date de naissance du fournisseur d’identité scolaire. Elle précise que les demandes de rectification relatives aux données sources doivent être adressées au ministère de l’Éducation nationale.

Les CGU ajoutent trois clauses :

- l’ANTS n’est pas responsable de l’exactitude des informations transmises par ÉduConnect ;
- le service vérificateur est seul responsable de sa décision d’accès ;
- l’ANTS n’est pas responsable du refus du vérificateur ni de ses conséquences.

La chaîne peut donc ressembler à ceci :

```text
Date de naissance erronée dans la source
→ preuve impossible ou incorrecte
→ accès refusé
→ ANTS renvoie vers ÉduConnect
→ le service final renvoie vers le fournisseur de preuve
→ délai de correction
```

Dans un réseau social, le dommage peut être la perte d’un compte. Dans un service économique, il peut devenir :

- un achat abandonné ;
- un pari ou un compte réglementé bloqué ;
- une souscription impossible ;
- une billetterie perdue ;
- un service payé devenu inaccessible ;
- un coût de support ou de vérification alternative.

Les CGU répartissent les rôles. Elles ne publient pas un recours unique, un délai de correction ou un mécanisme d’indemnisation.

La minimisation protège contre l’excès de données. Elle ne résout pas la fragmentation de la responsabilité.

## Qui sait quoi ?

<div class="instrument-plate" style="padding:1.1rem;--plate-accent:#5eead4">
<p class="mono-label" style="margin:0;color:#5eead4">OUTIL L0G // QUI SAIT QUOI ?</p>
<p style="margin:.65rem 0 1rem;color:#d6d9df">Ouvrez une méthode. Chaque fiche distingue la donnée utilisée, ce que voit le service final, le risque de corrélation, le modèle économique et le niveau de preuve disponible.</p>
<details style="border:1px solid #2b3038;border-radius:10px;background:#101319;margin:.75rem 0;padding:.85rem 1rem">
<summary style="cursor:pointer;color:#f5f6f8;font-weight:700">France Identité + ÉduConnect</summary>
<div style="margin-top:.85rem;color:#d6d9df">
<p style="margin:.55rem 0"><strong>Source :</strong> compte ÉduConnect d’un élève éligible du second degré public.</p>
<p style="margin:.55rem 0"><strong>Le vérificateur reçoit :</strong> uniquement l’information nécessaire au seuil, sans nom ni date complète selon la politique publiée.</p>
<p style="margin:.55rem 0"><strong>Corrélation :</strong> le format de preuve, la visibilité du service par l’émetteur et les champs des journaux ne sont pas publiquement détaillés.</p>
<p style="margin:.55rem 0"><strong>Coût :</strong> aucun tarif public retrouvé pour l’usager ou le service vérificateur.</p>
<p style="margin:.55rem 0"><strong>Niveau de preuve :</strong> minimisation établie, non-corrélation à tester.</p>
</div></details>
<details style="border:1px solid #2b3038;border-radius:10px;background:#101319;margin:.75rem 0;padding:.85rem 1rem">
<summary style="cursor:pointer;color:#f5f6f8;font-weight:700">Blueprint européen, attestation classique</summary>
<div style="margin-top:.85rem;color:#d6d9df">
<p style="margin:.55rem 0"><strong>Source :</strong> eID, document, base publique ou source privée fiable.</p>
<p style="margin:.55rem 0"><strong>Le vérificateur reçoit :</strong> un attribut booléen compatible avec le profil européen.</p>
<p style="margin:.55rem 0"><strong>Corrélation :</strong> attestations à usage unique émises par lots. La spécification reconnaît que les horodatages peuvent fournir des indices.</p>
<p style="margin:.55rem 0"><strong>Coût :</strong> dépend de l’émetteur, du portefeuille et du service de vérification.</p>
<p style="margin:.55rem 0"><strong>Niveau de preuve :</strong> architecture normative publiée, déploiement national encore à adapter et durcir.</p>
</div></details>
<details style="border:1px solid #2b3038;border-radius:10px;background:#101319;margin:.75rem 0;padding:.85rem 1rem">
<summary style="cursor:pointer;color:#f5f6f8;font-weight:700">Blueprint européen avec ZKP</summary>
<div style="margin-top:.85rem;color:#d6d9df">
<p style="margin:.55rem 0"><strong>Source :</strong> une attestation valide conservée comme témoin privé dans l’application.</p>
<p style="margin:.55rem 0"><strong>Le vérificateur reçoit :</strong> une preuve cryptographique du seuil, sans l’attestation sous-jacente.</p>
<p style="margin:.55rem 0"><strong>Corrélation :</strong> la méthode vise l’impossibilité de relier plusieurs présentations.</p>
<p style="margin:.55rem 0"><strong>Coût :</strong> calcul local possible, mais intégration, vérification, exploitation et support restent à financer.</p>
<p style="margin:.55rem 0"><strong>Niveau de preuve :</strong> versions Android et iOS publiées ; fonction encore qualifiée d’expérimentale et mécanisme non revu par les pairs dans l’annexe.</p>
</div></details>
<details style="border:1px solid #2b3038;border-radius:10px;background:#101319;margin:.75rem 0;padding:.85rem 1rem">
<summary style="cursor:pointer;color:#f5f6f8;font-weight:700">Estimation faciale</summary>
<div style="margin-top:.85rem;color:#d6d9df">
<p style="margin:.55rem 0"><strong>Source :</strong> selfie et algorithme d’estimation, avec mécanisme de détection du vivant selon le fournisseur.</p>
<p style="margin:.55rem 0"><strong>Le vérificateur reçoit :</strong> un verdict ou une estimation, selon le produit.</p>
<p style="margin:.55rem 0"><strong>Corrélation :</strong> dépend du traitement local, de la conservation des images et des identifiants de session.</p>
<p style="margin:.55rem 0"><strong>Coût :</strong> certains vendeurs affichent environ 0,10 dollar par analyse.</p>
<p style="margin:.55rem 0"><strong>Niveau de preuve :</strong> offres commerciales ; performance, biais et conformité doivent être audités en conditions réelles.</p>
</div></details>
<details style="border:1px solid #2b3038;border-radius:10px;background:#101319;margin:.75rem 0;padding:.85rem 1rem">
<summary style="cursor:pointer;color:#f5f6f8;font-weight:700">Pièce d’identité + selfie</summary>
<div style="margin-top:.85rem;color:#d6d9df">
<p style="margin:.55rem 0"><strong>Source :</strong> document officiel, contrôle de validité, visage et détection du vivant.</p>
<p style="margin:.55rem 0"><strong>Le vérificateur reçoit :</strong> cela dépend du montage. Le risque d’exposition est supérieur si le service collecte lui-même les pièces.</p>
<p style="margin:.55rem 0"><strong>Corrélation :</strong> forte si le prestataire conserve un dossier KYC ou un identifiant stable.</p>
<p style="margin:.55rem 0"><strong>Coût :</strong> généralement supérieur à une preuve limitée à l’âge, selon les tarifs publics des fournisseurs.</p>
<p style="margin:.55rem 0"><strong>Niveau de preuve :</strong> méthode courante, mais surdimensionnée lorsqu’un simple seuil suffit.</p>
</div></details>
<details style="border:1px solid #2b3038;border-radius:10px;background:#101319;margin:.75rem 0;padding:.85rem 1rem">
<summary style="cursor:pointer;color:#f5f6f8;font-weight:700">Banque comme source d’âge</summary>
<div style="margin-top:.85rem;color:#d6d9df">
<p style="margin:.55rem 0"><strong>Source :</strong> données KYC déjà détenues par la banque.</p>
<p style="margin:.55rem 0"><strong>Le vérificateur reçoit :</strong> potentiellement un seuil seulement, si le montage respecte le profil et le double anonymat.</p>
<p style="margin:.55rem 0"><strong>Corrélation :</strong> dépend de l’architecture. Le blueprint vise à empêcher l’émetteur de connaître le service final.</p>
<p style="margin:.55rem 0"><strong>Coût :</strong> modèle encore inconnu : service gratuit, avantage client, rémunération par preuve ou contrat B2B.</p>
<p style="margin:.55rem 0"><strong>Niveau de preuve :</strong> possibilité prévue par les spécifications ; aucun déploiement bancaire français établi ici.</p>
</div></details>
<p style="margin:1rem 0 0;color:#8b909b;font-size:.85rem">L’outil compare des architectures. Il ne certifie aucune solution et ne classe pas leur conformité juridique.</p>
</div>

## Les publics absents du parcours documenté

Les CGU françaises visent les élèves du second degré public. Elles ne décrivent pas le parcours :

- des élèves du privé ;
- des apprentis ;
- des jeunes non scolarisés ;
- des personnes récemment arrivées en France ;
- des utilisateurs sans compte ÉduConnect valide ;
- des personnes sans téléphone compatible ;
- des utilisateurs dont les données scolaires sont erronées.

Cela ne signifie pas qu’aucune alternative n’existera. Cela signifie qu’une preuve destinée à protéger les mineurs ne couvre pas encore, dans sa documentation publique, tous les mineurs concernés.

Un risque de fragmentation apparaît : les publics les mieux intégrés au système administratif obtiennent une preuve minimale et rapide ; les autres sont renvoyés vers un document, un selfie, une carte bancaire ou un contrôle manuel plus intrusif.

## Les réponses encore nécessaires

L’article établit l’existence de la fonction et ses garanties déclarées. Il ne peut pas encore répondre à plusieurs questions simples.

### À France Titres et à l’ANTS

- Quand le service a-t-il été effectivement ouvert ?
- Combien d’utilisateurs l’ont activé ?
- Combien de preuves ont été générées et présentées ?
- Quels services les acceptent aujourd’hui ?
- Quel format exact est utilisé ?
- La preuve française suit-elle le profil européen `eu.europa.ec.av.1` ?
- Utilise-t-elle le ZKP européen, une attestation mdoc classique ou un protocole propre ?
- Quels champs figurent dans les journaux conservés trois ans ?
- L’ANTS connaît-elle le service auprès duquel la preuve est présentée ?
- Quel est le taux d’échec, de suspension et de refus ?
- Quel recours et quel délai de correction sont proposés ?
- Quelle responsabilité s’applique après une perte financière ?

### À l’Éducation nationale

- Quelle base fait autorité pour la date de naissance ?
- Quel délai réel s’applique à une rectification ?
- Pourquoi le périmètre public du second degré a-t-il été retenu ?
- Quel parcours est prévu pour le privé, les apprentis et les jeunes non scolarisés ?
- L’établissement peut-il savoir qu’une preuve a été activée ou utilisée ?
- Que devient l’attestation lorsque l’élève perd son éligibilité ÉduConnect ?

### À la Commission européenne

- Quel audit indépendant a été réalisé sur le mécanisme ZKP ?
- Quel est le calendrier de revue scientifique et de standardisation ?
- Pourquoi la prise en charge par les vérificateurs reste-t-elle une recommandation et non une obligation ?
- Quand les listes de confiance seront-elles publiées ?
- Quels plafonds de responsabilité s’appliqueront aux émetteurs et aux vérificateurs ?
- Comment prévenir la concentration économique autour de quelques fournisseurs ?

### À l’Arcom et à la CNIL

- Quelles méthodes sont réellement déployées en France ?
- Quels taux de faux refus et de faux accès ont été mesurés ?
- Combien de recours ont été déposés ?
- Quels délais de résolution sont observés ?
- Les audits seront-ils publiés sous forme agrégée ?
- France Identité est-elle déjà acceptée par un service soumis au référentiel ?

## Sources principales

- France Identité : [CGU ÉduConnect](https://france-identite.gouv.fr/conditions-generales-utilisation/cgu-educonnect/), [politique de confidentialité](https://france-identite.gouv.fr/politique-de-confidentialite/confidentialite-educonnect/) et [historique App Store](https://apps.apple.com/fr/app/france-identit%C3%A9/id1590142959).
- Commission européenne : [présentation du dispositif](https://digital-strategy.ec.europa.eu/fr/policies/eu-age-verification), [FAQ sur les pays pilotes](https://digital-strategy.ec.europa.eu/fr/faqs/eu-age-verification-solution), [profil normatif](https://ageverification.dev/av-doc-technical-specification/docs/annexes/annex-A/annex-A-av-profile/), [architecture](https://ageverification.dev/av-doc-technical-specification/docs/architecture-and-technical-specifications/), [annexe ZKP](https://docs.ageverification.dev/av-doc-technical-specification/docs/annexes/annex-B/annex-B-zkp/) et [guide de durcissement](https://docs.ageverification.dev/av-app-android-wallet-ui/docs/production-hardening-guide-v3.8/).
- Droit français : [décision 2026-911 DC](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054743009) et [loi promulguée le 24 août 2026](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054743001).
- Régulation : [référentiel de l’Arcom](https://www.arcom.fr/sites/default/files/2024-10/Arcom-Referentiel-technique-sur-la-verification-de-age-pour-la-protection-des-mineurs-contre-la-pornographie-en-ligne.pdf), [premier bilan de l’Arcom](https://www.arcom.fr/en/press/fighting-exposure-persons-under-18-pornography-arcom-issues-formal-notice-two-new-porn-sites) et [avis de la CNIL](https://cnil.fr/fr/verification-de-lage-en-ligne-la-cnil-rend-son-avis-sur-le-referentiel-de-larcom).
- Les tarifs cités sont les déclarations publiques des quatre vendeurs liés dans la section économique, pas une mesure du marché ni un prix de France Identité.

## Méthodologie l0g

Cette enquête repose sur les documents publics disponibles au **28 août 2026** : CGU et politique de confidentialité France Identité ÉduConnect, historique officiel de l’application, pages et spécifications de la Commission européenne, code et documentation du blueprint, décision du Conseil constitutionnel, référentiel de l’Arcom, avis de la CNIL et tarifs publics de fournisseurs.

Les affirmations sont classées selon cinq niveaux :

```text
ÉTABLI
Texte officiel, spécification ou document public direct

DÉCLARÉ
Affirmation d’un acteur sur son propre service

DÉDUIT
Conséquence explicitement présentée comme analyse l0g

INCONNU
Information non publiée ou non retrouvée

À TESTER
Propriété qui exige un audit, une capture ou un essai réel
```

l0g n’a pas, à ce stade :

- activé la preuve avec le compte d’un élève éligible ;
- capturé les communications réseau de cette fonction ;
- obtenu le dictionnaire des journaux ;
- reçu les statistiques d’usage ou d’erreur ;
- vérifié le code de la version française ;
- établi qu’elle utilise le ZKP européen ;
- audité un fournisseur privé ;
- mené de phase contradictoire avec les institutions citées.

Les prix commerciaux sont cités comme exemples déclarés par les vendeurs. Ils ne sont pas utilisés pour estimer la taille du marché. Le graphique de coût est une multiplication arithmétique de scénarios hypothétiques.

Les faits établis, les limites et les scénarios sont distingués dans le texte et dans les graphiques.

## Quand l’âge devient une clé d’accès

La preuve d’âge minimale est un progrès réel.

Elle permet de remplacer un document complet par un attribut limité. Elle peut réduire les copies de pièces, éviter la transmission d’un visage et empêcher le site final de constituer une base d’identités. Le ZKP européen peut aller plus loin en rendant les présentations non corrélables.

Mais une donnée minimisée n’est pas une absence d’infrastructure.

Il faut toujours une source qui connaît la date de naissance, un émetteur autorisé, une application, une liste de confiance, un protocole, un vérificateur et une procédure de recours. La chaîne peut connaître une panne, une erreur, un coût, une trace persistante ou un refus.

Le basculement est économique autant que technique :

```text
Hier
Le commerçant demandait une pièce

Demain
Le service demande un booléen

Mais le booléen devient
une autorisation
un événement facturable
une décision automatisée
un point de recours
```

France Identité ne contient pas l’argent de l’utilisateur. Elle ne possède pas davantage le pouvoir général de lui interdire une transaction.

Elle peut en revanche devenir l’une des clés utilisées par des plateformes, des commerçants ou des services réglementés pour décider qu’une opération est accessible. Lorsque cette clé répond « non » à tort, la question la plus importante n’est plus seulement : **quelles données ont été révélées ?**

Elle devient :

> **Qui corrige la preuve, qui rouvre la porte, et qui paie la perte produite pendant qu’elle restait fermée ?**
