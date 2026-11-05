import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import {
  AIRFARE_DEFAULTS as defaults,
  calculateAirfareScenario as calculate,
  airfareTimeline,
} from '../src/lib/airfare-bot-model.ts';

const scenario = (overrides = {}) => calculate({ ...defaults, ...overrides });

test('the fixed cohort keeps historical bookings and intentions independent of query volume', () => {
  assert.equal(defaults.requestsPerIntention, 800);
  assert.equal(scenario().price, 300);
  const initial = scenario({ step: 0 });
  assert.equal(initial.intensity, 10);
  assert.equal(initial.rawRequests, 10000);
  assert.equal(initial.extraRequests, 0);
  assert.equal(initial.queryConversionPct, 1);
  const maximum = scenario({ requestsPerIntention: 1000 });
  assert.equal(maximum.rawRequests, 1000000);
  assert.equal(maximum.queryConversionPct, 0.01);
  for (const result of [initial, maximum]) {
    assert.equal(result.intentions, 1000);
    assert.equal(result.bookings, 100);
    assert.equal(result.intentionConversionPct, 10);
  }
});

test('consultation alone never changes price or inventory, including maximum traffic', () => {
  for (const result of airfareTimeline({ ...defaults, mode: 'observe', requestsPerIntention: 1000 })) {
    assert.equal(result.price, 180);
    assert.equal(result.probability, 0.4);
    assert.equal(result.expectedFutureRevenue, 120);
    assert.equal(result.heldNow, 0);
    assert.equal(result.availableSeats, 24);
    assert.equal(result.cheapAvailable, 8);
  }
});

test('no additional searches, complete filtering and zero sensitivity preserve the initial fare', () => {
  for (const input of [{ requestsPerIntention: 10 }, { requestsPerIntention: 1000, filterPct: 100 }, { requestsPerIntention: 1000, sensitivityPct: 0 }]) {
    const result = scenario(input);
    assert.equal(result.price, 180);
    assert.equal(result.extraPrice, 0);
    assert.equal(result.probability, 0.4);
    assert.equal(result.expectedFutureRevenue, 120);
  }
});

test('the illustrative probability-price gate accepts an offer at exact indifference', () => {
  const below = scenario({ requestsPerIntention: 504 });
  const exact = scenario({ requestsPerIntention: 505 });
  const above = scenario({ requestsPerIntention: 506 });
  assert.ok(below.probability < 0.6);
  assert.equal(exact.probability, 0.6);
  assert.equal(exact.expectedFutureRevenue, 180);
  assert.equal(exact.price, 180);
  assert.ok(above.probability > 0.6);
  assert.equal(above.price, 300);
  assert.equal(scenario({ requestsPerIntention: 1000, filterPct: 50 }).price, 180);
  assert.equal(scenario({ requestsPerIntention: 1000, sensitivityPct: 50 }).price, 180);
  const maximum = scenario({ requestsPerIntention: 1000 });
  assert.equal(maximum.probability, 0.8);
  assert.equal(maximum.expectedFutureRevenue, 240);
  assert.equal(maximum.price, 300);
  assert.equal(maximum.extraPrice, 120);
});

test('filtering changes the interpreted signal without suppressing raw technical requests', () => {
  const full = scenario({ requestsPerIntention: 1000, filterPct: 100 });
  assert.equal(full.rawRequests, 1000000);
  assert.equal(full.extraRequests, 990000);
  assert.equal(full.filteredRequests, 990000);
  assert.equal(full.signalRequests, 10000);
  const half = scenario({ requestsPerIntention: 1000, filterPct: 50 });
  assert.equal(half.rawRequests, full.rawRequests);
  assert.equal(half.filteredRequests, 495000);
  assert.equal(half.signalRequests, 505000);
  assert.equal(half.queryConversionPct, full.queryConversionPct);
});

