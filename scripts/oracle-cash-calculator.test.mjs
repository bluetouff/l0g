import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { ORACLE_CASH_FIELDS, ORACLE_CASH_DEFAULTS, ORACLE_CASH_LIMITS, ORACLE_CASH_FIXED, ORACLE_CASH_RESULTS, parseOracleCashInput, calculateOracleCash, formatOracleCash, oracleCashDisplay, oracleCashEquation } from '../src/lib/oracleCashModel.mjs';
import { oracleCashCopy, bindOracleCashCalculators } from '../src/lib/oracleCashUi.mjs';
const model = (overrides = {}) => calculateOracleCash({ ...ORACLE_CASH_DEFAULTS, ...overrides });
test('reported Q1 FY2027 figures reconcile to the independently verified USD-million statements', () => {
  const r = model();
  assert.deepEqual(r, { advance: 11363, capex: 28499, otherOperating: 11740, manufacturer: -830, operating: 23103, fcf: -5396, outlay: 17966, balance: -6226, mixed: 5137, overcount: 11363 });
  assert.equal(model({ advance: '0' }).fcf, -16759);
  assert.equal(r.mixed - r.balance, 11363); assert.equal(r.fcf - r.balance, 830);
  assert.ok(Object.isFrozen(r)); assert.ok(Object.isFrozen(ORACLE_CASH_FIXED));
});
test('zero spending, zero advances and excess advances preserve signed economic meanings', () => {
  assert.deepEqual(ORACLE_CASH_FIELDS, ['advance', 'capex']);
  const z = model({ advance: '0', capex: '0' });
  assert.equal(z.operating, 11740); assert.equal(z.fcf, 11740); assert.equal(z.outlay, 830); assert.equal(z.balance, 10910); assert.equal(z.mixed, z.balance); assert.equal(z.overcount, 0);
  const highAdvance = model({ advance: '60000', capex: '0' }); assert.equal(highAdvance.outlay, -59170); assert.equal(highAdvance.balance, 70910);
  const highCapex = model({ advance: '0', capex: '80000' }); assert.equal(highCapex.balance, -69090); assert.equal(highCapex.outlay, 80830);
});
test('bounded integers reject malformed or out-of-range inputs rather than fabricating a replacement', () => {
  for (const field of ORACLE_CASH_FIELDS) {
    for (const raw of ['', ' ', ' 1', '1 ', '1\n', '-1', '+1', '1.0', '1,0', '1e3', '0x10', 'NaN', 'Infinity', '١', '1'.repeat(100000), '<script>', null, 1]) assert.throws(() => parseOracleCashInput(raw, field), RangeError);
    assert.equal(parseOracleCashInput('0', field), 0);
    assert.equal(parseOracleCashInput(String(ORACLE_CASH_LIMITS[field][1]), field), ORACLE_CASH_LIMITS[field][1]);
    assert.throws(() => model({ [field]: String(ORACLE_CASH_LIMITS[field][1] + 1) }), RangeError);
  }
  for (const field of ['constructor', '__proto__', 'toString', 'unknown']) assert.throws(() => parseOracleCashInput('1', field), RangeError);
  for (const input of [null, 1, [], {}, Object.create(ORACLE_CASH_DEFAULTS), { ...ORACLE_CASH_DEFAULTS, extra: '1' }, { ...ORACLE_CASH_DEFAULTS, [Symbol('hidden')]: '1' }]) assert.throws(() => calculateOracleCash(input), RangeError);
});
test('2000 independently evaluated integer scenarios satisfy both cash identities and directional changes', () => {
  for (let i = 0; i < 2000; i++) {
    const advance = (i * 7919) % 60001, capex = (i * 104729) % 80001;
    const r = model({ advance: String(advance), capex: String(capex) });
    const a = BigInt(advance), c = BigInt(capex), other = 11740n, repayment = 830n;
    assert.equal(BigInt(r.fcf), other + a - c);
    assert.equal(BigInt(r.outlay), c + repayment - a);
    assert.equal(BigInt(r.balance), other + a - c - repayment);
    assert.equal(BigInt(r.mixed), other + 2n * a - c - repayment);
    assert.equal(r.balance, r.otherOperating - r.outlay); assert.equal(r.mixed - r.balance, advance);
    if (advance < 60000) { const next = model({ advance: String(advance + 1), capex: String(capex) }); assert.equal(next.balance - r.balance, 1); assert.equal(next.outlay - r.outlay, -1); }
    if (capex < 80000) { const next = model({ advance: String(advance), capex: String(capex + 1) }); assert.equal(next.balance - r.balance, -1); assert.equal(next.outlay - r.outlay, 1); }
  }
});
test('native formats and coherent equations preserve units, precision and negative outlay signs', () => {
  const r = model();
  assert.equal(formatOracleCash(23103, 'fr'), '23,103'); assert.equal(formatOracleCash(-5396, 'en'), '-5.396');
  assert.equal(oracleCashEquation(r, 'a', 'fr'), '23,103 − 28,499 − 0,830 = -6,226');
  assert.equal(oracleCashEquation(r, 'b', 'en'), '11.740 − (17.966) = -6.226');
  assert.equal(oracleCashEquation(model({ advance: '60000', capex: '0' }), 'b', 'en'), '11.740 − (-59.170) = 70.910');
  for (const lang of ['fr', 'en']) {
    const c = oracleCashCopy(lang); assert.equal(c.labels.length, 2); assert.equal(c.bounds.length, 2); assert.equal(c.resultLabels.length, 4);
    for (const key of ['fixed', 'definitions', 'limits', 'scope', 'privacy', 'errorExplanation', 'nojs']) assert.ok(c[key]);
    for (const field of ORACLE_CASH_RESULTS) assert.equal(oracleCashDisplay(r, field, lang), formatOracleCash(r[field], lang));
  }
  for (const value of [NaN, Infinity, -Infinity, 1.5, '3', Number.MAX_SAFE_INTEGER + 1]) assert.throws(() => formatOracleCash(value, 'en'), RangeError);
  assert.throws(() => oracleCashCopy('de'), RangeError); assert.throws(() => formatOracleCash(1, 'de'), RangeError); assert.throws(() => oracleCashDisplay(r, 'constructor', 'fr'), RangeError); assert.throws(() => oracleCashEquation(r, 'constructor', 'en'), RangeError);
});
function node(extra = {}) { return Object.assign({ textContent: '', dataset: {}, attrs: {}, setAttribute(k, v) { this.attrs[k] = String(v); } }, extra); }
function fixture(lang = 'en') {
  const fields = Object.fromEntries(ORACLE_CASH_FIELDS.map(key => [key, node({ value: ORACLE_CASH_DEFAULTS[key] })]));
  const handlers = {}, form = { elements: { namedItem: key => fields[key] }, addEventListener(key, callback) { handlers[key] = callback; } }, fieldset = { disabled: true }, error = node({ hidden: true }), status = node(), scenario = node();
  const outputs = ORACLE_CASH_RESULTS.map(key => node({ dataset: { oracleCashResult: key } })), equations = ['a', 'b'].map(key => node({ dataset: { oracleCashEquation: key } }));
  const root = { dataset: { oracleCashLang: lang }, querySelector(selector) { return ({ form, fieldset, '[data-error]': error, '[data-status]': status, '[data-scenario]': scenario })[selector]; }, querySelectorAll(selector) { return selector === '[data-oracle-cash-result]' ? outputs : equations; } };
  return { root, scope: { querySelectorAll: () => [root] }, fields, handlers, fieldset, error, status, scenario, outputs, equations };
}
test('progressive UI enables valid roots, binds once, updates both equations, resets and intercepts submit', () => {
  for (const lang of ['fr', 'en']) {
    const f = fixture(lang); bindOracleCashCalculators(f.scope);
    assert.equal(f.fieldset.disabled, false); assert.equal(f.root.dataset.valid, 'true'); assert.equal(f.scenario.textContent, oracleCashCopy(lang).initial);
    assert.deepEqual(f.outputs.map(output => output.textContent), ORACLE_CASH_RESULTS.map(key => oracleCashDisplay(model(), key, lang)));
    const inputHandler = f.handlers.input; bindOracleCashCalculators(f.scope); assert.equal(f.handlers.input, inputHandler);
    f.fields.advance.value = '0'; f.handlers.input(); assert.equal(f.outputs[1].textContent, formatOracleCash(-16759, lang)); assert.equal(f.outputs[5].textContent, formatOracleCash(0, lang)); assert.equal(f.scenario.textContent, oracleCashCopy(lang).scenario);
    let prevented = false; f.handlers.submit({ preventDefault() { prevented = true; } }); assert.equal(prevented, true);
    f.handlers.reset({ preventDefault() {} }); assert.equal(f.fields.advance.value, '11363'); assert.equal(f.fields.capex.value, '28499'); assert.equal(f.scenario.textContent, oracleCashCopy(lang).initial); assert.equal(f.error.hidden, true);
    assert.equal(f.equations[0].textContent, oracleCashEquation(model(), 'a', lang)); assert.equal(f.equations[1].textContent, oracleCashEquation(model(), 'b', lang));
  }
});
test('invalid UI values clear all six outputs and equations before recovering on correction', () => {
  const f = fixture(); bindOracleCashCalculators(f.scope);
  for (const raw of ['', '60001', '11363.1', '<script>']) {
    f.fields.advance.value = raw; f.handlers.input(); assert.equal(f.root.dataset.valid, 'false'); assert.equal(f.error.hidden, false); assert.equal(f.scenario.textContent, 'Unavailable');
    assert.ok(f.outputs.every(output => output.textContent === 'Unavailable')); assert.ok(f.equations.every(output => output.textContent === 'Unavailable')); assert.ok(Object.values(f.fields).every(field => field.attrs['aria-invalid'] === 'true'));
    f.fields.advance.value = '11363'; f.handlers.change(); assert.equal(f.error.hidden, true); assert.equal(f.root.dataset.valid, 'true');
  }
  f.outputs[0].dataset.oracleCashResult = 'constructor'; f.handlers.input(); assert.ok(f.outputs.every(output => output.textContent === 'Unavailable')); assert.ok(f.equations.every(output => output.textContent === 'Unavailable'));
});
test('root-scoped bindings isolate calculator instances and leave incomplete markup disabled', () => {
  const a = fixture('fr'), b = fixture('en'); bindOracleCashCalculators({ querySelectorAll: () => [a.root, b.root] });
  a.fields.capex.value = '0'; a.handlers.input(); assert.equal(a.outputs[1].textContent, '23,103'); assert.equal(b.outputs[1].textContent, '-5.396');
  const incomplete = fixture(); incomplete.outputs.pop(); bindOracleCashCalculators(incomplete.scope); assert.equal(incomplete.fieldset.disabled, true); assert.deepEqual(incomplete.handlers, {});
  const unknown = fixture('de'); bindOracleCashCalculators(unknown.scope); assert.equal(unknown.fieldset.disabled, true); assert.deepEqual(unknown.handlers, {});
});
test('component retains readable SSR values, scoped accessible controls and semantic themes without unsafe sinks', () => {
  const component = fs.readFileSync(new URL('../src/components/OracleCashCalculator.astro', import.meta.url), 'utf8'), ui = fs.readFileSync(new URL('../src/lib/oracleCashUi.mjs', import.meta.url), 'utf8');
  assert.match(component, /<fieldset disabled>/); assert.match(component, /oracleCashDisplay\(initial/); assert.match(component, /oracleCashEquation\(initial/); assert.match(component, /<noscript>/); assert.match(component, /id = `oracle-cash-\$\{lang\}`/); assert.match(component, /aria-describedby=/); assert.match(component, /role="status"/); assert.match(component, /var\(--color-signal\)/); assert.match(component, /data-oracle-cash-root/);
  assert.doesNotMatch(component, /<script\s+is:inline|oninput=|onclick=|#[\da-f]{3,8}\b/iu);
  assert.doesNotMatch(ui, /innerHTML|outerHTML|insertAdjacentHTML|fetch\(|XMLHttpRequest|WebSocket|sendBeacon|localStorage|sessionStorage|document\.cookie|eval\(|new Function/);
});
