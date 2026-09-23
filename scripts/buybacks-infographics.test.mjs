import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';
import sharp from 'sharp';

const articles = ['../src/content/posts/rachats-actions-anti-dilution-microsoft-airbus.mdx', '../src/content/posts-en/share-buybacks-anti-dilution-microsoft-airbus.mdx'].map(path => readFileSync(new URL(path, import.meta.url), 'utf8'));
const figures = articles.map(article => [...article.matchAll(/<svg\b[\s\S]*?<\/svg>/g)].map(match => match[0]));
test('bilingual page references use full words in citation labels', () => {
  // The sentence-based extractor can split abbreviated page references inside links.
  // Global claim uniqueness is independently checked by test:agent-surface after build.
  for (const article of articles) {
    assert.doesNotMatch(article, /\[[^\]\n]*\bpp?\.\s+\d[^\]\n]*\]\(/u);
  }
});
function inspect(svg) {
  assert.equal(XMLValidator.validate(svg), true);
  const nodes = [];
  function visit(node) {
    if (node.type === 'element') nodes.push(node);
    for (const child of node.children ?? []) visit(child);
  }
  visit(fromHtml(svg, { fragment: true }));
  for (const node of nodes) {
    assert(['svg', 'title', 'desc', 'rect', 'text', 'line'].includes(node.tagName));
    for (const [key, value] of Object.entries(node.properties)) {
      assert(!key.toLowerCase().startsWith('on'));
      assert(!['href', 'xLinkHref', 'src'].includes(key));
      assert(!String(value).includes('url('));
    }
  }
  assert.equal(nodes[0].properties.style, 'width:100%;height:auto');
  assert.equal(nodes[0].properties.role, 'img');
  for (const id of nodes[0].properties.ariaLabelledBy) assert(nodes.some(n => n.properties.id === id && ['title', 'desc'].includes(n.tagName) && toText(n).trim()));
  return nodes;
}
const widths = new Map();
async function labelWidth(label) {
  if (!widths.has(label)) {
    const escaped = label.replaceAll('&', '&amp;').replaceAll('<', '&lt;');
    const { info } = await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="4096" height="128"><text x="8" y="70" fill="white" font-family="Arial, Helvetica, sans-serif" font-size="21" font-weight="400">${escaped}</text></svg>`)).trim().raw().toBuffer({ resolveWithObject: true });
    widths.set(label, info.width + 3);
  }
  return widths.get(label);
}
async function geometry(svg) {
  const nodes = inspect(svg), boxes = [];
  assert.equal(nodes[0].properties.viewBox, '0 0 520 380');
  for (const node of nodes.filter(n => n.tagName === 'text')) {
    const p = node.properties, label = toText(node), w = await labelWidth(label);
    assert.equal(+p.fontSize, 21);
    assert.equal(+p.fontWeight, 400);
    const x = +p.x - (p.textAnchor === 'end' ? w : 0), y = +p.y;
    assert(x >= 16 && x + w <= 504 && y - 21 >= 8 && y + 4 <= 376, `Canvas padding: ${label}`);
    if ([124, 183, 242, 301].includes(y)) {
      if (p.textAnchor === 'end') assert(x >= 390, `Numeric column: ${label}`);
      else assert(x + w <= 360, `Label column: ${label}`);
    }
    const panel = nodes.filter(n => n.tagName === 'rect' && +n.properties.x === 16).find(n => y > +n.properties.y && y < +n.properties.y + +n.properties.height);
    if (panel) {
      const r = panel.properties;
      assert(x >= +r.x + 16 && x + w <= +r.x + +r.width - 16 && y - 21 >= +r.y + 8 && y + 4 <= +r.y + +r.height - 8, `Panel padding: ${label}`);
    }
    const box = { x, y: y - 21, right: x + w, bottom: y + 4, label };
    for (const prior of boxes) assert(!(box.x < prior.right + 8 && box.right + 8 > prior.x && box.y < prior.bottom && box.bottom > prior.y), `Labels overlap: ${prior.label} / ${label}`);
    boxes.push(box);
  }
  for (const node of nodes.filter(n => ['rect', 'line'].includes(n.tagName))) {
    const p = node.properties;
    if (node.tagName === 'rect') assert(+p.x >= 0 && +p.y >= 0 && +p.x + +p.width <= 520 && +p.y + +p.height <= 380);
    else assert(+p.x1 >= 0 && +p.x2 <= 520 && +p.y1 >= 0 && +p.y2 <= 380);
  }
}
test('four accessible static figures retain panel and viewBox padding', async () => {
  assert.deepEqual(figures.map(f => f.length), [2, 2]);
  const ids = figures.flat().flatMap(svg => inspect(svg).map(n => n.properties.id).filter(Boolean));
  assert.equal(new Set(ids).size, ids.length);
  for (const svg of figures.flat()) await geometry(svg);
});
test('SVG contract rejects active markup and external resources', () => {
  const svg = figures[0][0];
  for (const payload of ['<script/>', '<foreignObject/>', '<image href="https://example.com/x"/>']) assert.throws(() => inspect(svg.replace('</svg>', payload + '</svg>')));
  assert.throws(() => inspect(svg.replace('<svg ', '<svg onload="void(0)" ')));
  assert.throws(() => inspect(svg.replace('fill="#0c0e10"', 'fill="url(https://example.com/x)"')));
});
test('geometry rejects wide labels, column collisions and labels outside their own panel', async () => {
  await assert.rejects(geometry(figures[0][0].replace('Rachats du programme', 'W'.repeat(80))));
  await assert.rejects(geometry(figures[0][0].replace('x="496" y="124"', 'x="380" y="124"')));
  await assert.rejects(geometry(figures[0][1].replace('x="32" y="225"', 'x="12" y="225"')));
  await assert.rejects(geometry(figures[0][0].replace('x="24" y="183"', 'x="24" y="124"')));
});
test('Microsoft and Airbus arithmetic reconciles independently in both languages', () => {
  for (const set of figures) {
    const cells = inspect(set[0]).filter(n => n.tagName === 'text' && n.properties.textAnchor === 'end').map(n => Number(toText(n).replace(/[ ,]/g, '').replace('−', '-')));
    assert.deepEqual(cells, [7434, 29, -36, 7427]);
    assert.equal(cells[0] + cells[1] + cells[2], cells[3]);
  }
  assert.equal((36 / 7434 * 100).toFixed(3), '0.484');
  assert.equal((7 / 7434 * 100).toFixed(3), '0.094');
  assert.equal((29 / 36 * 100).toFixed(1), '80.6');
  assert.equal((7 / 36 * 100).toFixed(1), '19.4');
  assert.equal(7429 + 24, 7453);
  assert.equal((1169475 * 196.4258 / 1e6).toFixed(1), '229.7');
  assert.equal((1169475 / 4100000 * 100).toFixed(1), '28.5');
  assert.equal((4100000 / 792283683 * 100).toFixed(2), '0.52');
  const trades = [[195000,198.6527],[195000,195.6399],[194697,195.6325],[194778,196.4567],[195000,196.8503],[195000,195.3216]];
  const total = trades.reduce((sum,[n]) => sum+n,0);
  assert.equal(total,1169475);
  assert.equal((trades.reduce((sum,[n,p]) => sum+n*p,0)/total).toFixed(4),'196.4258');
  // The withholding disclosure is rounded to $0.1bn, not exact to $1m.
  assert(22.271 - 16.719 >= 5.55 && 22.271 - 16.719 < 5.65);
  assert.equal((100 / 105).toFixed(3), '0.952');
  assert.equal(100 + 5 - 5, 100);
});
test('bilingual publication has matching timestamps, sources and local image', async () => {
  const { load, JSON_SCHEMA } = await import('js-yaml');
  const [fr,en] = articles.map(article => load(article.split('---')[1], { schema: JSON_SCHEMA }));
  assert.equal(fr.pubDate, en.pubDate);
  assert.equal(en.sourceUpdatedDate, fr.pubDate);
  assert.equal(en.sourceArticle, 'rachats-actions-anti-dilution-microsoft-airbus');
  assert.equal(fr.ogImage, '/illustrations/news/rachats-actions-dilution-v1.jpg');
  assert.equal(fr.ogImage,en.ogImage);
  const sourceUrls = article => [...article.matchAll(/https:\/\/[^\s)"<>]+/g)].map(m => m[0]);
  assert.deepEqual([...new Set(sourceUrls(articles[0]))].sort(), [...new Set(sourceUrls(articles[1]))].sort());
  const image = await sharp(new URL('../public' + fr.ogImage, import.meta.url).pathname).metadata();
  assert.equal(image.width,1200); assert.equal(image.height,630);
  for (const article of articles) assert.doesNotMatch(article, /—|<script|<iframe|foreignObject|className=|style=\{\{/u);
});
