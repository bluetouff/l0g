import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { BROADCOM_GUARANTEE_FIELDS as FIELDS, BROADCOM_GUARANTEE_DEFAULTS as DEFAULTS, BROADCOM_GUARANTEE_LIMITS as LIMITS, BROADCOM_GUARANTEE_RESULTS as RESULTS, BROADCOM_GUARANTEE_PRESETS as PRESETS, parseBroadcomGuaranteeValue, calculateBroadcomGuarantee, formatBroadcomGuarantee, broadcomGuaranteeDisplay, broadcomGuaranteeEquation } from '../src/lib/broadcomGuaranteeModel.mjs';
import { broadcomGuaranteeCopy, bindBroadcomGuaranteeCalculators } from '../src/lib/broadcomGuaranteeUi.mjs';
const BROADCOM_TECHNICAL_SOURCE = 'https://www.sec.gov/Archives/edgar/data/1730168/000119312526434271/d148323d8k.htm';
function assertCanonicalBroadcomSourceField(component) {
  assert.equal(typeof component, 'string');
  assert.doesNotMatch(component, /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/u);
  const normalized = component.replace(/\r\n/gu, '\n');
  assert.doesNotMatch(normalized, /\r/u);
  const definitions = normalized.split('\n').filter(line => /^\s*const\s+source\s*=/u.test(line));
  assert.equal(definitions.length, 1, 'Exactly one source definition');
  assert.equal(definitions[0], `const source = '${BROADCOM_TECHNICAL_SOURCE}';`, 'Complete canonical source field');
  const value = definitions[0].slice("const source = '".length, -2);
  assert.equal(value, BROADCOM_TECHNICAL_SOURCE); assert.equal(new URL(value).href, BROADCOM_TECHNICAL_SOURCE);
}
const scenario = values => calculateBroadcomGuarantee({ ...DEFAULTS, ...values });
test('the initial default-and-sale teaching scenario preserves its conditional numerator', () => {
  assert.deepEqual(DEFAULTS, { lease: '100', resale: '50', defaulted: true }); assert.deepEqual(LIMITS, { min: 0, max: 100, step: '0.001' });
  const r = scenario(); assert.equal(r.support, 22.5); assert.equal(r.base, 72.5); assert.equal(r.supportNumerator, 900000); assert.equal(r.status, 'support'); assert.ok(Object.isFrozen(r) && Object.isFrozen(r.values) && Object.isFrozen(DEFAULTS));
  assert.equal(scenario({ resale: '30' }).support, 42.5); assert.equal(scenario({ resale: '60' }).support, 12.5); assert.equal(scenario({ resale: '90' }).support, 0);
});
test('paying rent leaves support at zero irrespective of sale proceeds', () => {
  for (const lease of ['0', '0.001', '50', '100']) for (const resale of ['0', '30', '72.5', '100']) { const r = scenario({ lease, resale, defaulted: false }); assert.equal(r.support, 0); assert.equal(r.supportNumerator, 0); assert.equal(r.status, 'paying'); }
});
test('zero, equality and the smallest permitted support remain distinct', () => {
  assert.equal(scenario({ lease: '0', resale: '0' }).status, 'covered'); assert.equal(scenario({ resale: '72.5' }).status, 'covered'); assert.equal(scenario({ resale: '72.501' }).support, 0);
  assert.equal(scenario({ resale: '72.499' }).support, .001); assert.equal(scenario({ lease: '0.001', resale: '0' }).support, .000725);
  const r = scenario({ lease: '0.029', resale: '0.021' }); assert.equal(r.support, .000025); assert.equal(r.supportNumerator, 1); assert.equal(broadcomGuaranteeDisplay(r, 'support', 'en'), '0.000025'); assert.equal(broadcomGuaranteeDisplay(r, 'support', 'fr'), '0,000025');
});
test('the full integer grid and 1000 decimal cases agree with an independent BigInt oracle', () => {
  let seed = 246813579, cases = 0; const next = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed; };
  const check = (l, v, defaulted) => { const input = { lease: (l / 1000).toFixed(3), resale: (v / 1000).toFixed(3), defaulted }; const result = calculateBroadcomGuarantee(input); const gap = BigInt(l) * 725n - BigInt(v) * 1000n; const expected = defaulted && gap > 0n ? gap : 0n; assert.equal(result.support, Number(expected) / 1000000); assert.equal(result.base, Number(BigInt(l) * 725n) / 1000000); assert.ok(result.support >= 0 && result.support <= result.base); cases++; };
  for (let l = 0; l <= 100000; l += 1000) for (let v = 0; v <= 100000; v += 1000) for (const defaulted of [false, true]) check(l, v, defaulted);
  for (let i = 0; i < 1000; i++) check(next() % 100001, next() % 100001, Boolean(next() & 1)); assert.equal(cases, 21402);
});
test('strict syntax, bounds, object shape and boolean trigger reject ambiguous input', () => {
  assert.equal(parseBroadcomGuaranteeValue('0'), 0); assert.equal(parseBroadcomGuaranteeValue('100.000'), 100); assert.equal(parseBroadcomGuaranteeValue('0,001'), .001);
  for (const raw of ['', ' ', ' 1', '1 ', '1\n', '1\r\n', '+1', '-1', '.1', '1.', '1e2', '0x1', '00', '01', '1.0000', '1,0000', '1,2.3', '100.001', 'NaN', 'Infinity', '١', '<script>', '1'.repeat(100000), null, 1, {}]) assert.throws(() => parseBroadcomGuaranteeValue(raw), RangeError);
  for (const input of [null, [], {}, Object.create(DEFAULTS), { ...DEFAULTS, extra: '1' }, { ...DEFAULTS, [Symbol('hidden')]: 1 }, { ...DEFAULTS, defaulted: 1 }, { ...DEFAULTS, defaulted: 'true' }]) assert.throws(() => calculateBroadcomGuarantee(input), RangeError);
});
test('native display and scope explain support separately from financing or expected loss', () => {
  assert.equal(broadcomGuaranteeDisplay(scenario(), 'support', 'fr'), '22,5'); assert.equal(broadcomGuaranteeDisplay(scenario(), 'base', 'en'), '72.5');
  assert.match(broadcomGuaranteeEquation(scenario(), 'fr'), /0,725 × 100 − 50/); assert.match(broadcomGuaranteeEquation(scenario({ defaulted: false }), 'en'), /G = 0/);
  for (const lang of ['fr', 'en']) { const c = broadcomGuaranteeCopy(lang); assert.equal(c.labels.length, 2); assert.equal(c.resultLabels.length, 2); assert.equal(c.presets.length, 3); assert.match(c.initial, /63/); assert.match(c.initial, /43/); assert.match(c.limits, /42/); for (const s of Object.values(c).filter(s => typeof s === 'string')) assert.doesNotMatch(s, /—|deux horloges|two clocks/iu); }
  for (const value of [NaN, Infinity, '1']) assert.throws(() => formatBroadcomGuarantee(value, 'en'), RangeError); assert.throws(() => formatBroadcomGuarantee(1, 'de'), RangeError); assert.throws(() => broadcomGuaranteeDisplay(scenario(), 'constructor', 'en'), RangeError); assert.throws(() => broadcomGuaranteeCopy('de'), RangeError);
});
const node = (extra = {}) => Object.assign({ textContent: '', dataset: {}, attrs: {}, setAttribute(key, value) { this.attrs[key] = String(value); } }, extra);
function fixture(lang = 'en') {
  const inputs = FIELDS.map(field => node({ value: DEFAULTS[field] })), defaultBox = node({ checked: true }), handlers = {}, fieldset = { disabled: true };
  const form = { elements: { namedItem: field => field === 'defaulted' ? defaultBox : inputs[FIELDS.indexOf(field)] }, addEventListener(key, handler) { handlers[key] = handler; } };
  const error = node({ hidden: true }), status = node(), scenarioText = node(), classification = node(), equation = node();
  const outputs = RESULTS.map(field => node({ dataset: { broadcomGuaranteeResult: field } }));
  const presets = PRESETS.map(value => node({ dataset: { broadcomGuaranteePreset: value }, addEventListener(_key, handler) { this.handler = handler; } }));
  const elements = { form, fieldset, '[data-error]': error, '[data-status]': status, '[data-scenario]': scenarioText, '[data-broadcom-guarantee-status]': classification, '[data-broadcom-guarantee-equation]': equation };
  const root = { dataset: { broadcomGuaranteeLang: lang }, querySelector: key => elements[key], querySelectorAll: key => key === '[data-broadcom-guarantee-result]' ? outputs : presets };
  return { root, scope: { querySelectorAll: () => [root] }, inputs, defaultBox, handlers, fieldset, error, status, scenarioText, classification, equation, outputs, presets };
}
test('progressive UI binds once, applies examples, handles paying mode and resets', () => {
  for (const lang of ['fr', 'en']) { const f = fixture(lang), copy = broadcomGuaranteeCopy(lang); bindBroadcomGuaranteeCalculators(f.scope); assert.equal(f.fieldset.disabled, false); assert.equal(f.outputs[0].textContent, broadcomGuaranteeDisplay(scenario(), 'support', lang)); const handler = f.handlers.input; bindBroadcomGuaranteeCalculators(f.scope); assert.equal(f.handlers.input, handler);
    f.presets[0].handler(); assert.equal(f.inputs[1].value, '30'); assert.equal(f.outputs[0].textContent, lang === 'fr' ? '42,5' : '42.5');
    f.defaultBox.checked = false; f.handlers.change(); assert.equal(f.outputs[0].textContent, '0'); assert.equal(f.classification.textContent, copy.statuses.paying);
    f.handlers.reset({ preventDefault() {} }); assert.equal(f.defaultBox.checked, true); assert.deepEqual(f.inputs.map(input => input.value), ['100', '50']); assert.equal(f.scenarioText.textContent, copy.initial);
    let prevented = false; f.handlers.submit({ preventDefault() { prevented = true; } }); assert.equal(prevented, true);
  }
});
test('invalid entries clear every result and recover without stale output', () => {
  const f = fixture(); bindBroadcomGuaranteeCalculators(f.scope);
  for (let i = 0; i < 2; i++) for (const value of ['', '100.001', '1e2', '<script>']) { f.inputs[i].value = value; f.handlers.input(); assert.equal(f.root.dataset.valid, 'false'); assert.equal(f.error.hidden, false); assert.equal(f.inputs[i].attrs['aria-invalid'], 'true'); for (const output of f.outputs) assert.equal(output.textContent, 'Unavailable'); assert.equal(f.equation.textContent, 'Unavailable'); assert.equal(f.classification.textContent, 'Unavailable'); f.inputs[i].value = i === 0 ? '100' : '50'; f.handlers.input(); assert.equal(f.root.dataset.valid, 'true'); assert.equal(f.error.hidden, true); }
});
test('multiple calculators stay isolated and malformed markup stays disabled', () => {
  const a = fixture('fr'), b = fixture('en'); bindBroadcomGuaranteeCalculators({ querySelectorAll: () => [a.root, b.root] }); a.presets[2].handler(); assert.equal(a.inputs[1].value, '90'); assert.equal(b.inputs[1].value, '50');
  const unsupported = fixture('de'); bindBroadcomGuaranteeCalculators(unsupported.scope); assert.equal(unsupported.fieldset.disabled, true);
  for (const corrupt of [f => f.outputs.pop(), f => { f.outputs[1].dataset.broadcomGuaranteeResult = 'support'; }, f => f.presets.pop(), f => { f.presets[0].dataset.broadcomGuaranteePreset = 'https://evil.invalid'; }, f => { f.defaultBox.checked = undefined; }]) { const f = fixture(); corrupt(f); bindBroadcomGuaranteeCalculators(f.scope); assert.equal(f.fieldset.disabled, true); assert.deepEqual(f.handlers, {}); }
});
test('component retains SSR, scoped controls, source and passive security contracts', () => {
  const component = fs.readFileSync(new URL('../src/components/BroadcomGuaranteeCalculator.astro', import.meta.url), 'utf8'), ui = fs.readFileSync(new URL('../src/lib/broadcomGuaranteeUi.mjs', import.meta.url), 'utf8'), model = fs.readFileSync(new URL('../src/lib/broadcomGuaranteeModel.mjs', import.meta.url), 'utf8');
  for (const pattern of [/<fieldset disabled>/, /broadcomGuaranteeDisplay\(initial/, /<noscript>/, /aria-describedby=/, /role="status"/, /data-broadcom-guarantee-preset=/, /type="checkbox"/, /var\(--color-signal\)/]) assert.match(component, pattern);
  assertCanonicalBroadcomSourceField(component); assert.doesNotMatch(component, /<script\s+is:inline|onclick=|oninput=|foreignObject/iu); assert.doesNotMatch(ui + model, /innerHTML|outerHTML|insertAdjacentHTML|fetch\(|XMLHttpRequest|WebSocket|sendBeacon|localStorage|sessionStorage|document\.cookie|eval\(|new Function/);
});
test('source field accepts only one full canonical value, including LF and CRLF documents', () => {
  const component = fs.readFileSync(new URL('../src/components/BroadcomGuaranteeCalculator.astro', import.meta.url), 'utf8'), original = `const source = '${BROADCOM_TECHNICAL_SOURCE}';`;
  assertCanonicalBroadcomSourceField(component); assertCanonicalBroadcomSourceField(component.replace(/\r?\n/gu, '\r\n'));
  const badUrls = [BROADCOM_TECHNICAL_SOURCE.replace('https:', 'http:'), BROADCOM_TECHNICAL_SOURCE.replace('www.sec.gov', 'www.sec.gov.evil.invalid'), BROADCOM_TECHNICAL_SOURCE.replace('www.sec.gov', 'www.sec.gov@evil.invalid'), BROADCOM_TECHNICAL_SOURCE.replace('www.sec.gov', 'evil.invalid@www.sec.gov'), BROADCOM_TECHNICAL_SOURCE.replace('www.sec.gov', 'www.sec.gov:443'), BROADCOM_TECHNICAL_SOURCE + '?source=' + BROADCOM_TECHNICAL_SOURCE, BROADCOM_TECHNICAL_SOURCE + '#canonical', BROADCOM_TECHNICAL_SOURCE.replace('/Archives/', '/unexpected/Archives/'), 'https://evil.invalid/?target=' + BROADCOM_TECHNICAL_SOURCE, 'https://evil.invalid/' + BROADCOM_TECHNICAL_SOURCE, 'https://evil.invalid/#' + BROADCOM_TECHNICAL_SOURCE, BROADCOM_TECHNICAL_SOURCE.replace('.gov/', '.gov/\t'), BROADCOM_TECHNICAL_SOURCE + '\u0000', BROADCOM_TECHNICAL_SOURCE + '\r', BROADCOM_TECHNICAL_SOURCE + '\n', BROADCOM_TECHNICAL_SOURCE + '\r\n', BROADCOM_TECHNICAL_SOURCE + ' ', BROADCOM_TECHNICAL_SOURCE + '/suffix', BROADCOM_TECHNICAL_SOURCE + 'x'.repeat(100000)];
  for (const value of badUrls) assert.throws(() => assertCanonicalBroadcomSourceField(component.replace(original, `const source = '${value}';`)), assert.AssertionError);
  for (const replacement of ['', original + '\n' + original, original + '\n  ' + original, original + '\nconst source="' + BROADCOM_TECHNICAL_SOURCE + '";', original + ' trailing', `const source = '${BROADCOM_TECHNICAL_SOURCE}' + '';`]) assert.throws(() => assertCanonicalBroadcomSourceField(component.replace(original, replacement)), assert.AssertionError);
});
