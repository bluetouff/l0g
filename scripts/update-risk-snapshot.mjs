import { readFileSync, writeFileSync } from 'node:fs';

const RISK_PATH = 'public/risk.json';
const DEBT_SNAPSHOT_PATH = 'public/debt-latest.json';
const DEFAULT_DEBT_URL = 'https://debt.l0g.fr/latest.json';
const debtUrl = process.env.DEBT_RISK_LATEST_URL || DEFAULT_DEBT_URL;

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

async function fetchDebtSnapshot() {
  const response = await fetch(debtUrl, {
    headers: {
      accept: 'application/json',
      'user-agent': 'l0g-risk-snapshot/1.0 (+https://l0g.fr/api/)',
    },
  });
  if (!response.ok) {
    throw new Error(`Debt Risk Radar latest.json indisponible: HTTP ${response.status}`);
  }
  return response.json();
}

function updateRiskSnapshot(risk, latest) {
  const overall = assertNumber(latest?.score?.overall, 'score.overall');
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
  };

  const index = risk.indices.findIndex((item) => item.key === 'debt');
  if (index === -1) {
    risk.indices.push(debtSignal);
  } else {
    risk.indices[index] = { ...risk.indices[index], ...debtSignal };
  }

  risk.updated = generatedAt;
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
      retrievedAt: new Date().toISOString(),
      schemaVersion: latest.schema_version || null,
      scoreRaw: overall,
      scoreRounded: rounded,
      status,
      issues: Array.isArray(latest.issues) ? latest.issues.map((issue) => String(issue)) : [],
      thresholds: latest.thresholds || null,
      refresh: latest.refresh || null,
      scope: latest.scope || null,
      buckets: Array.isArray(latest?.score?.buckets) ? latest.score.buckets.map(compactBucket) : [],
      sources: Array.isArray(latest.sources) ? latest.sources.map(compactSource) : [],
      topSignals: Array.isArray(latest.top_signals) ? latest.top_signals.slice(0, 10).map(compactTopSignal) : [],
      calculation:
        'score_global = overall_score(bucket_scores(metrics)); value is Math.round(score.overall) from Debt Risk Radar latest.json.',
    },
  };

  return risk;
}

const risk = JSON.parse(readFileSync(RISK_PATH, 'utf8'));
const latest = await fetchDebtSnapshot();
const updated = updateRiskSnapshot(risk, latest);
writeFileSync(RISK_PATH, `${JSON.stringify(updated, null, 2)}\n`);

const debt = updated.indices.find((item) => item.key === 'debt');
const debtProvenance = updated.provenance.debt;
writeFileSync(
  DEBT_SNAPSHOT_PATH,
  `${JSON.stringify(
    {
      schema: 'https://l0g.fr/schemas/debt-risk-snapshot.json',
      version: '1',
      generated: debtProvenance.generatedAt,
      retrievedAt: debtProvenance.retrievedAt,
      signal: debt,
      provenance: debtProvenance,
    },
    null,
    2,
  )}\n`,
);

console.log(`Debt Risk Radar -> ${debt.value}/100 (${debt.level}) from ${debtUrl}`);
