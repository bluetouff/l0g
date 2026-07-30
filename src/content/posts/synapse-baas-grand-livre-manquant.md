---
title: "Le grand livre manquant"
description: "Synapse a bloqué l’accès aux fonds de milliers de clients. Enquête sur le registre défaillant du banking-as-a-service et la réponse réglementaire."
pubDate: 2026-07-30T22:24:40+02:00
updatedDate: 2026-07-30T22:24:40+02:00
tags: ["international", "banques", "fintech", "risque", "états-unis"]
draft: false
---

*Au printemps 2024, des milliers d'Américains ont perdu l'accès à l'argent qu'ils avaient confié à des applications financières. Certains ne pouvaient plus payer leur loyer, leur crédit immobilier, leur alimentation ou leurs soins. Aucune banque n'avait pourtant fait faillite. Le maillon rompu était Synapse, un intermédiaire technologique dont beaucoup de clients finaux ignoraient jusqu'au nom.*

L'affaire ne se résume ni à une panne ni à un piratage. Selon la [plainte déposée par le Consumer Financial Protection Bureau (CFPB) en août 2025](https://files.consumerfinance.gov/f/documents/cfpb_synapse-financial-technologies_complaint_2025-08.pdf), Synapse n'a pas maintenu des registres fiables de l'emplacement des fonds et n'a pas veillé à leur concordance avec ceux de ses banques partenaires. Celles-ci détenaient collectivement entre **60 et 90 millions de dollars de moins** que les montants inscrits dans les données de Synapse. Cet intervalle est une estimation d'écart comptable, pas la preuve qu'une somme précise a été dérobée.

