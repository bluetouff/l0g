import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { WORKSPACE_KEY, MAX_COMPLETED, MAX_FIGURES, MAX_WORKSPACE_CHARS, readWorkspace, writeWorkspaceItem, bookChapters } from '../src/lib/reader-workspace.ts';
import { publicationEntries } from '../src/config/publication-catalog.mjs';
import { publicationTopics, publicationTopicKeys } from '../src/config/publication-topics.ts';
import { buildDiscoveryCatalog } from '../src/lib/reading-discovery.ts';
import { validDiscoveryEntry } from '../src/lib/reading-discovery-model.ts';

const now = Date.UTC(2026, 10, 6);
const item = (extra = {}) => ({path:'/posts/example/',title:'Example',savedAt:now,...extra});
const figure = (extra = {}) => item({anchor:'l0g-figure-01',...extra});
function storage(raw) {
  const values = new Map(raw === undefined ? [] : [[WORKSPACE_KEY,raw]]);
  return {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)};
}
const encode = (completed=[],figures=[]) => JSON.stringify({version:1,completed,figures});

test('read statuses and figures remain separate, bounded and browser-local',()=>{
  const store=storage();store.setItem('l0g-reading-positions-v1','unchanged');
  assert.equal(writeWorkspaceItem(store,'completed',item(),false,now),true);
  assert.equal(writeWorkspaceItem(store,'figures',figure({body:'never stored'}),false,now),true);
  assert.deepEqual(readWorkspace(store,now),{completed:[item()],figures:[figure()]});
  assert.equal(writeWorkspaceItem(store,'completed',item(),true,now),true);
  assert.deepEqual(readWorkspace(store,now).figures,[figure()]);
  assert.equal(writeWorkspaceItem(store,'figures',figure(),true,now),true);
  assert.equal(store.getItem(WORKSPACE_KEY),null);
  assert.equal(store.getItem('l0g-reading-positions-v1'),'unchanged');
});
test('malformed metadata and executable or foreign paths cannot enter saved state',()=>{
  for(const path of ['//evil.example/','https://l0g.fr/posts/example/','javascript:alert(1)','/posts/../example/','/posts/%2e%2e/','/posts/example/?x=1','/posts/example/#id','/posts/example/\n']) {
    assert.equal(writeWorkspaceItem(storage(),'completed',item({path}),false,now),false,path);
  }
  for(const anchor of ['#l0g-figure-01','l0g-figure-01?x','javascript:alert(1)','l0g-figure-1','l0g-figure-01\n']) {
    assert.equal(writeWorkspaceItem(storage(),'figures',figure({anchor}),false,now),false,anchor);
  }
  for(const extra of [{title:{}},{title:' '},{savedAt:now+1},{savedAt:-1},{savedAt:NaN}])assert.equal(writeWorkspaceItem(storage(),'completed',item(extra),false,now),false);
  for(const raw of ['null','{','[]','{"version":2}',encode(Array(MAX_COMPLETED+1).fill(item())),'x'.repeat(MAX_WORKSPACE_CHARS+1)])assert.deepEqual(readWorkspace(storage(raw),now),{completed:[],figures:[]});
});
test('deduplication preserves newest statuses and distinct figures, including language variants',()=>{
  const store=storage(encode([item({savedAt:now-1}),item(),item({path:'/en/analysis/example/'})],[figure(),figure({anchor:'l0g-figure-02'}),figure({savedAt:now-1})]));
  const state=readWorkspace(store,now);assert.equal(state.completed.length,2);assert.equal(state.completed[0].savedAt,now);assert.equal(state.figures.length,2);
});
test('storage failures never report success or overwrite unreadable data',()=>{
  let writes=0;
  const denied={getItem(){throw Error('denied');},setItem(){writes++;},removeItem(){writes++;}};
  assert.equal(writeWorkspaceItem(denied,'completed',item(),false,now),false);assert.equal(writes,0);
  assert.deepEqual(readWorkspace(denied,now),{completed:[],figures:[]});
  const quota={...storage(),setItem(){throw Error('quota');}};
  assert.equal(writeWorkspaceItem(quota,'figures',figure(),false,now),false);
});
test('count and encoded-size limits retain the latest explicit action',()=>{
  const store=storage();
  for(let i=0;i<140;i++)assert.equal(writeWorkspaceItem(store,'completed',item({path:`/posts/article-${i}/`,savedAt:now-140+i}),false,now),true);
  for(let i=0;i<40;i++)assert.equal(writeWorkspaceItem(store,'figures',figure({anchor:`l0g-figure-${String(i).padStart(2,'0')}`,savedAt:now-40+i}),false,now),true);
  assert.equal(readWorkspace(store,now).completed.length,MAX_COMPLETED);assert.equal(readWorkspace(store,now).figures.length,MAX_FIGURES);
  for(let i=0;i<140;i++)writeWorkspaceItem(store,'completed',item({path:`/posts/${String(i).padEnd(240,'a')}/`,title:'É'.repeat(160),savedAt:now-140+i}),false,now);
  assert.ok(store.getItem(WORKSPACE_KEY).length<=MAX_WORKSPACE_CHARS);assert.equal(readWorkspace(store,now).completed[0].path,`/posts/${'139'.padEnd(240,'a')}/`);
});
test('chapter progress uses only the published Book order and canonical article URLs',()=>{
  const chapter=(url,name='Chapter')=>({'@type':'Chapter',url,name});
  const good=[chapter('https://l0g.fr/posts/second/','Second'),chapter('/en/analysis/first/','First')];
  const invalid=['https://evil.example/posts/other/','https://l0g.fr@evil.example/posts/other/','/posts/../posts/other/','//l0g.fr/posts/other/','/posts/other/?x=1','/posts/%61/'];
  assert.deepEqual(bookChapters({'@type':'Book',hasPart:[...good,...invalid.map(url=>chapter(url)),good[0]]}),[{path:'/posts/second/',title:'Second'},{path:'/en/analysis/first/',title:'First'}]);
  assert.deepEqual(bookChapters({'@type':'Article',hasPart:good}),[]);
  assert.deepEqual(bookChapters({'@type':'Book',hasPart:Array(101).fill(good[0])}),[]);
});
test('all catalogue editions have explicit valid subjects in both languages',()=>{
  for(const lang of ['fr','en'])for(const entry of publicationEntries(lang)) {
    const keys=publicationTopicKeys[entry.id];assert.ok(keys?.length,entry.id);assert.ok(keys.every(key=>publicationTopics[key]?.[lang]));
  }
});
test('revision notes remain explicit, date-bound and escaped in render paths',async()=>{
  const data={title:'Example',description:'Description',pubDate:new Date(now),updatedDate:new Date(now),tags:[],revisionNote:'Added source detail.'};
  const [entry]=buildDiscoveryCatalog([{id:'example',data}]);assert.equal(entry.revisionNote,data.revisionNote);assert.ok(validDiscoveryEntry(entry));
  assert.equal(validDiscoveryEntry({...entry,updated:undefined}),false);assert.equal(validDiscoveryEntry({...entry,revisionNote:'x'.repeat(321)}),false);
  const noDate=buildDiscoveryCatalog([{id:'example',data:{...data,updatedDate:undefined}}])[0];assert.equal(noDate.revisionNote,undefined);
  assert.doesNotMatch(await readFile('src/components/ArticleRevisionNote.astro','utf8'),/set:html/);
});


test('quick search refuses executable, foreign, credentialled and oversized result links',async()=>{
  const {localSearchHref}=await import('../src/lib/quick-search.ts');const origin='https://l0g.fr';
  for(const value of ['javascript:alert(1)','data:text/html,x','https://evil.example/posts/x/','//evil.example/x','https://user:pass@l0g.fr/posts/x/','/posts/\nfoo/','x'.repeat(2001),null,{}])assert.equal(localSearchHref(value,origin),null);
  assert.equal(localSearchHref('/posts/example/#sources',origin),'/posts/example/#sources');
  assert.equal(localSearchHref('https://l0g.fr/en/analysis/example/',origin),'/en/analysis/example/');
});
