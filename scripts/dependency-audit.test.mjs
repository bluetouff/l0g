import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const script = new URL('./test-dependencies.mjs', import.meta.url).href;
const harness = `
  const [mode, payload, script] = process.argv.slice(1);
  if (mode === 'verification-timeout') {
    const { default: childProcess } = await import('node:child_process');
    const { syncBuiltinESMExports } = await import('node:module');
    childProcess.spawnSync = () => ({ error: Object.assign(new Error('fixture deadline'), { code: 'ETIMEDOUT' }), status: null, stdout: '', stderr: '' });
    syncBuiltinESMExports();
    globalThis.fetch = async () => { throw new Error('Registry must not be queried after failed local verification'); };
  } else if (mode === 'network') {
    globalThis.fetch = async () => { throw new Error('fetch failed: ENOTFOUND'); };
  } else if (mode === 'http') {
    globalThis.fetch = async () => new Response('unavailable', { status: 503 });
  } else if (mode === 'main-report') {
    let calls = 0;
    globalThis.fetch = async () => new Response(calls++ === 0 ? payload : '{}');
  } else if (mode === 'report') {
    globalThis.fetch = async () => new Response(payload);
  } else {
    throw new Error('Unknown test fixture mode');
  }
  await import(script);
`;
function audit(mode, payload = '', target = script) {
  // Fixture JSON is a process argument, never executable JavaScript.
  return spawnSync(process.execPath, ['--input-type=module', '-e', harness, mode, payload, target], {
    encoding: 'utf8', timeout: 10000, maxBuffer: 128 * 1024,
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

test('a local verification deadline fails before registry access and is not described as network failure', () => {
  const result = audit('verification-timeout');
  assert.ifError(result.error);
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stderr, /main: audit failed/);
  assert.match(result.stderr, /picomatch: bounded fresh-process verification failed/);
  assert.doesNotMatch(result.stderr, /audit unavailable|Registry must not be queried/);
  assert.doesNotMatch(result.stdout, /no unmitigated|mcp-server/);
});

const picomatchFinding = {
  id: 1247710,
  url: 'https://github.com/advisories/GHSA-fc5q-39xc-vjpf',
  title: 'picomatch vulnerable to ReDoS through single-branch repeated extglobs',
  severity: 'high',
  vulnerable_versions: '<=4.0.7',
};
const picomatchReport = JSON.stringify({ picomatch: [picomatchFinding] });

test('the exact picomatch advisory remains visible and requires verified installed remediation', () => {
  const result = audit('main-report', picomatchReport);
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /GHSA-fc5q-39xc-vjpf locally mitigated/);
  assert.match(result.stdout, /repeated \+\(\.\.\.\) and \*\(\.\.\.\) extglobs rejected/);
  assert.match(result.stdout, /main: no unmitigated/);
  assert.match(result.stdout, /mcp-server: no unmitigated/);
});

test('changed picomatch advisory metadata and the separate MCP tree stay blocking', () => {
  for (const change of [
    { id: 0 }, { url: 'https://github.com/advisories/GHSA-0000-0000-0000' },
    { title: 'A different vulnerability' }, { severity: 'critical' },
    { vulnerable_versions: '<=4.0.8' },
  ]) {
    const result = audit('main-report', JSON.stringify({ picomatch: [{ ...picomatchFinding, ...change }] }));
    assert.ifError(result.error);
    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.doesNotMatch(result.stdout, /locally mitigated|no unmitigated/);
  }
  const separateTree = audit('report', picomatchReport);
  assert.ifError(separateTree.error);
  assert.equal(separateTree.status, 1, separateTree.stdout + separateTree.stderr);
  assert.match(separateTree.stderr, /mcp-server: audit failed/);
});

function isolatedRemediationFixture(change) {
  const sourceRoot = fileURLToPath(new URL('../', import.meta.url));
  const root = realpathSync(mkdtempSync(join(tmpdir(), 'l0g-dependency-audit-')));
  const lock = JSON.parse(readFileSync(join(sourceRoot, 'package-lock.json'), 'utf8'));
  const entries = Object.entries(lock.packages).filter(([path]) => path === 'node_modules/picomatch' || path.endsWith('/node_modules/picomatch'));
  assert(entries.length > 0);
  try {
    mkdirSync(join(root, 'scripts'));
    for (const name of ['test-dependencies.mjs', 'picomatch-security.mjs']) cpSync(join(sourceRoot, 'scripts', name), join(root, 'scripts', name));
    for (const [path] of entries) {
      mkdirSync(dirname(join(root, path)), { recursive: true });
      cpSync(join(sourceRoot, path), join(root, path), { recursive: true });
    }
    writeFileSync(join(root, 'package-lock.json'), JSON.stringify({ lockfileVersion: 3, packages: Object.fromEntries(entries) }));
    mkdirSync(join(root, 'mcp-server'));
    writeFileSync(join(root, 'mcp-server/package-lock.json'), JSON.stringify({ lockfileVersion: 3, packages: {} }));
    change?.(root, entries);
    return { root, script: pathToFileURL(join(root, 'scripts/test-dependencies.mjs')).href };
  } catch (error) {
    rmSync(root, { recursive: true, force: true });
    throw error;
  }
}

test('missing, altered, mismatched or unlisted parser installations cannot qualify an advisory', () => {
  const changes = [
    (root, [[path]]) => rmSync(join(root, path), { recursive: true }),
    (root, [[path]]) => {
      const file = join(root, path, 'lib/parse.js');
      writeFileSync(file, readFileSync(file, 'utf8') + '\n// changed fixture\n');
    },
    (root, [[path]]) => {
      const file = join(root, path, 'package.json');
      const metadata = JSON.parse(readFileSync(file, 'utf8'));
      metadata.version = '4.0.8';
      writeFileSync(file, JSON.stringify(metadata));
    },
    (root, [[path]]) => {
      const extra = join(root, 'node_modules/fixture/node_modules/picomatch');
      mkdirSync(dirname(extra), { recursive: true });
      writeFileSync(join(root, 'node_modules/fixture/package.json'), '{"name":"fixture","version":"1.0.0"}');
      cpSync(join(root, path), extra, { recursive: true });
    },
  ];
  for (const change of changes) {
    const fixture = isolatedRemediationFixture(change);
    try {
      for (const report of [picomatchReport, '{}']) {
        const result = audit('main-report', report, fixture.script);
        assert.ifError(result.error);
        assert.equal(result.status, 1, result.stdout + result.stderr);
        assert.match(result.stderr, /picomatch/);
        assert.doesNotMatch(result.stdout, /locally mitigated|no unmitigated/);
      }
    } finally { rmSync(fixture.root, { recursive: true, force: true }); }
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

test('tooling imports are direct dependencies rather than transitive side effects', () => {
  const manifest = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  const lock = JSON.parse(readFileSync(new URL('../package-lock.json', import.meta.url), 'utf8'));
  for (const name of ['esbuild', 'js-yaml']) {
    const declared = manifest.devDependencies?.[name];
    assert.equal(typeof declared, 'string', `${name} must be declared directly for the publication tests`);
    assert.equal(declared, manifest.overrides[name], `${name} must retain its security-pinned version`);
    assert.equal(lock.packages[''].devDependencies[name], declared, `${name} declaration must match the lockfile`);
    assert.equal(lock.packages[`node_modules/${name}`]?.version, declared, `${name} must be installed at the declared version`);
  }
});
