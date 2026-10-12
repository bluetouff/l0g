import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parse } from 'parse5';

const urls = [
  "https://www.treasurydirect.gov/instit/annceresult/press/preanre/2025/R_20250409_2.pdf",
  "https://www.treasurydirect.gov/instit/annceresult/press/preanre/2025/R_20250312_2.pdf",
  "https://libertystreeteconomics.newyorkfed.org/2026/04/treasury-market-liquidity-since-april-2025/",
  "https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-86",
  "https://www.bankofengland.co.uk/-/media/boe/files/working-paper/2024/fire-sales-of-safe-assets.pdf",
  "https://www.bankofengland.co.uk/working-paper/2023/an-anatomy-of-the-2022-gilt-market-crisis",
  "https://www.bankofengland.co.uk/financial-stability/boe-system-wide-exploratory-scenario-exercise/boe-swes-exercise-final-report",
  "https://www.newyorkfed.org/newsevents/speeches/2025/per250509",
  "https://libertystreeteconomics.newyorkfed.org/2014/05/treasury-term-premia-1961-present/",
  "https://www.aft.gouv.fr/fr",
  "https://www.aft.gouv.fr/fr/oat-tec-10",
  "https://www.aft.gouv.fr/fr/publications/communiques-presse/29092026-besoins-et-ressources-financement-letat-en-2027-et-point",
  "https://www.senat.fr/rap/l25-139-312/l25-139-312_mono.html",
  "https://www.aft.gouv.fr/fr/principaux-chiffres-budget-etat",
  "https://www.imf.org/-/media/websites/imf/imported-full-text-pdf/external/np/pp/eng/2014/_040114.pdf",
  "https://www.imf.org/en/blogs/articles/2026/10/06/hedge-funds-improve-market-functioning-but-can-also-amplify-stress",
  "https://www.mfaalts.org/statement/mfa-statement-on-imf-report-on-hedge-funds-and-financial-stability/",
  "https://www.federalreserve.gov/publications/April-2025-financial-stability-report-Asset-Valuations.htm"
];
const slug = 'dette-etats-06-prix-sortie';
const pages = ['fr','en'].map(lang => ({ lang, html: readFileSync(new URL(`../dist/${lang==='fr'?'posts':'en/analysis'}/${slug}/index.html`,import.meta.url),'utf8') }));
const nodes = n => [n,...(n.childNodes??[]).flatMap(nodes)];
const attr = (n,k) => n.attrs?.find(a=>a.name===k)?.value;
const text = n => n.nodeName==='#text'?n.value:(n.childNodes??[]).map(text).join('');
function sources(html) {
  const tree = parse(html);
  const items = nodes(tree).filter(n=>n.tagName==='li'&&/^source-\d{2}$/.test(attr(n,'id')??''));
  assert.equal(items.length,18);
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
  const invalid=[original+'#hidden',original+'?alias=1',original+'/',original.replace('https:','http:'),original.replace(url.hostname,url.hostname+'.example.org'),original.replace('https://','https://user@'),original.replace('https://','https://example.org/'),original.replace('/instit/','/%69nstit/'),'javascript:alert(1)',' '+original];
  for(const value of invalid){const altered=html.replace(`href="${original}"`,`href="${value}"`);assert.notEqual(altered,html);assert.throws(()=>sources(altered));}
  const link=`<a class="source-url" href="${original}" rel="noopener noreferrer">${original}</a>`;
  assert.ok(html.includes(link));assert.throws(()=>sources(html.replace(link,link+link)));assert.throws(()=>sources(html.replace(link,'')));
});
test('compiled figures retain native XML attributes, descriptions and responsive root style',()=>{
  for(const {html,lang} of pages){
    const all=nodes(parse(html)),svg=all.filter(n=>n.tagName==='svg'&&attr(n,'lang')===lang&&attr(n,'aria-labelledby')?.startsWith('d6-'));
    assert.equal(svg.length,12);
    for(const root of svg){assert.equal(attr(root,'role'),'img');assert.equal(attr(root,'style'),'width:100%;height:auto');assert.ok(root.attrs.some(a=>a.name==='viewBox'));const ids=attr(root,'aria-labelledby').split(' ');for(const id of ids){const matches=nodes(root).filter(n=>attr(n,'id')===id);assert.equal(matches.length,1);assert.ok(text(matches[0]).trim());}assert.ok(nodes(root).filter(n=>n.tagName==='text').every(n=>attr(n,'font-family')==='Arial, Helvetica, sans-serif'&&attr(n,'font-size')));}
  }
});
test('the previous episode links to the new investigation in each compiled language route',()=>{
  for(const lang of ['fr','en']){
    const route=lang==='fr'?'posts':'en/analysis';const html=readFileSync(new URL(`../dist/${route}/dette-etats-05-appels-marge/index.html`,import.meta.url),'utf8');
    assert.ok(nodes(parse(html)).some(n=>n.tagName==='a'&&attr(n,'href')===`/${route}/${slug}/`));
  }
});
