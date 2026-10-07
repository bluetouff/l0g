import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const data = new URL('../public/data/ge-healthcare/', import.meta.url);
const near = (actual, expected, label) => {
  assert(Number.isFinite(actual), `${label}: missing or non-finite input`);
  assert(Math.abs(actual - expected) <= 1e-12 * Math.max(1, Math.abs(expected)),
    `${label}: ${actual} != ${expected}`);
};

// These two controlled datasets contain decimal numbers only. Reject missing
// fields instead of converting them to zero; do not accept arbitrary CSV text.
function numericCsv(text, expectedHeaders) {
  const lines = text.trimEnd().split(/\r?\n/);
  assert.deepEqual(lines.shift()?.split(','), expectedHeaders);
  return lines.map((line, index) => {
    const cells = line.split(',');
    assert.equal(cells.length, expectedHeaders.length, `row ${index + 1}: columns`);
    return Object.fromEntries(cells.map((cell, i) => {
      assert(/^\d+(?:\.\d+)?$/.test(cell), `row ${index + 1}: invalid ${expectedHeaders[i]}`);
      const value = Number(cell);
      assert(Number.isFinite(value), `row ${index + 1}: non-finite value`);
      return [expectedHeaders[i], value];
    }));
  });
}
const decayHeaders = ['minutes', 'fraction_remaining', 'start_multiplier_for_same_end_activity'];
const valuationHeaders = ['hypothetical_sofie_revenue_usd_m', 'purchase_price_usd_m', 'price_to_revenue_x'];
const decay = numericCsv(readFileSync(new URL('f18_decay.csv', data), 'utf8'), decayHeaders);
const valuation = numericCsv(readFileSync(new URL('valuation_sensitivity.csv', data), 'utf8'), valuationHeaders);
const reimbursement = JSON.parse(readFileSync(new URL('reimbursement_2026.json', data), 'utf8'));

test('F-18: all eight rows reproduce the independent exponential decay equation', () => {
  assert.deepEqual(decay.map(row => row.minutes), [0, 30, 60, 90, 110, 120, 180, 220]);
  for (const row of decay) {
    // FDA PIXCLARA label, section 11.2: physical half-life 109.8 minutes.
    const expected = Math.exp(-Math.LN2 * row.minutes / 109.8);
    near(row.fraction_remaining, expected, `${row.minutes} minutes: activity`);
    near(row.start_multiplier_for_same_end_activity, Math.exp(Math.LN2 * row.minutes / 109.8),
      `${row.minutes} minutes: initial activity multiplier`);
    assert(row.fraction_remaining > 0 && row.fraction_remaining <= 1);
  }
});

test('F-18: activity conservation, zero-delay boundary and monotone logistics cost', () => {
  near(decay[0].fraction_remaining, 1, 'zero delay has no decay');
  near(decay[0].start_multiplier_for_same_end_activity, 1, 'zero delay requires no compensation');
  for (const [i, row] of decay.entries()) {
    near(row.fraction_remaining * row.start_multiplier_for_same_end_activity, 1, 'reciprocal identity');
    near(100 * row.start_multiplier_for_same_end_activity * row.fraction_remaining, 100,
      'same end activity before non-decay losses');
    if (i) {
      assert(row.fraction_remaining < decay[i - 1].fraction_remaining);
      assert(row.start_multiplier_for_same_end_activity > decay[i - 1].start_multiplier_for_same_end_activity);
    }
  }
  assert.equal(Math.round(100 * decay.find(row => row.minutes === 60).start_multiplier_for_same_end_activity), 146);
  assert.equal(Math.round(100 * decay.find(row => row.minutes === 120).start_multiplier_for_same_end_activity), 213);
});

test('hypothetical denominators: six exact ratios, no stale SOFIE revenue substituted', () => {
  assert.deepEqual(valuation.map(row => row.hypothetical_sofie_revenue_usd_m), [100, 150, 200, 250, 300, 400]);
  for (const [i, row] of valuation.entries()) {
    assert.equal(row.purchase_price_usd_m, 945);
    near(row.price_to_revenue_x * row.hypothetical_sofie_revenue_usd_m, 945, 'price/revenue identity');
    if (i) assert(row.price_to_revenue_x < valuation[i - 1].price_to_revenue_x);
  }
  near(valuation[2].price_to_revenue_x, 4.725, 'exact unrounded ratio retained in CSV');
  // A decimal half-up display is 4.73, although the exact ratio stays 4.725.
  const numerator = 94500n, denominator = 200n;
  assert.equal((numerator + denominator / 2n) / denominator, 473n);
});

test('CMS: the effective 2026 code-level cost threshold retains strict boundary and scope', () => {
  assert.equal(reimbursement.year, 2026);
  assert.equal(reimbursement.diagnostic_radiopharmaceutical_packaging_threshold_usd_per_day, 655);
  assert.equal(reimbursement.system, 'Medicare hospital outpatient OPPS');
  assert.equal(reimbursement.product_scope, 'diagnostic radiopharmaceuticals without pass-through status');
  assert.match(reimbursement.threshold_metric, /HCPCS code; not a dose invoice price/);
  assert.match(reimbursement.above_threshold, /strictly greater than \$655/);
  assert.match(reimbursement.at_or_below_threshold, /\$655 per day or less/);
  assert.equal(reimbursement.source.publication_date, '2025-11-25');
  assert.equal(reimbursement.source.effective_date, '2026-01-01');
  assert.equal(reimbursement.source.url, 'https://www.govinfo.gov/content/pkg/FR-2025-11-25/html/2025-20907.htm');
  assert.match(reimbursement.coverage_limit, /does not establish coverage/);
});

test('CMS: historical claims MUC remains distinct from the new-code/no-claims exception', () => {
  assert.equal(reimbursement.payment_method_with_claims,
    'arithmetic mean unit cost (MUC) derived from hospital claims');
  assert.deepEqual(reimbursement.new_coded_nonpass_through_without_claims, {
    ASP_available: 'ASP plus 6 percent',
    ASP_unavailable_initial_sales_period: 'WAC plus 3 percent',
    ASP_unavailable_after_initial_sales_period: 'WAC plus 6 percent',
    ASP_and_WAC_unavailable: '95 percent of most recent AWP',
  });
});

test('numeric source files reject blank, nonfinite, duplicate or malformed fields', () => {
  for (const body of ['1,,2', '1,NaN,2', '1,Infinity,2', '1,1,', '1,1,2,3', '-1,1,2']) {
    assert.throws(() => numericCsv(`${decayHeaders.join(',')}\n${body}\n`, decayHeaders));
  }
  assert.throws(() => numericCsv('minutes,minutes,multiplier\n0,1,1\n', decayHeaders));
});
