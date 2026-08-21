export const COOLING_QUOTE_MODEL_VERSION = '1.0.0';
export const COOLING_QUOTE_DATA_DATE = '2026-08-21';

export const COOLING_QUOTE_CURRENCIES = ['EUR', 'HUF', 'USD'] as const;
export type CoolingQuoteCurrency = typeof COOLING_QUOTE_CURRENCIES[number];

export const COOLING_QUOTE_DESTINATIONS = [
  'river',
  'air',
  'sea',
  'chemistry',
  'grid',
  'mixed',
] as const;
export type CoolingConstraintDestination = typeof COOLING_QUOTE_DESTINATIONS[number];

export interface CoolingQuoteInputs {
  currency: CoolingQuoteCurrency;
  siteCapacityMW: number;
  securedCapacityMW: number;
  annualMWhPreserved: number;
  capexMillion: number;
  annualOpexMillion: number;
  constructionOutageDays: number;
  replacementPricePerMWh: number;
  lifeYears: number;
  discountRatePct: number;
  auxiliaryLoadPct: number;
  auxiliaryHoursPerYear: number;
  withdrawalBeforeM3MWh: number;
  withdrawalAfterM3MWh: number;
  consumptionBeforeM3MWh: number;
  consumptionAfterM3MWh: number;
  constraintDestination: CoolingConstraintDestination;
}

export interface CoolingQuoteResult {
  inputs: CoolingQuoteInputs;
  capex: number;
  outageMWh: number;
  outageCost: number;
  auxiliaryMWh: number;
  auxiliaryCost: number;
  capitalRecoveryFactor: number;
  annualisedInvestment: number;
  annualEquivalentCost: number;
  costPerKWSecured: number;
  costPerMWhPreserved: number;
  grossAnnualAvoidedValue: number;
  netAnnualBenefitBeforeCapital: number;
  simplePaybackYears: number;
  withdrawalDeltaM3MWh: number;
  withdrawalChangePct: number;
  consumptionDeltaM3MWh: number;
  consumptionChangePct: number;
  completeness: {
    securedCapacity: boolean;
    preservedEnergy: boolean;
    lifetime: boolean;
    replacementPrice: boolean;
    waterWithdrawal: boolean;
    waterConsumption: boolean;
  };
}

export const COOLING_QUOTE_DEFAULTS: Readonly<CoolingQuoteInputs> = Object.freeze({
  currency: 'EUR',
  siteCapacityMW: 1300,
  securedCapacityMW: 500,
  annualMWhPreserved: 120000,
  capexMillion: 500,
  annualOpexMillion: 8,
  constructionOutageDays: 60,
  replacementPricePerMWh: 100,
  lifeYears: 30,
  discountRatePct: 4,
  auxiliaryLoadPct: 0.5,
  auxiliaryHoursPerYear: 6500,
  withdrawalBeforeM3MWh: 70,
  withdrawalAfterM3MWh: 3,
  consumptionBeforeM3MWh: 0.5,
  consumptionAfterM3MWh: 2.2,
  constraintDestination: 'mixed',
});

export const COOLING_QUOTE_PRESETS = Object.freeze({
  demo: {
    ...COOLING_QUOTE_DEFAULTS,
  },
  paks: {
    currency: 'HUF',
    siteCapacityMW: 2000,
    securedCapacityMW: 0,
    annualMWhPreserved: 0,
    capexMillion: 6164.698854,
    annualOpexMillion: 0,
    constructionOutageDays: 0,
    replacementPricePerMWh: 0,
    lifeYears: 0,
    discountRatePct: 4,
    auxiliaryLoadPct: 0,
    auxiliaryHoursPerYear: 0,
    withdrawalBeforeM3MWh: 0,
    withdrawalAfterM3MWh: 0,
    consumptionBeforeM3MWh: 0,
    consumptionAfterM3MWh: 0,
    constraintDestination: 'river',
  },
  frenchTower: {
    currency: 'EUR',
    siteCapacityMW: 0,
    securedCapacityMW: 0,
    annualMWhPreserved: 0,
    capexMillion: 500,
    annualOpexMillion: 0,
    constructionOutageDays: 0,
    replacementPricePerMWh: 0,
    lifeYears: 0,
    discountRatePct: 4,
    auxiliaryLoadPct: 0,
    auxiliaryHoursPerYear: 0,
    withdrawalBeforeM3MWh: 0,
    withdrawalAfterM3MWh: 0,
    consumptionBeforeM3MWh: 0,
    consumptionAfterM3MWh: 0,
    constraintDestination: 'air',
  },
} satisfies Record<string, CoolingQuoteInputs>);

