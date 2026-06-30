import { readFileSync } from 'node:fs';

const requiredSignals = ['us', 'eu', 'yen', 'energie', 'debt'];
const risk = JSON.parse(readFileSync('public/risk.json', 'utf8'));
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
if (byKey.get('debt').value !== debtProvenance.scoreRounded) {
  throw new Error('Signal debt: value doit etre egal a provenance.scoreRounded.');
}

console.log(`Risk snapshot OK: ${requiredSignals.join(', ')}`);
