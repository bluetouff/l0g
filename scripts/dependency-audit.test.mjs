import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const script = new URL('./test-dependencies.mjs', import.meta.url).href;
const harness = `
  const [mode, payload, script] = process.argv.slice(1);
  if (mode === 'network') {
    globalThis.fetch = async () => { throw new Error('fetch failed: ENOTFOUND'); };
  } else if (mode === 'http') {
    globalThis.fetch = async () => new Response('unavailable', { status: 503 });
  } else if (mode === 'report') {
    globalThis.fetch = async () => new Response(payload);
  } else {
    throw new Error('Unknown test fixture mode');
  }
  await import(script);
`;
function audit(mode, payload = '') {
  // Fixture JSON is a process argument, never executable JavaScript.
  return spawnSync(process.execPath, ['--input-type=module', '-e', harness, mode, payload, script], {
    encoding: 'utf8', timeout: 5000, maxBuffer: 128 * 1024,
  });
}

test('missing registry transport blocks publication without claiming an audit passed', () => {
  for (const mode of ['network', 'http']) {
    const result = audit(mode);
    assert.ifError(result.error);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /publication check fails closed/);
    assert.doesNotMatch(result.stdout, /no unmitigated/);
  }
});

test('malformed reports and unrelated advisories remain blocking', () => {
  for (const report of [null, [], { other: null }, { other: [null] }, { other: [{ severity: 'unknown' }] }, { other: [{}] },
    ...[['low'], ['high'], {}, 0].map((severity) => ({ other: [{ severity }] })), {
    'http-cache-semantics': [{ severity: 'high', title: 'Unrelated defect', url: 'https://github.com/advisories/GHSA-0000-0000-0000' }],
  }]) {
    const result = audit('report', JSON.stringify(report));
    assert.ifError(result.error);
    assert.equal(result.status, 1, result.stdout + result.stderr);
  }
});

test('an available empty advisory report completes both dependency-tree audits', () => {
  const result = audit('report', '{}');
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /main: no unmitigated/);
  assert.match(result.stdout, /mcp-server: no unmitigated/);
});

test('the previously excepted cache advisory is now blocking', () => {
  const result = audit('report', JSON.stringify({
    'http-cache-semantics': [{ severity: 'high', title: 'Cache reuse restriction bypass', url: 'https://github.com/advisories/GHSA-ch52-4w7c-c8xp' }],
  }));
  assert.ifError(result.error);
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stderr, /http-cache-semantics: high/);
  assert.doesNotMatch(result.stdout, /no unmitigated/);
});
