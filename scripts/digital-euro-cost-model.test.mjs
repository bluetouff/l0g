import assert from 'node:assert/strict';
import test from 'node:test';
import {
  DIGITAL_EURO_CARD_BASE,
  DIGITAL_EURO_COST_DEFAULTS,
  calculateDigitalEuroCost,
  normalizeDigitalEuroCostInputs,
} from '../src/lib/digital-euro-cost-model.ts';

const closeTo = (actual, expected, tolerance = 1e-9) => {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
};

test('ECB 2025 card base preserves the published half-year totals', () => {
  assert.equal(DIGITAL_EURO_CARD_BASE.transactions, 43_896_937_086 + 47_811_717_641);
  closeTo(
    DIGITAL_EURO_CARD_BASE.value,
    1_684_607_800_905.8298 + 1_846_110_585_229.0206,
    0.001,
  );
});

test('default ad valorem scenario reproduces the article sensitivity figures', () => {
  const result = calculateDigitalEuroCost();
  closeTo(result.volume, 353_071_838_613.48505, 0.001);
  closeTo(result.transactions, 9_170_865_472.7, 0.001);
  closeTo(result.currentCost, 1_765_359_193.0674253, 0.001);
  closeTo(result.digitalCost, 953_293_964.2564096, 0.001);
  closeTo(result.savings, 812_065_228.8110157, 0.001);
  closeTo(result.distributorRevenue, 571_976_378.5538459, 0.001);
  closeTo(result.acquirerRemainder, 381_317_585.70256364, 0.001);
  closeTo(result.opexPerTransaction, 3.489310806625414, 1e-12);
  closeTo(result.fullPerTransaction, 4.9068433218169885, 1e-12);
  assert.equal(result.negativeAcquirer, false);
});

test('fixed inter-PSP mode follows transaction count and reveals an insolvent allocation', () => {
  const result = calculateDigitalEuroCost({ interPspMode: 'fixed', interPsp: 0.18 });
  closeTo(result.distributorRevenue, 1_485_680_206.5774, 0.001);
  closeTo(result.distributorEffectiveRate, 0.46754105101345, 1e-12);
  assert.ok(result.acquirerRemainder < 0);
  assert.equal(result.negativeAcquirer, true);
});

test('individual merchant protection is explicit and optional', () => {
  const protectedResult = calculateDigitalEuroCost({ cardFee: 0.25, digitalFee: 0.3 });
  const unprotectedResult = calculateDigitalEuroCost({ cardFee: 0.25, digitalFee: 0.3, noWorseOff: false });
  assert.equal(protectedResult.applicableMsc, 0.25);
  assert.equal(protectedResult.capApplied, true);
  assert.equal(unprotectedResult.applicableMsc, 0.3);
  assert.equal(unprotectedResult.capApplied, false);
  assert.ok(unprotectedResult.digitalCost > protectedResult.digitalCost);
});

test('public cost denominator includes all migrated merchant transactions, including offline', () => {
  const online = calculateDigitalEuroCost({ offline: 0 });
  const halfOffline = calculateDigitalEuroCost({ offline: 50 });
  assert.equal(online.transactions, halfOffline.transactions);
  assert.equal(online.fullPerTransaction, halfOffline.fullPerTransaction);
  assert.ok(halfOffline.digitalCost < online.digitalCost);
});

test('untrusted query-like values are clamped and invalid values fall back', () => {
  const normalized = normalizeDigitalEuroCostInputs({
    adoption: 999,
    cardFee: -4,
    digitalFee: Number.NaN,
    interPspMode: 'fixed',
    offline: 101,
    development: Number.POSITIVE_INFINITY,
    noWorseOff: false,
  });
  assert.equal(normalized.adoption, 50);
  assert.equal(normalized.cardFee, 0.1);
  assert.equal(normalized.digitalFee, DIGITAL_EURO_COST_DEFAULTS.digitalFee);
  assert.equal(normalized.interPspMode, 'fixed');
  assert.equal(normalized.offline, 50);
  assert.equal(normalized.development, DIGITAL_EURO_COST_DEFAULTS.development);
  assert.equal(normalized.noWorseOff, false);
});
