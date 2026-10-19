import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');

test('PA Check card is passive, concise and links to the canonical tool', async () => {
  const component = await read('../src/components/PaCheckCard.astro');

  assert.match(component, /href="https:\/\/pa\.l0g\.fr\/"/);
  assert.match(component, /target="_blank"[\s\S]*rel="noopener noreferrer"/);
  assert.match(component, /class="pa-wordmark"><b>l<span>0<\/span>g<\/b> PA Check<\/span>/);
  assert.match(component, /\.pa-wordmark\s*\{[\s\S]*?gap:\s*0\.5rem;/);
  assert.match(component, /class="pa-updated">updated</);
  assert.match(component, /Choisir sa plateforme agréée\./);
  assert.match(component, /Vérifiez votre outil actuel ou trouvez une PA adaptée à votre activité\./);
  assert.doesNotMatch(component, /<(?:script|iframe|img)\b/i);
});

test('French sidebars place support, Watch, PA Check and the home Hebdo in the requested order', async () => {
  const [home, article] = await Promise.all([
    read('../src/components/HomeSidebar.astro'),
    read('../src/pages/posts/[...slug].astro'),
  ]);

  assert.match(home, /<SupportCard \/>[\s\S]*<WatchCard \/>[\s\S]*<PaCheckCard \/>[\s\S]*<WeeklyCta variant="home" \/>/);
  assert.match(article, /<SupportCard compact \/>[\s\S]*<WatchCard compact \/>[\s\S]*<PaCheckCard compact \/>/);
});
