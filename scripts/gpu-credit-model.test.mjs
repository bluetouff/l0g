import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const assetDirectory = new URL('../public/data/gpu-credit/', import.meta.url);
const model = JSON.parse(readFileSync(new URL('model.json', assetDirectory), 'utf8'));
const p = model.parameters;
const tolerance = 1e-10;
const near = (actual, expected, message) => {
  assert(Number.isFinite(actual), `${message}: non-finite value`);
  assert(Math.abs(actual - expected) <= tolerance * Math.max(1, Math.abs(expected)),
    `${message}: ${actual} != ${expected}`);
};

// Parse quoted fields without treating an absent financial input as numeric zero.
function readCsv(name) {
  const input = readFileSync(new URL(name, assetDirectory), 'utf8');
  const rows = [];
  let row = [], cell = '', quoted = false;
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (c === '"') {
      if (quoted && input[i + 1] === '"') { cell += '"'; i++; }
      else quoted = !quoted;
    } else if (!quoted && c === ',') { row.push(cell); cell = ''; }
    else if (!quoted && (c === '\n' || c === '\r')) {
      if (c === '\r' && input[i + 1] === '\n') i++;
      row.push(cell); rows.push(row); row = []; cell = '';
    } else cell += c;
  }
  assert(!quoted, `${name}: unterminated quoted field`);
  if (row.length || cell) { row.push(cell); rows.push(row); }
  const [headers, ...values] = rows;
  assert.equal(new Set(headers).size, headers.length, `${name}: duplicate columns`);
  return values.map((value, i) => {
    assert.equal(value.length, headers.length, `${name}: row ${i + 1} width`);
    return Object.fromEntries(headers.map((key, j) => [key, value[j]]));
  });
}
function numericCsv(name) {
  return readCsv(name).map((row, i) => Object.fromEntries(Object.entries(row).map(([key, value]) => {
    assert(value.trim() !== '', `${name}: missing ${key} on row ${i + 1}`);
    assert(Number.isFinite(Number(value)), `${name}: invalid ${key} on row ${i + 1}`);
    return [key, Number(value)];
  })));
}
function compareRows(name, expected) {
  const rows = numericCsv(`${name}.csv`);
  assert.equal(rows.length, expected.length, `${name}: row count`);
  for (const [i, row] of rows.entries()) {
    assert.deepEqual(Object.keys(row), Object.keys(expected[i]), `${name}: columns`);
    for (const key of Object.keys(row)) near(row[key], expected[i][key], `${name}[${i}].${key}`);
  }
}

// Price the balance as a sum of discounted annual, end-of-year payments.
const pvFactor = (rate, years) => Array.from({ length: years }, (_, i) => (1 + rate) ** -(i + 1))
  .reduce((sum, factor) => sum + factor, 0);
const annualPayment = (principal, rate, years) => principal / pvFactor(rate, years);
const payment = annualPayment(p.initial_debt, p.annual_interest_rate, p.debt_years);
const baseCash = p.baseline_annual_revenue - p.annual_cash_operating_cost;
const stressRevenue = p.baseline_annual_revenue * p.renewal_price_retention * p.renewal_billed_hours_retention;
const stressCash = stressRevenue - p.annual_cash_operating_cost;

test('published model identifies fictional scenarios, nominal USD and annual effective end-of-year timing', () => {
  assert.equal(model.metadata.kind, 'hypothetical educational scenarios');
  assert.equal(model.metadata.currency, 'USD');
  assert.equal(model.metadata.monetaryUnit, 'millions of nominal US dollars');
  assert.equal(model.metadata.period, 'illustrative years 1 to 5, annual end-of-year payments');
  assert.equal(model.metadata.annualInterestRateConvention, 'annual effective');
  assert.equal(model.metadata.marketPrices, false);
  assert.equal(model.metadata.issuerRepaymentSchedules, false);
  for (const item of ['taxes', 'working capital', 'additional capital expenditure', 'financing fees', 'accrued interest', 'other creditors']) {
    assert(model.metadata.exclusions.includes(item), `${item} must remain an explicit exclusion`);
  }
});

test('GPU loan: independent annuity, principal conservation and terminal repayment', () => {
  near(p.equipment_cost, p.initial_debt + p.equity, 'initial funding identity');
  near(model.summary.payment, payment, 'annuity');
  near(annualPayment(70, 0, 5), 14, 'zero-interest boundary');
  assert.equal(model.schedule.length, p.debt_years);
  let balance = p.initial_debt, principalPaid = 0, interestPaid = 0, totalPaid = 0;
  for (const [i, row] of model.schedule.entries()) {
    const interest = balance * p.annual_interest_rate;
    const principal = payment - interest;
    const next = balance - principal;
    near(row.year, i + 1, 'year');
    near(row.debt_start, balance, 'opening principal');
    near(row.interest, interest, 'annual interest');
    near(row.principal, principal, 'principal payment');
    near(row.payment, payment, 'scheduled annual payment');
    near(row.debt_end, next, 'closing principal');
    assert(row.debt_end >= 0, 'reported outstanding principal must be nonnegative');
    assert(row.debt_end <= row.debt_start, 'amortising balance must not grow');
    assert(row.principal >= 0 && row.interest >= 0);
    principalPaid += row.principal; interestPaid += row.interest; totalPaid += row.payment;
    balance = next;
  }
  near(principalPaid, p.initial_debt, 'total principal repaid');
  near(totalPaid, principalPaid + interestPaid, 'total scheduled debt service');
  near(totalPaid, p.debt_years * payment, 'five equal payments');
  near(model.schedule.at(-1).debt_end, 0, 'no balloon principal');
  const remaining = payment * pvFactor(p.annual_interest_rate, 2);
  near(model.summary.debt_after_year3, remaining, 'two remaining payments discounted to year three');
  compareRows('schedule', model.schedule);
});

