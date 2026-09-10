import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { XMLValidator } from 'fast-xml-parser';
import { glossaryEntries, glossaryUpdatedIso } from '../src/config/glossary.ts';
import { glossaryAtlasEn } from '../src/config/glossary-atlas-en.ts';

const articles = [
  '../src/content/posts/cuivre-stocks-americains-cout-attente-douaniere.md',
  '../src/content/posts-en/copper-us-stockpile-carrying-cost-tariff-uncertainty.md',
].map((path) => readFileSync(new URL(path, import.meta.url), 'utf8'));
const attr = (tag, name) => Number(tag.match(new RegExp('\\b' + name + '="([^"]+)"'))?.[1]);

test('Copper publication keeps bilingual dates, source scope and passive markup', () => {
  const dates = articles.map((s) => s.match(/^pubDate: '([^']+)'$/m)?.[1]);
  assert.equal(dates[0], dates[1]);
  assert.match(dates[0], /^2026-09-10T\d{2}:\d{2}:\d{2}\+02:00$/);
  assert.equal(articles[1].match(/^sourceUpdatedDate: '([^']+)'$/m)?.[1], dates[0]);
  assert.match(articles[1], /^sourceArticle: cuivre-stocks-americains-cout-attente-douaniere$/m);
  for (const source of articles) {
    assert.match(source, /^ogImage: \/illustrations\/news\/cuivre-stocks-americains-v1.jpg$/m);
    assert.match(source, /^seoTitle: '.+ \| l0g'$/m);
    assert.equal(source.match(/^updatedDate: '([^']+)'$/m)?.[1], dates[0]);
    assert.doesNotMatch(source, /<\s*(?:script|iframe|object|embed|foreignObject)\b|\bon\w+\s*=|javascript:|@import|url\(|—/i);
    const ids = [...source.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
    assert.equal(new Set(ids).size, ids.length);
    for (const [, id] of source.matchAll(/href="#([^"]+)"/g)) assert(ids.includes(id), id);
    assert.equal((source.match(/<li id="custock26-(?:fr|en)-s\d+">/g) ?? []).length, 12);
    assert.match(source, /694[ ,]674/);
    assert.match(source, /991[ ,]849/);
    assert.match(source, /fictif|hypothetical/i);
    assert.match(source, /cinq jours ouvrés|five business days/);
    assert.match(source, /tous les frais applicables ayant été réglés|all applicable charges have been paid/);
    assert.doesNotMatch(source, /dans le dossier|accompanying calculation file/);
    const headings = source.match(/^#{1,3} .+$/gm).join('\n');
    assert.doesNotMatch(headings, /[,;:].*\b(?:pas|not)\b|n’est pas|is not|ne .*pas|does not|would not|need not|cannot/i);
  }
});

test('Copper SVGs remain dark, compact and inside padded panels', () => {
  for (const source of articles) {
    assert.doesNotMatch(source, /overflow\s*:\s*hidden/);
    assert.match(source, /max-width:420px/);
    assert(source.includes('figcaption strong{color:#f5f5f7}'));
    assert(source.includes('.prose figure.custock26-figure figcaption a{color:#5eead4}'));
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

test('Copper charts reproduce exchange changes and explicit fictional cost inputs', () => {
  assert.equal(234175 + 694674 + 63000, 991849);
  assert.equal((694674 / 991849 * 100).toFixed(0), '70');
  assert.equal(10983 + 675 - 9428, 2230);
  const metricPerShortTon = 0.90718474;
  const quantity = 10000;
  const principal = quantity * 14000;
  const financing = principal * 0.06 * 6 / 12;
  const storage = quantity / metricPerShortTon * 15 * 6;
  const exit = quantity / metricPerShortTon * (50 + 8);
  assert.equal((15 / metricPerShortTon).toFixed(2), '16.53');
  assert.equal(Math.round(financing), 4200000);
  assert.equal(Math.round(storage), 992080);
  assert.equal(Math.round(exit), 639341);
  assert.equal(Math.round(financing + storage + exit), 5831421);
  assert.equal(Math.round((financing + storage + exit) / quantity), 583);
  assert.equal(Math.round(principal * 0.06 / 12 + storage / 6), 865347);
  for (const source of articles) {
    const svgs = source.match(/<svg\b[\s\S]*?<\/svg>/g);
    const changes = [...svgs[0].matchAll(/<rect\b[^>]*data-stock-change="([^"]+)"[^>]*\/>/g)];
    assert.deepEqual(changes.map(([, value]) => Number(value)), [10983, 675, -9428]);
    for (const [tag, raw] of changes) {
      const value = Number(raw);
      const width = Number((Math.abs(value) * 192 / 12000).toFixed(3));
      assert.equal(attr(tag, 'width'), width);
      assert.equal(attr(tag, 'x'), value < 0 ? Number((240 - width).toFixed(3)) : 240);
    }
    const costs = [...svgs[2].matchAll(/<rect\b[^>]*data-cost-usd="([^"]+)"[^>]*\/>/g)];
    assert.deepEqual(costs.map(([, value]) => Number(value)), [Math.round(financing), Math.round(storage), Math.round(exit)]);
    for (const [tag, value] of costs) {
      assert.equal(attr(tag, 'x'), 24);
      assert.equal(attr(tag, 'width'), Number((432 * Number(value) / 4500000).toFixed(3)));
    }
  }
});

test('Copper glossary concepts retain bilingual definitions and primary sources', () => {
  assert.ok(glossaryUpdatedIso >= '2026-09-10');
  for (const entries of [glossaryEntries, glossaryAtlasEn]) {
    for (const slug of ['warrant-d-entrepot', 'cout-de-portage']) {
      const entry = entries.find((e) => e.slug === slug);
      assert(entry, slug);
      assert(entry.atlas.sources.length > 0, slug);
      assert(entry.atlas.sources.every((s) => s.href.startsWith('https://www.cmegroup.com/')), slug);
    }
  }
});
