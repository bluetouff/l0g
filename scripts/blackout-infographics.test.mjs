import assert from 'node:assert/strict';
import {readFileSync, readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import test from 'node:test';
import {blackoutFigureReferences} from '../src/lib/blackoutFigures.mjs';
import {BLACKOUT_KINDS,BLACKOUT_SOURCES,blackoutScenes,inspectBlackoutSvg,assertBlackoutGeometry,tag,attrs,content,labelBox,fontLineBox} from './blackout-svg-assertions.mjs';
import {pathPoints} from './insurance-returns-svg-assertions.mjs';
import {assertFontLicenseReferences} from './font-license-assertions.mjs';
const read=p=>readFileSync(new URL(`../${p}`,import.meta.url),'utf8');
const close=(a,b)=>assert.ok(Math.abs(Number(a)-b)<.000002,`${a} matches ${b}`);
test('all24 passive scenes retain compact readable bilingual mechanisms and native theme adaptation',()=>{
 const scenes=blackoutScenes();assert.equal(scenes.length,24);assert.equal(readdirSync(new URL('../src/figures/blackout-autonomy/',import.meta.url)).length,24);
 for(const s of scenes){assertBlackoutGeometry(s.svg);const{root,all}=inspectBlackoutSvg(s.svg),labels=all.filter(n=>tag(n)==='text').map(content).join(' '),cards=all.filter(n=>tag(n)==='rect'&&attrs(n).id?.includes('-card-')),bars=all.filter(n=>tag(n)==='rect'&&!attrs(n).id);assert.doesNotMatch(content(all.find(n=>tag(n)==='title')),/\bce (?:que|qui|qu[’'])|\bwhat\b|horlog|clock/iu);assert.doesNotMatch(s.svg,/<defs|<pattern|<g\b|transform=|#[0-9a-f]{3,8}\b|—|foreignObject/iu);assert.ok(all.filter(n=>tag(n)==='text').every(n=>Number(attrs(n)['font-size'])*(s.mobile?280/420:501/1000)>=11));
  if(s.kind==='purchase'){assert.equal(cards.length,7);for(const word of s.lang==='fr'?['Commerce accessible','Produit disponible','Prix établi','Carte en ligne','Carte hors ligne','Espèces','ET','Bien remis au client']:['Accessible shop','Available goods','Price established','Online card','Offline card','Cash','AND','Goods received'])assert.ok(labels.includes(word),word);assert.equal(all.filter(n=>tag(n)==='path').length,18,'Explanatory icons and real conjunction/alternative connectors remain');}
  if(s.kind==='cards'){assert.equal(cards.length,1);assert.equal(bars.length,10);for(let i=0;i<5;i++){close(attrs(bars[2*i]).width,(s.mobile?292:350)*[225,148,69,43,32][i]/250);close(attrs(bars[2*i+1]).width,(s.mobile?292:350)*[147,45,26,23,19][i]/250);}for(const value of['−55 %','−35 %','−69 %','−62 %','−46 %','−41 %'])assert.ok(labels.includes(value));assert.ok(labels.includes(s.lang==='fr'?'756,8 → 340,2 M€':'€756.8m → €340.2m'));assert.match(labels,s.lang==='fr'?/arrondis/u:/rounded/u);assert.equal(attrs(root).viewBox,`0 0 ${s.mobile?'420 1080':'1000 720'}`);}
  if(s.kind==='restoration'){assert.equal(cards.length,4);for(const end of['power','telecom','teams','access'])assert.ok(cards.some(n=>attrs(n).id.endsWith('-'+end)));assert.equal(all.filter(n=>tag(n)==='path').length,s.mobile?18:15);assert.match(labels,s.lang==='fr'?/alimente/u:/powers/u);assert.match(labels,s.lang==='fr'?/réparent/u:/repairs/u);assert.match(labels,s.lang==='fr'?/coordonnent/u:/coordinates/u);}
  if(s.kind==='rte'){assert.equal(cards.length,2);for(const value of['150','130','2028','2029','2025'])assert.ok(labels.includes(value));assert.match(labels,s.lang==='fr'?/documenter/u:/documented/u);for(const i of[0,1]){const id=attrs(cards[i]).id,own=all.filter(n=>tag(n)==='text'&&attrs(n)['data-panel']===id).map(content).join(' ');assert.ok(own.includes(i?'130':'150'));assert.ok(own.includes(i?'2029':'2028'));}}
  if(s.kind==='offline'){assert.equal(cards.length,6);for(const i of[0,1,2])assert.ok(cards.some(n=>attrs(n).id.endsWith('-offline-'+i))&&cards.some(n=>attrs(n).id.endsWith('-return-'+i)));assert.match(labels,/PIN/);assert.match(labels,s.lang==='fr'?/Commerçant/u:/Merchant/u);assert.match(labels,s.lang==='fr'?/Envoi via le terminal/u:/Sends via the terminal/u);assert.match(labels,/7/);assert.match(labels,s.lang==='fr'?/Risque émetteur/u:/Issuer risk/u);assert.match(labels,s.lang==='fr'?/cumul/u:/cumulative|card total/u);assert.match(content(all.find(n=>tag(n)==='desc')),s.lang==='fr'?/trésorerie/u:/liquidity|funding/u);}
  if(s.kind==='preparedness'){assert.equal(bars.length,6);const width=s.mobile?372:400;for(const[i,v]of[90,31,29].entries()){close(attrs(bars[i*2]).width,width);close(attrs(bars[i*2+1]).width,width*v/100);assert.ok(labels.includes(v+' %'));}assert.match(labels,/1[ ,]056/);assert.match(labels,/42–43/);assert.match(labels,s.lang==='fr'?/déclarée|déclaratives/u:/self-reported|Self-reported/u);assert.match(labels,s.lang==='fr'?/indépendantes|distinctes/u:/independent|separate/u);}
 }
});
test('closed bilingual figure contract rejects invalid or misleading source and sequence substitutions',()=>{
 for(const lang of['fr','en'])for(let i=0;i<6;i++)assert.deepEqual(blackoutFigureReferences(lang,BLACKOUT_KINDS[i],`0${i+1}`,BLACKOUT_SOURCES[i],'Caption'),BLACKOUT_SOURCES[i].split(' '));
 for(const lang of[undefined,null,{},new String('fr'),'__proto__'])assert.throws(()=>blackoutFigureReferences(lang,'purchase','01','S03 S22','Caption'));
 for(const refs of['','S03','S22 S03','S03 S03','S03 S22 S05','S99'])assert.throws(()=>blackoutFigureReferences('fr','purchase','01',refs,'Caption'));
 for(const [kind,number]of[['purchase','02'],['__proto__','01'],['cards','2']])assert.throws(()=>blackoutFigureReferences('fr',kind,number,'S03','Caption'));
 assert.throws(()=>blackoutFigureReferences('fr','cards','02','S03',' '));
});
test('passive XML and explicit intended-panel geometry reject unsafe, overflowing and hidden edits',()=>{
 const svg=blackoutScenes().find(s=>s.lang==='fr'&&s.kind==='purchase'&&!s.mobile).svg;
 for(const change of[s=>s.replace('</svg>','<script>alert(1)</script></svg>'),s=>s.replace('<svg ','<svg onload="x" '),s=>s.replace('</svg>','<image href="https://example.com/x"/></svg>'),s=>s.replace('var(--color-paper)','#11273e'),s=>s.replace('font-family="l0g Blackout"','font-family="Arial"'),s=>s.replace('font-size="22"','font-size="10"'),s=>s.replace('<rect ','<rect opacity="0" ')]){const bad=change(svg);assert.notEqual(bad,svg);assert.throws(()=>inspectBlackoutSvg(bad));}
 for(const change of[s=>s.replace('>Commerce accessible<','>UN TITRE EXTRAORDINAIREMENT LONG QUI DÉBORDE DU CADRE<'),s=>s.replace('data-panel="blackout-fr-purchase-d-card-0"','data-panel="blackout-fr-purchase-d-card-1"'),s=>s.replace('x="97" y="206"','x="450" y="206"')]){const bad=change(svg);assert.notEqual(bad,svg);assert.throws(()=>assertBlackoutGeometry(bad));}
 for(const d of['M 0 0 L 3 4 trailing','M 0 0 Q 1 1 2 2','M 0 0 L Infinity 4','M 0 0 L 3','L 0 0','M 0 0 M 3 4'])assert.throws(()=>pathPoints(d));
});
test('existing locally licensed glyphs and passive component preserve responsive sizing and safe source ownership',()=>{
 const component=read('src/components/BlackoutFigure.astro');for(const w of[400,700]){const p=`public/fonts/stablecoins/dejavu-sans-${w}.ttf`;assert.ok(component.includes(p.replace('public','')));assert.equal(createHash('sha256').update(readFileSync(new URL(`../${p}`,import.meta.url))).digest('hex'),w===400?'98f2d74db16bb5f41f74adf6d899aeec92861682cccc58bfdbe4d9d7d0a5ae11':'21a0350a4ac2a9f22b6a7a8dcaf6abb08c8b546d06499301f1fcf10996fd0df5');}
 assertFontLicenseReferences(read('public/fonts/stablecoins/LICENSE.txt'),'dejavu');assert.match(component,/max-width:\s*48rem/u);assert.match(component,/max-width:\s*26rem/u);assert.match(component,/@container\s*\(max-width:\s*500px\)/u);assert.match(component,/padding-bottom:\s*1rem/u);assert.match(component,/:global\(article:has\(\.blackout-autonomy-figure\) \.post-title\)\s*\{\s*hyphens:\s*none/u);assert.doesNotMatch(component,/overflow\s*:\s*(?:hidden|clip)|filter\s*:|client:|<script|fetch\(|@media\s*\(max-width:/iu);assert.match(component,/import\.meta\.glob\('\.\.\/figures\/blackout-autonomy\/\*\.svg'/u);assert.match(component,/blackoutFigureReferences\(lang, kind, number, sources, caption\)/u);
});

test('mobile label regions retain a visible safety gap beside percentages and the repair-return arrows',()=>{
 for(const scene of blackoutScenes().filter(s=>s.mobile)){const{all}=inspectBlackoutSvg(scene.svg),texts=all.filter(n=>tag(n)==='text');
  if(scene.kind==='preparedness'){for(const[row,value]of[90,31,29].entries()){const start=272+198*row,labels=texts.filter(n=>Number(attrs(n)['font-size'])===19&&Number(attrs(n).y)>=start&&Number(attrs(n).y)<start+100).map(labelBox),number=labelBox(texts.find(n=>content(n)===value+' %'));assert.ok(labels.length>=2);assert.ok(start+105-Math.max(...labels.map(b=>b.y2))>=15,'Labels keep at least15SVGunits of vertical padding before their bars');assert.ok(number.x1-Math.max(...labels.map(b=>b.x2))>=10,'Each full category label keeps at least10SVGunits before its percentage');}}
  if(scene.kind==='restoration'){const labels=texts.filter(n=>Number(attrs(n).x)===235&&Number(attrs(n).y)>=575&&Number(attrs(n).y)<=621);assert.equal(labels.map(content).join(' '),scene.lang==='fr'?'réparent les deux réseaux':'repairs both networks');assert.equal(labels.length,2);for(const b of labels.map(labelBox)){assert.ok(b.x1>=235&&b.x2<=365&&b.y1>=558&&b.y2<=621,'Repair label stays inside its intended right-hand corridor with10units before the dotted return');}}
 }
});

test('full font line metrics preserve safe card padding, including the wrapped English mobile total',()=>{
 for(const scene of blackoutScenes()){const{all}=inspectBlackoutSvg(scene.svg);for(const n of all.filter(n=>tag(n)==='text'&&attrs(n)['data-panel']?.includes('-card-'))){const p=attrs(all.find(p=>attrs(p).id===attrs(n)['data-panel'])),b=fontLineBox(n);assert.ok(b.y1>=Number(p.y)+3&&b.y2<=Number(p.y)+Number(p.height)-3,`Font line stays inside card: ${content(n)}`);}
  if(scene.kind==='cards'&&scene.mobile){const panel=attrs(all.find(n=>attrs(n).id?.endsWith('-card-total'))),text=all.filter(n=>tag(n)==='text'&&attrs(n)['data-panel']===panel.id).map(fontLineBox);assert.ok(Number(panel.y)+Number(panel.height)-Math.max(...text.map(b=>b.y2))>=10,'Wrapped total keeps at least10SVGunits below the complete font descent');}
 }
});
