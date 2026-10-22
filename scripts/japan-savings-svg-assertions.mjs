import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { parseFragment } from "parse5";
import { readFileSync } from "node:fs";
import { XMLParser, XMLValidator } from "fast-xml-parser";
import opentype from "@shuding/opentype.js";
import {
  JAPAN_SAVINGS_KINDS,
  japanSavingsSvg,
} from "../src/lib/japanSavingsFigures.mjs";
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
        `../public/fonts/japan-savings/dejavu-sans-${w}.ttf`,
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
  path: "id d fill stroke stroke-width marker-end",
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
export function inspectJapanSavingsSvg(svg) {
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
  assert.equal(a.class, "l0g-japan-savings-svg");
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
        assert.match(v, /^japan-(?:fr|en)-f[1-5]-(?:d|m)-[a-z0-9.-]+$/u);
      if (k === "font-family") assert.equal(v, "l0g Japan Savings");
      if (k === "font-size") assert.ok(Number(v) >= 28 && Number(v) <= 38);
      if (k === "font-weight") assert.ok(["400", "700"].includes(v));
      if (k === "text-anchor")
        assert.ok(["start", "end", "middle"].includes(v));
      if (k === "href") {
        assert.match(v, /^#source-s(?:0[1-9]|1[0-9]|20)$/u);
        assert.equal(v, "#source-" + content(n).toLowerCase());
      }
      if (k === "markerUnits") assert.equal(v, "userSpaceOnUse");
      if (["fill", "stroke"].includes(k))
        assert.match(
          v,
          /^(?:none|var\(--color-(?:ink|surface|surface-2|paper|muted|line-strong|signal|amber|accent)\))$/u,
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
export function assertJapanSavingsGeometry(svg) {
  const { root, all } = inspectJapanSavingsSvg(svg),
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
    (n) => tag(n) === "path" && (attrs(n).id ?? "").endsWith("-return-line"),
  )) {
    const pts = pathPoints(attrs(route).d);
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
  else assert.ok((h * 480) / w <= 900, "Compact mobile");
  return true;
}
export function assertJapanSavingsQuantitative(svg, figure) {
  const { root, all } = inspectJapanSavingsSvg(svg),
    mobile = attrs(root).viewBox.startsWith("0 0 600 "),
    prefix = attrs(root)["aria-labelledby"].split(" ")[0].slice(0, -6),
    find = (id) => {
      const n = all.find((n) => attrs(n).id === `${prefix}-${id}`);
      assert.ok(n, id);
      return attrs(n);
    },
    near = (a, b) => assert.ok(Math.abs(Number(a) - b) < 0.002, `${a} != ${b}`),
    labels = all
      .filter((n) => tag(n) === "text")
      .map(content)
      .join(" "),
    ref = all.filter((n) => tag(n) === "a").map((n) => attrs(n).href);
  assert.deepEqual(
    ref,
    [
      ["01", "02", "03"],
      ["02", "05"],
      ["09"],
      ["13", "14"],
      ["03", "10", "12", "16", "17"],
    ][figure - 1].map((id) => `#source-s${id}`),
  );
  if (figure === 1) {
    const data = [
      -38.5, -64.9, -254.3, 40.2, -618.7, -638.4, -80.2, 17.9, -41.3, -10.6,
      -137.3, -288.6,
    ];
    for (const [i, v] of data.entries()) {
      const b = find(`bar-${i}`);
      assert.equal(b.fill, `var(--color-${v < 0 ? "accent" : "signal"})`);
      near(
        b[mobile ? "width" : "height"],
        Math.abs(v) * (mobile ? 250 / 700 : 240 / 700),
      );
      if (mobile) {
        near(b.x, v < 0 ? 420 + (v * 250) / 700 : 420);
        near(b.y, 310 + i * 38);
      } else {
        near(b.x, 110 + (866 / 12) * (i + 0.5) - 18);
        near(b.y, Math.min(257 - (v * 240) / 700, 257));
      }
    }
    assert.match(labels, /1.?757[,.]0/u);
  }
  if (figure === 2) {
    for (const [i, v] of [
      -11739.2, 11415.2, 2992.6, -2302.8, -1757, -1483.5, -1315.8,
    ].entries()) {
      const b = find(`bar-${i}`),
        zero = mobile ? 310 : 650,
        scale = (mobile ? 80 : 100) / 12000;
      near(b.width, Math.abs(v) * scale);
      near(b.x, v < 0 ? zero + v * scale : zero);
      assert.equal(b.fill, `var(--color-${v < 0 ? "accent" : "signal"})`);
    }
    assert.match(labels, /4.?190[,.]7/u);
  }
  if (figure === 3) {
    const left = mobile ? 80 : 96,
      right = mobile ? 554 : 954,
      bottom = mobile ? 646 : 565,
      top = mobile ? 442 : 396,
      x = (f) => left + ((f - 146.8) / 1.9) * (right - left),
      y = (r) => bottom - ((r - 2.5) / 1.7) * (bottom - top);
    for (const [f, r] of [
      [147, 2.9],
      [148.5, 3.95],
    ]) {
      const p = find(`point-${f}`);
      near(p.cx, x(f));
      near(p.cy, y(r));
      near(((1.05 * f) / 150 - 1) * 100, r);
    }
    const expected = [
      [146.8, ((1.05 * 146.8) / 150 - 1) * 100],
      [148.7, ((1.05 * 148.7) / 150 - 1) * 100],
    ].map(([f, r]) => [x(f), y(r)]);
    const pts = pathPoints(find("return-line").d);
    for (let i = 0; i < 2; i++) {
      near(pts[i][0], expected[i][0]);
      near(pts[i][1], expected[i][1]);
    }
    assert.match(labels, /FICTIF|HYPOTHETICAL/u);
  }
  if (figure === 4) {
    assert.match(labels, /L × Dₗ > A × Dₐ/u);
    assert.match(labels, /Δ\(A − L\) ≈ \(L × Dₗ − A × Dₐ\) × Δr/u);
    for (const i of [0, 1]) find("balance-" + i);
  }
  const arrows = all.filter((n) => attrs(n)["marker-end"]);
  const expected =
    figure === 3
      ? ["flow-0", "flow-1"]
      : figure === 4
        ? ["rate-flow-0", "rate-flow-1"]
        : figure === 5
          ? [
              "allocation-0",
              "allocation-1",
              "allocation-2",
              "repricing-0",
              "repricing-1",
            ]
          : [];
  assert.deepEqual(
    arrows.map((n) => attrs(n).id),
    expected.map((id) => prefix + "-" + id),
  );
  for (const arrow of arrows) {
    const a = attrs(arrow);
    assert.equal(tag(arrow), "line");
    assert.ok(Number(a["stroke-width"]) >= 2);
    assert.notEqual(a.stroke, "none");
    const marker = all.find(
      (n) =>
        tag(n) === "marker" && attrs(n).id === a["marker-end"].slice(5, -1),
    );
    assert.ok(marker);
    const head = nodes(marker).find((n) => tag(n) === "path");
    assert.equal(attrs(head).stroke, a.stroke);
    assert.ok(
      Math.hypot(Number(a.x2) - Number(a.x1), Number(a.y2) - Number(a.y1)) > 4,
    );
    const down =
      figure === 4 ||
      (figure === 5 && (a.id.includes("-allocation-") || mobile));
    assert.ok(
      down ? Number(a.y2) > Number(a.y1) : Number(a.x2) > Number(a.x1),
      "Every flow retains its semantic direction",
    );
    const sample = Array.from({ length: 21 }, (_, i) => [
      Number(a.x1) + ((Number(a.x2) - Number(a.x1)) * i) / 20,
      Number(a.y1) + ((Number(a.y2) - Number(a.y1)) * i) / 20,
    ]);
    for (const shape of all
      .slice(all.indexOf(arrow) + 1)
      .filter((n) => tag(n) === "rect")) {
      const b = attrs(shape);
      assert.ok(
        !sample.some(
          ([x, y]) =>
            x > Number(b.x) + 0.5 &&
            x < Number(b.x) + Number(b.width) - 0.5 &&
            y > Number(b.y) + 0.5 &&
            y < Number(b.y) + Number(b.height) - 0.5,
        ),
        "Visible arrows",
      );
    }
  }
  return true;
}
export const japanSavingsScenes = () =>
  ["fr", "en"].flatMap((lang) =>
    JAPAN_SAVINGS_KINDS.flatMap((kind, i) =>
      [false, true].map((mobile) => ({
        lang,
        kind,
        figure: i + 1,
        mobile,
        svg: japanSavingsSvg(lang, kind, mobile),
      })),
    ),
  );
export function assertJapanSavingsSourceFaithful(svg, lang, kind, mobile) {
  inspectJapanSavingsSvg(svg);
  assert.equal(
    createHash("sha256").update(svg).digest("hex"),
    HASHES[`${lang}-${kind}-${mobile ? "m" : "d"}`],
    "Reviewed complete SVG copy, data and composition",
  );
  return true;
}
const htmlNodes = (n) => [n, ...(n.childNodes ?? []).flatMap(htmlNodes)];
const htmlAttrs = (n) =>
  Object.fromEntries((n.attrs ?? []).map((a) => [a.name, a.value]));
const htmlText = (n) =>
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
export function assertJapanSavingsRenderedFaithful(svg, lang, kind, mobile) {
  const original = japanSavingsSvg(lang, kind, mobile);
  assertJapanSavingsSourceFaithful(original, lang, kind, mobile);
  assertJapanSavingsGeometry(svg);
  assertJapanSavingsQuantitative(svg, JAPAN_SAVINGS_KINDS.indexOf(kind) + 1);
  assert.deepEqual(
    projection(parseFragment(svg)),
    projection(parseFragment(original)),
    "Complete native SVG survives Astro compilation",
  );
  return true;
}
export function assertJapanSavingsArticleReferences(article) {
  const all = htmlNodes(parseFragment(article)),
    expected = Array.from(
      { length: 21 },
      (_, i) => `source-s${String(i + 1).padStart(2, "0")}`,
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
  "fr-flows-d":
    "fafb4fcfbb1a1edbc3bd9f4554ff16594470862f130c3018d3a3e01b1355e1d1",
  "fr-flows-m":
    "9a90d76734dba5619ce846544a0f1fc8cb35d61f6a03796996b2e5e2bd1d16a1",
  "fr-sectors-d":
    "1dc4b5928fe742330e1acbe1dce6f15d2bc1da6470d111c644fd5ed61740cd90",
  "fr-sectors-m":
    "b7ea0593e9f0a86cd872308cba12702ce0cb66c5cdb9a2199402991ce70e5686",
  "fr-hedge-d":
    "db49995d83d9ac51c446d5f0cf76e59db9a0f7ad3e91af8c75016d8dc350ec85",
  "fr-hedge-m":
    "887700e9fa553cf728fe81ac9a159f0bd08d2b2c81d774191335919bd0deed1f",
  "fr-duration-d":
    "a35b0993d3da8827c058fe63487c2bd9fed98eec75dffff4a4f435bb6c74a0ed",
  "fr-duration-m":
    "252861abf22e5d19ef21f932557dbcaadfc48209de9c9c7408337b815b86b8a4",
  "fr-transmission-d":
    "3b9267329af222b3601325bcf6e27e806787ce711c7c6d9144ad62e636ebbd71",
  "fr-transmission-m":
    "85800d302414b095c75b743b65a1368235c6add0f116e44526e3dbac9862576f",
  "en-flows-d":
    "6d7e6b3c873a031e24c1e0775945f04feb95ede71f474d1ff1de4e4a1ac26c40",
  "en-flows-m":
    "0b94abc6a81237a32126db76a5d7f3abfbc255b4e749b548fafd2fea2b2d9f83",
  "en-sectors-d":
    "8aad7bc58855e6bc9985d5ca521721bc600e3415e9a4addfcd95e83e551ed76f",
  "en-sectors-m":
    "7bbcf5c1491d91d72d295d3b29246f91157542216dddd0625e5600f2fe938711",
  "en-hedge-d":
    "f2598714e955d2ae681089bbf5ea77f20489d2c6555a0cdd80852402d2572a59",
  "en-hedge-m":
    "d1781c657ad667e969c5bb07b0325c66d956a88fe712ead62216c6218d152cb3",
  "en-duration-d":
    "c39b7ed7c3b4539973ee0772d88dec1c50b7e764de54c72a75c88b644d7bd7a2",
  "en-duration-m":
    "aaf50cffb3f829edd1974258e6aa84512db8c3503ee9af259fa0ce53975624d7",
  "en-transmission-d":
    "9db729eee91932a87140af9c04f6fd0edbac6ecd15a5d7c2722587d2740781c1",
  "en-transmission-m":
    "e0c18c9bedde8a03a0dc571632822c4a66d75e336abdfba58e3a740e575bab3e",
};
