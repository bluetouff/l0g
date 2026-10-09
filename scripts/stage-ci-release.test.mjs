import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { stageRelease, restoreRelease } from './stage-ci-release.mjs';

const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const stable = value => value === null || typeof value !== 'object' ? JSON.stringify(value)
  : Array.isArray(value) ? `[${value.map(stable).join(',')}]`
    : `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stable(value[key])}`).join(',')}}`;
const git = (cwd, ...args) => execFileSync('git', ['-C', cwd, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
const env = {
  GITHUB_REPOSITORY: 'fixture/l0g', GITHUB_REF: 'refs/heads/main', GITHUB_SHA: 'a'.repeat(40), GITHUB_RUN_ID: '123', GITHUB_RUN_ATTEMPT: '1',
};
const manifestPaths = ['agents.json', 'openapi.json', 'api/v1/integrity.json', 'api/v1/black-box.json', 'api/v1/agent-bench.json'];

function write(file, bytes) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, bytes);
}

function fixture(t) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(tmpdir(), 'l0g-release-transfer-')));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const archive = path.join(root, 'archive');
  write(path.join(archive, 'frames/.gitkeep'), '');
  git(archive, 'init', '-q');
  git(archive, 'add', 'frames');
  git(archive, '-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', '-c', 'commit.gpgsign=false', 'commit', '-qm', 'initial fixture');
  const frameId = `utc-20261009T010000000Z-${env.GITHUB_SHA.slice(0, 12)}-123-1`;
  const core = { schemaVersion: '2', frameId, gitSha: env.GITHUB_SHA, previousFrameHash: null, contemporaryHashes: [{ path: '/fixture.json', sha256: sha256('{}') }], attestation: { provider: 'github-sigstore', reference: `https://github.com/${env.GITHUB_REPOSITORY}/actions/runs/${env.GITHUB_RUN_ID}` } };
  const framePath = path.join(archive, 'frames', `${frameId}.json`);
  write(framePath, `${JSON.stringify({ ...core, frameHash: sha256(stable(core)) })}\n`);
  const release = path.join(root, 'release');
  write(path.join(release, 'source.env'), `L0G_RELEASE_SCHEMA=1\nL0G_RELEASE_REPOSITORY=${env.GITHUB_REPOSITORY}\nL0G_RELEASE_SOURCE_REF=${env.GITHUB_REF}\nL0G_RELEASE_SOURCE_SHA=${env.GITHUB_SHA}\nL0G_RELEASE_RUN_ID=${env.GITHUB_RUN_ID}\nL0G_RELEASE_RUN_ATTEMPT=${env.GITHUB_RUN_ATTEMPT}\n`);
  // The transfer hashes bytes only: it must never interpret or extract the archive.
  const tarBytes = Buffer.from('opaque archive fixture, not a tar file');
  write(path.join(release, 'l0g-site.tar.gz'), tarBytes);
  write(path.join(release, 'l0g-site.tar.gz.sha256'), `${sha256(tarBytes)}  l0g-site.tar.gz\n`);
  const dist = path.join(root, 'dist');
  for (const file of manifestPaths) write(path.join(dist, file), `${JSON.stringify({ path: file })}\n`);
  const output = path.join(root, 'ci-release');
  const stage = { archive, release, dist, output, env };
  const restore = { input: output, archive, release: path.join(root, 'restored-release'), dist: path.join(root, 'restored-dist'), env };
  return { root, archive, release, dist, output, framePath, stage, restore };
}

function prepareRestore(t) {
  const f = fixture(t);
  stageRelease(f.stage);
  fs.unlinkSync(f.framePath);
  return f;
}