export const COOLING_QUOTE_SOURCES = Object.freeze([
  {
    label: 'Hungarian Gazette, Decrees 122/2026 and 1256/2026',
    url: 'http://magyarkozlony.hu/hivatalos-lapok/ZESdc5X2ExtTq5liwRyP6a736c86c65e4/dokumentumok/9e53fcd585e531768b4cf37f04c76489a80f90ef/letoltes',
    role: 'Public budget transfer and accelerated legal framework for the Paks river works',
  },
  {
    label: 'French Court of Auditors, climate adaptation of nuclear and hydro fleets',
    url: 'https://www.ccomptes.fr/sites/default/files/2024-03/20240312-RPA-2024-CDVI-adaptation-parcs-nucleaire-hydro-electrique.pdf',
    role: 'EUR 500 million per tower order of magnitude, EUR 612.6 million adaptation programme and water tradeoffs',
  },
  {
    label: 'JRC PESETA IV, energy supply',
    url: 'https://joint-research-centre.ec.europa.eu/projects-and-activities/peseta-climate-change-projects/jrc-peseta-iv/energy-supply_en',
    role: 'System-level effect of less water-intensive cooling technologies',
  },
  {
    label: 'EU-BRITE, Industrial Cooling Systems BREF',
    url: 'https://bureau-industrial-transformation.jrc.ec.europa.eu/index.php/reference/industrial-cooling-systems',
    role: 'Physical tradeoffs between once-through, wet, dry and hybrid cooling',
  },
]);

