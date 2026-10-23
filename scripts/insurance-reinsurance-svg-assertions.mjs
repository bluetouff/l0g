import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { parseFragment } from "parse5";
import { readFileSync } from "node:fs";
import { XMLParser, XMLValidator } from "fast-xml-parser";
import opentype from "@shuding/opentype.js";
import {
  INSURANCE_REINSURANCE_KINDS,
  insuranceReinsuranceSvg,
  INSURANCE_REINSURANCE_SOURCES,
} from "../src/lib/insuranceReinsuranceFigures.mjs";
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
  preserveOrder: true,
  trimValues: false,
  parseTagValue: false,
});
export const tag = (n) => Object.keys(n).find((k) => k !== ":@");
export const attrs = (n) => n[":@"] ?? {};
export const nodes = (n) => [
  n,
  ...(n[tag(n)] ?? []).filter((c) => tag(c) !== "#text").flatMap(nodes),
];
export const content = (n) =>
  (n[tag(n)] ?? [])
    .map((c) => (tag(c) === "#text" ? c["#text"] : content(c)))
    .join("");
const fonts = new Map(
  [400, 700].map((w) => {
    const b = readFileSync(
      new URL(
        `../public/fonts/stablecoins/dejavu-sans-${w}.ttf`,
        import.meta.url,
      ),
    );
    return [
      w,
      opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength)),
    ];
  }),
);
const allowed = {
  svg: "xmlns viewBox style class role aria-labelledby",
  title: "id",
  desc: "id",
  defs: "",
  marker: "id viewBox refX refY markerWidth markerHeight orient markerUnits",
  path: "id d fill stroke stroke-width stroke-dasharray marker-end",
  rect: "id x y width height rx fill stroke stroke-width",
  text: "data-panel data-max-width x y font-family font-size font-weight text-anchor fill",
  line: "id x1 y1 x2 y2 stroke stroke-width stroke-dasharray marker-end",
  circle: "id cx cy r fill stroke stroke-width",
  a: "href",
};
const bounded = (n) => {
  assert.match(n, /^[+-]?(?:\d{1,4}(?:\.\d{0,18})?|\.\d{1,18})$/u);
  assert.ok(Number.isFinite(Number(n)) && Math.abs(Number(n)) <= 10000);
  return Number(n);
};
export function pathPoints(d) {
  assert.equal(typeof d, "string");
  assert.ok(d.length < 10000);
  const tokens = [],
    token = /[MLHVZ]|[+-]?(?:\d+(?:\.\d*)?|\.\d+)/uy;
  let offset = 0;
  while (offset < d.length) {
    if (/\s/u.test(d[offset])) {
      offset++;
      continue;
    }
    token.lastIndex = offset;
    const m = token.exec(d);
    assert.ok(m, "Entire path consumed");
    if (!/^[MLHVZ]$/u.test(m[0])) bounded(m[0]);
    tokens.push(m[0]);
    offset = token.lastIndex;
  }
  assert.ok(tokens.length < 1024);
  assert.equal(tokens[0], "M");
  let i = 0,
    x,
    y,
    origin;
  const points = [],
    value = () => {
      assert.ok(i < tokens.length);
      return bounded(tokens[i++]);
    };
  while (i < tokens.length) {
    const c = tokens[i++];
    if (c === "M" || c === "L") {
      x = value();
      y = value();
      if (c === "M") {
        assert.equal(origin, undefined);
        origin = [x, y];
      }
    } else if (c === "H") x = value();
    else if (c === "V") y = value();
    else {
      assert.equal(c, "Z");
      assert.ok(origin);
      [x, y] = origin;
    }
    points.push([x, y]);
  }
  return points;
}
export function inspectInsuranceReinsuranceSvg(svg) {
  assert.equal(typeof svg, "string");
  assert.ok(svg.length > 100 && svg.length < 40000);
  assert.doesNotMatch(svg, /<!DOCTYPE|<!ENTITY|<!\[CDATA\[|<\?/iu);
  assert.equal(XMLValidator.validate(svg), true);
  const roots = parser.parse(svg);
  assert.equal(roots.length, 1);
  const root = roots[0],
    a = attrs(root),
    all = nodes(root);
  assert.equal(tag(root), "svg");
  assert.equal(a.xmlns, "http://www.w3.org/2000/svg");
  assert.equal(a.style, "width:100%;height:auto");
  assert.equal(a.class, "l0g-insurance-reinsurance-svg");
  assert.equal(a.role, "img");
  assert.match(a.viewBox, /^0 0 (?:600|1000) \d{3,4}$/u);
  const ids = all.map((n) => attrs(n).id).filter(Boolean);
  assert.equal(ids.length, new Set(ids).size);
  assert.ok(all.length < 700);
  for (const id of a["aria-labelledby"].split(" "))
    assert.ok(
      all.some(
        (n) =>
          attrs(n).id === id &&
          ["title", "desc"].includes(tag(n)) &&
          content(n).trim(),
      ),
    );
  for (const n of all) {
    assert.ok(Object.hasOwn(allowed, tag(n)), `Forbidden ${tag(n)}`);
    for (const [k, v] of Object.entries(attrs(n))) {
      assert.ok(allowed[tag(n)].split(" ").includes(k), `Forbidden ${k}`);
      assert.equal(typeof v, "string");
      assert.ok(v.length < 10000);
      if (
        [
          "x",
          "y",
          "width",
          "height",
          "rx",
          "r",
          "cx",
          "cy",
          "x1",
          "x2",
          "y1",
          "y2",
          "font-size",
          "font-weight",
          "stroke-width",
          "refX",
          "refY",
          "markerWidth",
          "markerHeight",
          "data-max-width",
        ].includes(k)
      )
        bounded(v);
      if (k === "d") pathPoints(v);
      if (k === "id")
        assert.match(v, /^insurance-re-(?:fr|en)-f[1-5]-(?:d|m)-[a-z0-9.-]+$/u);
      if (k === "font-family") assert.equal(v, "l0g Insurance Reinsurance");
      if (k === "font-size") assert.ok(Number(v) >= 28 && Number(v) <= 38);
      if (k === "font-weight") assert.ok(["400", "700"].includes(v));
      if (k === "text-anchor")
        assert.ok(["start", "end", "middle"].includes(v));
      if (k === "href") {
        assert.match(v, /^#source-s(?:0[1-9]|[1-3][0-9]|4[0-7])$/u);
        assert.equal(v, "#source-" + content(n).toLowerCase());
      }
      if (k === "markerUnits") assert.equal(v, "userSpaceOnUse");
      if (["fill", "stroke"].includes(k))
        assert.match(
          v,
          /^(?:none|var\(--color-(?:ink|surface|surface-2|paper|muted|line-strong|signal|amber|accent|topic-blue)\))$/u,
        );
      if (k === "marker-end") {
        const m = v.match(/^url\(#([a-z0-9-]+)\)$/u);
        assert.ok(m && ids.includes(m[1]));
      }
      if (k === "stroke-dasharray") assert.equal(v, "8 7");
    }
  }
  return { root, all };
}
export function assertInsuranceReinsuranceGeometry(svg) {
  const { root, all } = inspectInsuranceReinsuranceSvg(svg),
    [, , w, h] = attrs(root).viewBox.split(" ").map(Number),
    visible = (n) =>
      tag(n) === "defs"
        ? []
        : [
            n,
            ...(n[tag(n)] ?? [])
              .filter((c) => tag(c) !== "#text")
              .flatMap(visible),
          ],
    boxes = [];
  const point = (x, y) =>
    assert.ok(
      Number.isFinite(x) &&
        Number.isFinite(y) &&
        x >= -0.01 &&
        y >= -0.01 &&
        x <= w + 0.01 &&
        y <= h + 0.01,
      `Outside ${w}×${h}: ${x}, ${y}`,
    );
  for (const n of visible(root)) {
    const a = attrs(n),
      numb = (k) => Number(a[k]);
    if (tag(n) === "rect") {
      point(numb("x"), numb("y"));
      point(numb("x") + numb("width"), numb("y") + numb("height"));
      assert.ok(numb("width") >= 0 && numb("height") >= 0);
    }
    if (tag(n) === "line") {
      point(numb("x1"), numb("y1"));
      point(numb("x2"), numb("y2"));
    }
    if (tag(n) === "path") for (const p of pathPoints(a.d)) point(...p);
    if (tag(n) === "circle") {
      point(numb("cx") - numb("r"), numb("cy") - numb("r"));
      point(numb("cx") + numb("r"), numb("cy") + numb("r"));
    }
    if (tag(n) === "text") {
      const value = content(n),
        font = fonts.get(Number(a["font-weight"])),
        size = numb("font-size"),
        advance = font.getAdvanceWidth(value, size, { kerning: true });
      for (const c of value)
        assert.ok(font.charToGlyphIndex(c) !== 0, `Missing glyph ${c}`);
      const x =
          numb("x") -
          (a["text-anchor"] === "middle"
            ? advance / 2
            : a["text-anchor"] === "end"
              ? advance
              : 0),
        bounds = { x1: Infinity, y1: Infinity, x2: -Infinity, y2: -Infinity };
      font.forEachGlyph(value, x, numb("y"), size, {}, (glyph, gx, gy) => {
        if (
          !Number.isFinite(glyph.xMin) ||
          (glyph.xMin === glyph.xMax && glyph.yMin === glyph.yMax)
        )
          return;
        const scale = size / font.unitsPerEm;
        bounds.x1 = Math.min(bounds.x1, gx + glyph.xMin * scale);
        bounds.x2 = Math.max(bounds.x2, gx + glyph.xMax * scale);
        bounds.y1 = Math.min(bounds.y1, gy - glyph.yMax * scale);
        bounds.y2 = Math.max(bounds.y2, gy - glyph.yMin * scale);
      });
      point(bounds.x1, bounds.y1);
      point(bounds.x2, bounds.y2);
      if (numb("y") < h - 47)
        assert.ok(
          bounds.y2 <= h - 51,
          `Body label retains a gutter above the source rule: ${value}`,
        );
      if (a["data-max-width"])
        assert.ok(
          advance <= Number(a["data-max-width"]) + 0.1,
          `Text too wide: ${value} (${advance} > ${a["data-max-width"]})`,
        );
      if (a["data-panel"]) {
        const panel = all.find(
          (n) => tag(n) === "rect" && attrs(n).id === a["data-panel"],
        );
        assert.ok(panel);
        const p = attrs(panel);
        assert.ok(
          bounds.x1 >= Number(p.x) + 7 &&
            bounds.x2 <= Number(p.x) + Number(p.width) - 7 &&
            bounds.y1 >= Number(p.y) + 7 &&
            bounds.y2 <= Number(p.y) + Number(p.height) - 7,
          `Outside panel: ${value}`,
        );
      }
      boxes.push({ value, node: n, panel: a["data-panel"], ...bounds });
    }
  }
  for (const [i, a] of boxes.entries())
    for (const b of boxes.slice(i + 1)) {
      const ox = Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1),
        oy = Math.min(a.y2, b.y2) - Math.max(a.y1, b.y1);
      assert.ok(
        ox <= 1 || oy <= 1,
        `Overlapping labels: ${a.value} / ${b.value}`,
      );
    }
  const panels = all.filter(
    (n) => tag(n) === "rect" && Number(attrs(n).rx) === 8,
  );
  for (const b of boxes)
    for (const panel of panels) {
      const a = attrs(panel);
      if (b.panel === a.id) continue;
      const ox =
          Math.min(b.x2, Number(a.x) + Number(a.width)) -
          Math.max(b.x1, Number(a.x)),
        oy =
          Math.min(b.y2, Number(a.y) + Number(a.height)) -
          Math.max(b.y1, Number(a.y));
      assert.ok(
        ox <= 0 || oy <= 0,
        `A label cannot cross an unrelated panel: ${b.value}`,
      );
    }
  for (const route of all.filter(
    (n) => ["path", "line"].includes(tag(n)) && attrs(n)["marker-end"],
  )) {
    const a = attrs(route);
    const pts =
      tag(route) === "path"
        ? pathPoints(a.d)
        : [
            [Number(a.x1), Number(a.y1)],
            [Number(a.x2), Number(a.y2)],
          ];
    for (let i = 1; i < pts.length; i++)
      for (let k = 0; k <= 100; k++) {
        const x = pts[i - 1][0] + ((pts[i][0] - pts[i - 1][0]) * k) / 100,
          y = pts[i - 1][1] + ((pts[i][1] - pts[i - 1][1]) * k) / 100;
        for (const b of boxes)
          assert.ok(
            !(x > b.x1 - 1 && x < b.x2 + 1 && y > b.y1 - 1 && y < b.y2 + 1),
            `A data line cannot cross a label: ${b.value}`,
          );
      }
  }
  if (w === 1000) assert.ok((h * 704) / w <= 560, "Compact desktop");
  else assert.ok((h * 480) / w <= 750, "Compact mobile");
  return true;
}

export function assertInsuranceReinsuranceQuantitative(svg, figure) {
  const { root, all } = inspectInsuranceReinsuranceSvg(svg),
    a = attrs(root),
    mobile = a.viewBox.startsWith("0 0 600 "),
    prefix = a["aria-labelledby"].split(" ")[0].slice(0, -6);
  const find = (id) => {
    const n = all.find((n) => attrs(n).id === `${prefix}-${id}`);
    assert.ok(n, id);
    return attrs(n);
  };
  const near = (actual, expected) =>
    assert.ok(
      Math.abs(Number(actual) - expected) < 0.002,
      `${actual} != ${expected}`,
    );
  const labels = all
      .filter((n) => tag(n) === "text")
      .map(content)
      .join(" "),
    desc = content(all.find((n) => tag(n) === "desc"));
  assert.deepEqual(
    all.filter((n) => tag(n) === "a").map((n) => attrs(n).href),
    INSURANCE_REINSURANCE_SOURCES[figure - 1]
      .split(" ")
      .map((s) => "#source-s" + s),
  );
  assert.match(labels, /23\.10\.2026/u);
  if (figure === 1) {
    for (const id of [
      "policyholder",
      "jackson",
      "assets",
      "alre",
      "apollo",
      "acra",
    ])
      find(id);
    for (const name of [
      "Jackson",
      "Bank of New",
      "York Mellon",
      "Athene Life Re",
      "Apollo Insurance",
      "Solutions Group LP",
      "ACRA 1A Ltd.",
      "2020",
    ])
      assert.ok((labels + " " + desc).includes(name), name);
    assert.match(desc, /100 %|100%/u);
    assert.match(desc, /initial/iu);
    assert.match(desc, /18 juin 2020|18 June 2020/u);
    assert.match(desc, /propriété et possession|legal title and possession/u);
    assert.match(labels, /accord|consent/iu);
  }
  if (figure === 2) {
    for (const id of ["account", "jackson", "alre", "settlement"]) find(id);
    for (const ref of ["6.02(d)", "6.02(g)", "5.04"])
      assert.ok(labels.includes(ref));
    assert.match(labels, /trimestriel|Quarterly/u);
    assert.match(labels, /complément|complété|topped up|top-up/u);
    assert.match(desc, /6\.02\(c\)/u);
    assert.match(desc, /solde calculé|calculated balance/u);
  }
  if (figure === 3) {
    const panels = [0, 1, 2].map((i) => find("collateral-" + i));
    for (const panel of panels.slice(1)) {
      assert.equal(panel.width, panels[0].width);
      assert.equal(panel.height, panels[0].height);
    }
    assert.match(labels, /30\.06\.2026/u);
    assert.match(labels, /env\. 57 M\$|about \$57m/u);
    assert.match(labels, /1,1 Md\$|\$1\.1bn/u);
    assert.match(labels, /statutaire|statutory/iu);
    assert.match(desc, /book value|valeur comptable/u);
    assert.match(desc, /ratio de couverture|coverage ratio/u);
    assert.match(desc, /condition/iu);
  }
  if (figure === 4) {
    find("ecr");
    find("rbc");
    find("persistence");
    find("topup");
    find("recapture");
    for (const [metric, expected, excluded] of [
      ["ecr", [135, 120], [250, 200]],
      ["rbc", [250, 200], [135, 120]],
    ]) {
      const panelLabels = all
        .filter(
          (n) =>
            tag(n) === "text" &&
            attrs(n)["data-panel"] === `${prefix}-${metric}`,
        )
        .map(content)
        .join(" ");
      for (const threshold of expected)
        assert.match(
          panelLabels,
          new RegExp("< " + threshold + "(?: %|%)", "u"),
        );
      for (const threshold of excluded)
        assert.doesNotMatch(
          panelLabels,
          new RegExp("< " + threshold + "(?: %|%)", "u"),
        );
    }
    for (const v of [135, 120, 250, 200])
      assert.match(labels, new RegExp("< " + v + "(?: %|%)", "u"));
    assert.match(labels, /2020/u);
    assert.match(
      labels,
      /trimestre suivant|next quarter end|following quarter/u,
    );
    assert.match(labels, /Un seul ratio|Either ratio/u);
    assert.match(desc, /five business days|cinq jours ouvrés/u);
    assert.match(desc, /notification|notice/u);
    assert.match(
      desc,
      /dénominateurs distincts|distinct definitions and denominators/u,
    );
    assert.match(desc, /choix|décision|option/iu);
    assert.match(labels, /5 à 30|5–30/u);
  }
  if (figure === 5) {
    const percentages = [
        (219 / 657) * 100,
        (429.8 / 601.3) * 100,
        (326 / 657) * 100,
        (55.6 / 601.3) * 100,
      ],
      start = mobile ? 24 : 330,
      scale = (mobile ? 552 : 500) / 100,
      ys = mobile ? [480, 565, 725, 810] : [394, 454, 594, 654];
    percentages.forEach((v, i) => {
      const bar = find("share-" + i),
        track = find("track-" + i);
      near(bar.x, start);
      near(bar.y, ys[i]);
      near(bar.width, v * scale);
      near(bar.height, 24);
      near(track.x, start);
      near(track.width, 100 * scale);
      assert.equal(bar.fill, `var(--color-${i % 2 ? "signal" : "topic-blue"})`);
      assert.equal(bar.stroke, "none");
    });
    for (const t of [0, 50, 100]) near(find("tick-" + t).x1, start + t * scale);
    for (const v of ["657", "86", "2024"]) assert.ok(labels.includes(v));
    assert.match(labels, /601[.,]3/u);
    for (const v of [33.3, 71.5, 49.6, 9.2])
      assert.ok(
        labels.includes(v.toFixed(1)) ||
          labels.includes(v.toFixed(1).replace(".", ",")),
      );
    for (const v of [
      "154",
      "65",
      "219",
      "250",
      "179",
      "429",
      "326",
      "55",
      "601.4",
      "601,4",
    ])
      if (v === "601.4" || v === "601,4") {
        assert.ok(desc.includes("601.4") || desc.includes("601,4"));
      } else assert.ok(desc.includes(v), v);
  }
  const expected =
    figure === 1
      ? [
          "benefits",
          "ownership",
          "reinsurance",
          "management",
          "consent",
          "retrocession",
        ]
      : figure === 2
        ? ["withdrawals", "economic", "settlement-right", "settlement-left"]
        : [];
  const arrows = all.filter((n) => attrs(n)["marker-end"]);
  assert.deepEqual(
    arrows.map((n) => attrs(n).id),
    expected.map((id) => `${prefix}-${id}`),
  );
  for (const arrow of arrows) {
    const ar = attrs(arrow),
      marker = all.find(
        (n) =>
          tag(n) === "marker" && attrs(n).id === ar["marker-end"].slice(5, -1),
      );
    assert.ok(marker);
    assert.equal(
      attrs(nodes(marker).find((n) => tag(n) === "path")).stroke,
      ar.stroke,
    );
    assert.notEqual(ar.stroke, "none");
    const points = pathPoints(ar.d);
    assert.ok(points.length >= 2);
    const first = points[0],
      last = points.at(-1);
    assert.ok(Math.hypot(last[0] - first[0], last[1] - first[1]) > 20);
    const id = ar.id.slice(prefix.length + 1);
    if (["benefits", "consent", "settlement-left"].includes(id))
      assert.ok(last[0] < first[0]);
    if (id === "settlement-right") assert.ok(last[0] > first[0]);
    if (
      [
        "ownership",
        "reinsurance",
        "retrocession",
        "withdrawals",
        "economic",
      ].includes(id)
    )
      assert.ok(last[1] > first[1]);
    if (id === "management") assert.ok(last[1] < first[1]);
    if (id === "economic") assert.equal(ar["stroke-dasharray"], "8 7");
    else assert.equal(ar["stroke-dasharray"], undefined);
    for (const shape of all
      .slice(all.indexOf(arrow) + 1)
      .filter((n) => tag(n) === "rect")) {
      const b = attrs(shape);
      for (let i = 1; i < points.length; i++)
        for (let j = 0; j <= 50; j++) {
          const x =
              points[i - 1][0] + ((points[i][0] - points[i - 1][0]) * j) / 50,
            y = points[i - 1][1] + ((points[i][1] - points[i - 1][1]) * j) / 50;
          assert.ok(
            !(
              x > Number(b.x) + 0.5 &&
              x < Number(b.x) + Number(b.width) - 0.5 &&
              y > Number(b.y) + 0.5 &&
              y < Number(b.y) + Number(b.height) - 0.5
            ),
            "Relationship remains visible",
          );
        }
    }
  }
  return true;
}
export const insuranceReinsuranceScenes = () =>
  ["fr", "en"].flatMap((lang) =>
    INSURANCE_REINSURANCE_KINDS.flatMap((kind, i) =>
      [false, true].map((mobile) => ({
        lang,
        kind,
        figure: i + 1,
        mobile,
        svg: insuranceReinsuranceSvg(lang, kind, mobile),
      })),
    ),
  );
export function assertInsuranceReinsuranceSourceFaithful(
  svg,
  lang,
  kind,
  mobile,
) {
  inspectInsuranceReinsuranceSvg(svg);
  assert.equal(
    createHash("sha256").update(svg).digest("hex"),
    HASHES[`${lang}-${kind}-${mobile ? "m" : "d"}`],
    "Reviewed complete bilingual data and composition",
  );
  return true;
}
const htmlNodes = (n) => [n, ...(n.childNodes ?? []).flatMap(htmlNodes)],
  htmlAttrs = (n) =>
    Object.fromEntries((n.attrs ?? []).map((a) => [a.name, a.value])),
  htmlText = (n) =>
    n.nodeName === "#text"
      ? n.value
      : (n.childNodes ?? []).map(htmlText).join("");
const projection = (n) =>
  n.nodeName === "#comment"
    ? null
    : n.nodeName === "#text"
      ? n.value.trim()
        ? { text: n.value }
        : null
      : {
          tag: n.tagName ?? n.nodeName,
          attrs: Object.fromEntries(
            (n.attrs ?? [])
              .map((a) => [a.name, a.value])
              .sort(([a], [b]) => a.localeCompare(b)),
          ),
          children: (n.childNodes ?? []).map(projection).filter(Boolean),
        };
export function assertInsuranceReinsuranceRenderedFaithful(
  svg,
  lang,
  kind,
  mobile,
) {
  const original = insuranceReinsuranceSvg(lang, kind, mobile);
  assertInsuranceReinsuranceSourceFaithful(original, lang, kind, mobile);
  assertInsuranceReinsuranceGeometry(svg);
  assertInsuranceReinsuranceQuantitative(
    svg,
    INSURANCE_REINSURANCE_KINDS.indexOf(kind) + 1,
  );
  assert.deepEqual(
    projection(parseFragment(svg)),
    projection(parseFragment(original)),
    "Complete native SVG survives Astro compilation",
  );
  return true;
}
export function assertInsuranceReinsuranceArticleReferences(article) {
  const all = htmlNodes(parseFragment(article)),
    expected = Array.from(
      { length: 31 },
      (_, i) => "source-s" + String(i + 1).padStart(2, "0"),
    ),
    entries = all.filter(
      (n) =>
        n.tagName === "li" && /^source-s\d{2}$/u.test(htmlAttrs(n).id ?? ""),
    );
  assert.deepEqual(
    entries.map((n) => htmlAttrs(n).id),
    expected,
  );
  const lists = all.filter(
    (n) =>
      n.tagName === "ol" &&
      (htmlAttrs(n).class ?? htmlAttrs(n).classname ?? "")
        .split(" ")
        .includes("sources-list"),
  );
  assert.equal(lists.length, 1);
  assert.deepEqual(
    htmlNodes(lists[0])
      .filter((n) => n.tagName === "li")
      .map((n) => htmlAttrs(n).id),
    expected,
  );
  for (const entry of entries) {
    assert.ok(htmlText(entry).trim().length > 60);
    assert.ok(
      htmlNodes(entry).some(
        (n) =>
          n.tagName === "a" && /^https:\/\//u.test(htmlAttrs(n).href ?? ""),
      ),
    );
  }
  for (const n of all.filter(
    (n) =>
      n.tagName === "a" && (htmlAttrs(n).href ?? "").startsWith("#source-"),
  ))
    assert.ok(expected.includes(htmlAttrs(n).href.slice(1)));
  return true;
}
const HASHES = {
  "fr-responsibilities-d":
    "1f4a93da9e324162d0e5a6fc684f3d8a8d192e534813c105264e95a29336e0aa",
  "fr-responsibilities-m":
    "48e43b975f4b30eab962cb1834f8274c5c37a808f693641cb645dca6eea86ae6",
  "fr-funds-d":
    "edcba12d96a70beab22923cceae180c52952cc5b1e7305e154759db7c14e3f06",
  "fr-funds-m":
    "66a3f6751bb1d0e871a3650fb5ee43a5be80de50fefc47ef667f0cdfc487aae9",
  "fr-collateral-d":
    "a6a8744d9193c1c34e714420e98de604f0c990b8104b600b0202f60551582a01",
  "fr-collateral-m":
    "e13defcecbbfc5e65e25b0c3c117aeb4f4b59318ed1b73fe1d4b0bc887126f8e",
  "fr-triggers-d":
    "250ef4a629b674445ee16c5d6c3c151f38a91b4fe501a972ba62144d5bb823e1",
  "fr-triggers-m":
    "5f60eb857a865f7839edf1399500768c4b9cdd49164124462efec5dc554d582f",
  "fr-market-d":
    "a3d44cf12971e4425b9e8a0001c46dc1c3cd2138692db9f207fa6b7483b456df",
  "fr-market-m":
    "a4abd79438989bba400b1ea60bbaca79ac46a4a845ff74d17c72511fbcc80195",
  "en-responsibilities-d":
    "d902f85fc28a84c7cb0a59b79ee74308b5b974089245915e6342900cdbe255d1",
  "en-responsibilities-m":
    "2c492d862d932e0037b46fa1829cd6ee20c3362f60686a4f5ceb87cbe1e92841",
  "en-funds-d":
    "d62737b24a2039b6ee5fcbc93118a0e81727015a0d76fd66ee5b0beb8f520f3c",
  "en-funds-m":
    "03043c6c9a7ad7dfd2e9b133f2d50b07658ada9eea44efb69b8525aa45fc470a",
  "en-collateral-d":
    "76b6e90dab3624fea34c631bab42d25d86312fea091c3a02dabd9bfb8b3c2d69",
  "en-collateral-m":
    "3c6a8102f8bd2fe06cc0a2b947e365a287c4a450cc9fbd5f1a376be94291547c",
  "en-triggers-d":
    "00b4bd2c18cfdea723bf85dac9b37903d471f104bf0709f88abde0ed91294e0c",
  "en-triggers-m":
    "52f71afa3db7fb86da65b3f7ed655cedf652e9129c4b0f0ebd8c5288e8b59e66",
  "en-market-d":
    "fbac005f02d8709d58e0ba3b504b999c17b1c7f5d2d5926b046bc0eef3f3b9c3",
  "en-market-m":
    "9c4735c0822b436b9c8e71f4421576e1e25185263a8a76608f06917235041373",
};
