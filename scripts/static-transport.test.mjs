import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, openSync, closeSync, ftruncateSync, statSync, readdirSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const script = fileURLToPath(new URL('../deploy/prepare-static-transport.sh', import.meta.url));
const digest = (value) => createHash('sha256').update(value).digest('hex');

test('transport splits an archive above 100 MiB without changing its signed bytes or metadata', () => {
  const root = mkdtempSync(join(tmpdir(), 'l0g-static-transport-'));
  let fd;
  try {
    const archive = join(root, 'l0g-site.tar.gz');
    // Keep one exclusively created file open for both reads and resizes.
    fd = openSync(archive, 'wx+');
    ftruncateSync(fd, 101 * 1024 * 1024);
    const original = readFileSync(fd);
    const checksum = `${digest(original)}  l0g-site.tar.gz\n`;
    writeFileSync(join(root, 'l0g-site.tar.gz.sha256'), checksum);
    writeFileSync(join(root, 'l0g-site.tar.gz.sigstore.jsonl'), 'signed-whole-archive-fixture\n');
    writeFileSync(join(root, 'source.env'), 'public-coordinates-fixture\n');
    const output = join(root, 'transport');
    execFileSync('bash', [script, root, output]);
    const entries = readdirSync(output).sort();
    assert(!entries.includes('l0g-site.tar.gz'));
    const parts = entries.filter((name) => name.includes('.part-'));
    assert.deepEqual(parts, ['l0g-site.tar.gz.part-000', 'l0g-site.tar.gz.part-001']);
    assert.equal(statSync(join(output, parts[0])).size, 90 * 1024 * 1024);
    assert(parts.every((name) => statSync(join(output, name)).size < 100 * 1024 * 1024));
    const assembled = Buffer.concat(parts.map((name) => readFileSync(join(output, name))));
    assert.equal(digest(assembled), digest(original));
    for (const name of ['l0g-site.tar.gz.sha256', 'l0g-site.tar.gz.sigstore.jsonl', 'source.env']) {
      assert.equal(readFileSync(join(output, name), 'utf8'), readFileSync(join(root, name), 'utf8'));
    }
    const lines = readFileSync(join(output, 'l0g-site.tar.gz.parts.sha256'), 'utf8').trim().split('\n');
    assert.deepEqual(lines, parts.map((name) => `${digest(readFileSync(join(output, name)))}  ${name}`));
    assert.notEqual(spawnSync('bash', [script, root, output]).status, 0, 'Never overwrite a transport directory');
    symlinkSync(root, join(root, 'alias'));
    assert.notEqual(spawnSync('bash', [script, root, join(root, 'alias')]).status, 0);
    ftruncateSync(fd, 90 * 1024 * 1024 * 16 + 1);
    assert.notEqual(spawnSync('bash', [script, root, join(root, 'too-large')]).status, 0);
  } finally {
    try {
      if (fd !== undefined) closeSync(fd);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }
});
