import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const archiveName = 'l0g-site.tar.gz';
const names = [archiveName, `${archiveName}.sha256`, `${archiveName}.sigstore.jsonl`];
const sha256 = file => {
  const hash = createHash('sha256');
  const fd = fs.openSync(file, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW);
  try {
    const block = Buffer.alloc(1024 * 1024);
    let count;
    while ((count = fs.readSync(fd, block)) > 0) hash.update(block.subarray(0, count));
    return hash.digest('hex');
  } finally { fs.closeSync(fd); }
};

/** Publish opaque, already verified bytes. Never overwrite an existing asset. */
export function publishStaticAssets(directory, output, env = process.env, run = args =>
  execFileSync('gh', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })) {
  const reject = message => { throw new Error(message); };
  if (fs.existsSync(output)) reject('Static metadata output must not already exist');
  const regular = (name, maximum) => {
    const stat = fs.lstatSync(path.join(directory, name));
    if (!stat.isFile() || stat.nlink !== 1 || stat.size < 1 || stat.size > maximum) reject(`Invalid static asset: ${name}`);
  };
  regular('source.env', 4096);
  const coordinates = Object.create(null);
  for (const line of fs.readFileSync(path.join(directory, 'source.env'), 'utf8').trimEnd().split('\n')) {
    const match = /^([A-Z0-9_]+)=(.+)$/.exec(line);
    if (!match || Object.hasOwn(coordinates, match[1])) reject('Invalid or duplicate release coordinates');
    coordinates[match[1]] = match[2];
  }
  const repo = coordinates.L0G_RELEASE_REPOSITORY;
  const source = coordinates.L0G_RELEASE_SOURCE_SHA;
  const runId = coordinates.L0G_RELEASE_RUN_ID;
  const attempt = coordinates.L0G_RELEASE_RUN_ATTEMPT;
  if (Object.keys(coordinates).length !== 6 || coordinates.L0G_RELEASE_SCHEMA !== '1'
    || coordinates.L0G_RELEASE_SOURCE_REF !== 'refs/heads/main'
    || !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo || '')
    || !/^[a-f0-9]{40}$/.test(source || '') || !/^[1-9][0-9]*$/.test(runId || '')
    || !/^[1-9][0-9]*$/.test(attempt || '') || !/^[1-9][0-9]*$/.test(env.GITHUB_RUN_ATTEMPT || '')
    || repo !== env.GITHUB_REPOSITORY || source !== env.GITHUB_SHA || runId !== env.GITHUB_RUN_ID
    || env.GITHUB_REF !== 'refs/heads/main' || BigInt(attempt) > BigInt(env.GITHUB_RUN_ATTEMPT)) reject('Foreign static release coordinates');
  regular(archiveName, 16 * 94371840);
  regular(names[1], 128);
  regular(names[2], 5_000_000);
  const archiveHash = sha256(path.join(directory, archiveName));
  if (fs.readFileSync(path.join(directory, names[1]), 'utf8') !== `${archiveHash}  ${archiveName}\n`) reject('Static archive checksum mismatch');
  const tag = `static-${source}-${runId}-${attempt}`;
  // gh release view also resolves pending draft tags via GraphQL. REST's
  // /releases/tags endpoint alone cannot find an interrupted draft publication.
  const api = () => {
    const data = JSON.parse(run(['release', 'view', tag, '--repo', repo, '--json', 'databaseId']));
    if (!Number.isSafeInteger(data.databaseId) || data.databaseId < 1) reject('Invalid static release ID');
    // REST by numeric ID works for drafts too and retains API asset digests,
    // independently of the CLI's JSON asset serializer version.
    return JSON.parse(run(['api', `repos/${repo}/releases/${data.databaseId}`]));
  };
  let release;
  try { release = api(); } catch (error) {
    if (error.status !== 1 || String(error.stderr).trim() !== 'release not found') throw error;
    run(['release', 'create', tag, '--repo', repo, '--target', source, '--draft', '--prerelease', '--latest=false',
      '--title', `Static ${source.slice(0, 12)} · ${runId}/${attempt}`, '--notes', 'Attested static release. Assets are immutable by publication policy.']);
    release = api();
  }
  const validate = () => {
    if (release.tag_name !== tag || release.target_commitish !== source || !release.prerelease
      || !Array.isArray(release.assets) || new Set(release.assets.map(a => a.name)).size !== release.assets.length
      || release.assets.some(a => !names.includes(a.name))) reject('Unexpected static release identity or assets');
  };
  validate();
  for (const asset of release.assets) {
    const local = path.join(directory, asset.name);
    if (asset.name !== names[2] && asset.digest === `sha256:${sha256(local)}`) continue;
    const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'l0g-existing-asset-'));
    try {
      run(['release', 'download', tag, '--repo', repo, '--dir', temporary, '--pattern', asset.name]);
      const existing = path.join(temporary, asset.name);
      if (asset.name === names[2]) {
        run(['attestation', 'verify', path.join(directory, archiveName), '--bundle', existing, '--repo', repo,
          '--signer-workflow', `${repo}/.github/workflows/build.yml`, '--source-ref', 'refs/heads/main',
          '--source-digest', source, '--deny-self-hosted-runners']);
        fs.copyFileSync(existing, local);
      } else if (sha256(existing) !== sha256(local)) reject(`Existing static asset differs: ${asset.name}`);
    } finally { fs.rmSync(temporary, { recursive: true, force: true }); }
  }
  const missing = names.filter(name => !release.assets.some(asset => asset.name === name));
  if (missing.length) {
    if (!release.draft) reject('Published static release is incomplete');
    run(['release', 'upload', tag, ...missing.map(name => path.join(directory, name)), '--repo', repo]);
  }
  release = api(); validate();
  if (release.assets.length !== names.length || release.assets.some(asset => asset.digest !== `sha256:${sha256(path.join(directory, asset.name))}`)) reject('Uploaded static asset digest mismatch');
  if (release.draft) run(['release', 'edit', tag, '--repo', repo, '--draft=false', '--prerelease', '--latest=false']);
  release = api(); validate();
  if (release.draft) reject('Static release is still a draft');
  fs.mkdirSync(output);
  for (const name of [names[1], names[2], 'source.env']) fs.copyFileSync(path.join(directory, name), path.join(output, name));
  fs.writeFileSync(path.join(output, 'transport.env'), 'L0G_STATIC_TRANSPORT=github-release-v1\n');
  return { tag, archiveBytes: fs.statSync(path.join(directory, archiveName)).size,
    gitBytes: fs.readdirSync(output).reduce((sum, name) => sum + fs.statSync(path.join(output, name)).size, 0) };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  if (process.argv.length !== 4) throw new Error('Usage: node scripts/publish-static-assets.mjs RELEASE_DIR NEW_METADATA_DIR');
  console.log(JSON.stringify(publishStaticAssets(process.argv[2], process.argv[3])));
}
