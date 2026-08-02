import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import {
  MCP_USAGE_SCHEMA_VERSION,
  aggregateMcpUsage,
  buildPrivateClientTaxonomyDiagnostics,
  buildPublicMcpUsageReport,
  classifyMcpClient,
  classifyMcpResource,
  createMcpUsageStore,
  extractMcpUsageEvents,
  isInternalL0gUserAgent,
} from './usage-telemetry.mjs';

function emptyState() {
  return { schemaVersion: MCP_USAGE_SCHEMA_VERSION, updatedAt: null, days: [] };
}

function observation({
  surface = 'compact',
  body,
  outcome = 'success',
  durationMs = 42,
  responseBytes = 2_048,
} = {}) {
  return { surface, body, outcome, durationMs, responseBytes };
}

test('ramène clientInfo à huit familles stables', () => {
  assert.equal(classifyMcpClient({ name: 'Claude Code', version: '99.1' }), 'anthropic');
  assert.equal(classifyMcpClient({ name: 'ChatGPT Desktop' }), 'openai');
  assert.equal(classifyMcpClient({ name: 'Codex CLI' }), 'openai');
  assert.equal(classifyMcpClient({ name: 'Gemini CLI' }), 'google');
  assert.equal(classifyMcpClient({ name: 'Visual Studio Code' }), 'ide');
  assert.equal(classifyMcpClient({ name: 'mcp-remote' }), 'mcp-gateway');
  assert.equal(classifyMcpClient({ name: 'curl' }), 'generic-http');
  assert.equal(classifyMcpClient({ name: 'Client privé de Marie' }), 'other');
  assert.equal(classifyMcpClient(undefined), 'undeclared');
});

test('exclut explicitement les user-agents internes l0g', () => {
  assert.equal(isInternalL0gUserAgent('l0g-mcp-release-verifier/1'), true);
  assert.equal(isInternalL0gUserAgent('l0g.fr health probe/2'), true);
  assert.equal(isInternalL0gUserAgent('Mozilla/5.0'), false);
  assert.equal(isInternalL0gUserAgent('client-for-l0g'), false);
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
    { method: 'initialize', params: { clientInfo: { name: 'Acme bridge 1.2.3' } } },
    { method: 'tools/list', params: {} },
    { method: 'tools/call', params: { name: 'get_risk_state', arguments: { query: 'secret query' } } },
    { method: 'resources/read', params: { uri: 'l0g://articles/secret-slug' } },
    { method: 'prompts/get', params: { name: 'verify_claim', arguments: { claim: 'secret claim' } } },
  ]);
  assert.deepEqual(events, [
    { type: 'initialize', clientFamily: 'anthropic', otherCandidate: null },
    { type: 'initialize', clientFamily: 'other', otherCandidate: 'acme bridge v' },
    { type: 'tools_list' },
    { type: 'tool_call', toolName: 'get_risk_state' },
    { type: 'resource_read', resourceFamily: 'articles' },
    { type: 'prompt_get', promptName: 'verify_claim' },
  ]);
  assert.doesNotMatch(JSON.stringify(events), /secret|1\.2\.3/);
});

test('publie les séries endpoint, résultats, quantiles et le KPI get_risk_state', () => {
  const observations = [];
  for (let index = 0; index < 5; index += 1) {
    observations.push(observation({
      body: { method: 'initialize', params: { clientInfo: { name: 'Claude Code' } } },
      durationMs: 10 + index,
      responseBytes: 1_000,
    }));
    observations.push(observation({
      body: { method: 'tools/list', params: {} },
      durationMs: 20 + index,
      responseBytes: 2_000,
    }));
    observations.push(observation({
      body: { method: 'tools/call', params: { name: 'get_risk_state' } },
      outcome: index === 4 ? 'error' : 'success',
      durationMs: [18, 24, 40, 90, 300][index],
      responseBytes: [800, 900, 1_100, 1_500, 3_000][index],
    }));
  }
  observations.push(observation({
    surface: 'full',
    body: { method: 'tools/call', params: { name: 'search_content' } },
    durationMs: 700,
    responseBytes: 20_000,
  }));
  const state = aggregateMcpUsage(emptyState(), observations, new Date('2026-07-30T12:00:00Z'));
  const report = buildPublicMcpUsageReport(state);

  assert.equal(report.totals.requests, 16);
  assert.equal(report.totals.initializations, 5);
  assert.equal(report.totals.tools_list, 5);
  assert.equal(report.totals.tool_calls, 6);
  assert.equal(report.product_kpi.name, 'get_risk_state');
  assert.equal(report.product_kpi.count, 5);
  assert.equal(report.product_kpi.share_of_tool_calls, 0.833333);
  assert.equal(report.product_kpi.success_rate, 0.8);
  assert.deepEqual(report.product_kpi.latency_ms, { p50: 50, p95: 500 });
  assert.deepEqual(report.product_kpi.recurring_usage, {
    metric: 'repeat_active_days',
    active_days: 1,
    repeat_active_days: 0,
    first_active_day: '2026-07-30',
    last_active_day: '2026-07-30',
    returning_clients: null,
    interpretation: 'Jours avec au moins un appel get_risk_state, puis jours actifs après le premier jour observé. Ce signal mesure la récurrence du produit, pas des clients uniques.',
  });
  assert.equal(report.endpoints.find((row) => row.endpoint === '/api/mcp/compact')?.requests, 15);
  assert.equal(report.endpoints.some((row) => row.endpoint === '/api/mcp'), false);
  assert.deepEqual(report.clients, [{ family: 'anthropic', count: 5 }]);
  assert.equal(report.daily.length, 1);
});

