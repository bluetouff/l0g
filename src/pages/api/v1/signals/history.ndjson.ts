import type { APIRoute } from 'astro';
import { buildSignalHistoryNdjsonRows } from '../../../../lib/signal-history.ts';
import { ndjsonResponse } from '../../../../lib/agent-surface.ts';

export const GET: APIRoute = () => ndjsonResponse(buildSignalHistoryNdjsonRows());
