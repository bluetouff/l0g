import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { fingerprintPaths, runDerivedTask } from './derived-assets-cache.mjs';
import { epubDerivedTasks, literalChapterFiles } from './epub-derived-catalog.mjs';
import { epubDependencyClosure } from './epub-dependencies.mjs';

const ROOT = fileURLToPath(new URL('..',import.meta.url));
function fixture(t) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(),'l0g-book-cache-')));
  t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  fs.mkdirSync(path.join(root,'chapters'));fs.mkdirSync(path.join(root,'helpers'));
  fs.writeFileSync(path.join(root,'chapters/one.md'),'chapter one');
  fs.writeFileSync(path.join(root,'chapters/two.md'),'chapter two');
  fs.writeFileSync(path.join(root,'helpers/font.ttf'),'font');
  let runs=0;
  const config={root,name:'epub-fixture',inputs:['chapters/one.md','helpers'],outputs:['generated/book','public/book.epub'],identity:{renderer:1},snapshot:true,log:()=>{},run(){
    runs++;fs.mkdirSync(path.join(root,'generated/book'),{recursive:true});fs.mkdirSync(path.join(root,'public'),{recursive:true});
    const body=fs.readFileSync(path.join(root,'chapters/one.md'));
    fs.writeFileSync(path.join(root,'generated/book/chapter.xhtml'),body);fs.writeFileSync(path.join(root,'public/book.epub'),body);
  }};
  return {root,config,runs:()=>runs,payload:path.join(root,'.cache/derived-assets/snapshots/epub-fixture')};
}
function removeOutputs(f){for(const name of f.config.outputs)fs.rmSync(path.join(f.root,name),{recursive:true,force:true});}

test('unrelated article leaves its book cached; a chapter or shared asset invalidates it',async t=>{
 const f=fixture(t);assert.equal((await runDerivedTask(f.config)).cached,false);
 fs.writeFileSync(path.join(f.root,'chapters/two.md'),'unrelated change');
 assert.equal((await runDerivedTask(f.config)).cached,true);assert.equal(f.runs(),1);
 fs.writeFileSync(path.join(f.root,'chapters/one.md'),'revised chapter');
 assert.equal((await runDerivedTask(f.config)).cached,false);
 fs.writeFileSync(path.join(f.root,'helpers/font.ttf'),'revised font');
 assert.equal((await runDerivedTask(f.config)).cached,false);assert.equal(f.runs(),3);
});

test('a fresh runner restores only validated declared outputs from the private cache',async t=>{
 const f=fixture(t);await runDerivedTask(f.config);
 const fresh=fixture(t);
 fs.cpSync(path.join(f.root,'.cache'),path.join(fresh.root,'.cache'),{recursive:true});
 const result=await runDerivedTask(fresh.config);
 assert.deepEqual(result,{cached:true,restored:true});assert.equal(fresh.runs(),0);
 assert.equal(fs.readFileSync(path.join(fresh.root,'public/book.epub'),'utf8'),'chapter one');
 assert.equal(fs.statSync(path.join(fresh.root,'generated/book')).mode&0o777,0o755);
 assert.equal(fs.statSync(path.join(fresh.root,'public/book.epub')).mode&0o777,0o644);
});

test('edited sources defeat an otherwise valid remote snapshot',async t=>{
 const f=fixture(t);await runDerivedTask(f.config);removeOutputs(f);
 fs.writeFileSync(path.join(f.root,'chapters/one.md'),'changed on the new runner');
 assert.equal((await runDerivedTask(f.config)).cached,false);
 assert.equal(fs.readFileSync(path.join(f.root,'public/book.epub'),'utf8'),'changed on the new runner');
});