test('GPU operating cash: compound price/volume, no double deduction of interest, annual cash identity', () => {
  near(stressRevenue, 30, '75% price times 80% billed hours');
  near(stressRevenue / p.baseline_annual_revenue, .60, '40% revenue decline');
  near(model.summary.baseline_cfads, baseCash, 'base cash before debt');
  near(model.summary.stress_cfads, stressCash, 'stressed cash before debt');
  near(model.summary.base_dscr, baseCash / payment, 'base DSCR');
  near(model.summary.stress_dscr, stressCash / payment, 'stress DSCR');
  near(model.summary.stress_cash_gap, payment - stressCash, 'scheduled annual shortfall');
  for (const row of model.schedule) {
    const revenue = row.year <= p.initial_contract_years ? p.baseline_annual_revenue : stressRevenue;
    near(row.revenue, revenue, 'revenue by commercial period');
    near(row.cash_cost, p.annual_cash_operating_cost, 'cash operating costs exclude interest');
    near(row.cfads, revenue - row.cash_cost, 'cash available for debt');
    near(row.dscr, row.cfads / row.payment, 'period coverage');
    near(row.cash_after_scheduled_debt_service, row.cfads - row.payment, 'cash conservation');
    assert.equal(row.cash_after_scheduled_debt_service < 0, row.year > p.initial_contract_years,
      'year-four/five schedule requires the shortfall to be funded');
  }
  const breakEvenRevenue = p.annual_cash_operating_cost + payment;
  near(model.summary.revenue_break_even, breakEvenRevenue, 'revenue break-even');
  near(model.summary.price_retention_break_even_at_80pct_hours, breakEvenRevenue / (p.baseline_annual_revenue * .8), 'price break-even at 80% hours');
  near((breakEvenRevenue - p.annual_cash_operating_cost) / payment, 1, 'DSCR-one boundary');
});

test('GPU heatmap: all 81 unique pairs, monotonicity and base/stress/zero-cash boundaries', () => {
  assert.equal(model.heatmap.length, 81);
  const pairs = new Map(model.heatmap.map(row => [`${row.price_index}:${row.billed_hours_index}`, row]));
  assert.equal(pairs.size, 81, 'no duplicate grid points');
  for (let hours = 60; hours <= 100; hours += 5) {
    let prior = -Infinity;
    for (let price = 60; price <= 100; price += 5) {
      const row = pairs.get(`${price}:${hours}`);
      assert(row, 'complete declared grid');
      const revenue = p.baseline_annual_revenue * price / 100 * hours / 100;
      near(row.revenue, revenue, 'cell revenue');
      near(row.cfads, revenue - p.annual_cash_operating_cost, 'cell operating cash');
      near(row.dscr, row.cfads / payment, 'cell DSCR');
      assert(row.dscr >= prior, 'price sensitivity is monotone at fixed billed hours');
      prior = row.dscr;
      if (hours > 60) assert(row.dscr >= pairs.get(`${price}:${hours - 5}`).dscr,
        'billed-hour sensitivity is monotone at fixed price');
    }
  }
  near(pairs.get('100:100').dscr, model.summary.base_dscr, 'base grid point');
  near(pairs.get('75:80').dscr, model.summary.stress_dscr, 'stress grid point');
  near(pairs.get('60:60').dscr, 0, 'cash-exhaustion grid point');
  compareRows('heatmap', model.heatmap);
});

test('GPU resizing: two-year discounting, prudential coverage and retained-cash counterpoint', () => {
  const afterThree = payment * pvFactor(p.annual_interest_rate, 2);
  const newPayment = stressCash / p.target_annual_coverage_for_resizing;
  const supported = newPayment * pvFactor(p.annual_interest_rate, 2);
  const paydown = Math.max(0, afterThree - supported);
  const retained = p.initial_contract_years * (baseCash - payment);
  near(model.summary.payment_after_resizing, newPayment, 'allowed annual debt service');
  near(model.summary.supported_debt_after_year3, supported, 'supported principal stock');
  near(model.summary.required_paydown, paydown, 'principal reduction');
  near(model.summary.debt_supported_at_dscr1, stressCash * pvFactor(p.annual_interest_rate, 2), 'DSCR-one alternative');
  near(stressCash / annualPayment(supported, p.annual_interest_rate, 2), p.target_annual_coverage_for_resizing, 'post-resizing coverage');
  near(afterThree, supported + paydown, 'principal conservation at resizing');
  near(model.summary.first_three_years_cash_if_retained, retained, 'retained early cash');
  assert(retained > paydown, 'external equity is not automatically required if early cash remains available');
  near(Math.max(0, afterThree - stressCash * pvFactor(p.annual_interest_rate, 2)), afterThree - model.summary.debt_supported_at_dscr1, 'DSCR-one paydown stays nonnegative');
});

