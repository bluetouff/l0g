import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { TEMPO_DEFAULTS as defaults, TEMPO_VOLUME_FIELDS as fields, parseTempoKWh, calculateTempoBill, formatTempoMoney, formatTempoEnergy, tempoPercent } from '../src/lib/tempoBillCalculator.mjs';
import { TEMPO_OUTPUT_FIELDS as outputs, bindTempoBillCalculators, tempoOutputText } from '../src/lib/tempoBillCalculatorUi.mjs';

test('The explicitly fictional 4380 kWh profile matches independently verified EDF costs', () => {
  const r = calculateTempoBill(defaults);
  assert.equal(r.totalWh, 4380000n); assert.equal(r.variable, 7947856000n);
  assert.equal(r.subscription, 1896000000n); assert.equal(r.tempoBefore, 9843856000n);
  assert.equal(r.tempoAfter, r.tempoBefore); assert.equal(r.saving, 0n);
  assert.equal(r.base, 10667580000n); assert.equal(r.baseDifference, 823724000n);
  assert.equal(r.redPeakCost, 1283920000n); assert.equal(r.redEnergyShare, '4.0'); assert.equal(r.redCostShare, '16.2');
});
test('A 10 kWh red shift conserves energy and saves exactly EUR5.68 before rounding', () => {
  const r = calculateTempoBill({ ...defaults, shift: '10' });
  assert.equal(r.totalWh, 4380000n); assert.equal(r.redPeakAfterWh, 166000n); assert.equal(r.redOffPeakAfterWh, 98000n);
  assert.equal(r.saving, 56800000n); assert.equal(r.tempoAfter, 9787056000n); assert.equal(r.baseDifference, 880524000n);
  assert.equal(formatTempoMoney(r.saving, 'fr'), '5,68\u00a0€');
});
test('9 kVA uses the published subscription and leaves Base comparison unavailable', () => {
  const r = calculateTempoBill({ ...defaults, capacity: '9' });
  assert.equal(r.subscription, 2364000000n); assert.equal(r.tempoBefore, 10311856000n);
  assert.equal(r.base, null); assert.equal(r.baseDifference, null);
});
test('Decimal parsing accepts Wh precision and fails closed on malformed or oversized inputs', () => {
  for (const [s, v] of [['0', 0n], ['0,001', 1n], ['176.250', 176250n], ['200000.000', 200000000n]]) assert.equal(parseTempoKWh(s), v);
  for (const s of ['', ' ', ' 1', '1 ', '-0', '-1', '+1', '.5', '1.', '1,', '1e3', 'NaN', 'Infinity', '1 000', '1,000.00', '0.0001', '200000.001', '200001', '1'.repeat(10000), 1, null, undefined]) assert.throws(() => parseTempoKWh(s), RangeError);
  for (const s of [null, [], {}, { ...defaults, extra: '1' }, { ...defaults, capacity: 6 }, { ...defaults, capacity: '12' }, { ...defaults, shift: '176.001' }, Object.defineProperty(Object.create(defaults), 'blue_hp', { value: '1', enumerable: true })]) assert.throws(() => calculateTempoBill(s), RangeError);
});
test('Zero energy keeps the subscription and leaves percentage denominators unavailable', () => {
  const r = calculateTempoBill({ ...defaults, ...Object.fromEntries(fields.map(k => [k, '0'])) });
  assert.equal(r.tempoBefore, 1896000000n); assert.equal(r.variable, 0n); assert.equal(r.redEnergyShare, null); assert.equal(r.redCostShare, null);
  assert.equal(r.base, 1903200000n); assert.equal(r.baseDifference, 7200000n);
});
test('Upper bounds apply to inputs while a full shift can increase derived off-peak volume', () => {
  const r = calculateTempoBill({ ...Object.fromEntries(fields.map(k => [k, '200000'])), capacity: '9', shift: '200000' });
  assert.equal(r.totalWh, 1200000000n); assert.equal(r.redPeakAfterWh, 0n); assert.equal(r.redOffPeakAfterWh, 400000000n);
  assert.equal(r.saving, 1136000000000n); assert.ok(r.tempoAfter > 0n);
});
test('Energy and saving identities hold across bounded fractional scenarios', () => {
  let seed = 47289;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return BigInt(seed % 200000001); };
  const decimal = wh => `${wh / 1000n}.${String(wh % 1000n).padStart(3, '0')}`;
  for (let i = 0; i < 250; i++) {
    const values = Object.fromEntries(fields.map(k => [k, random()])), shift = values.red_hp / 2n;
    const r = calculateTempoBill({ ...Object.fromEntries(fields.map(k => [k, decimal(values[k])])), capacity: i % 2 ? '6' : '9', shift: decimal(shift) });
    assert.equal(r.totalWh, Object.values(values).reduce((a, b) => a + b, 0n));
    assert.equal(r.redPeakAfterWh + r.redOffPeakAfterWh, values.red_hp + values.red_hc);
    assert.equal(r.tempoBefore - r.tempoAfter, shift * 5680n); assert.equal(r.saving, shift * 5680n);
  }
});
test('Exact formatting rounds half cents away from zero, with native language and no negative zero', () => {
  assert.equal(formatTempoMoney(50000n, 'en'), '€0.01'); assert.equal(formatTempoMoney(-50000n, 'fr'), '−0,01\u00a0€');
  assert.equal(formatTempoMoney(-49999n, 'en'), '€0.00'); assert.equal(formatTempoMoney(10667580000n, 'fr'), '1\u202f066,76\u00a0€');
  assert.equal(formatTempoEnergy(1200000001n, 'en'), '1,200,000.001\u00a0kWh');
  assert.equal(tempoPercent(1n, 2000n), '0.1'); assert.equal(tempoPercent(0n, 0n), null);
  assert.equal(tempoOutputText('redCostShare', '16.2', 'fr'), '16,2\u00a0%');
  assert.throws(() => tempoPercent(1n, 0n), RangeError); assert.throws(() => formatTempoMoney(1.2, 'fr'), RangeError);
});
function fixture(lang = 'fr') {
  const element = () => ({ disabled: true, hidden: false, textContent: '', attrs: {}, events: {}, setAttribute(k, v) { this.attrs[k] = v; }, addEventListener(k, f) { (this.events[k] ??= []).push(f); }, fire(k) { for (const f of this.events[k] ?? []) f({ preventDefault() {} }); } });
  const inputs = Object.fromEntries(Object.entries(defaults).map(([k, value]) => [k, Object.assign(element(), { value })]));
  const form = element(); form.elements = { namedItem: k => inputs[k] };
  const fieldset = element(), error = element(), status = element(), result = Object.fromEntries(outputs.map(k => [k, element()]));
  const root = { dataset: { lang }, querySelector(s) { return s === 'form' ? form : s === 'fieldset' ? fieldset : s === '[data-error]' ? error : s === '[data-status]' ? status : result[/^\[data-output="([^"]+)"\]$/.exec(s)?.[1]]; } };
  return { scope: { querySelectorAll: () => [root] }, form, inputs, fieldset, error, status, result };
}
test('Client binding is idempotent, clears stale results on invalid input, then recovers and resets', () => {
  const f = fixture(); bindTempoBillCalculators(f.scope); bindTempoBillCalculators(f.scope);
  assert.equal(f.fieldset.disabled, false); assert.equal(f.form.events.input.length, 1); assert.equal(f.result.tempoBefore.textContent, '984,39\u00a0€');
  f.inputs.shift.value = '10'; f.form.fire('input'); assert.equal(f.result.saving.textContent, '5,68\u00a0€');
  f.inputs.red_hp.value = '-1'; f.form.fire('input'); assert.equal(f.error.hidden, false);
  for (const output of Object.values(f.result)) assert.equal(output.textContent, 'Indisponible');
  f.form.fire('reset'); assert.equal(f.result.tempoBefore.textContent, '984,39\u00a0€'); assert.equal(f.result.saving.textContent, '0,00\u00a0€'); assert.equal(f.error.hidden, true);
  f.inputs.capacity.value = '9'; f.form.fire('change'); assert.equal(f.result.base.textContent, 'Indisponible'); assert.equal(f.result.tempoBefore.textContent, '1\u202f031,19\u00a0€');
});
test('English output is native and incomplete markup stays disabled', () => {
  const f = fixture('en'); bindTempoBillCalculators(f.scope); assert.equal(f.result.tempoBefore.textContent, '€984.39');
  f.inputs.blue_hp.value = '<img src=x onerror=alert(1)>'; f.form.fire('input'); assert.equal(f.result.tempoBefore.textContent, 'Unavailable');
  const broken = fixture(); delete broken.inputs.shift; bindTempoBillCalculators(broken.scope); assert.equal(broken.fieldset.disabled, true);
});
test('Progressive Astro markup retains defaults, native labels and local CSP-compatible scripts', () => {
  const component = readFileSync(new URL('../src/components/TempoBillCalculator.astro', import.meta.url), 'utf8');
  const ui = readFileSync(new URL('../src/lib/tempoBillCalculatorUi.mjs', import.meta.url), 'utf8');
  assert.match(component, /calculateTempoBill\(TEMPO_DEFAULTS\)/); assert.match(component, /<fieldset disabled>/); assert.match(component, /<label for=/);
  assert.match(component, /<details class="tempo-bill-controls"><summary>/); assert.doesNotMatch(component, /<details[^>]*\bopen(?:\s|=|>)/);
  assert.match(component, /<noscript>/); assert.match(component, /aria-live="polite"/); assert.match(component, /<script>import '\.\.\/lib\/tempoBillCalculatorUi\.mjs';<\/script>/);
  assert.doesNotMatch(component + ui, /innerHTML|outerHTML|insertAdjacentHTML|fetch\(|XMLHttpRequest|localStorage|sessionStorage|is:inline|set:html/);
});
