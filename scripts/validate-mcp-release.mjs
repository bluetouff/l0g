#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SEMVER = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?$/;

function argument(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : null;
}

function git(...args) {
  return execFileSync('git', args, {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function fail(message) {
  throw new Error(`Release MCP refusée: ${message}`);
}

export async function readReleaseVersions() {
  const [manifestRaw, packageRaw, lockRaw, contractRaw, serverRaw, agentBenchRaw, workflowRaw] = await Promise.all([
    readFile(join(ROOT, 'server.json'), 'utf8'),
    readFile(join(ROOT, 'mcp-server/package.json'), 'utf8'),
    readFile(join(ROOT, 'mcp-server/package-lock.json'), 'utf8'),
    readFile(join(ROOT, 'src/config/agent-contract.mjs'), 'utf8'),
    readFile(join(ROOT, 'mcp-server/server.mjs'), 'utf8'),
    readFile(join(ROOT, 'src/pages/api/v1/agent-bench.json.ts'), 'utf8'),
    readFile(join(ROOT, '.github/workflows/publish-mcp.yml'), 'utf8'),
  ]);
  const manifest = JSON.parse(manifestRaw);
  const packageJson = JSON.parse(packageRaw);
  const packageLock = JSON.parse(lockRaw);
  const contractMatch = contractRaw.match(/export const MCP_VERSION = ['"]([^'"]+)['"]/);
  if (!contractMatch) fail('MCP_VERSION est introuvable dans src/config/agent-contract.mjs');
  if (!serverRaw.includes("import { MCP_PROTOCOL_VERSION, MCP_VERSION } from '../src/config/agent-contract.mjs'")) {
    fail('le serveur MCP ne dérive pas sa version de la source unique');
  }
  if (!agentBenchRaw.includes('mcpServerVersion: MCP_VERSION')) fail('Agent Bench ne dérive pas sa version de la source unique');
  if (!workflowRaw.includes('git worktree add --detach .black-box-archive origin/black-box-archive')) {
    fail('le workflow MCP ne monte pas l’archive Black Box append-only');
  }
  if (!workflowRaw.includes('L0G_BLACK_BOX_ARCHIVE_DIR: ${{ github.workspace }}/.black-box-archive')) {
    fail('le build MCP ne consomme pas l’archive Black Box');
  }

  return {
    manifest,
    versions: {
      manifest: manifest.version,
      package: packageJson.version,
      lock: packageLock.packages?.['']?.version,
      contract: contractMatch[1],
    },
  };
}

export async function validateRelease({ tag = null, sha = null, requireMain = false } = {}) {
  const { manifest, versions } = await readReleaseVersions();
  const uniqueVersions = new Set(Object.values(versions));
  if (uniqueVersions.size !== 1) {
    fail(`versions désalignées (${Object.entries(versions).map(([key, value]) => `${key}=${value}`).join(', ')})`);
  }

  const version = versions.manifest;
  if (!SEMVER.test(version)) fail(`version non SemVer: ${version}`);
  if (manifest.name !== 'io.github.bluetouff/l0g') fail(`namespace inattendu: ${manifest.name}`);
  const remote = manifest.remotes?.find((item) => item.type === 'streamable-http');
  if (remote?.url !== 'https://l0g.fr/api/mcp') fail('endpoint Streamable HTTP canonique absent');

  if (tag && tag !== `mcp-v${version}`) {
    fail(`le tag ${tag} ne correspond pas à mcp-v${version}`);
  }

  const resolvedSha = sha || process.env.GITHUB_SHA || git('rev-parse', 'HEAD');
  if (!/^[0-9a-f]{40}$/i.test(resolvedSha)) fail(`SHA Git invalide: ${resolvedSha}`);
  if (resolvedSha !== git('rev-parse', 'HEAD')) fail('le SHA annoncé ne correspond pas au checkout');

  if (requireMain) {
    try {
      execFileSync('git', ['merge-base', '--is-ancestor', resolvedSha, 'origin/main'], {
        cwd: ROOT,
        stdio: 'ignore',
      });
    } catch {
      fail('le tag ne pointe pas sur un commit appartenant à origin/main');
    }
  }

  return { version, sha: resolvedSha, tag: tag || `mcp-v${version}` };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = await validateRelease({
    tag: argument('--tag') || process.env.GITHUB_REF_NAME || null,
    sha: argument('--sha') || process.env.GITHUB_SHA || null,
    requireMain: process.argv.includes('--require-main'),
  });
  process.stdout.write(`${JSON.stringify(result)}\n`);
}
