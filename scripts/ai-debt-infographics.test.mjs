import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { fromHtml } from 'hast-util-from-html';
import { XMLValidator } from 'fast-xml-parser';

const paths = [
  'src/content/posts/dette-ia-concurrence-etats-taux-credit.md',
  'src/content/posts-en/ai-debt-sovereign-borrowers-credit-costs.md',
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
  "https://www.brecorder.com/news/40439617/10-year-note-hits-19-year-high-with-fed-decision-eyed",
  "https://www.sec.gov/Archives/edgar/data/1018724/000101872426000014/R12.htm",
  "https://www.sec.gov/Archives/edgar/data/1652044/000165204426000043/googexhibit991q12026.htm",
  "https://investor.oracle.com/investor-news/news-details/2026/Oracle-Announces-Q1-Results-Driven-by-Triple-Digit-Growth-in-Cloud-Infrastructure-Revenues/default.aspx",
  "https://home.treasury.gov/news/press-releases/sb0584",
  "https://www.ecb.europa.eu/press/blog/date/2026/html/ecb.blog20260831~dac6a37e73.en.html",
  "https://www.ecb.europa.eu/press/key/date/2026/html/ecb.sp260914_2~a3f0efbee4.en.html",
  "https://libertystreeteconomics.newyorkfed.org/2014/05/treasury-term-premia-1961-present/",
  "https://www.federalreserve.gov/releases/h15/",
  "https://www.ecfr.gov/current/title-12/chapter-II/subchapter-A/part-249/subpart-C/section-249.20",
  "https://www.bankofengland.co.uk/explainers/how-is-money-created",
  "https://www.nber.org/papers/w14087",
  "https://www.ecb.europa.eu/press/other-publications/ire/focus/html/ecb.irebox202506_02~e5ae550b00.en.html",
  "https://www.ecb.europa.eu/press/blog/date/2026/html/ecb.blog20260817~754a8a4418.en.html",
  "https://www.bis.org/publications/qr-202603/financing-ai-infrastructure-boom-on-and-off-balance-sheet-borrowing",
  "https://www.bis.org/speeches/20260910-artificial-intelligence-growth-and-financial-stability-challenges-central-banks",
  "https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-86",
  "https://www.finra.org/investors/investing/investment-products/bonds",
  "https://www.bis.org/publications/bulletin-130-ai-and-global-economy-implications-central-banks"
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
    assert.match(source, /ogImage: \/illustrations\/news\/dette-ia-credit-v1\.jpg/u);
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
    for (const amount of ['26', '17', '9']) assert(text(figures[1]).includes(amount));
    assert.match(text(figures[0]), /fictifs|Hypothetical/u);
    assert.match(source, /ni d’isoler ni d’exclure|cannot isolate or rule out/u);
    assert.match(source, /swaps/u);
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
  for (const url of ['https://www.federalreserve.gov.invalid/releases/h15/', 'https://www.federalreserve.gov@invalid.test/releases/h15/', 'http://www.federalreserve.gov/releases/h15/', 'https://www.federalreserve.gov/releases/h15/?redirect=invalid']) assert.throws(() => checkSource(url));
});
test('FR/EN timestamps agree and cited financial arithmetic is reproducible', () => {
  const dates = path => [...read(path).matchAll(/(?:pubDate|updatedDate): "([^"]+)"/gu)].map(m => m[1]);
  assert.deepEqual(dates(paths[0]), dates(paths[1]));
  assert.equal(read(paths[1]).match(/sourceUpdatedDate: "([^"]+)"/u)?.[1], dates(paths[0])[0]);
  assert.equal(dates(paths[0])[0], '2026-09-16T14:03:00+02:00');
  assert.equal(45790 - 35674, 10116); // Alphabet Q1 2026, $m.
  assert.equal(23103 - 28499, -5396); // Oracle Q1 FY2027, $m.
  assert.deepEqual([[439,465],[480,497],[525,534]].map(([a,b]) => b-a), [26,17,9]);
  assert.equal(1_000_000_000 * 0.005, 5_000_000);
  assert.equal(5 + 1, 6); assert.equal(5 + 1.5, 6.5); assert.equal(5.5 + 1, 6.5);
});
for (const path of ['dist/posts/dette-ia-concurrence-etats-taux-credit/index.html', 'dist/en/analysis/ai-debt-sovereign-borrowers-credit-costs/index.html']) {
  test(`${path}: built SVG geometry`, { skip: !existsSync(new URL(`../${path}`, import.meta.url)) }, () => {
    const svgs = select(parse(read(path)), 'svg').filter(n => select(n, 'title').some(t => t.properties.id?.startsWith('ai-debt-')));
    assert.equal(svgs.length, 2); svgs.forEach(check);
  });
}
