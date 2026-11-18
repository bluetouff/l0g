import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import test from 'node:test';
import { inspectInsuranceSvg as inspectSvg, tag, attrs, text } from './ai-insurance-svg-assertions.mjs';

const read = file => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const variants = ['fr', 'en'].flatMap(lang => ['surety', 'trap', 'reserves'].flatMap(kind => [false, true].map(mobile => ({ lang, kind, mobile, file: `src/figures/ai-cash/ai-cash-${kind}-${lang}${mobile ? '-mobile' : ''}.svg` }))));
const visibleText = raw => inspectSvg(raw).all.filter(n => tag(n) === 'text').map(text);

test('all twelve local cash-flow SVGs have passive XML, complete accessible variants and compact typography', () => {
  assert.deepEqual(readdirSync(new URL('../src/figures/ai-cash/', import.meta.url)).sort(), variants.map(v => v.file.split('/').at(-1)).sort());
  for (const v of variants) {
    const { all, box } = inspectSvg(read(v.file));
    assert.equal(box[2], v.mobile ? 380 : 760);
    if (!v.mobile) assert(box[3] * 600 / box[2] >= 250 && box[3] * 600 / box[2] <= 330);
    for (const n of all.filter(n => tag(n) === 'text')) {
      const size = Number(attrs(n)['font-size']);
      assert(size >= (v.mobile ? 14 : 15.2) && size <= (v.mobile ? 18 : 22.8));
    }
    for (const n of [all.find(n => tag(n) === 'title'), all.find(n => tag(n) === 'text')]) assert.doesNotMatch(text(n), /ce qu[ei’']|what\b|—/iu);
  }
});

test('cash diagrams reject active markup, remote assets and missing accessible descriptions', () => {
  const raw = read(variants[0].file);
  for (const bad of [raw.replace('</svg>', '<script>alert(1)</script></svg>'), raw.replace('<svg ', '<svg onload="alert(1)" '), raw.replace('<svg ', '<svg href="https://example.org/a.svg" '), raw.replace(/<desc\b[\s\S]*?<\/desc>/u, ''), '<!DOCTYPE svg>' + raw]) assert.throws(() => inspectSvg(bad));
});

test('the surety diagram distinguishes the $154m cash deposit from $275m contractual cover', () => {
  for (const v of variants.filter(v => v.kind === 'surety')) {
    const copy = visibleText(read(v.file));
    assert.deepEqual(copy.filter(s => /^(?:\$\d+m|\d+ M\$)$/u.test(s)).map(s => Number(s.replace(/\D/gu, ''))), [154, 275]);
    assert(copy.some(s => /cash dépos|cash deposited/iu.test(s)));
    assert(copy.some(s => /protection.*4/iu.test(s)));
    assert(copy.some(s => /30.*(?:09|Sep|sept)/iu.test(s)));
  }
});

test('cash trap diagrams retain the threshold, consecutive payment dates and bounded prepayment mechanism', () => {
  for (const v of variants.filter(v => v.kind === 'trap')) {
    const copy = visibleText(read(v.file)).join(' ');
    assert.match(copy, /< 2[,.]40/u); assert.match(copy, /> 2[,.]40/u);
    assert.match(copy, /3[^.]{0,100}consécutives|3 consecutive/iu);
    assert.match(copy, /5 (?:jours ouvrés|business days)/iu);
    assert.match(copy, /Rang 6|rang 6|Step 6|step 6/u);
    assert.match(copy, /limit[^.]{0,50}cash|cash[^.]{0,50}limit/iu);
    assert.match(copy, /aucun déclenchement|no activation/iu);
  }
});

test('reserve diagrams label $121m/$148m as initial allocations and keep the historical electricity milestone', () => {
  for (const v of variants.filter(v => v.kind === 'reserves')) {
    const raw = read(v.file), copy = visibleText(raw);
    assert.deepEqual(copy.filter(s => /^(?:\$\d+m|\d+ M\$)$/u.test(s)).map(s => Number(s.replace(/\D/gu, ''))), [121, 148]);
    assert.match(copy.join(' '), /initial/iu);
    assert.match(copy.join(' '), /18 (?:juin|June) 2026/u);
    assert.match(copy.join(' '), /15 (?:jours ouvrés|business days)/iu);
    const description = text(inspectSvg(raw).all.find(n => tag(n) === 'desc'));
    assert.match(description, v.lang === 'fr' ? /non les soldes actuels/u : /not current balances/u);
  }
});

test('the component keeps controlled local SVGs, responsive switching and a lower reading margin', () => {
  const raw = read('src/components/AiCashFlowFigure.astro');
  assert.match(raw, /import\.meta\.glob\('\.\.\/figures\/ai-cash\/ai-cash-\*\.svg'/u);
  assert.equal((raw.match(/set:html=/gu) ?? []).length, 2);
  assert.match(raw, /max-width:\s*600px/u); assert.match(raw, /padding-bottom:\s*1rem/u);
  assert.match(raw, /@container\s*\(max-width:\s*568px\)/u); assert.match(raw, /font-size:\s*\.75rem/u);
  assert.doesNotMatch(raw, /<script|\bfetch\(|\beval\(|new Function/iu);
});
