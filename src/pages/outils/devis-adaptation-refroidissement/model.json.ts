import type { APIRoute } from 'astro';
import { COOLING_QUOTE_DATA_DATE, COOLING_QUOTE_DEFAULTS, COOLING_QUOTE_MODEL_VERSION, COOLING_QUOTE_PRESETS, COOLING_QUOTE_SOURCES, evaluateCoolingQuote } from '../../../lib/cooling-adaptation-model.ts';

const payload = {
  id: 'cooling-adaptation-quote', version: COOLING_QUOTE_MODEL_VERSION, asOf: COOLING_QUOTE_DATA_DATE,
  status: 'illustrative-scenario-model', language: 'bilingual', defaults: COOLING_QUOTE_DEFAULTS, presets: COOLING_QUOTE_PRESETS,
  formulas: {
    capitalRecoveryFactor: 'r * (1 + r)^n / ((1 + r)^n - 1), or 1 / n when r = 0',
    outageCost: 'siteCapacityMW * constructionOutageDays * 24 * replacementPricePerMWh',
    annualEquivalentCost: 'capitalRecoveryFactor * (CAPEX + outageCost) + annualOPEX + auxiliaryMWh * replacementPricePerMWh',
    costPerMWhPreserved: 'annualEquivalentCost / annualMWhPreserved',
    costPerKWSecured: 'CAPEX / (securedCapacityMW * 1000)',
    waterBalances: 'withdrawal and net consumption are compared separately in m3/MWh',
  },
  examples: Object.fromEntries(Object.entries(COOLING_QUOTE_PRESETS).map(([name, inputs]) => [name, evaluateCoolingQuote(inputs)])),
  sources: COOLING_QUOTE_SOURCES,
  limits: [
    'The fictional demo is not a plant estimate or investment recommendation.',
    'Public-cost presets intentionally leave undocumented denominators at zero.',
    'The model does not calculate safety, hydrology, ecology, permitting, grid flows or project-specific engineering.',
    'Withdrawal and consumption are never merged into a single water metric.',
  ],
};

export const GET: APIRoute = () => new Response(JSON.stringify(payload, null, 2), { headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'public, max-age=3600', 'x-content-type-options': 'nosniff' } });
