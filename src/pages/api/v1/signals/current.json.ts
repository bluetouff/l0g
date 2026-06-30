import type { APIRoute } from 'astro';
import { buildSignalHistorySurface } from '../../../../lib/signal-history.ts';
import { jsonResponse } from '../../../../lib/agent-surface.ts';

export const GET: APIRoute = () => {
  const history = buildSignalHistorySurface();
  return jsonResponse({
    schema: 'https://l0g.fr/api/v1/signals/schema.json',
    version: history.version,
    generated: history.generated,
    coverage: history.coverage,
    current: history.current,
    policy: history.policy,
  });
};
