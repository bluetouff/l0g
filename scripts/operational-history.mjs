// The public journal is append-only. Retain its canonical daily sampling while
// reading it incrementally, so memory does not grow with every 15-minute run.
export const MAX_HISTORY_BYTES = 128 * 1024 * 1024;
export const MAX_HISTORY_LINE_BYTES = 64 * 1024;
const MAX_HISTORY_DAYS = 36_600;
const SIGNALS = ['us', 'eu', 'yen', 'energie', 'debt'];

export async function sampleOperationalHistory(chunks, { maxBytes = MAX_HISTORY_BYTES } = {}) {
  const decoder = new TextDecoder('utf-8', { fatal: true });
  const daily = new Map();
  let pending = '';
  let bytes = 0;
  let rows = 0;
  let lineNumber = 0;
  let firstSnapshot = null;
  let lastSnapshot = null;

  function consume(line) {
    lineNumber += 1;
    if (Buffer.byteLength(line, 'utf8') > MAX_HISTORY_LINE_BYTES) throw new Error('ligne historique trop volumineuse');
    if (!line.trim()) return;
    let row;
    try {
      row = JSON.parse(line);
    } catch {
      throw new Error(`NDJSON invalide à la ligne ${lineNumber}`);
    }
    const timestamp = typeof row?.snapshot === 'string' ? Date.parse(row.snapshot) : NaN;
    if (!Number.isFinite(timestamp)) throw new Error(`snapshot ISO manquant à la ligne ${lineNumber}`);
    if (!SIGNALS.some((key) => typeof row[key] === 'number' && Number.isFinite(row[key]))) {
      throw new Error(`aucun signal numérique à la ligne ${lineNumber}`);
    }
    const snapshot = new Date(timestamp).toISOString();
    const day = snapshot.slice(0, 10);
    const previous = daily.get(day);
    if (!previous || timestamp > previous.timestamp) daily.set(day, { timestamp, row });
    if (daily.size > MAX_HISTORY_DAYS) throw new Error('trop de jours dans l’historique opérationnel');
    rows += 1;
    if (firstSnapshot === null || snapshot < firstSnapshot) firstSnapshot = snapshot;
    if (lastSnapshot === null || snapshot > lastSnapshot) lastSnapshot = snapshot;
  }

  for await (const chunk of chunks) {
    bytes += chunk.byteLength;
    if (bytes > maxBytes) throw new Error('historique opérationnel trop volumineux');
    pending += decoder.decode(chunk, { stream: true });
    let newline;
    while ((newline = pending.indexOf('\n')) !== -1) {
      consume(pending.slice(0, newline));
      pending = pending.slice(newline + 1);
    }
    if (Buffer.byteLength(pending, 'utf8') > MAX_HISTORY_LINE_BYTES) throw new Error('ligne historique trop volumineuse');
  }
  pending += decoder.decode();
  if (pending) consume(pending);
  if (!rows) throw new Error('historique opérationnel vide');
  const selected = [...daily].sort(([left], [right]) => left.localeCompare(right)).map(([, item]) => item.row);
  return {
    text: selected.map((row) => JSON.stringify(row)).join('\n') + '\n',
    rows,
    sampledRows: selected.length,
    bytes,
    firstSnapshot,
    lastSnapshot,
  };
}
