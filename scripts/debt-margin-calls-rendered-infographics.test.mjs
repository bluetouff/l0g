import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parse } from 'parse5';

const urls = [
  "https://www.bankofengland.co.uk/-/media/boe/files/letter/2022/october/letter-from-jon-cunliffe-ldi-5-october-2022.pdf",
  "https://www.bankofengland.co.uk/financial-stability-report/2022/december-2022",
  "https://publications.parliament.uk/pa/cm5803/cmselect/cmworpen/826/report.html",
  "https://www.fsb.org/uploads/P101224-1.pdf",
  "https://www.bis.org/publications/transparency-and-responsiveness-initial-margin-centrally-cleared-markets-review-and-policy-proposals",
  "https://www.lseg.com/en/post-trade/clearing/collateral-management/ltd-collateral-management/ltd-acceptable-collateral/ltd-acceptable-cash",
  "https://www.bis.org/publications/streamlining-variation-margin-centrally-cleared-markets-examples-effective-practices-final-report.pdf",
  "https://www.thepensionsregulator.gov.uk/en/document-library/scheme-management-detailed-guidance/funding-and-investment-detailed-guidance/liability-driven-investment",
  "https://www.fca.org.uk/publications/multi-firm-reviews/further-guidance-enhancing-resilience-liability-driven-investment",
  "https://www.bankofengland.co.uk/financial-policy-summary-and-record/2023/bank-staff-paper-ldi-minimum-resilience",
  "https://www.bankofengland.co.uk/financial-stability/boe-system-wide-exploratory-scenario-exercise/boe-swes-exercise-final-report",
  "https://www.bankofengland.co.uk/financial-policy-committee-record/2026/april-2026",
  "https://www.thepensionsregulator.gov.uk/en/document-library/statements/annual-funding-statement-2026",
  "https://www.bis.org/publications/cpmi-iosco-consultation-updated-guidance-and-public-disclosures-implement-initial-margin-proposals",
  "https://www.bankofengland.co.uk/financial-policy-committee-record/2026/september-2026",
  "https://www.federalreserve.gov/econres/notes/feds-notes/proportionate-margining-for-repo-transactions-20250214.html",
  "https://www.bankofengland.co.uk/paper/2025/discussion-paper/enhancing-the-resilience-of-the-gilt-repo-market",
  "https://www.centralbank.ie/publication/research-publications/staff-insights/an-update-on-the-size-and-resilience-of-the-irish-gbp-ldi-fund-cohort"
];
const slug = 'dette-etats-05-appels-marge';
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
  const invalid=[original+'#hidden',original+'?alias=1',original+'/',original.replace('https:','http:'),original.replace(url.hostname,url.hostname+'.example.org'),original.replace('https://','https://user@'),original.replace('https://','https://example.org/'),original.replace('/-/','/%2D/'),'javascript:alert(1)',' '+original];
  for(const value of invalid){const altered=html.replace(`href="${original}"`,`href="${value}"`);assert.notEqual(altered,html);assert.throws(()=>sources(altered));}
  const link=`<a class="source-url" href="${original}" rel="noopener noreferrer">${original}</a>`;
  assert.ok(html.includes(link));assert.throws(()=>sources(html.replace(link,link+link)));assert.throws(()=>sources(html.replace(link,'')));
});
test('compiled figures retain native XML attributes, descriptions and responsive root style',()=>{
  for(const {html,lang} of pages){
    const all=nodes(parse(html)),svg=all.filter(n=>n.tagName==='svg'&&attr(n,'lang')===lang&&attr(n,'aria-labelledby')?.startsWith('d5-'));
    assert.equal(svg.length,12);
    for(const root of svg){assert.equal(attr(root,'role'),'img');assert.equal(attr(root,'style'),'width:100%;height:auto');assert.ok(root.attrs.some(a=>a.name==='viewBox'));const ids=attr(root,'aria-labelledby').split(' ');for(const id of ids){const matches=nodes(root).filter(n=>attr(n,'id')===id);assert.equal(matches.length,1);assert.ok(text(matches[0]).trim());}assert.ok(nodes(root).filter(n=>n.tagName==='text').every(n=>attr(n,'font-family')==='Arial, Helvetica, sans-serif'&&attr(n,'font-size')));}
  }
});
test('the previous episode links to the new investigation in each compiled language route',()=>{
  for(const lang of ['fr','en']){
    const route=lang==='fr'?'posts':'en/analysis';const html=readFileSync(new URL(`../dist/${route}/dette-etats-04-chaine-garanties/index.html`,import.meta.url),'utf8');
    assert.ok(nodes(parse(html)).some(n=>n.tagName==='a'&&attr(n,'href')===`/${route}/${slug}/`));
  }
});
