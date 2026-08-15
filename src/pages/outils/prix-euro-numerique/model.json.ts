import type { APIRoute } from 'astro';
import {
  DIGITAL_EURO_CARD_BASE,
  DIGITAL_EURO_COST_DATA_DATE,
  DIGITAL_EURO_COST_DEFAULTS,
  DIGITAL_EURO_COST_FORMULAS,
  DIGITAL_EURO_COST_LIMITS,
  DIGITAL_EURO_COST_MODEL_VERSION,
  DIGITAL_EURO_COST_SOURCES,
} from '../../../lib/digital-euro-cost-model.ts';

const payload = {
  id: 'digital-euro-cost',
  version: DIGITAL_EURO_COST_MODEL_VERSION,
  asOf: DIGITAL_EURO_COST_DATA_DATE,
  status: 'scenario-model',
  language: 'en',
  observedBase: DIGITAL_EURO_CARD_BASE,
  defaults: DIGITAL_EURO_COST_DEFAULTS,
  limits: DIGITAL_EURO_COST_LIMITS,
  units: {
    adoption: 'percent',
    cardFee: 'percent of migrated value',
    digitalFee: 'percent of online migrated value',
    interPsp: 'percent of online value when mode=rate; EUR per online transaction when mode=fixed',
    offline: 'percent of migrated value and count',
    development: 'EUR',
    annualOpex: 'EUR per year',
    amortisation: 'years',
  },
  formulas: DIGITAL_EURO_COST_FORMULAS,
  sources: DIGITAL_EURO_COST_SOURCES,
  scope: {
    includes: ['euro-area card payments sent in 2025', 'merchant fee counterfactual', 'private fee allocation', 'Eurosystem development and annual OPEX sensitivity'],
    excludes: ['adoption forecast', 'total social cost', 'bank and merchant implementation costs', 'fraud and support', 'tax and discounting', 'P2P use', 'resilience value'],
    publicCostConvention: 'All public cost is allocated to migrated merchant transactions, including offline transactions in the denominator.',
  },
};

export const GET: APIRoute = () => new Response(JSON.stringify(payload, null, 2), {
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'public, max-age=3600',
    'x-content-type-options': 'nosniff',
  },
});
