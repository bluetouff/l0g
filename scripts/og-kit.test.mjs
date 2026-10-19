import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import satori from "satori";
import sharp from "sharp";
import { OG, fonts, ogCard, renderOgPng } from "./og-kit.mjs";

const readProjectFile = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("generated social cards are deterministic optimized palette PNGs", async () => {
  const card = ogCard({
    title: "Taiwan FX risk",
    subtitle: "A deterministic social-card fixture.",
    dateLabel: "29 August 2026",
  });
  const first = await renderOgPng(card, { cacheDir: null });
  const second = await renderOgPng(card, { cacheDir: null });
  const metadata = await sharp(first).metadata();

  assert.deepEqual(first, second);
  assert.equal(metadata.format, "png");
  assert.equal(metadata.width, OG.width);
  assert.equal(metadata.height, OG.height);
  assert.equal(metadata.isPalette, true);
  assert.ok(first.length < 40_000, `optimized fixture is unexpectedly large: ${first.length} bytes`);
});

test("social-card layout keeps the complete frame and long French and English titles inside the canvas", async (t) => {
  const titles = [
    "Taiwan FX risk",
    "Cartographier le risque des systèmes économiques",
    "La contagion silencieuse : comment le crédit privé tisse une toile invisible entre banques, assureurs, marchés actions, crypto et stablecoins",
    "SpaceX goes public, 12 June 2026: the red carpet the SEC rolls out for the most expensive IPO in history by bending its own rules",
    "Lire la masse monétaire M2 : signal de liquidité, lectures erronées et lien avec le risk-on",
    "How to Read M2 Money Supply: liquidity signal, bad readings and risk-on narratives",
  ];

  for (const title of titles) {
    await t.test(title, async () => {
      const nodes = [];
      await satori(ogCard({ title, dateLabel: "19 October 2026" }), {
        width: OG.width,
        height: OG.height,
        fonts,
        onNodeDetected: (node) => nodes.push(node),
      });

      const frame = nodes.find(({ props }) => props.style.border === `1px solid ${OG.line}`);
      assert.ok(frame, "the complete terminal frame must be rendered");
      assert.deepEqual(
        [frame.left, frame.top, frame.width, frame.height],
        [30, 30, OG.width - 60, OG.height - 60],
        "padding and borders must stay inside the 1200×630 card",
      );
      for (const node of nodes) {
        const bounds = [node.left, node.top, node.width, node.height];
        assert.ok(bounds.every(Number.isFinite), "every rendered box must have finite dimensions");
        assert.ok(node.left >= 0 && node.top >= 0 && node.width >= 0 && node.height >= 0);
        assert.ok(node.left + node.width <= OG.width && node.top + node.height <= OG.height,
          `rendered box leaves the card: ${node.textContent ?? node.type} ${bounds.join(",")}`);
      }
      const footer = nodes.find(({ textContent }) => textContent === "l0g.fr");
      assert.ok(footer, "the site address must be rendered");
      assert.ok(footer.left > OG.width / 2 && footer.top > OG.height / 2);
      assert.ok(footer.left + footer.width < frame.left + frame.width);
      assert.ok(footer.top + footer.height < frame.top + frame.height);
    });
  }
});

test("social-card PNG visibly retains all four terminal borders", async () => {
  const png = await renderOgPng(ogCard({ title: "Taiwan FX risk" }), { cacheDir: null });
  const { data, info } = await sharp(png).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.channels, 3);
  const background = Buffer.from(OG.ink.slice(1), "hex");
  for (const [name, x, y] of [
    ["top", 600, 30], ["bottom", 600, 599], ["left", 30, 315], ["right", 1169, 315],
  ]) {
    const offset = (y * info.width + x) * info.channels;
    const contrast = background.reduce((sum, channel, index) => sum + data[offset + index] - channel, 0);
    assert.ok(contrast >= 50, `${name} border disappeared from the PNG`);
  }
});

test("homepage social card visibly retains its bottom-right site address", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "l0g-og-home-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await mkdir(join(directory, "public"));
  await promisify(execFile)(process.execPath, [fileURLToPath(new URL("./og-home.mjs", import.meta.url))], {
    cwd: directory,
    timeout: 15_000,
    env: { ...process.env, L0G_OG_CACHE_DIR: "" },
  });
  const { data, info } = await sharp(join(directory, "public/og-home.png"))
    .removeAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.width, OG.width);
  assert.equal(info.height, OG.height);
  assert.equal(info.channels, 3);
  let visibleTextPixels = 0;
  for (let y = 540; y < 590; y++) {
    for (let x = 1000; x < 1150; x++) {
      const offset = (y * info.width + x) * info.channels;
      if (data[offset] >= 220 && data[offset + 1] >= 220 && data[offset + 2] >= 220) visibleTextPixels++;
    }
  }
  assert.ok(visibleTextPixels >= 100, "the light site-address text was clipped from its footer area");
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
