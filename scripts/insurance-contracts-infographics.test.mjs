import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import { compile, createProcessor } from "@mdx-js/mdx";
import postcss from "postcss";
import { assertFontLicenseReferences } from "./font-license-assertions.mjs";
import {
  INSURANCE_CONTRACTS_KINDS,
  insuranceContractsSvg,
} from "../src/lib/insuranceContractsFigures.mjs";
import {
  insuranceContractsScenes,
  inspectInsuranceContractsSvg,
  assertInsuranceContractsGeometry,
  assertInsuranceContractsQuantitative,
  assertInsuranceContractsSourceFaithful,
  assertInsuranceContractsArticleReferences,
  pathPoints,
} from "./insurance-contracts-svg-assertions.mjs";
const read = (p) => readFileSync(new URL("../" + p, import.meta.url), "utf8"),
  hash = (b) => createHash("sha256").update(b).digest("hex"),
  scenes = insuranceContractsScenes();
const articles = [
  "posts/assureurs-01-contrat-change-de-mains",
  "posts-en/when-pension-contracts-change-hands",
].map((p) => read("src/content/" + p + ".mdx"));
const scene = (f, mobile = false, lang = "fr") =>
  insuranceContractsSvg(lang, INSURANCE_CONTRACTS_KINDS[f - 1], mobile);
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

test("sixteen reviewed passive scenes preserve the four supplied bilingual mechanisms", () => {
  assert.deepEqual(INSURANCE_CONTRACTS_KINDS, [
    "debtor",
    "amounts",
    "rothesay",
    "reinsurance",
  ]);
  assert.equal(scenes.length, 16);
  for (const s of scenes) {
    assertInsuranceContractsSourceFaithful(s.svg, s.lang, s.kind, s.mobile);
    assertInsuranceContractsGeometry(s.svg);
    assertInsuranceContractsQuantitative(s.svg, s.figure);
  }
  for (const lang of [undefined, null, {}, new String("fr"), "__proto__"])
    assert.throws(() => insuranceContractsSvg(lang, "debtor"));
  for (const kind of ["constructor", "__proto__", {}, null, undefined])
    assert.throws(() => insuranceContractsSvg("fr", kind));
  for (const mobile of [0, 1, "false", null, {}])
    assert.throws(() => insuranceContractsSvg("fr", "debtor", mobile));
});

test("the published AT&T accounting difference and every zero-origin bar length remain independently reproducible", () => {
  assert.equal(8067 - 7704, 363);
  for (const mobile of [false, true]) {
    const svg = scene(2, mobile);
    for (const id of ["bar-0", "bar-1"])
      for (const key of ["x", "width"])
        assert.throws(() =>
          assertInsuranceContractsQuantitative(
            mutate(svg, id, key, (v) => Number(v) + 5),
            2,
          ),
        );
    assert.throws(() =>
      assertInsuranceContractsQuantitative(mutate(svg, "axis", "x1", 30), 2),
    );
    assert.throws(() =>
      assertInsuranceContractsQuantitative(
        mutate(svg, "tick-8000", "x1", 30),
        2,
      ),
    );
  }
  assert.throws(() =>
    assertInsuranceContractsQuantitative(
      scene(2).replaceAll("8 067 − 7 704 = 363", "8 067 − 7 704 = 362"),
      2,
    ),
  );
  assert.throws(() =>
    assertInsuranceContractsQuantitative(
      scene(3).replaceAll("350 000", "351 000"),
      3,
    ),
  );
  assert.throws(() =>
    assertInsuranceContractsQuantitative(
      scene(3).replaceAll("24.11.2021", "25.11.2021"),
      3,
    ),
  );
  assert.throws(() =>
    assertInsuranceContractsQuantitative(
      scene(1).replaceAll("96 000", "97 000"),
      1,
    ),
  );
  assert.throws(() =>
    assertInsuranceContractsQuantitative(
      scene(2).replace('href="#source-s02"', 'href="#source-s03"'),
      2,
    ),
  );
});

