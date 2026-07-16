import type { APIRoute } from 'astro';
import { AGENT_VERSION } from '../../../lib/agent-surface';

export const prerender = true;

export const GET: APIRoute = () => new Response(JSON.stringify({
  schema: 'https://l0g.fr/schemas/agent-bench-1.json',
  version: '1.0.0',
  generated: new Date().toISOString(),
  status: 'pending-ci',
  surfaces: { agentSurfaceVersion: AGENT_VERSION, mcpServerVersion: '1.19.0', gitSha: null },
  methodology: { deterministic: true, llmCalls: 0, topK: 3, cases: 44 },
  summary: null,
  results: [],
  note: 'Le workflow de publication remplace ce document par le résultat du benchmark exécuté contre le serveur MCP construit.',
}, null, 2), {
  headers: { 'content-type': 'application/json; charset=utf-8', 'access-control-allow-origin': '*' },
});
