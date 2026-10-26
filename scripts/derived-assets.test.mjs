import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fingerprintPaths, runDerivedTask } from './derived-assets-cache.mjs';
import { derivedTasks } from './derived-assets.mjs';

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'l0g-derived-test-'));
  t.after(() => fs.rmSync(root, { force: true, recursive: true }));
  fs.mkdirSync(path.join(root, 'sources'));
  fs.writeFileSync(path.join(root, 'sources/article.txt'), 'source v1');
  fs.writeFileSync(path.join(root, 'generator.mjs'), 'generator v1');
  let runs = 0;
  const config = {
    root, name: 'fixture', inputs: ['sources', 'generator.mjs'], outputs: ['output.txt'],
    identity: { node: process.version, renderer: 1 }, log: () => {},
    run: () => {
      runs++;
      fs.writeFileSync(path.join(root, 'output.txt'), fs.readFileSync(path.join(root, 'sources/article.txt')));
      // Establish an exactly representable timestamp before the cache records it.
      fs.utimesSync(path.join(root, 'output.txt'), 1_700_000_000, 1_700_000_000);
    },
  };
  return { root, config, runs: () => runs, manifest: path.join(root, '.cache/derived-assets/fixture.json') };
}

test('cold generation then reuse hashes existing files without storing a second asset copy', async (t) => {
  const f = fixture(t);
  assert.equal((await runDerivedTask(f.config)).cached, false);
  assert.equal((await runDerivedTask(f.config)).cached, true);
  assert.equal(f.runs(), 1);
  const manifest = fs.readFileSync(f.manifest, 'utf8');
  assert.ok(Buffer.byteLength(manifest) < 256);
  assert.deepEqual(Object.keys(JSON.parse(manifest)).sort(), ['input', 'output', 'version']);
  assert.deepEqual(fs.readdirSync(path.dirname(f.manifest)), ['fixture.json']);
  assert.ok(!manifest.includes('source v1'));
});

test('source, generator, file additions, deletions and runtime identity invalidate reuse', async (t) => {
  const f = fixture(t);
  await runDerivedTask(f.config);
  for (const [file, content] of [['sources/article.txt', 'source v2'], ['generator.mjs', 'generator v2'], ['sources/new.txt', 'new dependency']]) {
    fs.writeFileSync(path.join(f.root, file), content);
    assert.equal((await runDerivedTask(f.config)).cached, false);
    assert.equal((await runDerivedTask(f.config)).cached, true);
  }
  fs.rmSync(path.join(f.root, 'sources/new.txt'));
  assert.equal((await runDerivedTask(f.config)).cached, false);
  assert.equal((await runDerivedTask({ ...f.config, identity: { renderer: 2 } })).cached, false);
  assert.equal(f.runs(), 6);
});

test('changed content with an unchanged mtime still invalidates the output', async (t) => {
  const f = fixture(t);
  await runDerivedTask(f.config);
  const file = path.join(f.root, 'output.txt');
  const descriptor = fs.openSync(file, fs.constants.O_RDWR | fs.constants.O_NOFOLLOW | fs.constants.O_NONBLOCK);
  try {
    // Keep metadata and mutation on the same file, even if its path changes.
    const before = fs.fstatSync(descriptor);
    fs.writeSync(descriptor, 'corrupted', 0, 'utf8');
    fs.futimesSync(descriptor, before.atime, before.mtime);
    assert.equal(fs.fstatSync(descriptor).mtimeMs, before.mtimeMs);
    assert.equal((await runDerivedTask(f.config)).cached, false);
    assert.equal(fs.readFileSync(descriptor, 'utf8'), 'source v1');
  } finally {
    fs.closeSync(descriptor);
  }
  fs.rmSync(file);
  assert.equal((await runDerivedTask(f.config)).cached, false);
  assert.equal(f.runs(), 3);
});

test('a failed command or missing output never creates a success record', async (t) => {
  const f = fixture(t);
  await assert.rejects(runDerivedTask({ ...f.config, run: () => { throw new Error('failed'); } }), /failed/);
  assert.equal(fs.existsSync(f.manifest), false);
  await assert.rejects(runDerivedTask({ ...f.config, run: () => {} }), /Missing generated output/);
  assert.equal(fs.existsSync(f.manifest), false);
  assert.equal((await runDerivedTask(f.config)).cached, false);
});

test('malformed and oversized manifests are misses, with one bounded replacement', async (t) => {
  const f = fixture(t);
  await runDerivedTask(f.config);
  for (const content of ['{invalid', 'x'.repeat(4097), JSON.stringify({ version: 1, input: {}, output: [] })]) {
    fs.writeFileSync(f.manifest, content);
    assert.equal((await runDerivedTask(f.config)).cached, false);
    assert.ok(fs.statSync(f.manifest).size < 256);
  }
  assert.deepEqual(fs.readdirSync(path.dirname(f.manifest)), ['fixture.json']);
});

test('generated intermediate inputs are recorded after success while source changes during generation fail', async (t) => {
  const f = fixture(t);
  const config = {
    ...f.config, inputs: [...f.config.inputs, 'intermediate.txt'], stableInputs: f.config.inputs,
    outputs: ['output.txt', 'intermediate.txt'],
    run: () => {
      f.config.run();
      fs.writeFileSync(path.join(f.root, 'intermediate.txt'), 'generated chapter');
    },
  };
  assert.equal((await runDerivedTask(config)).cached, false);
  assert.equal((await runDerivedTask(config)).cached, true);
  fs.rmSync(f.manifest);
  await assert.rejects(runDerivedTask({ ...config, run: () => {
    config.run();
    fs.writeFileSync(path.join(f.root, 'sources/article.txt'), 'edited during rendering');
  } }), /Source changed during/);
  assert.equal(fs.existsSync(f.manifest), false);
});

