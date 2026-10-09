#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RELEASE_FILES = ['source.env', 'l0g-site.tar.gz', 'l0g-site.tar.gz.sha256'];
const MANIFESTS = ['agents.json', 'openapi.json', 'api/v1/integrity.json', 'api/v1/black-box.json', 'api/v1/agent-bench.json'];
const FRAME_PATH = /^frames\/[a-zA-Z0-9_-]+\.json$/;
const GIT_SHA = /^(?:[a-f0-9]{40}|[a-f0-9]{64})$/;
const validator = fileURLToPath(new URL('./black-box-archive.mjs', import.meta.url));
const reject = (message) => { throw new Error(message); };

function realPath(file) {
  const absolute = path.resolve(file);
  if (fs.realpathSync(absolute) !== absolute) reject('Symbolic links are forbidden in release transfer paths');
  return absolute;
}

function regularFile(file) {
  realPath(file);
  const descriptor = fs.openSync(file, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW | fs.constants.O_NONBLOCK);
  const stat = fs.fstatSync(descriptor);
  if (!stat.isFile() || stat.nlink !== 1) {
    fs.closeSync(descriptor);
    reject('Release transfer requires regular files without links');
  }
  return { descriptor, stat };
}

function read(file, maximum = 4096) {
  const { descriptor, stat } = regularFile(file);
  try {
    if (stat.size > maximum) reject('Release metadata exceeds its size limit');
    const buffer = Buffer.alloc(stat.size + 1);
    let length = 0;
    while (length < buffer.length) {
      const count = fs.readSync(descriptor, buffer, length, buffer.length - length, length);
      if (!count) break;
      length += count;
    }
    if (length !== stat.size) reject('Release input changed during transfer');
    return buffer.subarray(0, length);
  } finally { fs.closeSync(descriptor); }
}

function sha256File(file) {
  const { descriptor, stat } = regularFile(file);
  try {
    const hash = createHash('sha256');
    const buffer = Buffer.alloc(1024 * 1024);
    let total = 0;
    let count;
    while ((count = fs.readSync(descriptor, buffer, 0, buffer.length, null)) > 0) {
      total += count;
      hash.update(buffer.subarray(0, count));
    }
    if (total !== stat.size || !total) reject('Release file changed or is empty');
    return hash.digest('hex');
  } finally { fs.closeSync(descriptor); }
}

