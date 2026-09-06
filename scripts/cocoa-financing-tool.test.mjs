import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import vm from 'node:vm';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const modelSource = readFileSync(`${ROOT}public/outils/cacao-tresorerie/model.js`, 'utf8');
const modelModule = { exports: {} };
vm.runInNewContext(modelSource, { module: modelModule, globalThis: {} }, { filename: 'model.js' });
const model = modelModule.exports;
const closeTo = (actual, expected) => assert.ok(
  Math.abs(actual - expected) <= 1e-8 * Math.max(1, Math.abs(actual), Math.abs(expected)),
  `${actual} != ${expected}`,
);
const calculate = (overrides = {}) => model.calculate({ ...model.defaults, ...overrides });

test('cocoa calculator keeps the documented default arithmetic', () => {
  const result = calculate();
  closeTo(result.cost, 4_300_000);
  closeTo(result.revenue, 5_000_000);
  closeTo(result.requiredLoan, 4_000_000);
  closeTo(result.interest, 236_712.3287671233);
  closeTo(result.result, 463_287.6712328767);
  closeTo(result.breakEvenDays, 266.1458333333333);
  assert.equal(result.status, 'fundable_profitable');
});

test('cocoa calculator separates funding gaps, losses and advances', () => {
  const constrained = calculate({ creditLimit: 3_000_000 });
  closeTo(constrained.fundingGap, 1_000_000);
  assert.equal(constrained.status, 'gap_profitable');
  closeTo(constrained.result, calculate().result);

  assert.equal(calculate({ days: 300 }).status, 'fundable_loss');
  const advanced = calculate({ advancePct: 25 });
  closeTo(advanced.requiredLoan, 2_750_000);
  closeTo(advanced.advance + advanced.remainingReceipt, advanced.revenue);
  closeTo(advanced.result, 537_260.2739726028);
});

test('cocoa calculator rejects malformed, out-of-range and unsafe-scale inputs', () => {
  for (const value of ['', null, undefined, Number.NaN, Infinity, -Infinity, -1]) {
    assert.throws(() => calculate({ tonnes: value }));
  }
  assert.throws(() => calculate({ tonnes: 0 }));
  assert.throws(() => calculate({ fx: 0 }));
  assert.throws(() => calculate({ advancePct: 101 }));
  assert.throws(() => calculate({ annualRate: 201 }));
  assert.throws(() => calculate({ tonnes: 1_000_000, saleUsd: 1_000_000, fx: 10_000 }));

  const input = { ...model.defaults };
  model.calculate(input);
  assert.deepEqual(input, { ...model.defaults });
});

test('cocoa calculator satisfies 2,000 deterministic financial identities', () => {
  let seed = 142_771;
  const random = () => {
    seed = (Math.imul(1_664_525, seed) + 1_013_904_223) >>> 0;
    return seed / 4_294_967_296;
  };

  for (let index = 0; index < 2_000; index += 1) {
    const input = {
      tonnes: 1 + random() * 1_000,
      farmgate: 500 + random() * 80_000,
      other: random() * 10_000,
      saleUsd: 1_000 + random() * 12_000,
      fx: 2 + random() * 18,
      ownCash: random() * 20_000_000,
      creditLimit: random() * 50_000_000,
      advancePct: random() * 100,
      annualRate: random() * 60,
      days: random() * 700,
    };
    const result = model.calculate(input);
    closeTo(result.finalCash, input.ownCash + result.result);
    closeTo(result.advance + result.remainingReceipt, result.revenue);
    closeTo(result.requiredLoan, Math.max(0, result.cost - input.ownCash - result.advance));

    const later = model.calculate({ ...input, days: input.days + 100 });
    assert.ok(later.result <= result.result + 1e-6);
    const moreAdvance = model.calculate({ ...input, advancePct: Math.min(100, input.advancePct + 5) });
    assert.ok(moreAdvance.interest <= result.interest + 1e-6);
    const moreCash = model.calculate({ ...input, ownCash: input.ownCash + 100_000 });
    assert.ok(moreCash.interest <= result.interest + 1e-6);
    const moreCredit = model.calculate({ ...input, creditLimit: input.creditLimit + 100_000 });
    assert.ok(moreCredit.fundingGap <= result.fundingGap + 1e-6);
    closeTo(moreCredit.result, result.result);

    const breakEven = model.calculate({ ...input, saleUsd: result.breakEvenUsd });
    assert.ok(Math.abs(breakEven.result) <= 1e-6 * Math.max(1, breakEven.cost));
    assert.ok(result.repaymentShortfall >= 0);
    assert.ok(result.requiredLoan >= 0);
    assert.ok(result.interest >= 0);
  }
});

test('cocoa tool remains local-only and ships a restrictive document policy', () => {
  const index = readFileSync(`${ROOT}public/outils/cacao-tresorerie/index.html`, 'utf8');
  const script = readFileSync(`${ROOT}public/outils/cacao-tresorerie/calculator.js`, 'utf8');
  assert.match(index, /<link rel="canonical" href="https:\/\/l0g\.fr\/outils\/cacao-tresorerie\/">/u);
  assert.match(index, /Content-Security-Policy[^>]+connect-src 'none'/u);
  assert.match(index, /script-src-attr 'none'/u);
  assert.match(index, /frame-src 'none'/u);
  assert.match(index, /worker-src 'none'/u);
  assert.match(index, /manifest-src 'none'/u);
  assert.match(index, /object-src 'none'/u);
  assert.match(index, /base-uri 'none'/u);
  assert.match(index, /form-action 'none'/u);
  assert.match(script, /\/en\/analysis\/ghana-cocoa-financing-cash-crisis\//u);
  assert.doesNotMatch(`${script}\n${modelSource}`, /\b(?:fetch|XMLHttpRequest|WebSocket|EventSource|sendBeacon|localStorage|sessionStorage|indexedDB|document\.cookie|eval|Function)\b/u);
  assert.doesNotMatch(`${script}\n${modelSource}`, /\b(?:innerHTML|outerHTML|insertAdjacentHTML|document\.write)\b/u);
  assert.doesNotMatch(`${script}\n${modelSource}`, /https?:\/\//u);
});
