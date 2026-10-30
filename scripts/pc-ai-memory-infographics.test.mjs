import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import test from 'node:test';
import { PC_AI_MEMORY_KINDS, PC_AI_MEMORY_SOURCES, pcAiMemoryFigureReferences } from '../src/lib/PcAiMemoryFigures.mjs';
import { pcAiMemoryScenes, inspectPcAiMemorySvg, assertPcAiMemoryGeometry, tag, attrs, content } from './pc-ai-memory-svg-assertions.mjs';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';
const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const all = scene => inspectPcAiMemorySvg(scene.svg).all;
const labels = scene => all(scene).filter(n => tag(n) === 'text').map(content).join(' ');
const close = (a,b) => assert.ok(Math.abs(Number(a)-b)<.00002,`${a} differs from ${b}`);
const metric = (scene, name) => { const matches=all(scene).filter(n=>attrs(n)['data-metric']===name);assert.equal(matches.length,1);return attrs(matches[0]); };
test('twenty bilingual passive vectors have compact responsive geometry and semantic themes', () => {
  assert.equal(pcAiMemoryScenes().length,20);assert.equal(readdirSync(new URL('../src/figures/pc-ai-memory/',import.meta.url)).length,20);
  for(const scene of pcAiMemoryScenes()) {
    assertPcAiMemoryGeometry(scene.svg);assert.equal(attrs(all(scene).find(n=>tag(n)==='rect')).fill,'var(--color-ink)');
    assert.doesNotMatch(scene.svg,/—|horlog|clock|#[0-9a-f]{3,8}\b/iu);
    assert.doesNotMatch(content(all(scene).find(n=>tag(n)==='title')),/\bce (?:que|qui|qu[’'])|\bwhat\b/iu);
    for(const text of all(scene).filter(n=>tag(n)==='text'))assert.ok(Number(attrs(text)['font-size'])*(scene.mobile?280/420:501/1000)>=11);
  }
});
test('the observed index retains all33monthly points without smoothing or invented attribution', () => {
  const values=[103.61,104.79,104.85,104.21,105.11,105.83,101.50,107.12,101.90,107.41,104.35,102.70,101.27,101.19,101.65,99.90,101.78,101.72,96.24,99.88,96.41,99.82,99.13,101.02,98.01,101.42,102.33,104.23,102.39,102.91,101.49,103.68,102.38];
  for(const scene of pcAiMemoryScenes().filter(s=>s.kind==='index')) {
    assert.equal(all(scene).filter(n=>(attrs(n)['data-metric']??'').startsWith('index-')).length,33);
    for(const[i,v]of values.entries()) { const point=metric(scene,'index-'+i);close(point['data-value'],v);close(point.cx,(scene.mobile?62:90)+i/32*(scene.mobile?328:855));close(point.cy,(scene.mobile?490:480)-(v-94)/16*(scene.mobile?220:225)); }
    assert.match(labels(scene),/94/);assert.match(labels(scene),/110/);assert.match(labels(scene),/2024/);assert.match(labels(scene),/2025/);assert.match(labels(scene),/2026/);
    const description=content(all(scene).find(n=>tag(n)==='desc'));assert.match(description,/011816928/);assert.match(description,/33/);
  }
  close((102.38/96.41-1)*100,6.192303702935);
  close((102.38/101.9-1)*100,.4710500490677);
});
test('Micron comparison shows one versus three relative wafer-resource units for equal bits', () => {
  for(const scene of pcAiMemoryScenes().filter(s=>s.kind==='wafers')) {
    close(metric(scene,'wafer-ddr')['data-value'],1);
    for(let i=0;i<3;i++){close(metric(scene,'wafer-hbm-'+i)['data-value'],1);assert.equal(metric(scene,'wafer-hbm-'+i).r,metric(scene,'wafer-ddr').r);}
    assert.match(labels(scene),/DDR5/);assert.match(labels(scene),/HBM3E/);assert.match(labels(scene),/~ 3/);
    const desc=content(all(scene).find(n=>tag(n)==='desc'));assert.match(desc,/2024/);assert.match(desc,/Micron/);assert.match(desc,/DDR5/);assert.match(desc,/HBM3E/);
  }
});
test('the supply-chain diagram keeps DRAM and NAND separate and three downstream responses', () => {
  for(const scene of pcAiMemoryScenes().filter(s=>s.kind==='chain')) {
    const text=labels(scene);for(const word of ['DRAM','NAND','HBM','SSD'])assert.match(text,new RegExp(word));
    assert.match(text,scene.lang==='fr'?/Contrats et stocks/:/Contracts/);assert.match(text,/Configuration/);assert.match(text,scene.lang==='fr'?/Marge/:/Margin/);
    const paths=all(scene).filter(n=>tag(n)==='path').map(n=>attrs(n).d);
    assert.ok(paths.includes(scene.mobile?'M 403 571 L 394 577 L 403 583':'M 707 209 L 716 215 L 707 221'),'Right/left arrowheads point toward output cards');
    assert.match(content(all(scene).find(n=>tag(n)==='desc')),scene.lang==='fr'?/qualitatives/:/qualitative/i);
  }
});
test('HP units and ASP indices remain distinct from reported revenue and constant-quality inflation', () => {
  for(const scene of pcAiMemoryScenes().filter(s=>s.kind==='average')) {
    for(const[i,v]of[84.2,140.8,118.5].entries()){const bar=metric(scene,'hp-'+i);close(bar['data-value'],v);close(scene.mobile?bar.width:bar.height,(scene.mobile?330:280)*v/150);}
    const desc=content(all(scene).find(n=>tag(n)==='desc'));assert.match(desc,/2026/);assert.match(desc,/2025/);assert.match(desc,scene.lang==='fr'?/mondial/:/worldwide/i);
  }
  close(.842*1.408,1.185536);
});
test('fictional price pass-through preserves cost doubling,60/40allocation and1090finalprice', () => {
  for(const scene of pcAiMemoryScenes().filter(s=>s.kind==='model')) {
    close(metric(scene,'exposed-0')['data-value'],150);close(metric(scene,'exposed-1')['data-value'],300);close(metric(scene,'passed')['data-value'],90);close(metric(scene,'absorbed')['data-value'],60);
    close(Number(metric(scene,'passed').width)/Number(metric(scene,'absorbed').width),1.5);
    assert.match(labels(scene),/1 000/);assert.match(labels(scene),/1 090/);assert.match(content(all(scene).find(n=>tag(n)==='desc')),scene.lang==='fr'?/ficti/:/fiction/i);
  }
});
test('closed figure contract rejects unsupported metadata, source changes and language injection', () => {
  for(const lang of['fr','en'])for(const[i,kind]of PC_AI_MEMORY_KINDS.entries())assert.deepEqual(pcAiMemoryFigureReferences(lang,kind,i+1,[...PC_AI_MEMORY_SOURCES[i]],'Caption','Method'),PC_AI_MEMORY_SOURCES[i]);
  for(const lang of[undefined,null,{},new String('fr'),'__proto__'])assert.throws(()=>pcAiMemoryFigureReferences(lang,'index',1,PC_AI_MEMORY_SOURCES[0],'Caption','Method'));
  for(const refs of[[],['R01'],['R01','R01','R16','R17'],['R01','R03','R16','R17" onload="x']])assert.throws(()=>pcAiMemoryFigureReferences('fr','index',1,refs,'Caption','Method'));
  assert.throws(()=>pcAiMemoryFigureReferences('fr','model',5,[],'','Method'));
});
test('passive geometry assertions reject scripts, foreign assets, overflow and missing panel ownership', () => {
  const scene=pcAiMemoryScenes().find(s=>s.lang==='fr'&&s.kind==='wafers'&&!s.mobile).svg;
  for(const edit of[s=>s.replace('</svg>','<script>x</script></svg>'),s=>s.replace('<svg ','<svg onload="x" '),s=>s.replace('</svg>','<image href="https://example.com/a"/></svg>'),s=>s.replace('l0g PC AI Memory','Arial'),s=>s.replace('data-panel="pc-ai-fr-wafers-d-card-ddr"','data-panel="missing"'),s=>s.replace('x="64" y="227"','x="995" y="227"')])assert.throws(()=>assertPcAiMemoryGeometry(edit(scene)));
});
test('component preserves responsive methods, controlled raw imports and existing licensed fonts', () => {
  const component=read('src/components/PcAiMemoryFigure.astro');for(const weight of[400,700]){const p='public/fonts/stablecoins/dejavu-sans-'+weight+'.ttf';assert.ok(component.includes(p.replace('public','')));assert.equal(createHash('sha256').update(readFileSync(new URL('../'+p,import.meta.url))).digest('hex'),weight===400?'98f2d74db16bb5f41f74adf6d899aeec92861682cccc58bfdbe4d9d7d0a5ae11':'21a0350a4ac2a9f22b6a7a8dcaf6abb08c8b546d06499301f1fcf10996fd0df5');}
  assertFontLicenseReferences(read('public/fonts/stablecoins/LICENSE.txt'),'dejavu');assert.match(component,/max-width:\s*48rem/u);assert.match(component,/@container\s*\(max-width:\s*500px\)/u);assert.match(component,/padding-bottom:\s*1rem/u);assert.doesNotMatch(component,/overflow\s*:\s*(?:hidden|clip)|client:|<script|fetch\(/iu);
});