test('missing or corrupt snapshot data is a cold miss, never a successful partial restoration',async t=>{
 for(const mode of ['missing','corrupt','extra']){
  const f=fixture(t);await runDerivedTask(f.config);removeOutputs(f);
  const file=path.join(f.payload,'generated/book/chapter.xhtml');
  if(mode==='missing')fs.rmSync(file);
  if(mode==='corrupt')fs.writeFileSync(file,'unverified content');
  if(mode==='extra')fs.writeFileSync(path.join(f.payload,'generated/book/extra.xhtml'),'unexpected content');
  assert.equal((await runDerivedTask(f.config)).cached,false);assert.equal(f.runs(),2);
  assert.equal(fs.readFileSync(path.join(f.root,'public/book.epub'),'utf8'),'chapter one');
  assert.equal(fs.existsSync(path.join(f.root,'generated/book/extra.xhtml')),false);
 }
});

test('payload symlinks and hard links cannot import external bytes',async t=>{
 for(const mode of ['symlink','hardlink','parent']){
  const f=fixture(t);await runDerivedTask(f.config);removeOutputs(f);
  const external=path.join(f.root,'private.txt');fs.writeFileSync(external,'private content');
  const target=mode==='parent'?path.join(f.payload,'generated'):path.join(f.payload,'public/book.epub');
  fs.rmSync(target,{recursive:true,force:true});
  if(mode==='hardlink')fs.linkSync(external,target);else fs.symlinkSync(mode==='parent'?f.root:external,target);
  assert.equal((await runDerivedTask(f.config)).cached,false);assert.equal(f.runs(),2);
  assert.equal(fs.readFileSync(external,'utf8'),'private content');
  assert.equal(fs.readFileSync(path.join(f.root,'public/book.epub'),'utf8'),'chapter one');
 }
});

test('unsafe destination paths fail before restoration and leave external targets alone',async t=>{
 const f=fixture(t);await runDerivedTask(f.config);removeOutputs(f);
 const external=path.join(f.root,'private.txt');fs.writeFileSync(external,'private content');
 fs.symlinkSync(external,path.join(f.root,'public/book.epub'));
 await assert.rejects(runDerivedTask(f.config),/Symlink/);assert.equal(f.runs(),1);
 assert.equal(fs.readFileSync(external,'utf8'),'private content');
});

test('snapshot traversal bounds deep trees and empty-directory floods before restoration',async t=>{
 for(const mode of ['deep','wide']){
  const f=fixture(t);await runDerivedTask(f.config);removeOutputs(f);
  const base=path.join(f.payload,'generated/book');
  if(mode==='deep')fs.mkdirSync(path.join(base,...Array(40).fill('nested')),{recursive:true});
  else fs.mkdirSync(path.join(base,'empty'));
  const open=fs.opendirSync;let enumerated=0;
  const mock=t.mock.method(fs,'opendirSync',function(directory,...args){
   if(mode==='wide'&&directory===base)return {readSync(){enumerated++;return {name:'empty'};},closeSync(){}};
   return open.call(this,directory,...args);
  });
  assert.equal((await runDerivedTask(f.config)).cached,false);mock.mock.restore();
  assert.equal(f.runs(),2);assert.ok(enumerated<=32_001);
  assert.equal(fs.readFileSync(path.join(f.root,'public/book.epub'),'utf8'),'chapter one');
 }
});

test('a source edit during restoration prevents a cached result',async t=>{
 const f=fixture(t);await runDerivedTask(f.config);removeOutputs(f);
 const rename=fs.renameSync;let changed=false;
 const mock=t.mock.method(fs,'renameSync',function(from,to){
  const result=rename.call(this,from,to);
  if(!changed&&to===path.join(f.root,'generated/book')){changed=true;fs.writeFileSync(path.join(f.root,'chapters/one.md'),'edited during restore');}
  return result;
 });
 assert.equal((await runDerivedTask(f.config)).cached,false);mock.mock.restore();
 assert.equal(f.runs(),2);assert.equal(fs.readFileSync(path.join(f.root,'public/book.epub'),'utf8'),'edited during restore');
});

