import { parseCsv } from '../audit-indexation-cohort.mjs';
import { MAX_ROWS, VERSION, digest, safeEvidenceUrl } from './storage.mjs';

export const SOURCES = ['gsc', 'bing', 'bing-ai'];
export function requiredString(value, field, max = 2000) {
  if (typeof value !== 'string' || !value.trim() || value.length > max || /[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(value)) throw new Error(`invalid_${field}`);
  return value;
}
export function date(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) !== value) throw new Error('invalid_date');
  return value;
}
export function timestamp(value) {
  if (typeof value !== 'string' || !/Z$|[+-]\d{2}:\d{2}$/.test(value) || !Number.isFinite(Date.parse(value))) throw new Error('invalid_timestamp');
  return new Date(value).toISOString();
}
export function count(value, field, integer = true) {
  if (value === null || value === '') return null;
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || (integer && !Number.isSafeInteger(value))) throw new Error(`invalid_${field}`);
  return value;
}

export function normalizeSearchImport(source, document) {
  if (!SOURCES.includes(source) || document.schema_version !== VERSION || document.source !== source || document.format !== 'normalized-v1') throw new Error('import_schema_unknown');
  const meta = document.metadata;
  if (!meta || !Array.isArray(document.rows) || document.rows.length > MAX_ROWS) throw new Error('import_rows_invalid');
  const property = requiredString(meta.property, 'property');
  if (property !== 'sc-domain:l0g.fr' && property !== 'https://l0g.fr/') throw new Error('property_not_supported');
  const report = requiredString(meta.report, 'report', 100);
  const from = date(meta.period?.from), through = date(meta.period?.through);
  if (from > through) throw new Error('period_invalid');
  const timezone = requiredString(meta.timezone, 'timezone', 100);
  const exportedAt = timestamp(meta.exported_at);
  const dimensions = meta.dimensions;
  if (!Array.isArray(dimensions) || !dimensions.length || new Set(dimensions).size !== dimensions.length || dimensions.some(d => !['date', 'page', 'query', 'country', 'device', 'theme'].includes(d))) throw new Error('dimensions_invalid');
  if (!meta.filters || typeof meta.filters !== 'object' || Array.isArray(meta.filters) || typeof meta.complete !== 'boolean' || !Array.isArray(meta.limitations)) throw new Error('metadata_incomplete');
  const grain = { source, property, report, dimensions: [...dimensions].sort(), filters: meta.filters, timezone };
  const metrics = source === 'bing-ai' ? ['citations', 'cited_pages'] : ['clicks', 'impressions', 'position'];
  const seen = new Set();
  const rows = document.rows.map(row => {
    if (!row || typeof row !== 'object' || !row.dimensions || !row.metrics) throw new Error('row_invalid');
    if (Object.keys(row.dimensions).sort().join() !== [...dimensions].sort().join()) throw new Error('row_dimensions_invalid');
    const dims = Object.fromEntries(dimensions.map(key => {
      let value = requiredString(row.dimensions[key], key);
      if (key === 'date') { date(value); if (value < from || value > through) throw new Error('row_date_outside_period'); }
      if (key === 'page') value = safeEvidenceUrl(value);
      return [key, value];
    }));
    const key = digest(Object.entries(dims).sort());
    if (seen.has(key)) throw new Error('duplicate_grain');
    seen.add(key);
    if (Object.keys(row.metrics).some(key => !metrics.includes(key))) throw new Error('metric_unknown');
    const values = Object.fromEntries(metrics.map(key => [key, count(row.metrics[key] ?? null, key, key !== 'position')]));
    if (values.clicks !== null && values.impressions !== null && values.clicks > values.impressions) throw new Error('ctr_inputs_invalid');
    return { dimensions: dims, metrics: values };
  });
  return { schema_version: VERSION, source, format: 'normalized-v1', metadata: { ...meta, property, report, period: { from, through }, timezone, exported_at: exportedAt, dimensions }, grain, grain_id: digest(grain), rows };
}

