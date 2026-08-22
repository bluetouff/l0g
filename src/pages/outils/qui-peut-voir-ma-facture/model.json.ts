import type { APIRoute } from 'astro';
import {
  INVOICE_ACCESS_DATA_DATE,
  INVOICE_ACCESS_DEFAULTS,
  INVOICE_ACCESS_MODEL_VERSION,
  INVOICE_ACCESS_NODES,
  INVOICE_ACCESS_SOURCES,
  activeInvoiceAccessNodes,
} from '../../../lib/invoice-access-map-model.ts';

export const prerender = true;

export const GET: APIRoute = () => new Response(JSON.stringify({
  id: 'invoice-data-access',
  version: INVOICE_ACCESS_MODEL_VERSION,
  dataDate: INVOICE_ACCESS_DATA_DATE,
  defaultInputs: INVOICE_ACCESS_DEFAULTS,
  nodes: INVOICE_ACCESS_NODES,
  sources: INVOICE_ACCESS_SOURCES,
  defaultView: activeInvoiceAccessNodes(INVOICE_ACCESS_DEFAULTS),
}, null, 2), {
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'public, max-age=3600, s-maxage=86400',
  },
});
