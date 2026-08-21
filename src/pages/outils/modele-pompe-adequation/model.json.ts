import type { APIRoute } from 'astro';
import { ADEQUACY_PUMP_DATA_DATE, ADEQUACY_PUMP_DEFAULTS, ADEQUACY_PUMP_MODEL_VERSION, ADEQUACY_PUMP_PRESETS, ADEQUACY_PUMP_SOURCES, evaluateAdequacyPump } from '../../../lib/adequacy-pump-model.ts';

const payload = {
  id: 'adequacy-pump-model', version: ADEQUACY_PUMP_MODEL_VERSION, asOf: ADEQUACY_PUMP_DATA_DATE,
  status: 'illustrative-scenario-model', language: 'bilingual', defaults: ADEQUACY_PUMP_DEFAULTS, presets: ADEQUACY_PUMP_PRESETS,
  formulas: {
    baselineMarginMw: 'zoneDomesticMw + importCapacityMw - zoneDemandMw',
    postWaterMarginMw: 'zoneDomesticMw - hydroLossMw - waterCoolingLossMw + importCapacityMw - zoneDemandMw',
    finalZoneMarginMw: 'postWaterMarginMw + flexibilityMw',
    localAccessibleImportsMw: 'importCapacityMw * localImportSharePct / 100',
    finalLocalMarginMw: 'localDomesticMw - localHydroLossMw - localWaterCoolingLossMw + localAccessibleImportsMw + localFlexibilityMw - localDemandMw',
  },
  examples: Object.fromEntries(Object.entries(ADEQUACY_PUMP_PRESETS).map(([name, inputs]) => [name, evaluateAdequacyPump(inputs)])),
  sources: ADEQUACY_PUMP_SOURCES,
  limits: [
    'All capacities and losses are illustrative inputs, not observed 2026 system values.',
    'The model does not reproduce the ENTSO-E Seasonal Outlook or STSAA methodology.',
    'It does not calculate power flows, congestion, voltage, stability, N-1 security, price or emissions.',
    'A positive arithmetic margin does not establish that electricity can reach every local load.',
  ],
};

export const GET: APIRoute = () => new Response(JSON.stringify(payload, null, 2), { headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'public, max-age=3600', 'x-content-type-options': 'nosniff' } });