test('mesure les jours de retour de get_risk_state sans inventer de clients uniques', () => {
  let state = aggregateMcpUsage(
    emptyState(),
    observation({ body: { method: 'tools/call', params: { name: 'get_risk_state' } } }),
    new Date('2026-07-28T12:00:00Z'),
  );
  state = aggregateMcpUsage(
    state,
    observation({ body: { method: 'tools/call', params: { name: 'get_risk_state' } } }),
    new Date('2026-07-30T12:00:00Z'),
  );
  const report = buildPublicMcpUsageReport(state);

  assert.equal(report.product_kpi.recurring_usage.active_days, 2);
  assert.equal(report.product_kpi.recurring_usage.repeat_active_days, 1);
  assert.equal(report.product_kpi.recurring_usage.first_active_day, '2026-07-28');
  assert.equal(report.product_kpi.recurring_usage.last_active_day, '2026-07-30');
  assert.equal(report.product_kpi.recurring_usage.returning_clients, null);
  assert.match(report.limitations.join(' '), /identifiant persistant/);
});

test('garde les libellés other privés sept jours et applique k supérieur ou égal à cinq', () => {
  const observations = [];
  for (let index = 0; index < 5; index += 1) {
    observations.push(observation({
      body: { method: 'initialize', params: { clientInfo: { name: 'Acme Private Bridge 7.8.9' } } },
    }));
  }
  observations.push(observation({
    body: { method: 'initialize', params: { clientInfo: { name: 'One-off Client' } } },
  }));
  const state = aggregateMcpUsage(emptyState(), observations, new Date('2026-07-30T12:00:00Z'));
  const publicReport = buildPublicMcpUsageReport(state);
  const privateReport = buildPrivateClientTaxonomyDiagnostics(state);

  assert.doesNotMatch(JSON.stringify(publicReport), /acme|one-off/i);
  assert.deepEqual(privateReport.candidates, [{ name: 'acme private bridge v', count: 5 }]);
  assert.match(JSON.stringify(state), /acme private bridge v/);
  assert.doesNotMatch(JSON.stringify(state), /7\.8\.9|One-off Client/);
});

test('migre le schéma historique sans inventer endpoint, résultat ou latence', () => {
  const legacy = {
    schemaVersion: '1.0.0',
    updatedAt: '2026-07-29T12:00:00Z',
    days: [{
      day: '2026-07-29',
      initializations: 10,
      toolCalls: 8,
      resourceReads: 2,
      promptGets: 1,
      clients: [{ family: 'codex', count: 10 }],
      tools: [{ name: 'get_risk_state', count: 8 }],
      resources: [{ family: 'freshness', count: 2 }],
      prompts: [{ name: 'verify_claim', count: 1 }],
    }],
  };
  const report = buildPublicMcpUsageReport(legacy);

  assert.equal(report.schema_version, MCP_USAGE_SCHEMA_VERSION);
  assert.equal(report.product_kpi.count, 8);
  assert.equal(report.product_kpi.outcome_unavailable, 8);
  assert.equal(report.product_kpi.latency_ms.p50, null);
  assert.deepEqual(report.endpoints, [{
    endpoint: 'historique non attribué',
    coverage: 'legacy_events_only',
    requests: 0,
    successes: 0,
    errors: 0,
    success_rate: null,
    events: {
      initializations: 10,
      tools_list: 0,
      tool_calls: 8,
      resource_reads: 2,
      prompt_gets: 1,
    },
    primary_tool: {
      name: 'get_risk_state',
      calls: 8,
      successes: 0,
      errors: 0,
      success_rate: null,
      latency_ms: { p50: null, p95: null },
      response_bytes: { average: null, p50: null, p95: null },
    },
    latency_ms: { p50: null, p95: null },
    response_bytes: { average: null, p50: null, p95: null },
  }]);
  assert.deepEqual(report.clients, [{ family: 'openai', count: 10 }]);
});

