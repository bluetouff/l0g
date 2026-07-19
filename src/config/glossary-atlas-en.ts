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

const privateCreditSection = { sectionTitle: 'Private credit & markets', accent: '#ff4d87' };
const cryptoSection = { sectionTitle: 'Crypto & stablecoins', accent: 'var(--color-amber)' };
const usRegulationSection = { sectionTitle: 'US regulation & institutions', accent: '#7aa2f7' };

const privateCreditArticles: GlossaryGraphLink[] = [
  { label: 'Private credit: one asset, two prices', href: '/en/analysis/private-credit-one-asset-two-prices/', detail: 'Price discovery, listed BDCs and unlisted funds.', kind: 'article' },
  { label: 'Private credit, default and gating', href: '/en/analysis/private-credit-record-default-liquidity-closing/', detail: 'Defaults, capped redemptions and regulator vigilance.', kind: 'article' },
  { label: 'The silent contagion of private credit', href: '/en/analysis/the-silent-contagion-of-private-credit/', detail: 'Bridges between banks, insurers, BDCs, crypto and stablecoins.', kind: 'article' },
  { label: 'Semi-liquid funds and gating', href: '/en/analysis/semi-liquid-private-credit-gating/', detail: 'The mechanics of redemption windows and retail risk.', kind: 'article' },
  { label: 'Zombie funds and private valuations', href: '/en/analysis/zombie-funds-private-valuations/', detail: 'Private marks, hard exits and the illusion of stability.', kind: 'article' },
];

const privateCreditGuides: GlossaryGraphLink[] = [
  { label: 'Analysing private credit', href: '/en/guides/read-private-credit-risk/', detail: 'Valuation, liquidity, leverage, covenants and breaking points.', kind: 'guide' },
  { label: 'How to read a 10-K', href: '/en/guides/how-to-read-10-k-sec/', detail: 'Credit risk, debt, maturities and risk factors.', kind: 'guide' },
  { label: 'Analysing 13F filings', href: '/en/guides/how-to-analyze-sec-13f-filings/', detail: 'Public exposures of institutional managers.', kind: 'guide' },
];

const privateCreditDatasets: GlossaryGraphLink[] = [
  { label: 'debt-risk.json', href: '/api/v1/debt-risk.json', detail: 'Debt Risk Radar snapshot with provenance.', kind: 'dataset' },
  { label: 'risk-diff.json', href: '/api/v1/risk-diff.json', detail: '1, 7 and 30-day diff of signals, sources and models.', kind: 'dataset' },
  { label: 'evidence-graph.json', href: '/api/v1/evidence-graph.json', detail: 'Claims, evidence and their sources as a graph.', kind: 'dataset' },
  { label: 'catalog.json', href: '/api/v1/catalog.json', detail: 'Machine-readable catalogue of l0g surfaces.', kind: 'dataset' },
];

const privateCreditSources: GlossaryGraphLink[] = [
  { label: 'SEC EDGAR', href: 'https://www.sec.gov/edgar', detail: 'BDC filings, 10-K, 10-Q, 8-K and institutional disclosures.', kind: 'source' },
  { label: 'Financial Stability Board & OFR', href: 'https://www.fsb.org/', detail: 'Non-bank intermediation, financial stability and monitors.', kind: 'source' },
  { label: 'International Monetary Fund', href: 'https://www.imf.org/', detail: 'Global Financial Stability Report and funding stress.', kind: 'source' },
  { label: 'Bank for International Settlements', href: 'https://www.bis.org/', detail: 'Global credit, NBFI and market vulnerabilities.', kind: 'source' },
];

const privateCreditShared = { datasets: privateCreditDatasets, signals: usDebtSignals, sources: privateCreditSources };

const cryptoDatasets: GlossaryGraphLink[] = [
  { label: 'catalog.json', href: '/api/v1/catalog.json', detail: 'Machine-readable catalogue of l0g surfaces.', kind: 'dataset' },
  { label: 'claims.json', href: '/api/v1/claims.json', detail: 'Classified claims with their evidence level.', kind: 'dataset' },
  { label: 'evidence-graph.json', href: '/api/v1/evidence-graph.json', detail: 'Claims, evidence and their sources as a graph.', kind: 'dataset' },
  { label: 'risk-diff.json', href: '/api/v1/risk-diff.json', detail: '1, 7 and 30-day diff of signals, sources and models.', kind: 'dataset' },
];

