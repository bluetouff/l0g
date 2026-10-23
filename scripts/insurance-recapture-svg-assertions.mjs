import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { parseFragment, serializeOuter } from "parse5";
import {
  INSURANCE_RECAPTURE_KINDS,
  INSURANCE_RECAPTURE_SOURCES,
  insuranceRecaptureSvg,
} from "../src/lib/insuranceRecaptureFigures.mjs";
import {
  inspectInsuranceRiskSvg,
  assertInsuranceRiskGeometry,
  tag,
  attrs,
  nodes,
  content,
} from "./insurance-risk-svg-assertions.mjs";
export { tag, attrs, nodes, content };
// Identity-only adapter: native coordinates, text, elements and path data are
// unchanged. Passive XML/path allow-lists, actual licensed glyph bounds and
// every line-segment/arrow clearance remain active in the shared06 engine.
const adapt = (svg) =>
  svg
    .replace(
      /class="l0g-insurance-recapture-svg"/gu,
      'class="l0g-insurance-risk-svg"',
    )
    .replace(
      /((?:id|data-panel)=")insurance-recapture-([^"]*)(")/gu,
      "$1insurance-risk-$2$3",
    )
    .replace(
      /(aria-labelledby=")([^"]+)(")/gu,
      (_m, a, v, b) =>
        a + v.replaceAll("insurance-recapture-", "insurance-risk-") + b,
    )
    .replace(
      /(marker-end="url\(#)insurance-recapture-([^"]*)(")/gu,
      "$1insurance-risk-$2$3",
    )
    .replace(
      /font-family="l0g Insurance Recapture"/gu,
      'font-family="l0g Insurance Risk"',
    );
const sha = (s) => createHash("sha256").update(s).digest("hex");
export const insuranceRecaptureScenes = () =>
  ["fr", "en"].flatMap((lang) =>
    INSURANCE_RECAPTURE_KINDS.flatMap((kind, i) =>
      [false, true].map((mobile) => ({
        lang,
        kind,
        mobile,
        figure: i + 1,
        svg: insuranceRecaptureSvg(lang, kind, mobile),
      })),
    ),
  );
