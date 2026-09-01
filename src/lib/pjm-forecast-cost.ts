export interface PjmForecastInputs {
  forecastLoadMw: number;
  priceUsdPerMwDay: number;
  days: number;
}

export interface PjmForecastMetrics extends PjmForecastInputs {
  linearOrderOfMagnitudeUsd: number;
  immActualRevenueUsd: number;
  immCounterfactualRevenueUsd: number;
  immModeledDifferenceUsd: number;
  increaseVsCounterfactualPct: number;
  differenceAsShareOfActualPct: number;
}

export const PJM_FORECAST_DEFAULTS: PjmForecastInputs = Object.freeze({
  forecastLoadMw: 7_892,
  priceUsdPerMwDay: 329.17,
  days: 365,
});

export const PJM_IMM_FIXED_SCENARIO = Object.freeze({
  actualRevenueUsd: 16_124_370_889,
  counterfactualRevenueUsd: 8_853_172_918,
});

const finiteOr = (value: number, fallback: number): number =>
  Number.isFinite(value) ? value : fallback;

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

export function normalizePjmForecastInputs(
  inputs: Partial<PjmForecastInputs>,
): PjmForecastInputs {
  return {
    forecastLoadMw: Math.round(
      clamp(
        finiteOr(Number(inputs.forecastLoadMw), PJM_FORECAST_DEFAULTS.forecastLoadMw),
        0,
        100_000,
      ),
    ),
    priceUsdPerMwDay:
      Math.round(
        clamp(
          finiteOr(
            Number(inputs.priceUsdPerMwDay),
            PJM_FORECAST_DEFAULTS.priceUsdPerMwDay,
          ),
          0,
          5_000,
        ) * 100,
      ) / 100,
    days: Math.round(
      clamp(finiteOr(Number(inputs.days), PJM_FORECAST_DEFAULTS.days), 1, 366),
    ),
  };
}

export function calculatePjmForecastMetrics(
  inputs: Partial<PjmForecastInputs> = PJM_FORECAST_DEFAULTS,
): PjmForecastMetrics {
  const normalized = normalizePjmForecastInputs(inputs);
  const immModeledDifferenceUsd =
    PJM_IMM_FIXED_SCENARIO.actualRevenueUsd -
    PJM_IMM_FIXED_SCENARIO.counterfactualRevenueUsd;

  return {
    ...normalized,
    linearOrderOfMagnitudeUsd:
      normalized.forecastLoadMw * normalized.priceUsdPerMwDay * normalized.days,
    immActualRevenueUsd: PJM_IMM_FIXED_SCENARIO.actualRevenueUsd,
    immCounterfactualRevenueUsd: PJM_IMM_FIXED_SCENARIO.counterfactualRevenueUsd,
    immModeledDifferenceUsd,
    increaseVsCounterfactualPct:
      (immModeledDifferenceUsd / PJM_IMM_FIXED_SCENARIO.counterfactualRevenueUsd) * 100,
    differenceAsShareOfActualPct:
      (immModeledDifferenceUsd / PJM_IMM_FIXED_SCENARIO.actualRevenueUsd) * 100,
  };
}
