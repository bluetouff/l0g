import { readFileSync } from 'node:fs';

const requiredSignals = ['us', 'eu', 'yen', 'energie', 'debt'];
const risk = JSON.parse(readFileSync('public/risk.json', 'utf8'));
const debtSnapshot = JSON.parse(readFileSync('public/debt-latest.json', 'utf8'));
const riskScript = readFileSync('public/risk.js', 'utf8');

if (!Array.isArray(risk.indices)) {
  throw new Error('public/risk.json doit exposer un tableau indices.');
}

const byKey = new Map(risk.indices.map((item) => [item.key, item]));
const missing = requiredSignals.filter((key) => !byKey.has(key));
if (missing.length) {
  throw new Error(`public/risk.json ne contient pas les signaux requis : ${missing.join(', ')}.`);
}

for (const key of requiredSignals) {
  const item = byKey.get(key);
  if (typeof item.value !== 'number' || item.value < 0 || item.value > (item.scale ?? 100)) {
    throw new Error(`Signal ${key}: value doit etre numerique et bornee par scale.`);
  }
  if (!item.level || !item.tone) {
    throw new Error(`Signal ${key}: level et tone sont requis.`);
  }
  if (!['ok', 'fallback'].includes(item.sourceStatus)) {
    throw new Error(`Signal ${key}: sourceStatus doit valoir ok ou fallback.`);
  }
  if (!['nominal', 'unknown', 'degraded', 'official-delayed'].includes(item.qualityStatus)) {
    throw new Error(`Signal ${key}: qualityStatus non reconnu.`);
  }
  if (typeof item.fallbackUsed !== 'boolean') {
    throw new Error(`Signal ${key}: fallbackUsed doit etre booleen.`);
  }
  if (!item.lastAttemptAt || Number.isNaN(Date.parse(item.lastAttemptAt))) {
    throw new Error(`Signal ${key}: lastAttemptAt doit etre une date ISO.`);
  }
  if (item.lastSuccessAt && Number.isNaN(Date.parse(item.lastSuccessAt))) {
    throw new Error(`Signal ${key}: lastSuccessAt invalide.`);
  }
  if (!/^P(?:\d+D|T\d+H)$/.test(item.staleAfter || '')) {
    throw new Error(`Signal ${key}: staleAfter doit etre une duree ISO en jours ou heures.`);
  }
  if (!['fresh', 'stale', 'unknown'].includes(item.timelinessStatus)) {
    throw new Error(`Signal ${key}: timelinessStatus non reconnu.`);
  }
  const dataDate = item.sourcePublishedAt || item.sourceUpdatedAt || item.observedAt;
  if (!dataDate && item.timelinessStatus !== 'unknown') {
    throw new Error(`Signal ${key}: une donnée sans date producteur/observation ne peut pas être déclarée fraîche.`);
  }
  if (item.sourceStatus === 'fallback' && (!item.fallbackUsed || !item.fallbackReason)) {
    throw new Error(`Signal ${key}: un repli doit exposer fallbackUsed et fallbackReason.`);
  }
}

if (!['ok', 'degraded', 'failed'].includes(risk.status)) {
  throw new Error('public/risk.json: status doit valoir ok, degraded ou failed.');
}
if (risk.summary?.expected !== requiredSignals.length || risk.summary?.present !== requiredSignals.length) {
  throw new Error('public/risk.json: summary doit couvrir les cinq signaux.');
}
if (!risk.generated || Number.isNaN(Date.parse(risk.generated))) {
  throw new Error('public/risk.json: generated doit dater le build du snapshot.');
}

if (/\bFALLBACK\b|render\s*\(\s*\{/.test(riskScript)) {
  throw new Error('public/risk.js ne doit pas embarquer de valeur de fallback pour les signaux.');
}

const debtProvenance = risk.provenance?.debt;
if (!debtProvenance || debtProvenance.latestJsonUrl !== 'https://debt.l0g.fr/latest.json') {
  throw new Error('Signal debt: provenance.latestJsonUrl doit pointer vers https://debt.l0g.fr/latest.json.');
}
if (typeof debtProvenance.scoreRaw !== 'number' || typeof debtProvenance.scoreRounded !== 'number') {
  throw new Error('Signal debt: provenance.scoreRaw et scoreRounded sont requis.');
}
if (Array.isArray(debtProvenance.issues) && debtProvenance.issues.some((issue) => issue === '[object Object]')) {
  throw new Error('Signal debt: provenance.issues contient une serialisation [object Object].');
}
if (byKey.get('debt').value !== debtProvenance.scoreRounded) {
  throw new Error('Signal debt: value doit etre egal a provenance.scoreRounded.');
}
if (debtSnapshot.signal?.key !== 'debt') {
  throw new Error('public/debt-latest.json doit exposer signal.key=debt.');
}
if (debtSnapshot.signal.value !== debtProvenance.scoreRounded) {
  throw new Error('public/debt-latest.json: signal.value doit etre egal a provenance.scoreRounded.');
}
if (debtSnapshot.provenance?.latestJsonUrl !== 'https://debt.l0g.fr/latest.json') {
  throw new Error('public/debt-latest.json: provenance.latestJsonUrl doit pointer vers latest.json.');
}

console.log(`Risk snapshot OK: ${requiredSignals.join(', ')}`);
