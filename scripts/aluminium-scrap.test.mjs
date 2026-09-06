import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import vm from 'node:vm';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const scenarioContext = {};
vm.runInNewContext(
  readFileSync(join(ROOT, 'public/outils/aluminium-scrap/scenario.js'), 'utf8'),
  scenarioContext,
  { filename: 'scenario.js' },
);
const { compute } = scenarioContext.AluminiumScenario;

const articles = [
  {
    path: 'src/content/posts/dechets-aluminium-europe-exportations-recyclage.md',
    route: '/outils/aluminium-scrap/?lang=fr',
    ids: 'l0g-al-fr-',
  },
  {
    path: 'src/content/posts-en/eu-aluminium-scrap-export-restrictions-recycling.md',
    route: '/outils/aluminium-scrap/?lang=en',
    ids: 'l0g-al-en-',
  },
];

function checkScenario(input) {
  const result = compute(input);
  assert.ok(result.treated >= 0 && result.treated <= input.q + 1e-7);
  assert.ok(result.metal >= 0 && result.metal <= result.treated + 1e-7);
  assert.ok(result.residual >= -1e-7);
  assert.ok(result.unassigned >= -1e-7);
  assert.ok(Math.abs(result.balanceError) < Math.max(1, input.q) * 1e-12);
  return result;
}

test('the material-balance examples remain exact', () => {
  let result = checkScenario({ q: 100000, a: 70, c: 60000, d: 80000, y: 90 });
  assert.deepEqual(
    { metal: result.metal, residual: result.residual, unassigned: result.unassigned, binding: Array.from(result.binding) },
    { metal: 54000, residual: 6000, unassigned: 40000, binding: ['capacity'] },
  );

  result = checkScenario({ q: 100000, a: 40, c: 80000, d: 80000, y: 90 });
  assert.equal(result.metal, 36000);
  assert.deepEqual(Array.from(result.binding), ['quality']);

  result = checkScenario({ q: 100000, a: 90, c: 90000, d: 90000, y: 90 });
  assert.equal(result.metal, 81000);
  assert.deepEqual(Array.from(result.binding), ['quality', 'capacity', 'outlets']);
});

test('the material balance holds across deterministic boundary and property checks', () => {
  const boundaries = [
    { q: 0, a: 0, c: 0, d: 0, y: 0 },
    { q: 1e8, a: 100, c: 1e8, d: 1e8, y: 100 },
    { q: 100000, a: 100, c: 100000, d: 0, y: 90 },
    { q: 100000, a: 0, c: 100000, d: 100000, y: 90 },
  ];
  boundaries.forEach(checkScenario);

  let state = 601190;
  const random = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
  for (let index = 0; index < 10000; index += 1) {
    checkScenario({
      q: random() * 1e8,
      a: random() * 100,
      c: random() * 1e8,
      d: random() * 1e8,
      y: random() * 100,
    });
  }
});

test('invalid or non-finite model inputs fail closed', () => {
  const valid = { q: 100000, a: 70, c: 60000, d: 80000, y: 90 };
  for (const [key, value] of [
    ['q', -1], ['q', 1e8 + 1], ['a', 101], ['y', -1], ['c', Number.NaN],
    ['d', Number.POSITIVE_INFINITY], ['q', '1000'], ['a', undefined],
  ]) {
    assert.throws(() => compute({ ...valid, [key]: value }));
  }
  assert.throws(() => compute(null));
});

