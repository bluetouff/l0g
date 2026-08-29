import type { APIRoute } from 'astro';
import {
  EUDI_RECEIPT_FIELDS,
  EUDI_REQUEST_AUDIT_DATA_DATE,
  EUDI_REQUEST_AUDIT_MODEL_VERSION,
  EUDI_REQUEST_AUDIT_PRESETS,
  EUDI_REQUEST_AUDIT_SOURCES,
} from '../../../lib/eudi-request-audit-model.ts';

export const prerender = true;

export const GET: APIRoute = () => new Response(JSON.stringify({
  id: 'eudi-request-audit',
  version: EUDI_REQUEST_AUDIT_MODEL_VERSION,
  dataDate: EUDI_REQUEST_AUDIT_DATA_DATE,
  purpose: 'Compare category labels declared in a relying-party certificate with category labels requested by a transaction, then audit the minimum transaction-log fields.',
  comparison: {
    method: 'Unicode normalisation, case folding, punctuation removal and exact category-label matching.',
    decisionRule: 'Fail closed: a failed identity check or an undeclared category returns blocked; unknown evidence returns warning. This is a precautionary tool rule, not a universal wallet policy.',
    limits: 'The model does not resolve synonyms and does not determine legal basis, necessity, service identity or compliance.',
    maximumCategoriesPerList: 30,
    maximumCategoryLength: 80,
  },
  presets: EUDI_REQUEST_AUDIT_PRESETS,
  receiptFields: EUDI_RECEIPT_FIELDS,
  sources: EUDI_REQUEST_AUDIT_SOURCES,
}, null, 2), {
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'public, max-age=3600, s-maxage=86400',
  },
});
