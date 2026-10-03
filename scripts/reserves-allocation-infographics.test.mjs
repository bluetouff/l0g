import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, realpathSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';
import postcss from 'postcss';
import { createHash } from 'node:crypto';
import { readdirSync } from 'node:fs';
import { toHtml } from 'hast-util-to-html';

const root = resolve(process.cwd());
const read = path => readFileSync(resolve(root, path), 'utf8');
const publications = [
  ['fr', 'src/content/posts/reserves-petrolieres-ventes-echanges-attribution.md'],
  ['en', 'src/content/posts-en/emergency-oil-reserves-sales-exchanges-allocation.md'],
].map(([language, path]) => ({ language, article: read(path) }));
const css = read('src/styles/reserves-allocation-infographics.css');
const globalCss = read('src/styles/global.css');
const assetRoot = realpathSync(resolve(root, 'public/infographies/reserves-allocation-05'));
const panelCounts = [3, 3, 2, 2];
const maximumWidths = [350, 350, 340, 350];
const matched = [
 ['2026-03-13','2026-03-20',86,45.2,52.6],
 ['2026-04-01','2026-04-10',10,8.5,85],
 ['2026-04-09','2026-04-17',30,26,86.7],
 ['2026-04-30','2026-05-11',92.5,53.3,57.6],
];
const returns = [['2026-03-20',45.2,9.8,55,21.7],['2026-05-11',53.3,15.1,68.4,28.3]];
const sale = [['Marathon',8.4],['Equinor',7.3],['Shell Trading',3.6],['Aramco Trading Americas',3.5],['Macquarie',1.6],['Phillips 66',1.6]];
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
        assert(['www.energy.gov','www.sagess.fr','www.iea.org','www.ecologie.gouv.fr'].includes(url.hostname));
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
    assert(ids.every(id => id.startsWith(`reserves05-${language}-`)));
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
  assert.match(url, /^\/infographies\/reserves-allocation-05\/(?:panels\/)?[a-z0-9.-]+\.svg$/u);
  const actual = realpathSync(resolve(root, 'public', url.slice(1)));
  assert(actual.startsWith(assetRoot + sep), 'Referenced files stay inside the publication asset directory');
  return readFileSync(actual, 'utf8');
}

