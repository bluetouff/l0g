import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import test from 'node:test';
import { fromHtml } from 'hast-util-from-html';
import { XMLValidator } from 'fast-xml-parser';

const paths = [
  'src/content/posts/fed-hausses-taux-longs-prime-terme.md',
  'src/content/posts-en/fed-rate-hikes-long-yields-term-premium.md',
];
const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const walk = node => [node, ...(node.children ?? []).flatMap(walk)];
const select = (node, tag) => walk(node).filter(n => n.tagName === tag);
const content = node => node.type === 'text' ? node.value : (node.children ?? []).map(content).join('');
const tree = source => fromHtml(source, { fragment: true });
const hashes = {
  FED_UPPER: '68dda3e3aca7b97629860374e6e114f061925f90e1c3c039c2935db8490c4af5',
  DGS2: '3a17caf1a20b870376b510f368b63ee68fecd73cab68614a201076942f1aec8f',
  DGS10: '46a966c2941911f33669d961ce8f4d723baebf2abc7f07b06699daf2f2323e19',
  THREEFYTP10: '48676109947fdad3927d56874b2d99e315353845ec12ab50919150d30fbf0458',
};
const fedWatch = 'https://www.cmegroup.com/markets/interest-rates/cme-fedwatch-tool.html';
const captionSources = [
  [
    'https://fred.stlouisfed.org/data/DGS2',
    'https://fred.stlouisfed.org/data/DGS10',
    'https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?field_tdr_date_value=2026&type=daily_treasury_yield_curve',
    'https://www.federalreserve.gov/newsevents/pressreleases/monetary20260617a.htm',
    'https://www.federalreserve.gov/newsevents/pressreleases/monetary20260729a.htm',
    'https://fred.stlouisfed.org/series/THREEFYTP10',
    'https://www.federalreserve.gov/data/three-factor-nominal-term-structure-model.htm',
  ],
  [
    'https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?field_tdr_date_value=2024&type=daily_treasury_yield_curve',
    'https://www.federalreserve.gov/newsevents/pressreleases/monetary20240918a.htm',
    'https://www.federalreserve.gov/newsevents/pressreleases/monetary20241218a.htm',
    'https://fred.stlouisfed.org/series/THREEFYTP10',
  ],
];
function verifySources(figure, index) {
  assert.deepEqual(select(figure, 'a').map(n => n.properties.href), captionSources[index]);
}
// Frozen observations checked against Fed/FRED and Treasury on September 14, 2026.
function verifySeries(svg) {
  const series = select(svg, 'polyline');
  assert.equal(series.length, 4);
  assert.equal(new Set(series.map(s => s.properties.dataSeries)).size, 4);
  for (const s of series) {
    const p = s.properties;
    const dates = p.dataDates.split(',');
    const values = p.dataValues.split(',').map(Number);
    const points = p.points.split(' ').map(pair => pair.split(',').map(Number));
    const premium = p.dataSeries === 'THREEFYTP10';
    assert.equal(dates.length, premium ? 45 : 49);
    assert.equal(dates.at(-1), premium ? '2026-09-04' : '2026-09-11');
    assert.equal(dates.length, values.length);
    assert.equal(points.length, dates.length);
    assert.equal(createHash('sha256').update(dates.map((d, i) => `${d}:${values[i]}`).join('|')).digest('hex'), hashes[p.dataSeries]);
    for (let i = 0; i < dates.length; i++) {
      const x = 72 + (Date.parse(dates[i]) - Date.parse('2026-07-06')) / (Date.parse('2026-09-11') - Date.parse('2026-07-06')) * 404;
      const y = premium ? 914 - (values[i] * 100 - 70) / 25 * 170 : 455 - (values[i] - 3.5) / 1.7 * 210;
      assert(Math.abs(points[i][0] - x) <= 0.006, 'calendar-linear x coordinate');
      assert(Math.abs(points[i][1] - y) <= 0.006, 'reviewed value must match plotted coordinate');
    }
  }
}
const tags = new Set(['svg', 'title', 'desc', 'rect', 'text', 'line', 'circle', 'polyline']);
const attrs = new Set(['xmlns', 'viewBox', 'role', 'ariaLabelledBy', 'style', 'id', 'x', 'y', 'width', 'height', 'rx', 'fill', 'fontSize', 'textAnchor', 'x1', 'x2', 'y1', 'y2', 'stroke', 'strokeWidth', 'strokeDashArray', 'cx', 'cy', 'r', 'points', 'dataDates', 'dataValues', 'dataSeries', 'dataDelta']);
function verifySafety(svg) {
  assert.equal(svg.properties.viewBox.split(' ').slice(0, 3).join(' '), '0 0 520');
  assert.match(svg.properties.style, /width:100%;height:auto;background:#0c0d10;/u);
  assert.equal(svg.properties.role, 'img');
  assert.equal(select(svg, 'title').length, 1);
  assert.equal(select(svg, 'desc').length, 1);
  const h = Number(svg.properties.viewBox.split(' ')[3]);
  for (const node of walk(svg).filter(n => n.type === 'element')) {
    assert(tags.has(node.tagName), `unexpected element ${node.tagName}`);
    for (const key of Object.keys(node.properties)) assert(attrs.has(key), `unexpected attribute ${key}`);
    if (node.tagName === 'text') {
      const { x, y, fontSize, textAnchor } = node.properties;
      assert(Number(fontSize) >= 20, 'labels must remain readable');
      const width = [...content(node)].length * Number(fontSize) * 0.61;
      const left = Number(x) - (textAnchor === 'end' ? width : textAnchor === 'middle' ? width / 2 : 0);
      assert(left >= 12 && left + width <= 508, `label horizontal bounds: ${content(node)}`);
      assert(Number(y) - Number(fontSize) >= 10 && Number(y) + 6 <= h - 10, 'vertical label padding');
    }
  }
}
for (const path of paths) {
  test(`${path}: safe responsive SVG, dated inputs and historical deltas`, () => {
    const source = read(path);
    const figures = select(tree(source), 'figure');
    assert.equal(figures.length, 2);
    for (const [index, figure] of figures.entries()) {
      assert.match(figure.properties.style, /margin:2rem auto 2.75rem/u);
      assert.equal(select(figure, 'figcaption').length, 1);
      const svg = select(figure, 'svg')[0];
      const raw = source.slice(svg.position.start.offset, svg.position.end.offset);
      assert.equal(XMLValidator.validate(raw), true);
      verifySafety(svg);
      verifySources(figure, index);
    }
    verifySeries(select(figures[0], 'svg')[0]);
    const bars = select(figures[1], 'rect').filter(n => n.properties.dataDelta !== undefined);
    assert.deepEqual(bars.map(b => Number(b.properties.dataDelta)), [-100, 66, 93, 63.07]);
    for (const b of bars) {
      const delta = Number(b.properties.dataDelta);
      assert.equal(Number(b.properties.x), Math.round(Math.min(260, 260 + delta * 1.65) * 100) / 100);
      assert.equal(Number(b.properties.width), Math.round(Math.abs(delta * 1.65) * 100) / 100);
    }
    assert.match(source, /06:00:36/u);
    assert.match(source, /11:00:36 UTC/u);
    assert.match(source, /86[.,]5/u);
    assert.match(source, /13[.,]5/u);
    assert(select(tree(source), 'a').some(n => n.properties.href === fedWatch));
    assert.doesNotMatch(source, /Reuters|\[\[S\d+\]\]|@@FIG|—/u);
  });
}
test('Fed figures reject revised values, extrapolation and active content', () => {
  const original = read(paths[0]);
  assert.throws(() => verifySeries(select(tree(original.replace('data-values="4.48,', 'data-values="4.49,')), 'svg')[0]));
  assert.throws(() => verifySeries(select(tree(original.replace('data-series="THREEFYTP10"', 'data-series="MISSING"')), 'svg')[0]));
  const svg = select(tree(original), 'svg')[0];
  assert.throws(() => verifySafety({ ...svg, children: [...svg.children, { type: 'element', tagName: 'script', properties: {}, children: [] }] }));
  assert.throws(() => verifySafety({ ...svg, properties: { ...svg.properties, onLoad: 'unexpected' } }));
  const textNode = select(svg, 'text')[0];
  textNode.properties.x = 519;
  assert.throws(() => verifySafety(svg));
  const figure = select(tree(original), 'figure')[0];
  const sourceLink = select(figure, 'a')[0];
  sourceLink.properties.href = 'https://fred.stlouisfed.org.invalid/data/DGS2';
  assert.throws(() => verifySources(figure, 0));
  const chart = select(tree(original), 'svg')[0];
  select(chart, 'polyline').at(-1).properties.dataDates += ',2026-09-08';
  assert.throws(() => verifySeries(chart));
});
test('FR and EN chart observations are identical', () => {
  const observations = path => select(tree(read(path)), 'polyline').map(n => n.properties);
  assert.deepEqual(observations(paths[0]), observations(paths[1]));
});
for (const path of ['dist/posts/fed-hausses-taux-longs-prime-terme/index.html', 'dist/en/analysis/fed-rate-hikes-long-yields-term-premium/index.html']) {
  test(`${path}: published inline charts survive rendering`, { skip: !existsSync(new URL(`../${path}`, import.meta.url)) }, () => {
    const svgs = select(tree(read(path)), 'svg').filter(n => String(n.properties.ariaLabelledBy).startsWith('fed-'));
    assert.equal(svgs.length, 2);
    svgs.forEach(verifySafety);
    verifySeries(svgs[0]);
  });
}
