#!/usr/bin/env node

import { cp, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { basename, dirname, join, resolve } from 'node:path';
import { validateRelease } from './validate-mcp-release.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function argument(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : null;
}

async function sha256(path) {
  return createHash('sha256').update(await readFile(path)).digest('hex');
}

const { version, sha, tag } = await validateRelease({
  tag: argument('--tag') || process.env.GITHUB_REF_NAME || null,
  sha: argument('--sha') || process.env.GITHUB_SHA || null,
});
const outputRoot = resolve(argument('--output') || join(ROOT, '.mcp-release'));
const releaseName = `l0g-mcp-${version}`;
const releaseDir = join(outputRoot, releaseName);

if (basename(releaseDir) !== releaseName) throw new Error('Chemin de release invalide');
await rm(releaseDir, { recursive: true, force: true });
await mkdir(join(releaseDir, 'mcp-server'), { recursive: true, mode: 0o755 });
await mkdir(join(releaseDir, 'src/lib'), { recursive: true, mode: 0o755 });

for (const path of [
  'server.json',
  'mcp-server/server.mjs',
  'mcp-server/package.json',
  'mcp-server/package-lock.json',
  'mcp-server/deploy/verify-release.mjs',
  'src/lib/agent-prompts.mjs',
]) {
  const target = join(releaseDir, path);
  await mkdir(dirname(target), { recursive: true, mode: 0o755 });
  await cp(join(ROOT, path), target, { force: true });
}

const nodeModules = join(ROOT, 'mcp-server/node_modules');
if (!(await stat(nodeModules).catch(() => null))?.isDirectory()) {
  throw new Error('mcp-server/node_modules absent; exécuter npm ci --omit=dev avant le packaging');
}
await cp(nodeModules, join(releaseDir, 'mcp-server/node_modules'), {
  recursive: true,
  dereference: false,
  filter: (source) => basename(source) !== '.bin',
});

const sbom = execFileSync('npm', [
  'sbom',
  '--prefix', join(ROOT, 'mcp-server'),
  '--omit=dev',
  '--sbom-format=cyclonedx',
], { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
await writeFile(join(releaseDir, 'sbom.cdx.json'), sbom, { mode: 0o644 });
await writeFile(join(releaseDir, 'release.env'), `MCP_GIT_SHA=${sha}\nMCP_RELEASE_ATTESTED=1\n`, { mode: 0o644 });

const criticalPaths = [
  'server.json',
  'mcp-server/server.mjs',
  'mcp-server/package.json',
  'mcp-server/package-lock.json',
  'mcp-server/deploy/verify-release.mjs',
  'src/lib/agent-prompts.mjs',
  'sbom.cdx.json',
  'release.env',
];
const files = Object.fromEntries(await Promise.all(
  criticalPaths.map(async (path) => [path, await sha256(join(releaseDir, path))]),
));
const builtAt = execFileSync('git', ['show', '-s', '--format=%cI', sha], {
  cwd: ROOT,
  encoding: 'utf8',
}).trim();
const release = {
  schemaVersion: 1,
  name: 'io.github.bluetouff/l0g',
  version,
  gitSha: sha,
  sourceRef: `refs/tags/${tag}`,
  builtAt,
  entrypoint: 'mcp-server/server.mjs',
  manifest: 'server.json',
  files,
};
await writeFile(join(releaseDir, 'release.json'), `${JSON.stringify(release, null, 2)}\n`, { mode: 0o644 });
process.stdout.write(`${JSON.stringify({ releaseName, releaseDir, version, sha, tag })}\n`);
