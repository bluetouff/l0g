import assert from 'node:assert/strict';
import test from 'node:test';
import { peageDossier } from '../src/data/peage-dossier.ts';
import { assertPeageDossier, peageSelection, peageMarkdown } from '../src/lib/peage.ts';

test('every relation and exit has dated evidence, identified parties and explicit limits', () => {
  assert.doesNotThrow(() => assertPeageDossier(peageDossier));
  assert.equal(peageDossier.relations.length, 7);
  assert.equal(peageDossier.exits.length, 3);
});

test('broken joins, duplicated identities and missing evidence fail closed', () => {
  for (const mutate of [
    data => { data.relations[0].to = 'unidentified'; },
    data => { data.relations[0].evidence[0].source = 'missing'; },
    data => { data.relations[0].evidence = []; },
    data => { data.relations[0].limit = ''; },
    data => { data.relations[0].status = 'verified-independently'; },
    data => { data.relations[0].layer = '__proto__'; },
    data => { data.nodes.push(data.nodes[0]); },
    data => { data.requests[0].relations = ['missing']; },
    data => { data.exits[0].evidence = []; },
    data => { data.requests[0].exits = ['missing']; },
  ]) {
    const data = structuredClone(peageDossier);
    mutate(data);
    assert.throws(() => assertPeageDossier(data));
  }
});

test('sources cannot introduce unsafe URLs or dates later than the documentary review', () => {
  for (const url of ['javascript:alert(1)', 'data:text/html,test', 'http://example.org', 'https://user:secret@example.org/']) {
    const data = structuredClone(peageDossier);
    data.sources[0].url = url;
    assert.throws(() => assertPeageDossier(data));
  }
  for (const date of ['2026-02-30', '2027-01-01', '2026-1-1', 'unknown']) {
    const data = structuredClone(peageDossier);
    data.relations[0].asOf = date;
    assert.throws(() => assertPeageDossier(data));
  }
});

test('the graph separates ownership, technical supply and client choice', () => {
  const find = id => peageDossier.relations.find(item => item.id === id);
  assert.deepEqual([find('iris-dext').from, find('iris-dext').to, find('iris-dext').layer], ['iris', 'dext', 'capital']);
  assert.match(find('iris-dext').limit, /indirecte/);
  assert.equal(find('iris-dext').asOf, '2026-04-30');
  assert.deepEqual([find('dext-serensia').from, find('dext-serensia').to, find('dext-serensia').layer], ['dext', 'serensia', 'infrastructure']);
  assert.equal(find('cerfrance-serensia').status, 'declare');
  assert.match(find('cerfrance-serensia').limit, /panne partagée/);
  assert.equal(find('designation').layer, 'contrat');
  assert.equal(peageDossier.relations.some(item => item.layer === 'capital' && item.from === 'dext' && item.to === 'serensia'), false);
});

test('deep links accept only known evidence ids, with bounded input', () => {
  const ids = peageDossier.relations.map(item => item.id);
  assert.equal(peageSelection('#preuve-dext-serensia', ids), 'dext-serensia');
  for (const hash of ['', '#sortie', '#preuve-missing', '#preuve-<script>', '#preuve-%64ext-serensia', '#preuve-' + 'x'.repeat(1000)]) {
    assert.equal(peageSelection(hash, ids), null);
  }
});

test('exports retain distinctions between exit mechanisms and all evidence limitations', () => {
  const markdown = peageMarkdown(peageDossier);
  for (const relation of peageDossier.relations) {
    assert.ok(markdown.includes(relation.limit));
    assert.ok(markdown.includes(relation.asOf));
  }
  for (const source of peageDossier.sources) assert.ok(markdown.includes(source.url));
  assert.match(markdown, /Préavis de 30 jours/);
  assert.match(markdown, /Demande sous 10 jours/);
  assert.match(markdown, /efforts raisonnables/);
  assert.match(markdown, /données personnelles/);
  assert.match(markdown, /montant payé, marge et coût total de migration inconnus/);
});
