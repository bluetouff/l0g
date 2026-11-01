import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { followAtlasProofLink } from '../src/lib/atlas-proof-navigation.ts';
import { atlasAt, atlasSelection } from '../src/lib/engagement-atlas.ts';

const dataset = JSON.parse(readFileSync(new URL('../src/data/engagement-atlas.json', import.meta.url), 'utf8'));

function visitProof(hash, { reducedMotion = false, ...modifiers } = {}) {
  const location = new URL(`https://l0g.fr/atlas/financement-ia/${hash}`);
  const calls = [];
  const event = {
    button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false,
    defaultPrevented: false,
    preventDefault() { this.defaultPrevented = true; },
    ...modifiers,
  };
  const handled = followAtlasProofLink(event,
    { scrollIntoView(options) { calls.push(['scroll', options]); } },
    { focus(options) { calls.push(['focus', options]); } },
    reducedMotion);
  // Native anchor navigation is the behavior that used to discard the dated view.
  if (!event.defaultPrevented) location.hash = '#atlas-inspector-title';
  return { copiedUrl: location.href, calls, handled, event };
}

test('opening a proof keeps a historical relation in the URL subsequently copied and reopened', () => {
  const date = dataset.milestones[1].date;
  const relation = atlasAt(dataset, date).relations[0].id;
  const hash = `#${new URLSearchParams({ date, relation })}`;
  const before = atlasSelection(dataset, hash);
  const result = visitProof(hash);
  assert.equal(result.handled, true);
  assert.equal(result.event.defaultPrevented, true);
  assert.deepEqual(atlasSelection(dataset, new URL(result.copiedUrl).hash), before);
  assert.deepEqual(result.calls, [['scroll', { block: 'start', behavior: 'smooth' }], ['focus', { preventScroll: true }]]);
});

test('proof access preserves the hypothetical scenario and respects reduced motion', () => {
  const hash = '#date=2026-08-17&relation=openai-sb-lease&scenario=default';
  const result = visitProof(hash, { reducedMotion: true });
  assert.deepEqual(atlasSelection(dataset, new URL(result.copiedUrl).hash), atlasSelection(dataset, hash));
  assert.equal(atlasSelection(dataset, new URL(result.copiedUrl).hash).scenario, true);
  assert.equal(result.calls[0][1].behavior, 'instant');
});

test('modified clicks retain the link’s native browser behavior', () => {
  for (const modifiers of [{ ctrlKey: true }, { metaKey: true }, { shiftKey: true }, { altKey: true }, { button: 1 }]) {
    const result = visitProof('#date=2026-08-17&relation=openai-sb-lease', modifiers);
    assert.equal(result.handled, false);
    assert.equal(result.event.defaultPrevented, false);
    assert.deepEqual(result.calls, []);
  }
});

test('the native target remains usable without JavaScript and the client binds the guarded navigation', () => {
  const component = readFileSync(new URL('../src/components/EngagementAtlas.astro', import.meta.url), 'utf8');
  const client = readFileSync(new URL('../src/scripts/engagement-atlas.ts', import.meta.url), 'utf8');
  assert.match(component, /href="#atlas-inspector-title" data-atlas-proof-link/);
  assert.match(component, /id="atlas-inspector-title" tabindex="-1"/);
  assert.match(client, /target\.hasAttribute\('data-atlas-proof-link'\)[\s\S]*?followAtlasProofLink\(event,/);
});
