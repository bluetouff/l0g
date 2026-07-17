import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import {
  MCP_USAGE_SCHEMA_VERSION,
  aggregateMcpUsage,
  buildPublicMcpUsageReport,
  classifyMcpClient,
  classifyMcpResource,
  createMcpUsageStore,
  extractMcpUsageEvents,
} from './usage-telemetry.mjs';

function emptyState() {
  return { schemaVersion: MCP_USAGE_SCHEMA_VERSION, updatedAt: null, days: [] };
}

test('classe clientInfo dans une famille fermée sans conserver le nom libre', () => {
  assert.equal(classifyMcpClient({ name: 'Claude Code', version: '99.1' }), 'claude-code');
  assert.equal(classifyMcpClient({ name: 'ChatGPT Desktop' }), 'chatgpt');
  assert.equal(classifyMcpClient({ name: 'Codex CLI' }), 'codex');
  assert.equal(classifyMcpClient({ name: 'Client privé de Marie' }), 'other');
  assert.equal(classifyMcpClient(undefined), 'undeclared');
});

test('réduit les URI de ressources à une famille sans slug', () => {
  assert.equal(classifyMcpResource('l0g://articles/un-slug-confidentiel'), 'articles');
  assert.equal(classifyMcpResource('l0g://en/guides/oil-market'), 'guides-en');
  assert.equal(classifyMcpResource('l0g://freshness'), 'freshness');
  assert.equal(classifyMcpResource('https://example.test/private'), 'unknown');
});

test('extrait uniquement les dimensions MCP autorisées', () => {
  const events = extractMcpUsageEvents([
    { method: 'initialize', params: { clientInfo: { name: 'Claude Code', version: '1.2.3' } } },
    { method: 'tools/call', params: { name: 'search_content', arguments: { query: 'secret query' } } },
    { method: 'resources/read', params: { uri: 'l0g://articles/secret-slug' } },
    { method: 'prompts/get', params: { name: 'verify_claim', arguments: { claim: 'secret claim' } } },
  ]);
  assert.deepEqual(events, [
    { type: 'initialize', clientFamily: 'claude-code' },
    { type: 'tool_call', toolName: 'search_content' },
    { type: 'resource_read', resourceFamily: 'articles' },
    { type: 'prompt_get', promptName: 'verify_claim' },
  ]);
  assert.doesNotMatch(JSON.stringify(events), /secret|1\.2\.3/);
});

test('publie les volumes et masque les petites cohortes client', () => {
  const messages = [];
  for (let index = 0; index < 5; index += 1) {
    messages.push({ method: 'initialize', params: { clientInfo: { name: 'Claude Code' } } });
  }
  messages.push(
    { method: 'initialize', params: { clientInfo: { name: 'Client maison' } } },
    { method: 'tools/call', params: { name: 'get_freshness' } },
    { method: 'resources/read', params: { uri: 'l0g://freshness' } },
    { method: 'prompts/get', params: { name: 'verify_claim' } },
  );
  const state = aggregateMcpUsage(emptyState(), extractMcpUsageEvents(messages), new Date('2026-07-17T12:00:00Z'));
  const report = buildPublicMcpUsageReport(state);

  assert.deepEqual(report.totals, {
    initializations: 6,
    tool_calls: 1,
    resource_reads: 1,
    prompt_gets: 1,
    client_info_declared: 6,
    client_info_declaration_rate: 1,
  });
  assert.deepEqual(report.clients, [{ family: 'claude-code', count: 5 }]);
  assert.deepEqual(report.tools, [{ name: 'get_freshness', count: 1 }]);
  assert.deepEqual(report.resources, [{ family: 'freshness', count: 1 }]);
  assert.deepEqual(report.prompts, [{ name: 'verify_claim', count: 1 }]);
  assert.doesNotMatch(JSON.stringify(state), /Client maison/);
});

test('supprime les jours hors de la fenêtre de 91 jours', () => {
  const state = {
    schemaVersion: MCP_USAGE_SCHEMA_VERSION,
    updatedAt: '2026-01-01T00:00:00Z',
    days: [{
      day: '2026-01-01',
      initializations: 10,
      toolCalls: 0,
      resourceReads: 0,
      promptGets: 0,
      clients: [{ family: 'claude', count: 10 }],
      tools: [],
      resources: [],
      prompts: [],
    }],
  };
  const next = aggregateMcpUsage(
    state,
    [{ type: 'tool_call', toolName: 'get_freshness' }],
    new Date('2026-07-17T12:00:00Z'),
  );
  assert.deepEqual(next.days.map((day) => day.day), ['2026-07-17']);
});

test('persiste atomiquement un agrégat sans identifiant réseau', async () => {
  const root = await mkdtemp(join(tmpdir(), 'l0g-mcp-usage-'));
  const path = join(root, 'usage.json');
  try {
    const store = createMcpUsageStore({ path, now: () => Date.parse('2026-07-17T12:00:00Z') });
    store.recordRpc({
      method: 'initialize',
      params: { clientInfo: { name: 'Codex CLI', version: '9.9.9' } },
    });
    await store.flush();
    const report = await store.publicReport();
    const serialized = await readFile(path, 'utf8');

    assert.equal(report.enabled, true);
    assert.equal(report.totals.initializations, 1);
    assert.match(serialized, /"family":"codex"/);
    assert.doesNotMatch(serialized, /9\.9\.9|127\.0\.0\.1|remoteAddress|user-agent/i);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('regroupe plusieurs RPC avant une écriture explicite', async () => {
  const root = await mkdtemp(join(tmpdir(), 'l0g-mcp-usage-batch-'));
  const path = join(root, 'usage.json');
  try {
    const store = createMcpUsageStore({
      path,
      now: () => Date.parse('2026-07-17T12:00:00Z'),
      flushIntervalMs: 60_000,
    });
    store.recordRpc({ method: 'tools/call', params: { name: 'get_freshness' } });
    store.recordRpc({ method: 'tools/call', params: { name: 'get_integrity' } });
    await store.flush();

    const report = await store.publicReport();
    assert.equal(report.totals.tool_calls, 2);
    assert.deepEqual(report.tools, [
      { name: 'get_freshness', count: 1 },
      { name: 'get_integrity', count: 1 },
    ]);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
