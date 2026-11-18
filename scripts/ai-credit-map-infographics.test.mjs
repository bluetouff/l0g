import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import test from 'node:test';
import { XMLValidator } from 'fast-xml-parser';
import { inspectInsuranceSvg, tag, attrs, text } from './ai-insurance-svg-assertions.mjs';

const read = file => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const variants = ['fr', 'en'].flatMap(lang => ['holdings', 'bridge', 'market'].flatMap(kind => [false, true].map(mobile => ({ lang, kind, mobile, file: `src/figures/ai-credit-map/ai-map-${kind}-${lang}${mobile ? '-mobile' : ''}.svg` }))));
const inspect = raw => {
  assert(raw.length < 50_000, 'Bounded local SVG');
  assert.equal(XMLValidator.validate(raw), true, 'Original XML remains well formed');
  // The supplied bars use only these two reviewed opacity levels.
  return inspectInsuranceSvg(raw.replace(/ opacity="(?:0\.65|0\.95)"/gu, ''));
};
const visible = raw => inspect(raw).all.filter(n => tag(n) === 'text').map(text);
const numeric = value => Number(value.replace(',', '.'));

function assertHoldings(raw) {
  const { all } = inspect(raw), copy = visible(raw);
  const amounts = copy.filter(s => /^\d+[,.]\d{3}$/u.test(s)).map(s => Math.round(numeric(s) * 1000));
  assert.deepEqual(amounts, [23960, 13004, 8969, 8969, 2212, 664]);
  const total = amounts.reduce((sum, n) => sum + n, 0);
  assert.equal(total, 57778);
  assert.match(copy.join(' '), /1[ ,]555/u);
  assert.match(copy.join(' '), /57[,.]778/u);
  assert.match(copy.join(' '), /3[,.]7\s*%/u);
  assert.match(copy.join(' '), /38[,.]850/u);
  assert.equal([8744, 6031, 6031, 16111, 1487, 446].reduce((sum, n) => sum + n, 0), 38850);
  assert.match(copy.join(' '), /non tirés|undrawn/u);
  assert.match(copy.join(' '), /[0–]24|0[–-]24/u);
  const bars = all.filter(n => tag(n) === 'rect' && attrs(n).fill === 'var(--color-signal)');
  assert.equal(bars.length, 7);
  const track = all.find(n => tag(n) === 'rect' && attrs(n).y === attrs(bars[0]).y && attrs(n).fill === 'var(--color-surface)');
  assert.equal(attrs(track).x, attrs(bars[0]).x);
  assert(Math.abs(Number(attrs(bars[0]).width) - total / 1555000 * Number(attrs(track).width)) < .002, 'Total bar uses the drawn-principal denominator');
  for (const [i, bar] of bars.slice(1).entries()) {
    const a = attrs(bar), centre = Number(a.y) + Number(a.height) / 2;
    const grid = all.find(n => tag(n) === 'line' && attrs(n).x1 === a.x && Math.abs(Number(attrs(n).y1) - centre) <= .51 && attrs(n).y1 === attrs(n).y2);
    assert(grid, 'Each funded bar has its own zero-based track');
    const scale = (Number(attrs(grid).x2) - Number(attrs(grid).x1)) / 24;
    assert(Math.abs(Number(a.width) - amounts[i] / 1000 * scale) < .002, 'All six enlarged bars use the same 0–24 million scale');
  }
}

function assertMarket(raw) {
  const { all } = inspect(raw), copy = visible(raw).join(' ');
  assert.match(copy, /Près de 8\s*%|Nearly 8%/u);
  assert.match(copy, /investment grade/u);
  assert.match(copy, /10 (?:ans|years)|10-year/u);
  assert.match(copy, /30 (?:juin|June) 2026/u);
  assert.match(copy, /conditionnel|Conditional|conditional/u);
  assert.match(copy, /pertes non chiffrées|no quantified losses|losses not quantified/u);
  const bar = all.find(n => tag(n) === 'rect' && attrs(n).fill === 'var(--color-signal)');
  const track = all.find(n => tag(n) === 'rect' && attrs(n).fill === 'var(--color-surface)');
  assert.equal(attrs(bar).x, attrs(track).x);
  assert.equal(attrs(bar).y, attrs(track).y);
  assert(Math.abs(Number(attrs(bar).width) / Number(attrs(track).width) - .08) < .000001, 'Approximate 8% uses this segment as its full scale');
}

