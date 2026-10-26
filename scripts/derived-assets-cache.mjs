import { createHash, randomUUID } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const VERSION = 1;
const MAX_MANIFEST_BYTES = 4096;
const digest = (value) => createHash('sha256').update(value).digest('hex');

function localPath(root, name) {
  if (typeof name !== 'string' || !name || path.isAbsolute(name) || name.includes('\\') || name.split('/').some((part) => !part || part === '.' || part === '..')) {
    throw new Error('Derived asset paths must stay inside the project');
  }
  let current = root;
  for (const part of name.split('/')) {
    current = path.join(current, part);
    try {
      if (fs.lstatSync(current).isSymbolicLink()) throw new Error(`Symlink in derived asset path: ${name}`);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  return current;
}

function fileDigest(file) {
  const descriptor = fs.openSync(file, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW | fs.constants.O_NONBLOCK);
  try {
    const before = fs.fstatSync(descriptor);
    if (!before.isFile() || before.nlink !== 1) throw new Error('Derived assets require ordinary files without hard links');
    const hash = createHash('sha256');
    const buffer = Buffer.alloc(64 * 1024);
    let total = 0;
    let length;
    while ((length = fs.readSync(descriptor, buffer)) > 0) {
      hash.update(buffer.subarray(0, length));
      total += length;
    }
    const after = fs.fstatSync(descriptor);
    if (total !== before.size || before.size !== after.size || before.mtimeMs !== after.mtimeMs) throw new Error('Derived asset changed while hashing');
    return hash.digest('hex');
  } finally {
    fs.closeSync(descriptor);
  }
}

/** Hash contents, names and missing paths; never trust mtimes or traverse links. */
export function fingerprintPaths(root, specifications) {
  const hash = createHash('sha256');
  let files = 0;
  let missing = 0;
  for (const specification of specifications) {
    const spec = typeof specification === 'string' ? { path: specification } : specification;
    const visit = (name, file) => {
      if (spec.exclude?.some((excluded) => name === excluded || name.startsWith(`${excluded}/`))) return;
      let stat;
      try { stat = fs.lstatSync(file); } catch (error) {
        if (error.code !== 'ENOENT') throw error;
        hash.update(JSON.stringify([name, 'missing']));
        missing++;
        return;
      }
      if (stat.isSymbolicLink()) throw new Error(`Symlink in derived asset path: ${name}`);
      if (stat.isDirectory()) {
        hash.update(JSON.stringify([name, 'directory']));
        for (const child of fs.readdirSync(file).sort()) visit(`${name}/${child}`, path.join(file, child));
      } else if (stat.isFile()) {
        hash.update(JSON.stringify([name, fileDigest(file)]));
        files++;
      } else {
        throw new Error(`Unsupported derived asset file: ${name}`);
      }
    };
    visit(spec.path, localPath(root, spec.path));
  }
  return { hash: hash.digest('hex'), files, missing };
}

function manifestPath(root, name) {
  try {
    const directory = localPath(root, '.cache/derived-assets');
    fs.mkdirSync(directory, { recursive: true, mode: 0o700 });
    return localPath(root, `.cache/derived-assets/${name}.json`);
  } catch {
    return null; // An unsafe/unwritable optional cache never controls generator output.
  }
}

function readManifest(file) {
  if (!file) return null;
  let descriptor;
  try {
    descriptor = fs.openSync(file, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW | fs.constants.O_NONBLOCK);
    const stat = fs.fstatSync(descriptor);
    if (!stat.isFile() || stat.nlink !== 1 || stat.size > MAX_MANIFEST_BYTES) return null;
    const bytes = Buffer.alloc(stat.size + 1);
    const length = fs.readSync(descriptor, bytes);
    if (length !== stat.size) return null;
    const record = JSON.parse(bytes.subarray(0, length).toString('utf8'));
    return record.version === VERSION && /^[a-f0-9]{64}$/.test(record.input) && /^[a-f0-9]{64}$/.test(record.output) ? record : null;
  } catch {
    return null;
  } finally {
    if (descriptor !== undefined) fs.closeSync(descriptor);
  }
}

function writeManifest(root, name, record) {
  const file = manifestPath(root, name);
  if (!file) return;
  const temporary = `${file}.${randomUUID()}.tmp`;
  try {
    try {
      const stat = fs.lstatSync(file);
      if (!stat.isFile() || stat.nlink !== 1) return;
    } catch (error) { if (error.code !== 'ENOENT') return; }
    const bytes = JSON.stringify(record);
    if (Buffer.byteLength(bytes) > MAX_MANIFEST_BYTES) throw new Error('Derived manifest exceeds its fixed budget');
    fs.writeFileSync(temporary, bytes, { flag: 'wx', mode: 0o600 });
    fs.renameSync(temporary, file);
  } catch {
    // A successful render remains usable if its optional manifest cannot be saved.
  } finally {
    try { fs.rmSync(temporary, { force: true }); } catch { /* Optional cache cleanup. */ }
  }
}

/** A manifest contains hashes only. Existing generated files are the only asset copy. */
export async function runDerivedTask({ root, name, inputs, outputs, stableInputs = inputs, identity, run, cache = true, log = console.log }) {
  if (!/^[a-z][a-z0-9-]{0,40}$/.test(name)) throw new Error('Invalid derived asset group');
  root = fs.realpathSync(root);
  const inputIdentity = () => digest(JSON.stringify({ version: VERSION, identity, inputs, outputs, stableInputs, contents: fingerprintPaths(root, inputs) }));
  const input = inputIdentity();
  // Also inspect outputs on a miss, before a generator could follow a hostile link.
  const before = fingerprintPaths(root, outputs);
  const record = cache ? readManifest(manifestPath(root, name)) : null;
  if (record?.input === input && record.output === before.hash && before.files > 0 && before.missing === 0) {
    log(`[derived] ${name}: unchanged, reused existing files`);
    return { cached: true };
  }
  log(`[derived] ${name}: generating`);
  const stableBefore = fingerprintPaths(root, stableInputs).hash;
  await run();
  const after = fingerprintPaths(root, outputs);
  if (after.files === 0 || after.missing !== 0) throw new Error(`Missing generated output in ${name}`);
  // EPUB source trees also feed their packager. Record their final, generated state.
  const finalInput = inputIdentity();
  // Check last: an edit during either final hashing pass must not associate
  // fresh source fingerprints with a render made from the previous source.
  if (fingerprintPaths(root, stableInputs).hash !== stableBefore) throw new Error(`Source changed during ${name} generation; rerun to obtain consistent outputs`);
  if (cache) writeManifest(root, name, { version: VERSION, input: finalInput, output: after.hash });
  return { cached: false };
}
