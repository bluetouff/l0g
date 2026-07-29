---
title: "Le risque qui tourne en rond"
description: "Enquête sur le transfert synthétique de risque, la mécanique la plus élégante et la plus circulaire de la finance américaine. Une banque garde ses prêts à son bilan, mais en vend le risque à un hedge fund, souvent avec l'argent que la banque lui a elle-même prêté. Le prêt ne bouge pas, le risque semble s'évaporer, le capital est libéré. Plus de mille milliards de dollars de prêts sont déjà couverts ainsi, et la dette des data centers d'IA s'y engouffre. Anatomie d'un cercle que les régulateurs commencent à peine à voir."
pubDate: 2026-07-28T14:13:00+02:00
updatedDate: 2026-07-28T14:13:00+02:00
tags: ["international", "banques", "crédit privé", "titrisation", "risque"]
draft: false
---

*Il y a dans la finance américaine un tour de main si élégant qu'il en devient inquiétant. Une banque détient un portefeuille de prêts qu'elle préférerait ne plus porter, parce qu'il pèse sur son capital réglementaire. La solution intuitive serait de vendre ces prêts. Elle fait autre chose, de plus subtil : elle garde les prêts à son bilan, mais en vend le risque à un investisseur extérieur, un hedge fund ou un fonds de crédit privé, qui accepte d'éponger les premières pertes contre un rendement à deux chiffres. Le prêt ne bouge pas d'un centimètre. Le risque, lui, semble s'évaporer. Et le capital immobilisé derrière ce risque est soudain libéré, prêt à financer de nouveaux prêts. Cette opération s'appelle le transfert synthétique de risque, et elle a discrètement couvert plus de mille milliards de dollars de prêts bancaires. Le problème n'est pas qu'elle existe. Le problème est ce qui se passe quand on suit le risque jusqu'au bout : il revient souvent, par une porte dérobée, dans la banque qui croyait s'en être débarrassée.*

## Le tour de passe-passe

