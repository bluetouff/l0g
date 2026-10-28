import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import test from 'node:test';
import { parse } from 'parse5';
import infographicAssetVersions, { versionInfographicAssets, versionInfographicHtml } from './version-infographic-assets.mjs';

const families = ['brazil-pressure', 'ecb-collateral', 'paramount-warner', 'reserves-allocation-05', 'reserves-logistics', 'reserves-pump-06', 'reserves-refining'];
const asset = '/infographies/reserves-logistics/panels/sample.fr.light.svg';
const bytes = '<svg xmlns="http://www.w3.org/2000/svg"><title>Same figure</title></svg>\n';
const hash = data => createHash('sha256').update(data).digest('hex').slice(0, 16);
async function fixture(t, files = { [asset]: bytes }) {
  const dir = await mkdtemp(join(tmpdir(), 'l0g-infographic-versions-'));
  t.after(() => rm(dir, { recursive: true, force: true }));
  for (const [name, content] of Object.entries(files)) {
    const file = join(dir, name);
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, content);
  }
  return dir;
}
function references(html) {
  const output = [], pending = [parse(html)];
  while (pending.length) {
    const node = pending.pop(); pending.push(...(node.childNodes ?? []));
    for (const attribute of node.attrs ?? []) if (['src', 'href'].includes(attribute.name)) output.push(attribute.value);
  }
  return output.reverse();
}

test('the seven exact SVG families use a 16-character SHA-256 of the delivered bytes', async t => {
  const files = Object.fromEntries(families.map((family, index) => [`/infographies/${family}/scene.en.svg`, bytes + index]));
  const dir = await fixture(t, files);
  for (const [path, content] of Object.entries(files)) {
    const result = await versionInfographicHtml(`<img src="${path}"><a href="${path}">Full figure</a>`, dir);
    assert.equal(result.html, `<img src="${path}?v=${hash(content)}"><a href="${path}?v=${hash(content)}">Full figure</a>`);
    assert.equal(result.references, 2);
  }
});

test('only real img/src and a/href values change; every other HTML byte stays intact', async t => {
  const dir = await fixture(t);
  const fake = '/infographies/reserves-logistics/absent.svg';
  const prefix = `<!DOCTYPE html>\n<!-- <img src="${fake}"> -->\n<script>const html = '<img src="${fake}">'; const href='${fake}';</script><style>.fake::after{content:'<a href="${fake}">';}</style><p>&lt;img src=&quot;${fake}&quot;&gt; ${fake}</p>`;
  const body = `<IMG alt='a > b &amp; c' SRC = '${asset}' loading=lazy><a data-src="${fake}" href="${asset}#panel-1" title="Full > figure">Read</a><div data-html='<img src="${fake}">'></div>`;
  const result = await versionInfographicHtml(prefix + body, dir);
  const expected = prefix + body.replace(`SRC = '${asset}'`, `SRC = '${asset}?v=${hash(bytes)}'`).replace(`href="${asset}#panel-1"`, `href="${asset}?v=${hash(bytes)}#panel-1"`);
  assert.equal(result.html, expected);
  assert.equal(result.references, 2);
});

test('hashes refresh after asset changes, existing v is replaced and fragments remain stable', async t => {
  const dir = await fixture(t);
  const original = `<a href="${asset}?v=previous#panel-1">Read</a>`;
  const first = await versionInfographicHtml(original, dir);
  assert.equal(first.html, `<a href="${asset}?v=${hash(bytes)}#panel-1">Read</a>`);
  assert.deepEqual(await versionInfographicHtml(first.html, dir), first, 'A second pass is byte-idempotent');
  const changed = bytes.replace('Same figure', 'Updated paint');
  await writeFile(join(dir, asset), changed);
  const second = await versionInfographicHtml(first.html, dir);
  assert.equal(second.html, `<a href="${asset}?v=${hash(changed)}#panel-1">Read</a>`);
  assert.notEqual(second.html, first.html);
});

