import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import test from 'node:test';
import yaml from 'js-yaml';
import { optimize } from 'svgo';
import { parse as parseDevalue, stringify as stringifyDevalue } from 'devalue';

// Bounded parser checks only: no browser execution or resource-exhaustion load.
const sanitize = (body) => optimize(
  `<svg xmlns="http://www.w3.org/2000/svg">${body}</svg>`,
  { plugins: ['removeScripts'] },
).data;

test('security floors cover vulnerable parsers and network dependencies in both trees', () => {
  const minimums = { 'js-yaml': [4, 3, 2], svgo: [4, 1, 0], hono: [4, 13, 5], 'smol-toml': [1, 7, 1], devalue: [5, 9, 2], 'fast-uri': [3, 1, 7], undici: [8, 10, 2], 'ip-address': [10, 5, 1] };
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
  assert.equal(seen.size, Object.keys(minimums).length);
});

test('devalue rejects out-of-bounds references and preserves ordinary cyclic data', () => {
  // Tiny fixtures exercise GHSA-9rgm-9g3h-6x36 without attempting resource exhaustion.
  for (const input of ['[[1]]', '[{"value":1}]', '[["Set",1]]']) {
    assert.throws(() => parseDevalue(input), /Invalid input/);
  }
  const value = { title: 'Article', date: new Date('2026-09-18T17:02:10Z'), values: [1, 2] };
  value.self = value;
  const restored = parseDevalue(stringifyDevalue(value));
  assert.deepEqual(restored, value);
  assert.equal(restored.self, restored);
});

test('TOML rejects truncated structures promptly and preserves ordinary documents', () => {
  // Run in a separate, time-limited process so a parser regression cannot hang CI.
  const result = spawnSync(process.execPath, ['--input-type=module', '-e', `
    import assert from 'node:assert/strict';
    import { parse, TomlError } from 'smol-toml';
    // smol-toml 1.9 returns tables with a null prototype.
    const expected = Object.assign(Object.create(null), { title: 'Article', values: [1, 2] });
    assert.deepEqual(parse('title = "Article"\\nvalues = [1, 2]\\n'), expected);
    for (const input of ['values = [1 # unfinished', 'value = { item = 1 # unfinished']) {
      assert.throws(() => parse(input), TomlError);
    }
  `], { cwd: new URL('../', import.meta.url), timeout: 3000, encoding: 'utf8', maxBuffer: 64 * 1024 });
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr);
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

// Pure, bounded parsing fixtures; these tests never open a network connection.
const requireMain = createRequire(import.meta.url);
const requireMcp = createRequire(new URL('../mcp-server/package.json', import.meta.url));

test('both URI parsers reject authority injection and malformed host brackets', () => {
  // GHSA-qw65-cvwx-89v3 and GHSA-58mr-gqgx-xq4g.
  for (const requireDependency of [requireMain, requireMcp]) {
    const uri = requireDependency('fast-uri');
    assert.throws(() => uri.serialize({ scheme: 'https', host: 'trusted.example', port: '@127.0.0.1:8124', path: '/app' }));
    for (const input of ['http://[127.0.0.1/', 'http://[example.com/', 'http://example.com]/']) {
      assert.equal(uri.parse(input).error, 'URI host is malformed.', input);
    }
    assert.equal(uri.parse('https://l0g.fr:443/posts/').host, 'l0g.fr');
    assert.equal(uri.parse('http://[::1]:8080/').error, undefined);
    assert.equal(uri.serialize({ scheme: 'https', host: 'l0g.fr', port: '8443', path: '/posts/' }), 'https://l0g.fr:8443/posts/');
  }
});

test('IPv6 classifiers cover the complete link-local and local-use NAT64 ranges', () => {
  // GHSA-rpw4-54j3-4h4q and GHSA-2vr4-cq9g-pvrc.
  const { Address6 } = requireMcp('ip-address');
  for (const address of ['fe80::1', 'fe81::1', 'fe80:0:0:1::1', 'febf:ffff:ffff:ffff:ffff:ffff:ffff:ffff']) {
    assert.equal(new Address6(address).isLinkLocal(), true, address);
  }
  for (const address of ['fe7f::1', 'fec0::1', '2001:4860:4860::8888']) {
    assert.equal(new Address6(address).isLinkLocal(), false, address);
  }
  for (const address of ['64:ff9b:1::', '64:ff9b:1:7f00:0:100::', '64:ff9b:1::7f00:1', '64:ff9b:1:ffff:ffff:ffff:ffff:ffff']) {
    assert.equal(new Address6(address).isPrivate(), true, address);
  }
  assert.equal(new Address6('2001:4860:4860::8888').isPrivate(), false);
});
