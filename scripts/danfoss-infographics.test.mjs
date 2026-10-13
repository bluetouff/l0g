import test from 'node:test';
import assert from 'node:assert/strict';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { DANFOSS_FIGURE_KINDS, DANFOSS_FIGURE_SOURCES, danfossSvg, danfossFigure, danfossFigures } from './danfoss-figures.mjs';

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
const variants = ['fr', 'en'].flatMap(lang => ['mobile', 'desktop'].flatMap(layout => DANFOSS_FIGURE_KINDS.map(kind => ({ lang, kind, layout, svg: danfossSvg(lang, kind, layout) }))));
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
  const attributes = {
    svg: new Set(['xmlns', 'viewBox', 'role', 'aria-labelledby', 'style', 'class', 'data-danfoss-figure', 'data-layout', 'lang']),
    title: new Set(['id']), desc: new Set(['id']),
    g: new Set(['data-region', 'data-bounds', 'data-node']),
    rect: new Set(['x', 'y', 'width', 'height', 'rx', 'fill', 'stroke', 'stroke-width', 'data-panel']),
    circle: new Set(['cx', 'cy', 'r', 'fill', 'stroke', 'stroke-width']),
    path: new Set(['d', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'stroke-dasharray', 'data-flow', 'data-rail']),
    text: new Set(['x', 'y', 'font-family', 'font-size', 'font-weight', 'text-anchor', 'fill']),
  };
  for (const node of all) {
    assert.ok(allowed.has(name(node)), `Inert element: ${name(node)}`);
    for (const [key, value] of Object.entries(attrs(node))) {
      assert.ok(attributes[name(node)].has(key), `Unsupported ${name(node)} attribute: ${key}`);
      assert.ok(!key.toLowerCase().startsWith('on'), 'No event handlers');
      assert.ok(!['href', 'xlink:href', 'src'].includes(key), 'No remote resources');
      assert.ok(!String(value).includes('url('), 'No referenced paint or assets');
      if (['fill', 'stroke'].includes(key)) assert.ok(palette.has(value), `Theme paint: ${value}`);
      if (key === 'style') assert.equal(node, root, 'Only the responsive root has a style attribute');
    }
  }
  return { root, all };
}

test('Twelve bilingual layouts are inert, accessible and internally padded', async context => {
  assert.equal(variants.length, 12);
  const ids = new Set();
  for (const variant of variants) await context.test(`${variant.lang}/${variant.kind}/${variant.layout}`, async () => {
    const { all } = await geometry(variant.svg);
    for (const item of all) if (attrs(item).id) {
      assert.ok(!ids.has(attrs(item).id), 'Unique accessibility identifier');
      ids.add(attrs(item).id);
    }
  });
});

