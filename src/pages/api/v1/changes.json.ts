import type { APIRoute } from 'astro';
import { loadAgentContent } from '../../../lib/agent-content.ts';
import { buildChangefeedSurface, jsonResponse } from '../../../lib/agent-surface.ts';

export const GET: APIRoute = async () => {
  const { posts, guides } = await loadAgentContent();

  return jsonResponse(buildChangefeedSurface(posts, guides));
};
