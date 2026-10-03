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
  ['fr', 'src/content/posts/reserves-petrolieres-logistique-dernier-kilometre.md'],
  ['en', 'src/content/posts-en/emergency-oil-reserves-last-mile-logistics.md'],
].map(([language, path]) => ({ language, article: read(path) }));
const css = read('src/styles/reserves-logistics-infographics.css');
const globalCss = read('src/styles/global.css');
const motorwayCsv = read('public/data/reserves-logistics-aires-autoroutieres-2022-10-21.csv');
const chronologyCsv = read('public/data/reserves-logistics-chronologie-octobre-2022.csv');
const assetRoot = realpathSync(resolve(root, 'public/infographies/reserves-logistics'));
const sourceUrls = [
  'https://www.ecologie.gouv.fr/presse/transporteurs-routiers-ont-ete-recus-faire-point-situation-carburants',
  'https://www.ecologie.gouv.fr/presse/gouvernement-prolonge-mesures-concernant-transports-routiers-faire-face-aux-difficultes',
  'https://www.ecologie.gouv.fr/presse/prolongation-mesures-flexibilite-transport-carburants-accompagner-poursuite-du-redressement',
  'https://www.ecologie.gouv.fr/presse/departs-vacances-approvisionnement-autoroutes-carburant',
];
// Independently checked ministry snapshot; an absent denominator remains absent.
const observations = [
  ['VINCI Autoroutes', '181', 'petrol', 90], ['VINCI Autoroutes', '181', 'diesel', 92],
  ['SANEF-SAPN', '', 'petrol', 82], ['SANEF-SAPN', '', 'diesel', 90],
  ['APRR-AREA', '97', 'petrol', 82], ['APRR-AREA', '97', 'diesel', 88],
];
const panelCounts = [3, 4, 3, 4];
const elements = node => [node, ...(node.children ?? []).flatMap(elements)].filter(item => item.type === 'element');
const normalise = text => text.replace(/\s+/gu, ' ').trim();
const textOf = nodes => normalise(nodes.filter(node => node.tagName === 'text').map(node => toText(node)).join(' '));
const near = (actual, expected, message) => assert(Math.abs(Number(actual) - expected) < 1e-7, message);
const variablePaint = /^(?:none|var\(--color-(?:ink|surface(?:-2)?|paper|muted|signal|accent|amber|topic-blue|line-strong)\))$/u;
const mixPaint = /^color-mix\(in srgb, var\(--color-(signal|amber)\) 10%, var\(--color-surface\)\)$/u;
const attributes = new Set('xmlns viewBox width height role ariaLabelledBy lang style id x y rx ry cx cy r x1 x2 y1 y2 fill stroke strokeWidth strokeDashArray strokeLineCap strokeLineJoin d transform fontFamily fontSize fontWeight textAnchor markerEnd markerStart markerWidth markerHeight refX refY orient clipPath clipPathUnits'.split(' '));

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
    assert(['svg', 'title', 'desc', 'defs', 'marker', 'clipPath', 'g', 'rect', 'circle', 'ellipse', 'line', 'path', 'text'].includes(node.tagName), `Active or unsupported element: ${node.tagName}`);
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
  if (language) assert.equal(properties.lang, language);
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
  assert.match(url, /^\/infographies\/reserves-logistics\/(?:panels\/)?[a-z0-9.-]+\.svg$/u);
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
    assert.deepEqual(nodes[0].properties.className, ['infographic', 'l0g-reserves03-figure']);
    assert.equal(Number(nodes[0].properties.dataFigure), index + 1);
    const byClass = name => nodes.filter(node => node.properties.className?.includes(name));
    const wide = byClass('rsv03-wide');
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
    const gallery = byClass('rsv03-gallery');
    assert.equal(gallery.length, 1);
    assert.equal(gallery[0].properties.role, 'region');
    assert.equal(gallery[0].properties.tabIndex, 0);
    assert(normalise(gallery[0].properties.ariaLabel));
    const hints = byClass('rsv03-scroll-hint');
    assert.equal(hints.length, 1);
    assert(normalise(toText(hints[0])));
    assert.deepEqual(gallery[0].properties.ariaDescribedBy, [hints[0].properties.id]);
    const panels = byClass('rsv03-panel');
    assert.equal(panels.length, panelCounts[index]);
    const panelIds = panels.map(panel => panel.properties.id);
    assert(panelIds.every(Boolean) && new Set(panelIds).size === panelIds.length);
    panels.forEach((panel, panelIndex) => {
      assert.equal(panel.properties.role, 'group');
      assert.equal(Number(panel.properties.dataPanel), panelIndex + 1);
      const images = elements(panel).filter(node => node.tagName === 'img');
      assert.equal(images.length, 2);
      assert.deepEqual(images.map(node => node.properties.className), [['rsv03-panel-dark'], ['rsv03-panel-light']]);
      images.forEach(image => {
        assert(normalise(image.properties.alt));
        assert.equal(Number(image.properties.width), 400);
        assert(Number(image.properties.height) > 0 && Number(image.properties.height) * 350 / 400 <= 500, 'Mobile panels fit without an oversized vertical graphic');
      });
    });
    const pagination = byClass('rsv03-pagination');
    assert.equal(pagination.length, 1);
    assert.deepEqual(elements(pagination[0]).filter(node => node.tagName === 'a').map(node => node.properties.href), panelIds.map(id => `#${id}`));
    const complete = byClass('rsv03-full-link');
    assert.equal(complete.length, 2, 'Complete wide and mobile compositions remain available');
    const fullLinks = complete.flatMap(node => elements(node).filter(child => child.tagName === 'a'));
    assert.equal(fullLinks.length, 2);
    fullLinks.forEach(link => inspect(localAsset(link.properties.href), { standalone: true }));
    const mobileLink = fullLinks.find(link => link.properties.href.endsWith('.mobile.svg'));
    assert(mobileLink);
    const captions = nodes.filter(node => node.tagName === 'figcaption');
    assert.equal(captions.length, 1);
    assert(normalise(toText(captions[0])));
    return { fragment, nodes, panels, caption: normalise(toText(captions[0])), mobileSvg: localAsset(mobileLink.properties.href), svg: [...fragment.matchAll(/<svg\b[\s\S]*?<\/svg>/gu)][0][0] };
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

