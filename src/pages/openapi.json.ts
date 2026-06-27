import type { APIRoute } from 'astro';
import { buildOpenApiContract, jsonResponse } from '../lib/agent-surface.ts';

export const GET: APIRoute = async () => jsonResponse(buildOpenApiContract());
