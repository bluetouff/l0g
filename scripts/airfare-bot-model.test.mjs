import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import {
  AIRFARE_DEFAULTS as defaults,
  AIRFARE_SEATS as seats,
  applyAirfareAction as apply,
  calculateAirfareScenario as calculate,
} from '../src/lib/airfare-bot-model.ts';

test('the fictional inventory starts with twelve seats and four at each price', () => {
  assert.equal(seats.length, 12);
  assert.deepEqual(seats.map(seat => seat.number), Array.from({ length: 12 }, (_, index) => index + 1));
  for (const price of [180, 240, 300]) assert.equal(seats.filter(seat => seat.price === price).length, 4);
  assert.deepEqual(calculate(defaults), {
    heldSeats: 0, availableSeats: 12, price: 180, remainingAtPrice: 4, extraPrice: 0,
  });
});

test('searching never changes availability or the accessible price', () => {
  for (let heldSeats = 0; heldSeats <= 12; heldSeats++) {
    const input = Object.freeze({ heldSeats });
    let searched = input;
    for (let repeat = 0; repeat < 100; repeat++) searched = apply(searched, 'search');
    assert.deepEqual(calculate(searched), calculate(input));
  }
});

test('successive holds consume the cheapest seats first and make each fare change visible', () => {
  let state = defaults;
  const prices = [calculate(state).price];
  const remaining = [calculate(state).remainingAtPrice];
  for (let repeat = 0; repeat < 6; repeat++) {
    state = apply(state, 'hold');
    prices.push(calculate(state).price);
    remaining.push(calculate(state).remainingAtPrice);
  }
  assert.deepEqual(prices, [180, 180, 240, 240, 300, 300, null]);
  assert.deepEqual(remaining, [4, 2, 4, 2, 4, 2, 0]);
  assert.deepEqual(state, { heldSeats: 12 });
  assert.deepEqual(apply(state, 'hold'), state);
});

test('boundary counts select the next available fare and never invent a sold-out price', () => {
  for (const [heldSeats, price, availableSeats, remainingAtPrice] of [
    [3, 180, 9, 1], [4, 240, 8, 4], [7, 240, 5, 1],
    [8, 300, 4, 4], [11, 300, 1, 1], [12, null, 0, 0],
  ]) {
    const result = calculate({ heldSeats });
    assert.equal(result.price, price);
    assert.equal(result.availableSeats, availableSeats);
    assert.equal(result.remainingAtPrice, remainingAtPrice);
    assert.equal(result.extraPrice, price === null ? null : price - 180);
  }
  assert.deepEqual(apply({ heldSeats: 11 }, 'hold'), { heldSeats: 12 });
});

test('releasing every temporary hold restores the initial inventory and price', () => {
  for (let heldSeats = 0; heldSeats <= 12; heldSeats++) {
    const released = apply({ heldSeats }, 'release');
    assert.deepEqual(released, defaults);
    assert.deepEqual(calculate(released), calculate(defaults));
  }
});

test('all valid inventories conserve the twelve seats and produce bounded finite counts', () => {
  for (let heldSeats = 0; heldSeats <= 12; heldSeats++) {
    const result = calculate({ heldSeats });
    assert.equal(result.heldSeats + result.availableSeats, 12);
    assert.ok(result.remainingAtPrice >= 0 && result.remainingAtPrice <= 4);
    assert.ok(result.remainingAtPrice <= result.availableSeats);
    for (const value of Object.values(result)) if (value !== null) assert.ok(Number.isSafeInteger(value));
    assert.ok([180, 240, 300, null].includes(result.price));
    for (const action of ['search', 'hold', 'release']) {
      const next = apply({ heldSeats }, action);
      assert.doesNotThrow(() => calculate(next));
    }
  }
});

