#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { readFile, realpath } from 'node:fs/promises';
import { resolve, sep } from 'node:path';

function argument(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : null;
}

function fail(message) {
  throw new Error(`Artefact MCP invalide: ${message}`);
}

async function sha256(path) {
  return createHash('sha256').update(await readFile(path)).digest('hex');
}

const root = resolve(argument('--root') || process.cwd());
const expectedVersion = argument('--version');
const expectedSha = argument('--sha');
const canonicalRoot = await realpath(root);
const release = JSON.parse(await readFile(resolve(root, 'release.json'), 'utf8'));

if (release.schemaVersion !== 1) fail(`schemaVersion=${release.schemaVersion}`);
if (release.name !== 'io.github.bluetouff/l0g') fail(`name=${release.name}`);
if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?$/.test(release.version)) {
  fail(`version=${release.version}`);
}
if (!/^[0-9a-f]{40}$/i.test(release.gitSha)) fail(`gitSha=${release.gitSha}`);
if (expectedVersion && release.version !== expectedVersion) fail(`version attendue=${expectedVersion}, reçue=${release.version}`);
if (expectedSha && release.gitSha !== expectedSha) fail(`SHA attendu=${expectedSha}, reçu=${release.gitSha}`);
if (release.sourceRef !== `refs/tags/mcp-v${release.version}`) fail(`sourceRef=${release.sourceRef}`);
if (release.entrypoint !== 'mcp-server/server.mjs' || release.manifest !== 'server.json') {
  fail('entrypoint ou manifeste inattendu');
}

const manifest = JSON.parse(await readFile(resolve(root, release.manifest), 'utf8'));
const packageJson = JSON.parse(await readFile(resolve(root, 'mcp-server/package.json'), 'utf8'));
const packageLock = JSON.parse(await readFile(resolve(root, 'mcp-server/package-lock.json'), 'utf8'));
if ([manifest.version, packageJson.version, packageLock.packages?.['']?.version].some((value) => value !== release.version)) {
  fail('versions du manifeste, du paquet et du lockfile désalignées');
}

const requiredFiles = [
  'server.json',
  'mcp-server/server.mjs',
  'mcp-server/package.json',
  'mcp-server/package-lock.json',
  'mcp-server/deploy/verify-release.mjs',
  'src/lib/agent-prompts.mjs',
  'LICENSE',
  'README.md',
  'NOTICE.md',
  'SECURITY.md',
  'sbom.cdx.json',
  'release.env',
];
for (const relativePath of requiredFiles) {
  if (!release.files?.[relativePath]) fail(`fichier obligatoire absent du manifeste: ${relativePath}`);
}

for (const [relativePath, digest] of Object.entries(release.files || {})) {
  if (!/^[0-9a-f]{64}$/i.test(digest)) fail(`empreinte invalide pour ${relativePath}`);
  const path = resolve(root, relativePath);
  const canonicalPath = await realpath(path);
  if (canonicalPath !== canonicalRoot && !canonicalPath.startsWith(`${canonicalRoot}${sep}`)) {
    fail(`chemin hors release: ${relativePath}`);
  }
  if (await sha256(canonicalPath) !== digest) fail(`empreinte incorrecte: ${relativePath}`);
}

if (Object.keys(release.files).length < requiredFiles.length) fail('manifeste de fichiers incomplet');
process.stdout.write(`${JSON.stringify({ ok: true, version: release.version, gitSha: release.gitSha })}\n`);
