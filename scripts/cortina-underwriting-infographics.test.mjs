import test from 'node:test';
import assert from 'node:assert/strict';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import sharp from 'sharp';
import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import {
  CORTINA_SIMULATION,
  CORTINA_FIGURE_KINDS,
  CORTINA_FIGURE_SOURCES,
  cortinaUnderwritingSvg,
  cortinaUnderwritingFigure,
  cortinaUnderwritingFigures,
} from './cortina-underwriting-figures.mjs';

const parser = new XMLParser({ preserveOrder: true, ignoreAttributes: false, attributeNamePrefix: '', trimValues: false, parseTagValue: false, parseAttributeValue: false });
const name = node => Object.keys(node).find(key => key !== ':@');
const attrs = node => node[':@'] ?? {};
const children = node => node[name(node)] ?? [];
const elements = node => name(node) === '#text' ? [] : [node, ...children(node).flatMap(elements)];
const text = node => name(node) === '#text' ? node['#text'] : children(node).map(text).join('');
const number = (node, property, fallback = 0) => {
  const value = Number(attrs(node)[property] ?? fallback);
  assert.ok(Number.isFinite(value), `Finite ${property}`);
  return value;
};
const variants = ['fr', 'en'].flatMap(lang => ['mobile', 'desktop'].flatMap(layout => CORTINA_FIGURE_KINDS.map(kind => ({ lang, kind, layout, svg: cortinaUnderwritingSvg(lang, kind, layout) }))));
const palette = new Set(['none', ...['surface', 'paper', 'muted', 'signal', 'amber', 'accent', 'line-strong'].map(role => `var(--color-${role})`)]);

function inspect(svg) {
  assert.equal(XMLValidator.validate(svg), true, 'Valid SVG XML');
  assert.doesNotMatch(svg, /<!|<\?/u);
  const parsed = parser.parse(svg);
  assert.equal(parsed.length, 1);
  const root = parsed[0], all = elements(root), p = attrs(root);
  assert.equal(name(root), 'svg');
  assert.equal(p.xmlns, 'http://www.w3.org/2000/svg');
  assert.equal(p.role, 'img');
  assert.equal(p.style, 'width:100%;height:auto');
  assert.ok(['fr', 'en'].includes(p.lang));
  const references = p['aria-labelledby'].split(' ');
  assert.equal(references.length, 2);
  for (const kind of ['title', 'desc']) {
    const nodes = all.filter(node => name(node) === kind);
    assert.equal(nodes.length, 1);
    assert.ok(references.includes(attrs(nodes[0]).id));
    assert.ok(text(nodes[0]).trim());
  }
  const allowed = new Set(['svg', 'title', 'desc', 'g', 'rect', 'circle', 'path', 'text']);
  for (const node of all) {
    assert.ok(allowed.has(name(node)), `Inert element: ${name(node)}`);
    for (const [key, value] of Object.entries(attrs(node))) {
      assert.ok(!key.toLowerCase().startsWith('on'), 'No event handlers');
      assert.ok(!['href', 'xlink:href', 'src'].includes(key), 'No remote resources');
      assert.ok(!String(value).includes('url('), 'No referenced paint or assets');
      if (['fill', 'stroke'].includes(key)) assert.ok(palette.has(value), `Theme paint: ${value}`);
      if (key === 'style') assert.equal(node, root, 'Only the responsive root has a style attribute');
    }
  }
  return { root, all };
}

const measured = new Map();
async function glyphWidth(node) {
  const p = attrs(node), value = text(node), key = `${p['font-size']}/${p['font-weight']}/${value}`;
  if (!measured.has(key)) {
    const escaped = value.replaceAll('&', '&amp;').replaceAll('<', '&lt;');
    const source = `<svg xmlns="http://www.w3.org/2000/svg" width="8192" height="160"><text x="8" y="100" fill="white" font-family="Arial, Helvetica, sans-serif" font-size="${p['font-size']}" font-weight="${p['font-weight']}">${escaped}</text></svg>`;
    const { info } = await sharp(Buffer.from(source)).trim().raw().toBuffer({ resolveWithObject: true });
    measured.set(key, info.width + 3);
  }
  return measured.get(key);
}

