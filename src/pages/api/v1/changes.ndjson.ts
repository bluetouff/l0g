import type { APIRoute } from 'astro';
import { loadAgentContent } from '../../../lib/agent-content.ts';
import { buildChangesNdjsonRows, ndjsonResponse } from '../../../lib/agent-surface.ts';

export const GET: APIRoute = async () => {
  const { posts, guides } = await loadAgentContent();

  return ndjsonResponse(buildChangesNdjsonRows(posts, guides));
};
