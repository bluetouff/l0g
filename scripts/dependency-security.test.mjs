import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import yaml from 'js-yaml';
import { optimize } from 'svgo';

// Bounded parser checks only: no browser execution or resource-exhaustion load.
const sanitize = (body) => optimize(
  `<svg xmlns="http://www.w3.org/2000/svg">${body}</svg>`,
  { plugins: ['removeScripts'] },
).data;

test('security floors cover every YAML and SVGO copy in both dependency trees', () => {
  const minimums = { 'js-yaml': [4, 3, 2], svgo: [4, 1, 0] };
  const seen = new Set();
  for (const path of ['../package-lock.json', '../mcp-server/package-lock.json']) {
    const lock = JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
    for (const [packagePath, metadata] of Object.entries(lock.packages)) {
      for (const [name, minimum] of Object.entries(minimums)) {
        if (packagePath !== `node_modules/${name}` && !packagePath.endsWith(`/node_modules/${name}`)) continue;
        seen.add(name);
        assert.match(metadata.version, /^\d+\.\d+\.\d+$/);
        const actual = metadata.version.split('.').map(Number);
        const firstDifference = actual.findIndex((part, index) => part !== minimum[index]);
        assert(firstDifference === -1 || actual[firstDifference] > minimum[firstDifference], `${path}: ${packagePath} ${metadata.version} below security floor`);
      }
    }
  }
  assert.equal(seen.size, 2);
});

test('YAML counts empty merge sources toward its configured budget', () => {
  const emptySources = Array(10).fill('{}').join(', ');
  for (const merge of ['<<: *base', '<<: [*base, *base]']) {
    const source = merge.includes('[*base')
      ? `base: &base {}\nout:\n  ${merge}\n`
      : `base: &base [${emptySources}]\nout:\n  ${merge}\n`;
    assert.throws(() => yaml.load(source, { maxTotalMergeKeys: 1 }), /maxTotalMergeKeys/);
  }
});

test('ordinary YAML frontmatter and small legitimate merges still work', () => {
  const source = 'title: OpenAI\npubDate: "2026-09-09T10:16:02+02:00"\ntags: [credit, AI]\n';
  assert.deepEqual(yaml.load(source), { title: 'OpenAI', pubDate: '2026-09-09T10:16:02+02:00', tags: ['credit', 'AI'] });
  assert.deepEqual(yaml.load('base: &base {unit: USD}\npoint: {<<: *base, value: 4.2}\n', { maxTotalMergeKeys: 8 }).point, { unit: 'USD', value: 4.2 });
});

test('SVGO removes active HTML attributes while preserving foreignObject text', () => {
  const result = sanitize('<foreignObject><div xmlns="http://www.w3.org/1999/xhtml" onbeforetoggle="void(0)"><iframe srcdoc="test"/><form action="javascript:void(0)"><span>Readable label</span></form></div></foreignObject>');
  assert.doesNotMatch(result, /onbeforetoggle|srcdoc|javascript:/i);
  assert.match(result, /Readable label/);
});

test('SVGO handles prefixed links and encoded URL whitespace', () => {
  for (const [tag, attributes] of [
    ['s:a', 'xmlns:s="http://www.w3.org/2000/svg" href="javascript:void(0)"'],
    ['a', 'href="java&#9;script:void(0)"'],
    ['a', 'href="java&#10;script:void(0)"'],
    ['a', 'xmlns:l="http://www.w3.org/1999/xlink" l:href="java&#13;script:void(0)"'],
  ]) {
    const result = sanitize(`<${tag} ${attributes}><text>Readable label</text></${tag}>`);
    assert.doesNotMatch(result, /(?:^|\s)(?:[\w-]+:)?href=/);
    assert.match(result, /Readable label/);
  }
});

test('SVGO preserves passive chart geometry, colors and ordinary links', () => {
  const result = sanitize('<rect x="0" y="0" width="420" height="540" fill="#0b0d10"/><a href="https://l0g.fr/"><text x="24" y="32" fill="#5eead4">S&amp;P: 4.2</text></a>');
  assert.match(result, /width="420" height="540" fill="#0b0d10"/);
  assert.match(result, /href="https:\/\/l0g\.fr\/"/);
  assert.match(result, /S&amp;P: 4\.2/);
});

test('SVGO rejects invalid XML character references in text and attributes', () => {
  for (const reference of ['&#1;', '&#xD800;']) {
    assert.throws(() => sanitize(`<text>${reference}</text>`));
    assert.throws(() => sanitize(`<text aria-label="${reference}">label</text>`));
  }
});
