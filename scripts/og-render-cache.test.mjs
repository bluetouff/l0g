import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import sharp from "sharp";
import { fonts, ogCard, renderOgPng } from "./og-kit.mjs";
import { pngRenderCacheKey, renderPngWithCache } from "./og-render-cache.mjs";

const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");
const png = await sharp({ create: { width: 16, height: 8, channels: 3, background: "#123456" } }).png().toBuffer();

function fixture(t) {
  const directory = fs.realpathSync(fs.mkdtempSync(path.join(tmpdir(), "l0g-og-cache-test-")));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  let renders = 0;
  const options = { directory, inputs: { title: "Original", policy: "fixture-v1" }, width: 16, height: 8,
    render: async () => { renders++; return png; } };
  const file = path.join(directory, `${pngRenderCacheKey(options.inputs, 16, 8)}.json`);
  return { directory, options, file, renders: () => renders };
}

test("cold and warm caches return exact PNG bytes and render only on misses", async (t) => {
  const f = fixture(t);
  assert.deepEqual(await renderPngWithCache(f.options), png);
  assert.deepEqual(await renderPngWithCache(f.options), png);
  assert.equal(f.renders(), 1);
  assert.equal(JSON.parse(fs.readFileSync(f.file)).sha256, digest(png));
  await renderPngWithCache({ ...f.options, directory: null });
  await renderPngWithCache({ ...f.options, directory: null });
  assert.equal(f.renders(), 3, "disabled cache must always render");
});

test("changed content or rendering policy cannot reuse an old entry", async (t) => {
  const f = fixture(t);
  await renderPngWithCache(f.options);
  for (const inputs of [{ ...f.options.inputs, title: "Updated" }, { ...f.options.inputs, policy: "fixture-v2" }]) {
    await renderPngWithCache({ ...f.options, inputs });
    await renderPngWithCache({ ...f.options, inputs });
  }
  assert.equal(f.renders(), 3);
});

test("corrupt, truncated, wrong-size and oversized cached entries regenerate", async (t) => {
  const f = fixture(t);
  await renderPngWithCache(f.options);
  const good = JSON.parse(fs.readFileSync(f.file));
  const wrongSize = await sharp(png).resize(8, 4).png().toBuffer();
  const truncated = png.subarray(0, png.length - 25);
  const replacements = [
    "not JSON", "x".repeat(2_000_001),
    JSON.stringify({ ...good, key: "0".repeat(64) }),
    JSON.stringify({ ...good, sha256: "0".repeat(64) }),
    JSON.stringify({ ...good, png: "../../outside.png" }),
    ...[Buffer.from("not a PNG"), wrongSize, truncated].map(bytes => JSON.stringify({ ...good, png: bytes.toString("base64"), sha256: digest(bytes) })),
  ];
  for (const replacement of replacements) {
    fs.writeFileSync(f.file, replacement);
    assert.deepEqual(await renderPngWithCache(f.options), png);
    assert.equal(JSON.parse(fs.readFileSync(f.file)).sha256, digest(png));
  }
  assert.equal(f.renders(), replacements.length + 1);
});

test("cache file links and directory links are never followed or replaced", async (t) => {
  const f = fixture(t);
  await renderPngWithCache(f.options);
  const outside = path.join(f.directory, "outside.json");
  fs.renameSync(f.file, outside);
  fs.symlinkSync(outside, f.file);
  assert.deepEqual(await renderPngWithCache(f.options), png);
  assert.equal(f.renders(), 2);
  assert(fs.lstatSync(f.file).isSymbolicLink());
  fs.unlinkSync(f.file);
  fs.linkSync(outside, f.file);
  assert.deepEqual(await renderPngWithCache(f.options), png);
  assert.equal(f.renders(), 3);
  assert.equal(fs.statSync(f.file).nlink, 2);
  fs.unlinkSync(f.file);
  const directoryLink = path.join(f.directory, "linked");
  fs.symlinkSync(f.directory, directoryLink);
  await renderPngWithCache({ ...f.options, directory: path.join(directoryLink, "child") });
  assert.equal(f.renders(), 4);
  assert(!fs.existsSync(path.join(f.directory, "child")));
  fs.symlinkSync(path.join(f.directory, "missing"), f.file);
  await renderPngWithCache(f.options);
  assert(fs.lstatSync(f.file).isSymbolicLink(), "dangling links must also be preserved");
});

test("render failures propagate without recording an entry", async (t) => {
  const f = fixture(t);
  await assert.rejects(renderPngWithCache({ ...f.options, render: async () => { throw new Error("render failed"); } }), /render failed/);
  assert(!fs.existsSync(f.file));
  const blocked = path.join(f.directory, "file-not-directory");
  fs.writeFileSync(blocked, "preserve");
  assert.deepEqual(await renderPngWithCache({ ...f.options, directory: blocked }), png);
  assert.equal(fs.readFileSync(blocked, "utf8"), "preserve");
});

test("real OG warm hits match uncached SHA and changed titles and fonts invalidate", async (t) => {
  const f = fixture(t);
  const card = ogCard({ title: "Cache exactness", subtitle: "Source-backed fixture.", dateLabel: "9 October 2026" });
  const start = performance.now();
  const cold = await renderOgPng(card, { cacheDir: f.directory });
  const coldMs = performance.now() - start;
  const warmStart = performance.now();
  const warm = await renderOgPng(card, { cacheDir: f.directory });
  const warmMs = performance.now() - warmStart;
  const fresh = await renderOgPng(card, { cacheDir: null });
  assert.equal(digest(cold), digest(fresh));
  assert.equal(digest(warm), digest(fresh));
  assert.equal(fs.readdirSync(f.directory).length, 1);
  const changed = await renderOgPng(ogCard({ title: "Updated title" }), { cacheDir: f.directory });
  assert.notEqual(digest(changed), digest(cold));
  assert.equal(fs.readdirSync(f.directory).length, 2);
  const original = fonts[0].data;
  try {
    fonts[0].data = fonts[1].data;
    const changedFont = await renderOgPng(card, { cacheDir: f.directory });
    assert.deepEqual(changedFont, await renderOgPng(card, { cacheDir: null }));
    assert.equal(fs.readdirSync(f.directory).length, 3);
  } finally {
    fonts[0].data = original;
  }
  t.diagnostic(`OG cache cold=${coldMs.toFixed(1)} ms warm=${warmMs.toFixed(1)} ms SHA-256=${digest(cold)}`);
});
