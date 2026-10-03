import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, symlinkSync, unlinkSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import {
  ADVISORY_URL, ORIGINAL_SHA256, PACKAGE_NAME, PATCHED_SHA256, PATCH_INSERTION,
  applyPatch, assertPatchedInstalled, assertSecureBehavior, qualifiesPatchedAdvisory,
} from './http-cache-security.mjs';

const hash = (source) => createHash('sha256').update(source).digest('hex');
const installedRoot = fileURLToPath(new URL('../node_modules/http-cache-semantics/', import.meta.url));
const installedSource = readFileSync(join(installedRoot, 'index.js'), 'utf8');
// npm ci runs postinstall before tests. Recover the immutable original only for
// private fixtures; no test writes to the real installed dependency.
const original = hash(installedSource) === ORIGINAL_SHA256
  ? installedSource
  : installedSource.replace(PATCH_INSERTION, '');
assert.equal(hash(original), ORIGINAL_SHA256, 'test fixtures require the exact original or locally patched package');
const metadata = { name: PACKAGE_NAME, version: '4.2.0', main: 'index.js' };
const advisory = { packageName: PACKAGE_NAME, severity: 'high', url: ADVISORY_URL };
const requireFixture = createRequire(import.meta.url);

function fixture(t, { patched = false } = {}) {
  const root = realpathSync(mkdtempSync(join(tmpdir(), 'l0g-http-cache-security-')));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const packageRoot = join(root, 'node_modules', PACKAGE_NAME);
  mkdirSync(packageRoot, { recursive: true });
  writeFileSync(join(packageRoot, 'package.json'), JSON.stringify(metadata));
  writeFileSync(join(packageRoot, 'index.js'), original);
  if (patched) applyPatch({ packageRoot });
  return { root, packageRoot };
}

function load(packageRoot) {
  const entrypoint = join(packageRoot, 'index.js');
  delete requireFixture.cache[requireFixture.resolve(entrypoint)];
  return requireFixture(entrypoint);
}

function policyAt(CachePolicy, responseHeaders, { requestHeaders = {}, shared = true, age = 70 } = {}) {
  let clock = Date.UTC(2026, 0, 1);
  class TimedPolicy extends CachePolicy { now() { return clock; } }
  const origin = { url: 'https://cache-fixture.invalid/account', method: 'GET', headers: { host: 'cache-fixture.invalid', cookie: 'session=fixture-alice', ...requestHeaders } };
  const policy = new TimedPolicy(origin, { status: 200, headers: { date: new Date(clock).toUTCString(), ...responseHeaders } }, { shared });
  clock += age * 1000;
  return { policy, restore: () => TimedPolicy.fromObject(JSON.parse(JSON.stringify(policy.toObject()))) };
}

function incoming(directive) {
  return { url: 'https://cache-fixture.invalid/account', method: 'GET', headers: { host: 'cache-fixture.invalid', ...(directive === undefined ? {} : { 'cache-control': directive }) } };
}

function assertDenied(policy, request, label) {
  const result = policy.evaluateRequest(request);
  assert.equal(result.response, undefined, `${label}: no cached response may be reused`);
  assert.equal(result.revalidation?.synchronous, true, `${label}: origin validation is required`);
  assert.equal(policy.satisfiesWithoutRevalidation(request), false, `${label}: legacy API must also reject reuse`);
}

function assertAllowed(policy, request, label) {
  assert(policy.evaluateRequest(request).response, `${label}: cached response must remain available`);
  assert.equal(policy.evaluateRequest(request).revalidation, undefined, `${label}: origin validation is unnecessary`);
  assert.equal(policy.satisfiesWithoutRevalidation(request), true, `${label}: legacy API must preserve ordinary reuse`);
}

test('the real installed dependency has the exact patch and passes bounded cache-reuse checks', () => {
  assert.equal(assertPatchedInstalled().sha256, PATCHED_SHA256);
  assert(assertSecureBehavior().checks >= 100);
  assert.equal(qualifiesPatchedAdvisory(advisory), true);
});

