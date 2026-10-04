import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';
import postcss from 'postcss';

// Original compositions frozen from supplied files, ignoring only semantic
// paints, ID namespaces and root responsive sizing. The eight annotation
// corrections below are individually verified before normalising their text.
const fixtures = {
  "frozen": {
    "ecb-1-fr-desktop.svg": "4ba549b878ecf1f02cf90f646a398dba265cdf86f4358b1ee536363250fa457f",
    "ecb-1-fr-mobile.svg": "68ba6d45e1ae268cc6b6ce571ed66d74079f2f103e47b250439098f671b417d4",
    "ecb-1-en-desktop.svg": "c6ee89848f1dddebff2bbd6027765626a4d565223afb70e932aac7fda17bd14f",
    "ecb-1-en-mobile.svg": "0ee4ffe129fec8d0c8f48d32ecb0e50cf39bb699c871abf0c6c6c90d8aa9876b",
    "ecb-2-fr-desktop.svg": "c9622340ac35ac67b607d6564e28ffad8c80ab695f06feb89948b49f8de504a6",
    "ecb-2-fr-mobile.svg": "b0cd0d289d97ecb9bcc05613bcb69b59b0ac9a1ded0de06238e9b5ebdd77e35a",
    "ecb-2-en-desktop.svg": "c743dbd77f4c1fa580b4fe624569e24dc3afd6cff3da0cb0010078a113f24c81",
    "ecb-2-en-mobile.svg": "79724df4b26d9aef24a1ca89f5dff4a641a2dc52f3c078a28aeb6acce030b380",
    "ecb-3-fr-desktop.svg": "96df4af04e70c2f6253c00319d5b7a9f25c9e2acf04649661efc998ac6c72aed",
    "ecb-3-fr-mobile.svg": "d56bc842e01b9ab1c2045e640d25422702927c28943f8cc6eaf5ae29e14a536d",
    "ecb-3-en-desktop.svg": "c3fdf6704bdc64938b79979949ec25aa05e0e72bb01796a9989c51946c956d02",
    "ecb-3-en-mobile.svg": "6a0ab470bf51124c3f7420b2f0a8134ce8726480ff35f329055de2d36bf2a24f",
    "ecb-4-fr-desktop.svg": "a1c1dc1c8d1198578732f6ea07693e56cce2d3dbdd01584ee7bb74bd87c8d406",
    "ecb-4-fr-mobile.svg": "33267d54ec5b442acea900efe8bfed8e5263d958e7d2210ebc9a4bddab36c160",
    "ecb-4-en-desktop.svg": "d9ddb49217b3b34ebe71a4e9cb0d48c1975c91f6b0e06d30cff26e152d8a6b72",
    "ecb-4-en-mobile.svg": "77a2fb1269bdebbe98f4c628285d6889296f6da6377642fc54a66dc0cf897149",
    "ecb-5-fr-desktop.svg": "fb0f8924387a18c41ac6d821e31bbb8e7b49bb62f378fba3910e2367cd74aed1",
    "ecb-5-fr-mobile.svg": "40fa051d9a27683f893b4815fd8ca115286204ceca63fd485b656726f9e88ced",
    "ecb-5-en-desktop.svg": "5ec1afab5958312009a699d1da8005e00e515d44f7be0d1ba93c2bcdfd06ce44",
    "ecb-5-en-mobile.svg": "ee43b2614fbc7fe0ff38663349ed9a896f8112bea9da3eca32928a57a6e8cb30",
    "ecb-6-fr-desktop.svg": "d8b0f2086b651891733f326c8f80227c368465dc50f7c126126379db0b090cfe",
    "ecb-6-fr-mobile.svg": "98acf6247a48eacfa8182efae2fb1c901859c4797d41ad0205049fa676f508e8",
    "ecb-6-en-desktop.svg": "b5d246ccb03228c37a6019f76a3eda985fd406ff6931e7590c7a47e59f04737f",
    "ecb-6-en-mobile.svg": "edd33f0367fb39d1a6386d2ac15800fef893b12f9f996a8c03401deee67ce8a8",
    "ecb-7-fr-desktop.svg": "dc7abe4ad522469129fbeedf03984b449bc3237abf17cbf2e64eb150c70cebc5",
    "ecb-7-fr-mobile.svg": "4c4e73c05addb3c151ac31ec38f08a64d6aea7d3d5a953d48fa9e0f848a7bda5",
    "ecb-7-en-desktop.svg": "2e8475fe375fe770a92cce356a758798b2a3aadb27c168890b235cdb662d772a",
    "ecb-7-en-mobile.svg": "63f87ba70d7b21a7ae503c522d72d1c02522b9e1f24e368498ee6461c21cb419"
  },
  "corrections": {
    "ecb-4-fr-desktop.svg": [
      {
        "x": "54.00",
        "y": "922.90",
        "fontSize": "17",
        "fontWeight": "400",
        "before": "Source : BCE/2026/27, art. 5 et tableau 3, p. 11 [3]. La couverture de 82 ou 73 M€ est calculée à la date initiale, avant les",
        "after": "Source : BCE/2026/27, art. 1(5) · tableau 3, p. 11 [3]. Couverture initiale : 82 ou 73 M€,"
      },
      {
        "x": "54.00",
        "y": "945.00",
        "fontSize": "17",
        "fontWeight": "400",
        "before": "remboursements illustrés.",
        "after": "avant les remboursements illustrés."
      }
    ],
    "ecb-4-fr-mobile.svg": [
      {
        "x": "28.00",
        "y": "1141.00",
        "fontSize": "15",
        "fontWeight": "400",
        "before": "Source : BCE/2026/27, art. 5 et tableau 3, p. 11 [3]. La",
        "after": "Source : BCE/2026/27, art. 1(5) · tableau 3, p. 11 [3]."
      },
      {
        "x": "28.00",
        "y": "1160.50",
        "fontSize": "15",
        "fontWeight": "400",
        "before": "couverture de 82 ou 73 M€ est calculée à la date initiale,",
        "after": "Couverture initiale : 82 ou 73 M€, avant les"
      },
      {
        "x": "28.00",
        "y": "1180.00",
        "fontSize": "15",
        "fontWeight": "400",
        "before": "avant les remboursements illustrés.",
        "after": "remboursements illustrés."
      }
    ],
    "ecb-4-en-desktop.svg": [
      {
        "x": "54.00",
        "y": "922.90",
        "fontSize": "17",
        "fontWeight": "400",
        "before": "Source: ECB/2026/27, Article 5 and table 3, p. 11 [3]. The €82m or €73m coverage is measured initially, before the illustrated",
        "after": "Source: ECB/2026/27, Art. 1(5) · table 3, p. 11 [3]. Initial coverage: €82m or €73m,"
      },
      {
        "x": "54.00",
        "y": "945.00",
        "fontSize": "17",
        "fontWeight": "400",
        "before": "repayments.",
        "after": "before the illustrated repayments."
      }
    ],
    "ecb-4-en-mobile.svg": [
      {
        "x": "28.00",
        "y": "1141.00",
        "fontSize": "15",
        "fontWeight": "400",
        "before": "Source: ECB/2026/27, Article 5 and table 3, p. 11 [3]. The",
        "after": "Source: ECB/2026/27, Art. 1(5) · table 3, p. 11 [3]."
      },
      {
        "x": "28.00",
        "y": "1160.50",
        "fontSize": "15",
        "fontWeight": "400",
        "before": "€82m or €73m coverage is measured initially, before the",
        "after": "Initial coverage: €82m or €73m, before the"
      }
    ],
    "ecb-5-fr-desktop.svg": [
      {
        "x": "54.00",
        "y": "494.00",
        "fontSize": "25",
        "fontWeight": "700",
        "before": "Obligation sécurisée · échéance 6 ans",
        "after": "Obligation sécurisée · coupon fixe · échéance 6 ans"
      },
      {
        "x": "54.00",
        "y": "714.00",
        "fontSize": "25",
        "fontWeight": "700",
        "before": "ABS · durée de vie moyenne pondérée 6 ans",
        "after": "ABS · tranche senior · vie moyenne pondérée 6 ans"
      }
    ],
    "ecb-5-fr-mobile.svg": [
      {
        "x": "28.00",
        "y": "757.60",
        "fontSize": "21",
        "fontWeight": "700",
        "before": "Obligation sécurisée · échéance 6 ans",
        "after": "Obligation sécurisée · coupon fixe · 6 ans"
      },
      {
        "x": "28.00",
        "y": "1033.60",
        "fontSize": "21",
        "fontWeight": "700",
        "before": "ABS · durée de vie moyenne pondérée",
        "after": "ABS · tranche senior · vie moyenne"
      },
      {
        "x": "28.00",
        "y": "1059.85",
        "fontSize": "21",
        "fontWeight": "700",
        "before": "6 ans",
        "after": "pondérée 6 ans"
      }
    ],
    "ecb-5-en-desktop.svg": [
      {
        "x": "54.00",
        "y": "494.00",
        "fontSize": "25",
        "fontWeight": "700",
        "before": "Covered bond · 6-year maturity",
        "after": "Covered bond · fixed coupon · 6-year maturity"
      },
      {
        "x": "54.00",
        "y": "714.00",
        "fontSize": "25",
        "fontWeight": "700",
        "before": "ABS · 6-year weighted average life",
        "after": "ABS · senior tranche · 6-year weighted average life"
      }
    ],
    "ecb-5-en-mobile.svg": [
      {
        "x": "28.00",
        "y": "793.30",
        "fontSize": "21",
        "fontWeight": "700",
        "before": "Covered bond · 6-year maturity",
        "after": "Covered bond · fixed coupon · 6-year maturity"
      },
      {
        "x": "28.00",
        "y": "1069.30",
        "fontSize": "21",
        "fontWeight": "700",
        "before": "ABS · 6-year weighted average life",
        "after": "6-year weighted average life"
      }
    ]
  },
  "extra": {
    "ecb-5-en-mobile.svg": {
      "attributes": {
        "x": "28.00",
        "y": "1044.30",
        "fontFamily": "DejaVu Sans,Arial,sans-serif",
        "fontSize": "21",
        "fontWeight": "700",
        "textAnchor": "start"
      },
      "text": "ABS · senior tranche"
    }
  }
};
const base = resolve('public/infographies/ecb-collateral');
const sourceNames = Object.keys(fixtures.frozen);
const read = name => readFileSync(resolve(base,name),'utf8');
const walk = n => [n,...(n.children??[]).flatMap(walk)];
const elements = n => walk(n).filter(v=>v.type==='element');
const parse = source => fromHtml(source,{fragment:true});
const normal = s => String(s).replace(/\s+/gu,' ').trim();
const primitiveTags = new Set(['svg','title','desc','defs','marker','path','rect','text','line','circle','style']);
const attrs = new Set('xmlns viewBox width height role ariaLabelledBy id markerWidth markerHeight refX refY orient d fill x y rx fontFamily fontSize fontWeight textAnchor x1 y1 x2 y2 stroke strokeWidth strokeDashArray cx cy r markerEnd style dataSourceComposition dataFigure dataCropStart dataCropEnd dataPanel'.split(' '));
const cuts = {fr:[[0,303,790,990],[0,645,1280],[0,725,1180],[0,738,1200],[0,721,996,1490],[0,567,1170],[0,740,1340]],en:[[0,303,790,990],[0,645,1280],[0,725,1180],[0,738,1200],[0,740,1010,1490],[0,532,1170],[0,704,1340]]};
const allFiles = [...readdirSync(base).filter(f=>f.endsWith('.svg')).map(f=>f),...readdirSync(resolve(base,'panels')).filter(f=>f.endsWith('.svg')).map(f=>'panels/'+f)];
const parsed = new Map(allFiles.map(name=>[name,parse(read(name))]));

