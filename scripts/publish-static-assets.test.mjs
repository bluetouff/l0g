import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { publishStaticAssets } from './publish-static-assets.mjs';

const digest = bytes => `sha256:${createHash('sha256').update(bytes).digest('hex')}`;
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'l0g-static-assets-test-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const directory = path.join(root, 'release'); fs.mkdirSync(directory);
  const output = path.join(root, 'metadata');
  const env = { GITHUB_REPOSITORY: 'fixture/l0g', GITHUB_REF: 'refs/heads/main', GITHUB_SHA: 'a'.repeat(40), GITHUB_RUN_ID: '123', GITHUB_RUN_ATTEMPT: '1' };
  const tag = `static-${env.GITHUB_SHA}-123-1`;
  const archive = Buffer.alloc(2 * 1024 * 1024, 123);
  fs.writeFileSync(path.join(directory, 'l0g-site.tar.gz'), archive);
  fs.writeFileSync(path.join(directory, 'l0g-site.tar.gz.sha256'), `${digest(archive).slice(7)}  l0g-site.tar.gz\n`);
  fs.writeFileSync(path.join(directory, 'l0g-site.tar.gz.sigstore.jsonl'), 'attestation fixture\n');
  fs.writeFileSync(path.join(directory, 'source.env'), `L0G_RELEASE_SCHEMA=1\nL0G_RELEASE_REPOSITORY=${env.GITHUB_REPOSITORY}\nL0G_RELEASE_SOURCE_REF=${env.GITHUB_REF}\nL0G_RELEASE_SOURCE_SHA=${env.GITHUB_SHA}\nL0G_RELEASE_RUN_ID=123\nL0G_RELEASE_RUN_ATTEMPT=1\n`);
  let release = null;
  const remote = new Map(), calls = [];
  const run = args => {
    calls.push(args);
    assert.ok(!args.includes('--clobber'));
    if (args[0] === 'release' && args[1] === 'view') {
      if (!release) throw Object.assign(new Error('not found'), { status: 1, stderr: 'release not found' });
      return JSON.stringify({ databaseId: 123 });
    }
    if (args[0] === 'api') {
      assert.equal(args[1], 'repos/fixture/l0g/releases/123');
      return JSON.stringify({ ...release, assets: [...remote].map(([name, bytes]) => ({ name, digest: digest(bytes) })) });
    }
    if (args[0] === 'attestation') return '';
    assert.equal(args[0], 'release'); assert.equal(args[2], tag);
    if (args[1] === 'create') {
      assert.equal(args[args.indexOf('--target') + 1], env.GITHUB_SHA);
      assert.ok(args.includes('--prerelease') && args.includes('--latest=false'));
      release = { tag_name: tag, target_commitish: env.GITHUB_SHA, draft: true, prerelease: true };
    } else if (args[1] === 'upload') {
      for (const file of args.slice(3, args.indexOf('--repo'))) {
        assert.ok(!remote.has(path.basename(file)), 'never replace an existing asset');
        remote.set(path.basename(file), fs.readFileSync(file));
      }
    } else if (args[1] === 'edit') {
      assert.ok(args.includes('--latest=false')); release.draft = false;
    } else if (args[1] === 'download') {
      fs.writeFileSync(path.join(args[args.indexOf('--dir') + 1], args[args.indexOf('--pattern') + 1]), remote.get(args[args.indexOf('--pattern') + 1]));
    } else throw new Error(`Unexpected operation ${args[1]}`);
    return '';
  };
  return { directory, output, env, tag, remote, calls, run, get release() { return release; }, set release(value) { release = value; } };
}

test('Releases carry the archive; Git receives only small metadata and no arbitrary URL', t => {
  const f = fixture(t); const result = publishStaticAssets(f.directory, f.output, f.env, f.run);
  assert.equal(result.tag, f.tag); assert.equal(f.release.draft, false);
  assert.equal(result.archiveBytes, 2 * 1024 * 1024); assert.ok(result.gitBytes < 4096);
  assert.deepEqual(fs.readdirSync(f.output).sort(), ['l0g-site.tar.gz.sha256', 'l0g-site.tar.gz.sigstore.jsonl', 'source.env', 'transport.env']);
  assert.equal(fs.readFileSync(path.join(f.output, 'transport.env'), 'utf8'), 'L0G_STATIC_TRANSPORT=github-release-v1\n');
  assert.ok(f.calls.some(a => a[1] === 'upload'));
});

