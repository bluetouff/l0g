import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { XMLValidator } from 'fast-xml-parser';
import { glossaryEntries } from '../src/config/glossary.ts';
import { glossaryAtlasEn } from '../src/config/glossary-atlas-en.ts';

const articles = [
  '../src/content/posts/scpi-prix-revente-decote-marche-secondaire.md',
  '../src/content/posts-en/french-scpi-resale-prices-liquidity-discounts.md',
].map((path) => readFileSync(new URL(path, import.meta.url), 'utf8'));
const attr = (tag, name) => Number(tag.match(new RegExp('\\b' + name + '="([^"]+)"'))?.[1]);

test('SCPI resale article keeps bilingual SEO, explicit dates and passive markup', () => {
  const dates = articles.map((s) => s.match(/^pubDate: '([^']+)'$/m)?.[1]);
  assert.equal(dates[0], dates[1]);
  assert.match(dates[0], /^2026-09-13T\d{2}:\d{2}:\d{2}\+02:00$/);
  assert.equal(articles[1].match(/^sourceUpdatedDate: '([^']+)'$/m)?.[1], dates[0]);
  assert.match(articles[1], /^sourceArticle: scpi-prix-revente-decote-marche-secondaire$/m);
  for (const s of articles) {
    assert.equal(s.match(/^updatedDate: '([^']+)'$/m)?.[1], dates[0]);
    assert.match(s, /^draft: false$/m);
    assert.match(s, /^ogImage: \/illustrations\/news\/scpi-prix-sortie-v1.jpg$/m);
    assert.match(s, /^seoTitle: '.+ \| l0g'$/m);
    assert.equal(new Set(['title', 'seoTitle', 'ogTitle'].map((key) => s.match(new RegExp('^' + key + ': (.+)$', 'm'))[1])).size, 3);
    assert.doesNotMatch(s, /<\s*(?:script|iframe|object|embed|foreignObject)\b|\bon\w+\s*=|javascript:|@import|url\(|—|\?t=\d+/i);
    const ids = [...s.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
    assert.equal(new Set(ids).size, ids.length);
    assert.match(s, /## Limit/);
    assert.match(s, /\/scpi\//);
    assert.match(s, /\/valeur-de-realisation\//);
    assert.match(s, /\/valeur-de-reconstitution\//);
    assert.match(s, /fictif|Hypothetical/);
    const headings = s.match(/^#{1,3} .+$/gm).join('\n');
    assert.doesNotMatch(headings, /[,;:].*\b(?:pas|not)\b|n’est pas|is not|ne .*pas|does not|do not|need not|cannot/i);
    for (const url of s.matchAll(/https:\/\/[^\s<>"\)]+/g)) {
      const parsed = new URL(url[0]);
      assert.equal(parsed.protocol, 'https:');
      assert.equal(parsed.username + parsed.password, '');
    }
  }
});

test('SCPI resale SVG labels have explicit margins without clipping', () => {
  for (const s of articles) {
    assert.doesNotMatch(s, /overflow\s*:\s*hidden/);
    assert.match(s, /max-width:520px/);
    const svgs = s.match(/<svg\b[\s\S]*?<\/svg>/g) ?? [];
    assert.equal(svgs.length, 3);
    for (const svg of svgs) {
      assert.equal(XMLValidator.validate(svg), true);
      assert.match(svg, /width:100%;height:auto;background:#0b0d10/);
      assert.doesNotMatch(svg, /(?:href|src)=|<image\b|<use\b|<animate\b|<set\b|clipPath|mask\b/i);
      const height = Number(svg.match(/viewBox="0 0 520 (\d+)"/)[1]);
      const boxes = [];
      for (const [, tag, text] of svg.matchAll(/(<text\b[^>]*>)([^<]*)<\/text>/g)) {
        const x = attr(tag, 'x'); const y = attr(tag, 'y'); const size = attr(tag, 'font-size');
        const width = [...text.replaceAll('&amp;', '&')].length * size * 0.62;
        const anchor = tag.match(/text-anchor="([^"]+)"/)?.[1];
        const left = x - (anchor === 'end' ? width : anchor === 'middle' ? width / 2 : 0);
        const right = left + width;
        assert.ok(left >= 16 && right <= 504 && y - size >= 10 && y + size * 0.25 <= height - 10, text);
        for (const other of boxes) {
          if (y > other.y && left < other.right && right > other.left) {
            assert.ok(y - other.y >= size + other.size * 0.25 + 4, text + ' crowds ' + other.text);
          }
          if (Math.abs(y - other.y) < Math.min(size, other.size)) {
            assert.ok(right <= other.left - 8 || left >= other.right + 8, text + ' overlaps ' + other.text);
          }
        }
        boxes.push({ left, right, y, size, text });
      }
      for (const [tag] of svg.matchAll(/<rect\b[^>]*data-bar="true"[^>]*\/>/g)) {
        assert.ok(attr(tag, 'x') >= 26 && attr(tag, 'x') + attr(tag, 'width') <= 494);
        assert.ok(attr(tag, 'y') >= 190 && attr(tag, 'y') + attr(tag, 'height') < height - 100);
      }
    }
  }
});

test('SCPI prices and auction examples remain reproducible with explicit scopes', () => {
  assert.equal((100 * (300 / 516.06 - 1)).toFixed(1), '-41.9');
  assert.equal((327.60 - 300).toFixed(2), '27.60');
  assert.equal((100 * (36 / 70.76 - 1)).toFixed(1), '-49.1');
  assert.equal((100 * (36 / 45 - 1)).toFixed(0), '-20');
  const volumes = [171, 1756, 2021, 2959, 1637, 1747];
  assert.equal(volumes.reduce((a, b) => a + b), 10291);
  assert.equal((100 * 10291 / 18948080).toFixed(3), '0.054');
  const sell = [[40, 100], [50, 200], [60, 300]];
  const buy = [[40, 100], [50, 170], [60, 80]];
  const executable = (price, bids) => Math.min(
    sell.filter(([limit]) => limit <= price).reduce((sum, [, qty]) => sum + qty, 0),
    bids.filter(([limit]) => limit >= price).reduce((sum, [, qty]) => sum + qty, 0),
  );
  assert.deepEqual([40, 50, 60].map((p) => executable(p, buy)), [100, 250, 80]);
  assert.deepEqual([40, 50, 60].map((p) => executable(p, buy.map(([p, q]) => [p, q / 10]))), [35, 25, 8]);
  assert.deepEqual([20, 40, 50, 60].map((p) => executable(p, [[20, 350]])), [0, 0, 0, 0]);
  assert.equal(600 - 250, 350);
  assert.equal(100 - 40, 60);
  assert.equal(80 - 40, 40);
  for (const s of articles) {
    for (const pattern of [/41[,.]9/, /49[,.]1/, /10[ ,]291/, /18[ ,]948[ ,]080/, /0[,.]054/, /130[,.]31/, /489/]) assert.match(s, pattern);
    assert.match(s, /ne sont pas des rendements totaux|not total returns/);
    assert.match(s, /mars–août|March–August/);
    assert.match(s, /422-213/); assert.match(s, /422-214/);
    const svgs = s.match(/<svg\b[\s\S]*?<\/svg>/g);
    assert.match(svgs[0], /width="402.527"/);
    assert.match(svgs[0], /width="234"/);
    assert.match(svgs[1], /width="247.744"/);
    assert.match(svgs[2], /width="266.667"/);
  }
});

test('Both glossary languages explain appraisal references with a primary source', () => {
  for (const entries of [glossaryEntries, glossaryAtlasEn]) {
    for (const slug of ['valeur-de-realisation', 'valeur-de-reconstitution']) {
      const entry = entries.find((e) => e.slug === slug);
      assert(entry);
      assert.match(entry.guide, /scpi-/);
      assert.match(entry.atlas.sources[0].href, /^https:\/\/www.reim.hsbc.fr\//);
      assert(entry.atlas.related.includes('scpi'));
    }
  }
});
