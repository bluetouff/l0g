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


test('les liens du journal restent sur les dépôts SEC attendus', async () => {
  const { secSourceUrl } = await import('../public/filing-events.js');
  const cik = '0001998597';
  const source = { accession: '0000902664-26-000001', url: 'https://www.sec.gov/Archives/edgar/data/1998597/000090266426000001/' };
  assert.equal(secSourceUrl(cik, source), source.url);
  for (const url of ['javascript:alert(1)', 'https://www.sec.gov.evil.test/', '//evil.test', source.url + '?redirect=evil']) {
    assert.equal(secSourceUrl(cik, { ...source, url }), null);
  }
  assert.equal(secSourceUrl('0000000000', source), null);
  assert.equal(secSourceUrl(cik, { ...source, accession: [source.accession] }), null);
  assert.equal(secSourceUrl(cik, null), null);
  assert.equal(secSourceUrl('../1998597', source), null);
  assert.equal(secSourceUrl(cik, { ...source, accession: '<img src=x onerror=alert(1)>' }), null);
});

test('un état incomplet ne produit pas un faux total exploitable', async () => {
  const { stateSummary } = await import('../public/filing-events.js');
  assert.match(stateSummary(null), /Aucune observation antérieure/);
  assert.match(stateSummary({ composition_status: 'missing_base', positions: 9, portfolio_value_usd: 123 }), /total reconstitué indisponible/);
  assert.doesNotMatch(stateSummary({ composition_status: 'missing_base', portfolio_value_usd: 123 }), /123/);
  assert.match(stateSummary({ composition_status: 'complete', positions: 1, portfolio_value_usd: 123.125 }), /123,125 USD/);
  assert.match(stateSummary({ composition_status: 'complete', positions: 1, portfolio_value_usd: null }), /valeur indisponible/);
});
