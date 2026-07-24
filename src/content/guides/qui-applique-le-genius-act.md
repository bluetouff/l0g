---
title: "GENIUS Act : qui applique quoi ? L'architecture d'application des stablecoins"
description: "Guide de référence sur l'application du GENIUS Act : quel régulateur supervise quel type d'émetteur de stablecoin, comment fonctionnent les trois portes d'entrée fédérales et l'étage d'État, pourquoi un émetteur agréé devient une institution financière soumise au droit des sanctions, et un calendrier d'application tendu et incertain à l'approche du 18 juillet 2026."
pubDate: 2026-07-01T09:00:00+02:00
updatedDate: 2026-07-01T09:00:00+02:00
tags: ["crypto", "stablecoins", "régulation", "sanctions", "macro"]
summary: "Le GENIUS Act ne crée pas un régulateur unique des stablecoins de paiement, mais un maillage. L'OCC, la Réserve fédérale, la FDIC, la NCUA, le Trésor et les régulateurs d'État se partagent la supervision selon le type d'émetteur, pendant que FinCEN et l'OFAC imposent à tous des obligations d'anti-blanchiment et de sanctions."
category: crypto
draft: false
---

*Le GENIUS Act a été promulgué le 18 juillet 2025. Un an plus tard, la question n'est plus de savoir si les stablecoins de paiement seront encadrés aux États-Unis, mais qui les encadre, et comment. La loi ne crée pas d'autorité unique. Elle répartit la supervision entre plusieurs administrations fédérales et les régulateurs d'État, selon la nature de l'émetteur, et elle transforme chaque émetteur agréé en institution financière soumise au droit des sanctions. Ce guide cartographie cette architecture d'application, et explique pourquoi son calendrier reste, à ce jour, tendu et incertain.*

Ce guide est le complément opérationnel de [Stablecoins et GENIUS Act : lire la promesse du dollar numérique](/guides/stablecoins-genius-act/), qui explique ce qu'est un [stablecoin](/glossaire/#stablecoin), comment il tient son ancrage et ce que la loi exige d'une réserve. Ici, on ne regarde plus la promesse mais la plomberie : la carte des régulateurs, les voies d'agrément, et le basculement d'un jeton de paiement dans le champ des sanctions américaines.

## Une loi, plusieurs régulateurs

