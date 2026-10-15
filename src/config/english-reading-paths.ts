export type EnglishReadingPath = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  transmission: string;
  analysisIds: readonly string[];
  guideIds: readonly string[];
};

export const asiaReadingPaths: readonly EnglishReadingPath[] = [
  {
    id: 'japan-yen',
    eyebrow: 'rates · currency · global liquidity',
    title: 'Japan, the yen and the price of global funding',
    description: 'Follow the BoJ, Japanese government bonds and the yen carry trade from Tokyo into Treasuries, currencies and leveraged portfolios.',
    transmission: 'JGB yields → yen funding → repatriation → global asset prices',
    analysisIds: [
      'yen-163412-net-short-contracts-before-shock',
      'japan-fiscal-dominance-honebuto-shock-boj-cornered',
      'the-yen-carry-trade',
      'dollar-yen-intervention-carry-unwind',
      'japan-end-free-money-life-insurer-balance-sheets',
    ],
    guideIds: ['read-the-carry-trade', 'read-dollar-dxy-cross-currency-basis'],
  },
  {
    id: 'korea-credit',
    eyebrow: 'semiconductors · leverage · household credit',
    title: 'South Korea, from chip concentration to housing credit',
    description: 'Read the KOSPI, leveraged market structures and jeonse deposits as connected balance-sheet risks rather than isolated Korean stories.',
    transmission: 'chip cycle → index concentration → collateral → households',
    analysisIds: [
      'south-korea-jeonse-hidden-housing-credit',
      'kospi-concentrated-liquidation-samsung-sk-hynix',
      'semiconductors-a-stack-of-constraints',
      'south-korea-price-perfect-fx-hedge',
    ],
    guideIds: ['read-credit-ratings'],
  },
  {
    id: 'china-rmb',
    eyebrow: 'renminbi · property · commodities',
    title: 'China, where domestic stress meets cross-border power',
    description: 'Separate the slow property adjustment from the expansion of RMB settlement, commodity bargaining power and lower-cost AI models.',
    transmission: 'property and credit → trade settlement → commodities → global margins',
    analysisIds: [
      'renminbi-monetary-zone-asia',
      'chinese-real-estate-risk',
      'china-open-source-ai-strategy-vs-capex-bubble',
      'china-crude-imports-fall-market-power',
    ],
    guideIds: ['read-tic-data-us-debt'],
  },
  {
    id: 'insurer-nodes',
    eyebrow: 'insurers · dollar assets · capital controls',
    title: 'Taiwan and Hong Kong as balance-sheet nodes',
    description: 'Use life insurers, currency hedges and policy enforcement to see how Asian savings connect to dollar assets and cross-border capital controls.',
    transmission: 'local savings → dollar portfolios → hedging costs → policy response',
    analysisIds: [
      'taiwan-life-insurers-724-billion-currency-risk',
      'hong-kong-life-insurance-china-tax-enforcement',
      'asia-invisible-dollar-hedging-machine',
      'asia-dollar-stop-buying',
    ],
    guideIds: ['read-life-insurer-health', 'read-dollar-dxy-cross-currency-basis', 'read-the-balance-of-payments'],
  },
] as const;

const curatedAsiaAnalysisIds = new Set(asiaReadingPaths.flatMap((path) => path.analysisIds));
const asiaTags = new Set([
  'asia',
  'asean',
  'boj',
  'china',
  'hong kong',
  'india',
  'japan',
  'jgb',
  'kospi',
  'renminbi',
  'singapore',
  'south korea',
  'taiwan',
  'yen',
]);

export function isAsiaAnalysis(id: string, tags: readonly string[]): boolean {
  return curatedAsiaAnalysisIds.has(id) || tags.some((tag) => asiaTags.has(tag.trim().toLowerCase()));
}

// Deliberate editorial neighbours, not broad tag matches or a site-wide link list.
export const financingReadingPaths = [
  {
    id: 'ai-financing',
    title: 'AI infrastructure, collateral and financing commitments',
    description: 'Connect customer contracts, equipment collateral and funding commitments through the documented transactions in the atlas.',
    atlasHref: '/en/atlas/ai-financing/',
    atlasLabel: 'Explore the AI financing atlas',
    analysisIds: [
      'collateral-that-cannot-leave-the-building',
      'residual-value-guarantee-ai-infrastructure-credit',
      'nvidia-the-500-billion-that-does-not-exist-yet',
      'softbank-openai-financing-freedom-to-wait',
    ],
    guideIds: [],
  },
  {
    id: 'private-credit',
    title: 'Private credit, insurance and the funding chain',
    description: 'Follow the links between loans, temporary financing, insurance and the conditions governing repayment.',
    atlasHref: '/en/atlas/private-credit/',
    atlasLabel: 'Explore the private credit atlas',
    analysisIds: [
      'private-credit-clo-warehouse-banks',
      'greensill-insurance-future-receivables-risk',
      'radiant-world-disputed-invoices-trade-finance',
      'aon-blackstone-cortina-reinsurance-risk-pricing',
      'semi-liquid-private-credit-gating',
    ],
    guideIds: ['read-private-credit-risk'],
  },
  {
    id: 'oil-financing',
    title: 'Oil trading, bank credit and public revenues',
    description: 'Trace the funding of cargoes and traders, then compare those arrangements with loans backed by future public revenues.',
    atlasHref: '/en/atlas/oil-financing/',
    atlasLabel: 'Explore the oil financing atlas',
    analysisIds: [
      'banking-on-oil-2-banks-financing-trafigura',
      'banking-on-oil-4-trafigura-platts-fuel-oil-benchmark',
      'banking-on-oil-5-vitol-refineries-terminals-engen',
      'banking-on-oil-7-trafigura-petrobras-bribery',
    ],
    guideIds: [],
  },
] satisfies (Omit<EnglishReadingPath, 'eyebrow' | 'transmission'> & { atlasHref: string; atlasLabel: string })[];
