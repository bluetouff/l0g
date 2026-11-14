type DossierCopy = { fr: string; en: string };

export interface AiFinancingReading {
  /** English collection ID; the French article is resolved through sourceArticle. */
  id: string;
  label: DossierCopy;
  note: DossierCopy;
}

export interface AiFinancingSection {
  id: string;
  title: DossierCopy;
  description: DossierCopy;
  image: string;
  readings: AiFinancingReading[];
}

export const aiFinancingNvidiaIds = [
  'nvidia-trump-warning-at-the-top',
  'nvidia-trump-lutnick-national-security-influence',
  'nvidia-huang-nda-board-ai-financing',
  'nvidia-after-huang-singapore-washington-ai-financing',
  'nvidia-trump-tim-cook-lutnick-state-leverage',
  'nvidia-congress-teter-kessler-export-controls',
  'nvidia-ai-financing-guarantees-asian-investigations',
  'nvidia-shanghai-server-collateral-lutnick-bessent',
  'nvidia-china-ai-credit-us-controls-rene-haas',
  'nvidia-fed-nscale-ai-guarantees-credit',
];

export const aiFinancingSections: AiFinancingSection[] = [
  {
    id: 'suppliers',
    title: { fr: 'Les fournisseurs financent leurs clients', en: 'Suppliers finance their customers' },
    description: {
      fr: 'Un vendeur de puces peut aussi investir, prêter ou garantir. Suivre ces liens éclaire la formation des revenus et la répartition des engagements.',
      en: 'Chipmakers can also invest, lend and provide guarantees. Following these relationships helps explain how revenue is generated and obligations are shared.',
    },
    image: '/illustrations/news/anthropic-supplier-financing-v1.jpg',
    readings: [
      {
        id: 'anthropic-supplier-financing-ipo',
        label: { fr: 'Anthropic, financé par ses fournisseurs de calcul', en: 'Anthropic’s suppliers become its investors' },
        note: {
          fr: 'Le projet d’introduction en Bourse rapproche souscriptions au capital, engagements antérieurs et contrats de calcul. Chaque ressource arrive avec ses propres conditions.',
          en: 'The proposed IPO connects equity subscriptions, earlier commitments and compute contracts. Each source of funding comes with conditions that shape its availability.',
        },
      },
      {
        id: 'broadcom-anthropic-blackstone-63-billion-risk',
        label: { fr: 'Broadcom, Anthropic et Blackstone : les garanties du montage', en: 'Broadcom, Anthropic and Blackstone: the guarantees behind the deal' },
        note: {
          fr: 'Une société dédiée porte les équipements, tandis que Broadcom conserve des engagements conditionnels. Certains loyers passent aussi par une dette convertible en actions.',
          en: 'A dedicated vehicle holds the equipment while Broadcom retains conditional obligations. A separate arrangement allows certain rents to be paid with debt convertible into shares.',
        },
      },
      {
        id: 'ai-circular-financing',
        label: { fr: 'La boucle du financement circulaire', en: 'The circular financing loop' },
        note: {
          fr: 'Du fabricant au laboratoire, puis du cloud aux commandes de puces : cette première cartographie expose la circulation du capital et les arguments du débat.',
          en: 'From chipmaker to AI lab, through cloud spending and back to chip orders, this early map sets out the capital flows and competing interpretations.',
        },
      },
      {
        id: 'microsoft-ai-profit-segments-capex-cash-flow',
        label: { fr: 'Microsoft : retrouver le profit et le cash de l’IA', en: 'Microsoft: tracing AI profit and cash' },
        note: {
          fr: 'Les comptes de Microsoft permettent de rapprocher bénéfices, investissements, locations et participation dans OpenAI, en respectant le périmètre de chaque indicateur publié.',
          en: 'Microsoft’s filings connect earnings, capital expenditure, leases and its OpenAI investment. The analysis follows the reporting boundaries behind each published measure.',
        },
      },
    ],
  },
  {
    id: 'funding',
    title: { fr: 'La dette donne des dates aux promesses', en: 'Debt gives the promises a payment date' },
    description: {
      fr: 'Les chantiers absorbent du capital avant de produire leurs revenus. Avances clients, crédits bancaires et intérêts reportés organisent cette attente.',
      en: 'Construction consumes capital before it earns revenue. Customer advances, bank facilities and deferred interest determine how companies bridge that interval.',
    },
    image: '/illustrations/news/oracle-customer-financing-v1.jpg',
    readings: [
      {
        id: 'oracle-who-funds-the-225-billion-buildout',
        label: { fr: 'Oracle construit avec les avances de ses clients', en: 'Oracle builds with customers’ advance payments' },
        note: {
          fr: 'Les avances clients et le crédit fournisseur réduisent les sorties immédiates. Les engagements locatifs prolongent ensuite le financement bien au-delà du chantier.',
          en: 'Customer advances and supplier credit reduce the immediate cash bill. Lease obligations extend the financing timetable well beyond the construction of the facilities.',
        },
      },
      {
        id: 'nebius-citi-364-day-gpu-credit',
        label: { fr: 'Nebius : un crédit court pour une expansion longue', en: 'Nebius: short-term credit for a long buildout' },
        note: {
          fr: 'L’accord Citi se lit avec les avances clients, les garanties et les contrats Microsoft et Meta. Sa marge croissante donne un prix au refinancement.',
          en: 'The Citi agreement sits alongside customer advances, collateral and Microsoft and Meta contracts. Its rising margin adds a cost to the search for longer funding.',
        },
      },
      {
        id: 'softbank-openai-financing-freedom-to-wait',
        label: { fr: 'SoftBank : les échéances du pari OpenAI', en: 'SoftBank’s OpenAI bet: maturities and liquidity' },
        note: {
          fr: 'Obligations, réserves disponibles et clauses liées à la valeur d’OpenAI déterminent combien de temps SoftBank peut conserver ses participations avant de mobiliser du cash.',
          en: 'Bonds, available reserves and clauses tied to OpenAI’s valuation shape SoftBank’s ability to hold its investments while meeting the cash demands of its financing.',
        },
      },
      {
        id: 'ai-pik-financing-cost-of-deferring-interest',
        label: { fr: 'Intérêts reportés : la facture s’accumule', en: 'Deferred interest adds to the eventual bill' },
        note: {
          fr: 'Chez Applied Digital, les financements étudiés préservent le cash immédiat grâce aux intérêts ou dividendes reportés. Les droits prioritaires organisent les paiements futurs.',
          en: 'The Applied Digital arrangements examined preserve immediate cash through deferred interest or dividends. Priority rights determine how later payments and recoveries are allocated.',
        },
      },
    ],
  },
  {
    id: 'collateral',
    title: { fr: 'Les revenus derrière les machines', en: 'The revenue behind the machines' },
    description: {
      fr: 'La valeur d’un processeur graphique, ou GPU, dépend aussi de son client, de son contrat et de son accès à l’électricité. Le prêteur finance cet ensemble.',
      en: 'The value of a graphics processor (GPU) also depends on its customer, contract and access to power. The lender’s protection rests on that operating arrangement.',
    },
    image: '/illustrations/news/gpu-credit-fourth-year-v1.jpg',
    readings: [
      {
        id: 'openai-credit-rating-nvidia-guarantee-ipo',
        label: { fr: 'La note OpenAI et la garantie Nvidia', en: 'OpenAI’s credit rating and Nvidia’s guarantee' },
        note: {
          fr: 'Une clause relie la sortie du garant à la qualité de crédit du locataire. Le financement du campus dépend ainsi de l’évolution financière d’OpenAI.',
          en: 'A contractual clause links the guarantor’s release to the tenant’s credit quality. OpenAI’s financial development can therefore change the protection supporting the campus.',
        },
      },
      {
        id: 'collateral-that-cannot-leave-the-building',
        label: { fr: 'Le collatéral qui ne peut pas sortir du bâtiment', en: 'The collateral that cannot leave the building' },
        note: {
          fr: 'Chez CoreWeave, les sûretés rapprochent équipements, contrat client et bail. La récupération du prêteur dépend du fonctionnement de cet ensemble après un défaut.',
          en: 'CoreWeave’s security packages connect equipment, customer contracts and premises. A lender’s recovery depends on the continued usefulness of those assets together after a default.',
        },
      },
      {
        id: 'gpu-backed-debt-fourth-year',
        label: { fr: 'GPU à crédit : le prix de la quatrième année', en: 'GPU-backed debt: pricing the fourth year' },
        note: {
          fr: 'Les cas CoreWeave et Lambda rapprochent durée du prêt, renouvellement des clients et valeur de revente. Les simulations montrent comment ces hypothèses se combinent.',
          en: 'The CoreWeave and Lambda cases connect loan terms, customer renewals and resale value. The simulations explore how changes in those assumptions affect debt repayment.',
        },
      },
      {
        id: 'ai-compute-price-collapse-gpu-debt',
        label: { fr: 'Le prix du calcul baisse, la dette reste à payer', en: 'Cheaper compute meets yesterday’s GPU debt' },
        note: {
          fr: 'Le tarif au comptant, le revenu réservé par contrat et le coût d’une tâche évoluent différemment. Leur écart peut modifier la capacité de remboursement.',
          en: 'Spot prices, contracted revenue and the cost of completing a task can move differently. The gap between them can change the borrower’s repayment capacity.',
        },
      },
      {
        id: 'how-long-does-ai-server-live',
        label: { fr: 'Serveurs d’IA : durée d’usage et amortissement', en: 'AI servers: useful life and depreciation' },
        note: {
          fr: 'Microsoft, Alphabet, Amazon et Meta ont révisé leurs estimations comptables. Un simulateur permet de suivre l’effet sur les bénéfices et la valeur inscrite au bilan.',
          en: 'Microsoft, Alphabet, Amazon and Meta have revised accounting estimates. A simulator follows the resulting changes in reported earnings and the value carried on the balance sheet.',
        },
      },
    ],
  },
  {
    id: 'risk',
    title: { fr: 'Le risque traverse les bilans', en: 'Risk travels across balance sheets' },
    description: {
      fr: 'Un même projet relie opérateurs, banques, fonds et assureurs. Les contrats précisent les pertes couvertes, les recours et les risques conservés.',
      en: 'One project can connect operators, banks, funds and insurers. Their contracts determine covered losses, rights of recourse and the exposure each party retains.',
    },
    image: '/illustrations/news/ai-loan-insurance-risk-v1.jpg',
    readings: [
      {
        id: 'ai-loan-insurance-banks-reinsurers',
        label: { fr: 'L’assurance des prêts à l’IA', en: 'The insurance behind AI lending' },
        note: {
          fr: 'Une protection contre les impayés peut libérer de la capacité bancaire. L’enquête suit les pertes transférées et les clients communs que retrouvent les réassureurs.',
          en: 'Protection against non-payment can create lending capacity. The investigation follows transferred losses and the common customers that may reappear across reinsurers’ exposures.',
        },
      },
      {
        id: 'nvidia-from-gpu-to-bond-data-center',
        label: { fr: 'COL4 : du bâtiment à l’obligation', en: 'COL4: from data centre to bond financing' },
        note: {
          fr: 'À Columbus, l’installation de clusters est suivie d’un refinancement obligataire. Le cas permet d’identifier l’actif financé et les revenus qui soutiennent les notes.',
          en: 'In Columbus, a cluster deployment is followed by bond refinancing. The case identifies the financed asset and the income streams supporting the securities.',
        },
      },
      {
        id: 'from-data-center-to-money-market-fund-who-bears-the-risk',
        label: { fr: 'La dette des data centers entre dans les fonds', en: 'Data-centre debt reaches investment funds' },
        note: {
          fr: 'Des obligations liées aux centres de données apparaissent dans des fonds cotés, les ETF, et garantissent certains prêts entre acteurs financiers. L’enquête retrace ces canaux de diffusion.',
          en: 'Data-centre securities appear in exchange-traded funds, or ETFs, and secure some loans between financial institutions. The investigation traces these routes into other balance sheets.',
        },
      },
      {
        id: 'residual-value-guarantee-ai-infrastructure-credit',
        label: { fr: 'La garantie de valeur résiduelle', en: 'The residual value guarantee' },
        note: {
          fr: 'Le montage étudié autour de Meta Hyperion relie financement, location et valeur future garantie. Les engagements survivent à la séparation juridique des véhicules.',
          en: 'The Meta Hyperion structure connects financing, leases and a guaranteed future value. Contractual commitments link parties whose assets sit in separate legal vehicles.',
        },
      },
      {
        id: 'when-meta-data-center-too-big-insurance-sopaipilla',
        label: { fr: 'Sopaipilla : les limites de l’assurance dommages', en: 'Sopaipilla: the limits of property insurance' },
        note: {
          fr: 'Le campus Meta et BlackRock permet de comparer investissement immobilier et protection contre les dommages, puis d’examiner la répartition du risque restant.',
          en: 'The Meta and BlackRock campus provides a case for comparing infrastructure investment with property damage protection and examining how the remaining exposure is allocated.',
        },
      },
    ],
  },
  {
    id: 'infrastructure',
    title: { fr: 'Le financement arrive au réseau électrique', en: 'The financing reaches the power grid' },
    description: {
      fr: 'Une capacité annoncée doit être construite, raccordée et alimentée. Ces étapes engagent des industriels, des réseaux et parfois les finances publiques.',
      en: 'Announced capacity needs construction, grid connections and electricity. These steps commit manufacturers, utilities and, in some cases, public resources.',
    },
    image: '/illustrations/news/tsmc-puces-electricite-v1.jpg',
    readings: [
      {
        id: 'tsmc-chip-demand-data-center-power-risk',
        label: { fr: 'TSMC suit les puces jusqu’au raccordement', en: 'TSMC follows chip demand to the grid connection' },
        note: {
          fr: 'Pour apprécier la demande, TSMC examine l’avancement des centres de données et leur alimentation. Un retard électrique peut remonter jusqu’aux investissements des usines.',
          en: 'TSMC examines data-centre construction and power availability when assessing demand. Delays in electricity infrastructure can feed back into the investment decisions behind chip factories.',
        },
      },
      {
        id: 'google-ozans-who-pays-for-the-infrastructure',
        label: { fr: 'Google à Ozans : le coût des réseaux', en: 'Google at Ozans: the cost of shared networks' },
        note: {
          fr: 'Autour du projet de campus dans l’Indre, raccordements, routes et eau mobilisent des infrastructures collectives. Les documents permettent de suivre leurs conditions de financement.',
          en: 'The proposed campus in central France depends on shared power, road and water infrastructure. The investigation follows the documents governing those costs and their financing.',
        },
      },
      {
        id: 'the-ghost-kilowatt',
        label: { fr: 'Le réseau électrique face au chantier abandonné', en: 'The grid faces the risk of an abandoned project' },
        note: {
          fr: 'Engagements minimaux, dépôts de garantie et tarifs organisent le paiement des travaux. Leur lecture révèle comment un projet annulé peut laisser une facture au réseau.',
          en: 'Minimum commitments, security deposits and tariffs govern payment for grid work. Their terms determine where the bill falls when an expected project fails to arrive.',
        },
      },
      {
        id: 'pjm-electricity-forecast-7-billion',
        label: { fr: 'PJM : les prévisions de demande déplacent la facture', en: 'PJM: demand forecasts move the capacity bill' },
        note: {
          fr: 'Une simulation de l’enchère de capacité mesure l’effet d’une demande prévisionnelle de data centers. L’article distingue les revenus modélisés et les coûts effectivement supportés.',
          en: 'A capacity auction simulation estimates the effect of forecast data-centre demand. The article separates modelled auction revenue from the costs ultimately borne by customers.',
        },
      },
    ],
  },
];

