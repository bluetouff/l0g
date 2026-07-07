import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { jsonResponse, sortGuides, sortPosts } from '../../../lib/agent-surface.ts';
import { buildRiskDiffSurface } from '../../../lib/risk-diff.ts';

function readRiskSnapshot() {
  try {
    return JSON.parse(readFileSync(join(process.cwd(), 'public/risk.json'), 'utf-8'));
  } catch {
    return null;
  }
}

export const GET: APIRoute = async () => {
  const posts = sortPosts(await getCollection('posts', ({ data }) => !data.draft));
  const guides = sortGuides(await getCollection('guides', ({ data }) => !data.draft));
  return jsonResponse(buildRiskDiffSurface(posts, guides, readRiskSnapshot()));
};
