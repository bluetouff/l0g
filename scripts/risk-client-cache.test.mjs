import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';
import { isRiskSignalUnavailable } from '../src/config/risk-signals.ts';

const code = await readFile(new URL('../src/scripts/risk.js', import.meta.url), 'utf8');

test('cached debt remains labelled, expires in an open tab and recovers through static polling', async () => {
  let now = Date.parse('2026-10-10T18:00:00Z');
  const signal = { key: 'debt', value: 54, scale: 100, level: 'Elevated', tone: 'elevated',
    methodologyVersion: '2.0', validUntil: '2026-10-10T18:30:00Z', sourceStatus: 'ok',
    qualityStatus: 'degraded', cacheUsed: true, fallbackUsed: true, fallbackLayer: 'producer',
    sourceUpdatedAt: '2026-10-10T18:00:00Z' };
  const elements = Object.fromEntries(['value', 'level', 'fill', 'status'].map((name) => [name, { style: {}, textContent: '' }]));
  const tile = { dataset: {}, querySelector: (selector) => elements[selector.slice(6, -1)] };
  const timers = new Map();
  const listeners = new Map();
  let requests = 0;
  class Clock extends Date { static now() { return now; } }
  const document = { readyState: 'complete', hidden: false,
    querySelector: () => tile, getElementById: () => null,
    addEventListener: (name, fn) => listeners.set(name, fn) };
  vm.runInNewContext(code, { Date: Clock, document,
    fetch: async (url) => {
      assert.equal(url, '/risk.json');
      requests += 1;
      return { ok: true, json: async () => ({ indices: [{ ...signal }] }) };
    },
    window: { setTimeout: (fn) => fn(), setInterval: (fn, ms) => timers.set(ms, fn) },
  });
  const flush = () => new Promise((resolve) => setImmediate(resolve));
  await flush();
  assert.equal(elements.value.textContent, 54);
  assert.match(elements.status.textContent, /cache source validé/);
  assert.equal(requests, 1);
  now += 30 * 60_000;
  timers.get(60_000)();
  assert.equal(elements.level.textContent, 'INDISPONIBLE');
  assert.match(elements.status.textContent, /publication expirée/);
  assert.equal(requests, 1);
  document.hidden = true;
  timers.get(900_000)();
  assert.equal(requests, 1);
  signal.validUntil = '2026-10-10T19:00:00Z';
  signal.cacheUsed = false;
  signal.fallbackUsed = false;
  signal.fallbackLayer = null;
  signal.qualityStatus = 'nominal';
  document.hidden = false;
  listeners.get('visibilitychange')();
  await flush();
  assert.equal(requests, 2);
  assert.equal(elements.value.textContent, 54);
  assert.doesNotMatch(elements.status.textContent, /cache|expirée/);
});

test('static rendering rejects absent or expired debt deadlines without affecting other instruments', () => {
  const signal = { key: 'debt', methodologyVersion: '2.0', sourceStatus: 'ok' };
  assert.equal(isRiskSignalUnavailable(signal), true);
  assert.equal(isRiskSignalUnavailable({ ...signal, validUntil: '2020-01-01T00:00:00Z' }), true);
  assert.equal(isRiskSignalUnavailable({ ...signal, validUntil: new Date(Date.now() + 60_000).toISOString() }), false);
  assert.equal(isRiskSignalUnavailable({ ...signal, key: 'us' }), false);
});
