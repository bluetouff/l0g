import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, realpathSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

// npm runs this contract from the repository root; the same file can be run in an isolated checkout.
const root = process.cwd(), require = createRequire(resolve(root, 'package.json'));
const { XMLValidator, XMLBuilder } = require('fast-xml-parser');
const { fromHtml } = await import(require.resolve('hast-util-from-html'));
const { toText } = await import(require.resolve('hast-util-to-text'));
const { default: postcss } = await import(require.resolve('postcss'));
const { default: sharp } = await import(require.resolve('sharp'));
const { parseCsv } = await import(pathToFileURL(resolve(root, 'scripts/audit-indexation-cohort.mjs')));
const read = path => readFileSync(resolve(root, path), 'utf8');
const assetRoot = realpathSync(resolve(root, 'public/infographies/brazil-pressure'));
const elements = node => [node, ...(node.children ?? []).flatMap(elements)].filter(item => item.type === 'element');
const normalise = value => String(value ?? '').replace(/\s+/gu, ' ').trim();
const textOf = nodes => normalise(nodes.filter(node => node.tagName === 'text').map(toText).join(' '));
const near = (actual, expected, tolerance = 1e-7) => assert(Math.abs(Number(actual) - expected) <= tolerance, `${actual} differs from ${expected}`);
const models = ['policy-chronology', 'tariff-conditional-example', 'annual-bilateral-trade', 'scenario-fx-financing', 'separated-financing-instruments', 'alternative-post-election-scenarios'];
const publicCsv = 'public/data/brazil-pressure-verified-data-2026-10-03.csv';
const rows = parseCsv(read(publicCsv)), byMetric = new Map(rows.map(row => [row.metric, row]));
assert.equal(byMetric.size, rows.length, 'Metric identifiers cannot silently overwrite each other');
assert.equal(rows.length, 19);
const chronology = parseCsv(read('public/data/brazil-pressure-chronology-2026-10-03.csv'));
const full = (n, language, mobile = false) => read(`public/infographies/brazil-pressure/figure${String(n).padStart(2, '0')}.${language}${mobile ? '.mobile' : ''}.svg`);
const allFull = Array.from({ length: 6 }, (_, i) => ['fr', 'en'].flatMap(language => [false, true].map(mobile => ({ n: i + 1, language, mobile, svg: full(i + 1, language, mobile) })))).flat();

