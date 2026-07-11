---
title: "GENIUS Act : l'échéance du 18 juillet, entre règles actées et pari sur la dette"
description: "Le 18 juillet 2026, un an après sa promulgation, le GENIUS Act arrive à l'échéance de ses règles d'application : six agences fédérales finalisent le cadre des stablecoins. Ce qui est acté (réserves à 100 %, bons du Trésor courts, interdiction de rémunérer) et ce qui reste un pari (une vague de demande de dette, le sort de Tether, le risque de ruée). Analyse rigoureuse, du fait au scénario."
pubDate: 2026-07-11
updatedDate: 2026-07-11
tags: ["stablecoins", "crypto", "régulation", "dette", "trésor us"]
draft: false
---
*Le 18 juillet 2026 marque le premier anniversaire du GENIUS Act, la loi américaine sur les stablecoins, et surtout l'échéance légale de ses règles d'application. Six agences fédérales bouclent en ce moment le cadre qui régira une monnaie privée de plus de 230 milliards de dollars. Autour de cette date, il faut distinguer deux ordres de réalité : ce que la loi grave dans le marbre, qui est un fait, et ce que le marché en attend, qui reste un pari. Confondre les deux serait la meilleure façon de mal lire l'événement.*

Un rappel de cadre s'impose. Un [stablecoin](/glossaire/stablecoin/) de paiement est un jeton numérique censé valoir un dollar, adossé à des réserves et remboursable au pair. Nous avons décrit le fonctionnement de ce marché et de la loi dans nos guides sur [les stablecoins et le GENIUS Act](/guides/stablecoins-genius-act/) et sur [son architecture d'application](/guides/qui-applique-le-genius-act/). Le présent article ne refait pas cette pédagogie : il se concentre sur ce que l'échéance du 18 juillet change, et sur la part de récit qui l'entoure.

## Le calendrier et les règles actées

Commençons par les faits. Le [GENIUS Act](/glossaire/genius/) a été promulgué le 18 juillet 2025. La loi imposait que ses règles d'application soient publiées au plus tard un an après, soit le 18 juillet 2026. Six agences sont concernées : l'OCC, la FDIC, la NCUA, le Trésor, le FinCEN et l'OFAC. Chacune a publié un projet de règle entre mars et avril 2026, et toutes les consultations publiques se sont closes le 9 juin, plaçant la publication des textes définitifs dans la fenêtre de juin-juillet.

Le contenu de ces règles, lui, est déjà écrit dans la loi. Un émetteur de stablecoin de paiement doit détenir des réserves à 100 %, adossées à du cash, des dépôts bancaires assurés et des bons du Trésor à échéance courte, de 93 jours ou moins. Il doit publier chaque mois la composition de ses réserves. Il lui est interdit de verser un intérêt aux porteurs. Au-delà de 10 milliards de dollars d'encours, il bascule obligatoirement sous supervision fédérale ; en deçà, il peut opter pour un régime d'État jugé équivalent. Enfin, les émetteurs étrangers sont exclus du marché américain, sauf accord de réciprocité négocié par le Trésor.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 300" role="img" aria-label="Les règles du GENIUS Act actées à l'échéance du 18 juillet 2026" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="300" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Les règles actées au 18 juillet</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Le cadre du GENIUS Act pour les stablecoins de paiement. Des faits, pas des scénarios.</text>
  <line x1="40" y1="78" x2="680" y2="78" stroke="#2a2c33" stroke-width="1"></line>
  <circle cx="48" cy="101" r="5" fill="#5eead4"></circle>
  <text x="64" y="98" fill="#5eead4" font-size="12.5" font-weight="700">Réserves à 100 %</text>
  <text x="64" y="115" fill="#8b909b" font-size="11.5">cash, dépôts assurés et bons du Trésor à 93 jours ou moins.</text>
  <line x1="40" y1="128" x2="680" y2="128" stroke="#2a2c33" stroke-width="1"></line>
  <circle cx="48" cy="151" r="5" fill="#7aa2f7"></circle>
  <text x="64" y="148" fill="#7aa2f7" font-size="12.5" font-weight="700">Transparence mensuelle</text>
  <text x="64" y="165" fill="#8b909b" font-size="11.5">composition des réserves publiée chaque mois.</text>
  <line x1="40" y1="178" x2="680" y2="178" stroke="#2a2c33" stroke-width="1"></line>
  <circle cx="48" cy="201" r="5" fill="#ff4d87"></circle>
  <text x="64" y="198" fill="#ff4d87" font-size="12.5" font-weight="700">Aucun rendement aux porteurs</text>
  <text x="64" y="215" fill="#8b909b" font-size="11.5">interdiction de verser un intérêt sur le jeton.</text>
  <line x1="40" y1="228" x2="680" y2="228" stroke="#2a2c33" stroke-width="1"></line>
  <circle cx="48" cy="251" r="5" fill="#f5b13d"></circle>
  <text x="64" y="248" fill="#f5b13d" font-size="12.5" font-weight="700">Seuil de 10 Md$ et frontière</text>
  <text x="64" y="265" fill="#8b909b" font-size="11.5">au-delà, supervision fédérale ; émetteurs étrangers exclus sauf réciprocité.</text>
  <text x="32" y="290" fill="#8b909b" font-size="11">Sources : GENIUS Act (texte de loi), OCC, Trésor américain, FinCEN, OFAC.</text>