test('malformed states fail rather than being coerced, clamped or replaced', () => {
  const invalid = [undefined, null, [], 0, '0', true, new Date(), {},
    ...['', '0', false, null, undefined, NaN, Infinity, -Infinity, -1, 13, 0.5, 1n, Number.MAX_SAFE_INTEGER]
      .map(heldSeats => ({ heldSeats })),
    { heldSeats: 0, extra: 1 },
  ];
  for (const input of invalid) {
    assert.throws(() => calculate(input), RangeError);
    for (const action of ['search', 'hold', 'release']) assert.throws(() => apply(input, action), RangeError);
  }
});

test('actions use an explicit allowlist with no executable or implicit input', () => {
  for (const action of [undefined, null, [], {}, true, 0, 'HOLD', 'hold ', '', '__proto__', 'constructor', '<script>']) {
    assert.throws(() => apply(defaults, action), RangeError);
  }
});

test('prototype pollution fields, inherited states, symbols and getters are rejected', () => {
  const invalid = [
    JSON.parse('{"heldSeats":0,"__proto__":{"polluted":true}}'),
    { heldSeats: 0, constructor: {} }, { heldSeats: 0, prototype: {} },
    { heldSeats: 0, [Symbol('input')]: 0 }, Object.create({ heldSeats: 0 }),
    Object.assign(Object.create({ inherited: true }), defaults),
  ];
  for (const input of invalid) assert.throws(() => calculate(input), RangeError);
  let accessed = false;
  const accessor = {};
  Object.defineProperty(accessor, 'heldSeats', { get() { accessed = true; return 0; } });
  assert.throws(() => calculate(accessor), RangeError);
  assert.throws(() => apply(accessor, 'search'), RangeError);
  assert.equal(accessed, false);
  assert.equal({}.polluted, undefined);
  assert.deepEqual(calculate(Object.assign(Object.create(null), defaults)), calculate(defaults));
});

test('the inventory, defaults and caller state stay immutable', () => {
  assert.ok(Object.isFrozen(seats));
  assert.ok(seats.every(Object.isFrozen));
  assert.ok(Object.isFrozen(defaults));
  const input = Object.freeze({ heldSeats: 4 });
  for (const action of ['search', 'hold', 'release']) {
    const result = apply(input, action);
    assert.notEqual(result, input);
    calculate(result);
    assert.deepEqual(input, { heldSeats: 4 });
  }
});

test('the local tool has no executable HTML insertion, outbound requests or persistent state', () => {
  const component = readFileSync(new URL('../src/components/AirfareBotLab.astro', import.meta.url), 'utf8');
  const client = readFileSync(new URL('../src/lib/airfare-bot-client.ts', import.meta.url), 'utf8');
  const source = component + client;
  assert.doesNotMatch(source, /\b(?:innerHTML|outerHTML|insertAdjacentHTML|document\.write|eval)\b|new\s+Function\b|set:html|is:inline|define:vars/u);
  assert.doesNotMatch(source, /\b(?:fetch|XMLHttpRequest|WebSocket|EventSource|sendBeacon|localStorage|sessionStorage|indexedDB|postMessage)\b|document\.cookie|new\s+(?:Worker|Image)\b/u);
  assert.doesNotMatch(component, /\son(?:click|load|error|input|change|submit)\s*=|<script[^>]+src=["']https?:/iu);
  assert.doesNotMatch(client, /(?:import|from)\s*\(?\s*['"]https?:/u);
  assert.match(component, /<script>\s*import ['"]\.\.\/lib\/airfare-bot-client['"];?\s*<\/script>/u);
  assert.match(client, /\.textContent\s*=/u);
});

test('the initial view remains useful when interactive controls cannot be enabled', () => {
  const component = readFileSync(new URL('../src/components/AirfareBotLab.astro', import.meta.url), 'utf8');
  assert.match(component, /<fieldset\b[^>]*\bdisabled(?:\s|>|=)/u);
  assert.match(component, /<noscript>/u);
  assert.match(component, /data-airfare-lab/u);
});
