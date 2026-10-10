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
  robots?: 'index,follow' | 'noindex,follow';
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

const privateCreditSection = { sectionTitle: 'Private credit & markets', accent: 'var(--color-accent)' };
const cryptoSection = { sectionTitle: 'Crypto & stablecoins', accent: 'var(--color-amber)' };
const usRegulationSection = { sectionTitle: 'US regulation & institutions', accent: 'var(--color-topic-blue)' };
const clearingSection = { sectionTitle: 'Markets & clearing', accent: 'var(--color-topic-blue)' };

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

const regulatedUtilitySection = { sectionTitle: 'Regulated utilities & data centres', accent: 'var(--color-amber)' };
const largeLoadArticles: GlossaryGraphLink[] = [
  { label: 'The ghost kilowatt', href: '/en/analysis/the-ghost-kilowatt/', detail: 'Data-centre tariffs, grid costs and ratepayer risk.', kind: 'article' },
  { label: 'The debt behind AI', href: '/en/analysis/the-debt-behind-ai/', detail: 'Debt, SPVs and financing the compute buildout.', kind: 'article' },
  { label: 'The residual value guarantee', href: '/en/analysis/residual-value-guarantee-ai-infrastructure-credit/', detail: 'AI-asset depreciation and risk transferred to a guarantor.', kind: 'article' },
];
const largeLoadSources: GlossaryGraphLink[] = [
  { label: 'Federal Energy Regulatory Commission', href: 'https://www.ferc.gov/', detail: 'Transmission tariffs, large loads and cost-recovery agreements.', kind: 'source' },
  { label: 'U.S. Department of Energy', href: 'https://www.energy.gov/policy/articles/electricity-rate-designs-large-loads-evolving-practices-and-opportunities', detail: 'Rate design, risk sharing and stranded assets.', kind: 'source' },
  { label: 'Virginia State Corporation Commission', href: 'https://www.scc.virginia.gov/media/sccvirginiagov-home/about-the-scc/fact-sheets/scc-data-center-initiatives-02-2026.pdf', detail: 'GS-5 tariff, minimum commitment and collateral.', kind: 'source' },
];
const largeLoadDatasets: GlossaryGraphLink[] = [
  { label: 'evidence-graph.json', href: '/api/v1/evidence-graph.json', detail: 'Links between articles, claims and sources.', kind: 'dataset' },
  { label: 'claims.json', href: '/api/v1/claims.json', detail: 'Claims extracted from the corpus with their references.', kind: 'dataset' },
];

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

const energySection = { sectionTitle: 'Energy & geopolitics', accent: 'var(--color-amber)' };

const yenDatasets: GlossaryGraphLink[] = [
  { label: 'risk.json', href: '/api/v1/risk.json', detail: 'Public snapshot of the risk signals.', kind: 'dataset' },
  { label: 'signals/history.json', href: '/api/v1/signals/history.json', detail: 'Point-in-time history of the signals.', kind: 'dataset' },
  { label: 'signals/history.csv', href: '/api/v1/signals/history.csv', detail: 'The same history as CSV.', kind: 'dataset' },
  { label: 'risk-diff.json', href: '/api/v1/risk-diff.json', detail: '1, 7 and 30-day diff of signals, sources and models.', kind: 'dataset' },
];

const yenSignals: GlossaryGraphLink[] = [
  { label: 'Yen Carry Monitor', href: '/en/methodology/', detail: 'Methodology of the yen carry risk signal.', kind: 'methodology' },
  { label: 'Risk Diff', href: '/en/risk-diff/', detail: 'Recent change in risk and source freshness.', kind: 'signal' },
];

const yenArticle: GlossaryGraphLink = { label: 'Dollar-yen: the unwind risk', href: '/en/analysis/dollar-yen-intervention-carry-unwind/', detail: 'USD/JPY, the BoJ, intervention and carry liquidation.', kind: 'article' };

const yenGuides: GlossaryGraphLink[] = [
  { label: 'Reading the carry trade', href: '/en/guides/read-the-carry-trade/', detail: 'Carry mechanics, leverage and unwind risk.', kind: 'guide' },
  { label: 'Reading the CFTC COT report', href: '/en/guides/read-cftc-cot-report/', detail: 'Futures positioning, trader categories and limits.', kind: 'guide' },
  { label: 'Reading the dot plot and SEP', href: '/en/guides/read-dot-plot-sep/', detail: 'Dollar rate path and yield differential.', kind: 'guide' },
];

const yenSources: GlossaryGraphLink[] = [
  { label: 'Bank of Japan & Ministry of Finance Japan', href: 'https://www.boj.or.jp/en/', detail: 'Japanese monetary policy, BoJ statistics and FX interventions.', kind: 'source' },
  { label: 'Commodity Futures Trading Commission', href: 'https://www.cftc.gov/', detail: 'Yen and futures positioning through the COT.', kind: 'source' },
  { label: 'Federal Reserve & FRED', href: 'https://fred.stlouisfed.org/', detail: 'Dollar rates, fed funds and liquidity conditions.', kind: 'source' },
];

const yenShared = { datasets: yenDatasets, signals: yenSignals, sources: yenSources };

const energyDatasets: GlossaryGraphLink[] = [
  { label: 'risk.json', href: '/api/v1/risk.json', detail: 'Public snapshot of the risk signals.', kind: 'dataset' },
  { label: 'signals/history.json', href: '/api/v1/signals/history.json', detail: 'Point-in-time history of the signals.', kind: 'dataset' },
  { label: 'risk-diff.json', href: '/api/v1/risk-diff.json', detail: '1, 7 and 30-day diff of signals, sources and models.', kind: 'dataset' },
  { label: 'evidence-graph.json', href: '/api/v1/evidence-graph.json', detail: 'Claims, evidence and their sources as a graph.', kind: 'dataset' },
];

const energySignals: GlossaryGraphLink[] = [
  { label: 'Energy Monitor', href: '/en/methodology/', detail: 'Methodology of the energy stress signal.', kind: 'methodology' },
  { label: 'Risk Diff', href: '/en/risk-diff/', detail: 'Recent change in risk and source freshness.', kind: 'signal' },
];

const energySources: GlossaryGraphLink[] = [
  { label: 'U.S. Energy Information Administration', href: 'https://www.eia.gov/', detail: 'Oil, gas, inventories, production and the Short-Term Energy Outlook.', kind: 'source' },
  { label: 'Commodity Futures Trading Commission', href: 'https://www.cftc.gov/', detail: 'Futures positioning through the Commitments of Traders.', kind: 'source' },
  { label: 'World Bank Open Data & OECD Data', href: 'https://data.worldbank.org/', detail: 'Macro comparables and commodity prices.', kind: 'source' },
];

const energyShared = { datasets: energyDatasets, signals: energySignals, sources: energySources };

const oilArticles: GlossaryGraphLink[] = [
  { label: 'Oil: the Chinese inventory capping prices', href: '/en/analysis/oil-the-chinese-inventory-capping-prices/', detail: 'Reserves, Brent prices and Chinese buying behaviour.', kind: 'article' },
  { label: 'China crude imports fall', href: '/en/analysis/china-crude-imports-fall-market-power/', detail: 'Physical flows, margins and market power.', kind: 'article' },
  { label: 'Hormuz reopens', href: '/en/analysis/hormuz-reopens-three-oil-scenarios/', detail: 'Normalisation, price scenarios and geopolitical premia.', kind: 'article' },
  { label: 'The Hormuz crisis in Asia', href: '/en/analysis/hormuz-crisis-asia-economic-toll/', detail: 'Energy bill, LNG and Asian exposure.', kind: 'article' },
  { label: 'Supply chains and Hormuz', href: '/en/analysis/hormuz-supply-chain-the-bill-is-already-here/', detail: 'Freight, delays and energy costs passed into goods.', kind: 'article' },
  { label: 'When the barrel becomes a margin call', href: '/en/analysis/when-the-barrel-becomes-a-margin-call/', detail: 'Hedging, cash, clearing and transmission to bank balance sheets.', kind: 'article' },
];

const oilGuide: GlossaryGraphLink = { label: 'Reading the oil market', href: '/en/guides/read-oil-market/', detail: 'Prices, curve, inventories, OPEC and physical data.', kind: 'guide' };

const marginGuides: GlossaryGraphLink[] = [
  oilGuide,
  { label: 'Reading interest-rate swaps', href: '/en/guides/read-interest-rate-swaps/', detail: 'Valuation, clearing and counterparty risk in derivatives.', kind: 'guide' },
];

const marginSources: GlossaryGraphLink[] = [
  { label: 'Intercontinental Exchange', href: 'https://www.ice.com/products/219/Brent-Crude-Futures', detail: 'Brent future specifications, clearing and indicative margins.', kind: 'source' },
  { label: 'European Central Bank', href: 'https://www.ecb.europa.eu/press/financial-stability-publications/fsr/special/html/ecb.fsrart202211_01~173476301a.en.html', detail: 'Energy derivatives, margin calls, bank credit and EMIR data.', kind: 'source' },
  { label: 'Bank of England', href: 'https://www.bankofengland.co.uk/speech/2024/july/nathanael-benjamin-speech-followed-by-panel-preparing-for-liquidity-stresses', detail: 'Measures of the 2022 European energy-margin stress.', kind: 'source' },
  { label: 'Financial Stability Board', href: 'https://www.fsb.org/2024/12/liquidity-preparedness-for-margin-and-collateral-calls-final-report/', detail: 'International recommendations on margin-call preparedness.', kind: 'source' },
];

const marginShared = { datasets: energyDatasets, signals: energySignals, sources: marginSources };

const uraniumArticle: GlossaryGraphLink = { label: 'Uranium: deficit and hidden bottlenecks', href: '/en/analysis/uranium-market-deficit-ai-bottlenecks/', detail: 'Mining, conversion, enrichment, HALEU and AI demand.', kind: 'article' };
const uraniumGuide: GlossaryGraphLink = { label: 'Reading the uranium market', href: '/en/guides/read-uranium-market/', detail: 'From ore to reactor: contracts, conversion and enrichment.', kind: 'guide' };