function checkMotorwayCsv(text) {
  const rows = csvRows(text, ['reference_date', 'network', 'reported_network_service_areas', 'fuel', 'supplied_percent', 'unit', 'source_id']);
  assert.equal(rows.length, 6);
  rows.forEach((row, i) => {
    assert.deepEqual([row.network, row.reported_network_service_areas, row.fuel, Number(row.supplied_percent)], observations[i]);
    assert.match(row.supplied_percent, /^\d+$/u);
    assert.equal(row.reference_date, '2022-10-21');
    assert.equal(row.unit, 'percent of service areas');
    assert.equal(row.source_id, 'S12');
  });
  return rows;
}

function checkChronologyCsv(text) {
  const rows = csvRows(text, ['date', 'source_id', 'status', 'event_fr', 'event_en']);
  assert.equal(rows.length, 4);
  rows.forEach((row, i) => {
    assert.equal(row.date, `2022-10-${[10, 14, 20, 21][i]}`);
    assert.equal(row.source_id, `S${String(i + 9).padStart(2, '0')}`);
    assert.equal(row.status, ['official account and announcements', 'official announcement', 'official announcement', 'official announcement and supply snapshot'][i]);
    assert(normalise(row.event_fr) && normalise(row.event_en));
  });
  assert.match(rows[2].event_fr, /cinq jours/u);
  assert.match(rows[2].event_en, /five days/u);
  return rows;
}

function motorway(svg, language) {
  const { nodes } = inspect(svg, { language });
  const bars = nodes.filter(node => node.tagName === 'rect' && node.properties.dataValue !== undefined);
  assert.equal(bars.length, 6);
  const ticks = nodes.filter(node => node.tagName === 'text' && /^(?:0|25|50|75|100\s*%)$/u.test(normalise(toText(node))));
  assert.equal(ticks.length, 5);
  const zero = Number(ticks[0].properties.x), full = Number(ticks[4].properties.x) - zero;
  assert(full > 0);
  ticks.forEach((tick, i) => near(tick.properties.x, zero + full * i / 4, 'A common 0–100% linear scale is required'));
  bars.forEach((bar, i) => {
    assert.equal(bar.properties.dataNetwork, observations[i][0]);
    assert.equal(Number(bar.properties.dataValue), observations[i][3]);
    assert.equal(bar.properties.dataFuel, observations[i][2]);
    near(bar.properties.x, zero, 'Every bar begins at zero');
    near(bar.properties.width, full * observations[i][3] / 100, 'Bar length follows the published percentage');
  });
  const labels = nodes.filter(node => node.tagName === 'text').map(node => normalise(toText(node)));
  assert.deepEqual(labels.filter(label => /^\d+\s*%$/u.test(label) && label !== '100 %' && label !== '100%').map(label => Number(label.replace(/\s*%$/u, ''))), observations.map(row => row[3]));
  const visible = textOf(nodes);
  assert.match(visible, /181/u); assert.match(visible, /97/u);
  assert.match(visible, language === 'fr' ? /Effectif non indiqué/u : /(?:Denominator|Count|Network size|Number of areas).*not (?:reported|stated|specified|given)|not reported/u);
  assert.match(visible, /2022/u);
}

