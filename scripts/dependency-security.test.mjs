import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import test from 'node:test';
import * as yaml from 'js-yaml';
import { optimize } from 'svgo';
import { parse as parseDevalue, stringify as stringifyDevalue } from 'devalue';

// Bounded parser checks only: no browser execution or resource-exhaustion load.
const sanitize = (body) => optimize(
  `<svg xmlns="http://www.w3.org/2000/svg">${body}</svg>`,
  { plugins: ['removeScripts'] },
).data;

test('security floors cover vulnerable parsers and network dependencies in both trees', () => {
  const minimums = { 'js-yaml': [4, 3, 2], svgo: [4, 1, 0], hono: [4, 13, 5], 'smol-toml': [1, 7, 1], devalue: [5, 9, 3], 'fast-uri': [3, 1, 9], undici: [8, 10, 2], 'ip-address': [10, 7, 4], 'http-cache-semantics': [4, 3, 0], 'source-map-js': [1, 2, 2], 'proxy-addr': [2, 0, 8], sharp: [0, 35, 5], '@modelcontextprotocol/sdk': [1, 31, 0] };
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

test('devalue rejects coerced null-prototype keys while preserving valid string keys', () => {
  // Bounded cases for GHSA-4q55-j62x-fr9h, following the upstream parser fix.
  for (const key of [['__proto__'], [], {}, 0, true, null]) {
    const input = JSON.stringify([['null', key, 1], { value: 2 }, true]);
    assert.throws(() => parseDevalue(input), /non-string key/);
  }
  const value = Object.assign(Object.create(null), { '': 'empty', 0: 'numeric', constructor: 'ordinary' });
  const restored = parseDevalue(stringifyDevalue(value));
  assert.equal(Object.getPrototypeOf(restored), null);
  assert.deepEqual(restored, value);
});

test('devalue serializes only the visible bytes of a Node Buffer', () => {
  // GHSA-j22f-vq7h-c4qm: surrounding bytes are a local fixture, never process memory.
  const storage = new Uint8Array(16).fill(42);
  storage.set([1, 2], 7);
  const view = Buffer.from(storage.buffer, 7, 2);
  const restored = parseDevalue(stringifyDevalue({ view, alias: view }));
  assert.deepEqual([...restored.view], [1, 2]);
  assert.equal(restored.view.buffer.byteLength, 2);
  assert.equal(restored.view.byteOffset, 0);
  assert.equal(restored.alias, restored.view);
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
  const schema = yaml.CORE_SCHEMA.withTags(yaml.mergeTag);
  const emptySources = Array(10).fill('{}').join(', ');
  for (const merge of ['<<: *base', '<<: [*base, *base]']) {
    const source = merge.includes('[*base')
      ? `base: &base {}\nout:\n  ${merge}\n`
      : `base: &base [${emptySources}]\nout:\n  ${merge}\n`;
    assert.throws(() => yaml.load(source, { schema, maxTotalMergeKeys: 1 }), /maxTotalMergeKeys/);
  }
});

test('ordinary YAML frontmatter and small legitimate merges still work', () => {
  const source = 'title: OpenAI\npubDate: "2026-09-09T10:16:02+02:00"\ntags: [credit, AI]\n';
  assert.deepEqual(yaml.load(source), { title: 'OpenAI', pubDate: '2026-09-09T10:16:02+02:00', tags: ['credit', 'AI'] });
  const input = 'base: &base {unit: USD}\npoint: {<<: *base, value: 4.2}\n';
  assert.deepEqual(yaml.load(input).point, { '<<': { unit: 'USD' }, value: 4.2 });
  assert.deepEqual(yaml.load(input, { schema: yaml.CORE_SCHEMA.withTags(yaml.mergeTag), maxTotalMergeKeys: 8 }).point, { unit: 'USD', value: 4.2 });
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

test('IPv6 zones reject repeated delimiters and line terminators within a bounded process', () => {
  // GHSA-rxp7-6hxx-x8q5: isolate the parser so a regression cannot stall the runner.
  const result = spawnSync(process.execPath, ['--input-type=commonjs', '-e', `
    const assert = require('node:assert/strict');
    const { Address4, Address6 } = require('ip-address');
    const valid = new Address6('fe80::1%eth0');
    assert.equal(valid.zone, '%eth0');
    assert.equal(valid.correctForm(), 'fe80::1');
    assert.equal(Address6.isValid('2001:db8::1'), true);
    assert.equal(Address4.isValid('192.0.2.1'), true);
    for (const ending of ['\\n', '\\r', '\\u2028', '\\u2029']) {
      const malformed = '%'.repeat(64 * 1024) + ending;
      assert.equal(Address6.isValid(malformed), false);
      assert.throws(() => new Address6(malformed));
    }
  `], { cwd: new URL('../mcp-server/', import.meta.url), timeout: 3000, encoding: 'utf8', maxBuffer: 64 * 1024 });
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr);
});

test('indexed source maps reject invalid offsets and preserve ordinary mappings', () => {
  // GHSA-68fv-2mgg-jv7q: construction only, never iterate a huge generated line.
  const { SourceMapConsumer, SourceNode } = requireMain('source-map-js');
  const section = (line, column = 0) => ({
    version: 3,
    sections: [{ offset: { line, column }, map: { version: 3, sources: ['fixture.js'], sourcesContent: ['value'], names: [], mappings: 'AAAA' } }],
  });
  for (const line of [-1, 0.5, Number.MAX_SAFE_INTEGER]) {
    assert.throws(() => new SourceMapConsumer(section(line)), /Section offset/);
  }
  assert.throws(() => new SourceMapConsumer(section(0, 0.5)), /Section offset/);
  const nested = section(6_000_000);
  nested.sections[0].map = section(6_000_000);
  assert.throws(() => new SourceMapConsumer(nested), /including offsets of nested sections/);
  const consumer = new SourceMapConsumer(section(1));
  const mappings = [];
  consumer.eachMapping((mapping) => mappings.push(mapping));
  assert.equal(mappings[0].source, 'fixture.js');
  assert.equal(mappings[0].generatedLine, 2);
  assert.equal(SourceNode.fromStringWithSourceMap('header\nvalue', consumer).toString(), 'header\nvalue');
});

test('proxy trust preserves address families and legitimate forwarded clients', () => {
  // GHSA-jqcg-44mw-7w3h: pure fixtures exercise both single and multi-subnet paths.
  const proxyaddr = requireMcp('proxy-addr');
  const request = (address) => ({ socket: { remoteAddress: address }, headers: { 'x-forwarded-for': '198.51.100.7' } });
  for (const subnets of [['::ffff:10.0.0.0/8'], ['::/1'], ['::ffff:10.0.0.0/8', '192.0.2.0/24']]) {
    const trust = proxyaddr.compile(subnets);
    for (const address of ['203.0.113.9', '::ffff:203.0.113.9']) {
      assert.equal(trust(address), false);
      assert.equal(proxyaddr(request(address), trust), address);
    }
  }
  for (const subnet of ['10.0.0.0/8', '::ffff:10.0.0.0/104']) {
    const trust = proxyaddr.compile(subnet);
    for (const address of ['10.0.0.1', '::ffff:10.0.0.1']) {
      assert.equal(trust(address), true);
      assert.equal(proxyaddr(request(address), trust), '198.51.100.7');
    }
    assert.equal(trust('203.0.113.9'), false);
  }
  const ipv6Trust = proxyaddr.compile(['2001:db8::/32', '10.0.0.0/8']);
  assert.equal(proxyaddr(request('2001:db8::1'), ipv6Trust), '198.51.100.7');
  assert.equal(ipv6Trust('2001:db9::1'), false);
});

test('Sharp loads a patched SVG renderer for the current platform', () => {
  // GHSA-wq5f-xc86-pv6w: check the loaded library, including system libvips builds.
  const version = requireMain('sharp').versions.rsvg;
  assert.match(version, /^\d+\.\d+\.\d+$/);
  const actual = version.split('.').map(Number);
  const minimum = [2, 63, 2];
  const difference = actual.findIndex((part, index) => part !== minimum[index]);
  assert(difference === -1 || actual[difference] > minimum[difference], `librsvg ${version} below security floor`);
});

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

for (const [tree, requireDependency] of [['site', requireMain], ['MCP', requireMcp]]) {
  test(`${tree}: URI schemes cannot be synthesized from percent-encoded input`, () => {
    // GHSA-w74x-v6f9-j3xg, including legacy Unicode escapes and scheme equality.
    const uri = requireDependency('fast-uri');
    for (const input of ['%6Aavascript:alert(1)', '%u006Aavascript:alert(1)', '%64ata:text/plain,test', 'vb%73cript:msgbox(1)']) {
      assert.equal(uri.parse(input).error, 'URI scheme is malformed.');
      assert.equal(uri.normalize(input), input);
      assert.throws(() => uri.resolve('https://example.com/app/', input), /URI scheme is malformed/);
    }
    assert.throws(() => uri.serialize({ scheme: '%6Aavascript', path: 'alert(1)' }), /URI scheme is malformed/);
    assert.equal(uri.equal('%68ttp://example.com/', 'http://example.com/'), false);
    assert.equal(uri.normalize('HTTPS://EXAMPLE.COM:443/app/'), 'https://example.com/app/');
  });

  test(`${tree}: URI normalization preserves relative reference targets`, () => {
    // GHSA-xhq7-xmqj-769h: parent paths, authority-like paths and exposed colons.
    const uri = requireDependency('fast-uri');
    for (const [input, expected] of [['../x', '../x'], ['a/../b', 'b'], ['../../x', '../../x'], ['a/..//x', './/x'], ['a/../javascript:alert(1)', './javascript:alert(1)']]) {
      assert.equal(uri.normalize(input), expected);
      assert.equal(uri.serialize({ path: input }), expected);
      assert.equal(uri.parse(expected).scheme, undefined);
      assert.equal(uri.parse(expected).host, undefined);
      for (const base of ['https://example.com/docs/current/', 'relative/base']) {
        assert.equal(uri.resolve(base, expected), uri.resolve(base, input));
      }
    }
    assert.equal(uri.equal('../x', 'x'), false);
    assert.equal(uri.equal('a/../b', '/b'), false);
    assert.equal(uri.equal('a/../b', 'b'), true);
    assert.equal(uri.normalize('https://example.com/a/../b'), 'https://example.com/b');
  });

  test(`${tree}: URI parsing rejects ambiguous domain hosts`, () => {
    // GHSA-wjr9-j795-jxcr: neither extra userinfo nor control characters may disappear.
    const uri = requireDependency('fast-uri');
    for (const scheme of ['http', 'https', 'ws', 'wss']) {
      for (const host of ['a@b@evil.example', 'ex\tample.com', 'ex\rample.com', 'ex\nample.com']) {
        const input = `${scheme}://${host}/`;
        assert.equal(uri.parse(input).error, 'URI host is malformed.');
        assert.equal(uri.normalize(input), input);
        assert.equal(uri.equal(input, `${scheme}://example.com/`), false);
        assert.throws(() => uri.resolve(input, 'child'), /URI host is malformed/);
        assert.throws(() => uri.resolve('https://example.com/app/', input), /URI host is malformed/);
      }
    }
    assert.equal(uri.parse('https://user@example.com/app/').error, undefined);
    assert.equal(uri.parse('https://EXAMPLE.COM/app/').host, 'example.com');
  });

  test(`${tree}: URI suffix paths cannot become executable schemes`, () => {
    // GHSA-333x-w4r6-6crp: path-only suffix references, with and without skipEscape.
    const uri = requireDependency('fast-uri');
    const options = { reference: 'suffix', scheme: 'x' };
    for (const [input, expected] of [
      ['javascript:alert(1)', 'javascript%3Aalert(1)'],
      ['data:text/plain,test', 'data%3Atext/plain,test'],
      ['vbscript:msgbox(1)', 'vbscript%3Amsgbox(1)'],
      ['javascript:alert(1):tail', 'javascript%3Aalert(1)%3Atail'],
      ['javascript:alert(1)/a:b', 'javascript%3Aalert(1)/a:b'],
    ]) {
      assert.equal(uri.normalize(input, options), expected);
      assert.equal(uri.serialize({ path: input }, { reference: 'suffix' }), expected);
      for (const skipEscape of [false, true]) {
        const serialized = uri.serialize({ path: input }, { reference: 'suffix', skipEscape });
        assert.equal(uri.parse(serialized).scheme, undefined);
      }
      assert.equal(uri.parse(expected).scheme, undefined);
    }
    assert.equal(uri.normalize('path/to/file', options), 'path/to/file');
    assert.equal(uri.normalize('a/b:c', options), 'a/b:c');
  });
}

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