test("annuity debt, asset transfers, ownership and collateral links retain all their visible directions", () => {
  for (const mobile of [false, true])
    for (const [f, id] of [
      [1, "assets"],
      [1, "plan-annuity"],
      [1, "ownership-1"],
      [4, "annuity"],
      [4, "reinsurance-dues"],
      [4, "premium"],
      [4, "collateral-to-insurer"],
      [4, "collateral-from-reinsurer"],
    ]) {
      const svg = scene(f, mobile);
      assert.throws(() =>
        assertInsuranceContractsQuantitative(
          mutate(svg, id, "stroke", "none"),
          f,
        ),
      );
      assert.throws(() =>
        assertInsuranceContractsQuantitative(
          mutate(svg, id, "marker-end", "url(#missing)"),
          f,
        ),
      );
      assert.throws(() =>
        assertInsuranceContractsQuantitative(
          svg.replace(
            "</svg>",
            `<rect x="0" y="0" width="${mobile ? 600 : 1000}" height="${mobile ? 936 : 790}" rx="0" fill="var(--color-ink)" stroke="var(--color-line-strong)" stroke-width="1.5"></rect></svg>`,
          ),
          f,
        ),
      );
    }
  assert.throws(() =>
    assertInsuranceContractsQuantitative(
      mutate(scene(4), "premium", "x2", 600),
      4,
    ),
  );
  assert.throws(() =>
    assertInsuranceContractsQuantitative(
      mutate(scene(4, true), "annuity", "y2", 400),
      4,
    ),
  );
});

test("viewBox margins, internal panels, body-source gutters and typography remain compact and fully covered by the local fonts", () => {
  assert.throws(() =>
    assertInsuranceContractsGeometry(mutate(scene(1), "after", "height", 40)),
  );
  assert.throws(() =>
    assertInsuranceContractsGeometry(
      scene(1).replace('font-size="28"', 'font-size="18"'),
    ),
  );
  assert.throws(() =>
    assertInsuranceContractsGeometry(
      scene(1).replace('x="24" y="92"', 'x="9999" y="92"'),
    ),
  );
  assert.throws(() =>
    assertInsuranceContractsGeometry(
      scene(1, true).replace("600 936", "600 1300"),
    ),
  );
  assert.throws(() =>
    assertInsuranceContractsGeometry(scene(1).replace("l0g / 01", "☃ / 01")),
  );
  assert.throws(() =>
    assertInsuranceContractsSourceFaithful(
      scene(1).replace("23.10.2026", "24.10.2026"),
      "fr",
      "debtor",
      false,
    ),
  );
});

test("passive markup and complete bounded path grammar reject active SVG, remote assets and malformed or joined numbers", () => {
  const svg = scene(1);
  for (const extra of [
    "<script/>",
    "<foreignObject/>",
    '<image href="https://example.com/x"/>',
    "<animate/>",
  ])
    assert.throws(() =>
      inspectInsuranceContractsSvg(svg.replace("</svg>", extra + "</svg>")),
    );
  for (const change of [
    (s) => s.replace("<svg ", '<svg onload="void(0)" '),
    (s) => s.replace("font-size=", "fontSize="),
    (s) => s.replace('href="#source-s01"', 'href="https://example.com"'),
    (s) =>
      s.replace('font-family="l0g Insurance Contracts"', 'font-family="Arial"'),
    (s) =>
      s.replace('fill="var(--color-ink)"', 'fill="url(https://example.com/x)"'),
  ])
    assert.throws(() => inspectInsuranceContractsSvg(change(svg)));
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

test("semantic themes, one container breakpoint and the existing licensed subsets preserve natural in-page sizing", () => {
  const source = read("src/components/InsuranceContractsFigure.astro"),
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
      rule(".insurance-contracts-figure")["max-width"],
      rule(".insurance-contracts-figure")["container-type"],
      rule(".insurance-contracts-figure")["padding-bottom"],
    ],
    ["44rem", "inline-size", "1rem"],
  );
  assert.deepEqual(
    [
      rule(".insurance-contracts-figure :global(svg)").width,
      rule(".insurance-contracts-figure :global(svg)").height,
      rule(".insurance-contracts-figure :global(svg)").overflow,
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
    const b = readFileSync(
      new URL(
        `../public/fonts/stablecoins/dejavu-sans-${w}.ttf`,
        import.meta.url,
      ),
    );
    assert.equal(hash(b), h);
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

test("both articles contain four ordered figures, detailed methods and the complete common bibliography", async () => {
  const walk = (n) => [n, ...(n.children ?? []).flatMap(walk)],
    sets = ["01 03 04 27", "02", "11 12 13", "18 20"];
  for (const [i, a] of articles.entries()) {
    assertInsuranceContractsArticleReferences(a);
    const body = a.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/u, ""),
      figs = walk(createProcessor().parse(body)).filter(
        (n) => n.name === "InsuranceContractsFigure",
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
      assert.equal(at.kind, INSURANCE_CONTRACTS_KINDS[j]);
      assert.equal(at.number, String(j + 1).padStart(2, "0"));
      assert.equal(at.sources, sets[j]);
      assert.ok(at.caption.length > 30);
      assert.equal(walk(f).filter((n) => n.name === "details").length, 1);
      assert.equal(walk(f).filter((n) => n.name === "summary").length, 1);
    }
    await compile(body, { format: "mdx" });
  }
});
