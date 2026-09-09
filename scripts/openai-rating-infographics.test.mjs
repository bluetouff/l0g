import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { XMLValidator } from 'fast-xml-parser';
import { glossaryAtlasEn } from '../src/config/glossary-atlas-en.ts';

const paths = [
  '../src/content/posts/openai-note-credit-garantie-nvidia-ipo.md',
  '../src/content/posts-en/openai-credit-rating-nvidia-guarantee-ipo.md',
];
const articles = paths.map((path) => readFileSync(new URL(path, import.meta.url), 'utf8'));

test('OpenAI publication preserves bilingual dates, source linkage and dedicated artwork', () => {
  const publicationDates = articles.map((source) => source.match(/^pubDate: '([^']+)'$/m)?.[1]);
  assert.equal(publicationDates[0], publicationDates[1]);
  assert.match(publicationDates[0], /^2026-09-09T\d{2}:\d{2}:\d{2}\+02:00$/);
  assert.match(articles[1], /^sourceArticle: openai-note-credit-garantie-nvidia-ipo$/m);
  assert.equal(articles[1].match(/^sourceUpdatedDate: '([^']+)'$/m)?.[1], publicationDates[0]);
  for (const source of articles) {
    assert.match(source, /^ogImage: \/illustrations\/news\/openai-credit-guarantee-v1.jpg$/m);
    assert.match(source, /\[\*\*\*\]/);
    assert.doesNotMatch(source, /<\s*(?:script|iframe|object|embed|foreignObject)\b|\bon\w+\s*=|javascript:|@import|url\(/i);
  }
});

test('OpenAI figures retain passive XML, explicit dark canvas and unclipped responsive sizing', () => {
  for (const source of articles) {
    const svgs = source.match(/<svg\b[\s\S]*?<\/svg>/gu) ?? [];
    assert.equal(svgs.length, 3);
    assert.doesNotMatch(source, /overflow\s*:\s*hidden/);
    assert.match(source, /max-width:380px/);
    for (const svg of svgs) {
      assert.equal(XMLValidator.validate(svg), true);
      assert.match(svg, /width:100%;height:auto;background:#0b0d10/);
      assert.match(svg, /<rect x="0" y="0" width="420" height="\d+" fill="#0b0d10"/);
      assert.doesNotMatch(svg, /(?:href|src)=|<image\b|<use\b|<animate\b|<set\b/i);
      const height = Number(svg.match(/viewBox="0 0 420 (\d+)"/)?.[1]);
      assert.ok(height * 380 / 420 <= 550, 'Figures must remain compact at their maximum CSS width');
      const ids = [...svg.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
      assert.equal(new Set(ids).size, ids.length);
      for (const id of svg.match(/aria-labelledby="([^"]+)"/)[1].split(' ')) assert(ids.includes(id));
    }
  }
});

test('S&P endpoints and fictional IPO segments use the stated proportional scales', () => {
  const width = 372;
  const spWidths = [4.2, 37.7].map((value) => Number((value / 40 * width).toFixed(2)));
  const net = 50 - 10 - 1;
  assert.equal(net, 39);
  const ipoWidths = [net, 1, 10].map((value) => Number((value / 50 * width).toFixed(2)));
  assert.equal(ipoWidths.reduce((sum, value) => sum + value, 0), width);
  for (const source of articles) {
    const [, scenario, example] = source.match(/<svg\b[\s\S]*?<\/svg>/gu);
    for (const barWidth of spWidths) assert(scenario.includes('width="' + barWidth + '"'));
    for (const barWidth of ipoWidths) assert(example.includes('width="' + barWidth + '"'));
    assert.match(example, /50 − 10 − 1 = 39/);
    assert.match(example, /fictif|fictional/i);
    assert.match(scenario, /ni des pertes attendues|expected losses/i);
  }
});

test('English rating and guarantee glossary entries preserve primary sources and article links', () => {
  for (const slug of ['investment-grade', 'vrg']) {
    const entry = glossaryAtlasEn.find((candidate) => candidate.slug === slug);
    assert.equal(entry?.guide, '/en/analysis/openai-credit-rating-nvidia-guarantee-ipo/');
    assert(entry.atlas.sources.every((source) => /^https:\/\/www\.(?:sec|investor)\.gov\//.test(source.href)));
  }
});
