import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { parseFragment } from "parse5";
import { readFileSync } from "node:fs";
import { XMLParser, XMLValidator } from "fast-xml-parser";
import opentype from "@shuding/opentype.js";
import {
  INSURANCE_AFFILIATED_KINDS,
  insuranceAffiliatedSvg,
  INSURANCE_AFFILIATED_SOURCES,
} from "../src/lib/insuranceAffiliatedFigures.mjs";
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
export function inspectInsuranceAffiliatedSvg(svg) {
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
  assert.equal(a.class, "l0g-insurance-affiliated-svg");
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
          /^insurance-aff-(?:fr|en)-f[1-5]-(?:d|m)-[a-z0-9.-]+$/u,
        );
      if (k === "font-family") assert.equal(v, "l0g Insurance Affiliated");
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
export function assertInsuranceAffiliatedGeometry(svg) {
  const { root, all } = inspectInsuranceAffiliatedSvg(svg),
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

export function assertInsuranceAffiliatedQuantitative(svg, figure) {
  const { root, all } = inspectInsuranceAffiliatedSvg(svg),
    a = attrs(root),
    mobile = a.viewBox.startsWith("0 0 600 "),
    prefix = a["aria-labelledby"].split(" ")[0].slice(0, -6),
    labels = all
      .filter((n) => tag(n) === "text")
      .map(content)
      .join(" "),
    desc = content(all.find((n) => tag(n) === "desc"));
  const find = (id) => {
    const n = all.find((n) => attrs(n).id === `${prefix}-${id}`);
    assert.ok(n, id);
    return attrs(n);
  };
  const near = (v, e) =>
    assert.ok(Math.abs(Number(v) - e) < 0.002, `${v} != ${e}`);
  assert.deepEqual(
    all.filter((n) => tag(n) === "a").map((n) => attrs(n).href),
    INSURANCE_AFFILIATED_SOURCES[figure - 1]
      .split(" ")
      .map((s) => "#source-s" + s),
  );
  assert.match(labels, /23\.10\.2026/u);
  assert.equal(
    all.filter((n) => tag(n) === "text" && content(n) === ",").length,
    INSURANCE_AFFILIATED_SOURCES[figure - 1].split(" ").length - 1,
    "Multiple references retain visible comma separators outside the anchors",
  );
  if (figure === 1) {
    const values = [24778, 8468, 7061, 3718],
      start = mobile ? 24 : 470,
      len = mobile ? 552 : 506;
    values.forEach((v, i) => {
      const b = find("share-" + i),
        t = find("track-" + i);
      near(b.x, start);
      near(b.y, mobile ? 350 + i * 105 : 335 + i * 68);
      near(b.width, (v / 44025) * len);
      near(b.height, 24);
      near(t.x, start);
      near(t.width, len);
      assert.equal(b.fill, `var(--color-${i === 0 ? "signal" : "topic-blue"})`);
      assert.equal(b.stroke, "none");
    });
    for (const n of [
      "314 090",
      "44 025",
      "24 778",
      "8 468",
      "7 061",
      "3 718",
      "70 616",
    ])
      assert.ok(
        (labels + " " + desc).includes(n) ||
          (labels + " " + desc).includes(n.replaceAll(" ", ",")),
        n,
      );
    assert.match(labels, /14[.,]0/u);
    assert.match(desc, /non-GAAP/u);
    assert.match(desc, /non affilié|unaffiliated/u);
    assert.match(desc, /valorisation|valuation/u);
    assert.match(desc, /generally|généralement/u);
  }
  if (figure === 2) {
    for (const id of ["seller", "buyer", "contributor", "recipient"]) find(id);
    for (const value of [
      "2024",
      "2026",
      "555",
      "353",
      "908",
      "247",
      "DCIF",
      "KPPA",
    ])
      assert.ok((labels + " " + desc).includes(value), value);
    assert.match(desc, /fair value|juste valeur/u);
    assert.match(
      desc,
      /settlement method not detailed|mode de règlement non détaillé/u,
    );
    assert.match(desc, /capital/u);
  }
  if (figure === 3) {
    find("lender");
    find("borrower");
    const bws = find("bws"),
      angi = find("angi");
    assert.ok(
      Number(angi.x) > Number(bws.x) &&
        Number(angi.y) > Number(bws.y) &&
        Number(angi.x) + Number(angi.width) <
          Number(bws.x) + Number(bws.width) &&
        Number(angi.y) + Number(angi.height) <
          Number(bws.y) + Number(bws.height),
      "ANGI is included within the BWS reporting scope",
    );
    const x0 = mobile ? 100 : 130,
      x1 = mobile ? 500 : 870,
      t = find("timeline");
    near(t.x1, x0);
    near(t.x2, x1);
    for (let i = 0; i < 3; i++)
      near(find("date-" + i).x1, x0 + ((x1 - x0) * i) / 2);
    for (const value of ["450", "2026", "2031", "2036"])
      assert.ok(labels.includes(value), value);
    assert.match(labels, /6[.,]33/u);
    assert.match(labels, /4[.,]1/u);
    assert.match(labels, /3[.,]8/u);
    assert.match(desc, /non-recourse|sans recours/u);
    assert.match(desc, /net cash|apport net/u);
    assert.match(desc, /collateral|sûretés/u);
    assert.match(desc, /7 May 2031|7 mai 2031/u);
    assert.match(desc, /7 May 2036|7 mai 2036/u);
  }
  if (figure === 4) {
    find("ahl");
    find("agm");
    for (let i = 0; i < 3; i++) find("view-" + i);
    const b = find("drawn"),
      t = find("capacity"),
      len = mobile ? 552 : 952;
    near(b.x, 24);
    near(b.y, mobile ? 365 : 343);
    near(b.width, (len * 279) / 500);
    near(b.height, 28);
    near(t.x, 24);
    near(t.width, len);
    assert.equal(b.fill, "var(--color-signal)");
    for (const n of ["279", "221", "500", "0", "13.12.2028"])
      assert.ok(labels.includes(n), n);
    assert.match(desc, /unsecured|non garanti/u);
    assert.match(labels, /AHL → AGM : non garanti|AHL → AGM: unsecured/u);
    assert.match(labels, /221 non utilisés|221 undrawn/u);
    assert.match(desc, /mid-term|moyen terme/u);
    assert.match(desc, /contract remains|contrat .* demeure/u);
    assert.match(desc, /44,025|44 025/u);
  }
  if (figure === 5) {
    const len = mobile ? 552 : 952,
      credit = find("credit-share"),
      other = find("other-share"),
      track = find("share-track");
    near(track.x, 24);
    near(track.width, len);
    near(credit.x, 24);
    near(credit.width, len * 0.28);
    near(other.x, 24 + len * 0.28);
    near(other.width, len * 0.72);
    assert.equal(credit.fill, "var(--color-topic-blue)");
    assert.equal(other.fill, "var(--color-signal)");
    for (let i = 0; i < 4; i++) find("schedule-" + i);
    for (const n of [
      "2025",
      "321",
      "322",
      "28",
      "72",
      "5",
      "D · 1 · 1",
      "D · 1 · 2",
      "BA",
      "DA",
    ])
      assert.ok(labels.includes(n), n);
    assert.match(desc, /rounded|arrondi/u);
    assert.match(desc, /all US life insurers|ensemble des assureurs-vie/u);
    assert.match(desc, /calculated 72% complement|72 %, complément calculé/u);
    assert.match(desc, /seniority|rang/u);
  }
  const expected =
    figure === 2
      ? ["sale", "consideration", "contribution"]
      : figure === 3
        ? ["principal", "interest"]
        : figure === 4
          ? ["parent-loan"]
          : [];
  const arrows = all.filter((n) => attrs(n)["marker-end"]);
  assert.deepEqual(
    arrows.map((n) => attrs(n).id),
    expected.map((id) => `${prefix}-${id}`),
  );
  for (const n of arrows) {
    const ar = attrs(n),
      id = ar.id.slice(prefix.length + 1),
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
    const points = pathPoints(ar.d),
      first = points[0],
      last = points.at(-1);
    assert.ok(Math.abs(last[0] - first[0]) > 20);
    if (["consideration", "interest"].includes(id))
      assert.ok(last[0] < first[0]);
    else assert.ok(last[0] > first[0]);
    assert.equal(
      ar["stroke-dasharray"],
      id === "consideration" ? "8 7" : undefined,
    );
    for (const shape of all
      .slice(all.indexOf(n) + 1)
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
export const insuranceAffiliatedScenes = () =>
  ["fr", "en"].flatMap((lang) =>
    INSURANCE_AFFILIATED_KINDS.flatMap((kind, i) =>
      [false, true].map((mobile) => ({
        lang,
        kind,
        figure: i + 1,
        mobile,
        svg: insuranceAffiliatedSvg(lang, kind, mobile),
      })),
    ),
  );
export function assertInsuranceAffiliatedSourceFaithful(
  svg,
  lang,
  kind,
  mobile,
) {
  inspectInsuranceAffiliatedSvg(svg);
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
export function assertInsuranceAffiliatedRenderedFaithful(
  svg,
  lang,
  kind,
  mobile,
) {
  const original = insuranceAffiliatedSvg(lang, kind, mobile);
  assertInsuranceAffiliatedSourceFaithful(original, lang, kind, mobile);
  assertInsuranceAffiliatedGeometry(svg);
  assertInsuranceAffiliatedQuantitative(
    svg,
    INSURANCE_AFFILIATED_KINDS.indexOf(kind) + 1,
  );
  assert.deepEqual(
    projection(parseFragment(svg)),
    projection(parseFragment(original)),
    "Complete native SVG survives Astro compilation",
  );
  return true;
}
export function assertInsuranceAffiliatedArticleReferences(article) {
  const all = htmlNodes(parseFragment(article)),
    expected = Array.from(
      { length: 27 },
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
  "fr-exposures-d":
    "185deeb517f7e6d1423ed7f1a191d25a81aec24336ccd7ccaa12aa7497012634",
  "fr-exposures-m":
    "b42c771f3523ecc7839d6343cc48c65a44d9fb50bbf5c1a7a810d63facf543b4",
  "fr-transfers-d":
    "7cac5398b294fb9b5299a231d6d48261b9e6a848eca9305ff974a76f60acdd3b",
  "fr-transfers-m":
    "cc950a3ff1bf8c74dcd7011bc96f1f9721c47a8654b53192d9d52bb58c236dd1",
  "fr-loan-d":
    "5f8f6cefda915aa86878fdb09e13f7b1130a72c63dd91e8bcdef2e566b56746d",
  "fr-loan-m":
    "a8421286d993054e0adfd7a3a8d7bd496f2bc92e4f95966ec46d4493e3e9b993",
  "fr-holding-d":
    "9990df4ab6ae1d5dc64f214ba66f07b4eecd30f4227361d4395c5df21985569d",
  "fr-holding-m":
    "e4ea11084045412cd4268ab3b8866d404cc427d5a03ea220d7a75590edb00f54",
  "fr-sector-d":
    "ad63c8a657ba1dc9b1ab456e327638225111dbf2616a8b4a8aef1f4fcae61fb4",
  "fr-sector-m":
    "5938e617ed64ffdc8b6800a0466a453d352ac15c646ce36d720d35a8d8b6271f",
  "en-exposures-d":
    "29f5c4b8384ed8c682b35df1a3aac9051836c8c41f218336e15ef39559382644",
  "en-exposures-m":
    "f09cadc2ac40989496d8784d7cbdefa77c120a0f0b52eee13b40d68e2f1981c9",
  "en-transfers-d":
    "2259288290e8d3d0287715796ae86bbe0e17887b3a7640e5c95c9c480151f823",
  "en-transfers-m":
    "667cfb98afad697391a6b9229959e98b03246e1937650f83cc66fa6ffe8318c8",
  "en-loan-d":
    "6181efd9c176f5bb4a8aa40a61adc85f5d628bc618d457dd792e66d5d8decb15",
  "en-loan-m":
    "67dfe40ee1a9057d3b8171ef5b35ea3e854740c429d38336ee6374967fcdaefe",
  "en-holding-d":
    "90a2a421ee03a3765c7dc4e41a3e1c92fd64ce5789dc36ddd6ce5bb5eddcd7dd",
  "en-holding-m":
    "7c417cf7e057b734bcc97b66a8b250f8be542cf21aa29cdca005841836cf4bf9",
  "en-sector-d":
    "4d55b8d4dd1bebffae4a718e74cb10c8428cfeee37a8d45631a95e37827d6c2e",
  "en-sector-m":
    "2c99a18c6c729d64f9c35b8d1d162db6d287aaff9bed0042e95f5e70c083e8ad",
};
