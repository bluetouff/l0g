import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import test from "node:test";
import postcss from "postcss";
import { createProcessor, compile } from "@mdx-js/mdx";
import { assertFontLicenseReferences } from "./font-license-assertions.mjs";
import {
  INSURANCE_RISK_KINDS,
  INSURANCE_RISK_SOURCES,
  insuranceRiskSvg,
} from "../src/lib/insuranceRiskFigures.mjs";
import {
  insuranceRiskScenes,
  inspectInsuranceRiskSvg,
  assertInsuranceRiskGeometry,
  assertInsuranceRiskQuantitative,
  assertInsuranceRiskSourceFaithful,
  assertInsuranceRiskArticleReferences,
} from "./insurance-risk-svg-assertions.mjs";
const read = (p) => readFileSync(new URL("../" + p, import.meta.url), "utf8"),
  hash = (s) => createHash("sha256").update(s).digest("hex");
const scene = (f, m = false, l = "fr") =>
  insuranceRiskSvg(l, INSURANCE_RISK_KINDS[f - 1], m);
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
test("sixteen bilingual scenes retain the reviewed mechanisms with passive XML and native licensed glyph geometry", () => {
  assert.equal(insuranceRiskScenes().length, 16);
  for (const s of insuranceRiskScenes())
    assertInsuranceRiskSourceFaithful(s.svg, s.lang, s.kind, s.mobile);
  for (const lang of [undefined, null, {}, new String("fr"), "__proto__"])
    assert.throws(() => insuranceRiskSvg(lang, "clo"));
  for (const kind of ["constructor", "__proto__", {}, null, undefined])
    assert.throws(() => insuranceRiskSvg("fr", kind));
  for (const mobile of [0, 1, "false", null, {}])
    assert.throws(() => insuranceRiskSvg("fr", "clo", mobile));
});
test("PRA ranges keep zero-to-160 scale, uncertain endpoints, average proposal point and CDA balance-sheet arrows", () => {
  for (const m of [false, true])
    for (const id of ["range-0", "range-1", "low-0", "high-1", "point"])
      for (const key of id.startsWith("low") || id.startsWith("high")
        ? ["x1", "y2"]
        : ["x", "y", "width", "height", "fill"])
        assert.throws(() =>
          assertInsuranceRiskQuantitative(
            mutate(scene(1, m), id, key, (v) =>
              key === "fill" ? "none" : Number(v) + 5,
            ),
            1,
          ),
        );
  assert.throws(() =>
    assertInsuranceRiskQuantitative(scene(1).replaceAll("160", "180"), 1),
  );
  assert.throws(() =>
    assertInsuranceRiskQuantitative(
      scene(1).replaceAll("passif inchangé", "passif transformé"),
      1,
    ),
  );
  assert.throws(() =>
    assertInsuranceRiskQuantitative(
      mutate(scene(1), "effect-arrow-1", "marker-end", "url(#missing)"),
      1,
    ),
  );
});
test("three conditional notches, worst permitted collateral and financial-spread chain cannot lose their qualifications", () => {
  for (const m of [false, true])
    for (const word of [
      "pire portefeuille permis",
      "IFS + 0 à 3 crans",
      "moyenne pondérée",
      "même monnaie",
      "qualité minimale",
      "décalages de flux maximaux",
      "échéance de chaque flux",
      "pas une nouvelle note",
    ])
      assert.throws(() =>
        assertInsuranceRiskQuantitative(
          scene(2, m).replaceAll(word, "ailleurs"),
          2,
        ),
      );
  for (const m of [false, true])
    for (const key of ["x1", "x2", "stroke"])
      assert.throws(() =>
        assertInsuranceRiskQuantitative(
          mutate(scene(2, m), "worst-bracket", key, (v) =>
            key === "stroke" ? "none" : Number(v) + 6,
          ),
          2,
        ),
      );
  assert.throws(() =>
    assertInsuranceRiskQuantitative(scene(2).replace(">+1<", ">+2<"), 2),
  );
});
test("CLO pairs keep common zero origins and exact C-1 factors while the AP/DP threshold and thin-tranche surcharge remain distinct", () => {
  assert.equal((328 + 1177) / 100, 15.05);
  for (const m of [false, true])
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 2; j++)
        for (const key of ["x", "y", "width", "height", "fill"])
          assert.throws(() =>
            assertInsuranceRiskQuantitative(
              mutate(scene(3, m), `factor-${i}-${j}`, key, (v) =>
                key === "fill" ? "none" : Number(v) + 5,
              ),
              3,
            ),
          );
  for (const m of [false, true])
    for (const id of ["thin-tranche", "attachment", "detachment", "loss"])
      for (const key of id === "thin-tranche" ? ["x", "width"] : ["x1", "x2"])
        assert.throws(() =>
          assertInsuranceRiskQuantitative(
            mutate(scene(3, m), id, key, (v) => Number(v) + 6),
            3,
          ),
        );
  for (const v of [
    "DP − AP : 4 % du pool au maximum",
    "BBB− / 2.C",
    "3,28",
    "11,77",
    "15,05",
    "BSL CLO",
    "sans fixer de seuil numérique",
  ])
    assert.throws(() =>
      assertInsuranceRiskQuantitative(scene(3).replaceAll(v, "999"), 3),
    );
});
test("IAIS ranges retain nine volunteers, 2023 valuation, 2025 publication and unpaired participant extrema without invented point data", () => {
  assert.equal(68 - 53, 15);
  for (const m of [false, true])
    for (let i = 0; i < 3; i++)
      for (const key of ["x", "y", "width", "height", "fill"])
        assert.throws(() =>
          assertInsuranceRiskQuantitative(
            mutate(scene(4, m), `range-${i}`, key, (v) =>
              key === "fill" ? "none" : Number(v) + 5,
            ),
            4,
          ),
        );
  for (const v of [
    "non appariées",
    "ne s’additionnent pas",
    "minima et maxima",
    "aucun classement de pays",
    "31.12.2023",
    "11.2025",
    "68 − 53",
    "participants volontaires",
  ])
    assert.throws(() =>
      assertInsuranceRiskQuantitative(scene(4).replaceAll(v, "ailleurs"), 4),
    );
});
test("unmarked gate connectors cannot strike conditional-notch labels in either language", () => {
  for (const lang of ["fr", "en"]) {
    const good = scene(2, true, lang);
    assertInsuranceRiskGeometry(good);
    // Reproduce the exact visually discovered rail: x12→300 at y338,
    // through the first label. This formerly passed the arrow-only check.
    const bad = [
      ["x1", 12],
      ["y1", 338],
      ["x2", 300],
      ["y2", 338],
    ].reduce((svg, [key, value]) => mutate(svg, "gate-rail", key, value), good);
    assert.notEqual(good, bad);
    assert.throws(
      () => assertInsuranceRiskGeometry(bad),
      /gate-rail crosses native label/u,
    );
  }
});
test("existing bounded path and XML checks remain active through the identity-only namespace adapter", () => {
  for (const change of [
    (s) => s.replace("</svg>", "<script>alert(1)</script></svg>"),
    (s) => s.replace("<svg ", '<svg onload="alert(1)" '),
    (s) => '<!DOCTYPE svg [<!ENTITY x SYSTEM "file:///etc/passwd">]>' + s,
    (s) => s.replace("</svg>", "<foreignObject></foreignObject></svg>"),
    (s) => s.replace('font-family="l0g Insurance Risk"', 'font-family="Arial"'),
    (s) =>
      s.replace('fill="var(--color-ink)"', 'fill="url(https://example.com/a)"'),
    (s) => s.replace("M 1 1 L 9 5 L 1 9", "M 1 1 L 9 5 garbage"),
    (s) => s.replace('id="insurance-risk-fr', 'id="insurance-ret-fr'),
  ])
    assert.throws(() => inspectInsuranceRiskSvg(change(scene(1))));
  for (const change of [
    (s) => s.replace('font-size="28"', 'font-size="18"'),
    (s) => s.replace('x="24" y="94"', 'x="9999" y="94"'),
    (s) => s.replace("600 930", "600 1300"),
  ])
    assert.throws(() => assertInsuranceRiskGeometry(change(scene(1, true))));
});
test("one container breakpoint, theme variables and unchanged local licensed fonts preserve compact in-page size and spacing", () => {
  const source = read("src/components/InsuranceRiskFigure.astro"),
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
      rule(".insurance-risk-figure")["max-width"],
      rule(".insurance-risk-figure")["container-type"],
      rule(".insurance-risk-figure")["padding-bottom"],
    ],
    ["44rem", "inline-size", "1rem"],
  );
  assert.deepEqual(
    [
      rule(".insurance-risk-figure :global(svg)").width,
      rule(".insurance-risk-figure :global(svg)").height,
      rule(".insurance-risk-figure :global(svg)").overflow,
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
});
test("bilingual articles contain four ordered mechanisms, methods and linked source records", async () => {
  const walk = (n) => [n, ...(n.children ?? []).flatMap(walk)];
  for (const [i, p] of [
    "posts/assureurs-fonds-06-traitement-risque",
    "posts-en/insurers-asset-managers-06-risk-treatment",
  ].entries()) {
    const article = read("src/content/" + p + ".mdx");
    assertInsuranceRiskArticleReferences(article);
    const body = article.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/u, ""),
      figs = walk(createProcessor().parse(body)).filter(
        (n) => n.name === "InsuranceRiskFigure",
      );
    assert.equal(figs.length, 4);
    for (const [j, f] of figs.entries()) {
      const a = Object.fromEntries(
        f.attributes.map((a) => {
          assert.equal(a.type, "mdxJsxAttribute");
          assert.equal(typeof a.value, "string");
          return [a.name, a.value];
        }),
      );
      assert.equal(a.lang, i ? "en" : "fr");
      assert.equal(a.kind, INSURANCE_RISK_KINDS[j]);
      assert.equal(a.number, String(j + 1).padStart(2, "0"));
      assert.equal(a.sources, INSURANCE_RISK_SOURCES[j]);
      assert.ok(a.caption.length > 20);
      for (const t of ["details", "summary"])
        assert.equal(walk(f).filter((n) => n.name === t).length, 1);
    }
    await compile(body, { format: "mdx" });
  }
});