test('stage and restore preserve every byte without extracting the tar', (t) => {
  const f = fixture(t);
  write(path.join(f.release, 'ignored-extra'), 'not transferred');
  write(path.join(f.dist, 'private-extra'), 'not transferred');
  const frame = fs.readFileSync(f.framePath);
  stageRelease(f.stage);
  assert(!fs.existsSync(path.join(f.output, 'release/ignored-extra')));
  assert(!fs.existsSync(path.join(f.output, 'manifests/private-extra')));
  assert.equal(fs.readFileSync(path.join(f.output, 'archive-base.txt'), 'utf8'), git(f.archive, 'rev-parse', 'HEAD'));
  fs.unlinkSync(f.framePath);
  restoreRelease(f.restore);
  for (const file of ['source.env', 'l0g-site.tar.gz', 'l0g-site.tar.gz.sha256']) assert.deepEqual(fs.readFileSync(path.join(f.restore.release, file)), fs.readFileSync(path.join(f.release, file)));
  for (const file of manifestPaths) assert.deepEqual(fs.readFileSync(path.join(f.restore.dist, file)), fs.readFileSync(path.join(f.dist, file)));
  assert.deepEqual(fs.readFileSync(f.framePath), frame);
  assert.match(git(f.archive, 'status', '--porcelain', '--untracked-files=all'), /^\?\? frames\/utc-.*\.json\n$/);
  assert.throws(() => restoreRelease(f.restore), /Archive must be clean/);
});

test('stage refuses multiple frames and every tracked or unexpected archive change', (t) => {
  for (const mutation of [
    f => write(path.join(f.archive, 'frames/other.json'), '{}'),
    f => write(path.join(f.archive, 'unexpected.txt'), 'unexpected'),
    f => write(path.join(f.archive, 'frames/.gitkeep'), 'changed'),
    f => git(f.archive, 'add', 'frames'),
  ]) {
    const f = fixture(t);
    mutation(f);
    assert.throws(() => stageRelease(f.stage), /exactly one new untracked frame/);
    assert(!fs.existsSync(f.output));
  }
});

test('restore refuses missing, additional or duplicate source fields and foreign run coordinates', (t) => {
  for (const change of [
    value => value.replace('L0G_RELEASE_SCHEMA=1\n', ''),
    value => `${value}EXTRA=unexpected\n`,
    value => `${value}L0G_RELEASE_SCHEMA=1\n`,
    value => value.replace('L0G_RELEASE_RUN_ID=123', 'L0G_RELEASE_RUN_ID=456'),
    value => value.replace('L0G_RELEASE_RUN_ATTEMPT=1', 'L0G_RELEASE_RUN_ATTEMPT=2'),
    value => value.replace('L0G_RELEASE_REPOSITORY=fixture/l0g', 'L0G_RELEASE_REPOSITORY=another/l0g'),
    value => value.replace('refs/heads/main', 'refs/heads/other'),
    value => value.replace(env.GITHUB_SHA, 'b'.repeat(40)),
    value => value.replace('L0G_RELEASE_SCHEMA=1', 'L0G_RELEASE_SCHEMA=$(touch forbidden)'),
  ]) {
    const f = prepareRestore(t);
    const file = path.join(f.output, 'release/source.env');
    fs.writeFileSync(file, change(fs.readFileSync(file, 'utf8')));
    assert.throws(() => restoreRelease(f.restore), /source.env/);
    assert(!fs.existsSync(f.framePath));
    assert(!fs.existsSync(f.restore.release));
  }
});

test('restore refuses a changed archive base, dirty archive or corrupt tar', (t) => {
  for (const [mutation, error] of [
    [f => fs.writeFileSync(path.join(f.output, 'archive-base.txt'), `${'b'.repeat(40)}\n`), /Archive base changed/],
    [f => write(path.join(f.archive, 'frames/.gitkeep'), 'changed'), /Archive must be clean/],
    [f => fs.appendFileSync(path.join(f.output, 'release/l0g-site.tar.gz'), 'tampered'), /checksum mismatch/],
    [f => fs.appendFileSync(path.join(f.output, 'release/l0g-site.tar.gz.sha256'), 'extra'), /checksum mismatch/],
  ]) {
    const f = prepareRestore(t);
    mutation(f);
    assert.throws(() => restoreRelease(f.restore), error);
    assert(!fs.existsSync(f.framePath));
  }
});

test('a publisher retry can restore the exact successful earlier build attempt', (t) => {
  const f = prepareRestore(t);
  restoreRelease({ ...f.restore, env: { ...env, GITHUB_RUN_ATTEMPT: '2', L0G_CI_BUILD_ATTEMPT: '1' } });
  assert(fs.existsSync(f.framePath));
  assert.match(fs.readFileSync(path.join(f.restore.release, 'source.env'), 'utf8'), /L0G_RELEASE_RUN_ATTEMPT=1\n/);
});

