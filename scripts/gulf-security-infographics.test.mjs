import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {fromHtml} from 'hast-util-from-html';

// Glyph boxes measured in Chromium with the site's Inter/JetBrains fonts in the
// approved FR/EN desktop/mobile previews. Coordinates remain SVG user units.
// A changed label needs a fresh browser measurement; coordinates are checked live.
const metrics = {"gf-fr-1-d-title":[["RAS LAFFAN · 19.03.2026",0,-13.572,190.8383,16.965],["Deux trains de liquéfaction endommagés",0,-19.227,395.0365,23.751],["Train S4",-27.4267,-13.572,54.8534,16.965],["Train S6",-27.2411,-13.572,54.4823,16.965],["17 %",-52.6974,-45.2399,105.3949,58.8119],["du Qatar",-34.6633,-16.965,69.3267,21.489],["12,8 Mt/an",-45.5049,-16.965,91.01,21.489],["Réparations",0,-19.227,115.9803,23.751],["Estimation de l’opérateur",0,-13.572,163.4999,16.965],["0",-5.3987,-16.965,10.7975,21.489],["1",-3.4725,-16.965,6.945,21.489],["2",-5.1867,-16.965,10.3734,21.489],["3",-5.2662,-16.965,10.5324,21.489],["4",-5.5136,-16.965,11.0272,21.489],["5",-5.063,-16.965,10.126,21.489],["Années après les dommages",-190.7676,-13.572,190.7676,16.965]],"gf-fr-2-d-title":[["MOYEN-ORIENT · SEPT. 2026",0,-13.5718,207.4293,16.9647],["Avant-guerre = 100",0,-19.2267,187.1776,23.7506],["Produits raffinés",0,-19.2267,160.1401,23.7506],["40,4 %",0,-16.9647,63.3881,21.4887],["1,9 / 4,7 Mb/j",-103.1846,-16.9647,103.1845,21.4887],["GPL",0,-19.2267,39.0896,23.7506],["44,7 %",0,-16.9648,61.3912,21.4887],["0,67 / 1,5 Mb/j",-112.957,-16.9648,112.9569,21.4887],["Part du flux d’avant-guerre retrouvée",0,-13.5718,244.2923,16.9647]],"gf-fr-3-d-title":[["TRANSMISSION · SCHÉMA QUALITATIF",0,-13.5718,265.5159,16.9647],["Dommages",0,-19.2267,109.5816,23.7506],["Routes contraintes",0,-16.9648,150.0673,21.4887],["Carburants + fret",0,-19.2267,166.3251,23.7506],["Coûts des achats",0,-16.9648,139.0402,21.4887],["Budgets",0,-19.2267,80.3174,23.7506],["Effet rapide",0,-16.9647,99.7739,21.4887],["Gaz → engrais",0,-19.2267,137.8915,23.7506],["Intrants disponibles",0,-16.9648,157.2243,21.4887],["Récolte",0,-19.2267,72.7717,23.7506],["Effet différé",0,-16.9648,101.3997,21.4887],["AMORTISSEURS",0,-13.5718,99.5795,16.9647],["Stocks · substitution · soutien ciblé",0,-16.9648,278.9993,21.4887],["Les réserves amortissent le choc pendant la reconstruction.",0,-13.5718,395.0841,16.9647]],"gf-fr-1-m-title":[["RAS LAFFAN · 19.03.2026",0,-12.0673,177.0662,16.0898],["Deux trains endommagés",0,-16.0898,209.2615,20.1122],["Trains S4 + S6",-44.8833,-13.073,89.7666,16.0898],["GNL",0,-13.073,26.7116,16.0898],["17 %",0,-45.2525,105.4007,58.3255],["de la capacité",0,-15.0842,105.3535,19.1066],["du Qatar",0,-15.0842,65.2391,19.1066],["12,8 Mt/an indisponibles",0,-15.0842,187.248,19.1066],["Réparations : 3 à 5 ans",0,-16.0898,185.1111,20.1122],["0",-4.1246,-13.0729,8.2492,16.0898],["1",-2.6476,-13.0729,5.2952,16.0898],["2",-3.9596,-13.0729,7.9192,16.0898],["3",-4.0225,-13.0729,8.0449,16.0898],["4",-4.211,-13.0729,8.422,16.0898],["5",-3.8653,-13.0729,7.7306,16.0898],["Années après les dommages · estimation",0,-13.073,251.3558,16.0898]],"gf-fr-2-m-title":[["MOYEN-ORIENT · SEPT. 2026",0,-12.0673,192.4633,16.0897],["Avant-guerre = 100",0,-16.0897,158.9484,20.1121],["Produits raffinés",0,-16.0897,135.9766,20.1121],["40,4 %",0,-15.0841,56.3296,19.1065],["1,9 / 4,7 Mb/j",-97.0723,-15.0841,97.0723,19.1065],["GPL",0,-16.0896,33.2007,20.1121],["44,7 %",0,-15.084,54.5541,19.1065],["0,67 / 1,5 Mb/j",-106.2641,-15.084,106.2641,19.1065],["Part du flux d’avant-guerre retrouvée",0,-13.0728,226.7324,16.0897]],"gf-fr-3-m-title":[["TRANSMISSION · SCHÉMA",0,-12.0672,161.666,16.0896],["Dommages + routes",0,-16.0896,165.2013,20.112],["Offre contrainte",0,-15.084,119.1951,19.1064],["Carburants",-46.2341,-16.0896,92.4681,20.112],["Fret",-14.6598,-15.084,29.3195,19.1064],["Gaz",-16.0424,-16.0896,32.0849,20.112],["Engrais",-28.1332,-15.084,56.2665,19.1064],["Budgets",-34.104,-16.0896,68.208,20.112],["Récolte",-30.8986,-16.0896,61.7973,20.112],["Rapidement",-36.5551,-13.0728,73.1103,16.0896],["Plus tard",-26.8841,-13.0728,53.7682,16.0896],["Amortisseurs : stocks,",0,-15.084,172.649,19.1064],["substitution, soutien ciblé",0,-15.084,193.3267,19.1064]],"gf-en-1-d-title":[["RAS LAFFAN · 19.03.2026",0,-13.572,190.8383,16.965],["Two damaged liquefaction trains",0,-19.227,315.2304,23.751],["Train S4",-27.4267,-13.572,54.8534,16.965],["Train S6",-27.2411,-13.572,54.4823,16.965],["17%",-39.5231,-45.2399,79.0462,58.8119],["of Qatar",-32.6664,-16.965,65.3328,21.489],["12.8 Mt/year",-54.0582,-16.965,108.1164,21.489],["Repairs",0,-19.227,73.1084,23.751],["Operator’s estimate",0,-13.572,129.0045,16.965],["0",-5.3987,-16.965,10.7975,21.489],["1",-3.4725,-16.965,6.945,21.489],["2",-5.1867,-16.965,10.3734,21.489],["3",-5.2662,-16.965,10.5324,21.489],["4",-5.5136,-16.965,11.0272,21.489],["5",-5.063,-16.965,10.126,21.489],["Years after damage",-128.5273,-13.572,128.5273,16.965]],"gf-en-2-d-title":[["MIDDLE EAST · SEPT. 2026",0,-13.5718,199.1413,16.9647],["Pre-war = 100",0,-19.2267,135.983,23.7506],["Refined products",0,-19.2267,165.954,23.7506],["40.4%",0,-16.9647,58.8995,21.4887],["1.9 / 4.7 mb/d",-108.9985,-16.9647,108.9985,21.4887],["LPG",0,-19.2267,39.0896,23.7506],["44.7%",0,-16.9648,56.9026,21.4887],["0.67 / 1.5 mb/d",-118.7709,-16.9648,118.7709,21.4887],["Share of pre-war export flow restored",0,-13.5718,249.417,16.9647]],"gf-en-3-d-title":[["TRANSMISSION · QUALITATIVE SCHEMATIC",0,-13.5718,298.7032,16.9647],["Damage",0,-19.2267,79.7873,23.7506],["Constrained routes",0,-16.9648,153.1598,21.4887],["Fuel + freight",0,-19.2267,127.9601,23.7506],["Purchasing costs",0,-16.9648,138.0683,21.4887],["Budgets",0,-19.2267,80.3174,23.7506],["Near-term effect",0,-16.9647,144.6774,21.4887],["Gas → fertiliser",0,-19.2267,146.7627,23.7506],["Available inputs",0,-16.9648,125.8572,21.4887],["Harvest",0,-19.2267,76.1293,23.7506],["Delayed effect",0,-16.9648,125.2917,21.4887],["BUFFERS",0,-13.5718,58.0866,16.9647],["Inventories · substitution · targeted support",0,-16.9648,345.851,21.4887],["Inventories cushion the shock during industrial recovery.",0,-13.5718,373.7368,16.9647]],"gf-en-1-m-title":[["RAS LAFFAN · 19.03.2026",0,-12.0673,177.0662,16.0898],["Two damaged LNG trains",0,-16.0898,205.4905,20.1122],["Trains S4 + S6",-44.8833,-13.073,89.7666,16.0898],["LNG",0,-13.073,26.7116,16.0898],["17%",0,-45.2525,79.0505,58.3255],["of Qatar’s",0,-15.0842,73.2525,19.1066],["export capacity",0,-15.0842,117.9551,19.1066],["12.8 Mt/year unavailable",0,-15.0842,187.6409,19.1066],["Repairs: 3 to 5 years",0,-16.0898,167.3715,20.1122],["0",-4.1246,-13.0729,8.2492,16.0898],["1",-2.6476,-13.0729,5.2952,16.0898],["2",-3.9596,-13.0729,7.9192,16.0898],["3",-4.0225,-13.0729,8.0449,16.0898],["4",-4.211,-13.0729,8.422,16.0898],["5",-3.8653,-13.0729,7.7306,16.0898],["Years after damage · estimate",0,-13.073,182.3771,16.0898]],"gf-en-2-m-title":[["MIDDLE EAST · SEPT. 2026",0,-12.0673,184.7642,16.0897],["Pre-war = 100",0,-16.0897,115.4874,20.1121],["Refined products",0,-16.0897,140.9261,20.1121],["40.4%",0,-15.0841,52.3543,19.1065],["1.9 / 4.7 mb/d",-102.5559,-15.0841,102.556,19.1065],["LPG",0,-16.0896,33.2007,20.1121],["44.7%",0,-15.084,50.5788,19.1065],["0.67 / 1.5 mb/d",-111.7478,-15.084,111.7478,19.1065],["Share of pre-war export flow restored",0,-13.0728,231.4933,16.0897]],"gf-en-3-m-title":[["TRANSMISSION · SCHEMATIC",0,-12.0672,184.7634,16.0896],["Damage + routes",0,-16.0896,139.8884,20.112],["Constrained supply",0,-15.084,146.9277,19.1064],["Fuel",-17.1659,-16.0896,34.3318,20.112],["Freight",-26.2635,-15.084,52.5269,19.1064],["Gas",-15.9167,-16.0896,31.8335,20.112],["Fertiliser",-32.627,-15.084,65.254,19.1064],["Budgets",-34.104,-16.0896,68.208,20.112],["Harvest",-32.3285,-16.0896,64.657,20.112],["Near term",-30.6787,-13.0728,61.3573,16.0896],["Later",-15.6025,-13.0728,31.205,16.0896],["Buffers: inventories,",0,-15.084,155.7109,19.1064],["substitution, targeted support",0,-15.084,223.9661,19.1064]]};
const files = [
  '../src/content/posts/golfe-trump-promesse-securite-trahison-cout-mondial.md',
  '../src/content/posts-en/gulf-trump-security-betrayal-global-cost.md',
];
const svgs = files.flatMap(f => [...readFileSync(new URL(f,import.meta.url),'utf8').matchAll(/<svg\b[\s\S]*?<\/svg>/gu)].map(m=>m[0]));
function elements(node){return [node,...(node.children??[]).flatMap(elements)].filter(n=>n.type==='element');}
function text(node){return node.type==='text'?node.value:(node.children??[]).map(text).join('');}
function inspect(markup){
  const nodes=elements(fromHtml(markup,{fragment:true}));
  return {nodes,root:nodes.find(n=>n.tagName==='svg')};
}
function bounds(markup){
  const {nodes,root}=inspect(markup),[,,width,height]=root.properties.viewBox.split(' ').map(Number);
  const id=nodes.find(n=>n.tagName==='title').properties.id;
  const labels=nodes.filter(n=>n.tagName==='text');
  assert.equal(labels.length,metrics[id].length);
  const boxes=labels.map((n,i)=>{
    const [label,dx,dy,w,h]=metrics[id][i];assert.equal(text(n),label,'Re-measure changed glyphs');
    const x=Number(n.properties.x)+dx,y=Number(n.properties.y)+dy;
    assert.ok([x,y,w,h].every(Number.isFinite));
    assert.ok(x>=4&&y>=4&&x+w<=width-4&&y+h<=height-4,`Label outside canvas: ${label}`);
    return {x,y,w,h,label};
  });
  for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){
    const a=boxes[i],b=boxes[j];
    assert.ok(Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x)<=0 || Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y)<=0,`Text collision: ${a.label} / ${b.label}`);
  }
}
test('all bilingual layouts preserve the approved internal text spacing',()=>{
  assert.equal(svgs.length,12);for(const svg of svgs)bounds(svg);
});
test('bounds regression detects both off-canvas and internal collisions',()=>{
  assert.throws(()=>bounds(svgs[0].replace('x="24" y="29"','x="-100" y="29"')));
  assert.throws(()=>bounds(svgs[0].replace('x="24" y="64"','x="24" y="29"')));
});
test('September export bars represent separate comparable pre-war baselines',()=>{
  let charts=0;
  for(const svg of svgs){
    const {nodes}=inspect(svg);
    const bars=nodes.filter(n=>n.tagName==='rect'&&n.properties.className?.includes('fill-signal'));
    if(!bars.length)continue;charts++;
    const tracks=nodes.filter(n=>n.tagName==='rect'&&n.properties.className?.includes('track'));
    assert.equal(bars.length,2);assert.equal(tracks.length,2);
    [1.9/4.7,0.67/1.5].forEach((ratio,i)=>assert.ok(Math.abs(Number(bars[i].properties.width)/Number(tracks[i].properties.width)-ratio)<1e-10));
  }
  assert.equal(charts,4);
});
