import assert from 'node:assert/strict';
import test from 'node:test';
import { microsoftEditions } from '../src/config/microsoft-publication.mjs';
import { assertNoMssqlResponseCollision, isMssqlResponseGuardPage, modSecurityMssqlResponsePattern } from './modsecurity-response-guards.mjs';

const svg = '<svg><text x="360.09999999999997" y="642">15%</text></svg>';
const integrity = '<details><summary>SHA-256</summary><code>3b88f29bf861ee54fb95a118a2252dcd85b0962f9adf09fdfa3eba5e2dc0742c</code></details>';
const historicalSummaries = {
  fr: 'Les droits d’usage de Windows Server et SQL Server suivent l’application jusqu’à son hébergeur.',
  en: 'Windows Server and SQL Server usage rights follow the application to its hosting provider.',
};
const page = (summary, suffix) => `<article><p>${summary}</p>\n${suffix}</article>`;

test('scope covers both homepages and every publication HTML page, without extending to articles', () => {
  for (const path of ['dist/index.html','dist/en/index.html','dist/publications/index.html','dist/en/publications/index.html','dist/publications/quitter-microsoft/index.html','dist/en/publications/leaving-microsoft/index.html','dist/publications/nested/book/appendix.html']) {
    assert.equal(isMssqlResponseGuardPage(path), true, path);
    assert.throws(() => assertNoMssqlResponseCollision(path, page(historicalSummaries.fr, svg)), /951220/u);
  }
  for (const path of ['dist/posts/quitter-microsoft-3-licences-choix-cloud/index.html','dist/en/analysis/leaving-microsoft-3-licences-cloud-choice/index.html','dist/api/publications/index.html','dist/publications-old/index.html','dist/en/publications-old/index.html','dist/enough/index.html','dist/publications/book.json']) {
    assert.equal(isMssqlResponseGuardPage(path), false, path);
    assert.doesNotThrow(() => assertNoMssqlResponseCollision(path, page(historicalSummaries.fr, svg)));
  }
});

for (const [lang, book] of Object.entries(microsoftEditions)) {
  const path = `dist${book.path}index.html`;
  test(`${lang}: the original chapter summary collides independently with SVG decimals and integrity SHA`, () => {
    for (const suffix of [svg, integrity]) assert.throws(() => assertNoMssqlResponseCollision(path, page(historicalSummaries[lang], suffix)), /951220/u);
  });
  test(`${lang}: current publication summaries remain compatible with the actual figure and hash structures`, () => {
    const html = page(book.chapters.map(c => c.summary).join('\n'), svg + integrity);
    assert.doesNotThrow(() => assertNoMssqlResponseCollision(path, html));
  });
}

test('response matching preserves case insensitivity, cross-line scope and both branches', () => {
  for (const html of ['SQL Server\n<div>abcdef01</div>','sql server\r\n<span>ABCDEF01</span>','SQL Server\n<p>Unrelated content</p>\nDriver','sQl SeRvEr\nDRIVER']) {
    assert.equal(modSecurityMssqlResponsePattern.test(html), true);
    assert.throws(() => assertNoMssqlResponseCollision('dist/index.html', html), /951220/u);
    assert.throws(() => assertNoMssqlResponseCollision('dist/index.html', html), /951220/u);
  }
});

test('benign text, reversed order and shorter values do not become broad SQL keyword bans', () => {
  for (const html of ['SQL Server','<p>SQL Server licensing rights</p>','SQL Server 1234567','SQL Server xyzxyzxy',integrity+'<p>SQL Server</p>',svg+'<p>SQL Server</p>','Driver\n<p>SQL Server</p>','Windows Server'+svg,'SQL\u00a0Server'+svg]) {
    assert.doesNotThrow(() => assertNoMssqlResponseCollision('dist/publications/example/index.html', html), html);
  }
});
