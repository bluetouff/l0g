import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { glossaryEntries } from '../src/config/glossary.ts';
import { glossaryAtlasEn } from '../src/config/glossary-atlas-en.ts';

const paths = [
  '../src/content/posts/scpi-assurance-vie-banques-contagion.md',
  '../src/content/posts-en/scpi-life-insurance-banks-contagion.md',
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

test('SCPI insurance publication preserves metadata, source scopes and passive markup', () => {
  const dates = articles.map(s => s.match(/^pubDate: '([^']+)'$/m)?.[1]);
  assert.equal(dates[0], dates[1]);
  assert.match(dates[0], /^2026-09-13T\d{2}:\d{2}:\d{2}\+02:00$/);
  const previous = readFileSync(new URL('../src/content/posts/scpi-dette-cessions-refinancement.md', import.meta.url), 'utf8');
  assert(new Date(dates[0]) > new Date(previous.match(/^pubDate: '([^']+)'$/m)[1]));
  assert.equal(articles[1].match(/^sourceUpdatedDate: '([^']+)'$/m)?.[1], dates[0]);
  assert.match(articles[1], /^sourceArticle: scpi-assurance-vie-banques-contagion$/m);
  for (const s of articles) {
    assert.equal(s.match(/^updatedDate: '([^']+)'$/m)?.[1], dates[0]);
    assert.match(s, /^draft: false$/m);
    assert.match(s, /^ogImage: \/illustrations\/news\/scpi-assurance-vie-banques-v1.jpg$/m);
    assert.match(s, /^seoTitle: '.+ \| l0g'$/m);
    assert.equal(new Set(['title', 'seoTitle', 'ogTitle'].map(k => s.match(new RegExp('^' + k + ': (.+)$', 'm'))[1])).size, 3);
    assert.doesNotMatch(s, /<\s*(?:script|iframe|object|embed|foreignObject)\b|\bon\w+\s*=|javascript:|@import|url\(|—|\?t=\d+/i);
    const ids = [...s.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
    assert.equal(new Set(ids).size, ids.length);
    assert.equal((s.match(/<details class="scpi6-exercise">/g) ?? []).length, 3);
    const refs = [...s.matchAll(/<li id="scpi6-(?:fr|en)-s\d+"><a href="([^"]+)"/g)].map(m => m[1]);
    assert.equal(refs.length, 13);
    assert.equal(new Set(refs).size, 13);
    for (const ref of refs) {
      const url = new URL(ref);
      assert.equal(url.protocol, 'https:');
      assert.equal(url.username + url.password + url.search, '');
      assert(['www.praemiareim.fr', 'www.amf-france.org', 'www.abe-infoservice.fr', 'www.legifrance.gouv.fr', 'www.aspim.fr', 'acpr.banque-france.fr', 'www.banque-france.fr', 'www.ecb.europa.eu'].includes(url.hostname));
    }
    for (const slug of ['scpi', 'unite-de-compte', 'niveau-3-ifrs-9', 'cet1']) assert(s.includes('/' + slug + '/'));
    const headings = s.match(/^#{1,3} .+$/gm).join('\n');
    assert.doesNotMatch(headings, /[,;:].*\b(?:pas|not|mais)\b|n.est pas|is not|are not|ne .*pas|does not|do not|need not/i);
    for (const pattern of [/527[,.]9/, /30[,.]1/, /238[,.]7/, /6[,.]5/, /134\s?%/, /3[,.]4/, /4[,.]2/, /337/, /265/, /101/, /20[,.]3/, /10[,.]5/, /L131-4/]) assert.match(s, pattern);
    assert.match(s, /Selon Praemia|As reported by Praemia/);
    assert.match(s, /au 31 décembre 2025|at 31 December 2025/);
    assert.match(s, /garanties particulières|additional contractual guarantees/);
    assert.match(s, /information des assurés et de l’ACPR|Policyholders and the ACPR must be informed/);
  }
});

test('SCPI insurance diagrams have readable safe margins and truthful bar geometry', () => {
  const expected = [[], [[28,464*527.9/600],[28+464*527.9/600,464*30.1/600],[28,464*238.7/600]], Array.from({length:3},()=>[[28,371.2],[399.2,92.8]]).flat()];
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
        for (const other of boxes) assert(right + 8 <= other.left || left >= other.right + 8 || bottom + 4 <= other.top || top >= other.bottom + 4, text + ' crowds ' + other.text);
        if (i === 0) for (const cardTop of [170,336,502]) if (y > cardTop && y < cardTop+102) assert(left>=46 && right<=474 && top>=cardTop+10 && bottom<=cardTop+92, text+' overflows its card');
        boxes.push({ left, right, top, bottom, text });
      }
      const bars = [...svg.matchAll(/<rect\b[^>]*data-bar="true"[^>]*\/>/g)].map(([tag]) => tag);
      assert.equal(bars.length, expected[i].length);
      for (const [j, tag] of bars.entries()) {
        assert(Math.abs(attr(tag, 'x') - expected[i][j][0]) < 0.00001);
        assert(Math.abs(attr(tag, 'width') - expected[i][j][1]) < 0.00001);
      }
      for (const [tag] of svg.matchAll(/<rect\b[^>]*\/>/g)) {
        assert(attr(tag, 'x') >= 0 && attr(tag, 'y') >= 0);
        assert(attr(tag, 'width') >= 0 && attr(tag, 'height') >= 0);
        assert(attr(tag, 'x') + attr(tag, 'width') <= 520);
        assert(attr(tag, 'y') + attr(tag, 'height') <= height);
      }
    }
    assert.match(chartText(svgs[2]), /entièrement fictif|[Ee]ntirely fictional/);
  }
});

test('SCPI insurance calculations keep exposures, losses and payment needs separate', () => {
  assert.equal(527.9 + 30.1, 558);
  assert.equal((527.9 - 238.7).toFixed(1), '289.2');
  assert.equal((558 / 8618.2 * 100).toFixed(1), '6.5');
  assert.equal(0.6 + 3.4, 4);
  assert.equal(10 - 4, 6);
  assert.equal(100 - 80, 20);
  assert.equal(15 - 10, 5);
  assert.equal(10 + 5 - 15, 0);
  assert.equal(90 - 5, 85);
  assert.equal(5 - 5, 0);
  assert.equal((100 * ((80 - 40) / (100 - 40) - 1)).toFixed(1), '-33.3');
  assert.equal(chartText('<svg><text data-note="0 > 40">3&#46;4%</text></svg>'), '3.4%');
  for (const entries of [glossaryEntries, glossaryAtlasEn]) for (const slug of ['unite-de-compte', 'niveau-3-ifrs-9']) {
    const entry = entries.find(e => e.slug === slug);
    assert(entry?.atlas?.sources?.length);
    assert.equal(entry.atlas.related.length, 2);
    assert.match(entry.guide, /scpi-/);
  }
});
