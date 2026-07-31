import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

test('la confluence 13FLOW reste accessible sans connaître son URL', async () => {
  const [riskBand, dashboards, sidebarConfig, confluence, navigation] = await Promise.all([
    readFile(new URL('src/components/RiskBand.astro', root), 'utf8'),
    readFile(new URL('src/pages/dashboards.astro', root), 'utf8'),
    readFile(new URL('src/config/sidebar.ts', root), 'utf8'),
    readFile(new URL('src/pages/confluence.astro', root), 'utf8'),
    readFile(new URL('src/components/SiteNavigation.astro', root), 'utf8'),
  ]);

  assert.match(riskBand, /class="confluence-entry card"/);
  assert.match(riskBand, /href="\/confluence\/"[\s\S]*Voir toutes les confluences/);
  assert.match(riskBand, /href="\/methodologie\/13flow\/"/);

  assert.match(sidebarConfig, /l0gEntry:\s*\{[\s\S]*href: '\/confluence\/'/);
  assert.match(sidebarConfig, /label: 'Voir les confluences'/);
  assert.match(dashboards, /href=\{d\.l0gEntry\?\.href \?\? d\.href\}/);
  assert.match(dashboards, /ouvrir 13FLOW/);

  assert.match(navigation, /\{ href: '\/confluence\/', label: 'Signaux croisés'/);
  assert.doesNotMatch(confluence, /<section data-pagefind-ignore>/);
  assert.match(confluence, /<div[^>]+data-pagefind-ignore>/);
});
