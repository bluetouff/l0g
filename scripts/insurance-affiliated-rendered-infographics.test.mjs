import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { parse, serializeOuter } from "parse5";
import { INSURANCE_AFFILIATED_KINDS } from "../src/lib/insuranceAffiliatedFigures.mjs";
import {
  assertInsuranceAffiliatedRenderedFaithful,
  assertInsuranceAffiliatedArticleReferences,
} from "./insurance-affiliated-svg-assertions.mjs";
const all = (n) => [n, ...(n.childNodes ?? []).flatMap(all)],
  attrs = (n) =>
    Object.fromEntries((n.attrs ?? []).map((a) => [a.name, a.value])),
  has = (n, c) => (attrs(n).class ?? "").split(" ").includes(c);
const pages = [
  ["fr", "posts/assureurs-placements-apparentes-apollo-brookfield-kkr"],
  ["en", "en/analysis/insurers-affiliated-investments-apollo-brookfield-kkr"],
].map(([lang, path]) => ({
  lang,
  html: readFileSync(
    new URL(`../dist/${path}/index.html`, import.meta.url),
    "utf8",
  ),
}));
function checkPage(html, lang) {
  const nodes = all(parse(html)),
    figs = nodes.filter(
      (n) => n.tagName === "figure" && has(n, "insurance-affiliated-figure"),
    );
  assert.equal(figs.length, 5);
  assertInsuranceAffiliatedArticleReferences(html);
  const ids = nodes.map((n) => attrs(n).id).filter(Boolean);
  assert.equal(ids.length, new Set(ids).size);
  for (const [i, f] of figs.entries()) {
    assert.equal(attrs(f).id, `figure-${i + 1}`);
    assert.equal(attrs(f)["data-kind"], INSURANCE_AFFILIATED_KINDS[i]);
    const descendants = all(f),
      svg = descendants.filter((n) => n.tagName === "svg");
    assert.equal(svg.length, 2);
    for (const [j, n] of svg.entries())
      assertInsuranceAffiliatedRenderedFaithful(
        serializeOuter(n),
        lang,
        INSURANCE_AFFILIATED_KINDS[i],
        Boolean(j),
      );
    for (const c of [
      "insurance-affiliated-panel",
      "insurance-affiliated-desktop",
      "insurance-affiliated-mobile",
    ])
      assert.equal(
        descendants.filter((n) => n.tagName === "div" && has(n, c)).length,
        1,
      );
    for (const t of ["figcaption", "details", "summary"])
      assert.equal(descendants.filter((n) => n.tagName === t).length, 1);
  }
  return true;
}
function mutateFigure(html, change) {
  const first = all(parse(html, { sourceCodeLocationInfo: true })).find(
    (n) => n.tagName === "svg" && has(n, "l0g-insurance-affiliated-svg"),
  );
  assert.ok(first);
  const { startOffset, endOffset } = first.sourceCodeLocation,
    old = html.slice(startOffset, endOffset),
    changed = change(old);
  assert.notEqual(changed, old);
  return html.slice(0, startOffset) + changed + html.slice(endOffset);
}
test("compiled bilingual pages retain all twenty complete responsive native scenes, methods and source records", () => {
  for (const p of pages) checkPage(p.html, p.lang);
});
test("rendered labels, sizing, data, reference identity and accessible text regressions are detected", () => {
  const p = pages[0];
  for (const change of [
    (s) => s.replace("23.10.2026", "24.10.2026"),
    (s) => s.replace("width:100%;height:auto", "width:1200px;height:auto"),
    (s) => s.replace('viewBox="0 0 1000 740"', 'viewBox="0 0 1000 742"'),
    (s) => s.replace('fill="var(--color-signal)"', 'fill="var(--color-amber)"'),
    (s) => s.replace('href="#source-s01"', 'href="#source-s02"'),
    (s) =>
      s.replace(
        "Athene : les actifs apparentés et leurs périmètres",
        "Titre modifié",
      ),
  ]) {
    const changed = mutateFigure(p.html, change);
    assert.throws(() => checkPage(changed, p.lang));
  }
  assert.throws(() =>
    checkPage(p.html.replace('id="source-s27"', 'id="source-s28"'), p.lang),
  );
});