function compositionHash(tree,name) {
  const omitted = new Set(['id','ariaLabelledBy','fill','stroke','markerEnd','style']);
  const corrections = fixtures.corrections[name]??[];
  const seen = new Set();
  function visit(n,root=false){
    if(n.type==='text')return normal(n.value);
    if(n.type!=='element'||n.tagName==='style')return null;
    const props=Object.fromEntries(Object.entries(n.properties).filter(([k])=>!omitted.has(k)&&!k.startsWith('data')&&!(root&&['width','height'].includes(k))).sort(([a],[b])=>a.localeCompare(b)));
    if(n.tagName==='text'){
      const extra=fixtures.extra[name];
      if(extra&&normal(toText(n))===extra.text){
        assert.deepEqual(Object.fromEntries(Object.entries(n.properties).filter(([k])=>k!=='fill')),extra.attributes);
        seen.add('extra');return null;
      }
      const changed=corrections.find(c=>c.x===n.properties.x&&c.y===n.properties.y);
      if(changed){
        assert.equal(normal(toText(n)),changed.after);assert.equal(n.properties.fontSize,changed.fontSize);assert.equal(n.properties.fontWeight,changed.fontWeight);
        seen.add(changed.y);return[n.tagName,props,[changed.before]];
      }
    }
    return[n.tagName,props,(n.children??[]).map(c=>visit(c)).filter(v=>v!==null&&v!=='')];
  }
  const signature=createHash('sha256').update(JSON.stringify(visit(elements(tree)[0],true))).digest('hex');
  assert.equal(seen.size,corrections.length+(fixtures.extra[name]?1:0),'Every approved annotation must be present');
  return signature;
}