</svg>
<figcaption>Les quatre piliers du cadre : réserves intégrales en actifs sûrs et courts, transparence mensuelle, interdiction de rémunérer, et une frontière réglementaire à <strong>10 milliards de dollars</strong>. Voilà le fait. Le reste est interprétation. Sources : texte de loi, OCC, Trésor.</figcaption>
</figure>

Ce socle est solide et, pour l'essentiel, non contesté. La bataille des commentaires a surtout porté sur les détails d'application, notamment la portée de l'OFAC sur les émetteurs étrangers. Mais la structure ne bougera plus. C'est à partir de ce socle que commence la partie incertaine.

## Le canal des bons du Trésor

De la règle des réserves découle un fait mécanique : un émetteur de stablecoin conforme est un acheteur quasi automatique de [bons du Trésor](/glossaire/t-bill/) courts. Pour chaque jeton émis, il doit placer un dollar dans du cash ou de la dette d'État à moins de 93 jours. Le stablecoin devient ainsi un cousin du [fonds monétaire](/guides/lire-les-fonds-monetaires/), avec la même mécanique de réserve, mais sans le droit de reverser le rendement à ses détenteurs. Ce point est acquis, et il n'est pas anodin : il relie directement la monnaie privée numérique au financement de l'État.

Là où l'on quitte le fait pour le pari, c'est sur l'ampleur. Le marché des stablecoins pèse aujourd'hui environ 230 milliards de dollars. Les projections, elles, s'envolent. Le secrétaire au Trésor Scott Bessent a estimé que le marché américain pourrait dépasser 2 000 milliards de dollars d'ici fin 2028, et Standard Chartered chiffre à environ 1 000 milliards la demande nouvelle de bons du Trésor qui en résulterait. La même banque calcule que, cumulée aux autres besoins, cette demande pourrait dépasser l'offre nette de bons prévue, contraignant le Trésor à émettre davantage de dette courte.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 290" role="img" aria-label="Le marché des stablecoins aujourd'hui, un fait, et sa projection à 2028" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="290" fill="#0c0d10"></rect>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Le pari des bons du Trésor</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Un fait mesuré aujourd'hui, une projection à 2028. À ne pas confondre.</text>
  <text x="40" y="92" fill="#5eead4" font-size="12">FAIT, marché des stablecoins aujourd'hui</text>
  <rect x="40" y="102" width="600" height="24" fill="#2a2c33"></rect>
  <rect x="40" y="102" width="69" height="24" fill="#5eead4" opacity="0.9"></rect>
  <text x="117" y="119" fill="#5eead4" font-size="12" font-weight="700">~230 Md$</text>
  <text x="40" y="152" fill="#f5b13d" font-size="12">PROJECTION, marché possible fin 2028</text>
  <rect x="40" y="162" width="600" height="24" fill="#2a2c33"></rect>
  <rect x="40" y="162" width="600" height="24" fill="#f5b13d" opacity="0.55"></rect>
  <text x="632" y="179" fill="#0c0d10" font-size="12" font-weight="700" text-anchor="end">~2 000 Md$</text>
  <text x="40" y="212" fill="#d6d9df" font-size="12.5">Demande nouvelle de bons du Trésor qui en découlerait :</text>
  <text x="40" y="232" fill="#f5b13d" font-size="12.5" font-weight="700">~1 000 Md$ d'ici 2028 (projection Standard Chartered).</text>
  <text x="32" y="272" fill="#8b909b" font-size="11">Sources : fait, encours de marché mi-2026 ; projections, S. Bessent (Trésor) et Standard Chartered.</text>
