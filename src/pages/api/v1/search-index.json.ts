import type { APIRoute } from 'astro';
import { loadAgentContent } from '../../../lib/agent-content.ts';
import { buildSearchIndexSurface, jsonResponse } from '../../../lib/agent-surface.ts';

export const GET: APIRoute = async () => {
  const { posts, guides } = await loadAgentContent();
  return jsonResponse(buildSearchIndexSurface(posts, guides));
};
