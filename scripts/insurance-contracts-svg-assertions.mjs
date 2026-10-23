import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { parseFragment } from "parse5";
import { readFileSync } from "node:fs";
import { XMLParser, XMLValidator } from "fast-xml-parser";
import opentype from "@shuding/opentype.js";
import {
  INSURANCE_CONTRACTS_KINDS,
  insuranceContractsSvg,
} from "../src/lib/insuranceContractsFigures.mjs";
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
export function inspectInsuranceContractsSvg(svg) {
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
  assert.equal(a.class, "l0g-insurance-contracts-svg");
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
        assert.match(v, /^insurance-(?:fr|en)-f[1-4]-(?:d|m)-[a-z0-9.-]+$/u);
      if (k === "font-family") assert.equal(v, "l0g Insurance Contracts");
      if (k === "font-size") assert.ok(Number(v) >= 28 && Number(v) <= 38);
      if (k === "font-weight") assert.ok(["400", "700"].includes(v));
      if (k === "text-anchor")
        assert.ok(["start", "end", "middle"].includes(v));
      if (k === "href") {
        assert.match(v, /^#source-s(?:0[1-9]|1[0-9]|2[0-9]|30)$/u);
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
export function assertInsuranceContractsGeometry(svg) {
  const { root, all } = inspectInsuranceContractsSvg(svg),
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
  else assert.ok((h * 480) / w <= 750, "Compact mobile");
  return true;
}
export function assertInsuranceContractsQuantitative(svg, figure) {
  const { root, all } = inspectInsuranceContractsSvg(svg),
    mobile = attrs(root).viewBox.startsWith("0 0 600 "),
    prefix = attrs(root)["aria-labelledby"].split(" ")[0].slice(0, -6),
    find = (id) => {
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
    [["01", "03", "04", "27"], ["02"], ["11", "12", "13"], ["18", "20"]][
      figure - 1
    ].map((id) => "#source-s" + id),
  );
  if (figure === 1) {
    assert.match(labels, /96[ ,]000/u);
    for (const id of ["before", "after", "owner-0", "owner-1", "owner-2"])
      find(id);
    assert.match(labels, /Apollo/u);
    assert.match(labels, /Holding/u);
  }
  if (figure === 2) {
    const scale = (mobile ? 552 : 952) / 8500;
    for (const [i, v] of [8067, 7704].entries()) {
      const b = find("bar-" + i);
      near(b.x, 24);
      near(b.width, v * scale);
      near(b.height, 35);
      assert.equal(b.fill, `var(--color-${i ? "signal" : "topic-blue"})`);
    }
    const axis = find("axis");
    near(axis.x1, 24);
    near(axis.x2, mobile ? 576 : 976);
    for (const v of [0, 2000, 4000, 6000, 8000]) {
      near(find("tick-" + v).x1, 24 + v * scale);
      near(find("tick-" + v).x2, 24 + v * scale);
    }
    assert.match(labels, /8[ ,]067 − 7[ ,]704 = 363/u);
  }
  if (figure === 3) {
    for (const date of [
      "14.03.2018",
      "16.08.2019",
      "02.12.2020",
      "24.11.2021",
      "15.12.2021",
    ])
      assert.ok(labels.includes(date));
    assert.match(labels, /350[ ,]000/u);
    assert.match(labels, /33[ ,]000/u);
    find("policies-0");
    find("policies-1");
    assert.match(labels, /PAC/u);
    assert.match(labels, /transitoire|transitional/u);
  }
  if (figure === 4) {
    for (const id of ["party-0", "party-1", "party-2", "collateral"]) find(id);
    assert.match(labels, /RECAPTURE/u);
    assert.match(labels, /Reprendre|Reassume/u);
    assert.match(labels, /Récupérer|Recover/u);
    assert.match(labels, /capital/u);
  }
  const arrows = all.filter((n) => attrs(n)["marker-end"]),
    expected =
      figure === 1
        ? [
            "assets",
            "plan-annuity",
            "insurer-annuity",
            "ownership-0",
            "ownership-1",
          ]
        : figure === 3 && !mobile
          ? ["step-0", "step-1", "step-2", "step-3"]
          : figure === 4
            ? [
                "annuity",
                "reinsurance-dues",
                "premium",
                "collateral-from-reinsurer",
                "collateral-to-insurer",
              ]
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
    assert.ok(Number(a["stroke-width"]) >= 2);
    assert.notEqual(a.stroke, "none");
    const pts =
        tag(n) === "path"
          ? pathPoints(a.d)
          : [
              [Number(a.x1), Number(a.y1)],
              [Number(a.x2), Number(a.y2)],
            ],
      first = pts[0],
      last = pts.at(-1),
      dx = last[0] - first[0],
      dy = last[1] - first[1];
    assert.ok(
      pts.some((p) => Math.hypot(p[0] - first[0], p[1] - first[1]) > 4),
    );
    if (figure === 1) {
      if (a.id.includes("-ownership-") || (a.id.endsWith("-assets") && !mobile))
        assert.ok(dx > 0);
      else assert.ok(dy > 0);
    }
    if (figure === 3) assert.ok(dx > 0);
    if (figure === 4) {
      const outward =
        a.id.endsWith("-premium") ||
        a.id.endsWith("-collateral-from-reinsurer");
      if (a.id.includes("-collateral-")) assert.ok(outward ? dy > 0 : dy < 0);
      else
        assert.ok(
          mobile ? (outward ? dy > 0 : dy < 0) : outward ? dx > 0 : dx < 0,
        );
    }
    const sample = pts
      .slice(1)
      .flatMap((p, i) =>
        Array.from({ length: 31 }, (_, j) => [
          pts[i][0] + ((p[0] - pts[i][0]) * j) / 30,
          pts[i][1] + ((p[1] - pts[i][1]) * j) / 30,
        ]),
      );
    for (const shape of all
      .slice(all.indexOf(n) + 1)
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
        "Visible relationship",
      );
    }
  }
  return true;
}
export const insuranceContractsScenes = () =>
  ["fr", "en"].flatMap((lang) =>
    INSURANCE_CONTRACTS_KINDS.flatMap((kind, i) =>
      [false, true].map((mobile) => ({
        lang,
        kind,
        figure: i + 1,
        mobile,
        svg: insuranceContractsSvg(lang, kind, mobile),
      })),
    ),
  );
export function assertInsuranceContractsSourceFaithful(
  svg,
  lang,
  kind,
  mobile,
) {
  inspectInsuranceContractsSvg(svg);
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
export function assertInsuranceContractsRenderedFaithful(
  svg,
  lang,
  kind,
  mobile,
) {
  const original = insuranceContractsSvg(lang, kind, mobile);
  assertInsuranceContractsSourceFaithful(original, lang, kind, mobile);
  assertInsuranceContractsGeometry(svg);
  assertInsuranceContractsQuantitative(
    svg,
    INSURANCE_CONTRACTS_KINDS.indexOf(kind) + 1,
  );
  assert.deepEqual(
    projection(parseFragment(svg)),
    projection(parseFragment(original)),
    "Complete native SVG survives Astro compilation",
  );
  return true;
}
export function assertInsuranceContractsArticleReferences(article) {
  const all = htmlNodes(parseFragment(article)),
    expected = Array.from(
      { length: 30 },
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
  "fr-debtor-d":
    "80dc15864ed3d0660b9459097fd30b8a1e73be22256aa6795df8d649716fd1ba",
  "fr-debtor-m":
    "a5d84608b0ba69b716b31ff001ee8d224fb723a1262351d5a99dc0df5f04f31b",
  "fr-amounts-d":
    "2cdbf4f239ebb5f5a3c444dd4fe6a013f1bb7664512cf65883f2f1699d8cee7d",
  "fr-amounts-m":
    "d9d03ce12c508b4240824fe03da53f30e0cf291d7aea2c13e607e565cc9e4981",
  "fr-rothesay-d":
    "7a09d62b36be5752924e0768b0c82ffacee266048f2f1421ded3af7cbd159a5f",
  "fr-rothesay-m":
    "b583cdb839d2acbff6d6026d426e05893dbe4a4d67c8fc0dec94a55a9157e9a2",
  "fr-reinsurance-d":
    "bb1772c569b8930bc131a456d385c1b929cb8357e1fbcba45d309cee156f4c57",
  "fr-reinsurance-m":
    "10d892ae6b81c8e7543a8199b8aac093ae1853dcbfe1df02482a6376673e3fa3",
  "en-debtor-d":
    "eb87ee096bdd43b66bbb4633e475fc9f4fbe1af098a059e03c6901ba36819ec8",
  "en-debtor-m":
    "4972cdb540a265b280d3e22faf62ebfde81b96bb3909e2d17f135a4d4afc2309",
  "en-amounts-d":
    "be3b6e3c3220bed2f07406b79b4c6c765dfc24b14538fafb537dec85c8a60340",
  "en-amounts-m":
    "b653961f338fcee3952d19f4cf0beda70dc7db9b2681ef6616b58f10f013693d",
  "en-rothesay-d":
    "87e95d12fc9d3396ceee4d4481cf7182d6d56aed5d1f35fd8bdb84721e9fc093",
  "en-rothesay-m":
    "f6a60b09a37db6a36961e93f90045d29e539728a7b11b8752865fbf8dba7367f",
  "en-reinsurance-d":
    "5fbe36da01594f8937fa3bd628be6f629ef22a2de73e4122b3c72fe3711c5745",
  "en-reinsurance-m":
    "78760ab819ce44389823aa15232ef018ddeb342e0e0b97265b2e5d2c72bd16cc",
};
