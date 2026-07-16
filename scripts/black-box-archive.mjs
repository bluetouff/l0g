#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';

const command = process.argv[2] || 'validate';
const value = (name, fallback = '') => {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : fallback;
};
const archiveDir = resolve(value('archive', process.env.L0G_BLACK_BOX_ARCHIVE_DIR || '.black-box-archive'));
const framesDir = join(archiveDir, 'frames');
const distDir = resolve(value('dist', 'dist'));

function stableStringify(input) {
  if (input === null || typeof input !== 'object') return JSON.stringify(input);
  if (Array.isArray(input)) return `[${input.map(stableStringify).join(',')}]`;
  return `{${Object.keys(input).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(input[key])}`).join(',')}}`;
}
const sha256 = (input) => createHash('sha256').update(input).digest('hex');
const json = (path) => JSON.parse(readFileSync(path, 'utf8'));
const core = ({ frameHash: _frameHash, ...frame }) => frame;
function omitGenerated(input) {
  if (Array.isArray(input)) return input.map(omitGenerated);
  if (!input || typeof input !== 'object') return input;
  return Object.fromEntries(Object.entries(input).filter(([key]) => key !== 'generated').map(([key, item]) => [key, omitGenerated(item)]));
}

function loadFrames() {
  if (!existsSync(framesDir)) return [];
  return readdirSync(framesDir).filter((file) => file.endsWith('.json')).sort().map((file) => {
    const path = join(framesDir, file);
    const stat = lstatSync(path);
    if (!stat.isFile() || stat.isSymbolicLink() || stat.size > 5_000_000) throw new Error(`${file}: fichier archive refusé`);
    return { file, frame: json(path) };
  });
}

function validate() {
  let previous = null;
  const seen = new Set();
  for (const { file, frame } of loadFrames()) {
    if (frame.schemaVersion !== '2') throw new Error(`${file}: schemaVersion invalide`);
    if (seen.has(frame.frameId)) throw new Error(`${file}: frameId dupliqué`);
    seen.add(frame.frameId);
    const calculated = sha256(stableStringify(core(frame)));
    if (calculated !== frame.frameHash) throw new Error(`${file}: frameHash ne correspond pas au contenu`);
    if (frame.previousFrameHash !== (previous?.frameHash ?? null)) throw new Error(`${file}: previousFrameHash rompt la chaîne`);
    if (!Array.isArray(frame.contemporaryHashes) || frame.contemporaryHashes.length === 0) throw new Error(`${file}: hashes contemporains absents`);
    previous = frame;
  }
  console.log(`Black Box archive OK: ${seen.size} frame(s), tête ${previous?.frameHash || 'genesis-vide'}.`);
  return previous;
}

function maxIso(values) {
  return values.filter(Boolean).sort().at(-1) || null;
}

function append() {
  mkdirSync(framesDir, { recursive: true });
  const previous = validate();
  const subjects = [
    'agents.json', 'openapi.json', 'api/v1/catalog.json', 'api/v1/search-index.json',
    'api/v1/claims.json', 'api/v1/evidence-graph.json', 'api/v1/sources.json',
    'api/v1/freshness.json', 'api/v1/changes.json', 'api/v1/risk-diff.json',
    'api/v1/risk.json', 'api/v1/debt-risk.json', 'api/v1/signals/history.json',
  ];
  const integrityManifest = json(join(distDir, 'api/v1/integrity.json'));
  const canonicalByPath = new Map((integrityManifest.snapshots || []).map((snapshot) => [snapshot.path, snapshot]));
  const contemporaryHashes = subjects.map((path) => {
    const publicPath = `/${path}`;
    const canonical = canonicalByPath.get(publicPath);
    if (canonical) {
      return { path: publicPath, sha256: canonical.canonicalSha256, bytes: canonical.canonicalBytes, canonicalization: 'integrity-manifest-v1' };
    }
    const canonicalBody = stableStringify(omitGenerated(json(join(distDir, path))));
    return { path: publicPath, sha256: sha256(canonicalBody), bytes: Buffer.byteLength(canonicalBody), canonicalization: 'canonical-json-v1' };
  });
  const signalHistory = json(join(distDir, 'api/v1/signals/history.json'));
  const freshness = json(join(distDir, 'api/v1/freshness.json'));
  const changes = json(join(distDir, 'api/v1/changes.json'));
  const observations = signalHistory.observations || [];
  const current = signalHistory.current || {};
  const signals = Object.values(current).sort((a, b) => String(a.instrument).localeCompare(String(b.instrument)));
  const computedAt = value('computed-at', process.env.BLACK_BOX_COMPUTED_AT || new Date().toISOString());
  const gitSha = value('git-sha', process.env.GITHUB_SHA || 'unknown');
  if (!/^[a-f0-9]{7,64}$/i.test(gitSha)) throw new Error('gitSha doit être une empreinte Git hexadécimale');
  const date = computedAt.slice(0, 10);
  const runUrl = value('attestation', process.env.BLACK_BOX_ATTESTATION_URL || 'local-unattested');
  const idSuffix = value('id-suffix', '').replace(/[^a-zA-Z0-9-]/g, '').slice(0, 80);
  const frameId = `${computedAt.replace(/[-:.]/g, '').replace('Z', 'Z')}-${gitSha.slice(0, 12)}${idSuffix ? `-${idSuffix}` : ''}`;
  if (loadFrames().some(({ frame }) => frame.frameId === frameId)) throw new Error(`frame déjà présente: ${frameId}`);
  const frameCore = JSON.parse(JSON.stringify({
    schemaVersion: '2', frameId, date,
    observedAt: maxIso(observations.map((item) => item.observedAt)),
    retrievedAt: maxIso(observations.map((item) => item.retrievedAt)),
    computedAt, gitSha,
    previousFrameHash: previous?.frameHash ?? null,
    attestation: { provider: runUrl === 'local-unattested' ? 'none' : 'github-sigstore', reference: runUrl, subjects: ['/agents.json', '/openapi.json', '/api/v1/integrity.json'] },
    contemporaryHashes,
    signals,
    freshness: { generated: freshness.generated, signalFreshness: freshness.signalFreshness, policy: freshness.freshnessPolicy },
    changes: { generated: changes.generated, count: changes.count, latest: (changes.entries || []).slice(0, 20) },
    limitations: [
      'La frame prouve les octets et métadonnées archivés, pas la vérité économique des modèles.',
      'Les claims restent canoniques en français ; les traductions pointent vers ces preuves sans duplication.',
    ],
  }));
  const frame = { ...frameCore, frameHash: sha256(stableStringify(frameCore)) };
  const path = join(framesDir, `${frameId}.json`);
  writeFileSync(path, `${JSON.stringify(frame, null, 2)}\n`, { flag: 'wx' });
  validate();
  console.log(`Frame ajoutée: ${basename(path)}`);
}

if (command === 'append') append();
else if (command === 'validate') validate();
else throw new Error(`commande inconnue: ${command}`);
