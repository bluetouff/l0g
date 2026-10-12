import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parse } from 'parse5';

const pages=['fr','en'].map(lang=>({lang,html:readFileSync(new URL(`../dist/${lang==='fr'?'posts':'en/analysis'}/dollar-facture-energie/index.html`,import.meta.url),'utf8')}));
const nodes=n=>[n,...(n.childNodes??[]).flatMap(nodes)];
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const text=n=>n.nodeName==='#text'?n.value:(n.childNodes??[]).map(text).join('');
// Derived from attached assets/svg originals, independently of Astro output.
// Figure-05 cost labels retain their fields, with ink on each grey cost band.
const originals={
  "ep-01-en-d": {
    "hash": "d6ed641a0797a801c95f900402b08f80ff5dccacb890f3b981b809610fe9c1c1",
    "viewBox": "0 0 1120 1033"
  },
  "ep-01-en-m": {
    "hash": "8812c9e6990f5508529d4f92b09befd52e6aff411dcc8bdedcc011e49b996e28",
    "viewBox": "0 0 440 1034"
  },
  "ep-01-fr-d": {
    "hash": "3327cbdecd0e07a39f8c3ef6d6c5cedb5ea5cc8361d44d0f5eafbd24a02065ff",
    "viewBox": "0 0 1120 1033"
  },
  "ep-01-fr-m": {
    "hash": "2bc79dda45c778d048a349a50ebdb648a80b6d74cb02eeca2937712513e17f6d",
    "viewBox": "0 0 440 1058"
  },
  "ep-02-en-d": {
    "hash": "a1ea2b54dca0954b6884da9512b7cb0acf77fdfbb3cc089841746dd29382bfb1",
    "viewBox": "0 0 1120 1003"
  },
  "ep-02-en-m": {
    "hash": "b0dd612750ca62166dae8dc76f34dd6320162888cfae61b38065b1c58ae2450c",
    "viewBox": "0 0 440 1103"
  },
  "ep-02-fr-d": {
    "hash": "88a1bb112bee7fc5cc05f68643b95207ca9a46798b3cb2986ac3f753337d24ad",
    "viewBox": "0 0 1120 1024"
  },
  "ep-02-fr-m": {
    "hash": "a8d1c839f6bd94506f21bb26c02d7392a9f5ab7cc2432c48c4bec54700450bfb",
    "viewBox": "0 0 440 1103"
  },
  "ep-03-en-d": {
    "hash": "5790a49ca7f8347814365c3503de59fd9677be89ba4662787e5e85eea24b32f5",
    "viewBox": "0 0 1120 956"
  },
  "ep-03-en-m": {
    "hash": "c2e82dcefd0f3e3f6996579c61b77114ae1a672ebb5f46e3dc9db60099eb1562",
    "viewBox": "0 0 440 1345"
  },
  "ep-03-fr-d": {
    "hash": "56c53a92f51a9e1941bba33dc2380cde356ad18f8bcea5ad5af1f18482351f8c",
    "viewBox": "0 0 1120 980"
  },
  "ep-03-fr-m": {
    "hash": "6caed11354acdf3ad1f8e892c7650eb04fd639309c515be16c946c9fd170a174",
    "viewBox": "0 0 440 1386"
  },
  "ep-04-en-d": {
    "hash": "68f58b1da0db73006d8644009507cdc2fd9e7271f307ef990f930a1181d6d42a",
    "viewBox": "0 0 1120 1102"
  },
  "ep-04-en-m": {
    "hash": "27fada65d1f65854272159c2da47f09a849f72aece586cfe3025c5a011015d85",
    "viewBox": "0 0 440 1494"
  },
  "ep-04-fr-d": {
    "hash": "39782b30089499fa89ffe760b45e8199a197f4e887eb81aab08a76c485303327",
    "viewBox": "0 0 1120 1122"
  },
  "ep-04-fr-m": {
    "hash": "1e7697d298b879153b17acae6ebf06e8a94b0171d92b39fb421f8c99c3118eb4",
    "viewBox": "0 0 440 1517"
  },
  "ep-05-en-d": {
    "hash": "035c363abf810207ae3d0f738ddab7b53d6b82f645c52783bd4092d124b8c964",
    "viewBox": "0 0 1120 1009"
  },
  "ep-05-en-m": {
    "hash": "f0f13e0fc76b9f1b858d89129212fcdcec9684162a6c657ec7d9bddddfa74a7e",
    "viewBox": "0 0 440 1520"
  },
  "ep-05-fr-d": {
    "hash": "5035fccaa264d01f690f45e30a419c3ea583ebe6ca89d711333f3c718881bec8",
    "viewBox": "0 0 1120 1029"
  },
  "ep-05-fr-m": {
    "hash": "b89403d6efe69f1458f05a0d73ec0d32bb6d2f9e5675ce5f8edbdc810c79c08a",
    "viewBox": "0 0 440 1543"
  },
  "ep-06-en-d": {
    "hash": "1eea225fbc552778f82d028bb1f3a0ad6e4b23a8a224cb31fe45d522541178a2",
    "viewBox": "0 0 1120 990"
  },
  "ep-06-en-m": {
    "hash": "cf4777f0d861fbe98be2427a72570ce1bb575c01d72cc502120bc73a7fc10648",
    "viewBox": "0 0 440 1368"
  },
  "ep-06-fr-d": {
    "hash": "99ee63454edd4efffe69fa1f90d9f3fa36efadeaade86e7d9e578cb2dd7a2736",
    "viewBox": "0 0 1120 990"
  },
  "ep-06-fr-m": {
    "hash": "ccdc850fd48fb33af4d3194b05b0689fd514c82797ce82846e84f4fba181fff0",
    "viewBox": "0 0 440 1344"
  }
};
const urls=[
  "https://www.reuters.com/business/euro-skids-toward-fifth-weekly-fall-selling-pressure-slows-2026-10-09/",
  "https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/eurofxref-graph-usd.en.html",
  "https://www.eia.gov/dnav/pet/hist/RBRTED.htm",
  "https://fred.stlouisfed.org/series/DCOILBRENTEU",
  "https://www.eia.gov/dnav/pet/TblDefs/pet_pri_spt_tbldef2.asp",
  "https://ec.europa.eu/eurostat/en/web/products-eurostat-news/w/wdn-20260318-1",
  "https://www.ice.com/products/27996665",
  "https://www.bde.es/wbe/es/publicaciones/analisis-economico-investigacion/documentos-ocasionales/exchange-rate-passthrough-euro-area-and-eu-countries.html",
  "https://www.ecb.europa.eu/press/financial-stability-publications/fsr/special/html/ecb.fsrart202211_01~173476301a.en.html",
  "https://www.globenewswire.com/news-release/2026/07/30/3335784/0/en/Air-France-KLM-Q2-2026-Results.html",
  "https://www.safran-group.com/pressroom/safran-reports-its-first-half-2026-results-2026-07-28",
  "https://energy.ec.europa.eu/data-and-analysis/weekly-oil-bulletin_en",
  "https://www.tresor.economie.gouv.fr/Articles/2022/12/07/repartition-des-pertes-dues-a-la-degradation-des-termes-de-l-echange-energetiques",
  "https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.fr.html",
  "https://www.ecb.europa.eu/press/inter/date/2026/html/ecb.in261006~bc94400297.en.html",
  "https://www.cftc.gov/LearnAndProtect/EducationCenter/economicpurpose"
];
function canonical(n,root=false){
  if(n.nodeName==='#text')return ['#text',n.value];
  const attributes=(n.attrs??[]).filter(a=>!root||!['width','height','lang','style'].includes(a.name)).map(a=>[a.name,a.value]).sort(([a],[b])=>a<b?-1:a>b?1:0);
  return [n.tagName,attributes,(n.childNodes??[]).filter(c=>c.nodeName!=='#text'||c.value.trim()||['text','title','desc'].includes(n.tagName)).map(c=>canonical(c))];
}
function figures(tree,lang){
  const found=nodes(tree).filter(n=>n.tagName==='svg'&&attr(n,'lang')===lang&&attr(n,'aria-labelledby')?.startsWith('ep-'));
  assert.equal(found.length,12);
  for(const [i,root] of found.entries()){
    const key=`ep-${String(Math.floor(i/2)+1).padStart(2,'0')}-${lang}-${i%2?'m':'d'}`;
    assert.deepEqual((root.attrs??[]).map(a=>[a.name,a.value]).sort(([a],[b])=>a<b?-1:a>b?1:0),Object.entries({xmlns:'http://www.w3.org/2000/svg',viewBox:originals[key].viewBox,role:'img','aria-labelledby':`${key}-title ${key}-desc`,lang,style:'width:100%;height:auto'}).sort(([a],[b])=>a<b?-1:a>b?1:0));
    const hash=createHash('sha256').update(JSON.stringify(canonical(root,true))).digest('hex');assert.equal(hash,originals[key].hash,key);
    for(const type of ['title','desc']){const selected=nodes(root).filter(n=>n.tagName===type);assert.equal(selected.length,1);assert.equal(attr(selected[0],'id'),`${key}-${type}`);assert.ok(text(selected[0]).trim());}
    for(const label of nodes(root).filter(n=>n.tagName==='text')){assert.equal(attr(label,'font-family'),'DejaVu Sans, Arial, sans-serif');assert.equal(attr(label,'dominant-baseline'),'hanging');}
  }
  return found;
}
const supplementalSources={
  fr:[['https://www.marketscreener.com/news/euro-skids-toward-fifth-weekly-fall-but-selling-pressure-slows-ce785ddfdf88f423','reprise publiée par MarketScreener'],['https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/usd.xml','fichier XML SDMX officiel']],
  en:[['https://www.marketscreener.com/news/euro-skids-toward-fifth-weekly-fall-but-selling-pressure-slows-ce785ddfdf88f423','MarketScreener republication'],['https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/usd.xml','official SDMX XML file']],
};
function sourceFields(tree,lang='fr'){
  const all=nodes(tree),sections=all.filter(n=>n.tagName==='section'&&/^source-s\d{2}$/u.test(attr(n,'id')??''));
  assert.deepEqual(sections.map(n=>attr(n,'id')),urls.map((_,i)=>`source-s${String(i+1).padStart(2,'0')}`));
  for(const [i,section] of sections.entries()){
    const primary=nodes(section).filter(n=>n.tagName==='a'&&attr(n,'class')==='ep-url');
    assert.deepEqual(primary.map(n=>[attr(n,'href'),text(n),attr(n,'rel'),attr(n,'target')]),[[urls[i],urls[i],'noopener noreferrer','_blank']]);
    const expected=[[urls[i],urls[i],'noopener noreferrer','_blank']];if(i<2)expected.push([...supplementalSources[lang][i],'noopener noreferrer','_blank']);
    assert.deepEqual(nodes(section).filter(n=>n.tagName==='a').map(n=>[attr(n,'href'),text(n),attr(n,'rel'),attr(n,'target')]),expected);
    assert.ok(text(section).length>urls[i].length);
    const id=`source-s${String(i+1).padStart(2,'0')}`;assert.ok(all.some(n=>n.tagName==='a'&&attr(n,'href')===`#${id}`));
  }
}
function changeAttribute(n,key,value){const found=n.attrs.find(a=>a.name===key);assert.ok(found);found.value=value;}
function freshPrimary(){const tree=parse(pages[0].html);const section=nodes(tree).find(n=>attr(n,'id')==='source-s01');const link=nodes(section).find(n=>n.tagName==='a'&&attr(n,'class')==='ep-url');assert.ok(link);return {tree,section,link};}

