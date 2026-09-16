import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync, existsSync } from 'node:fs';
import { fromHtml } from 'hast-util-from-html';
import { XMLValidator } from 'fast-xml-parser';
import { BASE, LIMITS, PRESETS, calculateSoftwareDebt } from '../src/lib/software-debt-stress.mjs';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const walk = n => [n, ...(n.children ?? []).flatMap(walk)];
const select = (n, tag) => walk(n).filter(n => n.tagName === tag);
const text = n => n.type === 'text' ? n.value : (n.children ?? []).map(text).join('');
const close = (a, b) => assert(Math.abs(a - b) < 1e-9, `${a} != ${b}`);
const sources = new Set([
  'https://www.bis.org/publications/qr-202609/financing-digital-economy-role-private-credit',
  'https://www.bis.org/publications/bulletin-128-ai-disruption-private-credit-exposure-software-firms-bdcs.pdf',
  'https://www.nber.org/papers/w34500',
  'https://www.bis.org/publications/markets-recalibrate-amid-shifting-currents',
  'https://www.blueowltechnologyfinance.com/investors/sec-filings/all-sec-filings/content/0001747777-26-000027/exhibit991-otfxpressrelease.htm',
  'https://www.blueowltechnologyfinance.com/investors/news-events/press-releases/detail/117/blue-owl-technology-finance-corp-closes-150-million-private-placement-of-senior-unsecured-notes',
  'https://www.investor.gov/introduction-investing/investing-basics/investment-products/closed-end-funds/publicly-traded-business-development-companies-bdcs',
  'https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/investor-bulletin-non-publicly-traded-business-development-companies-bdcs',
  'https://www.imf.org/-/media/files/publications/gfsr/2026/april/english/ch1.pdf',
  'https://www.nber.org/papers/w35385',
  'https://www.financialresearch.gov/briefs/2026/03/12/measuring-counterparty-exposures-private-credit/',
  'https://www.imf.org/-/media/files/publications/gfsr/2024/april/english/ch2.pdf',
]);
const paths = ['src/content/posts/credit-prive-logiciels-ia-revenus-dette.mdx', 'src/content/posts-en/private-credit-software-ai-cash-flows-debt.mdx'];
const reviewedSource = href => assert(sources.has(new URL(href).href));

