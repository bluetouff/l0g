---
title: "De la carte à la rente"
description: "Quand un emprunteur subprime cesse de payer sa voiture dans l'Ohio, la perte n'atterrit pas sur le bilan d'une banque. Elle voyage. Découpée en tranches, titrisée, elle finit des mois plus tard sur le bilan d'un assureur, adossée à la rente d'un retraité qui n'a jamais acheté de crédit auto. Le risque du consommateur américain n'a pas disparu des banques, il a changé d'adresse, et sa nouvelle adresse est la moins surveillée de toutes. Anatomie d'un voyage."
pubDate: 2026-07-27T21:34:00+02:00
updatedDate: 2026-07-27T21:34:00+02:00
tags: ["international", "crédit privé", "titrisation", "états-unis", "risque"]
draft: false
---

*Un ménage cesse de rembourser son crédit auto quelque part dans le Midwest. La scène est banale, et nous avons montré [ailleurs](/posts/fissure-consommateur-americain-economie-en-k/) à quel point elle se répète, l'impayé subprime automobile étant au plus haut depuis les années 1990. La question qui reste ouverte n'est pas de savoir si le consommateur américain craque, c'est de savoir qui encaisse la perte quand il craque. La réponse est contre-intuitive : presque jamais la banque qui a prêté. Le risque a été découpé, emballé, revendu, et il poursuit un voyage qui le mène, de tranche en tranche, jusqu'au bilan d'un assureur et à la rente d'un retraité. Ce trajet est l'histoire la plus importante et la moins racontée du crédit à la consommation.*

Le point de départ est un malentendu répandu. On imagine que le prêteur subprime porte le risque de ses prêts, comme une banque de dépôt classique. C'est faux. Les [prêteurs spécialisés ne gardent pas ces crédits à leur bilan : ils les titrisent en ABS et en vendent les tranches à des investisseurs institutionnels du monde entier](https://wolfstreet.com/2026/05/19/auto-loan-balances-debt-to-income-ratio-and-delinquencies-of-subprime-prime-auto-loans-in-q1-2026-how-bad-is-it/), fonds obligataires et fonds de pension en tête. L'originateur encaisse une commission et se débarrasse du risque presque aussitôt. Comprendre où va ce risque suppose de suivre la chaîne, maillon par maillon.

## La cascade de titrisation

