import assert from 'node:assert/strict';

import {
  PJM_FORECAST_DEFAULTS,
  PJM_IMM_FIXED_SCENARIO,
  calculatePjmForecastMetrics,
  normalizePjmForecastInputs,
} from '../src/lib/pjm-forecast-cost.ts';

const result = calculatePjmForecastMetrics(PJM_FORECAST_DEFAULTS);

assert.equal(result.linearOrderOfMagnitudeUsd, 948_200_518.6);
assert.equal(result.immActualRevenueUsd, 16_124_370_889);
assert.equal(result.immCounterfactualRevenueUsd, 8_853_172_918);
assert.equal(result.immModeledDifferenceUsd, 7_271_197_971);
assert.ok(Math.abs(result.increaseVsCounterfactualPct - 82.131) < 0.001);
assert.ok(Math.abs(result.differenceAsShareOfActualPct - 45.0945) < 0.001);

assert.deepEqual(
  normalizePjmForecastInputs({
    forecastLoadMw: -1,
    priceUsdPerMwDay: 9_999,
    days: 900,
  }),
  { forecastLoadMw: 0, priceUsdPerMwDay: 5_000, days: 366 },
);

assert.deepEqual(
  normalizePjmForecastInputs({
    forecastLoadMw: Number.NaN,
    priceUsdPerMwDay: Number.POSITIVE_INFINITY,
    days: Number.NaN,
  }),
  PJM_FORECAST_DEFAULTS,
);

assert.equal(
  PJM_IMM_FIXED_SCENARIO.actualRevenueUsd -
    PJM_IMM_FIXED_SCENARIO.counterfactualRevenueUsd,
  result.immModeledDifferenceUsd,
);

console.log('PJM forecast-cost calculations: OK');
