export const PUBLICATIONS_PER_PAGE = 6;

// Preserve the catalogue's editorial order. English editions use the same order
// while omitting books that are available only in French.
export const publicationCatalog = /** @type {const} */ ([
  { id: 'encryption-backdoor', english: true },
  { id: 'ordinary-machines', english: true },
  { id: 'cumcum', english: true },
  { id: 'insurance-promise', english: true },
  { id: 'cyber-recovery', english: true },
  { id: 'debt-chain', english: true },
  { id: 'microsoft', english: true },
  { id: 'reserves', english: true },
  { id: 'ai-slowdown', english: true },
  { id: 'ia-recouvrement', english: true },
  { id: 'commerce-traces', english: false },
  { id: 'scpi', english: true },
  { id: 'oil-trading', english: true },
  { id: 'digital-identity', english: false },
  { id: 'e-invoicing', english: true },
  { id: 'water-electricity', english: true },
  { id: 'digital-euro', english: true },
  { id: 'epstein', english: true },
  { id: 'auditer-opacite', english: false },
]);

/** @param {'fr' | 'en'} lang */
export function publicationEntries(lang) {
  if (lang !== 'fr' && lang !== 'en') throw new TypeError('Unsupported publication language');
  return publicationCatalog.filter((entry) => lang === 'fr' || entry.english);
}

/** @param {'fr' | 'en'} lang @param {number} [currentPage] */
export function publicationPage(lang, currentPage = 1) {
  const entries = publicationEntries(lang);
  const totalPages = Math.max(1, Math.ceil(entries.length / PUBLICATIONS_PER_PAGE));
  if (!Number.isInteger(currentPage) || currentPage < 1 || currentPage > totalPages) {
    throw new RangeError('Invalid publication page');
  }
  const start = (currentPage - 1) * PUBLICATIONS_PER_PAGE;
  return {
    items: entries.slice(start, start + PUBLICATIONS_PER_PAGE),
    currentPage,
    totalPages,
    total: entries.length,
    start: start + 1,
    end: Math.min(start + PUBLICATIONS_PER_PAGE, entries.length),
  };
}

/** @param {'fr' | 'en'} lang @param {number} page */
export function publicationPageHref(lang, page) {
  if (lang !== 'fr' && lang !== 'en') throw new TypeError('Unsupported publication language');
  if (!Number.isInteger(page) || page < 1) throw new RangeError('Invalid publication page');
  const base = lang === 'en' ? '/en/publications/' : '/publications/';
  return page === 1 ? base : `${base}page/${page}/`;
}