test('a source edit during direct-hit output hashing forces regeneration',async t=>{
 for(const snapshot of [false,true]){
  const f=fixture(t),config={...f.config,snapshot};await runDerivedTask(config);
  const open=fs.openSync;let edited=false;
  const mock=t.mock.method(fs,'openSync',function(file,...args){
   if(!edited&&file===path.join(f.root,'public/book.epub')){
    edited=true;fs.writeFileSync(path.join(f.root,'chapters/one.md'),'edited while checking existing output');
   }
   return open.call(this,file,...args);
  });
  assert.equal((await runDerivedTask(config)).cached,false);mock.mock.restore();
  assert.equal(edited,true);assert.equal(f.runs(),2);
  assert.equal(fs.readFileSync(path.join(f.root,'public/book.epub'),'utf8'),'edited while checking existing output');
 }
});

test('the production catalogue accounts for every raw generator and every source chapter independently',()=>{
 const groups=epubDerivedTasks(ROOT);
 const pkg=JSON.parse(fs.readFileSync(path.join(ROOT,'package.json'),'utf8'));
 const raw=[...pkg.scripts['build:epub:generate'].matchAll(/node (scripts\/[^ &]+\.mjs)/gu)].map(match=>match[1]).filter(file=>file!=='scripts/build-epub.mjs');
 assert.deepEqual(groups.flatMap(group=>group.generators).sort(),raw.sort());
 assert.equal(groups.length,19);
 assert.ok(groups.every(group=>group.snapshot&&group.books.length&&group.outputs.length));
 assert.ok(groups.every(group=>!group.inputs.includes('src/content')));
 assert.ok(groups.every(group=>!['scripts','src/components','src/lib','src/config','src/figures'].some(directory=>group.inputs.includes(directory))));
 assert.ok(groups.every(group=>!group.inputs.includes('public/fonts')));
 const sourcePath='src/content/posts/cumcum-01-dividende-mecanisme.mdx';
 assert.deepEqual(groups.filter(group=>group.inputs.includes(sourcePath)).map(group=>group.name),['epub-cumcum']);
 assert.equal(groups.some(group=>group.inputs.includes('src/content/posts/gaz-americain-hiver-europe-2026.mdx')),false);
 assert.deepEqual(groups.filter(group=>group.inputs.includes('src/figures/cumcum')).map(group=>group.name),['epub-cumcum']);
 assert.deepEqual(groups.filter(group=>group.inputs.includes('src/components/CumCumFigure.astro')).map(group=>group.name),['epub-cumcum']);
 assert.deepEqual(groups.filter(group=>group.inputs.includes('src/figures/cold-chain-01')).map(group=>group.name),['epub-machines']);
 assert.equal(groups.some(group=>group.inputs.includes('src/components/USLNGWinterFigure.astro')),false);
 for(const group of groups){
  for(const file of group.inputs.filter(file=>file.startsWith('src/content/')))assert.ok(fs.statSync(path.join(ROOT,file)).isFile());
  for(const file of group.outputs)assert.ok(fs.existsSync(path.join(ROOT,file)),file);
 }
 const insurance=groups.find(group=>group.name==='epub-insurance');
 assert.ok(insurance.inputs.some(file=>file.startsWith('src/content/posts-en/')));
 assert.ok(insurance.inputs.some(file=>file.startsWith('public/illustrations/')));
});

test('an independent article font preserves book reuse; a book font invalidates it',async t=>{
 const groups=epubDerivedTasks(ROOT);
 const fonts=[...new Set(groups.flatMap(group=>group.inputs.filter(file=>file.startsWith('public/fonts/'))))];
 assert.equal(fonts.length,17);
 for(const file of fonts)assert.ok(fs.statSync(path.join(ROOT,file)).isFile());
 const f=fixture(t),config={...f.config,inputs:['chapters/one.md',...fonts]};
 await runDerivedTask(config);
 fs.mkdirSync(path.join(f.root,'public/fonts/independent-article'),{recursive:true});
 fs.writeFileSync(path.join(f.root,'public/fonts/independent-article/new.ttf'),'unrelated font');
 assert.equal((await runDerivedTask(config)).cached,true);assert.equal(f.runs(),1);
 fs.mkdirSync(path.dirname(path.join(f.root,fonts[0])),{recursive:true});
 fs.writeFileSync(path.join(f.root,fonts[0]),'revised book font or licence');
 assert.equal((await runDerivedTask(config)).cached,false);assert.equal(f.runs(),2);
});

