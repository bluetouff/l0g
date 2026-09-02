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
