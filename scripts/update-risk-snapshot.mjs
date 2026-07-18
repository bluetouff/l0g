import { readFileSync, writeFileSync } from 'node:fs';

const RISK_PATH = 'public/risk.json';
const DEBT_SNAPSHOT_PATH = 'public/debt-latest.json';
const DEFAULT_RISK_URL = 'https://l0g.fr/risk.json';
const DEFAULT_DEBT_URL = 'https://debt.l0g.fr/latest.json';
const riskUrl = process.env.L0G_RISK_AGGREGATE_URL || DEFAULT_RISK_URL;
const debtUrl = process.env.DEBT_RISK_LATEST_URL || DEFAULT_DEBT_URL;
const attemptedAt = new Date().toISOString();

function assertNumber(value, label) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`${label} doit etre un nombre fini.`);
  }
  return value;
}

function statusFromScore(score) {
  if (score >= 80) return 'Stress';
  if (score >= 65) return 'Watch';
  if (score >= 50) return 'Elevated';
  return 'Calm';
}

function levelFromStatus(status) {
  switch (String(status).toLowerCase()) {
    case 'stress':
      return 'Stress';
    case 'watch':
      return 'Watch';
    case 'elevated':
      return 'Élevé';
    case 'calm':
      return 'Normal';
    default:
      return 'Signal';
  }
}

function toneFromStatus(status) {
  switch (String(status).toLowerCase()) {
    case 'stress':
      return 'stress';
    case 'watch':
    case 'elevated':
      return 'elevated';
    case 'calm':
      return 'calm';
    default:
      return 'moderate';
  }
}

function compactBucket(bucket) {
  return {
    key: bucket.bucket,
    label: bucket.label,
    score: bucket.score,
    status: bucket.status,
    weight: bucket.weight,
    metrics: bucket.metrics,
  };
}

function compactSource(source) {
  return {
    source: source.source,
    latestDate: source.latest_date,
    metrics: source.metrics,
    maxRisk: source.max_risk,
  };
}

function compactTopSignal(signal) {
  return {
    family: signal.family,
    name: signal.name,
    source: signal.source,
    date: signal.date,
    current: signal.current,
    unit: signal.unit,
    riskScore: signal.risk_score,
    signedZ: signal.signed_z,
    rationale: signal.rationale,
  };
}

function compactIssue(issue) {
  if (typeof issue === 'string') return issue;
  if (!issue || typeof issue !== 'object') return String(issue);
  const parts = [
    issue.source || issue.provider || issue.family || issue.name,
    issue.error || issue.message || issue.reason || issue.detail,
  ].filter(Boolean);
  if (parts.length) return parts.map(String).join(': ');
  return JSON.stringify(issue);
}

async function fetchJson(url, label) {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(15_000),
    headers: {
      accept: 'application/json',
      'user-agent': 'l0g-risk-snapshot/2.0 (+https://l0g.fr/api/)',
    },
  });
  if (!response.ok) {
    throw new Error(`${label} indisponible: HTTP ${response.status}`);
  }
  return response.json();
}

function safeError(error) {
  return String(error?.message || error || 'erreur inconnue')
    .replace(/\s+/g, ' ')
    .replace(/(api[_-]?key|token|authorization)=?[^&\s]*/gi, '$1=[redacted]')
    .slice(0, 240);
}

function isoOrNull(value) {
  if (!value || Number.isNaN(Date.parse(value))) return null;
  return new Date(value).toISOString();
}

function freshnessDefaults(item, key) {
  const durations = { us: 'PT36H', eu: 'PT36H', yen: 'PT12H', energie: 'PT6H', debt: 'PT6H' };
  return {
    ...item,
    sourceStatus: item.sourceStatus || 'ok',
    qualityStatus: item.qualityStatus || 'unknown',
    fallbackUsed: item.fallbackUsed === true,
    fallbackLayer: item.fallbackLayer || null,
    fallbackReason: item.fallbackReason || null,
    sourceUpdatedAt: isoOrNull(item.sourceUpdatedAt),
    sourcePublishedAt: isoOrNull(item.sourcePublishedAt || item.sourceUpdatedAt),
    retrievedAt: isoOrNull(item.retrievedAt) || attemptedAt,
    lastAttemptAt: isoOrNull(item.lastAttemptAt) || attemptedAt,
    lastSuccessAt: isoOrNull(item.lastSuccessAt) || attemptedAt,
    staleAfter: item.staleAfter || durations[key] || 'P1D',
    ageSeconds: typeof item.ageSeconds === 'number' ? item.ageSeconds : null,
    timelinessStatus: ['fresh', 'stale', 'unknown'].includes(item.timelinessStatus)
      ? item.timelinessStatus
      : 'unknown',
    sourceSnapshotUrl: item.sourceSnapshotUrl || null,
    warnings: Array.isArray(item.warnings) ? item.warnings.map(String).slice(0, 10) : [],
  };
}

