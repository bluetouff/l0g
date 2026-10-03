import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, realpathSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { XMLValidator, XMLParser, XMLBuilder } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';
import postcss from 'postcss';
import sharp from 'sharp';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = path => readFileSync(resolve(root, path), 'utf8');
const publications = [
  ['fr', 'src/content/posts/reserves-petrolieres-raffinage-capacites-maintenance.md'],
  ['en', 'src/content/posts-en/emergency-oil-reserves-refining-capacity-maintenance.md'],
].map(([language, path]) => ({ language, article: read(path) }));
const css = read('src/styles/reserves-refining-infographics.css');
const globalCss = read('src/styles/global.css');
const csv = Object.fromEntries(['eia-padd-2026-09-25', 'france-refined-trade-2021-2025', 'france-net-import-bridge', 'donges-publications-2026'].map(name => [name, read(`public/data/reserves-refining-${name}.csv`)]));
const assetRoot = realpathSync(resolve(root, 'public/infographies/reserves-refining'));
// Independently verified EIA table 2 and SDES reported levels. Rates use the source's unrounded inputs.
const regions = [
  [1, 'Côte Est', 'East Coast', 766, 928, 82.5],
  [2, 'Midwest', 'Midwest', 3665, 4283, 85.6],
  [3, 'Côte du Golfe', 'Gulf Coast', 9479, 9888, 95.9],
  [4, 'Rocheuses', 'Rocky Mountains', 636, 653, 97.3],
  [5, 'Côte Ouest', 'West Coast', 2125, 2275, 93.4],
];
const bridge = [
  ['2021', 0, 33.2, 33.2, 'observed-total'],
  ['imports', 33.2, 21.9, -11.3, 'calculated-contribution'],
  ['exports', 21.9, 17, -4.9, 'calculated-contribution'],
  ['2025', 0, 17, 17, 'observed-total'],
];
const panelCounts = [3, 2, 3, 3];
const elements = node => [node, ...(node.children ?? []).flatMap(elements)].filter(item => item.type === 'element');
const normalise = text => text.replace(/\s+/gu, ' ').trim();
const textOf = nodes => normalise(nodes.filter(node => node.tagName === 'text').map(node => toText(node)).join(' '));
const near = (actual, expected, message) => assert(Math.abs(Number(actual) - expected) < 1e-7, message);
const variablePaint = /^(?:none|var\(--color-(?:ink|surface(?:-2)?|paper|muted|signal|accent|amber|topic-blue|line-strong)\))$/u;
const mixPaint = /^color-mix\(in srgb, var\(--color-(signal|amber)\) 10%, var\(--color-surface\)\)$/u;
const attributes = new Set('xmlns viewBox width height role ariaLabelledBy lang style id x y rx ry cx cy r x1 x2 y1 y2 fill stroke strokeWidth strokeDashArray strokeLineCap strokeLineJoin d transform fontFamily fontSize fontWeight textAnchor markerEnd markerStart markerUnits markerWidth markerHeight refX refY orient clipPath clipPathUnits'.split(' '));

function palette(theme) {
  const values = {};
  const parsed = postcss.parse(globalCss);
  parsed.walkAtRules('theme', rule => rule.walkDecls(decl => { if (decl.prop.startsWith('--color-')) values[decl.prop] = decl.value; }));
  if (theme === 'light') parsed.walkRules(':root[data-theme="light"]', rule => rule.walkDecls(decl => { if (decl.prop.startsWith('--color-')) values[decl.prop] = decl.value; }));
  return values;
}

