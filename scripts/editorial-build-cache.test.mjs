import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, symlinkSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { buildDateKey } from '../src/lib/build-clock.mjs';
import { editorialCacheKey, glossaryCacheKey, createStaticEntryEligibility } from '../src/lib/editorial-build-cache.mjs';

const now = new Date('2026-11-04T12:00:00.000Z');
const entry = (id, extra = {}) => ({ id, body: `Body of ${id}`, data: { title: `Title ${id}`, pubDate: new Date('2026-11-01T09:00:00Z'), draft: false, ...extra } });
const emptyConfig = { paths: [], frenchDossiers: [], englishLinks: [], suggestions: () => [] };
const fixture = () => ({ posts: [entry('first'), entry('second')], postsEn: [entry('first-en', { sourceArticle: 'first' }), entry('second-en', { sourceArticle: 'second' })], guides: [], guidesEn: [] });
const key = (collection, id, collections, config = emptyConfig, instant = now) => editorialCacheKey(collection, collections[collection].find(item => item.id === id), collections, config, instant);

test('an unrelated article addition, edit or removal preserves existing cache keys', () => {
  const collections = fixture();
  const before = key('posts', 'first', collections);
  collections.posts.push(entry('new')); collections.postsEn.push(entry('new-en', { sourceArticle: 'new' }));
  assert.equal(key('posts', 'first', collections), before);
  collections.posts.find(item => item.id === 'second').body += ' corrected';
  assert.equal(key('posts', 'first', collections), before);
  collections.posts.pop(); collections.postsEn.pop();
  assert.equal(key('posts', 'first', collections), before);
});

test('body and frontmatter edits invalidate without relying on an updated timestamp', () => {
  const collections = fixture(); const before = key('posts', 'first', collections);
  collections.posts[0].body += ' corrected';
  assert.notEqual(key('posts', 'first', collections), before);
  collections.posts[0].body = 'Body of first'; collections.posts[0].data.title = 'Corrected title';
  assert.notEqual(key('posts', 'first', collections), before);
});

test('translation addition, hiding, removal and source revision update the affected counterpart', () => {
  const collections = fixture(); collections.postsEn.shift();
  const absent = key('posts', 'first', collections);
  collections.postsEn.push(entry('first-en', { sourceArticle: 'first' }));
  const available = key('posts', 'first', collections); assert.notEqual(available, absent);
  collections.postsEn.at(-1).data.draft = true;
  assert.equal(key('posts', 'first', collections), absent);
  collections.postsEn.at(-1).data.draft = false;
  const translated = key('postsEn', 'first-en', collections);
  collections.posts[0].data.updatedDate = new Date('2026-11-04T10:00:00Z');
  assert.notEqual(key('postsEn', 'first-en', collections), translated);
  collections.posts.shift();
  assert.notEqual(key('postsEn', 'first-en', collections), translated);
});

test('only selected reading titles invalidate a page, including removed targets', () => {
  const collections = fixture(); collections.posts.push(entry('third'));
  const config = { ...emptyConfig, suggestions: (id, language) => id === 'first' && language === 'fr' ? [{ id: 'second', href: '/posts/second/' }] : [] };
  const before = key('posts', 'first', collections, config);
  collections.posts[2].data.title = 'Unrelated title';
  assert.equal(key('posts', 'first', collections, config), before);
  collections.posts[1].data.title = 'Changed suggested title';
  assert.notEqual(key('posts', 'first', collections, config), before);
  collections.posts[1].data.draft = true;
  assert.notEqual(key('posts', 'first', collections, config), before);
});

test('English curated guides and dossier neighbours are content dependencies', () => {
  const collections = fixture(); collections.guidesEn.push(entry('guide-en'));
  const config = { ...emptyConfig, paths: [{ id: 'dossier', analysisIds: ['first-en', 'second-en'], guideIds: [] }], englishLinks: [{ from: '/en/analysis/first-en/', to: '/en/guides/guide-en/' }] };
  const before = key('postsEn', 'first-en', collections, config);
  collections.guidesEn[0].data.title = 'Guide title changed';
  assert.notEqual(key('postsEn', 'first-en', collections, config), before);
  const withGuide = key('postsEn', 'first-en', collections, config);
  collections.postsEn[1].data.title = 'Neighbour title changed';
  assert.notEqual(key('postsEn', 'first-en', collections, config), withGuide);
});

