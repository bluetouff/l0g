import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { buildAgentManifest, jsonResponse, sortGuides, sortPosts } from '../lib/agent-surface.ts';

export const GET: APIRoute = async () => {
  const posts = sortPosts(await getCollection('posts', ({ data }) => !data.draft));
  const guides = sortGuides(await getCollection('guides', ({ data }) => !data.draft));
  return jsonResponse(buildAgentManifest(posts, guides));
};