Le premier réflexe serait d'imaginer un guichet unique. Il n'existe pas. Le texte confie la mise en œuvre à cinq administrations fédérales, l'OCC, la Réserve fédérale, la FDIC, la NCUA et le Trésor, ainsi qu'aux régulateurs d'État, chacun dans son périmètre. C'est ce que rappelle noir sur blanc le projet de règle conjoint de FinCEN et de l'OFAC publié au Federal Register : la loi charge l'[OCC](/glossaire/#occ), le Board de la Réserve fédérale, la [FDIC](/glossaire/#fdic), la [NCUA](/glossaire/#ncua) et, le cas échéant, les régulateurs d'État de bâtir le cadre d'agrément, de supervision et d'examen des émetteurs.

La notion clé est celle de régulateur fédéral principal. Pour chaque émetteur agréé, un régulateur est désigné selon sa forme juridique. Dans les faits, l'OCC porte la charge la plus lourde : le cabinet Sullivan & Cromwell note qu'il sera de loin le régulateur le plus étendu, puisqu'il supervise à la fois les émetteurs non bancaires agréés au niveau fédéral, les filiales de banques nationales, les banques nationales non assurées, les succursales fédérales de banques étrangères et les émetteurs étrangers enregistrés. Les autres agences bancaires ne supervisent, en général, que les filiales émettrices des établissements qu'elles régulent déjà.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 430" role="img" aria-label="Carte des régulateurs du GENIUS Act selon le type d'émetteur de stablecoin" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="430" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Qui supervise quel émetteur</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Régulateur fédéral principal selon la forme juridique de l'émetteur agréé.</text>
  <text x="32" y="92" fill="#8b909b" font-size="11">TYPE D'ÉMETTEUR</text>
  <text x="470" y="92" fill="#8b909b" font-size="11">RÉGULATEUR PRINCIPAL</text>
  <line x1="32" y1="100" x2="688" y2="100" stroke="#2a2c33" stroke-width="1"></line>
  <text x="32" y="126" fill="#d6d9df" font-size="12.5">Émetteur non bancaire fédéral (FQPSI)</text>
  <text x="470" y="126" fill="#5eead4" font-size="12.5" font-weight="700">OCC</text>
  <text x="32" y="158" fill="#d6d9df" font-size="12.5">Banque nationale ou trust non assuré (filiale)</text>
  <text x="470" y="158" fill="#5eead4" font-size="12.5" font-weight="700">OCC</text>
  <text x="32" y="190" fill="#d6d9df" font-size="12.5">Banque d'État membre de la Fed (filiale)</text>
  <text x="470" y="190" fill="#f5b13d" font-size="12.5" font-weight="700">Réserve fédérale</text>
  <text x="32" y="222" fill="#d6d9df" font-size="12.5">Banque d'État non membre ou caisse d'épargne</text>
  <text x="470" y="222" fill="#8b909b" font-size="12.5" font-weight="700">FDIC</text>
  <text x="32" y="254" fill="#d6d9df" font-size="12.5">Organisme de credit union (CUSO)</text>
  <text x="470" y="254" fill="#8b909b" font-size="12.5" font-weight="700">NCUA</text>
  <text x="32" y="286" fill="#d6d9df" font-size="12.5">Émetteur agréé d'État, encours 10 Md$ ou moins (SQPSI)</text>
  <text x="470" y="286" fill="#ff4d87" font-size="12.5" font-weight="700">Régulateur d'État</text>
  <text x="32" y="318" fill="#d6d9df" font-size="12.5">Émetteur étranger (FPSI)</text>
  <text x="470" y="318" fill="#5eead4" font-size="12.5" font-weight="700">OCC (enregistrement)</text>
  <line x1="32" y1="338" x2="688" y2="338" stroke="#2a2c33" stroke-width="1"></line>
  <rect x="32" y="356" width="656" height="52" rx="6" fill="#5eead4" opacity="0.10"></rect>
  <text x="48" y="380" fill="#5eead4" font-size="12" font-weight="700">Pour tous, sans exception</text>
  <text x="48" y="399" fill="#d6d9df" font-size="12">FinCEN (anti-blanchiment) et OFAC (sanctions), sous l'autorité du Trésor.</text>
</svg>
<figcaption>Le GENIUS Act désigne un régulateur fédéral principal par type d'émetteur, l'<strong>OCC</strong> couvrant le périmètre le plus large. Par-dessus ce maillage prudentiel, les obligations d'anti-blanchiment et de sanctions du Trésor s'appliquent à tout émetteur. Sources : Federal Register (projet de règle conjoint FinCEN/OFAC, avril 2026) ; Sullivan &amp; Cromwell, mars 2026.</figcaption>
</figure>

## Trois portes d'entrée pour émettre

Pour émettre légalement un stablecoin de paiement aux États-Unis, il faut être un émetteur agréé, un [PPSI](/glossaire/#ppsi) dans le vocabulaire de la loi. Le cabinet Mayer Brown résume les trois voies ouvertes par le texte. La première passe par une filiale de banque assurée, agréée par le régulateur fédéral principal de la banque mère. La deuxième vise l'émetteur non bancaire agréé directement par l'OCC, dit émetteur fédéral qualifié. La troisième relève d'un émetteur agréé au niveau d'un État. À ces trois portes s'ajoute le cas de l'émetteur étranger, qui doit s'enregistrer pour offrir ses jetons sur le marché américain.

Ce découpage n'est pas cosmétique. Il détermine qui délivre l'agrément, qui examine les comptes, et sous quel corpus de règles l'émetteur opère. La FDIC a d'ailleurs précisé, dans son projet, un délai d'instruction encadré : trente jours pour signaler un dossier incomplet, cent vingt jours pour statuer, l'absence de décision valant approbation par défaut. La lisibilité du calendrier fait ici partie de l'agrément lui-même.

## L'étage fédéral et l'étage d'État

Le point le plus subtil de l'architecture tient au partage entre supervision fédérale et supervision d'État. Un émetteur agréé par un État peut rester sous ce régime tant que son encours ne dépasse pas 10 milliards de dollars. Au-delà, rappelle Sullivan &amp; Cromwell, il doit basculer vers une supervision fédérale, exercée conjointement par le régulateur d'État et l'OCC, sauf dérogation accordée par ce dernier.

Encore faut-il que le régime d'État soit reconnu. Le Trésor a publié un projet de règle fixant les principes qui déterminent si un cadre étatique est substantiellement similaire au cadre fédéral. Un comité, le Stablecoin Certification Review Committee, doit constater à l'unanimité que le régime de l'État atteint ou dépasse les exigences de la loi. Sans cette certification, la voie étatique se referme. C'est un mécanisme de reconnaissance mutuelle interne, pensé pour éviter que la supervision d'État ne devienne une porte de sortie réglementaire.

Un détail de la FDIC mérite l'attention, car il défait une intuition commune. Les dollars déposés en banque pour servir de réserve à un stablecoin ne bénéficient pas d'une assurance des dépôts qui remonterait jusqu'au porteur du jeton. L'assurance protège l'émetteur au titre de ses dépôts d'entreprise, pas le détenteur final. Détenir un stablecoin adossé à des dépôts bancaires n'équivaut donc pas à détenir un dépôt assuré.

## Le stablecoin devient une institution financière

Voici la rupture la plus lourde de conséquences, et la moins commentée. Le GENIUS Act ordonne de traiter chaque émetteur agréé comme une institution financière au sens du [Bank Secrecy Act](/glossaire/#bsa). Le projet conjoint de FinCEN et de l'OFAC en tire deux obligations. La première est un programme d'anti-blanchiment de type bancaire, plus exigeant que le simple statut de money services business sous lequel opéraient jusqu'ici la plupart des émetteurs. La seconde est, selon Mayer Brown, une première dans le droit fédéral : l'obligation explicite, pour une catégorie de personnes américaines, de tenir un programme effectif de conformité aux sanctions.

Concrètement, un émetteur doit pouvoir exécuter un ordre légal de gel, de saisie ou de destruction de jetons, y compris lorsque la transaction visée circule sur le marché secondaire via un contrat intelligent. La loi définit d'ailleurs précisément cet ordre légal : un acte final émanant d'une juridiction ou d'une agence fédérale compétente, désignant avec une précision raisonnable les jetons ou comptes à bloquer. Le stablecoin cesse d'être un objet purement technique pour devenir un instrument que l'État peut figer.

Cette bascule prolonge une question déjà posée sur l'infrastructure existante, celle des jetons gelables par leur émetteur sur ordre de l'[OFAC](/guides/ofac-sdn-list/), analysée dans le cas de l'[USDT sur Tron et des péages numériques d'Ormuz](/posts/iran-peages-ormuz-usdt-tron-ofac/). Le GENIUS Act la généralise et l'inscrit dans la loi. Un volet complémentaire d'identification de la clientèle, proposé le 22 juin 2026 par FinCEN avec l'OCC, la Réserve fédérale, la FDIC et la NCUA, ajoutera des obligations de vérification d'identité, avec une entrée en vigueur attendue plus tard, signe que tout le dispositif ne sera pas bouclé en une seule fois.

## Ni titre, ni matière première

Un dernier trait structurant conditionne toute l'architecture. La loi qualifie le stablecoin de paiement conforme comme n'étant ni un titre financier ni une matière première. Ce choix retire de facto la SEC et la CFTC du circuit d'agrément, confié aux régulateurs bancaires. C'est le miroir du débat plus large sur la classification des crypto-actifs américains, que l'on peut suivre à travers le [CLARITY Act et la structure de marché crypto](/posts/clarity-act-regulation-crypto-etats-unis/). En contrepartie de cette clarté, la loi ferme une porte commerciale : un émetteur ne peut verser aucun intérêt ni rendement au porteur au seul titre de la détention du jeton.

## Le calendrier, et pourquoi il reste incertain

Le GENIUS Act impose que la plupart des règles d'application soient prises dans l'année suivant sa promulgation, soit d'ici le 18 juillet 2026. La loi entrera pleinement en vigueur au plus tard le 18 janvier 2027, ou plus tôt, cent vingt jours après la publication des règles finales par les régulateurs fédéraux principaux. Ce double repère est établi par le tracker du cabinet Chapman and Cutler comme par Sullivan &amp; Cromwell.

À ce jour, les six administrations concernées, l'OCC, la FDIC, la NCUA, le Trésor, FinCEN et l'OFAC, ont toutes publié leurs projets de règles, et l'ensemble des périodes de commentaires s'est clos autour du 9 juin 2026. Elles se trouvent donc dans une phase finale de rédaction avant l'échéance. Mais deux réserves imposent la prudence. D'abord, un pan du dispositif, l'identification de la clientèle proposée le 22 juin, ne sera pas finalisé avant 2027. Ensuite, une échéance légale de rédaction n'est pas une garantie de résultat : rien dans le texte ne prévoit de mécanisme de repli automatique si une agence dépasse la date. Le calendrier ci-dessous est donc à lire comme une trajectoire probable, pas comme un engagement ferme.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 250" role="img" aria-label="Calendrier d'application du GENIUS Act, de la promulgation en juillet 2025 à l'entrée en vigueur début 2027" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="250" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Un calendrier tendu, sans filet</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Repères d'application. L'échéance de rédaction n'emporte pas de mécanisme de repli.</text>
  <line x1="60" y1="140" x2="660" y2="140" stroke="#2a2c33" stroke-width="2"></line>
  <circle cx="90" cy="140" r="5" fill="#8b909b"></circle>
  <text x="90" y="112" fill="#d6d9df" font-size="11" text-anchor="middle">18 juil. 2025</text>
  <text x="90" y="98" fill="#8b909b" font-size="10.5" text-anchor="middle">promulgation</text>
  <circle cx="250" cy="140" r="5" fill="#5eead4"></circle>
  <text x="250" y="170" fill="#d6d9df" font-size="11" text-anchor="middle">fév. à juin 2026</text>
  <text x="250" y="184" fill="#8b909b" font-size="10.5" text-anchor="middle">projets de règles</text>
  <text x="250" y="198" fill="#8b909b" font-size="10.5" text-anchor="middle">commentaires clos le 9 juin</text>
  <circle cx="390" cy="140" r="5" fill="#5eead4"></circle>
  <text x="390" y="112" fill="#d6d9df" font-size="11" text-anchor="middle">22 juin 2026</text>
  <text x="390" y="98" fill="#8b909b" font-size="10.5" text-anchor="middle">projet identification client</text>
  <circle cx="500" cy="140" r="6" fill="#ff4d87"></circle>
  <line x1="500" y1="118" x2="500" y2="162" stroke="#ff4d87" stroke-width="2" stroke-dasharray="4 4"></line>
  <text x="500" y="176" fill="#ff4d87" font-size="11" text-anchor="middle" font-weight="700">18 juil. 2026</text>
  <text x="500" y="190" fill="#ff4d87" font-size="10.5" text-anchor="middle">échéance des règles</text>
  <text x="500" y="204" fill="#8b909b" font-size="10.5" text-anchor="middle">tendue, sans repli</text>
  <circle cx="620" cy="140" r="5" fill="#f5b13d"></circle>
  <text x="620" y="112" fill="#d6d9df" font-size="11" text-anchor="middle">au plus tard</text>
  <text x="620" y="98" fill="#f5b13d" font-size="10.5" text-anchor="middle">18 janv. 2027</text>
  <text x="620" y="222" fill="#8b909b" font-size="10.5" text-anchor="middle">entrée en vigueur</text>
  <text x="620" y="236" fill="#8b909b" font-size="10.5" text-anchor="middle" textLength="192" lengthAdjust="spacingAndGlyphs">ou 120 j après règles finales</text>
</svg>
<figcaption>La plupart des règles doivent être prises d'ici le <strong>18 juillet 2026</strong>, un an après la promulgation, l'entrée en vigueur intervenant au plus tard le <strong>18 janvier 2027</strong> ou cent vingt jours après les règles finales. Les six agences ont publié leurs projets, commentaires clos vers le 9 juin, mais aucun repli n'est prévu en cas de dépassement. Sources : Chapman and Cutler, tracker GENIUS Act ; Sullivan &amp; Cromwell ; Federal Register.</figcaption>
</figure>

## Comment lire l'architecture, pas à pas

La méthode tient en cinq réflexes. Premièrement, identifier la forme juridique de l'émetteur, car c'est elle, et non sa marque, qui désigne son régulateur. Deuxièmement, situer cet émetteur sur la carte : fédéral non bancaire et étranger relèvent de l'OCC, les filiales bancaires de l'agence de leur maison mère, l'émetteur d'État de son régulateur local sous réserve de certification par le Trésor. Troisièmement, vérifier le statut du texte applicable : un projet de règle n'est pas une règle finale, et les deux se distinguent par leur portée juridique. Quatrièmement, garder en tête la mécanique de la date d'entrée en vigueur, adossée au plus tôt entre janvier 2027 et cent vingt jours après les règles finales. Cinquièmement, ne jamais oublier que les obligations d'anti-blanchiment et de sanctions s'appliquent à tous, quel que soit le régulateur prudentiel.

## Méthodologie

Ce guide décrit une architecture réglementaire à partir des textes fédéraux et de leurs projets d'application connus au 1er juillet 2026. Il ne constitue pas un conseil juridique ni un conseil en investissement. Les projets de règles peuvent évoluer avant leur version finale, et le calendrier d'application reste susceptible d'ajustement. Les montants et seuils cités proviennent directement de la loi et des projets de règles publiés au Federal Register.

**Sources principales**

- [GENIUS Act, texte de loi (S.1582, 119e Congrès)](https://www.congress.gov/bill/119th-congress/senate-bill/1582/text)
- [Federal Register, projet de règle de l'OCC (mars 2026)](https://www.federalregister.gov/documents/2026/03/02/2026-04089/implementing-the-guiding-and-establishing-national-innovation-for-us-stablecoins-act-for-the)
- [Federal Register, projet de règle de la FDIC (avril 2026)](https://www.federalregister.gov/documents/2026/04/10/2026-06974/genius-act-requirements-and-standards-for-fdic-supervised-permitted-payment-stablecoin-issuers-and)
- [Federal Register, projet conjoint FinCEN et OFAC, anti-blanchiment et sanctions (avril 2026)](https://www.federalregister.gov/documents/2026/04/10/2026-06963/permitted-payment-stablecoin-issuer-anti-money-launderingcountering-the-financing-of-terrorism)
- [Trésor américain, communiqué FinCEN et OFAC](https://home.treasury.gov/news/press-releases/sb0435)
- [OCC, formulaires de reporting des émetteurs (bulletin 2026-24)](https://www.occ.gov/news-issuances/bulletins/2026/bulletin-2026-24.html)
- [Chapman and Cutler, tracker des règles du GENIUS Act](https://www.chapman.com/publication-genius-act-rulemaking-tracker)
- [Sullivan &amp; Cromwell, analyse du projet de règle de l'OCC](https://www.sullcrom.com/insights/memo/2026/March/OCC-Proposes-Regulations-Implement-GENIUS-Act)
- [Morgan Lewis, panorama des projets d'application](https://www.morganlewis.com/pubs/2026/04/genius-act-implementation-key-proposals-and-what-comes-next)
- [Troutman Pepper Locke, règle d'identification de la clientèle (juin 2026)](https://www.troutman.com/insights/from-crypto-to-compliance-how-the-genius-act-is-reshaping-stablecoin-kyc-obligations/)
