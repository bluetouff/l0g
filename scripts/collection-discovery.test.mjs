import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { collectionQuery, collectionMatches } from '../src/lib/collection-filter.ts';
import { riskRecordPreview } from '../src/config/data-library.ts';
import { toolPreviews } from '../src/config/tool-previews.ts';
import { analysisTools } from '../src/config/analysis-tools.ts';

test('collection search normalises accents, spacing and case and requires every word', () => {
  const query=collectionQuery('  ÉNERGIE   dette ');
  assert.deepEqual(query,['energie','dette']);
  assert.equal(collectionMatches('Dette et coût de l’énergie',query),true);
  assert.equal(collectionMatches('Coût de l’énergie',query),false);
  assert.equal(collectionMatches('Anything',collectionQuery('   ')),true);
});
test('collection search bounds query size and treats markup and regex syntax literally', () => {
  assert.equal(collectionQuery('x'.repeat(200))[0].length,160);
  assert.equal(collectionMatches('a.b',collectionQuery('a.b')),true);
  assert.equal(collectionMatches('axb',collectionQuery('a.b')),false);
  assert.equal(collectionMatches('Article',collectionQuery('<svg onload=alert(1)>')),false);
});
test('risk preview preserves actual nulls, values, units and source dates without copying extra fields', () => {
  const rows=[{key:'macro',value:null,scale:100,sourceUpdatedAt:'2026-11-05',sourceStatus:'unavailable',extra:'private'},{key:'energy',value:14.25,scale:10}];
  assert.deepEqual(JSON.parse(riskRecordPreview(rows)),[{key:'macro',value:null,scale:100,sourceUpdatedAt:'2026-11-05',sourceStatus:'unavailable'},{key:'energy',value:14.25,scale:10}]);
});
test('risk preview rejects malformed records and non-finite numbers and bounds the sample', () => {
  for(const input of [null,{},[],['bad'],[{key:'x'.repeat(101),value:12}]])assert.equal(riskRecordPreview(input),undefined);
  assert.deepEqual(JSON.parse(riskRecordPreview([{key:'x',value:NaN,scale:Infinity}])),[{key:'x'}]);
  assert.equal(JSON.parse(riskRecordPreview([{key:'a'},{key:'b'},{key:'c'}])).length,2);
});
test('all published tools have a bilingual orientation preview and no orphan preview exists', () => {
  assert.deepEqual(Object.keys(toolPreviews).sort(),analysisTools.map(tool=>tool.id).sort());
  for(const preview of Object.values(toolPreviews))for(const lang of ['fr','en']){
    assert.equal(preview[lang].length,3);
    for(const label of preview[lang])assert.ok(label.trim()&&label.length<80);
  }
});
test('catalogue filtering has progressive enhancement and uses no HTML insertion sink', () => {
  const view=readFileSync(new URL('../src/components/CollectionFilter.astro',import.meta.url),'utf8');
  const client=readFileSync(new URL('../src/scripts/collection-filter.ts',import.meta.url),'utf8');
  assert.match(view,/<form[^>]* hidden>/);
  assert.match(client,/form\.hidden=false/);
  assert.doesNotMatch(client,/innerHTML|insertAdjacentHTML|fetch\(/);
});
