import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import test from 'node:test';
import { insuranceVariants, readInsuranceSvg, inspectInsuranceSvg, assertInsuranceBars, tag, attrs, text } from './ai-insurance-svg-assertions.mjs';

test('twelve passive bilingual insurance SVGs retain accessible desktop/mobile variants and compact typography', () => {
  const expected = insuranceVariants.map(v => `${v.lang}-${v.kind}${v.mobile ? '-mobile' : ''}.svg`).sort();
  assert.deepEqual(readdirSync(new URL('../src/figures/ai-insurance/', import.meta.url)).sort(), expected);
  for (const v of insuranceVariants) {
    const { all, box } = inspectInsuranceSvg(readInsuranceSvg(v));
    assert.equal(box[2], v.mobile ? 380 : 760);
    if (!v.mobile) assert(box[3] * 600 / box[2] >= 250 && box[3] * 600 / box[2] <= 330);
    for (const n of all.filter(n => tag(n) === 'text')) {
      const size = Number(attrs(n)['font-size']);
      assert(Number.isFinite(size) && size >= (v.mobile ? 14 : 15.2));
      assert(size <= (v.mobile ? 18 : 22));
    }
    for (const n of [all.find(n => tag(n) === 'title'), all.find(n => tag(n) === 'text')]) assert.doesNotMatch(text(n), /ce qu[ei’']|what\b|—/iu);
  }
});

test('SVG security rejects executable markup, external references and broken accessible IDs', () => {
  const svg = readInsuranceSvg(insuranceVariants[0]);
  for (const bad of [
    svg.replace('</svg>', '<script>alert(1)</script></svg>'),
    svg.replace('</svg>', '<foreignObject/></svg>'),
    svg.replace('<svg ', '<svg onload="alert(1)" '),
    svg.replace('<svg ', '<svg href="https://example.org/a.svg" '),
    svg.replace('fill="var(--color-paper)"', 'fill="url(#missing)"'),
    svg.replace('aria-labelledby="', 'aria-labelledby="missing '),
    '<!DOCTYPE svg>' + svg,
  ]) assert.throws(() => inspectInsuranceSvg(bad));
});

test('funded Athene amounts add to $12.9bn and all four bars use the same zero and linear axis', () => {
  for (const v of insuranceVariants.filter(v => v.kind === 'portfolio')) {
    const raw = readInsuranceSvg(v); assertInsuranceBars(raw);
    const bar = inspectInsuranceSvg(raw).all.find(n => tag(n) === 'rect' && attrs(n).fill === 'var(--color-signal)');
    const width = attrs(bar).width;
    assert.throws(() => assertInsuranceBars(raw.replace(`width="${width}"`, `width="${Number(width) + 1}"`)));
    assert.throws(() => assertInsuranceBars(raw.replace(/>0[,.]7<\/text>/u, '>0.8</text>')));
  }
});

test('guarantee labels preserve the separate 15% purchase and 35% payment bases', () => {
  for (const v of insuranceVariants.filter(v => v.kind === 'guarantee')) {
    const { all } = inspectInsuranceSvg(readInsuranceSvg(v));
    const copy = all.filter(n => tag(n) === 'text').map(text).join(' ');
    assert.match(copy, /15\s*%/u); assert.match(copy, /35\s*%/u);
    assert.match(copy, /WHCO/u); assert.match(copy, /AHL/u);
    assert.match(copy, v.lang === 'fr' ? /obligation.*achat/iu : /purchase.*obligation/iu);
    assert.match(copy, v.lang === 'fr' ? /payés/iu : /pays/iu);
    assert.match(copy, v.lang === 'fr' ? /non nommé|non publiée/iu : /Unnamed|undisclosed/iu);
  }
});

test('the component embeds only controlled local variants, responsive layouts and a lower reading margin', () => {
  const raw = readFileSync(new URL('../src/components/AiInsuranceFigure.astro', import.meta.url), 'utf8');
  assert.match(raw, /import\.meta\.glob\('\.\.\/figures\/ai-insurance\/\*\.svg'/u);
  assert.equal((raw.match(/set:html=/gu) ?? []).length, 2);
  assert.match(raw, /max-width:\s*600px/u);
  assert.match(raw, /padding-bottom:\s*1rem/u);
  assert.match(raw, /@container\s*\(max-width:\s*568px\)/u);
  assert.match(raw, /font-size:\s*\.75rem/u);
  assert.doesNotMatch(raw, /<script|\bfetch\(|\beval\(|new Function/iu);
});
