import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync, readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { ENCRYPTION_ACCESS_KINDS, encryptionAccessScenes, inspectEncryptionAccessSvg, assertEncryptionAccessGeometry, tag, attrs, content } from './encryption-access-svg-assertions.mjs';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';
const scenes = encryptionAccessScenes();
const read = file => readFileSync(new URL('../' + file, import.meta.url), 'utf8');
const elements = s => inspectEncryptionAccessSvg(s.svg).all;
const metric = (s, value) => elements(s).filter(n => attrs(n)['data-metric'] === value);
const words = s => elements(s).filter(n => ['text', 'title', 'desc'].includes(tag(n))).map(content).join(' ');

test('twelve passive FR/EN scenes preserve licensed exact-font geometry and semantic theme colours', () => {
  assert.equal(scenes.length, 12);
  assert.equal(readdirSync(new URL('../src/figures/encryption-access-2026/', import.meta.url)).length, 12);
  const ids = [];
  for (const scene of scenes) {
    assertEncryptionAccessGeometry(scene.svg);
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

test('the Senate bar exactly distinguishes votes cast, votes for or against, and abstentions', () => {
  for (const scene of scenes.filter(s => s.kind === 'parliament')) {
    const bars = metric(scene, 'senate-vote');
    assert.deepEqual(bars.map(n => [attrs(n)['data-step'], Number(attrs(n)['data-value']), attrs(n)['data-unit']]), [['for',181,'votes'],['against',134,'votes'],['abstain',19,'votes']]);
    assert.equal(181+134, 315); assert.equal(181+134+19, 334);
    const width = scene.mobile ? 372 : 952;
    let x = 24;
    for (const bar of bars) {
      const a = attrs(bar), value = Number(a['data-value']);
      assert.ok(Math.abs(Number(a.width) - width * value / 334) < .000001);
      assert.ok(Math.abs(Number(a.x) - x) < .000001); x += width * value / 334;
    }
    assert.match(words(scene), /2025/); assert.match(words(scene), /2026/);
    assert.match(words(scene), scene.lang === 'fr' ? /programmées.*attendue/ : /Scheduled.*pending/s);
    assert.match(words(scene), /334.*315/s);
  }
});

test('end-to-end content stays at endpoints while access routes retain their conditions', () => {
  for (const scene of scenes.filter(s => s.kind === 'message')) {
    const text = words(scene);
    assert.match(text, scene.lang === 'fr' ? /Terminal A.*Contenu lisible.*Relais.*Terminal B.*Contenu lisible/s : /Device A.*Readable content.*Relay.*Device B.*Readable content/s);
    assert.match(text, scene.lang === 'fr' ? /Métadonnées possibles/ : /Metadata may exist|Possible metadata/);
    assert.match(text, scene.lang === 'fr' ? /Captation sur un terminal/ : /Capture on an endpoint/);
    assert.match(text, scene.lang === 'fr' ? /Clé déjà disponible, selon le cas/ : /existing.*key, if actually held/i);
    assert.equal(metric(scene, 'senate-vote').length, 0);
    assert.match(text, scene.lang === 'fr' ? /Chaque architecture/ : /Each architecture/);
  }
});

test('shared access is a conditional model with one authorised target and illustrative other accounts', () => {
  for (const scene of scenes.filter(s => s.kind === 'risk')) {
    assert.equal(metric(scene, 'account-dependency').length, 4);
    assert.deepEqual(metric(scene, 'account-dependency').map(n => attrs(n)['data-to']).sort(), ['other','other','other','target']);
    assert.ok(metric(scene, 'shared-dependency').length >= 1);
    const text = words(scene);
    assert.match(text, scene.lang === 'fr' ? /conceptuel/i : /conceptual/i);
    assert.match(text, scene.lang === 'fr' ? /En cas de compromission/ : /If compromised/);
    assert.match(text, scene.lang === 'fr' ? /illustratif|illustratifs/ : /illustrative/i);
    assert.match(text, scene.lang === 'fr' ? /française à documenter/ : /French design remains unspecified/);
  }
});

test('the controlled component retains source anchors, licensed regular font and compact responsive sizes', () => {
  const component = read('src/components/EncryptionAccessFigure.astro');
  assertFontLicenseReferences(read('public/fonts/ukraine-reparations/LICENSE.txt'), 'liberation');
  for (const kind of ENCRYPTION_ACCESS_KINDS) for (const lang of ['fr','en']) for (const mode of ['desktop','mobile']) assert.ok(component.includes(`../figures/encryption-access-2026/${kind}.${lang}.${mode}.svg?raw`));
  assert.match(component, /Object\.prototype\.hasOwnProperty\.call\(captions, kind\)/);
  assert.match(component, /@container \(max-width: 500px\)/); assert.match(component, /max-width: 340px/); assert.match(component, /padding-bottom: 1rem/);
  assert.doesNotMatch(component, /overflow\s*:\s*hidden|Arial|Helvetica|font-weight:\s*700/);
  assert.match(component, /\/fonts\/ukraine-reparations\/liberation-sans-400\.ttf/);
  assert.match(component, /href=\{`#source-\$\{id\}`\}/);
  for (const id of ['S01','S02','S03','S04','S05','S06','S07','S08','S10','S11','S12','S16','S17','S19','S21','S22','S23','S24','S27']) assert.ok(component.includes('"'+id+'"'));
});

test('geometry rejects active markup, false metrics, missing regions and frame escape', () => {
  const svg = scenes[0].svg;
  const variants = [svg.replace('</svg>', '<script>alert(1)</script></svg>'), svg.replace('<svg ', '<svg onload="x" '), svg.replace('<svg ', '<svg href="https://example.invalid/" '), svg.replace('font-weight="400"', 'font-weight="700"'), svg.replace('data-panel="enc-parliament-fr-d-label1"', 'data-panel="missing"'), svg.replace('x="24" y="48"', 'x="990" y="48"'), svg.replace('data-metric="senate-vote"', 'data-metric="unknown"')];
  for (const altered of variants) assert.throws(() => assertEncryptionAccessGeometry(altered));
});

test('long malformed path numbers fail within a bounded process', () => {
  const script = `import{assertEncryptionAccessGeometry,encryptionAccessScenes}from'./scripts/encryption-access-svg-assertions.mjs';const s=encryptionAccessScenes()[0].svg.replace(/d="M[^\"]+"/u,'d="M'+'1'.repeat(8000)+' 1 L2 2"');try{assertEncryptionAccessGeometry(s);process.exit(1)}catch{process.exit(0)}`;
  const child = spawnSync(process.execPath, ['--input-type=module','-e',script], {cwd:new URL('../',import.meta.url),timeout:1500,encoding:'utf8'});
  assert.ifError(child.error);assert.equal(child.status,0,child.stderr);
});
