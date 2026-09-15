import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { fromHtml } from 'hast-util-from-html';
import { XMLValidator } from 'fast-xml-parser';
import { editorialSourceDomainTiers, primaryInstitutionBySlug } from '../src/config/primary-sources.ts';

const paths = [
  'src/content/posts/petrole-iranien-usdt-tether-saisie.md',
  'src/content/posts-en/iranian-oil-usdt-tether-seizure.md',
];
const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const walk = node => [node, ...(node.children ?? []).flatMap(walk)];
const select = (node, tag) => walk(node).filter(n => n.tagName === tag);
const content = node => node.type === 'text' ? node.value : (node.children ?? []).map(content).join('');
const parse = source => fromHtml(source, { fragment: true });
const complaint = 'https://www.justice.gov/usao-sdny/media/1461216/dl';
const sources = new Set([
  complaint,
  'https://www.justice.gov/usao-sdny/pr/us-attorney-seeks-forfeiture-61-million-cryptocurrency-iranian-militarys-black-market',
  'https://tether.io/news/tether-introduces-new-policy-to-strengthen-ecosystem-security/',
  'https://tether.to/en/legal/',
  'https://tether.to/en/supported-protocols/',
  'https://www.binance.com/en/blog/compliance/6264258296613630636',
  'https://www.binance.com/en/blog/compliance/519345044124745139',
  'https://www.blumenthal.senate.gov/newsroom/press/release/blumenthal-presses-binance-on-potential-misrepresentations-regarding-money-laundering-and-terrorist-financing',
  'https://www.fatf-gafi.org/en/publications/Virtualassets/targeted-report-stablecoins-unhosted-wallets.html',
]);

// Complaint p. 19, table 52, visually checked on September 15, 2026.
// Integer hundredths preserve the table's precision, not a live price or balance.
const frozen = [
  { date: '2025-06-15', cents: [150000000, 170000000, 535000000, 520000100, 400001000, 600000000, 1236916371] },
  { date: '2025-07-26', cents: [1275682422, 100783822, 1130853044] },
];
const totalCents = frozen.flatMap(row => row.cents).reduce((a, b) => a + b, 0);
assert.equal(totalCents, 6119236759);
assert.equal(3715 + 44349, 48064); // Hundredths of USD millions, two paragraph-49 periods.

function primaryDomainSet(domains) {
  assert(Array.isArray(domains), 'primary domains must be an array');
  assert(domains.every(domain => typeof domain === 'string'), 'primary domains must be strings');
  return new Set(domains);
}

test('DOJ and FATF are recognised as primary publishers with explicit institutional limits', () => {
  const primaryDomains = primaryDomainSet(editorialSourceDomainTiers.primary);
  for (const [slug, host] of [['doj-justice-americaine', 'justice.gov'], ['gafi-fatf', 'fatf-gafi.org']]) {
    assert(primaryInstitutionBySlug.get(slug).limits.length >= 2);
    assert(primaryDomains.has(host));
    assert(!primaryDomains.has(`${host}.invalid`));
    assert.equal(new URL(primaryInstitutionBySlug.get(slug).url).hostname.replace(/^www\./u, ''), host);
  }
  // Interested-party corporate statements remain distinct from institutional sources.
  assert(!primaryDomains.has('binance.com'));
  assert(!primaryDomains.has('tether.to'));
});

test('primary-domain membership rejects malformed catalogues and matches complete entries', () => {
  for (const invalid of ['justice.gov', null, {}, [42], ['justice.gov', null]]) {
    assert.throws(() => primaryDomainSet(invalid));
  }
  const valid = primaryDomainSet(['justice.gov', 'fatf-gafi.org']);
  assert(valid.has('justice.gov'));
  assert(valid.has('fatf-gafi.org'));
  for (const impostor of ['justice.gov.invalid', 'fakejustice.gov', 'justice.gov@invalid.test', 'https://justice.gov/']) {
    assert(!valid.has(impostor));
  }
  assert(!primaryDomainSet(['justice.gov.invalid']).has('justice.gov'));
});

