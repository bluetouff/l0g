export interface WheatImportStressInput {
  annualImportsMt: number;
  baseFobUsdPerTonne: number;
  baseFreightUsdPerTonne: number;
  wheatPriceShockPct: number;
  freightShockPct: number;
  // Change in local-currency units per USD, not the inverse currency quote.
  exchangeRateShockPct: number;
}

export type WheatImportStressError =
  | 'imports-invalid'
  | 'fob-invalid'
  | 'freight-invalid'
  | 'wheat-shock-invalid'
  | 'freight-shock-invalid'
  | 'currency-shock-invalid';

export interface ValidWheatImportStressResult {
  valid: true;
  errors: [];
  baseLandedUsdPerTonne: number;
  stressedFobUsdPerTonne: number;
  stressedFreightUsdPerTonne: number;
  stressedLandedUsdPerTonne: number;
  baseAnnualBillUsdBn: number;
  stressedAnnualBillUsdBn: number;
  annualBillIncreaseUsdBn: number;
  grainContributionUsdBn: number;
  freightContributionUsdBn: number;
  dollarBillIndex: number;
  currencyContributionIndexPoints: number;
  localCurrencyBillIndex: number;
  landedPriceChangePct: number;
}

export type WheatImportStressResult = ValidWheatImportStressResult | {
  valid: false;
  errors: WheatImportStressError[];
};

export const DEFAULT_WHEAT_IMPORT_STRESS_INPUT: WheatImportStressInput = {
  annualImportsMt: 10,
  baseFobUsdPerTonne: 270,
  baseFreightUsdPerTonne: 30,
  wheatPriceShockPct: 10,
  freightShockPct: 50,
  exchangeRateShockPct: 5,
};

const LIMITS = {
  annualImportsMt: [0.01, 250],
  baseFobUsdPerTonne: [1, 5000],
  baseFreightUsdPerTonne: [0, 1000],
  wheatPriceShockPct: [-90, 500],
  freightShockPct: [-90, 1000],
  exchangeRateShockPct: [-80, 500],
} as const;

function inRange(value: number, [min, max]: readonly [number, number]): boolean {
  return Number.isFinite(value) && value >= min && value <= max;
}

export function validateWheatImportStress(
  input: WheatImportStressInput,
): WheatImportStressError[] {
  const errors: WheatImportStressError[] = [];

  if (!inRange(input.annualImportsMt, LIMITS.annualImportsMt)) errors.push('imports-invalid');
  if (!inRange(input.baseFobUsdPerTonne, LIMITS.baseFobUsdPerTonne)) errors.push('fob-invalid');
  if (!inRange(input.baseFreightUsdPerTonne, LIMITS.baseFreightUsdPerTonne)) errors.push('freight-invalid');
  if (!inRange(input.wheatPriceShockPct, LIMITS.wheatPriceShockPct)) errors.push('wheat-shock-invalid');
  if (!inRange(input.freightShockPct, LIMITS.freightShockPct)) errors.push('freight-shock-invalid');
  if (!inRange(input.exchangeRateShockPct, LIMITS.exchangeRateShockPct)) errors.push('currency-shock-invalid');

  return errors;
}

export function assessWheatImportStress(
  input: WheatImportStressInput,
): WheatImportStressResult {
  const errors = validateWheatImportStress(input);
  if (errors.length > 0) {
    return {
      valid: false,
      errors,
    };
  }

  const baseLandedUsdPerTonne = input.baseFobUsdPerTonne + input.baseFreightUsdPerTonne;
  const stressedFobUsdPerTonne = input.baseFobUsdPerTonne * (1 + input.wheatPriceShockPct / 100);
  const stressedFreightUsdPerTonne = input.baseFreightUsdPerTonne * (1 + input.freightShockPct / 100);
  const stressedLandedUsdPerTonne = stressedFobUsdPerTonne + stressedFreightUsdPerTonne;

  const baseAnnualBillUsdBn = input.annualImportsMt * baseLandedUsdPerTonne / 1000;
  const stressedAnnualBillUsdBn = input.annualImportsMt * stressedLandedUsdPerTonne / 1000;
  const grainContributionUsdBn = input.annualImportsMt *
    (stressedFobUsdPerTonne - input.baseFobUsdPerTonne) / 1000;
  const freightContributionUsdBn = input.annualImportsMt *
    (stressedFreightUsdPerTonne - input.baseFreightUsdPerTonne) / 1000;
  const annualBillIncreaseUsdBn = stressedAnnualBillUsdBn - baseAnnualBillUsdBn;
  const dollarBillIndex = stressedAnnualBillUsdBn / baseAnnualBillUsdBn * 100;
  const currencyContributionIndexPoints = dollarBillIndex * input.exchangeRateShockPct / 100;
  const localCurrencyBillIndex = dollarBillIndex + currencyContributionIndexPoints;
  const landedPriceChangePct = (stressedLandedUsdPerTonne / baseLandedUsdPerTonne - 1) * 100;

  return {
    valid: true,
    errors: [],
    baseLandedUsdPerTonne,
    stressedFobUsdPerTonne,
    stressedFreightUsdPerTonne,
    stressedLandedUsdPerTonne,
    baseAnnualBillUsdBn,
    stressedAnnualBillUsdBn,
    annualBillIncreaseUsdBn,
    grainContributionUsdBn,
    freightContributionUsdBn,
    dollarBillIndex,
    currencyContributionIndexPoints,
    localCurrencyBillIndex,
    landedPriceChangePct,
  };
}