test('only transitive imports and a chapter’s figure families invalidate its cache',t=>{
 const f=fixture(t);
 const put=(file,body)=>{fs.mkdirSync(path.dirname(path.join(f.root,file)),{recursive:true});fs.writeFileSync(path.join(f.root,file),body);};
 put('src/content/book.mdx',`---\ntitle: Book\n---\nimport Figure from '../components/Figure.astro';\n\n# Chapter\n\n<Figure />`);
 put('src/components/Figure.astro',`---\nimport {label} from '../lib/helper.mjs';\nconst figures=import.meta.glob('../figures/book/*.svg',{query:'?raw'});\n---\n<p>{label}</p>`);
 put('src/lib/helper.mjs',`export {label} from './label.mjs';`);
 put('src/lib/label.mjs',`export const label='A';`);
 put('src/figures/book/a.svg','<svg/>');
 const entries=['src/content/book.mdx'];
 const hash=()=>fingerprintPaths(f.root,epubDependencyClosure(f.root,entries)).hash;
 const before=hash();
 put('src/components/Unrelated.astro','<p>another article</p>');
 put('src/figures/another/a.svg','<svg>another figure</svg>');
 put('scripts/another-article.test.mjs','throw new Error("not imported")');
 put('src/content/another.mdx','# Another article');
 assert.equal(hash(),before);
 put('src/lib/label.mjs',`export const label='B';`);const changedHelper=hash();assert.notEqual(changedHelper,before);
 put('src/figures/book/b.svg','<svg/>');const changedFigure=hash();assert.notEqual(changedFigure,changedHelper);
 put('src/components/Figure.astro',`---\nimport '../lib/helper.mjs';\n---\n<p>New rendering</p>`);
 assert.notEqual(hash(),changedFigure);
});

test('unresolved, dynamic and unsafe imports cannot silently omit dependencies',t=>{
 const f=fixture(t),entry='entry.mjs';
 for(const body of ["import './missing.mjs';","import('../outside.mjs');","import(process.env.MODULE);","require(name);","import.meta.glob(variable);","import.meta.glob(['./*.svg', variable]);"]){
  fs.writeFileSync(path.join(f.root,entry),body);
  assert.throws(()=>epubDependencyClosure(f.root,[entry]));
 }
 const file=path.join(f.root,'linked.mjs');fs.symlinkSync(path.join(f.root,'chapters/one.md'),file);
 fs.writeFileSync(path.join(f.root,entry),"import './linked.mjs';");
 assert.throws(()=>epubDependencyClosure(f.root,[entry]),/Symlink/);
 fs.rmSync(file);fs.linkSync(path.join(f.root,'chapters/one.md'),file);
 assert.throws(()=>epubDependencyClosure(f.root,[entry]),/Unsafe/);
});

test('legacy chapter discovery parses data without executing source and rejects dynamic filenames',t=>{
 const f=fixture(t);const script='legacy.mjs';
 fs.writeFileSync(path.join(f.root,script),`throw new Error('never execute');const articles=[{file:'one.md'},{file:'two.mdx'}];`);
 assert.deepEqual(literalChapterFiles(f.root,script,'articles',{file:'posts'}),['src/content/posts/one.md','src/content/posts/two.mdx']);
 for(const body of ["[{file:process.env.FILE}]","[...extra]","[{file:'one.md',...extra}]","[{file:'../escape.md'}]","[{file:'one.md'}].map(x=>({...x,file:'hidden.md'}))","[{file:'one.md'}].map(x=>({...x,['file']:'hidden.md'}))","[{file:'one.md'}].map(x=>({...x,...extra}))"]){
  fs.writeFileSync(path.join(f.root,script),`const articles=${body};`);
  assert.throws(()=>literalChapterFiles(f.root,script,'articles',{file:'posts'}));
 }
});
