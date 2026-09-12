import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { XMLValidator } from 'fast-xml-parser';
import { glossaryEntries } from '../src/config/glossary.ts';
import { glossaryAtlasEn } from '../src/config/glossary-atlas-en.ts';

const articles = [
  '../src/content/posts/tungstene-stocks-tresorerie-kennametal.md',
  '../src/content/posts-en/tungsten-inventory-cash-flow-kennametal.md',
].map((path) => readFileSync(new URL(path, import.meta.url), 'utf8'));
const attr = (tag, name) => Number(tag.match(new RegExp('\\b' + name + '="([^"]+)"'))?.[1]);

test('Tungsten publication keeps bilingual dates, sources and passive markup', () => {
  const dates = articles.map((s) => s.match(/^pubDate: '([^']+)'$/m)?.[1]);
  assert.equal(dates[0], dates[1]);
  assert.match(dates[0], /^2026-09-12T\d{2}:\d{2}:\d{2}\+02:00$/);
  assert.equal(articles[1].match(/^sourceUpdatedDate: '([^']+)'$/m)?.[1], dates[0]);
  assert.match(articles[1], /^sourceArticle: tungstene-stocks-tresorerie-kennametal$/m);
  for (const source of articles) {
    assert.equal(source.match(/^updatedDate: '([^']+)'$/m)?.[1], dates[0]);
    assert.match(source, /^ogImage: \/illustrations\/news\/tungstene-kennametal-v1.jpg$/m);
    assert.match(source, /^seoTitle: '.+ \| l0g'$/m);
    assert.doesNotMatch(source, /<\s*(?:script|iframe|object|embed|foreignObject)\b|\bon\w+\s*=|javascript:|@import|url\(|—/i);
    const ids = [...source.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
    assert.equal(new Set(ids).size, ids.length);
    for (const number of [/342[,.]4/, /350[,.]4/, /593[,.]4/, /570[,.]2/, /72[,.]5/, /316/, /830/, /550/, /2[,.]706/]) assert.match(source, number);
    for (const domain of ['www.sec.gov', 'investors.kennametal.com', 'www.usgs.gov', 'mb.cision.com', 'english.mofcom.gov.cn']) assert.ok(source.includes('https://' + domain + '/'));
    assert.match(source, /\/lifo\//);
    assert.match(source, /fictif|hypothetical/);
    const headings = source.match(/^#{1,3} .+$/gm).join('\n');
    assert.doesNotMatch(headings, /[,;:].*\b(?:pas|not)\b|n’est pas|is not|ne .*pas|does not|would not|need not|cannot/i);
  }
});

test('Tungsten SVGs remain dark, compact and inside padded panels', () => {
  for (const source of articles) {
    assert.doesNotMatch(source, /overflow\s*:\s*hidden/);
    assert.match(source, /max-width:480px/);
    assert(source.includes('figcaption strong{color:#f5f5f7}'));
    assert(source.includes('.prose figure.tungsten-figure figcaption a{color:#5eead4}'));
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


test('Tungsten cash reconciliation uses exact reported thousands and consistent scopes', () => {
  // SEC 2026 10-K, p. 37. Consolidated income includes noncontrolling interests.
  const adjustments = [133633, 9522, 34851, 8909, 44686, -3400, 0, 1261, 10648];
  const movements = [-116866, -593396, -102093, 226097, 11006, -7051, -12229];
  const sum = (xs) => xs.reduce((a, b) => a + b, 0);
  assert.equal(sum(adjustments), 240110);
  assert.equal(sum(movements), -594532);
  assert.equal(350414 + sum(adjustments) + sum(movements), -4008);
  assert.equal(350414 - 342389, 8025);
  assert.equal(-4008 - 76905 + 1775, -79138);
  // Note 7: carrying values are balances, not cash-flow inventory changes.
  assert.equal(1469890 - 361440, 1108450);
  assert.equal(644226 - 105989, 538237);
  assert.equal(1108450 - 538237, 570213);
  assert.equal(Math.round((1108450 / 538237 - 1) * 100), 106);
  assert.equal(850 - 20, 830);
  assert.equal(160 - 100, 60);
  assert.equal(160 - 150, 10);
  assert.equal(160 - 2 * 150, -140);
  for (const source of articles) {
    const svgs = source.match(/<svg\b[\s\S]*?<\/svg>/g);
    assert.match(svgs[0], /consolid/);
    assert.match(svgs[1], /350[,.]41/);
    assert.match(svgs[1], /240[,.]11/);
    assert.match(svgs[1], /−593[,.]40/);
    assert.match(svgs[1], /−4[,.]01/);
    assert.match(svgs[2], /34/);
  }
});

test('LIFO is defined and sourced in both glossaries', () => {
  for (const entries of [glossaryEntries, glossaryAtlasEn]) {
    const entry = entries.find((e) => e.slug === 'lifo');
    assert(entry);
    assert.match(entry.atlas.sources[0].href, /^https:\/\/www.sec.gov\/Archives\/edgar\//);
    assert.match(entry.guide, /tungst/);
  }
});
