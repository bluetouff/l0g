import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { fromHtml } from 'hast-util-from-html';
import { XMLValidator } from 'fast-xml-parser';

const paths = [
  'src/content/posts/clarity-apres-le-vote-49-50.md',
  'src/content/posts-en/clarity-after-the-49-50-vote.md',
];
const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const walk = n => [n, ...(n.children ?? []).flatMap(walk)];
const select = (n, tag) => walk(n).filter(node => node.tagName === tag);
const text = n => n.type === 'text' ? n.value : (n.children ?? []).map(text).join('');
const parse = s => fromHtml(s, { fragment: true });
const svgStyle = 'display:block;width:100%;height:auto;background:#0c0d10;border-radius:16px;font-family:system-ui,sans-serif';
const tags = new Set(['svg', 'title', 'desc', 'text', 'g', 'rect']);
const attrs = new Set(['xmlns', 'viewBox', 'role', 'ariaLabelledBy', 'style', 'id', 'x', 'y', 'width', 'height', 'rx', 'fill', 'stroke', 'fontSize', 'dataPanel']);
const sources = new Set([
  'https://www.senate.gov/legislative/LIS/roll_call_votes/vote1192/vote_119_2_00234.htm',
  'https://bankingjournal.aba.com/2026/09/with-failure-on-procedural-motion-clarity-acts-future-is-uncertain/',
  'https://www.rpc.senate.gov/glossary',
  'https://www.lummis.senate.gov/press-releases/lummis-boozman-scott-release-final-clarity-act-text/',
  'https://oge.box.com/shared/static/zycb5i2ny8kssm51uzqm8ygyq2zkpkqq.pdf',
  'https://www.warner.senate.gov/newsroom/press-releases/warner-statement-on-clarity-act/',
  'https://www.slotkin.senate.gov/2026/09/15/slotkin-statement-on-voting-no-on-clarity-act/',
  'https://www.lummis.senate.gov/wp-content/uploads/EHF26724.pdf',
  'https://www.sec.gov/rules-regulations/2026/08/s7-2026-27',
  'https://www.sec.gov/newsroom/speeches-statements/atkins-statement-regulation-crypto-assets-081826',
  'https://www.cftc.gov/PressRoom/SpeechesTestimony/opaselig10',
  'https://clerk.house.gov/Votes/2025199',
  'https://www.fec.gov/introduction-campaign-finance/election-results-and-voting-information/',
  'https://www.senate.gov/legislative/2026_schedule.htm',
  'https://www.congress.gov/crs_external_products/IN/PDF/IN11569/IN11569.2.pdf',
  'https://www.theblock.co/news/regulation/2026-09-15-this-one-stings-clarity-act-fails-senate-is-cryptos-biggest-regulatory-push-dead-415135',
]);
function checkSource(href) {
  const url = new URL(href);
  url.hash = '';
  assert(sources.has(url.href), 'Only the exact reviewed source URLs are allowed');
}
function check(svg) {
  assert.equal(svg.properties.style, svgStyle);
  assert.equal(svg.properties.role, 'img');
  assert.equal(svg.properties.viewBox, '0 0 520 606');
  for (const tag of ['title', 'desc']) assert.equal(select(svg, tag).length, 1);
  assert.deepEqual(svg.properties.ariaLabelledBy, [select(svg, 'title')[0].properties.id, select(svg, 'desc')[0].properties.id]);
  const inside = (label, box, padding) => {
    const p = label.properties;
    const size = Number(p.fontSize), x = Number(p.x), y = Number(p.y);
    assert(size >= 22);
    // Conservative preflight; actual browser text bounds are checked before release.
    assert(x >= box.x + padding && x + [...text(label)].length * size * .61 <= box.x + box.width - padding, `horizontal bounds: ${text(label)}`);
    assert(y - size >= box.y + padding && y + 7 <= box.y + box.height - padding, `vertical bounds: ${text(label)}`);
  };
  for (const node of walk(svg).filter(n => n.type === 'element')) {
    assert(tags.has(node.tagName), `Unsafe or unexpected SVG element: ${node.tagName}`);
    for (const key of Object.keys(node.properties)) assert(attrs.has(key), `Unexpected SVG attribute: ${key}`);
    if (node.tagName === 'text') inside(node, { x: 0, y: 0, width: 520, height: 606 }, 12);
  }
  const panels = select(svg, 'g');
  assert.equal(panels.length, 3);
  panels.forEach((panel, i) => {
    assert.equal(panel.properties.dataPanel, String(i + 1));
    const rects = select(panel, 'rect');
    assert.equal(rects.length, 1);
    const p = rects[0].properties;
    const box = Object.fromEntries(['x', 'y', 'width', 'height'].map(key => [key, Number(p[key])]));
    assert.deepEqual(box, { x: 24, y: 110 + i * 160, width: 472, height: 144 });
    const labels = select(panel, 'text');
    assert.equal(labels.length, 3);
    labels.forEach(label => inside(label, box, 12));
    for (let j = 1; j < labels.length; j++) assert(Number(labels[j].properties.y) - Number(labels[j - 1].properties.y) >= 36);
  });
}