function segments(d) {
  assert.match(d, /^(?:[ML]|-?\d+(?:\.\d+)?|\s)+$/u, 'Only bounded move/line paths');
  const tokens = d.match(/[ML]|-?\d+(?:\.\d+)?/gu), points = [], lines = [];
  let last;
  for (let i = 0; i < tokens.length;) {
    const command = tokens[i++];
    assert.ok(['M', 'L'].includes(command));
    const point = [Number(tokens[i++]), Number(tokens[i++])];
    assert.ok(point.every(Number.isFinite));
    if (command === 'L') {
      assert.ok(last);
      lines.push([last, point]);
    }
    points.push(point);
    last = point;
  }
  return { points, lines };
}

function intersects(line, box, padding = 2) {
  const [[x1, y1], [x2, y2]] = line, dx = x2 - x1, dy = y2 - y1;
  let enter = 0, leave = 1;
  for (const [p, q] of [[-dx, x1 - box.x + padding], [dx, box.right + padding - x1], [-dy, y1 - box.y + padding], [dy, box.bottom + padding - y1]]) {
    if (p === 0) { if (q < 0) return false; }
    else if (p < 0) enter = Math.max(enter, q / p);
    else leave = Math.min(leave, q / p);
  }
  return enter <= leave && leave >= 0 && enter <= 1;
}

async function geometry(svg) {
  const { root, all } = inspect(svg), viewBox = attrs(root).viewBox.split(' ').map(Number);
  assert.equal(viewBox.length, 4);
  const [left, top, width, height] = viewBox;
  const desktop = attrs(root)['data-layout'] === 'desktop';
  assert.equal(left, 0); assert.equal(top, 0);
  assert.equal(width, desktop ? 720 : 480);
  assert.ok(desktop ? height === 430 : height >= 700 && height <= 800, 'Canvas appropriate to its layout');
  const inside = (x, y) => assert.ok(Number.isFinite(x) && Number.isFinite(y) && x >= 0 && x <= width && y >= 0 && y <= height, `Canvas bounds: ${x},${y}`);
  for (const node of all) {
    if (name(node) === 'rect') {
      const x = number(node, 'x'), y = number(node, 'y'), w = number(node, 'width'), h = number(node, 'height');
      assert.ok(w >= 0 && h >= 0);
      inside(x, y); inside(x + w, y + h);
    }
    if (name(node) === 'circle') {
      const r = number(node, 'r') + number(node, 'stroke-width') / 2;
      assert.ok(r > 0);
      inside(number(node, 'cx') - r, number(node, 'cy') - r);
      inside(number(node, 'cx') + r, number(node, 'cy') + r);
    }
    if (name(node) === 'path') for (const point of segments(attrs(node).d).points) inside(...point);
    if (attrs(node)['data-region']) {
      const bounds = attrs(node)['data-bounds'].split(' ').map(Number);
      assert.equal(bounds.length, 4);
      assert.ok(bounds.every(Number.isFinite));
      assert.ok(bounds[2] > 0 && bounds[3] > 0);
      inside(bounds[0], bounds[1]); inside(bounds[0] + bounds[2], bounds[1] + bounds[3]);
    }
  }
  const boxes = [];
  for (const node of all.filter(item => name(item) === 'text')) {
    const p = attrs(node), value = text(node), size = number(node, 'font-size'), w = await glyphWidth(node);
    assert.equal(p['font-family'], 'Arial, Helvetica, sans-serif');
    assert.ok(size >= (desktop ? 18 : 20), `Label legibility: ${value}`);
    const x = number(node, 'x') - (p['text-anchor'] === 'middle' ? w / 2 : p['text-anchor'] === 'end' ? w : 0);
    const y = number(node, 'y'), box = { x, y: y - size * .95, right: x + w, bottom: y + 4, label: value };
    assert.ok(box.x >= 4 && box.right <= width - 4 && box.y >= 4 && box.bottom <= height - 4, `ViewBox padding: ${value}`);
    const parent = all.find(group => name(group) === 'g' && children(group).includes(node));
    assert.ok(parent && attrs(parent)['data-region'], `Semantic region: ${value}`);
    const [rx, ry, rw, rh] = attrs(parent)['data-bounds'].split(' ').map(Number);
    assert.ok(box.x >= rx + 7 && box.right <= rx + rw - 7 && box.y >= ry + 4 && box.bottom <= ry + rh - 4, `${attrs(parent)['data-region']}: ${value}; ${box.x},${box.y},${box.right},${box.bottom} in ${rx},${ry},${rw},${rh}`);
    // Region metadata also has to agree with any visible panel that owns it.
    const panel = all.find(shape => name(shape) === 'rect' && attrs(shape)['data-panel'] === attrs(parent)['data-region']);
    if (panel) assert.ok(box.x >= number(panel, 'x') + 8 && box.right <= number(panel, 'x') + number(panel, 'width') - 8 && box.y >= number(panel, 'y') + 4 && box.bottom <= number(panel, 'y') + number(panel, 'height') - 4, `Visible panel padding: ${value}`);
    for (const prior of boxes) assert.ok(!(box.x < prior.right + 4 && box.right + 4 > prior.x && box.y < prior.bottom && box.bottom > prior.y), `Label collision: ${prior.label} / ${value}`);
    // Ratios stay within their regions under the actual responsive transform.
    for (const container of desktop ? [560, 672, 720] : [272, 320, 336]) {
      const scale = container / width;
      assert.ok(box.x * scale >= (rx + 7) * scale && box.right * scale <= (rx + rw - 7) * scale, `Narrow region: ${value}`);
      assert.ok(size * scale >= (desktop ? 14 : 11), `Narrow font: ${value}`);
    }
    boxes.push(box);
  }
  for (const node of all.filter(item => attrs(item)['data-rail'] === 'true')) {
    for (const line of segments(attrs(node).d).lines) for (const box of boxes) assert.ok(!intersects(line, box), `Rail obscures: ${box.label}`);
  }
  for (const node of all.filter(item => name(item) === 'circle')) {
    const cx = number(node, 'cx'), cy = number(node, 'cy'), r = number(node, 'r') + number(node, 'stroke-width') / 2;
    for (const box of boxes) {
      const x = Math.max(box.x, Math.min(cx, box.right)), y = Math.max(box.y, Math.min(cy, box.bottom));
      assert.ok(Math.hypot(x - cx, y - cy) > r, `Symbol obscures: ${box.label}`);
    }
  }
  return { root, all };
}

