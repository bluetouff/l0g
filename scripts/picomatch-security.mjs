#!/usr/bin/env node
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash, randomUUID } from 'node:crypto';
import { closeSync, constants, fchmodSync, fstatSync, fsyncSync, lstatSync, openSync, opendirSync, readFileSync, realpathSync, renameSync, unlinkSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ADVISORY_URL = 'https://github.com/advisories/GHSA-fc5q-39xc-vjpf';
export const PATCH_ANCHOR = '  const extglobOpen = (type, value) => {\n';
export const REPEATED_EXTGLOB_ERROR = 'Repeated extglobs are disabled by the local security policy';
export const PATCH_GUARD = `    if (type === 'plus' || type === 'star') {
      throw new SyntaxError('${REPEATED_EXTGLOB_ERROR}');
    }
`;

// Original archives were fetched with npm pack --ignore-scripts. Their SHA-512
// integrity matches package-lock.json. Only the parser receives a local change.
// This policy disables repeated extglobs, including otherwise legitimate ones.
// It does not make picomatch's raw-regex APIs safe for arbitrary untrusted input.
export const PINNED_PACKAGES = Object.freeze({
  '4.0.7': Object.freeze({
    integrity: 'sha512-qcJu88Q2IWqJsDD529JKMdwGm/dvInW4HvQnRwiH9JtihJvzGOscDtHE3x1pBKeUOTysQ8kVmLnJ2kJu7yhcGA==',
    original: '4e1e05447668aa1e94366c5516a2bcd8f5fff800cc92b1d0cd7d77703b8618c4',
    patched: '04ca187b94355ab9c4a781cc8ee1a481a7e89337de436f4e7fa9314ce1110020',
    files: Object.freeze({
      LICENSE: 'd0cd141b0c322fded5dfad1d4645bb2fedfc05b7321fe1009469638190d59ef9',
      'README.md': 'a69b87120fe2b9cb8f9057eaef6b9f9887f803e02185ca2f431e8162f6312220',
      'index.js': '02ae26406508e28f9ba0865be16cf77f0b33de6c4d4d49c212c4176df1d5625a',
      'lib/constants.js': 'c28f952d2758261fe5428a121add485cc25b03e0193633f649de903dc0e5e222',
      'lib/parse.js': '4e1e05447668aa1e94366c5516a2bcd8f5fff800cc92b1d0cd7d77703b8618c4',
      'lib/picomatch.js': 'fdd249d7ffff853f3bb1c77eafc8baa1a437bea85a94c35877b83c6a40d9ca94',
      'lib/scan.js': '6457a1764e5c2e543cc3a0c00ce12ebb3764097628868198370b64d4e642aaae',
      'lib/utils.js': 'f04604f70cd1a3f6ace80b84766468674ff38b4bb83818d2ef1d81fc6355f935',
      'package.json': '479b70b87aa7b44344d62c8a459ae7e53dd2bca6c61f1396bd55e63e9de73fc6',
      'posix.js': '5695ff5dfcd5a338a40630bd506056f2950bcb08fe1cc068519cbbfe60add480',
    }),
  }),
  '2.3.2': Object.freeze({
    integrity: 'sha512-V7+vQEJ06Z+c5tSye8S+nHUfI51xoXIXjHQ99cQtKUkQqqO1kO/KCJUfZXuB47h/YBlDhah2H3hdUGXn8ie0oA==',
    original: '3a91656f440069aa8f8e15c9d695b9f6b2209df1eab2be8127c72cbcca45ff5f',
    patched: '9740607a55e559f2df25a11423542f5f00a93098201973ad602872228a7e04ca',
    files: Object.freeze({
      LICENSE: 'd0cd141b0c322fded5dfad1d4645bb2fedfc05b7321fe1009469638190d59ef9',
      'README.md': 'f4653b68a1883a32f852083c1b93381ce87f44c6855ce1f01854d39d0563c98c',
      'index.js': '5695ff5dfcd5a338a40630bd506056f2950bcb08fe1cc068519cbbfe60add480',
      'lib/constants.js': '980225ab847a88a784f6d315557b8434f7742b2551ce20e354455c61b938c0a5',
      'lib/parse.js': '3a91656f440069aa8f8e15c9d695b9f6b2209df1eab2be8127c72cbcca45ff5f',
      'lib/picomatch.js': '2cb169cbe17d356036c5f62a377318b85e30817877e59797842aec9d8b15f54b',
      'lib/scan.js': '227fcc994a477ea95c5a0435d32783566334c6bd0dcc4a103029735ad8c9c535',
      'lib/utils.js': '809fc29cf35ab0aa76b99cad29182f62c0ae598902481d10f9868eaef71981ee',
      'package.json': '63264d817e856a4bff57d4304f2b38d2964a4f6df520eb169e7bcdb619f13e9a',
    }),
  }),
});

const DEFAULT_ROOT = fileURLToPath(new URL('../', import.meta.url));
const MAX_ENTRIES = 20_000;
const MAX_METADATA_BYTES = 32 * 1024 * 1024;
const MAX_FILE_BYTES = 256 * 1024;
const sha256 = value => createHash('sha256').update(value).digest('hex');
const fail = message => { throw new Error(`picomatch: ${message}`); };
const record = value => value !== null && typeof value === 'object' && !Array.isArray(value);

function parseJson(bytes, label) {
  try { return JSON.parse(bytes.toString('utf8')); }
  catch { fail(`invalid JSON in ${label}`); }
}

function canonicalRoot(projectRoot) {
  assert.equal(typeof projectRoot, 'string', 'picomatch: projectRoot must be a path');
  const root = resolve(projectRoot);
  assert(lstatSync(root).isDirectory(), 'picomatch: project root must be a real directory');
  // Canonicalize the trusted base (including macOS /tmp); no links underneath it.
  return realpathSync(root);
}

function safePath(root, name, directory = false) {
  assert.equal(typeof name, 'string');
  const parts = name.split('/');
  assert(parts.length && parts.every(p => p && p !== '.' && p !== '..' && !/[\\\s\u0000-\u001f\u007f]/u.test(p)), 'picomatch: unsafe relative path');
  let current = root;
  for (const [index, part] of parts.entries()) {
    current = join(current, part);
    const stat = lstatSync(current);
    assert(!stat.isSymbolicLink(), `picomatch: symbolic link refused: ${name}`);
    assert.equal(realpathSync(current), current, `picomatch: path escape refused: ${name}`);
    if (index < parts.length - 1 || directory) assert(stat.isDirectory(), `picomatch: expected directory: ${name}`);
  }
  assert(!relative(root, current).startsWith(`..${sep}`), 'picomatch: path escapes project');
  return current;
}

function readRegular(root, name, limit = MAX_FILE_BYTES) {
  const file = safePath(root, name);
  const before = lstatSync(file);
  assert(before.isFile() && before.nlink === 1, `picomatch: expected an unlinked regular file: ${name}`);
  assert(before.size <= limit, `picomatch: oversized file: ${name}`);
  const fd = openSync(file, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
  try {
    const stat = fstatSync(fd);
    assert(stat.isFile() && stat.dev === before.dev && stat.ino === before.ino, 'picomatch: file changed while opening');
    const bytes = readFileSync(fd);
    assert(bytes.length <= limit && bytes.length === stat.size, 'picomatch: file size changed while reading');
    return bytes;
  } finally { closeSync(fd); }
}

function directoryNames(root, name, budget) {
  const dir = opendirSync(safePath(root, name, true));
  const names = [];
  try {
    let entry;
    while ((entry = dir.readSync())) {
      assert(++budget.entries <= MAX_ENTRIES, 'picomatch: directory inventory exceeds safety limit');
      names.push(entry.name);
    }
  } finally { dir.closeSync(); }
  return names.sort();
}

function lockInventory(root) {
  const bytes = readRegular(root, 'package-lock.json', 8 * 1024 * 1024);
  const lock = parseJson(bytes, 'main lockfile');
  assert(lock.lockfileVersion === 3 && record(lock.packages), 'picomatch: unsupported main lockfile');
  const packages = Object.entries(lock.packages);
  assert(packages.length <= MAX_ENTRIES, 'picomatch: lock inventory exceeds safety limit');
  const entries = [];
  for (const [relativePath, entry] of packages) {
    if (!record(entry)) fail('invalid lock package metadata');
    const candidate = relativePath.split(/[\\/]/u).at(-1) === 'picomatch' || entry.name === 'picomatch' || /\/picomatch\/-\/picomatch-/u.test(entry.resolved ?? '');
    if (!candidate) continue;
    assert(!/[\s\u0000-\u001f\u007f]/u.test(relativePath) && /^(?:node_modules\/(?:@[a-z\d._-]+\/)?[a-z\d][a-z\d._-]*\/)*node_modules\/picomatch$/iu.test(relativePath), 'picomatch: unsafe or aliased lock installation path');
    assert(Object.hasOwn(PINNED_PACKAGES, entry.version), 'picomatch: unsupported version; review the local mitigation');
    const pinned = PINNED_PACKAGES[entry.version];
    assert(!entry.link && !entry.inBundle && (entry.name === undefined || entry.name === 'picomatch'), 'picomatch: linked or aliased lock installation refused');
    assert(entry.resolved === `https://registry.npmjs.org/picomatch/-/picomatch-${entry.version}.tgz`, 'picomatch: unexpected registry origin');
    assert(entry.integrity === pinned.integrity, 'picomatch: unexpected registry integrity');
    entries.push({ relativePath, version: entry.version });
  }
  assert(entries.length > 0, 'picomatch: no installation in the main lockfile');
  return { entries: entries.sort((a, b) => a.relativePath.localeCompare(b.relativePath)), lockHash: sha256(bytes) };
}

function diskInventory(root) {
  const found = [];
  const budget = { entries: 0, metadata: 0 };
  const exists = name => { try { lstatSync(join(root, name)); return true; } catch (error) { if (error.code === 'ENOENT') return false; throw error; } };
  const visitPackage = name => {
    safePath(root, name, true);
    let identity;
    if (exists(`${name}/package.json`)) {
      const bytes = readRegular(root, `${name}/package.json`);
      budget.metadata += bytes.length;
      assert(budget.metadata <= MAX_METADATA_BYTES, 'picomatch: metadata inventory exceeds safety limit');
      const metadata = parseJson(bytes, 'installed package metadata');
      assert(record(metadata), 'picomatch: invalid installed package metadata');
      identity = metadata.name;
    }
    if (basename(name) === 'picomatch' || identity === 'picomatch') found.push(name);
    if (exists(`${name}/node_modules`)) visitModules(`${name}/node_modules`);
  };
  const visitModules = name => {
    for (const part of directoryNames(root, name, budget)) {
      if (part.startsWith('.')) continue; // npm's .bin links and cache directories are not packages.
      const child = `${name}/${part}`;
      if (part.startsWith('@')) {
        for (const pkg of directoryNames(root, child, budget)) visitPackage(`${child}/${pkg}`);
      } else visitPackage(child);
    }
  };
  visitModules('node_modules');
  return found.sort();
}

function readInstallation(root, entry, { allowOriginal = false, temporaryName } = {}) {
  const pinned = PINNED_PACKAGES[entry.version];
  safePath(root, entry.relativePath, true);
  const files = Object.keys(pinned.files);
  if (temporaryName) files.push(`lib/${temporaryName}`);
  const bytes = new Map();
  const budget = { entries: 0 };
  const inspect = prefix => {
    const expected = [...new Set(files.filter(f => f.startsWith(prefix)).map(f => f.slice(prefix.length).split('/')[0]))].sort();
    const actual = directoryNames(root, `${entry.relativePath}${prefix ? `/${prefix.slice(0, -1)}` : ''}`, budget);
    assert.deepEqual(actual, expected, `picomatch: unexpected or missing package files: ${entry.relativePath}/${prefix}`);
    for (const name of expected) {
      const local = prefix + name;
      if (files.some(f => f.startsWith(`${local}/`))) { inspect(`${local}/`); continue; }
      const data = readRegular(root, `${entry.relativePath}/${local}`);
      const digest = sha256(data);
      if (local === 'lib/parse.js') {
        assert(digest === pinned.patched || (allowOriginal && digest === pinned.original), `picomatch: exact security patch missing or parser modified: ${entry.relativePath}`);
      } else {
        assert.equal(digest, local === `lib/${temporaryName}` ? pinned.patched : pinned.files[local], `picomatch: package file hash mismatch: ${entry.relativePath}/${local}`);
      }
      bytes.set(local, data);
    }
  };
  inspect('');
  const metadata = parseJson(bytes.get('package.json'), 'picomatch package metadata');
  assert.equal(metadata.name, 'picomatch', 'picomatch: unexpected package identity');
  assert.equal(metadata.version, entry.version, 'picomatch: lock and installed versions differ');
  assert.equal(metadata.main, 'index.js', 'picomatch: unexpected entrypoint');
  return { ...entry, sha256: sha256(bytes.get('lib/parse.js')), source: bytes.get('lib/parse.js').toString('utf8') };
}

function inventory(projectRoot, allowOriginal) {
  const root = canonicalRoot(projectRoot);
  const { entries, lockHash } = lockInventory(root);
  assert.deepEqual(diskInventory(root), entries.map(e => e.relativePath).sort(), 'picomatch: missing, aliased or unlisted installed copy');
  // Validate every copy and its complete runtime graph before the first write.
  const installations = entries.map(e => readInstallation(root, e, { allowOriginal }));
  return { root, entries, lockHash, installations };
}

function behaviorWorker() {
  const assert = require('node:assert/strict');
  const fs = require('node:fs');
  const crypto = require('node:crypto');
  const path = require('node:path');
  const [root, rawPinned, message] = process.argv.slice(1);
  const pinned = JSON.parse(rawPinned);
  for (const [name, expected] of Object.entries(pinned.files)) {
    const actual = crypto.createHash('sha256').update(fs.readFileSync(path.join(root, name))).digest('hex');
    assert.equal(actual, name === 'lib/parse.js' ? pinned.patched : expected, 'fresh worker requires exact package bytes');
  }
  const pm = require(root);
  const direct = require(path.join(root, 'lib/picomatch.js'));
  const parse = require(path.join(root, 'lib/parse.js'));
  const apis = [p => pm(p), p => pm.makeRe(p), p => pm.parse(p), p => parse(p), p => direct(p),
    p => direct.makeRe(p), p => pm.isMatch('fixture.js', p), p => pm.matchBase('fixture.js', p),
    p => pm([p, '*.js']), p => pm.parse([p]), p => pm.makeRe(p, { fastpaths: true }),
    p => pm.makeRe(p, { fastpaths: false }), p => pm.makeRe(p, { capture: true, windows: true }),
    p => pm.makeRe(p, { maxExtglobRecursion: false }), p => pm.makeRe(p, { noext: false, noextglob: true })];
  if (Object.hasOwn(pinned.files, 'posix.js')) {
    const posix = require(path.join(root, 'posix.js'));
    apis.push(p => posix(p), p => posix.makeRe(p), p => posix.parse(p));
  }
  const patterns = ['+(*)', '+(*a)', '*(*)', '*(*a)', '+(a*)!', '+(a+)!', '**/+(*a)',
    'x/{a,b}/+(*a)', '@(+(*a)|b)', '?(*(*a))', '!(*(*a))', '+(a|b)', '*(a|b)'];
  const NativeRegExp = global.RegExp;
  let calls = 0;
  let checks = 0;
  global.RegExp = new Proxy(NativeRegExp, {
    construct(target, args, receiver) { calls++; return Reflect.construct(target, args, receiver); },
    apply(target, receiver, args) { calls++; return Reflect.apply(target, receiver, args); },
  });
  try {
    for (const pattern of patterns) {
      for (const api of apis) {
        calls = 0;
        assert.throws(() => api(pattern), e => e instanceof SyntaxError && e.message === message);
        assert.equal(calls, 0, 'repeated extglob must fail before regex construction');
        checks += 2;
      }
      assert.equal(parse.fastpaths(pattern), undefined);
      assert.throws(() => pm('*.js', { ignore: pattern }), e => e instanceof SyntaxError && e.message === message);
      checks += 2;
    }
  } finally { global.RegExp = NativeRegExp; }
  const controls = [
    ['**/*.mdx', 'src/a.mdx', true], ['src/**/*.{astro,mdx}', 'src/a.astro', true],
    ['{a,b}.{js,ts}', 'b.ts', true], ['@(a|b)', 'b', true], ['?(ab)', 'ab', true],
    ['!(ab)', 'cd', true], ['a?b', 'acb', true], ['[[:alpha:]]', 'a', true],
    ['"+(*a)"', '+(*a)', true], ['\\+(*a)', '+a', true], ['*.js', 'a.md', false],
  ];
  for (const [pattern, input, expected] of controls) {
    assert.equal(pm(pattern)(input), expected, `ordinary glob changed: ${pattern}`);
    assert.equal(pm.makeRe(pattern).test(input), expected);
    checks += 2;
  }
  for (const options of [{ noext: true }, { noextglob: true }]) {
    assert.equal(pm.makeRe('+(*a)', options).test('+a'), true);
    checks++;
  }
  assert.throws(() => pm.makeRe('*.mdx', { maxLength: 2 }), SyntaxError);
  assert.equal(pm.compileRe(pm.parse('*.mdx')).test('a.mdx'), true);
  assert.equal(pm.toRegex('a+').test('aaa'), true);
  console.log(JSON.stringify({ checks: checks + 3 }));
}

function verifyBehavior(root, installation) {
  const child = spawnSync(process.execPath, ['--max-old-space-size=64', '-e', `(${behaviorWorker.toString()})()`,
    join(root, installation.relativePath), JSON.stringify(PINNED_PACKAGES[installation.version]), REPEATED_EXTGLOB_ERROR], {
    cwd: root, encoding: 'utf8', timeout: 2000, killSignal: 'SIGKILL', maxBuffer: 64 * 1024,
    env: { PATH: process.env.PATH ?? '', NODE_ENV: 'test' },
  });
  assert(!child.error && child.status === 0, `picomatch: bounded fresh-process verification failed for ${installation.relativePath}: ${child.error?.code ?? child.signal ?? child.stderr.slice(0, 500)}`);
  const result = JSON.parse(child.stdout);
  assert(Number.isInteger(result.checks) && result.checks > 300, 'picomatch: incomplete behavior evidence');
  return result.checks;
}

export function assertSecureInstallations({ projectRoot = DEFAULT_ROOT } = {}) {
  const state = inventory(projectRoot, false);
  let checks = 0;
  for (const installation of state.installations) checks += verifyBehavior(state.root, installation);
  const final = inventory(state.root, false);
  assert.equal(final.lockHash, state.lockHash, 'picomatch: main lock changed during verification');
  return {
    advisory: ADVISORY_URL,
    installations: final.installations.map(({ relativePath, version, sha256 }) => ({ relativePath, version, sha256 })),
    checks,
  };
}

export function applyPatch({ projectRoot = DEFAULT_ROOT } = {}) {
  const state = inventory(projectRoot, true);
  let changed = false;
  for (const installation of state.installations) {
    const pinned = PINNED_PACKAGES[installation.version];
    if (installation.sha256 === pinned.patched) continue;
    assert.equal(installation.source.split(PATCH_ANCHOR).length, 2, 'picomatch: patch anchor is not unique');
    const patched = installation.source.replace(PATCH_ANCHOR, PATCH_ANCHOR + PATCH_GUARD);
    assert.equal(sha256(patched), pinned.patched, 'picomatch: unexpected patched source hash');
    const parserName = `${installation.relativePath}/lib/parse.js`;
    const parser = safePath(state.root, parserName);
    const temporaryName = `.parse.js-security-${randomUUID()}.tmp`;
    const temporary = join(dirname(parser), temporaryName);
    let fd;
    try {
      fd = openSync(temporary, 'wx', lstatSync(parser).mode & 0o777);
      fchmodSync(fd, lstatSync(parser).mode & 0o777);
      writeFileSync(fd, patched, 'utf8');
      fsyncSync(fd);
      closeSync(fd);
      fd = undefined;
      assert.equal(lockInventory(state.root).lockHash, state.lockHash, 'picomatch: main lock changed during patching');
      const current = readInstallation(state.root, installation, { allowOriginal: true, temporaryName });
      assert.equal(current.sha256, installation.sha256, 'picomatch: source changed during patching');
      safePath(state.root, `${installation.relativePath}/lib`, true);
      renameSync(temporary, parser);
      changed = true;
    } finally {
      if (fd !== undefined) closeSync(fd);
      try { unlinkSync(temporary); } catch (error) { if (error.code !== 'ENOENT') throw error; }
    }
  }
  // Re-enumeration refuses a partial installation or an unexpected added copy.
  return { ...assertSecureInstallations({ projectRoot: state.root }), changed };
}

function invokedAsCli() {
  if (!process.argv[1]) return false;
  try { return realpathSync(resolve(process.argv[1])) === realpathSync(fileURLToPath(import.meta.url)); }
  catch { return false; } // Imports from node -e can have arbitrary, non-file argv.
}

if (invokedAsCli()) {
  try {
    assert(process.argv.length === 3 && ['--apply', '--check'].includes(process.argv[2]), 'Usage: node scripts/picomatch-security.mjs --apply|--check');
    const evidence = process.argv[2] === '--apply' ? applyPatch() : assertSecureInstallations();
    console.log(JSON.stringify(evidence));
  } catch (error) {
    console.error(`[picomatch-security] ${error.message}`);
    process.exitCode = 1;
  }
}
