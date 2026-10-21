import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { access, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import test from 'node:test';
import { OG, ogCard, renderOgPng } from './og-kit.mjs';

const runFile = promisify(execFile);
const generator = fileURLToPath(new URL('./og-generate.mjs', import.meta.url));
const published = '2026-10-21T12:00:00Z';
const digest = bytes => createHash('sha256').update(bytes).digest('hex');

async function fixture(t) {
  const directory = await mkdtemp(join(tmpdir(), 'l0g-english-content-og-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  for (const collection of ['posts', 'posts-en', 'guides-en']) {
    await mkdir(join(directory, 'src/content', collection), { recursive: true });
  }
  return directory;
}

async function article(directory, collection, slug, title, image) {
  await writeFile(join(directory, 'src/content', collection, `${slug}.md`), [
    '---', `title: "${title}"`, `pubDate: ${published}`,
    ...(image ? [`ogImage: "${image}"`] : []), '---', 'Fixture.',
  ].join('\n'));
}

async function generate(directory, collection, lang, out) {
  const env = { ...process.env, POSTS_DIR: `src/content/${collection}`, OG_LANG: lang, L0G_OG_CACHE_DIR: '' };
  delete env.OUT_DIR;
  if (out) env.OUT_DIR = out;
  await runFile(process.execPath, [generator], { cwd: directory, env, timeout: 30_000 });
}

test('English generation has a separate namespace and cannot overwrite a French card with the same slug', async (t) => {
  const directory = await fixture(t);
  await article(directory, 'posts', 'shared-slug', 'Le financement du risque');
  await article(directory, 'posts-en', 'shared-slug', 'Financing risk');
  await generate(directory, 'posts', 'fr');
  const frenchPath = join(directory, 'public/og/shared-slug.png');
  const frenchBefore = await readFile(frenchPath);
  const expectedFrench = await renderOgPng(ogCard({
    title: 'Le financement du risque',
    subtitle: 'Analyse l0g : lecture critique, sources citées, données publiques.',
    eyebrow: 'analyse', command: 'cat article.md',
    dateLabel: new Date(published).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
    accent: OG.rose, chips: ['lecture datée', 'sources citées', 'zéro tracker'],
  }), { cacheDir: null });
  assert.equal(digest(frenchBefore), digest(expectedFrench), 'the French card must retain its French title, labels and date');
  await generate(directory, 'posts-en', 'en');
  const english = await readFile(join(directory, 'public/og/en/shared-slug.png'));
  assert.equal(digest(await readFile(frenchPath)), digest(frenchBefore));
  assert.notEqual(digest(english), digest(frenchBefore));
  const expected = await renderOgPng(ogCard({
    title: 'Financing risk',
    subtitle: 'l0g analysis: critical reading, cited sources, public data.',
    eyebrow: 'analysis', command: 'cat article.md',
    dateLabel: new Date(published).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    accent: OG.rose, chips: ['dated reading', 'cited sources', 'zero tracker'],
  }), { cacheDir: null });
  assert.equal(digest(english), digest(expected), 'all visible labels and the date must be rendered in English');
});

test('English guide cards keep native English labels and manual artwork takes precedence', async (t) => {
  const directory = await fixture(t);
  await article(directory, 'guides-en', 'liquidity', 'Reading liquidity');
  await article(directory, 'guides-en', 'manual', 'Manual artwork', '/illustrations/manual-v1.jpg');
  await generate(directory, 'guides-en', 'en');
  const actual = await readFile(join(directory, 'public/og/en/liquidity.png'));
  const expected = await renderOgPng(ogCard({
    title: 'Reading liquidity',
    subtitle: 'l0g reference guide: durable concept, primary sources, dated revision.',
    eyebrow: 'reference guide', command: 'cat guide.md',
    dateLabel: new Date(published).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    accent: OG.teal, chips: ['dated revision', 'primary sources', 'zero tracker'],
  }), { cacheDir: null });
  assert.equal(digest(actual), digest(expected));
  await assert.rejects(access(join(directory, 'public/og/en/manual.png')), { code: 'ENOENT' });
});

test('an explicit output directory remains supported for English generation', async (t) => {
  const directory = await fixture(t);
  await article(directory, 'posts-en', 'custom', 'Custom directory');
  await generate(directory, 'posts-en', 'en', 'custom-output');
  await access(join(directory, 'custom-output/custom.png'));
  await assert.rejects(access(join(directory, 'public/og/en/custom.png')), { code: 'ENOENT' });
});

test('YAML quoting and multiline titles render their decoded text without escape characters', async (t) => {
  const directory = await fixture(t);
  const cases = [
    ['quoted', String.raw`title: "\"Quoted\" risks: a guide"`, '"Quoted" risks: a guide'],
    ['apostrophe', "title: 'An investor''s guide to risk'", "An investor's guide to risk"],
    ['multiline', 'title: >-\n  Capital flows and\n  the financing of risk', 'Capital flows and the financing of risk'],
  ];
  for (const [slug, yaml] of cases) {
    await writeFile(join(directory, 'src/content/posts-en', `${slug}.md`), `---\n${yaml}\npubDate: ${published}\n---\nFixture.\n`);
  }
  await generate(directory, 'posts-en', 'en');
  for (const [slug, , title] of cases) {
    const actual = await readFile(join(directory, `public/og/en/${slug}.png`));
    const expected = await renderOgPng(ogCard({
      title,
      subtitle: 'l0g analysis: critical reading, cited sources, public data.',
      eyebrow: 'analysis', command: 'cat article.md',
      dateLabel: new Date(published).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      accent: OG.rose, chips: ['dated reading', 'cited sources', 'zero tracker'],
    }), { cacheDir: null });
    assert.equal(digest(actual), digest(expected), `${slug} must render its native YAML text`);
  }
});

test('English article, guide and Asia imagery consistently preserve overrides before using English generated cards', async () => {
  const pages = [
    ['src/pages/en/analysis/[...slug].astro', 'post'],
    ['src/pages/en/guides/[...slug].astro', 'guide'],
    ['src/pages/en/asia/index.astro', 'lead'],
  ];
  for (const [path, item] of pages) {
    const source = await readFile(new URL(`../${path}`, import.meta.url), 'utf8');
    assert.ok(source.includes(`${item}.data.ogImage ?? \`/og/en/\${${item}.id}.png\``), `${path} must preserve the manual override`);
    assert.ok(!source.includes('`/og/${'), `${path} must never use the shared French namespace`);
  }
});

test('English analysis and guide slugs cannot share an automatically generated image path', async () => {
  async function generatedSlugs(collection) {
    const directory = new URL(`../src/content/${collection}/`, import.meta.url);
    const slugs = [];
    for (const file of await readdir(directory)) {
      if (!/\.mdx?$/.test(file)) continue;
      const source = await readFile(new URL(file, directory), 'utf8');
      const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
      if (!/^ogImage:\s*\S/m.test(frontmatter)) slugs.push(file.replace(/\.mdx?$/, ''));
    }
    return slugs;
  }
  const articles = new Set(await generatedSlugs('posts-en'));
  assert.deepEqual((await generatedSlugs('guides-en')).filter(slug => articles.has(slug)), []);
});
