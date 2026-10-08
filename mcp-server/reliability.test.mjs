import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { buildServer } from './server.mjs';
import { classifyMcpFailure } from './usage-telemetry.mjs';

async function withClient(t, surface = 'compact') {
  const dataDir = await mkdtemp(join(tmpdir(), 'l0g-mcp-reliability-'));
  const record = { slug: 'test-article', language: 'en', canonicalId: 'article:test-article', type: 'article', url: 'https://l0g.fr/en/analysis/test-article/', title: 'Risk evidence', date: '2026-10-01' };
  await mkdir(join(dataDir, 'en/analysis/test-article'), { recursive: true });
  const text = 'Risk evidence. '.repeat(200) + ' Sources ' + 'Reference material. '.repeat(200);
  await writeFile(join(dataDir, 'en/analysis/test-article/index.html'), `<article><h1>Risk evidence</h1><div class="prose">${text}</div></article>`);
  const data = {
    dataDir, agent: {}, openapi: {},
    catalog: { articles: [record, { ...record, slug: 'missing', url: 'https://l0g.fr/en/analysis/missing/' }], guides: [] },
    searchIndex: { documents: [{ ...record, text, description: 'Risk evidence' }] },
    claims: { claims: [] }, sources: { primarySources: [] },
    freshness: { generated: '2026-10-08T00:00:00Z', corpus: {}, signalFreshness: [] },
    integrity: {}, changes: {}, evidenceGraph: { nodes: [], edges: [] },
  };
  const server = buildServer(data, { surface });
  const client = new Client({ name: 'l0g-reliability-test', version: '1.0.0' });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await server.connect(serverTransport);
  await client.connect(clientTransport);
  t.after(async () => { await client.close(); await server.close(); await rm(dataDir, { recursive: true, force: true }); });
  return { client, record, text, dataDir };
}

for (const surface of ['compact', 'full']) {
  const tool = surface === 'compact' ? 'get_document' : 'get_article';
  test(`${tool}: head and sources cursors advance instead of repeating the first page`, async (t) => {
    const { client, record } = await withClient(t, surface);
    for (const section of ['head', 'sources']) {
      const first = await client.callTool({ name: tool, arguments: { slug: record.url, section, limit: 1000 } });
      assert.notEqual(first.isError, true);
      assert.ok(first.structuredContent.hasMore);
      const next = await client.callTool({ name: tool, arguments: { slug: record.url, cursor: first.structuredContent.nextCursor } });
      assert.notEqual(next.isError, true);
      assert.equal(next.structuredContent.offset, first.structuredContent.nextOffset);
      assert.ok(next.structuredContent.offset > first.structuredContent.offset);
    }
  });
  test(`${tool}: pagination exhausts without overlap, omission or a repeated cursor`, async (t) => {
    const { client, record, text } = await withClient(t, surface);
    const expected = text.replace(/\s+/g, ' ').trim();
    for (const section of ['body', 'head', 'sources']) {
      let result = await client.callTool({ name: tool, arguments: { slug: record.url, section, limit: 1000 } });
      const start = result.structuredContent.offset;
      const chunks = [];
      const cursors = new Set();
      while (true) {
        assert.notEqual(result.isError, true);
        const page = result.structuredContent;
        chunks.push(page.text);
        if (!page.hasMore) {
          assert.equal(page.nextCursor, null);
          assert.equal(page.nextOffset, null);
          assert.equal(page.offset + page.textChars, page.totalChars);
          break;
        }
        assert.equal(cursors.has(page.nextCursor), false);
        cursors.add(page.nextCursor);
        assert.ok(cursors.size <= 10, 'finite fixture pagination must terminate');
        result = await client.callTool({ name: tool, arguments: { slug: record.url, cursor: page.nextCursor } });
        assert.equal(result.structuredContent.offset, page.offset + page.textChars);
      }
      assert.equal(chunks.join(''), expected.slice(start));
    }
    const exhausted = await client.callTool({ name: tool, arguments: { slug: record.url, offset: expected.length } });
    assert.notEqual(exhausted.isError, true);
    assert.equal(exhausted.structuredContent.text, '');
    assert.equal(exhausted.structuredContent.hasMore, false);
    assert.equal(exhausted.structuredContent.nextCursor, null);
  });
  test(`${tool}: invalid cursors, unknown documents and unavailable files remain distinct failures`, async (t) => {
    const { client, record, dataDir } = await withClient(t, surface);
    const invalidCursors = ['not-a-cursor', Buffer.from(JSON.stringify({ offset: -1, limit: 1000, section: 'body' })).toString('base64url'), Buffer.from(JSON.stringify({ offset: 0, limit: 1000, section: 'bad' })).toString('base64url')];
    for (const cursor of invalidCursors) {
      const result = await client.callTool({ name: tool, arguments: { slug: record.url, cursor } });
      assert.equal(result.isError, true);
      assert.equal(result.structuredContent.errorCode, 'invalid_cursor');
    }
    for (const [slug, code] of [['unknown', 'document_not_found'], ['missing', 'content_unavailable']]) {
      const result = await client.callTool({ name: tool, arguments: { slug, language: 'en' } });
      assert.equal(result.isError, true);
      assert.equal(result.structuredContent.errorCode, code);
      assert.equal(JSON.stringify(result).includes(dataDir), false);
    }
    const invalidArgs = await client.callTool({ name: tool, arguments: { slug: record.slug, limit: 10 } });
    assert.equal(invalidArgs.isError, true);
    assert.equal(classifyMcpFailure({ statusCode: 200, payload: { result: invalidArgs } }), 'invalid_arguments');
  });
}

test('research packs reject impossible dates and empty terms without hiding errors', async (t) => {
  const { client } = await withClient(t);
  for (const asOf of ['2026-02-30', '2025-02-29', '2026-13-01', 'not-a-date']) {
    const result = await client.callTool({ name: 'build_research_pack', arguments: { query: 'risk evidence', language: 'en', asOf } });
    assert.equal(result.isError, true);
    assert.equal(result.structuredContent.errorCode, 'invalid_date');
  }
  const empty = await client.callTool({ name: 'build_research_pack', arguments: { query: '   ', language: 'en' } });
  assert.equal(empty.isError, true);
  assert.equal(empty.structuredContent.errorCode, 'invalid_arguments');
  const valid = await client.callTool({ name: 'build_research_pack', arguments: { query: 'risk evidence', language: 'en', asOf: '2026-10-08' } });
  assert.notEqual(valid.isError, true);
  assert.equal(valid.structuredContent.documents.length, 1);
  const unknown = await client.callTool({ name: 'private-unknown-tool', arguments: {} });
  assert.equal(unknown.isError, true);
  assert.equal(classifyMcpFailure({ statusCode: 200, payload: { result: unknown } }), 'tool_unavailable');
});
