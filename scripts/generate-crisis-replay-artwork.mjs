import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import { h, fonts, OG } from './og-kit.mjs';
import { crisisGallery, crisisCollection } from '../src/config/crisis-gallery.ts';
import { replayEpisodes } from '../src/data/crisis-episodes.ts';

const ROOT=resolve(new URL('..',import.meta.url).pathname);
const directory=join(ROOT,'public/illustrations/crisis-replay');
const image=(src,style)=>({type:'img',props:{src,style:{position:'absolute',objectFit:'cover',...style}}});
const uri=bytes=>`data:image/jpeg;base64,${bytes.toString('base64')}`;
const artwork={};
const entries=Object.keys(replayEpisodes).map(id=>[id,crisisGallery[id]]);
const requested=process.argv.slice(2);
const known=new Set(['collection',...Object.keys(replayEpisodes)]);
if(requested.some(id=>!known.has(id))) throw new Error('Unknown crisis artwork selection');
const selected=id=>requested.length===0||requested.includes(id);
mkdirSync(join(directory,'og'),{recursive:true});
for(const [id,card] of entries) {
  const master=readFileSync(join(directory,`${card.art}-art.jpg`));
  artwork[id]=uri(master);
  if(selected(id)) for(const width of [640,960,1200]) await sharp(master).resize(width,Math.round(width*9/16),{fit:'cover'}).webp({quality:84}).toFile(join(directory,`${card.art}-${width}.webp`));
}

for(const lang of ['fr','en']) for(const id of ['collection',...Object.keys(replayEpisodes)]) {
  if(!selected(id)) continue;
  const collection=id==='collection';
  const card=collection?null:crisisGallery[id];
  const episode=collection?null:replayEpisodes[id];
  const lines=collection?crisisCollection[lang].ogTitle:card.ogTitle[lang];
  const scene=collection?entries.map(([key,item],index)=>{
    const compact=entries.length>4;
    const wide=compact&&entries.length%2===1&&index===entries.length-1;
    const width=wide?470:226;
    const height=compact?(wide?112:118):184;
    const left=670+(index%2)*244;
    const top=122+Math.floor(index/2)*(compact?138:204);
    const photoWidth=wide?470:326;
    const photoHeight=photoWidth*9/16;
    return h('div',{position:'absolute',left:wide?670:left,top,width,height,display:'flex',overflow:'hidden',border:'1px solid #5eead442',borderRadius:8},
      image(artwork[key],{left:wide?0:-58,top:(height-photoHeight)/2,width:photoWidth,height:photoHeight}),
      h('div',{position:'absolute',left:0,bottom:0,width,height:80,backgroundImage:'linear-gradient(0deg,rgba(12,13,16,.98),rgba(12,13,16,0))'}),
      h('div',{position:'absolute',left:14,bottom:12,color:OG.bright,fontSize:17},({gilts:'Gilts / LDI',svb:'SVB',terra:'Terra / Luna',aig:'AIG',ltcm:'LTCM'})[key]),
      h('div',{position:'absolute',left:14,top:11,color:OG.teal,fontSize:15},replayEpisodes[key].number));
  }):[
    image(artwork[id],{left:0,top:-22,width:1200,height:675}),
    h('div',{position:'absolute',inset:0,backgroundImage:'linear-gradient(90deg,rgba(12,13,16,1) 0%,rgba(12,13,16,.95) 32%,rgba(12,13,16,.54) 57%,rgba(12,13,16,.05) 100%)'}),
  ];
  const tree=h('div',{position:'relative',display:'flex',width:1200,height:630,overflow:'hidden',backgroundColor:OG.ink,color:OG.paper,fontFamily:'JetBrains Mono'},
    ...scene,
    h('div',{position:'absolute',left:48,top:33,display:'flex',alignItems:'baseline',fontSize:36,fontWeight:700,letterSpacing:-2},'l',h('span',{color:OG.teal},'0'),'g'),
    h('div',{position:'absolute',right:48,top:48,display:'flex',fontSize:16,color:OG.teal,letterSpacing:1},collection?(lang==='fr'?'COLLECTION INTERACTIVE':'INTERACTIVE COLLECTION'):`${episode.number} / ${episode.chapters[0].date.slice(0,4)}`),
    h('div',{position:'absolute',left:50,top:126,display:'flex',color:OG.muted,fontSize:17,letterSpacing:2},lang==='fr'?'REPLAY DES CRISES':'CRISIS REPLAY'),
    h('div',{position:'absolute',left:48,top:185,width:590,display:'flex',flexDirection:'column',gap:3},...lines.map((line,index)=>h('div',{display:'flex',fontSize:collection?66:58,fontWeight:400,lineHeight:1.08,letterSpacing:-3,color:index===lines.length-1?OG.teal:OG.bright},line))),
    h('div',{position:'absolute',left:50,top:collection?398:lines.length===3?416:354,width:540,display:'flex',color:OG.paper,fontSize:19,lineHeight:1.6},collection?(lang==='fr'?'La finance, au point de rupture.':'Finance at the breaking point.'):card.mechanism[lang]),
    h('div',{position:'absolute',left:50,right:50,bottom:47,paddingTop:22,borderTop:'1px solid #ffffff26',display:'flex',justifyContent:'space-between',alignItems:'center'},h('div',{display:'flex',color:OG.muted,fontSize:17},collection?(lang==='fr'?`${Object.keys(crisisGallery).length} crises à explorer`:`${Object.keys(crisisGallery).length} crises to explore`):(lang==='fr'?`${episode.chapters.length} moments · documents d’époque`:`${episode.chapters.length} moments · contemporary records`)),h('div',{display:'flex',fontSize:20,color:OG.teal},'l0g.fr')),
  );
  const svg=await satori(tree,{width:1200,height:630,fonts});
  const png=new Resvg(svg).render().asPng();
  const bytes=await sharp(png).jpeg({quality:90,mozjpeg:true}).toBuffer();
  const path=join(directory,'og',`${id}-${lang}.jpg`);
  writeFileSync(path,bytes);
  console.log(`crisis OG: ${id}/${lang} · 1200 × 630 · ${Math.round(bytes.length/1024)} KB`);
}
