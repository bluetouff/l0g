import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import { compile, createProcessor } from "@mdx-js/mdx";
import postcss from "postcss";
import { assertFontLicenseReferences } from "./font-license-assertions.mjs";
import {
  JAPAN_SAVINGS_KINDS,
  japanSavingsSvg,
} from "../src/lib/japanSavingsFigures.mjs";
import {
  japanSavingsScenes,
  inspectJapanSavingsSvg,
  assertJapanSavingsGeometry,
  assertJapanSavingsQuantitative,
  assertJapanSavingsSourceFaithful,
  assertJapanSavingsArticleReferences,
  pathPoints,
} from "./japan-savings-svg-assertions.mjs";
const read = (p) => readFileSync(new URL("../" + p, import.meta.url), "utf8"),
  hash = (b) => createHash("sha256").update(b).digest("hex"),
  scenes = japanSavingsScenes();
const articles = [
  "posts/japon-epargne-dette-mondiale",
  "posts-en/japan-savings-global-borrowing-costs",
].map((p) => read("src/content/" + p + ".mdx"));
const scene = (f, mobile = false, lang = "fr") =>
  japanSavingsSvg(lang, JAPAN_SAVINGS_KINDS[f - 1], mobile);
function mutate(svg, suffix, key, value) {
  const re = new RegExp(
    `(<(?:rect|line|path|circle|text)[^>]*id="[^"]*${suffix}"[^>]* ${key}=")([^"]*)(")`,
    "u",
  );
  assert.match(svg, re);
  return svg.replace(
    re,
    (_m, a, v, b) => a + (typeof value === "function" ? value(v) : value) + b,
  );
}

test("twenty reviewed passive scenes preserve all five bilingual figures and their quantitative encodings", () => {
  assert.deepEqual(JAPAN_SAVINGS_KINDS, [
    "flows",
    "sectors",
    "hedge",
    "duration",
    "transmission",
  ]);
  assert.equal(scenes.length, 20);
  for (const s of scenes) {
    assertJapanSavingsSourceFaithful(s.svg, s.lang, s.kind, s.mobile);
    assertJapanSavingsGeometry(s.svg);
    assertJapanSavingsQuantitative(s.svg, s.figure);
  }
  for (const lang of [undefined, null, {}, new String("fr"), "__proto__"])
    assert.throws(() => japanSavingsSvg(lang, "flows"));
  for (const kind of ["constructor", "__proto__", {}, null, undefined])
    assert.throws(() => japanSavingsSvg("fr", kind));
  for (const mobile of [0, 1, "false", null, {}])
    assert.throws(() => japanSavingsSvg("fr", "flows", mobile));
});

test("independent scales and cash-flow calculations reject altered bar lengths, baselines, signs and FX returns", () => {
  assert.ok(
    Math.abs(
      [
        -38.5, -64.9, -254.3, 40.2, -618.7, -638.4, -80.2, 17.9, -41.3, -10.6,
        -137.3, -288.6,
      ]
        .slice(3)
        .reduce((a, b) => a + b, 0) + 1757,
    ) < 1e-9,
  );
  assert.ok(
    Math.abs(
      [-11739.2, 11415.2, 2992.6, -2302.8, -1757, -1483.5, -1315.8].reduce(
        (a, b) => a + b,
        0,
      ) + 4190.5,
    ) < 1e-9,
  );
  assert.equal(105 * 147, 15435);
  assert.equal(105 * 148.5, 15592.5);
  assert.ok(Math.abs((15435 / 15000 - 1) * 100 - 2.9) < 1e-10);
  assert.ok(Math.abs((15592.5 / 15000 - 1) * 100 - 3.95) < 1e-10);
  for (const [f, id, key] of [
    [1, "bar-4", "height"],
    [1, "bar-8", "y"],
    [2, "bar-1", "width"],
    [2, "bar-0", "x"],
    [3, "point-147", "cy"],
  ])
    assert.throws(() =>
      assertJapanSavingsQuantitative(
        mutate(scene(f), id, key, (v) => Number(v) + 5),
        f,
      ),
    );
  assert.throws(() =>
    assertJapanSavingsQuantitative(
      scene(1).replace(
        'fill="var(--color-accent)"',
        'fill="var(--color-signal)"',
      ),
      1,
    ),
  );
  assert.throws(() =>
    assertJapanSavingsQuantitative(
      scene(4).replaceAll("L × Dₗ &gt; A × Dₐ", "L × Dₗ &lt; A × Dₐ"),
      4,
    ),
  );
  assert.throws(() =>
    assertJapanSavingsQuantitative(
      scene(3).replace('href="#source-s09"', 'href="#source-s08"'),
      3,
    ),
  );
});

