import { constants } from 'node:fs';
import { chmod, lstat, mkdir, open, readFile, realpath, rename, rm, stat } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash, randomUUID } from 'node:crypto';

export const ROOT = fileURLToPath(new URL('../../', import.meta.url));
export const VERSION = '1.0.0';
export const MAX_BYTES = 8 * 1024 * 1024;
export const PRIVATE_BYTES = 32 * 1024 * 1024;
export const MAX_ROWS = 20_000;
export const digest = value => createHash('sha256').update(typeof value === 'string' ? value : JSON.stringify(value, (_key, item) => item && typeof item === 'object' && !Array.isArray(item) ? Object.fromEntries(Object.keys(item).sort().map(key => [key, item[key]])) : item)).digest('hex');
export const within = (parent, child) => { const rel = relative(parent, child); return rel === '' || (!rel.startsWith(`..${sep}`) && rel !== '..' && !isAbsolute(rel)); };

async function resolvedPath(path) {
  try { return await realpath(path); }
  catch (error) {
    if (error.code !== 'ENOENT') throw error;
    const parent = dirname(path);
    if (parent === path) throw error;
    return join(await resolvedPath(parent), relative(parent, path));
  }
}

// Check lexical AND physical paths. Refuse symlink components rather than
// treating an ignored directory or a symlink outside public/ as private.
export async function privateDirectory(value = process.env.L0G_VISIBILITY_DIR || join(homedir(), '.local/share/l0g-visibility'), servedRoots = []) {
  const target = resolve(value);
  const physical = await resolvedPath(target);
  const forbidden = [ROOT, '/var/www', '/srv/www', '/Library/WebServer/Documents', ...servedRoots].map(resolveOne);
  for (const path of forbidden) {
    const real = await resolvedPath(path);
    if (within(path, target) || within(real, physical) || within(physical, real)) throw new Error('private_destination_forbidden');
  }
  let cursor = target;
  while (dirname(cursor) !== cursor) {
    try { if ((await lstat(cursor)).isSymbolicLink()) throw new Error('private_symlink_forbidden'); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
    cursor = dirname(cursor);
  }
  await mkdir(target, { recursive: true, mode: 0o700 });
  const info = await stat(target);
  if (!info.isDirectory() || (process.getuid && info.uid !== process.getuid())) throw new Error('private_owner_invalid');
  await chmod(target, 0o700);
  return target;
}
function resolveOne(value) { return resolve(value); }

function filename(name) {
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,180}$/.test(name)) throw new Error('private_filename_invalid');
  return name;
}

export async function writePrivate(directory, name, value) {
  await privateDirectory(directory);
  const destination = join(directory, filename(name));
  try { if ((await lstat(destination)).isSymbolicLink()) throw new Error('private_symlink_forbidden'); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  const temporary = join(directory, `.write-${randomUUID()}`);
  const handle = await open(temporary, constants.O_CREAT | constants.O_EXCL | constants.O_WRONLY | constants.O_NOFOLLOW, 0o600);
  try {
    await handle.writeFile(typeof value === 'string' ? value : `${JSON.stringify(value, null, 2)}\n`);
    await handle.sync();
  } finally { await handle.close(); }
  try { await rename(temporary, destination); }
  finally { await rm(temporary, { force: true }); }
}

export async function readBounded(path, maximum = MAX_BYTES) {
  const handle = await open(path, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
  try {
    const info = await handle.stat();
    if (!info.isFile() || info.nlink !== 1 || info.size > maximum) throw new Error('import_size_invalid');
    const buffer = Buffer.alloc(Math.min(maximum + 1, info.size + 1));
    let bytesRead = 0;
    while (bytesRead < buffer.length) {
      const chunk = await handle.read(buffer, bytesRead, buffer.length - bytesRead, bytesRead);
      if (chunk.bytesRead === 0) break;
      bytesRead += chunk.bytesRead;
    }
    const after = await handle.stat();
    if (bytesRead !== info.size || after.size !== info.size || after.mtimeMs !== info.mtimeMs || bytesRead > maximum) throw new Error('import_size_invalid');
    return buffer.subarray(0, bytesRead).toString('utf8');
  } finally { await handle.close(); }
}

export function parseJson(text) {
  // Bound depth before JSON.parse to avoid stack exhaustion in later traversals.
  let depth = 0, quoted = false, escape = false;
  for (const char of text) {
    if (quoted) { if (escape) escape = false; else if (char === '\\') escape = true; else if (char === '"') quoted = false; }
    else if (char === '"') quoted = true;
    else if (char === '[' || char === '{') { if (++depth > 24) throw new Error('json_depth_exceeded'); }
    else if (char === ']' || char === '}') depth--;
  }
  return JSON.parse(text, (key, value) => {
    if (['__proto__', 'constructor', 'prototype'].includes(key)) throw new Error('json_key_forbidden');
    return value;
  });
}

export async function readPrivate(directory, name, fallback = null) {
  try { return parseJson(await readBounded(join(directory, filename(name)), PRIVATE_BYTES)); }
  catch (error) { if (error.code === 'ENOENT') return fallback; throw error; }
}

export async function locked(directory, callback) {
  await privateDirectory(directory);
  const path = join(directory, '.lock');
  let handle;
  try { handle = await open(path, 'wx', 0o600); }
  catch (error) { if (error.code === 'EEXIST') throw new Error('visibility_locked'); throw error; }
  try { await handle.writeFile(JSON.stringify({ pid: process.pid, at: new Date().toISOString() })); return await callback(); }
  finally { await handle.close(); await rm(path); }
}

export const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
export function csv(rows, columns) {
  const cell = value => {
    let text = String(value ?? '');
    if (/^[\s\uFEFF]*[=+@-]|^[\t\r\n]/.test(text)) text = `'${text}`;
    return `"${text.replace(/"/g, '""')}"`;
  };
  return [columns, ...rows.map(row => columns.map(column => row[column]))].map(row => row.map(cell).join(',')).join('\r\n') + '\r\n';
}

export function cleanUrl(raw) {
  const url = new URL(raw);
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) throw new Error('url_invalid');
  // A signed query can cover every parameter and its exact encoding. Do not
  // break the signature. Evidence retention separately refuses sensitive URLs.
  if ([...url.searchParams.keys()].some(key => /signature|(?:^|-)sig$|credential/i.test(key))) return url.href;
  const kept = url.search.slice(1).split('&').filter(part => {
    let key;
    try { key = decodeURIComponent(part.split('=')[0].replace(/\+/g, ' ')); } catch { return true; }
    return !/^(?:utm_.+|fbclid|gclid|msclkid|dclid|mc_cid|mc_eid)$/i.test(key);
  });
  url.search = kept.join('&');
  return url.href;
}

export function safeEvidenceUrl(raw) {
  const clean = new URL(cleanUrl(raw));
  if ([...clean.searchParams.keys()].some(key => /token|secret|auth|signature|credential|api.?key|password|(?:^|-)sig$|^(?:key|code|samlresponse)$/i.test(key))) throw new Error('url_sensitive');
  if (/^(?:chatgpt\.com|chat\.openai\.com|claude\.ai|gemini\.google\.com)$/.test(clean.hostname) && /\/(?:c|chat|share)\//.test(clean.pathname)) throw new Error('conversation_url_forbidden');
  return clean.href;
}