function verifySimulation(svg) {
  const { all, root } = inspect(svg), bars = all.filter(node => attrs(node)['data-premium-bar'] !== undefined), ratios = all.filter(node => attrs(node)['data-cost-ratio'] !== undefined);
  assert.equal(bars.length, 2); assert.equal(ratios.length, 2);
  const expectedPremium = CORTINA_SIMULATION.leadShares.map(share => CORTINA_SIMULATION.annualProgrammePremiumUsd * share);
  for (let i = 0; i < 2; i++) {
    assert.equal(number(bars[i], 'data-premium-usd'), expectedPremium[i]);
    assert.equal(number(bars[i], 'x'), 40, 'Common zero');
    assert.equal(number(bars[i], 'width') / 400, expectedPremium[i] / 20_000_000, 'Common proportional scale');
    assert.equal(number(ratios[i], 'data-cost-ratio'), CORTINA_SIMULATION.annualExpertiseCostUsd / expectedPremium[i]);
  }
  assert.equal(number(bars[0], 'width') / number(bars[1], 'width'), 2);
  assert.equal(number(ratios[1], 'data-cost-ratio') / number(ratios[0], 'data-cost-ratio'), 2);
  const axis = all.find(node => attrs(node)['data-axis'] === 'premium-zero');
  const axisY = attrs(root)['data-layout'] === 'desktop' ? 317 : 541;
  assert.ok(axis); assert.deepEqual(segments(attrs(axis).d).points, [[40, axisY], [440, axisY]]);
  const copy = text(root);
  assert.match(copy, /USD/u);
  assert.match(copy, /ficti|[Hh]ypothetical/u);
  assert.match(copy, /constants|unchanged/u);
  assert.match(copy, /ne décrit pas Cortina|does not describe Cortina/u);
  assert.doesNotMatch(copy, /prévi|forecast|actual Cortina/u);
}

test('Both bilingual compositions are accessible, inert, internally padded and legible', async context => {
  const ids = new Set();
  for (const variant of variants) {
    await context.test(`${variant.lang}/${variant.kind}/${variant.layout}`, async () => {
      const { all } = await geometry(variant.svg);
      for (const node of all) if (attrs(node).id) {
        assert.ok(!ids.has(attrs(node).id), 'Unique bilingual accessibility IDs');
        ids.add(attrs(node).id);
      }
    });
  }
});