test('supprime les jours hors de la fenêtre de 91 jours', () => {
  let state = aggregateMcpUsage(
    emptyState(),
    observation({ body: { method: 'initialize', params: { clientInfo: { name: 'Claude' } } } }),
    new Date('2026-01-01T12:00:00Z'),
  );
  state = aggregateMcpUsage(
    state,
    observation({ body: { method: 'tools/call', params: { name: 'get_risk_state' } } }),
    new Date('2026-07-30T12:00:00Z'),
  );
  assert.deepEqual(state.days.map((day) => day.day), ['2026-07-30']);
});

test('persiste atomiquement sans identifiant réseau ni user-agent et ignore les sondes l0g', async () => {
  const root = await mkdtemp(join(tmpdir(), 'l0g-mcp-usage-'));
  const path = join(root, 'usage.json');
  try {
    const store = createMcpUsageStore({ path, now: () => Date.parse('2026-07-30T12:00:00Z') });
    store.recordRequest({
      ...observation({ body: { method: 'initialize', params: { clientInfo: { name: 'Codex CLI', version: '9.9.9' } } } }),
      userAgent: 'Mozilla/5.0',
    });
    store.recordRequest({
      ...observation({ body: { method: 'tools/call', params: { name: 'get_risk_state' } } }),
      userAgent: 'l0g-mcp-release-verifier/1',
    });
    await store.flush();
    const report = await store.publicReport();
    const serialized = await readFile(path, 'utf8');

    assert.equal(report.enabled, true);
    assert.equal(report.totals.requests, 1);
    assert.equal(report.totals.initializations, 1);
    assert.match(serialized, /"family":"openai"/);
    assert.doesNotMatch(serialized, /9\.9\.9|127\.0\.0\.1|remoteAddress|user-agent|Mozilla/i);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('charge et migre atomiquement un fichier v1 existant', async () => {
  const root = await mkdtemp(join(tmpdir(), 'l0g-mcp-usage-migration-'));
  const path = join(root, 'usage.json');
  try {
    await writeFile(path, `${JSON.stringify({
      schemaVersion: '1.0.0',
      updatedAt: '2026-07-29T12:00:00Z',
      days: [{
        day: '2026-07-29',
        initializations: 5,
        toolCalls: 5,
        resourceReads: 0,
        promptGets: 0,
        clients: [{ family: 'claude-code', count: 5 }],
        tools: [{ name: 'get_risk_state', count: 5 }],
        resources: [],
        prompts: [],
      }],
    })}\n`);
    const store = createMcpUsageStore({ path, now: () => Date.parse('2026-07-30T12:00:00Z') });
    store.recordRequest(observation({ body: { method: 'tools/list', params: {} } }));
    await store.flush();

    const serialized = JSON.parse(await readFile(path, 'utf8'));
    const report = await store.publicReport();
    assert.equal(serialized.schemaVersion, MCP_USAGE_SCHEMA_VERSION);
    assert.equal(report.totals.tool_calls, 5);
    assert.equal(report.totals.tools_list, 1);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('regroupe plusieurs requêtes avant une écriture explicite', async () => {
  const root = await mkdtemp(join(tmpdir(), 'l0g-mcp-usage-batch-'));
  const path = join(root, 'usage.json');
  try {
    const store = createMcpUsageStore({
      path,
      now: () => Date.parse('2026-07-30T12:00:00Z'),
      flushIntervalMs: 60_000,
    });
    store.recordRequest(observation({ body: { method: 'tools/call', params: { name: 'get_risk_state' } } }));
    store.recordRequest(observation({ body: { method: 'tools/call', params: { name: 'get_freshness' } } }));
    await store.flush();

    const report = await store.publicReport();
    assert.equal(report.totals.tool_calls, 2);
    assert.deepEqual(report.tools.map(({ name, count }) => ({ name, count })), [
      { name: 'get_freshness', count: 1 },
      { name: 'get_risk_state', count: 1 },
    ]);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
