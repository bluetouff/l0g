import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';

const dejavu = 'Official licence: https://dejavu-fonts.github.io/License.html';
const liberation = [
  'Source: LibreOffice bundled fonts; upstream https://github.com/liberationfonts/liberation-fonts',
  'Licence source: https://github.com/liberationfonts/liberation-fonts/blob/main/LICENSE',
].join('\n');

test('Font licence references accept the complete local licences with LF or CRLF', () => {
  for (const directory of ['bank-snapshot', 'el-nino', 'us-mortgage-risk', 'bermuda-pensions', 'france-debt-calendar', 'ukraine-reparations']) {
    const licence = readFileSync(new URL(`../public/fonts/${directory}/LICENSE.txt`, import.meta.url), 'utf8');
    const family = directory === 'ukraine-reparations' ? 'liberation' : 'dejavu';
    assertFontLicenseReferences(licence, family);
    assertFontLicenseReferences(licence.replaceAll('\r\n', '\n').replaceAll('\n', '\r\n'), family);
  }
});

test('Font licence references reject forged URL authorities and embedded canonical URLs', () => {
  for (const [family, licence, urls] of [
    ['dejavu', dejavu, ['https://dejavu-fonts.github.io/License.html']],
    ['liberation', liberation, ['https://github.com/liberationfonts/liberation-fonts', 'https://github.com/liberationfonts/liberation-fonts/blob/main/LICENSE']],
  ]) {
    for (const url of urls) {
      const parsed = new URL(url);
      const replacements = [
        `https://evil.example/?next=${url}`,
        `https://evil.example/${url}`,
        `https://evil.example/#${url}`,
        `https://${parsed.hostname}.evil.example${parsed.pathname}`,
        `https://${parsed.hostname}@evil.example${parsed.pathname}`,
        `https://evil.example@${parsed.hostname}${parsed.pathname}`,
        `http://${parsed.hostname}${parsed.pathname}`,
        `${url}?redirect=https://evil.example/`,
        `${url}#ignored`, `${url}/suffix`, `${url} trailing`, `${url}\u0000`,
      ];
      for (const replacement of replacements) {
        // Replace only the selected field, including the longer Liberation licence path.
        const lines = licence.split('\n');
        const index = lines.findIndex(line => line.endsWith(url));
        lines[index] = lines[index].slice(0, -url.length) + replacement;
        assert.throws(() => assertFontLicenseReferences(lines.join('\n'), family), { name: 'AssertionError' });
      }
    }
  }
});

test('Font licence references require every canonical field exactly once', () => {
  for (const [family, licence] of [['dejavu', dejavu], ['liberation', liberation]]) {
    for (const line of licence.split('\n')) {
      for (const mutation of [
        licence.replace(line, ''),
        `${licence}\n${line}`,
        `${licence}\n  ${line}`,
        `${licence}\n${line.toUpperCase()}`,
        licence.replace(line, `prefix ${line}`),
        licence.replace(line, ` ${line}`),
        licence.replace(line, `${line}\r `),
      ]) assert.throws(() => assertFontLicenseReferences(mutation, family), { name: 'AssertionError' });
    }
  }
  for (const family of ['unknown', '__proto__', 'constructor']) assert.throws(() => assertFontLicenseReferences(dejavu, family));
  for (const licence of [null, {}, 12]) assert.throws(() => assertFontLicenseReferences(licence, 'dejavu'));
});

const jlrFontLicences = [
  ['inter', 'https://github.com/rsms/inter'],
  ['jetbrains-mono', 'https://github.com/JetBrains/JetBrainsMono'],
].map(([family, source]) => ({ family, source, licence: readFileSync(new URL(`../public/fonts/jlr/LICENSE-${family}.txt`, import.meta.url), 'utf8') }));

test('JLR font licences retain complete dependency licences and canonical fields with LF or CRLF', () => {
  for (const { family, licence } of jlrFontLicences) {
    const canonical = readFileSync(new URL(`../node_modules/@fontsource-variable/${family}/LICENSE`, import.meta.url), 'utf8');
    assert.equal(licence, canonical);
    assertFontLicenseReferences(licence, family);
    assertFontLicenseReferences(licence.replaceAll('\r\n', '\n').replaceAll('\n', '\r\n'), family);
  }
});

test('JLR font references reject authority spoofing, URL hiding and protocol or suffix substitutions', () => {
  for (const { family, source, licence } of jlrFontLicences) {
    for (const url of [source, 'http://scripts.sil.org/OFL']) {
      const parsed = new URL(url);
      const mutations = [
        `https://evil.example/?next=${url}`, `https://evil.example/${url}`, `https://evil.example/#${url}`,
        `${parsed.protocol}//${parsed.hostname}.evil.example${parsed.pathname}`,
        `${parsed.protocol}//${parsed.hostname}@evil.example${parsed.pathname}`,
        `${parsed.protocol}//evil.example@${parsed.hostname}${parsed.pathname}`,
        `${parsed.protocol === 'http:' ? 'https:' : 'http:'}//${parsed.hostname}${parsed.pathname}`,
        `${url}?redirect=https://evil.example/`, `${url}#ignored`, `${url}/suffix`, `${url} trailing`, `${url}\u0000`,
      ];
      for (const mutation of mutations) assert.throws(() => assertFontLicenseReferences(licence.replaceAll(url, mutation), family), { name: 'AssertionError' });
    }
  }
});

test('JLR font licences require complete copyright and OFL references exactly once', () => {
  for (const { family, licence } of jlrFontLicences) {
    const lines = licence.split('\n');
    for (const line of [lines[0], 'http://scripts.sil.org/OFL']) {
      for (const mutation of [
        licence.replace(line, ''), `${licence}\n${line}`, `${licence}\n  ${line}`,
        `${licence}\n${line.toUpperCase()}`, licence.replace(line, `prefix ${line}`),
        licence.replace(line, ` ${line}`), licence.replace(line, `${line}\r `),
      ]) assert.throws(() => assertFontLicenseReferences(mutation, family), { name: 'AssertionError' });
    }
    for (const control of ['\u0000', '\u0008', '\u000b', '\u000c', '\u000e', '\u001f', '\u007f']) {
      assert.throws(() => assertFontLicenseReferences(`${licence}${control}`, family), { name: 'AssertionError' });
    }
  }
});
