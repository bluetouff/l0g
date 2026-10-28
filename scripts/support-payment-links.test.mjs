import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import sharp from 'sharp';
import { getPublicationSocial } from '../src/config/publication-social.mjs';
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
  assert.equal(
    validateStripePaymentLink('https://donate.stripe.com/28E_example', 'oneTime'),
    'https://donate.stripe.com/28E_example'
  );
});

for (const [label, value] of [
  ['HTTP', 'http://buy.stripe.com/28E_example'],
  ['sous-domaine trompeur', 'https://buy.stripe.com.example.test/28E_example'],
  ['sous-domaine de don trompeur', 'https://donate.stripe.com.example.test/28E_example'],
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

test('la page active est visible dans la navigation, la recherche et les colonnes contextuelles', async () => {
  const [
    page,
    englishPage,
    navigation,
    homeSidebar,
    articlePage,
    englishAnalysisPage,
    englishGuidePage,
    englishLayout,
    supportCard,
    supportExperience,
    footer,
    privacy,
    astroConfig,
  ] = await Promise.all([
    readFile(new URL('../src/pages/soutenir.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/pages/en/support/index.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/components/SiteNavigation.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/components/HomeSidebar.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/pages/posts/[...slug].astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/pages/en/analysis/[...slug].astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/pages/en/guides/[...slug].astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/layouts/EnglishGuidesLayout.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/components/SupportCard.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/components/SupportExperience.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/components/SiteFooter.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/pages/rgpd.astro', import.meta.url), 'utf8'),
    readFile(new URL('../astro.config.mjs', import.meta.url), 'utf8'),
  ]);

  assert.doesNotMatch(page, /robots="noindex,follow"/);
  assert.match(page, /data-pagefind-body/);
  assert.match(page, /<SupportExperience lang="fr"/);
  assert.match(supportExperience, /paymentLinksReady && supportPaymentLinks\.oneTime/);
  assert.match(supportExperience, /paymentLinksReady && option\.href/);
  assert.match(supportExperience, /aria-disabled="true"/);
  assert.doesNotMatch(supportExperience, /<iframe|<script[^>]+src=|js\.stripe\.com|stripe\.com\/v3/iu);
  assert.match(page, /\{ hreflang: 'en', href: 'https:\/\/l0g\.fr\/en\/support\/'/);
  assert.doesNotMatch(page, /\bCe qu(?:e|i|['’])/);
  assert.doesNotMatch(englishPage, /robots="noindex,follow"/);
  assert.match(englishPage, /data-pagefind-body/);
  assert.match(englishPage, /<SupportExperience lang="en"/);
  assert.match(englishPage, /inLanguage: 'en'/);
  assert.match(englishPage, /\{ hreflang: 'fr', href: frenchUrl \}/);
  assert.doesNotMatch(englishPage, /<iframe|<script[^>]+src=|js\.stripe\.com|stripe\.com\/v3/iu);
  assert.match(navigation, /\{ href: '\/soutenir\/', label: 'Soutenir'/);
  assert.match(navigation, /href="\/recherche\/"/);
  assert.match(navigation, /aria-keyshortcuts="\/ Meta\+K Control\+K"/);
  assert.match(navigation, /location\.assign\('\/recherche\/\?focus=1'\)/);
  assert.match(homeSidebar, /<SupportCard \/>/);
  assert.ok(
    homeSidebar.indexOf('<SupportCard />') < homeSidebar.indexOf('<WatchCard />'),
    'Le soutien doit précéder Watch dans la colonne latérale',
  );
  assert.doesNotMatch(homeSidebar, /<SearchForm|\/\/ recherche/);
  assert.match(articlePage, /<ArticleNavigator[\s\S]*<ArticleServices \/>/);
  assert.match(englishAnalysisPage, /<ArticleNavigator[\s\S]*<ArticleServices lang="en" \/>/);
  const articleServices = await readFile(new URL('../src/components/ArticleServices.astro', import.meta.url), 'utf8');
  assert.match(articleServices, /en \? '\/en\/support\/' : '\/soutenir\/'/);
  assert.match(articleServices, /en \? 'https:\/\/watch\.l0g\.fr\/en\/' : 'https:\/\/watch\.l0g\.fr\/'/);
  assert.match(englishGuidePage, /<SupportCard lang="en" compact \/>/);
  assert.match(englishGuidePage, /grid-template-columns: minmax\(0, 42rem\) 290px/);
  const englishNavigation = await readFile(new URL('../src/components/EnglishNavigation.astro', import.meta.url), 'utf8');
  assert.match(englishLayout, /<EnglishNavigation path=\{Astro.url.pathname\} compact=\{compactNavigation\}/);
  assert.match(englishNavigation, /href="\/en\/support\/"[^>]*>Support l0g/);
  const englishFooter = await readFile(new URL('../src/components/EnglishFooter.astro', import.meta.url), 'utf8');
  assert.match(englishLayout, /<EnglishFooter\b/);
  assert.match(englishFooter, /\{ href: '\/en\/support\/', label: 'Support l0g'/);
  assert.match(supportCard, /href: '\/soutenir\/'/);
  assert.match(supportCard, /href: '\/en\/support\/'/);
  assert.match(supportCard, /lang\?: 'fr' \| 'en'/);
  assert.doesNotMatch(footer, /\/soutenir\//);
  assert.doesNotMatch(privacy, /\/soutenir\//);
  assert.match(privacy, /https:\/\/watch\.l0g\.fr\/confidentialite/);
  assert.match(privacy, /Cette notice couvre le site éditorial l0g\.fr/);
  assert.doesNotMatch(
    privacy,
    />l0g ne dépose aucun cookie/,
  );
  assert.doesNotMatch(astroConfig, /page !== 'https:\/\/l0g\.fr\/soutenir\/'/);
});

test('les pages de soutien FR et EN déclarent leurs JPEG dédiés en 1200 × 630', async () => {
  for (const [route, pageFile, imagePath] of [
    ['/soutenir/', '../src/pages/soutenir.astro', '/og-soutenir-v1.jpg'],
    ['/en/support/', '../src/pages/en/support/index.astro', '/og-support-v1.jpg'],
  ]) {
    const page = await readFile(new URL(pageFile, import.meta.url), 'utf8');
    assert.ok(page.includes(`ogImage="${imagePath}"`), `${route}: visuel explicite absent`);
    assert.equal(getPublicationSocial(route), undefined, `${route}: une surcharge remplace le visuel déclaré`);
    const bytes = await readFile(new URL(`../public${imagePath}`, import.meta.url));
    const image = sharp(bytes, { failOn: 'warning' });
    const metadata = await image.metadata();
    assert.deepEqual([metadata.format, metadata.width, metadata.height], ['jpeg', 1200, 630], imagePath);
    assert.ok(bytes.length <= 300_000, `${imagePath}: le JPEG dépasse 300 Ko`);
    await image.raw().toBuffer();
  }
});

test('les layouts partagent le visuel explicite entre Open Graph et Twitter', async () => {
  for (const file of ['BaseLayout.astro', 'EnglishGuidesLayout.astro']) {
    const layout = await readFile(new URL(`../src/layouts/${file}`, import.meta.url), 'utf8');
    assert.match(layout, /publicationSocial\?\.image\s*\?\?\s*ogImage\s*\?\?/u, file);
    assert.match(layout, /property="og:image" content=\{ogImageUrl\}/u, file);
    assert.match(layout, /name="twitter:image" content=\{ogImageUrl\}/u, file);
    assert.match(layout, /property="og:image:width" content="1200"/u, file);
    assert.match(layout, /property="og:image:height" content="630"/u, file);
    assert.match(layout, /name="twitter:card" content="summary_large_image"/u, file);
  }
});
