import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { parse, serializeOuter } from "parse5";
import { INSURANCE_RISK_KINDS } from "../src/lib/insuranceRiskFigures.mjs";
import {
  assertInsuranceRiskRenderedFaithful,
  assertInsuranceRiskArticleReferences,
} from "./insurance-risk-svg-assertions.mjs";
const all = (n) => [n, ...(n.childNodes ?? []).flatMap(all)],
  attrs = (n) =>
    Object.fromEntries((n.attrs ?? []).map((a) => [a.name, a.value])),
  has = (n, c) => (attrs(n).class ?? "").split(" ").includes(c);
const pages = [
  ["fr", "posts/assureurs-fonds-06-traitement-risque"],
  ["en", "en/analysis/insurers-asset-managers-06-risk-treatment"],
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
      (n) => n.tagName === "figure" && has(n, "insurance-risk-figure"),
    );
  assert.equal(figs.length, 4);
  assertInsuranceRiskArticleReferences(html);
  const ids = nodes.map((n) => attrs(n).id).filter(Boolean);
  assert.equal(ids.length, new Set(ids).size);
  for (const [i, f] of figs.entries()) {
    assert.equal(attrs(f).id, `figure-${i + 1}`);
    assert.equal(attrs(f)["data-kind"], INSURANCE_RISK_KINDS[i]);
    const descendants = all(f),
      svgs = descendants.filter((n) => n.tagName === "svg");
    assert.equal(svgs.length, 2);
    for (const [j, n] of svgs.entries())
      assertInsuranceRiskRenderedFaithful(
        serializeOuter(n),
        lang,
        INSURANCE_RISK_KINDS[i],
        Boolean(j),
      );
    for (const c of [
      "insurance-risk-panel",
      "insurance-risk-desktop",
      "insurance-risk-mobile",
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
    (n) => n.tagName === "svg" && has(n, "l0g-insurance-risk-svg"),
  );
  assert.ok(first);
  const { startOffset, endOffset } = first.sourceCodeLocation,
    old = html.slice(startOffset, endOffset),
    changed = change(old);
  assert.notEqual(changed, old);
  return html.slice(0, startOffset) + changed + html.slice(endOffset);
}
test("compiled pages retain sixteen complete native responsive mechanisms, methods and source records", () => {
  for (const p of pages) checkPage(p.html, p.lang);
});
test("compiled label, range, source, sizing, semantic theme and accessible text mutations fail closed", () => {
  const p = pages[0];
  for (const change of [
    (s) => s.replace("23.10.2026", "24.10.2026"),
    (s) => s.replace("width:100%;height:auto", "width:1200px;height:auto"),
    (s) => s.replace('viewBox="0 0 1000 780"', 'viewBox="0 0 1000 782"'),
    (s) => s.replace('fill="var(--color-signal)"', 'fill="var(--color-amber)"'),
    (s) => s.replace('href="#source-s02"', 'href="#source-s17"'),
    (s) => s.replace("20–40 M£", "20–60 M£"),
    (s) => s.replace("Réassurance : le calcul PRA", "Titre modifié"),
  ])
    assert.throws(() => checkPage(mutateFigure(p.html, change), p.lang));
  assert.throws(() =>
    checkPage(p.html.replace('id="source-s17"', 'id="source-s30"'), p.lang),
  );
});