export const aiFinancingGuides: { id: string; note: DossierCopy }[] = [
  {
    id: 'how-to-read-10-k-sec',
    note: {
      fr: 'Retrouver les engagements, garanties, parties liées et estimations comptables dans le rapport annuel déposé auprès de la SEC.',
      en: 'Find commitments, guarantees, related-party transactions and accounting estimates in the annual report filed with the SEC.',
    },
  },
  {
    id: 'read-corporate-debt',
    note: {
      fr: 'Rapprocher échéances, trésorerie disponible, sûretés et clauses financières au sein du périmètre de chaque emprunteur.',
      en: 'Compare maturities, available cash, collateral and covenants within the reporting perimeter of each borrower.',
    },
  },
  {
    id: 'from-earnings-to-cash-working-capital-investment',
    note: {
      fr: 'Passer du bénéfice aux flux d’exploitation, puis retrancher les investissements pour examiner les besoins de financement.',
      en: 'Reconcile earnings with operating cash, then account for investment spending to assess the resulting funding needs.',
    },
  },
  {
    id: 'read-credit-ratings',
    note: {
      fr: 'Identifier l’entité ou l’instrument noté, comprendre l’échelle et examiner les garanties prises en compte par l’agence.',
      en: 'Identify the rated entity or instrument, read the scale and examine the guarantees considered by the rating agency.',
    },
  },
];
