#!/usr/bin/env node
import assert from 'node:assert/strict';
import { createHash, randomUUID } from 'node:crypto';
import { closeSync, lstatSync, openSync, readFileSync, realpathSync, renameSync, unlinkSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const PACKAGE_NAME = 'http-cache-semantics';
export const PINNED_VERSION = '4.2.0';
export const ADVISORY_URL = 'https://github.com/advisories/GHSA-ch52-4w7c-c8xp';
export const ORIGINAL_SHA256 = '01b7d66c854b2fe53ac05c98feb6e0d64722ab8898a778e2d2426a8b468d178f';
export const PATCHED_SHA256 = '49a4018d48f6eebe6ea81334cf22c8124245e3c2c1fbb1df642f24cd532a6574';

// Local mitigation, not an upstream release. PR #58 was open and unmerged on
// 2026-10-03; reviewed head 14a8c2ad51740dc39bf3e8f1a11c845a5003f217:
// https://github.com/kornelski/http-cache-semantics/pull/58
// This smaller change preserves maxAge() and adds its existing reuse restrictions
// before evaluateRequest() can accept max-stale. No downloaded fork is executed.
export const PATCH_INSERTION = `        // Local mitigation for CVE-2026-93748; upstream PR #58 is not released.
        // Request max-stale cannot bypass the restrictions enforced by maxAge().
        if (
            !this.storable() ||
            this._rescc['no-cache'] ||
            this._resHeaders.vary === '*' ||
            (this._isShared &&
                (this._rescc['proxy-revalidate'] ||
                    (this._resHeaders['set-cookie'] &&
                        !this._rescc.public &&
                        !this._rescc.immutable)))
        ) {
            return this._evaluateRequestMissResult(req);
        }

`;

const PATCH_ANCHOR = '    evaluateRequest(req) {\n        this._assertRequestHasHeaders(req);\n\n';
const DEFAULT_PACKAGE_ROOT = fileURLToPath(new URL('../node_modules/http-cache-semantics/', import.meta.url));
const requireDependency = createRequire(import.meta.url);
const sha256 = (source) => createHash('sha256').update(source).digest('hex');

function readInstallation(packageRoot) {
  const root = resolve(packageRoot);
  // Never follow links while replacing a dependency file. Reject package aliases
  // and unexpected entrypoints instead of modifying an unrelated installation.
  assert(lstatSync(root).isDirectory(), `${PACKAGE_NAME}: package root must be a real directory`);
  assert.equal(realpathSync(root), root, `${PACKAGE_NAME}: package root must not traverse symbolic links`);
  const metadataPath = join(root, 'package.json');
  const entrypoint = join(root, 'index.js');
  for (const path of [metadataPath, entrypoint]) {
    assert(lstatSync(path).isFile(), `${PACKAGE_NAME}: expected a regular file: ${path}`);
  }
  const metadata = JSON.parse(readFileSync(metadataPath, 'utf8'));
  assert.equal(metadata.name, PACKAGE_NAME, `${PACKAGE_NAME}: unexpected package identity`);
  assert.equal(metadata.version, PINNED_VERSION, `${PACKAGE_NAME}: unsupported version; review the local mitigation`);
  assert.equal(metadata.main, 'index.js', `${PACKAGE_NAME}: unexpected entrypoint`);
  const source = readFileSync(entrypoint, 'utf8');
  return { root, entrypoint, source, hash: sha256(source) };
}

export function assertPatchedInstalled({ packageRoot = DEFAULT_PACKAGE_ROOT } = {}) {
  const installation = readInstallation(packageRoot);
  assert.equal(installation.hash, PATCHED_SHA256, `${PACKAGE_NAME}: exact local security patch missing or modified`);
  return { packageName: PACKAGE_NAME, version: PINNED_VERSION, sha256: installation.hash, advisory: ADVISORY_URL };
}

export function applyPatch({ packageRoot = DEFAULT_PACKAGE_ROOT } = {}) {
  const installation = readInstallation(packageRoot);
  if (installation.hash === PATCHED_SHA256) {
    assertSecureBehavior({ packageRoot });
    return { changed: false, ...assertPatchedInstalled({ packageRoot }) };
  }
  assert.equal(installation.hash, ORIGINAL_SHA256, `${PACKAGE_NAME}: unknown source hash; refusing to patch`);
  assert.equal(installation.source.split(PATCH_ANCHOR).length, 2, `${PACKAGE_NAME}: patch anchor is not unique`);
  const patched = installation.source.replace(PATCH_ANCHOR, PATCH_ANCHOR + PATCH_INSERTION);
  assert.equal(sha256(patched), PATCHED_SHA256, `${PACKAGE_NAME}: unexpected patched source hash`);

  // Atomic replacement prevents an interrupted installation leaving partial JS.
  const temporary = join(installation.root, `.index.js-security-${randomUUID()}.tmp`);
  let descriptor;
  try {
    descriptor = openSync(temporary, 'wx', lstatSync(installation.entrypoint).mode & 0o777);
    writeFileSync(descriptor, patched, 'utf8');
    closeSync(descriptor);
    descriptor = undefined;
    // Verify again before replacing: an unexpected concurrent update is fatal.
    assert.equal(readInstallation(packageRoot).hash, ORIGINAL_SHA256, `${PACKAGE_NAME}: source changed during patching`);
    renameSync(temporary, installation.entrypoint);
  } finally {
    if (descriptor !== undefined) closeSync(descriptor);
    try { unlinkSync(temporary); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  assertSecureBehavior({ packageRoot });
  return { changed: true, ...assertPatchedInstalled({ packageRoot }) };
}

export function assertSecureBehavior({ packageRoot = DEFAULT_PACKAGE_ROOT } = {}) {
  assertPatchedInstalled({ packageRoot });
  const entrypoint = join(resolve(packageRoot), 'index.js');
  delete requireDependency.cache[requireDependency.resolve(entrypoint)];
  const CachePolicy = requireDependency(entrypoint);
  const origin = { url: 'https://cache-fixture.invalid/account', method: 'GET', headers: { host: 'cache-fixture.invalid', cookie: 'session=fixture-alice' } };
  const restrictions = [
    { label: 'set-cookie', response: { 'cache-control': 'max-age=3600', 'set-cookie': 'session=fixture-alice' } },
    { label: 'private', response: { 'cache-control': 'private, max-age=3600' } },
    { label: 'no-store', response: { 'cache-control': 'no-store, max-age=3600' } },
    { label: 'no-cache', response: { 'cache-control': 'no-cache, max-age=3600' } },
    { label: 'proxy-revalidate', response: { 'cache-control': 'proxy-revalidate, max-age=3600' } },
    { label: 'must-revalidate', response: { 'cache-control': 'must-revalidate, max-age=3600' } },
    { label: 'vary-star', response: { 'cache-control': 'max-age=3600', vary: '*' } },
    { label: 'authorization', request: { ...origin, headers: { ...origin.headers, authorization: 'Bearer fixture-alice' } }, response: { 'cache-control': 'max-age=3600' } },
  ];
  let checks = 0;
  for (const fixture of restrictions) {
    let clock = Date.UTC(2026, 0, 1);
    class FixturePolicy extends CachePolicy { now() { return clock; } }
    const policy = new FixturePolicy(fixture.request || origin, { status: 200, headers: { date: new Date(clock).toUTCString(), ...fixture.response } });
    clock += 70_000;
    for (const candidate of [policy, FixturePolicy.fromObject(JSON.parse(JSON.stringify(policy.toObject())))]) {
      for (const directive of ['max-stale=100000', 'max-stale', 'max-stale=100000, min-fresh=0']) {
        const request = { ...origin, headers: { host: origin.headers.host, 'cache-control': directive } };
        const result = candidate.evaluateRequest(request);
        assert.equal(result.response, undefined, `${fixture.label}: evaluateRequest leaked cached response`);
        assert.equal(result.revalidation?.synchronous, true, `${fixture.label}: synchronous validation required`);
        assert.equal(candidate.satisfiesWithoutRevalidation(request), false, `${fixture.label}: satisfiesWithoutRevalidation leaked cached response`);
        checks += 2;
      }
    }
  }
  // A legitimate expired public response remains reusable within max-stale.
  for (const headers of [
    { 'cache-control': 'public, max-age=60' },
    { 'cache-control': 'public, max-age=60', 'set-cookie': 'session=fixture-alice' },
    { 'cache-control': 'immutable, max-age=60', 'set-cookie': 'session=fixture-alice' },
  ]) {
    let clock = Date.UTC(2026, 0, 1);
    class FixturePolicy extends CachePolicy { now() { return clock; } }
    const policy = new FixturePolicy(origin, { status: 200, headers: { date: new Date(clock).toUTCString(), ...headers } });
    clock += 70_000;
    for (const directive of ['max-stale=15', 'max-stale']) {
      const request = { ...origin, headers: { host: origin.headers.host, 'cache-control': directive } };
      assert(policy.evaluateRequest(request).response, 'legitimate public stale response must remain reusable');
      assert.equal(policy.satisfiesWithoutRevalidation(request), true, 'legitimate public max-stale must remain supported');
      checks += 2;
    }
    assert.equal(policy.satisfiesWithoutRevalidation({ ...origin, headers: { host: origin.headers.host, 'cache-control': 'max-stale=5' } }), false);
  }
  return { checks };
}

export function qualifiesPatchedAdvisory(advisory, { packageRoot = DEFAULT_PACKAGE_ROOT } = {}) {
  if (advisory?.packageName !== PACKAGE_NAME || advisory.severity !== 'high' || advisory.url !== ADVISORY_URL) return false;
  assertPatchedInstalled({ packageRoot });
  assertSecureBehavior({ packageRoot });
  return true;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    assert.equal(process.argv.length, 3, 'Usage: node scripts/http-cache-security.mjs --apply|--check');
    const command = process.argv[2];
    assert(['--apply', '--check'].includes(command), 'Usage: node scripts/http-cache-security.mjs --apply|--check');
    const result = command === '--apply' ? applyPatch() : { ...assertPatchedInstalled(), ...assertSecureBehavior() };
    console.log(`${PACKAGE_NAME}@${PINNED_VERSION}: local CVE-2026-93748 mitigation verified (${result.sha256})`);
  } catch (error) {
    console.error(`[http-cache-security] ${error.message}`);
    process.exitCode = 1;
  }
}
