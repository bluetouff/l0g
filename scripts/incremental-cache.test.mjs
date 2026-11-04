import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { prepareIncrementalCache, sealIncrementalCache, validateNativeManifest, INCREMENTAL_CACHE_DIRECTORY } from './incremental-cache.mjs';

const hash = 'a'.repeat(64);
const main = { GITHUB_ACTIONS: 'true', GITHUB_REPOSITORY: 'bluetouff/l0g', GITHUB_REF: 'refs/heads/main',
  GITHUB_SHA: 'b'.repeat(40), GITHUB_RUN_ID: '12', GITHUB_RUN_ATTEMPT: '1' };
const pr = { ...main, GITHUB_REF: 'refs/pull/1/merge' };

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'l0g-incremental-cache-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const directory = path.join(root, INCREMENTAL_CACHE_DIRECTORY);
  fs.mkdirSync(path.join(root, 'node_modules/astro'), { recursive: true });
  fs.writeFileSync(path.join(root, 'node_modules/astro/package.json'), JSON.stringify({ version: '7.4.4' }));
  fs.mkdirSync(path.join(directory, 'dist/posts/test'), { recursive: true });
  fs.writeFileSync(path.join(directory, 'dist/posts/test/index.html'), '<!doctype html><p>Verified page</p>');
  const manifest = { version: 1, configHash: hash, lockfileHash: hash, keyDigest: hash,
    routes: { 'src/pages/posts/[...slug].astro': { dependencyHash: hash,
      paths: { '/posts/test/': { cacheKey: 'post-1', outputFile: 'posts/test/index.html', contentHashes: { 'src/content/posts/test.mdx': hash } } } } } };
  const writeManifest = () => fs.writeFileSync(path.join(directory, 'incremental-build.json'), JSON.stringify(manifest));
  writeManifest();
  const options = { root, environment: {}, log: () => {} };
  return { root, directory, manifest, writeManifest, options,
    entry: manifest.routes['src/pages/posts/[...slug].astro'].paths['/posts/test/'],
    receipt: path.join(directory, 'l0g-integrity.json'), output: path.join(directory, 'dist/posts/test/index.html') };
}

test('cold cache is optional and one verified output can be sealed and reused', (t) => {
  const f = fixture(t);
  assert.deepEqual(sealIncrementalCache(f.options), { state: 'sealed', files: 1 });
  assert.deepEqual(prepareIncrementalCache(f.options), { state: 'warm', files: 1 });
  fs.rmSync(f.directory, { recursive: true });
  assert.deepEqual(prepareIncrementalCache(f.options), { state: 'cold', reason: 'absent' });
  assert.deepEqual(sealIncrementalCache(f.options), { state: 'absent' });
});

test('sealing prunes obsolete private HTML after a force rebuild removes route eligibility', (t) => {
  const f = fixture(t);
  const oldRoute = '/guides/old/';
  const paths = f.manifest.routes['src/pages/posts/[...slug].astro'].paths;
  paths[oldRoute] = { cacheKey: 'old-guide', outputFile: 'guides/old/index.html' };
  const stale = path.join(f.directory, 'dist/guides/old/index.html');
  const publicOutput = path.join(f.root, 'dist/guides/old/index.html');
  for (const file of [stale, publicOutput]) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, 'keep the public guide');
  }
  f.writeManifest();
  assert.equal(sealIncrementalCache(f.options).files, 2);
  delete paths[oldRoute];
  f.entry.cacheKey = 'fresh-force-build';
  fs.writeFileSync(f.output, '<p>Freshly rendered</p>');
  f.writeManifest();
  assert.deepEqual(sealIncrementalCache(f.options), { state: 'sealed', files: 1 });
  assert.equal(fs.existsSync(stale), false);
  assert.equal(fs.readFileSync(publicOutput, 'utf8'), 'keep the public guide');
  assert.equal(fs.readFileSync(f.output, 'utf8'), '<p>Freshly rendered</p>');
  assert.deepEqual(prepareIncrementalCache(f.options), { state: 'warm', files: 1 });
});

test('sealing an empty native manifest removes only obsolete private HTML', (t) => {
  const f = fixture(t);
  sealIncrementalCache(f.options);
  f.manifest.routes = {};
  f.writeManifest();
  assert.deepEqual(sealIncrementalCache(f.options), { state: 'sealed', files: 0 });
  assert.equal(fs.existsSync(f.output), false);
  assert.deepEqual(prepareIncrementalCache(f.options), { state: 'warm', files: 0 });
});