test('compiled FR/EN retain complete original SVG geometry, text, palette and native XML attributes',()=>{for(const page of pages)figures(parse(page.html),page.lang);});
test('compiled bibliographies keep complete canonical links and explicitly verified supplemental sources',()=>{for(const page of pages)sourceFields(parse(page.html),page.lang);});
test('canonical source fields reject origin, protocol, path, encoding, query, credentials and text mutations',()=>{
  const original=urls[0],url=new URL(original);
  const changes=[original+'#hidden',original+'?alias=1',original+'/',original.replace('https:','http:'),original.replace(url.hostname,url.hostname+'.example.org'),original.replace('https://','https://user@'),original.replace('https://','https://example.org/'),original.replace('/business/','/%62usiness/'),'javascript:alert(1)',' '+original];
  for(const value of changes){assert.notEqual(value,original);const {tree,link}=freshPrimary();changeAttribute(link,'href',value);assert.throws(()=>sourceFields(tree));}
  for(const value of ['https://example.org/','',original+' extra']){const {tree,link}=freshPrimary();link.childNodes=[{nodeName:'#text',value}];assert.throws(()=>sourceFields(tree));}
  for(const field of ['rel','target','class']){const {tree,link}=freshPrimary();changeAttribute(link,field,'incorrect');assert.throws(()=>sourceFields(tree));}
});
test('canonical source validation rejects duplicate, absent and relabelled primary links',()=>{
  const a=freshPrimary();a.section.childNodes.push({nodeName:'a',tagName:'a',attrs:a.link.attrs.map(x=>({...x})),childNodes:[{nodeName:'#text',value:urls[0]}]});assert.throws(()=>sourceFields(a.tree));
  const b=freshPrimary();b.link.attrs=b.link.attrs.filter(x=>x.name!=='class');assert.throws(()=>sourceFields(b.tree));
  const c=freshPrimary();changeAttribute(c.section,'id','source-s99');assert.throws(()=>sourceFields(c.tree));
});
test('compiled accessible SVG checks reject native-attribute loss, paint changes and geometry substitutions',()=>{
  for(const field of ['viewBox','role','style','aria-labelledby','lang']){const tree=parse(pages[0].html);const root=nodes(tree).find(n=>n.tagName==='svg'&&attr(n,'lang')==='fr'&&attr(n,'aria-labelledby')?.startsWith('ep-'));changeAttribute(root,field,'incorrect');assert.throws(()=>figures(tree,'fr'));}
  for(const [field,value] of [['font-family','Arial'],['dominant-baseline','auto'],['x','0'],['fill','var(--color-surface)']]){const tree=parse(pages[0].html);const root=nodes(tree).find(n=>n.tagName==='svg'&&attr(n,'lang')==='fr'&&attr(n,'aria-labelledby')?.startsWith('ep-'));const label=nodes(root).find(n=>n.tagName==='text');changeAttribute(label,field,value);assert.throws(()=>figures(tree,'fr'));}
});
