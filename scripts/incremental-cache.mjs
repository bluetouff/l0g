import { createHash, randomUUID } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const INCREMENTAL_CACHE_DIRECTORY = '.cache/astro-incremental';
const MANIFEST = 'incremental-build.json';
const RECEIPT = 'l0g-integrity.json';
const VERSION = 1;
const LIMITS = Object.freeze({ files: 20_000, fileBytes: 32 * 1024 * 1024, totalBytes: 1024 * 1024 * 1024, jsonBytes: 16 * 1024 * 1024 });
const HEX = /^[a-f0-9]{64}$/u;
const ownObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const fail = (message) => { throw new Error(`Incremental cache: ${message}`); };
const requireCondition = (value, message) => { if (!value) fail(message); };
const exactKeys = (value, keys) => ownObject(value) && JSON.stringify(Object.keys(value).sort()) === JSON.stringify([...keys].sort());

function cachePath(root) {
  root = fs.realpathSync(root);
  const parent = path.join(root, '.cache');
  try {
    const stat = fs.lstatSync(parent);
    // Refuse an unsafe ancestor: clearing it could affect other caches or files.
    requireCondition(stat.isDirectory() && !stat.isSymbolicLink(), 'unsafe .cache parent');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  return path.join(root, INCREMENTAL_CACHE_DIRECTORY);
}

function ordinaryBytes(file, maximum) {
  const descriptor = fs.openSync(file, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW | fs.constants.O_NONBLOCK);
  try {
    const before = fs.fstatSync(descriptor);
    requireCondition(before.isFile() && before.nlink === 1 && before.size <= maximum, 'non-ordinary or oversized cache file');
    const bytes = Buffer.alloc(before.size + 1);
    let length = 0;
    while (length < bytes.length) {
      const count = fs.readSync(descriptor, bytes, length, bytes.length - length, null);
      if (count === 0) break;
      length += count;
    }
    const after = fs.fstatSync(descriptor);
    requireCondition(length === before.size && after.size === before.size && after.mtimeMs === before.mtimeMs, 'cache file changed while reading');
    return bytes.subarray(0, length);
  } finally { fs.closeSync(descriptor); }
}

function jsonFile(file) {
  return JSON.parse(ordinaryBytes(file, LIMITS.jsonBytes).toString('utf8'));
}

function relativeName(value) {
  requireCondition(typeof value === 'string' && value.length > 0 && value.length < 2048
    && !/[\\\u0000-\u001f\u007f?#]/u.test(value) && !path.isAbsolute(value)
    && value.split('/').every((part) => part && part !== '.' && part !== '..'), 'unsafe relative cache path');
  return value;
}

function outputName(value) {
  relativeName(value);
  // Native Astro stores URI-encoded names. Validate the decoded name too before
  // Astro can use outputFile for pruning previous entries.
  const decoded = decodeURIComponent(value);
  relativeName(decoded);
  requireCondition(!decoded.split('/').some((part) => part.includes(':')), 'unsafe cache output URL');
  return `dist/${decoded}`;
}

function safeJson(value, depth = 0) {
  requireCondition(depth <= 24, 'cache JSON nesting exceeds budget');
  if (Array.isArray(value)) {
    requireCondition(value.length <= LIMITS.files, 'cache JSON array exceeds budget');
    value.forEach((entry) => safeJson(entry, depth + 1));
  } else if (ownObject(value)) {
    for (const [key, entry] of Object.entries(value)) {
      requireCondition(!['__proto__', 'prototype', 'constructor'].includes(key), 'unsafe cache object key');
      safeJson(entry, depth + 1);
    }
  } else requireCondition(value === null || ['string', 'number', 'boolean'].includes(typeof value), 'invalid cache JSON value');
}

export function validateNativeManifest(manifest) {
  safeJson(manifest);
  requireCondition(exactKeys(manifest, ['version', 'configHash', 'lockfileHash', 'keyDigest', 'routes']) && manifest.version === 1,
    'unsupported native cache manifest');
  for (const key of ['configHash', 'lockfileHash', 'keyDigest']) requireCondition(HEX.test(manifest[key]), 'invalid native cache hash');
  requireCondition(ownObject(manifest.routes), 'invalid native routes');
  const outputs = new Set([MANIFEST]);
  let paths = 0;
  for (const [component, route] of Object.entries(manifest.routes)) {
    relativeName(component);
    requireCondition(exactKeys(route, ['dependencyHash', 'paths']) && HEX.test(route.dependencyHash) && ownObject(route.paths), 'invalid native route');
    for (const [pathname, entry] of Object.entries(route.paths)) {
      requireCondition(++paths <= LIMITS.files && typeof pathname === 'string' && pathname.startsWith('/') && !pathname.startsWith('//')
        && !/[\\\u0000-\u001f\u007f]/u.test(pathname), 'invalid native pathname');
      const allowed = ['cacheKey', 'outputFile', 'contentHashes', 'staticImages', 'referencedImages', 'headers'];
      requireCondition(ownObject(entry) && Object.keys(entry).every((key) => allowed.includes(key))
        && (typeof entry.cacheKey === 'string' || typeof entry.cacheKey === 'number') && String(entry.cacheKey).length <= 8192, 'invalid native path entry');
      const output = outputName(entry.outputFile);
      requireCondition(!outputs.has(output), 'duplicate native output');
      outputs.add(output);
      if (entry.contentHashes !== undefined) {
        requireCondition(ownObject(entry.contentHashes), 'invalid content hashes');
        for (const [name, hash] of Object.entries(entry.contentHashes)) {
          relativeName(name);
          requireCondition(HEX.test(hash), 'invalid content-entry hash');
        }
      }
      for (const name of ['staticImages', 'referencedImages', 'headers']) {
        if (entry[name] !== undefined) requireCondition(Array.isArray(entry[name]), `invalid native ${name}`);
      }
    }
  }
  return outputs;
}

function inventory(directory, expected, staleFiles) {
  const files = {};
  let total = 0;
  let entries = 0;
  let fileCount = 0;
  const visit = (name) => {
    requireCondition(++entries <= LIMITS.files * 2, 'cache directory count exceeds budget');
    relativeName(name);
    const file = path.join(directory, name);
    const stat = fs.lstatSync(file);
    requireCondition(!stat.isSymbolicLink(), 'symlink in cache payload');
    if (stat.isDirectory()) {
      const children = fs.readdirSync(file).sort();
      requireCondition(children.length <= LIMITS.files, 'cache directory exceeds budget');
      for (const child of children) visit(`${name}/${child}`);
      return;
    }
    requireCondition(++fileCount <= LIMITS.files, 'cache file count exceeds budget');
    const retained = expected.has(name);
    requireCondition(retained || (staleFiles && name.startsWith('dist/')), 'unexpected cache payload file');
    const bytes = ordinaryBytes(file, name === MANIFEST ? LIMITS.jsonBytes : LIMITS.fileBytes);
    total += bytes.length;
    requireCondition(total <= LIMITS.totalBytes, 'cache payload exceeds budget');
    if (retained) files[name] = { bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') };
    else staleFiles.push(name);
  };
  visit(MANIFEST);
  try { visit('dist'); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  requireCondition(Object.keys(files).length === expected.size && [...expected].every((name) => Object.hasOwn(files, name)), 'missing cache payload file');
  return files;
}

function runtimeIdentity(root) {
  const astro = JSON.parse(ordinaryBytes(path.join(root, 'node_modules/astro/package.json'), 128 * 1024).toString('utf8'));
  requireCondition(typeof astro.version === 'string' && /^\d+\.\d+\.\d+(?:[-+][\w.-]+)?$/u.test(astro.version), 'invalid Astro identity');
  // Some native templates format historical dates in the host locale/timezone.
  // A cache restored across hosts must invalidate those differences as well.
  return { astro: astro.version, node: process.versions.node, platform: process.platform, arch: process.arch,
    locale: Intl.DateTimeFormat().resolvedOptions() };
}

function producer(environment) {
  if (environment.GITHUB_ACTIONS !== 'true') return { kind: 'local' };
  requireCondition(environment.GITHUB_REPOSITORY === 'bluetouff/l0g' && environment.GITHUB_REF === 'refs/heads/main'
    && /^[a-f0-9]{40}$/u.test(environment.GITHUB_SHA || '') && /^[1-9]\d*$/u.test(environment.GITHUB_RUN_ID || '')
    && /^[1-9]\d*$/u.test(environment.GITHUB_RUN_ATTEMPT || ''), 'only canonical main can seal a CI cache');
  return { kind: 'github', repository: environment.GITHUB_REPOSITORY, ref: environment.GITHUB_REF,
    sha: environment.GITHUB_SHA, run: environment.GITHUB_RUN_ID, attempt: environment.GITHUB_RUN_ATTEMPT };
}

function validateProducer(value, environment) {
  if (environment.GITHUB_ACTIONS !== 'true' && exactKeys(value, ['kind']) && value.kind === 'local') return;
  requireCondition(exactKeys(value, ['kind', 'repository', 'ref', 'sha', 'run', 'attempt']) && value.kind === 'github'
    && value.repository === 'bluetouff/l0g' && value.ref === 'refs/heads/main' && /^[a-f0-9]{40}$/u.test(value.sha)
    && [value.sha, value.run, value.attempt].every((item) => typeof item === 'string')
    && /^[1-9]\d*$/u.test(value.run) && /^[1-9]\d*$/u.test(value.attempt), 'untrusted cache producer');
}

function reset(directory) {
  // directory is a fixed path beneath the verified .cache parent. rm unlinks a
  // symlink itself and never follows one into its target.
  fs.rmSync(directory, { recursive: true, force: true });
}

function exists(directory) {
  try { fs.lstatSync(directory); return true; } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

/** Optional acceleration only: malformed, missing or modified data means cold rendering. */
export function prepareIncrementalCache({ root, environment = process.env, log = console.log }) {
  const directory = cachePath(root);
  if (!exists(directory)) return { state: 'cold', reason: 'absent' };
  try {
    requireCondition(fs.lstatSync(directory).isDirectory() && !fs.lstatSync(directory).isSymbolicLink(), 'unsafe cache directory');
    const receipt = jsonFile(path.join(directory, RECEIPT));
    requireCondition(exactKeys(receipt, ['version', 'runtime', 'producer', 'files']) && receipt.version === VERSION, 'unsupported integrity receipt');
    requireCondition(JSON.stringify(receipt.runtime) === JSON.stringify(runtimeIdentity(root)), 'runtime changed');
    validateProducer(receipt.producer, environment);
    const expected = validateNativeManifest(jsonFile(path.join(directory, MANIFEST)));
    const files = inventory(directory, expected);
    requireCondition(JSON.stringify(receipt.files) === JSON.stringify(files), 'cache payload integrity mismatch');
    log(`[incremental] verified ${expected.size - 1} cached outputs`);
    return { state: 'warm', files: expected.size - 1 };
  } catch (error) {
    reset(directory);
    log(`[incremental] cold build: ${error.message}`);
    return { state: 'cold', reason: error.message };
  }
}

/** Called only after checks succeed. Hashes detect corruption, not authorship;
 * GitHub's main-only cache writer and branch isolation supply the CI trust boundary.
 */
export function sealIncrementalCache({ root, environment = process.env, log = console.log }) {
  const directory = cachePath(root);
  const identity = producer(environment); // Refuse PR cache writes even with no payload.
  if (!exists(directory)) return { state: 'absent' };
  requireCondition(fs.lstatSync(directory).isDirectory() && !fs.lstatSync(directory).isSymbolicLink(), 'unsafe cache directory');
  const expected = validateNativeManifest(jsonFile(path.join(directory, MANIFEST)));
  // Astro may leave old private HTML behind after --force or a route losing its
  // cache key. Validate the entire payload before removing ordinary stale files.
  // prepare() never permits extras on a restored cache.
  const staleFiles = [];
  let files = inventory(directory, expected, staleFiles);
  for (const name of staleFiles) fs.unlinkSync(path.join(directory, name));
  if (staleFiles.length) files = inventory(directory, expected);
  const receipt = { version: VERSION, runtime: runtimeIdentity(root), producer: identity, files };
  const bytes = JSON.stringify(receipt);
  requireCondition(Buffer.byteLength(bytes) <= LIMITS.jsonBytes, 'integrity receipt exceeds budget');
  const temporary = path.join(directory, `${RECEIPT}.${randomUUID()}.tmp`);
  try {
    fs.writeFileSync(temporary, bytes, { flag: 'wx', mode: 0o600 });
    fs.renameSync(temporary, path.join(directory, RECEIPT));
  } finally { fs.rmSync(temporary, { force: true }); }
  log(`[incremental] sealed ${expected.size - 1} cached outputs`);
  return { state: 'sealed', files: expected.size - 1 };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const [command, ...extra] = process.argv.slice(2);
  if (extra.length || !['prepare', 'seal'].includes(command)) fail('Usage: node scripts/incremental-cache.mjs prepare|seal');
  const root = fileURLToPath(new URL('../', import.meta.url));
  if (command === 'prepare') prepareIncrementalCache({ root });
  else if (process.env.GITHUB_ACTIONS === 'true' && (process.env.GITHUB_REPOSITORY !== 'bluetouff/l0g' || process.env.GITHUB_REF !== 'refs/heads/main')) {
    console.log('[incremental] read-only CI cache: sealing skipped');
  }
  else sealIncrementalCache({ root });
}