test('inventory holdings consume the cheapest units first and expire independently of searches', () => {
  for (const heldSeats of [0, 7, 8, 12]) {
    const active = scenario({ mode: 'inventory', heldSeats, step: 49 });
    assert.equal(active.heldNow, heldSeats);
    assert.equal(active.availableSeats, 24 - heldSeats);
    assert.equal(active.cheapAvailable, Math.max(0, 8 - heldSeats));
    assert.equal(active.price, heldSeats >= 8 ? 300 : 180);
    assert.equal(active.probability, 0.4);
    const expired = scenario({ mode: 'inventory', heldSeats, step: 50 });
    assert.equal(expired.heldNow, 0);
    assert.equal(expired.availableSeats, 24);
    assert.equal(expired.cheapAvailable, 8);
    assert.equal(expired.price, 180);
  }
  assert.equal(scenario({ mode: 'inventory', step: 0 }).heldNow, 0);
  assert.equal(scenario({ mode: 'inventory', heldSeats: 8, step: 15 }).heldNow, 4);
  assert.equal(scenario({ mode: 'inventory', heldSeats: 8, step: 30 }).heldNow, 8);
  assert.equal(scenario({ mode: 'inventory', heldSeats: 8, requestsPerIntention: 10, step: 30 }).price, 300);
});

test('all timeline allocations and outputs remain bounded and conserve counts', () => {
  for (const mode of ['observe', 'signal', 'inventory']) {
    for (const requestsPerIntention of [10, 500, 505, 1000]) {
      for (const filterPct of [0, 50, 100]) {
        const timeline = airfareTimeline({ ...defaults, mode, requestsPerIntention, filterPct, heldSeats: 12 });
        assert.equal(timeline.length, 61);
        timeline.forEach((result, index) => {
          assert.equal(result.step, index);
          assert.equal(result.rawRequests, result.signalRequests + result.filteredRequests);
          assert.equal(result.rawRequests, 10000 + result.extraRequests);
          assert.equal(result.availableSeats + result.heldNow, 24);
          assert.ok(result.cheapAvailable >= 0 && result.cheapAvailable <= 8);
          assert.ok(result.probability >= 0.4 && result.probability <= 0.8);
          assert.ok([180, 300].includes(result.price));
          for (const value of Object.values(result)) if (typeof value === 'number') assert.ok(Number.isFinite(value));
          if (index > 0) {
            assert.ok(result.rawRequests >= timeline[index - 1].rawRequests);
            assert.ok(result.probability >= timeline[index - 1].probability);
            if (mode !== 'inventory') assert.ok(result.price >= timeline[index - 1].price);
          }
        });
      }
    }
  }
});

test('complete inputs are strict, bounded and not silently coerced or replaced', () => {
  for (const input of [undefined, null, [], 1, '500', true, new Date(), {}, { ...defaults, mode: 'unknown' }, { ...defaults, unexpected: 1 }]) {
    assert.throws(() => calculate(input), RangeError);
    assert.throws(() => airfareTimeline(input), RangeError);
  }
  for (const key of ['requestsPerIntention', 'filterPct', 'sensitivityPct', 'heldSeats', 'step']) {
    for (const value of ['', '0', null, undefined, false, NaN, Infinity, -Infinity, 0.5, -1, Number.MAX_SAFE_INTEGER, 1n]) {
      assert.throws(() => calculate({ ...defaults, [key]: value }), RangeError, key + ': ' + String(value));
    }
    const missing = { ...defaults };
    delete missing[key];
    assert.throws(() => calculate(missing), RangeError);
  }
  for (const overrides of [{ requestsPerIntention: 9 }, { requestsPerIntention: 1001 }, { filterPct: 101 }, { sensitivityPct: 101 }, { heldSeats: 13 }, { step: 61 }]) {
    assert.throws(() => scenario(overrides), RangeError);
  }
});