test('French dossier mapping follows the linked source article', () => {
  const collections = fixture(); collections.posts.push(entry('third'));
  const config = { ...emptyConfig, paths: [{ id: 'dossier', analysisIds: ['first-en', 'second-en'], guideIds: [] }], frenchDossiers: [{ id: 'dossier' }] };
  const before = key('posts', 'first', collections, config);
  collections.postsEn[1].data.sourceArticle = 'third';
  assert.notEqual(key('posts', 'first', collections, config), before);
});

test('cache time covers citation calendar dates and exact elapsed freshness days', () => {
  const date = new Date('2026-11-03T13:00:00Z');
  const before = new Date('2026-11-04T12:59:59Z'), after = new Date('2026-11-04T13:00:00Z');
  assert.notDeepEqual(buildDateKey([date], before), buildDateKey([date], after));
  assert.notDeepEqual(buildDateKey([], new Date('2026-11-04T22:59:59Z')), buildDateKey([], new Date('2026-11-04T23:00:00Z')));
  assert.deepEqual(buildDateKey([date], new Date('2026-11-04T14:00:00Z')), buildDateKey([date], new Date('2026-11-04T15:00:00Z')));
});

test('glossary entries, related values and translation existence are keyed', () => {
  const term = { slug: 'fob', title: 'FOB' }, related = { english: false, related: [{ slug: 'ttf', title: 'TTF' }] };
  const before = glossaryCacheKey(term, related, undefined, now);
  assert.notEqual(glossaryCacheKey(term, { ...related, english: true }, undefined, now), before);
  assert.notEqual(glossaryCacheKey(term, { ...related, related: [] }, undefined, now), before);
});

test('one validated environment timestamp drives all server-rendered dates', () => {
  const module = new URL('../src/lib/build-clock.mjs', import.meta.url).href;
  const result = spawnSync(process.execPath, ['--input-type=module', '-e', `import {buildDate} from ${JSON.stringify(module)}; console.log(buildDate().toISOString());`], { encoding: 'utf8', env: { ...process.env, L0G_BUILD_TIMESTAMP: '2026-11-04T12:00:00Z' } });
  assert.equal(result.status, 0, result.stderr); assert.equal(result.stdout.trim(), now.toISOString());
  const invalid = spawnSync(process.execPath, ['--input-type=module', '-e', `import ${JSON.stringify(module)};`], { encoding: 'utf8', env: { ...process.env, L0G_BUILD_TIMESTAMP: 'invalid' } });
  assert.notEqual(invalid.status, 0); assert.match(invalid.stderr, /Invalid L0G_BUILD_TIMESTAMP/);
});

test('static MDX and local SVG component trees qualify; runtime inputs rerender', t => {
  const root = mkdtempSync(join(tmpdir(), 'l0g-entry-eligibility-')); t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, 'src'));
  const write = (name, content) => writeFileSync(join(root, 'src', name), content);
  const eligible = name => createStaticEntryEligibility(root)({ filePath: `src/${name}` });
  write('safe.md', '# Article'); assert.equal(eligible('safe.md'), true);
  write('graph.svg', '<svg viewBox="0 0 100 100"/>');
  write('Figure.astro', '---\nimport graph from "./graph.svg?raw";\n---\n<Fragment set:html={graph}/>');
  write('safe.mdx', 'import Figure from "./Figure.astro";\n# Article\n<Figure/>');
  assert.equal(eligible('safe.mdx'), true);
  for (const source of ['import fs from "node:fs";\nfs.readFileSync("public/risk.json")', 'fetch("https://example.org/")', 'new Date()', 'Date.now()', 'Date["now"]()', 'const Clock = Date; new Clock()', 'const {env} = import.meta; env.PUBLIC_STATUS', 'import /* comment; */ { readFileSync } from "node:fs"; readFileSync("public/risk.json", "utf8")', 'Math.random()', 'process.env.VALUE', 'getCollection("posts")', 'import("./data.mjs")', 'import value from "some-package";', 'performance.now()', 'global.value', 'globalThis.value', 'Reflect.get(globalThis, "Date")', 'new Intl.DateTimeFormat().format()']) {
    write('Figure.astro', `---\n${source}\n---\n<p>figure</p>`); assert.equal(eligible('safe.mdx'), false, source);
  }
  write('Figure.astro', '---\nimport data from "./missing.mjs";\n---'); assert.equal(eligible('safe.mdx'), false);
});

