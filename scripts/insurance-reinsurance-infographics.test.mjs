import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import { compile, createProcessor } from "@mdx-js/mdx";
import postcss from "postcss";
import { assertFontLicenseReferences } from "./font-license-assertions.mjs";
import {
  INSURANCE_REINSURANCE_KINDS,
  INSURANCE_REINSURANCE_SOURCES,
  insuranceReinsuranceSvg,
} from "../src/lib/insuranceReinsuranceFigures.mjs";
import {
  insuranceReinsuranceScenes,
  inspectInsuranceReinsuranceSvg,
  assertInsuranceReinsuranceGeometry,
  assertInsuranceReinsuranceQuantitative,
  assertInsuranceReinsuranceSourceFaithful,
  assertInsuranceReinsuranceArticleReferences,
  pathPoints,
} from "./insurance-reinsurance-svg-assertions.mjs";
const read = (p) => readFileSync(new URL("../" + p, import.meta.url), "utf8"),
  hash = (b) => createHash("sha256").update(b).digest("hex"),
  scenes = insuranceReinsuranceScenes();
const scene = (figure, mobile = false, lang = "fr") =>
  insuranceReinsuranceSvg(
    lang,
    INSURANCE_REINSURANCE_KINDS[figure - 1],
    mobile,
  );
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

