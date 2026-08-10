import assert from "node:assert/strict";
import test from "node:test";
import { sortPostsByLatestDate } from "../src/lib/content-order.mjs";

function post(id, pubDate, updatedDate) {
  return {
    id,
    data: {
      pubDate: new Date(pubDate),
      updatedDate: updatedDate ? new Date(updatedDate) : undefined,
    },
  };
}

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
