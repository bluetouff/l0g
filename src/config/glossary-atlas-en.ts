// English translations of Atlas fiches (progressive rollout, pack by pack).
// Slugs mirror the French glossary entries in glossary.ts; links point to English siblings only.
import type { GlossaryGraphLink, GlossaryKnowledgeGraph } from './glossary.ts';

export interface GlossaryAtlasEnEntry {
  slug: string;
  sigle: string;
  nom: string;
  def: string;
  guide?: string;
  sectionTitle: string;
  accent: string;
  atlas: GlossaryKnowledgeGraph;
}

const macroSection = { sectionTitle: 'Macro & central banks', accent: 'var(--color-signal)' };

const usDebtArticles: GlossaryGraphLink[] = [
  { label: 'The return of the term premium', href: '/en/analysis/the-return-of-the-term-premium/', detail: 'Decomposing the long rate and the US debt regime.', kind: 'article' },
  { label: 'The Treasury basis trade', href: '/en/analysis/the-treasury-basis-trade/', detail: 'Leverage, repo and bond-market fragility.', kind: 'article' },
  { label: 'Repo, the liquidity factory', href: '/en/analysis/repo-the-liquidity-factory/', detail: 'Funding chains that transmit a rate shock.', kind: 'article' },
];

const usDebtGuides: GlossaryGraphLink[] = [
  { label: 'Reading the Treasuries market', href: '/en/guides/read-us-treasuries-market/', detail: 'Curve, auctions, holders and the term premium.', kind: 'guide' },
  { label: 'Reading TIC data', href: '/en/guides/read-tic-data-us-debt/', detail: 'Foreign holdings and the custody bias.', kind: 'guide' },
  { label: 'Net liquidity: TGA, RRP', href: '/en/guides/read-net-liquidity-tga-rrp/', detail: 'Reserve channels and Treasury cash.', kind: 'guide' },
  { label: 'Reading the CBO outlook', href: '/en/guides/read-cbo-budget-outlook/', detail: 'Fiscal trajectory and the interest bill.', kind: 'guide' },
];

const usDebtDatasets: GlossaryGraphLink[] = [
  { label: 'risk.json', href: '/api/v1/risk.json', detail: 'Public snapshot of the risk signals.', kind: 'dataset' },
  { label: 'debt-risk.json', href: '/api/v1/debt-risk.json', detail: 'Debt Risk Radar snapshot with provenance.', kind: 'dataset' },
  { label: 'risk-diff.json', href: '/api/v1/risk-diff.json', detail: '1, 7 and 30-day diff of signals, sources and models.', kind: 'dataset' },
  { label: 'signals/history.json', href: '/api/v1/signals/history.json', detail: 'Point-in-time history of the signals.', kind: 'dataset' },
];

const usDebtSignals: GlossaryGraphLink[] = [
  { label: 'Methodology', href: '/en/methodology/', detail: 'Debt, interest burden, current stress and structural vulnerability.', kind: 'methodology' },
  { label: 'Risk Diff', href: '/en/risk-diff/', detail: 'Recent change in risk and source freshness.', kind: 'signal' },
  { label: 'Black Box Recorder', href: '/en/black-box/', detail: 'Hashed frames to replay a point-in-time state.', kind: 'signal' },
];

const usDebtSources: GlossaryGraphLink[] = [
  { label: 'Federal Reserve & FRED', href: 'https://fred.stlouisfed.org/', detail: 'Rates, the Fed balance sheet, FRED series and the New York Fed ACM model.', kind: 'source' },
  { label: 'U.S. Treasury Fiscal Data', href: 'https://fiscaldata.treasury.gov/', detail: 'Debt, Treasury cash, DTS and auctions.', kind: 'source' },
  { label: 'U.S. Treasury TIC', href: 'https://home.treasury.gov/data/treasury-international-capital-tic-system', detail: 'Cross-border holdings and flows of Treasuries.', kind: 'source' },
  { label: 'Congress.gov, GovInfo & CBO', href: 'https://www.cbo.gov/', detail: 'Budget projections, texts and estimates.', kind: 'source' },
  { label: 'Bank for International Settlements', href: 'https://www.bis.org/', detail: 'Global debt, banks and market fragilities.', kind: 'source' },
];

const shared = { datasets: usDebtDatasets, signals: usDebtSignals, sources: usDebtSources };

