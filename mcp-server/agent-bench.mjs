#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const valueAfter = (flag, fallback) => {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : fallback;
};
const url = valueAfter('--url', process.env.URL || 'http://127.0.0.1:8848/mcp');
const output = path.resolve(HERE, valueAfter('--output', '../dist/api/v1/agent-bench.json'));
const fixturePath = path.join(HERE, 'agent-bench-cases.json');
const fixtureRaw = await fs.readFile(fixturePath, 'utf8');
const fixture = JSON.parse(fixtureRaw);

if (!Array.isArray(fixture.cases) || fixture.cases.length < 30 || fixture.cases.length > 50) {
  throw new Error('Le benchmark doit contenir entre 30 et 50 cas.');
}
if (new Set(fixture.cases.map((item) => item.id)).size !== fixture.cases.length) {
  throw new Error('Les identifiants du benchmark doivent être uniques.');
}

const transport = new StreamableHTTPClientTransport(new URL(url), {
  requestInit: { headers: { Accept: 'application/json, text/event-stream' } },
});
const client = new Client({ name: 'l0g-agent-bench', version: fixture.version });
await client.connect(transport);

async function call(name, input = {}) {
  const result = await client.callTool({ name, arguments: input });
  if (result.isError) throw new Error(result.content?.[0]?.text || `${name} a échoué`);
  if (result.structuredContent) return result.structuredContent;
  return JSON.parse(result.content?.find((item) => item.type === 'text')?.text || '{}');
}

function topCanonicalIds(result) {
  return (result.results || []).slice(0, 3).map((item) => item.canonicalId).filter(Boolean);
}

async function evaluate(test) {
  if (test.category === 'retrieval') {
    const result = await call('search_content', { query: test.query, language: test.language, limit: 3 });
    const observed = topCanonicalIds(result);
    return { pass: observed.includes(test.expectedCanonicalId), observed };
  }
  if (test.category === 'parity') {
    const [fr, en] = await Promise.all([
      call('search_content', { query: test.queryFr, language: 'fr', limit: 3 }),
      call('search_content', { query: test.queryEn, language: 'en', limit: 3 }),
    ]);
    const observed = { fr: topCanonicalIds(fr), en: topCanonicalIds(en) };
    return { pass: observed.fr.includes(test.expectedCanonicalId) && observed.en.includes(test.expectedCanonicalId), observed };
  }
  if (test.category === 'primary-source') {
    const pack = await call('build_research_pack', { query: test.query, language: test.language, limit: 5 });
    const observed = (pack.primarySources || []).map((item) => item.slug);
    return { pass: observed.includes(test.expectedSource), observed };
  }
  if (test.category === 'as-of') {
    if (test.expectedError) {
      try {
        await call(test.tool, { date: test.asOf });
        return { pass: false, observed: 'accepted-invalid-date' };
      } catch {
        return { pass: true, observed: 'rejected-invalid-date' };
      }
    }
    const result = test.tool === 'get_black_box'
      ? await call('get_black_box', { date: test.asOf })
      : await call('build_research_pack', { query: test.query, language: test.language, asOf: test.asOf, limit: 3 });
    const observed = test.tool === 'get_black_box' ? Boolean(result.replayable) : Boolean(result.asOf?.replayable);
    return { pass: observed === test.expectedFound, observed };
  }
  if (test.category === 'refusal') {
    const pack = await call('build_research_pack', { query: test.query, language: test.language, limit: 3 });
    const observed = { documents: pack.documents?.length || 0, claims: pack.claims?.length || 0 };
    return { pass: observed.documents === 0 && observed.claims === 0, observed };
  }
  if (test.category === 'freshness') {
    const result = test.tool === 'get_freshness'
      ? await call('get_freshness', { limit: 3 })
      : await call('build_research_pack', { query: test.query, language: test.language, limit: 3 });
    const freshness = test.tool === 'get_freshness' ? result : result.freshness;
    const observed = {
      generated: Boolean(freshness?.generated),
      corpus: Boolean(freshness?.corpus),
      signals: Array.isArray(freshness?.signalFreshness) && freshness.signalFreshness.length > 0,
    };
    return { pass: Object.values(observed).every(Boolean), observed };
  }
  if (test.category === 'classification') {
    const result = await call('get_claims', { kind: test.kind, limit: 20 });
    const observed = { count: result.count || 0, kinds: [...new Set((result.claims || []).map((claim) => claim.kind))] };
    const correctKinds = observed.kinds.every((kind) => kind === test.kind);
    return { pass: correctKinds && (test.expectedNonEmpty ? observed.count > 0 : observed.count === 0), observed };
  }
  throw new Error(`Catégorie inconnue: ${test.category}`);
}

const results = [];
for (const test of fixture.cases) {
  try {
    const evaluation = await evaluate(test);
    results.push({ id: test.id, category: test.category, pass: evaluation.pass, observed: evaluation.observed });
  } catch (error) {
    results.push({ id: test.id, category: test.category, pass: false, observed: { error: String(error.message || error) } });
  }
}

const manifest = await call('get_agent_manifest');
const serverVersion = client.getServerVersion?.() || {};
const categories = Object.fromEntries([...new Set(results.map((item) => item.category))].map((category) => {
  const subset = results.filter((item) => item.category === category);
  const passed = subset.filter((item) => item.pass).length;
  return [category, { passed, total: subset.length, score: Number((passed / subset.length).toFixed(4)) }];
}));
const passed = results.filter((item) => item.pass).length;
const report = {
  schema: 'https://l0g.fr/schemas/agent-bench-1.json',
  version: fixture.version,
  generated: process.env.L0G_BUILD_TIMESTAMP || new Date().toISOString(),
  benchmarkHash: `sha256:${createHash('sha256').update(fixtureRaw).digest('hex')}`,
  surfaces: {
    agentSurfaceVersion: manifest.version || null,
    mcpServerVersion: serverVersion.version || null,
    gitSha: process.env.MCP_GIT_SHA || null,
  },
  methodology: {
    deterministic: true,
    llmCalls: 0,
    topK: 3,
    cases: fixture.cases.length,
    categories: Object.keys(categories),
  },
  summary: { passed, total: results.length, score: Number((passed / results.length).toFixed(4)), categories },
  results,
};

await fs.mkdir(path.dirname(output), { recursive: true });
await fs.writeFile(output, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
await client.close();
console.log(`Agent Bench: ${passed}/${results.length} (${output})`);
if (passed !== results.length) {
  for (const item of results.filter((result) => !result.pass)) console.error(`FAIL ${item.id}: ${JSON.stringify(item.observed)}`);
  process.exitCode = 1;
}
