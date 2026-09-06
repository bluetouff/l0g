import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import vm from 'node:vm';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const modelSource = readFileSync(`${ROOT}public/outils/moteurs-avion/model.js`, 'utf8');
const modelModule = { exports: {} };
vm.runInNewContext(modelSource, { module: modelModule, globalThis: {} }, { filename: 'model.js' });
const model = modelModule.exports;
const closeTo = (actual, expected) => assert.ok(
  Math.abs(actual - expected) <= 1e-8 * Math.max(1, Math.abs(actual), Math.abs(expected)),
  `${actual} != ${expected}`,
);

test('aircraft-engine calculator keeps the documented default arithmetic', () => {
  const result = model.calculate(model.defaults);
  closeTo(result.groundCost, 1_260_000);
  closeTo(result.fundingCost, 6_027.397260273973);
  closeTo(result.leaseCost, 761_027.397260274);
  closeTo(result.benefit, 498_972.602739726);
  closeTo(result.breakEvenRent, 8_536.114570361145);
  assert.equal(result.restoredDays, 110);
});

test('aircraft-engine calculator handles boundaries and keeps deposits distinct from costs', () => {
  const defaults = model.defaults;
  assert.ok(model.calculate({ ...defaults, days: 15 }).benefit < 0);
  assert.equal(model.calculate({ ...defaults, days: 0 }).feasible, false);
  for (const lag of [120, 121, 730]) {
    const result = model.calculate({ ...defaults, lag });
    assert.equal(result.feasible, false);
    assert.equal(result.leaseCost, null);
    assert.equal(result.depositTiedUp, 0);
  }
  closeTo(model.calculate({ ...defaults, rate: 0 }).fundingCost, 0);
  closeTo(model.calculate({ ...defaults, deposit: 0 }).fundingCost, 0);
  assert.ok(model.calculate({ ...defaults, contribution: 0, compensation: 10_000 }).groundCost < 0);

  const withoutDeposit = model.calculate({ ...defaults, rate: 0, deposit: 0 });
  const withDeposit = model.calculate({ ...defaults, rate: 0, deposit: 1_000_000 });
  closeTo(withoutDeposit.leaseCost, withDeposit.leaseCost);
  closeTo(withDeposit.depositTiedUp, 1_000_000);
});

test('aircraft-engine calculator rejects malformed and out-of-range inputs', () => {
  for (const value of [undefined, null, '120', '', Number.NaN, Infinity, -Infinity]) {
    assert.throws(() => model.calculate({ ...model.defaults, days: value }));
  }
  for (const days of [-1, 731, 2.5]) {
    assert.throws(() => model.calculate({ ...model.defaults, days }));
  }
  assert.throws(() => model.calculate({ ...model.defaults, rate: 101 }));
  const input = { ...model.defaults };
  const result = model.calculate(input);
  assert.ok(Object.isFrozen(result));
  assert.deepEqual(input, { ...model.defaults });
});

test('aircraft-engine calculator satisfies 2,000 deterministic invariants', () => {
  let seed = 87_231;
  const random = () => {
    seed = (1_664_525 * seed + 1_013_904_223) >>> 0;
    return seed / 4_294_967_296;
  };

  for (let index = 0; index < 2_000; index += 1) {
    const input = {
      ...model.defaults,
      days: 1 + Math.floor(random() * 730),
      lag: Math.floor(random() * 730),
      contribution: random() * 50_000,
      rent: random() * 10_000,
      usage: random() * 5_000,
      fixed: random() * 1_000_000,
      compensation: random() * 10_000,
      deposit: random() * 2_000_000,
      rate: random() * 30,
    };
    const result = model.calculate(input);
    if (!result.feasible) {
      assert.equal(result.restoredDays, 0);
      continue;
    }
    closeTo(result.groundCost - result.leaseCost, result.benefit);
    closeTo(
      result.leaseCost,
      result.initialGroundCost + result.rentalCost + result.usageCost + result.fixedCost + result.fundingCost,
    );
    closeTo(result.benefit, result.restoredDays * (result.breakEvenRent - input.rent));
    const moreExpensive = model.calculate({ ...input, rent: input.rent + 1 });
    closeTo(result.benefit - moreExpensive.benefit, result.restoredDays);
    const withoutDeposit = model.calculate({ ...input, deposit: 0 });
    closeTo(result.leaseCost - withoutDeposit.leaseCost, result.fundingCost);
  }
});

test('aircraft-engine tool remains local-only and ships a restrictive document policy', () => {
  const index = readFileSync(`${ROOT}public/outils/moteurs-avion/index.html`, 'utf8');
  const script = readFileSync(`${ROOT}public/outils/moteurs-avion/calculator.js`, 'utf8');
  assert.match(index, /<link rel="canonical" href="https:\/\/l0g\.fr\/outils\/moteurs-avion\/">/u);
  assert.match(index, /Content-Security-Policy[^>]+connect-src 'none'/u);
  assert.match(index, /script-src-attr 'none'/u);
  assert.match(index, /frame-src 'none'/u);
  assert.match(index, /worker-src 'none'/u);
  assert.match(index, /manifest-src 'none'/u);
  assert.match(index, /object-src 'none'/u);
  assert.match(index, /base-uri 'none'/u);
  assert.match(index, /form-action 'none'/u);
  assert.doesNotMatch(`${script}\n${modelSource}`, /\b(?:fetch|XMLHttpRequest|WebSocket|EventSource|sendBeacon|localStorage|sessionStorage|indexedDB|document\.cookie|eval|Function)\b/u);
  assert.doesNotMatch(`${script}\n${modelSource}`, /\b(?:innerHTML|outerHTML|insertAdjacentHTML|document\.write)\b/u);
  assert.doesNotMatch(`${script}\n${modelSource}`, /https?:\/\//u);
});
