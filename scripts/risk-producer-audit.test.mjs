import assert from 'node:assert/strict';
import test from 'node:test';
import { auditRiskFlow, githubAnnotation, renderRiskAuditMarkdown } from './risk-producer-audit.mjs';

const now = '2026-07-18T10:00:00Z';
const generated = { eu: '2026-07-18T07:49:00Z', yen: '2026-07-18T04:17:33Z', energie: '2026-07-18T09:01:06Z', debt: '2026-07-18T09:57:57Z' };
const indices = ['us', 'eu', 'yen', 'energie', 'debt'].map((key) => ({
  key,
  value: key === 'eu' ? 41 : key === 'energie' ? 42 : key === 'debt' ? 54 : 40,
  sourceStatus: 'ok',
  qualityStatus: key === 'energie' ? 'official-delayed' : 'nominal',
  fallbackUsed: key === 'energie',
  fallbackLayer: key === 'energie' ? 'producer' : null,
  sourceUpdatedAt: generated[key] || '2026-07-18T08:00:00Z',
  observedAt: '2026-07-17T00:00:00Z',
  lastAttemptAt: '2026-07-18T10:00:00Z',
  lastSuccessAt: '2026-07-18T10:00:00Z',
  timelinessStatus: 'fresh',
  producerRepository: `https://github.com/bluetouff/${key}`,
  producerRevision: `${key}-revision`,
  producerRevisionStatus: 'reported',
}));

function fixture() {
  const current = Object.fromEntries(indices.map((item) => [item.key, {
    instrument: item.key,
    value: item.value,
    observedAt: item.observedAt,
    backtestUsable: true,
    sourceStatus: item.sourceStatus,
    qualityStatus: item.qualityStatus,
  }]));
  return {
    aggregate: { version: '2', status: 'degraded', generated: now, software: { revision: 'abc123', revisionStatus: 'reported', sourceSha256: 'a'.repeat(64) }, indices: indices.map((item) => ({ ...item })) },
    eu: { generated_at: generated.eu, global_score: 41.2 },
    yen: { generated: generated.yen },
    energy: { generated: generated.energie, composite: { score: 42.1 }, series: { brent: { label: 'Brent', date: '2026-07-13', tip_source: 'eia' }, wti: { label: 'WTI', date: '2026-07-13', tip_source: 'eia' } } },
    debt: { generated_at: generated.debt, score: { current_stress: 54.2 } },
    confluence: {
      version: '2',
      updated: '2026-07-18T09:55:00Z',
      retrievedAt: '2026-07-18T09:55:00Z',
      lastAttemptAt: '2026-07-18T09:55:00Z',
      lastSuccessAt: '2026-07-18T09:55:00Z',
      sourceStatus: 'ok',
      qualityStatus: 'limited',
      fallbackUsed: false,
      freshness: {
        institutionalReportDate: '2026-06-30',
        upstreamServedFromCache: true,
        edgarRefreshVerified: false,
      },
      items: [{ ticker: 'TEST', score: 70, quadrant: 'conviction' }],
    },
    rawLast: { snapshot: '2026-07-18T09:52:00Z', debt: 54 },
    canonicalHistory: { coverage: { observations: 200, instruments: ['us', 'eu', 'yen', 'energie', 'debt'], operationalImport: { status: 'ok' } } },
    currentSignals: { version: '2', generated: now, coverage: { currentObservations: 5 }, current },
  };
}

test('le repli EIA officiel est visible mais accepté', () => {
  const report = auditRiskFlow(fixture(), now);
  assert.equal(report.ok, true);
  assert.ok(report.warnings.some((warning) => warning.includes('officielle différée')));
});

test('un ancien score conservé par l’agrégateur fait échouer le moniteur', () => {
  const input = fixture();
  input.aggregate.indices[0] = { ...input.aggregate.indices[0], sourceStatus: 'fallback', fallbackReason: 'HTTP 503' };
  const report = auditRiskFlow(input, now);
  assert.equal(report.ok, false);
  assert.ok(report.errors.some((error) => error.includes('repli agrégateur actif')));
});

test('une date économique absente fait échouer le moniteur', () => {
  const input = fixture();
  delete input.aggregate.indices[0].observedAt;
  const report = auditRiskFlow(input, now);
  assert.equal(report.ok, false);
  assert.ok(report.errors.some((error) => error.includes('us: observedAt absent')));
});

test('la surface courante ne peut plus perdre observedAt silencieusement', () => {
  const input = fixture();
  input.currentSignals.current.eu.observedAt = null;
  input.currentSignals.current.eu.backtestUsable = false;
  input.currentSignals.current.eu.sourceStatus = 'fallback';
  const report = auditRiskFlow(input, now);
  assert.equal(report.ok, false);
  assert.ok(report.errors.some((error) => error.includes('signaux courants: eu observedAt absent')));
  assert.ok(report.errors.some((error) => error.includes('signaux courants: eu non exploitable')));
  assert.ok(report.errors.some((error) => error.includes('signaux courants: eu encore en fallback')));
});

