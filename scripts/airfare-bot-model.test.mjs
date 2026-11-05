import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import {
  AIRFARE_DEFAULTS as defaults,
  calculateAirfareScenario as calculate,
  nextAirfareStage as next,
} from '../src/lib/airfare-bot-model.ts';

test('the fictional scenario starts with one traveler, one request and no purchase', () => {
  assert.deepEqual(defaults, { stage: 0 });
  assert.deepEqual(calculate(defaults), {
    stage: 0,
    travelers: 1,
    purchases: 0,
    requests: 1,
    recognized: false,
    lowFareOpen: true,
    price: 180,
    extraPrice: 0,
  });
});

test('bot amplification increases requests without creating travelers or purchases', () => {
  const initial = calculate(defaults);
  const amplified = calculate(next(defaults));
  assert.equal(amplified.requests, initial.requests * 100);
  assert.equal(amplified.travelers, initial.travelers);
  assert.equal(amplified.purchases, initial.purchases);
  assert.equal(amplified.recognized, false);
  assert.equal(amplified.lowFareOpen, false);
  assert.equal(amplified.price, 240);
  assert.equal(amplified.price - initial.price, 60);
  assert.equal(amplified.extraPrice, 60);
});

test('recognizing repeated bot requests restores the low fare while keeping all requests', () => {
  const amplified = calculate({ stage: 1 });
  const recognized = calculate(next({ stage: 1 }));
  assert.equal(recognized.requests, amplified.requests);
  assert.equal(recognized.requests, 100);
  assert.equal(recognized.travelers, 1);
  assert.equal(recognized.purchases, 0);
  assert.equal(recognized.recognized, true);
  assert.equal(recognized.lowFareOpen, true);
  assert.equal(recognized.price, calculate(defaults).price);
  assert.equal(recognized.extraPrice, 0);
});

test('the three stages form a repeatable cycle with no accumulated demand or purchases', () => {
  let state = defaults;
  for (let repeat = 0; repeat < 5; repeat++) {
    for (const stage of [0, 1, 2]) {
      assert.equal(state.stage, stage);
      const result = calculate(state);
      assert.equal(result.stage, stage);
      assert.equal(result.travelers, 1);
      assert.equal(result.purchases, 0);
      assert.equal(result.extraPrice, result.price - 180);
      state = next(state);
    }
    assert.deepEqual(state, defaults);
  }
});

test('malformed states fail without coercion, clamping or replacement defaults', () => {
  const invalid = [
    undefined, null, [], 0, '0', true, new Date(), {}, new Number(0),
    ...['', '0', '1', false, null, undefined, NaN, Infinity, -Infinity, -1, 3, 0.5, 1n,
      Number.MAX_SAFE_INTEGER, {}, []].map(stage => ({ stage })),
    { stage: 0, extra: 1 },
  ];
  for (const input of invalid) {
    assert.throws(() => calculate(input), RangeError);
    assert.throws(() => next(input), RangeError);
  }
  let converted = false;
  const coercible = { stage: { valueOf() { converted = true; return 0; } } };
  assert.throws(() => calculate(coercible), RangeError);
  assert.throws(() => next(coercible), RangeError);
  assert.equal(converted, false);
});

test('inherited states, prototype fields, hidden extras, symbols and accessors are rejected', () => {
  const invalid = [
    JSON.parse('{"stage":0,"__proto__":{"polluted":true}}'),
    { stage: 0, constructor: {} }, { stage: 0, prototype: {} },
    { stage: 0, [Symbol('input')]: 0 }, Object.create({ stage: 0 }),
    Object.assign(Object.create({ inherited: true }), defaults),
    Object.defineProperty({ stage: 0 }, 'hidden', { value: true }),
  ];
  for (const input of invalid) {
    assert.throws(() => calculate(input), RangeError);
    assert.throws(() => next(input), RangeError);
  }
  let accessed = false;
  const accessor = {};
  Object.defineProperty(accessor, 'stage', { get() { accessed = true; return 0; } });
  assert.throws(() => calculate(accessor), RangeError);
  assert.throws(() => next(accessor), RangeError);
  assert.equal(accessed, false);
  assert.equal({}.polluted, undefined);
  const plain = Object.assign(Object.create(null), defaults);
  assert.deepEqual(calculate(plain), calculate(defaults));
  assert.deepEqual(next(plain), next(defaults));
});

test('defaults and caller state remain unchanged and transitions return independent objects', () => {
  assert.ok(Object.isFrozen(defaults));
  for (const stage of [0, 1, 2]) {
    const input = Object.freeze({ stage });
    const result = next(input);
    assert.notEqual(result, input);
    assert.notEqual(result, next(input));
    assert.doesNotThrow(() => calculate(result));
    assert.deepEqual(input, { stage });
    const scenario = calculate(input);
    scenario.price = 999;
    assert.notEqual(calculate(input).price, 999);
    assert.deepEqual(input, { stage });
  }
  assert.deepEqual(defaults, { stage: 0 });
});

test('the local tool has no executable HTML insertion, outbound requests or persistent state', () => {
  const component = readFileSync(new URL('../src/components/AirfareBotLab.astro', import.meta.url), 'utf8');
  const client = readFileSync(new URL('../src/lib/airfare-bot-client.ts', import.meta.url), 'utf8');
  const source = component + client;
  assert.doesNotMatch(source, /\b(?:innerHTML|outerHTML|insertAdjacentHTML|document\.write|eval)\b|new\s+Function\b|set:html|is:inline|define:vars/u);
  assert.doesNotMatch(source, /\b(?:fetch|XMLHttpRequest|WebSocket|EventSource|sendBeacon|localStorage|sessionStorage|indexedDB|postMessage)\b|document\.cookie|new\s+(?:Worker|Image)\b/u);
  assert.doesNotMatch(component, /\son(?:click|load|error|input|change|submit)\s*=|<script[^>]+src=["']https?:/iu);
  assert.doesNotMatch(client, /(?:import|from)\s*\(?\s*['"]https?:/u);
});
