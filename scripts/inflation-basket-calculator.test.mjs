import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { INFLATION_BASKET_CATEGORIES, INFLATION_BASKET_DEFAULTS, INFLATION_BASKET_PRESETS, INFLATION_BASKET_PERIOD, INFLATION_BASKET_SOURCE, calculateInflationBasket, parseInflationBasketAmount, formatInflationBasketMoney, formatInflationBasketPercent } from '../src/lib/inflationBasketCalculator.mjs';

test('the data snapshot contains the five independently verified definitive pairs in one window', () => {
  assert.deepEqual(INFLATION_BASKET_CATEGORIES.map(({ key, start, end, series }) => [key, start, end, series]), [['food',10039n,10183n,'011813717'],['tobacco',10008n,10329n,'011814110'],['manufactured',9988n,9983n,'011813780'],['energy',9833n,12013n,'011813864'],['services',10009n,10235n,'011813906']]);
  assert.deepEqual(INFLATION_BASKET_PERIOD, { start: '2025-12', end: '2026-09', observedOn: '2026-10-30', status: 'definitive' });
  assert.equal(INFLATION_BASKET_SOURCE, 'https://www.insee.fr/fr/statistiques/series/129209311');
});

test('three constructed baskets reproduce the independent cent-rounded totals', () => {
  for (const [key, expected, change] of [['reference',206244n,312n],['energy',211310n,566n],['food',206285n,314n]]) {
    const result = calculateInflationBasket(INFLATION_BASKET_PRESETS[key]);
    assert.equal(result.initial, 200000n); assert.equal(result.comparative, expected); assert.equal(result.difference, expected - 200000n); assert.equal(result.change, change);
  }
  assert.deepEqual(calculateInflationBasket(INFLATION_BASKET_DEFAULTS).rows.map(row => row.comparative), [30126n,3468n,47736n,18668n,106246n]);
});

test('decimal commas and exact cents are accepted without silent coercion', () => {
  assert.equal(parseInflationBasketAmount('0001,05'), 105n); assert.equal(parseInflationBasketAmount('0.01'), 1n); assert.equal(parseInflationBasketAmount('1000000.00'), 100000000n);
  for (const value of ['', ' ', ' 1', '1 ', '+1', '-1', '1e2', 'NaN', 'Infinity', '1.234', '1.', '.5', '1,2.3', '1 000', '1000000.01', '99999999', 1, null, {}, '1'.repeat(100000)]) assert.throws(() => parseInflationBasketAmount(value), RangeError);
});

test('exactly the five category fields are required', () => {
  for (const value of [null, [], {}, { ...INFLATION_BASKET_DEFAULTS, additional: '0' }, { ...INFLATION_BASKET_DEFAULTS, food: undefined }, Object.create(INFLATION_BASKET_DEFAULTS)]) assert.throws(() => calculateInflationBasket(value), RangeError);
  const incomplete = { ...INFLATION_BASKET_DEFAULTS }; delete incomplete.services; assert.throws(() => calculateInflationBasket(incomplete), RangeError);
});

test('a zero basket preserves zero money and makes percentage quantities unavailable', () => {
  const zero = Object.fromEntries(INFLATION_BASKET_CATEGORIES.map(row => [row.key, '0'])), result = calculateInflationBasket(zero);
  assert.equal(result.empty, true); assert.equal(result.initial, 0n); assert.equal(result.comparative, 0n); assert.equal(result.difference, 0n); assert.equal(result.change, null);
  assert(result.rows.every(row => row.share === null && row.contribution === null)); assert.equal(formatInflationBasketPercent(result.change, 'fr'), 'Indisponible');
});

test('negative category price variation remains a negative result', () => {
  const input = Object.fromEntries(INFLATION_BASKET_CATEGORIES.map(row => [row.key, row.key === 'manufactured' ? '100.00' : '0'])), result = calculateInflationBasket(input);
  assert.equal(result.comparative, 9995n); assert.equal(result.difference, -5n); assert.equal(result.change, -5n); assert.equal(result.rows[2].contribution, -5n);
});

test('category costs use half-up rounding before summation, including exact ties', () => {
  const input = { food:'0', tobacco:'50.04', manufactured:'49.94', energy:'0', services:'0' }, result = calculateInflationBasket(input);
  assert.equal(result.rows[1].comparative, 5165n); assert.equal(result.rows[2].comparative, 4992n); assert.equal(result.comparative, 10157n);
});

test('maximal values conserve all category totals and remain precisely formatted', () => {
  const input = Object.fromEntries(INFLATION_BASKET_CATEGORIES.map(row => [row.key, '1000000.00'])), result = calculateInflationBasket(input);
  assert.equal(result.initial, 500000000n); assert.equal(result.rows.reduce((sum, row) => sum + row.comparative, 0n), result.comparative); assert.equal(result.comparative-result.initial,result.difference);
  assert.equal(formatInflationBasketMoney(result.initial,'fr'),'5\u202f000\u202f000,00 €'); assert.equal(formatInflationBasketMoney(-5n,'en'),'−€0.05'); assert.equal(formatInflationBasketPercent(-5n,'fr',true),'−0,05 point(s)');
  assert.throws(() => formatInflationBasketMoney(5n,'xx'),RangeError);
});

test('one thousand deterministic baskets match a separate quotient-and-remainder oracle', () => {
  let seed = 8749321;
  const pairs = [[10039,10183],[10008,10329],[9988,9983],[9833,12013],[10009,10235]];
  for (let i=0;i<1000;i++) {
    const cents = pairs.map(() => { seed=(seed*48271)%2147483647;return seed%100000001; });
    const input = Object.fromEntries(INFLATION_BASKET_CATEGORIES.map((row,j)=>[row.key,`${Math.floor(cents[j]/100)}.${String(cents[j]%100).padStart(2,'0')}`]));
    const expected = cents.map((amount,j)=>{const [start,end]=pairs[j], numerator=amount*end,quotient=Math.floor(numerator/start),remainder=numerator-quotient*start;return quotient+(remainder*2>=start?1:0);});
    const result=calculateInflationBasket(input); assert.deepEqual(result.rows.map(row=>row.comparative),expected.map(BigInt)); assert.equal(result.comparative,BigInt(expected.reduce((a,b)=>a+b,0))); assert.equal(result.rows.reduce((a,row)=>a+row.difference,0n),result.difference);
  }
});

test('the UI remains local and progressively enhanced, with safe output insertion', () => {
  const ui=readFileSync(new URL('../src/lib/inflationBasketCalculatorUi.mjs',import.meta.url),'utf8'), component=readFileSync(new URL('../src/components/InflationBasketCalculator.astro',import.meta.url),'utf8');
  assert(!/innerHTML|insertAdjacentHTML|localStorage|sessionStorage|\bfetch\s*\(/u.test(ui)); assert.match(ui,/textContent/u); assert.match(ui,/copy\.unavailable/u); assert.match(component,/<fieldset disabled>/u); assert.match(component,/<noscript>/u); assert.match(component,/inflation-basket-method/u); assert.match(component,/data-basket-category/u); assert(!/<table/u.test(component));
});
