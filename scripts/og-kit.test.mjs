import assert from "node:assert/strict";
import test from "node:test";
import sharp from "sharp";
import { OG, ogCard, renderOgPng } from "./og-kit.mjs";

test("generated social cards are deterministic optimized palette PNGs", async () => {
  const card = ogCard({
    title: "Taiwan FX risk",
    subtitle: "A deterministic social-card fixture.",
    dateLabel: "29 August 2026",
  });
  const first = await renderOgPng(card);
  const second = await renderOgPng(card);
  const metadata = await sharp(first).metadata();

  assert.deepEqual(first, second);
  assert.equal(metadata.format, "png");
  assert.equal(metadata.width, OG.width);
  assert.equal(metadata.height, OG.height);
  assert.equal(metadata.isPalette, true);
  assert.ok(first.length < 40_000, `optimized fixture is unexpectedly large: ${first.length} bytes`);
});
