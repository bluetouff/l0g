import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import { syncBuiltinESMExports } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { readAtlasJson, MAX_ATLAS_BYTES } from './read-atlas-json.mjs';
import { assertAtlasDataset, atlasSourceUrl } from '../src/lib/engagement-atlas.ts';

const shanghaiPressSources = [
  'https://ba.bloombergadria.com/tehnologija/ai/117069/kompanija-povezana-s-alice-huang-nabavljala-zabranjene-nvidia-cipove-u-kini/news',
  'https://www.taisounds.com/news/content/84/309645',
];
const shanghaiRulesSource = 'https://fgw.sh.gov.cn/cmsres/00/00ed174f4ac74c55abec30d9b33b44fb/20235839cd48ee3784ef54b789d67706.pdf';

function pressDataset() {
  return {
    version: 1, id: 'financement-ia', title: 'Source classification fixture', reconstructedOn: '2026-09-16',
    sources: [
      ...shanghaiPressSources.map((url, index) => ({ id: `press-${index}`, title: 'Reviewed reporting', url, publishedOn: '2026-11-13', locator: 'Reporting, not the underlying registration.' })),
      { id: 'registry-rules', title: 'General registry rules', url: shanghaiRulesSource, publishedOn: '2021-12-28', locator: 'General rules, not an individual registration.' },
    ],
    nodes: [
      { id: 'declarant', label: 'Reported declarant', role: 'Reporting attribution fixture', column: 0, row: 0 },
      { id: 'counterparty', label: 'Unidentified counterparty', role: 'Unknown identity', column: 1, row: 0 },
    ],
    relations: [{
      id: 'reported-collateral', from: 'declarant', to: 'counterparty',
      observations: [{
        publishedOn: '2026-11-13', recordedOn: '2026-11-13', review: 'reviewed', kind: 'press-report',
        label: 'Reported registration', claim: 'The registration is attributed to the reporting.',
        limit: 'The individual filing was not inspected.', watch: 'Obtain the individual filing.',
        sources: ['press-0', 'registry-rules'],
      }],
    }],
    milestones: [{ date: '2026-11-13', label: 'Reporting published', change: 'Add the attributed report.' }],
  };
}

test('Shanghai sources are restricted to the two reviewed reports and exact government rules document', () => {
  for (const source of [...shanghaiPressSources, shanghaiRulesSource]) {
    assert.equal(atlasSourceUrl(source), source);
    const url = new URL(source);
    for (const value of [
      `${url.origin}/`, `${url.origin}/admin`, source + '/other',
      source + '?download=true', source + '?', source + '#page=1', source + '#',
      source.replace(url.hostname, `${url.hostname}.evil.example`),
      source.replace('https://', 'https://user:pass@'),
      source.replace('https://', 'http://'),
    ]) assert.throws(() => atlasSourceUrl(value), value);
  }
  assert.throws(() => atlasSourceUrl('https://www.taisounds.com/news/content/84/309646'));
  assert.throws(() => atlasSourceUrl(shanghaiRulesSource.replace('.pdf', '-other.pdf')));
});

test('reviewed press sources cannot be presented as contracts, party announcements or primary limitations', () => {
  for (const pressId of ['press-0', 'press-1']) {
    const valid = pressDataset();
    valid.relations[0].observations[0].sources = [pressId, 'registry-rules'];
    assert.doesNotThrow(() => assertAtlasDataset(valid));
    for (const kind of ['contract', 'announcement', 'limitation']) {
      const changed = structuredClone(valid);
      changed.relations[0].observations[0].kind = kind;
      assert.throws(() => assertAtlasDataset(changed), /source de presse incompatible/);
    }
  }
});

test('a press-report needs a cited reviewed press URL, not merely a press source elsewhere in the dataset', () => {
  const primaryOnly = pressDataset();
  primaryOnly.relations[0].observations[0].sources = ['registry-rules'];
  assert.throws(() => assertAtlasDataset(primaryOnly), /sans source de presse revue/);

  const primaryContract = structuredClone(primaryOnly);
  primaryContract.relations[0].observations[0].kind = 'contract';
  primaryContract.relations[0].observations[0].publishedOn = '2021-12-28';
  primaryContract.milestones[0].date = '2021-12-28';
  assert.doesNotThrow(() => assertAtlasDataset(primaryContract));
});

test('press classification uses canonical URLs so host casing and the default HTTPS port cannot bypass it', () => {
  const changed = pressDataset();
  changed.sources[0].url = changed.sources[0].url.replace('https://ba.bloombergadria.com', 'HTTPS://BA.BLOOMBERGADRIA.COM:443');
  assert.doesNotThrow(() => assertAtlasDataset(changed));
  changed.relations[0].observations[0].kind = 'contract';
  assert.throws(() => assertAtlasDataset(changed), /source de presse incompatible/);
});

