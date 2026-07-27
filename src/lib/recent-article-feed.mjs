export const RECENT_ARTICLE_TARGET = 256;
export const RECENT_ARTICLE_MAX = 512;

export function selectRecentArticles(articles) {
  const sorted = [...articles].sort((left, right) => {
    const byDate = Date.parse(right.date) - Date.parse(left.date);
    return byDate || left.canonicalId.localeCompare(right.canonicalId);
  });
  if (
    sorted.some(
      (article) =>
        typeof article.canonicalId !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(article.date) ||
        Number.isNaN(Date.parse(`${article.date}T12:00:00.000Z`)),
    )
  ) {
    throw new TypeError("Article récent invalide.");
  }
  const cutoff =
    sorted.length > RECENT_ARTICLE_TARGET
      ? sorted[RECENT_ARTICLE_TARGET - 1].date
      : null;
  const selected = cutoff
    ? sorted.filter((article) => article.date >= cutoff)
    : sorted;
  if (selected.length > RECENT_ARTICLE_MAX) {
    throw new Error(
      `Le flux récent dépasse ${RECENT_ARTICLE_MAX} articles après extension de la journée limite.`,
    );
  }
  return selected;
}
