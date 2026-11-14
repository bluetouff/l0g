import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { load } from 'js-yaml';
import { aiFinancingGuides, aiFinancingNvidiaIds, aiFinancingSections, aiFinancingSourceArticles } from '../src/config/ai-financing-dossier.ts';
import { postMatchesTopic, topics } from '../src/config/topics.ts';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const EDITION_CUTOFF = Date.parse('2026-11-14T23:59:59.999+01:00');
const analyses = aiFinancingSections.flatMap(section => section.readings);

function publishedEntry(collection, id) {
  assert.match(id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `invalid content ID: ${id}`);
  const file = ['md', 'mdx'].map(extension => join(ROOT, 'src/content', collection, `${id}.${extension}`)).find(existsSync);
  assert.ok(file, `missing dossier destination: ${collection}/${id}`);
  const frontmatter = readFileSync(file, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  assert.ok(frontmatter, `missing frontmatter: ${file}`);
  const data = load(frontmatter[1]);
  assert.notEqual(data.draft, true, `draft linked by dossier: ${collection}/${id}`);
  const publicationDate = new Date(data.pubDate).getTime();
  assert.ok(Number.isFinite(publicationDate), `invalid publication date: ${collection}/${id}`);
  assert.ok(publicationDate <= EDITION_CUTOFF, `future destination in the 14 November edition: ${collection}/${id}`);
  return data;
}

function bilingualPair(id, kind = 'analysis') {
  const [englishCollection, frenchCollection, sourceField] = kind === 'guide'
    ? ['guides-en', 'guides', 'sourceGuide']
    : ['posts-en', 'posts', 'sourceArticle'];
  const english = publishedEntry(englishCollection, id);
  assert.equal(typeof english[sourceField], 'string', `missing ${sourceField}: ${id}`);
  const french = publishedEntry(frenchCollection, english[sourceField]);
  return { english, french, frenchId: english[sourceField] };
}

test('the curated AI dossier leads to distinct published article pairs in both languages', () => {
  assert.equal(analyses.length, 22, 'preserve the selected breadth of the dossier');
  assert.equal(new Set(analyses.map(item => item.id)).size, analyses.length, 'duplicate English analysis');
  const frenchIds = analyses.map(item => bilingualPair(item.id).frenchId);
  assert.equal(new Set(frenchIds).size, analyses.length, 'multiple readings resolve to the same French article');
});

test('the historical topic identities exactly follow the curated dossier and actual translation source links', () => {
  const ids = [...new Set([...aiFinancingNvidiaIds, ...analyses.map(item => item.id)])];
  assert.deepEqual(Object.keys(aiFinancingSourceArticles).sort(), [...ids].sort());
  const expectedArticleIds = [];
  for (const id of ids) {
    const pair = bilingualPair(id);
    assert.equal(aiFinancingSourceArticles[id], pair.frenchId, `stale sourceArticle mapping: ${id}`);
    expectedArticleIds.push(id, pair.frenchId);
  }
  const topic = topics.find(topic => topic.slug === 'financement-ia');
  assert.deepEqual([...topic.articleIds].sort(), expectedArticleIds.sort());
});

test('every curated investigation is classified for the Watch topic in both languages', () => {
  const topic = topics.find(topic => topic.slug === 'financement-ia');
  assert.ok(topic, 'missing followable AI financing topic');
  const ids = new Set([...aiFinancingNvidiaIds, ...analyses.map(item => item.id)]);
  for (const id of ids) {
    const pair = bilingualPair(id);
    for (const language of ['french', 'english']) {
      const articleId = language === 'french' ? pair.frenchId : id;
      assert.ok(postMatchesTopic(pair[language].tags, topic, articleId), `${language} article missing from topic: ${id}`);
    }
  }
});

test('the Nvidia series preserves eleven published bilingual instalments in publication order', () => {
  assert.equal(aiFinancingNvidiaIds.length, 11);
  assert.equal(new Set(aiFinancingNvidiaIds).size, aiFinancingNvidiaIds.length);
  const pairs = aiFinancingNvidiaIds.map(id => bilingualPair(id));
  assert.equal(new Set(pairs.map(pair => pair.frenchId)).size, pairs.length);
  for (const language of ['french', 'english']) {
    const dates = pairs.map(pair => new Date(pair[language].pubDate).getTime());
    assert.deepEqual(dates, [...dates].sort((a, b) => a - b), `${language} series is out of publication order`);
  }
});

test('the four reference guides have published source-linked French counterparts', () => {
  assert.equal(aiFinancingGuides.length, 4);
  assert.equal(new Set(aiFinancingGuides.map(item => item.id)).size, aiFinancingGuides.length);
  const frenchIds = aiFinancingGuides.map(item => bilingualPair(item.id, 'guide').frenchId);
  assert.equal(new Set(frenchIds).size, aiFinancingGuides.length);
});

test('section images are real local assets and section anchors remain unique', () => {
  assert.equal(new Set(aiFinancingSections.map(section => section.id)).size, aiFinancingSections.length);
  for (const section of aiFinancingSections) {
    assert.match(section.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.match(section.image, /^\/illustrations\/news\/[a-z0-9-]+\.(?:jpg|png|webp)$/);
    assert.ok(existsSync(join(ROOT, 'public', section.image.slice(1))), `missing section image: ${section.image}`);
  }
});

test('curated headings and reading labels use the editorial title rules in both languages', () => {
  const forbiddenFraming = /\bce (?:que|qui|qu[’'](?:on|il))\b|\bwhat\b|(?:,|:)\s*(?:pas|not)\b/iu;
  for (const copy of [...aiFinancingSections.map(section => section.title), ...analyses.map(item => item.label)]) {
    for (const language of ['fr', 'en']) {
      assert.ok(copy[language]?.trim(), `missing ${language} heading or label`);
      assert.doesNotMatch(copy[language], forbiddenFraming, `empty framing in ${language} heading: ${copy[language]}`);
      assert.doesNotMatch(copy[language], /—/u, `em dash in ${language} heading: ${copy[language]}`);
    }
  }
  for (const item of [...aiFinancingSections, ...analyses, ...aiFinancingGuides]) {
    const copy = 'description' in item ? item.description : item.note;
    for (const language of ['fr', 'en']) assert.ok(copy[language]?.trim(), `missing ${language} reading context`);
  }
});
