import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { parse, serializeOuter } from "parse5";
import {
  INSURANCE_PROMISE_KINDS,
  INSURANCE_PROMISE_SOURCES,
} from "../src/lib/insurancePromiseFigures.mjs";
import {
  assertInsurancePromiseRenderedFaithful,
  assertInsurancePromiseArticleReferences,
} from "./insurance-promise-svg-assertions.mjs";
const all = (n) => [n, ...(n.childNodes ?? []).flatMap(all)],
  attrs = (n) =>
    Object.fromEntries((n.attrs ?? []).map((a) => [a.name, a.value])),
  has = (n, c) => (attrs(n).class ?? "").split(" ").includes(c);
const pages = [
  ["fr", "posts/assureurs-fonds-08-solidite-promesse"],
  ["en", "en/analysis/insurers-asset-managers-08-promise"],
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
      (n) => n.tagName === "figure" && has(n, "insurance-promise-figure"),
    );
  assert.equal(figs.length, 3);
  assertInsurancePromiseArticleReferences(html);
  const ids = nodes.map((n) => attrs(n).id).filter(Boolean);
  assert.equal(ids.length, new Set(ids).size);
  for (const [i, f] of figs.entries()) {
    assert.equal(attrs(f).id, `figure-${i + 1}`);
    assert.equal(attrs(f)["data-kind"], INSURANCE_PROMISE_KINDS[i]);
    const descendants = all(f),
      svgs = descendants.filter((n) => n.tagName === "svg");
    assert.equal(svgs.length, 2);
    for (const [j, n] of svgs.entries())
      assertInsurancePromiseRenderedFaithful(
        serializeOuter(n),
        lang,
        INSURANCE_PROMISE_KINDS[i],
        Boolean(j),
      );
    for (const c of [
      "insurance-promise-panel",
      "insurance-promise-desktop",
      "insurance-promise-mobile",
    ])
      assert.equal(
        descendants.filter((n) => n.tagName === "div" && has(n, c)).length,
        1,
      );
    const sourceLinks = descendants.filter(
      (n) => n.tagName === "a" && (attrs(n).href ?? "").startsWith("#source-s"),
    );
    assert.deepEqual(
      sourceLinks.map((n) => attrs(n).href),
      INSURANCE_PROMISE_SOURCES[i].split(" ").map((id) => `#source-s${id}`),
    );
    for (const t of ["figcaption", "details", "summary"])
      assert.equal(descendants.filter((n) => n.tagName === t).length, 1);
  }
  return true;
}
function mutateFigure(html, change) {
  const first = all(parse(html, { sourceCodeLocationInfo: true })).find(
    (n) => n.tagName === "svg" && has(n, "l0g-insurance-promise-svg"),
  );
  assert.ok(first);
  const { startOffset, endOffset } = first.sourceCodeLocation,
    old = html.slice(startOffset, endOffset),
    changed = change(old);
  assert.notEqual(changed, old);
  return html.slice(0, startOffset) + changed + html.slice(endOffset);
}
test("compiled pages retain twelve complete native responsive mechanisms, methods and source records", () => {
  for (const p of pages) checkPage(p.html, p.lang);
});
test("compiled labels, geometry, sources, theme and accessible text mutations fail closed", () => {
  const p = pages[0];
  for (const change of [
    (s) => s.replace("24.10.2026", "25.10.2026"),
    (s) => s.replace("width:100%;height:auto", "width:1200px;height:auto"),
    (s) => s.replace('viewBox="0 0 1000 790"', 'viewBox="0 0 1000 782"'),
    (s) => s.replace('fill="var(--color-signal)"', 'fill="var(--color-amber)"'),
    (s) => s.replace("MaxRate 5", "MaxRate 6"),
    (s) => s.replace("Groupes et assureurs signataires", "Titre modifié"),
  ])
    assert.throws(() => checkPage(mutateFigure(p.html, change), p.lang));
  for (const [from, to] of [
    ['id="source-s51"', 'id="source-s19"'],
    ['href="#source-s51"', 'href="#source-s50"'],
    ["<summary>", "<aside>"],
  ])
    assert.throws(() => checkPage(p.html.replaceAll(from, to), p.lang));
});
