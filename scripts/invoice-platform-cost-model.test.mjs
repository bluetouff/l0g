import assert from 'node:assert/strict';
import test from 'node:test';

import {
  INVOICE_PLATFORM_COST_DEFAULTS,
  INVOICE_PLATFORM_PUBLIC_OFFERS,
  calculateInvoicePlatformCosts,
  normalizeInvoicePlatformCostInputs,
} from '../src/lib/invoice-platform-cost-model.ts';

const byId = (inputs = INVOICE_PLATFORM_COST_DEFAULTS) => new Map(
  calculateInvoicePlatformCosts(inputs).map((result) => [result.id, result]),
);

test('the public-offer registry is complete, unique and source-linked', () => {
  assert.equal(INVOICE_PLATFORM_PUBLIC_OFFERS.length, 19);
  assert.equal(new Set(INVOICE_PLATFORM_PUBLIC_OFFERS.map((offer) => offer.id)).size, 19);
  for (const offer of INVOICE_PLATFORM_PUBLIC_OFFERS) {
    assert.match(offer.sourceUrl, /^https:\/\//u);
  }
});

test('normalisation clamps numeric inputs and keeps received flows within total flows', () => {
  assert.deepEqual(
    normalizeInvoicePlatformCostInputs({
      employees: -5,
      users: 0,
      activeClients: Number.POSITIVE_INFINITY,
      monthlyFlows: 12,
      monthlyReceived: 30,
    }),
    {
      ...INVOICE_PLATFORM_COST_DEFAULTS,
      employees: 0,
      users: 1,
      activeClients: INVOICE_PLATFORM_COST_DEFAULTS.activeClients,
      monthlyFlows: 12,
      monthlyReceived: 12,
    },
  );
});

test('the default 36-month calculations match the published article figures', () => {
  const results = byId();
  const expected = {
    qonto: 0,
    indy: 0,
    abby: 0,
    dougs: 0,
    tiime: 0,
    pennylane: 0,
    'super-pdp': 2,
    b2brouter: 330,
    vosfactures: 180,
    macompta: 180,
    shine: 0,
    docaposte: 684,
    sellsy: 2568,
    odoo: 0,
  };

  for (const [id, cost] of Object.entries(expected)) {
    assert.equal(results.get(id)?.status, 'calculated', id);
    assert.equal(results.get(id)?.cost36mEur, cost, id);
  }

  for (const id of ['kolecto', 'sage', 'cegid', 'dext', 'axonaut']) {
    assert.equal(results.get(id)?.status, 'unknown', id);
    assert.equal(results.get(id)?.cost36mEur, null, id);
  }
});

test('published quota boundaries change the selected tariff without inventing overages', () => {
  assert.equal(byId({ monthlyFlows: 2, monthlyReceived: 1 }).get('b2brouter')?.cost36mEur, 0);
  assert.equal(byId({ monthlyFlows: 3, monthlyReceived: 1 }).get('b2brouter')?.cost36mEur, 330);

  assert.equal(byId({ monthlyFlows: 20, monthlyReceived: 10 }).get('macompta')?.cost36mEur, 0);
  assert.equal(byId({ monthlyFlows: 21, monthlyReceived: 10 }).get('macompta')?.cost36mEur, 180);

  assert.equal(byId({ activeClients: 5 }).get('shine')?.cost36mEur, 0);
  assert.equal(byId({ activeClients: 6 }).get('shine')?.cost36mEur, 324);
});

test('API and promotion rules remain explicit', () => {
  assert.equal(byId({ monthlyFlows: 1_000, monthlyReceived: 500 }).get('super-pdp')?.cost36mEur, 2);
  assert.equal(byId({ monthlyFlows: 1_001, monthlyReceived: 500 }).get('super-pdp')?.cost36mEur, 362.36);
  assert.equal(byId({ apiRequired: true }).get('odoo')?.status, 'unknown');
  assert.equal(byId({ users: 1 }).get('sellsy')?.cost36mEur, 2568);
  assert.equal(byId({ users: 3 }).get('sellsy')?.cost36mEur, 3852);
});
