---
title: "Lire le H.4.1 : le bilan de la Fed, ligne par ligne"
description: "Actif, réserves bancaires, compte du Trésor, reverse repos et pertes : une méthode pour lire le bilan de la Fed, avec un exemple chiffré et deux schémas."
pubDate: 2026-06-28T17:30:00+02:00
updatedDate: 2026-11-11T12:00:00+01:00
tags: ["macro", "banques centrales", "liquidité", "méthodologie"]
category: fed
summary: "Le H.4.1 publie les comptes des douze banques de réserve fédérale. Le tableau 5 présente leur bilan consolidé du mercredi ; le tableau 1 rapproche les facteurs affectant les réserves, en moyennes hebdomadaires et en niveaux du mercredi. Une lecture rigoureuse distingue les deux conventions, reconstitue l'identité actif = passif + capital, puis rapproche les mouvements des instructions de politique monétaire."
draft: false
---

Un bilan de banque centrale relie les actifs qu'elle détient aux formes de monnaie et aux autres engagements émis en contrepartie. Pour la Réserve fédérale américaine, le document de départ est le **H.4.1**, publié en principe le jeudi à **16 h 30, heure de New York**, avec les aménagements indiqués dans le [calendrier officiel](https://www.federalreserve.gov/releases/h41/).

Les réserves des banques sont une dette de la Fed envers ces établissements. Elles ne représentent ni leurs fonds propres, ni les dépôts des ménages. Leur montant peut augmenter alors que le portefeuille de titres diminue, si d'autres postes du passif se contractent davantage. Le [guide officiel de la Fed](https://www.federalreserve.gov/monetarypolicy/bst_fedsbalancesheet.htm) explique cette architecture.

**Point de contrôle au 11 novembre 2026 :** l'exemple utilise le [relevé du 5 novembre](https://www.federalreserve.gov/releases/h41/20261105/), consacré notamment aux niveaux du mercredi 4 novembre. C'est le dernier relevé recensé dans le calendrier lors de cette révision. Les chiffres restent attachés à cette date et ne constituent pas un compteur en temps réel.

## Trouver le bon tableau et la bonne colonne

