import assert from 'node:assert/strict';
import test from 'node:test';

import {
  EUDI_RECEIPT_FIELDS,
  EUDI_REQUEST_AUDIT_PRESETS,
  EUDI_REQUEST_AUDIT_SOURCES,
  canonicalAttributeName,
  emptyReceiptFields,
  evaluateEudiRequestAudit,
  parseAttributeList,
} from '../src/lib/eudi-request-audit-model.ts';

const evaluatePreset = (name, overrides = {}) => evaluateEudiRequestAudit({
  ...EUDI_REQUEST_AUDIT_PRESETS[name].fr,
  outcome: 'not-checked',
  receiptFields: emptyReceiptFields(),
  ...overrides,
});

test('category parsing normalises labels, removes duplicates and caps input', () => {
  assert.equal(canonicalAttributeName('  Preuve d’âge  '), 'preuve dage');
  assert.deepEqual(parseAttributeList('Nom; nom\nAdresse complète, preuve d’âge'), ['Nom', 'Adresse complète', 'preuve d’âge']);
  assert.equal(parseAttributeList(Array.from({ length: 35 }, (_, index) => `champ ${index}`).join('\n')).length, 30);
  assert.equal(parseAttributeList('x'.repeat(100))[0].length, 80);
});

test('an aligned request is accepted without claiming legal compliance', () => {
  const result = evaluatePreset('aligned');
  assert.equal(result.requestStatus, 'aligned');
  assert.deepEqual(result.excessAttributes, []);
  assert.deepEqual(result.missingIdentityChecks, []);
  assert.deepEqual(result.unknownIdentityChecks, []);
});

test('an undeclared category or failed identity evidence blocks the request', () => {
  const overasking = evaluatePreset('overasking');
  assert.equal(overasking.requestStatus, 'blocked');
  assert.deepEqual(overasking.excessAttributes, ['adresse complète']);

  const failedIdentity = evaluatePreset('aligned', { certificateValid: 'no' });
  assert.equal(failedIdentity.requestStatus, 'blocked');
  assert.deepEqual(failedIdentity.missingIdentityChecks, ['certificateValid']);
});

test('unknown evidence and empty lists fail closed with a warning', () => {
  const result = evaluatePreset('unverifiable');
  assert.equal(result.requestStatus, 'warning');
  assert.deepEqual(result.unknownIdentityChecks, ['registryEntry', 'certificateValid', 'identityMatches']);
  assert.equal(result.declaredCount, 0);
  assert.equal(result.requestedCount, 0);
});

test('receipt requirements depend on the selected transaction outcome', () => {
  const receiptFields = emptyReceiptFields();
  for (const field of EUDI_RECEIPT_FIELDS.filter((item) => item.requiredFor === 'all')) receiptFields[field.id] = true;

  const success = evaluatePreset('aligned', { outcome: 'success', receiptFields });
  assert.equal(success.receiptStatus, 'complete');
  assert.deepEqual(success.missingReceiptFields, []);

  const failed = evaluatePreset('aligned', { outcome: 'failed', receiptFields });
  assert.equal(failed.receiptStatus, 'incomplete');
  assert.deepEqual(failed.missingReceiptFields, ['failureReason']);

  receiptFields.failureReason = true;
  assert.equal(evaluatePreset('aligned', { outcome: 'failed', receiptFields }).receiptStatus, 'complete');
});

test('the public model cites unique HTTPS primary sources', () => {
  assert.ok(EUDI_REQUEST_AUDIT_SOURCES.length >= 4);
  assert.equal(new Set(EUDI_REQUEST_AUDIT_SOURCES.map((source) => source.url)).size, EUDI_REQUEST_AUDIT_SOURCES.length);
  for (const source of EUDI_REQUEST_AUDIT_SOURCES) assert.match(source.url, /^https:\/\/eur-lex\.europa\.eu\//u);
});
