import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { glossaryEntries } from '../src/config/glossary.ts';
import { glossaryAtlasEn } from '../src/config/glossary-atlas-en.ts';

const paths = [
  '../src/content/posts/scpi-dette-cessions-refinancement.md',
  '../src/content/posts-en/french-scpi-debt-property-sales-refinancing.md',
];
const articles = paths.map(p => readFileSync(new URL(p, import.meta.url), 'utf8'));
const attr = (tag, name) => Number(tag.match(new RegExp('\\b' + name + '="([^"]+)"'))?.[1]);
const chartText = (svg) => {
  const content = (node) => {
    if (node.type === 'text') return node.value;
    const text = (node.children ?? []).map(content).join('');
    return ['title', 'desc', 'text'].includes(node.tagName) ? ' ' + text + ' ' : text;
  };
  return content(fromHtml(svg, { fragment: true })).replace(/\s+/g, ' ').trim();
};
const sources = [
  'https://www.praemiareim.fr/documents/14836074/14836287/PRAEMIA_BTI_Primopierre_T2_2026_VDEF.pdf/97936dbf-e24c-ed99-8b83-a62abece978d',
  'https://doc.la-francaise.com/documents/bulletin-trimestriel-lf-grand-paris-patrimoine-30062026',
  'https://doc.la-francaise.com/documents/rapport-annuel-lf-grand-paris-patrimoine-2025',
  'https://www.moniwan.fr/documents/note-information-et-statuts-lf-grand-paris-patrimoine',
  'https://www.praemiareim.fr/documents/14836074/14836290/Primopierre%2BRapport%2BAnnuel%2B2025.pdf/32234cef-d9b6-60b3-9ad5-08bfa8420b37',
  'https://www.sofidy.com/app/uploads/2026/07/Bulletin_Trimestriel_-_Immorente_2026_2T_OPTI.pdf',
  'https://www.aspim.fr/actualites/collecte-et-performance-des-fonds-immobiliers-grand-public-au-premier-trimestre-2026-et-principaux-indicateurs-des-scpi-en-2025/',
  'https://www.banque-france.fr/fr/publications-et-statistiques/publications/rapport-sur-la-stabilite-financiere-juin-2026',
  'https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000039467054/2019-02-22',
  'https://www.eba.europa.eu/sites/default/files/document_library/Publications/Draft%20Technical%20Standards/2022/EBA-RTS-2022-05%20RTS%20on%20crowdfunding%20for%20service%20providers/1032645/RTS%20on%20crowdfunding%20for%20service%20providers%20.pdf',
];

