import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import test from 'node:test';

const historyRelative = `.cache/signal-history-provenance-${process.pid}.ndjson`;
const metaRelative = `.cache/signal-history-provenance-${process.pid}.meta.json`;
const historyPath = resolve(historyRelative);
const metaPath = resolve(metaRelative);
const repository = 'https://github.com/bluetouff/macro_dashboard';
const revision = '69480400cddaf60c6be49bdd742edf8bfc7bc5bd';

test('la méthode opérationnelle est attribuée uniquement à la révision producteur attestée', async () => {
  await mkdir(dirname(historyPath), { recursive: true });
  await writeFile(historyPath, [
    JSON.stringify({
      snapshot: '2026-07-30T23:55:00Z',
      us: 31,
      us_source_status: 'ok',
      us_quality_status: 'nominal',
      us_fallback: false,
      us_producer_repository: repository,
      us_producer_revision: revision,
      us_producer_revision_status: 'reported',
    }),
    JSON.stringify({
      snapshot: '2026-07-31T23:55:00Z',
      us: 32,
      us_source_status: 'ok',
      us_quality_status: 'nominal',
      us_fallback: false,
      us_producer_repository: repository,
      us_producer_revision: '0'.repeat(40),
      us_producer_revision_status: 'reported',
    }),
  ].join('\n') + '\n');
  await writeFile(metaPath, '{}\n');
  process.env.L0G_OPERATIONAL_HISTORY_PATH = historyRelative;
  process.env.L0G_OPERATIONAL_HISTORY_META_PATH = metaRelative;
  process.env.L0G_BUILD_TIMESTAMP = '2026-08-03T00:00:00Z';

  try {
    const { buildSignalHistorySurface } = await import(`../src/lib/signal-history.ts?test=${process.pid}`);
    const observations = buildSignalHistorySurface().observations.filter((item) => (
      item.instrument === 'us' && item.evidenceTier === 'operational-archive'
    ));
    const attested = observations.find((item) => item.seriesDate === '2026-07-30T23:55:00.000Z');
    const divergent = observations.find((item) => item.seriesDate === '2026-07-31T23:55:00.000Z');

    assert.equal(attested?.methodologyVersion, '2.0.0');
    assert.equal(attested?.methodologyVersionStatus, 'versioned');
    assert.equal(attested?.calculatorRepo, repository);
    assert.equal(attested?.calculatorRevision, revision);
    assert.equal(divergent?.methodologyVersion, null);
    assert.equal(divergent?.methodologyVersionStatus, 'unversioned-legacy');
    assert.equal(divergent?.calculatorRevision, null);
  } finally {
    await Promise.all([rm(historyPath, { force: true }), rm(metaPath, { force: true })]);
  }
});

test('la valeur native courante reste distincte de la normalisation 0-100', async () => {
  const temporary = await mkdtemp(resolve(tmpdir(), 'l0g-signal-history-'));
  const previousCwd = process.cwd();
  await mkdir(resolve(temporary, 'public'), { recursive: true });
  await writeFile(resolve(temporary, 'public/risk.json'), JSON.stringify({
    updated: '2026-08-03T08:00:00Z',
    indices: [{
      key: 'us',
      value: 31,
      rawValue: 0.04,
      scale: 100,
      level: 'Modéré',
      tone: 'moderate',
      sourceStatus: 'ok',
      qualityStatus: 'nominal',
      fallbackUsed: false,
      sourceUpdatedAt: '2026-08-03T04:03:17Z',
    }],
  }));

  try {
    process.chdir(temporary);
    const { buildSignalHistorySurface } = await import(`../src/lib/signal-history.ts?raw=${process.pid}`);
    const current = buildSignalHistorySurface().observations.find((item) => (
      item.instrument === 'us' && item.evidenceTier === 'current-snapshot'
    ));

    assert.equal(current?.value, 31);
    assert.equal(current?.rawValue, 0.04);
  } finally {
    process.chdir(previousCwd);
    await rm(temporary, { force: true, recursive: true });
  }
});
