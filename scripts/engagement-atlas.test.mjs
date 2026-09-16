import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { assertAtlasDataset, atlasAt, atlasSelection, isAtlasDate } from '../src/lib/engagement-atlas.ts';

const source = JSON.parse(readFileSync(new URL('../src/data/engagement-atlas.json', import.meta.url), 'utf8'));
const copy = () => structuredClone(source);

test('published corpus validates and retains exact monetary meaning', () => {
  assertAtlasDataset(source);
  const amount = atlasAt(source, '2026-08-26').relations.find(item => item.id === 'nvidia-sb-guarantee').observation.amount;
  assert.deepEqual(amount, { value: '105000000000', currency: 'USD', kind: 'conditional-cap', label: '105 Md$ · plafond initial cumulé' });
});

test('historical cuts exclude future actors, sources and revised interpretations', () => {
  const initial = atlasAt(source, '2024-09-17');
  assert.equal(initial.relations.length, 5);
  assert.equal(initial.nodes.some(item => ['xai', 'openai-tenant', 'sb-energy'].includes(item.id)), false);
  assert.deepEqual(initial.sources.map(item => item.id), ['aip-2024']);
  assert.equal(initial.relations.find(item => item.id === 'nvidia-aip').observation.label, 'Soutien technique');
  const expanded = atlasAt(source, '2025-03-19');
  assert.equal(expanded.relations.find(item => item.id === 'nvidia-aip').observation.label, 'Partenaire et conseil technique');
  const august = atlasAt(source, '2026-08-17');
  assert.equal(august.sources.some(item => item.id === 'nvda-ex101-20260826'), false);
  assert.equal(august.relations.find(item => item.id === 'nvidia-sb-guarantee').observation.kind, 'contract');
  assert.equal(atlasAt(source, '2026-08-26').relations.find(item => item.id === 'nvidia-sb-guarantee').observation.kind, 'limitation');
  assert.equal(atlasAt(source, '2024-09-16').nodes.length, 0);
});

test('reviewed proposals cannot enter a historical cut through an unreviewed revision', () => {
  const data = copy();
  const relation = data.relations.find(item => item.id === 'nvidia-sb-guarantee');
  relation.observations.at(-1).review = 'proposed';
  assert.throws(() => assertAtlasDataset(data), /non relue/);
  assert.doesNotThrow(() => assertAtlasDataset(data, true));
  assert.equal(atlasAt(data, '2026-08-26').relations.find(item => item.id === relation.id).observation.publishedOn, '2026-08-17');
});

test('future evidence, missing references, backdating and ambiguous ordering fail closed', () => {
  for (const mutate of [
    d => { d.relations[0].observations[0].sources = ['nvda-8k-20260817']; },
    d => { d.relations[0].observations[0].sources = ['missing']; },
    d => { d.relations[0].observations[0].recordedOn = '2024-09-16'; },
    d => { d.relations[4].observations.reverse(); },
    d => { d.relations[0].from = 'missing'; },
    d => { d.sources[1].id = d.sources[0].id; },
    d => { d.milestones[0].date = '2024-09-18'; },
    d => { d.relations[0].observations[0].publishedOn = '2024-09-18'; },
    d => { d.nodes[1].row = d.nodes[0].row; },
  ]) { const data = copy(); mutate(data); assert.throws(() => assertAtlasDataset(data)); }
});

test('proposals reject executable, impersonated or credential-bearing sources and unknown fields', () => {
  for (const url of [
    'javascript:alert(1)', 'https://www.sec.gov.evil.example/x.htm', 'https://www.sec.gov@evil.example/x.htm',
    'https://user:pass@www.sec.gov/Archives/edgar/data/1/2/a.htm', 'http://www.sec.gov/Archives/edgar/data/1/2/a.htm',
    'https://www.sec.gov/Archives/edgar/data/1/2/a.htm?key=private', 'https://www.sec.gov/../internal',
  ]) { const data = copy(); data.sources[0].url = url; assert.throws(() => assertAtlasDataset(data, true)); }
  for (const mutate of [
    d => { d.nodes[0].label = '<img src=x onerror=alert(1)>'; },
    d => { d.internal = 'private'; },
    d => { d.sources[0].token = 'private'; },
    d => { d.relations[0].observations[0].confidence = 99; },
    d => { d.relations[7].observations[0].amount.value = 105000000000; },
    d => { d.relations[7].observations[0].amount.kind = 'estimated-loss'; },
  ]) { const data = copy(); mutate(data); assert.throws(() => assertAtlasDataset(data, true)); }
});

test('shared links select only known dates and relations and cannot enable an anachronistic scenario', () => {
  assert.deepEqual(atlasSelection(source, '#date=2024-09-17&relation=nvidia-sb-guarantee&scenario=default'), { date: '2024-09-17', relation: 'nvidia-aip', scenario: false });
  assert.deepEqual(atlasSelection(source, '#date=2026-08-17&relation=openai-sb-lease&scenario=default'), { date: '2026-08-17', relation: 'openai-sb-lease', scenario: true });
  assert.equal(atlasSelection(source, '#date=2027-01-01&relation=%3Cscript%3E').date, '2026-08-26');
  assert.equal(atlasSelection(source, '#date=2026-08-26&relation=blackrock-aip&scenario=default').scenario, false);
  assert.equal(isAtlasDate('2026-02-30'), false);
  assert.equal(isAtlasDate('2024-02-29'), true);
  assert.throws(() => atlasAt(source, '2026-02-30'));
});

test('links never imply a financing contract from the shared Nvidia node', () => {
  assert.equal(source.relations.some(item => item.from === 'aip' && ['sb-energy', 'openai-tenant'].includes(item.to)), false);
  assert.equal(source.relations.some(item => item.observations.some(observation => observation.amount) && item.id !== 'nvidia-sb-guarantee'), false);
});