La faillite expose un angle mort du [banking-as-a-service](/glossaire/#baas) : une interface peut ressembler à une banque, afficher le nom d'une banque assurée et proposer des fonctions bancaires sans que l'entreprise visible par le client soit elle-même une banque. Entre l'écran et le dépôt s'intercalent alors plusieurs sociétés, plusieurs contrats et, surtout, plusieurs registres.

## Une banque en plusieurs étages

Synapse fournissait le logiciel reliant des plateformes financières non bancaires aux établissements qui détenaient les dépôts, émettaient les cartes et traitaient les virements. Le CFPB la décrit comme un « pont » entre ces deux mondes. À partir de 2023, son programme de gestion de trésorerie a encore complexifié le circuit : les fonds pouvaient transiter par Synapse Brokerage puis être répartis entre plusieurs banques partenaires.

Une partie des dépôts était placée dans des [comptes FBO](/glossaire/#compte-fbo), pour *for the benefit of*. Ces comptes omnibus regroupent l'argent de nombreux bénéficiaires. La banque voit le compte et son solde agrégé ; l'attribution de chaque fraction à son propriétaire repose sur des écritures détaillées. Dans le montage Synapse, l'intermédiaire devait suivre les mouvements entre plusieurs banques et faire correspondre ses données avec les leurs.

Cette architecture n'est pas frauduleuse par nature. Elle peut réduire le coût d'accès à des services financiers et permettre à une banque de distribuer ses produits par plusieurs interfaces. Elle crée néanmoins une dépendance critique : si les registres ne concordent plus, le solde affiché par l'application ne suffit pas à établir où se trouve chaque dollar.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 390 390" role="img" aria-labelledby="synapse-stack-title synapse-stack-desc" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;max-width:560px;height:auto;margin:0 auto;font-family:ui-monospace,monospace">
  <title id="synapse-stack-title">Les trois étages du modèle Synapse</title>
  <desc id="synapse-stack-desc">La plateforme sert d'interface, Synapse transmet les instructions et tient les registres individuels, les banques détiennent les dépôts et exécutent les paiements.</desc>
  <rect width="390" height="390" fill="#0c0d10"/>
  <text x="18" y="31" fill="#f5f6f8" font-size="16" font-weight="700">Le compte visible n'est qu'un étage</text>
  <text x="18" y="53" fill="#9ca3af" font-size="10.5">
    <tspan x="18" dy="0">Chaque acteur détient une partie de l'information</tspan>
    <tspan x="18" dy="14">et de la responsabilité.</tspan>
  </text>

  <rect x="18" y="86" width="354" height="66" rx="4" fill="#5eead4"/>
  <text x="32" y="110" fill="#0c0d10" font-size="12.5" font-weight="700">1. Plateforme financière</text>
  <text x="32" y="131" fill="#0c0d10" font-size="10.5">interface client, solde affiché,</text>
  <text x="32" y="145" fill="#0c0d10" font-size="10.5">instructions de paiement</text>

  <path d="M195 152v16" stroke="#d6d9df" stroke-width="2"/>
  <path d="M190 163l5 6 5-6" fill="none" stroke="#d6d9df" stroke-width="2"/>

  <rect x="18" y="170" width="354" height="66" rx="4" fill="#ff4d87"/>
  <text x="32" y="194" fill="#0c0d10" font-size="12.5" font-weight="700">2. Synapse</text>
  <text x="32" y="215" fill="#0c0d10" font-size="10.5">instructions, suivi des mouvements,</text>
  <text x="32" y="229" fill="#0c0d10" font-size="10.5">registres par utilisateur</text>

  <path d="M195 236v16" stroke="#d6d9df" stroke-width="2"/>
  <path d="M190 247l5 6 5-6" fill="none" stroke="#d6d9df" stroke-width="2"/>

  <rect x="18" y="254" width="354" height="66" rx="4" fill="#7aa2f7"/>
  <text x="32" y="278" fill="#0c0d10" font-size="12.5" font-weight="700">3. Banques partenaires</text>
  <text x="32" y="299" fill="#0c0d10" font-size="10.5">dépôts omnibus, cartes, virements ACH</text>
  <text x="32" y="313" fill="#0c0d10" font-size="10.5">et autres paiements</text>

  <rect x="18" y="338" width="354" height="38" rx="4" fill="#15181e" stroke="#f5b13d"/>
  <text x="30" y="354" fill="#f5b13d" font-size="10" font-weight="700">RISQUE CENTRAL</text>
  <text x="30" y="369" fill="#d6d9df" font-size="10">des registres divergents empêchent d'allouer les soldes</text>
</svg>
<figcaption>Représentation simplifiée à partir de la plainte du CFPB. Le rôle exact de chaque banque variait selon la plateforme et le programme utilisé. Source : CFPB, août 2025.</figcaption>
</figure>

## Le registre cesse de faire foi

Le problème était antérieur à la faillite. La plainte du CFPB affirme qu'en septembre 2023 au plus tard, Synapse et Evolve Bank & Trust savaient déjà que les données de l'intermédiaire indiquaient plusieurs dizaines de millions de dollars de plus que les fonds détenus par Evolve. Les deux entreprises se sont publiquement rejeté la responsabilité de cet écart, qui restait litigieux lors du dépôt de la plainte en 2025.

Synapse s'est placée sous la protection du chapitre 11 le **22 avril 2024**. En mai, ses opérations se sont dégradées puis ont cessé. L'entreprise a arrêté de fournir certaines données à au moins une banque et n'a plus maintenu son accès au tableau de bord présentant les soldes et les transactions. Après la nomination d'un administrateur judiciaire, les écarts avec plusieurs banques partenaires sont devenus manifestes.

Les banques ont alors dû rapprocher des jeux d'écritures qui ne disaient plus la même chose. Certaines ont mis des mois à déterminer combien restituer à chaque client. Le CFPB indique que des milliers de consommateurs sont restés sans accès à leurs fonds pendant des semaines ou des mois et que, plus d'un an après l'arrêt, beaucoup n'avaient toujours pas récupéré l'intégralité du solde affiché par leur plateforme.

<figure class="infographic" style="padding-bottom:1.75rem">
<svg viewBox="0 0 390 360" role="img" aria-labelledby="synapse-timeline-title synapse-timeline-desc" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;max-width:560px;height:auto;margin:0 auto;font-family:ui-monospace,monospace">
  <title id="synapse-timeline-title">Chronologie documentée de l'affaire Synapse</title>
  <desc id="synapse-timeline-desc">De l'écart connu en septembre 2023 à l'allocation du fonds d'indemnisation en novembre 2025, puis au statut réglementaire vérifié en juillet 2026.</desc>
  <rect width="390" height="360" fill="#0c0d10"/>
  <text x="18" y="31" fill="#f5f6f8" font-size="16" font-weight="700">De l'alerte à l'indemnisation</text>
  <line x1="32" y1="65" x2="32" y2="235" stroke="#39404a" stroke-width="3"/>

  <circle cx="32" cy="68" r="6" fill="#f5b13d"/>
  <text x="52" y="64" fill="#f5b13d" font-size="11" font-weight="700">09/2023</text>
  <text x="145" y="64" fill="#d6d9df" font-size="10.5">écart connu par Synapse et Evolve</text>

  <circle cx="32" cy="110" r="6" fill="#ff4d87"/>
  <text x="52" y="106" fill="#ff4d87" font-size="11" font-weight="700">22/04/2024</text>
  <text x="145" y="106" fill="#d6d9df" font-size="10.5">placement sous chapitre 11</text>

  <circle cx="32" cy="152" r="6" fill="#ff4d87"/>
  <text x="52" y="148" fill="#ff4d87" font-size="11" font-weight="700">05/2024</text>
  <text x="145" y="148" fill="#d6d9df" font-size="10.5">arrêt des opérations</text>

  <circle cx="32" cy="194" r="6" fill="#7aa2f7"/>
  <text x="52" y="190" fill="#7aa2f7" font-size="11" font-weight="700">12/09/2025</text>
  <text x="145" y="190" fill="#d6d9df" font-size="10.5">jugement CFPB</text>

  <circle cx="32" cy="236" r="6" fill="#5eead4"/>
  <text x="52" y="232" fill="#5eead4" font-size="11" font-weight="700">28/11/2025</text>
  <text x="145" y="232" fill="#d6d9df" font-size="10.5">46,25 M$ alloués</text>

  <rect x="18" y="265" width="354" height="70" rx="4" fill="#15181e" stroke="#39404a"/>
  <text x="30" y="286" fill="#f5f6f8" font-size="11.5" font-weight="700">SITUATION AU 30 JUILLET 2026</text>
  <text x="30" y="306" fill="#d6d9df" font-size="10">CFPB : Synapse absent des distributions en cours</text>
  <text x="30" y="323" fill="#d6d9df" font-size="10">FDIC : aucun texte final publié pour la règle proposée</text>

  <text x="18" y="352" fill="#8b909b" font-size="9">Allocation ≠ paiement · proposition ≠ règle en vigueur</text>
</svg>
<figcaption>Chronologie construite à partir de la plainte et du jugement du CFPB, de la page du Civil Penalty Fund et du Federal Register. L'allocation de fonds ouvre un processus de distribution dont la durée varie selon les dossiers.</figcaption>
</figure>

## Une assurance limitée à la faillite bancaire

La mention FDIC visible dans certaines applications n'était pas une promesse de remboursement contre toute défaillance. La garantie fédérale porte sur les dépôts placés dans une banque assurée lorsque **cette banque** fait faillite. Un intermédiaire non bancaire n'est jamais lui-même assuré par la FDIC.

Dans un compte omnibus, l'[assurance pass-through](/glossaire/#assurance-pass-through) peut traiter les bénéficiaires comme s'ils détenaient directement leurs dépôts auprès de la banque. Elle suppose notamment que la relation de garde soit correctement documentée et que l'identité ainsi que la part de chaque bénéficiaire puissent être établies. Elle ne couvre ni la faillite d'une fintech, ni celle d'un prestataire technologique, ni une perte causée par des registres défaillants tant que la banque dépositaire reste ouverte.

La [FDIC l'a rappelé aux utilisateurs d'applications financières](https://www.fdic.gov/consumer-resource-center/2024-06/banking-third-party-apps) après l'arrêt de Synapse : la couverture commence seulement lorsque les fonds atteignent une banque assurée et ne protège pas contre l'insolvabilité ou la faillite de l'entreprise non bancaire. Le logo pouvait donc décrire correctement la banque partenaire tout en laissant le client sans protection contre le risque qui s'est matérialisé.

## La responsabilité ne s'arrête pas au middleware

Synapse devait tenir les registres individuels et suivre les fonds. Les banques n'étaient pas pour autant dispensées de surveiller leurs partenaires. Le 14 juin 2024, la [Réserve fédérale a prononcé une mesure d'exécution contre Evolve](https://www.federalreserve.gov/newsevents/pressreleases/enforcement20240614a.htm) après que des examens menés en 2023 eurent relevé des pratiques dangereuses et un cadre de gestion des risques insuffisant pour ses partenariats avec des fintechs. L'ordre impose notamment un contrôle renforcé des relations, de la tenue des registres et de la conformité aux règles de protection des consommateurs.

La Fed précise que cette mesure est **indépendante** de la faillite de Synapse. Elle documente des faiblesses de supervision chez une banque partenaire, mais ne permet pas d'attribuer à Evolve, à elle seule, l'écart de 60 à 90 millions. Le dossier conserve plusieurs inconnues : la répartition exacte du manque entre programmes, la part imputable à des écritures erronées plutôt qu'à des fonds absents et le montant final récupérable par chaque client.

Cette prudence est essentielle. Le chiffre de 90 millions représente la borne haute de l'estimation du CFPB, pas un montant définitivement « volatilisé ». Evolve et Synapse se sont mutuellement accusées ; la plainte note que leur différend n'était pas résolu. Une enquête rigoureuse doit conserver cette incertitude au lieu de transformer un défaut de réconciliation en conclusion pénale.

## 46,25 millions alloués, pas encore distribués

Le CFPB a engagé une procédure contre Synapse le **21 août 2025**. Le tribunal a rendu le jugement convenu le **12 septembre 2025**. Il interdit notamment la vente des données clients et inflige une pénalité civile symbolique de **1 dollar**, nécessaire pour permettre au Bureau d'utiliser son Civil Penalty Fund au bénéfice des consommateurs lésés.

Le **28 novembre 2025**, l'administrateur de ce fonds a [réservé 46 248 291 dollars aux victimes de Synapse](https://www.consumerfinance.gov/enforcement/payments-harmed-consumers/civil-penalty-fund/). Cette somme provient d'amendes civiles versées au CFPB et mutualisées entre les dossiers ; elle n'est pas financée par l'impôt. Elle ne doit pas être comparée mécaniquement à l'écart brut de 60 à 90 millions, car le fonds indemnise le préjudice restant après prise en compte des sommes déjà restituées ou attendues d'autres sources.

Une allocation n'est pas un virement. Le CFPB explique qu'elle met de l'argent de côté puis lance l'identification des bénéficiaires et le calcul des paiements. Au **30 juillet 2026**, Synapse ne figure pas sur la [liste des distributions en cours ou closes](https://www.consumerfinance.gov/enforcement/payments-harmed-consumers/payments-by-case/), mise à jour le 10 juillet. Le Bureau précise qu'en l'absence d'un dossier sur cette page, la distribution peut ne pas avoir commencé. Les victimes ne peuvent pas déposer spontanément une demande, sauf si le CFPB ouvre ultérieurement une procédure de réclamation.

## Un remède réglementaire encore inachevé

Le 17 septembre 2024, la FDIC a approuvé une proposition de règle visant les comptes de dépôt custodiaux dotés de fonctions de transaction. Publiée au Federal Register le 2 octobre sous le numéro **RIN 3064-AG07**, elle imposerait aux banques concernées de :

- tenir un registre identifiant chaque bénéficiaire et son solde ;
- rapprocher quotidiennement ce registre du solde du compte ;
- conserver un accès direct et continu aux données confiées à un tiers ;
- soumettre les systèmes et contrôles à une validation indépendante.

La mesure traite précisément le point de rupture révélé par Synapse : une banque ne pourrait plus dépendre d'un prestataire pour savoir à qui attribuer les fonds sans disposer elle-même d'un registre accessible et vérifiable. La proposition distingue aussi clairement la garantie des dépôts du risque de faillite, de fraude ou de vol chez une entreprise non bancaire.

Son statut doit toutefois être formulé avec précision. La FDIC a [retiré plusieurs autres projets le 3 mars 2025](https://www.fdic.gov/board/federal-register-notice-withdrawal-proposed-rules-march-3-2025), mais pas celui-ci. Une [recherche du RIN 3064-AG07 dans le Federal Register](https://www.federalregister.gov/api/v1/documents.json?per_page=100&conditions%5Bregulation_id_number%5D=3064-AG07), vérifiée le 30 juillet 2026, ne renvoie que deux documents : la proposition du 2 octobre 2024 et l'extension de sa période de commentaires du 20 novembre. Aucun texte final ni retrait n'y est publié. La règle reste donc proposée, pas en vigueur.

## Le risque à identifier avant de déposer

Synapse ne démontre pas que tous les services BaaS sont dangereux. L'affaire montre qu'un produit apparemment simple peut reposer sur une chaîne de dépendances que le client ne voit pas et qu'une garantie de dépôt ne couvre pas tous les maillons de cette chaîne.

Avant de confier une épargne de précaution à une application non bancaire, quatre questions réduisent l'ambiguïté :

1. **Quelle entité détient juridiquement le dépôt ?** Le nom de la banque assurée doit être explicite, pas seulement un logo.
2. **Les fonds sont-ils déjà à la banque ?** La FDIC ne couvre pas l'argent avant son arrivée dans un établissement assuré.
3. **Qui tient le registre individuel ?** Un compte omnibus exige de savoir qui conserve les écritures par bénéficiaire et à quelle fréquence elles sont rapprochées.
4. **Que prévoit le contrat si l'intermédiaire cesse son activité ?** La continuité d'accès aux données compte autant que la promesse d'assurance.

Pour analyser la solidité de l'établissement qui porte effectivement les dépôts, le [guide de lecture d'une banque](/guides/lire-la-solidite-d-une-banque/) complète cette vérification opérationnelle. Pour replacer Synapse dans l'essor des acteurs situés hors du périmètre bancaire classique, voir aussi l'analyse du [shadow banking et de l'intermédiation non bancaire](/posts/shadow-banking-intermediation-non-bancaire/).

Le grand livre n'était pas une simple composante technique. Il constituait la preuve économique reliant les soldes affichés aux dépôts réels. Quand cette preuve a cessé d'être fiable, l'interface, le contrat et le sceau FDIC n'ont pas suffi. La leçon de Synapse tient dans cette hiérarchie : une promesse de sécurité ne vaut que si les registres permettent encore de savoir précisément qui possède quoi.

---

### Sources primaires

- [CFPB, action contre Synapse Financial Technologies, 21 août 2025, jugement du 12 septembre 2025](https://www.consumerfinance.gov/enforcement/actions/synapse-financial-technologies-inc/)
- [CFPB, plainte dans la procédure de faillite de Synapse, 21 août 2025](https://files.consumerfinance.gov/f/documents/cfpb_synapse-financial-technologies_complaint_2025-08.pdf)
- [Réserve fédérale, mesure d'exécution contre Evolve Bancorp et Evolve Bank & Trust, 14 juin 2024](https://www.federalreserve.gov/newsevents/pressreleases/enforcement20240614a.htm)
- [FDIC, protection des fonds confiés à une application financière non bancaire, juin 2024](https://www.fdic.gov/consumer-resource-center/2024-06/banking-third-party-apps)
- [Federal Register, proposition « Recordkeeping for Custodial Accounts », 2 octobre 2024](https://www.federalregister.gov/documents/2024/10/02/2024-22565/recordkeeping-for-custodial-accounts)
- [Federal Register, extension de la période de commentaires, 20 novembre 2024](https://www.federalregister.gov/documents/2024/11/20/2024-27097/recordkeeping-for-custodial-accounts-extension-of-comment-period)
- [CFPB, Civil Penalty Fund, allocation de 46 248 291 dollars à Synapse, 28 novembre 2025](https://www.consumerfinance.gov/enforcement/payments-harmed-consumers/civil-penalty-fund/)
- [CFPB, distributions aux consommateurs par dossier, mise à jour du 10 juillet 2026](https://www.consumerfinance.gov/enforcement/payments-harmed-consumers/payments-by-case/)
