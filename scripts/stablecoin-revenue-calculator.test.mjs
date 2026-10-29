import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { STABLECOIN_REVENUE_DEFAULTS, STABLECOIN_REVENUE_FIELDS, calculateStablecoinRevenue, parseStablecoinDecimal, formatStablecoinMoney, formatStablecoinThreshold } from '../src/lib/stablecoinRevenueCalculator.mjs';
import { STABLECOIN_REVENUE_OUTPUTS, stablecoinRevenueCopy, bindStablecoinRevenueCalculators } from '../src/lib/stablecoinRevenueCalculatorUi.mjs';
const defaults = () => ({ ...STABLECOIN_REVENUE_DEFAULTS });
const dollars = amount => BigInt(amount) * 10000000000n;

test('fictional annual default allocates reserve income without distributing the principal', () => {
  const r = calculateStablecoinRevenue(defaults());
  assert.equal(r.principal, dollars(1000000)); assert.equal(r.reserveIncome, dollars(40000));
  assert.equal(r.issuerBeforeCosts, dollars(20000)); assert.equal(r.platformBeforeRewards, dollars(20000));
  assert.equal(r.rewards, dollars(15000)); assert.equal(r.platformAfterRewards, dollars(5000));
  assert.equal(r.additionalFunding, 0n); assert.equal(r.thresholdMicroPercent, 2000000n);
  assert(Object.isFrozen(r)); assert(Object.isFrozen(STABLECOIN_REVENUE_DEFAULTS));
});
test('rewards above allocated income create an explicit funding need rather than use backing', () => {
  const r = calculateStablecoinRevenue({ ...defaults(), rewardRate: '3' });
  assert.equal(r.rewards, dollars(30000)); assert.equal(r.platformAfterRewards, -dollars(10000));
  assert.equal(r.additionalFunding, dollars(10000)); assert.equal(r.principal, dollars(1000000));
  const zero = calculateStablecoinRevenue({ ...defaults(), reserveRate: '0', rewardRate: '20' });
  assert.equal(zero.reserveIncome, 0n); assert.equal(zero.additionalFunding, dollars(200000));
  assert.equal(zero.principal, dollars(1000000));
});
test('largest accepted inputs remain exact, preserve principal and meet the budget boundary', () => {
  const r = calculateStablecoinRevenue({ principal: '1000000000.00', reserveRate: '20.00', platformShare: '100.00', rewardRate: '20.00' });
  assert.equal(r.principal, dollars(1000000000)); assert.equal(r.reserveIncome, dollars(200000000));
  assert.equal(r.issuerBeforeCosts, 0n); assert.equal(r.platformAfterRewards, 0n); assert.equal(r.additionalFunding, 0n);
  assert.equal(formatStablecoinThreshold(r.thresholdMicroPercent, 'en'), '20\u00a0%');
});
test('zero principal keeps every money flow zero and labels the inapplicable rate', () => {
  const r = calculateStablecoinRevenue({ principal: '0', reserveRate: '20', platformShare: '100', rewardRate: '20' });
  for (const key of ['principal', ...STABLECOIN_REVENUE_OUTPUTS.filter(key => key !== 'thresholdMicroPercent')]) assert.equal(r[key], 0n);
  assert.equal(r.thresholdMicroPercent, null);
  assert.equal(formatStablecoinThreshold(null, 'fr'), 'Indisponible : principal nul');
});
test('fractional cent amounts and comma decimals survive until independent display rounding', () => {
  const r = calculateStablecoinRevenue({ principal: '0,01', reserveRate: '20,00', platformShare: '33,33', rewardRate: '0,01' });
  assert.equal(r.reserveIncome, 20000000n); assert.equal(r.platformBeforeRewards, 6666000n);
  assert.equal(r.rewards, 10000n); assert.equal(r.platformAfterRewards, 6656000n);
  assert.equal(formatStablecoinThreshold(r.thresholdMicroPercent, 'fr'), '6,666\u00a0%');
  assert.equal(formatStablecoinMoney(r.platformAfterRewards, 'en'), '$0.00');
});
test('parser rejects controls, exponent notation, excessive precision, injection and out-of-range data', () => {
  for (const value of ['', ' 1', '1 ', '1\n', '1\r', '1\u2028', '\t1', '1 000', '1,000', '-1', '+1', '.5', '1.', '1.234', '1e3', 'Infinity', 'NaN', '<script>', '1'.repeat(10000), null, undefined, 1, 1n, {}]) assert.throws(() => parseStablecoinDecimal(value, 'principal'));
  for (const [field, value] of [['principal', '1000000000.01'], ['reserveRate', '20.01'], ['platformShare', '100.01'], ['rewardRate', '20.01'], ['__proto__', '1']]) assert.throws(() => parseStablecoinDecimal(value, field));
  assert.equal(parseStablecoinDecimal('0001.50', 'principal'), 150n);
});
test('model rejects absent, inherited, unknown and mistyped fields', () => {
  for (const value of [null, [], {}, { ...defaults(), extra: '1' }, Object.create(defaults()), { ...defaults(), principal: 10 }, { ...defaults(), reserveRate: null }]) assert.throws(() => calculateStablecoinRevenue(value));
  const missing = defaults(); delete missing.rewardRate; assert.throws(() => calculateStablecoinRevenue(missing));
});
test('250 bounded fractional scenarios conserve income and keep funding separate from principal', () => {
  let seed = 987654321;
  const next = max => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed % max; };
  const decimal = value => `${Math.floor(value / 100)}.${String(value % 100).padStart(2, '0')}`;
  for (let i = 0; i < 250; i++) {
    const cents = next(1000000) + 1, rate = next(2001), share = next(10001), reward = next(2001);
    const r = calculateStablecoinRevenue({ principal: decimal(cents), reserveRate: decimal(rate), platformShare: decimal(share), rewardRate: decimal(reward) });
    // These bounded integer Number products remain below 2^53, independently of the BigInt model.
    assert.equal(r.reserveIncome, BigInt(cents * rate * 10000));
    assert.equal(r.platformBeforeRewards, BigInt(cents * rate * share));
    assert.equal(r.rewards, BigInt(cents * reward * 10000));
    assert.equal(r.issuerBeforeCosts + r.platformAfterRewards + r.rewards, r.reserveIncome);
    assert.equal(r.principal, BigInt(cents) * 100000000n);
    assert.equal(r.additionalFunding, r.platformAfterRewards < 0n ? -r.platformAfterRewards : 0n);
  }
});
test('money format rounds exact half-cents away from zero, without a negative zero', () => {
  assert.equal(formatStablecoinMoney(50000000n, 'en'), '$0.01');
  assert.equal(formatStablecoinMoney(-50000000n, 'fr'), '−0,01\u00a0$');
  assert.equal(formatStablecoinMoney(-49999999n, 'en'), '$0.00');
  assert.equal(formatStablecoinMoney(dollars(1000000), 'fr'), '1\u202f000\u202f000,00\u00a0$');
  for (const fn of [() => formatStablecoinMoney(1, 'fr'), () => formatStablecoinMoney(1n, 'de'), () => formatStablecoinThreshold(null, 'de'), () => formatStablecoinThreshold(-1n, 'fr'), () => stablecoinRevenueCopy('__proto__')]) assert.throws(fn);
});
function fixture(lang = 'fr') {
  const node = () => ({ textContent: '', hidden: false, attributes: {}, setAttribute(k, v) { this.attributes[k] = v; } });
  const fields = Object.fromEntries(STABLECOIN_REVENUE_FIELDS.map(key => [key, { ...node(), value: defaults()[key] }]));
  const outputs = Object.fromEntries(STABLECOIN_REVENUE_OUTPUTS.map(key => [key, node()]));
  const fieldset = { disabled: true }, error = node(), status = node(), principal = node(), events = {};
  const form = { elements: { namedItem: key => fields[key] }, addEventListener(name, fn) { (events[name] ??= []).push(fn); } };
  const root = { dataset: { lang }, querySelector(selector) { return selector === 'form' ? form : selector === 'fieldset' ? fieldset : selector === '[data-error]' ? error : selector === '[data-status]' ? status : selector === '[data-principal]' ? principal : outputs[/^\[data-output="([a-zA-Z]+)"\]$/.exec(selector)?.[1]]; } };
  return { fields, outputs, fieldset, error, principal, events, root, scope: { querySelectorAll: () => [root] } };
}
test('client binding is idempotent and clears invalid results before recovery and reset', () => {
  const f = fixture(); bindStablecoinRevenueCalculators(f.scope); bindStablecoinRevenueCalculators(f.scope);
  assert.equal(f.fieldset.disabled, false); assert.equal(f.events.input.length, 1);
  assert.equal(f.outputs.platformAfterRewards.textContent, '5\u202f000,00\u00a0$');
  f.fields.rewardRate.value = '3'; f.events.input[0](); assert.equal(f.outputs.additionalFunding.textContent, '10\u202f000,00\u00a0$');
  f.fields.principal.value = '<script>'; f.events.input[0](); assert.equal(f.error.hidden, false);
  assert(Object.values(f.outputs).every(output => output.textContent === 'Indisponible'));
  assert.equal(f.principal.textContent, 'Indisponible');
  f.fields.principal.value = '1000000'; f.events.input[0](); assert.equal(f.error.hidden, true);
  f.events.reset[0]({ preventDefault() {} }); assert.equal(f.fields.rewardRate.value, '1.5');
  assert.equal(f.outputs.platformAfterRewards.textContent, '5\u202f000,00\u00a0$');
});
test('English output and incomplete markup preserve native copy and progressive defaults', () => {
  const f = fixture('en'); bindStablecoinRevenueCalculators(f.scope);
  assert.equal(f.outputs.reserveIncome.textContent, '$40,000.00');
  const incomplete = fixture(); incomplete.root.querySelector = () => null;
  bindStablecoinRevenueCalculators(incomplete.scope); assert.equal(incomplete.fieldset.disabled, true);
  const component = readFileSync(new URL('../src/components/StablecoinRevenueCalculator.astro', import.meta.url), 'utf8');
  const ui = readFileSync(new URL('../src/lib/stablecoinRevenueCalculatorUi.mjs', import.meta.url), 'utf8');
  assert.match(component, /<details class="revenue-controls"><summary>/);
  assert.match(component, /<fieldset disabled>/); assert.match(component, /<noscript>/);
  assert.match(component, /aria-live="polite"/); assert.match(component, /padding-bottom|margin:2\.75rem/);
  assert.doesNotMatch(component + ui, /innerHTML|outerHTML|insertAdjacentHTML|fetch\(|XMLHttpRequest|localStorage|sessionStorage|is:inline|set:html|—/);
});
