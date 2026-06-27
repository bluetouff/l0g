import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import {
  buildEvidenceGraphNdjsonRows,
  ndjsonResponse,
  sortPosts,
} from '../../../lib/agent-surface.ts';

export const GET: APIRoute = async () => {
  const posts = sortPosts(await getCollection('posts', ({ data }) => !data.draft));

  return ndjsonResponse(buildEvidenceGraphNdjsonRows(posts));
};
