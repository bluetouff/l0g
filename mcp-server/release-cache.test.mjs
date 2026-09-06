import assert from 'node:assert/strict';
import { mkdtemp, readFile, rename, rm, symlink, writeFile } from 'node:fs/promises';
import { realpath } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { createReleaseCache } from './release-cache.mjs';

function deferred() {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

test('concurrent cold readers share one complete corpus, including subsequent readers', async () => {
  const gate = deferred();
  const snapshot = { catalog: { articles: ['one'] } };
  let reads = 0;
  const load = createReleaseCache(async () => 'A', async () => {
    reads++;
    await gate.promise;
    return snapshot;
  });
  const requests = Array.from({ length: 32 }, () => load());
  gate.resolve();
  const results = await Promise.all(requests);
  assert.equal(reads, 1);
  for (const result of results) assert.equal(result, snapshot);
  assert.equal(await load(), snapshot);
  assert.equal(reads, 1);
});

test('a failed shared load rejects all callers and allows a fresh retry', async () => {
  const error = new Error('incomplete release');
  let reads = 0;
  const load = createReleaseCache(async () => 'A', () => {
    if (++reads === 1) throw error;
    return { ready: true };
  });
  const results = await Promise.allSettled(Array.from({ length: 16 }, () => load()));
  assert.equal(reads, 1);
  for (const result of results) {
    assert.equal(result.status, 'rejected');
    assert.equal(result.reason, error);
  }
  assert.deepEqual(await load(), { ready: true });
  assert.equal(reads, 2);
});

test('out-of-order completion cannot evict the current release or mix its data', async () => {
  let directory = 'A';
  const started = deferred();
  const old = deferred();
  const reads = [];
  const load = createReleaseCache(async () => directory, async (dir) => {
    reads.push(dir);
    if (dir === 'A') { started.resolve(); return old.promise; }
    return { directory: dir };
  });
  const first = load();
  await started.promise;
  directory = 'B';
  const current = await load();
  old.resolve({ directory: 'A' });
  assert.deepEqual(await first, { directory: 'A' });
  assert.equal(await load(), current);
  assert.deepEqual(reads, ['A', 'B']);
});

test('a broken new release fails closed instead of serving the previous corpus', async () => {
  let directory = 'A';
  let broken = true;
  const load = createReleaseCache(async () => directory, async (dir) => {
    if (dir === 'B' && broken) throw new Error('invalid JSON');
    return { directory: dir };
  });
  await load();
  directory = 'B';
  await assert.rejects(load(), /invalid JSON/);
  broken = false;
  assert.deepEqual(await load(), { directory: 'B' });
});

test('resolution failure propagates and a later request can recover', async () => {
  let broken = true;
  const load = createReleaseCache(async () => {
    if (broken) throw new Error('unavailable path');
    return 'A';
  }, async () => ({ ready: true }));
  await assert.rejects(load(), /unavailable path/);
  broken = false;
  assert.deepEqual(await load(), { ready: true });
});

test('atomic symlink deployment and rollback take effect on the next call', async (t) => {
  const dir = await mkdtemp(join(tmpdir(), 'l0g-release-cache-'));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const current = join(dir, 'current');
  await writeFile(join(dir, 'A.json'), '{"release":"A"}');
  await writeFile(join(dir, 'B.json'), '{"release":"B"}');
  await symlink(join(dir, 'A.json'), current);
  let reads = 0;
  const load = createReleaseCache(() => realpath(current), async (path) => {
    reads++;
    return JSON.parse(await readFile(path, 'utf8'));
  });
  assert.deepEqual(await load(), { release: 'A' });
  for (const release of ['B', 'A']) {
    await symlink(join(dir, `${release}.json`), join(dir, 'next'));
    await rename(join(dir, 'next'), current);
    assert.deepEqual(await load(), { release });
  }
  assert.equal(reads, 3);
});
