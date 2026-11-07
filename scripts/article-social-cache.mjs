import { createHash, randomUUID } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const digest = value => createHash('sha256').update(value).digest('hex');
export const articleSocialCacheKey = inputs => digest(JSON.stringify({ jpeg: 1, inputs }));

async function valid(bytes) {
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8 || bytes[2] !== 0xff) return false;
  const image = sharp(bytes, { failOn: 'warning', limitInputPixels: 1200 * 630 });
  const meta = await image.metadata();
  if (meta.format !== 'jpeg' || meta.width !== 1200 || meta.height !== 630) return false;
  await image.raw().toBuffer();
  return true;
}

function directory(value) {
  const root = path.resolve(value);
  let parent = root;
  while (!fs.existsSync(parent)) {
    const next = path.dirname(parent);
    if (next === parent) return null;
    parent = next;
  }
  if (fs.realpathSync(parent) !== parent) return null;
  fs.mkdirSync(root, { recursive: true, mode: 0o700 });
  return fs.realpathSync(root) === root ? root : null;
}

async function read(file, key) {
  let fd;
  try {
    fd = fs.openSync(file, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW | fs.constants.O_NONBLOCK);
    const before = fs.fstatSync(fd);
    if (!before.isFile() || before.nlink !== 1 || before.size > 2_000_000) return null;
    const data = Buffer.alloc(before.size + 1);
    let length = 0, count;
    while (length < data.length && (count = fs.readSync(fd, data, length, data.length - length, null)) > 0) length += count;
    const after = fs.fstatSync(fd);
    if (length !== before.size || after.size !== before.size || after.mtimeMs !== before.mtimeMs) return null;
    const entry = JSON.parse(data.subarray(0, length).toString('utf8'));
    if (entry.version !== 1 || entry.key !== key || typeof entry.jpeg !== 'string' || !/^[a-f0-9]{64}$/u.test(entry.sha256)) return null;
    const bytes = Buffer.from(entry.jpeg, 'base64');
    if (bytes.toString('base64') !== entry.jpeg || digest(bytes) !== entry.sha256 || !await valid(bytes)) return null;
    return bytes;
  } catch { return null; }
  finally { if (fd !== undefined) fs.closeSync(fd); }
}

function write(file, key, bytes) {
  const temporary = `${file}.${randomUUID()}.tmp`;
  try {
    try {
      const stat = fs.lstatSync(file);
      if (!stat.isFile() || stat.nlink !== 1) return;
    } catch (error) { if (error.code !== 'ENOENT') return; }
    const entry = JSON.stringify({ version: 1, key, sha256: digest(bytes), jpeg: bytes.toString('base64') });
    if (Buffer.byteLength(entry) > 2_000_000) return;
    fs.writeFileSync(temporary, entry, { flag: 'wx', mode: 0o600 });
    fs.renameSync(temporary, file);
  } catch { /* Optional cache never prevents a successful fresh render. */ }
  finally { try { fs.rmSync(temporary, { force: true }); } catch { /* Optional cleanup. */ } }
}

export async function renderArticleWithCache({ cacheDirectory, inputs, render }) {
  if (!cacheDirectory) return render();
  let root;
  try { root = directory(path.join(cacheDirectory, 'article-jpeg')); } catch { /* Unsafe or unwritable optional cache. */ }
  if (!root) return render();
  const key = articleSocialCacheKey(inputs);
  const file = path.join(root, `${key}.json`);
  const cached = await read(file, key);
  if (cached) return cached;
  const bytes = await render();
  if (await valid(bytes)) write(file, key, bytes);
  return bytes;
}
