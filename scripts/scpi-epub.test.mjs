import assert from 'node:assert/strict';
import test from 'node:test';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';
import sharp from 'sharp';
import { scpiEditions } from '../src/config/scpi-publication.mjs';
import { generateScpiEpub, prepareReadingHtml, assertPassiveTree } from './generate-scpi-epub.mjs';
import { renderOilMarkdown } from './generate-oil-epub.mjs';

const ROOT = resolve(new URL('..', import.meta.url).pathname);
const files = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? files(join(dir, e.name)) : [join(dir, e.name)]);
const elements = (tree) => [tree, ...(tree.children ?? []).flatMap(elements)];
const text = (tree) => toText(tree).replace(/\s+/gu, ' ').trim();

test('SCPI editions reject unsupported languages before writing', async () => {
  await assert.rejects(generateScpiEpub('../outside'), /Unsupported/u);
  assert.notEqual(scpiEditions.fr.id, scpiEditions.en.id);
  assert.equal(scpiEditions.fr.title, 'La liquidité fantôme des SCPI');
  const component = readFileSync(join(ROOT, 'src/components/ScpiPublication.astro'), 'utf8');
  assert.match(component, /\.download-action\s*\{[^}]*color:\s*var\(--color-ink\)/u);
});

test('SCPI reader conversion expands boxes and matches exact internal origins', () => {
  const routes = new Map([['/posts/a/', 'ch002.xhtml#article-1']]);
  const value = prepareReadingHtml('<details><summary>Exercice</summary><p>Réponse</p></details><h2>Titre</h2><a href="https://l0g.fr/posts/a/#source">interne</a><a href="https://l0g.fr.example.org/posts/a/">externe</a>', routes, 1);
  assert.doesNotMatch(value.html, /<details|<summary/u);
  assert.match(value.html, /class="reading-box-title"/u);
  const hrefs = elements(fromHtml(value.html, { fragment: true }))
    .filter((node) => node.tagName === 'a')
    .map((node) => node.properties.href);
  assert.deepEqual(hrefs, ['ch002.xhtml#source', 'https://l0g.fr.example.org/posts/a/']);
  assert.equal(value.headings[0].id, 'c1-titre');
});

test('English SCPI chapters define the French vehicle and retain local distinctions', () => {
  for (const chapter of scpiEditions.en.chapters) {
    const source = readFileSync(join(ROOT, 'src/content/posts-en', `${chapter.slug}.md`), 'utf8');
    assert.match(source, /société civile de placement immobilier/iu, chapter.slug);
    assert.match(source, /unlisted/iu, chapter.slug);
    assert.match(source, /sourceArticle: /u);
  }
  const intro = scpiEditions.en.introduction.join(' ');
  assert.match(intro, /Unlike an exchange-traded real estate investment trust/u);
  assert.match(intro, /assurance-vie is a life insurance contract/u);
  const second = readFileSync(join(ROOT, 'src/content/posts-en/french-scpi-resale-prices-liquidity-discounts.md'), 'utf8');
  assert.match(second, /costs and duties needed to acquire an equivalent property portfolio/u);
  const sixth = readFileSync(join(ROOT, 'src/content/posts-en/scpi-life-insurance-banks-contagion.md'), 'utf8');
  assert.match(sixth, /partial or full surrender/u);
  assert.match(sixth, /affected portion of the policy/u);
});

test('SCPI packaging fails closed on active and external resource markup', () => {
  for (const html of [
    '<ScRiPt>alert(1)</ScRiPt>', '<img src="https://example.org/pixel">',
    '<img src="../media/file0.svg" onerror="alert(1)">',
    '<a href="java&#x73;cript:alert(1)">x</a>', '<a href="//example.org">x</a>',
    '<svg><foreignObject><p>x</p></foreignObject></svg>', '<iframe srcdoc="x"></iframe>',
    '<svg><animate attributeName="href" values="x"/></svg>',
    '<a href="https://l0g.fr\\@example.org/">x</a>',
  ]) assert.throws(() => assertPassiveTree(fromHtml(html, { fragment: true })), /EPUB/u, html);
});

