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
