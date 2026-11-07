import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync, readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { ENCRYPTION_JOURNEY_KINDS, encryptionJourneyScenes, inspectEncryptionJourneySvg, assertEncryptionJourneyGeometry, tag, attrs, content } from './encryption-journey-svg-assertions.mjs';
import { pathPoints } from './insurance-returns-svg-assertions.mjs';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';
const scenes = encryptionJourneyScenes();
const read = file => readFileSync(new URL('../' + file, import.meta.url), 'utf8');
const elements = s => inspectEncryptionJourneySvg(s.svg).all;
const metric = (s, value) => elements(s).filter(n => attrs(n)['data-metric'] === value);
const words = s => elements(s).filter(n => ['text', 'title', 'desc'].includes(tag(n))).map(content).join(' ');

test('twelve passive scenes preserve exact-font geometry, restrained typography and semantic theme colours', () => {
  assert.equal(scenes.length, 12);
  assert.equal(readdirSync(new URL('../src/figures/encryption-journey-2026/', import.meta.url)).length, 12);
  const ids = [];
  for (const scene of scenes) {
    assertEncryptionJourneyGeometry(scene.svg);
    assert.doesNotMatch(scene.svg, /<script|foreignObject|—|#[a-f0-9]{3,8}\b|(?:deux|2) horloges|two clocks|mérite mieux que|deserves better than/iu);
    for (const node of elements(scene)) {
      const a = attrs(node);
      if (a.id) ids.push(a.id);
      if (tag(node) === 'text') {
        assert.equal(a['font-weight'], '400');
        assert.ok(Number(a['font-size']) * (scene.mobile ? 280 / 420 : 501 / 1000) >= 12);
      }
      if (tag(node) === 'title') assert.doesNotMatch(content(node), /\bce (?:qui|que|qu[’'])|\bwhat\b|, pas |, not /iu);
    }
  }
  assert.equal(ids.length, new Set(ids).size);
});

test('TLS terminates per hop while the added content layer spans authorised endpoints', () => {
  for (const scene of scenes.filter(s => s.kind === 'layers')) {
    const hops = metric(scene, 'transport-route').map(n => attrs(n));
    assert.deepEqual(hops.map(a => [a['data-from'], a['data-to'], a['data-mode']]), [['device-a','service','tls'],['service','device-b','tls'],['device-a','service','tls'],['service','device-b','tls']]);
    assert.deepEqual(metric(scene, 'content-route').map(n => [attrs(n)['data-from'],attrs(n)['data-to'],attrs(n)['data-mode']]), [['device-a','device-b','end-to-end']]);
    assert.deepEqual(metric(scene, 'content-state').map(n => [attrs(n)['data-to'],attrs(n)['data-mode']]), [['device-a','readable'],['service','readable'],['device-b','readable'],['device-a','readable'],['service','encrypted'],['device-b','readable']]);
    assert.match(words(scene), /TLS/); assert.match(words(scene), scene.lang === 'fr' ? /Métadonnées/ : /Metadata/);
    assert.equal(metric(scene, 'backup-key').length, 0);
  }
});

test('future delivery and conditional history transfer reach the correct visible device edges', () => {
  for (const scene of scenes.filter(s => s.kind === 'readers')) {
    const readers = metric(scene, 'authorised-reader');
    assert.deepEqual(readers.map(n => attrs(n)['data-to']), ['existing-phone','existing-computer','new-device']);
    const future = metric(scene, 'future-delivery');
    assert.deepEqual(future.map(n => [attrs(n)['data-from'],attrs(n)['data-to']]), [['future-messages','existing-phone'],['future-messages','existing-computer'],['future-messages','new-device']]);
    const history = metric(scene, 'history-transfer');
    assert.deepEqual(history.map(n => [attrs(n)['data-from'],attrs(n)['data-to'],attrs(n)['data-mode']]), [['archive','new-device','conditional']]);
    assert.match(attrs(history[0])['stroke-dasharray'], /6 6/);
    for (const route of [...future,...history]) {
      const a = attrs(route), device = readers.find(n => attrs(n)['data-to'] === a['data-to']);
      const points = pathPoints(attrs(device).d), end = pathPoints(a.d).at(-1);
      const xs = points.map(p=>p[0]), ys = points.map(p=>p[1]);
      assert.ok(end[1] >= Math.min(...ys) && end[1] <= Math.max(...ys));
      assert.ok(Math.min(Math.abs(end[0]-Math.min(...xs)),Math.abs(end[0]-Math.max(...xs))) <= 5, 'Delivery actually meets the corresponding device edge');
    }
    assert.match(words(scene), scene.lang === 'fr' ? /illustratif|illustratifs/ : /illustrative/i);
    assert.match(words(scene), scene.lang === 'fr' ? /association/ : /linked/);
  }
});

test('Apple’s backup has a copied Messages key under two distinct key-holder configurations', () => {
  for (const scene of scenes.filter(s => s.kind === 'backup')) {
    assert.deepEqual(metric(scene, 'backup-key').map(n=>[attrs(n)['data-to'],attrs(n)['data-mode']]), [['provider','standard'],['trusted-devices','advanced']]);
    assert.deepEqual(metric(scene, 'message-key-copy').map(n=>attrs(n)['data-mode']), ['standard','advanced']);
    for (const mode of ['standard','advanced']) {
      assert.deepEqual(metric(scene, 'opens-backup').filter(n=>attrs(n)['data-mode']===mode).map(n=>[attrs(n)['data-from'],attrs(n)['data-to']]), [['backup-key','backup']]);
      assert.deepEqual(metric(scene, 'opens-messages').filter(n=>attrs(n)['data-mode']===mode).map(n=>[attrs(n)['data-from'],attrs(n)['data-to']]), [['message-key-copy','messages']]);
    }
    const text = words(scene);
    assert.match(text,/Apple|APPLE/);assert.match(text,/Messages/);
    assert.match(text,scene.lang==='fr'?/Sauvegarde iCloud/:/iCloud Backup/);
    assert.match(text,scene.lang==='fr'?/pays et comptes éligibles/:/country.*account eligibility|eligible country\/account/);
    assert.match(text,scene.lang==='fr'?/Métadonnées|métadonnées/:/Metadata|metadata/);
  }
});

test('controlled integration keeps sequential figure anchors, exact source families and licensed responsive rendering', () => {
  const component = read('src/components/EncryptionJourneyFigure.astro');
  assertFontLicenseReferences(read('public/fonts/ukraine-reparations/LICENSE.txt'), 'liberation');
  for (const kind of ENCRYPTION_JOURNEY_KINDS) for (const lang of ['fr','en']) for (const mode of ['desktop','mobile']) assert.ok(component.includes(`../figures/encryption-journey-2026/${kind}.${lang}.${mode}.svg?raw`));
  assert.deepEqual([...component.matchAll(/"number": "(\d+)"/gu)].map(m=>m[1]), ['01','02','03']);
  assert.match(component, /Object\.prototype\.hasOwnProperty\.call\(captions, kind\)/);
  assert.match(component, /@container \(max-width: 500px\)/);assert.match(component,/max-width: 340px/);assert.match(component,/padding-bottom: 1rem/);
  assert.doesNotMatch(component,/overflow\s*:\s*hidden|Arial|Helvetica|font-weight:\s*700|situation C|Route C/);
  assert.match(component,/\/fonts\/ukraine-reparations\/liberation-sans-400\.ttf/);
  assert.match(component,/href=\{`#source-\$\{id\}`\}/);
  for(const id of['T01','T02','T04','T05','T07','T08','T11','T12','T13','T24'])assert.ok(component.includes('"'+id+'"'));
  assert.match(component,/comptes Apple gérés.*comptes enfants/);assert.match(component,/managed Apple accounts and child accounts/);
  assert.match(component,/Royaume-Uni/);assert.match(component,/In the UK/);
});

test('geometry rejects executable markup, fabricated routes, missing label regions and frame escape', () => {
  const svg=scenes[0].svg;
  const variants=[svg.replace('</svg>','<script>alert(1)</script></svg>'),svg.replace('<svg ','<svg onload="x" '),svg.replace('<svg ','<svg href="https://example.invalid/" '),svg.replace('font-weight="400"','font-weight="700"'),svg.replace('data-panel="journey-layers-fr-d-label1"','data-panel="missing"'),svg.replace('x="24" y="44"','x="990" y="44"'),svg.replace('data-metric="transport-route"','data-metric="unknown"')];
  for(const altered of variants)assert.throws(()=>assertEncryptionJourneyGeometry(altered));
});

test('long malformed path input fails within a bounded process', () => {
  const script=`import{assertEncryptionJourneyGeometry,encryptionJourneyScenes}from'./scripts/encryption-journey-svg-assertions.mjs';const s=encryptionJourneyScenes()[0].svg.replace(/d="M[^\"]+"/u,'d="M'+'1'.repeat(8000)+' 1 L2 2"');try{assertEncryptionJourneyGeometry(s);process.exit(1)}catch{process.exit(0)}`;
  const child=spawnSync(process.execPath,['--input-type=module','-e',script],{cwd:new URL('../',import.meta.url),timeout:1500,encoding:'utf8'});assert.ifError(child.error);assert.equal(child.status,0,child.stderr);
});
