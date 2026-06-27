import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import {
  buildEvidenceGraphSurface,
  jsonResponse,
  sortPosts,
} from '../../../lib/agent-surface.ts';

export const GET: APIRoute = async () => {
  const posts = sortPosts(await getCollection('posts', ({ data }) => !data.draft));

  return jsonResponse(buildEvidenceGraphSurface(posts));
};