const tags = new Set(['svg', 'title', 'desc', 'g', 'rect', 'text', 'line', 'polyline']);
const attrs = new Set(['xmlns', 'viewBox', 'role', 'ariaLabelledBy', 'style', 'id', 'x', 'y', 'width', 'height', 'rx', 'fill', 'fontSize', 'textAnchor', 'stroke', 'strokeWidth', 'x1', 'y1', 'x2', 'y2', 'points', 'dataPanel', 'dataFreeze', 'dataCount', 'dataBalance']);
function verifyGeometry(svg) {
  const vb = svg.properties.viewBox.split(' ').map(Number);
  assert.deepEqual(vb.slice(0, 3), [0, 0, 520]);
  assert([925, 666, 794].includes(vb[3]));
  assert.equal(svg.properties.style, 'display:block;width:100%;height:auto;background:#0c0d10;border-radius:16px;font-family:system-ui,sans-serif');
  assert.equal(svg.properties.role, 'img');
  assert.equal(select(svg, 'title').length, 1);
  assert.equal(select(svg, 'desc').length, 1);
  assert.deepEqual(svg.properties.ariaLabelledBy, [select(svg, 'title')[0].properties.id, select(svg, 'desc')[0].properties.id]);
  const inside = (node, box, padding) => {
    const p = node.properties;
    const size = Number(p.fontSize);
    assert(size >= 22, 'minimum label size');
    // Conservative width preflight; rendered browser bounds complement this.
    const width = [...content(node)].length * size * 0.61;
    const left = Number(p.x) - (p.textAnchor === 'middle' ? width / 2 : 0);
    assert(left >= box.x + padding && left + width <= box.x + box.width - padding,
      `internal horizontal padding: ${content(node)}`);
    assert(Number(p.y) - size >= box.y + padding && Number(p.y) + 6 <= box.y + box.height - padding,
      `internal vertical padding: ${content(node)}`);
  };
  for (const node of walk(svg).filter(n => n.type === 'element')) {
    assert(tags.has(node.tagName), `unexpected SVG tag ${node.tagName}`);
    for (const key of Object.keys(node.properties)) assert(attrs.has(key), `unexpected SVG attribute ${key}`);
    const p = node.properties;
    if (node.tagName === 'text') inside(node, { x: 0, y: 0, width: 520, height: vb[3] }, 12);
    if (node.tagName === 'rect') {
      const [x, y, width, height] = ['x', 'y', 'width', 'height'].map(key => Number(p[key]));
      assert([x, y, width, height].every(Number.isFinite));
      assert(x >= 12 && y >= 12 && width > 0 && height > 0 && x + width <= 508 && y + height <= vb[3] - 12);
    }
    if (node.tagName === 'line') {
      assert([p.x1, p.x2].every(x => Number(x) >= 12 && Number(x) <= 508));
      assert([p.y1, p.y2].every(y => Number(y) >= 12 && Number(y) <= vb[3] - 12));
    }
    if (node.tagName === 'polyline') {
      for (const pair of p.points.split(' ')) {
        const [x, y] = pair.split(',').map(Number);
        assert(Number.isFinite(x) && Number.isFinite(y) && x >= 12 && x <= 508 && y >= 12 && y <= vb[3] - 12);
      }
    }
    if (node.tagName === 'g') {
      assert.equal(select(node, 'rect').length, 1);
      assert.equal(typeof p.dataPanel, 'string');
      const rect = select(node, 'rect')[0].properties;
      const box = Object.fromEntries(['x', 'y', 'width', 'height'].map(key => [key, Number(rect[key])]));
      select(node, 'text').forEach(label => inside(label, box, 12));
      const labels = select(node, 'text');
      for (let i = 1; i < labels.length; i++) {
        const current = labels[i].properties;
        const previous = labels[i - 1].properties;
        if (Number(current.fontSize) === 22 && Number(previous.fontSize) === 22) {
          assert(Number(current.y) - Number(previous.y) >= 34, 'mobile line spacing must survive minimum-font rounding');
        }
      }
    }
  }
}
function verifyBalances(svg) {
  const bars = select(svg, 'rect').filter(n => n.properties.dataBalance !== undefined);
  assert.equal(bars.length, 2);
  for (const [i, bar] of bars.entries()) {
    const p = bar.properties;
    const amount = frozen[i].cents.reduce((a, b) => a + b, 0) / 100;
    assert.equal(p.dataFreeze, frozen[i].date);
    assert.equal(Number(p.dataCount), frozen[i].cents.length);
    assert.equal(p.dataBalance, amount.toFixed(2));
    assert.equal(Number(p.x), 48, 'common zero baseline');
    assert(Math.abs(Number(p.width) - amount / 40000000 * 400) < 0.000001, 'shared linear scale');
  }
  assert.match(content(svg).replaceAll(' ', '').replaceAll(',', ''), /61192367[.,]59USDT|6119236759USDT/u);
}
function verifySources(figure, index) {
  assert.deepEqual(select(figure, 'a').map(n => n.properties.href), [`${complaint}#page=${[16, 19, 3][index]}`]);
}
for (const path of paths) {
  test(`${path}: primary sources, chronology, safe SVG and internal panel bounds`, () => {
    const source = read(path);
    assert.doesNotMatch(source, /—|IRAN-FIG|foreignObject|<script|var\(--/u);
    assert.match(source, /ogImage: \/illustrations\/news\/iran-usdt-tether-v1\.jpg/u);
    const figures = select(parse(source), 'figure');
    assert.equal(figures.length, 3);
    const ids = new Set();
    for (const [index, figure] of figures.entries()) {
      assert.equal(figure.properties.style, 'max-width:520px;margin:2rem auto 2.75rem;padding-bottom:.5rem');
      const svg = select(figure, 'svg')[0];
      assert.equal(XMLValidator.validate(source.slice(svg.position.start.offset, svg.position.end.offset)), true);
      verifyGeometry(svg);
      verifySources(figure, index);
      for (const node of walk(svg).filter(n => n.properties?.id)) {
        assert(!ids.has(node.properties.id));
        ids.add(node.properties.id);
      }
    }
    verifyBalances(select(figures[1], 'svg')[0]);
    assert.match(content(figures[2]), /−100 \+ 100 = 0/u);
    const used = new Set([...source.matchAll(/https:\/\/[^\s<>"')]+/gu)].map(m => m[0].split('#')[0]));
    assert.deepEqual([...used].sort(), [...sources].sort());
    assert.match(source, /126[.,]1/u);
    assert.match(source, /24[.,]1/u);
    assert.match(source, /480[.,]64/u);
  });
}
test('negative cases reject panel overflow, unsafe markup, impostor sources and changed balances', () => {
  const source = read(paths[0]);
  const first = () => select(parse(source), 'svg')[0];
  verifyGeometry(first());
  const overflow = first();
  select(select(overflow, 'g')[0], 'text')[0].properties.x = 470;
  assert.throws(() => verifyGeometry(overflow));
  const longLabel = first();
  select(select(longLabel, 'g')[0], 'text')[0].children = [{ type: 'text', value: 'A'.repeat(80) }];
  assert.throws(() => verifyGeometry(longLabel));
  const vertical = first();
  select(select(vertical, 'g')[0], 'text')[0].properties.y = 120;
  assert.throws(() => verifyGeometry(vertical));
  const crowded = first();
  select(select(crowded, 'g')[0], 'text')[2].properties.y = 220;
  assert.throws(() => verifyGeometry(crowded));
  for (const tagName of ['script', 'foreignObject', 'image', 'use']) {
    const svg = first();
    svg.children.push({ type: 'element', tagName, properties: {}, children: [] });
    assert.throws(() => verifyGeometry(svg));
  }
  for (const attr of ['onLoad', 'href', 'xLinkHref']) {
    const svg = first();
    svg.properties[attr] = 'unexpected';
    assert.throws(() => verifyGeometry(svg));
  }
  const figure = select(parse(source), 'figure')[0];
  select(figure, 'a')[0].properties.href = `${complaint.replace('justice.gov', 'justice.gov.invalid')}#page=16`;
  assert.throws(() => verifySources(figure, 0));
  for (const attr of ['width', 'dataBalance', 'dataCount', 'dataFreeze']) {
    const balances = select(parse(source), 'svg')[1];
    select(balances, 'rect').find(n => n.properties.dataBalance).properties[attr] = '1';
    assert.throws(() => verifyBalances(balances));
  }
});
test('FR and EN preserve dates, observations and the replacement arithmetic', () => {
  const dates = path => [...read(path).matchAll(/(?:pubDate|updatedDate): "([^"]+)"/gu)].map(m => m[1]);
  assert.deepEqual(dates(paths[0]), dates(paths[1]));
  assert.match(read(paths[1]), new RegExp(`sourceUpdatedDate: "${dates(paths[0])[0]}"`, 'u'));
  const data = path => select(parse(read(path)), 'rect').filter(n => n.properties.dataBalance).map(n => n.properties);
  assert.deepEqual(data(paths[0]), data(paths[1]));
});
for (const path of ['dist/posts/petrole-iranien-usdt-tether-saisie/index.html', 'dist/en/analysis/iranian-oil-usdt-tether-seizure/index.html']) {
  test(`${path}: rendered figures retain safe geometry and reviewed figures`, { skip: !existsSync(new URL(`../${path}`, import.meta.url)) }, () => {
    const svgs = select(parse(read(path)), 'svg').filter(n => String(n.properties.ariaLabelledBy).startsWith('iran-'));
    assert.equal(svgs.length, 3);
    svgs.forEach(verifyGeometry);
    verifyBalances(svgs[1]);
  });
}
