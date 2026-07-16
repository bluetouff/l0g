import type { APIRoute } from 'astro';
import { loadAgentContent } from '../../../lib/agent-content.ts';
import { buildSourcesSurface, jsonResponse } from '../../../lib/agent-surface.ts';

export const GET: APIRoute = async () => {
  const { posts } = await loadAgentContent();
  return jsonResponse(buildSourcesSurface(posts));
};
