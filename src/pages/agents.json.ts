import type { APIRoute } from 'astro';
import { loadAgentContent } from '../lib/agent-content.ts';
import { buildAgentManifest, jsonResponse } from '../lib/agent-surface.ts';

export const GET: APIRoute = async () => {
  const { posts, guides } = await loadAgentContent();
  return jsonResponse(buildAgentManifest(posts, guides));
};
