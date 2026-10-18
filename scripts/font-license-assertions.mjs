import assert from 'node:assert/strict';

const references = new Map([
  ['inter', [
    ['Copyright 2016 The Inter Project Authors', 'Copyright 2016 The Inter Project Authors (https://github.com/rsms/inter) Inter-Italic[opsz,wght].ttf: Copyright 2016 The Inter Project Authors (https://github.com/rsms/inter)'],
    ['http', 'http://scripts.sil.org/OFL'],
  ]],
  ['jetbrains-mono', [
    ['Copyright 2020 The JetBrains Mono Project Authors', 'Copyright 2020 The JetBrains Mono Project Authors (https://github.com/JetBrains/JetBrainsMono) JetBrainsMono-Italic[wght].ttf: Copyright 2020 The JetBrains Mono Project Authors (https://github.com/JetBrains/JetBrainsMono)'],
    ['http', 'http://scripts.sil.org/OFL'],
  ]],
  ['dejavu', [
    ['Official licence:', 'Official licence: https://dejavu-fonts.github.io/License.html'],
  ]],
  ['liberation', [
    ['Source:', 'Source: LibreOffice bundled fonts; upstream https://github.com/liberationfonts/liberation-fonts'],
    ['Licence source:', 'Licence source: https://github.com/liberationfonts/liberation-fonts/blob/main/LICENSE'],
  ]],
]);

export function assertFontLicenseReferences(licence, family) {
  assert.equal(typeof licence, 'string');
  assert.ok(references.has(family), 'Known font licence family');
  assert.doesNotMatch(licence, /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/u, 'No control characters in licence');
  const lines = licence.split(/\r?\n/u);
  for (const [label, expected] of references.get(family)) {
    // Match the whole labelled reference, never a trusted URL embedded in another URL.
    const matches = lines.filter(line => line.trimStart().toLowerCase().startsWith(label.toLowerCase()));
    assert.equal(matches.length, 1, `Exactly one ${label} reference`);
    assert.equal(matches[0], expected, `Canonical ${label} reference`);
  }
}
