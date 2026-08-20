import type { APIRoute } from 'astro';
import {
  THERMAL_SITES,
  THERMAL_THRESHOLD_DATA_DATE,
  THERMAL_THRESHOLD_DEFAULTS,
  THERMAL_THRESHOLD_MODEL_VERSION,
  THERMAL_THRESHOLD_SOURCES,
  evaluateThermalThreshold,
} from '../../../lib/thermal-threshold-model.ts';

const payload = {
  id: 'thermal-discharge-thresholds',
  version: THERMAL_THRESHOLD_MODEL_VERSION,
  asOf: THERMAL_THRESHOLD_DATA_DATE,
  status: 'documentary-rule-engine',
  language: 'bilingual',
  sites: THERMAL_SITES,
  defaults: THERMAL_THRESHOLD_DEFAULTS,
  inputs: {
    site: 'One of the five documented plant identifiers',
    date: 'Calendar date in YYYY-MM-DD format',
    canalFlowM3s: 'Tricastin canal flow, bounded from 0 to 5,000 m3/s',
    rteRequired: 'Reader-selected documentary condition, not a forecast or live RTE signal',
    temporaryBugeyDecision: 'Reader-selected application of ASNR 2026-DC-052, accepted only from 12 to 20 July 2026 and with RTE required',
  },
  precedence: [
    'Eligible Bugey temporary decision when both its date window and RTE condition are met',
    'Permanent exceptional-climatic-condition rule when RTE required is selected',
    'Normal seasonal and flow-dependent rule otherwise',
  ],
  examples: {
    bugeyNormal: evaluateThermalThreshold({ site: 'bugey', date: '2026-07-15' }),
    bugeyCce: evaluateThermalThreshold({ site: 'bugey', date: '2026-07-15', rteRequired: true }),
    bugeyTemporary: evaluateThermalThreshold({ site: 'bugey', date: '2026-07-15', rteRequired: true, temporaryBugeyDecision: true }),
    tricastinBelow480: evaluateThermalThreshold({ site: 'tricastin', canalFlowM3s: 479 }),
    tricastinAt480: evaluateThermalThreshold({ site: 'tricastin', canalFlowM3s: 480 }),
    saintAlbanCce: evaluateThermalThreshold({ site: 'saintalban', rteRequired: true }),
  },
  sources: THERMAL_THRESHOLD_SOURCES,
  limits: [
    'The tool selects published rules; it does not establish that RTE actually required a unit.',
    'It does not forecast river temperature, compliance, reactor safety, output or ecological effects.',
    'EDF Open Data reports an irregular update frequency and a last dataset modification on 31 July 2024.',
    'Consolidated legal texts and operator measurements remain authoritative.',
  ],
};

export const GET: APIRoute = () => new Response(JSON.stringify(payload, null, 2), {
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'public, max-age=3600',
    'x-content-type-options': 'nosniff',
  },
});
