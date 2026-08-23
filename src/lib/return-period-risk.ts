export interface ReturnPeriodRiskInputs {
  returnPeriodYears: number;
  exposureYears: number;
}

export interface ReturnPeriodRiskResult extends ReturnPeriodRiskInputs {
  annualProbability: number;
  cumulativeProbability: number;
  annualProbabilityPct: number;
  cumulativeProbabilityPct: number;
}

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(maximum, Math.max(minimum, Number.isFinite(value) ? value : minimum));

export const RETURN_PERIOD_DEFAULTS: ReturnPeriodRiskInputs = {
  returnPeriodYears: 250,
  exposureYears: 20,
};

export const normalizeReturnPeriodRiskInputs = (
  inputs: Partial<ReturnPeriodRiskInputs>,
): ReturnPeriodRiskInputs => ({
  returnPeriodYears: Math.round(clamp(Number(inputs.returnPeriodYears), 2, 10_000)),
  exposureYears: Math.round(clamp(Number(inputs.exposureYears), 1, 100)),
});

export const calculateReturnPeriodRisk = (
  rawInputs: Partial<ReturnPeriodRiskInputs>,
): ReturnPeriodRiskResult => {
  const inputs = normalizeReturnPeriodRiskInputs(rawInputs);
  const annualProbability = 1 / inputs.returnPeriodYears;
  const cumulativeProbability = 1 - (1 - annualProbability) ** inputs.exposureYears;

  return {
    ...inputs,
    annualProbability,
    cumulativeProbability,
    annualProbabilityPct: annualProbability * 100,
    cumulativeProbabilityPct: cumulativeProbability * 100,
  };
};
