import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import { compile, createProcessor } from "@mdx-js/mdx";
import postcss from "postcss";
import { assertFontLicenseReferences } from "./font-license-assertions.mjs";
import {
  INSURANCE_AFFILIATED_KINDS,
  INSURANCE_AFFILIATED_SOURCES,
  insuranceAffiliatedSvg,
} from "../src/lib/insuranceAffiliatedFigures.mjs";
import {
  insuranceAffiliatedScenes,
  inspectInsuranceAffiliatedSvg,
  assertInsuranceAffiliatedGeometry,
  assertInsuranceAffiliatedQuantitative,
  assertInsuranceAffiliatedSourceFaithful,
  assertInsuranceAffiliatedArticleReferences,
  pathPoints,
} from "./insurance-affiliated-svg-assertions.mjs";
const read = (p) => readFileSync(new URL("../" + p, import.meta.url), "utf8"),
  hash = (b) => createHash("sha256").update(b).digest("hex"),
  scenes = insuranceAffiliatedScenes();
const scene = (figure, mobile = false, lang = "fr") =>
  insuranceAffiliatedSvg(lang, INSURANCE_AFFILIATED_KINDS[figure - 1], mobile);
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

test("twenty closed scenes preserve all five reviewed bilingual mechanisms", () => {
  assert.deepEqual(INSURANCE_AFFILIATED_KINDS, [
    "exposures",
    "transfers",
    "loan",
    "holding",
    "sector",
  ]);
  assert.equal(scenes.length, 20);
  for (const s of scenes) {
    assertInsuranceAffiliatedSourceFaithful(s.svg, s.lang, s.kind, s.mobile);
    assertInsuranceAffiliatedGeometry(s.svg);
    assertInsuranceAffiliatedQuantitative(s.svg, s.figure);
  }
  for (const lang of [undefined, null, {}, new String("fr"), "__proto__"])
    assert.throws(() => insuranceAffiliatedSvg(lang, "holding"));
  for (const kind of ["constructor", "__proto__", {}, null, undefined])
    assert.throws(() => insuranceAffiliatedSvg("fr", kind));
  for (const mobile of [0, 1, "false", null, {}])
    assert.throws(() => insuranceAffiliatedSvg("fr", "holding", mobile));
});
test("net asset composition uses a shared zero scale, correct denominator and distinct GAAP scope", () => {
  assert.equal(24778 + 8468 + 7061 + 3718, 44025);
  assert.equal(Math.round((44025 / 314090) * 1000) / 10, 14);
  for (const mobile of [false, true]) {
    const svg = scene(1, mobile);
    for (let i = 0; i < 4; i++)
      for (const key of ["x", "y", "width", "height"])
        assert.throws(() =>
          assertInsuranceAffiliatedQuantitative(
            mutate(svg, "share-" + i, key, (v) => Number(v) + 5),
            1,
          ),
        );
    for (const id of ["track-0", "track-1", "track-2", "track-3"])
      assert.throws(() =>
        assertInsuranceAffiliatedQuantitative(
          mutate(svg, id, "width", (v) => Number(v) - 50),
          1,
        ),
      );
    for (const value of [
      "314 090",
      "44 025",
      "24 778",
      "8 468",
      "7 061",
      "3 718",
      "70 616",
      "14,0",
    ])
      assert.throws(() =>
        assertInsuranceAffiliatedQuantitative(svg.replaceAll(value, "999"), 1),
      );
  }
});
test("sales, consideration, contributions and loan cash flows retain direction, identity and visibility", () => {
  for (const mobile of [false, true])
    for (const [figure, ids] of [
      [2, ["sale", "consideration", "contribution"]],
      [3, ["principal", "interest"]],
      [4, ["parent-loan"]],
    ])
      for (const id of ids) {
        const svg = scene(figure, mobile);
        for (const [key, value] of [
          ["stroke", "none"],
          ["marker-end", "url(#missing)"],
        ])
          assert.throws(() =>
            assertInsuranceAffiliatedQuantitative(
              mutate(svg, id, key, value),
              figure,
            ),
          );
        assert.throws(() =>
          assertInsuranceAffiliatedQuantitative(
            mutate(svg, id, "d", "M 10 10 H 10"),
            figure,
          ),
        );
        assert.throws(() =>
          assertInsuranceAffiliatedQuantitative(
            svg.replace(
              "</svg>",
              `<rect x="0" y="0" width="${mobile ? 600 : 1000}" height="930" rx="0" fill="var(--color-ink)" stroke="var(--color-line-strong)" stroke-width="1.5"></rect></svg>`,
            ),
            figure,
          ),
        );
      }
  assert.throws(() =>
    assertInsuranceAffiliatedQuantitative(
      mutate(scene(2), "consideration", "stroke-dasharray", "1 1"),
      2,
    ),
  );
  for (const value of ["555", "353", "908", "247", "2024", "2026"])
    assert.throws(() =>
      assertInsuranceAffiliatedQuantitative(
        scene(2).replaceAll(value, "999"),
        2,
      ),
    );
});
test("the loan timeline retains equal five-year intervals and ANGI remains inside the BWS scope", () => {
  for (const mobile of [false, true]) {
    const svg = scene(3, mobile);
    for (let i = 0; i < 3; i++)
      assert.throws(() =>
        assertInsuranceAffiliatedQuantitative(
          mutate(svg, "date-" + i, "x1", (v) => Number(v) + 5),
          3,
        ),
      );
    assert.throws(() =>
      assertInsuranceAffiliatedQuantitative(mutate(svg, "angi", "x", 1200), 3),
    );
    for (const value of ["450", "6,33", "2031", "2036", "4,1", "3,8"])
      assert.throws(() =>
        assertInsuranceAffiliatedQuantitative(svg.replaceAll(value, "999"), 3),
      );
  }
});
test("holding capacity, drawn balance and reverse facility remain distinct from related-party investments", () => {
  assert.equal(500 - 279, 221);
  for (const mobile of [false, true]) {
    const svg = scene(4, mobile);
    for (const key of ["x", "y", "width", "height"])
      assert.throws(() =>
        assertInsuranceAffiliatedQuantitative(
          mutate(svg, "drawn", key, (v) => Number(v) + 5),
          4,
        ),
      );
    assert.throws(() =>
      assertInsuranceAffiliatedQuantitative(
        mutate(svg, "capacity", "width", 450),
        4,
      ),
    );
    for (const value of [
      "279",
      "221",
      "500",
      "13.12.2028",
      "44 025",
      "AHL → AGM : non garanti",
      "221 non utilisés",
    ])
      assert.throws(() =>
        assertInsuranceAffiliatedQuantitative(svg.replaceAll(value, "999"), 4),
      );
  }
});
test("NAIC shares preserve the four-schedule reporting scope, rounded complement and table discrepancy", () => {
  assert.equal(100 - 28, 72);
  for (const mobile of [false, true]) {
    const svg = scene(5, mobile);
    for (const id of ["credit-share", "other-share"])
      for (const key of ["x", "width"])
        assert.throws(() =>
          assertInsuranceAffiliatedQuantitative(
            mutate(svg, id, key, (v) => Number(v) + 5),
            5,
          ),
        );
    for (const value of [
      "321",
      "322",
      "28",
      "72",
      "2025",
      "D · 1 · 1",
      "D · 1 · 2",
      "BA",
      "DA",
    ])
      assert.throws(() =>
        assertInsuranceAffiliatedQuantitative(svg.replaceAll(value, "999"), 5),
      );
  }
});
test("glyphs, panels, viewBoxes and nested reporting scopes remain bounded without text collisions", () => {
  assert.throws(() =>
    assertInsuranceAffiliatedGeometry(
      mutate(scene(3, true), "angi", "height", 40),
    ),
  );
  assert.throws(() =>
    assertInsuranceAffiliatedGeometry(
      scene(1).replace('font-size="28"', 'font-size="18"'),
    ),
  );
  assert.throws(() =>
    assertInsuranceAffiliatedGeometry(
      scene(1).replace('x="24" y="92"', 'x="9999" y="92"'),
    ),
  );
  assert.throws(() =>
    assertInsuranceAffiliatedGeometry(
      scene(4, true).replace("600 930", "600 1300"),
    ),
  );
  assert.throws(() =>
    assertInsuranceAffiliatedGeometry(
      mutate(scene(2), "sale", "d", "M 24 36 H 976"),
    ),
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
      s.replace(
        'font-family="l0g Insurance Affiliated"',
        'font-family="Arial"',
      ),
    (s) =>
      s.replace('fill="var(--color-ink)"', 'fill="url(https://example.com/x)"'),
  ])
    assert.throws(() => inspectInsuranceAffiliatedSvg(change(svg)));
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
  const source = read("src/components/InsuranceAffiliatedFigure.astro"),
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
      rule(".insurance-affiliated-figure")["max-width"],
      rule(".insurance-affiliated-figure")["container-type"],
      rule(".insurance-affiliated-figure")["padding-bottom"],
    ],
    ["44rem", "inline-size", "1rem"],
  );
  assert.deepEqual(
    [
      rule(".insurance-affiliated-figure :global(svg)").width,
      rule(".insurance-affiliated-figure :global(svg)").height,
      rule(".insurance-affiliated-figure :global(svg)").overflow,
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
test("bilingual articles contain five ordered figures, detailed methods and all twenty-seven common source records", async () => {
  const walk = (n) => [n, ...(n.children ?? []).flatMap(walk)],
    articles = [
      "posts/assureurs-placements-apparentes-apollo-brookfield-kkr",
      "posts-en/insurers-affiliated-investments-apollo-brookfield-kkr",
    ].map((p) => read("src/content/" + p + ".mdx"));
  for (const [i, a] of articles.entries()) {
    assertInsuranceAffiliatedArticleReferences(a);
    const body = a.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/u, ""),
      figs = walk(createProcessor().parse(body)).filter(
        (n) => n.name === "InsuranceAffiliatedFigure",
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
      assert.equal(at.kind, INSURANCE_AFFILIATED_KINDS[j]);
      assert.equal(at.number, String(j + 1).padStart(2, "0"));
      assert.equal(at.sources, INSURANCE_AFFILIATED_SOURCES[j]);
      assert.ok(at.caption.length > 20);
      assert.equal(walk(f).filter((n) => n.name === "details").length, 1);
      assert.equal(walk(f).filter((n) => n.name === "summary").length, 1);
    }
    await compile(body, { format: "mdx" });
  }
});