test('The illustrative fixed budget uses annual USD and zero-based signed-premium proportions', () => {
  assert.deepEqual(CORTINA_SIMULATION, { annualProgrammePremiumUsd: 100_000_000, annualExpertiseCostUsd: 200_000, leadShares: [.2, .1] });
  for (const variant of variants.filter(item => item.kind === 'fixed-cost')) verifySimulation(variant.svg);
});

test('Qualitative figures preserve underwriting accountability and distinguish both selection gates', () => {
  for (const variant of variants.filter(item => item.kind !== 'fixed-cost')) {
    const { all, root } = inspect(variant.svg), copy = text(root), flows = new Map(all.filter(node => attrs(node)['data-flow']).map(node => [attrs(node)['data-flow'], node]));
    assert.doesNotMatch(copy, /—|sans souscripteurs|without underwriters|blind|aveugle/u);
    if (variant.kind === 'mechanism') {
      for (const flow of ['pricing', 'contract-allocation', 'allocation-lead', 'allocation-follower', 'expertise-remuneration']) assert.ok(flows.has(flow));
      assert.equal(attrs(flows.get('expertise-remuneration'))['stroke-dasharray'], '5 7');
      assert.match(copy, /[Mm]écanisme général|[Gg]eneral underwriting/u);
      assert.match(copy, /non documentés|undocumented/u);
      assert.match(copy, /accord à préciser|agreement to define/u);
    } else {
      assert.deepEqual(all.filter(node => attrs(node)['data-gate']).map(node => attrs(node)['data-gate']), ['client', 'manager']);
      for (const flow of ['eligible-to-client', 'client-to-manager', 'manager-to-effective', 'portfolio-control', 'common-risk-eligible', 'common-risk-effective']) assert.ok(flows.has(flow));
      assert.equal(attrs(flows.get('portfolio-control'))['stroke-dasharray'], '5 7');
      const shapes = key => children(all.find(node => attrs(node)['data-node'] === key)).filter(node => name(node) === 'rect').map(node => [number(node, 'width'), number(node, 'height')]);
      assert.deepEqual(shapes('eligible-portfolio'), shapes('effective-portfolio'), 'No quantitative funnel or changed icon count');
      assert.match(copy, /qualitatif|[Qq]ualitative/u);
      assert.match(copy, /aucune largeur|neither widths/u);
      assert.match(copy, /cumuls|accumulations/u);
    }
  }
});

test('Geometry catches long translations, visible-panel failures and displaced control rails', async () => {
  const mechanism = cortinaUnderwritingSvg('en', 'mechanism');
  await assert.rejects(geometry(mechanism.replaceAll('>Who provides the expertise?<', `>${'W'.repeat(80)}<`)));
  await assert.rejects(geometry(mechanism.replace('width="364" height="100"', 'width="190" height="100"')));
  const selection = cortinaUnderwritingSvg('en', 'selection');
  await assert.rejects(geometry(selection.replace('>Limits, exclusions, accumulations<', `>${'Accumulation '.repeat(8)}<`)));
  await assert.rejects(geometry(selection.replace('M 280 582 L 424 582 L 424 423 L 395 423', 'M 280 582 L 320 582 L 320 423 L 395 423')));
  const fixed = cortinaUnderwritingSvg('fr', 'fixed-cost');
  await assert.rejects(geometry(fixed.replace('width="424" height="78"', 'width="100" height="78"')));
  const wide = cortinaUnderwritingSvg('en', 'mechanism', 'desktop');
  await assert.rejects(geometry(wide.replaceAll('>Who provides the expertise?<', `>${'W'.repeat(80)}<`)));
  await assert.rejects(geometry(wide.replace('width="206" height="164"', 'width="100" height="164"')));
  const wideSelection = cortinaUnderwritingSvg('en', 'selection', 'desktop');
  await assert.rejects(geometry(wideSelection.replace('M 632 150 L 632 123 L 414 123 L 414 130', 'M 660 174 L 628 174 L 628 311 L 414 311 L 414 307')));
});

