import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parse } from 'parse5';
const pages=['fr','en'].map(lang=>({lang,html:readFileSync(new URL(`../dist/${lang==='fr'?'posts/detroits-prix-des-jours-gagnes':'en/analysis/shipping-chokepoints-cost-of-buying-time'}/index.html`,import.meta.url),'utf8')}));
const nodes=n=>[n,...(n.childNodes??[]).flatMap(nodes)];
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const text=n=>n.nodeName==='#text'?n.value:(n.childNodes??[]).map(text).join('');
const canonical=n=>n.nodeName==='#text'?['#text',n.value]:[n.tagName,(n.attrs??[]).map(a=>[a.name,a.value]).sort(([a],[b])=>a<b?-1:a>b?1:0),(n.childNodes??[]).filter(c=>c.nodeName!=='#text'||c.value.trim()||['text','tspan','title','desc','metadata','style'].includes(n.tagName)).map(canonical)];
// Full browser-tree goldens computed independently from the supplied passive XML.
const originals={
  "stocks-fr-desktop": {
    "rawHash": "4968630315923ab71622775a1e017f65e267d18a319030136a82b4f674084376",
    "domHash": "28c3a004bc3910414e1a437afc387ac4518d65e26547e482cfb68e11131e20e8",
    "viewBox": "0 0 1100 710"
  },
  "stocks-fr-mobile": {
    "rawHash": "24eb5365700294496ed182a495d07783ad928bcab84da113632e38dfbbac9b32",
    "domHash": "ed8a866b8f56e606250b374d54eef2239dc09aefb997468b0f022f8fdf8a26e0",
    "viewBox": "0 0 420 880"
  },
  "routes-fr-desktop": {
    "rawHash": "738bbb113dbe55e72d7d5dbe2182030bfb307e20e6701d9de98e0efa0bd38d8a",
    "domHash": "d2be0d1d0b8582918866ab331183b1d510b9652e87a1c29ba6da72eac07731be",
    "viewBox": "0 0 1100 1020"
  },
  "routes-fr-mobile": {
    "rawHash": "528e687f131523649dd189e0a111a3ece9b8a194156ac78474da0f7392855ed5",
    "domHash": "694d7020e619071930a0cb1af3abf39ed672dcfbd4982a7c85c9cabe21bbd5bd",
    "viewBox": "0 0 420 1380"
  },
  "transport-fr-desktop": {
    "rawHash": "8a4318bda54a7eaaf873ca947a50f732a89cacae7715745604d42ef5e2bc73c6",
    "domHash": "4c7ecf94100d45c2c667ac7c2c5e6c40a3cad055892350c23d3fb2a24ce4ecd7",
    "viewBox": "0 0 1100 830"
  },
  "transport-fr-mobile": {
    "rawHash": "b3d2f373d6610ae80b5b37687589212ac2193f40adc1594b1c9f56079df29e6f",
    "domHash": "92f3b245cbdd5e4dc08930a574290273be93e0a82324da4cd9ef0f570e386d2f",
    "viewBox": "0 0 420 1110"
  },
  "inventory-fr-desktop": {
    "rawHash": "4d033f82e9a1d4d7c0d4fb21a8edaf4199cfe1792d9f0305557f92474334cb5f",
    "domHash": "b81fa0b50a95aed15d075c02d276c1e7fd76e696f92e147345b3a6a84d323fc5",
    "viewBox": "0 0 1100 900"
  },
  "inventory-fr-mobile": {
    "rawHash": "0a79766f32ee68241b6d08eea5273db8dd63a2c532c5e113cb232919835bb68b",
    "domHash": "c68d43018207f6f7d6c65986210fb208101762af67243326b913e7585bd2cc98",
    "viewBox": "0 0 420 1100"
  },
  "financing-fr-desktop": {
    "rawHash": "29d6753d15428d615f45dc84df2b0d30de0d293cbf0ea3481f93b29b43229626",
    "domHash": "1244d9985913188cca7321cff9a4543baa6de347dbaf12d7f72f9ea6fa65fec8",
    "viewBox": "0 0 1100 860"
  },
  "financing-fr-mobile": {
    "rawHash": "47ccf9ae849f41a92a4b02169e29f52d47b3873eec26b5e599f84ff6a8e46f04",
    "domHash": "3d98594464a2c4c427b75bd60b2a87ea61a04d7a8a5f26b9542ea158b854e84f",
    "viewBox": "0 0 420 1170"
  },
  "liquidity-fr-desktop": {
    "rawHash": "a3a9ddd37d58bd21b2b1f677a4ff1c09ccfc4230b22e2b1decc5c58d986792ed",
    "domHash": "294729568f914466a041abcb720fd4ad37e40f6cfc4f9b91ae5847af75655aa9",
    "viewBox": "0 0 1100 1010"
  },
  "liquidity-fr-mobile": {
    "rawHash": "358525922032d23d1e246706916c8559e12514ab5af8029df604e7775dc9515c",
    "domHash": "3e7703b6d1dc886717b6f16cc451c7482b0fbf1bd9b0d58601fba8791749dac7",
    "viewBox": "0 0 420 1250"
  },
  "stocks-en-desktop": {
    "rawHash": "f3c3a33c2971f60f547cf67f15c1dc7002dd7cf75bc42e1776ed12431d1e9009",
    "domHash": "45514d0686fd42e3c3edf79197d24a8e38ee0cd1e861aab549b88c41c5280d31",
    "viewBox": "0 0 1100 710"
  },
  "stocks-en-mobile": {
    "rawHash": "5917a8d9dfa54e63c0cf65a4181bb58bdd63b41bd920f08b694415ec3fec9de1",
    "domHash": "9f782da1fb90667e642bb7f87ed1dc11979802f9ba8c2f47c3e994bca802209b",
    "viewBox": "0 0 420 880"
  },
  "routes-en-desktop": {
    "rawHash": "5a93426eea3efab874dc8733057da04627fe065c8354b468b9b30a973d93f006",
    "domHash": "473d9cedc0b3600457439c33b1fd851f7967ffb65fe8a2ae5299aab90bb24b7b",
    "viewBox": "0 0 1100 1020"
  },
  "routes-en-mobile": {
    "rawHash": "0e4c34a68b45e67cb533c871eca9f7b59eb4888551bf2ba04e89b1878e648920",
    "domHash": "7ad8d151663502e5001d86bf0ba751ff73a8f4cfe1fa3612e497088fc929dbf3",
    "viewBox": "0 0 420 1380"
  },
  "transport-en-desktop": {
    "rawHash": "9fd5bb20e6b58ce0d7502bacac4857de706faef4b992ca755c4764849ba72ad5",
    "domHash": "626f3a56e95f09ce2bf9da26d073603cfbb273ff851d02a9318495d7a95cdc2e",
    "viewBox": "0 0 1100 830"
  },
  "transport-en-mobile": {
    "rawHash": "33a4bb55d867a5d4861dead4a44065423186fe7b8cf6349f9eb69175e90fbc6c",
    "domHash": "f873a0da07db894349495223bbfd8eeed643630baa5d01d8ad9c5541dde35688",
    "viewBox": "0 0 420 1110"
  },
  "inventory-en-desktop": {
    "rawHash": "7e837dfce413daa8ce987837f264952670bb3151d3659919672372215fdd5590",
    "domHash": "1506de1729e0d31b3ad0c13275091a5842e5066816cd0e1c5cdcbef9eea00bc2",
    "viewBox": "0 0 1100 900"
  },
  "inventory-en-mobile": {
    "rawHash": "0f7636aceecdf8dc7eeab1d7fbaa7b1ba3e04c45a4f87aa9a3f19e09be803f9f",
    "domHash": "7a65e47996751b0b926c652ba16bd90b5162af29850b749481876d6e4ce30a2b",
    "viewBox": "0 0 420 1100"
  },
  "financing-en-desktop": {
    "rawHash": "baa82161eb23f0eb1bb446f04f9ead57280ee106b6f60aab71a59a7870b93b5b",
    "domHash": "e5f19829c6e84233fbee7d2dd60bf0a6d4a162b3b469256fc28cc663bcf491e1",
    "viewBox": "0 0 1100 860"
  },
  "financing-en-mobile": {
    "rawHash": "5891067be150aaa0d3b6cccd0266cbe61be71302dfa517d8655ad1853cfcbcfc",
    "domHash": "513c2b4825d4ef12c176918d13a7a416bd904bb417907e39baef9ce4bff90ffc",
    "viewBox": "0 0 420 1170"
  },
  "liquidity-en-desktop": {
    "rawHash": "0799b6436903b89e3d9279c6c2b723bd8e4c6e2a59b0a37063b0f996c2362e93",
    "domHash": "bb7cc010fb6e1ff3a21efccab3b986dcbbe7e44cb3cb7f06bdf2624f6842cd2e",
    "viewBox": "0 0 1100 1010"
  },
  "liquidity-en-mobile": {
    "rawHash": "706613485e0a2c52e842358831ac711451aab4459838924d28b23352c8f6f685",
    "domHash": "29e1e1956535670337a11201340ca30a486df46e83438609562ade8ca5ec8ba8",
    "viewBox": "0 0 420 1250"
  }
};
const baselineCorrections = {"liquidity-en-mobile": {"key": "liquidity-en-mobile", "before": "<text x=\"24\" y=\"1131\" font-size=\"23\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"24\" dy=\"0\">More credit ≠ more activity</tspan></text>", "after": "<text x=\"24\" y=\"1120\" font-size=\"23\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"24\" dy=\"0\">More credit ≠ more activity</tspan></text>", "originalHash": "706613485e0a2c52e842358831ac711451aab4459838924d28b23352c8f6f685", "expectedHash": "8fcc9555e3a94892ef5cb256458a5249f0290bf1ef1c5d497e05af2d89f35287", "expectedDomHash": "7ad9ad10f0838965a637b16f9485415a9f0c66aa7609aef8c72e892d3157daa8"}, "liquidity-fr-mobile": {"key": "liquidity-fr-mobile", "before": "<text x=\"24\" y=\"1131\" font-size=\"23\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"24\" dy=\"0\">Crédit accru ≠ activité accrue</tspan></text>", "after": "<text x=\"24\" y=\"1120\" font-size=\"23\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"24\" dy=\"0\">Crédit accru ≠ activité accrue</tspan></text>", "originalHash": "358525922032d23d1e246706916c8559e12514ab5af8029df604e7775dc9515c", "expectedHash": "d745c6d7e43c39d394f048d3de68872753bcc1f642cdf053aa56a5d110bb64d0", "expectedDomHash": "6c580230dc2900c840bf847d3980f349c326ea7dbb73406d77ba9c415c78e560"}};
const kinds=['stocks','routes','transport','inventory','financing','liquidity'];
const references={stocks:[2],routes:[3,6,11],transport:[4],inventory:[],financing:[14],liquidity:[1,14,15]};
const classes=(n,name)=>(attr(n,'class')??'').split(/\s+/u).includes(name);
function figures(tree,lang){
 const all=nodes(tree),selected=all.filter(n=>n.tagName==='figure'&&classes(n,'straits-figure'));assert.equal(selected.length,6);
 for(const[i,figure]of selected.entries()){
  assert.deepEqual(['id','data-figure','data-kind'].map(k=>attr(figure,k)),[`figure-${i+1}`,String(i+1).padStart(2,'0'),kinds[i]]);
  const roots=nodes(figure).filter(n=>n.tagName==='svg');assert.equal(roots.length,2);
  for(const[j,root]of roots.entries()){
   const key=`${kinds[i]}-${lang}-${j?'mobile':'desktop'}`,prefix=`det-f${String(i+1).padStart(2,'0')}-${lang}-${j?'m':'d'}`;
   assert.deepEqual(root.attrs.map(a=>[a.name,a.value]).sort(([a],[b])=>a<b?-1:a>b?1:0),Object.entries({xmlns:'http://www.w3.org/2000/svg',id:prefix,class:'l0g-det-svg',viewBox:originals[key].viewBox,role:'img','aria-labelledby':`${prefix}-title ${prefix}-desc`,style:'width:100%;height:auto'}).sort(([a],[b])=>a<b?-1:a>b?1:0));
   // Remove only the already-asserted exact root responsive style; compare every remaining original field and child.
   const projection={...root,attrs:root.attrs.filter(a=>a.name!=='style')};
   const hash=createHash('sha256').update(JSON.stringify(canonical(projection))).digest('hex');assert.equal(hash,(baselineCorrections[key]?.expectedDomHash??originals[key].domHash),`${key}: all native geometry, text, metadata, stylesheet, markers and child order`);
   assert.ok(classes(root.parentNode,`straits-${j?'mobile':'desktop'}`));
   for(const type of ['title','desc']){const found=nodes(root).filter(n=>n.tagName===type);assert.equal(found.length,1);assert.equal(attr(found[0],'id'),`${prefix}-${type}`);assert.ok(text(found[0]).trim());}
  }
  const caption=nodes(figure).filter(n=>n.tagName==='figcaption');assert.equal(caption.length,1);assert.ok(text(caption[0]).length>70);
  const links=nodes(caption[0]).filter(n=>n.tagName==='a');assert.deepEqual(links.map(n=>[attr(n,'href'),text(n)]),references[kinds[i]].map(n=>[`#source-${n}`,`[${n}]`]));
  for(const id of references[kinds[i]])assert.equal(all.filter(n=>attr(n,'id')===`source-${id}`).length,1);
  const details=nodes(figure).filter(n=>n.tagName==='details');assert.equal(details.length,1);assert.equal(nodes(details[0]).filter(n=>n.tagName==='summary').length,1);assert.ok(text(details[0]).length>100);
 }
 const ids=all.map(n=>attr(n,'id')).filter(Boolean);assert.equal(new Set(ids).size,ids.length,'Every document ID remains unique');
}
function setAttribute(n,k,value){const a=n.attrs.find(a=>a.name===k);if(a)a.value=value;else n.attrs.push({name:k,value});}
test('compiled FR/EN preserve22 full originals and the two exact corrected baselines and six accessible figures each',()=>{for(const page of pages)figures(parse(page.html),page.lang);});
test('compiled SVG checks detect changed native geometry, labels, styles and active nodes',()=>{
 const pick=tree=>nodes(tree).find(n=>n.tagName==='svg'&&attr(n,'id')==='det-f01-fr-d');
 for(const field of ['id','viewBox','role','aria-labelledby','style']){const tree=parse(pages[0].html);setAttribute(pick(tree),field,'changed');assert.throws(()=>figures(tree,'fr'));}
 {const tree=parse(pages[0].html);pick(tree).attrs=pick(tree).attrs.filter(a=>a.name!=='style');assert.throws(()=>figures(tree,'fr'));}
 for(const[field,value]of [['font-family','Arial'],['font-size','1'],['x','0'],['fill','url(https://example.org/x)']]){const tree=parse(pages[0].html),label=nodes(pick(tree)).find(n=>n.tagName==='text');setAttribute(label,field,value);assert.throws(()=>figures(tree,'fr'));}
 for(const type of ['script','foreignObject','image','animate']){const tree=parse(pages[0].html);pick(tree).childNodes.push({nodeName:type,tagName:type,attrs:[],childNodes:[]});assert.throws(()=>figures(tree,'fr'));}
 for(const type of ['tspan','style','metadata','path']){const tree=parse(pages[0].html),n=nodes(pick(tree)).find(n=>n.tagName===type);if(type==='path')setAttribute(n,'d','M0 0 L9999 0');else n.childNodes=[{nodeName:'#text',value:'changed'}];assert.throws(()=>figures(tree,'fr'));}
});
