import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import sharp from "sharp";
import { OG, ogCard, renderOgPng } from "./og-kit.mjs";

const readProjectFile = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

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

test("article hero images keep descriptive alt text without a redundant visible caption", async () => {
  const [component, frenchArticle, englishArticle] = await Promise.all([
    readProjectFile("src/components/ArticleHeroImage.astro"),
    readProjectFile("src/pages/posts/[...slug].astro"),
    readProjectFile("src/pages/en/analysis/[...slug].astro"),
  ]);

  assert.match(component, /alt=\{alt\}/);
  assert.doesNotMatch(component, /<figcaption\b/);
  assert.doesNotMatch(component, /caption:\s*string/);
  assert.match(frenchArticle, /alt=\{`Illustration de l’analyse : \$\{post\.data\.title\}`\}/);
  assert.match(englishArticle, /alt=\{`Illustration for the analysis: \$\{post\.data\.title\}`\}/);
  assert.doesNotMatch(frenchArticle, /Illustration éditoriale de l’analyse\./);
  assert.doesNotMatch(englishArticle, /Editorial illustration for this analysis\./);
});
