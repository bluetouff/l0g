import type { APIRoute } from 'astro';
import { buildSignalHistoryCsv } from '../../../../lib/signal-history.ts';
import { textResponse } from '../../../../lib/agent-surface.ts';

export const GET: APIRoute = () =>
  textResponse(buildSignalHistoryCsv(), 'text/csv; charset=utf-8');
