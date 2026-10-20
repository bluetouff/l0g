export const pressInvestigations = [
  {
    id: 'collateral-that-cannot-leave-the-building',
    headingFr: 'Prêts sur GPU et périmètre du collatéral',
    angle: 'Examine the equipment, customer contract and data centre lease behind GPU-backed lending, then distinguish contractual security from recoverable value.',
    angleFr: 'Examiner les équipements, le contrat client et le bail du centre de données derrière un prêt garanti par des GPU, puis distinguer la sûreté contractuelle de la valeur récupérable.',
    limits: 'The borrower’s disclosures describe the facility. Full credit agreements, enforcement outcomes and comparable liquidation values are unavailable in the investigation; the analysis establishes no realised loss.',
    limitsFr: 'Les publications de l’emprunteur décrivent le financement. Les contrats de crédit complets, les résultats de saisies et des valeurs de liquidation comparables restent indisponibles dans l’enquête ; aucune perte réalisée n’y est établie.',
    atlas: { en: '/en/atlas/ai-financing/', fr: '/atlas/financement-ia/' },
    sources: [
      { label: 'CoreWeave: March 2026 facility announcement filed with the SEC', href: 'https://www.sec.gov/Archives/edgar/data/1769628/000176962826000129/ex991.htm' },
      { label: 'CoreWeave: DDTL 4.0 facility presentation, March 2026', href: 'https://s205.q4cdn.com/133937190/files/doc_presentations/2026/Mar/2026-03-DDTL-4-Overview.pdf' },
    ],
  },
  {
    id: 'greensill-insurance-future-receivables-risk',
    angle: 'How future receivables, insurance coverage and fund redemption terms interact when the underlying trade is uncertain.',
    angleFr: 'Suivre les liens entre créances futures, couverture d’assurance et remboursements des fonds lorsque les opérations commerciales sous-jacentes sont incertaines.',
    limits: 'Keep the distinction between documented receivables, expected future business and disputed insurance coverage. Confidential settlement terms do not establish a public allocation of liability.',
    limitsFr: 'Distinguer les créances documentées, les ventes futures attendues et les couvertures d’assurance contestées. Les modalités confidentielles d’un accord ne permettent pas d’attribuer publiquement les responsabilités.',
    atlas: { en: '/en/atlas/private-credit/', fr: '/atlas/credit-prive/' },
    sources: [
      { label: 'FINMA: Credit Suisse and Greensill', href: 'https://www.finma.ch/en/news/2023/02/20230228-mm-greensill/' },
      { label: 'UK Treasury Committee: Greensill Capital', href: 'https://publications.parliament.uk/pa/cm5802/cmselect/cmtreasy/151/15105.htm' },
    ],
  },
  {
    id: 'aon-blackstone-cortina-reinsurance-risk-pricing',
    angle: 'The underwriting decisions, pricing incentives and concentration risks behind follow-form reinsurance capital.',
    angleFr: 'Examiner la sélection des risques, les incitations tarifaires et les concentrations lorsqu’un apporteur de capital suit les conditions négociées par un réassureur chef de file.',
    limits: 'The reported Cortina proposal excludes life and retrocession. Final approval and operating performance are not established by this investigation. Numerical examples illustrate mechanisms rather than forecast losses or savings.',
    limitsFr: 'Le projet Cortina décrit par la presse exclut la vie et la rétrocession. Cette enquête n’établit ni validation finale ni performance d’exploitation. Les exemples chiffrés illustrent des mécanismes, sans prévoir pertes ou économies.',
    atlas: null,
    sources: [
      { label: 'Lloyd’s: delegated underwriting guidance', href: 'https://www.lloyds.com/market-resources/delegated-authorities/market-knowledge/delegated-underwriting-guidance' },
      { label: 'FCA: wholesale insurance broker market study', href: 'https://www.fca.org.uk/publications/market-studies/ms17-2-wholesale-insurance-broker-market-study' },
    ],
  },
  {
    id: 'banking-on-oil-2-banks-financing-trafigura',
    angle: 'Separate a commodity trader’s committed credit facilities, actual borrowings, collateral and cash needed for margin calls.',
    angleFr: 'Distinguer les lignes de crédit engagées d’un négociant, les emprunts effectivement tirés, le collatéral et les paiements liés aux appels de marge.',
    limits: 'A lender’s name in a facility announcement does not reveal its drawn exposure. Facility commitments, balance-sheet debt and hypothetical stress examples must retain their separate definitions.',
    limitsFr: 'Le nom d’une banque dans une annonce de financement ne révèle pas son exposition tirée. Les engagements de crédit, la dette au bilan et les exemples fictifs de tension conservent leurs définitions propres.',
    atlas: { en: '/en/atlas/oil-financing/', fr: '/atlas/petrole/' },
    sources: [
      { label: 'Trafigura: 2026 half-year financial review', href: 'https://www.trafigura.com/news-and-insights/insights/2026-trafigura-half-year-report/financial-review/' },
      { label: 'Bank of England: July 2022 Financial Stability Report', href: 'https://www.bankofengland.co.uk/financial-stability-report/2022/july-2022' },
    ],
  },
] as const;