test('twelve passive credit-map variants retain accessible local IDs and compact proportions', () => {
  assert.deepEqual(readdirSync(new URL('../src/figures/ai-credit-map/', import.meta.url)).sort(), variants.map(v => v.file.split('/').at(-1)).sort());
  for (const v of variants) {
    const { all, box } = inspect(read(v.file));
    assert.equal(box[2], v.mobile ? 380 : 680);
    if (!v.mobile) assert(box[3] * 600 / box[2] >= 250 && box[3] * 600 / box[2] <= 330);
    for (const n of all.filter(n => tag(n) === 'text')) {
      const size = Number(attrs(n)['font-size']);
      assert(size >= (v.mobile ? 14 : 13.6) && size <= (v.mobile ? 18 : 20.4));
    }
    for (const n of [all.find(n => tag(n) === 'title'), all.find(n => tag(n) === 'text')]) assert.doesNotMatch(text(n), /ce qu[ei’']|what\b|—/iu);
  }
});

test('passive XML checks reject executable content, remote assets, malformed opacity and missing descriptions', () => {
  const raw = read(variants[0].file);
  for (const bad of [raw.replace('</svg>', '<script>alert(1)</script></svg>'), raw.replace('<svg ', '<svg onload="alert(1)" '), raw.replace('<svg ', '<svg href="https://example.org/a.svg" '), raw.replace(/<desc\b[\s\S]*?<\/desc>/u, ''), raw.replace('opacity="0.95"', 'opacity="2"'), raw.replace('opacity="0.95"', 'opacity="0.95" opacity="0.95"'), '<!DOCTYPE svg>' + raw]) assert.throws(() => inspect(bad));
});

test('funded positions add to $57.778m and both the total and zoom bars use their stated denominators', () => {
  for (const v of variants.filter(v => v.kind === 'holdings')) assertHoldings(read(v.file));
});

test('the banking bridge separates commitments, total drawings and the unresolved CoreWeave collateral link', () => {
  for (const v of variants.filter(v => v.kind === 'bridge')) {
    const { all } = inspect(read(v.file)), copy = visible(read(v.file)).join(' '), description = text(all.find(n => tag(n) === 'desc'));
    assert.match(copy, /150 M\$ engagés|\$150m committed/u);
    assert.match(copy, /100 M\$ engagés|\$100m committed/u);
    assert.match(copy, /75 M\$ tirés au total|\$75m drawn in total/u);
    assert.match(copy, /DDTL 5\.5\s*·\s*(?:8,969 M\$|\$8\.969m)/u);
    assert.match(copy, /non établi|unconfirmed|not established/u);
    assert.match(description, /tirages individuels|individual bank drawings/iu);
    assert.match(description, /30 (?:septembre|September)/u);
    assert(all.some(n => attrs(n)['stroke-dasharray'] === '3 4'), 'Unknown collateral membership is shown separately with a dashed link');
  }
});

test('the market bar retains the euro investment-grade long-maturity segment and its conditional mechanism', () => {
  for (const v of variants.filter(v => v.kind === 'market')) assertMarket(read(v.file));
});

test('quantitative checks reject distorted bars and altered funded amounts', () => {
  const holdings = read(variants.find(v => v.kind === 'holdings' && !v.mobile).file);
  for (const bad of [holdings.replace('width="23.78"', 'width="33.78"'), holdings.replace('width="391.347"', 'width="390.347"'), holdings.replace('>23,960</text>', '>23,961</text>')]) {
    assert.ok(bad !== holdings, 'Mutation changes the figure'); assert.throws(() => assertHoldings(bad));
  }
  const market = read(variants.find(v => v.kind === 'market' && !v.mobile).file), bad = market.replace('width="51.2"', 'width="61.2"');
  assert.ok(bad !== market, 'Mutation changes the segment bar'); assert.throws(() => assertMarket(bad));
});

test('the component keeps controlled SVGs, all holdings references and the compact responsive contract', () => {
  const raw = read('src/components/AiCreditMapFigure.astro');
  assert.match(raw, /import\.meta\.glob\('\.\.\/figures\/ai-credit-map\/ai-map-\*\.svg'/u);
  assert.equal((raw.match(/set:html=/gu) ?? []).length, 2);
  for (const source of ['S01', 'S03', 'S04', 'S05', 'S06', 'S07', 'S08']) assert(raw.includes(`'${source}'`));
  assert.match(raw, /max-width:\s*600px/u); assert.match(raw, /padding-bottom:\s*1rem/u);
  assert.match(raw, /@container\s*\(max-width:\s*568px\)/u); assert.match(raw, /font-size:\s*\.75rem/u);
  assert.doesNotMatch(raw, /<script|\bfetch\(|\beval\(|new Function/iu);
});
