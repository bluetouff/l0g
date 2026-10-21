import { sortPostsByPublicationDate } from '../lib/content-order.mjs';

export type EnglishReadingPath = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  transmission: string;
  analysisIds: readonly string[];
  guideIds: readonly string[];
};

export type AsiaDollarStage = {
  title: string;
  description: string;
  readings: readonly { id: string; label: string }[];
  tool?: { fragment: string; label: string };
};

export const asiaDollarStages: readonly AsiaDollarStage[] = [
  {
    title: 'Map the assets',
    description: 'Start with the securities held in the US and the different risks inside a dollar portfolio.',
    readings: [{ id: 'what-asia-really-buys-in-america', label: 'Equities, Treasuries, mortgages and credit' }],
    tool: { fragment: 'asia-us-portfolio-en-embed', label: 'Explore portfolio shocks' },
  },
  {
    title: 'Identify the holders',
    description: 'Read the assets alongside the liabilities, policyholders and institutions behind them.',
    readings: [
      { id: 'taiwan-life-insurers-724-billion-currency-risk', label: 'Taiwan: life insurers and currency exposure' },
      { id: 'japan-end-free-money-life-insurer-balance-sheets', label: 'Japan: rates and insurer balance sheets' },
      { id: 'south-korea-price-perfect-fx-hedge', label: 'South Korea: the cost of currency protection' },
      { id: 'china-dollar-risk-reserves-banks-balance-sheets', label: 'China: reserves, banks and other holders' },
      { id: 'hong-kong-life-insurance-china-tax-enforcement', label: 'Hong Kong: insurance and capital controls' },
    ],
  },
  {
    title: 'Follow the hedge',
    description: 'Trace short currency contracts against long assets, through renewals, dealers and collateral.',
    readings: [{ id: 'asia-invisible-dollar-hedging-machine', label: 'Inside the dollar hedging machinery' }],
    tool: { fragment: 'asia-dollar-hedge-en-embed', label: 'Explore hedge renewals' },
  },
  {
    title: 'Test the cash constraint',
    description: 'Combine bond losses, exchange-rate moves and payments due in an explicit hypothetical scenario.',
    readings: [{ id: 'asia-dollar-stress-test-three-risks', label: 'Three risks, two ledgers' }],
    tool: { fragment: 'asia-triple-en', label: 'Run the liquidity stress test' },
  },
  {
    title: 'Track the next buyer',
    description: 'Distinguish selling existing holdings from reducing reinvestment and new purchases.',
    readings: [{ id: 'asia-dollar-stop-buying', label: 'Asian demand and the marginal dollar buyer' }],
    tool: { fragment: 'ad9-tool-en', label: 'Explore a purchase slowdown' },
  },
];

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
    eyebrow: 'the Asian dollar loop',
    title: 'Asian savings and dollar risk',
    description: 'Follow the complete reading path from dollar assets and their holders to currency hedges, liquidity and new purchases.',
    transmission: 'savings → dollar assets → currency hedges → cash needs → new purchases',
    analysisIds: asiaDollarStages.flatMap((stage) => stage.readings.map((reading) => reading.id)),
    guideIds: ['read-life-insurer-health', 'read-dollar-dxy-cross-currency-basis', 'read-the-balance-of-payments'],
  },
] as const;

const curatedAsiaAnalysisIds = new Set(asiaReadingPaths.flatMap((path) => path.analysisIds));
// Explicit editorial tags remain useful when a subject has no place name in its headline.
const asiaTags = new Set([
  'asia', 'asie', 'asian', 'asean', 'apac', 'boj', 'jgb', 'kospi', 'renminbi', 'rmb', 'yen',
  'bank of japan', 'bank of korea', 'pboc', 'chine', 'japon', 'inde', 'corée du sud',
]);

// Match whole geographic terms in editorial metadata, never incidental body/source mentions.
// Keep ambiguous terms (won, BoJ, JGB) in tags rather than matching ordinary prose.
const asiaGeography = /(?:^|[^\p{L}\p{N}])(?:asia|asian|asean|apac|japan|japanese|tokyo|china|chinese|beijing|shanghai|hong kong|taiwan|taiwanese|taipei|korea|korean|seoul|india|indian|indonesia|indonesian|singapore|singaporean|malaysia|malaysian|vietnam|vietnamese|viet nam|thailand|thai|philippines|philippine|filipino|bangladesh|bangladeshi|pakistan|pakistani|sri lanka|sri lankan|nepal|nepalese|bhutan|bhutanese|maldives|maldivian|myanmar|burmese|cambodia|cambodian|laos|laotian|brunei|timor-leste|mongolia|mongolian|kazakhstan|kazakh|uzbekistan|uzbek|kyrgyzstan|kyrgyz|tajikistan|tajik|turkmenistan|turkmen|renminbi|yen)(?=$|[^\p{L}\p{N}])/iu;

type AsiaMetadata = { title?: string; description?: string };

export function isAsiaAnalysis(id: string, tags: readonly string[], metadata: AsiaMetadata = {}): boolean {
  return curatedAsiaAnalysisIds.has(id)
    || tags.some((tag) => asiaTags.has(tag.trim().toLowerCase()) || asiaGeography.test(tag))
    || asiaGeography.test(`${metadata.title ?? ''} ${metadata.description ?? ''}`);
}

type AsiaPost = {
  id: string;
  data: AsiaMetadata & { tags: readonly string[]; pubDate: Date; draft?: boolean };
};

// Every publication build discovers new analyses; the curated paths never gate this feed.
export function selectAsiaAnalyses<T extends AsiaPost>(posts: readonly T[], now = Date.now()): T[] {
  return sortPostsByPublicationDate(posts.filter((post) =>
    !post.data.draft && post.data.pubDate.getTime() <= now
    && isAsiaAnalysis(post.id, post.data.tags, post.data),
  ));
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
      'how-long-does-ai-server-live',
    ],
    guideIds: ['read-corporate-debt', 'from-earnings-to-cash-working-capital-investment', 'read-credit-ratings', 'how-to-read-10-k-sec'],
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
      'life-insurers-retirement-savings-private-credit-bermuda',
    ],
    guideIds: ['read-private-credit-risk', 'read-clos-and-leveraged-loans', 'read-life-insurer-health'],
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
    guideIds: ['read-oil-market', 'understand-margin-calls-and-collateral'],
  },
] satisfies (Omit<EnglishReadingPath, 'eyebrow' | 'transmission'> & { atlasHref: string; atlasLabel: string })[];
