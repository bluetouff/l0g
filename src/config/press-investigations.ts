export const pressInvestigations = [
  {
    id: 'greensill-insurance-future-receivables-risk',
    angle: 'How future receivables, insurance coverage and fund redemption terms interact when the underlying trade is uncertain.',
    limits: 'Keep the distinction between documented receivables, expected future business and disputed insurance coverage. Confidential settlement terms do not establish a public allocation of liability.',
    sources: [
      { label: 'FINMA: Credit Suisse and Greensill', href: 'https://www.finma.ch/en/news/2023/02/20230228-mm-greensill/' },
      { label: 'UK Treasury Committee: Greensill Capital', href: 'https://publications.parliament.uk/pa/cm5802/cmselect/cmtreasy/151/15105.htm' },
    ],
  },
  {
    id: 'aon-blackstone-cortina-reinsurance-risk-pricing',
    angle: 'The underwriting decisions, pricing incentives and concentration risks behind follow-form reinsurance capital.',
    limits: 'A proposed structure is not proof of final approval or operating performance. The numerical examples explain mechanisms and are not forecasts of Cortina losses or savings.',
    sources: [
      { label: 'Lloyd’s: delegated underwriting guidance', href: 'https://www.lloyds.com/market-resources/delegated-authorities/market-knowledge/delegated-underwriting-guidance' },
      { label: 'FCA: wholesale insurance broker market study', href: 'https://www.fca.org.uk/publications/market-studies/ms17-2-wholesale-insurance-broker-market-study' },
    ],
  },
  {
    id: 'banking-on-oil-2-banks-financing-trafigura',
    angle: 'Separate a commodity trader’s committed credit facilities, actual borrowings, collateral and cash needed for margin calls.',
    limits: 'A lender’s name in a facility announcement does not reveal its drawn exposure. Facility commitments, balance-sheet debt and hypothetical stress examples must retain their separate definitions.',
    sources: [
      { label: 'Trafigura: 2026 half-year financial review', href: 'https://www.trafigura.com/news-and-insights/insights/2026-trafigura-half-year-report/financial-review/' },
      { label: 'Bank of England: July 2022 Financial Stability Report', href: 'https://www.bankofengland.co.uk/financial-stability-report/2022/july-2022' },
    ],
  },
] as const;
