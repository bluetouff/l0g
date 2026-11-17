import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import { chmodSync, copyFileSync, existsSync, linkSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, renameSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { syncBuiltinESMExports } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { ADVISORY_URL, PATCH_ANCHOR, PATCH_GUARD, PINNED_PACKAGES, applyPatch, assertSecureInstallations } from './picomatch-security.mjs';

const projectRoot = realpathSync(fileURLToPath(new URL('../', import.meta.url)));
const moduleFile = fileURLToPath(new URL('./picomatch-security.mjs', import.meta.url));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const paths = ['node_modules/picomatch', 'node_modules/anymatch/node_modules/picomatch'];
const versions = ['4.0.7', '2.3.2'];
const seeds = new Map();

// Tests only write disposable project fixtures. npm ci may already have applied
// the policy; recover the verified upstream bytes solely for those fixtures.
for (const [index, version] of versions.entries()) {
  const pinned = PINNED_PACKAGES[version];
  const files = new Map();
  for (const [name, expected] of Object.entries(pinned.files)) {
    let bytes = readFileSync(join(projectRoot, paths[index], name));
    if (name === 'lib/parse.js' && hash(bytes) === pinned.patched) {
      const source = bytes.toString('utf8');
      assert.equal(source.split(PATCH_ANCHOR + PATCH_GUARD).length, 2);
      bytes = Buffer.from(source.replace(PATCH_ANCHOR + PATCH_GUARD, PATCH_ANCHOR));
    }
    assert.equal(hash(bytes), expected, `fixture seed must match the official package: ${version}/${name}`);
    files.set(name, bytes);
  }
  seeds.set(version, files);
}

function writePackage(root, relativePath, version) {
  for (const [name, bytes] of seeds.get(version)) {
    const file = join(root, relativePath, name);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, bytes);
  }
}

function fixture(t) {
  const base = realpathSync(mkdtempSync(join(tmpdir(), 'l0g-picomatch-test-')));
  t.after(() => rmSync(base, { recursive: true, force: true }));
  const root = join(base, 'project');
  mkdirSync(root);
  const lock = { name: 'security-fixture', version: '1.0.0', lockfileVersion: 3, packages: { '': { name: 'security-fixture', version: '1.0.0' } } };
  for (const [index, version] of versions.entries()) {
    const relativePath = paths[index];
    lock.packages[relativePath] = { version, resolved: `https://registry.npmjs.org/picomatch/-/picomatch-${version}.tgz`, integrity: PINNED_PACKAGES[version].integrity };
    writePackage(root, relativePath, version);
  }
  const saveLock = () => writeFileSync(join(root, 'package-lock.json'), JSON.stringify(lock));
  saveLock();
  return { base, root, lock, saveLock };
}

function originalParsersRemain(root) {
  for (const [index, version] of versions.entries()) assert.equal(hash(readFileSync(join(root, paths[index], 'lib/parse.js'))), PINNED_PACKAGES[version].original);
}

function mockFs(t, name, implementation) {
  const mocked = t.mock.method(fs, name, implementation);
  syncBuiltinESMExports();
  t.after(() => { mocked.mock.restore(); syncBuiltinESMExports(); });
}

function trackFileReads(t, file, beforeOpen = () => {}) {
  const original = { open: fs.openSync, read: fs.readSync, readFile: fs.readFileSync, close: fs.closeSync };
  const state = { fd: undefined, bytes: 0, closed: 0 };
  let readingFile = false;
  mockFs(t, 'openSync', (path, ...args) => {
    if (path === file) beforeOpen();
    const fd = original.open(path, ...args);
    if (path === file) state.fd = fd;
    return fd;
  });
  mockFs(t, 'readSync', (...args) => {
    const count = original.read(...args);
    if (args[0] === state.fd && !readingFile) state.bytes += count;
    return count;
  });
  mockFs(t, 'readFileSync', (...args) => {
    readingFile = true;
    try {
      const bytes = original.readFile(...args);
      if (args[0] === state.fd) state.bytes += bytes.length;
      return bytes;
    } finally { readingFile = false; }
  });
  mockFs(t, 'closeSync', fd => {
    if (fd === state.fd) { state.closed++; state.fd = undefined; }
    return original.close(fd);
  });
  return state;
}

test('unpatched copies fail closed without executing or changing dependencies', t => {
  const f = fixture(t);
  assert.throws(() => assertSecureInstallations({ projectRoot: f.root }), /patch missing|parser modified/);
  originalParsersRemain(f.root);
});

