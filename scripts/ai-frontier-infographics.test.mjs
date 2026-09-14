import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';

const articlePaths = [
  '../src/content/posts/freiner-frontiere-ia-capital-politique.mdx',
  '../src/content/posts-en/pacing-ai-frontier-capital-politics.mdx',
];
const sources = articlePaths.map(path => readFileSync(new URL(path, import.meta.url), 'utf8'));
const elements = node => [
  ...(node.type === 'element' ? [node] : []),
  ...(node.children ?? []).flatMap(elements),
];
const text = node => node.type === 'text' ? node.value : (node.children ?? []).map(text).join('');
const select = (node, tag) => elements(node).filter(candidate => candidate.tagName === tag);
const figures = source => select(fromHtml(source, { fragment: true }), 'figure');
const markup = (source, node) => source.slice(node.position.start.offset, node.position.end.offset);
const numeric = (node, property) => {
  assert.notEqual(node.properties[property], undefined, `${node.tagName} lacks ${property}`);
  const value = Number(node.properties[property]);
  assert(Number.isFinite(value), `${property} must be finite`);
  return value;
};

const expectedSources = [
  [
    'https://openai.com/index/frontier-ai-regulation/',
    'https://www.anthropic.com/responsible-scaling-policy',
    'https://www.pacingthefrontier.com/',
    'https://www.govinfo.gov/content/pkg/BILLS-119hr9914ih/pdf/BILLS-119hr9914ih.pdf',
    'https://www.bis.org/speeches/20260910-artificial-intelligence-growth-and-financial-stability-challenges-central-banks',
    'https://darioamodei.com/post/we-must-pace-the-frontier',
  ],
  [
    'https://www.sec.gov/Archives/edgar/data/1652044/000165204426000071/goog-20260630.htm',
    'https://www.sec.gov/Archives/edgar/data/1326801/000162828026050705/meta-20260630.htm',
    'https://www.sec.gov/Archives/edgar/data/1018724/000101872426000026/amzn-20260630.htm',
  ],
  [
    'https://www.bis.org/publications/qr-202603/financing-ai-infrastructure-boom-on-and-off-balance-sheet-borrowing',
    'https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm',
  ],
];

function checkSources(figure, expected) {
  const captions = select(figure, 'figcaption');
  assert.equal(captions.length, 1);
  const actual = select(captions[0], 'a').map(node => node.properties.href);
  assert.deepEqual(actual, expected);
  for (const value of actual) {
    const url = new URL(value);
    assert.equal(url.protocol, 'https:');
    assert.equal(url.username + url.password + url.search + url.hash, '');
    assert.equal(url.href, value);
  }
}

const allowedTags = new Set(['svg', 'title', 'desc', 'rect', 'text', 'line', 'circle', 'g', 'polygon']);
const allowedProperties = new Set([
  'viewBox', 'xmlns', 'role', 'ariaLabelledBy', 'style', 'id', 'x', 'y', 'width', 'height', 'fill',
  'rx', 'fontSize', 'fontWeight', 'textAnchor', 'x1', 'x2', 'y1', 'y2', 'stroke', 'strokeWidth',
  'cx', 'cy', 'r', 'points', 'dataBar', 'dataCompany', 'dataMetric', 'dataValue', 'dataFrom', 'dataTo',
]);

