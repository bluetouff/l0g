import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { parseFragment } from "parse5";
import { readFileSync } from "node:fs";
import { XMLParser, XMLValidator } from "fast-xml-parser";
import opentype from "@shuding/opentype.js";
import {
  INSURANCE_ACQUISITIONS_KINDS,
  insuranceAcquisitionsSvg,
  INSURANCE_ACQUISITIONS_SOURCES,
} from "../src/lib/insuranceAcquisitionsFigures.mjs";
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
export function inspectInsuranceAcquisitionsSvg(svg) {
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
  assert.equal(a.class, "l0g-insurance-acquisitions-svg");
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
        assert.match(
          v,
          /^insurance-acq-(?:fr|en)-f[1-5]-(?:d|m)-[a-z0-9.-]+$/u,
        );
      if (k === "font-family") assert.equal(v, "l0g Insurance Acquisitions");
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
      if (k === "stroke-dasharray") assert.equal(v, "5 6");
    }
  }
  return { root, all };
}
export function assertInsuranceAcquisitionsGeometry(svg) {
  const { root, all } = inspectInsuranceAcquisitionsSvg(svg),
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
export function assertInsuranceAcquisitionsQuantitative(svg, figure) {
  const { root, all } = inspectInsuranceAcquisitionsSvg(svg),
    mobile = attrs(root).viewBox.startsWith("0 0 600 "),
    prefix = attrs(root)["aria-labelledby"].split(" ")[0].slice(0, -6);
  const find = (id) => {
      const n = all.find((n) => attrs(n).id === prefix + "-" + id);
      assert.ok(n, id);
      return attrs(n);
    },
    near = (a, b) => assert.ok(Math.abs(Number(a) - b) < 0.002, `${a} != ${b}`),
    labels = all
      .filter((n) => tag(n) === "text")
      .map(content)
      .join(" ");
  assert.deepEqual(
    all.filter((n) => tag(n) === "a").map((n) => attrs(n).href),
    INSURANCE_ACQUISITIONS_SOURCES[figure - 1]
      .split(" ")
      .map((id) => "#source-s" + id),
  );
  if (figure === 1) {
    const values = [
        ["asset-investments", 56.327, "signal"],
        ["asset-other", 18.839, "amber"],
        ["policyholders", 61.473, "signal"],
        ["liabilities", 9.65, "amber"],
        ["net-assets", 4.043, "topic-blue"],
      ],
      scale = mobile ? 552 / 75.166 : 242 / 75.166;
    const offsets = [0, 56.327, 0, 61.473, 61.473 + 9.65];
    for (const [i, [id, v, c]] of values.entries()) {
      const a = find(id);
      near(a[mobile ? "width" : "height"], v * scale);
      near(a[mobile ? "height" : "width"], mobile ? 34 : 76);
      near(a.x, mobile ? 24 + offsets[i] * scale : i < 2 ? 24 : 520);
      near(a.y, mobile ? (i < 2 ? 414 : 626) : 620 - (offsets[i] + v) * scale);
      assert.equal(a.fill, `var(--color-${c})`);
    }
    for (const value of [
      "75.166",
      "56.327",
      "18.839",
      "10.861",
      "61.473",
      "9.650",
      "4.043",
      "0.713",
      "2.525",
      "1.111",
      "3.636",
    ])
      assert.ok(
        labels.includes(value) || labels.includes(value.replace(".", ",")),
        value,
      );
    const a = find("asset-investments"),
      b = find("asset-other");
    if (mobile) {
      near(a.x, 24);
      near(b.x, 24 + 56.327 * scale);
      near(a.y, 414);
      near(b.y, 414);
      near(find("policyholders").x, 24);
      near(find("net-assets").x, 24 + (61.473 + 9.65) * scale);
    } else {
      near(Number(a.y) + Number(a.height), 620);
      near(Number(b.y) + Number(b.height), Number(a.y));
      near(
        Number(find("policyholders").y) + Number(find("policyholders").height),
        620,
      );
    }
    const hatches = all.filter(
      (n) => tag(n) === "line" && (attrs(n).id ?? "").includes("-hatch-"),
    );
    assert.equal(hatches.length, Math.ceil((10.861 * scale) / 10));
    for (const [i, hatch] of hatches.entries()) {
      const a = attrs(hatch);
      if (mobile) {
        const x = 24 + (75.166 - 10.861) * scale + i * 10;
        near(a.x1, x);
        near(a.x2, Math.min(x + 10, 576));
        near(a.y1, 414);
        near(a.y2, 448);
      } else {
        const y = 620 - 75.166 * scale + i * 10;
        near(a.x1, 24);
        near(a.x2, 100);
        near(a.y1, y);
        near(a.y2, Math.min(y + 10, 620 - (75.166 - 10.861) * scale));
      }
    }
  }
  if (figure === 2) {
    for (const value of ["212.6", "97.503", "49"])
      assert.ok(
        labels.includes(value) || labels.includes(value.replace(".", ",")),
      );
    for (const d of ["01.01.2022", "01.02.2021", "02.01.2024", "02.05.2024"])
      assert.ok(labels.includes(d), d);
    assert.match(labels, /100\s?%/u);
    assert.match(labels, /déjà comptés|already counted|counted before/u);
    assert.match(labels, /fee-paying AUM/iu);
    assert.match(labels, /Brookfield Re/u);
  }
  if (figure === 3) {
    const base = mobile ? 610 : 520,
      xs = mobile ? [130, 380] : [230, 650],
      bw = 180;
    for (const [i, v] of [816.637, 1014.546].entries()) {
      const a = find("kkr-" + i);
      near(a.x, xs[i]);
      near(a.width, bw);
      near(a.height, v * 0.2);
      near(Number(a.y) + Number(a.height), base);
      assert.equal(a.fill, "var(--color-signal)");
    }
    const a = find("minority");
    near(a.x, xs[0]);
    near(a.width, bw);
    near(a.height, 473.062 * 0.2);
    near(a.y, base - 1289.699 * 0.2);
    assert.equal(a.fill, "var(--color-amber)");
    for (const tick of [0, 400, 800, 1200]) {
      const t = find("tick-" + tick);
      near(t.y1, base - tick * 0.2);
      near(t.y2, base - tick * 0.2);
    }
    assert.match(labels, /−21[.,]3\s?%/u);
    assert.match(labels, /\+24[.,]2\s?%/u);
    assert.match(labels, /1[ ,]289[.,]699/u);
    assert.match(labels, /1[ ,]014[.,]546/u);
    assert.match(labels, /473[.,]062/u);
    assert.match(labels, /816[.,]637/u);
  }
  if (figure === 4) {
    for (const id of [
      "insurer-0",
      "manager-0",
      "insurer-1",
      "manager-1",
      "consolidation",
    ])
      find(id);
    assert.match(labels, /1[ ,]441/u);
    assert.match(labels, /673[.,]9/u);
    assert.match(labels, /CONSOLIDATION GAAP/u);
    assert.match(labels, /Athene/u);
    assert.match(labels, /Global Atlantic/u);
    assert.match(labels, /Apollo/u);
    assert.match(labels, /KKR/u);
  }
  if (figure === 5) {
    const scale = (mobile ? 110 : 150) / 350,
      bw = mobile ? 92 : 130,
      xs = mobile ? [132, 298, 464] : [200, 450, 700];
    for (const [i, v] of [175, 243, 323].entries()) {
      const a = find("expense-" + i);
      near(a.x, xs[i]);
      near(a.width, bw);
      near(a.height, v * scale);
      near(a.y, 350 - v * scale);
      assert.equal(a.fill, "var(--color-signal)");
    }
    for (const tick of [0, 100, 200, 300]) {
      near(find("tick-" + tick).y1, 350 - tick * scale);
      near(find("tick-" + tick).y2, 350 - tick * scale);
    }
    for (const val of ["2021", "2023", "2024", "2025", "30", "45", "50"])
      assert.ok(labels.includes(val), val);
    assert.match(labels, /0[.,]30/u);
    assert.match(labels, /0[.,]45/u);
    assert.match(labels, /3m|3 M/u);
    assert.match(labels, /4[.,]5m|4[.,]5 M/u);
    assert.match(labels, /minimum/iu);
  }
  const arrows = all.filter((n) => attrs(n)["marker-end"]),
    expected =
      figure === 2
        ? ["mandate-link-0", "mandate-link-1", "mandate-link-2"]
        : figure === 4
          ? ["fee-0", "fee-1"]
          : figure === 5
            ? ["reinvestment"]
            : [];
  assert.deepEqual(
    arrows.map((n) => attrs(n).id),
    expected.map((id) => prefix + "-" + id),
  );
  for (const n of arrows) {
    const a = attrs(n),
      m = all.find(
        (n) =>
          tag(n) === "marker" && attrs(n).id === a["marker-end"].slice(5, -1),
      );
    assert.ok(m);
    assert.equal(
      attrs(nodes(m).find((n) => tag(n) === "path")).stroke,
      a.stroke,
    );
    assert.notEqual(a.stroke, "none");
    assert.ok(Number(a["stroke-width"]) >= 2);
    const pts =
        tag(n) === "path"
          ? pathPoints(a.d)
          : [
              [Number(a.x1), Number(a.y1)],
              [Number(a.x2), Number(a.y2)],
            ],
      first = pts[0],
      last = pts.at(-1);
    assert.ok(
      pts.some((q) => Math.hypot(q[0] - first[0], q[1] - first[1]) > 4),
    );
    if (figure === 2)
      assert.ok(a.id.endsWith("-0") ? last[0] > first[0] : last[0] < first[0]);
    if (figure === 4) assert.ok(last[0] > first[0]);
    if (figure === 5)
      assert.ok(mobile ? last[1] > first[1] : last[0] > first[0]);
    for (const shape of all
      .slice(all.indexOf(n) + 1)
      .filter((n) => tag(n) === "rect")) {
      const b = attrs(shape);
      for (let i = 1; i < pts.length; i++)
        for (let j = 0; j <= 30; j++) {
          const x = pts[i - 1][0] + ((pts[i][0] - pts[i - 1][0]) * j) / 30,
            y = pts[i - 1][1] + ((pts[i][1] - pts[i - 1][1]) * j) / 30;
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
export const insuranceAcquisitionsScenes = () =>
  ["fr", "en"].flatMap((lang) =>
    INSURANCE_ACQUISITIONS_KINDS.flatMap((kind, i) =>
      [false, true].map((mobile) => ({
        lang,
        kind,
        figure: i + 1,
        mobile,
        svg: insuranceAcquisitionsSvg(lang, kind, mobile),
      })),
    ),
  );
export function assertInsuranceAcquisitionsSourceFaithful(
  svg,
  lang,
  kind,
  mobile,
) {
  inspectInsuranceAcquisitionsSvg(svg);
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
export function assertInsuranceAcquisitionsRenderedFaithful(
  svg,
  lang,
  kind,
  mobile,
) {
  const original = insuranceAcquisitionsSvg(lang, kind, mobile);
  assertInsuranceAcquisitionsSourceFaithful(original, lang, kind, mobile);
  assertInsuranceAcquisitionsGeometry(svg);
  assertInsuranceAcquisitionsQuantitative(
    svg,
    INSURANCE_ACQUISITIONS_KINDS.indexOf(kind) + 1,
  );
  assert.deepEqual(
    projection(parseFragment(svg)),
    projection(parseFragment(original)),
    "Complete native SVG survives Astro compilation",
  );
  return true;
}
export function assertInsuranceAcquisitionsArticleReferences(article) {
  const all = htmlNodes(parseFragment(article)),
    expected = Array.from(
      { length: 47 },
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
  "fr-acquisition-d":
    "ac5288251b9137d630f6de4e544046aa842f1d2cb2d230e5d74a2e17265b6ddb",
  "fr-acquisition-m":
    "eb2a44b1420cacb6d528a7f08bf3ee705eb842f72da2f54643a210da53ea73b2",
  "fr-mandates-d":
    "b7d37034d87efac636642f3bf06b9409f229666aaf0118bd5490ae813a6db453",
  "fr-mandates-m":
    "f92a5cbcee4596b9fd6951eef592bd1cd739593e3cd19ad146dd4cde44afc4cd",
  "fr-earnings-d":
    "88b5064923b6636df8a3e0a2e9c12f33084a7425b31c692084b6598c1fed45c3",
  "fr-earnings-m":
    "ee2d6e14369fc16f719a95860744cde79b79b8ee828c37bb44e076df62aa6c28",
  "fr-fees-d":
    "6ed0801eeb10b778efd8cf9b19cfff9cf1554d387f5bca189d6e6350a78221f1",
  "fr-fees-m":
    "21363420e7c7429c531da52221450681b7c8a9a410213af16427977dc27dff4e",
  "fr-blackstone-d":
    "230388293e58ee2015c3a84613ef52fdcba40d8a7c5b5b1b5f4c45c6fede773a",
  "fr-blackstone-m":
    "cc9e8beadcbcc442e75686b8bde6e7a95674d985dab438c30062607bf8f18b4b",
  "en-acquisition-d":
    "b4b13fd9cebc9d9cd9445b771358cb75915a4f767444760cdd8b51bfd92b787f",
  "en-acquisition-m":
    "b7fcc919cb314644a4d6e85441854afcbe94eba0b61b52454cfadf0da79c0af8",
  "en-mandates-d":
    "de8f875f402cfe83507d156e96838491154c9a8c239f4b080f1f2efd4a575d23",
  "en-mandates-m":
    "d7aa2122d8930cabf41479e1d688c864f9ca7b44c754dc17828ea9ec915e81f9",
  "en-earnings-d":
    "8ffa73b94ab7f1456c1f47a352887996dcc0c93476f7ebd48f3da4f3cf193c20",
  "en-earnings-m":
    "ed8d9854439bc7b290e0b502586b7754379919a20936c16ce7f7fe5932a5cc55",
  "en-fees-d":
    "9f47da7ac418e71d5db2d601f874e4af8ee9e7c57b89f5ae1c70d11a0b61bb51",
  "en-fees-m":
    "ccc4cc31ad43eb98911721314e467cc4775dba968cfe08893a63a18b60ab8fab",
  "en-blackstone-d":
    "0442c56bb897edec03685ca5d3eeed3d39cf0323cf9fe586deeb116a990da11a",
  "en-blackstone-m":
    "bec0b473de879b98dc9b132b469cbf1cfbd086fc9866b903de54cb38229b60ef",
};