export const glossaryAtlasEn: GlossaryAtlasEnEntry[] = [
  {
    slug: 'prime-de-terme',
    sigle: 'Term premium',
    nom: 'Compensation for holding duration',
    def: "The extra yield an investor demands for holding a long bond rather than rolling short-term placements, compensating for rate, inflation and debt-supply risk. Estimated by the New York Fed's ACM model. Negative or nil for a decade, it turned positive again in 2026, still short of its long-run historical average.",
    guide: '/en/guides/read-us-treasuries-market/',
    ...macroSection,
    atlas: {
      intuition: 'The term premium isolates the pay demanded for carrying duration, once the expected path of short rates is stripped out.',
      formula: 'long yield ≈ average expected short rates + term premium',
      whyNow: 'When long-debt supply grows, QT removes the public buyer and foreign demand shifts, an expected fall in short rates can coexist with a rising long yield.',
      articles: usDebtArticles,
      guides: usDebtGuides,
      ...shared,
      related: ['duration', 'move', 'adjudication', 'bid-to-cover', 'primary-dealer', 'courbe-des-taux', 'repo', 'basis-trade', 'tga'],
    },
  },
  {
    slug: 'duration',
    sigle: 'Duration',
    nom: 'Sensitivity to interest rates',
    def: "A measure of how much a bond's price moves when rates change. The higher the duration, the more market value a rise in yields destroys. It turns stress on long rates into balance-sheet risk for holders of long debt.",
    guide: '/en/guides/read-us-treasuries-market/',
    ...macroSection,
    atlas: {
      intuition: 'Duration converts a rate move into a price gain or loss. It says how much rate risk sleeps inside a portfolio.',
      formula: 'approximate price change ≈ -duration × change in yield',
      whyNow: 'In a high-debt regime, duration concentrates risk: banks, insurers, pension funds and repo strategies can all sell at once if long rates break their scenario.',
      articles: usDebtArticles,
      guides: usDebtGuides,
      ...shared,
      related: ['prime-de-terme', 'move', 'adjudication', 'courbe-des-taux', 'repo', 'basis-trade'],
    },
  },
  {
    slug: 'adjudication',
    sigle: 'Treasury auction',
    nom: 'How the US issues its debt',
    def: 'The auction through which the US Treasury issues its debt. Single-price format: bidders submit yields and every winner pays the yield that clears the sale. Reading one rests on the bid-to-cover, the tail and the share taken by primary dealers.',
    guide: '/en/guides/read-us-treasuries-market/',
    ...macroSection,
    atlas: {
      intuition: 'An auction reveals the marginal demand for the debt issued today, not the theoretical demand for Treasuries.',
      formula: 'visible demand = bid-to-cover + tail + primary dealer share',
      whyNow: 'The refunding calendar becomes a risk signal when volumes to issue rise and the marginal buyer demands more yield.',
      articles: [usDebtArticles[0]],
      guides: [usDebtGuides[0]],
      ...shared,
      related: ['bid-to-cover', 'primary-dealer', 'prime-de-terme', 'duration', 'courbe-des-taux'],
    },
  },
  {
    slug: 'bid-to-cover',
    sigle: 'Bid-to-cover',
    nom: 'Auction coverage ratio',
    def: 'The ratio of total bids received at an auction to the amount sold. A volume signal of demand: above 2, appetite is judged solid; below, weak.',
    guide: '/en/guides/read-us-treasuries-market/',
    ...macroSection,
    atlas: {
      intuition: 'The bid-to-cover measures the cushion of bids around an issue, but it is not enough without reading the tail and the split between dealers, directs and indirects.',
      whyNow: 'A weak ratio at the wrong moment can signal that final demand is leaving more paper with the intermediaries.',
      guides: [usDebtGuides[0]],
      ...shared,
      related: ['adjudication', 'primary-dealer', 'prime-de-terme', 'move'],
    },
  },
  {
    slug: 'primary-dealer',
    sigle: 'Primary dealer',
    nom: 'Designated market maker in Treasuries',
    def: 'A bank designated by the Federal Reserve Bank of New York, required to bid at every Treasury auction and make markets in the secondary market. About twenty in total. A high dealer takedown, the share left with dealers, signals weak final demand.',
    guide: '/en/guides/read-us-treasuries-market/',
    ...macroSection,
    atlas: {
      intuition: 'Primary dealers absorb supply when final demand is missing. Their share of an auction helps read the quality of demand.',
      whyNow: 'In a bigger, more volatile market, bond intermediation itself becomes a risk variable.',
      guides: [usDebtGuides[0]],
      ...shared,
      related: ['adjudication', 'bid-to-cover', 'repo', 'basis-trade', 'move'],
    },
  },
  {
    slug: 'courbe-des-taux',
    sigle: 'Yield curve',
    nom: 'Yields across maturities',
    def: 'The set of government yields across maturities. Normally upward-sloping; its inversion, short rates above long rates, preceded each of the last eight US recessions. Its slope informs as much as its level.',
    guide: '/en/guides/read-us-treasuries-market/',
    ...macroSection,
    atlas: {
      intuition: 'The curve separates the level of rates, the slope and the shape. It ties together monetary policy, expected growth and the price of time.',
      formula: '10-2 slope = 10-year yield - 2-year yield',
      whyNow: 'A re-steepening curve can signal the return of duration risk rather than simple monetary easing.',
      articles: [
        usDebtArticles[0],
        { label: 'Warsh and the Fed balance sheet', href: '/en/analysis/warsh-and-the-fed-balance-sheet/', detail: 'Fed balance sheet, QT and rate conditions.', kind: 'article' },
      ],
      guides: [
        usDebtGuides[0],
        { label: 'How to read H.4.1', href: '/en/guides/read-h41-fed-balance-sheet/', detail: 'The Fed balance sheet and bank reserves.', kind: 'guide' },
      ],
      ...shared,
      related: ['prime-de-terme', 'duration', 'move', 'adjudication', 'basis-trade'],
    },
  },
  {
    slug: 'move',
    sigle: 'MOVE',
    nom: 'Merrill Lynch Option Volatility Estimate',
    def: 'The implied-volatility index of the US government bond market, the bond equivalent of the equity VIX. Quoted in basis points; below 80, a calm market, above 120, strain. A high MOVE signals rate stress and serves as a proxy for the term premium.',
    guide: '/en/guides/read-vix-move-volatility/',
    ...macroSection,
    atlas: {
      intuition: 'The MOVE prices uncertainty about rates. It works as a bond-turbulence detector, especially when auctions, duration and repo funding tighten together.',
      whyNow: 'A high MOVE makes hedging more expensive, complicates market making and can destabilise carry strategies.',
      articles: usDebtArticles,
      guides: [usDebtGuides[0], usDebtGuides[1]],
      ...shared,
      related: ['prime-de-terme', 'duration', 'adjudication', 'repo', 'basis-trade'],
    },
  },
  {
    slug: 'tga',
    sigle: 'TGA',
    nom: 'Treasury General Account',
    def: 'The US federal government checking account at the Federal Reserve. When it fills (debt issuance), it drains bank reserves; when it falls (spending), it injects them back.',
    ...macroSection,
    atlas: {
      intuition: "The TGA moves bank reserves around without mechanically changing the Fed's balance sheet.",
      formula: 'net liquidity watched by markets ≈ Fed balance sheet - TGA - RRP',
      whyNow: 'After a phase of issuance or Treasury cash rebuilding, the TGA can drain reserves just as the market is already absorbing more debt.',
      articles: [usDebtArticles[2]],
      guides: [usDebtGuides[2], usDebtGuides[0]],
      ...shared,
      related: ['repo', 'prime-de-terme', 'basis-trade'],
    },
  },
  {
    slug: 'repo',
    sigle: 'Repo',
    nom: 'Repurchase agreement',
    def: 'The sale of a security, most often a Treasury bond, paired with a buy-back the next day at a slightly higher price. A cash loan secured by collateral, the basic building block of overnight market funding.',
    ...macroSection,
    atlas: {
      intuition: 'Repo says how public debt funds itself day to day once it becomes collateral.',
      formula: 'cash today against a security, then buy-back tomorrow with implicit interest',
      whyNow: 'Repo connects Treasuries, hedge funds, banks and money market funds. A collateral squeeze can turn a rate move into a liquidity problem.',
      articles: [
        usDebtArticles[1],
        usDebtArticles[2],
        { label: 'Gilts, repo and leverage', href: '/en/analysis/gilts-repo-leverage-bank-of-england/', detail: 'Transmission of a rate shock through funding.', kind: 'article' },
      ],
      guides: [usDebtGuides[0], usDebtGuides[2]],
      ...shared,
      related: ['basis-trade', 'duration', 'move', 'tga', 'primary-dealer'],
    },
  },
  {
    slug: 'basis-trade',
    sigle: 'Basis trade',
    nom: 'Cash-futures Treasury arbitrage',
    def: 'A leveraged arbitrage that captures the price gap between a cash Treasury bond and its futures contract: buy the cash bond, sell the future, fund in repo. It supplies liquidity in normal times and amplifies stress in a forced unwind.',
    ...macroSection,
    atlas: {
      intuition: 'The basis trade turns a small price gap into a large exposure through repo leverage.',
      whyNow: 'It can support Treasury liquidity in calm times, then drain it if margins rise or funding turns unstable.',
      articles: [usDebtArticles[1], usDebtArticles[2]],
      guides: [usDebtGuides[0], usDebtGuides[2]],
      ...shared,
      related: ['repo', 'duration', 'move', 'primary-dealer', 'courbe-des-taux'],
    },
  },
];

export const glossaryAtlasEnBySlug = new Map(glossaryAtlasEn.map((entry) => [entry.slug, entry]));
