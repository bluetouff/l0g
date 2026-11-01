import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { articleEvidenceDocumentLabels, articleEvidenceLinkLabel } from '../src/lib/article-evidence-presentation.ts';

const filing = 'https://www.sec.gov/Archives/edgar/data/1769628/000176962826000366/crwv-20260630.htm';

test('authored HTML source titles replace host fallbacks without changing evidence metadata', () => {
  const labels = articleEvidenceDocumentLabels(`<a href="${filing}"><strong>CoreWeave</strong>, rapport trimestriel &amp; annexes</a>`);
  const link = { href: filing, host: 'sec.gov', label: 'sec.gov', sourcePublicationDateIso: '2026-08-12', dateLabel: '12 août 2026' };
  const before = structuredClone(link);
  assert.equal(articleEvidenceLinkLabel(link, labels), 'CoreWeave, rapport trimestriel & annexes');
  assert.deepEqual(link, before);
  assert.equal(articleEvidenceLinkLabel({ ...link, label: 'Rapport trimestriel déjà décrit' }, labels), 'Rapport trimestriel déjà décrit');
  assert.equal(articleEvidenceLinkLabel(link, new Map()), 'sec.gov');
});

test('comments, scripts, hidden templates and code examples do not provide document titles', () => {
  const hidden = `<a href="${filing}">Exemple non publié</a>`;
  for (const body of [
    `<!-- ${hidden} -->`,
    `<script>const example = '${hidden}';</script>`,
    `<template>${hidden}</template>`,
    `<pre><code>${hidden}</code></pre>`,
    `\`\`\`html\n${hidden}\n\`\`\``,
    `~~~html\n${hidden}\n~~~`,
    `\`${hidden}\``,
  ]) assert.equal(articleEvidenceDocumentLabels(body).size, 0, body);
});

test('duplicate anchors keep a descriptive title and unsupported URL schemes cannot contribute labels', () => {
  const labels = articleEvidenceDocumentLabels(`<a href="${filing}">S01</a><a href="${filing}">CoreWeave, rapport trimestriel</a><a href="javascript:alert(1)">Script</a><a href="https://name:password@www.sec.gov/report">Credential URL</a>`);
  assert.equal(labels.size, 1);
  assert.equal(articleEvidenceLinkLabel({ href: filing, host: 'sec.gov', label: 'S01' }, labels), 'CoreWeave, rapport trimestriel');
});

test('the compute-price bibliography exposes three distinct authored SEC document titles', () => {
  const body = readFileSync(new URL('../src/content/posts/prix-calcul-ia-gpu-dette.mdx', import.meta.url), 'utf8');
  const labels = articleEvidenceDocumentLabels(body);
  assert.equal(labels.get(filing), 'CoreWeave, rapport trimestriel au 30 juin 2026');
  assert.equal(labels.get('https://www.sec.gov/Archives/edgar/data/1769628/000176962826000104/crwv-20251231.htm'), 'CoreWeave, rapport annuel 2025');
  assert.equal(labels.get('https://www.sec.gov/Archives/edgar/data/1769628/000176962826000357/crwv-20260807.htm'), 'CoreWeave, facilité DDTL 5.5');
});

test('source labels remain plain text rendered through escaped Astro expressions', () => {
  const labels = articleEvidenceDocumentLabels(`<a href="${filing}">&lt;img src=x onerror=alert(1)&gt;</a>`);
  assert.equal(labels.get(filing), '<img src=x onerror=alert(1)>');
  const component = readFileSync(new URL('../src/components/ArticleEvidence.astro', import.meta.url), 'utf8');
  assert.doesNotMatch(component, /set:html/);
  assert.match(component, /\{linkLabel\(link\)\}/);
});
