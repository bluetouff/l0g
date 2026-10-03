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
  ['fr', 'src/content/posts/reserves-petrolieres-transmission-prix-pompe.md'],
  ['en', 'src/content/posts-en/emergency-oil-reserves-pass-through-pump-prices.md'],
].map(([language, path]) => ({ language, article: read(path) }));
const css = read('src/styles/reserves-pump-infographics.css');
const globalCss = read('src/styles/global.css');
const assetRoot = realpathSync(resolve(root, 'public/infographies/reserves-pump-06'));
const panelCounts = [3, 2, 2, 2];
const maximumWidths = [384, 360, 384, 360];
const responseValues = [['one_week', .45, 60], ['14_working_days', .72, 96], ['long_run', .75, 100]];
const changeValues = [['dated_brent_usd_bbl', -4.86], ['dated_brent_eur_bbl', -4.01], ['refined_diesel_usd_tonne', -4.31], ['diesel_retail_incl_tax', -.54]];
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
        assert(['www.consilium.europa.eu','www.ecologie.gouv.fr','www.banque-france.fr','www.dallasfed.org','www.eia.gov'].includes(url.hostname));
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
      if (name === 'fontFamily') assert(['Arial, Helvetica, sans-serif','ui-monospace, monospace'].includes(value), 'Preserve the two supplied local font stacks');
    }
  }
  const properties = nodes[0].properties;
  assert.equal(nodes.filter(node => node.tagName === 'style').length, standalone ? 1 : 0);
  assert.equal(properties.xmlns, 'http://www.w3.org/2000/svg');
  assert.equal(properties.role, 'img');
  if (language) {
    if (properties.lang !== undefined) assert.equal(properties.lang, language);
    assert(ids.every(id => id.startsWith(`reserves06-${language}-`)));
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
  assert.match(url, /^\/infographies\/reserves-pump-06\/(?:panels\/)?[a-z0-9.-]+\.svg$/u);
  const actual = realpathSync(resolve(root, 'public', url.slice(1)));
  assert(actual.startsWith(assetRoot + sep), 'Referenced files stay inside the publication asset directory');
  return readFileSync(actual, 'utf8');
}

