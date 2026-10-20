import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import test from 'node:test';
import postcss from 'postcss';
import { compile } from '@mdx-js/mdx';
import { parseFragment } from 'parse5';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';
import { assertBudgetMenagesConnections, assertBudgetMenagesGeometry, assertBudgetMenagesProportions, assertBudgetMenagesQuantitative, assertBudgetMenagesSourceFaithful, inspectBudgetMenagesSvg, budgetMenagesAttrs, budgetMenagesNodes, budgetMenagesSourceFigures, budgetMenagesTag } from './budget-menages-svg-assertions.mjs';
const read = p => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const paths = ['src/content/posts/budget-2027-repartition-effort-risque.mdx', 'src/content/posts-en/france-2027-budget-distribution-economic-risk.mdx'];
const articles = paths.map(read), figures = articles.map(budgetMenagesSourceFigures);
const cssBase = '/styles/budget-2027-menages-v1.css';
const cssHref = `${cssBase}?v=${createHash('sha256').update(readFileSync(new URL(`../public${cssBase}`, import.meta.url))).digest('hex').slice(0, 12)}`;
const stylesheet = article => assert.deepEqual([...article.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*>/gu)].map(m => m[0].match(/href="([^"]+)"/u)?.[1]).filter(p => p?.startsWith(cssBase)), [cssHref]);
const mutateRect = (svg, id, attr, delta) => { const raw = svg.match(new RegExp(`<rect\\b[^>]*id="[^"]*${id}"[^>]*>`))?.[0]; assert.ok(raw); const value = Number(raw.match(new RegExp(`\\b${attr}="([^"]+)"`))[1]); return svg.replace(raw, raw.replace(new RegExp(`\\b${attr}="[^"]+"`), `${attr}="${value + delta}"`)); };
const textContent = node => node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(textContent).join('');

const assertReferences = article => {
  const entries = [...article.matchAll(/<li id="source-(S[0-9]{2})">([\s\S]*?)<\/li>/gu)];
  const ids = entries.map(m => m[1]);
  assert.deepEqual(ids, Array.from({ length: 18 }, (_, i) => `S${String(i + 1).padStart(2, '0')}`));
  for (const [, id, body] of entries) {
    assert.ok(textContent(parseFragment(body)).trim().length > 60, `${id} must retain its citation metadata`);
    assert.match(body, /<a\b[^>]*href="https:\/\/[^"<>]+"/u, `${id} retains a canonical external source`);
  }
  for (const ref of article.matchAll(/href="#source-(S[0-9]+)"/gu)) assert.ok(ids.includes(ref[1]), `Resolved ${ref[1]}`);
};

test('French H1 punctuation stays attached while the figure stylesheet preserves whole words', () => {
  const title = articles[0].match(/^title: "(.*)"$/mu)?.[1]; assert.ok(title);
  const attached = heading => { for (const colon of heading.matchAll(/:/gu)) assert.match(heading[colon.index - 1] ?? '', /[\u00a0\u202f]/u); };
  attached(title); assert.throws(() => attached('BudgetMenages : fiscalité'));
});

test('20 native, accessible BudgetMenages scenes retain values, scales, relationships and compact legible compositions', () => {
  assert.deepEqual(figures.map(a => a.length), [10, 10]);
  for (const [l, article] of articles.entries()) {
    stylesheet(article); assert.doesNotMatch(article, /<style>|budget-menages-dossier|className="bibliography"/u);
    assert.equal((article.match(/<figure className="l0g-budget-figure"/gu) ?? []).length, 5);
    for (const [i, svg] of figures[l].entries()) { assertBudgetMenagesSourceFaithful(svg, l ? 'en' : 'fr', i); assertBudgetMenagesGeometry(svg); assertBudgetMenagesQuantitative(svg, Math.floor(i / 2) + 1); assertBudgetMenagesProportions(svg); }
  }
});

test('the reported timing, distribution and annual rate scenarios preserve their common scales', () => {
  assert.equal(723 + 341 + 81 + 550, 1695); assert.equal(965 + 455 + 323 + 550, 2293); assert.equal(2293 - 1695, 598);
  assert.equal(965 * 9 / 12, 723.75); assert.equal(455 * 9 / 12, 341.25); assert.equal(323 * 3 / 12, 80.75);
  // Published loss totals are independently rounded; retain the source values.
  for (const p of [87, 96, 70, 95, 4]) assert.equal(p + (100 - p), 100);
  for (const [suffix, index, attr] of [['-change_eur_per_household_year-20', 1, 'height'], ['-benefit-0-0', 3, 'width'], ['-share-4-lower', 5, 'width'], ['-rate-2028', 9, 'height']]) assert.throws(() => assertBudgetMenagesQuantitative(mutateRect(figures[0][index], suffix, attr, 2), Math.floor(index / 2) + 1));
});

