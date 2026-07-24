import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  SUPPORT_PAYMENT_LINK_KEYS,
  supportPaymentLinks,
  validateStripePaymentLink,
} from '../src/config/support-payment-links.mjs';

test('la configuration expose les quatre parcours attendus', () => {
  assert.deepEqual(SUPPORT_PAYMENT_LINK_KEYS, [
    'oneTime',
    'monthly5',
    'monthly10',
    'monthly25',
  ]);
  assert.deepEqual(Object.keys(supportPaymentLinks), SUPPORT_PAYMENT_LINK_KEYS);
});

test('une valeur absente désactive le parcours sans produire de lien', () => {
  assert.equal(validateStripePaymentLink(null, 'oneTime'), null);
  assert.equal(validateStripePaymentLink('', 'oneTime'), null);
});

test('un Payment Link Stripe de production exact est accepté', () => {
  assert.equal(
    validateStripePaymentLink('https://buy.stripe.com/28E_example', 'oneTime'),
    'https://buy.stripe.com/28E_example'
  );
});

for (const [label, value] of [
  ['HTTP', 'http://buy.stripe.com/28E_example'],
  ['sous-domaine trompeur', 'https://buy.stripe.com.example.test/28E_example'],
  ['identifiants intégrés', 'https://user:secret@buy.stripe.com/28E_example'],
  ['paramètres', 'https://buy.stripe.com/28E_example?prefilled_email=test@example.test'],
  ['fragment', 'https://buy.stripe.com/28E_example#support'],
  ['racine', 'https://buy.stripe.com/'],
  ['mode test', 'https://buy.stripe.com/test_28E_example'],
]) {
  test(`un lien ${label} est refusé`, () => {
    assert.throws(() => validateStripePaymentLink(value, 'oneTime'));
  });
}

test('la prépublication reste hors navigation, recherche et sitemap', async () => {
  const [
    page,
    navigation,
    footer,
    privacy,
    astroConfig,
  ] = await Promise.all([
    readFile(new URL('../src/pages/soutenir.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/components/SiteNavigation.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/components/SiteFooter.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/pages/rgpd.astro', import.meta.url), 'utf8'),
    readFile(new URL('../astro.config.mjs', import.meta.url), 'utf8'),
  ]);

  assert.match(page, /robots="noindex,follow"/);
  assert.match(page, /data-pagefind-ignore/);
  assert.doesNotMatch(page, /data-pagefind-body/);
  assert.doesNotMatch(page, /\bCe qu(?:e|i|['’])/);
  assert.doesNotMatch(navigation, /\/soutenir\//);
  assert.doesNotMatch(footer, /\/soutenir\//);
  assert.doesNotMatch(privacy, /\/soutenir\//);
  assert.match(astroConfig, /page !== 'https:\/\/l0g\.fr\/soutenir\/'/);
});
