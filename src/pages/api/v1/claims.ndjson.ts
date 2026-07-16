import type { APIRoute } from 'astro';
import { loadAgentContent } from '../../../lib/agent-content.ts';
import { buildClaimsNdjsonRows, ndjsonResponse } from '../../../lib/agent-surface.ts';

export const GET: APIRoute = async () => {
  const { posts } = await loadAgentContent();

  return ndjsonResponse(buildClaimsNdjsonRows(posts));
};
