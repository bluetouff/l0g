import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { XMLValidator } from 'fast-xml-parser';
import { glossaryEntries } from '../src/config/glossary.ts';
import { glossaryAtlasEn } from '../src/config/glossary-atlas-en.ts';

const articles = [
  '../src/content/posts/aides-entreprises-211-milliards-chiffre-trompeur.md',
  '../src/content/posts-en/france-211-billion-business-aid-misleading-figure.md',
].map((path) => readFileSync(new URL(path, import.meta.url), 'utf8'));
const attr = (tag, name) => Number(tag.match(new RegExp('\\b' + name + '="([^"]+)"'))?.[1]);

test('Business-aid publication preserves dates, bilingual linkage, sources and passive content', () => {
  const dates = articles.map((s) => s.match(/^pubDate: '([^']+)'$/m)?.[1]);
  assert.equal(dates[0], dates[1]);
  assert.match(dates[0], /^2026-09-10T\d{2}:\d{2}:\d{2}\+02:00$/);
  assert.equal(articles[1].match(/^sourceUpdatedDate: '([^']+)'$/m)?.[1], dates[0]);
  assert.match(articles[1], /^sourceArticle: aides-entreprises-211-milliards-chiffre-trompeur$/m);
  for (const source of articles) {
    assert.match(source, /^ogImage: \/illustrations\/news\/aides-entreprises-211-milliards-v1.jpg$/m);
    assert.match(source, /^seoTitle: '.+ \| l0g'$/m);
    assert.doesNotMatch(source, /<\s*(?:script|iframe|object|embed|foreignObject)\b|\bon\w+\s*=|javascript:|@import|url\(|—/i);
    const ids = [...source.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
    assert.equal(new Set(ids).size, ids.length);
    for (const [, id] of source.matchAll(/href="#([^"]+)"/g)) assert(ids.includes(id), id);
    assert.equal((source.match(/<li id="aid26-(?:fr|en)-s\d+">/g) ?? []).length, 13);
    assert.match(source, /2019/);
    assert.match(source, /2022/);
    assert.match(source, /hypoth[ée]ti(?:que|cal)|fictif/i);
    const headings = source.match(/^#{1,3} .+$/gm).join('\n');
    assert.doesNotMatch(headings, /[,;:].*\b(?:pas|not)\b|n’est pas|is not/i);
    assert.doesNotMatch(source, /Changement de périmètre, pas|Coverage change, not|présentation mensongère/);
  }
});

test('Business-aid SVGs use compact dark canvases and padded internal panels', () => {
  for (const source of articles) {
    assert.doesNotMatch(source, /overflow\s*:\s*hidden/);
    assert.match(source, /max-width:420px/);
    const svgs = source.match(/<svg\b[\s\S]*?<\/svg>/g) ?? [];
    assert.equal(svgs.length, 3);
    for (const svg of svgs) {
      assert.equal(XMLValidator.validate(svg), true);
      assert.match(svg, /viewBox="0 0 480 620"/);
      assert.match(svg, /width:100%;height:auto;background:#0b0d10/);
      assert.doesNotMatch(svg, /(?:href|src)=|<image\b|<use\b|<animate\b|<set\b|clipPath|mask\b/i);
      const panels = [...svg.matchAll(/<rect\b[^>]*data-panel="[^"]+"[^>]*\/>/g)].map(([tag]) => ({
        x: attr(tag, 'x'), y: attr(tag, 'y'), width: attr(tag, 'width'), height: attr(tag, 'height'),
      }));
      for (const [, tag, text] of svg.matchAll(/(<text\b[^>]*>)([^<]*)<\/text>/g)) {
        const x = attr(tag, 'x'); const y = attr(tag, 'y'); const size = attr(tag, 'font-size');
        assert.ok(x >= 24 && y - size >= 10 && y + size * 0.25 <= 614, text);
        for (const p of panels.filter((p) => x >= p.x && x <= p.x + p.width && y >= p.y && y <= p.y + p.height)) {
          assert.ok(x >= p.x + 16 && y - size >= p.y + 2 && y + size * 0.25 <= p.y + p.height - 2, text);
          assert.ok(x + [...text.replaceAll('&amp;', '&')].length * size * 0.62 <= p.x + p.width - 16, text);
        }
      }
    }
  }
});

test('Business-aid arithmetic and hypothetical interest bars retain their stated scope', () => {
  const broad = 41 + 88 + 75 + 7;
  const taxExclusions = 88 - 26;
  assert.equal(broad, 211);
  assert.equal(broad - 41 - taxExclusions, 108);
  const benefit = 100 * (0.05 - 0.03) / 1.05;
  assert.equal(benefit.toFixed(2), '1.90');
  for (const source of articles) {
    assert.match(source, /211 − 41 − 62 = 108/);
    assert.match(source, /1[,.]9047619/);
    const [, loan] = source.match(/<svg\b[\s\S]*?<\/svg>/g);
    const bars = [...loan.matchAll(/<rect\b[^>]*data-rate="([^"]+)"[^>]*\/>/g)];
    assert.equal(bars.length, 2);
    for (const [tag, rate] of bars) {
      assert.equal(attr(tag, 'x'), 44);
      assert.equal(attr(tag, 'width'), Number(rate) * 60);
    }
  }
});

test('Business-aid glossary definitions are bilingual and independently source-linked', () => {
  for (const entries of [glossaryEntries, glossaryAtlasEn]) {
    for (const slug of ['equivalent-subvention', 'depense-fiscale']) {
      const entry = entries.find((e) => e.slug === slug);
      assert(entry, slug);
      assert(entry.atlas.sources.length > 0, slug);
      assert(entry.atlas.sources.every((s) => /^https:\/\/www(?:2)?\.(?:strategie-plan\.gouv\.fr|assemblee-nationale\.fr)\//.test(s.href)), slug);
    }
  }
});
