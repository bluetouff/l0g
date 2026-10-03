import { randomUUID } from 'node:crypto';
import { createReadStream, existsSync, lstatSync, mkdirSync, renameSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve, sep } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { MAX_HISTORY_BYTES, sampleOperationalHistory } from './operational-history.mjs';

const DEFAULT_URL = 'https://l0g.fr/api/v1/history.ndjson';
const parsedUrl = new URL(process.env.L0G_OPERATIONAL_HISTORY_URL || DEFAULT_URL);
if (parsedUrl.href !== DEFAULT_URL) {
  throw new Error('URL de l’historique opérationnel refusée');
}
const url = parsedUrl.href;
const sourceFile = process.env.L0G_OPERATIONAL_HISTORY_SOURCE || null;
const cacheRoot = resolve('.cache');

function cachePath(value, fallback) {
  const path = resolve(value || fallback);
  const fromCache = relative(cacheRoot, path);
  if (!fromCache || fromCache === '..' || fromCache.startsWith(`..${sep}`)) {
    throw new Error(`chemin de cache hors racine: ${path}`);
  }
  // The build owns this directory. A pre-existing link must never redirect a
  // network-derived cache into source, configuration or executable files.
  for (let current = path; current !== dirname(cacheRoot); current = dirname(current)) {
    let entry;
    try { entry = lstatSync(current); } catch (error) { if (error.code === 'ENOENT') continue; throw error; }
    if (entry.isSymbolicLink() || (current === path ? !entry.isFile() : !entry.isDirectory())) {
      throw new Error(`destination de cache non régulière: ${current}`);
    }
  }
  return path;
}

const output = cachePath(process.env.L0G_OPERATIONAL_HISTORY_PATH, '.cache/risk-operational-history.ndjson');
const metaOutput = cachePath(process.env.L0G_OPERATIONAL_HISTORY_META_PATH, '.cache/risk-operational-history.meta.json');
if (output.normalize('NFD').toLowerCase() === metaOutput.normalize('NFD').toLowerCase()) {
  throw new Error('historique et métadonnées doivent avoir des destinations distinctes');
}
const attemptedAt = new Date().toISOString();

function atomicWrite(path, contents) {
  // Flux intentionnel : le NDJSON distant est borné et validé ligne par ligne;
  // la destination est obligatoirement confinée sous .cache/.
  cachePath(path);
  mkdirSync(dirname(path), { recursive: true });
  const temporary = `${path}.tmp-${randomUUID()}`;
  try {
    writeFileSync(temporary, contents, { encoding: 'utf8', flag: 'wx', mode: 0o600 });
    renameSync(temporary, path);
  } finally {
    try { unlinkSync(temporary); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
}

async function readSource() {
  if (sourceFile) return sampleOperationalHistory(createReadStream(sourceFile));
  const response = await fetch(url, {
    signal: AbortSignal.timeout(60_000),
    redirect: 'error',
    headers: { accept: 'application/x-ndjson, application/json', 'user-agent': 'l0g-history-fusion/1.0 (+https://l0g.fr/series/)' },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const length = Number(response.headers.get('content-length') || 0);
  if (length > MAX_HISTORY_BYTES) {
    await response.body?.cancel();
    throw new Error('historique opérationnel trop volumineux');
  }
  if (!response.body) throw new Error('historique opérationnel sans corps');
  return sampleOperationalHistory(response.body);
}

async function readWithRetry() {
  for (let attempt = 0; ; attempt += 1) {
    try {
      return await readSource();
    } catch (error) {
      const transient = ['TypeError', 'TimeoutError', 'AbortError'].includes(error.name)
        || /^HTTP (408|429|5\d\d)$/.test(error.message);
      if (sourceFile || !transient || attempt >= 2) throw error;
      await delay(1000 * 2 ** attempt);
    }
  }
}

try {
  const result = await readWithRetry();
  atomicWrite(output, result.text);
  atomicWrite(metaOutput, `${JSON.stringify({
    status: 'ok',
    source: url,
    attemptedAt,
    retrievedAt: attemptedAt,
    rows: result.rows,
    sampledRows: result.sampledRows,
    bytes: result.bytes,
    firstSnapshot: result.firstSnapshot,
    lastSnapshot: result.lastSnapshot,
    sampling: 'Le journal brut est validé intégralement en flux ; le cache conserve le dernier snapshot de chaque jour UTC, sans interpolation. Le journal complet reste disponible à l’URL source.',
  }, null, 2)}\n`);
  console.log(`Historique opérationnel -> ${result.rows} lignes validées, ${result.sampledRows} jours (${result.firstSnapshot} — ${result.lastSnapshot})`);
} catch (error) {
  const reason = String(error?.message || error).replace(/\s+/g, ' ').slice(0, 240);
  const retained = existsSync(output);
  atomicWrite(metaOutput, `${JSON.stringify({
    status: retained ? 'fallback' : 'missing',
    source: url,
    attemptedAt,
    retrievedAt: null,
    retained,
    reason,
  }, null, 2)}\n`);
  console.warn(`Historique opérationnel indisponible (${reason})${retained ? ' ; cache précédent conservé.' : ' ; historique attesté seul.'}`);
  // A broken ingestion must stop publication, not silently discard an entire
  // evidence source while the static release reports success.
  process.exitCode = 1;
}