test('all twelve macro relations and both debt inputs remain visible and cannot be covered by later panels', () => {
  const macro = figures[0][7], first = macro.match(/<path\b[^>]*marker-end="[^"]+"[^>]*\/>/u)?.[0]; assert.ok(first);
  assert.throws(() => assertBudgetMenagesConnections(macro.replace(first, ''), 4));
  assert.throws(() => assertBudgetMenagesConnections(macro.replace(first, first.replace('stroke="var(--color-signal)"', 'stroke="none"')), 4));
  assert.throws(() => assertBudgetMenagesConnections(macro.replace('</svg>', '<rect x="0" y="0" width="600" height="900" fill="var(--color-ink)" /></svg>'), 4), /cover a connection/u);
  const rate = figures[0][9], join = rate.match(/<path\b[^>]*id="[^"]*-refinancing-rate"[^>]*\/>/u)?.[0]; assert.ok(join);
  assert.throws(() => assertBudgetMenagesConnections(rate.replace(join, ''), 5));
});

test('card bounds, quantitative-bar collisions, compact readable proportions and bounded path grammar fail closed', () => {
  const svg = figures[0][6], mobile = figures[0][7], share = figures[0][5];
  assert.throws(() => assertBudgetMenagesGeometry(mutateRect(svg, '-investment', 'height', 6)), /source footer/u);
  assert.throws(() => assertBudgetMenagesGeometry(mutateRect(mobile, '-income', 'height', -20)), /panel/u);
  const collided = share.replace('y="195"', 'y="235"'); assert.notEqual(collided, share);
  assert.throws(() => assertBudgetMenagesGeometry(collided), /quantitative bar/u);
  assert.throws(() => assertBudgetMenagesProportions(mobile.replace('viewBox="0 0 600 900"', 'viewBox="0 0 600 1600"')), /compact/u);
  assert.throws(() => assertBudgetMenagesProportions(mobile.replace('font-size="26"', 'font-size="16"')), /legible/u);
  const withPath = d => svg.replace('</svg>', `<path d="${d}" fill="none" stroke="var(--color-signal)" /></svg>`);
  assert.doesNotThrow(() => assertBudgetMenagesGeometry(withPath('M 10 10 L 20 20 H 30 V 30 Z')));
  assert.doesNotThrow(() => assertBudgetMenagesGeometry(withPath('M+10+10 L20.5.6 H30 V30 Z')));
  for (const d of ['M01000100', 'M00010002', 'M 10 10 L 20', 'M 1e3 10 L 20 20', `M ${'9'.repeat(10000)} 10`, `M 10 10 ${'L 20 20 '.repeat(1024)}`, 'M NaN 10', 'M 10 10 C 20 20 30 30 40 40']) assert.throws(() => assertBudgetMenagesGeometry(withPath(d)));
});

test('scripts, external assets, source diversion and nonnative presentation attributes fail closed', () => {
  const svg = figures[0][0];
  for (const element of ['<script/>', '<foreignObject/>', '<image href="https://example.com/x"/>', '<animate/>']) assert.throws(() => inspectBudgetMenagesSvg(svg.replace('</svg>', `${element}</svg>`)));
  for (const mutate of [s => s.replace('<svg ', '<svg onload="void(0)" '), s => s.replace('font-size=', 'fontSize='), s => s.replace('href="#source-S01"', 'href="https://example.com/x"'), s => s.replace('fill="var(--color-ink)"', 'fill="url(https://example.com/x)"')]) assert.throws(() => inspectBudgetMenagesSvg(mutate(svg)));
});

