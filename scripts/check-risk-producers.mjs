import { appendFile } from 'node:fs/promises';
import { auditRiskFlow, githubAnnotation, renderRiskAuditMarkdown } from './risk-producer-audit.mjs';

const URLS = {
  aggregate: process.env.L0G_RISK_URL || 'https://l0g.fr/risk.json',
  eu: process.env.L0G_EU_URL || 'https://euro.l0g.fr/snapshot.json',
  yen: process.env.L0G_YEN_URL || 'https://yct.l0g.fr/data.json',
  energy: process.env.L0G_ENERGY_URL || 'https://energie.l0g.fr/snapshot.json',
  debt: process.env.L0G_DEBT_URL || 'https://debt.l0g.fr/latest.json',
  rawHistory: process.env.L0G_RAW_HISTORY_URL || 'https://l0g.fr/api/v1/history.ndjson',
  canonicalHistory: process.env.L0G_CANONICAL_HISTORY_URL || 'https://l0g.fr/api/v1/signals/history.json',
};

async function get(url, type = 'json') {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(20_000),
    headers: { accept: type === 'json' ? 'application/json' : 'application/x-ndjson', 'user-agent': 'l0g-risk-flow-monitor/1.0' },
  });
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  return type === 'json' ? response.json() : response.text();
}

async function publish(report) {
  console.log(JSON.stringify(report, null, 2));
  for (const error of report.errors || []) console.error(githubAnnotation('error', error));
  for (const warning of report.warnings || []) console.error(githubAnnotation('warning', warning));
  if (process.env.GITHUB_STEP_SUMMARY) {
    await appendFile(process.env.GITHUB_STEP_SUMMARY, renderRiskAuditMarkdown(report), 'utf8');
  }
}

try {
  const [aggregate, eu, yen, energy, debt, rawText, canonicalHistory] = await Promise.all([
    get(URLS.aggregate), get(URLS.eu), get(URLS.yen), get(URLS.energy), get(URLS.debt),
    get(URLS.rawHistory, 'ndjson'), get(URLS.canonicalHistory),
  ]);
  const lines = rawText.split('\n').filter(Boolean);
  const rawLast = lines.length ? JSON.parse(lines.at(-1)) : null;
  const report = auditRiskFlow({ aggregate, eu, yen, energy, debt, rawLast, canonicalHistory });
  await publish(report);
  if (!report.ok) process.exitCode = 1;
} catch (error) {
  const message = String(error?.message || error);
  await publish({
    checkedAt: new Date().toISOString(),
    ok: false,
    errors: [`collecte impossible: ${message}`],
    warnings: [],
    summary: {},
  });
  process.exitCode = 1;
}