test('Mechanisms preserve feedback, contractual uncertainty and conditional recoveries', () => {
  for (const variant of variants) {
    const { all, root } = inspect(variant.svg), copy = text(root);
    const flows = new Map(all.filter(item => attrs(item)['data-flow']).map(item => [attrs(item)['data-flow'], attrs(item)]));
    assert.doesNotMatch(copy, /—|CVE-|50\s*°|€|USD|million|forecast/u);
    const expected = variant.kind === 'control'
      ? ['remote-access', 'authorised-setting', 'measurement', 'command', 'physical-action', 'thermal-feedback', 'alarm-notification']
      : variant.kind === 'responsibility' ? ['notice-handoff', 'scope-handoff', 'mandate-handoff', 'installation-handoff', 'verification-failed']
        : ['shared-site-0', 'shared-site-1', 'shared-site-2', 'stock-loss', 'interruption', 'stock-replenishment', 'lost-receipts', 'claim-eligibility', 'cash-stock', 'cash-interruption', 'conditional-recovery'];
    for (const flow of expected) assert.ok(flows.has(flow), `Missing mechanism: ${flow}`);
    if (variant.kind === 'control') {
      assert.match(copy, /sans reconstruction|not a reconstruction/u);
      assert.match(copy, /température à cœur|food core temperature/u);
      assert.ok(all.some(item => attrs(item)['data-node'] === 'access-boundary'));
      if (variant.layout === 'desktop') {
        assert.match(copy, /Régulateur|Controller/u);
        assert.doesNotMatch(copy, /Superviseur/u);
      }
    } else if (variant.kind === 'responsibility') {
      assert.match(copy, /sans désigner|without identifying/u);
      assert.match(copy, /même entreprise|One company/u);
      assert.equal(flows.get('verification-failed')['stroke-dasharray'], '5 6');
      assert.match(copy, /Accès · budget · fenêtre|Access · budget · window/u);
      assert.match(copy, /Test · alarmes · compte rendu|Test · alarms · report/u);
      const stages = all.filter(item => ['notice', 'scope', 'mandate', 'installation', 'verification'].includes(attrs(item)['data-node']));
      assert.equal(stages.length, 5);
    } else {
      assert.match(copy, /aucune quantité|no quantities/u);
      assert.match(copy, /conditionnels|conditional/u);
      assert.match(copy, /réduit les encaissements|reduces cash receipts/u);
      assert.match(copy, /Trésorerie|Cash under/u);
      assert.match(copy, /Froid rétabli ≠ stock reconstitué|Cooling restored ≠ stock replaced/u);
      assert.match(copy, /argent à avancer|requires new cash/u);
      assert.equal(flows.get('stock-loss')['stroke-dasharray'], '5 6');
      assert.equal(flows.get('interruption')['stroke-dasharray'], '5 6');
      assert.equal(flows.get('claim-eligibility')['stroke-dasharray'], '5 6');
      const recovery = segments(flows.get('conditional-recovery').d).lines.at(-1);
      assert.ok(variant.layout === 'mobile' ? recovery[1][1] < recovery[0][1] : recovery[1][0] < recovery[0][0], 'Conditional recovery flows into cash pressure, never out of it');
      const cash = all.find(item => attrs(item)['data-region'] === 'cash-copy');
      assert.doesNotMatch(text(cash), /Décaissements|Cash outflows/u);
      assert.equal(flows.get('conditional-recovery')['stroke-dasharray'], '5 6');
      const sites = all.filter(item => (attrs(item)['data-node'] ?? '').startsWith('site-'));
      assert.equal(sites.length, 3, 'Same symbolic site count in every layout');
    }
  }
});

test('Geometry rejects long labels and a displaced measurement rail', async () => {
  for (const layout of ['desktop', 'mobile']) {
    const svg = danfossSvg('en', 'control', layout);
    await assert.rejects(geometry(svg.replaceAll('>Refrigeration under control<', `>${'W'.repeat(80)}<`)));
  }
  const svg = danfossSvg('fr', 'control', 'desktop');
  await assert.rejects(geometry(svg.replace('M 120 283 L 300 283', 'M 28 75 L 690 75')));
  await assert.rejects(geometry(svg.replace('data-bounds="22 386 676 76"', 'data-bounds="22 386 90 76"')));
});

test('Security contract rejects active elements, referenced paint and off-theme colours', () => {
  const svg = danfossSvg('fr', 'loss');
  for (const payload of ['<script/>', '<foreignObject/>', '<image href="https://example.com/x"/>']) assert.throws(() => inspect(svg.replace('</svg>', `${payload}</svg>`)));
  assert.throws(() => inspect(svg.replace('<svg ', '<svg onload="void(0)" ')));
  assert.throws(() => inspect(svg.replace('<path ', '<path transform="translate(900 0)" ')));
  assert.throws(() => inspect(svg.replace('<text ', '<text textLength="900" ')));
  assert.throws(() => inspect(svg.replace('fill="var(--color-surface)"', 'fill="url(https://example.com/x)"')));
  assert.throws(() => inspect(svg.replace('fill="var(--color-surface)"', 'fill="#ffffff"')));
  assert.throws(() => danfossSvg('de', 'loss'));
  assert.throws(() => danfossSvg('fr', 'unknown'));
  assert.throws(() => danfossSvg('fr', 'loss', 'unknown'));
});

