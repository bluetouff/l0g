import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import opentype from "@shuding/opentype.js";
import { parseFragment, serializeOuter } from "parse5";
import {
  INSURANCE_PROMISE_KINDS,
  INSURANCE_PROMISE_SOURCES,
  insurancePromiseSvg,
} from "../src/lib/insurancePromiseFigures.mjs";
import {
  inspectInsuranceRecaptureSvg,
  assertInsuranceRecaptureGeometry,
  tag,
  attrs,
  nodes,
  content,
} from "./insurance-recapture-svg-assertions.mjs";
export { tag, attrs, nodes, content };
// Only identity changes. Native coordinates, labels, elements and path data
// enter the existing passive-XML, licensed-glyph and connector-clearance engine.
const adapt = (svg) =>
  svg
    .replace(
      /class="l0g-insurance-promise-svg"/gu,
      'class="l0g-insurance-recapture-svg"',
    )
    .replace(
      /((?:id|data-panel)=")insurance-promise-([^"]*)(")/gu,
      "$1insurance-recapture-$2$3",
    )
    .replace(
      /(aria-labelledby=")([^"]+)(")/gu,
      (_m, a, v, b) =>
        a + v.replaceAll("insurance-promise-", "insurance-recapture-") + b,
    )
    .replace(
      /(marker-end="url\(#)insurance-promise-([^"]*)(")/gu,
      "$1insurance-recapture-$2$3",
    )
    .replace(
      /font-family="l0g Insurance Promise"/gu,
      'font-family="l0g Insurance Recapture"',
    );
const sha = (s) => createHash("sha256").update(s).digest("hex");
export const insurancePromiseScenes = () =>
  ["fr", "en"].flatMap((lang) =>
    INSURANCE_PROMISE_KINDS.flatMap((kind, i) =>
      [false, true].map((mobile) => ({
        lang,
        kind,
        mobile,
        figure: i + 1,
        svg: insurancePromiseSvg(lang, kind, mobile),
      })),
    ),
  );
