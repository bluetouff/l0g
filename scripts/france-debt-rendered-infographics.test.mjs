import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parse } from 'parse5';
const pages=['fr','en'].map(lang=>({lang,html:readFileSync(new URL(`../dist/${lang==='fr'?'posts/dette-francaise-refinancement-calendrier-taux':'en/analysis/france-debt-refinancing-maturity-interest-costs'}/index.html`,import.meta.url),'utf8')}));
const nodes=n=>[n,...(n.childNodes??[]).flatMap(nodes)];
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const text=n=>n.nodeName==='#text'?n.value:(n.childNodes??[]).map(text).join('');
const canonical=n=>n.nodeName==='#text'?['#text',n.value]:[n.tagName,(n.attrs??[]).map(a=>[a.name,a.value]).sort(([a],[b])=>a<b?-1:a>b?1:0),(n.childNodes??[]).filter(c=>c.nodeName!=='#text'||c.value.trim()||['text','tspan','title','desc','metadata','style'].includes(n.tagName)).map(canonical)];
// Independent complete supplied XML, browser DOM and attribute-tree goldens.
const originals={
  "auction-fr-desktop": {
    "rawHash": "988d9d1a5e777c6cec42b05f9da8d191e9049df13a6607ae320189b074938026",
    "domHash": "5a33ee41f609eafdad4b7d1bf26a0e934013ce87b9db03fdb50999b184f15ca4",
    "geometryHash": "94a0ce186eb52cc59c5c36ec527587d2e4507248ea3fe0fcdf1e28f8825f477b",
    "viewBox": "0 0 1120 635"
  },
  "auction-fr-mobile": {
    "rawHash": "67e29c1daee82394252132c39917c6535c7daf2f95e08f8c9170fd95d26c6f69",
    "domHash": "575e24de9bc2e958408e60d4c6ae1e549ecaa8735d05b5ceb9bac6ff33914644",
    "geometryHash": "9f73da133c8382f23b1099f218482227a55d5ff3d296a864b5f0f761214bb82b",
    "viewBox": "0 0 560 910"
  },
  "structure-fr-desktop": {
    "rawHash": "9485f8d0b2b29216460001cec02cde52aeea877e5824c49b830b45d10b2b326d",
    "domHash": "b3c15a87c84f29e8a1c30606848e76af9bb291aad318ea73686aa60729a84588",
    "geometryHash": "aae76fd618565226cd44e6387ed559f6138ce988b203d6ebe04b32b889bf94c0",
    "viewBox": "0 0 1120 650"
  },
  "structure-fr-mobile": {
    "rawHash": "47ce0b191a15ab7467d9be5ca12069f4d21b924d229061b054e86c6b7b35e747",
    "domHash": "b04e151761aa4739470307abddc44d271ef5203157479fa3cbb576c13be5cd98",
    "geometryHash": "f8fad61b0eb6b8ababb7db5a06923cd2597796628e3b23aa09eb5607e7104ff4",
    "viewBox": "0 0 560 900"
  },
  "maturities-fr-desktop": {
    "rawHash": "70863cc498f4571152969d6e8418c4d97e0b0ecb13fd54d5f0aeffef89d744c9",
    "domHash": "ce0a340bd1af2472d3bd8378a3d46a12eb5ef1b62028c1f9cff1890b786e1ae6",
    "geometryHash": "62b2947dff2a73854c14e31b1ac23039f3cdde1ae6468497736b6fa1c55efe69",
    "viewBox": "0 0 1120 780"
  },
  "maturities-fr-mobile": {
    "rawHash": "e591b6e038fa15d6a9a7fba454ded577232ce86f104f15a23c4757cd607da738",
    "domHash": "0b36f32e8ae68f314751c490ed88fc0d6d26822bb806b80058b610bc43a7eae1",
    "geometryHash": "258f3f8ae21ba81c77a72a05414a161b1e33be1c1060364885744c7b2b50daa1",
    "viewBox": "0 0 560 1030"
  },
  "cohorts-fr-desktop": {
    "rawHash": "7465a58b66cb8a19d61d17fb633fc5a52b58659c641144707da520c92764211e",
    "domHash": "536f914666b93d1bfb0af53c42612a6d221dd442a31b218d33550d565828a844",
    "geometryHash": "f580c766210f2b1c0998b8dc6763d9325c529cf3d08fc3280afc6a1b1a75ad0d",
    "viewBox": "0 0 1120 830"
  },
  "cohorts-fr-mobile": {
    "rawHash": "6e28f049b73c91fc00082fbb77383b29033989db0bf39fd2da3f38ecc092734b",
    "domHash": "a840a02ced160eb22552a5f16c263e3dec6d8590a08788266825365428dd1645",
    "geometryHash": "2853dc4dd7e7ce06fc3679a68f4149308d2e15bc1c6a311e7b7b8e985969cf5a",
    "viewBox": "0 0 560 1120"
  },
  "financing-fr-desktop": {
    "rawHash": "c88a42ff37efffaf11e7cee2a1bda2fbeade48832ed3fe8e6b5ce7450a372bc4",
    "domHash": "bf5bcbdf9b4f819b973a16a46adcfe9336a5ba8a47b713bfcc7d91c05e2144e2",
    "geometryHash": "6061a7f276ba25fd567ba9a9dfa754caf45ad56205a071b652af5ac4279805cc",
    "viewBox": "0 0 1120 680"
  },
  "financing-fr-mobile": {
    "rawHash": "fcdd6700ed0c382237ac2bb0af52a5d7f6b16b1a259a42afaffc5547242b712c",
    "domHash": "f5281cd4d4afe7d00ee25908cf02523ee64032e88d031122467636a1836e678e",
    "geometryHash": "3ec493ef992043bcb61244239e4fdb96c47b1839a9dc6f3c6b18ab529ae1a025",
    "viewBox": "0 0 560 1010"
  },
  "indexation-fr-desktop": {
    "rawHash": "af9d23067a49c7ef4e07c53d32b869620ad7615359660acb1df8e01b4893ca07",
    "domHash": "7e0606d1e12a191b4068a51b04ff1fde726a444b1f2548d5acaad13bb6dab09e",
    "geometryHash": "fca872aa292c3c19e34092544f0d0276a7540d2d34ca9618285ba24c3bca1a81",
    "viewBox": "0 0 1120 775"
  },
  "indexation-fr-mobile": {
    "rawHash": "aec796a15198f72b205c18ef9de0ff977eeb33569039f783eadf9e81b10180af",
    "domHash": "099686e3c81d7a76d7c23fb5215e4d7e5ebd966dd90da588da34bd8cd0e6044e",
    "geometryHash": "9252523116993e7e49db3d04e716b51922e3ffe42c5b416d7a00410c21592100",
    "viewBox": "0 0 560 1080"
  },
  "auction-en-desktop": {
    "rawHash": "8e436c145b6e443b61dad098f32e13321f0af86f875165c534574532350deb4c",
    "domHash": "b8e44ae3a8141b8bc24d99121e75dd7a072f7c51dd5cc2e623f98c25bf32af18",
    "geometryHash": "c3ba7709fdf1a90382129d40404c9b3090799e48adf8e29a2fa325dc0c60f131",
    "viewBox": "0 0 1120 635"
  },
  "auction-en-mobile": {
    "rawHash": "888c58563b0cde9506c34d1b54acf7609bbbda5343d5fd1ce75b1a3035b9e876",
    "domHash": "8590a116ac534149937e869a15c869ee0d1713a72dd163680ca776bd3657656b",
    "geometryHash": "ff7c20739fc3656938547a6b01ba6ffa53e7bc1d74e2b01e2ba7798c23bd3373",
    "viewBox": "0 0 560 910"
  },
  "structure-en-desktop": {
    "rawHash": "d513c89447f3d9093943799741112de492108a1dd02dd242b5463b17ba42224c",
    "domHash": "f7fabedd02e375308bbd90608ffe57bc22f9b579e9012c4e626431bedcfcb221",
    "geometryHash": "795bfa690d149d657ab22149f00aa617b725873e8eab264391c579ec90c4e1f3",
    "viewBox": "0 0 1120 650"
  },
  "structure-en-mobile": {
    "rawHash": "27c14dd0f6f501180f60a3884b7418b3f3e1ab7e350ec52ce4c91ba68009f556",
    "domHash": "35c78fe9aff32f18c80b350d8c57f7b5c938471f2c00d9254f9b7b31efacc91d",
    "geometryHash": "ac8073f5256085ed0af5eadbd50d0048a15af7187e248f85c55cb7ea8cf0cd87",
    "viewBox": "0 0 560 900"
  },
  "maturities-en-desktop": {
    "rawHash": "6735e055900186ee4f088f615af7c7e0d3c9d91dfc7b1d101fc9217b7ae7b472",
    "domHash": "70400f4f08c700fa67e8df482b9289ca4714be73efbe72fc49ffea8f61458f9b",
    "geometryHash": "8fa284c0481121a3258e6bdeee1ebf664af487819dd619323b56e1e06e36f8c9",
    "viewBox": "0 0 1120 780"
  },
  "maturities-en-mobile": {
    "rawHash": "1d6e7e6d9f390b209d5840b2e98d7e7c7a9b197ade61cc091aa93f27b0afe238",
    "domHash": "300212d71a6ec7cb7bfcc6e1347b6b006cd910e069fd3d7b7ca4dd9d7f28454c",
    "geometryHash": "cba1d3b1cde6eaa99131a7caf035c469f194a2f9932031d163d955a335357805",
    "viewBox": "0 0 560 1030"
  },
  "cohorts-en-desktop": {
    "rawHash": "5d64492860dc1508d4424c62b4dfaec262a889e4bc27b00af85068dc671eb523",
    "domHash": "63c68e5765ed0fd86a2fcd352757dd3f0c9648e6b540e8e4260ad361a29513b4",
    "geometryHash": "11c04fc8f15c7e6d4c9779e9e8bf4106199fe68fda504781e13085ab2c956098",
    "viewBox": "0 0 1120 830"
  },
  "cohorts-en-mobile": {
    "rawHash": "012b305b2402bff82822d4f26cc0f94740a8ac34b0f8c79abbbfcd970f7200d3",
    "domHash": "cb741665687a4dc0573e64e45c3be66ceabb9d1a72a7ec9c1edea1b9c4241bce",
    "geometryHash": "6c96de458f4bf2a8ceeca18dff84a20a037cdd0fbc7134af4dd7888f06277e72",
    "viewBox": "0 0 560 1120"
  },
  "financing-en-desktop": {
    "rawHash": "910596c77d6f871c400eefed2109c3c5cc643ca064c65b534ae1b77a64cac712",
    "domHash": "f76a043c832c027b533aa352bea9e00d31c02385665994da84360ededde8e9b2",
    "geometryHash": "24fa1a7f6dfcf13babdfd695507ccc627f162cf8a75969561ea216fd3b1d3b8e",
    "viewBox": "0 0 1120 680"
  },
  "financing-en-mobile": {
    "rawHash": "95e6925ff3b57d32cf64b2331c4876a77bfb2dc87c0fb6f15a8f76e3d9160e80",
    "domHash": "1a3f3ef0bd2d332335a8bc54ddcc9f249b72aad8e64b9d892883f16f2da6fc08",
    "geometryHash": "0236055a6e4dcfa86ce250aa28519b3533ba83dc73a6d03ab0bada9f8376792e",
    "viewBox": "0 0 560 1010"
  },
  "indexation-en-desktop": {
    "rawHash": "cfef149b3c7864e5ae4325c7b49e87c496286a01800067057c40420d33c097ca",
    "domHash": "d5f38135348860aae0a0c61f6ff0fab6a9e389dc321e5b752a8d66031895e73b",
    "geometryHash": "003b026718754bed82352fb31ebd67dc1553acce40311ca3ca627530c53a41d6",
    "viewBox": "0 0 1120 775"
  },
  "indexation-en-mobile": {
    "rawHash": "939e061ab4cd9a8486ef90356e6fae367c12727b1466055b4e8840156173951f",
    "domHash": "18094887822403c8451f6ed6bf77d901cfb6749f4f66696c960c338ee3279164",
    "geometryHash": "3a603887806d597a350f3c50c3d5d10cd840e53c530c399a645d9b9701b53b6b",
    "viewBox": "0 0 560 1080"
  }
};
const textCorrections={
  "indexation-fr-desktop": {
    "pairs": [
      [
        "<title id=\"dette-fr-06-d-title\">L’inflation a deux dates : la charge et le paiement</title>",
        "<title id=\"dette-fr-06-d-title\">Indexation : charge et remboursement</title>",
        1
      ],
      [
        "<text x=\"40\" y=\"80\" font-size=\"31\" fill=\"#143247\" font-weight=\"700\" text-anchor=\"start\" >L’inflation a deux dates : la charge et le paiement</text>",
        "<text x=\"40\" y=\"80\" font-size=\"31\" fill=\"#143247\" font-weight=\"700\" text-anchor=\"start\" >Indexation : charge et remboursement</text>",
        1
      ]
    ],
    "expectedHash": "5e6bc78f25b493f0878d4a8d79ef7521987d178ea4db51b73d72e95a56360b07",
    "expectedDomHash": "7e4971f483292064ac020525de5447973a2f9e3e741da41a1b4c5fbc4ab8e077"
  },
  "indexation-fr-mobile": {
    "pairs": [
      [
        "<title id=\"dette-fr-06-m-title\">L’inflation a deux dates : la charge et le paiement</title>",
        "<title id=\"dette-fr-06-m-title\">Indexation : charge et remboursement</title>",
        1
      ],
      [
        "<text x=\"28\" y=\"82\" font-size=\"30\" fill=\"#143247\" font-weight=\"700\" text-anchor=\"start\" >L’inflation a deux dates :</text>",
        "<text x=\"28\" y=\"82\" font-size=\"30\" fill=\"#143247\" font-weight=\"700\" text-anchor=\"start\" >Indexation : charge</text>",
        1
      ],
      [
        "<text x=\"28\" y=\"118\" font-size=\"30\" fill=\"#143247\" font-weight=\"700\" text-anchor=\"start\" >la charge et le paiement</text>",
        "<text x=\"28\" y=\"118\" font-size=\"30\" fill=\"#143247\" font-weight=\"700\" text-anchor=\"start\" >et remboursement</text>",
        1
      ]
    ],
    "expectedHash": "78fb64e3067049e9e5b67fc1b6bb68c4c7dd749a011ffcbef9574fdd855ae163",
    "expectedDomHash": "74e3628c88489e488c12373a21f7dedca32809443455f877f49bb9ad03624cc9"
  },
  "indexation-en-desktop": {
    "pairs": [
      [
        "<title id=\"dette-en-06-d-title\">Inflation has two dates: expense and payment</title>",
        "<title id=\"dette-en-06-d-title\">Indexation: accrual and redemption</title>",
        1
      ],
      [
        "<text x=\"40\" y=\"80\" font-size=\"31\" fill=\"#143247\" font-weight=\"700\" text-anchor=\"start\" >Inflation has two dates: expense and payment</text>",
        "<text x=\"40\" y=\"80\" font-size=\"31\" fill=\"#143247\" font-weight=\"700\" text-anchor=\"start\" >Indexation: accrual and redemption</text>",
        1
      ]
    ],
    "expectedHash": "810b325732c816a31fc932af9327caf9cb773c09fb37ce853f4c15344a8e7117",
    "expectedDomHash": "03c9098bc51afc9818a758dde3c579c715dc8d4c0fcd3a7acc5ad6be71030f4c"
  },
  "indexation-en-mobile": {
    "pairs": [
      [
        "<title id=\"dette-en-06-m-title\">Inflation has two dates: expense and payment</title>",
        "<title id=\"dette-en-06-m-title\">Indexation: accrual and redemption</title>",
        1
      ],
      [
        "<text x=\"28\" y=\"82\" font-size=\"30\" fill=\"#143247\" font-weight=\"700\" text-anchor=\"start\" >Inflation has two dates:</text>",
        "<text x=\"28\" y=\"82\" font-size=\"30\" fill=\"#143247\" font-weight=\"700\" text-anchor=\"start\" >Indexation: accrual</text>",
        1
      ],
      [
        "<text x=\"28\" y=\"118\" font-size=\"30\" fill=\"#143247\" font-weight=\"700\" text-anchor=\"start\" >expense and payment</text>",
        "<text x=\"28\" y=\"118\" font-size=\"30\" fill=\"#143247\" font-weight=\"700\" text-anchor=\"start\" >and redemption</text>",
        1
      ]
    ],
    "expectedHash": "68c839571a75ef9d14e166f328a15fb01404edc9b1a7d5473454ba42e466a406",
    "expectedDomHash": "8b202a7a88b31675e1bf06ea3a910529bfd48d1860eeefa9ad0c37dc984ac0e2"
  }
};
const kinds=["auction", "structure", "maturities", "cohorts", "financing", "indexation"];