test('sealing validates all expected files before removing any obsolete file', (t) => {
  const f = fixture(t);
  const stale = path.join(f.directory, 'dist/a-stale.html');
  fs.writeFileSync(stale, 'still present after a failed seal');
  fs.rmSync(f.output);
  assert.throws(() => sealIncrementalCache(f.options), /missing cache payload file/);
  assert.equal(fs.readFileSync(stale, 'utf8'), 'still present after a failed seal');
  assert.equal(fs.existsSync(f.receipt), false);
});

for (const kind of ['symlink', 'symlink-directory', 'hardlink', 'oversized', 'unsafe-name']) {
  test(`sealing refuses ${kind} extras before pruning any ordinary obsolete file`, (t) => {
    const f = fixture(t);
    const stale = path.join(f.directory, 'dist/a-stale.html');
    const unsafe = path.join(f.directory, kind === 'unsafe-name' ? 'dist/z-unsafe?.html' : 'dist/z-unsafe.html');
    const outside = path.join(f.root, 'outside');
    fs.mkdirSync(outside);
    const target = path.join(outside, 'target.txt');
    fs.writeFileSync(target, 'untouched');
    fs.writeFileSync(stale, 'keep until the whole inventory passes');
    if (kind === 'symlink') fs.symlinkSync(target, unsafe);
    else if (kind === 'symlink-directory') fs.symlinkSync(outside, unsafe);
    else if (kind === 'hardlink') fs.linkSync(target, unsafe);
    else {
      fs.writeFileSync(unsafe, 'invalid');
      if (kind === 'oversized') fs.truncateSync(unsafe, 33 * 1024 * 1024);
    }
    assert.throws(() => sealIncrementalCache(f.options));
    assert.equal(fs.readFileSync(stale, 'utf8'), 'keep until the whole inventory passes');
    assert.equal(fs.readFileSync(target, 'utf8'), 'untouched');
    assert.equal(fs.existsSync(f.output), true);
    assert.equal(fs.existsSync(f.receipt), false);
  });
}

test('a warm main cache can be restored read-only by a PR; PR writes are refused', (t) => {
  const f = fixture(t);
  sealIncrementalCache({ ...f.options, environment: main });
  assert.equal(prepareIncrementalCache({ ...f.options, environment: pr }).state, 'warm');
  assert.throws(() => sealIncrementalCache({ ...f.options, environment: pr }), /only canonical main/);
  assert.throws(() => sealIncrementalCache({ ...f.options, environment: { ...main, GITHUB_REPOSITORY: 'other/l0g' } }), /only canonical main/);
});

test('the build CLI skips sealing on PRs while returning a successful read-only result', () => {
  const result = spawnSync(process.execPath, [fileURLToPath(new URL('./incremental-cache.mjs', import.meta.url)), 'seal'], {
    env: { ...process.env, ...pr }, encoding: 'utf8', timeout: 10_000,
  });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /read-only CI cache: sealing skipped/);
});

test('CI rejects a locally sealed cache; a new commit may reuse a trusted main cache', (t) => {
  const f = fixture(t);
  sealIncrementalCache({ ...f.options, environment: main });
  assert.equal(prepareIncrementalCache({ ...f.options, environment: { ...main, GITHUB_SHA: 'c'.repeat(40) } }).state, 'warm');
  sealIncrementalCache(f.options);
  assert.equal(prepareIncrementalCache({ ...f.options, environment: main }).state, 'cold');
  assert.equal(fs.existsSync(f.directory), false);
});

test('a different host timezone invalidates cached historical date formatting', (t) => {
  const f = fixture(t);
  sealIncrementalCache(f.options);
  const previous = process.env.TZ;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  try {
    process.env.TZ = timezone === 'Pacific/Honolulu' ? 'UTC' : 'Pacific/Honolulu';
    assert.notEqual(Intl.DateTimeFormat().resolvedOptions().timeZone, timezone);
    assert.equal(prepareIncrementalCache(f.options).state, 'cold');
  } finally {
    if (previous === undefined) delete process.env.TZ;
    else process.env.TZ = previous;
  }
});

