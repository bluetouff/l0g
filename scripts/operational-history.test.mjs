import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { MAX_HISTORY_LINE_BYTES, sampleOperationalHistory } from './operational-history.mjs';

const row = (snapshot, us = 28) => ({ snapshot, us, eu: 45, us_producer_revision: 'a'.repeat(40) });
const encode = (rows) => Buffer.from(rows.map((item) => JSON.stringify(item)).join('\n'));

test('daily sampling retains the last real UTC snapshot and its complete provenance', async () => {
  const last = { ...row('2026-10-02T23:30:00Z', 29), note: 'série réelle' };
  const input = encode([last, row('2026-10-02T02:00:00Z'), row('2026-10-04T00:00:00+02:00', 30)]);
  // Split inside UTF-8 and JSON tokens, including the unterminated last line.
  async function* chunks() { for (let i = 0; i < input.length; i += 7) yield input.subarray(i, i + 7); }
  const result = await sampleOperationalHistory(chunks());
  assert.equal(result.rows, 3);
  assert.equal(result.sampledRows, 2);
  assert.deepEqual(JSON.parse(result.text.split('\n')[0]), last);
  assert.equal(result.firstSnapshot, '2026-10-02T02:00:00.000Z');
  assert.equal(result.lastSnapshot, '2026-10-03T22:00:00.000Z');
});

test('the growing production journal can exceed 15 MB without losing any day', async () => {
  const line = Buffer.from(JSON.stringify({ ...row('2026-10-02T04:02:27Z'), fixturePadding: 'x'.repeat(2000) }) + '\n');
  async function* chunks() {
    for (let i = 0; i < 8000; i += 1) yield line;
    yield encode([row('2026-10-03T16:26:34Z', 29)]);
  }
  const result = await sampleOperationalHistory(chunks());
  assert.ok(result.bytes > 15_000_000);
  assert.equal(result.rows, 8001);
  assert.equal(result.sampledRows, 2);
  assert.ok(Buffer.byteLength(result.text) < 5000);
  assert.equal(result.lastSnapshot, '2026-10-03T16:26:34.000Z');
});

test('invalid rows cannot be hidden by subsequent daily sampling', async () => {
  for (const invalid of ['{bad json}', '{}', '{"snapshot":"2026-10-03T12:00:00Z","us":null}', '{"snapshot":"invalid","us":28}']) {
    await assert.rejects(sampleOperationalHistory([Buffer.from(invalid + '\n'), encode([row('2026-10-03T16:00:00Z')])]));
  }
});

test('empty, truncated, oversized or interrupted streams are rejected', async () => {
  await assert.rejects(sampleOperationalHistory([]), /vide/);
  await assert.rejects(sampleOperationalHistory([Buffer.from('{"snapshot":')]), /NDJSON invalide/);
  await assert.rejects(sampleOperationalHistory([Buffer.alloc(MAX_HISTORY_LINE_BYTES + 1, 32)]), /ligne historique/);
  await assert.rejects(sampleOperationalHistory([encode([row('2026-10-03T16:00:00Z')])], { maxBytes: 10 }), /trop volumineux/);
  async function* broken() { yield encode([row('2026-10-03T16:00:00Z')]); throw new Error('interrupted'); }
  await assert.rejects(sampleOperationalHistory(broken()), /interrupted/);
});

test('a failed import preserves the previous cache but prevents a green publication', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'l0g-history-test-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await mkdir(join(directory, '.cache'));
  const previous = encode([row('2026-10-02T04:02:27Z')]);
  const cache = join(directory, '.cache/risk-operational-history.ndjson');
  await writeFile(cache, previous);
  const source = join(directory, 'invalid.ndjson');
  await writeFile(source, '{bad json}\n');
  const result = spawnSync(process.execPath, [new URL('./update-risk-history.mjs', import.meta.url).pathname], {
    cwd: directory,
    env: { ...process.env, L0G_OPERATIONAL_HISTORY_SOURCE: source, L0G_OPERATIONAL_HISTORY_PATH: '.cache/risk-operational-history.ndjson', L0G_OPERATIONAL_HISTORY_META_PATH: '.cache/risk-operational-history.meta.json' },
    encoding: 'utf8', timeout: 10_000,
  });
  assert.equal(result.status, 1, result.stderr);
  assert.deepEqual(await readFile(cache), previous);
  const meta = JSON.parse(await readFile(join(directory, '.cache/risk-operational-history.meta.json'), 'utf8'));
  assert.equal(meta.status, 'fallback');
  assert.equal(meta.retrievedAt, null);
  assert.match(meta.reason, /NDJSON invalide/);
});

test('a transient HTTP failure is retried before publishing a complete daily cache', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'l0g-history-retry-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const updater = new URL('./update-risk-history.mjs', import.meta.url).href;
  const code = `
    let calls = 0;
    globalThis.fetch = async () => {
      calls += 1;
      if (calls === 1) return new Response('temporary', { status: 503 });
      return new Response(${JSON.stringify(encode([row('2026-10-02T04:02:27Z'), row('2026-10-02T05:00:00Z', 29)]).toString())});
    };
    await import(${JSON.stringify(updater)});
    if (calls !== 2) process.exitCode = 2;
  `;
  const result = spawnSync(process.execPath, ['--input-type=module', '--eval', code], {
    cwd: directory,
    env: { ...process.env, L0G_OPERATIONAL_HISTORY_SOURCE: '', L0G_OPERATIONAL_HISTORY_PATH: '.cache/risk-operational-history.ndjson', L0G_OPERATIONAL_HISTORY_META_PATH: '.cache/risk-operational-history.meta.json' },
    encoding: 'utf8', timeout: 10_000,
  });
  assert.equal(result.status, 0, result.stderr);
  const meta = JSON.parse(await readFile(join(directory, '.cache/risk-operational-history.meta.json'), 'utf8'));
  assert.equal(meta.status, 'ok');
  assert.equal(meta.rows, 2);
  assert.equal(meta.sampledRows, 1);
  const cached = await readFile(join(directory, '.cache/risk-operational-history.ndjson'), 'utf8');
  assert.equal(JSON.parse(cached).us, 29);
});