const finite = (value: unknown, fallback: number) => {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const clamp = (value: unknown, minimum: number, maximum: number, fallback: number) => (
  Math.min(Math.max(finite(value, fallback), minimum), maximum)
);

const validCurrency = (value: unknown): CoolingQuoteCurrency => (
  typeof value === 'string' && (COOLING_QUOTE_CURRENCIES as readonly string[]).includes(value)
    ? value as CoolingQuoteCurrency
    : COOLING_QUOTE_DEFAULTS.currency
);

const validDestination = (value: unknown): CoolingConstraintDestination => (
  typeof value === 'string' && (COOLING_QUOTE_DESTINATIONS as readonly string[]).includes(value)
    ? value as CoolingConstraintDestination
    : COOLING_QUOTE_DEFAULTS.constraintDestination
);

export function normalizeCoolingQuoteInputs(
  candidate: Partial<CoolingQuoteInputs> = {},
): CoolingQuoteInputs {
  return {
    currency: validCurrency(candidate.currency),
    siteCapacityMW: clamp(candidate.siteCapacityMW, 0, 100_000, COOLING_QUOTE_DEFAULTS.siteCapacityMW),
    securedCapacityMW: clamp(candidate.securedCapacityMW, 0, 100_000, COOLING_QUOTE_DEFAULTS.securedCapacityMW),
    annualMWhPreserved: clamp(candidate.annualMWhPreserved, 0, 1_000_000_000, COOLING_QUOTE_DEFAULTS.annualMWhPreserved),
    capexMillion: clamp(candidate.capexMillion, 0, 1_000_000, COOLING_QUOTE_DEFAULTS.capexMillion),
    annualOpexMillion: clamp(candidate.annualOpexMillion, 0, 1_000_000, COOLING_QUOTE_DEFAULTS.annualOpexMillion),
    constructionOutageDays: clamp(candidate.constructionOutageDays, 0, 3650, COOLING_QUOTE_DEFAULTS.constructionOutageDays),
    replacementPricePerMWh: clamp(candidate.replacementPricePerMWh, 0, 100_000, COOLING_QUOTE_DEFAULTS.replacementPricePerMWh),
    lifeYears: clamp(candidate.lifeYears, 0, 100, COOLING_QUOTE_DEFAULTS.lifeYears),
    discountRatePct: clamp(candidate.discountRatePct, 0, 50, COOLING_QUOTE_DEFAULTS.discountRatePct),
    auxiliaryLoadPct: clamp(candidate.auxiliaryLoadPct, 0, 30, COOLING_QUOTE_DEFAULTS.auxiliaryLoadPct),
    auxiliaryHoursPerYear: clamp(candidate.auxiliaryHoursPerYear, 0, 8760, COOLING_QUOTE_DEFAULTS.auxiliaryHoursPerYear),
    withdrawalBeforeM3MWh: clamp(candidate.withdrawalBeforeM3MWh, 0, 1_000_000, COOLING_QUOTE_DEFAULTS.withdrawalBeforeM3MWh),
    withdrawalAfterM3MWh: clamp(candidate.withdrawalAfterM3MWh, 0, 1_000_000, COOLING_QUOTE_DEFAULTS.withdrawalAfterM3MWh),
    consumptionBeforeM3MWh: clamp(candidate.consumptionBeforeM3MWh, 0, 1_000_000, COOLING_QUOTE_DEFAULTS.consumptionBeforeM3MWh),
    consumptionAfterM3MWh: clamp(candidate.consumptionAfterM3MWh, 0, 1_000_000, COOLING_QUOTE_DEFAULTS.consumptionAfterM3MWh),
    constraintDestination: validDestination(candidate.constraintDestination),
  };
}

export function capitalRecoveryFactor(ratePct: number, years: number): number {
  if (years <= 0) return Number.NaN;
  const rate = Math.max(ratePct, 0) / 100;
  if (rate === 0) return 1 / years;
  const factor = Math.pow(1 + rate, years);
  return rate * factor / (factor - 1);
}

const percentageChange = (before: number, after: number) => (
  before > 0 ? (after - before) / before * 100 : Number.NaN
);

export function evaluateCoolingQuote(
  candidate: Partial<CoolingQuoteInputs> = {},
): CoolingQuoteResult {
  const inputs = normalizeCoolingQuoteInputs(candidate);
  const capex = inputs.capexMillion * 1_000_000;
  const outageMWh = inputs.siteCapacityMW * 24 * inputs.constructionOutageDays;
  const outageCost = outageMWh * inputs.replacementPricePerMWh;
  const auxiliaryMWh = inputs.siteCapacityMW
    * inputs.auxiliaryLoadPct / 100
    * inputs.auxiliaryHoursPerYear;
  const auxiliaryCost = auxiliaryMWh * inputs.replacementPricePerMWh;
  const crf = capitalRecoveryFactor(inputs.discountRatePct, inputs.lifeYears);
  const annualisedInvestment = Number.isFinite(crf)
    ? (capex + outageCost) * crf
    : Number.NaN;
  const annualEquivalentCost = Number.isFinite(annualisedInvestment)
    ? annualisedInvestment + inputs.annualOpexMillion * 1_000_000 + auxiliaryCost
    : Number.NaN;
  const costPerKWSecured = inputs.securedCapacityMW > 0
    ? capex / (inputs.securedCapacityMW * 1_000)
    : Number.NaN;
  const costPerMWhPreserved = inputs.annualMWhPreserved > 0 && Number.isFinite(annualEquivalentCost)
    ? annualEquivalentCost / inputs.annualMWhPreserved
    : Number.NaN;
  const grossAnnualAvoidedValue = inputs.annualMWhPreserved * inputs.replacementPricePerMWh;
  const netAnnualBenefitBeforeCapital = grossAnnualAvoidedValue
    - inputs.annualOpexMillion * 1_000_000
    - auxiliaryCost;
  const simplePaybackYears = netAnnualBenefitBeforeCapital > 0
    ? (capex + outageCost) / netAnnualBenefitBeforeCapital
    : Number.NaN;

  return {
    inputs,
    capex,
    outageMWh,
    outageCost,
    auxiliaryMWh,
    auxiliaryCost,
    capitalRecoveryFactor: crf,
    annualisedInvestment,
    annualEquivalentCost,
    costPerKWSecured,
    costPerMWhPreserved,
    grossAnnualAvoidedValue,
    netAnnualBenefitBeforeCapital,
    simplePaybackYears,
    withdrawalDeltaM3MWh: inputs.withdrawalAfterM3MWh - inputs.withdrawalBeforeM3MWh,
    withdrawalChangePct: percentageChange(inputs.withdrawalBeforeM3MWh, inputs.withdrawalAfterM3MWh),
    consumptionDeltaM3MWh: inputs.consumptionAfterM3MWh - inputs.consumptionBeforeM3MWh,
    consumptionChangePct: percentageChange(inputs.consumptionBeforeM3MWh, inputs.consumptionAfterM3MWh),
    completeness: {
      securedCapacity: inputs.securedCapacityMW > 0,
      preservedEnergy: inputs.annualMWhPreserved > 0,
      lifetime: inputs.lifeYears > 0,
      replacementPrice: inputs.replacementPricePerMWh > 0,
      waterWithdrawal: inputs.withdrawalBeforeM3MWh > 0 || inputs.withdrawalAfterM3MWh > 0,
      waterConsumption: inputs.consumptionBeforeM3MWh > 0 || inputs.consumptionAfterM3MWh > 0,
    },
  };
}
