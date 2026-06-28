import { readFileSync } from 'node:fs';

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function walk(value, visit, path = []) {
  if (!value || typeof value !== 'object') return;
  visit(value, path);
  for (const [key, child] of Object.entries(value)) walk(child, visit, path.concat(key));
}

const openapi = readJson('dist/openapi.json');
const claims = readJson('dist/api/v1/claims.json');
const sources = readJson('dist/api/v1/sources.json');
const integrity = readJson('dist/api/v1/integrity.json');

let looseSchemas = 0;
walk(openapi, (node, path) => {
  if (node.additionalProperties === true) {
    looseSchemas += 1;
    console.error(`additionalProperties:true at ${path.join('.') || '<root>'}`);
  }
});
assert(looseSchemas === 0, 'OpenAPI contient encore des schemas permissifs');

assert(claims.policy?.classification, 'claims.policy.classification manquant');
assert(claims.policy?.review, 'claims.policy.review manquant');
assert(claims.policy?.dateModel, 'claims.policy.dateModel manquant');

for (const claim of claims.claims || []) {
  assert(claim.reviewStatus === 'unreviewed' || claim.reviewStatus === 'reviewed', `reviewStatus invalide: ${claim.id}`);
  assert(claim.classifier?.method === 'lexical-heuristic-v1', `classifier manquant: ${claim.id}`);
  assert(Object.prototype.hasOwnProperty.call(claim, 'claimDate'), `claimDate manquant: ${claim.id}`);
  assert(Object.prototype.hasOwnProperty.call(claim, 'observationDate'), `observationDate manquant: ${claim.id}`);

  for (const reference of claim.references || []) {
    assert(Object.prototype.hasOwnProperty.call(reference, 'sourcePublicationDate'), `sourcePublicationDate manquant: ${claim.id}`);
    assert(Object.prototype.hasOwnProperty.call(reference, 'retrievedAt'), `retrievedAt manquant: ${claim.id}`);
    if (reference.sourcePublicationDate === null) {
      assert(reference.date === null, `date de reference fallback suspect: ${claim.id} -> ${reference.href}`);
    }
  }
}

assert(sources.registry?.version, 'sources.registry.version manquant');
assert(sources.registry?.testPolicy, 'sources.registry.testPolicy manquant');
assert(integrity.externalAuthenticity?.status === 'not-externally-signed', 'politique externalAuthenticity manquante');

console.log(`Agent Surface OK: ${claims.claims?.length ?? 0} claims, ${sources.primarySources?.length ?? 0} sources primaires.`);