test('press reports reject even a valid USD conditional cap while the primary Nvidia guarantee retains its amount', () => {
  const published = JSON.parse(fs.readFileSync(new URL('../src/data/engagement-atlas.json', import.meta.url), 'utf8'));
  assert.doesNotThrow(() => assertAtlasDataset(published));
  const guarantee = published.relations.find(relation => relation.id === 'nvidia-sb-guarantee').observations.at(-1).amount;
  assert.deepEqual(guarantee, { value: '105000000000', currency: 'USD', kind: 'conditional-cap', label: '105 Md$ · plafond initial cumulé' });
  for (const amount of [structuredClone(guarantee), undefined]) {
    const changed = pressDataset();
    changed.relations[0].observations[0].amount = amount;
    assert.throws(() => assertAtlasDataset(changed), /montant structuré interdit pour une relation de presse/);
  }
});

test('Blackstone source access is restricted to the reviewed Broadcom financing release', () => {
  const source = 'https://www.blackstone.com/news/press/bank-of-america-blackstone-citi-and-morgan-stanley-announce-landmark-63-billion-financing-structure-to-enable-ai-compute/';
  assert.equal(atlasSourceUrl(source), source);
  for (const value of [
    'https://www.blackstone.com/', source.replace('/news/press/', '/admin/'),
    source + '?next=https://evil.example', source + '#fragment', source + 'other',
    source.replace('.com/', '.com.evil.example/'), source.replace('.com/', '.com@evil.example/'),
    source.replace('https://', 'http://'), source.replace('https://', 'https://user:pass@'),
  ]) assert.throws(() => atlasSourceUrl(value), value);
});

test('Partners Group permits only its canonical release path and a single UUID selector', () => {
  const path = 'https://www.partnersgroup.com/news-and-views/press-releases/corporate-news/detail';
  const query = '?news_id=ac75f52a-67b8-427a-8a95-3bf8855bf5fc';
  assert.equal(atlasSourceUrl(path + query), path + query);
  for (const value of [
    path, path + '?news_id=not-a-uuid', path + query + '&next=https://evil.example',
    path + query + '&news_id=ac75f52a-67b8-427a-8a95-3bf8855bf5fc',
    path + query + '#fragment', path.replace('/detail', '/admin') + query,
    path.replace('https://', 'http://') + query,
    path.replace('https://', 'https://user:pass@') + query,
    path.replace('.com/', '.com.evil.example/') + query,
    path.replace('.com/', '.com@evil.example/') + query,
    path + query.replace('news_id=', 'news_id=%61'),
  ]) assert.throws(() => atlasSourceUrl(value), value);
});

test('atlas source links retain exact HTTPS origin and path validation at use', () => {
  const sec = 'https://www.sec.gov/Archives/edgar/data/1/2/a.htm';
  assert.equal(atlasSourceUrl('HTTPS://WWW.SEC.GOV:443/Archives/edgar/data/1/2/a.htm'), sec);
  assert.equal(atlasSourceUrl('https://ir.blackrock.com/news'), 'https://ir.blackrock.com/news');
  const newsweb = 'https://newsweb.oslobors.no/message/682895';
  assert.equal(atlasSourceUrl(newsweb), newsweb);
  for (const url of [
    'https://newsweb.oslobors.no.evil.example/message/682895',
    'https://newsweb.oslobors.no@evil.example/message/682895',
    'https://user:pass@newsweb.oslobors.no/message/682895',
    `${newsweb}?token=private`, `${newsweb}#fragment`,
    'https://newsweb.oslobors.no/admin', 'https://newsweb.oslobors.no/message/not-a-number',
    `${newsweb}/extra`, 'http://newsweb.oslobors.no/message/682895',
  ]) assert.throws(() => atlasSourceUrl(url));
  const pagaya = 'https://investor.pagaya.com/news-releases/news-release-details/pagaya-secures-first-variable-funding-note-facility-atlas-sp';
  assert.equal(atlasSourceUrl(pagaya), pagaya);
  for (const url of [
    pagaya.replace('investor.pagaya.com', 'investor.pagaya.com.evil.example'),
    pagaya.replace('investor.pagaya.com', 'investor.pagaya.com@evil.example'),
    pagaya.replace('https://', 'https://user:pass@'),
    `${pagaya}?token=private`, `${pagaya}#fragment`, `${pagaya}/extra`,
    'https://investor.pagaya.com/admin',
    pagaya.replace('https://', 'http://'),
  ]) assert.throws(() => atlasSourceUrl(url));
  const documents = [
    'https://investor.pagaya.com/static-files/656c85c1-d518-4f09-bd5c-f47e45e67598',
    'https://www.volareshipping.com/news/volare-shipping-ltd-stabilisation-notice/',
    'https://mb.cision.com/Public/24324/4404303/ad59eaca69c8f1aa.pdf',
  ];
  for (const url of documents) {
    assert.equal(atlasSourceUrl(url), url);
    for (const invalid of [
      url.replace('https://', 'http://'),
      url.replace('https://', 'https://user:pass@'),
      url.replace('.com/', '.com.evil.example/'),
      url.replace('.com/', '.com@evil.example/'),
      `${url}?token=private`, `${url}#fragment`, `${url}/extra`,
    ]) assert.throws(() => atlasSourceUrl(invalid));
  }
  for (const url of [
    'https://investor.pagaya.com/static-files/not-a-uuid',
    'https://investor.pagaya.com/static-files/656c85c1-d518-4f09-bd5c-f47e45e67598.exe',
    'https://www.volareshipping.com/admin/',
    'https://www.volareshipping.com/news/volare-shipping-ltd-stabilisation-notice',
    'https://mb.cision.com/Public/24325/4404303/ad59eaca69c8f1aa.pdf',
    'https://mb.cision.com/Public/24324/not-a-number/ad59eaca69c8f1aa.pdf',
    'https://mb.cision.com/Public/24324/4404303/ad59eaca69c8f1aa.html',
    'https://mb.cision.com/admin',
  ]) assert.throws(() => atlasSourceUrl(url));
  for (const origin of ['https://aligneddc.com', 'https://arcc.ares.com']) {
    assert.equal(atlasSourceUrl(`${origin}/news`), `${origin}/news`);
    for (const url of [`${origin}.evil.example/news`, `${origin}@evil.example/news`, `${origin}/news?token=private`, `${origin}/news#fragment`, origin.replace('https://', 'https://user:pass@') + '/news']) assert.throws(() => atlasSourceUrl(url));
  }
  for (const value of ['javascript:void(0)', 'JaVaScRiPt:void(0)', 'java\nscript:void(0)', 'data:text/html,test', '//www.sec.gov/x', 'http://www.sec.gov/x', 'https://www.sec.gov.evil.example/x', 'https://www.sec.gov@evil.example/x', `${sec}?token=private`, `${sec}#anchor`, 'https://www.sec.gov/admin', 'https://user:pass@ir.blackrock.com/news']) assert.throws(() => atlasSourceUrl(value));
});

