import type { APIRoute } from 'astro';
import {
  WET_MEGAWATT_DATA_DATE,
  WET_MEGAWATT_DATA_VINTAGE,
  WET_MEGAWATT_DEFAULTS,
  WET_MEGAWATT_FORMULAS,
  WET_MEGAWATT_LIMITS,
  WET_MEGAWATT_MODEL_VERSION,
  WET_MEGAWATT_OBSERVED,
  WET_MEGAWATT_PRESETS,
  WET_MEGAWATT_SOURCES,
} from '../../../lib/wet-megawatt-model.ts';

const payload = {
  id: 'wet-megawatt-counter',
  version: WET_MEGAWATT_MODEL_VERSION,
  asOf: WET_MEGAWATT_DATA_DATE,
  dataVintage: WET_MEGAWATT_DATA_VINTAGE,
  status: 'scenario-model',
  language: 'bilingual',
  observed: WET_MEGAWATT_OBSERVED,
  assumptions: WET_MEGAWATT_DEFAULTS,
  limits: WET_MEGAWATT_LIMITS,
  presetsPct: WET_MEGAWATT_PRESETS,
  formulas: WET_MEGAWATT_FORMULAS,
  sources: WET_MEGAWATT_SOURCES,
  scope: {
    includes: ['accounting perimeter', 'observed hydro and nuclear floor', 'assumed share of classic thermal capacity', 'share of total installed capacity'],
    excludes: ['unit-level cooling inventory', 'freshwater exposure', 'water stress', 'simultaneous outage probability', 'generation', 'energy lost', 'market prices'],
    warning: 'The thermal water-cooled share is a reader assumption, not an estimate. The result is a capacity classification exercise, not a risk forecast.',
  },
};

export const GET: APIRoute = () => new Response(JSON.stringify(payload, null, 2), {
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'public, max-age=3600',
    'x-content-type-options': 'nosniff',
  },
});
