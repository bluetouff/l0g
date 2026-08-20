import type { APIRoute } from 'astro';
import {
  DANUBE_CENTIMETRE_DATA_DATE,
  DANUBE_CENTIMETRE_DEFAULTS,
  DANUBE_CENTIMETRE_FORMULAS,
  DANUBE_CENTIMETRE_LIMITS,
  DANUBE_CENTIMETRE_MODEL_VERSION,
  DANUBE_CENTIMETRE_PRESETS,
  DANUBE_CENTIMETRE_SOURCES,
} from '../../../lib/danube-centimetre-model.ts';

const payload = {
  id: 'danube-centimetre-value',
  version: DANUBE_CENTIMETRE_MODEL_VERSION,
  asOf: DANUBE_CENTIMETRE_DATA_DATE,
  status: 'scenario-model',
  language: 'bilingual',
  defaults: DANUBE_CENTIMETRE_DEFAULTS,
  limits: DANUBE_CENTIMETRE_LIMITS,
  presets: DANUBE_CENTIMETRE_PRESETS,
  units: {
    capacityMW: 'MW maintained in operation',
    durationHours: 'hours of operation preserved',
    replacementPriceEurMWh: 'EUR per MWh',
    localLiftCm: 'centimetres at the relevant local gauge or intake',
    interventionCostEur: 'EUR',
  },
  formulas: DANUBE_CENTIMETRE_FORMULAS,
  sources: DANUBE_CENTIMETRE_SOURCES,
  scope: {
    includes: ['scenario energy', 'gross replacement cost', 'gross value per local centimetre', 'simple undiscounted break-even duration', 'net balance after intervention cost'],
    excludes: ['physical water-level-to-power relationship', 'hourly market dispatch', 'balancing and congestion costs', 'fuel and carbon costs', 'hedges', 'ecological and navigation impacts', 'safety value'],
    warning: 'The local lift, preserved duration and replacement price are separate assumptions. No preset establishes a causal physical relationship between one centimetre and a fixed number of megawatts.',
  },
};

export const GET: APIRoute = () => new Response(JSON.stringify(payload, null, 2), {
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'public, max-age=3600',
    'x-content-type-options': 'nosniff',
  },
});
