export const RESERVOIR_ARBITRATOR_MODEL_VERSION = '1.0.0';
export const RESERVOIR_ARBITRATOR_DATA_DATE = '2026-08-21';

export const RESERVOIR_ARBITRATOR_MODES = ['reservoir', 'pumped'] as const;
export type ReservoirArbitratorMode = typeof RESERVOIR_ARBITRATOR_MODES[number];

export interface ReservoirArbitratorInputs {
  mode: ReservoirArbitratorMode;
  reportedStockGWh: number;
  strategicReserveGWh: number;
  nonPowerEquivalentGWh: number;
  technicalUnavailableGWh: number;
  currentPriceEurMWh: number;
  futurePriceEurMWh: number;
  futureAvailabilityPct: number;
  pumpingInputGWh: number;
  roundTripEfficiencyPct: number;
  pumpingPriceEurMWh: number;
  futureSalePriceEurMWh: number;
}

export interface ReservoirArbitratorResult {
  inputs: ReservoirArbitratorInputs;
  mode: ReservoirArbitratorMode;
  usableNowGWh: number;
  deductionsGWh: number;
  overAllocationGWh: number;
  expectedFutureGWh: number;
  immediateValueMEur: number;
  futureValueMEur: number;
  futureBreakEvenEurMWh: number;
  pumpedDeliverableGWh: number;
  pumpingCostMEur: number;
  pumpedRevenueMEur: number;
  pumpedMarginMEur: number;
  pumpedBreakEvenEurMWh: number;
  decision: 'wait' | 'sell' | 'balanced' | 'pump' | 'do-not-pump';
}

export const RESERVOIR_ARBITRATOR_DEFAULTS: Readonly<ReservoirArbitratorInputs> = Object.freeze({
  mode: 'reservoir',
  reportedStockGWh: 100,
  strategicReserveGWh: 10,
  nonPowerEquivalentGWh: 10,
  technicalUnavailableGWh: 5,
  currentPriceEurMWh: 75,
  futurePriceEurMWh: 110,
  futureAvailabilityPct: 90,
  pumpingInputGWh: 10,
  roundTripEfficiencyPct: 80,
  pumpingPriceEurMWh: 30,
  futureSalePriceEurMWh: 120,
});

export const RESERVOIR_ARBITRATOR_SOURCES = Object.freeze([
  {
    labelFr: "RTE, production hydraulique et valeur d'usage de l'eau",
    labelEn: 'RTE, hydropower generation and water opportunity value',
    url: 'https://analysesetdonnees.rte-france.com/production/hydraulique',
    role: 'Reservoir categories and the opportunity-cost logic used to defer generation',
  },
  {
    labelFr: "NVE/RME, qu'est-ce que la valeur de l'eau ?",
    labelEn: 'NVE/RME, what is water value?',
    url: 'https://www.nve.no/reguleringsmyndigheten/slik-fungerer-kraftsystemet/hva-er-vannverdi/',
    role: 'Why storing too little or too much can both be inefficient for the power system',
  },
  {
    labelFr: 'ElCom, directive 1/2026 sur la réserve hydroélectrique suisse',
    labelEn: 'ElCom Directive 1/2026, Swiss hydropower reserve',
    url: 'https://www.elcom.admin.ch/dam/fr/sd-web/mGUJrCTdfCde/1-2026_Weisung%20Eckwerte%20WResV_26_27_Verpflichtung_FR.pdf',
    role: 'Strategic withholding, activation rule and minimum power requirement',
  },
  {
    labelFr: "ENTSO-E Transparency Platform, méthode de calcul de l'énergie stockée",
    labelEn: 'ENTSO-E Transparency Platform, stored-energy methodology',
    url: 'https://transparencyplatform.zendesk.com/hc/en-us/articles/16648275841684-Aggregate-Filling-Rate-of-Water-Reservoirs-and-Hydro-Storage-Plants-16-1-D',
    role: 'Absence of a standard European calculation method',
  },
]);

