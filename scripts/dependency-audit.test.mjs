import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const script = new URL('./test-dependencies.mjs', import.meta.url).href;
function audit(fetchBody) {
  return spawnSync(process.execPath, ['--input-type=module', '-e', `
    globalThis.fetch = ${fetchBody};
    await import(${JSON.stringify(script)});
  `], { encoding: 'utf8', timeout: 5000, maxBuffer: 128 * 1024 });
}

test('missing registry transport blocks publication without claiming an audit passed', () => {
  for (const fetchBody of [
    'async () => { throw new Error("fetch failed: ENOTFOUND"); }',
    'async () => new Response("unavailable", { status: 503 })',
  ]) {
    const result = audit(fetchBody);
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
    const result = audit(`async () => new Response(${JSON.stringify(JSON.stringify(report))})`);
    assert.ifError(result.error);
    assert.equal(result.status, 1, result.stdout + result.stderr);
  }
});

test('an available empty advisory report completes both dependency-tree audits', () => {
  const result = audit('async () => new Response("{}")');
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /main: no unmitigated/);
  assert.match(result.stdout, /mcp-server: no unmitigated/);
});