Commençons par la mécanique, car tout le reste en découle. Dans un [SRT](/glossaire/#srt), la banque conserve la propriété juridique de ses prêts, mais achète une protection contre leur défaut. Techniquement, elle procède comme une [titrisation](/glossaire/#titrisation), en découpant le portefeuille en [tranches](/glossaire/#tranche) de risque, mais sans céder les actifs : elle vend seulement une assurance sur la tranche de première perte, celle qui absorbe les défauts en premier. L'instrument le plus courant est la note indexée sur le crédit, la [CLN](/glossaire/#cln) : l'investisseur verse un capital d'avance, encaisse un coupon élevé, et récupère son capital à l'échéance, diminué des pertes éventuelles du portefeuille. Si les prêts tournent bien, il empoche un rendement à deux chiffres ; s'ils tournent mal, il perd sa mise, et la banque est indemnisée.

L'effet recherché n'est pas économique, il est réglementaire. En transférant la tranche de première perte, la banque peut démontrer à son superviseur qu'elle a cédé l'essentiel du risque de crédit du portefeuille, et donc réduire le capital qu'elle doit détenir en face. Les opérations récentes ont permis aux banques de [réduire leurs exigences de fonds propres de 43 points de base en moyenne](https://www.risk.net/risk-quantum/7963229/srt-issuance-hits-%E2%82%AC260bn-as-capital-relief-grows), un allègement considérable rapporté à des bilans de centaines de milliards. Le prêt reste au bilan, le client ne voit rien, mais le capital derrière lui est libéré. C'est le prolongement logique du bras de fer sur les fonds propres que nous avons décrit dans notre analyse du [détricotage de Bâle III](/posts/bale-iii-rollback-regulateurs-us-capital-bancaire/) : ce que la régulation exige d'un côté, l'ingénierie le reprend de l'autre.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 360" role="img" aria-label="Mécanique d'un transfert synthétique de risque : la banque garde les prêts et vend la protection de première perte" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="360" fill="#0c0d10"/>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Vendre le risque, garder le prêt</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Le prêt ne quitte jamais le bilan ; seule la protection de première perte est vendue.</text>
  <rect x="40" y="86" width="300" height="210" fill="none" stroke="#2a2c33" stroke-width="1"/>
  <text x="54" y="108" fill="#d6d9df" font-size="12" font-weight="700">Banque</text>
  <text x="54" y="126" fill="#8b909b" font-size="11">Portefeuille de prêts (reste au bilan)</text>
  <rect x="54" y="140" width="272" height="86" fill="#5eead4"/>
  <text x="66" y="170" fill="#0c0d10" font-size="12" font-weight="700">Tranche senior</text>
  <text x="66" y="188" fill="#0c0d10" font-size="11">conservée par la banque</text>
  <rect x="54" y="234" width="272" height="46" fill="#ff4d87"/>
  <text x="66" y="262" fill="#0c0d10" font-size="12" font-weight="700">Tranche première perte (protégée)</text>
  <rect x="440" y="150" width="240" height="120" fill="none" stroke="#2a2c33" stroke-width="1"/>
  <text x="454" y="176" fill="#d6d9df" font-size="12" font-weight="700">Investisseur</text>
  <text x="454" y="194" fill="#8b909b" font-size="11">hedge fund, crédit privé,</text>
  <text x="454" y="210" fill="#8b909b" font-size="11">assureur, fonds de pension</text>
  <text x="454" y="236" fill="#ff4d87" font-size="11">encaisse un rendement élevé,</text>
  <text x="454" y="252" fill="#ff4d87" font-size="11">absorbe les premières pertes</text>
  <line x1="326" y1="257" x2="440" y2="220" stroke="#ff4d87" stroke-width="2"/>
  <text x="330" y="300" fill="#ff4d87" font-size="11">protection ↗</text>
  <line x1="440" y1="240" x2="326" y2="272" stroke="#5eead4" stroke-width="2"/>
  <text x="330" y="320" fill="#5eead4" font-size="11">capital d'avance ↙</text>
  <text x="40" y="346" fill="#8b909b" font-size="10">Résultat : capital réglementaire libéré, prêts inchangés. Schéma d'après la structure standard d'un SRT.</text>
</svg>
<figcaption>La banque ne vend pas ses prêts, elle vend l'assurance de leurs premières pertes. En apparence, elle s'est délestée du risque et a libéré du capital. La question, toute l'enquête tient là, est de savoir où ce risque atterrit vraiment, et avec l'argent de qui.</figcaption>
</figure>

## Un marché sorti de l'ombre

Longtemps confidentiel, réservé à quelques banques européennes et à une poignée de fonds spécialisés, le SRT est devenu un marché de masse. L'événement déclencheur, côté américain, remonte à 2023, quand la Réserve fédérale a [reconnu les notes indexées sur le crédit comme éligibles à l'allègement de capital](https://www.philadelphiafed.org/the-economy/banking-and-financial-markets/banking-trends-synthetic-risk-transfers). Les banques américaines s'y sont engouffrées, au point de représenter désormais près de 30 % du flux mondial. L'ampleur donne le vertige : à la fin de l'an dernier, les banques avaient transféré le risque de crédit de [plus de 905 milliards d'euros, soit environ mille milliards de dollars de prêts, en hausse de 26 % sur un an](https://www.bloomberg.com/news/articles/2026-06-04/banks-offload-1-trillion-loan-risk-to-srt-investors-iacpm-says). Le pool de référence des opérations européennes a atteint un [record de 260 milliards d'euros en 2024](https://www.risk.net/risk-quantum/7963229/srt-issuance-hits-%E2%82%AC260bn-as-capital-relief-grows), et l'émission américaine est passée de 29 à 41 milliards de dollars en un an.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 300" role="img" aria-label="Croissance de l'émission américaine de transferts synthétiques de risque entre 2024 et 2025" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="300" fill="#0c0d10"/>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Le marché sort de l'ombre</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Émission américaine de SRT, en milliards de dollars.</text>
  <line x1="70" y1="230" x2="680" y2="230" stroke="#2a2c33" stroke-width="1"/>
  <rect x="150" y="150" width="140" height="80" fill="#8b909b"/>
  <text x="220" y="140" fill="#8b909b" font-size="14" font-weight="700" text-anchor="middle">29</text>
  <text x="220" y="252" fill="#d6d9df" font-size="12" text-anchor="middle">2024</text>
  <rect x="430" y="117" width="140" height="113" fill="#ff4d87"/>
  <text x="500" y="107" fill="#ff4d87" font-size="14" font-weight="700" text-anchor="middle">41</text>
  <text x="500" y="252" fill="#d6d9df" font-size="12" text-anchor="middle">2025</text>
  <text x="60" y="282" fill="#d6d9df" font-size="12">+41 % en un an. À l'échelle mondiale, plus de 1 000 milliards de dollars de prêts sont désormais couverts.</text>
  <text x="60" y="298" fill="#8b909b" font-size="10">Sources : Bloomberg (IACPM), Risk.net, Philadelphia Fed. Émission américaine annuelle.</text>
</svg>
<figcaption>En un an, l'émission américaine a bondi de plus de 40 %, et les États-Unis pèsent désormais près du tiers d'un marché mondial qui couvre plus de mille milliards de dollars de prêts. Ce qui était un outil de niche est devenu un pilier de la gestion du capital bancaire.</figcaption>
</figure>

De l'autre côté de la table, une constellation d'acheteurs s'est spécialisée. Les grands noms du crédit privé et des hedge funds, Magnetar, Ares, Apollo, Blue Owl, KKR, Blackstone, se disputent les tranches de première perte, dont les rendements cibles atteignent le milieu de la fourchette à deux chiffres. Certains ont bâti des lignes dédiées de plusieurs dizaines de milliards. En décembre 2025, Blackstone a ainsi pris la [protection de première perte sur un portefeuille de deux milliards d'euros de grands prêts corporate d'ABN AMRO](https://www.globenewswire.com/de/news-release/2025/12/11/3203635/0/en/ABN-AMRO-announces-significant-risk-transfer-transaction-with-Blackstone.html). Ces investisseurs prennent un vrai risque et encaissent de vraies pertes quand un portefeuille se dégrade ; sur ce point, le marché fonctionne comme annoncé.

## La question qui fâche : combien de risque, vraiment ?

C'est ici que l'élégance du montage commence à se fissurer. Un SRT ne transfère qu'une tranche, généralement mince, la première perte. La banque conserve la tranche senior, c'est-à-dire le risque de catastrophe : celui qui ne se matérialise que si les pertes dépassent le coussin vendu. En temps normal, ce risque de queue est négligeable, et le transfert paraît complet. En cas de choc corrélé, où de nombreux prêts font défaut en même temps, les pertes peuvent percer la tranche de première perte et remonter jusqu'à la banque, précisément au moment où elle croyait être protégée. Des chercheurs posent la question sans détour dans une note au titre éloquent, [« synthétique, mais quel transfert de risque, au juste ? »](https://www.suerf.org/publications/suerf-policy-notes-and-briefs/synthetic-but-how-much-risk-transfer/) : l'allègement de capital est immédiat et certain, la disparition du risque, elle, est partielle et conditionnelle.

S'ajoute un risque de contrepartie. La protection ne vaut que si l'investisseur peut payer. Dans les structures adossées à une note indexée, le capital est versé d'avance et immobilisé, ce qui limite ce risque ; mais dans les variantes non financées, où la protection repose sur une simple promesse contractuelle, la banque reste exposée à la défaillance de son assureur. Or ces assureurs sont des fonds à effet de levier, moins régulés que les banques, et c'est là que le montage révèle son vice caché.

## Le cercle

Voici le cœur de l'enquête, et la raison pour laquelle un investisseur attentif devrait s'inquiéter. Pour acheter ces tranches de première perte à des rendements attractifs, les fonds de crédit privé et les hedge funds utilisent de l'effet de levier, c'est-à-dire de l'argent emprunté. Et à qui empruntent-ils ? Souvent aux banques elles-mêmes. Une banque vend le risque de ses prêts à un fonds, et une autre banque, parfois la même, prête à ce fonds l'argent pour acheter cette protection. Le risque sort par la porte et rentre par la fenêtre. Le Conseil de stabilité financière a mis un nom sur ce phénomène : des [« cercles de risque »](https://www.bloomberg.com/news/articles/2025-12-08/srts-what-are-significant-risk-transfers-and-why-are-regulators-worried), où le crédit bancaire prêté aux fonds qui rachètent le risque bancaire réintroduit ce risque dans le système. Le Fonds monétaire international a consacré à ce mécanisme un document de travail au titre limpide, [« recycler le risque »](https://www.imf.org/-/media/files/publications/wp/2025/english/wpiea2025200-source-pdf.pdf).

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 320" role="img" aria-label="Le cercle du risque : la banque vend le risque à un fonds qui le finance par un prêt bancaire, si bien que le risque revient dans le système" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="320" fill="#0c0d10"/>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">Le cercle du risque</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Le risque quitte la banque, puis y revient par le levier qui finance son acheteur.</text>
  <rect x="40" y="96" width="150" height="70" fill="none" stroke="#5eead4" stroke-width="1.5"/>
  <text x="54" y="126" fill="#5eead4" font-size="12" font-weight="700">1. Banque</text>
  <text x="54" y="146" fill="#d6d9df" font-size="11">vend le risque</text>
  <rect x="230" y="96" width="150" height="70" fill="none" stroke="#f5b13d" stroke-width="1.5"/>
  <text x="244" y="126" fill="#f5b13d" font-size="12" font-weight="700">2. Fonds</text>
  <text x="244" y="146" fill="#d6d9df" font-size="11">achète la protection</text>
  <rect x="420" y="96" width="160" height="70" fill="none" stroke="#f5b13d" stroke-width="1.5"/>
  <text x="434" y="126" fill="#f5b13d" font-size="12" font-weight="700">3. Fonds</text>
  <text x="434" y="146" fill="#d6d9df" font-size="11">emprunte à effet de levier</text>
  <rect x="530" y="200" width="150" height="70" fill="none" stroke="#ff4d87" stroke-width="1.5"/>
  <text x="544" y="230" fill="#ff4d87" font-size="12" font-weight="700">4. auprès d'une</text>
  <text x="544" y="250" fill="#ff4d87" font-size="12" font-weight="700">banque</text>
  <line x1="190" y1="131" x2="230" y2="131" stroke="#8b909b" stroke-width="2"/>
  <text x="196" y="124" fill="#8b909b" font-size="14">→</text>
  <line x1="380" y1="131" x2="420" y2="131" stroke="#8b909b" stroke-width="2"/>
  <text x="386" y="124" fill="#8b909b" font-size="14">→</text>
  <line x1="500" y1="166" x2="590" y2="200" stroke="#8b909b" stroke-width="2"/>
  <line x1="530" y1="235" x2="115" y2="235" stroke="#ff4d87" stroke-width="2" stroke-dasharray="6 4"/>
  <line x1="115" y1="235" x2="115" y2="166" stroke="#ff4d87" stroke-width="2" stroke-dasharray="6 4"/>
  <text x="150" y="228" fill="#ff4d87" font-size="12" font-weight="700">le risque re-rentre dans le système bancaire</text>
  <text x="40" y="306" fill="#8b909b" font-size="10">D'après les mises en garde du FSB (« circles of risk ») et du FMI (« Recycling Risk »). Représentation schématique.</text>
</svg>
<figcaption>Le transfert est réel sur le papier, mais le financement de l'acheteur le rend partiellement circulaire. Quand la banque prête au fonds qui l'assure, elle n'a pas supprimé le risque, elle l'a déguisé et déplacé d'un cran, vers un acteur plus opaque et plus endetté. L'allègement de capital, lui, est resté bien réel.</figcaption>
</figure>

La conséquence est double. D'abord, l'allègement de capital peut être en partie illusoire : la banque affiche moins de risque, mais le système bancaire dans son ensemble en porte toujours autant, voire davantage, puisqu'il a désormais un intermédiaire à effet de levier au milieu. Ensuite, le risque a changé de régulateur : parti d'un bilan bancaire surveillé, marqué et capitalisé, il a atterri chez un fonds moins régulé, dont le levier amplifie les pertes, et que nous rangeons dans l'[intermédiation financière non bancaire](/posts/shadow-banking-intermediation-non-bancaire/). C'est la même translation que nous avons documentée pour le crédit à la consommation, [de la carte à la rente](/posts/de-la-carte-a-la-rente-qui-detient-risque-consommateur/) : le risque ne disparaît pas, il migre vers le compartiment le moins visible.

## Le nouveau carburant : la dette des data centers

Si ce marché déjà tendu inquiète soudain davantage, c'est à cause de ce qui s'y déverse. Les banques américaines ont prêté des sommes colossales pour financer la construction de centres de données destinés à l'intelligence artificielle, une dette dont nous avons décrit l'architecture dans notre enquête sur [la dette derrière l'IA](/posts/la-dette-derriere-l-ia-spv-obligations-credit-prive/). Cette exposition a enflé au point de devenir, selon une enquête de Bank of America, le [premier risque systémique de crédit cité par 48 % des gérants pour 2026](https://startupfortune.com/ai-data-center-debt-has-climbed-to-the-top-of-wall-streets-credit-risk-watchlist/). Que font les banques de ce paquet devenu trop lourd ? Elles le transfèrent. Morgan Stanley, Citi, JPMorgan et Goldman Sachs ont commencé à [refiler le risque de leurs prêts d'infrastructure IA au crédit privé, aux hedge funds et aux fonds de pension via des SRT](https://www.fortune.com/2025/12/04/morgan-stanley-significant-risk-transfer-loans-data-center-ai-infrastructure-exposure). Le responsable du partage de risque de crédit chez Man Group résume l'inquiétude d'une phrase : les montants en jeu sont « hors d'échelle avec tout ce que nous avons pu imaginer, jamais ».

Le montage devient alors doublement circulaire. Une banque prête à un développeur de data center ; elle transfère le risque de ce prêt à un fonds de crédit privé ; ce fonds est parfois le même qui finance, par ailleurs, la construction du data center ou l'entreprise d'IA qui le remplira. Le risque tourne à l'intérieur d'un cercle restreint d'acteurs qui portent, à travers des véhicules différents, les deux bouts de la même chaîne. Si le pari de l'IA déçoit, ce ne sont pas des contreparties indépendantes qui absorberont le choc, mais un petit nombre de fonds exposés partout à la fois.

## Le dernier cercle : quand le risque devient liquide

La chaîne ne s'arrête pas au fonds de crédit privé. Elle a désormais un maillon supplémentaire, peut-être le plus vertigineux, car il ramène le risque jusqu'à l'épargnant ordinaire sous une forme qui en efface toute trace : l'ETF, ce fonds indiciel coté qui s'échange en Bourse comme une action. Pour comprendre le danger, il faut d'abord comprendre comment un ETF fabrique sa liquidité, car c'est exactement là que le piège se referme.

Un ETF ne garde pas ses actifs dans un coffre figé. Sa liquidité tient à un mécanisme discret, la création-rachat de parts. Des intermédiaires agréés, les participants autorisés, peuvent à tout moment fabriquer de nouvelles parts en apportant au fonds les titres sous-jacents, ou en détruire en récupérant ces titres. Ce va-et-vient arrime le prix de la part à la valeur réelle du portefeuille : si la part s'échange trop cher, on en crée pour faire retomber le prix ; trop bon marché, on en détruit pour le soutenir. Le système est ingénieux, mais il repose tout entier sur une condition : que les titres sous-jacents, eux, s'achètent et se vendent sans friction. Tant que le sous-jacent est liquide, la part l'est aussi.

Or c'est précisément ce qui fait défaut au crédit privé. Un prêt privé ne se vend pas en une journée, souvent pas en un mois ; il n'a pas de prix de marché continu, seulement une estimation, un sujet que nous avons creusé dans notre analyse d'[un actif à deux prix](/posts/credit-prive-un-actif-deux-prix/). Emballer de tels actifs dans un ETF revient à promettre une liquidité quotidienne sur des actifs qui n'en ont aucune. Le mécanisme de création-rachat se grippe dès que trop de porteurs veulent sortir en même temps : les participants autorisés ne peuvent pas liquider assez vite le sous-jacent, la part décroche de sa valeur théorique, et la porte de sortie, large en apparence, se révèle étroite. C'est un transfert de risque d'un genre nouveau, non plus de crédit mais de liquidité, et il est plus insidieux parce qu'il paraît indolore tant que les flux entrent. Les ETF obligataires ont, il est vrai, traversé le choc de mars 2020 sans se rompre, leur décote se résorbant ensuite ; mais ils détenaient des obligations cotées, pas des prêts privés dépourvus de prix.

Ce n'est pas une hypothèse d'école. Le premier ETF de crédit privé de grande diffusion a été [lancé fin février 2025 par State Street avec Apollo](https://www.cnbc.com/2025/02/27/state-street-apollo-team-up-to-launch-first-of-its-kind-private-credit-etf.html). Pour tenir sa promesse de liquidité, il a été autorisé à détenir [entre 10 et 35 % d'actifs privés, bien au-delà de la limite habituelle de 15 % d'illiquide dans un ETF, grâce à un accord par lequel Apollo s'engage à racheter ces actifs, ce qui a aussitôt inquiété la SEC](https://www.wealthmanagement.com/etfs/state-street-apollo-s-private-credit-etf-raises-sec-concern). Le régulateur a posé la seule question qui compte : si un unique acteur, Apollo, fournit la liquidité en rachetant des actifs qu'il a lui-même originés, à quel prix le fera-t-il, et que se passe-t-il le jour où il cesse d'acheter ? La liquidité promise ne repose alors plus sur un marché profond, mais sur la bonne volonté d'une seule contrepartie, en situation de conflit d'intérêts.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 720 300" role="img" aria-label="L'illusion de liquidité d'un ETF de crédit privé : une part liquide posée sur un sous-jacent illiquide" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:ui-monospace,monospace">
  <rect width="720" height="300" fill="#0c0d10"/>
  <text x="32" y="38" fill="#f5f6f8" font-size="17" font-weight="700">L'illusion de liquidité</text>
  <text x="32" y="59" fill="#8b909b" font-size="12">Une part d'ETF liquide, posée sur un crédit privé qui ne l'est pas.</text>
  <rect x="110" y="86" width="500" height="48" fill="#5eead4"/>
  <text x="360" y="115" fill="#0c0d10" font-size="12" font-weight="700" text-anchor="middle">Part d'ETF : cotée en continu, paraît liquide</text>
  <rect x="345" y="134" width="30" height="46" fill="#f5b13d"/>
  <text x="392" y="161" fill="#f5b13d" font-size="11">liquidité = promesse d'un seul acteur</text>
  <rect x="110" y="180" width="500" height="48" fill="#ff4d87"/>
  <text x="360" y="209" fill="#0c0d10" font-size="12" font-weight="700" text-anchor="middle">Crédit privé (10 à 35 %) : illiquide, sans prix continu</text>
  <text x="60" y="258" fill="#d6d9df" font-size="12">En calme, prix ≈ valeur. Dans la ruée, la porte se rétrécit et la part décote sous sa valeur.</text>
  <text x="60" y="286" fill="#8b909b" font-size="10">Sources : SEC, CNBC, WealthManagement. Cas de l'ETF PRIV (State Street / Apollo, 2025). Schéma.</text>
</svg>
<figcaption>L'ETF promet une sortie immédiate sur un contenu qui ne se vend pas vite. Entre la part liquide et le crédit illiquide, un seul pont : l'engagement d'un acteur à racheter. Quand la ruée arrive, c'est ce pont qui cède en premier, et la liquidité promise s'évanouit au moment où l'on en a le plus besoin.</figcaption>
</figure>

Voilà le point à retenir, et il porte bien au-delà de ce fonds précis. Dans ces enveloppes, la liquidité n'est pas une propriété des actifs, c'est une promesse faite par une contrepartie. Et une promesse ne vaut que tant que celui qui la fait a intérêt à la tenir. Or cet intérêt s'évapore exactement quand on en aurait besoin, au moment où tout le monde veut vendre. Le voyage du risque, que nous avions suivi jusqu'à la rente d'un retraité [de la carte à la rente](/posts/de-la-carte-a-la-rente-qui-detient-risque-consommateur/), s'achève désormais parfois dans un compte-titres de particulier, dans un instrument qui a l'apparence d'une action et la substance d'un prêt illiquide. L'épargnant croit détenir de la liquidité ; il détient en réalité le dernier maillon d'une chaîne qui a commencé par un prêt qu'une banque jugeait trop lourd à garder.

## L'autre lecture : un outil légitime, pas une bombe

Il serait malhonnête de peindre le SRT en pur artifice, car l'instrument a des vertus réelles, et les régulateurs eux-mêmes ne l'ont pas interdit. Le premier argument en sa faveur est qu'il réalise un vrai partage de risque. Une banque très concentrée sur un secteur, l'immobilier commercial, l'IA, le crédit à effet de levier, peut, grâce au SRT, redistribuer cette concentration vers des investisseurs de long terme, assureurs et fonds de pension, qui cherchent précisément ce rendement et détiennent leurs positions jusqu'à l'échéance. Vu ainsi, le SRT rend le système plus résilient, pas moins, en dispersant un risque autrement logé dans quelques bilans.

Le deuxième argument est que ces opérations sont bilatérales, documentées et connues du superviseur, à la différence des dérivés opaques d'avant 2008. Le comité de Bâle a publié en février 2026 un [rapport détaillé sur ces marchés](https://www.jonesday.com/en/insights/2026/03/basel-committee-publishes-report-on-synthetic-risk-transfer-markets), signe que les autorités les suivent de près plutôt que de les découvrir après coup. Sa conclusion n'est pas l'interdiction, mais un durcissement de la surveillance, d'éventuelles limites à l'allègement de capital et une meilleure coordination entre superviseurs bancaires et non bancaires. Le troisième argument, défendu par les fonds acheteurs, est qu'interdire le levier sur ces opérations reviendrait à tarir un financement utile à l'économie, sans supprimer le risque sous-jacent. La tranche de première perte trouve des acheteurs sophistiqués qui savent ce qu'ils achètent, et ce marché a jusqu'ici absorbé ses pertes sans incident systémique.

## Le point où le cercle se referme

Ces contrepoints tiennent en temps calme. Ils disent tous la même chose : tant que les pertes restent dans l'épaisseur de la tranche vendue, tant que les fonds acheteurs peuvent payer, tant que le levier reste maîtrisé, le SRT est un outil de gestion prudente. Le problème est que ces trois conditions se dégradent ensemble, et précisément au mauvais moment. Un choc corrélé, sur la dette IA par exemple, ferait trois choses à la fois : il percerait les tranches de première perte et renverrait des pertes vers les banques ; il éprouverait la capacité des fonds à effet de levier à honorer leur protection ; et il pousserait les banques prêteuses à couper les lignes de levier de ces mêmes fonds, tarissant le marché au moment où il faudrait qu'il fonctionne. Les trois filets se déchireraient en même temps.

C'est pourquoi cette mécanique mérite d'être lue non comme une fraude, mais comme une optimisation à la couture entre le régulé et le non-régulé, là où le risque n'est pas supprimé mais réétiqueté. L'investisseur qui contemple le capital libéré d'une banque américaine ne devrait pas se demander « où le risque est-il parti », mais « qui le détient désormais, et est-ce la banque qui lui a prêté l'argent pour le détenir ». La réponse, de plus en plus, dessine un cercle. Et un cercle, en finance, a une propriété désagréable : il n'a pas de bout par lequel on puisse le tenir quand tout se met à tourner dans le mauvais sens. Pour juger la solidité réelle d'une banque, il faut désormais lire ce qu'elle a transféré autant que ce qu'elle détient, un exercice que notre guide sur [la solidité d'une banque](/guides/lire-la-solidite-d-une-banque/) n'épuise plus à lui seul. Le risque qui tourne en rond finit toujours par revenir à son point de départ.

---

### Sources

- [Bloomberg, « Banks Offload $1 Trillion Loan Risk to SRT Investors, IACPM Says », 4 juin 2026 (encours couvert > 905 Md€ / ~1 000 Md$, +26 % sur un an)](https://www.bloomberg.com/news/articles/2026-06-04/banks-offload-1-trillion-loan-risk-to-srt-investors-iacpm-says)
- [Bloomberg, « Banks Love Significant Risk Transfers, and That Has Regulators Worried », 8 décembre 2025 (mise en garde du FSB sur les « cercles de risque »)](https://www.bloomberg.com/news/articles/2025-12-08/srts-what-are-significant-risk-transfers-and-why-are-regulators-worried)
- [Risk.net, « SRT issuance hits €260bn as capital relief grows » (pool de référence record en 2024, allègement de capital de 43 points de base en moyenne)](https://www.risk.net/risk-quantum/7963229/srt-issuance-hits-%E2%82%AC260bn-as-capital-relief-grows)
- [Philadelphia Fed, « Banking Trends: Synthetic Risk Transfers » (guidance de la Fed 2023 sur les notes indexées, mécanique et essor)](https://www.philadelphiafed.org/the-economy/banking-and-financial-markets/banking-trends-synthetic-risk-transfers)
- [Comité de Bâle, rapport sur les marchés du transfert synthétique de risque, février 2026 (synthèse Jones Day : surveillance, limites possibles au capital relief)](https://www.jonesday.com/en/insights/2026/03/basel-committee-publishes-report-on-synthetic-risk-transfer-markets)
- [FMI, « Recycling Risk: Synthetic Risk Transfers », document de travail 2025/200 (circularité et recyclage du risque)](https://www.imf.org/-/media/files/publications/wp/2025/english/wpiea2025200-source-pdf.pdf)
- [SUERF, « Synthetic, but how much risk transfer? » (part du risque réellement transférée, risque de queue conservé)](https://www.suerf.org/publications/suerf-policy-notes-and-briefs/synthetic-but-how-much-risk-transfer/)
- [Fortune, « Morgan Stanley explores significant risk transfer for data center and AI infrastructure exposure », 4 décembre 2025](https://www.fortune.com/2025/12/04/morgan-stanley-significant-risk-transfer-loans-data-center-ai-infrastructure-exposure)
- [Startup Fortune, « AI data center debt has climbed to the top of Wall Street's credit risk watchlist » (premier risque systémique cité par 48 % des gérants BofA)](https://startupfortune.com/ai-data-center-debt-has-climbed-to-the-top-of-wall-streets-credit-risk-watchlist/)
- [ABN AMRO, « ABN AMRO announces significant risk transfer transaction with Blackstone », 11 décembre 2025 (protection de première perte sur 2 Md€ de prêts corporate)](https://www.globenewswire.com/de/news-release/2025/12/11/3203635/0/en/ABN-AMRO-announces-significant-risk-transfer-transaction-with-Blackstone.html)
- [CNBC, « State Street, Apollo team up to launch first of its kind private credit ETF », 27 février 2025 (lancement de l'ETF PRIV)](https://www.cnbc.com/2025/02/27/state-street-apollo-team-up-to-launch-first-of-its-kind-private-credit-etf.html)
- [WealthManagement, « State Street, Apollo's Private Credit ETF Raises SEC Concern » (10 à 35 % d'actifs privés, Apollo fournisseur unique de liquidité, inquiétudes de la SEC sur valorisation et liquidité)](https://www.wealthmanagement.com/etfs/state-street-apollo-s-private-credit-etf-raises-sec-concern)
