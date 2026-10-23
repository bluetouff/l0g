import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import { compile, createProcessor } from "@mdx-js/mdx";
import postcss from "postcss";
import { assertFontLicenseReferences } from "./font-license-assertions.mjs";
import {
  INSURANCE_RETURNS_KINDS,
  INSURANCE_RETURNS_SOURCES,
  insuranceReturnsSvg,
} from "../src/lib/insuranceReturnsFigures.mjs";
import {
  insuranceReturnsScenes,
  inspectInsuranceReturnsSvg,
  assertInsuranceReturnsGeometry,
  assertInsuranceReturnsQuantitative,
  assertInsuranceReturnsSourceFaithful,
  assertInsuranceReturnsArticleReferences,
  pathPoints,
} from "./insurance-returns-svg-assertions.mjs";
const read = (p) => readFileSync(new URL("../" + p, import.meta.url), "utf8"),
  hash = (b) => createHash("sha256").update(b).digest("hex"),
  scenes = insuranceReturnsScenes();
const scene = (figure, mobile = false, lang = "fr") =>
  insuranceReturnsSvg(lang, INSURANCE_RETURNS_KINDS[figure - 1], mobile);
function mutate(svg, suffix, key, value) {
  const re = new RegExp(
    `(<(?:rect|line|path|text)[^>]*id="[^"]*${suffix}"[^>]* ${key}=")([^"]*)(")`,
    "u",
  );
  assert.match(svg, re);
  return svg.replace(
    re,
    (_m, a, v, b) => a + (typeof value === "function" ? value(v) : value) + b,
  );
}

