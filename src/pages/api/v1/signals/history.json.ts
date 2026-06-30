import type { APIRoute } from 'astro';
import { buildSignalHistorySurface } from '../../../../lib/signal-history.ts';
import { jsonResponse } from '../../../../lib/agent-surface.ts';

export const GET: APIRoute = () => jsonResponse(buildSignalHistorySurface());