test('the CSS byte fingerprint, one container breakpoint, scoped theme styles and exact local DejaVu fonts remain mandatory', () => {
  for (const article of articles) { stylesheet(article); assert.throws(() => stylesheet(article.replace(cssHref, cssBase))); assert.throws(() => stylesheet(article.replace(cssHref, `${cssBase}?v=000000000000`))); }
  const raw = read('public/styles/budget-2027-menages-v1.css'), css = postcss.parse(raw), decls = n => Object.fromEntries(n.nodes.filter(n => n.type === 'decl').map(n => [n.prop, n.value]));
  const rule = selector => { const n = css.nodes.find(n => n.type === 'rule' && n.selector === selector); assert.ok(n); return decls(n); };
  const figure = rule('.prose figure.l0g-budget-figure'); assert.deepEqual([figure.width, figure['max-width'], figure['container-type'], figure['padding-bottom']], ['100%', '48rem', 'inline-size', '1rem']);
  const sizing = rule('.l0g-budget-figure svg'); assert.deepEqual([sizing.width, sizing.height, sizing.overflow], ['100%', 'auto', 'visible']);
  assert.equal(rule('.l0g-budget-figure .l0g-budget-mobile').width, '100%'); assert.equal(rule('.l0g-budget-figure .l0g-budget-mobile')['max-width'], undefined);
  const containers = css.nodes.filter(n => n.type === 'atrule' && n.name === 'container'); assert.equal(containers.length, 1); assert.equal(containers[0].params, '(max-width: 480px)');
  assert.deepEqual(containers[0].nodes.map(n => [n.selector, decls(n).display]), [['.l0g-budget-figure .l0g-budget-mobile', 'block'], ['.l0g-budget-figure .l0g-budget-desktop', 'none']]);
  const faces = css.nodes.filter(n => n.type === 'atrule' && n.name === 'font-face').map(decls); assert.deepEqual(faces.map(f => [f['font-family'], f.src, f['font-weight']]), [400, 700].map(w => ["'l0g Budget Menages'", `url('/fonts/stablecoins/dejavu-sans-${w}.ttf') format('truetype')`, String(w)]));
  const h1 = rule('article:has(.l0g-budget-figure) > .post-head .post-title'); assert.deepEqual([h1.hyphens, h1['overflow-wrap'], h1['word-break']], ['none', 'normal', 'normal']);
  css.walkRules(n => assert.ok(n.selector.split(',').every(s => s.includes('.l0g-budget-figure')))); assert.doesNotMatch(raw, /#(?:[a-f0-9]{3}){1,2}\b|@media\s*\(max-width:|overflow\s*:\s*(?:hidden|clip)|(?:clip-path|transform)\s*:/iu);
});

test('shared DejaVu subsets retain the licensed bytes and every used glyph metric', () => {
  for (const [weight, hash] of [[400, '98f2d74db16bb5f41f74adf6d899aeec92861682cccc58bfdbe4d9d7d0a5ae11'], [700, '21a0350a4ac2a9f22b6a7a8dcaf6abb08c8b546d06499301f1fcf10996fd0df5']]) { const bytes = readFileSync(new URL(`../public/fonts/stablecoins/dejavu-sans-${weight}.ttf`, import.meta.url)); assert.equal(createHash('sha256').update(bytes).digest('hex'), hash); assert.ok(bytes.length < 50000); }
  const licence = read('public/fonts/stablecoins/LICENSE.txt'); assertFontLicenseReferences(licence, 'dejavu');
  const source = read('public/fonts/world-id/LICENSE.txt'), body = s => s.slice(s.indexOf('Fonts are (c) Bitstream')).split('\n').map(l => l.trimEnd()).join('\n'); assert.equal(body(licence), body(source));
  assert.match(licence, /Renamed l0g Stablecoins Sans/u);
});

test('both complete MDX articles compile natively and retain all 18 shared source entries and resolved citations', async () => {
  for (const article of articles) {
    assertReferences(article);
    assert.equal((article.match(/<ol class(?:Name)?="sources-list" role="list">/gu) ?? []).length, 1); assert.equal((article.match(/<section class(?:Name)?="method"/gu) ?? []).length, 1);
    assert.throws(() => assertReferences(article.replace(/<li id="source-S01">[\s\S]*?<\/li>/u, '<li id="source-S01"></li>')));
    assert.throws(() => assertReferences(article.replace(/<ol className="sources-list"[^>]*>[\s\S]*?<\/ol>/u, '<ol className="sources-list" role="list"></ol>')));
    const result = String(await compile(article.replace(/^---\n[\s\S]*?\n---\n/u, ''), { jsx: true })), svgs = budgetMenagesSourceFigures(result); assert.equal(svgs.length, 10); for (const svg of svgs) assert.doesNotMatch(svg, /<(?:_components\.)?p(?:\s|>)/u);
  }
});