function mobileMotorway(svg, language) {
  const { nodes } = inspect(svg, { language, standalone: true });
  const bars = nodes.filter(node => node.tagName === 'rect' && node.properties.dataValue !== undefined);
  assert.equal(bars.length, 6);
  bars.forEach((bar, i) => {
    const p = bar.properties;
    assert.deepEqual([p.dataNetwork, p.dataFuel, Number(p.dataValue)], [observations[i][0], observations[i][2], observations[i][3]]);
    const tracks = nodes.filter(node => node.tagName === 'rect' && node.properties.dataValue === undefined && node.properties.stroke !== undefined && ['x', 'y', 'height'].every(name => Number(node.properties[name]) === Number(p[name])));
    assert.equal(tracks.length, 1);
    near(p.width, Number(tracks[0].properties.width) * observations[i][3] / 100, 'Mobile bars retain their full zero-based background scale');
  });
}

function captions(figure, index, language) {
  const { caption, nodes } = figure;
  const links = nodes.filter(node => node.tagName === 'a').map(node => node.properties.href);
  const sourceIds = [[4, 5, 6, 7], [9, 10, 11, 12], [12], []][index];
  sourceIds.forEach(id => assert(links.includes(`#source-s${String(id).padStart(2, '0')}`)));
  if (index === 0) assert.match(caption, language === 'fr' ? /Aucun site.*volume.*temps/u : /No actual facility.*volume.*travel time/u);
  else if (index === 1) {
    assert.match(caption, /2022/u);
    assert.match(caption, language === 'fr' ? /ne mesurent aucun temps/u : /does not measure any journey time/u);
    assert(links.includes('/data/reserves-logistics-chronologie-octobre-2022.csv'));
  } else if (index === 2) {
    assert.match(caption, language === 'fr' ? /21 octobre 2022/u : /21 October 2022/u);
    assert.match(caption, /181/u); assert.match(caption, /97/u);
    assert.match(caption, language === 'fr' ? /SANEF-SAPN non fourni/u : /SANEF-SAPN count not provided/u);
    assert.match(caption, language === 'fr' ? /sans moyenne nationale ni volume livré/u : /without a national average or delivered volume/u);
    assert.match(caption, language === 'fr' ? /Heure de mesure inconnue/u : /Measurement time unknown/u);
    assert(links.includes('/data/reserves-logistics-aires-autoroutieres-2022-10-21.csv'));
  } else {
    assert.match(caption, language === 'fr' ? /Même carburant, même période et même base volumique/u : /Same fuel, period and volume measurement basis/u);
    assert.match(caption, language === 'fr' ? /pertes, corrections de mesure et autres transferts exclus/u : /losses, measurement corrections and other transfers excluded/u);
    assert.match(caption, language === 'fr' ? /Aucun niveau de stock, débit ou temps observé/u : /No observed stock level, throughput or time/u);
  }
}