function git(archive, ...args) {
  return execFileSync('git', ['-C', archive, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

function archiveState(archive) {
  realPath(archive);
  realPath(path.join(archive, 'frames'));
  if (path.resolve(git(archive, 'rev-parse', '--show-toplevel').trim()) !== path.resolve(archive)) reject('Expected the archive repository root');
  const head = git(archive, 'rev-parse', '--verify', 'HEAD').trim();
  if (!GIT_SHA.test(head)) reject('Archive HEAD is invalid');
  const changes = git(archive, 'status', '--porcelain=v1', '-z', '--untracked-files=all').split('\0').filter(Boolean);
  return { head, changes };
}

function validateArchive(archive) {
  execFileSync(process.execPath, [validator, 'validate', '--archive', archive], { stdio: ['ignore', 'pipe', 'pipe'] });
}

function sourceCoordinates(file, env) {
  const expected = {
    L0G_RELEASE_SCHEMA: '1',
    L0G_RELEASE_REPOSITORY: env.GITHUB_REPOSITORY,
    L0G_RELEASE_SOURCE_REF: env.GITHUB_REF,
    L0G_RELEASE_SOURCE_SHA: env.GITHUB_SHA,
    L0G_RELEASE_RUN_ID: env.GITHUB_RUN_ID,
    L0G_RELEASE_RUN_ATTEMPT: env.GITHUB_RUN_ATTEMPT,
  };
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(env.GITHUB_REPOSITORY || '') ||
      env.GITHUB_REF !== 'refs/heads/main' || !GIT_SHA.test(env.GITHUB_SHA || '') ||
      !/^[1-9][0-9]*$/.test(env.GITHUB_RUN_ID || '') || !/^[1-9][0-9]*$/.test(env.GITHUB_RUN_ATTEMPT || '')) reject('Expected GitHub release coordinates are incomplete or invalid');
  const lines = read(file, 4096).toString('utf8').replace(/\n$/, '').split('\n');
  const seen = new Set();
  for (const line of lines) {
    const match = /^([A-Z0-9_]+)=(.*)$/.exec(line);
    if (!match || !Object.hasOwn(expected, match[1]) || seen.has(match[1]) || match[2] !== expected[match[1]]) reject('source.env does not match the exact GitHub release coordinates');
    seen.add(match[1]);
  }
  if (seen.size !== Object.keys(expected).length) reject('source.env must contain exactly six release fields');
}

function checkRelease(release, env) {
  sourceCoordinates(path.join(release, 'source.env'), env);
  const expected = `${sha256File(path.join(release, 'l0g-site.tar.gz'))}  l0g-site.tar.gz\n`;
  if (read(path.join(release, 'l0g-site.tar.gz.sha256'), 128).toString('utf8') !== expected) reject('Release archive checksum mismatch');
}

function checkFrame(file, env) {
  const frame = JSON.parse(read(file, 5_000_000));
  const suffix = `-${env.GITHUB_SHA.slice(0, 12)}-${env.GITHUB_RUN_ID}-${env.GITHUB_RUN_ATTEMPT}`;
  if (frame.gitSha !== env.GITHUB_SHA || `${frame.frameId}.json` !== path.basename(file) ||
      typeof frame.frameId !== 'string' || !frame.frameId.startsWith('utc-') || !frame.frameId.endsWith(suffix) ||
      frame.attestation?.provider !== 'github-sigstore' ||
      frame.attestation?.reference !== `https://github.com/${env.GITHUB_REPOSITORY}/actions/runs/${env.GITHUB_RUN_ID}`) reject('Frame does not belong to this release');
}

function checkManifests(input) {
  const hashes = JSON.parse(read(path.join(input, 'manifest-hashes.json'), 4096));
  if (!hashes || typeof hashes !== 'object' || Array.isArray(hashes) ||
      JSON.stringify(Object.keys(hashes).sort()) !== JSON.stringify([...MANIFESTS].sort()) ||
      MANIFESTS.some(file => typeof hashes[file] !== 'string' || !/^[a-f0-9]{64}$/.test(hashes[file]))) reject('Manifest hashes must name exactly the five release manifests');
  for (const file of MANIFESTS) {
    if (sha256File(path.join(input, 'manifests', file)) !== hashes[file]) reject(`Manifest checksum mismatch: ${file}`);
  }
}

function originatingBuildEnv(env) {
  // A failed publisher may rerun while reusing the immutable artifact from its
  // successful build job. The workflow passes that job's original attempt.
  const attempt = env.L0G_CI_BUILD_ATTEMPT ?? env.GITHUB_RUN_ATTEMPT;
  if (!/^[1-9][0-9]*$/.test(attempt || '') || !/^[1-9][0-9]*$/.test(env.GITHUB_RUN_ATTEMPT || '') ||
      BigInt(attempt) > BigInt(env.GITHUB_RUN_ATTEMPT)) reject('Invalid originating build attempt');
  return { ...env, GITHUB_RUN_ATTEMPT: attempt };
}

function filesIn(directory, prefix = '') {
  realPath(directory);
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) return filesIn(file, relative);
    const { descriptor } = regularFile(file);
    fs.closeSync(descriptor);
    return [relative];
  });
}

function emptyDestination(directory) {
  const absolute = path.resolve(directory);
  let parent = absolute;
  while (!fs.existsSync(parent)) parent = path.dirname(parent);
  realPath(parent);
  if (fs.existsSync(absolute) && (!fs.statSync(absolute).isDirectory() || fs.readdirSync(absolute).length)) reject('Release transfer destinations must be absent or empty');
  return absolute;
}

