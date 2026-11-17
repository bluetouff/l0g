import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLParser, XMLValidator } from 'fast-xml-parser';

export const insuranceKinds = ['lookthrough', 'portfolio', 'guarantee'];
export const insuranceVariants = ['fr', 'en'].flatMap(lang => insuranceKinds.flatMap(kind => [false, true].map(mobile => ({ lang, kind, mobile }))));
export const readInsuranceSvg = ({ lang, kind, mobile }) => readFileSync(new URL(`../src/figures/ai-insurance/${lang}-${kind}${mobile ? '-mobile' : ''}.svg`, import.meta.url), 'utf8');
const parser = new XMLParser({ preserveOrder: true, ignoreAttributes: false, attributeNamePrefix: '', trimValues: false, parseTagValue: false, parseAttributeValue: false });
export const tag = n => Object.keys(n).find(k => k !== ':@');
export const attrs = n => n[':@'] ?? {};
export const children = n => Array.isArray(n[tag(n)]) ? n[tag(n)] : [];
export const nodes = n => [n, ...children(n).flatMap(nodes)];
export const text = n => tag(n) === '#text' ? n['#text'] : children(n).map(text).join('');
const tags = new Set(['svg', 'title', 'desc', 'text', 'g', 'rect', 'path', 'circle', 'line', '#text']);
const attributes = new Set('xmlns viewBox role aria-labelledby font-family font-weight style class id x y x1 y1 x2 y2 width height rx r cx cy d transform fill stroke stroke-width stroke-linecap stroke-linejoin stroke-dasharray font-size text-anchor data-icon'.split(' '));
const paints = /^(?:none|var\(--color-(?:paper|muted|surface|line|line-strong|signal|amber|accent)\))$/u;

export function inspectInsuranceSvg(raw) {
  assert.equal(typeof raw, 'string');
  assert(raw.length < 50_000, 'Bounded local SVG');
  assert(!/<!|<\?|(?:https?:|data:|javascript:)|url\(/iu.test(raw.replace('http://www.w3.org/2000/svg', '')), 'Passive SVG without remote resources');
  assert.equal(XMLValidator.validate(raw), true, 'Well-formed XML');
  const roots = parser.parse(raw).filter(n => tag(n) !== '#text');
  assert.equal(roots.length, 1);
  const root = roots[0], all = nodes(root), a = attrs(root);
  assert.equal(tag(root), 'svg');
  assert.equal(a.role, 'img');
  assert.equal(a.style, 'width:100%;height:auto');
  const box = a.viewBox.split(/\s+/u).map(Number);
  assert(box.length === 4 && box.every(Number.isFinite) && box[0] === 0 && box[1] === 0 && box[2] > 0 && box[3] > 0, 'Finite responsive viewBox');
  const ids = all.map(n => attrs(n).id).filter(Boolean);
  assert.equal(ids.length, new Set(ids).size, 'Unique local SVG IDs');
  assert.equal(all.filter(n => tag(n) === 'title').length, 1);
  assert.equal(all.filter(n => tag(n) === 'desc').length, 1);
  const labelled = a['aria-labelledby'].split(/\s+/u);
  assert.equal(labelled.length, 2);
  for (const id of labelled) assert(ids.includes(id), 'Accessible name resolves locally');
  for (const n of all) {
    assert(tags.has(tag(n)), 'Only passive drawing elements');
    for (const [key, value] of Object.entries(attrs(n))) {
      assert(attributes.has(key), `Controlled SVG attribute: ${key}`);
      if (key === 'style') assert(n === root && value === 'width:100%;height:auto');
      if (key === 'fill' || key === 'stroke') assert(paints.test(value), 'Theme-adaptive palette');
      if (key === 'font-weight') assert(['400', '500'].includes(value), 'Restrained type weight');
      if (key === 'font-family') assert.equal(value, 'Inter Variable, Inter, sans-serif');
    }
  }
  return { root, all, box };
}

export function assertInsuranceBars(raw) {
  const { all } = inspectInsuranceSvg(raw);
  const bars = all.filter(n => tag(n) === 'rect' && attrs(n).fill === 'var(--color-signal)');
  const tracks = all.filter(n => tag(n) === 'rect' && attrs(n).fill === 'var(--color-line)');
  const ticks = all.filter(n => tag(n) === 'text' && /^[0-5]$/u.test(text(n)));
  const values = all.filter(n => tag(n) === 'text' && /^\d[,.]\d$/u.test(text(n))).map(n => Number(text(n).replace(',', '.')));
  assert.equal(bars.length, 4); assert.equal(tracks.length, 4); assert.equal(ticks.length, 6);
  assert.deepEqual(values, [3.6, 3.6, .7, 5]);
  assert.equal(values.map(v => Math.round(v * 10)).reduce((sum, v) => sum + v, 0), 129, 'Verified funded total is $12.9bn');
  const origin = Number(attrs(ticks[0]).x), scale = (Number(attrs(ticks[5]).x) - origin) / 5;
  assert(scale > 0);
  for (const [i, tick] of ticks.entries()) assert(Math.abs(Number(attrs(tick).x) - origin - i * scale) < .001, 'Linear axis');
  for (const [i, bar] of bars.entries()) {
    assert.equal(Number(attrs(bar).x), origin, 'Shared zero');
    assert.equal(attrs(bar).y, attrs(tracks[i]).y);
    assert(Math.abs(Number(attrs(bar).width) - values[i] * scale) < .001, 'Amount matches the common axis');
    assert(Math.abs(Number(attrs(tracks[i]).width) - 5 * scale) < .001, 'Shared full-scale track');
  }
}
