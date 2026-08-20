export type PaginationItem =
  | { type: 'page'; page: number }
  | { type: 'gap'; key: `gap-${number}-${number}` };

const WINDOW_SIZE = 5;

/**
 * Keeps archive navigation bounded even when the collection has thousands of
 * pages: five nearby pages at most, plus the first and last page.
 */
export function buildPaginationItems(currentPage: number, totalPages: number): PaginationItem[] {
  if (!Number.isInteger(currentPage) || !Number.isInteger(totalPages) || totalPages < 1 || currentPage < 1 || currentPage > totalPages) {
    throw new Error(`Invalid pagination state: page ${currentPage} of ${totalPages}.`);
  }

  if (totalPages <= WINDOW_SIZE + 2) {
    return Array.from({ length: totalPages }, (_, index) => ({ type: 'page' as const, page: index + 1 }));
  }

  const visible = new Set<number>([1, totalPages]);

  if (currentPage <= WINDOW_SIZE - 1) {
    for (let page = 2; page <= WINDOW_SIZE; page += 1) visible.add(page);
  } else if (currentPage >= totalPages - (WINDOW_SIZE - 2)) {
    for (let page = totalPages - (WINDOW_SIZE - 1); page < totalPages; page += 1) visible.add(page);
  } else {
    for (let page = currentPage - 1; page <= currentPage + 1; page += 1) visible.add(page);
  }

  const pages = [...visible].sort((left, right) => left - right);
  const items: PaginationItem[] = [];

  for (const [index, page] of pages.entries()) {
    const previous = pages[index - 1];
    if (previous && page - previous > 1) items.push({ type: 'gap', key: `gap-${previous}-${page}` });
    items.push({ type: 'page', page });
  }

  return items;
}
