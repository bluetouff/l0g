import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parse } from 'parse5';
const pages=['fr','en'].map(lang=>({lang,html:readFileSync(new URL(`../dist/${lang==='fr'?'posts/bnc-faillites-americaines-notifications-risque':'en/analysis/bnc-us-bankruptcy-notice-outage-risk'}/index.html`,import.meta.url),'utf8')}));
const nodes=n=>[n,...(n.childNodes??[]).flatMap(nodes)];
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const text=n=>n.nodeName==='#text'?n.value:(n.childNodes??[]).map(text).join('');
const canonical=n=>n.nodeName==='#text'?['#text',n.value]:[n.tagName,(n.attrs??[]).map(a=>[a.name,a.value]).sort(([a],[b])=>a<b?-1:a>b?1:0),(n.childNodes??[]).filter(c=>c.nodeName!=='#text'||c.value.trim()||['text','tspan','title','desc','metadata','style'].includes(n.tagName)).map(canonical)];
// Independent complete supplied XML, browser DOM and attribute-tree goldens.
const originals={
  "channels-fr-desktop": {
    "rawHash": "e6dc24828477899964475ebd1917b20d71db0446469647702581066521035b45",
    "domHash": "4d02262f2d47063ceaf8701717a7b20d083ddbf9dc3faaa2ef05d05dc343bcb8",
    "geometryHash": "fdfb99cf38859e2755602fd96b733a379e47a59d4ec8602e2a39663e70278622",
    "viewBox": "0 0 1200 810"
  },
  "channels-fr-mobile": {
    "rawHash": "565c880cb8c076f1cf5d0d2a1cff82ba7fbd8d28e46ab3b229a0622ba98039ae",
    "domHash": "f332561ccf8b923b77300f8b72ddf1e2559087a1842d9b8c2000795677a473d5",
    "geometryHash": "d33de0ca96f03eb8b5f83c24b436b64f42f1f256a9b5b0dcc1c0f80266ea0673",
    "viewBox": "0 0 420 1190"
  },
  "filings-fr-desktop": {
    "rawHash": "9707fef055824baac5e51fa21f0284755bb3381cc2c22ccd7a93d18ff7221a36",
    "domHash": "7260b9fa7298e7ee8a74133348d07edda241d671390aad7f800b70f32f1be2ca",
    "geometryHash": "d6f8cbb829fda0d5387cc79ba266b7cb0e216c660be5f6706535239f8f8ff64e",
    "viewBox": "0 0 1200 755"
  },
  "filings-fr-mobile": {
    "rawHash": "320cbc397d91f1bed30555f78507d944d753e0e871aa3bb189e0b351ac56dd8b",
    "domHash": "57ef9dfab7341d737ef61780efc2c18d8d4eef4d0c95f8ca1ca879a85269eabc",
    "geometryHash": "6d736dae03c91cd5e94c8cfc902aaf1daf27fc5fa9fe98f16345ec7cdc73875a",
    "viewBox": "0 0 420 1160"
  },
  "deadlines-fr-desktop": {
    "rawHash": "6774172823a1f5ef67062ab86e9ab2a25fc87351778913259cc866f1470c1a75",
    "domHash": "77aa7ffce0ac4862fc0e1d6e43180fac541762fe4e627c705acbe18f855166ba",
    "geometryHash": "1da43447d7e2b9dc511dd33ca75835425e6657f6e31ff51dc09695a3309ae37d",
    "viewBox": "0 0 1200 960"
  },
  "deadlines-fr-mobile": {
    "rawHash": "0b696ccf618a737ecc0a40c6499531ebcced48d08bca516febf083fa2aa7a607",
    "domHash": "a78397fdd61ed9dbe61a799f64823f1c8592081ef98002a156e4fe6b43bdbc7f",
    "geometryHash": "7bd1a62427772dd1d09c11190c43cc09fdaaf9c8b4189ecff64eb4b7afbfa31f",
    "viewBox": "0 0 420 1435"
  },
  "fallback-fr-desktop": {
    "rawHash": "943b8b296f7f0f3175cb4a4407683689c2668f40a71b83e876f8a437f59e6667",
    "domHash": "de2ba2416e591201de002decd408653d59f5a90d11dfad180725d9f40c6dece5",
    "geometryHash": "2a9fba09f348261eb180ad8bff2c1eb73cd21a8802f3ead1fc41d486b4d12012",
    "viewBox": "0 0 1200 940"
  },
  "fallback-fr-mobile": {
    "rawHash": "4a9f9b5d76ed02d9b299aeb6300e346b49e1e08ccc2d1f57d8bf3c6bba31a895",
    "domHash": "cf82942f961138d9c261411fab5aee8023b4cc6de2abe91dadfd532a70e7852f",
    "geometryHash": "f08972662872f509fe502187b97d3e16347137fe518636dd16e7d4b52d977bd1",
    "viewBox": "0 0 420 1425"
  },
  "backlog-fr-desktop": {
    "rawHash": "d264b96a43559f517953a290ba134fc0e1d4b8d3da5f043d5e6fd286f8cea1fd",
    "domHash": "e3a7a8e1d4ccc3849569648f392fb9e986d86e7de3b811f17c1897a4897e39fe",
    "geometryHash": "5c60fe8f1243937b9bbe275eb9416816c5e4bc789416c92bfbd9711d3b569f5f",
    "viewBox": "0 0 1200 875"
  },
  "backlog-fr-mobile": {
    "rawHash": "c90a3bac82e9062c22d64378c2f8d77e8d31d60bd529ae0133679602b739390c",
    "domHash": "8843df70972da55151874687cdcb7986752f82d2cc9e4f59f3ed29d2caab7aef",
    "geometryHash": "149cdf4179e440b4b088d8ec236154b5ea6b9dd00d1cae78ca0cff6795b13dcc",
    "viewBox": "0 0 420 1190"
  },
  "reconciliation-fr-desktop": {
    "rawHash": "d6755b12dc9b1f49c816e34baeb2d1d41454e9520383f13b5ea1c45faacdeed6",
    "domHash": "6715c6c708bf917f057201b191c4b1c7f6d94a97dadba38e470f35450305539f",
    "geometryHash": "bfb6e242226d486a6b1d837a075e206435cb7bfd68bab2f7ee47b5610a5987ff",
    "viewBox": "0 0 1200 965"
  },
  "reconciliation-fr-mobile": {
    "rawHash": "a38fb92bfea028be1a51f65a17f3b86e3e3ff274385969f553f191a31dfee8c4",
    "domHash": "6575027a45851542dc8855df5ce7973511c100883154257b4fb08c6561783c0c",
    "geometryHash": "442859ffac21cf6182eef4c592cd4d45e424e11710d8727d02cef62e4570eea9",
    "viewBox": "0 0 420 1420"
  },
  "channels-en-desktop": {
    "rawHash": "1fde7b43958d036ed1693c74c3ba0975abacf51b4ef7f43ee7f149341ac894ab",
    "domHash": "1c590fa007469aaa106c9dcaa78a3124144205786da7d83a288f0a9f71714b36",
    "geometryHash": "b755d750a4b4911d7ce1c77fed00a33714c466f6fc9f5b0941a3ebfd3c41d7c3",
    "viewBox": "0 0 1200 810"
  },
  "channels-en-mobile": {
    "rawHash": "e8ce229cbf7e0f945518095a9df2c4db71a884618f88aff839af77b3ce4c5e61",
    "domHash": "fce1b3ef71270a7c323cfc81d0ded016cb8164c1813254f1e56d21aa3a0dd6e1",
    "geometryHash": "e1dde1d39b943ef3c70895e028397e3231dbdd7884bf003bde35b69b600ba6f8",
    "viewBox": "0 0 420 1190"
  },
  "filings-en-desktop": {
    "rawHash": "98b724753861b779db06a5921b7bf49595174de3a9207910e01dce63093ef245",
    "domHash": "d15b5e9c5b03f0999be13df500310850fec43b08dddb14ff58e6a196f5f7482e",
    "geometryHash": "28f765e292589a310770e1cb1dc02af290c0dacdaa6e427c1005d9b8609bb829",
    "viewBox": "0 0 1200 755"
  },
  "filings-en-mobile": {
    "rawHash": "23741505e14059401e91b5f8a106eff9693bed8f2224f27eb60c99bd8763ae48",
    "domHash": "acc51381152464d3132d3620bc973314017f98f41d3dbfc75c086e54f567e132",
    "geometryHash": "78b51000e6f2bb9551bc30a072067db87d54bdbfaeb1910b465ada776fb16162",
    "viewBox": "0 0 420 1160"
  },
  "deadlines-en-desktop": {
    "rawHash": "d275866c95f5c945a879472edaac70570b53fa6bbc8404dd2f9f5bc6bf99b40a",
    "domHash": "03759414d7929d213d3f1d25e698142f22f8a444450751276b3b6754223bc5f8",
    "geometryHash": "954e10cb860f8f930a8587d18e41ebdf0fa64b2130d51c10aaf284a19e82b9f0",
    "viewBox": "0 0 1200 960"
  },
  "deadlines-en-mobile": {
    "rawHash": "efdbc6d8b95912baa9ed710f511cb038db9a68b7393c1de988477813614d66cd",
    "domHash": "70035c48de1d0e2acd8651fb902a483f0e97790dbe58143f1b7a19f7005ff7ac",
    "geometryHash": "458dc4e62241aacb71e1a9e11a951f8b0edd987392b6d754700cb1ef4b73c30f",
    "viewBox": "0 0 420 1435"
  },
  "fallback-en-desktop": {
    "rawHash": "e2733d9d1c6ee2558206df8e08fcd8856d044ed6c1a0fd9ba4311b78ce775604",
    "domHash": "3c16a9ee21a86d4c60074b4e218461321bc851e2f298530d24e58d8466388911",
    "geometryHash": "e757fcc7dea08087d2b6b390f0dac68083976b888519210824c2588817ca5ef8",
    "viewBox": "0 0 1200 940"
  },
  "fallback-en-mobile": {
    "rawHash": "9d067184f1354e84f6e8ff12791f81bf3d568f3aea07cb85f37f7b626d10159e",
    "domHash": "6474d8ebb5405fe756a7c543bfd2416633c63ca9491164c2e010ab0702e55194",
    "geometryHash": "b8cb60fb3a1b7dd4c5e59227f4a0e7d59d6465c140046c8b007f298e38fb7a56",
    "viewBox": "0 0 420 1425"
  },
  "backlog-en-desktop": {
    "rawHash": "4b6af2182e0daaa2d5302e0340cb0053fa3faa204ec8d60ec7d9ffae5dc1b218",
    "domHash": "ceba4e7534b98f85bfb8e5e4f2d57045f89f3ccee05e5492738a0f46e1f63a54",
    "geometryHash": "3fe95cb43e64009ead002f0c22e6269e22b30b1ed9bbab551f41eb60f4041316",
    "viewBox": "0 0 1200 875"
  },
  "backlog-en-mobile": {
    "rawHash": "911d9ce901394348937cef51373060b9d9c6f2aee5a567326de149e2c5312419",
    "domHash": "0872271c187a33932a5567e8b1be5cbb846006976a1304ec14e901bf07e78de4",
    "geometryHash": "82f6ca5347d7660a23d7fa84cdbf337fec614c04a15c5648a5594ec24a74ad5a",
    "viewBox": "0 0 420 1190"
  },
  "reconciliation-en-desktop": {
    "rawHash": "c70dc07239f02bbaebe8849d264a5c0099927976f3330e3caa3e3a148a025a5a",
    "domHash": "14b7b548c8c50000284d570343d53c213a0488f75106b24f839922396235be29",
    "geometryHash": "509beee7b36979ebb133f261a0950a4270452cd11ee2b3e5d8f4a5b8ef3033f5",
    "viewBox": "0 0 1200 965"
  },
  "reconciliation-en-mobile": {
    "rawHash": "d4639ebd08d13ad215b4d5ff243606afd1b5a40e996ab5ab27629d1563fe30f8",
    "domHash": "5c7a9c4776ecd1463c2d6523f6036ac96111949e31f4a68cbf460c171c210feb",
    "geometryHash": "04fe9808230ee0ef749f9821d91e4f3143bf3a3ac52c5c3c0047cab4805727e4",
    "viewBox": "0 0 420 1420"
  }
};
const textCorrections={
  "filings-fr-desktop": {
    "pairs": [
      [
        "<text x=\"953\" y=\"395.1\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"18\" font-weight=\"400\" text-anchor=\"start\" fill=\"#b5c7c8\" >581 570 sur 608</text>",
        "<text x=\"953\" y=\"395.1\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"18\" font-weight=\"400\" text-anchor=\"start\" fill=\"#b5c7c8\" >581 570 sur</text>",
        1
      ],
      [
        "<text x=\"953\" y=\"419.4\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"18\" font-weight=\"400\" text-anchor=\"start\" fill=\"#b5c7c8\" >511 dossiers</text>",
        "<text x=\"953\" y=\"419.4\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"18\" font-weight=\"400\" text-anchor=\"start\" fill=\"#b5c7c8\" >608 511 dossiers</text>",
        1
      ]
    ],
    "expectedHash": "3041b57a672f59d34012763c6f3f96a53cf1f2dcd00abc1fe3f8fafdd2b29c29",
    "expectedDomHash": "4c3bf17c2fd8ebc6775deb34a3d812b96ffcd3e589b6edca1af00949919adc2e"
  },
  "deadlines-en-desktop": {
    "pairs": [
      [
        "<title id=\"bnc-f3-en-d-title\">Different clocks start from different events</title>",
        "<title id=\"bnc-f3-en-d-title\">Deadlines start from different events</title>",
        1
      ],
      [
        "<text x=\"56\" y=\"91.0\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"37\" font-weight=\"700\" text-anchor=\"start\" fill=\"#f1f5f2\" >Different clocks start from different events</text>",
        "<text x=\"56\" y=\"91.0\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"37\" font-weight=\"700\" text-anchor=\"start\" fill=\"#f1f5f2\" >Deadlines start from different events</text>",
        1
      ],
      [
        "<text x=\"56\" y=\"888.0\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"15\" font-weight=\"400\" text-anchor=\"start\" fill=\"#b5c7c8\" >* Separate legal regimes, not a single timeline. Rule-specific extensions; no universal pause of the clocks.</text>",
        "<text x=\"56\" y=\"888.0\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"15\" font-weight=\"400\" text-anchor=\"start\" fill=\"#b5c7c8\" >* Separate legal regimes, not a single timeline. Rule-specific extensions; no universal pause of deadlines.</text>",
        1
      ]
    ],
    "expectedHash": "7f702385fc5cc64437151e46abdfef0300e2f2e53c7296cb4183e4ebc89faa2a",
    "expectedDomHash": "a0b867dfdf04ee1951ed25fc70cdd732e66a979fb4732e12b1e052437f61cc70"
  },
  "deadlines-en-mobile": {
    "pairs": [
      [
        "<title id=\"bnc-f3-en-m-title\">Different clocks start from different events</title>",
        "<title id=\"bnc-f3-en-m-title\">Deadlines start from different events</title>",
        1
      ],
      [
        "<text x=\"28\" y=\"76.0\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"25\" font-weight=\"700\" text-anchor=\"start\" fill=\"#f1f5f2\" >Different clocks start from</text>",
        "<text x=\"28\" y=\"76.0\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"25\" font-weight=\"700\" text-anchor=\"start\" fill=\"#f1f5f2\" >Deadlines start from</text>",
        1
      ],
      [
        "<text x=\"28\" y=\"1344.55\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"13\" font-weight=\"400\" text-anchor=\"start\" fill=\"#b5c7c8\" >Rule-specific extensions; no universal pause of the</text>",
        "<text x=\"28\" y=\"1344.55\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"13\" font-weight=\"400\" text-anchor=\"start\" fill=\"#b5c7c8\" >Rule-specific extensions; no universal pause of</text>",
        1
      ],
      [
        "<text x=\"28\" y=\"1362.1\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"13\" font-weight=\"400\" text-anchor=\"start\" fill=\"#b5c7c8\" >clocks.</text>",
        "<text x=\"28\" y=\"1362.1\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"13\" font-weight=\"400\" text-anchor=\"start\" fill=\"#b5c7c8\" >deadlines.</text>",
        1
      ]
    ],
    "expectedHash": "8207717a212a0db971ca62d5a91dc55c200c9f7c8a11ae42d6a30229db9a21f5",
    "expectedDomHash": "6aa8b175c892a9b6a249cac50a4ad4f9f9b2bde7a7350b8f28988bc9d0813f1c"
  }
};
const renderedSourceAnchors={
  "https://www.txeb.uscourts.gov/news/bnc-service-disruption-notification": "#source-s02",
  "https://www.almb.uscourts.gov/news/nationwide-bankruptcy-noticing-center-outage-october-2026": "#source-s03",
  "https://www.insb.uscourts.gov/sites/insb/files/BNC_10162026_FAQs.pdf": "#source-s05",
  "https://www.uscourts.gov/data-news/judiciary-news/2026/07/28/bankruptcies-rise-122-percent": "#source-s15",
  "https://www.uscourts.gov/sites/default/files/document/bf_f2_0630.2026.pdf": "#source-s16",
  "https://www.uscourts.gov/sites/default/files/document/federal-rules-of-bankruptcy-procedure.pdf": "#source-s12",
  "https://uscode.house.gov/us/usc/119-118/t11/s362/": "#source-s13",
  "https://uscode.house.gov/us/usc/119-118/t11/s342/": "#source-s14",
  "https://www.insb.uscourts.gov/sites/insb/files/26-0004.pdf": "#source-s04",
  "https://www.laeb.uscourts.gov/sites/laeb/files/AGO2026-1_BNC101326.pdf": "#source-s06",
  "https://www.nyeb.uscourts.gov/sites/nyeb/files/general-ordes/ord_844.pdf": "#source-s07",
  "https://www.akb.uscourts.gov/news/important-notice-bankruptcy-noticing-center-service-disruption": "#source-s11",
  "https://www.gasb.uscourts.gov/news/important-information-regarding-bankruptcy-noticing-center-bnc-nationwide-service-disruption": "#source-s10",
  "https://www.mnb.uscourts.gov/news/update-regarding-bankruptcy-noticing-center-service-interruption": "#source-s20"
};
const originalSourceAnchors=Object.fromEntries(Object.entries(renderedSourceAnchors).map(([url,target])=>[target,url]));
function restoreSourceNavigation(node){return {...node,attrs:node.attrs?.map(a=>a.name==='href'?{...a,value:originalSourceAnchors[a.value]}:a.name==='target'?{...a,value:'_blank'}:a),childNodes:node.childNodes?.map(restoreSourceNavigation)};}
const kinds=["channels", "filings", "deadlines", "fallback", "backlog", "reconciliation"];
const references={"channels": "02 03 05", "filings": "15 16", "deadlines": "12 13 14", "fallback": "04 06 07 11", "backlog": "m01", "reconciliation": "05 10 20"};
const classes=(n,name)=>(attr(n,'class')??'').split(/\s+/u).includes(name);
function figures(tree,lang){
 const all=nodes(tree),selected=all.filter(n=>n.tagName==='figure'&&classes(n,'bnc-figure'));assert.equal(selected.length,6);
 for(const[i,figure]of selected.entries()){
  const number=String(i+1).padStart(2,'0');assert.deepEqual(['id','data-figure','data-kind'].map(k=>attr(figure,k)),[`figure-${number}`,number,kinds[i]]);
  const roots=nodes(figure).filter(n=>n.tagName==='svg');assert.equal(roots.length,2);
  for(const[j,root]of roots.entries()){
   const key=`${kinds[i]}-${lang}-${j?'mobile':'desktop'}`,prefix=`bnc-f${i+1}-${lang}-${j?'m':'d'}`,[,,width,height]=originals[key].viewBox.split(' ');
   const expected={xmlns:'http://www.w3.org/2000/svg',width,height,viewBox:originals[key].viewBox,role:'img','aria-labelledby':`${prefix}-title ${prefix}-desc`,style:'width:100%;height:auto'};
   const sorted=values=>values.sort(([a],[b])=>a<b?-1:a>b?1:0);assert.deepEqual(sorted(root.attrs.map(a=>[a.name,a.value])),sorted(Object.entries(expected)));
   // Restore only exact reviewed source hrefs and remove the asserted root style for the complete original-tree comparison.
   const sourceLinks=nodes(root).filter(n=>n.tagName==='a');
   for(const link of sourceLinks){const target=attr(link,'href');assert.equal(attr(link,'target'),'_self');assert.equal(link.attrs.length,3);assert.ok(attr(link,'aria-label'));assert.deepEqual(link.attrs.map(a=>a.name),['href','target','aria-label']);assert.ok(Object.hasOwn(originalSourceAnchors,target));assert.ok(text(link).includes(target.slice(-3).toUpperCase()));const found=all.filter(n=>attr(n,'id')===target.slice(1));assert.equal(found.length,1);assert.ok(nodes(found[0]).some(n=>n.tagName==='a'&&attr(n,'href')===originalSourceAnchors[target]));}
   const projection=restoreSourceNavigation({...root,attrs:root.attrs.filter(a=>a.name!=='style')}),hash=createHash('sha256').update(JSON.stringify(canonical(projection))).digest('hex');
   assert.equal(hash,textCorrections[key]?.expectedDomHash??originals[key].domHash,`${key}: all supplied fields, glyph strings and element order`);
   assert.ok(classes(root.parentNode,`bnc-${j?'mobile':'desktop'}`));
   for(const type of ['title','desc']){const found=nodes(root).filter(n=>n.tagName===type);assert.equal(found.length,1);assert.equal(attr(found[0],'id'),`${prefix}-${type}`);assert.ok(text(found[0]).trim());}
  }
  const caption=nodes(figure).filter(n=>n.tagName==='figcaption');assert.equal(caption.length,1);assert.ok(text(caption[0]).length>50);
  const refs=references[kinds[i]].split(' '),links=nodes(caption[0]).filter(n=>n.tagName==='a');assert.deepEqual(links.map(n=>[attr(n,'href'),text(n)]),refs.map(id=>[id==='m01'?'#source-m01':`#source-s${id}`,id==='m01'?'[M01]':`[S${id}]`]));
  for(const id of refs)assert.equal(all.filter(n=>attr(n,'id')===(id==='m01'?'source-m01':`source-s${id}`)).length,1);
  const details=nodes(figure).filter(n=>n.tagName==='details');assert.equal(details.length,1);assert.equal(nodes(details[0]).filter(n=>n.tagName==='summary').length,1);assert.ok(text(details[0]).length>100);
 }
 assert.equal(selected.flatMap(f=>nodes(f).filter(n=>n.tagName==='svg').flatMap(root=>nodes(root).filter(n=>n.tagName==='a'))).length,30);
 const ids=all.map(n=>attr(n,'id')).filter(Boolean);assert.equal(new Set(ids).size,ids.length,'Every document ID remains unique');
}
function setAttribute(n,k,value){const a=n.attrs.find(a=>a.name===k);if(a)a.value=value;else n.attrs.push({name:k,value});}
test('compiled FR/EN preserve24 complete supplied trees and six accessible figures each',()=>{for(const page of pages)figures(parse(page.html),page.lang);});
test('compiled SVG checks detect changed native geometry, labels, styles, fonts and active nodes',()=>{
 const pick=tree=>nodes(tree).find(n=>n.tagName==='svg'&&attr(n,'aria-labelledby')==='bnc-f1-fr-d-title bnc-f1-fr-d-desc');
 for(const field of ['width','height','lang','id','viewBox','role','aria-labelledby','style']){const tree=parse(pages[0].html);assert.ok(pick(tree));setAttribute(pick(tree),field,'changed');assert.throws(()=>figures(tree,'fr'));}
 {const tree=parse(pages[0].html);pick(tree).attrs=pick(tree).attrs.filter(a=>a.name!=='style');assert.throws(()=>figures(tree,'fr'));}
 for(const[field,value]of [['font-family','Other'],['font-size','1'],['x','0'],['fill','url(https://example.org/x)']]){const tree=parse(pages[0].html),label=nodes(pick(tree)).find(n=>n.tagName==='text');assert.ok(label);setAttribute(label,field,value);assert.throws(()=>figures(tree,'fr'));}

 for(const type of ['script','foreignObject','image','animate']){const tree=parse(pages[0].html);pick(tree).childNodes.push({nodeName:type,tagName:type,attrs:[],childNodes:[]});assert.throws(()=>figures(tree,'fr'));}
 for(const type of ['text','title','desc','path']){const tree=parse(pages[0].html),n=nodes(pick(tree)).find(n=>n.tagName===type);assert.ok(n);if(type==='path')setAttribute(n,'d','M0 0 L9999 0');else n.childNodes=[{nodeName:'#text',value:'changed'}];assert.throws(()=>figures(tree,'fr'));}
});

test('compiled source navigation rejects external URLs, wrong citations, target changes and missing bibliography targets',()=>{
 const pick=tree=>nodes(tree).find(n=>n.tagName==='svg'&&attr(n,'aria-labelledby')==='bnc-f1-fr-d-title bnc-f1-fr-d-desc'),link=tree=>nodes(pick(tree)).find(n=>n.tagName==='a');
 for(const href of ['https://example.org/','https://www.txeb.uscourts.gov/news/bnc-service-disruption-notification','#source-s10','#source-s99','javascript:alert(1)']){const tree=parse(pages[0].html);setAttribute(link(tree),'href',href);assert.throws(()=>figures(tree,'fr'));}
 for(const field of ['target','download','onclick']){const tree=parse(pages[0].html);setAttribute(link(tree),field,'changed');assert.throws(()=>figures(tree,'fr'));}
 {const tree=parse(pages[0].html);setAttribute(nodes(tree).find(n=>attr(n,'id')==='source-s06'),'id','removed');assert.throws(()=>figures(tree,'fr'));}
});