Le H.4.1 consolide les comptes des **douze banques de réserve**, avec élimination des opérations internes. Le [descriptif de la publication](https://www.federalreserve.gov/releases/h41/about.htm) précise ce périmètre. Le système américain comprend donc lui aussi plusieurs bilans régionaux ; le tableau consolidé évite de compter leurs relations internes comme des créances sur le reste de l'économie.

| Question de lecture | Tableau | Contrôle indispensable |
| --- | --- | --- |
| Quelle est la taille du bilan ? | 5, bilan consolidé | Niveau du mercredi, actif total et passif plus capital. |
| Pourquoi les réserves ont-elles changé ? | 1, facteurs affectant les réserves | Moyenne hebdomadaire ou mercredi ; conserver la même colonne. |
| Quelles échéances restent en portefeuille ? | 2, distribution des maturités | Échéance résiduelle et convention de valorisation. |
| Quels titres sont conservés pour des clients ? | 1A, postes pour mémoire | Distinguer la conservation des actifs propres. |
| Comment les comptes se répartissent-ils entre régions ? | 6, banques de réserve | Éliminer les relations internes avant d'agréger. |

Le **tableau 1 n'est pas le bilan consolidé**. Il intègre aussi des postes du Trésor qui affectent l'offre de réserves. Son total des facteurs apportant des réserves ne doit donc pas remplacer l'actif total du tableau 5. La [notice de la Fed](https://www.federalreserve.gov/monetarypolicy/bst_fedsbalancesheet.htm) explicite cette différence.

La source est exprimée en **millions de dollars**. Dans ce guide, les montants sont divisés par **1 000** pour obtenir des milliards. Une moyenne quotidienne sur la semaine et une observation du mercredi restent deux mesures différentes après conversion.

## L'actif : titres, prêts et autres créances

Les titres détenus ferme constituent le bloc principal : titres du Trésor, dette d'agences fédérales et **MBS**, titres adossés à des créances hypothécaires garantis par Fannie Mae, Freddie Mac ou Ginnie Mae. La ligne des MBS se réduit notamment lorsque le principal est remboursé. Les notes du [relevé du 5 novembre](https://www.federalreserve.gov/releases/h41/20261105/) décrivent les conventions applicables.

Un **repo**, ou prise en pension du point de vue de la Fed, apporte temporairement des fonds contre des titres avec engagement de dénouement. Il apparaît à l'actif, tout comme les prêts au guichet de l'escompte. Les swaps de liquidité avec des banques centrales étrangères figurent sur une autre ligne. Achat durable d'un titre, financement garanti à court terme et apport de dollars à une banque centrale partenaire répondent à des mécanismes différents. La [New York Fed détaille les pensions](https://www.newyorkfed.org/markets/domestic-market-operations/monetary-policy-implementation/repo-reverse-repo-agreements).

Les **primes et décotes non amorties** correspondent à la part de l’écart entre prix d’achat et valeur faciale qui reste à répartir sur la durée du titre. Elles ajustent la valeur comptable des titres et sont présentées séparément dans le [relevé](https://www.federalreserve.gov/releases/h41/20261105/).

Au **4 novembre 2026**, le tableau 5 donne le rapprochement suivant. Le poste résiduel regroupe les autres actifs ; il ne représente pas une facilité particulière.

| Actifs | Milliards de dollars |
| --- | ---: |
| Titres du Trésor, compensation d'inflation comprise | 4 578,777 |
| MBS | 1 883,522 |
| Dette d'agences | 2,347 |
| Primes et décotes non amorties, solde net | 180,455 |
| Prêts | 9,234 |
| Autres actifs, calculés par différence | 93,810 |
| **Actif total** | **6 748,145** |

Source : [H.4.1 du 5 novembre 2026, tableau 5, colonne du mercredi](https://www.federalreserve.gov/releases/h41/20261105/). Le solde net des primes et décotes est **206,934 − 26,479 = 180,455 milliards**. Les autres actifs sont le total diminué des cinq blocs précédents.

<figure class="central-bank-figure" style="padding-bottom:1rem">
<div class="cb-wide">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 574" role="img" lang="fr" aria-labelledby="cb-fed-ledger-fr-d-title cb-fed-ledger-fr-d-desc" style="width:100%;height:auto;display:block;font-family:var(--font-read, Arial, sans-serif)">
<title id="cb-fed-ledger-fr-d-title">Les deux faces du bilan</title><desc id="cb-fed-ledger-fr-d-desc">Structure simplifiée du bilan de la Fed. À l’actif : titres, prêts et autres créances. Au passif : réserves bancaires, billets, compte du Trésor et reverse repos. Le capital complète l’identité comptable. Les surfaces n’indiquent aucun montant.</desc>
<rect x="0" y="0" width="800" height="574" rx="0" fill="var(--color-ink, #0c0d10)"/>
<line x1="32" y1="12" x2="768" y2="12" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1"/>
<text x="32" y="37" fill="var(--color-muted, #8b909b)" font-size="14" font-weight="400" text-anchor="start"><tspan x="32" dy="0">l0g / COMPTABILITÉ MONÉTAIRE</tspan></text>
<text x="768" y="37" fill="var(--color-signal, #5eead4)" font-size="14" font-weight="400" text-anchor="end"><tspan x="768" dy="0">01</tspan></text>
<text x="32" y="78" fill="var(--color-paper, #e7e9ee)" font-size="29" font-weight="500" text-anchor="start"><tspan x="32" dy="0">Les deux faces du bilan</tspan></text>
<text x="32" y="111" fill="var(--color-muted, #8b909b)" font-size="16" font-weight="400" text-anchor="start"><tspan x="32" dy="0">Fed · schéma sans échelle</tspan></text>
<path d="M40 163 Q215 143 392 163 L392 451 Q215 431 40 451 Z" fill="var(--color-surface, #121419)" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M408 163 Q585 143 760 163 L760 451 Q585 431 408 451 Z" fill="var(--color-surface, #121419)" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
<line x1="400" y1="165" x2="400" y2="452" stroke="var(--color-muted, #8b909b)" stroke-width="1"/>
<text x="63" y="194" fill="var(--color-signal, #5eead4)" font-size="15" font-weight="400" text-anchor="start"><tspan x="63" dy="0">ACTIF</tspan></text>
<text x="431" y="194" fill="var(--color-amber, #f5b13d)" font-size="15" font-weight="400" text-anchor="start"><tspan x="431" dy="0">PASSIF + CAPITAL</tspan></text>
<line x1="64" y1="214" x2="366" y2="214" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1"/>
<line x1="64" y1="288" x2="366" y2="288" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1"/>
<line x1="64" y1="362" x2="366" y2="362" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1"/>
<line x1="432" y1="214" x2="735" y2="214" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1"/>
<line x1="432" y1="258" x2="735" y2="258" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1"/>
<line x1="432" y1="302" x2="735" y2="302" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1"/>
<line x1="432" y1="346" x2="735" y2="346" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1"/>
<line x1="432" y1="390" x2="735" y2="390" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1"/>
<rect x="75" y="230" width="26" height="35" rx="0" fill="var(--color-ink, #0c0d10)" stroke="var(--color-signal, #5eead4)" stroke-width="1"/><rect x="69" y="235" width="26" height="35" rx="0" fill="var(--color-ink, #0c0d10)" stroke="var(--color-signal, #5eead4)" stroke-width="1"/><line x1="75" y1="247" x2="89" y2="247" stroke="var(--color-signal, #5eead4)" stroke-width="1"/><line x1="75" y1="254" x2="89" y2="254" stroke="var(--color-signal, #5eead4)" stroke-width="1"/>
<text x="120" y="246" fill="var(--color-paper, #e7e9ee)" font-size="20" font-weight="400" text-anchor="start"><tspan x="120" dy="0">Titres détenus</tspan></text>
<text x="120" y="271" fill="var(--color-muted, #8b909b)" font-size="16" font-weight="400" text-anchor="start"><tspan x="120" dy="0">Treasuries, MBS</tspan></text>
<path d="M70 314 L97 314 L97 338 L70 338 Z M76 308 L91 308" fill="none" stroke="var(--color-signal, #5eead4)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
<text x="120" y="321" fill="var(--color-paper, #e7e9ee)" font-size="20" font-weight="400" text-anchor="start"><tspan x="120" dy="0">Repos et prêts</tspan></text>
<text x="120" y="346" fill="var(--color-muted, #8b909b)" font-size="16" font-weight="400" text-anchor="start"><tspan x="120" dy="0">Créances sur les emprunteurs</tspan></text>
<path d="M70 394 L100 394 M94 388 L100 394 L94 400 M100 410 L70 410 M76 404 L70 410 L76 416" fill="none" stroke="var(--color-signal, #5eead4)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
<text x="120" y="396" fill="var(--color-paper, #e7e9ee)" font-size="20" font-weight="400" text-anchor="start"><tspan x="120" dy="0">Swaps, autres actifs</tspan></text>
<text x="120" y="421" fill="var(--color-muted, #8b909b)" font-size="16" font-weight="400" text-anchor="start"><tspan x="120" dy="0">Rubriques regroupées</tspan></text>
<circle cx="440" cy="237" r="3" fill="var(--color-signal, #5eead4)" stroke="var(--color-signal, #5eead4)" stroke-width="1"/>
<text x="454" y="243" fill="var(--color-signal, #5eead4)" font-size="18" font-weight="400" text-anchor="start"><tspan x="454" dy="0">Réserves des banques</tspan></text>
<circle cx="440" cy="281" r="3" fill="var(--color-paper, #e7e9ee)" stroke="var(--color-paper, #e7e9ee)" stroke-width="1"/>
<text x="454" y="287" fill="var(--color-paper, #e7e9ee)" font-size="18" font-weight="400" text-anchor="start"><tspan x="454" dy="0">Billets en circulation</tspan></text>
<circle cx="440" cy="325" r="3" fill="var(--color-amber, #f5b13d)" stroke="var(--color-amber, #f5b13d)" stroke-width="1"/>
<text x="454" y="331" fill="var(--color-amber, #f5b13d)" font-size="18" font-weight="400" text-anchor="start"><tspan x="454" dy="0">Compte du Trésor · TGA</tspan></text>
<circle cx="440" cy="369" r="3" fill="var(--color-paper, #e7e9ee)" stroke="var(--color-paper, #e7e9ee)" stroke-width="1"/>
<text x="454" y="375" fill="var(--color-paper, #e7e9ee)" font-size="18" font-weight="400" text-anchor="start"><tspan x="454" dy="0">Reverse repos, autres dépôts</tspan></text>
<circle cx="440" cy="413" r="3" fill="var(--color-muted, #8b909b)" stroke="var(--color-muted, #8b909b)" stroke-width="1"/>
<text x="454" y="419" fill="var(--color-muted, #8b909b)" font-size="18" font-weight="400" text-anchor="start"><tspan x="454" dy="0">Capital</tspan></text>
<path d="M64 470 L64 483 L366 483 L366 470" fill="none" stroke="var(--color-signal, #5eead4)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M432 470 L432 483 L734 483 L734 470" fill="none" stroke="var(--color-amber, #f5b13d)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
<text x="215" y="514" fill="var(--color-signal, #5eead4)" font-size="19" font-weight="400" text-anchor="middle"><tspan x="215" dy="0">Total des actifs</tspan></text>
<text x="400" y="514" fill="var(--color-muted, #8b909b)" font-size="24" font-weight="400" text-anchor="middle"><tspan x="400" dy="0">=</tspan></text>
<text x="584" y="514" fill="var(--color-amber, #f5b13d)" font-size="19" font-weight="400" text-anchor="middle"><tspan x="584" dy="0">Passifs + capital</tspan></text>
<text x="32" y="552" fill="var(--color-muted, #8b909b)" font-size="14" font-weight="400" text-anchor="start"><tspan x="32" dy="0">Source : Fed, H.4.1, tableau 5 · structure simplifiée.</tspan></text>
</svg>
</div>
<div class="cb-mobile">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 678" role="img" lang="fr" aria-labelledby="cb-fed-ledger-fr-m-title cb-fed-ledger-fr-m-desc" style="width:100%;height:auto;display:block;font-family:var(--font-read, Arial, sans-serif)">
<title id="cb-fed-ledger-fr-m-title">Les deux faces du bilan</title><desc id="cb-fed-ledger-fr-m-desc">Structure simplifiée du bilan de la Fed. À l’actif : titres, prêts et autres créances. Au passif : réserves bancaires, billets, compte du Trésor et reverse repos. Le capital complète l’identité comptable. Les surfaces n’indiquent aucun montant.</desc>
<rect x="0" y="0" width="400" height="678" rx="0" fill="var(--color-ink, #0c0d10)"/>
<line x1="24" y1="12" x2="376" y2="12" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1"/>
<text x="24" y="37" fill="var(--color-muted, #8b909b)" font-size="14" font-weight="400" text-anchor="start"><tspan x="24" dy="0">l0g / COMPTABILITÉ MONÉTAIRE</tspan></text>
<text x="376" y="37" fill="var(--color-signal, #5eead4)" font-size="14" font-weight="400" text-anchor="end"><tspan x="376" dy="0">01</tspan></text>
<text x="24" y="78" fill="var(--color-paper, #e7e9ee)" font-size="24" font-weight="500" text-anchor="start"><tspan x="24" dy="0">Les deux faces</tspan><tspan x="24" dy="30">du bilan</tspan></text>
<text x="24" y="149" fill="var(--color-muted, #8b909b)" font-size="15" font-weight="400" text-anchor="start"><tspan x="24" dy="0">Fed · schéma sans échelle</tspan></text>
<path d="M24 196 Q105 185 192 196 L192 526 Q105 515 24 526 Z" fill="var(--color-surface, #121419)" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M208 196 Q295 185 376 196 L376 526 Q295 515 208 526 Z" fill="var(--color-surface, #121419)" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
<line x1="200" y1="200" x2="200" y2="526" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1"/>
<text x="40" y="224" fill="var(--color-signal, #5eead4)" font-size="15" font-weight="400" text-anchor="start"><tspan x="40" dy="0">ACTIF</tspan></text>
<text x="224" y="218" fill="var(--color-amber, #f5b13d)" font-size="14" font-weight="400" text-anchor="start"><tspan x="224" dy="0">PASSIF</tspan><tspan x="224" dy="20">+ CAPITAL</tspan></text>
<line x1="40" y1="245" x2="176" y2="245" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1"/>
<line x1="40" y1="329" x2="176" y2="329" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1"/>
<line x1="40" y1="413" x2="176" y2="413" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1"/>
<line x1="224" y1="245" x2="360" y2="245" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1"/>
<line x1="224" y1="297" x2="360" y2="297" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1"/>
<line x1="224" y1="349" x2="360" y2="349" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1"/>
<line x1="224" y1="401" x2="360" y2="401" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1"/>
<line x1="224" y1="453" x2="360" y2="453" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1"/>
<rect x="46.72" y="263" width="16.12" height="21.7" rx="0" fill="var(--color-ink, #0c0d10)" stroke="var(--color-signal, #5eead4)" stroke-width="1"/><rect x="43" y="266.1" width="16.12" height="21.7" rx="0" fill="var(--color-ink, #0c0d10)" stroke="var(--color-signal, #5eead4)" stroke-width="1"/><line x1="46.72" y1="273.54" x2="55.4" y2="273.54" stroke="var(--color-signal, #5eead4)" stroke-width="1"/><line x1="46.72" y1="277.88" x2="55.4" y2="277.88" stroke="var(--color-signal, #5eead4)" stroke-width="1"/>
<text x="73" y="280" fill="var(--color-paper, #e7e9ee)" font-size="18" font-weight="400" text-anchor="start"><tspan x="73" dy="0">Titres</tspan></text>
<text x="42" y="309" fill="var(--color-muted, #8b909b)" font-size="15" font-weight="400" text-anchor="start"><tspan x="42" dy="0">Treasuries, MBS</tspan></text>
<text x="42" y="361" fill="var(--color-paper, #e7e9ee)" font-size="17" font-weight="400" text-anchor="start"><tspan x="42" dy="0">Repos et prêts</tspan></text>
<text x="42" y="390" fill="var(--color-muted, #8b909b)" font-size="15" font-weight="400" text-anchor="start"><tspan x="42" dy="0">Créances</tspan></text>
<text x="42" y="448" fill="var(--color-paper, #e7e9ee)" font-size="17" font-weight="400" text-anchor="start"><tspan x="42" dy="0">Swaps, autres</tspan><tspan x="42" dy="22.950000000000003">actifs</tspan></text>
<text x="224" y="267" fill="var(--color-signal, #5eead4)" font-size="16" font-weight="400" text-anchor="start"><tspan x="224" dy="0">Réserves</tspan><tspan x="224" dy="19">bancaires</tspan></text>
<text x="224" y="319" fill="var(--color-paper, #e7e9ee)" font-size="16" font-weight="400" text-anchor="start"><tspan x="224" dy="0">Billets</tspan></text>
<text x="224" y="371" fill="var(--color-amber, #f5b13d)" font-size="16" font-weight="400" text-anchor="start"><tspan x="224" dy="0">Trésor · TGA</tspan></text>
<text x="224" y="423" fill="var(--color-paper, #e7e9ee)" font-size="16" font-weight="400" text-anchor="start"><tspan x="224" dy="0">Reverse repos,</tspan><tspan x="224" dy="19">autres dépôts</tspan></text>
<text x="224" y="475" fill="var(--color-muted, #8b909b)" font-size="16" font-weight="400" text-anchor="start"><tspan x="224" dy="0">Capital</tspan></text>
<path d="M40 545 L40 555 L176 555 L176 545" fill="none" stroke="var(--color-signal, #5eead4)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M224 545 L224 555 L360 555 L360 545" fill="none" stroke="var(--color-amber, #f5b13d)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
<text x="108" y="587" fill="var(--color-signal, #5eead4)" font-size="18" font-weight="400" text-anchor="middle"><tspan x="108" dy="0">Actifs</tspan></text>
<text x="200" y="587" fill="var(--color-muted, #8b909b)" font-size="22" font-weight="400" text-anchor="middle"><tspan x="200" dy="0">=</tspan></text>
<text x="292" y="580" fill="var(--color-amber, #f5b13d)" font-size="16" font-weight="400" text-anchor="middle"><tspan x="292" dy="0">Passifs</tspan><tspan x="292" dy="22">+ capital</tspan></text>
<text x="24" y="635" fill="var(--color-muted, #8b909b)" font-size="14" font-weight="400" text-anchor="start"><tspan x="24" dy="0">Source : Fed, H.4.1, tableau 5.</tspan><tspan x="24" dy="20">Rubriques regroupées, sans montant.</tspan></text>
</svg>
</div>
<figcaption>Structure qualitative du bilan, sans échelle de taille et sans montant. Les catégories sont regroupées : le tableau complet comporte d’autres rubriques. L’identité porte sur l’ensemble des actifs, des passifs et du capital. Source : <a href="https://www.federalreserve.gov/releases/h41/">Fed, H.4.1, tableau 5 et notes</a>.</figcaption>
</figure>

## Le passif : réserves, billets et comptes à la Fed

Les **réserves bancaires** sont les soldes des institutions de dépôt auprès des banques de réserve. Le **TGA**, ou *Treasury General Account*, est le compte du Trésor. Les billets constituent une autre dette de la banque centrale. Un **reverse repo**, prise en pension inverse du point de vue de la Fed, correspond à des fonds reçus temporairement contre titres. La [présentation des engagements de la Fed](https://www.federalreserve.gov/monetarypolicy/bst_frliabilities.htm) décrit ces comptes et leurs interactions.

Le même tableau 5 permet de reconstituer la contrepartie de l'actif :

| Passifs et capital | Milliards de dollars |
| --- | ---: |
| Réserves bancaires | 2 962,804 |
| Billets de la Fed, nets des billets détenus par les banques de réserve | 2 438,660 |
| Compte général du Trésor | 936,248 |
| Reverse repos | 334,503 |
| Autres passifs et capital, solde net calculé | 75,930 |
| **Total** | **6 748,145** |

Source : [même relevé, tableau 5](https://www.federalreserve.gov/releases/h41/20261105/). Le dernier solde additionne les autres dépôts (**251,769 milliards**), les effets à disponibilité différée, ou *deferred-availability cash items* (**0,272 milliard**), les autres engagements et dividendes courus (**−223,831 milliards**) et le capital (**47,720 milliards**). Le signe négatif s'explique notamment par le compte des reversements au Trésor, abordé plus bas. Ce solde net n'est pas un compte de dépôts homogène.

L'identité complète est **réserves = actif − autres passifs − capital**. Les autres passifs comprennent les billets, le TGA, les reverse repos et tous les postes restants, y compris leurs soldes négatifs. La formule suivie sur les marchés, « actif de la Fed − TGA − RRP », omet plusieurs comptes : elle ne reproduit pas les réserves publiées. Notre [guide sur la liquidité nette](/guides/liquidite-tresor-dts-tga-rrp/) en détaille les limites.

## Reconstituer une variation de réserves

Quand le Trésor dépense depuis son compte vers un compte bancaire, le TGA diminue et les réserves de la banque destinataire augmentent, toutes choses égales par ailleurs. Une recette fiscale produit le mouvement inverse. Un paiement entre clients de banques différentes déplace les réserves entre ces banques ; ce seul transfert ne change pas leur total. La [Fed décrit les mouvements du TGA](https://www.federalreserve.gov/monetarypolicy/bst_frliabilities.htm).

Un reverse repo échange temporairement une dette en réserves contre une dette en pension inverse, sans sortir les titres du portefeuille comptable. La [FAQ de la New York Fed](https://www.newyorkfed.org/markets/rrp_faq.html) précise ce mécanisme. Dans le H.4.1, le total des reverse repos comprend les comptes officiels étrangers ainsi que la ligne « Others ». Il ne faut pas l'assimiler au seul guichet **ON RRP**, la facilité au jour le jour destinée aux contreparties éligibles.

La semaine du **28 octobre au 4 novembre 2026** fournit un exemple réel. Au tableau 5, l'actif progresse de **2,510 milliards**, les réserves de **67,568 milliards**. Le TGA recule de **79,384 milliards**, tandis que les reverse repos augmentent de **8,666 milliards** et les billets de **4,630 milliards**. Le solde des autres passifs et du capital augmente de **1,030 milliard**, obtenu par différence. L'égalité se reconstitue ainsi :

**2,510 + 79,384 − 8,666 − 4,630 − 1,030 = 67,568 milliards de dollars.**

Source et convention : [H.4.1 du 5 novembre, tableau 5, variations entre deux mercredis](https://www.federalreserve.gov/releases/h41/20261105/). Ce rapprochement décrit une identité comptable ; il n'établit pas à lui seul les motivations de chaque opération.

<figure class="central-bank-figure" style="padding-bottom:1rem">
<div class="cb-wide">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 624" role="img" lang="fr" aria-labelledby="cb-fed-flows-fr-d-title cb-fed-flows-fr-d-desc" style="width:100%;height:auto;display:block;font-family:var(--font-read, Arial, sans-serif)">
<title id="cb-fed-flows-fr-d-title">Les réserves changent de contrepartie</title><desc id="cb-fed-flows-fr-d-desc">Deux opérations isolées, toutes choses égales par ailleurs. Un impôt payé au Trésor transfère un montant x des réserves bancaires au TGA sans modifier les actifs de la Fed. Un achat ferme de titres par la Fed augmente à la fois ses titres et les réserves de x. Le vendeur et son compte bancaire ne sont pas détaillés.</desc>
<rect x="0" y="0" width="800" height="624" rx="0" fill="var(--color-ink, #0c0d10)"/>
<line x1="32" y1="12" x2="768" y2="12" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1"/>
<text x="32" y="37" fill="var(--color-muted, #8b909b)" font-size="14" font-weight="400" text-anchor="start"><tspan x="32" dy="0">l0g / MOUVEMENTS DE BILAN</tspan></text>
<text x="768" y="37" fill="var(--color-signal, #5eead4)" font-size="14" font-weight="400" text-anchor="end"><tspan x="768" dy="0">02</tspan></text>
<text x="32" y="78" fill="var(--color-paper, #e7e9ee)" font-size="29" font-weight="500" text-anchor="start"><tspan x="32" dy="0">Les réserves changent de contrepartie</tspan></text>
<text x="32" y="111" fill="var(--color-muted, #8b909b)" font-size="16" font-weight="400" text-anchor="start"><tspan x="32" dy="0">Opérations isolées · x = même montant en dollars</tspan></text>
<text x="32" y="166" fill="var(--color-muted, #8b909b)" font-size="15" font-weight="400" text-anchor="start"><tspan x="32" dy="0">A / UN IMPÔT EST VERSÉ AU TRÉSOR</tspan></text>
<text x="32" y="215" fill="var(--color-paper, #e7e9ee)" font-size="19" font-weight="400" text-anchor="start"><tspan x="32" dy="0">Actifs Fed</tspan><tspan x="32" dy="25">inchangés</tspan></text>
<line x1="180" y1="184" x2="180" y2="297" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1"/>
<text x="214" y="213" fill="var(--color-signal, #5eead4)" font-size="20" font-weight="400" text-anchor="start"><tspan x="214" dy="0">Réserves bancaires</tspan></text>
<text x="214" y="250" fill="var(--color-signal, #5eead4)" font-size="33" font-weight="500" text-anchor="start"><tspan x="214" dy="0">−x</tspan></text>
<line x1="427" y1="239" x2="565" y2="239" stroke="var(--color-amber, #f5b13d)" stroke-width="1.5"/><path d="M558.70 242.04 L565 239 L558.70 235.96" fill="none" stroke="var(--color-amber, #f5b13d)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<text x="496" y="218" fill="var(--color-muted, #8b909b)" font-size="15" font-weight="400" text-anchor="middle"><tspan x="496" dy="0">transfert</tspan></text>
<text x="598" y="213" fill="var(--color-amber, #f5b13d)" font-size="20" font-weight="400" text-anchor="start"><tspan x="598" dy="0">TGA</tspan></text>
<text x="598" y="250" fill="var(--color-amber, #f5b13d)" font-size="33" font-weight="500" text-anchor="start"><tspan x="598" dy="0">+x</tspan></text>
<path d="M214 273 L214 286 L731 286 L731 273" fill="none" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
<text x="473" y="313" fill="var(--color-muted, #8b909b)" font-size="16" font-weight="400" text-anchor="middle"><tspan x="473" dy="0">Le total du passif reste identique.</tspan></text>
<line x1="32" y1="345" x2="768" y2="345" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1"/>
<text x="32" y="384" fill="var(--color-muted, #8b909b)" font-size="15" font-weight="400" text-anchor="start"><tspan x="32" dy="0">B / LA FED ACHÈTE UN TITRE</tspan></text>
<rect x="49.8" y="418" width="33.800000000000004" height="45.5" rx="0" fill="var(--color-ink, #0c0d10)" stroke="var(--color-signal, #5eead4)" stroke-width="1"/><rect x="42" y="424.5" width="33.800000000000004" height="45.5" rx="0" fill="var(--color-ink, #0c0d10)" stroke="var(--color-signal, #5eead4)" stroke-width="1"/><line x1="49.8" y1="440.1" x2="68.0" y2="440.1" stroke="var(--color-signal, #5eead4)" stroke-width="1"/><line x1="49.8" y1="449.2" x2="68.0" y2="449.2" stroke="var(--color-signal, #5eead4)" stroke-width="1"/>
<text x="110" y="436" fill="var(--color-signal, #5eead4)" font-size="20" font-weight="400" text-anchor="start"><tspan x="110" dy="0">Titres à l’actif</tspan></text>
<text x="110" y="476" fill="var(--color-signal, #5eead4)" font-size="33" font-weight="500" text-anchor="start"><tspan x="110" dy="0">+x</tspan></text>
<line x1="400" y1="409" x2="400" y2="493" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1"/>
<text x="443" y="436" fill="var(--color-signal, #5eead4)" font-size="20" font-weight="400" text-anchor="start"><tspan x="443" dy="0">Réserves au passif</tspan></text>
<text x="443" y="476" fill="var(--color-signal, #5eead4)" font-size="33" font-weight="500" text-anchor="start"><tspan x="443" dy="0">+x</tspan></text>
<path d="M110 497 L110 510 L731 510 L731 497" fill="none" stroke="var(--color-signal, #5eead4)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
<text x="421" y="538" fill="var(--color-signal, #5eead4)" font-size="18" font-weight="400" text-anchor="middle"><tspan x="421" dy="0">L’actif et le passif augmentent ensemble.</tspan></text>
<text x="32" y="579" fill="var(--color-muted, #8b909b)" font-size="14" font-weight="400" text-anchor="start"><tspan x="32" dy="0">Toutes choses égales par ailleurs · écritures simplifiées au bilan de la Fed.</tspan></text>
<text x="32" y="601" fill="var(--color-muted, #8b909b)" font-size="14" font-weight="400" text-anchor="start"><tspan x="32" dy="0">Sources : Fed, lecture du bilan ; New York Fed, opérations de marché.</tspan></text>
</svg>
</div>
<div class="cb-mobile">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 771" role="img" lang="fr" aria-labelledby="cb-fed-flows-fr-m-title cb-fed-flows-fr-m-desc" style="width:100%;height:auto;display:block;font-family:var(--font-read, Arial, sans-serif)">
<title id="cb-fed-flows-fr-m-title">Les réserves changent de contrepartie</title><desc id="cb-fed-flows-fr-m-desc">Deux opérations isolées, toutes choses égales par ailleurs. Un impôt payé au Trésor transfère un montant x des réserves bancaires au TGA sans modifier les actifs de la Fed. Un achat ferme de titres par la Fed augmente à la fois ses titres et les réserves de x. Le vendeur et son compte bancaire ne sont pas détaillés.</desc>
<rect x="0" y="0" width="400" height="771" rx="0" fill="var(--color-ink, #0c0d10)"/>
<line x1="24" y1="12" x2="376" y2="12" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1"/>
<text x="24" y="37" fill="var(--color-muted, #8b909b)" font-size="14" font-weight="400" text-anchor="start"><tspan x="24" dy="0">l0g / MOUVEMENTS DE BILAN</tspan></text>
<text x="376" y="37" fill="var(--color-signal, #5eead4)" font-size="14" font-weight="400" text-anchor="end"><tspan x="376" dy="0">02</tspan></text>
<text x="24" y="78" fill="var(--color-paper, #e7e9ee)" font-size="24" font-weight="500" text-anchor="start"><tspan x="24" dy="0">Les réserves suivent</tspan><tspan x="24" dy="30">leur contrepartie</tspan></text>
<text x="24" y="149" fill="var(--color-muted, #8b909b)" font-size="15" font-weight="400" text-anchor="start"><tspan x="24" dy="0">Opérations isolées · x en dollars</tspan></text>
<text x="24" y="204" fill="var(--color-muted, #8b909b)" font-size="14" font-weight="400" text-anchor="start"><tspan x="24" dy="0">A / IMPÔT AU TRÉSOR</tspan></text>
<text x="24" y="236" fill="var(--color-paper, #e7e9ee)" font-size="17" font-weight="400" text-anchor="start"><tspan x="24" dy="0">Actifs Fed inchangés</tspan></text>
<line x1="24" y1="252" x2="376" y2="252" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1"/>
<text x="24" y="285" fill="var(--color-signal, #5eead4)" font-size="17" font-weight="400" text-anchor="start"><tspan x="24" dy="0">Réserves</tspan><tspan x="24" dy="22">bancaires</tspan></text>
<text x="24" y="353" fill="var(--color-signal, #5eead4)" font-size="36" font-weight="500" text-anchor="start"><tspan x="24" dy="0">−x</tspan></text>
<line x1="155" y1="326" x2="258" y2="326" stroke="var(--color-amber, #f5b13d)" stroke-width="1.5"/><path d="M251.70 329.04 L258 326 L251.70 322.96" fill="none" stroke="var(--color-amber, #f5b13d)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<text x="207" y="302" fill="var(--color-muted, #8b909b)" font-size="14" font-weight="400" text-anchor="middle"><tspan x="207" dy="0">transfert</tspan></text>
<text x="296" y="285" fill="var(--color-amber, #f5b13d)" font-size="18" font-weight="400" text-anchor="start"><tspan x="296" dy="0">TGA</tspan></text>
<text x="296" y="353" fill="var(--color-amber, #f5b13d)" font-size="36" font-weight="500" text-anchor="start"><tspan x="296" dy="0">+x</tspan></text>
<path d="M24 377 L24 388 L376 388 L376 377" fill="none" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
<text x="200" y="418" fill="var(--color-muted, #8b909b)" font-size="16" font-weight="400" text-anchor="middle"><tspan x="200" dy="0">Total du passif identique</tspan></text>
<line x1="24" y1="445" x2="376" y2="445" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1"/>
<text x="24" y="480" fill="var(--color-muted, #8b909b)" font-size="14" font-weight="400" text-anchor="start"><tspan x="24" dy="0">B / ACHAT FERME PAR LA FED</tspan></text>
<text x="24" y="522" fill="var(--color-signal, #5eead4)" font-size="17" font-weight="400" text-anchor="start"><tspan x="24" dy="0">Titres</tspan><tspan x="24" dy="23">à l’actif</tspan></text>
<text x="24" y="592" fill="var(--color-signal, #5eead4)" font-size="36" font-weight="500" text-anchor="start"><tspan x="24" dy="0">+x</tspan></text>
<line x1="200" y1="506" x2="200" y2="610" stroke="var(--color-line-strong, rgba(255, 255, 255, 0.20))" stroke-width="1"/>
<text x="228" y="522" fill="var(--color-signal, #5eead4)" font-size="17" font-weight="400" text-anchor="start"><tspan x="228" dy="0">Réserves</tspan><tspan x="228" dy="23">au passif</tspan></text>
<text x="228" y="592" fill="var(--color-signal, #5eead4)" font-size="36" font-weight="500" text-anchor="start"><tspan x="228" dy="0">+x</tspan></text>
<path d="M24 620 L24 632 L376 632 L376 620" fill="none" stroke="var(--color-signal, #5eead4)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
<text x="200" y="662" fill="var(--color-signal, #5eead4)" font-size="17" font-weight="400" text-anchor="middle"><tspan x="200" dy="0">Actif et passif augmentent</tspan><tspan x="200" dy="23">du même montant.</tspan></text>
<text x="24" y="726" fill="var(--color-muted, #8b909b)" font-size="14" font-weight="400" text-anchor="start"><tspan x="24" dy="0">Toutes choses égales par ailleurs.</tspan><tspan x="24" dy="20">Sources : Fed ; New York Fed.</tspan></text>
</svg>
</div>
<figcaption>Deux opérations isolées au bilan de la Fed, toutes choses égales par ailleurs. Le symbole x désigne le même montant en dollars au sein de chaque opération ; aucun encours observé n’est représenté. Le paiement d’un impôt déplace des passifs ; un achat ferme accroît l’actif et les réserves. Sources : <a href="https://www.federalreserve.gov/monetarypolicy/bst_fedsbalancesheet.htm">Fed, lecture du bilan</a> et <a href="https://www.newyorkfed.org/markets/domestic-market-operations/monetary-policy-implementation/repo-reverse-repo-agreements">New York Fed, opérations de marché</a>.</figcaption>
</figure>

Le tableau 1 montre une autre variation parce qu'il offre une autre convention. Les réserves y atteignent **2 930,088 milliards en moyenne** sur la semaine achevée le 4 novembre, contre **2 962,804 milliards le mercredi**. La hausse de **36,318 milliards** affichée auprès de la moyenne compare deux moyennes hebdomadaires. Elle diffère donc de la hausse de **67,568 milliards** entre deux mercredis. Ces quatre chiffres proviennent du [même relevé](https://www.federalreserve.gov/releases/h41/20261105/) ; les mélanger détruit le rapprochement.

## Distinguer politique monétaire et gestion des réserves

L'**assouplissement quantitatif**, ou QE, désigne des achats destinés à assouplir les conditions financières. Le **resserrement quantitatif**, ou QT, réduit les portefeuilles selon les décisions de vente ou de réinvestissement applicables. Pour qualifier un mouvement, il faut lire les instructions du **FOMC**, le comité de politique monétaire, en plus des comptes. Une variation d'actif peut aussi venir des prêts, du change ou de postes techniques.

La [note d'application du 28 octobre 2026](https://www.federalreserve.gov/newsevents/pressreleases/monetary20261028a1.htm), effective le lendemain, prévoit le renouvellement à l'adjudication de tous les remboursements de principal des titres du Trésor et le réinvestissement des remboursements de titres d'agences dans des bons du Trésor. Elle autorise aussi, lorsque cela est approprié, des achats de bons et, si nécessaire, d'autres titres du Trésor d'échéance résiduelle courte pour maintenir des réserves abondantes.

La diminution des MBS peut donc accompagner une hausse des bons du Trésor. Le changement de composition du portefeuille ne mesure pas à lui seul un nouveau QT. Des achats destinés à maintenir les réserves doivent être lus dans leur objectif opérationnel ; la seule hausse du bilan ne démontre pas un programme visant à abaisser les taux longs.

## Valorisation et pertes : lire les notes comptables

Les titres du Trésor sont présentés à leur valeur faciale, avec une ligne de compensation d'inflation pour les titres indexés. Les MBS sont présentés au principal restant dû. Les primes et décotes non amorties sont isolées. Ces montants ne donnent donc pas le prix auquel la Fed pourrait céder son portefeuille sur le marché. Les [notes du relevé](https://www.federalreserve.gov/releases/h41/20261105/) distinguent valeur comptable, principal et prix de vente.

Le compte **« Earnings remittances due to the U.S. Treasury »** mérite une lecture distincte. Au tableau 6, son solde agrégé net est de **−231,928 milliards de dollars au 4 novembre 2026**. La note correspondante explique que les montants négatifs représentent la position cumulée d'actif différé. Le [manuel comptable, section 11.96](https://www.federalreserve.gov/aboutthefed/chapter-1-balance-sheet.htm), précise qu'une banque de réserve enregistre ainsi les bénéfices nets excédentaires à réaliser avant la reprise de ses reversements au Trésor.

Ce solde n'est ni une perte hebdomadaire de ce montant ni une créance négociable sur le Trésor. Le compte combine aussi les situations de banques de réserve dont les reversements peuvent différer. Le traiter comme une facture immédiatement exigible ou le retrancher une deuxième fois du capital ferait mal lire les comptes. Son enjeu budgétaire est le report de recettes pour le Trésor ; le H.4.1 ne fournit pas à lui seul la date de résorption de ce stock.

## Une méthode de lecture reproductible

Pour chaque relevé, conserver l'URL datée, le tableau, l'intitulé de la ligne, l'unité et la colonne. Commencer par l'actif total du tableau 5, identifier les principaux changements de titres et de prêts, puis rapprocher les réserves des mouvements du TGA, des reverse repos et des autres comptes. Revenir ensuite à la directive du FOMC avant d'attribuer le mouvement à une décision de politique monétaire.

Les quantités ne suffisent pas à diagnostiquer une pénurie de financement : leur répartition entre établissements et les taux effectivement négociés comptent aussi. Le [guide du marché repo et du SOFR](/guides/lire-le-marche-du-repo-sofr/) complète cette lecture. Les [eurodollars](/posts/eurodollars-dollar-offshore-dette-cachee/) élargissent le périmètre au financement hors des États-Unis. Enfin, la [lecture du bilan de la BCE](/guides/lire-le-bilan-bce-target2/) montre comment une architecture différente utilise la même identité comptable.

## Sources et révision

La révision du **11 novembre 2026** vérifie les montants sur le relevé du **5 novembre**, remplace l'ancien exemple d'octobre, complète la réconciliation du passif et rapproche la lecture du portefeuille de la directive du **28 octobre**. Les observations du mercredi, les moyennes hebdomadaires et leurs variations restent séparées.

- [Fed, calendrier et archives du H.4.1](https://www.federalreserve.gov/releases/h41/).
- [Fed, relevé du 5 novembre 2026, tableaux et notes](https://www.federalreserve.gov/releases/h41/20261105/).
- [Fed, périmètre de la publication](https://www.federalreserve.gov/releases/h41/about.htm).
- [Fed, guide des tableaux du bilan](https://www.federalreserve.gov/monetarypolicy/bst_fedsbalancesheet.htm).
- [Fed, engagements et compte du Trésor](https://www.federalreserve.gov/monetarypolicy/bst_frliabilities.htm).
- [FOMC, note d'application du 28 octobre 2026](https://www.federalreserve.gov/newsevents/pressreleases/monetary20261028a1.htm).
- [New York Fed, repos et reverse repos](https://www.newyorkfed.org/markets/domestic-market-operations/monetary-policy-implementation/repo-reverse-repo-agreements).
- [New York Fed, FAQ sur les reverse repos](https://www.newyorkfed.org/markets/rrp_faq.html).
- [Fed, manuel comptable, chapitre 1 et section 11.96](https://www.federalreserve.gov/aboutthefed/chapter-1-balance-sheet.htm).