test("visible allocation, hedge and balance-sheet arrows retain their direction and marker paint", () => {
  for (const mobile of [false, true])
    for (const f of [3, 4, 5]) {
      const svg = scene(f, mobile),
        suffix = f === 3 ? "flow-0" : f === 4 ? "rate-flow-0" : "allocation-0";
      assert.throws(() =>
        assertJapanSavingsQuantitative(
          mutate(svg, suffix, "stroke", "none"),
          f,
        ),
      );
      assert.throws(() =>
        assertJapanSavingsQuantitative(
          mutate(svg, suffix, "marker-end", "url(#missing)"),
          f,
        ),
      );
      assert.throws(() =>
        assertJapanSavingsQuantitative(
          svg.replace(
            "</svg>",
            `<rect x="0" y="0" width="${mobile ? 600 : 1000}" height="${mobile ? 930 : 790}" rx="0" fill="var(--color-ink)" stroke="var(--color-line-strong)" stroke-width="1.5"></rect></svg>`,
          ),
          f,
        ),
      );
    }
  assert.throws(() =>
    assertJapanSavingsQuantitative(mutate(scene(3), "flow-0", "x2", 100), 3),
  );
});

test("glyph coverage, internal panels, gutters and compact proportions fail closed", () => {
  assert.throws(() =>
    assertJapanSavingsGeometry(mutate(scene(3, true), "stage-0", "height", 30)),
  );
  assert.throws(
    () =>
      assertJapanSavingsGeometry(
        scene(3).replace('x="24" y="366"', 'x="24" y="340"'),
      ),
    /unrelated panel/u,
  );
  assert.throws(
    () =>
      assertJapanSavingsGeometry(
        scene(3).replace('y="465.235"', 'y="511.235"'),
      ),
    /data line/u,
  );
  assert.throws(() =>
    assertJapanSavingsGeometry(
      scene(4).replace('font-size="28"', 'font-size="18"'),
    ),
  );
  assert.throws(() =>
    assertJapanSavingsGeometry(
      scene(1).replace('x="24" y="92"', 'x="9999" y="92"'),
    ),
  );
  assert.throws(() =>
    assertJapanSavingsGeometry(scene(1, true).replace("600 930", "600 1300")),
  );
  assert.throws(() =>
    assertJapanSavingsGeometry(scene(1).replace("l0g / 01", "☃ / 01")),
  );
  assert.throws(() =>
    assertJapanSavingsSourceFaithful(
      scene(1).replace("22.10.2026", "23.10.2026"),
      "fr",
      "flows",
      false,
    ),
  );
});

test("passive SVG and complete bounded path grammar reject active markup, remote assets and malformed numbers", () => {
  const svg = scene(1);
  for (const extra of [
    "<script/>",
    "<foreignObject/>",
    '<image href="https://example.com/x"/>',
    "<animate/>",
  ])
    assert.throws(() =>
      inspectJapanSavingsSvg(svg.replace("</svg>", extra + "</svg>")),
    );
  for (const change of [
    (s) => s.replace("<svg ", '<svg onload="void(0)" '),
    (s) => s.replace("font-size=", "fontSize="),
    (s) => s.replace('href="#source-s01"', 'href="https://example.com"'),
    (s) => s.replace('font-family="l0g Japan Savings"', 'font-family="Arial"'),
    (s) =>
      s.replace('fill="var(--color-ink)"', 'fill="url(https://example.com/x)"'),
  ])
    assert.throws(() => inspectJapanSavingsSvg(change(svg)));
  assert.doesNotThrow(() => pathPoints("M 1 2 L 3 4 H 6 V 8 Z"));
  assert.doesNotThrow(() => pathPoints("M+1+2 L3.5.6 H6 V8 Z"));
  for (const d of [
    "M01000100",
    "M00010002",
    "M 1 2 L 3",
    "M 1 2 M 3 4",
    "M 1e3 2",
    "M NaN 2",
    "M 1 2 C 3 4 5 6 7 8",
    "M " + "9".repeat(10000) + " 2",
    "M 1 2 " + "L 3 4 ".repeat(1024),
  ])
    assert.throws(() => pathPoints(d));
});

