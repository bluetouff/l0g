import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import test from "node:test";
import postcss from "postcss";
import { createProcessor, compile } from "@mdx-js/mdx";
import { assertFontLicenseReferences } from "./font-license-assertions.mjs";
import {
  INSURANCE_PROMISE_KINDS,
  INSURANCE_PROMISE_SOURCES,
  insurancePromiseSvg,
} from "../src/lib/insurancePromiseFigures.mjs";
import {
  insurancePromiseScenes,
  inspectInsurancePromiseSvg,
  assertInsurancePromiseGeometry,
  assertInsurancePromiseChartClearance,
  assertInsurancePromiseQuantitative,
  assertInsurancePromiseSourceFaithful,
  assertInsurancePromiseArticleReferences,
} from "./insurance-promise-svg-assertions.mjs";
import { SVG_TEST_SUITES } from "./svg-test-suites.mjs";
const read = (p) => readFileSync(new URL("../" + p, import.meta.url), "utf8"),
  hash = (s) => createHash("sha256").update(s).digest("hex");
const scene = (f, m = false, l = "fr") =>
  insurancePromiseSvg(l, INSURANCE_PROMISE_KINDS[f - 1], m);
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
test("twelve bilingual scenes preserve passive source-faithful mechanisms and native licensed glyph geometry", () => {
  assert.equal(insurancePromiseScenes().length, 12);
  for (const s of insurancePromiseScenes())
    assertInsurancePromiseSourceFaithful(s.svg, s.lang, s.kind, s.mobile);
  for (const lang of [undefined, null, {}, new String("fr"), "__proto__"])
    assert.throws(() => insurancePromiseSvg(lang, "signatures"));
  for (const kind of [undefined, null, {}, "constructor", "__proto__"])
    assert.throws(() => insurancePromiseSvg("fr", kind));
  for (const mobile of [null, {}, 0, 1, "false"])
    assert.throws(() => insurancePromiseSvg("fr", "signatures", mobile));
});
test("control, policy-benefit and conditional capital-support relationships retain their distinct legal issuers", () => {
  for (const m of [false, true])
    for (const id of [
      "control-0",
      "control-1",
      "control-2",
      "benefit-0",
      "benefit-1",
      "benefit-2",
      "capital-support",
    ])
      for (const key of ["x1", "y1", "x2", "y2", "marker-end"])
        assert.throws(() =>
          assertInsurancePromiseQuantitative(
            mutate(scene(1, m), id, key, (v) =>
              key === "marker-end" ? "url(#missing)" : Number(v) + 9,
            ),
            1,
          ),
        );
  for (const m of [false, true])
    assert.throws(() =>
      assertInsurancePromiseQuantitative(
        mutate(scene(1, m), "control-0", "stroke-dasharray", "none"),
        1,
      ),
    );
  for (const label of [
    "Forethought Life Insurance Company",
    "Just Retirement Limited",
    "seuil",
    "responsabilité des prestations",
  ])
    assert.throws(() =>
      assertInsurancePromiseQuantitative(
        scene(1).replaceAll(label, "ailleurs"),
        1,
      ),
    );
});
test("two alternative allocations preserve exact quarterly fee compounding and zero-origin EUR scenario bars", () => {
  // Four deductions in units, then an independently assumed EUR90 NAV.
  const numerator = 100n * 799n ** 4n,
    denominator = 800n ** 4n;
  assert.equal(numerator, 40755583680100n);
  assert.equal(denominator, 409600000000n);
  assert.equal(Number(numerator) / Number(denominator), 99.50093671899414);
  assert.equal(
    Number(numerator * 90n) / Number(denominator),
    8955.084304709473,
  );
  assert.equal(10000 * (1 - 0.02), 9800);
  assert.equal(3000 * (1 - 0.02), 2940);
  for (const m of [false, true])
    for (let i = 0; i < 3; i++)
      for (const key of ["x", "y", "width", "height", "fill"])
        assert.throws(() =>
          assertInsurancePromiseQuantitative(
            mutate(scene(2, m), `amount-${i}`, key, (v) =>
              key === "fill" ? "none" : Number(v) + 7,
            ),
            2,
          ),
        );
  for (const m of [false, true])
    for (const label of [
      "99.500936718994140625",
      "8955.08430470947265625",
      "scénario de marché",
      "maximum de 2%",
    ])
      assert.throws(() =>
        assertInsurancePromiseQuantitative(
          scene(2, m).replaceAll(label, "ailleurs"),
          2,
        ),
      );
  for (const m of [false, true])
    assert.throws(() =>
      assertInsurancePromiseQuantitative(
        mutate(scene(2, m), m ? "units-entry" : "units-entry-1", "y2", 303),
        2,
      ),
    );
});
test("FGAP, FSCS and FLAHIGA preserve distinct eligibility, valuation bases and procedural outcomes", () => {
  for (const m of [false, true])
    for (const label of [
      "70 000",
      "90 000",
      "250 000",
      "100 %",
      "incapacité",
      "invalidité",
      "décès",
      "rachat",
      "retrait",
      "liquidation",
      "propriétaire et assureur membre",
      "déjà échues",
      "au-delà du plafond",
    ])
      assert.throws(() =>
        assertInsurancePromiseQuantitative(
          scene(3, m).replaceAll(label, "ailleurs"),
          3,
        ),
      );
  for (const m of [false, true])
    for (let i = 0; i < 3; i++)
      for (const key of ["x1", "y1", "x2", "y2", "marker-end"])
        assert.throws(() =>
          assertInsurancePromiseQuantitative(
            mutate(
              scene(3, m),
              m ? `outcome-${i}` : `rights-outcome-${i}`,
              key,
              (v) => (key === "marker-end" ? "url(#missing)" : Number(v) + 9),
            ),
            3,
          ),
        );
  assert.throws(() =>
    assertInsurancePromiseQuantitative(
      scene(3).replace(
        "</svg>",
        '<rect id="insurance-promise-fr-f3-d-unjustified-money-bar" x="24" y="200" width="100" height="18" rx="0" fill="var(--color-signal)" stroke="none" stroke-width="0"></rect></svg>',
      ),
      3,
    ),
  );
});
test("native chart tick spacing and bar-to-label clearance reject the former crowded layout", () => {
  for (const lang of ["fr", "en"])
    for (const mobile of [false, true]) {
      const good = scene(2, mobile, lang),
        metrics = assertInsurancePromiseChartClearance(good);
      assert.ok(Math.min(...metrics.tickGaps) >= 14);
      assert.ok(metrics.minimumBarLabelClearance >= 8);
      // Restore the old last-bar position, independently of quantitative checks.
      const oldBar = mutate(
        mutate(good, "amount-2", "y", mobile ? 838 : 686),
        "amount-2",
        "height",
        18,
      );
      assert.throws(
        () => assertInsurancePromiseChartClearance(oldBar),
        /Native amount bar/u,
      );
      if (mobile) {
        const crowdedRow = mutate(good, "amount-0", "height", 18);
        assert.throws(
          () => assertInsurancePromiseChartClearance(crowdedRow),
          /Native amount bar/u,
        );
      }
      if (!mobile) {
        const oldTick = good.replace(
          /(<text[^>]*x="830"[^>]*text-anchor=")middle("[^>]*>10000<\/text>)/u,
          "$1end$2",
        );
        assert.notEqual(oldTick, good);
        assert.throws(
          () => assertInsurancePromiseChartClearance(oldTick),
          /Native tick labels/u,
        );
      }
    }
});
test("unmarked native connectors cannot cross labels after a plausible in-bounds route mutation", () => {
  for (const lang of ["fr", "en"]) {
    const good = scene(2, false, lang);
    assertInsurancePromiseGeometry(good);
    const bad = [
      ["y1", 150],
      ["y2", 150],
    ].reduce((svg, [k, v]) => mutate(svg, "axis", k, v), good);
    assert.throws(
      () => assertInsurancePromiseGeometry(bad),
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
      s.replace('font-family="l0g Insurance Promise"', 'font-family="Arial"'),
    (s) =>
      s.replace('fill="var(--color-ink)"', 'fill="url(https://example.com/a)"'),
    (s) => s.replace("M 1 1 L 9 5 L 1 9", "M 1 1 L 9 5 garbage"),
    (s) => s.replace('id="insurance-promise-fr', 'id="insurance-risk-fr'),
  ])
    assert.throws(() => inspectInsurancePromiseSvg(change(scene(1))));
  for (const change of [
    (s) => s.replace('font-size="28"', 'font-size="18"'),
    (s) => s.replace('x="24" y="94"', 'x="9999" y="94"'),
    (s) => s.replace("600 930", "600 1300"),
  ])
    assert.throws(() => assertInsurancePromiseGeometry(change(scene(1, true))));
});
test("container sizing preserves at least 13px mobile type and compact real height throughout the breakpoint", () => {
  const component = read("src/components/InsurancePromiseFigure.astro"),
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
      rule(".insurance-promise-figure")["max-width"],
      rule(".insurance-promise-figure")["container-type"],
      rule(".insurance-promise-figure")["padding-bottom"],
    ],
    ["44rem", "inline-size", "1rem"],
  );
  assert.deepEqual(
    [
      rule(".insurance-promise-figure :global(svg)").width,
      rule(".insurance-promise-figure :global(svg)").height,
      rule(".insurance-promise-figure :global(svg)").overflow,
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
  const component = read("src/components/InsurancePromiseFigure.astro");
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
test("both articles contain three ordered native figure mechanisms with source notices and individual methods", async () => {
  const walk = (n) => [n, ...(n.children ?? []).flatMap(walk)];
  for (const [i, path] of [
    "posts/assureurs-fonds-08-solidite-promesse",
    "posts-en/insurers-asset-managers-08-promise",
  ].entries()) {
    const article = read("src/content/" + path + ".mdx");
    assertInsurancePromiseArticleReferences(article);
    const body = article.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/u, ""),
      figs = walk(createProcessor().parse(body)).filter(
        (n) => n.name === "InsurancePromiseFigure",
      );
    assert.equal(figs.length, 3);
    for (const [j, f] of figs.entries()) {
      const a = Object.fromEntries(
        f.attributes.map((a) => {
          assert.equal(a.type, "mdxJsxAttribute");
          assert.equal(typeof a.value, "string");
          return [a.name, a.value];
        }),
      );
      assert.equal(a.lang, i ? "en" : "fr");
      assert.equal(a.kind, INSURANCE_PROMISE_KINDS[j]);
      assert.equal(a.number, String(j + 1).padStart(2, "0"));
      assert.equal(a.sources, INSURANCE_PROMISE_SOURCES[j]);
      assert.ok(a.caption.length > 20);
      for (const t of ["details", "summary"])
        assert.equal(walk(f).filter((n) => n.name === t).length, 1);
    }
    await compile(body, { format: "mdx" });
  }
});
test("source and rendered registry entries cover this new suite exactly once", () => {
  for (const [group, file] of [
    ["source", "scripts/insurance-promise-infographics.test.mjs"],
    ["rendered", "scripts/insurance-promise-rendered-infographics.test.mjs"],
  ]) {
    assert.equal(SVG_TEST_SUITES[group].filter((p) => p === file).length, 1);
    assert.equal(
      SVG_TEST_SUITES[group === "source" ? "rendered" : "source"].includes(
        file,
      ),
      false,
    );
  }
});
