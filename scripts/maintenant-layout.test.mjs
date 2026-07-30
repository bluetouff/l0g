import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const maintenantPath = new URL('../src/pages/maintenant.astro', import.meta.url);
const provenancePath = new URL('../src/components/RiskProvenance.astro', import.meta.url);

test('les cartes de signaux restent une liste compacte et lisible quand plusieurs preuves sont ouvertes', async () => {
  const [maintenant, provenance] = await Promise.all([
    readFile(maintenantPath, 'utf8'),
    readFile(provenancePath, 'utf8'),
  ]);

  assert.match(
    maintenant,
    /\.signal-grid\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0,\s*1fr\);/,
  );
  assert.match(
    maintenant,
    /\.signal-card\s*\{[\s\S]*?display:\s*grid;[\s\S]*?grid-template-columns:\s*minmax\(11rem,\s*0\.75fr\)\s*minmax\(0,\s*1\.5fr\);/,
  );
  assert.match(
    maintenant,
    /\.signal-card\s*>\s*:global\(\.risk-provenance\)\s*\{\s*grid-column:\s*1\s*\/\s*-1;/,
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