test("semantic themes, licensed local font subsets and container sizing preserve readable in-page proportions", () => {
  const source = read("src/components/JapanSavingsFigure.astro"),
    css = postcss.parse(
      source.slice(
        source.indexOf("<style>") + 7,
        source.lastIndexOf("</style>"),
      ),
    ),
    decls = (n) =>
      Object.fromEntries(
        n.nodes.filter((n) => n.type === "decl").map((n) => [n.prop, n.value]),
      ),
    rule = (s) => {
      const n = css.nodes.find((n) => n.type === "rule" && n.selector === s);
      assert.ok(n);
      return decls(n);
    };
  assert.deepEqual(
    [
      rule(".japan-savings-figure")["max-width"],
      rule(".japan-savings-figure")["container-type"],
      rule(".japan-savings-figure")["padding-bottom"],
    ],
    ["44rem", "inline-size", "1rem"],
  );
  assert.deepEqual(
    [
      rule(".japan-savings-figure :global(svg)").width,
      rule(".japan-savings-figure :global(svg)").height,
      rule(".japan-savings-figure :global(svg)").overflow,
    ],
    ["100%", "auto", "visible"],
  );
  const gates = css.nodes.filter(
    (n) => n.type === "atrule" && n.name === "container",
  );
  assert.equal(gates.length, 1);
  assert.equal(gates[0].params, "(max-width: 480px)");
  assert.doesNotMatch(
    source,
    /overflow\s*:\s*(?:clip|hidden)|@media\s*\(max-width:|client:|<script|fetch\(/iu,
  );
  for (const [w, h] of [
    [400, "53cac4154e61bd43eddf8473159fdf3cae0d37c7b66c315aa3a123c178bd6f2f"],
    [700, "9968d955f1edcf34ddcbae2e3c948126166542f0439714f26729dfa71d45d5bf"],
  ]) {
    const b = readFileSync(
      new URL(
        `../public/fonts/japan-savings/dejavu-sans-${w}.ttf`,
        import.meta.url,
      ),
    );
    assert.equal(hash(b), h);
    assert.ok(b.length < 40000);
    assert.match(
      source,
      new RegExp(`/fonts/japan-savings/dejavu-sans-${w}\\.ttf`, "u"),
    );
  }
  const licence = read("public/fonts/japan-savings/LICENSE.txt");
  assert.equal(
    hash(licence),
    "dae4e11a7947cfc6ef2b36d90919b67ade1d168a2e21bfc0f456445eb8907f4b",
  );
  assertFontLicenseReferences(licence, "dejavu");
  assert.throws(() =>
    assertFontLicenseReferences(
      licence.replace(
        "https://dejavu-fonts.github.io/License.html",
        "https://dejavu-fonts.github.io.evil.example/License.html",
      ),
      "dejavu",
    ),
  );
});

test("both native articles contain five ordered figures, full methodology and 21 common bibliographic records", async () => {
  const walk = (n) => [n, ...(n.children ?? []).flatMap(walk)],
    sets = ["01 02 03", "02 03 05", "09", "13 14 15", "03 10 12 16 17 18"];
  for (const [i, a] of articles.entries()) {
    assertJapanSavingsArticleReferences(a);
    const body = a.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/u, ""),
      figs = walk(createProcessor().parse(body)).filter(
        (n) => n.name === "JapanSavingsFigure",
      );
    assert.equal(figs.length, 5);
    for (const [j, f] of figs.entries()) {
      const at = Object.fromEntries(
        f.attributes.map((a) => {
          assert.equal(a.type, "mdxJsxAttribute");
          assert.equal(typeof a.value, "string");
          return [a.name, a.value];
        }),
      );
      assert.equal(at.lang, i ? "en" : "fr");
      assert.equal(at.kind, JAPAN_SAVINGS_KINDS[j]);
      assert.equal(at.number, String(j + 1).padStart(2, "0"));
      assert.equal(at.sources, sets[j]);
      assert.ok(at.caption.length > 30);
      assert.equal(walk(f).filter((n) => n.name === "details").length, 1);
      assert.equal(walk(f).filter((n) => n.name === "summary").length, 1);
    }
    await compile(body, { format: "mdx" });
  }
});