export function inspectInsurancePromiseSvg(svg) {
  assert.equal(typeof svg, "string");
  assert.match(svg, /class="l0g-insurance-promise-svg"/u);
  assert.doesNotMatch(
    svg,
    /insurance-(?:recapture|risk|ret)-|l0g Insurance (?:Recapture|Risk|Returns)/u,
  );
  for (const match of svg.matchAll(/(?:id|data-panel)="([^"]+)"/gu))
    assert.match(
      match[1],
      /^insurance-promise-(?:fr|en)-f[1-3]-(?:d|m)-[a-z0-9.-]+$/u,
    );
  for (const match of svg.matchAll(/font-family="([^"]+)"/gu))
    assert.equal(match[1], "l0g Insurance Promise");
  return inspectInsuranceRecaptureSvg(adapt(svg));
}
// Additional native chart clearance: boxes are computed from the same canonical
// licensed font bytes, not from nominal character widths or screenshots.
const chartFonts = new Map(
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
export function assertInsurancePromiseChartClearance(svg) {
  const { root, all } = inspectInsurancePromiseSvg(svg);
  if (!attrs(root)["aria-labelledby"].includes("-f2-")) return true;
  const labels = all
    .filter((n) => tag(n) === "text")
    .map((n) => {
      const a = attrs(n),
        font = chartFonts.get(Number(a["font-weight"])),
        size = Number(a["font-size"]),
        value = content(n),
        advance = font.getAdvanceWidth(value, size, { kerning: true });
      const x =
        Number(a.x) -
        (a["text-anchor"] === "middle"
          ? advance / 2
          : a["text-anchor"] === "end"
            ? advance
            : 0);
      const glyphBoxes = [];
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
          glyphBoxes.push({
            x1: gx + glyph.xMin * scale,
            x2: gx + glyph.xMax * scale,
            y1: gy - glyph.yMax * scale,
            y2: gy - glyph.yMin * scale,
          });
        },
      );
      assert.ok(glyphBoxes.length, "Visible native chart glyphs required");
      const box = {
        x1: Math.min(...glyphBoxes.map((b) => b.x1)),
        x2: Math.max(...glyphBoxes.map((b) => b.x2)),
        y1: Math.min(...glyphBoxes.map((b) => b.y1)),
        y2: Math.max(...glyphBoxes.map((b) => b.y2)),
      };
      assert.ok(Object.values(box).every(Number.isFinite));
      return { ...box, value, baseline: Number(a.y) };
    });
  const axis = all.find(
    (n) => tag(n) === "line" && attrs(n).id?.endsWith("-axis"),
  );
  assert.ok(axis);
  const ticks = labels
    .filter(
      (n) =>
        n.baseline === Number(attrs(axis).y1) - 14 &&
        /^(?:0|2500|5000|7500|10000)$/u.test(n.value),
    )
    .sort((a, b) => a.x1 - b.x1);
  assert.equal(ticks.length, 5);
  const tickGaps = ticks.slice(1).map((t, i) => t.x1 - ticks[i].x2);
  for (const gap of tickGaps)
    assert.ok(
      gap >= 14,
      `Native tick labels need at least14units of clear space: ${gap}`,
    );
  let minimumBarLabelClearance = Infinity;
  for (const bar of all.filter(
    (n) => tag(n) === "rect" && /-amount-[0-2]$/u.test(attrs(n).id ?? ""),
  )) {
    const a = attrs(bar),
      x1 = Number(a.x),
      x2 = x1 + Number(a.width),
      y1 = Number(a.y),
      y2 = y1 + Number(a.height);
    for (const label of labels) {
      if (label.x1 >= x2 + 8 || label.x2 <= x1 - 8) continue;
      const gap = label.y2 <= y1 ? y1 - label.y2 : label.y1 - y2;
      minimumBarLabelClearance = Math.min(minimumBarLabelClearance, gap);
      assert.ok(
        gap >= 8,
        `Native amount bar ${a.id} needs8units from label: ${label.value} (${gap})`,
      );
    }
  }
  assert.ok(Number.isFinite(minimumBarLabelClearance));
  return { tickGaps, minimumBarLabelClearance };
}
export function assertInsurancePromiseGeometry(svg) {
  inspectInsurancePromiseSvg(svg);
  assertInsuranceRecaptureGeometry(adapt(svg));
  assertInsurancePromiseChartClearance(svg);
  return true;
}
export function assertInsurancePromiseQuantitative(svg, figure) {
  assert.ok([1, 2, 3].includes(figure));
  const { root, all } = inspectInsurancePromiseSvg(svg),
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
  const check = (id, expected) => {
    const got = find(id);
    for (const [k, v] of Object.entries(expected))
      typeof v === "number"
        ? assert.ok(
            Math.abs(Number(got[k]) - v) < 0.002,
            `${id}.${k}: ${got[k]} != ${v}`,
          )
        : assert.equal(got[k], v);
  };
  const segment = (id, x1, y1, x2, y2, dashed = false) =>
    check(id, {
      x1,
      y1,
      x2,
      y2,
      stroke: "var(--color-signal)",
      "marker-end": `url(#${p}-signal-arrow)`,
      ...(dashed ? { "stroke-dasharray": "8 7" } : {}),
    });
  assert.equal(a.viewBox, m ? "0 0 600 930" : "0 0 1000 790");
  assert.match(labels, /24\.10\.2026/u);
  assert.equal(
    all.filter((n) => tag(n) === "a").length,
    0,
    "Sources belong to the shared HTML figcaption",
  );
  if (figure === 1) {
    for (let i = 0; i < 3; i++) {
      const y = m ? 160 + i * 198 : 220 + i * 140;
      segment(
        `control-${i}`,
        m ? 182 : 324,
        m ? y + 52 : y + 56,
        m ? 182 : 374,
        m ? y + 68 : y + 56,
        true,
      );
      segment(
        `benefit-${i}`,
        m ? 340 : 734,
        y + (m ? 124 : 56),
        m ? 376 : 784,
        y + (m ? 124 : 56),
      );
      const b = find(`benefit-${i}`);
      assert.equal(b["stroke-dasharray"], undefined);
      check(`issuer-${i}`, { x: m ? 24 : 374, width: m ? 316 : 360 });
      check(`policy-${i}`, { x: m ? 376 : 784, width: m ? 200 : 192 });
    }
    segment(
      "capital-support",
      m ? 254 : 324,
      m ? 840 : 702,
      m ? 318 : 374,
      m ? 840 : 702,
    );
    assert.match(labels, /Apollo/u);
    assert.match(labels, /KKR/u);
    assert.match(labels, /Brookfield/u);
    assert.match(labels, /MaxRate 5/u);
    assert.match(labels, /SecureFore/u);
    assert.match(labels, /Pension/u);
    assert.match(labels, /régulateur|regulator/u);
    for (const re of [
      /Athene Annuity and Life Company/u,
      /Forethought Life Insurance Company/u,
      /Just Retirement Limited/u,
      /2022/u,
      /2024/u,
      /2026/u,
      /ordinaires|common shares/u,
      /capital/u,
      /seuil|threshold/u,
      /responsabilité des prestations|responsibility for policy benefits/u,
    ])
      assert.match(desc, re);
  } else if (figure === 2) {
    const x = m ? 24 : 330,
      width = m ? 552 : 500;
    [10000, 9800, 8955.084304709473].forEach((v, i) =>
      check(`amount-${i}`, {
        x,
        y: m ? 710 + i * 56 : 566 + i * 54,
        width: (width * v) / 10000,
        height: m ? 10 : 18,
        fill: `var(--color-${["muted", "signal", "topic-blue"][i]})`,
      }),
    );
    check("axis", {
      x1: x,
      x2: x + width,
      y1: m ? 664 : 534,
      y2: m ? 664 : 534,
    });
    for (const tick of [0, 2500, 5000, 7500, 10000])
      check(`tick-${tick}`, {
        x1: x + (width * tick) / 10000,
        x2: x + (width * tick) / 10000,
      });
    if (m) {
      segment("euro-entry", 12, 310, 24, 310);
      segment("units-entry", 12, 515, 24, 515);
      check("alternative-bus-1", { x1: 12, y1: 218, x2: 12, y2: 515 });
    } else {
      segment("euro-entry-2", 249, 260, 249, 300);
      segment("units-entry-1", 751, 260, 751, 300);
    }
    assert.match(labels, /9 800|9,800/u);
    assert.match(labels, /8 955,08|8,955\.08/u);
    assert.match(labels, /99,50094|99\.50094/u);
    assert.match(labels, /0,125|0\.125/u);
    assert.match(labels, /scénario|scenario/u);
    assert.match(labels, /plancher|floor/iu);
    for (const re of [
      /alternatives|alternative/u,
      /10000/u,
      /1er septembre 2026|1 September2026/u,
      /maximum(?: de )?2%/u,
      /99\.500936718994140625/u,
      /8955\.08430470947265625/u,
      /90/u,
      /scénario de marché|market scenario/u,
      /assuré|insured/u,
      /Assureur supposé honorer|insurer is assumed to fulfil/u,
    ])
      assert.match(desc, re);
  } else {
    assert.equal(
      all.filter((n) => tag(n) === "rect").length,
      m ? 1 : 10,
      "Protection paths must not become monetary bars",
    );
    assert.equal(
      all.some((n) => /^.*-axis$/u.test(attrs(n).id ?? "")),
      false,
    );
    for (let i = 0; i < 3; i++)
      if (m) {
        const start = [194, 448, 670][i],
          last = start + (i === 0 ? 5 : i === 1 ? 4 : 5) * 32;
        segment(`rights-${i}`, 12, start + 8, 12, start + 24);
        segment(`outcome-${i}`, 12, start + 42, 12, last - 8);
      } else {
        const x = 176 + i * 324;
        segment(`eligibility-rights-${i}`, x, 348, x, 372);
        segment(`rights-outcome-${i}`, x, 612, x, 634);
      }
    for (const re of [
      /FGAP/u,
      /FSCS/u,
      /FLAHIGA/u,
      /70 000|70,000/u,
      /90 000|90,000/u,
      /250 000|250,000/u,
      /100\s?%/u,
      /[Ff]utures?|future/u,
      /incapacité|incapacity/u,
      /invalidité|disability/u,
      /décès|death/u,
      /[Rr]achat|surrender/u,
      /retrait|withdrawal/u,
      /[Pp]ropriétaire|[Oo]wner/u,
      /[Rr]ésidence|[Rr]esidence/u,
      /liquidation/u,
      /Réassurance|Reinsurance/u,
    ])
      assert.match(labels, re);
    for (const re of [
      /personne et société défaillante|person and insurer/u,
      /contrats concernés regroupés|relevant contracts combined/u,
      /créance éligible d’assurance de long terme|eligible long-term insurance claim/u,
      /Sans plafond monétaire|No monetary cap/u,
      /propriétaire et assureur membre|owner and insurer/u,
      /incapacité.*invalidité|incapacity and disability/u,
      /cas de décès|death-cover/u,
      /déjà échues|already due/u,
      /au-delà du plafond|above the cap/u,
      /recouvrements|recoveries/u,
      /assiettes différentes|different legal bases/u,
    ])
      assert.match(desc, re);
  }
  return true;
}
export function assertInsurancePromiseSourceFaithful(svg, lang, kind, mobile) {
  assertInsurancePromiseGeometry(svg);
  assertInsurancePromiseQuantitative(
    svg,
    INSURANCE_PROMISE_KINDS.indexOf(kind) + 1,
  );
  assert.equal(sha(svg), sha(insurancePromiseSvg(lang, kind, mobile)));
  return true;
}
export function assertInsurancePromiseRenderedFaithful(
  svg,
  lang,
  kind,
  mobile,
) {
  const root = parseFragment(svg).childNodes.find((n) => n.tagName === "svg"),
    expected = parseFragment(
      insurancePromiseSvg(lang, kind, mobile),
    ).childNodes.find((n) => n.tagName === "svg");
  assert.ok(root);
  assert.equal(serializeOuter(root), serializeOuter(expected));
  return true;
}
export function assertInsurancePromiseArticleReferences(article) {
  const seen = [...article.matchAll(/id="(source-s\d{2})"/gu)].map((m) => m[1]);
  assert.equal(seen.length, new Set(seen).size);
  for (const id of new Set(
    INSURANCE_PROMISE_SOURCES.flatMap((s) => s.split(" ")),
  ))
    assert.ok(seen.includes(`source-s${id}`), id);
  return true;
}
