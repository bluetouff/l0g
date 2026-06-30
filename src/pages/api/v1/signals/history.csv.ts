import type { APIRoute } from 'astro';
import { buildSignalHistoryCsv } from '../../../../lib/signal-history.ts';

export const GET: APIRoute = () =>
  new Response(buildSignalHistoryCsv(), {
    headers: { 'Content-Type': 'text/csv; charset=utf-8' },
  });
