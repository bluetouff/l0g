import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import sharp from 'sharp';
import { validateEnglishSocialHtml } from './audit-english-social.mjs';
import { getEnglishPageSocial } from '../src/config/english-page-social.mjs';

const origin = 'https://l0g.fr';
const card = '/illustrations/manual.jpg';
const metadata = (image = `${origin}${card}`, twitter = image, alt = 'An English research illustration') => `<!doctype html><html lang="en"><head>
  <meta property="og:image" content="${image}">
  <meta name="twitter:image" content="${twitter}">
  <meta property="og:image:alt" content="${alt}">
  <meta name="twitter:image:alt" content="${alt}">
  </head><body></body></html>`;

async function fixture(t) {
  const directory = await mkdtemp(join(tmpdir(), 'l0g-social-audit-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const distDir = join(directory, 'dist');
  await mkdir(join(distDir, 'illustrations'), { recursive: true });
  await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#0c0d10' } }).jpeg().toFile(join(distDir, card));
  return { directory, distDir };
}

test('manual artwork is preserved and repeated image metadata is cached', async t => {
  const { distDir } = await fixture(t);
  const metadataCache = new Map();
  for (const route of ['/en/analysis/research/', '/en/publications/book/']) {
    const result = await validateEnglishSocialHtml(metadata(), route, { distDir, metadataCache });
    assert.deepEqual(result.errors, []);
    assert.equal(result.imagePath, card);
  }
  assert.equal(metadataCache.size, 1);
  const asia = await validateEnglishSocialHtml(metadata(), '/en/asia/', { distDir });
  assert.ok(asia.errors.some(error => error.includes('dedicated English')));
  assert.notEqual(getEnglishPageSocial('/en/asia/').image, card);
});

test('French fallbacks, divergent Twitter images and missing English alternative text fail', async t => {
  const { distDir } = await fixture(t);
  const french = await validateEnglishSocialHtml(metadata(`${origin}/og-default.png`), '/en/', { distDir });
  assert.ok(french.errors.some(error => error.includes('French generic')));
  const divergent = await validateEnglishSocialHtml(metadata(undefined, `${origin}/other.jpg`), '/en/', { distDir });
  assert.ok(divergent.errors.some(error => error.includes('must match')));
  for (const alt of ['', 'Une carte sociale l0g', 'édition française']) {
    const result = await validateEnglishSocialHtml(metadata(undefined, undefined, alt), '/en/', { distDir });
    assert.ok(result.errors.some(error => error.includes('English alternative text')));
  }
});

test('only a complete, noindex, canonical same-origin redirect may omit sharing metadata', async () => {
  const redirect = `<!doctype html><title>Redirecting</title><meta http-equiv="refresh" content="0;url=/en/analysis/new/">
    <meta name="robots" content="noindex"><link rel="canonical" href="${origin}/en/analysis/new/">`;
  const result = await validateEnglishSocialHtml(redirect, '/en/analysis/old/');
  assert.equal(result.redirect, true);
  assert.deepEqual(result.errors, []);
  for (const invalid of [redirect.replace('noindex', 'index'), redirect.replace('/en/analysis/new/">', '/analysis/new/">'), '<html lang="en"><body>No metadata</body></html>']) {
    const result = await validateEnglishSocialHtml(invalid, '/en/analysis/old/');
    assert.equal(result.redirect, false);
    assert.ok(result.errors.some(error => error.includes('og:image is required')));
  }
});

test('untrusted image URLs cannot escape the built site; missing and incorrectly sized images fail', async t => {
  const { directory, distDir } = await fixture(t);
  const metadataCache = new Map();
  for (const image of [
    'https://example.com/card.jpg', `${origin}/../private.jpg`, `${origin}/%2e%2e/private.jpg`,
    `${origin}/%252e%252e%2fprivate.jpg`, `${origin}/%00private.jpg`, `${origin}/%5cprivate.jpg`,
    'file:///tmp/private.jpg', 'https://reader:password@l0g.fr/card.jpg', `${origin}${card}?cache=1`,
  ]) {
    const result = await validateEnglishSocialHtml(metadata(image), '/en/', { distDir, metadataCache });
    assert.ok(result.errors.some(error => error.includes('canonical HTTPS URL')), image);
  }
  assert.equal(metadataCache.size, 0, 'rejected URLs must not trigger local image reads');
  await symlink(join(directory, 'outside.jpg'), join(distDir, 'escape.jpg'));
  await sharp({ create: { width: 400, height: 600, channels: 3, background: '#fff' } }).jpeg().toFile(join(directory, 'outside.jpg'));
  const escaped = await validateEnglishSocialHtml(metadata(`${origin}/escape.jpg`), '/en/', { distDir });
  assert.ok(escaped.errors.some(error => error.includes('inside the built site')));
  const missing = await validateEnglishSocialHtml(metadata(`${origin}/absent.jpg`), '/en/', { distDir });
  assert.ok(missing.errors.some(error => error.includes('must exist')));
  await sharp({ create: { width: 400, height: 600, channels: 3, background: '#fff' } }).jpeg().toFile(join(distDir, 'portrait.jpg'));
  const portrait = await validateEnglishSocialHtml(metadata(`${origin}/portrait.jpg`), '/en/', { distDir });
  assert.ok(portrait.errors.some(error => error.includes('1200 × 630')));
});