</svg>
<figcaption>Le marché vaut aujourd'hui <strong>230 milliards</strong>, c'est un fait. Les <strong>2 000 milliards</strong> de 2028 et le trillion de demande de bons sont des <strong>projections</strong>, non des certitudes. Le passage de l'un à l'autre suppose une adoption massive qui reste à démontrer. Sources : Trésor, Standard Chartered.</figcaption>
</figure>

Il faut tenir ces chiffres pour ce qu'ils sont : des scénarios, émis par des analystes et des responsables qui ont intérêt à un marché florissant. Le mécanisme est réel, l'ordre de grandeur ne l'est pas encore. Un émetteur conforme achète bien des bons du Trésor ; qu'ils soient collectivement mille milliards dépend d'une trajectoire d'adoption qui n'a rien d'écrit. Le lien entre stablecoins et [adjudications de dette](/posts/adjudications-record-referendum-dette-americaine/) est une hypothèse crédible, pas un fait observé.

## L'interdiction de rémunérer, et ses effets de bord

Une disposition mérite une attention particulière, car elle façonnera le marché plus que les autres : l'interdiction faite aux émetteurs de verser un rendement aux porteurs. L'intention est claire, éviter que les stablecoins ne deviennent des comptes d'épargne déguisés, échappant à la réglementation bancaire et pouvant siphonner les dépôts des banques. Mais l'effet de bord est prévisible.

Si un stablecoin ne rapporte rien alors que ses réserves, elles, produisent un intérêt encaissé par l'émetteur, deux dynamiques s'enclenchent. D'un côté, les émetteurs conformes voient leur modèle économique confirmé : ils gardent le rendement des réserves, très lucratif à cette échelle. De l'autre, les détenteurs cherchent le rendement ailleurs, ce qui pousse vers les fonds monétaires tokenisés et autres véhicules porteurs d'intérêt, en concurrence directe avec les stablecoins de paiement. La règle ne supprime pas l'appétit de rendement, elle le déplace. Elle crée aussi une asymétrie géographique : selon plusieurs analyses, un même émetteur peut proposer du rendement sur ses jetons émis hors des États-Unis, mais pas sur ceux régulés aux États-Unis, une frontière qui invite au contournement.

## Le cas Tether, angle mort du dispositif

Aucune lecture honnête ne peut ignorer l'éléphant dans la pièce. Tether, l'émetteur de l'USDT, représentait environ deux tiers de l'offre mondiale de stablecoins à la mi-2026. Or Tether est domicilié hors des États-Unis, et la question de savoir si l'OFAC peut réellement contraindre un émetteur étranger servant des Américains est précisément l'un des points que la consultation devait trancher. Le déterminant de réciprocité qui ouvrirait au groupe le marché américain n'a pas été émis à ce jour.

Deux lectures s'affrontent. Selon la première, le 18 juillet met Tether au pied du mur : sans conformité, l'accès au marché américain se ferme, et le groupe a d'ailleurs lancé un jeton dédié, l'USAT, conçu pour les règles américaines. Selon la seconde, plus sceptique, le gros de l'activité de Tether restera simplement offshore, hors de portée du régulateur américain, et un marché du dollar-stablecoin non conforme continuera de prospérer à l'international. La régulation américaine encadrerait alors le stablecoin domestique sans réduire le stablecoin dollar mondial. Laquelle l'emporte reste ouvert, et c'est l'incertitude la plus lourde du dispositif.

