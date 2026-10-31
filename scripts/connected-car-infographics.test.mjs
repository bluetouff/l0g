import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import test from 'node:test';
import { CONNECTED_CAR_KINDS, CONNECTED_CAR_SOURCES, connectedCarFigureReferences } from '../src/lib/connected-car-figures.mjs';
import { connectedCarScenes, inspectConnectedCarSvg, assertConnectedCarGeometry, tag, attrs, content, labelBox } from './connected-car-svg-assertions.mjs';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';
const read = name => readFileSync(new URL('../' + name, import.meta.url), 'utf8');
const all = scene => inspectConnectedCarSvg(scene.svg).all;
const text = scene => all(scene).filter(node => tag(node) === 'text').map(content).join(' ');
const connector = (scene, id) => {
  const found = all(scene).filter(node => attrs(node)['data-connector'] === id);
  assert.equal(found.length, 1);
  return attrs(found[0]);
};

test('twelve compact passive scenes preserve native labels and semantic l0g themes', () => {
  const scenes = connectedCarScenes();
  assert.equal(scenes.length, 12);
  assert.equal(readdirSync(new URL('../src/figures/connected-car-data/', import.meta.url)).length, 12);
  const ids = [];
  for (const scene of scenes) {
    assertConnectedCarGeometry(scene.svg);
    const nodes = all(scene);
    assert.equal(attrs(nodes.find(node => tag(node) === 'rect')).fill, 'var(--color-ink)');
    assert.doesNotMatch(scene.svg, /—|horlog|clock|#[0-9a-f]{3,8}\b/iu);
    const title = content(nodes.find(node => tag(node) === 'title'));
    assert.doesNotMatch(title, /\bce (?:que|qui|qu[’'])|\bwhat\b|, pas |, not /iu);
    for (const node of nodes) {
      if (attrs(node).id) ids.push(attrs(node).id);
      if (tag(node) === 'text') assert.ok(Number(attrs(node)['font-size']) * (scene.mobile ? 280 / 420 : 501 / 1000) >= 11);
    }
  }
  assert.equal(ids.length, new Set(ids).size, 'All desktop/mobile/language IDs remain globally unique');
});

test('historical flow separates described transfers from the targeted insurance market', () => {
  for (const scene of connectedCarScenes().filter(scene => scene.kind === 'flow')) {
    const value = text(scene);
    for (const name of ['GM / OnStar', 'Smart Driver', 'Verisk / LexisNexis', '2020–2024']) assert.ok(value.includes(name));
    assert.equal(all(scene).filter(node => tag(node) === 'path').length, 6);
    for (const id of ['flow-0', 'flow-1']) assert.equal(connector(scene, id)['stroke-dasharray'], undefined);
    assert.equal(connector(scene, 'flow-2')['stroke-dasharray'], '7 7');
    assert.equal(connector(scene, 'flow-2').stroke, 'var(--color-amber)');
    const description = content(all(scene).find(node => tag(node) === 'desc'));
    assert.match(description, scene.lang === 'fr' ? /Aucun volume, taux de prime/ : /No volume, premium change/);
    assert.match(value, scene.lang === 'fr' ? /Débouché commercial/ : /Target market/);
  }
});

test('contract branches distinguish GPS received from GPS used in a driving rating', () => {
  for (const scene of connectedCarScenes().filter(scene => scene.kind === 'contracts')) {
    const value = text(scene), description = content(all(scene).find(node => tag(node) === 'desc'));
    assert.equal(all(scene).filter(node => tag(node) === 'path').length, 4);
    assert.ok(connector(scene, 'to-verisk'));
    assert.ok(connector(scene, 'to-lexis'));
    for (const name of ['GM / OnStar', 'Verisk', 'LexisNexis']) assert.ok(value.includes(name));
    assert.ok(value.includes(scene.lang === 'fr' ? 'GPS précis exclu' : 'Precise GPS excluded'));
    assert.ok(value.includes(scene.lang === 'fr' ? 'GPS précis non utilisé' : 'precise GPS not used'));
    assert.match(description, scene.lang === 'fr' ? /paragraphes 14 et 15/ : /paragraphs 14 and 15/);
    assert.match(description, scene.lang === 'fr' ? /attribués à la plainte/ : /attributed to the complaint/);
  }
});

test('ordinal timeline distinguishes the reported sharing cutoff, four announcements and the planned effective date', () => {
  const dates = {
    fr: ['20 mars 2024', '16 janvier 2025', '14 janvier 2026', '8 mai 2026', '29 octobre 2026', '30 novembre 2026'],
    en: ['20 March 2024', '16 January 2025', '14 January 2026', '8 May 2026', '29 October 2026', '30 November 2026'],
  };
  for (const scene of connectedCarScenes().filter(scene => scene.kind === 'timeline')) {
    const value = text(scene), nodes = all(scene), events = nodes.filter(node => tag(node) === 'circle');
    assert.equal(events.length, 6);
    for (const date of dates[scene.lang]) assert.ok(value.includes(date), date);
    assert.deepEqual(events.map(node => attrs(node)['data-event']), ['0', '1', '2', '3', '4', '5']);
    assert.deepEqual(events.map(node => attrs(node)['data-status']), ['reported', 'announced', 'announced', 'announced', 'announced', 'planned']);
    assert.equal(attrs(events.at(-1)).fill, 'var(--color-ink)');
    assert.equal(attrs(events.at(-1)).stroke, 'var(--color-amber)');
    assert.equal(connector(scene, 'timeline-planned')['stroke-dasharray'], '7 7');
    assert.equal(connector(scene, 'timeline-past')['stroke-dasharray'], undefined);
    assert.match(value, scene.lang === 'fr' ? /prévue/ : /planned/);
    assert.match(value, scene.lang === 'fr' ? /non proportionnel|ne représentent pas les durées/ : /not proportional|do not represent elapsed time/);
    assert.ok(value.includes(scene.lang === 'fr' ? '220 M$ annoncé' : '$220m multistate'));
    const description = content(nodes.find(node => tag(node) === 'desc'));
    assert.match(description, scene.lang === 'fr' ? /future au 31 octobre/ : /future as of 31 October/);
    assert.match(description, scene.lang === 'fr' ? /ne sont pas additionnés/ : /not added together/);
  }
});

test('closed metadata rejects unknown languages, reordered sources and missing editorial context', () => {
  for (const lang of ['fr', 'en']) for (const [index, kind] of CONNECTED_CAR_KINDS.entries()) assert.deepEqual(connectedCarFigureReferences(lang, kind, index + 1, [...CONNECTED_CAR_SOURCES[index]], 'Caption', 'Method'), CONNECTED_CAR_SOURCES[index]);
  for (const lang of [undefined, null, {}, new String('fr'), '__proto__']) assert.throws(() => connectedCarFigureReferences(lang, 'flow', 1, CONNECTED_CAR_SOURCES[0], 'Caption', 'Method'));
  for (const refs of [[], ['S01'], ['S01', 'S01'], ['S01', 'S02', 'S03', 'S04" onload="x']]) assert.throws(() => connectedCarFigureReferences('fr', 'flow', 1, refs, 'Caption', 'Method'));
  assert.throws(() => connectedCarFigureReferences('fr', 'timeline', 2, CONNECTED_CAR_SOURCES[2], 'Caption', 'Method'));
  assert.throws(() => connectedCarFigureReferences('fr', 'contracts', 2, CONNECTED_CAR_SOURCES[1], '', 'Method'));
  assert.throws(() => connectedCarFigureReferences('fr', 'contracts', 2, CONNECTED_CAR_SOURCES[1], 'Caption', ''));
});

test('strict passive geometry rejects scripts, remote assets, missing glyph context and card overflow', () => {
  const scene = connectedCarScenes().find(scene => scene.lang === 'fr' && scene.kind === 'flow' && !scene.mobile).svg;
  const mutations = [
    svg => svg.replace('</svg>', '<script>x</script></svg>'),
    svg => svg.replace('<svg ', '<svg onload="x" '),
    svg => svg.replace('</svg>', '<image href="https://example.com/a"/></svg>'),
    svg => svg.replace('l0g Connected Car', 'Arial'),
    svg => svg.replace('data-panel="connected-car-fr-flow-d-card-0"', 'data-panel="missing"'),
    svg => svg.replace('x="44"', 'x="995"'),
    svg => svg.replace('Freinages, vitesse', 'Freinages, vitesse et longue étiquette débordante'),
  ];
  for (const mutation of mutations) {
    const changed = mutation(scene);
    assert.notEqual(changed, scene, 'Mutation must actually change the input');
    assert.throws(() => assertConnectedCarGeometry(changed));
  }
  const labels = all({ svg: scene }).filter(node => tag(node) === 'text');
  assert.ok(labels.every(node => labelBox(node).x2 > labelBox(node).x1));
});

test('component preserves licensed local fonts, responsive scenes, source links and trailing space', () => {
  const component = read('src/components/ConnectedCarFigure.astro');
  for (const weight of [400, 700]) {
    const name = 'public/fonts/stablecoins/dejavu-sans-' + weight + '.ttf';
    assert.ok(component.includes(name.replace('public', '')));
    assert.equal(createHash('sha256').update(readFileSync(new URL('../' + name, import.meta.url))).digest('hex'), weight === 400 ? '98f2d74db16bb5f41f74adf6d899aeec92861682cccc58bfdbe4d9d7d0a5ae11' : '21a0350a4ac2a9f22b6a7a8dcaf6abb08c8b546d06499301f1fcf10996fd0df5');
  }
  assertFontLicenseReferences(read('public/fonts/stablecoins/LICENSE.txt'), 'dejavu');
  assert.match(component, /@container\s*\(max-width:\s*500px\)/u);
  assert.match(component, /padding-bottom:\s*1rem/u);
  assert.match(component, /figures\/connected-car-data/u);
  assert.doesNotMatch(component, /overflow\s*:\s*(?:hidden|clip)|client:|<script|fetch\(|foreignObject/iu);
});
