import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { XMLValidator } from 'fast-xml-parser';
import { glossaryEntries, glossaryUpdatedIso } from '../src/config/glossary.ts';
import { glossaryAtlasEn } from '../src/config/glossary-atlas-en.ts';

const articles = [
  '../src/content/posts/soufre-crise-golfe-engrais-nickel.md',
  '../src/content/posts-en/sulfur-gulf-crisis-fertilizers-nickel.md',
].map((path) => readFileSync(new URL(path, import.meta.url), 'utf8'));
const attr = (tag, name) => Number(tag.match(new RegExp('\\b' + name + '="([^"]+)"'))?.[1]);

test('Sulfur publication retains bilingual scope, dates and passive markup', () => {
  const dates = articles.map((s) => s.match(/^pubDate: '([^']+)'$/m)?.[1]);
  assert.equal(dates[0], dates[1]);
  assert.match(dates[0], /^2026-09-12T\d{2}:\d{2}:\d{2}\+02:00$/);
  assert.equal(articles[1].match(/^sourceUpdatedDate: '([^']+)'$/m)?.[1], dates[0]);
  assert.match(articles[1], /^sourceArticle: soufre-crise-golfe-engrais-nickel$/m);
  for (const source of articles) {
    assert.equal(source.match(/^updatedDate: '([^']+)'$/m)?.[1], dates[0]);
    assert.match(source, /^ogImage: \/illustrations\/news\/soufre-golfe-v1.jpg$/m);
    assert.match(source, /^seoTitle: '.+ \| l0g'$/m);
    assert.doesNotMatch(source, /<\s*(?:script|iframe|object|embed|foreignObject)\b|\bon\w+\s*=|javascript:|@import|url\(|—/i);
    const ids = [...source.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
    assert.equal(new Set(ids).size, ids.length);
    for (const number of [/522/, /705/, /270/, /119[ ,]603/, /56/, /0[,.]41/, /0[,.]39/, /2[,.]84/]) assert.match(source, number);
    assert.match(source, /U.S. Gulf Coast refiners|raffineurs de la côte américaine/);
    assert.match(source, /trois sources anonymes|three unnamed sources/);
    assert.match(source, /taux de marche de septembre|September operating rates/);
    for (const slug of ['hpal', 'mhp', 'cfr', 'c1']) assert.match(source, new RegExp('/(?:en/glossary|glossaire)/' + slug + '/'));
    const headings = source.match(/^#{1,3} .+$/gm).join('\n');
    assert.doesNotMatch(headings, /[,;:].*\b(?:pas|not)\b|n’est pas|is not|ne .*pas|does not|would not|need not|cannot/i);
  }
});

test('Sulfur SVGs remain dark, compact and inside padded panels', () => {
  for (const source of articles) {
    assert.doesNotMatch(source, /overflow\s*:\s*hidden/);
    assert.match(source, /max-width:420px/);
    assert(source.includes('figcaption strong{color:#f5f5f7}'));
    assert(source.includes('.prose figure.sulfur-figure figcaption a{color:#5eead4}'));
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
      const lines = [];
      for (const [, tag, text] of svg.matchAll(/(<text\b[^>]*>)([^<]*)<\/text>/g)) {
        const x = attr(tag, 'x'); const y = attr(tag, 'y'); const size = attr(tag, 'font-size');
        const width = [...text.replaceAll('&amp;', '&')].length * size * 0.62;
        const anchor = tag.match(/text-anchor="([^"]+)"/)?.[1];
        const left = x - (anchor === 'end' ? width : anchor === 'middle' ? width / 2 : 0);
        const right = left + width;
        assert.ok(left >= 0 && right <= 480 && y - size >= 10 && y + size * 0.25 <= 620, text);
        for (const p of panels.filter((p) => x >= p.x && x <= p.x + p.width && y >= p.y && y <= p.y + p.height)) {
          assert.ok(left >= p.x + 16 && right <= p.x + p.width - 4 && y - size >= p.y + 2 && y + size * 0.25 <= p.y + p.height - 2, text);
        }
        for (const other of lines.filter((line) => Math.abs(line.y - y) < Math.min(line.size, size))) {
          assert.ok(right <= other.left - 8 || left >= other.right + 8, text + ' overlaps ' + other.text);
        }
        lines.push({ left, right, y, size, text });
      }
    }
  }
});


test('Sulfur calculations and company reporting retain their denominators', () => {
  assert.equal((4 / 10) * 525, 210);
  assert.equal((4 / 10) * 1200, 480);
  assert.equal(480 - 210, 270);
  assert.equal((41 - 39) / 100, 0.02);
  assert.equal((146 + 69 + 41 + 24 + 8 - 39 + 35) / 100, 2.84);
  for (const source of articles) {
    const svgs = source.match(/<svg\b[\s\S]*?<\/svg>/g);
    assert.match(svgs[0], /sans proportion|no volume shares/);
    assert.match(svgs[1], /long ton/);
    assert.match(svgs[1], /T4|Q4/);
    assert.match(svgs[2], /payable/);
    assert.match(svgs[2], /produite|produced/);
    assert.match(svgs[2], /2,84|2\.84/);
    assert.match(svgs[2], /non.IFRS/);
  }
});

test('Sulfur technical terms remain source-backed in French and English', () => {
  assert.ok(glossaryUpdatedIso >= '2026-09-12');
  for (const entries of [glossaryEntries, glossaryAtlasEn]) {
    for (const slug of ['hpal', 'mhp', 'cfr', 'c1']) {
      const entry = entries.find((e) => e.slug === slug);
      assert(entry);
      assert.ok(entry.atlas.sources.length);
      assert.match(entry.guide, /soufre-crise|sulfur-gulf/);
    }
  }
});
