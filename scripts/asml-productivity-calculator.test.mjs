import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { ASML_PRODUCTIVITY_FIELDS as FIELDS, ASML_PRODUCTIVITY_DEFAULTS as DEFAULTS, ASML_PRODUCTIVITY_LIMITS as LIMITS, ASML_PRODUCTIVITY_RESULTS as RESULTS, parseAsmlProductivityValue, calculateAsmlProductivity, formatAsmlProductivity, asmlProductivityDisplay, asmlProductivityPlot } from '../src/lib/asmlProductivityModel.mjs';
import { asmlProductivityCopy, asmlProductivityNotes, bindAsmlProductivityCalculators } from '../src/lib/asmlProductivityUi.mjs';
const scenario = values => calculateAsmlProductivity({ ...DEFAULTS, ...values });
const close = (actual, expected, tolerance = 1e-10) => assert.ok(Math.abs(actual - expected) <= Math.max(1, Math.abs(expected)) * tolerance, `${actual} != ${expected}`);
test('historical vendor parameters and illustrative common utilization remain separate', () => {
  assert.deepEqual(DEFAULTS, { before: '230', after: '295', down: '42', horizon: '365', availability: '90', loading: '80' });
  const r = scenario();
  assert.equal(r.baseline, 1450656); assert.equal(r.upgraded, 1646524.8); assert.equal(r.delta, 195868.8);
  close(r.catchup, 190.6153846153846); close(r.afterRestart, 148.6153846153846); close(r.percent, 13.502084574151283); assert.equal(r.status, 'within');
  assert.ok(Object.isFrozen(r)); assert.ok(Object.isFrozen(r.values)); assert.ok(Object.isFrozen(DEFAULTS));
  const full = scenario({ availability: '100', loading: '100' }); assert.equal(full.baseline, 2014800); assert.equal(full.upgraded, 2286840); assert.equal(full.delta, 272040);
  assert.equal(full.catchup, r.catchup); assert.equal(full.afterRestart, r.afterRestart); close(full.percent, r.percent);
});
test('downtime and horizon boundaries retain production and catch-up meanings', () => {
  for (const horizon of ['1', '41.999', '42']) { const r = scenario({ horizon }); assert.equal(r.upgraded, 0); assert.equal(r.percent, -100); assert.equal(r.status, 'beyond'); }
  assert.equal(scenario({ horizon: '42.001' }).upgraded, 5.0976);
  assert.equal(scenario({ horizon: '190.615' }).status, 'beyond'); assert.equal(scenario({ horizon: '190.616' }).status, 'within');
  const zero = scenario({ down: '0' }); assert.equal(zero.catchup, 0); assert.equal(zero.afterRestart, 0); close(zero.percent, 65 / 230 * 100);
  const same = scenario({ before: '295', down: '0' }); assert.equal(same.status, 'identical'); assert.equal(same.delta, 0); assert.equal(same.catchup, 0);
  for (const parameters of [{ before: '295' }, { before: '296' }, { before: '296', down: '0' }]) { const r = scenario(parameters); assert.equal(r.catchup, null); assert.equal(r.afterRestart, null); assert.equal(r.status, 'never'); assert.ok(r.delta < 0); }
});
test('scaled decimal parsing preserves the smallest throughput gap without cancellation', () => {
  const r = scenario({ before: '999.999', after: '1000', down: '365' });
  assert.equal(r.catchup, 365000000); assert.equal(r.afterRestart, 364999635); assert.equal(r.status, 'beyond');
  const small = scenario({ before: '1', after: '1.001', down: '0', horizon: '1', availability: '1', loading: '1' });
  assert.equal(small.baseline, .0024); assert.equal(small.upgraded, .0024024); assert.equal(small.delta, .0000024); close(small.percent, .1);
  assert.equal(parseAsmlProductivityValue('0,001', 'down'), .001); assert.equal(parseAsmlProductivityValue('1460.000', 'horizon'), 1460);
});
test('1000 varied scenarios match independent exact time-interval capacity arithmetic', () => {
  let seed = 123456789;
  const next = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed; };
  for (let i = 0; i < 1000; i++) {
    const raw = {}, scaled = {};
    for (const field of FIELDS) { const [lo, hi] = LIMITS[field]; scaled[field] = lo * 1000 + next() % ((hi - lo) * 1000 + 1); const n = scaled[field]; raw[field] = `${Math.floor(n / 1000)}.${String(n % 1000).padStart(3, '0')}`; }
    const r = calculateAsmlProductivity(raw), integers = Object.fromEntries(FIELDS.map(field => [field, BigInt(scaled[field])]));
    const active = integers.horizon > integers.down ? integers.horizon - integers.down : 0n;
    const baseline = 24n * integers.before * integers.horizon * integers.availability * integers.loading;
    const upgraded = 24n * integers.after * active * integers.availability * integers.loading;
    assert.equal(r.baseline, Number(baseline) / 1e16); assert.equal(r.upgraded, Number(upgraded) / 1e16); assert.equal(r.delta, Number(upgraded - baseline) / 1e16);
    assert.ok(Number.isFinite(r.percent));
    if (integers.after > integers.before) {
      assert.equal(r.catchup, Number(integers.down * integers.after) / Number(1000n * (integers.after - integers.before)));
      close(r.values.before * r.catchup, r.values.after * (r.catchup - r.values.down), 1e-8);
    } else assert.equal(r.catchup, null);
  }
});
test('field syntax, limits, precision and object shape fail closed', () => {
  for (const field of FIELDS) {
    const [lo, hi] = LIMITS[field]; assert.equal(parseAsmlProductivityValue(String(lo), field), lo); assert.equal(parseAsmlProductivityValue(String(hi), field), hi);
    for (const raw of ['', ' ', ' 1', '1 ', '1\n', '1\r\n', '+1', '-1', '.1', '1.', '1e2', '0x1', '00', '01', '1.0000', '1,0000', '1,2.3', 'NaN', 'Infinity', '١', '<script>', '1'.repeat(100000), null, 1, {}, String(hi + .001)]) assert.throws(() => parseAsmlProductivityValue(raw, field), RangeError);
    if (lo > 0) assert.throws(() => parseAsmlProductivityValue('0', field), RangeError);
  }
  assert.throws(() => parseAsmlProductivityValue('1', 'constructor'), RangeError);
  for (const input of [null, 1, [], {}, Object.create(DEFAULTS), { ...DEFAULTS, extra: '1' }, { ...DEFAULTS, [Symbol('hidden')]: 1 }]) assert.throws(() => calculateAsmlProductivity(input), RangeError);
});
test('formatting and explanatory copy retain units, history, assumptions and non-financial scope', () => {
  const r = scenario();
  assert.equal(asmlProductivityDisplay(r, 'baseline', 'fr'), '1 450 656'); assert.equal(asmlProductivityDisplay(r, 'upgraded', 'en'), '1,646,525'); assert.equal(asmlProductivityDisplay(r, 'delta', 'en'), '+195,869'); assert.equal(asmlProductivityDisplay(r, 'catchup', 'fr'), '190,6');
  assert.equal(asmlProductivityDisplay(scenario({ before: '300' }), 'catchup', 'fr'), 'Aucun');
  assert.equal(asmlProductivityDisplay(scenario({ before: '1', horizon: '1', availability: '1', loading: '1' }), 'baseline', 'en'), '0.0024');
  for (const lang of ['fr', 'en']) { const c = asmlProductivityCopy(lang), n = asmlProductivityNotes(r, lang); assert.equal(c.labels.length, 6); assert.equal(c.resultLabels.length, 4); assert.match(c.initial, /2021/); assert.match(c.initial, /90/); assert.match(c.initial, /80/); assert.match(c.scenario, lang === 'fr' ? /puces finies/ : /finished chips/); assert.match(n.catchup, lang === 'fr' ? /148,6/ : /148.6/); assert.match(n.delta, lang === 'fr' ? /13,5/ : /13.5/); for (const v of Object.values(c).filter(v => typeof v === 'string')) assert.doesNotMatch(v, /—|deux horloges|two clocks/iu); }
  for (const value of [NaN, Infinity, '1']) assert.throws(() => formatAsmlProductivity(value, 'en'), RangeError);
  assert.throws(() => formatAsmlProductivity(1, 'de'), RangeError); assert.throws(() => formatAsmlProductivity(1, 'fr', 6), RangeError); assert.throws(() => asmlProductivityCopy('de'), RangeError); assert.throws(() => asmlProductivityDisplay(r, 'constructor', 'fr'), RangeError);
});
test('both chart layouts produce bounded finite paths and suitable units for tiny and large volumes', () => {
  for (const result of [scenario(), scenario({ horizon: '1' }), scenario({ down: '0' }), scenario({ before: '1', after: '1.001', availability: '1', loading: '1', horizon: '1' }), scenario({ before: '1000', after: '1000', horizon: '1460', availability: '100', loading: '100' })]) {
    for (const mode of ['desktop', 'mobile']) for (const lang of ['fr', 'en']) {
      const p = asmlProductivityPlot(result, mode, lang); assert.equal(p.xTicks.length, mode === 'mobile' ? 3 : 5); assert.equal(p.yTicks.length, 5); assert.doesNotMatch(p.baseline + p.upgraded, /NaN|Infinity/); assert.ok(Number(p.downtimeWidth) >= 0 && Number(p.downtimeWidth) <= p.right - p.left);
      const coordinates = (p.baseline + ' ' + p.upgraded).match(/\d+(?:\.\d+)?/g).map(Number); for (let i = 0; i < coordinates.length; i += 2) { assert.ok(coordinates[i] >= p.left && coordinates[i] <= p.right); assert.ok(coordinates[i + 1] >= p.top && coordinates[i + 1] <= p.bottom); }
      if (p.catchupVisible) { assert.ok(Number(p.catchupX) >= p.left && Number(p.catchupX) <= p.right); assert.ok(Number(p.catchupY) >= p.top && Number(p.catchupY) <= p.bottom); }
    }
  }
  assert.match(asmlProductivityPlot(scenario(), 'mobile', 'en').unit, /Million/);
  const tiny = asmlProductivityPlot(scenario({ before: '1', after: '1', availability: '1', loading: '1', horizon: '1' }), 'mobile', 'en'); assert.equal(tiny.unit, 'Wafer passes'); assert.notEqual(tiny.yTicks[4].label, '0');
  assert.throws(() => asmlProductivityPlot(scenario(), 'unknown', 'en'), RangeError);
});
const node = (extra = {}) => Object.assign({ textContent: '', dataset: {}, attrs: {}, setAttribute(key, value) { this.attrs[key] = String(value); } }, extra);
function fixture(lang = 'en') {
  const inputs = FIELDS.map(field => node({ value: DEFAULTS[field] })), handlers = {}, form = { elements: { namedItem: field => inputs[FIELDS.indexOf(field)] }, addEventListener(key, handler) { handlers[key] = handler; } }, fieldset = { disabled: true };
  const error = node({ hidden: true }), status = node(), scenarioText = node(), deltaNote = node(), catchupNote = node(), chartWrap = node({ hidden: false }), chartUnit = node(), catchupUnit = node({ hidden: false }), preset = node({ addEventListener(key, handler) { this.handler = handler; } });
  const outputs = RESULTS.map(field => node({ dataset: { asmlProductivityResult: field } }));
  const charts = ['desktop', 'mobile'].map(mode => {
    const elements = { '[data-asml-baseline]': node(), '[data-asml-upgraded]': node(), '[data-asml-downtime]': node(), '[data-asml-catchup]': node(), desc: node() };
    const lists = { '[data-asml-y-tick]': Array.from({ length: 5 }, () => node()), '[data-asml-grid]': Array.from({ length: 5 }, () => node()), '[data-asml-x-tick]': Array.from({ length: mode === 'mobile' ? 3 : 5 }, () => node()) };
    return { dataset: { asmlPlot: mode }, elements, lists, querySelector: key => elements[key], querySelectorAll: key => lists[key] ?? [] };
  });
  const elements = { form, fieldset, '[data-error]': error, '[data-status]': status, '[data-scenario]': scenarioText, '[data-asml-delta-note]': deltaNote, '[data-asml-catchup-note]': catchupNote, '[data-asml-chart-wrap]': chartWrap, '[data-asml-chart-unit]': chartUnit, '[data-asml-full-use]': preset, '[data-asml-result-unit="catchup"]': catchupUnit };
  const root = { dataset: { asmlProductivityLang: lang }, querySelector: key => elements[key], querySelectorAll: key => key === '[data-asml-productivity-result]' ? outputs : charts };
  return { root, scope: { querySelectorAll: () => [root] }, inputs, handlers, outputs, charts, elements, fieldset, error, scenarioText, deltaNote, catchupNote, chartWrap, chartUnit, catchupUnit, preset };
}
test('progressive scoped UI binds once, applies full-use preset and restores historical parameters', () => {
  for (const lang of ['fr', 'en']) {
    const f = fixture(lang); bindAsmlProductivityCalculators(f.scope); assert.equal(f.fieldset.disabled, false); assert.equal(f.root.dataset.valid, 'true'); assert.equal(f.scenarioText.textContent, asmlProductivityCopy(lang).initial);
    const handler = f.handlers.input; bindAsmlProductivityCalculators(f.scope); assert.equal(f.handlers.input, handler);
    f.preset.handler(); assert.equal(f.inputs[4].value, '100'); assert.equal(f.inputs[5].value, '100'); assert.equal(f.outputs[0].textContent, asmlProductivityDisplay(scenario({ availability: '100', loading: '100' }), 'baseline', lang)); assert.equal(f.scenarioText.textContent, asmlProductivityCopy(lang).scenario);
    f.inputs[0].value = '1000'; f.handlers.change(); assert.equal(f.catchupUnit.hidden, true); assert.equal(f.outputs[3].textContent, lang === 'fr' ? 'Aucun' : 'None');
    f.handlers.reset({ preventDefault() {} }); assert.deepEqual(f.inputs.map(input => input.value), Object.values(DEFAULTS)); assert.equal(f.catchupUnit.hidden, false); assert.equal(f.scenarioText.textContent, asmlProductivityCopy(lang).initial);
    let prevented = false; f.handlers.submit({ preventDefault() { prevented = true; } }); assert.equal(prevented, true);
  }
});
test('invalid input clears all outputs and hides stale chart before recovery', () => {
  const f = fixture(); bindAsmlProductivityCalculators(f.scope);
  for (let i = 0; i < FIELDS.length; i++) for (const raw of ['', '1e2', '1.0001', '<script>']) {
    f.inputs[i].value = raw; f.handlers.input(); assert.equal(f.root.dataset.valid, 'false'); assert.equal(f.chartWrap.hidden, true); assert.equal(f.error.hidden, false); assert.equal(f.inputs[i].attrs['aria-invalid'], 'true'); assert.equal(f.catchupUnit.hidden, true);
    for (const output of f.outputs) assert.equal(output.textContent, 'Unavailable'); assert.equal(f.scenarioText.textContent, 'Unavailable'); assert.equal(f.deltaNote.textContent, '');
    f.inputs[i].value = DEFAULTS[FIELDS[i]]; f.handlers.input(); assert.equal(f.root.dataset.valid, 'true'); assert.equal(f.chartWrap.hidden, false); assert.equal(f.error.hidden, true); assert.equal(f.inputs[i].attrs['aria-invalid'], 'false');
  }
});
test('multiple calculators stay isolated and unsupported or incomplete markup stays disabled', () => {
  const a = fixture('fr'), b = fixture('en'); bindAsmlProductivityCalculators({ querySelectorAll: () => [a.root, b.root] }); a.preset.handler(); assert.equal(a.inputs[4].value, '100'); assert.equal(b.inputs[4].value, '90');
  for (const f of [fixture('de'), fixture(), fixture()]) { if (f.root.dataset.asmlProductivityLang === 'en') { if (f.outputs.length === 4) f.outputs.pop(); } bindAsmlProductivityCalculators(f.scope); assert.equal(f.fieldset.disabled, true); assert.deepEqual(f.handlers, {}); }
  const bad = fixture(); bad.charts[0].lists['[data-asml-grid]'].pop(); bindAsmlProductivityCalculators(bad.scope); assert.equal(bad.fieldset.disabled, true);
});
test('component retains SSR, keyboard, source, responsive graph and passive security contracts', () => {
  const component = fs.readFileSync(new URL('../src/components/AsmlProductivityCalculator.astro', import.meta.url), 'utf8'), ui = fs.readFileSync(new URL('../src/lib/asmlProductivityUi.mjs', import.meta.url), 'utf8'), model = fs.readFileSync(new URL('../src/lib/asmlProductivityModel.mjs', import.meta.url), 'utf8');
  for (const pattern of [/<fieldset disabled>/, /asmlProductivityDisplay\(initial/, /asmlProductivityPlot\(initial/, /<noscript>/, /id = `asml-productivity-\$\{lang\}`/, /aria-describedby=/, /role="status"/, /type="button" data-asml-full-use/, /var\(--color-signal\)/, /data-asml-plot=\{mode\}/, /viewBox=/, /width:100%;height:auto;/]) assert.match(component, pattern);
  assert.match(component, /https:\/\/www\.sec\.gov\/Archives\/edgar\/data\/937966\/000119312521287742\/d133133dex997\.htm/);
  assert.doesNotMatch(component, /<script\s+is:inline|onclick=|oninput=|#[\da-f]{3,8}\b|foreignObject/iu);
  assert.doesNotMatch(ui, /innerHTML|outerHTML|insertAdjacentHTML|fetch\(|XMLHttpRequest|WebSocket|sendBeacon|localStorage|sessionStorage|document\.cookie|eval\(|new Function/);
  assert.doesNotMatch(model, /parseFloat|fetch\(/);
});