test('excluded later-stage outputs do not cause perpetual regeneration', async (t) => {
  const f = fixture(t);
  fs.mkdirSync(path.join(f.root, 'generated'));
  const config = { ...f.config, outputs: [{ path: 'generated', exclude: ['generated/later.txt'] }], run: () => fs.writeFileSync(path.join(f.root, 'generated/owned.txt'), 'owned output') };
  await runDerivedTask(config);
  fs.writeFileSync(path.join(f.root, 'generated/later.txt'), 'another group');
  assert.equal((await runDerivedTask(config)).cached, true);
  fs.rmSync(path.join(f.root, 'generated/owned.txt'));
  assert.equal((await runDerivedTask(config)).cached, false);
});

test('a source edit during final output hashing cannot cache an older render', async (t) => {
  const f = fixture(t);
  const root = fs.realpathSync(f.root);
  const output = path.join(root, 'output.txt');
  let generated = false;
  let edited = false;
  const open = fs.openSync;
  const patchedOpen = t.mock.method(fs, 'openSync', function (file, ...args) {
    if (generated && !edited && file === output) {
      edited = true;
      fs.writeFileSync(path.join(root, 'sources/article.txt'), 'edited after rendering');
    }
    return open.call(this, file, ...args);
  });
  const config = { ...f.config, run: () => { f.config.run(); generated = true; } };
  await assert.rejects(runDerivedTask(config), /Source changed during/);
  patchedOpen.mock.restore();
  assert.equal(edited, true);
  assert.equal(fs.existsSync(f.manifest), false);
  assert.equal((await runDerivedTask(config)).cached, false);
  assert.equal(fs.readFileSync(output, 'utf8'), 'edited after rendering');
});

test('symlinked source, output, and output-parent paths are rejected before running', async (t) => {
  for (const target of ['sources/article.txt', 'output.txt', 'sources']) {
    const f = fixture(t);
    const linked = path.join(f.root, target);
    fs.rmSync(linked, { recursive: true, force: true });
    fs.symlinkSync(target === 'sources' ? os.tmpdir() : path.join(f.root, 'generator.mjs'), linked);
    await assert.rejects(runDerivedTask(f.config), /Symlink/);
    assert.equal(f.runs(), 0);
  }
  const f = fixture(t);
  fs.symlinkSync(os.tmpdir(), path.join(f.root, 'parent'));
  await assert.rejects(runDerivedTask({ ...f.config, outputs: ['parent/absent.txt'] }), /Symlink/);
  assert.equal(f.runs(), 0);
});

test('hard-linked output cannot be used or overwritten by a generator', async (t) => {
  const f = fixture(t);
  fs.linkSync(path.join(f.root, 'generator.mjs'), path.join(f.root, 'output.txt'));
  await assert.rejects(runDerivedTask(f.config), /hard links/);
  assert.equal(f.runs(), 0);
});

test('unsafe cache directories and manifest links never read or overwrite their targets', async (t) => {
  for (const cacheDirectory of [true, false]) {
    const f = fixture(t);
    const external = fs.mkdtempSync(path.join(os.tmpdir(), 'l0g-derived-outside-'));
    t.after(() => fs.rmSync(external, { recursive: true, force: true }));
    const marker = path.join(external, 'fixture.json');
    fs.writeFileSync(marker, 'untouched');
    if (cacheDirectory) fs.symlinkSync(external, path.join(f.root, '.cache'));
    else {
      fs.mkdirSync(path.dirname(f.manifest), { recursive: true });
      fs.symlinkSync(marker, f.manifest);
    }
    assert.equal((await runDerivedTask(f.config)).cached, false);
    assert.equal((await runDerivedTask(f.config)).cached, false);
    assert.equal(fs.readFileSync(marker, 'utf8'), 'untouched');
    assert.deepEqual(fs.readdirSync(external), ['fixture.json']);
  }
});

test('traversal, absolute paths and unsafe group identifiers are rejected', async (t) => {
  const f = fixture(t);
  for (const name of ['../escape', '/tmp/escape', 'a/../../escape', 'a\\escape']) {
    await assert.rejects(runDerivedTask({ ...f.config, name }), /Invalid derived asset group/);
  }
  for (const name of ['../escape', '/tmp/escape', 'sources/../generator.mjs', 'sources\\article.txt']) {
    assert.throws(() => fingerprintPaths(f.root, [name]), /inside the project/);
  }
  assert.equal(f.runs(), 0);
});

test('existing generator overrides remain explicit cache misses', async (t) => {
  const f = fixture(t);
  await runDerivedTask(f.config);
  assert.equal((await runDerivedTask({ ...f.config, cache: false })).cached, false);
  assert.equal(f.runs(), 2);
});

test('production groups retain raw generators and all build validation stages', () => {
  const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  for (const task of Object.values(derivedTasks)) {
    assert.ok(pkg.scripts[task.script]);
    assert.ok(task.inputs.includes('package-lock.json'));
    assert.ok(task.inputs.includes('scripts'));
    assert.ok(task.outputs.length);
  }
  assert.match(pkg.scripts['build:prepare'], /test:derived-assets/);
  assert.match(pkg.scripts['build:prepare'], /test:epub/);
  assert.match(pkg.scripts['build:verify'], /test:security/);
  assert.match(pkg.scripts['build:verify'], /test:performance/);
  assert.match(pkg.scripts['build:ci'], /build:prepare.*test:inline-svg:rendered.*build:verify/);
});