test('Captions source each mechanism and never imply an observed loss scale', () => {
  for (const lang of ['fr', 'en']) {
    const fragment = danfossFigures(lang);
    assert.equal(fragment.split('<figure ').length - 1, 3);
    assert.equal(fragment.split('<svg ').length - 1, 6);
    assert.equal(fragment.split('<figcaption ').length - 1, 3);
    assert.doesNotMatch(fragment, /<script|<style|<foreignObject|overflow:\s*hidden/u);
    assert.ok(danfossFigure(lang, 'control').includes(`href="${DANFOSS_FIGURE_SOURCES.controller}"`));
    assert.ok(danfossFigure(lang, 'responsibility').includes(`href="${DANFOSS_FIGURE_SOURCES.security}"`));
    assert.ok(danfossFigure(lang, 'loss').includes(`href="${DANFOSS_FIGURE_SOURCES.terms}"`));
    assert.match(danfossFigure(lang, 'loss'), /aucune couverture|coverage is not assumed/u);
  }
  for (const url of Object.values(DANFOSS_FIGURE_SOURCES)) {
    const source = new URL(url);
    assert.equal(source.protocol, 'https:');
    assert.ok(['assets.danfoss.com', 'www.danfoss.com', 'www.cert.ssi.gouv.fr'].includes(source.hostname));
    assert.equal(source.search, '');
  }
});

test('Figures stay bounded in the article with dedicated mobile composition and breathing space', () => {
  const css = readFileSync(new URL('../src/styles/danfoss-figures.css', import.meta.url), 'utf8');
  assert.match(css, /figure\.danfoss-figure\s*\{[^}]*max-width:\s*45rem;/u);
  assert.match(css, /figure\.danfoss-figure\s*\{[^}]*padding-bottom:\s*\.8rem;/u);
  assert.match(css, /@media\s*\(max-width:\s*640px\)\s*\{\s*\.prose figure\.danfoss-figure\s*\{\s*max-width:\s*21rem;/u);
  for (const { svg, layout } of variants) {
    const { root } = inspect(svg), [, , w, h] = attrs(root).viewBox.split(' ').map(Number);
    assert.ok(h * (layout === 'desktop' ? 720 : 336) / w <= 540);
  }
});

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
  assert.equal(typeof d, 'string');
  const token = /[ML]|-?\d+(?:\.\d+)?|\s+/uy;
  const tokens = [], points = [], lines = [];
  for (let cursor = 0; cursor < d.length;) {
    token.lastIndex = cursor;
    const match = token.exec(d);
    assert.ok(match, 'Only bounded move/line paths');
    cursor = token.lastIndex;
    if (match[0].trim()) tokens.push(match[0]);
  }
  assert.ok(tokens.length > 0, 'Nonempty move/line path');
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

test('Move/line paths preserve compact coordinates, decimals and separate subpaths', () => {
  assert.deepEqual(segments('M1-2L3 4'), { points: [[1, -2], [3, 4]], lines: [[[1, -2], [3, 4]]] });
  assert.deepEqual(segments(' \tM -1.25 2.5\nL 3 -4.75 M 10 20 L 30 40\r\n'), {
    points: [[-1.25, 2.5], [3, -4.75], [10, 20], [30, 40]],
    lines: [[[-1.25, 2.5], [3, -4.75]], [[10, 20], [30, 40]]],
  });
  assert.deepEqual(segments('M0 0'), { points: [[0, 0]], lines: [] });
});

test('Move/line paths reject gaps, unsupported syntax and incomplete coordinates', () => {
  for (const path of ['', ' \n', 'M', 'M1', 'M0 0L1', 'L1 2', '1 2', 'M0 0 1 2', 'M0!0', 'M0 0!', 'M1. 2', 'M0.1.2 3', 'M+1 2', 'M1,2', 'M1e2 3', 'm1 2', 'M0 0Z', 'MInfinity 2', `M${'9'.repeat(400)} 0`]) {
    assert.throws(() => segments(path), { name: 'AssertionError' });
  }
});

test('Move/line parsing stays bounded on long numeric and decimal input', () => {
  const result = spawnSync(process.execPath, ['--input-type=module', '-e', `
    import assert from 'node:assert/strict';
    ${segments.toString()}
    assert.throws(() => segments('M ' + '1'.repeat(100_000) + '!'));
    assert.throws(() => segments('M 0.' + '000.'.repeat(25_000) + '!'));
    assert.deepEqual(segments('M' + '0'.repeat(100_000) + ' 0L1 2').lines, [[[0, 0], [1, 2]]]);
  `], { encoding: 'utf8', timeout: 3000 });
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr);
});

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
  assert.equal(width, desktop ? 720 : 400);
  assert.ok(desktop ? height === 480 : height === 640, 'Canvas appropriate to its layout');
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
      assert.ok(size * scale >= (desktop ? 14 : 13), `Narrow font: ${value}`);
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