## Les trajectoires possibles

Plusieurs suites se dessinent. Ce sont des scénarios, pas des prévisions.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 300" role="img" aria-label="Quatre trajectoires possibles après l'échéance du 18 juillet" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="300" fill="#0c0d10"></rect>
  <text x="32" y="34" fill="#f5f6f8" font-size="17" font-weight="700">Quatre trajectoires après le 18 juillet</text>
  <text x="32" y="55" fill="#8b909b" font-size="12">Hypothèses d'analyste, non des prévisions.</text>
  <rect x="40" y="74" width="4" height="46" fill="#5eead4"></rect>
  <text x="58" y="90" fill="#5eead4" font-size="12.5" font-weight="700">Cadre net, vague de demande</text>
  <text x="58" y="108" fill="#8b909b" font-size="11.5">Règles bouclées, émetteurs conformes prospèrent, la demande de bons se matérialise.</text>
  <rect x="40" y="132" width="4" height="46" fill="#f5b13d"></rect>
  <text x="58" y="148" fill="#f5b13d" font-size="12.5" font-weight="700">Le calendrier glisse</text>
  <text x="58" y="166" fill="#8b909b" font-size="11.5">Règles intérimaires ou incomplètes, mise en œuvre étalée au-delà de l'échéance.</text>
  <rect x="40" y="190" width="4" height="46" fill="#7aa2f7"></rect>
  <text x="58" y="206" fill="#7aa2f7" font-size="12.5" font-weight="700">Tether contourne</text>
  <text x="58" y="224" fill="#8b909b" font-size="11.5">Le dollar-stablecoin non conforme persiste offshore, hors de portée du régulateur.</text>
  <rect x="40" y="248" width="4" height="46" fill="#ff4d87"></rect>
  <text x="58" y="264" fill="#ff4d87" font-size="12.5" font-weight="700">L'épreuve de la ruée</text>
  <text x="58" y="282" fill="#8b909b" font-size="11.5">Un décrochage teste un cadre dépourvu de filet de banque centrale.</text>
</svg>
<figcaption>Du plus favorable au plus périlleux, ces quatre issues ne s'excluent pas : le cadre peut se durcir tout en laissant Tether offshore, et une ruée peut survenir à tout moment. <strong>Scénarios, non prévisions.</strong> Lecture l0g.</figcaption>
</figure>

Le premier scénario est celui du cadre net et de la vague de demande : les règles sont bouclées à temps, les émetteurs conformes comme Circle prospèrent, et la demande de bons du Trésor commence à se matérialiser, validant le récit du financement de l'État par la monnaie numérique. Le deuxième est celui du calendrier qui glisse : les agences publient des règles intérimaires ou incomplètes, et la mise en œuvre s'étale, car les sprints réglementaires tiennent rarement toutes leurs promesses dans les délais. Le troisième est celui du contournement par Tether, déjà évoqué. Le quatrième, le moins commenté et le plus grave, est celui de la ruée.

## Le risque qu'on regarde le moins : la ruée

Voici la contre-thèse, celle qui tempère l'enthousiasme comme l'alarmisme. Le récit dominant présente le GENIUS Act soit comme une révolution du financement de l'État, soit comme une bombe systémique en gestation. Les deux surestiment sans doute l'événement, et négligent le vrai point faible.

Sur le versant optimiste, il faut relativiser. Un marché de 230 milliards de dollars reste modeste face aux 28 000 milliards de dette négociable américaine et aux 8 000 milliards des fonds monétaires. Le stablecoin comme grand créancier de l'État est une projection à 2028, pas une réalité de 2026, et l'histoire des prévisions d'adoption incite à la prudence. Le cadre, en revanche, apporte un progrès réel et sous-estimé : en imposant des réserves en bons du Trésor courts et une transparence mensuelle, il assainit un marché longtemps opaque, où Tether détenait jadis du papier commercial et a fini par transiger avec la justice new-yorkaise sur ses réserves. De ce point de vue, la loi réduit un risque plutôt qu'elle n'en crée.

