import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { XMLValidator } from 'fast-xml-parser';
import { glossaryEntries } from '../src/config/glossary.ts';
import { glossaryAtlasEn } from '../src/config/glossary-atlas-en.ts';

const articles = [
  '../src/content/posts/scpi-rendement-dividendes-reserves-revenus.md',
  '../src/content/posts-en/french-scpi-yields-income-dividends-reserves.md',
].map((p) => readFileSync(new URL(p, import.meta.url), 'utf8'));
const attr = (tag, name) => Number(tag.match(new RegExp('\\b' + name + '="([^"]+)"'))?.[1]);

test('SCPI distributions retain bilingual SEO, dated sources and passive content', () => {
  const dates = articles.map((s) => s.match(/^pubDate: '([^']+)'$/m)?.[1]);
  assert.equal(dates[0], dates[1]);
  assert.match(dates[0], /^2026-09-13T\d{2}:\d{2}:\d{2}\+02:00$/);
  assert.equal(articles[1].match(/^sourceUpdatedDate: '([^']+)'$/m)?.[1], dates[0]);
  assert.match(articles[1], /^sourceArticle: scpi-rendement-dividendes-reserves-revenus$/m);
  for (const s of articles) {
    assert.equal(s.match(/^updatedDate: '([^']+)'$/m)?.[1], dates[0]);
    assert.match(s, /^draft: false$/m);
    assert.match(s, /^ogImage: \/illustrations\/news\/scpi-dividendes-reserves-v1.jpg$/m);
    assert.match(s, /^seoTitle: '.+ \| l0g'$/m);
    assert.equal(new Set(['title', 'seoTitle', 'ogTitle'].map((key) => s.match(new RegExp('^' + key + ': (.+)$', 'm'))[1])).size, 3);
    assert.doesNotMatch(s, /<\s*(?:script|iframe|object|embed|foreignObject)\b|\bon\w+\s*=|javascript:|@import|url\(|—|\?t=\d+/i);
    const ids = [...s.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
    assert.equal(new Set(ids).size, ids.length);
    for (const slug of ['scpi', 'taux-de-distribution', 'report-a-nouveau']) assert(s.includes('/' + slug + '/'));
    const headings = s.match(/^#{1,3} .+$/gm).join('\n');
    assert.doesNotMatch(headings, /[,;:].*\b(?:pas|not)\b|n.est pas|is not|are not|ne .*pas|does not|do not/i);
    assert.equal((s.match(/<details class="scpi3-exercise">/g) ?? []).length, 3);
    assert.equal((s.match(/class="scpi3-table" role="region" tabindex="0"/g) ?? []).length, 2);
    assert.equal((s.match(/<li id="scpi3-(?:fr|en)-s\d+"/g) ?? []).length, 9);
  }
});

test('SCPI SVGs preserve margins, zero baselines, exact scales and responsive dark styling', () => {
  const scales = [
    { values: [6.38, 4.56], max: 7 },
    { values: [9.85, 4.95, 0.20], max: 10 },
    { values: [80.95061515, 83.37128948], max: 90 },
  ];
  for (const s of articles) {
    assert.doesNotMatch(s, /overflow\s*:\s*hidden/);
    assert.match(s, /max-width:520px/);
    const svgs = s.match(/<svg\b[\s\S]*?<\/svg>/g) ?? [];
    assert.equal(svgs.length, 3);
    for (const [i, svg] of svgs.entries()) {
      assert.equal(XMLValidator.validate(svg), true);
      assert.match(svg, /width:100%;height:auto;background:#0b0d10/);
      assert.doesNotMatch(svg, /(?:href|src)=|<image\b|<use\b|<animate\b|<set\b|clipPath|mask\b/i);
      const height = Number(svg.match(/viewBox="0 0 520 (\d+)"/)[1]);
      const boxes = [];
      for (const [, tag, value] of svg.matchAll(/(<text\b[^>]*>)([^<]+)<\/text>/g)) {
        const text = value.replaceAll('&#x27;', "'").replaceAll('&amp;', '&');
        const x = attr(tag, 'x'), y = attr(tag, 'y'), size = attr(tag, 'font-size');
        const width = [...text].length * size * 0.62;
        const left = x - (tag.includes('text-anchor="end"') ? width : tag.includes('text-anchor="middle"') ? width / 2 : 0);
        const right = left + width;
        assert(left >= 18 && right <= 502, text + ' crosses a safety margin');
        for (const other of boxes) {
          if (left < other.right && right > other.left) {
            assert(y - other.y >= size + other.size * 0.25 + 4, text + ' crowds ' + other.text);
          }
        }
        boxes.push({ left, right, y, size, text });
      }
      for (const [tag] of svg.matchAll(/<text\b[^>]*>/g)) {
        const x = attr(tag, 'x'), y = attr(tag, 'y'), size = attr(tag, 'font-size');
        assert(x >= 28 && x <= 492);
        assert(y - size >= 10 && y + size * 0.25 <= height - 10);
        assert(size >= 20);
      }
      const bars = [...svg.matchAll(/<rect\b[^>]*data-bar="true"[^>]*\/>/g)].map(([t]) => t);
      assert.equal(bars.length, scales[i].values.length);
      for (const [j, bar] of bars.entries()) {
        assert.equal(attr(bar, 'x'), 28);
        assert.equal(attr(bar, 'width').toFixed(3), (464 * scales[i].values[j] / scales[i].max).toFixed(3));
        assert(attr(bar, 'y') + attr(bar, 'height') < height - 100);
      }
    }
  }
});

test('SCPI numerical claims reconcile without annualising half-year payouts', () => {
  assert.equal((100 * (4.56 / 6.38 - 1)).toFixed(1), '-28.5');
  assert.equal((100 * (126 / 180 - 1)).toFixed(0), '-30');
  assert.equal((100 * 4.56 / 180).toFixed(2), '2.53');
  assert.equal((100 * 6.38 / 180).toFixed(2), '3.54');
  assert.equal((100 * 4.56 / 126).toFixed(2), '3.62');
  assert.equal((5.55 + 4.30).toFixed(2), '9.85');
  assert.equal((1.95 + 3).toFixed(2), '4.95');
  assert.equal((9.85 + 4.95 + 0.20).toFixed(2), '15.00');
  assert.equal((100 * 5.15 / 15).toFixed(1), '34.3');
  assert.equal((100 * (51.3 / 57 - 1)).toFixed(0), '-10');
  // Integer cents preserve the source precision in the proposed allocation.
  const earnings = 8095061515n, dividends = 8337128948n, opening = 4211531778n;
  assert.equal(dividends - earnings, 242067433n);
  assert.equal(opening + earnings - dividends, 3969464345n);
  assert.equal((100 * Number(earnings) / Number(dividends)).toFixed(1), '97.1');
  assert.equal((4.92 - 3.45).toFixed(2), '1.47');
  for (const s of articles) {
    for (const p of [/28[,.]5/, /34[,.]3/, /97[,.]1/, /80[ ,]950[ ,]615[,.]15/, /2[ ,]420[ ,]674[,.]33/]) assert.match(s, p);
    assert.match(s, /proposée|proposed/);
    assert.match(s, /adoption.*vérifiée|Adoption.*verified/i);
    assert.match(s, /entièrement fictives|entirely fictional/);
    assert.match(s, /exclut l'annualisation|excludes annualising/);
    assert.match(s, /hors distributions éventuelles|excludes any distributions/);
    assert.match(s, /0[,.]90/); assert.match(s, /0[,.]82/); assert.match(s, /0[,.]08/);
  }
});

test('FR and EN glossary definitions retain their primary sources', () => {
  for (const entries of [glossaryEntries, glossaryAtlasEn]) {
    for (const slug of ['taux-de-distribution', 'report-a-nouveau']) {
      const entry = entries.find((e) => e.slug === slug);
      assert(entry?.atlas?.sources?.length);
      assert.match(entry.guide, /scpi-/);
      assert(entry.atlas.related.includes('scpi'));
      assert.match(entry.atlas.sources[0].href, /^https:\/\/(?:reim.bnpparibas-am.com|www.praemiareim.fr)\//);
    }
  }
});
