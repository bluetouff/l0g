import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';

const project = process.env.GE_HEALTHCARE_TEST_PROJECT || process.cwd();
const require = createRequire(resolve(project, 'package.json'));
const { XMLParser, XMLValidator } = require('fast-xml-parser');
const postcss = require('postcss');
const fixture = process.env.GE_HEALTHCARE_FIXTURE_ROOT;
const root = fixture ? resolve(fixture, 'staged') : project;
const directory = resolve(root, 'public/images/ge-healthcare');
const files = readdirSync(directory).filter(name => name.endsWith('.svg')).sort();
const stems = ['f18-clock', 'factory-clock', 'network-scale', 'deal-anatomy', 'pdx-context', 'cms-gate', 'valuation-sensitivity'];
const parser = new XMLParser({ preserveOrder: true, ignoreAttributes: false, attributeNamePrefix: '', trimValues: false, parseTagValue: false, parseAttributeValue: false });
const tag = node => Object.keys(node).find(key => key !== ':@');
const attrs = node => node[':@'] || {};
const children = node => node[tag(node)] || [];
const elements = node => tag(node) === '#text' ? [] : [node, ...children(node).flatMap(elements)];
const text = node => tag(node) === '#text' ? node['#text'] : children(node).map(text).join(' ');
const number = (node, key, fallback = 0) => { const value = Number(attrs(node)[key] ?? fallback); assert.ok(Number.isFinite(value)); return value; };
const lexical = ([a], [b]) => a < b ? -1 : a > b ? 1 : 0;
const trees = new Map(files.map(name => {
  const source = readFileSync(resolve(directory, name), 'utf8');
  assert.equal(XMLValidator.validate(source), true, name);
  assert.ok(!/<!|<\?/u.test(source), 'No DTD, entity or processing instruction');
  const nodes = parser.parse(source); assert.equal(nodes.length, 1);
  return [name, nodes[0]];
}));
const native = {};
postcss.parse(readFileSync(resolve(project, 'src/styles/global.css'), 'utf8')).walkDecls(decl => {
  if (decl.parent.type === 'atrule' && decl.parent.name === 'theme') native[decl.prop] = decl.value;
});
const paint = role => `var(--color-${role}, ${native[`--color-${role}`]})`;
const tint = (role, percent) => `color-mix(in srgb, ${paint(role)} ${percent}%, ${paint('surface-2')})`;
const geometry = node => {
  if (['#text', 'title', 'desc', 'style'].includes(tag(node))) return null;
  const excluded = new Set(['fill', 'stroke', 'id', 'aria-label', 'aria-labelledby', 'marker-end', 'style', 'class', 'xmlns']);
  return [tag(node), Object.entries(attrs(node)).filter(([key]) => !excluded.has(key)).sort(lexical), children(node).map(geometry).filter(Boolean)];
};
const geometryHashes = {
  "cms-gate-en-desktop.svg": "6a67ef1e35d99d1562654a6cb6b6abf005e9b81c47f12b19c61023b8776f63b3",
  "cms-gate-en-mobile.svg": "3a915efb6177a8d4d0f425c7c9566e1e266ee94c48de74f3bb61492273b05a18",
  "deal-anatomy-en-desktop.svg": "6be40f63ff50fdf39040b85c4c2fb5a73843785512d04930f35e80e6d60c9bf4",
  "deal-anatomy-en-mobile.svg": "e6c5434df12502ecdd54b3760969e39662d3a696f5c045ed5ce94a63bdd76b5c",
  "f18-clock-en-desktop.svg": "d3d6057dfe01f95b32ce6f22d30675a0720bad1687d4da2c7257740af1a472b4",
  "f18-clock-en-mobile.svg": "4f7d5b2eff7121c6188570cdb0e8ef72db7c504b19d7d4190d9616c05c8558ac",
  "factory-clock-en-desktop.svg": "f115e018392e302d490d72746fa6eef009be2c6c10068f0f33bc3aa50a8398b8",
  "factory-clock-en-mobile.svg": "e82dd594ead5fa2cc9359c489b2d92f3afe39575a60edc69542fb0eff8b753b1",
  "network-scale-en-desktop.svg": "dccaa7bee27ec1ecd60db10886f4f3faa72ac6c4852172030d3e5b51961099ac",
  "network-scale-en-mobile.svg": "8b0ffe737b34c6bdcf5518ce9c1895f709030fe1d4c57f4ce769248e36f0a4c7",
  "pdx-context-en-desktop.svg": "a4311d00310163b9f0fa40113aaf544583af5b611280cbded51fac81b2c1f490",
  "pdx-context-en-mobile.svg": "5da54fd35ec8aa0dd3a77f70f45c750e379a47bdcf0d608241467c819cdf1996",
  "valuation-sensitivity-en-desktop.svg": "79c75a60dab32c43322375abd33b6c14de65b68f2b2eed15137457f23943e376",
  "valuation-sensitivity-en-mobile.svg": "f24b9a24638538ce8ad000a573697082960644a1d7a8844826b2cff0905aec2f",
  "cms-gate-fr-desktop.svg": "b8ec911fc5cc766ee1e263c2cca74c73f3bd0c3527e3ecbc0cb170fc639efa9f",
  "cms-gate-fr-mobile.svg": "3a915efb6177a8d4d0f425c7c9566e1e266ee94c48de74f3bb61492273b05a18",
  "deal-anatomy-fr-desktop.svg": "6be40f63ff50fdf39040b85c4c2fb5a73843785512d04930f35e80e6d60c9bf4",
  "deal-anatomy-fr-mobile.svg": "e6c5434df12502ecdd54b3760969e39662d3a696f5c045ed5ce94a63bdd76b5c",
  "f18-clock-fr-desktop.svg": "d3d6057dfe01f95b32ce6f22d30675a0720bad1687d4da2c7257740af1a472b4",
  "f18-clock-fr-mobile.svg": "4f7d5b2eff7121c6188570cdb0e8ef72db7c504b19d7d4190d9616c05c8558ac",
  "factory-clock-fr-desktop.svg": "c9c2b076069547bb6a433dc0eddfd01f3c91425ac8737283963f617c5440f7cc",
  "factory-clock-fr-mobile.svg": "e82dd594ead5fa2cc9359c489b2d92f3afe39575a60edc69542fb0eff8b753b1",
  "network-scale-fr-desktop.svg": "dccaa7bee27ec1ecd60db10886f4f3faa72ac6c4852172030d3e5b51961099ac",
  "network-scale-fr-mobile.svg": "8b0ffe737b34c6bdcf5518ce9c1895f709030fe1d4c57f4ce769248e36f0a4c7",
  "pdx-context-fr-desktop.svg": "a4311d00310163b9f0fa40113aaf544583af5b611280cbded51fac81b2c1f490",
  "pdx-context-fr-mobile.svg": "c64a433959c9f5b63a54d0a486d8d181e18e0179f2d95a4673740f6877e2a4bc",
  "valuation-sensitivity-fr-desktop.svg": "79c75a60dab32c43322375abd33b6c14de65b68f2b2eed15137457f23943e376",
  "valuation-sensitivity-fr-mobile.svg": "f24b9a24638538ce8ad000a573697082960644a1d7a8844826b2cff0905aec2f",
};

