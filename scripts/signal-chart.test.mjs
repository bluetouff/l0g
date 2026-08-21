import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSignalChartSnapshot, directionForDelta } from '../src/lib/signal-chart.ts';

const point = (date, value) => ({
  date,
  value,
  evidence: 'attested-archive',
  methodologyVersion: '1.0.0',
});
test('classifie les mouvements avec une zone stable de 0,5 point', () => {
  assert.equal(directionForDelta(0.5), 'flat');
  assert.equal(directionForDelta(-0.5), 'flat');
  assert.equal(directionForDelta(0.51), 'up');
  assert.equal(directionForDelta(-0.51), 'down');
  assert.equal(directionForDelta(null), 'missing');
});

test('compare au dernier point publié au plus tard au début de la fenêtre', () => {
  const start = Date.parse('2026-08-14T00:00:00Z');
  const end = Date.parse('2026-08-21T23:59:59Z');
  const snapshot = buildSignalChartSnapshot([
    {
      key: 'yen',
      name: 'Fragilité carry yen l0g',
      color: '#ffd166',
      points: [
        point('2026-08-07T08:00:00Z', 72),
        point('2026-08-21T17:00:00Z', 39),
      ],
    },
  ], start, end);

  assert.equal(snapshot.moves[0].baseline?.value, 72);
  assert.equal(snapshot.moves[0].latest?.value, 39);
  assert.equal(snapshot.moves[0].delta, -33);
  assert.equal(snapshot.moves[0].direction, 'down');
  assert.equal(snapshot.counts.down, 1);
  assert.equal(snapshot.series[0].visiblePoints.length, 2);
});

test('signale une baseline manquante sans fabriquer de variation', () => {
  const snapshot = buildSignalChartSnapshot([
    {
      key: 'new',
      name: 'Nouvelle série',
      color: '#fff',
      points: [point('2026-08-20T00:00:00Z', 42)],
    },
  ], Date.parse('2026-08-14T00:00:00Z'), Date.parse('2026-08-21T00:00:00Z'));

  assert.equal(snapshot.moves[0].delta, null);
  assert.equal(snapshot.moves[0].direction, 'missing');
  assert.equal(snapshot.counts.missing, 1);
});
