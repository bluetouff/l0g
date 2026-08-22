import type { APIRoute } from 'astro';
import {
  INVOICE_PLATFORM_COST_DATA_DATE,
  INVOICE_PLATFORM_COST_DEFAULTS,
  INVOICE_PLATFORM_COST_FORMULA,
  INVOICE_PLATFORM_COST_LIMITS_EN,
  INVOICE_PLATFORM_COST_LIMITS_FR,
  INVOICE_PLATFORM_COST_MODEL_VERSION,
  INVOICE_PLATFORM_COST_PROFILES,
  INVOICE_PLATFORM_PUBLIC_OFFERS,
  calculateInvoicePlatformCosts,
} from '../../../lib/invoice-platform-cost-model.ts';

export const prerender = true;

export const GET: APIRoute = () => new Response(JSON.stringify({
  id: 'invoice-platform-cost',
  version: INVOICE_PLATFORM_COST_MODEL_VERSION,
  dataDate: INVOICE_PLATFORM_COST_DATA_DATE,
  defaultInputs: INVOICE_PLATFORM_COST_DEFAULTS,
  profiles: INVOICE_PLATFORM_COST_PROFILES,
  publicOffers: INVOICE_PLATFORM_PUBLIC_OFFERS,
  formula: INVOICE_PLATFORM_COST_FORMULA,
  limits: {
    fr: INVOICE_PLATFORM_COST_LIMITS_FR,
    en: INVOICE_PLATFORM_COST_LIMITS_EN,
  },
  defaultResults: calculateInvoicePlatformCosts(INVOICE_PLATFORM_COST_DEFAULTS),
}, null, 2), {
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'public, max-age=3600, s-maxage=86400',
  },
});
