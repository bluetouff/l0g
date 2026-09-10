import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { XMLValidator } from 'fast-xml-parser';
import { glossaryEntries, glossaryUpdatedIso } from '../src/config/glossary.ts';
import { glossaryAtlasEn } from '../src/config/glossary-atlas-en.ts';

const articles = [
  '../src/content/posts/ghana-or-cedi-goldbod-cout-devises.md',
  '../src/content/posts-en/ghana-goldbod-gold-dollar-trade-public-cost.md',
].map((path) => readFileSync(new URL(path, import.meta.url), 'utf8'));
const attr = (tag, name) => Number(tag.match(new RegExp('\\b' + name + '="([^"]+)"'))?.[1]);

test('Ghana publication preserves bilingual dates, source disagreements and passive markup', () => {
  const dates = articles.map((s) => s.match(/^pubDate: '([^']+)'$/m)?.[1]);
  assert.equal(dates[0], dates[1]);
  assert.match(dates[0], /^2026-09-10T\d{2}:\d{2}:\d{2}\+02:00$/);
  assert.equal(articles[1].match(/^sourceUpdatedDate: '([^']+)'$/m)?.[1], dates[0]);
  assert.match(articles[1], /^sourceArticle: ghana-or-cedi-goldbod-cout-devises$/m);
  for (const source of articles) {
    assert.match(source, /^ogImage: \/illustrations\/news\/ghana-goldbod-or-cedi-v1.jpg$/m);
    assert.match(source, /^seoTitle: '.+ \| l0g'$/m);
    assert.doesNotMatch(source, /<\s*(?:script|iframe|object|embed|foreignObject)\b|\bon\w+\s*=|javascript:|@import|url\(|—/i);
    const ids = [...source.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
    assert.equal(new Set(ids).size, ids.length);
    for (const [, id] of source.matchAll(/href="#([^"]+)"/g)) assert(ids.includes(id), id);
    assert.equal((source.match(/<li id="ghgold26-(?:fr|en)-s\d+">/g) ?? []).length, 13);
    for (const ratio of ['14[,.]5', '11[,.]4', '15[,.]3', '11[,.]7']) assert.match(source, new RegExp(ratio));
    assert.match(source, /13[ ,]423[ ,]478/);
    assert.doesNotMatch(source, /research notes|consignée|Revenus, pas|Revenue, not/);
    const headings = source.match(/^#{1,3} .+$/gm).join('\n');
    assert.doesNotMatch(headings, /[,;:].*\b(?:pas|not)\b|n’est pas|is not|ne .*pas|does not|did not|cannot/i);
  }
});

test('Ghana SVGs use compact dark canvases and padded internal panels', () => {
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
        const approximateRight = x + [...text.replaceAll('&amp;', '&')].length * size * 0.62;
        assert.ok(x >= 24 && x < 456 && y - size >= 10 && y + size * 0.25 <= 614, text);
        assert.ok(approximateRight <= 480, text);
        for (const p of panels.filter((p) => x >= p.x && x <= p.x + p.width && y >= p.y && y <= p.y + p.height)) {
          assert.ok(x >= p.x + 16 && y - size >= p.y + 2 && y + size * 0.25 <= p.y + p.height - 2, text);
          assert.ok(approximateRight <= p.x + p.width - 4, text);
        }
      }
    }
  }
});

test('Ghana bars reproduce reported allocations, revenue shares and fictional FX inputs', () => {
  const grant = 4547700000;
  const total = 5553802713;
  assert.equal((668.21 + 646.59).toFixed(2), '1314.80');
  assert.equal((grant / total * 100).toFixed(1), '81.9');
  assert.equal(970765336 + grant + 35337378 - total, 1);
  assert.equal(5457413825 - 5443990347, 13423478);
  for (const source of articles) {
    const svgs = source.match(/<svg\b[\s\S]*?<\/svg>/g);
    for (const [tag, value] of svgs[0].matchAll(/<rect\b[^>]*data-usd-million="([^"]+)"[^>]*\/>/g)) {
      assert.equal(attr(tag, 'x'), 44);
      assert.equal(attr(tag, 'width'), Number((392 * Number(value) / 700).toFixed(3)));
    }
    assert.match(svgs[1], /fictif|Hypothetical/);
    for (const [tag, value] of svgs[1].matchAll(/<rect\b[^>]*data-ghs-million="([^"]+)"[^>]*\/>/g)) {
      assert.equal(attr(tag, 'x'), 44);
      assert.equal(attr(tag, 'width'), Number((392 * Number(value) / 12).toFixed(3)));
    }
    const bars = [...svgs[2].matchAll(/<rect\b[^>]*data-revenue-ghs="([^"]+)"[^>]*\/>/g)];
    assert.equal(bars.length, 2);
    assert.equal(bars.reduce((sum, [, value]) => sum + Number(value), 0), total);
    for (const [tag, value] of bars) assert.equal(attr(tag, 'width'), Number((392 * Number(value) / total).toFixed(3)));
  }
});

test('Ghana glossary concepts have linked FR and EN source-backed definitions', () => {
  assert.ok(glossaryUpdatedIso >= '2026-09-10', 'Glossary revision must include the new definitions');
  for (const entries of [glossaryEntries, glossaryAtlasEn]) {
    for (const slug of ['sterilisation-monetaire', 'activite-quasi-budgetaire']) {
      const entry = entries.find((e) => e.slug === slug);
      assert(entry, slug);
      assert(entry.atlas.sources.length > 0, slug);
      assert(entry.atlas.sources.every((s) => s.href.startsWith('https://www.imf.org/')), slug);
    }
  }
});
