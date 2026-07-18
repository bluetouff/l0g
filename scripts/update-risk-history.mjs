import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const DEFAULT_URL = 'https://l0g.fr/api/v1/history.ndjson';
const url = process.env.L0G_OPERATIONAL_HISTORY_URL || DEFAULT_URL;
const sourceFile = process.env.L0G_OPERATIONAL_HISTORY_SOURCE || null;
const output = process.env.L0G_OPERATIONAL_HISTORY_PATH || '.cache/risk-operational-history.ndjson';
const metaOutput = process.env.L0G_OPERATIONAL_HISTORY_META_PATH || '.cache/risk-operational-history.meta.json';
const attemptedAt = new Date().toISOString();
const maxBytes = 15_000_000;

function atomicWrite(path, contents) {
  mkdirSync(dirname(path), { recursive: true });
  const temporary = `${path}.tmp`;
  writeFileSync(temporary, contents);
  renameSync(temporary, path);
}

function validate(text) {
  if (Buffer.byteLength(text, 'utf8') > maxBytes) throw new Error('historique opérationnel trop volumineux');
  const rows = [];
  for (const [index, line] of text.split('\n').entries()) {
    if (!line.trim()) continue;
    let row;
    try {
      row = JSON.parse(line);
    } catch {
      throw new Error(`NDJSON invalide à la ligne ${index + 1}`);
    }
    if (!row.snapshot || Number.isNaN(Date.parse(row.snapshot))) {
      throw new Error(`snapshot ISO manquant à la ligne ${index + 1}`);
    }
    if (!['us', 'eu', 'yen', 'energie', 'debt'].some((key) => typeof row[key] === 'number')) {
      throw new Error(`aucun signal numérique à la ligne ${index + 1}`);
    }
    rows.push(row);
  }
  if (!rows.length) throw new Error('historique opérationnel vide');
  return rows;
}

async function readSource() {
  if (sourceFile) return readFileSync(sourceFile, 'utf8');
  const response = await fetch(url, {
    signal: AbortSignal.timeout(30_000),
    headers: { accept: 'application/x-ndjson, application/json', 'user-agent': 'l0g-history-fusion/1.0 (+https://l0g.fr/series/)' },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const length = Number(response.headers.get('content-length') || 0);
  if (length > maxBytes) throw new Error('historique opérationnel trop volumineux');
  return response.text();
}

try {
  const text = await readSource();
  const rows = validate(text);
  const normalized = rows.map((row) => JSON.stringify(row)).join('\n') + '\n';
  atomicWrite(output, normalized);
  atomicWrite(metaOutput, `${JSON.stringify({
    status: 'ok',
    source: url,
    attemptedAt,
    retrievedAt: attemptedAt,
    rows: rows.length,
    firstSnapshot: rows[0].snapshot,
    lastSnapshot: rows.at(-1).snapshot,
    sampling: 'Le cache conserve le journal brut ; la surface canonique sélectionne le dernier snapshot de chaque jour UTC et de chaque signal.',
  }, null, 2)}\n`);
  console.log(`Historique opérationnel -> ${rows.length} lignes (${rows[0].snapshot} — ${rows.at(-1).snapshot})`);
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
}