function markFallback(item, key, reason, layer = 'site-build') {
  const current = freshnessDefaults(item, key);
  return {
    ...current,
    sourceStatus: 'fallback',
    qualityStatus: 'degraded',
    fallbackUsed: true,
    fallbackLayer: layer,
    fallbackReason: reason,
    lastAttemptAt: attemptedAt,
    warnings: [...new Set([reason, ...current.warnings])].slice(0, 10),
  };
}

function mergeAggregate(previous, aggregate) {
  if (!Array.isArray(aggregate?.indices)) {
    throw new Error('agrégateur: indices doit être un tableau');
  }
  const indices = aggregate.indices.map((item) => freshnessDefaults(item, item.key));
  return {
    ...previous,
    ...aggregate,
    schema: aggregate.schema || 'https://l0g.fr/schemas/risk-aggregate.json',
    version: aggregate.version || '1-legacy',
    generated: attemptedAt,
    updated: aggregate.updated || aggregate.generated || previous.updated || null,
    aggregateGeneratedAt: aggregate.generated || aggregate.updated || null,
    aggregateRetrievedAt: attemptedAt,
    indices,
    provenance: { ...(previous.provenance || {}), ...(aggregate.provenance || {}) },
  };
}

function aggregateFallback(previous, reason) {
  return {
    ...previous,
    generated: attemptedAt,
    aggregateRetrievedAt: null,
    indices: (previous.indices || []).map((item) =>
      item.key === 'debt' ? item : markFallback(item, item.key, reason)),
  };
}

function updateRiskSnapshot(risk, latest) {
  const overall = assertNumber(
    latest?.score?.current_stress ?? latest?.score?.overall,
    'score.current_stress',
  );
  const rounded = Math.round(overall);
  const status = latest?.score?.status || statusFromScore(overall);
  const generatedAt = latest?.generated_at;
  if (!generatedAt || Number.isNaN(Date.parse(generatedAt))) {
    throw new Error('generated_at doit etre une date ISO valide.');
  }

  if (!Array.isArray(risk.indices)) {
    throw new Error('public/risk.json doit exposer un tableau indices.');
  }

  const debtSignal = {
    key: 'debt',
    value: rounded,
    scale: 100,
    level: levelFromStatus(status),
    tone: toneFromStatus(status),
    sourceStatus: 'ok',
    qualityStatus: Array.isArray(latest.issues) && latest.issues.length ? 'degraded' : 'nominal',
    fallbackUsed: false,
    fallbackLayer: null,
    fallbackReason: null,
    sourceUpdatedAt: new Date(generatedAt).toISOString(),
    sourcePublishedAt: new Date(generatedAt).toISOString(),
    retrievedAt: attemptedAt,
    lastAttemptAt: attemptedAt,
    lastSuccessAt: attemptedAt,
    staleAfter: 'PT6H',
    ageSeconds: Math.max(0, Math.round((Date.parse(attemptedAt) - Date.parse(generatedAt)) / 1000)),
    timelinessStatus: Date.parse(attemptedAt) - Date.parse(generatedAt) > 6 * 3600 * 1000 ? 'stale' : 'fresh',
    sourceSnapshotUrl: latest.latest_json_url || debtUrl,
    warnings: Array.isArray(latest.issues) ? latest.issues.map(compactIssue).slice(0, 10) : [],
  };

  const index = risk.indices.findIndex((item) => item.key === 'debt');
  if (index === -1) {
    risk.indices.push(debtSignal);
  } else {
    risk.indices[index] = { ...risk.indices[index], ...debtSignal };
  }

  risk.provenance = {
    ...(risk.provenance || {}),
    debt: {
      label: latest.name || 'Debt Risk Radar',
      source: latest.public_url || 'https://debt.l0g.fr/',
      latestJsonUrl: latest.latest_json_url || debtUrl,
      methodology: 'https://l0g.fr/methodologie/debt-risk-radar/',
      calculator: 'https://github.com/bluetouff/debt-risk-radar',
      calculatorRevision: process.env.DEBT_RISK_CALCULATOR_REVISION || null,
      generatedAt,
      retrievedAt: attemptedAt,
      sourceStatus: debtSignal.sourceStatus,
      qualityStatus: debtSignal.qualityStatus,
      fallbackUsed: debtSignal.fallbackUsed,
      lastAttemptAt: debtSignal.lastAttemptAt,
      lastSuccessAt: debtSignal.lastSuccessAt,
      staleAfter: debtSignal.staleAfter,
      schemaVersion: latest.schema_version || null,
      scoreRaw: overall,
      scoreRounded: rounded,
      status,
      coverage: typeof latest?.score?.coverage === 'number' ? latest.score.coverage : null,
      coverageNote: latest?.score?.coverage_note || null,
      issues: Array.isArray(latest.issues) ? latest.issues.map(compactIssue) : [],
      thresholds: latest.thresholds || null,
      refresh: latest.refresh || null,
      scope: latest.scope || null,
      buckets: Array.isArray(latest?.score?.buckets) ? latest.score.buckets.map(compactBucket) : [],
      sources: Array.isArray(latest.sources) ? latest.sources.map(compactSource) : [],
      topSignals: Array.isArray(latest.top_signals) ? latest.top_signals.slice(0, 10).map(compactTopSignal) : [],
      calculation:
        'current_stress = overall_score(bucket_scores(metrics), exclude=cbo_projection, expected=current_stress_buckets, neutral_missing=50); value is Math.round(score.current_stress) from Debt Risk Radar latest.json.',
    },
  };

  return risk;
}

