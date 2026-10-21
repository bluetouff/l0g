import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import test from 'node:test';
import { getLatestEnglishEpub } from '../src/lib/latest-english-epub.mjs';

const ROOT = resolve(new URL('..', import.meta.url).pathname);
const now = new Date('2026-10-21T12:00:00Z');
const xml = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');

function fixture(t) {
  const directory = mkdtempSync(join(tmpdir(), 'l0g-latest-epub-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const publicDirectory = join(directory, 'public');
  const pagesDirectory = join(directory, 'pages');
  mkdirSync(join(publicDirectory, 'publications'), { recursive: true });
  mkdirSync(pagesDirectory);
  return { directory, publicDirectory, pagesDirectory, now };
}

function addBook(f, {
  slug = 'first-book', date = '2026-10-19', language = 'en', modified = '2026-10-19T12:00:00Z',
  source = `https://l0g.fr/en/publications/${slug}/`, cover = true, page = true,
  title = 'A sourced book & its evidence', filename = `${slug}-l0g.epub`,
  opfPath = 'EPUB/content.opf', declaration = '',
} = {}) {
  const stage = join(f.directory, `stage-${slug}`);
  mkdirSync(join(stage, 'META-INF'), { recursive: true });
  mkdirSync(join(stage, 'EPUB'), { recursive: true });
  writeFileSync(join(stage, 'mimetype'), 'application/epub+zip');
  writeFileSync(join(stage, 'META-INF/container.xml'), `<?xml version="1.0"?><container xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="${xml(opfPath)}" media-type="application/oebps-package+xml"/></rootfiles></container>`);
  writeFileSync(join(stage, 'EPUB/content.opf'), `<?xml version="1.0"?>${declaration}<package xmlns="http://www.idpf.org/2007/opf"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title>${xml(title)}</dc:title><dc:language>${xml(language)}</dc:language><dc:date>${xml(date)}</dc:date><dc:description>A sourced investigation.</dc:description><dc:source>${xml(source)}</dc:source><meta property="dcterms:modified">${xml(modified)}</meta></metadata></package>`);
  const archive = join(f.publicDirectory, 'publications', filename);
  execFileSync('zip', ['-q', '-r', archive, 'mimetype', 'META-INF', 'EPUB'], { cwd: stage });
  if (cover) copyFileSync(join(ROOT, 'public/favicon-32x32.png'), join(f.publicDirectory, 'publications', `${slug}-cover.png`));
  if (page) writeFileSync(join(f.pagesDirectory, `${slug}.astro`), '<p>Book landing page</p>');
  return archive;
}

test('a new published English EPUB takes over without registering it on the home page', async (t) => {
  const f = fixture(t);
  addBook(f);
  assert.equal((await getLatestEnglishEpub(f)).slug, 'first-book');
  addBook(f, { slug: 'new-book', date: '2026-10-20', language: 'en-GB', filename: 'a-different-download-name.epub' });
  const latest = await getLatestEnglishEpub(f);
  assert.equal(latest.slug, 'new-book');
  assert.equal(latest.title, 'A sourced book & its evidence');
  assert.equal(latest.epub, '/publications/a-different-download-name.epub');
  assert.equal(latest.width, 32);
  assert.equal(latest.height, 32);
  assert.equal(latest.srcset, '');
});

test('French books, future books and later modifications do not replace the latest English publication', async (t) => {
  const f = fixture(t);
  addBook(f, { slug: 'published' });
  addBook(f, { slug: 'older-revised', date: '2026-10-01', modified: '2026-10-21T10:00:00Z' });
  addBook(f, { slug: 'french', date: '2026-10-21', language: 'fr' });
  addBook(f, { slug: 'future', date: '2026-10-22', cover: false, page: false });
  assert.equal((await getLatestEnglishEpub(f)).slug, 'published');
});

test('a same-day tie is deterministic and independent of archive insertion order', async (t) => {
  const f = fixture(t);
  addBook(f, { slug: 'z-book' });
  addBook(f, { slug: 'a-book' });
  assert.equal((await getLatestEnglishEpub(f)).slug, 'a-book');
});

test('a publication day follows the Paris calendar even before midnight UTC', async (t) => {
  const f = fixture(t);
  f.now = new Date('2026-10-20T22:30:00Z');
  addBook(f, { date: '2026-10-21' });
  assert.equal((await getLatestEnglishEpub(f)).date, '2026-10-21');
});

test('no eligible English publication returns an explicit empty result', async (t) => {
  const f = fixture(t);
  addBook(f, { language: 'fr' });
  assert.equal(await getLatestEnglishEpub(f), null);
});

for (const missing of ['cover', 'page']) {
  test(`a new publication with a missing ${missing} fails instead of featuring an older book`, async (t) => {
    const f = fixture(t);
    addBook(f);
    addBook(f, { slug: 'incomplete', date: '2026-10-20', [missing]: false });
    await assert.rejects(getLatestEnglishEpub(f), /Missing (?:cover|landing page)/);
  });
}

for (const source of [
  'https://l0g.fr.example.test/en/publications/book/',
  'https://reader:password@l0g.fr/en/publications/book/',
  'javascript:alert(1)',
  'https://l0g.fr/en/publications/book/?draft=1',
  'https://l0g.fr/en/analysis/book/',
]) {
  test(`unsafe or non-canonical publication URLs are rejected: ${source}`, async (t) => {
    const f = fixture(t);
    addBook(f, { source });
    await assert.rejects(getLatestEnglishEpub(f), /publication URL/);
  });
}

test('invalid publication dates, archive traversal and DTDs are rejected', async (t) => {
  for (const options of [
    { date: '2026-02-30' },
    { opfPath: '../outside.opf' },
    { opfPath: 'EPUB/*.opf' },
    { declaration: '<!DOCTYPE package [<!ENTITY custom "unexpected">]>' },
  ]) {
    const f = fixture(t);
    addBook(f, options);
    await assert.rejects(getLatestEnglishEpub(f), /Invalid first-publication date|Unsafe metadata entry|Unsupported XML declarations/);
  }
});

test('an unreadable EPUB fails with a bounded metadata error', async (t) => {
  const f = fixture(t);
  writeFileSync(join(f.publicDirectory, 'publications/broken.epub'), 'Not a ZIP archive');
  await assert.rejects(getLatestEnglishEpub(f), /Cannot read EPUB metadata: broken.epub/);
});

test('the actual catalogue produces a complete feature without pinning the home to a particular book', async () => {
  const latest = await getLatestEnglishEpub();
  assert.ok(latest);
  assert.ok(latest.title && latest.description && latest.bytes > 0);
  assert.match(latest.path, /^\/en\/publications\/[a-z0-9-]+\/$/);
  assert.ok(existsSync(join(ROOT, 'public', decodeURIComponent(latest.epub))));
  assert.ok(existsSync(join(ROOT, 'public', latest.cover)));
  assert.ok(latest.width > 0 && latest.height > 0);
  for (const variant of latest.srcset.split(', ').filter(Boolean)) {
    assert.ok(existsSync(join(ROOT, 'public', variant.split(' ')[0])));
  }
});

test('the home features one automatic EPUB card and removes both obsolete promotion blocks', () => {
  const home = readFileSync(join(ROOT, 'src/pages/en/index.astro'), 'utf8');
  assert.match(home, /class="en-hero-rail"[\s\S]*<LatestEnglishEpub \/>[\s\S]*<WatchCard lang="en" \/>/);
  assert.equal((home.match(/<LatestEnglishEpub \/>/g) || []).length, 1);
  assert.doesNotMatch(home, /terminal-card|l0g --english|publication-highlight|<PublicationSpotlight|The Great E-Invoicing Toll: five/);
});
