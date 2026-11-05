import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { parseFrontmatter } from '@astrojs/markdown-remark';
import { filterDiscovery, validDiscoveryEntry, validToolPath, visitTime } from '../src/lib/reading-discovery-model.ts';
import { buildDiscoveryCatalog, discoveryTool } from '../src/lib/reading-discovery.ts';
const base={path:'/posts/example/',title:'Titre',description:'Description',published:'2026-11-01T09:00:00Z',minutes:4,topics:['macro'],topicLabel:'Macro'};
test('filtres combinés sur tout le corpus et bornes des durées',()=>{
 const entries=[{...base,minutes:5},{...base,path:'/posts/medium/',minutes:6,tool:'/outils/example/'},{...base,path:'/posts/fifteen/',minutes:15},{...base,path:'/posts/long/',minutes:16,topics:['credit']}];
 assert.equal(filterDiscovery(entries,{topic:'',duration:'short',tool:false}).length,1);
 assert.equal(filterDiscovery(entries,{topic:'',duration:'medium',tool:false}).length,2);
 assert.equal(filterDiscovery(entries,{topic:'credit',duration:'long',tool:false})[0].minutes,16);
 assert.equal(filterDiscovery(entries,{topic:'macro',duration:'medium',tool:true})[0].path,'/posts/medium/');
 assert.equal(filterDiscovery(entries,{topic:'credit',duration:'short',tool:true}).length,0);
 const archives=Array.from({length:600},(_,i)=>({...base,path:`/posts/archive-${i}/`,topics:i===599?['rare']:[]}));
 assert.equal(filterDiscovery(archives,{topic:'rare',duration:'',tool:false})[0].path,'/posts/archive-599/');
});
test('repère daté, révision et égalité, sans confondre modification et publication',()=>{
 const marker=Date.parse(base.published);
 assert.equal(filterDiscovery([base],{topic:'',duration:'',tool:false,since:marker}).length,0);
 assert.equal(filterDiscovery([{...base,updated:'2026-11-02T09:00:00Z'}],{topic:'',duration:'',tool:false,since:marker}).length,1);
 assert.equal(filterDiscovery([{...base,updated:'2026-10-01T09:00:00Z'}],{topic:'',duration:'',tool:false,since:marker-1}).length,1);
 assert.equal(visitTime('invalid'),undefined);assert.equal(visitTime('2099-01-01',marker),undefined);assert.equal(visitTime(base.published,marker),marker);
});
test('chemins du catalogue et des outils bornés sans URL exécutable ou étrangère',()=>{
 assert.ok(validDiscoveryEntry(base));
 for(const path of ['https://evil.example/','//evil.example/','/posts/../admin/','javascript:alert(1)'])assert.equal(validDiscoveryEntry({...base,path}),false);
 for(const tool of ['javascript:alert(1)','https://evil.example/','/outils/a/#x\" onclick=\"x','/outils/a/?url=evil'])assert.equal(validToolPath(tool),false);
 for(const tool of ['/posts/example/#simulator-fr','/outils/example/','/en/analysis/example/#sim-en'])assert.ok(validToolPath(tool));
 for(const value of [null,[],{...base,minutes:NaN},{...base,summary:{fact:'x'}},{...base,published:'nonsense'},{...base,topics:[{}]}])assert.equal(validDiscoveryEntry(value),false);
});
test('catalogue réel : brouillons exclus, résumés inchangés et ancres du registre existant',async()=>{
 const files=(await readdir('src/content/posts')).filter(n=>/\.mdx?$/.test(n));
 const posts=await Promise.all(files.map(async name=>{const file=await readFile(`src/content/posts/${name}`,'utf8');const {frontmatter:data,content:body}=parseFrontmatter(file);return {id:name.replace(/\.mdx?$/,''),body,data:{...data,pubDate:new Date(data.pubDate),...(data.updatedDate?{updatedDate:new Date(data.updatedDate)}:{})}};}));
 const entries=buildDiscoveryCatalog(posts);assert.ok(entries.length>400);
 assert.equal(entries.length,posts.filter(p=>!p.data.draft).length);
 assert.ok(entries.every(validDiscoveryEntry));
 for(const e of entries){const p=posts.find(p=>e.path===`/posts/${p.id}/`);assert.deepEqual(e.summary,p.data.quickTake);assert.equal(e.tool,discoveryTool(e.path));}
 assert.ok(entries.some(e=>e.tool));assert.ok(entries.some(e=>e.summary));
});


test('les pièces du dossier excluent les liens de contexte et conservent le statut de revue',async()=>{
 const {selectSourceFiles,externalDocument}=await import('../src/lib/source-files.ts');
 for(const href of ['/posts/context/','https://l0g.fr/posts/context/','javascript:alert(1)','https://user:pass@example.com/','//evil.example/'])assert.equal(externalDocument(href),false);
 const primary={href:'https://www.sec.gov/document',label:'Document SEC'};
 const auto={reviewStatus:'unreviewed',claim:'Passage à contrôler',references:[{href:'/posts/context/',label:'Contexte'},primary]};
 const reviewed={reviewStatus:'reviewed',claim:'Passage relu',references:[primary]};
 const result=selectSourceFiles({claims:[auto,reviewed],primary:[{links:[primary]}]});
 assert.equal(result.rows.length,1);assert.equal(result.rows[0].claim.reviewStatus,'reviewed');
 const fallback=selectSourceFiles({claims:[{...auto,references:[]}],primary:[{links:[primary]}]});assert.equal(fallback.rows.length,0);assert.equal(fallback.fallback[0].href,primary.href);
});
import { homeCriticalCss } from './inline-home-styles.mjs';

test('home CSS omits only article and search selectors, preserving shared and interactive rules', () => {
  const css = '.prose p{color:red}.pagefind-ui__result{margin:1rem}.pf-search a{color:blue}.prose h2,main h2{font-size:2rem}@media(max-width:600px){.prose table{display:block}.nav-tab{display:flex}}.reading-discovery [hidden]{display:none}';
  const result = homeCriticalCss(css);
  assert.doesNotMatch(result, /color:red|margin:1rem|color:blue|\.prose table/);
  assert.match(result, /\.prose h2,main h2/);
  assert.match(result, /\.nav-tab/);
  assert.match(result, /\.reading-discovery \[hidden\]/);
});
