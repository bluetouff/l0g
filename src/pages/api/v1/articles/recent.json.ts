import type { APIRoute } from 'astro';
import { loadAgentContent } from '../../../../lib/agent-content.ts';
import {
  buildRecentArticleFeed,
  jsonResponse,
} from '../../../../lib/agent-surface.ts';

export const GET: APIRoute = async () => {
  const { posts } = await loadAgentContent();
  return jsonResponse(buildRecentArticleFeed(posts));
};
