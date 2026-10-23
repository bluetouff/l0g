import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import test from "node:test";
import postcss from "postcss";
import { createProcessor, compile } from "@mdx-js/mdx";
import { assertFontLicenseReferences } from "./font-license-assertions.mjs";
import {
  INSURANCE_RECAPTURE_KINDS,
  INSURANCE_RECAPTURE_SOURCES,
  insuranceRecaptureSvg,
} from "../src/lib/insuranceRecaptureFigures.mjs";
import {
  insuranceRecaptureScenes,
  inspectInsuranceRecaptureSvg,
  assertInsuranceRecaptureGeometry,
  assertInsuranceRecaptureQuantitative,
  assertInsuranceRecaptureSourceFaithful,
  assertInsuranceRecaptureArticleReferences,
} from "./insurance-recapture-svg-assertions.mjs";
const read = (p) => readFileSync(new URL("../" + p, import.meta.url), "utf8"),
  hash = (s) => createHash("sha256").update(s).digest("hex");
const scene = (f, m = false, l = "fr") =>
  insuranceRecaptureSvg(l, INSURANCE_RECAPTURE_KINDS[f - 1], m);
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
test("sixteen bilingual scenes preserve passive source-faithful mechanisms and native licensed glyph geometry", () => {
  assert.equal(insuranceRecaptureScenes().length, 16);
  for (const s of insuranceRecaptureScenes())
    assertInsuranceRecaptureSourceFaithful(s.svg, s.lang, s.kind, s.mobile);
  for (const lang of [undefined, null, {}, new String("fr"), "__proto__"])
    assert.throws(() => insuranceRecaptureSvg(lang, "branches"));
  for (const kind of [undefined, null, {}, "constructor", "__proto__"])
    assert.throws(() => insuranceRecaptureSvg("fr", kind));
  for (const mobile of [null, {}, 0, 1, "false"])
    assert.throws(() => insuranceRecaptureSvg("fr", "branches", mobile));
});
test("stage two branches to two distinct stage-three panels and only recapture carries the liabilities result", () => {
  for (const m of [false, true])
    for (const id of [
      "stage-1-to-2",
      "central-entry",
      "recapture-entry",
      "recapture-result",
    ])
      for (const key of ["x1", "x2", "y1", "y2", "marker-end"])
        assert.throws(() =>
          assertInsuranceRecaptureQuantitative(
            mutate(scene(1, m), id, key, (v) =>
              key === "marker-end" ? "url(#missing)" : Number(v) + 9,
            ),
            1,
          ),
        );
  for (const m of [false, true])
    for (const label of [
      "12,3",
      "50 %",
      "01.01.2016",
      "hors intragroupe",
      "sous-échantillon",
      "plus défavorable",
      "sans probabilité cible",
      "baisse de l’immobilier",
    ])
      assert.throws(() =>
        assertInsuranceRecaptureQuantitative(
          scene(1, m).replaceAll(label, "ailleurs"),
          1,
        ),
      );
});
test("the published coverage change remains distinct from illustrative indices with common zero-to-160 bar scale", () => {
  assert.equal(154 * 0.99, 152.46);
  assert.ok(Math.abs((154 * 0.99) / 1.06 - 143.83018867924528) < 1e-10);
  for (const m of [false, true])
    for (let i = 0; i < 2; i++)
      for (let j = 0; j < 2; j++)
        for (const key of ["x", "y", "width", "height", "fill"])
          assert.throws(() =>
            assertInsuranceRecaptureQuantitative(
              mutate(scene(2, m), `index-${i}-${j}`, key, (v) =>
                key === "fill" ? "none" : Number(v) + 7,
              ),
              2,
            ),
          );
  for (const label of [
    "154 % → 144 %",
    "−10",
    "152,46",
    "143,83",
    "+6 %",
    "−1 %",
    "aucun montant",
  ])
    assert.throws(() =>
      assertInsuranceRecaptureQuantitative(
        scene(2).replaceAll(label, "ailleurs"),
        2,
      ),
    );
  assert.throws(() =>
    assertInsuranceRecaptureQuantitative(
      scene(2).replace(/arrondi(?:es|s)?/gu, "ailleurs"),
      2,
    ),
  );
});
test("recognition rights, hold and sell branches, existing facilities and all three payment connections remain distinct", () => {
  for (const m of [false, true])
    for (const id of [
      "facility-cash",
      "outgoing-0",
      "outgoing-1",
      "outgoing-2",
    ])
      for (const key of ["x1", "x2", "y1", "y2", "marker-end"])
        assert.throws(() =>
          assertInsuranceRecaptureQuantitative(
            mutate(scene(3, m), id, key, (v) =>
              key === "marker-end" ? "url(#missing)" : Number(v) + 8,
            ),
            3,
          ),
        );
  for (const m of [false, true])
    for (const label of [
      "propriété bénéficiaire",
      "propriété juridique",
      "préarrangées",
      "ne garantissent aucun délai réel",
      "Section C : a–d",
    ])
      assert.throws(() =>
        assertInsuranceRecaptureQuantitative(
          scene(3, m).replaceAll(label, "ailleurs"),
          3,
        ),
      );
});
test("central-scenario transaction bars retain 3.4 and 0.9 while the 0.8 own-funds cost and recapture exclusions retain their own perimeter", () => {
  for (const m of [false, true])
    for (let i = 0; i < 2; i++)
      for (const key of ["x", "y", "width", "height", "fill"])
        assert.throws(() =>
          assertInsuranceRecaptureQuantitative(
            mutate(scene(4, m), `sales-${i}`, key, (v) =>
              key === "fill" ? "none" : Number(v) + 8,
            ),
            4,
          ),
        );
  for (const label of [
    "25 %",
    "ERM",
    "0,8",
    "−1 point",
    "après impôt",
    "collatéral repris",
    "ne mesurent pas le coût",
    "périmètre plus large",
  ])
    assert.throws(() =>
      assertInsuranceRecaptureQuantitative(
        scene(4, true).replaceAll(label, "ailleurs"),
        4,
      ),
    );
  for (const m of [false, true])
    assert.throws(() =>
      assertInsuranceRecaptureQuantitative(
        mutate(scene(4, m), "credit-branch-2", "y2", 900),
        4,
      ),
    );
});
test("unmarked native connectors cannot cross labels after a plausible in-bounds route mutation", () => {
  for (const lang of ["fr", "en"]) {
    const good = scene(1, true, lang);
    assertInsuranceRecaptureGeometry(good);
    const bad = [
      ["x1", 24],
      ["y1", 240],
      ["x2", 576],
      ["y2", 240],
    ].reduce((svg, [k, v]) => mutate(svg, "common-branch-0", k, v), good);
    assert.throws(
      () => assertInsuranceRecaptureGeometry(bad),
      /crosses native label/u,
    );
  }
});
test("existing XML, path, font and namespace checks remain active through identity-only adaptation", () => {
  for (const change of [
    (s) => s.replace("</svg>", "<script>alert(1)</script></svg>"),
    (s) => s.replace("<svg ", '<svg onload="alert(1)" '),
    (s) => '<!DOCTYPE svg [<!ENTITY x SYSTEM "file:///etc/passwd">]>' + s,
    (s) => s.replace("</svg>", "<foreignObject></foreignObject></svg>"),
    (s) =>
      s.replace('font-family="l0g Insurance Recapture"', 'font-family="Arial"'),
    (s) =>
      s.replace('fill="var(--color-ink)"', 'fill="url(https://example.com/a)"'),
    (s) => s.replace("M 1 1 L 9 5 L 1 9", "M 1 1 L 9 5 garbage"),
    (s) => s.replace('id="insurance-recapture-fr', 'id="insurance-risk-fr'),
  ])
    assert.throws(() => inspectInsuranceRecaptureSvg(change(scene(1))));
  for (const change of [
    (s) => s.replace('font-size="28"', 'font-size="18"'),
    (s) => s.replace('x="24" y="94"', 'x="9999" y="94"'),
    (s) => s.replace("600 930", "600 1300"),
  ])
    assert.throws(() =>
      assertInsuranceRecaptureGeometry(change(scene(1, true))),
    );
});
test("container sizing preserves at least 13px mobile type and compact real height throughout the breakpoint", () => {
  const component = read("src/components/InsuranceRecaptureFigure.astro"),
    css = postcss.parse(
      component.slice(
        component.indexOf("<style>") + 7,
        component.indexOf("</style>"),
      ),
    );
  const rule = (selector) =>
    Object.fromEntries(
      css.nodes
        .find((n) => n.type === "rule" && n.selector === selector)
        .nodes.filter((n) => n.type === "decl")
        .map((n) => [n.prop, n.value]),
    );
  assert.deepEqual(
    [
      rule(".insurance-recapture-figure")["max-width"],
      rule(".insurance-recapture-figure")["container-type"],
      rule(".insurance-recapture-figure")["padding-bottom"],
    ],
    ["44rem", "inline-size", "1rem"],
  );
  assert.deepEqual(
    [
      rule(".insurance-recapture-figure :global(svg)").width,
      rule(".insurance-recapture-figure :global(svg)").height,
      rule(".insurance-recapture-figure :global(svg)").overflow,
    ],
    ["100%", "auto", "visible"],
  );
  const gates = css.nodes.filter(
    (n) => n.type === "atrule" && n.name === "container",
  );
  assert.equal(gates.length, 1);
  assert.equal(gates[0].params, "(max-width: 480px)");
  assert.ok((28 * 280) / 600 >= 13);
  assert.ok((930 * 480) / 600 <= 750);
  assert.ok((790 * 704) / 1000 <= 560);
  assert.doesNotMatch(
    component,
    /overflow\s*:\s*(?:clip|hidden)|@media\s*\(max-width:|client:|<script|fetch\(/iu,
  );
});
test("font bytes and licence remain the existing canonical local licensed assets", () => {
  const component = read("src/components/InsuranceRecaptureFigure.astro");
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
      component,
      new RegExp(`/fonts/stablecoins/dejavu-sans-${w}\\.ttf`, "u"),
    );
  }
  const license = read("public/fonts/stablecoins/LICENSE.txt");
  assert.equal(
    hash(license),
    "185add2050d6a40596a9a6aa46026e3cf0bd4bfff21ab18acd9cc8eebe18182f",
  );
  assertFontLicenseReferences(license, "dejavu");
});
test("both articles contain four ordered native figure mechanisms with source notices and individual methods", async () => {
  const walk = (n) => [n, ...(n.children ?? []).flatMap(walk)];
  for (const [i, path] of [
    "posts/assureurs-fonds-07-retour-risques",
    "posts-en/insurers-asset-managers-07-risks-return",
  ].entries()) {
    const article = read("src/content/" + path + ".mdx");
    assertInsuranceRecaptureArticleReferences(article);
    const body = article.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/u, ""),
      figs = walk(createProcessor().parse(body)).filter(
        (n) => n.name === "InsuranceRecaptureFigure",
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
      assert.equal(a.kind, INSURANCE_RECAPTURE_KINDS[j]);
      assert.equal(a.number, String(j + 1).padStart(2, "0"));
      assert.equal(a.sources, INSURANCE_RECAPTURE_SOURCES[j]);
      assert.ok(a.caption.length > 20);
      for (const t of ["details", "summary"])
        assert.equal(walk(f).filter((n) => n.name === t).length, 1);
    }
    await compile(body, { format: "mdx" });
  }
});
