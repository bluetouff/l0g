import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import { syncBuiltinESMExports } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { readAtlasJson, MAX_ATLAS_BYTES } from './read-atlas-json.mjs';
import { atlasSourceUrl } from '../src/lib/engagement-atlas.ts';

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
