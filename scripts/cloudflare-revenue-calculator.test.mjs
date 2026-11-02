import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { CLOUDFLARE_REVENUE_FIELDS as FIELDS, CLOUDFLARE_REVENUE_DEFAULTS as DEFAULTS, CLOUDFLARE_REVENUE_LIMITS as LIMITS, CLOUDFLARE_REVENUE_RESULTS as RESULTS, CLOUDFLARE_REVENUE_PRESETS as PRESETS, parseCloudflareRevenueValue, calculateCloudflareRevenue, formatCloudflareRevenueFraction, cloudflareRevenueDisplay } from '../src/lib/cloudflareRevenueModel.mjs';
import { cloudflareRevenueCopy, bindCloudflareRevenueCalculators } from '../src/lib/cloudflareRevenueUi.mjs';
const SOURCE = 'https://blog.cloudflare.com/pay-per-use/';
// Whole-field equality follows font-license-assertions.mjs: one labelled value,
// exact canonical reference, and explicit adversarial alternatives.
function assertCanonicalSource(component) {
  assert.equal(typeof component, 'string');
  assert.doesNotMatch(component, /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/u);
  const normalized = component.replace(/\r\n/gu, '\n'); assert.doesNotMatch(normalized, /\r/u);
  const definitions = normalized.split('\n').filter(line => /^\s*const\s+source\s*=/u.test(line));
  assert.equal(definitions.length, 1, 'Exactly one source field');
  assert.equal(definitions[0], `const source = '${SOURCE}';`, 'Complete canonical reference');
  assert.equal(new URL(definitions[0].slice("const source = '".length, -2)).href, SOURCE);
}
const scenario = input => calculateCloudflareRevenue({ ...DEFAULTS, ...input });
test('the initial fictional month retains signed contributions and distinct thresholds', () => {
  const r = scenario(); assert.equal(r.billable, 200000); assert.equal(r.gross, 400); assert.equal(r.after, 360); assert.equal(r.net, 260); assert.equal(r.benchmark, 500); assert.equal(r.gap, -240); assert.equal(r.status, 'below'); assert.equal(r.coverageStatus, 'reachable');
  assert.equal(r.priceThreshold, 1 / 300); assert.equal(r.coverageThreshold, 100 / 3); assert.ok(Object.isFrozen(r) && Object.isFrozen(r.values) && Object.isFrozen(r.exact));
  for (const x of Object.values(r.exact)) if (x) assert.ok(Object.isFrozen(x));
  for (const [coverage, net] of [['5', -10], ['10', 80], ['20', 260], ['50', 800], ['100', 1700]]) assert.equal(scenario({ coverage }).net, net);
});
test('a positive target and an empty revenue base differ from a zero target', () => {
  for (const input of [{ uses: '0' }, { coverage: '0' }, { deductions: '100' }]) { const r = scenario(input); assert.equal(r.priceThreshold, null); assert.equal(r.coverageThreshold, input.coverage === '0' ? 100 / 3 : null); }
  const priceZero = scenario({ price: '0' }); assert.equal(priceZero.gross, 0); assert.equal(priceZero.net, -100); assert.equal(priceZero.coverageThreshold, null); assert.equal(priceZero.priceThreshold, 1 / 300);
  for (const input of [{ uses: '0' }, { price: '0' }, { deductions: '100' }, { coverage: '0' }]) { const r = scenario({ ...input, visits: '0', cost: '0' }); assert.equal(r.priceThreshold, 0); assert.equal(r.coverageThreshold, 0); assert.equal(r.coverageStatus, 'reachable'); }
  assert.equal(scenario({ coverage: '5' }).coverageStatus, 'reachable');
  const unreachable = scenario({ price: '0.000001' }); assert.equal(unreachable.coverageStatus, 'unreachable'); assert.ok(unreachable.coverageThreshold > 100);
});
test('equality, high input bounds and tiny nonzero amounts keep exact signs', () => {
  const equal = scenario({ uses: '1000', coverage: '100', price: '1', deductions: '0', cost: '0', visits: '1000', visitValue: '1000' }); assert.equal(equal.status, 'equal'); assert.equal(equal.coverageThreshold, 100);
  assert.equal(scenario({ cost: '0', visits: '0' }).status, 'above');
  const smallest = scenario({ uses: '1', coverage: '0.1', price: '0.000001', deductions: '99.9', cost: '0', visits: '0' }); assert.equal(smallest.exact.net.n, 1n); assert.equal(smallest.exact.net.d, 1000000000000n); assert.equal(smallest.net, 1e-12); assert.equal(smallest.status, 'above'); assert.match(cloudflareRevenueDisplay(smallest, 'net', 'en'), /E-12/);
  const r = scenario(Object.fromEntries(FIELDS.map(field => [field, LIMITS[field].max]))); assert.equal(r.net, -1000000000); assert.equal(r.priceThreshold, null); assert.equal(r.coverageThreshold, null); for (const field of RESULTS) assert.ok(r[field] === null || Number.isFinite(r[field]));
});
// Independent rational arithmetic derives each equation in ordinary units,
// rather than reusing the production model's pre-expanded scale factors.
const rat = (n, d = 1n) => ({ n, d });
const plus = (a, b) => rat(a.n * b.d + b.n * a.d, a.d * b.d);
const minus = (a, b) => rat(a.n * b.d - b.n * a.d, a.d * b.d);
const times = (a, b) => rat(a.n * b.n, a.d * b.d);
const divide = (a, b) => rat(a.n * b.d, a.d * b.n);
function fromDecimal(raw) { const [whole, part = ''] = raw.split('.'); return rat(BigInt(whole + part), 10n ** BigInt(part.length)); }
function oracle(input) {
  const [u, coverage, p, deductions, k, l, r] = FIELDS.map(field => fromDecimal(input[field]));
  const a = divide(coverage, rat(100n)), keep = minus(rat(1n), divide(deductions, rat(100n)));
  const billable = times(u, a), gross = times(billable, p), after = times(gross, keep), net = minus(after, k), benchmark = divide(times(l, r), rat(1000n)), gap = minus(net, benchmark), target = plus(benchmark, k);
  const priceBase = times(billable, keep), coverageBase = times(times(u, p), keep);
  return { billable, gross, after, net, benchmark, gap, priceThreshold: target.n === 0n ? rat(0n) : priceBase.n === 0n ? null : divide(target, priceBase), coverageThreshold: target.n === 0n ? rat(0n) : coverageBase.n === 0n ? null : times(rat(100n), divide(target, coverageBase)) };
}
test('boundary grids and 2000 fractional cases agree with an independent rational oracle', () => {
  let cases = 0, seed = 864209753;
  const next = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed; };
  function check(input) { const actual = calculateCloudflareRevenue(input), expected = oracle(input); for (const field of RESULTS) { if (expected[field] === null) assert.equal(actual.exact[field], null); else { assert.notEqual(actual.exact[field], null); assert.equal(actual.exact[field].n * expected[field].d, expected[field].n * actual.exact[field].d, `${field}: ${JSON.stringify(input)}`); } } cases++; }
  const levels = FIELDS.map(field => ['0', DEFAULTS[field], LIMITS[field].max]);
  function grid(index, input) { if (index === FIELDS.length) { check(input); return; } for (const value of levels[index]) grid(index + 1, { ...input, [FIELDS[index]]: value }); }
  grid(0, {});
  for (let i = 0; i < 2000; i++) check({ uses: String(next() % 1000000001), coverage: ((next() % 1001) / 10).toFixed(1), price: ((next() % 100000001) / 1000000).toFixed(6), deductions: ((next() % 1001) / 10).toFixed(1), cost: ((next() % 100000001) / 100).toFixed(2), visits: String(next() % 1000000001), visitValue: ((next() % 10000001) / 100).toFixed(2) });
  assert.equal(cases, 4187);
});
test('syntax, precision, maximum bounds and complete input shape fail closed', () => {
  for (const field of FIELDS) {
    assert.equal(parseCloudflareRevenueValue(field, '0'), 0);
    for (const raw of ['', ' ', ' 1', '1 ', '1\n', '1\r\n', '+1', '-1', '.1', '1.', '1e0', '0x1', '00', '01', '1,2.3', 'NaN', 'Infinity', '١', '<script>', '1'.repeat(100000), null, 1, {}]) assert.throws(() => parseCloudflareRevenueValue(field, raw), RangeError);
    assert.throws(() => parseCloudflareRevenueValue(field, '0.' + '1'.repeat(LIMITS[field].precision + 1)), RangeError);
    assert.throws(() => parseCloudflareRevenueValue(field, String(BigInt(LIMITS[field].max) + 1n)), RangeError);
  }
  assert.equal(parseCloudflareRevenueValue('price', '0,000001'), .000001);
  for (const input of [null, [], {}, Object.create(DEFAULTS), { ...DEFAULTS, extra: '1' }, { ...DEFAULTS, [Symbol('hidden')]: 1 }]) assert.throws(() => calculateCloudflareRevenue(input), RangeError);
  assert.throws(() => parseCloudflareRevenueValue('constructor', '1'), RangeError);
});
test('locale formatting preserves signs, tiny amounts and explicit rounding', () => {
  const r = scenario(); assert.equal(cloudflareRevenueDisplay(r, 'net', 'fr'), '260 $US'); assert.equal(cloudflareRevenueDisplay(r, 'gap', 'en'), '−240 USD'); assert.equal(cloudflareRevenueDisplay(r, 'priceThreshold', 'fr'), '≈ 0,003333 $US / usage'); assert.equal(cloudflareRevenueDisplay(scenario({ uses: '0' }), 'priceThreshold', 'en'), 'No finite threshold');
  assert.equal(formatCloudflareRevenueFraction(rat(-1n, 3n), 'fr', 2), '≈ −0,33'); assert.match(formatCloudflareRevenueFraction(rat(-1n, 1000000000000n), 'en'), /−?1E-12|-1E-12/u);
  assert.equal(formatCloudflareRevenueFraction(rat(0n), 'fr'), '0');
  for (const value of [null, NaN, Infinity, rat(1n, 0n), { n: 1, d: 1 }]) assert.throws(() => formatCloudflareRevenueFraction(value, 'en'), RangeError);
  assert.throws(() => cloudflareRevenueDisplay(r, 'constructor', 'en'), RangeError); assert.throws(() => cloudflareRevenueDisplay(r, 'net', 'de'), RangeError);
  for (const lang of ['fr', 'en']) { const c = cloudflareRevenueCopy(lang); assert.equal(c.labels.length, 7); assert.equal(c.help.length, 7); assert.equal(c.resultLabels.length, 8); assert.equal(c.presets.length, 3); assert.match(c.intro, /hypoth|assump/); assert.match(c.initial, /10/); for (const x of Object.values(c).filter(x => typeof x === 'string')) assert.doesNotMatch(x, /—|deux horloges|two clocks/iu); }
});
const node = (extra = {}) => Object.assign({ textContent: '', dataset: {}, attrs: {}, setAttribute(key, value) { this.attrs[key] = String(value); } }, extra);
function fixture(lang = 'en') {
  const inputs = FIELDS.map(field => node({ value: DEFAULTS[field] })), handlers = {}, fieldset = { disabled: true };
  const form = { elements: { namedItem: field => inputs[FIELDS.indexOf(field)] }, addEventListener(key, handler) { handlers[key] = handler; } };
  const error = node({ hidden: true }), status = node(), scenarioText = node(), classification = node(), coverage = node();
  const outputs = RESULTS.map(field => node({ dataset: { cloudflareRevenueResult: field } }));
  const presets = PRESETS.map(value => node({ dataset: { cloudflareRevenuePreset: value }, addEventListener(_key, handler) { this.handler = handler; } }));
  const elements = { form, fieldset, '[data-error]': error, '[data-status]': status, '[data-scenario]': scenarioText, '[data-cloudflare-revenue-status]': classification, '[data-cloudflare-revenue-coverage]': coverage };
  const root = { dataset: { cloudflareRevenueLang: lang }, querySelector: key => elements[key], querySelectorAll: key => key === '[data-cloudflare-revenue-result]' ? outputs : presets };
  return { root, scope: { querySelectorAll: () => [root] }, inputs, handlers, fieldset, error, status, scenarioText, classification, coverage, outputs, presets };
}
test('progressive controls bind once, preserve preset scope and reset all seven inputs', () => {
  for (const lang of ['fr', 'en']) {
    const f = fixture(lang); bindCloudflareRevenueCalculators(f.scope); assert.equal(f.fieldset.disabled, false); assert.equal(f.outputs[3].textContent, cloudflareRevenueDisplay(scenario(), 'net', lang));
    const handler = f.handlers.input; bindCloudflareRevenueCalculators(f.scope); assert.equal(f.handlers.input, handler);
    f.presets[0].handler(); assert.equal(f.inputs[1].value, '5'); assert.equal(f.outputs[3].textContent, lang === 'fr' ? '−10 $US' : '−10 USD'); assert.equal(f.inputs[2].value, '0.002');
    f.handlers.reset({ preventDefault() {} }); assert.deepEqual(f.inputs.map(input => input.value), FIELDS.map(field => DEFAULTS[field])); assert.equal(f.scenarioText.textContent, cloudflareRevenueCopy(lang).initial);
    let prevented = false; f.handlers.submit({ preventDefault() { prevented = true; } }); assert.equal(prevented, true);
  }
});
test('invalid edits clear every result and recover without stale output', () => {
  const f = fixture(); bindCloudflareRevenueCalculators(f.scope);
  for (let i = 0; i < FIELDS.length; i++) for (const value of ['', '-1', '1e0', '<script>']) {
    f.inputs[i].value = value; f.handlers.input(); assert.equal(f.root.dataset.valid, 'false'); assert.equal(f.error.hidden, false); assert.equal(f.inputs[i].attrs['aria-invalid'], 'true'); for (const output of f.outputs) assert.equal(output.textContent, 'Unavailable'); assert.equal(f.classification.textContent, 'Unavailable'); assert.equal(f.coverage.textContent, 'Unavailable');
    f.inputs[i].value = DEFAULTS[FIELDS[i]]; f.handlers.input(); assert.equal(f.root.dataset.valid, 'true'); assert.equal(f.error.hidden, true);
  }
});
test('independent instances and malformed markup remain safely isolated', () => {
  const a = fixture('fr'), b = fixture('en'); bindCloudflareRevenueCalculators({ querySelectorAll: () => [a.root, b.root] }); a.presets[2].handler(); assert.equal(a.inputs[1].value, '50'); assert.equal(b.inputs[1].value, '20');
  const unsupported = fixture('de'); bindCloudflareRevenueCalculators(unsupported.scope); assert.equal(unsupported.fieldset.disabled, true);
  for (const corrupt of [f => f.outputs.pop(), f => { f.outputs[1].dataset.cloudflareRevenueResult = f.outputs[0].dataset.cloudflareRevenueResult; }, f => f.presets.pop(), f => { f.presets[0].dataset.cloudflareRevenuePreset = 'https://evil.invalid'; }, f => f.inputs.pop()]) { const f = fixture(); corrupt(f); bindCloudflareRevenueCalculators(f.scope); assert.equal(f.fieldset.disabled, true); assert.deepEqual(f.handlers, {}); }
});
test('SSR, accessible controls, passive security and one complete source reference are retained', () => {
  const component = fs.readFileSync(new URL('../src/components/CloudflareRevenueCalculator.astro', import.meta.url), 'utf8'), ui = fs.readFileSync(new URL('../src/lib/cloudflareRevenueUi.mjs', import.meta.url), 'utf8'), model = fs.readFileSync(new URL('../src/lib/cloudflareRevenueModel.mjs', import.meta.url), 'utf8');
  for (const pattern of [/<fieldset disabled>/, /cloudflareRevenueDisplay\(initial/, /<noscript>/, /aria-describedby=/, /role="status"/, /data-cloudflare-revenue-preset=/, /var\(--color-signal\)/]) assert.match(component, pattern);
  assertCanonicalSource(component); assert.doesNotMatch(component, /<script\s+is:inline|onclick=|oninput=|foreignObject/iu); assert.doesNotMatch(ui + model, /innerHTML|outerHTML|insertAdjacentHTML|fetch\(|XMLHttpRequest|WebSocket|sendBeacon|localStorage|sessionStorage|document\.cookie|eval\(|new Function/);
});
test('full canonical source-field checks reject forged and duplicate references with LF or CRLF', () => {
  const component = fs.readFileSync(new URL('../src/components/CloudflareRevenueCalculator.astro', import.meta.url), 'utf8'), original = `const source = '${SOURCE}';`;
  assertCanonicalSource(component); assertCanonicalSource(component.replace(/\r?\n/gu, '\r\n'));
  const badUrls = [SOURCE.replace('https:', 'http:'), SOURCE.replace('blog.cloudflare.com', 'blog.cloudflare.com.evil.invalid'), SOURCE.replace('blog.cloudflare.com', 'blog.cloudflare.com@evil.invalid'), SOURCE.replace('blog.cloudflare.com', 'evil.invalid@blog.cloudflare.com'), SOURCE.replace('blog.cloudflare.com', 'blog.cloudflare.com:443'), SOURCE + '?source=' + SOURCE, SOURCE + '#canonical', SOURCE.replace('/pay-per-use/', '/unexpected/pay-per-use/'), 'https://evil.invalid/?target=' + SOURCE, 'https://evil.invalid/' + SOURCE, 'https://evil.invalid/#' + SOURCE, SOURCE.replace('.com/', '.com/\t'), SOURCE + '\u0000', SOURCE + '\r', SOURCE + '\n', SOURCE + '\r\n', SOURCE + ' ', SOURCE + '/suffix', SOURCE + 'x'.repeat(100000)];
  for (const value of badUrls) assert.throws(() => assertCanonicalSource(component.replace(original, `const source = '${value}';`)), assert.AssertionError);
  for (const replacement of ['', original + '\n' + original, original + '\n  ' + original, original + '\nconst source="' + SOURCE + '";', original + ' trailing', `const source = '${SOURCE}' + '';`]) assert.throws(() => assertCanonicalSource(component.replace(original, replacement)), assert.AssertionError);
});
