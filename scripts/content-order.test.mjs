import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { sortPostsByLatestDate, sortPostsByPublicationDate } from "../src/lib/content-order.mjs";

function post(id, pubDate, updatedDate) {
  return {
    id,
    data: {
      pubDate: new Date(pubDate),
      updatedDate: updatedDate ? new Date(updatedDate) : undefined,
    },
  };
}

test("une révision ne change ni l’ordre de publication ni le tableau source", () => {
  const posts = [
    post("older-revised", "2026-08-28T21:00:00+02:00", "2026-09-02T10:05:00+02:00"),
    post("newer", "2026-09-01T16:00:00+02:00"),
    post("latest", "2026-09-02T08:30:00+02:00"),
  ];
  assert.deepEqual(sortPostsByPublicationDate(posts).map(({ id }) => id), ["latest", "newer", "older-revised"]);
  assert.deepEqual(posts.map(({ id }) => id), ["older-revised", "newer", "latest"]);
});

test("le classement de publication compare les instants et départage les égalités", () => {
  const posts = [
    post("z-post", "2026-09-02T10:30:00+02:00"),
    post("a-post", "2026-09-02T08:30:00Z", "2026-09-03T08:30:00Z"),
    post("earlier", "2026-09-02T10:29:59+02:00"),
  ];
  assert.deepEqual(sortPostsByPublicationDate(posts).map(({ id }) => id), ["a-post", "z-post", "earlier"]);
  assert.deepEqual(sortPostsByPublicationDate([]), []);
});

const source = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("les index FR et EN classent par publication et transmettent les deux dates", () => {
  for (const path of ["src/pages/[...page].astro", "src/pages/en/analysis/index.astro", "src/pages/en/analysis/page/[page].astro"]) {
    const text = source(path);
    assert.match(text, /sortPostsByPublicationDate\(await getCollection\(/, path);
    assert.doesNotMatch(text, /sortPostsByLatestDate|updatedDate\s*\?\?\s*[^\n]*pubDate/, path);
  }
  for (const path of ["src/pages/en/analysis/index.astro", "src/pages/en/analysis/page/[page].astro"]) {
    const text = source(path);
    assert.match(text, /pubDate: p\.data\.pubDate/, path);
    assert.match(text, /updatedDate: p\.data\.updatedDate/, path);
  }
});

test("les cartes distinguent la publication des révisions strictement postérieures", () => {
  const dates = source("src/components/PublicationDates.astro");
  assert.match(dates, /datetime=\{pubDate\.toISOString\(\)\} data-article-published/);
  assert.match(dates, /updatedDate\.getTime\(\) > pubDate\.getTime\(\)/);
  assert.match(dates, /Mis à jour le/);
  assert.match(dates, /Updated/);
  assert.match(dates, /data-article-updated/);
  assert.match(dates, /timeZone: 'Europe\/Paris'/);
  for (const name of ["PostCard", "PostHero", "AnalysisList"]) {
    assert.match(source(`src/components/${name}.astro`), /<PublicationDates pubDate=\{/);
  }
});

test("une mise à jour identique est départagée par la publication la plus récente", () => {
  const sharedUpdate = "2026-08-09T21:46:15.000Z";
  const posts = [
    post("part-3", "2026-08-08T03:30:00.000Z", sharedUpdate),
    post("part-4", "2026-08-08T08:02:48.000Z", sharedUpdate),
    post("part-1", "2026-08-07T11:30:00.000Z", sharedUpdate),
    post("part-2", "2026-08-07T15:00:00.000Z", sharedUpdate),
  ];

  assert.deepEqual(
    sortPostsByLatestDate(posts).map(({ id }) => id),
    ["part-4", "part-3", "part-2", "part-1"],
  );
});

test("la date de mise à jour reste le premier critère", () => {
  const posts = [
    post("published-later", "2026-08-10T08:00:00.000Z"),
    post("updated-later", "2026-08-09T08:00:00.000Z", "2026-08-11T08:00:00.000Z"),
  ];

  assert.deepEqual(
    sortPostsByLatestDate(posts).map(({ id }) => id),
    ["updated-later", "published-later"],
  );
});

test("un identifiant stable départage les dates strictement identiques", () => {
  const date = "2026-08-10T08:00:00.000Z";
  const posts = [post("z-post", date), post("a-post", date)];

  assert.deepEqual(
    sortPostsByLatestDate(posts).map(({ id }) => id),
    ["a-post", "z-post"],
  );
});
