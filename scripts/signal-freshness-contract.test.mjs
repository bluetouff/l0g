import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { SignalFreshnessSchema } from '../mcp-server/schemas/signal-freshness.mjs';
import {
  SIGNAL_FRESHNESS_COVERAGE_OPENAPI_SCHEMA,
  SIGNAL_FRESHNESS_OPENAPI_SCHEMA,
} from '../src/config/signal-freshness-contract.mjs';

test('Agent Surface et MCP exigent exactement les mêmes champs de fraîcheur', () => {
  const openApiSchema = SIGNAL_FRESHNESS_OPENAPI_SCHEMA;
  const openApiFields = Object.keys(openApiSchema.properties).sort();
  const openApiRequired = [...openApiSchema.required].sort();
  const mcpFields = Object.keys(SignalFreshnessSchema.shape).sort();

  assert.equal(openApiSchema.additionalProperties, false);
  assert.deepEqual(mcpFields, openApiFields);
  assert.deepEqual(mcpFields, openApiRequired);
});

test('Agent Surface et MCP exigent la même couverture de fraîcheur', () => {
  const openApiFields = Object.keys(SIGNAL_FRESHNESS_COVERAGE_OPENAPI_SCHEMA.properties).sort();
  const openApiRequired = [...SIGNAL_FRESHNESS_COVERAGE_OPENAPI_SCHEMA.required].sort();
  const mcpFields = Object.keys(SignalFreshnessSchema.shape.coverage.shape).sort();

  assert.deepEqual(mcpFields, openApiFields);
  assert.deepEqual(mcpFields, openApiRequired);
});

test('le champ de contrôle producteur reste obligatoire de bout en bout', () => {
  const valid = {
    key: 'us',
    label: 'US Macro',
    source: 'https://us.l0g.fr/snapshot.json',
    methodology: 'https://us.l0g.fr/methodologie/',
    observedAt: '2026-08-03T08:00:00Z',
    sourcePublishedAt: '2026-08-02T16:15:24Z',
    sourceCheckedAt: '2026-08-03T08:03:22Z',
    retrievedAt: '2026-08-03T08:04:00Z',
    lastAttemptAt: '2026-08-03T08:04:00Z',
    lastSuccessAt: '2026-08-03T08:04:00Z',
    computedAt: '2026-08-03T08:04:01Z',
    staleAfter: 'PT12H',
    expiresAt: '2026-08-03T20:03:22Z',
    timelinessStatus: 'fresh',
    sourceStatus: 'ok',
    qualityStatus: 'nominal',
    fallbackUsed: false,
    fallbackReason: null,
    warnings: [],
    coverageStatus: 'complete',
    coverage: {
      signalPresent: true,
      observedAt: true,
      sourcePublishedAt: true,
      retrievedAt: true,
      lastAttemptAt: true,
      lastSuccessAt: true,
      computedAt: true,
      staleAfter: true,
    },
    missing: [],
    note: 'Contrôle producteur plus récent que la publication inchangée.',
  };

  assert.equal(SignalFreshnessSchema.safeParse(valid).success, true);
  const { sourceCheckedAt: _omitted, ...withoutSourceCheck } = valid;
  assert.equal(SignalFreshnessSchema.safeParse(withoutSourceCheck).success, false);
});

test('la release MCP embarque et atteste le contrat partagé', async () => {
  const [builder, verifier, workflow] = await Promise.all([
    readFile(new URL('build-mcp-release.mjs', import.meta.url), 'utf8'),
    readFile(new URL('../mcp-server/deploy/verify-release.mjs', import.meta.url), 'utf8'),
    readFile(new URL('../.github/workflows/publish-mcp.yml', import.meta.url), 'utf8'),
  ]);

  for (const path of [
    'mcp-server/schemas/signal-freshness.mjs',
    'src/config/signal-freshness-contract.mjs',
  ]) {
    assert.ok(builder.includes(`'${path}'`), `empaqueteur incomplet: ${path}`);
    assert.ok(verifier.includes(`'${path}'`), `vérificateur incomplet: ${path}`);
    assert.ok(workflow.includes(path), `workflow de release incomplet: ${path}`);
  }
});
