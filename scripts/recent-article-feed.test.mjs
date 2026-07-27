import assert from "node:assert/strict";
import test from "node:test";
import {
  RECENT_ARTICLE_MAX,
  RECENT_ARTICLE_TARGET,
  selectRecentArticles,
} from "../src/lib/recent-article-feed.mjs";

function article(index, date) {
  return {
    canonicalId: `article:${String(index).padStart(5, "0")}`,
    date,
  };
}

test("la veille reste bornée avec dix mille articles historiques", () => {
  const corpus = Array.from({ length: 10_000 }, (_, index) => {
    const date = new Date(Date.UTC(2026, 6, 27 - index));
    return article(index, date.toISOString().slice(0, 10));
  });

  const selected = selectRecentArticles(corpus.reverse());

  assert.equal(selected.length, RECENT_ARTICLE_TARGET);
  assert.equal(selected[0].date, "2026-07-27");
  assert.equal(selected.at(-1).date, "2025-11-14");
});

test("la journée limite reste entière", () => {
  const recent = Array.from({ length: 255 }, (_, index) => {
    const date = new Date(Date.UTC(2026, 6, 27 - index));
    return article(index, date.toISOString().slice(0, 10));
  });
  const cutoffDay = "2025-11-14";
  const sameDay = Array.from({ length: 30 }, (_, index) =>
    article(1_000 + index, cutoffDay),
  );
  const older = article(2_000, "2025-11-13");

  const selected = selectRecentArticles([older, ...sameDay, ...recent]);

  assert.equal(selected.length, 285);
  assert.equal(selected.at(-1).date, cutoffDay);
  assert.equal(
    selected.filter((entry) => entry.date === cutoffDay).length,
    30,
  );
});

test("une journée démesurée échoue au lieu de rendre le flux non borné", () => {
  const sameDay = Array.from(
    { length: RECENT_ARTICLE_MAX + 1 },
    (_, index) => article(index, "2026-07-27"),
  );

  assert.throws(
    () => selectRecentArticles(sameDay),
    /dépasse 512 articles/,
  );
});