function tint(token, theme) {
  const colours = palette(theme);
  const rgb = colour => {
    assert.match(colour, /^#[a-f0-9]{6}$/iu);
    return [1, 3, 5].map(start => Number.parseInt(colour.slice(start, start + 2), 16));
  };
  const foreground = rgb(colours[`--color-${token}`]), background = rgb(colours['--color-surface']);
  return '#' + foreground.map((channel, i) => Math.round(channel * .1 + background[i] * .9).toString(16).padStart(2, '0')).join('');
}

function standaloneStyle(text) {
  const parsed = postcss.parse(text), tokens = ['ink', 'surface', 'surface-2', 'line-strong', 'paper', 'muted', 'signal', 'accent', 'amber', 'topic-blue'];
  assert.equal(parsed.nodes.length, 2);
  const check = (rule, theme) => {
    assert.equal(rule.type, 'rule'); assert.equal(rule.selector, ':root');
    assert(rule.nodes.every(node => node.type === 'decl' && !node.important));
    const expected = Object.fromEntries(tokens.map(token => [`--color-${token}`, palette(theme)[`--color-${token}`]]));
    expected['color-scheme'] = theme;
    assert.equal(rule.nodes.length, tokens.length + 1);
    assert.deepEqual(Object.fromEntries(rule.nodes.map(node => [node.prop, node.value])), expected, 'Standalone stylesheet defines only the exact local theme palette');
  };
  check(parsed.nodes[0], 'light');
  const media = parsed.nodes[1];
  assert.equal(media.type, 'atrule'); assert.equal(media.name, 'media'); assert.equal(media.params, '(prefers-color-scheme:dark)');
  assert.equal(media.nodes.length, 1); check(media.nodes[0], 'dark');
}

function inspect(svg, { language, theme, standalone = false } = {}) {
  assert(!/<!DOCTYPE|<!ENTITY|<\?/iu.test(svg), 'No DTD, entities or processing instructions');
  assert.equal(XMLValidator.validate(svg), true, 'Valid XML is required before any rendering');
  const nodes = elements(fromHtml(svg, { fragment: true }));
  assert.equal(nodes[0]?.tagName, 'svg');
  assert.equal(nodes.filter(node => node.tagName === 'svg').length, 1);
  const ids = nodes.filter(node => node.properties.id).map(node => node.properties.id);
  assert.equal(new Set(ids).size, ids.length);
  const colours = theme ? new Set([...Object.values(palette(theme)), tint('signal', theme), tint('amber', theme)].map(value => value.toLowerCase())) : null;
  for (const node of nodes) {
    if (node.tagName === 'style') {
      assert(standalone && !theme, 'Only complete standalone files may contain the controlled theme stylesheet');
      assert.equal(Object.keys(node.properties).length, 0);
      standaloneStyle(toText(node));
      continue;
    }
    if (node.tagName === 'metadata') {
      assert.equal(Object.keys(node.properties).length, 0);
      assert(!(node.children ?? []).some(child => child.type === 'element'), 'Source metadata contains plain JSON only');
      const metadata = JSON.parse(toText(node));
      assert.deepEqual(Object.keys(metadata).sort(), ['convention', 'edition', 'sources']);
      assert.equal(metadata.edition, '2026-10-03');
      assert(typeof metadata.convention === 'string' && metadata.convention.trim());
      assert(Array.isArray(metadata.sources) && metadata.sources.length > 0);
      for (const source of metadata.sources) {
        assert.deepEqual(Object.keys(source).sort(), ['id', 'publisher', 'reference_period', 'title', 'url']);
        assert(Object.values(source).every(value => typeof value === 'string' && value.trim()));
        assert.match(source.id, /^S\d{2}$/u);
        const url = new URL(source.url);
        assert.equal(url.protocol, 'https:'); assert(!url.username && !url.password && !url.hash);
        assert(['www.eia.gov', 'courses.ems.psu.edu', 'donges.totalenergies.fr', 'www.statistiques.developpement-durable.gouv.fr'].includes(url.hostname));
      }
      continue;
    }
    assert(['svg', 'title', 'desc', 'metadata', 'defs', 'marker', 'clipPath', 'g', 'rect', 'circle', 'ellipse', 'line', 'path', 'text'].includes(node.tagName), `Active or unsupported element: ${node.tagName}`);
    for (const [name, value] of Object.entries(node.properties)) {
      assert(attributes.has(name) || /^data[A-Z][A-Za-z0-9]*$/u.test(name), `Unsupported attribute: ${name}`);
      assert(!name.toLowerCase().startsWith('on'));
      if (['markerEnd', 'markerStart', 'clipPath'].includes(name)) {
        const ref = /^url\(#([A-Za-z0-9-]+)\)$/u.exec(String(value));
        assert(ref && ids.includes(ref[1]), 'References stay inside this SVG');
      } else assert(!String(value).toLowerCase().includes('url('));
      if (['fill', 'stroke'].includes(name)) {
        if (theme) assert(value === 'none' || colours.has(String(value).toLowerCase()), `Paint must come from the ${theme} site theme: ${value}`);
        else assert(variablePaint.test(String(value)) || mixPaint.test(String(value)), 'Semantic site paint or the controlled 10% site tint is required');
      }
      if (name === 'style') { assert.equal(node.tagName, 'svg'); assert.equal(value, 'width:100%;height:auto'); }
      if (name === 'transform') assert.match(String(value), /^translate\(-?\d+(?:\.\d+)? -?\d+(?:\.\d+)?\) scale\(\d+(?:\.\d+)?\)$/u);
      if (name === 'fontFamily') assert.equal(value, 'Arial, Helvetica, sans-serif');
    }
  }
  const properties = nodes[0].properties;
  assert.equal(nodes.filter(node => node.tagName === 'style').length, standalone ? 1 : 0);
  assert.equal(properties.xmlns, 'http://www.w3.org/2000/svg');
  assert.equal(properties.role, 'img');
  if (language) {
    if (properties.lang !== undefined) assert.equal(properties.lang, language);
    assert(ids.every(id => id.startsWith(`reserves04-${language}-`)));
  }
  const viewBox = String(properties.viewBox).split(/\s+/u).map(Number);
  assert.equal(viewBox.length, 4);
  assert(viewBox.every(Number.isFinite) && viewBox[2] > 0 && viewBox[3] > 0);
  assert(Array.isArray(properties.ariaLabelledBy) && properties.ariaLabelledBy.length === 2);
  properties.ariaLabelledBy.forEach((id, index) => {
    const named = nodes.filter(node => node.properties.id === id);
    assert.equal(named.length, 1);
    assert.equal(named[0].tagName, index ? 'desc' : 'title');
    assert(normalise(toText(named[0])));
  });
  return { nodes, viewBox };
}

function localAsset(url) {
  assert.match(url, /^\/infographies\/reserves-refining\/(?:panels\/)?[a-z0-9.-]+\.svg$/u);
  const actual = realpathSync(resolve(root, 'public', url.slice(1)));
  assert(actual.startsWith(assetRoot + sep), 'Referenced files stay inside the publication asset directory');
  return readFileSync(actual, 'utf8');
}

function figureParts(article) {
  const fragments = [...article.matchAll(/<figure\b[\s\S]*?<\/figure>/gu)].map(match => match[0]);
  assert.equal(fragments.length, 4, 'All four original explanatory compositions remain present');
  assert.equal([...article.matchAll(/<svg\b/gu)].length, 4, 'Only complete wide SVGs are inline');
  return fragments.map((fragment, index) => {
    const nodes = elements(fromHtml(fragment, { fragment: true }));
    assert.deepEqual(nodes[0].properties.className, ['infographic', 'l0g-reserves04-figure']);
    assert.equal(Number(nodes[0].properties.dataFigure), index + 1);
    const byClass = name => nodes.filter(node => node.properties.className?.includes(name));
    const wide = byClass('rsv04-wide');
    assert.equal(wide.length, 1);
    assert.equal(elements(wide[0]).filter(node => node.tagName === 'svg').length, 1);
    const svgNodes = new Set(elements(wide[0]).filter(node => node.tagName === 'svg').flatMap(elements));
    const htmlAttributes = new Set('className dataFigure id ariaLabel ariaDescribedBy role tabIndex dataPanel src width height loading decoding alt href target rel'.split(' '));
    for (const node of nodes.filter(node => !svgNodes.has(node))) {
      assert(['figure', 'div', 'p', 'img', 'nav', 'a', 'figcaption'].includes(node.tagName), 'Figure HTML has no active markup');
      assert(Object.keys(node.properties).every(name => htmlAttributes.has(name)), 'Figure HTML attributes remain controlled');
      if (node.properties.target !== undefined) {
        assert.equal(node.properties.target, '_blank');
        assert(node.properties.rel?.includes('noopener') && node.properties.rel.includes('noreferrer'));
      }
    }
    const gallery = byClass('rsv04-gallery');
    assert.equal(gallery.length, 1);
    assert.equal(gallery[0].properties.role, 'region');
    assert.equal(gallery[0].properties.tabIndex, 0);
    assert(normalise(gallery[0].properties.ariaLabel));
    const hints = byClass('rsv04-scroll-hint');
    assert.equal(hints.length, 1);
    assert(normalise(toText(hints[0])));
    assert.deepEqual(gallery[0].properties.ariaDescribedBy, [hints[0].properties.id]);
    const panels = byClass('rsv04-panel');
    assert.equal(panels.length, panelCounts[index]);
    const panelIds = panels.map(panel => panel.properties.id);
    assert(panelIds.every(Boolean) && new Set(panelIds).size === panelIds.length);
    panels.forEach((panel, panelIndex) => {
      assert.equal(panel.properties.role, 'group');
      assert.equal(Number(panel.properties.dataPanel), panelIndex + 1);
      const images = elements(panel).filter(node => node.tagName === 'img');
      assert.equal(images.length, 2);
      assert.deepEqual(images.map(node => node.properties.className), [['rsv04-panel-dark'], ['rsv04-panel-light']]);
      images.forEach(image => {
        assert(normalise(image.properties.alt));
        assert.equal(Number(image.properties.width), 400);
        assert(Number(image.properties.height) > 0 && Number(image.properties.height) * 350 / 400 <= 500, 'Mobile panels fit without an oversized vertical graphic');
      });
    });
    const pagination = byClass('rsv04-pagination');
    assert.equal(pagination.length, 1);
    assert.deepEqual(elements(pagination[0]).filter(node => node.tagName === 'a').map(node => node.properties.href), panelIds.map(id => `#${id}`));
    const complete = byClass('rsv04-full-link');
    assert.equal(complete.length, 2, 'Complete wide and mobile compositions remain available');
    const fullLinks = complete.flatMap(node => elements(node).filter(child => child.tagName === 'a'));
    assert.equal(fullLinks.length, 2);
    fullLinks.forEach(link => inspect(localAsset(link.properties.href), { standalone: true }));
    const mobileLink = fullLinks.find(link => link.properties.href.endsWith('.mobile.svg'));
    assert(mobileLink);
    const captions = nodes.filter(node => node.tagName === 'figcaption');
    assert.equal(captions.length, 1);
    assert(normalise(toText(captions[0])));
    const wideLink = fullLinks.find(link => !link.properties.href.endsWith('.mobile.svg'));
    assert(wideLink);
    return { fragment, nodes, panels, caption: normalise(toText(captions[0])), fullPaths: fullLinks.map(link => link.properties.href), fullWideSvg: localAsset(wideLink.properties.href), mobileSvg: localAsset(mobileLink.properties.href), svg: [...fragment.matchAll(/<svg\b[\s\S]*?<\/svg>/gu)][0][0] };
  });
}

function csvRows(text, expectedHeader) {
  const rows = [], row = [];
  let cell = '', quoted = false, closed = false;
  for (let i = 0; i < text.length; i++) {
    const character = text[i];
    if (quoted) {
      if (character === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (character === '"') { quoted = false; closed = true; }
      else cell += character;
    } else if (character === '"') { assert(cell === '' && !closed); quoted = true; }
    else if (character === ',' || character === '\n' || character === '\r') {
      row.push(cell); cell = ''; closed = false;
      if (character !== ',') {
        if (character === '\r' && text[i + 1] === '\n') i++;
        rows.push([...row]); row.length = 0;
      }
    } else { assert(!closed); cell += character; }
  }
  assert(!quoted, 'Unclosed CSV field');
  if (cell || row.length || closed) { row.push(cell); rows.push([...row]); }
  assert.deepEqual(rows.shift(), expectedHeader);
  assert(rows.every(values => values.length === expectedHeader.length));
  return rows.map(values => Object.fromEntries(expectedHeader.map((name, i) => [name, values[i]])));
}

function checkCss(text) {
  const parsed = postcss.parse(text), rules = [];
  parsed.walkAtRules(rule => {
    assert.equal(rule.name, 'media', 'No imports, external fonts or active stylesheet resources');
    assert(['(max-width: 640px)', '(prefers-reduced-motion: reduce)'].includes(rule.params));
  });
  parsed.walkRules(rule => {
    for (const selector of rule.selectors) assert.match(selector, /^(?:(?::root|html)\[data-theme=["']light["']\]\s+)?(?:\.prose\s+)?(?:figure)?\.l0g-reserves04-figure(?:[\s.:[>]|$)/u, 'Styles cannot affect neighbouring articles');
    rules.push(rule);
  });
  parsed.walkDecls(decl => {
    assert(!decl.important);
    assert(!/(?:url\s*\(|expression\s*\(|javascript:)/iu.test(decl.value));
    if (decl.prop === 'position') assert(!['fixed', 'sticky'].includes(decl.value));
    if (decl.prop === 'height') assert.equal(decl.value, 'auto');
  });
  const declarations = selector => Object.fromEntries(rules.filter(rule => rule.selector === selector).flatMap(rule => rule.nodes.filter(node => node.type === 'decl').map(node => [node.prop, node.value])));
  const galleryRule = rules.find(rule => rule.selector.endsWith(' .rsv04-gallery'));
  assert(galleryRule, 'Mobile gallery styles are present');
  const gallery = declarations(galleryRule.selector);
  assert.equal(gallery.display, 'flex');
  assert.equal(gallery['overflow-x'], 'auto');
  assert.match(gallery['scroll-snap-type'], /^x (?:mandatory|proximity)$/u);
  assert.equal(gallery['max-width'], '100%');
  const panelRule = rules.find(rule => rule.selector.endsWith(' .rsv04-panel'));
  assert(panelRule);
  assert.equal(declarations(panelRule.selector)['scroll-snap-align'], 'start');
  const imageRule = rules.find(rule => rule.selectors.some(selector => /\.rsv04-panel > img$/u.test(selector)));
  assert(imageRule);
  assert.equal(declarations(imageRule.selector).width, '100%');
  assert.equal(declarations(imageRule.selector).height, 'auto');
  const mobileQuery = parsed.nodes.find(node => node.type === 'atrule' && node.params === '(max-width: 640px)');
  assert(mobileQuery);
  const mobileRules = mobileQuery.nodes.filter(node => node.type === 'rule');
  const mobileDecl = suffix => Object.fromEntries(mobileRules.filter(rule => rule.selector.endsWith(suffix)).flatMap(rule => rule.nodes.filter(node => node.type === 'decl').map(node => [node.prop, node.value])));
  assert.equal(mobileDecl(' .rsv04-wide').display, 'none');
  assert.equal(mobileDecl(' .rsv04-mobile').display, 'block');
  assert.equal(Number.parseFloat(mobileDecl(' .rsv04-mobile')['max-width']) * 16, 350, '350px natural panel width caps visible image height');
  assert.equal(mobileDecl(' .rsv04-mobile')['max-width'], '21.875rem');
  assert(rules.some(rule => rule.selector.endsWith(' .rsv04-mobile') && rule.parent.type === 'root' && rule.nodes.some(node => node.prop === 'display' && node.value === 'none')));
  assert(rules.some(rule => rule.selector.endsWith('figcaption') || rule.nodes.some(node => node.prop === 'padding-bottom' && Number.parseFloat(node.value) > 0)), 'Graphs retain spacing from following text');
}

const metrics = new Map();
async function wideGeometry(svg, language) {
  const inspected = inspect(svg, { language }), [, , width, height] = inspected.viewBox;
  assert.equal(inspected.viewBox[0], 0); assert.equal(inspected.viewBox[1], 0);
  const boxes = [];
  const visit = async (node, transform = { x: 0, y: 0, scale: 1 }) => {
    if (node.properties?.transform) {
      const values = node.properties.transform.match(/-?\d+(?:\.\d+)?/gu).map(Number);
      const [x, y, scale] = values;
      assert(scale > 0 && scale <= 2);
      transform = { x: transform.x + x * transform.scale, y: transform.y + y * transform.scale, scale: transform.scale * scale };
    }
    if (node.tagName === 'text') {
      const p = node.properties, size = Number(p.fontSize), text = toText(node);
      assert(Number.isFinite(size) && size >= 12 && size <= 72, 'Original small captions and readable body typography remain bounded');
      assert([400, 500, 600, 700].includes(Number(p.fontWeight)));
      assert(['start', 'middle', 'end'].includes(p.textAnchor));
      const key = `${size}/${p.fontWeight}/${p.textAnchor}/${text}`;
      if (!metrics.has(key)) {
        const tree = [{ svg: [{ text: [{ '#text': text }], ':@': { '@_x': 4096, '@_y': 70, '@_fill': 'white', '@_font-family': 'Arial, Helvetica, sans-serif', '@_font-size': size, '@_font-weight': p.fontWeight, '@_text-anchor': p.textAnchor } }], ':@': { '@_xmlns': 'http://www.w3.org/2000/svg', '@_width': 8192, '@_height': 128 } }];
        const fixture = new XMLBuilder({ ignoreAttributes: false, preserveOrder: true }).build(tree);
        const { info } = await sharp(Buffer.from(fixture)).trim().raw().toBuffer({ resolveWithObject: true });
        const left = -info.trimOffsetLeft - 4096, top = -info.trimOffsetTop - 70;
        metrics.set(key, { left, right: left + info.width, top, bottom: top + info.height });
      }
      const m = metrics.get(key), x = transform.x + Number(p.x) * transform.scale, y = transform.y + Number(p.y) * transform.scale;
      const box = { left: x + m.left * transform.scale, right: x + m.right * transform.scale, top: y + m.top * transform.scale, bottom: y + m.bottom * transform.scale, text };
      assert(box.left >= 2 && box.right <= width - 2 && box.top >= 2 && box.bottom <= height - 2, `Wide label leaves its viewBox: ${text}`);
      boxes.push(box);
    }
    for (const child of node.children ?? []) if (child.type === 'element') await visit(child, transform);
  };
  await visit(inspected.nodes[0]);
  for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
    const a = boxes[i], b = boxes[j];
    assert(!(a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top), `Wide labels overlap: ${a.text} / ${b.text}`);
  }
  // Change only parsed root attributes and theme values for a padded local render.
  // Deliberate mobile crops are audited separately and never subjected to this check.
  const tree = new XMLParser({ ignoreAttributes: false, preserveOrder: true }).parse(svg);
  Object.assign(tree[0][':@'], { '@_viewBox': `-64 -64 ${width + 128} ${height + 128}`, '@_width': width + 128, '@_height': height + 128 });
  delete tree[0][':@']['@_style'];
  const colours = palette('dark');
  const resolvePaint = node => {
    if (node[':@']) for (const name of ['@_fill', '@_stroke']) if (typeof node[':@'][name] === 'string') {
      const mix = mixPaint.exec(node[':@'][name]);
      if (mix) node[':@'][name] = tint(mix[1], 'dark');
      else node[':@'][name] = node[':@'][name].replace(/var\((--color-[a-z0-9-]+)\)/gu, (_, token) => { assert(colours[token]); return colours[token]; });
    }
    for (const value of Object.values(node)) if (Array.isArray(value)) value.forEach(resolvePaint);
  };
  tree.forEach(resolvePaint);
  const padded = new XMLBuilder({ ignoreAttributes: false, preserveOrder: true }).build(tree);
  const { data, info } = await sharp(Buffer.from(padded)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    if (x >= 64 && x < width + 64 && y >= 64 && y < height + 64) continue;
    assert.equal(data[(y * info.width + x) * info.channels + 3], 0, 'Painted wide geometry remains inside its viewBox');
  }
}

function mutate(source, before, after) {
  assert(source.includes(before), `Mutation fixture must match: ${before}`);
  return source.replace(before, after);
}

function dataCsv(files = csv) {
  const eia = csvRows(files['eia-padd-2026-09-25'], ['padd', 'fr', 'en', 'gross_inputs_kbd', 'operable_capacity_kbd', 'utilisation_percent']);
  assert.equal(eia.length, 5);
  eia.forEach((row, i) => assert.deepEqual([Number(row.padd), row.fr, row.en, Number(row.gross_inputs_kbd), Number(row.operable_capacity_kbd), Number(row.utilisation_percent)], regions[i]));
  assert.equal(eia.reduce((sum, row) => sum + Number(row.operable_capacity_kbd), 0), 18027);
  assert.equal(eia.reduce((sum, row) => sum + Number(row.gross_inputs_kbd), 0), 16671, 'Independently rounded regional sum remains distinct from the published US total of 16670');
  eia.forEach(row => {
    const gross = Number(row.gross_inputs_kbd), capacity = Number(row.operable_capacity_kbd), rate = Number(row.utilisation_percent);
    // Both displayed inputs and rates are rounded independently; require compatible intervals.
    assert((gross - .5) / (capacity + .5) * 100 < rate + .05);
    assert((gross + .5) / (capacity - .5) * 100 >= rate - .05);
  });
  const trade = csvRows(files['france-refined-trade-2021-2025'], ['year', 'imports_mtoe', 'exports_mtoe', 'net_imports_mtoe', 'provisional']);
  assert.equal(trade.length, 2);
  trade.forEach((row, i) => {
    assert.deepEqual([Number(row.year), Number(row.imports_mtoe), Number(row.exports_mtoe), Number(row.net_imports_mtoe), row.provisional], i ? [2025, 34.5, 17.5, 17, 'True'] : [2021, 45.8, 12.6, 33.2, 'False']);
    near(Number(row.imports_mtoe) - Number(row.exports_mtoe), Number(row.net_imports_mtoe), 'Net imports retain the same annual scope and energy unit');
  });
  const steps = csvRows(files['france-net-import-bridge'], ['step', 'start', 'end', 'value', 'kind']);
  assert.equal(steps.length, 4);
  steps.forEach((row, i) => {
    assert.deepEqual([row.step, Number(row.start), Number(row.end), Number(row.value), row.kind.replaceAll('_', '-')], bridge[i]);
    near(Number(row.end) - Number(row.start), Number(row.value), 'Every bridge step reconciles its endpoints');
  });
  near(Number(trade[1].imports_mtoe) - Number(trade[0].imports_mtoe), Number(steps[1].value));
  near(-(Number(trade[1].exports_mtoe) - Number(trade[0].exports_mtoe)), Number(steps[2].value));
  near(Number(steps[0].value) + Number(steps[1].value) + Number(steps[2].value), Number(steps[3].value));
  const notices = csvRows(files['donges-publications-2026'], ['publication_date', 'event_date', 'status', 'source']);
  assert.deepEqual(notices.map(row => Object.values(row)), [
    ['2026-04-23', '', 'reported_shutdown_manoeuvres', 'S02'],
    ['2026-06-23', '', 'reported_phased_restart', 'S03'],
    ['2026-08-03', '', 'reported_continuing_restart', 'S04'],
    ['2026-08-09', '2026-08-10', 'announced_next_day_startup', 'S05'],
  ], 'Publication dates, planned operations and reported status remain separate');
}

function inspectData(svg, language, standalone = false) {
  return inspect(svg, { language, standalone });
}

function refiningCapacity(svg, language, standalone = false) {
  const { nodes, viewBox } = inspectData(svg, language, standalone);
  const properties = nodes[0].properties;
  assert.equal(properties.dataDiagram, 'refining-operable-capacity');
  assert.equal(properties.dataWeekEnded, '2026-09-25');
  assert.equal(properties.dataPublicationDate, '2026-09-30');
  assert.equal(properties.dataUnit, 'million-barrels-per-day');
  const bars = nodes.filter(node => node.tagName === 'rect' && node.properties.dataValue !== undefined);
  assert.equal(bars.length, 10, 'Five PADDs retain both gross inputs and capacity');
  let zero, scale;
  const ordered = [];
  regions.forEach(([padd, fr, en, gross, capacity, rate]) => {
    const pair = bars.filter(node => Number(node.properties.dataPadd) === padd);
    assert.equal(pair.length, 2);
    for (const [metric, amount] of [['operable-capacity', capacity], ['gross-inputs', gross]]) {
      const bar = pair.find(node => node.properties.dataMetric === metric);
      assert(bar);
      near(bar.properties.dataValue, amount / 1000, 'SVG converts kbd to million barrels/day exactly once');
      near(bar.properties.dataUtilisation, rate, 'Published utilization remains distinct from a rounded-input recalculation');
      if (zero === undefined) { zero = Number(bar.properties.x); scale = Number(bar.properties.width) / (amount / 1000); }
      near(bar.properties.x, zero, 'Every region shares zero');
      near(bar.properties.width, scale * amount / 1000, 'Regions use one absolute linear scale');
      ordered.push(bar);
    }
    near(pair[0].properties.y, Number(pair[1].properties.y), 'Inputs overlay the same capacity bar');
    assert(Number(pair[0].properties.width) >= Number(pair[1].properties.width));
    assert(textOf(nodes).includes(language === 'fr' ? fr : en));
  });
  assert(new Set(ordered.filter(node => node.properties.dataMetric === 'operable-capacity').map(node => node.properties.y)).size === 5, 'Distinct systems remain separate rows');
  const visible = textOf(nodes);
  for (const value of ['92.5', '82.5', '85.6', '95.9', '97.3', '93.4', '16.670', '18.027']) assert(visible.replaceAll(',', '.').includes(value), `Visible EIA value retained: ${value}`);
  assert.match(visible, language === 'fr' ? /capacité opérable/iu : /operable capacity/iu);
  const desc = toText(nodes.find(node => node.tagName === 'desc'));
  assert.match(desc, language === 'fr' ? /arrondis indépendants/u : /independently rounded/u);
  assert.match(desc, language === 'fr' ? /ne chiffre pas.*diesel/u : /does not (?:quantify|measure).*diesel/u);
  if (viewBox[2] > 400) {
    const ticks = nodes.filter(node => node.tagName === 'text' && /^(?:0|2|4|6|8|10)$/u.test(normalise(toText(node))));
    assert.equal(ticks.length, 6);
    ticks.forEach(tick => near(tick.properties.x, zero + scale * Number(toText(tick)), 'The labelled axis matches the shared bar scale'));
  }
}

function importBridge(svg, language, standalone = false) {
  const { nodes, viewBox } = inspectData(svg, language, standalone), properties = nodes[0].properties;
  assert.equal(properties.dataDiagram, 'net-refined-import-bridge');
  assert.equal(properties.dataUnit, 'million-tonnes-oil-equivalent');
  assert.equal(properties.dataScope, 'france-five-overseas-departments-refined-products');
  assert.equal(Number(properties.dataProvisionalYear), 2025);
  const bars = nodes.filter(node => node.tagName === 'rect' && node.properties.dataValue !== undefined);
  assert.equal(bars.length, 4);
  const vertical = viewBox[2] > 400;
  let scale, zero;
  bars.forEach((bar, i) => {
    const p = bar.properties, expected = bridge[i];
    assert.deepEqual([String(p.dataStep), Number(p.dataStart), Number(p.dataEnd), Number(p.dataValue), p.dataKind], expected);
    const length = Number(p[vertical ? 'height' : 'width']);
    if (i === 0) {
      scale = length / Math.abs(expected[3]);
      zero = vertical ? Number(p.y) + length : Number(p.x);
    }
    near(length, scale * Math.abs(expected[3]), 'Each contribution retains its linear size');
    near(p[vertical ? 'y' : 'x'], vertical ? zero - scale * Math.max(expected[1], expected[2]) : zero + scale * Math.min(expected[1], expected[2]), 'Bridge columns connect the correct inventory-independent endpoints');
  });
  const visible = textOf(nodes), desc = toText(nodes.find(node => node.tagName === 'desc'));
  assert.match(visible, /2021/u); assert.match(visible, /2025/u);
  assert.match(desc, language === 'fr' ? /contributions intermédiaires, pas années observées/iu : /intermediate (?:contributions|bars are contributions), not observed years/iu);
  assert.match(visible, language === 'fr' ? /provisoire/u : /provisional/u);
  assert(!/\b32\s*%/u.test(visible), 'Inconsistent SDES source percentage is never drawn');
}

function processComposition(svg, language, standalone = false) {
  const { nodes } = inspectData(svg, language, standalone);
  assert.equal(nodes[0].properties.dataDiagram, 'refining-dependencies');
  assert(!nodes.some(node => node.properties.dataValue !== undefined), 'General refining pathways remain qualitative');
  const visible = textOf(nodes), desc = toText(nodes.find(node => node.tagName === 'desc'));
  for (const label of language === 'fr' ? ['BRUT', 'DISTILLATION', 'HYDROTRAITEMENT', 'HYDROCRAQUAGE', 'HYDROGÈNE', 'GAZOLE'] : ['CRUDE', 'DISTILLATION', 'HYDROTREATING', 'HYDROCRACKING', 'HYDROGEN', 'DIESEL', 'JET']) assert(visible.toUpperCase().includes(label));
  assert.match(desc, language === 'fr' ? /ne décrit pas Donges/u : /does not describe Donges|not a diagram of Donges/u);
  assert.match(desc, language === 'fr' ? /Aucun rendement/u : /No yield/u);
  const flows = nodes.filter(node => node.tagName === 'path' && node.properties.markerEnd);
  assert(flows.length >= 8, 'Branching plant equipment, treatment and finished-product routes remain a mechanism');
  const hydrogen = flows.filter(node => node.properties.stroke === 'var(--color-amber)' && node.properties.strokeDashArray);
  assert.equal(hydrogen.length, 2, 'Shared hydrogen supply continues to feed both processing routes');
  hydrogen.forEach(node => assert(String(node.properties.strokeDashArray).trim(), 'Hydrogen dependencies retain a distinct dashed visual channel'));
  assert.match(visible, language === 'fr' ? /sites équipés|Sur les sites équipés/u : /Where installed|where installed/u);
}

function dongesComposition(svg, language, standalone = false) {
  const { nodes, viewBox } = inspectData(svg, language, standalone);
  assert.equal(nodes[0].properties.dataDiagram, 'donges-selected-notices');
  assert(!nodes.some(node => node.properties.dataValue !== undefined), 'Operator notices do not become production observations');
  const visible = textOf(nodes), desc = toText(nodes.find(node => node.tagName === 'desc'));
  for (const label of language === 'fr' ? ['23 AVRIL', '23 JUIN', '3 AOÛT', '9 AOÛT', '10 août'] : ['23 APRIL', '23 JUNE', '3 AUGUST', '9 AUGUST', '10 August']) assert(visible.includes(label));
  assert.match(desc, language === 'fr' ? /dates de publication.*opérations (?:prévues|annoncées)/iu : /publication dates.*scheduled operations/iu);
  assert.match(visible, language === 'fr' ? /annonces|annoncées/u : /announced|announcements|scheduled/u);
  assert.match(desc, language === 'fr' ? /Aucune durée d’arrêt total|Aucun.*arrêt total/iu : /No full-shutdown duration/u);
  if (viewBox[2] > 400) {
    const points = nodes.filter(node => node.tagName === 'circle');
    assert.equal(points.length, 4);
    const dates = ['2026-04-23', '2026-06-23', '2026-08-03', '2026-08-09'].map(date => Date.parse(date));
    const scale = (Number(points[3].properties.cx) - Number(points[0].properties.cx)) / (dates[3] - dates[0]);
    assert(scale > 0);
    points.forEach((point, i) => near(point.properties.cx, Number(points[0].properties.cx) + (dates[i] - dates[0]) * scale, 'Wide notice markers follow publication dates, not equal-time production steps'));
  } else assert.match(visible, language === 'fr' ? /espacement éditorial|espac[ée].*lecture/iu : /editorial spacing|spaced for readability/iu);
}

function captions(figure, index, language) {
  const { caption, nodes } = figure;
  const links = nodes.filter(node => node.tagName === 'a').map(node => node.properties.href);
  for (const id of [[6, 8, 22, 24], [12, 13, 14], [2, 3, 4, 5], [18, 19]][index]) assert(links.includes(`#source-s${String(id).padStart(2, '0')}`), 'Each composition retains its own primary source anchors');
  if (index === 0) {
    assert.match(caption, /Donges/u);
    assert.match(caption, language === 'fr' ? /qualitatif/iu : /qualitative/iu);
  } else if (index === 1) {
    assert.match(caption, /2026/u);
    assert.match(caption, language === 'fr' ? /millions de barils|millions.*b\/j/u : /million barrels/u);
    assert.match(caption, /arrondi|round/iu);
  } else if (index === 2) {
    assert.match(caption, language === 'fr' ? /publication/u : /publication/u);
    assert.match(caption, /2026/u);
  } else {
    assert.match(caption + ' ' + textOf(nodes), /2021/u); assert.match(caption, /2025/u);
    assert.match(caption, language === 'fr' ? /provisoire/u : /provisional/u);
    assert.match(caption, /DROM|overseas/iu);
    assert.match(caption, /Mtep|Mtoe|tonnes.*équivalent|tonnes.*equivalent/u);
  }
}

test('All four explanatory compositions remain accessible, with complete compact theme-matched mobile pagination', () => {
  const ids = [], assets = new Set(), completeAssets = new Set();
  for (const publication of publications) for (const [index, figure] of figureParts(publication.article).entries()) {
    captions(figure, index, publication.language);
    const inspected = inspect(figure.svg, { language: publication.language });
    assert.equal(inspected.nodes[0].properties.style, 'width:100%;height:auto');
    const sources = elements(fromHtml(publication.article, { fragment: true })).filter(node => node.tagName === 'li' && /^source-s\d{2}$/u.test(node.properties.id ?? ''));
    const metadata = inspected.nodes.find(node => node.tagName === 'metadata');
    assert(metadata);
    for (const source of JSON.parse(toText(metadata)).sources) {
      const reference = sources.find(node => node.properties.id === `source-${source.id.toLowerCase()}`);
      assert(reference);
      const canonicalLink = elements(reference).find(node => node.tagName === 'a');
      assert.equal(source.url, canonicalLink?.properties.href, 'SVG source metadata and the article reference use the same canonical document');
    }
    ids.push(...inspected.nodes.filter(node => node.properties.id).map(node => node.properties.id));
    let covered = 0;
    for (const panel of figure.panels) {
      const images = elements(panel).filter(node => node.tagName === 'img');
      const variants = images.map((image, i) => {
        assets.add(image.properties.src);
        return inspect(localAsset(image.properties.src), { language: publication.language, theme: i ? 'light' : 'dark' });
      });
      assert.deepEqual(variants[0].viewBox, variants[1].viewBox);
      const [x, y, width, height] = variants[0].viewBox;
      assert.equal(x, 0); assert.equal(width, 400);
      assert(y <= covered && covered - y <= 3, 'Mobile panels cover the original composition without missing modules');
      covered = y + height;
      images.forEach(image => assert.equal(Number(image.properties.height), height));
      const normaliseIds = value => Array.isArray(value) ? value.map(normaliseIds) : typeof value === 'string' ? value.replace(/-(?:dark|light)-/gu, '-theme-') : value;
      const withoutPaint = nodes => nodes.map(node => ({ tagName: node.tagName, properties: Object.fromEntries(Object.entries(node.properties).filter(([name]) => !['fill', 'stroke'].includes(name)).map(([name, value]) => [name, normaliseIds(value)])), text: ['title', 'desc', 'text', 'metadata'].includes(node.tagName) ? toText(node) : undefined }));
      assert.deepEqual(withoutPaint(variants[0].nodes), withoutPaint(variants[1].nodes), 'Theme changes preserve all data, labels and physical relationships');
    }
    assert.equal(covered, inspect(figure.mobileSvg, { language: publication.language, standalone: true }).viewBox[3]);
    figure.fullPaths.forEach(path => completeAssets.add(path));
    const normaliseFull = value => Array.isArray(value) ? value.map(normaliseFull) : typeof value === 'string' ? value.replaceAll('-full-wide-', '-wide-') : value;
    const standaloneNodes = inspect(figure.fullWideSvg, { language: publication.language, standalone: true }).nodes.filter(node => node.tagName !== 'style');
    const signature = nodes => nodes.map(node => ({ tagName: node.tagName, properties: Object.fromEntries(Object.entries(node.properties).map(([name, value]) => [name, normaliseFull(value)])), text: ['title', 'desc', 'text', 'metadata'].includes(node.tagName) ? toText(node) : undefined }));
    assert.deepEqual(signature(inspected.nodes), signature(standaloneNodes), 'The downloadable wide SVG preserves the actual composition embedded in the article');
    [processComposition, refiningCapacity, dongesComposition, importBridge][index](figure.svg, publication.language);
    [processComposition, refiningCapacity, dongesComposition, importBridge][index](figure.mobileSvg, publication.language, true);
  }
  assert.equal(assets.size, 44);
  assert.equal(completeAssets.size, 16);
  assert.equal(new Set(ids).size, ids.length, 'Inline IDs are unique in both languages');
});

test('CSV retains the EIA rounding convention, annual SDES bridge and notice/operation distinction', () => {
  dataCsv();
  for (const publication of publications) {
    for (const name of Object.keys(csv)) assert(publication.article.includes(`/data/reserves-refining-${name}.csv`));
    for (const url of ['https://www.eia.gov/petroleum/supply/weekly/archive/2026/2026_09_30/pdf/table2.pdf', 'https://www.statistiques.developpement-durable.gouv.fr/edition-numerique/chiffres-cles-energie/12-petrole', 'https://www.statistiques.developpement-durable.gouv.fr/edition-numerique/chiffres-cles-energie/20-bilans-de-lenergie-en-france']) assert(publication.article.includes(url));
    assert(!publication.article.includes('{{FIGURE_') && !publication.article.includes('—'));
  }
});

test('Scoped styling gives native keyboard navigation, bounded mobile size and separation from following text', () => {
  checkCss(css);
  assert(postcss.parse(globalCss).nodes.some(node => node.type === 'atrule' && node.name === 'import' && node.params === "'./reserves-refining-infographics.css'"));
  assert.throws(() => checkCss(css + '\nbody { color: red; }'));
  assert.throws(() => checkCss(css + '\n@import url(https://example.com/a.css);'));
  assert.throws(() => checkCss(mutate(css, '21.875rem', '60rem')));
  assert.throws(() => checkCss(mutate(css, 'height: auto', 'height: 2000px')));
});

test('Full wide equipment, bars, connectors and actual visible label bounds stay inside the viewBox', async () => {
  for (const publication of publications) for (const figure of figureParts(publication.article)) await wideGeometry(figure.svg, publication.language);
  const svg = figureParts(publications[0].article)[0].svg;
  const oversized = svg.replace(/(<text\b[^>]*>)[^<]*(<\/text>)/u, (_, start, end) => start + 'Overflowing label '.repeat(100) + end);
  assert.notEqual(oversized, svg);
  await assert.rejects(wideGeometry(oversized, 'fr'));
  await assert.rejects(wideGeometry(mutate(svg, 'font-size="35"', 'font-size="90"'), 'fr'));
});

test('Wrong numbers, units, scope, dates, status, contribution sign and graph scale fail closed', () => {
  for (const [file, before, after] of [
    ['eia-padd-2026-09-25', ',636,653,97.3', ',636,653,97.4'],
    ['eia-padd-2026-09-25', ',766,928,82.5', ',756,928,82.5'],
    ['france-refined-trade-2021-2025', '2025,34.5,17.5,17.0,True', '2025,34.5,17.5,17.0,False'],
    ['france-refined-trade-2021-2025', '2021,', '2024,'],
    ['france-net-import-bridge', '-4.9,calculated_contribution', '4.9,calculated_contribution'],
    ['france-net-import-bridge', 'imports,33.2,21.9,-11.3,calculated_contribution', '2022,33.2,21.9,-11.3,observed_total'],
    ['donges-publications-2026', '2026-08-09,2026-08-10,announced_next_day_startup', '2026-08-10,2026-08-10,observed_full_production'],
  ]) assert.throws(() => dataCsv({ ...csv, [file]: mutate(csv[file], before, after) }));
  assert.throws(() => csvRows('a,b\n"unclosed,b', ['a', 'b']));
  const figures = figureParts(publications[0].article), eia = figures[1].svg, trade = figures[3].svg;
  for (const [before, after] of [['data-utilisation="97.3"', 'data-utilisation="97.4"'], ['data-value="0.928"', 'data-value="928"'], ['data-week-ended="2026-09-25"', 'data-week-ended="2026-09-30"'], ['million-barrels-per-day', 'million-tonnes-per-year']]) assert.throws(() => refiningCapacity(mutate(eia, before, after), 'fr'));
  const bar = inspect(eia).nodes.find(node => node.properties.dataValue !== undefined);
  assert.throws(() => refiningCapacity(mutate(eia, `width="${bar.properties.width}"`, `width="${Number(bar.properties.width) + 5}"`), 'fr'));
  for (const [before, after] of [['data-value="-4.9"', 'data-value="4.9"'], ['calculated-contribution', 'observed-total'], ['data-provisional-year="2025"', 'data-provisional-year="2021"'], ['million-tonnes-oil-equivalent', 'million-barrels'], ['france-five-overseas-departments-refined-products', 'france-diesel-only']]) assert.throws(() => importBridge(mutate(trade, before, after), 'fr'));
  const contribution = inspect(trade).nodes.find(node => node.properties.dataStep === 'exports');
  assert.throws(() => importBridge(mutate(trade, `height="${contribution.properties.height}"`, `height="${Number(contribution.properties.height) + 4}"`), 'fr'));
  assert.throws(() => processComposition(mutate(figures[0].svg, 'data-diagram="refining-dependencies"', 'data-diagram="donges-actual-plant"'), 'fr'));
  assert.throws(() => processComposition(mutate(figures[0].svg, 'stroke-dasharray="6 5"', 'stroke-dasharray=""'), 'fr'));
});

test('Active markup, unsafe JSON metadata, external paints, source drift and traversal cannot enter the controlled SVG surface', () => {
  const svg = figureParts(publications[0].article)[0].svg;
  for (const [before, after] of [['<svg ', '<svg onload="alert(1)" '], ['</svg>', '<script>alert(1)</script></svg>'], ['</svg>', '<image href="https://example.com/image.svg"/></svg>'], ['</svg>', '<foreignObject><div>unsafe</div></foreignObject></svg>'], ['var(--color-signal)', '#13776F'], ['var(--color-signal)', 'url(https://example.com/image.svg)'], ['url(#', 'url(https://example.com/#'], ['height:auto', 'height:900px'], ['<metadata>', '<metadata><script>alert(1)</script>'], ['"edition":', '"__proto__":{},"edition":'], ['https://www.eia.gov/', 'https://example.com/']]) assert.throws(() => inspect(mutate(svg, before, after)));
  for (const url of ['https://example.com/figure.svg', '/infographies/reserves-refining/../../secrets.svg', '/infographies/reserves-refining/%2e%2e/secrets.svg']) assert.throws(() => localAsset(url));
  assert.throws(() => figureParts(mutate(publications[0].article, '<img ', '<img onerror="alert(1)" ')));
  const standalone = figureParts(publications[0].article)[0].mobileSvg;
  assert.throws(() => inspect(mutate(standalone, '</style>', '@import url(https://example.com/font.css);</style>'), { standalone: true }));
  assert.throws(() => inspect(mutate(svg, 'var(--color-signal)', 'color-mix(in srgb, var(--color-signal) 10%, url(https://example.com/image.svg))')));
});
