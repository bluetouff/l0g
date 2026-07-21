import type { APIRoute } from 'astro';
import toolsetManifest from '../../../generated/toolset-manifest.json';
import { jsonResponse } from '../../../lib/agent-surface.ts';

export const GET: APIRoute = async () => jsonResponse(toolsetManifest);