test('the unpatched fixture reproduces cross-user reuse and cannot qualify an advisory', (t) => {
  const { packageRoot } = fixture(t);
  const { policy } = policyAt(load(packageRoot), { 'cache-control': 'max-age=3600', 'set-cookie': 'session=fixture-alice' });
  assert.equal(policy.maxAge(), 0);
  assertAllowed(policy, incoming('max-stale=100000'), 'original vulnerable response');
  assert.throws(() => assertPatchedInstalled({ packageRoot }), /patch missing or modified/);
  assert.throws(() => qualifiesPatchedAdvisory(advisory, { packageRoot }), /patch missing or modified/);
});

test('patching is deterministic and idempotent without changing freshness calculations', (t) => {
  const { packageRoot } = fixture(t);
  const OriginalPolicy = load(packageRoot);
  const originalMaxAge = policyAt(OriginalPolicy, { 'cache-control': 'public, max-age=60' }).policy.maxAge();
  assert.equal(applyPatch({ packageRoot }).changed, true);
  const bytes = readFileSync(join(packageRoot, 'index.js'));
  assert.equal(hash(bytes), PATCHED_SHA256);
  assert.equal(applyPatch({ packageRoot }).changed, false);
  assert.deepEqual(readFileSync(join(packageRoot, 'index.js')), bytes);
  assert.equal(policyAt(load(packageRoot), { 'cache-control': 'public, max-age=60' }).policy.maxAge(), originalMaxAge);
});

test('max-stale cannot bypass private, cookie, authorization or validation restrictions through either API or serialization', (t) => {
  const { packageRoot } = fixture(t, { patched: true });
  const CachePolicy = load(packageRoot);
  const cases = [
    ['cookie', { 'cache-control': 'max-age=3600', 'set-cookie': 'session=fixture-alice' }],
    ['private', { 'cache-control': 'private, max-age=3600' }],
    ['no-store', { 'cache-control': 'no-store, max-age=3600' }],
    ['no-cache', { 'cache-control': 'no-cache, max-age=3600' }],
    ['proxy-revalidate', { 'cache-control': 'proxy-revalidate, max-age=3600' }],
    ['must-revalidate', { 'cache-control': 'must-revalidate, max-age=3600' }],
    ['vary-star', { 'cache-control': 'max-age=3600', vary: '*' }],
    ['authorization', { 'cache-control': 'max-age=3600' }, { requestHeaders: { authorization: 'Bearer fixture-alice' } }],
    ['request-no-store', { 'cache-control': 'max-age=3600' }, { requestHeaders: { 'cache-control': 'no-store' } }],
  ];
  for (const [label, headers, options] of cases) {
    for (const age of [0, 70]) {
      const { policy, restore } = policyAt(CachePolicy, headers, { ...options, age });
      for (const candidate of [policy, restore()]) {
        for (const directive of ['max-stale=100000', 'max-stale', 'max-stale=100000, min-fresh=0']) {
          assertDenied(candidate, incoming(directive), `${label}, age=${age}, ${directive}`);
        }
      }
    }
  }
});

test('ordinary public expiration retains max-stale limits, freshness and request no-cache', (t) => {
  const { packageRoot } = fixture(t, { patched: true });
  const CachePolicy = load(packageRoot);
  const { policy, restore } = policyAt(CachePolicy, { 'cache-control': 'public, max-age=60' });
  for (const candidate of [policy, restore()]) {
    assertAllowed(candidate, incoming('max-stale=15'), 'public response expired by 10 seconds');
    assertAllowed(candidate, incoming('max-stale'), 'public unlimited max-stale');
    assertDenied(candidate, incoming('max-stale=5'), 'expiry outside client limit');
    assertDenied(candidate, incoming(), 'ordinary expiry without max-stale');
    assertDenied(candidate, incoming('no-cache, max-stale=100000'), 'request no-cache');
  }
  assertAllowed(policyAt(CachePolicy, { 'cache-control': 'public, max-age=3600' }).policy, incoming(), 'fresh public response');
});

test('public and immutable cookie opt-ins, public authorization and private single-user caches still work', (t) => {
  const { packageRoot } = fixture(t, { patched: true });
  const CachePolicy = load(packageRoot);
  for (const directive of ['public, max-age=60', 'immutable, max-age=60']) {
    assertAllowed(policyAt(CachePolicy, { 'cache-control': directive, 'set-cookie': 'session=fixture-alice' }).policy, incoming('max-stale=15'), directive);
  }
  assertAllowed(policyAt(CachePolicy, { 'cache-control': 'public, max-age=60' }, { requestHeaders: { authorization: 'Bearer fixture-alice' } }).policy, incoming('max-stale=15'), 'explicit public authorization opt-in');
  assertAllowed(policyAt(CachePolicy, { 'cache-control': 'private, max-age=60', 'set-cookie': 'session=fixture-alice' }, { shared: false }).policy, incoming('max-stale=15'), 'single-user private cache');
});

