import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { XMLValidator } from 'fast-xml-parser';
import { glossaryEntries, glossaryUpdatedIso } from '../src/config/glossary.ts';
import { glossaryAtlasEn } from '../src/config/glossary-atlas-en.ts';

const articles = [
  '../src/content/posts/trump-5000-dollars-dividende-promesse-dette.md',
  '../src/content/posts-en/trump-5000-election-dividend-no-surplus.md',
].map((path) => readFileSync(new URL(path, import.meta.url), 'utf8'));
const attr = (tag, name) => Number(tag.match(new RegExp('\\b' + name + '="([^"]+)"'))?.[1]);

test('Dividend publication retains bilingual scope, dates and passive markup', () => {
  const dates = articles.map((s) => s.match(/^pubDate: '([^']+)'$/m)?.[1]);
  assert.equal(dates[0], dates[1]);
  assert.match(dates[0], /^2026-09-11T\d{2}:\d{2}:\d{2}\+02:00$/);
  assert.equal(articles[1].match(/^sourceUpdatedDate: '([^']+)'$/m)?.[1], dates[0]);
  assert.match(articles[1], /^sourceArticle: trump-5000-dollars-dividende-promesse-dette$/m);
  for (const source of articles) {
    assert.equal(source.match(/^updatedDate: '([^']+)'$/m)?.[1], dates[0]);
    assert.match(source, /^ogImage: \/illustrations\/news\/trump-5000-dividende-v1.jpg$/m);
    assert.match(source, /^seoTitle: '.+ \| l0g'$/m);
    assert.doesNotMatch(source, /<\s*(?:script|iframe|object|embed|foreignObject)\b|\bon\w+\s*=|javascript:|@import|url\(|—/i);
    const ids = [...source.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
    assert.equal(new Set(ids).size, ids.length);
    assert.match(source, /préliminaire|preliminary/);
    assert.match(source, /fictif|hypothetical/);
    assert.match(source, /scénario|scenario/);
    assert.match(source, /2025–2034/);
    assert.match(source, /Kentucky/);
    assert.match(source, /718/);
    assert.match(source, /cpi_08122026\.htm/);
    assert.match(source, /61984-MBR\.pdf/);
    const headings = source.match(/^#{1,3} .+$/gm).join('\n');
    assert.doesNotMatch(headings, /[,;:].*\b(?:pas|not)\b|n’est pas|is not|ne .*pas|does not|would not|need not|cannot/i);
  }
});

test('Dividend SVGs remain dark, compact and inside padded panels', () => {
  for (const source of articles) {
    assert.doesNotMatch(source, /overflow\s*:\s*hidden/);
    assert.match(source, /max-width:420px/);
    assert(source.includes('figcaption strong{color:#f5f5f7}'));
    assert(source.includes('.prose figure.t5000-figure figcaption a{color:#5eead4}'));
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


test('Dividend budget chart preserves source units and one zero-based scale', () => {
  assert.equal(6812 - 4845, 1967);
  assert.equal(140 - 100, 40);
  assert.equal(150 - 100, 50);
  assert.equal(1200 * 0.05, 60);
  for (const source of articles) {
    const svgs = source.match(/<svg\b[\s\S]*?<\/svg>/g);
    const bars = [...svgs[1].matchAll(/<rect\b[^>]*data-budget-usd-bn="([^"]+)"[^>]*\/>/g)];
    assert.deepEqual(bars.map(([, value]) => Number(value)), [4845, 6812]);
    for (const [tag, value] of bars) {
      assert.equal(attr(tag, 'x'), 24);
      assert.equal(attr(tag, 'width'), 432 * Number(value) / 8000);
    }
    assert.match(svgs[1], /1[ ,]967/);
    assert.match(svgs[2], /fictif|hypothetical/i);
    for (const value of [100, 140, 150, 40, 50]) assert(svgs[2].includes('>' + value + '</text>'));
  }
});

test('Tax incidence glossary keeps bilingual definitions and primary sources', () => {
  assert.ok(glossaryUpdatedIso >= '2026-09-11');
  for (const entries of [glossaryEntries, glossaryAtlasEn]) {
    const entry = entries.find((e) => e.slug === 'incidence-fiscale');
    assert(entry);
    assert.equal(entry.atlas.sources.length, 2);
    assert.equal(entry.atlas.sources[0].href, 'https://www.law.cornell.edu/cfr/text/19/141.1');
    assert.equal(entry.atlas.sources[1].href, 'https://www.federalreserve.gov/econres/notes/feds-notes/detecting-tariff-effects-on-consumer-prices-in-real-time-part-II-20260408.html');
  }
});
