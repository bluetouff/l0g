import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);

async function text(path) {
  return readFile(new URL(path, root), 'utf8');
}

test('le Registry et le manifeste désignent compact comme porte d’entrée', async () => {
  const server = JSON.parse(await text('server.json'));
  const toolset = JSON.parse(await text('src/generated/toolset-manifest.json'));
  const agentSurface = await text('src/lib/agent-surface.ts');

  assert.equal(server.remotes?.[0]?.url, 'https://l0g.fr/api/mcp/compact');
  assert.equal(server.remotes?.[1]?.url, 'https://l0g.fr/api/mcp');
  assert.equal(toolset.primaryTool, 'get_risk_state');
  assert.equal(toolset.recommendedSurface, '/api/mcp/compact');
  assert.equal(toolset.researchSurface, '/api/mcp');
  assert.match(agentSurface, /mcpEndpoint: `\$\{AGENT_SITE\}\$\{MCP_COMPACT_PUBLIC_PATH\}`/);
  assert.match(agentSurface, /mcpFullEndpoint: `\$\{AGENT_SITE\}\$\{MCP_PUBLIC_PATH\}`/);
});

test('les pages de distribution placent get_risk_state avant le catalogue expert', async () => {
  const [agents, mcp, agentSurface, llms] = await Promise.all([
    text('src/pages/agents.astro'),
    text('src/pages/mcp.astro'),
    text('src/pages/donnees/agents.astro'),
    text('src/pages/llms.txt.ts'),
  ]);

  for (const source of [agents, mcp, agentSurface, llms]) {
    assert.match(source, /get_risk_state/);
    assert.match(source, /MCP_COMPACT_PUBLIC_PATH|api\/mcp\/compact/);
  }
  assert.match(agents, /"name":"get_risk_state"/);
  assert.match(mcp, /Produit agentique principal/);
  assert.match(agentSurface, /porte d’entrée normale|Porte d’entrée normale/);
});

test('les deux mesures publiques déclarent leur seuil et leurs exclusions', async () => {
  const [telemetry, human, apache] = await Promise.all([
    text('mcp-server/usage-telemetry.mjs'),
    text('scripts/human-traffic-report.mjs'),
    text('deploy/l0g.fr.apache.conf'),
  ]);

  assert.match(telemetry, /MCP_USAGE_MINIMUM_PUBLIC_COHORT = 5/);
  assert.match(telemetry, /isInternalL0gUserAgent/);
  assert.match(human, /HUMAN_TRAFFIC_MINIMUM_COHORT = 5/);
  assert.match(human, /CRAWLER_USER_AGENT/);
  assert.match(apache, /Alias \/api\/v1\/human-traffic\.json/);
});
