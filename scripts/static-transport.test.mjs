import assert from 'node:assert/strict';
import { createHash, randomBytes } from 'node:crypto';
import { gzipSync } from 'node:zlib';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, openSync, closeSync, ftruncateSync, statSync, readdirSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

test('uncompressed Git packing preserves the already compressed, signed transport bytes', () => {
  const root = mkdtempSync(join(tmpdir(), 'l0g-packed-transport-'));
  const repository = join(root, 'publisher');
  const remote = join(root, 'remote.git');
  const git = (args, cwd = repository) => execFileSync('git', args, { cwd, maxBuffer: 4 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] });
  try {
    git(['init', '--bare', remote], root);
    git(['init', repository], root);
    const workflow = readFileSync(new URL('../.github/workflows/build.yml', import.meta.url), 'utf8');
    const settings = [...workflow.matchAll(/^\s+git config (core\.compression|pack\.compression|pack\.window|pack\.depth) (\d+)$/gm)];
    assert.equal(settings.length, 4);
    for (const [, key, value] of settings) git(['config', key, value]);
    const archive = gzipSync(randomBytes(1024 * 1024));
    const files = {
      'l0g-site.tar.gz.part-000': archive,
      'l0g-site.tar.gz.sha256': Buffer.from(`${digest(archive)}  l0g-site.tar.gz\n`),
      'l0g-site.tar.gz.sigstore.jsonl': Buffer.from('unchanged-attestation-fixture\n'),
      'source.env': Buffer.from('immutable-source-fixture\n'),
    };
    for (const [name, bytes] of Object.entries(files)) writeFileSync(join(repository, name), bytes);
    git(['add', '-A']);
    git(['-c', 'user.name=Transport test', '-c', 'user.email=transport@example.invalid',
      '-c', 'core.hooksPath=/dev/null', '-c', 'commit.gpgsign=false', 'commit', '-m', 'transport fixture']);
    git(['push', '--progress', remote, 'HEAD:refs/heads/built']);
    for (const [name, bytes] of Object.entries(files)) {
      assert.deepEqual(git(['--git-dir', remote, 'show', `built:${name}`], root), bytes);
    }
    git(['--git-dir', remote, 'fsck', '--strict'], root);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

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