test('publisher retries reuse published assets, reverify the bundle and never upload or edit them', t => {
  const f = fixture(t); publishStaticAssets(f.directory, f.output, f.env, f.run);
  fs.rmSync(f.output, { recursive: true }); f.calls.length = 0;
  fs.writeFileSync(path.join(f.directory, 'l0g-site.tar.gz.sigstore.jsonl'), 'new signature for same archive\n');
  publishStaticAssets(f.directory, f.output, { ...f.env, GITHUB_RUN_ATTEMPT: '2' }, f.run);
  assert.ok(f.calls.some(a => a[0] === 'attestation' && a.includes('--deny-self-hosted-runners')));
  assert.ok(!f.calls.some(a => ['upload', 'edit', 'create'].includes(a[1])));
  assert.equal(fs.readFileSync(path.join(f.output, 'l0g-site.tar.gz.sigstore.jsonl'), 'utf8'), 'attestation fixture\n');
});

test('an interrupted draft resumes only missing uploads', t => {
  const f = fixture(t);
  f.release = { tag_name: f.tag, target_commitish: f.env.GITHUB_SHA, draft: true, prerelease: true };
  f.remote.set('l0g-site.tar.gz', fs.readFileSync(path.join(f.directory, 'l0g-site.tar.gz')));
  publishStaticAssets(f.directory, f.output, f.env, f.run);
  assert.equal(f.calls.find(a => a[1] === 'upload').slice(3, -2).length, 2);
});

test('foreign coordinates, invalid files and checksums are rejected before network or output', t => {
  for (const mutate of [
    f => { f.env.GITHUB_SHA = 'b'.repeat(40); },
    f => { f.env.GITHUB_REF = 'refs/pull/1/merge'; },
    f => { f.env.GITHUB_RUN_ID = '999'; },
    f => { f.env.GITHUB_RUN_ATTEMPT = '0'; },
    f => fs.appendFileSync(path.join(f.directory, 'source.env'), 'L0G_RELEASE_RUN_ID=123\n'),
    f => fs.appendFileSync(path.join(f.directory, 'l0g-site.tar.gz'), 'changed'),
    f => { fs.unlinkSync(path.join(f.directory, 'l0g-site.tar.gz')); fs.symlinkSync('source.env', path.join(f.directory, 'l0g-site.tar.gz')); },
  ]) {
    const f = fixture(t); mutate(f);
    assert.throws(() => publishStaticAssets(f.directory, f.output, f.env, f.run));
    assert.equal(f.calls.length, 0); assert.equal(fs.existsSync(f.output), false);
  }
});

test('network and permission errors never masquerade as a missing release', t => {
  for (const stderr of ['gh: Forbidden (HTTP 403)', 'timeout', 'Bad Gateway (HTTP 502)']) {
    const f = fixture(t); let calls = 0;
    assert.throws(() => publishStaticAssets(f.directory, f.output, f.env, () => { calls++; throw Object.assign(new Error(stderr), { status: 1, stderr }); }));
    assert.equal(calls, 1); assert.equal(fs.existsSync(f.output), false);
  }
});

test('mismatched existing releases/assets, missing digests and invalid attestations fail closed', t => {
  for (const kind of ['target', 'unexpected', 'corrupt', 'incomplete', 'digest', 'signature']) {
    const f = fixture(t); publishStaticAssets(f.directory, f.output, f.env, f.run); fs.rmSync(f.output, { recursive: true });
    if (kind === 'target') f.release.target_commitish = 'main';
    if (kind === 'unexpected') f.remote.set('extra', Buffer.from('extra'));
    if (kind === 'corrupt') f.remote.set('l0g-site.tar.gz', Buffer.from('corrupt'));
    if (kind === 'incomplete') f.remote.delete('l0g-site.tar.gz.sha256');
    const run = args => {
      if (kind === 'signature' && args[0] === 'attestation') throw new Error('invalid signature');
      const result = f.run(args);
      if (kind === 'digest' && args[0] === 'api') { const data = JSON.parse(result); delete data.assets[0].digest; return JSON.stringify(data); }
      return result;
    };
    assert.throws(() => publishStaticAssets(f.directory, f.output, f.env, run), undefined, kind);
    assert.equal(fs.existsSync(f.output), false);
  }
});