test('MDX runtime aliases and commented imports opt out rather than being hidden by parsing', t => {
  const root = mkdtempSync(join(tmpdir(), 'l0g-mdx-runtime-')); t.after(() => rmSync(root, { recursive: true, force: true }));
  const samples = [
    'export const Clock = Date;\n\n{new Clock().toISOString()}',
    'export const {env} = import.meta;\n\n{env.PUBLIC_STATUS}',
    'import /* comment; */ { readFileSync } from "node:fs";\n\n{readFileSync("public/risk.json", "utf8")}',
  ];
  for (const source of samples) {
    writeFileSync(join(root, 'article.mdx'), source);
    assert.equal(createStaticEntryEligibility(root)({ filePath: 'article.mdx' }), false, source);
  }
  writeFileSync(join(root, 'figure.svg'), '<svg viewBox="0 0 10 10"/>');
  writeFileSync(join(root, 'article.mdx'), 'import /* comment; */ graph from "./figure.svg?raw";\n\n<div>{graph}</div>');
  assert.equal(createStaticEntryEligibility(root)({ filePath: 'article.mdx' }), true);
});

test('entry eligibility rejects escaped paths, symlinks and missing file identity', t => {
  const root = mkdtempSync(join(tmpdir(), 'l0g-entry-eligibility-')); t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, 'src')); writeFileSync(join(root, 'source.mdx'), '# safe');
  symlinkSync(join(root, 'source.mdx'), join(root, 'src', 'link.mdx'));
  const eligible = createStaticEntryEligibility(root);
  assert.equal(eligible({ filePath: 'src/link.mdx' }), false);
  assert.equal(eligible({ filePath: '../outside.md' }), false);
  assert.equal(eligible({}), false);
});

test('an unsafe cycle cannot leave a reusable intermediate dependency', t => {
  const root = mkdtempSync(join(tmpdir(), 'l0g-entry-cycle-')); t.after(() => rmSync(root, { recursive: true, force: true }));
  writeFileSync(join(root, 'a.mjs'), 'import b from "./b.mjs"; import fs from "node:fs"; export default b;');
  writeFileSync(join(root, 'b.mjs'), 'import a from "./a.mjs"; export default a;');
  writeFileSync(join(root, 'first.mdx'), 'import a from "./a.mjs";\n# First');
  writeFileSync(join(root, 'second.mdx'), 'import b from "./b.mjs";\n# Second');
  const eligible = createStaticEntryEligibility(root);
  assert.equal(eligible({ filePath: 'first.mdx' }), false);
  assert.equal(eligible({ filePath: 'second.mdx' }), false);
});

test('static page routes remain unkeyed and article routes opt in explicitly', () => {
  const root = new URL('../', import.meta.url);
  for (const path of ['src/pages/posts/[...slug].astro', 'src/pages/en/analysis/[...slug].astro', 'src/pages/guides/[...slug].astro', 'src/pages/en/guides/[...slug].astro']) {
    assert.match(readFileSync(new URL(path, root), 'utf8'), /cacheKey: cacheKey\(/u);
  }
  for (const path of ['src/pages/[...page].astro', 'src/pages/en/index.astro', 'src/pages/en/asia/index.astro']) {
    assert.doesNotMatch(readFileSync(new URL(path, root), 'utf8'), /cacheKey\s*:/u);
  }
});