test('future, malformed and unstated originating build attempts are rejected', (t) => {
  for (const [attempts, error] of [
    [{ GITHUB_RUN_ATTEMPT: '2', L0G_CI_BUILD_ATTEMPT: '3' }, /Invalid originating build attempt/],
    [{ GITHUB_RUN_ATTEMPT: '2', L0G_CI_BUILD_ATTEMPT: '0' }, /Invalid originating build attempt/],
    [{ GITHUB_RUN_ATTEMPT: '2', L0G_CI_BUILD_ATTEMPT: '1;echo' }, /Invalid originating build attempt/],
    [{ GITHUB_RUN_ATTEMPT: '2' }, /source.env/],
  ]) {
    const f = prepareRestore(t);
    assert.throws(() => restoreRelease({ ...f.restore, env: { ...env, ...attempts } }), error);
    assert(!fs.existsSync(f.framePath));
  }
});

test('the transferred frame remains bound to the source run, attempt and attestation', (t) => {
  for (const mutation of [
    frame => { frame.gitSha = 'b'.repeat(40); },
    frame => { frame.frameId = frame.frameId.replace(/-1$/, '-2'); },
    frame => { frame.attestation.reference += '/attempts/2'; },
    frame => { frame.attestation.provider = 'none'; },
  ]) {
    const f = prepareRestore(t);
    const file = path.join(f.output, 'frames', path.basename(f.framePath));
    const frame = JSON.parse(fs.readFileSync(file));
    mutation(frame);
    fs.writeFileSync(file, JSON.stringify(frame));
    assert.throws(() => restoreRelease(f.restore), /Frame does not belong/);
    assert(!fs.existsSync(f.framePath));
  }
});

test('restore refuses additional frames, unexpected files, symlinks and hardlinks', (t) => {
  for (const [mutation, error] of [
    [f => write(path.join(f.output, 'frames/extra.json'), '{}'), /exactly the release files/],
    [f => write(path.join(f.output, 'unexpected'), 'extra'), /exactly the release files/],
    [f => { const file = path.join(f.output, 'manifests/agents.json'); fs.unlinkSync(file); fs.symlinkSync(path.join(f.dist, 'agents.json'), file); }, /Symbolic links/],
    [f => { const file = path.join(f.output, 'release/source.env'); fs.unlinkSync(file); fs.linkSync(path.join(f.release, 'source.env'), file); }, /without links/],
    [f => { const dir = path.join(f.output, 'manifests'); fs.renameSync(dir, `${dir}-original`); fs.symlinkSync(`${dir}-original`, dir); }, /Symbolic links/],
  ]) {
    const f = prepareRestore(t);
    mutation(f);
    assert.throws(() => restoreRelease(f.restore), error);
    assert(!fs.existsSync(f.framePath));
  }
});

test('restore removes the newly copied frame when existing archive validation rejects it', (t) => {
  const f = prepareRestore(t);
  const file = path.join(f.output, 'frames', path.basename(f.framePath));
  const frame = JSON.parse(fs.readFileSync(file));
  frame.frameHash = '0'.repeat(64);
  fs.writeFileSync(file, JSON.stringify(frame));
  assert.throws(() => restoreRelease(f.restore), /Command failed/);
  assert(!fs.existsSync(f.framePath));
  assert(!fs.existsSync(f.restore.release));
  assert.equal(git(f.archive, 'status', '--porcelain'), '');
});

test('restore never overwrites destination files or follows destination links', (t) => {
  const f = prepareRestore(t);
  write(path.join(f.restore.release, 'preserved'), 'keep');
  assert.throws(() => restoreRelease(f.restore), /absent or empty/);
  assert.equal(fs.readFileSync(path.join(f.restore.release, 'preserved'), 'utf8'), 'keep');
  fs.rmSync(f.restore.release, { recursive: true });
  fs.symlinkSync(f.release, f.restore.release);
  assert.throws(() => restoreRelease(f.restore), /Symbolic links/);
  assert(!fs.existsSync(f.framePath));
});
