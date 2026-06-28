import { readFileSync } from 'node:fs';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

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
const catalog = readJson('dist/api/v1/catalog.json');
const claims = readJson('dist/api/v1/claims.json');
const sources = readJson('dist/api/v1/sources.json');
const integrity = readJson('dist/api/v1/integrity.json');

function validateOpenapiArtifacts() {
  const ajv = new Ajv({ strict: false, allErrors: true });
  addFormats(ajv);
  for (const [name, schema] of Object.entries(openapi.components?.schemas || {})) {
    ajv.addSchema(schema, `#/components/schemas/${name}`);
  }
  const artifacts = [
    ['AgentManifest', 'dist/agents.json'],
    ['Catalog', 'dist/api/v1/catalog.json'],
    ['ClaimsSurface', 'dist/api/v1/claims.json'],
    ['EvidenceGraphSurface', 'dist/api/v1/evidence-graph.json'],
    ['SourcesSurface', 'dist/api/v1/sources.json'],
    ['FreshnessSurface', 'dist/api/v1/freshness.json'],
    ['IntegritySurface', 'dist/api/v1/integrity.json'],
    ['ChangefeedSurface', 'dist/api/v1/changes.json'],
    ['RiskSnapshot', 'dist/api/v1/risk.json'],
  ];

  for (const [schemaName, path] of artifacts) {
    const validate = ajv.getSchema(`#/components/schemas/${schemaName}`);
    assert(validate, `schema OpenAPI introuvable: ${schemaName}`);
    const payload = readJson(path);
    if (!validate(payload)) {
      const sample = JSON.stringify((validate.errors || []).slice(0, 10), null, 2);
      throw new Error(`${path} ne respecte pas ${schemaName}: ${sample}`);
    }
  }
}

let looseSchemas = 0;
walk(openapi, (node, path) => {
  if (node.additionalProperties === true) {
    looseSchemas += 1;
    console.error(`additionalProperties:true at ${path.join('.') || '<root>'}`);
  }
});
assert(looseSchemas === 0, 'OpenAPI contient encore des schemas permissifs');
validateOpenapiArtifacts();

assert(claims.policy?.classification, 'claims.policy.classification manquant');
assert(claims.policy?.review, 'claims.policy.review manquant');
assert(claims.policy?.dateModel, 'claims.policy.dateModel manquant');
assert(claims.reviewRegistry?.version, 'claims.reviewRegistry.version manquant');
assert(typeof claims.counts?.reviewedClaims === 'number', 'claims.counts.reviewedClaims manquant');
assert((claims.counts?.claimKinds || []).includes('unclassified-assertion'), 'claimKinds ne declare pas unclassified-assertion');

for (const claim of claims.claims || []) {
  assert(claim.reviewStatus === 'unreviewed' || claim.reviewStatus === 'reviewed', `reviewStatus invalide: ${claim.id}`);
  assert(claim.classifier?.method === 'lexical-heuristic-v1', `classifier manquant: ${claim.id}`);
  assert(claim.classifier?.matchedRule !== 'default-fact', `default-fact interdit: ${claim.id}`);
  assert(claim.kind !== 'fait' || claim.reviewStatus === 'reviewed', `fait automatique interdit sans revue: ${claim.id}`);
  assert(!/:claim-\d+$/.test(claim.id), `claim id positionnel instable: ${claim.id}`);
  assert(!/^sources?\s+principales?\b/iu.test(claim.claim), `section bibliographique extraite en claim: ${claim.id}`);
  assert(Object.prototype.hasOwnProperty.call(claim, 'claimDate'), `claimDate manquant: ${claim.id}`);
  assert(Object.prototype.hasOwnProperty.call(claim, 'observationDate'), `observationDate manquant: ${claim.id}`);
  if (claim.observationDateLabel === 'observation non détectée') {
    assert(claim.observationDate === null, `observationDate doit rester null si non detectee: ${claim.id}`);
  }

  for (const reference of claim.references || []) {
    assert(Object.prototype.hasOwnProperty.call(reference, 'sourcePublicationDate'), `sourcePublicationDate manquant: ${claim.id}`);
    assert(Object.prototype.hasOwnProperty.call(reference, 'retrievedAt'), `retrievedAt manquant: ${claim.id}`);
    assert(Object.prototype.hasOwnProperty.call(reference, 'indexedAt'), `indexedAt manquant: ${claim.id}`);
    assert(reference.indexedAt, `indexedAt non alimente: ${claim.id} -> ${reference.href}`);
    if (reference.sourcePublicationDate === null) {
      assert(reference.date === null, `date de reference fallback suspect: ${claim.id} -> ${reference.href}`);
    }
  }
}

assert(
  (claims.claims || []).some((claim) => claim.observationDate && claim.observationDate !== claim.claimDate),
  'aucune observationDate distincte de claimDate detectee'
);

const semanticGoldenClaims = [
  {
    articleSlug: 'dollar-yen-intervention-risque-carry-2026',
    includes: 'autour de 161,94',
    expectedKind: 'unclassified-assertion',
    note: 'une observation de marche contenant autour de ne doit pas devenir estimation automatiquement',
  },
  {
    articleSlug: 'dollar-yen-intervention-risque-carry-2026',
    includes: 'même si la banque centrale',
    expectedKind: 'unclassified-assertion',
    note: 'meme si ne doit pas declencher scenario automatiquement',
  },
];

for (const golden of semanticGoldenClaims) {
  const claim = (claims.claims || []).find(
    (item) => item.articleSlug === golden.articleSlug && item.claim.includes(golden.includes)
  );
  assert(claim, `golden claim introuvable: ${golden.note}`);
  assert(claim.kind === golden.expectedKind, `golden claim invalide: ${golden.note} -> ${claim.kind}`);
}

for (const article of catalog.articles || []) {
  if (article.evidence?.depth?.id !== 'direct-proof' && article.evidence?.depth?.id !== 'reproduction') continue;
  assert(
    (article.evidence.claims || []).some((claim) => claim.reviewStatus === 'reviewed' && claim.reviewedProofDepth === article.evidence.depth.id),
    `${article.evidence.depth.id} sans revue humaine explicite: ${article.slug}`
  );
}

assert(sources.registry?.version, 'sources.registry.version manquant');
assert(sources.registry?.testPolicy, 'sources.registry.testPolicy manquant');
assert(integrity.externalAuthenticity?.status === 'github-sigstore-attestation-configured', 'politique externalAuthenticity Sigstore manquante');

console.log(`Agent Surface OK: ${claims.claims?.length ?? 0} claims, ${sources.primarySources?.length ?? 0} sources primaires.`);
