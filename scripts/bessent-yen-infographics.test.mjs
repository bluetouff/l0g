import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { XMLValidator } from 'fast-xml-parser';
import { glossaryEntries } from '../src/config/glossary.ts';
import { glossaryAtlasEn } from '../src/config/glossary-atlas-en.ts';

const articles = [
  '../src/content/posts/bessent-yen-dette-americaine-fima-rachats.md',
  '../src/content/posts-en/bessent-yen-us-debt-fima-buybacks.md',
].map((path) => readFileSync(new URL(path, import.meta.url), 'utf8'));
const attr = (tag, name) => Number(tag.match(new RegExp('\\b' + name + '="([^"]+)"'))?.[1]);

test('Bessent publication keeps bilingual timestamps, source linkage and passive content', () => {
  const dates = articles.map((s) => s.match(/^pubDate: '([^']+)'$/m)?.[1]);
  assert.equal(dates[0], dates[1]);
  assert.match(dates[0], /^2026-09-09T\d{2}:\d{2}:\d{2}\+02:00$/);
  assert.equal(articles[1].match(/^sourceUpdatedDate: '([^']+)'$/m)?.[1], dates[0]);
  assert.match(articles[1], /^sourceArticle: bessent-yen-dette-americaine-fima-rachats$/m);
  for (const source of articles) {
    assert.match(source, /^ogImage: \/illustrations\/news\/bessent-yen-treasuries-v1.jpg$/m);
    assert.doesNotMatch(source, /<\s*(?:script|iframe|object|embed|foreignObject)\b|\bon\w+\s*=|javascript:|@import|url\(|—/i);
    const ids = [...source.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
    assert.equal(new Set(ids).size, ids.length);
    for (const [, id] of source.matchAll(/href="#([^"]+)"/g)) assert(ids.includes(id), id);
    assert.equal((source.match(/<li id="bsy26-(?:fr|en)-s\d+">/g) ?? []).length, 18);
    assert.match(source, /1(?:er)? (?:mai|May) 2025/);
    assert.match(source, /hypoth[ée]ti(?:que|cal)|fictif/i);
  }
});

test('Bessent figures have compact, explicit dark canvases and unclipped panels', () => {
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

test('Bessent illustrative balances and FX outcomes use the stated inputs and common scales', () => {
  const equity = 100 - 95;
  assert.equal(equity, 5);
  assert.equal(100 / equity, 20);
  assert.equal(95 / equity, 19);
  const dollarAssets = (160 / 160) * 1.04;
  const yenDebt = 160 * 1.005;
  const outcomes = [160, 150, 140].map((fx) => Number((dollarAssets * fx - yenDebt).toFixed(1)));
  assert.deepEqual(outcomes, [5.6, -4.8, -15.2]);
  const breakEven = yenDebt / dollarAssets;
  assert.ok(breakEven > 150 && breakEven < 160);
  assert.ok(Math.abs(dollarAssets * breakEven - yenDebt) < 1e-9);
  for (const source of articles) {
    const [, balance, fx] = source.match(/<svg\b[\s\S]*?<\/svg>/g);
    const widths = [...balance.matchAll(/<rect\b[^>]*data-part="[^"]+"[^>]*\/>/g)].map(([tag]) => attr(tag, 'width'));
    assert.deepEqual(widths, [380, 20, 380, 20]);
    const bars = [...fx.matchAll(/<rect\b[^>]*data-result="([^"]+)"[^>]*\/>/g)];
    assert.equal(bars.length, outcomes.length);
    for (const [[tag, value], expected] of bars.map((bar, i) => [bar, outcomes[i]])) {
      assert.equal(Number(value), expected);
      assert.equal(attr(tag, 'width'), Math.abs(expected) * 10);
      assert.equal(attr(tag, 'x'), 240 + Math.min(expected, 0) * 10);
    }
  }
});

test('FIMA glossary distinguishes temporary official funding in both languages', () => {
  for (const entries of [glossaryEntries, glossaryAtlasEn]) {
    const entry = entries.find((e) => e.slug === 'fima');
    assert(entry);
    assert.match(entry.def, /sept jours|seven calendar days/);
    assert.equal(entry.atlas.sources.length, 2);
    assert(entry.atlas.sources.every((s) => /^https:\/\/www\.(?:federalreserve\.gov|mof\.go\.jp)\//.test(s.href)));
  }
});