function qualitative(svg, index, language) {
  const { nodes } = inspect(svg, { language });
  assert(!nodes.some(node => node.properties.dataValue !== undefined), 'Qualitative mechanisms must not acquire measured values');
  const visible = textOf(nodes);
  if (index === 0) {
    for (const word of language === 'fr' ? ['Raffineries', 'Pipeline', 'Train', 'Barge', 'DÉPÔT', 'CHARGEMENT', 'STATION'] : ['Refineries', 'Pipeline', 'Rail', 'Barge', 'DEPOT', 'LOADING', 'STATION']) assert(visible.toLowerCase().includes(word.toLowerCase()), `Original logistics branch retained: ${word}`);
    assert(nodes.filter(node => ['markerEnd', 'markerStart'].some(name => node.properties[name])).length >= 4, 'Physical flows and the reserve branch remain explanatory graphics');
  } else if (index === 1) {
    for (const day of ['10', '14', '20', '21']) assert(new RegExp(`\\b${day}\\b`, 'u').test(visible));
    assert.match(visible, /2022/u);
    assert.match(visible, language === 'fr' ? /sans échelle|espacement.*ordinal/iu : /(?:no|not a|without).*time scale|ordinal|does not encode elapsed time/iu);
    assert.match(visible, language === 'fr' ? /cinq|5/iu : /five|5/iu);
  } else {
    assert.equal(nodes[0].properties.dataModel, 'inventory-balance');
    assert(nodes.some(node => node.properties.dataDiagram === 'station-stock-flow'));
    for (const relation of ['<', '=', '>']) assert(visible.includes(relation), 'All three inventory regimes remain present');
    assert.match(visible, /−|-/u);
    assert.match(visible, language === 'fr' ? /même période/u : /same (?:period|interval)/u);
    assert.match(visible, language === 'fr' ? /aucun débit|aucun.*observé/u : /no.*(?:observed|measured)|no observed/u);
    assert(!nodes.filter(node => node.tagName === 'text').some(node => /\b\d+(?:[.,]\d+)?\s*(?:%|litres?|barrels?|tonnes?|hours?|heures?|jours?|days?)\b/iu.test(toText(node))), 'No numerical stock or flow series is fabricated');
    const trends = nodes.filter(node => node.properties.dataTrend);
    assert.deepEqual(trends.map(node => node.properties.dataTrend), ['falling', 'unchanged', 'rising']);
    trends.forEach((node, i) => {
      assert.equal(node.tagName, 'path');
      const segment = /^M\s*(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+L\s*(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)$/u.exec(node.properties.d);
      assert(segment, 'Each qualitative trend is a simple, controlled directional segment');
      const [, startX, startY, endX, endY] = segment.map(Number);
      assert(endX > startX);
      assert.equal(Math.sign(endY - startY), [1, 0, -1][i], 'Canvas slopes correspond to falling, unchanged and rising stock');
    });
  }
}

function checkCss(text) {
  const parsed = postcss.parse(text), rules = [];
  parsed.walkAtRules(rule => {
    assert.equal(rule.name, 'media', 'No imports, external fonts or active stylesheet resources');
    assert(['(max-width: 640px)', '(prefers-reduced-motion: reduce)'].includes(rule.params));
  });
  parsed.walkRules(rule => {
    for (const selector of rule.selectors) assert.match(selector, /^(?:(?::root|html)\[data-theme=["']light["']\]\s+)?(?:\.prose\s+)?(?:figure)?\.l0g-reserves03-figure(?:[\s.:[>]|$)/u, 'Styles cannot affect neighbouring articles');
    rules.push(rule);
  });
  parsed.walkDecls(decl => {
    assert(!decl.important);
    assert(!/(?:url\s*\(|expression\s*\(|javascript:)/iu.test(decl.value));
    if (decl.prop === 'position') assert(!['fixed', 'sticky'].includes(decl.value));
    if (decl.prop === 'height') assert.equal(decl.value, 'auto');
  });
  const declarations = selector => Object.fromEntries(rules.filter(rule => rule.selector === selector).flatMap(rule => rule.nodes.filter(node => node.type === 'decl').map(node => [node.prop, node.value])));
  const galleryRule = rules.find(rule => rule.selector.endsWith(' .rsv03-gallery'));
  assert(galleryRule, 'Mobile gallery styles are present');
  const gallery = declarations(galleryRule.selector);
  assert.equal(gallery.display, 'flex');
  assert.equal(gallery['overflow-x'], 'auto');
  assert.match(gallery['scroll-snap-type'], /^x (?:mandatory|proximity)$/u);
  assert.equal(gallery['max-width'], '100%');
  const panelRule = rules.find(rule => rule.selector.endsWith(' .rsv03-panel'));
  assert(panelRule);
  assert.equal(declarations(panelRule.selector)['scroll-snap-align'], 'start');
  const imageRule = rules.find(rule => rule.selectors.some(selector => /\.rsv03-panel > img$/u.test(selector)));
  assert(imageRule);
  assert.equal(declarations(imageRule.selector).width, '100%');
  assert.equal(declarations(imageRule.selector).height, 'auto');
  const mobileQuery = parsed.nodes.find(node => node.type === 'atrule' && node.params === '(max-width: 640px)');
  assert(mobileQuery);
  const mobileRules = mobileQuery.nodes.filter(node => node.type === 'rule');
  const mobileDecl = suffix => Object.fromEntries(mobileRules.filter(rule => rule.selector.endsWith(suffix)).flatMap(rule => rule.nodes.filter(node => node.type === 'decl').map(node => [node.prop, node.value])));
  assert.equal(mobileDecl(' .rsv03-wide').display, 'none');
  assert.equal(mobileDecl(' .rsv03-mobile').display, 'block');
  assert.equal(Number.parseFloat(mobileDecl(' .rsv03-mobile')['max-width']) * 16, 350, '350px natural panel width caps visible image height');
  assert.equal(mobileDecl(' .rsv03-mobile')['max-width'], '21.875rem');
  assert(rules.some(rule => rule.selector.endsWith(' .rsv03-mobile') && rule.parent.type === 'root' && rule.nodes.some(node => node.prop === 'display' && node.value === 'none')));
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
      assert(Number.isFinite(size) && size >= 12 && size <= 48, 'Original small captions and readable body typography remain bounded');
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

test('Four original wide compositions and compact, accessible dark/light mobile panels are present', () => {
  const ids = [];
  for (const publication of publications) {
    for (const [index, figure] of figureParts(publication.article).entries()) {
      captions(figure, index, publication.language);
      const inspected = inspect(figure.svg, { language: publication.language });
      assert.equal(inspected.nodes[0].properties.style, 'width:100%;height:auto');
      ids.push(...inspected.nodes.filter(node => node.properties.id).map(node => node.properties.id));
      let covered = 0;
      for (const panel of figure.panels) {
        const images = elements(panel).filter(node => node.tagName === 'img');
        const variants = images.map((image, i) => inspect(localAsset(image.properties.src), { language: publication.language, theme: i ? 'light' : 'dark' }));
        assert.deepEqual(variants[0].viewBox, variants[1].viewBox);
        const [x, y, width, height] = variants[0].viewBox;
        assert.equal(x, 0); assert.equal(width, 400);
        assert(y <= covered && covered - y <= 3, 'Panels preserve the complete original composition without gaps');
        covered = y + height;
        assert.equal(Number(images[0].properties.height), height);
        assert.equal(Number(images[1].properties.height), height);
        const normaliseIds = value => Array.isArray(value) ? value.map(normaliseIds) : typeof value === 'string' ? value.replace(/-(?:dark|light)-/gu, '-theme-') : value;
        const withoutPaint = nodes => nodes.map(node => ({ tagName: node.tagName, properties: Object.fromEntries(Object.entries(node.properties).filter(([name]) => !['fill', 'stroke'].includes(name)).map(([name, value]) => [name, normaliseIds(value)])), text: ['title', 'desc', 'text'].includes(node.tagName) ? toText(node) : undefined }));
        assert.deepEqual(withoutPaint(variants[0].nodes), withoutPaint(variants[1].nodes), 'Changing theme cannot change data, topology or labels');
      }
      assert.equal(covered, inspect(figure.mobileSvg, { language: publication.language, standalone: true }).viewBox[3], 'Panels cover the full mobile composition through its final limitation');
      if (index === 2) { motorway(figure.svg, publication.language); mobileMotorway(figure.mobileSvg, publication.language); }
      else qualitative(figure.svg, index, publication.language);
    }
  }
  assert.equal(new Set(ids).size, ids.length, 'Inline IDs remain unique in both languages');
});

test('CSV publication retains six dated observations, unknown SANEF denominator and four announcement dates', () => {
  checkMotorwayCsv(motorwayCsv); checkChronologyCsv(chronologyCsv);
  for (const publication of publications) {
    for (const csv of ['aires-autoroutieres-2022-10-21', 'chronologie-octobre-2022']) assert(publication.article.includes(`/data/reserves-logistics-${csv}.csv`));
    const urls = elements(fromHtml(publication.article, { fragment: true })).filter(node => node.tagName === 'a' && /^https:\/\//u.test(node.properties.href)).map(node => new URL(node.properties.href).href);
    for (const url of sourceUrls) assert(urls.includes(url), `CSV source resolves to the exact primary publication: ${url}`);
    assert(!publication.article.includes('{{FIGURE_') && !publication.article.includes('—'));
  }
});

test('Scoped CSS switches to keyboard-accessible horizontal panels and bounds their responsive size', () => {
  checkCss(css);
  assert(postcss.parse(globalCss).nodes.some(node => node.type === 'atrule' && node.name === 'import' && node.params === "'./reserves-logistics-infographics.css'"));
  assert.throws(() => checkCss(css + '\nbody { color: red; }'));
  assert.throws(() => checkCss(css + '\n@import url(https://example.com/a.css);'));
  assert.throws(() => checkCss(mutate(css, '21.875rem', '60rem')));
  assert.throws(() => checkCss(mutate(css, 'height: auto', 'height: 2000px')));
});

test('Wide paths, marker tips and visible labels remain inside the complete composition', async () => {
  for (const publication of publications) for (const figure of figureParts(publication.article)) await wideGeometry(figure.svg, publication.language);
  const svg = figureParts(publications[0].article)[0].svg;
  const oversized = svg.replace(/(<text\b[^>]*>)[^<]*(<\/text>)/u, (_, start, end) => start + 'Overflowing label '.repeat(100) + end);
  assert.notEqual(oversized, svg);
  await assert.rejects(wideGeometry(oversized, 'fr'));
  await assert.rejects(wideGeometry(mutate(svg, 'font-size="34"', 'font-size="90"'), 'fr'));
});

test('Incorrect percentages, denominators, observation dates, units and announcement status fail closed', () => {
  for (const [before, after] of [[',petrol,90,', ',petrol,91,'], ['SANEF-SAPN,,', 'SANEF-SAPN,0,'], ['VINCI Autoroutes,181,', 'VINCI Autoroutes,182,'], ['2022-10-21', '2026-10-21'], ['percent of service areas', 'percent of delivered litres'], ['percent of service areas', 'percent of service areas supplied nationally']]) assert.throws(() => checkMotorwayCsv(mutate(motorwayCsv, before, after)));
  assert.throws(() => checkChronologyCsv(mutate(chronologyCsv, 'official announcement', 'observed delivery')));
  assert.throws(() => checkChronologyCsv(mutate(chronologyCsv, '2022-10-20', '2022-10-19')));
  assert.throws(() => csvRows('a,b\n"unclosed,b', ['a', 'b']));
  const svg = figureParts(publications[0].article)[2].svg;
  assert.throws(() => motorway(mutate(svg, 'data-value="90"', 'data-value="91"'), 'fr'));
  const inspected = inspect(svg), bar = inspected.nodes.find(node => node.properties.dataValue !== undefined);
  assert.throws(() => motorway(mutate(svg, `width="${bar.properties.width}"`, `width="${Number(bar.properties.width) + 5}"`), 'fr'));
  const balance = figureParts(publications[0].article)[3].svg;
  assert.throws(() => qualitative(mutate(balance, 'data-trend="falling"', 'data-trend="rising"'), 3, 'fr'));
  assert.throws(() => qualitative(mutate(balance, 'data-model="inventory-balance"', 'data-model="observed-series"'), 3, 'fr'));
});

test('Active SVG, remote assets, unsafe references, palette drift and traversal cannot pass local asset checks', () => {
  const svg = figureParts(publications[0].article)[0].svg;
  for (const [before, after] of [['<svg ', '<svg onload="alert(1)" '], ['</svg>', '<script>alert(1)</script></svg>'], ['</svg>', '<image href="https://example.com/image.svg"/></svg>'], ['</svg>', '<foreignObject><div>unsafe</div></foreignObject></svg>'], ['var(--color-signal)', '#13776F'], ['var(--color-signal)', 'url(https://example.com/image.svg)'], ['url(#', 'url(https://example.com/#'], ['height:auto', 'height:900px']]) assert.throws(() => inspect(mutate(svg, before, after)));
  for (const url of ['https://example.com/figure.svg', '/infographies/reserves-logistics/../../secrets.svg', '/infographies/reserves-logistics/%2e%2e/secrets.svg']) assert.throws(() => localAsset(url));
  assert.throws(() => figureParts(mutate(publications[0].article, '<img ', '<img onerror="alert(1)" ')));
  const standalone = figureParts(publications[0].article)[0].mobileSvg;
  assert.throws(() => inspect(mutate(standalone, '</style>', '@import url(https://example.com/font.css);</style>'), { standalone: true }));
  assert.throws(() => inspect(mutate(svg, 'var(--color-signal)', 'color-mix(in srgb, var(--color-signal) 10%, url(https://example.com/image.svg))')));
});
