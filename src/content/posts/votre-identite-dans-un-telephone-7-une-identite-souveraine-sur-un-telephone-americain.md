---
title: "Votre identité dans un téléphone, 7/8 : une identité souveraine sur un téléphone américain"
seoTitle: "France Identité dépend-elle d’Apple et Google ? | l0g"
ogTitle: "Une identité souveraine sur un téléphone américain"
description: "Stores, NFC, clés matérielles et attestation : l’État contrôle France Identité, mais pas toutes les couches qui décident si elle fonctionne."
pubDate: 2026-08-28T21:00:00+02:00
updatedDate: 2026-08-28T21:00:00+02:00
ogImage: "/illustrations/news/france-identite-telephone-souverain-v1.jpg"
tags: ["France Identité", "Apple", "Google", "Android", "iOS", "EUDI", "DMA", "ANSSI", "App Store", "Google Play", "souveraineté numérique", "risque financier", "enquête"]
draft: false
quickTake:
  fact: "France Identité affiche trois prérequis grand public : une CNI électronique, Android 11 avec NFC ou iOS 16.6, et la majorité. Des usagers rapportent pourtant des refus sur des téléphones répondant apparemment à ces critères, avec un message évoquant des mécanismes de sécurité absents."
  importance: "Un appareil refusé peut fermer la voie France Identité vers FranceConnect+ et renvoyer vers des parcours plus lents, un certificat qualifié, un mandataire ou un déplacement. La compatibilité du téléphone devient alors un risque économique."
  uncertainty: "La documentation publique ne confirme pas le mécanisme d’attestation actuellement utilisé par France Identité, la détention des clés de signature des applications, l’existence d’un canal officiel hors stores ni la procédure de recours après un faux refus."
---

*La carte d’identité est émise par l’État. Les serveurs de France Identité sont annoncés comme hébergés dans le cloud du ministère de l’Intérieur. Les justificatifs portent un cachet électronique public. Pourtant, pour installer l’application, il faut aujourd’hui passer par Google Play ou l’App Store. Pour protéger les clés, le service utilise nécessairement les fonctions de sécurité du téléphone. Pour décider si une instance de l’application mérite confiance, il doit produire une preuve de légitimité.*

*La souveraineté ne disparaît pas à cet instant. Elle change de niveau. L’État reste responsable de l’identité, mais il ne fabrique ni l’iPhone, ni Android, ni les composants cryptographiques, ni les magasins qui distribuent son application. Une décision prise sous France Identité dépend donc de plusieurs couches dont certaines appartiennent à Apple, Google ou aux constructeurs de terminaux.*

*Cette dépendance peut être utile. Les téléphones compatibles apportent un environnement sécurisé, un système de mise à jour et des composants capables de protéger des clés. Le problème commence lorsque le citoyen ne sait pas pourquoi son appareil est refusé, que l’État ne publie pas la matrice de compatibilité et qu’une incompatibilité ferme l’accès rapide à une formation, une aide ou une signature d’entreprise.*

*Septième volet de l’enquête **Votre identité dans un téléphone**. Le premier suivait [les données et les traces de France Identité](/posts/votre-identite-dans-un-telephone-1-la-carte-d-identite-qui-devient-un-service/). Le deuxième mesurait [le prix pratique des alternatives](/posts/votre-identite-dans-un-telephone-2-facultative-mais-a-quel-prix/). Le troisième examinait [l’identité souveraine sous contrat](/posts/votre-identite-dans-un-telephone-3-l-identite-souveraine-sous-contrat/). Le quatrième suivait [la transformation de l’âge en autorisation](/posts/votre-identite-dans-un-telephone-4-votre-age-devient-une-autorisation/). Le cinquième testait [le jour où l’identité ne répond plus](/posts/votre-identite-dans-un-telephone-5-le-jour-ou-votre-identite-ne-repond-plus/). Le sixième suivait [la facture cachée derrière une preuve gratuite](/posts/votre-identite-dans-un-telephone-6-votre-identite-est-gratuite-la-preuve-peut-etre-facturee/).*

*English version: [A sovereign identity on an American phone](/en/analysis/your-identity-in-your-phone-7-a-sovereign-identity-on-an-american-phone/).*

## À retenir

- Le site officiel exige une CNI au format bancaire, la majorité et un téléphone fonctionnant au minimum sous Android 11 avec NFC ou sous iOS 16.6.
- Les deux canaux de téléchargement grand public présentés sont Google Play et l’App Store. L0g n’a pas identifié de canal officiel de production hors de ces magasins au 28 août 2026.
- Des témoignages publiés sur Services Publics+ signalent le message « absence de certains mécanismes de sécurité » sur des appareils sous Android 11, 13, 14 ou 15, parfois après une période de fonctionnement normal.
- Ces témoignages ne mesurent pas un taux d’échec. Ils montrent que les conditions publiques ne suffisent pas toujours à expliquer la décision technique.
- Le site de France Identité présente toujours son identité numérique certifiée comme la voie d’accès à FranceConnect+ pour Mon Compte Formation, MaPrimeRénov’ et l’INPI. Un téléphone refusé peut donc déclencher un délai, un déplacement, l’achat d’un certificat qualifié ou le recours à un mandataire.
- Le règlement européen impose aux grands contrôleurs d’accès une interopérabilité effective et gratuite avec les mêmes fonctions du système d’exploitation, du matériel et du logiciel que celles qu’ils utilisent eux-mêmes.
- Le même cadre exige que le code des composants applicatifs du portefeuille soit publié sous licence open source.
- Ces deux droits ne prouvent ni l’existence d’un canal de distribution indépendant, ni celle d’une racine d’attestation publique, ni la possibilité de corriger immédiatement un faux refus.
- Les rapports CSPN de 2023 ont évalué Android 1.2.4 et iOS 1.2.3, développées alors par Atos. Ils ont couvert la preuve de légitimité de l’application et la revue complète du code de ces versions précises.
- Deux décisions ANSSI du 21 mai 2025 ont ensuite qualifié Android et iOS 1.3.X à partir de 1.3.7 au niveau élémentaire, en s’appuyant notamment sur ces rapports. Leur validité s’arrêtait au 7 février 2026.
- La décision iOS désigne toutefois le rapport CSPN comme portant sur la version 1.2.4, alors que le rapport public ANSSI-CSPN-2023/21 indique 1.2.3. L0g traite ce point comme une incohérence documentaire, sans en déduire un effet sur la sécurité du produit.
- Le catalogue ANSSI consulté le 28 août 2026 ne publie pas de décision de renouvellement et la page dédiée classe France Identité parmi les moyens en cours de certification. Cette situation publique ne permet pas de présenter les versions diffusées après cette échéance comme couvertes par une décision encore valide.
- La documentation publique ne confirme pas si France Identité utilise actuellement Play Integrity, Android Key Attestation, App Attest ou une combinaison propre au SGIN.
- L’architecture technique européenne distingue l’intégrité de l’application et la sécurité des clés. Son implémentation de référence sait exploiter la chaîne d’attestation Android et un format fondé sur App Attest côté iOS, mais elle est publiée pour le test et le développement.
- L’App Store affiche « Données non collectées », selon une déclaration non vérifiée par Apple. Google Play affiche une collecte possible d’informations personnelles et d’identifiants d’appareil, ainsi qu’un partage possible d’informations personnelles. Les taxonomies diffèrent et ne permettent pas, seules, de conclure à une contradiction ou à une collecte abusive.
- La souveraineté utile se mesure par une capacité de sortie : distribuer, signer, mettre à jour, attester, expliquer un refus, corriger une erreur et maintenir un parcours alternatif.