function figureParts(article) {
  const tree = fromHtml(article, { fragment: true });
  const figures = elements(tree).filter(node => node.tagName === 'figure' && node.properties.className?.includes('l0g-reserves06-figure'));
  assert.equal(figures.length, 4, 'All four original explanatory compositions remain present');
  assert.equal(elements(tree).filter(node => node.tagName === 'svg').length, 4, 'Only full wide SVGs are inline');
  return figures.map((figure, index) => {
    const fragment = toHtml(figure), nodes = elements(figure);
    assert.deepEqual(nodes[0].properties.className, ['infographic', 'l0g-reserves06-figure']);
    assert.equal(Number(nodes[0].properties.dataFigure), index + 1);
    const byClass = name => nodes.filter(node => node.properties.className?.includes(name));
    const wide = byClass('rsv06-wide');
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
    const gallery = byClass('rsv06-gallery');
    assert.equal(gallery.length, 1);
    assert.equal(gallery[0].properties.role, 'region');
    assert.equal(gallery[0].properties.tabIndex, 0);
    assert(normalise(gallery[0].properties.ariaLabel));
    const hints = byClass('rsv06-scroll-hint');
    assert.equal(hints.length, 1);
    assert(normalise(toText(hints[0])));
    assert.deepEqual(gallery[0].properties.ariaDescribedBy, [hints[0].properties.id]);
    const panels = byClass('rsv06-panel');
    assert.equal(panels.length, panelCounts[index]);
    const panelIds = panels.map(panel => panel.properties.id);
    assert(panelIds.every(Boolean) && new Set(panelIds).size === panelIds.length);
    panels.forEach((panel, panelIndex) => {
      assert.equal(panel.properties.role, 'group');
      assert.equal(Number(panel.properties.dataPanel), panelIndex + 1);
      const images = elements(panel).filter(node => node.tagName === 'img');
      assert.equal(images.length, 2);
      assert.deepEqual(images.map(node => node.properties.className), [['rsv06-panel-dark'], ['rsv06-panel-light']]);
      images.forEach(image => {
        assert(normalise(image.properties.alt));
        assert.equal(Number(image.properties.width), 480);
        assert(Number(image.properties.height) > 0 && Number(image.properties.height) * maximumWidths[index] / 480 <= 500, 'Mobile panels fit without an oversized vertical graphic');
      });
    });
    const pagination = byClass('rsv06-pagination');
    assert.equal(pagination.length, 1);
    assert.deepEqual(elements(pagination[0]).filter(node => node.tagName === 'a').map(node => node.properties.href), panelIds.map(id => `#${id}`));
    const complete = byClass('rsv06-full-link');
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
    assert(['(max-width: 640px)', '(min-width: 641px)', '(prefers-reduced-motion: reduce)'].includes(rule.params));
  });
  parsed.walkRules(rule => {
    for (const selector of rule.selectors) assert.match(selector, /^(?:(?::root|html)\[data-theme=["']light["']\]\s+)?(?:\.prose\s+)?(?:figure)?\.l0g-reserves06-figure(?:[\s.:[>]|$)/u, 'Styles cannot affect neighbouring articles');
    rules.push(rule);
  });
  parsed.walkDecls(decl => {
    assert(!decl.important);
    assert(!/(?:url\s*\(|expression\s*\(|javascript:)/iu.test(decl.value));
    if (decl.prop === 'position') assert(!['fixed', 'sticky'].includes(decl.value));
    if (decl.prop === 'height') assert.equal(decl.value, 'auto');
  });
  const declarations = selector => Object.fromEntries(rules.filter(rule => rule.selector === selector).flatMap(rule => rule.nodes.filter(node => node.type === 'decl').map(node => [node.prop, node.value])));
  const galleryRule = rules.find(rule => rule.selector.endsWith(' .rsv06-gallery'));
  assert(galleryRule, 'Mobile gallery styles are present');
  const gallery = declarations(galleryRule.selector);
  assert.equal(gallery.display, 'flex');
  assert.equal(gallery['overflow-x'], 'auto');
  assert.match(gallery['scroll-snap-type'], /^x (?:mandatory|proximity)$/u);
  assert.equal(gallery['max-width'], '100%');
  const panelRule = rules.find(rule => rule.selector.endsWith(' .rsv06-panel'));
  assert(panelRule);
  assert.equal(declarations(panelRule.selector)['scroll-snap-align'], 'start');
  const imageRule = rules.find(rule => rule.selectors.some(selector => /\.rsv06-panel > img$/u.test(selector)));
  assert(imageRule);
  assert.equal(declarations(imageRule.selector).width, '100%');
  assert.equal(declarations(imageRule.selector).height, 'auto');
  const mobileQuery = parsed.nodes.find(node => node.type === 'atrule' && node.params === '(max-width: 640px)');
  assert(mobileQuery);
  const mobileRules = mobileQuery.nodes.filter(node => node.type === 'rule');
  const mobileDecl = suffix => Object.fromEntries(mobileRules.filter(rule => rule.selector.endsWith(suffix)).flatMap(rule => rule.nodes.filter(node => node.type === 'decl').map(node => [node.prop, node.value])));
  assert.equal(mobileDecl(' .rsv06-wide').display, 'none');
  assert.equal(mobileDecl(' .rsv06-mobile').display, 'block');
  assert.equal(mobileDecl(' .rsv06-mobile')['max-width'], '24rem');
  for (const figure of [2,4]) {
    const selected = `.l0g-reserves06-figure[data-figure="${figure}"] .rsv06-mobile`;
    const narrower = rules.find(rule => rule.selectors.includes(selected));
    assert(narrower); assert.equal(Object.fromEntries(narrower.nodes.filter(n=>n.type==='decl').map(n=>[n.prop,n.value]))['max-width'], '22.5rem');
  }
  assert(rules.some(rule => rule.selector.endsWith(' .rsv06-mobile') && rule.parent.type === 'root' && rule.nodes.some(node => node.prop === 'display' && node.value === 'none')));
  assert.equal(declarations('.l0g-reserves06-figure .rsv06-panel > .rsv06-panel-light').display,'none');
  assert.equal(declarations(':root[data-theme="light"] .l0g-reserves06-figure .rsv06-panel > .rsv06-panel-dark').display,'none');
  assert.equal(declarations(':root[data-theme="light"] .l0g-reserves06-figure .rsv06-panel > .rsv06-panel-light').display,'block');
  assert(rules.some(rule => rule.selector.endsWith('figcaption') || rule.nodes.some(node => node.prop === 'padding-bottom' && Number.parseFloat(node.value) > 0)), 'Graphs retain spacing from following text');
}



// Drawing baselines exclude semantic paint and namespaced IDs; only the two approved EN mobile subtitle positions differ from the supplied archive.
const originalGeometryHashes={
  "01-circuits.en.mobile.svg": "86ea24889000716c1cace9a478f6d76cde9f0f83ff2afafd3e3faa8586a85086",
  "01-circuits.en.svg": "0561eefe064fd00947746486e723ede3d422b7436aff9cbbce8362b97e36601a",
  "01-circuits.fr.mobile.svg": "51941d3d507901e59b9f9db2c330a79ff269ff59e3a8cc6255d88bcf0f0354f3",
  "01-circuits.fr.svg": "ff5a8b3951a1400bbb8ada2af689845a0905d1d4b2f0c64abccd7623c0a05d17",
  "02-prix-litres.en.mobile.svg": "7a550ab0066377a10bceb3f2842152b60ac60d2b425f7cf23d13f4b250cacdc2",
  "02-prix-litres.en.svg": "8a0ab0bc7bb776ff1d6cf50405c749d48988cdb50964e2a62e13de86ceb0f500",
  "02-prix-litres.fr.mobile.svg": "520158388fcd2332b4e0b98efc2ff538e2db80550fc8269f89476ca8fbf68a9a",
  "02-prix-litres.fr.svg": "67126833cc54d0404d95e46f1c5381859ce21944313ffea8b15abfac5af3ad61",
  "03-transmission.en.mobile.svg": "eaaf6ac7b8833d912283cef9a43c51f90d88a11572876f0a26bad21906b01ffe",
  "03-transmission.en.svg": "90b10e61846369c3def65dff35bd3fce8c1fbb4b3a72e67e711b0a8794db764e",
  "03-transmission.fr.mobile.svg": "734ec4450d3e3d766ee889359ad9f3df3788b95dd2295a065a3c97703e3733a9",
  "03-transmission.fr.svg": "b57fbbf940e78259a9149f40e74bb72291ccff394fef560a20a8cfd8e00990c8",
  "04-chronologie.en.mobile.svg": "19c40140afa6b68714b414976791750cb8e02aabedeb76479272ad75d07ca637",
  "04-chronologie.en.svg": "e4fcd8ae09240637c7890a0f4a9635339dac3c8790d13b4aaeeaa0b06329290a",
  "04-chronologie.fr.mobile.svg": "8fd2d40637445c2adb54adfe53f4d0872146940debf43aeb26a59645a80f56dc",
  "04-chronologie.fr.svg": "c338c8cf2498c565bdb8b8b5b8a1e83e87808668b3dd178cde4e03bf51a0cd63"
};
function geometry(svg){return geometryNodes(elements(fromHtml(svg,{fragment:true})));}
function geometryNodes(nodes){return nodes.filter(n=>primitives.has(n.tagName)).map(n=>[n.tagName,Object.fromEntries(Object.entries(n.properties).filter(([k])=>!['id','fill','stroke'].includes(k)&&!k.startsWith('data')).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>[k,['markerStart','markerEnd'].includes(k)?String(v).match(/-(arrow|signal)\)$/u)[1]:v])),n.tagName==='text'?toText(n):null]);}
const primitives=new Set(['marker','rect','path','text','circle','ellipse','line','g']);

const parts=publications.map(p=>({...p,figures:figureParts(p.article)}));
const fullFiles=readdirSync(assetRoot).filter(f=>f.endsWith('.svg')).sort();
const panelFiles=readdirSync(resolve(assetRoot,'panels')).filter(f=>f.endsWith('.svg')).sort();
const figures=n=>parts.flatMap(p=>[p.figures[n-1].fullWideSvg,p.figures[n-1].mobileSvg]);
const parsed=svg=>inspect(svg,{standalone:true});
const rows=(name,header)=>csvRows(read(`public/data/reserves-pump-${name}.csv`),header);
function replaceRequired(text,before,after){assert(text.includes(before));return text.replace(before,after);}
function checkBridge(svg){
 const {nodes}=parsed(svg),p=nodes[0].properties;
 assert.equal(p.dataUnit,'eurocent-per-litre');assert.equal(p.dataObservationDate,'2026-09-25');assert.equal(p.dataGeography,'mainland-France-excluding-Corsica');assert.equal(p.dataScenario,'hypothetical-not-forecast');near(p.dataVatRatePct,20);
 const bars=nodes.filter(n=>n.tagName==='rect'&&n.properties.dataComponent),expected=[['pre-tax',136.8,'observed-rounded'],['excise',60.75,'reference-rate'],['VAT',39.51,'calculated'],['tax-inclusive',237.06,'observed-rounded']];assert.equal(bars.length,4);
 const scale=Number(bars[0].properties.height)/136.8,zero=Number(bars[0].properties.y)+Number(bars[0].properties.height);
 expected.forEach(([metric,value,status],i)=>{const b=bars[i].properties;assert.equal(b.dataComponent,metric);near(b.dataValue,value);assert.equal(b.dataStatus,status);near(b.height,value*scale);near(Number(b.y)+Number(b.height),i>0&&i<3?Number(bars[i-1].properties.y):zero);});near(bars[2].properties.y,Number(bars[3].properties.y));
 const scenario=nodes.filter(n=>n.tagName==='rect'&&n.properties.dataScenario);assert.equal(scenario.length,1);const s=scenario[0].properties;assert.equal(s.dataScenario,'hypothetical');assert.equal(s.dataAssumptions,'unchanged-excise-and-20pct-VAT-full-transmission-not-forecast');near(s.dataPreTaxChange,-10);near(s.dataVatChange,-2);near(s.dataTaxInclusiveChange,-12);near(s.dataSavingFiftyLitresEur,6);
 near((136.8+60.75)*.2,39.51);near(136.8+60.75+39.51,237.06);near(237.06*.5,118.53);
}
function checkResponses(svg){
 const {nodes}=parsed(svg),p=nodes[0].properties;assert.equal(p.dataMetric,'pre-tax-retail-response-pct');near(p.dataInputShockPct,1);assert.equal(p.dataStudyPublication,'2021-10-14');assert.equal(p.dataPageUpdated,'2026-09-24');assert.equal(p.dataRecalibratedForCurrentYear,'false');assert.equal(p.dataDailyPath,'unavailable');assert.equal(p.dataConfidenceBands,'unavailable');
 const bars=nodes.filter(n=>n.tagName==='rect'&&n.properties.dataHorizon);assert.equal(bars.length,3);const scale=Number(bars[0].properties.width)/.45,zero=Number(bars[0].properties.x);
 responseValues.forEach(([horizon,value,share],i)=>{const b=bars[i].properties;assert.equal(b.dataHorizon,horizon);near(b.dataResponsePct,value);near(b.dataShareFinalResponsePct,share);assert.equal(b.dataStatus,'historical-estimate');near(b.x,zero);near(b.width,value*scale);near(value/.75*100,share);});
}
const weekly=rows('gazole-france-vendredis-2026',['date','diesel_pre_tax_eurocent_per_litre','diesel_incl_tax_eurocent_per_litre','diesel_incl_tax_eur_per_litre','source','source_pages','status','geography']);
const changes=rows('variations-septembre-2026',['series','reference_label_before','value_before','reference_label_after','value_after','unit','frequency','change_pct','source','interpretation']);
function checkChronology(svg){
 const {nodes,viewBox}=parsed(svg),p=nodes[0].properties;assert.equal(p.dataMetric,'diesel-retail-including-taxes');assert.equal(p.dataUnit,'EUR-per-litre');assert.equal(p.dataPeriod,'2026-07-03/2026-09-25');assert.equal(p.dataGeography,'mainland-France-excluding-Corsica');near(p.dataObservations,13);near(p.dataAxisMin,1.8);near(p.dataAxisMax,2.5);assert.equal(p.dataAnnouncementDate,'2026-10-02');assert.equal(p.dataAnnouncementPrice,'unavailable');assert.equal(p.dataPassThroughEstimate,'unavailable');
 const points=nodes.filter(n=>n.tagName==='circle'&&n.properties.dataStatus==='observed-rounded');assert.equal(points.length,13);const mobile=viewBox[2]===480,bottom=mobile?494:467,height=mobile?262:236,start=Number(points[0].properties.cx),step=Number(points[1].properties.cx)-start;
 weekly.forEach((r,i)=>{const b=points[i].properties;assert.equal(b.dataDate,r.date);near(b.dataValueEurPerLitre,Number(r.diesel_incl_tax_eur_per_litre));near(b.cy,bottom-(Number(r.diesel_incl_tax_eur_per_litre)-1.8)*height/.7);near(b.cx,start+i*step);});
 const highlight=nodes.filter(n=>n.tagName==='circle'&&n.properties.dataStatus==='endpoint-highlight');assert.equal(highlight.length,1);assert.equal(highlight[0].properties.dataNewObservation,'false');assert.equal(highlight[0].properties.dataDate,'2026-09-25');near(highlight[0].properties.cx,Number(points[12].properties.cx));near(highlight[0].properties.cy,Number(points[12].properties.cy));
 const band=nodes.filter(n=>n.tagName==='rect'&&n.properties.dataAnnouncementDate);assert.equal(band.length,1);assert.equal(band[0].properties.dataObservedPrice,'unavailable');assert(Number(band[0].properties.x)>Number(points[12].properties.cx));
}
function checkChanges(svg){
 const {nodes}=parsed(svg),bars=nodes.filter(n=>n.tagName==='rect'&&n.properties.dataSeries);assert.equal(bars.length,4);const scale=Number(bars[0].properties.width)/4.86,zero=Number(bars[0].properties.x)+Number(bars[0].properties.width);
 changes.forEach((r,i)=>{const b=bars[i].properties;assert.equal(b.dataSeries,r.series);near(b.dataChangePct,Number(r.change_pct));assert.equal(b.dataUnit,r.unit);assert.equal(b.dataFrequency,r.frequency);assert.equal(b.dataReferenceBefore,r.reference_label_before);assert.equal(b.dataReferenceAfter,r.reference_label_after);assert.equal(b.dataInterpretation,'descriptive_change_not_pass_through_coefficient');near(b.width,-Number(r.change_pct)*scale);near(Number(b.x)+Number(b.width),zero);});
}

test('source compositions, fonts and visible text survive the one approved subtitle layout correction',()=>{
 assert.equal(fullFiles.length,16);assert.deepEqual(fullFiles,Object.keys(originalGeometryHashes).sort());
 for(const file of fullFiles){const raw=readFileSync(resolve(assetRoot,file),'utf8');inspect(raw,{standalone:true});assert.equal(createHash('sha256').update(JSON.stringify(geometry(raw))).digest('hex'),originalGeometryHashes[file],file+' original drawing');const changed=elements(fromHtml(raw,{fragment:true})).filter(n=>n.properties.dataLayoutCorrection);if(file==='03-transmission.en.mobile.svg')assert.deepEqual(changed.map(n=>[toText(n),Number(n.properties.y)]),[['Banque de France · Results published 14',142],['October 2021',167]]);else assert.equal(changed.length,0);}
 for(const svg of figures(1)){const p=parsed(svg).nodes[0].properties;assert.equal(p.dataScale,'qualitative');assert.equal(p.dataMeasuredFlow,'unavailable');assert.equal(p.dataMeasuredTiming,'unavailable');}
});
test('52 static assets use exact local paints, globally unique IDs and safe controlled XML',()=>{
 const ids=new Set();assert.equal(panelFiles.length,36);
 for(const [folder,files]of [['',fullFiles],['panels/',panelFiles]])for(const file of files){const raw=readFileSync(resolve(assetRoot,folder+file),'utf8'),theme=file.endsWith('.dark.svg')?'dark':file.endsWith('.light.svg')?'light':undefined;for(const n of inspect(raw,{theme,standalone:!folder}).nodes)if(n.properties.id){assert(!ids.has(n.properties.id));ids.add(n.properties.id);}}
 const raw=parts[0].figures[0].fullWideSvg;assert.throws(()=>inspect(replaceRequired(raw,'</svg>','<script>alert(1)</script></svg>'),{standalone:true}));assert.throws(()=>inspect(replaceRequired(raw,'role="img"','role="img" onload="alert(1)"'),{standalone:true}));assert.throws(()=>inspect(replaceRequired(raw,'var(--color-ink)','#123456'),{standalone:true}));assert.throws(()=>localAsset('/infographies/reserves-pump-06/../outside.svg'));
});
test('observed taxes reconcile with VAT on excise, while the saving remains an explicitly hypothetical scenario',()=>{
 const bridge=rows('decomposition-prix-2026-09-25',['component','value_eurocent_per_litre','status','source','date']);assert.deepEqual(bridge.map(r=>[r.component,Number(r.value_eurocent_per_litre)]),[['pre_tax_price',136.8],['excise',60.75],['VAT',39.51]]);assert(bridge.every(r=>r.date==='2026-09-25'));
 const data=rows('scenario-fiscal-pedagogique',['scenario','pre_tax_eurocent_per_litre','excise_eurocent_per_litre','VAT_eurocent_per_litre','incl_tax_eurocent_per_litre','cost_50_litres_eur','source','assumptions']);assert.equal(data.length,2);assert.deepEqual(data.map(r=>r.scenario),['baseline','hypothetical_pre_tax_minus_10']);for(const r of data){assert.equal(r.assumptions,'unchanged_tax_rules_and_other_costs_full_transmission_not_forecast');near((Number(r.pre_tax_eurocent_per_litre)+Number(r.excise_eurocent_per_litre))*.2,Number(r.VAT_eurocent_per_litre));near(Number(r.pre_tax_eurocent_per_litre)+Number(r.excise_eurocent_per_litre)+Number(r.VAT_eurocent_per_litre),Number(r.incl_tax_eurocent_per_litre));near(Number(r.incl_tax_eurocent_per_litre)*.5,Number(r.cost_50_litres_eur));}near(Number(data[0].cost_50_litres_eur)-Number(data[1].cost_50_litres_eur),6);
 for(const svg of figures(2))checkBridge(svg);const raw=figures(2)[0];assert.throws(()=>checkBridge(replaceRequired(raw,'data-scenario="hypothetical"','data-scenario="observed"')));assert.throws(()=>checkBridge(replaceRequired(raw,'data-value="39.51"','data-value="27.36"')));
});
test('Banque de France estimates remain historical, pre-tax and on a common absolute scale',()=>{
 const data=rows('transmission-bdf-2021',['horizon','pre_tax_response_pct','share_of_long_run_response_pct','source','original_publication']);assert.equal(data.length,3);data.forEach((r,i)=>{assert.deepEqual([r.horizon,Number(r.pre_tax_response_pct),Number(r.share_of_long_run_response_pct)],responseValues[i]);assert.equal(r.source,'S06');assert.equal(r.original_publication,'2021-10-14');});
 for(const svg of figures(3))checkResponses(svg);const raw=figures(3)[0];assert.throws(()=>checkResponses(replaceRequired(raw,'data-recalibrated-for-current-year="false"','data-recalibrated-for-current-year="true"')));assert.throws(()=>checkResponses(replaceRequired(raw,'data-metric="pre-tax-retail-response-pct"','data-metric="tax-inclusive-response-pct"')));
});
test('13 Friday observations end before the G7 announcement, whose marker never becomes a price observation',()=>{
 assert.equal(weekly.length,13);weekly.forEach((r,i)=>{assert.equal(r.status,'observed_rounded');assert.equal(r.source,'S02');assert.equal(r.geography,'mainland_France_excluding_Corsica');const date=new Date(r.date+'T00:00:00Z');assert.equal(date.getUTCDay(),5);if(i)near(date.getTime()-new Date(weekly[i-1].date+'T00:00:00Z').getTime(),7*86400000);near(Number(r.diesel_incl_tax_eurocent_per_litre)/100,Number(r.diesel_incl_tax_eur_per_litre));});assert.equal(weekly[0].date,'2026-07-03');assert.equal(weekly[12].date,'2026-09-25');
 for(const svg of figures(4))checkChronology(svg);assert.throws(()=>checkChronology(replaceRequired(figures(4)[0],'data-announcement-price="unavailable"','data-announcement-price="2.3706"')));
});
test('four descriptive variations retain independent products, currencies and observation windows',()=>{
 assert.equal(changes.length,4);changes.forEach((r,i)=>{assert.deepEqual([r.series,Number(r.change_pct)],changeValues[i]);assert.equal(r.reference_label_before,'2026-09-18');assert.equal(r.reference_label_after,'2026-09-25');assert.equal(r.interpretation,'descriptive_change_not_pass_through_coefficient');assert.equal(r.source,'S02');assert(Math.abs((Number(r.value_after)/Number(r.value_before)-1)*100-Number(r.change_pct))<=.0051);});assert.deepEqual(changes.map(r=>r.unit),['USD/bbl','EUR/bbl','USD/metric_tonne','eurocent/litre']);assert.deepEqual(changes.map(r=>r.frequency),['weekly_quotation','weekly_quotation','weekly_quotation','Friday_observation']);
 for(const svg of figures(4))checkChanges(svg);assert.throws(()=>checkChanges(replaceRequired(figures(4)[0],'data-interpretation="descriptive_change_not_pass_through_coefficient"','data-interpretation="pass_through_coefficient"')));
});
test('native mobile galleries retain full source bodies, matching themes, continuous crops and keyboard links',()=>{
 checkCss(css);
 assert(!postcss.parse(globalCss).nodes.some(n=>n.type==='atrule'&&n.name==='import'&&['"./reserves-pump-infographics.css"',"'./reserves-pump-infographics.css'"].includes(n.params)), 'Article-only styles must not inflate the home critical CSS');
 for (const [page, stylesheet] of [
  ['src/pages/posts/[...slug].astro', '../../styles/reserves-pump-infographics.css'],
  ['src/pages/en/analysis/[...slug].astro', '../../../styles/reserves-pump-infographics.css'],
 ]) assert(read(page).includes(`import '${stylesheet}';`), 'Missing article stylesheet: '+page);
 for(const p of parts){const articleNodes=elements(fromHtml(p.article,{fragment:true})),ids=articleNodes.filter(n=>n.properties.id).map(n=>n.properties.id);assert.equal(new Set(ids).size,ids.length);p.figures.forEach((f,i)=>{const mobile=inspect(f.mobileSvg,{standalone:true}),body=mobile.nodes[0].children.filter(n=>n.type==='element'&&!['defs','title','desc','metadata','style'].includes(n.tagName)),baseline=geometryNodes(body.flatMap(elements));let end=0;
  for(const panel of f.panels){const versions=elements(panel).filter(n=>n.tagName==='img').map(image=>{const theme=image.properties.className.includes('rsv06-panel-dark')?'dark':'light',d=inspect(localAsset(image.properties.src),{theme}),source=d.nodes.find(n=>n.tagName==='g'&&n.properties.dataSourceComposition==='complete');assert(source);assert.deepEqual(geometryNodes(source.children.flatMap(elements)),baseline);const [x,y,w,h]=d.viewBox;assert.equal(x,0);assert.equal(w,480);assert.equal(y,end);assert.equal(h,Number(image.properties.height));assert(h*maximumWidths[i]/480<=500);assert.equal(Number(d.nodes[0].properties.dataCropStart),y);assert.equal(Number(d.nodes[0].properties.dataCropEnd),y+h);return {y,h};});assert.deepEqual(versions[0],versions[1]);end=versions[0].y+versions[0].h;}
  assert.equal(end,mobile.viewBox[3]);for(const link of f.nodes.filter(n=>n.tagName==='a'&&String(n.properties.href).startsWith('#source-s')))assert(ids.includes(link.properties.href.slice(1)));});}
});