const cryptoSignals: GlossaryGraphLink[] = [
  { label: 'Risk Diff', href: '/en/risk-diff/', detail: 'Recent change in risk and source freshness.', kind: 'signal' },
  { label: 'Black Box Recorder', href: '/en/black-box/', detail: 'Hashed frames to replay a point-in-time state.', kind: 'signal' },
];

const cryptoSources: GlossaryGraphLink[] = [
  { label: 'Congress.gov & GovInfo', href: 'https://www.congress.gov/', detail: 'Legislative texts, including the GENIUS Act and US crypto policy.', kind: 'source' },
  { label: 'U.S. Treasury Fiscal Data', href: 'https://fiscaldata.treasury.gov/', detail: 'T-bills and short debt serving as stablecoin reserves.', kind: 'source' },
  { label: 'SEC EDGAR', href: 'https://www.sec.gov/edgar', detail: 'Disclosures of listed issuers and crypto-exposed companies.', kind: 'source' },
  { label: 'Federal Reserve & FRED', href: 'https://fred.stlouisfed.org/', detail: 'Short rates, dollar liquidity and risk-free assets.', kind: 'source' },
];

const cryptoShared = { datasets: cryptoDatasets, signals: cryptoSignals, sources: cryptoSources };

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
  {
    slug: 'cbo',
    sigle: 'CBO',
    nom: 'Congressional Budget Office',
    def: 'The independent, non-partisan budget agency of the US Congress, created in 1974. It recommends no policy but prices the consequences of each. Its projections serve as the common reference, under current-law assumptions.',
    guide: '/en/guides/read-cbo-budget-outlook/',
    ...macroSection,
    atlas: {
      intuition: 'The CBO provides the reference fiscal scenario that separates political noise from the debt trajectory.',
      whyNow: 'Its projections feed the reading of structural vulnerability, especially as interest becomes a visible share of the deficit.',
      articles: [usDebtArticles[0]],
      guides: [usDebtGuides[3]],
      ...shared,
      related: ['prime-de-terme', 'courbe-des-taux', 'duration', 'adjudication'],
    },
  },
  {
    slug: 'credit-prive',
    sigle: 'Private credit',
    nom: 'Direct lending by non-bank managers',
    def: 'Loans extended directly by non-bank managers to companies, with no listing and no active secondary market. An illiquid, lightly regulated, model-marked market of about $1.3 trillion in the United States.',
    guide: '/en/guides/read-private-credit-risk/',
    ...privateCreditSection,
    atlas: {
      intuition: 'Private credit replaces a continuous market price with model marks, redemption windows and often delayed information.',
      formula: 'visible risk ≈ observed defaults + NAV discount + capped redemptions + fund leverage',
      whyNow: 'Rising defaults, capped semi-liquid redemptions and the gap between listed BDCs and private funds make liquidity as important as the advertised yield.',
      articles: privateCreditArticles,
      guides: privateCreditGuides,
      ...privateCreditShared,
      related: ['bdc', 'interval-fund', 'nav', 'nav-loan', 'pik', 'pcdr'],
    },
  },
  {
    slug: 'bdc',
    sigle: 'BDC',
    nom: 'Business Development Company',
    def: 'A listed US vehicle that lends to mid-sized companies. A pillar of private credit, often leveraged.',
    ...privateCreditSection,
    atlas: {
      intuition: 'A BDC gives a quoted price to a private credit exposure, which sometimes reveals a discount absent from unlisted funds.',
      formula: 'BDC premium or discount = market price / published NAV - 1',
      whyNow: 'When BDCs trade below NAV while open-ended funds redeem at par, the market is flagging a strain that private valuation smooths over.',
      articles: [privateCreditArticles[0], privateCreditArticles[1], privateCreditArticles[4]],
      guides: privateCreditGuides,
      ...privateCreditShared,
      related: ['credit-prive', 'nav', 'pik', 'pcdr'],
    },
  },
  {
    slug: 'interval-fund',
    sigle: 'Interval fund',
    nom: 'Semi-liquid fund with periodic windows',
    def: 'A semi-liquid fund that allows redemptions only through periodic, capped windows, while holding illiquid assets, hence a gating risk when exits pile up.',
    ...privateCreditSection,
    atlas: {
      intuition: 'The interval fund promises periodic liquidity on assets that do not necessarily sell at the same pace.',
      formula: 'liquidity offered < liquidity demanded = gating or queue',
      whyNow: 'Redemption requests make visible the gap between commercial liquidity and the economic liquidity of the portfolio.',
      articles: [privateCreditArticles[1], privateCreditArticles[3], privateCreditArticles[4]],
      guides: [privateCreditGuides[0]],
      ...privateCreditShared,
      related: ['credit-prive', 'nav', 'nav-loan', 'pik'],
    },
  },
  {
    slug: 'nav',
    sigle: 'NAV',
    nom: 'Net Asset Value',
    def: "The value of a fund's assets minus its liabilities. For private funds it is estimated rather than quoted, hence the opacity questions.",
    ...privateCreditSection,
    atlas: {
      intuition: 'A private NAV is less a market snapshot than an administered estimate. Its usefulness depends on the quality of the marks and the frequency of revisions.',
      formula: 'NAV = estimated asset value - fund liabilities',
      whyNow: 'The gap between quoted prices, at-par redemptions and internal marks becomes a signal of confidence in the valuation.',
      articles: [privateCreditArticles[0], privateCreditArticles[3], privateCreditArticles[4]],
      guides: [privateCreditGuides[0]],
      ...privateCreditShared,
      related: ['credit-prive', 'bdc', 'interval-fund', 'nav-loan', 'pik'],
    },
  },
  {
    slug: 'nav-loan',
    sigle: 'NAV loan',
    nom: 'Borrowing against net asset value',
    def: "A loan taken by a fund against the net asset value of its whole portfolio, often to finance follow-on investments or distributions. Leverage added at the fund level, on top of the debt of the companies held, and barely visible to end investors. Typical advance rate of 5 to 25% of NAV, cross-collateralised on the entire portfolio.",
    ...privateCreditSection,
    atlas: {
      intuition: 'The NAV loan adds a debt at the fund level, above the borrowers themselves.',
      formula: 'total leverage = company debt + debt carried by the fund',
      whyNow: 'When exits rise, funding distributions or redemptions with NAV loans can temporarily mask the liquidity pressure.',
      articles: [
        privateCreditArticles[2],
        privateCreditArticles[4],
        { label: 'NAV loans, the hidden fund-level leverage', href: '/en/analysis/nav-loans-the-hidden-fund-level-leverage/', detail: 'How funds borrow against their own portfolios.', kind: 'article' },
      ],
      guides: [privateCreditGuides[0]],
      ...privateCreditShared,
      related: ['credit-prive', 'nav', 'interval-fund'],
    },
  },
  {
    slug: 'pik',
    sigle: 'PIK',
    nom: 'Payment In Kind',
    def: "Interest paid not in cash but in additional debt. A signal of strain on the borrower's cash position.",
    ...privateCreditSection,
    atlas: {
      intuition: 'PIK turns an unpaid interest payment into additional debt. It relieves cash today and weighs on the balance sheet tomorrow.',
      formula: 'future debt = current debt + capitalised interest',
      whyNow: 'A rise in PIK signals that borrowers are preserving cash at the price of a deferred default risk.',
      articles: [privateCreditArticles[1], privateCreditArticles[2], privateCreditArticles[4]],
      guides: [privateCreditGuides[0]],
      ...privateCreditShared,
      related: ['credit-prive', 'pcdr', 'bdc', 'nav'],
    },
  },
  {
    slug: 'pcdr',
    sigle: 'PCDR',
    nom: 'Private Credit Default Rate',
    def: 'The Fitch index measuring the default rate across roughly 1,200 middle-market borrowers in private credit. A broadened measure of default, more complete than missed payments alone.',
    ...privateCreditSection,
    atlas: {
      intuition: 'The PCDR tracks private default across a middle-market universe, a stress less visible than listed high yield.',
      whyNow: 'It works as a direct sensor when private restructurings advance without always passing through a classic public default.',
      articles: [privateCreditArticles[1], privateCreditArticles[2]],
      guides: [privateCreditGuides[0]],
      ...privateCreditShared,
      related: ['credit-prive', 'pik', 'bdc'],
    },
  },
  {
    slug: 'stablecoin',
    sigle: 'Stablecoin',
    nom: 'Fiat-pegged digital token',
    def: 'A digital token backed one-for-one by a currency (the dollar in nearly 99% of cases) and redeemable at par. Its value rests entirely on the quality and liquidity of its reserves.',
    guide: '/en/guides/read-stablecoins-genius-act/',
    ...cryptoSection,
    atlas: {
      intuition: 'A stablecoin is a promise of parity. The risk sits in the reserve, the redemption right, the intermediaries and the geopolitical uses.',
      formula: 'durable parity = liquid assets + redemption right + supervision + operational trust',
      whyNow: 'Stablecoins are becoming a parallel dollar plumbing: T-bill reserves, cross-border payments, sanctions, DeFi and US regulation all intersect.',
      articles: [
        { label: 'RealT in liquidation', href: '/en/analysis/realt-liquidation-token-without-the-deed/', detail: 'Real-estate RWA, off-chain title and on-chain promise.', kind: 'article' },
        { label: 'USDT on Tron and OFAC evasion', href: '/en/analysis/iran-hormuz-tolls-usdt-tron-ofac/', detail: 'Stablecoins, sanctions and geopolitical payments.', kind: 'article' },
        { label: 'Hyperliquid and on-chain tradfi', href: '/en/analysis/hyperliquid-onchain-exchange/', detail: 'Perpetuals, DEXs and bridges to traditional assets.', kind: 'article' },
        { label: 'Strategy and the bitcoin bet', href: '/en/analysis/strategy-saylor-bitcoin-bet/', detail: 'Digital treasury, mNAV and market-funded balance sheets.', kind: 'article' },
      ],
      guides: [
        { label: 'Stablecoins and the GENIUS Act', href: '/en/guides/read-stablecoins-genius-act/', detail: 'Reserves, licensed issuers, audits and supervision.', kind: 'guide' },
        { label: 'Who enforces the GENIUS Act', href: '/en/guides/map-genius-act-stablecoin-regulators/', detail: 'OCC, FinCEN, OFAC, states and the enforcement architecture.', kind: 'guide' },
        { label: 'Reading on-chain data', href: '/en/guides/read-on-chain-data/', detail: 'Addresses, reserves, flows and the limits of interpretation.', kind: 'guide' },
        { label: 'MiCA, acronym by acronym', href: '/en/guides/decode-mica-crypto-regulation/', detail: 'ARTs, EMTs, CASPs and European supervision.', kind: 'guide' },
      ],
      ...cryptoShared,
      related: ['usdt', 'usdc', 'genius', 'ppsi', 'rwa'],
    },
  },
  {
    slug: 'usdt',
    sigle: 'USDT',
    nom: 'Tether',
    def: 'The largest stablecoin in circulation, meant to be worth one dollar. Issued by Tether, often at the centre of debates over reserve transparency.',
    ...cryptoSection,
    atlas: {
      intuition: 'USDT concentrates the most systemic stablecoin risk: size, liquidity, trust in the reserve and offshore uses.',
      whyNow: 'Its role in crypto payments and sanctions evasion makes it an indicator of dollar opacity, not just a trading token.',
      articles: [
        { label: 'USDT on Tron and OFAC evasion', href: '/en/analysis/iran-hormuz-tolls-usdt-tron-ofac/', detail: 'Stablecoins, sanctions and geopolitical payments.', kind: 'article' },
      ],
      guides: [
        { label: 'Stablecoins and the GENIUS Act', href: '/en/guides/read-stablecoins-genius-act/', detail: 'Reserves, licensed issuers, audits and supervision.', kind: 'guide' },
        { label: 'Reading on-chain data', href: '/en/guides/read-on-chain-data/', detail: 'Addresses, reserves, flows and the limits of interpretation.', kind: 'guide' },
      ],
      ...cryptoShared,
      related: ['stablecoin', 'usdc', 'ppsi', 'genius'],
    },
  },
  {
    slug: 'usdc',
    sigle: 'USDC',
    nom: 'USD Coin',
    def: 'The dollar-backed stablecoin issued by Circle, presented as more transparent about its reserves than USDT.',
    ...cryptoSection,
    atlas: {
      intuition: 'USDC represents the stablecoin most integrated into the US regulatory framework and institutional finance.',
      whyNow: 'The competition plays out less on technology than on reserve transparency, banking access and regulatory status.',
      articles: [
        { label: 'Hyperliquid and on-chain tradfi', href: '/en/analysis/hyperliquid-onchain-exchange/', detail: 'Perpetuals, DEXs and bridges to traditional assets.', kind: 'article' },
      ],
      guides: [
        { label: 'Stablecoins and the GENIUS Act', href: '/en/guides/read-stablecoins-genius-act/', detail: 'Reserves, licensed issuers, audits and supervision.', kind: 'guide' },
        { label: 'MiCA, acronym by acronym', href: '/en/guides/decode-mica-crypto-regulation/', detail: 'ARTs, EMTs, CASPs and European supervision.', kind: 'guide' },
      ],
      ...cryptoShared,
      related: ['stablecoin', 'usdt', 'genius', 'ppsi'],
    },
  },
  {
    slug: 'rwa',
    sigle: 'RWA',
    nom: 'Real World Assets',
    def: 'Real-world assets (bonds, real estate) tokenised on a blockchain to be traded on-chain.',
    ...cryptoSection,
    atlas: {
      intuition: 'An RWA does not make the real asset magic: it adds a tokenised layer to a legal, accounting and operational chain that is already fragile.',
      formula: 'token value = on-chain right + off-chain title + legal enforcement',
      whyNow: 'Tokenisation is advancing faster than legal and operational proof, especially when stablecoin yield attracts capital.',
      articles: [
        { label: 'RealT in liquidation', href: '/en/analysis/realt-liquidation-token-without-the-deed/', detail: 'Real-estate RWA, off-chain title and on-chain promise.', kind: 'article' },
        { label: 'Hyperliquid and on-chain tradfi', href: '/en/analysis/hyperliquid-onchain-exchange/', detail: 'Perpetuals, DEXs and bridges to traditional assets.', kind: 'article' },
      ],
      guides: [
        { label: 'Reading on-chain data', href: '/en/guides/read-on-chain-data/', detail: 'Addresses, reserves, flows and the limits of interpretation.', kind: 'guide' },
        { label: 'MiCA, acronym by acronym', href: '/en/guides/decode-mica-crypto-regulation/', detail: 'ARTs, EMTs, CASPs and European supervision.', kind: 'guide' },
        { label: 'Stablecoins and the GENIUS Act', href: '/en/guides/read-stablecoins-genius-act/', detail: 'Reserves, licensed issuers, audits and supervision.', kind: 'guide' },
      ],
      ...cryptoShared,
      related: ['immobilier-tokenise', 'stablecoin'],
    },
  },
  {
    slug: 'immobilier-tokenise',
    sigle: 'Tokenized real estate',
    nom: 'Property fractioned into on-chain tokens',
    def: 'The fractioning of a property into tokens tradable on-chain, each building housed in a dedicated company (often an LLC) whose shares are tokenised, with rent paid out in stablecoins. Its specific flaw: the token is only worth something if the off-chain title (deed, land registry, tax) actually follows, as the 2026 liquidation of RealT exposed. Still marginal (under $100m on-chain) next to tokenised financial claims.',
    ...cryptoSection,
    atlas: {
      intuition: 'A real-estate token is only worth something if ownership, rent flows and holder rights follow off-chain.',
      formula: 'RWA risk = liquid token + illiquid asset + local law',
      whyNow: 'Ownership and liquidation incidents show that a blockchain ledger replaces neither land titles nor legal governance.',
      articles: [
        { label: 'RealT in liquidation', href: '/en/analysis/realt-liquidation-token-without-the-deed/', detail: 'Real-estate RWA, off-chain title and on-chain promise.', kind: 'article' },
      ],
      guides: [
        { label: 'Reading on-chain data', href: '/en/guides/read-on-chain-data/', detail: 'Addresses, reserves, flows and the limits of interpretation.', kind: 'guide' },
        { label: 'Stablecoins and the GENIUS Act', href: '/en/guides/read-stablecoins-genius-act/', detail: 'Reserves, licensed issuers, audits and supervision.', kind: 'guide' },
      ],
      ...cryptoShared,
      related: ['rwa', 'stablecoin'],
    },
  },
  {
    slug: 'ppsi',
    sigle: 'PPSI',
    nom: 'Permitted Payment Stablecoin Issuer',
    def: 'A licensed payment-stablecoin issuer under the GENIUS Act. Only a PPSI may issue legally in the United States: an insured bank subsidiary, a non-bank issuer approved by the OCC, or a state-licensed issuer.',
    guide: '/en/guides/map-genius-act-stablecoin-regulators/',
    ...cryptoSection,
    atlas: {
      intuition: 'The PPSI status turns the stablecoin issuer into an explicitly supervised actor, with reserve, audit and AML obligations.',
      formula: 'legal US stablecoin = licensed issuer + eligible reserve + audits + BSA compliance',
      whyNow: 'Licensed-issuer status is becoming the border between regulated tokenised dollars and more opaque offshore issuance.',
      articles: [
        { label: 'RealT in liquidation', href: '/en/analysis/realt-liquidation-token-without-the-deed/', detail: 'Real-estate RWA, off-chain title and on-chain promise.', kind: 'article' },
        { label: 'USDT on Tron and OFAC evasion', href: '/en/analysis/iran-hormuz-tolls-usdt-tron-ofac/', detail: 'Stablecoins, sanctions and geopolitical payments.', kind: 'article' },
      ],
      guides: [
        { label: 'Stablecoins and the GENIUS Act', href: '/en/guides/read-stablecoins-genius-act/', detail: 'Reserves, licensed issuers, audits and supervision.', kind: 'guide' },
        { label: 'Who enforces the GENIUS Act', href: '/en/guides/map-genius-act-stablecoin-regulators/', detail: 'OCC, FinCEN, OFAC, states and the enforcement architecture.', kind: 'guide' },
      ],
      ...cryptoShared,
      related: ['stablecoin', 'genius', 'usdc'],
    },
  },
  {
    slug: 'genius',
    sigle: 'GENIUS',
    nom: 'GENIUS Act',
    def: 'The US federal law on payment stablecoins, enacted on 18 July 2025: full reserves, licensed issuers, audits.',
    guide: '/en/guides/read-stablecoins-genius-act/',
    ...usRegulationSection,
    atlas: {
      intuition: 'The GENIUS Act defines the legal plumbing of the payment stablecoin in the United States.',
      whyNow: 'It shifts the risk from the technical question to reserve quality, oversight, conflicts of interest and actual enforcement.',
      articles: [
        { label: 'RealT in liquidation', href: '/en/analysis/realt-liquidation-token-without-the-deed/', detail: 'Real-estate RWA, off-chain title and on-chain promise.', kind: 'article' },
        { label: 'USDT on Tron and OFAC evasion', href: '/en/analysis/iran-hormuz-tolls-usdt-tron-ofac/', detail: 'Stablecoins, sanctions and geopolitical payments.', kind: 'article' },
      ],
      guides: [
        { label: 'Stablecoins and the GENIUS Act', href: '/en/guides/read-stablecoins-genius-act/', detail: 'Reserves, licensed issuers, audits and supervision.', kind: 'guide' },
        { label: 'Who enforces the GENIUS Act', href: '/en/guides/map-genius-act-stablecoin-regulators/', detail: 'OCC, FinCEN, OFAC, states and the enforcement architecture.', kind: 'guide' },
      ],
      ...cryptoShared,
      related: ['stablecoin', 'ppsi', 'usdt', 'usdc'],
    },
  },
];

export const glossaryAtlasEnBySlug = new Map(glossaryAtlasEn.map((entry) => [entry.slug, entry]));
