import assert from 'node:assert/strict';
import test from 'node:test';

import {
  INVOICE_INCIDENT_DATA_DATE,
  INVOICE_INCIDENT_MODEL_VERSION,
  INVOICE_INCIDENT_SOURCES,
  INVOICE_INCIDENT_STEPS,
} from '../src/lib/invoice-incident-log-model.ts';

test('the incident log exposes a dated, versioned and ordered bilingual checklist', () => {
  assert.match(INVOICE_INCIDENT_DATA_DATE, /^2026-\d{2}-\d{2}$/u);
  assert.match(INVOICE_INCIDENT_MODEL_VERSION, /^\d+\.\d+\.\d+$/u);
  assert.equal(INVOICE_INCIDENT_STEPS.length, 7);
  assert.equal(new Set(INVOICE_INCIDENT_STEPS.map((step) => step.id)).size, INVOICE_INCIDENT_STEPS.length);
  assert.deepEqual(
    INVOICE_INCIDENT_STEPS.map((step) => step.order),
    [...INVOICE_INCIDENT_STEPS].map((step) => step.order).sort((a, b) => a - b),
  );
  for (const step of INVOICE_INCIDENT_STEPS) {
    assert.ok(step.titleFr && step.titleEn && step.detailFr && step.detailEn && step.sourceSectionFr && step.sourceSectionEn);
    assert.doesNotMatch(step.sourceSectionFr, /\band\b/u);
    assert.match(step.sourceSectionEn, /Questions/u);
  }
});

test('the workflow covers evidence, continuity, duplicate control and regularisation', () => {
  for (const required of ['preserve', 'continuity', 'duplicate-lock', 'regularise', 'close']) {
    assert.equal(INVOICE_INCIDENT_STEPS.some((step) => step.id === required), true, required);
  }
});

test('the public model cites only secure official sources', () => {
  assert.ok(INVOICE_INCIDENT_SOURCES.length >= 2);
  assert.equal(new Set(INVOICE_INCIDENT_SOURCES.map((source) => source.url)).size, INVOICE_INCIDENT_SOURCES.length);
  for (const source of INVOICE_INCIDENT_SOURCES) assert.match(source.url, /^https:\/\/(www\.)?(impots\.gouv\.fr|legifrance\.gouv\.fr)\//u);
});
