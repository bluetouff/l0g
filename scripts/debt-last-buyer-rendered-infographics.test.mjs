import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parse } from 'parse5';

const urls = [
  "https://www.federalreserve.gov/monetarypolicy/fomcminutes20260916.htm",
  "https://www.newyorkfed.org/markets/repo-agreement-ops-faq",
  "https://www.federalreserve.gov/econres/notes/feds-notes/implementing-monetary-policy-in-an-ample-reserves-regime-when-in-crisis-note-3-of-3-accessible-20201002.htm",
  "https://www.newyorkfed.org/newsevents/speeches/2020/log200715",
  "https://www.newyorkfed.org/research/staff_reports/sr998.html",
  "https://www.bankofengland.co.uk/quarterly-bulletin/2023/2023/financial-stability-buy-sell-tools-a-gilt-market-case-study",
  "https://www.bankofengland.co.uk/sterling-monetary-framework/report-2022-23",
  "https://www.bankofengland.co.uk/speech/2023/march/andrew-hauser-opening-remarks-at-university-of-chicago-booth-school-of-business-workshop",
  "https://www.bankofengland.co.uk/news/2025/january/boe-open-new-contingent-non-bank-lending-facility-for-applications",
  "https://www.bankofengland.co.uk/speech/2025/june/randall-kroszner-dinner-speech-at-ecb-conference-on-financial-stability-and-macroprudential-policy",
  "https://www.bankofengland.co.uk/asset-purchase-facility/2026/2026-q2",
  "https://www.ecb.europa.eu/press/pr/date/2022/html/ecb.pr220721~973e6e7273.en.html",
  "https://www.ecb.europa.eu/press/annual-reports-financial-statements/annual/html/ecb.ar2025~b7f898b33d.en.html",
  "https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX:12016E123",
  "https://www.federalreserve.gov/monetarypolicy/fima-repo-facility.htm",
  "https://www.federalreserve.gov/monetarypolicy/fima-repo-facility-faqs.htm",
  "https://www.bankofengland.co.uk/financial-stability-report/2022/december-2022",
  "https://www.bankofengland.co.uk/markets/market-notices/2025/january/contingent-nbfi-repo-facility-market-notice-28-january-2025",
  "https://www.federalreserve.gov/econres/notes/feds-notes/implementing-monetary-policy-in-an-ample-reserves-regime-when-in-crisis-note-3-of-3-20201002.html",
  "https://www.bankofengland.co.uk/speech/2025/october/jonathan-hall-speech-at-confederation-of-british-industry-balancing-financial-stability-and-growth",
  "https://www.bankofengland.co.uk/financial-stability/boe-system-wide-exploratory-scenario-exercise/boe-swes-exercise-final-report",
  "https://www.bankofengland.co.uk/asset-purchase-facility/2022/2022-q4",
  "https://www.ecb.europa.eu/press/annual-reports-financial-statements/annual/html/ecb.ar2024~8402d8191f.fr.html"
];
const slug = 'dette-etats-07-dernier-acheteur';
const pages = ['fr','en'].map(lang => ({ lang, html: readFileSync(new URL(`../dist/${lang==='fr'?'posts':'en/analysis'}/${slug}/index.html`,import.meta.url),'utf8') }));
const nodes = n => [n,...(n.childNodes??[]).flatMap(nodes)];
const attr = (n,k) => n.attrs?.find(a=>a.name===k)?.value;
const text = n => n.nodeName==='#text'?n.value:(n.childNodes??[]).map(text).join('');
function sources(html) {
  const tree = parse(html);
  const items = nodes(tree).filter(n=>n.tagName==='li'&&/^source-\d{2}$/.test(attr(n,'id')??''));
  assert.equal(items.length,23);
  assert.deepEqual(items.map(n=>attr(n,'id')),urls.map((_,i)=>`source-${String(i+1).padStart(2,'0')}`));
  for(const [i,item] of items.entries()){
    const links=nodes(item).filter(n=>n.tagName==='a');assert.equal(links.length,1,attr(item,'id'));
    assert.equal(attr(links[0],'class'),'source-url');assert.equal(attr(links[0],'href'),urls[i]);assert.equal(text(links[0]),urls[i]);
    assert.equal(attr(links[0],'rel'),'noopener noreferrer');assert.ok(text(item).length>urls[i].length);
  }
  return tree;
}
test('compiled FR/EN bibliographies contain exactly one complete canonical link per source',()=>{for(const p of pages)sources(p.html);});
test('source-field validation rejects domain, path, encoding, protocol, duplicate and missing-link substitutions',()=>{
  const html=pages[0].html,original=urls[0],url=new URL(original);
  const invalid=[original+'#hidden',original+'?alias=1',original+'/',original.replace('https:','http:'),original.replace(url.hostname,url.hostname+'.example.org'),original.replace('https://','https://user@'),original.replace('https://','https://example.org/'),original.replace('/monetarypolicy/','/%6Donetarypolicy/'),'javascript:alert(1)',' '+original];
  for(const value of invalid){const altered=html.replace(`href="${original}"`,`href="${value}"`);assert.notEqual(altered,html);assert.throws(()=>sources(altered));}
  const link=`<a class="source-url" href="${original}" rel="noopener noreferrer">${original}</a>`;
  assert.ok(html.includes(link));assert.throws(()=>sources(html.replace(link,link+link)));assert.throws(()=>sources(html.replace(link,'')));
});
test('compiled figures retain native XML attributes, descriptions and responsive root style',()=>{
  for(const {html,lang} of pages){
    const all=nodes(parse(html)),svg=all.filter(n=>n.tagName==='svg'&&attr(n,'lang')===lang&&attr(n,'aria-labelledby')?.startsWith('f7-'));
    assert.equal(svg.length,12);
    for(const root of svg){assert.equal(attr(root,'role'),'img');assert.equal(attr(root,'style'),'width:100%;height:auto');assert.ok(root.attrs.some(a=>a.name==='viewBox'));const ids=attr(root,'aria-labelledby').split(' ');for(const id of ids){const matches=nodes(root).filter(n=>attr(n,'id')===id);assert.equal(matches.length,1);assert.ok(text(matches[0]).trim());}assert.ok(nodes(root).filter(n=>n.tagName==='text').every(n=>attr(n,'font-family')==='DejaVu Sans,Arial,sans-serif'&&attr(n,'font-size')));}
  }
});
test('the previous episode links to the new investigation in each compiled language route',()=>{
  for(const lang of ['fr','en']){
    const route=lang==='fr'?'posts':'en/analysis';const html=readFileSync(new URL(`../dist/${route}/dette-etats-06-prix-sortie/index.html`,import.meta.url),'utf8');
    assert.ok(nodes(parse(html)).some(n=>n.tagName==='a'&&attr(n,'href')===`/${route}/${slug}/`));
  }
});