test('unquoted values remain valid HTML and template/noscript references are covered', async t => {
  const dir = await fixture(t);
  const input = `<img src=${asset}><template><a href="${asset}">Read</a></template><noscript><img src="${asset}"></noscript>`;
  const result = await versionInfographicHtml(input, dir);
  assert.equal(result.references, 3);
  assert.ok(result.html.startsWith(`<img src=${asset}?v&#61;${hash(bytes)}>`));
  assert.equal(references(result.html)[0], `${asset}?v=${hash(bytes)}`);
  assert.equal((await versionInfographicHtml(result.html, dir)).html, result.html);
});

test('unowned origins, families, extensions and attributes remain untouched', async t => {
  const dir = await fixture(t, {});
  const input = `<img src="https://l0g.fr${asset}"><img src="//other.example${asset}"><a href="/infographies/reserves-logistics-copy/a.svg">Other</a><img src="/infographies/unrelated/a.svg"><a href="/infographies/reserves-logistics/a.pdf">PDF</a><img data-src="${asset}"><source srcset="${asset} 1x"><svg><a href="${asset}">SVG link</a></svg>`;
  assert.deepEqual(await versionInfographicHtml(input, dir), { html: input, references: 0 });
});

test('missing files, traversal, encoded separators and ambiguous queries fail closed', async t => {
  const dir = await fixture(t);
  await assert.rejects(versionInfographicHtml('<img src="/infographies/reserves-logistics/missing.svg">', dir), { code: 'ENOENT' });
  for (const path of [
    '/infographies/reserves-logistics/../private.svg',
    '/infographies/reserves-logistics/./sample.svg',
    '/infographies/reserves-logistics/%2e%2e/private.svg',
    '/infographies/reserves-logistics/panels%2fsample.svg',
    '/infographies/reserves-logistics/panels//sample.svg',
    '/infographies/reserves-logistics/panels/..\\private.svg',
    asset + '?download=1', asset + '?v=old&amp;next=other', asset + '?v=a&amp;v=b',
  ]) await assert.rejects(versionInfographicHtml(`<img src="${path}">`, dir), /Invalid canonical infographic asset URL/);
});

test('file and parent-directory symlinks cannot redirect a validated asset read', async t => {
  const dir = await fixture(t, {});
  const outside = await fixture(t, { '/secret.svg': bytes });
  await mkdir(join(dir, 'infographies/reserves-logistics'), { recursive: true });
  await symlink(join(outside, 'secret.svg'), join(dir, 'infographies/reserves-logistics/link.svg'));
  await assert.rejects(versionInfographicHtml('<img src="/infographies/reserves-logistics/link.svg">', dir), /ordinary files and directories/);
  await symlink(outside, join(dir, 'infographies/reserves-logistics/panels'));
  await assert.rejects(versionInfographicHtml('<a href="/infographies/reserves-logistics/panels/secret.svg">Read</a>', dir), /ordinary files and directories/);
});

test('build:done versions nested HTML, preserves other outputs and is idempotent', async t => {
  const dir = await fixture(t, {
    [asset]: bytes,
    '/index.html': '<p>Plain home</p>\n',
    '/posts/example/index.html': `<img src="${asset}">`,
    '/en/analysis/example/index.html': `<a href="${asset}">Full figure</a>`,
    '/manifest.json': JSON.stringify({ image: asset }),
  });
  const logs = [], integration = infographicAssetVersions();
  assert.equal(integration.name, 'l0g-infographic-asset-versions');
  await integration.hooks['astro:build:done']({ dir: pathToFileURL(dir + '/'), logger: { info: message => logs.push(message) } });
  assert.equal(logs.length, 1);
  assert.match(logs[0], /2 infographic SVG references versioned in 2 HTML pages/);
  assert.equal(await readFile(join(dir, '/index.html'), 'utf8'), '<p>Plain home</p>\n');
  assert.equal(await readFile(join(dir, '/posts/example/index.html'), 'utf8'), `<img src="${asset}?v=${hash(bytes)}">`);
  assert.equal(await readFile(join(dir, asset), 'utf8'), bytes);
  assert.equal(await readFile(join(dir, '/manifest.json'), 'utf8'), JSON.stringify({ image: asset }));
  assert.deepEqual(await versionInfographicAssets(dir), { pages: 0, references: 2 });
});