test('the standalone calculator remains local, bilingual and injection-resistant', () => {
  const html = readFileSync(join(ROOT, 'public/outils/aluminium-scrap/index.html'), 'utf8');
  const client = readFileSync(join(ROOT, 'public/outils/aluminium-scrap/calculator.js'), 'utf8');
  const css = readFileSync(join(ROOT, 'public/outils/aluminium-scrap/calculator.css'), 'utf8');

  assert.match(html, /<meta name="robots" content="noindex,follow">/u);
  assert.match(html, /<h1 data-t="title">Du déchet retenu au métal recyclé\.<\/h1>/u);
  assert.match(client, /title:'From retained scrap to recycled metal\.'/u);
  assert.ok(html.indexOf('scenario.js') < html.indexOf('calculator.js'));
  assert.match(client, /URLSearchParams\(location\.search\).*lang/u);
  assert.match(client, /\.textContent/u);
  assert.doesNotMatch(client, /innerHTML|outerHTML|insertAdjacentHTML|document\.write|\beval\s*\(|new Function|fetch\s*\(|XMLHttpRequest|localStorage|sessionStorage|document\.cookie/u);
  assert.doesNotMatch(html, /<(?:script|link)\b[^>]+(?:src|href)="(?:https?:)?\/\//iu);
  assert.match(css, /@media\s*\(max-width:/u);
  assert.match(css, /\*\{box-sizing:border-box\}/u);
  assert.match(css, /form,\.results,\.method\{min-width:0/u);
  assert.match(css, /#balance-svg\{[^}]*width:100%;height:auto/u);
});

test('both articles keep three responsive, self-contained SVGs and the shared OG image', () => {
  const seenIds = new Set();
  for (const article of articles) {
    const source = readFileSync(join(ROOT, article.path), 'utf8');
    const svgs = source.match(/<svg\b[\s\S]*?<\/svg>/gu) ?? [];

    assert.equal(svgs.length, 3, `${article.path}: expected three inline SVGs`);
    assert.match(source, /ogImage: '\/illustrations\/news\/eu-aluminium-scrap-recycling-v1\.jpg'/u);
    assert.ok(source.includes(article.route), `${article.path}: missing calculator link`);
    assert.doesNotMatch(source, /—/u, `${article.path}: em dash is forbidden`);

    for (const svg of svgs) {
      const viewBox = svg.match(/\bviewBox="([^"]+)"/u)?.[1].split(/\s+/u).map(Number);
      assert.equal(viewBox?.length, 4, `${article.path}: invalid viewBox`);
      const [minX, minY, width, height] = viewBox;
      const maxX = minX + width;
      const maxY = minY + height;
      assert.ok(width > 0 && height > 0, `${article.path}: non-positive viewBox`);
      assert.match(svg, /style="[^"]*width:100%;height:auto/u);
      assert.doesNotMatch(svg, /<foreignObject\b|<script\b|\b(?:href|src)="https?:\/\//iu);

      const labelledBy = svg.match(/aria-labelledby="([^"]+)"/u)?.[1].split(/\s+/u) ?? [];
      assert.equal(labelledBy.length, 2, `${article.path}: SVG needs title and description ids`);
      for (const id of labelledBy) {
        assert.ok(id.startsWith(article.ids), `${article.path}: unexpected SVG id ${id}`);
        assert.match(svg, new RegExp(`id="${id}"`, 'u'));
        assert.ok(!seenIds.has(id), `${article.path}: duplicate SVG id ${id}`);
        seenIds.add(id);
      }

      for (const tag of svg.matchAll(/<(?:rect|line|text|circle)\b[^>]*>/gu)) {
        const attributes = Object.fromEntries(
          [...tag[0].matchAll(/\b(x|y|x1|x2|y1|y2|cx|cy|r|width|height)="([0-9.-]+)"/gu)]
            .map((match) => [match[1], Number(match[2])]),
        );
        for (const key of ['x', 'x1', 'x2', 'cx']) {
          if (key in attributes) assert.ok(attributes[key] >= minX && attributes[key] <= maxX, `${article.path}: ${key} outside viewBox`);
        }
        for (const key of ['y', 'y1', 'y2', 'cy']) {
          if (key in attributes) assert.ok(attributes[key] >= minY && attributes[key] <= maxY, `${article.path}: ${key} outside viewBox`);
        }
        if ('x' in attributes && 'width' in attributes) assert.ok(attributes.x + attributes.width <= maxX, `${article.path}: rect crosses right edge`);
        if ('y' in attributes && 'height' in attributes) assert.ok(attributes.y + attributes.height <= maxY, `${article.path}: rect crosses bottom edge`);
        if ('cx' in attributes && 'r' in attributes) assert.ok(attributes.cx - attributes.r >= minX && attributes.cx + attributes.r <= maxX, `${article.path}: circle crosses horizontal edge`);
        if ('cy' in attributes && 'r' in attributes) assert.ok(attributes.cy - attributes.r >= minY && attributes.cy + attributes.r <= maxY, `${article.path}: circle crosses vertical edge`);
      }
    }
  }
});
