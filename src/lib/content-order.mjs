function timestamp(value) {
  return value instanceof Date ? value.getTime() : Date.parse(value);
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
