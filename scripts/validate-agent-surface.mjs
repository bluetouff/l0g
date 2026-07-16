import { readFileSync, readdirSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
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
const searchIndex = readJson('dist/api/v1/search-index.json');
const sources = readJson('dist/api/v1/sources.json');
const integrity = readJson('dist/api/v1/integrity.json');
const llmsFull = readFileSync('dist/llms-full.txt', 'utf8');
const llmsFullEn = readFileSync('dist/llms-full-en.txt', 'utf8');

function contentFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...contentFiles(path));
    else if (['.md', '.mdx'].includes(extname(entry.name))) out.push(path);
  }
  return out;
}

function frontmatter(path, root) {
  const source = readFileSync(path, 'utf8');
  const block = source.match(/^---\s*\n([\s\S]*?)\n---/)?.[1] || '';
  const field = (name) => {
    const value = block.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'))?.[1]?.trim() || '';
    return value.replace(/^['"]|['"]$/g, '');
  };
  return {
    id: relative(root, path).replace(/\.(md|mdx)$/i, ''),
    pubDate: field('pubDate'),
    updatedDate: field('updatedDate'),
    sourceArticle: field('sourceArticle'),
    sourceGuide: field('sourceGuide'),
    sourceUpdatedDate: field('sourceUpdatedDate'),
    draft: field('draft') === 'true',
  };
}

function isoDay(value) {
  const date = new Date(value);
  assert(!Number.isNaN(date.getTime()), `date de traduction invalide: ${value}`);
  return date.toISOString().slice(0, 10);
}

function validateOpenapiArtifacts() {
  const ajv = new Ajv({ strict: false, allErrors: true });
  addFormats(ajv);
  for (const [name, schema] of Object.entries(openapi.components?.schemas || {})) {
    ajv.addSchema(schema, `#/components/schemas/${name}`);
  }
  const artifacts = [
    ['AgentManifest', 'dist/agents.json'],
    ['Catalog', 'dist/api/v1/catalog.json'],
    ['SearchIndexSurface', 'dist/api/v1/search-index.json'],
    ['ClaimsSurface', 'dist/api/v1/claims.json'],
    ['EvidenceGraphSurface', 'dist/api/v1/evidence-graph.json'],
    ['SourcesSurface', 'dist/api/v1/sources.json'],
    ['FreshnessSurface', 'dist/api/v1/freshness.json'],
    ['IntegritySurface', 'dist/api/v1/integrity.json'],
    ['ChangefeedSurface', 'dist/api/v1/changes.json'],
    ['BlackBoxSurface', 'dist/api/v1/black-box.json'],
    ['RiskSnapshot', 'dist/api/v1/risk.json'],
    ['DebtRiskSnapshot', 'dist/api/v1/debt-risk.json'],
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
assert(claims.counts?.articlesByLanguage?.en === 0, 'claims.json ne doit pas dupliquer les claims anglaises');
assert((claims.claims || []).every((claim) => claim.language === 'fr'), 'une claim non canonique française a été publiée');

assert(catalog.counts?.articlesByLanguage?.fr > 0 && catalog.counts?.articlesByLanguage?.en > 0, 'catalogue articles non bilingue');
assert(catalog.counts?.guidesByLanguage?.fr > 0 && catalog.counts?.guidesByLanguage?.en > 0, 'catalogue guides non bilingue');
assert(searchIndex.counts?.byLanguage?.en > 0, 'index de recherche sans documents anglais');
assert(searchIndex.documents?.some((document) => document.language === 'en' && document.type === 'article' && document.text.length > 500), 'index partagé sans corps d’article anglais');

const sourcePosts = new Map(contentFiles('src/content/posts').map((path) => {
  const item = frontmatter(path, 'src/content/posts');
  return [item.id, item];
}));
const sourceGuides = new Map(contentFiles('src/content/guides').map((path) => {
  const item = frontmatter(path, 'src/content/guides');
  return [item.id, item];
}));
const translations = [
  ...contentFiles('src/content/posts-en').map((path) => ({ ...frontmatter(path, 'src/content/posts-en'), type: 'article', sourceKey: 'sourceArticle' })),
  ...contentFiles('src/content/guides-en').map((path) => ({ ...frontmatter(path, 'src/content/guides-en'), type: 'guide', sourceKey: 'sourceGuide' })),
].filter((item) => !item.draft);
for (const translation of translations) {
  const collection = translation.type === 'article' ? catalog.articles : catalog.guides;
  const sourcesById = translation.type === 'article' ? sourcePosts : sourceGuides;
  const sourceId = translation[translation.sourceKey];
  const source = sourcesById.get(sourceId);
  const record = collection.find((item) => item.language === 'en' && item.slug === translation.id);
  assert(record, `traduction absente du catalogue: ${translation.type}:${translation.id}`);
  assert(record.canonicalId === `${translation.type}:${sourceId}`, `canonicalId invalide: ${translation.id}`);
  assert(record.translationOf === record.canonicalId, `translationOf invalide: ${translation.id}`);
  assert(record.alternateUrl?.includes(`/${translation.type === 'article' ? 'posts' : 'guides'}/${sourceId}/`), `alternateUrl invalide: ${translation.id}`);
  const expected = !source
    ? 'missing-source'
    : isoDay(source.updatedDate || source.pubDate) > isoDay(translation.sourceUpdatedDate) ? 'stale' : 'current';
  assert(record.translationStatus === expected, `translationStatus invalide: ${translation.id} -> ${record.translationStatus}, attendu ${expected}`);
  if (translation.type === 'article') {
    assert(!record.evidence, `claims dupliquées dans la traduction anglaise: ${translation.id}`);
    assert(record.evidenceRef?.articleSlug === sourceId && record.evidenceRef?.language === 'fr', `evidenceRef canonique manquante: ${translation.id}`);
  }
}
assert(!translations.some((translation) => {
  const collection = translation.type === 'article' ? catalog.articles : catalog.guides;
  return collection.find((item) => item.language === 'en' && item.slug === translation.id)?.translationStatus === 'missing-source';
}), 'une traduction pointe vers une source française absente');

assert(llmsFullEn.includes('REFERENCE GUIDE:') && llmsFullEn.includes('ANALYSIS:'), 'llms-full-en.txt ne contient pas les collections anglaises');
assert(llmsFull.includes('Corpus anglais distinct : https://l0g.fr/llms-full-en.txt'), 'llms-full.txt ne pointe pas vers le corpus anglais distinct');
assert(!llmsFull.includes('ENGLISH ANALYSIS :'), 'llms-full.txt gonflé par le corpus anglais');

const claimIds = new Set();
for (const claim of claims.claims || []) {
  assert(!claimIds.has(claim.id), `claim id duplique: ${claim.id}`);
  claimIds.add(claim.id);
  assert(claim.reviewStatus === 'unreviewed' || claim.reviewStatus === 'reviewed', `reviewStatus invalide: ${claim.id}`);
  assert(claim.classifier?.method === 'lexical-heuristic-v1', `classifier manquant: ${claim.id}`);
  assert(claim.classifier?.matchedRule !== 'default-fact', `default-fact interdit: ${claim.id}`);
  assert(claim.kind !== 'fait' || claim.reviewStatus === 'reviewed', `fait automatique interdit sans revue: ${claim.id}`);
  assert(!/:claim-\d+$/.test(claim.id), `claim id positionnel instable: ${claim.id}`);
  assert(!/^sources?\s+principales?\b/iu.test(claim.claim), `section bibliographique extraite en claim: ${claim.id}`);
  assert(!/^(?:pour le contexte|voir aussi|lire aussi|lire également|à lire aussi|a lire aussi|voir également|for context|see also|read also|further reading|related reading)\b/iu.test(claim.claim), `phrase navigationnelle extraite en claim: ${claim.id}`);
  assert(Object.prototype.hasOwnProperty.call(claim, 'claimDate'), `claimDate manquant: ${claim.id}`);
  assert(Object.prototype.hasOwnProperty.call(claim, 'observationDate'), `observationDate manquant: ${claim.id}`);
  assert(['day', 'month', 'quarter', 'year', 'range', 'unknown'].includes(claim.temporalPrecision), `temporalPrecision invalide: ${claim.id}`);
  if (claim.observationDateLabel === 'observation non détectée') {
    assert(claim.observationDate === null, `observationDate doit rester null si non detectee: ${claim.id}`);
  }
  if (claim.reviewedProofDepth === 'direct-proof') {
    assert(claim.evidenceLocator?.type && claim.evidenceLocator?.value, `direct-proof sans evidenceLocator: ${claim.id}`);
  }
  if (claim.reviewedProofDepth === 'reproduction') {
    assert(claim.evidenceLocator?.type && claim.evidenceLocator?.value, `reproduction sans evidenceLocator: ${claim.id}`);
    assert(claim.reproductionArtifact, `reproduction sans reproductionArtifact: ${claim.id}`);
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

// claim-review-registry-integrity
const reviewEntries = claims.reviewRegistry?.entries || [];
const reviewIds = new Set();
for (const review of reviewEntries) {
  assert(!reviewIds.has(review.claimId), `review dupliquee: ${review.claimId}`);
  reviewIds.add(review.claimId);
  assert(claimIds.has(review.claimId), `review orpheline: ${review.claimId}`);
}
assert(reviewEntries.length === claims.counts.reviewedClaims, 'reviewedClaims ne correspond pas au registre');

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
  {
    articleSlug: 'dollar-yen-intervention-risque-carry-2026',
    includes: 'entre le 28 avril et le 27 mai 2026',
    expectedKind: 'unclassified-assertion',
    expectedTemporalPrecision: 'range',
    expectedObservationStart: '2026-04-28',
    expectedObservationEnd: '2026-05-27',
    note: 'un intervalle explicite doit exposer observationStart et observationEnd',
  },
];

for (const golden of semanticGoldenClaims) {
  const claim = (claims.claims || []).find(
    (item) => item.articleSlug === golden.articleSlug && item.claim.includes(golden.includes)
  );
  assert(claim, `golden claim introuvable: ${golden.note}`);
  assert(claim.kind === golden.expectedKind, `golden claim invalide: ${golden.note} -> ${claim.kind}`);
  if (golden.expectedTemporalPrecision) assert(claim.temporalPrecision === golden.expectedTemporalPrecision, `precision temporelle invalide: ${golden.note} -> ${claim.temporalPrecision}`);
  if (golden.expectedObservationStart) assert(claim.observationStart === golden.expectedObservationStart, `observationStart invalide: ${golden.note} -> ${claim.observationStart}`);
  if (golden.expectedObservationEnd) assert(claim.observationEnd === golden.expectedObservationEnd, `observationEnd invalide: ${golden.note} -> ${claim.observationEnd}`);
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

const blackBox = readJson('dist/api/v1/black-box.json');
assert(blackBox.version === '2', 'Black Box append-only v2 non publié');
assert(blackBox.coverage?.pointInTime === true, 'Black Box v2 doit déclarer pointInTime');
assert(blackBox.archive?.appendOnly === true, 'politique append-only Black Box absente');
let previousFrameHash = null;
for (const frame of blackBox.frames || []) {
  assert(frame.previousFrameHash === previousFrameHash, `chaîne Black Box rompue: ${frame.frameId}`);
  previousFrameHash = frame.frameHash;
}

const malformedGuideLinks = llmsFull
  .split('\n')
  .filter((line) => line.startsWith('Guide lie : '))
  .filter((line) => !line.startsWith('Guide lie : https://l0g.fr/guides/'));
assert(
  malformedGuideLinks.length === 0,
  `liens Guide lie invalides dans llms-full.txt: ${malformedGuideLinks.slice(0, 5).join(' | ')}`
);

const staleTranslations = [...catalog.articles, ...catalog.guides].filter((item) => item.language === 'en' && item.translationStatus === 'stale').length;
console.log(`Agent Surface OK: ${claims.claims?.length ?? 0} claims canoniques, ${searchIndex.counts?.byLanguage?.en ?? 0} documents EN, ${staleTranslations} traduction(s) stale.`);
