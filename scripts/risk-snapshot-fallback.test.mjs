import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const updater = new URL('scripts/update-risk-snapshot.mjs', root).href;
const validator = new URL('scripts/validate-risk-snapshot.mjs', root).pathname;
const previous = JSON.parse(await readFile(new URL('public/risk.json', root), 'utf8'));
const confluence = JSON.parse(await readFile(new URL('public/confluence.json', root), 'utf8'));
const riskClient = await readFile(new URL('src/scripts/risk.js', root), 'utf8');

// Deliberately distinct fixture values expose accidental joins across snapshots.
const oldDebt = previous.indices.find((item) => item.key === 'debt');
Object.assign(oldDebt, {
  value: 41,
  observedAt: '2026-09-01T00:00:00.000Z',
  observedAtMethod: 'latest-component-observation',
  observationWindow: { oldest: '2026-08-01T00:00:00.000Z', latest: '2026-09-01T00:00:00.000Z' },
  sourcePublishedAt: '2026-09-02T10:00:00.000Z',
  sourceUpdatedAt: '2026-09-02T10:00:00.000Z',
  lastSuccessAt: '2026-09-02T11:00:00.000Z',
});
previous.provenance.debt.scoreRaw = 40.7;
previous.provenance.debt.scoreRounded = 41;
previous.provenance.debt.generatedAt = oldDebt.sourcePublishedAt;
previous.provenance.debt.lastSuccessAt = oldDebt.lastSuccessAt;
const aggregate = structuredClone(previous);
aggregate.indices.find((item) => item.key === 'debt').value = 55;
delete aggregate.provenance;
const availableDebt = {
  generated_at: '2026-09-10T10:00:00Z',
  score: { current_stress: 53.4, status: 'Elevated' },
  sources: [{ source: 'fixture', latest_date: '2026-09-09' }],
};

async function runSnapshot(t, { debt = { score: { current_stress: null } }, aggregateValue = aggregate, prior = previous } = {}) {
  const directory = await mkdtemp(join(tmpdir(), 'l0g-debt-fallback-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await mkdir(join(directory, 'public'));
  await mkdir(join(directory, 'src/scripts'), { recursive: true });
  const input = `${JSON.stringify(prior)}\n`;
  await writeFile(join(directory, 'public/risk.json'), input);
  await writeFile(join(directory, 'public/confluence.json'), JSON.stringify(confluence));
  await writeFile(join(directory, 'src/scripts/risk.js'), riskClient);
  const responses = join(directory, 'responses.json');
  await writeFile(responses, JSON.stringify({
    'https://l0g.fr/risk.json': aggregateValue,
    'https://debt.l0g.fr/latest.json': debt,
    'https://l0g.fr/confluence.json': confluence,
  }));
  const code = `
    import { readFileSync } from 'node:fs';
    const responses = JSON.parse(readFileSync(process.argv[1], 'utf8'));
    globalThis.fetch = async (url) => {
      if (!Object.hasOwn(responses, url)) throw new Error('Unexpected test URL');
      if (responses[url] === null) throw new Error('Fixture provider unavailable');
      return Response.json(responses[url]);
    };
    await import(${JSON.stringify(updater)});
  `;
  const env = { ...process.env };
  for (const name of ['L0G_RISK_AGGREGATE_URL', 'DEBT_RISK_LATEST_URL', 'L0G_CONFLUENCE_URL']) delete env[name];
  const result = spawnSync(process.execPath, ['--input-type=module', '--eval', code, responses], {
    cwd: directory, env, encoding: 'utf8', timeout: 10_000,
  });
  const output = await readFile(join(directory, 'public/risk.json'), 'utf8');
  if (result.status !== 0) return { result, output, input };
  const validation = spawnSync(process.execPath, [validator], { cwd: directory, encoding: 'utf8', timeout: 10_000 });
  assert.equal(validation.status, 0, validation.stderr);
  return {
    result,
    risk: JSON.parse(output),
    snapshot: JSON.parse(await readFile(join(directory, 'public/debt-latest.json'), 'utf8')),
  };
}

function assertCoherentFallback({ result, risk, snapshot }) {
  assert.equal(result.status, 0, result.stderr);
  const signal = risk.indices.find((item) => item.key === 'debt');
  assert.equal(signal.value, 41);
  assert.equal(signal.sourceStatus, 'fallback');
  assert.equal(signal.fallbackUsed, true);
  assert.equal(signal.backtestUsable, false);
  assert.equal(signal.observedAt, oldDebt.observedAt);
  assert.equal(signal.sourcePublishedAt, oldDebt.sourcePublishedAt);
  assert.equal(signal.lastSuccessAt, oldDebt.lastSuccessAt);
  assert.equal(risk.provenance.debt.scoreRaw, 40.7);
  assert.equal(risk.provenance.debt.scoreRounded, 41);
  assert.equal(risk.provenance.debt.generatedAt, previous.provenance.debt.generatedAt);
  assert.equal(risk.provenance.debt.sourceStatus, 'fallback');
  assert.equal(risk.provenance.debt.lastSuccessAt, previous.provenance.debt.lastSuccessAt);
  assert.equal(snapshot.status, 'fallback');
  assert.deepEqual(snapshot.signal, signal);
  assert.deepEqual(snapshot.provenance, risk.provenance.debt);
}

test('an unavailable debt score preserves the previous observation and its provenance together', async (t) => {
  assertCoherentFallback(await runSnapshot(t));
});

test('a debt transport failure uses the same explicitly degraded pair', async (t) => {
  assertCoherentFallback(await runSnapshot(t, { debt: null }));
});

test('an explicit null current score cannot be replaced by a legacy overall score', async (t) => {
  assertCoherentFallback(await runSnapshot(t, { debt: { score: { current_stress: null, overall: 99 } } }));
});

test('simultaneous provider failures preserve the dated pair', async (t) => {
  assertCoherentFallback(await runSnapshot(t, { debt: null, aggregateValue: null }));
});

test('a valid direct publication replaces both score and provenance', async (t) => {
  const { result, risk, snapshot } = await runSnapshot(t, { debt: availableDebt });
  assert.equal(result.status, 0, result.stderr);
  const signal = risk.indices.find((item) => item.key === 'debt');
  assert.equal(signal.value, 53);
  assert.equal(signal.sourceStatus, 'ok');
  assert.equal(signal.fallbackUsed, false);
  assert.equal(signal.observedAt, '2026-09-09T00:00:00.000Z');
  assert.equal(risk.provenance.debt.scoreRaw, 53.4);
  assert.equal(risk.provenance.debt.scoreRounded, 53);
  assert.equal(risk.provenance.debt.generatedAt, availableDebt.generated_at);
  assert.deepEqual(snapshot.signal, signal);
  assert.deepEqual(snapshot.provenance, risk.provenance.debt);
});

test('an incoherent prior pair fails before writing a new snapshot', async (t) => {
  const prior = structuredClone(previous);
  prior.provenance.debt.scoreRounded = 42;
  const { result, output, input } = await runSnapshot(t, { prior });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /aucune paire valeur\/provenance cohérente/);
  assert.equal(output, input);
});