test('une publication inchangée reste saine après un contrôle producteur récent', () => {
  const input = fixture();
  const yen = input.aggregate.indices.find((item) => item.key === 'yen');
  input.yen.generated = '2026-07-17T04:17:33Z';
  yen.sourceUpdatedAt = input.yen.generated;
  yen.sourceCheckedAt = '2026-07-18T09:55:00Z';
  yen.timelinessStatus = 'fresh';
  const report = auditRiskFlow(input, now);
  assert.equal(report.ok, true);
  assert.ok(!report.errors.some((error) => error.includes('yen: producteur ancien')));
});

test('un échec explique sa cause dans le résumé GitHub et dans une annotation sûre', () => {
  const input = fixture();
  input.aggregate.version = '1-legacy';
  const report = auditRiskFlow(input, now);
  const markdown = renderRiskAuditMarkdown(report);
  assert.match(markdown, /\| Résultat \| ÉCHEC \|/);
  assert.match(markdown, /agrégateur: contrat v2 absent/);
  assert.equal(githubAnnotation('error', 'ligne 1\n100%'), '::error::ligne 1%0A100%25');
  const hostile = renderRiskAuditMarkdown({ ok: false, errors: ['<script>|x'], summary: {} });
  assert.equal(hostile.includes('<script>'), false);
  assert.match(hostile, /&lt;script&gt;\\\|x/);
});

test('un snapshot publié après la tentative est une course visible et non une rupture', () => {
  const input = fixture();
  input.yen.generated = '2026-07-18T10:00:03Z';
  const report = auditRiskFlow(input, now);
  assert.equal(report.ok, true);
  assert.ok(report.warnings.some((warning) => warning.includes('publié après la tentative')));
});

test('la valeur du nouveau snapshot attend le prochain cycle sans faux échec', () => {
  const input = fixture();
  input.energy.generated = '2026-07-18T10:00:03Z';
  input.energy.composite.score = 43.8;
  const report = auditRiskFlow(input, now);
  assert.equal(report.ok, true);
  assert.ok(report.warnings.some((warning) => warning.includes('energie: nouveau snapshot publié après la tentative')));
  assert.ok(!report.errors.some((error) => error.includes('valeur agrégée')));
});

test('une date différente déjà disponible lors de la tentative reste une erreur', () => {
  const input = fixture();
  input.yen.generated = '2026-07-18T09:00:00Z';
  const report = auditRiskFlow(input, now);
  assert.equal(report.ok, false);
  assert.ok(report.errors.some((error) => error.includes('date agrégée différente')));
});

test('une valeur différente sans publication concurrente reste une erreur', () => {
  const input = fixture();
  input.energy.composite.score = 43.8;
  const report = auditRiskFlow(input, now);
  assert.equal(report.ok, false);
  assert.ok(report.errors.some((error) => error.includes('valeur agrégée 42 != producteur 44')));
});

test('les demi-unités suivent le même arrondi vers pair que l’agrégateur Python', () => {
  const input = fixture();
  const energy = input.aggregate.indices.find((item) => item.key === 'energie');
  input.energy.composite.score = 46.5;
  energy.value = 46;
  assert.equal(auditRiskFlow(input, now).ok, true);

  input.energy.composite.score = 47.5;
  energy.value = 48;
  assert.equal(auditRiskFlow(input, now).ok, true);
});

test('une horloge producteur franchement future reste une erreur', () => {
  const input = fixture();
  input.yen.generated = '2026-07-18T10:06:00Z';
  const report = auditRiskFlow(input, now);
  assert.equal(report.ok, false);
  assert.ok(report.errors.some((error) => error.includes('plus de cinq minutes dans le futur')));
});

test('une date producteur sans fuseau explicite rompt le contrat', () => {
  const input = fixture();
  input.eu.generated_at = '2026-07-18 07:49';
  const report = auditRiskFlow(input, now);
  assert.equal(report.ok, false);
  assert.ok(report.errors.some((error) => error.includes('eu: date producteur sans fuseau explicite')));
});

test('une qualité dégradée reste verte mais sa cause remonte dans GitHub', () => {
  const input = fixture();
  const energy = input.aggregate.indices.find((item) => item.key === 'energie');
  energy.qualityStatus = 'degraded';
  energy.fallbackUsed = false;
  energy.fallbackLayer = null;
  energy.warnings = ['WTI EIA quotidien différé de six jours'];
  const report = auditRiskFlow(input, now);
  assert.equal(report.ok, true);
  assert.ok(report.warnings.some((warning) => warning.includes('WTI EIA quotidien différé')));
});

test('la provenance EDGAR partielle reste visible sans simuler une panne', () => {
  const report = auditRiskFlow(fixture(), now);
  assert.equal(report.ok, true);
  assert.ok(report.warnings.some((warning) => warning.includes('fraîcheur EDGAR amont non attestée')));
  assert.ok(report.warnings.some((warning) => warning.includes('servie depuis son cache')));
});

test('un repli ou une récupération Confluence trop ancienne fait échouer le moniteur', () => {
  const input = fixture();
  input.confluence.sourceStatus = 'fallback';
  input.confluence.fallbackUsed = true;
  input.confluence.fallbackReason = 'HTTP 503';
  input.confluence.lastSuccessAt = '2026-07-18T08:30:00Z';
  const report = auditRiskFlow(input, now);
  assert.equal(report.ok, false);
  assert.ok(report.errors.some((error) => error.includes('confluence: repli actif')));
  assert.ok(report.errors.some((error) => error.includes('dernière récupération trop ancienne')));
});
