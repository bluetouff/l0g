import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, statSync } from 'node:fs';
import { relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const reader = fileURLToPath(new URL('./epub-test-archive.py', import.meta.url));
const metadataBudget = 1024 * 1024;

export function readEpubEntries(archive, maxBytes = 64 * 1024 * 1024) {
  const bytes = execFileSync('python3', ['-I', reader, resolve(archive), String(maxBytes)], {
    maxBuffer: maxBytes + metadataBudget + 4,
    stdio: 'pipe',
  });
  const headerEnd = 4 + bytes.readUInt32BE(0);
  const members = JSON.parse(bytes.subarray(4, headerEnd).toString('utf8'));
  const entries = new Map();
  let offset = headerEnd;
  for (const [name, size] of members) {
    entries.set(name, bytes.subarray(offset, offset + size));
    offset += size;
  }
  assert.equal(offset, bytes.length, `${archive}: inflated EPUB byte count`);
  return entries;
}

export function assertEpubEntriesMatchSource(archive, sourceRoot, files) {
  const expected = new Map();
  let total = 0;
  for (const file of files) {
    const name = relative(sourceRoot, file).split(sep).join('/');
    assert.ok(!expected.has(name), `${archive}: duplicate source member ${name}`);
    expected.set(name, file);
    total += statSync(file).size;
  }
  const actual = readEpubEntries(archive, total);
  assert.deepEqual(
    [...actual.keys()].filter(name => !name.endsWith('/')).sort(),
    [...expected.keys()].sort(),
    `${archive}: ZIP and source member lists differ`,
  );
  for (const [name, file] of expected) {
    assert.ok(actual.get(name).equals(readFileSync(file)), `${archive}: ZIP member ${name} differs from its source`);
  }
}
