import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import opentype from "@shuding/opentype.js";
import { parseFragment, serializeOuter } from "parse5";
import { XMLParser } from "fast-xml-parser";
import {
  INSURANCE_RISK_KINDS,
  INSURANCE_RISK_SOURCES,
  insuranceRiskSvg,
} from "../src/lib/insuranceRiskFigures.mjs";
// Reuse the existing passive XML allow-list, fully consumed path grammar,
// licensed-font glyph bounds, overlap, arrow-route and in-page proportion checks.
// Only these three fixed namespaces change. No geometry, text or node is changed.
import {
  inspectInsuranceReturnsSvg,
  assertInsuranceReturnsGeometry,
  tag,
  attrs,
  nodes,
  content,
} from "./insurance-returns-svg-assertions.mjs";
export { tag, attrs, nodes, content };
const adapt = (svg) =>
  svg
    .replace(
      /class="l0g-insurance-risk-svg"/gu,
      'class="l0g-insurance-returns-svg"',
    )
    .replace(
      /((?:id|data-panel)=")insurance-risk-([^"]*)(")/gu,
      "$1insurance-ret-$2$3",
    )
    .replace(
      /(aria-labelledby=")([^"]+)(")/gu,
      (_match, a, value, b) =>
        a + value.replaceAll("insurance-risk-", "insurance-ret-") + b,
    )
    .replace(
      /(marker-end="url\(#)insurance-risk-([^"]*)(")/gu,
      "$1insurance-ret-$2$3",
    )
    .replace(
      /font-family="l0g Insurance Risk"/gu,
      'font-family="l0g Insurance Returns"',
    );
const sha = (s) => createHash("sha256").update(s).digest("hex");
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
  preserveOrder: true,
  trimValues: false,
  parseTagValue: false,
});
export const insuranceRiskScenes = () =>
  ["fr", "en"].flatMap((lang) =>
    INSURANCE_RISK_KINDS.flatMap((kind, i) =>
      [false, true].map((mobile) => ({
        lang,
        kind,
        mobile,
        figure: i + 1,
        svg: insuranceRiskSvg(lang, kind, mobile),
      })),
    ),
  );