Sur le versant du danger, l'erreur serait de chercher la menace au mauvais endroit. Le risque n'est pas que les stablecoins achètent trop de bons du Trésor, c'est qu'ils ne puissent pas les vendre assez vite le jour d'une ruée. Un stablecoin est un fonds monétaire sans les protections du fonds monétaire : ni les coussins de liquidité de la règle 2a-7, ni surtout un filet de banque centrale. Or la structure invite à la fuite, comme pour un fonds ou une banque : au premier doute, mieux vaut sortir au pair avant les autres. Le précédent existe. En mars 2023, l'USDC de Circle a décroché jusqu'à environ 0,87 dollar quand le marché a appris qu'une partie de ses réserves était bloquée à la Silicon Valley Bank en faillite. Le jeton n'a retrouvé sa parité qu'après le sauvetage fédéral de la banque. Des réserves sûres n'empêchent pas un décrochage si les remboursements vont plus vite que la liquidité, et le GENIUS Act, en l'état, ne prévoit pas de prêteur en dernier ressort pour les émetteurs. Nous avons détaillé cette mécanique de ruée dans notre [guide des fonds monétaires](/guides/lire-les-fonds-monetaires/) ; elle vaut, en pire, pour les stablecoins.

## Le fait et le pari

L'échéance du 18 juillet est un vrai jalon, et il faut la lire sans excès dans un sens ni dans l'autre. Le fait, c'est un cadre enfin écrit : réserves intégrales en actifs courts et sûrs, transparence, interdiction de rémunérer, frontière réglementaire. C'est une amélioration nette sur l'ère de l'opacité, et cela mérite d'être dit. Le pari, ce sont les récits qui s'y greffent : la vague de mille milliards de demande de dette, la soumission de Tether, la révolution monétaire. Ils sont possibles, pas acquis, et l'analyste honnête les signale comme des hypothèses. Quant au risque, il n'est pas dans l'excès de sécurité des réserves, mais dans l'absence de filet le jour où la confiance vacille. La bonne lecture du 18 juillet tient en une phrase : la règle est actée, le pari commence, et la question qu'on pose le moins, celle de la ruée, est celle qui compte le plus.

## Sources

1. Congress.gov, texte du GENIUS Act (S.1582, 119e Congrès), promulgué le 18 juillet 2025 : https://www.congress.gov/bill/119th-congress/senate-bill/1582/text
2. Stablecoin Insider, six agences fédérales à l'échéance du 18 juillet 2026, consultations closes le 9 juin : https://stablecoininsider.org/six-federal-agencies-have-35-days-to-finalize-genius-act-stablecoin-rules-by-july-18/
3. OCC, projet de règle d'application (12 CFR Part 15), mars 2026 : https://www.occ.gov/news-issuances/bulletins/2026/bulletin-2026-3.html
4. U.S. Department of the Treasury, projet de règle GENIUS Act sur la lutte anti-blanchiment : https://home.treasury.gov/news/press-releases/sb0435
5. Brookings, « Next steps for GENIUS payment stablecoins » : https://www.brookings.edu/articles/next-steps-for-genius-payment-stablecoins/
6. The Block, projection Standard Chartered d'environ 1 000 milliards de dollars de demande de bons du Trésor liée aux stablecoins : https://www.theblock.co/post/390783/stablecoins-could-drive-1-trillion-in-t-bill-demand-giving-treasury-room-to-shift-issuance-standard-chartered
7. The Block, Scott Bessent estime que le marché américain des stablecoins pourrait dépasser 2 000 milliards de dollars d'ici fin 2028 : https://www.theblock.co/post/357872/us-stablecoin-market-could-exceed-2-trillion-projection-by-end-of-2028-thinks-treasury-secretary-bessent
8. l0g, guides [Stablecoins et GENIUS Act](https://l0g.fr/guides/stablecoins-genius-act/) et [Qui applique le GENIUS Act](https://l0g.fr/guides/qui-applique-le-genius-act/).
9. l0g, [Lire les fonds monétaires](https://l0g.fr/guides/lire-les-fonds-monetaires/) et [Adjudications record : le référendum hebdomadaire sur la dette américaine](https://l0g.fr/posts/adjudications-record-referendum-dette-americaine/).
</content>