function figureParts(article) {
  const tree = fromHtml(article, { fragment: true });
  const figures = elements(tree).filter(node => node.tagName === 'figure' && node.properties.className?.includes('l0g-reserves05-figure'));
  assert.equal(figures.length, 4, 'All four original explanatory compositions remain present');
  assert.equal(elements(tree).filter(node => node.tagName === 'svg').length, 4, 'Only full wide SVGs are inline');
  return figures.map((figure, index) => {
    const fragment = toHtml(figure), nodes = elements(figure);
    assert.deepEqual(nodes[0].properties.className, ['infographic', 'l0g-reserves05-figure']);
    assert.equal(Number(nodes[0].properties.dataFigure), index + 1);
    const byClass = name => nodes.filter(node => node.properties.className?.includes(name));
    const wide = byClass('rsv05-wide');
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
    const gallery = byClass('rsv05-gallery');
    assert.equal(gallery.length, 1);
    assert.equal(gallery[0].properties.role, 'region');
    assert.equal(gallery[0].properties.tabIndex, 0);
    assert(normalise(gallery[0].properties.ariaLabel));
    const hints = byClass('rsv05-scroll-hint');
    assert.equal(hints.length, 1);
    assert(normalise(toText(hints[0])));
    assert.deepEqual(gallery[0].properties.ariaDescribedBy, [hints[0].properties.id]);
    const panels = byClass('rsv05-panel');
    assert.equal(panels.length, panelCounts[index]);
    const panelIds = panels.map(panel => panel.properties.id);
    assert(panelIds.every(Boolean) && new Set(panelIds).size === panelIds.length);
    panels.forEach((panel, panelIndex) => {
      assert.equal(panel.properties.role, 'group');
      assert.equal(Number(panel.properties.dataPanel), panelIndex + 1);
      const images = elements(panel).filter(node => node.tagName === 'img');
      assert.equal(images.length, 2);
      assert.deepEqual(images.map(node => node.properties.className), [['rsv05-panel-dark'], ['rsv05-panel-light']]);
      images.forEach(image => {
        assert(normalise(image.properties.alt));
        assert.equal(Number(image.properties.width), 400);
        assert(Number(image.properties.height) > 0 && Number(image.properties.height) * maximumWidths[index] / 400 <= 500, 'Mobile panels fit without an oversized vertical graphic');
      });
    });
    const pagination = byClass('rsv05-pagination');
    assert.equal(pagination.length, 1);
    assert.deepEqual(elements(pagination[0]).filter(node => node.tagName === 'a').map(node => node.properties.href), panelIds.map(id => `#${id}`));
    const complete = byClass('rsv05-full-link');
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
    return { fragment, nodes, panels, caption: normalise(toText(captions[0])), fullPaths: fullLinks.map(link => link.properties.href), fullWideSvg: localAsset(wideLink.properties.href), mobileSvg: localAsset(mobileLink.properties.href), svg: toHtml(elements(wide[0]).find(node=>node.tagName==='svg')) };
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
    for (const selector of rule.selectors) assert.match(selector, /^(?:(?::root|html)\[data-theme=["']light["']\]\s+)?(?:\.prose\s+)?(?:figure)?\.l0g-reserves05-figure(?:[\s.:[>]|$)/u, 'Styles cannot affect neighbouring articles');
    rules.push(rule);
  });
  parsed.walkDecls(decl => {
    assert(!decl.important);
    assert(!/(?:url\s*\(|expression\s*\(|javascript:)/iu.test(decl.value));
    if (decl.prop === 'position') assert(!['fixed', 'sticky'].includes(decl.value));
    if (decl.prop === 'height') assert.equal(decl.value, 'auto');
  });
  const declarations = selector => Object.fromEntries(rules.filter(rule => rule.selector === selector).flatMap(rule => rule.nodes.filter(node => node.type === 'decl').map(node => [node.prop, node.value])));
  const galleryRule = rules.find(rule => rule.selector.endsWith(' .rsv05-gallery'));
  assert(galleryRule, 'Mobile gallery styles are present');
  const gallery = declarations(galleryRule.selector);
  assert.equal(gallery.display, 'flex');
  assert.equal(gallery['overflow-x'], 'auto');
  assert.match(gallery['scroll-snap-type'], /^x (?:mandatory|proximity)$/u);
  assert.equal(gallery['max-width'], '100%');
  const panelRule = rules.find(rule => rule.selector.endsWith(' .rsv05-panel'));
  assert(panelRule);
  assert.equal(declarations(panelRule.selector)['scroll-snap-align'], 'start');
  const imageRule = rules.find(rule => rule.selectors.some(selector => /\.rsv05-panel > img$/u.test(selector)));
  assert(imageRule);
  assert.equal(declarations(imageRule.selector).width, '100%');
  assert.equal(declarations(imageRule.selector).height, 'auto');
  const mobileQuery = parsed.nodes.find(node => node.type === 'atrule' && node.params === '(max-width: 640px)');
  assert(mobileQuery);
  const mobileRules = mobileQuery.nodes.filter(node => node.type === 'rule');
  const mobileDecl = suffix => Object.fromEntries(mobileRules.filter(rule => rule.selector.endsWith(suffix)).flatMap(rule => rule.nodes.filter(node => node.type === 'decl').map(node => [node.prop, node.value])));
  assert.equal(mobileDecl(' .rsv05-wide').display, 'none');
  assert.equal(mobileDecl(' .rsv05-mobile').display, 'block');
  assert.equal(Number.parseFloat(mobileDecl(' .rsv05-mobile')['max-width']) * 16, 350, '350px natural panel width caps visible image height');
  assert.equal(mobileDecl(' .rsv05-mobile')['max-width'], '21.875rem');
  const narrower = rules.find(rule => rule.selector === '.l0g-reserves05-figure[data-figure="3"] .rsv05-mobile');
  assert(narrower); assert.equal(declarations(narrower.selector)['max-width'],'21.25rem');
  assert(rules.some(rule => rule.selector.endsWith(' .rsv05-mobile') && rule.parent.type === 'root' && rule.nodes.some(node => node.prop === 'display' && node.value === 'none')));
  assert.equal(declarations('.l0g-reserves05-figure .rsv05-panel > .rsv05-panel-light').display,'none');
  assert.equal(declarations(':root[data-theme="light"] .l0g-reserves05-figure .rsv05-panel > .rsv05-panel-dark').display,'none');
  assert.equal(declarations(':root[data-theme="light"] .l0g-reserves05-figure .rsv05-panel > .rsv05-panel-light').display,'block');
  assert(rules.some(rule => rule.selector.endsWith('figcaption') || rule.nodes.some(node => node.prop === 'padding-bottom' && Number.parseFloat(node.value) > 0)), 'Graphs retain spacing from following text');
}


// Immutable drawing baselines calculated from the supplied original compositions, excluding semantic paint and namespaced IDs.
const originalGeometryHashes={
  "01-contrats.en.mobile.svg": "c9844bbcc381959155a5f0d849622ddc87533760e84c474798b5484c52bd3b5d",
  "01-contrats.en.svg": "80b627fe7a277fabe15a9dcd9dbb7711ec892e63642ce1b140fe483fa43bce8c",
  "01-contrats.fr.mobile.svg": "47074a12de6bfbfa57b5086b993b5e0b47938a9a4d3e5af7fbd3217a5248831a",
  "01-contrats.fr.svg": "2496bf6c1e6fa67c4b7c29de1d5a14abca17076901f9d491e509abc6aaba8d2c",
  "02-appels-attributions.en.mobile.svg": "0fed9da7c8f7d19f2e2b58ad478fea19436d4f0b622a65fbdb79b5c51a334174",
  "02-appels-attributions.en.svg": "265b28991eea1755f5ad3c8ee84d6c18775bf4a6eb53479c75e7dd4ba1496443",
  "02-appels-attributions.fr.mobile.svg": "2f88cf47a3acd0273408b73afcd5123e1fd723385418de081cb1059c4a20e680",
  "02-appels-attributions.fr.svg": "98d71104beaf41127cd37c1aff1c4e63a59611ae8fff07a9198f948717c065ce",
  "03-dette-barils.en.mobile.svg": "141f70b955ca0882924441270af5025be7e383ade62298c8fd761924f3d4c27f",
  "03-dette-barils.en.svg": "9e008d97776d38d967739f47664b8f7234ea6e9287a36eec33ae3e7c909c620d",
  "03-dette-barils.fr.mobile.svg": "58e985f19dcfd79ca26c5208f145f7f3a6ab30325c37d138d2841ccae8446159",
  "03-dette-barils.fr.svg": "1d50d95ad795416c48ee0dc315fe4e89ed8ba078eb352ec01bfae8067f8ec74b",
  "04-attributaires.en.mobile.svg": "8ae9a951aa761cdc238ca60fff5753a1184e901beaedf793957e98e755aa895f",
  "04-attributaires.en.svg": "ba043925f6c7bde7e7779f1fb1f9081c74b3f40b26917e893e0607fda07a4193",
  "04-attributaires.fr.mobile.svg": "a8e5a4956fe0ac9d7c9b45233c981d7c7893fb13a6ea5f5378c77749d00c1b9a",
  "04-attributaires.fr.svg": "0d5da01c3503d329e4098d8700c63e462282fc5525ed24c8107971bc771be538"
};
function geometry(svg){return geometryNodes(elements(fromHtml(svg,{fragment:true})));}
function geometryNodes(nodes){return nodes.filter(n=>primitives.has(n.tagName)).map(n=>[n.tagName,Object.fromEntries(Object.entries(n.properties).filter(([k])=>!['id','fill','stroke'].includes(k)&&!k.startsWith('data')).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>[k,['markerStart','markerEnd'].includes(k)?String(v).match(/-([a-z]+)\)$/u)[1]:v])),n.tagName==='text'?toText(n):null]);}
const primitives=new Set(['marker','rect','path','text','circle','ellipse','line','g']);

const parts = publications.map(publication => ({...publication, figures:figureParts(publication.article)}));
const fullFiles = readdirSync(assetRoot).filter(file=>file.endsWith('.svg')).sort();
const panelFiles = readdirSync(resolve(assetRoot,'panels')).filter(file=>file.endsWith('.svg')).sort();
const parsed = svg=>inspect(svg,{standalone:true});
const figures = number=>parts.flatMap(p=>[
 {language:p.language,svg:p.figures[number-1].fullWideSvg},
 {language:p.language,svg:p.figures[number-1].mobileSvg},
]);
const percentage=(numerator,denominator)=>Math.round(numerator/denominator*1000)/10;
function checkAwards(svg){
 const {nodes}=parsed(svg),p=nodes[0].properties;
 assert.equal(p.dataDiagram,'solicitations-versus-awards');assert.equal(p.dataDelivered,'unavailable');assert.equal(p.dataSuccessiveCeilingsAdditive,'false');
 assert.equal(p.dataPeriod,'2026-03-13/2026-05-11');assert.equal(p.dataUnit,'million-barrels-crude');
 const bars=nodes.filter(n=>n.tagName==='rect'&&n.properties.dataValue!==undefined);assert.equal(bars.length,8);
 let scale,zero;
 matched.forEach(([rfp,award,ceiling,awarded,share],i)=>{
  for(const [j,metric,value] of [[0,'ceiling',ceiling],[1,'awarded',awarded]]){
   const b=bars[i*2+j].properties;assert.equal(b.dataRfpDate,rfp);assert.equal(b.dataAwardDate,award);assert.equal(b.dataMetric,metric);near(b.dataValue,value);near(b.dataAwardSharePct,share);
   scale??=Number(b.width)/value;zero??=Number(b.x);near(b.x,zero);near(b.width,value*scale,'All four matched rounds share one absolute scale');
  }
  assert.equal(percentage(awarded,ceiling),share);
 });
}
function checkReturns(svg){
 const {nodes}=parsed(svg),p=nodes[0].properties;
 assert.equal(p.dataDiagram,'future-barrel-returns');assert.equal(p.dataReturned,'unavailable');assert.equal(p.dataRatiosAnnualised,'false');assert.equal(p.dataUnit,'million-barrels-crude');
 const bars=nodes.filter(n=>n.tagName==='rect'&&n.properties.dataValue!==undefined);assert.equal(bars.length,6);
 let scale,zero;
 returns.forEach(([date,principal,premium,total,share],i)=>{
  const selected=bars.slice(i*3,i*3+3);scale??=Number(selected[0].properties.width)/principal;zero??=Number(selected[0].properties.x);
  for(const [j,metric,value] of [[0,'awarded',principal],[1,'future-principal',principal],[2,'future-premium',premium]]){
   const b=selected[j].properties;assert.equal(b.dataAwardDate,date);assert.equal(b.dataMetric,metric);near(b.dataValue,value);near(b.dataTotalDue,total);near(b.dataPremiumSharePct,share);near(b.width,value*scale);
   near(b.x,zero+(j===2?principal*scale:0),'Future principal and premium join without overlap');
   if(j)assert.deepEqual((Array.isArray(b.strokeDashArray)?b.strokeDashArray:String(b.strokeDashArray).split(/\s+/u)).map(Number),[6,4],'Future returns retain their dashed convention');
  }
  near(principal+premium,total);assert.equal(percentage(premium,principal),share);
 });
}
function checkSale(svg){
 const {nodes}=parsed(svg),p=nodes[0].properties;
 assert.equal(p.dataDiagram,'sale-2023-awardees');assert.equal(p.dataAwardDate,'2023-03-09');assert.equal(p.dataScope,'this-sale-only');assert.equal(p.dataUnit,'million-barrels-crude');
 for(const [key,value]of [['dataBidders',11],['dataBids',119],['dataAwardees',6],['dataTotalAwarded',26],['dataTopTwoTotal',15.7],['dataTopTwoSharePct',60.4]])near(p[key],value);
 const bars=nodes.filter(n=>n.tagName==='rect'&&n.properties.dataCompany!==undefined);assert.equal(bars.length,6);
 const scale=Number(bars[0].properties.width)/sale[0][1],zero=Number(bars[0].properties.x);
 sale.forEach(([company,value],i)=>{const b=bars[i].properties;assert.equal(b.dataCompany,company);near(b.dataValue,value);near(b.width,value*scale);near(b.x,zero);});
 near(sale.reduce((sum,[,value])=>sum+value,0),26);near(sale[0][1]+sale[1][1],15.7);assert.equal(percentage(15.7,26),60.4);
}
function replaceRequired(text,before,after){assert(text.includes(before));return text.replace(before,after);}

test('all original drawings, visible text, fonts and geometry remain unchanged',()=>{
 assert.equal(fullFiles.length,16);assert.deepEqual(fullFiles,Object.keys(originalGeometryHashes).sort());
 for(const file of fullFiles){const raw=readFileSync(resolve(assetRoot,file),'utf8');inspect(raw,{standalone:true});assert.equal(createHash('sha256').update(JSON.stringify(geometry(raw))).digest('hex'),originalGeometryHashes[file],file+' original composition');}
});

test('all static assets use local theme paints, unique IDs and safe controlled XML',()=>{
 const allIds=new Set();assert.equal(panelFiles.length,40);
 for(const [folder,files] of [['',fullFiles],['panels/',panelFiles]])for(const file of files){
  const raw=readFileSync(resolve(assetRoot,folder+file),'utf8'),theme=file.endsWith('.dark.svg')?'dark':file.endsWith('.light.svg')?'light':undefined;
  const {nodes}=inspect(raw,{theme,standalone:!folder});
  for(const id of nodes.filter(n=>n.properties.id).map(n=>n.properties.id)){assert(!allIds.has(id),'No ID collision across variants');allIds.add(id);}
 }
 const raw=parts[0].figures[0].fullWideSvg;
 assert.throws(()=>inspect(replaceRequired(raw,'</svg>','<script>alert(1)</script></svg>'),{standalone:true}));
 assert.throws(()=>inspect(replaceRequired(raw,'role="img"','role="img" onload="alert(1)"'),{standalone:true}));
 assert.throws(()=>localAsset('/infographies/reserves-allocation-05/../outside.svg'));
});

test('four selected 2026 invitations retain ceiling/award ratios and a common zero scale',()=>{
 const rows=csvRows(read('public/data/reserves-allocation-appels-attributions-2026.csv'),['rfp_date','award_date','ceiling_mb','awarded_mb','award_share_pct','delivered_mb','rfp_source','award_source']);
 assert.equal(rows.length,4);rows.forEach((r,i)=>{assert.deepEqual([r.rfp_date,r.award_date,Number(r.ceiling_mb),Number(r.awarded_mb),Number(r.award_share_pct)],matched[i]);assert.equal(r.delivered_mb,'','Missing deliveries remain unavailable, never zero');assert.equal(r.rfp_source,'S'+String(7+i*2).padStart(2,'0'));assert.equal(r.award_source,'S'+String(8+i*2).padStart(2,'0'));});
 for(const {svg}of figures(2))checkAwards(svg);
 const raw=figures(2)[0].svg;assert.throws(()=>checkAwards(replaceRequired(raw,'data-value="86.0"','data-value="87.0"')));
 assert.throws(()=>checkAwards(replaceRequired(raw,'data-delivered="unavailable"','data-delivered="0"')));
 for(const p of parts){assert(p.figures[1].nodes.some(n=>n.tagName==='a'&&n.properties.href==='#source-s24'),'June award source remains beside the selected four-round chart');}
});

test('future barrel commitments separate principal/premium and are never annualised or received',()=>{
 const rows=csvRows(read('public/data/reserves-allocation-engagements-restitution-2026.csv'),['award_date','principal_awarded_mb','premium_due_mb','total_due_mb','premium_share_pct','returned_mb','source']);
 assert.equal(rows.length,2);rows.forEach((r,i)=>{assert.deepEqual([r.award_date,Number(r.principal_awarded_mb),Number(r.premium_due_mb),Number(r.total_due_mb),Number(r.premium_share_pct)],returns[i]);assert.equal(r.returned_mb,'','Future receipt has no observed amount');assert.equal(r.source,i?'S14':'S08');});
 for(const {svg}of figures(3))checkReturns(svg);
 const raw=figures(3)[0].svg;assert.throws(()=>checkReturns(replaceRequired(raw,'data-returned="unavailable"','data-returned="55"')));assert.throws(()=>checkReturns(replaceRequired(raw,'data-ratios-annualised="false"','data-ratios-annualised="true"')));
});

test('the separate 2023 sale keeps six recipients, 26 million barrels and a sale-specific concentration',()=>{
 const rows=csvRows(read('public/data/reserves-allocation-attributaires-vente-2023.csv'),['company','label','awarded_mb','award_date','source']);assert.equal(rows.length,6);
 rows.forEach((r,i)=>{assert.deepEqual([r.label,Number(r.awarded_mb)],sale[i]);assert(r.company.length>=r.label.length);assert.equal(r.award_date,'2023-03-09');assert.equal(r.source,'S18');});
 for(const {svg}of figures(4))checkSale(svg);
 const raw=figures(4)[0].svg;assert.throws(()=>checkSale(replaceRequired(raw,'data-scope="this-sale-only"','data-scope="all-oil"')));
});

test('mobile galleries preserve complete original bodies, continuous crops, themes and keyboard links',()=>{
 checkCss(css);assert(postcss.parse(globalCss).nodes.some(n=>n.type==='atrule'&&n.name==='import'&&['"./reserves-allocation-infographics.css"',"'./reserves-allocation-infographics.css'"].includes(n.params)),'Global CSS imports this scoped publication stylesheet');
 for(const p of parts){
  const articleNodes=elements(fromHtml(p.article,{fragment:true})),articleIds=new Set(articleNodes.filter(n=>n.properties.id).map(n=>n.properties.id));
  assert.equal(articleIds.size,articleNodes.filter(n=>n.properties.id).length,'No IDs duplicated in either article');
  p.figures.forEach((f,i)=>{
   const mobile=inspect(f.mobileSvg,{standalone:true}),height=mobile.viewBox[3];let end=0;
   const body=mobile.nodes[0].children.filter(n=>n.type==='element'&&!['defs','title','desc','metadata','style'].includes(n.tagName));
   const baseline=geometryNodes(body.flatMap(elements));
   for(const panel of f.panels){
    const images=elements(panel).filter(n=>n.tagName==='img');
    const versions=images.map(image=>{
     const theme=image.properties.className.includes('rsv05-panel-dark')?'dark':'light';const raw=localAsset(image.properties.src);const inspected=inspect(raw,{theme});
     const rootNode=inspected.nodes[0],source=inspected.nodes.find(n=>n.tagName==='g'&&n.properties.dataSourceComposition==='complete');assert(source);
     assert.deepEqual(geometryNodes(source.children.flatMap(elements)),baseline,'Each panel retains all original drawing primitives without simplification');
     const [x,y,w,h]=inspected.viewBox;assert.equal(x,0);assert.equal(w,400);assert.equal(y,end);assert.equal(h,Number(image.properties.height));assert(h*maximumWidths[i]/400<=500);
     assert.equal(Number(rootNode.properties.dataCropStart),y);assert.equal(Number(rootNode.properties.dataCropEnd),y+h);
     return {y,h};
    });
    assert.deepEqual(versions[0],versions[1],'Themes select the same original module');end=versions[0].y+versions[0].h;
   }
   assert.equal(end,height,'Crops cover the full original exactly once');
   for(const link of f.nodes.filter(n=>n.tagName==='a'&&String(n.properties.href).startsWith('#source-s')))assert(articleIds.has(link.properties.href.slice(1)),'Caption source anchors resolve');
  });
  assert(p.figures[0].nodes.some(n=>n.tagName==='a'&&n.properties.href==='#source-s23'),'Current parliamentary evidence accompanies the unchanged contract diagram');
 }
});

test('June award information preserves its as-of date, distinct scope and missing execution data', () => {
  const rows = read('public/data/reserves-allocation-june-2026.csv').trim().split(/\r?\n/u).map(row => row.split(','));
  assert.equal(rows.length, 2);
  const june = Object.fromEntries(rows[0].map((name, index) => [name, rows[1][index]]));
  assert.equal(june.award_as_of, '2026-06-22');
  assert.equal(june.award_date, undefined, 'The exact award date is not disclosed');
  assert.equal(june.rfp_date, '2026-06-10');
  assert.equal(june.counterparty, 'Vitol Inc.');
  near(Number(june.awarded_mb) / Number(june.ceiling_mb) * 100, 1.25);
  near(june.award_share_pct, 1.25);
  assert.equal(june.delivered_mb, '');
  assert.equal(june.premium_due_mb, '');
  assert.equal(new URL(june.source_url).hostname, 'www.spr.doe.gov');
  assert.equal(new URL(june.ceiling_source_url).hostname, 'www.energy.gov');
});