const globalCss = postcss.parse(read('src/styles/global.css'));
function palette(theme) {
  const values = {};
  globalCss.walkAtRules('theme', rule => rule.walkDecls(decl => { if (decl.prop.startsWith('--color-')) values[decl.prop] = decl.value; }));
  if (theme === 'light') globalCss.walkRules(':root[data-theme="light"]', rule => rule.walkDecls(decl => { if (decl.prop.startsWith('--color-')) values[decl.prop] = decl.value; }));
  return values;
}
const tokens = ['ink', 'surface', 'surface-2', 'line-strong', 'paper', 'muted', 'signal', 'accent', 'amber', 'topic-blue'];
const attributes = new Set('xmlns viewBox width height role ariaLabelledBy style id x y rx cx cy r fill stroke strokeWidth strokeOpacity strokeDashArray strokeLineCap strokeLineJoin d fontFamily fontSize fontWeight textAnchor markerEnd markerWidth markerHeight refX refY orient clipPath clipPathUnits'.split(' '));
function inspect(svg, theme) {
  assert(!/<!DOCTYPE|<!ENTITY|<\?/iu.test(svg));
  assert.equal(XMLValidator.validate(svg), true, 'Validate XML before parsing or rendering');
  const nodes = elements(fromHtml(svg, { fragment: true })), ids = nodes.filter(node => node.properties.id).map(node => node.properties.id);
  assert.equal(nodes[0]?.tagName, 'svg'); assert.equal(nodes.filter(node => node.tagName === 'svg').length, 1);
  assert.equal(ids.length, new Set(ids).size);
  const paints = new Set(Object.values(palette(theme)).map(value => value.toLowerCase()));
  for (const node of nodes) {
    assert(['svg', 'title', 'desc', 'style', 'defs', 'marker', 'clipPath', 'g', 'rect', 'circle', 'path', 'text'].includes(node.tagName), `Unsupported or active element: ${node.tagName}`);
    if (node.tagName === 'style') {
      assert(!theme && Object.keys(node.properties).length === 0);
      const parsed = postcss.parse(toText(node)); assert.equal(parsed.nodes.length, 2);
      const check = (rule, mode) => {
        assert.equal(rule.type, 'rule'); assert.equal(rule.selector, ':root');
        assert(rule.nodes.every(item => item.type === 'decl' && !item.important));
        assert.deepEqual(Object.fromEntries(rule.nodes.map(item => [item.prop, item.value])), { 'color-scheme': mode, ...Object.fromEntries(tokens.map(token => [`--color-${token}`, palette(mode)[`--color-${token}`]])) });
      };
      check(parsed.nodes[0], 'light');
      const media = parsed.nodes[1]; assert.equal(media.type, 'atrule'); assert.equal(media.name, 'media'); assert.equal(media.params, '(prefers-color-scheme:dark)'); assert.equal(media.nodes.length, 1); check(media.nodes[0], 'dark');
      continue;
    }
    for (const [name, value] of Object.entries(node.properties)) {
      assert(attributes.has(name) || /^data[A-Z][A-Za-z0-9]*(?:-(?:1|12)m)?$/u.test(name), `Uncontrolled attribute: ${name}`);
      if (['markerEnd', 'clipPath'].includes(name)) {
        const match = /^url\(#([A-Za-z0-9-]+)\)$/u.exec(String(value)); assert(match && nodes.some(target => target.properties.id === match[1] && target.tagName === (name === 'markerEnd' ? 'marker' : 'clipPath')), 'Only resolved local references of the correct SVG type are allowed');
      } else assert(!String(value).toLowerCase().includes('url('));
      if (['fill', 'stroke'].includes(name)) assert(theme ? value === 'none' || paints.has(String(value).toLowerCase()) : /^(?:none|var\(--color-(?:ink|surface(?:-2)?|paper|muted|signal|accent|amber|topic-blue|line-strong)\))$/u.test(String(value)), 'Paint must come from the site charter');
      if (name === 'style') { assert.equal(node.tagName, 'svg'); assert.equal(value, 'width:100%;height:auto'); }
      if (name === 'fontFamily') assert.equal(value, 'DejaVu Sans, Arial, sans-serif', 'Original local font stack remains available without remote fonts');
    }
  }
  const p = nodes[0].properties, viewBox = String(p.viewBox).split(/\s+/u).map(Number);
  assert.equal(p.xmlns, 'http://www.w3.org/2000/svg'); assert.equal(p.role, 'img'); assert.equal(p.style, 'width:100%;height:auto');
  assert(viewBox.length === 4 && viewBox.every(Number.isFinite) && viewBox[2] > 0 && viewBox[3] > 0);
  assert(Array.isArray(p.ariaLabelledBy) && p.ariaLabelledBy.length === 2);
  p.ariaLabelledBy.forEach((id, i) => assert(nodes.some(node => node.properties.id === id && node.tagName === (i ? 'desc' : 'title') && normalise(toText(node)))));
  return { nodes, p, viewBox, text: textOf(nodes) };
}
function metric(id, value, unit, period, type, input = byMetric) {
  const row = input.get(id); assert(row, id); near(row.value, value);
  assert.equal(row.unit, unit); assert.equal(row.period, period); assert.equal(row.measurement_type, type);
  assert.match(row.sources, /^S\d{2}(?:;S\d{2})*$/u); return row;
}
function tariff(svg) {
  const { nodes, p, text } = inspect(svg); assert.equal(p.dataModel, models[1]); assert.equal(p.dataKind, 'conditional-calculation'); assert.equal(p.dataUnit, 'USD');
  near(p.dataCustomsValue, 100); assert.equal(p.dataAdditionalRates, '25,12.5'); near(p.dataTotalCost, 100 * 1.375);
  near(p.dataConstantCostSupplierPrice, Number((100 / 1.375).toFixed(2))); near(p.dataSupplierPriceReductionPercent, Number(((1 - 1 / 1.375) * 100).toFixed(2)));
  const bars = nodes.filter(node => node.tagName === 'rect' && node.properties.dataComponent);
  assert.deepEqual(bars.map(node => node.properties.dataComponent), ['customs-value', 'additional-duty-25', 'additional-duty-12.5']);
  const scale = Number(bars[0].properties.width) / 100;
  bars.forEach((node, i) => { const value = [100, 25, 12.5][i]; near(node.properties.dataValue, value); near(node.properties.width, value * scale); assert.equal(node.properties.dataUnit, 'USD'); if (i) near(node.properties.x, Number(bars[i - 1].properties.x) + Number(bars[i - 1].properties.width)); });
  assert.match(text, /137[,.]50/u); assert.match(text, /72[,.]73/u); assert.match(text, /27[,.]27/u);
  assert.match(text, /exclusions|exemptions/iu); assert.match(text, /HYPOTHÈSE [AB]|CASE [AB]/u); assert.match(text, /Hors fret|Excludes freight/iu);
}
test('Conditional tariff example retains its common customs base and two burden assumptions', () => {
  metric('brazil_specific_tariff', 25, 'percent', 'effective 2026-07-22', 'rate'); metric('forced_labor_tariff', 12.5, 'percent', 'effective 2026-07-24', 'rate');
  for (const { svg } of allFull.filter(item => item.n === 2)) tariff(svg);
  const svg = full(2, 'fr'); assert.throws(() => tariff(svg.replace('data-total-cost="137.5"', 'data-total-cost="140.625"')));
  assert.throws(() => tariff(svg.replace('width="187.63636363636365"', 'width="200"')));
});
function trade(svg) {
  const { nodes, p, text } = inspect(svg); assert.equal(p.dataModel, models[2]); assert.equal(p.dataPeriod, '2025'); assert.equal(p.dataUnit, 'USD-billion'); assert.equal(p.dataScope, 'US-reported-bilateral-trade-with-Brazil'); assert.equal(p.dataCommonScale, 'true');
  const bars = nodes.filter(node => node.tagName === 'rect' && node.properties.dataCategory), values = [54.3, 39.9, 34.4, 7]; assert.equal(bars.length, 4);
  const zero = Number(bars[0].properties.x), scale = Number(bars[0].properties.width) / values[0];
  bars.forEach((node, i) => { const b = node.properties; assert.equal(b.dataCategory, i < 2 ? 'goods' : 'services'); assert.equal(b.dataFlow, i % 2 ? 'Brazil-to-US' : 'US-to-Brazil'); near(b.dataValue, values[i]); near(b.x, zero); near(b.width, values[i] * scale); });
  const ticks = nodes.filter(node => node.tagName === 'text' && ['0', '20', '40', '60'].includes(toText(node))); assert.equal(ticks.length, 4);
  ticks.forEach(node => near(node.properties.x, zero + Number(toText(node)) * scale, .015));
  near(p.dataGoodsSurplus, 54.3 - 39.9); near(p.dataServicesSurplus, 34.4 - 7); assert.match(text, /14[,.]4/u); assert.match(text, /27[,.]4/u); assert.match(text, /américaines|American statistics/iu);
}
test('USTR trade uses annual US reporting, four common-zero bars and separate category surpluses', () => {
  for (const [id, value] of [['trade_goods_us_exports', 54.3], ['trade_goods_us_imports', 39.9], ['trade_services_us_exports', 34.4], ['trade_services_us_imports', 7], ['us_goods_surplus', 14.4], ['us_services_surplus', 27.4]]) assert.equal(metric(id, value, 'USD billion', '2025', 'flow').sources, 'S16');
  for (const { svg } of allFull.filter(item => item.n === 3)) trade(svg);
  assert.throws(() => trade(full(3, 'fr').replace('width="607.81"', 'width="700"')));
  assert.throws(() => trade(full(3, 'fr').replace('data-flow="Brazil-to-US"', 'data-flow="US-to-Brazil"')));
});
function bcb(input, svg) {
  metric('reserves', 372.6, 'USD billion', '2026-08 end', 'stock', input);
  metric('current_account_deficit', 63, 'USD billion', '12m ending 2026-08', 'flow', input);
  assert.match(metric('inward_direct_investment', 86.6, 'USD billion', '12m ending 2026-08', 'flow', input).qualification, /includes reinvested earnings/u);
  assert.match(metric('portfolio_outflows', 5.2, 'USD billion', '2026-08', 'flow', input).qualification, /domestic market; net monthly outflow/u);
  const { p, text, nodes } = inspect(svg); assert.equal(p.dataModel, models[3]); assert.equal(p.dataScenario, 'qualitative'); assert.equal(p.dataObservedPeriod, '2026-08'); assert.equal(p.dataUnit, 'USD-billion'); assert.equal(p.dataReserveAsof, '2026-08-31'); assert.equal(p.dataStocksFlowsDistinct, 'true');
  for (const [key, value] of [['dataReserveStock', 372.6], ['dataCurrentAccountDeficit-12m', 63], ['dataInwardDirectInvestment-12m', 86.6], ['dataDomesticPortfolioOutflow-1m', 5.2]]) near(p[key], value);
  const links = nodes.filter(node => node.properties.markerEnd); assert.equal(links.length, 3); assert(links.every(node => node.properties.strokeDashArray), 'Qualitative transmission uses dashed links rather than measured causal arrows');
  assert.match(text, /réinvestis|reinvested/iu); assert.match(text, /sans causalité estimée|not estimated causality/iu);
}
test('BCB context preserves a reserve stock, two 12-month flows and a domestic monthly portfolio flow', () => {
  for (const { svg } of allFull.filter(item => item.n === 4)) bcb(byMetric, svg);
  const bad = new Map(byMetric); bad.set('portfolio_outflows', { ...bad.get('portfolio_outflows'), qualification: 'all cross-border portfolio flows' }); assert.throws(() => bcb(bad, full(4, 'fr')));
  assert.throws(() => bcb(byMetric, full(4, 'fr').replace('data-reserve-asof="2026-08-31"', 'data-reserve-asof="2026-09-30"')));
});
function financing(input, svg) {
  assert.match(metric('spv_public_investment', 750, 'USD million', 'announced 2026-08-24', 'commitment', input).qualification, /commitment/u);
  assert.match(metric('spv_revolver', 500, 'USD million', 'announced 2026-08-24', 'conditional_ceiling', input).qualification, /up to;.*commitment letter/u);
  assert.match(metric('spv_forward_purchases', 300, 'USD million', 'announced 2026-08-24', 'minimum_purchase_commitment', input).qualification, /at least; over five years/u);
  const dfc = metric('dfc_financing', 565, 'USD million', 'announced 2026-04-20', 'financing_package', input); assert.equal(dfc.sources, 'S21;S29'); assert.equal(dfc.qualification, 'signed loan announced; disbursement not established');
  assert.match(metric('offtake_share', 100, 'percent', 'contract described 2026-08-24', 'contract', input).qualification, /Phase 1 four magnetic rare earths; not Brazilian national output/u); metric('offtake_duration', 15, 'years', 'contract described 2026-08-24', 'contract', input);
  const { p, text } = inspect(svg); assert.equal(p.dataModel, models[4]); assert.equal(p.dataUnit, 'USD-million'); assert.equal(p.dataInstrumentsNotAdditive, 'true');
  for (const [key, value] of [['dataPublicInvestmentCommitment', 750], ['dataConditionalBankFacilityCap', 500], ['dataForwardPublicPurchasesMin', 300], ['dataForwardPurchaseYears', 5], ['dataOfftakeYears', 15], ['dataDfcProjectFinancing', 565]]) near(p[key], value);
  assert.equal(p.dataDfcInstrument, 'signed-loan-announced'); assert.equal(p.dataDfcAnnouncementDate, '2026-02-04'); assert.equal(p.dataDfcDisbursement, 'not-quantified');
  for (const pattern of [/750/u, /≤\s*\$?500/u, /≥\s*\$?300/u, /565/u, /Nd.*Pr.*Dy.*Tb/u, /phase 1/iu, /15 (?:ANS|YEARS)/u, /SPV/u, /Séparation|Separation/iu, /livraisons.*vérifier|deliveries.*verif|deliveries.*check/iu]) assert.match(text, pattern);
}
test('Serra Verde instruments retain bounds, project scope and signed-loan versus disbursement status', () => {
  for (const { svg } of allFull.filter(item => item.n === 5)) financing(byMetric, svg);
  const event = (date, type, source) => assert(chronology.some(row => row.date === date && row.event_type === type && row.sources.split(';').includes(source)));
  event('2026-08-24', 'annonce', 'S23'); event('2026-09-03', 'realisation_annoncee', 'S24'); event('2026-09-04', 'publication', 'S24'); event('2026-09-28', 'document', 'S20'); event('2026-10-04', 'programme', 'S01'); event('2026-10-25', 'eventuel', 'S01');
  const bad = new Map(byMetric); bad.set('spv_revolver', { ...bad.get('spv_revolver'), measurement_type: 'cash_disbursed' }); assert.throws(() => financing(bad, full(5, 'fr')));
  assert.throws(() => financing(byMetric, full(5, 'fr').replace('data-instruments-not-additive="true"', 'data-instruments-not-additive="false"')));
});

function localAsset(url) {
  assert.match(url, /^\/infographies\/brazil-pressure\/(?:panels\/)?figure0[1-6]\.(?:fr|en)(?:\.mobile|-p[1-3]\.(?:dark|light))?\.svg$/u);
  const path = realpathSync(resolve(root, 'public', url.slice(1))); assert(path.startsWith(assetRoot + sep)); return readFileSync(path, 'utf8');
}
function parts(article) {
  const fragments = [...article.matchAll(/<figure\b[\s\S]*?<\/figure>/gu)].map(match => match[0]); assert.equal(fragments.length, 6); assert.equal([...article.matchAll(/<svg\b/gu)].length, 6);
  return fragments.map((fragment, i) => {
    const nodes = elements(fromHtml(fragment, { fragment: true })), byClass = name => nodes.filter(node => node.properties.className?.includes(name)), inline = [...fragment.matchAll(/<svg\b[\s\S]*?<\/svg>/gu)].map(match => match[0]);
    assert.deepEqual(nodes[0].properties.className, ['infographic', 'l0g-brazil-pressure-figure']); assert.equal(Number(nodes[0].properties.dataFigure), i + 1); assert.equal(inline.length, 1);
    const svgNodes = new Set(elements(byClass('brp-wide')[0]));
    for (const node of nodes.filter(node => !svgNodes.has(node))) {
      assert(['figure', 'div', 'p', 'img', 'nav', 'a', 'figcaption'].includes(node.tagName));
      assert(Object.keys(node.properties).every(key => ['className', 'dataFigure', 'id', 'role', 'tabIndex', 'ariaLabel', 'ariaDescribedBy', 'dataPanel', 'src', 'width', 'height', 'loading', 'decoding', 'alt', 'href', 'target', 'rel'].includes(key)));
      if (node.properties.target) assert(node.properties.target === '_blank' && node.properties.rel?.includes('noopener') && node.properties.rel.includes('noreferrer'));
    }
    const panels = byClass('brp-panel'); assert.equal(panels.length, i < 3 ? 2 : 3);
    const gallery = byClass('brp-gallery'); assert.equal(gallery.length, 1); assert.equal(gallery[0].properties.role, 'region'); assert.equal(gallery[0].properties.tabIndex, 0); assert(normalise(gallery[0].properties.ariaLabel));
    const hint = byClass('brp-scroll-hint'); assert.equal(hint.length, 1); assert(normalise(toText(hint[0]))); assert.deepEqual(gallery[0].properties.ariaDescribedBy, [hint[0].properties.id]);
    const pagination = byClass('brp-pagination'); assert.equal(pagination.length, 1); assert.deepEqual(elements(pagination[0]).filter(node => node.tagName === 'a').map(node => node.properties.href), panels.map(node => '#' + node.properties.id));
    const links = byClass('brp-full-link').flatMap(elements).filter(node => node.tagName === 'a'); assert.equal(links.length, 2);
    const caption = nodes.filter(node => node.tagName === 'figcaption'); assert.equal(caption.length, 1); assert(normalise(toText(caption[0])));
    return { inline: inline[0], panels, caption: normalise(toText(caption[0])), wide: localAsset(links.find(node => !node.properties.href.endsWith('.mobile.svg')).properties.href), mobile: localAsset(links.find(node => node.properties.href.endsWith('.mobile.svg')).properties.href) };
  });
}
const articlePaths = ['src/content/posts/bresil-prix-pression-americaine.md', 'src/content/posts-en/brazil-price-american-pressure.md'];
const articles = () => articlePaths.map(read);
function drawing(node) {
  if (['defs', 'style', 'title', 'desc'].includes(node.tagName)) return [];
  const own = ['rect', 'circle', 'path', 'text'].includes(node.tagName) ? [{ tag: node.tagName, properties: Object.fromEntries(Object.entries(node.properties).filter(([key]) => !['id', 'markerEnd', 'fill', 'stroke'].includes(key))), text: node.tagName === 'text' ? toText(node) : '' }] : [];
  return [...own, ...(node.children ?? []).filter(child => child.type === 'element').flatMap(drawing)];
}
test('All six original explanatory compositions retain safe markup, charter colours and FR/EN parity', () => {
  const ids = [], products = [...readdirSync(assetRoot).filter(name => name.endsWith('.svg')).map(name => ({ url: `/infographies/brazil-pressure/${name}` })), ...readdirSync(resolve(assetRoot, 'panels')).filter(name => name.endsWith('.svg')).map(name => ({ url: `/infographies/brazil-pressure/panels/${name}`, theme: name.includes('.dark.') ? 'dark' : 'light' }))];
  assert.equal(products.length, 84);
  for (const product of products) { const { nodes } = inspect(localAsset(product.url), product.theme); ids.push(...nodes.filter(node => node.properties.id).map(node => node.properties.id)); }
  assert.equal(ids.length, new Set(ids).size, 'Standalone assets have unique reference IDs');
  const paired = articles().map(parts);
  for (const [i, french] of paired[0].entries()) {
    const english = paired[1][i];
    for (const part of [french, english]) {
      const svg = inspect(part.inline); assert.equal(svg.p.dataModel, models[i]); assert.equal(Number(svg.p.dataFigure), i + 1); assert(svg.nodes.filter(node => node.tagName === 'text').length >= 15);
      const signature = text => inspect(text).nodes.filter(node => ['rect', 'circle', 'path', 'text'].includes(node.tagName) && !String(node.properties.id ?? '').includes('-title')).map(node => ({ tag: node.tagName, properties: Object.fromEntries(Object.entries(node.properties).filter(([key]) => !['id', 'markerEnd'].includes(key))), text: node.tagName === 'text' ? toText(node) : '' }));
      assert.deepEqual(signature(part.inline), signature(part.wide), 'The displayed wide composition preserves the complete standalone drawing');
    }
    const values = part => inspect(part.inline).nodes.filter(node => node.properties.dataValue).map(node => Number(node.properties.dataValue)); assert.deepEqual(values(french), values(english));
  }
  for (const svg of allFull.filter(item => item.n === 6)) { const { p, text } = inspect(svg.svg); assert.equal(p.dataScenario, 'alternative-without-probabilities'); assert.equal(p.dataFirstRound, '2026-10-04'); assert.equal(p.dataPossibleRunoff, '2026-10-25'); assert.match(text, /alternatives|alternative/iu); assert.match(text, /FTO/u); assert.match(text, /autorisation de force|authorisation.*force/iu); }
  for (const article of articles()) { assert(article.includes('/data/brazil-pressure-verified-data-2026-10-03.csv')); assert(article.includes('/data/brazil-pressure-chronology-2026-10-03.csv')); }
  assert.throws(() => inspect(full(4, 'fr').replace('<svg ', '<svg onload="alert(1)" ')));
  assert.throws(() => inspect(full(4, 'fr').replace('url(#brazil-pressure-fr-4-full-wide-amber)', 'url(https://example.invalid/arrow)')));
  assert.throws(() => inspect(full(3, 'fr').replace('var(--color-signal)', '#123456')));
  assert.throws(() => parts(articles()[0].replace(/<figure\b[\s\S]*?<\/figure>/u, '')));
});

const builder = new XMLBuilder({ ignoreAttributes: false }), metrics = new Map();
async function geometry(svg) {
  const { nodes, viewBox: [left, top, width, height] } = inspect(svg), boxes = [];
  for (const node of nodes.filter(node => node.tagName === 'text')) {
    const p = node.properties, label = toText(node), size = Number(p.fontSize); assert(size >= 16 && Number.isFinite(Number(p.x)) && Number.isFinite(Number(p.y)));
    const key = JSON.stringify([label, size, p.fontWeight, p.fontFamily, p.textAnchor]);
    if (!metrics.has(key)) {
      const markup = builder.build({ svg: { '@_xmlns': 'http://www.w3.org/2000/svg', '@_width': 4096, '@_height': 256, text: { '@_x': 2048, '@_y': 128, '@_fill': 'white', '@_font-family': p.fontFamily, '@_font-size': size, '@_font-weight': p.fontWeight ?? 400, '@_text-anchor': p.textAnchor ?? 'start', '#text': label } } });
      const { info } = await sharp(Buffer.from(markup)).trim().raw().toBuffer({ resolveWithObject: true }); metrics.set(key, { x: -info.trimOffsetLeft - 2048, y: -info.trimOffsetTop - 128, width: info.width, height: info.height });
    }
    const m = metrics.get(key), box = { left: Number(p.x) + m.x, top: Number(p.y) + m.y, right: Number(p.x) + m.x + m.width, bottom: Number(p.y) + m.y + m.height, label, anchorX: Number(p.x), anchorY: Number(p.y) };
    assert(box.left >= left && box.right <= left + width && box.top >= top && box.bottom <= top + height, `Visible label leaves its full composition: ${label}`); boxes.push(box);
  }
  for (const node of nodes.filter(node => node.tagName === 'rect')) { const p = node.properties; assert(Number(p.x ?? 0) >= left && Number(p.y ?? 0) >= top && Number(p.width) >= 0 && Number(p.height) >= 0 && Number(p.x ?? 0) + Number(p.width) <= left + width && Number(p.y ?? 0) + Number(p.height) <= top + height); }
  const cards = nodes.filter(node => node.tagName === 'rect' && ['var(--color-surface)', 'var(--color-surface-2)'].includes(node.properties.fill)).map(node => ({ left: Number(node.properties.x ?? 0), top: Number(node.properties.y ?? 0), right: Number(node.properties.x ?? 0) + Number(node.properties.width), bottom: Number(node.properties.y ?? 0) + Number(node.properties.height) }));
  for (const box of boxes) {
    const card = cards.filter(c => box.anchorX >= c.left && box.anchorX <= c.right && box.anchorY >= c.top && box.anchorY <= c.bottom).sort((a, b) => (a.right - a.left) * (a.bottom - a.top) - (b.right - b.left) * (b.bottom - b.top))[0];
    if (card) assert(box.left >= card.left + 8 && box.right <= card.right - 8 && box.top >= card.top + 4 && box.bottom <= card.bottom - 8, `Visible label crowds its intended card: ${box.label}`);
  }
  for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) { const a = boxes[i], b = boxes[j]; assert(!(a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top), `Visible labels overlap: ${a.label} / ${b.label}`); }
  return boxes;
}
function cssContract(css) {
  const parsed = postcss.parse(css), rules = []; parsed.walkAtRules(rule => { assert.equal(rule.name, 'media'); assert(['(max-width: 640px)', '(prefers-reduced-motion: reduce)'].includes(rule.params)); });
  parsed.walkRules(rule => { assert(rule.selectors.every(selector => /^(?::root\[data-theme="light"\]\s+)?(?:\.prose\s+)?(?:figure)?\.l0g-brazil-pressure-figure(?:[\s.:[>]|$)/u.test(selector)), 'Styles remain scoped to this publication'); rules.push(rule); });
  parsed.walkDecls(decl => { assert(!decl.important && !/(?:url\s*\(|expression\s*\(|javascript:)/iu.test(decl.value)); if (decl.prop === 'height') assert.equal(decl.value, 'auto'); });
  const values = suffix => Object.fromEntries(rules.filter(rule => rule.selector.endsWith(suffix)).flatMap(rule => rule.nodes.filter(node => node.type === 'decl').map(node => [node.prop, node.value])));
  assert.equal(values(' .brp-gallery')['overflow-x'], 'auto'); assert.equal(values(' .brp-gallery')['scroll-snap-type'], 'x mandatory'); assert.equal(values(' .brp-panel')['scroll-snap-align'], 'start');
  assert.equal(values(' .brp-mobile')['max-width'], '21.875rem'); assert(rules.some(rule => rule.selectors.includes('.l0g-brazil-pressure-figure .brp-panel > img') && rule.nodes.some(node => node.prop === 'width' && node.value === '100%')));
  const mobile = parsed.nodes.find(node => node.type === 'atrule' && node.params === '(max-width: 640px)'); assert(mobile); assert(mobile.nodes.some(rule => rule.selector?.endsWith(' .brp-wide') && rule.nodes.some(node => node.prop === 'display' && node.value === 'none')));
  assert(mobile.nodes.some(rule => rule.selector?.endsWith(' .brp-mobile') && rule.nodes.some(node => node.prop === 'display' && node.value === 'block'))); assert(rules.some(rule => rule.nodes.some(node => node.prop === 'padding-bottom' && Number.parseFloat(node.value) > 0)));
  const exact = selector => Object.fromEntries(rules.filter(rule => rule.selector === selector).flatMap(rule => rule.nodes.filter(node => node.type === 'decl').map(node => [node.prop, node.value])));
  assert.equal(exact('.l0g-brazil-pressure-figure .brp-panel > .brp-panel-light').display, 'none');
  assert.equal(exact(':root[data-theme="light"] .l0g-brazil-pressure-figure .brp-panel > .brp-panel-dark').display, 'none');
  assert.equal(exact(':root[data-theme="light"] .l0g-brazil-pressure-figure .brp-panel > .brp-panel-light').display, 'block');
  assert(rules.some(rule => rule.selector.endsWith(' .brp-mobile') && rule.parent.type === 'root' && rule.nodes.some(node => node.prop === 'display' && node.value === 'none')));
  const reduced = parsed.nodes.find(node => node.type === 'atrule' && node.params === '(prefers-reduced-motion: reduce)'); assert(reduced?.nodes.some(rule => rule.nodes.some(node => node.prop === 'scroll-behavior' && node.value === 'auto')));
}
test('Real glyphs remain in bounds and mobile crops preserve complete labels in compact accessible panels', async () => {
  cssContract(read('src/styles/brazil-pressure-infographics.css'));
  for (const { svg } of allFull) await geometry(svg);
  for (const [languageIndex, article] of articles().entries()) for (const [i, part] of parts(article).entries()) {
    const labels = await geometry(part.mobile), original = inspect(part.mobile), fullHeight = original.viewBox[3], cuts = [];
    assert.match(part.caption, i === 3 ? /marché domestique brésilien|Brazil.*domestic market/iu : /\S/u);
    for (const [j, panel] of part.panels.entries()) {
      assert.equal(panel.properties.role, 'group'); assert.equal(Number(panel.properties.dataPanel), j + 1); const images = elements(panel).filter(node => node.tagName === 'img'); assert.equal(images.length, 2);
      assert.deepEqual(images.map(node => node.properties.className), [['brp-panel-dark'], ['brp-panel-light']]);
      for (const [k, image] of images.entries()) {
        const p = image.properties; assert(normalise(p.alt).length >= 30); assert.equal(Number(p.width), 600); assert(Number(p.height) > 0 && Number(p.height) * 350 / 600 <= 500, 'Displayed mobile graphics remain below 500px');
        const { p: crop, nodes, viewBox } = inspect(localAsset(p.src), k ? 'light' : 'dark'); const start = Number(crop.dataCropStart), end = Number(crop.dataCropEnd); assert.deepEqual(viewBox, [0, start, 600, end - start]); near(p.height, end - start); assert.equal(Number(crop.dataPanel), j + 1); assert.equal(Number(crop.dataFigure), i + 1);
        const body = nodes.find(node => node.properties.dataSourceComposition); assert.equal(body?.properties.dataSourceComposition, 'complete'); assert(body.properties.clipPath); if (!k) cuts.push([start, end]);
        assert.deepEqual(drawing(body), drawing(original.nodes[0]), 'Each clipped panel retains every primitive, label and observation of the complete mobile drawing');
      }
    }
    assert.equal(cuts[0][0], 0); near(cuts.at(-1)[1], fullHeight); cuts.slice(1).forEach((cut, j) => near(cut[0], cuts[j][1]));
    for (const box of labels) assert(cuts.some(([start, end]) => box.top >= start && box.bottom <= end), `A mobile cut must not slice a visible label: ${box.label}`);
    assert(part.panels.every(panel => String(panel.properties.id).startsWith(`brazil-pressure-${languageIndex ? 'en' : 'fr'}-${i + 1}-`)));
  }
  await assert.rejects(geometry(full(3, 'fr').replace('x="44.00" y="34.00"', 'x="-100.00" y="34.00"')));
  await assert.rejects(geometry(full(5, 'fr').replace('x="62.00" y="191.00"', 'x="50.00" y="191.00"')));
  assert.throws(() => cssContract(read('src/styles/brazil-pressure-infographics.css').replace('max-width: 21.875rem', 'max-width: 80rem')));
});