## Votre carte d’identité se télécharge dans deux magasins privés

La [page officielle de France Identité](https://france-identite.gouv.fr/) présente aujourd’hui deux parcours de téléchargement : Google Play pour Android et l’App Store pour iOS.

Les conditions visibles sont simples :

```text
Nouvelle carte nationale d’identité
18 ans ou plus
Android 11 avec NFC
ou iOS 16.6 minimum
```

Cette simplicité est utile pour le public. Elle ne décrit pas toute la chaîne de confiance.

Le sujet couvre presque tout le marché mobile français. Le [baromètre 2026 de l’Arcep](https://www.arcep.fr/cartes-et-donnees/nos-publications-chiffrees/transition-ipv6/barometre-annuel-de-la-transition-vers-ipv6-en-france.html) utilise une répartition de 61 % d’Android et 39 % d’iOS, issue des données collectées début 2025 auprès des quatre principaux opérateurs. L’[Insee](https://www.insee.fr/fr/statistiques/8660210) estime que 84,2 % des personnes de 15 ans ou plus possédaient un smartphone en 2025, contre 48,5 % des 75 ans ou plus. Le portefeuille mobile touche donc une infrastructure de masse sans être universel.

Une application d’identité ne peut pas accepter n’importe quel environnement. Elle doit s’assurer que son code n’a pas été modifié, que les secrets sont protégés, que le téléphone n’est pas dans un état manifestement compromis et que les clés utilisées pour les attestations ne peuvent pas être copiées librement.

Le service doit donc prendre une décision supplémentaire :

> **Ce téléphone est-il suffisamment digne de confiance pour porter une identité de niveau élevé ?**

Cette décision peut dépendre de l’application, du backend SGIN, du système d’exploitation, du constructeur, de la configuration de démarrage, des correctifs de sécurité, d’une puce cryptographique et, selon le mécanisme retenu, d’un service d’Apple ou de Google.

<figure class="infographic" style="padding-bottom:1.5rem" tabindex="0" aria-label="Les cinq couches de confiance sous France Identité">
<svg viewBox="0 0 360 920" width="100%" role="img" aria-labelledby="trust-stack-fr-title trust-stack-fr-desc" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;height:auto;overflow:hidden;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;background:#0c0d10">
<title id="trust-stack-fr-title">LA CONFIANCE SOUS L’APPLICATION</title>
<desc id="trust-stack-fr-desc">France Identité repose sur des couches publiques et privées, depuis l’identité régalienne jusqu’au système, au magasin et au matériel du téléphone.</desc>
<rect x="1" y="1" width="358" height="918" rx="16" fill="#0c0d10" stroke="#2b3038"/>
<text x="18" y="38" fill="#f5f6f8" font-size="13.5" font-weight="700">LA CONFIANCE SOUS</text>
<text x="18" y="58" fill="#f5f6f8" font-size="13.5" font-weight="700">L’APPLICATION</text>
<text x="18" y="82" fill="#8b909b" font-size="8.4">Couches simplifiées, périmètres à ne pas confondre</text>
<rect x="22" y="108" width="316" height="108" rx="12" fill="#10211f" stroke="#5eead4"/>
<text x="38" y="136" fill="#5eead4" font-size="10.5" font-weight="700">1. ÉTAT ET SGIN</text>
<text x="38" y="162" fill="#f5f6f8" font-size="10">Identité, serveurs, règles et révocation</text>
<text x="38" y="184" fill="#aeb4bf" font-size="8.8">Contrôle public documenté</text>
<path d="M180 216 V242" stroke="#5eead4" stroke-width="2"/>
<path d="M174 234 L180 244 L186 234" fill="#5eead4"/>
<rect x="22" y="248" width="316" height="108" rx="12" fill="#101824" stroke="#7aa2f7"/>
<text x="38" y="276" fill="#7aa2f7" font-size="10.5" font-weight="700">2. APPLICATION FRANCE IDENTITÉ</text>
<text x="38" y="302" fill="#f5f6f8" font-size="10">Code, interface et preuve de légitimité</text>
<text x="38" y="324" fill="#aeb4bf" font-size="8.8">Versions précises évaluées par l’ANSSI</text>
<path d="M180 356 V382" stroke="#7aa2f7" stroke-width="2"/>
<path d="M174 374 L180 384 L186 374" fill="#7aa2f7"/>
<rect x="22" y="388" width="316" height="122" rx="12" fill="#1b1b14" stroke="#f5b13d"/>
<text x="38" y="416" fill="#f5b13d" font-size="10.5" font-weight="700">3. SYSTÈME ET DISTRIBUTION</text>
<text x="38" y="442" fill="#f5f6f8" font-size="10">Android ou iOS, Play Store ou App Store</text>
<text x="38" y="464" fill="#aeb4bf" font-size="8.8">Mise à jour, signature et politique du terminal</text>
<text x="38" y="486" fill="#6f7580" font-size="8.2">Canal officiel alternatif non identifié</text>
<path d="M180 510 V536" stroke="#f5b13d" stroke-width="2"/>
<path d="M174 528 L180 538 L186 528" fill="#f5b13d"/>
<rect x="22" y="542" width="316" height="136" rx="12" fill="#21151c" stroke="#ff4d87"/>
<text x="38" y="570" fill="#ff85ad" font-size="10.5" font-weight="700">4. MATÉRIEL ET ATTESTATION</text>
<text x="38" y="596" fill="#f5f6f8" font-size="10">Keystore, TEE, StrongBox ou Secure Enclave</text>
<text x="38" y="618" fill="#aeb4bf" font-size="8.8">Le mécanisme français actuel reste à publier</text>
<text x="38" y="640" fill="#6f7580" font-size="8.2">Les références EUDI savent utiliser des racines</text>
<text x="38" y="657" fill="#6f7580" font-size="8.2">Android et un format fondé sur App Attest</text>
<path d="M180 678 V704" stroke="#ff4d87" stroke-width="2"/>
<path d="M174 696 L180 706 L186 696" fill="#ff4d87"/>
<rect x="22" y="710" width="316" height="120" rx="12" fill="#15171b" stroke="#4a505a" stroke-dasharray="5 4"/>
<text x="38" y="738" fill="#f5f6f8" font-size="10.5" font-weight="700">5. DÉCISION POUR L’USAGER</text>
<text x="38" y="764" fill="#f5f6f8" font-size="10">Téléphone accepté ou refusé</text>
<text x="38" y="786" fill="#aeb4bf" font-size="8.8">Motif détaillé, recours et coût : non publiés</text>
<text x="38" y="808" fill="#6f7580" font-size="8.2">Le citoyen supporte immédiatement le résultat</text>
<text x="18" y="866" fill="#6f7580" font-size="7.7">Sources : France Titres, ANSSI, règlement eIDAS,</text>
<text x="18" y="883" fill="#6f7580" font-size="7.7">spécifications EUDI. Consultation : 28 août 2026.</text>
</svg>
<figcaption>L’identité reste régalienne, mais l’accès pratique dépend d’une pile technique dont toutes les couches ne sont pas contrôlées par l’État.</figcaption>
</figure>

## Android 11 et le NFC laissent une part de compatibilité inexpliquée

La plateforme gouvernementale [Services Publics+](https://www.plus.transformation.gouv.fr/) contient plusieurs témoignages d’utilisateurs dont le téléphone semble répondre aux critères affichés mais reçoit le message suivant : l’absence de certains mécanismes de sécurité empêche l’utilisation de France Identité.

Les récits publics concernent notamment :

- [un appareil sous Android 13](https://www.plus.transformation.gouv.fr/experiences/4917636_lapplication-france-identite-ne-fonctionne-pas) ;
- [un téléphone sous Android 15](https://www.plus.transformation.gouv.fr/experiences/6434356_visiblement-france-identite-est-inutile) ;
- [un modèle Android 11 avec NFC](https://www.plus.transformation.gouv.fr/experiences/6188801_doogee-v10-pas-compatible) ;
- [des appareils ayant fonctionné avant de devenir incompatibles](https://www.plus.transformation.gouv.fr/experiences/7390785_franceidentite-inoperant-du-jour-au-lendemain).

Ces témoignages ne constituent pas un échantillon statistique. Les utilisateurs confrontés à un problème publient davantage que les utilisateurs satisfaits. Le bouton indiquant qu’une expérience est similaire ne permet pas de calculer un taux d’échec. Certaines incompatibilités peuvent être parfaitement justifiées par la sécurité du terminal.

Ils établissent néanmoins deux faits utiles à l’enquête.

### Les critères publics sont incomplets

Une version d’Android et la présence du NFC ne suffisent pas à expliquer pourquoi un appareil est accepté ou refusé.

### Le motif est peu actionnable

Le message ne précise pas publiquement si la cause tient :

```text
À la puce cryptographique
Au démarrage vérifié
À la certification du constructeur
Aux correctifs de sécurité
À Google Play Services
À la signature de l’application
À une configuration NFC
À un bootloader déverrouillé
À un faux positif
```

La différence est importante. Un utilisateur peut réactiver une fonction NFC, installer une mise à jour ou reverrouiller un appareil. Il ne peut pas ajouter une puce absente, réparer une chaîne d’attestation rejetée ou convaincre seul un constructeur de corriger son firmware.

L0g n’a pas retrouvé, dans la documentation publique de France Identité consultée au 28 août 2026, de matrice listant les mécanismes requis, les modèles compatibles, les causes de refus ou les codes d’erreur correspondants.

## Le téléphone refusé peut ralentir une opération économique

La [version certifiée de France Identité](https://france-identite.gouv.fr/identite-numerique-certifiee/) permet aujourd’hui d’accéder par FranceConnect+ à Mon Compte Formation, MaPrimeRénov’ et l’INPI.

Le refus du téléphone ne détruit pas le droit. Les alternatives existent. Leur coût pratique diffère.

| Démarche | Alternative publiée | Friction documentée |
|---|---|---|
| Mon Compte Formation | [Contrôle manuel d’identité](https://www.moncompteformation.gouv.fr/espace-public/je-ne-remplis-pas-les-conditions-pour-utiliser-franceconnect) | Environ quatre semaines, procédure papier potentiellement plus longue |
| France Rénov’ | [Création par courriel et vérification postale](https://france-renov.gouv.fr/foire-aux-questions/compte) | Courrier annoncé sous 12 jours |
| INPI | [Signature avancée fondée sur un certificat qualifié](https://www.inpi.fr/faq/890) | Prestataire externe, procédure plus technique ; mandataire possible |
| Procuration de vote | [Vérification en personne](https://www.service-public.gouv.fr/particuliers/actualites/A18658) | Déplacement auprès d’une autorité habilitée |

Ces durées ne sont ni des délais garantis, ni des mesures réalisées par l0g. Elles proviennent des parcours officiels, également étudiés dans [le deuxième volet](/posts/votre-identite-dans-un-telephone-2-facultative-mais-a-quel-prix/).

Le coût financier peut donc prendre plusieurs formes :

```text
Remplacer prématurément un téléphone
Acheter un certificat qualifié
Payer un mandataire
Se déplacer
Attendre un courrier
Manquer une date ou une session
Mobiliser un salarié ou un conseiller
```

Aucun élément ne permet d’attribuer automatiquement ces coûts à Apple, Google ou France Titres. Le service final, la procédure alternative et la situation de l’utilisateur déterminent la perte réelle.

La question de responsabilité reste pourtant entière :

> **Lorsqu’un téléphone conforme aux critères publiés est refusé à tort, qui prend en charge le coût de la solution de remplacement ?**

<figure class="infographic" style="padding-bottom:1.5rem" tabindex="0" aria-label="Propagation économique du refus d’un téléphone">
<svg viewBox="0 0 360 1000" width="100%" role="img" aria-labelledby="refusal-cost-fr-title refusal-cost-fr-desc" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;height:auto;overflow:hidden;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;background:#0c0d10">
<title id="refusal-cost-fr-title">LE COÛT D’UN TÉLÉPHONE REFUSÉ</title>
<desc id="refusal-cost-fr-desc">Un téléphone refusé peut rendre France Identité puis FranceConnect+ indisponibles et renvoyer vers des parcours alternatifs plus lents ou payants.</desc>
<rect x="1" y="1" width="358" height="998" rx="16" fill="#0c0d10" stroke="#2b3038"/>
<text x="18" y="38" fill="#f5f6f8" font-size="13.5" font-weight="700">LE COÛT D’UN</text>
<text x="18" y="58" fill="#f5f6f8" font-size="13.5" font-weight="700">TÉLÉPHONE REFUSÉ</text>
<text x="18" y="82" fill="#8b909b" font-size="8.4">Propagation possible, pas dommage automatique</text>
<rect x="22" y="106" width="316" height="108" rx="12" fill="#1b1b14" stroke="#f5b13d"/>
<text x="38" y="134" fill="#f5b13d" font-size="10.5" font-weight="700">TÉLÉPHONE</text>
<text x="38" y="160" fill="#f5f6f8" font-size="10">Android 11 ou plus, NFC présent</text>
<text x="38" y="182" fill="#aeb4bf" font-size="8.8">Mais mécanisme de sécurité jugé absent</text>
<path d="M180 214 V240" stroke="#f5b13d" stroke-width="2"/>
<path d="M174 232 L180 242 L186 232" fill="#f5b13d"/>
<rect x="22" y="246" width="316" height="98" rx="12" fill="#21151c" stroke="#ff4d87"/>
<text x="38" y="274" fill="#ff85ad" font-size="10.5" font-weight="700">FRANCE IDENTITÉ INDISPONIBLE</text>
<text x="38" y="300" fill="#f5f6f8" font-size="10">Motif détaillé et recours technique inconnus</text>
<text x="38" y="322" fill="#aeb4bf" font-size="8.8">Identité physique toujours valide</text>
<path d="M180 344 V370" stroke="#ff4d87" stroke-width="2"/>
<path d="M174 362 L180 372 L186 362" fill="#ff4d87"/>
<rect x="22" y="376" width="316" height="98" rx="12" fill="#101824" stroke="#7aa2f7"/>
<text x="38" y="404" fill="#7aa2f7" font-size="10.5" font-weight="700">FRANCECONNECT+ INDISPONIBLE</text>
<text x="38" y="430" fill="#f5f6f8" font-size="10">Le service final propose un autre chemin</text>
<text x="38" y="452" fill="#aeb4bf" font-size="8.8">ou l’opération attend le rétablissement</text>
<path d="M180 474 V500" stroke="#7aa2f7" stroke-width="2"/>
<path d="M174 492 L180 502 L186 492" fill="#7aa2f7"/>
<rect x="16" y="510" width="328" height="286" rx="14" fill="#101319" stroke="#3a4049"/>
<text x="32" y="540" fill="#f5f6f8" font-size="10.5" font-weight="700">ALTERNATIVES PUBLIÉES</text>
<rect x="32" y="560" width="296" height="48" rx="8" fill="#15171b" stroke="#4a505a"/>
<text x="44" y="581" fill="#5eead4" font-size="9" font-weight="700">CPF</text>
<text x="92" y="581" fill="#f5f6f8" font-size="8.8">contrôle manuel, environ 4 semaines</text>
<text x="92" y="598" fill="#8b909b" font-size="7.8">délai officiel annoncé</text>
<rect x="32" y="620" width="296" height="48" rx="8" fill="#15171b" stroke="#4a505a"/>
<text x="44" y="641" fill="#7aa2f7" font-size="9" font-weight="700">RÉNOV’</text>
<text x="92" y="641" fill="#f5f6f8" font-size="8.8">vérification postale, environ 2 semaines</text>
<text x="92" y="658" fill="#8b909b" font-size="7.8">délai officiel annoncé</text>
<rect x="32" y="680" width="296" height="48" rx="8" fill="#15171b" stroke="#4a505a"/>
<text x="44" y="701" fill="#f5b13d" font-size="9" font-weight="700">INPI</text>
<text x="92" y="701" fill="#f5f6f8" font-size="8.8">certificat qualifié ou mandataire</text>
<text x="92" y="718" fill="#8b909b" font-size="7.8">coût variable et procédure externe</text>
<rect x="32" y="740" width="296" height="40" rx="8" fill="#15171b" stroke="#4a505a"/>
<text x="44" y="765" fill="#ff85ad" font-size="9" font-weight="700">VOTE</text>
<text x="92" y="765" fill="#f5f6f8" font-size="8.8">contrôle en personne et déplacement</text>
<path d="M180 796 V822" stroke="#aeb4bf" stroke-width="2"/>
<path d="M174 814 L180 824 L186 814" fill="#aeb4bf"/>
<rect x="22" y="830" width="316" height="106" rx="12" fill="#10211f" stroke="#5eead4"/>
<text x="38" y="858" fill="#5eead4" font-size="10.5" font-weight="700">COÛT RÉEL À MESURER</text>
<text x="38" y="884" fill="#f5f6f8" font-size="9.4">Temps, transport, certificat, mandataire</text>
<text x="38" y="905" fill="#aeb4bf" font-size="8.4">et échéance éventuellement perdue</text>
<text x="18" y="970" fill="#6f7580" font-size="7.5">Sources : parcours officiels CPF, France Rénov’, INPI,</text>
<text x="18" y="986" fill="#6f7580" font-size="7.5">Service-Public ; France Identité. Consultation : 28 août 2026.</text>
</svg>
<figcaption>Le risque économique ne vient pas de l’identité physique. Il apparaît lorsque l’appareil refusé devient la clé du parcours rapide.</figcaption>
</figure>

## Le droit européen reconnaît lui-même la dépendance

Le [règlement européen 2024/1183](https://eur-lex.europa.eu/eli/reg/2024/1183/oj) contient une disposition rarement mise en avant dans la communication destinée au public.

Son article 12 ter impose aux contrôleurs d’accès concernés de permettre aux fournisseurs de portefeuilles une interopérabilité effective et un accès gratuit aux mêmes fonctions du système d’exploitation, du matériel ou du logiciel que celles qu’ils utilisent pour leurs propres services.

Le texte reconnaît ainsi qu’un portefeuille public peut avoir besoin de fonctions contrôlées par un acteur de plateforme :

```text
NFC
Composant sécurisé
Biométrie
Stockage des clés
Interfaces du système
Distribution et installation
```

Ce droit est important. Il limite la capacité d’un gatekeeper à réserver une fonction critique à son propre portefeuille.

Il ne suffit pas à prouver que toutes les dépendances sont réglées.

L’accès à une interface ne répond pas automatiquement aux questions suivantes :

- qui contrôle la racine cryptographique ;
- quel service atteste le terminal ;
- quel délai s’applique en cas de panne ;
- comment contester un verdict d’intégrité ;
- comment distribuer un correctif sans magasin ;
- comment garantir la compatibilité d’un téléphone ancien ;
- qui paie après un faux refus.

Le droit européen crée une obligation d’ouverture. L’enquête doit encore mesurer son application technique et opérationnelle.

## Au-delà du code ouvert, la racine de confiance

Le même règlement impose que le code source des composants applicatifs installés sur le téléphone soit publié sous licence open source. Des exceptions restent possibles pour certains composants non installés sur l’appareil, lorsqu’elles sont dûment justifiées.

France Titres annonce toujours que le code de l’application mobile sera publié « prochainement » sur sa [page consacrée à la sécurité](https://france-identite.gouv.fr/securite-application/).

L’ouverture permettra notamment d’examiner :

```text
Les permissions demandées
Les flux réseau
Les SDK embarqués
La gestion locale des titres
Les contrôles de l’environnement
Les dépendances externes
La logique des messages d’erreur
```

Elle ne donnera pas automatiquement le contrôle des couches situées sous le code.

Une clé cryptographique peut être générée dans :

- le Keystore Android ;
- un environnement d’exécution de confiance ;
- StrongBox lorsqu’il existe ;
- le Secure Enclave d’un iPhone.

Le serveur qui délivre une identité doit ensuite vérifier que la clé est réellement protégée dans l’environnement annoncé. C’est le rôle d’une [attestation](/glossaire/#attestation).

La [spécification européenne des Wallet Unit Attestations](https://github.com/eu-digital-identity-wallet/eudi-doc-standards-and-technical-specifications/blob/main/docs/technical-specifications/ts3-wallet-unit-attestation.md) distingue deux objets :

- une attestation de l’instance du portefeuille, qui garantit l’intégrité de l’application ;
- une attestation de clé, qui décrit la protection cryptographique disponible.

L’[implémentation de référence du fournisseur de wallet](https://github.com/eu-digital-identity-wallet/eudi-srv-wallet-provider) sait recevoir une chaîne issue du Keystore Android et un format iOS fondé sur App Attest. Son propre avertissement précise qu’elle est destinée au test et au développement, et qu’elle ne valide par défaut aucune attestation de plateforme.

Cette documentation ne décrit pas automatiquement France Identité en production.

Elle montre le problème de fond :

```text
Code du portefeuille
peut être public et auditable

Clé du portefeuille
peut être protégée par le téléphone

Preuve de cette protection
peut remonter à une racine Google ou à un service Apple
```

<figure class="infographic" style="padding-bottom:1.5rem" tabindex="0" aria-label="Deux droits européens et leurs limites pratiques">
<svg viewBox="0 0 360 850" width="100%" role="img" aria-labelledby="rights-limits-fr-title rights-limits-fr-desc" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;height:auto;overflow:hidden;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;background:#0c0d10">
<title id="rights-limits-fr-title">DEUX DROITS, TROIS LIMITES</title>
<desc id="rights-limits-fr-desc">Le droit européen impose le code ouvert et l’accès aux fonctions des plateformes, sans démontrer à lui seul l’indépendance du canal, de l’attestation ou du recours.</desc>
<rect x="1" y="1" width="358" height="848" rx="16" fill="#0c0d10" stroke="#2b3038"/>
<text x="18" y="38" fill="#f5f6f8" font-size="13.5" font-weight="700">DEUX DROITS</text>
<text x="18" y="58" fill="#f5f6f8" font-size="13.5" font-weight="700">TROIS LIMITES</text>
<text x="18" y="82" fill="#8b909b" font-size="8.4">Le texte ouvre des portes, il ne prouve pas la sortie</text>
<rect x="22" y="110" width="316" height="126" rx="12" fill="#10211f" stroke="#5eead4"/>
<text x="38" y="138" fill="#5eead4" font-size="10.5" font-weight="700">DROIT 1 : CODE OUVERT</text>
<text x="38" y="164" fill="#f5f6f8" font-size="9.6">Les composants applicatifs du wallet</text>
<text x="38" y="185" fill="#f5f6f8" font-size="9.6">doivent être sous licence open source.</text>
<text x="38" y="211" fill="#aeb4bf" font-size="8.4">Article 5 bis, paragraphe 3</text>
<rect x="22" y="256" width="316" height="142" rx="12" fill="#101824" stroke="#7aa2f7"/>
<text x="38" y="284" fill="#7aa2f7" font-size="10.5" font-weight="700">DROIT 2 : ACCÈS AUX FONCTIONS</text>
<text x="38" y="310" fill="#f5f6f8" font-size="9.6">Même système, matériel et logiciel</text>
<text x="38" y="331" fill="#f5f6f8" font-size="9.6">que les services du gatekeeper.</text>
<text x="38" y="357" fill="#aeb4bf" font-size="8.4">Interopérabilité effective et gratuite</text>
<text x="38" y="377" fill="#aeb4bf" font-size="8.4">Article 12 ter</text>
<text x="22" y="438" fill="#f5f6f8" font-size="10.5" font-weight="700">CES DROITS NE PROUVENT PAS ENCORE :</text>
<rect x="22" y="462" width="316" height="76" rx="10" fill="#1b1b14" stroke="#f5b13d"/>
<text x="38" y="488" fill="#f5b13d" font-size="9.8" font-weight="700">1. UN CANAL INDÉPENDANT</text>
<text x="38" y="513" fill="#aeb4bf" font-size="8.6">Publier et mettre à jour sans store ni notarisation</text>
<rect x="22" y="554" width="316" height="92" rx="10" fill="#21151c" stroke="#ff4d87"/>
<text x="38" y="580" fill="#ff85ad" font-size="9.8" font-weight="700">2. UNE RACINE PUBLIQUE</text>
<text x="38" y="605" fill="#aeb4bf" font-size="8.6">Attester le matériel sans dépendre d’une racine</text>
<text x="38" y="624" fill="#aeb4bf" font-size="8.6">ou d’un service de plateforme</text>
<rect x="22" y="662" width="316" height="92" rx="10" fill="#15171b" stroke="#4a505a"/>
<text x="38" y="688" fill="#f5f6f8" font-size="9.8" font-weight="700">3. UN RECOURS IMMÉDIAT</text>
<text x="38" y="713" fill="#aeb4bf" font-size="8.6">Expliquer et corriger un faux refus avant</text>
<text x="38" y="732" fill="#aeb4bf" font-size="8.6">la perte d’une échéance</text>
<text x="18" y="806" fill="#6f7580" font-size="7.7">Source : règlement (UE) 2024/1183, art. 5 bis et 12 ter.</text>
<text x="18" y="823" fill="#6f7580" font-size="7.7">Lecture l0g : droits juridiques contre capacités observables.</text>
</svg>
<figcaption>L’open source et l’interopérabilité sont des garanties fortes. La souveraineté opérationnelle exige aussi une distribution, une attestation et un recours maîtrisés.</figcaption>
</figure>

## Les évaluations ANSSI dessinent un périmètre précis

Les [rapports CSPN Android](https://messervices.cyber.gouv.fr/visas/ANSSI-CSPN-2023-22-rapport.pdf) et [iOS](https://messervices.cyber.gouv.fr/visas/ANSSI-CSPN-2023-21-rapport.pdf) sont des sources particulièrement utiles parce qu’ils donnent un périmètre exact.

Ils portent sur :

```text
Android 1.2.4
et iOS 1.2.3

Développeur : Atos France
Commanditaire : ministère de l’Intérieur
Centre d’évaluation : AMOSSYS
```

Les fonctions évaluées comprennent :

- la gestion sécurisée du code personnel ;
- la communication avec le backend ;
- la communication avec la CNI ;
- la génération d’une preuve de légitimité de l’application ;
- la protection des données d’identité ;
- l’autorisation de l’application par le backend.

L’évaluateur a relu l’intégralité du code source des produits concernés. Il a testé la version Android sur un Pixel 6a sous Android 13 et un Pixel 4a rooté sous Android 10. La version iOS a été testée sur un iPhone 11 et un iPhone X jailbreaké sous iOS 16.

Ces rapports sont rassurants pour les versions évaluées. Ils ne suffisent toutefois pas à décrire seuls le statut des versions diffusées en 2026.

Les décisions de qualification [Android n° 791](https://messervices.cyber.gouv.fr/visas/2025_791_np.pdf) et [iOS n° 792](https://messervices.cyber.gouv.fr/visas/2025_792_np.pdf), prises le 21 mai 2025, ont étendu le périmètre à la version 1.3.X à partir de 1.3.7. Elles s’appuyaient sur les CSPN de 2023 et deux évaluations AMOSSYS du backend et du produit. Leur niveau était « élémentaire » et leur validité allait jusqu’au 7 février 2026. La certification distincte du moyen d’identification électronique au niveau « élevé » affichait la même date de fin. La décision iOS qualifie le rapport ANSSI-CSPN-2023/21 de rapport sur la version 1.2.4, tandis que ce rapport public identifie la version 1.2.3. Cette divergence est signalée comme une incohérence du corpus officiel, sans extrapolation.

Au 28 août 2026, le [catalogue ANSSI](https://cyber.gouv.fr/offre-de-service/solutions-certifiees-et-qualifiees/services-de-securite-evalue/decouvrir-les-solutions-certifiees-qualifiees/) ne publiait pas de décision plus récente pour France Identité. La [page des moyens d’identification électronique](https://cyber.gouv.fr/offre-de-service/solutions-certifiees-et-qualifiees/services-de-securite-evalue/solutions-en-cours-de-qualification/moyens-didentification-electronique-mie/) plaçait le service parmi les certifications en cours, tandis que la page France Identité continuait de revendiquer le niveau de sécurité le plus élevé. L0g ne déduit pas de ce décalage que le service serait juridiquement invalide. Il constate qu’aucune décision publique renouvelée n’a été trouvée à la date de collecte.

Six limites restent donc visibles :

1. les CSPN portent sur des versions 1.2 précises ;
2. les décisions de 2025 ont bien couvert les versions 1.3.X à partir de 1.3.7, contrairement à ce que laisserait croire la seule lecture des rapports de 2023 ;
3. la décision iOS et son rapport de référence ne donnent pas le même numéro de version 1.2 ;
4. ces décisions affichaient une fin de validité au 7 février 2026 ;
5. les rapports de 2023 n’établissent pas qui développe et maintient les versions de production diffusées en août 2026 ;
6. les versions évaluées avaient été installées par invitation Firebase, sous forme d’APK ou d’IPA, pas depuis les magasins publics.

Les évaluations établissent donc qu’une preuve de légitimité existait et a été examinée. Elles ne révèlent pas le mécanisme actuel ni toute la chaîne de distribution de production.

## Deux canaux, une dépendance de plateforme

### Android : une distribution extérieure est techniquement possible

Android permet de signer et distribuer une application sous forme d’APK hors de Google Play. La [documentation Android](https://developer.android.com/guide/app-bundle/faq) précise aussi que le format App Bundle est ouvert et peut être pris en charge par d’autres magasins.

Le site de France Identité ne propose cependant pas d’APK public ni de magasin alternatif. Aucun canal officiel de production hors Google Play n’a été identifié pendant la collecte.

Une autre question reste ouverte : **qui détient la clé de signature de l’application Android ?**

Google propose [Play App Signing](https://developer.android.com/studio/publish/app-signing), qui protège et gère la clé de signature utilisée pour les APK distribués par Play. Un développeur souhaitant employer la même clé sur plusieurs magasins peut fournir sa propre clé. La configuration exacte de France Identité n’est pas publiée.

Il faut donc distinguer :

```text
Possibilité technique d’installer un APK
Capacité juridique de le distribuer
Détention de la clé de signature
Acceptation du binaire par le backend
Fonctionnement sans Google Play Services
```

Un APK officiel ne serait une véritable solution de secours que si les cinq conditions étaient maîtrisées.

### iOS : l’alternative reste notarée par Apple

Dans l’Union européenne, Apple permet la [distribution par une place de marché alternative ou directement depuis un site web](https://developer.apple.com/support/web-distribution-eu/), sous conditions.

Cette distribution continue néanmoins de passer par :

- le programme développeur Apple ;
- App Store Connect ;
- la génération d’un paquet de distribution ;
- la notarisation Apple ;
- les mécanismes d’installation d’iOS.

Apple précise que les applications distribuées hors App Store doivent respecter les [exigences de notarisation](https://developer.apple.com/help/app-store-connect/managing-alternative-distribution/submit-for-notarization/). Une application identifiée comme contenant un logiciel malveillant peut être empêchée de fonctionner.

Cette sécurité protège les utilisateurs. Elle confirme aussi que quitter l’App Store ne suffit pas à rendre une application iOS indépendante d’Apple.

## L’attestation protège le portefeuille et crée un pouvoir de refus

Google décrit plusieurs mécanismes qu’un développeur peut utiliser. L’un d’eux, Play Integrity, traite notamment :

- les paramètres de la requête ;
- le nom, la version et le certificat de signature de l’application ;
- le statut de licence Google Play ;
- un certificat d’attestation de clé ;
- un jeton d’attestation de l’appareil ;
- éventuellement, des informations sur l’environnement de sécurité.

Google indique que ces données sont chiffrées, ne sont pas transmises à des tiers et sont supprimées après une durée fixe. ([documentation Play Integrity](https://developer.android.com/google/play/integrity/terms))

Nous ne savons pas si France Identité utilise ce service.

L’attestation matérielle Android peut aussi produire une chaîne de certificats décrivant une clé stockée dans un environnement sécurisé. La documentation Android indique que cette chaîne peut remonter à une racine détenue par Google. ([documentation Android Keystore](https://developer.android.com/identity/digital-credentials/credential-issuer/keystore-attestation))

Côté Apple, App Attest permet à un serveur de vérifier qu’une clé est associée à une instance légitime de l’application. Apple indique que la clé privée est stockée dans le Secure Enclave et qu’aucun processus ne peut la lire ou la modifier directement. L’attestation initiale contacte un serveur Apple. Après une réinstallation, une migration ou une restauration, une nouvelle clé doit être créée. ([documentation Apple App Attest](https://developer.apple.com/documentation/DeviceCheck/establishing-your-app-s-integrity))

Nous ne savons pas davantage si France Identité utilise App Attest.

Ces mécanismes ont un objectif légitime : empêcher une fausse application ou un appareil compromis de recevoir des titres sensibles.

Ils créent aussi une décision binaire :

```text
Attestation reconnue
→ le backend peut continuer

Attestation absente ou refusée
→ l’identité peut devenir inutilisable
```

Le point critique n’est pas l’existence de ce contrôle. Il est l’absence de procédure publique décrivant :

- le motif exact transmis à l’utilisateur ;
- l’acteur capable de corriger le verdict ;
- le délai de résolution ;
- le mode dégradé ;
- la prise en charge du dommage.

## Deux magasins, deux déclarations de confidentialité

La [fiche française de l’App Store](https://apps.apple.com/fr/app/france-identit%C3%A9/id1590142959) indique « Données non collectées ». Apple précise que cette information est déclarée par le développeur et n’a pas été vérifiée par la plateforme.

La [fiche Google Play](https://play.google.com/store/apps/details?id=fr.gouv.franceidentite&hl=fr) indique que l’application peut :

- recueillir des informations personnelles ;
- recueillir des identifiants d’appareil ou d’autres identifiants ;
- partager des informations personnelles avec des tiers ;
- chiffrer les données pendant leur transfert ;
- permettre une demande de suppression.

Ces deux fiches ne sont pas directement comparables.

Apple et Google utilisent des définitions, des catégories et des questionnaires différents. Les versions iOS et Android peuvent elles-mêmes avoir des dépendances différentes. Un partage avec un service public nécessaire à la fonction peut également être classé différemment d’une collecte publicitaire.

La [politique de confidentialité de France Identité](https://france-identite.gouv.fr/politique-de-confidentialite/confidentialite-fi/) confirme que le serveur SGIN traite des données du titre, des coordonnées et un identifiant de l’équipement mobile. Elle affirme également que l’application ne traite pas les données à des fins commerciales ou publicitaires.

Le sujet n’est donc pas d’accuser l’un des magasins de mensonge à partir d’un tableau.

Il faut obtenir une matrice commune :

```text
Donnée
Application iOS
Application Android
SGIN
Apple
Google
Constructeur
Finalité
Durée
Destinataire
```

Cette matrice expliquerait au citoyen pourquoi deux vitrines officielles présentent la même identité avec des libellés aussi différents.

## Outil : votre téléphone ouvre-t-il vos droits ?

Les fiches ci-dessous constituent un diagnostic documentaire, pas un test matériel. Elles distinguent les critères publics, les signaux observés et les informations encore inconnues.

<div class="device-tool" aria-label="Diagnostic documentaire de compatibilité de France Identité">
<details style="margin:1rem 0;border:1px solid #2b3038;border-radius:12px;padding:.9rem 1rem;background:#101319">
<summary style="cursor:pointer;font-weight:700">Android 11 ou plus, NFC, application fonctionnelle</summary>
<div style="padding-top:.75rem">
<p><strong>Statut :</strong> critères publics satisfaits et fonctionnement observé sur l’appareil.</p>
<p><strong>Risque résiduel :</strong> une mise à jour du système, du constructeur, de l’application ou de la politique d’intégrité peut modifier le résultat.</p>
<p><strong>À conserver :</strong> CNI physique, autre fournisseur FranceConnect+ lorsqu’il est disponible, et procédure alternative du service utilisé.</p>
</div>
</details>

<details style="margin:1rem 0;border:1px solid #2b3038;border-radius:12px;padding:.9rem 1rem;background:#101319">
<summary style="cursor:pointer;font-weight:700">Android 11 ou plus et NFC, mais « mécanismes de sécurité absents »</summary>
<div style="padding-top:.75rem">
<p><strong>Statut :</strong> signal public documenté, pas taux d’échec mesuré.</p>
<p><strong>Vérifications sans contournement :</strong> correctifs du système, certification Play Protect, NFC, redémarrage, éventuel bootloader déverrouillé, modèle exact et message complet.</p>
<p><strong>Information manquante :</strong> code d’erreur technique et composant réellement refusé.</p>
<p><strong>Exposition économique :</strong> parcours manuel du CPF, courrier France Rénov’, certificat ou mandataire pour l’INPI selon la démarche.</p>
</div>
</details>

<details style="margin:1rem 0;border:1px solid #2b3038;border-radius:12px;padding:.9rem 1rem;background:#101319">
<summary style="cursor:pointer;font-weight:700">Android sans services Google, ROM alternative ou bootloader déverrouillé</summary>
<div style="padding-top:.75rem">
<p><strong>Statut :</strong> compatibilité France Identité non publiée de manière générale.</p>
<p><strong>Point de sécurité :</strong> un bootloader déverrouillé ou une chaîne d’attestation inconnue peut légitimement réduire le niveau de confiance.</p>
<p><strong>Question de souveraineté :</strong> un système Android sécurisé mais non reconnu par Google peut-il atteindre le niveau élevé par une autre racine ?</p>
<p><strong>À tester :</strong> installation, premier lancement, lecture NFC et reconnaissance par le backend sur un terminal de laboratoire, sans contourner les contrôles.</p>
</div>
</details>

<details style="margin:1rem 0;border:1px solid #2b3038;border-radius:12px;padding:.9rem 1rem;background:#101319">
<summary style="cursor:pointer;font-weight:700">iPhone sous iOS 16.6 ou plus</summary>
<div style="padding-top:.75rem">
<p><strong>Statut :</strong> critère public satisfait, sous réserve de la compatibilité matérielle et de la politique de sécurité.</p>
<p><strong>Dépendances :</strong> App Store pour le canal public actuel ; mécanismes Apple de signature, installation et environnement sécurisé.</p>
<p><strong>Inconnu :</strong> usage actuel ou non d’App Attest par France Identité.</p>
<p><strong>Sortie partielle :</strong> une distribution alternative existe dans l’Union, mais reste soumise à App Store Connect et à la notarisation Apple.</p>
</div>
</details>

<details style="margin:1rem 0;border:1px solid #2b3038;border-radius:12px;padding:.9rem 1rem;background:#101319">
<summary style="cursor:pointer;font-weight:700">Aucun smartphone compatible</summary>
<div style="padding-top:.75rem">
<p><strong>Statut :</strong> France Identité mobile indisponible, identité physique toujours valable.</p>
<p><strong>Conséquence :</strong> l’accès dépend du parcours alternatif de chaque service.</p>
<p><strong>Coût possible :</strong> délai, courrier, déplacement, certificat qualifié, mandataire ou remplacement du téléphone.</p>
<p><strong>Ligne rouge :</strong> l’absence de smartphone ne doit pas provoquer la perte du droit que le service est censé délivrer.</p>
</div>
</details>
</div>

## Le test l0g doit distinguer sécurité et exclusion

Une enquête sérieuse ne cherchera pas à contourner les protections de France Identité. Elle doit au contraire mesurer leur effet sans compromettre une identité réelle.

La matrice de test prévue comprend :

```text
Android récent certifié Google
Android 11 ancien mais maintenu
Android sans services Google
Android avec bootloader déverrouillé
Android avec ROM alternative
Huawei avec ou sans services Google
IPhone à la version minimale
IPhone récent
Téléphone sans compte de store configuré
```

Pour chaque appareil :

```text
Application visible dans le magasin
Installation autorisée
Premier lancement
Message et code d’erreur
Lecture NFC
Création de l’identité
Reconnaissance FranceConnect
Reconnaissance FranceConnect+
Canal de mise à jour
Mode hors ligne
Réponse du support
```

Les appareils modifiés serviront à vérifier que les contrôles détectent effectivement les environnements non conformes, pas à les déjouer.

L’article final devra publier les modèles, versions, correctifs, états du bootloader et résultats. Un téléphone refusé ne devra jamais être décrit comme « sûr » sur la seule base de son apparence ou de sa version Android.

## La souveraineté est une capacité de sortie

Le mot est trop souvent traité comme une étiquette. Pour France Identité, il peut être transformé en questions vérifiables.

| Capacité | Test concret |
|---|---|
| Distribuer | L’État peut-il fournir l’application par un canal officiel hors Google Play ou App Store ? |
| Signer | Qui détient les clés de production Android et iOS ? |
| Mettre à jour | Quel délai s’applique à un correctif critique ? |
| Attester | Quelle racine prouve l’intégrité de l’application et du matériel ? |
| Expliquer | Le citoyen obtient-il la cause précise du refus ? |
| Corriger | France Titres peut-il lever un faux positif sans attendre le constructeur ? |
| Remplacer | Un autre mécanisme de sécurité peut-il être utilisé ? |
| Continuer | Le service final conserve-t-il un mode dégradé ? |
| Indemniser | Qui rembourse le coût d’une incompatibilité erronée ? |

Aucune administration moderne ne fabriquera seule le processeur, le modem, l’écran, le système et le magasin de chaque téléphone. L’objectif raisonnable n’est pas l’autarcie.

Il est de connaître les dépendances, d’obtenir des droits d’accès, de maîtriser les clés, de tester la sortie et de protéger le citoyen lorsqu’une couche extérieure se trompe.

## Les réponses qui doivent être publiées

France Titres peut lever une grande partie de l’incertitude sans dévoiler de secrets exploitables.

Un document public pourrait préciser :

```text
Mécanismes de sécurité exigés
Familles de terminaux acceptées
Niveau minimal de correctifs
Usage ou non de Play Integrity
Usage ou non d’Android Key Attestation
Usage ou non d’App Attest
Données transmises à Apple ou Google
Propriétaire des clés de signature
Canaux officiels de distribution
Codes d’erreur et recours
Taux de refus par cause
Mode dégradé et délais de correction
```

Il ne serait pas nécessaire de publier les seuils anti-fraude précis ni les détails permettant de contourner un contrôle. Une classification des causes et une procédure de recours suffiraient déjà à rendre le système beaucoup plus intelligible.

Apple et Google doivent également répondre sur les engagements de disponibilité, la conservation des métadonnées, les délais de correction et la possibilité d’utiliser une racine indépendante pour un portefeuille public.

## Méthode et limites

Cet article repose sur les sources publiques disponibles au **28 août 2026** : documentation de France Titres, fiches App Store et Google Play, rapports CSPN de 2023, décisions et catalogue ANSSI, règlement eIDAS révisé, documentation Android et Apple, dépôts officiels de l’implémentation EUDI, statistiques Insee et Arcep, ainsi que des témoignages publiés sur Services Publics+.

La méthode l0g sépare cinq niveaux de preuve :

```text
ÉTABLI
Texte, rapport, statistique ou configuration publiée

DÉCLARÉ
Affirmation de France Titres, d’une plateforme ou d’un utilisateur

DÉDUIT
Conclusion raisonnable tirée de plusieurs sources

INCONNU
Information non publiée

À TESTER
Fonctionnement à vérifier sur un terminal contrôlé
```

Les témoignages Services Publics+ servent uniquement à sélectionner des scénarios de test. Ils ne permettent pas de mesurer une fréquence, une part de marché ou une responsabilité.

L0g n’a pas observé le trafic réseau de France Identité, analysé son binaire de production, obtenu son SBOM, consulté les contrats avec Apple ou Google, ni reçu de confirmation sur Play Integrity, App Attest ou la détention des clés de signature.

Les descriptions de l’attestation Android, d’App Attest et de l’implémentation EUDI documentent les mécanismes disponibles ou proposés. Elles ne prouvent pas que France Identité les emploie actuellement.

## Une identité publique doit survivre à son téléphone

Le smartphone apporte à France Identité une sécurité, une distribution et une ergonomie qu’un État aurait beaucoup de mal à reconstruire seul. Apple et Google ne sont pas, par leur seule présence, une anomalie. Ils fournissent une infrastructure industrielle dont le service public tire parti.

Le risque commence lorsque cette infrastructure devient une condition opaque.

Un citoyen peut remplir les critères affichés, posséder une CNI valide et disposer d’un téléphone récent, puis recevoir un refus qu’il ne peut ni comprendre, ni corriger, ni contester avant son échéance. L’identité physique reste valable. Le parcours numérique rapide disparaît.

L’Europe a répondu par deux principes puissants : ouvrir le code et imposer l’accès aux fonctions des plateformes. Il reste à transformer ces principes en capacités de production : un canal de secours, des clés maîtrisées, une attestation explicable, une compatibilité mesurée et un recours rapide.

La souveraineté utile ne se lit pas sur le drapeau de l’écran d’accueil.

> **Elle se mesure le jour où l’État doit faire fonctionner, réparer ou remplacer son identité numérique sans demander au citoyen de changer de téléphone pour retrouver ses droits.**