const references={"auction": "03 04 m1", "structure": "02 m1", "maturities": "07 10 14", "cohorts": "07 m1", "financing": "06", "indexation": "06 12"};
const classes=(n,name)=>(attr(n,'class')??'').split(/\s+/u).includes(name);
function figures(tree,lang){
 const all=nodes(tree),selected=all.filter(n=>n.tagName==='figure'&&classes(n,'france-debt-figure'));assert.equal(selected.length,6);
 for(const[i,figure]of selected.entries()){
  const number=String(i+1).padStart(2,'0');assert.deepEqual(['id','data-figure','data-kind'].map(k=>attr(figure,k)),[`figure-${number}`,number,kinds[i]]);
  const roots=nodes(figure).filter(n=>n.tagName==='svg');assert.equal(roots.length,2);
  for(const[j,root]of roots.entries()){
   const key=`${kinds[i]}-${lang}-${j?'mobile':'desktop'}`,prefix=`dette-${lang}-${number}-${j?'m':'d'}`,[,,width,height]=originals[key].viewBox.split(' ');
   const expected={xmlns:'http://www.w3.org/2000/svg',width,height,viewBox:originals[key].viewBox,role:'img','aria-labelledby':`${prefix}-title ${prefix}-desc`,lang,style:'width:100%;height:auto'};
   const sorted=values=>values.sort(([a],[b])=>a<b?-1:a>b?1:0);assert.deepEqual(sorted(root.attrs.map(a=>[a.name,a.value])),sorted(Object.entries(expected)));
   // Remove only the already-asserted exact responsive style before full browser-tree comparison.
   const projection={...root,attrs:root.attrs.filter(a=>a.name!=='style')},hash=createHash('sha256').update(JSON.stringify(canonical(projection))).digest('hex');
   assert.equal(hash,textCorrections[key]?.expectedDomHash??originals[key].domHash,`${key}: all supplied fields, glyph strings and element order`);
   assert.ok(classes(root.parentNode,`france-debt-${j?'mobile':'desktop'}`));
   for(const type of ['title','desc']){const found=nodes(root).filter(n=>n.tagName===type);assert.equal(found.length,1);assert.equal(attr(found[0],'id'),`${prefix}-${type}`);assert.ok(text(found[0]).trim());}
  }
  const caption=nodes(figure).filter(n=>n.tagName==='figcaption');assert.equal(caption.length,1);assert.ok(text(caption[0]).length>70);
  const refs=references[kinds[i]].split(' '),links=nodes(caption[0]).filter(n=>n.tagName==='a');assert.deepEqual(links.map(n=>[attr(n,'href'),text(n)]),refs.map(id=>[id==='m1'?'#source-m1':`#source-s${id}`,id==='m1'?'[M1]':`[S${id}]`]));
  for(const id of refs)assert.equal(all.filter(n=>attr(n,'id')===(id==='m1'?'source-m1':`source-s${id}`)).length,1);
  const details=nodes(figure).filter(n=>n.tagName==='details');assert.equal(details.length,1);assert.equal(nodes(details[0]).filter(n=>n.tagName==='summary').length,1);assert.ok(text(details[0]).length>100);
 }
 const ids=all.map(n=>attr(n,'id')).filter(Boolean);assert.equal(new Set(ids).size,ids.length,'Every document ID remains unique');
}
function setAttribute(n,k,value){const a=n.attrs.find(a=>a.name===k);if(a)a.value=value;else n.attrs.push({name:k,value});}
test('compiled FR/EN preserve24 complete supplied trees and six accessible figures each',()=>{for(const page of pages)figures(parse(page.html),page.lang);});
test('compiled SVG checks detect changed native geometry, labels, styles, fonts and active nodes',()=>{
 const pick=tree=>nodes(tree).find(n=>n.tagName==='svg'&&attr(n,'aria-labelledby')==='dette-fr-01-d-title dette-fr-01-d-desc');
 for(const field of ['width','height','lang','id','viewBox','role','aria-labelledby','style']){const tree=parse(pages[0].html);assert.ok(pick(tree));setAttribute(pick(tree),field,'changed');assert.throws(()=>figures(tree,'fr'));}
 {const tree=parse(pages[0].html);pick(tree).attrs=pick(tree).attrs.filter(a=>a.name!=='style');assert.throws(()=>figures(tree,'fr'));}
 for(const[field,value]of [['font-family','Other'],['font-size','1'],['x','0'],['fill','url(https://example.org/x)']]){const tree=parse(pages[0].html),label=nodes(pick(tree)).find(n=>n.tagName==='text');assert.ok(label);setAttribute(label,field,value);assert.throws(()=>figures(tree,'fr'));}
 {const tree=parse(pages[0].html),group=nodes(pick(tree)).find(n=>n.tagName==='g');assert.ok(group);setAttribute(group,'font-family','Other');assert.throws(()=>figures(tree,'fr'));}
 for(const type of ['script','foreignObject','image','animate']){const tree=parse(pages[0].html);pick(tree).childNodes.push({nodeName:type,tagName:type,attrs:[],childNodes:[]});assert.throws(()=>figures(tree,'fr'));}
 for(const type of ['text','title','desc','path']){const tree=parse(pages[0].html),n=nodes(pick(tree)).find(n=>n.tagName===type);assert.ok(n);if(type==='path')setAttribute(n,'d','M0 0 L9999 0');else n.childNodes=[{nodeName:'#text',value:'changed'}];assert.throws(()=>figures(tree,'fr'));}
});
