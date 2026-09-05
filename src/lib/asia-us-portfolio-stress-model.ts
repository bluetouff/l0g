export const ASIA_US_PORTFOLIO_MODEL_VERSION = '1.0.0';

export interface AsiaUSPortfolioInputs {
  equitiesUsdBn: number;
  treasuryUsdBn: number;
  agencyUsdBn: number;
  corporateUsdBn: number;
  shortTermUsdBn: number;
  equityShockPct: number;
  treasuryShockPct: number;
  agencyShockPct: number;
  corporateShockPct: number;
  shortTermShockPct: number;
}

export interface AsiaUSPortfolioOutputs extends AsiaUSPortfolioInputs {
  baseValueUsdBn: number;
  stressedValueUsdBn: number;
  totalChangeUsdBn: number;
  totalChangePct: number;
  equityChangeUsdBn: number;
  treasuryChangeUsdBn: number;
  agencyChangeUsdBn: number;
  corporateChangeUsdBn: number;
  shortTermChangeUsdBn: number;
  largestContributor: 'equities' | 'treasury' | 'agency' | 'corporate' | 'shortTerm' | 'none';
}

export const ASIA_US_PORTFOLIO_DEFAULTS: AsiaUSPortfolioInputs = {
  equitiesUsdBn: 4_504,
  treasuryUsdBn: 3_284,
  agencyUsdBn: 741,
  corporateUsdBn: 848,
  shortTermUsdBn: 458,
  equityShockPct: -20,
  treasuryShockPct: -6,
  agencyShockPct: -8,
  corporateShockPct: -10,
  shortTermShockPct: -1,
};

export const ASIA_US_PORTFOLIO_PRESETS = [
  {
    id: 'asia',
    labelFr: 'Asie entière',
    labelEn: 'All Asia',
    noteFr: 'Table A5, résidence déclarée, 30 juin 2025',
    noteEn: 'Table A5, reported residence, 30 June 2025',
    reportedTotalUsdBn: 9_834,
    inputs: { ...ASIA_US_PORTFOLIO_DEFAULTS },
  },
  {
    id: 'japan',
    labelFr: 'Japon',
    labelEn: 'Japan',
    noteFr: 'Portefeuille déclaré : 2 883 Md$',
    noteEn: 'Reported portfolio: $2,883bn',
    reportedTotalUsdBn: 2_883,
    inputs: { ...ASIA_US_PORTFOLIO_DEFAULTS, equitiesUsdBn: 1_169, treasuryUsdBn: 1_024, agencyUsdBn: 250, corporateUsdBn: 315, shortTermUsdBn: 125 },
  },
  {
    id: 'china',
    labelFr: 'Chine continentale',
    labelEn: 'Mainland China',
    noteFr: 'Portefeuille déclaré : 1 279 Md$',
    noteEn: 'Reported portfolio: $1,279bn',
    reportedTotalUsdBn: 1_279,
    inputs: { ...ASIA_US_PORTFOLIO_DEFAULTS, equitiesUsdBn: 344, treasuryUsdBn: 657, agencyUsdBn: 186, corporateUsdBn: 17, shortTermUsdBn: 75 },
  },
  {
    id: 'singapore',
    labelFr: 'Singapour',
    labelEn: 'Singapore',
    noteFr: 'Portefeuille déclaré : 1 118 Md$',
    noteEn: 'Reported portfolio: $1,118bn',
    reportedTotalUsdBn: 1_118,
    inputs: { ...ASIA_US_PORTFOLIO_DEFAULTS, equitiesUsdBn: 759, treasuryUsdBn: 239, agencyUsdBn: 17, corporateUsdBn: 90, shortTermUsdBn: 14 },
  },
  {
    id: 'taiwan',
    labelFr: 'Taïwan',
    labelEn: 'Taiwan',
    noteFr: 'Portefeuille déclaré : 854 Md$',
    noteEn: 'Reported portfolio: $854bn',
    reportedTotalUsdBn: 854,
    inputs: { ...ASIA_US_PORTFOLIO_DEFAULTS, equitiesUsdBn: 172, treasuryUsdBn: 304, agencyUsdBn: 185, corporateUsdBn: 188, shortTermUsdBn: 5 },
  },
  {
    id: 'korea',
    labelFr: 'Corée du Sud',
    labelEn: 'South Korea',
    noteFr: 'Portefeuille déclaré : 804 Md$',
    noteEn: 'Reported portfolio: $804bn',
    reportedTotalUsdBn: 804,
    inputs: { ...ASIA_US_PORTFOLIO_DEFAULTS, equitiesUsdBn: 592, treasuryUsdBn: 120, agencyUsdBn: 34, corporateUsdBn: 50, shortTermUsdBn: 8 },
  },
  {
    id: 'hong-kong',
    labelFr: 'Hong Kong',
    labelEn: 'Hong Kong',
    noteFr: 'Portefeuille déclaré : 608 Md$',
    noteEn: 'Reported portfolio: $608bn',
    reportedTotalUsdBn: 608,
    inputs: { ...ASIA_US_PORTFOLIO_DEFAULTS, equitiesUsdBn: 263, treasuryUsdBn: 190, agencyUsdBn: 12, corporateUsdBn: 91, shortTermUsdBn: 52 },
  },
] as const;