function checkSvg(svgMarkup) {
  assert.equal(XMLValidator.validate(svgMarkup), true, 'SVG must be well-formed XML');
  const tree = fromHtml(svgMarkup, { fragment: true });
  const svg = select(tree, 'svg');
  assert.equal(svg.length, 1);
  const root = svg[0];
  const viewBox = root.properties.viewBox.split(/\s+/u).map(Number);
  assert.deepEqual(viewBox.slice(0, 3), [0, 0, 520]);
  const height = viewBox[3];
  assert(Number.isFinite(height) && height >= 700 && height <= 850);
  assert.equal(root.properties.role, 'img');
  assert.equal(root.properties.xmlns, 'http://www.w3.org/2000/svg');
  assert.equal(root.properties.style, 'display:block;width:100%;height:auto;background:#0c0d10;border:1px solid #343945;border-radius:12px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace');
  const ids = elements(root).filter(node => node.properties.id).map(node => node.properties.id);
  assert.equal(ids.length, new Set(ids).size);
  assert.deepEqual(root.properties.ariaLabelledBy, ids);
  assert.equal(select(root, 'title').length, 1);
  assert.equal(select(root, 'desc').length, 1);
  assert(text(select(root, 'desc')[0]).length > 80);

  for (const node of elements(root)) {
    assert(allowedTags.has(node.tagName), `Unsupported element ${node.tagName}`);
    for (const [name, value] of Object.entries(node.properties)) {
      assert(allowedProperties.has(name), `Unsupported attribute ${name}`);
      if (name === 'style') assert.equal(node, root, 'Only root uses a controlled style');
      if (name === 'fill' || name === 'stroke') assert.match(value, /^#[0-9a-f]{6}$/u);
    }
  }
  const rectangles = select(root, 'rect');
  assert.deepEqual(['x', 'y', 'width', 'height'].map(p => numeric(rectangles[0], p)), [0, 0, 520, height]);
  assert.equal(rectangles[0].properties.fill, '#0c0d10');
  for (const node of rectangles) {
    const x = numeric(node, 'x'), y = numeric(node, 'y');
    const width = numeric(node, 'width'), h = numeric(node, 'height');
    assert(x >= 0 && y >= 0 && width >= 0 && h >= 0);
    assert(x + width <= 520 && y + h <= height, 'Rectangle crosses canvas');
  }
  const inside = (x, y) => assert(x >= 18 && x <= 502 && y >= 18 && y <= height - 18, 'Geometry crosses margin');
  for (const node of select(root, 'line')) {
    inside(numeric(node, 'x1'), numeric(node, 'y1'));
    inside(numeric(node, 'x2'), numeric(node, 'y2'));
  }
  for (const node of select(root, 'circle')) {
    const x = numeric(node, 'cx'), y = numeric(node, 'cy'), r = numeric(node, 'r');
    assert(r > 0);
    inside(x - r, y - r); inside(x + r, y + r);
  }
  for (const node of select(root, 'polygon')) {
    const points = node.properties.points.split(/\s+/u).map(pair => pair.split(',').map(Number));
    assert.equal(points.length, 3);
    for (const point of points) { assert.equal(point.length, 2); inside(...point); }
  }

  // Monospace estimate catches regressions; browser inspection remains required.
  const boxes = [];
  for (const node of select(root, 'text')) {
    const label = text(node), size = numeric(node, 'fontSize');
    assert(size >= 20 && size <= 26, 'Keep mobile typography readable');
    assert.equal(select(node, 'tspan').length, 0);
    const width = [...label].length * size * 0.62;
    const x = numeric(node, 'x'), y = numeric(node, 'y');
    const left = x - (node.properties.textAnchor === 'end' ? width : node.properties.textAnchor === 'middle' ? width / 2 : 0);
    const box = { left, right: left + width, top: y - size, bottom: y + size * 0.25, label };
    assert(box.left >= 18 && box.right <= 502 && box.top >= 18 && box.bottom <= height - 18, `${label} crosses text margin`);
    for (const other of boxes) {
      assert(box.right + 8 <= other.left || box.left >= other.right + 8 || box.bottom + 4 <= other.top || box.top >= other.bottom + 4, `${label} crowds ${other.label}`);
    }
    for (const panel of rectangles.slice(1).filter(n => n.properties.rx)) {
      const px = numeric(panel, 'x'), py = numeric(panel, 'y'), pw = numeric(panel, 'width'), ph = numeric(panel, 'height');
      if (x >= px && x <= px + pw && y >= py && y <= py + ph) {
        assert(box.left >= px + 18 && box.right <= px + pw - 18, `${label} crosses card padding`);
      }
    }
    boxes.push(box);
  }
  return root;
}

test('AI frontier infographics have source-linked captions, safe XML and readable internal geometry', () => {
  for (const source of sources) {
    const chartFigures = figures(source);
    assert.equal(chartFigures.length, 3);
    const ids = [];
    for (const [index, figure] of chartFigures.entries()) {
      assert.equal(figure.properties.style, 'max-width:520px;margin:2rem auto 2.5rem;padding-bottom:1.75rem');
      checkSources(figure, expectedSources[index]);
      const svg = select(figure, 'svg');
      assert.equal(svg.length, 1);
      const checked = checkSvg(markup(source, svg[0]));
      ids.push(...elements(checked).filter(n => n.properties.id).map(n => n.properties.id));
    }
    assert.equal(ids.length, new Set(ids).size);
  }
});

test('AI cash-flow bars retain their exact values and a common zero-to-100 scale', () => {
  const expected = [
    ['Alphabet', 'ocf', 84.9], ['Alphabet', 'capex', 80.6],
    ['Meta', 'ocf', 64.1], ['Meta', 'capex', 50.9],
    ['Amazon', 'ocf', 71.4], ['Amazon', 'capex', 96.3],
  ];
  for (const [language, source] of sources.entries()) {
    const figure = figures(source)[1], svg = select(figure, 'svg')[0];
    const bars = select(svg, 'rect').filter(n => n.properties.dataBar === 'true');
    assert.equal(bars.length, expected.length);
    for (const [index, bar] of bars.entries()) {
      const [company, metric, value] = expected[index];
      assert.equal(bar.properties.dataCompany, company);
      assert.equal(bar.properties.dataMetric, metric);
      assert.equal(numeric(bar, 'dataValue'), value);
      assert.equal(numeric(bar, 'x'), 28);
      assert.equal(numeric(bar, 'height'), 22);
      assert(Math.abs(numeric(bar, 'width') - value / 100 * 464) < 0.001);
      assert(text(svg).includes(value.toFixed(1).replace('.', language === 0 ? ',' : '.')));
    }
    const axis = select(svg, 'line').find(n => numeric(n, 'y1') === 688 && numeric(n, 'y2') === 688);
    assert.deepEqual(['x1', 'x2'].map(p => numeric(axis, p)), [28, 492]);
    for (const tick of ['0', '50', '100']) assert(select(svg, 'text').some(n => text(n) === tick));
    assert.match(text(figure), /définitions diffèrent|Definitions differ/);
    assert.match(text(figure), /uniquement les dépenses d’IA|not exclusively AI spending/);
  }
  assert.match(text(figures(sources[0])[1]), /Flux opérationnel/);
  assert.match(text(figures(sources[1])[1]), /OCF means operating cash flow/);
});

test('AI chronology and financing relationships retain factual scope and conditional guarantees', () => {
  for (const [language, source] of sources.entries()) {
    const [timeline, , network] = figures(source);
    assert.equal(select(timeline, 'circle').length, 6);
    assert.doesNotMatch(text(timeline), /1[ ,]?350/u);
    assert.match(text(timeline), /H\.R\. 9914/u);
    assert.match(text(timeline), /sans échelle de durée|spacing does not represent elapsed time/u);
    const relations = select(network, 'g');
    assert.deepEqual(relations.map(n => [n.properties.dataFrom, n.properties.dataTo]), [
      ['cloud', 'lab'], ['chips', 'cloud'], ['lab', 'spv'], ['supplier', 'spv'], ['lender', 'spv'],
    ]);
    for (const relation of relations) {
      assert.equal(select(relation, 'line').length, 1);
      assert.equal(select(relation, 'polygon').length, 1);
    }
    assert.match(text(network), language === 0 ? /Garantie en cas de défaut/u : /Guarantee triggered by default/u);
    assert.match(text(network), /montage universel|universal structure/u);
    assert.match(text(network), /105/u);
    assert.match(text(network), /ne constitue pas un prêt|not a loan/u);
  }
});

test('SVG validation rejects active markup, unsafe references and overflow rather than clipping', () => {
  const original = markup(sources[0], select(figures(sources[0])[0], 'svg')[0]);
  const variants = [
    original.replace('<svg ', '<svg onclick="alert(1)" '),
    original.replace('</svg>', '<script>alert(1)</script></svg>'),
    original.replace('</svg>', '<image href="https://example.invalid/image.svg"/></svg>'),
    original.replace('</svg>', '<foreignObject><div>content</div></foreignObject></svg>'),
    original.replace('x="66"', 'x="519"'),
    original.replace('font-size="20"', 'font-size="9"'),
    original.replace('fill="#5eead4"', 'fill="url(https://example.invalid/paint)"'),
    original.replace('height:auto;', 'height:auto;overflow:hidden;'),
    original.replace('width="520" height="794"', 'width="900" height="794"'),
    original.replace('</svg>', ''),
  ];
  for (const variant of variants) assert.throws(() => checkSvg(variant));
});

test('Caption source checks reject lookalike origins, credentials and altered source paths', () => {
  const original = figures(sources[0])[1];
  for (const value of [
    'https://www.sec.gov.example.invalid/Archives/edgar/data/1652044/000165204426000071/goog-20260630.htm',
    'https://www.sec.gov@example.invalid/Archives/edgar/data/1652044/000165204426000071/goog-20260630.htm',
    'https://www.sec.gov/Archives/edgar/data/1652044/other.htm',
    'javascript:alert(1)',
    expectedSources[1][0] + '?tracking=1',
  ]) {
    const changed = structuredClone(original);
    select(changed, 'a')[0].properties.href = value;
    assert.throws(() => checkSources(changed, expectedSources[1]));
  }
});
