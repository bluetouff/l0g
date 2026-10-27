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

// A translated short definition is not an independently qualified reference page.
// Keep the same opt-in indexation policy as the French glossary.
export function englishGlossaryRobots(entry: GlossaryAtlasEnEntry): 'index,follow' | 'noindex,follow' {
  return entry.robots ?? 'noindex,follow';
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
  {"slug": "proposition-de-rectification", "sigle": "Proposed tax adjustment", "nom": "French notice opening an exchange with the taxpayer", "def": "A reasoned notice in which the French tax authority sets out intended changes to a taxpayer’s tax position and their factual and legal grounds. Under the adversarial procedure, the taxpayer can accept the changes or make representations within the prescribed period. Proposed adjustments may then be revised or dropped; their amount is distinct from the tax eventually assessed for collection and the cash received.", "guide": "/en/analysis/cum-cum-02-warnings-timeline/", "sectionTitle": "Banking & balance-sheet management", "accent": "var(--color-topic-blue)", "robots": "noindex,follow", "atlas": {"articles": [{"label": "Cum-cum: the warnings before the scandal", "href": "/en/analysis/cum-cum-02-warnings-timeline/", "kind": "article"}], "sources": [{"label": "French tax authority, contents of a proposed tax adjustment", "href": "https://bofip.impots.gouv.fr/bofip/872-PGP.html/identifiant=BOI-CF-IOR-10-40-20200304", "detail": "Paragraphs 20 and 40: taxpayer response, grounds and proposed amounts.", "kind": "source"}, {"label": "French tax authority, handling taxpayer representations", "href": "https://bofip.impots.gouv.fr/bofip/12989-PGP.html/identifiant=BOI-CF-IOR-10-50-30-20210519", "detail": "Paragraphs 10–50: revision or abandonment of proposed adjustments where representations are justified.", "kind": "source"}], "related": ["retenue-a-la-source", "cjip"]}},
  {
    "slug": "retenue-a-la-source",
    "sigle": "Withholding tax",
    "nom": "Tax collected when income is paid",
    "def": "Tax deducted when income is paid and remitted to the tax authority by the party responsible for collection. For a cross-border dividend, its application and rate depend on the recipient, domestic law and the relevant tax treaty. A treaty may provide a reduced rate or an exemption subject to its conditions.",
    "guide": "/en/analysis/cum-cum-01-dividend-mechanism/",
    "sectionTitle": "Banking & balance-sheet management",
    "accent": "var(--color-topic-blue)",
    "robots": "noindex,follow",
    "atlas": {
      "articles": [
        {"label": "Cum-cum: tax-loss estimates and recoveries", "href": "/en/analysis/cumcum-03-tax-loss-estimates/", "kind": "article"},
        {"label": "Cum-cum: the warnings before the scandal", "href": "/en/analysis/cum-cum-02-warnings-timeline/", "kind": "article"},
        {
          "label": "Cum-cum: a dividend tax becomes a trading margin",
          "href": "/en/analysis/cum-cum-01-dividend-mechanism/",
          "kind": "article"
        }
      ],
      "sources": [
        {
          "label": "Conseil d’État, opinion of 27 January 2025",
          "href": "https://www.conseil-etat.fr/avis-consultatifs/derniers-avis-rendus/au-gouvernement/avis-portant-sur-un-projet-de-dispositif-renforce-concernant-l-application-de-la-retenue-a-la-source-aux-operations-d-arbitrage-de-dividende-dites",
          "detail": "Paragraph 1 and introduction: withholding on cross-border dividends; an opinion on a proposal, distinct from the subsequent enacted legislation.",
          "kind": "source"
        }
      ],
      "related": [
        "beneficiaire-effectif"
      ]
    }
  },
  {
    "slug": "pret-de-titres",
    "sigle": "Securities lending",
    "nom": "Temporary transfer of securities under a return agreement",
    "def": "An arrangement in which a lender temporarily transfers shares or bonds to a borrower, who undertakes to return equivalent securities. The borrower generally provides collateral and pays a fee. Lending can support settlement, market making or hedging; collateral and income-related payments depend on the contract.",
    "guide": "/en/analysis/cum-cum-01-dividend-mechanism/",
    "sectionTitle": "Banking & balance-sheet management",
    "accent": "var(--color-topic-blue)",
    "robots": "noindex,follow",
    "atlas": {
      "articles": [
        {"label": "Cum-cum: the warnings before the scandal", "href": "/en/analysis/cum-cum-02-warnings-timeline/", "kind": "article"},
        {
          "label": "Cum-cum: a dividend tax becomes a trading margin",
          "href": "/en/analysis/cum-cum-01-dividend-mechanism/",
          "kind": "article"
        }
      ],
      "sources": [
        {
          "label": "ECB, securities lending, 8 December 2016",
          "href": "https://www.ecb.europa.eu/ecb-and-you/explainers/tell-me-more/html/securities_lending.en.html",
          "detail": "Temporary transfer, collateral, fees and market uses. The page’s historical settlement timing is outside this definition.",
          "kind": "source"
        }
      ],
      "related": [
        "trs",
        "beneficiaire-effectif"
      ]
    }
  },
  {
    "slug": "beneficiaire-effectif",
    "sigle": "Beneficial owner",
    "nom": "Tax status tied to the use and enjoyment of income",
    "def": "In the tax treatment of dividends, a person entitled to use and enjoy the income without a legal or contractual obligation to pass it on. That status depends on the obligations, actual circumstances and conditions of the relevant tax treaty. Legal ownership of the security and exposure to its performance require separate analysis.",
    "guide": "/en/analysis/cum-cum-01-dividend-mechanism/",
    "sectionTitle": "Banking & balance-sheet management",
    "accent": "var(--color-topic-blue)",
    "robots": "noindex,follow",
    "atlas": {
      "articles": [
        {
          "label": "Cum-cum: a dividend tax becomes a trading margin",
          "href": "/en/analysis/cum-cum-01-dividend-mechanism/",
          "kind": "article"
        }
      ],
      "sources": [
        {
          "label": "French tax authority, beneficial ownership and dividends, 16 March 2026",
          "href": "https://bofip.impots.gouv.fr/bofip/14878-PGP.html/identifiant=BOI-INT-DG-20-20-20-30-20260316",
          "detail": "Paragraph 30: right to use and enjoy income, pass-through obligations and the applicable tax treaty’s conditions.",
          "kind": "source"
        }
      ],
      "related": [
        "retenue-a-la-source",
        "trs"
      ]
    }
  },
  {
    "slug": "cjip",
    "sigle": "CJIP",
    "nom": "French judicial public-interest agreement",
    "def": "A French criminal-procedure settlement agreed by a prosecutor and a legal person in the cases allowed by law, then submitted for judicial approval. It may require a public-interest fine and other obligations. Approval is distinct from a declaration of guilt or a conviction; fulfilling the agreed obligations extinguishes the prosecution for the covered conduct.",
    "guide": "/en/analysis/cum-cum-01-dividend-mechanism/",
    "sectionTitle": "Banking & balance-sheet management",
    "accent": "var(--color-topic-blue)",
    "robots": "noindex,follow",
    "atlas": {
      "articles": [
        {"label": "Cum-cum: tax-loss estimates and recoveries", "href": "/en/analysis/cumcum-03-tax-loss-estimates/", "kind": "article"},
        {"label": "Cum-cum: the warnings before the scandal", "href": "/en/analysis/cum-cum-02-warnings-timeline/", "kind": "article"},
        {
          "label": "Cum-cum: a dividend tax becomes a trading margin",
          "href": "/en/analysis/cum-cum-01-dividend-mechanism/",
          "kind": "article"
        }
      ],
      "sources": [
        {
          "label": "PNF, Crédit Agricole CIB agreement, 5 September 2025",
          "href": "https://www.justice.gouv.fr/sites/default/files/2025-09/CJIP_CACIB_20250905.pdf",
          "detail": "Paragraphs 57–61: obligations, performance and procedural status distinct from a conviction.",
          "kind": "source"
        }
      ],
      "related": [
        "retenue-a-la-source"
      ]
    }
  },
  {"slug": "rehaussement-de-credit", "sigle": "Credit enhancement", "nom": "Contractual protection for a debt claim", "def": "Protection for a debt claim through resources or commitments that absorb losses before its holder: subordination, overcollateralisation, a reserve or a guarantee, depending on the structure. Its effect depends on the amount available, payment priority and contractual terms. The security’s rating also takes the portfolio and the wider structure into account.", "guide": "/en/analysis/private-credit-route-insurers-rated-feeders/", "sectionTitle": "Private credit & markets", "accent": "var(--color-accent)", "robots": "noindex,follow", "atlas": {"articles": [{"label": "Private credit: a new route to insurers", "href": "/en/analysis/private-credit-route-insurers-rated-feeders/", "detail": "Debt seniority, available cash flows and prudential treatment of rated feeders.", "kind": "article"}], "sources": [{"label": "Fitch, Feeder Fund Debt Rating Criteria, 24 September 2025", "href": "https://assets.fitchratings.com/downloadFile?reportType=report&sfReport=false&slug=fund-asset-managers/feeder-fund-debt-rating-criteria-24-09-2025", "detail": "Pages 5–7: credit enhancement, liquidity, master-fund debt and cash-flow allocation. General methodology.", "kind": "source"}, {"label": "NAIC, SSAP 26, version effective January 2025", "href": "https://content.naic.org/sites/default/files/inline-files/SSAP%20No.pdf", "detail": "Paragraphs 6 and 10: creditor relationship, underlying equity interests and substantive loss protection.", "kind": "source"}, {"label": "SEC / Investor.gov, ABCs of Credit Ratings, 12 October 2017", "href": "https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/updated-8", "detail": "Credit-risk scope and distinction from market price and liquidity.", "kind": "source"}], "related": ["rated-feeder-note", "clo", "rbc"], "guides": [{"label": "Reading CLOs and leveraged loans", "href": "/en/guides/read-clos-and-leveraged-loans/", "kind": "guide"}]}},
  {"slug": "rated-feeder-note", "sigle": "Rated feeder note", "nom": "Rated debt issued by a feeder fund", "def": "Rated debt issued by a feeder vehicle investing in a fund. In a master-fund structure, repayment relies on distributions received after the master fund meets its own obligations. Seniority sets payment priority within the feeder. For a US insurer, capital treatment depends on accounting classification, credit designation and the applicable rules.", "guide": "/en/analysis/private-credit-route-insurers-rated-feeders/", "sectionTitle": "Private credit & markets", "accent": "var(--color-accent)", "robots": "noindex,follow", "atlas": {"articles": [{"label": "Private credit: a new route to insurers", "href": "/en/analysis/private-credit-route-insurers-rated-feeders/", "detail": "Debt seniority, available cash flows and prudential treatment of rated feeders.", "kind": "article"}], "sources": [{"label": "Fitch, Feeder Fund Debt Rating Criteria, 24 September 2025", "href": "https://assets.fitchratings.com/downloadFile?reportType=report&sfReport=false&slug=fund-asset-managers/feeder-fund-debt-rating-criteria-24-09-2025", "detail": "Pages 5–7: credit enhancement, liquidity, master-fund debt and cash-flow allocation. General methodology.", "kind": "source"}, {"label": "NAIC, SSAP 26, version effective January 2025", "href": "https://content.naic.org/sites/default/files/inline-files/SSAP%20No.pdf", "detail": "Paragraphs 6 and 10: creditor relationship, underlying equity interests and substantive loss protection.", "kind": "source"}, {"label": "SEC / Investor.gov, ABCs of Credit Ratings, 12 October 2017", "href": "https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/updated-8", "detail": "Credit-risk scope and distinction from market price and liquidity.", "kind": "source"}], "related": ["rehaussement-de-credit", "rbc", "nav"]}},
  {"slug": "wmt", "sigle": "WMT", "nom": "Wet metric tonne", "def": "A unit for the mass of ore including its moisture. Converting wet tonnes to dry tonnes requires the product’s moisture content. Comparing a cost per wet tonne with a price per dry tonne therefore requires a consistent mass basis and a check of the costs included.", "guide": "/en/analysis/iron-ore-price-of-waiting-fortescue-cmrg/", "sectionTitle": "Industry and commodities", "accent": "var(--color-amber)", "robots": "noindex,follow", "atlas": {"articles": [{"label": "Iron ore: the price of waiting", "href": "/en/analysis/iron-ore-price-of-waiting-fortescue-cmrg/", "kind": "article"}], "sources": [{"label": "OECD, mineral product pricing discussion draft, 2017", "href": "https://documents.worldbank.org/curated/en/775571485262636835/pdf/112221-WP-PUBLIC-ABSTRACT-SENT-23-1-2017-10-50-11-OECDmineralproductstradedinintermediateformsdiscussi.pdf", "detail": "PDF p. 40 / printed p. 36, price box: wet and dry mass bases. Consultation draft hosted by the World Bank.", "kind": "source"}, {"label": "Fortescue, FY26 Annual Report", "href": "https://edge.sitecorecloud.io/fortescue17114-fortescueeb60-productionbbdb-8be5/media/project/fortescueportal/shared/documents/regulatory/asx-announcements/fy26-annual-report_-app4e_updated.pdf", "detail": "PDF p. 42 / printed p. 39: delivered cost in $/wmt and $/dmt; glossary on PDF pp. 280 and 282 defines dmt and wmt.", "kind": "source"}], "related": ["dmt", "c1"]}},
  {"slug": "dmt", "sigle": "DMT", "nom": "Dry metric tonne", "def": "A unit for the mass of ore excluding its moisture. A price per dry tonne is quoted on that mass basis. Conversion from wet tonnage depends on the product’s moisture content; a dry tonne of ore includes both iron and the ore’s other dry constituents.", "guide": "/en/analysis/iron-ore-price-of-waiting-fortescue-cmrg/", "sectionTitle": "Industry and commodities", "accent": "var(--color-amber)", "robots": "noindex,follow", "atlas": {"articles": [{"label": "Iron ore: the price of waiting", "href": "/en/analysis/iron-ore-price-of-waiting-fortescue-cmrg/", "kind": "article"}], "sources": [{"label": "OECD, mineral product pricing discussion draft, 2017", "href": "https://documents.worldbank.org/curated/en/775571485262636835/pdf/112221-WP-PUBLIC-ABSTRACT-SENT-23-1-2017-10-50-11-OECDmineralproductstradedinintermediateformsdiscussi.pdf", "detail": "PDF p. 40 / printed p. 36, price box: wet and dry mass bases. Consultation draft hosted by the World Bank.", "kind": "source"}, {"label": "Fortescue, FY26 Annual Report", "href": "https://edge.sitecorecloud.io/fortescue17114-fortescueeb60-productionbbdb-8be5/media/project/fortescueportal/shared/documents/regulatory/asx-announcements/fy26-annual-report_-app4e_updated.pdf", "detail": "PDF p. 42 / printed p. 39: delivered cost in $/wmt and $/dmt; glossary on PDF pp. 280 and 282 defines dmt and wmt.", "kind": "source"}], "related": ["wmt", "c1"]}},
  {"slug": "wafer", "sigle": "Wafer", "nom": "Substrate for integrated-circuit fabrication", "def": "A thin substrate on which integrated circuits are manufactured. Silicon wafers are sliced from a crystalline ingot and their surfaces prepared for processing. Many circuits are formed on one wafer before they are separated into individual chips.", "guide": "/en/analysis/helium-geopolitics-beneath-the-wafer/", "sectionTitle": "Macro & central banks", "accent": "var(--color-signal)", "robots": "noindex,follow", "atlas": {"articles": [{"label": "Helium: geopolitics beneath the wafer", "href": "/en/analysis/helium-geopolitics-beneath-the-wafer/", "kind": "article"}], "sources": [{"label": "Samsung, creating a wafer, 22 April 2015", "href": "https://news.samsung.com/global/eight-major-steps-to-semiconductor-fabrication-part-1-creating-the-wafer", "detail": "Ingots, slicing and individual circuits formed on a wafer.", "kind": "source"}], "related": ["esc", "conductivite-thermique"]}},
  {"slug": "esc", "sigle": "ESC", "nom": "Electrostatic chuck", "def": "A support that holds a wafer during some manufacturing operations using electrostatic force. A backside gas can improve heat transfer between the wafer and the chuck. Gas pressure, wafer bow and clamping uniformity affect how this interface performs.", "guide": "/en/analysis/helium-geopolitics-beneath-the-wafer/", "sectionTitle": "Macro & central banks", "accent": "var(--color-signal)", "robots": "noindex,follow", "atlas": {"articles": [{"label": "Helium: geopolitics beneath the wafer", "href": "/en/analysis/helium-geopolitics-beneath-the-wafer/", "kind": "article"}], "sources": [{"label": "Parizi et al., Qorvo / CS MANTECH, May 2022", "href": "https://csmantech.org/wp-content/acfrcwduploads/field_5e8cddf5ddd10/post_6573/15.3_Characterization_of_Electrostatic_Chuck.pdf", "detail": "Printed page 265: electrostatic clamping, backside gas and wafer bow.", "kind": "source"}], "related": ["wafer", "conductivite-thermique"]}},
  {"slug": "conductivite-thermique", "sigle": "Thermal conductivity", "nom": "Heat transport under a temperature gradient", "def": "A property relating conductive heat flux to the temperature gradient within a material. It is expressed in watts per metre-kelvin, W·m⁻¹·K⁻¹. Gas comparisons require a stated temperature and pressure conditions; a dilute-gas limiting value describes the gas in that regime.", "guide": "/en/analysis/helium-geopolitics-beneath-the-wafer/", "sectionTitle": "Macro & central banks", "accent": "var(--color-signal)", "robots": "noindex,follow", "atlas": {"articles": [{"label": "Helium: geopolitics beneath the wafer", "href": "/en/analysis/helium-geopolitics-beneath-the-wafer/", "kind": "article"}], "sources": [{"label": "NIST SRD 81, data field definitions", "href": "https://srdata.nist.gov/insulation/Home/DataFieldDef?Length=4", "detail": "Thermal conductivity definition and SI unit.", "kind": "source"}, {"label": "Huber / NIST, thermal conductivity of gases, 2024", "href": "https://tsapps.nist.gov/publication/get_pdf.cfm?pub_id=957066", "detail": "PDF pages 1 and 2: pressure, temperature and dilute-gas limit.", "kind": "source"}], "related": ["wafer", "esc"]}},
  {
    slug: 'ces', sigle: 'CES', nom: 'ECB Consumer Expectations Survey',
    def: 'A monthly online ECB survey of adults in participating euro area countries. It records perceptions, expectations and intentions concerning prices, income, spending and economic conditions. Results are population-weighted. They describe consumers’ answers and are distinct from the ECB’s economic projections.',
    guide: '/en/analysis/ecb-households-bigger-bills/', ...macroSection, robots: 'noindex,follow',
    atlas: {
      articles: [{ label: 'Europe’s households expect bigger bills', href: '/en/analysis/ecb-households-bigger-bills/', kind: 'article' }],
      sources: [{ label: 'ECB, CES methodological information, January 2026', href: 'https://www.ecb.europa.eu/stats/ecb_surveys/consumer_exp_survey/shared/pdf/CES_methodological_guide.en.pdf', detail: 'Target population, recruitment, modules and weighting.', kind: 'source' }],
      related: ['winsorisation', 'quintile-de-revenu', 'ipch'],
    },
  },
  {
    slug: 'winsorisation', sigle: 'Winsorisation', nom: 'Replacing extreme values at selected thresholds',
    def: 'A statistical treatment that replaces values beyond selected thresholds with those thresholds while retaining the observations. For CES quantitative indicators, the limits are the 2nd and 98th percentiles of the weighted distribution, calculated separately for each country and survey round. This limits the influence of extreme responses on the mean.',
    guide: '/en/analysis/ecb-households-bigger-bills/', ...macroSection, robots: 'noindex,follow',
    atlas: {
      articles: [{ label: 'Europe’s households expect bigger bills', href: '/en/analysis/ecb-households-bigger-bills/', kind: 'article' }],
      sources: [{ label: 'ECB, CES aggregate statistics guide, March 2026', href: 'https://www.ecb.europa.eu/stats/ecb_surveys/consumer_exp_survey/shared/pdf/CES_aggregate_statistics_guide.en.pdf', detail: 'Section 3.2: quantitative-response thresholds by country and round.', kind: 'source' }],
      related: ['ces', 'quintile-de-revenu'],
    },
  },
  {
    slug: 'quintile-de-revenu', sigle: 'Income quintile', nom: 'A ranked group within the income distribution',
    def: 'One of five groups formed by ranking a population by income, each accounting for roughly one fifth of its weight. In the CES, thresholds use household disposable income and are calculated by country, survey round and module using survey weights. The first quintile contains the lowest incomes and the fifth the highest. The grouping describes income, which is distinct from wealth.',
    guide: '/en/analysis/ecb-households-bigger-bills/', ...macroSection, robots: 'noindex,follow',
    atlas: {
      articles: [{ label: 'Europe’s households expect bigger bills', href: '/en/analysis/ecb-households-bigger-bills/', kind: 'article' }],
      sources: [{ label: 'ECB, CES aggregate statistics guide, March 2026', href: 'https://www.ecb.europa.eu/stats/ecb_surveys/consumer_exp_survey/shared/pdf/CES_aggregate_statistics_guide.en.pdf', detail: 'Section 4: weighted income thresholds by country, round and module.', kind: 'source' }],
      related: ['ces', 'winsorisation'],
    },
  },
  {
    slug: 'ipch', sigle: 'HICP', nom: 'Harmonised Index of Consumer Prices',
    def: 'A measure of consumer-price inflation calculated using a common methodology that allows comparison across EU countries. Eurostat publishes the index and its detailed consumption categories. The ECB assesses its medium-term 2% inflation target using euro area HICP. The index describes a statistical consumption basket, while a household’s own spending pattern can differ.',
    guide: '/en/analysis/ecb-households-bigger-bills/', ...macroSection, robots: 'noindex,follow',
    atlas: {
      articles: [{ label: 'Europe’s households expect bigger bills', href: '/en/analysis/ecb-households-bigger-bills/', kind: 'article' }],
      sources: [{ label: 'Eurostat, HICP overview', href: 'https://ec.europa.eu/eurostat/web/hicp/overview', kind: 'source' }, { label: 'ECB, two per cent inflation target', href: 'https://www.ecb.europa.eu/mopo/strategy/pricestab/html/index.en.html', detail: 'Medium-term target assessed using euro area HICP.', kind: 'source' }],
      related: ['ces'],
    },
  },
  {
    slug: 'provision-comptable', sigle: 'Accounting provision', nom: 'Liability of uncertain timing or amount',
    def: 'Under IAS 37, a liability of uncertain timing or amount. Recognition requires a present obligation arising from a past event, a probable outflow of resources and a reliable estimate of the amount. Recognising an expense and making the payment can occur at different dates. Termination benefits fall under IAS 19.',
    guide: '/en/analysis/barclays-ai-job-cuts-productivity-evidence/',
    sectionTitle: 'Banking & balance-sheet management', accent: 'var(--color-topic-blue)', robots: 'noindex,follow',
    atlas: {
      intuition: 'An expense and an obligation can be recognised before the corresponding payment.',
      articles: [{ label: 'Barclays: the evidence behind AI and job cuts', href: '/en/analysis/barclays-ai-job-cuts-productivity-evidence/', kind: 'article' }],
      sources: [{ label: 'IFRS Foundation, IAS 37', href: 'https://www.ifrs.org/issued-standards/list-of-standards/ias-37-provisions-contingent-liabilities-and-contingent-assets/', detail: 'Definition of provisions.', kind: 'source' }, { label: 'IFRS Foundation, IFRIC Update, March 2024', href: 'https://www.ifrs.org/news-and-events/updates/ifric/2024/ifric-update-march-2024/', detail: 'IAS 37 paragraph 14: present obligation, probable outflow and reliable estimate.', kind: 'source' }, { label: 'IFRS Foundation, IAS 19', href: 'https://www.ifrs.org/issued-standards/list-of-standards/ias-19-employee-benefits/', detail: 'Termination benefits: recognition of the liability and expense at the earlier of the two specified dates.', kind: 'source' }],
      related: ['coefficient-d-exploitation'],
    },
  },
  {
    slug: 'coefficient-d-exploitation', sigle: 'Cost-to-income ratio', nom: 'Bank expenses relative to income',
    def: 'A bank’s selected expenses divided by its income for the same period. Barclays calculates the ratio as total operating expenses divided by total income. Definitions and adjustments can vary between institutions. The ratio can decline when income grows faster than expenses, even while expenses rise.',
    guide: '/en/analysis/barclays-ai-job-cuts-productivity-evidence/',
    sectionTitle: 'Banking & balance-sheet management', accent: 'var(--color-topic-blue)', robots: 'noindex,follow',
    atlas: {
      intuition: 'A new expense and a change in income affect different sides of the same ratio.',
      formula: 'cost-to-income ratio = selected expenses / selected income × 100',
      articles: [{ label: 'Barclays: the evidence behind AI and job cuts', href: '/en/analysis/barclays-ai-job-cuts-productivity-evidence/', kind: 'article' }],
      sources: [{ label: 'Barclays, third-quarter 2026 results', href: 'https://home.barclays/content/dam/home-barclays/documents/investor-relations/ResultAnnouncements/Q32026Results/Q326-BPLC-Results-RA.pdf', detail: 'PDF page 48, alternative performance measures: total operating expenses divided by total income.', kind: 'source' }],
      related: ['provision-comptable'],
    },
  },
  {"slug": "credit-d-impot-transferable", "sigle": "Transferable tax credit", "nom": "Selling an eligible tax credit for cash", "def": "Under US section 6418, an eligible taxpayer can transfer all or part of certain tax credits, including the section 48C credit, to an unrelated party solely in exchange for cash. The credit awarded, gross sale proceeds and net cash after fees are distinct amounts. Tax eligibility and ongoing compliance requirements continue to apply.", "guide": "/en/analysis/us-rare-earth-magnets-gm-vac-offtake-risk/", "sectionTitle": "Macro & central banks", "accent": "var(--color-signal)", "robots": "noindex,follow", "atlas": {"articles": [{"label": "GM, VAC and financing the Sumter magnet factory", "href": "/en/analysis/us-rare-earth-magnets-gm-vac-offtake-risk/", "kind": "article"}], "sources": [{"label": "IRS, tax-credit transferability FAQs", "href": "https://www.irs.gov/credits-deductions/elective-pay-and-transferability-frequently-asked-questions-transferability", "kind": "source"}], "related": ["capex"]}},
  {"slug": "financement-sans-recours", "sigle": "Non-recourse financing", "nom": "Lending against a project’s own cash flows and assets", "def": "Financing repaid primarily or exclusively from a project’s cash flows and assets, with lender recourse limited to that perimeter rather than shareholders’ general assets. Guarantees, exceptions and sponsor undertakings require examination of the contracts and applicable law. Lenders remain exposed to the project’s economic performance.", "guide": "/en/analysis/us-rare-earth-magnets-gm-vac-offtake-risk/", "sectionTitle": "Banking & balance-sheet management", "accent": "var(--color-topic-blue)", "robots": "noindex,follow", "atlas": {"articles": [{"label": "GM, VAC and financing the Sumter magnet factory", "href": "/en/analysis/us-rare-earth-magnets-gm-vac-offtake-risk/", "kind": "article"}], "sources": [{"label": "World Bank, Project Finance: Key Concepts", "href": "https://ppp.worldbank.org/financing/project-finance-concepts", "kind": "source"}], "related": ["offtake", "collateral"]}},
  {"slug": "forbearance", "sigle": "Forbearance", "nom": "Temporary suspension of specified lender remedies", "def": "An agreement under which lenders temporarily refrain from exercising specified remedies for identified defaults, subject to agreed conditions. e-VAC’s September 2026 agreement covers specified events of default while leaving the loan’s maturity and principal unchanged. The contractual scope and forbearance period determine the protection provided.", "guide": "/en/analysis/us-rare-earth-magnets-gm-vac-offtake-risk/", "sectionTitle": "Banking & balance-sheet management", "accent": "var(--color-topic-blue)", "robots": "noindex,follow", "atlas": {"articles": [{"label": "GM, VAC and financing the Sumter magnet factory", "href": "/en/analysis/us-rare-earth-magnets-gm-vac-offtake-risk/", "kind": "article"}], "sources": [{"label": "VAC / SEC, 2026 interim accounts, Note 19", "href": "https://www.sec.gov/Archives/edgar/data/1385849/000106299326005306/exhibit99-2.htm", "kind": "source"}], "related": ["covenant"]}},
  {
    slug: 'sofr', sigle: 'SOFR', nom: 'Secured Overnight Financing Rate',
    def: 'A rate published by the Federal Reserve Bank of New York measuring the cost of overnight cash borrowing secured by US Treasury securities. Term SOFR is a forward-looking benchmark for specified tenors derived from SOFR futures markets. A loan adds its contractual margin to the applicable reference rate.',
    guide: '/en/analysis/nebius-citi-364-day-gpu-credit/',
    ...privateCreditSection, robots: 'noindex,follow',
    atlas: {
      intuition: 'The benchmark rate and the lender’s margin follow different mechanisms.',
      articles: [{ label: 'Nebius: a 364-day Citi facility for GPU expansion', href: '/en/analysis/nebius-citi-364-day-gpu-credit/', detail: 'Rising margins, variable rates and the Citi facility’s maturity.', kind: 'article' }],
      sources: [
        { label: 'Federal Reserve Bank of New York, SOFR', href: 'https://www.newyorkfed.org/markets/reference-rates/sofr', detail: 'Treasury repo transactions, methodology and publication of the overnight rate.', kind: 'source' },
        { label: 'CME, Term SOFR', href: 'https://www.cmegroup.com/market-data/cme-group-benchmark-administration/term-sofr.html', detail: 'Forward-looking benchmarks derived from SOFR futures markets.', kind: 'source' },
      ],
      related: ['covenant'],
    },
  },
  {
    slug: 'covenant', sigle: 'Covenant', nom: 'A borrower’s contractual undertaking',
    def: 'A financing clause requiring a borrower to meet an obligation, restriction or financial threshold, such as minimum liquidity. Contractual definitions, testing dates, exceptions and remedy periods determine its application and the consequences of a breach. Calculating available headroom requires the covenant’s detailed terms.',
    guide: '/en/analysis/nebius-citi-364-day-gpu-credit/',
    ...privateCreditSection, robots: 'noindex,follow',
    atlas: {
      intuition: 'Compliance with a financial clause depends on the contract’s definitions and thresholds.',
      articles: [{ label: 'Nebius: a 364-day Citi facility for GPU expansion', href: '/en/analysis/nebius-citi-364-day-gpu-credit/', detail: 'The October summary discloses a minimum-liquidity covenant without its numerical threshold.', kind: 'article' }, {"label": "GM, VAC and financing the Sumter magnet factory", "href": "/en/analysis/us-rare-earth-magnets-gm-vac-offtake-risk/", "kind": "article"}],
      sources: [{ label: 'Nebius / SEC, October 22, 2026 Form 6-K', href: 'https://www.sec.gov/Archives/edgar/data/1513845/000110465926117978/tm2628078d1_6k.htm', detail: 'Minimum liquidity, other undertakings and events of default subject to exceptions, grace periods and thresholds.', kind: 'source' }],
      related: ['collateral', 'dscr', "forbearance"],
    },
  },
  {
    slug: 'revenus-differes', sigle: 'Deferred revenue', nom: 'Customer payments for outstanding services',
    def: 'A liability recorded when a customer has paid before the company fulfils the corresponding performance obligations. Nebius’s accounts include advances that may be refundable. Revenue is recognised as the services are provided. The balance-sheet amount and the cash-flow-statement movement are distinct measures.',
    guide: '/en/analysis/nebius-citi-364-day-gpu-credit/',
    ...privateCreditSection, robots: 'noindex,follow',
    atlas: {
      intuition: 'An advance supplies cash while leaving services to provide or, depending on the contract, money to refund.',
      articles: [{ label: 'Nebius: a 364-day Citi facility for GPU expansion', href: '/en/analysis/nebius-citi-364-day-gpu-credit/', detail: 'Customer advances, operating cash flow and outstanding service obligations.', kind: 'article' }],
      sources: [{ label: 'Nebius / SEC, June 30, 2026 interim financial statements', href: 'https://www.sec.gov/Archives/edgar/data/1513845/000110465926094844/nbis-20260812xex99d2.htm', detail: 'Note 4, Deferred Revenue: advance receipts, potentially refundable balances and revenue recognition.', kind: 'source' }],
      related: ['rpo', 'capex'],
    },
  },
  {
    slug: 'clo', sigle: 'CLO', nom: 'Collateralized loan obligation',
    ...privateCreditSection, robots: 'noindex,follow',
    guide: '/en/guides/read-clos-and-leveraged-loans/',
    def: 'A securitisation backed by a portfolio of corporate loans. It finances those loans by issuing securities with different levels of seniority. A contractual waterfall allocates cash flows, paying senior tranches before subordinated tranches, while losses first reach the residual tranche. The protection afforded to a security depends on its seniority, the portfolio and the contractual terms as well as its rating.',
    atlas: {
      intuition: 'Seniority determines payment priority and the order in which a loan portfolio’s losses reach investors.',
      articles: [{ label: 'The regulatory price of a promise', href: '/en/analysis/insurers-asset-managers-06-risk-treatment/', kind: 'article' }],
      guides: [{ label: 'Reading CLOs and leveraged loans', href: '/en/guides/read-clos-and-leveraged-loans/', kind: 'guide' }],
      sources: [{ label: 'NAIC, Collateralized Loan Obligations Primer, 2018', href: 'https://content.naic.org/sites/default/files/naic_archive/primer_180821.pdf', detail: 'Pages 2–4: loan portfolios, tranches, payment priority and the first-loss position.', kind: 'source' }, { label: 'NAIC, adopted CLO factors for year-end 2026', href: 'https://content.naic.org/sites/default/files/inline-files/2026-12-ire.pdf', detail: 'LR002 pre-tax C-1 factors and the surcharge for the specified thin BSL CLO tranches.', kind: 'source' }],
      related: ['rbc'],
    },
  },
  {
    slug: 'rbc', sigle: 'RBC', nom: 'Risk-based capital',
    sectionTitle: 'Banking & balance-sheet management', accent: 'var(--color-topic-blue)', robots: 'noindex,follow',
    guide: '/en/guides/read-life-insurer-health/',
    def: 'A US prudential framework that assesses an insurer’s capital needs according to its risks. For life insurers, the calculation aggregates investment, underwriting, interest-rate and business risks, together with exposures to insurance affiliates, accounting for dependencies among them. The RBC ratio divides total adjusted capital by Authorized Control Level RBC, the denominator used for intervention thresholds. An asset risk factor is one input to this calculation.',
    atlas: {
      intuition: 'An asset risk factor enters a broader calculation, after which the capital ratio locates the insurer relative to intervention thresholds.',
      formula: 'RBC ratio = total adjusted capital / Authorized Control Level RBC',
      articles: [{"label": "Private credit: a new route to insurers", "href": "/en/analysis/private-credit-route-insurers-rated-feeders/", "detail": "Debt seniority, available cash flows and prudential treatment of rated feeders.", "kind": "article"}, { label: 'The regulatory price of a promise', href: '/en/analysis/insurers-asset-managers-06-risk-treatment/', kind: 'article' }],
      guides: [{ label: 'Reading a life insurer’s financial health', href: '/en/guides/read-life-insurer-health/', kind: 'guide' }],
      sources: [{ label: 'NAIC, Risk-Based Capital', href: 'https://content.naic.org/insurance-topics/risk-based-capital', detail: 'Risk categories, dependencies, diversification and the ratio of capital to ACL RBC.', kind: 'source' }, { label: 'NAIC, adopted CLO factors for year-end 2026', href: 'https://content.naic.org/sites/default/files/inline-files/2026-12-ire.pdf', detail: 'LR002 asset factors, portfolio adjustment and separate stages of the calculation.', kind: 'source' }],
      related: ['clo', 'reassurance-adossee-a-l-actif'],
    },
  },
  {
    slug: 'treasury-buyback', sigle: 'Treasury buyback', nom: 'Repurchase of outstanding US government debt',
    def: 'A purchase by the US Treasury of its own outstanding securities before maturity. The operation exchanges public cash for older debt, which is retired at settlement. Reading it requires separating the announced par limit, accepted principal, price and accrued interest, then examining the government’s financing.',
    sectionTitle: 'Macro & central banks', accent: 'var(--color-signal)', robots: 'index,follow',
    guide: '/en/guides/read-us-treasuries-market/',
    atlas: {
      articles: [{ label: 'Bessent and Treasury buybacks', href: '/en/analysis/bessent-yield-threshold-30-year-treasury/', kind: 'article' }],
      guides: [{ label: 'Read the US Treasury market', href: '/en/guides/read-us-treasuries-market/', kind: 'guide' }],
      sources: [{ label: 'TreasuryDirect: buyback announcements and results', href: 'https://www.treasurydirect.gov/auctions/buy-backs/', kind: 'source' }],
      related: ['adjudication', 'tga', 't-bill', 'duration'],
    },
  },
  {
    slug: 'alm', sigle: 'ALM', nom: 'Asset-liability management',
    sectionTitle: 'Banking & balance-sheet management', accent: 'var(--color-topic-blue)', robots: 'noindex,follow',
    def: 'Managing investments and obligations together. For an insurer, ALM aligns the amounts, timing, currencies and sensitivities of assets with promised policy benefits while planning for liquidity needs. Policyholder surrenders and other contractual options can change the expected cash flows.',
    guide: '/en/guides/read-life-insurer-health/',
    atlas: {
      intuition: 'An investment must help fund a future payment in the currency and at the time it falls due.',
      articles: [{ label: 'The strength of an insurer’s promise', href: '/en/analysis/insurers-asset-managers-08-promise/', kind: 'article' }, { label: 'Japanese savings and global borrowing costs', href: '/en/analysis/japan-savings-global-borrowing-costs/', detail: 'Reinvestment choices, currency hedges and liability schedules.', kind: 'article' }, { label: 'Who owes AT&T retirees their pensions?', href: '/en/analysis/when-pension-contracts-change-hands/', kind: 'article' }],
      guides: [{ label: 'Reading a life insurer’s financial health', href: '/en/guides/read-life-insurer-health/', kind: 'guide' }],
      sources: [{ label: 'Bank of Canada, liquidity risks at life insurers', href: 'https://www.bankofcanada.ca/2024/04/staff-analytical-note-2024-7/', detail: 'ALM, duration, currency risk, surrenders and liquidity needs.', kind: 'source' }],
      related: ['duration', 'couverture-de-change'],
    },
  },
  {
    slug: 'fonderie', sigle: 'Foundry', nom: 'Manufacturing integrated circuits for customers',
    ...macroSection, robots: 'noindex,follow',
    guide: '/en/analysis/tsmc-chip-demand-data-center-power-risk/',
    def: 'A company that manufactures integrated circuits designed by its customers. It produces chips on silicon wafers using the manufacturing technologies and capacity available at its factories.',
    atlas: {
      articles: [{ label: 'TSMC follows chip demand all the way to the power grid', href: '/en/analysis/tsmc-chip-demand-data-center-power-risk/', kind: 'article' }, {"label": "Helium: geopolitics beneath the wafer", "href": "/en/analysis/helium-geopolitics-beneath-the-wafer/", "kind": "article"}],
      sources: [{ label: 'TSMC, company profile', href: 'https://www.tsmc.com/english/aboutTSMC/company_profile', detail: 'The foundry model focused on customers’ products, manufacturing technologies and wafer capacity.', kind: 'source' }],
      related: ['capex', 'packaging-avance'],
    },
  },
  {
    slug: 'capex', sigle: 'Capex', nom: 'Capital expenditure',
    sectionTitle: 'Private credit & markets', accent: 'var(--color-accent)', robots: 'noindex,follow',
    guide: '/en/analysis/tsmc-chip-demand-data-center-power-risk/',
    def: 'Expenditure to acquire, build or improve long-lived assets such as factories and equipment. The scope of a reported measure needs to be checked: cash investment, assets obtained through leases and future commitments may be disclosed separately. An announced budget describes planned spending; actual expenditure is measured over a specified period.',
    atlas: {
      articles: [{ label: 'TSMC follows chip demand all the way to the power grid', href: '/en/analysis/tsmc-chip-demand-data-center-power-risk/', kind: 'article' }, { label: 'Nebius: a 364-day Citi facility for GPU expansion', href: '/en/analysis/nebius-citi-364-day-gpu-credit/', detail: 'Cash capital expenditure and funding construction.', kind: 'article' }, {"label": "GM, VAC and financing the Sumter magnet factory", "href": "/en/analysis/us-rare-earth-magnets-gm-vac-offtake-risk/", "kind": "article"}],
      sources: [
        { label: 'SEC, guide to financial statements', href: 'https://www.sec.gov/about/reports-publications/investorpubsbegfinstmtguide', detail: 'Cash flow statements: purchases of long-term assets and cash investment.', kind: 'source' },
        { label: 'Microsoft, fiscal 2026 fourth-quarter results', href: 'https://www.microsoft.com/en-us/investor/events/fy-2026/earnings-fy-2026-q4', detail: 'July 29 call: distinction between capex, finance leases and cash paid for property, plant and equipment; investment outlook.', kind: 'source' },
      ],
      related: ['fonderie', 'actif-echoue', "credit-d-impot-transferable"],
    },
  },
  {
    slug: 'trs', sigle: 'TRS', nom: 'Total return swap',
    sectionTitle: 'Banking & balance-sheet management', accent: 'var(--color-topic-blue)', robots: 'noindex,follow',
    guide: '/en/analysis/barclays-private-credit-trs-risk/',
    def: 'A derivative that passes the total economic performance of a reference asset, including income, price movements and credit losses, to another party in return for a financing payment under the agreed terms. Economic exposure can move while legal ownership stays with the original holder. Protection depends on the promised payments being made.',
    atlas: {
      intuition: 'Passing on a loan’s return introduces another payment promise whose reliability needs to be assessed.',
      articles: [{ label: 'Barclays: private credit and TRS risk', href: '/en/analysis/barclays-private-credit-trs-risk/', kind: 'article' }, {"label": "Cum-cum: a dividend tax becomes a trading margin", "href": "/en/analysis/cum-cum-01-dividend-mechanism/", "kind": "article"}],
      guides: [{ label: 'Reading interest rate swaps', href: '/en/guides/read-interest-rate-swaps/', detail: 'Background on derivatives, clearing and margin; TRS cash flows cover the total return.', kind: 'guide' }],
      sources: [
        { label: 'ESMA, SFTR: TRS definition', href: 'https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/sftr/article-3-definitions', detail: 'Article 3(18): income, price movements and credit losses. The EU product definition.', kind: 'source' },
        { label: 'HMRC, total return swap mechanics', href: 'https://www.gov.uk/hmrc-internal-manuals/corporate-finance-manual/cfm13380', detail: 'CFM13380: return and financing cash flows, with the performance payment reversing when value falls. Historical rate example.', kind: 'source' },
      ],
      related: ['risque-de-contrepartie', 'ensemble-de-compensation', 'notionnel'],
    },
  },
  {
    slug: 'risque-de-contrepartie', sigle: 'Counterparty credit risk', nom: 'Default risk before a transaction’s final settlement',
    sectionTitle: 'Banking & balance-sheet management', accent: 'var(--color-topic-blue)', robots: 'noindex,follow',
    guide: '/en/analysis/barclays-private-credit-trs-risk/',
    def: 'The risk that a counterparty defaults before a transaction’s cash flows are finally settled. A loss can arise when the contracts have positive economic value to the other party at default. Exposure changes with market conditions; collateral and netting affect the remaining loss.',
    atlas: {
      intuition: 'A hedge provides protection to the extent that its counterparty pays or collateral supports recovery.',
      articles: [{ label: 'Barclays: private credit and TRS risk', href: '/en/analysis/barclays-private-credit-trs-risk/', kind: 'article' }],
      sources: [{ label: 'Basel Committee, CRE50: counterparty credit risk', href: 'https://www.bis.org/committees/bcbs/basel-framework/standard/cre/50/inforce/2019-12-15/published/2024-07-05', detail: 'Paragraph 50.1: default before settlement and positive economic value. An international standard, distinct from national implementation.', kind: 'source' }],
      related: ['trs', 'ensemble-de-compensation', 'appel-de-marge'],
    },
  },
  {
    slug: 'ensemble-de-compensation', sigle: 'Netting set', nom: 'Transactions covered by recognised bilateral netting',
    sectionTitle: 'Banking & balance-sheet management', accent: 'var(--color-topic-blue)', robots: 'noindex,follow',
    guide: '/en/analysis/barclays-private-credit-trs-risk/',
    def: 'Under the Basel framework, transactions with a single counterparty covered by a legally enforceable bilateral netting agreement recognised for regulatory capital purposes. A trade without such recognition forms its own set. Opposing contracts with different counterparties belong to separate sets.',
    atlas: {
      intuition: 'Matching economic exposures does not bring different counterparties within the same bilateral agreement.',
      articles: [{ label: 'Barclays: private credit and TRS risk', href: '/en/analysis/barclays-private-credit-trs-risk/', kind: 'article' }],
      sources: [{ label: 'Basel Committee, CRE50: netting set', href: 'https://www.bis.org/committees/bcbs/basel-framework/standard/cre/50/inforce/2019-12-15/published/2024-07-05', detail: 'Paragraph 50.15: one counterparty, enforceable bilateral netting and regulatory recognition; a standalone trade where no recognised agreement applies.', kind: 'source' }],
      related: ['trs', 'risque-de-contrepartie', 'compensation-nette'],
    },
  },
  {
    slug: 'niveau-de-vie', sigle: 'Equivalised disposable income', nom: 'Household income adjusted for household composition',
    def: 'Household disposable income divided by an equivalence factor that accounts for household size and composition. The modified OECD scale assigns one unit to the first adult, half a unit to each other person aged fourteen or over, and three tenths to younger children. Every member of a household is assigned the same statistical living standard.',
    guide: '/en/analysis/france-2027-budget-distribution-economic-risk/', ...macroSection, robots: 'noindex,follow',
    atlas: {
      intuition: 'Comparing households of different sizes requires adjusting income for shared needs.',
      formula: 'equivalised income = household disposable income / equivalence factor',
      articles: [{ label: 'France’s 2027 budget: households and economic transmission', href: '/en/analysis/france-2027-budget-distribution-economic-risk/', kind: 'article' }],
      sources: [{ label: 'INSEE, standard of living definition', href: 'https://www.insee.fr/fr/metadonnees/definition/c1890', detail: 'Disposable income, consumption units and the modified OECD scale. French-language source.', kind: 'source' }],
      related: ['propension-marginale-a-consommer'],
    },
  },
  {
    slug: 'propension-marginale-a-consommer', sigle: 'Marginal propensity to consume', nom: 'Consumption response to an income change',
    def: 'The share of a change in disposable income reflected in a change in consumption over a specified horizon. Its measurement depends on the type of shock, how far it was anticipated, and the household’s liquid resources. Total consumption divided by total income instead measures the average propensity to consume.',
    guide: '/en/analysis/france-2027-budget-distribution-economic-risk/', ...macroSection, robots: 'noindex,follow',
    atlas: {
      intuition: 'Households can absorb an income change through spending, saving or their liquid buffers.',
      formula: 'MPC = change in consumption / change in disposable income',
      articles: [{ label: 'France’s 2027 budget: households and economic transmission', href: '/en/analysis/france-2027-budget-distribution-economic-risk/', kind: 'article' }],
      sources: [
        { label: 'ECB, from mortgage rates to consumption', href: 'https://www.ecb.europa.eu/press/economic-bulletin/articles/2025/html/ecb.ebart202504_01~b621c01098.en.html', detail: 'Section 4 and footnote 10: estimates by income group and transmission assumptions.', kind: 'source' },
        { label: 'OeNB, MPC heterogeneity', href: 'https://www.oenb.at/dam/jcr:dab57322-375a-49e8-8ae5-441abe2ca52d/wp-254.pdf', detail: 'Working Paper 254, sections 2 and 3: methods and reported responses to a hypothetical temporary windfall.', kind: 'source' },
      ],
      related: ['niveau-de-vie', 'multiplicateur-budgetaire'],
    },
  },
  {
    slug: 'multiplicateur-budgetaire', sigle: 'Fiscal multiplier', nom: 'Output response to a fiscal policy measure',
    def: 'The change in GDP attributed to a discretionary fiscal measure divided by the change in public spending or taxation that prompted it, relative to a baseline. The sign convention, horizon and calculation method must be specified. Its value depends on the policy instrument, economic conditions and the monetary policy setting, among other factors.',
    guide: '/en/analysis/france-2027-budget-distribution-economic-risk/', ...macroSection, robots: 'noindex,follow',
    atlas: {
      intuition: 'The output response depends on the measure’s composition and the adjustments it triggers.',
      articles: [{ label: 'France’s 2027 budget: households and economic transmission', href: '/en/analysis/france-2027-budget-distribution-economic-risk/', kind: 'article' }],
      sources: [
        { label: 'IMF, Fiscal Multipliers', href: 'https://www.imf.org/en/publications/tnm/issues/2016/12/31/fiscal-multipliers-size-determinants-and-use-in-macroeconomic-projections-41784', detail: 'Technical Note 14/04, introduction and Box 1: definitions, policy instruments and measurement horizons.', kind: 'source' },
        { label: 'French Treasury and OFCE, ThreeME and Mésange comparison', href: 'https://www.tresor.economie.gouv.fr/Articles/2026/07/09/comparaison-des-proprietes-des-modeles-macroeconomiques-francais-threeme-et-mesange', detail: 'Working Paper 2026/1, sections 2.2 and 2.3: public expenditure and VAT experiments. French-language source.', kind: 'source' },
      ],
      related: ['propension-marginale-a-consommer', 'pib', 'contrefactuel'],
    },
  },
  {
    slug: 'prix-de-revient-fiscal', sigle: 'Tax basis', nom: 'Cost used to calculate a taxable gain',
    def: 'The amount assigned to an asset or portfolio for tax purposes and deducted from disposal proceeds under the applicable rules to calculate a gain or loss. It tracks acquisitions, disposals and prescribed adjustments. Individual cost, weighted average cost and an allocated share of aggregate portfolio cost are methods whose scope must be established.',
    guide: '/en/analysis/france-stablecoin-tax-capital-gains/', ...cryptoSection, robots: 'noindex,follow',
    atlas: {
      intuition: 'Basis already deducted on a disposal must be tracked when calculating later gains.',
      whyNow: 'The investigation compares France’s current regime with a proposed change to cost calculations and carryover rules under amendment I-3898.',
      articles: [{ label: 'France’s stablecoin tax plan: gains and timing', href: '/en/analysis/france-stablecoin-tax-capital-gains/', kind: 'article' }],
      sources: [
        { label: 'French tax administration, crypto-asset capital gains tax base', href: 'https://bofip.impots.gouv.fr/bofip/11968-PGP.html/identifiant=BOI-RPPM-PVBMC-30-20-20190902', detail: 'Aggregate portfolio cost and basis previously deducted, paragraphs 1 and 70 to 110.', kind: 'source' },
        { label: 'National Assembly, amendment I-3898', href: 'https://www.assemblee-nationale.fr/dyn/17/amendements/3210A/AN/3898.pdf', detail: 'Asset-level cost, weighted averages and transition rules proposed in an adopted amendment; the legislative process remains ongoing.', kind: 'source' },
      ],
      related: ['imputation-des-moins-values', 'emt'],
    },
  },
  {
    slug: 'imputation-des-moins-values', sigle: 'Capital loss offsetting', nom: 'Using realised losses against taxable gains',
    def: 'Applying a realised capital loss to reduce gains covered by a tax regime. Its rules determine the eligible gains and the period in which the loss can be used. For privately managed crypto-assets in France, current tax guidance permits offsetting against gains of the same type within the same year, with no carryforward to later years.',
    guide: '/en/analysis/france-stablecoin-tax-capital-gains/', ...cryptoSection, robots: 'noindex,follow',
    atlas: {
      intuition: 'A loss’s tax use depends on when it is realised and which gains it can offset.',
      articles: [{ label: 'France’s stablecoin tax plan: gains and timing', href: '/en/analysis/france-stablecoin-tax-capital-gains/', kind: 'article' }],
      sources: [{ label: 'French tax administration, reporting digital-asset gains and losses', href: 'https://www.impots.gouv.fr/particulier/questions/comment-declarer-les-plus-ou-moins-values-sur-cessions-dactifs-numeriques', detail: 'Private-asset management: same-type gains in the same year and no loss carryforward; guidance updated 17 July 2026.', kind: 'source' }],
      related: ['prix-de-revient-fiscal'],
    },
  },
  {
    slug: 'emt', sigle: 'EMT', nom: 'E-money token',
    def: 'A cryptoasset intended to maintain a stable value by reference to one official currency. Under MiCA, holders have a claim against the issuer and a right to redemption at par. Issuers of significant tokens face additional requirements.',
    guide: '/en/analysis/usdc-reserves-follow-token-mica/', ...cryptoSection, robots: 'noindex,follow',
    atlas: {
      articles: [
        { label: 'USDC: reserves and rights under MiCA', href: '/en/analysis/usdc-reserves-follow-token-mica/', kind: 'article' },
        { label: 'France’s stablecoin tax plan: gains and timing', href: '/en/analysis/france-stablecoin-tax-capital-gains/', kind: 'article' },
      ],
      sources: [
        { label: 'MiCA, Article 3: definitions', href: 'https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/mica/article-3-definitions', detail: 'Point 7: reference to one official currency.', kind: 'source' },
        { label: 'MiCA, Article 49: issuance and redemption', href: 'https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/mica/article-49-issuance-and-redeemability-e', detail: 'Holder’s claim and redemption at par.', kind: 'source' },
        { label: 'MiCA, Article 58: additional obligations', href: 'https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/mica/article-58-specific-additional-obligations', detail: 'Enhanced requirements for issuers of significant tokens.', kind: 'source' },
      ],
      related: ['stablecoin', 'art', 'prix-de-revient-fiscal'],
    },
  },
  {
    slug: 'art', sigle: 'ART', nom: 'Asset-referenced token',
    def: 'A MiCA category of cryptoasset, distinct from an e-money token, that aims to keep a stable value by reference to a value, a right or a combination, potentially including one or more official currencies. The token’s reference and the composition of its reserve require separate examination.',
    guide: '/en/guides/decode-mica-crypto-regulation/', ...cryptoSection, robots: 'noindex,follow',
    atlas: {
      articles: [{ label: 'France’s stablecoin tax plan: gains and timing', href: '/en/analysis/france-stablecoin-tax-capital-gains/', kind: 'article' }],
      guides: [{ label: 'MiCA reference guide', href: '/en/guides/decode-mica-crypto-regulation/', kind: 'guide' }],
      sources: [{ label: 'MiCA, Article 3: definitions', href: 'https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/mica/article-3-definitions', detail: 'Point 6: reference to a value, a right or a combination.', kind: 'source' }],
      related: ['stablecoin', 'emt'],
    },
  },
  {
    slug: 'wash-trading', sigle: 'Wash trading', nom: 'Trading that creates apparent market activity',
    def: 'Transactions structured to resemble genuine buying and selling while neutralising market risk or price competition. Classification depends on intent and control of the accounts, among other evidence. An accidental match between independently placed orders or a flat ending position does not by itself establish manipulation; the applicable rules depend on the market and jurisdiction.',
    guide: '/en/analysis/fifa-predictstreet-trading-volume-risk/', sectionTitle: 'US regulation & institutions', accent: 'var(--color-topic-blue)', robots: 'noindex,follow',
    atlas: {
      articles: [{ label: 'FIFA and Predictstreet: trading volume and risk', href: '/en/analysis/fifa-predictstreet-trading-volume-risk/', kind: 'article' }],
      sources: [{ label: 'CME Group, Rule 534 and wash-trading FAQ', href: 'https://www.cmegroup.com/rulebook/files/cme-group-Rule-534.pdf', detail: 'Intent, common beneficial ownership, incidental matches and indirect trades; rules for CME Group markets.', kind: 'source' }],
      related: ['marche-predictif', 'teneur-de-marche'],
    },
  },
  {
    slug: 'slippage', sigle: 'Slippage', nom: 'Reference price versus execution price',
    def: 'The difference between a specified reference price and the price actually obtained, using an average if an order has several partial executions. Available quantities and price movements during order handling can affect it. The difference can favour or disadvantage the customer and is distinct from separately charged fees.',
    guide: '/en/analysis/fifa-predictstreet-trading-volume-risk/', sectionTitle: 'US regulation & institutions', accent: 'var(--color-topic-blue)', robots: 'noindex,follow',
    atlas: {
      articles: [{ label: 'FIFA and Predictstreet: trading volume and risk', href: '/en/analysis/fifa-predictstreet-trading-volume-risk/', kind: 'article' }],
      sources: [
        { label: 'SEC Investor.gov, executing an order', href: 'https://www.investor.gov/introduction-investing/investing-basics/how-stock-markets-work/executing-order', detail: 'Quoted prices, price movements and improvement or deterioration at execution.', kind: 'source' },
        { label: 'SEC Investor.gov, understanding order types', href: 'https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-14', detail: 'Parts of a large order can execute at different prices when quantities are limited.', kind: 'source' },
      ],
      related: ['profondeur-de-marche', 'teneur-de-marche', 'marche-predictif'],
    },
  },
  {
    slug: 'teneur-de-marche', sigle: 'Market maker', nom: 'An intermediary quoting buying and selling prices',
    def: 'An intermediary willing to trade for its own account at buying and selling prices it quotes. It uses its own capital and can hold inventory between trades. Quoted quantities and execution conditions matter: the presence of a market maker does not guarantee that an entire customer order can be filled at one price.',
    guide: '/en/guides/read-dealer-gamma/', sectionTitle: 'US regulation & institutions', accent: 'var(--color-topic-blue)', robots: 'noindex,follow',
    atlas: {
      articles: [{ label: 'FIFA and Predictstreet: trading volume and risk', href: '/en/analysis/fifa-predictstreet-trading-volume-risk/', kind: 'article' }],
      guides: [{ label: 'Reading dealer gamma', href: '/en/guides/read-dealer-gamma/', kind: 'guide' }],
      sources: [
        { label: 'MiFID II, Article 4: market-maker definition', href: 'https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/mifid-ii/article-4-definitions', detail: 'Dealing on own account against proprietary capital at quoted prices.', kind: 'source' },
        { label: 'SEC Investor.gov, executing an order', href: 'https://www.investor.gov/introduction-investing/investing-basics/how-stock-markets-work/executing-order', detail: 'Quoted prices, quantities and execution conditions.', kind: 'source' },
      ],
      related: ['profondeur-de-marche', 'slippage', 'marche-predictif'],
    },
  },
  {
    slug: 'notionnel', sigle: 'Notional amount', nom: 'The contractual size of a derivative',
    def: 'An amount describing a derivative’s contractual size. Depending on the product, it can be a principal that must be paid, a contingent payout or a reference for calculating cash flows. It differs from the contract’s market value and does not by itself measure the possible loss. Comparisons require the instrument and counting convention to be specified.',
    guide: '/en/guides/read-interest-rate-swaps/', sectionTitle: 'US regulation & institutions', accent: 'var(--color-topic-blue)', robots: 'noindex,follow',
    atlas: {
      articles: [{ label: 'FIFA and Predictstreet: volume conventions', href: '/en/analysis/fifa-predictstreet-trading-volume-risk/', kind: 'article' }],
      guides: [{ label: 'Reading interest-rate swaps', href: '/en/guides/read-interest-rate-swaps/', kind: 'guide' }],
      sources: [{ label: 'BIS, derivatives concepts and statistics, December 2025', href: 'https://www.bis.org/publications/qr-202512/international-finance-through-lens-bis-statistics-derivatives-markets', detail: 'Payable principal, contingent payout and calculation reference by product; distinction from market value.', kind: 'source' }],
      related: ['future', 'dv01', 'trs'],
    },
  },
  {
    slug: 'preuve-d-humanite', sigle: 'Proof of personhood', nom: 'Human uniqueness within an enrolment system',
    def: 'A mechanism intended to establish that a proof relates to a distinct human within a specified enrolment system. Its criteria and assurance level depend on the implementation. It does not by itself establish a civil identity, honest intent or authority to commit a bank account.',
    guide: '/en/analysis/world-id-banking-proof-of-human/', ...cryptoSection, robots: 'noindex,follow',
    atlas: {
      articles: [{ label: 'World ID and the power to certify humans', href: '/en/analysis/world-id-banking-proof-of-human/', kind: 'article' }],
      sources: [
        { label: 'World, Proof of Human', href: 'https://docs.world.org/world-id/credentials/1', detail: 'The supplier’s account of biometric humanity and uniqueness checks.', kind: 'source' },
        { label: 'NIST, Digital Identity Model', href: 'https://pages.nist.gov/800-63-4/sp800-63/model/', detail: 'Identity proofing, authentication and authorisation decisions have distinct roles.', kind: 'source' },
      ],
      related: ['zkp', 'calcul-multipartite'],
    },
  },
  {
    slug: 'zkp', sigle: 'ZKP', nom: 'Zero-knowledge proof',
    def: 'A cryptographic method for proving a specified statement without revealing the secret information used to establish it beyond what the statement itself discloses. Its assurance applies to the statement and protocol. It does not automatically validate a biometric measurement or give the holder authority to make a payment.',
    guide: '/en/analysis/world-id-banking-proof-of-human/', sectionTitle: 'Digital economy & data', accent: 'var(--color-signal)', robots: 'noindex,follow',
    atlas: {
      articles: [{ label: 'World ID and the power to certify humans', href: '/en/analysis/world-id-banking-proof-of-human/', kind: 'article' }],
      sources: [{ label: 'NIST CSRC, Zero-Knowledge Proof', href: 'https://csrc.nist.gov/glossary/term/zero_knowledge_proof', detail: 'Proving a statement without disclosing further information.', kind: 'source' }],
      related: ['preuve-d-humanite', 'calcul-multipartite'],
    },
  },
  {
    slug: 'calcul-multipartite', sigle: 'MPC', nom: 'Secure multiparty computation',
    def: 'Protocols that let several parties jointly compute a result from private data without giving one another their complete inputs. Confidentiality depends on the security model, including the compromised participants it tolerates. Distributing computation does not by itself establish that the operators are independent.',
    guide: '/en/analysis/world-id-banking-proof-of-human/', sectionTitle: 'Digital economy & data', accent: 'var(--color-signal)', robots: 'noindex,follow',
    atlas: {
      articles: [{ label: 'World ID and the power to certify humans', href: '/en/analysis/world-id-banking-proof-of-human/', kind: 'article' }],
      sources: [{ label: 'NIST, Multiparty Computation and Threshold Schemes', href: 'https://csrc.nist.gov/Projects/pec/threshold', detail: 'Joint computation over private inputs, under the protocol’s assumptions.', kind: 'source' }],
      related: ['preuve-d-humanite', 'zkp'],
    },
  },
  {
    slug: 'credit-renouvelable', sigle: 'Revolving credit facility', nom: 'Reusable borrowing capacity',
    def: 'A facility allowing a borrower to draw funds, repay them and borrow again during an agreed period, subject to the contract’s limits and conditions. It can fund the interval between production spending and customer receipts. The committed limit differs from the amount drawn and from cash available to spend.',
    guide: '/en/analysis/jpmorgan-industrial-power-investment/', sectionTitle: 'Banking & balance-sheet management', accent: 'var(--color-topic-blue)', robots: 'noindex,follow',
    atlas: {
      articles: [{ label: 'JPMorgan and the cost of industrial power', href: '/en/analysis/jpmorgan-industrial-power-investment/', kind: 'article' }, {"label": "GM, VAC and financing the Sumter magnet factory", "href": "/en/analysis/us-rare-earth-magnets-gm-vac-offtake-risk/", "kind": "article"}],
      sources: [{ label: 'OCC, Asset-Based Lending, printed page 3', href: 'https://www.occ.gov/publications-and-resources/publications/comptrollers-handbook/files/asset-based-lending/pub-ch-asset-based-lending.pdf', detail: 'Draws, repayments, reborrowing and the conditions for continued availability.', kind: 'source' }],
      related: ['bfr', 'borrowing-base', 'pret-senior-garanti'],
    },
  },
  {
    slug: 'pret-senior-garanti', sigle: 'Senior secured loan', nom: 'Asset-backed lending with a senior claim',
    def: 'A loan backed by security interests in assets and ranking ahead of specified other claims. The agreement and applicable law determine its priority and enforcement rights. These protections do not ensure full repayment or automatically make a government responsible for losses.',
    guide: '/en/analysis/jpmorgan-industrial-power-investment/', sectionTitle: 'Banking & balance-sheet management', accent: 'var(--color-topic-blue)', robots: 'noindex,follow',
    atlas: {
      articles: [{ label: 'JPMorgan and the cost of industrial power', href: '/en/analysis/jpmorgan-industrial-power-investment/', kind: 'article' }, {"label": "GM, VAC and financing the Sumter magnet factory", "href": "/en/analysis/us-rare-earth-magnets-gm-vac-offtake-risk/", "kind": "article"}],
      sources: [{ label: 'SEC Investor.gov, creditor priority and collateral', href: 'https://www.investor.gov/introduction-investing/investing-basics/investment-products/bonds-or-fixed-income-products', detail: 'The distinct roles of collateral rights and claim seniority.', kind: 'source' }],
      related: ['collateral', 'garantie-de-pret', 'credit-renouvelable'],
    },
  },
{
  "slug": "nand",
  "sigle": "NAND",
  "nom": "NAND flash memory",
  "def": "A family of flash memory that retains stored data when power is removed. It provides storage in many SSDs. Three-dimensional NAND arranges memory cells in stacked layers; its storage role differs from the working memory supplied by HBM.",
  "guide": "/en/analysis/sk-hynix-dalian-usine-americaine-financement/",
  "sectionTitle": "Macro & central banks",
  "accent": "var(--color-signal)",
  "robots": "noindex,follow",
  "atlas": {
    "articles": [
      {
        "label": "SK hynix: Dalian and funding a US memory factory",
        "href": "/en/analysis/sk-hynix-dalian-usine-americaine-financement/",
        "kind": "article"
      }
    ],
    "sources": [
      {
        "label": "Solidigm, D7-P5510 product brief",
        "href": "https://www.solidigm.com/products/data-center/product-briefs/dc-p5510.html",
        "detail": "NAND memory, controller and firmware in a data-centre SSD.",
        "kind": "source"
      }
    ],
    "related": [
      "ssd",
      "hbm",
      "packaging-avance"
    ]
  }
},
{
  "slug": "ssd",
  "sigle": "SSD",
  "nom": "Solid-state drive",
  "def": "An electronic storage device combining non-volatile memory, usually NAND, with a controller and firmware that manage data and communication with the host system. NAND chips provide the storage medium; the complete drive also supplies these control functions.",
  "guide": "/en/analysis/sk-hynix-dalian-usine-americaine-financement/",
  "sectionTitle": "Macro & central banks",
  "accent": "var(--color-signal)",
  "robots": "noindex,follow",
  "atlas": {
    "articles": [
      {
        "label": "SK hynix: Dalian and funding a US memory factory",
        "href": "/en/analysis/sk-hynix-dalian-usine-americaine-financement/",
        "kind": "article"
      }
    ],
    "sources": [
      {
        "label": "Solidigm, D7-P5510 product brief",
        "href": "https://www.solidigm.com/products/data-center/product-briefs/dc-p5510.html",
        "detail": "NAND memory, controller and firmware in a data-centre SSD.",
        "kind": "source"
      }
    ],
    "related": [
      "nand",
      "hbm",
      "packaging-avance"
    ]
  }
},
{
  "slug": "hbm",
  "sigle": "HBM",
  "nom": "High Bandwidth Memory",
  "def": "Stacked DRAM connected through a wide interface to deliver data at high bandwidth, commonly to computing accelerators. Fabricating the memory chips and assembling and testing the finished package are separate production stages that can take place in different locations.",
  "guide": "/en/analysis/sk-hynix-dalian-usine-americaine-financement/",
  "sectionTitle": "Macro & central banks",
  "accent": "var(--color-signal)",
  "robots": "noindex,follow",
  "atlas": {
    "articles": [
      {
        "label": "SK hynix: Dalian and funding a US memory factory",
        "href": "/en/analysis/sk-hynix-dalian-usine-americaine-financement/",
        "kind": "article"
      }
    ],
    "sources": [
      {
        "label": "SK hynix, HBM production between Korea and Indiana",
        "href": "https://news.skhynix.com/en/groundbreaking-ceremony-in-indiana/",
        "detail": "Advanced packaging, testing and wafers produced in Korea.",
        "kind": "source"
      }
    ],
    "related": [
      "nand",
      "ssd",
      "packaging-avance"
    ]
  }
},
{
  "slug": "packaging-avance",
  "sigle": "Advanced packaging",
  "nom": "Connecting and assembling semiconductor chips",
  "def": "Assembly technologies that combine or vertically stack multiple chips and interconnections within a package. They help connect processors and memory. An advanced packaging and test facility performs a different production stage from a plant that fabricates circuits on silicon wafers.",
  "guide": "/en/analysis/sk-hynix-dalian-usine-americaine-financement/",
  "sectionTitle": "Macro & central banks",
  "accent": "var(--color-signal)",
  "robots": "noindex,follow",
  "atlas": {
    "articles": [
      {
        "label": "SK hynix: Dalian and funding a US memory factory",
        "href": "/en/analysis/sk-hynix-dalian-usine-americaine-financement/",
        "kind": "article"
      }
    ],
    "sources": [
      {
        "label": "SK hynix, HBM production between Korea and Indiana",
        "href": "https://news.skhynix.com/en/groundbreaking-ceremony-in-indiana/",
        "detail": "Advanced packaging, testing and wafers produced in Korea.",
        "kind": "source"
      }
    ],
    "related": [
      "nand",
      "ssd",
      "hbm",
      "fonderie"
    ]
  }
},
{
  "slug": "rto",
  "sigle": "RTO",
  "nom": "Recovery Time Objective",
  "def": "The maximum time an IT resource is intended to remain unavailable before the impact on other resources or business processes becomes unacceptable. This planning target normally leaves room within tolerable business downtime for necessary data reprocessing. An achieved recovery time depends on the scope and scenario of the test.",
  "guide": "/en/analysis/after-cyberattack-08-faster-recovery-cost/",
  "sectionTitle": "Digital economy & data",
  "accent": "var(--color-signal)",
  "robots": "noindex,follow",
  "atlas": {
    "articles": [
      {
        "label": "The cost of a faster recovery",
        "href": "/en/analysis/after-cyberattack-08-faster-recovery-cost/",
        "kind": "article"
      },
      {
        "label": "Google Cloud: the London outage and banking services",
        "href": "/en/analysis/google-cloud-banks-london-power-control-failure/",
        "detail": "Separating a recovery target from the observed restoration milestones.",
        "kind": "article"
      }
    ],
    "sources": [
      {
        "label": "NIST SP 800-34 Rev. 1, May 2010, updated November 2010",
        "href": "https://nvlpubs.nist.gov/nistpubs/legacy/sp/nistspecialpublication800-34r1.pdf",
        "detail": "Section 3.2.1, printed pages 17–18: definitions and the relationship between recovery targets and tolerable downtime.",
        "kind": "source"
      }
    ],
    "related": [
      "rpo-reprise",
      "mtd"
    ]
  }
},
{
  "slug": "rpo-reprise",
  "sigle": "RPO (recovery)",
  "nom": "Recovery Point Objective",
  "def": "The point in the past to which business-process data should be recoverable after an outage, given the available backups. It defines the maximum acceptable data loss, usually expressed as a duration. Meeting this target requires testing; restored data may still need reconciliation with records created during manual workarounds.",
  "guide": "/en/analysis/after-cyberattack-08-faster-recovery-cost/",
  "sectionTitle": "Digital economy & data",
  "accent": "var(--color-signal)",
  "robots": "noindex,follow",
  "atlas": {
    "articles": [
      {
        "label": "The cost of a faster recovery",
        "href": "/en/analysis/after-cyberattack-08-faster-recovery-cost/",
        "kind": "article"
      },
      {
        "label": "Google Cloud: the London outage and banking services",
        "href": "/en/analysis/google-cloud-banks-london-power-control-failure/",
        "detail": "Distinguishing recovery time from acceptable data loss.",
        "kind": "article"
      }
    ],
    "sources": [
      {
        "label": "NIST SP 800-34 Rev. 1, May 2010, updated November 2010",
        "href": "https://nvlpubs.nist.gov/nistpubs/legacy/sp/nistspecialpublication800-34r1.pdf",
        "detail": "Section 3.2.1, printed pages 17–18: definitions and the relationship between recovery targets and tolerable downtime.",
        "kind": "source"
      }
    ],
    "related": [
      "rto",
      "mtd"
    ]
  }
},
{
  "slug": "mtd",
  "sigle": "MTD",
  "nom": "Maximum Tolerable Downtime",
  "def": "The total outage or disruption a responsible owner is willing to accept for a business process, taking all relevant impacts into account. IT resource recovery and necessary data reprocessing must fit within this period. It is a business-specific impact tolerance, rather than a recovery duration already demonstrated by a test.",
  "guide": "/en/analysis/after-cyberattack-08-faster-recovery-cost/",
  "sectionTitle": "Digital economy & data",
  "accent": "var(--color-signal)",
  "robots": "noindex,follow",
  "atlas": {
    "articles": [
      {
        "label": "The cost of a faster recovery",
        "href": "/en/analysis/after-cyberattack-08-faster-recovery-cost/",
        "kind": "article"
      }
    ],
    "sources": [
      {
        "label": "NIST SP 800-34 Rev. 1, May 2010, updated November 2010",
        "href": "https://nvlpubs.nist.gov/nistpubs/legacy/sp/nistspecialpublication800-34r1.pdf",
        "detail": "Section 3.2.1, printed pages 17–18: definitions and the relationship between recovery targets and tolerable downtime.",
        "kind": "source"
      }
    ],
    "related": [
      "rto",
      "rpo-reprise"
    ]
  }
},
  {
  "slug": "garantie-de-pret",
  "sigle": "Loan guarantee",
  "nom": "A guarantor’s commitment to lenders",
  "def": "A guarantor’s commitment to lenders covering a loan’s default risk within the contract’s scope. Banks advance funds when the borrower draws the loan, and the borrower remains liable for repayment. The guarantor’s payment depends on the claim conditions. A public guarantee creates a contingent commitment, with any cash payment subject to its terms.",
  "guide": "/en/analysis/after-cyberattack-07-public-crisis-financing/",
  "sectionTitle": "Banking & balance-sheet management",
  "accent": "var(--color-topic-blue)",
  "robots": "noindex,follow",
  "atlas": {
    "intuition": "Lenders advance the money, the borrower owes repayment and the guarantor steps in under the contract’s conditions.",
    "articles": [
      {
        "label": "Public financing after the JLR cyberattack",
        "href": "/en/analysis/after-cyberattack-07-public-crisis-financing/",
        "kind": "article"
      }
    ],
    "sources": [
      {
        "label": "UKEF, Export Development Guarantee",
        "href": "https://www.gov.uk/guidance/export-development-guarantee",
        "detail": "Overview and Cost: commercial credit, risk sharing and premium.",
        "kind": "source"
      },
      {
        "label": "Peter Kyle, letter of 13 October 2025",
        "href": "https://committees.parliament.uk/publications/49980/documents/269099/default/",
        "detail": "Page 1, paragraphs 1a–b; page 3: loan, guarantee and public commitment are distinct.",
        "kind": "source"
      }
    ],
    "related": [
      "pret-relais",
      "responsabilite-maximale"
    ]
  }
},
  {
  "slug": "responsabilite-maximale",
  "sigle": "Maximum liability",
  "nom": "UKEF exposure measure including interest",
  "def": "In UKEF’s glossary, the maximum amount of claims payable under a particular product, including interest. UKEF uses it to measure exposure before cover is issued. It differs from loan principal, the amount drawn and a realised loss. Linking a published entry to a particular facility requires checking the contract and transaction references.",
  "guide": "/en/analysis/after-cyberattack-07-public-crisis-financing/",
  "sectionTitle": "Banking & balance-sheet management",
  "accent": "var(--color-topic-blue)",
  "robots": "noindex,follow",
  "atlas": {
    "intuition": "A published ceiling can include interest. The contract is needed to connect that scope to a particular facility.",
    "articles": [
      {
        "label": "Public financing after the JLR cyberattack",
        "href": "/en/analysis/after-cyberattack-07-public-crisis-financing/",
        "kind": "article"
      }
    ],
    "sources": [
      {
        "label": "UKEF, 2025/26 glossary, Maximum liability",
        "href": "https://www.gov.uk/government/publications/uk-export-finance-annual-report-and-accounts-2025-to-2026/glossary-of-terms",
        "detail": "Maximum liability, Claims and Amount at risk entries: definition and distinct scopes.",
        "kind": "source"
      },
      {
        "label": "UKEF, Business supported 2025 to 2026",
        "href": "https://www.gov.uk/government/publications/uk-export-finance-business-supported-2025-to-2026/business-supported-2025-to-2026",
        "detail": "Table 1, Maximum liability column: the JLR entries provide neither a contract identifier nor a drawn balance.",
        "kind": "source"
      }
    ],
    "related": [
      "garantie-de-pret",
      "pret-relais"
    ]
  }
},
  {
  "slug": "dependance-commune",
  "sigle": "Shared dependency",
  "nom": "Several services relying on the same resource",
  "def": "A situation in which several functions or organisations rely on the same provider, service or technical infrastructure. Separate supplier contracts can also converge on shared infrastructure through subcontracting. Its interruption may affect multiple customers at once. The risk depends on the importance of the supported functions and the recovery or substitution options available.",
  "guide": "/en/analysis/after-cyberattack-06-shared-provider/",
  "robots": "noindex,follow",
  "sectionTitle": "Digital economy & data",
  "accent": "var(--color-signal)",
  "atlas": {
    "intuition": "Several contracts can lead to the same infrastructure.",
    "articles": [
      {
        "label": "A shared provider draws its clients into the same disruption",
        "href": "/en/analysis/after-cyberattack-06-shared-provider/",
        "kind": "article"
      }
    ],
    "sources": [
      {
        "label": "FSB, third-party risk toolkit",
        "href": "https://www.fsb.org/wp-content/uploads/P041223-1.pdf",
        "detail": "Sections 3.5, 3.8 and 4.3: concentration, indirect dependencies and substitutability.",
        "kind": "source"
      },
      {
        "label": "NCSC, Mapping your supply chain",
        "href": "https://www.ncsc.gov.uk/guidance/mapping-your-supply-chain",
        "kind": "source"
      }
    ],
    "related": [
      "disponibilite-de-service",
      "reversibilite",
      "portabilite"
    ]
  }
},
  {
  "slug": "dms",
  "sigle": "DMS",
  "nom": "Dealer management system",
  "def": "A system used by an automotive dealership to connect functions including sales, service, inventory, customer relationships and accounting. Its scope depends on the software and its integrations. Asbury and AutoNation’s disclosures following the 2024 CDK incident show that the core system and its ancillary applications can return at different times.",
  "guide": "/en/analysis/after-cyberattack-06-shared-provider/",
  "robots": "noindex,follow",
  "sectionTitle": "Digital economy & data",
  "accent": "var(--color-signal)",
  "atlas": {
    "intuition": "A sale connects a vehicle, its record and the accounts.",
    "articles": [
      {
        "label": "A shared provider draws its clients into the same disruption",
        "href": "/en/analysis/after-cyberattack-06-shared-provider/",
        "kind": "article"
      }
    ],
    "sources": [
      {
        "label": "Asbury, Q2 2024 Form 10-Q",
        "href": "https://www.sec.gov/Archives/edgar/data/1144980/000114498024000130/abg-20240630.htm",
        "kind": "source"
      },
      {
        "label": "AutoNation, Q2 2024 Form 10-Q",
        "href": "https://www.sec.gov/Archives/edgar/data/350698/000035069824000098/an-20240630.htm",
        "kind": "source"
      }
    ],
    "related": [
      "dependance-commune",
      "disponibilite-de-service"
    ]
  }
},
  {
  "slug": "mvo",
  "sigle": "MVO",
  "nom": "Minimum viable operations",
  "def": "The lowest operational capability that, in NCSC guidance, allows an organisation to operate safely, meet its legal and regulatory obligations and maintain the trust of customers, partners and staff. During recovery from a cyberattack, this priority helps identify the functions and dependencies to restore. It is a recovery milestone whose scope depends on the organisation.",
  "guide": "/en/analysis/after-cyberattack-05-economics-of-recovery/",
  "robots": "noindex,follow",
  "sectionTitle": "Digital economy & data",
  "accent": "var(--color-signal)",
  "atlas": {
    "intuition": "Restoring priority functions requires checking their dependencies.",
    "articles": [
      {
        "label": "After the cyberattack: the long road back to service",
        "href": "/en/analysis/after-cyberattack-05-economics-of-recovery/",
        "kind": "article"
      }
    ],
    "sources": [
      {
        "label": "NCSC, Recovery and ongoing investigations",
        "href": "https://www.ncsc.gov.uk/collection/disruptive-cyber-attacks/recovering/2-recovery-ongoing-investigations",
        "detail": "Section 2.1: definition and selection of minimum viable operations.",
        "kind": "source"
      }
    ],
    "related": [
      "disponibilite-de-service",
      "retainer"
    ]
  }
},
  {
  "slug": "retainer",
  "sigle": "Retainer",
  "nom": "Incident response retainer",
  "def": "An agreement arranged before a crisis to give access to specialists on agreed terms. In the public NCC offering examined here, the annual availability fee is separate from prepaid response time; additional work follows the contractual terms. Commitments define access and the initial response. Restoring a usable service still depends on the work required.",
  "guide": "/en/analysis/after-cyberattack-05-economics-of-recovery/",
  "robots": "noindex,follow",
  "sectionTitle": "Digital economy & data",
  "accent": "var(--color-signal)",
  "atlas": {
    "intuition": "Reserving response capacity and completing a rebuild are separate commitments.",
    "articles": [
      {
        "label": "After the cyberattack: the long road back to service",
        "href": "/en/analysis/after-cyberattack-05-economics-of-recovery/",
        "kind": "article"
      }
    ],
    "sources": [
      {
        "label": "NCC, retained incident response terms",
        "href": "https://assets.applytosupply.digitalmarketplace.service.gov.uk/g-cloud-14/documents/716961/929698583726031-terms-and-conditions-2024-05-07-0015.pdf",
        "detail": "Retained Incident Response module, definitions, clauses 5.9 and 8.1–8.6, Appendix 1.",
        "kind": "source"
      },
      {
        "label": "NCC, G-Cloud 14 pricing",
        "href": "https://assets.applytosupply.digitalmarketplace.service.gov.uk/g-cloud-14/documents/716961/929698583726031-pricing-document-2024-05-07-0128.pdf",
        "detail": "Pages 2–3: annual fees, prepaid days and pricing conditions.",
        "kind": "source"
      }
    ],
    "related": [
      "disponibilite-de-service",
      "mvo"
    ]
  }
},
  {
  "slug": "valeur-ajoutee",
  "robots": "noindex,follow",
  "sigle": "Value added",
  "nom": "Output less intermediate consumption",
  "def": "The value of an activity’s output less the goods and services consumed in producing it. Gross value added retains consumption of fixed capital. GDP is the sum of resident producers’ gross value added, plus taxes on products less subsidies on products. Adding turnover across a supply chain also counts purchases between its stages.",
  "guide": "/en/analysis/after-cyberattack-04-jlr-gdp-footprint/",
  "sectionTitle": "Macro & central banks",
  "accent": "var(--color-signal)",
  "atlas": {
    "articles": [
      {
        "label": "JLR: a cyberattack’s footprint in GDP",
        "href": "/en/analysis/after-cyberattack-04-jlr-gdp-footprint/",
        "kind": "article"
      }
    ],
    "sources": [
      {
        "label": "ONS, national accounts",
        "href": "https://www.ons.gov.uk/economy/nationalaccounts/uksectoraccounts/methodologies/aguidetotheuknationalaccountsmarch2020",
        "kind": "source"
      },
      {
        "label": "ONS, trading margins and value added",
        "href": "https://www.ons.gov.uk/economy/grossdomesticproductgdp/articles/bluebook2024advancedaggregateestimates/2024-08-07",
        "kind": "source"
      }
    ],
    "related": [
      "pib",
      "effet-de-base"
    ]
  }
},
  {
  "slug": "effet-de-base",
  "robots": "noindex,follow",
  "sigle": "Base effect",
  "nom": "The starting level’s influence on a percentage change",
  "def": "The influence of the starting level on a percentage change. For an identical final level, a lower comparison base produces a higher growth rate. A rebound measured against a disrupted period describes the rate of activity; establishing whether delayed production was made up also requires cumulative volumes and order data.",
  "guide": "/en/analysis/after-cyberattack-04-jlr-gdp-footprint/",
  "sectionTitle": "Macro & central banks",
  "accent": "var(--color-signal)",
  "atlas": {
    "articles": [
      {
        "label": "JLR: a cyberattack’s footprint in GDP",
        "href": "/en/analysis/after-cyberattack-04-jlr-gdp-footprint/",
        "kind": "article"
      }
    ],
    "sources": [
      {
        "label": "ONS, March 2026 GDP, automotive base effect",
        "href": "https://www.ons.gov.uk/economy/grossdomesticproductgdp/bulletins/gdpmonthlyestimateuk/march2026",
        "kind": "source"
      }
    ],
    "related": [
      "pib",
      "valeur-ajoutee"
    ]
  }
},

  {
      "slug": "pertes-d-exploitation-dependantes",
      "sigle": "Dependent business interruption",
      "nom": "Cover for business interruption caused by a third party",
      "def": "Cover for specified business interruption losses caused by an outage at a third party defined in the policy. Eligible parties may include suppliers or service providers; reduced purchasing by a customer requires suitable cover. The policy sets the triggering event, eligible counterparties, time provisions and limits.",
      "guide": "/en/analysis/after-cyberattack-03-insurance-customer-disruption/",
      "sectionTitle": "Macro & central banks",
      "accent": "var(--color-signal)",
      "robots": "noindex,follow",
      "atlas": {
          "intuition": "The trading relationship identifies the third party’s role; the policy then determines eligible losses.",
          "articles": [
              {
                  "label": "Cyber insurance: an outage at a customer",
                  "href": "/en/analysis/after-cyberattack-03-insurance-customer-disruption/",
                  "detail": "Trading relationships, scope of cover and claim settlement.",
                  "kind": "article"
              }
          ],
          "sources": [
              {
                  "label": "Beazley, cyber policy guidance",
                  "href": "https://www.beazley.com/en-001/cyber-customer-centre/cyber-risk-management-tools/cyber-business-interruption/policy-wording/",
                  "detail": "Dependent Business Interruption Loss: supplier and customer examples within this published guidance.",
                  "kind": "source"
              },
              {
                  "label": "Hiscox, 04/23 specimen",
                  "href": "https://www.hiscox.co.uk/sites/default/files/documents/2023-05/19029%20WD-PIP-UK-CCLEAR(5).pdf",
                  "detail": "Definitions, pages 3–6; cover and payment provisions, pages 7–8 and 15.",
                  "kind": "source"
              },
              {
                  "label": "CFC, 8 January 2026",
                  "href": "https://www.cfc.com/en-gb/knowledge/resources/articles/2026/01/cyber-coverage-highlights-customer-business-interruption/",
                  "detail": "Commercial description of a named-customer extension, with an agreed aggregate limit per customer.",
                  "kind": "source"
              }
          ],
          "related": [
              "franchise-temporelle",
              "bfr"
          ]
      }
  },
  {
      "slug": "franchise-temporelle",
      "sigle": "Time excess",
      "nom": "A period of loss retained by the insured",
      "def": "A policy-defined period during which specified losses remain with the insured. Under the income-loss option in Hiscox’s 04/23 specimen, losses and expenses incurred during the time excess are excluded. The schedule sets its duration. A time excess is distinct from a monetary excess.",
      "guide": "/en/analysis/after-cyberattack-03-insurance-customer-disruption/",
      "sectionTitle": "Macro & central banks",
      "accent": "var(--color-signal)",
      "robots": "noindex,follow",
      "atlas": {
          "intuition": "The covered loss period and the insurer’s payment date answer different questions.",
          "articles": [
              {
                  "label": "Cyber insurance: an outage at a customer",
                  "href": "/en/analysis/after-cyberattack-03-insurance-customer-disruption/",
                  "detail": "Trading relationships, scope of cover and claim settlement.",
                  "kind": "article"
              }
          ],
          "sources": [
              {
                  "label": "Hiscox, 04/23 specimen",
                  "href": "https://www.hiscox.co.uk/sites/default/files/documents/2023-05/19029%20WD-PIP-UK-CCLEAR(5).pdf",
                  "detail": "Page 6: Time excess and Waiting period definitions. Page 15: income-loss option and exclusion of losses during the time excess.",
                  "kind": "source"
              }
          ],
          "related": [
              "pertes-d-exploitation-dependantes",
              "bfr"
          ]
      }
  },
  {
    slug: 'bfr',
    sigle: 'BFR',
    nom: 'Operating working capital requirement',
    def: 'Funding tied up in operating inventories and receivables after deducting trade payables and other operating funding. Payment timing and inventory turnover can create cash needs even in a profitable business. BFR is the French abbreviation for this operating funding requirement.',
    guide: '/en/analysis/ghana-cocoa-financing-cash-crisis/',
    ...privateCreditSection,
    robots: 'noindex,follow',
    atlas: {
      intuition: 'Restarting production can absorb cash before the corresponding sales bring receipts.',
      articles: [
        {"label": "Iron ore: the price of waiting", "href": "/en/analysis/iron-ore-price-of-waiting-fortescue-cmrg/", "detail": "Funding ore held in inventory between extraction, sale and customer receipts.", "kind": "article"},
        { label: 'JPMorgan and the cost of industrial power', href: '/en/analysis/jpmorgan-industrial-power-investment/', detail: 'Funding production before receipts and carrying delayed deliveries.', kind: 'article' },
        { label: 'JLR: when the factory stops', href: '/en/analysis/after-cyberattack-1-jlr-factories-cash-flow/', detail: 'Inventory, trade payables and funding needs during the recovery.', kind: 'article' },
        { label: 'Ghana’s cocoa crisis: who finances the wait?', href: '/en/analysis/ghana-cocoa-financing-cash-crisis/', detail: 'Crop purchases, inventory and the timing of receipts.', kind: 'article' },
      ],
      sources: [{ label: 'Bpifrance Création, operating working capital requirement', href: 'https://bpifrance-creation.fr/encyclopedie/previsions-financieres-business-plan/previsions-financieres/besoin-fonds-roulement-bfr', detail: 'Inventories, receivables, trade payables and operating cash timing. French source.', kind: 'source' }],
      related: ['fcf'],
    },
  },
  {
    slug: 'fcf',
    sigle: 'FCF',
    nom: 'Free cash flow',
    def: 'A cash measure often calculated as operating cash flow less capital expenditure. Definitions vary by issuer, so the included items and reconciliation to the accounts must be checked. It is neither accounting profit nor necessarily cash freely available for debt repayment or shareholder distributions.',
    guide: '/en/analysis/after-cyberattack-1-jlr-factories-cash-flow/',
    ...privateCreditSection,
    robots: 'noindex,follow',
    atlas: {
      intuition: 'Profit and cash follow different calculations and timetables.',
      articles: [{ label: 'JLR: when the factory stops', href: '/en/analysis/after-cyberattack-1-jlr-factories-cash-flow/', detail: 'The manufacturer’s definition, investment and operating working capital movements.', kind: 'article' }],
      sources: [{ label: 'SEC, Non-GAAP Financial Measures, question 102.07', href: 'https://www.sec.gov/rules-regulations/staff-guidance/corporation-finance-interpretations/non-gaap-financial-measures', detail: 'Common free cash flow calculation, lack of a uniform definition and reconciliation to the accounts.', kind: 'source' }],
      related: ['bfr'],
    },
  },
  {
    "slug": "automatic-stay",
    "sigle": "Automatic stay",
    "nom": "Statutory pause on specified actions in US bankruptcy",
    "def": "Protection under Section 362 of the US Bankruptcy Code. Filing a petition under the provisions it covers stays specified actions, including certain efforts to collect pre-petition claims. Its scope, duration and exceptions depend on the case and statute. The stay’s existence is distinct from a creditor’s knowledge and from the conditions for sanctions.",
    "guide": "/en/analysis/bnc-us-bankruptcy-notice-outage-risk/",
    "sectionTitle": "US regulation & institutions",
    "accent": "var(--color-topic-blue)",
    "robots": "noindex,follow",
    "atlas": {
      "intuition": "The protection can take effect before every creditor receives notice.",
      "articles": [
        {
          "label": "BNC: the bankruptcy notice outage",
          "href": "/en/analysis/bnc-us-bankruptcy-notice-outage-risk/",
          "kind": "article"
        }
      ],
      "sources": [
        {
          "label": "11 U.S.C. §362, Automatic stay",
          "href": "https://uscode.house.gov/us/usc/119-118/t11/s362/",
          "detail": "Subsections (a), (b), (c)(3) and (k): effects, exceptions, repeat filings and sanctions.",
          "kind": "source"
        }
      ],
      "related": [
        "disponibilite-de-service"
      ]
    }
  },
  {
    "slug": "disponibilite-de-service",
    "sigle": "Service availability",
    "nom": "Usable access for authorised users",
    "def": "The property of a system or service that authorised users can access and use when needed, with the expected timeliness and reliability. Availability must be assessed for specified uses and users. Encryption protects confidentiality; maintaining a usable service also requires suitable technical resources and access rights.",
    "guide": "/en/analysis/starshield-ukraine-terms-of-connection/",
    "sectionTitle": "Digital economy & data",
    "accent": "var(--color-signal)",
    "robots": "noindex,follow",
    "atlas": {
      "intuition": "A usable connection combines technical capability with authorised access.",
      "articles": [
        {
          "label": "Starshield: control over the terms of connection",
          "href": "/en/analysis/starshield-ukraine-terms-of-connection/",
          "kind": "article"
        },
        {"label": "BNC: the bankruptcy notice outage", "href": "/en/analysis/bnc-us-bankruptcy-notice-outage-risk/", "kind": "article"}
      ],
      "sources": [
        {
          "label": "NIST, availability definition",
          "href": "https://csrc.nist.gov/glossary/term/availability",
          "kind": "source"
        }
      ],
      "related": [
        "interoperabilite",
        "reversibilite",
        "portabilite"
      ]
    }
  },
  {
    "slug": "decote-d-emission",
    "sigle": "Issue discount",
    "nom": "Issue price below par",
    "def": "The difference between a bond’s face value and an issue price below par. The issuer receives less cash than the principal created. The contractual coupon stays fixed; the price difference contributes to the buyer’s yield. Cash financing, coupon expenditure and accrual-accounting amortisation follow distinct conventions.",
    "guide": "/en/analysis/france-debt-refinancing-maturity-interest-costs/",
    "sectionTitle": "Macro & central banks",
    "accent": "var(--color-signal)",
    "robots": "noindex,follow",
    "atlas": {
      "intuition": "Redemption at par exceeds the cash received on issue.",
      "articles": [
        {
          "label": "French debt: maturities and refinancing",
          "href": "/en/analysis/france-debt-refinancing-maturity-interest-costs/",
          "kind": "article"
        },
        {"label": "France, Moody’s and the price of debt", "href": "/en/analysis/france-moodys-reprieve-2027-borrowing-costs/", "kind": "article"}
      ],
      "sources": [
        {
          "label": "French Parliament, 2024 accounts: issue premiums and discounts",
          "href": "https://www.assemblee-nationale.fr/dyn/opendata/RAPPANR5L17B1492-tI.html",
          "kind": "source"
        }
      ],
      "related": [
        "prime-d-emission",
        "coupon-obligataire",
        "risque-de-refinancement"
      ]
    }
  },
  {
    "slug": "prime-d-emission",
    "sigle": "Issue premium",
    "nom": "Issue price above par",
    "def": "The excess of a bond’s issue price over face value. The issuer receives more cash than the principal created, in exchange for the full contractual payment stream, including coupons. The premium affects yield and is amortised over the bond’s life in accrual accounts. It differs from the term premium, an estimated compensation for interest-rate risk.",
    "guide": "/en/analysis/france-debt-refinancing-maturity-interest-costs/",
    "sectionTitle": "Macro & central banks",
    "accent": "var(--color-signal)",
    "robots": "noindex,follow",
    "atlas": {
      "intuition": "Cash received at issue belongs to a contract specifying future payments.",
      "articles": [
        {
          "label": "French debt: maturities and refinancing",
          "href": "/en/analysis/france-debt-refinancing-maturity-interest-costs/",
          "kind": "article"
        },
        {"label": "France, Moody’s and the price of debt", "href": "/en/analysis/france-moodys-reprieve-2027-borrowing-costs/", "kind": "article"}
      ],
      "sources": [
        {
          "label": "French Parliament, 2024 accounts: issue premiums and discounts",
          "href": "https://www.assemblee-nationale.fr/dyn/opendata/RAPPANR5L17B1492-tI.html",
          "kind": "source"
        }
      ],
      "related": [
        "decote-d-emission",
        "coupon-obligataire",
        "risque-de-refinancement"
      ]
    }
  },
  {
    "slug": "flottant",
    "sigle": "Free float",
    "nom": "Shares available in public markets",
    "def": "The portion of outstanding shares considered available for purchase in public markets. The estimate excludes holdings classified as strategic under the provider’s rules. MSCI assesses availability to international investors using public shareholder information. Its Foreign Inclusion Factor (FIF) converts that estimate into a market capitalisation adjustment factor, applying rounding conventions and foreign ownership restrictions. The quality of the data affects the estimate.",
    "guide": "/en/analysis/msci-indonesia-free-float-index-risk/",
    "sectionTitle": "Private credit & markets",
    "accent": "var(--color-accent)",
    "robots": "noindex,follow",
    "atlas": {
      "intuition": "Shareholder classifications shape how much capital investors can access.",
      "articles": [
        {
          "label": "MSCI and Indonesia: the cost of opaque ownership",
          "href": "/en/analysis/msci-indonesia-free-float-index-risk/",
          "kind": "article"
        }
      ],
      "sources": [
        {
          "label": "MSCI, Free Float Data Methodology, March 2026",
          "href": "https://www.msci.com/index/methodology/latest/FreeFloatData",
          "detail": "Sections 1.1–1.3 and Appendix I, pp. 3–6 and 13: strategic holdings, beneficial owners and public-data quality. Version accessed 22 October 2026; mutable URL.",
          "kind": "source"
        },
        {
          "label": "MSCI, GIMI Methodology, October 2026",
          "href": "https://www.msci.com/index/methodology/latest/GIMI",
          "detail": "Appendix VI, pp. 100–104: FIF, rounding, foreign ownership restrictions and adjusted market capitalisation. Version accessed 22 October 2026; mutable URL.",
          "kind": "source"
        }
      ],
      "related": [
        "gestion-passive",
        "tracking-error",
        "etf"
      ]
    }
  },
  {
    "slug": "gestion-passive",
    "sigle": "Passive investing",
    "nom": "Tracking a benchmark index",
    "def": "An investment strategy that aims to track a benchmark’s performance under its rules. Depending on the mandate, replication can use all constituents, a sample of securities or a synthetic approach. Investor flows and index changes can require trading. Fees and execution conditions can cause performance to differ from the benchmark.",
    "guide": "/en/analysis/msci-indonesia-free-float-index-risk/",
    "sectionTitle": "Private credit & markets",
    "accent": "var(--color-accent)",
    "robots": "noindex,follow",
    "atlas": {
      "intuition": "Index rules guide portfolio adjustments.",
      "articles": [
        {
          "label": "MSCI and Indonesia: the cost of opaque ownership",
          "href": "/en/analysis/msci-indonesia-free-float-index-risk/",
          "kind": "article"
        }
      ],
      "sources": [
        {
          "label": "Sushko and Turner, BIS, March 2018",
          "href": "https://www.bis.org/publications/implications-passive-investing-securities-markets",
          "detail": "Definition of passive investing and trading caused by flows or composition changes.",
          "kind": "source"
        },
        {
          "label": "ESMA, Guidelines on ETFs and other UCITS issues, 2014",
          "href": "https://www.esma.europa.eu/sites/default/files/library/2015/11/esma-2014-0011-01-00_en_0.pdf",
          "detail": "Definitions and paragraph 9: full or sampled physical replication, synthetic replication and tracking factors.",
          "kind": "source"
        }
      ],
      "related": [
        "flottant",
        "tracking-error",
        "etf"
      ]
    }
  },
  {
    "slug": "tracking-error",
    "sigle": "Tracking error",
    "nom": "Volatility of returns relative to a benchmark",
    "def": "The standard deviation, usually annualized, of periodic return differences between a portfolio and its benchmark. Realized tracking error uses returns observed over a specified window; ex-ante tracking error estimates their dispersion with a risk model. The frequency, window, currency and annualization method must be specified. Tracking difference measures the performance gap over a period and is a separate metric.",
    "guide": "/en/analysis/msci-indonesia-free-float-index-risk/",
    "sectionTitle": "Private credit & markets",
    "accent": "var(--color-accent)",
    "robots": "noindex,follow",
    "atlas": {
      "intuition": "Measuring the variability of return differences requires comparable observations over time.",
      "articles": [
        {
          "label": "MSCI and Indonesia: the cost of opaque ownership",
          "href": "/en/analysis/msci-indonesia-free-float-index-risk/",
          "kind": "article"
        }
      ],
      "sources": [
        {
          "label": "MSCI, Introducing MSCI IndexMetrics, December 2013",
          "href": "https://www.msci.com/documents/1296102/1336482/Introducing_MSCI_IndexMetrics.pdf/23cbc36f-cf2c-4bf0-96c3-206eecdfdf6d",
          "detail": "Appendix, page 27: annualized standard deviation of active returns, using monthly observations here.",
          "kind": "source"
        },
        {
          "label": "MSCI, Bond-Index Replication While Navigating Volatility",
          "href": "https://www.msci.com/research-and-insights/blog-post/bond-index-replication-while-navigating-volatility",
          "detail": "Footnote 1: projected annualized active risk between portfolio and benchmark.",
          "kind": "source"
        },
        {
          "label": "ESMA, Guidelines on ETFs and other UCITS issues, 2014",
          "href": "https://www.esma.europa.eu/sites/default/files/library/2015/11/esma-2014-0011-01-00_en_0.pdf",
          "detail": "Definitions and paragraph 11: tracking error, annual tracking difference and anticipated versus realized measures.",
          "kind": "source"
        }
      ],
      "related": [
        "flottant",
        "gestion-passive",
        "etf"
      ]
    }
  },
  {
    "slug": "etf",
    "sigle": "ETF",
    "nom": "Exchange-Traded Fund",
    "def": "A fund whose shares trade on an exchange during the trading day, following an index or an active strategy. Trades between investors transfer fund shares. Creations and redemptions with the fund generally pass through authorised participants, in exchange for securities, cash or both under the fund’s rules. These operations change its portfolio. The exchange price can differ from net asset value per share.",
    "guide": "/en/analysis/msci-indonesia-free-float-index-risk/",
    "sectionTitle": "Private credit & markets",
    "accent": "var(--color-accent)",
    "robots": "noindex,follow",
    "atlas": {
      "intuition": "The trading structure and investment strategy describe separate features of a fund.",
      "articles": [
        {
          "label": "MSCI and Indonesia: the cost of opaque ownership",
          "href": "/en/analysis/msci-indonesia-free-float-index-risk/",
          "kind": "article"
        }
      ],
      "sources": [
        {
          "label": "SEC, Updated Investor Bulletin: ETFs, February 23, 2023",
          "href": "https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-24",
          "detail": "Index-based or actively managed funds; investor trading, creation/redemption through authorised participants, baskets or cash, market price and net asset value. The bulletin covers US ETFs registered as open-end funds or unit investment trusts.",
          "kind": "source"
        }
      ],
      "related": [
        "flottant",
        "gestion-passive",
        "tracking-error"
      ]
    }
  },
  {
    slug: 'r', sigle: 'r*', nom: 'Natural real interest rate',
    def: 'A real short-term interest rate consistent with an economy operating at potential and stable inflation. It is estimated through a model and varies with economic conditions. The longer-run dot plot reports a nominal policy rate: a real comparison requires approximately subtracting expected inflation over the same horizon. That longer-run nominal projection and a current estimate of r* therefore address different questions.',
    guide: '/en/guides/read-dot-plot-sep/', ...macroSection, robots: 'noindex,follow',
    atlas: {
      intuition: 'Compare real rates over matching horizons, with an explicit inflation assumption.',
      formula: 'nominal neutral rate ≈ natural real rate + expected inflation',
      articles: [{ label: 'AI demand and innovation returns', href: '/en/analysis/ai-growth-demand-innovation-returns/', kind: 'article' }],
      guides: [{ label: 'Reading the dot plot and SEP', href: '/en/guides/read-dot-plot-sep/', kind: 'guide' }],
      sources: [
        { label: 'New York Fed, Measuring the Natural Rate of Interest', href: 'https://www.newyorkfed.org/research/policy/rstar', detail: 'Definition of the real short-term rate estimated by the LW and HLW models.', kind: 'source' },
        { label: 'Lael Brainard, Federal Reserve, 5 September 2017', href: 'https://www.federalreserve.gov/newsevents/speech/brainard20170905a.htm', detail: 'Distinguishes the SEP longer-run nominal projection from its real counterpart after inflation.', kind: 'source' },
      ],
      related: ['pib', 'van'],
    },
  },
  {
    slug: 'rente-d-innovation', sigle: 'Innovation rent', nom: 'Income from a technological lead',
    def: 'Income earned from a technological lead beyond current production costs. It can help cover research costs. Its size and persistence depend on competition, imitation, obsolescence and the rights that sustain the advantage. Expected rents in a model are assumptions, distinct from observed profits.',
    guide: '/en/analysis/ai-growth-demand-innovation-returns/', ...macroSection, robots: 'noindex,follow',
    atlas: {
      intuition: 'The persistence of an advantage and the income retained help finance further research.',
      articles: [{ label: 'AI demand and innovation returns', href: '/en/analysis/ai-growth-demand-innovation-returns/', kind: 'article' }],
      sources: [{ label: 'Rungcharoenkitkul, BIS WP 1381, October 2026', href: 'https://www.bis.org/publications/working-paper-1381-transformative-ai-and-demand-bottlenecks', detail: 'Sections 2.4–2.5: innovation rents, research costs and the persistence of an advantage. A conditional theoretical framework.', kind: 'source' }],
      related: ['van', 'part-du-travail'],
    },
  },
  {
    slug: 'uree', sigle: 'Urea', nom: 'Nitrogen fertilizer containing 46% nitrogen',
    def: 'A nitrogen fertilizer sold as prills or granules. The standard product contains 46% nitrogen by mass, so 100 tonnes of urea provide 46 tonnes of nitrogen. That concentration measures neither crop uptake nor yield, which also depend on soil and application conditions.',
    guide: '/en/analysis/hormuz-fertilizer-corridor-crop-calendar/', sectionTitle: 'Industry & healthcare', accent: 'var(--color-signal)', robots: 'noindex,follow',
    atlas: {
      articles: [{ label: 'Hormuz: five ships and the crop calendar', href: '/en/analysis/hormuz-fertilizer-corridor-crop-calendar/', detail: 'Cargo composition, financing and the crop calendar.', kind: 'article' }],
      sources: [{ label: 'University of Minnesota Extension, Fertilizer urea', href: 'https://extension.umn.edu/agriculture/crop-production/nutrient-management-for-minnesota-crops/fertilizer-urea', detail: '46% nitrogen content and application conditions; no local application recommendation inferred.', kind: 'source' }],
      related: ['dap', 'chokepoint'],
    },
  },
  {
    slug: 'dap', sigle: 'DAP', nom: 'Diammonium phosphate',
    def: 'A fertilizer supplying nitrogen and phosphorus, manufactured from ammonia and phosphoric acid. Its standard 18-46-0 grade contains 18% nitrogen and 46% available phosphate expressed as P₂O₅ equivalent. The second figure is neither elemental phosphorus content nor the share automatically taken up by a crop.',
    guide: '/en/analysis/hormuz-fertilizer-corridor-crop-calendar/', sectionTitle: 'Industry & healthcare', accent: 'var(--color-signal)', robots: 'noindex,follow',
    atlas: {
      articles: [{ label: 'Hormuz: five ships and the crop calendar', href: '/en/analysis/hormuz-fertilizer-corridor-crop-calendar/', detail: 'Sulfur, phosphates and fertilizer availability for growers.', kind: 'article' }],
      sources: [{ label: 'University of Minnesota Extension, Understanding phosphorus fertilizers', href: 'https://extension.umn.edu/agriculture/crop-production/nutrient-management-for-minnesota-crops/understanding-phosphorus-fertilizers', detail: 'Manufacturing and 18-46-0 grade; table 1 reports available phosphate as P₂O₅, distinct from elemental phosphorus.', kind: 'source' }],
      related: ['uree', 'chokepoint'],
    },
  },
  {
    slug: 'swift', sigle: 'SWIFT', nom: 'Society for Worldwide Interbank Financial Telecommunication',
    def: 'A secure financial messaging network that carries instructions between institutions. Swift is not a bank: it does not hold funds or manage accounts for its customers. Transfers and settlement are performed by the institutions and infrastructures involved. Disconnection from messaging is distinct from an asset freeze or a transaction ban, whose scope depends on the applicable law.',
    guide: '/en/analysis/a7-banks-russia-payment-detour/', ...usRegulationSection, robots: 'noindex,follow',
    atlas: {
      intuition: 'A message may have arrived while the supplier is still waiting for its bank account to be credited.',
      whyNow: 'The A7 dossier calls for distinguishing payment instructions, available currency and the credit actually received by the supplier.',
      articles: [
        { label: 'A7: the banking detour for Russian payments', href: '/en/analysis/a7-banks-russia-payment-detour/', detail: 'Messaging, foreign exchange and settlement in the public record on A7.', kind: 'article' },
        { label: 'Stablecoins: from tokens to available dollars', href: '/en/analysis/stablecoin-reserves-redemption-dollar/', detail: 'Reserves, redemption rights and dollars reaching a bank account.', kind: 'article' },
        { label: 'Iranian oil and USDT', href: '/en/analysis/iranian-oil-usdt-tether-seizure/', detail: 'Freezing and seizure powers that persist when a holder controls the keys.', kind: 'article' },
      ],
      sources: [
        { label: 'Swift, FAQs: Does Swift move money? and Is Swift a bank?', href: 'https://www.swift.com/about-us/who-we-are', detail: 'Messaging carries instructions; institutions transfer the funds. Read on October 15, 2026.', kind: 'source' },
        { label: 'Swift, About Swift section of its June 16, 2026 release', href: 'https://www.swift.com/about-us/media-centre/press-releases/swift-appoints-michael-manos-chief-information-officer', detail: 'Operator description stating that Swift does not hold funds or manage customer accounts.', kind: 'source' },
        { label: 'Swift, Swift and sanctions', href: 'https://www.swift.com/about-us/legal/compliance-0/swift-and-sanctions', detail: 'Institutions’ responsibilities and disconnection of designated entities under EU law. Read on October 15, 2026.', kind: 'source' },
        { label: 'FinCEN, proposal published in the Federal Register on October 5, 2026', href: 'https://www.govinfo.gov/content/pkg/FR-2026-10-05/html/2026-20371.htm', detail: 'Administrative assessment of A7 subagents’ accounts and liquidity; the additional prohibition remains proposed.', kind: 'source' },
      ],
      related: ['stablecoin', 'usdt'],
    },
  },
  {
    slug: 'pret-relais', sigle: 'Bridge loan', nom: 'Temporary borrowing ahead of an expected funding source',
    def: 'A short-term loan used to meet a funding need before an expected resource becomes available, such as longer-term financing or proceeds from an asset sale. The later resource still has to materialise. The facility limit, cumulative drawdowns and principal outstanding describe different stages of the borrowing and must not be added together.',
    guide: '/en/analysis/softbank-openai-financing-freedom-to-wait/', ...privateCreditSection, robots: 'noindex,follow',
    atlas: {
      intuition: 'The loan advances the funds; the resource intended to repay it must subsequently materialise.',
      articles: [{ label: 'SoftBank: the financing behind its OpenAI bet', href: '/en/analysis/softbank-openai-financing-freedom-to-wait/', kind: 'article' }],
      sources: [
        { label: 'BDC, bridge capital', href: 'https://www.bdc.ca/en/articles-tools/entrepreneur-toolkit/templates-business-guides/glossary/bridge-capital', detail: 'Temporary funding ahead of a more permanent resource; bridge financing can take the form of debt.', kind: 'source' },
        { label: 'SoftBank Group, Early Repayment of Bridge Loans, 9 September 2026', href: 'https://group.softbank/en/news/press/20260909', detail: 'Borrower disclosure distinguishing the facility limit, cumulative drawdowns and balance before repayment.', kind: 'source' },
      ],
      related: ['risque-de-refinancement', 'coupon-obligataire'],
    },
  },
  {
    slug: 'capitation', sigle: 'Capitation', nom: 'Fixed payment per patient and period',
    def: 'A payment method in which a physician or physician group receives a set amount per patient and period, usually a month, for a defined package of services and administrative costs, regardless of the number of services delivered. The covered services and contractual protections determine the provider’s cost exposure. The payment does not measure quality of care.',
    guide: '/en/analysis/humana-blackrock-promise-behind-clinics/', sectionTitle: 'Industry & healthcare', accent: 'var(--color-signal)', robots: 'noindex,follow',
    atlas: {
      articles: [{ label: 'Humana and BlackRock: the promise behind the clinics', href: '/en/analysis/humana-blackrock-promise-behind-clinics/', kind: 'article' }],
      sources: [
        { label: 'eCFR, 42 CFR 422.208(a)', href: 'https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-B/part-422/subpart-E/section-422.208', detail: 'Capitation definition: payment per patient and period for a package of services, regardless of the number of services delivered.', kind: 'source' },
        { label: 'Humana, 2025 Form 10-K', href: 'https://www.sec.gov/Archives/edgar/data/49071/000004907126000009/hum-20251231.htm', detail: 'Capitation and Risk Factors: contract scope and levels of financial risk; company disclosure.', kind: 'source' },
      ],
      related: ['rofo'],
    },
  },
  {
    slug: 'rofo', sigle: 'ROFO', nom: 'Right of first offer',
    def: 'A contractual right to submit the first offer in a sale process, under the agreed conditions and timetable. It allows the holder to bid at an early stage of that process; it guarantees neither a completed sale nor an automatic right to match every later offer. The agreement’s clauses determine its scope.',
    guide: '/en/analysis/humana-blackrock-promise-behind-clinics/', ...privateCreditSection, robots: 'noindex,follow',
    atlas: {
      articles: [{ label: 'Humana and BlackRock: the promise behind the clinics', href: '/en/analysis/humana-blackrock-promise-behind-clinics/', kind: 'article' }],
      sources: [{ label: 'Humana, Form 8-K, 13 October 2026', href: 'https://www.sec.gov/Archives/edgar/data/49071/000004907126000060/hum-20261013.htm', detail: 'Item 7.01: CenterWell’s right to submit the first offer in a sale process for remaining clinics after the end of 2033. The full contractual clauses are not attached.', kind: 'source' }],
      related: ['capitation'],
    },
  },
  {
    slug: 'tiva', sigle: 'TiVA', nom: 'Trade in value added',
    def: 'OECD indicators that trace the countries and industries contributing value added to trade and final demand, using inter-country input-output tables. They distinguish domestic and foreign content in gross exports. The coverage and period must be specified; the indicators do not identify individual end customers.',
    guide: '/en/analysis/world-trade-rhythm-ai-orders/', ...macroSection, robots: 'noindex,follow',
    atlas: {
      articles: [
        { label: 'World trade is moving to the rhythm of AI orders', href: '/en/analysis/world-trade-rhythm-ai-orders/', kind: 'article' },
        { label: 'The US trade deficit, from the port to the factory', href: '/en/analysis/us-trade-deficit-imports-august-2026/', kind: 'article' },
      ],
      sources: [{ label: 'OECD, Trade in value-added', href: 'https://www.oecd.org/en/topics/sub-issues/trade-in-value-added.html', detail: 'Indicators derived from ICIO tables: origins of value added in exports and final demand, with defined country and industry coverage.', kind: 'source' }],
      related: ['effet-fouet'],
    },
  },
  {
    slug: 'effet-fouet', sigle: 'Bullwhip effect', nom: 'Order amplification along a supply chain',
    def: 'A mechanism through which orders sent to suppliers fluctuate more than downstream demand. Forecast revisions and inventory adjustments can amplify changes at several stages. The scale depends on lead times, contracts and ordering practices; a destocking simulation does not estimate a coefficient for an actual industry.',
    guide: '/en/analysis/world-trade-rhythm-ai-orders/', ...macroSection, robots: 'noindex,follow',
    atlas: {
      articles: [{ label: 'World trade is moving to the rhythm of AI orders', href: '/en/analysis/world-trade-rhythm-ai-orders/', kind: 'article' }],
      sources: [{ label: 'Rees and Rungcharoenkitkul, BIS Bulletin 48, 11 November 2021', href: 'https://www.bis.org/publications/bulletin-48-bottlenecks-causes-and-macroeconomic-implications.pdf', detail: 'Printed page 3: shortage expectations and precautionary buffers at several stages. A mechanism discussed by the authors, without a coefficient transferred to AI.', kind: 'source' }],
      related: ['tiva'],
    },
  },
  {
    slug: 'capacite-de-soutirage', sigle: 'Withdrawal capacity', nom: 'Gas storage deliverability',
    def: 'The amount of gas a storage facility can withdraw per unit of time, usually a day. It depends on inventory, pressure, compression and surface equipment. Available flow generally declines as gas is withdrawn. Stored energy and withdrawal capacity measure different characteristics.',
    guide: '/en/analysis/european-gas-bridging-gap-between-cargoes/', ...energySection, robots: 'noindex,follow',
    atlas: {
      articles: [{ label: 'European gas: bridging the gap between cargoes', href: '/en/analysis/european-gas-bridging-gap-between-cargoes/', kind: 'article' }],
      sources: [{ label: 'EIA, The Basics of Underground Natural Gas Storage', href: 'https://www.eia.gov/naturalgas/storage/basics/', detail: 'Storage Measures: daily deliverability, pressure, compression and changes with inventory. Physical definitions without transferring US data to Europe.', kind: 'source' }],
      related: ['gaz-utile', 'gaz-coussin'],
    },
  },
  {
    slug: 'gaz-utile', sigle: 'Working gas', nom: 'Gas inventory above cushion gas',
    def: 'Gas held above the cushion-gas level and available for withdrawal during normal operation. Working gas capacity equals total storage capacity minus cushion gas. Actual working gas inventory on a given date can be below that capacity.',
    guide: '/en/analysis/european-gas-bridging-gap-between-cargoes/', ...energySection, robots: 'noindex,follow',
    atlas: {
      articles: [{ label: 'European gas: bridging the gap between cargoes', href: '/en/analysis/european-gas-bridging-gap-between-cargoes/', kind: 'article' }],
      sources: [{ label: 'JRC, EU Gas Transmission Network Facilities Review, 2020', href: 'https://publications.jrc.ec.europa.eu/repository/bitstream/JRC122592/jrc122592_v5.pdf', detail: 'Section 3.3, p. 11: working gas, working gas capacity and cushion gas. Technical definitions without reusing the 2020 facility inventory.', kind: 'source' }],
      related: ['gaz-coussin', 'capacite-de-soutirage'],
    },
  },
  {
    slug: 'gaz-coussin', sigle: 'Cushion gas', nom: 'Base inventory supporting storage operation',
    def: 'Gas intended to remain in a storage reservoir to maintain the pressure and deliverability needed for operation. It is normally retained throughout injection and withdrawal cycles. Working gas is measured above this base inventory.',
    guide: '/en/analysis/european-gas-bridging-gap-between-cargoes/', ...energySection, robots: 'noindex,follow',
    atlas: {
      articles: [{ label: 'European gas: bridging the gap between cargoes', href: '/en/analysis/european-gas-bridging-gap-between-cargoes/', kind: 'article' }],
      sources: [{ label: 'JRC, EU Gas Transmission Network Facilities Review, 2020', href: 'https://publications.jrc.ec.europa.eu/repository/bitstream/JRC122592/jrc122592_v5.pdf', detail: 'Section 3.3, p. 11–12: cushion gas supports pressure and deliverability. Technical definitions without reusing the 2020 facility inventory.', kind: 'source' }],
      related: ['gaz-utile', 'capacite-de-soutirage'],
    },
  },
  {
    "slug": "option-exterieure",
    "sigle": "Outside option",
    "nom": "Fallback alternative in a negotiation",
    "def": "An alternative available if a relationship or negotiation ends. For a worker, it depends on accessible jobs and the conditions for obtaining them; for a firm, on replacement or reorganisation options. Its influence on the division of gains depends on how workable the alternatives are and on the bargaining setting.",
    "guide": "/en/analysis/ai-wages-power-walk-away/",
    "sectionTitle": "Macro & central banks",
    "accent": "var(--color-signal)",
    "robots": "noindex,follow",
    "atlas": {
      "articles": [
        {
          "label": "AI and wages: the power to walk away",
          "href": "/en/analysis/ai-wages-power-walk-away/",
          "kind": "article"
        }
      ],
      "sources": [
        {
          "label": "CORE, The Economy, Unit 6",
          "href": "https://books.core-econ.org/the-economy-v1/book/text/06.html",
          "detail": "The value of a job compared with the next best alternative, including job search.",
          "kind": "source"
        },
        {
          "label": "Fukui, Nakamura and Steinsson, The Commoditization of Labor",
          "href": "https://eminakamura.com/papers/Commoditization.pdf",
          "detail": "Introduction: firm and worker outside options under the model’s assumptions.",
          "kind": "source"
        }
      ],
      "related": [
        "part-du-travail",
        "wage-tracker-bce"
      ]
    }
  },
  {
    "slug": "part-du-travail",
    "sigle": "Labour share",
    "nom": "Labour compensation relative to value added",
    "def": "The fraction of value added attributed to labour compensation. Employee compensation includes wages and employer social contributions; some aggregate measures also impute self-employed labour income. The sector, tax treatment and value-added convention must be specified. The share can fall even while pay rises.",
    "guide": "/en/analysis/ai-wages-power-walk-away/",
    "sectionTitle": "Macro & central banks",
    "accent": "var(--color-signal)",
    "robots": "noindex,follow",
    "atlas": {
      "articles": [
        {
          "label": "AI and wages: the power to walk away",
          "href": "/en/analysis/ai-wages-power-walk-away/",
          "kind": "article"
        }
      ],
      "sources": [
        {
          "label": "OECD, Compendium of Productivity Indicators 2024, Labour income and productivity",
          "href": "https://www.oecd.org/en/publications/oecd-compendium-of-productivity-indicators-2024_b96cd88a-en/full-report/component-9.html",
          "detail": "Labour-share definition, scope and divergence between productivity and compensation.",
          "kind": "source"
        },
        {
          "label": "OECD, Employee compensation by activity",
          "href": "https://www.oecd.org/en/data/indicators/employee-compensation-by-activity.html",
          "detail": "Employee compensation including employer social contributions.",
          "kind": "source"
        }
      ],
      "related": [
        "option-exterieure",
        "wage-tracker-bce"
      ]
    }
  },
  {
    "slug": "wage-tracker-bce",
    "sigle": "ECB wage tracker",
    "nom": "Agreement-based tracking of negotiated wages",
    "def": "Eurosystem indicators built from active collective bargaining agreements in participating countries. Forward-looking information reflects known contract clauses and remains conditional and revisable. It is not a forecast of all wages. Statistical coverage measures employees represented in the data rather than all employees covered by collective bargaining.",
    "guide": "/en/analysis/ai-wages-power-walk-away/",
    "sectionTitle": "Macro & central banks",
    "accent": "var(--color-signal)",
    "robots": "noindex,follow",
    "atlas": {
      "articles": [
        {
          "label": "AI and wages: the power to walk away",
          "href": "/en/analysis/ai-wages-power-walk-away/",
          "kind": "article"
        }
      ],
      "sources": [
        {
          "label": "ECB, wage tracker release of 16 September 2026",
          "href": "https://www.ecb.europa.eu/press/pr/date/2026/html/ecb.pr260916~7bc58ebef4.en.html",
          "detail": "Definitions of the four indicators, employee coverage and conditional forward-looking signals.",
          "kind": "source"
        }
      ],
      "related": [
        "option-exterieure",
        "part-du-travail"
      ]
    }
  },
  {
    slug: 'distillats', sigle: 'Distillate fuel oil', nom: 'Diesel and fuel oils in EIA statistics',
    def: 'A category of petroleum products from distillation that includes diesel fuels and fuel oils, including heating oil, in EIA statistics. Its scope extends beyond road diesel. Comparisons of inventories need to retain the same product category.',
    guide: '/en/analysis/oil-flows-diesel-stocks-liquidity/', ...energySection, robots: 'noindex,follow',
    atlas: {
      articles: [{ label: 'From oil at sea to delivered diesel', href: '/en/analysis/oil-flows-diesel-stocks-liquidity/', kind: 'article' }],
      sources: [{ label: 'EIA: distillate fuel oil', href: 'https://www.eia.gov/tools/glossary/index.php?id=distillate', detail: 'Definition of the category covering diesel fuels and fuel oils.', kind: 'source' }],
      related: ['padd', 'risque-de-base'],
    },
  },
  {
    slug: 'padd', sigle: 'PADD', nom: 'Petroleum Administration for Defense Districts',
    def: 'Regions used by the EIA to analyse US petroleum supplies, inventories and movements. The fifty states and Washington, DC, form five districts; PADD 1 covers the East Coast. US territories fall within PADDs 6 and 7, which are excluded from EIA US totals.',
    guide: '/en/analysis/oil-flows-diesel-stocks-liquidity/', ...energySection, robots: 'noindex,follow',
    atlas: {
      articles: [{ label: 'From oil at sea to delivered diesel', href: '/en/analysis/oil-flows-diesel-stocks-liquidity/', kind: 'article' }],
      sources: [
        { label: 'EIA: PADD boundaries', href: 'https://www.eia.gov/TOOLS/GLOSSARY/index.php?id=petroleum', detail: 'Five districts for the fifty states and DC; territories in PADDs 6 and 7 are excluded from US totals.', kind: 'source' },
        { label: 'EIA: regional petroleum supply analysis', href: 'https://www.eia.gov/todayinenergy/detail.php?id=4890', detail: 'Regional analysis of petroleum products and movements.', kind: 'source' },
      ],
      related: ['distillats'],
    },
  },
  {
    slug: 'risque-de-base', sigle: 'Basis risk', nom: 'Changes in the gap between an exposure and its hedge',
    def: 'The risk that the price gap between the commodity actually bought or sold and the benchmark used to hedge it changes during the hedge. Products, grades, delivery locations and dates may differ. Hedging crude oil can therefore leave part of a refined fuel’s cost exposed.',
    guide: '/en/analysis/dollar-facture-energie/', ...energySection, robots: 'noindex,follow',
    atlas: {
      formula: 'commodity basis = physical price − futures price, in comparable units and currencies',
      articles: [{ label: 'The dollar inside Europe’s energy bill', href: '/en/analysis/dollar-facture-energie/', kind: 'article' }],
      sources: [
        { label: 'CFTC: Basis and Basis Risk', href: 'https://www.cftc.gov/LearnAndProtect/AdvisoriesAndArticles/CFTCGlossary/index.htm', detail: 'Cash-futures price differences and changes between establishing and lifting a hedge.', kind: 'source' },
        { label: 'ECB: energy derivatives', href: 'https://www.ecb.europa.eu/press/financial-stability-publications/fsr/special/html/ecb.fsrart202211_01~173476301a.en.html', detail: 'Section 3: price spreads between gas delivery points.', kind: 'source' },
      ],
      related: ['brent', 'future', 'couverture-de-change', 'distillats'],
    },
  },
  {
    slug: 'couverture-de-change', sigle: 'Currency hedging', nom: 'Reducing foreign currency exposure',
    def: 'An operation intended to reduce exchange-rate risk on a defined amount and maturity, for example through a forward or currency swap. Hedging the budgeted amount fixes neither the commodity price nor the additional currency required if spending rises.',
    guide: '/en/analysis/dollar-facture-energie/', ...macroSection, robots: 'noindex,follow',
    atlas: {
      articles: [{ label: 'The dollar inside Europe’s energy bill', href: '/en/analysis/dollar-facture-energie/', kind: 'article' }],
      sources: [{ label: 'BIS: forwards, swaps and trade hedging', href: 'https://www.bis.org/publications/qr-201709/fx-swaps-and-forwards-missing-global-debt', detail: 'Non-financial customers: international trade and foreign currency liabilities.', kind: 'source' }],
      related: ['risque-de-base', 'future', 'compte-courant'],
    },
  },
  {
    slug: 'termes-de-l-echange', sigle: 'Terms of trade', nom: 'Export prices relative to import prices',
    def: 'An economy’s export price index divided by its import price index. An increase means that the same exports can buy more imports. This price indicator is distinct from the trade balance, which also depends on the quantities traded.',
    guide: '/en/analysis/dollar-facture-energie/', ...macroSection, robots: 'noindex,follow',
    atlas: {
      formula: 'terms-of-trade index = export price index / import price index × 100',
      articles: [{ label: 'The dollar inside Europe’s energy bill', href: '/en/analysis/dollar-facture-energie/', kind: 'article' }],
      sources: [{ label: 'OECD: terms of trade definition', href: 'https://www.oecd.org/en/data/indicators/terms-of-trade.html', detail: 'Relative export and import prices and purchasing power abroad.', kind: 'source' }],
      related: ['compte-courant', 'transmission-des-prix', 'couverture-de-change'],
    },
  },
  {
    slug: 'ldi', sigle: 'LDI', nom: 'Liability-driven investment',
    def: 'A strategy aligning the interest-rate and inflation sensitivity of pension assets with future pension liabilities. Bonds, derivatives and sometimes borrowing provide the exposure. Leverage creates collateral demands: a better-funded pension scheme can own an LDI vehicle facing cash shortages or depleted capital.',
    guide: '/en/analysis/dette-etats-05-appels-marge/', ...clearingSection, robots: 'noindex,follow',
    atlas: {
      intuition: 'The present value of pensions can fall faster than assets while the LDI fund’s contracts demand resources immediately.',
      formula: 'funding ratio = scheme assets / present value of pension liabilities',
      articles: [{ label: 'Government debt: the margin-call deadline', href: '/en/analysis/dette-etats-05-appels-marge/', kind: 'article' }],
      sources: [{ label: 'TPR, Using leveraged liability-driven investment', href: 'https://www.thepensionsregulator.gov.uk/en/document-library/scheme-management-detailed-guidance/funding-and-investment-detailed-guidance/liability-driven-investment', kind: 'source' }],
      related: ['duration', 'repo', 'appel-de-marge', 'marge-initiale', 'marge-de-variation'],
    },
  },

{
  "slug": "apd",
  "sigle": "ODA",
  "nom": "Official development assistance",
  "def": "A measure of official efforts primarily directed at the economic development and welfare of countries eligible under OECD Development Assistance Committee rules. The headline is measured in grant equivalents. Some spending inside donor countries is eligible, so the total does not represent only funds received by partner economies.",
  "guide": "/en/analysis/foreign-aid-cuts-beyond-government-budgets/",
  "sectionTitle": "Macro & central banks",
  "accent": "var(--color-signal)",
  "robots": "noindex,follow",
  "atlas": {
    "articles": [
      {
        "label": "Foreign aid: tracing the resources",
        "href": "/en/analysis/foreign-aid-cuts-beyond-government-budgets/",
        "kind": "article"
      }
    ],
    "sources": [
      {
        "label": "OECD: ODA statistical conventions",
        "href": "https://www.oecd.org/en/data/insights/data-explainers/2024/07/frequently-asked-questions-on-official-development-assistance-oda.html",
        "kind": "source"
      }
    ],
    "related": [
      "equivalent-don",
      "ida",
      "compte-courant"
    ]
  }
},
{
  "slug": "equivalent-don",
  "sigle": "Grant equivalent",
  "nom": "Statistical measure of donor effort",
  "def": "The monetary value of the concessional component of financing under OECD DAC conventions. For a loan, it depends on repayment terms and the prescribed discount rate. It differs from the loan principal and from the net flow of disbursements and repayments during the year.",
  "guide": "/en/analysis/foreign-aid-cuts-beyond-government-budgets/",
  "sectionTitle": "Macro & central banks",
  "accent": "var(--color-signal)",
  "robots": "noindex,follow",
  "atlas": {
    "articles": [
      {
        "label": "Foreign aid: tracing the resources",
        "href": "/en/analysis/foreign-aid-cuts-beyond-government-budgets/",
        "kind": "article"
      }
    ],
    "sources": [
      {
        "label": "OECD: ODA statistical conventions",
        "href": "https://www.oecd.org/en/topics/sub-issues/oda-standards/modernising-official-development-assistance-oda.html",
        "kind": "source"
      }
    ],
    "related": [
      "apd",
      "ida"
    ]
  }
},
{
  "slug": "ida",
  "sigle": "IDA",
  "nom": "International Development Association",
  "def": "The World Bank Group institution providing mainly concessional credits and grants to eligible countries. Its financing combines donor contributions, repayments on earlier financing and balance-sheet resources, including capital markets. A replenishment envelope, a commitment and a disbursement received are distinct stages.",
  "guide": "/en/analysis/foreign-aid-cuts-beyond-government-budgets/",
  "sectionTitle": "Macro & central banks",
  "accent": "var(--color-signal)",
  "robots": "noindex,follow",
  "atlas": {
    "articles": [
      {
        "label": "Foreign aid: tracing the resources",
        "href": "/en/analysis/foreign-aid-cuts-beyond-government-budgets/",
        "kind": "article"
      }
    ],
    "sources": [
      {
        "label": "World Bank / IDA: financing",
        "href": "https://ida.worldbank.org/en/financing",
        "kind": "source"
      }
    ],
    "related": [
      "apd",
      "compte-courant"
    ]
  }
},
  {
    slug: 'cpr', sigle: 'CPR', nom: 'Conditional prepayment rate',
    sectionTitle: 'Private credit & markets', accent: 'var(--color-accent)',
    robots: 'noindex,follow', guide: '/en/analysis/us-mortgages-three-percent-moving-risk/',
    def: 'An annualised measure of mortgage prepayments relative to the principal still exposed after scheduled amortisation. CPR may summarise observed repayments or represent a modelling assumption; the distinction must be stated. Its monthly equivalent, single-month mortality or SMM, is SMM = 1 − (1 − CPR)^(1/12), with rates expressed as proportions.',
    atlas: {
      intuition: 'Prepayments apply to a principal balance that shrinks as payments arrive.',
      formula: 'SMM = 1 − (1 − CPR)^(1/12), CPR and SMM expressed as proportions',
      articles: [{ label: 'US mortgages: the risk around 3% loans', href: '/en/analysis/us-mortgages-three-percent-moving-risk/', kind: 'article' }],
      sources: [{ label: 'Freddie Mac: Daily Prepayment Report Guide', href: 'https://capitalmarkets.freddiemac.com/mbs/docs/dpr_guide.pdf', detail: 'Pages 12 and 13: the SMM denominator and annualised CPR conversion.', kind: 'source' }],
      related: ['wal', 'msr', 'duration'],
    },
  },
  {
    slug: 'wal', sigle: 'WAL', nom: 'Weighted average life of principal',
    sectionTitle: 'Private credit & markets', accent: 'var(--color-accent)',
    robots: 'noindex,follow', guide: '/en/analysis/us-mortgages-three-percent-moving-risk/',
    def: 'The average time to principal repayment, weighted by the amount returned at each date. It is measured in years from a reference date and depends on assumptions such as prepayment speeds. It excludes interest and discounting. This repayment schedule differs from duration, which measures price sensitivity to interest rates.',
    atlas: {
      intuition: 'Each dollar of principal is weighted by how long it takes to recover it.',
      formula: 'WAL = Σ(time in years × principal repaid) / Σ(principal repaid)',
      articles: [{ label: 'US mortgages: the risk around 3% loans', href: '/en/analysis/us-mortgages-three-percent-moving-risk/', kind: 'article' }],
      sources: [{ label: 'Freddie Mac: STACR 2016-HQA2, weighted average life', href: 'https://capitalmarkets.freddiemac.com/crt/docs/legal-documents/stacr/series-2016-hqa2/16_hqa2_1120281sto.pdf', detail: 'Definition and assumptions for the securities’ weighted average lives.', kind: 'source' }],
      related: ['cpr', 'dv01', 'duration'],
    },
  },
  {
    slug: 'dv01', sigle: 'DV01', nom: 'Dollar value of one basis point',
    sectionTitle: 'Private credit & markets', accent: 'var(--color-accent)',
    robots: 'noindex,follow', guide: '/en/analysis/us-mortgages-three-percent-moving-risk/',
    def: 'The estimated local change in a position’s value for a 0.01-percentage-point move in interest rates. Expressed here as an absolute amount, it is approximated by interest-rate duration multiplied by market value and 0.0001. It depends on the position and the assumed rate shock; it is not a realised loss.',
    atlas: {
      intuition: 'Expressing rate sensitivity in dollars helps size a hedge.',
      formula: 'DV01 ≈ |interest-rate duration × market value| × 0.0001, in dollars per basis point',
      articles: [{ label: 'US mortgages: the risk around 3% loans', href: '/en/analysis/us-mortgages-three-percent-moving-risk/', kind: 'article' }],
      sources: [{ label: 'CME Group: Calculating the Dollar Value of a Basis Point', href: 'https://www.cmegroup.com/trading/interest-rates/files/Calculating_the_Dollar_Value_of_a_Basis_Point.pdf', detail: 'Method 2: duration, market value and limits of the local approximation.', kind: 'source' }],
      related: ['duration', 'repo', 'wal'],
    },
  },
  {
    slug: 'msr', sigle: 'MSR', nom: 'Mortgage servicing right',
    sectionTitle: 'Private credit & markets', accent: 'var(--color-accent)',
    robots: 'noindex,follow', guide: '/en/analysis/us-mortgages-three-percent-moving-risk/',
    def: 'A contractual right to income from administering mortgage loans, in exchange for duties such as collecting payments and handling borrower accounts. It is an asset distinct from an MBS. Prepayment shortens servicing revenues, while delinquencies and defaults can increase processing costs. Its value depends on expected net servicing income.',
    atlas: {
      intuition: 'The servicer owns a claim on service revenues, distinct from capital invested in the MBS.',
      articles: [{ label: 'US mortgages: the risk around 3% loans', href: '/en/analysis/us-mortgages-three-percent-moving-risk/', kind: 'article' }],
      sources: [{ label: 'Federal Reserve: Mortgage Servicing Right Valuations Under Stress', href: 'https://www.federalreserve.gov/econres/notes/feds-notes/mortgage-servicing-right-valuations-under-stress-20260604.html', detail: 'Note of 4 June 2026: servicing income, prepayments and default costs.', kind: 'source' }],
      related: ['cpr', 'wal', 'repo'],
    },
  },
  {
    slug: 'pension-risk-transfer', sigle: 'Pension risk transfer', nom: 'PRT: transferring pension risks to an insurer',
    ...privateCreditSection, robots: 'noindex,follow',
    guide: '/en/analysis/when-pension-contracts-change-hands/',
    def: 'An arrangement that transfers some or all of the risks associated with defined-benefit pension promises to an insurer, usually through an annuity purchase. The transaction structure and applicable law determine which liabilities move, who is legally responsible for paying benefits and which protection arrangements cover beneficiaries.',
    atlas: {
      articles: [{ label: 'Who owes AT&T retirees their pensions?', href: '/en/analysis/when-pension-contracts-change-hands/', kind: 'article' }],
      sources: [
        { label: 'NAIC: Pension Risk Transfer', href: 'https://content.naic.org/cipr_topics/topic_pension_risk_transfer.htm', detail: 'Transferring risks from a defined-benefit pension plan to an insurer.', kind: 'source' },
        { label: 'PBGC: Annuities', href: 'https://www.pbgc.gov/guidance/annuities', detail: 'PBGC protection ends for benefits covered by irrevocable commitments purchased from an insurer.', kind: 'source' },
      ],
      related: ['buy-in-buy-out'],
    },
  },
  {
    slug: 'buy-in-buy-out', sigle: 'Buy-in / buy-out', nom: 'Two UK pension insurance arrangements',
    ...privateCreditSection, robots: 'noindex,follow',
    guide: '/en/analysis/when-pension-contracts-change-hands/',
    def: 'In the UK, a buy-in is an insurance policy held as a pension scheme asset: the insurer pays the scheme, whose trustees remain legally responsible for benefits. A buy-out makes the insurer directly responsible to covered members. The distinction rests on who owes the benefits, including when a buy-in covers every member.',
    atlas: {
      articles: [{ label: 'Who owes AT&T retirees their pensions?', href: '/en/analysis/when-pension-contracts-change-hands/', kind: 'article' }],
      sources: [{ label: 'The Pensions Regulator: insurance solutions', href: 'https://www.thepensionsregulator.gov.uk/en/document-library/scheme-management-detailed-guidance/funding-and-investment-detailed-guidance/new-models-and-options-in-defined-benefit-pensions-schemes', detail: 'Buy-ins and Buy-outs sections: scheme policies, trustee responsibility and the insurer’s direct obligation.', kind: 'source' }],
      related: ['pension-risk-transfer'],
    },
  },
  {
    slug: 'reassurance-adossee-a-l-actif', sigle: 'Asset-intensive reinsurance', nom: 'Transfer of investment and insurance risks',
    ...privateCreditSection, robots: 'noindex,follow',
    guide: '/en/analysis/pensions-bermuda-recapture-risk/',
    def: 'Reinsurance that transfers investment risks and risks associated with life insurance or annuity liabilities to a counterparty. The reinsurer agrees to fund covered benefits; the cedant remains responsible to its policyholders. Assets may transfer or stay with the cedant, depending on the contractual structure.',
    atlas: {
      intuition: 'Funding and specified risks move between balance sheets while the original insurer retains its promise to policyholders.',
      articles: [{ label: 'When risks return to the insurer', href: '/en/analysis/insurers-asset-managers-07-risks-return/', kind: 'article' }, { label: 'The regulatory price of a promise', href: '/en/analysis/insurers-asset-managers-06-risk-treatment/', kind: 'article' }, { label: 'Pensions and Bermuda: the cost of recapture', href: '/en/analysis/pensions-bermuda-recapture-risk/', kind: 'article' }, { label: 'Who owes AT&T retirees their pensions?', href: '/en/analysis/when-pension-contracts-change-hands/', kind: 'article' }, { label: 'The Bermuda balance sheet behind an American annuity', href: '/en/analysis/bermuda-reinsurance-jackson-athene/', kind: 'article' }],
      sources: [{ label: 'IAIS: Structural shifts in the life insurance sector', href: 'https://www.iais.org/uploads/2025/11/Issues-Paper-on-structural-shifts-in-the-life-insurance-sector.pdf', detail: 'Sections 4.1.1 and 4.1.6: reinsurance economics and collateral structures.', kind: 'source' }, { label: 'NAIC, RBC asset credit for ModCo and funds withheld, adopted in 2025', href: 'https://content.naic.org/sites/default/files/inline-files/2025-10-L%20RBC%20Asset%20Credit%20Modco-FWH%20proposal.pdf', detail: 'LR045–LR048: asset-risk transfer and conditions for the cedant’s capital relief.', kind: 'source' }],
      related: ['reassurance', 'recapture', 'funds-withheld', 'matching-adjustment', 'rbc'],
    },
  },
  {
    slug: 'recapture', sigle: 'Recapture', nom: 'Taking back ceded reinsurance risks',
    ...privateCreditSection, robots: 'noindex,follow',
    guide: '/en/analysis/pensions-bermuda-recapture-risk/',
    def: 'The insurer takes back risks previously ceded to a reinsurer under treaty-defined triggers, sometimes before formal insolvency. Recapture requires assessment of recoverable assets, access rights, liquidity needs and required capital. The amount of liabilities recaptured is not a measure of permanent loss.',
    atlas: {
      intuition: 'The cedant must be able to continue paying when its counterparty no longer performs.',
      articles: [{ label: 'The strength of an insurer’s promise', href: '/en/analysis/insurers-asset-managers-08-promise/', kind: 'article' }, { label: 'When risks return to the insurer', href: '/en/analysis/insurers-asset-managers-07-risks-return/', kind: 'article' }, { label: 'Pensions and Bermuda: the cost of recapture', href: '/en/analysis/pensions-bermuda-recapture-risk/', kind: 'article' }, { label: 'Who owes AT&T retirees their pensions?', href: '/en/analysis/when-pension-contracts-change-hands/', kind: 'article' }, { label: 'The Bermuda balance sheet behind an American annuity', href: '/en/analysis/bermuda-reinsurance-jackson-athene/', kind: 'article' }],
      sources: [{ label: 'PRA: SS5/24, October 2025 version', href: 'https://www.bankofengland.co.uk/-/media/boe/files/prudential-regulation/supervisory-statement/2025/ss524-october-2025.pdf', detail: 'Paragraphs 2.5–2.22: recapture, collateral, liquidity and triggers.', kind: 'source' }],
      related: ['reassurance-adossee-a-l-actif', 'funds-withheld', 'matching-adjustment', 'modco'],
    },
  },
  {
    slug: 'matching-adjustment', sigle: 'Matching adjustment', nom: 'Prudential adjustment for matched cash flows',
    ...privateCreditSection, robots: 'noindex,follow',
    guide: '/en/analysis/pensions-bermuda-recapture-risk/',
    def: 'A UK prudential mechanism requiring permission, which increases the discount rate for eligible liabilities backed by a portfolio meeting cash-flow matching criteria. The adjustment deducts compensation for retained risks from the asset spread. It lowers the present value of liabilities without generating immediate cash.',
    atlas: {
      intuition: 'Holding assets until their cash flows arrive can reduce prudential volatility under specified conditions.',
      articles: [{ label: 'When risks return to the insurer', href: '/en/analysis/insurers-asset-managers-07-risks-return/', kind: 'article' }, { label: 'Pensions and Bermuda: the cost of recapture', href: '/en/analysis/pensions-bermuda-recapture-risk/', kind: 'article' }],
      sources: [{ label: 'PRA: Life Insurance Stress Test 2025', href: 'https://www.bankofengland.co.uk/prudential-regulation/publication/2025/november/list-2025-results-report', detail: 'Annex 3: rationale, discount rates and retained risks.', kind: 'source' }],
      related: ['reassurance-adossee-a-l-actif', 'recapture', 'duration'],
    },
  },
  {
  "slug": "modco",
  "sigle": "ModCo",
  "nom": "Modified coinsurance",
  "def": "A proportional reinsurance structure in which the cedant retains both assets and reserves on its balance sheet. The treaty allocates agreed risks and returns to the reinsurer and sets settlements between the parties. Protection depends on rights over the assets, their valuation and recapture conditions.",
  "guide": "/en/analysis/bermuda-reinsurance-jackson-athene/",
  "sectionTitle": "Private credit & markets",
  "accent": "var(--color-accent)",
  "robots": "noindex,follow",
  "atlas": {
    "intuition": "Asset ownership and reserve recognition remain with the cedant while the treaty allocates risks and returns.",
    "articles": [
      {
        "label": "The Bermuda balance sheet behind an American annuity",
        "href": "/en/analysis/bermuda-reinsurance-jackson-athene/",
        "kind": "article"
      }
    ],
    "sources": [
      {
        "label": "BMA: Collateral Structures in the Bermuda Long-term Insurance Market",
        "href": "https://cdn.bma.bm/documents/2024-09-06-12-10-21-Bermuda-Long-Term-Insurance-Collateral-Structures.pdf",
        "detail": "Page 2, footnote 2; pages 4–5: cedant retains assets and reserves; contractual rights and economic returns.",
        "kind": "source"
      }
    ],
    "related": [
      "funds-withheld",
      "recapture"
    ]
  }
},
  {
    slug: 'funds-withheld', sigle: 'Funds withheld', nom: 'Reinsurance assets retained by the cedant',
    ...privateCreditSection, robots: 'noindex,follow',
    guide: '/en/analysis/pensions-bermuda-recapture-risk/',
    def: 'A reinsurance structure in which the cedant retains assets while the treaty allocates agreed income and risks to the reinsurer. Legal ownership, cash-flow rights and accounting recognition depend on the structure and applicable rules. In its 2025 report, Just describes lifetime mortgages legally held and managed by the group whose returns go to the reinsurer and which are not recognised as its IFRS assets.',
    atlas: {
      intuition: 'The economic allocation of risk can change without transferring ownership of the assets.',
      articles: [{ label: 'When risks return to the insurer', href: '/en/analysis/insurers-asset-managers-07-risks-return/', kind: 'article' }, { label: 'Pensions and Bermuda: the cost of recapture', href: '/en/analysis/pensions-bermuda-recapture-risk/', kind: 'article' }, { label: 'The Bermuda balance sheet behind an American annuity', href: '/en/analysis/bermuda-reinsurance-jackson-athene/', kind: 'article' }],
      sources: [{ label: 'IAIS: Structural shifts in the life insurance sector', href: 'https://www.iais.org/uploads/2025/11/Issues-Paper-on-structural-shifts-in-the-life-insurance-sector.pdf', detail: 'Section 4.1.6.3: ownership, balance sheet, segregated account and periodic settlements.', kind: 'source' }, { label: 'Just Group, Annual Report 2025', href: 'https://www.justgroupplc.co.uk/~/media/Files/J/Just-Retirement-Corp/investor-docs/financial-reports-and-presentations/2026/just-group-annual-report-2025.pdf', detail: 'Note 27(c)(iii), printed page 205 / PDF 207: lifetime mortgages held and managed by Just, returns paid to the reinsurer and no recognition as Just IFRS assets.', kind: 'source' }],
      related: ['reassurance-adossee-a-l-actif', 'recapture', 'reassurance', 'modco'],
    },
  },
  {
    slug: 'headroom', sigle: 'Headroom', nom: 'EU budget guarantee capacity',
    ...macroSection, robots: 'noindex,follow',
    guide: '/en/analysis/europe-ukraine-loan-cost-of-waiting/',
    def: 'The difference between the annual EU own-resources ceiling for payments and the resources needed to finance the budget. It guarantees the Union’s financial obligations and contingent liabilities within the applicable legal limits. A guarantee call may require contributions from member states; headroom is not cash already available.',
    atlas: {
      intuition: 'A budget guarantee mobilises resources when a financial obligation falls due.',
      formula: 'Headroom = own-resources ceiling for payments − own resources needed to finance the budget',
      articles: [{ label: 'Europe’s Ukraine loan: the cost of waiting', href: '/en/analysis/europe-ukraine-loan-cost-of-waiting/', kind: 'article' }],
      sources: [
        { label: 'European Commission: revenue ceilings', href: 'https://commission.europa.eu/strategy-and-policy/eu-budget/long-term-eu-budget/2021-2027/revenue/revenue-ceilings_en', detail: 'Definition of the margin between the payment ceiling and the resources needed for the budget.', kind: 'source' },
        { label: 'Regulation (EU) 2026/469', href: 'https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32026R0469', detail: 'Article 1: the Ukraine loan guarantee remains within the own-resources ceiling.', kind: 'source' },
      ],
      related: ['pret-a-recours-limite', 'era'],
    },
  },
  {
    slug: 'pret-a-recours-limite', sigle: 'Limited-recourse loan', nom: 'Contractually limited recovery rights',
    ...macroSection, robots: 'noindex,follow',
    guide: '/en/analysis/europe-ukraine-loan-cost-of-waiting/',
    def: 'A loan whose recovery rights are limited by the agreed terms. For the 2026–2027 Ukraine Support Loan, the regulation makes principal repayment due upon specified events, including the receipt of Russian reparations. It also provides exceptions for a breach of democratic conditions or established fraud, corruption or other illegal activity in the management of the loan affecting the Union’s financial interests.',
    atlas: {
      intuition: 'Repayment events and exceptions determine the lender’s recovery rights.',
      articles: [{ label: 'Europe’s Ukraine loan: the cost of waiting', href: '/en/analysis/europe-ukraine-loan-cost-of-waiting/', kind: 'article' }],
      sources: [{ label: 'Regulation (EU) 2026/467', href: 'https://eur-lex.europa.eu/eli/reg/2026/467/oj/eng', detail: 'Article 20: limited recourse, repayment events, security and exceptions.', kind: 'source' }],
      related: ['headroom', 'era'],
    },
  },
  {
    slug: 'era', sigle: 'ERA', nom: 'Extraordinary Revenue Acceleration Loans for Ukraine',
    ...macroSection, robots: 'noindex,follow',
    guide: '/en/analysis/europe-ukraine-loan-cost-of-waiting/',
    def: 'A G7 initiative launched in 2024 to provide loans to Ukraine whose servicing and repayment are supported by future extraordinary revenues from immobilised Russian sovereign assets. In the EU, the Ukraine Loan Cooperation Mechanism allocates available resources to eligible loans. These revenues are distinct from the immobilised Russian principal.',
    atlas: {
      intuition: 'Revenues expected over future years support the repayment of loans provided earlier.',
      articles: [{ label: 'Europe’s Ukraine loan: the cost of waiting', href: '/en/analysis/europe-ukraine-loan-cost-of-waiting/', kind: 'article' }],
      sources: [
        { label: 'Regulation (EU) 2024/2773', href: 'https://eur-lex.europa.eu/eli/reg/2024/2773/oj/eng', detail: 'Recital 7 and Articles 3 to 5: the ERA initiative, EU mechanism and available resources.', kind: 'source' },
        { label: 'Council of the EU, 23 October 2024: the G7 loan mechanism', href: 'https://www.consilium.europa.eu/en/press/press-releases/2024/10/23/immobilised-assets-council-greenlights-up-to-35-billion-in-macro-financial-assistance-to-ukraine-and-new-loan-mechanism-implementing-g7-commitment/', detail: 'Allocation of future extraordinary revenues arising from immobilised Russian assets.', kind: 'source' },
      ],
      related: ['headroom', 'pret-a-recours-limite'],
    },
  },
  {"slug": "el-nino", "sigle": "El Niño", "nom": "The warm phase of ENSO", "def": "The warm phase of the El Niño–Southern Oscillation (ENSO), a coupled ocean–atmosphere phenomenon in the tropical Pacific. Weaker trade winds and shifts in warm water and convection change rainfall patterns. Local effects also depend on the season and other climate conditions.", "guide": "/en/analysis/el-nino-backup-same-rain/", "sectionTitle": "Energy & geopolitics", "accent": "var(--color-amber)", "robots": "noindex,follow", "atlas": {"intuition": "Assess local conditions before tracing the economic dependencies of the ocean signal.", "articles": [{"label": "El Niño: when the backup depends on the same rain", "href": "/en/analysis/el-nino-backup-same-rain/", "kind": "article"}], "sources": [{"label": "NOAA JetStream : Effects of ENSO in the Pacific", "href": "https://www.noaa.gov/jetstream/tropical/enso/enso-patterns", "kind": "source"}], "related": ["roni"]}},
  {"slug": "roni", "sigle": "RONI", "nom": "Relative Oceanic Niño Index", "def": "NOAA index based on a three-month running mean of the sea-surface temperature anomaly in the Niño 3.4 region, after subtracting the tropical mean anomaly and applying a variance adjustment. It measures a relative ocean contrast; the probability of crossing its threshold does not measure the probability of economic losses.", "guide": "/en/analysis/el-nino-backup-same-rain/", "sectionTitle": "Energy & geopolitics", "accent": "var(--color-amber)", "robots": "noindex,follow", "atlas": {"intuition": "Read the threshold, period and index construction before interpreting its probability.", "articles": [{"label": "El Niño: when the backup depends on the same rain", "href": "/en/analysis/el-nino-backup-same-rain/", "kind": "article"}], "sources": [{"label": "NOAA CPC : Relative Oceanic Niño Index", "href": "https://www.cpc.ncep.noaa.gov/products/analysis_monitoring/enso/roni/", "kind": "source"}], "related": ["el-nino"]}},

  {
    slug: 'cra', sigle: 'CRA', nom: 'Cyber Resilience Act',
    sectionTitle: 'Digital economy & data', accent: 'var(--color-signal)', robots: 'noindex,follow',
    guide: '/en/analysis/cyber-resilience-act-vulnerability-reporting/',
    def: 'Regulation (EU) 2024/2847 on cybersecurity for products with digital elements. Since 11 September 2026, manufacturers within its scope must report actively exploited vulnerabilities and severe incidents affecting the security of their products. The main security requirements and the specific regime for open-source software stewards apply from 11 December 2027.',
    atlas: {
      intuition: 'Regulatory reporting begins while the technical response is still being prepared.',
      articles: [{ label: 'Cyber Resilience Act: the vulnerability-reporting system', href: '/en/analysis/cyber-resilience-act-vulnerability-reporting/', kind: 'article' }],
      sources: [{ label: 'Regulation (EU) 2024/2847, Cyber Resilience Act', href: 'https://eur-lex.europa.eu/eli/reg/2024/2847/oj', detail: 'Articles 14, 24 and 71: reporting, stewards and application dates.', kind: 'source' }],
      related: ['csirt', 'intendant-de-logiciels-ouverts'],
    },
  },
  {
    slug: 'csirt', sigle: 'CSIRT', nom: 'Computer security incident response team',
    sectionTitle: 'Digital economy & data', accent: 'var(--color-signal)', robots: 'noindex,follow',
    guide: '/en/analysis/cyber-resilience-act-vulnerability-reporting/',
    def: 'A team handling computer security incidents, analysing vulnerabilities and assisting the organisations concerned. Under the CRA, the CSIRT designated as coordinator normally receives reports alongside ENISA and arranges onward sharing with other relevant coordinators under the regulation’s confidentiality rules.',
    atlas: {
      intuition: 'A response team brings warnings together and coordinates sharing that supports protection.',
      articles: [{ label: 'Cyber Resilience Act: the vulnerability-reporting system', href: '/en/analysis/cyber-resilience-act-vulnerability-reporting/', kind: 'article' }],
      sources: [
        { label: 'Directive (EU) 2022/2555, NIS 2', href: 'https://eur-lex.europa.eu/eli/dir/2022/2555/oj', detail: 'Articles 10 to 12: response teams, tasks and coordinated vulnerability disclosure.', kind: 'source' },
        { label: 'Regulation (EU) 2024/2847, Cyber Resilience Act', href: 'https://eur-lex.europa.eu/eli/reg/2024/2847/oj', detail: 'Articles 14 to 17: recipients, confidentiality and onward sharing of reports.', kind: 'source' },
      ],
      related: ['cra', 'intendant-de-logiciels-ouverts'],
    },
  },
  {
    slug: 'intendant-de-logiciels-ouverts', sigle: 'Open-source software steward', nom: 'An organisation supporting open-source development',
    sectionTitle: 'Digital economy & data', accent: 'var(--color-signal)', robots: 'noindex,follow',
    guide: '/en/analysis/cyber-resilience-act-vulnerability-reporting/',
    def: 'A legal entity distinct from the manufacturer that provides organised, ongoing support for the development of free and open-source software intended for commercial activities and ensures its viability. From 11 December 2027, the CRA requires it to maintain a cybersecurity policy, cooperate with authorities and fulfil reporting duties tailored to its role.',
    atlas: {
      intuition: 'Sustained support for an open-source project has a regime distinct from that of the product’s manufacturer.',
      articles: [{ label: 'Cyber Resilience Act: the vulnerability-reporting system', href: '/en/analysis/cyber-resilience-act-vulnerability-reporting/', kind: 'article' }],
      sources: [{ label: 'Regulation (EU) 2024/2847, Cyber Resilience Act', href: 'https://eur-lex.europa.eu/eli/reg/2024/2847/oj', detail: 'Articles 3(14), 24 and 71: definition, tailored obligations and application in December 2027.', kind: 'source' }],
      related: ['cra', 'csirt'],
    },
  },
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
      articles: [{ label: 'The price of time in French debt', href: '/en/analysis/french-debt-price-of-time/', kind: 'article' }, {"label": "France, Moody’s and the price of debt", "href": "/en/analysis/france-moodys-reprieve-2027-borrowing-costs/", "kind": "article"}],
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
      articles: [{ label: 'Government debt: the price of getting out', href: '/en/analysis/dette-etats-06-prix-sortie/', kind: 'article' }, { label: 'The price of time in French debt', href: '/en/analysis/french-debt-price-of-time/', kind: 'article' }],
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
    slug: 'collateral', sigle: 'Collateral', nom: 'An asset provided to secure borrowing',
    def: 'An asset provided to secure a debt, through a pledge or transfer of title according to the arrangement. If the borrower fails to meet its obligations, the lender may realise the asset under the contract and applicable law. For Eurosystem operations, collateral must be eligible and its recognised value reflects haircuts and other risk controls. Providing collateral creates borrowing capacity without creating bank equity.',
    guide: '/en/analysis/ecb-collateral-bank-credit-november-2026/',
    ...macroSection,
    robots: 'noindex,follow',
    atlas: {
      intuition: 'The value of an asset a bank owns and the borrowing it can support are different measures.',
      formula: 'simplified coverage = sum, for each eligible asset, of its value × (1 - its haircut as a fraction), excluding further adjustments',
      articles: [{ label: 'Government debt: the collateral chain', href: '/en/analysis/dette-etats-04-chaine-garanties/', kind: 'article' }, { label: 'ECB collateral rules and bank credit in November 2026', href: '/en/analysis/ecb-collateral-bank-credit-november-2026/', kind: 'article' }, {"label": "GPU-backed debt: pricing the fourth year", "href": "/en/analysis/gpu-backed-debt-fourth-year/", "detail": "Contracts, renewal cash flows and hypothetical loan scenarios.", "kind": "article"}, { label: 'Nebius: a 364-day Citi facility for GPU expansion', href: '/en/analysis/nebius-citi-364-day-gpu-credit/', detail: 'Distinct collateral footprints and limits to the disclosed ranking among creditors.', kind: 'article' }, {"label": "GM, VAC and financing the Sumter magnet factory", "href": "/en/analysis/us-rare-earth-magnets-gm-vac-offtake-risk/", "kind": "article"}],
      sources: [
        { label: 'ESMA, SFTR Article 15', href: 'https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/sftr/article-15-reuse-financial-instruments', detail: 'Security collateral, title transfer and conditions for reuse.', kind: 'source' },
        { label: 'ECB, What is collateral?', href: 'https://www.ecb.europa.eu/ecb-and-you/explainers/tell-me/html/collateral.en.html', detail: 'Pledged assets and realisation following a default.', kind: 'source' },
        { label: 'ECB, What are haircuts?', href: 'https://www.ecb.europa.eu/ecb-and-you/explainers/tell-me-more/html/haircuts.en.html', detail: 'Post-haircut value and coverage of borrowing.', kind: 'source' },
      ],
      related: ['decote-de-garantie', 'ecaf', 'repo', 'abs', 'ddtl', "financement-sans-recours"],
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
      articles: [{ label: 'The insurer’s money, the group’s business', href: '/en/analysis/insurers-affiliated-investments-apollo-brookfield-kkr/', kind: 'article' }, { label: 'ECB collateral rules and bank credit in November 2026', href: '/en/analysis/ecb-collateral-bank-credit-november-2026/', kind: 'article' }],
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
  {"slug": "contrefactuel", "sigle": "Counterfactual", "nom": "Estimated outcome without an intervention", "def": "An estimated outcome that would have occurred without an intervention, allowing for other relevant conditions. It provides a comparison with the observed result and depends on the model and its assumptions. A price decline following an announcement alone does not establish the announcement’s effect.", "guide": "/en/analysis/emergency-oil-reserves-pass-through-pump-prices/", "sectionTitle": "Macro & central banks", "accent": "var(--color-signal)", "robots": "noindex,follow", "atlas": {"intuition": "Estimated outcome without an intervention.", "articles": [{"label": "Emergency oil reserves: from the market to the pump", "href": "/en/analysis/emergency-oil-reserves-pass-through-pump-prices/", "kind": "article"}, {"label": "Dutreil: family business inheritance tax relief", "href": "/en/analysis/dutreil-family-business-inheritance-tax-relief/", "kind": "article"}, {"label": "France’s 2027 budget: income losses against the baseline", "href": "/en/analysis/france-2027-budget-distribution-economic-risk/", "kind": "article"}, {"label": "Cum-cum: tax-loss estimates and recoveries", "href": "/en/analysis/cumcum-03-tax-loss-estimates/", "kind": "article"}], "sources": [{"label": "Kilian and Zhou, Dallas Fed Working Paper 1916, version dated 19 December 2019", "href": "https://www.dallasfed.org/research/papers/2019/wp1916", "kind": "source"}], "related": ["spr"]}},
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
      },
      {"label": "Tokenized markets: who funds the weekend?", "href": "/en/analysis/tokenized-markets-weekend-funding/", "kind": "article"}
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
      "timelock",
      "oracle-de-prix"
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
      },
      {
        "label": "Google Cloud: the London outage and banking services",
        "href": "/en/analysis/google-cloud-banks-london-power-control-failure/",
        "detail": "Distinguishing European oversight from the UK critical-third-party regime.",
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
      },
      {
        "label": "Google Cloud: the London outage and banking services",
        "href": "/en/analysis/google-cloud-banks-london-power-control-failure/",
        "detail": "Critical designation does not settle compliance during an incident.",
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
        },
        {
          "label": "Nebius: a 364-day Citi facility for GPU expansion",
          "href": "/en/analysis/nebius-citi-364-day-gpu-credit/",
          "detail": "Performance obligations, customer advances and revenue-recognition timing.",
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
  "slug": "offtake",
  "sigle": "Offtake",
  "nom": "Purchase agreement for future output",
  "def": "An agreement to buy future output on specified volume, price and delivery terms. For a carbon project, a committed buyer can support fundraising. Payment dates, advances and the allocation of delivery risk depend on the contract; an announced purchase volume alone does not establish how much cash has been paid.",
  "guide": "/en/analysis/google-mckinsey-pasture-carbon-timber/",
  "sectionTitle": "Macro & central banks",
  "accent": "var(--color-signal)",
  "robots": "noindex,follow",
  "atlas": {
    "articles": [
      {
        "label": "Google and McKinsey: pasture carbon and timber",
        "href": "/en/analysis/google-mckinsey-pasture-carbon-timber/",
        "kind": "article"
      }, {"label": "GM, VAC and financing the Sumter magnet factory", "href": "/en/analysis/us-rare-earth-magnets-gm-vac-offtake-risk/", "kind": "article"}],
    "sources": [
      {
        "label": "Symbiosis / CrossBoundary, Carbon Offtake Guide",
        "href": "https://crossboundary.com/carbon-offtake-guide/",
        "kind": "source"
      }, {"label": "Energy Fuels / SEC, industrial supply agreement and reserved capacity", "href": "https://www.sec.gov/Archives/edgar/data/1385849/000106299326005306/form8k.htm", "kind": "source"}],
    "related": [
      "credit-carbone",
      "additionnalite",
      "silvopastoralisme",
      "permanence-du-carbone", "financement-sans-recours"]
  }
},
{
  "slug": "silvopastoralisme",
  "sigle": "Silvopasture",
  "nom": "Trees, forage and grazing animals on the same land",
  "def": "An agroforestry system combining trees, forage and grazing animals on the same land. Effects on livestock output and carbon storage depend on species, tree density, climate and management. Assessing a climate benefit requires comparison with a credible trajectory without the intervention.",
  "guide": "/en/analysis/google-mckinsey-pasture-carbon-timber/",
  "sectionTitle": "Macro & central banks",
  "accent": "var(--color-signal)",
  "robots": "noindex,follow",
  "atlas": {
    "articles": [
      {
        "label": "Google and McKinsey: pasture carbon and timber",
        "href": "/en/analysis/google-mckinsey-pasture-carbon-timber/",
        "kind": "article"
      }
    ],
    "sources": [
      {
        "label": "Google, Working Trees and silvopasture",
        "href": "https://blog.google/company-news/outreach-and-initiatives/sustainability/brazil-silvopasture/",
        "kind": "source"
      }
    ],
    "related": [
      "credit-carbone",
      "additionnalite",
      "offtake",
      "permanence-du-carbone"
    ]
  }
},
{
  "slug": "permanence-du-carbone",
  "sigle": "Carbon permanence",
  "nom": "Continued storage underlying a climate claim",
  "def": "Continued storage of carbon underlying a credited climate benefit. Fire, tree mortality or land-use change can reverse storage. The programme and project commitments must specify monitoring, the duration of obligations and how losses are addressed. Financial compensation and restoration of atmospheric benefit follow different processes.",
  "guide": "/en/analysis/google-mckinsey-pasture-carbon-timber/",
  "sectionTitle": "Macro & central banks",
  "accent": "var(--color-signal)",
  "robots": "noindex,follow",
  "atlas": {
    "articles": [
      {
        "label": "Google and McKinsey: pasture carbon and timber",
        "href": "/en/analysis/google-mckinsey-pasture-carbon-timber/",
        "kind": "article"
      }
    ],
    "sources": [
      {
        "label": "ICVCM, Core Carbon Principles",
        "href": "https://icvcm.org/core-carbon-principles/",
        "kind": "source"
      }
    ],
    "related": [
      "credit-carbone",
      "additionnalite",
      "offtake",
      "silvopastoralisme"
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
      },
      {
        "label": "Google and McKinsey: pasture carbon and timber",
        "href": "/en/analysis/google-mckinsey-pasture-carbon-timber/",
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
      },
      {
        "label": "Google and McKinsey: pasture carbon and timber",
        "href": "/en/analysis/google-mckinsey-pasture-carbon-timber/",
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
  {"slug": "tpi", "sigle": "TPI", "nom": "Transmission Protection Instrument", "def": "ECB instrument announced in July 2022 for secondary-market purchases in response to unwarranted tensions threatening monetary-policy transmission. The Governing Council assesses fiscal policies and debt sustainability, among other criteria. An excessive deficit procedure alone does not exclude a country taking the required effective corrective action. Activation remains discretionary.", "guide": "/en/guides/read-european-sovereign-debt/", "sectionTitle": "Macro & central banks", "accent": "var(--color-signal)", "atlas": {"intuition": "Potential monetary support depends on economic and fiscal criteria and a decision by the Governing Council.", "articles": [{"label": "Sovereign debt: the buyer of last resort", "href": "/en/analysis/dette-etats-07-dernier-acheteur/", "kind": "article"}, {"label": "LFI and RN: debt, taxes and French political risk", "href": "/en/analysis/france-political-risk-lfi-rn-debt-tax-markets/", "kind": "article"}], "sources": [{"label": "ECB, Transmission Protection Instrument, 21 July 2022", "href": "https://www.ecb.europa.eu/press/pr/date/2022/html/ecb.pr220721~973e6e7273.en.html", "kind": "source"}]}},
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
  {"slug": "marche-predictif", "sigle": "Prediction market", "nom": "Event contracts", "sectionTitle": "US regulation & institutions", "accent": "var(--color-topic-blue)", "def": "A market for contracts whose payout depends on the outcome of a defined event. Prices may be interpreted as implied probabilities, subject to liquidity, fees and resolution rules. Legal treatment depends on the contract, operating entity, jurisdiction and customer; US authorisation does not confer access rights in France.", "guide": "/en/analysis/polymarket-europe-betting-financial-products/", "atlas": {"articles": [{"label": "Polymarket and European financial regulation", "href": "/en/analysis/polymarket-europe-betting-financial-products/", "kind": "article"}, {"label": "FIFA and Predictstreet: trading volume and risk", "href": "/en/analysis/fifa-predictstreet-trading-volume-risk/", "kind": "article"}], "sources": [{"label": "ESMA, event contracts and binary options, 3 July 2026", "href": "https://www.esma.europa.eu/sites/default/files/2026-07/ESMA35-243228190-8148_Public_Statement_on_the_application_of_the_national_product_intervention_measures_on_binary_options_to_event_contracts.pdf", "kind": "source"}]}},
  {
    slug: 'mvno', sigle: 'MVNO', nom: 'Mobile virtual network operator', sectionTitle: 'Digital economy & data', accent: 'var(--color-signal)',
    def: 'An operator that buys wholesale access to one or more mobile networks to sell its own services, without owning a radio network. It designs its offers and remains responsible for the services supplied to its customers. Its ability to compete depends partly on wholesale prices and the terms for switching host networks.',
    guide: '/en/analysis/sfr-breakup-phone-bill-networks-competition/',
    atlas: {
      articles: [{ label: 'SFR: what a break-up would mean for your phone bill', href: '/en/analysis/sfr-breakup-phone-bill-networks-competition/', kind: 'article' }],
      sources: [{ label: 'Arcep, MVNO definition and list', href: 'https://www.arcep.fr/mes-demarches-et-services/acteurs-regules/operateurs-telecoms/liste-des-mvno.html', kind: 'source' }],
    },
  },
  {"slug":"rachat-d-actions","sigle":"Share buyback","nom":"Share buyback","def":"A company’s purchase of its own shares. Buybacks may reduce shares outstanding or offset issuance, including shares delivered through employee plans. Cash spent, shares repurchased and the net change in shares outstanding measure different effects. The price paid and alternative uses of cash matter when assessing value creation.","guide":"/en/analysis/share-buybacks-anti-dilution-microsoft-airbus/","sectionTitle":"Private credit & markets","accent":"var(--color-accent)","atlas":{"articles":[{"label":"Share buybacks and dilution","href":"/en/analysis/share-buybacks-anti-dilution-microsoft-airbus/","kind":"article"},{"label":"Barclays: the evidence behind AI and job cuts","href":"/en/analysis/barclays-ai-job-cuts-productivity-evidence/","kind":"article"}],"sources":[{"label":"Microsoft / SEC, Note 15, Stockholders’ Equity","href":"https://www.sec.gov/Archives/edgar/data/789019/000119312526323660/R25.htm","kind":"source"}],"related":["actions-propres","remuneration-en-actions"]}},
  {"slug":"actions-propres","sigle":"Treasury shares","nom":"Treasury shares","def":"Shares in a company’s own equity held by that company. They are excluded from shares outstanding while held, but need not be cancelled: they may be transferred later. IAS 32 deducts treasury shares from equity rather than recognising them as a financial asset.","guide":"/en/analysis/share-buybacks-anti-dilution-microsoft-airbus/","sectionTitle":"Private credit & markets","accent":"var(--color-accent)","atlas":{"articles":[{"label":"Share buybacks and dilution","href":"/en/analysis/share-buybacks-anti-dilution-microsoft-airbus/","kind":"article"},{"label":"Barclays: the evidence behind AI and job cuts","href":"/en/analysis/barclays-ai-job-cuts-productivity-evidence/","kind":"article"}],"sources":[{"label":"AASB 132 / IAS 32, paragraphs 33 and AG36","href":"https://standards.aasb.gov.au/aasb-132-dec-2021","kind":"source"},{"label":"Microsoft / SEC, Note 2, Earnings per Share","href":"https://www.sec.gov/Archives/edgar/data/789019/000119312526323660/R12.htm","kind":"source"}],"related":["rachat-d-actions","remuneration-en-actions"]}},
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
    "slug": "reglement-atomique",
    "sigle": "Atomic settlement",
    "nom": "Linked settlement of transaction legs",
    "def": "A settlement arrangement that makes the linked legs of a transaction indivisible. In delivery versus payment, final delivery is conditional on the corresponding payment settling. This addresses principal risk during the exchange. Legal and operational safeguards, the credit quality of the settlement asset and available funding still matter.",
    "guide": "/en/analysis/tokenized-markets-weekend-funding/",
    "sectionTitle": "Crypto & stablecoins",
    "accent": "var(--color-amber)",
    "robots": "noindex,follow",
    "atlas": {
      "intuition": "Linking delivery to payment still requires available settlement funds.",
      "articles": [
        {
          "label": "Tokenized markets: who funds the weekend?",
          "href": "/en/analysis/tokenized-markets-weekend-funding/",
          "kind": "article"
        }
      ],
      "sources": [
        {
          "label": "BIS/CPMI, tokenisation: settlement and risks",
          "href": "https://www.bis.org/publications/tokenisation-context-money-and-other-assets-concepts-and-implications-central-banks.pdf",
          "detail": "Pages 12–13, section 4 and Annex 1: atomicity, principal risk and liquidity.",
          "kind": "source"
        }
      ],
      "related": [
        "tokenisation-des-actifs",
        "compensation-nette",
        "oracle-de-prix"
      ]
    }
  },
  {
    "slug": "compensation-nette",
    "sigle": "Netting",
    "nom": "Offsetting obligations into net positions",
    "def": "Agreed offsetting of obligations into net amounts payable or receivable under the applicable legal framework. In a fictional bilateral example, obligations of 100 and 90 in the same currency and at the same maturity leave a net payment of 10. Liquidity savings depend on which obligations can legally and operationally be included.",
    "guide": "/en/analysis/tokenized-markets-weekend-funding/",
    "sectionTitle": "Crypto & stablecoins",
    "accent": "var(--color-amber)",
    "robots": "noindex,follow",
    "atlas": {
      "intuition": "The net amount due differs from total gross payment turnover.",
      "articles": [
        {
          "label": "Tokenized markets: who funds the weekend?",
          "href": "/en/analysis/tokenized-markets-weekend-funding/",
          "kind": "article"
        }
      ],
      "sources": [
        {
          "label": "ECB glossary: netting",
          "href": "https://www.bankingsupervision.europa.eu/services/glossary/html/glossn.en.html",
          "detail": "Agreed offsetting and legal reduction of obligations to a bilateral or multilateral net amount.",
          "kind": "source"
        },
        {
          "label": "BIS/CPMI, settlement and liquidity requirements",
          "href": "https://www.bis.org/publications/tokenisation-context-money-and-other-assets-concepts-and-implications-central-banks.pdf",
          "detail": "Pages 12–13: immediate settlement, netting and reuse of funds.",
          "kind": "source"
        }
      ],
      "related": [
        "reglement-atomique",
        "tokenisation-des-actifs",
        "ensemble-de-compensation"
      ]
    }
  },
  {
    "slug": "oracle-de-prix",
    "sigle": "Price oracle",
    "nom": "Price input supplied to an application",
    "def": "A mechanism that supplies an application, such as a smart contract, with an external price. Its output depends on the sources, aggregation rules and update schedule. Lending systems may use it to assess collateral coverage. The reported value can differ from the price a large sale would obtain.",
    "guide": "/en/analysis/tokenized-markets-weekend-funding/",
    "sectionTitle": "Crypto & stablecoins",
    "accent": "var(--color-amber)",
    "robots": "noindex,follow",
    "atlas": {
      "intuition": "A contract’s pricing input and an executable sale price describe different things.",
      "articles": [
        {
          "label": "Tokenized markets: who funds the weekend?",
          "href": "/en/analysis/tokenized-markets-weekend-funding/",
          "kind": "article"
        }
      ],
      "sources": [
        {
          "label": "Duley et al., BIS Bulletin 76: the oracle problem",
          "href": "https://www.bis.org/publications/bulletin-76-oracle-problem-and-future-defi",
          "detail": "External data inputs, price sources and reliance on their integrity.",
          "kind": "source"
        }
      ],
      "related": [
        "facteur-de-sante",
        "tokenisation-des-actifs",
        "reglement-atomique"
      ]
    }
  },
  {
    slug: 'tokenisation-des-actifs', sigle: 'Asset tokenisation', nom: 'Digital representation of assets or legal claims',
    def: 'Digital representation of an asset or a legal claim on a programmable ledger. A token may represent the security itself, a certificate issued by a third party or another contractual right. The technology can simplify transfers and settlement; rights, collateral and liquidity depend on the instrument and its legal arrangements.',
    guide: '/en/analysis/tokenized-stocks-xstocks-vaults-credit-yield/',
    ...cryptoSection,
    atlas: {
      intuition: 'A token may move quickly while still depending on an issuer, a custodian and redemption conditions.',
      articles: [{ label: 'Tokenised stocks: the credit behind the extra yield', href: '/en/analysis/tokenized-stocks-xstocks-vaults-credit-yield/', kind: 'article' }, {"label": "Tokenized markets: who funds the weekend?", "href": "/en/analysis/tokenized-markets-weekend-funding/", "kind": "article"}],
      sources: [{ label: 'BIS, the next-generation monetary and financial system', href: 'https://www.bis.org/publications/aer-2025/next-generation-monetary-financial-system', kind: 'source' }, { label: 'ESMA, qualification of crypto-assets as financial instruments', href: 'https://www.esma.europa.eu/sites/default/files/2025-03/ESMA75453128700-1323_Guidelines_on_the_conditions_and_criteria_for_the_qualification_of_CAs_as_FIs.pdf', kind: 'source' }],
      related: ['smart-contract', 'stablecoin', 'reglement-atomique', 'compensation-nette', 'oracle-de-prix'],
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
    def: "A life insurance obligation expressed in units whose euro value tracks a financial or property investment. The insurer commits to a number of units, which policy charges can reduce; the policyholder bears changes in unit value, subject to any additional contractual guarantees. The policy surrender timetable and the underlying fund’s liquidity are separate questions.",
    guide: '/en/analysis/scpi-life-insurance-banks-contagion/', sectionTitle: 'Private credit & markets', accent: 'var(--color-accent)',
    atlas: { articles: [{ label: 'The strength of an insurer’s promise', href: '/en/analysis/insurers-asset-managers-08-promise/', kind: 'article' }], sources: [{ label: 'ABE Infoservice', href: 'https://www.abe-infoservice.fr/fr/assurance/assurance-vie/que-faut-il-savoir-avant-de-souscrire-beneficier-dun-conseil-adapte-comprendre-et-comparer-les', detail: 'Unit-linked commitments and capital-loss risk. French source.', kind: 'source' }, { label: 'Spirica, Linxea Spirit 2 policy terms, 1 September 2026', href: 'https://www.linxea.com/assets/uploads/2020/08/SPK_LINXEA_CG4445_20260901_VDEF-1.pdf', detail: 'Section 12.2, printed p. 15 / PDF 16; table, printed p. 18 / PDF 19: policy charges deducted by reducing the number of units. French source.', kind: 'source' }], related: ['scpi', 'niveau-3-ifrs-9'] },
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
      articles: [{"label": "Iron ore: the price of waiting", "href": "/en/analysis/iron-ore-price-of-waiting-fortescue-cmrg/", "detail": "A port-delivered benchmark and the distinction between freight, sale and payment.", "kind": "article"}],
      sources: [{ label: "ICC Academy, CFR and CIF", href: 'https://academy.iccwbo.org/incoterms/article/incoterms-2020-cfr-or-cif/', kind: 'source' }],
    },
  },
  {
    slug: 'c1',
    sigle: 'C1',
    nom: 'Cash cost C1',
    def: "A mining-industry operating-cost measure, generally stated per unit of metal and net of by-product credits. Always check the reported definition, included costs and denominator. At Kamoa-Kakula it is a non-IFRS measure per payable pound of copper produced, distinct from the full cost of the investment. Fortescue reports hematite C1 per wet metric tonne, with a scope distinct from delivered cost.",
    guide: '/en/analysis/sulfur-gulf-crisis-fertilizers-nickel/',
    sectionTitle: 'Industry and commodities',
    accent: 'var(--color-amber)',
    atlas: {
      articles: [{"label": "Iron ore: the price of waiting", "href": "/en/analysis/iron-ore-price-of-waiting-fortescue-cmrg/", "detail": "Hematite C1 per wet tonne and realised price per dry tonne.", "kind": "article"}],
      related: ['wmt', 'dmt'],
      sources: [{ label: "Ivanhoe Mines, Q2 2026 results", href: 'https://www.ivanhoemines.com/news-stories/news-release/ivanhoe-mines-issues-2026-second-quarter-financial-results-overview-of-operations-and-exploration-activities/', kind: 'source' }, {"label": "Fortescue, September 2026 quarterly report", "href": "https://edge.sitecorecloud.io/fortescue17114-fortescueeb60-productionbbdb-8be5/media/project/fortescueportal/shared/documents/regulatory/asx-announcements/automated/03151489-september-2026-quarterly-production-report.pdf", "detail": "PDF p. 2: hematite C1 per wet tonne, distinct from realised price per dry tonne.", "kind": "source"}],
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
    slug: 'entrepot-sous-douane', sigle: 'Customs bonded warehouse', nom: 'US storage under customs control',
    def: 'A warehouse under customs control where imported merchandise can be held before entry for consumption. In the United States, goods entered for warehousing generally attract the duty rate in effect on withdrawal for consumption, subject to specific provisions. Withdrawal requires formalities and an estimated-duty deposit. COMEX approval does not establish the customs status of individual lots.',
    guide: '/en/analysis/copper-us-stockpiles-conditions-for-return/', ...energySection, robots: 'noindex,follow',
    atlas: {
      articles: [{ label: 'Copper: conditions for US stockpiles to return overseas', href: '/en/analysis/copper-us-stockpiles-conditions-for-return/', kind: 'article' }],
      sources: [
        { label: 'eCFR, 19 CFR 141.69', href: 'https://www.ecfr.gov/current/title-19/chapter-I/part-141/subpart-E/section-141.69', detail: 'General rule and the warehousing exception; specific provisions can override the treatment.', kind: 'source' },
        { label: 'eCFR, 19 CFR 144.38', href: 'https://www.ecfr.gov/current/title-19/chapter-I/part-144/subpart-D/section-144.38', detail: 'Formalities, estimated-duty deposit and permit for withdrawal for consumption.', kind: 'source' },
      ],
      related: ['warrant-d-entrepot'],
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
      articles: [{ label: 'Dutreil: family business inheritance tax relief', href: '/en/analysis/dutreil-family-business-inheritance-tax-relief/', kind: 'article' }],
      sources: [{ label: 'France, 2025 draft budget, revenue assessment, volume II', href: 'https://www2.assemblee-nationale.fr/static/17/Annexes-DL/PLF-2025/Voies_et_moyens_Tome_2_2025.pdf#page=35', detail: 'Tax benchmarks, behavioural effects and interactions between measures.', kind: 'source' }],
      related: ['equivalent-subvention', 'pacte-dutreil', 'soulte'],
    },
  },
  {
    slug: 'pacte-dutreil',
    sigle: 'Dutreil relief',
    nom: 'French business-transfer tax relief',
    def: 'French relief for qualifying business gifts and inheritances, exempting 75% of eligible value from transfer tax. Conditions cover business activity, retention and management or continued operation. A separate 50% reduction in tax due is limited to qualifying outright gifts by donors under 70.',
    guide: '/en/analysis/dutreil-family-business-inheritance-tax-relief/',
    ...macroSection,
    robots: 'noindex,follow',
    atlas: {
      intuition: 'The exemption reduces taxable value; any reduction under article 790 then applies to the tax due.',
      articles: [{ label: 'Dutreil: family business inheritance tax relief', href: '/en/analysis/dutreil-family-business-inheritance-tax-relief/', kind: 'article' }],
      sources: [
        { label: 'French General Tax Code, article 787 B', href: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000053542700', detail: 'Partial relief for shares and conditions in force since 21 February 2026.', kind: 'source' },
        { label: 'French General Tax Code, article 787 C', href: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000053542704', detail: 'Partial relief for sole-trader business assets and continued operation.', kind: 'source' },
        { label: 'French General Tax Code, article 790', href: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000024430025', detail: 'A 50% reduction in tax due on qualifying outright gifts by donors under 70.', kind: 'source' },
      ],
      related: ['depense-fiscale', 'soulte'],
    },
  },
  {
    slug: 'soulte',
    sigle: 'Equalisation payment',
    nom: 'Soulte in a division of assets',
    def: 'A payment owed by a recipient whose allotted assets exceed their entitlement, used to balance a division of property. In a lifetime business gift divided among children, it can compensate a child who receives no shares. Its financing and tax treatment depend on the transaction.',
    guide: '/en/analysis/dutreil-family-business-inheritance-tax-relief/',
    ...macroSection,
    robots: 'noindex,follow',
    atlas: {
      intuition: 'A recipient receiving the shares may owe a payment to others, creating a financing need when the business is allocated.',
      articles: [{ label: 'Dutreil: family business inheritance tax relief', href: '/en/analysis/dutreil-family-business-inheritance-tax-relief/', kind: 'article' }],
      sources: [
        { label: 'French Civil Code, article 826', href: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006432575', detail: 'Equal value of allotted assets and compensation through a soulte.', kind: 'source' },
        { label: 'French tax administration, share transfers, 10 August 2026', href: 'https://bofip.impots.gouv.fr/bofip/6509-PGP.html/identifiant=BOI-ENR-DMTG-10-20-40-10-20260810', detail: 'Paragraph 340: lifetime gifts divided with an equalisation payment, theoretical entitlements and retention by the actual recipient of the shares.', kind: 'source' },
      ],
      related: ['pacte-dutreil', 'depense-fiscale'],
    },
  },
  {"slug": "cnrf", "sigle": "CNRF", "nom": "Contingent Non-Bank Financial Institution Repo Facility", "def": "A Bank of England facility open for applications since January 2025 to certain admitted insurers, pension schemes and LDI funds. It lends cash against gilts for a short term and is activated at the Bank’s discretion during severe dysfunction threatening UK financial stability. Pricing is calibrated at activation; admission does not establish actual borrowing.", "guide": "/en/analysis/dette-etats-07-dernier-acheteur/", "sectionTitle": "Macro & central banks", "accent": "var(--color-signal)", "robots": "noindex,follow", "atlas": {"intuition": "Conditional public liquidity can reduce the need for urgent gilt sales.", "articles": [{"label": "Sovereign debt: the buyer of last resort", "href": "/en/analysis/dette-etats-07-dernier-acheteur/", "kind": "article"}], "sources": [{"label": "Bank of England, CNRF market notice", "href": "https://www.bankofengland.co.uk/markets/market-notices/2025/january/contingent-nbfi-repo-facility-market-notice-28-january-2025", "kind": "source"}], "related": ["repo", "ldi", "haircut-repo"]}},
  {"slug": "apf", "sigle": "APF", "nom": "Asset Purchase Facility", "def": "The Bank of England vehicle holding monetary-policy assets, financed by a Bank loan and covered by a Treasury indemnity. Cash transfers can flow to the Treasury or in the reverse direction. They do not by themselves measure QE’s comprehensive fiscal impact or the return from the temporary LDI financial-stability purchases.", "guide": "/en/analysis/dette-etats-07-dernier-acheteur/", "sectionTitle": "Macro & central banks", "accent": "var(--color-signal)", "robots": "noindex,follow", "atlas": {"intuition": "Monetary-portfolio cash flows and an emergency intervention’s return cover different operations.", "articles": [{"label": "Sovereign debt: the buyer of last resort", "href": "/en/analysis/dette-etats-07-dernier-acheteur/", "kind": "article"}], "sources": [{"label": "Bank of England, APF 2026 Q2 report", "href": "https://www.bankofengland.co.uk/asset-purchase-facility/2026/2026-q2", "kind": "source"}], "related": ["qe", "coupon-obligataire"]}},
  {"slug": "qe", "sigle": "QE", "nom": "Quantitative easing", "def": "Central-bank asset purchases intended to ease monetary conditions, affecting yields and financing. Their fiscal effects include portfolio cash flows and broader influences on public borrowing costs and the economy. Purchases undertaken for financial stability have a distinct purpose.", "guide": "/en/analysis/dette-etats-07-dernier-acheteur/", "sectionTitle": "Macro & central banks", "accent": "var(--color-signal)", "robots": "noindex,follow", "atlas": {"intuition": "Monetary purchases influence financing; their effects extend beyond portfolio cash flows.", "articles": [{"label": "Sovereign debt: the buyer of last resort", "href": "/en/analysis/dette-etats-07-dernier-acheteur/", "kind": "article"}], "sources": [{"label": "Bank of England, APF 2026 Q2 report", "href": "https://www.bankofengland.co.uk/asset-purchase-facility/2026/2026-q2", "kind": "source"}], "related": ["apf", "tpi"]}},
  {
    slug: 'fima',
    sigle: 'FIMA',
    nom: 'Foreign and International Monetary Authorities Repo Facility',
    def: 'A Federal Reserve facility through which approved foreign and international monetary authorities temporarily obtain dollars against Treasuries held at the New York Fed. Repos last overnight or seven calendar days: dollars plus interest must be repaid to recover the securities. This funding of official reserves is distinct from private foreign-currency borrowing.',
    guide: '/en/analysis/bessent-yen-us-debt-fima-buybacks/',
    ...macroSection,
    atlas: {
      articles: [{"label": "Sovereign debt: the buyer of last resort", "href": "/en/analysis/dette-etats-07-dernier-acheteur/", "kind": "article"}],
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
      articles: [{"label": "France, Moody’s and the price of debt", "href": "/en/analysis/france-moodys-reprieve-2027-borrowing-costs/", "kind": "article"}],
      intuition: 'The rating assesses credit risk; the contract determines the consequences attached to it.',
      sources: [{ label: 'SEC, Investor.gov', href: 'https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/updated-8', detail: 'Credit rating scales, scope and limitations.', kind: 'source' }],
      related: ['vrg', "agence-de-notation", "perspective-de-notation"],
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
      articles: [{ label: 'JLR: suppliers and credit', href: '/en/analysis/after-cyberattack-2-jlr-suppliers-credit/', detail: 'Order-based advances, payment dates and visibility across the supply chain.', kind: 'article' }, { label: 'Greensill: lending before the invoice exists', href: '/en/analysis/greensill-insurance-future-receivables-risk/', detail: 'Future receivables, insurance and cash availability.', kind: 'article' }],
      sources: [{ label: 'JLR, 7 October 2025', href: 'https://www.jlr.com/news/2025/10/jlr-restarts-manufacturing-and-introduces-new-financing-solution-pay-jlr-suppliers', detail: 'Order-based advances, normal payment terms and phased eligibility.', kind: 'source' }, { label: 'Bank of England, 6 May 2021', href: 'https://committees.parliament.uk/publications/5759/documents/66073/default/', detail: 'Page 3: supplier finance and Greensill’s funding model.', kind: 'source' }, { label: 'IASB, 25 May 2023', href: 'https://www.ifrs.org/news-and-events/news/2023/05/iasb-increases-transparency-of-companies-supplier-finance/', detail: 'Disclosure of amounts, payment dates and liquidity risks.', kind: 'source' }],
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
      articles: [{ label: 'The strength of an insurer’s promise', href: '/en/analysis/insurers-asset-managers-08-promise/', kind: 'article' },
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
  {"slug": "aum", "sigle": "AUM", "nom": "Assets under management", "def": "Assets managed or advised under the manager’s disclosed scope and valuation method. The fee-generating base can differ from total AUM. Managing a portfolio and legally owning its assets confer different rights.", "guide": "/en/analysis/why-investment-firms-buy-insurers/", "sectionTitle": "Private credit & markets", "accent": "var(--color-accent)", "robots": "noindex,follow", "atlas": {"articles": [{"label": "Why investment firms buy insurers", "href": "/en/analysis/why-investment-firms-buy-insurers/", "kind": "article"}], "sources": [{"label": "Apollo, 2025 annual report", "href": "https://ir.apollo.com/sec-filings/content/0001858681-26-000013/apo-20251231.htm", "detail": "AUM, FRE and SRE definitions and adjusted-measure reconciliations.", "kind": "source"}, {"label": "Brookfield Asset Management, 2025 annual report", "href": "https://bam.brookfield.com/sites/brookfield-bam-v2/files/brookfield-bam-v2/report-fillings/annual-quarterly-reports/q4-2025-bam-full-english-10-k-report.pdf", "detail": "FRE definition and changes in AEL mandate fee revenue.", "kind": "source"}], "related": ["fre", "sre"]}},
  {"slug": "fre", "sigle": "FRE", "nom": "Fee-related earnings", "def": "An adjusted earnings measure based on fee revenues after the expenses and adjustments specified by the company. Included revenues and methods vary by issuer and period. Testing a forecast requires comparable earnings levels; gross fee revenue is a separate measure.", "guide": "/en/analysis/why-investment-firms-buy-insurers/", "sectionTitle": "Private credit & markets", "accent": "var(--color-accent)", "robots": "noindex,follow", "atlas": {"articles": [{"label": "Who gets the investment returns?", "href": "/en/analysis/insurers-asset-managers-05-sharing-returns/", "kind": "article"}, {"label": "Why investment firms buy insurers", "href": "/en/analysis/why-investment-firms-buy-insurers/", "kind": "article"}], "sources": [{"label": "KKR, second-quarter 2026 results", "href": "https://ir.kkr.com/media/document/15a25fa9-8226-4da1-9ff3-027b9803d436/assets/KKR_Q226_Earnings_Release.pdf?disposition=inline", "detail": "Income components and FRE compensation excluding equity-based payments.", "kind": "source"}, {"label": "Apollo, 2025 annual report", "href": "https://ir.apollo.com/sec-filings/content/0001858681-26-000013/apo-20251231.htm", "detail": "AUM, FRE and SRE definitions and adjusted-measure reconciliations.", "kind": "source"}, {"label": "Brookfield Asset Management, 2025 annual report", "href": "https://bam.brookfield.com/sites/brookfield-bam-v2/files/brookfield-bam-v2/report-fillings/annual-quarterly-reports/q4-2025-bam-full-english-10-k-report.pdf", "detail": "FRE definition and changes in AEL mandate fee revenue.", "kind": "source"}], "related": ["aum", "sre"]}},
  {"slug": "sre", "sigle": "SRE", "nom": "Spread-related earnings", "def": "Apollo’s adjusted pre-tax earnings measure for its retirement-services business, based on investment income less the cost of liabilities and the expenses included in its definition. The relevant publication specifies the scope, adjustments and earnings attributable to the group.", "guide": "/en/analysis/why-investment-firms-buy-insurers/", "sectionTitle": "Private credit & markets", "accent": "var(--color-accent)", "robots": "noindex,follow", "atlas": {"articles": [{"label": "Who gets the investment returns?", "href": "/en/analysis/insurers-asset-managers-05-sharing-returns/", "kind": "article"}, {"label": "Why investment firms buy insurers", "href": "/en/analysis/why-investment-firms-buy-insurers/", "kind": "article"}], "sources": [{"label": "Athene, second-quarter 2026 financial supplement", "href": "https://ir.athene.com/sec-filings/all-sec-filings/content/0001527469-26-000057/athq22026financialsuppleme.htm", "detail": "First-half SRE bridge, Athene economic scope and annualised rates.", "kind": "source"}, {"label": "Apollo, 2025 annual report", "href": "https://ir.apollo.com/sec-filings/content/0001858681-26-000013/apo-20251231.htm", "detail": "AUM, FRE and SRE definitions and adjusted-measure reconciliations.", "kind": "source"}], "related": ["aum", "fre"]}},
  {
    slug: 'perimetre-de-consolidation',
    sigle: 'Consolidation perimeter',
    nom: 'The boundary of group accounts',
    def: 'The accounting boundary within which a parent combines, line by line, the assets, liabilities, income and expenses of entities it controls. Deconsolidation does not make an entity disappear: stakes, commitments and related-party transactions may remain disclosed as investments or separate notes.',
    ...privateCreditSection,
    atlas: {
      intuition: 'Consolidation is a binary accounting boundary. Economic influence can continue outside it through capital, contracts, mandates and governance.',
      articles: [{ label: 'The insurer’s money, the group’s business', href: '/en/analysis/insurers-affiliated-investments-apollo-brookfield-kkr/', kind: 'article' }, { label: 'The balance sheet Apollo does not consolidate', href: '/en/analysis/the-balance-sheet-apollo-does-not-consolidate/', detail: 'Deconsolidation, asset mandates, governance and insurance contracts.', kind: 'article' }],
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
      articles: [{ label: 'The insurer’s money, the group’s business', href: '/en/analysis/insurers-affiliated-investments-apollo-brookfield-kkr/', kind: 'article' }, { label: 'The balance sheet Apollo does not consolidate', href: '/en/analysis/the-balance-sheet-apollo-does-not-consolidate/', detail: 'Capital, board seats, fees and related insurance contracts.', kind: 'article' }],
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
    slug: 'oat', sigle: 'OAT', nom: 'French government bond',
    def: 'An obligation assimilable du Trésor, issued by the French state for medium- and long-term funding. Its market yield provides a reference for France’s borrowing costs and differs from the contractual coupon. Inflation-linked OATs have indexation clauses.',
    guide: '/en/analysis/dette-etats-06-prix-sortie/', ...macroSection, robots: 'noindex,follow',
    atlas: {
      intuition: 'The market values an outstanding contract; new funding faces the current yield.',
      articles: [{ label: 'Government debt: the price of getting out', href: '/en/analysis/dette-etats-06-prix-sortie/', kind: 'article' }, {"label": "France, Moody’s and the price of debt", "href": "/en/analysis/france-moodys-reprieve-2027-borrowing-costs/", "kind": "article"}],
      sources: [{ label: 'Agence France Trésor, debt instruments', href: 'https://www.aft.gouv.fr/fr/nos-produits', kind: 'source' }],
      related: ['coupon-obligataire', 'adjudication', 'risque-de-refinancement'],
    },
  },
  {
    slug: 'profondeur-de-marche', sigle: 'Market depth', nom: 'Quantities available at quoted prices',
    def: 'The quantities offered for purchase and sale at each price level of an order book at a given instant. Depth at the best bid and offer describes only the inside tier. It differs from the total outstanding stock and past trading volume; quotes can be withdrawn or replenished.',
    guide: '/en/analysis/dette-etats-06-prix-sortie/', ...macroSection, robots: 'noindex,follow',
    atlas: {
      intuition: 'A large sale can exhaust the best bid and reach lower price levels.',
      articles: [{ label: 'Government debt: the price of getting out', href: '/en/analysis/dette-etats-06-prix-sortie/', kind: 'article' }, { label: 'FIFA and Predictstreet: liquidity and exit prices', href: '/en/analysis/fifa-predictstreet-trading-volume-risk/', kind: 'article' }],
      sources: [{ label: 'New York Fed, Treasury liquidity', href: 'https://libertystreeteconomics.newyorkfed.org/2026/04/treasury-market-liquidity-since-april-2025/', detail: 'Inside-tier depth, spreads and price impact.', kind: 'source' }],
      related: ['bid-to-cover', 'primary-dealer', 'appel-de-marge'],
    },
  },
  {
    slug: 'coupon-obligataire', sigle: 'Bond coupon', nom: 'Contractual interest payment',
    def: 'An interest payment specified by a bond’s terms. For a fixed-rate bond, the payment depends on face value and the contractual coupon rate, with the stipulated frequency. The buyer’s yield also depends on the purchase price and other cash flows; a secondary-market sale does not alter the issuer’s coupon.',
    guide: '/en/analysis/dette-etats-06-prix-sortie/', ...macroSection, robots: 'noindex,follow',
    atlas: {
      intuition: 'The contract sets payments; the purchase price changes the yield.',
      articles: [{ label: 'Government debt: the price of getting out', href: '/en/analysis/dette-etats-06-prix-sortie/', kind: 'article' }, {"label": "France, Moody’s and the price of debt", "href": "/en/analysis/france-moodys-reprieve-2027-borrowing-costs/", "kind": "article"}],
      sources: [{ label: 'SEC, fixed-rate bond prices and yields', href: 'https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-86', kind: 'source' }],
      related: ['duration', 'adjudication', 'risque-de-refinancement', "oat"],
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
      articles: [{ label: 'Government debt: the price of getting out', href: '/en/analysis/dette-etats-06-prix-sortie/', kind: 'article' }, { label: 'The world rediscovers the price of money', href: '/en/analysis/the-world-rediscovers-the-price-of-money/', kind: 'article' }, { label: 'Can a Fed hike lower long-term yields?', href: '/en/analysis/fed-rate-hikes-long-yields-term-premium/', detail: 'Expectations, the term premium and Treasury buybacks.', kind: 'article' }, { label: 'The price of time in French debt', href: '/en/analysis/french-debt-price-of-time/', detail: 'Maturity, initial borrowing costs and debt refinancing.', kind: 'article' }, ...usDebtArticles],
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
    sigle: 'Government bond auction',
    nom: 'Bidding and allocation at issuance',
    def: 'A procedure that allocates securities based on submitted bids. French OAT auctions award each successful bid at its submitted price. US Treasury auctions award successful bids at a uniform price corresponding to the highest accepted yield, rate or discount margin. Bids, awards and settlement describe different stages.',
    guide: '/en/analysis/dette-etats-01-premier-acheteur/',
    ...macroSection,
    atlas: {
      intuition: 'Auctions match quantities with prices. Awards precede settlement, and the face amount can differ from the cash raised.',
      whyNow: 'The refunding calendar becomes a risk signal when volumes to issue rise and the marginal buyer demands more yield.',
      articles: [{ label: 'Government debt: the price of getting out', href: '/en/analysis/dette-etats-06-prix-sortie/', kind: 'article' }, { label: 'Government debt: the first buyer', href: '/en/analysis/dette-etats-01-premier-acheteur/', detail: 'Price, face value, settlement and bidding channels in France and the United States.', kind: 'article' }],
      guides: [usDebtGuides[0]],
      ...shared,
      sources: [{ label: 'AFT, issuance techniques', href: 'https://www.aft.gouv.fr/fr/techniques-demissions', detail: 'Submitted prices and allocation rules for French OATs.', kind: 'source' }, { label: 'TreasuryDirect, How Auctions Work', href: 'https://www.treasurydirect.gov/auctions/how-auctions-work/', detail: 'Uniform-price allocation and payment on the issue date.', kind: 'source' }],
      related: ['bid-to-cover', 'primary-dealer', 'prime-de-terme', 'duration', 'courbe-des-taux'],
    },
  },
  {
    slug: 'bid-to-cover',
    sigle: 'Bid-to-cover',
    nom: 'Auction coverage ratio',
    def: 'The ratio of the face amount bid to the face amount awarded within the defined scope of an auction. Bids reflect different price conditions. Interpretation requires comparable securities and auction rules, alongside prices and allocations; a universal threshold cannot establish the strength of demand.',
    guide: '/en/analysis/dette-etats-01-premier-acheteur/',
    ...macroSection,
    atlas: {
      articles: [{ label: 'Government debt: the price of getting out', href: '/en/analysis/dette-etats-06-prix-sortie/', kind: 'article' }],
      intuition: 'The bid-to-cover measures the cushion of bids around an issue, but it is not enough without reading the tail and the split between dealers, directs and indirects.',
      whyNow: 'A large, uncompetitive bid can raise the ratio without changing awards. The volume bid needs to be read alongside the terms at which the securities were placed.',
      guides: [usDebtGuides[0]],
      ...shared,
      sources: [{ label: 'U.S. Treasury, bid-to-cover definition', href: 'https://www.treasurydirect.gov/files/laws-and-regulations/auction-regulations-uoc/auct-reg-gsr-90125.pdf', detail: 'Ratio of face amounts and limits of interpretation.', kind: 'source' }],
      related: ['adjudication', 'primary-dealer', 'prime-de-terme', 'move'],
    },
  },
  {
    slug: 'primary-dealer',
    sigle: 'Primary dealer',
    nom: 'Designated market maker in Treasuries',
    def: 'A trading counterparty of the New York Fed, expected to bid on a pro-rata basis in Treasury auctions at reasonably competitive prices. In auction results, the primary-dealer category records bids for its own account. Its awards depend on bid prices and competing offers; its share alone identifies neither client purchases nor the strength of demand.',
    guide: '/en/analysis/dette-etats-01-premier-acheteur/',
    ...macroSection,
    atlas: {
      intuition: 'A dealer can bid for its own balance sheet and submit client bids. Auction categories separate these channels without tracing subsequent ownership.',
      whyNow: 'In a bigger, more volatile market, bond intermediation itself becomes a risk variable.',
      guides: [usDebtGuides[0]],
      ...shared,
      sources: [{ label: 'New York Fed, Primary Dealers', href: 'https://www.newyorkfed.org/markets/primarydealers', detail: 'Counterparty status and expected participation in Treasury auctions.', kind: 'source' }, { label: 'TreasuryDirect, bidder categories', href: 'https://www.treasurydirect.gov/help-center/faqs/auction-faqs/', detail: 'Own-account bids and client bids.', kind: 'source' }],
      related: ['adjudication', 'bid-to-cover', 'repo', 'basis-trade', 'move'],
    },
  },
  {
    slug: 'soumissionnaires-indirects',
    sigle: 'Indirect bidders',
    nom: 'Customers bidding through an intermediary',
    def: 'In US Treasury auction results, customers submitting competitive bids through a primary dealer or another direct submitter. This includes foreign monetary authorities bidding through the New York Fed, as well as domestic and foreign investors. The category identifies a bidding channel, not the share purchased abroad.',
    guide: '/en/analysis/dette-etats-01-premier-acheteur/',
    ...macroSection,
    robots: 'noindex,follow',
    atlas: {
      intuition: 'Using an intermediary identifies how a bid was submitted. The customer’s residence requires a separate classification.',
      articles: [{ label: 'Government debt: the first buyer', href: '/en/analysis/dette-etats-01-premier-acheteur/', detail: 'Bids, awards and the limits of identifying creditors.', kind: 'article' }],
      sources: [{ label: 'TreasuryDirect, bidder categories', href: 'https://www.treasurydirect.gov/help-center/faqs/auction-faqs/', detail: 'Indirect bidders can be domestic or foreign investors.', kind: 'source' }],
      related: ['adjudication', 'primary-dealer', 'bid-to-cover'],
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
    slug: 'ratio-de-levier',
    sigle: 'Leverage ratio',
    nom: 'Bank capital relative to exposure',
    def: 'A prudential ratio dividing Tier 1 capital by an exposure measure that includes assets and certain off-balance-sheet commitments, without risk weights. It complements risk-weighted capital ratios. The applicable threshold depends on the jurisdiction, institution and required buffers; SLR and eSLR refer to specific US requirements.',
    guide: '/en/guides/read-bank-health/',
    ...usRegulationSection,
    robots: 'noindex,follow',
    atlas: {
      intuition: 'The ratio compares capital with a regulatory exposure measure. It does not measure immediately available cash.',
      formula: 'leverage ratio = Tier 1 capital / exposure measure',
      articles: [{ label: 'Government debt: the price of a dealer’s balance sheet', href: '/en/analysis/dette-etats-02-bilan-intermediaires/', kind: 'article' }],
      guides: [{ label: 'Read bank health', href: '/en/guides/read-bank-health/', kind: 'guide' }],
      sources: [{ label: 'Basel Committee, LEV20: leverage ratio calculation', href: 'https://www.bis.org/committees/bcbs/basel-framework/standard/lev/20/inforce/2023-01-01/published/2020-03-27', kind: 'source' }],
      related: ['slr', 'cet1'],
    },
  },
  {
    slug: 'slr',
    sigle: 'SLR',
    nom: 'Supplementary Leverage Ratio',
    def: 'A US ratio dividing Tier 1 capital by total leverage exposure, including certain off-balance-sheet commitments. Category I–III banking organisations face a 3% minimum. From April 1, 2026, eSLR adds a buffer equal to half the US G-SIB’s method 1 systemic surcharge. For covered depository subsidiaries, this buffer is capped at one percentage point. These requirements apply alongside risk-weighted capital ratios.',
    guide: '/en/analysis/dette-etats-02-bilan-intermediaires/',
    ...usRegulationSection,
    robots: 'noindex,follow',
    atlas: {
      intuition: 'The 3% minimum and the eSLR buffer are distinct. Holding companies and depository subsidiaries have different buffer calibrations.',
      articles: [{ label: 'Government debt: the price of a dealer’s balance sheet', href: '/en/analysis/dette-etats-02-bilan-intermediaires/', kind: 'article' }],
      sources: [
        { label: 'Fed, FDIC and OCC: November 25, 2025 final rule', href: 'https://www.federalreserve.gov/newsevents/pressreleases/bcreg20251125b.htm', detail: 'Effective date and cap on the depository subsidiary buffer.', kind: 'source' },
        { label: 'Federal Register, final eSLR rule', href: 'https://www.federalregister.gov/documents/2025/12/01/2025-21626/regulatory-capital-rule-modifications-to-the-enhanced-supplementary-leverage-ratio-standards-for-us', detail: 'SLR minimum, method 1 and holding-company versus subsidiary standards.', kind: 'source' },
      ],
      related: ['ratio-de-levier', 'g-sib', 'repo'],
    },
  },
  {
    slug: 'rehypothecation', sigle: 'Rehypothecation', nom: 'Reuse of collateral',
    def: 'Using received collateral in another transaction. Strictly, rehypothecation concerns pledged assets; reuse under a title-transfer repo involves an obligation to return equivalent securities. Rights depend on the contract and governing law. Reuse supports funding while connecting counterparties’ risks.',
    guide: '/en/analysis/dette-etats-04-chaine-garanties/',
    ...macroSection,
    robots: 'noindex,follow',
    atlas: {
      intuition: 'Successive claims can finance the same portfolio without multiplying the underlying securities.',
      articles: [{ label: 'Government debt: the collateral chain', href: '/en/analysis/dette-etats-04-chaine-garanties/', kind: 'article' }],
      sources: [
        { label: 'FSB, repo market vulnerabilities, February 2026', href: 'https://www.fsb.org/uploads/P040226.pdf', detail: 'Section 3.1.3: benefits and interdependencies of collateral reuse.', kind: 'source' },
        { label: 'ESMA, SFTR Article 15', href: 'https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/sftr/article-15-reuse-financial-instruments', detail: 'Risk information, prior agreement and conditions for reuse.', kind: 'source' },
        { label: 'ICMA, rehypothecation FAQ', href: 'https://www.icmagroup.org/market-practice-and-regulatory-policy/repo-and-collateral-markets/icma-ercc-publications/frequently-asked-questions-on-repo/10-what-is-rehypothecation-of-collateral/', detail: 'Industry conventions: pledges, title transfer and equivalent securities.', kind: 'source' },
      ],
      related: ['repo', 'collateral', 'open-repo', 'haircut-repo'],
    },
  },
  {
    slug: 'open-repo', sigle: 'Open repo', nom: 'Repurchase agreement without a fixed maturity',
    def: 'A repo agreed without a fixed end date. Either party may terminate it under the agreed notice provisions; otherwise it continues. It differs from an overnight repo that must be renewed. Funding availability therefore also depends on termination rights and replacement liquidity.',
    guide: '/en/analysis/dette-etats-04-chaine-garanties/',
    ...macroSection,
    robots: 'noindex,follow',
    atlas: {
      intuition: 'Funding continues until a party terminates it under the agreed notice provisions.',
      articles: [{ label: 'Government debt: the collateral chain', href: '/en/analysis/dette-etats-04-chaine-garanties/', kind: 'article' }],
      sources: [
        { label: 'FSB, how repo transactions work', href: 'https://www.fsb.org/uploads/P040226.pdf', detail: 'Section 1.1: open-term repo and notice.', kind: 'source' },
        { label: 'ICMA, open repo FAQ', href: 'https://www.icmagroup.org/market-practice-and-regulatory-policy/repo-and-collateral-markets/icma-ercc-publications/frequently-asked-questions-on-repo/12-what-is-an-open-repo/', detail: 'Contractual notice and the distinction from daily renewal.', kind: 'source' },
      ],
      related: ['repo', 'rehypothecation'],
    },
  },
  {
    slug: 'haircut-repo', sigle: 'Repo haircut', nom: 'Collateral discount in repo financing',
    def: 'The gap between cash lent and the value of repo collateral. Its calculation must identify the denominator, securities value or initial cash according to the convention. A zero or negative haircut does not describe all portfolio margins or offsets. The effects of an increase depend on contractual terms and refinancing.',
    guide: '/en/analysis/dette-etats-04-chaine-garanties/',
    ...macroSection,
    robots: 'noindex,follow',
    atlas: {
      intuition: 'A transaction’s visible percentage does not fully describe the protection of the portfolio.',
      articles: [{ label: 'Government debt: the collateral chain', href: '/en/analysis/dette-etats-04-chaine-garanties/', kind: 'article' }],
      sources: [
        { label: 'Fed, Proportionate margining for repo transactions', href: 'https://www.federalreserve.gov/econres/notes/feds-notes/proportionate-margining-for-repo-transactions-20250214.html', detail: 'Both counterparties’ risks, negative haircuts and portfolio offsets.', kind: 'source' },
        { label: 'FICC, August 26, 2026 GSD rulebook', href: 'https://files.dtcc.com/download/assets/FICC-GSD%2BRulebook%2B%E2%80%93%2B2026-0826%2BFinal.pdf/b6c07124ceb411f09c9062cd3fe05a01', detail: 'Rule 1: CIL Required Haircut denominator; Rule 3A: conditions for changes.', kind: 'source' },
      ],
      related: ['repo', 'collateral', 'decote-de-garantie', 'collateral-in-lieu'],
    },
  },
  {
    slug: 'collateral-in-lieu', sigle: 'Collateral-in-Lieu', nom: 'Protection within FICC’s Sponsored GC service',
    def: 'An FICC service in which the cash lender grants the clearing house a security interest in securities held in its tri-party account. Subject to conditions, this generally replaces the sponsor’s guarantee and certain margin or settlement payments. Haircuts and additional resources remain. The lien protects the cleared transaction; it does not finance a second repo.',
    guide: '/en/analysis/dette-etats-04-chaine-garanties/',
    ...macroSection,
    robots: 'noindex,follow',
    atlas: {
      intuition: 'A lien on existing collateral protects the obligations accepted for clearing.',
      articles: [{ label: 'Government debt: the collateral chain', href: '/en/analysis/dette-etats-04-chaine-garanties/', kind: 'article' }],
      sources: [
        { label: 'SEC, approval of the CIL service', href: 'https://www.sec.gov/files/rules/sro/ficc/2025/34-104374a.pdf', detail: 'December 12, 2025 order: lien, replacement of protections and additional resources.', kind: 'source' },
        { label: 'FICC, August 26, 2026 GSD rulebook', href: 'https://files.dtcc.com/download/assets/FICC-GSD%2BRulebook%2B%E2%80%93%2B2026-0826%2BFinal.pdf/b6c07124ceb411f09c9062cd3fe05a01', detail: 'Rule 3A and CIL annex: obligations and custodian instructions.', kind: 'source' },
      ],
      related: ['repo', 'collateral', 'ccp', 'haircut-repo'],
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
      articles: [{"label": "Sovereign debt: the buyer of last resort", "href": "/en/analysis/dette-etats-07-dernier-acheteur/", "kind": "article"},
        { label: 'Government debt: the collateral chain', href: '/en/analysis/dette-etats-04-chaine-garanties/', kind: 'article' },
        { label: 'Banks: the cost of the December snapshot', href: '/en/analysis/banks-cost-december-snapshot/', kind: 'article' },
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
    def: 'A strategy seeking to profit from the relative prices of a bond and a futures contract. Its long Treasury version combines buying the bond, selling the future and funding in repo. Returns depend on prices, coupons, funding costs and delivery terms. Hedging interest-rate risk leaves basis risk and margin-related liquidity needs.',
    guide: '/en/analysis/dette-etats-03-acheteurs-credit/',
    ...macroSection,
    atlas: {
      intuition: 'The basis trade turns a small price gap into a large exposure through repo leverage.',
      whyNow: 'It can support Treasury liquidity in calm times, then drain it if margins rise or funding turns unstable.',
      articles: [{ label: 'Government debt: the buyers who borrow', href: '/en/analysis/dette-etats-03-acheteurs-credit/', kind: 'article' }, usDebtArticles[1], usDebtArticles[2]],
      guides: [usDebtGuides[0], usDebtGuides[2]],
      ...shared,
      sources: [
        { label: 'CME, gross Treasury basis calculation', href: 'https://www.cmegroup.com/education/courses/introduction-to-treasuries/the-basics-of-treasuries-basis', kind: 'source' },
        { label: 'Fed, Quantifying Treasury Cash-Futures Basis Trades', href: 'https://www.federalreserve.gov/econres/notes/feds-notes/quantifying-treasury-cash-futures-basis-trades-20240308.html', detail: 'Returns after funding, delivery options and risks of the strategy.', kind: 'source' },
      ],
      related: ['repo', 'duration', 'move', 'primary-dealer', 'courbe-des-taux', 'future', 'cheapest-to-deliver'],
    },
  },
  {
    slug: 'cheapest-to-deliver',
    sigle: 'Cheapest-to-deliver',
    nom: 'Economically cheapest deliverable bond (CTD)',
    def: 'The eligible bond whose delivery is economically most advantageous to the seller of a bond futures contract. The choice depends on the bond price, conversion factor and funding through delivery. The selected bond can change with market conditions; its cash price alone does not identify it.',
    guide: '/en/analysis/dette-etats-03-acheteurs-credit/',
    ...usRegulationSection,
    robots: 'noindex,follow',
    atlas: {
      intuition: 'The seller compares acquisition and carrying costs with delivery proceeds calculated using the conversion factor.',
      articles: [{ label: 'Government debt: the buyers who borrow', href: '/en/analysis/dette-etats-03-acheteurs-credit/', kind: 'article' }],
      sources: [
        { label: 'CME, Treasury futures conversion factors', href: 'https://www.cmegroup.com/articles/2024/calculating-us-treasury-futures-conversion-factors.html', kind: 'source' },
        { label: 'Fed, basis-trade delivery options and funding', href: 'https://www.federalreserve.gov/econres/notes/feds-notes/quantifying-treasury-cash-futures-basis-trades-20240308.html', kind: 'source' },
      ],
      related: ['basis-trade', 'future', 'repo'],
    },
  },
  {
    slug: 'swap-spread',
    sigle: 'Swap spread',
    nom: 'Swap rate relative to a government bond yield',
    def: 'The fixed swap rate minus the yield on a government bond in the same currency and of comparable maturity. One trade combines a repo-financed bond purchase with paying the swap’s fixed rate. Its result depends on the spread, funding and margins; it is distinct from the cash-futures basis trade.',
    guide: '/en/guides/read-interest-rate-swaps/',
    ...usRegulationSection,
    robots: 'noindex,follow',
    atlas: {
      intuition: 'A financed bond and a fixed-rate payer swap can hedge part of the interest-rate risk while retaining exposure to their relative prices.',
      formula: 'swap spread = fixed swap rate − comparable government bond yield',
      articles: [{ label: 'Government debt: the buyers who borrow', href: '/en/analysis/dette-etats-03-acheteurs-credit/', kind: 'article' }],
      guides: [{ label: 'Read interest-rate swaps', href: '/en/guides/read-interest-rate-swaps/', kind: 'guide' }],
      sources: [{ label: 'BIS, relative-value trades in Treasuries and interest-rate swaps', href: 'https://www.bis.org/publications/qr-202512/sizing-hedge-funds-relative-value-trades-us-treasuries-and-interest-rate-swaps', detail: 'Spread definition and the combination of repo, bonds and fixed-rate payer swaps.', kind: 'source' }],
      related: ['repo', 'basis-trade', 'duration'],
    },
  },
  {
    slug: 'future',
    sigle: 'Futures',
    nom: 'Standardised exchange-traded contract',
    def: 'A standardised, centrally cleared contract traded on an exchange. It creates exposure to an underlying asset with margin deposits and settlement of changes in value. Notional is a reference amount: opening a short futures position does not generate that amount in cash. Contract terms specify physical delivery or cash settlement at expiry.',
    guide: '/en/analysis/dette-etats-03-acheteurs-credit/',
    ...usRegulationSection,
    robots: 'noindex,follow',
    atlas: {
      intuition: 'The contract exposes a reference amount to price changes, while cash moves through margins and settlement.',
      articles: [{ label: 'Government debt: the buyers who borrow', href: '/en/analysis/dette-etats-03-acheteurs-credit/', kind: 'article' }],
      sources: [
        { label: 'CME, definition of a futures contract', href: 'https://www.cmegroup.com/education/courses/introduction-to-futures/definition-of-a-futures-contract', kind: 'source' },
        { label: 'CME, futures margins', href: 'https://www.cmegroup.com/education/courses/introduction-to-futures/margin-know-what-is-needed', kind: 'source' },
        { label: 'CME, money calculations for futures', href: 'https://www.cmegroup.com/clearing/files/CME-Money-Calculations-Futures-and-Options.pdf', kind: 'source' },
        { label: 'CME, futures expiration and settlement', href: 'https://www.cmegroup.com/education/courses/introduction-to-futures/get-to-know-futures-expiration-and-settlement', kind: 'source' },
      ],
      related: ['marge-initiale', 'marge-de-variation', 'basis-trade'],
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
    slug: 'borrowing-base',
    sigle: 'Borrowing base',
    nom: 'Contractual collateral-based borrowing capacity',
    def: 'The asset base used to calculate how much can be drawn under a secured credit facility. The agreement sets eligible assets, valuation rules and applicable haircuts or advance rates. A decline in the borrowing base can reduce funding capacity before insolvency.',
    guide: '/en/analysis/private-credit-test-of-patience/',
    ...privateCreditSection,
    robots: 'noindex,follow',
    atlas: {
      articles: [{ label: 'Private credit’s test of patience', href: '/en/analysis/private-credit-test-of-patience/', detail: 'Fund financing capacity and collateral behind bank facilities.', kind: 'article' }],
      sources: [
        { label: 'Ares Capital, June 30, 2026 financial results', href: 'https://arcc.ares.com/news/ares-capital-corporation-announces-june-30-2026-financial-results-and-declares-third-quarter-2026-dividend/f7760e0a-2af5-471a-9ee0-ff7ead3d6875', detail: 'Facility availability remains subject to borrowing-base and other restrictions.', kind: 'source' },
        { label: 'Ares Capital, June 30, 2026 Form 10-Q', href: 'https://arcc.ares.com/media/document/1cbc95d3-9338-4c60-ae48-079474d44300/assets/arcc2026q2.pdf', detail: 'Note 5, pages 186–190: advance rates, asset categories and facility restrictions.', kind: 'source' },
      ],
      related: ['bdc', 'credit-prive'],
    },
  },
  {
    slug: 'add-back',
    sigle: 'Add-back',
    nom: 'Contractual EBITDA adjustment',
    def: 'An adjustment permitted by a loan agreement that adds specified items, such as expected savings, to the EBITDA used in financial ratios. Eligible categories, caps and time limits depend on the documentation. An add-back creates no cash receipt and does not reduce the debt owed.',
    guide: '/en/analysis/private-credit-test-of-patience/',
    ...privateCreditSection,
    robots: 'noindex,follow',
    atlas: {
      articles: [{ label: 'Private credit’s test of patience', href: '/en/analysis/private-credit-test-of-patience/', detail: 'Expected savings and the contractual calculation of leverage.', kind: 'article' }],
      sources: [{ label: 'Proskauer, Private Credit Prepares for the Next Cycle', href: 'https://www.proskauer.com/pub/private-credit-prepares-for-the-next-cycle', detail: 'September 18, 2019 contractual analysis: EBITDA adjustments and synergy caps; no current frequency inferred.', kind: 'source' }],
      related: ['ebitda', 'credit-prive'],
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
      articles: [{ label: 'Private credit’s test of patience', href: '/en/analysis/private-credit-test-of-patience/', detail: 'Non-accrual loans, accounting bases and bank funding of credit vehicles.', kind: 'article' }, { label: 'Private credit: software debt faces the AI test', href: '/en/analysis/private-credit-software-ai-cash-flows-debt/', detail: 'BIS exposures, OTF accounts and educational scenarios.', kind: 'article' }, privateCreditArticles[0], privateCreditArticles[1], privateCreditArticles[4]],
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
    guide: '/en/analysis/private-credit-route-insurers-rated-feeders/',
    ...privateCreditSection,
    atlas: {
      intuition: 'A private NAV is less a market snapshot than an administered estimate. Its usefulness depends on the quality of the marks and the frequency of revisions.',
      formula: 'NAV = estimated asset value - fund liabilities',
      whyNow: 'The gap between quoted prices, at-par redemptions and internal marks becomes a signal of confidence in the valuation.',
      articles: [{"label": "Private credit: a new route to insurers", "href": "/en/analysis/private-credit-route-insurers-rated-feeders/", "detail": "Debt seniority, available cash flows and prudential treatment of rated feeders.", "kind": "article"}, privateCreditArticles[0], privateCreditArticles[3], privateCreditArticles[4]],
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
      articles: [{"label": "Private credit: a new route to insurers", "href": "/en/analysis/private-credit-route-insurers-rated-feeders/", "detail": "Debt seniority, available cash flows and prudential treatment of rated feeders.", "kind": "article"}, { label: 'Private credit’s test of patience', href: '/en/analysis/private-credit-test-of-patience/', detail: 'Capitalized interest, cash received and PIK introduced after loan closing.', kind: 'article' }, { label: 'Private credit: software debt faces the AI test', href: '/en/analysis/private-credit-software-ai-cash-flows-debt/', detail: 'OTF PIK calculation and the gap between income and cash receipts.', kind: 'article' }, privateCreditArticles[1], privateCreditArticles[2], privateCreditArticles[4]],
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
    def: 'Fitch’s issuer-based default measure for US and Canadian borrowers in its non-broadly-syndicated middle-market CLO and privately monitored direct-lending universe. Over a trailing twelve-month period, unique issuers assigned RD or D are divided by the average issuer count at the beginning and end, without debt weighting. Multiple defaults by one issuer count once within that window. Events include payment defaults and distressed exchanges meeting Fitch’s criteria. Exercising a PIK option agreed at origination does not itself constitute default.',
    ...privateCreditSection,
    atlas: {
      intuition: 'Compare rates using the same universe, observation window and default definition.',
      articles: [privateCreditArticles[1], privateCreditArticles[2]],
      guides: [privateCreditGuides[0]],
      ...privateCreditShared,
      sources: [{ label: 'Fitch: U.S. Private Credit, Default Rate Methodology', href: 'https://assets.fitchratings.com/downloadFile?reportType=report&sfReport=false&slug=corporate-finance/us-private-credit-default-rate-methodology-30-01-2026', detail: '30 January 2026, pages 1–4.', kind: 'source' }],
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
        { label: 'France’s stablecoin tax plan: gains and timing', href: '/en/analysis/france-stablecoin-tax-capital-gains/', detail: 'France’s proposed reform, tax basis and annual use of losses.', kind: 'article' },
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
    def: 'A Circle token targeting one US dollar per unit. Circle describes it as co-issued by Circle France in the EEA and Circle LLC elsewhere. Direct redemption depends on the relevant entity and its eligibility conditions. Circle’s documentation provides for deferrals if reserves cannot be rebalanced between the issuers.',
    guide: '/en/analysis/usdc-reserves-follow-token-mica/',
    ...cryptoSection,
    atlas: {
      intuition: 'The holder needs to identify the entity and procedure through which USDC becomes dollars in a bank account.',
      whyNow: 'The EBA’s October 14, 2026 designation provides for shared supervision with the ACPR from November 12. Circle separately describes possible deferrals if reserves cannot be rebalanced; this review does not establish that the mechanism has been activated.',
      articles: [
        { label: 'USDC: can the reserves follow the token?', href: '/en/analysis/usdc-reserves-follow-token-mica/', detail: 'European supervision, reserves across issuers and redemption under stress.', kind: 'article' },
        { label: 'Stablecoins: from tokens to available dollars', href: '/en/analysis/stablecoin-reserves-redemption-dollar/', detail: 'Reserves, fees, redemption delays and rights by issuer channel.', kind: 'article' },
        { label: 'Hyperliquid and on-chain tradfi', href: '/en/analysis/hyperliquid-onchain-exchange/', detail: 'Perpetuals, DEXs and bridges to traditional assets.', kind: 'article' },
      ],
      guides: [
        { label: 'Stablecoins and the GENIUS Act', href: '/en/guides/read-stablecoins-genius-act/', detail: 'Reserves, licensed issuers, audits and supervision.', kind: 'guide' },
        { label: 'MiCA, acronym by acronym', href: '/en/guides/decode-mica-crypto-regulation/', detail: 'ARTs, EMTs, CASPs and European supervision.', kind: 'guide' },
      ],
      ...cryptoShared,
      sources: [
        { label: 'EBA: USDC significant designation', href: 'https://www.eba.europa.eu/publications-and-media/press-releases/eba-classifies-usdc-first-significant-e-money-token-european-union', detail: 'October 14, 2026: supervisory split from November 12; full official release read.', kind: 'source' },
        { label: 'Circle France: MiCA redemption', href: 'https://www.circle.com/legal/mica-redemption-policy', detail: 'September 15, 2026, sections 1.4, 4.2 and 8: access, conditional processing and possible deferrals before a crisis plan.', kind: 'source' },
        { label: 'Circle France: USDC white paper', href: 'https://www.circle.com/legal/mica-usdc-whitepaper', detail: 'September 15, 2026 amendment, F.1(5) and F.4(1.4): issuer-disclosed rebalancing and temporary limits.', kind: 'source' },
        { label: 'Circle: USDC Terms outside the EEA', href: 'https://www.circle.com/legal/usdc-terms', detail: 'December 12, 2025, section 2: direct redemption requires an eligible Circle Mint account in good standing.', kind: 'source' },
        { label: 'FSB: cross-border vulnerabilities', href: 'https://www.fsb.org/uploads/P121026-2.pdf', detail: 'October 12, 2026, pp. 2–5: reserve mobility and data limits; no finding that an issuer has failed.', kind: 'source' },
      ],
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
    def: 'A maritime passage that concentrates shipping routes, such as Hormuz, Malacca, Suez, Panama or Bab el-Mandeb. Its importance depends on the goods carried and the alternative routes available. Disruption exposes the trade using the passage; actual losses also depend on duration, usable inventories and the ability to replace inputs or suppliers. One cargo can cross several chokepoints in succession.',
    guide: '/en/analysis/shipping-chokepoints-cost-of-buying-time/',
    ...energySection,
    atlas: {
      intuition: 'Exposure to a passage is not a measure of lost output. A detour can keep supplies moving while requiring more vessel time and financing.',
      whyNow: 'In BIS Bulletin 138, published on 15 October 2026, the authors explain that inventories and substitution can cushion output while raising input costs. The protection they provide depends on how long disruption lasts and which alternatives are actually available.',
      articles: [{ label: 'Hormuz: five ships and the crop calendar', href: '/en/analysis/hormuz-fertilizer-corridor-crop-calendar/', detail: 'Proposed fertilizer passage, cargo composition and the crop calendar.', kind: 'article' }, { label: 'Shipping chokepoints: the cost of buying time', href: '/en/analysis/shipping-chokepoints-cost-of-buying-time/', detail: 'Usable inventories, diversions and financing the wait; observations kept distinct from illustrative scenarios.', kind: 'article' }, oilArticles[2], oilArticles[3], oilArticles[4]],
      guides: [oilGuide],
      ...energyShared,
      sources: [
        { label: 'BIS Bulletin 138', href: 'https://www.bis.org/publications/bulletin-138-chokepoint-disruptions-and-their-macroeconomic-consequences', detail: '15 October 2026: inventories, substitution and disruption costs. The authors’ analysis is distinct from a forecast for the current episode.', kind: 'source' },
        { label: 'Nature Communications, maritime dependencies', href: 'https://www.nature.com/articles/s41467-025-65403-w', detail: '24 November 2025: route networks, overlapping exposure and modelled risks. Exposure is not an observed loss.', kind: 'source' },
        { label: 'EIA, October 2026 STEO', href: 'https://www.eia.gov/outlooks/steo/report/global_oil.php', detail: '6 October 2026: temporary interruption of the East-West pipeline and bypass-route dependencies. The page is updated for each edition.', kind: 'source' },
      ],
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
      articles: [{ label: 'Government debt: the margin-call deadline', href: '/en/analysis/dette-etats-05-appels-marge/', kind: 'article' }, oilArticles[5]],
      guides: marginGuides,
      ...marginShared,
      related: ['appel-de-marge', 'marge-initiale', 'marge-de-variation', 'membre-compensateur', 'brent', 'repo'],
    },
  },
  {
    slug: 'appel-de-marge',
    sigle: 'Margin call',
    nom: 'Demand for additional cash or collateral',
    def: 'A request for additional cash or collateral when the value or risk of a position changes. It may be variation margin settling or collateralising current exposure under the contract, or an increase in initial margin covering potential losses after default.',
    guide: '/en/guides/read-interest-rate-swaps/',
    ...clearingSection,
    atlas: {
      intuition: 'A margin call specifies resources to be posted under the contract. Payment can fall due before cash arrives on another position.',
      formula: 'at each deadline: bridge = max(0, cumulative cash due - cumulative cash resources available by that time)',
      whyNow: 'A producer short futures can gain on physical crude and still have to advance cash before the cargo settles.',
      articles: [{ label: 'Government debt: the margin-call deadline', href: '/en/analysis/dette-etats-05-appels-marge/', kind: 'article' }, oilArticles[5]],
      guides: marginGuides,
      ...marginShared,
      related: ['marge-initiale', 'marge-de-variation', 'membre-compensateur', 'ccp', 'brent', 'risque-de-contrepartie'],
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
      articles: [{ label: 'Government debt: the margin-call deadline', href: '/en/analysis/dette-etats-05-appels-marge/', kind: 'article' }, oilArticles[5]],
      guides: marginGuides,
      ...marginShared,
      related: ['appel-de-marge', 'marge-de-variation', 'membre-compensateur', 'ccp', 'brent'],
    },
  },
  {
    slug: 'marge-de-variation',
    sigle: 'Variation margin',
    nom: 'Margin for current mark-to-market exposure',
    def: 'A transfer linked to a position’s change in value that settles or collateralises current exposure according to the contract. Cleared derivatives generally require cash. Receipt can lag a payment due on another position.',
    guide: '/en/guides/read-interest-rate-swaps/',
    ...clearingSection,
    atlas: {
      intuition: 'Variation margin tracks gains and losses since the previous valuation. Payment can precede cash received on another position.',
      formula: 'for a linear contract: variation margin ≈ price change × contract size × number of contracts',
      whyNow: 'On a short oil hedge, a higher barrel can cause an immediate outflow before the physical cargo is paid for.',
      articles: [{ label: 'Government debt: the margin-call deadline', href: '/en/analysis/dette-etats-05-appels-marge/', kind: 'article' }, oilArticles[5]],
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
{
  "slug": "g-sib",
  "sigle": "G-SIB",
  "nom": "Global Systemically Important Bank",
  "def": "A bank included in the Financial Stability Board’s annual list of global systemically important banks. Five categories measure its relative systemic footprint and inform an additional CET1 buffer on risk-weighted assets, subject to supervisory judgement. The score concerns the impact of failure, rather than its probability. Required capital is a stock, distinct from annual expenses.",
  "guide": "/en/analysis/banks-cost-december-snapshot/",
  "sectionTitle": "Bank capital & regulation",
  "accent": "var(--color-topic-blue)",
  "robots": "noindex,follow",
  "atlas": {
    "intuition": "A bank’s score can change when either its exposure or its peers’ exposure changes.",
    "formula": "Size contribution = bank exposure / sample exposure × 10,000 × 20%",
    "articles": [
      {
        "label": "Banks: the cost of the December snapshot",
        "href": "/en/analysis/banks-cost-december-snapshot/",
        "kind": "article"
      }
    ],
    "sources": [
      {
        "label": "Basel SCO40: scoring and buckets",
        "href": "https://www.bis.org/committees/bcbs/basel-framework/standard/sco/40/inforce/2021-11-09/published/2021-11-09",
        "kind": "source"
      },
      {
        "label": "Basel RBC40: CET1 buffer",
        "href": "https://www.bis.org/committees/bcbs/basel-framework/standard/rbc/40/inforce/2019-12-15/published/2019-12-15",
        "kind": "source"
      },
      {
        "label": "FSB: 2025 G-SIB list and timing",
        "href": "https://www.fsb.org/2025/11/2025-list-of-global-systemically-important-banks-g-sibs/",
        "kind": "source"
      }
    ],
    "related": [
      "repo",
      "cet1",
      "apr"
    ]
  }
},
  {"slug": "agence-de-notation", "sigle": "Credit rating agency", "nom": "Professional assessment of credit risk", "def": "An organisation that assigns opinions on the creditworthiness of issuers or debt obligations, using a rating scale. Its analysis is forward-looking and can change. Registered agencies in the European Union are directly supervised by ESMA. Credit ratings assess creditworthiness, a separate question from market prices or investment returns.", "guide": "/en/analysis/france-moodys-reprieve-2027-borrowing-costs/", "sectionTitle": "Private credit & markets", "accent": "var(--color-accent)", "robots": "noindex,follow", "atlas": {"articles": [{"label": "France, Moody’s and the price of debt", "href": "/en/analysis/france-moodys-reprieve-2027-borrowing-costs/", "kind": "article"}], "sources": [{"label": "ESMA, credit rating agency supervision", "href": "https://www.esma.europa.eu/esmas-activities/investors-and-issuers/credit-rating-agencies", "kind": "source"}, {"label": "S&P Global Ratings, understanding credit ratings", "href": "https://www.spglobal.com/ratings/en/credit-ratings/about/understanding-credit-ratings", "kind": "source"}], "related": ["perspective-de-notation", "investment-grade"]}},
  {"slug": "perspective-de-notation", "sigle": "Rating outlook", "nom": "Potential direction of a credit rating", "def": "An assessment of the potential direction of a credit rating over the medium term. A negative outlook indicates that a rating may fall; a positive outlook indicates that it may rise. The outlook is separate from the current rating: a rating can change with a stable outlook, while a negative outlook can be resolved without a downgrade. Horizons and categories depend on the agency.", "guide": "/en/analysis/france-moodys-reprieve-2027-borrowing-costs/", "sectionTitle": "Private credit & markets", "accent": "var(--color-accent)", "robots": "noindex,follow", "atlas": {"articles": [{"label": "France, Moody’s and the price of debt", "href": "/en/analysis/france-moodys-reprieve-2027-borrowing-costs/", "kind": "article"}], "sources": [{"label": "S&P Global Ratings, definitions dated 16 December 2025, section II", "href": "https://maalot.co.il/Publications/RS20251216162753.pdf", "kind": "source"}], "related": ["agence-de-notation", "investment-grade"]}},

];

export const glossaryAtlasEnBySlug = new Map(glossaryAtlasEn.map((entry) => [entry.slug, entry]));