test("sixteen closed scenes retain four complete reviewed bilingual mechanisms", () => {
  assert.deepEqual(INSURANCE_RETURNS_KINDS, [
    "contracts",
    "liquidity",
    "athene",
    "kkr",
  ]);
  assert.equal(scenes.length, 16);
  for (const s of scenes) {
    assertInsuranceReturnsSourceFaithful(s.svg, s.lang, s.kind, s.mobile);
    assertInsuranceReturnsGeometry(s.svg);
    assertInsuranceReturnsQuantitative(s.svg, s.figure);
  }
  for (const lang of [undefined, null, {}, new String("fr"), "__proto__"])
    assert.throws(() => insuranceReturnsSvg(lang, "kkr"));
  for (const kind of ["constructor", "__proto__", {}, null, undefined])
    assert.throws(() => insuranceReturnsSvg("fr", kind));
  for (const mobile of [0, 1, "false", null, {}])
    assert.throws(() => insuranceReturnsSvg("fr", "kkr", mobile));
});
test("product principal, interest and charge bars keep zero origins, common scales and date-specific assumptions", () => {
  assert.ok(Math.abs(150000 * 1.0605 ** 5 - 201207.7123417247) < 1e-7);
  assert.ok(Math.abs(150000 * 1.06 ** 5 - 200733.83664) < 1e-7);
  assert.equal(
    Math.round((150000 * 1.0605 ** 5 - 150000 * 1.06 ** 5) * 100) / 100,
    473.88,
  );
  for (const m of [false, true])
    for (const [f, ids] of [
      [1, ["capital-0", "capital-1", "interest-0", "interest-1"]],
      [
        2,
        Array.from({ length: 5 }, (_, i) => [
          "charge-0-" + i,
          "charge-1-" + i,
        ]).flat(),
      ],
    ])
      for (const id of ids)
        for (const key of ["x", "y", "width", "height", "fill"])
          assert.throws(() =>
            assertInsuranceReturnsQuantitative(
              mutate(scene(f, m), id, key, (v) =>
                key === "fill" ? "none" : Number(v) + 5,
              ),
              f,
            ),
          );
  for (const v of ["6,05", "6,00", "473,88", "14.10.2026", "12.10.2026"])
    assert.throws(() =>
      assertInsuranceReturnsQuantitative(scene(1).replaceAll(v, "999"), 1),
    );
  assert.throws(() =>
    assertInsuranceReturnsQuantitative(
      scene(1).replaceAll(
        "Hypothèse : capitalisation annuelle",
        "Convention garantie",
      ),
      1,
    ),
  );
  assert.throws(() =>
    assertInsuranceReturnsQuantitative(
      scene(2).replaceAll(
        "base initiale distincte non précisée",
        "base contractuelle garantie",
      ),
      2,
    ),
  );
  for (const [key, value] of [
    ["x1", 318],
    ["x2", 210],
    ["stroke", "none"],
    ["marker-end", "url(#missing)"],
  ])
    assert.throws(() =>
      assertInsuranceReturnsQuantitative(
        mutate(scene(2), "mva", key, value),
        2,
      ),
    );
});
test("Athene waterfall retains additions, floating deductions, subtotals and the economic ACRA scope", () => {
  assert.equal(7795 + 73 - 5749 - 229 - 294, 1596);
  for (const m of [false, true])
    for (let i = 0; i < 7; i++)
      for (const key of ["x", "y", "width", "height", "fill"])
        assert.throws(() =>
          assertInsuranceReturnsQuantitative(
            mutate(scene(3, m), "waterfall-" + i, key, (v) =>
              key === "fill" ? "none" : Number(v) + 5,
            ),
            3,
          ),
        );
  for (const v of ["5,14", "5,16", "3,57", "3,80", "1 624"])
    assert.throws(() =>
      assertInsuranceReturnsQuantitative(scene(3).replaceAll(v, "999"), 3),
    );
  for (const v of ["quote-part économique", "aucune seconde déduction", "785"])
    assert.throws(() =>
      assertInsuranceReturnsQuantitative(scene(3).replaceAll(v, "ailleurs"), 3),
    );
});
test("KKR components and management-fee netting preserve exact thousands-to-millions conversion and scope", () => {
  assert.equal(548550 + 289460 + 125578 + 33817, 997405);
  assert.equal(350860 - 61400, 289460);
  for (const m of [false, true])
    for (let i = 0; i < 4; i++)
      for (const key of ["x", "y", "width", "height", "fill"])
        assert.throws(() =>
          assertInsuranceReturnsQuantitative(
            mutate(scene(4, m), "contribution-" + i, key, (v) =>
              key === "fill" ? "none" : Number(v) + 5,
            ),
            4,
          ),
        );
  for (const v of [
    "997,405",
    "548,550",
    "289,460",
    "125,578",
    "33,817",
    "350,860",
    "61,400",
    "rémunération en actions",
    "avant allocation",
    "milliers",
  ])
    assert.throws(() =>
      assertInsuranceReturnsQuantitative(scene(4).replaceAll(v, "999"), 4),
    );
});
test("native glyph geometry rejects undersized text, overflow, overlap and misleading panel or figure proportions", () => {
  assert.throws(() =>
    assertInsuranceReturnsGeometry(
      scene(1).replace('font-size="28"', 'font-size="18"'),
    ),
  );
  assert.throws(() =>
    assertInsuranceReturnsGeometry(
      scene(1).replace('x="24" y="94"', 'x="9999" y="94"'),
    ),
  );
  assert.throws(() =>
    assertInsuranceReturnsGeometry(
      scene(3, true).replace("600 930", "600 1300"),
    ),
  );
  assert.throws(() =>
    assertInsuranceReturnsGeometry(
      scene(1).replace('x="24" y="378"', 'x="24" y="145"'),
    ),
  );
  assert.throws(() =>
    assertInsuranceReturnsGeometry(mutate(scene(1), "product-0", "height", 30)),
  );
});
test("passive XML and bounded path grammar reject active markup, external data and incompletely consumed paths", () => {
  const svg = scene(1);
  for (const change of [
    (s) => s.replace("</svg>", "<script>alert(1)</script></svg>"),
    (s) => s.replace("<svg ", '<svg onload="alert(1)" '),
    (s) => '<!DOCTYPE svg [<!ENTITY x SYSTEM "file:///etc/passwd">]>' + s,
    (s) => s.replace("</svg>", "<foreignObject></foreignObject></svg>"),
    (s) =>
      s.replace('font-family="l0g Insurance Returns"', 'font-family="Arial"'),
    (s) =>
      s.replace('fill="var(--color-ink)"', 'fill="url(https://example.com/x)"'),
  ])
    assert.throws(() => inspectInsuranceReturnsSvg(change(svg)));
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
test("one container breakpoint, semantic themes and the existing licensed local fonts retain natural in-page sizing", () => {
  const source = read("src/components/InsuranceReturnsFigure.astro"),
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
      rule(".insurance-returns-figure")["max-width"],
      rule(".insurance-returns-figure")["container-type"],
      rule(".insurance-returns-figure")["padding-bottom"],
    ],
    ["44rem", "inline-size", "1rem"],
  );
  assert.deepEqual(
    [
      rule(".insurance-returns-figure :global(svg)").width,
      rule(".insurance-returns-figure :global(svg)").height,
      rule(".insurance-returns-figure :global(svg)").overflow,
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
    [400, "98f2d74db16bb5f41f74adf6d899aeec92861682cccc58bfdbe4d9d7d0a5ae11"],
    [700, "21a0350a4ac2a9f22b6a7a8dcaf6abb08c8b546d06499301f1fcf10996fd0df5"],
  ]) {
    assert.equal(
      hash(
        readFileSync(
          new URL(
            `../public/fonts/stablecoins/dejavu-sans-${w}.ttf`,
            import.meta.url,
          ),
        ),
      ),
      h,
    );
    assert.match(
      source,
      new RegExp(`/fonts/stablecoins/dejavu-sans-${w}\\.ttf`, "u"),
    );
  }
  const licence = read("public/fonts/stablecoins/LICENSE.txt");
  assert.equal(
    hash(licence),
    "185add2050d6a40596a9a6aa46026e3cf0bd4bfff21ab18acd9cc8eebe18182f",
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
test("bilingual articles contain four ordered figures, detailed methods and all twenty-nine common source records", async () => {
  const walk = (n) => [n, ...(n.children ?? []).flatMap(walk)],
    articles = [
      "posts/assureurs-fonds-05-partage-rendement",
      "posts-en/insurers-asset-managers-05-sharing-returns",
    ].map((p) => read("src/content/" + p + ".mdx"));
  for (const [i, a] of articles.entries()) {
    assertInsuranceReturnsArticleReferences(a);
    const body = a.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/u, ""),
      figs = walk(createProcessor().parse(body)).filter(
        (n) => n.name === "InsuranceReturnsFigure",
      );
    assert.equal(figs.length, 4);
    for (const [j, f] of figs.entries()) {
      const at = Object.fromEntries(
        f.attributes.map((a) => {
          assert.equal(a.type, "mdxJsxAttribute");
          assert.equal(typeof a.value, "string");
          return [a.name, a.value];
        }),
      );
      assert.equal(at.lang, i ? "en" : "fr");
      assert.equal(at.kind, INSURANCE_RETURNS_KINDS[j]);
      assert.equal(at.number, String(j + 1).padStart(2, "0"));
      assert.equal(at.sources, INSURANCE_RETURNS_SOURCES[j]);
      assert.ok(at.caption.length > 20);
      assert.equal(walk(f).filter((n) => n.name === "details").length, 1);
      assert.equal(walk(f).filter((n) => n.name === "summary").length, 1);
    }
    await compile(body, { format: "mdx" });
  }
});
