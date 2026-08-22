import assert from 'node:assert/strict';
import test from 'node:test';

import {
  INVOICE_ACCESS_DEFAULTS,
  INVOICE_ACCESS_NODES,
  INVOICE_ACCESS_SOURCES,
  activeInvoiceAccessNodes,
} from '../src/lib/invoice-access-map-model.ts';

test('the access map exposes unique, ordered and sourced actor categories', () => {
  assert.equal(INVOICE_ACCESS_NODES.length, 13);
  assert.equal(new Set(INVOICE_ACCESS_NODES.map((node) => node.id)).size, 13);
  assert.deepEqual(
    INVOICE_ACCESS_NODES.map((node) => node.order),
    [...INVOICE_ACCESS_NODES].map((node) => node.order).sort((a, b) => a - b),
  );
  for (const node of INVOICE_ACCESS_NODES) {
    assert.match(node.sourceUrl, /^https:\/\//u);
    assert.ok(node.titleFr && node.titleEn && node.descriptionFr && node.descriptionEn);
    assert.ok(['full', 'structured', 'routing', 'technical'].includes(node.level));
  }
});

test('the default view includes mandatory actors and the enabled software branch', () => {
  const active = activeInvoiceAccessNodes(INVOICE_ACCESS_DEFAULTS);
  assert.deepEqual(
    active.map((node) => node.id),
    INVOICE_ACCESS_NODES
      .filter((node) => node.mandatory || node.toggle === 'software')
      .map((node) => node.id),
  );
  assert.equal(active.some((node) => node.id === 'software'), true);
  assert.equal(active.some((node) => node.id === 'external-ai'), false);
});

test('each optional toggle reveals only its matching branch', () => {
  const allDisabled = Object.fromEntries(Object.keys(INVOICE_ACCESS_DEFAULTS).map((key) => [key, false]));
  const mandatoryCount = INVOICE_ACCESS_NODES.filter((node) => node.mandatory).length;
  assert.equal(activeInvoiceAccessNodes(allDisabled).length, mandatoryCount);

  for (const toggle of Object.keys(INVOICE_ACCESS_DEFAULTS)) {
    const active = activeInvoiceAccessNodes({ ...allDisabled, [toggle]: true });
    assert.equal(active.length, mandatoryCount + 1, toggle);
    assert.equal(active.some((node) => node.toggle === toggle), true, toggle);
  }
});

test('the public model cites multiple primary sources', () => {
  assert.ok(INVOICE_ACCESS_SOURCES.length >= 3);
  assert.equal(new Set(INVOICE_ACCESS_SOURCES.map((source) => source.url)).size, INVOICE_ACCESS_SOURCES.length);
  for (const source of INVOICE_ACCESS_SOURCES) assert.match(source.url, /^https:\/\//u);
});