test('all locked copies receive the deterministic patch and fresh bounded API checks', t => {
  const f = fixture(t);
  const modes = paths.map(p => lstatSync(join(f.root, p, 'lib/parse.js')).mode);
  const result = applyPatch({ projectRoot: f.root });
  assert.equal(result.advisory, ADVISORY_URL);
  assert.equal(result.changed, true);
  assert(result.checks > 600);
  assert.deepEqual(new Set(result.installations.map(i => i.relativePath)), new Set(paths));
  for (const [index, version] of versions.entries()) {
    const evidence = result.installations.find(i => i.version === version);
    assert.equal(evidence.sha256, PINNED_PACKAGES[version].patched);
    assert.equal(lstatSync(join(f.root, paths[index], 'lib/parse.js')).mode, modes[index]);
  }
  assert.deepEqual(assertSecureInstallations({ projectRoot: f.root }), { advisory: result.advisory, installations: result.installations, checks: result.checks });
  assert.equal(applyPatch({ projectRoot: f.root }).changed, false);
});

test('the initial validation covers every copy before the first replacement', t => {
  const f = fixture(t);
  const bad = join(f.root, paths[1], 'lib/parse.js');
  writeFileSync(bad, readFileSync(bad, 'utf8') + '\n// unexpected change\n');
  assert.throws(() => applyPatch({ projectRoot: f.root }), /parser modified/);
  assert.equal(hash(readFileSync(join(f.root, paths[0], 'lib/parse.js'))), PINNED_PACKAGES['4.0.7'].original);
});

for (const name of ['index.js', 'lib/picomatch.js', 'lib/utils.js', 'lib/constants.js', 'lib/scan.js', 'posix.js', 'package.json']) {
  test(`altered ${name} blocks validation before code can run`, t => {
    const f = fixture(t);
    const marker = join(f.base, 'unexpected-execution');
    const file = join(f.root, paths[0], name);
    writeFileSync(file, readFileSync(file, 'utf8') + `\nrequire('node:fs').writeFileSync(${JSON.stringify(marker)}, 'bad');\n`);
    assert.throws(() => applyPatch({ projectRoot: f.root }), /hash mismatch|JSON/);
    assert.equal(existsSync(marker), false);
    originalParsersRemain(f.root);
  });
}

test('metadata resolution changes, even with the original parser, are rejected', t => {
  const f = fixture(t);
  const file = join(f.root, paths[0], 'package.json');
  const metadata = JSON.parse(readFileSync(file, 'utf8'));
  metadata.exports = './alternate.js';
  writeFileSync(file, JSON.stringify(metadata));
  assert.throws(() => applyPatch({ projectRoot: f.root }), /hash mismatch/);
  originalParsersRemain(f.root);
});

for (const name of ['extra.js', 'lib/extra.js']) {
  test(`unexpected package file ${name} is refused`, t => {
    const f = fixture(t);
    writeFileSync(join(f.root, paths[0], name), 'module.exports = {};');
    assert.throws(() => applyPatch({ projectRoot: f.root }), /unexpected or missing package files/);
    originalParsersRemain(f.root);
  });
}

test('missing copies and copies added outside the main lock are refused', t => {
  const f = fixture(t);
  rmSync(join(f.root, paths[1]), { recursive: true });
  assert.throws(() => applyPatch({ projectRoot: f.root }), /missing, aliased or unlisted/);
  writePackage(f.root, paths[1], '2.3.2');
  writePackage(f.root, 'node_modules/extra/node_modules/picomatch', '4.0.7');
  assert.throws(() => applyPatch({ projectRoot: f.root }), /missing, aliased or unlisted/);
  originalParsersRemain(f.root);
});

test('an alias with picomatch package identity cannot hide from disk inventory', t => {
  const f = fixture(t);
  writePackage(f.root, 'node_modules/different-name', '4.0.7');
  assert.throws(() => applyPatch({ projectRoot: f.root }), /missing, aliased or unlisted/);
  originalParsersRemain(f.root);
});

for (const [label, change] of [
  ['version', e => { e.version = '4.0.8'; }],
  ['installed version mismatch', e => { e.version = '2.3.2'; e.resolved = 'https://registry.npmjs.org/picomatch/-/picomatch-2.3.2.tgz'; e.integrity = PINNED_PACKAGES['2.3.2'].integrity; }],
  ['registry origin', e => { e.resolved = 'https://example.invalid/picomatch-4.0.7.tgz'; }],
  ['integrity', e => { e.integrity = 'sha512-invalid'; }],
  ['link', e => { e.link = true; }],
  ['identity', e => { e.name = 'another-package'; }],
]) {
  test(`unreviewed lock ${label} blocks patching`, t => {
    const f = fixture(t);
    change(f.lock.packages[paths[0]]); f.saveLock();
    assert.throws(() => applyPatch({ projectRoot: f.root }));
    originalParsersRemain(f.root);
  });
}

