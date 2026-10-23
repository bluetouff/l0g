import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import { compile, createProcessor } from "@mdx-js/mdx";
import postcss from "postcss";
import { assertFontLicenseReferences } from "./font-license-assertions.mjs";
import {
  INSURANCE_ACQUISITIONS_KINDS,
  INSURANCE_ACQUISITIONS_SOURCES,
  insuranceAcquisitionsSvg,
} from "../src/lib/insuranceAcquisitionsFigures.mjs";
import {
  insuranceAcquisitionsScenes,
  inspectInsuranceAcquisitionsSvg,
  assertInsuranceAcquisitionsGeometry,
  assertInsuranceAcquisitionsQuantitative,
  assertInsuranceAcquisitionsSourceFaithful,
  assertInsuranceAcquisitionsArticleReferences,
  pathPoints,
} from "./insurance-acquisitions-svg-assertions.mjs";
const read = (p) => readFileSync(new URL("../" + p, import.meta.url), "utf8"),
  hash = (b) => createHash("sha256").update(b).digest("hex"),
  scenes = insuranceAcquisitionsScenes();
const scene = (figure, mobile = false, lang = "fr") =>
  insuranceAcquisitionsSvg(
    lang,
    INSURANCE_ACQUISITIONS_KINDS[figure - 1],
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
test("twenty controlled scenes retain five reviewed bilingual mechanisms and reject open inputs", () => {
  assert.deepEqual(INSURANCE_ACQUISITIONS_KINDS, [
    "acquisition",
    "mandates",
    "earnings",
    "fees",
    "blackstone",
  ]);
  assert.equal(scenes.length, 20);
  for (const s of scenes) {
    assertInsuranceAcquisitionsSourceFaithful(s.svg, s.lang, s.kind, s.mobile);
    assertInsuranceAcquisitionsGeometry(s.svg);
    assertInsuranceAcquisitionsQuantitative(s.svg, s.figure);
  }
  for (const lang of [undefined, null, {}, new String("fr"), "__proto__"])
    assert.throws(() => insuranceAcquisitionsSvg(lang, "acquisition"));
  for (const kind of ["constructor", "__proto__", {}, null, undefined])
    assert.throws(() => insuranceAcquisitionsSvg("fr", kind));
  for (const mobile of [0, 1, "false", null, {}])
    assert.throws(() => insuranceAcquisitionsSvg("fr", "acquisition", mobile));
});
test("acquisition fair values, common zero origins and the disclosed noncontrolling interest remain independently reproducible", () => {
  assert.equal(Math.round((2.525 + 1.111) * 1000), 3636);
  assert.equal(Math.round((56.327 + 18.839) * 1000), 75166);
  assert.equal(Math.round((61.473 + 9.65 + 4.043) * 1000), 75166);
  for (const mobile of [false, true])
    for (const id of [
      "asset-investments",
      "asset-other",
      "policyholders",
      "liabilities",
      "net-assets",
    ]) {
      const svg = scene(1, mobile);
      for (const key of ["x", "y", "width", "height"])
        assert.throws(() =>
          assertInsuranceAcquisitionsQuantitative(
            mutate(svg, id, key, (v) => Number(v) + 5),
            1,
          ),
        );
      assert.throws(() =>
        assertInsuranceAcquisitionsQuantitative(
          mutate(svg, id, "fill", "var(--color-ink)"),
          1,
        ),
      );
    }
  for (const value of ["75,166", "10,861", "0,713", "3,636"])
    assert.throws(() =>
      assertInsuranceAcquisitionsQuantitative(
        scene(1, true).replaceAll(value, "999"),
        1,
      ),
    );
});
test("KKR total earnings and ownership attribution use the same scale, with independently calculated changes", () => {
  assert.equal(Math.round((816.637 + 473.062) * 1000), 1289699);
  assert.equal(Math.round((1014.546 / 1289.699 - 1) * 1000) / 10, -21.3);
  assert.equal(Math.round((1014.546 / 816.637 - 1) * 1000) / 10, 24.2);
  for (const mobile of [false, true]) {
    const svg = scene(3, mobile);
    for (const id of ["kkr-0", "kkr-1", "minority"])
      for (const key of ["x", "height", "y"])
        assert.throws(() =>
          assertInsuranceAcquisitionsQuantitative(
            mutate(svg, id, key, (v) => Number(v) + 5),
            3,
          ),
        );
    for (const tick of [0, 400, 800, 1200])
      assert.throws(() =>
        assertInsuranceAcquisitionsQuantitative(
          mutate(svg, "tick-" + tick, "y1", (v) => Number(v) + 5),
          3,
        ),
      );
  }
  assert.throws(() =>
    assertInsuranceAcquisitionsQuantitative(
      scene(3).replaceAll("−21,3 %", "−20 %"),
      3,
    ),
  );
});
test("Corebridge expenses and the annual basis-point examples retain the three original bars and eligible-asset limits", () => {
  assert.equal((1_000_000_000 * 30) / 10_000, 3_000_000);
  assert.equal((1_000_000_000 * 45) / 10_000, 4_500_000);
  for (const mobile of [false, true]) {
    const svg = scene(5, mobile);
    for (const id of ["expense-0", "expense-1", "expense-2"])
      for (const key of ["x", "width", "height", "y"])
        assert.throws(() =>
          assertInsuranceAcquisitionsQuantitative(
            mutate(svg, id, key, (v) => Number(v) + 5),
            5,
          ),
        );
    assert.throws(() =>
      assertInsuranceAcquisitionsQuantitative(
        svg.replaceAll("minimum", "autre"),
        5,
      ),
    );
  }
});
test("mandate chronology, internal fee direction and reinvestment links remain visible and correctly directed", () => {
  for (const mobile of [false, true])
    for (const [figure, ids] of [
      [2, ["mandate-link-0", "mandate-link-1", "mandate-link-2"]],
      [4, ["fee-0", "fee-1"]],
      [5, ["reinvestment"]],
    ])
      for (const id of ids) {
        const svg = scene(figure, mobile);
        for (const [key, value] of [
          ["stroke", "none"],
          ["marker-end", "url(#missing)"],
        ])
          assert.throws(() =>
            assertInsuranceAcquisitionsQuantitative(
              mutate(svg, id, key, value),
              figure,
            ),
          );
        assert.throws(() =>
          assertInsuranceAcquisitionsQuantitative(
            svg.replace(
              "</svg>",
              `<rect x="0" y="0" width="${mobile ? 600 : 1000}" height="${mobile ? 936 : 790}" rx="0" fill="var(--color-ink)" stroke="var(--color-line-strong)" stroke-width="1.5"></rect></svg>`,
            ),
            figure,
          ),
        );
      }
  for (const d of ["01.01.2022", "01.02.2021", "02.01.2024", "02.05.2024"])
    assert.throws(() =>
      assertInsuranceAcquisitionsQuantitative(
        scene(2).replaceAll(d, "99.99.9999"),
        2,
      ),
    );
  assert.throws(() =>
    assertInsuranceAcquisitionsQuantitative(
      mutate(scene(4), "fee-0", "x2", 100),
      4,
    ),
  );
  assert.throws(() =>
    assertInsuranceAcquisitionsQuantitative(
      scene(2).replace('href="#source-s19"', 'href="#source-s18"'),
      2,
    ),
  );
});
test("the reviewed viewBoxes, panels, source gutters and licensed glyphs remain compact and unoccluded", () => {
  assert.throws(() =>
    assertInsuranceAcquisitionsGeometry(
      mutate(scene(3, true), "kkr-1", "width", 140),
    ),
  );
  assert.throws(() =>
    assertInsuranceAcquisitionsGeometry(
      mutate(scene(1), "sellers", "height", 40),
    ),
  );
  assert.throws(() =>
    assertInsuranceAcquisitionsGeometry(
      scene(1).replace('font-size="28"', 'font-size="18"'),
    ),
  );
  assert.throws(() =>
    assertInsuranceAcquisitionsGeometry(
      scene(1).replace('x="24" y="92"', 'x="9999" y="92"'),
    ),
  );
  assert.throws(() =>
    assertInsuranceAcquisitionsGeometry(
      scene(1, true).replace("600 936", "600 1300"),
    ),
  );
  assert.throws(() =>
    assertInsuranceAcquisitionsGeometry(scene(1).replace("l0g / 01", "☃ / 01")),
  );
  assert.throws(() =>
    assertInsuranceAcquisitionsSourceFaithful(
      scene(1).replace("23.10.2026", "24.10.2026"),
      "fr",
      "acquisition",
      false,
    ),
  );
});
test("passive XML and complete bounded path grammar reject active SVG, remote assets and malformed geometry", () => {
  const svg = scene(1);
  for (const extra of [
    "<script/>",
    "<foreignObject/>",
    '<image href="https://example.com/x"/>',
    "<animate/>",
  ])
    assert.throws(() =>
      inspectInsuranceAcquisitionsSvg(svg.replace("</svg>", extra + "</svg>")),
    );
  for (const change of [
    (s) => s.replace("<svg ", '<svg onload="void(0)" '),
    (s) => s.replace("font-size=", "fontSize="),
    (s) => s.replace('href="#source-s28"', 'href="https://example.com"'),
    (s) =>
      s.replace(
        'font-family="l0g Insurance Acquisitions"',
        'font-family="Arial"',
      ),
    (s) =>
      s.replace('fill="var(--color-ink)"', 'fill="url(https://example.com/x)"'),
  ])
    assert.throws(() => inspectInsuranceAcquisitionsSvg(change(svg)));
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
  const source = read("src/components/InsuranceAcquisitionsFigure.astro"),
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
      rule(".insurance-acquisitions-figure")["max-width"],
      rule(".insurance-acquisitions-figure")["container-type"],
      rule(".insurance-acquisitions-figure")["padding-bottom"],
    ],
    ["44rem", "inline-size", "1rem"],
  );
  assert.deepEqual(
    [
      rule(".insurance-acquisitions-figure :global(svg)").width,
      rule(".insurance-acquisitions-figure :global(svg)").height,
      rule(".insurance-acquisitions-figure :global(svg)").overflow,
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
test("bilingual articles contain five ordered figures, detailed methods and all forty-seven common source records", async () => {
  const walk = (n) => [n, ...(n.children ?? []).flatMap(walk)],
    articles = [
      "posts/assureurs-02-pourquoi-acheter-assureur",
      "posts-en/why-investment-firms-buy-insurers",
    ].map((p) => read("src/content/" + p + ".mdx"));
  for (const [i, a] of articles.entries()) {
    assertInsuranceAcquisitionsArticleReferences(a);
    const body = a.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/u, ""),
      figs = walk(createProcessor().parse(body)).filter(
        (n) => n.name === "InsuranceAcquisitionsFigure",
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
      assert.equal(at.kind, INSURANCE_ACQUISITIONS_KINDS[j]);
      assert.equal(at.number, String(j + 1).padStart(2, "0"));
      assert.equal(at.sources, INSURANCE_ACQUISITIONS_SOURCES[j]);
      assert.ok(at.caption.length > 20);
      assert.equal(walk(f).filter((n) => n.name === "details").length, 1);
      assert.equal(walk(f).filter((n) => n.name === "summary").length, 1);
    }
    await compile(body, { format: "mdx" });
  }
});