function copy(source, destination) {
  const { descriptor } = regularFile(source);
  fs.closeSync(descriptor);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  realPath(path.dirname(destination));
  fs.copyFileSync(source, destination, fs.constants.COPYFILE_EXCL);
}

export function stageRelease({ archive, release, dist, output, env = process.env }) {
  const { head, changes } = archiveState(archive);
  if (changes.length !== 1 || !changes[0].startsWith('?? ') || !FRAME_PATH.test(changes[0].slice(3))) reject('Expected exactly one new untracked frame and no other archive modifications');
  const frame = changes[0].slice(3);
  checkRelease(release, env);
  checkFrame(path.join(archive, frame), env);
  validateArchive(archive);
  // The build validates JSON semantics. Transfer hashes the exact bytes in bounded
  // chunks so the append-only Black Box can grow without loading it into memory.
  const manifestHashes = Object.fromEntries(MANIFESTS.map(file => [file, sha256File(path.join(dist, file))]));
  output = emptyDestination(output);
  for (const file of RELEASE_FILES) copy(path.join(release, file), path.join(output, 'release', file));
  for (const file of MANIFESTS) copy(path.join(dist, file), path.join(output, 'manifests', file));
  copy(path.join(archive, frame), path.join(output, frame));
  fs.writeFileSync(path.join(output, 'archive-base.txt'), `${head}\n`, { flag: 'wx' });
  fs.writeFileSync(path.join(output, 'manifest-hashes.json'), `${JSON.stringify(manifestHashes)}\n`, { flag: 'wx' });
}

export function restoreRelease({ input, archive, release, dist, env = process.env }) {
  const buildEnv = originatingBuildEnv(env);
  const files = filesIn(input).sort();
  const frames = files.filter((file) => FRAME_PATH.test(file));
  const expected = ['archive-base.txt', 'manifest-hashes.json', ...RELEASE_FILES.map(file => `release/${file}`), ...MANIFESTS.map(file => `manifests/${file}`), ...frames].sort();
  if (frames.length !== 1 || JSON.stringify(files) !== JSON.stringify(expected)) reject('Transfer must contain exactly the release files, manifests and one frame');
  const { head, changes } = archiveState(archive);
  if (changes.length) reject('Archive must be clean before restoring a frame');
  if (read(path.join(input, 'archive-base.txt'), 128).toString('utf8') !== `${head}\n`) reject('Archive base changed since the build');
  checkRelease(path.join(input, 'release'), buildEnv);
  checkFrame(path.join(input, frames[0]), buildEnv);
  checkManifests(input);
  release = emptyDestination(release);
  dist = emptyDestination(dist);
  const frame = path.join(archive, frames[0]);
  copy(path.join(input, frames[0]), frame);
  try {
    validateArchive(archive);
    for (const file of RELEASE_FILES) copy(path.join(input, 'release', file), path.join(release, file));
    for (const file of MANIFESTS) copy(path.join(input, 'manifests', file), path.join(dist, file));
  } catch (error) {
    fs.unlinkSync(frame);
    throw error;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [command, ...args] = process.argv.slice(2);
  const options = {};
  for (let index = 0; index < args.length; index += 2) {
    if (!/^--(?:archive|release|dist|input|output)$/.test(args[index]) || !args[index + 1] || args[index + 1].startsWith('--') || Object.hasOwn(options, args[index].slice(2))) reject('Invalid release transfer arguments');
    options[args[index].slice(2)] = args[index + 1];
  }
  const required = command === 'stage' ? ['archive', 'release', 'dist', 'output'] : command === 'restore' ? ['input', 'archive', 'release', 'dist'] : [];
  if (!required.length || required.length !== Object.keys(options).length || required.some(key => !options[key])) reject('Use stage --archive --release --dist --output or restore --input --archive --release --dist');
  if (command === 'stage') stageRelease(options);
  else restoreRelease(options);
  console.log(`CI release ${command}: verified transfer complete.`);
}