for (const unsafe of ['/node_modules/picomatch', '../node_modules/picomatch', 'node_modules/a/../../node_modules/picomatch', 'node_modules\\picomatch', 'node_modules//picomatch', 'node_modules/alias', 'node_modules/picomatch\n']) {
  test(`unsafe or aliased lock path ${unsafe} is refused`, t => {
    const f = fixture(t);
    f.lock.packages[unsafe] = f.lock.packages[paths[0]];
    delete f.lock.packages[paths[0]]; f.saveLock();
    assert.throws(() => applyPatch({ projectRoot: f.root }), /unsafe or aliased/);
    originalParsersRemain(f.root);
  });
}

test('unsupported, empty and excessive main-lock inventories fail closed', t => {
  const f = fixture(t);
  f.lock.lockfileVersion = 2; f.saveLock();
  assert.throws(() => applyPatch({ projectRoot: f.root }), /unsupported main lockfile/);
  f.lock.lockfileVersion = 3; f.lock.packages = {}; f.saveLock();
  assert.throws(() => applyPatch({ projectRoot: f.root }), /no installation/);
  f.lock.packages = Object.fromEntries(Array.from({ length: 20_001 }, (_, i) => [`node_modules/p${i}`, {}])); f.saveLock();
  assert.throws(() => applyPatch({ projectRoot: f.root }), /inventory exceeds safety limit/);
  originalParsersRemain(f.root);
});

test('validation errors never echo credentials or malformed JSON contents', t => {
  const f = fixture(t);
  const secret = 'fixture-secret-that-must-not-be-logged';
  f.lock.packages[paths[0]].resolved = `https://user:${secret}@example.invalid/package.tgz`; f.saveLock();
  assert.throws(() => applyPatch({ projectRoot: f.root }), error => !error.message.includes(secret) && error.message.includes('registry origin'));
  writeFileSync(join(f.root, 'package-lock.json'), `not-json-${secret}`);
  assert.throws(() => applyPatch({ projectRoot: f.root }), error => !error.message.includes(secret) && error.message.includes('invalid JSON'));
  originalParsersRemain(f.root);
});

test('atomic replacement preserves parser mode independently of the process umask', t => {
  const f = fixture(t);
  const parser = join(f.root, paths[0], 'lib/parse.js');
  chmodSync(parser, 0o664);
  const before = lstatSync(parser).mode;
  applyPatch({ projectRoot: f.root });
  assert.equal(lstatSync(parser).mode, before);
});

for (const name of ['package-lock.json', 'node_modules/picomatch', 'node_modules/anymatch', 'node_modules/picomatch/lib', 'node_modules/picomatch/lib/parse.js', 'node_modules/picomatch/package.json', 'node_modules/picomatch/lib/utils.js']) {
  test(`symbolic link at ${name} cannot redirect patching`, t => {
    const f = fixture(t);
    const original = join(f.root, name);
    const outside = join(f.base, 'outside');
    renameSync(original, outside);
    symlinkSync(outside, original);
    assert.throws(() => applyPatch({ projectRoot: f.root }), /symbolic link|real directory/);
    const parser = name === 'node_modules/picomatch' ? join(outside, 'lib/parse.js') : name === 'node_modules/picomatch/lib' ? join(outside, 'parse.js') : null;
    if (parser) assert.equal(hash(readFileSync(parser)), PINNED_PACKAGES['4.0.7'].original);
  });
}

test('hard-linked parser and symlinked project roots are refused', t => {
  const f = fixture(t);
  linkSync(join(f.root, paths[0], 'lib/parse.js'), join(f.base, 'hardlink'));
  assert.throws(() => applyPatch({ projectRoot: f.root }), /unlinked regular file/);
  const alias = join(f.base, 'project-link'); symlinkSync(f.root, alias);
  assert.throws(() => applyPatch({ projectRoot: alias }), /real directory/);
  originalParsersRemain(f.root);
});

for (const change of ['hardlink', 'growth', 'directory']) {
  test(`a ${change} introduced immediately before open is rejected before reading`, t => {
    const f = fixture(t);
    const file = join(f.root, paths[0], 'lib/parse.js');
    const moved = join(f.base, 'original-parser');
    const reads = trackFileReads(t, file, () => {
      if (change === 'hardlink') linkSync(file, moved);
      else if (change === 'growth') fs.appendFileSync(file, ' '.repeat(256 * 1024));
      else { renameSync(file, moved); mkdirSync(file); }
    });
    assert.throws(() => applyPatch({ projectRoot: f.root }), /unlinked regular file|oversized file/);
    assert.equal(reads.bytes, 0);
    assert.equal(reads.closed, 1);
  });
}

