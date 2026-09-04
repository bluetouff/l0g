export const ASIA_DOLLAR_HEDGE_MODEL_VERSION = '1.0.0';

export interface AsiaDollarHedgeInputs {
  portfolioUsdBn: number;
  naturalHedgePct: number;
  derivativeHedgePct: number;
  assetHorizonYears: number;
  hedgeTenorMonths: number;
  annualCarryBp: number;
  basisStressBp: number;
  collateralCallPct: number;
  dollarMoveInLocalCurrencyPct: number;
}

export interface AsiaDollarHedgeOutputs extends AsiaDollarHedgeInputs {
  naturalHedgeUsdBn: number;
  derivativeHedgeUsdBn: number;
  openNotionalUsdBn: number;
  coveragePct: number;
  hedgeContractsPerPosition: number;
  renewalsAfterInitial: number;
  averageMonthlyRollUsdBn: number;
  cumulativeGrossRollNotionalUsdBn: number;
  annualCarryCostUsdBn: number;
  incrementalAnnualBasisCostUsdBn: number;
  collateralCallUsdBn: number;
  openFxTranslationUsdBn: number;
}

export const ASIA_DOLLAR_HEDGE_DEFAULTS: AsiaDollarHedgeInputs = {
  portfolioUsdBn: 100,
  naturalHedgePct: 10,
  derivativeHedgePct: 60,
  assetHorizonYears: 20,
  hedgeTenorMonths: 3,
  annualCarryBp: 150,
  basisStressBp: 100,
  collateralCallPct: 3,
  dollarMoveInLocalCurrencyPct: -10,
};

export const ASIA_DOLLAR_HEDGE_PRESETS = [
  {
    id: 'three-month',
    labelFr: 'Couverture 3 mois',
    labelEn: '3-month hedge',
    noteFr: '80 contrats sur 20 ans',
    noteEn: '80 contracts over 20 years',
    inputs: { ...ASIA_DOLLAR_HEDGE_DEFAULTS },
  },
  {
    id: 'one-year',
    labelFr: 'Couverture 12 mois',
    labelEn: '12-month hedge',
    noteFr: '20 contrats, puis 19 renouvellements',
    noteEn: '20 contracts, then 19 renewals',
    inputs: { ...ASIA_DOLLAR_HEDGE_DEFAULTS, hedgeTenorMonths: 12 },
  },
  {
    id: 'three-year',
    labelFr: 'Couverture 36 mois',
    labelEn: '36-month hedge',
    noteFr: '7 contrats, puis 6 renouvellements',
    noteEn: '7 contracts, then 6 renewals',
    inputs: { ...ASIA_DOLLAR_HEDGE_DEFAULTS, hedgeTenorMonths: 36 },
  },
] as const;

const finite = (value: unknown, fallback: number): number => {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

export function normalizeAsiaDollarHedgeInputs(
  partial: Partial<AsiaDollarHedgeInputs> = {},
): AsiaDollarHedgeInputs {
  const naturalHedgePct = clamp(
    finite(partial.naturalHedgePct, ASIA_DOLLAR_HEDGE_DEFAULTS.naturalHedgePct),
    0,
    100,
  );
  const derivativeHedgePct = clamp(
    finite(partial.derivativeHedgePct, ASIA_DOLLAR_HEDGE_DEFAULTS.derivativeHedgePct),
    0,
    100 - naturalHedgePct,
  );

  return {
    portfolioUsdBn: clamp(
      finite(partial.portfolioUsdBn, ASIA_DOLLAR_HEDGE_DEFAULTS.portfolioUsdBn),
      0,
      10_000,
    ),
    naturalHedgePct,
    derivativeHedgePct,
    assetHorizonYears: clamp(
      finite(partial.assetHorizonYears, ASIA_DOLLAR_HEDGE_DEFAULTS.assetHorizonYears),
      0,
      100,
    ),
    hedgeTenorMonths: clamp(
      finite(partial.hedgeTenorMonths, ASIA_DOLLAR_HEDGE_DEFAULTS.hedgeTenorMonths),
      1,
      120,
    ),
    annualCarryBp: clamp(
      finite(partial.annualCarryBp, ASIA_DOLLAR_HEDGE_DEFAULTS.annualCarryBp),
      -2_000,
      5_000,
    ),
    basisStressBp: clamp(
      finite(partial.basisStressBp, ASIA_DOLLAR_HEDGE_DEFAULTS.basisStressBp),
      -2_000,
      5_000,
    ),
    collateralCallPct: clamp(
      finite(partial.collateralCallPct, ASIA_DOLLAR_HEDGE_DEFAULTS.collateralCallPct),
      0,
      100,
    ),
    dollarMoveInLocalCurrencyPct: clamp(
      finite(
        partial.dollarMoveInLocalCurrencyPct,
        ASIA_DOLLAR_HEDGE_DEFAULTS.dollarMoveInLocalCurrencyPct,
      ),
      -100,
      100,
    ),
  };
}

export function calculateAsiaDollarHedge(
  partial: Partial<AsiaDollarHedgeInputs> = {},
): AsiaDollarHedgeOutputs {
  const inputs = normalizeAsiaDollarHedgeInputs(partial);
  const naturalHedgeUsdBn = inputs.portfolioUsdBn * inputs.naturalHedgePct / 100;
  const derivativeHedgeUsdBn = inputs.portfolioUsdBn * inputs.derivativeHedgePct / 100;
  const openNotionalUsdBn = Math.max(0, inputs.portfolioUsdBn - naturalHedgeUsdBn - derivativeHedgeUsdBn);
  const coveragePct = inputs.portfolioUsdBn === 0
    ? 0
    : (naturalHedgeUsdBn + derivativeHedgeUsdBn) / inputs.portfolioUsdBn * 100;
  const hedgeContractsPerPosition = inputs.assetHorizonYears === 0
    ? 0
    : Math.ceil(inputs.assetHorizonYears * 12 / inputs.hedgeTenorMonths);
  const renewalsAfterInitial = Math.max(0, hedgeContractsPerPosition - 1);
  const averageMonthlyRollUsdBn = derivativeHedgeUsdBn / inputs.hedgeTenorMonths;
  const cumulativeGrossRollNotionalUsdBn = derivativeHedgeUsdBn * hedgeContractsPerPosition;
  const annualCarryCostUsdBn = derivativeHedgeUsdBn * inputs.annualCarryBp / 10_000;
  const incrementalAnnualBasisCostUsdBn = derivativeHedgeUsdBn * inputs.basisStressBp / 10_000;
  const collateralCallUsdBn = derivativeHedgeUsdBn * inputs.collateralCallPct / 100;
  const openFxTranslationUsdBn = openNotionalUsdBn * inputs.dollarMoveInLocalCurrencyPct / 100;

  return {
    ...inputs,
    naturalHedgeUsdBn,
    derivativeHedgeUsdBn,
    openNotionalUsdBn,
    coveragePct,
    hedgeContractsPerPosition,
    renewalsAfterInitial,
    averageMonthlyRollUsdBn,
    cumulativeGrossRollNotionalUsdBn,
    annualCarryCostUsdBn,
    incrementalAnnualBasisCostUsdBn,
    collateralCallUsdBn,
    openFxTranslationUsdBn,
  };
}
