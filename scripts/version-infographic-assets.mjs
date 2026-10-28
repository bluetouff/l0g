import { constants } from 'node:fs';
import { lstat, open, readFile, readdir, realpath, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'parse5';

const families = 'brazil-pressure|ecb-collateral|paramount-warner|reserves-allocation-05|reserves-logistics|reserves-pump-06|reserves-refining';
const ownedPrefix = new RegExp(`^/infographies/(?:${families})(?=/|[?#]|$)`, 'u');
const ownedInHtml = new RegExp(`/infographies/(?:${families})/`, 'u');
const assetUrl = new RegExp(`^(/infographies/(?:${families})/(?:[a-z0-9][a-z0-9._-]*/)*[a-z0-9][a-z0-9._-]*\\.svg)(?:\\?v=[a-zA-Z0-9_-]{1,64})?(#[a-zA-Z0-9_.:-]+)?$`, 'u');

function assetReference(value) {
  if (!ownedPrefix.test(value) || !value.split(/[?#]/u)[0].endsWith('.svg')) return null;
  const match = assetUrl.exec(value);
  if (!match) throw new Error('Invalid canonical infographic asset URL');
  return { pathname: match[1], fragment: match[2] ?? '' };
}

async function assetVersion(root, pathname) {
  // Only a validated, root-relative URL may reach filesystem operations.
  const parts = pathname.slice(1).split('/');
  let file = root;
  for (const [index, part] of parts.entries()) {
    file = join(file, part);
    const info = await lstat(file);
    if (info.isSymbolicLink() || (index < parts.length - 1 ? !info.isDirectory() : !info.isFile())) {
      throw new Error('Infographic asset must use ordinary files and directories');
    }
  }
  const handle = await open(file, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
  try {
    const before = await handle.stat();
    if (!before.isFile() || before.nlink !== 1) throw new Error('Infographic asset must be an ordinary file');
    const bytes = await handle.readFile();
    const after = await handle.stat();
    if (bytes.length !== before.size || before.size !== after.size || before.mtimeMs !== after.mtimeMs) {
      throw new Error('Infographic asset changed while hashing');
    }
    return createHash('sha256').update(bytes).digest('hex').slice(0, 16);
  } finally {
    await handle.close();
  }
}

function valueRange(html, location) {
  if (!location) throw new Error('Missing infographic attribute source location');
  const raw = html.slice(location.startOffset, location.endOffset);
  const attribute = /^[^\s=]+[\t\n\f\r ]*=[\t\n\f\r ]*(?:"([^"]*)"|'([^']*)'|([^\t\n\f\r "'=<>`]+))$/u.exec(raw);
  if (!attribute) throw new Error('Invalid infographic attribute source');
  const value = attribute[1] ?? attribute[2] ?? attribute[3];
  const quoted = attribute[3] === undefined;
  return {
    start: location.endOffset - value.length - (quoted ? 1 : 0),
    end: location.endOffset - (quoted ? 1 : 0),
    quoted,
  };
}

async function rewriteHtml(html, root, versions) {
  if (!ownedInHtml.test(html)) return { html, references: 0 };
  const patches = new Map();
  const pending = [parse(html, { sourceCodeLocationInfo: true, scriptingEnabled: false })];
  while (pending.length) {
    const node = pending.pop();
    pending.push(...(node.childNodes ?? []));
    if (node.content) pending.push(node.content);
    if (node.namespaceURI !== 'http://www.w3.org/1999/xhtml') continue;
    const name = node.tagName === 'img' ? 'src' : node.tagName === 'a' ? 'href' : null;
    if (!name) continue;
    const attribute = node.attrs.find(item => item.name === name);
    if (!attribute) continue;
    const reference = assetReference(attribute.value);
    if (!reference) continue;
    if (!versions.has(reference.pathname)) versions.set(reference.pathname, assetVersion(root, reference.pathname));
    const hash = await versions.get(reference.pathname);
    const range = valueRange(html, node.sourceCodeLocation?.attrs?.[name]);
    const url = `${reference.pathname}?v=${hash}${reference.fragment}`;
    // Character references keep unquoted attribute syntax valid without adding quotes.
    patches.set(range.start, { ...range, value: range.quoted ? url : url.replace('=', '&#61;') });
  }
  let output = html;
  for (const patch of [...patches.values()].sort((a, b) => b.start - a.start)) {
    output = output.slice(0, patch.start) + patch.value + output.slice(patch.end);
  }
  return { html: output, references: patches.size };
}

/** Rewrite only selected HTML attribute values; never serialize the document. */
export async function versionInfographicHtml(html, dir) {
  return rewriteHtml(html, await realpath(dir instanceof URL ? fileURLToPath(dir) : dir), new Map());
}

export async function versionInfographicAssets(dir) {
  const root = await realpath(dir instanceof URL ? fileURLToPath(dir) : dir);
  const pending = [root], versions = new Map();
  let pages = 0, references = 0;
  while (pending.length) {
    const directory = pending.pop();
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      if (entry.isSymbolicLink()) throw new Error('Symlink in static output');
      const path = join(directory, entry.name);
      if (entry.isDirectory()) pending.push(path);
      else if (entry.isFile() && entry.name.endsWith('.html')) {
        const original = await readFile(path, 'utf8');
        const result = await rewriteHtml(original, root, versions);
        references += result.references;
        if (result.html !== original) { await writeFile(path, result.html); pages++; }
      }
    }
  }
  return { pages, references };
}

export default function infographicAssetVersions() {
  return {
    name: 'l0g-infographic-asset-versions',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const { pages, references } = await versionInfographicAssets(dir);
        logger.info(`${references} infographic SVG references versioned in ${pages} HTML pages`);
      },
    },
  };
}
