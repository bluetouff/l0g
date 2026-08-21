import type { APIRoute } from 'astro';
import { RESERVOIR_ARBITRATOR_DATA_DATE, RESERVOIR_ARBITRATOR_DEFAULTS, RESERVOIR_ARBITRATOR_MODEL_VERSION, RESERVOIR_ARBITRATOR_MODES, RESERVOIR_ARBITRATOR_SOURCES, evaluateReservoirArbitrator } from '../../../lib/reservoir-arbitrator-model.ts';

const payload = {
  id: 'reservoir-arbitrator', version: RESERVOIR_ARBITRATOR_MODEL_VERSION, asOf: RESERVOIR_ARBITRATOR_DATA_DATE,
  status: 'illustrative-scenario-model', language: 'bilingual', modes: RESERVOIR_ARBITRATOR_MODES,
  defaults: RESERVOIR_ARBITRATOR_DEFAULTS,
  formulas: {
    usableNowGWh: 'max(reportedStockGWh - strategicReserveGWh - nonPowerEquivalentGWh - technicalUnavailableGWh, 0)',
    expectedFutureGWh: 'usableNowGWh * futureAvailabilityPct / 100',
    immediateValueMEur: 'usableNowGWh * currentPriceEurMWh / 1000',
    futureValueMEur: 'expectedFutureGWh * futurePriceEurMWh / 1000',
    pumpedDeliverableGWh: 'pumpingInputGWh * roundTripEfficiencyPct / 100',
    pumpedMarginMEur: 'pumpedDeliverableGWh * futureSalePriceEurMWh / 1000 - pumpingInputGWh * pumpingPriceEurMWh / 1000',
  },
  examples: { reservoir: evaluateReservoirArbitrator(RESERVOIR_ARBITRATOR_DEFAULTS), pumpedStorage: evaluateReservoirArbitrator({ ...RESERVOIR_ARBITRATOR_DEFAULTS, mode: 'pumped' }) },
  sources: RESERVOIR_ARBITRATOR_SOURCES,
  limits: [
    'All defaults are illustrative and are not current market or reservoir observations.',
    'Non-power water allocation must already have been converted by the user into a GWh equivalent.',
    'The model excludes inflows, network constraints, taxes, contracts, fixed costs and environmental dispatch rules.',
    'Published stored energy is not calculated uniformly across Europe.',
  ],
};

export const GET: APIRoute = () => new Response(JSON.stringify(payload, null, 2), { headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'public, max-age=3600', 'x-content-type-options': 'nosniff' } });