export const glossaryAtlasEn: GlossaryAtlasEnEntry[] = [
  {
    slug: 'ot', sigle: 'OT', nom: 'Operational technology',
    sectionTitle: 'Digital economy & data', accent: 'var(--color-signal)', robots: 'noindex,follow',
    guide: '/en/analysis/wind-solar-cyber-access-responsibility/',
    def: 'Programmable systems and devices that monitor or control the physical environment, or manage equipment that does so. Protecting OT requires attention to operational performance, reliability and safety. Industrial control systems, including SCADA, are part of this domain.',
    atlas: {
      intuition: 'A software intervention can change how physical equipment operates.',
      articles: [{ label: 'Wind and solar: cyber access and responsibility', href: '/en/analysis/wind-solar-cyber-access-responsibility/', kind: 'article' }],
      sources: [{ label: 'NIST SP 800-82r3, September 2023', href: 'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-82r3.pdf', detail: 'Section 2, page 8: the scope of operational technology.', kind: 'source' }],
      related: ['scada'],
    },
  },
  {
    slug: 'scada', sigle: 'SCADA', nom: 'Supervisory control and data acquisition',
    sectionTitle: 'Digital economy & data', accent: 'var(--color-signal)', robots: 'noindex,follow',
    guide: '/en/analysis/wind-solar-cyber-access-responsibility/',
    def: 'A system that gathers data from distributed assets, sends it to a control centre and lets operators monitor or control processes from a central location. The commands available and the degree of automation depend on the system’s design and configuration.',
    atlas: {
      intuition: 'Supervision brings together field measurements and the control functions available to operators.',
      articles: [{ label: 'Wind and solar: cyber access and responsibility', href: '/en/analysis/wind-solar-cyber-access-responsibility/', kind: 'article' }],
      sources: [{ label: 'NIST SP 800-82r3, September 2023', href: 'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-82r3.pdf', detail: 'Section 2.3.2, page 12: data acquisition, supervision and control.', kind: 'source' }],
      related: ['ot'],
    },
  },
  {
    slug: 'portabilite', sigle: 'Portability', nom: 'Moving data in a usable form',
    sectionTitle: 'Digital economy & data', accent: 'var(--color-signal)', robots: 'noindex,follow',
    guide: '/en/analysis/leaving-microsoft-1-government-dependencies/',
    def: 'The ability to transfer data to another environment in a form that can be used there. Its scope depends on the formats, associated information and available interfaces. Copying files and restoring the applications that use them require separate checks.',
    atlas: {
      intuition: 'A transfer becomes useful when the recipient can work with the data it receives.',
      articles: [{ label: 'Leaving Microsoft, 1/7', href: '/en/analysis/leaving-microsoft-1-government-dependencies/', detail: 'Content, identities, permissions and applications in a public-sector migration.', kind: 'article' }],
      sources: [{ label: 'Data Act, Chapter VI', href: 'https://eur-lex.europa.eu/eli/reg/2023/2854/oj/fra', detail: 'Provider switching, exports and service-specific obligations.', kind: 'source' }],
      related: ['reversibilite', 'interoperabilite'],
    },
  },
  {
    slug: 'reversibilite', sigle: 'Reversibility', nom: 'The ability to take over an IT service',
    sectionTitle: 'Digital economy & data', accent: 'var(--color-signal)', robots: 'noindex,follow',
    guide: '/en/analysis/leaving-microsoft-1-government-dependencies/',
    def: 'An organised means of taking a service back in-house or transferring it to another supplier, with the data and other resources needed to keep it working. It requires people, technical capabilities, funding and contractual arrangements, supported by tests suited to the service.',
    atlas: {
      intuition: 'Preparing an exit includes funding the people and operations needed to take over the service.',
      articles: [{ label: 'Leaving Microsoft, 1/7', href: '/en/analysis/leaving-microsoft-1-government-dependencies/', detail: 'Documented experience from Schleswig-Holstein and the CNRS.', kind: 'article' }],
      sources: [{ label: 'French cloud-at-the-centre circular, 31 May 2023', href: 'https://www.legifrance.gouv.fr/circulaire/id/45446', detail: 'R4 and R10: resources for reversibility and technical or functional dependencies.', kind: 'source' }],
      related: ['portabilite', 'interoperabilite'],
    },
  },
  {
    slug: 'interoperabilite', sigle: 'Interoperability', nom: 'Enabling different IT systems to work together',
    sectionTitle: 'Digital economy & data', accent: 'var(--color-signal)', robots: 'noindex,follow',
    guide: '/en/analysis/leaving-microsoft-1-government-dependencies/',
    def: 'The ability of different systems to exchange information and use it to perform an operation. It depends on interfaces, formats and the meaning of the information exchanged. An assessment must specify the function and systems being examined.',
    atlas: {
      intuition: 'Systems can work together when the information they exchange retains the meaning needed for the intended action.',
      articles: [{ label: 'Leaving Microsoft, 1/7', href: '/en/analysis/leaving-microsoft-1-government-dependencies/', detail: 'Rebuilding a procedure beyond copying its files.', kind: 'article' }],
      sources: [{ label: 'Data Act, Articles 2 and 30', href: 'https://eur-lex.europa.eu/eli/reg/2023/2854/oj/fra', detail: 'The definition of interoperability and technical requirements for provider switching.', kind: 'source' }],
      related: ['portabilite', 'reversibilite'],
    },
  },
  {
    slug: 'inclusion-forcee', sigle: 'Forced inclusion', nom: 'Submitting a rollup operation through its base chain',
    sectionTitle: 'Crypto & stablecoins', accent: 'var(--color-amber)', robots: 'noindex,follow',
    guide: '/en/analysis/blast-abstract-blockchain-shutdown-economics/',
    def: 'A mechanism for submitting an operation to a rollup through its base chain. Its effect depends on the protocol: placing a request in a queue does not guarantee that the actors publishing and validating states will keep processing it. Withdrawal availability therefore requires checking the whole procedure.',
    atlas: {
      intuition: 'The ability to submit a request and the ability to complete it depend on separate functions.',
      articles: [{ label: 'Blast and Abstract: who pays to keep a blockchain running?', href: '/en/analysis/blast-abstract-blockchain-shutdown-economics/', kind: 'article' }],
      sources: [{ label: 'OP Stack, forced transactions', href: 'https://docs.optimism.io/op-stack/transactions/forced-transaction', kind: 'source' }, { label: 'ZKsync, handling L1–L2 operations', href: 'https://docs.zksync.io/zksync-protocol/era-vm/contracts/handling-l1-l2-ops', kind: 'source' }, { label: 'L2BEAT, Abstract', href: 'https://l2beat.com/layer2s/projects/abstract', kind: 'source' }],
      related: ['proposeur-de-rollup'],
    },
  },
  {
    slug: 'proposeur-de-rollup', sigle: 'Rollup proposer', nom: 'Actor publishing state commitments',
    sectionTitle: 'Crypto & stablecoins', accent: 'var(--color-amber)', robots: 'noindex,follow',
    guide: '/en/analysis/blast-abstract-blockchain-shutdown-economics/',
    def: 'An actor that submits commitments representing a rollup state to its base chain. Depending on the protocol, this role can be open or restricted to authorised actors. A request received by the sequencer still needs the publication and validation steps required for settlement.',
    atlas: {
      intuition: 'Receiving an operation, publishing its state and enabling withdrawal are successive tasks.',
      articles: [{ label: 'Blast and Abstract: who pays to keep a blockchain running?', href: '/en/analysis/blast-abstract-blockchain-shutdown-economics/', kind: 'article' }],
      sources: [{ label: 'L2BEAT, Abstract', href: 'https://l2beat.com/layer2s/projects/abstract', kind: 'source' }, { label: 'Abstract, transaction lifecycle', href: 'https://docs.abs.xyz/how-abstract-works/architecture/transaction-lifecycle', kind: 'source' }],
      related: ['inclusion-forcee'],
    },
  },

  {
    slug: 'btf', sigle: 'BTF', nom: 'French Treasury bill',
    ...macroSection, robots: 'noindex,follow',
    guide: '/en/analysis/french-debt-price-of-time/',
    def: 'Negotiable French Treasury bill issued with a maturity of less than one year and fixed-rate interest deducted upfront. BTFs help manage the State’s cash-flow timing.',
    atlas: {
      intuition: 'A short maturity helps manage cash balances but brings the next principal repayment closer.',
      articles: [{ label: 'The price of time in French debt', href: '/en/analysis/french-debt-price-of-time/', kind: 'article' }],
      sources: [{ label: 'Agence France Trésor, products', href: 'https://www.aft.gouv.fr/fr/nos-produits', detail: 'BTFs are issued for less than one year to manage cash balances.', kind: 'source' }],
      related: ['risque-de-refinancement', 'prime-de-terme'],
    },
  },
  {
    slug: 'risque-de-refinancement', sigle: 'Refinancing risk', nom: 'Risk when maturing debt must be replaced',
    ...macroSection, robots: 'noindex,follow',
    guide: '/en/analysis/french-debt-price-of-time/',
    def: 'The risk of having to refinance maturing debt at a higher cost or facing difficulty raising the required funds. It depends on the amounts due, their timing and access to funding.',
    atlas: {
      intuition: 'Shorter issuance can lower the initial cost while bringing the next funding need closer.',
      articles: [{ label: 'The price of time in French debt', href: '/en/analysis/french-debt-price-of-time/', kind: 'article' }],
      sources: [{ label: 'DG Trésor, Trésor-Éco no. 297, January 2022', href: 'https://www.tresor.economie.gouv.fr/Articles/aed3274b-b5a2-482d-a02d-09d0b9f339d6/files/dc0bde49-9fd8-4e29-bd30-fe069abb603b', detail: 'Sections 2.1 and 2.2: smoothing redemptions and the cost-risk trade-off.', kind: 'source' }, { label: 'OECD, Global Debt Report 2026', href: 'https://www.oecd.org/en/publications/global-debt-report-2026_e9d80efd-en/full-report/sovereign-borrowing-outlook_4470147b.html', detail: 'Chapter 1: issuance maturities and refinancing risk.', kind: 'source' }],
      related: ['btf', 'prime-de-terme'],
    },
  },
  {
    slug: 'cryptographie-postquantique', sigle: 'Post-quantum cryptography', nom: 'Cryptography designed to resist known quantum attacks',
    ...cryptoSection, robots: 'noindex,follow',
    guide: '/en/analysis/bitcoin-quantum-cost-changing-keys/',
    def: 'Cryptographic constructions run on classical computers and designed to resist known quantum attacks. Signatures authorise and authenticate messages; key encapsulation mechanisms establish shared secrets. Integration into Bitcoin requires protocol rules and migration of existing outputs.',
    atlas: {
      intuition: 'A standardised primitive still needs a protocol, compatible wallets and a migration path.',
      articles: [{ label: 'Bitcoin’s quantum migration: the cost of changing keys', href: '/en/analysis/bitcoin-quantum-cost-changing-keys/', kind: 'article' }],
      sources: [{ label: 'NIST FIPS 204', href: 'https://csrc.nist.gov/pubs/fips/204/final', kind: 'source' }, { label: 'NIST FIPS 203', href: 'https://csrc.nist.gov/pubs/fips/203/final', kind: 'source' }],
      related: ['poids-de-transaction', 'btc'],
    },
  },
  {
    slug: 'poids-de-transaction', sigle: 'Transaction weight', nom: 'Bitcoin’s SegWit space measure',
    ...cryptoSection, robots: 'noindex,follow',
    guide: '/en/analysis/bitcoin-quantum-cost-changing-keys/',
    def: 'SegWit’s measure of transaction space: four weight units per byte of base data and one per byte of witness data. Virtual size is weight divided by four, rounded up. Weight alone does not set the fee, which also depends on the offered price for block space.',
    atlas: {
      intuition: 'Data, weight and the fee rate describe different parts of the cost.',
      articles: [{ label: 'Bitcoin’s quantum migration: the cost of changing keys', href: '/en/analysis/bitcoin-quantum-cost-changing-keys/', kind: 'article' }],
      sources: [{ label: 'BIP 141', href: 'https://github.com/bitcoin/bips/blob/927b6de9915c9262615a6399de51b200f81e5aa4/bip-0141.mediawiki', kind: 'source' }],
      related: ['cryptographie-postquantique', 'btc'],
    },
  },
  {
    slug: 'irrbb', sigle: 'IRRBB', nom: 'Interest rate risk in the banking book',
    sectionTitle: 'Banking & balance-sheet management', accent: 'var(--color-topic-blue)', robots: 'noindex,follow',
    guide: '/en/analysis/european-banks-sovereign-debt-bond-shock/',
    def: 'The risk that adverse interest-rate changes affect capital or earnings in the banking book. Measurement uses complementary measures of economic value and expected earnings, each with its own horizon and modelling assumptions.',
    atlas: {
      intuition: 'A hedge that stabilises near-term income can leave longer-term economic value exposed.',
      articles: [{ label: 'Government debt is catching up with Europe’s banks', href: '/en/analysis/european-banks-sovereign-debt-bond-shock/', detail: 'Bond prices, collateral, funding and Deutsche Bank scenarios.', kind: 'article' }],
      sources: [{ label: 'Basel Committee, SRP98', href: 'https://www.bis.org/committees/bcbs/basel-framework/standard/srp/98/inforce/2026-01-01/published/2024-07-16', detail: 'Definition §98.1; complementary measures §§98.17-98.22.', kind: 'source' }],
      related: ['eve', 'nii', 'duration', 'cet1'],
    },
  },
  {
    slug: 'eve', sigle: 'EVE', nom: 'Economic value of equity',
    sectionTitle: 'Banking & balance-sheet management', accent: 'var(--color-topic-blue)', robots: 'noindex,follow',
    guide: '/en/analysis/european-banks-sovereign-debt-bond-shock/',
    def: 'The net present value of cash flows from assets, liabilities and off-balance-sheet positions in an interest-rate risk measure. Its scenario change covers the positions’ remaining life and differs from accounting earnings or the share price.',
    atlas: {
      intuition: 'Discounted value follows cash flows until the positions run off, beyond the next financial year.',
      articles: [{ label: 'Government debt is catching up with Europe’s banks', href: '/en/analysis/european-banks-sovereign-debt-bond-shock/', detail: 'Reading the EVE change in the EU IRRBB1 table.', kind: 'article' }],
      sources: [{ label: 'BIS, IRRBB standardised framework', href: 'https://www.bis.org/publications/fsi-summary-irrbb-pillar-2-standardised-framework-executive-summary', detail: 'Present value of on- and off-balance-sheet cash flows under rate scenarios.', kind: 'source' }],
      related: ['irrbb', 'nii', 'duration', 'cet1'],
    },
  },
  {
    slug: 'nii', sigle: 'NII', nom: 'Net interest income',
    sectionTitle: 'Banking & balance-sheet management', accent: 'var(--color-topic-blue)', robots: 'noindex,follow',
    guide: '/en/analysis/european-banks-sovereign-debt-bond-shock/',
    def: 'Interest income less interest expense over a period, taking hedging into account. NII sensitivity depends on the scenario’s horizon and assumptions. It is distinct from total net earnings and economic value of equity.',
    atlas: {
      intuition: 'Income depends on how quickly assets and funding reprice.',
      formula: 'NII = interest income - interest expense, over the same period and scope',
      articles: [{ label: 'Government debt is catching up with Europe’s banks', href: '/en/analysis/european-banks-sovereign-debt-bond-shock/', detail: 'Deutsche Bank’s published one-year sensitivity, separate from EVE.', kind: 'article' }],
      sources: [{ label: 'Basel Committee, SRP98', href: 'https://www.bis.org/committees/bcbs/basel-framework/standard/srp/98/inforce/2026-01-01/published/2024-07-16', detail: 'Net interest income §98.21 and horizon choice §98.22.', kind: 'source' }],
      related: ['irrbb', 'eve', 'cet1'],
    },
  },
{
  "slug": "cyclotron",
  "sigle": "Cyclotron",
  "nom": "Particle accelerator for radionuclide production",
  "guide": "/en/analysis/ge-healthcare-buys-time/",
  "sectionTitle": "Industry & healthcare",
  "accent": "var(--color-signal)",
  "robots": "noindex,follow",
  "atlas": {
    "intuition": "Producing the radionuclide is one stage in making the medicine.",
    "articles": [
      {
        "label": "GE HealthCare buys time",
        "href": "/en/analysis/ge-healthcare-buys-time/",
        "kind": "article"
      }
    ],
    "sources": [
      {
        "label": "IAEA, Bulletin 55-4, December 2014, pp. 10-11",
        "href": "https://www.iaea.org/sites/default/files/bull554dec2014.pdf",
        "kind": "source"
      }
    ],
    "related": [
      "tep",
      "demi-vie",
      "cmo"
    ]
  },
  "def": "An accelerator of charged particles. In nuclear medicine, irradiating a target can produce radionuclides used to make radiopharmaceuticals. Further preparation and quality checks are needed before the medicine reaches a patient."
},
{
  "slug": "tep",
  "sigle": "PET",
  "nom": "Positron emission tomography",
  "guide": "/en/analysis/ge-healthcare-buys-time/",
  "sectionTitle": "Industry & healthcare",
  "accent": "var(--color-signal)",
  "robots": "noindex,follow",
  "atlas": {
    "intuition": "Functional imaging depends on both the tracer and the scanner.",
    "articles": [
      {
        "label": "GE HealthCare buys time",
        "href": "/en/analysis/ge-healthcare-buys-time/",
        "kind": "article"
      }
    ],
    "sources": [
      {
        "label": "NIH/NIBIB, Nuclear Medicine",
        "href": "https://www.nibib.nih.gov/science-education/science-topics/nuclear-medicine",
        "kind": "source"
      }
    ],
    "related": [
      "cyclotron",
      "demi-vie",
      "theranostique"
    ]
  },
  "def": "An imaging technique that uses a positron-emitting radiotracer to observe biological processes. The scanner detects photons produced by positron annihilation. What the scan reveals depends on the tracer used."
},
{
  "slug": "demi-vie",
  "sigle": "Half-life",
  "nom": "Physical radioactive half-life",
  "guide": "/en/analysis/ge-healthcare-buys-time/",
  "sectionTitle": "Industry & healthcare",
  "accent": "var(--color-signal)",
  "robots": "noindex,follow",
  "atlas": {
    "intuition": "Decay continues during preparation and transport.",
    "articles": [
      {
        "label": "GE HealthCare buys time",
        "href": "/en/analysis/ge-healthcare-buys-time/",
        "kind": "article"
      }
    ],
    "sources": [
      {
        "label": "FDA, PIXCLARA, sections 11.2 and 16, September 2026",
        "href": "https://www.accessdata.fda.gov/drugsatfda_docs/label/2026/218592Orig1s000lbl.pdf",
        "kind": "source"
      }
    ],
    "related": [
      "cyclotron",
      "tep"
    ],
    "formula": "A(t) = A(0) × 2^(−t/T½), with t and T½ expressed in the same time unit"
  },
  "def": "The time required for a radionuclide’s activity to fall by half through nuclear decay. Physical half-life differs from a medicine’s shelf life and does not, by itself, determine the longest permitted delivery time."
},
{
  "slug": "cmo",
  "sigle": "CMO",
  "nom": "Contract manufacturing organization",
  "guide": "/en/analysis/ge-healthcare-buys-time/",
  "sectionTitle": "Industry & healthcare",
  "accent": "var(--color-signal)",
  "robots": "noindex,follow",
  "atlas": {
    "intuition": "The commercial relationship also carries manufacturing responsibilities.",
    "articles": [
      {
        "label": "GE HealthCare buys time",
        "href": "/en/analysis/ge-healthcare-buys-time/",
        "kind": "article"
      },
      {
        "label": "The price of reliable medicine supply",
        "href": "/en/analysis/drug-shortages-price-of-reliability/",
        "kind": "article"
      }
    ],
    "sources": [
      {
        "label": "FDA, Contract Manufacturing Arrangements for Drugs, November 2016",
        "href": "https://www.fda.gov/regulatory-information/search-fda-guidance-documents/contract-manufacturing-arrangements-drugs-quality-agreements-guidance-industry",
        "kind": "source"
      }
    ],
    "related": [
      "cdmo",
      "cyclotron",
      "principe-actif"
    ]
  },
  "def": "A business that performs manufacturing operations under contract for another company. Its assigned work depends on the agreement. In pharmaceuticals, outsourcing does not remove either party’s applicable quality obligations."
},
{
  "slug": "cdmo",
  "sigle": "CDMO",
  "nom": "Contract development and manufacturing organization",
  "guide": "/en/analysis/ge-healthcare-buys-time/",
  "sectionTitle": "Industry & healthcare",
  "accent": "var(--color-signal)",
  "robots": "noindex,follow",
  "atlas": {
    "intuition": "Developing a process and manufacturing batches are distinct activities.",
    "articles": [
      {
        "label": "GE HealthCare buys time",
        "href": "/en/analysis/ge-healthcare-buys-time/",
        "kind": "article"
      },
      {
        "label": "The price of reliable medicine supply",
        "href": "/en/analysis/drug-shortages-price-of-reliability/",
        "kind": "article"
      }
    ],
    "sources": [
      {
        "label": "GE HealthCare, SOFIE agreement, October 5, 2026",
        "href": "https://www.gehealthcare.com/en-us/about/newsroom/press-releases/ge-healthcare-to-acquire-sofie-biosciences-establishing-a-final-mile-footprint-for-pet-radiopharmaceutical-supply-in-the-us",
        "kind": "source"
      },
      {
        "label": "FDA, Contract Manufacturing Arrangements for Drugs, November 2016",
        "href": "https://www.fda.gov/regulatory-information/search-fda-guidance-documents/contract-manufacturing-arrangements-drugs-quality-agreements-guidance-industry",
        "kind": "source"
      }
    ],
    "related": [
      "cmo",
      "theranostique",
      "principe-actif"
    ]
  },
  "def": "A provider of contracted development and manufacturing services. Its work can combine process development or transfer with production. The agreement defines the services; the label does not establish that a medicine has regulatory approval."
},
{
  "slug": "theranostique",
  "sigle": "Theranostics",
  "nom": "Diagnostic imaging paired with targeted treatment",
  "guide": "/en/analysis/ge-healthcare-buys-time/",
  "sectionTitle": "Industry & healthcare",
  "accent": "var(--color-signal)",
  "robots": "noindex,follow",
  "atlas": {
    "intuition": "Imaging a target and treating it require suitable products.",
    "articles": [
      {
        "label": "GE HealthCare buys time",
        "href": "/en/analysis/ge-healthcare-buys-time/",
        "kind": "article"
      }
    ],
    "sources": [
      {
        "label": "NIH/NIBIB, Nuclear Medicine, radiotheranostics",
        "href": "https://www.nibib.nih.gov/science-education/science-topics/nuclear-medicine",
        "kind": "source"
      }
    ],
    "related": [
      "tep",
      "cdmo"
    ]
  },
  "def": "An approach pairing diagnosis with targeted treatment. In nuclear medicine, related molecules aimed at the same target can carry different radionuclides for imaging and therapy. A diagnostic tracer alone is not a treatment."
},
  {
    "slug": "gpu",
    "sigle": "GPU",
    "nom": "Graphics processing unit",
    "def": "A processor designed to run many calculations in parallel, used for graphics rendering and artificial intelligence. In a computing service, practical performance also depends on memory, interconnects and software. Technical usefulness does not establish the cash receipts a fleet can earn.",
    "guide": "/en/analysis/gpu-backed-debt-fourth-year/",
    "sectionTitle": "Macro & central banks",
    "accent": "var(--color-signal)",
    "robots": "noindex,follow",
    "atlas": {
      "intuition": "Computing capability, carrying value and rental cash receipts answer different questions.",
      "articles": [
        {
          "label": "GPU-backed debt: pricing the fourth year",
          "href": "/en/analysis/gpu-backed-debt-fourth-year/",
          "detail": "Contracts, renewal cash flows and hypothetical loan scenarios.",
          "kind": "article"
        },
        {
          "label": "The collateral that cannot leave the building",
          "href": "/en/analysis/collateral-that-cannot-leave-the-building/",
          "kind": "article"
        }
      ],
      "sources": [
        {
          "label": "Nvidia, CUDA Programming Guide",
          "href": "https://docs.nvidia.com/cuda/cuda-programming-guide/01-introduction/programming-model.html",
          "detail": "Parallel execution and the organisation of GPU work.",
          "kind": "source"
        },
        {
          "label": "AWS, EC2 P4 instances",
          "href": "https://aws.amazon.com/ec2/instance-types/p4/",
          "detail": "A service combining A100 GPUs, memory, interconnects and storage; catalogue availability does not measure a fleet’s receipts.",
          "kind": "source"
        }
      ],
      "related": [
        "ddtl",
        "dscr",
        "collateral"
      ]
    }
  },
  {
    "slug": "ddtl",
    "sigle": "DDTL",
    "nom": "Delayed-draw term loan",
    "def": "A term-loan facility whose funds can be drawn later, in one or more advances within an agreed period, subject to contractual conditions. The committed ceiling differs from the amount actually borrowed. Draw timing, fees, maturity and security depend on the transaction.",
    "guide": "/en/analysis/collateral-that-cannot-leave-the-building/",
    "sectionTitle": "Private credit & markets",
    "accent": "var(--color-accent)",
    "robots": "noindex,follow",
    "atlas": {
      "intuition": "A commitment to provide funds organises financing; it does not establish the amount already owed or the future cash available to repay it.",
      "whyNow": "CoreWeave’s DDTL 5.5, documented in August 2026, finances servers and related infrastructure subject to draw conditions. It shows how customer contracts, borrowing availability and debt maturity can follow separate timelines.",
      "articles": [
        {
          "label": "The collateral that cannot leave the building",
          "href": "/en/analysis/collateral-that-cannot-leave-the-building/",
          "kind": "article"
        },
        {
          "label": "GPU-backed debt: pricing the fourth year",
          "href": "/en/analysis/gpu-backed-debt-fourth-year/",
          "detail": "Contracts, renewal cash flows and hypothetical loan scenarios.",
          "kind": "article"
        }
      ],
      "sources": [
        {
          "label": "CoreWeave / SEC, August 7, 2026 8-K",
          "href": "https://www.sec.gov/Archives/edgar/data/1769628/000176962826000357/crwv-20260807.htm",
          "detail": "DDTL 5.5 availability and maturity; a facility commitment differs from the drawn balance.",
          "kind": "source"
        },
        {
          "label": "CoreWeave / SEC, DDTL 5.5 agreement",
          "href": "https://www.sec.gov/Archives/edgar/data/1769628/000176962826000357/ex101creditagreement.htm",
          "detail": "Draw conditions, amortisation, prepayment and security; some schedules are redacted.",
          "kind": "source"
        }
      ],
      "related": [
        "dscr",
        "take-or-pay",
        "collateral",
        "gpu"
      ]
    }
  },
  {
    "slug": "national-trust-bank",
    "sigle": "National trust bank",
    "nom": "A US national bank limited to trust company operations",
    "def": "A US national bank whose activities are limited to trust company operations and authorised related activities, chartered and supervised by the OCC. Its services may include fiduciary administration and custody. The charter alone does not establish a product’s insurance coverage or grant access to a Federal Reserve account.",
    "guide": "/en/analysis/crypto-banks-occ-icba-trust-charters-deposits/",
    "sectionTitle": "US regulation & institutions",
    "accent": "var(--color-topic-blue)",
    "robots": "noindex,follow",
    "atlas": {
      "intuition": "The charter sets the permitted scope of the institution; customer rights also depend on the product, contract and applicable protections.",
      "whyNow": "The OCC rule effective April 1, 2026, aligns the regulatory text with trust company operations. Proposed activities and their legal authority remain subject to individual review. The February 13, 2026 Protego decision granted preliminary conditional approval; its requirements include at least $15 million in Tier 1 capital.",
      "articles": [
        {
          "label": "Crypto and the fight over the word bank",
          "href": "/en/analysis/crypto-banks-occ-icba-trust-charters-deposits/",
          "kind": "article"
        }
      ],
      "guides": [
        {
          "label": "Reading a bank’s soundness",
          "href": "/en/guides/read-bank-health/",
          "detail": "Separate capital, liquidity and deposit protection.",
          "kind": "guide"
        }
      ],
      "sources": [
        {
          "label": "OCC, national trust bank final rule",
          "href": "https://www.occ.gov/news-issuances/federal-register/2026/91fr9977.pdf",
          "detail": "91 FR 9977: trust company operations, related activities and licensing review.",
          "kind": "source"
        },
        {
          "label": "OCC, Protego decision CD1366",
          "href": "https://www.occ.gov/topics/charters-and-licensing/interpretations-and-decisions/2026/cd1366.pdf",
          "detail": "Preliminary conditional approval, pages 1 and 8: opening and capital/liquidity requirements.",
          "kind": "source"
        },
        {
          "label": "FDIC, Your Insured Deposits",
          "href": "https://www.fdic.gov/resources/deposit-insurance/brochures/insured-deposits",
          "detail": "Eligible deposits, ownership categories and the exclusion of crypto assets.",
          "kind": "source"
        },
        {
          "label": "Fed, May 20, 2026 payment account proposal",
          "href": "https://www.federalreserve.gov/newsevents/pressreleases/other20260520a.htm",
          "detail": "Eligibility and account approval are separate from a bank’s charter.",
          "kind": "source"
        }
      ],
      "related": [
        "aua",
        "genius",
        "ppsi",
        "cet1"
      ]
    }
  },
  {
    "slug": "aua",
    "sigle": "AUA",
    "nom": "Assets under administration",
    "def": "The value of client assets covered by administration, fiduciary or custody services, under the reporting institution’s stated scope. AUA measures neither the bank’s deposit funding nor its equity capital. Comparing it with assets under management requires checking the included services, valuation basis and observation date.",
    "guide": "/en/analysis/crypto-banks-occ-icba-trust-charters-deposits/",
    "sectionTitle": "Private credit & markets",
    "accent": "var(--color-accent)",
    "robots": "noindex,follow",
    "atlas": {
      "intuition": "The value entrusted by clients describes the scale of a service; it does not measure the bank’s resources to absorb losses.",
      "formula": "OCC scope at September 30, 2025: $6.8 trillion AUA = $5.2 trillion fiduciary accounts + $1.6 trillion custody and safekeeping accounts; rounded inputs.",
      "whyNow": "The Paxos decision reports this total for OCC-supervised uninsured national trust banks across the assets in that scope. It is neither deposit funding nor a crypto-only total.",
      "articles": [
        {
          "label": "Crypto and the fight over the word bank",
          "href": "/en/analysis/crypto-banks-occ-icba-trust-charters-deposits/",
          "kind": "article"
        }
      ],
      "guides": [
        {
          "label": "Reading a bank’s soundness",
          "href": "/en/guides/read-bank-health/",
          "detail": "Distinguish client assets from the bank’s own capital and funding.",
          "kind": "guide"
        }
      ],
      "sources": [
        {
          "label": "OCC, Paxos approval CA1358",
          "href": "https://www.occ.gov/topics/charters-and-licensing/interpretations-and-actions/2026/ca1358.pdf",
          "detail": "December 12, 2025 letter, page 3, footnote 7: AUA scope and observation date.",
          "kind": "source"
        }
      ],
      "related": [
        "national-trust-bank",
        "cet1"
      ]
    }
  },
  {
    slug: 'rsu', sigle: 'RSU', nom: 'Restricted stock unit',
    def: 'A right to receive shares after the plan’s vesting conditions are met, such as a service period or a performance target. A grant does not mean the recipient already owns the underlying shares. Vesting, actual delivery and subsequent disposals require separate checks.',
    guide: '/en/analysis/trump-jr-drones-unusual-machines-draganfly-industrial-policy/',
    ...privateCreditSection, robots: 'noindex,follow',
    atlas: {
      intuition: 'Promised share compensation and shares actually held describe different stages.',
      articles: [{ label: 'Trump Jr., drones and industrial policy', href: '/en/analysis/trump-jr-drones-unusual-machines-draganfly-industrial-policy/', kind: 'article' }],
      sources: [{ label: 'SEC, glossary: Restricted Stock', href: 'https://www.sec.gov/resources-small-businesses/glossary', kind: 'source' }],
      related: ['warrant', 'remuneration-en-actions'],
    },
  },
  {
    slug: 'warrant', sigle: 'Warrant', nom: 'Share subscription warrant',
    def: 'A security giving its holder the right to obtain shares under a specified exercise price, term and other contractual conditions. Shares underlying an unexercised warrant must be distinguished from shares already held. Exercise may lead to issuance and dilution; registering shares for resale records neither exercise nor an actual sale.',
    guide: '/en/analysis/trump-jr-drones-unusual-machines-draganfly-industrial-policy/',
    ...privateCreditSection, robots: 'noindex,follow',
    atlas: {
      intuition: 'A warrant gives access to shares under its terms; registration does not record its exercise.',
      articles: [{ label: 'Trump Jr., drones and industrial policy', href: '/en/analysis/trump-jr-drones-unusual-machines-draganfly-industrial-policy/', kind: 'article' }],
      sources: [{ label: 'Unusual Machines / SEC, December 5, 2024 prospectus', href: 'https://www.sec.gov/Archives/edgar/data/1956955/000168316824008527/umac_s1a1.htm', detail: 'Warrant terms and the distinction between registered shares and completed transactions.', kind: 'source' }],
      related: ['rsu', 'remuneration-en-actions'],
    },
  },
  {
    slug: 'collateral', sigle: 'Collateral', nom: 'An asset pledged to secure borrowing',
    def: 'An asset pledged to secure a debt. If the borrower fails to meet its obligations, the lender may realise the asset under the contract and applicable law. For Eurosystem operations, collateral must be eligible and its recognised value reflects haircuts and other risk controls. Pledging collateral provides borrowing capacity without creating bank equity.',
    guide: '/en/analysis/ecb-collateral-bank-credit-november-2026/',
    ...macroSection,
    robots: 'noindex,follow',
    atlas: {
      intuition: 'The value of an asset a bank owns and the borrowing it can support are different measures.',
      formula: 'simplified coverage = sum, for each eligible asset, of its value × (1 - its haircut as a fraction), excluding further adjustments',
      articles: [{ label: 'ECB collateral rules and bank credit in November 2026', href: '/en/analysis/ecb-collateral-bank-credit-november-2026/', kind: 'article' }, {"label": "GPU-backed debt: pricing the fourth year", "href": "/en/analysis/gpu-backed-debt-fourth-year/", "detail": "Contracts, renewal cash flows and hypothetical loan scenarios.", "kind": "article"}],
      sources: [
        { label: 'ECB, What is collateral?', href: 'https://www.ecb.europa.eu/ecb-and-you/explainers/tell-me/html/collateral.en.html', detail: 'Pledged assets and realisation following a default.', kind: 'source' },
        { label: 'ECB, What are haircuts?', href: 'https://www.ecb.europa.eu/ecb-and-you/explainers/tell-me-more/html/haircuts.en.html', detail: 'Post-haircut value and coverage of borrowing.', kind: 'source' },
      ],
      related: ['decote-de-garantie', 'ecaf', 'repo', 'abs', 'ddtl'],
    },
  },
  {
    slug: 'decote-de-garantie', sigle: 'Collateral haircut', nom: 'Valuation haircut on a pledged asset',
    def: 'A reduction applied to the value of a pledged asset to protect the lender against losses when realising collateral. At an unchanged valuation, a higher haircut reduces coverage, requiring more collateral to secure the same borrowing. It is distinct from the interest rate charged on funding and from an accounting loss on the asset.',
    guide: '/en/analysis/ecb-collateral-bank-credit-november-2026/',
    ...macroSection,
    robots: 'noindex,follow',
    atlas: {
      intuition: 'A haircut leaves a buffer for the lender to realise collateral after a default.',
      formula: 'post-haircut value = pre-haircut value × (1 - h), with h expressed as a fraction; excluding further markdowns',
      articles: [{ label: 'ECB collateral rules and bank credit in November 2026', href: '/en/analysis/ecb-collateral-bank-credit-november-2026/', kind: 'article' }],
      sources: [
        { label: 'ECB, What are haircuts?', href: 'https://www.ecb.europa.eu/ecb-and-you/explainers/tell-me-more/html/haircuts.en.html', detail: 'Definition, calculation and lender protection.', kind: 'source' },
        { label: 'Guideline ECB/2026/27', href: 'https://www.ecb.europa.eu/pub/pdf/legal/ecb.leg_gui_2026_27.en.pdf', detail: 'Article 1 and annex: schedules to be applied from 30 November 2026. Further valuation adjustments may apply.', kind: 'source' },
      ],
      related: ['collateral', 'ecaf', 'repo', 'abs'],
    },
  },
  {
    slug: 'ecaf', sigle: 'ECAF', nom: 'Eurosystem Credit Assessment Framework',
    def: 'The Eurosystem framework for assessing the credit quality of collateral, issuers, debtors and guarantors. It defines accepted procedures and assessment systems and maps their assessments to a harmonised quality scale. External rating agencies are one source among several; meeting the credit-quality criterion does not fulfil every collateral eligibility requirement.',
    guide: '/en/analysis/ecb-collateral-bank-credit-november-2026/',
    ...macroSection,
    robots: 'noindex,follow',
    atlas: {
      intuition: 'A rating informs credit-risk assessment; collateral eligibility and recognised value still require further checks.',
      articles: [{ label: 'ECB collateral rules and bank credit in November 2026', href: '/en/analysis/ecb-collateral-bank-credit-november-2026/', kind: 'article' }],
      sources: [{ label: 'ECB, Eurosystem credit assessment framework', href: 'https://www.ecb.europa.eu/mopo/coll/risk/ecaf/html/index.en.html', detail: 'Accepted sources, harmonised quality scale and specific ABS requirements.', kind: 'source' }],
      related: ['collateral', 'decote-de-garantie', 'repo', 'abs'],
    },
  },
  {
    slug: 'abs', sigle: 'ABS', nom: 'Asset-backed security',
    def: 'A security whose payments depend primarily on cash flows from a pool of claims, such as mortgages, car loans or consumer credit. Securitisation finances the pool through securities whose tranches have different payment priorities and loss exposure. Risk transfer depends on the structure and on which tranches are sold or retained. Retaining an ABS and pledging it as collateral does not itself transfer that risk to an outside investor.',
    guide: '/en/analysis/ecb-collateral-bank-credit-november-2026/',
    ...privateCreditSection,
    robots: 'noindex,follow',
    atlas: {
      intuition: 'Financing a pool of claims and transferring its risk require separate assessments.',
      articles: [{ label: 'ECB collateral rules and bank credit in November 2026', href: '/en/analysis/ecb-collateral-bank-credit-november-2026/', kind: 'article' }],
      sources: [
        { label: 'ECB, Tracing European structured finance counterparty networks', href: 'https://www.ecb.europa.eu/pub/pdf/scpops/ecb.op199.en.pdf#page=8', detail: 'Occasional Paper 199, Box 1, p. 7: cash flows, tranches and mortgage or other claims.', kind: 'source' },
        { label: 'ECB Banking Supervision, Securitisations: meeting significant risk transfer criteria', href: 'https://www.bankingsupervision.europa.eu/press/supervisory-newsletters/newsletter/2022/html/ssm.nl220518_4.en.html', detail: 'Retained tranches, remaining risk and significant risk transfer criteria.', kind: 'source' },
        { label: 'Guideline ECB/2026/27', href: 'https://www.ecb.europa.eu/pub/pdf/legal/ecb.leg_gui_2026_27.en.pdf', detail: 'Article 1(3): retained ABS and the senior tranche’s weighted average life; tables 2a and 3b.', kind: 'source' },
      ],
      related: ['collateral', 'decote-de-garantie', 'ecaf', 'repo'],
    },
  },
  {
  "slug": "ebitda",
  "sigle": "EBITDA",
  "nom": "Earnings Before Interest, Taxes, Depreciation and Amortisation",
  "def": "Earnings before interest, taxes, depreciation and amortisation. Adjusted EBITDA adds or subtracts further items whose definitions need checking. This metric does not measure available cash or capital expenditure.",
  "guide": "/en/analysis/paramount-warner-ellison-trump-fcc-media/",
  "sectionTitle": "Private credit & markets",
  "accent": "var(--color-accent)",
  "robots": "noindex,follow",
  "atlas": {
    "intuition": "Inspect adjustments before comparing debt with earnings.",
    "formula": "EBITDA = net income + interest + taxes + depreciation and amortisation",
    "articles": [
      {
        "label": "Paramount–Warner: capital, debt and editorial control",
        "href": "/en/analysis/paramount-warner-ellison-trump-fcc-media/",
        "kind": "article"
      }
    ],
    "sources": [
      {
        "label": "SEC, Non-GAAP Financial Measures, §103",
        "href": "https://www.sec.gov/rules-regulations/staff-guidance/corporation-finance-interpretations/non-gaap-financial-measures",
        "kind": "source"
      }
    ],
    "related": [
      "lbo"
    ]
  }
},
  {"slug": "transmission-des-prix", "sigle": "Price pass-through", "nom": "How input-cost changes reach selling prices", "def": "The adjustment of a selling price following a change in an upstream cost or price. Measurement requires a specified product, currency, scope and time horizon. Dividing two weekly price changes does not establish pass-through when observation periods, taxes and other costs differ.", "guide": "/en/analysis/emergency-oil-reserves-pass-through-pump-prices/", "sectionTitle": "Macro & central banks", "accent": "var(--color-signal)", "robots": "noindex,follow", "atlas": {"intuition": "How input-cost changes reach selling prices.", "articles": [{"label": "Emergency oil reserves: from the market to the pump", "href": "/en/analysis/emergency-oil-reserves-pass-through-pump-prices/", "kind": "article"}], "sources": [{"label": "Banque de France, findings published 14 October 2021", "href": "https://www.banque-france.fr/fr/publications-et-statistiques/publications/quelle-transmission-des-prix-du-petrole-aux-prix-des-carburants", "kind": "source"}], "related": ["spr"]}},
  {"slug": "contrefactuel", "sigle": "Counterfactual", "nom": "Estimated outcome without an intervention", "def": "An estimated outcome that would have occurred without an intervention, allowing for other relevant conditions. It provides a comparison with the observed result and depends on the model and its assumptions. A price decline following an announcement alone does not establish the announcement’s effect.", "guide": "/en/analysis/emergency-oil-reserves-pass-through-pump-prices/", "sectionTitle": "Macro & central banks", "accent": "var(--color-signal)", "robots": "noindex,follow", "atlas": {"intuition": "Estimated outcome without an intervention.", "articles": [{"label": "Emergency oil reserves: from the market to the pump", "href": "/en/analysis/emergency-oil-reserves-pass-through-pump-prices/", "kind": "article"}], "sources": [{"label": "Kilian and Zhou, Dallas Fed Working Paper 1916, version dated 19 December 2019", "href": "https://www.dallasfed.org/research/papers/2019/wp1916", "kind": "source"}], "related": ["spr"]}},
  {
    "slug": "backwardation",
    "sigle": "Backwardation",
    "nom": "Futures below the spot price",
    "def": "A market structure in which a futures price is below the spot price for a comparable product and market. Immediate physical supply can have industrial value, such as keeping production running. The curve alone does not establish a local shortage or a borrower’s profit; grade, location, timing, transport and financing must also be considered.",
    "guide": "/en/analysis/emergency-oil-reserves-sales-exchanges-allocation/",
    "sectionTitle": "Energy & geopolitics",
    "accent": "var(--color-amber)",
    "robots": "noindex,follow",
    "atlas": {
      "intuition": "Receiving oil promptly may be more valuable than receiving it later.",
      "articles": [
        {
          "label": "Emergency oil reserves: the contracts behind the release",
          "href": "/en/analysis/emergency-oil-reserves-sales-exchanges-allocation/",
          "kind": "article"
        }
      ],
      "sources": [
        {
          "label": "CME, contango and backwardation",
          "href": "https://www.cmegroup.com/education/courses/introduction-to-ferrous-metals/what-is-contango-and-backwardation",
          "kind": "source"
        }
      ],
      "related": [
        "spr"
      ]
    }
  },
  {
    "slug": "lc",
    "sigle": "LC",
    "nom": "Letter of credit",
    "def": "A conditional undertaking by a bank to pay against documents that satisfy the agreed terms. A documentary letter of credit supports a transaction; a standby letter of credit generally guarantees payment if the customer fails to perform. Its face amount is a banking commitment and need not equal a cash deposit by the customer.",
    "guide": "/en/analysis/emergency-oil-reserves-sales-exchanges-allocation/",
    "sectionTitle": "Markets & clearing",
    "accent": "var(--color-topic-blue)",
    "robots": "noindex,follow",
    "atlas": {
      "intuition": "Issuing a bank undertaking and drawing on it are separate events.",
      "articles": [
        {
          "label": "Emergency oil reserves: the buyer’s guarantees",
          "href": "/en/analysis/emergency-oil-reserves-sales-exchanges-allocation/",
          "detail": "A historical 2019 sales clause, kept separate from 2026 exchanges.",
          "kind": "article"
        }
      ],
      "sources": [
        {
          "label": "DOE, sales provisions in effect on 1 March 2019, C.21",
          "href": "https://www.energy.gov/sites/default/files/2025-06/Appendix%20A%20to%20Part%20625_%20Title%2010%20%28in%20effect%20on%203-01-2019%29.pdf",
          "detail": "Initial standby letter of credit for 100% of the contract value; not the terms of 2026 exchanges.",
          "kind": "source"
        }
      ],
      "related": [
        "spr"
      ]
    }
  },
{
  "slug": "pue",
  "sigle": "PUE",
  "nom": "Power Usage Effectiveness",
  "def": "Ratio of total data-centre energy to IT equipment energy, measured over the same period and boundary. A PUE of 1.30 means 0.30 units for infrastructure per unit consumed by IT. It measures site infrastructure, not algorithm efficiency, server utilisation or revenue from recovered heat.",
  "guide": "/en/analysis/bull-angers-supercomputer-factory/",
  "sectionTitle": "Digital economy & data",
  "accent": "var(--color-signal)",
  "atlas": {
    "intuition": "Compare site overhead at an unchanged IT load.",
    "formula": "PUE = total facility energy / IT energy",
    "whyNow": "Separate infrastructure costs from useful computing work.",
    "articles": [
      {
        "label": "Bull in Angers: chips, factory floors and cash flow",
        "href": "/en/analysis/bull-angers-supercomputer-factory/",
        "kind": "article"
      }
    ],
    "datasets": [
      {
        "label": "Hypothetical energy model at unchanged IT load",
        "href": "/data/bull-angers-energy-model.csv",
        "kind": "dataset"
      }
    ],
    "sources": [
      {
        "label": "DOE/FEMP: annual PUE definition",
        "href": "https://www.energy.gov/cmei/femp/cooling-water-efficiency-opportunities-federal-data-centers",
        "kind": "source"
      }
    ],
    "related": [
      "gpu",
      "bfr"
    ]
  }
},
{
  "slug": "pib",
  "sigle": "GDP",
  "nom": "Gross domestic product",
  "def": "Value of final goods and services produced within a territory over a period. The expenditure measure combines consumption, investment and government spending with exports, then subtracts imported content already included in those purchases. Higher imports alone do not identify the overall effect on production.",
  "guide": "/en/analysis/us-trade-deficit-imports-august-2026/",
  "sectionTitle": "Macro & central banks",
  "accent": "var(--color-signal)",
  "atlas": {
    "intuition": "Separate domestic spending from foreign production.",
    "formula": "GDP = C + I + G + X − M",
    "whyNow": "Read imports while separating spending, production and financing.",
    "articles": [
      {
        "label": "The US trade deficit, from the port to the factory",
        "href": "/en/analysis/us-trade-deficit-imports-august-2026/",
        "kind": "article"
      }
    ],
    "sources": [
      {
        "label": "BEA: NIPA chapter 8",
        "href": "https://www.bea.gov/resources/methodologies/nipa-handbook/pdf/chapter-08.pdf",
        "kind": "source"
      }
    ],
    "related": [
      "compte-courant",
      "van"
    ]
  }
},
{
  "slug": "compte-courant",
  "sigle": "Current account",
  "nom": "External current account",
  "def": "Balance of trade in goods and services, primary income and current transfers with the rest of the world. It equals national saving less investment. A deficit can be financed through liabilities to non-residents or a reduction in foreign assets; it does not identify a particular debt instrument or maturity.",
  "guide": "/en/analysis/us-trade-deficit-imports-august-2026/",
  "sectionTitle": "Macro & central banks",
  "accent": "var(--color-signal)",
  "atlas": {
    "intuition": "Connect trade to external financing while preserving different statistical boundaries.",
    "formula": "Current account = national saving − investment",
    "whyNow": "Read imports while separating spending, production and financing.",
    "articles": [
      {
        "label": "The US trade deficit, from the port to the factory",
        "href": "/en/analysis/us-trade-deficit-imports-august-2026/",
        "kind": "article"
      }
    ],
    "sources": [
      {
        "label": "IMF: Current Account Deficits",
        "href": "https://www.imf.org/en/publications/fandd/issues/series/back-to-basics/current-account-deficits",
        "kind": "source"
      }
    ],
    "related": [
      "pib",
      "van"
    ]
  }
},
{
  "slug": "van",
  "sigle": "NPV",
  "nom": "Net present value",
  "def": "Discounted future cash flows less the initial outlay. It depends on the amounts and timing of cash flows and the chosen discount rate. A positive NPV means the assumed receipts exceed the initial investment in present-value terms; it does not guarantee those receipts will materialise.",
  "guide": "/en/analysis/us-trade-deficit-imports-august-2026/",
  "sectionTitle": "Macro & central banks",
  "accent": "var(--color-signal)",
  "atlas": {
    "intuition": "Separate the value of purchases from the income they need to generate.",
    "formula": "NPV = Σ cash_t / (1 + r)^t − initial outlay",
    "whyNow": "Read imports while separating spending, production and financing.",
    "articles": [
      {
        "label": "The US trade deficit, from the port to the factory",
        "href": "/en/analysis/us-trade-deficit-imports-august-2026/",
        "kind": "article"
      }
    ],
    "sources": [
      {
        "label": "OpenStax / Rice University: NPV method",
        "href": "https://openstax.org/books/principles-finance-2e/pages/16-2-net-present-value-npv-method",
        "kind": "source"
      }
    ],
    "related": [
      "pib",
      "compte-courant"
    ],
    "datasets": [
      {
        "label": "Hypothetical project return model",
        "href": "/data/us-trade-project-model.csv",
        "kind": "dataset"
      }
    ]
  }
},
{
  "slug": "defi",
  "sigle": "DeFi",
  "nom": "Decentralised finance",
  "def": "Exchange, lending or financing services executed through blockchain contracts. Commercial interfaces, administrative rights and governance can influence access and parameters. Whether an operator holds the user’s keys does not describe the entire organisation of a service.",
  "guide": "/en/analysis/defi-gateways-mica-access/",
  "sectionTitle": "Crypto & stablecoins",
  "accent": "var(--color-amber)",
  "atlas": {
    "intuition": "Trace the interface, assets and contract powers separately.",
    "whyNow": "Examining DeFi interfaces requires separating fees, liquidity and control over rules.",
    "articles": [
      {
        "label": "Who runs DeFi’s front door?",
        "href": "/en/analysis/defi-gateways-mica-access/",
        "kind": "article"
      }
    ],
    "sources": [
      {
        "label": "ESMA: proposed DeFi access service, 30 September 2026",
        "href": "https://www.esma.europa.eu/sites/default/files/2026-09/ESMA75-113276571-1721_Response_to_the_EC_consultation_MiCA_regulation_review.pdf",
        "kind": "source"
      },
      {
        "label": "Ethereum: smart contracts",
        "href": "https://ethereum.org/developers/docs/smart-contracts/",
        "kind": "source"
      }
    ],
    "related": [
      "mica",
      "smart-contract",
      "facteur-de-sante"
    ]
  }
},
{
  "slug": "facteur-de-sante",
  "sigle": "Health factor",
  "nom": "Health factor",
  "def": "In Aave’s mechanism, collateral value weighted by liquidation thresholds divided by debt value. Below 1, the position becomes eligible for liquidation. It changes with prices and balances; actual parameters and execution rules depend on the deployment.",
  "guide": "/en/analysis/defi-gateways-mica-access/",
  "sectionTitle": "Crypto & stablecoins",
  "accent": "var(--color-amber)",
  "atlas": {
    "intuition": "Falling collateral can trigger liquidation even while the interface remains available.",
    "whyNow": "Examining DeFi interfaces requires separating fees, liquidity and control over rules.",
    "articles": [
      {
        "label": "Who runs DeFi’s front door?",
        "href": "/en/analysis/defi-gateways-mica-access/",
        "kind": "article"
      }
    ],
    "sources": [
      {
        "label": "Aave: Health Factor & Liquidations",
        "href": "https://aave.com/help/borrowing/liquidations",
        "kind": "source"
      }
    ],
    "related": [
      "defi",
      "smart-contract",
      "timelock"
    ],
    "formula": "HF = collateral value weighted by liquidation thresholds / debt value."
  }
},
{
  "slug": "timelock",
  "sigle": "Timelock",
  "nom": "Delayed contract operation",
  "def": "A mechanism that requires a delay between scheduling and executing a contract operation. It can provide time to examine a change. Its effect depends on authorised roles, covered operations and configuration; it guarantees neither the absence of other powers nor a liquid exit.",
  "guide": "/en/analysis/defi-gateways-mica-access/",
  "sectionTitle": "Crypto & stablecoins",
  "accent": "var(--color-amber)",
  "atlas": {
    "intuition": "A delay can make a change observable before execution, subject to the permissions actually configured.",
    "whyNow": "Examining DeFi interfaces requires separating fees, liquidity and control over rules.",
    "articles": [
      {
        "label": "Who runs DeFi’s front door?",
        "href": "/en/analysis/defi-gateways-mica-access/",
        "kind": "article"
      }
    ],
    "sources": [
      {
        "label": "OpenZeppelin: access control and delayed operations",
        "href": "https://docs.openzeppelin.com/contracts/5.x/access-control",
        "kind": "source"
      }
    ],
    "related": [
      "defi",
      "smart-contract"
    ]
  }
},
  {
  "slug": "dma",
  "sigle": "DMA",
  "nom": "Digital Markets Act",
  "def": "Regulation (EU) 2022/1925 seeking fair and contestable digital markets. It imposes obligations on designated gatekeepers for their core platform services. Article 6(11) requires search data access for other search engines on fair, reasonable and non-discriminatory terms, with anonymisation of the relevant users’ personal data. The GDPR still applies to personal data processing.",
  "guide": "/en/analysis/google-search-data-access-cost-privacy/",
  "sectionTitle": "Digital economy & data",
  "accent": "var(--color-signal)",
  "atlas": {
    "intuition": "Opening a digital market requires rules about eligible recipients, permitted uses, pricing and privacy safeguards.",
    "whyNow": "Google Search data sharing combines entry criteria, shared costs and protection of individuals.",
    "articles": [
      {
        "label": "Google: what is access to our searches worth?",
        "href": "/en/analysis/google-search-data-access-cost-privacy/",
        "kind": "article"
      }
    ],
    "sources": [
      {
        "label": "Digital Markets Act: Article 6(11)",
        "href": "https://eur-lex.europa.eu/eli/reg/2022/1925/oj",
        "kind": "source"
      },
      {
        "label": "Commission: 16 July 2026 Google Search decision",
        "href": "https://ec.europa.eu/competition/digital_markets_act/cases/202637/DMA_100209_2799.pdf",
        "kind": "source"
      },
      {
        "label": "Commission: search data sharing conditions",
        "href": "https://digital-markets-act.ec.europa.eu/businesses-portal/data-access/alphabet-specification-proceedings-sharing-google-search-data_en",
        "kind": "source"
      }
    ],
    "related": [
      "pseudonymisation",
      "segment-d-audience"
    ]
  }
},
  {
  "slug": "cop",
  "sigle": "COP",
  "nom": "Coefficient of performance",
  "def": "Useful heat delivered divided by electricity consumed by a heat pump, using the same measurement boundary. A COP of 2 means two units of heat per unit of electricity; the additional heat comes from an external source. Its value depends on temperatures, load and which auxiliaries are included.",
  "guide": "/en/analysis/industrial-heat-if26-carbon-premium-year-six/",
  "sectionTitle": "Energy & geopolitics",
  "accent": "var(--color-amber)",
  "atlas": {
    "formula": "COP = useful heat / electricity consumed, in the same unit.",
    "articles": [
      {
        "label": "The factory, its boiler and year six",
        "href": "/en/analysis/industrial-heat-if26-carbon-premium-year-six/",
        "kind": "article"
      }
    ],
    "sources": [
      {
        "label": "IEA: industrial heat",
        "href": "https://www.iea.org/commentaries/can-low-temperature-heat-in-factories-be-electrified-competitively",
        "kind": "source"
      }
    ],
    "related": [
      "pay-as-bid"
    ]
  }
},
  {
  "slug": "pay-as-bid",
  "sigle": "Pay-as-bid",
  "nom": "Payment at the offered price",
  "def": "Auction pricing rule under which each successful bidder receives its own offered price, subject to the scheme’s conditions. The ranking price may be adjusted separately: in IF26 an eligible bonus reduces the ranking price by 25% while retaining the requested premium.",
  "guide": "/en/analysis/industrial-heat-if26-carbon-premium-year-six/",
  "sectionTitle": "Energy & geopolitics",
  "accent": "var(--color-amber)",
  "atlas": {
    "formula": "IF26: ranking price with bonus = offered price × 0.75; payment = offered price.",
    "articles": [
      {
        "label": "The factory, its boiler and year six",
        "href": "/en/analysis/industrial-heat-if26-carbon-premium-year-six/",
        "kind": "article"
      }
    ],
    "sources": [
      {
        "label": "Commission: IF26 terms, sections 1.10 and 3.3",
        "href": "https://climate.ec.europa.eu/document/download/00753a0b-1de3-4e9c-aa47-799d811bede9_en?filename=if26_heat_auction_tc_en.pdf",
        "kind": "source"
      }
    ],
    "related": [
      "cop"
    ]
  }
},
  {
  "slug": "dora",
  "sigle": "DORA",
  "nom": "Digital Operational Resilience Act",
  "def": "Regulation (EU) 2022/2554 on digital operational resilience in finance, applicable since January 17, 2025. It addresses ICT risk, major incidents, testing and ICT supplier relationships for financial entities within its scope. European oversight of critical providers complements each entity’s responsibility to manage its own risks.",
  "atlas": {
    "intuition": "A shared supplier can transmit disruption across institutions. DORA combines each entity’s risk management with oversight of critical providers.",
    "sources": [
      {
        "label": "EBA: DORA application and registers",
        "href": "https://www.eba.europa.eu/activities/direct-supervision-and-oversight/digital-operational-resilience-act/preparation-dora-application",
        "kind": "source"
      },
      {
        "label": "EBA: DORA oversight",
        "href": "https://www.eba.europa.eu/activities/direct-supervision-and-oversight/digital-operational-resilience-act/dora-oversight",
        "kind": "source"
      }
    ],
    "related": [
      "ctpp"
    ],
    "articles": [
      {
        "label": "The invisible suppliers of European banking risk",
        "href": "/en/analysis/invisible-suppliers-european-banking-risk/",
        "kind": "article"
      }
    ]
  },
  "guide": "/en/analysis/invisible-suppliers-european-banking-risk/",
  "sectionTitle": "Digital economy & data",
  "accent": "var(--color-signal)"
},
  {
  "slug": "ctpp",
  "sigle": "CTPP",
  "nom": "Critical ICT Third-Party Provider",
  "def": "An ICT third-party supplier designated as critical by European supervisors under DORA. Designation considers systemic importance, the functions supported and the substitutability of services. It brings the supplier under European oversight; it does not guarantee uninterrupted service.",
  "atlas": {
    "intuition": "Criticality concerns a supplier’s role in Europe’s financial sector and the difficulty of replacing its services.",
    "sources": [
      {
        "label": "European supervisors: designation, November 18, 2025",
        "href": "https://www.eba.europa.eu/publications-and-media/press-releases/european-supervisory-authorities-designate-critical-ict-third-party-providers-under-digital",
        "kind": "source"
      },
      {
        "label": "EBA: DORA oversight",
        "href": "https://www.eba.europa.eu/activities/direct-supervision-and-oversight/digital-operational-resilience-act/dora-oversight",
        "kind": "source"
      }
    ],
    "related": [
      "dora"
    ],
    "articles": [
      {
        "label": "The invisible suppliers of European banking risk",
        "href": "/en/analysis/invisible-suppliers-european-banking-risk/",
        "kind": "article"
      }
    ]
  },
  "guide": "/en/analysis/invisible-suppliers-european-banking-risk/",
  "sectionTitle": "Digital economy & data",
  "accent": "var(--color-signal)"
},
  {
  "slug": "bonification-d-interet",
  "sigle": "Interest subsidy",
  "nom": "Third-party contribution to loan interest",
  "def": "Support under which a third party, such as the public budget, pays part of the interest on an eligible loan. Borrower costs fall according to the scheme’s base, rate and duration, while principal remains repayable. Support can decline with outstanding principal and end before the loan does.",
  "atlas": {
    "intuition": "The lender receives contractual interest, shared between the household and the budget under the programme’s terms.",
    "formula": "illustrative monthly support = eligible opening principal × annual subsidy rate / 12",
    "sources": [
      {
        "label": "MOF, PBOC and NFRA: September 29, 2026 notice",
        "href": "https://www.pbc.gov.cn/goutongjiaoliu/113456/113469/2026092917051440583/index.html",
        "kind": "source"
      }
    ],
    "related": [
      "psl",
      "ltv"
    ],
    "articles": [
      {
        "label": "Beijing takes a share of the mortgage payment",
        "href": "/en/analysis/china-mortgage-subsidy-household-payments/",
        "kind": "article"
      }
    ]
  },
  "guide": "/en/analysis/china-mortgage-subsidy-household-payments/",
  "sectionTitle": "Macro & central banks",
  "accent": "var(--color-signal)"
},
  {
  "slug": "psl",
  "sigle": "PSL",
  "nom": "Pledged Supplementary Lending",
  "def": "A collateralised People’s Bank of China funding facility for development and policy banks. It provides resources for fields authorised by the central bank. Its rate and scope govern that funding channel; a budget subsidy on household interest uses a separate channel.",
  "atlas": {
    "intuition": "The central bank funds specialised public banks; final lending depends on eligible operations and fields.",
    "sources": [
      {
        "label": "PBOC: September 29, 2026 monetary tools",
        "href": "https://www.pbc.gov.cn/goutongjiaoliu/113456/113469/2026092917474922559/index.html",
        "kind": "source"
      }
    ],
    "related": [
      "bonification-d-interet",
      "collateral"
    ],
    "articles": [
      {
        "label": "Beijing takes a share of the mortgage payment",
        "href": "/en/analysis/china-mortgage-subsidy-household-payments/",
        "kind": "article"
      }
    ]
  },
  "guide": "/en/analysis/china-mortgage-subsidy-household-payments/",
  "sectionTitle": "Macro & central banks",
  "accent": "var(--color-signal)"
},
  {
    slug: 'repricing-obligataire',
    sigle: 'Bond repricing',
    nom: 'Reassessment of bond prices and yields',
    def: 'An adjustment in bond prices and yields as financing conditions or expectations change. For a fixed-cash-flow security, a higher required yield lowers its price. Market repricing can be immediate; transmission to the issuer’s interest bill depends on new issues, maturities and rate clauses.',
    guide: '/en/analysis/the-world-rediscovers-the-price-of-money/',
    ...macroSection,
    atlas: {
      intuition: 'Payments can stay fixed while the bond’s price changes; the next issue meets the new yield environment.',
      whyNow: 'Long yields connect monetary expectations with refinancing schedules and valuations.',
      articles: [{ label: 'The world rediscovers the price of money', href: '/en/analysis/the-world-rediscovers-the-price-of-money/', kind: 'article' }],
      sources: [
        { label: 'ECB, yield curves and discounting', href: 'https://www.ecb.europa.eu/stats/financial_markets_and_interest_rates/euro_area_yield_curves/html/index.en.html', detail: 'Prices, future cash flows, spot rates and par yields.', kind: 'source' },
        { label: 'Federal Reserve, Kim–Wright model', href: 'https://www.federalreserve.gov/data/three-factor-nominal-term-structure-model.htm', detail: 'Expected short rates, term premiums and estimation limits.', kind: 'source' },
      ],
      related: ['duration', 'prime-de-terme', 'courbe-des-taux'],
    },
  },
  {
    slug: 'ofz',
    sigle: 'OFZ',
    nom: 'Russian federal government bonds',
    def: 'Debt securities issued by the Russian federal government. They provide funding in exchange for future payments governed by each issue’s terms. Fixed and floating coupons allocate interest-rate risk differently. A repo can provide liquidity to the holder of an eligible security, subject to conditions and a valuation haircut.',
    guide: '/en/analysis/russia-2027-budget-defence-debt-banks-credit/',
    ...macroSection,
    atlas: {
      intuition: 'The Treasury receives rubles at issuance; the bond’s terms determine subsequent payments.',
      whyNow: 'Domestic financing links Russia’s budget choices to bank portfolios and changes in interest rates.',
      articles: [{ label: 'Russia’s 2027 budget: defence, debt and banks', href: '/en/analysis/russia-2027-budget-defence-debt-banks-credit/', kind: 'article' }],
      sources: [
        { label: 'Bank of Russia: OFZ bonds', href: 'https://www.cbr.ru/eng/press/event/?id=28292', detail: 'Federal government bond terminology, February 6, 2026.', kind: 'source' },
        { label: 'Bank of Russia: repo operations', href: 'https://www.cbr.ru/eng/oper_br/t_odm/repo_operations/', detail: 'Liquidity, eligible securities and haircuts.', kind: 'source' },
        { label: 'BOFIT: floating-rate auction', href: 'https://www.bofit.fi/en/monitoring/weekly/2026/vw202639_1/', detail: 'Domestic financing observed in early September 2026.', kind: 'source' },
      ],
      related: ['repo', 'duration'],
    },
  },
  {
    "slug": "rpo",
    "sigle": "RPO",
    "nom": "Remaining performance obligations",
    "def": "The value of contracted customer services still to be recognised as revenue. Scope and recognition timing depend on the contracts and accounting rules. RPO is neither available cash nor an earned profit.",
    "guide": "/en/analysis/when-credit-starts-sorting-ai/",
    "sectionTitle": "Private credit & markets",
    "accent": "var(--color-accent)",
    "atlas": {
      "intuition": "The contract commits future services; cash collection and revenue recognition follow their own timetables.",
      "articles": [
        {
          "label": "When credit starts sorting AI",
          "href": "/en/analysis/when-credit-starts-sorting-ai/",
          "kind": "article"
        }
      ],
      "sources": [
        {
          "label": "Oracle, SEC, August 31, 2026 Form 10-Q, Note 1",
          "href": "https://www.sec.gov/Archives/edgar/data/1341439/000119312526389274/orcl-20260831.htm",
          "kind": "source"
        }
      ]
    }
  },
{
  "slug": "credit-carbone",
  "sigle": "Carbon credit",
  "nom": "A project-based emissions reduction or removal unit",
  "def": "A unit generally representing one tonne of CO₂ equivalent reduced or removed by a project under a specified programme and methodology. Its quality depends on additionality, the baseline, storage durability and prevention of double counting. Retirement prevents reuse of the unit; it does not reduce the life-cycle inventory of the product to which a buyer links it.",
  "guide": "/en/analysis/carbon-neutral-claims-offsets-product-risk/",
  "sectionTitle": "Macro & central banks",
  "accent": "var(--color-signal)",
  "atlas": {
    "intuition": "The registry records a unit; the project and its methodology determine the climate benefit.",
    "articles": [
      {
        "label": "Carbon credits: the product behind the zero",
        "href": "/en/analysis/carbon-neutral-claims-offsets-product-risk/",
        "kind": "article"
      }
    ],
    "sources": [
      {
        "label": "Verra : Verified Carbon Units",
        "href": "https://verra.org/programs/verified-carbon-standard/verified-carbon-units-vcus/",
        "kind": "source"
      },
      {
        "label": "ICVCM : Core Carbon Principles",
        "href": "https://icvcm.org/core-carbon-principles/",
        "kind": "source"
      }
    ],
    "related": [
      "additionnalite"
    ]
  }
},
{
  "slug": "additionnalite",
  "sigle": "Additionality",
  "nom": "Climate benefit dependent on carbon-credit revenue",
  "def": "The requirement that an emissions reduction or removal would not have occurred without the incentive created by carbon-credit revenue. Assessment compares the intervention with a credible trajectory without that funding. A project’s existence and compliance with a methodology do not by themselves establish the size of the additional benefit.",
  "guide": "/en/analysis/carbon-neutral-claims-offsets-product-risk/",
  "sectionTitle": "Macro & central banks",
  "accent": "var(--color-signal)",
  "atlas": {
    "intuition": "An intervention can be useful yet have happened without carbon-credit revenue.",
    "articles": [
      {
        "label": "Carbon credits: the product behind the zero",
        "href": "/en/analysis/carbon-neutral-claims-offsets-product-risk/",
        "kind": "article"
      }
    ],
    "sources": [
      {
        "label": "ICVCM : Core Carbon Principles",
        "href": "https://icvcm.org/core-carbon-principles/",
        "kind": "source"
      }
    ],
    "related": [
      "credit-carbone"
    ]
  }
},
  {"slug": "tpi", "sigle": "TPI", "nom": "Transmission Protection Instrument", "def": "ECB instrument announced in July 2022 for secondary-market purchases in response to unwarranted tensions threatening monetary-policy transmission. The Governing Council assesses fiscal policies and debt sustainability, among other criteria. An excessive deficit procedure alone does not exclude a country taking the required effective corrective action. Activation remains discretionary.", "guide": "/en/guides/read-european-sovereign-debt/", "sectionTitle": "Macro & central banks", "accent": "var(--color-signal)", "atlas": {"intuition": "Potential monetary support depends on economic and fiscal criteria and a decision by the Governing Council.", "articles": [{"label": "LFI and RN: debt, taxes and French political risk", "href": "/en/analysis/france-political-risk-lfi-rn-debt-tax-markets/", "kind": "article"}], "sources": [{"label": "ECB, Transmission Protection Instrument, 21 July 2022", "href": "https://www.ecb.europa.eu/press/pr/date/2022/html/ecb.pr220721~973e6e7273.en.html", "kind": "source"}]}},
  {
    slug: 'ccip', sigle: 'CCIP', nom: 'Cross-Chain Interoperability Protocol',
    def: 'Chainlink’s protocol for communication between blockchains. It carries messages whose attestations are checked at the destination; token contracts then perform the configured operations, such as minting or releasing units. Controls, finality and rights over the asset depend on configuration and legal arrangements.',
    guide: '/en/analysis/ccip-2-0-assets-rules-crypto-finance/',
    ...cryptoSection,
    atlas: {
      intuition: 'Each chain keeps its own ledger. A transfer requires checking the source message before changing the destination ledger.',
      articles: [{ label: 'CCIP 2.0: moving assets with their rules', href: '/en/analysis/ccip-2-0-assets-rules-crypto-finance/', kind: 'article' }],
      sources: [{ label: 'Chainlink, CCIP architecture', href: 'https://docs.chain.link/ccip/concepts/architecture/overview', kind: 'source' }],
      related: ['tokenisation-des-actifs', 'smart-contract'],
    },
  },
  {"slug": "streamshare", "sigle": "Streamshare", "nom": "Share of eligible streams", "sectionTitle": "Digital economy & data", "accent": "var(--color-signal)", "def": "A rights holder’s share of eligible streams within a defined market and period. In proportional allocation, that share determines its fraction of a royalty pool. Contracts then determine what reaches the creator. Counted artificial streams can dilute other rights holders’ shares.", "guide": "/en/analysis/ai-music-fake-streams-royalties/", "atlas": {"articles": [{"label": "AI music: who gets paid for fake streams?", "href": "/en/analysis/ai-music-fake-streams-royalties/", "kind": "article"}], "sources": [{"label": "Spotify, Understanding Spotify royalties", "href": "https://support.spotify.com/de-en/artists/article/understanding-spotify-royalties/", "kind": "source"}]}},
  {"slug": "marche-predictif", "sigle": "Prediction market", "nom": "Event contracts", "sectionTitle": "US regulation & institutions", "accent": "var(--color-topic-blue)", "def": "A market for contracts whose payout depends on the outcome of a defined event. Prices may be interpreted as implied probabilities, subject to liquidity, fees and resolution rules. Legal treatment depends on the contract, operating entity, jurisdiction and customer; US authorisation does not confer access rights in France.", "guide": "/en/analysis/polymarket-europe-betting-financial-products/", "atlas": {"articles": [{"label": "Polymarket and European financial regulation", "href": "/en/analysis/polymarket-europe-betting-financial-products/", "kind": "article"}], "sources": [{"label": "ESMA, event contracts and binary options, 3 July 2026", "href": "https://www.esma.europa.eu/sites/default/files/2026-07/ESMA35-243228190-8148_Public_Statement_on_the_application_of_the_national_product_intervention_measures_on_binary_options_to_event_contracts.pdf", "kind": "source"}]}},
  {
    slug: 'mvno', sigle: 'MVNO', nom: 'Mobile virtual network operator', sectionTitle: 'Digital economy & data', accent: 'var(--color-signal)',
    def: 'An operator that buys wholesale access to one or more mobile networks to sell its own services, without owning a radio network. It designs its offers and remains responsible for the services supplied to its customers. Its ability to compete depends partly on wholesale prices and the terms for switching host networks.',
    guide: '/en/analysis/sfr-breakup-phone-bill-networks-competition/',
    atlas: {
      articles: [{ label: 'SFR: what a break-up would mean for your phone bill', href: '/en/analysis/sfr-breakup-phone-bill-networks-competition/', kind: 'article' }],
      sources: [{ label: 'Arcep, MVNO definition and list', href: 'https://www.arcep.fr/mes-demarches-et-services/acteurs-regules/operateurs-telecoms/liste-des-mvno.html', kind: 'source' }],
    },
  },
  {"slug":"rachat-d-actions","sigle":"Share buyback","nom":"Share buyback","def":"A company’s purchase of its own shares. Buybacks may reduce shares outstanding or offset issuance, including shares delivered through employee plans. Cash spent, shares repurchased and the net change in shares outstanding measure different effects. The price paid and alternative uses of cash matter when assessing value creation.","guide":"/en/analysis/share-buybacks-anti-dilution-microsoft-airbus/","sectionTitle":"Private credit & markets","accent":"var(--color-accent)","atlas":{"articles":[{"label":"Share buybacks and dilution","href":"/en/analysis/share-buybacks-anti-dilution-microsoft-airbus/","kind":"article"}],"sources":[{"label":"Microsoft / SEC, Note 15, Stockholders’ Equity","href":"https://www.sec.gov/Archives/edgar/data/789019/000119312526323660/R25.htm","kind":"source"}],"related":["actions-propres","remuneration-en-actions"]}},
  {"slug":"actions-propres","sigle":"Treasury shares","nom":"Treasury shares","def":"Shares in a company’s own equity held by that company. They are excluded from shares outstanding while held, but need not be cancelled: they may be transferred later. IAS 32 deducts treasury shares from equity rather than recognising them as a financial asset.","guide":"/en/analysis/share-buybacks-anti-dilution-microsoft-airbus/","sectionTitle":"Private credit & markets","accent":"var(--color-accent)","atlas":{"articles":[{"label":"Share buybacks and dilution","href":"/en/analysis/share-buybacks-anti-dilution-microsoft-airbus/","kind":"article"}],"sources":[{"label":"AASB 132 / IAS 32, paragraphs 33 and AG36","href":"https://standards.aasb.gov.au/aasb-132-dec-2021","kind":"source"},{"label":"Microsoft / SEC, Note 2, Earnings per Share","href":"https://www.sec.gov/Archives/edgar/data/789019/000119312526323660/R12.htm","kind":"source"}],"related":["rachat-d-actions","remuneration-en-actions"]}},
  {"slug":"remuneration-en-actions","sigle":"Stock-based compensation","nom":"Stock-based compensation","def":"Compensation settled in, or based on, a company’s equity. Vesting and valuation depend on the plan. For equity-settled awards, the accounting expense is distinct from any cash spent on buybacks. A non-cash expense can coexist with dilution or with cash spent offsetting that dilution.","guide":"/en/analysis/share-buybacks-anti-dilution-microsoft-airbus/","sectionTitle":"Private credit & markets","accent":"var(--color-accent)","atlas":{"articles":[{"label":"Share buybacks and dilution","href":"/en/analysis/share-buybacks-anti-dilution-microsoft-airbus/","kind":"article"}],"sources":[{"label":"Microsoft / SEC, Note 17, Employee Stock Plans","href":"https://www.sec.gov/Archives/edgar/data/789019/000119312526323660/R27.htm","kind":"source"},{"label":"IFRS 2 Share-based Payment","href":"https://www.ifrs.org/issued-standards/list-of-standards/ifrs-2-share-based-payment/","kind":"source"}],"related":["rachat-d-actions","actions-propres"]}},
  {
    slug: 'indice-a-decrement', sigle: 'Decrement index', nom: 'Index with a predefined deduction', ...privateCreditSection,
    def: 'An index that includes reinvested dividends and subtracts a predefined amount in points or a percentage, according to its methodology. A fixed number of points becomes a larger proportion of the index as its level falls. For a structured note, this level may determine gains and conditional capital protection. The decrement is not a fee directly debited from the investment.',
    guide: '/en/analysis/structured-products-decrement-indices-savings-risk/',
    atlas: {
      articles: [{ label: 'Decrement indices and structured-note payouts', href: '/en/analysis/structured-products-decrement-indices-savings-risk/', kind: 'article' }],
      sources: [{ label: 'AMF-ACPR, explanatory note on structured products, June 2026 (French)', href: 'https://acpr.banque-france.fr/system/files/2026-06/20260622_Note_ACPR-AMF_Produits%20structur%C3%A9s.pdf', kind: 'source' }],
    },
  },
  {
    slug: 'tokenisation-des-actifs', sigle: 'Asset tokenisation', nom: 'Digital representation of assets or legal claims',
    def: 'Digital representation of an asset or a legal claim on a programmable ledger. A token may represent the security itself, a certificate issued by a third party or another contractual right. The technology can simplify transfers and settlement; rights, collateral and liquidity depend on the instrument and its legal arrangements.',
    guide: '/en/analysis/tokenized-stocks-xstocks-vaults-credit-yield/',
    ...cryptoSection,
    atlas: {
      intuition: 'A token may move quickly while still depending on an issuer, a custodian and redemption conditions.',
      articles: [{ label: 'Tokenised stocks: the credit behind the extra yield', href: '/en/analysis/tokenized-stocks-xstocks-vaults-credit-yield/', kind: 'article' }],
      sources: [{ label: 'BIS, the next-generation monetary and financial system', href: 'https://www.bis.org/publications/aer-2025/next-generation-monetary-financial-system', kind: 'source' }, { label: 'ESMA, qualification of crypto-assets as financial instruments', href: 'https://www.esma.europa.eu/sites/default/files/2025-03/ESMA75453128700-1323_Guidelines_on_the_conditions_and_criteria_for_the_qualification_of_CAs_as_FIs.pdf', kind: 'source' }],
      related: ['smart-contract', 'stablecoin'],
    },
  },
  {
    slug: 'seigneuriage', sigle: 'Seigniorage', nom: 'Income from issuing money',
    def: 'Income arising from money issuance. For central-bank banknotes, it is the income on the assets held against them, less the costs of producing, distributing and managing the notes. It depends on the assets and accounting framework, and differs from the face value of notes or the gains and losses on a QE portfolio.',
    guide: '/en/analysis/bank-of-england-qe-exit-treasury-banknotes/',
    ...macroSection,
    atlas: {
      intuition: 'Non-interest-bearing banknotes can fund income-earning assets, while issuing and managing the notes has a cost.',
      articles: [{ label: 'The Bank of England redraws its exit from QE', href: '/en/analysis/bank-of-england-qe-exit-treasury-banknotes/', kind: 'article' }],
      sources: [{ label: 'Bank of England: banknote backing and seigniorage', href: 'https://www.bankofengland.co.uk/bank-insights/2026/the-promise-to-pay-what-backs-banknotes', kind: 'source' }],
      related: ['repo', 'duration'],
    },
  },
  {
    slug: 'liste-repoussoir', sigle: 'Suppression list', nom: 'Exclusion list for marketing objections', sectionTitle: 'Digital economy & data', accent: 'var(--color-signal)',
    def: 'A file retaining only the information needed to avoid contacting someone who has objected to direct marketing. Its use is limited to respecting that objection, including preventing renewed contact after a list is imported again.',
    guide: '/en/analysis/personal-data-after-the-contract-ends/',
    atlas: {
      articles: [{ label: 'Personal data: what remains after the contract ends', href: '/en/analysis/personal-data-after-the-contract-ends/', kind: 'article' }],
      sources: [{ label: 'CNIL, suppression lists for direct-marketing objections', href: 'https://www.cnil.fr/fr/comment-utiliser-une-liste-repoussoir-pour-respecter-lopposition-la-prospection-commerciale', kind: 'source' }],
      related: ['profilage'],
    },
  },
  {
    slug: 'profilage', sigle: 'Profiling', nom: 'Automated evaluation of personal characteristics', sectionTitle: 'Digital economy & data', accent: 'var(--color-signal)',
    def: 'Automated processing of personal data to evaluate aspects of a person, such as interests, behaviour or movements. A profile may rely on inferences and contain errors. Profiling does not necessarily lead to a fully automated decision; aggregate statistics that do not evaluate individuals are not sufficient to establish profiling.',
    guide: '/en/analysis/personal-data-traces-to-saleable-profiles/',
    atlas: {
      articles: [
        { label: 'How our traces become profiles for sale', href: '/en/analysis/personal-data-traces-to-saleable-profiles/', kind: 'article' },
        { label: 'AI debt collection: who decides the next step?', href: '/en/analysis/ai-debt-collection-1-who-decides-reminder/', kind: 'article' },
      ],
      sources: [{ label: 'CNIL, profiling and fully automated decisions', href: 'https://www.cnil.fr/fr/profilage-et-decision-entierement-automatisee', kind: 'source' }],
      related: ['segment-d-audience', 'pseudonymisation'],
    },
  },
  {
    slug: 'segment-d-audience', sigle: 'Audience segment', nom: 'Identifiers selected under a rule', sectionTitle: 'Digital economy & data', accent: 'var(--color-signal)',
    def: 'Identifiers selected under a rule, such as an observed visit, a declared characteristic or a modelled interest. A segment label establishes neither that every person has the characteristic nor that the data may be reused for any purpose.',
    guide: '/en/analysis/personal-data-traces-to-saleable-profiles/',
    atlas: {
      articles: [{ label: 'How our traces become profiles for sale', href: '/en/analysis/personal-data-traces-to-saleable-profiles/', kind: 'article' }],
      sources: [{ label: 'IAB Tech Lab, Data Transparency Standard', href: 'https://iabtechlab.com/standards/data-transparency-standard/', kind: 'source' }],
      related: ['profilage', 'rtb'],
    },
  },
  {
    slug: 'sdk', sigle: 'SDK', nom: 'Software development kit', sectionTitle: 'Digital economy & data', accent: 'var(--color-signal)',
    def: 'Tools and components that developers can integrate into an application to add functions such as maps or advertising. Depending on its configuration, a kit may access resources available to the app. Its presence alone establishes neither active data collection nor a data sale.',
    guide: '/en/analysis/personal-data-economics-collection/',
    atlas: {
      articles: [{ label: 'The trade in our digital traces: who funds collection?', href: '/en/analysis/personal-data-economics-collection/', kind: 'article' }],
      sources: [{ label: 'CNIL, integrating SDKs while respecting privacy', href: 'https://www.cnil.fr/fr/applications-mobiles-comment-integrer-des-sdk-et-respecter-la-vie-privee-des-utilisateurs', kind: 'source' }],
    },
  },
  {
    slug: 'rtb', sigle: 'RTB', nom: 'Real-time bidding', sectionTitle: 'Digital economy & data', accent: 'var(--color-signal)',
    def: 'A real-time advertising auction in which buyers receive information about an available impression and submit a price. Some bid requests may contain device or location data. Receiving a request, winning an auction and having permission to reuse the information are distinct questions.',
    guide: '/en/analysis/personal-data-economics-collection/',
    atlas: {
      articles: [{ label: 'The trade in our digital traces: who funds collection?', href: '/en/analysis/personal-data-economics-collection/', kind: 'article' }],
      sources: [{ label: 'FTC, Mobilewalla complaint, paragraphs 7–11', href: 'https://www.ftc.gov/system/files/ftc_gov/pdf/Mobilewalla-Complaint.pdf', kind: 'source' }],
    },
  },
  {
    slug: 'price-walking', sigle: 'Price walking', nom: 'Tenure-based price increases', ...macroSection,
    def: 'Raising prices over successive renewals according to a customer’s likelihood of staying or accepting an increase, independently of changes in insured risk or servicing costs. In insurance, the practice can penalise customers who rarely shop around. Increases driven by claims costs involve a different mechanism.',
    guide: '/en/analysis/insurance-loyalty-pricing/',
    atlas: {
      articles: [{ label: 'Insurance: when loyalty becomes a pricing input', href: '/en/analysis/insurance-loyalty-pricing/', kind: 'article' }],
      sources: [{ label: 'EIOPA, differential pricing statement, 2023', href: 'https://www.eiopa.europa.eu/eiopa-supervisory-statement-takes-aim-unfair-price-walking-practices-2023-03-16_en', kind: 'source' }],
      related: ['tarification-algorithmique'],
    },
  },
  {
    slug: 'tarification-algorithmique', sigle: 'Algorithmic pricing', nom: 'Software-assisted price setting', ...macroSection,
    def: 'Using software rules to recommend or set prices from inputs such as costs, demand or rivals’ prices. The tool may follow fixed rules or learn from results. Algorithmic pricing does not necessarily involve personalised offers or collusion; its effects depend on the market and how the tools operate.',
    guide: '/en/analysis/pricing-algorithms-competition/',
    atlas: {
      articles: [{ label: 'Automated pricing and competition', href: '/en/analysis/pricing-algorithms-competition/', kind: 'article' }],
      sources: [{ label: 'Autorité de la concurrence and Bundeskartellamt, Algorithms and Competition', href: 'https://www.autoritedelaconcurrence.fr/sites/default/files/Algorithms_and_Competition_Working-Paper.pdf', kind: 'source' }],
    },
  },
  {
    slug: 'dscr', sigle: 'DSCR', nom: 'Debt-service coverage ratio', ...privateCreditSection,
    def: 'Cash available for debt service divided by interest and principal payments due over the same period. Below 1, those cash flows do not cover the payments. Contractual definitions vary; the ratio alone measures neither collateral value nor solvency.',
    guide: '/en/analysis/crux-ai-google-blackstone-bank-risk-chip-collateral/',
    robots: 'noindex,follow',
    atlas: {
      formula: 'DSCR = cash available for debt service / debt service over the same period',
      articles: [{ label: 'Crux AI: chips as collateral', href: '/en/analysis/crux-ai-google-blackstone-bank-risk-chip-collateral/', kind: 'article' }, { label: 'When credit starts sorting AI', href: '/en/analysis/when-credit-starts-sorting-ai/', kind: 'article' }, {"label": "GPU-backed debt: pricing the fourth year", "href": "/en/analysis/gpu-backed-debt-fourth-year/", "detail": "Contracts, renewal cash flows and hypothetical loan scenarios.", "kind": "article"}],
      sources: [{ label: 'EBRD, PPP project appraisal guidelines (hosted by the World Bank)', href: 'https://ppp.worldbank.org/sites/default/files/2024-07/VOLUME2-web.pdf', kind: 'source' }],
      related: ['step-in-rights', 'gpu', 'ddtl'],
    },
  },
  {
    slug: 'step-in-rights', sigle: 'Step-in rights', nom: 'Contractual lender intervention rights', ...privateCreditSection,
    def: 'Contractual rights allowing lenders, under specified conditions, to intervene in a distressed project or arrange a replacement operator. They can preserve essential operating contracts. Their scope and enforceability depend on governing law and signed agreements; a security interest in equipment does not automatically create them.',
    guide: '/en/analysis/crux-ai-google-blackstone-bank-risk-chip-collateral/',
    atlas: {
      articles: [{ label: 'Crux AI: chips as collateral', href: '/en/analysis/crux-ai-google-blackstone-bank-risk-chip-collateral/', kind: 'article' }],
      sources: [{ label: 'World Bank, lender protections', href: 'https://ppp.worldbank.org/lender-protections-and-government-support-ppps', kind: 'source' }],
      related: ['dscr', 'take-or-pay'],
    },
  },
  {
    slug: 'sieg', sigle: 'SGEI', nom: 'Service of general economic interest', ...macroSection,
    def: 'An economic activity subject to public-service obligations assigned by a public authority. Compensation may cover the net cost of those obligations under the applicable EU rules. Approval does not establish that money has been disbursed or manufacturing commitments fulfilled.',
    guide: '/en/analysis/drug-shortages-price-of-reliability/',
    atlas: {
      intuition: 'Payment covers defined obligations beyond the units sold.',
      articles: [{ label: 'The price of reliable medicine supply', href: '/en/analysis/drug-shortages-price-of-reliability/', kind: 'article' }],
      sources: [{ label: 'European Commission, Sanofi aid, 8 September 2026', href: 'https://germany.representation.ec.europa.eu/nachrichten-und-veranstaltungen/pressemitteilungen/kommission-genehmigt-deutsche-beihilfe-von-400-mio-euro-zur-versorgungssicherheit-bei-insulin-2026-09-08_de', kind: 'source' }],
    },
  },
  {
    slug: 'principe-actif', sigle: 'API', nom: 'Active pharmaceutical ingredient', ...macroSection,
    def: 'The substance responsible for a medicine’s effect. Further manufacturing and packaging turn it into the product intended for the patient. Active-ingredient inventory and ready-to-dispense medicine inventory therefore protect different stages of supply.',
    guide: '/en/analysis/drug-shortages-price-of-reliability/',
    atlas: {
      intuition: 'Material available upstream does not guarantee manufacturing capacity downstream.',
      articles: [{ label: 'The price of reliable medicine supply', href: '/en/analysis/drug-shortages-price-of-reliability/', kind: 'article' }],
      sources: [{ label: 'GAO, Drug Shortages, 2025', href: 'https://files.gao.gov/reports/GAO-25-107110/index.html', kind: 'source' }],
    },
  },
  {
    slug: 'risque-de-sequence', sigle: 'Sequence risk', nom: 'Sequence-of-returns risk',
    def: 'The risk arising from the timing of investment returns when a portfolio funds withdrawals. Early losses can force the sale of more units, leaving less capital to participate in a recovery. Two sequences with the same compound return may therefore support different incomes. The effect depends on the withdrawal rule and other available resources.',
    guide: '/en/analysis/retirement-sequence-of-returns-risk/', ...privateCreditSection,
    atlas: {
      intuition: 'The order of returns matters when withdrawals change how much remains invested.',
      articles: [{ label: 'Retirement and the average-return trap', href: '/en/analysis/retirement-sequence-of-returns-risk/', detail: 'Fictional examples and an interactive withdrawal model.', kind: 'article' }],
      sources: [{ label: 'Society of Actuaries, 2023', href: 'https://www.soa.org/globalassets/assets/files/resources/research-report/2023/ret-income-strat-de.pdf#page=73', detail: 'Section A.2: market and sequence-of-returns risks.', kind: 'source' }],
    },
  },
  {
    slug: 'reverse-yankee', sigle: 'Reverse Yankee', nom: 'US corporate bond issued in a foreign currency',
    def: 'A bond issued by a US company in a foreign currency, including the euro. Its funding cost depends on the reference rate, credit spread and any currency hedge. A lower coupon in another currency does not by itself establish a funding saving.',
    guide: '/en/analysis/ai-debt-sovereign-borrowers-credit-costs/', ...macroSection,
    atlas: {
      intuition: 'The issue currency changes funding terms and the investor base, while the borrower remains the same company.',
      articles: [{ label: 'AI debt and competition for credit', href: '/en/analysis/ai-debt-sovereign-borrowers-credit-costs/', detail: 'Euro funding, hedging and portfolio choices.', kind: 'article' }],
      sources: [{ label: 'ECB, Reverse Yankee bonds', href: 'https://www.ecb.europa.eu/press/other-publications/ire/focus/html/ecb.irebox202506_02~e5ae550b00.en.html', detail: 'Definition and hedged versus unhedged funding costs, June 2025.', kind: 'source' }],
      related: ['duration', 'prime-de-terme'],
    },
  },
  {
    slug: 'clarity', sigle: 'CLARITY', nom: 'CLARITY Act',
    def: 'Proposed US legislation that would, among other things, allocate digital-asset oversight between the SEC and CFTC. A House-passed bill, a negotiating draft and an enacted law have different legal status. A procedural vote does not itself create new obligations.',
    guide: '/en/analysis/clarity-after-the-49-50-vote/', sectionTitle: 'Institutions & regulation', accent: 'var(--color-accent)',
    atlas: {
      intuition: 'A bill’s parliamentary status determines whether its obligations are still proposals or have entered into force.',
      articles: [{ label: 'CLARITY after the 49–50 vote', href: '/en/analysis/clarity-after-the-49-50-vote/', detail: 'The procedural setback and SEC–CFTC proposals.', kind: 'article' }],
      sources: [{ label: 'Senate roll call 234, September 15, 2026', href: 'https://www.senate.gov/legislative/LIS/roll_call_votes/vote1192/vote_119_2_00234.htm', detail: 'Cloture on the motion to proceed to H.R. 3633 rejected.', kind: 'source' }],
      related: ['cloture'],
    },
  },
  {
    slug: 'cloture', sigle: 'Cloture', nom: 'Limiting debate in the US Senate',
    def: 'A procedure limiting Senate debate. For ordinary legislation, the general rule requires three-fifths of senators duly chosen and sworn, or 60 when all 100 seats are filled. Cloture on a motion to take up a bill remains distinct from passing the bill. Other procedures and exceptions exist.',
    guide: '/en/analysis/clarity-after-the-49-50-vote/', sectionTitle: 'Institutions & regulation', accent: 'var(--color-accent)',
    atlas: {
      intuition: 'Limiting debate is a procedural stage, separate from adopting legislation.',
      articles: [{ label: 'CLARITY after the 49–50 vote', href: '/en/analysis/clarity-after-the-49-50-vote/', detail: 'The official count and required threshold.', kind: 'article' }],
      sources: [{ label: 'Senate Republican Policy Committee', href: 'https://www.rpc.senate.gov/glossary', detail: 'Cloture, motions to proceed and reconsideration.', kind: 'source' }],
      related: ['clarity'],
    },
  },
  {
    slug: 'ia-de-frontiere', sigle: 'Frontier AI', nom: 'AI models at the leading edge of capabilities',
    def: 'A term for AI models among the most capable available. In a safety-policy discussion, its scope depends on the capabilities and risks being considered. The criteria used by a particular policy or regulation, and the date to which they apply, therefore need to be specified.',
    guide: '/en/analysis/pacing-ai-frontier-capital-politics/', sectionTitle: 'Private credit & markets', accent: 'var(--color-accent)',
    atlas: {
      sources: [
        { label: 'Dario Amodei, We Must Pace the Frontier', href: 'https://darioamodei.com/post/we-must-pace-the-frontier', detail: 'Personal proposal for coordination among the leading AI labs, September 12, 2026.', kind: 'source' },
        { label: 'OpenAI, The AI policy window is open', href: 'https://openai.com/index/ai-policy-window/', detail: 'Proposed obligations proportionate to capabilities and risks, distinguished from how weights are distributed, September 9, 2026.', kind: 'source' },
      ],
      related: ['modele-a-poids-ouverts'],
    },
  },
  {
    slug: 'modele-a-poids-ouverts', sigle: 'Open-weight model', nom: 'AI model distributed with its learned parameters',
    def: 'An AI model whose weights, the parameters learned during training, are made available so that others can run or adapt it. Permitted uses depend on the licence. Open weights describe a distribution arrangement; they do not by themselves determine how capable the model is.',
    guide: '/en/analysis/pacing-ai-frontier-capital-politics/', sectionTitle: 'Private credit & markets', accent: 'var(--color-accent)',
    atlas: {
      sources: [{ label: 'OpenAI, The AI policy window is open', href: 'https://openai.com/index/ai-policy-window/', detail: 'Distinguishes frontier capabilities from open-weight distribution, including deployment on local infrastructure, September 9, 2026.', kind: 'source' }],
      related: ['ia-de-frontiere'],
    },
  },
  {
    slug: 'unite-de-compte', sigle: 'Unit-linked option', nom: 'Investment-linked life insurance benefit',
    def: "A life insurance obligation expressed in units whose euro value tracks a financial or property investment. The insurer commits to a number of units; the policyholder bears changes in unit value, subject to any additional contractual guarantees. The policy surrender timetable and the underlying fund’s liquidity are separate questions.",
    guide: '/en/analysis/scpi-life-insurance-banks-contagion/', sectionTitle: 'Private credit & markets', accent: 'var(--color-accent)',
    atlas: { sources: [{ label: 'ABE Infoservice', href: 'https://www.abe-infoservice.fr/fr/assurance/assurance-vie/que-faut-il-savoir-avant-de-souscrire-beneficier-dun-conseil-adapte-comprendre-et-comparer-les', detail: 'Unit-linked commitments and capital-loss risk. French source.', kind: 'source' }], related: ['scpi', 'niveau-3-ifrs-9'] },
  },
  {
    slug: 'niveau-3-ifrs-9', sigle: 'IFRS 9 Stage 3', nom: 'Credit-impaired financial asset',
    def: "A category of financial assets with recognised credit impairment. The share of a portfolio classified as Stage 3 measures the affected exposure, not the amount irretrievably lost. Provisions, collateral and recoveries need to be examined separately.",
    guide: '/en/analysis/scpi-life-insurance-banks-contagion/', sectionTitle: 'Private credit & markets', accent: 'var(--color-accent)',
    atlas: { sources: [{ label: 'ACPR, Analyses et synthèses No 184', href: 'https://acpr.banque-france.fr/system/files/2026-07/20260724_AS184_financement_immobilier_commercial_2025.pdf', detail: 'Pages 16 and 25: Stage 3 exposures, provisions and IFRS 9 classification. French source.', kind: 'source' }], related: ['cet1', 'unite-de-compte'] },
  },
  {
    slug: 'levier-aifm', sigle: 'AIFM leverage', nom: 'Fund exposure relative to net asset value',
    def: "An alternative investment fund’s exposure divided by its net asset value. The gross and commitment methods have their own adjustments, so the method and scope must be identified. A fall in net value can raise the ratio without additional borrowing. Exceeding a fund’s leverage ceiling is distinct from missing a bank-loan payment.",
    guide: '/en/analysis/french-scpi-debt-property-sales-refinancing/', sectionTitle: 'Private credit & markets', accent: 'var(--color-accent)',
    atlas: { sources: [{ label: 'La Française REM, LF Grand Paris Patrimoine, 2025 annual report', href: 'https://doc.la-francaise.com/documents/rapport-annuel-lf-grand-paris-patrimoine-2025', detail: 'Page 16 and note 1: exposure, net asset value and gross method. Manager’s definition, French source.', kind: 'source' }, { label: 'LF Grand Paris Patrimoine, June 2026 information memorandum', href: 'https://www.moniwan.fr/documents/note-information-et-statuts-lf-grand-paris-patrimoine', detail: 'Section 3.2, PDF p. 9: limit and inclusion of controlled companies. French source.', kind: 'source' }], related: ['scpi', 'rdae'] },
  },
  {
    slug: 'rdae', sigle: 'RDAE', nom: 'Debt and other commitments ratio',
    def: "A professional SCPI measure dividing debt and other deferred-payment commitments by realisation value plus those same obligations. Interpretation requires the disclosed scope, including any indirect holdings, and the valuation date. It differs from a ratio based on acquisition costs and is not, by itself, a bank-loan covenant test.",
    guide: '/en/analysis/french-scpi-debt-property-sales-refinancing/', sectionTitle: 'Private credit & markets', accent: 'var(--color-accent)',
    atlas: { sources: [{ label: 'La Française REM, LF Grand Paris Patrimoine, 2025 annual report', href: 'https://doc.la-francaise.com/documents/rapport-annuel-lf-grand-paris-patrimoine-2025', detail: 'Page 16: ASPIM denominator and acquisition-cost comparison. French source.', kind: 'source' }], related: ['scpi', 'levier-aifm'] },
  },
  {
    slug: 'tof', sigle: "TOF", nom: "Financial occupancy rate",
    def: "An SCPI measure comparing billed rent and certain convention-based rental values with potential rental income. It includes rent-free premises, early access for future tenants and specified vacant or refurbishment categories under the ASPIM method. Weighted by rent, it measures neither occupied floor area nor cash collected.",
    guide: '/en/analysis/french-scpi-office-vacancy-rent-free-incentives/', sectionTitle: 'Private credit & markets', accent: 'var(--color-accent)',
    atlas: { sources: [{ label: "ASPIM, méthode de calcul des données financières, octobre 2025", href: "https://www.pierrepapier.fr/wp-content/uploads/2025/10/2025_10_Modalites-de-calcul-et-de-publication.pdf", detail: "Pages 2–4, TOF definition. Original French document on the PierrePapier public mirror.", kind: 'source' }], related: ["scpi","franchise-de-loyer"] },
  },
  {
    slug: 'franchise-de-loyer', sigle: "Rent-free period", nom: "Contractual rental concession",
    def: "A period during which rent is not due under the lease terms. It may help a tenant move in and delay receipts while premises are already occupied. It is distinct from arrears and reduces average rental income over the lease term. Other service charges depend on the contract.",
    guide: '/en/analysis/french-scpi-office-vacancy-rent-free-incentives/', sectionTitle: 'Private credit & markets', accent: 'var(--color-accent)',
    atlas: { sources: [{ label: "ImmoStat, définitions des indicateurs", href: "https://www.immostat.com/infos-marches/", detail: "Incentives: free rent, works contributions, stepped rents and early access. French-language methodology.", kind: 'source' }], related: ["tof","loyer-facial"] },
  },
  {
    slug: 'loyer-facial', sigle: "Headline rent", nom: "Contractual rent before incentives",
    def: "The rent stated in the lease before negotiated incentives such as free months or landlord fit-out contributions. Relating it to cash receipts requires the incentive package, firm term, preceding vacancy and other costs. It is not, by itself, net property income.",
    guide: '/en/analysis/french-scpi-office-vacancy-rent-free-incentives/', sectionTitle: 'Private credit & markets', accent: 'var(--color-accent)',
    atlas: { sources: [{ label: "ImmoStat, définitions des indicateurs", href: "https://www.immostat.com/infos-marches/", detail: "Incentives divided by cumulative headline rent over the firm lease term. French-language methodology.", kind: 'source' }], related: ["franchise-de-loyer","scpi"] },
  },
  {
    slug: 'taux-de-distribution', sigle: "Distribution yield", nom: "Income reporting measure for French SCPI funds",
    def: "Annual gross distribution per unit, including exceptional payouts and taxes paid for the investor under the ASPIM methodology, divided by the reference price. Variable-capital funds use the subscription price on 1 January; fixed-capital funds use the preceding year’s transaction-weighted average buyer price. It excludes changes in capital value and is not final personal after-tax income.",
    guide: '/en/analysis/french-scpi-yields-income-dividends-reserves/', sectionTitle: 'Private credit & markets', accent: 'var(--color-accent)',
    atlas: { sources: [{ label: "BNP Paribas AM, taux de distribution et PGA", href: "https://reim.bnpparibas-am.com/fr-fr/faq/scpi-vos-questions/indicateurs-de-performance/quappelle-t-le-taux-de-distribution-quelle", detail: "Professional definitions of distribution yield and overall annual performance. French-language source.", kind: 'source' }], related: ['scpi', 'report-a-nouveau'] },
  },
  {
    slug: 'report-a-nouveau', sigle: "Report à nouveau", nom: "Profit or loss carried forward",
    def: "In the context of an SCPI, profits from earlier years retained to support future distributions if needed. This is an equity account. Its origin and movements matter, including any transfer from issue premiums. The balance does not guarantee an equivalent amount of available cash.",
    guide: '/en/analysis/french-scpi-yields-income-dividends-reserves/', sectionTitle: 'Private credit & markets', accent: 'var(--color-accent)',
    atlas: { sources: [{ label: "Praemia REIM, Primopierre, rapport annuel 2025", href: "https://www.praemiareim.fr/documents/14836074/14836290/Primopierre%2BRapport%2BAnnuel%2B2025.pdf/32234cef-d9b6-60b3-9ad5-08bfa8420b37", detail: "Pages 46, 72 and 77: retained earnings, proposed allocation and definition. French-language source.", kind: 'source' }], related: ['scpi', 'taux-de-distribution'] },
  },
  {
    slug: 'valeur-de-realisation', sigle: 'Realisation value', nom: 'Appraisal-based net assets of a French SCPI',
    def: "The estimated market value of a SCPI’s properties plus its other assets, net of liabilities. It is a dated valuation reference, not a standing offer to buy investors’ units or a guarantee of a quick exit.",
    guide: '/en/analysis/french-scpi-resale-prices-liquidity-discounts/', sectionTitle: 'Private credit & markets', accent: 'var(--color-accent)',
    atlas: { sources: [{ label: 'HSBC REIM, Élysées Pierre offering document', href: 'https://www.reim.hsbc.fr/-/media/files/attachments/reim/bibliotheque-de-documents/ep-documentation-reglementaire/note-information-elysees-pierre', detail: 'Page 9: definitions of realisation and reconstitution values. French-language source.', kind: 'source' }], related: ['scpi', 'valeur-de-reconstitution'] },
  },
  {
    slug: 'valeur-de-reconstitution', sigle: 'Reconstitution value', nom: 'Theoretical cost of acquiring an equivalent French SCPI portfolio',
    def: "Realisation value plus the costs of acquiring an equivalent property portfolio, including acquisition costs and the subscription commission. This concerns transactions, not the physical reconstruction of buildings. It provides a reference for issuing new units; it is not a floor under resale prices for existing units.",
    guide: '/en/analysis/french-scpi-resale-prices-liquidity-discounts/', sectionTitle: 'Private credit & markets', accent: 'var(--color-accent)',
    atlas: { sources: [{ label: 'HSBC REIM, Élysées Pierre offering document', href: 'https://www.reim.hsbc.fr/-/media/files/attachments/reim/bibliotheque-de-documents/ep-documentation-reglementaire/note-information-elysees-pierre', detail: 'Page 9: reconstitution costs and subscription pricing. French-language source.', kind: 'source' }], related: ['scpi', 'valeur-de-realisation'] },
  },
  {
    slug: 'scpi',
    sigle: 'SCPI',
    nom: 'French unlisted property investment vehicle',
    def: "A société civile de placement immobilier pools investors’ money in a managed portfolio of rental property. Its units are unlisted; income, capital and a quick resale are not guaranteed. For directly held units, exit conditions depend on the vehicle’s variable-capital arrangements or its organised secondary market.",
    guide: '/en/analysis/french-scpi-exit-queues-liquidity-register-reset/',
    sectionTitle: 'Private credit & markets',
    accent: 'var(--color-accent)',
    atlas: {
      articles: [{ label: 'French SCPI funds: the price of getting out', href: '/en/analysis/french-scpi-resale-prices-liquidity-discounts/', detail: 'Executed prices, fees, volumes and valuation references.', kind: 'article' }],
      related: ['valeur-de-realisation', 'valeur-de-reconstitution'],
      sources: [
        { label: 'AMF, investing in an SCPI', href: 'https://www.amf-france.org/fr/espace-epargnants/comprendre-les-produits-financiers/placements-collectifs/scpi-un-autre-moyen-dinvestir-dans-limmobilier', detail: 'Unlisted property investment and liquidity risk. French-language source.', kind: 'source' },
        { label: 'AMF, redemptions and sell orders', href: 'https://www.amf-france.org/fr/le-mediateur/journal-de-bord-du-mediateur/dossiers-du-mois/scpi-contrairement-aux-ordres-de-vente-des-parts-les-demandes-de-retrait-sont-sans-duree-de-validite', detail: 'Direct holdings, request lifetimes and suspending variable capital. French-language source.', kind: 'source' },
      ],
    },
  },
  {
    slug: 'lifo',
    sigle: 'LIFO',
    nom: 'Last in, first out',
    def: "An inventory accounting method that assigns the costs of the most recent purchases to cost of sales first. It describes a cost-flow assumption, without dictating the physical order in which goods leave a warehouse. A valuation difference between methods is not a cash reserve.",
    guide: '/en/analysis/tungsten-inventory-cash-flow-kennametal/',
    sectionTitle: 'Private credit & markets',
    accent: 'var(--color-accent)',
    atlas: {
      sources: [{ label: 'Kennametal, 2026 10-K', href: 'https://www.sec.gov/Archives/edgar/data/55242/000162828026056143/kmt-20260630.htm', detail: 'Notes 2 and 7: accounting policies and the reconciliation from current cost to carrying value.', kind: 'source' }],
    },
  },
  {
    slug: 'hpal',
    sigle: 'HPAL',
    nom: 'High Pressure Acid Leaching',
    def: "High-pressure acid leaching treats selected nickel oxide ores with sulfuric acid at high temperature and pressure to dissolve the metals. Further processing yields an intermediate for refining. Reagent supply and ore characteristics affect plant operation.",
    guide: '/en/analysis/sulfur-gulf-crisis-fertilizers-nickel/',
    sectionTitle: 'Industry and commodities',
    accent: 'var(--color-amber)',
    atlas: {
      sources: [{ label: "Sumitomo Metal Mining, HPAL", href: 'https://www.smm.co.jp/en/glossary/', kind: 'source' }],
      related: ['mhp'],
    },
  },
  {
    slug: 'mhp',
    sigle: 'MHP',
    nom: 'Mixed Hydroxide Precipitate',
    def: "A hydroxide precipitate containing nickel and cobalt, produced by selected hydrometallurgical routes. The intermediate can be refined into battery materials. Tonnes of MHP differ from tonnes of contained nickel and from tonnes of pure nickel.",
    guide: '/en/analysis/sulfur-gulf-crisis-fertilizers-nickel/',
    sectionTitle: 'Industry and commodities',
    accent: 'var(--color-amber)',
    atlas: {
      sources: [{ label: "Halmahera Persada Lygend, products", href: 'https://hpalnickel.com/about/komoditi', kind: 'source' }],
      related: ['hpal'],
    },
  },
  {
    slug: 'cfr',
    sigle: 'CFR',
    nom: 'Cost and Freight',
    def: "A maritime Incoterm under which the seller pays freight to the named destination port. Risk transfers to the buyer when the goods are placed on board at the port of shipment. CFR imposes no insurance obligation on the seller and does not automatically cover delivery to a plant.",
    guide: '/en/analysis/sulfur-gulf-crisis-fertilizers-nickel/',
    sectionTitle: 'Industry and commodities',
    accent: 'var(--color-amber)',
    atlas: {
      sources: [{ label: "ICC Academy, CFR and CIF", href: 'https://academy.iccwbo.org/incoterms/article/incoterms-2020-cfr-or-cif/', kind: 'source' }],
    },
  },
  {
    slug: 'c1',
    sigle: 'C1',
    nom: 'Cash cost C1',
    def: "A mining-industry operating-cost measure, generally stated per unit of metal and net of by-product credits. Always check the reported definition, included costs and denominator. At Kamoa-Kakula it is a non-IFRS measure per payable pound of copper produced, distinct from the full cost of the investment.",
    guide: '/en/analysis/sulfur-gulf-crisis-fertilizers-nickel/',
    sectionTitle: 'Industry and commodities',
    accent: 'var(--color-amber)',
    atlas: {
      sources: [{ label: "Ivanhoe Mines, Q2 2026 results", href: 'https://www.ivanhoemines.com/news-stories/news-release/ivanhoe-mines-issues-2026-second-quarter-financial-results-overview-of-operations-and-exploration-activities/', kind: 'source' }],
    },
  },
  {
    slug: 'ieepa',
    sigle: 'IEEPA',
    nom: 'International Emergency Economic Powers Act',
    def: 'A 1977 US law granting the president emergency economic powers in response to certain foreign-origin threats. It provides authority for sanctions and transaction restrictions. On February 20, 2026, the Supreme Court held that IEEPA does not authorize the president to impose tariffs. The ruling concerns IEEPA, not every other statutory basis for US tariffs.',
    ...macroSection,
    atlas: {
      articles: [{ label: 'Brazil: the price of American pressure', href: '/en/analysis/brazil-price-american-pressure/', detail: 'IEEPA tariff repeal and renewed pressure under Section 301.', kind: 'article' }],
      intuition: 'Emergency economic powers remain limited by the authority Congress has actually granted.',
      sources: [{ label: 'Supreme Court, Learning Resources v. Trump', href: 'https://www.supremecourt.gov/opinions/25pdf/24-1287_4gcj.pdf', detail: 'February 20, 2026 holding on presidential tariff authority under IEEPA.', kind: 'source' }],
    },
  },
  {
    slug: 'incidence-fiscale',
    sigle: 'Tax incidence',
    nom: 'The economic distribution of a tax burden',
    def: 'The ultimate economic distribution of a tax burden across participants. It may differ from the identity of the legally liable payer. For a tariff, price and margin adjustments can distribute the burden among suppliers, importers and customers. That distribution depends on market conditions and must be estimated.',
    guide: '/en/analysis/trump-5000-election-dividend-no-surplus/',
    ...macroSection,
    atlas: {
      articles: [{ label: 'Brazil: sharing the tariff burden', href: '/en/analysis/brazil-price-american-pressure/', detail: 'Conditional tariff stacking and costs across importers, suppliers and customers.', kind: 'article' }, { label: 'Tariffs: funding the cash cycle', href: '/en/analysis/tariffs-cash-flow-section-301-litigation/', detail: 'Duty deposits, customer receipts and the conditional scope of refunds.', kind: 'article' }],
      intuition: 'The party remitting a tax and those bearing its economic cost can be different.',
      sources: [
        { label: '19 CFR § 141.1', href: 'https://www.law.cornell.edu/cfr/text/19/141.1', detail: 'The importer’s customs obligation.', kind: 'source' },
        { label: 'Federal Reserve, tariff pass-through', href: 'https://www.federalreserve.gov/econres/notes/feds-notes/detecting-tariff-effects-on-consumer-prices-in-real-time-part-II-20260408.html', detail: 'Estimated consumer-price effects of tariff changes.', kind: 'source' },
      ],
    },
  },
  {
    slug: 'warrant-d-entrepot',
    sigle: 'Warehouse warrant',
    nom: 'Title to metal held in an approved warehouse',
    def: 'A document representing ownership of metal in an approved warehouse. On COMEX, the electronic warrant transfers title when a futures contract is delivered. The recipient can leave the metal in storage or request physical withdrawal under the applicable rules. Changing ownership can leave the copper where it is.',
    guide: '/en/analysis/copper-us-stockpile-carrying-cost-tariff-uncertainty/',
    ...clearingSection,
    atlas: {
      intuition: 'Copper can change owners before it leaves the warehouse.',
      sources: [{ label: 'CME, base metals delivery', href: 'https://www.cmegroup.com/education/courses/introduction-to-base-metals/what-is-the-base-metals-delivery-process', detail: 'Electronic title, transfer and the recipient’s options after delivery.', kind: 'source' }],
      related: ['cout-de-portage'],
    },
  },
  {
    slug: 'cout-de-portage',
    sigle: 'Carrying cost',
    nom: 'Cost of holding an asset over time',
    def: 'The cost of holding an asset for a given period. For metal inventory, this may include funding, storage and insurance. Calculations depend on quantity, duration, units and contractual terms. The opportunity cost of equity funding differs from interest actually charged; physical withdrawal fees depend on the metal being removed.',
    guide: '/en/analysis/copper-us-stockpile-carrying-cost-tariff-uncertainty/',
    ...clearingSection,
    atlas: {
      articles: [{ label: 'Tariffs: funding the cash cycle', href: '/en/analysis/tariffs-cash-flow-section-301-litigation/', detail: 'Duty deposits, customer receipts and the conditional scope of refunds.', kind: 'article' }],
      intuition: 'Capital remains committed and storage charges accumulate while an inventory position is held.',
      sources: [{ label: 'CME, Glendale warehouse, September 2026', href: 'https://www.cmegroup.com/notices/market-regulation/2026/09/mkr09-03-26.html', detail: 'Copper storage and withdrawal charges; financing terms depend on the holder.', kind: 'source' }],
      related: ['warrant-d-entrepot'],
    },
  },
  {
    slug: 'sterilisation-monetaire',
    sigle: 'Monetary sterilisation',
    nom: 'Offsetting an intervention’s liquidity effect',
    def: 'A central bank operation that offsets the effect of an intervention on banking-system liquidity. After buying foreign currency or gold with domestic currency, the bank can absorb the liquidity created, for example by issuing interest-bearing securities. The interest paid is a cost separate from the result of the initial purchase.',
    guide: '/en/analysis/ghana-goldbod-gold-dollar-trade-public-cost/',
    ...macroSection,
    atlas: {
      intuition: 'Buying reserves and absorbing the liquidity created are separate operations with separate costs.',
      sources: [{ label: 'IMF, Bank of Ghana gold purchases', href: 'https://www.imf.org/-/media/files/publications/selected-issues-papers/2026/english/sipea2026084.pdf#page=12', detail: 'Paragraphs 13 and 15: programme losses and reserve sterilisation costs.', kind: 'source' }],
      related: ['activite-quasi-budgetaire'],
    },
  },
  {
    slug: 'activite-quasi-budgetaire',
    sigle: 'Quasi-fiscal activity',
    nom: 'Public-policy intervention outside the central government budget',
    def: 'An intervention by a central bank or public institution with effects comparable to government spending, a subsidy or revenue, but recorded outside the central government budget. Moving it into that budget can make the cost more visible without automatically eliminating it.',
    guide: '/en/analysis/ghana-goldbod-gold-dollar-trade-public-cost/',
    ...macroSection,
    atlas: {
      intuition: 'Moving a policy expense between public institutions changes who records it, while its public cost can remain.',
      sources: [{ label: 'IMF, Ghana, country report 26/212', href: 'https://www.imf.org/-/media/files/publications/cr/2026/english/1ghaea2026001.pdf#page=41', detail: 'Paragraph 81: transfer of central-bank quasi-fiscal risks and their public funding.', kind: 'source' }],
      related: ['sterilisation-monetaire'],
    },
  },
  {
    slug: 'equivalent-subvention',
    sigle: 'Grant equivalent',
    nom: 'Monetary value of an aid benefit',
    def: 'The monetary value of the advantage provided by support, such as a loan on favourable terms or an underpriced guarantee. For a loan, it depends on the difference from comparable financing terms and the discounting of cash flows. It differs from the principal lent, the exposure guaranteed and the lender’s eventual loss.',
    guide: '/en/analysis/france-211-billion-business-aid-misleading-figure/',
    ...macroSection,
    atlas: {
      intuition: 'Comparing public financing with appropriate market terms puts a value on the benefit received.',
      sources: [{ label: 'HCSP, business support, July 2026', href: 'https://www.strategie-plan.gouv.fr/files/files/Publications/2026/2026-07-16%20-%20Rapport%20Aides%20aux%20entreprises/HCSP-2026-RAPPORT-AIDES-ENTREPRISES.pdf#page=29', detail: 'Reference scopes and the grant-equivalent treatment of financial support.', kind: 'source' }],
      related: ['depense-fiscale'],
    },
  },
  {
    slug: 'depense-fiscale',
    sigle: 'Tax expenditure',
    nom: 'Revenue forgone against a tax benchmark',
    def: 'A provision that reduces tax revenue relative to a reference tax system. Its estimated cost depends on that benchmark and the available data. Removing it may raise a different amount because taxpayers change their behaviour and tax provisions interact.',
    guide: '/en/analysis/france-211-billion-business-aid-misleading-figure/',
    ...macroSection,
    atlas: {
      intuition: 'Costing a tax concession requires an explicit benchmark; estimating a reform also requires behavioural effects.',
      sources: [{ label: 'France, 2025 draft budget, revenue assessment, volume II', href: 'https://www2.assemblee-nationale.fr/static/17/Annexes-DL/PLF-2025/Voies_et_moyens_Tome_2_2025.pdf#page=35', detail: 'Tax benchmarks, behavioural effects and interactions between measures.', kind: 'source' }],
      related: ['equivalent-subvention'],
    },
  },
  {
    slug: 'fima',
    sigle: 'FIMA',
    nom: 'Foreign and International Monetary Authorities Repo Facility',
    def: 'A Federal Reserve facility through which approved foreign and international monetary authorities temporarily obtain dollars against Treasuries held at the New York Fed. Repos last overnight or seven calendar days: dollars plus interest must be repaid to recover the securities. This funding of official reserves is distinct from private foreign-currency borrowing.',
    guide: '/en/analysis/bessent-yen-us-debt-fima-buybacks/',
    ...macroSection,
    atlas: {
      intuition: 'Mobilising reserve securities provides short-term dollars and leaves a repayment deadline.',
      sources: [
        { label: 'Fed, FIMA Repo Facility FAQs', href: 'https://www.federalreserve.gov/monetarypolicy/fima-repo-facility-faqs.htm', detail: 'Approved access, maturities, pricing and repayment.', kind: 'source' },
        { label: 'Japan Ministry of Finance, 3 August 2026', href: 'https://www.mof.go.jp/english/public_relations/statement/others/20260803073000.html', detail: 'An intention to use FIMA in future, without a documented specific draw.', kind: 'source' },
      ],
    },
  },
  {
    slug: 'tfff',
    sigle: 'TFFF',
    nom: 'Tropical Forest Forever Facility',
    def: 'A facility intended to reward tropical forest conservation. A separate investment fund, TFIF, would invest capital and transfer distributable resources to it. The charter adopted on 22 July 2026 makes forest payments conditional on available resources and reserves at least 20% of each country’s allocation for Indigenous Peoples and local communities.',
    guide: '/en/analysis/tfff-brazil-forest-fund-bond-market-risk/',
    ...macroSection,
    atlas: {
      intuition: 'TFIF invests the capital; TFFF passes available income to eligible forest countries.',
      sources: [
        { label: 'TFFF, charter adopted on 22 July 2026', href: 'https://tfff.earth/wp-content/uploads/2026/09/2026-07-17-TFFF-Facility-Charter.pdf', detail: 'Sections I and VII: resources, minimum allocation and the relationship with TFIF.', kind: 'source' },
        { label: 'World Bank, TFFF overview', href: 'https://fiftrustee.worldbank.org/en/about/unit/dfi/fiftrustee/fund-detail/tfff', detail: 'Separate investment and payment entities.', kind: 'source' },
      ],
    },
  },
  {
    slug: 'investment-grade',
    sigle: 'Investment grade',
    nom: 'Credit rating category',
    def: 'A category of issuer or debt ratings associated with relatively low assessed default risk. In the scale illustrated by the SEC, it starts at BBB−. Symbols vary by agency. A rating can change and guarantees neither repayment nor resale value. It does not reveal the threshold specified in a particular contract.',
    guide: '/en/analysis/openai-credit-rating-nvidia-guarantee-ipo/',
    ...privateCreditSection,
    atlas: {
      intuition: 'The rating assesses credit risk; the contract determines the consequences attached to it.',
      sources: [{ label: 'SEC, Investor.gov', href: 'https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/updated-8', detail: 'Credit rating scales, scope and limitations.', kind: 'source' }],
      related: ['vrg'],
    },
  },
  {
    slug: 'vrg',
    sigle: 'RVG',
    nom: 'Residual value guarantee',
    def: 'Contractual protection based on an agreed minimum value for an asset or lease. The guarantor, which may be the tenant or a third party, covers a defined shortfall after applying contractual conditions and recoveries. The beneficiary, trigger, cap and termination terms vary by agreement. A guarantee alone does not determine the accounting treatment of the financing.',
    guide: '/en/analysis/openai-credit-rating-nvidia-guarantee-ipo/',
    ...privateCreditSection,
    atlas: {
      articles: [{ label: 'When credit starts sorting AI', href: '/en/analysis/when-credit-starts-sorting-ai/', kind: 'article' }],
      intuition: 'A guarantee cap is a contractual limit. An eventual payment depends on the trigger, remedies and recoveries.',
      sources: [{ label: 'Nvidia, SEC, Exhibit 10.1', href: 'https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda2027q2ex101.htm', detail: 'A third-party guarantee: definitions, remedies and termination in sections 1, 12 and 13.', kind: 'source' }],
      related: ['investment-grade'],
    },
  },
  {
    slug: 'arrieres-de-paiement',
    sigle: 'Payment arrears',
    nom: 'Overdue payment obligations',
    def: 'Amounts due that remain unpaid after the applicable deadline. For public procurement, delivery, invoice validation, the due date and settlement are separate stages. A claim awaiting validation cannot automatically be counted as recognised arrears.',
    guide: '/en/analysis/senegal-government-arrears-suppliers-cash-flow/',
    sectionTitle: 'Private credit & markets',
    accent: 'var(--color-accent)',
    atlas: {
      intuition: 'Once the payment deadline passes, the supplier’s cash finances its customer’s delay.',
      sources: [{ label: 'Flynn and Pessoa, IMF, 2014', href: 'https://www.imf.org/-/media/websites/imf/imported-full-text-pdf/external/pubs/ft/tnm/2014/_tnm1403.pdf', detail: 'Definitions and arrears-clearance strategies.', kind: 'source' }],
      related: ['affacturage'],
    },
  },
  {
    slug: 'scf', sigle: 'SCF', nom: 'Supply chain finance', ...privateCreditSection,
    def: 'A finance provider pays a supplier before the buyer’s agreed due date, then receives the buyer’s payment. Assessment starts with the commercial obligation, transferred rights and cash-flow timetable. An advance against an expected sale also carries the risk that the sale never occurs.',
    guide: '/en/analysis/greensill-insurance-future-receivables-risk/',
    atlas: {
      intuition: 'The finance provider advances cash to the supplier; the buyer later settles an identified commercial obligation.',
      articles: [{ label: 'Greensill: lending before the invoice exists', href: '/en/analysis/greensill-insurance-future-receivables-risk/', detail: 'Future receivables, insurance and cash availability.', kind: 'article' }],
      sources: [{ label: 'Bank of England, 6 May 2021', href: 'https://committees.parliament.uk/publications/5759/documents/66073/default/', detail: 'Page 3: supplier finance and Greensill’s funding model.', kind: 'source' }, { label: 'IASB, 25 May 2023', href: 'https://www.ifrs.org/news-and-events/news/2023/05/iasb-increases-transparency-of-companies-supplier-finance/', detail: 'Disclosure of amounts, payment dates and liquidity risks.', kind: 'source' }],
      related: ['affacturage'],
    },
  },
  {
    slug: 'affacturage',
    sigle: 'Factoring',
    nom: 'Receivables finance and collection',
    def: 'A contract under which a business entrusts its receivables to a specialist institution that may provide financing and manage collection for a fee. The advance, charges and allocation of non-payment risk depend on the contract.',
    guide: '/en/analysis/senegal-government-arrears-suppliers-cash-flow/',
    sectionTitle: 'Private credit & markets',
    accent: 'var(--color-accent)',
    atlas: {
      intuition: 'Turning an invoice into an advance brings forward cash while creating contractual costs and conditions.',
      articles: [{ label: 'Greensill: lending before the invoice exists', href: '/en/analysis/greensill-insurance-future-receivables-risk/', detail: 'Future receivables and conditions of insurance.', kind: 'article' }, { label: 'Radiant World: disputed receivables', href: '/en/analysis/radiant-world-disputed-invoices-trade-finance/', detail: 'The debt, its outstanding balance and the funder’s payment rights.', kind: 'article' }],
      sources: [{ label: 'International Trade Administration', href: 'https://www.trade.gov/report/trade-finance-guide', detail: 'Export Factoring chapter: purchasing short-term receivables and allocating risks by contract.', kind: 'source' }, { label: 'BCEAO / COFEB', href: 'https://cofeb.bceao.int/actualite/webinaires-conjoints-bceao-afreximbank-fci-sur-le-theme-affacturage-et-financement-des', detail: 'Institutional explanation of factoring.', kind: 'source' }],
      related: ['arrieres-de-paiement', 'scf'],
    },
  },
  {
    slug: 'run-rate', sigle: 'Run rate', nom: 'Annualized revenue pace', ...privateCreditSection,
    def: 'An extrapolation of revenue from a recent period to one year. Multiplying one month’s revenue by twelve gives an annualized pace, assuming it persists. The result depends on scope, discounts and the measurement period; it measures neither revenue already earned during the year nor future purchases guaranteed by contract.',
    guide: '/en/analysis/anthropic-ipo-compute-valuation-macro-risk/',
    atlas: {
      intuition: 'Projecting a recent pace helps describe a growing business when the measurement period and scope are explicit.',
      formula: 'Example: annual run rate = monthly revenue × 12, assuming the pace persists',
      articles: [{ label: 'Anthropic: revenue and compute commitments', href: '/en/analysis/anthropic-ipo-compute-valuation-macro-risk/', kind: 'article' }],
      sources: [{ label: 'Anthropic, Series H, May 28, 2026', href: 'https://www.anthropic.com/news/series-h', detail: 'Company announcement illustrating its use of run-rate revenue.', kind: 'source' }],
    },
  },
  {
    slug: 'ratio-combine', sigle: 'Combined ratio', nom: 'Insurance underwriting profitability', ...macroSection,
    def: 'Claims costs and expenses divided by premiums, expressed as a percentage. Below 100%, underwriting generates a surplus; above 100%, costs exceed premiums. The measure excludes investment results and does not measure solvency. Comparisons require the period, business line and reinsurance treatment to be specified.',
    guide: '/en/analysis/not-at-fault-insurance-non-renewal-risk-selection/',
    atlas: {
      intuition: 'Comparing claims and operating costs with premiums shows underwriting profitability before investment results.',
      formula: 'Combined ratio = (claims costs + expenses) / premiums × 100',
      articles: [{ label: 'Car insurance: customer selection', href: '/en/analysis/not-at-fault-insurance-non-renewal-risk-selection/', detail: 'Costs, reinsurance and underwriting in France.', kind: 'article' }],
      sources: [{ label: 'ACPR, insurers at the end of 2025', href: 'https://acpr.banque-france.fr/system/files/2026-06/20260630_AS181_assureurs_S2_2025.pdf', detail: 'Page 22: combined-ratio definition; page 12: net-of-reinsurance scope.', kind: 'source' }],
      related: ['reassurance'],
    },
  },
  {
    slug: 'cat-nat',
    sigle: 'Cat Nat',
    nom: 'France’s statutory natural-catastrophe insurance scheme',
    def: 'A French legal regime that extends eligible property-damage policies to specified effects of a natural disaster recognised by decree. A national surcharge funds the scheme. Insurers may transfer part of the risk to CCR, whose unlimited cover benefits from a French state guarantee.',
    guide: '/en/analysis/when-climate-turns-state-into-reinsurer/',
    ...macroSection,
    atlas: {
      intuition: 'The household deals with its insurer. Behind that policy, the insurer may share the loss with CCR, while the French state covers the extreme tail through a guarantee.',
      whyNow: 'Higher climate-related losses have depleted reserves more quickly and brought the public guarantee closer to the French budget debate.',
      articles: [
        { label: 'When climate turns the state into a reinsurer', href: '/en/analysis/when-climate-turns-state-into-reinsurer/', detail: 'Premiums, CCR, the public guarantee and the incentives created by national pooling.', kind: 'article' },
      ],
      sources: [
        { label: 'French Insurance Code', href: 'https://www.legifrance.gouv.fr/codes/id/LEGISCTA000006174047/', detail: 'Legal perimeter of the Cat Nat guarantee.', kind: 'source' },
        { label: 'CCR 1982-2025 review', href: 'https://www.ccr.fr/wp-content/uploads/2026/06/20260622-rapport_Bilan_Cat_Nat_BD.pdf', detail: 'Premiums, losses, reserves and public-guarantee capacity.', kind: 'source' },
      ],
      related: ['reassurance'],
    },
  },
  {
    slug: 'reassurance',
    sigle: 'Reinsurance',
    nom: 'Insurance for an insurer',
    def: 'A contract through which an insurer transfers all or part of specified risks to a reinsurer in exchange for a premium. The cover and limits determine which losses are shared. The original insurer remains responsible to its policyholders, including if the reinsurer fails to pay.',
    guide: '/en/analysis/when-climate-turns-state-into-reinsurer/',
    ...macroSection,
    atlas: {
      intuition: 'A reinsurer gives an insurer another balance sheet with which to absorb severe losses. It does not replace the insurer in the customer’s policy.',
      whyNow: 'Natural catastrophes can hit many policies at once, making reinsurance and its ultimate backstops central to insurability.',
      articles: [
        { label: 'Aon and Blackstone: who sets the price of risk?', href: '/en/analysis/aon-blackstone-cortina-reinsurance-risk-pricing/', detail: 'Treaty participation, discounts, loss accumulation and continuity of capacity.', kind: 'article' },
        { label: 'When climate turns the state into a reinsurer', href: '/en/analysis/when-climate-turns-state-into-reinsurer/', detail: 'How France layers policyholder, insurer, CCR and state balance sheets.', kind: 'article' },
      ],
      sources: [
        { label: 'NAIC: Reinsurance', href: 'https://content.naic.org/insurance-topics/reinsurance', detail: 'Definition, transfer of risk and contractual scope of reinsurance.', kind: 'source' },
        { label: 'AXIS Syndicate 1686, 2025 accounts', href: 'https://assets.lloyds.com/media-651c0e64-c1d0-4f97-90f7-883c69fe2ef2/6b43f9f4-37b2-45b8-9ab1-87515c4b67d6/1686_Accounts_2025Q4_20260220_150810.html', detail: 'Note 21: liability retained when reinsurers fail to pay.', kind: 'source' },
        { label: 'French Insurance Code, Article L. 431-9', href: 'https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006073984/LEGISCTA000006187517/2025-01-08', detail: 'CCR reinsurance and the French state guarantee.', kind: 'source' },
        { label: 'Cour des comptes, April 2026', href: 'https://www.vie-publique.fr/files/rapport/pdf/303004.pdf', detail: 'Treaty structure and financial sustainability of the French Cat Nat scheme.', kind: 'source' },
      ],
      related: ['cat-nat'],
    },
  },
  {
    slug: 'pseudonymisation',
    sigle: 'Pseudonymisation',
    nom: 'Identity separation with a retained re-linking key',
    def: 'Processing that replaces or separates direct identity while retaining additional information that can reconnect the data to a person. Under the GDPR, pseudonymised data remain personal data.',
    guide: '/en/guides/read-a-cbdc-the-digital-euro-parameter-by-parameter/',
    ...macroSection,
    atlas: {
      intuition: 'Pseudonymisation removes the direct name from one domain. Its protection depends on keeping the re-linking information separate and controlled.',
      whyNow: 'The online digital euro design relies on pseudonymised accounts and transactions, so persistent identifiers and access to the re-linking key determine the practical privacy boundary.',
      articles: [{ label: 'Digital euro, 3/6: as private as cash?', href: '/en/analysis/digital-euro-3-as-private-as-cash/', detail: 'Identities, aliases, fraud scoring and the offline privacy boundary.', kind: 'article' }],
      guides: [{ label: 'Reading a CBDC parameter by parameter', href: '/en/guides/read-a-cbdc-the-digital-euro-parameter-by-parameter/', detail: 'Issuer, ledger, access, holding limits and privacy.', kind: 'guide' }],
      sources: [
        { label: 'ECB digital euro privacy', href: 'https://www.ecb.europa.eu/euro/digital_euro/features/privacy/html/index.en.html', detail: 'Privacy objectives for online and offline use.', kind: 'source' },
        { label: 'Council negotiating mandate', href: 'https://data.consilium.europa.eu/doc/document/ST-16695-2025-INIT/en/pdf', detail: 'Legal separation of identity and central transaction data.', kind: 'source' },
      ],
      related: ['tokenisation'],
    },
  },
  {
    slug: 'tokenisation',
    sigle: 'Tokenisation',
    nom: 'Substitution of data with a purpose-specific token',
    def: 'Replacement of data with a surrogate token used in a defined context. An authorised actor can recover the underlying data through a mapping table, whose protection determines the confidentiality of the arrangement.',
    guide: '/en/guides/read-a-cbdc-the-digital-euro-parameter-by-parameter/',
    ...macroSection,
    atlas: {
      intuition: 'A token reduces direct exposure of the underlying value. It does not erase the value or the mapping needed by authorised actors.',
      whyNow: 'The proposed SEPI service uses tokens and cryptograms for QR codes, payment links and NFC, making key ownership, token lifetime and detokenisation rights central design questions.',
      articles: [{ label: 'Digital euro, 3/6: as private as cash?', href: '/en/analysis/digital-euro-3-as-private-as-cash/', detail: 'SEPI, technical identifiers and the limits of data substitution.', kind: 'article' }],
      guides: [{ label: 'Reading a CBDC parameter by parameter', href: '/en/guides/read-a-cbdc-the-digital-euro-parameter-by-parameter/', detail: 'Issuer, ledger, access, holding limits and privacy.', kind: 'guide' }],
      sources: [{ label: 'ECB digital euro rulebook', href: 'https://www.ecb.europa.eu/euro/digital_euro/timeline/rulebook/html/index.en.html', detail: 'Draft technical specifications for SEPI and payment-data exchange.', kind: 'source' }],
      related: ['pseudonymisation'],
    },
  },
  {
    slug: 'perimetre-de-consolidation',
    sigle: 'Consolidation perimeter',
    nom: 'The boundary of group accounts',
    def: 'The accounting boundary within which a parent combines, line by line, the assets, liabilities, income and expenses of entities it controls. Deconsolidation does not make an entity disappear: stakes, commitments and related-party transactions may remain disclosed as investments or separate notes.',
    ...privateCreditSection,
    atlas: {
      intuition: 'Consolidation is a binary accounting boundary. Economic influence can continue outside it through capital, contracts, mandates and governance.',
      articles: [{ label: 'The balance sheet Apollo does not consolidate', href: '/en/analysis/the-balance-sheet-apollo-does-not-consolidate/', detail: 'Deconsolidation, asset mandates, governance and insurance contracts.', kind: 'article' }],
      guides: [{ label: 'Reading life-insurer health', href: '/en/guides/read-life-insurer-health/', detail: 'Capital, asset quality, liabilities and reinsurance.', kind: 'guide' }],
      sources: [
        { label: 'US Securities and Exchange Commission', href: 'https://www.sec.gov/edgar', detail: 'Corporate filings and consolidation disclosures.', kind: 'source' },
        { label: 'IFRS Foundation', href: 'https://www.ifrs.org/issued-standards/list-of-standards/ifrs-10-consolidated-financial-statements/', detail: 'IFRS 10 and the control-based consolidation framework.', kind: 'source' },
      ],
      related: ['partie-liee', 'niveau-1', 'niveau-2', 'niveau-3'],
    },
  },
  {
    slug: 'partie-liee',
    sigle: 'Related party',
    nom: 'A relationship requiring disclosure and oversight',
    def: 'A person or entity connected to a company through control, significant influence, common management or another relationship defined by accounting standards. A related-party transaction is not improper by itself, but it requires disclosure and governance suited to the risk of conflicts of interest.',
    ...privateCreditSection,
    atlas: {
      intuition: 'The label identifies a relationship, not a wrongdoing. The analytical question is whether pricing, approval and disclosure withstand the conflict.',
      articles: [{ label: 'The balance sheet Apollo does not consolidate', href: '/en/analysis/the-balance-sheet-apollo-does-not-consolidate/', detail: 'Capital, board seats, fees and related insurance contracts.', kind: 'article' }],
      sources: [
        { label: 'IFRS Foundation', href: 'https://www.ifrs.org/issued-standards/list-of-standards/ias-24-related-party-disclosures/', detail: 'IAS 24 definitions and disclosure requirements.', kind: 'source' },
        { label: 'US Securities and Exchange Commission', href: 'https://www.sec.gov/edgar', detail: 'Issuer disclosures of related-party transactions.', kind: 'source' },
      ],
      related: ['perimetre-de-consolidation', 'niveau-3'],
    },
  },
  {
    slug: 'niveau-1',
    sigle: 'Level 1',
    nom: 'Quoted fair value',
    def: 'The IFRS fair-value category based on unadjusted quoted prices in an active market for identical assets or liabilities. It is the tier least dependent on a valuation model.',
    ...privateCreditSection,
    atlas: {
      intuition: 'Level 1 starts from a directly observable market price.',
      articles: [{ label: 'The balance sheet Apollo does not consolidate', href: '/en/analysis/the-balance-sheet-apollo-does-not-consolidate/', detail: 'Athora fair-value hierarchy and Level 3 exposure.', kind: 'article' }],
      sources: [{ label: 'IFRS Foundation', href: 'https://www.ifrs.org/issued-standards/list-of-standards/ifrs-13-fair-value-measurement/', detail: 'IFRS 13 fair-value hierarchy.', kind: 'source' }],
      related: ['niveau-2', 'niveau-3'],
    },
  },
  {
    slug: 'niveau-2',
    sigle: 'Level 2',
    nom: 'Observable-input fair value',
    def: 'The IFRS fair-value category using observable inputs other than a direct quoted price for the identical asset, such as rates, spreads, curves or prices of comparable instruments.',
    ...privateCreditSection,
    atlas: {
      intuition: 'Level 2 is model-assisted, but its important inputs remain observable in markets.',
      articles: [{ label: 'The balance sheet Apollo does not consolidate', href: '/en/analysis/the-balance-sheet-apollo-does-not-consolidate/', detail: 'Athora fair-value hierarchy and Level 3 exposure.', kind: 'article' }],
      sources: [{ label: 'IFRS Foundation', href: 'https://www.ifrs.org/issued-standards/list-of-standards/ifrs-13-fair-value-measurement/', detail: 'IFRS 13 fair-value hierarchy.', kind: 'source' }],
      related: ['niveau-1', 'niveau-3'],
    },
  },
  {
    slug: 'niveau-3',
    sigle: 'Level 3',
    nom: 'Unobservable-input fair value',
    def: 'The IFRS fair-value category in which significant unobservable inputs enter the model. It signals more estimation uncertainty and judgement, not necessarily a loss or an impaired asset.',
    ...privateCreditSection,
    atlas: {
      intuition: 'Level 3 measures dependence on judgement. It is not a synonym for hidden loss.',
      articles: [
        { label: 'The balance sheet Apollo does not consolidate', href: '/en/analysis/the-balance-sheet-apollo-does-not-consolidate/', detail: 'Athora fair-value hierarchy and audit evidence.', kind: 'article' },
        { label: 'Private credit, one asset, two prices', href: '/en/analysis/private-credit-one-asset-two-prices/', detail: 'Model valuations and market-price divergence.', kind: 'article' },
      ],
      guides: [{ label: 'Reading private-credit risk', href: '/en/guides/read-private-credit-risk/', detail: 'Valuation, defaults, leverage and liquidity.', kind: 'guide' }],
      sources: [{ label: 'IFRS Foundation', href: 'https://www.ifrs.org/issued-standards/list-of-standards/ifrs-13-fair-value-measurement/', detail: 'IFRS 13 fair-value hierarchy.', kind: 'source' }],
      related: ['niveau-1', 'niveau-2', 'credit-prive'],
    },
  },
  {
    slug: 'prime-de-terme',
    sigle: 'Term premium',
    nom: 'Compensation for holding duration',
    def: "The gap between a long bond's yield and the expected return from rolling short-term investments over the same horizon. This compensation for interest-rate risk is estimated with models such as ACM and Kim–Wright, whose results can differ and be revised. It can be negative when investors value the bond's hedging properties. The yield-curve slope does not measure it directly.",
    guide: '/en/guides/read-us-treasuries-market/',
    ...macroSection,
    atlas: {
      intuition: 'A model splits a long yield into the expected path of short rates and compensation for duration risk. That split is an estimate, with uncertainty.',
      formula: 'long yield ≈ average expected short rates + term premium',
      whyNow: 'When long-debt supply grows, QT removes the public buyer and foreign demand shifts, an expected fall in short rates can coexist with a rising long yield.',
      articles: [{ label: 'The world rediscovers the price of money', href: '/en/analysis/the-world-rediscovers-the-price-of-money/', kind: 'article' }, { label: 'Can a Fed hike lower long-term yields?', href: '/en/analysis/fed-rate-hikes-long-yields-term-premium/', detail: 'Expectations, the term premium and Treasury buybacks.', kind: 'article' }, { label: 'The price of time in French debt', href: '/en/analysis/french-debt-price-of-time/', detail: 'Maturity, initial borrowing costs and debt refinancing.', kind: 'article' }, ...usDebtArticles],
      guides: usDebtGuides,
      ...shared,
      sources: [{ label: 'Federal Reserve, Kim–Wright model', href: 'https://www.federalreserve.gov/data/three-factor-nominal-term-structure-model.htm', detail: 'Methodology, limitations and revisions to term-premium estimates.', kind: 'source' }, ...shared.sources],
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
      articles: [{ label: 'The world rediscovers the price of money', href: '/en/analysis/the-world-rediscovers-the-price-of-money/', kind: 'article' }, ...usDebtArticles],
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
    def: 'The sale of a security with an agreement to repurchase it on agreed terms. Economically, it provides financing secured by that security. A repo can be overnight, longer term or open-ended; the repo rate and the collateral haircut are distinct parameters.',
    ...macroSection,
    atlas: {
      intuition: 'Repo says how public debt funds itself day to day once it becomes collateral.',
      formula: 'cash today against a security, then repurchase at the agreed maturity and price',
      whyNow: 'Repo connects Treasuries, hedge funds, banks and money market funds. A collateral squeeze can turn a rate move into a liquidity problem.',
      articles: [
        usDebtArticles[1],
        usDebtArticles[2],
        { label: 'Gilts, repo and leverage', href: '/en/analysis/gilts-repo-leverage-bank-of-england/', detail: 'Transmission of a rate shock through funding.', kind: 'article' },
        { label: 'Russia’s 2027 budget: defence, debt and banks', href: '/en/analysis/russia-2027-budget-defence-debt-banks-credit/', kind: 'article' },
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
    def: 'A US financing company investing in debt and equity of generally small or mid-sized businesses. BDCs can be publicly traded or non-traded. Liquidity, leverage and repurchase terms depend on the structure.',
    guide: '/en/analysis/private-credit-software-ai-cash-flows-debt/',
    ...privateCreditSection,
    atlas: {
      intuition: 'A listed BDC gives its portfolio a market price. A non-traded BDC may offer capped periodic repurchases; investors face different exit conditions.',
      formula: 'Listed BDC premium or discount = market price / NAV per share - 1',
      whyNow: 'Software exposure requires separating recorded loan values, share prices and investors’ ability to exit.',
      articles: [{ label: 'Private credit: software debt faces the AI test', href: '/en/analysis/private-credit-software-ai-cash-flows-debt/', detail: 'BIS exposures, OTF accounts and educational scenarios.', kind: 'article' }, privateCreditArticles[0], privateCreditArticles[1], privateCreditArticles[4]],
      guides: privateCreditGuides,
      ...privateCreditShared,
      sources: [{ label: 'SEC: publicly traded BDCs', href: 'https://www.investor.gov/introduction-investing/investing-basics/investment-products/closed-end-funds/publicly-traded-business-development-companies-bdcs', detail: 'Vehicle structure and differences between BDCs.', kind: 'source' }, ...privateCreditSources],
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
    def: 'Compensation in kind: interest added to a debt claim or dividends paid in securities, without immediate cash payment. PIK may be part of the original contract; its presence alone does not establish financial distress.',
    guide: '/en/analysis/private-credit-software-ai-cash-flows-debt/',
    ...privateCreditSection,
    atlas: {
      intuition: 'PIK interest increases the claim instead of generating immediate cash. PIK dividends are a separate form of compensation in securities.',
      formula: 'With no other movements: future debt = opening debt + capitalised interest',
      whyNow: 'Distinguish contractual PIK from a deferral negotiated under pressure, and assess whether the final amount remains repayable.',
      articles: [{ label: 'Private credit: software debt faces the AI test', href: '/en/analysis/private-credit-software-ai-cash-flows-debt/', detail: 'OTF PIK calculation and the gap between income and cash receipts.', kind: 'article' }, privateCreditArticles[1], privateCreditArticles[2], privateCreditArticles[4]],
      guides: [privateCreditGuides[0]],
      ...privateCreditShared,
      sources: [{ label: 'BIS Bulletin 128', href: 'https://www.bis.org/publications/bulletin-128-ai-disruption-private-credit-exposure-software-firms-bdcs.pdf', detail: 'PIK definition, footnote 7.', kind: 'source' }, ...privateCreditSources],
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
    nom: 'Reference-value digital token',
    def: 'A cryptoasset designed to maintain a stable value against a reference, often a currency. That target depends on its mechanism, any reserves and redemption rights. The stablecoin label alone guarantees neither a market price at par nor redemption available to every holder.',
    guide: '/en/guides/read-stablecoins-genius-act/',
    ...cryptoSection,
    atlas: {
      intuition: 'A stablecoin is a promise of parity. The risk sits in the reserve, the redemption right, the intermediaries and the geopolitical uses.',
      formula: 'durable parity = liquid assets + redemption right + supervision + operational trust',
      whyNow: 'Stablecoins are becoming a parallel dollar plumbing: T-bill reserves, cross-border payments, sanctions, DeFi and US regulation all intersect.',
      articles: [
        { label: 'USD1: who receives the reserve interest?', href: '/en/analysis/usd1-trump-interest-rates-reserves-beneficiaries/', detail: 'Holder rights, BitGo revenue and the Trump family’s disclosed economic interests.', kind: 'article' },
        { label: 'Stablecoins: from tokens to available dollars', href: '/en/analysis/stablecoin-reserves-redemption-dollar/', detail: 'Reserves, fees, redemption delays and rights by issuer channel.', kind: 'article' },
        { label: 'Iranian oil and USDT', href: '/en/analysis/iranian-oil-usdt-tether-seizure/', detail: 'Freezing, seizure and the powers Tether retains.', kind: 'article' },
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
      sources: [...cryptoShared.sources, { label: 'Fed: September 29, 2026 proposal', href: 'https://www.govinfo.gov/content/pkg/FR-2026-09-29/pdf/2026-19860.pdf', detail: 'Reserves, monetisation capacity and redemption, sections 247.11–247.12.', kind: 'source' }, { label: 'FATF: stablecoins and unhosted wallets', href: 'https://www.fatf-gafi.org/en/publications/Virtualassets/targeted-report-stablecoins-unhosted-wallets.html', detail: 'Risks and proportionate controls, March 3, 2026 report.', kind: 'source' }],
      related: ['usdt', 'usdc', 'genius', 'ppsi', 'rwa'],
    },
  },
  {
    slug: 'usdt',
    sigle: 'USDT',
    nom: 'Tether',
    def: 'A stablecoin issued by Tether that targets one US dollar per token. Direct redemption through Tether is subject to eligibility, verification and minimum-amount requirements. The issuer retains freezing powers, including over tokens held in a personal wallet.',
    guide: '/en/analysis/iranian-oil-usdt-tether-seizure/',
    ...cryptoSection,
    atlas: {
      intuition: 'Holding the keys to a USDT wallet leaves the token’s rules and its issuer’s powers in place.',
      whyNow: 'The September 14, 2026 US complaint concerning funds allegedly linked to Iranian oil describes a seizure through destruction and replacement of tokens.',
      articles: [
        { label: 'Stablecoins: from tokens to available dollars', href: '/en/analysis/stablecoin-reserves-redemption-dollar/', detail: 'Reserves, fees, redemption delays and rights by issuer channel.', kind: 'article' },
        { label: 'Iranian oil and USDT', href: '/en/analysis/iranian-oil-usdt-tether-seizure/', detail: 'Freezing, seizure and the powers Tether retains.', kind: 'article' },
        { label: 'USDT on Tron and OFAC evasion', href: '/en/analysis/iran-hormuz-tolls-usdt-tron-ofac/', detail: 'Stablecoins, sanctions and geopolitical payments.', kind: 'article' },
      ],
      guides: [
        { label: 'Stablecoins and the GENIUS Act', href: '/en/guides/read-stablecoins-genius-act/', detail: 'Reserves, licensed issuers, audits and supervision.', kind: 'guide' },
        { label: 'Reading on-chain data', href: '/en/guides/read-on-chain-data/', detail: 'Addresses, reserves, flows and the limits of interpretation.', kind: 'guide' },
      ],
      ...cryptoShared,
      sources: [...cryptoShared.sources, { label: 'Tether: direct-channel fees', href: 'https://tether.to/en/fees/', detail: 'Minimum redemption and fee schedule checked September 30, 2026.', kind: 'source' },
        { label: 'Tether token terms', href: 'https://tether.to/en/legal/', detail: 'Sections 2 and 4.1: freezing, reserves and direct-redemption conditions.', kind: 'source' },
        { label: 'Manhattan prosecutors’ complaint', href: 'https://www.justice.gov/usao-sdny/media/1461216/dl', detail: 'September 14, 2026, p. 3, footnote 1: planned seizure mechanism.', kind: 'source' },
      ],
      related: ['stablecoin', 'usdc', 'ppsi', 'genius'],
    },
  },
  {
    slug: 'usdc',
    sigle: 'USDC',
    nom: 'USD Coin',
    def: 'A Circle token designed to maintain one U.S. dollar per unit. Direct redemption depends on the legal framework and applicable procedure: an eligible Circle Mint account outside the EEA, and Circle France’s procedure for EEA holders. Holding USDC alone does not set the date dollars reach a bank account.',
    ...cryptoSection,
    atlas: {
      intuition: 'The holder needs to identify the entity and procedure through which USDC becomes dollars in a bank account.',
      whyNow: 'Circle France’s September 2026 policy describes redemption processing and stress circumstances.',
      articles: [
        { label: 'Stablecoins: from tokens to available dollars', href: '/en/analysis/stablecoin-reserves-redemption-dollar/', detail: 'Reserves, fees, redemption delays and rights by issuer channel.', kind: 'article' },
        { label: 'Hyperliquid and on-chain tradfi', href: '/en/analysis/hyperliquid-onchain-exchange/', detail: 'Perpetuals, DEXs and bridges to traditional assets.', kind: 'article' },
      ],
      guides: [
        { label: 'Stablecoins and the GENIUS Act', href: '/en/guides/read-stablecoins-genius-act/', detail: 'Reserves, licensed issuers, audits and supervision.', kind: 'guide' },
        { label: 'MiCA, acronym by acronym', href: '/en/guides/decode-mica-crypto-regulation/', detail: 'ARTs, EMTs, CASPs and European supervision.', kind: 'guide' },
      ],
      ...cryptoShared,
      sources: [...cryptoShared.sources, { label: 'Circle: USDC Terms outside the EEA', href: 'https://www.circle.com/legal/usdc-terms', kind: 'source' }, { label: 'Circle France: MiCA redemption', href: 'https://www.circle.com/legal/mica-redemption-policy', detail: 'September 15, 2026 revision, especially sections 1 and 4.2.', kind: 'source' }],
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
    def: 'An issuer status established by the GENIUS Act: an approved subsidiary of an insured depository institution, a federally qualified issuer or a state-qualified issuer, subject to the Act’s conditions. The restriction on US issuance takes effect with the new regime; an existing bank charter alone does not confer PPSI approval.',
    guide: '/en/guides/map-genius-act-stablecoin-regulators/',
    ...cryptoSection,
    atlas: {
      intuition: 'The PPSI status turns the stablecoin issuer into an explicitly supervised actor, with reserve, audit and AML obligations.',
      formula: 'GENIUS PPSI regime = issuer approval + eligible reserves + oversight + BSA compliance',
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
      sources: [...cryptoSources, { label: 'GENIUS Act, enacted law', href: 'https://www.congress.gov/119/plaws/publ27/PLAW-119publ27.pdf', detail: 'Sections 2, 3 and 20: PPSI status, issuance and the effective date.', kind: 'source' }],
      related: ['stablecoin', 'genius', 'usdc'],
    },
  },
  {
    slug: 'genius',
    sigle: 'GENIUS',
    nom: 'GENIUS Act',
    def: 'The US payment-stablecoin law enacted on July 18, 2025, establishing an issuer approval, reserve and oversight regime. Section 20 sets its effective date as the earlier of January 18, 2027, or 120 days after the primary federal payment-stablecoin regulators issue final implementing regulations.',
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
      sources: [...cryptoSources, { label: 'GENIUS Act, enacted law', href: 'https://www.congress.gov/119/plaws/publ27/PLAW-119publ27.pdf', detail: 'Sections 2, 3 and 20: PPSI status, issuance and the effective date.', kind: 'source' }],
      related: ['stablecoin', 'ppsi', 'usdt', 'usdc'],
    },
  },
  {
    slug: 'dominance-fiscale',
    sigle: 'Fiscal dominance',
    nom: 'When debt constrains the central bank',
    def: 'The situation in which the weight of public debt constrains monetary policy: the central bank hesitates to raise or hold rates high for fear of making the debt unsustainable, letting inflation erode its value instead. The opposite of a central bank free in its choices.',
    ...macroSection,
    atlas: {
      intuition: "Fiscal dominance appears when the political and budgetary cost of the debt curtails the central bank's freedom.",
      whyNow: 'The signal grows more relevant when the interest burden, the primary deficit and refinancing needs rise at the same time.',
      articles: [usDebtArticles[0]],
      guides: [usDebtGuides[3], usDebtGuides[0]],
      ...shared,
      related: ['prime-de-terme', 'cbo', 'courbe-des-taux', 'adjudication'],
    },
  },
  {
    slug: 'boj',
    sigle: 'BoJ',
    nom: 'Bank of Japan',
    def: "Japan's central bank. It sets Japanese monetary policy, steers asset purchases or sales, and can act as operational agent in currency interventions decided by the Ministry of Finance.",
    ...macroSection,
    atlas: {
      intuition: 'The BoJ sets the starting price of the yen carry and shapes global tolerance for cheap funding.',
      whyNow: 'A change of tone at the BoJ can turn a profitable carry position into currency and liquidity risk.',
      articles: [yenArticle],
      guides: yenGuides,
      ...yenShared,
      related: ['yen-carry', 'mof', 'cot', 'move'],
    },
  },
  {
    slug: 'mof',
    sigle: 'MoF',
    nom: 'Ministry of Finance Japan',
    def: "Japan's finance ministry. The authority responsible for exchange-rate policy and decisions to intervene on the yen.",
    ...macroSection,
    atlas: {
      intuition: 'The MoF decides Japanese currency interventions. It does not always change the regime, but it can change the pace of the unwind.',
      whyNow: 'When USD/JPY tests politically sensitive zones, intervention risk becomes a market variable.',
      articles: [yenArticle],
      guides: yenGuides,
      ...yenShared,
      related: ['yen-carry', 'boj', 'cot'],
    },
  },
  {
    slug: 'yen-carry',
    sigle: 'Yen carry',
    nom: 'Yen carry trade',
    def: 'The strategy of borrowing in yen, a historically low-yielding currency, to buy assets or currencies offering a higher return. It works as long as the yen stays weak and volatility stays contained.',
    guide: '/en/guides/read-the-carry-trade/',
    ...privateCreditSection,
    atlas: {
      intuition: 'The yen carry funds risky assets with a low-cost currency. The risk is not the level of the yen but the speed of the unwind.',
      formula: 'gross carry ≈ yield of asset bought - yen funding cost - hedging cost',
      whyNow: 'A more restrictive BoJ, intervention threats and FX volatility can force positions to close together.',
      articles: [
        yenArticle,
        { label: 'Warsh and the Fed balance sheet', href: '/en/analysis/warsh-and-the-fed-balance-sheet/', detail: 'Dollar rates, liquidity and global carry conditions.', kind: 'article' },
      ],
      guides: yenGuides,
      ...yenShared,
      related: ['boj', 'mof', 'cot', 'move'],
    },
  },
  {
    slug: 'wti',
    sigle: 'WTI',
    nom: 'West Texas Intermediate',
    def: 'The US benchmark crude, quoted in New York. With Brent, one of the two global reference prices.',
    guide: '/en/guides/read-oil-market/',
    ...energySection,
    atlas: {
      intuition: 'WTI reads the American crude market, highly sensitive to inventories, refining and domestic logistics constraints.',
      formula: 'oil stress = spot price + curve structure + inventories + positioning',
      whyNow: 'After a geopolitical shock, the gap between WTI, Brent and inventories says whether the strain is local, global or mostly financial.',
      articles: [oilArticles[0], oilArticles[1], oilArticles[2]],
      guides: [oilGuide],
      ...energyShared,
      related: ['brent', 'chokepoint', 'ttf', 'opep', 'opep-2', 'spr', 'cot'],
    },
  },
  {
    slug: 'brent',
    sigle: 'Brent',
    nom: 'Brent Crude',
    def: 'The global benchmark crude, sourced from the North Sea and quoted in London. With WTI, one of the two reference prices of the oil market.',
    guide: '/en/guides/read-oil-market/',
    ...energySection,
    atlas: {
      intuition: 'Brent is the marginal world price of crude. It reacts more directly to shipping-route shocks, OPEC+ and Asian demand.',
      formula: 'geopolitical premium ≈ stressed Brent - price consistent with inventories and demand',
      whyNow: 'The post-Hormuz normalisation and Chinese reserves make Brent useful for separating physical scarcity from risk premium.',
      articles: oilArticles,
      guides: [oilGuide],
      ...energyShared,
      related: ['wti', 'chokepoint', 'ttf', 'opep', 'opep-2', 'spr', 'cot'],
    },
  },
  {
    slug: 'chokepoint',
    sigle: 'Chokepoint',
    nom: 'Strategic maritime passage',
    def: 'A narrow maritime passage through which a major share of a global flow transits: Hormuz (oil, LNG), Malacca, Suez, Panama, Bab el-Mandeb. Its concentration creates great efficiency in normal times and acute vulnerability when blocked, for lack of adequate alternatives.',
    ...energySection,
    atlas: {
      intuition: 'A chokepoint concentrates a global flow in a passage that is hard to replace.',
      formula: 'fragility = share of world flow × limited bypass capacity',
      whyNow: 'Hormuz showed that a local shock can become inflation, freight, marine insurance and political risk within days.',
      articles: [oilArticles[2], oilArticles[3], oilArticles[4]],
      guides: [oilGuide],
      ...energyShared,
      related: ['brent', 'wti', 'ttf', 'spr'],
    },
  },
  {
    slug: 'ttf',
    sigle: 'TTF',
    nom: 'Title Transfer Facility',
    def: "The Dutch wholesale natural gas market, Europe's reference gas price, quoted in euros per megawatt-hour. LNG often sets the marginal price there, which makes the TTF highly sensitive to supply disruptions, as during the 2026 Hormuz crisis.",
    guide: '/en/guides/read-gas-lng-market/',
    ...energySection,
    atlas: {
      intuition: 'The TTF captures the marginal price of European gas, often set by the LNG available.',
      whyNow: 'A shock to shipping routes or Asian LNG can reach Europe through the marginal price even without a direct physical cut.',
      articles: [oilArticles[3], oilArticles[4]],
      guides: [
        { label: 'Reading the gas and LNG market', href: '/en/guides/read-gas-lng-market/', detail: 'TTF, Henry Hub, JKM and the LNG chain.', kind: 'guide' },
        oilGuide,
      ],
      ...energyShared,
      related: ['chokepoint', 'brent', 'wti'],
    },
  },
  {
    slug: 'u3o8',
    sigle: 'U3O8',
    nom: 'Triuranium octoxide (yellowcake)',
    def: 'The concentrated form of uranium out of the mine, the "yellowcake", the market\'s reference unit. Uranium is priced in dollars per pound of U3O8, spot and above all long-term (reactor operators\' contracts).',
    guide: '/en/guides/read-uranium-market/',
    ...energySection,
    atlas: {
      intuition: 'U3O8 is the commercial starting point of the nuclear cycle, but not the final bottleneck.',
      formula: 'nuclear fuel = mining + conversion + enrichment + fabrication',
      whyNow: 'The ore price draws the attention, while conversion and enrichment can become the binding constraints.',
      articles: [
        uraniumArticle,
        { label: 'Copper, Hormuz and El Niño', href: '/en/analysis/copper-shortage-hormuz-el-nino/', detail: 'Commodities, energy and supply constraints.', kind: 'article' },
      ],
      guides: [uraniumGuide, oilGuide],
      ...energyShared,
      related: ['uf6', 'swu', 'haleu', 'smr'],
    },
  },
  {
    slug: 'uf6',
    sigle: 'UF6',
    nom: 'Uranium hexafluoride',
    def: 'The compound obtained by converting uranium oxide, gaseous once heated, the only form enrichment plants can process. Conversion is a distinct step of the fuel cycle, with its own market and its own bottlenecks.',
    guide: '/en/guides/read-uranium-market/',
    ...energySection,
    atlas: {
      intuition: 'UF6 is the mandatory passage between ore and enrichment. Without available conversion, yellowcake never becomes fuel.',
      whyNow: 'Conversion is a narrower market than the ore, hence more sensitive to industrial delays and sanctions.',
      articles: [uraniumArticle],
      guides: [uraniumGuide],
      ...energyShared,
      related: ['u3o8', 'swu', 'haleu', 'smr'],
    },
  },
  {
    slug: 'swu',
    sigle: 'SWU',
    nom: 'Separative Work Unit',
    def: 'The unit measuring the enrichment effort needed to raise the uranium-235 content. The enrichment market is counted in SWU; Russia concentrates a large share of world capacity.',
    guide: '/en/guides/read-uranium-market/',
    ...energySection,
    atlas: {
      intuition: 'The SWU measures the industrial effort that separates isotopes. It is the true language of the enrichment bottleneck.',
      formula: 'SWU need = target enrichment + fuel quantity + tails assay',
      whyNow: 'The concentration of enrichment capacity makes the geopolitical risk sharper than the ore price alone.',
      articles: [uraniumArticle],
      guides: [uraniumGuide],
      ...energyShared,
      related: ['u3o8', 'uf6', 'haleu', 'smr'],
    },
  },
  {
    slug: 'haleu',
    sigle: 'HALEU',
    nom: 'High-Assay Low-Enriched Uranium',
    def: 'Low-enriched uranium of high assay, between 5 and 20% uranium-235, the fuel required by most small modular and advanced reactors. Long supplied commercially by Russia alone, it is the main bottleneck of the Western nuclear revival.',
    guide: '/en/guides/read-uranium-market/',
    ...energySection,
    atlas: {
      intuition: 'HALEU is the advanced fuel where nuclear promise and industrial-chain dependence concentrate.',
      whyNow: 'Small reactors and advanced projects run into a commercial supply that is still too narrow.',
      articles: [uraniumArticle],
      guides: [uraniumGuide],
      ...energyShared,
      related: ['swu', 'uf6', 'u3o8', 'smr'],
    },
  },
  {
    slug: 'smr',
    sigle: 'SMR',
    nom: 'Small Modular Reactor',
    def: 'A small, low-power modular reactor designed for series production and faster deployment than a large plant. Central to plans for powering AI data centres, though the first commercial units are not expected before the early 2030s.',
    guide: '/en/guides/read-uranium-market/',
    ...energySection,
    atlas: {
      intuition: 'The SMR is an industrial option on low-carbon electricity, but its calendar remains slower than data-centre demand.',
      formula: 'SMR risk = industrial delay + available fuel + cost of capital',
      whyNow: 'AI electricity demand pushes nuclear forward before the first commercial deployments are actually available.',
      articles: [uraniumArticle],
      guides: [uraniumGuide],
      ...energyShared,
      related: ['haleu', 'swu', 'uf6', 'u3o8'],
    },
  },
  {
    slug: 'rate-base',
    sigle: 'Rate base',
    nom: 'Regulated asset base',
    def: "The value of a utility's property on which the regulator allows it to earn a return. When a line, substation or plant enters the rate base, depreciation and the allowed return are recovered through rates.",
    ...regulatedUtilitySection,
    atlas: {
      intuition: 'The rate base turns an approved investment into tariff revenue: depreciation and return are recovered from customers as the regulator decides.',
      formula: 'revenue requirement = operating expenses + depreciation + taxes + rate of return × rate base',
      whyNow: 'The data-centre boom forces commissions to decide whether assets built for an absent large load remain with the applicant or enter collective rates.',
      articles: largeLoadArticles,
      datasets: largeLoadDatasets,
      sources: largeLoadSources,
      related: ['actif-echoue', 'take-or-pay', 'capex', 'hyperscaler', 'spv'],
    },
  },
  {
    slug: 'actif-echoue',
    sigle: 'Stranded asset',
    nom: 'Asset no longer earning its expected recovery',
    def: 'An asset that is built or financed but loses the use or revenue needed for full recovery. For an abandoned data centre, it may be a line or substation that is difficult to reassign.',
    ...regulatedUtilitySection,
    atlas: {
      intuition: 'A stranded asset is a cost still awaiting repayment after it has lost the use or revenue meant to finance it.',
      formula: 'stranded cost = unamortised cost - reassignment value - guarantees recovered',
      whyNow: 'A delayed, duplicate or cancelled data-centre load can leave a line or substation underused before it is repaid.',
      articles: largeLoadArticles,
      datasets: largeLoadDatasets,
      sources: largeLoadSources,
      related: ['rate-base', 'take-or-pay', 'capex', 'hyperscaler', 'vrg'],
    },
  },
  {
    slug: 'take-or-pay',
    sigle: 'Take-or-pay',
    nom: 'Minimum-payment commitment',
    def: 'A clause requiring payment for a minimum quantity or reserved capacity even when the customer uses less. The minimum, exceptions and service conditions depend on the agreement. It reduces the supplier’s exposure to usage volumes while leaving customer default risk and the supplier’s performance obligations in place.',
    ...regulatedUtilitySection,
    robots: 'noindex,follow',
    atlas: {
      intuition: 'Take-or-pay charges for the reservation, not only use. It turns the grid volume risk into a customer credit obligation.',
      whyNow: 'New large-load tariffs use minimum payments, long terms and collateral to filter speculative requests.',
      articles: [...largeLoadArticles, {"label": "GPU-backed debt: pricing the fourth year", "href": "/en/analysis/gpu-backed-debt-fourth-year/", "detail": "Contracts, renewal cash flows and hypothetical loan scenarios.", "kind": "article"}],
      datasets: largeLoadDatasets,
      sources: [...largeLoadSources, {"label": "Morningstar DBRS, Lambda Compute I", "href": "https://dbrs.morningstar.com/research/490455/morningstar-dbrs-assigns-credit-ratings-of-a-low-to-lambda-compute-i-llc", "detail": "October 2, 2026 assessment: take-or-pay capacity commitments and counterparty/service risks. Attributed credit opinion.", "kind": "source"}],
      related: ['rate-base', 'actif-echoue', 'vrg', 'dscr', 'ddtl'],
    },
  },
  {
    slug: 'opep',
    sigle: 'OPEC',
    nom: 'Organization of the Petroleum Exporting Countries',
    def: 'The producers cartel (Saudi Arabia and others) that coordinates production quotas to influence the price of the barrel.',
    guide: '/en/guides/read-oil-market/',
    ...energySection,
    atlas: {
      intuition: 'OPEC coordinates part of the supply, but its real power depends on internal discipline and marginal demand.',
      whyNow: "When Chinese demand slows or draws on its stocks, OPEC's ability to support the price becomes observable.",
      articles: [oilArticles[0], oilArticles[1], oilArticles[2]],
      guides: [oilGuide],
      ...energyShared,
      related: ['opep-2', 'brent', 'wti', 'spr', 'chokepoint'],
    },
  },
  {
    slug: 'opep-2',
    sigle: 'OPEC+',
    nom: 'The enlarged OPEC',
    def: 'OPEC plus around ten non-member producers, including Russia, coordinating quotas since late 2016. Its decisions now weigh as much as OPEC\'s alone: the group raised output by nearly 600,000 barrels a day between April and June 2026, then by another 188,000 in July.',
    guide: '/en/guides/read-oil-market/',
    ...energySection,
    atlas: {
      intuition: 'OPEC+ adds non-member producers, Russia included, and makes the reading of supply more political.',
      whyNow: 'Coordinated hikes or cuts shift the balance between inventories, supply discipline and geopolitical premium.',
      articles: [oilArticles[0], oilArticles[2]],
      guides: [oilGuide],
      ...energyShared,
      related: ['opep', 'brent', 'wti', 'spr'],
    },
  },
  {
    slug: 'ticket-de-stockage',
    sigle: 'Stockholding ticket',
    nom: 'Contractual access to an existing oil stock',
    def: 'A paid agreement reserving access to oil specified by quantity, product, location and period. The right to acquire or take delivery depends on the agreed terms. Before purchase, the oil remains with its owner; the seller excludes the reserved quantity from coverage of its own obligation. A ticket allocates rights over physical inventory without creating more oil.',
    guide: '/en/analysis/france-oil-reserves-ownership-sagess-funding/',
    ...energySection,
    robots: 'noindex,follow',
    atlas: {
      intuition: 'One tank can cover different operators’ obligations when contractual rights prevent double counting.',
      articles: [{ label: 'Who owns France’s emergency oil?', href: '/en/analysis/france-oil-reserves-ownership-sagess-funding/', kind: 'article' }],
      sources: [
        { label: 'IEA, stockholding-ticket methodology', href: 'https://www.iea.org/data-and-statistics/data-tools/oil-stocks-of-iea-countries', kind: 'source' },
        { label: 'French Defence Code, D1336-52', href: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000031946360', kind: 'source' },
      ],
      related: ['spr'],
    },
  },
  {
    slug: 'spr',
    sigle: 'SPR',
    nom: 'Strategic petroleum reserve',
    def: 'In the United States, the Strategic Petroleum Reserve is a federal crude stockpile held in salt caverns to respond to supply disruptions. Other countries’ emergency systems may also include refined products owned by the government, an agency or companies subject to stockholding obligations. Crude still needs refining; product mix, transport and available capacity determine the fuel delivered. Loaned oil becomes a claim on future repayment; it is available in the reserve again after its physical return.',
    guide: '/en/guides/read-oil-market/',
    ...energySection,
    atlas: {
      intuition: 'A stock cushions an interruption when oil can be withdrawn, transported and processed in time. A repayment promise organises future availability.',
      formula: 'theoretical coverage (days) = deployable volume (barrels) / remaining gap (barrels per day)',
      whyNow: 'The September 2026 U.S. offer includes return windows through 2029. Barrel premiums must be read alongside timing and logistical capacity.',
      articles: [{ label: 'Strategic oil reserves buy time', href: '/en/analysis/strategic-oil-reserves-borrowing-time/' }, { label: 'Oil reserves: the journey from storage to diesel', href: '/en/analysis/oil-reserves-crude-diesel-contents-delivery/' }, { label: 'Emergency oil reserves: the distance to the pump', href: '/en/analysis/emergency-oil-reserves-last-mile-logistics/' }, { label: 'Emergency oil reserves: the refinery sets the pace', href: '/en/analysis/emergency-oil-reserves-refining-capacity-maintenance/' }, { label: 'Emergency oil reserves: from the market to the pump', href: '/en/analysis/emergency-oil-reserves-pass-through-pump-prices/', kind: 'article' }, { label: 'Emergency oil reserves: the contracts behind the release', href: '/en/analysis/emergency-oil-reserves-sales-exchanges-allocation/', kind: 'article' }, oilArticles[0], oilArticles[1]],
      guides: [oilGuide],
      ...energyShared,
      sources: [
        { label: 'DOE, SPR sales and exchanges', href: 'https://www.energy.gov/hgeo/opr/spr-sales-and-exchanges' },
        { label: 'IEA, emergency stockholding systems', href: 'https://www.iea.org/about/oil-security-and-emergency-response' },
        energyShared.sources[0],
      ],
      related: ['brent', 'wti', 'opep', 'opep-2', 'chokepoint', 'ticket-de-stockage'],
    },
  },
  {
    slug: 'ccp',
    sigle: 'CCP',
    nom: 'Central counterparty',
    def: 'A clearing house that interposes itself between buyer and seller and becomes the counterparty to each trade. It reduces counterparty risk and organises default management, at the cost of more systematic margin calls.',
    guide: '/en/guides/read-interest-rate-swaps/',
    ...clearingSection,
    atlas: {
      intuition: 'A central counterparty reduces the propagation of default, but turns market losses into calls for cash and collateral.',
      formula: 'counterparty protection = initial margin + variation margin + default resources',
      whyNow: 'When oil becomes more volatile, clearing resilience also depends on clients and banks providing liquidity on time.',
      articles: [oilArticles[5]],
      guides: marginGuides,
      ...marginShared,
      related: ['appel-de-marge', 'marge-initiale', 'marge-de-variation', 'membre-compensateur', 'brent', 'repo'],
    },
  },
  {
    slug: 'appel-de-marge',
    sigle: 'Margin call',
    nom: 'Demand for additional cash or collateral',
    def: 'A request for additional cash or collateral when the value or risk of a position changes. It may be variation margin settling the current loss or an increase in initial margin covering a potential loss after default.',
    guide: '/en/guides/read-interest-rate-swaps/',
    ...clearingSection,
    atlas: {
      intuition: 'A margin call does not mean a hedge is economically wrong. It means its current loss or potential risk must be funded now.',
      formula: 'liquidity need = variation margin + increase in initial margin - available cash and collateral',
      whyNow: 'A producer short futures can gain on physical crude and still have to advance cash before the cargo settles.',
      articles: [oilArticles[5]],
      guides: marginGuides,
      ...marginShared,
      related: ['marge-initiale', 'marge-de-variation', 'membre-compensateur', 'ccp', 'brent'],
    },
  },
  {
    slug: 'marge-initiale',
    sigle: 'Initial margin',
    nom: 'Potential-loss collateral',
    def: 'Cash or liquid securities posted at inception and during a position to cover a potential loss while a defaulting participant is closed out. Its amount depends on risk, volatility and recognised portfolio offsets.',
    guide: '/en/guides/read-interest-rate-swaps/',
    ...clearingSection,
    atlas: {
      intuition: "Initial margin is a buffer against a possible future loss during default liquidation, not settlement of today's loss.",
      formula: 'initial margin = potential loss over the liquidation period, after recognised offsets',
      whyNow: 'Volatility can raise this buffer just as participants are already funding daily losses.',
      articles: [oilArticles[5]],
      guides: marginGuides,
      ...marginShared,
      related: ['appel-de-marge', 'marge-de-variation', 'membre-compensateur', 'ccp', 'brent'],
    },
  },
  {
    slug: 'marge-de-variation',
    sigle: 'Variation margin',
    nom: 'Daily settlement of mark-to-market gains and losses',
    def: 'A payment, generally daily and in cash for cleared derivatives, that settles gains and losses caused by the new market value. It resets current exposure between counterparties to zero but can create an immediate cash need.',
    guide: '/en/guides/read-interest-rate-swaps/',
    ...clearingSection,
    atlas: {
      intuition: 'Variation margin settles today the gain or loss that has appeared since the previous valuation.',
      formula: 'variation margin ≈ price change × contract size × number of contracts',
      whyNow: 'On a short oil hedge, a higher barrel can cause an immediate outflow before the physical cargo is paid for.',
      articles: [oilArticles[5]],
      guides: marginGuides,
      ...marginShared,
      related: ['appel-de-marge', 'marge-initiale', 'membre-compensateur', 'ccp', 'brent'],
    },
  },
  {
    slug: 'membre-compensateur',
    sigle: 'Clearing member',
    nom: 'Member of a central counterparty',
    def: "A firm that settles margins and obligations for its own positions and those of its clients at a central counterparty. If a client misses a margin call, the member still owes the clearing house and bears step-in liquidity risk.",
    guide: '/en/guides/read-interest-rate-swaps/',
    ...clearingSection,
    atlas: {
      intuition: 'The clearing member is the bridge between client and clearing house. It passes on margin and remains responsible for settlement to the CCP.',
      whyNow: 'If a client runs short of cash, stress moves to the bank providing clearing and, sometimes, funding.',
      articles: [oilArticles[5]],
      guides: marginGuides,
      ...marginShared,
      related: ['appel-de-marge', 'marge-initiale', 'marge-de-variation', 'ccp', 'brent'],
    },
  },
  {
    slug: 'cet1',
    sigle: 'CET1',
    nom: 'Common Equity Tier 1 capital',
    def: "The highest-quality regulatory capital, including common shares and retained earnings after prudential adjustments. The CET1 ratio divides that amount by risk-weighted assets; capital and its ratio are distinct measures.",
    guide: '/en/guides/read-bank-health/',
    ...privateCreditSection,
    atlas: {
      intuition: 'A bank can record loan losses and still have a high CET1 ratio when earnings, provisions and capital absorb them. The ratio says how much hard capital remains relative to measured risk.',
      formula: 'CET1 ratio = CET1 capital / risk-weighted assets',
      whyNow: 'France can report rising business failures while its largest banking groups retain a 15.6% aggregate CET1 ratio because case counts and bank capital use different denominators.',
      articles: [
        { label: 'Where do the losses from 70,803 French business failures go?', href: '/en/analysis/france-business-failures-who-absorbs-losses/', detail: 'Firm size, recoveries, guarantees and the final creditor.', kind: 'article' },
        { label: 'Held to maturity', href: '/en/analysis/held-to-maturity/', detail: 'Unrealised securities losses and the limits of regulatory capital.', kind: 'article' },
      ],
      guides: [
        { label: 'Reading bank health', href: '/en/guides/read-bank-health/', detail: 'Capital, liquidity, asset quality and earnings.', kind: 'guide' },
        { label: 'Reading bank stress tests', href: '/en/guides/read-bank-stress-tests/', detail: 'Projected losses, revenue and capital under severe scenarios.', kind: 'guide' },
      ],
      sources: [
        { label: 'Basel Committee on Banking Supervision', href: 'https://www.bis.org/bcbs/basel3.htm', detail: 'International definitions and minimum capital framework.', kind: 'source' },
        { label: 'European Banking Authority', href: 'https://www.eba.europa.eu/risk-and-data-analysis/risk-analysis/risk-monitoring/risk-dashboard', detail: 'Comparable European bank capital and asset-quality indicators.', kind: 'source' },
      ],
    },
  },
  {
    slug: 'ofac',
    sigle: 'OFAC',
    nom: 'Office of Foreign Assets Control',
    def: 'The US Treasury office that administers and enforces economic sanctions, including asset blocking and the SDN List.',
    guide: '/en/guides/read-ofac-sdn-list/',
    ...usRegulationSection,
    atlas: {
      intuition: 'OFAC turns presidential orders and statutes into lists, licences and restrictions that banks and companies must apply.',
      whyNow: 'Its Iran determinations show the difference between opening a legal power and actually using it against a named target.',
      articles: [{ label: 'How far can Bessent close the dollar?', href: '/en/analysis/iran-how-far-can-bessent-close-the-dollar/', detail: 'Existing Iran sanctions, new sectoral powers and the systemic boundary.', kind: 'article' }],
      guides: [{ label: 'Read the OFAC SDN List', href: '/en/guides/read-ofac-sdn-list/', detail: 'Blocking, the 50 percent rule and the reach of US sanctions.', kind: 'guide' }],
      sources: [{ label: 'OFAC', href: 'https://ofac.treasury.gov/', detail: 'Sanctions programmes, lists, licences and enforcement notices.', kind: 'source' }],
      related: ['sanctions-secondaires'],
    },
  },
  {
    slug: 'sanctions-secondaires',
    sigle: 'Secondary sanctions',
    nom: 'US pressure on a foreign person',
    def: 'Measures that force a non-US person or bank to choose between specified dealings with a sanctioned target and important access to the United States, including dollar correspondent accounts. They use access to the US market and financial system as leverage.',
    guide: '/en/analysis/iran-how-far-can-bessent-close-the-dollar/',
    ...usRegulationSection,
    atlas: {
      intuition: 'The foreign person is not simply told that its local transaction is illegal. It is told that continuing it can cost access to the United States.',
      whyNow: 'The decisive Iran question is whether Washington will apply this leverage to a major foreign bank rather than another replaceable intermediary.',
      articles: [{ label: 'How far can Bessent close the dollar?', href: '/en/analysis/iran-how-far-can-bessent-close-the-dollar/', detail: 'The dollar channel and the line between deterrence and systemic disruption.', kind: 'article' }],
      guides: [{ label: 'Read the OFAC SDN List', href: '/en/guides/read-ofac-sdn-list/', detail: 'How US blocking sanctions and list-based controls work.', kind: 'guide' }],
      sources: [
        { label: 'Congressional Research Service', href: 'https://www.congress.gov/crs-product/IF12452', detail: 'Definitions and current landscape of US sanctions on Iran.', kind: 'source' },
        { label: 'FinCEN Section 311 rule', href: 'https://www.federalregister.gov/documents/2019/11/04/2019-23697/imposition-of-fifth-special-measure-against-the-islamic-republic-of-iran-as-a-jurisdiction-of', detail: 'Correspondent-account restrictions involving Iranian financial institutions.', kind: 'source' },
      ],
      related: ['ofac'],
    },
  },
  {
    slug: 'cot',
    sigle: 'COT',
    nom: 'Commitments of Traders',
    def: "The CFTC's weekly report detailing open positions on US futures markets by trader category. Published Friday at 3:30 p.m. New York time, on data as of the preceding Tuesday, a three-day lag.",
    guide: '/en/guides/read-cftc-cot-report/',
    ...usRegulationSection,
    atlas: {
      intuition: 'The COT gives a delayed photograph of futures positioning. It does not predict on its own, but it shows where the market is loaded.',
      formula: 'unwind risk = extreme positioning + FX catalyst + volatility',
      whyNow: 'On the yen, a highly consensual positioning turns dangerous when the BoJ, the MoF or the Fed changes the rate regime.',
      articles: [yenArticle],
      guides: [yenGuides[0], yenGuides[1]],
      ...yenShared,
      related: ['yen-carry', 'boj', 'mof', 'move'],
    },
  },
  {
    slug: 'risque-de-reinvestissement',
    sigle: 'Reinvestment risk',
    nom: 'Replacing income after repayment',
    def: 'The risk of reinvesting repaid capital or income on less rewarding terms. Early repayment can shorten the life of an attractive loan; future income then depends on the reinvestment delay, new rate, fees and risk accepted.',
    guide: '/en/analysis/private-credit-borrower-exits-reinvestment-risk/',
    ...privateCreditSection,
    atlas: {
      intuition: 'Repayment returns liquidity to the lender, who must find a new use for it. The old loan’s rate stops earning income.',
      formula: 'period income = interest before repayment + income on reinvested capital + any premium',
      whyNow: 'Refinancing private loans at narrower spreads makes this risk visible even when the benchmark rate is unchanged.',
      articles: [{ label: 'Private credit: when borrowers find a cheaper exit', href: '/en/analysis/private-credit-borrower-exits-reinvestment-risk/', detail: 'Mercer, recurring income and the use of returned capital.', kind: 'article' }],
      sources: [{ label: 'BlackRock Credit Strategies Fund, 2024 prospectus', href: 'https://www.sec.gov/Archives/edgar/data/1752019/000119312524242920/d815713d424b3.htm', detail: 'Prepayment Risk and Reinvestment Risk, pages 13 and 88.', kind: 'source' }],
      related: ['credit-prive', 'bdc'],
    },
  },
  {
    slug: "at1",
    sigle: "AT1",
    nom: "Additional Tier 1",
    def: "Additional Tier 1 regulatory capital. Subordinated, perpetual instruments whose distributions can be cancelled and whose principal can be converted or written down under the applicable terms. Tier 1 combines CET1 and AT1, with different loss-absorption mechanisms.",
    guide: "/en/analysis/ubs-foreign-subsidiaries-capital-double-leverage/",
    sectionTitle: "Bank capital & regulation",
    accent: "var(--color-topic-blue)",
    atlas: {
      intuition: "Cancelling a coupon retains liquidity; conversion or principal writedown absorbs losses under the instrument’s terms.",
      articles: [{
        label: "UBS: parent capital and foreign subsidiaries",
        href: "/en/analysis/ubs-foreign-subsidiaries-capital-double-leverage/",
        kind: "article"
      }],
      sources: [{
        label: "Basel Committee, CAP10",
        href: "https://www.bis.org/committees/bcbs/basel-framework/standard/cap/10/inforce/2019-12-15/published/2020-06-05",
        kind: "source"
      }],
      related: ["cet1", "double-levier"]
    }
  },
  {
    slug: "double-levier",
    sigle: "Double leverage",
    nom: "Double leverage",
    def: "Funding a subsidiary’s equity partly with debt issued by its parent. The subsidiary receives equity while the parent retains a repayment obligation. A fall in the investment’s value can therefore reduce the parent’s capital.",
    guide: "/en/analysis/ubs-foreign-subsidiaries-capital-double-leverage/",
    sectionTitle: "Bank capital & regulation",
    accent: "var(--color-topic-blue)",
    atlas: {
      intuition: "The parent still owes its creditors even when its shares in a subsidiary lose value.",
      articles: [{
        label: "UBS: parent capital and foreign subsidiaries",
        href: "/en/analysis/ubs-foreign-subsidiaries-capital-double-leverage/",
        kind: "article"
      }],
      sources: [{
        label: "FINMA, double leverage",
        href: "https://www.finma.ch/en/news/2025/06/20250606-mm-finma-tbtf/",
        kind: "source"
      }],
      related: ["cet1", "at1"]
    }
  },
  {
    slug: 'cfo',
    sigle: 'CFO',
    nom: 'Collateralised Fund Obligation',
    def: 'A vehicle that finances directly or indirectly held fund interests by issuing debt and equity. Fund distributions pay investors in a contractual order. Subordination allocates losses; reserves and liquidity facilities address cash-flow timing. Here CFO refers to the financing structure, rather than a company’s chief financial officer.',
    guide: '/en/analysis/private-equity-cfo-bonds-insurers/',
    ...privateCreditSection,
    atlas: {
      intuition: 'A claim can be protected against the first losses while depending on irregular distributions.',
      articles: [{ label: 'Private equity bonds for insurers', href: '/en/analysis/private-equity-cfo-bonds-insurers/', kind: 'article' }],
      sources: [{ label: 'Mayer Brown, CFO mechanics', href: 'https://www.mayerbrown.com/en/insights/publications/2023/08/collateralized-fund-obligations-a-growing-cdo-clo-and-fund-finance-liquidity-solution', kind: 'source' }],
      related: ['credit-prive', 'nav-loan'],
    },
  },
];

export const glossaryAtlasEnBySlug = new Map(glossaryAtlasEn.map((entry) => [entry.slug, entry]));
