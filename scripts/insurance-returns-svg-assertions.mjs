import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { parseFragment } from "parse5";
import { readFileSync } from "node:fs";
import { XMLParser, XMLValidator } from "fast-xml-parser";
import opentype from "@shuding/opentype.js";
import {
  INSURANCE_RETURNS_KINDS,
  insuranceReturnsSvg,
  INSURANCE_RETURNS_SOURCES,
} from "../src/lib/insuranceReturnsFigures.mjs";
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
export function inspectInsuranceReturnsSvg(svg) {
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
  assert.equal(a.class, "l0g-insurance-returns-svg");
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
          /^insurance-ret-(?:fr|en)-f[1-4]-(?:d|m)-[a-z0-9.-]+$/u,
        );
      if (k === "font-family") assert.equal(v, "l0g Insurance Returns");
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
export function assertInsuranceReturnsGeometry(svg) {
  const { root, all } = inspectInsuranceReturnsSvg(svg),
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
      // A label inside the ANGI child panel also lies within the enclosing BWS scope.
      const own = panels.find((n) => attrs(n).id === b.panel);
      if (own) {
        const o = attrs(own);
        if (
          Number(o.x) >= Number(a.x) &&
          Number(o.y) >= Number(a.y) &&
          Number(o.x) + Number(o.width) <= Number(a.x) + Number(a.width) &&
          Number(o.y) + Number(o.height) <= Number(a.y) + Number(a.height)
        )
          continue;
      }
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

export function assertInsuranceReturnsQuantitative(svg, figure) {
  const { root, all } = inspectInsuranceReturnsSvg(svg),
    a = attrs(root),
    mobile = a.viewBox.startsWith("0 0 600 "),
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
  const near = (v, e) =>
    assert.ok(Math.abs(Number(v) - e) < 0.002, `${v} != ${e}`);
  assert.deepEqual(
    all.filter((n) => tag(n) === "a").map((n) => attrs(n).href),
    INSURANCE_RETURNS_SOURCES[figure - 1]
      .split(" ")
      .map((s) => "#source-s" + s),
  );
  assert.match(labels, /23\.10\.2026/u);
  assert.equal(
    all.filter((n) => tag(n) === "text" && content(n) === ",").length,
    INSURANCE_RETURNS_SOURCES[figure - 1].split(" ").length - 1,
  );
  if (figure === 1) {
    assert.match(
      labels,
      /Capital initial \+ intérêts calculés|Initial premium \+ calculated interest/u,
    );
    const scale = (mobile ? 552 : 952) / 210000;
    [201207.7123417247, 200733.83664].forEach((v, i) => {
      const c = find("capital-" + i),
        b = find("interest-" + i);
      near(c.x, 24);
      near(c.y, (mobile ? 510 : 378) + i * 92 + 17);
      near(c.height, 28);
      assert.equal(c.fill, "var(--color-surface-2)");
      near(c.width, 150000 * scale);
      near(b.x, 24 + 150000 * scale);
      near(b.width, (v - 150000) * scale);
      near(b.y, (mobile ? 510 : 378) + i * 92 + 17);
      near(b.height, 28);
      assert.equal(b.fill, `var(--color-${i ? "topic-blue" : "signal"})`);
    });
    for (const v of [
      "150",
      "000",
      "6,05",
      "6,00",
      "201",
      "207",
      "200",
      "733",
      "473,88",
      "14.10.2026",
      "12.10.2026",
    ])
      assert.ok(
        (labels + " " + desc).includes(v) ||
          (labels + " " + desc).includes(v.replaceAll(",", ".")),
        v,
      );
    assert.match(
      labels,
      /Hypothèse : capitalisation annuelle|Assumption: annual compounding/u,
    );
    assert.match(desc, /avant arrondis|before rounding/u);
    assert.match(desc, /2023/u);
    assert.match(desc, /frais|charge period/u);
  }
  if (figure === 2) {
    const bottom = mobile ? 744 : 587,
      top = mobile ? 530 : 407,
      scale = (bottom - top) / 10,
      step = (mobile ? 552 : 952) / 5,
      bw = mobile ? 34 : 56,
      gap = mobile ? 10 : 14;
    for (let i = 0; i < 5; i++)
      for (const [j, v] of [10, [8, 8, 7, 6, 5][i]].entries()) {
        const b = find(`charge-${j}-${i}`),
          cx = 24 + step * (i + 0.5);
        near(b.x, cx - (2 * bw + gap) / 2 + j * (bw + gap));
        near(b.y, bottom - v * scale);
        near(b.height, v * scale);
        near(b.width, bw);
        assert.equal(b.fill, `var(--color-${j ? "topic-blue" : "signal"})`);
      }
    assert.match(
      desc,
      /base initiale distincte non précisée|does not separately specify/u,
    );
    assert.match(desc, /10 % de la prime initiale|10% of the initial premium/u);
    assert.match(labels, /Reçu \+ \/ −|Proceeds \+ \/ −/u);
    const ar = find("mva");
    near(ar.x1, 210);
    near(ar.x2, 318);
    near(ar.y1, (mobile ? 812 : 673) + 28);
    near(ar.y2, (mobile ? 812 : 673) + 28);
    assert.equal(ar.stroke, "var(--color-signal)");
    assert.equal(ar["marker-end"], `url(#${p}-signal-arrow)`);
    assert.match(desc, /non calculé|not calculated/u);
  }
  if (figure === 3) {
    const values = [7795, 73, -5749, 2119, -229, -294, 1596],
      running = [7795, 7868, 2119, 2119, 1890, 1596, 1596],
      subs = new Set([0, 3, 6]),
      gx = mobile ? 342 : 358,
      gw = mobile ? 234 : 270,
      scale = gw / 8000;
    assert.equal(7795 + 73 - 5749, 2119);
    assert.equal(2119 - 229 - 294, 1596);
    for (let i = 0; i < 7; i++) {
      const b = find("waterfall-" + i),
        v = values[i],
        prior = i ? running[i - 1] : 0,
        from = subs.has(i) ? 0 : Math.min(prior, running[i]),
        to = subs.has(i) ? v : Math.max(prior, running[i]);
      near(b.x, gx + from * scale);
      near(b.width, (to - from) * scale);
      near(b.y, 200 + i * (mobile ? 59 : 61) - 23);
      near(b.height, 28);
      assert.equal(
        b.fill,
        `var(--color-${subs.has(i) ? "signal" : v > 0 ? "topic-blue" : "amber"})`,
      );
    }
    for (const v of ["5,14", "5,16", "3,57", "3,80", "1 624", "1 596"])
      assert.ok(
        (labels + " " + desc).includes(v) ||
          (labels + " " + desc).includes(v.replaceAll(" ", ",")) ||
          (labels + " " + desc).includes(v.replaceAll(",", ".")),
        v,
      );
    assert.match(desc, /quote-part économique|economic share/u);
    assert.match(desc, /785/u);
    assert.match(desc, /aucune seconde déduction|neither deducted twice/u);
    assert.match(desc, /non-GAAP/u);
  }
  if (figure === 4) {
    const values = [548.55, 289.46, 125.578, 33.817],
      cols = ["signal", "topic-blue", "accent", "amber"];
    let x = 24;
    for (let i = 0; i < 4; i++) {
      const b = find("contribution-" + i),
        wid = ((mobile ? 552 : 952) * values[i]) / 997.405;
      near(b.x, x);
      near(b.width, wid);
      near(b.y, 240);
      near(b.height, 44);
      assert.equal(b.fill, `var(--color-${cols[i]})`);
      x += wid;
    }
    assert.ok(Math.abs(values.reduce((a, b) => a + b) - 997.405) < 1e-9);
    for (const v of [
      "997,405",
      "548,550",
      "289,460",
      "125,578",
      "33,817",
      "350,860",
      "61,400",
    ])
      assert.ok(
        labels.includes(v) || labels.includes(v.replaceAll(",", ".")),
        v,
      );
    assert.match(desc, /rémunération en actions|equity-based pay/u);
    assert.match(desc, /avant allocation|before allocation/u);
    assert.match(desc, /milliers|thousands/u);
  }
  return true;
}
export const insuranceReturnsScenes = () =>
  ["fr", "en"].flatMap((lang) =>
    INSURANCE_RETURNS_KINDS.flatMap((kind, i) =>
      [false, true].map((mobile) => ({
        lang,
        kind,
        figure: i + 1,
        mobile,
        svg: insuranceReturnsSvg(lang, kind, mobile),
      })),
    ),
  );
export function assertInsuranceReturnsSourceFaithful(svg, lang, kind, mobile) {
  inspectInsuranceReturnsSvg(svg);
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
export function assertInsuranceReturnsRenderedFaithful(
  svg,
  lang,
  kind,
  mobile,
) {
  const original = insuranceReturnsSvg(lang, kind, mobile);
  assertInsuranceReturnsSourceFaithful(original, lang, kind, mobile);
  assertInsuranceReturnsGeometry(svg);
  assertInsuranceReturnsQuantitative(
    svg,
    INSURANCE_RETURNS_KINDS.indexOf(kind) + 1,
  );
  assert.deepEqual(
    projection(parseFragment(svg)),
    projection(parseFragment(original)),
    "Complete native SVG survives Astro compilation",
  );
  return true;
}
export function assertInsuranceReturnsArticleReferences(article) {
  const all = htmlNodes(parseFragment(article)),
    expected = Array.from(
      { length: 29 },
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
  "fr-contracts-d":
    "628b08de2b561735e931bb386ddbf36c34dc56f6218c0aa0ce617c7d8af4d63a",
  "fr-contracts-m":
    "9fb34fdcc9e66835001afaa25be59f7c181acb7e9fcbdeb75ae1f243ff48cbe4",
  "fr-liquidity-d":
    "25023112dc0f55a4ae04773beae5a6e756c91be0bd5fe531fe08f1f4c90433b1",
  "fr-liquidity-m":
    "c9ed60eb3ae9cb531f1abff5a6e05237bbfb2e5087cc74b373bd8481c7c53439",
  "fr-athene-d":
    "0e2d5eb64e91598ed901a9aedd112b4ecfc0e396c2ed60376619513493cd6776",
  "fr-athene-m":
    "090b1c52945d95a046db40f2cc569e2753e9718ee95ff6db51ca989ec3db5891",
  "fr-kkr-d":
    "e2c17146899dcf36550b70f74967efef45048d05c5d6c0dcad5d5ac142171cd3",
  "fr-kkr-m":
    "d27ea8bd68631042cbcbbd6207f85ccd4af43992ed6e1e9e6bf53ada4de61027",
  "en-contracts-d":
    "a4b8784581d14e260befa7e2dca9f632800b0c82122b404e3ee08b0295f84c1a",
  "en-contracts-m":
    "282f0af245b042b61aa96a2d6cdec26c5ee6bb3bdc19d206b9bef182c7780984",
  "en-liquidity-d":
    "a71f859e7ff1a05d2609756b95302fe774be91537f3e9c94690f35b6cfd70a87",
  "en-liquidity-m":
    "4ff9842211688fa355a11d1a856b7bf1c756cce7fbb8f7950fa68fe99769f119",
  "en-athene-d":
    "dfa4050796886d35a1cf8284a6cdbfe3dd6e862257ac1fda03ac9e60b32914ae",
  "en-athene-m":
    "55af05572d8c9b5931aa2f703f6009e0ca8566f82e5363b16f6c60e9b7933eb0",
  "en-kkr-d":
    "c2f72fd0abe2144616bc0973ae72bbc1bc8fc9c2f1e5b20903cd98b1bbba0a94",
  "en-kkr-m":
    "e8fb2a41bd13e56d5dd6f1baccb2a6d749cb75179e53a8cf42dd77fe8db94905",
};
