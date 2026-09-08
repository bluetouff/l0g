import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { asiaReadingPaths, isAsiaAnalysis } from '../src/config/english-reading-paths.ts';

const ROOT = process.cwd();

function contentEntryExists(collection, id) {
  return ['md', 'mdx'].some((extension) => existsSync(join(ROOT, 'src', 'content', collection, `${id}.${extension}`)));
}

test('the Asia hub has four distinct mechanism-led paths backed by published content', () => {
  assert.equal(asiaReadingPaths.length, 4);
  assert.equal(new Set(asiaReadingPaths.map((path) => path.id)).size, asiaReadingPaths.length);

  for (const path of asiaReadingPaths) {
    assert.ok(path.transmission.includes('→'), `${path.id} must expose its transmission mechanism`);
    assert.ok(path.analysisIds.length >= 2, `${path.id} must not be a thin landing path`);
    for (const id of path.analysisIds) {
      assert.ok(contentEntryExists('posts-en', id), `missing English analysis: ${id}`);
    }
    for (const id of path.guideIds) {
      assert.ok(contentEntryExists('guides-en', id), `missing English guide: ${id}`);
    }
  }
});

test('Asia classification catches regional analysis without swallowing generic technology coverage', () => {
  assert.equal(isAsiaAnalysis('unlisted', ['South Korea', 'housing']), true);
  assert.equal(isAsiaAnalysis('semiconductors-a-stack-of-constraints', ['markets', 'semiconductors']), true);
  assert.equal(isAsiaAnalysis('generic-ai-analysis', ['markets', 'semiconductors']), false);
});

test('the English entry points present an editorial edition and keep Asia as one path', () => {
  const homepage = readFileSync(join(ROOT, 'src/pages/en/index.astro'), 'utf8');
  const start = readFileSync(join(ROOT, 'src/pages/en/start/index.astro'), 'utf8');
  const analysis = readFileSync(join(ROOT, 'src/pages/en/analysis/index.astro'), 'utf8');
  const analysisArchive = readFileSync(join(ROOT, 'src/pages/en/analysis/page/[page].astro'), 'utf8');
  const guides = readFileSync(join(ROOT, 'src/pages/en/guides/index.astro'), 'utf8');
  const layout = readFileSync(join(ROOT, 'src/layouts/EnglishGuidesLayout.astro'), 'utf8');

  assert.match(homepage, /independent French publication with a growing English edition/i);
  assert.match(start, /The selection is global: Asia is a strong reading path/i);
  assert.match(analysis, /selected and edited for an international audience/i);
  assert.doesNotMatch(homepage, /Risk intelligence,\s*translated/i);
  assert.doesNotMatch(homepage, /curated access layer/i);
  assert.doesNotMatch(`${analysisArchive}\n${guides}\n${layout}`, /selected .+ translated|intentionally limited|English layer exposes/iu);
});