test('atlas reader bounds bytes, rejects non-files and closes descriptors on errors', () => {
  const dir = fs.mkdtempSync(join(tmpdir(), 'l0g-atlas-security-')), path = join(dir, 'proposal.json');
  const write = value => fs.writeFileSync(path, value);
  try {
    write('{}' + ' '.repeat(MAX_ATLAS_BYTES - 2)); assert.deepEqual(readAtlasJson(path), {});
    write('{}' + ' '.repeat(MAX_ATLAS_BYTES - 1)); assert.throws(() => readAtlasJson(path));
    write(Buffer.from([0xff])); assert.throws(() => readAtlasJson(path));
    write('{'); assert.throws(() => readAtlasJson(path));
    assert.throws(() => readAtlasJson(dir));
    write('{"legitimate":true}'); assert.deepEqual(readAtlasJson(path), { legitimate: true });
    const link = join(dir, 'link.json'); fs.symlinkSync(path, link); assert.deepEqual(readAtlasJson(link), { legitimate: true });
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('file growth after descriptor metadata cannot exceed the read budget', () => {
  const dir = fs.mkdtempSync(join(tmpdir(), 'l0g-atlas-growth-')), path = join(dir, 'proposal.json');
  fs.writeFileSync(path, '{}');
  const originalStat = fs.fstatSync, originalRead = fs.readSync, originalClose = fs.closeSync;
  let bytes = 0, closed = 0;
  try {
    fs.fstatSync = fd => { const stat = originalStat(fd); fs.appendFileSync(path, ' '.repeat(MAX_ATLAS_BYTES)); return stat; };
    fs.readSync = (...args) => { const count = originalRead(...args); bytes += count; return count; };
    fs.closeSync = fd => { closed++; return originalClose(fd); };
    syncBuiltinESMExports();
    assert.throws(() => readAtlasJson(path), /Taille excessive/);
    assert.equal(bytes, MAX_ATLAS_BYTES + 1); assert.equal(closed, 1);
  } finally { fs.fstatSync = originalStat; fs.readSync = originalRead; fs.closeSync = originalClose; syncBuiltinESMExports(); fs.rmSync(dir, { recursive: true, force: true }); }
});

test('path replacement after open cannot swap the consumed file', () => {
  const dir = fs.mkdtempSync(join(tmpdir(), 'l0g-atlas-swap-')), path = join(dir, 'proposal.json');
  fs.writeFileSync(path, '{"original":true}');
  const original = fs.fstatSync;
  try {
    fs.fstatSync = fd => { const stat = original(fd); fs.renameSync(path, join(dir, 'opened.json')); fs.writeFileSync(path, '{"replaced":true}'); return stat; };
    syncBuiltinESMExports(); assert.deepEqual(readAtlasJson(path), { original: true });
  } finally { fs.fstatSync = original; syncBuiltinESMExports(); fs.rmSync(dir, { recursive: true, force: true }); }
});

test('checker preserves public and proposal workflows and generic diagnostics', () => {
  const run = args => spawnSync(process.execPath, ['--experimental-strip-types', 'scripts/check-engagement-atlas.mjs', ...args], { encoding: 'utf8' });
  assert.equal(run([]).status, 0);
  const proposal = run(['--proposal', 'src/data/engagement-atlas.json']); assert.equal(proposal.status, 0); assert.match(proposal.stdout, /Aucune approbation/);
  const failure = run(['--proposal', '/missing-private-proposal.json']); assert.equal(failure.status, 1); assert.doesNotMatch(failure.stderr, /missing-private/);
});