const finite = (value: unknown, fallback: number) => {
  const number = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const clamp = (value: unknown, minimum: number, maximum: number, fallback: number) => (
  Math.min(Math.max(finite(value, fallback), minimum), maximum)
);

const validMode = (value: unknown): ReservoirArbitratorMode => (
  typeof value === 'string' && (RESERVOIR_ARBITRATOR_MODES as readonly string[]).includes(value)
    ? value as ReservoirArbitratorMode
    : RESERVOIR_ARBITRATOR_DEFAULTS.mode
);

export function normalizeReservoirArbitratorInputs(
  candidate: Partial<ReservoirArbitratorInputs> = {},
): ReservoirArbitratorInputs {
  return {
    mode: validMode(candidate.mode),
    reportedStockGWh: clamp(candidate.reportedStockGWh, 0, 100_000, RESERVOIR_ARBITRATOR_DEFAULTS.reportedStockGWh),
    strategicReserveGWh: clamp(candidate.strategicReserveGWh, 0, 100_000, RESERVOIR_ARBITRATOR_DEFAULTS.strategicReserveGWh),
    nonPowerEquivalentGWh: clamp(candidate.nonPowerEquivalentGWh, 0, 100_000, RESERVOIR_ARBITRATOR_DEFAULTS.nonPowerEquivalentGWh),
    technicalUnavailableGWh: clamp(candidate.technicalUnavailableGWh, 0, 100_000, RESERVOIR_ARBITRATOR_DEFAULTS.technicalUnavailableGWh),
    currentPriceEurMWh: clamp(candidate.currentPriceEurMWh, 0, 10_000, RESERVOIR_ARBITRATOR_DEFAULTS.currentPriceEurMWh),
    futurePriceEurMWh: clamp(candidate.futurePriceEurMWh, 0, 10_000, RESERVOIR_ARBITRATOR_DEFAULTS.futurePriceEurMWh),
    futureAvailabilityPct: clamp(candidate.futureAvailabilityPct, 0, 100, RESERVOIR_ARBITRATOR_DEFAULTS.futureAvailabilityPct),
    pumpingInputGWh: clamp(candidate.pumpingInputGWh, 0, 100_000, RESERVOIR_ARBITRATOR_DEFAULTS.pumpingInputGWh),
    roundTripEfficiencyPct: clamp(candidate.roundTripEfficiencyPct, 1, 100, RESERVOIR_ARBITRATOR_DEFAULTS.roundTripEfficiencyPct),
    pumpingPriceEurMWh: clamp(candidate.pumpingPriceEurMWh, 0, 10_000, RESERVOIR_ARBITRATOR_DEFAULTS.pumpingPriceEurMWh),
    futureSalePriceEurMWh: clamp(candidate.futureSalePriceEurMWh, 0, 10_000, RESERVOIR_ARBITRATOR_DEFAULTS.futureSalePriceEurMWh),
  };
}

const millionEuros = (energyGWh: number, priceEurMWh: number) => energyGWh * priceEurMWh / 1_000;

export function evaluateReservoirArbitrator(
  candidate: Partial<ReservoirArbitratorInputs> = {},
): ReservoirArbitratorResult {
  const inputs = normalizeReservoirArbitratorInputs(candidate);

  const deductionsGWh = inputs.strategicReserveGWh
    + inputs.nonPowerEquivalentGWh
    + inputs.technicalUnavailableGWh;
  const usableNowGWh = Math.max(inputs.reportedStockGWh - deductionsGWh, 0);
  const overAllocationGWh = Math.max(deductionsGWh - inputs.reportedStockGWh, 0);
  const futureAvailability = inputs.futureAvailabilityPct / 100;
  const expectedFutureGWh = usableNowGWh * futureAvailability;
  const immediateValueMEur = millionEuros(usableNowGWh, inputs.currentPriceEurMWh);
  const futureValueMEur = millionEuros(expectedFutureGWh, inputs.futurePriceEurMWh);
  const futureBreakEvenEurMWh = futureAvailability > 0
    ? inputs.currentPriceEurMWh / futureAvailability
    : Number.POSITIVE_INFINITY;

  const efficiency = inputs.roundTripEfficiencyPct / 100;
  const pumpedDeliverableGWh = inputs.pumpingInputGWh * efficiency;
  const pumpingCostMEur = millionEuros(inputs.pumpingInputGWh, inputs.pumpingPriceEurMWh);
  const pumpedRevenueMEur = millionEuros(pumpedDeliverableGWh, inputs.futureSalePriceEurMWh);
  const pumpedMarginMEur = pumpedRevenueMEur - pumpingCostMEur;
  const pumpedBreakEvenEurMWh = inputs.pumpingPriceEurMWh / efficiency;

  let decision: ReservoirArbitratorResult['decision'];
  if (inputs.mode === 'pumped') {
    decision = pumpedMarginMEur >= 0 ? 'pump' : 'do-not-pump';
  } else {
    const tolerance = Math.max(immediateValueMEur, futureValueMEur, 1) * 0.002;
    decision = futureValueMEur > immediateValueMEur + tolerance
      ? 'wait'
      : immediateValueMEur > futureValueMEur + tolerance
        ? 'sell'
        : 'balanced';
  }

  return {
    inputs,
    mode: inputs.mode,
    usableNowGWh,
    deductionsGWh,
    overAllocationGWh,
    expectedFutureGWh,
    immediateValueMEur,
    futureValueMEur,
    futureBreakEvenEurMWh,
    pumpedDeliverableGWh,
    pumpingCostMEur,
    pumpedRevenueMEur,
    pumpedMarginMEur,
    pumpedBreakEvenEurMWh,
    decision,
  };
}