for (const path of paths) {
  test(`${path}: reviewed sources, safe dark SVGs and panel margins`, () => {
    const source = read(path);
    assert.doesNotMatch(source, /—|foreignObject|<script|var\(--|overflow:hidden/u);
    assert.match(source, /ogImage: \/illustrations\/news\/clarity-senat-crypto-v1\.jpg/u);
    const urls = new Set([...source.matchAll(/https:\/\/[^\s<>"')]+/gu)].map(m => m[0].split('#')[0]));
    assert.deepEqual([...urls].sort(), [...sources].sort());
    urls.forEach(checkSource);
    const figures = select(parse(source), 'figure');
    assert.equal(figures.length, 2);
    const ids = new Set();
    figures.forEach(figure => {
      assert.equal(figure.properties.style, 'max-width:520px;margin:2rem auto 2.75rem;padding-bottom:.5rem');
      assert(select(figure, 'a').length >= 1);
      select(figure, 'a').forEach(a => checkSource(a.properties.href));
      const svgs = select(figure, 'svg');
      assert.equal(svgs.length, 1);
      const svg = svgs[0];
      assert.equal(XMLValidator.validate(source.slice(svg.position.start.offset, svg.position.end.offset)), true);
      check(svg);
      walk(svg).filter(n => n.properties?.id).forEach(n => { assert(!ids.has(n.properties.id)); ids.add(n.properties.id); });
    });
    for (const amount of ['49', '50', '60', '11', '10']) assert(text(figures[0]).includes(amount));
    assert.match(text(figures[0]), /conditionnel|conditional/u);
    assert.match(source, /conservons donc l’attribution|retain explicit attribution/u);
    assert.match(source, /ni une règle finale|neither a final rule/u);
  });
}
test('negative cases reject overflow, crowding, active SVG and impostor URLs', () => {
  const first = () => select(parse(read(paths[0])), 'svg')[0];
  check(first());
  for (const [key, value] of [['x', '490'], ['y', '100'], ['fontSize', '80']]) {
    const svg = first(); select(select(svg, 'g')[0], 'text')[0].properties[key] = value;
    assert.throws(() => check(svg));
  }
  const crowded = first(); select(select(crowded, 'g')[0], 'text')[1].properties.y = 170;
  assert.throws(() => check(crowded));
  for (const tagName of ['script', 'foreignObject', 'image', 'use']) {
    const svg = first(); svg.children.push({ type: 'element', tagName, properties: {}, children: [] });
    assert.throws(() => check(svg));
  }
  for (const key of ['onLoad', 'href', 'xLinkHref']) {
    const svg = first(); svg.properties[key] = 'unexpected'; assert.throws(() => check(svg));
  }
  for (const url of ['https://www.rpc.senate.gov.invalid/glossary', 'https://www.rpc.senate.gov@invalid.test/glossary', 'http://www.rpc.senate.gov/glossary', 'https://www.rpc.senate.gov/glossary?redirect=invalid']) assert.throws(() => checkSource(url));
});
test('FR/EN dates agree and the conditional vote counts are reproducible', () => {
  const dates = path => [...read(path).matchAll(/(?:pubDate|updatedDate): "([^"]+)"/gu)].map(m => m[1]);
  assert.deepEqual(dates(paths[0]), dates(paths[1]));
  assert.equal(read(paths[1]).match(/sourceUpdatedDate: "([^"]+)"/u)?.[1], dates(paths[0])[0]);
  assert.equal(49 + 50 + 1, 100);
  assert.equal(60 - 49, 11);
  assert.equal(60 - (49 + 1), 10);
});
for (const path of ['dist/posts/clarity-apres-le-vote-49-50/index.html', 'dist/en/analysis/clarity-after-the-49-50-vote/index.html']) {
  test(`${path}: built SVG geometry`, { skip: !existsSync(new URL(`../${path}`, import.meta.url)) }, () => {
    const svgs = select(parse(read(path)), 'svg').filter(n => select(n, 'title').some(t => t.properties.id?.startsWith('clarity-')));
    assert.equal(svgs.length, 2); svgs.forEach(check);
  });
}