export function inspectInsuranceRecaptureSvg(svg) {
  assert.equal(typeof svg, "string");
  assert.match(svg, /class="l0g-insurance-recapture-svg"/u);
  assert.doesNotMatch(
    svg,
    /insurance-risk-|l0g Insurance Risk|l0g-insurance-risk-svg/u,
  );
  const transformed = adapt(svg),
    inspected = inspectInsuranceRiskSvg(transformed);
  // Inspect the real namespace as well: pre-existing wrong IDs are never fixed.
  for (const match of svg.matchAll(/(?:id|data-panel)="([^"]+)"/gu))
    assert.match(
      match[1],
      /^insurance-recapture-(?:fr|en)-f[1-4]-(?:d|m)-[a-z0-9.-]+$/u,
    );
  for (const match of svg.matchAll(/font-family="([^"]+)"/gu))
    assert.equal(match[1], "l0g Insurance Recapture");
  return inspected;
}
export function assertInsuranceRecaptureGeometry(svg) {
  inspectInsuranceRecaptureSvg(svg);
  assertInsuranceRiskGeometry(adapt(svg));
  return true;
}
export function assertInsuranceRecaptureQuantitative(svg, figure) {
  const { root, all } = inspectInsuranceRecaptureSvg(svg),
    a = attrs(root),
    m = a.viewBox.startsWith("0 0 600 "),
    p = a["aria-labelledby"].split(" ")[0].slice(0, -6);
  const labels = all
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
  const segment = (id, x1, y1, x2, y2, arrow = false) =>
    check(id, {
      x1,
      y1,
      x2,
      y2,
      stroke: "var(--color-signal)",
      ...(arrow ? { "marker-end": `url(#${p}-signal-arrow)` } : {}),
    });
  assert.equal(a.viewBox, m ? "0 0 600 930" : "0 0 1000 790");
  assert.deepEqual(
    all.filter((n) => tag(n) === "a").map((n) => attrs(n).href),
    INSURANCE_RECAPTURE_SOURCES[figure - 1]
      .split(" ")
      .map((s) => `#source-s${s}`),
  );
  assert.match(labels, /23\.10\.2026/u);
  if (figure === 1) {
    segment(
      "stage-1-to-2",
      m ? 300 : 454,
      m ? 282 : 265,
      m ? 300 : 526,
      m ? 310 : 265,
      true,
    );
    segment(
      "common-branch-0",
      m ? 300 : 751,
      m ? 420 : 320,
      m ? 300 : 751,
      m ? 448 : 354,
    );
    segment(
      "common-branch-1",
      m ? 300 : 751,
      m ? 448 : 354,
      m ? 157 : 249,
      m ? 448 : 354,
    );
    if (m) segment("branch-right", 300, 448, 443, 448);
    segment(
      "central-entry",
      m ? 157 : 249,
      m ? 448 : 354,
      m ? 157 : 249,
      m ? 474 : 388,
      true,
    );
    segment(
      "recapture-entry",
      m ? 443 : 751,
      m ? 448 : 354,
      m ? 443 : 751,
      m ? 474 : 388,
      true,
    );
    segment(
      "recapture-result",
      m ? 443 : 751,
      m ? 628 : 532,
      m ? 443 : 751,
      m ? 664 : 566,
      true,
    );
    check("result", {
      x: m ? 24 : 526,
      y: m ? 664 : 566,
      width: m ? 552 : 450,
    });
    check("central", { x: 24, y: m ? 474 : 388, width: m ? 266 : 450 });
    check("recapture", {
      x: m ? 310 : 526,
      y: m ? 474 : 388,
      width: m ? 266 : 450,
    });
    assert.match(labels, /12,3|12\.3/u);
    assert.match(labels, /50\s?%/u);
    assert.match(labels, /11 entités|11 entities/u);
    assert.match(labels, /01\.01\.2016/u);
    assert.match(desc, /2016/u);
    assert.match(desc, /Section C|Section C/u);
    assert.match(desc, /sous-échantillon|subset/u);
    assert.match(desc, /hors intragroupe|intra-?group/u);
    assert.match(
      desc,
      /contrepartie.*plus défavorable|counterparty.*largest.*adverse/u,
    );
    assert.match(desc, /sans durée ni volume|without proportional time/u);
    assert.match(desc, /sans probabilité cible|no target probability/u);
    assert.match(desc, /baisse de l’immobilier|falling property values/u);
  } else if (figure === 2) {
    const x = m ? 24 : 320,
      width = m ? 552 : 620;
    [
      [154, 152.46],
      [100, 106],
    ].forEach((pair, i) =>
      pair.forEach((v, j) =>
        check(`index-${i}-${j}`, {
          x,
          y: m ? 414 + i * 185 + j * 72 : 398 + i * 150 + j * 55,
          width: (width * v) / 160,
          height: 18,
          fill: `var(--color-${j ? "topic-blue" : "signal"})`,
        }),
      ),
    );
    assert.match(labels, /154 % → 144 %/u);
    assert.match(labels, /−10/u);
    assert.match(labels, /152,46|152\.46/u);
    assert.match(labels, /143,83|143\.83|environ 144/u);
    assert.match(labels, /\+6\s?%/u);
    assert.match(labels, /−1\s?%/u);
    assert.match(desc, /arrond|rounded/u);
    assert.match(desc, /pédagogiques|[Ii]llustrativ/u);
    assert.match(desc, /aucun montant|without reconstruct/u);
  } else if (figure === 3) {
    for (const id of ["assets", "hold", "sell", "ma", "cash", "facility"]) {
      if (m && id === "ma") continue;
      find(id);
    }
    segment(
      "hold-entry-0",
      m ? 300 : 351,
      m ? 392 : 357,
      m ? 300 : 351,
      m ? 418 : 385,
    );
    segment(
      "hold-entry-1",
      m ? 300 : 351,
      m ? 418 : 385,
      m ? 154 : 176,
      m ? 418 : 385,
    );
    segment(
      "hold-entry-2",
      m ? 154 : 176,
      m ? 418 : 385,
      m ? 154 : 176,
      m ? 440 : 410,
      true,
    );
    segment(
      "sell-entry-0",
      m ? 300 : 351,
      m ? 418 : 385,
      m ? 446 : 526,
      m ? 418 : 385,
    );
    segment(
      "sell-entry-1",
      m ? 446 : 526,
      m ? 418 : 385,
      m ? 446 : 526,
      m ? 440 : 410,
      true,
    );
    if (m) segment("assets-ma-2", 590, 839, 576, 839, true);
    else segment("assets-ma", 678, 326, 712, 326, true);
    segment(
      "facility-cash",
      m ? 284 : 712,
      m ? 663 : 618,
      m ? 316 : 678,
      m ? 663 : 618,
      true,
    );
    for (let i = 0; i < 3; i++)
      segment(
        `outgoing-${i}`,
        m ? 112 + i * 188 : 132 + i * 218,
        m ? 744 : 678,
        m ? 112 + i * 188 : 132 + i * 218,
        m ? 756 : 698,
        true,
      );
    assert.match(labels, /6 mois|6 months/u);
    assert.match(labels, /J1|Day 1/u);
    assert.match(labels, /Section C\s?: a–d/u);
    assert.match(labels, /Contrôle MA|Separate MA check|MA eligibility/u);
    assert.match(labels, /[Pp]oints bas|low points/u);
    assert.match(desc, /propriété bénéficiaire|beneficial ownership/u);
    assert.match(desc, /propriété juridique|legal ownership/u);
    assert.match(desc, /marché.*liquide|liquid.*market/u);
    assert.match(desc, /préarrangées|pre-arranged|prearranged/u);
    assert.match(
      desc,
      /ne garantissent aucun délai réel|not guarantee actual transfer/u,
    );
  } else {
    const x = m ? 24 : 450,
      width = m ? 552 : 500;
    [3.4, 0.9].forEach((v, i) =>
      check(`sales-${i}`, {
        x,
        y: m ? 380 + i * 102 : 350 + i * 66,
        width: (width * v) / 4,
        height: 22,
        fill: `var(--color-${i ? "topic-blue" : "signal"})`,
      }),
    );
    assert.match(labels, /25\s?%/u);
    assert.match(labels, /ERM/u);
    assert.match(labels, /11 entités|11 entities/u);
    assert.match(labels, /0,8|0\.8/u);
    assert.match(labels, /−1 point/u);
    assert.match(labels, /central|core/u);
    assert.match(
      desc,
      /collatéral repris.*exclu|recaptured collateral.*excluded/u,
    );
    assert.match(desc, /après impôt|post-tax/u);
    assert.match(desc, /3,4|3\.4/u);
    assert.match(desc, /0,9|0\.9/u);
    assert.match(desc, /ne mesurent pas le coût|not.*cost/u);
    assert.match(desc, /périmètre plus large|wider scope/u);
    segment(
      "credit-branch-2",
      m ? 157 : 249,
      m ? 616 : 580,
      m ? 157 : 249,
      m ? 640 : 594,
      true,
    );
    if (m) segment("own-funds-branch-1", 443, 616, 443, 640, true);
    else segment("own-funds-branch", 751, 580, 751, 594, true);
  }
  return true;
}
export function assertInsuranceRecaptureSourceFaithful(
  svg,
  lang,
  kind,
  mobile,
) {
  assertInsuranceRecaptureGeometry(svg);
  assertInsuranceRecaptureQuantitative(
    svg,
    INSURANCE_RECAPTURE_KINDS.indexOf(kind) + 1,
  );
  assert.equal(sha(svg), sha(insuranceRecaptureSvg(lang, kind, mobile)));
  return true;
}
export function assertInsuranceRecaptureRenderedFaithful(
  svg,
  lang,
  kind,
  mobile,
) {
  const root = parseFragment(svg).childNodes.find((n) => n.tagName === "svg"),
    expected = parseFragment(
      insuranceRecaptureSvg(lang, kind, mobile),
    ).childNodes.find((n) => n.tagName === "svg");
  assert.ok(root);
  assert.equal(serializeOuter(root), serializeOuter(expected));
  return true;
}
export function assertInsuranceRecaptureArticleReferences(article) {
  const seen = [...article.matchAll(/id="(source-s\d{2})"/gu)].map((m) => m[1]);
  assert.equal(seen.length, new Set(seen).size);
  for (const id of new Set(
    INSURANCE_RECAPTURE_SOURCES.flatMap((s) => s.split(" ")),
  ))
    assert.ok(seen.includes(`source-s${id}`));
  return true;
}
