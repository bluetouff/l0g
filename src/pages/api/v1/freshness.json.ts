import type { APIRoute } from 'astro';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadAgentContent } from '../../../lib/agent-content.ts';
import { buildFreshnessSurface, jsonResponse } from '../../../lib/agent-surface.ts';

function readRiskSnapshot() {
  try {
    return JSON.parse(readFileSync(join(process.cwd(), 'public/risk.json'), 'utf-8'));
  } catch {
    return null;
  }
}

export const GET: APIRoute = async () => {
  const { posts, guides } = await loadAgentContent();
  return jsonResponse(buildFreshnessSurface(posts, guides, readRiskSnapshot()));
};
