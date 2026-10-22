function timestamp(value) {
  return value instanceof Date ? value.getTime() : Date.parse(value);
}

// Publication feeds must not be reordered by later editorial maintenance.
export function sortPostsByPublicationDate(posts) {
  return [...posts].sort((left, right) => {
    const byPublicationDate = timestamp(right.data.pubDate) - timestamp(left.data.pubDate);
    return byPublicationDate || left.id.localeCompare(right.id);
  });
}

/**
 * Only an explicit homepage promotion can resurface a revised article.
 * @template {{ id: string, data: { pubDate: Date | string, homeFeaturedDate?: Date | string } }} T
 * @param {readonly T[]} posts
 * @returns {T | null}
 */
export function selectHomeFeaturedPost(posts) {
  return [...posts].sort((left, right) => {
    const leftFeatured = Math.max(timestamp(left.data.pubDate), timestamp(left.data.homeFeaturedDate ?? left.data.pubDate));
    const rightFeatured = Math.max(timestamp(right.data.pubDate), timestamp(right.data.homeFeaturedDate ?? right.data.pubDate));
    const byFeaturedDate = rightFeatured - leftFeatured;
    if (byFeaturedDate !== 0) return byFeaturedDate;

    const byPublicationDate = timestamp(right.data.pubDate) - timestamp(left.data.pubDate);
    return byPublicationDate || left.id.localeCompare(right.id);
  })[0] ?? null;
}

export function sortPostsByLatestDate(posts) {
  return [...posts].sort((left, right) => {
    const leftLatest = left.data.updatedDate ?? left.data.pubDate;
    const rightLatest = right.data.updatedDate ?? right.data.pubDate;
    const byLatestDate = timestamp(rightLatest) - timestamp(leftLatest);

    if (byLatestDate !== 0) return byLatestDate;

    const byPublicationDate = timestamp(right.data.pubDate) - timestamp(left.data.pubDate);
    return byPublicationDate || left.id.localeCompare(right.id);
  });
}