export function inspectInsuranceRiskSvg(svg) {
  assert.equal(typeof svg, "string");
  assert.match(svg, /class="l0g-insurance-risk-svg"/u);
  assert.doesNotMatch(
    svg,
    /insurance-ret-|l0g Insurance Returns|l0g-insurance-returns-svg/u,
  );
  // Validate actual attributes before the one-to-one namespace adaptation.
  const tree = parser.parse(svg),
    all = tree.flatMap(nodes);
  for (const n of all) {
    const a = attrs(n);
    if (a.id)
      assert.match(
        a.id,
        /^insurance-risk-(?:fr|en)-f[1-4]-(?:d|m)-[a-z0-9.-]+$/u,
      );
    if (a["font-family"]) assert.equal(a["font-family"], "l0g Insurance Risk");
  }
  inspectInsuranceReturnsSvg(adapt(svg));
  return { root: tree[0], all };
}
// The shared engine checks marked arrow routes. Unmarked connectors and axes
// also need a native-glyph clearance check: a plausible route can strike text
// while all labels and all marked arrows remain within their bounds.
const nativeFonts = new Map(
  [400, 700].map((weight) => {
    const bytes = readFileSync(
      new URL(
        `../public/fonts/stablecoins/dejavu-sans-${weight}.ttf`,
        import.meta.url,
      ),
    );
    return [
      weight,
      opentype.parse(
        bytes.buffer.slice(
          bytes.byteOffset,
          bytes.byteOffset + bytes.byteLength,
        ),
      ),
    ];
  }),
);
export function assertInsuranceRiskLineClearance(svg) {
  const { all } = inspectInsuranceRiskSvg(svg);
  const labels = all
    .filter((n) => tag(n) === "text")
    .flatMap((n) => {
      const a = attrs(n),
        font = nativeFonts.get(Number(a["font-weight"])),
        value = content(n),
        size = Number(a["font-size"]);
      const advance = font.getAdvanceWidth(value, size, { kerning: true });
      const x =
        Number(a.x) -
        (a["text-anchor"] === "middle"
          ? advance / 2
          : a["text-anchor"] === "end"
            ? advance
            : 0);
      const glyphs = [];
      font.forEachGlyph(
        value,
        x,
        Number(a.y),
        size,
        { kerning: true },
        (glyph, gx, gy) => {
          if (
            !Number.isFinite(glyph.xMin) ||
            (glyph.xMin === glyph.xMax && glyph.yMin === glyph.yMax)
          )
            return;
          const scale = size / font.unitsPerEm;
          const bounds = {
            x1: gx + glyph.xMin * scale,
            x2: gx + glyph.xMax * scale,
            y1: gy - glyph.yMax * scale,
            y2: gy - glyph.yMin * scale,
          };
          assert.ok(
            Object.values(bounds).every(Number.isFinite),
            "Finite native glyph bounds required",
          );
          glyphs.push({ value, ...bounds });
        },
      );
      assert.ok(glyphs.length, "Visible native glyphs required");
      return glyphs;
    });
  for (const node of all.filter((n) => tag(n) === "line")) {
    const a = attrs(node),
      x1 = Number(a.x1),
      x2 = Number(a.x2),
      y1 = Number(a.y1),
      y2 = Number(a.y2);
    assert.ok(
      x1 === x2 || y1 === y2,
      "Risk-scene line segments must be axis-aligned",
    );
    for (const b of labels) {
      const crosses =
        x1 === x2
          ? x1 > b.x1 - 1 &&
            x1 < b.x2 + 1 &&
            Math.min(y1, y2) < b.y2 + 1 &&
            Math.max(y1, y2) > b.y1 - 1
          : y1 > b.y1 - 1 &&
            y1 < b.y2 + 1 &&
            Math.min(x1, x2) < b.x2 + 1 &&
            Math.max(x1, x2) > b.x1 - 1;
      assert.ok(!crosses, `Connector ${a.id} crosses native label: ${b.value}`);
    }
  }
  return true;
}
export function assertInsuranceRiskGeometry(svg) {
  inspectInsuranceRiskSvg(svg);
  assertInsuranceReturnsGeometry(adapt(svg));
  return assertInsuranceRiskLineClearance(svg);
}
export function assertInsuranceRiskQuantitative(svg, figure) {
  const { root, all } = inspectInsuranceRiskSvg(svg),
    a = attrs(root),
    m = a.viewBox.startsWith("0 0 600 "),
    p = a["aria-labelledby"].split(" ")[0].slice(0, -6),
    labels = all
      .filter((n) => tag(n) === "text")
      .map(content)
      .join(" "),
    desc = content(all.find((n) => tag(n) === "desc"));
  const find = (id) => {
    const n = all.find((n) => attrs(n).id === `${p}-${id}`);
    assert.ok(n, id);
    return attrs(n);
  };
  const near = (actual, expected) =>
    assert.ok(
      Math.abs(Number(actual) - expected) < 0.002,
      `${actual} != ${expected}`,
    );
  const check = (id, expected) => {
    const a = find(id);
    for (const [k, v] of Object.entries(expected)) {
      if (typeof v === "number") near(a[k], v);
      else assert.equal(a[k], v);
    }
  };
  assert.match(labels, /23\.10\.2026/u);
  assert.deepEqual(
    all.filter((n) => tag(n) === "a").map((n) => attrs(n).href),
    INSURANCE_RISK_SOURCES[figure - 1].split(" ").map((s) => `#source-s${s}`),
  );
  if (figure === 1) {
    const x = m ? 24 : 332,
      width = m ? 552 : 620;
    [
      [20, 40],
      [110, 150],
    ].forEach(([lo, hi], i) => {
      const y = (m ? 292 + i * 130 : 278 + i * 98) + (m ? 30 : 18);
      check(`range-${i}`, {
        x: x + (width * lo) / 160,
        y,
        width: (width * (hi - lo)) / 160,
        height: 24,
        fill: `var(--color-${i ? "topic-blue" : "signal"})`,
      });
      check(`low-${i}`, {
        x1: x + (width * lo) / 160,
        x2: x + (width * lo) / 160,
        y1: y - 6,
        y2: y + 30,
      });
      check(`high-${i}`, {
        x1: x + (width * hi) / 160,
        x2: x + (width * hi) / 160,
        y1: y - 6,
        y2: y + 30,
      });
    });
    const py = (m ? 292 + 2 * 130 : 278 + 2 * 98) + (m ? 30 : 18);
    check("point", {
      x: x + (width * 100) / 160 - 4,
      y: py - 4,
      width: 8,
      height: 32,
      fill: "var(--color-amber)",
    });
    for (const n of [
      "0",
      "40",
      "80",
      "120",
      "160",
      "20–40",
      "110–150",
      "100",
      "CDA",
      "SCR",
    ])
      assert.ok(labels.includes(n), n);
    assert.match(desc, /1 milliard|£1 billion/u);
    assert.match(desc, /estimations publiées|Published estimate/u);
    assert.match(desc, /passif inchangé|liabilities unchanged/u);
    assert.match(desc, /1er juillet 2027|1 July 2027/u);
    for (let i = 0; i < 2; i++)
      check(`effect-arrow-${i}`, {
        "marker-end": `url(#${p}-signal-arrow)`,
        stroke: "var(--color-signal)",
      });
  }
  if (figure === 2) {
    assert.match(labels, /100\s?%/u);
    assert.match(labels, /Tests 2–3/u);
    assert.match(
      labels,
      /Réassureur\/apparentés : titres émis exclus|titres émis par réassureur\/apparentés exclus|Reinsurer\/affiliate issues excluded/u,
    );
    assert.match(
      desc,
      /titres émis par le réassureur ou ses apparentées|securities issued by the reinsurer or its affiliates/u,
    );
    assert.match(labels, /pire portefeuille permis|worst permitted portfolio/u);
    assert.match(labels, /IFS \+ 0 à 3 crans|IFS \+ 0–3 notches/u);
    assert.match(labels, /A\+ → AA−/u);
    assert.equal(
      all.filter((n) => tag(n) === "text" && content(n) === "+1").length,
      3,
    );
    for (const pattern of [
      /moyenne pondérée|weighted-average/iu,
      /même monnaie|same-currency/iu,
      /qualité minimale|lowest credit quality/iu,
      /décalages de flux maximaux|greatest cash-flow mismatches/iu,
      /échéance de chaque flux|each cash flow’s maturity/iu,
      /SCR demeure distinct|SCR remains distinct/u,
      /pas une nouvelle note|not create a new agency rating/u,
    ])
      assert.match(desc, pattern);
    const b = find("worst-bracket");
    assert.equal(b.stroke, "var(--color-accent)");
    near(b.x1, m ? 24 : 350);
    near(b.x2, m ? 576 : 976);
    assert.ok(Number(b.x2) > Number(b.x1));
    for (const id of m
      ? [
          "effective-arrow",
          "condition-arrow-0",
          "condition-arrow-1",
          "condition-arrow-2",
        ]
      : [
          "gate-arrow",
          "condition-arrow-0",
          "condition-arrow-1",
          "condition-arrow-2",
          "valuation-arrow-0",
          "valuation-arrow-1",
          "valuation-arrow-2",
        ])
      assert.equal(find(id)["marker-end"], `url(#${p}-signal-arrow)`);
  }
  if (figure === 3) {
    const x = m ? 146 : 300,
      width = m ? 324 : 650;
    [
      [0.816, 0.17],
      [1.523, 3.24],
      [4.537, 25.15],
    ].forEach((v, i) =>
      v.forEach((value, j) =>
        check(`factor-${i}-${j}`, {
          x,
          y: (m ? 308 + i * 84 : 282 + i * 84) + j * 30,
          width: (width * value) / 30,
          height: 18,
          fill: `var(--color-${j ? "signal" : "topic-blue"})`,
        }),
      ),
    );
    for (const v of [
      "0,816|0.816",
      "0,170|0.170",
      "1,523|1.523",
      "3,240|3.240",
      "4,537|4.537",
      "25,150|25.150",
      "3,28|3.28",
      "11,77|11.77",
      "15,05|15.05",
    ])
      assert.match(labels, new RegExp(v, "u"));
    assert.match(labels, /DP − AP.*4\s?%/u);
    assert.match(labels, /au maximum|at most/u);
    assert.match(labels, /BBB− \/ 2\.C/u);
    assert.match(desc, /BSL CLO/u);
    assert.match(desc, /31 décembre 2026|31 December 2026/u);
    assert.match(
      desc,
      /sans fixer de seuil numérique|without numerical loss thresholds/u,
    );
    assert.match(
      desc,
      /ni une comparaison à risque identique|neither.*identical risk/u,
    );
    const ax = m ? 100 : 150,
      bx = m ? 392 : 710,
      ey = m ? 642 : 628;
    check("thin-tranche", {
      x: ax,
      y: ey - 12,
      width: bx - ax,
      height: 24,
      fill: "var(--color-amber)",
    });
    check("attachment", { x1: ax, x2: ax, y1: ey - 26, y2: ey + 26 });
    check("detachment", { x1: bx, x2: bx, y1: ey - 26, y2: ey + 26 });
    check("loss", {
      x1: 24,
      x2: m ? 576 : 976,
      "marker-end": `url(#${p}-signal-arrow)`,
    });
  }
  if (figure === 4) {
    const x = m ? 24 : 340,
      width = m ? 552 : 610;
    [
      [52, 60],
      [53, 68],
      [54, 74],
    ].forEach(([lo, hi], i) => {
      const y = (m ? 300 + i * 128 : 294 + i * 102) + (m ? 30 : 18);
      check(`range-${i}`, {
        x: x + (width * lo) / 80,
        y,
        width: (width * (hi - lo)) / 80,
        height: 24,
        fill: `var(--color-${["signal", "topic-blue", "accent"][i]})`,
      });
      check(`low-${i}`, {
        x1: x + (width * lo) / 80,
        x2: x + (width * lo) / 80,
        y1: y - 6,
        y2: y + 30,
      });
      check(`high-${i}`, {
        x1: x + (width * hi) / 80,
        x2: x + (width * hi) / 80,
        y1: y - 6,
        y2: y + 30,
      });
    });
    for (const pattern of [
      /9 participants|9 voluntary/u,
      /52–60/u,
      /53–68/u,
      /54–74/u,
      /68 − 53/u,
      /15/u,
      /non appariées|not paired/u,
      /31\.12\.2023/u,
      /11\.2025/u,
    ])
      assert.match(labels, pattern);
    assert.match(desc, /ne s’additionnent pas|cannot be added/u);
    assert.match(desc, /minima et maxima|participant minima and maxima/u);
    assert.match(desc, /aucun classement de pays|neither country rankings/u);
    assert.match(desc, /portefeuilles.*choisis|portfolios.*choice/u);
  }
  return true;
}
export function assertInsuranceRiskSourceFaithful(svg, lang, kind, mobile) {
  assertInsuranceRiskGeometry(svg);
  assertInsuranceRiskQuantitative(svg, INSURANCE_RISK_KINDS.indexOf(kind) + 1);
  assert.equal(sha(svg), sha(insuranceRiskSvg(lang, kind, mobile)));
  return true;
}
export function assertInsuranceRiskRenderedFaithful(svg, lang, kind, mobile) {
  const parsed = parseFragment(svg),
    root = parsed.childNodes.find((n) => n.tagName === "svg");
  assert.ok(root);
  const expected = parseFragment(
    insuranceRiskSvg(lang, kind, mobile),
  ).childNodes.find((n) => n.tagName === "svg");
  assert.deepEqual(root.attrs, expected.attrs);
  // HTML parsing decodes entities and normalizes void syntax. Compare complete
  // canonical subtrees, including every label, attribute, path and source anchor.
  assert.equal(serializeOuter(root), serializeOuter(expected));
  return true;
}
export function assertInsuranceRiskArticleReferences(article) {
  const seen = [...article.matchAll(/id="(source-s\d{2})"/gu)].map((m) => m[1]);
  assert.equal(new Set(seen).size, seen.length);
  for (const id of new Set(INSURANCE_RISK_SOURCES.flatMap((v) => v.split(" "))))
    assert.ok(seen.includes(`source-s${id}`));
  return true;
}
