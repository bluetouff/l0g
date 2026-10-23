import type { GlossaryReferenceLink, GlossaryReferencePage } from './glossary-reference-fr.ts';

const sources = {
  rules: 'https://www.ecfr.gov/current/title-31/subtitle-B/chapter-II/subchapter-A/part-375',
  faq: 'https://www.treasurydirect.gov/help-center/faqs/buyback-faqs/',
  results: 'https://www.treasurydirect.gov/auctions/buy-backs/',
  agent: 'https://www.newyorkfed.org/markets/treasury-debt-auctions-and-buybacks-as-fiscal-agent',
  funding: 'https://home.treasury.gov/system/files/221/CombinedChargesforArchivesQ22024.pdf',
  amendment: 'https://www.treasurydirect.gov/laws-and-regulations/buyback-rules/',
};

const link = (label: string, href: string, detail = ''): GlossaryReferenceLink => ({ label, href, detail });

// An invented nominal-bond operation, expressed in USD millions. No live prices.
export const treasuryBuybackExample = Object.freeze({
  maximumPar: 200,
  offeredPar: 450,
  acceptedPar: 100,
  weightedCleanPricePer100: 98,
  accruedInterest: 1,
  cleanPayment: 98,
  settlementPayment: 99,
});

export const treasuryBuybackReferenceFr: GlossaryReferencePage = {
  updatedIso: '2026-10-23',
  mechanism: 'treasury-buyback',
  standfirst: 'Un Treasury buyback fait circuler deux choses en sens inverse : des titres anciens reviennent au Trésor américain, qui verse leur prix aux vendeurs. Pour lire une opération, il faut relier son avis final aux offres reçues, aux montants acceptés et au règlement. Le nominal annoncé, le nominal retiré et le cash payé décrivent trois étapes différentes.',
  relatedSlugs: ['off-the-run', 'adjudication', 'tga', 't-bill', 'duration', 'risque-de-refinancement'],
  datedFact: {
    label: 'Règles vérifiées le 23 octobre 2026',
    text: 'La modification publiée le 30 mars 2026 reconnaît, à côté des primary dealers, les entités directement agréées par le Trésor. Un détenteur ordinaire passe par un soumissionnaire habilité. Les anciennes descriptions réservant toute soumission directe aux seuls primary dealers doivent donc être datées.',
    sourceHref: sources.amendment,
  },
  sections: [
    {
      title: 'Commencer par l’objectif et le dernier avis',
      paragraphs: [
        'Le soutien à la liquidité offre aux acteurs du marché une possibilité régulière de vendre des titres off-the-run, les anciennes souches devenues moins négociées. La gestion de trésorerie cherche à lisser l’encaisse et les émissions de bills autour des besoins de paiement et des recettes. Ces objectifs guident la lecture ; une opération régulière ne suffit pas à établir une intervention contre une crise de marché.',
        'Le calendrier trimestriel indique un programme prévisionnel. L’avis préliminaire prépare l’opération ; l’avis final fixe la liste de titres applicable. Conserver cet avis avec sa date, son heure et sa date de règlement permet d’éviter de commenter un programme annoncé comme un achat déjà réalisé. Les modalités de l’avis prévalent en cas de divergence avec la règle générale.',
      ],
      sources: [link('New York Fed : objectifs et rôle', sources.agent), link('31 CFR 375.10 : avis applicable', sources.rules)],
    },
    {
      title: 'Identifier les titres et les unités',
      paragraphs: [
        'Le CUSIP est l’identifiant d’un titre. Il accompagne son coupon, son échéance et le montant nominal : la somme de principal portée par l’obligation. Une enveloppe de rachat exprimée en nominal ne mesure pas encore la dépense de trésorerie. Le prix de marché peut placer cette dépense au-dessus ou au-dessous du principal, auquel s’ajoutent les intérêts courus.',
        'Relever pour chaque opération le type de titre, la tranche de maturité, le plafond de nominal et les dates permet ensuite de rapprocher les bons fichiers. Une échéance située dans la tranche annoncée ne rend pas automatiquement un titre admissible : la liste finale et les exclusions restent déterminantes. Pour un TIPS, le principal indexé ajoute un traitement spécifique ; l’exemple ci-dessous porte exclusivement sur une obligation nominale.',
      ],
      sources: [link('Treasury : champs des annonces et résultats', sources.results), link('31 CFR 375.2 : définitions', sources.rules)],
    },
    {
      title: 'Passer des offres aux achats acceptés',
      paragraphs: [
        'Les participants proposent de livrer un montant de titres à un prix donné. Le prix est exprimé pour 100 dollars de nominal. Le processus est à prix multiples : chaque offre retenue est rémunérée à son propre prix. L’évaluation tient compte des prix de marché et de la valeur relative des titres ; comparer seulement deux prix bruts d’obligations différentes ferait perdre leurs coupons et leurs maturités.',
        'Le résultat agrégé permet de comparer nominal offert, nominal accepté et plafond annoncé, puis de descendre au détail par titre et au prix moyen pondéré accepté. Un plafond constitue une capacité maximale. Le Trésor peut acheter moins, voire ne rien accepter. Un montant offert élevé indique des propositions de vente dans ce cadre ; son interprétation exige les prix et le contexte, au-delà d’un simple ratio de couverture.',
      ],
      sources: [link('Treasury : soumissions, acceptation et résultats', sources.faq), link('Treasury : données détaillées', sources.results)],
    },
    {
      title: 'Un exemple entièrement fictif',
      paragraphs: [
        'Supposons un avis autorisant au maximum 200 millions de dollars de nominal. Les offres totalisent 450 millions, mais le Trésor en accepte 100 millions sur un titre A inventé. Le prix moyen pondéré accepté est 98 pour 100 de nominal. Ces valeurs servent uniquement à expliquer les comptes : elles ne correspondent à aucun CUSIP, cours ou résultat réel.',
        'La composante de prix vaut 100 × 98 / 100 = 98 millions de dollars. En supposant 1 million d’intérêts courus pour l’ensemble accepté, le paiement atteint 99 millions. L’opération utilise la moitié de son plafond de nominal et retire 100 millions de principal. Les 450 millions offerts, les 200 millions autorisés et les 99 millions payés ne représentent donc pas trois mesures interchangeables d’un même achat.',
        'La moyenne des prix sert ici à reconstituer le total du titre. Elle ne signifie pas que chaque vendeur a reçu 98. Un tableau d’acceptations individuelles pourrait contenir plusieurs prix dont la pondération par les montants acceptés donne cette moyenne. Le règlement effectif demeure la pièce qui clôt la livraison et le paiement.',
      ],
      sources: [link('Méthode de règlement : 31 CFR 375.2 et 375.23', sources.rules)],
    },
    {
      title: 'Suivre le règlement et son financement',
      paragraphs: [
        'La New York Fed exécute l’opération comme agent financier du Trésor. Elle reçoit les titres et traite le paiement dans ce rôle. Le calendrier de règlement figure dans l’avis ; il faut le vérifier plutôt que supposer que publication des résultats et transfert des fonds se confondent. Les titres rachetés sont retirés au règlement.',
        'Le rachat consomme de la trésorerie publique. Celle-ci peut provenir de recettes ou d’émissions de dette, selon l’ensemble du financement de l’État. Dans sa présentation de 2024, le Trésor précise que les rachats créent des besoins de financement et qu’il ne cherche pas à faire correspondre chaque rachat à une nouvelle émission de même maturité. Le retrait d’un ancien titre ne démontre donc pas une diminution équivalente de la dette totale.',
      ],
      sources: [link('New York Fed : agent financier', sources.agent), link('Treasury, 2024 : diapositive 8, page PDF 64', sources.funding), link('Treasury : retrait des titres', sources.faq)],
    },
    {
      title: 'Construire une lecture comparable',
      paragraphs: [
        'Un relevé utile conserve séparément objectif, échéance des titres, plafond, offres, achats acceptés, prix et règlement. La comparaison porte ensuite sur des opérations de même nature, avec leurs conditions de marché. Une succession d’achats réguliers ne renseigne pas directement sur le coût de financement de l’État, la baisse des taux ou l’amélioration des fourchettes de cotation.',
        'Pour étudier un effet de liquidité, ajouter des observations datées de profondeur de marché, de volumes et de prix autour des titres concernés. Cette fiche décrit la chaîne documentaire et comptable ; elle ne propose aucune estimation causale. Le résultat d’une opération constitue un point d’entrée vérifiable dans l’analyse du marché secondaire.',
      ],
      sources: [link('Treasury : historique et fichiers d’opération', sources.results)],
    },
  ],
  limitation: 'Les règles et pratiques décrites ont été vérifiées le 23 octobre 2026. L’avis de chaque opération demeure la référence pour ses modalités. L’exemple fictif exclut les TIPS, les frais privés et toute estimation de gain de liquidité. Aucun montant actuel de programme, prix de marché ou effet sur les rendements n’est déduit de cet exercice.',
  analyses: [link('Bessent et les rachats du Trésor', '/posts/bessent-put-treasury-buybacks-taux-longs/', 'Une analyse datée du contexte politique et du marché.'), link('La dette américaine et son teneur de marché', '/posts/tresor-americain-market-maker-dette-paradoxe-fed/', 'Examiner la place des intermédiaires et le financement public.')],
  instruments: [link('Lire le marché des Treasuries', '/guides/lire-le-marche-des-treasuries/', 'Émission, adjudications et structure du marché.'), link('Liquidité du Trésor : DTS, TGA et RRP', '/guides/liquidite-tresor-dts-tga-rrp/', 'Suivre les comptes et flux de trésorerie.')],
  primarySources: [link('TreasuryDirect : annonces et résultats', sources.results, 'Avis, CUSIP, nominal offert et accepté, prix pondérés et règlement.'), link('31 CFR Part 375', sources.rules, 'Règles, définitions et modalités de règlement.'), link('TreasuryDirect : FAQ', sources.faq, 'Pratiques opérationnelles et retrait des titres.'), link('New York Fed : rôle d’agent financier', sources.agent, 'Exécution sur instruction du Trésor.'), link('Treasury : programme de 2024', sources.funding, 'Diapositive 8, page PDF 64 : financement et absence d’appariement par maturité.'), link('Treasury : modification du 30 mars 2026', sources.amendment, 'Élargissement des soumissions directes.')],
};