Le premier maillon est mécanique. Les créances, prêts auto, soldes de cartes ou paiements fractionnés, sont regroupées dans un trust isolé de la faillite de l'originateur, qui émet des titres adossés à ces actifs, l'[ABS](/glossaire/#abs). Ces titres sont découpés en [tranches](/glossaire/#tranche) hiérarchisées, exactement comme dans les [CLO que décrit notre guide](/guides/lire-les-clo-et-prets-a-effet-de-levier/). La tranche senior, notée AAA, est payée en premier et n'absorbe les pertes qu'en dernier ; la tranche equity, tout en bas, encaisse les premières défaillances contre le rendement le plus élevé. Entre les deux, des tranches mezzanine. La règle est simple : quand un emprunteur fait défaut, la perte remonte du bas vers le haut, et la tranche equity est conçue pour être laminée la première afin de protéger les investisseurs seniors.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 340" role="img" aria-label="La cascade des tranches d'une titrisation de crédit à la consommation et leurs détenteurs" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="340" fill="#0c0d10"/>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Qui tient quelle tranche</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Cascade d'un ABS de crédit conso : les pertes montent du bas, les paiements descendent du haut.</text>
  <rect x="60" y="82" width="420" height="46" fill="#5eead4"/>
  <text x="72" y="104" fill="#0c0d10" font-size="13" font-weight="700">Tranche senior AAA</text>
  <text x="72" y="120" fill="#0c0d10" font-size="11">payée en premier, protégée</text>
  <text x="500" y="110" fill="#5eead4" font-size="12">banques, fonds monétaires, fonds de pension</text>
  <rect x="60" y="136" width="420" height="46" fill="#7aa2f7"/>
  <text x="72" y="158" fill="#0c0d10" font-size="13" font-weight="700">Tranches mezzanine</text>
  <text x="72" y="174" fill="#0c0d10" font-size="11">rendement intermédiaire</text>
  <text x="500" y="164" fill="#7aa2f7" font-size="12">fonds de crédit, crédit privé</text>
  <rect x="60" y="190" width="420" height="46" fill="#ff4d87"/>
  <text x="72" y="212" fill="#0c0d10" font-size="13" font-weight="700">Tranche equity</text>
  <text x="72" y="228" fill="#0c0d10" font-size="11">absorbe les premières pertes</text>
  <text x="500" y="218" fill="#ff4d87" font-size="12">crédit privé, hedge funds, originateur</text>
  <text x="60" y="266" fill="#8b909b" font-size="12" font-weight="700">Pertes ↑</text>
  <text x="120" y="266" fill="#d6d9df" font-size="12">de l'equity vers le senior</text>
  <text x="360" y="266" fill="#8b909b" font-size="12" font-weight="700">Paiements ↓</text>
  <text x="450" y="266" fill="#d6d9df" font-size="12">du senior vers l'equity</text>
  <text x="60" y="296" fill="#d6d9df" font-size="12">La subordination protège le AAA. Le risque réel se loge dans le bas de la cascade,</text>
  <text x="60" y="314" fill="#d6d9df" font-size="12">de plus en plus détenu par le crédit privé.</text>
  <text x="60" y="332" fill="#8b909b" font-size="10">Représentation schématique d'après la structure standard d'un ABS de consommation.</text>
</svg>
<figcaption>La cascade disperse le risque, mais elle le hiérarchise aussi. Le AAA que détiennent banques et fonds de pension est protégé par tout ce qui se trouve en dessous ; le bas de la structure, où se concentre le vrai risque de défaut, part chez des acteurs moins régulés. Suivre le risque, c'est suivre ces tranches basses.</figcaption>
</figure>

Cette dispersion a une conséquence rassurante et une conséquence trompeuse, et il faut tenir les deux. La rassurante : le AAA repose sur un matelas de subordination, et il faudrait des pertes massives pour l'atteindre. La trompeuse : le risque n'a pas disparu, il s'est concentré dans les tranches basses, et ces tranches ont trouvé un acheteur avide.

## Le nouvel acheteur : le crédit privé

Cet acheteur est le crédit privé, et son appétit a changé la nature du marché. Les grands gérants d'actifs alternatifs, [Apollo en tête avec plus de 1 000 milliards de dollars d'encours au premier trimestre 2026](https://hedgeco.net/news/05/2026/apollo-tops-1-trillion-in-aum-and-moves-toward-daily-private-credit-pricing.html) et les principales firmes de crédit privé pesant ensemble plus de 3 400 milliards, se sont rués sur la [finance adossée aux actifs](/glossaire/#abf), ce compartiment qui titrise les créances de la vie quotidienne. Ils n'achètent plus seulement les tranches, ils s'installent sur toute la chaîne. KKR a signé un accord de flux à terme de six milliards d'euros avec PayPal pour financer directement son paiement fractionné, et lancé la [première titrisation de BNPL en Europe](https://www.globalcapital.com/securitization/article/2glwbsgv45m3zp0dn5k3k/securitization/abs-europe/kkrs-debut-lays-foundation-for-bnpl-abs-asset-class-in-europe) ; la plateforme Pagaya a émis environ 300 millions de dollars de titres adossés à des prêts Klarna, arrangés avec le concours d'Apollo ; Affirm a bouclé plus d'une douzaine d'opérations d'ABS sur ses prêts au point de vente.

Le glissement est capital. Par ces accords de flux à terme, le crédit privé ne se contente plus de racheter le risque une fois créé, il finance l'origine du prêt. Autrement dit, la quête de rendement des fonds alimente directement l'expansion du crédit subprime que nous décrivions du côté de l'emprunteur, ces plafonds de cartes relevés et ce paiement fractionné qui prolifère. Celui qui portera la perte est aussi celui qui a fourni les munitions. Cette circularité, le crédit privé qui prête pour titriser ce qu'il détiendra, est le trait le plus neuf et le moins commenté du cycle.

## Le dernier maillon : la rente

Reste à savoir où le voyage s'achève, et la réponse referme la boucle de façon troublante. Le crédit privé ne détient pas ces actifs pour son propre compte : il les loge en grande partie dans les bilans des assureurs qu'il contrôle. Apollo recycle les primes de son affilié Athene dans le crédit privé et la finance adossée aux actifs ; l'ensemble du secteur suit le mouvement, les [placements des assureurs-vie américains en crédit privé ayant atteint 849 milliards de dollars en 2024, plus du double de leur niveau de 2014](https://www.americanbanker.com/news/is-private-credit-a-2-trillion-dollar-insurance-timebomb). Ces assureurs cherchent du rendement long pour adosser leurs engagements de rente, et une part croissante passe par des structures de réassurance offshore, souvent bermudiennes, dont nous avons décrit l'opacité dans notre enquête sur les [assureurs-vie et le crédit privé aux Bermudes](/posts/assureurs-vie-epargne-retraite-credit-prive-bermudes/).

Le trajet est donc complet. Parti du tableau de bord d'une voiture d'occasion financée à taux élevé, le risque a traversé un trust de titrisation, une tranche mezzanine, un fonds de crédit privé, une captive de réassurance, pour se déposer enfin sous la rente d'un retraité qui, lui, n'a jamais approché un prêt subprime. De la carte de crédit à la rente, le risque a changé cinq fois de mains sans jamais quitter le système, et à chaque étape il est devenu un peu plus difficile à voir.

## L'autre lecture : la dispersion est une force

Avant de crier au prochain 2008, il faut accorder à ce montage ce qu'il a de solide, car l'analogie subprime est trompeuse. Plusieurs contrepoints tiennent.

D'abord, la dispersion est précisément ce qui a manqué en 2008. Le risque hypothécaire d'alors était concentré, corrélé et logé dans des banques à fort levier qui devaient vendre en catastrophe. Ici, le crédit à la consommation est réparti en petites tranches chez des centaines d'investisseurs, et l'ABS de consommation est une classe d'actifs ancienne, éprouvée, qui a mieux résisté à la crise que les CDO immobiliers. Ensuite, l'adossement fait sens : un assureur qui doit servir des rentes sur trente ans a une bonne raison de détenir des actifs longs et peu liquides qu'il compte garder jusqu'à l'échéance, sans jamais être forcé de vendre. Un détenteur qui ne vend pas ne propage pas de panique. Enfin, la subordination fonctionne : tant que les pertes restent dans l'épaisseur des tranches basses, le AAA des fonds de pension ne bouge pas, et c'est bien à cela qu'il sert.

## Mais la dispersion cache une re-concentration

L'antithèse a toutefois ses limites, et elles sont sérieuses. Le premier angle mort est que la dispersion apparente masque une re-concentration réelle. Le risque quitte des milliers de banques pour se rassembler chez une poignée de méga-gérants qui, désormais, originent, structurent, détiennent et assurent le même actif : la diversification entre investisseurs se double d'une concentration entre firmes. Le deuxième est la valorisation : logés dans des fonds de crédit privé, ces actifs sont marqués au modèle, souvent proches du pair, et non au prix de marché, ce qui retarde la reconnaissance des pertes, un problème que nous avons creusé dans notre analyse d'[un actif à deux prix](/posts/credit-prive-un-actif-deux-prix/). Le troisième est le financement : les accords de flux à terme et les lignes d'entrepôt qui alimentent l'origine peuvent être coupés en cas de stress, tarissant brutalement le crédit là où il est le plus fragile. Le quatrième, le plus dérangeant, est identitaire : le porteur final du risque est un rentier, via un montage offshore qu'il ne comprend pas et qu'aucun superviseur d'État ne surveille pleinement.

La conclusion n'est donc ni l'alarme ni le soulagement, mais un déplacement du regard. Le risque du consommateur américain n'a pas grossi en changeant d'adresse, mais il est devenu plus opaque, plus concentré chez ses gestionnaires et plus lent à se révéler. La vraie question, une fois établie la fragilité de l'emprunteur, n'est pas de savoir si le système bancaire tremblera, il ne détient presque plus ce risque, mais de savoir ce qui se passera le jour où un rentier découvrira que sa retraite reposait, à travers cinq intermédiaires, sur la ponctualité d'un inconnu remboursant sa voiture. Le risque a quitté la lumière des bilans bancaires pour l'ombre du crédit privé. Il n'a pas disparu. Il attend juste ailleurs, là où personne ne regarde.

---

### Sources

- [Wolf Street, « Auto Loan Balances, Debt-to-Income Ratio, and Delinquencies of Subprime & Prime Auto Loans in Q1 2026 » (les prêteurs spécialisés titrisent le subprime auto en ABS vendus aux investisseurs ; impayés prime 1,9 %, subprime 60 jours à 6,90 %)](https://wolfstreet.com/2026/05/19/auto-loan-balances-debt-to-income-ratio-and-delinquencies-of-subprime-prime-auto-loans-in-q1-2026-how-bad-is-it/)
- [GlobalCapital, « KKR's debut lays foundation for BNPL ABS asset class in Europe » (flux à terme de 6 Md€ avec PayPal, première titrisation BNPL en Europe)](https://www.globalcapital.com/securitization/article/2glwbsgv45m3zp0dn5k3k/securitization/abs-europe/kkrs-debut-lays-foundation-for-bnpl-abs-asset-class-in-europe)
- [HedgeCo, « Apollo Tops $1 Trillion in AUM and Moves Toward Daily Private Credit Pricing », mai 2026 (Apollo > 1 000 Md$, Athene, finance adossée aux actifs)](https://hedgeco.net/news/05/2026/apollo-tops-1-trillion-in-aum-and-moves-toward-daily-private-credit-pricing.html)
- [American Banker, « Is private credit a $2 trillion-dollar insurance timebomb? » (crédit privé des assureurs-vie à 849 Md$ en 2024, plus du double de 2014 ; réassurance offshore)](https://www.americanbanker.com/news/is-private-credit-a-2-trillion-dollar-insurance-timebomb)
