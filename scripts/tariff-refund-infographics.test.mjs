import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { XMLValidator } from 'fast-xml-parser';
import { glossaryEntries, glossaryUpdatedIso } from '../src/config/glossary.ts';
import { glossaryAtlasEn } from '../src/config/glossary-atlas-en.ts';

const articles = [
  '../src/content/posts/droits-douane-milliards-rembourses-consommateurs.md',
  '../src/content/posts-en/tariff-refunds-who-keeps-the-money.md',
].map((path) => readFileSync(new URL(path, import.meta.url), 'utf8'));
const attr = (tag, name) => Number(tag.match(new RegExp('\\b' + name + '="([^"]+)"'))?.[1]);

test('Tariff refund publication retains bilingual scope, dates and passive markup', () => {
  const dates = articles.map((s) => s.match(/^pubDate: '([^']+)'$/m)?.[1]);
  assert.equal(dates[0], dates[1]);
  assert.match(dates[0], /^2026-09-12T\d{2}:\d{2}:\d{2}\+02:00$/);
  assert.equal(articles[1].match(/^sourceUpdatedDate: '([^']+)'$/m)?.[1], dates[0]);
  assert.match(articles[1], /^sourceArticle: droits-douane-milliards-rembourses-consommateurs$/m);
  for (const source of articles) {
    assert.equal(source.match(/^updatedDate: '([^']+)'$/m)?.[1], dates[0]);
    assert.match(source, /^ogImage: \/illustrations\/news\/remboursements-douane-v1.jpg$/m);
    assert.match(source, /^seoTitle: '.+ \| l0g'$/m);
    assert.doesNotMatch(source, /<\s*(?:script|iframe|object|embed|foreignObject)\b|\bon\w+\s*=|javascript:|@import|url\(|—/i);
    const ids = [...source.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
    assert.equal(new Set(ids).size, ids.length);
    assert.match(source, /fictif|hypothetical/i);
    assert.match(source, /369/);
    assert.match(source, /749/);
    assert.match(source, /800/);
    assert.match(source, /7,5|7\.5/);
    assert.match(source, /2,9|2\.9/);
    assert.match(source, /17,4|17\.4/);
    assert.match(source, /2,70|2\.70/);
    assert.match(source, /1,31|1\.31/);
    assert.match(source, /29 juin 2026|June 29, 2026/);
    assert.match(source, /17 juin|June 17/);
    assert.match(source, /allégations|allegations/);
    assert.match(source, /incidence-fiscale/);
    const headings = source.match(/^#{1,3} .+$/gm).join('\n');
    assert.doesNotMatch(headings, /[,;:].*\b(?:pas|not)\b|n’est pas|is not|ne .*pas|does not|would not|need not|cannot/i);
  }
});

test('Tariff refund SVGs remain dark, compact and inside padded panels', () => {
  for (const source of articles) {
    assert.doesNotMatch(source, /overflow\s*:\s*hidden/);
    assert.match(source, /max-width:420px/);
    assert(source.includes('figcaption strong{color:#f5f5f7}'));
    assert(source.includes('.prose figure.refunds-figure figcaption a{color:#5eead4}'));
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


test('Refund arithmetic preserves units and the hypothetical scenario', () => {
  assert.equal(369 + 14 - 22 - 15 - 13, 333);
  for (const passedThrough of [0, 10, 20]) {
    assert.equal(-20 + passedThrough + 20, passedThrough);
    assert.equal(-passedThrough + passedThrough, 0);
  }
  for (const source of articles) {
    const svgs = source.match(/<svg\b[\s\S]*?<\/svg>/g);
    assert.match(svgs[0], /fictif|hypothetical/i);
    for (const value of ['+369', '+14', '−22', '−15', '−13']) assert(svgs[1].includes('>' + value + '</text>'));
    assert.match(svgs[1], /333/);
    assert.match(svgs[1], /avant impôt|before tax/);
    assert.match(svgs[2], /31 mai 2026|May 31, 2026/);
    assert.match(svgs[2], /800/);
    assert.match(svgs[2], /749/);
    assert.doesNotMatch(svgs[2].replace(/<[^>]+>/g, ''), /\b51\b|93[,.]6/);
  }
});

test('IEEPA glossary keeps bilingual scope and the controlling judgment', () => {
  assert.ok(glossaryUpdatedIso >= '2026-09-12');
  for (const entries of [glossaryEntries, glossaryAtlasEn]) {
    const entry = entries.find((e) => e.slug === 'ieepa');
    assert(entry);
    assert.match(entry.def, /20 février 2026|February 20, 2026/);
    assert.equal(entry.atlas.sources[0].href, 'https://www.supremecourt.gov/opinions/25pdf/24-1287_4gcj.pdf');
  }
});