test('unknown source bytes, version, package identity and entrypoint fail closed without modifying the source', (t) => {
  for (const mutation of [
    { source: `${original}\n// unknown local modification\n` },
    { metadata: { ...metadata, version: '4.2.1' } },
    { metadata: { ...metadata, name: 'different-package' } },
    { metadata: { ...metadata, main: '../elsewhere.js' } },
  ]) {
    const { packageRoot } = fixture(t);
    if (mutation.source) writeFileSync(join(packageRoot, 'index.js'), mutation.source);
    if (mutation.metadata) writeFileSync(join(packageRoot, 'package.json'), JSON.stringify(mutation.metadata));
    const before = readFileSync(join(packageRoot, 'index.js'));
    assert.throws(() => applyPatch({ packageRoot }));
    assert.throws(() => assertPatchedInstalled({ packageRoot }));
    assert.deepEqual(readFileSync(join(packageRoot, 'index.js')), before);
  }
});

test('symbolic package roots, ancestors and dependency files are rejected without changing targets', (t) => {
  for (const targetName of ['index.js', 'package.json']) {
    const { root, packageRoot } = fixture(t);
    const target = join(root, `original-${targetName}`);
    copyFileSync(join(packageRoot, targetName), target);
    const before = readFileSync(target);
    unlinkSync(join(packageRoot, targetName));
    symlinkSync(target, join(packageRoot, targetName));
    assert.throws(() => applyPatch({ packageRoot }), /regular file/);
    assert.deepEqual(readFileSync(target), before);
  }
  const { root, packageRoot } = fixture(t);
  const alias = join(root, 'package-alias');
  symlinkSync(packageRoot, alias, 'dir');
  assert.throws(() => applyPatch({ packageRoot: alias }), /real directory/);
  const ancestor = join(root, 'modules-alias');
  symlinkSync(join(root, 'node_modules'), ancestor, 'dir');
  assert.throws(() => applyPatch({ packageRoot: join(ancestor, PACKAGE_NAME) }), /symbolic links/);
  assert.equal(hash(readFileSync(join(packageRoot, 'index.js'))), ORIGINAL_SHA256);
});

test('qualification matches only this exact high-severity package advisory', (t) => {
  const { packageRoot } = fixture(t, { patched: true });
  assert.equal(qualifiesPatchedAdvisory(advisory, { packageRoot }), true);
  for (const candidate of [
    undefined,
    { ...advisory, packageName: 'astro' },
    { ...advisory, severity: 'critical' },
    { ...advisory, url: `${ADVISORY_URL}?unrelated=1` },
    { ...advisory, url: 'https://github.com/advisories/GHSA-other-advisory' },
  ]) assert.equal(qualifiesPatchedAdvisory(candidate, { packageRoot }), false);
  writeFileSync(join(packageRoot, 'index.js'), `${readFileSync(join(packageRoot, 'index.js'), 'utf8')}\n`);
  assert.throws(() => qualifiesPatchedAdvisory(advisory, { packageRoot }), /patch missing or modified/);
});

test('the CLI fails closed before patching and applies/checks only a private fixture', (t) => {
  const { root, packageRoot } = fixture(t);
  const script = join(root, 'scripts', 'http-cache-security.mjs');
  mkdirSync(join(root, 'scripts'));
  copyFileSync(new URL('./http-cache-security.mjs', import.meta.url), script);
  const execute = (command) => spawnSync(process.execPath, [script, command], { encoding: 'utf8', timeout: 3000, maxBuffer: 64 * 1024 });
  const initial = execute('--check');
  assert.ifError(initial.error);
  assert.equal(initial.status, 1);
  assert.match(initial.stderr, /patch missing or modified/);
  for (const command of ['--apply', '--apply', '--check']) {
    const result = execute(command);
    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /local CVE-2026-93748 mitigation verified/);
  }
  assert.equal(hash(readFileSync(join(packageRoot, 'index.js'))), PATCHED_SHA256);
  assert.equal(execute('--unknown').status, 1);
});
