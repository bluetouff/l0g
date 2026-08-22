import type { APIRoute } from 'astro';
import {
  INVOICE_INCIDENT_DATA_DATE,
  INVOICE_INCIDENT_MODEL_VERSION,
  INVOICE_INCIDENT_SOURCES,
  INVOICE_INCIDENT_STEPS,
} from '../../../lib/invoice-incident-log-model.ts';

export const prerender = true;

export const GET: APIRoute = () => new Response(JSON.stringify({
  id: 'invoice-incident-log',
  version: INVOICE_INCIDENT_MODEL_VERSION,
  dataDate: INVOICE_INCIDENT_DATA_DATE,
  privacy: { upload: false, persistence: false, tracking: false },
  steps: INVOICE_INCIDENT_STEPS,
  sources: INVOICE_INCIDENT_SOURCES,
}, null, 2), {
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'public, max-age=3600, s-maxage=86400',
  },
});