test('prototype pollution fields, custom prototypes, symbols and accessors are rejected', () => {
  const protoField = JSON.parse(JSON.stringify(defaults).replace(/}$/, ',"__proto__":{"polluted":true}}'));
  for (const input of [protoField, { ...defaults, constructor: {} }, { ...defaults, prototype: {} }, { ...defaults, [Symbol('input')]: 1 }, Object.assign(Object.create({ inherited: 1 }), defaults)]) {
    assert.throws(() => calculate(input), RangeError);
  }
  let accessed = false;
  const accessor = { ...defaults };
  Object.defineProperty(accessor, 'step', { get() { accessed = true; return 60; } });
  assert.throws(() => calculate(accessor), RangeError);
  assert.equal(accessed, false);
  assert.equal({}.polluted, undefined);
  assert.deepEqual(calculate(Object.assign(Object.create(null), defaults)), calculate(defaults));
});

test('model defaults and caller inputs are not mutated', () => {
  assert.ok(Object.isFrozen(defaults));
  const input = Object.freeze({ ...defaults, heldSeats: 12 });
  const before = { ...input };
  calculate(input);
  airfareTimeline(input);
  assert.deepEqual(input, before);
});

test('the embedded tool has no executable HTML insertion, outbound request or persistent-state surface', () => {
  const component = readFileSync(new URL('../src/components/AirfareBotLab.astro', import.meta.url), 'utf8');
  const client = readFileSync(new URL('../src/lib/airfare-bot-client.ts', import.meta.url), 'utf8');
  const source = component + client;
  assert.doesNotMatch(source, /\b(?:innerHTML|outerHTML|insertAdjacentHTML|document\.write|eval)\b|new\s+Function\b|set:html|is:inline|define:vars/u);
  assert.doesNotMatch(source, /\b(?:fetch|XMLHttpRequest|WebSocket|EventSource|sendBeacon|localStorage|sessionStorage|indexedDB|postMessage)\b|document\.cookie|new\s+(?:Worker|Image)\b/u);
  assert.doesNotMatch(component, /\son(?:click|load|error|input|change|submit)\s*=|<script[^>]+src=["']https?:/iu);
  assert.doesNotMatch(client, /(?:import|from)\s*\(?\s*['"]https?:/u);
  assert.match(component, /<script>import '\.\.\/lib\/airfare-bot-client';<\/script>/u);
  assert.match(client, /output\.textContent = text/u);
});

test('the static initial result remains available without JavaScript and incomplete enhancement stays disabled', () => {
  const component = readFileSync(new URL('../src/components/AirfareBotLab.astro', import.meta.url), 'utf8');
  const client = readFileSync(new URL('../src/lib/airfare-bot-client.ts', import.meta.url), 'utf8');
  assert.match(component, /calculateAirfareScenario\(AIRFARE_DEFAULTS\)/u);
  assert.match(component, /<fieldset[^>]+data-controls[^>]+disabled/u);
  assert.match(component, /<noscript>/u);
  assert.match(component, /role="status" aria-live="polite" aria-atomic="true"/u);
  assert.match(component, /role="alert" hidden/u);
  assert.match(component, /aria-pressed=\{mode === 'signal'/u);
  assert.match(client, /fieldset\.disabled = true/u);
  assert.match(client, /const fail = \(\) => \{\s*stop\(\);[\s\S]*?result\.hidden = true/u);
  assert.match(client, /prefers-reduced-motion: reduce/u);
  assert.match(client, /document\.addEventListener\('visibilitychange'/u);
  // Require page-lifecycle handling without coupling this guard to a callback
  // name or its listener options. Browser tests verify the pause behavior.
  assert.match(client, /window\.addEventListener\(\s*['"]pagehide['"]\s*,/u);
  assert.match(component, /Cette relation est arbitraire/u);
  assert.match(component, /This relationship is arbitrary/u);
  assert.match(component, /sans durée réelle/u);
  assert.match(component, /no real-time duration/u);
});

test('article figure zoom leaves the live simulator chart attached to its controls', () => {
  const component = readFileSync(new URL('../src/components/AirfareBotLab.astro', import.meta.url), 'utf8');
  const articleTools = readFileSync(new URL('../src/scripts/article-tools.ts', import.meta.url), 'utf8');
  assert.match(component, /class="airfare-lab__chart" data-interactive-figure/u);
  assert.match(articleTools, /svg\.closest\('svg svg, \[data-interactive-figure\]'\)/u);
});
