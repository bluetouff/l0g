import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { XMLValidator } from 'fast-xml-parser';
import { glossaryEntries } from '../src/config/glossary.ts';
import { glossaryAtlasEn } from '../src/config/glossary-atlas-en.ts';

const articles = [
  '../src/content/posts/scpi-bureaux-vacance-franchises-loyers-travaux.md',
  '../src/content/posts-en/french-scpi-office-vacancy-rent-free-incentives.md',
].map((p) => readFileSync(new URL(p, import.meta.url), 'utf8'));
const attr = (tag, name) => Number(tag.match(new RegExp('\\b' + name + '="([^"]+)"'))?.[1]);

test('SCPI office income retain bilingual SEO, dated sources and passive content', () => {
  const dates = articles.map((s) => s.match(/^pubDate: '([^']+)'$/m)?.[1]);
  assert.equal(dates[0], dates[1]);
  assert.match(dates[0], /^2026-09-13T\d{2}:\d{2}:\d{2}\+02:00$/);
  assert.equal(articles[1].match(/^sourceUpdatedDate: '([^']+)'$/m)?.[1], dates[0]);
  assert.match(articles[1], /^sourceArticle: scpi-bureaux-vacance-franchises-loyers-travaux$/m);
  for (const s of articles) {
    assert.equal(s.match(/^updatedDate: '([^']+)'$/m)?.[1], dates[0]);
    assert.match(s, /^draft: false$/m);
    assert.match(s, /^ogImage: \/illustrations\/news\/scpi-bureaux-vacance-v1.jpg$/m);
    assert.match(s, /^seoTitle: '.+ \| l0g'$/m);
    assert.equal(new Set(['title', 'seoTitle', 'ogTitle'].map((key) => s.match(new RegExp('^' + key + ': (.+)$', 'm'))[1])).size, 3);
    assert.doesNotMatch(s, /<\s*(?:script|iframe|object|embed|foreignObject)\b|\bon\w+\s*=|javascript:|@import|url\(|—|\?t=\d+/i);
    const ids = [...s.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
    assert.equal(new Set(ids).size, ids.length);
    for (const slug of ['scpi', 'tof', 'franchise-de-loyer', 'loyer-facial']) assert(s.includes('/' + slug + '/'));
    const headings = s.match(/^#{1,3} .+$/gm).join('\n');
    assert.doesNotMatch(headings, /[,;:].*\b(?:pas|not)\b|n.est pas|is not|are not|ne .*pas|does not|do not/i);
    assert.equal((s.match(/<details class="scpi4-exercise">/g) ?? []).length, 3);
    assert.equal((s.match(/<li id="scpi4-(?:fr|en)-s\d+"/g) ?? []).length, 12);
  }
});

test('SCPI SVGs preserve margins, zero baselines, exact scales and responsive dark styling', () => {
  const scales = [
    { values: [73.3, 6.7, 1.7, 18.3], max: 100 },
    { values: [16.4, 30.6, 41.9], max: 50 },
    { values: [300, 225, 1350000 / 1000 / 6.5], max: 300 },
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

test('SCPI rental calculations retain source units and fictional assumptions', () => {
  assert.equal((73.3 + 6.7 + 1.7).toFixed(1), '81.7');
  assert.equal((73.3 + 6.7 + 1.7 + 18.3).toFixed(1), '100.0');
  assert.equal((88.8 - 91.2).toFixed(1), '-2.4');
  assert.equal((100 * (51.3 / 57 - 1)).toFixed(0), '-10');
  // The denominator is all works, not the smaller major-works subtotal.
  assert.equal((100 * 45796264.56 / 61527380.64).toFixed(1), '74.4');
  const area = 1000, headline = 300, term = 72, free = 12, fitOut = 150000, voidMonths = 6;
  const nominal = area * headline * term / 12;
  const flows = area * headline * (term - free) / 12 - fitOut;
  assert.equal(nominal, 1800000);
  assert.equal(flows, 1350000);
  assert.equal(100 * (1 - flows / nominal), 25);
  assert.equal(flows / area / (term / 12), 225);
  assert.equal((flows / area / ((term + voidMonths) / 12)).toFixed(2), '207.69');
  assert.equal(free + voidMonths, 18);
  for (const s of articles) {
    for (const p of [/6[ ,]999/, /30[ ,]372/, /30[,.]6/, /97[,.]98/, /74[,.]4/, /207[,.]69/]) assert.match(s, p);
    assert.match(s, /entièrement fictif|entirely fictional/);
    assert.match(s, /douze (?:derniers mois|mois glissants)|(?:preceding|trailing) twelve months/);
    assert.match(s, /pondéré.*surfaces|weighted.*floor area/);
    assert.match(s, /moyennes.*simples|simple means/);
    assert.match(s, /2010.*2019/);
    assert.match(s, /première année pleine|first full reported year/);
    assert.match(s, /charges.*facturés|billed.*service charges/);
    assert.match(s, /loyer.*exigibles|first rent payments/);
  }
});

test('Three FR and EN property glossary definitions retain their original sources', () => {
  for (const entries of [glossaryEntries, glossaryAtlasEn]) {
    for (const slug of ['tof', 'franchise-de-loyer', 'loyer-facial']) {
      const entry = entries.find((e) => e.slug === slug);
      assert(entry?.atlas?.sources?.length);
      assert.match(entry.guide, /scpi-/);
      assert.equal(entry.atlas.related.length, 2);
      assert.match(entry.atlas.sources[0].href, /^https:\/\/www\.(?:pierrepapier\.fr|immostat\.com)\//);
    }
  }
});