export const treasuryBuybackReferenceEn: GlossaryReferencePage = {
  updatedIso: '2026-10-23',
  mechanism: 'treasury-buyback',
  standfirst: 'A Treasury buyback sends securities and money in opposite directions. Investors deliver older bonds to the US Treasury, which pays the accepted prices and retires the securities. Reading an operation means connecting its final announcement with submitted offers, accepted amounts and settlement. The announced limit, the principal retired and the cash payment describe different stages of that process.',
  relatedSlugs: ['adjudication', 'tga', 'duration', 'risque-de-refinancement'],
  datedFact: { label: 'Rules checked on 23 October 2026', text: 'The amendment published on 30 March 2026 recognises Treasury-approved direct participants alongside primary dealers. Other holders arrange submission through an eligible submitter. Descriptions restricting every direct submission to primary dealers therefore need an observation date.', sourceHref: sources.amendment },
  sections: [
    {
      title: 'Establish the objective and the controlling announcement',
      paragraphs: [
        'Liquidity-support operations provide a regular opportunity to sell off-the-run securities, the older issues that tend to trade less actively. Cash-management operations help smooth Treasury’s cash balance and bill issuance around receipts and payments. The objective gives the operation its setting. The existence of a regular purchase programme alone establishes no intervention against an acute market crisis.',
        'A quarterly schedule describes intended operations. A preliminary announcement prepares a particular purchase, while its final announcement supplies the applicable eligible-security list. Keep that final document with its operation time and settlement date. This separates a planned capacity from a completed transaction. When the announcement differs from the general redemption rules, the announcement governs the operation.',
      ],
      sources: [link('New York Fed: objectives and agency role', sources.agent), link('31 CFR 375.10: controlling announcement', sources.rules)],
    },
    {
      title: 'Identify the security and the unit',
      paragraphs: [
        'A CUSIP identifies a particular security. Read it alongside the coupon, maturity and par amount, the principal carried by the bond. A limit stated in par is not yet a cash budget. Market prices can make the purchase component of the payment higher or lower than principal, before accrued interest is added.',
        'Record the security type, maturity bucket, maximum par amount and relevant dates before matching files. Falling within a maturity range does not by itself establish eligibility: the final list and exclusions still apply. Inflation-linked TIPS require additional treatment of indexed principal. The worked example here uses an ordinary nominal bond so that the distinction between par and payment remains clear.',
      ],
      sources: [link('Treasury: announcement and result fields', sources.results), link('31 CFR 375.2: definitions', sources.rules)],
    },
    {
      title: 'Read offers and accepted amounts together',
      paragraphs: [
        'Participants offer a quantity of a security at a stated price per $100 of par. Buybacks use a multiple-price process: successful offers receive their own offered prices. Evaluation considers prevailing market prices and relative value. Comparing raw prices across different bonds would lose the coupons and maturity structures that help determine those prices.',
        'The published results show total par offered, total par accepted, the amount accepted for each security and its weighted average accepted price. Compare the accepted total with the announced maximum, then examine individual issues. Treasury can purchase below the limit or accept nothing. A large offered amount records proposals to sell under these terms; interpreting it also requires prices and market conditions.',
      ],
      sources: [link('Treasury: offers and acceptance', sources.faq), link('Treasury: detailed results', sources.results)],
    },
    {
      title: 'A wholly fictional operation',
      paragraphs: [
        'Assume an announcement permits up to $200 million of par. Participants offer $450 million, but Treasury accepts $100 million of an invented security A. The weighted average accepted price is 98 per $100 of par. These inputs are a teaching exercise: they describe no real CUSIP, market quote or published operation.',
        'The clean-price component is 100 × 98 / 100 = $98 million. Assume total accrued interest of $1 million on the accepted securities. Settlement then requires $99 million of cash while retiring $100 million of principal. The purchase uses half the announced par capacity. The $450 million offered, $200 million ceiling and $99 million cash payment therefore answer different questions.',
        'A weighted average reconstructs the total purchase component for this nominal security; it does not imply that every seller received 98. Individual accepted offers could have different prices whose amount-weighted average equals that figure. The operational record still needs completed delivery and payment before the chain is closed.',
      ],
      sources: [link('Settlement method: 31 CFR 375.2 and 375.23', sources.rules)],
    },
    {
      title: 'Follow settlement into the funding account',
      paragraphs: [
        'The New York Fed carries out the purchase as Treasury’s fiscal agent. In that capacity it receives securities and processes Treasury’s payment. Check the settlement date specified in the announcement: publication of the result and movement of the money are separate events. Purchased securities are retired upon settlement.',
        'Buying a bond uses public cash. Tax receipts or borrowing can supply that cash within the government’s overall financing. Treasury’s 2024 programme presentation explains that buyback spending creates financing needs and that replacement issuance is not directly matched to each purchased maturity. Retiring one old bond therefore provides no evidence of an equal reduction in aggregate debt. The financing side belongs in the same analysis as the retired security.',
      ],
      sources: [link('New York Fed: fiscal agency', sources.agent), link('Treasury, 2024: slide 8, PDF page 64', sources.funding), link('Treasury: retirement of securities', sources.faq)],
    },
    {
      title: 'Build a comparable observation',
      paragraphs: [
        'Keep objective, maturity, announced limit, offers, accepted purchases, prices and settlement in separate fields. Compare operations of a similar kind with their market setting attached. A recurring purchase total does not directly measure the government’s funding cost, a change in yields or an improvement in bid-ask spreads. These outcomes require their own observations.',
        'A liquidity investigation would add dated evidence on market depth, trading activity and prices for the relevant securities. It would also need a comparison capable of separating the operation from other market developments. This reference supplies the document trail and the accounting distinctions, rather than a causal estimate. The result of a single operation is a verifiable starting point for studying the secondary market.',
        'For continuing work, preserve the original announcement and result instead of replacing an old observation with a later aggregate. Record their dates and identifiers together. This makes a future correction traceable and keeps a revised programme schedule separate from transactions that have already settled.',
      ],
      sources: [link('Treasury: operation history and downloadable files', sources.results)],
    },
  ],
  limitation: 'Rules and practices were checked on 23 October 2026. Each operation’s announcement remains the reference for its terms. The hypothetical example excludes TIPS, private fees and any estimate of liquidity benefits. It supplies no current programme total, market price or forecast of yields. Public aggregate results cannot reconstruct every participant’s trading or funding decision.',
  analyses: [link('Bessent and Treasury buybacks', '/en/analysis/bessent-yield-threshold-30-year-treasury/', 'A dated investigation of policy and market conditions.'), link('Treasury debt and its market makers', '/en/analysis/us-treasury-market-maker-debt-fed-paradox/', 'Intermediation and government funding.')],
  instruments: [link('Read the US Treasury market', '/en/guides/read-us-treasuries-market/', 'Issuance, auctions and market structure.'), link('Read net liquidity: TGA and RRP', '/en/guides/read-net-liquidity-tga-rrp/', 'Accounts and cash movements.')],
  primarySources: [link('TreasuryDirect: announcements and results', sources.results, 'Announcements, security identifiers, offered and accepted par, prices and settlement.'), link('31 CFR Part 375', sources.rules, 'Definitions, governing rules and settlement.'), link('TreasuryDirect: FAQs', sources.faq, 'Operational practices and retirement.'), link('New York Fed: fiscal agency', sources.agent, 'Execution on Treasury instructions.'), link('Treasury: 2024 programme', sources.funding, 'Slide 8, PDF page 64: financing needs and maturity matching.'), link('Treasury: 30 March 2026 amendment', sources.amendment, 'Expanded direct submission eligibility.')],
};

export const glossaryReferenceEnBySlug: Record<string, GlossaryReferencePage> = {
  'treasury-buyback': treasuryBuybackReferenceEn,
};
