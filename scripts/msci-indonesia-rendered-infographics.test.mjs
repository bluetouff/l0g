import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parse } from 'parse5';
const pages=['fr','en'].map(lang=>({lang,html:readFileSync(new URL(`../dist/${lang==='fr'?'posts/msci-indonesie-flottant-risque-indices':'en/analysis/msci-indonesia-free-float-index-risk'}/index.html`,import.meta.url),'utf8')}));
const nodes=n=>[n,...(n.childNodes??[]).flatMap(nodes)];
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const text=n=>n.nodeName==='#text'?n.value:(n.childNodes??[]).map(text).join('');
const canonical=n=>n.nodeName==='#text'?['#text',n.value]:[n.tagName,(n.attrs??[]).map(a=>[a.name,a.value]).sort(([a],[b])=>a<b?-1:a>b?1:0),(n.childNodes??[]).filter(c=>c.nodeName!=='#text'||c.value.trim()||['text','tspan','title','desc','metadata','style'].includes(n.tagName)).map(canonical)];
// Full browser-tree goldens computed independently from the supplied passive XML.
const originals={
  "ownership-fr-desktop": {
    "rawHash": "10c57bee2cc679ae04c3faeaa2cbf1e1a28d14031366e6b940452011a83f5c19",
    "domHash": "1bfd4838a98c3a777c1e2acdd846959527d0dc959fba27f6ba45c4fc5f07d2c1",
    "geometryHash": "259a74ac981b2ba7482c07a1ac6862d20b9cf3ae09bbe5f4aa7007d37f4be968",
    "viewBox": "0 0 1100 820"
  },
  "ownership-fr-mobile": {
    "rawHash": "9cf0c901e41b06decf0cd9ed85555ca06297b3a4b913dde3dc76a815ad201b06",
    "domHash": "5b5f9167927e85827fb5521e57e1a412a4716e1274e9286365619614cd6dbf95",
    "geometryHash": "5485d0e88ea8e53f343e08288971c87775e6456c4fcd8e8437697dc806b2acc7",
    "viewBox": "0 0 560 1460"
  },
  "contraction-fr-desktop": {
    "rawHash": "6a107dbb2b6e8b160bd3b43ba1a1d5a9cfec0e18be9b59a2b4c80c28cbc3550f",
    "domHash": "f429cf8dd3c1266b751026494236c0250c0589c6b17a89d00ddb1db41920f4af",
    "geometryHash": "af4fd6ee59a636cf170638c892ea6988d72bbd0d5860501059e142a5b0a613c8",
    "viewBox": "0 0 1100 790"
  },
  "contraction-fr-mobile": {
    "rawHash": "6f93cf8dd0987a6243f97242f2581a3bb353b33d0e95502bff523ef33368eedc",
    "domHash": "17074263aa9555d30f4fdab7ffa3692ef29c46acd008055c00f105664a1dba6c",
    "geometryHash": "b87cd6ca2b4931fac892528e0e4320073cf05d1d718a77baec92bf075cb57195",
    "viewBox": "0 0 560 1120"
  },
  "selling-fr-desktop": {
    "rawHash": "a2b514a1f063eda60c3e4a232abb26c45e10ac8b8e0d2b1a5f070581f5003144",
    "domHash": "f888526595d84d71aac1770a887a97d6f461082a568cf00efa479fc7c586baf3",
    "geometryHash": "40a1651699139b9077e9596123ca0dfaca9e644a078aca313a56a08f88054b1f",
    "viewBox": "0 0 1100 940"
  },
  "selling-fr-mobile": {
    "rawHash": "a534fcee5bc06bf367a82d7b610a24dda9078f75804eb7c555f26852873bb5c4",
    "domHash": "53feb6a5cc4754ef7a383b35c5b3a07138816d0ef164ea6b95d36206ee7a9a4e",
    "geometryHash": "ac0dc417b62304165f9ecd9248d4e1cb7b162b38947a5dd824f36e3ed5ab645e",
    "viewBox": "0 0 560 1430"
  },
  "concentration-fr-desktop": {
    "rawHash": "f7c524c20f2d045d95c1f9b1104e17b200ea867ab38fd249c8fb8a1660012dda",
    "domHash": "947e96c063cbcdb5d3756d3e596faf64a6feb7f22048e6ba1c8a2f68453ab70e",
    "geometryHash": "33351834dfaeb70c99dd8fa2e311d6750d036de179bece2a839b5952608166b2",
    "viewBox": "0 0 1100 865"
  },
  "concentration-fr-mobile": {
    "rawHash": "b0640d9729462c5c7580c58cd21314d1306a2213d5991620e920e478724bae69",
    "domHash": "28fcc8effb6f18e828d7f92f0287e7207480998ac1854caedb3459eba1c0a1ca",
    "geometryHash": "554c10c3a25e253ecea3b1e89a42f62a972ee7ea3f93dca99ee9880b9cfb6a72",
    "viewBox": "0 0 560 1430"
  },
  "calendar-fr-desktop": {
    "rawHash": "ec7c5d9117badc44fb8425fa9a36c4cbc7d798e9f721c1bc224eb37f9691c044",
    "domHash": "4c5c4f765710bea0428e2901ef4dcce974af915318cb2facca538f6f9fa72004",
    "geometryHash": "d3172fad5de7100ed75235c71fe447df38f8dfc8e5322b1b20d5424af7fd09dd",
    "viewBox": "0 0 1100 1060"
  },
  "calendar-fr-mobile": {
    "rawHash": "df0bfc8c6d375375e51386b7130f38f73b105baf5393084b5df42ced37dd62e9",
    "domHash": "842589012dcec9298affd9937e05e1acac745f251faebbd6794409ccc2693b50",
    "geometryHash": "789876369e71397a7d56d6a0cf9db944d853fea889efd1c6a24259fa0e900c9a",
    "viewBox": "0 0 560 1660"
  },
  "ownership-en-desktop": {
    "rawHash": "2d5587eb8dd45f29186501cff063bc689eb40619bb46e5bcef7267ea987a29d8",
    "domHash": "cc6fe0f7b92159096f009a5e4ed3f725cbd101981c8149a4b803e6c3483c078f",
    "geometryHash": "c233b896c9a6f078c5311574586af8f19df49cfee9771f9d2ee20ee2952f8d6b",
    "viewBox": "0 0 1100 820"
  },
  "ownership-en-mobile": {
    "rawHash": "813203ce131edcc7e436a9f0a71968df7bf53e50aa34e2e8d588327decbdb396",
    "domHash": "0f7da5d1f73ed56da72f407c2858c01b1565dbf8dd513126e1ce8a9593ab226d",
    "geometryHash": "823c09a48e78d051e7ab887cf947d040f097f08b0bf162d5810f9d64f6298357",
    "viewBox": "0 0 560 1460"
  },
  "contraction-en-desktop": {
    "rawHash": "3652420533c1e58de855b3cac735ce93a9667a93e2fe6f983fcb76c7e7cb931b",
    "domHash": "2a128f282fb865242a1e3704a5a8b0978072713607064eb487214926f3fa8ddb",
    "geometryHash": "ac21caca2361ff22a22ff3886d017cdd677d8b232a6d2a70dfd90649c6fed52d",
    "viewBox": "0 0 1100 790"
  },
  "contraction-en-mobile": {
    "rawHash": "b95d0a580a828365ba6fd407a879d46b633a7dd63880feb4bf0843170c965f50",
    "domHash": "11ba62abd51de14361e1d7f351d6aea8f4b951933fbe5fb855a4c2587382cb9d",
    "geometryHash": "65509a8e3395511924b9c1803d83c1b8b0f609549d1398800e33252f5929ca7c",
    "viewBox": "0 0 560 1120"
  },
  "selling-en-desktop": {
    "rawHash": "98a0d9bd6f8b5f882978dd996db8d73b9957e012b647963fe90597dbe05d6586",
    "domHash": "35571826b7c1e8a331898582ce4e8a0882e36eb6d2641953b316bcb58f3e78c8",
    "geometryHash": "1b1ddb997f0f8a2186f78d223b1511cf38ae3f3b6aa589b98f6aab0e15fbc1da",
    "viewBox": "0 0 1100 940"
  },
  "selling-en-mobile": {
    "rawHash": "a9047c6fed143e4806420a7874b7c4e6cebee1d4b018dc3d2cc9762fb63707ad",
    "domHash": "4258d311896810f34f7311d5fa434c1c26a06aea1ab593179c1c4358ad1585cf",
    "geometryHash": "9a71b639d79b2e31e190cc0dc8068c25a7306350ccbd12bb09c4bc1ada1b47f3",
    "viewBox": "0 0 560 1430"
  },
  "concentration-en-desktop": {
    "rawHash": "b066c21473d40607a5a3efc99cf7fb6b58102b1e92e882b0ffd72c28998e49e2",
    "domHash": "3f9b754d48396df39dd266fc160a7a7040547e7bc90221e14ac5dd5057451ef2",
    "geometryHash": "e3813e35de098a0c5ec22e779807fc26b7c9cb92f7190cc99fd4641565f97484",
    "viewBox": "0 0 1100 865"
  },
  "concentration-en-mobile": {
    "rawHash": "b61a19d1a8d888a1853e42e4d52ec78229c3535468d5ee4845408f8be2ec431d",
    "domHash": "543e88e76686d79e3ddfce4d041b720b52af096b114137e99e92c07904562cbb",
    "geometryHash": "695c7d2088ce94a2b5a3e9ef33dd2ce3f3192243f0300078670945500134583a",
    "viewBox": "0 0 560 1430"
  },
  "calendar-en-desktop": {
    "rawHash": "39ca860f9c4d2e237e97d1aa7a58e0882709dc99b2d6d5a046b6e7e1d37f78d0",
    "domHash": "657b0cb1fbdb4ecf224acbef316373edbbc495af40a4ce45cd91529035308db6",
    "geometryHash": "c4577206bb73d13c008a817501adc4b71fb8aea072f889b4fa2dd4848a18a229",
    "viewBox": "0 0 1100 1060"
  },
  "calendar-en-mobile": {
    "rawHash": "6d473f03c08ccafa7acc8b9167641d855d66e5c81bf13ec740f1b4a22e80b117",
    "domHash": "c42a9be0121811a9919cdb306083130355e6be92bf287b30ba8232668430a35b",
    "geometryHash": "573afd5ab2a5487ae854c2837ef965c44dd138a6339701d602fd0959263693bb",
    "viewBox": "0 0 560 1660"
  }
};
const textCorrections={
  "ownership-fr-mobile": {
    "pairs": [
      [
        "LE FLOTTANT CHANGE DE SENS",
        "FLOTTANT ET CONTRÔLE",
        1
      ]
    ],
    "expectedHash": "aed1f9af9fa118df22e684b188ca4430857bed10ec33e59d8a410869e63f0f75",
    "expectedDomHash": "40f2c4d650f40ef66bd9f28c502f27a10efa0c3999af28ddce0c184b3e56bb69"
  },
  "ownership-en-mobile": {
    "pairs": [
      [
        "WHAT “FLOAT” REALLY MEANS",
        "FREE FLOAT AND CONTROL",
        1
      ]
    ],
    "expectedHash": "4fc8f9e18364c329de4f2deef625dc5406a1e9c14d94b35cf28bd40d0e23b873",
    "expectedDomHash": "d15ca61acf6ac06c71aebaa22deb04c112be89be1f487ca643b174ae684f3af2"
  }
};
const kinds=["ownership","contraction","selling","concentration","calendar"];
const references={"ownership":[13],"contraction":[2],"selling":[14],"concentration":[2],"calendar":[8,2]};
const classes=(n,name)=>(attr(n,'class')??'').split(/\s+/u).includes(name);
function figures(tree,lang){
 const all=nodes(tree),selected=all.filter(n=>n.tagName==='figure'&&classes(n,'msci-indonesia-figure'));assert.equal(selected.length,5);
 for(const[i,figure]of selected.entries()){
  assert.deepEqual(['id','data-figure','data-kind'].map(k=>attr(figure,k)),[`figure-${i+1}`,String(i+1).padStart(2,'0'),kinds[i]]);
  const roots=nodes(figure).filter(n=>n.tagName==='svg');assert.equal(roots.length,2);
  for(const[j,root]of roots.entries()){
   const key=`${kinds[i]}-${lang}-${j?'mobile':'desktop'}`,prefix=`msci-${lang}-f${i+1}-${j?'m':'d'}`;
   assert.deepEqual(root.attrs.map(a=>[a.name,a.value]).sort(([a],[b])=>a<b?-1:a>b?1:0),Object.entries({xmlns:'http://www.w3.org/2000/svg',class:'l0g-msci-svg',viewBox:originals[key].viewBox,role:'img','aria-labelledby':`${prefix}-title ${prefix}-desc`,style:'width:100%;height:auto'}).sort(([a],[b])=>a<b?-1:a>b?1:0));
   // Remove only the already-asserted exact root responsive style; compare every remaining original field and child.
   const projection={...root,attrs:root.attrs.filter(a=>a.name!=='style')};
   const hash=createHash('sha256').update(JSON.stringify(canonical(projection))).digest('hex');assert.equal(hash,(textCorrections[key]?.expectedDomHash??originals[key].domHash),`${key}: all native geometry, text, metadata, stylesheet, markers and child order`);
   assert.ok(classes(root.parentNode,`msci-indonesia-${j?'mobile':'desktop'}`));
   for(const type of ['title','desc']){const found=nodes(root).filter(n=>n.tagName===type);assert.equal(found.length,1);assert.equal(attr(found[0],'id'),`${prefix}-${type}`);assert.ok(text(found[0]).trim());}
  }
  const caption=nodes(figure).filter(n=>n.tagName==='figcaption');assert.equal(caption.length,1);assert.ok(text(caption[0]).length>70);
  const links=nodes(caption[0]).filter(n=>n.tagName==='a');assert.deepEqual(links.map(n=>[attr(n,'href'),text(n)]),references[kinds[i]].map(n=>[`#source-s${String(n).padStart(2,'0')}`,`[S${String(n).padStart(2,'0')}]`]));
  for(const id of references[kinds[i]])assert.equal(all.filter(n=>attr(n,'id')===`source-s${String(id).padStart(2,'0')}`).length,1);
  const details=nodes(figure).filter(n=>n.tagName==='details');assert.equal(details.length,1);assert.equal(nodes(details[0]).filter(n=>n.tagName==='summary').length,1);assert.ok(text(details[0]).length>100);
 }
 const ids=all.map(n=>attr(n,'id')).filter(Boolean);assert.equal(new Set(ids).size,ids.length,'Every document ID remains unique');
}
function setAttribute(n,k,value){const a=n.attrs.find(a=>a.name===k);if(a)a.value=value;else n.attrs.push({name:k,value});}
test('compiled FR/EN preserve20 complete originals and five accessible figures each',()=>{for(const page of pages)figures(parse(page.html),page.lang);});
test('compiled SVG checks detect changed native geometry, labels, styles and active nodes',()=>{
 const pick=tree=>nodes(tree).find(n=>n.tagName==='svg'&&attr(n,'aria-labelledby')==='msci-fr-f1-d-title msci-fr-f1-d-desc');
 for(const field of ['id','viewBox','role','aria-labelledby','style']){const tree=parse(pages[0].html);setAttribute(pick(tree),field,'changed');assert.throws(()=>figures(tree,'fr'));}
 {const tree=parse(pages[0].html);pick(tree).attrs=pick(tree).attrs.filter(a=>a.name!=='style');assert.throws(()=>figures(tree,'fr'));}
 for(const[field,value]of [['font-family','Arial'],['font-size','1'],['x','0'],['fill','url(https://example.org/x)']]){const tree=parse(pages[0].html),label=nodes(pick(tree)).find(n=>n.tagName==='text');setAttribute(label,field,value);assert.throws(()=>figures(tree,'fr'));}
 for(const type of ['script','foreignObject','image','animate']){const tree=parse(pages[0].html);pick(tree).childNodes.push({nodeName:type,tagName:type,attrs:[],childNodes:[]});assert.throws(()=>figures(tree,'fr'));}
 for(const type of ['tspan','title','desc','path']){const tree=parse(pages[0].html),n=nodes(pick(tree)).find(n=>n.tagName===type);if(type==='path')setAttribute(n,'d','M0 0 L9999 0');else n.childNodes=[{nodeName:'#text',value:'changed'}];assert.throws(()=>figures(tree,'fr'));}
});