function updateSummary(risk) {
  const required = ['us', 'eu', 'yen', 'energie', 'debt'];
  const byKey = new Map((risk.indices || []).map((item) => [item.key, item]));
  const missing = required.filter((key) => !byKey.has(key)).map((key) => ({ key, reason: 'signal absent' }));
  const items = [...byKey.values()];
  const summary = {
    expected: required.length,
    present: items.length,
    ok: items.filter((item) => item.sourceStatus === 'ok').length,
    fallback: items.filter((item) => item.fallbackUsed === true).length,
    stale: items.filter((item) => item.timelinessStatus === 'stale').length,
    degraded: items.filter((item) => !['nominal'].includes(item.qualityStatus)).length,
    missing,
  };
  risk.status = !items.length
    ? 'failed'
    : summary.fallback || summary.stale || summary.degraded || summary.missing.length
      ? 'degraded'
      : 'ok';
  risk.summary = summary;
  risk.note =
    'Best-effort explicite : updated date l’assemblage amont ; la fraîcheur et les replis se lisent signal par signal.';
  return risk;
}

const previous = JSON.parse(readFileSync(RISK_PATH, 'utf8'));
let risk;
try {
  risk = mergeAggregate(previous, await fetchJson(riskUrl, 'Agrégateur risk.json'));
} catch (error) {
  const reason = `Agrégateur indisponible au build: ${safeError(error)}`;
  console.warn(reason);
  risk = aggregateFallback(previous, reason);
}

try {
  risk = updateRiskSnapshot(risk, await fetchJson(debtUrl, 'Debt Risk Radar latest.json'));
} catch (error) {
  const reason = `Debt Risk Radar indisponible au build: ${safeError(error)}`;
  console.warn(reason);
  const index = (risk.indices || []).findIndex((item) => item.key === 'debt');
  if (index >= 0) risk.indices[index] = markFallback(risk.indices[index], 'debt', reason);
  if (risk.provenance?.debt) {
    risk.provenance.debt = {
      ...risk.provenance.debt,
      sourceStatus: 'fallback',
      qualityStatus: 'degraded',
      fallbackUsed: true,
      fallbackReason: reason,
      lastAttemptAt: attemptedAt,
    };
  }
}

const updated = updateSummary(risk);
writeFileSync(RISK_PATH, `${JSON.stringify(updated, null, 2)}\n`);

const debt = updated.indices.find((item) => item.key === 'debt');
const debtProvenance = updated.provenance.debt;
if (debt && debtProvenance) {
  writeFileSync(
    DEBT_SNAPSHOT_PATH,
    `${JSON.stringify(
      {
        schema: 'https://l0g.fr/schemas/debt-risk-snapshot.json',
        version: '2',
        generated: debtProvenance.generatedAt,
        retrievedAt: debtProvenance.retrievedAt,
        status: debt.sourceStatus,
        signal: debt,
        provenance: debtProvenance,
      },
      null,
      2,
    )}\n`,
  );
}

console.log(
  `Risk snapshot -> ${updated.status}; ${updated.summary.present}/${updated.summary.expected} signaux; ` +
  `${updated.summary.fallback} repli(s), ${updated.summary.stale} ancien(s).`,
);
