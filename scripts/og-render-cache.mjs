import { createHash, randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const VERSION = 1;
const MAX_ENTRY_BYTES = 2_000_000;
const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");

export function pngRenderCacheKey(inputs, width, height) {
  return digest(JSON.stringify({ version: VERSION, inputs, width, height }));
}

function cacheDirectory(directory) {
  const resolved = path.resolve(directory);
  // Check existing parents before mkdir so an optional cache never follows a link.
  let parent = resolved;
  while (!fs.existsSync(parent)) {
    const next = path.dirname(parent);
    if (next === parent) return null;
    parent = next;
  }
  if (fs.realpathSync(parent) !== parent) return null;
  fs.mkdirSync(resolved, { recursive: true, mode: 0o700 });
  return fs.realpathSync(resolved) === resolved ? resolved : null;
}

async function validPng(bytes, width, height) {
  if (!bytes.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE)) return false;
  const png = sharp(bytes, { failOn: "warning", limitInputPixels: width * height });
  const metadata = await png.metadata();
  if (metadata.format !== "png" || metadata.width !== width || metadata.height !== height) return false;
  // Metadata alone also accepts some truncated PNGs; decode before trusting a hit.
  await png.raw().toBuffer();
  return true;
}

async function readEntry(file, key, width, height) {
  let descriptor;
  try {
    descriptor = fs.openSync(file, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW | fs.constants.O_NONBLOCK);
    const stat = fs.fstatSync(descriptor);
    if (!stat.isFile() || stat.nlink !== 1 || stat.size > MAX_ENTRY_BYTES) return null;
    const buffer = Buffer.alloc(stat.size + 1);
    let length = 0;
    while (length < buffer.length) {
      const read = fs.readSync(descriptor, buffer, length, buffer.length - length, length);
      if (read === 0) break;
      length += read;
    }
    if (length !== stat.size) return null;
    const entry = JSON.parse(buffer.subarray(0, length).toString("utf8"));
    if (entry.version !== VERSION || entry.key !== key || typeof entry.png !== "string" || !/^[a-f0-9]{64}$/.test(entry.sha256)) return null;
    const bytes = Buffer.from(entry.png, "base64");
    if (bytes.toString("base64") !== entry.png || digest(bytes) !== entry.sha256) return null;
    return await validPng(bytes, width, height) ? bytes : null;
  } catch {
    return null;
  } finally {
    if (descriptor !== undefined) fs.closeSync(descriptor);
  }
}

function writeEntry(file, key, png) {
  const temporary = `${file}.${randomUUID()}.tmp`;
  try {
    try {
      const stat = fs.lstatSync(file);
      if (!stat.isFile() || stat.nlink !== 1) return;
    } catch (error) {
      if (error.code !== "ENOENT") return;
    }
    const entry = JSON.stringify({ version: VERSION, key, sha256: digest(png), png: png.toString("base64") });
    if (Buffer.byteLength(entry) > MAX_ENTRY_BYTES) return;
    fs.writeFileSync(temporary, entry, { flag: "wx", mode: 0o600 });
    fs.renameSync(temporary, file);
  } catch {
    // This cache is optional. A fresh successful render remains authoritative.
  } finally {
    try { fs.rmSync(temporary, { force: true }); } catch { /* Optional cache cleanup. */ }
  }
}

/** Only enable with a dedicated cache directory; never cache public/ or snapshots. */
export async function renderPngWithCache({ directory, inputs, width, height, render }) {
  if (!directory) return render();
  let root;
  try {
    root = cacheDirectory(directory);
  } catch {
    root = null;
  }
  if (!root) return render();
  const key = pngRenderCacheKey(inputs, width, height);
  const file = path.join(root, `${key}.json`);
  const cached = await readEntry(file, key, width, height);
  if (cached) return cached;
  const png = await render();
  if (await validPng(png, width, height)) writeEntry(file, key, png);
  return png;
}
