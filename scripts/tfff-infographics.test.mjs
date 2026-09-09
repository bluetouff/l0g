import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { XMLValidator } from 'fast-xml-parser';
import { glossaryEntries } from '../src/config/glossary.ts';
import { glossaryAtlasEn } from '../src/config/glossary-atlas-en.ts';
import { primaryInstitutionBySlug, editorialSourceDomainTiers } from '../src/config/primary-sources.ts';

const articles = [
  '../src/content/posts/tfff-forets-bresil-fonds-obligations-risques.md',
  '../src/content/posts-en/tfff-brazil-forest-fund-bond-market-risk.md',
].map((path) => readFileSync(new URL(path, import.meta.url), 'utf8'));
const attr = (tag, name) => Number(tag.match(new RegExp(`\\b${name}="([^"]+)"`))?.[1]);

test('TFFF source registry links SEC and World Bank to their verified official hosts', () => {
  for (const [slug, host] of [['sec-edgar', 'investor.gov'], ['world-bank-oecd', 'fiftrustee.worldbank.org']]) {
    const institution = primaryInstitutionBySlug.get(slug);
    const matches = institution.datasets.filter((item) => new URL(item.url).hostname.replace(/^www\./, '') === host);
    assert.equal(matches.length, 1);
    assert(editorialSourceDomainTiers.primary.includes(host));
    assert(!editorialSourceDomainTiers.primary.includes(`${host}.example.org`));
  }
});

test('TFFF publication preserves bilingual timestamp, linkage, sources and local artwork', () => {
  const dates = articles.map((s) => s.match(/^pubDate: '([^']+)'$/m)?.[1]);
  assert.equal(dates[0], dates[1]);
  assert.match(dates[0], /^2026-09-09T\d{2}:\d{2}:\d{2}\+02:00$/);
  assert.equal(articles[1].match(/^sourceUpdatedDate: '([^']+)'$/m)?.[1], dates[0]);
  assert.match(articles[1], /^sourceArticle: tfff-forets-bresil-fonds-obligations-risques$/m);
  for (const source of articles) {
    assert.match(source, /^ogImage: \/illustrations\/news\/tfff-forest-bonds-v1.jpg$/m);
    assert.match(source, /Department for Energy Security and Net Zero/);
    assert.doesNotMatch(source, /reuters\.com|7[,.]3 (?:billion|milliards)|—/);
    assert.doesNotMatch(source, /<\s*(?:script|iframe|object|embed|foreignObject)\b|\bon\w+\s*=|javascript:|@import|url\(/i);
    const ids = [...source.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
    assert.equal(new Set(ids).size, ids.length);
    for (const [, id] of source.matchAll(/href="#([^"]+)"/g)) assert(ids.includes(id));
  }
});

test('TFFF figures keep passive XML, explicit dark canvas and compact responsive geometry', () => {
  for (const source of articles) {
    assert.doesNotMatch(source, /overflow\s*:\s*hidden/);
    assert.match(source, /max-width:420px/);
    const svgs = source.match(/<svg\b[\s\S]*?<\/svg>/g) ?? [];
    assert.equal(svgs.length, 3);
    for (const svg of svgs) {
      assert.equal(XMLValidator.validate(svg), true);
      assert.match(svg, /viewBox="0 0 480 620"/);
      assert.match(svg, /width:100%;height:auto;background:#0b0d10/);
      assert.doesNotMatch(svg, /(?:href|src)=|<image\b|<use\b|<animate\b|<set\b/i);
      assert.ok(620 * 420 / 480 <= 550);
      const panels = [...svg.matchAll(/<rect\b[^>]*data-panel="[^"]+"[^>]*\/>/g)].map(([tag]) => ({
        x: attr(tag, 'x'), y: attr(tag, 'y'), width: attr(tag, 'width'), height: attr(tag, 'height'),
      }));
      for (const [, tag, text] of svg.matchAll(/(<text\b[^>]*>)([^<]*)<\/text>/g)) {
        const x = attr(tag, 'x'); const y = attr(tag, 'y'); const size = attr(tag, 'font-size');
        assert.ok(x >= 24 && y - size >= 10 && y + size * 0.25 <= 614);
        for (const p of panels.filter((p) => x >= p.x && x <= p.x + p.width && y >= p.y && y <= p.y + p.height)) {
          assert.ok(x >= p.x + 16 && y - size >= p.y + 2 && y + size * 0.25 <= p.y + p.height - 2, text);
          assert.ok(x + [...text.replaceAll('&amp;', '&')].length * size * 0.62 <= p.x + p.width - 16, text);
        }
      }
    }
  }
});

test('TFFF hypothetical capital and income calculations preserve common scales', () => {
  assert.equal(25 + 100, 125);
  assert.equal(100 / 25, 4);
  assert.equal(125 / 25, 5);
  assert.deepEqual([0, 0.1, 0.2].map((shock) => 125 * (1 - shock) - 100), [25, 12.5, 0]);
  assert.equal(125 * 0.01, 1.25);
  assert.equal(40 * 0.2 - 25 * 0.2, 3);
  for (const source of articles) {
    const [funding, , stress] = source.match(/<svg\b[\s\S]*?<\/svg>/g);
    const widths = [...funding.matchAll(/<rect\b[^>]*data-part="[^"]+"[^>]*\/>/g)].map(([tag]) => attr(tag, 'width'));
    assert.deepEqual(widths, [432 * 25 / 125, 432 * 100 / 125]);
    const senior = [...stress.matchAll(/<rect\b[^>]*data-senior="[^"]+"[^>]*\/>/g)].map(([tag]) => tag);
    assert.equal(senior.length, 3);
    for (const tag of senior) { assert.equal(attr(tag, 'x'), 24); assert.equal(attr(tag, 'width'), 432 * 100 / 125); }
    const gaps = [...stress.matchAll(/<rect\b[^>]*data-gap="[^"]+"[^>]*\/>/g)].map(([tag]) => tag);
    assert.deepEqual(gaps.map((tag) => attr(tag, 'width')), [432 * 25 / 125, 432 * 12.5 / 125]);
    for (const tag of gaps) assert.equal(attr(tag, 'x'), 24 + 432 * 100 / 125);
    assert.match(stress, /hypothétique|hypothetical/i);
    const scaleLine = stress.match(/<text\b[^>]*>0 ←[^<]*<\/text>/)?.[0];
    assert.ok(attr(scaleLine, 'y') - 447 >= 30, 'Zero-gap label needs space above the common-scale label');
  }
});

test('TFFF glossary explains both entities in French and English with primary sources', () => {
  for (const entries of [glossaryEntries, glossaryAtlasEn]) {
    const entry = entries.find((e) => e.slug === 'tfff');
    assert(entry);
    assert.match(entry.def, /TFIF/);
    assert.match(entry.def, /20\s?%/);
    assert.equal(entry.atlas.sources.length, 2);
    assert(entry.atlas.sources.every((s) => /^https:\/\/(?:tfff\.earth|fiftrustee\.worldbank\.org)\//.test(s.href)));
  }
});