test('software debt: all published scenarios reproduce independently calculated outputs', () => {
  for (const [preset, expected] of [
    ['baseline', [100, 70, 30, 20, 20, 0, 10, 10, 200, 1.5]],
    ['pressure', [85, 66.5, 18.5, 20, 20, 0, -1.5, -1.5, 200, .925]],
    ['adaptation', [90, 56, 34, 20, 20, 0, 14, 14, 200, 1.7]],
    ['deferral', [75, 70, 5, 20, 5, 15, 0, -15, 215, .25]],
  ]) {
    const r = calculateSoftwareDebt(PRESETS[preset]);
    ['revenue','costs','operating','totalInterest','cashInterest','pikInterest','cashResidual','economicResidual','endDebt','coverage'].forEach((key, i) => close(r[key], expected[i]));
  }
  assert.equal(calculateSoftwareDebt({ ...PRESETS.baseline, revenueDrop: 10 }).economicResidual, 0);
});
test('software debt: missing, inherited, nonnumeric and out-of-bounds inputs fail closed', () => {
  for (const value of [null, undefined, [], {}, Object.create(PRESETS.baseline), 'baseline']) assert.throws(() => calculateSoftwareDebt(value));
  for (const [key, [min, max]] of Object.entries(LIMITS)) {
    for (const value of [NaN, Infinity, -Infinity, null, undefined, '', '10', true, {}, min - .001, max + .001]) assert.throws(() => calculateSoftwareDebt({ ...PRESETS.baseline, [key]: value }));
    const missing = { ...PRESETS.baseline }; delete missing[key]; assert.throws(() => calculateSoftwareDebt(missing));
  }
  assert(Object.isFrozen(BASE)); assert(Object.isFrozen(PRESETS));
  assert(Object.values(PRESETS).every(Object.isFrozen));
});
test('software debt: boundary grid conserves annual identities without clipping losses', () => {
  for (const revenueDrop of [0, 10, 25, 40]) for (const costCut of [0, 15, 30])
  for (const rate of [2, 10, 20]) for (const pikShare of [0, 25, 75, 100]) {
    const r = calculateSoftwareDebt({ revenueDrop, costCut, rate, pikShare });
    assert(Object.values(r).every(Number.isFinite));
    close(r.operating, r.revenue - r.costs); close(r.totalInterest, r.cashInterest + r.pikInterest);
    close(r.endDebt, 200 + r.pikInterest); close(r.cashResidual - r.economicResidual, r.pikInterest);
    close(r.economicResidual, r.operating - r.totalInterest); close(r.coverage, r.operating / r.totalInterest);
  }
  const worst = calculateSoftwareDebt({ revenueDrop: 40, costCut: 0, rate: 20, pikShare: 100 });
  assert.equal(worst.cashResidual, -10); assert.equal(worst.economicResidual, -50); assert.equal(worst.coverage, -.25);
});
test('OTF: reported PIK interest and dividends preserve the income denominator', () => {
  assert.equal(24969 + 255, 25224); assert.equal(13657 + 3405, 17062);
  assert.equal(25224 + 17062, 42286);
  assert.equal((42286 / 338032 * 100).toFixed(1), '12.5');
  assert.equal((42286 / 338032 * 100).toFixed(3), '12.509');
});
const svgTags = new Set(['svg', 'title', 'desc', 'rect', 'line', 'circle', 'text', 'g']);
const svgAttrs = new Set(['xmlns', 'viewBox', 'role', 'ariaLabelledBy', 'style', 'id', 'x', 'y', 'width', 'height', 'rx', 'fill', 'stroke', 'strokeWidth', 'fontSize', 'textAnchor', 'x1', 'x2', 'y1', 'y2', 'cx', 'cy', 'r', 'dataPanel']);
function checkSvg(svg) {
  const [x, y, width, height] = svg.properties.viewBox.split(' ').map(Number);
  assert.deepEqual([x, y, width], [0, 0, 520]); assert([490, 758, 680].includes(height));
  assert.equal(svg.properties.style, 'display:block;width:100%;height:auto;background:#0c0d10;border-radius:16px;font-family:system-ui,sans-serif');
  assert.equal(svg.properties.role, 'img');
  assert.equal(select(svg, 'title').length, 1); assert.equal(select(svg, 'desc').length, 1);
  assert.deepEqual(svg.properties.ariaLabelledBy, [select(svg, 'title')[0].properties.id, select(svg, 'desc')[0].properties.id]);
  const inside = (label, box, pad) => {
    const p=label.properties, size=Number(p.fontSize), w=[...text(label)].length*size*.56;
    let left=Number(p.x); if(p.textAnchor==='middle') left-=w/2; if(p.textAnchor==='end') left-=w;
    assert(size>=22); assert(left>=box.x+pad && left+w<=box.x+box.width-pad, `label horizontal bound: ${text(label)}`);
    assert(Number(p.y)-size>=box.y+pad && Number(p.y)+6<=box.y+box.height-pad, `label vertical bound: ${text(label)}`);
  };
  for (const node of walk(svg).filter(n => n.type === 'element')) {
    assert(svgTags.has(node.tagName));
    Object.keys(node.properties).forEach(key => assert(svgAttrs.has(key), `Unexpected SVG attribute ${key}`));
    if (node.tagName === 'text') inside(node, {x:0,y:0,width,height}, 5);
  }
  for (const group of select(svg,'g')) {
    const box=select(group,'rect')[0].properties;
    select(group,'text').forEach(label=>inside(label,Object.fromEntries(['x','y','width','height'].map(k=>[k,Number(box[k])])),10));
  }
}
for (const path of paths) test(`${path}: source identities, responsive SVGs and bilingual dates`, () => {
  const content=read(path), root=fromHtml(content,{fragment:true});
  assert.doesNotMatch(content,/—|foreignObject|<script|overflow:hidden/u);
  assert.match(content,/ogImage: \/illustrations\/news\/credit-prive-logiciels-ia-v1.jpg/u);
  const urls=new Set([...content.matchAll(/https:\/\/[^\s<>"')]+/gu)].map(m=>m[0]));
  assert.deepEqual([...urls].sort(),[...sources].sort()); urls.forEach(reviewedSource);
  assert.equal(select(root,'figure').length,3);
  select(root,'figure').forEach(figure=>{
    assert.equal(figure.properties.style,'max-width:520px;margin:2rem auto 2.75rem;padding-bottom:.5rem');
    assert(select(figure,'a').length>=1); select(figure,'a').forEach(a=>reviewedSource(a.properties.href));
    const svg=select(figure,'svg')[0]; checkSvg(svg);
    assert.equal(XMLValidator.validate(content.slice(svg.position.start.offset,svg.position.end.offset)),true);
  });
  assert.equal(new Set(walk(root).filter(n=>n.properties?.id).map(n=>n.properties.id)).size,6);
  assert.match(content,/pubDate: "2026-09-16T22:40:00\+02:00"/u);
  assert.match(content,/ratios cours\/dividende|price-to-dividend ratios/u);
  assert.match(content,/37 BDC/u); assert.match(content,/12[,.]509/u);
});
test('software figures: negative cases reject panel overflow, active markup and impostor source URLs', () => {
  const first=()=>select(fromHtml(read(paths[0]),{fragment:true}),'svg')[1];
  for(const key of ['x','y']) {const svg=first(); select(select(svg,'g')[0],'text')[0].properties[key]='510'; assert.throws(()=>checkSvg(svg));}
  for(const tagName of ['script','foreignObject','image','use']) {const svg=first();svg.children.push({type:'element',tagName,properties:{},children:[]});assert.throws(()=>checkSvg(svg));}
  for(const key of ['onLoad','href','xLinkHref']) {const svg=first();svg.properties[key]='unexpected';assert.throws(()=>checkSvg(svg));}
  for(const href of ['https://www.nber.org.invalid/papers/w34500','https://www.nber.org@invalid.test/papers/w34500','http://www.nber.org/papers/w34500','https://www.nber.org/papers/w34500?redirect=invalid']) assert.throws(()=>reviewedSource(href));
});
test('software component uses native escaped templates and local text-only DOM updates', () => {
  const source=read('src/components/SoftwareDebtStress.astro');
  assert.doesNotMatch(source,/set:html|innerHTML|outerHTML|insertAdjacentHTML|\beval\s*\(|\bfetch\s*\(|localStorage|sessionStorage|document\.cookie/u);
  assert.match(source,/<fieldset disabled data-fields/u); assert.match(source,/<noscript>/u);
  assert.match(source,/valuesNode.hidden = true/u); assert.match(source,/aria-invalid/u);
  assert.match(source,/textContent = nf.format/u);
});
for (const path of ['dist/posts/credit-prive-logiciels-ia-revenus-dette/index.html','dist/en/analysis/private-credit-software-ai-cash-flows-debt/index.html']) test(`${path}: built figures and progressive enhancement`,{skip:!existsSync(new URL(`../${path}`,import.meta.url))},()=>{
  const root=fromHtml(read(path));
  const svgs=select(root,'svg').filter(n=>select(n,'title').some(t=>t.properties.id?.startsWith('swd-')));
  assert.equal(svgs.length,3);svgs.forEach(checkSvg);
  const component=select(root,'section').find(n=>Object.hasOwn(n.properties,'dataSoftwareDebt'));
  assert(component);assert.equal(select(component,'input').length,4);assert.equal(select(component,'button').length,4);
  assert.equal(select(component,'fieldset')[0].properties.disabled,true);
  assert.equal(select(component,'noscript').length,1);
  for (const input of select(component,'input')) {
    assert(input.properties.id);
    assert(select(component,'label').some(label=>Array.isArray(label.properties.htmlFor) && label.properties.htmlFor.length===1 && label.properties.htmlFor[0]===input.properties.id));
    const hint=input.properties.ariaDescribedBy;
    assert.equal(hint.length,1);
    assert(walk(component).some(n=>n.properties?.id===hint[0] && text(n).length>10));
  }
  assert.equal(walk(component).find(n=>n.properties?.dataResult==='endDebt').children[0].value,'200');
});