test('all 28 original compositions are present with unique inert SVG identities', () => {
  const expected = stems.flatMap(stem => ['fr', 'en'].flatMap(lang => ['desktop', 'mobile'].map(variant => `${stem}-${lang}-${variant}.svg`))).sort();
  assert.deepEqual(files, expected);
  const allowedTags = new Set('svg title desc defs marker path rect line text circle polyline'.split(' '));
  const allowedAttrs = new Set('xmlns width height viewBox role aria-labelledby id markerWidth markerHeight refX refY orient d fill x y rx stroke stroke-width text-anchor x1 y1 x2 y2 marker-end points cx cy r style font-family font-size font-weight'.split(' '));
  const allowedPaint = new Set(['none', ...['paper', 'ink', 'surface', 'surface-2', 'muted', 'line-strong', 'signal', 'amber', 'accent'].map(paint), tint('signal', 10), tint('signal', 24), tint('amber', 10), tint('amber', 18), tint('amber', 24), tint('accent', 12)]);
  const ids = new Set();
  for (const [name, tree] of trees) {
    assert.equal(tag(tree), 'svg'); assert.equal(attrs(tree).xmlns, 'http://www.w3.org/2000/svg');
    assert.equal(attrs(tree).role, 'img'); assert.equal(attrs(tree).style, 'width:100%;height:auto');
    const all = elements(tree), localIDs = new Set(all.map(node => attrs(node).id).filter(Boolean));
    const naming = attrs(tree)['aria-labelledby'].split(' '); assert.equal(naming.length, 2);
    for (const kind of ['title', 'desc']) {
      const named = all.filter(node => tag(node) === kind); assert.equal(named.length, 1);
      assert.ok(naming.includes(attrs(named[0]).id)); assert.ok(text(named[0]).trim());
    }
    for (const node of all) {
      assert.ok(allowedTags.has(tag(node)), tag(node));
      for (const [key, value] of Object.entries(attrs(node))) {
        assert.ok(allowedAttrs.has(key), key);
        if (key === 'id') { assert.ok(value.startsWith('ge-healthcare-')); assert.ok(!ids.has(value)); ids.add(value); }
        if (key === 'fill' || key === 'stroke') assert.ok(allowedPaint.has(value), value);
        if (key === 'marker-end') { const match = /^url\(#([\w-]+)\)$/u.exec(value); assert.ok(match); assert.ok(localIDs.has(match[1])); }
        else assert.ok(!String(value).includes('url('), value);
        if (key === 'style') { assert.equal(node, tree); assert.equal(value, 'width:100%;height:auto'); }
      }
      if (tag(node) === 'text') {
        assert.ok(['Inter,Arial,Helvetica,sans-serif', 'Inter,Arial'].includes(attrs(node)['font-family']));
        assert.ok(parseFloat(attrs(node)['font-size']) >= 11);
      }
    }
    assert.equal(createHash('sha256').update(JSON.stringify(geometry(tree))).digest('hex'), geometryHashes[name], name);
  }
});

test('primitive bounds and label anchors stay inside preserved desktop/mobile viewBoxes', () => {
  for (const [name, tree] of trees) {
    const [x, y, width, height] = attrs(tree).viewBox.split(' ').map(Number);
    assert.equal(x, 0); assert.equal(y, 0); assert.equal(width, name.endsWith('-mobile.svg') ? 760 : 1200);
    assert.equal(number(tree, 'width'), width); assert.equal(number(tree, 'height'), height);
    const inside = (a, b) => assert.ok(a >= 0 && a <= width && b >= 0 && b <= height, name);
    for (const node of elements(tree)) {
      if (tag(node) === 'rect') { assert.ok(number(node, 'width') >= 0 && number(node, 'height') >= 0); inside(number(node, 'x'), number(node, 'y')); inside(number(node, 'x') + number(node, 'width'), number(node, 'y') + number(node, 'height')); }
      if (tag(node) === 'line') { inside(number(node, 'x1'), number(node, 'y1')); inside(number(node, 'x2'), number(node, 'y2')); }
      if (tag(node) === 'circle') { const r = number(node, 'r'); inside(number(node, 'cx') - r, number(node, 'cy') - r); inside(number(node, 'cx') + r, number(node, 'cy') + r); }
      if (tag(node) === 'text') inside(number(node, 'x'), number(node, 'y'));
      if (tag(node) === 'polyline') for (const point of attrs(node).points.trim().split(/\s+/u)) { const pair = point.split(',').map(Number); assert.equal(pair.length, 2); assert.ok(pair.every(Number.isFinite)); inside(...pair); }
    }
  }
});

test('CMS figures use estimated daily code cost, exact strict threshold and an identified final rule', () => {
  for (const [name, tree] of trees) if (name.startsWith('cms-gate-')) {
    const copy = text(tree);
    assert.ok(copy.includes('655')); assert.ok(copy.includes('≤ $655')); assert.ok(copy.includes('> $655'));
    assert.ok(copy.includes(name.includes('-fr-') ? 'coût estimé' : 'estimated cost'));
    assert.ok(copy.includes('HCPCS'));
    assert.ok(copy.includes('2025-20907 (S13)'));
    assert.ok(copy.includes(name.includes('-fr-') ? 'Hors pass-through ; produits avec données historiques.' : 'Excludes pass-through; products with historical claims.'));
    if (name.includes('-en-')) assert.ok(!copy.includes('/ jour'));
  }
});

test('valuation bars retain hypothetical revenue scope and conventional displayed rounding', () => {
  const expected = [9.45, 6.3, 4.725, 3.78, 3.15, 2.3625];
  for (const [name, tree] of trees) if (name.startsWith('valuation-sensitivity-')) {
    const copy = text(tree); assert.ok(copy.includes('4.73×')); assert.ok(!copy.includes('4.72×'));
    assert.ok(copy.toLowerCase().includes(name.includes('-fr-') ? 'hypothétique' : 'hypothetical'));
    assert.ok(copy.toLowerCase().includes(name.includes('-fr-') ? 'estimation' : 'estimate'));
    assert.ok(copy.includes(name.includes('-fr-') ? 'non communiqués par GE' : 'GE has not disclosed'));
    const bars = elements(tree).filter(node => tag(node) === 'rect' && attrs(node).fill === paint('signal'));
    assert.equal(bars.length, 6);
    const dimension = name.endsWith('-mobile.svg') ? 'width' : 'height';
    const scale = number(bars[0], dimension) / expected[0];
    const precision = name.endsWith('-mobile.svg') ? .051 : .00001;
    bars.forEach((bar, i) => assert.ok(Math.abs(number(bar, dimension) - expected[i] * scale) < precision));
  }
});

test('deal figures bound financial-data absence to GE disclosure', () => {
  for (const [name, tree] of trees) if (name.startsWith('deal-anatomy-')) {
    const copy = text(tree);
    assert.ok(copy.includes(name.includes('-fr-') ? (name.endsWith('-mobile.svg') ? 'GE n’a pas communiqué' : 'pas communiqués par GE') : (name.endsWith('-mobile.svg') ? 'GE has not disclosed' : 'not disclosed by GE')));
    assert.ok(!copy.includes('ne sont pas publiés') && !copy.includes('not public.'));
  }
});

test('component keeps an optional native reader, integral variants and accessible data slot', () => {
  const component = readFileSync(resolve(root, 'src/components/GeHealthcareInfographic.astro'), 'utf8');
  const module = readFileSync(resolve(root, 'src/data/ge-healthcare-infographics.ts'), 'utf8');
  assert.ok(!component.includes('<script')); assert.ok(component.includes('<slot />'));
  assert.ok(component.includes('type="checkbox"')); assert.ok(component.includes('aria-controls={viewportId}'));
  assert.ok(component.includes('for={readerId}')); assert.ok(component.includes('tabindex="0"'));
  assert.ok(!component.includes('set:html={caption')); assert.ok(!component.includes(' checked'));
  assert.ok(component.includes('Object.hasOwn(geHealthcareInfographics, figure)'));
  assert.ok(component.includes('width: max(100%, 760px) !important'));
  assert.ok(component.includes('width: max(100%, 1200px) !important'));
  assert.ok(component.includes('padding-bottom: .75rem')); assert.ok(component.includes('@media (max-width: 640px)'));
  assert.equal((module.match(/\.svg\?raw/gu) || []).length, 28);
  assert.ok(module.includes("'valuation-sensitivity': { number: '07', illustrative: true"));
  assert.ok(module.includes("sourceIds: ['S13'], metric: 'CMS-estimated daily HCPCS code cost (threshold)'"));
  assert.ok(module.includes('contexte financier de l’acquéreur avant la clôture'));
  assert.ok(module.includes('financial context ahead of closing'));
  assert.ok(!module.includes('metric: ""')); assert.ok(!module.includes('sourceIds: []'));
  assert.ok(!component.includes('—') && !module.includes('—'));
});