test('growth after descriptor validation stays within the read budget and closes the file', t => {
  const f = fixture(t);
  const file = join(f.root, paths[0], 'lib/parse.js');
  const initialSize = lstatSync(file).size;
  const reads = trackFileReads(t, file);
  const originalStat = fs.fstatSync;
  let changed = false;
  mockFs(t, 'fstatSync', fd => {
    const stat = originalStat(fd);
    if (fd === reads.fd && !changed) {
      changed = true;
      fs.appendFileSync(file, ' '.repeat(512 * 1024));
    }
    return stat;
  });
  assert.throws(() => applyPatch({ projectRoot: f.root }), /changed while reading/);
  assert(reads.bytes <= initialSize + 1, `read ${reads.bytes} bytes beyond the validated file budget`);
  assert.equal(reads.closed, 1);
});

test('a path replaced after open cannot substitute another file for validation', t => {
  const f = fixture(t);
  const file = join(f.root, paths[0], 'lib/parse.js');
  const reads = trackFileReads(t, file);
  const originalStat = fs.fstatSync;
  let changed = false;
  mockFs(t, 'fstatSync', fd => {
    const stat = originalStat(fd);
    if (fd === reads.fd && !changed) {
      changed = true;
      renameSync(file, join(f.base, 'opened-parser'));
      writeFileSync(file, 'replacement must not be read');
    }
    return stat;
  });
  assert.throws(() => applyPatch({ projectRoot: f.root }), /file changed while opening/);
  assert.equal(reads.bytes, 0);
  assert.equal(reads.closed, 1);
});

test('a failed atomic rename leaves original bytes and no temporary package file', t => {
  const f = fixture(t);
  const code = `const fs=require('node:fs');const{syncBuiltinESMExports}=require('node:module');fs.renameSync=()=>{throw new Error('fixture rename denied')};syncBuiltinESMExports();import(process.argv[1]).then(m=>{try{m.applyPatch({projectRoot:process.argv[2]});process.exitCode=1}catch(e){if(!e.message.includes('fixture rename denied'))throw e}});`;
  const child = spawnSync(process.execPath, ['--max-old-space-size=64', '-e', code, new URL('./picomatch-security.mjs', import.meta.url).href, f.root], { encoding: 'utf8', timeout: 1500, killSignal: 'SIGKILL', env: { PATH: process.env.PATH ?? '' } });
  assert.equal(child.status, 0, child.stderr);
  originalParsersRemain(f.root);
  // A normal application can validate the complete exact inventory afterward.
  assert.equal(applyPatch({ projectRoot: f.root }).changed, true);
});

test('CLI applies/checks the fixture project and rejects unsupported arguments', t => {
  const f = fixture(t);
  mkdirSync(join(f.root, 'scripts'));
  const cli = join(f.root, 'scripts/picomatch-security.mjs'); copyFileSync(moduleFile, cli);
  const run = command => spawnSync(process.execPath, [cli, command], { encoding: 'utf8', timeout: 2500, killSignal: 'SIGKILL', env: { PATH: process.env.PATH ?? '' } });
  assert.equal(run('--check').status, 1);
  const applied = run('--apply'); assert.equal(applied.status, 0, applied.stderr);
  assert.equal(JSON.parse(applied.stdout).changed, true);
  const checked = run('--check'); assert.equal(checked.status, 0, checked.stderr);
  assert.equal(JSON.parse(checked.stdout).installations.length, 2);
  assert.equal(run('--unknown').status, 1);
});

test('importing from node -e accepts arbitrary non-file argv without running the CLI', () => {
  for (const arg of ['main-report', 'network', 'file:///not-a-cli']) {
    const child = spawnSync(process.execPath, ['-e', 'import(process.argv[2]).then(m=>{if(typeof m.assertSecureInstallations!=="function")process.exitCode=1})', arg, new URL('./picomatch-security.mjs', import.meta.url).href], { encoding: 'utf8', timeout: 600, killSignal: 'SIGKILL', env: { PATH: process.env.PATH ?? '' } });
    assert.equal(child.status, 0, child.stderr);
    assert.equal(child.stdout, '');
  }
});

test('all parser APIs retain ordinary globs while rejecting repeats regardless of options', t => {
  const f = fixture(t);
  applyPatch({ projectRoot: f.root });
  // assertSecureInstallations always starts new children, not a parent require cache.
  const first = assertSecureInstallations({ projectRoot: f.root });
  const second = assertSecureInstallations({ projectRoot: f.root });
  assert.equal(first.checks, second.checks);
  assert(first.checks > 600);
  assert.deepEqual(first.installations, second.installations);
});
