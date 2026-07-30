import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const maintenantPath = new URL('../src/pages/maintenant.astro', import.meta.url);
const provenancePath = new URL('../src/components/RiskProvenance.astro', import.meta.url);

test('les cartes de signaux ouvertes restent lisibles sans étirer les cartes fermées', async () => {
  const [maintenant, provenance] = await Promise.all([
    readFile(maintenantPath, 'utf8'),
    readFile(provenancePath, 'utf8'),
  ]);

  assert.match(
    maintenant,
    /\.signal-grid\s*\{[\s\S]*?grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\);[\s\S]*?align-items:\s*start;/,
  );
  assert.match(
    maintenant,
    /\.signal-card\s*\{[\s\S]*?min-width:\s*0;[\s\S]*?align-self:\s*start;/,
  );
  assert.match(
    provenance,
    /\.is-compact \.proof-panel\s*\{[\s\S]*?width:\s*100%;/,
  );
  assert.doesNotMatch(
    provenance,
    /\.is-compact \.proof-panel\s*\{[\s\S]*?width:\s*min\(20rem,/,
  );
  assert.match(
    provenance,
    /\.proof-panel dd\s*\{[\s\S]*?overflow-wrap:\s*anywhere;/,
  );
  assert.match(
    provenance,
    /\.proof-formula li,[\s\S]*?\.proof-warnings li\s*\{\s*overflow-wrap:\s*anywhere;/,
  );
});