for (const [lang, book] of Object.entries(scpiEditions)) {
  const source = join(ROOT, 'src/epub', book.directory);
  const output = join(ROOT, 'public', book.epub);
  const textual = () => files(source).filter((f) => /\.(?:xhtml|xml|opf|ncx|svg|css)$/u.test(f));
  test(`${lang}: SCPI EPUB container exactly packages its source files`, () => {
    const entries = execFileSync('unzip', ['-Z1', output], { encoding: 'utf8' }).trim().split('\n');
    assert.equal(entries[0], 'mimetype');
    assert.equal(execFileSync('unzip', ['-p', output, 'mimetype'], { encoding: 'utf8' }), 'application/epub+zip');
    assert.match(execFileSync('unzip', ['-lv', output], { encoding: 'utf8' }).split('\n').find((line) => /\bmimetype$/u.test(line)), /Stored/u);
    assert.match(execFileSync('unzip', ['-t', output], { encoding: 'utf8' }), /No errors detected/u);
    assert.deepEqual(entries.sort(), files(source).map((f) => relative(source, f)).sort());
    for (const file of files(source)) assert.deepEqual(execFileSync('unzip', ['-p', output, relative(source, file)]), readFileSync(file));
    for (const file of textual().filter((f) => !f.endsWith('.css'))) assert.equal(XMLValidator.validate(readFileSync(file, 'utf8')), true, file);
  });
  test(`${lang}: all six analyses preserve paragraphs, sources, anchors and dark figures`, async () => {
    for (const chapter of book.chapters) {
      const original = readFileSync(join(ROOT, 'src/content', lang === 'fr' ? 'posts' : 'posts-en', `${chapter.slug}.md`), 'utf8');
      const expected = fromHtml(await renderOilMarkdown(original.replace(/^---\n[\s\S]*?\n---\n/u, '').replace(/<svg\b[\s\S]*?<\/svg>/gu, '')), { fragment: true });
      const html = readFileSync(join(source, 'EPUB/text', chapter.chapter), 'utf8');
      const actual = fromHtml(html);
      const prose = text(actual);
      const links = elements(actual).filter((e) => e.tagName === 'a').map((e) => e.properties.href);
      for (const e of elements(expected)) {
        if (['p', 'li', 'td', 'th', 'figcaption', 'summary'].includes(e.tagName) && text(e)) assert.ok(prose.includes(text(e)), `${chapter.slug}: content lost: ${text(e).slice(0, 100)}`);
        if (e.tagName === 'a' && /^https?:/u.test(e.properties.href) && new URL(e.properties.href).origin !== 'https://l0g.fr') assert.ok(links.includes(e.properties.href), `Lost source: ${e.properties.href}`);
        if (e.properties?.id) assert.ok(elements(actual).some((a) => a.properties?.id === e.properties.id), `Lost anchor ${e.properties.id}`);
      }
      assert.equal(elements(actual).filter((e) => e.tagName === 'h1').length, 1);
      assert.equal(elements(actual).filter((e) => e.tagName === 'img' && e.properties.alt).length, 3);
      assert.doesNotMatch(html, /<(?:details|summary|style|svg)\b/u);
    }
    const opfText = readFileSync(join(source, 'EPUB/content.opf'), 'utf8');
    const opf = new XMLParser({ ignoreAttributes: false }).parse(opfText).package;
    assert.equal(opf.metadata['dc:title'], book.title);
    assert.equal(opf.metadata['dc:language'], lang);
    assert.equal(opf.manifest.item.filter((i) => i['@_media-type'] === 'image/svg+xml').length, 18);
    assert.equal(opf.spine.itemref.length, 13);
    for (const f of ['ch001.xhtml', 'ch008.xhtml', 'ch009.xhtml']) assert.ok(statSync(join(source, 'EPUB/text', f)).size > 1500);
    const bonus = readFileSync(join(source, 'EPUB/text/ch008.xhtml'), 'utf8');
    for (const host of ['www.fsb.org', 'www.fca.org.uk', 'www.imf.org', 'www.bankofengland.co.uk', 'www.federalreserve.gov', 'www.amf-france.org', 'www.bis.org']) assert.ok(bonus.includes(host), host);
    assert.match(bonus, lang === 'fr' ? /fonds fermés/u : /closed-end funds/u);
  });
  test(`${lang}: EPUB navigation, fragments and manifest resolve within the book`, () => {
    for (const file of textual().filter((f) => !/\.(?:svg|css)$/u.test(f))) {
      const tree = fromHtml(readFileSync(file, 'utf8'), { fragment: true });
      for (const e of elements(tree)) for (const key of ['href', 'src']) {
        const href = e.properties?.[key];
        if (!href || /^(?:https?:|mailto:)/u.test(href)) continue;
        const [name, fragment] = href.split('#');
        const target = name ? resolve(dirname(file), decodeURI(name)) : file;
        assert.ok(target.startsWith(`${source}/`), `Escaping reference ${href}`);
        assert.ok(existsSync(target), `Missing ${file}: ${href}`);
        if (fragment) assert.ok(readFileSync(target, 'utf8').includes(`id="${decodeURI(fragment)}"`), `Missing fragment ${href}`);
      }
    }
  });
  test(`${lang}: ebook is passive and figures have painted dark backgrounds`, () => {
    for (const file of textual()) {
      const value = readFileSync(file, 'utf8');
      assert.doesNotMatch(value, /<(?:script|iframe|object|embed|foreignObject|form)\b|\son\w+\s*=|javascript:|data:text\/html|@import|\u2014/iu, file);
      assert.doesNotMatch(value, /(?:src|xlink:href)=["'](?:https?:|\/\/|data:)/iu, file);
      if (file.endsWith('.svg')) {
        assert.match(value, /<rect[^>]+fill="#0b0d10"/u);
        assert.doesNotMatch(value, /var\(|<image\b/u);
        assert.match(value, /viewBox="0 0 \d+ \d+"/u);
      }
    }
  });
  test(`${lang}: cover, responsive assets and page metadata are present`, async () => {
    const cover = await sharp(join(ROOT, 'public', book.cover)).metadata();
    assert.equal(cover.width, 1024); assert.equal(cover.height, 1638);
    assert.ok(statSync(join(ROOT, 'public', book.cover)).size < 256_000);
    const social = await sharp(join(ROOT, 'public', book.social)).metadata();
    assert.equal(social.width, 1200); assert.equal(social.height, 630);
    for (const width of [320, 640, 960]) assert.equal((await sharp(join(ROOT, 'public', book.cover.replace('.jpg', `-${width}.webp`))).metadata()).width, width);
    const page = readFileSync(join(ROOT, 'src/pages', lang === 'fr' ? 'publications' : 'en/publications', `${book.directory}.astro`), 'utf8');
    assert.match(page, /'@type': 'Book'/u);
    assert.match(page, /createHash\('sha256'\)/u);
    assert.match(page, /serializeInlineScriptData\(jsonLd\)/u);
    assert.match(page, /seoTitle=/u); assert.match(page, /ogTitle=/u);
    assert.match(page, /hreflang: 'fr'/u); assert.match(page, /hreflang: 'en'/u);
    const catalogue = readFileSync(join(ROOT, 'src/pages', lang === 'fr' ? 'publications/index.astro' : 'en/publications/index.astro'), 'utf8');
    assert.match(catalogue, /publication="scpi"/u);
    assert.match(page, /ogImage=\{book.social\}/u);
  });
}