export function csvDocument(source, text, metadata) {
  if (!metadata) throw new Error('csv_metadata_required');
  let fields = 1, expected = null, quoted = false, started = false, closed = false;
  for (let i = 0; i <= text.length; i++) {
    const char = text[i] ?? '\n';
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') i++;
      else if (char === '"') { quoted = false; closed = true; }
      continue;
    }
    if (char === '"') { if (started || closed) throw new Error('csv_shape_invalid'); quoted = true; started = true; }
    else if (char === ',') { fields++; started = false; closed = false; }
    else if (char === '\n') {
      if (started || fields > 1 || (char !== '\n' && char !== '\r')) {
        expected ??= fields;
        if (fields !== expected) throw new Error('csv_shape_invalid');
      }
      fields = 1; started = false; closed = false;
    } else if (char !== '\r') { if (closed) throw new Error('csv_shape_invalid'); started = true; }
  }
  if (quoted) throw new Error('csv_shape_invalid');
  const rows = parseCsv(text);
  if (rows.length > MAX_ROWS) throw new Error('import_rows_exceeded');
  const dims = metadata.dimensions;
  if (!Array.isArray(dims)) throw new Error('dimensions_invalid');
  const metrics = source === 'bing-ai' ? ['citations', 'cited_pages'] : ['clicks', 'impressions', 'position'];
  const allowed = new Set([...dims, ...metrics]);
  if (rows.some(row => Object.keys(row).some(k => !allowed.has(k)))) throw new Error('csv_schema_unknown');
  return normalizeSearchImport(source, { schema_version: VERSION, source, format: 'normalized-v1', metadata, rows: rows.map(row => ({ dimensions: Object.fromEntries(dims.map(d => [d, row[d]])), metrics: Object.fromEntries(metrics.map(m => {
    const raw = row[m];
    if (raw === undefined || raw === '') return [m, null];
    if (!/^\d+(?:\.\d+)?$/.test(raw)) throw new Error('csv_number_invalid');
    return [m, Number(raw)];
  })) })) });
}

// Different projections never become additive populations. Reject an overlap
// unless it is the exact same period being explicitly replaced.
export function mergeImports(imports, incoming, replace = false) {
  const same = imports.filter(i => i.grain_id === incoming.grain_id);
  const overlaps = same.filter(i => i.metadata.period.from <= incoming.metadata.period.through && i.metadata.period.through >= incoming.metadata.period.from);
  if (overlaps.some(i => i.content_hash === incoming.content_hash)) return imports;
  const exact = i => i.metadata.period.from === incoming.metadata.period.from && i.metadata.period.through === incoming.metadata.period.through;
  if (overlaps.length && (!replace || !overlaps.every(exact))) throw new Error('import_overlap_requires_exact_replacement');
  return [...imports.filter(i => !overlaps.includes(i)), incoming];
}

export function searchSummary(document) {
  const ratio = key => document.rows.length && document.rows.every(r => r.metrics[key] !== null) ? document.rows.reduce((sum, r) => sum + r.metrics[key], 0) : null;
  const clicks = document.source === 'bing-ai' ? null : ratio('clicks');
  const impressions = document.source === 'bing-ai' ? null : ratio('impressions');
  return { source: document.source, report: document.metadata.report, period: document.metadata.period, dimensions: document.metadata.dimensions, state: document.rows.length === 0 ? 'no_data' : document.metadata.complete ? 'measured' : 'partial', rows: document.rows.length, clicks, impressions, ctr: impressions > 0 && clicks !== null ? clicks / impressions : null, position: 'non additive; inspect rows', citations: document.source === 'bing-ai' && document.rows.length === 1 ? document.rows[0].metrics.citations : null, evidence: document.evidence, formula: 'CTR = sum(clicks) / sum(impressions), only within this export grain; no addition across projections. Bing citation rows are not summed without a verified additive definition.' };
}