test('all 92 controlled SVG files are inert XML with accessible names and local references',()=>{
  assert.equal(allFiles.length,92);assert.equal(sourceNames.length,28);const globalIds=new Set();
  for(const [name,tree] of parsed){
    const source=read(name);assert.equal(XMLValidator.validate(source),true,name);assert.ok(!source.includes('<!DOCTYPE')&&!source.includes('<?'),name);
    const nodes=elements(tree),svg=nodes[0];assert.equal(svg.tagName,'svg');assert.equal(svg.properties.role,'img');
    const ids=nodes.filter(n=>n.properties.id).map(n=>n.properties.id);assert.equal(ids.length,new Set(ids).size,name);
    for(const id of ids){assert.match(id,/^ecb2026-[1-7]-(?:fr|en)-/u);assert.ok(!globalIds.has(id),id);globalIds.add(id);}
    for(const id of svg.properties.ariaLabelledBy){assert.ok(ids.includes(id));}
    assert.equal(nodes.filter(n=>n.tagName==='title').length,1);assert.equal(nodes.filter(n=>n.tagName==='desc').length,1);
    for(const n of nodes){assert.ok(primitiveTags.has(n.tagName),name+':'+n.tagName);for(const[k,v]of Object.entries(n.properties)){assert.ok(attrs.has(k),k);assert.ok(!k.toLowerCase().startsWith('on'));
      if(String(v).includes('url(')){const match=/^url\(#([\w-]+)\)$/u.exec(String(v));assert.ok(match,k);assert.ok(ids.includes(match[1]));}
    }if(n.properties.fontFamily)assert.equal(n.properties.fontFamily,'DejaVu Sans,Arial,sans-serif');}
    assert.equal(svg.properties.style,'width:100%;height:auto');
  }
});

test('complete exports and inline diagrams preserve original compositions, with only approved annotation corrections',()=>{
  for(const name of sourceNames)assert.equal(compositionHash(parsed.get(name),name),fixtures.frozen[name],name);
  for(const lang of ['fr','en']){
    const file=lang==='fr'?'src/content/posts/bce-garanties-banques-credit-novembre-2026.mdx':'src/content/posts-en/ecb-collateral-bank-credit-november-2026.mdx';
    const nodes=elements(parse(readFileSync(file,'utf8'))),svgNodes=nodes.filter(n=>n.tagName==='svg');assert.equal(svgNodes.length,7);
    for(let fig=1;fig<=7;fig++)assert.equal(compositionHash({type:'root',children:[svgNodes[fig-1]]},`ecb-${fig}-${lang}-desktop.svg`),fixtures.frozen[`ecb-${fig}-${lang}-desktop.svg`]);
  }
});

test('palette roles inherit exact global dark/light tokens and exports contain no old palette',()=>{
  const global=postcss.parse(readFileSync('src/styles/global.css','utf8')),native={dark:{},light:{}};
  global.walkDecls(d=>{if(d.parent.type==='atrule'&&d.parent.name==='theme')native.dark[d.prop]=d.value;if(d.parent.selector===':root[data-theme="light"]')native.light[d.prop]=d.value;});
  const css=postcss.parse(readFileSync('src/styles/ecb-collateral.css','utf8'));let aliases=0;
  css.walkDecls(d=>{if(d.prop.startsWith('--ecb-')){const role=d.prop.slice(6);assert.ok(d.value.startsWith('var(--color-'+role+','));aliases++;}});assert.equal(aliases,18);
  const clean=v=>String(v).replace(/\s+/gu,'').toLowerCase();
  for(const[name,tree]of parsed){const nodes=elements(tree),theme=name.endsWith('.light.svg')?'light':'dark';
    for(const n of nodes)for(const key of ['fill','stroke']){const value=n.properties[key];if(!value||value==='none')continue;
      if(name.startsWith('panels/'))assert.ok(Object.values(native[theme]).some(v=>clean(v)===clean(value)),name+':'+value);
      else assert.match(value,/^var\(--ecb-(?:ink|surface|surface-2|paper|muted|signal|amber|topic-blue|line-strong)\)$/u);
    }
    if(!name.startsWith('panels/')){const style=nodes.find(n=>n.tagName==='style');assert.ok(style);const declarations=postcss.parse(toText(style));let count=0;declarations.walkDecls(d=>{if(d.prop==='color-scheme'){assert.ok(['dark','light'].includes(d.value));return;}assert.ok(d.prop.startsWith('--ecb-'));const t=d.parent.parent?.type==='atrule'?'light':'dark';assert.equal(clean(d.value),clean(native[t]['--color-'+d.prop.slice(6)]));count++;});assert.equal(count,18);}
  }
});

test('mobile source modules are covered once by complete contiguous crops, capped below 500px',()=>{
  const css=readFileSync('src/styles/ecb-collateral.css','utf8');assert.match(css,/max-width:\s*350px/u);assert.match(css,/scroll-snap-type:\s*x mandatory/u);assert.match(css,/prefers-reduced-motion/u);
  for(const lang of ['fr','en'])for(let fig=1;fig<=7;fig++){
    const source=parsed.get(`ecb-${fig}-${lang}-mobile.svg`),nodes=elements(source),boundary=cuts[lang][fig-1];const height=Number(nodes[0].properties.viewBox.split(' ')[3]);assert.equal(boundary[0],0);assert.equal(boundary.at(-1),height);
    for(let panel=1;panel<boundary.length;panel++)for(const theme of ['dark','light']){
      const tree=parsed.get(`panels/ecb-${fig}-${lang}-p${panel}.${theme}.svg`),svg=elements(tree)[0],start=boundary[panel-1],end=boundary[panel];assert.equal(svg.properties.viewBox,`0 ${start} 520 ${end-start}`);assert.ok((end-start)*350/520<500);
      for(const rect of nodes.filter(n=>n.tagName==='rect'&&Number(n.properties.rx)>0)){const y=Number(rect.properties.y),bottom=y+Number(rect.properties.height);assert.ok(!(y<start&&start<bottom)&&!(y<end&&end<bottom),'crop must not cross a card');}
      // A crop changes only its viewport/title/desc and paints; every source
      // primitive and numerical path remains present in the external SVG.
      assert.equal(elements(tree).filter(n=>!['style'].includes(n.tagName)).length,nodes.filter(n=>n.tagName!=='style').length);
    }
  }
});

test('drawn quantities and proportions preserve the teaching examples and official-rate comparisons',()=>{
  const near=(a,b)=>assert.ok(Math.abs(a-b)<.011,`${a} != ${b}`);
  for(const lang of ['fr','en']){
    const mobile=fig=>elements(parsed.get(`ecb-${fig}-${lang}-mobile.svg`));
    const signal=fig=>mobile(fig).filter(n=>n.tagName==='rect'&&n.properties.fill==='var(--ecb-signal)');
    const bars1=signal(1);assert.equal(bars1.length,3);[95,89.3,84.6].forEach((v,i)=>near(Number(bars1[i].properties.width)/380*100,v));
    const bars3=signal(3);assert.equal(bars3.length,2);[88,80].forEach((v,i)=>near(Number(bars3[i].properties.width)/365*100,v));
    const bars4=mobile(4).filter(n=>n.tagName==='rect'&&['var(--ecb-signal)','var(--ecb-topic-blue)'].includes(n.properties.fill));[82,73].forEach((v,i)=>near(Number(bars4[i].properties.width)/365*100,v));
    const bars5=signal(5);assert.equal(bars5.length,4);[96.5,87,94,90].forEach((v,i)=>near(Number(bars5[i].properties.width)/365*100,v));
    const bars6=signal(6).filter(n=>Number(n.properties.height)===30);assert.equal(bars6.length,4);[50,40,15,5].forEach((v,i)=>near(Number(bars6[i].properties.width)/3.2,v));
    const values=normal(toText(parsed.get(`ecb-6-${lang}-mobile.svg`)));assert.ok(values.includes(lang==='fr'?'66,7 %':'66.7%'));assert.ok(values.includes(lang==='fr'?'12 M€':'€12m'));
    const all5=normal(toText(parsed.get(`ecb-5-${lang}-mobile.svg`)));assert.ok(all5.includes(lang==='fr'?'coupon fixe':'fixed coupon'));assert.ok(all5.includes(lang==='fr'?'tranche senior':'senior tranche'));
    const all4=normal(toText(parsed.get(`ecb-4-${lang}-mobile.svg`)));assert.ok(all4.includes(lang==='fr'?'art. 1(5)':'Art. 1(5)'));
  }
});

test('article galleries remain accessible without script and keep scope, data tables and integral links',()=>{
  for(const lang of ['fr','en']){
    const file=lang==='fr'?'src/content/posts/bce-garanties-banques-credit-novembre-2026.mdx':'src/content/posts-en/ecb-collateral-bank-credit-november-2026.mdx';const nodes=elements(parse(readFileSync(file,'utf8')));
    const classed=(n,c)=>n.properties.className?.includes(c),figures=nodes.filter(n=>n.tagName==='figure'&&classed(n,'ecb-figure'));assert.equal(figures.length,7);
    for(let fig=1;fig<=7;fig++){
      const children=elements(figures[fig-1]),count=cuts[lang][fig-1].length-1,gallery=children.find(n=>classed(n,'ecb-gallery'));assert.equal(gallery.properties.role,'region');assert.equal(gallery.properties.tabIndex,0);assert.ok(gallery.properties.ariaLabel&&gallery.properties.ariaDescribedBy);
      const panels=children.filter(n=>classed(n,'ecb-panel'));assert.equal(panels.length,count);
      for(let p=1;p<=count;p++){assert.equal(panels[p-1].properties.id,`ecb2026-${fig}-${lang}-p${p}`);assert.ok(children.some(n=>n.tagName==='a'&&n.properties.href===`#ecb2026-${fig}-${lang}-p${p}`));}
      const images=children.filter(n=>n.tagName==='img');assert.equal(images.length,count*2);for(const image of images){assert.ok(image.properties.alt.length>80);assert.equal(Number(image.properties.width),520);assert.ok(image.properties.src.startsWith('/infographies/ecb-collateral/panels/'));}
      assert.ok(children.some(n=>n.tagName==='a'&&n.properties.href===`/infographies/ecb-collateral/ecb-${fig}-${lang}-mobile.svg`));assert.ok(children.some(n=>n.tagName==='table'));assert.ok(children.some(n=>classed(n,'ecb-figure-scope')));
      assert.ok(!children.some(n=>n.tagName==='script'));
    }
  }
});