test("twenty closed scenes preserve the five reviewed bilingual contract mechanisms", () => {
  assert.deepEqual(INSURANCE_REINSURANCE_KINDS, [
    "responsibilities",
    "funds",
    "collateral",
    "triggers",
    "market",
  ]);
  assert.equal(scenes.length, 20);
  for (const s of scenes) {
    assertInsuranceReinsuranceSourceFaithful(s.svg, s.lang, s.kind, s.mobile);
    assertInsuranceReinsuranceGeometry(s.svg);
    assertInsuranceReinsuranceQuantitative(s.svg, s.figure);
  }
  for (const lang of [undefined, null, {}, new String("fr"), "__proto__"])
    assert.throws(() => insuranceReinsuranceSvg(lang, "funds"));
  for (const kind of ["constructor", "__proto__", {}, null, undefined])
    assert.throws(() => insuranceReinsuranceSvg("fr", kind));
  for (const mobile of [0, 1, "false", null, {}])
    assert.throws(() => insuranceReinsuranceSvg("fr", "funds", mobile));
});
test("BMA counts and reserve balances independently reproduce the original percentages and rounded total", () => {
  assert.equal(154 + 65 + 46 + 326 + 66, 657);
  assert.equal(154 + 65, 219);
  assert.equal(Math.round((250.6 + 179.2) * 10), 4298);
  assert.equal(Math.round((250.6 + 179.2 + 59.6 + 55.6 + 56.4) * 10), 6014);
  assert.notEqual(601.4, 601.3);
  assert.deepEqual(
    [219 / 657, 429.8 / 601.3, 326 / 657, 55.6 / 601.3].map(
      (v) => Math.round(v * 1000) / 10,
    ),
    [33.3, 71.5, 49.6, 9.2],
  );
  for (const mobile of [false, true]) {
    const svg = scene(5, mobile);
    for (let i = 0; i < 4; i++)
      for (const key of ["x", "y", "width", "height"])
        assert.throws(() =>
          assertInsuranceReinsuranceQuantitative(
            mutate(svg, "share-" + i, key, (v) => Number(v) + 5),
            5,
          ),
        );
    for (const id of ["track-0", "track-1", "track-2", "track-3"])
      assert.throws(() =>
        assertInsuranceReinsuranceQuantitative(
          mutate(svg, id, "width", (v) => Number(v) - 50),
          5,
        ),
      );
    for (const tick of [0, 50, 100])
      assert.throws(() =>
        assertInsuranceReinsuranceQuantitative(
          mutate(svg, "tick-" + tick, "x1", (v) => Number(v) + 5),
          5,
        ),
      );
    for (const value of ["657", "601,3", "33,3", "71,5", "49,6", "9,2"])
      assert.throws(() =>
        assertInsuranceReinsuranceQuantitative(svg.replaceAll(value, "999"), 5),
      );
  }
});
test("all contractual routes remain visible, correctly directed, referenced and distinct from quantitative bars", () => {
  for (const mobile of [false, true])
    for (const [figure, ids] of [
      [
        1,
        [
          "benefits",
          "ownership",
          "reinsurance",
          "management",
          "consent",
          "retrocession",
        ],
      ],
      [2, ["withdrawals", "economic", "settlement-right", "settlement-left"]],
    ])
      for (const id of ids) {
        const svg = scene(figure, mobile);
        for (const [key, value] of [
          ["stroke", "none"],
          ["marker-end", "url(#missing)"],
        ])
          assert.throws(() =>
            assertInsuranceReinsuranceQuantitative(
              mutate(svg, id, key, value),
              figure,
            ),
          );
        assert.throws(() =>
          assertInsuranceReinsuranceQuantitative(
            svg.replace(
              "</svg>",
              `<rect x="0" y="0" width="${mobile ? 600 : 1000}" height="${mobile ? 930 : 790}" rx="0" fill="var(--color-ink)" stroke="var(--color-line-strong)" stroke-width="1.5"></rect></svg>`,
            ),
            figure,
          ),
        );
      }
  assert.throws(() =>
    assertInsuranceReinsuranceQuantitative(
      scene(1).replace('href="#source-s25"', 'href="#source-s24"'),
      1,
    ),
  );
  assert.throws(() =>
    assertInsuranceReinsuranceQuantitative(
      mutate(scene(2), "economic", "stroke-dasharray", "1 1"),
      2,
    ),
  );
  assert.throws(() =>
    assertInsuranceReinsuranceQuantitative(
      mutate(scene(1), "benefits", "d", "M 254 246 H 350"),
      1,
    ),
  );
});
test("collateral claims retain equal cards and contractual thresholds retain conditions and separate definitions", () => {
  for (const mobile of [false, true]) {
    const third = scene(3, mobile),
      fourth = scene(4, mobile);
    for (const value of ["57 M$", "1,1 Md$", "30.06.2026", "statutaire"])
      assert.throws(() =>
        assertInsuranceReinsuranceQuantitative(
          third.replaceAll(value, "999"),
          3,
        ),
      );
    assert.throws(() =>
      assertInsuranceReinsuranceQuantitative(
        mutate(third, "collateral-1", "height", (v) => Number(v) + 5),
        3,
      ),
    );
    for (const value of [
      "135",
      "120",
      "250",
      "200",
      "2020",
      "trimestre suivant",
      "5–30",
    ])
      assert.throws(() =>
        assertInsuranceReinsuranceQuantitative(
          fourth.replaceAll(value, "999"),
          4,
        ),
      );
    assert.throws(() =>
      assertInsuranceReinsuranceQuantitative(
        fourth.replaceAll("dénominateurs distincts", "définition commune"),
        4,
      ),
    );
    assert.throws(() =>
      assertInsuranceReinsuranceQuantitative(
        fourth
          .replaceAll("135", "TEMP")
          .replaceAll("250", "135")
          .replaceAll("TEMP", "250"),
        4,
      ),
    );
    assert.throws(() =>
      assertInsuranceReinsuranceQuantitative(
        fourth
          .replaceAll("120", "TEMP")
          .replaceAll("200", "120")
          .replaceAll("TEMP", "200"),
        4,
      ),
    );
  }
});
test("reviewed panels, local glyphs, viewBoxes and text gutters remain bounded and unoccluded", () => {
  assert.throws(() =>
    assertInsuranceReinsuranceGeometry(
      mutate(scene(3, true), "collateral-0", "height", 40),
    ),
  );
  assert.throws(() =>
    assertInsuranceReinsuranceGeometry(
      scene(1).replace('font-size="28"', 'font-size="18"'),
    ),
  );
  assert.throws(() =>
    assertInsuranceReinsuranceGeometry(
      scene(1).replace('x="24" y="92"', 'x="9999" y="92"'),
    ),
  );
  assert.throws(() =>
    assertInsuranceReinsuranceGeometry(
      scene(4, true).replace("600 930", "600 1300"),
    ),
  );
  assert.throws(() =>
    assertInsuranceReinsuranceGeometry(
      mutate(scene(1), "management", "d", "M 24 36 H 976"),
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
        'font-family="l0g Insurance Reinsurance"',
        'font-family="Arial"',
      ),
    (s) =>
      s.replace('fill="var(--color-ink)"', 'fill="url(https://example.com/x)"'),
  ])
    assert.throws(() => inspectInsuranceReinsuranceSvg(change(svg)));
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
  const source = read("src/components/InsuranceReinsuranceFigure.astro"),
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
      rule(".insurance-reinsurance-figure")["max-width"],
      rule(".insurance-reinsurance-figure")["container-type"],
      rule(".insurance-reinsurance-figure")["padding-bottom"],
    ],
    ["44rem", "inline-size", "1rem"],
  );
  assert.deepEqual(
    [
      rule(".insurance-reinsurance-figure :global(svg)").width,
      rule(".insurance-reinsurance-figure :global(svg)").height,
      rule(".insurance-reinsurance-figure :global(svg)").overflow,
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
test("bilingual articles contain five ordered figures, detailed methods and all thirty-one common source records", async () => {
  const walk = (n) => [n, ...(n.children ?? []).flatMap(walk)],
    articles = [
      "posts/assureurs-03-bermudes-reassurance-jackson-athene",
      "posts-en/bermuda-reinsurance-jackson-athene",
    ].map((p) => read("src/content/" + p + ".mdx"));
  for (const [i, a] of articles.entries()) {
    assertInsuranceReinsuranceArticleReferences(a);
    const body = a.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/u, ""),
      figs = walk(createProcessor().parse(body)).filter(
        (n) => n.name === "InsuranceReinsuranceFigure",
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
      assert.equal(at.kind, INSURANCE_REINSURANCE_KINDS[j]);
      assert.equal(at.number, String(j + 1).padStart(2, "0"));
      assert.equal(at.sources, INSURANCE_REINSURANCE_SOURCES[j]);
      assert.ok(at.caption.length > 20);
      assert.equal(walk(f).filter((n) => n.name === "details").length, 1);
      assert.equal(walk(f).filter((n) => n.name === "summary").length, 1);
    }
    await compile(body, { format: "mdx" });
  }
});
