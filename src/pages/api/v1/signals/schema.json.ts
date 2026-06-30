import type { APIRoute } from 'astro';
import { buildSignalSchemaSurface } from '../../../../lib/signal-history.ts';
import { jsonResponse } from '../../../../lib/agent-surface.ts';

export const GET: APIRoute = () => jsonResponse(buildSignalSchemaSurface());