for (const mutation of ['html', 'manifest', 'receipt', 'missing-output', 'missing-receipt', 'extra-output', 'runtime']) {
  test(`${mutation} corruption becomes a clean cold build without touching source files`, (t) => {
    const f = fixture(t);
    const source = path.join(f.root, 'source.txt');
    fs.writeFileSync(source, 'untouched');
    sealIncrementalCache(f.options);
    if (mutation === 'html') fs.writeFileSync(f.output, '<script>corrupted</script>');
    if (mutation === 'manifest') { f.entry.cacheKey = 'wrong'; f.writeManifest(); }
    if (mutation === 'receipt') fs.writeFileSync(f.receipt, '{broken');
    if (mutation === 'missing-output') fs.rmSync(f.output);
    if (mutation === 'missing-receipt') fs.rmSync(f.receipt);
    if (mutation === 'extra-output') fs.writeFileSync(path.join(f.directory, 'dist/extra.html'), 'unexpected');
    if (mutation === 'runtime') fs.writeFileSync(path.join(f.root, 'node_modules/astro/package.json'), '{"version":"7.4.5"}');
    assert.equal(prepareIncrementalCache(f.options).state, 'cold');
    assert.equal(fs.existsSync(f.directory), false);
    assert.equal(fs.readFileSync(source, 'utf8'), 'untouched');
  });
}

for (const output of ['../escape.html', '%2e%2e/escape.html', '/absolute.html', 'https://host/file', 'x/../../escape', 'x\\escape', 'x/%2e%2e/escape', 'x%2f..%2fescape', 'x?query', 'x#hash']) {
  test(`native manifest rejects unsafe output ${output}`, (t) => {
    const f = fixture(t);
    f.entry.outputFile = output;
    assert.throws(() => validateNativeManifest(f.manifest), /unsafe/);
  });
}

test('URI encoded Unicode output names are confined and resolved correctly', (t) => {
  const f = fixture(t);
  f.entry.outputFile = 'posts/caf%C3%A9/index.html';
  fs.renameSync(path.join(f.directory, 'dist/posts/test'), path.join(f.directory, 'dist/posts/café'));
  f.writeManifest();
  assert.equal(sealIncrementalCache(f.options).state, 'sealed');
  assert.equal(prepareIncrementalCache(f.options).state, 'warm');
});

test('invalid schema, duplicate outputs and prototype keys are rejected', (t) => {
  const f = fixture(t);
  for (const mutate of [
    (m) => { m.version = 2; },
    (m) => { m.configHash = 'bad'; },
    (m) => { m.unknown = true; },
    (m) => { m.routes['src/pages/posts/[...slug].astro'].paths['/duplicate/'] = { ...f.entry }; },
    (m) => { m.routes = JSON.parse('{"__proto__":{}}'); },
  ]) {
    const manifest = structuredClone(f.manifest); mutate(manifest);
    assert.throws(() => validateNativeManifest(manifest));
  }
});

test('hard links, symlink files and symlink directories fail closed without following the target', (t) => {
  for (const kind of ['hardlink', 'file', 'directory', 'cache-root', 'dangling-root']) {
    const f = fixture(t);
    sealIncrementalCache(f.options);
    const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'l0g-incremental-outside-'));
    t.after(() => fs.rmSync(outside, { recursive: true, force: true }));
    const target = path.join(outside, 'target');
    fs.writeFileSync(target, 'untouched');
    if (kind === 'hardlink' || kind === 'file') {
      fs.rmSync(f.output);
      if (kind === 'hardlink') fs.linkSync(target, f.output);
      else fs.symlinkSync(target, f.output);
    } else if (kind === 'directory') {
      fs.rmSync(path.join(f.directory, 'dist'), { recursive: true });
      fs.symlinkSync(outside, path.join(f.directory, 'dist'));
    } else {
      fs.rmSync(f.directory, { recursive: true });
      fs.symlinkSync(kind === 'cache-root' ? outside : path.join(outside, 'absent'), f.directory);
    }
    assert.equal(prepareIncrementalCache(f.options).state, 'cold');
    assert.equal(fs.readFileSync(target, 'utf8'), 'untouched');
  }
});

test('unsafe shared cache ancestor is refused without altering it', (t) => {
  const f = fixture(t);
  const original = path.join(f.root, '.cache-original');
  fs.renameSync(path.join(f.root, '.cache'), original);
  fs.symlinkSync(original, path.join(f.root, '.cache'));
  assert.throws(() => prepareIncrementalCache(f.options), /unsafe .cache parent/);
  assert.equal(fs.readFileSync(path.join(original, 'astro-incremental/dist/posts/test/index.html'), 'utf8'), '<!doctype html><p>Verified page</p>');
});

test('oversized receipts and files are refused before reading their contents', (t) => {
  for (const kind of ['receipt', 'output']) {
    const f = fixture(t);
    sealIncrementalCache(f.options);
    fs.truncateSync(kind === 'receipt' ? f.receipt : f.output, 33 * 1024 * 1024);
    assert.equal(prepareIncrementalCache(f.options).state, 'cold');
  }
});