const finite = (value: unknown, fallback: number): number => {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};
const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

export function normalizeAsiaUSPortfolioInputs(
  partial: Partial<AsiaUSPortfolioInputs> = {},
): AsiaUSPortfolioInputs {
  const holding = (key: keyof AsiaUSPortfolioInputs, fallback: number) => clamp(finite(partial[key], fallback), 0, 50_000);
  const shock = (key: keyof AsiaUSPortfolioInputs, fallback: number) => clamp(finite(partial[key], fallback), -100, 100);
  return {
    equitiesUsdBn: holding('equitiesUsdBn', ASIA_US_PORTFOLIO_DEFAULTS.equitiesUsdBn),
    treasuryUsdBn: holding('treasuryUsdBn', ASIA_US_PORTFOLIO_DEFAULTS.treasuryUsdBn),
    agencyUsdBn: holding('agencyUsdBn', ASIA_US_PORTFOLIO_DEFAULTS.agencyUsdBn),
    corporateUsdBn: holding('corporateUsdBn', ASIA_US_PORTFOLIO_DEFAULTS.corporateUsdBn),
    shortTermUsdBn: holding('shortTermUsdBn', ASIA_US_PORTFOLIO_DEFAULTS.shortTermUsdBn),
    equityShockPct: shock('equityShockPct', ASIA_US_PORTFOLIO_DEFAULTS.equityShockPct),
    treasuryShockPct: shock('treasuryShockPct', ASIA_US_PORTFOLIO_DEFAULTS.treasuryShockPct),
    agencyShockPct: shock('agencyShockPct', ASIA_US_PORTFOLIO_DEFAULTS.agencyShockPct),
    corporateShockPct: shock('corporateShockPct', ASIA_US_PORTFOLIO_DEFAULTS.corporateShockPct),
    shortTermShockPct: shock('shortTermShockPct', ASIA_US_PORTFOLIO_DEFAULTS.shortTermShockPct),
  };
}

export function calculateAsiaUSPortfolioStress(
  partial: Partial<AsiaUSPortfolioInputs> = {},
): AsiaUSPortfolioOutputs {
  const inputs = normalizeAsiaUSPortfolioInputs(partial);
  const baseValueUsdBn = inputs.equitiesUsdBn + inputs.treasuryUsdBn + inputs.agencyUsdBn + inputs.corporateUsdBn + inputs.shortTermUsdBn;
  const equityChangeUsdBn = inputs.equitiesUsdBn * inputs.equityShockPct / 100;
  const treasuryChangeUsdBn = inputs.treasuryUsdBn * inputs.treasuryShockPct / 100;
  const agencyChangeUsdBn = inputs.agencyUsdBn * inputs.agencyShockPct / 100;
  const corporateChangeUsdBn = inputs.corporateUsdBn * inputs.corporateShockPct / 100;
  const shortTermChangeUsdBn = inputs.shortTermUsdBn * inputs.shortTermShockPct / 100;
  const changes = {
    equities: equityChangeUsdBn,
    treasury: treasuryChangeUsdBn,
    agency: agencyChangeUsdBn,
    corporate: corporateChangeUsdBn,
    shortTerm: shortTermChangeUsdBn,
  };
  const totalChangeUsdBn = Object.values(changes).reduce((sum, value) => sum + value, 0);
  const stressedValueUsdBn = Math.max(0, baseValueUsdBn + totalChangeUsdBn);
  const totalChangePct = baseValueUsdBn === 0 ? 0 : totalChangeUsdBn / baseValueUsdBn * 100;
  const entries = Object.entries(changes) as Array<[Exclude<AsiaUSPortfolioOutputs['largestContributor'], 'none'>, number]>;
  const largestContributor = baseValueUsdBn === 0
    ? 'none'
    : entries.reduce((largest, current) => Math.abs(current[1]) > Math.abs(largest[1]) ? current : largest)[0];

  return {
    ...inputs,
    baseValueUsdBn,
    stressedValueUsdBn,
    totalChangeUsdBn,
    totalChangePct,
    equityChangeUsdBn,
    treasuryChangeUsdBn,
    agencyChangeUsdBn,
    corporateChangeUsdBn,
    shortTermChangeUsdBn,
    largestContributor,
  };
}
