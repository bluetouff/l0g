import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import opentype from '@shuding/opentype.js';
import { parse, parseFragment, serializeOuter } from 'parse5';
import { pathPoints, tag, attrs, nodes, content } from './insurance-returns-svg-assertions.mjs';
import { GOOGLE_CLOUD_KINDS, GOOGLE_CLOUD_SOURCES, googleCloudBankingSvg } from '../src/lib/googleCloudBankingFigures.mjs';
export { tag, attrs, nodes, content, pathPoints };
const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '', preserveOrder: true, trimValues: false, parseTagValue: false });
const fonts = new Map([400, 700].map(weight => {
  const bytes = readFileSync(new URL(`../public/fonts/stablecoins/dejavu-sans-${weight}.ttf`, import.meta.url));
  return [weight, opentype.parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength))];
}));
const allowed = {
  svg: 'xmlns style viewBox class role aria-labelledby', title: 'id', desc: 'id',
  rect: 'id x y width height rx fill stroke stroke-width',
  text: 'data-panel data-max-width x y font-family font-size font-weight fill text-anchor',
  line: 'x1 y1 x2 y2 stroke stroke-width stroke-dasharray',
  path: 'd fill stroke stroke-width stroke-dasharray', circle: 'cx cy r fill',
};
const numberKeys = new Set('x y width height rx cx cy r x1 y1 x2 y2 font-size font-weight stroke-width data-max-width'.split(' '));
const num = value => {
  assert.match(value, /^[+-]?(?:\d{1,4}(?:\.\d{0,18})?|\.\d{1,18})$/u);
  assert.ok(Number.isFinite(Number(value)) && Math.abs(Number(value)) <= 10000);
  return Number(value);
};
export const googleCloudBankingScenes = () => ['fr', 'en'].flatMap(lang => GOOGLE_CLOUD_KINDS.flatMap((kind, index) => [false, true].map(mobile => ({ lang, kind, mobile, figure: index + 1, svg: googleCloudBankingSvg(lang, kind, mobile) }))));
export function inspectGoogleCloudBankingSvg(svg) {
  assert.equal(typeof svg, 'string');
  assert.ok(svg.length > 100 && svg.length < 50000);
  assert.doesNotMatch(svg, /<!DOCTYPE|<!ENTITY|<!\[CDATA\[|<\?/iu);
  assert.equal(XMLValidator.validate(svg), true);
  const roots = parser.parse(svg);
  assert.equal(roots.length, 1);
  const root = roots[0], a = attrs(root), all = nodes(root);
  assert.equal(tag(root), 'svg');
  assert.equal(a.xmlns, 'http://www.w3.org/2000/svg');
  assert.equal(a.style, 'width:100%;height:auto');
  assert.equal(a.class, 'l0g-google-cloud-svg');
  assert.equal(a.role, 'img');
  assert.match(a.viewBox, /^0 0 (?:1300 850|740 1240)$/u);
  const ids = all.map(n => attrs(n).id).filter(Boolean);
  assert.equal(ids.length, new Set(ids).size);
  assert.ok(all.length < 500);
  assert.equal(a['aria-labelledby'].split(' ').length, 2);
  for (const id of a['aria-labelledby'].split(' ')) assert.equal(all.filter(n => attrs(n).id === id && ['title', 'desc'].includes(tag(n)) && content(n).trim()).length, 1);
  for (const node of all) {
    const name = tag(node), values = attrs(node);
    assert.ok(Object.hasOwn(allowed, name), `Forbidden ${name}`);
    for (const [key, value] of Object.entries(values)) {
      assert.ok(allowed[name].split(' ').includes(key), `Forbidden ${key}`);
      assert.equal(typeof value, 'string');
      assert.ok(value.length < 10000);
      if (numberKeys.has(key)) num(value);
      if (key === 'd') pathPoints(value);
      if (key === 'id' || key === 'data-panel') assert.match(value, /^google-cloud-(?:fr|en)-f[1-5]-(?:d|m)-(?:title|desc|panel-\d+)$/u);
      if (key === 'font-family') assert.equal(value, 'l0g Google Cloud Banking');
      if (key === 'font-size') assert.ok(Number(value) >= (a.viewBox.includes('740') ? 30 : 22) && Number(value) <= 38);
      if (key === 'font-weight') assert.ok(['400', '700'].includes(value));
      if (key === 'text-anchor') assert.ok(['start', 'middle', 'end'].includes(value));
      if (key === 'fill' || key === 'stroke') assert.match(value, /^(?:none|var\(--color-(?:ink|surface|surface-2|line-strong|muted|paper|signal|accent|amber)\))$/u);
      if (key === 'stroke-dasharray') assert.equal(value, '8 7');
    }
  }
  return { root, all };
}
function labelBox(node) {
  const a = attrs(node), size = Number(a['font-size']), font = fonts.get(Number(a['font-weight'])), value = content(node);
  const advance = font.getAdvanceWidth(value, size, { kerning: true });
  const x = Number(a.x) - (a['text-anchor'] === 'middle' ? advance / 2 : a['text-anchor'] === 'end' ? advance : 0);
  const boxes = [];
  for (const c of value) assert.notEqual(font.charToGlyphIndex(c), 0, `Missing glyph ${c}`);
  font.forEachGlyph(value, x, Number(a.y), size, { kerning: true }, (glyph, gx, gy) => {
    if (!Number.isFinite(glyph.xMin) || (glyph.xMin === glyph.xMax && glyph.yMin === glyph.yMax)) return;
    const scale = size / font.unitsPerEm;
    boxes.push({ x1: gx + glyph.xMin * scale, x2: gx + glyph.xMax * scale, y1: gy - glyph.yMax * scale, y2: gy - glyph.yMin * scale });
  });
  assert.ok(boxes.length);
  return { value, panel: a['data-panel'], advance, maxWidth: Number(a['data-max-width']), x1: Math.min(...boxes.map(b => b.x1)), x2: Math.max(...boxes.map(b => b.x2)), y1: Math.min(...boxes.map(b => b.y1)), y2: Math.max(...boxes.map(b => b.y2)), lineY1: Number(a.y) - font.ascender * size / font.unitsPerEm, lineY2: Number(a.y) - font.descender * size / font.unitsPerEm };
}
const rectBox = node => { const a = attrs(node); return { id: a.id, x1: Number(a.x), y1: Number(a.y), x2: Number(a.x) + Number(a.width), y2: Number(a.y) + Number(a.height) }; };
const contains = (a, b, pad = 0) => b.x1 >= a.x1 + pad && b.y1 >= a.y1 + pad && b.x2 <= a.x2 - pad && b.y2 <= a.y2 - pad;
const overlaps = (a, b, pad = 0) => Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1) > -pad && Math.min(a.y2, b.y2) - Math.max(a.y1, b.y1) > -pad;
// Slab intersection consumes the complete segment; no sampling can miss a short crossing.
function segmentCrosses([x1, y1], [x2, y2], box) {
  let enter = 0, leave = 1;
  for (const [start, delta, low, high] of [[x1, x2 - x1, box.x1 - 1, box.x2 + 1], [y1, y2 - y1, box.y1 - 1, box.y2 + 1]]) {
    if (delta === 0) { if (start <= low || start >= high) return false; continue; }
    const a = (low - start) / delta, b = (high - start) / delta;
    enter = Math.max(enter, Math.min(a, b)); leave = Math.min(leave, Math.max(a, b));
    if (enter >= leave) return false;
  }
  return enter < leave;
}
export function googleCloudBankingGeometryIssues(svg) {
  const { root, all } = inspectGoogleCloudBankingSvg(svg), [, , width, height] = attrs(root).viewBox.split(' ').map(Number);
  const issues = [], frame = { x1: 0, y1: 0, x2: width, y2: height }, panels = all.filter(n => tag(n) === 'rect').map(rectBox), labels = all.filter(n => tag(n) === 'text').map(labelBox);
  for (const panel of panels) if (!contains(frame, panel)) issues.push(`Panel outside viewBox: ${panel.id}`);
  for (const label of labels) {
    const own = panels.find(p => p.id === label.panel);
    assert.ok(own, 'Every label has an intended panel');
    if (!contains(frame, label, 7)) issues.push(`Outside viewBox: ${label.value}`);
    if (!contains(own, label, 8)) issues.push(`Outside panel: ${label.value}`);
    if (label.advance > label.maxWidth + .1) issues.push(`Too wide: ${label.value} (${label.advance.toFixed(1)} > ${label.maxWidth})`);
    for (const other of panels) if (other.id !== own.id && !contains(other, own) && overlaps(label, other)) issues.push(`Unrelated panel crossing: ${label.value}`);
  }
  for (const [i, a] of labels.entries()) for (const b of labels.slice(i + 1)) if (overlaps(a, b, -1)) issues.push(`Overlapping labels: ${a.value} / ${b.value}`);
  // Ink bounds alone miss cramped leading between capitals and the next row.
  // Include each exact local font's ascender/descender interval, including the
  // spacing required by glyphs absent from this particular label.
  for (const [i, a] of labels.entries()) for (const b of labels.slice(i + 1)) if (overlaps({ ...a, y1: a.lineY1, y2: a.lineY2 }, { ...b, y1: b.lineY1, y2: b.lineY2 })) issues.push(`Overlapping font line boxes: ${a.value} / ${b.value}`);
  for (const node of all) {
    const a = attrs(node), name = tag(node);
    let points;
    if (name === 'line') points = [[Number(a.x1), Number(a.y1)], [Number(a.x2), Number(a.y2)]];
    if (name === 'path') points = pathPoints(a.d);
    if (name === 'circle') {
      const cx = Number(a.cx), cy = Number(a.cy), r = Number(a.r);
      if (!contains(frame, { x1: cx - r, y1: cy - r, x2: cx + r, y2: cy + r })) issues.push('Circle outside viewBox');
    }
    if (points) {
      for (const [x, y] of points) if (!contains(frame, { x1: x, x2: x, y1: y, y2: y })) issues.push('Connector outside viewBox');
      for (let i = 1; i < points.length; i++) for (const label of labels) if (segmentCrosses(points[i - 1], points[i], label)) issues.push(`Connector crosses label: ${label.value}`);
    }
  }
  if (width === 1300) assert.ok(height * 704 / width <= 500, 'Compact desktop');
  return [...new Set(issues)];
}
export function assertGoogleCloudBankingGeometry(svg) { assert.deepEqual(googleCloudBankingGeometryIssues(svg), []); return true; }
const hash = value => createHash('sha256').update(value).digest('hex');
export function assertGoogleCloudBankingFaithful(svg, lang, kind, mobile) {
  assertGoogleCloudBankingGeometry(svg);
  const canonical = googleCloudBankingSvg(lang, kind, mobile);
  const normalized = value => serializeOuter(parseFragment(value).childNodes.find(n => n.tagName === 'svg'));
  assert.equal(hash(normalized(svg)), hash(normalized(canonical)), 'Exact controlled labels, data, relations and geometry');
  return true;
}
const htmlNodes = node => [node, ...(node.childNodes ?? []).flatMap(htmlNodes)];
const htmlAttrs = node => Object.fromEntries((node.attrs ?? []).map(a => [a.name, a.value]));
const sourceUrls = Object.freeze([
  'https://status.cloud.google.com/incidents/Xs2XTHzAVC9YnafnPyzj',
  'https://www.reuters.com/world/europe/google-cloud-services-experience-outage-europe-2026-10-20/',
  'https://www.reuters.com/business/finance/revolut-says-some-services-back-online-after-outage-2026-10-20/',
  'https://www.reuters.com/business/finance/europes-financial-regulators-query-google-over-cloud-outage-that-hit-banks-2026-10-21/',
  'https://www.bankofengland.co.uk/news/2026/october/cmorg-holds-sector-wide-cloud-outage-simulation-exercise',
  'https://www.fca.org.uk/firms/critical-third-parties-strengthening-uk-financial-services',
  'https://committees.parliament.uk/publications/55432/standard/pdf/',
  'https://www.esma.europa.eu/press-news/esma-news/european-supervisory-authorities-designate-critical-ict-third-party-providers',
  'https://eur-lex.europa.eu/legal-content/FR-EN/TXT/?uri=CELEX%3A32022R2554',
  'https://docs.cloud.google.com/architecture/disaster-recovery',
  'https://www.bankofengland.co.uk/prudential-regulation/publication/2021/march/operational-resilience-impact-tolerances-for-important-business-services-ss',
  'https://www.moneyvox.fr/banque-en-ligne/actualites/110904/paiements-par-carte-retraits-virements-une-panne-majeure-touche-les-services-de-revolut',
  'https://intelligence.uptimeinstitute.com/resource/google-uk-outage-who-responsible-when-cloud-apps-fail',
  'https://apnews.com/article/e8d708a22cb1a1b225e2b1b70e963a31',
  'https://www.gov.uk/government/news/uk-financial-system-strengthened-with-new-safeguards-for-major-technology-providers',
  'https://www.lawgazette.co.uk/news/power-event-disrupts-remote-hearings/5128285.article',
]);
export function assertGoogleCloudBankingSourceRecords(html) {
  const all = htmlNodes(parse(html)), records = all.filter(n => (htmlAttrs(n).id ?? '').startsWith('source-s'));
  assert.deepEqual(records.map(n => htmlAttrs(n).id), Array.from({ length: 16 }, (_, i) => `source-s${String(i + 1).padStart(2, '0')}`));
  for (const [i, record] of records.entries()) assert.deepEqual(htmlNodes(record).filter(n => n.tagName === 'a').map(n => htmlAttrs(n).href), [sourceUrls[i]], 'One exact canonical URL per source record');
  for (const match of html.matchAll(/#source-s([A-Za-z0-9_-]+)/gu)) assert.ok(records.some(record => htmlAttrs(record).id === `source-s${match[1]}`), 'Every MDX or HTML source fragment resolves');
  for (const node of all.filter(n => n.tagName === 'a' && (htmlAttrs(n).href ?? '').startsWith('#source-s'))) assert.ok(records.some(record => htmlAttrs(record).id === htmlAttrs(node).href.slice(1)), 'Source fragments are bijective');
  return true;
}
export function assertGoogleCloudBankingArticleReferences(html, lang) {
  assertGoogleCloudBankingSourceRecords(html);
  const all = htmlNodes(parse(html));
  const figures = all.filter(n => n.tagName === 'figure' && (htmlAttrs(n).class ?? '').split(' ').includes('gc-banking-figure'));
  assert.equal(figures.length, 5);
  for (const [i, figure] of figures.entries()) {
    assert.equal(htmlAttrs(figure)['data-kind'], GOOGLE_CLOUD_KINDS[i]);
    const descendants = htmlNodes(figure), svgs = descendants.filter(n => n.tagName === 'svg');
    assert.equal(svgs.length, 2);
    for (const [j, svg] of svgs.entries()) assertGoogleCloudBankingFaithful(serializeOuter(svg), lang, GOOGLE_CLOUD_KINDS[i], Boolean(j));
    assert.deepEqual(descendants.filter(n => n.tagName === 'a' && (htmlAttrs(n).href ?? '').startsWith('#source-s')).map(n => htmlAttrs(n).href), GOOGLE_CLOUD_SOURCES[i].split(' ').map(id => `#source-s${id}`));
    for (const name of ['figcaption', 'details', 'summary']) assert.equal(descendants.filter(n => n.tagName === name).length, 1);
  }
  return true;
}
