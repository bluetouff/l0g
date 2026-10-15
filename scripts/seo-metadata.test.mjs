import assert from 'node:assert/strict';
import test from 'node:test';
import { buildRobotsMetadata, buildSeoMetadata } from '../src/lib/seo.ts';

test('metadata keeps the complete mechanism beyond former character cutoffs', () => {
  const title = 'Reading dealer gamma: when options hedging drives the market';
  const description = 'Compare the consequences of long and short gamma, then examine the assumptions behind positioning estimates, expiry dates and intraday options hedging. Keep the limits of the model visible.';
  const metadata = buildSeoMetadata(title, description);
  assert.equal(metadata.fullTitle, `${title} · l0g.fr`);
  assert.equal(metadata.description, description);
});

test('metadata removes markup and normalises spaces without duplicating the brand', () => {
  const metadata = buildSeoMetadata('A <em>complete</em> title', 'A&nbsp; description\nwith <strong>context</strong>.', { seoTitle: 'Specific subject | l0g' });
  assert.equal(metadata.fullTitle, 'Specific subject | l0g');
  assert.equal(metadata.description, 'A description with context.');
  assert.equal(buildSeoMetadata('', '').fullTitle, 'l0g.fr · Cartographier le risque économique');
});

test('large image previews do not change noindex decisions', () => {
  assert.equal(buildRobotsMetadata('index,follow'), 'index,follow,max-image-preview:large');
  assert.equal(buildRobotsMetadata('noindex,follow'), 'noindex,follow');
});