test('Regression guards reject misleading premium scales and unsafe SVG additions', () => {
  const svg = cortinaUnderwritingSvg('fr', 'fixed-cost');
  assert.throws(() => verifySimulation(svg.replace('width="200" height="28"', 'width="400" height="28"')));
  assert.throws(() => verifySimulation(svg.replace('data-cost-ratio="0.02"', 'data-cost-ratio="0.01"')));
  assert.throws(() => verifySimulation(svg.replace('x="40" y="427" width="200"', 'x="80" y="427" width="200"')));
  for (const payload of ['<script/>', '<foreignObject/>', '<image href="https://example.com/x"/>']) assert.throws(() => inspect(svg.replace('</svg>', `${payload}</svg>`)));
  assert.throws(() => inspect(svg.replace('<svg ', '<svg onload="void(0)" ')));
  assert.throws(() => inspect(svg.replace('fill="var(--color-surface)"', 'fill="url(https://example.com/x)"')));
  assert.throws(() => inspect(svg.replace('fill="var(--color-surface)"', 'fill="#fff"')));
  assert.throws(() => cortinaUnderwritingSvg('de', 'selection'));
  assert.throws(() => cortinaUnderwritingSvg('fr', 'invented'));
  assert.throws(() => cortinaUnderwritingSvg('fr', 'selection', 'invented'));
});

test('Inline fragments retain canonical source links, annual simulation limits and readable spacing', () => {
  assert.equal(new URL(CORTINA_FIGURE_SOURCES.guidance).hostname, 'www.lloyds.com');
  assert.ok(CORTINA_FIGURE_SOURCES.guidance.endsWith('/delegated-underwriting-guidance'));
  for (const lang of ['fr', 'en']) {
    const fragments = cortinaUnderwritingFigures(lang);
    assert.equal((fragments.match(/<figure /gu) ?? []).length, 3);
    assert.equal((fragments.match(/<svg /gu) ?? []).length, 6);
    assert.equal((fragments.match(/<figcaption /gu) ?? []).length, 3);
    assert.doesNotMatch(fragments, /<script|<style|<foreignObject|overflow:\s*hidden/u);
    for (const kind of ['mechanism', 'selection']) assert.ok(cortinaUnderwritingFigure(lang, kind).includes(`href="${CORTINA_FIGURE_SOURCES.guidance}"`));
    const calculation = cortinaUnderwritingFigure(lang, 'fixed-cost');
    assert.match(calculation, /annuels|annual/u);
    assert.match(calculation, /sans donnée Cortina|not Cortina data/u);
  }
});

test('The article has bounded graphic proportions with a distinct narrow-screen composition', () => {
  const css = readFileSync(new URL('../src/styles/global.css', import.meta.url), 'utf8');
  assert.match(css, /figure\.cortina-underwriting-figure\s*\{[^}]*max-width:\s*45rem;/u);
  assert.match(css, /figure\.cortina-underwriting-figure\s*\{[^}]*padding-bottom:\s*\.8rem;/u);
  assert.match(css, /@media\s*\(max-width:\s*640px\)\s*\{\s*\.prose figure\.cortina-underwriting-figure\s*\{\s*max-width:\s*21rem;/u);
  for (const variant of variants) {
    const { root } = inspect(variant.svg);
    const [, , width, height] = attrs(root).viewBox.split(' ').map(Number);
    const cap = variant.layout === 'desktop' ? 720 : 336;
    assert.ok(height * cap / width <= (variant.layout === 'desktop' ? 430 : 550), 'Graphic fits the article at its maximum rendered width');
  }
});

test('Both sourced figure captions produce distinct evidence IDs in the article index', async () => {
  const bundled = await build({
    entryPoints: [fileURLToPath(new URL('../src/lib/article-evidence.ts', import.meta.url))],
    bundle: true, platform: 'node', format: 'esm', write: false,
  });
  const { buildArticleEvidence } = await import(`data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString('base64')}`);
  for (const lang of ['fr', 'en']) {
    const evidence = buildArticleEvidence(cortinaUnderwritingFigures(lang), {
      published: new Date('2026-10-10T10:00:00Z'),
      url: 'https://l0g.fr/posts/cortina-aon-blackstone-remuneration-souscription/',
      title: 'Cortina',
    });
    const sourced = evidence.claims.filter(claim => claim.references.some(ref => ref.href === CORTINA_FIGURE_SOURCES.guidance));
    assert.equal(sourced.length, 2);
    assert.equal(new Set(sourced.map(claim => claim.id)).size, 2, 'Different mechanisms must remain distinct in the evidence index');
  }
});
