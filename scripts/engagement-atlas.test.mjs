import assert from 'node:assert/strict';
import test from 'node:test';
import './atlas-security.test.mjs';
import { readFileSync } from 'node:fs';
import { assertAtlasDataset, atlasAt, atlasSelection, isAtlasDate } from '../src/lib/engagement-atlas.ts';
import { legacyAtlasDestination } from '../src/lib/atlas-legacy-links.ts';

test('legacy AI links retain the selected date, relation and scenario on the dedicated page', () => {
  assert.equal(legacyAtlasDestination('#date=2026-08-17&relation=openai-sb-lease&scenario=default'), '/atlas/financement-ia/#date=2026-08-17&relation=openai-sb-lease&scenario=default');
  assert.equal(legacyAtlasDestination('#preuve-nvidia-sb-guarantee'), '/atlas/financement-ia/#preuve-nvidia-sb-guarantee');
  assert.equal(legacyAtlasDestination('#atlas-relations'), '/atlas/financement-ia/#atlas-relations');
});

test('collection fragments and untrusted redirect targets cannot change the destination', () => {
  for (const hash of ['', '#collection', '#https://evil.example', '#relation=javascript:alert(1)', '#date=bad', '#scenario=default', '#date=' + '0'.repeat(1200)]) assert.equal(legacyAtlasDestination(hash), null);
  assert.equal(legacyAtlasDestination('#date=2026-08-17&next=https://evil.example&token=secret'), '/atlas/financement-ia/#date=2026-08-17');
});

const source = JSON.parse(readFileSync(new URL('../src/data/engagement-atlas.json', import.meta.url), 'utf8'));
const credit = JSON.parse(readFileSync(new URL('../src/data/private-credit-atlas.json', import.meta.url), 'utf8'));
const oil = JSON.parse(readFileSync(new URL('../src/data/oil-financing-atlas.json', import.meta.url), 'utf8'));

test('oil atlas uses publication dates, not transaction years, and excludes later facilities', () => {
  assertAtlasDataset(oil);
  assert.equal(atlasAt(oil, '2020-04-02').relations.length, 0);
  const sienna = atlasAt(oil, '2023-05-04');
  assert.equal(sienna.relations.length, 4);
  assert.deepEqual(sienna.sources.map(item => item.id), ['sienna-judgment-2023']);
  assert.equal(sienna.nodes.some(item => item.id === 'trafigura' || item.id === 'sht'), false);
  const chad = atlasAt(oil, '2025-12-30');
  assert.equal(chad.relations.length, 9);
  assert.equal(chad.sources.some(item => item.id === 'trafigura-facilities-2026'), false);
  const latest = atlasAt(oil, '2026-03-10');
  assert.equal(latest.relations.length, 14);
  assert.equal(latest.relations.find(item => item.id === 'unicredit-bp-payment').observation.publishedOn, '2023-05-04');
  assert.equal(atlasSelection(oil, '#date=2026-03-10&scenario=default', 'unicredit-bp-payment').scenario, false);
});

test('oil atlas preserves expected repayment, bank roles and the distinct escrow circuit', () => {
  const relation = id => oil.relations.find(item => item.id === id);
  assert.match(relation('buyers-unicredit-payment').observations[0].label, /prévu/);
  assert.match(relation('unicredit-ercf-coordination').observations[0].label, /Coordination/);
  assert.match(relation('liquidity-trafigura-buffer').observations[0].limit, /ni sa prolongation/);
  assert.match(relation('glencore-escrow-receipts').observations[0].limit, /indisponibles/);
  assert.equal(oil.relations.some(item => item.from === 'escrow' && item.to === 'sht'), false);
  assert.equal(oil.relations.some(item => item.from === 'trafigura' && ['gulf', 'glencore', 'sht'].includes(item.to)), false);
  assert.equal(oil.relations.every(item => item.observations.every(observation => observation.amount === undefined)), true);
});

test('oil source origins and reading links reject lookalikes, credentials and executable URLs', () => {
  for (const origin of ['https://eiti.org', 'https://www.trafigura.com', 'https://www.quadrantchambers.com']) {
    for (const url of [`${origin}.evil.example/document`, `${origin}@evil.example/document`, `${origin}/document?token=secret`]) {
      const candidate = structuredClone(oil);
      candidate.sources[0].url = url;
      assert.throws(() => assertAtlasDataset(candidate));
    }
  }
  for (const href of ['javascript:alert(1)', '//evil.example/path', '/posts/../admin/', '/posts/%2e%2e/', '/posts/article/?token=secret', '/posts/article/#fragment']) {
    const candidate = structuredClone(oil);
    candidate.relations[0].reading.href = href;
    assert.throws(() => assertAtlasDataset(candidate));
  }
  const snapshot = atlasAt(oil, '2023-05-04');
  assert.equal(snapshot.relations.find(item => item.id === 'unicredit-bp-payment').reading.href, '/posts/les-banquiers-du-baril-1-financement-cargaison-petrole/');
});

test('private credit historical cuts keep later filings out of the announced partnership', () => {
  assertAtlasDataset(credit);
  const earlier = atlasAt(credit, '2024-09-20');
  assert.deepEqual(earlier.relations.map(relation => relation.id), ['bnp-atlas', 'funds-atlas']);
  assert.equal(earlier.nodes.some(node => node.id === 'arcc' || node.id === 'athene'), false);
  assert.equal(earlier.sources.length, 1);
  const ares = atlasAt(credit, '2026-07-29');
  assert.equal(ares.relations.some(relation => relation.id === 'arcc-hyland'), true);
  assert.equal(ares.relations.some(relation => relation.id === 'athene-atlas'), false);
});

test('each atlas has a valid initial relation and shared links cannot import the other scenario', () => {
  const initial = atlasSelection(credit, '', 'arcc-hyland');
  assert.equal(initial.relation, 'arcc-hyland');
  assert.equal(initial.scenario, false);
  const foreign = atlasSelection(credit, '#date=2026-08-10&relation=nvidia-sb-guarantee&scenario=default', 'arcc-hyland');
  assert.deepEqual(foreign, { date: '2026-08-10', relation: 'arcc-hyland', scenario: false });
  assert.equal(atlasSelection(credit, '#date=2024-09-20', 'arcc-hyland').relation, 'funds-atlas');
});

test('private credit data does not infer a bank loan to Hyland or confuse investment with management', () => {
  assert.equal(credit.relations.some(relation => ['bnp', 'jpm'].includes(relation.from) && relation.to === 'hyland'), false);
  assert.equal(credit.relations.some(relation => relation.from === 'ares-manager' && relation.to === 'hyland'), false);
  assert.equal(credit.relations.find(relation => relation.id === 'ares-arcc').observations[0].label, 'Mandat de gestion');
  assert.equal(credit.relations.every(relation => relation.observations.every(observation => observation.amount === undefined)), true);
  for (const url of ['https://www.apollo.com.evil.example/news', 'https://www.apollo.com@evil.example/news', 'https://www.apollo.com/news?token=secret']) {
    const candidate = structuredClone(credit);
    candidate.sources[0].url = url;
    assert.throws(() => assertAtlasDataset(candidate));
  }
});
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