test('GPU recovery: alternative sale has no future rentals, selling fees and creditor waterfall conserve proceeds', () => {
  assert.equal(model.recovery.length, 3);
  assert.deepEqual(model.recovery.map(row => row.gross), p.sale_gross_scenarios);
  for (const row of model.recovery) {
    const fees = row.gross * p.sale_cost_fraction;
    const net = Math.max(0, row.gross - fees - p.removal_and_transfer_cost);
    const recovered = Math.min(model.summary.debt_after_year3, net);
    const shortfall = Math.max(0, model.summary.debt_after_year3 - net);
    const equityResidual = Math.max(0, net - model.summary.debt_after_year3);
    near(row.sale_cost, fees, 'selling fees charged on gross proceeds');
    near(row.transfer_cost, p.removal_and_transfer_cost, 'fixed transfer/preparation cost');
    near(row.net, net, 'net sale proceeds');
    near(row.debt_due, model.summary.debt_after_year3, 'sale immediately after third payment, no accrued interest');
    near(row.lender_recovered, recovered, 'recovery capped at creditor claim');
    near(row.lender_shortfall, shortfall, 'creditor shortfall');
    near(row.residual_to_equity, equityResidual, 'sale residual after debt');
    near(row.lender_recovered + row.residual_to_equity, row.net, 'net proceeds allocated once');
    near(row.lender_recovered + row.lender_shortfall, row.debt_due, 'creditor claim reconciled');
    assert(!(row.lender_shortfall > 0 && row.residual_to_equity > 0), 'junior residual cannot precede debt repayment');
    assert(!('future_rentals' in row) && !('continuation_value' in row), 'sale is an alternative to continued operation');
  }
  const net = gross => Math.max(0, gross * (1 - p.sale_cost_fraction) - p.removal_and_transfer_cost);
  near(net(0), 0, 'zero-sale boundary');
  near(net(p.removal_and_transfer_cost / (1 - p.sale_cost_fraction)), 0, 'sale costs consume gross proceeds');
  near(net((model.summary.debt_after_year3 + p.removal_and_transfer_cost) / (1 - p.sale_cost_fraction)), model.summary.debt_after_year3, 'full debt-recovery boundary');
  compareRows('recovery', model.recovery);
});

test('GPU useful life and financing rates remain separate from operating and resale assumptions', () => {
  assert.deepEqual(model.depreciation.map(row => row.life), [4, 6, 10]);
  for (const row of model.depreciation) {
    near(row.annual_depreciation, p.equipment_cost / row.life, 'straight-line annual depreciation');
    near(row.book_after_year3, p.equipment_cost * (1 - 3 / row.life), 'carrying value after three years');
    near(row.debt_after_year3, model.summary.debt_after_year3, 'accounting life leaves debt unchanged');
  }
  assert.equal(model.rate_sensitivity.length, 5);
  let prior = 0;
  for (const row of model.rate_sensitivity) {
    const pay = annualPayment(p.initial_debt, row.annual_rate, p.debt_years);
    near(row.payment, pay, 'rate sensitivity at origination');
    near(row.base_dscr, baseCash / pay, 'base rate-sensitive coverage');
    near(row.stress_dscr, stressCash / pay, 'stressed rate-sensitive coverage');
    assert(row.payment > prior, 'higher assumed rates raise payment');
    assert(row.stress_dscr < 1, 'none of these rates covers the stressed cash with the original loan size');
    prior = row.payment;
  }
  compareRows('depreciation', model.depreciation);
  compareRows('rate_sensitivity', model.rate_sensitivity);
});

test('documented transactions are separated from hypothetical model cash flows and preserve unavailable inputs', () => {
  const rows = readCsv('documented-transactions.csv');
  assert.equal(rows.length, 3);
  assert.equal(new Set(rows.map(row => row.transaction)).size, 3);
  for (const row of rows) {
    assert(/^\d{4}-\d{2}-\d{2}$/.test(row.announced));
    assert(/^\d{4}-\d{2}-\d{2}$/.test(row.maturity));
    assert(row.source_ids && row.limit, 'provenance and perimeter limitations must be retained');
    assert(!('dscr' in row) && !('debt_start' in row) && !('sale_gross_scenarios' in row));
    assert(row.pricing_type.includes('fixed') ? row.floating_margin_percentage_points === '' : row.fixed_interest_pct === '',
      'a missing rate component cannot be silently replaced by zero');
  }
  const lambda = rows.find(row => row.transaction === 'Lambda Compute I');
  assert(lambda.pricing_type.includes('semiannual'), 'documented coupon convention differs from hypothetical annual payments');
});