test('SCPI debt publication retains bilingual dates, primary references and passive markup', () => {
  const dates = articles.map(s => s.match(/^pubDate: '([^']+)'$/m)?.[1]);
  assert.equal(dates[0], dates[1]);
  assert.match(dates[0], /^2026-09-13T\d{2}:\d{2}:\d{2}\+02:00$/);
  assert.equal(articles[1].match(/^sourceUpdatedDate: '([^']+)'$/m)?.[1], dates[0]);
  assert.match(articles[1], /^sourceArticle: scpi-dette-cessions-refinancement$/m);
  for (const s of articles) {
    assert.equal(s.match(/^updatedDate: '([^']+)'$/m)?.[1], dates[0]);
    assert.match(s, /^draft: false$/m);
    assert.match(s, /^ogImage: \/illustrations\/news\/scpi-dette-refinancement-v1.jpg$/m);
    assert.match(s, /^seoTitle: '.+ \| l0g'$/m);
    assert.equal(new Set(['title', 'seoTitle', 'ogTitle'].map(k => s.match(new RegExp('^' + k + ': (.+)$', 'm'))[1])).size, 3);
    assert.doesNotMatch(s, /<\s*(?:script|iframe|object|embed|foreignObject)\b|\bon\w+\s*=|javascript:|@import|url\(|—|\?t=\d+/i);
    const ids = [...s.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
    assert.equal(new Set(ids).size, ids.length);
    assert.equal((s.match(/<details class="scpi5-exercise">/g) ?? []).length, 3);
    const references = [...s.matchAll(/<li id="scpi5-(?:fr|en)-s\d+"><a href="([^"]+)"/g)].map(m => m[1]);
    assert.deepEqual(references, sources);
    for (const value of references) {
      const url = new URL(value);
      assert.equal(url.protocol, 'https:');
      assert.equal(url.username + url.password + url.search, '');
    }
    for (const slug of ['scpi', 'levier-aifm', 'rdae']) assert(s.includes('/' + slug + '/'));
    const headings = s.match(/^#{1,3} .+$/gm).join('\n');
    assert.doesNotMatch(headings, /[,;:].*\b(?:pas|not|mais)\b|n.est pas|is not|are not|ne .*pas|does not|do not|need not/i);
  }
});

test('SCPI debt SVGs retain safe geometry and exact zero-based amounts', () => {
  const expectedBars = [
    [[28, 464 * 328.2 / 700], [28, 464 * 618.22597561 / 700]],
    [[28, 0], [28, 464 * 153 / 200], [28, 464 * 175.2 / 200]],
    [[28, 185.6], [213.6, 278.4], [28, 185.6], [213.6, 185.6], [28, 92.8], [120.8, 185.6]],
  ];
  for (const source of articles) {
    assert.doesNotMatch(source, /overflow\s*:\s*hidden/);
    assert.match(source, /max-width:520px/);
    assert.match(source, /margin:2rem auto 2\.5rem/);
    const svgs = source.match(/<svg\b[\s\S]*?<\/svg>/g) ?? [];
    assert.equal(svgs.length, 3);
    for (const [i, svg] of svgs.entries()) {
      assert.equal(XMLValidator.validate(svg), true);
      assert.match(svg, /width:100%;height:auto;background:#0b0d10/);
      assert.doesNotMatch(svg, /(?:href|src)=|<image\b|<use\b|<animate\b|<set\b|clipPath|mask\b/i);
      const height = Number(svg.match(/viewBox="0 0 520 (\d+)"/)[1]);
      const boxes = [];
      for (const [, tag, value] of svg.matchAll(/(<text\b[^>]*>)([\s\S]*?)<\/text>/g)) {
        const text = chartText('<svg><text>' + value + '</text></svg>');
        const x = attr(tag, 'x'), y = attr(tag, 'y'), size = attr(tag, 'font-size');
        const width = [...text].length * size * 0.62;
        const left = x - (tag.includes('text-anchor="end"') ? width : tag.includes('text-anchor="middle"') ? width / 2 : 0);
        const right = left + width, top = y - size, bottom = y + size * 0.25;
        assert(size >= 20);
        assert(left >= 18 && right <= 502 && top >= 10 && bottom <= height - 10, text + ' crosses a margin');
        for (const other of boxes) {
          assert(right + 8 <= other.left || left >= other.right + 8 || bottom + 4 <= other.top || top >= other.bottom + 4, text + ' crowds ' + other.text);
        }
        boxes.push({ left, right, top, bottom, text });
      }
      const bars = [...svg.matchAll(/<rect\b[^>]*data-bar="true"[^>]*\/>/g)].map(([tag]) => tag);
      assert.equal(bars.length, expectedBars[i].length);
      for (const [j, tag] of bars.entries()) {
        assert(Math.abs(attr(tag, 'x') - expectedBars[i][j][0]) < 0.00001);
        assert(Math.abs(attr(tag, 'width') - expectedBars[i][j][1]) < 0.00001);
      }
      for (const [tag] of svg.matchAll(/<rect\b[^>]*\/>/g)) {
        assert(attr(tag, 'x') >= 0 && attr(tag, 'y') >= 0);
        assert(attr(tag, 'width') >= 0 && attr(tag, 'height') >= 0);
        assert(attr(tag, 'x') + attr(tag, 'width') <= 520);
        assert(attr(tag, 'y') + attr(tag, 'height') <= height);
      }
    }
    assert.match(chartText(svgs[0]), /946[,.]43/);
    assert.match(chartText(svgs[0]), /65[,.]3/);
    assert.match(chartText(svgs[1]), /(?:seule|Parent-only)/);
    assert.match(chartText(svgs[2]), /entièrement fictif|[Ee]ntirely fictional/);
  }
});

test('SCPI property debt calculations preserve separate definitions and hypothetical cases', () => {
  const parent = 328200000, subsidiaries = 618225975.61;
  assert.equal((parent + subsidiaries).toFixed(2), '946425975.61');
  assert.equal((100 * subsidiaries / (parent + subsidiaries)).toFixed(1), '65.3');
  assert.equal(153000000 + 175200000, parent);
  assert.equal((41.3 - 38.8).toFixed(1), '2.5');
  assert.equal((100 * ((16500000 + 8850000 + 30022200) / (16003976 + 8844354 + 31053429) - 1)).toFixed(2), '-0.95');
  assert.deepEqual([100 - 40, 80 - 40, (80 - 20) - (40 - 20)], [60, 40, 40]);
  assert.equal((100 * (40 / 60 - 1)).toFixed(1), '-33.3');
  assert.equal((100 * 20 / 60).toFixed(1), '33.3');
  assert.equal(20 * 0.04, 0.8);
  assert.equal((20 * 0.04 - 1.2).toFixed(1), '-0.4');
  assert.equal(80 * 0.4, 32);
  assert.equal(40 - 80 * 0.4, 8);
  for (const s of articles) {
    for (const pattern of [/166\s?%/, /1[,.]54/, /32[,.]07/, /42[,.]50/, /29[,.]14/, /2[,.]53/, /98[,.]7/, /18[,.]3/, /18[,.]4/, /951[ ,]534[ ,]001/]) assert.match(s, pattern);
    assert.match(s, /possibilité|possibility/);
    assert.match(s, /défaut de paiement bancaire|default on a bank loan/);
    assert.match(s, /rapprochement détaillé|detailed reconciliation/);
    assert.match(s, /au 31 décembre 2025|at 31 December 2025/);
  }
});

test('SCPI debt text checks parse entities and retain source-backed glossary entries', () => {
  assert.equal(chartText('<svg viewBox="0 0 166 54"><text data-note="0 > 40">65&#46;3%</text></svg>'), '65.3%');
  assert.match(chartText('<svg><title>Scope</title><desc>Parent only</desc><text><tspan>328</tspan><tspan>.20</tspan></text></svg>'), /Scope Parent only 328\.20/);
  for (const entries of [glossaryEntries, glossaryAtlasEn]) {
    for (const slug of ['levier-aifm', 'rdae']) {
      const entry = entries.find(e => e.slug === slug);
      assert(entry?.atlas?.sources?.length);
      assert.equal(entry.atlas.sources[0].href, sources[2]);
      assert.equal(entry.atlas.related.length, 2);
      assert.match(entry.guide, /scpi-/);
    }
  }
});
